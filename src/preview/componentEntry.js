import { createPreviewRegistry } from './registry.js';
import { CORE_MOTION_DEFINITIONS } from './motions.js';
import { CORE_RENDERER_DEFINITIONS } from './renderers.js';
import { WAVE_1_MOTION_DEFINITIONS } from './motions-wave-1.js';
import { WAVE_1_RENDERER_DEFINITIONS } from './renderers-wave-1.js';
import { EXPANSION_MOTION_DEFINITIONS } from './motions-expansion.js';
import { EXPANSION_RENDERER_DEFINITIONS } from './renderers-expansion.js';

// 브라우저 상세 경계에서만 신규 84종의 테마·문법 CSS를 요청한다.
if (typeof document !== 'undefined') {
  await Promise.all([
    import('../styles/themeTokensExpansion.css'),
    import('../styles/expansion-preview.css'),
    import('../styles/audit9-detail.css')
  ]);
}

const COMPONENT_REGISTRY = createPreviewRegistry({
  renderers: [
    ...CORE_RENDERER_DEFINITIONS,
    ...WAVE_1_RENDERER_DEFINITIONS,
    ...EXPANSION_RENDERER_DEFINITIONS
  ],
  thumbnails: [],
  motions: [
    ...CORE_MOTION_DEFINITIONS,
    ...WAVE_1_MOTION_DEFINITIONS,
    ...EXPANSION_MOTION_DEFINITIONS
  ]
});

export { PreviewRegistryError } from './contract.js';
export const getPreviewReferenceInventory =
  COMPONENT_REGISTRY.getPreviewReferenceInventory;
export const hasPreviewReference = COMPONENT_REGISTRY.hasPreviewReference;
export const getPreviewRendererCapability =
  COMPONENT_REGISTRY.getPreviewRendererCapability;
export const getPreviewMotionDefinition =
  COMPONENT_REGISTRY.getPreviewMotionDefinition;
export const renderPreviewComponent = COMPONENT_REGISTRY.renderPreviewComponent;
