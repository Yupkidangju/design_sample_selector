/**
 * 즐겨찾기 영속 저장소 (LocalStorage 안전 래퍼)
 */

const STORAGE_KEY = 'design_spectrum_v3_bookmarks';

export function loadBookmarks(validIds = null) {
  try {
    const raw = window.localStorage?.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const unique = [...new Set(parsed.filter(item => typeof item === 'string'))];
    return validIds ? unique.filter(id => validIds.has(id)) : unique;
  } catch {
    return [];
  }
}

export function saveBookmarks(ids) {
  try {
    window.localStorage?.setItem(STORAGE_KEY, JSON.stringify([...new Set(ids)]));
  } catch {
    /* 저장소 접근 불가 환경에서도 UI 흐름을 막지 않는다. */
  }
}

export function toggleBookmarkId(currentIds, styleId) {
  const exists = currentIds.includes(styleId);
  const next = exists
    ? currentIds.filter(id => id !== styleId)
    : [...currentIds, styleId];
  saveBookmarks(next);
  return next;
}
