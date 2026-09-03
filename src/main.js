/**
 * Web Design Sample Selector - Main Entry Coordinator
 * Initializes Canvas 2D visual engine, Web Audio synth, Header, Main View, Detail View, and Audio Widget.
 */

import { appState } from './state/appState.js';
import { canvasVisualEngine } from './wasm/visualEngine.js';
import { renderHeader } from './components/header.js';
import { renderMainView } from './components/mainView.js';
import { renderAudioWidget } from './components/audioWidget.js';
import { bindDiscoveryUrlState } from './state/discoveryUrlState.js';
import { renderDiscoveryControls } from './components/discoveryControls.js';
import { loadDetailViewModule } from './components/lazyPreviewLoader.js';
import { recordRecoveryDiagnostic } from './utils/recoveryDiagnostics.js';
import {
  LOCALE_STORAGE_KEY,
  activateLocale,
  commitLocale,
  getActiveLocaleSnapshot,
  resolveLocalePreference
} from './i18n/index.js';
import { formatLocaleCopy } from './i18n/format.js';

function localizedCopy(key, values, fallback) {
  const copy = formatLocaleCopy(getActiveLocaleSnapshot()?.copy, key, values);
  return copy === key ? fallback : copy;
}

function renderFatalBootstrapError(appContainer) {
  const detailContainer = appContainer?.querySelector('#detail-root')
    || document.getElementById('detail-root');
  const host = detailContainer || document.body;
  const existing = document.getElementById('bootstrap-fatal-error');
  if (existing) existing.remove();

  if (detailContainer) detailContainer.style.display = 'block';

  const backdrop = document.createElement('div');
  backdrop.className = 'detail-modal-backdrop';
  backdrop.setAttribute('aria-hidden', 'true');

  const panel = document.createElement('section');
  panel.id = 'bootstrap-fatal-error';
  panel.className = 'lazy-preview-state';
  panel.setAttribute('role', 'alertdialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-labelledby', 'bootstrap-fatal-title');
  panel.setAttribute('aria-describedby', 'bootstrap-fatal-description');

  const kicker = document.createElement('p');
  kicker.className = 'lazy-preview-kicker';
  kicker.textContent = localizedCopy('recovery.fatalTitle', {}, 'Application recovery');
  const title = document.createElement('h2');
  title.id = 'bootstrap-fatal-title';
  title.textContent = localizedCopy('recovery.fatalTitle', {}, 'The application could not start');
  const description = document.createElement('p');
  description.id = 'bootstrap-fatal-description';
  description.textContent = localizedCopy('recovery.fatalDescription', {}, 'Reload the page to retry initialization.');
  const actions = document.createElement('div');
  actions.className = 'lazy-preview-actions';
  const retry = document.createElement('button');
  retry.type = 'button';
  retry.textContent = localizedCopy('recovery.retry', {}, 'Try again');
  retry.addEventListener('click', () => window.location.reload());
  panel.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    event.preventDefault();
    retry.focus();
  });

  actions.appendChild(retry);
  panel.append(kicker, title, description, actions);
  host.append(backdrop, panel);
  retry.focus();
}

async function initApp() {
  const appContainer = document.querySelector('.app-container');
  try {
    let storedLocale = '';
    try { storedLocale = window.localStorage?.getItem(LOCALE_STORAGE_KEY) || ''; } catch { /* 저장소 접근 실패는 감지를 막지 않는다. */ }
    const initialLocale = resolveLocalePreference({
      search: window.location.search,
      stored: storedLocale,
      languages: navigator.languages || [navigator.language]
    });
    try {
      await commitLocale(initialLocale, appState, window);
    } catch {
      await activateLocale('ko');
      appState.setState({ locale: 'ko' });
      document.documentElement.lang = 'ko';
    }

    const interactiveComponentsPromise = import('./components/interactiveEntry.js');

    bindDiscoveryUrlState(appState);

    // Target DOM Containers
    const headerContainer = appContainer?.querySelector('#header-root');
    const mainContainer = appContainer?.querySelector('#main-root');
    const discoveryContainer = appContainer?.querySelector('#discovery-root');
    const detailContainer = appContainer?.querySelector('#detail-root');
    const audioContainer = document.getElementById('audio-widget-root');
    const dockContainer = document.getElementById('selection-dock-root');
    const peekContainer = document.getElementById('peek-root');
    const bgCanvas = document.getElementById('bg-canvas');

    // Initialize Canvas 2D visual background engine
    if (bgCanvas) {
      await canvasVisualEngine.init(bgCanvas);
    }

    // Render App Components
    if (headerContainer) renderHeader(headerContainer);
    if (discoveryContainer) renderDiscoveryControls(discoveryContainer);
    if (mainContainer) renderMainView(mainContainer);
    if (audioContainer) renderAudioWidget(audioContainer);
    if (dockContainer || peekContainer) {
      const { renderSelectionDock, renderPeekPreview } = await interactiveComponentsPromise;
      if (dockContainer) renderSelectionDock(dockContainer);
      if (peekContainer) renderPeekPreview(peekContainer);
    }

    if (detailContainer) {
      let detailMounted = false;
      let detailDispose = null;
      let detailFailureCount = 0;
      let detailRequestId = 0;
      let lazyFocusCleanup = null;
      let lazyOpener = null;

      const isDetailState = state => (
        state.currentView === 'DETAIL' || state.currentView === 'SPLIT_COMPARE'
      );

      const restoreLazyOpener = opener => {
        const focusId = appState.getState().galleryFocusId;
        const fallback = Array.from(document.querySelectorAll('#main-root [data-sub-id]'))
          .find(element => element.dataset.subId === focusId);
        const target = opener?.isConnected ? opener : fallback;
        if (typeof target?.focus === 'function') {
          try { target.focus(); } catch { /* 포커스 복구 실패는 상태 전환을 막지 않는다. */ }
        }
      };

      const releaseLazyFocus = (restore = true) => {
        if (lazyFocusCleanup) {
          lazyFocusCleanup();
          lazyFocusCleanup = null;
        }
        if (restore) restoreLazyOpener(lazyOpener);
      };

      const closeLazyDetail = () => {
        const opener = lazyOpener;
        releaseLazyFocus(false);
        lazyOpener = null;
        appState.setState({ currentView: 'MAIN' });
        restoreLazyOpener(opener);
      };

      const ownLazyFocus = () => {
        releaseLazyFocus(false);
        const dialog = detailContainer.querySelector('.lazy-preview-state');
        if (!dialog) return;

        const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const onKeydown = event => {
          if (event.key === 'Escape') {
            event.preventDefault();
            closeLazyDetail();
            return;
          }
          if (event.key !== 'Tab') return;
          const focusables = Array.from(dialog.querySelectorAll(selector))
            .filter(element => !element.disabled && element.getAttribute('aria-hidden') !== 'true');
          if (!focusables.length) {
            event.preventDefault();
            dialog.focus();
            return;
          }
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        };

        detailContainer.addEventListener('keydown', onKeydown);
        lazyFocusCleanup = () => detailContainer.removeEventListener('keydown', onKeydown);
        (dialog.querySelector('[data-lazy-detail-retry]')
          || dialog.querySelector('[data-lazy-detail-cancel]')
          || dialog).focus();
      };

      const bindLazyDetailActions = retry => {
        detailContainer.querySelector('[data-lazy-detail-cancel]')
          ?.addEventListener('click', closeLazyDetail);
        detailContainer.querySelector('[data-lazy-detail-retry]')
          ?.addEventListener('click', retry);
        detailContainer.querySelector('[data-lazy-detail-reload]')
          ?.addEventListener('click', () => window.location.reload());
      };

      const renderLazyDetailState = (status, retry = () => {}, terminal = false) => {
        const failed = status === 'error';
        const t = (key, fallback) => localizedCopy(key, {}, fallback);
        detailContainer.style.display = 'block';
        detailContainer.innerHTML = `
          <div class="detail-modal-backdrop"></div>
          <div class="lazy-preview-state" role="dialog" aria-modal="true"
               aria-labelledby="lazy-preview-title" tabindex="-1" ${failed ? '' : 'aria-busy="true"'}>
            <p class="lazy-preview-kicker">${failed ? t('recovery.errorTitle', 'Unable to load detail') : t('recovery.loadingTitle', 'Preparing detail')}</p>
            <h2 id="lazy-preview-title">${failed ? t('recovery.errorTitle', 'Unable to load detail') : t('recovery.loadingTitle', 'Preparing detail')}</h2>
            <p>${failed
              ? (terminal
                ? t('recovery.terminalDescription', 'Recovery attempts are complete. Reload or return to the main gallery.')
                : t('recovery.retryDescription', 'Retry the preview module or return to the main gallery.'))
              : t('recovery.loadingDescription', 'Loading interactive components.')}</p>
            <div class="lazy-preview-actions">
              ${failed
                ? (terminal
                  ? `<button type="button" data-lazy-detail-reload>${t('recovery.reload', 'Reload page')}</button>`
                  : `<button type="button" data-lazy-detail-retry>${t('recovery.retry', 'Try again')}</button>`)
                : ''}
              <button type="button" data-lazy-detail-cancel>${t('recovery.backMain', 'Return to main')}</button>
            </div>
          </div>
        `;
        bindLazyDetailActions(retry);
        ownLazyFocus();
      };

      const ensureDetailView = async () => {
        if (detailMounted || !isDetailState(appState.getState())) return;
        if (!lazyOpener) lazyOpener = document.activeElement;
        const requestId = ++detailRequestId;
        renderLazyDetailState('loading');

        try {
          const detailModule = await loadDetailViewModule();
          if (
            requestId !== detailRequestId ||
            detailMounted ||
            !isDetailState(appState.getState())
          ) return;
          // 실제 Detail이 동일 opener를 캡처하도록 loading dialog의 포커스를 먼저 돌려준다.
          releaseLazyFocus(true);
          detailDispose = detailModule.renderDetailView(detailContainer);
          detailMounted = true;
          detailFailureCount = 0;
          lazyOpener = null;
        } catch (error) {
          if (requestId !== detailRequestId || !isDetailState(appState.getState())) return;
          detailFailureCount += 1;
          const terminal = Boolean(error?.terminal) || detailFailureCount >= 2;
          if (error?.code !== 'RECOVERY_IMPORT_FAILED') {
            recordRecoveryDiagnostic({
              code: 'RECOVERY_MOUNT_FAILED',
              phase: 'mount',
              attempt: detailFailureCount,
              resourceClass: 'detail-view',
              terminal
            });
          }
          renderLazyDetailState('error', ensureDetailView, terminal);
        }
      };

      appState.subscribe(state => {
        if (isDetailState(state)) {
          ensureDetailView();
        } else if (!detailMounted) {
          detailRequestId += 1;
          releaseLazyFocus(true);
          lazyOpener = null;
          detailContainer.style.display = 'none';
          detailContainer.innerHTML = '';
        }
      });

      window.addEventListener('pagehide', () => {
        detailDispose?.();
        detailDispose = null;
      }, { once: true });
    }

    // 숨겨진 상태에서도 초기 레이아웃과 웹 폰트 교체를 끝낸 뒤 한 번에 노출한다.
    appContainer?.getBoundingClientRect();
    if (document.fonts?.ready) {
      try {
        await document.fonts.ready;
      } catch {
        // 폰트 요청 실패 시 시스템 폴백으로 계속 표시한다.
      }
    }
  } catch {
    console.error('[DesignSpectrum] Application bootstrap failed.');
    renderFatalBootstrapError(appContainer);
  } finally {
    document.body.removeAttribute('data-app-pending');
  }
}

// Support both direct execution and delayed DOMContentLoaded across different static servers
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
