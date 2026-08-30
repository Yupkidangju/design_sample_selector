import { EXPANSION_PREVIEW_BLUEPRINTS } from '../catalog/packs/expansion/index.js';

const EMPTY_ASSET_PATHS = Object.freeze([]);
const CHANNELS_BY_VARIANT = Object.freeze([
  Object.freeze(['effect-layer', 'unit-class', 'thumbnail-local']),
  Object.freeze(['effect-layer', 'interaction-local', 'thumbnail-local']),
  Object.freeze(['effect-layer', 'unit-class', 'template-local']),
  Object.freeze(['effect-layer', 'template-local', 'thumbnail-local'])
]);

export const EXPANSION_MOTION_DEFINITIONS = Object.freeze(
  EXPANSION_PREVIEW_BLUEPRINTS.map(blueprint => {
    const id = `${blueprint.id}-motion`;
    return Object.freeze({
      id,
      unitClass: `motion-${id}`,
      effectClass: `fx-${id}`,
      effectLayer: true,
      channels: CHANNELS_BY_VARIANT[blueprint.variant],
      reducedMotionPolicy: 'suppress',
      assetPaths: EMPTY_ASSET_PATHS
    });
  })
);
