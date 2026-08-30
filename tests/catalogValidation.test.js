import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  CatalogValidationError,
  assertValidCatalog,
  createCurrentCatalogSnapshot,
  formatCatalogValidationReport,
  validateCatalog,
  validateCurrentCatalog
} from '../src/catalog/validation/index.js';
import {
  createCatalogValidationReport,
  shouldFailCatalogValidation
} from '../src/catalog/validation/report.js';
import {
  getPreviewReferenceInventory,
  hasPreviewReference
} from '../src/preview/index.js';
import { runCatalogValidationCli } from '../scripts/validateCatalog.js';

function issue(overrides) {
  return {
    code: 'FIELD_REQUIRED',
    severity: 'error',
    path: 'styles[example].name.ko',
    message: '필수 필드가 비어 있습니다.',
    entityType: 'style',
    entityId: 'example',
    relatedPath: null,
    ...overrides
  };
}

function facet(id, valueId, selectionMode = 'multiple') {
  return {
    id,
    order: 10,
    label: { ko: id, en: id },
    selectionMode,
    values: [{ id: valueId, order: 10, label: { ko: valueId, en: valueId } }]
  };
}

function createValidCatalogSnapshot() {
  return {
    schemaVersion: 1,
    categories: [{
      id: 'foundation',
      order: 10,
      title: { ko: '기초', en: 'Foundation' },
      description: { ko: '검증용 카테고리' },
      icon: '◆',
      accentColor: '#3366FF',
      tags: ['기초']
    }],
    facets: [
      facet('kind', 'interface-language', 'single'),
      facet('era', '2020s', 'single'),
      facet('lineage', 'modernism'),
      facet('media', 'web-ui'),
      facet('materiality', 'flat'),
      facet('density', 'balanced', 'single'),
      facet('tone', 'professional'),
      facet('motion', 'restrained', 'single'),
      facet('region', 'international'),
      facet('maturity', 'established', 'single')
    ],
    styles: [{
      schemaVersion: 1,
      id: 'example-style',
      aliases: ['example-style-old'],
      categoryId: 'foundation',
      order: 10,
      publicationStatus: 'ready',
      name: { ko: '예시 스타일', en: 'Example Style' },
      summary: { ko: '검증 가능한 최소 예시' },
      classification: {
        kind: 'interface-language',
        era: { start: 2020, end: 2026, label: '2020s' },
        lineages: ['modernism'],
        media: ['web-ui'],
        materiality: ['flat'],
        density: 'balanced',
        tone: ['professional'],
        motion: 'restrained',
        regions: ['international'],
        maturity: 'established'
      },
      tokens: {
        background: '#FFFFFF',
        surface: '#F8FAFC',
        surfaceSubtle: '#F1F5F9',
        border: '#CBD5E1',
        text: '#111827',
        textMuted: '#475569',
        accent: '#2563EB',
        accentSecondary: '#0EA5E9',
        radius: '8px',
        borderWidth: '1px',
        shadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
        fontFamily: "'Inter', sans-serif",
        glow: 'none'
      },
      preview: {
        rendererId: 'example-renderer',
        thumbnailId: 'example-thumbnail',
        motionId: 'example-motion'
      },
      defaultTweaks: {
        borderRadius: 8,
        borderWidth: 1,
        shadowDepth: 8,
        backdropBlur: 0,
        glowIntensity: 0
      },
      palette: [{
        id: 'ink',
        name: { ko: '잉크', en: 'Ink' },
        value: '#111827',
        usage: { ko: '본문' }
      }],
      editorial: {
        moodTags: ['정돈됨'],
        characteristics: ['명확한 계층'],
        pros: ['가독성'],
        cons: ['보수적'],
        accessibilityNotes: ['키보드 포커스와 대비를 유지한다.']
      },
      provenance: {
        reviewedAt: '2026-08-30',
        sources: [{
          title: 'Example source',
          url: 'https://example.com/design',
          publisher: 'Example Publisher',
          accessedAt: '2026-08-30',
          sourceType: 'institutional'
        }],
        assets: []
      }
    }],
    packs: [{
      schemaVersion: 1,
      id: 'core',
      version: '1.0.0',
      order: 10,
      title: { ko: '코어', en: 'Core' },
      styleIds: ['example-style']
    }],
    references: {
      rendererIds: ['example-renderer'],
      thumbnailIds: ['example-thumbnail'],
      motionIds: ['example-motion'],
      assetPaths: []
    }
  };
}

function mutateSnapshot(snapshot, mutate) {
  const copy = structuredClone(snapshot);
  mutate(copy);
  return copy;
}

function issuesAfter(mutate) {
  return validateCatalog(mutateSnapshot(createValidCatalogSnapshot(), mutate)).issues;
}

function assertHasIssue(issues, code, path, severity = 'error') {
  assert.ok(
    issues.some(item => item.code === code && item.path === path && item.severity === severity),
    `${severity} ${code} at ${path} expected:\n${JSON.stringify(issues, null, 2)}`
  );
}

test('유효 snapshot fixture의 손상 helper는 원본을 변경하지 않는다', () => {
  const original = createValidCatalogSnapshot();
  const changed = mutateSnapshot(original, snapshot => {
    snapshot.styles[0].id = 'changed-style';
  });

  assert.equal(original.styles[0].id, 'example-style');
  assert.equal(changed.styles[0].id, 'changed-style');
});

test('진단 보고서는 안정 순서와 재귀 불변 계약을 가진다', () => {
  const report = createCatalogValidationReport([
    issue({
      code: 'SOURCE_REQUIRED',
      severity: 'warning',
      path: 'styles[zulu].provenance.sources',
      entityId: 'zulu'
    }),
    issue({ code: 'TOKEN_REQUIRED', path: 'styles[alpha].tokens.text' }),
    issue({ code: 'FIELD_REQUIRED', path: 'styles[alpha].name.ko' })
  ]);

  assert.deepEqual(
    report.issues.map(({ severity, path, code }) => [severity, path, code]),
    [
      ['error', 'styles[alpha].name.ko', 'FIELD_REQUIRED'],
      ['error', 'styles[alpha].tokens.text', 'TOKEN_REQUIRED'],
      ['warning', 'styles[zulu].provenance.sources', 'SOURCE_REQUIRED']
    ]
  );
  assert.deepEqual(report.summary, { errorCount: 2, warningCount: 1, totalCount: 3 });
  assert.equal(report.valid, false);
  assert.equal(Object.isFrozen(report), true);
  assert.equal(Object.isFrozen(report.issues), true);
  assert.equal(Object.isFrozen(report.issues[0]), true);
  assert.equal(Object.isFrozen(report.summary), true);
  assert.throws(() => report.issues.push(issue({})), TypeError);
});

test('텍스트 포매터와 CatalogValidationError는 기계 계약과 사람용 출력을 분리한다', () => {
  const report = createCatalogValidationReport([
    issue({ code: 'TOKEN_REQUIRED', path: 'styles[alpha].tokens.text' }),
    issue({
      code: 'SOURCE_REQUIRED',
      severity: 'warning',
      path: 'styles[alpha].provenance.sources'
    }),
    issue({
      code: 'SOURCE_REQUIRED',
      severity: 'warning',
      path: 'styles[beta].provenance.sources',
      entityId: 'beta'
    })
  ]);

  const compact = formatCatalogValidationReport(report);
  const verbose = formatCatalogValidationReport(report, { verbose: true });
  const error = new CatalogValidationError(report);

  assert.match(compact, /오류 1개/);
  assert.match(compact, /경고 2개/);
  assert.match(compact, /TOKEN_REQUIRED/);
  assert.match(compact, /SOURCE_REQUIRED.*2개/);
  assert.match(compact, /styles\[alpha\]\.provenance\.sources/);
  assert.doesNotMatch(compact, /styles\[beta\]\.provenance\.sources/);
  assert.match(verbose, /styles\[beta\]\.provenance\.sources/);
  assert.doesNotMatch(verbose, /\u001b\[/);
  assert.equal(error.name, 'CatalogValidationError');
  assert.equal(error.report, report);
  assert.equal(Object.isFrozen(error.report), true);

  const controlCharacters = formatCatalogValidationReport(
    createCatalogValidationReport([
      issue({
        code: 'FIELD_REQUIRED\u001b[31m',
        path: 'styles[unsafe]\n.name',
        message: '잘못된 값\u0007'
      })
    ]),
    { verbose: true }
  );
  assert.doesNotMatch(controlCharacters, /[\u0000-\u0009\u000b-\u001f\u007f-\u009f]/);
  assert.match(controlCharacters, /\\u001b/);
  assert.match(controlCharacters, /\\u000a/);
});

test('validateCatalog은 잘못된 루트와 필수 컬렉션을 구조화해 반환한다', () => {
  const invalidRoot = validateCatalog(null);
  const brokenSnapshot = {
    schemaVersion: 2,
    categories: {},
    facets: [],
    styles: [],
    packs: [],
    references: {
      rendererIds: [],
      thumbnailIds: 'not-an-array',
      motionIds: [],
      assetPaths: []
    }
  };
  const before = structuredClone(brokenSnapshot);
  const report = validateCatalog(brokenSnapshot);

  assert.deepEqual(invalidRoot.issues.map(item => item.code), ['CATALOG_INPUT_INVALID']);
  assert.deepEqual(
    report.issues.map(item => [item.code, item.path]),
    [
      ['CATALOG_INPUT_INVALID', 'catalog.categories'],
      ['REFERENCE_INVENTORY_MISSING', 'catalog.references.thumbnailIds'],
      ['SCHEMA_VERSION_MISMATCH', 'catalog.schemaVersion']
    ]
  );
  assert.deepEqual(brokenSnapshot, before);
  assert.equal(report.valid, false);
});

test('assertValidCatalog은 유효 보고서를 반환하고 오류 보고서만 예외로 승격한다', () => {
  const snapshot = createValidCatalogSnapshot();
  const report = assertValidCatalog(snapshot);

  assert.equal(report.valid, true);
  assert.equal(report.summary.totalCount, 0);
  assert.throws(
    () => assertValidCatalog({ ...snapshot, schemaVersion: 999 }),
    error => error instanceof CatalogValidationError
      && error.report.issues.some(item => item.code === 'SCHEMA_VERSION_MISMATCH')
  );

  const warningsOnly = createCatalogValidationReport([
    issue({ code: 'SOURCE_REQUIRED', severity: 'warning' })
  ]);
  assert.equal(shouldFailCatalogValidation(warningsOnly), false);
  assert.equal(shouldFailCatalogValidation(warningsOnly, { failOnWarnings: true }), true);
});

test('유효 fixture는 구조·토큰·팔레트·트윅 검증을 통과한다', () => {
  const report = validateCatalog(createValidCatalogSnapshot());

  assert.equal(report.valid, true);
  assert.deepEqual(report.issues, []);
});

test('레코드 필수 필드·타입·ID·order·schemaVersion 오류를 구분한다', () => {
  const cases = [
    {
      mutate: snapshot => { snapshot.styles[0].name.ko = ''; },
      code: 'FIELD_REQUIRED',
      path: 'styles[example-style].name.ko'
    },
    {
      mutate: snapshot => { snapshot.categories[0].tags = 'not-an-array'; },
      code: 'FIELD_TYPE_INVALID',
      path: 'categories[foundation].tags'
    },
    {
      mutate: snapshot => { snapshot.categories[0].id = 'Bad ID'; },
      code: 'ID_FORMAT_INVALID',
      path: 'categories[Bad ID].id'
    },
    {
      mutate: snapshot => { snapshot.packs[0].order = 1.5; },
      code: 'ORDER_INVALID',
      path: 'packs[core].order'
    },
    {
      mutate: snapshot => { snapshot.styles[0].schemaVersion = 2; },
      code: 'SCHEMA_VERSION_MISMATCH',
      path: 'styles[example-style].schemaVersion'
    },
    {
      mutate: snapshot => { snapshot.facets[0].selectionMode = 'hybrid'; },
      code: 'FIELD_TYPE_INVALID',
      path: 'facets[kind].selectionMode'
    }
  ];

  for (const currentCase of cases) {
    assertHasIssue(
      issuesAfter(currentCase.mutate),
      currentCase.code,
      currentCase.path
    );
  }
});

test('필수 토큰과 보수적 CSS 값 문법을 검증하고 확장 토큰은 경고한다', () => {
  const missing = issuesAfter(snapshot => { delete snapshot.styles[0].tokens.text; });
  const invalidColor = issuesAfter(snapshot => {
    snapshot.styles[0].tokens.background = 'definitely-not-a-color';
  });
  const invalidDimension = issuesAfter(snapshot => {
    snapshot.styles[0].tokens.radius = 'very-round';
  });
  const malformedFunction = issuesAfter(snapshot => {
    snapshot.styles[0].tokens.accent = 'rgb(255oops, 0, 0)';
  });
  const unknown = issuesAfter(snapshot => {
    snapshot.styles[0].tokens.experimentalDepth = '12px';
  });

  assertHasIssue(missing, 'TOKEN_REQUIRED', 'styles[example-style].tokens.text');
  assertHasIssue(
    invalidColor,
    'TOKEN_VALUE_INVALID',
    'styles[example-style].tokens.background'
  );
  assertHasIssue(
    invalidDimension,
    'TOKEN_VALUE_INVALID',
    'styles[example-style].tokens.radius'
  );
  assertHasIssue(
    malformedFunction,
    'TOKEN_VALUE_INVALID',
    'styles[example-style].tokens.accent'
  );
  assertHasIssue(
    unknown,
    'TOKEN_UNKNOWN',
    'styles[example-style].tokens.experimentalDepth',
    'warning'
  );
});

test('팔레트와 기본 트윅의 손상 값을 안정 코드로 보고한다', () => {
  const duplicatePalette = issuesAfter(snapshot => {
    snapshot.styles[0].palette.push(structuredClone(snapshot.styles[0].palette[0]));
  });
  const invalidPalette = issuesAfter(snapshot => {
    snapshot.styles[0].palette[0].value = 'unknown-color';
  });
  const invalidTweak = issuesAfter(snapshot => {
    snapshot.styles[0].defaultTweaks.glowIntensity = -0.1;
  });

  assertHasIssue(
    duplicatePalette,
    'PALETTE_INVALID',
    'styles[example-style].palette[ink].id'
  );
  assertHasIssue(
    invalidPalette,
    'PALETTE_INVALID',
    'styles[example-style].palette[ink].value'
  );
  assertHasIssue(
    invalidTweak,
    'TWEAK_VALUE_INVALID',
    'styles[example-style].defaultTweaks.glowIntensity'
  );
});

test('선택적 테마 효과는 허용 키와 0 이상의 유한한 숫자만 받는다', () => {
  const unknown = issuesAfter(snapshot => {
    snapshot.styles[0].themeEffects = { experimental: 1 };
  });
  const invalidValues = [-1, Number.NaN, Number.POSITIVE_INFINITY, '12'];

  assertHasIssue(
    unknown,
    'THEME_EFFECT_UNKNOWN',
    'styles[example-style].themeEffects.experimental'
  );

  for (const value of invalidValues) {
    const issues = issuesAfter(snapshot => {
      snapshot.styles[0].themeEffects = { backdropBlur: value };
    });
    assertHasIssue(
      issues,
      'THEME_EFFECT_VALUE_INVALID',
      'styles[example-style].themeEffects.backdropBlur'
    );
  }

  const omitted = createValidCatalogSnapshot();
  const zero = createValidCatalogSnapshot();
  zero.styles[0].themeEffects = { backdropBlur: 0 };
  const zeroBefore = structuredClone(zero);

  assert.deepEqual(validateCatalog(omitted).issues, []);
  assert.deepEqual(validateCatalog(zero).issues, []);
  assert.deepEqual(zero, zeroBefore);
});

test('정규 ID·alias와 facet 값의 중복·충돌을 검출한다', () => {
  const duplicateStyle = issuesAfter(snapshot => {
    snapshot.styles.push(structuredClone(snapshot.styles[0]));
  });
  const duplicateAlias = issuesAfter(snapshot => {
    const second = structuredClone(snapshot.styles[0]);
    second.id = 'second-style';
    snapshot.styles.push(second);
    snapshot.packs[0].styleIds.push(second.id);
  });
  const canonicalCollision = issuesAfter(snapshot => {
    snapshot.styles[0].aliases.push('example-style');
  });
  const duplicateFacetValue = issuesAfter(snapshot => {
    snapshot.facets[0].values.push(structuredClone(snapshot.facets[0].values[0]));
  });

  assertHasIssue(duplicateStyle, 'ID_DUPLICATE', 'styles[example-style].id');
  assertHasIssue(duplicateAlias, 'ALIAS_DUPLICATE', 'aliases[example-style-old]');
  assertHasIssue(canonicalCollision, 'ALIAS_CANONICAL_COLLISION', 'aliases[example-style]');
  assertHasIssue(
    duplicateFacetValue,
    'ID_DUPLICATE',
    'facets[kind].values[interface-language].id'
  );
});

test('category·pack 관계와 스타일의 단일 팩 소속을 검증한다', () => {
  const unknownCategory = issuesAfter(snapshot => {
    snapshot.styles[0].categoryId = 'missing-category';
  });
  const unknownPackStyle = issuesAfter(snapshot => {
    snapshot.packs[0].styleIds.push('missing-style');
  });
  const duplicatePackStyle = issuesAfter(snapshot => {
    snapshot.packs[0].styleIds.push('example-style');
  });
  const noMembership = issuesAfter(snapshot => {
    snapshot.packs[0].styleIds = [];
  });
  const doubleMembership = issuesAfter(snapshot => {
    snapshot.packs.push({
      ...structuredClone(snapshot.packs[0]),
      id: 'secondary-pack'
    });
  });

  assertHasIssue(
    unknownCategory,
    'STYLE_CATEGORY_UNKNOWN',
    'styles[example-style].categoryId'
  );
  assertHasIssue(
    unknownPackStyle,
    'PACK_STYLE_UNKNOWN',
    'packs[core].styleIds[missing-style]'
  );
  assertHasIssue(
    duplicatePackStyle,
    'PACK_STYLE_DUPLICATE',
    'packs[core].styleIds[example-style]'
  );
  assertHasIssue(
    noMembership,
    'STYLE_PACK_MEMBERSHIP_INVALID',
    'styles[example-style].packMembership'
  );
  assertHasIssue(
    doubleMembership,
    'STYLE_PACK_MEMBERSHIP_INVALID',
    'styles[example-style].packMembership'
  );
});

test('classification 어휘와 시대 범위를 facet 계약에 교차 검증한다', () => {
  const unknownFacetValue = issuesAfter(snapshot => {
    snapshot.styles[0].classification.tone = ['unknown-tone'];
  });
  const invalidEra = issuesAfter(snapshot => {
    snapshot.styles[0].classification.era.start = 2030;
    snapshot.styles[0].classification.era.end = 2020;
  });

  assertHasIssue(
    unknownFacetValue,
    'FACET_VALUE_UNKNOWN',
    'styles[example-style].classification.tone[unknown-tone]'
  );
  assertHasIssue(
    invalidEra,
    'ERA_RANGE_INVALID',
    'styles[example-style].classification.era'
  );
});

test('preview와 asset 참조는 인벤토리·안전 경로를 만족해야 한다', () => {
  const unknownPreview = issuesAfter(snapshot => {
    snapshot.styles[0].preview.rendererId = 'missing-renderer';
  });
  const unsafeAsset = issuesAfter(snapshot => {
    snapshot.styles[0].provenance.assets.push({
      path: '../escape.png',
      owner: 'Example',
      license: 'CC0-1.0',
      source: { title: 'Example asset' }
    });
    snapshot.references.assetPaths.push('../escape.png');
  });
  const unknownAsset = issuesAfter(snapshot => {
    snapshot.styles[0].provenance.assets.push({
      path: 'assets/example.png',
      owner: 'Example',
      license: 'CC0-1.0',
      source: { title: 'Example asset' }
    });
  });
  const knownAsset = issuesAfter(snapshot => {
    snapshot.styles[0].provenance.assets.push({
      path: 'assets/example.png',
      owner: 'Example',
      license: 'CC0-1.0',
      source: { title: 'Project-created example asset' }
    });
    snapshot.references.assetPaths.push('assets/example.png');
  });
  const unsafeInventoryPath = issuesAfter(snapshot => {
    snapshot.references.assetPaths.push('../unused-escape.png');
  });

  assertHasIssue(
    unknownPreview,
    'PREVIEW_REFERENCE_UNKNOWN',
    'styles[example-style].preview.rendererId'
  );
  assertHasIssue(
    unsafeAsset,
    'ASSET_PATH_UNSAFE',
    'styles[example-style].provenance.assets[../escape.png].path'
  );
  assertHasIssue(
    unknownAsset,
    'ASSET_REFERENCE_UNKNOWN',
    'styles[example-style].provenance.assets[assets/example.png].path'
  );
  assert.equal(knownAsset.some(item => item.code.startsWith('ASSET_')), false);
  assertHasIssue(
    unsafeInventoryPath,
    'ASSET_PATH_UNSAFE',
    'catalog.references.assetPaths[../unused-escape.png]'
  );
});

test('이슈 정렬은 논리적으로 같은 입력의 배열 순서와 무관하다', () => {
  const snapshot = createValidCatalogSnapshot();
  const second = structuredClone(snapshot.styles[0]);
  second.id = 'second-style';
  second.aliases = [];
  second.categoryId = 'missing-category';
  snapshot.styles[0].preview.rendererId = 'missing-renderer';
  snapshot.styles.push(second);
  snapshot.packs[0].styleIds.push(second.id);

  const reordered = structuredClone(snapshot);
  reordered.styles.reverse();
  reordered.facets.reverse();

  assert.deepEqual(validateCatalog(snapshot).issues, validateCatalog(reordered).issues);
});

test('출처·에셋 메타데이터 형식과 중복 URL을 검증한다', () => {
  const invalidDate = issuesAfter(snapshot => {
    snapshot.styles[0].provenance.reviewedAt = '2026-02-30';
  });
  const invalidUrl = issuesAfter(snapshot => {
    snapshot.styles[0].provenance.sources[0].url = 'ftp://example.com/design';
  });
  const duplicateSource = issuesAfter(snapshot => {
    snapshot.styles[0].provenance.sources.push(
      structuredClone(snapshot.styles[0].provenance.sources[0])
    );
  });
  const invalidAsset = issuesAfter(snapshot => {
    snapshot.styles[0].provenance.assets.push({
      path: 'assets/example.png',
      owner: 'Example',
      license: '',
      source: { title: 'Example asset' }
    });
    snapshot.references.assetPaths.push('assets/example.png');
  });
  const missingReviewedAt = issuesAfter(snapshot => {
    delete snapshot.styles[0].provenance.reviewedAt;
  });

  assertHasIssue(
    invalidDate,
    'SOURCE_METADATA_INVALID',
    'styles[example-style].provenance.reviewedAt'
  );
  assertHasIssue(
    invalidUrl,
    'SOURCE_METADATA_INVALID',
    'styles[example-style].provenance.sources[ftp://example.com/design].url'
  );
  assertHasIssue(
    duplicateSource,
    'SOURCE_DUPLICATE',
    'styles[example-style].provenance.sources[https://example.com/design].url'
  );
  assertHasIssue(
    invalidAsset,
    'ASSET_METADATA_INVALID',
    'styles[example-style].provenance.assets[assets/example.png].license'
  );
  assertHasIssue(
    missingReviewedAt,
    'FIELD_REQUIRED',
    'styles[example-style].provenance.reviewedAt'
  );
  assert.equal(
    missingReviewedAt.some(item => item.code === 'SOURCE_METADATA_INVALID'
      && item.path === 'styles[example-style].provenance.reviewedAt'),
    false
  );
});

test('출판 상태에 따라 출처·신뢰 출처·접근성 메모 severity가 전환된다', () => {
  for (const publicationStatus of ['legacy', 'draft', 'review', 'ready']) {
    const severity = publicationStatus === 'ready' ? 'error' : 'warning';
    const missing = issuesAfter(snapshot => {
      snapshot.styles[0].publicationStatus = publicationStatus;
      snapshot.styles[0].provenance.sources = [];
      snapshot.styles[0].editorial.accessibilityNotes = [];
    });
    assertHasIssue(
      missing,
      'SOURCE_REQUIRED',
      'styles[example-style].provenance.sources',
      severity
    );
    assertHasIssue(
      missing,
      'ACCESSIBILITY_NOTES_REQUIRED',
      'styles[example-style].editorial.accessibilityNotes',
      severity
    );
    assert.equal(missing.some(item => item.code === 'SOURCE_TRUST_REQUIRED'), false);
  }

  const communityOnly = issuesAfter(snapshot => {
    snapshot.styles[0].provenance.sources[0].sourceType = 'community';
  });
  assertHasIssue(
    communityOnly,
    'SOURCE_TRUST_REQUIRED',
    'styles[example-style].provenance.sources',
    'error'
  );
});

test('계산 가능한 4.5:1 대비와 계산 불가 색상을 보수적으로 보고한다', () => {
  const lowReady = issuesAfter(snapshot => {
    snapshot.styles[0].tokens.text = '#777777';
  });
  const lowLegacy = issuesAfter(snapshot => {
    snapshot.styles[0].publicationStatus = 'legacy';
    snapshot.styles[0].tokens.text = '#777777';
  });
  const unchecked = issuesAfter(snapshot => {
    snapshot.styles[0].tokens.background = 'linear-gradient(90deg, #FFFFFF, #000000)';
  });
  const invalid = issuesAfter(snapshot => {
    snapshot.styles[0].tokens.background = 'not-a-color';
  });
  const boundaryPass = issuesAfter(snapshot => {
    snapshot.styles[0].tokens.text = '#767676';
  });

  assertHasIssue(
    lowReady,
    'CONTRAST_LOW',
    'styles[example-style].tokens.text',
    'error'
  );
  assertHasIssue(
    lowLegacy,
    'CONTRAST_LOW',
    'styles[example-style].tokens.text',
    'warning'
  );
  assertHasIssue(
    unchecked,
    'CONTRAST_UNCHECKED',
    'styles[example-style].tokens.text',
    'warning'
  );
  assert.equal(invalid.some(item => item.code === 'CONTRAST_UNCHECKED'), false);
  assert.equal(
    boundaryPass.some(item => item.code === 'CONTRAST_LOW' && item.path.endsWith('.tokens.text')),
    false
  );
});

test('strict assertion은 legacy 품질 경고를 실패로 승격한다', () => {
  const snapshot = createValidCatalogSnapshot();
  snapshot.styles[0].publicationStatus = 'legacy';
  snapshot.styles[0].provenance.sources = [];
  snapshot.styles[0].editorial.accessibilityNotes = [];

  const report = assertValidCatalog(snapshot);
  assert.equal(report.valid, true);
  assert.ok(report.summary.warningCount >= 2);
  assert.throws(
    () => assertValidCatalog(snapshot, { failOnWarnings: true }),
    error => error instanceof CatalogValidationError
      && error.report.summary.errorCount === 0
      && error.report.summary.warningCount >= 2
  );
});

test('현재 actual 120 snapshot은 registry에서 파생한 정렬·동결 참조 인벤토리를 사용한다', () => {
  const snapshot = createCurrentCatalogSnapshot();
  const inventory = getPreviewReferenceInventory();
  const sortIds = ids => [...ids].sort((left, right) => left.localeCompare(right, 'en'));

  assert.equal(snapshot.schemaVersion, 1);
  assert.equal(snapshot.categories.length, 8);
  assert.equal(snapshot.styles.length, 120);
  assert.equal(snapshot.facets.length, 10);
  assert.equal(snapshot.packs.length, 8);
  assert.equal(snapshot.references, inventory);
  assert.deepEqual(
    [inventory.rendererIds.length, inventory.thumbnailIds.length, inventory.motionIds.length, inventory.assetPaths.length],
    [120, 120, 120, 0]
  );
  assert.equal(Object.isFrozen(snapshot), true);
  assert.equal(Object.isFrozen(inventory), true);
  for (const values of Object.values(inventory)) {
    assert.equal(Object.isFrozen(values), true);
    assert.deepEqual(values, sortIds(values));
  }
  assert.deepEqual(
    inventory.rendererIds,
    sortIds(new Set(snapshot.styles.map(style => style.preview.rendererId)))
  );
  assert.deepEqual(
    inventory.thumbnailIds,
    sortIds(new Set(snapshot.styles.map(style => style.preview.thumbnailId)))
  );
  assert.deepEqual(
    inventory.motionIds,
    sortIds(new Set(snapshot.styles.map(style => style.preview.motionId)))
  );
  assert.deepEqual(inventory.assetPaths, []);
  assert.equal(inventory.rendererIds.includes('brutalism'), false);
  assert.equal(hasPreviewReference('renderer', 'brutalism'), true);
});

test('현재 120종은 오류 없이 기존 24종 legacy 경고 기준선을 유지한다', () => {
  const report = validateCurrentCatalog();

  assert.equal(report.valid, true);
  assert.equal(report.summary.errorCount, 0);
  assert.ok(report.summary.warningCount > 0);
  assert.deepEqual(
    Object.fromEntries(
      [...new Set(report.issues.map(item => item.code))]
        .sort()
        .map(code => [code, report.issues.filter(item => item.code === code).length])
    ),
    {
      ACCESSIBILITY_NOTES_REQUIRED: 24,
      CONTRAST_LOW: 5,
      CONTRAST_UNCHECKED: 3,
      SOURCE_REQUIRED: 24
    }
  );
});

test('actual 120은 신규 ready 경고 없이 120종 preview 참조를 완결한다', () => {
  const snapshot = createCurrentCatalogSnapshot();
  const inventory = getPreviewReferenceInventory();
  const report = validateCurrentCatalog();
  const readyIds = new Set(snapshot.styles
    .filter(style => style.publicationStatus === 'ready')
    .map(style => style.id));

  assert.equal(snapshot.styles.length, 120);
  assert.equal(readyIds.size, 96);
  assert.deepEqual(
    [inventory.rendererIds.length, inventory.thumbnailIds.length, inventory.motionIds.length, inventory.assetPaths.length],
    [120, 120, 120, 0]
  );
  assert.deepEqual(report.summary, { errorCount: 0, warningCount: 56, totalCount: 56 });
  assert.equal(report.issues.some(issue => readyIds.has(issue.entityId)), false);
});

function runCliInMemory(args, dependencies = {}) {
  let stdout = '';
  let stderr = '';
  const exitCode = runCatalogValidationCli(
    args,
    {
      stdout: { write: value => { stdout += value; } },
      stderr: { write: value => { stderr += value; } }
    },
    dependencies
  );
  return { exitCode, stdout, stderr };
}

test('CLI 기본·verbose·JSON·strict 모드가 승인된 출력과 종료 코드를 사용한다', () => {
  const compact = runCliInMemory([]);
  const verbose = runCliInMemory(['--verbose']);
  const json = runCliInMemory(['--json']);
  const strict = runCliInMemory(['--strict']);

  assert.equal(compact.exitCode, 0);
  assert.match(compact.stdout, /오류 0개, 경고 56개/);
  assert.match(compact.stdout, /ACCESSIBILITY_NOTES_REQUIRED.*24개/);
  assert.equal(compact.stderr, '');
  assert.equal(verbose.exitCode, 0);
  assert.match(verbose.stdout, /styles\[swiss-grid\]\.provenance\.sources/);
  assert.equal(json.exitCode, 0);
  assert.deepEqual(JSON.parse(json.stdout).summary, {
    errorCount: 0,
    warningCount: 56,
    totalCount: 56
  });
  assert.equal(strict.exitCode, 1);
});

test('CLI 옵션 오류와 예상하지 못한 내부 실패는 stderr와 종료 코드 2로 분리된다', () => {
  const unknown = runCliInMemory(['--unknown']);
  const internal = runCliInMemory([], {
    validateCurrentCatalog: () => { throw new Error('simulated failure'); }
  });

  assert.equal(unknown.exitCode, 2);
  assert.equal(unknown.stdout, '');
  assert.match(unknown.stderr, /알 수 없는 옵션/);
  assert.equal(internal.exitCode, 2);
  assert.equal(internal.stdout, '');
  assert.match(internal.stderr, /내부 오류/);
  assert.doesNotMatch(internal.stderr, /\n\s+at /);
});

test('CLI는 주입된 검증 오류도 종료 코드 1로 빌드 경계에 전달한다', () => {
  const invalid = runCliInMemory([], {
    validateCurrentCatalog: () => validateCatalog({ schemaVersion: 999 })
  });

  assert.equal(invalid.exitCode, 1);
  assert.match(invalid.stdout, /카탈로그 검증 실패/);
  assert.match(invalid.stdout, /CATALOG_INPUT_INVALID/);
  assert.equal(invalid.stderr, '');
});

test('실제 Node CLI와 package lifecycle이 validate:catalog prebuild 게이트를 제공한다', () => {
  const projectRoot = new URL('..', import.meta.url);
  const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  const jsonRun = spawnSync(process.execPath, ['scripts/validateCatalog.js', '--json'], {
    cwd: projectRoot,
    encoding: 'utf8'
  });
  const strictRun = spawnSync(process.execPath, ['scripts/validateCatalog.js', '--strict'], {
    cwd: projectRoot,
    encoding: 'utf8'
  });

  assert.equal(jsonRun.status, 0, jsonRun.stderr);
  assert.equal(JSON.parse(jsonRun.stdout).summary.warningCount, 56);
  assert.equal(strictRun.status, 1);
  assert.equal(packageJson.scripts['validate:catalog'], 'node scripts/validateCatalog.js');
  assert.equal(
    packageJson.scripts.prebuild,
    'npm run validate:catalog && npm run check:themes'
  );
});
