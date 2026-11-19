/**
 * DESIGN SPECTRUM 3.0 — 소수 정예 20종 마스터 카탈로그
 */

import { MODERN_STYLES } from './styles20-modern.js';
import { EDITORIAL_STYLES } from './styles20-editorial.js';
import { PLAYFUL_STYLES } from './styles20-playful.js';

export const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?' +
  [
    'family=Chakra+Petch:wght@500;600;700',
    'family=Cinzel:wght@500;700;800',
    'family=Fraunces:opsz,wght@9..144,600;9..144,800',
    'family=Fredoka:wght@500;600;700',
    'family=Inter:wght@400;500;600;700',
    'family=JetBrains+Mono:wght@400;500;700',
    'family=Noto+Sans+KR:wght@400;500;700;900',
    'family=Noto+Serif+KR:wght@500;700',
    'family=Orbitron:wght@600;700;800',
    'family=Outfit:wght@500;600;700;800',
    'family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700',
    'family=Press+Start+2P',
    'family=Silkscreen:wght@400;700',
    'family=Space+Grotesk:wght@400;500;700',
    'family=Syne:wght@700;800',
    'display=swap'
  ].join('&');

export const STYLES_20 = Object.freeze([
  ...MODERN_STYLES,
  ...EDITORIAL_STYLES,
  ...PLAYFUL_STYLES
]);

export const STYLE_BY_ID = new Map(STYLES_20.map(style => [style.id, style]));

export const DEFAULT_STYLE_ID = STYLES_20[0].id;

export function getStyleById(id) {
  if (typeof id !== 'string') return null;
  return STYLE_BY_ID.get(id) || null;
}

export function resolveStyle(id) {
  const found = getStyleById(id);
  return {
    style: found || STYLES_20[0],
    wasFallback: Boolean(id && !found)
  };
}

export function getAdjacentStyles(id) {
  const index = STYLES_20.findIndex(style => style.id === id);
  const safeIndex = index >= 0 ? index : 0;
  const prev = STYLES_20[(safeIndex - 1 + STYLES_20.length) % STYLES_20.length];
  const next = STYLES_20[(safeIndex + 1) % STYLES_20.length];
  return { prev, next, index: safeIndex };
}

export function filterStyles({ group = 'all', query = '', bookmarksOnly = false, bookmarks = [] } = {}) {
  const normalizedQuery = String(query || '').trim().toLowerCase();
  const bookmarkSet = new Set(bookmarks);

  return STYLES_20.filter(style => {
    if (group !== 'all' && style.group !== group) return false;
    if (bookmarksOnly && !bookmarkSet.has(style.id)) return false;
    if (!normalizedQuery) return true;

    const haystack = [
      style.id,
      style.number,
      style.nameKo,
      style.nameEn,
      style.tagline,
      ...style.traits,
      style.specimen.headline,
      style.showcase.game.genre
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}
