/**
 * Web Design Sample Selector - Main Entry Coordinator
 * Initializes Canvas 2D visual engine, Web Audio synth, Header, Main View, Detail View, and Audio Widget.
 */

import { appState } from './state/appState.js';
import { canvasVisualEngine } from './wasm/visualEngine.js';
import { renderHeader } from './components/header.js';
import { renderMainView } from './components/mainView.js';
import { renderDetailView } from './components/detailView.js';
import { renderAudioWidget } from './components/audioWidget.js';
import { renderSelectionDock } from './components/selectionDock.js';
import { renderPeekPreview } from './components/peekPreview.js';

async function initApp() {
  console.log('[DesignSpectrum] Initializing Web Showcase Application...');

  // Target DOM Containers
  const headerContainer = document.getElementById('header-root');
  const mainContainer = document.getElementById('main-root');
  const detailContainer = document.getElementById('detail-root');
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
  if (mainContainer) renderMainView(mainContainer);
  if (detailContainer) renderDetailView(detailContainer);
  if (dockContainer) renderSelectionDock(dockContainer);
  if (peekContainer) renderPeekPreview(peekContainer);
  if (audioContainer) renderAudioWidget(audioContainer);

  console.log('[DesignSpectrum] Application Ready! 🚀');
}

// Support both direct execution and delayed DOMContentLoaded across different static servers
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
