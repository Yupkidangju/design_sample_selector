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
    /renderPreviewComponent\(\{\s*rendererId:\s*subDesign\.previewType,\s*tab:\s*activeTab,\s*design:\s*subDesign\s*\}\)/u
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
    '52f9fb0f8a62425dcde10889381f1a714408f4d7bd78cc2159dd9d5dae777767'
  );
  assert.equal(
    hashArchetypeMatrix(ARCHETYPES.map(archetype => archetype.id), coreStyles),
    '94a2c53503d4c84a22d9f91f893e58bf8b57822dd8da5465411b51e76ec92308'
  );
  assert.equal(
    hashArchetypeMatrix(ARCHETYPES.map(archetype => archetype.id), styles),
    'd7ce69822e124d8fe67b6d65ed91414322bb02ee677ad79365a1360497cd9207'
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
    '041690a743b30c0fdaa90d8b672ff891d1028b348d53ab1be692249f7c5f48b9'
  );
  assert.equal(
    hashArchetypeMatrix(nonWebArchetypes, coreStyles),
    '9a930418ecd40750243cec4bbffce48a65b4c4ceab37c90874ee837882be986a'
  );
  assert.equal(
    hashArchetypeMatrix(nonWebArchetypes, styles),
    '2a880e361606f3c55cf7be95303346f5e966a5362cdfacbeaf78a6ae1f73b33a'
  );
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
