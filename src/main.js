/**
 * Web Design Sample Selector - Main Entry Coordinator
 * Initializes WASM visual engine, Web Audio synth, Header, Main View, Detail View, and Audio Widget.
 */

import './styles/interactive.css';
import { appState } from './state/appState.js';
import { wasmVisualEngine } from './wasm/visualEngine.js';
import { renderHeader } from './components/header.js';
import { renderMainView } from './components/mainView.js';
import { renderDetailView } from './components/detailView.js';
import { renderAudioWidget } from './components/audioWidget.js';
import { renderSelectionDock } from './components/selectionDock.js';
import { renderPeekPreview } from './components/peekPreview.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[DesignSpectrum] Initializing Web Showcase Application...');

  // Target DOM Containers
  const headerContainer = document.getElementById('header-root');
  const mainContainer = document.getElementById('main-root');
  const detailContainer = document.getElementById('detail-root');
  const audioContainer = document.getElementById('audio-widget-root');
  const dockContainer = document.getElementById('selection-dock-root');
  const peekContainer = document.getElementById('peek-root');
  const bgCanvas = document.getElementById('bg-canvas');

  // Initialize WASM Visual Background Canvas Engine
  if (bgCanvas) {
    await wasmVisualEngine.init(bgCanvas);
  }

  // Render App Components
  renderHeader(headerContainer);
  renderMainView(mainContainer);
  renderDetailView(detailContainer);
  renderSelectionDock(dockContainer);
  renderPeekPreview(peekContainer);
  renderAudioWidget(audioContainer);

  console.log('[DesignSpectrum] Application Ready! 🚀');
});
