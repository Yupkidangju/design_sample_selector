/**
 * Reactive Application State Manager v2.1
 * Observer pattern, LocalStorage persistence for bookmarks / confirmed style / recents.
 */

import { MAIN_CATEGORIES, canonicalizeSubId } from '../data/categories.js';

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
  activeFacets: {},
  sortMode: 'catalog',
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

const ENUM_FIELDS = Object.freeze({
  currentView: new Set(['MAIN', 'DETAIL', 'SPLIT_COMPARE']),
  viewMode: new Set(['GRID', 'BENTO', 'SPECTRUM']),
  sortMode: new Set(['catalog', 'name-asc', 'era-asc', 'era-desc']),
  activeArchetype: new Set(['game', 'web', 'mobile', 'ecommerce', 'blog', 'dashboard', 'media', 'chat']),
  activeComponentTab: new Set(['hero', 'widget', 'form', 'pricing']),
  sandboxDevice: new Set(['desktop', 'mobile']),
  compareReturnView: new Set(['MAIN', 'DETAIL']),
  viewport: new Set(['DESKTOP', 'TABLET', 'MOBILE'])
});
const CATEGORY_IDS = new Set(MAIN_CATEGORIES.map(category => category.id));
const STYLE_ID_FIELDS = new Set([
  'selectedSubCategory',
  'galleryFocusId',
  'draftSubId',
  'confirmedStyleId',
  'peekSubId'
]);
const BOOLEAN_FIELDS = new Set([
  'bookmarkFilterActive',
  'confirmSheetOpen',
  'canvasReady'
]);
const TWEAK_FIELDS = new Set([
  'borderRadius',
  'borderWidth',
  'shadowDepth',
  'backdropBlur',
  'glowIntensity'
]);
const AUDIO_FIELD_TYPES = Object.freeze({
  sfxEnabled: 'boolean',
  isPlaying: 'boolean',
  currentTrackIndex: 'number',
  volume: 'number',
  trackTitle: 'string'
});

function isPlainRecord(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function sanitizeStatePatch(partialState) {
  if (!isPlainRecord(partialState)) {
    return { patch: {}, issues: [{ code: 'STATE_SHAPE_INVALID', field: '$patch' }] };
  }

  const patch = {};
  const issues = [];
  const reject = (code, field) => issues.push({ code, field });

  for (const [field, value] of Object.entries(partialState)) {
    if (!Object.prototype.hasOwnProperty.call(DEFAULT_STATE, field)) {
      reject('STATE_FIELD_UNKNOWN', field);
      continue;
    }

    if (ENUM_FIELDS[field]) {
      if (ENUM_FIELDS[field].has(value)) patch[field] = value;
      else reject('STATE_ENUM_INVALID', field);
      continue;
    }

    if (STYLE_ID_FIELDS.has(field)) {
      if (value === null) {
        patch[field] = null;
      } else {
        const canonicalId = canonicalizeStoredId(value);
        if (canonicalId) patch[field] = canonicalId;
        else reject('STATE_ID_INVALID', field);
      }
      continue;
    }

    if (field === 'compareSubIds') {
      const canonicalIds = Array.isArray(value) && value.length === 2
        ? value.map(canonicalizeStoredId)
        : [];
      if (canonicalIds.length === 2 && canonicalIds.every(Boolean)) patch[field] = canonicalIds;
      else reject('STATE_SHAPE_INVALID', field);
      continue;
    }

    if (field === 'selectedMainCategory') {
      if (value === null || CATEGORY_IDS.has(value)) patch[field] = value;
      else reject('STATE_ID_INVALID', field);
      continue;
    }

    if (field === 'activeFilter') {
      if (value === 'ALL' || CATEGORY_IDS.has(value)) patch[field] = value;
      else reject('STATE_ID_INVALID', field);
      continue;
    }

    if (BOOLEAN_FIELDS.has(field)) {
      if (typeof value === 'boolean') patch[field] = value;
      else reject('STATE_TYPE_INVALID', field);
      continue;
    }

    if (field === 'searchQuery') {
      if (typeof value === 'string') patch[field] = value;
      else reject('STATE_TYPE_INVALID', field);
      continue;
    }

    if (field === 'activeFacets') {
      const valid = isPlainRecord(value) && Object.values(value).every(items => (
        Array.isArray(items) && items.every(item => typeof item === 'string')
      ));
      if (valid) patch[field] = value;
      else reject('STATE_SHAPE_INVALID', field);
      continue;
    }

    if (field === 'bookmarks' || field === 'recentlyViewed') {
      const maxLen = field === 'recentlyViewed' ? 6 : Infinity;
      const canonicalIds = canonicalizeStoredList(value, maxLen);
      if (Array.isArray(value) && canonicalIds.length === value.length) patch[field] = canonicalIds;
      else reject('STATE_ID_INVALID', field);
      continue;
    }

    if (field === 'liveTweaks') {
      const valid = isPlainRecord(value) && Object.entries(value).every(([key, item]) => (
        TWEAK_FIELDS.has(key) && typeof item === 'number' && Number.isFinite(item)
      ));
      if (valid) patch[field] = value;
      else reject('STATE_SHAPE_INVALID', field);
      continue;
    }

    if (field === 'audio') {
      const valid = isPlainRecord(value) && Object.entries(value).every(([key, item]) => (
        AUDIO_FIELD_TYPES[key] === typeof item &&
        (typeof item !== 'number' || Number.isFinite(item))
      ));
      if (valid) patch[field] = value;
      else reject('STATE_SHAPE_INVALID', field);
      continue;
    }
  }

  return { patch, issues };
}


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
    const { patch, issues } = sanitizeStatePatch(partialState);
    if (issues.length) {
      const diagnostics = issues.map(({ code, field }) => `${code}:${field}`);
      console.warn('[AppState] Rejected invalid state fields.', diagnostics);
    }
    if (!Object.keys(patch).length) return false;

    const prevState = { ...this.state };

    const nextAudio = patch.audio
      ? { ...this.state.audio, ...patch.audio }
      : this.state.audio;

    const nextTweaks = patch.liveTweaks
      ? { ...this.state.liveTweaks, ...patch.liveTweaks }
      : this.state.liveTweaks;

    this.state = {
      ...this.state,
      ...patch,
      audio: nextAudio,
      liveTweaks: nextTweaks
    };

    if (patch.bookmarks) {
      saveJSON('dss_bookmarks_v2', this.state.bookmarks);
    }
    if (Object.prototype.hasOwnProperty.call(patch, 'confirmedStyleId')) {
      saveJSON('dss_confirmed_v21', this.state.confirmedStyleId);
    }
    if (patch.recentlyViewed) {
      saveJSON('dss_recent_v21', this.state.recentlyViewed);
    }

    this.notify(prevState);
    return issues.length === 0;
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
    const a = canonicalizeStoredId(id1);
    const b = canonicalizeStoredId(id2);
    if (!a || !b) return false;
    return this.setState({ compareSubIds: [a, b] });
  }

  pushRecentlyViewed(subId) {
    const id = canonicalizeStoredId(subId);
    if (!id) return;
    const next = [id, ...this.state.recentlyViewed.filter((x) => x !== id)].slice(0, 6);
    this.setState({ recentlyViewed: next });
  }

  setActiveArchetype(archetype) {
    if (!ENUM_FIELDS.activeArchetype.has(archetype)) return false;
    return this.setState({ activeArchetype: archetype });
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
