/** 카탈로그 데이터 형식의 공개 스키마 버전. */
export const CATALOG_SCHEMA_VERSION = 1;

export const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const PUBLICATION_STATUSES = deepFreeze(['legacy', 'draft', 'review', 'ready']);
export const STYLE_KINDS = deepFreeze([
  'historical-movement',
  'revival',
  'technique',
  'interface-language',
  'microtrend',
  'speculative'
]);
export const DENSITY_VALUES = deepFreeze(['sparse', 'balanced', 'dense', 'maximal']);
export const MOTION_VALUES = deepFreeze(['none', 'restrained', 'expressive', 'intense']);
export const STYLE_MATURITIES = deepFreeze([
  'canonical',
  'established',
  'emerging',
  'experimental'
]);
export const SELECTION_MODES = deepFreeze(['single', 'multiple']);
export const SOURCE_TYPES = deepFreeze([
  'primary',
  'institutional',
  'archive',
  'industry',
  'community'
]);

export const THEME_TOKEN_KEYS = deepFreeze([
  'background',
  'surface',
  'surfaceSubtle',
  'border',
  'text',
  'textMuted',
  'accent',
  'accentSecondary',
  'radius',
  'borderWidth',
  'shadow',
  'fontFamily',
  'glow'
]);

/**
 * 객체 그래프를 재귀적으로 동결한다.
 * 공개 카탈로그의 원본이 소비자 코드에서 오염되지 않게 하는 경계 도우미다.
 *
 * @template T
 * @param {T} value
 * @param {WeakSet<object>} [seen]
 * @returns {Readonly<T>}
 */
export function deepFreeze(value, seen = new WeakSet()) {
  if (value === null || (typeof value !== 'object' && typeof value !== 'function')) {
    return value;
  }

  if (seen.has(value)) return value;
  seen.add(value);

  for (const key of Reflect.ownKeys(value)) {
    deepFreeze(value[key], seen);
  }

  return Object.freeze(value);
}

/** 명시적 order가 같을 때 ID로 결과를 안정적으로 정렬한다. */
export function sortByOrderThenId(left, right) {
  const orderDifference = left.order - right.order;
  return orderDifference || left.id.localeCompare(right.id, 'en');
}

/** 운영 카탈로그에서 기본 노출할 수 있는 출판 상태인지 판별한다. */
export function isStyleVisible(style, options = {}) {
  if (!style || !PUBLICATION_STATUSES.includes(style.publicationStatus)) return false;
  if (options?.includeUnpublished === true) return true;
  return style.publicationStatus === 'legacy' || style.publicationStatus === 'ready';
}

/** @typedef {{ ko: string, en?: string }} LocalizedText */

/**
 * @typedef {Object} ThemeTokens
 * @property {string} background
 * @property {string} surface
 * @property {string} surfaceSubtle
 * @property {string} border
 * @property {string} text
 * @property {string} textMuted
 * @property {string} accent
 * @property {string} accentSecondary
 * @property {string} radius
 * @property {string} borderWidth
 * @property {string} shadow
 * @property {string} fontFamily
 * @property {string} glow
 */

/**
 * `[data-theme]` 컨테이너에 직접 적용하는 선택적 기준 효과다.
 * 인스펙터의 조절 가능한 `defaultTweaks`와는 별도 계약이다.
 *
 * @typedef {Object} ThemeEffects
 * @property {number} [backdropBlur] 0 이상의 유한한 CSS px 값
 */

/**
 * @typedef {Object} StyleClassification
 * @property {'historical-movement'|'revival'|'technique'|'interface-language'|'microtrend'|'speculative'} kind
 * @property {{ start: number|null, end: number|null, label: string }} era
 * @property {string[]} lineages
 * @property {string[]} media
 * @property {string[]} materiality
 * @property {'sparse'|'balanced'|'dense'|'maximal'} density
 * @property {string[]} tone
 * @property {'none'|'restrained'|'expressive'|'intense'} motion
 * @property {string[]} regions
 * @property {'canonical'|'established'|'emerging'|'experimental'} maturity
 */

/**
 * @typedef {Object} StyleRecord
 * @property {1} schemaVersion
 * @property {string} id
 * @property {string[]} aliases
 * @property {string} categoryId
 * @property {number} order
 * @property {'legacy'|'draft'|'review'|'ready'} publicationStatus
 * @property {{ ko: string, en: string }} name
 * @property {LocalizedText} summary
 * @property {StyleClassification} classification
 * @property {ThemeTokens} tokens
 * @property {{ rendererId: string, thumbnailId: string, motionId: string }} preview
 * @property {{ borderRadius: number, borderWidth: number, shadowDepth: number, backdropBlur: number, glowIntensity: number }} defaultTweaks
 * @property {ThemeEffects} [themeEffects]
 * @property {{ id: string, name: LocalizedText, value: string, usage: LocalizedText }[]} palette
 * @property {{ moodTags: string[], characteristics: string[], pros: string[], cons: string[], accessibilityNotes: string[] }} editorial
 * @property {{ reviewedAt: string, sources: object[], assets: object[] }} provenance
 */

/**
 * @typedef {Object} CategoryRecord
 * @property {string} id
 * @property {number} order
 * @property {{ ko: string, en: string }} title
 * @property {LocalizedText} description
 * @property {string} icon
 * @property {string} accentColor
 * @property {string[]} tags
 */

/**
 * @typedef {Object} FacetDefinition
 * @property {string} id
 * @property {number} order
 * @property {{ ko: string, en: string }} label
 * @property {'single'|'multiple'} selectionMode
 * @property {{ id: string, order: number, label: { ko: string, en: string } }[]} values
 */

/**
 * @typedef {Object} StylePackManifest
 * @property {1} schemaVersion
 * @property {string} id
 * @property {string} version
 * @property {number} order
 * @property {{ ko: string, en: string }} title
 * @property {string[]} styleIds
 */
