/**
 * Hover / focus peek layer — live mini sandbox without leaving the gallery.
 */

import { appState } from '../state/appState.js';
import { findSubById } from '../data/categories.js';
import { getMockupHTML } from './mockupTemplates.js';
import { hydrateMockup, teardownMockup } from './mockupRuntime.js';
import { selectDraft, holdPeek, cancelPeek } from '../utils/selection.js';

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function renderPeekPreview(container) {
  if (!container) return;
  let lastId = null;

  function paint() {
    const { currentView, peekSubId, viewport } = appState.getState();
    const show = currentView === 'MAIN' && peekSubId;
    if (!show) {
      const vp = container.querySelector('#peek-viewport');
      teardownMockup(vp);
      container.innerHTML = '';
      container.style.display = 'none';
      lastId = null;
      return;
    }

    const sub = findSubById(peekSubId);
    if (!sub) {
      container.style.display = 'none';
      return;
    }

    container.style.display = 'block';
    if (lastId !== sub.id) {
      teardownMockup(container.querySelector('#peek-viewport'));
      container.innerHTML = `
        <div class="peek-card ${viewport === 'MOBILE' ? 'is-mobile' : ''}" role="dialog" aria-label="${escapeHtml(sub.name)} 미리보기">
          <div class="peek-meta">
            <span class="peek-cat">${escapeHtml(sub.icon)} ${escapeHtml(sub.categoryTitle)}</span>
            <strong>${escapeHtml(sub.name)}</strong>
            <span class="peek-en">${escapeHtml(sub.nameEn)}</span>
          </div>
          <div class="peek-viewport" id="peek-viewport">
            ${getMockupHTML(sub.previewType, 'hero', sub)}
          </div>
          <p class="peek-hint">클릭으로 담기 · 더블클릭으로 자세히 · Enter 열기 · Esc 닫기</p>
        </div>
      `;
      const vp = container.querySelector('#peek-viewport');
      if (vp) hydrateMockup(vp, sub, { tab: 'hero', compact: true });

      const card = container.querySelector('.peek-card');
      positionPeek(card, sub.id);
      card?.addEventListener('mouseenter', () => holdPeek(sub.id));
      card?.addEventListener('mouseleave', () => cancelPeek());
      card?.addEventListener('click', (e) => {
        if (e.target.closest('[data-mock-action]')) return;
        selectDraft(sub.categoryId, sub.id);
      });
      lastId = sub.id;
    } else {
      positionPeek(container.querySelector('.peek-card'), sub.id);
    }
  }

  function positionPeek(card, subId) {
    if (!card || card.classList.contains('is-mobile')) return;
    const tile = document.querySelector(`#main-root [data-sub-id="${subId}"]`);
    if (!tile) return;
    const r = tile.getBoundingClientRect();
    const width = Math.min(380, window.innerWidth - 24);
    let left = r.right + 12;
    if (left + width > window.innerWidth - 12) left = r.left - width - 12;
    if (left < 12) left = 12;
    let top = r.top;
    if (top + 300 > window.innerHeight) top = Math.max(72, window.innerHeight - 320);
    card.style.right = 'auto';
    card.style.left = `${left}px`;
    card.style.top = `${Math.max(72, top)}px`;
  }

  appState.subscribe((state, prev) => {
    if (
      state.peekSubId !== prev?.peekSubId ||
      state.currentView !== prev?.currentView ||
      state.viewport !== prev?.viewport
    ) {
      paint();
    }
  });

  paint();
}
