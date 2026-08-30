/**
 * @typedef {'error'|'warning'} CatalogValidationSeverity
 */

/**
 * @typedef {Object} CatalogValidationIssue
 * @property {string} code
 * @property {CatalogValidationSeverity} severity
 * @property {string} path
 * @property {string} message
 * @property {'catalog'|'category'|'facet'|'style'|'pack'|'reference'|'asset'} entityType
 * @property {string|null} entityId
 * @property {string|null} relatedPath
 */

/**
 * @typedef {Object} CatalogValidationReport
 * @property {boolean} valid
 * @property {readonly CatalogValidationIssue[]} issues
 * @property {{ errorCount: number, warningCount: number, totalCount: number }} summary
 */

/**
 * @typedef {Object} CatalogSnapshot
 * @property {number} schemaVersion
 * @property {readonly import('../contract.js').CategoryRecord[]} categories
 * @property {readonly import('../contract.js').FacetDefinition[]} facets
 * @property {readonly import('../contract.js').StyleRecord[]} styles
 * @property {readonly import('../contract.js').StylePackManifest[]} packs
 * @property {{ rendererIds: readonly string[], thumbnailIds: readonly string[], motionIds: readonly string[], assetPaths: readonly string[] }} references
 */

export {
  CatalogValidationError,
  formatCatalogValidationReport
} from './report.js';

import {
  CatalogValidationError,
  createCatalogValidationReport,
  shouldFailCatalogValidation
} from './report.js';
import { collectCatalogIssues } from './rules.js';
import { createCurrentCatalogSnapshot } from './currentCatalog.js';

export { createCurrentCatalogSnapshot } from './currentCatalog.js';

/**
 * 카탈로그 스냅샷을 수정하지 않고 모든 가능한 데이터 진단을 수집한다.
 *
 * @param {unknown} snapshot
 * @param {object} [options]
 * @returns {CatalogValidationReport}
 */
export function validateCatalog(snapshot, options = {}) {
  void options;
  return createCatalogValidationReport(collectCatalogIssues(snapshot));
}

/**
 * 검증 보고서를 반환하고 승인된 실패 정책에 해당할 때만 예외를 던진다.
 *
 * @param {unknown} snapshot
 * @param {{ failOnWarnings?: boolean }} [options]
 * @returns {CatalogValidationReport}
 * @throws {CatalogValidationError}
 */
export function assertValidCatalog(snapshot, options = {}) {
  const report = validateCatalog(snapshot, options);
  if (shouldFailCatalogValidation(report, options)) {
    throw new CatalogValidationError(report);
  }
  return report;
}

/**
 * 현재 전체 카탈로그를 조립해 검증한다.
 *
 * @param {object} [options]
 * @returns {CatalogValidationReport}
 */
export function validateCurrentCatalog(options = {}) {
  return validateCatalog(createCurrentCatalogSnapshot(), options);
}
