import {
  CATALOG_SCHEMA_VERSION,
  ID_PATTERN,
  PUBLICATION_STATUSES,
  SELECTION_MODES,
  THEME_TOKEN_KEYS
} from '../contract.js';
import { isBasicColorValue } from './color.js';
import { collectCatalogQualityIssues } from './quality.js';
import { isTweakValueValid } from '../../tuner/contract.js';

const ROOT_COLLECTIONS = Object.freeze(['categories', 'facets', 'styles', 'packs']);
const REFERENCE_COLLECTIONS = Object.freeze([
  'rendererIds',
  'thumbnailIds',
  'motionIds',
  'assetPaths'
]);
const CLASSIFICATION_ARRAY_FIELDS = Object.freeze([
  'lineages',
  'media',
  'materiality',
  'tone',
  'regions'
]);
const EDITORIAL_ARRAY_FIELDS = Object.freeze([
  'moodTags',
  'characteristics',
  'pros',
  'cons',
  'accessibilityNotes'
]);
const COLOR_TOKEN_KEYS = new Set([
  'background',
  'surface',
  'surfaceSubtle',
  'border',
  'text',
  'textMuted',
  'accent',
  'accentSecondary'
]);
const DIMENSION_TOKEN_KEYS = new Set(['radius', 'borderWidth']);
const TWEAK_KEYS = Object.freeze([
  'borderRadius',
  'borderWidth',
  'shadowDepth',
  'backdropBlur',
  'glowIntensity'
]);
const THEME_EFFECT_KEYS = Object.freeze(['backdropBlur']);
const THEME_GEOMETRY_KEYS = Object.freeze(['surfaceRadius', 'controlRadius', 'pillRadius']);
const DIMENSION_PATTERN = /^(?:0|(?:\d+(?:\.\d+)?|\.\d+)(?:px|rem|em|%|vw|vh))$/i;

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function addIssue(issues, issue) {
  issues.push({ relatedPath: null, entityId: null, ...issue });
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function recordPath(collection, record) {
  const id = isNonEmptyString(record?.id) ? record.id : '<missing>';
  return `${collection}[${id}]`;
}

function addFieldIssue(issues, context, code, path, message) {
  addIssue(issues, {
    code,
    severity: 'error',
    path,
    message,
    entityType: context.entityType,
    entityId: context.entityId
  });
}

function validateRequiredString(value, issues, context, path) {
  if (value === undefined || value === null || value === '') {
    addFieldIssue(issues, context, 'FIELD_REQUIRED', path, '필수 문자열이 비어 있습니다.');
    return false;
  }
  if (typeof value !== 'string') {
    addFieldIssue(issues, context, 'FIELD_TYPE_INVALID', path, '문자열 값이 필요합니다.');
    return false;
  }
  if (value.trim().length === 0) {
    addFieldIssue(issues, context, 'FIELD_REQUIRED', path, '필수 문자열이 비어 있습니다.');
    return false;
  }
  return true;
}

function validateIdentifier(value, issues, context, path) {
  if (!validateRequiredString(value, issues, context, path)) return false;
  if (!ID_PATTERN.test(value)) {
    addFieldIssue(
      issues,
      context,
      'ID_FORMAT_INVALID',
      path,
      'ID는 소문자 kebab-case 형식이어야 합니다.'
    );
    return false;
  }
  return true;
}

function validateOrder(value, issues, context, path) {
  if (!Number.isFinite(value) || !Number.isInteger(value)) {
    addFieldIssue(issues, context, 'ORDER_INVALID', path, 'order는 유한한 정수여야 합니다.');
    return false;
  }
  return true;
}

function validateSchemaVersion(value, issues, context, path) {
  if (value !== CATALOG_SCHEMA_VERSION) {
    addFieldIssue(
      issues,
      context,
      'SCHEMA_VERSION_MISMATCH',
      path,
      `스키마 버전은 ${CATALOG_SCHEMA_VERSION}이어야 합니다.`
    );
    return false;
  }
  return true;
}

function validateStringArray(value, issues, context, path) {
  if (value === undefined || value === null) {
    addFieldIssue(issues, context, 'FIELD_REQUIRED', path, '필수 배열이 없습니다.');
    return false;
  }
  if (!Array.isArray(value) || value.some(item => !isNonEmptyString(item))) {
    addFieldIssue(
      issues,
      context,
      'FIELD_TYPE_INVALID',
      path,
      '비어 있지 않은 문자열 배열이 필요합니다.'
    );
    return false;
  }
  return true;
}

function validateLocalizedText(value, issues, context, path, requireEnglish = false) {
  if (!isRecord(value)) {
    addFieldIssue(issues, context, 'FIELD_TYPE_INVALID', path, '지역화 객체가 필요합니다.');
    return false;
  }
  const koreanValid = validateRequiredString(value.ko, issues, context, `${path}.ko`);
  const englishValid = requireEnglish
    ? validateRequiredString(value.en, issues, context, `${path}.en`)
    : value.en === undefined || validateRequiredString(value.en, issues, context, `${path}.en`);
  return koreanValid && englishValid;
}

function validateCategory(category, issues) {
  const path = recordPath('categories', category);
  const context = { entityType: 'category', entityId: isNonEmptyString(category?.id) ? category.id : null };
  if (!isRecord(category)) {
    addFieldIssue(issues, context, 'FIELD_TYPE_INVALID', path, '카테고리 레코드는 객체여야 합니다.');
    return;
  }
  validateIdentifier(category.id, issues, context, `${path}.id`);
  validateOrder(category.order, issues, context, `${path}.order`);
  validateLocalizedText(category.title, issues, context, `${path}.title`, true);
  validateLocalizedText(category.description, issues, context, `${path}.description`);
  validateRequiredString(category.icon, issues, context, `${path}.icon`);
  validateRequiredString(category.accentColor, issues, context, `${path}.accentColor`);
  validateStringArray(category.tags, issues, context, `${path}.tags`);
}

function validateFacetValue(value, issues, facetContext, facetPath) {
  const valuePath = `${facetPath}.values[${isNonEmptyString(value?.id) ? value.id : '<missing>'}]`;
  if (!isRecord(value)) {
    addFieldIssue(issues, facetContext, 'FIELD_TYPE_INVALID', valuePath, 'facet 값은 객체여야 합니다.');
    return;
  }
  validateIdentifier(value.id, issues, facetContext, `${valuePath}.id`);
  validateOrder(value.order, issues, facetContext, `${valuePath}.order`);
  validateLocalizedText(value.label, issues, facetContext, `${valuePath}.label`, true);
}

function validateFacet(facetRecord, issues) {
  const path = recordPath('facets', facetRecord);
  const context = { entityType: 'facet', entityId: isNonEmptyString(facetRecord?.id) ? facetRecord.id : null };
  if (!isRecord(facetRecord)) {
    addFieldIssue(issues, context, 'FIELD_TYPE_INVALID', path, 'facet 레코드는 객체여야 합니다.');
    return;
  }
  validateIdentifier(facetRecord.id, issues, context, `${path}.id`);
  validateOrder(facetRecord.order, issues, context, `${path}.order`);
  validateLocalizedText(facetRecord.label, issues, context, `${path}.label`, true);
  if (!SELECTION_MODES.includes(facetRecord.selectionMode)) {
    addFieldIssue(
      issues,
      context,
      'FIELD_TYPE_INVALID',
      `${path}.selectionMode`,
      'selectionMode는 single 또는 multiple이어야 합니다.'
    );
  }
  if (!Array.isArray(facetRecord.values)) {
    addFieldIssue(issues, context, 'FIELD_TYPE_INVALID', `${path}.values`, 'facet values는 배열이어야 합니다.');
    return;
  }
  for (const value of facetRecord.values) validateFacetValue(value, issues, context, path);
}

function validatePack(pack, issues) {
  const path = recordPath('packs', pack);
  const context = { entityType: 'pack', entityId: isNonEmptyString(pack?.id) ? pack.id : null };
  if (!isRecord(pack)) {
    addFieldIssue(issues, context, 'FIELD_TYPE_INVALID', path, '팩 manifest는 객체여야 합니다.');
    return;
  }
  validateSchemaVersion(pack.schemaVersion, issues, context, `${path}.schemaVersion`);
  validateIdentifier(pack.id, issues, context, `${path}.id`);
  validateRequiredString(pack.version, issues, context, `${path}.version`);
  validateOrder(pack.order, issues, context, `${path}.order`);
  validateLocalizedText(pack.title, issues, context, `${path}.title`, true);
  validateStringArray(pack.styleIds, issues, context, `${path}.styleIds`);
}

function validateClassification(classification, issues, context, path) {
  if (!isRecord(classification)) {
    addFieldIssue(issues, context, 'FIELD_TYPE_INVALID', path, '분류 객체가 필요합니다.');
    return;
  }
  for (const field of ['kind', 'density', 'motion', 'maturity']) {
    validateRequiredString(classification[field], issues, context, `${path}.${field}`);
  }
  for (const field of CLASSIFICATION_ARRAY_FIELDS) {
    validateStringArray(classification[field], issues, context, `${path}.${field}`);
  }
  if (!isRecord(classification.era)) {
    addFieldIssue(issues, context, 'FIELD_TYPE_INVALID', `${path}.era`, '시대 범위 객체가 필요합니다.');
  } else {
    for (const field of ['start', 'end']) {
      const value = classification.era[field];
      if (value !== null && !Number.isInteger(value)) {
        addFieldIssue(
          issues,
          context,
          'FIELD_TYPE_INVALID',
          `${path}.era.${field}`,
          '시대 경계는 정수 또는 null이어야 합니다.'
        );
      }
    }
    validateRequiredString(classification.era.label, issues, context, `${path}.era.label`);
  }
}

function validatePreview(preview, issues, context, path) {
  if (!isRecord(preview)) {
    addFieldIssue(issues, context, 'FIELD_TYPE_INVALID', path, '프리뷰 참조 객체가 필요합니다.');
    return;
  }
  for (const field of ['rendererId', 'thumbnailId', 'motionId']) {
    validateRequiredString(preview[field], issues, context, `${path}.${field}`);
  }
}

function validateTokens(tokens, issues, context, path) {
  if (!isRecord(tokens)) {
    addFieldIssue(issues, context, 'FIELD_TYPE_INVALID', path, '테마 토큰 객체가 필요합니다.');
    return;
  }

  for (const key of THEME_TOKEN_KEYS) {
    const tokenPath = `${path}.${key}`;
    if (!Object.hasOwn(tokens, key) || !isNonEmptyString(tokens[key])) {
      addFieldIssue(issues, context, 'TOKEN_REQUIRED', tokenPath, '필수 테마 토큰이 비어 있습니다.');
      continue;
    }
    if (COLOR_TOKEN_KEYS.has(key) && !isBasicColorValue(tokens[key])) {
      addFieldIssue(issues, context, 'TOKEN_VALUE_INVALID', tokenPath, '지원하는 기본 색상 문법이 아닙니다.');
    }
    if (DIMENSION_TOKEN_KEYS.has(key) && !DIMENSION_PATTERN.test(tokens[key])) {
      addFieldIssue(issues, context, 'TOKEN_VALUE_INVALID', tokenPath, '지원하는 CSS dimension 문법이 아닙니다.');
    }
  }

  for (const key of Object.keys(tokens)) {
    if (!THEME_TOKEN_KEYS.includes(key)) {
      addIssue(issues, {
        code: 'TOKEN_UNKNOWN',
        severity: 'warning',
        path: `${path}.${key}`,
        message: '스키마 v1에 정의되지 않은 확장 토큰입니다.',
        entityType: context.entityType,
        entityId: context.entityId
      });
    }
  }
}

function isLocalizedTextValid(value, requireEnglish = false) {
  return isRecord(value)
    && isNonEmptyString(value.ko)
    && (!requireEnglish || isNonEmptyString(value.en));
}

function addPaletteIssue(issues, context, path, message) {
  addFieldIssue(issues, context, 'PALETTE_INVALID', path, message);
}

function validatePalette(palette, issues, context, path) {
  if (!Array.isArray(palette)) {
    addPaletteIssue(issues, context, path, '팔레트는 배열이어야 합니다.');
    return;
  }

  const seenIds = new Set();
  for (const swatch of palette) {
    const swatchId = isNonEmptyString(swatch?.id) ? swatch.id : '<missing>';
    const swatchPath = `${path}[${swatchId}]`;
    if (!isRecord(swatch)) {
      addPaletteIssue(issues, context, swatchPath, '팔레트 항목은 객체여야 합니다.');
      continue;
    }
    if (!isNonEmptyString(swatch.id) || !ID_PATTERN.test(swatch.id)) {
      addPaletteIssue(issues, context, `${swatchPath}.id`, '팔레트 ID는 kebab-case여야 합니다.');
    } else if (seenIds.has(swatch.id)) {
      addPaletteIssue(issues, context, `${swatchPath}.id`, '스타일 안에서 팔레트 ID가 중복됩니다.');
    } else {
      seenIds.add(swatch.id);
    }
    if (!isLocalizedTextValid(swatch.name, true)) {
      addPaletteIssue(issues, context, `${swatchPath}.name`, '팔레트 이름의 한국어·영어 값이 필요합니다.');
    }
    if (!isBasicColorValue(swatch.value)) {
      addPaletteIssue(issues, context, `${swatchPath}.value`, '지원하는 기본 색상 문법이 아닙니다.');
    }
    if (!isLocalizedTextValid(swatch.usage)) {
      addPaletteIssue(issues, context, `${swatchPath}.usage`, '팔레트 사용처의 한국어 값이 필요합니다.');
    }
  }
}

function validateTweaks(tweaks, issues, context, path) {
  if (!isRecord(tweaks)) {
    addFieldIssue(issues, context, 'FIELD_TYPE_INVALID', path, '기본 트윅 객체가 필요합니다.');
    return;
  }
  for (const key of TWEAK_KEYS) {
    if (!isTweakValueValid(key, tweaks[key])) {
      addFieldIssue(
        issues,
        context,
        'TWEAK_VALUE_INVALID',
        `${path}.${key}`,
        '기본 트윅 값이 공통 튜너 허용 범위를 벗어났습니다.'
      );
    }
  }
}

function validateThemeEffects(effects, issues, context, path) {
  if (effects === undefined) return;
  if (!isRecord(effects)) {
    addFieldIssue(issues, context, 'FIELD_TYPE_INVALID', path, '테마 효과는 객체여야 합니다.');
    return;
  }

  for (const key of Object.keys(effects)) {
    const effectPath = `${path}.${key}`;
    if (!THEME_EFFECT_KEYS.includes(key)) {
      addFieldIssue(
        issues,
        context,
        'THEME_EFFECT_UNKNOWN',
        effectPath,
        '스키마 v1에 정의되지 않은 테마 효과입니다.'
      );
      continue;
    }
    if (!Number.isFinite(effects[key]) || effects[key] < 0) {
      addFieldIssue(
        issues,
        context,
        'THEME_EFFECT_VALUE_INVALID',
        effectPath,
        '테마 효과 값은 0 이상의 유한한 숫자여야 합니다.'
      );
    }
  }
}

function validateThemeGeometry(geometry, issues, context, path) {
  if (geometry === undefined) return;
  if (!isRecord(geometry)) {
    addFieldIssue(issues, context, 'FIELD_TYPE_INVALID', path, '테마 기하 객체가 필요합니다.');
    return;
  }
  for (const key of THEME_GEOMETRY_KEYS) {
    if (typeof geometry[key] !== 'string' || !DIMENSION_PATTERN.test(geometry[key])) {
      addFieldIssue(issues, context, 'THEME_GEOMETRY_INVALID', `${path}.${key}`, '지원하는 CSS 치수 값이 필요합니다.');
    }
  }
}

function validateStyle(style, issues) {
  const path = recordPath('styles', style);
  const context = { entityType: 'style', entityId: isNonEmptyString(style?.id) ? style.id : null };
  if (!isRecord(style)) {
    addFieldIssue(issues, context, 'FIELD_TYPE_INVALID', path, '스타일 레코드는 객체여야 합니다.');
    return;
  }
  validateSchemaVersion(style.schemaVersion, issues, context, `${path}.schemaVersion`);
  validateIdentifier(style.id, issues, context, `${path}.id`);
  if (validateStringArray(style.aliases, issues, context, `${path}.aliases`)) {
    for (const alias of style.aliases) validateIdentifier(alias, issues, context, `${path}.aliases[${alias}]`);
  }
  validateRequiredString(style.categoryId, issues, context, `${path}.categoryId`);
  validateOrder(style.order, issues, context, `${path}.order`);
  if (!PUBLICATION_STATUSES.includes(style.publicationStatus)) {
    addFieldIssue(
      issues,
      context,
      'FIELD_TYPE_INVALID',
      `${path}.publicationStatus`,
      '알려진 publicationStatus가 필요합니다.'
    );
  }
  validateLocalizedText(style.name, issues, context, `${path}.name`, true);
  validateLocalizedText(style.summary, issues, context, `${path}.summary`);
  validateClassification(style.classification, issues, context, `${path}.classification`);
  validateTokens(style.tokens, issues, context, `${path}.tokens`);
  validatePreview(style.preview, issues, context, `${path}.preview`);
  validateTweaks(style.defaultTweaks, issues, context, `${path}.defaultTweaks`);
  validateThemeEffects(style.themeEffects, issues, context, `${path}.themeEffects`);
  validateThemeGeometry(style.themeGeometry, issues, context, `${path}.themeGeometry`);
  validatePalette(style.palette, issues, context, `${path}.palette`);
  if (!isRecord(style.editorial)) {
    addFieldIssue(issues, context, 'FIELD_TYPE_INVALID', `${path}.editorial`, '편집 메타데이터 객체가 필요합니다.');
  } else {
    for (const field of EDITORIAL_ARRAY_FIELDS) {
      validateStringArray(style.editorial[field], issues, context, `${path}.editorial.${field}`);
    }
  }
  if (!isRecord(style.provenance)) {
    addFieldIssue(issues, context, 'FIELD_TYPE_INVALID', `${path}.provenance`, '출처 객체가 필요합니다.');
  } else {
    validateRequiredString(style.provenance.reviewedAt, issues, context, `${path}.provenance.reviewedAt`);
    for (const field of ['sources', 'assets']) {
      if (!Array.isArray(style.provenance[field])) {
        addFieldIssue(
          issues,
          context,
          'FIELD_TYPE_INVALID',
          `${path}.provenance.${field}`,
          `${field}는 배열이어야 합니다.`
        );
      }
    }
  }
}

function validateDuplicateRecordIds(records, collection, entityType, issues) {
  const counts = new Map();
  for (const record of records) {
    if (isRecord(record) && isNonEmptyString(record.id)) {
      counts.set(record.id, (counts.get(record.id) || 0) + 1);
    }
  }
  for (const [id, count] of counts) {
    if (count > 1) {
      addIssue(issues, {
        code: 'ID_DUPLICATE',
        severity: 'error',
        path: `${collection}[${id}].id`,
        message: `${collection} 네임스페이스에서 ID가 중복됩니다.`,
        entityType,
        entityId: id
      });
    }
  }
}

function validateFacetValueIds(facets, issues) {
  for (const facetRecord of facets) {
    if (!isRecord(facetRecord) || !isNonEmptyString(facetRecord.id) || !Array.isArray(facetRecord.values)) continue;
    const counts = new Map();
    for (const value of facetRecord.values) {
      if (isRecord(value) && isNonEmptyString(value.id)) {
        counts.set(value.id, (counts.get(value.id) || 0) + 1);
      }
    }
    for (const [id, count] of counts) {
      if (count > 1) {
        addIssue(issues, {
          code: 'ID_DUPLICATE',
          severity: 'error',
          path: `facets[${facetRecord.id}].values[${id}].id`,
          message: '한 facet 안에서 값 ID가 중복됩니다.',
          entityType: 'facet',
          entityId: facetRecord.id
        });
      }
    }
  }
}

function validateAliases(styles, issues) {
  const canonicalIds = new Set(
    styles.filter(isRecord).map(style => style.id).filter(isNonEmptyString)
  );
  const aliasOwners = new Map();

  for (const style of styles) {
    if (!isRecord(style) || !isNonEmptyString(style.id) || !Array.isArray(style.aliases)) continue;
    for (const alias of style.aliases) {
      if (!isNonEmptyString(alias)) continue;
      const owners = aliasOwners.get(alias) || [];
      owners.push(style.id);
      aliasOwners.set(alias, owners);
    }
  }

  for (const [alias, owners] of aliasOwners) {
    const sortedOwners = [...owners].sort((left, right) => left.localeCompare(right, 'en'));
    if (owners.length > 1) {
      addIssue(issues, {
        code: 'ALIAS_DUPLICATE',
        severity: 'error',
        path: `aliases[${alias}]`,
        message: `alias가 여러 번 선언되었습니다: ${sortedOwners.join(', ')}`,
        entityType: 'style',
        entityId: sortedOwners[0] || null,
        relatedPath: sortedOwners[1] ? `styles[${sortedOwners[1]}].aliases[${alias}]` : null
      });
    }
    if (canonicalIds.has(alias)) {
      addIssue(issues, {
        code: 'ALIAS_CANONICAL_COLLISION',
        severity: 'error',
        path: `aliases[${alias}]`,
        message: 'alias가 정규 스타일 ID와 충돌합니다.',
        entityType: 'style',
        entityId: sortedOwners[0] || null,
        relatedPath: `styles[${alias}].id`
      });
    }
  }
}

function validateStyleAndPackRelations(categories, styles, packs, issues) {
  const categoryIds = new Set(categories.filter(isRecord).map(item => item.id).filter(isNonEmptyString));
  const styleIds = new Set(styles.filter(isRecord).map(item => item.id).filter(isNonEmptyString));
  const membership = new Map([...styleIds].map(id => [id, 0]));

  for (const style of styles) {
    if (!isRecord(style) || !isNonEmptyString(style.id) || !isNonEmptyString(style.categoryId)) continue;
    if (!categoryIds.has(style.categoryId)) {
      addIssue(issues, {
        code: 'STYLE_CATEGORY_UNKNOWN',
        severity: 'error',
        path: `styles[${style.id}].categoryId`,
        message: '스타일이 알 수 없는 카테고리를 참조합니다.',
        entityType: 'style',
        entityId: style.id,
        relatedPath: `categories[${style.categoryId}]`
      });
    }
  }

  for (const pack of packs) {
    if (!isRecord(pack) || !isNonEmptyString(pack.id) || !Array.isArray(pack.styleIds)) continue;
    const seenInPack = new Set();
    for (const styleId of pack.styleIds) {
      if (!isNonEmptyString(styleId)) continue;
      const path = `packs[${pack.id}].styleIds[${styleId}]`;
      if (seenInPack.has(styleId)) {
        addIssue(issues, {
          code: 'PACK_STYLE_DUPLICATE',
          severity: 'error',
          path,
          message: '한 팩에서 같은 스타일 ID가 반복됩니다.',
          entityType: 'pack',
          entityId: pack.id,
          relatedPath: `styles[${styleId}].id`
        });
        continue;
      }
      seenInPack.add(styleId);
      if (!styleIds.has(styleId)) {
        addIssue(issues, {
          code: 'PACK_STYLE_UNKNOWN',
          severity: 'error',
          path,
          message: '팩이 알 수 없는 스타일을 참조합니다.',
          entityType: 'pack',
          entityId: pack.id,
          relatedPath: `styles[${styleId}]`
        });
      } else {
        membership.set(styleId, membership.get(styleId) + 1);
      }
    }
  }

  for (const [styleId, count] of membership) {
    if (count !== 1) {
      addIssue(issues, {
        code: 'STYLE_PACK_MEMBERSHIP_INVALID',
        severity: 'error',
        path: `styles[${styleId}].packMembership`,
        message: '스타일은 정확히 하나의 팩에 속해야 합니다.',
        entityType: 'style',
        entityId: styleId
      });
    }
  }
}

function validateClassificationRelations(facets, styles, issues) {
  const facetValues = new Map();
  for (const facetRecord of facets) {
    if (!isRecord(facetRecord) || !isNonEmptyString(facetRecord.id) || !Array.isArray(facetRecord.values)) continue;
    const values = facetValues.get(facetRecord.id) || new Set();
    for (const value of facetRecord.values) {
      if (isRecord(value) && isNonEmptyString(value.id)) values.add(value.id);
    }
    facetValues.set(facetRecord.id, values);
  }

  const mappings = [
    ['kind', 'kind', false],
    ['lineages', 'lineage', true],
    ['media', 'media', true],
    ['materiality', 'materiality', true],
    ['density', 'density', false],
    ['tone', 'tone', true],
    ['motion', 'motion', false],
    ['regions', 'region', true],
    ['maturity', 'maturity', false]
  ];

  for (const style of styles) {
    if (!isRecord(style) || !isNonEmptyString(style.id) || !isRecord(style.classification)) continue;
    const path = `styles[${style.id}].classification`;
    for (const [field, facetId, multiple] of mappings) {
      const candidates = multiple ? style.classification[field] : [style.classification[field]];
      if (!Array.isArray(candidates)) continue;
      for (const value of candidates) {
        if (!isNonEmptyString(value) || facetValues.get(facetId)?.has(value)) continue;
        addIssue(issues, {
          code: 'FACET_VALUE_UNKNOWN',
          severity: 'error',
          path: multiple ? `${path}.${field}[${value}]` : `${path}.${field}`,
          message: `분류 값이 ${facetId} facet에 없습니다.`,
          entityType: 'style',
          entityId: style.id,
          relatedPath: `facets[${facetId}].values[${value}]`
        });
      }
    }

    const { era } = style.classification;
    if (isRecord(era) && Number.isInteger(era.start) && Number.isInteger(era.end) && era.start > era.end) {
      addIssue(issues, {
        code: 'ERA_RANGE_INVALID',
        severity: 'error',
        path: `${path}.era`,
        message: '시대 시작 연도는 종료 연도보다 클 수 없습니다.',
        entityType: 'style',
        entityId: style.id
      });
    }
  }
}

function isSafeAssetPath(value) {
  if (!isNonEmptyString(value) || value.includes('\\') || value.includes('\0')) return false;
  if (value.startsWith('/') || /^[a-z]:\//i.test(value) || /^[a-z][a-z\d+.-]*:/i.test(value)) return false;
  return !value.split('/').includes('..');
}

function validateReferenceInventory(references, issues) {
  if (!isRecord(references)) return;
  for (const collection of ['rendererIds', 'thumbnailIds', 'motionIds']) {
    if (!Array.isArray(references[collection])) continue;
    const seen = new Set();
    for (const id of references[collection]) {
      const path = `catalog.references.${collection}[${String(id)}]`;
      const context = { entityType: 'reference', entityId: isNonEmptyString(id) ? id : null };
      if (!validateIdentifier(id, issues, context, path)) continue;
      if (seen.has(id)) {
        addFieldIssue(issues, context, 'ID_DUPLICATE', path, '참조 인벤토리 ID가 중복됩니다.');
      }
      seen.add(id);
    }
  }
  if (Array.isArray(references.assetPaths)) {
    for (const assetPath of references.assetPaths) {
      if (isSafeAssetPath(assetPath)) continue;
      addIssue(issues, {
        code: 'ASSET_PATH_UNSAFE',
        severity: 'error',
        path: `catalog.references.assetPaths[${String(assetPath)}]`,
        message: '에셋 인벤토리는 안전한 프로젝트 상대 경로만 포함해야 합니다.',
        entityType: 'asset',
        entityId: isNonEmptyString(assetPath) ? assetPath : null
      });
    }
  }
}

function validatePreviewAndAssetReferences(styles, references, issues) {
  if (!isRecord(references)) return;
  const referenceMap = new Map([
    ['rendererId', Array.isArray(references.rendererIds) ? new Set(references.rendererIds) : null],
    ['thumbnailId', Array.isArray(references.thumbnailIds) ? new Set(references.thumbnailIds) : null],
    ['motionId', Array.isArray(references.motionIds) ? new Set(references.motionIds) : null]
  ]);
  const assetPaths = Array.isArray(references.assetPaths) ? new Set(references.assetPaths) : null;

  for (const style of styles) {
    if (!isRecord(style) || !isNonEmptyString(style.id)) continue;
    const context = { entityType: 'style', entityId: style.id };
    if (isRecord(style.preview)) {
      for (const [field, inventory] of referenceMap) {
        const value = style.preview[field];
        const path = `styles[${style.id}].preview.${field}`;
        if (!isNonEmptyString(value) || !ID_PATTERN.test(value)) {
          if (isNonEmptyString(value)) validateIdentifier(value, issues, context, path);
          continue;
        }
        if (inventory && !inventory.has(value)) {
          addIssue(issues, {
            code: 'PREVIEW_REFERENCE_UNKNOWN',
            severity: 'error',
            path,
            message: '프리뷰 ID가 참조 인벤토리에 없습니다.',
            entityType: 'style',
            entityId: style.id,
            relatedPath: `catalog.references.${field.replace('Id', 'Ids')}[${value}]`
          });
        }
      }
    }

    const assets = style.provenance?.assets;
    if (!Array.isArray(assets)) continue;
    for (const asset of assets) {
      const assetPath = isNonEmptyString(asset?.path) ? asset.path : '<missing>';
      const path = `styles[${style.id}].provenance.assets[${assetPath}].path`;
      const assetContext = { entityType: 'asset', entityId: assetPath === '<missing>' ? null : assetPath };
      if (!isSafeAssetPath(asset?.path)) {
        addFieldIssue(issues, assetContext, 'ASSET_PATH_UNSAFE', path, '에셋은 안전한 프로젝트 상대 경로여야 합니다.');
      } else if (assetPaths && !assetPaths.has(asset.path)) {
        addIssue(issues, {
          code: 'ASSET_REFERENCE_UNKNOWN',
          severity: 'error',
          path,
          message: '에셋 경로가 참조 인벤토리에 없습니다.',
          entityType: 'asset',
          entityId: asset.path,
          relatedPath: `catalog.references.assetPaths[${asset.path}]`
        });
      }
    }
  }
}

function validateRelationships(snapshot, issues) {
  if (!Array.isArray(snapshot.categories)
    || !Array.isArray(snapshot.facets)
    || !Array.isArray(snapshot.styles)
    || !Array.isArray(snapshot.packs)) return;

  validateDuplicateRecordIds(snapshot.categories, 'categories', 'category', issues);
  validateDuplicateRecordIds(snapshot.facets, 'facets', 'facet', issues);
  validateDuplicateRecordIds(snapshot.styles, 'styles', 'style', issues);
  validateDuplicateRecordIds(snapshot.packs, 'packs', 'pack', issues);
  validateFacetValueIds(snapshot.facets, issues);
  validateAliases(snapshot.styles, issues);
  validateStyleAndPackRelations(snapshot.categories, snapshot.styles, snapshot.packs, issues);
  validateClassificationRelations(snapshot.facets, snapshot.styles, issues);
  validateReferenceInventory(snapshot.references, issues);
  validatePreviewAndAssetReferences(snapshot.styles, snapshot.references, issues);
}

/**
 * 카탈로그 데이터 문제를 가능한 범위까지 수집한다.
 * 규칙은 입력을 정렬하거나 수정하지 않는다.
 *
 * @param {unknown} snapshot
 * @returns {import('./index.js').CatalogValidationIssue[]}
 */
export function collectCatalogIssues(snapshot) {
  const issues = [];

  if (!isRecord(snapshot)) {
    addIssue(issues, {
      code: 'CATALOG_INPUT_INVALID',
      severity: 'error',
      path: 'catalog',
      message: '카탈로그 입력은 객체여야 합니다.',
      entityType: 'catalog'
    });
    return issues;
  }

  if (snapshot.schemaVersion !== CATALOG_SCHEMA_VERSION) {
    addIssue(issues, {
      code: 'SCHEMA_VERSION_MISMATCH',
      severity: 'error',
      path: 'catalog.schemaVersion',
      message: `카탈로그 스키마 버전은 ${CATALOG_SCHEMA_VERSION}이어야 합니다.`,
      entityType: 'catalog'
    });
  }

  for (const collection of ROOT_COLLECTIONS) {
    if (!Array.isArray(snapshot[collection])) {
      addIssue(issues, {
        code: 'CATALOG_INPUT_INVALID',
        severity: 'error',
        path: `catalog.${collection}`,
        message: `${collection} 컬렉션은 배열이어야 합니다.`,
        entityType: 'catalog'
      });
    }
  }

  if (!isRecord(snapshot.references)) {
    addIssue(issues, {
      code: 'REFERENCE_INVENTORY_MISSING',
      severity: 'error',
      path: 'catalog.references',
      message: '참조 인벤토리 객체가 필요합니다.',
      entityType: 'reference'
    });
  } else {
    for (const collection of REFERENCE_COLLECTIONS) {
      if (!Array.isArray(snapshot.references[collection])) {
        addIssue(issues, {
          code: 'REFERENCE_INVENTORY_MISSING',
          severity: 'error',
          path: `catalog.references.${collection}`,
          message: `${collection} 참조 인벤토리는 배열이어야 합니다.`,
          entityType: 'reference'
        });
      }
    }
  }

  if (Array.isArray(snapshot.categories)) {
    for (const category of snapshot.categories) validateCategory(category, issues);
  }
  if (Array.isArray(snapshot.facets)) {
    for (const facetRecord of snapshot.facets) validateFacet(facetRecord, issues);
  }
  if (Array.isArray(snapshot.styles)) {
    for (const style of snapshot.styles) validateStyle(style, issues);
  }
  if (Array.isArray(snapshot.packs)) {
    for (const pack of snapshot.packs) validatePack(pack, issues);
  }
  validateRelationships(snapshot, issues);
  issues.push(...collectCatalogQualityIssues(snapshot));

  return issues;
}
