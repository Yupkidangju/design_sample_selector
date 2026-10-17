import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { getArchetypeHTML } from '../src/components/archetypeTemplates.js';
import { getAllSubDesigns } from '../src/data/categories.js';
import { CORE_PACK_MANIFEST } from '../src/catalog/packs/core/manifest.js';
import {
  PREVIEW_COMPONENT_TABS,
  PreviewRegistryError,
  renderPreviewComponent
} from '../src/preview/index.js';

const ARCHETYPES = [
  { id: 'game', selector: '.game-hud-header' },
  { id: 'web', selector: '.web-nav-header' },
  { id: 'mobile', selector: '.mobile-notif-card' },
  { id: 'ecommerce', selector: '.add-to-cart-btn' },
  { id: 'blog', selector: '.blog-progress-fill' },
  { id: 'dashboard', selector: '.metric-card' },
  { id: 'media', selector: '.vinyl-disc' },
  { id: 'chat', selector: '.chat-bubble-msg.user' }
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

function htmlContainsSelector(html, selector) {
  const requiredClasses = selector.split('.').filter(Boolean);
  const classValues = Array.from(
    html.matchAll(/class="([^"]+)"/gu),
    match => match[1].split(/\s+/u)
  );
  return classValues.some(classes => requiredClasses.every(className => classes.includes(className)));
}

function hashArchetypeMatrix(archetypes, styles = getAllSubDesigns()) {
  const rows = [];
  for (const style of styles) {
    for (const archetype of archetypes) {
      const key = `${style.id}:${archetype}`;
      const html = getArchetypeHTML(archetype, style, { tab: 'hero' });
      rows.push(`${key.length}:${key}${html.length}:${html}`);
    }
  }
  return createHash('sha256').update(rows.join('')).digest('hex');
}

test('Web archetype uses the public component render API directly', () => {
  const source = readFileSync(
    new URL('../src/components/archetypeTemplates.js', import.meta.url),
    'utf8'
  );

  assert.doesNotMatch(source, /getMockupHTML|CORE_.*DEFINITIONS|preview\w*Map/u);
  assert.match(source, /import \{ renderPreviewComponent \} from '\.\.\/preview\/componentEntry\.js';/u);
  assert.match(
    source,
    /renderPreviewComponent\(\{\s*rendererId:\s*subDesign\.previewType,\s*tab:\s*activeTab,\s*design:\s*subDesign,\s*snapshot\s*\}\)/u
  );
});

test('all 120 styles render the eight-archetype 960-output matrix with required roots', () => {
  const styles = getAllSubDesigns();
  const legacyStyles = styles.filter(style => LEGACY_STYLE_IDS.includes(style.id));
  const coreStyleIds = new Set(CORE_PACK_MANIFEST.styleIds);
  const coreStyles = styles.filter(style => coreStyleIds.has(style.id));
  let outputCount = 0;

  assert.equal(styles.length, 120);
  assert.equal(ARCHETYPES.length, 8);

  for (const style of styles) {
    for (const archetype of ARCHETYPES) {
      const html = getArchetypeHTML(archetype.id, style, { tab: 'hero' });
      outputCount += 1;

      assert.match(
        html,
        new RegExp(`class="archetype-unit archetype-${archetype.id}" data-archetype="${archetype.id}"`, 'u'),
        `${style.id}:${archetype.id}:root`
      );
      assert.equal(
        htmlContainsSelector(html, archetype.selector),
        true,
        `${style.id}:${archetype.id}:${archetype.selector}`
      );

      if (archetype.id === 'mobile') {
        assert.match(html, /<input[^>]*data-action="mobile-toggle"[^>]*aria-label="[^"]+"/u, style.id + ': named sound switch');
        assert.match(html, /<span class="slider" aria-hidden="true">/u, style.id + ': decorative switch track');
      }
      if (archetype.id === 'web') {
        const component = renderPreviewComponent({
          rendererId: style.previewType,
          tab: 'hero',
          design: style
        });
        assert.equal(html.includes(component), true, `${style.id}:web:component`);
      }
    }
  }

  assert.equal(outputCount, 960);
  assert.equal(
    hashArchetypeMatrix(ARCHETYPES.map(archetype => archetype.id), legacyStyles),
    'dd2bd99890305f84392a19de2de2b2e5a33f7f2229ae8653ed61f9a35820a63a'
  );
  assert.equal(
    hashArchetypeMatrix(ARCHETYPES.map(archetype => archetype.id), coreStyles),
    '011d9409a6b2a8bde9d1f281d1ce69dd7667e026857d6d5f94d75010186b528f'
  );
  assert.equal(
    hashArchetypeMatrix(ARCHETYPES.map(archetype => archetype.id), styles),
    'e9443b118c45980835511c1d6e2bd44b2dd14fb17b5c83b80d275c1969fbc613'
  );
});

test('Web archetype renders all 480 style and component-tab combinations without fallback', () => {
  let outputCount = 0;

  for (const style of getAllSubDesigns()) {
    for (const tab of PREVIEW_COMPONENT_TABS) {
      const component = renderPreviewComponent({
        rendererId: style.previewType,
        tab,
        design: style
      });
      const html = getArchetypeHTML('web', style, { tab });
      outputCount += 1;

      assert.equal(html.includes(component), true, `${style.id}:${tab}`);
      assert.equal(
        html.match(new RegExp(`\\bmotion-${style.motionProfile}\\b`, 'gu'))?.length,
        1,
        `${style.id}:${tab}:motion`
      );
    }
  }

  assert.equal(outputCount, 480);
});

test('non-Web archetypes remain byte-stable and ignore component-tab options', () => {
  const styles = getAllSubDesigns();
  const legacyStyles = styles.filter(style => LEGACY_STYLE_IDS.includes(style.id));
  const coreStyleIds = new Set(CORE_PACK_MANIFEST.styleIds);
  const coreStyles = styles.filter(style => coreStyleIds.has(style.id));
  const nonWebArchetypes = ARCHETYPES
    .map(archetype => archetype.id)
    .filter(archetype => archetype !== 'web');

  for (const style of styles) {
    for (const archetype of nonWebArchetypes) {
      const baseline = getArchetypeHTML(archetype, style, { tab: 'hero' });
      for (const tab of PREVIEW_COMPONENT_TABS) {
        assert.equal(getArchetypeHTML(archetype, style, { tab }), baseline, `${style.id}:${archetype}:${tab}`);
      }
    }
  }

  assert.equal(
    hashArchetypeMatrix(nonWebArchetypes, legacyStyles),
    'd3d8c899eee322275fedf136735bf7e5e0719e319a2af4c66d2d489c76e53582'
  );
  assert.equal(
    hashArchetypeMatrix(nonWebArchetypes, coreStyles),
    '6882fb4a6158e2e86ab190ffd372211a4a9dbf3d64c2fbed41c8657a5701e622'
  );
  assert.equal(
    hashArchetypeMatrix(nonWebArchetypes, styles),
    '36d4ed1bbaa24a25512d785ee2926a0b972def8b32f108bc76165fdcbf9f1b57'
  );
});

test('Task 5: Aesthetic profiles render authentic markers for Swiss, Y2K, Brutalism, Hypertech and preserve generic fallback', () => {
  const generic = { id: 'generic-sample', name: 'Generic Sample', categoryId: 'unknown-category' };
  const swiss = { id: 'swiss-sample', name: 'Swiss Sample', categoryId: 'swiss' };
  const y2k = { id: 'y2k-sample', name: 'Y2K Sample', categoryId: 'y2k' };
  const brutal = { id: 'brutal-sample', name: 'Brutal Sample', categoryId: 'brutalism' };
  const hyper = { id: 'hyper-sample', name: 'Hyper Sample', categoryId: 'hypertech' };

  // 1. Generic fallback preserves standard game/media/chat
  const genericGame = getArchetypeHTML('game', generic);
  assert.match(genericGame, /PLAYER_01/u);
  assert.match(genericGame, /ARENA BATTLE/u);
  assert.equal(getArchetypeHTML('media', generic).includes('swiss-tuner-scale'), false);
  assert.equal(getArchetypeHTML('media', generic).includes('winamp-lcd-display'), false);

  // 2. Swiss markers
  const swissGame = getArchetypeHTML('game', swiss);
  assert.match(swissGame, /SYS_GRID_01/u);
  assert.match(swissGame, /GRID SYSTEM 01/u);
  assert.match(swissGame, /<span class="meter-label">ACC<\/span>/u);
  assert.match(getArchetypeHTML('media', swiss), /class="swiss-tuner-scale"/u);
  assert.match(getArchetypeHTML('chat', swiss), /# swiss-log/u);

  // 3. Y2K markers
  const y2kGame = getArchetypeHTML('game', y2k);
  assert.match(y2kGame, /CYBER_HERO/u);
  assert.match(y2kGame, /CYBER ARENA/u);
  assert.match(getArchetypeHTML('media', y2k), /class="winamp-lcd-display"/u);
  assert.match(getArchetypeHTML('chat', y2k), /# msn-cyber/u);

  // 4. Brutalism markers
  const brutalGame = getArchetypeHTML('game', brutal);
  assert.match(brutalGame, /RAW_AGGRO/u);
  assert.match(brutalGame, /RAW BATTLE/u);
  assert.match(getArchetypeHTML('media', brutal), /class="brutalist-tape-tag"/u);
  assert.match(getArchetypeHTML('chat', brutal), /# brutal-zine/u);

  // 5. Hypertech markers
  const hyperGame = getArchetypeHTML('game', hyper);
  assert.match(hyperGame, /OPERATOR/u);
  assert.match(hyperGame, /TACTICAL SYS/u);
  assert.match(getArchetypeHTML('media', hyper), /class="hypertech-telemetry"/u);
  assert.match(getArchetypeHTML('chat', hyper), /# secure-uplink/u);

  // 6. Mobile, E-commerce, Blog, Dashboard don't branch unnecessarily on category
  const sameNameSwiss = { id: 'sample-1', name: 'Sample', nameEn: 'Sample', categoryId: 'swiss', shortDesc: 'Desc', characteristics: ['C1'], palette: ['#000', '#fff'] };
  const sameNameY2K = { id: 'sample-2', name: 'Sample', nameEn: 'Sample', categoryId: 'y2k', shortDesc: 'Desc', characteristics: ['C1'], palette: ['#000', '#fff'] };
  for (const arch of ['mobile', 'ecommerce', 'blog', 'dashboard']) {
    const swissHtml = getArchetypeHTML(arch, sameNameSwiss);
    const y2kHtml = getArchetypeHTML(arch, sameNameY2K);
    assert.equal(swissHtml, y2kHtml, `${arch} should not branch on category`);
  }
});

test('Web archetype propagates unknown renderer errors instead of substituting Swiss', () => {
  const style = getAllSubDesigns()[0];

  assert.throws(
    () => getArchetypeHTML('web', { ...style, previewType: 'missing-renderer' }, { tab: 'hero' }),
    error => error instanceof PreviewRegistryError
      && error.code === 'PREVIEW_REFERENCE_UNKNOWN'
      && error.referenceKind === 'renderer'
      && error.referenceId === 'missing-renderer'
      && error.tab === 'hero'
  );
});

test('archetype dispatch rejects unknown IDs instead of substituting Game', () => {
  assert.throws(
    () => getArchetypeHTML('missing-archetype', getAllSubDesigns()[0]),
    error => error instanceof RangeError
      && error.message === '[PreviewState] Unknown archetype ID.'
  );
});

test('Detail rebuild synchronizes the active and ARIA state of Web component tabs', () => {
  const source = readFileSync(
    new URL('../src/components/detailView.js', import.meta.url),
    'utf8'
  );
  const rebuildStart = source.indexOf('function rebuildArchetypeViewport');
  const rebuildEnd = source.indexOf('// Viewport identity', rebuildStart);
  const rebuildSource = source.slice(rebuildStart, rebuildEnd);

  assert.ok(rebuildStart >= 0 && rebuildEnd > rebuildStart);
  assert.match(rebuildSource, /querySelectorAll\('\.comp-tab-btn'\)/u);
  assert.match(
    rebuildSource,
    /btn\.getAttribute\('data-tab'\) === activeComponentTab/u
  );
  assert.match(rebuildSource, /btn\.classList\.toggle\('active', match\)/u);
  assert.match(rebuildSource, /btn\.setAttribute\('aria-selected', String\(match\)\)/u);
});

test('Audit 14 (FIN-F005): 8 archetypes escape hostile name, shortDesc, characteristics, palette, and categoryId against raw element/attribute leaks', () => {
  const base = getAllSubDesigns()[0];
  const hostileStyle = {
    ...base,
    name: '<x-name id="hostile-name">Name</x-name>',
    categoryId: 'general" onclick="alert(1)"',
    shortDesc: '<x-desc data-p=2>Short Description</x-desc>',
    characteristics: ['<x-char onmouseover="bad">Point</x-char>'],
    palette: [{ hex: '#000" onfocus="evil', id: 'chip" data-injected="true', name: '<x-pal>Black</x-pal>' }]
  };

  for (const archetype of ARCHETYPES) {
    const html = getArchetypeHTML(archetype.id, hostileStyle, { tab: 'hero' });
    assert.equal(html.includes('<x-name'), false, `${archetype.id} leaked raw name element`);
    assert.equal(html.includes('<x-desc'), false, `${archetype.id} leaked raw shortDesc element`);
    assert.equal(html.includes('<x-char'), false, `${archetype.id} leaked raw characteristics element`);
    assert.equal(html.includes('<x-pal'), false, `${archetype.id} leaked raw palette element`);
    assert.equal(html.includes('onclick="alert(1)"'), false, `${archetype.id} leaked raw categoryId attribute injection`);
    assert.equal(html.includes('onfocus="evil"'), false, `${archetype.id} leaked raw palette hex attribute injection`);
    assert.equal(html.includes('data-injected="true"'), false, `${archetype.id} leaked raw palette id attribute injection`);
  }
});

test('Audit 15 (A15-F002): Object prototype keys (__proto__, constructor, toString) safely fallback to generic profile', () => {
  const base = getAllSubDesigns()[0];
  for (const evilCat of ['__proto__', 'constructor', 'toString', 'valueOf', 'hasOwnProperty']) {
    const protoStyle = { ...base, categoryId: evilCat };
    for (const archetype of ARCHETYPES) {
      assert.doesNotThrow(() => {
        const html = getArchetypeHTML(archetype.id, protoStyle, { tab: 'hero' });
        assert.ok(html.length > 0, `${archetype.id} produced empty html for ${evilCat}`);
      }, `${archetype.id} threw error on categoryId="${evilCat}"`);
    }
  }
});
