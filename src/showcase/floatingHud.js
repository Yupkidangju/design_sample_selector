/**
 * 독립 쇼케이스 하단 접이식 미니 플로팅 스튜디오 바 + 네이티브 <dialog> 스펙 서랍
 * - 하단 KO/EN 및 서랍 KO/EN 모두 쇼케이스 화면 + HUD + 서랍 + AI 프롬프트를 즉시 전환한다.
 * - 재렌더 시 포커스와 서랍 스크롤 위치를 모두 보존한다.
 */

import { SHOWCASE_DOMAINS } from '../data/domains.js';
import { getLocalizedStyleView } from '../data/showcaseEn.js';
import { STYLES_20, getAdjacentStyles } from '../data/styles20.js';
import { UI_COPY } from '../data/uiCopy.js';
import {
  generateCssTokensBlock,
  generateDesignsMarkdown,
  generateVibePrompt
} from '../prompt/vibePromptGenerator.js';
import { copyText, downloadTextFile } from '../utils/clipboard.js';
import { escapeHtml } from '../utils/escape.js';

export function renderFloatingHud(hudRoot, drawerEl, state, handlers) {
  const { style, domainId, promptLang, hudCollapsed } = state;
  const safeLang = promptLang === 'en' ? 'en' : 'ko';
  const hudCopy = UI_COPY[safeLang].hud;
  const view = getLocalizedStyleView(style, safeLang);
  const { prev, next } = getAdjacentStyles(style.id);

  let hudFocusSelector = null;
  if (hudRoot.contains(document.activeElement)) {
    const active = document.activeElement;
    if (active.dataset.hudLang) {
      hudFocusSelector = `[data-hud-lang="${active.dataset.hudLang}"]`;
    } else if (active.dataset.hudDomain) {
      hudFocusSelector = `[data-hud-domain="${active.dataset.hudDomain}"]`;
    }
  }

  if (hudCollapsed) {
    hudRoot.innerHTML = `
      <div class="studio-hud is-collapsed" role="region" aria-label="${escapeHtml(hudCopy.openStudio)}">
        <button type="button" class="studio-pill-btn is-accent" data-hud-expand aria-label="${escapeHtml(hudCopy.openStudio)}">
          <span>${escapeHtml(style.number)} ${escapeHtml(view.displayName)}</span>
          <strong>${escapeHtml(hudCopy.openStudio)}</strong>
        </button>
      </div>
    `;
    hudRoot.querySelector('[data-hud-expand]')?.addEventListener('click', () => {
      handlers.onToggleCollapse(false);
    });
  } else {
    const prevName = safeLang === 'en' ? prev.nameEn : prev.nameKo;
    const nextName = safeLang === 'en' ? next.nameEn : next.nameKo;

    hudRoot.innerHTML = `
      <div class="studio-hud" role="region" aria-label="${safeLang === 'en' ? 'Floating studio controls' : '스튜디오 플로팅 컨트롤 바'}">
        <div class="studio-hud-group studio-hud-nav">
          <a class="studio-icon-btn" href="./index.html" title="${escapeHtml(hudCopy.galleryAria)}" aria-label="${escapeHtml(hudCopy.galleryAria)}">
            ${escapeHtml(hudCopy.gallery)}
          </a>
          <button type="button" class="studio-icon-btn" data-hud-style="${escapeHtml(prev.id)}" title="${escapeHtml(`${hudCopy.prevStyle}: ${prevName} ([)`)}" aria-label="${escapeHtml(hudCopy.prevStyle)}">
            ‹
          </button>
          <label class="studio-select-wrap">
            <span class="sr-only">${escapeHtml(hudCopy.styleSelectAria)}</span>
            <select class="studio-select" data-hud-style-select aria-label="${escapeHtml(hudCopy.styleSelectAria)}">
              ${STYLES_20.map(item => `
                <option value="${escapeHtml(item.id)}" ${item.id === style.id ? 'selected' : ''}>
                  ${escapeHtml(item.number)} · ${escapeHtml(safeLang === 'en' ? item.nameEn : item.nameKo)}
                </option>
              `).join('')}
            </select>
          </label>
          <button type="button" class="studio-icon-btn" data-hud-style="${escapeHtml(next.id)}" title="${escapeHtml(`${hudCopy.nextStyle}: ${nextName} (])`)}" aria-label="${escapeHtml(hudCopy.nextStyle)}">
            ›
          </button>
        </div>

        <div class="studio-hud-group studio-hud-domains" role="tablist" aria-label="${escapeHtml(hudCopy.domainsAria)}">
          ${SHOWCASE_DOMAINS.map(domain => `
            <button type="button"
                    role="tab"
                    class="studio-domain-btn ${domain.id === domainId ? 'is-active' : ''}"
                    aria-selected="${domain.id === domainId ? 'true' : 'false'}"
                    data-hud-domain="${escapeHtml(domain.id)}"
                    title="${escapeHtml(safeLang === 'en' ? domain.enLabel : domain.fullLabel)} (${domain.shortcut})">
              ${escapeHtml(hudCopy.domains[domain.id] || domain.label)}
            </button>
          `).join('')}
        </div>

        <div class="studio-hud-group studio-hud-actions">
          <div class="studio-lang-toggle" role="group" aria-label="${escapeHtml(hudCopy.langAria)}">
            <button type="button" class="studio-lang-btn ${safeLang === 'ko' ? 'is-active' : ''}" data-hud-lang="ko" aria-pressed="${safeLang === 'ko'}">KO</button>
            <button type="button" class="studio-lang-btn ${safeLang === 'en' ? 'is-active' : ''}" data-hud-lang="en" aria-pressed="${safeLang === 'en'}">EN</button>
          </div>
          <button type="button" class="studio-primary-btn" data-hud-copy-prompt>
            ${escapeHtml(hudCopy.copyPrompt)}
          </button>
          <button type="button" class="studio-ghost-btn" data-hud-open-drawer aria-haspopup="dialog" aria-controls="studio-spec-drawer">
            ${escapeHtml(hudCopy.specGuide)}
          </button>
          <button type="button" class="studio-icon-btn" data-hud-collapse title="${escapeHtml(hudCopy.collapse)}" aria-label="${escapeHtml(hudCopy.collapse)}">
            ✕
          </button>
        </div>
      </div>
    `;

    hudRoot.querySelectorAll('[data-hud-style]').forEach(btn => {
      btn.addEventListener('click', () => handlers.onSelectStyle(btn.dataset.hudStyle));
    });
    hudRoot.querySelector('[data-hud-style-select]')?.addEventListener('change', event => {
      handlers.onSelectStyle(event.target.value);
    });
    hudRoot.querySelectorAll('[data-hud-domain]').forEach(btn => {
      btn.addEventListener('click', () => handlers.onSelectDomain(btn.dataset.hudDomain));
    });
    hudRoot.querySelectorAll('[data-hud-lang]').forEach(btn => {
      btn.addEventListener('click', () => handlers.onSelectLang(btn.dataset.hudLang));
    });
    hudRoot.querySelector('[data-hud-copy-prompt]')?.addEventListener('click', () => {
      const promptText = generateVibePrompt(style, { domainId, lang: safeLang });
      const msg = safeLang === 'en'
        ? `Copied ${style.nameEn} AI Prompt (EN)!`
        : `${style.nameKo} AI 프롬프트(KO) 복사됨!`;
      copyText(promptText, msg);
    });
    hudRoot.querySelector('[data-hud-open-drawer]')?.addEventListener('click', () => {
      handlers.onOpenDrawer();
    });
    hudRoot.querySelector('[data-hud-collapse]')?.addEventListener('click', () => {
      handlers.onToggleCollapse(true);
    });

    if (hudFocusSelector && !drawerEl?.open) {
      hudRoot.querySelector(hudFocusSelector)?.focus({ preventScroll: true });
    }
  }

  renderSpecDrawerContent(drawerEl, state, handlers);
}

export function renderSpecDrawerContent(drawerEl, state, handlers) {
  if (!drawerEl) return;
  const { style, domainId, promptLang } = state;
  const safeLang = promptLang === 'en' ? 'en' : 'ko';
  const drawerCopy = UI_COPY[safeLang].drawer;
  const view = getLocalizedStyleView(style, safeLang);
  const wasOpen = Boolean(drawerEl.open);
  const prevScrollTop = wasOpen ? (drawerEl.querySelector('.studio-drawer-body')?.scrollTop ?? 0) : 0;

  let focusSelector = null;
  if (wasOpen && drawerEl.contains(document.activeElement)) {
    const active = document.activeElement;
    if (active.dataset.drawerLang) {
      focusSelector = `[data-drawer-lang="${active.dataset.drawerLang}"]`;
    } else if (active.hasAttribute('data-drawer-close')) {
      focusSelector = '[data-drawer-close]';
    } else if (active.hasAttribute('data-drawer-copy-css')) {
      focusSelector = '[data-drawer-copy-css]';
    } else if (active.hasAttribute('data-drawer-download-md')) {
      focusSelector = '[data-drawer-download-md]';
    }
  }

  const promptText = generateVibePrompt(style, { domainId, lang: safeLang });
  const cssTokens = generateCssTokensBlock(style, { lang: safeLang });
  const philosophy = safeLang === 'en' ? style.dna.philosophyEn : style.dna.philosophyKo;
  const dos = safeLang === 'en' ? style.dna.dosEn : style.dna.dosKo;
  const donts = safeLang === 'en' ? style.dna.dontsEn : style.dna.dontsKo;
  const monoLabel = style.fonts.monoName || 'JetBrains Mono';

  drawerEl.innerHTML = `
    <div class="studio-drawer-sheet">
      <header class="studio-drawer-header">
        <div>
          <p class="studio-drawer-kicker">STYLE ${escapeHtml(style.number)} · ${escapeHtml(style.nameEn)}</p>
          <h2 class="studio-drawer-title">${escapeHtml(view.displayName)}</h2>
        </div>
        <button type="button" class="studio-icon-btn" data-drawer-close aria-label="${escapeHtml(drawerCopy.closeAria)}" ${wasOpen ? '' : 'autofocus'}>
          ✕
        </button>
      </header>

      <div class="studio-drawer-body">
        <!-- 1. 디자인 정체성 -->
        <section class="studio-drawer-section">
          <h3>${escapeHtml(drawerCopy.dnaTitle)} (${safeLang.toUpperCase()})</h3>
          <p class="studio-drawer-prose" data-drawer-philosophy>${escapeHtml(philosophy)}</p>
          <div class="studio-trait-pills">
            ${view.traits.map(trait => `<span>${escapeHtml(trait)}</span>`).join('')}
          </div>
        </section>

        <!-- 2. 팔레트 1클릭 복사 -->
        <section class="studio-drawer-section">
          <h3>${escapeHtml(drawerCopy.paletteTitle)} <small>${escapeHtml(drawerCopy.paletteHint)}</small></h3>
          <div class="studio-palette-grid">
            ${style.palette.map(swatch => `
              <button type="button" class="studio-swatch-btn" data-drawer-hex="${escapeHtml(swatch.hex)}">
                <span class="studio-swatch-chip" style="background:${escapeHtml(swatch.hex)}"></span>
                <span class="studio-swatch-meta">
                  <strong>${escapeHtml(safeLang === 'en' ? (swatch.roleEn || swatch.role) : swatch.role)}</strong>
                  <code>${escapeHtml(swatch.hex)}</code>
                </span>
              </button>
            `).join('')}
          </div>
        </section>

        <!-- 3. 서체 조합 -->
        <section class="studio-drawer-section">
          <h3>${escapeHtml(drawerCopy.typographyTitle)}</h3>
          <div class="studio-font-box">
            <div><span>Display</span><strong>${escapeHtml(style.fonts.displayName)}</strong></div>
            <div><span>Body</span><strong>${escapeHtml(style.fonts.bodyName)}</strong></div>
            <div><span>Mono</span><strong data-drawer-mono>${escapeHtml(monoLabel)}</strong></div>
          </div>
        </section>

        <!-- 4. AI 품질 가드레일 -->
        <section class="studio-drawer-section">
          <h3>${escapeHtml(drawerCopy.guardrailsTitle)}</h3>
          <div class="studio-guardrails">
            <ul class="studio-do-list">
              ${dos.map(item => `<li><strong>DO</strong> ${escapeHtml(item)}</li>`).join('')}
            </ul>
            <ul class="studio-dont-list">
              ${donts.map(item => `<li><strong>DON'T</strong> ${escapeHtml(item)}</li>`).join('')}
            </ul>
          </div>
        </section>

        <!-- 5. AI 바이브 코딩 프롬프트 전문 -->
        <section class="studio-drawer-section">
          <div class="studio-section-bar">
            <h3>${escapeHtml(drawerCopy.promptTitle)} (${safeLang.toUpperCase()})</h3>
            <div class="studio-inline-actions" role="group" aria-label="${escapeHtml(UI_COPY[safeLang].hud.langAria)}">
              <button type="button" class="studio-lang-btn ${safeLang === 'ko' ? 'is-active' : ''}" data-drawer-lang="ko" aria-pressed="${safeLang === 'ko'}">KO</button>
              <button type="button" class="studio-lang-btn ${safeLang === 'en' ? 'is-active' : ''}" data-drawer-lang="en" aria-pressed="${safeLang === 'en'}">EN</button>
              <button type="button" class="studio-mini-btn" data-drawer-copy-prompt>${escapeHtml(drawerCopy.copy)}</button>
            </div>
          </div>
          <pre class="studio-code-block"><code>${escapeHtml(promptText)}</code></pre>
        </section>

        <!-- 6. CSS 변수 토큰 -->
        <section class="studio-drawer-section">
          <div class="studio-section-bar">
            <h3>${escapeHtml(drawerCopy.cssTitle)}</h3>
            <button type="button" class="studio-mini-btn" data-drawer-copy-css>${escapeHtml(drawerCopy.copyCss)}</button>
          </div>
          <pre class="studio-code-block is-compact"><code>${escapeHtml(cssTokens)}</code></pre>
        </section>
      </div>

      <footer class="studio-drawer-footer">
        <button type="button" class="studio-primary-btn" data-drawer-copy-prompt>${escapeHtml(drawerCopy.copyPromptBtn)}</button>
        <button type="button" class="studio-ghost-btn" data-drawer-download-md>${escapeHtml(drawerCopy.downloadMd)}</button>
      </footer>
    </div>
  `;

  drawerEl.querySelector('[data-drawer-close]')?.addEventListener('click', () => drawerEl.close());

  drawerEl.querySelectorAll('[data-drawer-hex]').forEach(btn => {
    btn.addEventListener('click', () => {
      const hex = btn.dataset.drawerHex;
      if (hex) copyText(hex, UI_COPY[safeLang].web.hexToast(hex));
    });
  });

  drawerEl.querySelectorAll('[data-drawer-lang]').forEach(btn => {
    btn.addEventListener('click', () => handlers.onSelectLang(btn.dataset.drawerLang));
  });

  drawerEl.querySelectorAll('[data-drawer-copy-prompt]').forEach(btn => {
    btn.addEventListener('click', () => {
      const msg = safeLang === 'en'
        ? `Copied ${style.nameEn} AI Prompt (EN)!`
        : `${style.nameKo} AI 프롬프트(KO) 복사됨!`;
      copyText(promptText, msg);
    });
  });

  drawerEl.querySelector('[data-drawer-copy-css]')?.addEventListener('click', () => {
    const msg = safeLang === 'en'
      ? `Copied ${style.nameEn} CSS tokens!`
      : `${style.nameKo} CSS 변수 토큰 복사됨!`;
    copyText(cssTokens, msg);
  });

  drawerEl.querySelector('[data-drawer-download-md]')?.addEventListener('click', () => {
    const markdown = generateDesignsMarkdown(style, { domainId });
    downloadTextFile(`designs-${style.id}.md`, markdown);
  });

  if (wasOpen) {
    const drawerBody = drawerEl.querySelector('.studio-drawer-body');
    if (drawerBody) drawerBody.scrollTop = prevScrollTop;
    if (focusSelector) {
      drawerEl.querySelector(focusSelector)?.focus({ preventScroll: true });
    }
  }
}
