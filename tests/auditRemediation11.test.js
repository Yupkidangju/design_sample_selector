import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { getAllStyles, getCategories, getFacetDefinitions } from '../src/catalog/index.js';
import { parseDiscoverySearch } from '../src/catalog/discoveryUrl.js';
import { serializeDiscoverySearch } from '../src/catalog/discoveryUrl.js';
import { queryCatalogStyles } from '../src/catalog/discovery.js';
import { getLocalizedLegacyAllSubDesigns } from '../src/catalog/legacyAdapter.js';
import { AppStateManager } from '../src/state/appState.js';
import { isBasicColorValue } from '../src/catalog/validation/color.js';
import {
  generateLiveCSSSnippet,
  generateLiveDesignSpecMarkdown,
  generateLiveTokensJSON
} from '../src/utils/designSpecGenerator.js';

const PROBLEM_STYLE_IDS = Object.freeze([
  'op-art',
  'space-age',
  'disco-glam',
  'seventies-groovy',
  'cyber-y2k',
  'kawaii-pixel-web',
  'scene-core-web',
  'mcbling-gloss'
]);

test('Audit 11: 999px pill geometry is separate from the bounded surface tuner default', async () => {
  const { TUNER_LIMITS, isTweakValueValid } = await import('../src/tuner/contract.js');
  const styles = getAllStyles();

  assert.equal(TUNER_LIMITS.borderRadius.min, 0);
  assert.equal(TUNER_LIMITS.borderRadius.max, 64);
  for (const style of styles) {
    assert.equal(
      isTweakValueValid('borderRadius', style.defaultTweaks.borderRadius),
      true,
      `${style.id} default radius must satisfy the shared limit`
    );
  }

  for (const id of PROBLEM_STYLE_IDS) {
    const style = styles.find(item => item.id === id);
    assert.ok(style, `missing problem style ${id}`);
    assert.notEqual(style.tokens.radius, '999px');
    assert.equal(style.themeGeometry?.pillRadius, '999px');
  }
});

test('Audit 11: AppState rejects out-of-range tweak patches without changing the last valid value', () => {
  const state = new AppStateManager();
  const before = state.getState().liveTweaks.borderRadius;

  assert.equal(state.setState({ liveTweaks: { borderRadius: 999 } }), false);
  assert.equal(state.getState().liveTweaks.borderRadius, before);
  assert.equal(state.setState({ liveTweaks: { borderRadius: 64 } }), true);
  assert.equal(state.getState().liveTweaks.borderRadius, 64);
});

test('Audit 11: radius propagation uses explicit semantic surfaces and has no broad 39-selector override', async () => {
  const [css, templates] = await Promise.all([
    readFile(new URL('../src/styles/interactive.css', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/archetypeTemplates.js', import.meta.url), 'utf8')
  ]);

  assert.match(css, /\[data-tweak-surface\]/);
  assert.doesNotMatch(css, /\.archetype-unit \.skill-btn[\s\S]*\.archetype-unit \.chat-send-btn/);
  assert.doesNotMatch(css, /--theme-radius:\s*var\(--tweak-radius/);
  assert.ok((templates.match(/data-tweak-surface/g) || []).length >= 8);
});

test('Audit 11: prototype and oversized discovery URL input is ignored without crashing', () => {
  for (const query of [
    '?f=__proto__:x',
    '?f=constructor:x',
    '?f=toString:x',
    `?${'q='.padEnd(9000, 'x')}`
  ]) {
    assert.doesNotThrow(() => parseDiscoverySearch(query));
    const state = parseDiscoverySearch(query);
    assert.deepEqual(state.activeFacets, {});
    assert.ok(state.searchQuery.length <= 120);
  }
});

test('Audit 11: palette stable IDs, not translated display names, own CSS and DTCG machine keys', () => {
  const base = getAllStyles().find(style => style.id === 'swiss-grid');
  const synthetic = {
    ...base,
    name: '合成デザイン',
    nameEn: 'Synthetic Locale',
    shortDesc: '境界テスト',
    palette: [
      { id: 'canvas', name: '背景 色', hex: '#111111', usage: '背景' },
      { id: 'surface', name: '背景 色', hex: '#222222', usage: '表面' }
    ]
  };
  const tweaks = {
    borderRadius: 12,
    borderWidth: 1,
    shadowDepth: 8,
    backdropBlur: 0,
    glowIntensity: 0
  };
  const css = generateLiveCSSSnippet(synthetic, tweaks, 'game', 'tokens', 'ja');
  const tokens = JSON.parse(generateLiveTokensJSON(synthetic, tweaks, 'ja'));

  assert.match(css, /--color-canvas:\s*#111111/);
  assert.match(css, /--color-surface:\s*#222222/);
  assert.ok(tokens.color.palette.canvas);
  assert.ok(tokens.color.palette.surface);
});

test('Audit 11: five lazy locale packs have message parity and complete 120-style catalog overlays', async () => {
  const {
    MESSAGE_KEYS,
    SUPPORTED_LOCALES,
    loadLocaleSnapshot,
    validateLocaleSnapshot
  } = await import('../src/i18n/index.js');

  assert.deepEqual(SUPPORTED_LOCALES, ['ko', 'en', 'ja', 'zh-CN', 'zh-TW']);
  for (const locale of SUPPORTED_LOCALES) {
    const snapshot = await loadLocaleSnapshot(locale);
    const report = validateLocaleSnapshot(snapshot, {
      styles: getAllStyles(),
      categories: getCategories(),
      facets: getFacetDefinitions()
    });
    assert.deepEqual(report.errors, [], `${locale}: ${report.errors.join(', ')}`);
    assert.deepEqual(Object.keys(snapshot.messages).sort(), [...MESSAGE_KEYS].sort());
    assert.equal(Object.keys(snapshot.catalog.styles).length, 120);
    assert.equal(Object.keys(snapshot.catalog.categories).length, 8);
    for (const style of Object.values(snapshot.catalog.styles)) {
      assert.ok(style.name);
      assert.ok(style.summary);
      assert.ok(style.palette.every(item => item.id && item.name && item.usage));
    }
  }
});

test('Audit 11: locale preference follows URL, storage, browser, then Korean fallback', async () => {
  const { resolveLocalePreference } = await import('../src/i18n/index.js');
  assert.equal(resolveLocalePreference({ search: '?lang=ja', stored: 'en', languages: ['zh-TW'] }), 'ja');
  assert.equal(resolveLocalePreference({ search: '', stored: 'zh-CN', languages: ['ja'] }), 'zh-CN');
  assert.equal(resolveLocalePreference({ search: '', stored: 'invalid', languages: ['zh-Hant-TW'] }), 'zh-TW');
  assert.equal(resolveLocalePreference({ search: '?lang=bad', stored: 'bad', languages: ['xx'] }), 'ko');
});

test('Audit 11: locale persistence stores the raw ID consumed by bootstrap precedence', async () => {
  const previousStorage = globalThis.localStorage;
  const values = new Map();
  globalThis.localStorage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key)
  };
  try {
    const { LOCALE_STORAGE_KEY, resolveLocalePreference } = await import('../src/i18n/index.js');
    const state = new AppStateManager();
    assert.equal(state.setState({ locale: 'ja' }), true);
    assert.equal(values.get(LOCALE_STORAGE_KEY), 'ja');
    assert.equal(resolveLocalePreference({ stored: values.get(LOCALE_STORAGE_KEY) }), 'ja');
  } finally {
    if (previousStorage === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = previousStorage;
  }
});

test('Audit 11: catalog color validation matches the artifact consumer grammar', () => {
  assert.equal(isBasicColorValue('#112233'), true);
  assert.equal(isBasicColorValue('rgb(1, 2, 3)'), true);
  assert.equal(isBasicColorValue('linear-gradient(90deg, #112233, #445566)'), true);
  assert.equal(isBasicColorValue('radial-gradient(circle, #112233, #445566)'), false);
  assert.equal(isBasicColorValue('hsl(10, 50%, 50%)'), false);
});

test('Audit 11: locale URL serialization and selected-locale search stay deterministic', async () => {
  const { loadLocaleSnapshot } = await import('../src/i18n/index.js');
  const snapshot = await loadLocaleSnapshot('ja');
  const results = queryCatalogStyles(getAllStyles(), {
    query: 'デザイン',
    localizedStyles: snapshot.catalog.styles,
    sort: 'name-asc'
  });

  assert.equal(results.length, 120);
  assert.match(serializeDiscoverySearch({ locale: 'ja' }), /(?:^|[?&])lang=ja(?:&|$)/);
  assert.equal(parseDiscoverySearch('?lang=zh-TW').locale, 'zh-TW');
});

test('Audit 11: selected-locale name sorting uses the explicit locale collator', async () => {
  const { loadLocaleSnapshot } = await import('../src/i18n/index.js');
  const snapshot = await loadLocaleSnapshot('ko');
  const actual = queryCatalogStyles(getAllStyles(), {
    sort: 'name-asc',
    locale: 'ko',
    localizedStyles: snapshot.catalog.styles
  }).map(style => style.id);
  const expected = [...getAllStyles()].sort((left, right) => (
    snapshot.catalog.styles[left.id].name.localeCompare(
      snapshot.catalog.styles[right.id].name,
      'ko'
    ) || left.order - right.order || left.id.localeCompare(right.id)
  )).map(style => style.id);

  assert.deepEqual(actual, expected);
});

test('Audit 11: locale changes preserve selection, tweaks, mock state selectors, and inspector context', async () => {
  const { activateLocale } = await import('../src/i18n/index.js');
  const state = new AppStateManager();
  state.setState({
    selectedMainCategory: 'swiss',
    selectedSubCategory: 'swiss-grid',
    activeArchetype: 'dashboard',
    activeComponentTab: 'pricing',
    sandboxDevice: 'mobile',
    liveTweaks: { borderRadius: 32 },
    locale: 'ko'
  });
  const before = state.getState();
  await activateLocale('ja');
  state.setState({ locale: 'ja' });
  const after = state.getState();

  for (const key of ['selectedMainCategory', 'selectedSubCategory', 'activeArchetype', 'activeComponentTab', 'sandboxDevice']) {
    assert.equal(after[key], before[key], key);
  }
  assert.deepEqual(after.liveTweaks, before.liveTweaks);
});

test('Audit 11: five locales change human text without changing CSS or DTCG key identity', async () => {
  const { SUPPORTED_LOCALES, loadLocaleSnapshot } = await import('../src/i18n/index.js');
  const cssKeySets = [];
  const jsonKeySets = [];
  for (const locale of SUPPORTED_LOCALES) {
    const snapshot = await loadLocaleSnapshot(locale);
    const design = getLocalizedLegacyAllSubDesigns(snapshot).find(item => item.id === 'swiss-grid');
    const css = generateLiveCSSSnippet(design, design.defaultTweaks, 'game', 'tokens', locale);
    const json = JSON.parse(generateLiveTokensJSON(design, design.defaultTweaks, locale));
    cssKeySets.push([...css.matchAll(/--color-([a-z0-9-]+):/g)].map(match => match[1]));
    jsonKeySets.push(Object.keys(json.color.palette));
  }
  for (const keys of cssKeySets.slice(1)) assert.deepEqual(keys, cssKeySets[0]);
  for (const keys of jsonKeySets.slice(1)) assert.deepEqual(keys, jsonKeySets[0]);
});

test('Audit 11: artifact text boundaries neutralize comment, Markdown, and JSON breaking strings', () => {
  const design = {
    ...getLocalizedLegacyAllSubDesigns(null).find(item => item.id === 'swiss-grid'),
    name: '<script>alert(1)</script>',
    nameEn: '*/ body{display:none} /*',
    shortDesc: '<img src=x onerror=alert(1)>',
    characteristics: ['a|b`c'],
    palette: [{ id: 'canvas', name: '<Canvas>', hex: '#111111', usage: 'a|b' }]
  };
  const css = generateLiveCSSSnippet(design, design.defaultTweaks, 'game', 'tokens', 'ja');
  const markdown = generateLiveDesignSpecMarkdown(design, design.defaultTweaks, 'game', 'mobile', 'ja');
  const json = generateLiveTokensJSON(design, design.defaultTweaks, 'ja');

  assert.doesNotMatch(css, /\*\/ body\{/);
  assert.match(markdown, /&lt;script&gt;/);
  assert.match(markdown, /a\\\|b\\`c/);
  assert.doesNotThrow(() => JSON.parse(json));
});

test('Audit 11: Crostini audio probe exclusion is explicit opt-in and remains visible in evidence', async () => {
  const script = await readFile(
    new URL('../scripts/verifyCatalog120Chrome.js', import.meta.url),
    'utf8'
  );

  assert.match(script, /process\.env\.DSS_SKIP_AUDIO_PROBE === '1'/);
  assert.match(script, /audioPreInit = \{\s*skipped: true,/);
  assert.match(script, /sfxDisabledForRun: true/);
  assert.match(script, /headless Crostini audio device unavailable/);
  assert.match(script, /audioPreInit = \{\s*skipped: false,/);
});

test('Audit 11: Discovery Chrome pagination waits for result state and audits focus separately', async () => {
  const script = await readFile(
    new URL('../scripts/verifyCatalogDiscoveryChrome.js', import.meta.url),
    'utf8'
  );

  assert.match(script, /dataset\.resultId !==/);
  assert.match(script, /behavior: 'instant'/);
  assert.match(script, /hasAttribute\('data-app-pending'\) === false/);
  assert.match(script, /페이지 전환 후 상태 문구 focus 복원 실패/);
});
