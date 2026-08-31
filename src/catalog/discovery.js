import { CATEGORY_DEFINITIONS } from './categories.js';
import { FACET_DEFINITIONS } from './facets.js';
import { sortByOrderThenId } from './contract.js';

export const SEARCH_QUERY_MAX_LENGTH = 120;
export const DISCOVERY_SORT_MODES = Object.freeze([
  'catalog',
  'name-asc',
  'era-asc',
  'era-desc'
]);

const EMPTY_VALUES = Object.freeze([]);
const CATEGORY_BY_ID = new Map(CATEGORY_DEFINITIONS.map(category => [category.id, category]));
const FACET_BY_ID = new Map(FACET_DEFINITIONS.map(facet => [facet.id, facet]));
const FACET_VALUE_BY_ID = new Map(FACET_DEFINITIONS.map(facet => [
  facet.id,
  new Map(facet.values.map(value => [value.id, value]))
]));

const CLASSIFICATION_FIELD_BY_FACET = Object.freeze({
  kind: 'kind',
  lineage: 'lineages',
  media: 'media',
  materiality: 'materiality',
  density: 'density',
  tone: 'tone',
  motion: 'motion',
  region: 'regions',
  maturity: 'maturity'
});

function normalizeText(value) {
  if (typeof value !== 'string') return '';
  return value
    .normalize('NFKD')
    .replace(/\p{Mark}/gu, '')
    .toLocaleLowerCase('ko')
    .trim()
    .replace(/\s+/g, ' ');
}

export function normalizeSearchQuery(value) {
  if (typeof value !== 'string') return '';
  return value.slice(0, SEARCH_QUERY_MAX_LENGTH).trim().replace(/\s+/g, ' ');
}

function getEraFacetId(start) {
  if (!Number.isInteger(start)) return 'timeless';
  if (start < 1950) return 'pre-1950';
  if (start < 1980) return '1950s-1970s';
  if (start < 2000) return '1980s-1990s';
  if (start < 2010) return '2000s';
  if (start < 2020) return '2010s';
  return '2020s';
}

export function getStyleFacetValues(style, facetId) {
  const facet = FACET_BY_ID.get(facetId);
  const classification = style?.classification;
  if (!facet || !classification || typeof classification !== 'object') return EMPTY_VALUES;

  const raw = facetId === 'era'
    ? [getEraFacetId(classification.era?.start)]
    : classification[CLASSIFICATION_FIELD_BY_FACET[facetId]];
  const values = Array.isArray(raw) ? raw : [raw];
  const allowed = FACET_VALUE_BY_ID.get(facetId);
  const normalized = [...new Set(values.filter(value => typeof value === 'string' && allowed.has(value)))];
  return normalized.length ? Object.freeze(normalized) : EMPTY_VALUES;
}

export function normalizeFacetSelections(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return Object.freeze({});

  const normalized = {};
  for (const facet of FACET_DEFINITIONS) {
    const raw = input[facet.id];
    if (raw === undefined || raw === null) continue;

    const requested = Array.isArray(raw) ? raw : [raw];
    const allowed = FACET_VALUE_BY_ID.get(facet.id);
    const values = [...new Set(requested.filter(value => (
      typeof value === 'string' && allowed.has(value)
    )))];
    const selected = facet.selectionMode === 'single' ? values.slice(0, 1) : values;
    if (selected.length) normalized[facet.id] = Object.freeze(selected);
  }

  return Object.freeze(normalized);
}

export function updateFacetSelection(input, facetId, valueId, selected) {
  const facet = FACET_BY_ID.get(facetId);
  const value = FACET_VALUE_BY_ID.get(facetId)?.get(valueId);
  const current = normalizeFacetSelections(input);
  if (!facet || !value || typeof selected !== 'boolean') return current;

  const next = Object.fromEntries(
    Object.entries(current).map(([id, values]) => [id, [...values]])
  );

  if (facet.selectionMode === 'single') {
    if (selected) next[facetId] = [valueId];
    else delete next[facetId];
  } else {
    const values = new Set(next[facetId] || []);
    if (selected) values.add(valueId);
    else values.delete(valueId);
    if (values.size) next[facetId] = [...values];
    else delete next[facetId];
  }

  return normalizeFacetSelections(next);
}

function getLocalizedTextValues(value) {
  if (!value || typeof value !== 'object') return [];
  return [value.ko, value.en].filter(text => typeof text === 'string');
}

function createSearchDocument(style, localizedStyle) {
  const category = CATEGORY_BY_ID.get(style.categoryId);
  const values = [
    style.id,
    ...(Array.isArray(style.aliases) ? style.aliases : []),
    ...getLocalizedTextValues(style.name),
    ...getLocalizedTextValues(style.summary),
    ...getLocalizedTextValues(category?.title),
    ...getLocalizedTextValues(category?.description),
    ...(category?.tags || []),
    ...(style.editorial?.moodTags || []),
    ...(style.editorial?.characteristics || []),
    style.classification?.era?.label
  ];
  if (localizedStyle) {
    values.push(
      localizedStyle.name,
      localizedStyle.summary,
      ...(localizedStyle.characteristics || []),
      ...(localizedStyle.pros || []),
      ...(localizedStyle.cons || []),
      ...(localizedStyle.palette || []).flatMap(item => [item.name, item.usage])
    );
  }

  for (const facet of FACET_DEFINITIONS) {
    for (const valueId of getStyleFacetValues(style, facet.id)) {
      const facetValue = FACET_VALUE_BY_ID.get(facet.id).get(valueId);
      values.push(valueId, ...getLocalizedTextValues(facetValue?.label));
    }
  }

  return normalizeText(values.filter(Boolean).join(' '));
}

function compareNames(left, right) {
  return left.name.en.localeCompare(right.name.en, 'en', { sensitivity: 'base' })
    || sortByOrderThenId(left, right);
}

function compareEra(left, right, direction) {
  const leftStart = Number.isInteger(left.classification?.era?.start)
    ? left.classification.era.start
    : null;
  const rightStart = Number.isInteger(right.classification?.era?.start)
    ? right.classification.era.start
    : null;

  if (leftStart === null && rightStart !== null) return 1;
  if (rightStart === null && leftStart !== null) return -1;
  if (leftStart !== rightStart) {
    return direction === 'desc' ? rightStart - leftStart : leftStart - rightStart;
  }
  return sortByOrderThenId(left, right);
}

function getSortComparator(sort, localizedStyles, locale) {
  if (sort === 'name-asc' && localizedStyles) return (left, right) => (
    localizedStyles[left.id].name.localeCompare(localizedStyles[right.id].name, locale)
      || sortByOrderThenId(left, right)
  );
  if (sort === 'name-asc') return compareNames;
  if (sort === 'era-asc') return (left, right) => compareEra(left, right, 'asc');
  if (sort === 'era-desc') return (left, right) => compareEra(left, right, 'desc');
  return sortByOrderThenId;
}

export function queryCatalogStyles(styles, options = {}) {
  const source = Array.isArray(styles) ? styles : [];
  const query = normalizeText(normalizeSearchQuery(options?.query));
  const queryTokens = query ? query.split(' ') : EMPTY_VALUES;
  const categoryId = CATEGORY_BY_ID.has(options?.categoryId) ? options.categoryId : null;
  const facets = normalizeFacetSelections(options?.facets);
  const bookmarksOnly = options?.bookmarksOnly === true;
  const bookmarkedIds = new Set(
    Array.isArray(options?.bookmarkedIds)
      ? options.bookmarkedIds.filter(id => typeof id === 'string')
      : []
  );
  const sort = DISCOVERY_SORT_MODES.includes(options?.sort) ? options.sort : 'catalog';
  const localizedStyles = options?.localizedStyles;

  const results = source.filter(style => {
    if (!style || typeof style !== 'object') return false;
    if (categoryId && style.categoryId !== categoryId) return false;
    if (bookmarksOnly && !bookmarkedIds.has(style.id)) return false;

    if (queryTokens.length) {
      const document = createSearchDocument(style, localizedStyles?.[style.id]);
      if (!queryTokens.every(token => document.includes(token))) return false;
    }

    for (const [facetId, selectedValues] of Object.entries(facets)) {
      const styleValues = getStyleFacetValues(style, facetId);
      if (!selectedValues.some(value => styleValues.includes(value))) return false;
    }
    return true;
  });

  return Object.freeze(results.sort(getSortComparator(sort, localizedStyles, options?.locale)));
}

export function queryCatalogForDiscoveryState(styles, state = {}) {
  return queryCatalogStyles(styles, {
    query: state?.searchQuery,
    categoryId: state?.activeFilter,
    facets: state?.activeFacets,
    sort: state?.sortMode,
    bookmarksOnly: state?.bookmarkFilterActive,
    bookmarkedIds: state?.bookmarks,
    localizedStyles: state?.localizedStyles,
    locale: state?.locale
  });
}

export function getFacetValueCounts(styles) {
  const source = Array.isArray(styles) ? styles : [];
  const counts = {};

  for (const facet of FACET_DEFINITIONS) {
    const facetCounts = Object.fromEntries(facet.values.map(value => [value.id, 0]));
    for (const style of source) {
      for (const valueId of getStyleFacetValues(style, facet.id)) {
        facetCounts[valueId] += 1;
      }
    }
    counts[facet.id] = Object.freeze(facetCounts);
  }

  return Object.freeze(counts);
}

export function groupStylesByEra(styles, options = {}) {
  const source = Array.isArray(styles) ? styles : [];
  const eraFacet = FACET_BY_ID.get('era');
  const stylesByEra = new Map(eraFacet.values.map(value => [value.id, []]));

  for (const style of source) {
    const [eraId] = getStyleFacetValues(style, 'era');
    if (eraId) stylesByEra.get(eraId).push(style);
  }

  const groups = eraFacet.values
    .filter(value => stylesByEra.get(value.id).length > 0)
    .map(value => Object.freeze({
      id: value.id,
      order: value.order,
      label: value.label,
      styles: Object.freeze([...stylesByEra.get(value.id)])
    }));

  if (options?.direction === 'desc') groups.reverse();
  return Object.freeze(groups);
}
