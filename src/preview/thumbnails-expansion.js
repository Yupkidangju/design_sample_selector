import { EXPANSION_PREVIEW_BLUEPRINTS } from '../catalog/packs/expansion/index.js';

const EMPTY_ASSET_PATHS = Object.freeze([]);

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function motifBackground(blueprint) {
  const [background, surface, surfaceSubtle, accent, accentSecondary] = blueprint.colors;
  const angle = 18 + blueprint.variant * 24;
  const patterns = {
    'rational-grid': `linear-gradient(90deg, transparent 48%, ${accent} 49% 51%, transparent 52%),linear-gradient(${angle}deg, ${surface} 0 62%, ${accentSecondary} 63%)`,
    'sparse-axis': `linear-gradient(90deg, ${background} 0 22%, ${accent} 22% 25%, ${surface} 25%)`,
    'symbol-collage': `conic-gradient(from ${angle}deg at 32% 38%, ${accent}, ${surface} 22%, ${accentSecondary} 23% 46%, ${surfaceSubtle} 47% 72%, ${accent})`,
    'distressed-stack': `repeating-linear-gradient(${angle}deg, ${background} 0 9px, ${surface} 10px 18px, ${accent} 19px 22px)`,
    'fractured-panels': `linear-gradient(135deg, ${accent} 0 25%, transparent 26%),linear-gradient(315deg, ${accentSecondary} 0 30%, ${background} 31%)`,
    'material-layers': `radial-gradient(circle at 72% 24%, ${accent} 0 10%, transparent 11%),linear-gradient(145deg, ${surface} 0 55%, ${surfaceSubtle} 56%)`,
    'dimensional-mesh': `radial-gradient(circle at 30% 30%, ${accent} 0, transparent 38%),radial-gradient(circle at 72% 70%, ${accentSecondary} 0, ${background} 48%)`,
    'print-relief': `repeating-radial-gradient(circle at 18% 18%, ${accent} 0 1px, transparent 2px 7px),${background}`,
    'optical-stage': `repeating-radial-gradient(circle at 50% 50%, ${accent} 0 5px, ${background} 6px 12px, ${accentSecondary} 13px 15px)`,
    'broadcast-grid': `linear-gradient(${angle}deg, transparent 0 58%, ${accent} 59% 70%, transparent 71%),repeating-linear-gradient(90deg, ${background} 0 18px, ${surface} 19px 36px)`,
    'editorial-ledger': `repeating-linear-gradient(90deg, ${background} 0 29%, ${surfaceSubtle} 30% 31%, ${surface} 32% 63%)`,
    'tactile-editorial': `radial-gradient(ellipse at 28% 65%, ${accent} 0 17%, transparent 18%),linear-gradient(${angle}deg, ${surfaceSubtle}, ${background} 54%)`,
    'portal-frame': `repeating-linear-gradient(0deg, ${surface} 0 18px, ${surfaceSubtle} 19px 21px),linear-gradient(90deg, ${accent}, ${accentSecondary})`,
    'glossy-window': `linear-gradient(180deg, #FFFFFF 0 5%, transparent 30%),linear-gradient(145deg, ${accent}, ${accentSecondary})`,
    'chrome-pop': `radial-gradient(ellipse at 50% 20%, #FFFFFF 0 3%, ${accent} 8%, transparent 34%),linear-gradient(${angle}deg, ${background}, ${accentSecondary})`,
    'terminal-hud': `repeating-linear-gradient(0deg, transparent 0 7px, ${surface} 8px 9px),linear-gradient(90deg, ${background}, ${accent}33)`,
    'data-stream': `linear-gradient(165deg, transparent 0 52%, ${accent} 53% 57%, transparent 58%),repeating-linear-gradient(90deg, ${background} 0 14px, ${surface} 15px 29px)`,
    'spatial-orbit': `radial-gradient(circle at 50% 50%, ${surface} 0 16%, transparent 17% 30%, ${accent} 31% 34%, transparent 35%),${background}`,
    'soft-toy': `radial-gradient(circle at 28% 32%, ${accent} 0 20%, transparent 21%),radial-gradient(circle at 70% 66%, ${accentSecondary} 0 24%, ${background} 25%)`,
    'crafted-soft': `linear-gradient(${angle}deg, ${surface} 0 42%, ${surfaceSubtle} 43% 68%, ${accent} 69%)`,
    'playful-organic': `radial-gradient(ellipse at 20% 80%, ${accent} 0 26%, transparent 27%),radial-gradient(ellipse at 82% 20%, ${accentSecondary} 0 20%, ${background} 21%)`
  };
  return patterns[blueprint.grammarId] || background;
}

function renderThumbnail(blueprint) {
  const [, surface, , accent, accentSecondary] = blueprint.colors;
  const label = escapeHtml(blueprint.name.en);
  const index = String(blueprint.order / 10).padStart(3, '0');

  return `
    <div class="style-thumb thumb-e120-${blueprint.id}" data-motif="p120-${blueprint.id}"
         data-grammar="${blueprint.grammarId}" data-variant="${blueprint.variant}"
         style="position:relative;isolation:isolate;overflow:hidden;display:grid;align-content:space-between;width:100%;height:100%;min-height:76px;padding:9px;background:${motifBackground(blueprint)};color:${surface};border:2px solid ${accent};font-family:Arial,sans-serif">
      <span aria-hidden="true" style="position:absolute;inset:${6 + blueprint.variant * 2}px;border:1px solid ${accentSecondary};opacity:.72;z-index:-1;transform:rotate(${blueprint.variant * 2 - 3}deg)"></span>
      <b style="font-size:9px;letter-spacing:.12em;text-transform:uppercase;text-shadow:0 1px 2px #000">${escapeHtml(blueprint.grammarId)} · ${index}</b>
      <strong style="max-width:92%;font-size:${11 + blueprint.variant}px;line-height:1.02;text-transform:uppercase;text-shadow:0 1px 3px #000">${label}</strong>
    </div>`;
}

export const EXPANSION_THUMBNAIL_DEFINITIONS = Object.freeze(
  EXPANSION_PREVIEW_BLUEPRINTS.map(blueprint => Object.freeze({
    id: `p120-${blueprint.id}`,
    assetPaths: EMPTY_ASSET_PATHS,
    render() {
      return renderThumbnail(blueprint);
    }
  }))
);
