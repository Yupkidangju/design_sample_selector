import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';

import {
  MAIN_CATEGORIES,
  STYLE_MOTION,
  SUB_ID_ALIASES,
  canonicalizeSubId,
  getAllSubDesigns
} from '../src/data/categories.js';
import {
  CATALOG_SCHEMA_VERSION,
  DENSITY_VALUES,
  ID_PATTERN,
  MOTION_VALUES,
  PUBLICATION_STATUSES,
  STYLE_KINDS,
  STYLE_MATURITIES,
  THEME_TOKEN_KEYS,
  deepFreeze,
  isStyleVisible,
  sortByOrderThenId
} from '../src/catalog/contract.js';
import { CATEGORY_DEFINITIONS } from '../src/catalog/categories.js';
import { FACET_DEFINITIONS } from '../src/catalog/facets.js';
import { CORE_FOUNDATION_STYLES } from '../src/catalog/packs/core/styles-foundations.js';
import { CORE_CONTEMPORARY_STYLES } from '../src/catalog/packs/core/styles-contemporary.js';
import { CORE_WAVE_1_STYLES } from '../src/catalog/packs/core/styles-wave-1.js';
import { CORE_PACK_MANIFEST } from '../src/catalog/packs/core/manifest.js';
import {
  EXPANSION_PACK_MANIFESTS,
  EXPANSION_STYLES
} from '../src/catalog/packs/expansion/index.js';
import {
  getAllStyles,
  getCatalogVersion,
  getCategories,
  getFacetDefinitions,
  getPackManifests,
  getStyleById,
  getStylesByCategory,
  resolveCanonicalStyleId
} from '../src/catalog/index.js';
import {
  LEGACY_MAIN_CATEGORIES,
  LEGACY_STYLE_MOTION,
  LEGACY_SUB_ID_ALIASES,
  findLegacySubById,
  getLegacyAllSubDesigns,
  getLegacyMainCategories,
  toLegacySubDesign
} from '../src/catalog/legacyAdapter.js';
import { THEME_TOKENS_MAP } from '../src/utils/designSpecGenerator.js';
import { collectCatalogQualityIssues } from '../src/catalog/validation/quality.js';
import { validateCatalog } from '../src/catalog/validation/index.js';

const EXPECTED_CATEGORY_IDS = [
  'swiss',
  'brutalism',
  'depth',
  'retro',
  'editorial',
  'y2k',
  'hypertech',
  'soft3d'
];

const EXPECTED_STYLE_IDS = [
  'swiss-grid',
  'corporate-minimal',
  'high-contrast-mono',
  'raw-brutalism',
  'neo-brutalism',
  'cyber-brutalism',
  'glassmorphism',
  'neumorphism',
  'skeuomorphism',
  'memphis',
  'synthwave',
  'vaporwave',
  'high-fashion',
  'fluid-organic',
  'dark-minimal-glass',
  'y2k-chrome',
  'frutiger-aero',
  'pixel-arcade',
  'kinetic-type',
  'bento-grid',
  'acid-techno',
  'claymorphism',
  'handcrafted-indie',
  'solarpunk-eco'
];

const EXPECTED_ALIASES = {
  'minimalism-clean': 'high-contrast-mono',
  'acid-techno-brutal': 'cyber-brutalism',
  'glassmorphism-luxe': 'glassmorphism',
  'neumorphism-soft': 'neumorphism',
  'skeuomorphism-classic': 'skeuomorphism',
  'memphis-pattern': 'memphis',
  'synthwave-neon': 'synthwave',
  'vaporwave-80s': 'vaporwave',
  'editorial-serif': 'high-fashion',
  'bauhaus-geometric': 'fluid-organic',
  'organic-nature': 'fluid-organic',
  'darkmode-highcontrast': 'dark-minimal-glass',
  'y2k-chrome-hologram': 'y2k-chrome',
  'frutiger-aero-aqua': 'frutiger-aero',
  'pixel-arcade-8bit': 'pixel-arcade',
  'kinetic-type-motion': 'kinetic-type',
  'bento-ui-precision': 'bento-grid',
  'cyberpunk-hud': 'acid-techno',
  'claymorphism-bubble': 'claymorphism',
  'indie-craft': 'handcrafted-indie',
  'solarpunk-green': 'solarpunk-eco'
};

const WAVE_1_EXPECTATIONS = [
  ['bauhaus-geometry', 'swiss', 'bauhaus-geometry', 'primary-forms', 'shape-orbit'],
  ['de-stijl', 'swiss', 'de-stijl', 'orthogonal-planes', 'plane-reveal'],
  ['flat-design', 'swiss', 'flat-design', 'flat-signifiers', 'color-snap'],
  ['constructivist', 'brutalism', 'constructivist', 'agitprop-diagonal', 'diagonal-drive'],
  ['punk-zine', 'brutalism', 'punk-zine', 'xerox-ransom', 'xerox-jitter'],
  ['material-design', 'depth', 'material-design', 'paper-elevation', 'paper-lift'],
  ['liquid-glass', 'depth', 'liquid-glass', 'refractive-controls', 'lens-shift'],
  ['art-deco', 'retro', 'art-deco', 'deco-sunburst', 'fan-reveal'],
  ['psychedelic-poster', 'retro', 'psychedelic-poster', 'optical-waves', 'poster-warp'],
  ['art-nouveau', 'editorial', 'art-nouveau', 'whiplash-frame', 'vine-trace'],
  ['risograph', 'editorial', 'risograph', 'riso-overprint', 'ink-drift'],
  ['metro-interface', 'hypertech', 'metro-interface', 'typographic-tiles', 'tile-panorama']
];

const LEGACY_STYLE_ID_SET = new Set(EXPECTED_STYLE_IDS);
const WAVE_1_STYLE_IDS = WAVE_1_EXPECTATIONS.map(([id]) => id);
const PUBLIC_STYLE_IDS = [...EXPECTED_STYLE_IDS, ...WAVE_1_STYLE_IDS];
const EXPANSION_STYLE_IDS = EXPANSION_STYLES.map(style => style.id);
const ACTUAL_STYLE_IDS = [...PUBLIC_STYLE_IDS, ...EXPANSION_STYLE_IDS];
const WAVE_1_BATCH_A_IDS = WAVE_1_EXPECTATIONS.slice(0, 4).map(([id]) => id);
const WAVE_1_BATCH_B_IDS = WAVE_1_EXPECTATIONS.slice(4, 8).map(([id]) => id);
const WAVE_1_BATCH_C_IDS = WAVE_1_EXPECTATIONS.slice(8).map(([id]) => id);

test('카테고리는 8개를 유지하고 기존 24종의 상대 순서를 보존한다', () => {
  assert.deepEqual(MAIN_CATEGORIES.map(category => category.id), EXPECTED_CATEGORY_IDS);
  assert.deepEqual(
    getAllSubDesigns().filter(style => LEGACY_STYLE_ID_SET.has(style.id)).map(style => style.id),
    EXPECTED_STYLE_IDS
  );
});

test('기존 alias 전체가 동일한 정규 ID로 해석된다', () => {
  assert.deepEqual(SUB_ID_ALIASES, EXPECTED_ALIASES);

  for (const [alias, canonicalId] of Object.entries(EXPECTED_ALIASES)) {
    assert.equal(canonicalizeSubId(alias), canonicalId);
  }

  for (const canonicalId of EXPECTED_STYLE_IDS) {
    assert.equal(canonicalizeSubId(canonicalId), canonicalId);
  }
});

test('저장된 북마크·확정·최근 alias는 정규 ID로 안전하게 복원된다', async () => {
  const previousLocalStorage = globalThis.localStorage;
  const storedValues = new Map([
    ['dss_bookmarks_v2', JSON.stringify([
      'bauhaus-geometric',
      'fluid-organic',
      'missing-style',
      'y2k-chrome-hologram'
    ])],
    ['dss_confirmed_v21', JSON.stringify('acid-techno-brutal')],
    ['dss_recent_v21', JSON.stringify([
      'minimalism-clean',
      'glassmorphism-luxe',
      'neumorphism-soft',
      'skeuomorphism-classic',
      'memphis-pattern',
      'synthwave-neon',
      'vaporwave-80s',
      'minimalism-clean',
      'unknown-style'
    ])]
  ]);

  globalThis.localStorage = {
    getItem(key) {
      return storedValues.get(key) ?? null;
    },
    setItem(key, value) {
      storedValues.set(key, String(value));
    },
    removeItem(key) {
      storedValues.delete(key);
    }
  };

  try {
    const { appState: restoredState } = await import(
      `../src/state/appState.js?style-contract-storage=${Date.now()}`
    );
    const state = restoredState.getState();

    assert.deepEqual(state.bookmarks, ['fluid-organic', 'y2k-chrome']);
    assert.equal(state.confirmedStyleId, 'cyber-brutalism');
    assert.deepEqual(state.recentlyViewed, [
      'high-contrast-mono',
      'glassmorphism',
      'neumorphism',
      'skeuomorphism',
      'memphis',
      'synthwave'
    ]);

    assert.deepEqual(JSON.parse(storedValues.get('dss_bookmarks_v2')), state.bookmarks);
    assert.equal(JSON.parse(storedValues.get('dss_confirmed_v21')), state.confirmedStyleId);
    assert.deepEqual(JSON.parse(storedValues.get('dss_recent_v21')), state.recentlyViewed);
  } finally {
    if (previousLocalStorage === undefined) {
      delete globalThis.localStorage;
    } else {
      globalThis.localStorage = previousLocalStorage;
    }
  }
});

test('기존 평면 스타일 레코드의 필수 필드와 카테고리 파생 필드를 보존한다', () => {
  const requiredStringFields = [
    'id',
    'name',
    'nameEn',
    'shortDesc',
    'previewType',
    'motionProfile',
    'thumbMotif',
    'categoryId',
    'categoryTitle',
    'categoryTitleEn',
    'accentColor',
    'icon'
  ];

  for (const style of getAllSubDesigns()) {
    for (const field of requiredStringFields) {
      assert.equal(typeof style[field], 'string', `${style.id}.${field}`);
      assert.ok(style[field].length > 0, `${style.id}.${field} must not be empty`);
    }

    assert.ok(Array.isArray(style.moodTags) && style.moodTags.length > 0, style.id);
    assert.ok(Array.isArray(style.characteristics) && style.characteristics.length > 0, style.id);
    assert.ok(Array.isArray(style.pros) && style.pros.length > 0, style.id);
    assert.ok(Array.isArray(style.cons) && style.cons.length > 0, style.id);
    assert.ok(Array.isArray(style.palette) && style.palette.length > 0, style.id);
    assert.equal(typeof style.defaultTweaks, 'object', style.id);

    for (const color of style.palette) {
      assert.equal(typeof color.name, 'string', `${style.id}.palette.name`);
      assert.match(
        color.hex,
        /^(?:#[0-9A-F]{6}|rgba?\([^)]*\))$/i,
        `${style.id}.palette.hex`
      );
      assert.equal(typeof color.usage, 'string', `${style.id}.palette.usage`);
    }
  }
});

test('기존 24종 레거시 콘텐츠의 전체 특성화 지문을 보존한다', () => {
  const serializedContract = JSON.stringify({
    categories: MAIN_CATEGORIES.map(category => ({
      ...category,
      subCategories: category.subCategories.filter(style => LEGACY_STYLE_ID_SET.has(style.id))
    })),
    motion: Object.fromEntries(EXPECTED_STYLE_IDS.map(id => [id, STYLE_MOTION[id]])),
    aliases: SUB_ID_ALIASES
  });
  const digest = createHash('sha256').update(serializedContract).digest('hex');

  assert.equal(digest, '42b216b88fbc47bf9841ba0fe00b80a738f4031d9718f1336695351abba430a3');
});

test('카탈로그 계약 상수와 ID 규칙이 승인 사양을 따른다', () => {
  assert.equal(CATALOG_SCHEMA_VERSION, 1);
  assert.deepEqual(PUBLICATION_STATUSES, ['legacy', 'draft', 'review', 'ready']);
  assert.deepEqual(STYLE_KINDS, [
    'historical-movement',
    'revival',
    'technique',
    'interface-language',
    'microtrend',
    'speculative'
  ]);
  assert.deepEqual(DENSITY_VALUES, ['sparse', 'balanced', 'dense', 'maximal']);
  assert.deepEqual(MOTION_VALUES, ['none', 'restrained', 'expressive', 'intense']);
  assert.deepEqual(STYLE_MATURITIES, ['canonical', 'established', 'emerging', 'experimental']);
  assert.match('bauhaus-geometric', ID_PATTERN);
  assert.doesNotMatch('Bauhaus Geometric', ID_PATTERN);
});

test('카테고리와 facet 정의는 명시적 순서로 정렬되고 재귀 동결된다', () => {
  assert.deepEqual(CATEGORY_DEFINITIONS.map(category => category.id), EXPECTED_CATEGORY_IDS);
  assert.deepEqual(
    FACET_DEFINITIONS.map(facet => facet.id),
    ['kind', 'era', 'lineage', 'media', 'materiality', 'density', 'tone', 'motion', 'region', 'maturity']
  );

  assert.ok(Object.isFrozen(CATEGORY_DEFINITIONS));
  assert.ok(Object.isFrozen(CATEGORY_DEFINITIONS[0].title));
  assert.ok(Object.isFrozen(FACET_DEFINITIONS));
  assert.ok(Object.isFrozen(FACET_DEFINITIONS[0].values));

  assert.throws(() => {
    CATEGORY_DEFINITIONS[0].title.ko = '변경';
  }, TypeError);

  const frozen = deepFreeze({ nested: [{ value: 1 }] });
  assert.ok(Object.isFrozen(frozen.nested[0]));
  assert.throws(() => frozen.nested.push({ value: 2 }), TypeError);

  assert.deepEqual(
    [{ id: 'z', order: 10 }, { id: 'a', order: 10 }, { id: 'b', order: 5 }]
      .sort(sortByOrderThenId)
      .map(item => item.id),
    ['b', 'a', 'z']
  );
});

test('core 24종은 새 StyleRecord 계약으로 레거시 데이터를 무손실 이전한다', () => {
  const canonicalStyles = [...CORE_FOUNDATION_STYLES, ...CORE_CONTEMPORARY_STYLES];
  const legacyStyles = getAllSubDesigns().filter(style => LEGACY_STYLE_ID_SET.has(style.id));
  const tokenKeyMap = {
    background: '--theme-bg',
    surface: '--theme-surface',
    surfaceSubtle: '--theme-surface-subtle',
    border: '--theme-border',
    text: '--theme-text',
    textMuted: '--theme-text-muted',
    accent: '--theme-accent',
    accentSecondary: '--theme-accent-secondary',
    radius: '--theme-radius',
    borderWidth: '--theme-border-width',
    shadow: '--theme-shadow',
    fontFamily: '--theme-font-family',
    glow: '--theme-glow'
  };

  assert.deepEqual(canonicalStyles.map(style => style.id), EXPECTED_STYLE_IDS);
  assert.equal(CORE_FOUNDATION_STYLES.length, 12);
  assert.equal(CORE_CONTEMPORARY_STYLES.length, 12);

  for (const [index, style] of canonicalStyles.entries()) {
    const legacy = legacyStyles[index];
    const expectedAliases = Object.entries(EXPECTED_ALIASES)
      .filter(([, canonicalId]) => canonicalId === style.id)
      .map(([alias]) => alias);

    assert.equal(style.schemaVersion, CATALOG_SCHEMA_VERSION, style.id);
    assert.equal(style.publicationStatus, 'legacy', style.id);
    assert.equal(style.categoryId, legacy.categoryId, style.id);
    assert.equal(style.order, (index + 1) * 10, style.id);
    assert.deepEqual(style.aliases, expectedAliases, style.id);
    assert.deepEqual(style.name, { ko: legacy.name, en: legacy.nameEn }, style.id);
    assert.equal(style.summary.ko, legacy.shortDesc, style.id);
    assert.deepEqual(style.preview, {
      rendererId: legacy.previewType,
      thumbnailId: legacy.thumbMotif,
      motionId: legacy.motionProfile
    }, style.id);
    assert.deepEqual(style.defaultTweaks, legacy.defaultTweaks, style.id);
    assert.deepEqual(style.editorial.moodTags, legacy.moodTags, style.id);
    assert.deepEqual(style.editorial.characteristics, legacy.characteristics, style.id);
    assert.deepEqual(style.editorial.pros, legacy.pros, style.id);
    assert.deepEqual(style.editorial.cons, legacy.cons, style.id);
    assert.deepEqual(style.editorial.accessibilityNotes, [], style.id);
    assert.equal(style.palette.length, legacy.palette.length, style.id);
    assert.deepEqual(
      style.palette.map(color => ({ id: color.id, name: color.name.en, hex: color.value, usage: color.usage.ko })),
      legacy.palette,
      style.id
    );
    assert.deepEqual(
      Object.fromEntries(Object.entries(tokenKeyMap).map(([key, legacyKey]) => [key, THEME_TOKENS_MAP[style.id][legacyKey]])),
      style.tokens,
      style.id
    );
    assert.deepEqual(Object.keys(style.tokens), THEME_TOKEN_KEYS, style.id);
    assert.equal(typeof style.classification.era.label, 'string', style.id);
    assert.ok(style.classification.lineages.length > 0, style.id);
    assert.ok(style.classification.media.length > 0, style.id);
    assert.ok(style.classification.materiality.length > 0, style.id);
    assert.deepEqual(style.provenance, {
      reviewedAt: '2026-08-30',
      sources: [],
      assets: []
    }, style.id);
  }
});

test('선택적 테마 효과는 기존 세 스타일의 runtime blur를 tweak과 분리해 보존한다', () => {
  const styles = getAllStyles({ includeUnpublished: true });
  const effectsByStyleId = Object.fromEntries(
    styles
      .filter(style => PUBLIC_STYLE_IDS.includes(style.id) && style.themeEffects)
      .map(style => [style.id, style.themeEffects])
  );

  assert.equal(CATALOG_SCHEMA_VERSION, 1);
  assert.deepEqual(effectsByStyleId, {
    glassmorphism: { backdropBlur: 20 },
    'frutiger-aero': { backdropBlur: 14 },
    'bento-grid': { backdropBlur: 16 }
  });
  assert.equal(getStyleById('bento-grid').defaultTweaks.backdropBlur, 12);

  for (const effects of Object.values(effectsByStyleId)) {
    assert.ok(Object.isFrozen(effects));
    assert.throws(() => {
      effects.backdropBlur = 0;
    }, TypeError);
  }
});

test('bauhaus-geometric alias는 fluid-organic에 남고 정규 ID로 재사용되지 않는다', () => {
  const canonicalIds = new Set([
    ...CORE_FOUNDATION_STYLES,
    ...CORE_CONTEMPORARY_STYLES
  ].map(style => style.id));

  assert.equal(canonicalIds.has('bauhaus-geometric'), false);
  assert.ok(CORE_CONTEMPORARY_STYLES
    .find(style => style.id === 'fluid-organic')
    .aliases.includes('bauhaus-geometric'));
});

test('공개 카탈로그 API는 actual 120을 결정론적으로 조회한다', () => {
  assert.equal(getCatalogVersion(), CATALOG_SCHEMA_VERSION);
  assert.deepEqual(getCategories(), CATEGORY_DEFINITIONS);
  assert.deepEqual(getFacetDefinitions(), FACET_DEFINITIONS);
  assert.deepEqual(getAllStyles().map(style => style.id), ACTUAL_STYLE_IDS);
  assert.deepEqual(
    getAllStyles({ includeUnpublished: true }).map(style => style.id),
    ACTUAL_STYLE_IDS
  );
  assert.deepEqual(
    getStylesByCategory('retro').map(style => style.id),
    [
      'memphis', 'synthwave', 'vaporwave', 'art-deco', 'psychedelic-poster',
      'mid-century-modern', 'atomic-age', 'pop-art-halftone', 'op-art',
      'space-age', 'disco-glam', 'seventies-groovy', 'eighties-new-wave',
      'retro-computing', 'pulp-comic'
    ]
  );
  assert.deepEqual(getStylesByCategory('missing-category'), []);
  assert.deepEqual(getStylesByCategory(null), []);

  assert.equal(getStyleById('swiss-grid').id, 'swiss-grid');
  assert.equal(getStyleById('minimalism-clean').id, 'high-contrast-mono');
  assert.equal(getStyleById('missing-style'), null);
  assert.equal(getStyleById(24), null);
  assert.equal(resolveCanonicalStyleId('bauhaus-geometric'), 'fluid-organic');
  assert.equal(resolveCanonicalStyleId('missing-style'), null);
  assert.equal(resolveCanonicalStyleId({}), null);
});

test('core manifest와 공개 컬렉션은 버전·소속·불변성 계약을 지킨다', () => {
  assert.equal(CORE_PACK_MANIFEST.schemaVersion, 1);
  assert.equal(CORE_PACK_MANIFEST.id, 'core');
  assert.equal(CORE_PACK_MANIFEST.version, '1.1.0');
  assert.deepEqual(CORE_PACK_MANIFEST.styleIds, PUBLIC_STYLE_IDS);
  assert.deepEqual(getPackManifests(), [CORE_PACK_MANIFEST, ...EXPANSION_PACK_MANIFESTS]);
  assert.ok(Object.isFrozen(CORE_PACK_MANIFEST.styleIds));
  assert.ok(Object.isFrozen(getAllStyles()));
  assert.ok(Object.isFrozen(getAllStyles()[0].tokens));
  assert.ok(Object.isFrozen(getStylesByCategory('swiss')));
});

test('레거시 어댑터는 기존 평면 필드와 카테고리 구조를 보존한다', () => {
  const canonicalStyles = getAllStyles();
  const legacyStyles = getLegacyAllSubDesigns();
  const legacyById = new Map(legacyStyles.map(style => [style.id, style]));
  const expectedAdapterIds = getCategories().flatMap(category =>
    getStylesByCategory(category.id).map(style => style.id)
  );

  assert.equal(getLegacyMainCategories(), LEGACY_MAIN_CATEGORIES);
  assert.equal(legacyStyles.length, 120);
  assert.deepEqual(LEGACY_MAIN_CATEGORIES.map(category => category.id), EXPECTED_CATEGORY_IDS);
  assert.deepEqual(legacyStyles.map(style => style.id), expectedAdapterIds);
  assert.deepEqual(LEGACY_SUB_ID_ALIASES, EXPECTED_ALIASES);

  for (const canonical of canonicalStyles) {
    const projected = toLegacySubDesign(canonical);
    const flattened = legacyById.get(canonical.id);

    assert.deepEqual(projected, {
      id: canonical.id,
      name: canonical.name.ko,
      nameEn: canonical.name.en,
      shortDesc: canonical.summary.ko,
      previewType: canonical.preview.rendererId,
      moodTags: canonical.editorial.moodTags,
      defaultTweaks: canonical.defaultTweaks,
      characteristics: canonical.editorial.characteristics,
      pros: canonical.editorial.pros,
      cons: canonical.editorial.cons,
      palette: canonical.palette.map(color => ({
        id: color.id,
        name: color.name.en,
        hex: color.value,
        usage: color.usage.ko
      })),
      motionProfile: canonical.preview.motionId,
      thumbMotif: canonical.preview.thumbnailId
    });
    assert.equal(flattened.categoryId, canonical.categoryId);
    assert.deepEqual(findLegacySubById(canonical.id), flattened);
  }

  assert.deepEqual(
    LEGACY_STYLE_MOTION['swiss-grid'],
    { motionProfile: 'grid-reveal', thumbMotif: 'grid-lines' }
  );
  assert.equal(findLegacySubById('bauhaus-geometric').id, 'fluid-organic');
  assert.equal(findLegacySubById('missing-style'), null);
});

test('출판 상태와 외부 ID 경계는 허용된 값만 안전하게 처리한다', () => {
  for (const status of ['legacy', 'ready']) {
    assert.equal(isStyleVisible({ publicationStatus: status }), true, status);
  }
  for (const status of ['draft', 'review']) {
    assert.equal(isStyleVisible({ publicationStatus: status }), false, status);
    assert.equal(
      isStyleVisible({ publicationStatus: status }, { includeUnpublished: true }),
      true,
      status
    );
  }
  assert.equal(
    isStyleVisible({ publicationStatus: 'unknown' }, { includeUnpublished: true }),
    false
  );

  const invalidIds = [undefined, null, '', 0, 24, false, {}, [], Symbol('style')];
  for (const id of invalidIds) {
    assert.doesNotThrow(() => resolveCanonicalStyleId(id));
    assert.equal(resolveCanonicalStyleId(id), null);
    assert.doesNotThrow(() => getStyleById(id));
    assert.equal(getStyleById(id), null);
    assert.doesNotThrow(() => getStylesByCategory(id));
    assert.deepEqual(getStylesByCategory(id), []);
  }
});

test('정규 ID·alias와 분류 값은 서로 충돌하지 않고 facet 사전에 속한다', () => {
  const styles = getAllStyles({ includeUnpublished: true });
  const canonicalIds = new Set(styles.map(style => style.id));
  const aliases = styles.flatMap(style => style.aliases);
  const facetValues = new Map(FACET_DEFINITIONS.map(facet => [
    facet.id,
    new Set(facet.values.map(item => item.id))
  ]));

  assert.equal(new Set(aliases).size, aliases.length);
  assert.deepEqual(aliases.filter(alias => canonicalIds.has(alias)), []);

  for (const category of getCategories()) {
    assert.match(category.id, ID_PATTERN);
  }
  for (const facet of getFacetDefinitions()) {
    assert.match(facet.id, ID_PATTERN);
    for (const item of facet.values) assert.match(item.id, ID_PATTERN);
  }
  for (const pack of getPackManifests()) assert.match(pack.id, ID_PATTERN);
  for (const alias of aliases) assert.match(alias, ID_PATTERN);

  for (const style of styles) {
    assert.match(style.id, ID_PATTERN);
    assert.ok(STYLE_KINDS.includes(style.classification.kind), style.id);
    assert.ok(DENSITY_VALUES.includes(style.classification.density), style.id);
    assert.ok(MOTION_VALUES.includes(style.classification.motion), style.id);
    assert.ok(STYLE_MATURITIES.includes(style.classification.maturity), style.id);
    assert.ok(
      style.classification.era.start === null || Number.isInteger(style.classification.era.start),
      style.id
    );
    assert.ok(
      style.classification.era.end === null || Number.isInteger(style.classification.era.end),
      style.id
    );
    assert.ok(
      style.classification.era.start === null
        || style.classification.era.end === null
        || style.classification.era.start <= style.classification.era.end,
      style.id
    );
    for (const value of Object.values(style.tokens)) assert.equal(typeof value, 'string', style.id);
    for (const value of Object.values(style.preview)) assert.match(value, ID_PATTERN, style.id);
    for (const color of style.palette) {
      assert.match(color.id, ID_PATTERN, style.id);
      assert.equal(typeof color.value, 'string', style.id);
    }

    for (const [facetId, values] of [
      ['lineage', style.classification.lineages],
      ['media', style.classification.media],
      ['materiality', style.classification.materiality],
      ['tone', style.classification.tone],
      ['region', style.classification.regions]
    ]) {
      for (const value of values) {
        assert.ok(facetValues.get(facetId).has(value), `${style.id}.${facetId}.${value}`);
      }
    }
  }
});

test('공개 카탈로그의 모든 중첩 컬렉션은 mutation으로 오염되지 않는다', () => {
  const styles = getAllStyles();
  const originalName = styles[0].name.ko;

  assert.throws(() => styles.push(styles[0]), TypeError);
  assert.throws(() => styles[0].aliases.push('new-alias'), TypeError);
  assert.throws(() => styles[0].palette[0].name.ko = '변경', TypeError);
  assert.throws(() => getPackManifests()[0].styleIds.pop(), TypeError);
  assert.equal(getStyleById('swiss-grid').name.ko, originalName);
});

test('Wave 1 공개 계약은 승인된 12종을 더해 Core 36을 구성한다', () => {
  const styles = getAllStyles().filter(style => PUBLIC_STYLE_IDS.includes(style.id));
  const expectedIds = [...EXPECTED_STYLE_IDS, ...WAVE_1_EXPECTATIONS.map(([id]) => id)];

  assert.equal(styles.length, 36);
  assert.deepEqual(styles.map(style => style.id), expectedIds);
  assert.deepEqual(
    Object.fromEntries(getCategories().map(category => [
      category.id,
      styles.filter(style => style.categoryId === category.id).length
    ])),
    { swiss: 6, brutalism: 5, depth: 5, retro: 5, editorial: 5, y2k: 3, hypertech: 4, soft3d: 3 }
  );

  for (const [id, categoryId, rendererId, thumbnailId, motionId] of WAVE_1_EXPECTATIONS) {
    const style = getStyleById(id);
    assert.ok(style, id);
    assert.equal(style.categoryId, categoryId, id);
    assert.equal(style.publicationStatus, 'ready', id);
    assert.deepEqual(style.preview, { rendererId, thumbnailId, motionId }, id);
    assert.ok(style.provenance.sources.length > 0, id);
    assert.ok(style.editorial.accessibilityNotes.length > 0, id);
  }

  assert.equal(resolveCanonicalStyleId('bauhaus-geometric'), 'fluid-organic');
  assert.equal(resolveCanonicalStyleId('bauhaus-geometry'), 'bauhaus-geometry');
  assert.equal(CORE_PACK_MANIFEST.version, '1.1.0');
  assert.equal(CORE_PACK_MANIFEST.title.ko, '코어 36종');
  assert.deepEqual(CORE_PACK_MANIFEST.styleIds, expectedIds);
});

test('Wave 1 비공개 Batch A 레코드는 ready 품질 계약을 만족한다', () => {
  const batch = CORE_WAVE_1_STYLES.filter(style => WAVE_1_BATCH_A_IDS.includes(style.id));

  assert.deepEqual(batch.map(style => style.id), WAVE_1_BATCH_A_IDS);
  assert.equal(Object.isFrozen(CORE_WAVE_1_STYLES), true);
  assert.deepEqual(collectCatalogQualityIssues({ styles: batch }), []);

  for (const style of batch) {
    const expectation = WAVE_1_EXPECTATIONS.find(([id]) => id === style.id);
    assert.equal(style.schemaVersion, CATALOG_SCHEMA_VERSION, style.id);
    assert.equal(style.publicationStatus, 'ready', style.id);
    assert.deepEqual(Object.keys(style.tokens), THEME_TOKEN_KEYS, style.id);
    assert.deepEqual(style.preview, {
      rendererId: expectation[2],
      thumbnailId: expectation[3],
      motionId: expectation[4]
    }, style.id);
    assert.ok(style.provenance.sources.length > 0, style.id);
    assert.ok(style.editorial.accessibilityNotes.length > 0, style.id);
  }

  const legacyAliases = new Set([
    ...CORE_FOUNDATION_STYLES,
    ...CORE_CONTEMPORARY_STYLES
  ].flatMap(style => style.aliases));
  assert.equal(legacyAliases.has('bauhaus-geometric'), true);
  assert.equal(legacyAliases.has('bauhaus-geometry'), false);
});

test('Wave 1 비공개 Batch B 레코드는 재질별 ready 품질 계약을 만족한다', () => {
  const batch = CORE_WAVE_1_STYLES.filter(style => WAVE_1_BATCH_B_IDS.includes(style.id));

  assert.deepEqual(batch.map(style => style.id), WAVE_1_BATCH_B_IDS);
  assert.deepEqual(collectCatalogQualityIssues({ styles: batch }), []);

  for (const style of batch) {
    assert.equal(style.publicationStatus, 'ready', style.id);
    assert.deepEqual(Object.keys(style.tokens), THEME_TOKEN_KEYS, style.id);
    assert.ok(style.palette.length >= 3, style.id);
    assert.ok(style.provenance.sources.length > 0, style.id);
    assert.ok(style.editorial.accessibilityNotes.length > 0, style.id);
  }

  const liquidGlass = batch.find(style => style.id === 'liquid-glass');
  assert.match(liquidGlass.tokens.background, /^#[0-9A-F]{6}$/i);
  assert.match(liquidGlass.tokens.text, /^#[0-9A-F]{6}$/i);
  assert.ok(liquidGlass.editorial.accessibilityNotes.some(note => /투명|대비|backplate/i.test(note)));
});

test('Wave 1 비공개 12종은 확장 facet과 완전한 pack·preview 관계를 통과한다', () => {
  const waveIds = WAVE_1_EXPECTATIONS.map(([id]) => id);
  const report = validateCatalog({
    schemaVersion: CATALOG_SCHEMA_VERSION,
    categories: CATEGORY_DEFINITIONS,
    facets: FACET_DEFINITIONS,
    styles: CORE_WAVE_1_STYLES,
    packs: [{
      schemaVersion: CATALOG_SCHEMA_VERSION,
      id: 'wave-one-fixture',
      version: '1.0.0',
      order: 10,
      title: { ko: 'Wave 1 검증', en: 'Wave 1 fixture' },
      styleIds: waveIds
    }],
    references: {
      rendererIds: WAVE_1_EXPECTATIONS.map(([, , id]) => id),
      thumbnailIds: WAVE_1_EXPECTATIONS.map(([, , , id]) => id),
      motionIds: WAVE_1_EXPECTATIONS.map(([, , , , id]) => id),
      assetPaths: []
    }
  });

  assert.deepEqual(CORE_WAVE_1_STYLES.map(style => style.id), waveIds);
  assert.deepEqual(
    CORE_WAVE_1_STYLES.filter(style => WAVE_1_BATCH_C_IDS.includes(style.id)).map(style => style.id),
    WAVE_1_BATCH_C_IDS
  );
  assert.deepEqual(report.summary, { errorCount: 0, warningCount: 0, totalCount: 0 });
});
