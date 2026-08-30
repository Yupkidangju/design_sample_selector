import {
  getAllStyles,
  getCatalogVersion,
  getCategories,
  getFacetDefinitions,
  getPackManifests
} from '../index.js';
import { deepFreeze } from '../contract.js';
import { getPreviewReferenceInventory } from '../../preview/index.js';

const CURRENT_CATALOG_SNAPSHOT = deepFreeze({
  schemaVersion: getCatalogVersion(),
  categories: getCategories(),
  facets: getFacetDefinitions(),
  styles: getAllStyles({ includeUnpublished: true }),
  packs: getPackManifests(),
  references: getPreviewReferenceInventory()
});

/**
 * 정규 공개 조회 API로 조립한 현재 전체 카탈로그 스냅샷을 반환한다.
 *
 * @param {object} [options]
 * @returns {Readonly<import('./index.js').CatalogSnapshot>}
 */
export function createCurrentCatalogSnapshot(options = {}) {
  void options;
  return CURRENT_CATALOG_SNAPSHOT;
}
