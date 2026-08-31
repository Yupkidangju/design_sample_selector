import { ID_PATTERN, THEME_TOKEN_KEYS } from '../catalog/contract.js';
import {
  ROOT_THEME_GEOMETRY,
  ROOT_THEME_TOKENS,
  THEME_GEOMETRY_CSS_PROPERTIES,
  THEME_TOKEN_CSS_PROPERTIES
} from './contract.js';
import {
  getCoreThemeDefinitions,
  getExpansionThemeDefinitions
} from './projection.js';

const GENERATED_FILE_HEADER = `/**
 * 자동 생성 파일: 직접 수정하지 마세요.
 * 원천: src/catalog/packs/의 StyleRecord.tokens, src/theme/contract.js
 * 갱신: npm run generate:themes
 */`;

const CSS_PROPERTY_ORDER = Object.values(THEME_TOKEN_CSS_PROPERTIES);
const GEOMETRY_PROPERTY_ORDER = Object.values(THEME_GEOMETRY_CSS_PROPERTIES);

function assertTokenContract(tokens, label) {
  if (!tokens || typeof tokens !== 'object' || Array.isArray(tokens)) {
    throw new TypeError(`${label}에 테마 토큰 객체가 필요합니다.`);
  }
  if (
    Object.keys(tokens).length !== THEME_TOKEN_KEYS.length
    || THEME_TOKEN_KEYS.some(key => typeof tokens[key] !== 'string' || tokens[key].length === 0)
  ) {
    throw new TypeError(`${label}에 13개 의미 토큰이 필요합니다.`);
  }
}

function assertThemeDefinition(definition) {
  if (!definition || typeof definition !== 'object') {
    throw new TypeError('테마 definition 객체가 필요합니다.');
  }
  if (!ID_PATTERN.test(definition.id) || !Array.isArray(definition.aliases)) {
    throw new TypeError(`테마 definition ${definition.id || '<missing>'}의 ID·alias가 잘못되었습니다.`);
  }
  if (definition.aliases.some(alias => !ID_PATTERN.test(alias))) {
    throw new TypeError(`테마 definition ${definition.id}의 alias가 잘못되었습니다.`);
  }

  const properties = definition.cssCustomProperties;
  if (
    !properties
    || typeof properties !== 'object'
    || Array.isArray(properties)
    || Object.keys(properties).length !== CSS_PROPERTY_ORDER.length
    || CSS_PROPERTY_ORDER.some(property => (
      typeof properties[property] !== 'string' || properties[property].length === 0
    ))
  ) {
    throw new TypeError(`테마 definition ${definition.id}에 13개 CSS custom property가 필요합니다.`);
  }

  const effects = definition.themeEffects || {};
  if (
    Object.hasOwn(effects, 'backdropBlur')
    && (!Number.isFinite(effects.backdropBlur) || effects.backdropBlur < 0)
  ) {
    throw new TypeError(`테마 definition ${definition.id}의 backdropBlur가 잘못되었습니다.`);
  }
}

function serializeRootBlock(rootTokens) {
  assertTokenContract(rootTokens, 'root fallback');
  const declarations = THEME_TOKEN_KEYS.map(key => (
    `  ${THEME_TOKEN_CSS_PROPERTIES[key]}: ${rootTokens[key]};`
  ));
  for (const [key, property] of Object.entries(THEME_GEOMETRY_CSS_PROPERTIES)) {
    declarations.push(`  ${property}: ${ROOT_THEME_GEOMETRY[key]};`);
  }
  return [':root {', ...declarations, '}'].join('\n');
}

function serializeThemeBlock(definition) {
  assertThemeDefinition(definition);
  const selectors = [definition.id, ...definition.aliases]
    .map(id => `[data-theme="${id}"]`);
  const selectorLines = selectors.map((selector, index) => (
    index < selectors.length - 1 ? `${selector},` : `${selector} {`
  ));
  const declarations = CSS_PROPERTY_ORDER.map(property => (
    `  ${property}: ${definition.cssCustomProperties[property]};`
  ));
  const geometry = definition.geometryCustomProperties || Object.fromEntries(
    GEOMETRY_PROPERTY_ORDER.map(property => [property, (
      property === '--theme-pill-radius' ? '999px' : definition.cssCustomProperties['--theme-radius']
    )])
  );
  for (const property of GEOMETRY_PROPERTY_ORDER) {
    declarations.push(`  ${property}: ${geometry[property]};`);
  }
  if (Object.hasOwn(definition.themeEffects || {}, 'backdropBlur')) {
    const value = `blur(${definition.themeEffects.backdropBlur}px)`;
    declarations.push(`  backdrop-filter: ${value};`);
    declarations.push(`  -webkit-backdrop-filter: ${value};`);
  }
  return [...selectorLines, ...declarations, '}'].join('\n');
}

/**
 * 주입된 루트 토큰과 테마 definition을 결정론적 CSS로 직렬화한다.
 * @param {{ rootTokens: object, themeDefinitions: readonly object[] }} input
 * @returns {string}
 */
export function serializeThemeStylesheet({ rootTokens, themeDefinitions }) {
  if (!Array.isArray(themeDefinitions)) {
    throw new TypeError('테마 definition 배열이 필요합니다.');
  }
  return [
    GENERATED_FILE_HEADER,
    serializeRootBlock(rootTokens),
    ...themeDefinitions.map(serializeThemeBlock)
  ].join('\n\n') + '\n';
}

/** 초기 경로의 Core 36 런타임 테마 CSS를 생성한다. */
export function generateThemeStylesheet() {
  return serializeThemeStylesheet({
    rootTokens: ROOT_THEME_TOKENS,
    themeDefinitions: getCoreThemeDefinitions()
  });
}

/** 상세 경로에서만 사용하는 신규 84 런타임 테마 CSS를 생성한다. */
export function generateExpansionThemeStylesheet() {
  return serializeThemeStylesheet({
    rootTokens: ROOT_THEME_TOKENS,
    themeDefinitions: getExpansionThemeDefinitions()
  });
}
