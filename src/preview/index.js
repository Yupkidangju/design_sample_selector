import { createPreviewRegistry } from './registry.js';
import { CORE_MOTION_DEFINITIONS } from './motions.js';
import { CORE_RENDERER_DEFINITIONS } from './renderers.js';
import { CORE_THUMBNAIL_DEFINITIONS } from './thumbnails.js';
import { WAVE_1_MOTION_DEFINITIONS } from './motions-wave-1.js';
import { WAVE_1_RENDERER_DEFINITIONS } from './renderers-wave-1.js';
import { WAVE_1_THUMBNAIL_DEFINITIONS } from './thumbnails-wave-1.js';
import { EXPANSION_MOTION_DEFINITIONS } from './motions-expansion.js';
import { EXPANSION_RENDERER_DEFINITIONS } from './renderers-expansion.js';
import { EXPANSION_THUMBNAIL_DEFINITIONS } from './thumbnails-expansion.js';

const CORE_PREVIEW_REGISTRY = createPreviewRegistry({
  renderers: [
    ...CORE_RENDERER_DEFINITIONS,
    ...WAVE_1_RENDERER_DEFINITIONS,
    ...EXPANSION_RENDERER_DEFINITIONS
  ],
  thumbnails: [
    ...CORE_THUMBNAIL_DEFINITIONS,
    ...WAVE_1_THUMBNAIL_DEFINITIONS,
    ...EXPANSION_THUMBNAIL_DEFINITIONS
  ],
  motions: [
    ...CORE_MOTION_DEFINITIONS,
    ...WAVE_1_MOTION_DEFINITIONS,
    ...EXPANSION_MOTION_DEFINITIONS
  ]
});

export {
  PREVIEW_COMPONENT_TABS,
  PREVIEW_REFERENCE_KINDS,
  PreviewRegistryError
} from './contract.js';

export const getPreviewReferenceInventory =
  CORE_PREVIEW_REGISTRY.getPreviewReferenceInventory;
export const hasPreviewReference = CORE_PREVIEW_REGISTRY.hasPreviewReference;
export const getPreviewRendererCapability =
  CORE_PREVIEW_REGISTRY.getPreviewRendererCapability;
export const getPreviewMotionDefinition =
  CORE_PREVIEW_REGISTRY.getPreviewMotionDefinition;
export const renderPreviewComponent = CORE_PREVIEW_REGISTRY.renderPreviewComponent;
export const renderPreviewThumbnail = CORE_PREVIEW_REGISTRY.renderPreviewThumbnail;
