import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const stylesheet = [
  new URL('../index.css', import.meta.url),
  new URL('../src/styles/interactive.css', import.meta.url),
  new URL('../src/styles/wave1-styles.css', import.meta.url),
  new URL('../src/styles/wave1-preview.css', import.meta.url)
]
  .map((file) => readFileSync(file, 'utf8'))
  .join('\n')
  .replace(/\/\*[\s\S]*?\*\//g, '');

function declarationsFor(selector) {
  return [...stylesheet.matchAll(/([^{}]+)\{([^{}]+)\}/g)]
    .filter(([, selectors]) => selectors.split(',').map((value) => value.trim()).includes(selector))
    .map(([, , declarations]) => declarations);
}

function hasDeclaration(selector, declarationPattern) {
  return declarationsFor(selector).some((declarations) => declarationPattern.test(declarations));
}

test('mobile sandbox constrains the current archetype preview to a phone width', () => {
  const widths = declarationsFor('.mockup-viewport.mobile .archetype-unit')
    .map((declarations) => declarations.match(/max-width\s*:\s*(\d+)px(?:\s*!important)?\s*;/)?.[1])
    .filter(Boolean)
    .map(Number);

  assert.ok(
    widths.some((width) => width <= 400),
    'Mobile mode must cap .archetype-unit at a phone-sized width'
  );
});

test('mobile sandbox applies compact layouts independently of the browser window width', () => {
  assert.ok(
    hasDeclaration('.mockup-viewport.mobile .web-nav-links', /display\s*:\s*none\s*;/),
    'Mobile mode must collapse desktop SaaS navigation'
  );
  assert.ok(
    hasDeclaration('.mockup-viewport.mobile .shop-product-layout', /grid-template-columns\s*:\s*(?:minmax\(0,\s*)?1fr\)?\s*;/),
    'Mobile mode must stack the storefront product layout'
  );
  assert.ok(
    hasDeclaration('.mockup-viewport.mobile .dash-table-wrapper', /overflow-x\s*:\s*auto\s*;/),
    'Mobile mode must contain wide dashboard tables'
  );
  assert.ok(
    hasDeclaration('.mockup-viewport.mobile .archetype-chat', /grid-template-columns\s*:\s*(?:minmax\(0,\s*)?1fr\)?\s*;/),
    'Mobile mode must collapse the chat layout to one column'
  );
});

test('Wave 1의 12종 root·thumbnail·motion은 전용 CSS 구현을 가진다', () => {
  const styleIds = [
    'bauhaus-geometry', 'de-stijl', 'flat-design', 'constructivist',
    'punk-zine', 'material-design', 'liquid-glass', 'art-deco',
    'psychedelic-poster', 'art-nouveau', 'risograph', 'metro-interface'
  ];
  const motionIds = [
    'shape-orbit', 'plane-reveal', 'color-snap', 'diagonal-drive',
    'xerox-jitter', 'paper-lift', 'lens-shift', 'fan-reveal',
    'poster-warp', 'vine-trace', 'ink-drift', 'tile-panorama'
  ];

  for (const id of styleIds) {
    assert.ok(declarationsFor(`.w1-${id}-unit`).length > 0, `${id} root CSS`);
    assert.ok(declarationsFor(`.thumb-w1-${id}`).length > 0, `${id} thumbnail CSS`);
  }
  for (const id of motionIds) {
    assert.ok(declarationsFor(`.fx-layer.fx-${id}`).length > 0, `${id} effect CSS`);
  }
});

test('Wave 1 CSS는 sandbox mobile과 reduced-motion 상태를 명시한다', () => {
  assert.ok(
    hasDeclaration('.mockup-viewport.mobile .w1-metro-interface-unit', /grid-template-columns\s*:\s*1fr\s*;/),
    'Metro mobile preview must collapse to one column'
  );
  assert.match(stylesheet, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*motion-shape-orbit/u);
});
