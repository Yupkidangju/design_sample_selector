/**
 * Floating Audio Player & BGM Synthesizer Widget v3.0
 * Controls 16 ambient procedural tracks, UI sound effects, master volume, and renders a mini Canvas 2D frequency visualizer.
 */

import { appState } from '../state/appState.js';
import { synthAudio, BGM_TRACKS } from '../audio/synthAudio.js';

const widgetCleanups = new WeakMap();

export function renderAudioWidget(container) {
  if (!container) return;
  widgetCleanups.get(container)?.();

  const currentAudio = appState.getState().audio;
  const currentTrack = BGM_TRACKS[currentAudio.currentTrackIndex] || BGM_TRACKS[0];
  const cleanups = [];

  container.innerHTML = `
    <div class="audio-widget-panel" id="audio-widget-panel">
      <!-- Mini Visualizer Canvas -->
      <div class="visualizer-wrapper">
        <canvas id="audio-spec-canvas" width="140" height="28"></canvas>
      </div>

      <!-- Track Info Marquee -->
      <div class="track-info-display" title="${currentTrack.title} (${currentTrack.mood})">
        <span class="track-marquee-text" id="track-title-txt">♪ ${currentTrack.title} (${currentTrack.mood})</span>
      </div>

      <!-- Control Buttons Group -->
      <div class="audio-controls-group">
        <!-- Play / Pause Button -->
        <button class="audio-ctrl-btn btn-play" id="btn-audio-play" title="BGM 재생 / 일시정지 (Lo-Fi Chill Synth)" aria-label="BGM Play/Pause">
          <span id="icon-play-state">▶</span>
        </button>

        <!-- Next Track Button -->
        <button class="audio-ctrl-btn btn-next" id="btn-audio-next" title="다음 BGM 트랙 변경" aria-label="Next Track">
          <span>⏭</span>
        </button>

        <!-- SFX Toggle Button -->
        <button class="audio-ctrl-btn btn-sfx active" id="btn-audio-sfx" title="UI 인터랙션 효과음 On/Off" aria-label="Toggle Sound Effects">
          <span id="icon-sfx-state">🔊</span>
        </button>
      </div>

      <!-- Master Volume Slider -->
      <div class="volume-slider-group">
        <span class="vol-label">VOL</span>
        <input type="range" class="vol-slider" id="input-audio-volume" min="0" max="1" step="0.05" value="${currentAudio.volume}" title="마스터 볼륨 조절">
      </div>
      <span class="audio-widget-status" id="audio-widget-status" role="status" aria-live="polite"></span>
    </div>
  `;

  const playBtn = container.querySelector('#btn-audio-play');
  const nextBtn = container.querySelector('#btn-audio-next');
  const sfxBtn = container.querySelector('#btn-audio-sfx');
  const volInput = container.querySelector('#input-audio-volume');
  const trackTxt = container.querySelector('#track-title-txt');
  const playIcon = container.querySelector('#icon-play-state');
  const sfxIcon = container.querySelector('#icon-sfx-state');
  const specCanvas = container.querySelector('#audio-spec-canvas');
  const status = container.querySelector('#audio-widget-status');
  let disposed = false;

  const listen = (target, type, listener, options) => {
    if (!target) return;
    target.addEventListener(type, listener, options);
    cleanups.push(() => target.removeEventListener(type, listener, options));
  };

  // Button Listeners
  if (playBtn) {
    listen(playBtn, 'click', async (e) => {
      e.stopPropagation();
      const wasPlaying = synthAudio.isPlaying;
      const isNowPlaying = await synthAudio.toggleBgm();
      if (!wasPlaying && !isNowPlaying) {
        if (status) status.textContent = '오디오를 시작하지 못했습니다. 재생 버튼을 다시 눌러 주세요.';
        return;
      }
      if (status) status.textContent = isNowPlaying ? '배경 음악을 재생합니다.' : '배경 음악을 일시정지했습니다.';
      synthAudio.playSfx('CLICK');
    });
  }

  if (nextBtn) {
    listen(nextBtn, 'click', (e) => {
      e.stopPropagation();
      synthAudio.playNextTrack();
      synthAudio.playSfx('CLICK');
    });
  }

  if (sfxBtn) {
    listen(sfxBtn, 'click', (e) => {
      e.stopPropagation();
      const { audio } = appState.getState();
      const newSfxState = !audio.sfxEnabled;
      appState.setState({ audio: { sfxEnabled: newSfxState } });
      sfxBtn.classList.toggle('active', newSfxState);
      sfxIcon.textContent = newSfxState ? '🔊' : '🔇';
    });
  }

  if (volInput) {
    listen(volInput, 'input', (e) => {
      const val = parseFloat(e.target.value);
      synthAudio.setVolume(val);
    });
  }

  // Render Mini Spectrum Canvas Animation
  const ctx = specCanvas?.getContext?.('2d');
  const freqData = new Uint8Array(32);
  const reducedMotionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  let visualizerRafId = null;

  const cancelVisualizer = () => {
    if (visualizerRafId === null) return;
    cancelAnimationFrame(visualizerRafId);
    visualizerRafId = null;
  };

  const canAnimateVisualizer = state => Boolean(
    ctx
      && !disposed
      && container.isConnected
      && document.visibilityState !== 'hidden'
      && !reducedMotionQuery?.matches
      && state.currentView === 'MAIN'
      && state.audio.isPlaying
  );

  const drawVisualizerFrame = state => {
    if (!ctx || !specCanvas) return;
    ctx.clearRect(0, 0, specCanvas.width, specCanvas.height);

    const { audio } = state;
    if (audio.isPlaying) {
      synthAudio.getByteFrequencyData(freqData);
    } else {
      freqData.fill(0);
    }

    const barWidth = (specCanvas.width / 16) - 2;
    for (let i = 0; i < 16; i++) {
      const value = freqData[i * 2] || (audio.isPlaying ? Math.random() * 8 + 4 : 2);
      const percent = value / 255;
      const height = Math.max(3, specCanvas.height * percent);
      const x = i * (barWidth + 2);
      const y = specCanvas.height - height;

      ctx.fillStyle = audio.isPlaying ? '#00F0FF' : 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(x, y, barWidth, height);
    }
  };

  const drawVisualizer = () => {
    visualizerRafId = null;
    const state = appState.getState();
    if (!canAnimateVisualizer(state)) return;
    drawVisualizerFrame(state);
    visualizerRafId = requestAnimationFrame(drawVisualizer);
  };

  const syncVisualizer = state => {
    if (!ctx) return;
    if (!canAnimateVisualizer(state)) {
      cancelVisualizer();
      drawVisualizerFrame(state);
      return;
    }
    if (visualizerRafId === null) visualizerRafId = requestAnimationFrame(drawVisualizer);
  };

  // Subscribe to State Updates
  const unsubscribe = appState.subscribe((state) => {
    if (trackTxt && state.audio.trackTitle) trackTxt.textContent = state.audio.trackTitle;
    if (playIcon) playIcon.textContent = state.audio.isPlaying ? '⏸' : '▶';
    if (playBtn) playBtn.classList.toggle('playing', state.audio.isPlaying);
    if (volInput && Number(volInput.value) !== state.audio.volume) {
      volInput.value = String(state.audio.volume);
    }
    syncVisualizer(state);
  });

  const syncCurrentVisualizer = () => syncVisualizer(appState.getState());
  listen(document, 'visibilitychange', syncCurrentVisualizer);
  if (reducedMotionQuery?.addEventListener) {
    listen(reducedMotionQuery, 'change', syncCurrentVisualizer);
  } else if (reducedMotionQuery?.addListener) {
    reducedMotionQuery.addListener(syncCurrentVisualizer);
    cleanups.push(() => reducedMotionQuery.removeListener(syncCurrentVisualizer));
  }

  const cleanup = () => {
    if (disposed) return;
    disposed = true;
    cancelVisualizer();
    unsubscribe();
    cleanups.splice(0).forEach(dispose => dispose());
    widgetCleanups.delete(container);
  };
  listen(window, 'pagehide', cleanup, { once: true });
  widgetCleanups.set(container, cleanup);
  return cleanup;
}
