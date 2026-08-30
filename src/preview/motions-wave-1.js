const EMPTY_ASSET_PATHS = Object.freeze([]);

function defineMotion(id, channels) {
  return Object.freeze({
    id,
    unitClass: `motion-${id}`,
    effectClass: `fx-${id}`,
    effectLayer: true,
    channels: Object.freeze(channels),
    reducedMotionPolicy: 'suppress',
    assetPaths: EMPTY_ASSET_PATHS
  });
}

export const WAVE_1_MOTION_DEFINITIONS = Object.freeze([
  defineMotion('shape-orbit', ['effect-layer', 'unit-class', 'thumbnail-local']),
  defineMotion('plane-reveal', ['effect-layer', 'unit-class', 'thumbnail-local']),
  defineMotion('color-snap', ['effect-layer', 'interaction-local', 'thumbnail-local']),
  defineMotion('diagonal-drive', ['effect-layer', 'unit-class', 'thumbnail-local']),
  defineMotion('xerox-jitter', ['effect-layer', 'unit-class', 'thumbnail-local']),
  defineMotion('paper-lift', ['effect-layer', 'interaction-local', 'thumbnail-local']),
  defineMotion('lens-shift', ['effect-layer', 'unit-class', 'thumbnail-local']),
  defineMotion('fan-reveal', ['effect-layer', 'unit-class', 'thumbnail-local']),
  defineMotion('poster-warp', ['effect-layer', 'unit-class', 'thumbnail-local']),
  defineMotion('vine-trace', ['effect-layer', 'unit-class', 'thumbnail-local']),
  defineMotion('ink-drift', ['effect-layer', 'unit-class', 'thumbnail-local']),
  defineMotion('tile-panorama', ['effect-layer', 'interaction-local', 'thumbnail-local'])
]);
