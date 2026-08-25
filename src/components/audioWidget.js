/**
 * Floating Audio Player & BGM Synthesizer Widget v3.0
 * Controls 16 ambient procedural tracks, UI sound effects, master volume, and renders a mini Canvas 2D frequency visualizer.
 */

import { appState } from '../state/appState.js';
import { synthAudio, BGM_TRACKS } from '../audio/synthAudio.js';

export function renderAudioWidget(container) {
  if (!container) return;

  const currentTrack = BGM_TRACKS[0];

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
        <input type="range" class="vol-slider" id="input-audio-volume" min="0" max="1" step="0.05" value="0.5" title="마스터 볼륨 조절">
      </div>
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

  // Button Listeners
  if (playBtn) {
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isNowPlaying = synthAudio.toggleBgm();
      synthAudio.playSfx('CLICK');
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      synthAudio.playNextTrack();
      synthAudio.playSfx('CLICK');
    });
  }

  if (sfxBtn) {
    sfxBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const { audio } = appState.getState();
      const newSfxState = !audio.sfxEnabled;
      appState.setState({ audio: { sfxEnabled: newSfxState } });
      sfxBtn.classList.toggle('active', newSfxState);
      sfxIcon.textContent = newSfxState ? '🔊' : '🔇';
    });
  }

  if (volInput) {
    volInput.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      synthAudio.setVolume(val);
    });
  }

  // Subscribe to State Updates
  appState.subscribe((state) => {
    if (trackTxt && state.audio.trackTitle) trackTxt.textContent = state.audio.trackTitle;
    if (playIcon) playIcon.textContent = state.audio.isPlaying ? '⏸' : '▶';
    if (playBtn) playBtn.classList.toggle('playing', state.audio.isPlaying);
  });

  // Render Mini Spectrum Canvas Animation
  if (specCanvas) {
    const ctx = specCanvas.getContext('2d');
    const freqData = new Uint8Array(32);

    const drawVisualizer = () => {
      requestAnimationFrame(drawVisualizer);
      ctx.clearRect(0, 0, specCanvas.width, specCanvas.height);

      const { audio } = appState.getState();
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

    drawVisualizer();
  }
}
