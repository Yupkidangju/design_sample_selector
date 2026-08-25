/**
 * Gallery selection helpers — draft, detail, confirm, compare, peek.
 */

import { appState } from '../state/appState.js';
import { synthAudio } from '../audio/synthAudio.js';
import { findSubById } from '../data/categories.js';

let peekTimer = null;
let peekHideTimer = null;

export function selectDraft(catId, subId) {
  if (!subId) return;
  synthAudio.playSfx('CLICK');
  appState.setState({
    draftSubId: subId,
    selectedMainCategory: catId || findSubById(subId)?.categoryId || null,
    galleryFocusId: subId,
    peekSubId: null,
    confirmSheetOpen: false
  });
}

export function openDetailFor(catId, subId) {
  const found = findSubById(subId);
  if (!found) return;
  appState.pushRecentlyViewed(subId);
  synthAudio.playSfx('REVEAL');
  appState.setState({
    currentView: 'DETAIL',
    selectedMainCategory: catId || found.categoryId,
    selectedSubCategory: subId,
    activeComponentTab: 'hero',
    peekSubId: null,
    confirmSheetOpen: false,
    galleryFocusId: subId,
    draftSubId: subId,
    liveTweaks: found.defaultTweaks || appState.getState().liveTweaks
  });
}

export function confirmStyle(subId) {
  const found = findSubById(subId);
  if (!found) return;
  appState.pushRecentlyViewed(subId);
  appState.setConfirmedStyle(subId);
  synthAudio.playSfx('CONFIRM');
}

export function addToCompare(subId, slot = null) {
  const found = findSubById(subId);
  if (!found) return;
  let [a, b] = appState.getState().compareSubIds;
  if (slot === 'A') {
    a = subId;
    if (b === subId) b = a === 'swiss-grid' ? 'neo-brutalism' : 'swiss-grid';
  } else if (slot === 'B') {
    b = subId;
    if (a === subId) a = b === 'neo-brutalism' ? 'swiss-grid' : 'neo-brutalism';
  } else if (a === subId || b === subId) {
    // already slotted
  } else {
    b = a;
    a = subId;
  }
  appState.setCompareSubIds(a, b);
  synthAudio.playSfx('COMPARE');
}

export function toggleCompareSlot(subId) {
  let [a, b] = [...appState.getState().compareSubIds];
  if (a === subId) {
    a = b;
    b = subId === 'neo-brutalism' ? 'swiss-grid' : 'neo-brutalism';
  } else if (b === subId) {
    b = a === 'swiss-grid' ? 'neo-brutalism' : 'swiss-grid';
  } else {
    b = a;
    a = subId;
  }
  appState.setCompareSubIds(a, b);
  synthAudio.playSfx('COMPARE');
}

export function openSplitCompare(subId = null) {
  if (subId) addToCompare(subId, 'A');
  synthAudio.playSfx('COMPARE');
  appState.setState({
    currentView: 'SPLIT_COMPARE',
    peekSubId: null,
    confirmSheetOpen: false,
    comparePickerOpen: false
  });
}

export function schedulePeek(subId, delay = 400) {
  clearTimeout(peekTimer);
  clearTimeout(peekHideTimer);
  if (!subId) return;
  const reduce = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  peekTimer = setTimeout(() => {
    if (appState.getState().currentView !== 'MAIN') return;
    appState.setState({ peekSubId: subId, galleryFocusId: subId });
  }, reduce ? 0 : delay);
}

export function holdPeek(subId) {
  clearTimeout(peekTimer);
  clearTimeout(peekHideTimer);
  if (subId && appState.getState().peekSubId !== subId) {
    appState.setState({ peekSubId: subId });
  }
}

export function cancelPeek(immediate = false) {
  clearTimeout(peekTimer);
  clearTimeout(peekHideTimer);
  if (!appState.getState().peekSubId) return;
  if (immediate) {
    appState.setState({ peekSubId: null });
    return;
  }
  peekHideTimer = setTimeout(() => {
    appState.setState({ peekSubId: null });
  }, 160);
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
