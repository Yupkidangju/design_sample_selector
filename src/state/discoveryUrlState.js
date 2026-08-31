import {
  parseDiscoverySearch,
  serializeDiscoverySearch
} from '../catalog/discoveryUrl.js';

function canBind(stateManager, browserWindow) {
  return Boolean(
    stateManager?.getState
      && stateManager?.setState
      && stateManager?.subscribe
      && browserWindow?.location
      && browserWindow?.history?.replaceState
      && browserWindow?.addEventListener
      && browserWindow?.removeEventListener
  );
}

export function bindDiscoveryUrlState(stateManager, browserWindow = globalThis.window) {
  if (!canBind(stateManager, browserWindow)) return () => {};

  let applyingUrl = true;
  let disposed = false;
  let pendingPopstateTimer = null;
  stateManager.setState(parseDiscoverySearch(browserWindow.location.search));
  applyingUrl = false;

  const writeCurrentUrl = state => {
    if (applyingUrl) return;
    const search = serializeDiscoverySearch(state);
    if (search === browserWindow.location.search) return;

    const nextUrl = `${browserWindow.location.pathname}${search}${browserWindow.location.hash || ''}`;
    browserWindow.history.replaceState(browserWindow.history.state, '', nextUrl);
  };

  const unsubscribe = stateManager.subscribe(state => writeCurrentUrl(state));
  const handlePopState = () => {
    if (pendingPopstateTimer !== null) clearTimeout(pendingPopstateTimer);
    pendingPopstateTimer = setTimeout(() => {
      pendingPopstateTimer = null;
      if (disposed) return;
      applyingUrl = true;
      try {
        stateManager.setState(parseDiscoverySearch(browserWindow.location.search));
      } finally {
        applyingUrl = false;
      }
      writeCurrentUrl(stateManager.getState());
    }, 0);
  };

  browserWindow.addEventListener('popstate', handlePopState);
  return () => {
    disposed = true;
    if (pendingPopstateTimer !== null) {
      clearTimeout(pendingPopstateTimer);
      pendingPopstateTimer = null;
    }
    unsubscribe();
    browserWindow.removeEventListener('popstate', handlePopState);
  };
}
