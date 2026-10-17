import { appState } from '../state/appState.js';
import { synthAudio } from '../audio/synthAudio.js';
import { getActiveLocaleSnapshot } from '../i18n/index.js';
import { formatLocaleCopy } from '../i18n/format.js';

export function renderCompactAudioControls(snapshot = getActiveLocaleSnapshot()) {
  const { audio } = appState.getState();
  const label = key => formatLocaleCopy(snapshot?.copy, key).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
  return `<div class="compact-audio-controls">
    <button type="button" data-compact-audio="bgm" aria-pressed="${audio.isPlaying}" aria-label="${label('audio.playTitle')}" title="${label('audio.playTitle')}"><span data-audio-glyph aria-hidden="true">${audio.isPlaying ? 'Ⅱ' : '▶'}</span></button>
    <button type="button" data-compact-audio="sfx" aria-pressed="${audio.sfxEnabled}" aria-label="${label('audio.sfxTitle')}" title="${label('audio.sfxTitle')}"><span aria-hidden="true">SFX</span></button>
    <span class="visually-hidden" data-compact-audio-status role="status"></span>
  </div>`;
}

export function bindCompactAudioControls(root) {
  root.querySelectorAll('[data-compact-audio]').forEach(button => {
    button.addEventListener('click', async () => {
      if (button.dataset.compactAudio === 'sfx') {
        appState.setState({ audio: { sfxEnabled: !appState.getState().audio.sfxEnabled } });
      } else {
        const wasPlaying = synthAudio.isPlaying;
        const playing = await synthAudio.toggleBgm();
        const key = !wasPlaying && !playing ? 'audio.startError' : playing ? 'audio.playing' : 'audio.paused';
        const status = root.querySelector('[data-compact-audio-status]');
        if (status) status.textContent = formatLocaleCopy(getActiveLocaleSnapshot()?.copy, key);
      }
    });
  });
}
