import { CATEGORY_DEFINITIONS } from './categories.js';
import {
  CATALOG_SCHEMA_VERSION,
  deepFreeze,
  isStyleVisible,
  sortByOrderThenId
} from './contract.js';
import { FACET_DEFINITIONS } from './facets.js';
export {
  DISCOVERY_SORT_MODES,
  SEARCH_QUERY_MAX_LENGTH,
  getFacetValueCounts,
  getStyleFacetValues,
  groupStylesByEra,
  normalizeFacetSelections,
  normalizeSearchQuery,
  queryCatalogForDiscoveryState,
  queryCatalogStyles,
  updateFacetSelection
} from './discovery.js';
import { CORE_PACK_MANIFEST } from './packs/core/manifest.js';
import { CORE_CONTEMPORARY_STYLES } from './packs/core/styles-contemporary.js';
import { CORE_FOUNDATION_STYLES } from './packs/core/styles-foundations.js';
import { CORE_WAVE_1_STYLES } from './packs/core/styles-wave-1.js';
import {
  EXPANSION_PACK_MANIFESTS,
  EXPANSION_STYLES
} from './packs/expansion/index.js';

const ALL_STYLES = deepFreeze(
  [
    ...CORE_FOUNDATION_STYLES,
    ...CORE_CONTEMPORARY_STYLES,
    ...CORE_WAVE_1_STYLES,
    ...EXPANSION_STYLES
  ]
    .sort(sortByOrderThenId)
);
const PUBLIC_STYLES = deepFreeze(ALL_STYLES.filter(style => isStyleVisible(style)));
const PACK_MANIFESTS = deepFreeze(
  [CORE_PACK_MANIFEST, ...EXPANSION_PACK_MANIFESTS].sort(sortByOrderThenId)
);
const EMPTY_STYLES = deepFreeze([]);

const STYLE_BY_ID = new Map(ALL_STYLES.map(style => [style.id, style]));
const CANONICAL_ID_BY_ALIAS = new Map(
  ALL_STYLES.flatMap(style => style.aliases.map(alias => [alias, style.id]))
);
const CATEGORY_IDS = new Set(CATEGORY_DEFINITIONS.map(category => category.id));

const ALL_STYLES_BY_CATEGORY = new Map();
const PUBLIC_STYLES_BY_CATEGORY = new Map();

for (const category of CATEGORY_DEFINITIONS) {
  ALL_STYLES_BY_CATEGORY.set(
    category.id,
    deepFreeze(ALL_STYLES.filter(style => style.categoryId === category.id))
  );
  PUBLIC_STYLES_BY_CATEGORY.set(
    category.id,
    deepFreeze(PUBLIC_STYLES.filter(style => style.categoryId === category.id))
  );
}

/** @returns {number} 현재 카탈로그 스키마 버전 */
export function getCatalogVersion() {
  return CATALOG_SCHEMA_VERSION;
}

/** @returns {readonly import('./contract.js').CategoryRecord[]} 정렬·동결된 카테고리 */
export function getCategories() {
  return CATEGORY_DEFINITIONS;
}

/**
 * @param {{ includeUnpublished?: boolean }} [options]
 * @returns {readonly import('./contract.js').StyleRecord[]} 정렬·동결된 스타일
 */
export function getAllStyles(options = {}) {
  return options?.includeUnpublished === true ? ALL_STYLES : PUBLIC_STYLES;
}

/**
 * 정규 ID와 별칭을 해석한다. 외부 저장 데이터가 오래됐거나 형식이 다르면 null을 반환한다.
 * @param {unknown} id
 * @returns {string|null}
 */
export function resolveCanonicalStyleId(id) {
  if (typeof id !== 'string' || id.length === 0) return null;
  if (STYLE_BY_ID.has(id)) return id;
  return CANONICAL_ID_BY_ALIAS.get(id) || null;
}

/**
 * @param {unknown} id 정규 ID 또는 별칭
 * @param {{ includeUnpublished?: boolean }} [options]
 * @returns {import('./contract.js').StyleRecord|null}
 */
export function getStyleById(id, options = {}) {
  const canonicalId = resolveCanonicalStyleId(id);
  if (!canonicalId) return null;

  const style = STYLE_BY_ID.get(canonicalId) || null;
  return style && isStyleVisible(style, options) ? style : null;
}

/**
 * @param {unknown} categoryId
 * @param {{ includeUnpublished?: boolean }} [options]
 * @returns {readonly import('./contract.js').StyleRecord[]}
 */
export function getStylesByCategory(categoryId, options = {}) {
  if (typeof categoryId !== 'string' || !CATEGORY_IDS.has(categoryId)) {
    return EMPTY_STYLES;
  }

  return options?.includeUnpublished === true
    ? ALL_STYLES_BY_CATEGORY.get(categoryId)
    : PUBLIC_STYLES_BY_CATEGORY.get(categoryId);
}

/** @returns {readonly import('./contract.js').FacetDefinition[]} 정렬·동결된 facet 사전 */
export function getFacetDefinitions() {
  return FACET_DEFINITIONS;
}

/** @returns {readonly import('./contract.js').StylePackManifest[]} 정렬·동결된 팩 manifest */
export function getPackManifests() {
  return PACK_MANIFESTS;
}
