/**
 * Reactive Application State Manager v2.1
 * Observer pattern, LocalStorage persistence for bookmarks / confirmed style / recents.
 */

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

function loadStoredBookmarks() {
  const parsed = loadJSON('dss_bookmarks_v2', []);
  return Array.isArray(parsed) ? parsed : [];
}

const DEFAULT_STATE = {
  currentView: 'MAIN', // 'MAIN' | 'DETAIL' | 'SPLIT_COMPARE'
  viewMode: 'GRID', // 'GRID' | 'BENTO' | 'SPECTRUM'
  selectedMainCategory: null,
  selectedSubCategory: null,
  activeFilter: 'ALL',
  searchQuery: '',
  activeComponentTab: 'hero', // 'hero' | 'widget' | 'form' | 'pricing'
  sandboxDevice: 'desktop', // 'desktop' | 'mobile'
  compareSubIds: ['swiss-grid', 'neo-brutalism'],
  bookmarks: loadStoredBookmarks(),
  bookmarkFilterActive: false,
  galleryFocusId: null,
  draftSubId: null,
  confirmedStyleId: loadJSON('dss_confirmed_v21', null),
  peekSubId: null,
  confirmSheetOpen: false,
  comparePickerOpen: false,
  comparePickingSlot: null, // 'A' | 'B' | null
  recentlyViewed: (() => {
    const recents = loadJSON('dss_recent_v21', []);
    return Array.isArray(recents) ? recents : [];
  })(),
  liveTweaks: {
    borderRadius: 16,
    borderWidth: 1,
    shadowDepth: 10,
    backdropBlur: 16,
    glowIntensity: 1.0
  },
  audio: {
    bgmEnabled: true,
    sfxEnabled: true,
    isPlaying: false,
    currentTrackIndex: 0,
    volume: 0.5,
    trackTitle: '♪ 01. Ethereal Drift (Lo-Fi Chill Chords)'
  },
  wasmReady: false,
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
    const current = [...this.state.bookmarks];
    const index = current.indexOf(subId);
    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(subId);
    }
    this.setState({ bookmarks: current });
    return index < 0;
  }

  isBookmarked(subId) {
    return this.state.bookmarks.includes(subId);
  }

  setCompareSubIds(id1, id2) {
    this.setState({ compareSubIds: [id1, id2] });
  }

  pushRecentlyViewed(subId) {
    if (!subId) return;
    const next = [subId, ...this.state.recentlyViewed.filter((id) => id !== subId)].slice(0, 6);
    this.setState({ recentlyViewed: next });
  }

  setConfirmedStyle(subId) {
    this.setState({
      confirmedStyleId: subId,
      confirmSheetOpen: true,
      draftSubId: subId
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
