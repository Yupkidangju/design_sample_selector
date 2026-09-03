/**
 * App Header & Top Navigation Component v2.0
 * Renders brand logo, search input bar, 3-mode view switcher (Grid/Bento/Spectrum),
 * 8-genre tag filter, bookmarks drawer toggle, and split comparison launcher.
 */

import { appState } from '../state/appState.js';
import { synthAudio } from '../audio/synthAudio.js';
import { MAIN_CATEGORIES, findSubById, getAllSubDesigns } from '../data/categories.js';
import { openDetailFor, openSplitCompare } from '../utils/selection.js';
import { getLocalizedLegacyMainCategories } from '../catalog/legacyAdapter.js';
import {
  LOCALE_ENDONYMS,
  SUPPORTED_LOCALES,
  commitLocale,
  getActiveLocaleSnapshot
} from '../i18n/index.js';
import { formatLocaleCopy } from '../i18n/format.js';

const STYLE_COUNT = getAllSubDesigns().length;

export function renderHeader(container) {
  if (!container) return;

  function update() {
    const { activeFilter, searchQuery, viewMode, bookmarks, bookmarkFilterActive, confirmedStyleId, canvasReady, locale } = appState.getState();
    const localeSnapshot = getActiveLocaleSnapshot();
    const messages = localeSnapshot?.messages || {};
    const copy = localeSnapshot?.copy;
    const t = (key, values) => formatLocaleCopy(copy, key, values);
    const categories = localeSnapshot ? getLocalizedLegacyMainCategories(localeSnapshot) : MAIN_CATEGORIES;
    const bookmarkCount = bookmarks.length;
    const confirmed = confirmedStyleId
      ? categories.flatMap(category => category.subCategories).find(style => style.id === confirmedStyleId) || null
      : null;

    container.innerHTML = `
      <header class="app-header">
        <!-- Top Bar: Logo, Search, View Modes, Bookmarks, Compare -->
        <div class="header-main">
          <div class="brand-container" id="brand-home-btn" role="button" tabindex="0" title="${escapeHtml(t('header.homeTitle'))}">
            <div class="brand-logo-symbol">
              <span class="logo-icon">🎨</span>
              <span class="logo-pulse"></span>
            </div>
            <div class="brand-titles">
              <div class="brand-title-line">
                <h1 class="brand-title">DESIGN SPECTRUM 2</h1>
                <span class="brand-badge-v2">v2.4 PREVIEW</span>
              </div>
              <p class="brand-subtitle">${escapeHtml(messages.subtitle || '')}</p>
            </div>
          </div>

          <!-- Central Search Bar -->
          <div class="header-search-wrapper">
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input type="search"
                     id="search-input" 
                     aria-label="${escapeHtml(messages.search || '')}"
                     maxlength="120"
                     placeholder="${escapeHtml(messages.search || '')}"
                     value="${escapeHtml(searchQuery)}" 
                     autocomplete="off" />
              ${searchQuery ? `<button class="search-clear-btn" id="btn-search-clear" type="button" aria-label="${escapeHtml(t('header.clearSearch'))}" title="${escapeHtml(t('header.clearSearch'))}">✕</button>` : ''}
            </div>
          </div>

          <!-- Utility & Action Controls -->
          <div class="header-actions">
            <label class="locale-picker">
              <span class="visually-hidden">${escapeHtml(messages.language || '')}</span>
              <select id="locale-select" aria-label="${escapeHtml(messages.language || '')}">
                ${SUPPORTED_LOCALES.map(item => `<option value="${item}" ${item === locale ? 'selected' : ''}>${LOCALE_ENDONYMS[item]}</option>`).join('')}
              </select>
            </label>
            <!-- 3 View Mode Switcher -->
            <div class="view-mode-group" role="group" aria-label="${escapeHtml(t('header.viewGroup'))}">
              <button class="view-mode-btn ${viewMode === 'GRID' ? 'active' : ''}" data-mode="GRID" type="button" aria-pressed="${viewMode === 'GRID'}" title="${escapeHtml(t('header.gridTitle'))}">
                <span class="mode-icon">⊞</span>
                <span class="mode-label">${messages.grid || 'Grid'}</span>
              </button>
              <button class="view-mode-btn ${viewMode === 'BENTO' ? 'active' : ''}" data-mode="BENTO" type="button" aria-pressed="${viewMode === 'BENTO'}" title="${escapeHtml(t('header.bentoTitle'))}">
                <span class="mode-icon">▤</span>
                <span class="mode-label">${messages.bento || 'Bento'}</span>
              </button>
              <button class="view-mode-btn ${viewMode === 'SPECTRUM' ? 'active' : ''}" data-mode="SPECTRUM" type="button" aria-pressed="${viewMode === 'SPECTRUM'}" title="${escapeHtml(t('header.spectrumTitle'))}">
                <span class="mode-icon">〰</span>
                <span class="mode-label">${messages.spectrum || 'Spectrum'}</span>
              </button>
            </div>

            <!-- Bookmarks Filter Toggle -->
            <button class="btn-util-chip ${bookmarkFilterActive ? 'active-bookmark-chip' : ''}" id="btn-toggle-bookmark-filter" type="button" aria-pressed="${bookmarkFilterActive}" title="${escapeHtml(t('header.bookmarksOnly'))}">
              <span class="util-icon">⭐️</span>
              <span>${messages.bookmark || ''} (${bookmarkCount})</span>
            </button>

            <button class="btn-util-chip ${confirmed ? 'active-confirm-chip' : ''}" id="btn-open-confirmed" type="button" title="${escapeHtml(t('header.confirmedTitle'))}">
              <span class="util-icon">✓</span>
              <span>${confirmed ? `${messages.saved || ''}: ${escapeHtml(confirmed.name)}` : (messages.noSelection || '')}</span>
            </button>
            <button class="btn-util-chip btn-compare-chip" id="btn-open-compare-modal" type="button" title="${escapeHtml(t('header.compareTitle'))}">
              <span class="util-icon">⚖️</span>
              <span>${escapeHtml(messages.compare || '')}</span>
            </button>
          </div>
        </div>

        <!-- Filter Tags Navigation Bar -->
        <div class="filter-bar-wrapper">
          <nav class="filter-tag-nav" aria-label="${escapeHtml(t('header.categoryNav'))}">
            <span class="filter-label">${escapeHtml(t('header.filtersLabel'))}:</span>
            <button class="filter-tag-btn ${activeFilter === 'ALL' ? 'active' : ''}" data-filter="ALL" type="button" aria-pressed="${activeFilter === 'ALL'}">
              ${messages.all || ''} (${STYLE_COUNT}${escapeHtml(t('header.styleUnit'))})
            </button>
            ${categories.map(cat => `
              <button class="filter-tag-btn ${activeFilter === cat.id ? 'active' : ''}"
                      data-filter="${cat.id}"
                      type="button"
                      aria-pressed="${activeFilter === cat.id}"
                      style="--tag-accent: ${cat.accentColor}">
                <span class="tag-icon">${cat.icon}</span>
                <span>${escapeHtml(cat.title)} (${cat.subCategories.length})</span>
              </button>
            `).join('')}
          </nav>

          <!-- Status Indicator Chips -->
          <div class="header-status-bar">
            <div class="status-chip chip-wasm" id="badge-canvas-status">
              <span class="chip-dot"></span>
              <span id="txt-canvas-status">${canvasReady ? 'CANVAS 2D: ACTIVE (rAF)' : 'CANVAS 2D: READY'}</span>
            </div>
            <div class="status-chip chip-audio" id="badge-audio-status">
              <span class="chip-dot audio-pulse"></span>
              <span id="txt-audio-status">${escapeHtml(t('audio.paused'))}</span>
            </div>
          </div>
        </div>
      </header>
    `;

    // Event Bindings
    const brandHome = container.querySelector('#brand-home-btn');
    if (brandHome) {
      const handleHome = () => {
        synthAudio.playSfx('CLICK');
        appState.setState({
          currentView: 'MAIN',
          activeFilter: 'ALL',
          searchQuery: '',
          activeFacets: {},
          sortMode: 'catalog',
          bookmarkFilterActive: false
        });
      };
      brandHome.addEventListener('click', handleHome);
      brandHome.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleHome();
        }
      });
    }

    bindSearchControls();

    container.querySelector('#locale-select')?.addEventListener('change', async event => {
      const select = event.currentTarget;
      select.disabled = true;
      try {
        await commitLocale(select.value, appState, window);
      } catch {
        select.value = appState.getState().locale;
      } finally {
        select.disabled = false;
      }
    });

    // View Mode Buttons
    const viewModeBtns = container.querySelectorAll('.view-mode-btn');
    viewModeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        synthAudio.playSfx('CLICK');
        const mode = btn.getAttribute('data-mode');
        appState.setState({ viewMode: mode });
      });
    });

    // Bookmark Filter Toggle
    const bookmarkToggleBtn = container.querySelector('#btn-toggle-bookmark-filter');
    if (bookmarkToggleBtn) {
      bookmarkToggleBtn.addEventListener('click', () => {
        synthAudio.playSfx('BOOKMARK');
        const nextActive = !appState.getState().bookmarkFilterActive;
        appState.setState({ bookmarkFilterActive: nextActive });
      });
    }

    const confirmedBtn = container.querySelector('#btn-open-confirmed');
    if (confirmedBtn) {
      confirmedBtn.addEventListener('click', () => {
        const id = appState.getState().confirmedStyleId;
        const sub = id ? findSubById(id) : null;
        if (!sub) {
          synthAudio.playSfx('CLICK');
          return;
        }
        if (appState.getState().currentView === 'MAIN') {
          appState.setState({ confirmSheetOpen: true, draftSubId: sub.id });
          synthAudio.playSfx('CLICK');
        } else {
          openDetailFor(sub.categoryId, sub.id);
        }
      });
    }

    const compareBtn = container.querySelector('#btn-open-compare-modal');
    if (compareBtn) {
      compareBtn.addEventListener('click', () => {
        openSplitCompare();
      });
    }

    // Tag Filter Buttons
    const filterBtns = container.querySelectorAll('.filter-tag-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        synthAudio.playSfx('CLICK');
        const filterVal = btn.getAttribute('data-filter');
        appState.setState({ activeFilter: filterVal });
      });
    });
  }

  function bindSearchControls() {
    const searchInput = container.querySelector('#search-input');
    if (searchInput && !searchInput.dataset.bound) {
      searchInput.dataset.bound = '1';
      searchInput.addEventListener('input', (e) => {
        appState.setState({ searchQuery: e.target.value });
      });
    }
    bindSearchClear();
  }

  function bindSearchClear() {
    const searchClear = container.querySelector('#btn-search-clear');
    if (searchClear && !searchClear.dataset.bound) {
      searchClear.dataset.bound = '1';
      searchClear.addEventListener('click', () => {
        synthAudio.playSfx('CLICK');
        appState.setState({ searchQuery: '' });
      });
    }
  }

  function patchSearchField(query) {
    const searchInput = container.querySelector('#search-input');
    if (searchInput && searchInput.value !== query) {
      const start = searchInput.selectionStart;
      const end = searchInput.selectionEnd;
      const hadFocus = document.activeElement === searchInput;
      searchInput.value = query;
      if (hadFocus) {
        try { searchInput.setSelectionRange(start, end); } catch { /* ignore */ }
      }
    }

    const box = container.querySelector('.search-box');
    if (!box) return;
    let clearBtn = box.querySelector('#btn-search-clear');
    if (query && !clearBtn) {
      clearBtn = document.createElement('button');
      clearBtn.className = 'search-clear-btn';
      clearBtn.id = 'btn-search-clear';
      clearBtn.type = 'button';
      const clearLabel = formatLocaleCopy(getActiveLocaleSnapshot()?.copy, 'header.clearSearch');
      clearBtn.setAttribute('aria-label', clearLabel);
      clearBtn.title = clearLabel;
      clearBtn.textContent = '✕';
      box.appendChild(clearBtn);
      bindSearchClear();
    } else if (!query && clearBtn) {
      clearBtn.remove();
    }
  }

  function headerChromeChanged(state, prevState) {
    if (!prevState) return true;
    return (
      state.activeFilter !== prevState.activeFilter ||
      state.viewMode !== prevState.viewMode ||
      state.bookmarks?.length !== prevState.bookmarks?.length ||
      state.bookmarkFilterActive !== prevState.bookmarkFilterActive ||
      state.confirmedStyleId !== prevState.confirmedStyleId
      || state.locale !== prevState.locale
    );
  }

  // Helper escape
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  appState.subscribe((state, prevState) => {
    if (headerChromeChanged(state, prevState)) {
      update();
    } else if (state.searchQuery !== prevState?.searchQuery) {
      patchSearchField(state.searchQuery);
    }

    const canvasTxt = container.querySelector('#txt-canvas-status');
    const audioTxt = container.querySelector('#txt-audio-status');
    if (canvasTxt && state.canvasReady) {
      canvasTxt.textContent = 'CANVAS 2D: ACTIVE (rAF)';
    }
    if (audioTxt) {
      audioTxt.textContent = state.audio.isPlaying ? state.audio.trackTitle : 'BGM: 16 TRACKS (PAUSED)';
    }
  });

  update();
}
