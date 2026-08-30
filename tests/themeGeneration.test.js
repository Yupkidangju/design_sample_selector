import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { getAllStyles } from '../src/catalog/index.js';
import { THEME_TOKEN_KEYS } from '../src/catalog/contract.js';
import { getAllSubDesigns } from '../src/data/categories.js';
import {
  ROOT_THEME_TOKENS,
  THEME_TOKEN_CSS_PROPERTIES,
  THEME_TOKENS_MAP,
  generateExpansionThemeStylesheet,
  generateThemeStylesheet,
  getCoreThemeDefinitions,
  getExpansionThemeDefinitions,
  getThemeDefinitionById,
  getThemeDefinitions
} from '../src/theme/index.js';
import { CORE_PACK_MANIFEST } from '../src/catalog/packs/core/manifest.js';
import { serializeThemeStylesheet } from '../src/theme/stylesheet.js';
import { runThemeStylesCli } from '../scripts/generateThemeStyles.js';
import {
  THEME_TOKENS_MAP as GENERATOR_THEME_TOKENS_MAP,
  generateLiveCSSSnippet,
  generateLiveDesignSpecMarkdown,
  generateLiveTokensJSON
} from '../src/utils/designSpecGenerator.js';

const EXPECTED_CSS_PROPERTIES = [
  '--theme-bg',
  '--theme-surface',
  '--theme-surface-subtle',
  '--theme-border',
  '--theme-text',
  '--theme-text-muted',
  '--theme-accent',
  '--theme-accent-secondary',
  '--theme-radius',
  '--theme-border-width',
  '--theme-shadow',
  '--theme-font-family',
  '--theme-glow'
];
const LEGACY_STYLE_IDS = [
  'swiss-grid',
  'corporate-minimal',
  'high-contrast-mono',
  'raw-brutalism',
  'neo-brutalism',
  'cyber-brutalism',
  'glassmorphism',
  'neumorphism',
  'skeuomorphism',
  'memphis',
  'synthwave',
  'vaporwave',
  'high-fashion',
  'fluid-organic',
  'dark-minimal-glass',
  'y2k-chrome',
  'frutiger-aero',
  'pixel-arcade',
  'kinetic-type',
  'bento-grid',
  'acid-techno',
  'claymorphism',
  'handcrafted-indie',
  'solarpunk-eco'
];
const ARCHETYPES = ['game', 'web', 'mobile', 'ecommerce', 'blog', 'dashboard', 'media', 'chat'];

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function hashOutputRows(rows) {
  const hash = createHash('sha256');
  for (const [key, output] of rows) {
    hash.update(`${key.length}:${key}${output.length}:${output}`);
  }
  return hash.digest('hex');
}

function parseDeclarations(block) {
  return block
    .split(';')
    .map(declaration => declaration.trim())
    .filter(Boolean)
    .map(declaration => {
      const separator = declaration.indexOf(':');
      return [
        declaration.slice(0, separator).trim(),
        declaration.slice(separator + 1).trim()
      ];
    });
}

function parseThemeStylesheetSemantics(stylesheet) {
  const withoutComments = stylesheet.replace(/\/\*[\s\S]*?\*\//g, '');
  const blocks = Array.from(withoutComments.matchAll(/([^{}]+)\{([^{}]*)\}/g), match => ({
    selectors: match[1].split(',').map(selector => selector.trim()),
    declarations: parseDeclarations(match[2])
  }));
  const [root, ...themes] = blocks;

  assert.deepEqual(root?.selectors, [':root']);
  return {
    root: root.declarations,
    themes: themes.map(theme => ({
      selectors: theme.selectors.map(selector => {
        const match = selector.match(/^\[data-theme="([a-z0-9-]+)"\]$/);
        assert.ok(match, `unexpected theme selector: ${selector}`);
        return match[1];
      }),
      declarations: theme.declarations
    }))
  };
}

test('의미 토큰·CSS property·root fallback은 13개 고정 순서를 공유한다', () => {
  assert.deepEqual(Object.keys(THEME_TOKEN_CSS_PROPERTIES), THEME_TOKEN_KEYS);
  assert.deepEqual(Object.values(THEME_TOKEN_CSS_PROPERTIES), EXPECTED_CSS_PROPERTIES);
  assert.deepEqual(Object.keys(ROOT_THEME_TOKENS), THEME_TOKEN_KEYS);
  assert.equal(Object.isFrozen(THEME_TOKEN_CSS_PROPERTIES), true);
  assert.equal(Object.isFrozen(ROOT_THEME_TOKENS), true);
});

test('테마 투영은 모든 카탈로그 레코드의 토큰·alias·효과를 결정론적으로 보존한다', () => {
  const styles = getAllStyles({ includeUnpublished: true });
  const definitions = getThemeDefinitions();

  assert.equal(definitions.length, 120);
  assert.deepEqual(definitions.map(definition => definition.id), styles.map(style => style.id));

  for (const [index, definition] of definitions.entries()) {
    const style = styles[index];
    assert.equal(definition.categoryId, style.categoryId);
    assert.equal(definition.order, style.order);
    assert.deepEqual(definition.aliases, style.aliases);
    assert.deepEqual(definition.tokens, style.tokens);
    assert.deepEqual(
      definition.cssCustomProperties,
      Object.fromEntries(
        THEME_TOKEN_KEYS.map(key => [THEME_TOKEN_CSS_PROPERTIES[key], style.tokens[key]])
      )
    );
    assert.deepEqual(definition.themeEffects, style.themeEffects || {});
  }

  assert.deepEqual(getThemeDefinitionById('glassmorphism-luxe'), getThemeDefinitionById('glassmorphism'));
  assert.equal(getThemeDefinitionById('glassmorphism-luxe').id, 'glassmorphism');
  assert.equal(getThemeDefinitionById('unknown-theme'), null);
  assert.equal(getThemeDefinitionById(null), null);
});

test('테마 투영과 호환 map은 재귀 동결되고 24·36·120종 지문을 유지한다', () => {
  const definitions = getThemeDefinitions();
  const legacyThemeTokensMap = Object.fromEntries(
    LEGACY_STYLE_IDS.map(id => [id, THEME_TOKENS_MAP[id]])
  );
  const coreThemeTokensMap = Object.fromEntries(
    getCoreThemeDefinitions().map(definition => [definition.id, THEME_TOKENS_MAP[definition.id]])
  );

  assert.equal(Object.isFrozen(definitions), true);
  assert.equal(Object.isFrozen(definitions[0]), true);
  assert.equal(Object.isFrozen(definitions[0].aliases), true);
  assert.equal(Object.isFrozen(definitions[0].tokens), true);
  assert.equal(Object.isFrozen(definitions[0].cssCustomProperties), true);
  assert.equal(Object.isFrozen(definitions[0].themeEffects), true);
  assert.equal(Object.isFrozen(THEME_TOKENS_MAP), true);
  assert.equal(Object.isFrozen(THEME_TOKENS_MAP['swiss-grid']), true);
  assert.throws(() => { definitions[0].tokens.background = '#000000'; }, TypeError);
  assert.throws(() => { THEME_TOKENS_MAP['swiss-grid']['--theme-bg'] = '#000000'; }, TypeError);

  assert.deepEqual(Object.keys(THEME_TOKENS_MAP), definitions.map(definition => definition.id));
  assert.equal(THEME_TOKENS_MAP.glassmorphism['backdrop-filter'], 'blur(20px)');
  assert.equal(THEME_TOKENS_MAP['frutiger-aero']['backdrop-filter'], 'blur(14px)');
  assert.equal(THEME_TOKENS_MAP['bento-grid']['backdrop-filter'], 'blur(16px)');
  assert.equal(
    sha256(JSON.stringify(legacyThemeTokensMap)),
    '2e299391427ce9db7fa9b75cf55eeaea26abc9a54e921ef22cb6336f3126fdf5'
  );
  assert.equal(
    sha256(JSON.stringify(coreThemeTokensMap)),
    '59f49f2305d2477801f3534ec84893b35c570004b3e85c3d21795c31e3b49d12'
  );
  assert.equal(
    sha256(JSON.stringify(THEME_TOKENS_MAP)),
    '77bb9965829c574386c11ae9cbd445bfe17d6b697b1942cfc4a695cd6255ec0e'
  );
});

test('생성 stylesheet은 기존 24종 지문과 Wave 1 전체 36종 지문을 함께 보존한다', () => {
  const generated = generateThemeStylesheet();
  const current = readFileSync(new URL('../src/styles/themeTokens.css', import.meta.url), 'utf8');
  const semantics = parseThemeStylesheetSemantics(generated);
  const legacySemantics = {
    root: semantics.root,
    themes: semantics.themes.filter(theme => LEGACY_STYLE_IDS.includes(theme.selectors[0]))
  };

  assert.deepEqual(semantics, parseThemeStylesheetSemantics(current));
  assert.equal(semantics.root.length, 13);
  assert.equal(legacySemantics.themes.length, 24);
  assert.equal(legacySemantics.themes.flatMap(theme => theme.selectors).length, 45);
  assert.equal(semantics.themes.length, 36);
  assert.equal(semantics.themes.flatMap(theme => theme.selectors).length, 57);
  assert.equal(
    sha256(JSON.stringify(legacySemantics)),
    'a4965a6dbbee982466ba1623e3a9309dde7fe204ccc4367eb9c18244f1b0d06d'
  );
  assert.equal(
    sha256(JSON.stringify(semantics)),
    'c61a1ec2212c30ca496c0934044a90d9848b5b508dd0a541900197c36e6e9415'
  );
});

test('신규 84종 stylesheet은 별도 생성 파일과 결정론적으로 일치한다', () => {
  const generated = generateExpansionThemeStylesheet();
  const current = readFileSync(
    new URL('../src/styles/themeTokensExpansion.css', import.meta.url),
    'utf8'
  );
  const semantics = parseThemeStylesheetSemantics(generated);

  assert.equal(getCoreThemeDefinitions().length, 36);
  assert.equal(getExpansionThemeDefinitions().length, 84);
  assert.deepEqual(semantics, parseThemeStylesheetSemantics(current));
  assert.equal(semantics.root.length, 13);
  assert.equal(semantics.themes.length, 84);
  assert.equal(semantics.themes.flatMap(theme => theme.selectors).length, 84);
});

test('stylesheet은 selector·선언·효과 순서와 LF 끝 개행을 결정론적으로 직렬화한다', () => {
  const first = generateThemeStylesheet();
  const second = generateThemeStylesheet();
  const semantics = parseThemeStylesheetSemantics(first);
  const effects = Object.fromEntries(
    semantics.themes
      .filter(theme => theme.declarations.some(([property]) => property === 'backdrop-filter'))
      .map(theme => [theme.selectors[0], theme.declarations.slice(-2)])
  );

  assert.equal(first, second);
  assert.equal(first.endsWith('\n'), true);
  assert.equal(first.endsWith('\n\n'), false);
  assert.equal(first.includes('\r'), false);
  assert.deepEqual(effects, {
    glassmorphism: [
      ['backdrop-filter', 'blur(20px)'],
      ['-webkit-backdrop-filter', 'blur(20px)']
    ],
    'frutiger-aero': [
      ['backdrop-filter', 'blur(14px)'],
      ['-webkit-backdrop-filter', 'blur(14px)']
    ],
    'bento-grid': [
      ['backdrop-filter', 'blur(16px)'],
      ['-webkit-backdrop-filter', 'blur(16px)']
    ]
  });
});

test('순수 직렬화기는 alias와 0px 효과를 보존하고 불완전한 definition을 거부한다', () => {
  const cssCustomProperties = Object.fromEntries(
    EXPECTED_CSS_PROPERTIES.map(property => [property, property === '--theme-radius' ? '0px' : 'initial'])
  );
  const stylesheet = serializeThemeStylesheet({
    rootTokens: ROOT_THEME_TOKENS,
    themeDefinitions: [{
      id: 'example-theme',
      aliases: ['example-theme-old'],
      cssCustomProperties,
      themeEffects: { backdropBlur: 0 }
    }]
  });
  const semantics = parseThemeStylesheetSemantics(stylesheet);

  assert.deepEqual(semantics.themes[0].selectors, ['example-theme', 'example-theme-old']);
  assert.deepEqual(semantics.themes[0].declarations.slice(-2), [
    ['backdrop-filter', 'blur(0px)'],
    ['-webkit-backdrop-filter', 'blur(0px)']
  ]);
  assert.throws(
    () => serializeThemeStylesheet({
      rootTokens: ROOT_THEME_TOKENS,
      themeDefinitions: [{
        id: 'incomplete-theme',
        aliases: [],
        cssCustomProperties: {},
        themeEffects: {}
      }]
    }),
    /13개 CSS custom property/
  );
});

function runThemeCliInMemory(args, dependencies = {}) {
  let stdout = '';
  let stderr = '';
  const exitCode = runThemeStylesCli(
    args,
    {
      stdout: { write: value => { stdout += value; } },
      stderr: { write: value => { stderr += value; } }
    },
    dependencies
  );
  return { exitCode, stdout, stderr };
}

test('테마 CLI는 생성 파일을 멱등 갱신하고 check에서 절대 쓰지 않는다', () => {
  const temporaryDirectory = mkdtempSync(join(tmpdir(), 'theme-generation-'));
  const targetPath = join(temporaryDirectory, 'themeTokens.css');

  try {
    const generated = runThemeCliInMemory([], { targetPath });
    const firstContent = readFileSync(targetPath, 'utf8');
    const generatedAgain = runThemeCliInMemory([], { targetPath });
    const secondContent = readFileSync(targetPath, 'utf8');
    const current = runThemeCliInMemory(['--check'], { targetPath });

    assert.equal(generated.exitCode, 0);
    assert.equal(generatedAgain.exitCode, 0);
    assert.equal(firstContent, generateThemeStylesheet());
    assert.equal(secondContent, firstContent);
    assert.equal(current.exitCode, 0);
    assert.match(current.stdout, /최신/);
    assert.equal(current.stderr, '');

    writeFileSync(targetPath, 'stale\n', 'utf8');
    const stale = runThemeCliInMemory(['--check'], { targetPath });
    assert.equal(stale.exitCode, 1);
    assert.match(stale.stderr, /오래됨/);
    assert.match(stale.stderr, /npm run generate:themes/);
    assert.equal(readFileSync(targetPath, 'utf8'), 'stale\n');

    rmSync(targetPath);
    const missing = runThemeCliInMemory(['--check'], { targetPath });
    assert.equal(missing.exitCode, 1);
    assert.match(missing.stderr, /없음/);
    assert.match(missing.stderr, /npm run generate:themes/);
    assert.equal(existsSync(targetPath), false);
  } finally {
    rmSync(temporaryDirectory, { recursive: true, force: true });
  }
});

test('테마 CLI는 옵션 오류와 도구 내부 실패를 종료 코드 2로 분리한다', () => {
  const unknown = runThemeCliInMemory(['--unknown']);
  const internal = runThemeCliInMemory([], {
    generateThemeStylesheet: () => { throw new Error('simulated failure'); }
  });

  assert.equal(unknown.exitCode, 2);
  assert.equal(unknown.stdout, '');
  assert.match(unknown.stderr, /알 수 없는 옵션/);
  assert.equal(internal.exitCode, 2);
  assert.equal(internal.stdout, '');
  assert.match(internal.stderr, /내부 오류/);
  assert.doesNotMatch(internal.stderr, /\n\s+at /);
});

test('실제 Node CLI와 package lifecycle은 catalog 다음 theme 최신성을 검사한다', () => {
  const projectRoot = new URL('..', import.meta.url);
  const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  const checkRun = spawnSync(process.execPath, ['scripts/generateThemeStyles.js', '--check'], {
    cwd: projectRoot,
    encoding: 'utf8'
  });

  assert.equal(checkRun.status, 0, checkRun.stderr);
  assert.match(checkRun.stdout, /최신/);
  assert.equal(packageJson.scripts['generate:themes'], 'node scripts/generateThemeStyles.js');
  assert.equal(packageJson.scripts['check:themes'], 'node scripts/generateThemeStyles.js --check');
  assert.equal(
    packageJson.scripts.prebuild,
    'npm run validate:catalog && npm run check:themes'
  );
});

test('기존 24종의 CSS·Markdown·DTCG 전체 내보내기 행렬을 바이트 단위로 보존한다', () => {
  const designById = new Map(getAllSubDesigns().map(design => [design.id, design]));
  const designs = LEGACY_STYLE_IDS.map(id => designById.get(id));

  assert.equal(designs.every(Boolean), true);
  assert.equal(
    hashOutputRows(
      designs.flatMap(design => ARCHETYPES.flatMap(archetype => (
        ['full', 'tokens', 'component'].map(mode => [
          `${design.id}/${archetype}/${mode}`,
          generateLiveCSSSnippet(design, design.defaultTweaks, archetype, mode)
        ])
      )))
    ),
    'b61766afb049fdba6d4c795db8263294aa72d6aa2201ba4e1aa720e14ee2e781'
  );
  assert.equal(
    hashOutputRows(
      designs.flatMap(design => ARCHETYPES.flatMap(archetype => (
        ['desktop', 'mobile'].map(device => [
          `${design.id}/${archetype}/${device}`,
          generateLiveDesignSpecMarkdown(design, design.defaultTweaks, archetype, device)
        ])
      )))
    ),
    'e8b81f021fddf3268df1da306596d20d7059a6725261a8ee76ab9e319969c71a'
  );
  assert.equal(
    hashOutputRows(
      designs.map(design => [
        design.id,
        generateLiveTokensJSON(design, design.defaultTweaks)
      ])
    ),
    'e2949344331f8783fc37198e2de12bc64d9fa00f22ad73cf0ee4f1cf03adfc04'
  );
});

test('Wave 1 전체 36종의 CSS·Markdown·DTCG 내보내기 행렬은 결정론적이다', () => {
  const coreIds = new Set(CORE_PACK_MANIFEST.styleIds);
  const allDesigns = getAllSubDesigns();
  const designs = allDesigns.filter(design => coreIds.has(design.id));

  assert.equal(designs.length, 36);
  assert.equal(
    hashOutputRows(
      designs.flatMap(design => ARCHETYPES.flatMap(archetype => (
        ['full', 'tokens', 'component'].map(mode => [
          `${design.id}/${archetype}/${mode}`,
          generateLiveCSSSnippet(design, design.defaultTweaks, archetype, mode)
        ])
      )))
    ),
    'dd28ad2cb283aae6965f9fbad9e0d66b210d964b097ec32f822d8dfd34a3461a'
  );
  assert.equal(
    hashOutputRows(
      designs.flatMap(design => ARCHETYPES.flatMap(archetype => (
        ['desktop', 'mobile'].map(device => [
          `${design.id}/${archetype}/${device}`,
          generateLiveDesignSpecMarkdown(design, design.defaultTweaks, archetype, device)
        ])
      )))
    ),
    '860fc6ed21a52949132ea62fca727bf4bc30ea07d390efc6171ca02aba9d61f3'
  );
  assert.equal(
    hashOutputRows(
      designs.map(design => [
        design.id,
        generateLiveTokensJSON(design, design.defaultTweaks)
      ])
    ),
    '00f99db174e4efcc1581dfd40f066081208d0da43be358e18b0c3ffb6e8bdd6b'
  );

  assert.equal(allDesigns.length, 120);
  assert.equal(
    hashOutputRows(
      allDesigns.flatMap(design => ARCHETYPES.flatMap(archetype => (
        ['full', 'tokens', 'component'].map(mode => [
          `${design.id}/${archetype}/${mode}`,
          generateLiveCSSSnippet(design, design.defaultTweaks, archetype, mode)
        ])
      )))
    ),
    '1ef0cc57f32f3983ce2b8768bf68683efd729c50948b76dfbbbb38e3df8a56bd'
  );
  assert.equal(
    hashOutputRows(
      allDesigns.flatMap(design => ARCHETYPES.flatMap(archetype => (
        ['desktop', 'mobile'].map(device => [
          `${design.id}/${archetype}/${device}`,
          generateLiveDesignSpecMarkdown(design, design.defaultTweaks, archetype, device)
        ])
      )))
    ),
    '663c3add3c6e6dabdce04dc96d96b1897980ade6804e1d02ca5268b9ac5cef3c'
  );
  assert.equal(
    hashOutputRows(
      allDesigns.map(design => [
        design.id,
        generateLiveTokensJSON(design, design.defaultTweaks)
      ])
    ),
    '3dd6356b4cfb4992a75800ce0709b3d97d8587606a09b63e93839875f837bf49'
  );
});

test('내보내기 생성기는 파생 테마 map을 재export하고 unknown을 미선택으로 처리한다', () => {
  const unknown = { ...getAllSubDesigns()[0], id: 'unknown-theme' };

  assert.equal(GENERATOR_THEME_TOKENS_MAP, THEME_TOKENS_MAP);
  assert.equal(generateLiveCSSSnippet(null), '/* No design selected */');
  assert.equal(generateLiveCSSSnippet(unknown), '/* No design selected */');
  assert.equal(
    generateLiveDesignSpecMarkdown(unknown),
    '# Design Specification (No Selection)'
  );
  assert.equal(generateLiveTokensJSON(unknown), '{}');
});

test('designSpecGenerator에는 스타일별 토큰 map literal이 남지 않는다', () => {
  const source = readFileSync(
    new URL('../src/utils/designSpecGenerator.js', import.meta.url),
    'utf8'
  );

  assert.doesNotMatch(source, /export const THEME_TOKENS_MAP\s*=\s*\{/);
  assert.match(source, /from '\.\.\/theme\/index\.js'/);
});
