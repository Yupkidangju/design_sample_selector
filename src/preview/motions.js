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

export const CORE_MOTION_DEFINITIONS = Object.freeze([
  defineMotion('grid-reveal', ['effect-layer']),
  defineMotion('sparkline', ['metadata-only']),
  defineMotion('caret-blink', ['unit-class', 'template-local', 'thumbnail-local']),
  defineMotion('hard-punch', ['interaction-local']),
  defineMotion('hard-press', ['interaction-local']),
  defineMotion('glitch-scan', ['effect-layer', 'thumbnail-local']),
  defineMotion('glass-orb', ['effect-layer', 'template-local', 'thumbnail-local']),
  defineMotion('inset-press', ['interaction-local']),
  defineMotion('analog-needle', ['template-local', 'thumbnail-local']),
  defineMotion('confetti-spin', ['thumbnail-local']),
  defineMotion('sun-grid', ['effect-layer', 'template-local', 'thumbnail-local']),
  defineMotion('vhs-shift', ['metadata-only']),
  defineMotion('ken-burns', ['metadata-only']),
  defineMotion('blob-morph', ['thumbnail-local']),
  defineMotion('glow-breathe', ['thumbnail-local']),
  defineMotion('holo-sweep', ['effect-layer', 'template-local', 'thumbnail-local']),
  defineMotion('aqua-bubble', ['effect-layer', 'template-local', 'thumbnail-local']),
  defineMotion('pixel-blink', ['thumbnail-local']),
  defineMotion('marquee-stagger', ['template-local', 'thumbnail-local']),
  defineMotion('tile-stagger', ['metadata-only']),
  defineMotion('hue-distort', ['effect-layer', 'template-local', 'thumbnail-local']),
  defineMotion('squash-breathe', ['template-local', 'thumbnail-local']),
  defineMotion('tape-peel', ['template-local']),
  defineMotion('leaf-sway', ['effect-layer', 'template-local', 'thumbnail-local'])
]);
