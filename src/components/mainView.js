/**
 * Main Gallery View Component v2.1
 * Grid / Bento / Spectrum with live thumbs, draft selection, keyboard nav, peek.
 */

import { MAIN_CATEGORIES } from '../data/categories.js';
import { appState } from '../state/appState.js';
import { synthAudio } from '../audio/synthAudio.js';
import { wasmVisualEngine } from '../wasm/visualEngine.js';
import { getMockupHTML } from './mockupTemplates.js';
import { observeThumbMotion } from './mockupRuntime.js';
import {
  selectDraft,
  openDetailFor,
  schedulePeek,
  cancelPeek,
  toggleCompareSlot
} from '../utils/selection.js';

export function renderMainView(container) {
  if (!container) return;

  let stopThumbObserver = () => {};
  let keyboardBound = false;

  function updateView() {
    const { activeFilter, searchQuery, viewMode, bookmarks, bookmarkFilterActive, galleryFocusId, draftSubId, confirmedStyleId } = appState.getState();
    const query = searchQuery.trim().toLowerCase();

    const filteredCategories = [];

    MAIN_CATEGORIES.forEach((category) => {
      if (!bookmarkFilterActive && activeFilter !== 'ALL' && category.id !== activeFilter) {
        return;
      }

      const matchedSubs = category.subCategories.filter((sub) => {
        if (bookmarkFilterActive && !bookmarks.includes(sub.id)) {
          return false;
        }
        if (query) {
          const matchName = sub.name.toLowerCase().includes(query);
          const matchEn = sub.nameEn.toLowerCase().includes(query);
          const matchDesc = sub.shortDesc.toLowerCase().includes(query);
          const matchTags = sub.moodTags.some((t) => t.toLowerCase().includes(query));
          const matchCat = category.title.toLowerCase().includes(query) || category.titleEn.toLowerCase().includes(query);
          return matchName || matchEn || matchDesc || matchTags || matchCat;
        }
        return true;
      });

      if (matchedSubs.length > 0) {
        filteredCategories.push({
          ...category,
          subCategories: matchedSubs
        });
      }
    });

    stopThumbObserver();

    if (filteredCategories.length === 0) {
      container.innerHTML = `
        <div class="empty-results-box">
          <div class="empty-icon">🔍</div>
          <h2 class="empty-title">일치하는 디자인 스타일이 없습니다</h2>
          <p class="empty-desc">검색어 <strong>"${escapeHtml(searchQuery)}"</strong> 또는 선택된 필터 조건에 부합하는 시안을 찾지 못했습니다.</p>
          <button class="empty-reset-btn" id="btn-empty-reset">전체 목록으로 초기화</button>
        </div>
      `;
      const resetBtn = container.querySelector('#btn-empty-reset');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          synthAudio.playSfx('CLICK');
          appState.setState({ searchQuery: '', activeFilter: 'ALL', bookmarkFilterActive: false });
        });
      }
      return;
    }

    let contentHtml = '';
    if (viewMode === 'BENTO') {
      contentHtml = renderBentoModeHTML(filteredCategories, bookmarks, { galleryFocusId, draftSubId, confirmedStyleId });
    } else if (viewMode === 'SPECTRUM') {
      contentHtml = renderSpectrumModeHTML(filteredCategories, bookmarks, { galleryFocusId, draftSubId, confirmedStyleId });
    } else {
      contentHtml = renderStandardGridHTML(filteredCategories, bookmarks, { galleryFocusId, draftSubId, confirmedStyleId });
    }

    container.innerHTML = `
      <section class="gallery-wrapper view-mode-${viewMode.toLowerCase()}">
        <p class="gallery-hint">클릭하면 하단에 담고, 더블클릭하면 자세히 봅니다. 화살표로 이동 · Enter 열기 · Space 비교 슬롯.</p>
        ${contentHtml}
      </section>
    `;

    attachCardListeners(container);
    stopThumbObserver = observeThumbMotion(container);
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
                            type="button">
                      <div class="style-thumb-frame">
                        ${getMockupHTML(sub.previewType, 'thumb', sub)}
                      </div>
                      <span class="badge-name">${sub.name}</span>
                      <span class="badge-en">${sub.nameEn}</span>
                    </button>
                    <button class="badge-bookmark-btn ${isSaved ? 'bookmarked' : ''}"
                            data-sub-id="${sub.id}"
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

  function renderBentoModeHTML(categories, bookmarks, flags) {
    let html = `<div class="bento-gallery-grid">`;
    let itemCounter = 0;

    categories.forEach((cat) => {
      cat.subCategories.forEach((sub) => {
        itemCounter++;
        const isSaved = bookmarks.includes(sub.id);
        const isHeroBento = itemCounter % 5 === 1;
        const bentoClass = isHeroBento ? 'bento-card-hero' : 'bento-card-standard';

        html += `
          <div class="bento-item-card ${bentoClass} ${tileStateClass(sub.id, flags)}"
               data-cat-id="${cat.id}"
               data-sub-id="${sub.id}"
               tabindex="0"
               style="--bento-accent: ${cat.accentColor}">
            <div class="bento-card-glow"></div>
            <div class="bento-thumb-frame">
              ${getMockupHTML(sub.previewType, 'thumb', sub)}
            </div>
            <div class="bento-top-row">
              <div class="bento-category-tag">
                <span>${cat.icon}</span>
                <span>${cat.title}</span>
              </div>
              <button class="bento-bookmark-toggle ${isSaved ? 'bookmarked' : ''}"
                      data-sub-id="${sub.id}"
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
    });

    html += `</div>`;
    return html;
  }

  function renderSpectrumModeHTML(categories, bookmarks, flags) {
    let html = `
      <div class="spectrum-stream-container">
        <div class="spectrum-timeline-axis">
          <span class="axis-node start">1950s 모더니즘</span>
          <div class="axis-line"></div>
          <span class="axis-node mid">1980s~2000s 레트로 & Y2K</span>
          <div class="axis-line"></div>
          <span class="axis-node modern">현대 하이퍼 테크 & 솔라펑크</span>
        </div>
        <div class="spectrum-cards-flow">
    `;

    categories.forEach((cat) => {
      html += `
        <div class="spectrum-category-group" style="--group-accent: ${cat.accentColor}">
          <div class="spectrum-group-header">
            <span class="group-icon">${cat.icon}</span>
            <div class="group-titles">
              <h3 class="group-title">${cat.title}</h3>
              <span class="group-en">${cat.titleEn}</span>
            </div>
          </div>
          <div class="spectrum-sub-grid">
            ${cat.subCategories.map((sub) => {
              const isSaved = bookmarks.includes(sub.id);
              return `
                <div class="spectrum-card ${tileStateClass(sub.id, flags)}" data-cat-id="${cat.id}" data-sub-id="${sub.id}" tabindex="0">
                  <div class="spec-thumb-frame">
                    ${getMockupHTML(sub.previewType, 'thumb', sub)}
                  </div>
                  <div class="spec-card-head">
                    <h4 class="spec-title">${sub.name}</h4>
                    <button class="spec-bookmark ${isSaved ? 'bookmarked' : ''}" data-sub-id="${sub.id}">
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
        </div>
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
        if (cat) wasmVisualEngine.setAccentColor(cat.accentColor);
        synthAudio.playSfx('HOVER');
        schedulePeek(subId);
      });

      item.addEventListener('mouseleave', () => cancelPeek());

      item.addEventListener('focus', () => {
        schedulePeek(subId, 120);
        appState.setState({ galleryFocusId: subId });
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
        const isNowBookmarked = appState.toggleBookmark(subId);
        synthAudio.playSfx('BOOKMARK');
        btn.classList.toggle('bookmarked', isNowBookmarked);
        btn.textContent = isNowBookmarked ? '★' : '☆';
        btn.title = isNowBookmarked ? '북마크 해제' : '즐겨찾기 저장';
      });
    });

    const mainCards = root.querySelectorAll('.main-category-card');
    mainCards.forEach((card) => {
      const catId = card.getAttribute('data-cat-id');
      const catData = MAIN_CATEGORIES.find((c) => c.id === catId);
      card.addEventListener('mouseenter', () => {
        if (catData) wasmVisualEngine.setAccentColor(catData.accentColor);
      });
    });
  }

  function collectTiles() {
    return Array.from(container.querySelectorAll('.sub-tile, .bento-item-card, .spectrum-card'));
  }

  function onGalleryKey(e) {
    const state = appState.getState();
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
      appState.setState({ draftSubId: null, confirmSheetOpen: false });
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
    appState.setState({ galleryFocusId: next.getAttribute('data-sub-id') });
  }

  if (!keyboardBound) {
    window.addEventListener('keydown', onGalleryKey);
    keyboardBound = true;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  appState.subscribe((state, prevState) => {
    if (
      state.currentView !== prevState?.currentView ||
      state.viewMode !== prevState?.viewMode ||
      state.activeFilter !== prevState?.activeFilter ||
      state.searchQuery !== prevState?.searchQuery ||
      state.bookmarkFilterActive !== prevState?.bookmarkFilterActive ||
      state.bookmarks?.length !== prevState?.bookmarks?.length
    ) {
      if (state.currentView === 'MAIN') {
        container.style.display = 'block';
        updateView();
      } else {
        container.style.display = 'none';
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
}
