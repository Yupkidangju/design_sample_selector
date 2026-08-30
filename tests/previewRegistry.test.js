import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { getMockupHTML } from '../src/components/mockupTemplates.js';
import { getAllSubDesigns } from '../src/data/categories.js';
import {
  PREVIEW_COMPONENT_TABS,
  PREVIEW_ERROR_CODES,
  PREVIEW_MOTION_CHANNELS,
  PREVIEW_REFERENCE_KINDS,
  PreviewRegistryError
} from '../src/preview/contract.js';
import { createPreviewRegistry } from '../src/preview/registry.js';
import { WAVE_1_RENDERER_DEFINITIONS } from '../src/preview/renderers-wave-1.js';
import { WAVE_1_THUMBNAIL_DEFINITIONS } from '../src/preview/thumbnails-wave-1.js';
import { WAVE_1_MOTION_DEFINITIONS } from '../src/preview/motions-wave-1.js';
import { CORE_WAVE_1_STYLES } from '../src/catalog/packs/core/styles-wave-1.js';
import { CORE_FOUNDATION_STYLES } from '../src/catalog/packs/core/styles-foundations.js';
import { CORE_CONTEMPORARY_STYLES } from '../src/catalog/packs/core/styles-contemporary.js';

const WAVE_1_RENDERER_IDS = [
  'bauhaus-geometry',
  'de-stijl',
  'flat-design',
  'constructivist',
  'punk-zine',
  'material-design',
  'liquid-glass',
  'art-deco',
  'psychedelic-poster',
  'art-nouveau',
  'risograph',
  'metro-interface'
];

const WAVE_1_THUMBNAIL_IDS = [
  'primary-forms', 'orthogonal-planes', 'flat-signifiers', 'agitprop-diagonal',
  'xerox-ransom', 'paper-elevation', 'refractive-controls', 'deco-sunburst',
  'optical-waves', 'whiplash-frame', 'riso-overprint', 'typographic-tiles'
];

const WAVE_1_MOTION_IDS = [
  'shape-orbit', 'plane-reveal', 'color-snap', 'diagonal-drive',
  'xerox-jitter', 'paper-lift', 'lens-shift', 'fan-reveal',
  'poster-warp', 'vine-trace', 'ink-drift', 'tile-panorama'
];

function createDefinitions() {
  return {
    renderers: [{
      id: 'example-renderer',
      aliases: ['example-renderer-old'],
      tabs: ['hero', 'widget'],
      assetPaths: ['assets/example-renderer.svg'],
      render(tab, design) {
        return `<div class="mockup-unit ${design?.className || 'example'}">${tab}</div>`;
      }
    }],
    thumbnails: [{
      id: 'example-thumbnail',
      assetPaths: ['assets/example-thumbnail.svg'],
      render(design) {
        return `<div class="style-thumb">${design?.label || 'Example'}</div>`;
      }
    }],
    motions: [{
      id: 'example-motion',
      unitClass: 'motion-example-motion',
      effectClass: 'fx-example-motion',
      effectLayer: true,
      channels: ['effect-layer', 'thumbnail-local'],
      reducedMotionPolicy: 'suppress',
      assetPaths: []
    }]
  };
}

function assertPreviewError(callback, code, details = {}) {
  assert.throws(callback, error => {
    assert.ok(error instanceof PreviewRegistryError);
    assert.equal(error.name, 'PreviewRegistryError');
    assert.equal(error.code, code);
    for (const [key, value] of Object.entries(details)) {
      assert.equal(error[key], value, key);
    }
    return true;
  });
}

const LEGACY_STYLE_IDS = new Set([
  ...CORE_FOUNDATION_STYLES,
  ...CORE_CONTEMPORARY_STYLES
].map(style => style.id));
const LEGACY_SUB_DESIGNS = getAllSubDesigns().filter(style => LEGACY_STYLE_IDS.has(style.id));
const CORE_36_STYLE_IDS = new Set([
  ...CORE_FOUNDATION_STYLES,
  ...CORE_CONTEMPORARY_STYLES,
  ...CORE_WAVE_1_STYLES
].map(style => style.id));

function hashPreviewMatrix(tabs, render, styles = getAllSubDesigns()) {
  const framedOutputs = [];
  for (const style of styles) {
    for (const tab of tabs) {
      const key = `${style.id}:${tab}`;
      const html = render(style, tab);
      framedOutputs.push(`${key.length}:${key}${html.length}:${html}`);
    }
  }
  return createHash('sha256').update(framedOutputs.join('')).digest('hex');
}

const CORE_MOTION_CHANNELS = {
  'grid-reveal': ['effect-layer'],
  sparkline: ['metadata-only'],
  'caret-blink': ['unit-class', 'template-local', 'thumbnail-local'],
  'hard-punch': ['interaction-local'],
  'hard-press': ['interaction-local'],
  'glitch-scan': ['effect-layer', 'thumbnail-local'],
  'glass-orb': ['effect-layer', 'template-local', 'thumbnail-local'],
  'inset-press': ['interaction-local'],
  'analog-needle': ['template-local', 'thumbnail-local'],
  'confetti-spin': ['thumbnail-local'],
  'sun-grid': ['effect-layer', 'template-local', 'thumbnail-local'],
  'vhs-shift': ['metadata-only'],
  'ken-burns': ['metadata-only'],
  'blob-morph': ['thumbnail-local'],
  'glow-breathe': ['thumbnail-local'],
  'holo-sweep': ['effect-layer', 'template-local', 'thumbnail-local'],
  'aqua-bubble': ['effect-layer', 'template-local', 'thumbnail-local'],
  'pixel-blink': ['thumbnail-local'],
  'marquee-stagger': ['template-local', 'thumbnail-local'],
  'tile-stagger': ['metadata-only'],
  'hue-distort': ['effect-layer', 'template-local', 'thumbnail-local'],
  'squash-breathe': ['template-local', 'thumbnail-local'],
  'tape-peel': ['template-local'],
  'leaf-sway': ['effect-layer', 'template-local', 'thumbnail-local'],
  'shape-orbit': ['effect-layer', 'unit-class', 'thumbnail-local'],
  'plane-reveal': ['effect-layer', 'unit-class', 'thumbnail-local'],
  'color-snap': ['effect-layer', 'interaction-local', 'thumbnail-local'],
  'diagonal-drive': ['effect-layer', 'unit-class', 'thumbnail-local'],
  'xerox-jitter': ['effect-layer', 'unit-class', 'thumbnail-local'],
  'paper-lift': ['effect-layer', 'interaction-local', 'thumbnail-local'],
  'lens-shift': ['effect-layer', 'unit-class', 'thumbnail-local'],
  'fan-reveal': ['effect-layer', 'unit-class', 'thumbnail-local'],
  'poster-warp': ['effect-layer', 'unit-class', 'thumbnail-local'],
  'vine-trace': ['effect-layer', 'unit-class', 'thumbnail-local'],
  'ink-drift': ['effect-layer', 'unit-class', 'thumbnail-local'],
  'tile-panorama': ['effect-layer', 'interaction-local', 'thumbnail-local']
};

test('preview contract constants expose frozen stable vocabularies', () => {
  assert.deepEqual(PREVIEW_COMPONENT_TABS, ['hero', 'widget', 'form', 'pricing']);
  assert.deepEqual(PREVIEW_REFERENCE_KINDS, ['renderer', 'thumbnail', 'motion']);
  assert.deepEqual(PREVIEW_MOTION_CHANNELS, [
    'effect-layer',
    'unit-class',
    'template-local',
    'thumbnail-local',
    'interaction-local',
    'metadata-only'
  ]);
  assert.deepEqual(PREVIEW_ERROR_CODES, [
    'PREVIEW_DEFINITION_INVALID',
    'PREVIEW_DEFINITION_DUPLICATE',
    'PREVIEW_ALIAS_COLLISION',
    'PREVIEW_REFERENCE_UNKNOWN',
    'PREVIEW_TAB_UNSUPPORTED',
    'PREVIEW_RENDER_OUTPUT_INVALID'
  ]);

  [
    PREVIEW_COMPONENT_TABS,
    PREVIEW_REFERENCE_KINDS,
    PREVIEW_MOTION_CHANNELS,
    PREVIEW_ERROR_CODES
  ].forEach(value => assert.equal(Object.isFrozen(value), true));
});

function assertWaveRendererBatch(batchIds) {
  const definitions = WAVE_1_RENDERER_DEFINITIONS.filter(item => batchIds.includes(item.id));

  assert.deepEqual(definitions.map(item => item.id), batchIds);
  for (const definition of definitions) {
    assert.deepEqual(definition.aliases, [], definition.id);
    assert.deepEqual(definition.tabs, PREVIEW_COMPONENT_TABS, definition.id);
    assert.deepEqual(definition.assetPaths, [], definition.id);

    const outputs = PREVIEW_COMPONENT_TABS.map(tab => definition.render(tab, { id: definition.id }));
    assert.equal(new Set(outputs).size, PREVIEW_COMPONENT_TABS.length, definition.id);
    for (const [index, html] of outputs.entries()) {
      const tab = PREVIEW_COMPONENT_TABS[index];
      assert.match(html, new RegExp(`class="mockup-unit w1-${definition.id}-unit"`), `${definition.id}:${tab}`);
      assert.match(html, new RegExp(`data-preview-tab="${tab}"`), `${definition.id}:${tab}`);
      assert.match(html, /<button\b[^>]*data-mock-action=/u, `${definition.id}:${tab}`);
      assert.doesNotMatch(html, /\bonclick=/u, `${definition.id}:${tab}`);
    }
  }
}

test('Wave 1 renderer Batch A는 스타일별 독립 구조로 네 탭을 직접 렌더한다', () => {
  assertWaveRendererBatch(WAVE_1_RENDERER_IDS.slice(0, 4));
});

test('Wave 1 renderer Batch B는 재질별 독립 구조로 네 탭을 직접 렌더한다', () => {
  assertWaveRendererBatch(WAVE_1_RENDERER_IDS.slice(4, 8));
});

test('Wave 1 renderer Batch C는 매체별 독립 구조로 네 탭을 직접 렌더한다', () => {
  assertWaveRendererBatch(WAVE_1_RENDERER_IDS.slice(8));
  assert.equal(WAVE_1_RENDERER_DEFINITIONS.length, 12);
  assert.equal(Object.isFrozen(WAVE_1_RENDERER_DEFINITIONS), true);
});

test('Wave 1 thumbnail·motion은 12종 독립 ID와 실제 구현 채널을 가진다', () => {
  assert.deepEqual(WAVE_1_THUMBNAIL_DEFINITIONS.map(item => item.id), WAVE_1_THUMBNAIL_IDS);
  assert.deepEqual(WAVE_1_MOTION_DEFINITIONS.map(item => item.id), WAVE_1_MOTION_IDS);
  assert.equal(Object.isFrozen(WAVE_1_THUMBNAIL_DEFINITIONS), true);
  assert.equal(Object.isFrozen(WAVE_1_MOTION_DEFINITIONS), true);

  const registry = createPreviewRegistry({
    renderers: WAVE_1_RENDERER_DEFINITIONS,
    thumbnails: WAVE_1_THUMBNAIL_DEFINITIONS,
    motions: WAVE_1_MOTION_DEFINITIONS
  });
  assert.deepEqual(
    Object.fromEntries(Object.entries(registry.getPreviewReferenceInventory()).map(([key, values]) => [key, values.length])),
    { rendererIds: 12, thumbnailIds: 12, motionIds: 12, assetPaths: 0 }
  );

  for (const style of CORE_WAVE_1_STYLES) {
    const motion = registry.getPreviewMotionDefinition(style.preview.motionId);
    assert.ok(motion, style.id);
    assert.equal(motion.effectLayer, true, style.id);
    assert.equal(motion.reducedMotionPolicy, 'suppress', style.id);
    assert.equal(motion.channels.includes('metadata-only'), false, style.id);
    assert.ok(motion.channels.some(channel => channel !== 'metadata-only'), style.id);

    const html = registry.renderPreviewThumbnail({
      thumbnailId: style.preview.thumbnailId,
      design: style
    });
    assert.match(html, new RegExp(`class="style-thumb thumb-w1-${style.id}"`), style.id);
    assert.match(html, new RegExp(`data-motif="${style.preview.thumbnailId}"`), style.id);
  }
});

test('registry derives a sorted frozen inventory without mutating definitions', () => {
  const definitions = createDefinitions();
  const registry = createPreviewRegistry(definitions);
  const inventory = registry.getPreviewReferenceInventory();

  assert.deepEqual(inventory, {
    rendererIds: ['example-renderer'],
    thumbnailIds: ['example-thumbnail'],
    motionIds: ['example-motion'],
    assetPaths: ['assets/example-renderer.svg', 'assets/example-thumbnail.svg']
  });
  assert.equal(Object.isFrozen(inventory), true);
  Object.values(inventory).forEach(value => assert.equal(Object.isFrozen(value), true));
  assert.equal(Object.isFrozen(definitions), false);
  assert.equal(Object.isFrozen(definitions.renderers[0]), false);
  assert.equal(Object.isFrozen(registry), true);
});

test('query APIs resolve explicit aliases and hide implementation functions', () => {
  const registry = createPreviewRegistry(createDefinitions());

  assert.equal(registry.hasPreviewReference('renderer', 'example-renderer'), true);
  assert.equal(registry.hasPreviewReference('renderer', 'example-renderer-old'), true);
  assert.equal(registry.hasPreviewReference('thumbnail', 'example-thumbnail'), true);
  assert.equal(registry.hasPreviewReference('motion', 'example-motion'), true);
  assert.equal(registry.hasPreviewReference('unknown', 'example-renderer'), false);
  assert.equal(registry.hasPreviewReference('renderer', null), false);
  assert.equal(registry.hasPreviewReference('renderer', 'missing-renderer'), false);

  const capability = registry.getPreviewRendererCapability('example-renderer-old');
  assert.deepEqual(capability, {
    id: 'example-renderer',
    requestedId: 'example-renderer-old',
    isAlias: true,
    tabs: ['hero', 'widget'],
    assetPaths: ['assets/example-renderer.svg']
  });
  assert.equal(Object.isFrozen(capability), true);
  assert.equal('render' in capability, false);
  assert.equal(registry.getPreviewRendererCapability('missing-renderer'), null);
});

test('motion query returns a frozen public descriptor', () => {
  const registry = createPreviewRegistry(createDefinitions());
  const motion = registry.getPreviewMotionDefinition('example-motion');

  assert.deepEqual(motion, {
    id: 'example-motion',
    unitClass: 'motion-example-motion',
    effectClass: 'fx-example-motion',
    effectLayer: true,
    channels: ['effect-layer', 'thumbnail-local'],
    reducedMotionPolicy: 'suppress',
    assetPaths: []
  });
  assert.equal(Object.isFrozen(motion), true);
  assert.equal(Object.isFrozen(motion.channels), true);
  assert.equal(registry.getPreviewMotionDefinition('missing-motion'), null);
});

test('registry rejects malformed definitions with stable error properties', () => {
  const cases = [
    {
      mutate(definitions) { definitions.renderers[0].id = 'Not Valid'; },
      kind: 'renderer',
      id: 'Not Valid'
    },
    {
      mutate(definitions) { definitions.renderers[0].tabs = ['hero', 'unknown-tab']; },
      kind: 'renderer',
      id: 'example-renderer'
    },
    {
      mutate(definitions) { definitions.renderers[0].render = 'not-a-function'; },
      kind: 'renderer',
      id: 'example-renderer'
    },
    {
      mutate(definitions) { definitions.thumbnails[0].assetPaths = ['../escape.svg']; },
      kind: 'thumbnail',
      id: 'example-thumbnail'
    },
    {
      mutate(definitions) { definitions.motions[0].channels = ['metadata-only', 'unit-class']; },
      kind: 'motion',
      id: 'example-motion'
    },
    {
      mutate(definitions) { definitions.motions[0].reducedMotionPolicy = 'ignore'; },
      kind: 'motion',
      id: 'example-motion'
    }
  ];

  for (const item of cases) {
    const definitions = createDefinitions();
    item.mutate(definitions);
    assertPreviewError(
      () => createPreviewRegistry(definitions),
      'PREVIEW_DEFINITION_INVALID',
      { referenceKind: item.kind, referenceId: item.id }
    );
  }
});

test('registry rejects duplicate IDs and renderer alias collisions', () => {
  const duplicate = createDefinitions();
  duplicate.thumbnails.push({ ...duplicate.thumbnails[0] });
  assertPreviewError(
    () => createPreviewRegistry(duplicate),
    'PREVIEW_DEFINITION_DUPLICATE',
    { referenceKind: 'thumbnail', referenceId: 'example-thumbnail' }
  );

  const canonicalCollision = createDefinitions();
  canonicalCollision.renderers.push({
    ...canonicalCollision.renderers[0],
    id: 'example-renderer-old',
    aliases: []
  });
  assertPreviewError(
    () => createPreviewRegistry(canonicalCollision),
    'PREVIEW_ALIAS_COLLISION',
    { referenceKind: 'renderer', referenceId: 'example-renderer-old' }
  );

  const aliasCollision = createDefinitions();
  aliasCollision.renderers.push({
    ...aliasCollision.renderers[0],
    id: 'second-renderer',
    aliases: ['example-renderer-old']
  });
  assertPreviewError(
    () => createPreviewRegistry(aliasCollision),
    'PREVIEW_ALIAS_COLLISION',
    { referenceKind: 'renderer', referenceId: 'example-renderer-old' }
  );
});

test('render APIs return trusted output and throw instead of falling back', () => {
  const registry = createPreviewRegistry(createDefinitions());

  assert.equal(
    registry.renderPreviewComponent({
      rendererId: 'example-renderer-old',
      tab: 'hero',
      design: { className: 'fixture', motionProfile: 'example-motion' }
    }),
    '<div class="mockup-unit motion-example-motion fixture">hero</div>'
  );
  assert.equal(
    registry.renderPreviewThumbnail({
      thumbnailId: 'example-thumbnail',
      design: { label: 'Fixture' }
    }),
    '<div class="style-thumb">Fixture</div>'
  );

  assertPreviewError(
    () => registry.renderPreviewComponent({ rendererId: 'missing-renderer', tab: 'hero' }),
    'PREVIEW_REFERENCE_UNKNOWN',
    { referenceKind: 'renderer', referenceId: 'missing-renderer', tab: 'hero' }
  );
  assertPreviewError(
    () => registry.renderPreviewComponent({ rendererId: 'example-renderer', tab: 'pricing' }),
    'PREVIEW_TAB_UNSUPPORTED',
    { referenceKind: 'renderer', referenceId: 'example-renderer', tab: 'pricing' }
  );
  assertPreviewError(
    () => registry.renderPreviewThumbnail({ thumbnailId: 'missing-thumbnail' }),
    'PREVIEW_REFERENCE_UNKNOWN',
    { referenceKind: 'thumbnail', referenceId: 'missing-thumbnail' }
  );
});

test('component render resolves legacy and canonical motion IDs exactly once', () => {
  const registry = createPreviewRegistry(createDefinitions());

  assert.equal(
    registry.renderPreviewComponent({
      rendererId: 'example-renderer',
      tab: 'hero',
      design: { className: 'fixture', motionProfile: 'example-motion' }
    }),
    '<div class="mockup-unit motion-example-motion fixture">hero</div>'
  );
  assert.equal(
    registry.renderPreviewComponent({
      rendererId: 'example-renderer',
      tab: 'hero',
      design: {
        className: 'motion-example-motion fixture',
        preview: { motionId: 'example-motion' }
      }
    }),
    '<div class="mockup-unit motion-example-motion fixture">hero</div>'
  );

  assertPreviewError(
    () => registry.renderPreviewComponent({
      rendererId: 'example-renderer',
      tab: 'hero',
      design: { className: 'fixture' }
    }),
    'PREVIEW_REFERENCE_UNKNOWN',
    { referenceKind: 'motion', referenceId: null, tab: 'hero' }
  );
  assertPreviewError(
    () => registry.renderPreviewComponent({
      rendererId: 'example-renderer',
      tab: 'hero',
      design: { className: 'fixture', motionProfile: 'missing-motion' }
    }),
    'PREVIEW_REFERENCE_UNKNOWN',
    { referenceKind: 'motion', referenceId: 'missing-motion', tab: 'hero' }
  );
});

test('render APIs reject empty implementation output', () => {
  const definitions = createDefinitions();
  definitions.renderers[0].render = () => '';
  definitions.thumbnails[0].render = () => null;
  const registry = createPreviewRegistry(definitions);

  assertPreviewError(
    () => registry.renderPreviewComponent({
      rendererId: 'example-renderer',
      tab: 'hero',
      design: { motionProfile: 'example-motion' }
    }),
    'PREVIEW_RENDER_OUTPUT_INVALID',
    { referenceKind: 'renderer', referenceId: 'example-renderer', tab: 'hero' }
  );
  assertPreviewError(
    () => registry.renderPreviewThumbnail({ thumbnailId: 'example-thumbnail' }),
    'PREVIEW_RENDER_OUTPUT_INVALID',
    { referenceKind: 'thumbnail', referenceId: 'example-thumbnail' }
  );
});

test('component render rejects a malformed mockup-unit class attribute', () => {
  const definitions = createDefinitions();
  definitions.renderers[0].render = () => '<div class="mockup-unit fixture>hero</div>';
  const registry = createPreviewRegistry(definitions);

  assertPreviewError(
    () => registry.renderPreviewComponent({
      rendererId: 'example-renderer',
      tab: 'hero',
      design: { motionProfile: 'example-motion' }
    }),
    'PREVIEW_RENDER_OUTPUT_INVALID',
    { referenceKind: 'renderer', referenceId: 'example-renderer', tab: 'hero' }
  );
});

test('legacy component entry preserves the approved 96-output fingerprint', () => {
  assert.equal(
    hashPreviewMatrix(
      PREVIEW_COMPONENT_TABS,
      (style, tab) => getMockupHTML(style.previewType, tab, style),
      LEGACY_SUB_DESIGNS
    ),
    'cc51b6b02eb73959fe8f68f9885c28dc9b67e121653ff908fbd0c6be529665c5'
  );
});

test('legacy component entry rejects unknown or missing renderers and unsupported tabs', () => {
  const design = getAllSubDesigns()[0];

  assertPreviewError(
    () => getMockupHTML('missing-renderer', 'hero', design),
    'PREVIEW_REFERENCE_UNKNOWN',
    { referenceKind: 'renderer', referenceId: 'missing-renderer', tab: 'hero' }
  );
  assertPreviewError(
    () => getMockupHTML(undefined, 'hero', design),
    'PREVIEW_REFERENCE_UNKNOWN',
    { referenceKind: 'renderer', referenceId: null, tab: 'hero' }
  );
  assertPreviewError(
    () => getMockupHTML('swiss', 'unknown-tab', design),
    'PREVIEW_TAB_UNSUPPORTED',
    { referenceKind: 'renderer', referenceId: 'swiss', tab: 'unknown-tab' }
  );
});

test('production renderer registry exposes 120 canonical IDs and preserves legacy component output', async () => {
  const preview = await import('../src/preview/index.js');
  const expectedRendererIds = [...new Set(
    getAllSubDesigns().map(style => style.previewType)
  )].sort((left, right) => left.localeCompare(right, 'en'));

  assert.deepEqual(
    preview.getPreviewReferenceInventory().rendererIds,
    expectedRendererIds
  );
  assert.deepEqual(preview.getPreviewRendererCapability('brutalism'), {
    id: 'raw-brutal',
    requestedId: 'brutalism',
    isAlias: true,
    tabs: PREVIEW_COMPONENT_TABS,
    assetPaths: []
  });
  assert.equal(
    hashPreviewMatrix(
      PREVIEW_COMPONENT_TABS,
      (style, tab) => preview.renderPreviewComponent({
        rendererId: style.previewType,
        tab,
        design: style
      }),
      LEGACY_SUB_DESIGNS
    ),
    'cc51b6b02eb73959fe8f68f9885c28dc9b67e121653ff908fbd0c6be529665c5'
  );
});

test('production motion registry exposes 120 evidence-based frozen descriptors', async () => {
  const preview = await import('../src/preview/index.js');
  const styles = getAllSubDesigns();
  const expectedMotionIds = [...new Set(
    styles.map(style => style.motionProfile)
  )].sort((left, right) => left.localeCompare(right, 'en'));

  assert.deepEqual(preview.getPreviewReferenceInventory().motionIds, expectedMotionIds);
  assert.equal(Object.keys(CORE_MOTION_CHANNELS).length, 36);

  for (const style of styles) {
    const motion = preview.getPreviewMotionDefinition(style.motionProfile);
    assert.equal(motion.id, style.motionProfile, style.id);
    assert.equal(motion.unitClass, `motion-${style.motionProfile}`, style.id);
    assert.equal(motion.effectClass, `fx-${style.motionProfile}`, style.id);
    assert.equal(motion.effectLayer, true, style.id);
    assert.equal(motion.reducedMotionPolicy, 'suppress', style.id);
    assert.deepEqual(motion.assetPaths, [], style.id);
    if (CORE_36_STYLE_IDS.has(style.id)) {
      assert.deepEqual(motion.channels, CORE_MOTION_CHANNELS[style.motionProfile], style.id);
    } else {
      assert.equal(motion.channels.includes('metadata-only'), false, style.id);
      assert.ok(motion.channels.includes('effect-layer'), style.id);
    }
    assert.equal(Object.isFrozen(motion), true);
    assert.equal(Object.isFrozen(motion.channels), true);
    assert.equal(preview.hasPreviewReference('motion', style.motionProfile), true);
  }

  assert.equal(preview.getPreviewMotionDefinition('missing-motion'), null);
});

test('production component output applies each registered motion class once', async () => {
  const preview = await import('../src/preview/index.js');

  for (const style of getAllSubDesigns()) {
    for (const tab of PREVIEW_COMPONENT_TABS) {
      const html = preview.renderPreviewComponent({
        rendererId: style.previewType,
        tab,
        design: style
      });
      assert.equal(
        html.match(new RegExp(`\\bmotion-${style.motionProfile}\\b`, 'g'))?.length,
        1,
        `${style.id}:${tab}`
      );
    }
  }
});

test('production thumbnail registry dispatches all 120 canonical thumbnail IDs directly', async () => {
  const preview = await import('../src/preview/index.js');
  const styles = getAllSubDesigns();
  const expectedThumbnailIds = [...new Set(
    styles.map(style => style.thumbMotif)
  )].sort((left, right) => left.localeCompare(right, 'en'));

  assert.deepEqual(
    preview.getPreviewReferenceInventory().thumbnailIds,
    expectedThumbnailIds
  );

  for (const style of styles) {
    const html = preview.renderPreviewThumbnail({
      thumbnailId: style.thumbMotif,
      design: style
    });
    assert.equal(html, getMockupHTML(style.previewType, 'thumb', style));
    const expectedClass = LEGACY_STYLE_IDS.has(style.id)
      ? `thumb-${style.previewType}`
      : CORE_36_STYLE_IDS.has(style.id)
        ? `thumb-w1-${style.id}`
        : `thumb-e120-${style.id}`;
    assert.match(html, new RegExp(`class="style-thumb ${expectedClass}"`));
    assert.match(html, new RegExp(`data-motif="${style.thumbMotif}"`));
    assert.doesNotMatch(
      html,
      /<(?:a|button|input|select|textarea)\b/iu,
      `${style.id}: thumbnail은 button 내부에 안전하게 삽입되는 비인터랙티브 markup이어야 한다.`
    );
    if (CORE_36_STYLE_IDS.has(style.id)) {
      assert.ok(
        html.includes(
          `style="--t0:${style.palette[0].hex};--t1:${style.palette[1].hex};--t2:${style.palette[2].hex}`
        )
      );
    } else {
      assert.match(html, /data-grammar="[a-z0-9-]+"/u);
      assert.match(html, /data-variant="[0-3]"/u);
    }
  }
});

test('thumbnail compatibility entry uses thumbMotif without renderer or generic fallback', async () => {
  const preview = await import('../src/preview/index.js');
  const design = getAllSubDesigns()[0];
  const terminalDesign = { ...design, thumbMotif: 'terminal' };

  assert.equal(
    getMockupHTML('swiss', 'thumb', terminalDesign),
    preview.renderPreviewThumbnail({ thumbnailId: 'terminal', design: terminalDesign })
  );
  assert.match(getMockupHTML('swiss', 'thumb', terminalDesign), /thumb-minimalism/);

  assertPreviewError(
    () => getMockupHTML('swiss', 'thumb', { ...design, thumbMotif: undefined }),
    'PREVIEW_REFERENCE_UNKNOWN',
    { referenceKind: 'thumbnail', referenceId: null }
  );
  assertPreviewError(
    () => getMockupHTML('swiss', 'thumb', { ...design, thumbMotif: 'missing-thumbnail' }),
    'PREVIEW_REFERENCE_UNKNOWN',
    { referenceKind: 'thumbnail', referenceId: 'missing-thumbnail' }
  );
});

test('UI preview consumers use only explicit public preview render options', () => {
  const consumers = [
    { file: 'mainView.js', imports: ['../preview/thumbnailEntry.js'], functions: ['renderPreviewThumbnail'] },
    { file: 'detailView.js', imports: ['../preview/thumbnailEntry.js'], functions: ['renderPreviewThumbnail'] },
    { file: 'selectionDock.js', imports: ['../preview/thumbnailEntry.js', './lazyPreviewLoader.js'], functions: ['renderPreviewThumbnail', 'renderPreviewComponent'] },
    { file: 'peekPreview.js', imports: ['./lazyPreviewLoader.js'], functions: ['renderPreviewComponent'] }
  ];

  for (const consumer of consumers) {
    const source = readFileSync(
      new URL(`../src/components/${consumer.file}`, import.meta.url),
      'utf8'
    );

    assert.doesNotMatch(source, /getMockupHTML|CORE_.*DEFINITIONS|preview\w*Map/u, consumer.file);
    for (const importPath of consumer.imports) {
      assert.ok(source.includes(`from '${importPath}'`), `${consumer.file}: ${importPath}`);
    }

    for (const functionName of consumer.functions) {
      assert.match(source, new RegExp(`\\b${functionName}\\b`, 'u'), consumer.file);
    }

    if (consumer.functions.includes('renderPreviewThumbnail')) {
      assert.match(
        source,
        /(?:renderPreviewThumbnail\(\{\s*thumbnailId:\s*\w+\.thumbMotif,\s*design:\s*\w+\s*\}\)|renderThumbnail:\s*renderPreviewThumbnail)/u,
        consumer.file
      );
    }
    if (consumer.functions.includes('renderPreviewComponent')) {
      assert.match(
        source,
        /renderPreviewComponent\(\{\s*rendererId:\s*\w+\.previewType,\s*tab:\s*'hero',\s*design:\s*\w+\s*\}\)/u,
        consumer.file
      );
    }
  }
});

test('explicit consumer options preserve all thumbnail and hero output', async () => {
  const preview = await import('../src/preview/index.js');

  for (const style of getAllSubDesigns()) {
    assert.equal(
      preview.renderPreviewThumbnail({ thumbnailId: style.thumbMotif, design: style }),
      getMockupHTML(style.previewType, 'thumb', style),
      `${style.id}:thumb`
    );
    assert.equal(
      preview.renderPreviewComponent({ rendererId: style.previewType, tab: 'hero', design: style }),
      getMockupHTML(style.previewType, 'hero', style),
      `${style.id}:hero`
    );
  }
});

test('compatibility entry preserves the approved 120-output fingerprint', () => {
  assert.equal(
    hashPreviewMatrix(
      [...PREVIEW_COMPONENT_TABS, 'thumb'],
      (style, tab) => getMockupHTML(style.previewType, tab, style),
      LEGACY_SUB_DESIGNS
    ),
    '4b0ccbb887d83676464dc523ece67fdd7ed5ee43d4941d741a992a5354c9d4d9'
  );
});
