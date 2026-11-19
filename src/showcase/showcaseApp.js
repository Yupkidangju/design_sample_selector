/**
 * 독립 풀스크린 쇼케이스 앱 엔트리포인트 (showcase.html)
 * 갤러리 CSS와 100% 격리되어, 선택된 스타일을 100vw × 100vh로 렌더링한다.
 */

import { getDomainById, resolveDomainId } from '../data/domains.js';
import { getAdjacentStyles, resolveStyle } from '../data/styles20.js';
import { generateVibePrompt } from '../prompt/vibePromptGenerator.js';
import { copyText, showToast } from '../utils/clipboard.js';
import { renderDashboardDomain } from './domainDashboard.js';
import { renderGameDomain } from './domainGame.js';
import { renderMobileDomain } from './domainMobile.js';
import { renderWebDomain } from './domainWeb.js';
import { renderFloatingHud } from './floatingHud.js';
import { bindDomainInteractions } from './showcaseInteractions.js';

export function renderDomainMarkup(style, domainId) {
  switch (domainId) {
    case 'mobile':
      return renderMobileDomain(style);
    case 'game':
      return renderGameDomain(style);
    case 'dashboard':
      return renderDashboardDomain(style);
    case 'web':
    default:
      return renderWebDomain(style);
  }
}

export function initShowcaseApp() {
  const stageEl = document.getElementById('showcase-stage');
  const hudEl = document.getElementById('studio-hud-root');
  const drawerEl = document.getElementById('studio-spec-drawer');
  if (!stageEl || !hudEl || !drawerEl) return;

  const params = new URLSearchParams(window.location.search);
  const { style: initialStyle, wasFallback } = resolveStyle(params.get('style'));
  const initialDomain = resolveDomainId(params.get('domain'));

  const state = {
    style: initialStyle,
    domainId: initialDomain,
    promptLang: 'ko',
    hudCollapsed: false
  };

  function syncUrl() {
    const url = new URL(window.location.href);
    url.searchParams.set('style', state.style.id);
    url.searchParams.set('domain', state.domainId);
    window.history.replaceState(null, '', url.toString());
  }

  function applyStyleVariables(style) {
    document.body.dataset.style = style.id;
    document.body.dataset.polarity = style.polarity;
    document.body.dataset.domain = state.domainId;

    const rootStyle = stageEl.style;
    rootStyle.setProperty('--font-display', style.fonts.display);
    rootStyle.setProperty('--font-body', style.fonts.body);
    rootStyle.setProperty('--font-mono', style.fonts.mono);
    for (const [key, value] of Object.entries(style.cssVars)) {
      rootStyle.setProperty(key, value);
    }

    const domain = getDomainById(state.domainId);
    document.title = `${style.number} ${style.nameKo} — ${domain.label} | DESIGN SPECTRUM 3.0`;
  }

  const handlers = {
    onSelectStyle(nextStyleId) {
      const { style } = resolveStyle(nextStyleId);
      state.style = style;
      syncUrl();
      paintStage();
      paintHud();
      window.scrollTo({ top: 0, behavior: 'instant' });
    },
    onSelectDomain(nextDomainId) {
      state.domainId = resolveDomainId(nextDomainId);
      syncUrl();
      paintStage();
      paintHud();
      window.scrollTo({ top: 0, behavior: 'instant' });
    },
    onSelectLang(nextLang) {
      state.promptLang = nextLang === 'en' ? 'en' : 'ko';
      paintHud();
    },
    onToggleCollapse(collapsed) {
      state.hudCollapsed = Boolean(collapsed);
      paintHud();
    },
    onOpenDrawer() {
      if (typeof drawerEl.showModal === 'function' && !drawerEl.open) {
        drawerEl.showModal();
      }
    }
  };

  function paintStage() {
    applyStyleVariables(state.style);
    stageEl.dataset.style = state.style.id;
    stageEl.dataset.domain = state.domainId;
    stageEl.innerHTML = renderDomainMarkup(state.style, state.domainId);
    bindDomainInteractions(stageEl, state.style);
  }

  function paintHud() {
    renderFloatingHud(hudEl, drawerEl, state, handlers);
  }

  // 네이티브 dialog 백드롭 클릭 닫기
  drawerEl.addEventListener('click', event => {
    if (event.target === drawerEl) drawerEl.close();
  });

  // 키보드 단축키: 모달 서랍이 열려 있을 때는 배경 스테이지 단축키를 차단하고 g/Escape만 허용한다.
  document.addEventListener('keydown', event => {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    const key = event.key.toLowerCase();
    if (drawerEl.open) {
      if (key === 'g') {
        event.preventDefault();
        drawerEl.close();
      }
      return;
    }

    if (key === '1') handlers.onSelectDomain('web');
    else if (key === '2') handlers.onSelectDomain('mobile');
    else if (key === '3') handlers.onSelectDomain('game');
    else if (key === '4') handlers.onSelectDomain('dashboard');
    else if (key === '[') handlers.onSelectStyle(getAdjacentStyles(state.style.id).prev.id);
    else if (key === ']') handlers.onSelectStyle(getAdjacentStyles(state.style.id).next.id);
    else if (key === 'g') handlers.onOpenDrawer();
    else if (key === 'c') {
      const prompt = generateVibePrompt(state.style, {
        domainId: state.domainId,
        lang: state.promptLang
      });
      copyText(prompt, `${state.style.nameKo} AI 프롬프트(${state.promptLang.toUpperCase()}) 복사됨!`);
    } else if (state.domainId === 'game' && ['q', 'w', 'e', 'r'].includes(key)) {
      const skillIndex = ['q', 'w', 'e', 'r'].indexOf(key);
      const skillBtns = stageEl.querySelectorAll('[data-game-skill]');
      skillBtns[skillIndex]?.click();
    }
  });

  syncUrl();
  paintStage();
  paintHud();

  if (wasFallback) {
    showToast('요청한 스타일을 찾을 수 없어 기본 스타일(01 스위스 그리드)로 열었습니다.');
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShowcaseApp, { once: true });
  } else {
    initShowcaseApp();
  }
}
