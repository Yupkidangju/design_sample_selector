import {
  getAllStyles,
  getCategories,
  getFacetDefinitions,
  getFacetValueCounts,
  normalizeFacetSelections,
  normalizeSearchQuery,
  queryCatalogForDiscoveryState
} from '../catalog/index.js';
import { getActiveLocaleSnapshot } from '../i18n/index.js';
import { formatLocaleCopy } from '../i18n/format.js';

const ALL_STYLES = getAllStyles();
const CATEGORIES = getCategories();
const FACETS = getFacetDefinitions();
const FACET_COUNTS = getFacetValueCounts(ALL_STYLES);
const CATEGORY_BY_ID = new Map(CATEGORIES.map(category => [category.id, category]));

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderRemoveChip({ label, clearKey, facetId, valueId }, snapshot) {
  const data = clearKey
    ? `data-clear-key="${clearKey}"`
    : `data-remove-facet="${facetId}" data-remove-value="${valueId}"`;
  return `
    <button type="button" class="discovery-active-chip" ${data}
            aria-label="${escapeHtml(formatLocaleCopy(snapshot?.copy, 'discovery.removeCondition', { label }))}">
      <span>${escapeHtml(label)}</span>
      <span aria-hidden="true">×</span>
    </button>
  `;
}

function getActiveChips(state, facets, snapshot) {
  const chips = [];
  const copy = snapshot?.copy;
  const query = normalizeSearchQuery(state?.searchQuery);
  if (query) chips.push({ label: formatLocaleCopy(copy, 'discovery.searchChip', { query }), clearKey: 'query' });

  const category = CATEGORY_BY_ID.get(state?.activeFilter);
  if (category) chips.push({ label: `${formatLocaleCopy(copy, 'discovery.categoryPrefix')}: ${snapshot?.catalog?.categories?.[category.id]?.title || category.title.ko}`, clearKey: 'category' });
  if (state?.bookmarkFilterActive === true) {
    chips.push({ label: formatLocaleCopy(copy, 'discovery.bookmarksOnly'), clearKey: 'bookmark' });
  }

  for (const facet of FACETS) {
    const selected = new Set(facets[facet.id] || []);
    for (const value of facet.values) {
      if (!selected.has(value.id)) continue;
      chips.push({
        label: `${snapshot?.catalog?.facets?.[facet.id]?.label || facet.label.ko}: ${snapshot?.catalog?.facets?.[facet.id]?.values?.[value.id] || value.label.ko}`,
        facetId: facet.id,
        valueId: value.id
      });
    }
  }
  return chips;
}

function renderFacetOption(facet, value, selected, snapshot) {
  const isSingle = facet.selectionMode === 'single';
  const inputType = isSingle ? 'radio' : 'checkbox';
  const inputId = `facet-${facet.id}-${value.id}`;
  const count = FACET_COUNTS[facet.id][value.id] || 0;
  return `
    <label class="facet-option" for="${inputId}">
      <input type="${inputType}" name="facet-${facet.id}" id="${inputId}"
             value="${value.id}" data-facet-id="${facet.id}"
             ${selected.has(value.id) ? 'checked' : ''}>
      <span class="facet-option-label">${escapeHtml(snapshot?.catalog?.facets?.[facet.id]?.values?.[value.id] || value.label.ko)}</span>
      <span class="facet-option-count" aria-label="${escapeHtml(formatLocaleCopy(snapshot?.copy, 'discovery.styleCount', { count }))}">${count}</span>
    </label>
  `;
}

function renderFacetGroup(facet, selections, openFacetIds, snapshot) {
  const selected = new Set(selections[facet.id] || []);
  const values = facet.values.filter(value => (
    FACET_COUNTS[facet.id][value.id] > 0 || selected.has(value.id)
  ));
  const isSingle = facet.selectionMode === 'single';
  const allId = `facet-${facet.id}-all`;

  return `
    <details class="facet-group" data-facet-group="${facet.id}"
             ${openFacetIds.has(facet.id) ? 'open' : ''}>
      <summary>
        <span>${escapeHtml(snapshot?.catalog?.facets?.[facet.id]?.label || facet.label.ko)}</span>
        <span class="facet-group-summary-state">
          <span class="facet-group-meta">${selected.size ? escapeHtml(formatLocaleCopy(snapshot?.copy, 'discovery.selectedCount', { count: selected.size })) : escapeHtml(formatLocaleCopy(snapshot?.copy, 'discovery.all'))}</span>
          <span class="disclosure-indicator" aria-hidden="true"></span>
        </span>
      </summary>
      <fieldset class="facet-options">
        <legend class="visually-hidden">${escapeHtml(snapshot?.catalog?.facets?.[facet.id]?.label || facet.label.ko)} · ${escapeHtml(formatLocaleCopy(snapshot?.copy, isSingle ? 'discovery.singleLegend' : 'discovery.multipleLegend'))}</legend>
        ${isSingle ? `
          <label class="facet-option" for="${allId}">
            <input type="radio" name="facet-${facet.id}" id="${allId}"
                   value="" data-facet-id="${facet.id}" ${selected.size === 0 ? 'checked' : ''}>
            <span class="facet-option-label">${escapeHtml(formatLocaleCopy(snapshot?.copy, 'discovery.all'))}</span>
          </label>
        ` : ''}
        ${values.map(value => renderFacetOption(facet, value, selected, snapshot)).join('')}
      </fieldset>
    </details>
  `;
}

export function renderDiscoveryControlsHTML(state = {}, uiState = {}) {
  const snapshot = getActiveLocaleSnapshot();
  const messages = snapshot?.messages || {};
  const copy = snapshot?.copy;
  const selections = normalizeFacetSelections(state?.activeFacets);
  const results = queryCatalogForDiscoveryState(ALL_STYLES, {
    ...state,
    activeFacets: selections,
    localizedStyles: snapshot?.catalog?.styles
  });
  const activeChips = getActiveChips(state, selections, snapshot);
  const openFacetIds = uiState?.openFacetIds instanceof Set
    ? uiState.openFacetIds
    : new Set();
  const hasOverrides = activeChips.length > 0 || state?.sortMode !== 'catalog';

  return `
    <section class="discovery-controls" aria-labelledby="discovery-title">
      <div class="discovery-toolbar">
        <div class="discovery-summary">
          <span class="discovery-eyebrow">${escapeHtml(formatLocaleCopy(copy, 'discovery.filterEyebrow'))}</span>
          <h2 id="discovery-title">${escapeHtml(formatLocaleCopy(copy, 'discovery.title'))}</h2>
          <p class="discovery-result-status" role="status" aria-live="polite" aria-atomic="true">
            ${escapeHtml(formatLocaleCopy(copy, 'discovery.resultStatus', { total: ALL_STYLES.length, count: results.length }))}${activeChips.length ? ` · ${escapeHtml(formatLocaleCopy(copy, 'discovery.activeCount', { count: activeChips.length }))}` : ''}
          </p>
        </div>
        <div class="discovery-toolbar-actions">
          <label for="discovery-sort">${escapeHtml(messages.sort || '')}</label>
          <select id="discovery-sort" aria-label="${escapeHtml(formatLocaleCopy(copy, 'discovery.sortAria'))}">
            <option value="catalog" ${state?.sortMode === 'catalog' || !state?.sortMode ? 'selected' : ''}>${escapeHtml(messages.catalogOrder || '')}</option>
            <option value="name-asc" ${state?.sortMode === 'name-asc' ? 'selected' : ''}>${escapeHtml(messages.nameAscending || '')}</option>
            <option value="era-asc" ${state?.sortMode === 'era-asc' ? 'selected' : ''}>${escapeHtml(messages.eraAscending || '')}</option>
            <option value="era-desc" ${state?.sortMode === 'era-desc' ? 'selected' : ''}>${escapeHtml(messages.eraDescending || '')}</option>
          </select>
          <button type="button" class="discovery-reset-btn" id="discovery-reset"
                  ${hasOverrides ? '' : 'disabled'}>${escapeHtml(messages.clearFilters || '')}</button>
        </div>
      </div>

      <details class="discovery-filter-panel" ${uiState?.panelOpen ? 'open' : ''}>
        <summary id="discovery-panel-toggle">
          <span class="discovery-panel-heading">
            <span>${escapeHtml(formatLocaleCopy(copy, 'discovery.panelTitle'))}</span>
            <span class="discovery-panel-summary">${escapeHtml(formatLocaleCopy(copy, 'discovery.panelSummary'))}</span>
          </span>
          <span class="disclosure-indicator" aria-hidden="true"></span>
        </summary>
        <div class="discovery-panel-body">
          <div class="discovery-active-filters" aria-label="${escapeHtml(formatLocaleCopy(copy, 'discovery.activeConditions'))}">
            ${activeChips.length
              ? activeChips.map(chip => renderRemoveChip(chip, snapshot)).join('')
              : `<p>${escapeHtml(formatLocaleCopy(copy, 'discovery.noActive'))}</p>`}
          </div>
          <div class="facet-groups-grid">
            ${FACETS.map(facet => renderFacetGroup(facet, selections, openFacetIds, snapshot)).join('')}
          </div>
        </div>
      </details>
    </section>
  `;
}
