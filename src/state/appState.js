/**
 * Reactive Application State Manager v2.1
 * Observer pattern, LocalStorage persistence for bookmarks / confirmed style / recents.
 */

import { canonicalizeSubId } from '../data/categories.js';

function loadJSON(key, fallback) {
  try {
    if (typeof localStorage === 'undefined') return fallback;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    if (typeof localStorage === 'undefined') return;
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('[AppState] Failed to persist', key, e);
  }
}

function canonicalizeStoredId(id) {
  return canonicalizeSubId(id);
}

function canonicalizeStoredList(ids, maxLen = Infinity) {
  if (!Array.isArray(ids)) return [];
  const out = [];
  const seen = new Set();
  for (const raw of ids) {
    const id = canonicalizeStoredId(raw);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
    if (out.length >= maxLen) break;
  }
  return out;
}

function loadStoredBookmarks() {
  const parsed = loadJSON('dss_bookmarks_v2', []);
  const next = canonicalizeStoredList(parsed);
  if (Array.isArray(parsed) && JSON.stringify(parsed) !== JSON.stringify(next)) {
    saveJSON('dss_bookmarks_v2', next);
  }
  return next;
}

function loadStoredConfirmed() {
  const raw = loadJSON('dss_confirmed_v21', null);
  const id = canonicalizeStoredId(raw);
  if (raw && raw !== id) saveJSON('dss_confirmed_v21', id);
  return id;
}

function loadStoredRecents() {
  const parsed = loadJSON('dss_recent_v21', []);
  const next = canonicalizeStoredList(parsed, 6);
  if (Array.isArray(parsed) && JSON.stringify(parsed) !== JSON.stringify(next)) {
    saveJSON('dss_recent_v21', next);
  }
  return next;
}

const DEFAULT_STATE = {
  currentView: 'MAIN', // 'MAIN' | 'DETAIL' | 'SPLIT_COMPARE'
  viewMode: 'GRID', // 'GRID' | 'BENTO' | 'SPECTRUM'
  selectedMainCategory: null,
  selectedSubCategory: null,
  activeFilter: 'ALL',
  searchQuery: '',
  activeArchetype: 'game', // 'game' | 'web' | 'mobile' | 'ecommerce' | 'blog' | 'dashboard' | 'media' | 'chat'
  activeComponentTab: 'hero', // 'hero' | 'widget' | 'form' | 'pricing' (sub-tab for web archetype)
  sandboxDevice: 'desktop', // 'desktop' | 'mobile'
  compareSubIds: ['swiss-grid', 'neo-brutalism'],
  compareReturnView: 'MAIN', // 'MAIN' | 'DETAIL' — view that opened split compare
  bookmarks: loadStoredBookmarks(),
  bookmarkFilterActive: false,
  galleryFocusId: null,
  draftSubId: null,
  confirmedStyleId: loadStoredConfirmed(),
  peekSubId: null,
  confirmSheetOpen: false,
  recentlyViewed: loadStoredRecents(),
  liveTweaks: {
    borderRadius: 16,
    borderWidth: 1,
    shadowDepth: 10,
    backdropBlur: 16,
    glowIntensity: 1.0
  },
  audio: {
    sfxEnabled: true,
    isPlaying: false,
    currentTrackIndex: 0,
    volume: 0.5,
    trackTitle: '♪ 01. Ethereal Drift (Lo-Fi Chill Chords)'
  },
  canvasReady: false,
  viewport: 'DESKTOP'
};


class AppStateManager {
  constructor() {
    this.state = { ...DEFAULT_STATE };
    this.listeners = new Set();
    if (typeof window !== 'undefined') {
      this.detectViewport();
      window.addEventListener('resize', () => this.detectViewport());
    }
  }

  detectViewport() {
    if (typeof window === 'undefined') return;
    const w = window.innerWidth;
    let mode = 'DESKTOP';
    if (w < 768) mode = 'MOBILE';
    else if (w < 1200) mode = 'TABLET';

    if (this.state.viewport !== mode) {
      this.setState({ viewport: mode });
    }
  }

  getState() {
    return this.state;
  }

  setState(partialState) {
    const prevState = { ...this.state };

    if (partialState.audio) {
      this.state.audio = { ...this.state.audio, ...partialState.audio };
      delete partialState.audio;
    }

    if (partialState.liveTweaks) {
      this.state.liveTweaks = { ...this.state.liveTweaks, ...partialState.liveTweaks };
      delete partialState.liveTweaks;
    }

    this.state = { ...this.state, ...partialState };

    if (partialState.bookmarks) {
      saveJSON('dss_bookmarks_v2', this.state.bookmarks);
    }
    if (Object.prototype.hasOwnProperty.call(partialState, 'confirmedStyleId')) {
      saveJSON('dss_confirmed_v21', this.state.confirmedStyleId);
    }
    if (partialState.recentlyViewed) {
      saveJSON('dss_recent_v21', this.state.recentlyViewed);
    }

    this.notify(prevState);
  }

  toggleBookmark(subId) {
    const id = canonicalizeStoredId(subId);
    if (!id) return false;
    const current = [...this.state.bookmarks];
    const index = current.indexOf(id);
    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(id);
    }
    this.setState({ bookmarks: current });
    return index < 0;
  }

  isBookmarked(subId) {
    const id = canonicalizeStoredId(subId);
    return Boolean(id && this.state.bookmarks.includes(id));
  }

  setCompareSubIds(id1, id2) {
    const a = canonicalizeStoredId(id1) || id1;
    const b = canonicalizeStoredId(id2) || id2;
    this.setState({ compareSubIds: [a, b] });
  }

  pushRecentlyViewed(subId) {
    const id = canonicalizeStoredId(subId);
    if (!id) return;
    const next = [id, ...this.state.recentlyViewed.filter((x) => x !== id)].slice(0, 6);
    this.setState({ recentlyViewed: next });
  }

  setActiveArchetype(archetype) {
    if (!archetype) return;
    this.setState({ activeArchetype: archetype });
  }

  setConfirmedStyle(subId) {
    const id = canonicalizeStoredId(subId);
    if (!id) return;
    this.setState({
      confirmedStyleId: id,
      confirmSheetOpen: true,
      draftSubId: id
    });
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.state, this.state);
    return () => this.listeners.delete(listener);
  }

  notify(prevState) {
    for (const listener of this.listeners) {
      try {
        listener(this.state, prevState);
      } catch (err) {
        console.error('[AppState] Error in subscriber:', err);
      }
    }
  }
}

export const appState = new AppStateManager();
