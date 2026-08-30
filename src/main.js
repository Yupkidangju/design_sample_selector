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

      const isDetailState = state => (
        state.currentView === 'DETAIL' || state.currentView === 'SPLIT_COMPARE'
      );

      const closeLazyDetail = () => appState.setState({ currentView: 'MAIN' });

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
               aria-labelledby="lazy-preview-title" ${failed ? '' : 'aria-busy="true"'}>
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
        if (failed) {
          detailContainer.querySelector('[data-lazy-detail-retry]')?.focus();
        }
      };

      const ensureDetailView = async () => {
        if (detailMounted || !isDetailState(appState.getState())) return;
        const requestId = ++detailRequestId;
        renderLazyDetailState('loading');

        try {
          const detailModule = await loadDetailViewModule();
          if (
            requestId !== detailRequestId ||
            detailMounted ||
            !isDetailState(appState.getState())
          ) return;
          detailModule.renderDetailView(detailContainer);
          detailMounted = true;
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
