const DEFAULT_GALLERY_PAGE_SIZE = 36;
const DEFAULT_PICKER_LIMIT = 12;
const MAX_PICKER_LIMIT = 24;
const MAX_PICKER_QUERY_LENGTH = 120;

export const RENDER_SCALABILITY_BUDGETS = Object.freeze({
  galleryPageSize: DEFAULT_GALLERY_PAGE_SIZE,
  detailPickerLimit: MAX_PICKER_LIMIT,
  splitPickerLimit: DEFAULT_PICKER_LIMIT,
  initialJavaScriptGzipBytes: 88_980,
  initialCssGzipBytes: 33_000,
  interactionMedianMs: 120,
  interactionMaximumMs: 200
});

function positiveInteger(value, fallback) {
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

function normalizedQuery(value) {
  if (typeof value !== 'string') return '';
  return value
    .slice(0, MAX_PICKER_QUERY_LENGTH)
    .trim()
    .replace(/\s+/gu, ' ');
}

function searchableText(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/\p{Mark}/gu, '')
    .toLocaleLowerCase('en');
}

function defaultSearchText(item) {
  return [
    item?.id,
    item?.name,
    item?.nameEn,
    item?.categoryId,
    item?.category,
    ...(Array.isArray(item?.aliases) ? item.aliases : [])
  ].filter(Boolean).join(' ');
}

function uniqueIdentifiedItems(items) {
  if (!Array.isArray(items)) return [];
  const seen = new Set();
  const result = [];
  for (const item of items) {
    if (!item || typeof item !== 'object' || typeof item.id !== 'string' || !item.id || seen.has(item.id)) {
      continue;
    }
    seen.add(item.id);
    result.push(item);
  }
  return result;
}

/**
 * 전체 결과는 보존하고 이번 화면에 만들 항목만 결정한다.
 * page는 1부터 시작하며 범위를 벗어나면 가장 가까운 유효 페이지로 제한한다.
 */
export function createRenderWindow(items, options = {}) {
  const source = Array.isArray(items) ? items : [];
  const pageSize = positiveInteger(options?.pageSize, DEFAULT_GALLERY_PAGE_SIZE);
  const total = source.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const requestedPage = positiveInteger(options?.page, 1);
  const page = Math.min(requestedPage, pageCount);
  const offset = (page - 1) * pageSize;
  const visibleItems = Object.freeze(source.slice(offset, offset + pageSize));
  const start = total === 0 ? 0 : offset + 1;
  const end = total === 0 ? 0 : offset + visibleItems.length;

  return Object.freeze({
    items: visibleItems,
    start,
    end,
    total,
    page,
    pageCount,
    pageSize,
    canPrevious: page > 1,
    canNext: page < pageCount
  });
}

/**
 * 검색 일치 항목을 제한하되 현재 선택은 제한 안에 정확히 한 번 남긴다.
 */
export function createBoundedPicker(items, options = {}) {
  const source = uniqueIdentifiedItems(items);
  const limit = Math.min(
    positiveInteger(options?.limit, DEFAULT_PICKER_LIMIT),
    MAX_PICKER_LIMIT
  );
  const query = normalizedQuery(options?.query);
  const tokens = searchableText(query).split(/\s+/u).filter(Boolean);
  const getSearchText = typeof options?.getSearchText === 'function'
    ? options.getSearchText
    : defaultSearchText;

  const matches = tokens.length === 0
    ? source
    : source.filter(item => {
        const document = searchableText(getSearchText(item));
        return tokens.every(token => document.includes(token));
      });

  const selectedId = typeof options?.selectedId === 'string' ? options.selectedId : '';
  const selected = source.find(item => item.id === selectedId) || null;
  let visibleItems = matches.slice(0, limit);
  let selectedPinned = false;

  if (selected && !visibleItems.some(item => item.id === selected.id)) {
    visibleItems = [selected, ...visibleItems.filter(item => item.id !== selected.id)].slice(0, limit);
    selectedPinned = true;
  }

  return Object.freeze({
    items: Object.freeze(visibleItems),
    matchCount: matches.length,
    selectedPinned,
    query
  });
}
