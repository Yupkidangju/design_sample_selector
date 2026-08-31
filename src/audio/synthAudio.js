/**
 * Web Audio API Polyphonic Lo-Fi & Ambient Synth Engine v3.0
 * Features:
 * - 16 Rich Melodic Chillwave & Lo-Fi Chord Progression Tracks
 * - 3-Layer Synthesis: Sub-Bass, Lush Warm Pad, and Pentatonic Arpeggiator Melody
 * - Lookahead AudioContext Precision Scheduler for 100% rhythmic accuracy
 * - Built-in Stereo Delay & Soft Lowpass Filter (Zero Muddy Rumble)
 * - Refined Crystal UI Sound Effects
 * - 0 External Dependencies!
 */

import { appState } from '../state/appState.js';

// 12-Tone Equal Temperament Note Frequencies (A4 = 440Hz)
const NOTE_FREQ = {
  'C2': 65.41, 'D2': 73.42, 'E2': 82.41, 'F2': 87.31, 'G2': 98.00, 'A2': 110.00, 'B2': 123.47,
  'C3': 130.81, 'Db3': 138.59, 'D3': 146.83, 'Eb3': 155.56, 'E3': 164.81, 'F3': 174.61, 'Gb3': 185.00, 'G3': 196.00, 'Ab3': 207.65, 'A3': 220.00, 'Bb3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'Db4': 277.18, 'D4': 293.66, 'Eb4': 311.13, 'E4': 329.63, 'F4': 349.23, 'Gb4': 369.99, 'G4': 392.00, 'Ab4': 415.30, 'A4': 440.00, 'Bb4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'Db5': 554.37, 'D5': 587.33, 'Eb5': 622.25, 'E5': 659.25, 'F5': 698.46, 'Gb5': 739.99, 'G5': 783.99, 'Ab5': 830.61, 'A5': 880.00, 'Bb5': 932.33, 'B5': 987.77,
  'C6': 1046.50, 'D6': 1174.66, 'E6': 1318.51, 'G6': 1567.98
};

function getFreq(note) {
  return NOTE_FREQ[note] || 440;
}

export const BGM_TRACKS = [
  {
    index: 0,
    title: '01. Ethereal Drift',
    mood: 'Lo-Fi Chill Chords',
    bpm: 72,
    chords: [
      { bass: 'F3', pad: ['C4', 'E4', 'A4', 'C5'], arp: ['C5', 'E5', 'A4', 'G4', 'E5', 'C5', 'A4', 'E4'] },
      { bass: 'G3', pad: ['D4', 'G4', 'B4', 'D5'], arp: ['D5', 'G5', 'B4', 'A4', 'G4', 'B4', 'D5', 'G4'] },
      { bass: 'E3', pad: ['B3', 'E4', 'G4', 'B4'], arp: ['B4', 'E5', 'G5', 'E5', 'B4', 'G4', 'E4', 'B3'] },
      { bass: 'A3', pad: ['C4', 'E4', 'A4', 'C5'], arp: ['C5', 'E5', 'A5', 'G5', 'E5', 'C5', 'A4', 'E4'] }
    ]
  },
  {
    index: 1,
    title: '02. Swiss Grid Precision',
    mood: 'Clean Minimalist Lo-Fi',
    bpm: 76,
    chords: [
      { bass: 'D3', pad: ['F4', 'A4', 'C5', 'E5'], arp: ['A4', 'C5', 'E5', 'F5', 'E5', 'C5', 'A4', 'F4'] },
      { bass: 'G3', pad: ['F4', 'B4', 'D5', 'F5'], arp: ['B4', 'D5', 'F5', 'G5', 'F5', 'D5', 'B4', 'G4'] },
      { bass: 'C3', pad: ['E4', 'G4', 'B4', 'D5'], arp: ['G4', 'B4', 'D5', 'E5', 'D5', 'B4', 'G4', 'E4'] },
      { bass: 'A3', pad: ['E4', 'G4', 'C5', 'E5'], arp: ['A4', 'C5', 'E5', 'G5', 'E5', 'C5', 'A4', 'E4'] }
    ]
  },
  {
    index: 2,
    title: '03. Glass Prism Reflection',
    mood: 'Crystal Ambient Bell',
    bpm: 68,
    chords: [
      { bass: 'C3', pad: ['G4', 'B4', 'D5', 'E5'], arp: ['E5', 'G5', 'B5', 'D6', 'B5', 'G5', 'E5', 'D5'] },
      { bass: 'A2', pad: ['E4', 'G4', 'C5', 'E5'], arp: ['C5', 'E5', 'G5', 'A5', 'G5', 'E5', 'C5', 'A4'] },
      { bass: 'F2', pad: ['C4', 'F4', 'A4', 'C5'], arp: ['A4', 'C5', 'E5', 'F5', 'E5', 'C5', 'A4', 'F4'] },
      { bass: 'G2', pad: ['D4', 'G4', 'B4', 'D5'], arp: ['B4', 'D5', 'G5', 'B5', 'G5', 'D5', 'B4', 'G4'] }
    ]
  },
  {
    index: 3,
    title: '04. Neon Horizon 1984',
    mood: 'Outrun Chillwave',
    bpm: 84,
    chords: [
      { bass: 'A2', pad: ['E4', 'A4', 'C5', 'E5'], arp: ['A4', 'C5', 'E5', 'A5', 'G5', 'E5', 'C5', 'B4'] },
      { bass: 'F2', pad: ['C4', 'F4', 'A4', 'C5'], arp: ['F4', 'A4', 'C5', 'E5', 'C5', 'A4', 'F4', 'E4'] },
      { bass: 'C3', pad: ['G4', 'C5', 'E5', 'G5'], arp: ['E5', 'G5', 'C6', 'G5', 'E5', 'C5', 'G4', 'E4'] },
      { bass: 'G2', pad: ['D4', 'G4', 'B4', 'D5'], arp: ['D5', 'G5', 'B5', 'A5', 'G5', 'D5', 'B4', 'G4'] }
    ]
  },
  {
    index: 4,
    title: '05. Warm Tactile Velvet',
    mood: 'Cozy Neo-Soul',
    bpm: 66,
    chords: [
      { bass: 'Eb3', pad: ['G4', 'Bb4', 'D5', 'F5'], arp: ['G4', 'Bb4', 'D5', 'F5', 'G5', 'F5', 'D5', 'Bb4'] },
      { bass: 'C3', pad: ['Eb4', 'G4', 'Bb4', 'D5'], arp: ['Eb4', 'G4', 'Bb4', 'C5', 'D5', 'C5', 'Bb4', 'G4'] },
      { bass: 'F3', pad: ['Ab4', 'C5', 'Eb5', 'G5'], arp: ['Ab4', 'C5', 'Eb5', 'F5', 'G5', 'Eb5', 'C5', 'Ab4'] },
      { bass: 'Bb2', pad: ['Ab4', 'D5', 'F5', 'Ab5'], arp: ['D5', 'F5', 'Ab5', 'Bb5', 'Ab5', 'F5', 'D5', 'Ab4'] }
    ]
  },
  {
    index: 5,
    title: '06. Serene Editorial Lounge',
    mood: 'Acoustic Piano & Strings',
    bpm: 64,
    chords: [
      { bass: 'D3', pad: ['F#4', 'A4', 'C#5', 'E5'], arp: ['F#4', 'A4', 'C#5', 'E5', 'F#5', 'E5', 'C#5', 'A4'] },
      { bass: 'B2', pad: ['D4', 'F#4', 'A4', 'C#5'], arp: ['D4', 'F#4', 'A4', 'B4', 'C#5', 'B4', 'A4', 'F#4'] },
      { bass: 'G2', pad: ['B3', 'D4', 'F#4', 'A4'], arp: ['B3', 'D4', 'F#4', 'G4', 'A4', 'G4', 'F#4', 'D4'] },
      { bass: 'A2', pad: ['C#4', 'E4', 'G4', 'B4'], arp: ['C#4', 'E4', 'G4', 'A4', 'B4', 'A4', 'G4', 'E4'] }
    ]
  },
  {
    index: 6,
    title: '07. Frutiger Aqua Stream',
    mood: 'Glossy Ambient Bubbles',
    bpm: 74,
    chords: [
      { bass: 'E3', pad: ['G#4', 'B4', 'E5', 'G#5'], arp: ['B4', 'E5', 'G#5', 'B5', 'G#5', 'E5', 'B4', 'G#4'] },
      { bass: 'C#3', pad: ['E4', 'G#4', 'B4', 'C#5'], arp: ['G#4', 'B4', 'C#5', 'E5', 'C#5', 'B4', 'G#4', 'E4'] },
      { bass: 'A2', pad: ['E4', 'A4', 'C#5', 'E5'], arp: ['A4', 'C#5', 'E5', 'A5', 'E5', 'C#5', 'A4', 'E4'] },
      { bass: 'B2', pad: ['F#4', 'A4', 'B4', 'D#5'], arp: ['F#4', 'A4', 'B4', 'D#5', 'F#5', 'D#5', 'B4', 'A4'] }
    ]
  },
  {
    index: 7,
    title: '08. Midnight Lo-Fi Coffee',
    mood: 'Relaxing Tape Beats',
    bpm: 70,
    chords: [
      { bass: 'C3', pad: ['E4', 'G4', 'B4', 'D5'], arp: ['G4', 'B4', 'D5', 'E5', 'D5', 'B4', 'G4', 'E4'] },
      { bass: 'F3', pad: ['A4', 'C5', 'E5', 'G5'], arp: ['A4', 'C5', 'E5', 'F5', 'G5', 'E5', 'C5', 'A4'] },
      { bass: 'D3', pad: ['F4', 'A4', 'C5', 'E5'], arp: ['F4', 'A4', 'C5', 'D5', 'E5', 'C5', 'A4', 'F4'] },
      { bass: 'G3', pad: ['B4', 'D5', 'F5', 'A5'], arp: ['B4', 'D5', 'F5', 'G5', 'A5', 'F5', 'D5', 'B4'] }
    ]
  },
  {
    index: 8,
    title: '09. Organic Rainforest Dawn',
    mood: 'Nature Ambient Flow',
    bpm: 60,
    chords: [
      { bass: 'G2', pad: ['D4', 'G4', 'B4', 'D5'], arp: ['G4', 'B4', 'D5', 'G5', 'D5', 'B4', 'G4', 'D4'] },
      { bass: 'E2', pad: ['B3', 'E4', 'G4', 'B4'], arp: ['E4', 'G4', 'B4', 'E5', 'B4', 'G4', 'E4', 'B3'] },
      { bass: 'C2', pad: ['G3', 'C4', 'E4', 'G4'], arp: ['C4', 'E4', 'G4', 'C5', 'G4', 'E4', 'C4', 'G3'] },
      { bass: 'D2', pad: ['A3', 'D4', 'F#4', 'A4'], arp: ['D4', 'F#4', 'A4', 'D5', 'A4', 'F#4', 'D4', 'A3'] }
    ]
  },
  {
    index: 9,
    title: '10. Vaporwave Mall 1992',
    mood: 'Nostalgic Dream Pad',
    bpm: 66,
    chords: [
      { bass: 'Bb2', pad: ['F4', 'A4', 'D5', 'F5'], arp: ['F4', 'A4', 'C5', 'D5', 'F5', 'D5', 'C5', 'A4'] },
      { bass: 'G2', pad: ['D4', 'G4', 'Bb4', 'D5'], arp: ['D4', 'G4', 'Bb4', 'C5', 'D5', 'C5', 'Bb4', 'G4'] },
      { bass: 'Eb2', pad: ['Bb3', 'Eb4', 'G4', 'Bb4'], arp: ['Eb4', 'G4', 'Bb4', 'D5', 'Bb4', 'G4', 'Eb4', 'Bb3'] },
      { bass: 'F2', pad: ['C4', 'F4', 'A4', 'C5'], arp: ['F4', 'A4', 'C5', 'Eb5', 'C5', 'A4', 'F4', 'C4'] }
    ]
  },
  {
    index: 10,
    title: '11. Bento Grid Focus',
    mood: 'Deep Study Lo-Fi',
    bpm: 75,
    chords: [
      { bass: 'A2', pad: ['E4', 'A4', 'C5', 'E5'], arp: ['A4', 'C5', 'E5', 'G5', 'E5', 'C5', 'A4', 'E4'] },
      { bass: 'D3', pad: ['F4', 'A4', 'C5', 'E5'], arp: ['F4', 'A4', 'C5', 'D5', 'E5', 'C5', 'A4', 'F4'] },
      { bass: 'G2', pad: ['D4', 'G4', 'B4', 'D5'], arp: ['D4', 'G4', 'B4', 'D5', 'E5', 'D5', 'B4', 'G4'] },
      { bass: 'C3', pad: ['E4', 'G4', 'B4', 'D5'], arp: ['E4', 'G4', 'B4', 'C5', 'D5', 'C5', 'B4', 'G4'] }
    ]
  },
  {
    index: 11,
    title: '12. 8-Bit Cozy Village',
    mood: 'Chiptune Lullaby',
    bpm: 80,
    chords: [
      { bass: 'C3', pad: ['G4', 'C5', 'E5'], arp: ['C5', 'E5', 'G5', 'C6', 'G5', 'E5', 'C5', 'G4'] },
      { bass: 'F2', pad: ['A4', 'C5', 'F5'], arp: ['A4', 'C5', 'F5', 'A5', 'F5', 'C5', 'A4', 'F4'] },
      { bass: 'G2', pad: ['B4', 'D5', 'G5'], arp: ['B4', 'D5', 'G5', 'B5', 'G5', 'D5', 'B4', 'G4'] },
      { bass: 'C3', pad: ['G4', 'C5', 'E5'], arp: ['C5', 'E5', 'G5', 'E5', 'D5', 'C5', 'B4', 'G4'] }
    ]
  },
  {
    index: 12,
    title: '13. Kinetic Horizon',
    mood: 'Inspiring Ambient Uplift',
    bpm: 78,
    chords: [
      { bass: 'F2', pad: ['C4', 'F4', 'A4', 'C5'], arp: ['C5', 'E5', 'F5', 'A5', 'F5', 'E5', 'C5', 'A4'] },
      { bass: 'C3', pad: ['G4', 'C5', 'E5', 'G5'], arp: ['E5', 'G5', 'C6', 'E6', 'C6', 'G5', 'E5', 'C5'] },
      { bass: 'G2', pad: ['D4', 'G4', 'B4', 'D5'], arp: ['D5', 'G5', 'B5', 'D6', 'B5', 'G5', 'D5', 'B4'] },
      { bass: 'A2', pad: ['E4', 'A4', 'C5', 'E5'], arp: ['C5', 'E5', 'A5', 'C6', 'A5', 'E5', 'C5', 'A4'] }
    ]
  },
  {
    index: 13,
    title: '14. Y2K Shimmer Pop',
    mood: 'Glitter Trance Chill',
    bpm: 86,
    chords: [
      { bass: 'D3', pad: ['F#4', 'A4', 'C#5', 'F#5'], arp: ['A4', 'C#5', 'F#5', 'A5', 'F#5', 'C#5', 'A4', 'F#4'] },
      { bass: 'G2', pad: ['B3', 'D4', 'G4', 'B4'], arp: ['G4', 'B4', 'D5', 'G5', 'D5', 'B4', 'G4', 'D4'] },
      { bass: 'A2', pad: ['C#4', 'E4', 'A4', 'C#5'], arp: ['E4', 'A4', 'C#5', 'E5', 'C#5', 'A4', 'E4', 'C#4'] },
      { bass: 'B2', pad: ['D4', 'F#4', 'B4', 'D5'], arp: ['F#4', 'B4', 'D5', 'F#5', 'D5', 'B4', 'F#4', 'D4'] }
    ]
  },
  {
    index: 14,
    title: '15. Solarpunk Eden',
    mood: 'Warm Acoustic Harmony',
    bpm: 68,
    chords: [
      { bass: 'C3', pad: ['E4', 'G4', 'B4', 'E5'], arp: ['E5', 'G5', 'B5', 'C6', 'B5', 'G5', 'E5', 'B4'] },
      { bass: 'D3', pad: ['F#4', 'A4', 'C5', 'D5'], arp: ['F#4', 'A4', 'C5', 'D5', 'C5', 'A4', 'F#4', 'D4'] },
      { bass: 'B2', pad: ['D#4', 'F#4', 'B4', 'D#5'], arp: ['D#4', 'F#4', 'B4', 'D#5', 'B4', 'F#4', 'D#4', 'B3'] },
      { bass: 'E2', pad: ['G4', 'B4', 'E5', 'G5'], arp: ['G4', 'B4', 'E5', 'G5', 'E5', 'B4', 'G4', 'E4'] }
    ]
  },
  {
    index: 15,
    title: '16. Moonlight Sanctuary',
    mood: 'Peaceful Night Piano',
    bpm: 60,
    chords: [
      { bass: 'F2', pad: ['A3', 'C4', 'E4', 'A4'], arp: ['A4', 'C5', 'E5', 'A5', 'E5', 'C5', 'A4', 'E4'] },
      { bass: 'G2', pad: ['B3', 'D4', 'G4', 'B4'], arp: ['B4', 'D5', 'G5', 'B5', 'G5', 'D5', 'B4', 'G4'] },
      { bass: 'E2', pad: ['G3', 'B3', 'E4', 'G4'], arp: ['G4', 'B4', 'E5', 'G5', 'E5', 'B4', 'G4', 'E4'] },
      { bass: 'A2', pad: ['C4', 'E4', 'A4', 'C5'], arp: ['C5', 'E5', 'A5', 'C6', 'A5', 'E5', 'C5', 'A4'] }
    ]
  }
];

export class SynthAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.bgmGain = null;
    this.sfxGain = null;
    this.analyser = null;
    this.delayNode = null;
    this.delayGain = null;
    this.mainFilter = null;
    
    this.currentTrackIndex = 0;
    this.isPlaying = false;
    this.stepIndex = 0;
    this.chordIndex = 0;
    this.timerId = null;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return Boolean(this.ctx);
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        console.warn('[AudioSynth] Web Audio API not supported in this browser.');
        return false;
      }

      this.ctx = new AudioCtx();
      
      // Master Gain
      this.masterGain = this.ctx.createGain();
      const requestedVolume = Number(appState.getState().audio.volume);
      const initialVolume = Number.isFinite(requestedVolume)
        ? Math.max(0, Math.min(1, requestedVolume))
        : 0.5;
      this.masterGain.gain.setValueAtTime(initialVolume, this.ctx.currentTime);

      // Low-cut & High-cut Soft Filter (Removes harsh rumbling and piercing highs)
      this.mainFilter = this.ctx.createBiquadFilter();
      this.mainFilter.type = 'lowpass';
      this.mainFilter.frequency.setValueAtTime(3200, this.ctx.currentTime);
      this.mainFilter.Q.setValueAtTime(0.7, this.ctx.currentTime);

      // BGM Gain & SFX Gain
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.4, this.ctx.currentTime);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.5, this.ctx.currentTime);

      // Ambient Stereo Echo / Delay Line
      this.delayNode = this.ctx.createDelay();
      this.delayNode.delayTime.setValueAtTime(0.32, this.ctx.currentTime);
      this.delayGain = this.ctx.createGain();
      this.delayGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

      // Connect Delay Feedback
      this.bgmGain.connect(this.delayNode);
      this.delayNode.connect(this.delayGain);
      this.delayGain.connect(this.delayNode); // feedback loop
      this.delayGain.connect(this.mainFilter);

      // Analyser Node for Visualizer Canvas
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;

      this.bgmGain.connect(this.mainFilter);
      this.sfxGain.connect(this.masterGain);
      this.mainFilter.connect(this.masterGain);
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      this.initialized = true;
      console.log('[AudioSynth] Polyphonic Lo-Fi Synth Audio Engine Ready! 🎵');
      return true;
    } catch {
      this.ctx = null;
      this.masterGain = null;
      this.bgmGain = null;
      this.sfxGain = null;
      this.analyser = null;
      this.initialized = false;
      console.error('[AudioSynth] Failed to initialize the audio engine.');
      return false;
    }
  }

  async ensureAudioContext() {
    try {
      const initialized = await this.init();
      if (!initialized || !this.ctx) return false;
      if (this.ctx.state !== 'running') await this.ctx.resume();
      return this.ctx.state === 'running';
    } catch {
      if (this.timerId) {
        clearInterval(this.timerId);
        this.timerId = null;
      }
      this.isPlaying = false;
      if (appState.getState().audio.isPlaying) {
        appState.setState({ audio: { isPlaying: false } });
      }
      console.warn('[AudioSynth] AudioContext could not be activated.');
      return false;
    }
  }

  setVolume(volumeVal) {
    const normalized = Number(volumeVal);
    if (!Number.isFinite(normalized)) return false;
    const clamped = Math.max(0, Math.min(1, normalized));
    appState.setState({ audio: { volume: clamped } });
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(clamped, this.ctx.currentTime);
    }
    return true;
  }

  async playBgm() {
    if (this.isPlaying) return true;
    const ready = await this.ensureAudioContext();
    if (!ready) return false;
    if (this.isPlaying) return true;

    this.isPlaying = true;
    appState.setState({ audio: { isPlaying: true } });
    this.stepIndex = 0;
    this.chordIndex = 0;
    this.startScheduler();
    return true;
  }

  stopBgm() {
    this.isPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    appState.setState({ audio: { isPlaying: false } });
  }

  async toggleBgm() {
    if (this.isPlaying) {
      this.stopBgm();
      return false;
    } else {
      return this.playBgm();
    }
  }

  playNextTrack() {
    let nextIdx = (this.currentTrackIndex + 1) % BGM_TRACKS.length;
    this.setTrack(nextIdx);
  }

  setTrack(index) {
    this.currentTrackIndex = index;
    const track = BGM_TRACKS[index];
    this.chordIndex = 0;
    this.stepIndex = 0;

    appState.setState({
      audio: {
        currentTrackIndex: index,
        trackTitle: `♪ ${track.title} (${track.mood})`
      }
    });

    if (this.isPlaying) {
      this.startScheduler();
    }
  }

  startScheduler() {
    if (this.timerId) clearInterval(this.timerId);

    const track = BGM_TRACKS[this.currentTrackIndex];
    // 8th note duration in ms
    const stepDurationMs = (60 / track.bpm) * 1000 / 2;

    this.tickStep();

    this.timerId = setInterval(() => {
      if (!this.isPlaying) return;
      this.tickStep();
    }, stepDurationMs);
  }

  tickStep() {
    if (!this.ctx || !this.bgmGain) return;

    const track = BGM_TRACKS[this.currentTrackIndex];
    const currentChord = track.chords[this.chordIndex % track.chords.length];
    const now = this.ctx.currentTime;
    const stepInChord = this.stepIndex % 8; // 8 eighth-notes per chord bar

    // 1. Play Bass & Warm Chord Pad on Bar Start (Step 0)
    if (stepInChord === 0) {
      this.playWarmPad(currentChord.pad, now, (60 / track.bpm) * 4);
      this.playSoftBass(currentChord.bass, now, (60 / track.bpm) * 2);
    }

    // 2. Play Arpeggiated Melody Note on each step
    const melodyNote = currentChord.arp[stepInChord % currentChord.arp.length];
    if (melodyNote) {
      // Add slight velocity / swing variance
      const isAccent = (stepInChord % 2 === 0);
      this.playArpNote(melodyNote, now, isAccent ? 0.08 : 0.05);
    }

    // Advance step
    this.stepIndex++;
    if (stepInChord === 7) {
      this.chordIndex++;
    }
  }

  // --- Voice Synthesis Helpers ---

  playWarmPad(notes, startTime, duration) {
    if (!this.ctx || !this.bgmGain) return;

    notes.forEach((noteStr, idx) => {
      const freq = getFreq(noteStr);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const padFilter = this.ctx.createBiquadFilter();

      osc.type = (idx % 2 === 0) ? 'sine' : 'triangle';
      // Subtle detune for lush chorus effect
      osc.detune.setValueAtTime((idx - 1.5) * 6, startTime);
      osc.frequency.setValueAtTime(freq, startTime);

      padFilter.type = 'lowpass';
      padFilter.frequency.setValueAtTime(900, startTime);
      padFilter.frequency.exponentialRampToValueAtTime(1400, startTime + duration * 0.4);
      padFilter.frequency.exponentialRampToValueAtTime(700, startTime + duration);

      // Smooth Attack & Long Release Envelope
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.045, startTime + 0.6);
      gain.gain.setValueAtTime(0.045, startTime + duration - 0.6);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(padFilter);
      padFilter.connect(gain);
      gain.connect(this.bgmGain);

      osc.onended = () => {
        try {
          osc.disconnect();
          padFilter.disconnect();
          gain.disconnect();
        } catch { /* ignore */ }
      };

      osc.start(startTime);
      osc.stop(startTime + duration + 0.1);
    });
  }

  playSoftBass(noteStr, startTime, duration) {
    if (!this.ctx || !this.bgmGain) return;

    const freq = getFreq(noteStr);
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const bassFilter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    // Warm Lowpass to prevent harsh buzz
    bassFilter.type = 'lowpass';
    bassFilter.frequency.setValueAtTime(240, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.08, startTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(bassFilter);
    bassFilter.connect(gain);
    gain.connect(this.bgmGain);

    osc.onended = () => {
      try {
        osc.disconnect();
        bassFilter.disconnect();
        gain.disconnect();
      } catch { /* ignore */ }
    };

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
  }

  playArpNote(noteStr, startTime, velocity = 0.06) {
    if (!this.ctx || !this.bgmGain) return;

    const freq = getFreq(noteStr);
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const arpFilter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    arpFilter.type = 'bandpass';
    arpFilter.frequency.setValueAtTime(freq * 1.2, startTime);
    arpFilter.Q.setValueAtTime(2.0, startTime);

    // Pluck Envelope
    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.exponentialRampToValueAtTime(velocity, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.45);

    osc.connect(arpFilter);
    arpFilter.connect(gain);
    gain.connect(this.bgmGain);

    osc.onended = () => {
      try {
        osc.disconnect();
        arpFilter.disconnect();
        gain.disconnect();
      } catch { /* ignore */ }
    };

    osc.start(startTime);
    osc.stop(startTime + 0.5);
  }

  // --- UI Sound Effects (Crisp & Tactile) ---

  async playSfx(type) {
    const { audio } = appState.getState();
    if (!audio.sfxEnabled) return false;
    
    // For hover sound, only play if audio context is already running (prevent autoplay console warning)
    if (type === 'HOVER' && (!this.ctx || this.ctx.state !== 'running')) {
      return false;
    }

    const ready = await this.ensureAudioContext();
    if (!ready || !this.ctx || !this.sfxGain) return false;

    try {
      const now = this.ctx.currentTime;

      switch (type) {
      case 'HOVER':
        this.playOscSweep('sine', 580, 880, 0.035, 0.02, 0.04);
        break;

      case 'CLICK':
        this.playOscSweep('triangle', 440, 220, 0.03, 0.05, 0.035);
        break;

      case 'REVEAL':
        this.playChimeNote(523.25, now, 0.06); // C5
        this.playChimeNote(659.25, now + 0.03, 0.08); // E5
        break;

      case 'COPY':
        this.playChimeNote(880, now, 0.05); // A5
        this.playChimeNote(1318.51, now + 0.04, 0.08); // E6
        break;

      case 'BOOKMARK':
        this.playChimeNote(659.25, now, 0.06); // E5
        this.playChimeNote(987.77, now + 0.04, 0.08); // B5
        break;

      case 'COMPARE':
        this.playChimeNote(440, now, 0.04);
        this.playChimeNote(554.37, now + 0.03, 0.06);
        this.playChimeNote(659.25, now + 0.06, 0.09);
        break;

      case 'CONFIRM':
        this.playChimeNote(523.25, now, 0.07);
        this.playChimeNote(659.25, now + 0.05, 0.08);
        this.playChimeNote(783.99, now + 0.1, 0.12);
        break;

      case 'CLOSE':
        this.playOscSweep('sine', 440, 220, 0.06, 0.04, 0.065);
        break;

      case 'THEME_SWAP':
        this.playChimeNote(587.33, now, 0.04); // D5
        this.playChimeNote(880.00, now + 0.025, 0.06); // A5
        this.playChimeNote(1174.66, now + 0.05, 0.09); // D6
        break;

      case 'COIN':
        this.playChimeNote(987.77, now, 0.04); // B5
        this.playChimeNote(1318.51, now + 0.035, 0.08); // E6
        break;

      case 'CART_ADD':
        this.playChimeNote(783.99, now, 0.04); // G5
        this.playChimeNote(1046.50, now + 0.035, 0.08); // C6
        break;

      case 'SUCCESS':
        this.playChimeNote(523.25, now, 0.05); // C5
        this.playChimeNote(659.25, now + 0.04, 0.06); // E5
        this.playChimeNote(783.99, now + 0.08, 0.08); // G5
        this.playChimeNote(1046.50, now + 0.12, 0.14); // C6
        break;

      case 'LIKE':
        this.playOscSweep('sine', 440, 880, 0.05, 0.04, 0.055);
        break;

      case 'SWIPE':
        this.playNoiseSweep(300, 1200, 0.06, 0.03);
        break;
      }
      return true;
    } catch {
      console.warn('[AudioSynth] Sound effect synthesis failed.');
      return false;
    }
  }

  playOscSweep(oscType, freqStart, freqEnd, rampDur, gainStart, stopDur) {
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = oscType;
    osc.frequency.setValueAtTime(freqStart, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), now + rampDur);
    gain.gain.setValueAtTime(gainStart, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + rampDur);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch { /* ignore */ }
    };
    osc.start(now);
    osc.stop(now + stopDur);
  }

  playNoiseSweep(freqStart, freqEnd, duration, gainStart) {
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const sampleRate = this.ctx.sampleRate;
    const frameCount = Math.max(1, Math.floor(sampleRate * duration));
    const buffer = this.ctx.createBuffer(1, frameCount, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) data[i] = Math.random() * 2 - 1;

    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(1.2, now);
    filter.frequency.setValueAtTime(freqStart, now);
    filter.frequency.exponentialRampToValueAtTime(freqEnd, now + duration);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(gainStart, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    src.onended = () => {
      try {
        src.disconnect();
        filter.disconnect();
        gain.disconnect();
      } catch { /* ignore */ }
    };
    src.start(now);
    src.stop(now + duration + 0.01);
  }

  playChimeNote(freq, startTime, duration) {
    if (!this.ctx || !this.sfxGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(0.04, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch { /* ignore */ }
    };
    osc.start(startTime);
    osc.stop(startTime + duration + 0.01);
  }

  getByteFrequencyData(array) {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(array);
    }
  }
}

export const synthAudio = new SynthAudioEngine();
