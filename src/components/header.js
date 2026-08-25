/**
 * App Header & Top Navigation Component v2.0
 * Renders brand logo, search input bar, 3-mode view switcher (Grid/Bento/Spectrum),
 * 8-genre tag filter, bookmarks drawer toggle, and split comparison launcher.
 */

import { appState } from '../state/appState.js';
import { synthAudio } from '../audio/synthAudio.js';
import { MAIN_CATEGORIES, findSubById } from '../data/categories.js';
import { openDetailFor, openSplitCompare } from '../utils/selection.js';

export function renderHeader(container) {
  if (!container) return;

  function update() {
    const { activeFilter, searchQuery, viewMode, bookmarks, bookmarkFilterActive, confirmedStyleId, canvasReady } = appState.getState();
    const bookmarkCount = bookmarks.length;
    const confirmed = confirmedStyleId ? findSubById(confirmedStyleId) : null;

    container.innerHTML = `
      <header class="app-header">
        <!-- Top Bar: Logo, Search, View Modes, Bookmarks, Compare -->
        <div class="header-main">
          <div class="brand-container" id="brand-home-btn" role="button" tabindex="0" title="메인 홈으로 이동">
            <div class="brand-logo-symbol">
              <span class="logo-icon">🎨</span>
              <span class="logo-pulse"></span>
            </div>
            <div class="brand-titles">
              <div class="brand-title-line">
                <h1 class="brand-title">DESIGN SPECTRUM</h1>
                <span class="brand-badge-v2">v2.2 LIVE</span>
              </div>
              <p class="brand-subtitle">8대 대분류 · 24종 라이브 시안 · 8대 아키타입 · 동적 샌드박스</p>
            </div>
          </div>

          <!-- Central Search Bar -->
          <div class="header-search-wrapper">
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input type="text" 
                     id="search-input" 
                     placeholder="검색 또는 / 키 · 예: Y2K, 글래스, 키네틱..." 
                     value="${escapeHtml(searchQuery)}" 
                     autocomplete="off" />
              ${searchQuery ? `<button class="search-clear-btn" id="btn-search-clear" title="검색어 지우기">✕</button>` : ''}
            </div>
          </div>

          <!-- Utility & Action Controls -->
          <div class="header-actions">
            <!-- 3 View Mode Switcher -->
            <div class="view-mode-group" role="group" aria-label="갤러리 뷰 모드">
              <button class="view-mode-btn ${viewMode === 'GRID' ? 'active' : ''}" data-mode="GRID" title="표준 그리드 뷰">
                <span class="mode-icon">⊞</span>
                <span class="mode-label">Grid</span>
              </button>
              <button class="view-mode-btn ${viewMode === 'BENTO' ? 'active' : ''}" data-mode="BENTO" title="비대칭 벤토 그리드 뷰">
                <span class="mode-icon">▤</span>
                <span class="mode-label">Bento</span>
              </button>
              <button class="view-mode-btn ${viewMode === 'SPECTRUM' ? 'active' : ''}" data-mode="SPECTRUM" title="연대기 스펙트럼 뷰">
                <span class="mode-icon">〰</span>
                <span class="mode-label">Spectrum</span>
              </button>
            </div>

            <!-- Bookmarks Filter Toggle -->
            <button class="btn-util-chip ${bookmarkFilterActive ? 'active-bookmark-chip' : ''}" id="btn-toggle-bookmark-filter" title="북마크한 스타일만 모아보기">
              <span class="util-icon">⭐️</span>
              <span>북마크 (${bookmarkCount})</span>
            </button>

            <button class="btn-util-chip ${confirmed ? 'active-confirm-chip' : ''}" id="btn-open-confirmed" title="확정한 스타일">
              <span class="util-icon">✓</span>
              <span>${confirmed ? `선택됨: ${confirmed.name}` : '선택 없음'}</span>
            </button>
            <button class="btn-util-chip btn-compare-chip" id="btn-open-compare-modal" title="2개 스타일 스플릿 듀얼 비교">
              <span class="util-icon">⚖️</span>
              <span>스플릿 비교</span>
            </button>
          </div>
        </div>

        <!-- Filter Tags Navigation Bar -->
        <div class="filter-bar-wrapper">
          <nav class="filter-tag-nav">
            <span class="filter-label">장르 필터:</span>
            <button class="filter-tag-btn ${activeFilter === 'ALL' && !bookmarkFilterActive ? 'active' : ''}" data-filter="ALL">
              전체 (24종)
            </button>
            ${MAIN_CATEGORIES.map(cat => `
              <button class="filter-tag-btn ${activeFilter === cat.id && !bookmarkFilterActive ? 'active' : ''}" 
                      data-filter="${cat.id}"
                      style="--tag-accent: ${cat.accentColor}">
                <span class="tag-icon">${cat.icon}</span>
                <span>${cat.title}</span>
              </button>
            `).join('')}
          </nav>

          <!-- Status Indicator Chips -->
          <div class="header-status-bar">
            <div class="status-chip chip-wasm" id="badge-canvas-status">
              <span class="chip-dot"></span>
              <span id="txt-canvas-status">${canvasReady ? 'CANVAS 2D: ACTIVE (60FPS)' : 'CANVAS 2D: 60FPS'}</span>
            </div>
            <div class="status-chip chip-audio" id="badge-audio-status">
              <span class="chip-dot audio-pulse"></span>
              <span id="txt-audio-status">BGM: 16 TRACK SYNTH</span>
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
        appState.setState({
          bookmarkFilterActive: nextActive,
          activeFilter: nextActive ? 'BOOKMARK' : 'ALL'
        });
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
        appState.setState({
          activeFilter: filterVal,
          bookmarkFilterActive: false
        });
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
      clearBtn.title = '검색어 지우기';
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
      canvasTxt.textContent = 'CANVAS 2D: ACTIVE (60FPS)';
    }
    if (audioTxt) {
      audioTxt.textContent = state.audio.isPlaying ? state.audio.trackTitle : 'BGM: 16 TRACKS (PAUSED)';
    }
  });

  update();
}
