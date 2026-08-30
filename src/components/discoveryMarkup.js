import {
  getAllStyles,
  getCategories,
  getFacetDefinitions,
  getFacetValueCounts,
  normalizeFacetSelections,
  normalizeSearchQuery,
  queryCatalogForDiscoveryState
} from '../catalog/index.js';

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

function renderRemoveChip({ label, clearKey, facetId, valueId }) {
  const data = clearKey
    ? `data-clear-key="${clearKey}"`
    : `data-remove-facet="${facetId}" data-remove-value="${valueId}"`;
  return `
    <button type="button" class="discovery-active-chip" ${data}
            aria-label="조건 제거: ${escapeHtml(label)}">
      <span>${escapeHtml(label)}</span>
      <span aria-hidden="true">×</span>
    </button>
  `;
}

function getActiveChips(state, facets) {
  const chips = [];
  const query = normalizeSearchQuery(state?.searchQuery);
  if (query) chips.push({ label: `검색: ${query}`, clearKey: 'query' });

  const category = CATEGORY_BY_ID.get(state?.activeFilter);
  if (category) chips.push({ label: `카테고리: ${category.title.ko}`, clearKey: 'category' });
  if (state?.bookmarkFilterActive === true) {
    chips.push({ label: '북마크만', clearKey: 'bookmark' });
  }

  for (const facet of FACETS) {
    const selected = new Set(facets[facet.id] || []);
    for (const value of facet.values) {
      if (!selected.has(value.id)) continue;
      chips.push({
        label: `${facet.label.ko}: ${value.label.ko}`,
        facetId: facet.id,
        valueId: value.id
      });
    }
  }
  return chips;
}

function renderFacetOption(facet, value, selected) {
  const isSingle = facet.selectionMode === 'single';
  const inputType = isSingle ? 'radio' : 'checkbox';
  const inputId = `facet-${facet.id}-${value.id}`;
  const count = FACET_COUNTS[facet.id][value.id] || 0;
  return `
    <label class="facet-option" for="${inputId}">
      <input type="${inputType}" name="facet-${facet.id}" id="${inputId}"
             value="${value.id}" data-facet-id="${facet.id}"
             ${selected.has(value.id) ? 'checked' : ''}>
      <span class="facet-option-label">${escapeHtml(value.label.ko)}</span>
      <span class="facet-option-count" aria-label="${count}개 스타일">${count}</span>
    </label>
  `;
}

function renderFacetGroup(facet, selections, openFacetIds) {
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
        <span>${escapeHtml(facet.label.ko)}</span>
        <span class="facet-group-summary-state">
          <span class="facet-group-meta">${selected.size ? `${selected.size}개 선택` : '전체'}</span>
          <span class="disclosure-indicator" aria-hidden="true"></span>
        </span>
      </summary>
      <fieldset class="facet-options">
        <legend class="visually-hidden">${escapeHtml(facet.label.ko)} · ${isSingle ? '하나만 선택' : '복수 선택 가능'}</legend>
        ${isSingle ? `
          <label class="facet-option" for="${allId}">
            <input type="radio" name="facet-${facet.id}" id="${allId}"
                   value="" data-facet-id="${facet.id}" ${selected.size === 0 ? 'checked' : ''}>
            <span class="facet-option-label">전체</span>
          </label>
        ` : ''}
        ${values.map(value => renderFacetOption(facet, value, selected)).join('')}
      </fieldset>
    </details>
  `;
}

export function renderDiscoveryControlsHTML(state = {}, uiState = {}) {
  const selections = normalizeFacetSelections(state?.activeFacets);
  const results = queryCatalogForDiscoveryState(ALL_STYLES, {
    ...state,
    activeFacets: selections
  });
  const activeChips = getActiveChips(state, selections);
  const openFacetIds = uiState?.openFacetIds instanceof Set
    ? uiState.openFacetIds
    : new Set();
  const hasOverrides = activeChips.length > 0 || state?.sortMode !== 'catalog';

  return `
    <section class="discovery-controls" aria-labelledby="discovery-title">
      <div class="discovery-toolbar">
        <div class="discovery-summary">
          <span class="discovery-eyebrow">STYLE DISCOVERY</span>
          <h2 id="discovery-title">원하는 디자인을 조건으로 좁혀보세요</h2>
          <p class="discovery-result-status" role="status" aria-live="polite" aria-atomic="true">
            전체 ${ALL_STYLES.length}종 중 <strong>${results.length}종</strong> 표시${activeChips.length ? ` · 활성 조건 ${activeChips.length}개` : ''}
          </p>
        </div>
        <div class="discovery-toolbar-actions">
          <label for="discovery-sort">정렬</label>
          <select id="discovery-sort" aria-label="결과 정렬">
            <option value="catalog" ${state?.sortMode === 'catalog' || !state?.sortMode ? 'selected' : ''}>기본 카탈로그 순</option>
            <option value="name-asc" ${state?.sortMode === 'name-asc' ? 'selected' : ''}>영문 이름 A–Z</option>
            <option value="era-asc" ${state?.sortMode === 'era-asc' ? 'selected' : ''}>오래된 시대부터</option>
            <option value="era-desc" ${state?.sortMode === 'era-desc' ? 'selected' : ''}>최신 시대부터</option>
          </select>
          <button type="button" class="discovery-reset-btn" id="discovery-reset"
                  ${hasOverrides ? '' : 'disabled'}>조건 초기화</button>
        </div>
      </div>

      <details class="discovery-filter-panel" ${uiState?.panelOpen ? 'open' : ''}>
        <summary id="discovery-panel-toggle">
          <span class="discovery-panel-heading">
            <span>세부 필터 10개</span>
            <span class="discovery-panel-summary">시대 · 계보 · 매체 · 질감 · 분위기 등</span>
          </span>
          <span class="disclosure-indicator" aria-hidden="true"></span>
        </summary>
        <div class="discovery-panel-body">
          <div class="discovery-active-filters" aria-label="현재 활성 조건">
            ${activeChips.length
              ? activeChips.map(renderRemoveChip).join('')
              : '<p>활성화된 세부 조건이 없습니다.</p>'}
          </div>
          <div class="facet-groups-grid">
            ${FACETS.map(facet => renderFacetGroup(facet, selections, openFacetIds)).join('')}
          </div>
        </div>
      </details>
    </section>
  `;
}
