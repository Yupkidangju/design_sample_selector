import {
  getAllStyles,
  groupStylesByEra,
  queryCatalogForDiscoveryState
} from '../catalog/index.js';
import {
  getLegacyAllSubDesigns,
  getLegacyMainCategories
} from '../catalog/legacyAdapter.js';
import {
  RENDER_SCALABILITY_BUDGETS,
  createRenderWindow
} from '../scalability/renderWindow.js';

const ALL_STYLES = getAllStyles();
const LEGACY_CATEGORIES = getLegacyMainCategories();
const LEGACY_STYLE_BY_ID = new Map(
  getLegacyAllSubDesigns().map(style => [style.id, style])
);
const CATEGORY_BY_ID = new Map(
  LEGACY_CATEGORIES.map(category => [category.id, category])
);

function createEntry(style) {
  const sub = LEGACY_STYLE_BY_ID.get(style.id);
  const category = CATEGORY_BY_ID.get(style.categoryId);
  if (!sub || !category) {
    throw new Error(`갤러리 호환 projection이 없습니다: ${style.id}`);
  }
  return Object.freeze({ style, sub, category });
}

/**
 * 세 갤러리 보기가 동일한 정규 탐색 결과를 소비하도록 렌더링 모델을 만든다.
 * Grid만 카테고리별로 묶고 Bento는 전역 순서, Spectrum은 시대 순서를 사용한다.
 */
export function createGalleryModel(state = {}) {
  const results = queryCatalogForDiscoveryState(ALL_STYLES, state);
  const entries = Object.freeze(results.map(createEntry));
  const entryById = new Map(entries.map(entry => [entry.style.id, entry]));

  const categories = Object.freeze(LEGACY_CATEGORIES
    .map(category => {
      const categoryEntries = entries.filter(entry => entry.category.id === category.id);
      if (!categoryEntries.length) return null;
      return Object.freeze({
        ...category,
        subCategories: Object.freeze(categoryEntries.map(entry => entry.sub))
      });
    })
    .filter(Boolean));

  const eraGroups = Object.freeze(groupStylesByEra(results, {
    direction: state?.sortMode === 'era-desc' ? 'desc' : 'asc'
  }).map(group => Object.freeze({
    ...group,
    entries: Object.freeze(group.styles.map(style => entryById.get(style.id)))
  })));

  return Object.freeze({
    results,
    resultIds: Object.freeze(results.map(style => style.id)),
    categories,
    entries,
    eraGroups
  });
}

/**
 * canonical 결과 전체는 유지하면서 세 보기의 시각 projection만 같은 ID 창으로 제한한다.
 */
export function createGalleryWindow(model, options = {}) {
  const windowModel = createRenderWindow(model?.entries, {
    page: options?.page,
    pageSize: options?.pageSize ?? RENDER_SCALABILITY_BUDGETS.galleryPageSize
  });
  const visibleIds = new Set(windowModel.items.map(entry => entry.style.id));

  const categories = Object.freeze((model?.categories || [])
    .map(category => {
      const subCategories = Object.freeze(
        category.subCategories.filter(sub => visibleIds.has(sub.id))
      );
      return subCategories.length
        ? Object.freeze({ ...category, subCategories })
        : null;
    })
    .filter(Boolean));

  const eraGroups = Object.freeze((model?.eraGroups || [])
    .map(group => {
      const entries = Object.freeze(
        group.entries.filter(entry => visibleIds.has(entry.style.id))
      );
      if (!entries.length) return null;
      const styles = Array.isArray(group.styles)
        ? Object.freeze(group.styles.filter(style => visibleIds.has(style.id)))
        : group.styles;
      return Object.freeze({ ...group, styles, entries });
    })
    .filter(Boolean));

  return Object.freeze({
    ...model,
    entries: windowModel.items,
    categories,
    eraGroups,
    window: windowModel
  });
}
