import { SOURCE_TYPES } from '../contract.js';
import { calculateContrastRatio, parseOpaqueColor } from './color.js';

const TRUSTED_SOURCE_TYPES = new Set(SOURCE_TYPES.filter(type => type !== 'community'));
const CONTRAST_TEXT_KEYS = Object.freeze(['text', 'textMuted']);

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function addIssue(issues, issue) {
  issues.push({ relatedPath: null, entityId: null, ...issue });
}

function isCalendarDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

function normalizeHttpUrl(value) {
  if (!isNonEmptyString(value)) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    url.hash = '';
    return url.href;
  } catch {
    return null;
  }
}

function styleSeverity(style) {
  return style.publicationStatus === 'ready' ? 'error' : 'warning';
}

function addStyleIssue(issues, style, code, path, message, severity = 'error', relatedPath = null) {
  addIssue(issues, {
    code,
    severity,
    path,
    message,
    entityType: 'style',
    entityId: style.id,
    relatedPath
  });
}

function validateSourceMetadata(style, issues) {
  const provenance = style.provenance;
  const rootPath = `styles[${style.id}].provenance`;
  if (!isRecord(provenance)) return;

  if (isNonEmptyString(provenance.reviewedAt) && !isCalendarDate(provenance.reviewedAt)) {
    addStyleIssue(
      issues,
      style,
      'SOURCE_METADATA_INVALID',
      `${rootPath}.reviewedAt`,
      'reviewedAt은 실제 YYYY-MM-DD 날짜여야 합니다.'
    );
  }
  if (!Array.isArray(provenance.sources)) return;

  if (provenance.sources.length === 0) {
    addStyleIssue(
      issues,
      style,
      'SOURCE_REQUIRED',
      `${rootPath}.sources`,
      '스타일 출처가 하나 이상 필요합니다.',
      styleSeverity(style)
    );
    return;
  }

  const seenUrls = new Set();
  let hasTrustedSource = false;
  for (const source of provenance.sources) {
    const sourceKey = isNonEmptyString(source?.url)
      ? source.url
      : isNonEmptyString(source?.title) ? source.title : '<missing>';
    const sourcePath = `${rootPath}.sources[${sourceKey}]`;
    if (!isRecord(source)) {
      addStyleIssue(issues, style, 'SOURCE_METADATA_INVALID', sourcePath, 'source는 객체여야 합니다.');
      continue;
    }

    let metadataValid = true;
    for (const field of ['title', 'publisher']) {
      if (!isNonEmptyString(source[field])) {
        metadataValid = false;
        addStyleIssue(
          issues,
          style,
          'SOURCE_METADATA_INVALID',
          `${sourcePath}.${field}`,
          `${field} 문자열이 필요합니다.`
        );
      }
    }

    const normalizedUrl = normalizeHttpUrl(source.url);
    if (!normalizedUrl) {
      metadataValid = false;
      addStyleIssue(
        issues,
        style,
        'SOURCE_METADATA_INVALID',
        `${sourcePath}.url`,
        'source URL은 http 또는 https여야 합니다.'
      );
    } else if (seenUrls.has(normalizedUrl)) {
      addStyleIssue(
        issues,
        style,
        'SOURCE_DUPLICATE',
        `${sourcePath}.url`,
        '정규화된 source URL이 중복됩니다.'
      );
    } else {
      seenUrls.add(normalizedUrl);
    }

    if (!isNonEmptyString(source.accessedAt) || !isCalendarDate(source.accessedAt)) {
      metadataValid = false;
      addStyleIssue(
        issues,
        style,
        'SOURCE_METADATA_INVALID',
        `${sourcePath}.accessedAt`,
        'accessedAt은 실제 YYYY-MM-DD 날짜여야 합니다.'
      );
    }
    if (!SOURCE_TYPES.includes(source.sourceType)) {
      metadataValid = false;
      addStyleIssue(
        issues,
        style,
        'SOURCE_METADATA_INVALID',
        `${sourcePath}.sourceType`,
        '알려진 sourceType이 필요합니다.'
      );
    }
    if (metadataValid && TRUSTED_SOURCE_TYPES.has(source.sourceType)) hasTrustedSource = true;
  }

  if (!hasTrustedSource) {
    addStyleIssue(
      issues,
      style,
      'SOURCE_TRUST_REQUIRED',
      `${rootPath}.sources`,
      'community 이외의 유효한 신뢰 출처가 하나 이상 필요합니다.',
      styleSeverity(style)
    );
  }
}

function validateAssetMetadata(style, issues) {
  const assets = style.provenance?.assets;
  if (!Array.isArray(assets)) return;
  for (const asset of assets) {
    const assetPath = isNonEmptyString(asset?.path) ? asset.path : '<missing>';
    const rootPath = `styles[${style.id}].provenance.assets[${assetPath}]`;
    if (!isRecord(asset)) {
      addStyleIssue(issues, style, 'ASSET_METADATA_INVALID', rootPath, 'asset은 객체여야 합니다.');
      continue;
    }
    for (const field of ['path', 'owner', 'license']) {
      if (!isNonEmptyString(asset[field])) {
        addStyleIssue(
          issues,
          style,
          'ASSET_METADATA_INVALID',
          `${rootPath}.${field}`,
          `${field} 문자열이 필요합니다.`
        );
      }
    }
    if (!isRecord(asset.source) || !isNonEmptyString(asset.source.title)) {
      addStyleIssue(
        issues,
        style,
        'ASSET_METADATA_INVALID',
        `${rootPath}.source.title`,
        '에셋 출처 제목이 필요합니다.'
      );
      continue;
    }
    // URL이 있으면 외부 에셋으로 간주한다. URL이 없으면 프로젝트 제작 에셋 계약이다.
    if (asset.source.url !== undefined && !normalizeHttpUrl(asset.source.url)) {
      addStyleIssue(
        issues,
        style,
        'ASSET_METADATA_INVALID',
        `${rootPath}.source.url`,
        '외부 에셋 URL은 http 또는 https여야 합니다.'
      );
    }
  }
}

function validateAccessibilityNotes(style, issues) {
  const notes = style.editorial?.accessibilityNotes;
  if (!Array.isArray(notes)) return;
  if (notes.filter(isNonEmptyString).length === 0) {
    addStyleIssue(
      issues,
      style,
      'ACCESSIBILITY_NOTES_REQUIRED',
      `styles[${style.id}].editorial.accessibilityNotes`,
      '접근성 검토 메모가 하나 이상 필요합니다.',
      styleSeverity(style)
    );
  }
}

function validateContrast(style, issues) {
  if (!isRecord(style.tokens)) return;
  const backgroundPath = `styles[${style.id}].tokens.background`;
  const background = parseOpaqueColor(style.tokens.background);
  if (background === undefined) return;

  for (const key of CONTRAST_TEXT_KEYS) {
    const foreground = parseOpaqueColor(style.tokens[key]);
    if (foreground === undefined) continue;
    const path = `styles[${style.id}].tokens.${key}`;
    if (background === null || foreground === null) {
      addStyleIssue(
        issues,
        style,
        'CONTRAST_UNCHECKED',
        path,
        'gradient 또는 alpha 색상은 자동 대비를 계산할 수 없습니다.',
        'warning',
        backgroundPath
      );
      continue;
    }
    const ratio = calculateContrastRatio(background, foreground);
    if (ratio < 4.5) {
      addStyleIssue(
        issues,
        style,
        'CONTRAST_LOW',
        path,
        `기본 텍스트 대비 ${ratio.toFixed(2)}:1은 4.5:1 미만입니다.`,
        styleSeverity(style),
        backgroundPath
      );
    }
  }
}

export function collectCatalogQualityIssues(snapshot) {
  const issues = [];
  if (!Array.isArray(snapshot?.styles)) return issues;
  for (const style of snapshot.styles) {
    if (!isRecord(style) || !isNonEmptyString(style.id)) continue;
    validateSourceMetadata(style, issues);
    validateAssetMetadata(style, issues);
    validateAccessibilityNotes(style, issues);
    validateContrast(style, issues);
  }
  return issues;
}
