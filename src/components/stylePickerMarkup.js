import {
  RENDER_SCALABILITY_BUDGETS,
  createBoundedPicker
} from '../scalability/renderWindow.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/gu, '&amp;')
    .replace(/"/gu, '&quot;')
    .replace(/</gu, '&lt;')
    .replace(/>/gu, '&gt;');
}

export function getStylePickerSearchText(style) {
  return [
    style?.id,
    ...(Array.isArray(style?.aliases) ? style.aliases : []),
    style?.name,
    style?.nameEn,
    style?.categoryId,
    style?.categoryTitle
  ].filter(Boolean).join(' ');
}

export function renderDetailStyleChips(styles, options = {}) {
  const picker = createBoundedPicker(styles, {
    query: options?.query,
    selectedId: options?.selectedId,
    limit: RENDER_SCALABILITY_BUDGETS.detailPickerLimit,
    getSearchText: getStylePickerSearchText
  });
  const renderThumbnail = typeof options?.renderThumbnail === 'function'
    ? options.renderThumbnail
    : () => '';

  const markup = picker.items.map(style => {
    const selected = style.id === options?.selectedId;
    return `
      <button class="top-style-chip ${selected ? 'active' : ''}"
              data-sub-id="${escapeHtml(style.id)}"
              data-cat-id="${escapeHtml(style.categoryId || options?.categoryId)}"
              title="[${escapeHtml(style.categoryTitle)}] ${escapeHtml(style.name)}"
              type="button"
              role="tab"
              aria-selected="${selected}">
        <span class="chip-thumb-mini">${renderThumbnail({
          thumbnailId: style.thumbMotif,
          design: style
        })}</span>
        <span>${escapeHtml(style.name)}</span>
      </button>
    `;
  }).join('');

  return Object.freeze({ ...picker, markup });
}

export function renderDetailStyleSelector(styles, options = {}) {
  const source = Array.isArray(styles) ? styles : [];
  const chips = renderDetailStyleChips(source, options);
  const categoryId = escapeHtml(options?.categoryId);
  const categoryTitle = escapeHtml(options?.categoryTitle || '현재 카테고리');
  const searchable = source.length > RENDER_SCALABILITY_BUDGETS.detailPickerLimit;
  const pinnedMessage = chips.selectedPinned ? ' · 현재 선택 고정' : '';

  return `
    <div class="top-style-selector" id="top-style-selector" data-category-id="${categoryId}">
      ${searchable ? `
        <label class="detail-style-search-label" for="detail-style-search">
          <span>${categoryTitle} 내 스타일 검색</span>
          <input class="detail-style-search" id="detail-style-search" type="search"
                 value="${escapeHtml(chips.query)}" autocomplete="off" maxlength="120"
                 aria-controls="top-style-chips-scroller">
        </label>
      ` : ''}
      <div class="top-style-chips-scroller" id="top-style-chips-scroller"
           role="tablist" aria-label="${source.length}개 세부 스타일">
        ${chips.markup}
      </div>
      <p class="detail-style-picker-status ${searchable ? '' : 'visually-hidden'}"
         id="detail-style-picker-status" role="status" aria-live="polite">
        ${chips.matchCount}개 세부 스타일${pinnedMessage}
      </p>
    </div>
  `;
}

export function renderSplitStyleChips(styles, options = {}) {
  const slot = options?.slot === 'B' ? 'B' : 'A';
  const picker = createBoundedPicker(styles, {
    query: options?.query,
    selectedId: options?.selectedId,
    limit: RENDER_SCALABILITY_BUDGETS.splitPickerLimit,
    getSearchText: getStylePickerSearchText
  });
  const renderThumbnail = typeof options?.renderThumbnail === 'function'
    ? options.renderThumbnail
    : () => '';

  const markup = picker.items.map(style => {
    const selected = style.id === options?.selectedId;
    return `
      <button class="split-pick-thumb ${selected ? 'active' : ''}"
              data-slot="${slot}" data-sub-id="${escapeHtml(style.id)}"
              title="${escapeHtml(style.name)}" type="button" role="tab"
              aria-selected="${selected}">
        ${renderThumbnail({ thumbnailId: style.thumbMotif, design: style })}
      </button>
    `;
  }).join('');

  return Object.freeze({ ...picker, markup });
}

export function renderSplitStylePicker(styles, options = {}) {
  const source = Array.isArray(styles) ? styles : [];
  const slot = options?.slot === 'B' ? 'B' : 'A';
  const slotLower = slot.toLocaleLowerCase('en');
  const chips = renderSplitStyleChips(source, { ...options, slot });
  const pinnedMessage = chips.selectedPinned ? ' · 현재 선택 고정' : '';

  return `
    <div class="split-picker-tools" data-slot="${slot}">
      <label class="split-picker-search-label" for="split-style-search-${slotLower}">
        스타일 ${slot} 썸네일 검색
      </label>
      <input class="split-picker-search" id="split-style-search-${slotLower}" type="search"
             value="${escapeHtml(chips.query)}" autocomplete="off" maxlength="120"
             data-split-search="${slot}" aria-controls="split-picker-${slotLower}">
      <p class="split-picker-status" id="split-picker-status-${slotLower}"
         role="status" aria-live="polite">
        ${chips.matchCount}개 일치${pinnedMessage}
      </p>
    </div>
    <div class="split-picker" id="split-picker-${slotLower}" data-slot="${slot}"
         role="tablist" aria-label="스타일 ${slot} 시각 선택"
         aria-describedby="split-picker-status-${slotLower}">
      ${chips.markup}
    </div>
  `;
}
