import { deepFreeze } from '../contract.js';

const SEVERITY_ORDER = Object.freeze({ error: 0, warning: 1 });
const CONTROL_CHARACTER_PATTERN = /[\u0000-\u001f\u007f-\u009f]/g;

function compareText(left, right) {
  return String(left ?? '').localeCompare(String(right ?? ''), 'en');
}

function compareIssues(left, right) {
  return (SEVERITY_ORDER[left.severity] ?? 99) - (SEVERITY_ORDER[right.severity] ?? 99)
    || compareText(left.path, right.path)
    || compareText(left.code, right.code)
    || compareText(left.relatedPath, right.relatedPath);
}

function escapeControlCharacters(value) {
  return String(value ?? '').replace(
    CONTROL_CHARACTER_PATTERN,
    character => `\\u${character.codePointAt(0).toString(16).padStart(4, '0')}`
  );
}

/**
 * 진단 배열을 안정 정렬된 읽기 전용 보고서로 만든다.
 * 호출자가 전달한 이슈 객체와 배열은 수정하지 않는다.
 *
 * @param {readonly import('./index.js').CatalogValidationIssue[]} issues
 * @returns {import('./index.js').CatalogValidationReport}
 */
export function createCatalogValidationReport(issues) {
  const sortedIssues = [...issues]
    .map(issue => ({ ...issue }))
    .sort(compareIssues);
  const errorCount = sortedIssues.filter(issue => issue.severity === 'error').length;
  const warningCount = sortedIssues.filter(issue => issue.severity === 'warning').length;

  return deepFreeze({
    valid: errorCount === 0,
    issues: sortedIssues,
    summary: {
      errorCount,
      warningCount,
      totalCount: sortedIssues.length
    }
  });
}

/** 검증 실패 시 동결된 구조화 보고서를 보존하는 오류다. */
export class CatalogValidationError extends Error {
  /** @param {import('./index.js').CatalogValidationReport} report */
  constructor(report) {
    super(`카탈로그 검증 실패: 오류 ${report.summary.errorCount}개, 경고 ${report.summary.warningCount}개`);
    this.name = 'CatalogValidationError';
    this.report = report;
  }
}

/**
 * 기본 빌드는 오류만, strict 저작 모드는 경고까지 실패로 처리한다.
 *
 * @param {import('./index.js').CatalogValidationReport} report
 * @param {{ failOnWarnings?: boolean }} [options]
 */
export function shouldFailCatalogValidation(report, options = {}) {
  return !report.valid || (options.failOnWarnings === true && report.summary.warningCount > 0);
}

function formatIssue(issue) {
  const related = issue.relatedPath
    ? ` (관련: ${escapeControlCharacters(issue.relatedPath)})`
    : '';
  return `- [${escapeControlCharacters(issue.code)}] ${escapeControlCharacters(issue.path)}: ${escapeControlCharacters(issue.message)}${related}`;
}

/**
 * 색상 제어문자 없이 결정론적인 사람용 보고서를 만든다.
 *
 * @param {import('./index.js').CatalogValidationReport} report
 * @param {{ verbose?: boolean }} [options]
 */
export function formatCatalogValidationReport(report, options = {}) {
  const { errorCount, warningCount } = report.summary;
  const status = report.valid ? '통과' : '실패';
  const lines = [`카탈로그 검증 ${status} — 오류 ${errorCount}개, 경고 ${warningCount}개`];
  const errors = report.issues.filter(issue => issue.severity === 'error');
  const warnings = report.issues.filter(issue => issue.severity === 'warning');

  if (errors.length > 0) {
    lines.push('', '오류');
    lines.push(...errors.map(formatIssue));
  }

  if (warnings.length > 0) {
    lines.push('', '경고');
    if (options.verbose === true) {
      lines.push(...warnings.map(formatIssue));
    } else {
      const warningsByCode = new Map();
      for (const warning of warnings) {
        const group = warningsByCode.get(warning.code) || [];
        group.push(warning);
        warningsByCode.set(warning.code, group);
      }

      for (const code of [...warningsByCode.keys()].sort(compareText)) {
        const group = warningsByCode.get(code);
        lines.push(`- [${escapeControlCharacters(code)}] ${group.length}개 — 대표 경로: ${escapeControlCharacters(group[0].path)}`);
      }
    }
  }

  return lines.join('\n');
}
