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
import { getActiveLocaleSnapshot } from '../i18n/index.js';
import { formatLocaleCopy } from '../i18n/format.js';
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
    const snapshot = getActiveLocaleSnapshot();
    const t = (key, values) => formatLocaleCopy(snapshot?.copy, key, values);
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
          <h2 class="empty-title">${escapeHtml(t('gallery.emptyTitle'))}</h2>
          <p class="empty-desc">${escapeHtml(t(searchQuery ? 'gallery.emptyQuery' : 'gallery.emptyConditions', { query: searchQuery }))}</p>
          <button class="empty-reset-btn" id="btn-empty-reset" type="button">${escapeHtml(t('gallery.resetAll'))}</button>
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
      contentHtml = renderBentoModeHTML(model.entries, bookmarks, { galleryFocusId, draftSubId, confirmedStyleId }, t);
    } else if (viewMode === 'SPECTRUM') {
      contentHtml = renderSpectrumModeHTML(model.eraGroups, bookmarks, { galleryFocusId, draftSubId, confirmedStyleId }, t, snapshot);
    } else {
      contentHtml = renderStandardGridHTML(model.categories, bookmarks, { galleryFocusId, draftSubId, confirmedStyleId }, t);
    }

    container.innerHTML = `
      <section class="gallery-wrapper view-mode-${viewMode.toLowerCase()}" data-result-count="${model.resultIds.length}">
        <p class="gallery-hint">${escapeHtml(t('gallery.hint'))}</p>
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

  function renderStandardGridHTML(categories, bookmarks, flags, t) {
    let html = `<div class="category-nodes-grid">`;

    const GENRE_PILLS = {
      swiss: '■ SWISS',
      y2k: '✦ Y2K',
      brutalism: '⬛ BRUTAL',
      hypertech: '💠 HYPER',
      retro: '🕹️ RETRO',
      depth: '💎 GLASS',
      editorial: '📰 EDITORIAL',
      soft3d: '🫧 3D'
    };

    categories.forEach((cat, idx) => {
      const genrePill = GENRE_PILLS[cat.id] || cat.id.toUpperCase();
      html += `
        <article class="main-category-card motif-${cat.id}" data-cat-id="${cat.id}" style="--category-accent: ${cat.accentColor}">
          <div class="card-motif" aria-hidden="true"></div>
          <div class="card-glow-overlay"></div>

          <div class="card-header-meta">
            <div class="card-meta-left">
              <span class="category-index">0${idx + 1}</span>
              <span class="category-style-pill ${cat.id}-pill">${genrePill}</span>
            </div>
            <span class="category-badge-count">${escapeHtml(t('discovery.styleCount', { count: cat.subCategories.length }))}</span>
          </div>

          <div class="card-title-group">
            <div class="category-icon-wrapper">${cat.icon}</div>
            <div>
              <h2 class="category-main-title">${escapeHtml(cat.title)}</h2>
            </div>
          </div>

          <p class="category-description">${escapeHtml(cat.description)}</p>

          <div class="hover-reveal-section">
            <div class="reveal-header">
              <span class="reveal-title">${escapeHtml(t('gallery.derivedStyles', { count: cat.subCategories.length }))}</span>
              <span class="reveal-hint">${escapeHtml(t('gallery.tileHint'))}</span>
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
                      <div class="sub-tile-meta">
                        <span class="badge-name">${sub.name}</span>
                      </div>
                    </button>
                    <button class="tile-detail-btn"
                            data-cat-id="${cat.id}"
                            data-sub-id="${sub.id}"
                            type="button"
                            aria-label="${escapeHtml(`${sub.name} ${t('gallery.detailView')}`)}"
                            title="${escapeHtml(t('gallery.detailView'))}">
                      ${escapeHtml(t('gallery.detailView'))}
                    </button>
                    <button class="badge-bookmark-btn ${isSaved ? 'bookmarked' : ''}"
                            data-sub-id="${sub.id}"
                            type="button"
                            aria-label="${escapeHtml(`${sub.name} ${t(isSaved ? 'gallery.bookmarkRemove' : 'gallery.bookmarkSave')}`)}"
                            title="${escapeHtml(t(isSaved ? 'gallery.bookmarkRemove' : 'gallery.favoriteSave'))}">
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

  function renderBentoModeHTML(entries, bookmarks, flags, t) {
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
             aria-label="${escapeHtml(t('gallery.selectDesign', { name: sub.name }))}"
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
                    aria-label="${escapeHtml(`${sub.name} ${t(isSaved ? 'gallery.bookmarkRemove' : 'gallery.bookmarkSave')}`)}"
                    title="${escapeHtml(t(isSaved ? 'gallery.bookmarkRemove' : 'gallery.favoriteSave'))}">
              ${isSaved ? '★' : '☆'}
            </button>
          </div>
          <div class="bento-content-body">
            <h3 class="bento-title">${sub.name}</h3>
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
            <button class="bento-open-cta"
                    data-cat-id="${cat.id}"
                    data-sub-id="${sub.id}"
                    type="button"
                    aria-label="${escapeHtml(`${sub.name} ${t('gallery.detailView')}`)}">
              ${escapeHtml(t('gallery.detailView'))}
            </button>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    return html;
  }

  function renderSpectrumModeHTML(eraGroups, bookmarks, flags, t, snapshot) {
    let html = `
      <div class="spectrum-stream-container">
        <div class="spectrum-timeline-axis" aria-label="${escapeHtml(t('gallery.eraOrder'))}">
          <span class="spectrum-axis-label">${escapeHtml(t('gallery.eraOrder'))}</span>
          <div class="spectrum-axis-nodes">
            ${eraGroups.map(group => `<span class="axis-node">${escapeHtml(snapshot?.catalog?.facets?.era?.values?.[group.id] || group.label.en)}</span>`).join('<span class="axis-line" aria-hidden="true"></span>')}
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
              <h3 class="group-title" id="era-group-${group.id}">${escapeHtml(snapshot?.catalog?.facets?.era?.values?.[group.id] || group.label.en)}</h3>
              <span class="group-en">${escapeHtml(t('discovery.styleCount', { count: group.entries.length }))}</span>
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
                     aria-label="${escapeHtml(t('gallery.selectDesign', { name: sub.name }))}"
                     style="--group-accent: ${cat.accentColor}">
                  <div class="spec-thumb-frame">
                    ${renderPreviewThumbnail({ thumbnailId: sub.thumbMotif, design: sub })}
                  </div>
                  <div class="spec-card-context">
                    <span class="spec-category-context">${cat.icon} ${cat.title}</span>
                    <span class="spec-era-context">${escapeHtml(snapshot?.catalog?.facets?.era?.values?.[group.id] || group.label.en)}</span>
                  </div>
                  <div class="spec-card-head">
                    <h4 class="spec-title">${sub.name}</h4>
                    <button class="spec-bookmark ${isSaved ? 'bookmarked' : ''}"
                            data-sub-id="${sub.id}"
                            type="button"
                            aria-label="${escapeHtml(`${sub.name} ${t(isSaved ? 'gallery.bookmarkRemove' : 'gallery.bookmarkSave')}`)}">
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
                    <button class="spec-cta"
                            data-cat-id="${cat.id}"
                            data-sub-id="${sub.id}"
                            type="button"
                            aria-label="${escapeHtml(`${sub.name} ${t('gallery.detailView')}`)}">
                      ${escapeHtml(t('gallery.detailView'))}
                    </button>
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
        if (e.target.closest('.badge-bookmark-btn, .bento-bookmark-toggle, .spec-bookmark, .tile-detail-btn, .bento-open-cta, .spec-cta')) return;
        selectDraft(catId, subId);
      });

      item.addEventListener('dblclick', (e) => {
        if (e.target.closest('.badge-bookmark-btn, .bento-bookmark-toggle, .spec-bookmark, .tile-detail-btn, .bento-open-cta, .spec-cta')) return;
        e.preventDefault();
        openDetailFor(catId, subId);
      });
    });

    const detailBtns = root.querySelectorAll('.tile-detail-btn, .bento-open-cta, .spec-cta');
    detailBtns.forEach((btn) => {
      const open = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const catId = btn.getAttribute('data-cat-id');
        const subId = btn.getAttribute('data-sub-id');
        openDetailFor(catId, subId);
      };
      btn.addEventListener('click', open);
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          open(e);
        }
      });
    });

    const bookmarkBtns = root.querySelectorAll('.badge-bookmark-btn, .bento-bookmark-toggle, .spec-bookmark');
    bookmarkBtns.forEach((btn) => {
      const toggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const subId = btn.getAttribute('data-sub-id');
        stateManager.toggleBookmark(subId);
        synthAudio.playSfx('BOOKMARK');
      };
      btn.addEventListener('click', toggle);
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          toggle(e);
        }
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

    const active = document.activeElement;
    const typing = active?.tagName === 'INPUT' || active?.tagName === 'TEXTAREA' || active?.tagName === 'SELECT';

    if (e.key === '/' && !e.metaKey && !e.ctrlKey && !typing) {
      e.preventDefault();
      document.getElementById('search-input')?.focus();
      return;
    }

    if (typing) {
      if (e.key === 'Escape') document.activeElement.blur();
      return;
    }

    // Do not intercept keyboard actions when focused on interactive controls (CTA, bookmark buttons, links, etc.)
    if (active && (
      active.closest?.('.tile-detail-btn, .bento-open-cta, .spec-cta, .badge-bookmark-btn, .bento-bookmark-toggle, .spec-bookmark') ||
      (active.tagName === 'BUTTON' && !active.classList.contains('sub-tile'))
    )) {
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
      || state.locale !== prevState?.locale
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
