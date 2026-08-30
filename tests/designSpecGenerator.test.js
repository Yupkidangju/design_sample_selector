import assert from 'node:assert/strict';
import test from 'node:test';

import { getArchetypeHTML } from '../src/components/archetypeTemplates.js';
import { getAllSubDesigns } from '../src/data/categories.js';
import {
  generateLiveCSSSnippet,
  generateLiveTokensJSON
} from '../src/utils/designSpecGenerator.js';

const ALL_SUB_DESIGNS = getAllSubDesigns();
const SAMPLE_DESIGN = ALL_SUB_DESIGNS[0];

const ARCHETYPE_SELECTOR_CONTRACT = {
  game: '.game-hud-header',
  web: '.web-nav-header',
  mobile: '.mobile-notif-card',
  ecommerce: '.add-to-cart-btn',
  blog: '.blog-progress-fill',
  dashboard: '.metric-card',
  media: '.vinyl-disc',
  chat: '.chat-bubble-msg.user'
};

function htmlContainsSelector(html, selector) {
  const requiredClasses = selector.split('.').filter(Boolean);
  const classValues = Array.from(html.matchAll(/class="([^"]+)"/g), match => match[1].split(/\s+/));
  return classValues.some(classes => requiredClasses.every(className => classes.includes(className)));
}

function extractClassNames(value) {
  return new Set(Array.from(value.matchAll(/\.(-?[_a-zA-Z]+[\w-]*)/g), match => match[1]));
}

function assertDimension(value, label) {
  assert.equal(typeof value, 'object', `${label} dimension must be an object`);
  assert.equal(typeof value.value, 'number', `${label}.value must be numeric`);
  assert.ok(['px', 'rem'].includes(value.unit), `${label}.unit must be px or rem`);
}

function assertColor(value, label) {
  assert.equal(value.colorSpace, 'srgb', `${label}.colorSpace must be srgb`);
  assert.equal(value.components.length, 3, `${label}.components must contain RGB values`);
  value.components.forEach(component => {
    assert.equal(typeof component, 'number', `${label} components must be numbers`);
    assert.ok(component >= 0 && component <= 1, `${label} components must be normalized`);
  });
  if ('alpha' in value) {
    assert.ok(value.alpha >= 0 && value.alpha <= 1, `${label}.alpha must be normalized`);
  }
}

function assertToken(token, path) {
  switch (token.$type) {
    case 'color':
      assertColor(token.$value, path);
      break;
    case 'gradient':
      assert.ok(Array.isArray(token.$value) && token.$value.length >= 2, `${path} must contain gradient stops`);
      token.$value.forEach((stop, index) => {
        assertColor(stop.color, `${path}[${index}].color`);
        assert.equal(typeof stop.position, 'number', `${path}[${index}].position must be numeric`);
        assert.ok(stop.position >= 0 && stop.position <= 1, `${path}[${index}].position must be normalized`);
      });
      break;
    case 'dimension':
      assertDimension(token.$value, path);
      break;
    case 'fontFamily':
      assert.ok(
        typeof token.$value === 'string' ||
          (Array.isArray(token.$value) &&
            token.$value.length > 0 &&
            token.$value.every(value => typeof value === 'string')),
        `${path} must be a font name or ordered font list`
      );
      break;
    case 'number':
      assert.equal(typeof token.$value, 'number', `${path} must be numeric`);
      break;
    case 'shadow': {
      const shadows = Array.isArray(token.$value) ? token.$value : [token.$value];
      assert.ok(shadows.length > 0, `${path} must contain at least one shadow`);
      shadows.forEach((shadow, index) => {
        assertColor(shadow.color, `${path}[${index}].color`);
        ['offsetX', 'offsetY', 'blur', 'spread'].forEach(key => {
          assertDimension(shadow[key], `${path}[${index}].${key}`);
        });
      });
      break;
    }
    default:
      assert.fail(`${path} uses unsupported DTCG type: ${token.$type}`);
  }
}

function assertDtcgGroup(group, path = 'root') {
  const allowedDollarProperties = new Set([
    '$value',
    '$type',
    '$description',
    '$extensions',
    '$deprecated',
    '$extends',
    '$root'
  ]);

  Object.entries(group).forEach(([key, value]) => {
    if (key.startsWith('$')) {
      assert.ok(allowedDollarProperties.has(key), `${path}.${key} is not a reserved DTCG property`);
      return;
    }
    if (!value || typeof value !== 'object' || Array.isArray(value)) return;
    if ('$value' in value) {
      assert.equal(typeof value.$type, 'string', `${path}.${key} must declare a type`);
      assertToken(value, `${path}.${key}`);
    } else {
      assertDtcgGroup(value, `${path}.${key}`);
    }
  });
}

function collectTokenTypes(group, observedTypes) {
  Object.entries(group).forEach(([key, value]) => {
    if (key.startsWith('$') || !value || typeof value !== 'object' || Array.isArray(value)) return;
    if ('$value' in value) observedTypes.add(value.$type);
    else collectTokenTypes(value, observedTypes);
  });
}

test('generated component CSS selectors exist in every archetype HTML template', () => {
  Object.entries(ARCHETYPE_SELECTOR_CONTRACT).forEach(([archetype, selector]) => {
    const html = getArchetypeHTML(archetype, SAMPLE_DESIGN, { tab: 'hero' });
    const css = generateLiveCSSSnippet(SAMPLE_DESIGN, SAMPLE_DESIGN.defaultTweaks, archetype, 'component');
    const htmlClassNames = new Set(
      Array.from(html.matchAll(/class="([^"]+)"/g), match => match[1].split(/\s+/)).flat()
    );

    assert.ok(htmlContainsSelector(html, selector), `${archetype} HTML must contain ${selector}`);
    assert.match(css, new RegExp(selector.replaceAll('.', '\\.'), 'u'), `${archetype} CSS must style ${selector}`);
    extractClassNames(css).forEach(className => {
      assert.ok(htmlClassNames.has(className), `${archetype} CSS selector .${className} must exist in its HTML`);
    });
  });
});

test('all 120 token documents follow the DTCG 2025.10 reserved properties and value shapes', () => {
  assert.equal(ALL_SUB_DESIGNS.length, 120);
  const observedTypes = new Set();

  ALL_SUB_DESIGNS.forEach(subDesign => {
    const document = JSON.parse(generateLiveTokensJSON(subDesign, subDesign.defaultTweaks));

    assert.equal('$schema' in document, false, 'DTCG 2025.10 does not publish a JSON Schema property');
    assert.equal(document.$extensions?.['com.design-sample-selector']?.id, subDesign.id);
    assertDtcgGroup(document);
    collectTokenTypes(document, observedTypes);
  });

  ['color', 'gradient', 'dimension', 'fontFamily', 'number', 'shadow'].forEach(type => {
    assert.ok(observedTypes.has(type), `120-theme fixtures must exercise the ${type} conversion policy`);
  });
});

test('CSS shadow none is exported as a valid transparent zero DTCG shadow', () => {
  const design = ALL_SUB_DESIGNS.find(subDesign => subDesign.id === 'de-stijl');

  assert.ok(design);
  const document = JSON.parse(generateLiveTokensJSON(design, design.defaultTweaks));

  assert.equal(document.effect.shadow.$type, 'shadow');
  assert.deepEqual(document.effect.shadow.$value, {
    color: {
      colorSpace: 'srgb',
      components: [0, 0, 0],
      alpha: 0,
      hex: '#000000'
    },
    offsetX: { value: 0, unit: 'px' },
    offsetY: { value: 0, unit: 'px' },
    blur: { value: 0, unit: 'px' },
    spread: { value: 0, unit: 'px' }
  });
});
