import { EXPANSION_PREVIEW_BLUEPRINTS } from '../catalog/packs/expansion/index.js';

const EMPTY_ASSET_PATHS = Object.freeze([]);

function renderThumbnail(blueprint) {
  const [background, surface, subtle, accent, secondary] = blueprint.colors;
  // 이름은 바깥 label에서 읽고, 작은 thumbnail은 도형과 재질만 전달한다.
  return `<div class="style-thumb thumb-e120-${blueprint.id}" data-motif="p120-${blueprint.id}"
    data-grammar="${blueprint.grammarId}" data-variant="${blueprint.variant}"
    style="background:${background};--ta:${accent};--tb:${secondary};--ts:${surface};--tu:${subtle}">
    <span class="thumb-composition" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
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
