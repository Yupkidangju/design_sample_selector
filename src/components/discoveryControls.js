import { updateFacetSelection } from '../catalog/index.js';
import { appState } from '../state/appState.js';
import { synthAudio } from '../audio/synthAudio.js';
import { renderDiscoveryControlsHTML } from './discoveryMarkup.js';

function hasDiscoveryStateChanged(state, previous) {
  return (
    state.currentView !== previous?.currentView
    || state.searchQuery !== previous?.searchQuery
    || state.activeFilter !== previous?.activeFilter
    || state.activeFacets !== previous?.activeFacets
    || state.sortMode !== previous?.sortMode
    || state.bookmarkFilterActive !== previous?.bookmarkFilterActive
    || state.bookmarks !== previous?.bookmarks
  );
}

function clearFacet(selections, facetId) {
  let next = selections;
  for (const valueId of selections?.[facetId] || []) {
    next = updateFacetSelection(next, facetId, valueId, false);
  }
  return next;
}

export function renderDiscoveryControls(container) {
  if (!container) return;

  let panelOpen = false;
  const openFacetIds = new Set();
  let pendingFocusId = null;

  function rememberDisclosureState() {
    const panel = container.querySelector('.discovery-filter-panel');
    if (panel) panelOpen = panel.open;
    container.querySelectorAll('[data-facet-group]').forEach(details => {
      const facetId = details.getAttribute('data-facet-group');
      if (details.open) openFacetIds.add(facetId);
      else openFacetIds.delete(facetId);
    });
  }

  function setState(partial, focusId) {
    pendingFocusId = focusId || null;
    appState.setState(partial);
  }

  function restoreFocus() {
    if (!pendingFocusId) return;
    const target = container.querySelector(`#${pendingFocusId}`);
    pendingFocusId = null;
    target?.focus({ preventScroll: true });
  }

  function bindControls() {
    const panel = container.querySelector('.discovery-filter-panel');
    panel?.addEventListener('toggle', () => { panelOpen = panel.open; });

    container.querySelectorAll('[data-facet-group]').forEach(details => {
      details.addEventListener('toggle', () => {
        const facetId = details.getAttribute('data-facet-group');
        if (details.open) openFacetIds.add(facetId);
        else openFacetIds.delete(facetId);
      });
    });

    const sort = container.querySelector('#discovery-sort');
    sort?.addEventListener('change', () => {
      synthAudio.playSfx('CLICK');
      setState({ sortMode: sort.value }, 'discovery-sort');
    });

    container.querySelector('#discovery-reset')?.addEventListener('click', () => {
      synthAudio.playSfx('CLICK');
      setState({
        searchQuery: '',
        activeFilter: 'ALL',
        activeFacets: {},
        sortMode: 'catalog',
        bookmarkFilterActive: false
      }, 'discovery-panel-toggle');
    });

    container.querySelectorAll('[data-facet-id]').forEach(input => {
      input.addEventListener('change', () => {
        const facetId = input.getAttribute('data-facet-id');
        const valueId = input.value;
        const current = appState.getState().activeFacets || {};
        const next = valueId
          ? updateFacetSelection(current, facetId, valueId, input.checked)
          : clearFacet(current, facetId);
        synthAudio.playSfx('CLICK');
        setState({ activeFacets: next }, input.id);
      });
    });

    container.querySelectorAll('[data-clear-key]').forEach(button => {
      button.addEventListener('click', () => {
        const key = button.getAttribute('data-clear-key');
        const partial = key === 'query'
          ? { searchQuery: '' }
          : key === 'category'
            ? { activeFilter: 'ALL' }
            : { bookmarkFilterActive: false };
        synthAudio.playSfx('CLICK');
        setState(partial, 'discovery-panel-toggle');
      });
    });

    container.querySelectorAll('[data-remove-facet]').forEach(button => {
      button.addEventListener('click', () => {
        const facetId = button.getAttribute('data-remove-facet');
        const valueId = button.getAttribute('data-remove-value');
        const next = updateFacetSelection(
          appState.getState().activeFacets,
          facetId,
          valueId,
          false
        );
        synthAudio.playSfx('CLICK');
        setState({ activeFacets: next }, 'discovery-panel-toggle');
      });
    });
  }

  function update() {
    rememberDisclosureState();
    const state = appState.getState();
    container.hidden = state.currentView !== 'MAIN';
    if (container.hidden) return;

    container.innerHTML = renderDiscoveryControlsHTML(state, { panelOpen, openFacetIds });
    bindControls();
    restoreFocus();
  }

  appState.subscribe((state, previous) => {
    if (hasDiscoveryStateChanged(state, previous)) update();
  });

  update();
}
