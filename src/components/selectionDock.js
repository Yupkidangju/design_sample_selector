/**
 * Bottom selection dock + confirm sheet.
 * Draft pick stays on the gallery; confirm persists to LocalStorage.
 */

import { appState } from '../state/appState.js';
import { synthAudio } from '../audio/synthAudio.js';
import { getLocalizedLegacyAllSubDesigns } from '../catalog/legacyAdapter.js';
import { getActiveLocaleSnapshot } from '../i18n/index.js';
import { formatLocaleCopy } from '../i18n/format.js';
import { renderPreviewThumbnail } from '../preview/thumbnailEntry.js';
import { hydrateMockup, teardownMockup } from './mockupRuntime.js';
import { loadComponentPreviewModule } from './lazyPreviewLoader.js';
import { recordRecoveryDiagnostic } from '../utils/recoveryDiagnostics.js';
import { copyToClipboard } from '../utils/clipboard.js';
import {
  openDetailFor,
  confirmStyle,
  openSplitCompare,
  selectDraft
} from '../utils/selection.js';

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function renderSelectionDock(container) {
  if (!container) return;
  let paintVersion = 0;
  let confirmFailureCount = 0;
  let confirmFailureSubId = null;

  function paint() {
    const renderVersion = ++paintVersion;
    const state = appState.getState();
    const {
      currentView, draftSubId, confirmedStyleId, confirmSheetOpen,
      recentlyViewed, bookmarks, compareSubIds
    } = state;

    const visible = currentView === 'MAIN' && (draftSubId || confirmedStyleId);
    document.body.classList.toggle('dock-open', Boolean(visible));
    container.style.display = visible ? 'block' : 'none';
    teardownMockup(container.querySelector('#confirm-preview'));
    if (!visible) {
      container.innerHTML = '';
      return;
    }

    const snapshot = getActiveLocaleSnapshot();
    const t = (key, values) => formatLocaleCopy(snapshot?.copy, key, values);
    const localizedById = new Map(getLocalizedLegacyAllSubDesigns(snapshot).map(style => [style.id, style]));
    const findLocalized = id => localizedById.get(id) || null;
    const draft = findLocalized(draftSubId) || findLocalized(confirmedStyleId);
    const confirmed = findLocalized(confirmedStyleId);
    const recents = recentlyViewed.map(findLocalized).filter(Boolean);
    const isBookmarked = draft ? bookmarks.includes(draft.id) : false;
    const inCompare = draft && (compareSubIds[0] === draft.id || compareSubIds[1] === draft.id);

    container.innerHTML = `
      <div class="selection-dock ${confirmSheetOpen ? 'is-expanded' : ''}" role="region" aria-label="${escapeHtml(t('dock.region'))}">
        ${confirmSheetOpen && confirmed ? renderConfirmSheet(confirmed, state, t) : ''}

        <div class="dock-bar">
          <div class="dock-confirmed-chip ${confirmed ? 'has-value' : ''}" id="dock-open-confirmed" title="${escapeHtml(t('dock.confirmedTitle'))}">
            <span class="dock-chip-label">${escapeHtml(t('dock.selected'))}</span>
            ${confirmed
              ? `<span class="dock-chip-name">${escapeHtml(confirmed.name)}</span>`
              : `<span class="dock-chip-empty">${escapeHtml(t('dock.unconfirmed'))}</span>`}
          </div>

          ${draft ? `
            <div class="dock-draft">
              <div class="dock-thumb">${renderPreviewThumbnail({ thumbnailId: draft.thumbMotif, design: draft })}</div>
              <div class="dock-draft-meta">
                <span class="dock-kicker">${escapeHtml(draft.categoryTitle)}</span>
                <strong class="dock-title">${escapeHtml(draft.name)}</strong>
              </div>
            </div>
            <div class="dock-actions">
              <button class="dock-btn primary" id="dock-open-detail">${escapeHtml(t('dock.details'))}</button>
              <button class="dock-btn" id="dock-confirm">${escapeHtml(t(confirmed?.id === draft.id ? 'dock.confirmed' : 'dock.confirm'))}</button>
              <button class="dock-btn" id="dock-compare">${escapeHtml(t(inCompare ? 'dock.inCompare' : 'dock.addCompare'))}</button>
              <button class="dock-btn" id="dock-bookmark">${isBookmarked ? '★' : '☆'}</button>
              <button class="dock-btn ghost" id="dock-clear" aria-label="${escapeHtml(t('dock.clear'))}">✕</button>
            </div>
          ` : `
            <p class="dock-hint">${escapeHtml(t('dock.hint'))}</p>
          `}

          ${recents.length ? `
            <div class="dock-recents" aria-label="${escapeHtml(t('dock.recents'))}">
              ${recents.map((s) => `
                <button class="dock-recent-btn ${s.id === draft?.id ? 'active' : ''}" data-recent-id="${s.id}" title="${escapeHtml(s.name)}">
                  ${renderPreviewThumbnail({ thumbnailId: s.thumbMotif, design: s })}
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `;

    bind(container, draft, confirmed);
    if (confirmSheetOpen && confirmed) {
      loadConfirmPreview(confirmed, renderVersion);
    }
  }

  function isCurrentConfirmPreview(sub, renderVersion) {
    const state = appState.getState();
    return renderVersion === paintVersion
      && state.currentView === 'MAIN'
      && state.confirmSheetOpen
      && state.confirmedStyleId === sub.id;
  }

  async function loadConfirmPreview(sub, renderVersion) {
    const t = (key, values) => formatLocaleCopy(getActiveLocaleSnapshot()?.copy, key, values);
    if (confirmFailureSubId !== sub.id) {
      confirmFailureSubId = sub.id;
      confirmFailureCount = 0;
    }
    const preview = container.querySelector('#confirm-preview');
    if (!preview || !isCurrentConfirmPreview(sub, renderVersion)) return;
    preview.setAttribute('aria-busy', 'true');
    preview.innerHTML = `<p class="inline-preview-state" role="status">${escapeHtml(t('dock.loading'))}</p>`;

    let failurePhase = 'import';
    try {
      const { renderPreviewComponent } = await loadComponentPreviewModule();
      if (!isCurrentConfirmPreview(sub, renderVersion)) return;
      const currentPreview = container.querySelector('#confirm-preview');
      if (!currentPreview) return;
      failurePhase = 'render';
      const snapshot = getActiveLocaleSnapshot();
      currentPreview.innerHTML = renderPreviewComponent({
        rendererId: sub.previewType,
        tab: 'hero',
        design: sub,
        snapshot
      });
      currentPreview.removeAttribute('aria-busy');
      failurePhase = 'hydrate';
      hydrateMockup(currentPreview, sub, { tab: 'hero', snapshot });
      confirmFailureCount = 0;
    } catch (error) {
      if (!isCurrentConfirmPreview(sub, renderVersion)) return;
      confirmFailureCount += 1;
      const terminal = Boolean(error?.terminal) || confirmFailureCount >= 2;
      if (error?.code !== 'RECOVERY_IMPORT_FAILED') {
        recordRecoveryDiagnostic({
          code: 'RECOVERY_RENDER_FAILED',
          phase: failurePhase,
          attempt: confirmFailureCount,
          resourceClass: 'confirm-preview',
          terminal
        });
      }
      const currentPreview = container.querySelector('#confirm-preview');
      if (!currentPreview) return;
      currentPreview.removeAttribute('aria-busy');
      currentPreview.innerHTML = `
        <div class="inline-preview-state" role="alert">
          <p>${escapeHtml(t('dock.failed'))}</p>
          ${terminal
            ? `<button class="dock-btn" type="button" data-confirm-preview-reload>${escapeHtml(t('recovery.reload'))}</button>`
            : `<button class="dock-btn" type="button" data-confirm-preview-retry>${escapeHtml(t('recovery.retry'))}</button>`}
        </div>
      `;
      currentPreview.querySelector('[data-confirm-preview-retry]')
        ?.addEventListener('click', () => loadConfirmPreview(sub, renderVersion));
      currentPreview.querySelector('[data-confirm-preview-reload]')
        ?.addEventListener('click', () => window.location.reload());
    }
  }

  function renderConfirmSheet(sub, state, t) {
    const tweaks = state.liveTweaks;
    return `
      <div class="confirm-sheet" role="region" aria-label="${escapeHtml(t('dock.confirmedRegion'))}">
        <div class="confirm-sheet-head">
          <h3>${escapeHtml(t('dock.confirmedHeading'))}</h3>
          <button class="dock-btn ghost" id="confirm-sheet-close">${escapeHtml(t('dock.collapse'))}</button>
        </div>
        <div class="confirm-sheet-body">
          <div class="confirm-preview" id="confirm-preview" data-theme="${escapeHtml(sub.id)}" aria-busy="true">
            <p class="inline-preview-state" role="status">${escapeHtml(t('dock.loading'))}</p>
          </div>
          <div class="confirm-facts">
            <p class="confirm-desc">${escapeHtml(sub.shortDesc)}</p>
            <div class="confirm-palette">
              ${sub.palette.map((c) => `
                <button class="confirm-swatch" data-hex="${escapeHtml(c.hex)}" data-name="${escapeHtml(c.name)}" title="${escapeHtml(c.name)}">
                  <i style="background:${c.hex}"></i>
                  <span>${escapeHtml(c.hex)}</span>
                </button>
              `).join('')}
            </div>
            <pre class="confirm-css">border-radius: ${tweaks.borderRadius}px;
border-width: ${tweaks.borderWidth}px;
box-shadow: 0 ${tweaks.shadowDepth}px ${tweaks.shadowDepth * 2}px rgba(0,0,0,.4);
backdrop-filter: blur(${tweaks.backdropBlur}px);
--glow: ${tweaks.glowIntensity};</pre>
            <div class="confirm-sheet-actions">
              <button class="dock-btn" id="confirm-copy-css">${escapeHtml(t('dock.copyCss'))}</button>
              <button class="dock-btn" id="confirm-open-detail">${escapeHtml(t('dock.openSandbox'))}</button>
              <button class="dock-btn" id="confirm-to-compare">${escapeHtml(t('dock.raiseCompare'))}</button>
              <button class="dock-btn ghost" id="confirm-browse">${escapeHtml(t('dock.browse'))}</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function bind(root, draft, confirmed) {
    root.querySelector('#dock-open-detail')?.addEventListener('click', () => {
      if (draft) openDetailFor(draft.categoryId, draft.id);
    });
    root.querySelector('#dock-confirm')?.addEventListener('click', () => {
      if (draft) confirmStyle(draft.id);
    });
    root.querySelector('#dock-compare')?.addEventListener('click', () => {
      if (!draft) return;
      openSplitCompare(draft.id);
    });
    root.querySelector('#dock-bookmark')?.addEventListener('click', () => {
      if (!draft) return;
      appState.toggleBookmark(draft.id);
      synthAudio.playSfx('BOOKMARK');
    });
    root.querySelector('#dock-clear')?.addEventListener('click', () => {
      synthAudio.playSfx('CLOSE');
      appState.setState({ draftSubId: null, confirmSheetOpen: false });
    });
    root.querySelector('#dock-open-confirmed')?.addEventListener('click', () => {
      if (!confirmed) return;
      appState.setState({ confirmSheetOpen: !appState.getState().confirmSheetOpen, draftSubId: confirmed.id });
    });
    root.querySelector('#confirm-sheet-close')?.addEventListener('click', () => {
      appState.setState({ confirmSheetOpen: false });
    });
    root.querySelector('#confirm-copy-css')?.addEventListener('click', () => {
      const t = appState.getState().liveTweaks;
      const css = `.theme-${confirmed.id} {\n  border-radius: ${t.borderRadius}px;\n  border-width: ${t.borderWidth}px;\n  --glow: ${t.glowIntensity};\n}`;
      copyToClipboard(css, 'CSS Snippet');
    });
    root.querySelector('#confirm-open-detail')?.addEventListener('click', () => {
      if (confirmed) openDetailFor(confirmed.categoryId, confirmed.id);
    });
    root.querySelector('#confirm-to-compare')?.addEventListener('click', () => {
      if (confirmed) openSplitCompare(confirmed.id);
    });
    root.querySelector('#confirm-browse')?.addEventListener('click', () => {
      appState.setState({ confirmSheetOpen: false });
    });
    root.querySelectorAll('.confirm-swatch').forEach((btn) => {
      btn.addEventListener('click', () => copyToClipboard(btn.dataset.hex, btn.dataset.name));
    });
    root.querySelectorAll('.dock-recent-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const sub = findSubById(btn.getAttribute('data-recent-id'));
        if (sub) selectDraft(sub.categoryId, sub.id);
      });
    });
  }

  appState.subscribe((state, prev) => {
    if (
      state.currentView !== prev?.currentView ||
      state.draftSubId !== prev?.draftSubId ||
      state.confirmedStyleId !== prev?.confirmedStyleId ||
      state.confirmSheetOpen !== prev?.confirmSheetOpen ||
      state.recentlyViewed !== prev?.recentlyViewed ||
      state.bookmarks !== prev?.bookmarks ||
      state.compareSubIds !== prev?.compareSubIds
    ) {
      paint();
    }
  });

  paint();
}
