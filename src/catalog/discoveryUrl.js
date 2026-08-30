import { CATEGORY_DEFINITIONS } from './categories.js';
import {
  DISCOVERY_SORT_MODES,
  normalizeFacetSelections,
  normalizeSearchQuery
} from './discovery.js';
import { FACET_DEFINITIONS } from './facets.js';

const CATEGORY_IDS = new Set(CATEGORY_DEFINITIONS.map(category => category.id));
const VIEW_MODE_BY_PARAM = Object.freeze({
  grid: 'GRID',
  bento: 'BENTO',
  spectrum: 'SPECTRUM'
});
const PARAM_BY_VIEW_MODE = Object.freeze({
  GRID: 'grid',
  BENTO: 'bento',
  SPECTRUM: 'spectrum'
});

export const DEFAULT_DISCOVERY_STATE = Object.freeze({
  searchQuery: '',
  activeFilter: 'ALL',
  activeFacets: Object.freeze({}),
  sortMode: 'catalog',
  viewMode: 'GRID',
  bookmarkFilterActive: false
});

export function normalizeDiscoveryState(input = {}) {
  const activeFilter = CATEGORY_IDS.has(input?.activeFilter)
    ? input.activeFilter
    : 'ALL';
  const sortMode = DISCOVERY_SORT_MODES.includes(input?.sortMode)
    ? input.sortMode
    : 'catalog';
  const viewMode = Object.hasOwn(PARAM_BY_VIEW_MODE, input?.viewMode)
    ? input.viewMode
    : 'GRID';

  return Object.freeze({
    searchQuery: normalizeSearchQuery(input?.searchQuery),
    activeFilter,
    activeFacets: normalizeFacetSelections(input?.activeFacets),
    sortMode,
    viewMode,
    bookmarkFilterActive: input?.bookmarkFilterActive === true
  });
}

function toSearchParams(search) {
  if (search instanceof URLSearchParams) return new URLSearchParams(search);
  return new URLSearchParams(typeof search === 'string' ? search : '');
}

export function parseDiscoverySearch(search = '') {
  const params = toSearchParams(search);
  const activeFacets = {};

  for (const entry of params.getAll('f')) {
    const separator = entry.indexOf(':');
    if (separator <= 0 || separator === entry.length - 1) continue;
    const facetId = entry.slice(0, separator);
    const valueId = entry.slice(separator + 1);
    if (!activeFacets[facetId]) activeFacets[facetId] = [];
    activeFacets[facetId].push(valueId);
  }

  return normalizeDiscoveryState({
    searchQuery: params.get('q') || '',
    activeFilter: params.get('category') || 'ALL',
    activeFacets,
    sortMode: params.get('sort') || 'catalog',
    viewMode: VIEW_MODE_BY_PARAM[params.get('view')] || 'GRID',
    bookmarkFilterActive: params.get('saved') === '1'
  });
}

export function serializeDiscoverySearch(input = {}) {
  const state = normalizeDiscoveryState(input);
  const params = new URLSearchParams();

  if (state.searchQuery) params.set('q', state.searchQuery);
  if (state.activeFilter !== 'ALL') params.set('category', state.activeFilter);

  for (const facet of FACET_DEFINITIONS) {
    const selected = new Set(state.activeFacets[facet.id] || []);
    for (const value of facet.values) {
      if (selected.has(value.id)) params.append('f', `${facet.id}:${value.id}`);
    }
  }

  if (state.sortMode !== 'catalog') params.set('sort', state.sortMode);
  if (state.viewMode !== 'GRID') params.set('view', PARAM_BY_VIEW_MODE[state.viewMode]);
  if (state.bookmarkFilterActive) params.set('saved', '1');

  const query = params.toString();
  return query ? `?${query}` : '';
}
