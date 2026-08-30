const EMPTY_ASSET_PATHS = Object.freeze([]);

function color(design, index, fallback) {
  return design?.palette?.[index]?.value || design?.palette?.[index]?.hex || fallback;
}

function defineThumbnail(id, styleId, inner) {
  return Object.freeze({
    id,
    assetPaths: EMPTY_ASSET_PATHS,
    render(design) {
      return `
        <div class="style-thumb thumb-w1-${styleId}" data-motif="${id}" style="--t0:${color(design, 0, '#111111')};--t1:${color(design, 1, '#FFFFFF')};--t2:${color(design, 2, '#777777')};--t3:${color(design, 3, '#222222')}">
          ${inner}
        </div>`;
    }
  });
}

export const WAVE_1_THUMBNAIL_DEFINITIONS = Object.freeze([
  defineThumbnail('primary-forms', 'bauhaus-geometry', '<i class="w1-thumb-circle"></i><i class="w1-thumb-triangle"></i><i class="w1-thumb-bar"></i><b>BAU</b>'),
  defineThumbnail('orthogonal-planes', 'de-stijl', '<i class="w1-thumb-plane red"></i><i class="w1-thumb-plane blue"></i><i class="w1-thumb-plane yellow"></i>'),
  defineThumbnail('flat-signifiers', 'flat-design', '<div class="w1-thumb-flat-bar"></div><span class="w1-thumb-flat-cta" aria-hidden="true">OPEN</span><i class="w1-thumb-flat-check">✓</i>'),
  defineThumbnail('agitprop-diagonal', 'constructivist', '<i class="w1-thumb-agit-disc"></i><i class="w1-thumb-agit-beam"></i><b>GO!</b>'),
  defineThumbnail('xerox-ransom', 'punk-zine', '<span class="w1-thumb-ransom a">NO</span><span class="w1-thumb-ransom b">ISE</span><i class="w1-thumb-xerox"></i>'),
  defineThumbnail('paper-elevation', 'material-design', '<i class="w1-thumb-paper back"></i><i class="w1-thumb-paper front"></i><b>+</b>'),
  defineThumbnail('refractive-controls', 'liquid-glass', '<i class="w1-thumb-liquid-scene"></i><div class="w1-thumb-liquid-dock"><span></span><span></span><span></span></div>'),
  defineThumbnail('deco-sunburst', 'art-deco', '<i class="w1-thumb-deco-fan"></i><b>DECO</b><i class="w1-thumb-deco-step"></i>'),
  defineThumbnail('optical-waves', 'psychedelic-poster', '<i class="w1-thumb-psych-ring r1"></i><i class="w1-thumb-psych-ring r2"></i><b>WAVE</b>'),
  defineThumbnail('whiplash-frame', 'art-nouveau', '<i class="w1-thumb-vine left"></i><b>ATLAS</b><i class="w1-thumb-vine right"></i>'),
  defineThumbnail('riso-overprint', 'risograph', '<span class="w1-thumb-riso pink">R</span><span class="w1-thumb-riso teal">R</span><i class="w1-thumb-riso-dots"></i>'),
  defineThumbnail('typographic-tiles', 'metro-interface', '<div class="w1-thumb-metro blue">01</div><div class="w1-thumb-metro orange">GO</div><b>type</b>')
]);
