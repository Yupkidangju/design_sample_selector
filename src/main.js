/**
 * Web Design Sample Selector - Main Entry Coordinator
 * Initializes Canvas 2D visual engine, Web Audio synth, Header, Main View, Detail View, and Audio Widget.
 */

import { appState } from './state/appState.js';
import { canvasVisualEngine } from './wasm/visualEngine.js';
import { renderHeader } from './components/header.js';
import { renderMainView } from './components/mainView.js';
import { renderAudioWidget } from './components/audioWidget.js';
import { renderSelectionDock } from './components/selectionDock.js';
import { renderPeekPreview } from './components/peekPreview.js';
import { bindDiscoveryUrlState } from './state/discoveryUrlState.js';
import { renderDiscoveryControls } from './components/discoveryControls.js';
import { loadDetailViewModule } from './components/lazyPreviewLoader.js';

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
  kicker.textContent = 'APPLICATION RECOVERY';
  const title = document.createElement('h2');
  title.id = 'bootstrap-fatal-title';
  title.textContent = '애플리케이션을 시작하지 못했습니다';
  const description = document.createElement('p');
  description.id = 'bootstrap-fatal-description';
  description.textContent = '페이지를 다시 불러와 초기화를 재시도해 주세요.';
  const actions = document.createElement('div');
  actions.className = 'lazy-preview-actions';
  const retry = document.createElement('button');
  retry.type = 'button';
  retry.textContent = '다시 시도';
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
    console.log('[DesignSpectrum] Initializing Web Showcase Application...');

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
    if (dockContainer) renderSelectionDock(dockContainer);
    if (peekContainer) renderPeekPreview(peekContainer);
    if (audioContainer) renderAudioWidget(audioContainer);

    if (detailContainer) {
      let detailMounted = false;
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
      };

      const renderLazyDetailState = (status, retry = () => {}) => {
        const failed = status === 'error';
        detailContainer.style.display = 'block';
        detailContainer.innerHTML = `
          <div class="detail-modal-backdrop"></div>
          <div class="lazy-preview-state" role="dialog" aria-modal="true"
               aria-labelledby="lazy-preview-title" tabindex="-1" ${failed ? '' : 'aria-busy="true"'}>
            <p class="lazy-preview-kicker">ON-DEMAND PREVIEW</p>
            <h2 id="lazy-preview-title">${failed ? '상세 시안을 불러오지 못했습니다' : '상세 시안을 준비하고 있습니다'}</h2>
            <p>${failed
              ? '프리뷰 모듈을 다시 요청하거나 메인 갤러리로 돌아갈 수 있습니다.'
              : '선택한 스타일의 인터랙티브 구성 요소를 불러오는 중입니다.'}</p>
            <div class="lazy-preview-actions">
              ${failed ? '<button type="button" data-lazy-detail-retry>다시 시도</button>' : ''}
              <button type="button" data-lazy-detail-cancel>메인으로 돌아가기</button>
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
          detailModule.renderDetailView(detailContainer);
          detailMounted = true;
          lazyOpener = null;
        } catch {
          if (requestId !== detailRequestId || !isDetailState(appState.getState())) return;
          renderLazyDetailState('error', ensureDetailView);
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

    console.log('[DesignSpectrum] Application Ready! 🚀');
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
