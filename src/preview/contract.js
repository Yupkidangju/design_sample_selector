import { ID_PATTERN, deepFreeze } from '../catalog/contract.js';

export const PREVIEW_COMPONENT_TABS = deepFreeze(['hero', 'widget', 'form', 'pricing']);
export const PREVIEW_REFERENCE_KINDS = deepFreeze(['renderer', 'thumbnail', 'motion']);
export const PREVIEW_MOTION_CHANNELS = deepFreeze([
  'effect-layer',
  'unit-class',
  'template-local',
  'thumbnail-local',
  'interaction-local',
  'metadata-only'
]);
export const PREVIEW_ERROR_CODES = deepFreeze([
  'PREVIEW_DEFINITION_INVALID',
  'PREVIEW_DEFINITION_DUPLICATE',
  'PREVIEW_ALIAS_COLLISION',
  'PREVIEW_REFERENCE_UNKNOWN',
  'PREVIEW_TAB_UNSUPPORTED',
  'PREVIEW_RENDER_OUTPUT_INVALID'
]);

export class PreviewRegistryError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'PreviewRegistryError';
    this.code = code;
    this.referenceKind = details.referenceKind ?? null;
    this.referenceId = typeof details.referenceId === 'string' ? details.referenceId : null;
    this.tab = typeof details.tab === 'string' ? details.tab : null;
  }
}

export function isPreviewIdentifier(value) {
  return typeof value === 'string' && ID_PATTERN.test(value);
}

export function isPreviewClassName(value) {
  return typeof value === 'string' && /^-?[_a-zA-Z]+[\w-]*$/u.test(value);
}

export function isSafePreviewAssetPath(value) {
  if (typeof value !== 'string' || value.length === 0) return false;
  if (value.includes('\\') || value.startsWith('/') || /^[a-z][a-z0-9+.-]*:/iu.test(value)) {
    return false;
  }
  const segments = value.split('/');
  return segments.every(segment => segment.length > 0 && segment !== '.' && segment !== '..');
}

export function createPreviewRegistryError(code, message, details = {}) {
  return new PreviewRegistryError(code, message, details);
}
