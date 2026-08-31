import {
  parseDiscoverySearch,
  serializeDiscoverySearch
} from '../catalog/discoveryUrl.js';
import { commitLocale } from '../i18n/index.js';

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
  const initial = parseDiscoverySearch(browserWindow.location.search);
  stateManager.setState({ ...initial, locale: stateManager.getState().locale || initial.locale });
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
    pendingPopstateTimer = setTimeout(async () => {
      pendingPopstateTimer = null;
      if (disposed) return;
      applyingUrl = true;
      try {
        const parsed = parseDiscoverySearch(browserWindow.location.search);
        const hasLocaleParam = new URLSearchParams(browserWindow.location.search).has('lang');
        const next = {
          ...parsed,
          locale: hasLocaleParam ? parsed.locale : stateManager.getState().locale
        };
        if (next.locale !== stateManager.getState().locale) {
          try { await commitLocale(next.locale, stateManager, browserWindow); } catch { return; }
        }
        stateManager.setState(next);
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
