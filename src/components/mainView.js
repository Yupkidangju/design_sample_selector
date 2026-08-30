/**
 * Main Gallery View Component v2.1
 * Grid / Bento / Spectrum with live thumbs, draft selection, keyboard nav, peek.
 */

import { MAIN_CATEGORIES } from '../data/categories.js';
import { appState } from '../state/appState.js';
import { synthAudio } from '../audio/synthAudio.js';
import { canvasVisualEngine } from '../wasm/visualEngine.js';
import { renderPreviewThumbnail } from '../preview/thumbnailEntry.js';
import { observeThumbMotion } from './mockupRuntime.js';
import { createGalleryModel, createGalleryWindow } from './galleryModel.js';
import { renderGalleryPagination } from './galleryPagination.js';
import {
  selectDraft,
  openDetailFor,
  schedulePeek,
  cancelPeek,
  toggleCompareSlot
} from '../utils/selection.js';

export function renderMainView(container, options = {}) {
  if (!container) return () => {};

  const stateManager = options?.stateManager || appState;
  const modelFactory = typeof options?.modelFactory === 'function'
    ? options.modelFactory
    : createGalleryModel;
  const enableKeyboard = options?.enableKeyboard !== false;
  let stopThumbObserver = () => {};
  let keyboardBound = false;
  let currentPage = 1;
  let currentWindowKey = '';
  let disposed = false;

  function updateView() {
    if (disposed) return;
    const state = stateManager.getState();
    const {
      searchQuery,
      viewMode,
      bookmarks,
      galleryFocusId,
      draftSubId,
      confirmedStyleId
    } = state;
    const fullModel = modelFactory(state);
    const nextWindowKey = `${viewMode}\u0000${fullModel.resultIds.join('\u0000')}`;
    if (nextWindowKey !== currentWindowKey) {
      currentPage = 1;
      currentWindowKey = nextWindowKey;
    }
    const model = createGalleryWindow(fullModel, { page: currentPage });
    currentPage = model.window.page;

    stopThumbObserver();
    stopThumbObserver = () => {};

    if (model.entries.length === 0) {
      container.innerHTML = `
        <div class="empty-results-box">
          <div class="empty-icon">🔍</div>
          <h2 class="empty-title">일치하는 디자인 스타일이 없습니다</h2>
          <p class="empty-desc">${searchQuery
            ? `검색어 <strong>"${escapeHtml(searchQuery)}"</strong>와 현재 조건에`
            : '현재 선택된 조건에'} 부합하는 시안을 찾지 못했습니다.</p>
          <button class="empty-reset-btn" id="btn-empty-reset" type="button">전체 목록으로 초기화</button>
        </div>
      `;
      const resetBtn = container.querySelector('#btn-empty-reset');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          synthAudio.playSfx('CLICK');
          stateManager.setState({
            searchQuery: '',
            activeFilter: 'ALL',
            activeFacets: {},
            sortMode: 'catalog',
            bookmarkFilterActive: false
          });
          document.getElementById('search-input')?.focus({ preventScroll: true });
        });
      }
      return;
    }

    let contentHtml = '';
    if (viewMode === 'BENTO') {
      contentHtml = renderBentoModeHTML(model.entries, bookmarks, { galleryFocusId, draftSubId, confirmedStyleId });
    } else if (viewMode === 'SPECTRUM') {
      contentHtml = renderSpectrumModeHTML(model.eraGroups, bookmarks, { galleryFocusId, draftSubId, confirmedStyleId });
    } else {
      contentHtml = renderStandardGridHTML(model.categories, bookmarks, { galleryFocusId, draftSubId, confirmedStyleId });
    }

    container.innerHTML = `
      <section class="gallery-wrapper view-mode-${viewMode.toLowerCase()}" data-result-count="${model.resultIds.length}">
        <p class="gallery-hint">클릭하면 하단에 담고, 더블클릭하면 자세히 봅니다. 화살표로 이동 · Enter 열기 · Space 비교 슬롯.</p>
        ${contentHtml}
        ${renderGalleryPagination(model.window)}
      </section>
    `;

    attachCardListeners(container);
    attachPaginationListeners(model.window);
    stopThumbObserver = observeThumbMotion(container);
  }

  function attachPaginationListeners(windowModel) {
    if (windowModel.pageCount <= 1) return;
    container.querySelectorAll('[data-gallery-page]').forEach(button => {
      button.addEventListener('click', () => {
        const direction = button.getAttribute('data-gallery-page');
        currentPage += direction === 'previous' ? -1 : 1;
        synthAudio.playSfx('CLICK');
        cancelPeek(true);
        updateView();
        container.querySelector('.gallery-page-status')?.focus({ preventScroll: true });
      });
    });
  }

  function tileStateClass(subId, flags) {
    const bits = [];
    if (flags.draftSubId === subId) bits.push('is-draft');
    if (flags.galleryFocusId === subId) bits.push('is-focused');
    if (flags.confirmedStyleId === subId) bits.push('is-confirmed');
    return bits.join(' ');
  }

  function renderStandardGridHTML(categories, bookmarks, flags) {
    let html = `<div class="category-nodes-grid">`;

    categories.forEach((cat, idx) => {
      html += `
        <article class="main-category-card motif-${cat.id}" data-cat-id="${cat.id}" style="--category-accent: ${cat.accentColor}">
          <div class="card-motif" aria-hidden="true"></div>
          <div class="card-glow-overlay"></div>

          <div class="card-header-meta">
            <span class="category-index">0${idx + 1}</span>
            <span class="category-badge-count">${cat.subCategories.length} Styles</span>
          </div>

          <div class="card-title-group">
            <div class="category-icon-wrapper">${cat.icon}</div>
            <div>
              <h2 class="category-main-title">${cat.title}</h2>
              <span class="category-en-title">${cat.titleEn}</span>
            </div>
          </div>

          <p class="category-description">${cat.description}</p>

          <div class="hover-reveal-section">
            <div class="reveal-header">
              <span class="reveal-title">파생 세부 스타일 (${cat.subCategories.length}종)</span>
              <span class="reveal-hint">타일을 고르면 도크에 담깁니다</span>
            </div>

            <div class="subcategories-badges-wrapper sub-tile-grid">
              ${cat.subCategories.map((sub) => {
                const isSaved = bookmarks.includes(sub.id);
                return `
                  <div class="subcategory-badge-row">
                    <button class="sub-tile ${tileStateClass(sub.id, flags)}"
                            data-cat-id="${cat.id}"
                            data-sub-id="${sub.id}"
                            data-result-id="${sub.id}"
                            type="button">
                      <div class="style-thumb-frame">
                        ${renderPreviewThumbnail({ thumbnailId: sub.thumbMotif, design: sub })}
                      </div>
                      <span class="badge-name">${sub.name}</span>
                      <span class="badge-en">${sub.nameEn}</span>
                    </button>
                    <button class="badge-bookmark-btn ${isSaved ? 'bookmarked' : ''}"
                            data-sub-id="${sub.id}"
                            type="button"
                            aria-label="${sub.name} ${isSaved ? '북마크 해제' : '북마크 저장'}"
                            title="${isSaved ? '북마크 해제' : '즐겨찾기 저장'}">
                      ${isSaved ? '★' : '☆'}
                    </button>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </article>
      `;
    });

    html += `</div>`;
    return html;
  }

  function renderBentoModeHTML(entries, bookmarks, flags) {
    let html = `<div class="bento-gallery-grid">`;
    entries.forEach((entry, index) => {
      const { sub, category: cat } = entry;
      const isSaved = bookmarks.includes(sub.id);
      const bentoClass = index % 5 === 0 ? 'bento-card-hero' : 'bento-card-standard';

      html += `
        <div class="bento-item-card ${bentoClass} ${tileStateClass(sub.id, flags)}"
             data-cat-id="${cat.id}"
             data-sub-id="${sub.id}"
             data-result-id="${sub.id}"
             tabindex="0"
             aria-label="${sub.name} 시안 선택"
             style="--bento-accent: ${cat.accentColor}">
          <div class="bento-card-glow"></div>
          <div class="bento-thumb-frame">
            ${renderPreviewThumbnail({ thumbnailId: sub.thumbMotif, design: sub })}
          </div>
          <div class="bento-top-row">
            <div class="bento-category-tag">
              <span>${cat.icon}</span>
              <span>${cat.title}</span>
            </div>
            <button class="bento-bookmark-toggle ${isSaved ? 'bookmarked' : ''}"
                    data-sub-id="${sub.id}"
                    type="button"
                    aria-label="${sub.name} ${isSaved ? '북마크 해제' : '북마크 저장'}"
                    title="${isSaved ? '북마크 해제' : '즐겨찾기 저장'}">
              ${isSaved ? '★' : '☆'}
            </button>
          </div>
          <div class="bento-content-body">
            <h3 class="bento-title">${sub.name}</h3>
            <p class="bento-en-title">${sub.nameEn}</p>
            <p class="bento-desc">${sub.shortDesc}</p>
          </div>
          <div class="bento-palette-strip">
            ${sub.palette.map((c) => `
              <span class="bento-color-dot" style="background-color: ${c.hex}" title="${c.name} (${c.hex})"></span>
            `).join('')}
          </div>
          <div class="bento-footer-row">
            <div class="bento-tags-list">
              ${sub.moodTags.slice(0, 2).map((tag) => `<span class="bento-tag">#${tag}</span>`).join('')}
            </div>
            <span class="bento-open-cta">담기 →</span>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    return html;
  }

  function renderSpectrumModeHTML(eraGroups, bookmarks, flags) {
    let html = `
      <div class="spectrum-stream-container">
        <div class="spectrum-timeline-axis" aria-label="현재 결과의 시대 순서">
          <span class="spectrum-axis-label">ERA SPECTRUM</span>
          <div class="spectrum-axis-nodes">
            ${eraGroups.map(group => `<span class="axis-node">${group.label.ko}</span>`).join('<span class="axis-line" aria-hidden="true"></span>')}
          </div>
        </div>
        <div class="spectrum-cards-flow">
    `;

    eraGroups.forEach((group, groupIndex) => {
      html += `
        <section class="spectrum-category-group spectrum-era-group" data-era-id="${group.id}" aria-labelledby="era-group-${group.id}">
          <div class="spectrum-group-header">
            <span class="group-icon">${String(groupIndex + 1).padStart(2, '0')}</span>
            <div class="group-titles">
              <h3 class="group-title" id="era-group-${group.id}">${group.label.ko}</h3>
              <span class="group-en">${group.label.en} · ${group.entries.length}종</span>
            </div>
          </div>
          <div class="spectrum-sub-grid">
            ${group.entries.map(({ sub, style, category: cat }) => {
              const isSaved = bookmarks.includes(sub.id);
              return `
                <div class="spectrum-card ${tileStateClass(sub.id, flags)}"
                     data-cat-id="${cat.id}"
                     data-sub-id="${sub.id}"
                     data-result-id="${sub.id}"
                     tabindex="0"
                     aria-label="${sub.name} 시안 선택"
                     style="--group-accent: ${cat.accentColor}">
                  <div class="spec-thumb-frame">
                    ${renderPreviewThumbnail({ thumbnailId: sub.thumbMotif, design: sub })}
                  </div>
                  <div class="spec-card-context">
                    <span class="spec-category-context">${cat.icon} ${cat.title}</span>
                    <span class="spec-era-context">${style.classification.era.label}</span>
                  </div>
                  <div class="spec-card-head">
                    <h4 class="spec-title">${sub.name}</h4>
                    <button class="spec-bookmark ${isSaved ? 'bookmarked' : ''}"
                            data-sub-id="${sub.id}"
                            type="button"
                            aria-label="${sub.name} ${isSaved ? '북마크 해제' : '북마크 저장'}">
                      ${isSaved ? '★' : '☆'}
                    </button>
                  </div>
                  <p class="spec-desc">${sub.shortDesc}</p>
                  <div class="spec-palette-chips">
                    ${sub.palette.map((c) => `
                      <span class="chip" style="background-color: ${c.hex}" title="${c.name} (${c.hex})"></span>
                    `).join('')}
                  </div>
                  <div class="spec-footer">
                    <span class="spec-tag">${sub.moodTags[0] || 'Design'}</span>
                    <span class="spec-cta">담기 →</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </section>
      `;
    });

    html += `</div></div>`;
    return html;
  }

  function attachCardListeners(root) {
    const clickableItems = root.querySelectorAll('.sub-tile, .bento-item-card, .spectrum-card');
    clickableItems.forEach((item) => {
      const catId = item.getAttribute('data-cat-id');
      const subId = item.getAttribute('data-sub-id');

      item.addEventListener('mouseenter', () => {
        const cat = MAIN_CATEGORIES.find((c) => c.id === catId);
        if (cat) canvasVisualEngine.setAccentColor(cat.accentColor);
        synthAudio.playSfx('HOVER');
        schedulePeek(subId);
      });

      item.addEventListener('mouseleave', () => cancelPeek());

      item.addEventListener('focus', () => {
        schedulePeek(subId, 120);
        stateManager.setState({ galleryFocusId: subId });
      });

      item.addEventListener('click', (e) => {
        if (e.target.closest('.badge-bookmark-btn, .bento-bookmark-toggle, .spec-bookmark')) return;
        selectDraft(catId, subId);
      });

      item.addEventListener('dblclick', (e) => {
        if (e.target.closest('.badge-bookmark-btn, .bento-bookmark-toggle, .spec-bookmark')) return;
        e.preventDefault();
        openDetailFor(catId, subId);
      });
    });

    const bookmarkBtns = root.querySelectorAll('.badge-bookmark-btn, .bento-bookmark-toggle, .spec-bookmark');
    bookmarkBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const subId = btn.getAttribute('data-sub-id');
        stateManager.toggleBookmark(subId);
        synthAudio.playSfx('BOOKMARK');
      });
    });

    const mainCards = root.querySelectorAll('.main-category-card');
    mainCards.forEach((card) => {
      const catId = card.getAttribute('data-cat-id');
      const catData = MAIN_CATEGORIES.find((c) => c.id === catId);
      card.addEventListener('mouseenter', () => {
        if (catData) canvasVisualEngine.setAccentColor(catData.accentColor);
      });
    });
  }

  function collectTiles() {
    return Array.from(container.querySelectorAll('.sub-tile, .bento-item-card, .spectrum-card'));
  }

  function onGalleryKey(e) {
    const state = stateManager.getState();
    if (state.currentView !== 'MAIN') return;

    const tag = document.activeElement?.tagName;
    const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

    if (e.key === '/' && !e.metaKey && !e.ctrlKey && !typing) {
      e.preventDefault();
      document.getElementById('search-input')?.focus();
      return;
    }

    if (typing) {
      if (e.key === 'Escape') document.activeElement.blur();
      return;
    }

    if (e.key === 'Escape') {
      cancelPeek(true);
      stateManager.setState({ draftSubId: null, confirmSheetOpen: false });
      return;
    }

    const tiles = collectTiles();
    if (!tiles.length) return;

    const currentId = state.galleryFocusId || state.draftSubId;
    let idx = tiles.findIndex((t) => t.getAttribute('data-sub-id') === currentId);
    if (idx < 0) idx = 0;

    const cols = Math.max(1, Math.floor(container.clientWidth / 280));

    if (e.key === 'ArrowRight') idx = Math.min(tiles.length - 1, idx + 1);
    else if (e.key === 'ArrowLeft') idx = Math.max(0, idx - 1);
    else if (e.key === 'ArrowDown') idx = Math.min(tiles.length - 1, idx + cols);
    else if (e.key === 'ArrowUp') idx = Math.max(0, idx - cols);
    else if (e.key === 'Enter') {
      const tile = tiles[idx];
      if (tile) openDetailFor(tile.getAttribute('data-cat-id'), tile.getAttribute('data-sub-id'));
      e.preventDefault();
      return;
    } else if (e.key === ' ') {
      const tile = tiles[idx];
      if (tile) {
        e.preventDefault();
        toggleCompareSlot(tile.getAttribute('data-sub-id'));
      }
      return;
    } else {
      return;
    }

    e.preventDefault();
    const next = tiles[idx];
    if (!next) return;
    next.focus();
    stateManager.setState({ galleryFocusId: next.getAttribute('data-sub-id') });
  }

  if (enableKeyboard && !keyboardBound) {
    window.addEventListener('keydown', onGalleryKey);
    keyboardBound = true;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  const unsubscribe = stateManager.subscribe((state, prevState) => {
    if (
      state.currentView !== prevState?.currentView ||
      state.viewMode !== prevState?.viewMode ||
      state.activeFilter !== prevState?.activeFilter ||
      state.searchQuery !== prevState?.searchQuery ||
      state.activeFacets !== prevState?.activeFacets ||
      state.sortMode !== prevState?.sortMode ||
      state.bookmarkFilterActive !== prevState?.bookmarkFilterActive ||
      state.bookmarks !== prevState?.bookmarks
    ) {
      if (state.currentView === 'MAIN') {
        container.style.display = 'block';
        updateView();
      } else {
        container.style.display = 'none';
        stopThumbObserver();
        stopThumbObserver = () => {};
        cancelPeek(true);
      }
    } else if (state.currentView === 'MAIN') {
      if (
        state.galleryFocusId !== prevState?.galleryFocusId ||
        state.draftSubId !== prevState?.draftSubId ||
        state.confirmedStyleId !== prevState?.confirmedStyleId
      ) {
        const tiles = collectTiles();
        tiles.forEach((t) => {
          const id = t.getAttribute('data-sub-id');
          t.classList.toggle('is-draft', state.draftSubId === id);
          t.classList.toggle('is-focused', state.galleryFocusId === id);
          t.classList.toggle('is-confirmed', state.confirmedStyleId === id);
        });
      }
    }
  });

  updateView();

  return () => {
    if (disposed) return;
    disposed = true;
    stopThumbObserver();
    unsubscribe();
    if (keyboardBound) window.removeEventListener('keydown', onGalleryKey);
  };
}
