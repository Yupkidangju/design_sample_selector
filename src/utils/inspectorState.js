import {
  generateLiveCSSSnippet,
  generateLiveDesignSpecMarkdown,
  generateLiveTokensJSON
} from './designSpecGenerator.js';

export function createDefaultInspectorUiState() {
  return {
    activeTab: 'css',
    activeCssMode: 'full'
  };
}

export function resolveInspectorContext(state, subDesigns) {
  if (!state || !Array.isArray(subDesigns)) return null;
  const subDesign = subDesigns.find(design => design.id === state.selectedSubCategory);
  if (!subDesign) return null;

  return {
    subDesign,
    archetype: state.activeArchetype || 'game',
    componentTab: state.activeComponentTab || 'hero',
    device: state.sandboxDevice || 'desktop',
    liveTweaks: state.liveTweaks || subDesign.defaultTweaks || {}
  };
}

export function createInspectorArtifacts(state, subDesigns, html = '') {
  const context = resolveInspectorContext(state, subDesigns);
  if (!context) return null;
  const { subDesign, archetype, device, liveTweaks } = context;

  return {
    context,
    css: {
      full: generateLiveCSSSnippet(subDesign, liveTweaks, archetype, 'full'),
      tokens: generateLiveCSSSnippet(subDesign, liveTweaks, archetype, 'tokens'),
      component: generateLiveCSSSnippet(subDesign, liveTweaks, archetype, 'component')
    },
    html,
    markdown: generateLiveDesignSpecMarkdown(subDesign, liveTweaks, archetype, device),
    json: generateLiveTokensJSON(subDesign, liveTweaks)
  };
}
