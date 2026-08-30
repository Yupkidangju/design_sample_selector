import { getAllStyles } from '../catalog/index.js';
import { deepFreeze, THEME_TOKEN_KEYS } from '../catalog/contract.js';
import { CORE_PACK_MANIFEST } from '../catalog/packs/core/manifest.js';
import { THEME_TOKEN_CSS_PROPERTIES } from './contract.js';

const EMPTY_THEME_EFFECTS = deepFreeze({});

function projectCssCustomProperties(tokens) {
  return Object.fromEntries(
    THEME_TOKEN_KEYS.map(key => [THEME_TOKEN_CSS_PROPERTIES[key], tokens[key]])
  );
}

const THEME_DEFINITIONS = deepFreeze(
  getAllStyles({ includeUnpublished: true }).map(style => ({
    id: style.id,
    aliases: style.aliases,
    categoryId: style.categoryId,
    order: style.order,
    tokens: style.tokens,
    cssCustomProperties: projectCssCustomProperties(style.tokens),
    themeEffects: style.themeEffects || EMPTY_THEME_EFFECTS
  }))
);

const THEME_DEFINITION_BY_ID = new Map(
  THEME_DEFINITIONS.flatMap(definition => [
    [definition.id, definition],
    ...definition.aliases.map(alias => [alias, definition])
  ])
);
const CORE_STYLE_IDS = new Set(CORE_PACK_MANIFEST.styleIds);
const CORE_THEME_DEFINITIONS = deepFreeze(
  THEME_DEFINITIONS.filter(definition => CORE_STYLE_IDS.has(definition.id))
);
const EXPANSION_THEME_DEFINITIONS = deepFreeze(
  THEME_DEFINITIONS.filter(definition => !CORE_STYLE_IDS.has(definition.id))
);

/**
 * 모든 출판 상태의 정렬·동결된 테마 투영을 반환한다.
 * @returns {readonly object[]}
 */
export function getThemeDefinitions() {
  return THEME_DEFINITIONS;
}

/** 초기 경로에 필요한 기존 Core 36 테마만 반환한다. */
export function getCoreThemeDefinitions() {
  return CORE_THEME_DEFINITIONS;
}

/** 상세 프리뷰 경계에서 지연 로드할 신규 84 테마만 반환한다. */
export function getExpansionThemeDefinitions() {
  return EXPANSION_THEME_DEFINITIONS;
}

/**
 * 정규 ID나 alias를 해석하며 무효한 입력에는 fallback 없이 null을 반환한다.
 * @param {unknown} id
 * @returns {object|null}
 */
export function getThemeDefinitionById(id) {
  if (typeof id !== 'string') return null;
  return THEME_DEFINITION_BY_ID.get(id) || null;
}

/** 기존 내보내기 경로를 유지하는 canonical-ID keyed 호환 투영. */
export const THEME_TOKENS_MAP = deepFreeze(
  Object.fromEntries(
    THEME_DEFINITIONS.map(definition => {
      const compatibilityTokens = { ...definition.cssCustomProperties };
      if (Object.hasOwn(definition.themeEffects, 'backdropBlur')) {
        compatibilityTokens['backdrop-filter'] = `blur(${definition.themeEffects.backdropBlur}px)`;
      }
      return [definition.id, compatibilityTokens];
    })
  )
);
