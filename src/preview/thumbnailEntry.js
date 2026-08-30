import { createPreviewRegistry } from './registry.js';
import { CORE_THUMBNAIL_DEFINITIONS } from './thumbnails.js';
import { WAVE_1_THUMBNAIL_DEFINITIONS } from './thumbnails-wave-1.js';
import { EXPANSION_THUMBNAIL_DEFINITIONS } from './thumbnails-expansion.js';

const THUMBNAIL_REGISTRY = createPreviewRegistry({
  renderers: [],
  thumbnails: [
    ...CORE_THUMBNAIL_DEFINITIONS,
    ...WAVE_1_THUMBNAIL_DEFINITIONS,
    ...EXPANSION_THUMBNAIL_DEFINITIONS
  ],
  motions: []
});

export const getPreviewReferenceInventory =
  THUMBNAIL_REGISTRY.getPreviewReferenceInventory;
export const hasPreviewReference = THUMBNAIL_REGISTRY.hasPreviewReference;
export const renderPreviewThumbnail = THUMBNAIL_REGISTRY.renderPreviewThumbnail;
