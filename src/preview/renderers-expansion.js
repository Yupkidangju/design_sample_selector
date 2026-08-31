import { EXPANSION_PREVIEW_BLUEPRINTS } from '../catalog/packs/expansion/index.js';
import { EXPANSION_GRAMMARS } from '../catalog/packs/expansion/authoring.js';
import { PREVIEW_COMPONENT_TABS } from './contract.js';

const EMPTY_ASSET_PATHS = Object.freeze([]);

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function action(label, message) {
  return `<button type="button" class="e120-action" data-mock-action="toast" data-mock-msg="${escapeHtml(message)}">${escapeHtml(label)}</button>`;
}

function localizedPreview(blueprint, design) {
  return {
    name: design?.name || blueprint.name.ko,
    summary: design?.shortDesc || blueprint.summary.ko,
    motif: design?.characteristics?.at(-1) || blueprint.motif
  };
}

function artwork(blueprint, motif) {
  const layout = EXPANSION_GRAMMARS[blueprint.grammarId].layout;
  const motifLabel = escapeHtml(motif);
  const common = `<i></i><i></i><i></i><i></i>`;
  const content = {
    grid: `${common}<b>01</b><b>02</b>`,
    axis: `<i></i><b>↑</b><span>00 / ${blueprint.variant + 1}</span>`,
    symbols: `${common}<b>+</b><span>Aa</span>`,
    stack: `<span>RAW</span><span>TYPE</span><span>MATTER</span><i></i>`,
    fracture: `${common}<b>ERROR / SIGNAL</b>`,
    layers: `<i></i><i></i><i></i><span>DEPTH ${blueprint.variant + 1}</span>`,
    mesh: `${common}<span>XYZ</span>`,
    relief: `<b>PRESS</b><i></i><span>EDITION ${blueprint.variant + 1}</span>`,
    optical: `${common}<b>∞</b>`,
    broadcast: `<span>LIVE</span><i></i><b>CH ${blueprint.variant + 2}</b><i></i>`,
    ledger: `<b>VOL. ${blueprint.variant + 1}</b><i></i><i></i><span>ARCHIVE</span>`,
    tactile: `<i></i><i></i><b>FIELD NOTE</b><span>№ ${blueprint.order}</span>`,
    portal: `<b>WELCOME</b><span>[ HOME ]</span><span>[ INDEX ]</span><span>[ LINKS ]</span>`,
    window: `<header><b>● ● ●</b><span>workspace</span></header><i></i><i></i>`,
    chrome: `<b>★</b><span>ONLINE</span><i></i><i></i>`,
    terminal: `<b>&gt; SYSTEM_READY</b><span>0${blueprint.variant + 4}:2${blueprint.variant}</span><i></i><i></i>`,
    data: `<b>${84 + blueprint.variant * 3}%</b><i></i><i></i><span>LIVE / Δ +${blueprint.variant + 2}.4</span>`,
    spatial: `<i></i><i></i><i></i><b>FOCUS</b>`,
    toy: `<i></i><i></i><i></i><b>${blueprint.variant + 1}</b>`,
    craft: `<i></i><i></i><span>made by hand</span><b>✦</b>`,
    organic: `<i></i><i></i><i></i><b>HELLO!</b>`
  }[layout];

  return `<div class="e120-art e120-art-${layout}" aria-hidden="true" title="${motifLabel}">${content}</div>`;
}

function renderHero(blueprint, preview) {
  return `
    <section class="e120-copy e120-copy-hero">
      <p class="e120-kicker">${escapeHtml(blueprint.grammarId)} / ${String(blueprint.order / 10).padStart(3, '0')}</p>
      <h2>${escapeHtml(preview.name)}</h2>
      <p>${escapeHtml(preview.summary)}</p>
      <div class="e120-actions">${action('EXPLORE SYSTEM', `${blueprint.name.en} opened`)}<a href="#e120-note-${blueprint.id}">VIEW PRINCIPLE</a></div>
    </section>`;
}

function renderWidget(blueprint) {
  const values = [64 + blueprint.variant * 7, 18 + blueprint.variant * 5, 92 - blueprint.variant * 4];
  return `
    <section class="e120-copy e120-copy-widget" aria-labelledby="e120-widget-${blueprint.id}">
      <header><p class="e120-kicker">LIVE FIELD / ${escapeHtml(blueprint.name.en)}</p><h3 id="e120-widget-${blueprint.id}">Signal overview</h3></header>
      <div class="e120-metrics"><article><span>FLOW</span><strong>${values[0]}%</strong></article><article><span>NODES</span><strong>${values[1]}</strong></article><article><span>CLARITY</span><strong>${values[2]}</strong></article></div>
      <div class="e120-meter"><i style="width:${values[0]}%"></i></div>
      ${action('REFRESH FIELD', `${blueprint.name.en} metrics refreshed`)}
    </section>`;
}

function renderForm(blueprint) {
  return `
    <section class="e120-copy e120-copy-form">
      <p class="e120-kicker">BUILD WITH ${escapeHtml(blueprint.name.en)}</p>
      <h3>Compose a new direction</h3>
      <div class="e120-fields"><label>PROJECT<input type="text" value="Signal ${blueprint.variant + 1}" /></label><label>INTENSITY<select><option>Balanced</option><option>Quiet</option><option>Expressive</option></select></label></div>
      <label class="e120-check"><input type="checkbox" checked /> Keep accessible contrast</label>
      ${action('CREATE DIRECTION', `${blueprint.name.en} direction created`)}
    </section>`;
}

function renderPricing(blueprint) {
  const price = 18 + blueprint.variant * 6;
  return `
    <section class="e120-copy e120-copy-pricing">
      <p class="e120-kicker">${escapeHtml(blueprint.grammarId)} EDITION</p>
      <h3>${escapeHtml(blueprint.name.en)}</h3>
      <p class="e120-price"><strong>$${price}</strong><span>/ project</span></p>
      <ul><li>4 component views</li><li>Responsive token set</li><li>Motion-safe patterns</li></ul>
      ${action('SELECT EDITION', `${blueprint.name.en} edition selected`)}
    </section>`;
}

function renderExpansionPreview(blueprint, tab, design) {
  const preview = localizedPreview(blueprint, design);
  const body = tab === 'widget'
    ? renderWidget(blueprint)
    : tab === 'form'
      ? renderForm(blueprint)
      : tab === 'pricing'
        ? renderPricing(blueprint)
        : renderHero(blueprint, preview);

  return `
    <div class="mockup-unit e120-unit e120-${blueprint.id}-unit" data-preview-tab="${tab}"
         data-expansion-style="${blueprint.id}" data-grammar="${blueprint.grammarId}" data-variant="${blueprint.variant}">
      <header class="e120-unit-header"><span>${escapeHtml(preview.name)}</span><b>${escapeHtml(EXPANSION_GRAMMARS[blueprint.grammarId].label)}</b></header>
      <div class="e120-stage">${artwork(blueprint, preview.motif)}${body}</div>
      <footer id="e120-note-${blueprint.id}"><span>${escapeHtml(preview.motif)}</span><b>${String(blueprint.variant + 1).padStart(2, '0')} / 04</b></footer>
    </div>`;
}

export const EXPANSION_RENDERER_DEFINITIONS = Object.freeze(
  EXPANSION_PREVIEW_BLUEPRINTS.map(blueprint => Object.freeze({
    id: blueprint.id,
    aliases: EMPTY_ASSET_PATHS,
    tabs: PREVIEW_COMPONENT_TABS,
    assetPaths: EMPTY_ASSET_PATHS,
    render(tab, design) {
      return renderExpansionPreview(blueprint, tab, design);
    }
  }))
);
