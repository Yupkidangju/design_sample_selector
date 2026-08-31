import {
  LOCALE_ENDONYMS,
  LOCALE_STORAGE_KEY,
  SUPPORTED_LOCALES,
  normalizeLocale,
  resolveLocalePreference
} from './contract.js';

export { LOCALE_ENDONYMS, LOCALE_STORAGE_KEY, SUPPORTED_LOCALES, normalizeLocale, resolveLocalePreference };

const LOADERS = Object.freeze({
  ko: () => import('./locales/ko.js'),
  en: () => import('./locales/en.js'),
  ja: () => import('./locales/ja.js'),
  'zh-CN': () => import('./locales/zh-CN.js'),
  'zh-TW': () => import('./locales/zh-TW.js')
});

const snapshotCache = new Map();
let activeSnapshot = null;
let epoch = 0;

export const MESSAGE_KEYS = Object.freeze(
  'language search all saved sort catalogOrder nameAscending eraAscending eraDescending grid bento spectrum details bookmark bookmarked inspector palette characteristics pros cons copy copied reset desktop mobile noResults category filters clearFilters liveTuner previewHint designSummary paletteUsage subtitle noSelection compare'.split(' ')
);

export async function loadLocaleSnapshot(requestedLocale = 'ko') {
  const locale = normalizeLocale(requestedLocale) || 'ko';
  if (snapshotCache.has(locale)) return snapshotCache.get(locale);
  const [packModule, overlayModule] = await Promise.all([LOADERS[locale](), import('./catalogOverlay.js')]);
  const pack = packModule.default;
  const snapshot = Object.freeze({
    locale,
    epoch: ++epoch,
    messages: Object.freeze({ ...pack.messages }),
    copy: pack.copy,
    catalog: overlayModule.buildCatalogOverlay(pack)
  });
  snapshotCache.set(locale, snapshot);
  return snapshot;
}

export function validateLocaleSnapshot(snapshot, canonical = {}) {
  const errors = [];
  if (!snapshot || !SUPPORTED_LOCALES.includes(snapshot.locale)) errors.push('locale.invalid');
  const actualMessageKeys = Object.keys(snapshot?.messages || {}).sort();
  if (actualMessageKeys.join('|') !== [...MESSAGE_KEYS].sort().join('|')) errors.push('messages.key-parity');
  for (const [key, records] of [['styles', canonical.styles], ['categories', canonical.categories], ['facets', canonical.facets]]) {
    if (!Array.isArray(records)) continue;
    for (const record of records) if (!snapshot?.catalog?.[key]?.[record.id]) errors.push(`${key}.${record.id}.missing`);
  }
  for (const style of Object.values(snapshot?.catalog?.styles || {})) {
    if (!style.name || !style.summary) errors.push(`styles.${style.id}.text`);
    if (!Array.isArray(style.palette) || style.palette.some(item => !item.id || !item.name || !item.usage)) errors.push(`styles.${style.id}.palette`);
  }
  if (!snapshot?.copy || Object.keys(snapshot.copy).length < 120) errors.push('copy.incomplete');
  const catalogCoverage = snapshot?.catalog?.coverage;
  if (!catalogCoverage) errors.push('catalog.coverage.missing');
  if (catalogCoverage?.placeholders?.length) errors.push('catalog.placeholder');
  return Object.freeze({
    errors: Object.freeze(errors),
    coverage: Object.freeze({
      translated: catalogCoverage?.translated || 0,
      placeholder: catalogCoverage?.placeholders?.length || 0,
      approvedFallbacks: catalogCoverage?.approvedFallbacks || Object.freeze([])
    })
  });
}

export function getActiveLocaleSnapshot() {
  return activeSnapshot;
}

export async function activateLocale(locale) {
  const candidate = await loadLocaleSnapshot(locale);
  const { validateActiveSnapshot } = await import('./catalogOverlay.js');
  const errors = validateActiveSnapshot(candidate, MESSAGE_KEYS);
  if (errors.length) throw Error();
  activeSnapshot = candidate;
  return candidate;
}

export async function commitLocale(locale, stateManager, browserWindow = globalThis.window) {
  const snapshot = await activateLocale(locale);
  if (browserWindow?.document?.documentElement) {
    browserWindow.document.documentElement.lang = snapshot.locale;
  }
  stateManager?.setState?.({ locale: snapshot.locale });
  return snapshot;
}
