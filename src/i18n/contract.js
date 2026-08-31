export const SUPPORTED_LOCALES = Object.freeze(['ko', 'en', 'ja', 'zh-CN', 'zh-TW']);
export const LOCALE_STORAGE_KEY = 'dss_locale_v1';

export const LOCALE_ENDONYMS = Object.freeze({
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文'
});

export function normalizeLocale(value) {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().replace('_', '-');
  if (SUPPORTED_LOCALES.includes(normalized)) return normalized;
  const lower = normalized.toLowerCase();
  if (lower === 'ko' || lower.startsWith('ko-')) return 'ko';
  if (lower === 'en' || lower.startsWith('en-')) return 'en';
  if (lower === 'ja' || lower.startsWith('ja-')) return 'ja';
  if (lower === 'zh-tw' || lower === 'zh-hk' || lower.includes('hant')) return 'zh-TW';
  if (lower === 'zh' || lower.startsWith('zh-')) return 'zh-CN';
  return null;
}

export function resolveLocalePreference({ search = '', stored = '', languages = [] } = {}) {
  let fromUrl = null;
  try {
    fromUrl = normalizeLocale(new URLSearchParams(String(search).slice(0, 4096)).get('lang'));
  } catch { /* malformed query falls through to the next preference */ }
  if (fromUrl) return fromUrl;
  const fromStorage = normalizeLocale(stored);
  if (fromStorage) return fromStorage;
  for (const language of Array.isArray(languages) ? languages : []) {
    const fromBrowser = normalizeLocale(language);
    if (fromBrowser) return fromBrowser;
  }
  return 'ko';
}
