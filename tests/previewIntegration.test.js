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
    '2906cc1356925671960a0397b7be9976b65eb1503dc4e4886f40dac106c25550'
  );
  assert.equal(
    hashArchetypeMatrix(ARCHETYPES.map(archetype => archetype.id), coreStyles),
    '79a55474fd4464db5d663802f1a97c0c351b9991a874f1803399b9fd166ab8f3'
  );
  assert.equal(
    hashArchetypeMatrix(ARCHETYPES.map(archetype => archetype.id), styles),
    '0b6e160b1537fd6a44c24f49dd6a5e828cc5b37ffaaf1e031a5a55c7441856d3'
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
    '965edac58a3d81bfb0ce7b1e54e22841cb5194db09778fef0b6ccd63af2b2919'
  );
  assert.equal(
    hashArchetypeMatrix(nonWebArchetypes, coreStyles),
    'a95011123efbef5c0fda90c78296bf27fb32d38fae271450d00ad62d9a6ea169'
  );
  assert.equal(
    hashArchetypeMatrix(nonWebArchetypes, styles),
    '3cb98d1fdfaefc619b30dde66dc6caa7a83797541e386461c85528a8ca24fb82'
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
