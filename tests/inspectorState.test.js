import assert from 'node:assert/strict';
import test from 'node:test';

import { getAllSubDesigns } from '../src/data/categories.js';
import {
  createInspectorArtifacts,
  createDefaultInspectorUiState,
  resolveInspectorContext
} from '../src/utils/inspectorState.js';

const ALL_SUB_DESIGNS = getAllSubDesigns();

test('inspector context resolves the latest selected theme at event time', () => {
  const state = {
    selectedSubCategory: 'swiss-grid',
    activeArchetype: 'web',
    sandboxDevice: 'desktop',
    liveTweaks: { borderRadius: 4 }
  };

  assert.equal(resolveInspectorContext(state, ALL_SUB_DESIGNS).subDesign.id, 'swiss-grid');

  state.selectedSubCategory = 'corporate-minimal';
  const currentContext = resolveInspectorContext(state, ALL_SUB_DESIGNS);
  assert.equal(currentContext.subDesign.id, 'corporate-minimal');
  assert.equal(currentContext.archetype, 'web');
  assert.equal(currentContext.liveTweaks.borderRadius, 4);
});

test('each modal entry receives a fresh default inspector UI state', () => {
  const previousState = createDefaultInspectorUiState();
  previousState.activeTab = 'json';
  previousState.activeCssMode = 'tokens';

  const reopenedState = createDefaultInspectorUiState();
  assert.deepEqual(reopenedState, { activeTab: 'css', activeCssMode: 'full' });
  assert.notEqual(reopenedState, previousState);
});

test('inspector context rejects a missing selected theme', () => {
  assert.equal(resolveInspectorContext({ selectedSubCategory: 'missing-theme' }, ALL_SUB_DESIGNS), null);
});

test('all four tabs and three CSS modes derive from the latest selected theme', () => {
  const previousState = {
    selectedSubCategory: 'swiss-grid',
    activeArchetype: 'web',
    sandboxDevice: 'desktop',
    liveTweaks: ALL_SUB_DESIGNS.find(design => design.id === 'swiss-grid').defaultTweaks
  };
  const previousArtifacts = createInspectorArtifacts(
    previousState,
    ALL_SUB_DESIGNS,
    '<div data-theme="swiss-grid"></div>'
  );
  assert.equal(
    JSON.parse(previousArtifacts.json).$extensions['com.design-sample-selector'].id,
    'swiss-grid'
  );

  const currentDesign = ALL_SUB_DESIGNS.find(design => design.id === 'corporate-minimal');
  const currentState = {
    ...previousState,
    selectedSubCategory: currentDesign.id,
    liveTweaks: currentDesign.defaultTweaks
  };
  const artifacts = createInspectorArtifacts(
    currentState,
    ALL_SUB_DESIGNS,
    '<div data-theme="corporate-minimal"></div>'
  );

  Object.values(artifacts.css).forEach(css => assert.doesNotMatch(css, /swiss-grid/));
  assert.match(artifacts.css.full, /data-theme="corporate-minimal"/);
  assert.match(artifacts.css.tokens, /data-theme="corporate-minimal"/);
  assert.match(artifacts.css.component, /\.web-nav-header/);
  assert.match(artifacts.html, /data-theme="corporate-minimal"/);
  assert.match(artifacts.markdown, new RegExp(currentDesign.name));
  assert.doesNotMatch(artifacts.markdown, new RegExp(currentDesign.nameEn));
  assert.equal(JSON.parse(artifacts.json).$extensions['com.design-sample-selector'].id, 'corporate-minimal');
});
