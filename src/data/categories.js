/**
 * Wave 0 호환 진입점.
 * 정규 데이터는 src/catalog에서 관리하며 기존 소비자는 이 export 형태를 계속 사용한다.
 */

export {
  LEGACY_MAIN_CATEGORIES as MAIN_CATEGORIES,
  LEGACY_STYLE_MOTION as STYLE_MOTION,
  LEGACY_SUB_ID_ALIASES as SUB_ID_ALIASES,
  getLegacyAllSubDesigns as getAllSubDesigns,
  findLegacySubById as findSubById
} from '../catalog/legacyAdapter.js';

export {
  resolveCanonicalStyleId as canonicalizeSubId
} from '../catalog/index.js';
