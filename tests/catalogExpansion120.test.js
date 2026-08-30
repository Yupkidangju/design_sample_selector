import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getAllStyles,
  getCategories,
  getPackManifests,
  getStylesByCategory
} from '../src/catalog/index.js';
import { validateCurrentCatalog } from '../src/catalog/validation/index.js';
import {
  PREVIEW_COMPONENT_TABS,
  getPreviewMotionDefinition,
  getPreviewReferenceInventory,
  renderPreviewComponent,
  renderPreviewThumbnail
} from '../src/preview/index.js';

const CORE_36_IDS = [
  'swiss-grid', 'corporate-minimal', 'high-contrast-mono', 'raw-brutalism',
  'neo-brutalism', 'cyber-brutalism', 'glassmorphism', 'neumorphism',
  'skeuomorphism', 'memphis', 'synthwave', 'vaporwave', 'high-fashion',
  'fluid-organic', 'dark-minimal-glass', 'y2k-chrome', 'frutiger-aero',
  'pixel-arcade', 'kinetic-type', 'bento-grid', 'acid-techno', 'claymorphism',
  'handcrafted-indie', 'solarpunk-eco', 'bauhaus-geometry', 'de-stijl',
  'flat-design', 'constructivist', 'punk-zine', 'material-design', 'liquid-glass',
  'art-deco', 'psychedelic-poster', 'art-nouveau', 'risograph', 'metro-interface'
];

const EXPANSION_84_IDS = [
  'ulm-rationalism', 'swiss-poster', 'dutch-total-design', 'new-wave-typography',
  'modular-grid-system', 'functional-wayfinding', 'japanese-ma-minimal',
  'scandinavian-functional', 'information-isotype', 'web-brutalism',
  'anti-design', 'dada-collage', 'grunge-typography', 'industrial-stencil',
  'monochrome-xerox', 'glitch-brutalism', 'maximalist-chaos',
  'black-metal-editorial', 'concrete-interface', 'paper-cut-layers',
  'acrylic-ui', 'mica-surface', 'holographic-foil', 'chrome-metal-ui',
  'iridescent-mesh', 'isometric-depth', 'low-poly-interface', 'soft-plastic',
  'embossed-letterpress', 'mid-century-modern', 'atomic-age', 'pop-art-halftone',
  'op-art', 'space-age', 'disco-glam', 'seventies-groovy', 'eighties-new-wave',
  'retro-computing', 'pulp-comic', 'newspaper-broadsheet', 'literary-journal',
  'academic-modern', 'archival-museum', 'photobook-minimal',
  'botanical-editorial', 'wabi-sabi-paper', 'collage-magazine',
  'typographic-poster', 'luxury-serif-minimal', 'early-web',
  'geocities-maximal', 'aqua-desktop', 'luna-desktop', 'web2-gloss',
  'flash-portal', 'blogspot-collage', 'cyber-y2k', 'kawaii-pixel-web',
  'scene-core-web', 'mcbling-gloss', 'tech-optimism-2000', 'cyberpunk-tactical-hud',
  'sci-fi-fui', 'terminal-matrix', 'data-dense-dashboard', 'real-time-monitor',
  'chromatic-aberration', 'generative-grid', 'biometric-interface',
  'spatial-glass-ui', 'ai-native-gradient', 'quantum-control', 'inflatable-ui',
  'toy-block-ui', 'kawaii-pastel', 'sticker-book', 'doodle-interface',
  'papercraft-ui', 'cozy-knit', 'dreamcore-cloud', 'kidcore-play',
  'biomorphic-soft', 'pastel-gradient', 'cartoon-dashboard'
];

const EXPANSION_PACK_IDS = [
  'modern-foundations', 'raw-materials', 'dimensional-pop', 'retro-editorial',
  'web-millennium', 'data-spatial', 'soft-play'
];

test('실제 카탈로그는 기존 36종을 보존한 총 120종이다', () => {
  const styles = getAllStyles();

  assert.equal(styles.length, 120);
  assert.deepEqual(styles.slice(0, CORE_36_IDS.length).map(style => style.id), CORE_36_IDS);
  assert.deepEqual(styles.slice(CORE_36_IDS.length).map(style => style.id), EXPANSION_84_IDS);
  assert.equal(new Set(styles.map(style => style.id)).size, 120);
  assert.equal(Object.isFrozen(styles), true);
  styles.forEach(style => assert.equal(Object.isFrozen(style), true, style.id));
});

test('8개 카테고리는 실제 스타일을 각각 15종 제공한다', () => {
  const categories = getCategories();

  assert.equal(categories.length, 8);
  assert.deepEqual(
    Object.fromEntries(categories.map(category => [category.id, getStylesByCategory(category.id).length])),
    {
      swiss: 15,
      brutalism: 15,
      depth: 15,
      retro: 15,
      editorial: 15,
      y2k: 15,
      hypertech: 15,
      soft3d: 15
    }
  );
});

test('신규 84종은 ready 품질·고유 프리뷰·검토 출처·접근성 메모를 갖는다', () => {
  const expansionIds = new Set(EXPANSION_84_IDS);
  const expansionStyles = getAllStyles().filter(style => expansionIds.has(style.id));

  assert.equal(expansionStyles.length, 84);
  assert.equal(new Set(expansionStyles.map(style => style.preview.rendererId)).size, 84);
  assert.equal(new Set(expansionStyles.map(style => style.preview.thumbnailId)).size, 84);
  assert.equal(new Set(expansionStyles.map(style => style.preview.motionId)).size, 84);

  for (const style of expansionStyles) {
    assert.equal(style.publicationStatus, 'ready', style.id);
    assert.equal(style.provenance.reviewedAt, '2026-08-31', style.id);
    assert.ok(style.provenance.sources.length >= 1, style.id);
    assert.ok(style.provenance.sources.some(source => source.sourceType !== 'community'), style.id);
    assert.ok(style.editorial.accessibilityNotes.length >= 1, style.id);
    assert.equal(style.provenance.assets.length, 0, style.id);
  }

  const report = validateCurrentCatalog();
  const expansionIssues = report.issues.filter(issue => expansionIds.has(issue.entityId));
  assert.deepEqual(expansionIssues, []);
  assert.equal(report.summary.errorCount, 0);
  assert.equal(report.summary.warningCount, 56);
});

test('7개 신규 팩은 12종씩이며 모든 120종은 정확히 한 팩에 속한다', () => {
  const manifests = getPackManifests();
  const expansionPacks = manifests.filter(pack => EXPANSION_PACK_IDS.includes(pack.id));

  assert.equal(manifests.length, 8);
  assert.deepEqual(expansionPacks.map(pack => pack.id), EXPANSION_PACK_IDS);
  expansionPacks.forEach(pack => assert.equal(pack.styleIds.length, 12, pack.id));

  const membership = new Map(getAllStyles().map(style => [style.id, 0]));
  for (const pack of manifests) {
    for (const styleId of pack.styleIds) membership.set(styleId, membership.get(styleId) + 1);
  }
  for (const [styleId, count] of membership) assert.equal(count, 1, styleId);
});

test('공개 프리뷰 inventory는 120/120/120이며 런타임 asset fallback이 없다', () => {
  const inventory = getPreviewReferenceInventory();

  assert.equal(inventory.rendererIds.length, 120);
  assert.equal(inventory.thumbnailIds.length, 120);
  assert.equal(inventory.motionIds.length, 120);
  assert.deepEqual(inventory.assetPaths, []);
});

test('신규 84종의 thumbnail·motion·Web 4탭은 fallback 없이 고유 root를 렌더한다', () => {
  const expansionIds = new Set(EXPANSION_84_IDS);
  const styles = getAllStyles().filter(style => expansionIds.has(style.id));
  let componentCount = 0;

  for (const style of styles) {
    const thumbnail = renderPreviewThumbnail({
      thumbnailId: style.preview.thumbnailId,
      design: style
    });
    const motion = getPreviewMotionDefinition(style.preview.motionId);

    assert.match(thumbnail, new RegExp(`thumb-e120-${style.id}`), style.id);
    assert.match(thumbnail, new RegExp(`data-motif="${style.preview.thumbnailId}"`), style.id);
    assert.equal(motion.id, style.preview.motionId, style.id);
    assert.equal(motion.reducedMotionPolicy, 'suppress', style.id);
    assert.equal(motion.channels.includes('metadata-only'), false, style.id);

    for (const tab of PREVIEW_COMPONENT_TABS) {
      const html = renderPreviewComponent({
        rendererId: style.preview.rendererId,
        tab,
        design: style
      });
      componentCount += 1;
      assert.match(html, new RegExp(`e120-${style.id}-unit`), `${style.id}:${tab}`);
      assert.match(html, new RegExp(`data-preview-tab="${tab}"`), `${style.id}:${tab}`);
      assert.match(html, new RegExp(`motion-${style.preview.motionId}`), `${style.id}:${tab}`);
      assert.match(html, /data-mock-action="toast"/u, `${style.id}:${tab}`);
      assert.doesNotMatch(html, /\bonclick=/u, `${style.id}:${tab}`);
    }
  }

  assert.equal(componentCount, 336);
});
