import { createPreviewRegistry } from './registry.js';
import { CORE_MOTION_DEFINITIONS } from './motions.js';
import { WAVE_1_MOTION_DEFINITIONS } from './motions-wave-1.js';
import { EXPANSION_MOTION_DEFINITIONS } from './motions-expansion.js';

const MOTION_REGISTRY = createPreviewRegistry({
  renderers: [],
  thumbnails: [],
  motions: [
    ...CORE_MOTION_DEFINITIONS,
    ...WAVE_1_MOTION_DEFINITIONS,
    ...EXPANSION_MOTION_DEFINITIONS
  ]
});

export { PreviewRegistryError } from './contract.js';
export const getPreviewReferenceInventory = MOTION_REGISTRY.getPreviewReferenceInventory;
export const hasPreviewReference = MOTION_REGISTRY.hasPreviewReference;
export const getPreviewMotionDefinition = MOTION_REGISTRY.getPreviewMotionDefinition;
