const EMPTY_ASSET_PATHS = Object.freeze([]);

function getPaletteColor(design, index, fallback) {
  const color = design?.palette?.[index];
  return color?.hex || color?.value || fallback;
}

function defineThumbnail(id, legacyRendererId, inner) {
  return Object.freeze({
    id,
    assetPaths: EMPTY_ASSET_PATHS,
    render(design) {
      const c0 = getPaletteColor(design, 0, '#111');
      const c1 = getPaletteColor(design, 1, '#fff');
      const c2 = getPaletteColor(design, 2, '#888');

      return `
    <div class="style-thumb thumb-${legacyRendererId}" data-motif="${id}" style="--t0:${c0};--t1:${c1};--t2:${c2}">
      ${inner}
    </div>
  `;
    }
  });
}

export const CORE_THUMBNAIL_DEFINITIONS = Object.freeze([
  defineThumbnail(
    'grid-lines',
    'swiss',
    `<div class="thumb-grid"></div><span class="thumb-giant">Aa</span><i class="thumb-swiss-red"></i>`
  ),
  defineThumbnail(
    'saas-nav',
    'corporate',
    `<div class="thumb-saas-bar"></div><div class="thumb-saas-hero"><b></b><i></i></div>`
  ),
  defineThumbnail(
    'terminal',
    'minimalism',
    `<div class="thumb-term"><span>root:~#</span><i class="thumb-caret"></i></div>`
  ),
  defineThumbnail(
    'raw-html',
    'raw-brutal',
    `<div class="thumb-raw"><span>HTML</span><i></i></div>`
  ),
  defineThumbnail('hard-shadow', 'neo-brutal', `<div class="thumb-neo"><b>POP</b></div>`),
  defineThumbnail(
    'neon-wire',
    'cyberpunk',
    `<div class="thumb-cyber"><span>SYS//</span><i class="thumb-scan"></i></div>`
  ),
  defineThumbnail(
    'frost-orbs',
    'glassmorphism',
    `<div class="thumb-orb o1"></div><div class="thumb-orb o2"></div><div class="thumb-glass-card"></div>`
  ),
  defineThumbnail('soft-knob', 'neumorphism', `<div class="thumb-neu-knob"><i></i></div>`),
  defineThumbnail(
    'metal-dial',
    'skeuomorphism',
    `<div class="thumb-dial"><i class="thumb-needle"></i></div>`
  ),
  defineThumbnail(
    'geo-confetti',
    'memphis',
    `<i class="geo t"></i><i class="geo c"></i><i class="geo z"></i>`
  ),
  defineThumbnail(
    'outrun-sun',
    'retro',
    `<div class="thumb-sun"></div><div class="thumb-horizon"></div>`
  ),
  defineThumbnail(
    'statue-win95',
    'vaporwave',
    `<div class="thumb-statue">Ⅱ</div><div class="thumb-win">95</div>`
  ),
  defineThumbnail(
    'serif-spread',
    'editorial',
    `<span class="thumb-serif">Vogue</span><i class="thumb-rule"></i>`
  ),
  defineThumbnail(
    'warm-blob',
    'organic',
    `<div class="thumb-blob"></div><div class="thumb-blob b2"></div>`
  ),
  defineThumbnail('oled-panel', 'darkmode', `<div class="thumb-oled"><i></i></div>`),
  defineThumbnail('chrome-disc', 'y2k-chrome', `<div class="thumb-disc"><i></i></div>`),
  defineThumbnail(
    'aqua-sphere',
    'frutiger-aero',
    `<div class="thumb-sphere"></div><div class="thumb-hill"></div>`
  ),
  defineThumbnail(
    'arcade-hud',
    'pixel-arcade',
    `<div class="thumb-hud"><i class="hp"></i><span>1UP</span></div>`
  ),
  defineThumbnail(
    'speed-type',
    'kinetic-type',
    `<div class="thumb-marquee"><span>SPEED // MOTION //</span></div>`
  ),
  defineThumbnail(
    'bento-tiles',
    'bento-grid',
    `<div class="thumb-bento"><i></i><i></i><i class="wide"></i></div>`
  ),
  defineThumbnail('acid-smile', 'acid-techno', `<div class="thumb-smile">☺</div>`),
  defineThumbnail('clay-bubble', 'claymorphism', `<div class="thumb-clay"></div>`),
  defineThumbnail(
    'kraft-tape',
    'handcrafted-indie',
    `<div class="thumb-kraft"><i class="tape"></i><span>note</span></div>`
  ),
  defineThumbnail(
    'solar-leaf',
    'solarpunk-eco',
    `<div class="thumb-leaf"></div><div class="thumb-sun-sm"></div>`
  )
]);
