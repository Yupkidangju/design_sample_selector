import {
  generateLiveCSSSnippet,
  generateLiveDesignSpecMarkdown,
  generateLiveTokensJSON
} from './designSpecGenerator.js';
import { getActiveLocaleSnapshot } from '../i18n/index.js';

export function createDefaultInspectorUiState() {
  return {
    activeTab: 'css',
    activeCssMode: 'full'
  };
}

export function resolveInspectorContext(state, subDesigns, localeSnapshot = getActiveLocaleSnapshot()) {
  if (!state || !Array.isArray(subDesigns)) return null;
  const subDesign = subDesigns.find(design => design.id === state.selectedSubCategory);
  if (!subDesign) return null;

  return {
    subDesign,
    archetype: state.activeArchetype || 'game',
    componentTab: state.activeComponentTab || 'hero',
    device: state.sandboxDevice || 'desktop',
    liveTweaks: state.liveTweaks || subDesign.defaultTweaks || {},
    locale: state.locale || 'ko',
    localeEpoch: localeSnapshot?.epoch || 0,
    localeSnapshot
  };
}

export function createInspectorArtifacts(state, subDesigns, html = '', localeSnapshot = getActiveLocaleSnapshot()) {
  const context = resolveInspectorContext(state, subDesigns, localeSnapshot);
  if (!context) return null;
  const { subDesign, archetype, device, liveTweaks, localeSnapshot: snapshot, localeEpoch } = context;

  return {
    context,
    css: {
      full: generateLiveCSSSnippet(subDesign, liveTweaks, archetype, 'full', snapshot),
      tokens: generateLiveCSSSnippet(subDesign, liveTweaks, archetype, 'tokens', snapshot),
      component: generateLiveCSSSnippet(subDesign, liveTweaks, archetype, 'component', snapshot)
    },
    html,
    markdown: generateLiveDesignSpecMarkdown(subDesign, liveTweaks, archetype, device, snapshot),
    json: generateLiveTokensJSON(subDesign, liveTweaks, snapshot),
    epoch: localeEpoch
  };
}
