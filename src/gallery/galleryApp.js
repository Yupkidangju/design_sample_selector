/**
 * 메인 갤러리 앱 (index.html)
 * 중립 다크 스튜디오 셸 · WAI-ARIA 정합 필터 · 포커스 보존형 검색/그룹/즐겨찾기
 */

import { STYLE_GROUPS } from '../data/domains.js';
import { STYLES_20, STYLE_BY_ID, filterStyles } from '../data/styles20.js';
import { loadBookmarks, toggleBookmarkId } from '../utils/bookmarks.js';
import { escapeHtml } from '../utils/escape.js';
import { renderSpecimenCard } from './specimenCard.js';

export function initGalleryApp() {
  const headerControlsEl = document.getElementById('gallery-controls');
  const gridEl = document.getElementById('gallery-grid');
  const countEl = document.getElementById('gallery-result-count');
  if (!headerControlsEl || !gridEl) return;

  const validIds = new Set(STYLE_BY_ID.keys());
  const state = {
    group: 'all',
    query: '',
    bookmarksOnly: false,
    bookmarks: loadBookmarks(validIds)
  };

  function mountControlsOnce() {
    headerControlsEl.innerHTML = `
      <div class="gallery-filter-row">
        <div class="gallery-search-wrap">
          <label for="gallery-search-input" class="sr-only">스타일 검색</label>
          <input id="gallery-search-input"
                 class="gallery-search-input"
                 type="search"
                 placeholder="사조명, 특징, 분위기 검색 (예: 픽셀, 그리드, 유리, 아르데코)..."
                 value=""
                 autocomplete="off" />
        </div>

        <div class="gallery-filter-actions">
          <div class="gallery-group-tabs" role="tablist" aria-label="디자인 그룹 필터">
            ${STYLE_GROUPS.map(group => `
              <button type="button"
                      role="tab"
                      class="gallery-filter-pill ${state.group === group.id ? 'is-active' : ''}"
                      aria-selected="${state.group === group.id ? 'true' : 'false'}"
                      data-filter-group="${escapeHtml(group.id)}">
                ${escapeHtml(group.label)}
              </button>
            `).join('')}
          </div>

          <button type="button"
                  class="gallery-filter-pill gallery-bookmark-filter"
                  aria-pressed="false"
                  data-filter-bookmarks>
            ★ 즐겨찾기 (${state.bookmarks.length})
          </button>
        </div>
      </div>
    `;

    const searchInput = headerControlsEl.querySelector('#gallery-search-input');
    searchInput?.addEventListener('input', event => {
      state.query = event.target.value;
      renderGrid();
    });

    headerControlsEl.querySelectorAll('[data-filter-group]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.group = btn.dataset.filterGroup || 'all';
        syncControlsState();
        renderGrid();
      });
    });

    headerControlsEl.querySelector('[data-filter-bookmarks]')?.addEventListener('click', () => {
      state.bookmarksOnly = !state.bookmarksOnly;
      syncControlsState();
      renderGrid();
    });
  }

  function syncControlsState() {
    const searchInput = headerControlsEl.querySelector('#gallery-search-input');
    if (searchInput && searchInput.value !== state.query) {
      searchInput.value = state.query;
    }

    headerControlsEl.querySelectorAll('[data-filter-group]').forEach(btn => {
      const active = btn.dataset.filterGroup === state.group;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', String(active));
    });

    const bookmarkFilterBtn = headerControlsEl.querySelector('[data-filter-bookmarks]');
    if (bookmarkFilterBtn) {
      bookmarkFilterBtn.classList.toggle('is-active', state.bookmarksOnly);
      bookmarkFilterBtn.setAttribute('aria-pressed', String(state.bookmarksOnly));
      bookmarkFilterBtn.textContent = `★ 즐겨찾기 (${state.bookmarks.length})`;
    }
  }

  function renderGrid() {
    const visibleStyles = filterStyles(state);

    if (countEl) {
      countEl.textContent = `엄선 ${STYLES_20.length}종 중 ${visibleStyles.length}종 표시`;
    }

    if (visibleStyles.length === 0) {
      gridEl.innerHTML = `
        <div class="gallery-empty" role="status">
          <h2>조건에 맞는 디자인 사조가 없습니다</h2>
          <p>검색어나 즐겨찾기 필터를 초기화하면 20종 전체 표본을 다시 볼 수 있습니다.</p>
          <button type="button" class="gallery-reset-btn" data-gallery-reset>필터 초기화</button>
        </div>
      `;
      gridEl.querySelector('[data-gallery-reset]')?.addEventListener('click', () => {
        state.group = 'all';
        state.query = '';
        state.bookmarksOnly = false;
        syncControlsState();
        renderGrid();
        headerControlsEl.querySelector('#gallery-search-input')?.focus({ preventScroll: true });
      });
      return;
    }

    gridEl.innerHTML = visibleStyles
      .map(style => renderSpecimenCard(style, { isBookmarked: state.bookmarks.includes(style.id) }))
      .join('');

    gridEl.querySelectorAll('[data-bookmark-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const styleId = btn.dataset.bookmarkToggle;
        if (!styleId) return;
        state.bookmarks = toggleBookmarkId(state.bookmarks, styleId);
        syncControlsState();

        if (state.bookmarksOnly) {
          renderGrid();
          const nextTarget = gridEl.querySelector('[data-bookmark-toggle]')
            || headerControlsEl.querySelector('[data-filter-bookmarks]');
          nextTarget?.focus({ preventScroll: true });
          return;
        }

        const nowBookmarked = state.bookmarks.includes(styleId);
        const style = STYLE_BY_ID.get(styleId);
        btn.classList.toggle('is-bookmarked', nowBookmarked);
        btn.setAttribute('aria-pressed', String(nowBookmarked));
        btn.setAttribute('aria-label', `${style?.nameKo || styleId} 즐겨찾기 ${nowBookmarked ? '해제' : '추가'}`);
        btn.textContent = nowBookmarked ? '★' : '☆';
      });
    });
  }

  mountControlsOnce();
  syncControlsState();
  renderGrid();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGalleryApp, { once: true });
  } else {
    initGalleryApp();
  }
}
