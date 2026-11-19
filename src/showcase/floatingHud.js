/**
 * 독립 쇼케이스 하단 접이식 미니 플로팅 스튜디오 바 + 네이티브 <dialog> 스펙 서랍
 * - 서랍 내 언어(KO/EN) 전환 시 스크롤 위치와 버튼 포커스를 보존한다.
 * - 실제 서체명(monoName)과 언어별 시각 DNA 철학을 정확히 동기화한다.
 */

import { SHOWCASE_DOMAINS } from '../data/domains.js';
import { STYLES_20, getAdjacentStyles } from '../data/styles20.js';
import {
  generateCssTokensBlock,
  generateDesignsMarkdown,
  generateVibePrompt
} from '../prompt/vibePromptGenerator.js';
import { copyText, downloadTextFile } from '../utils/clipboard.js';
import { escapeHtml } from '../utils/escape.js';

export function renderFloatingHud(hudRoot, drawerEl, state, handlers) {
  const { style, domainId, promptLang, hudCollapsed } = state;
  const { prev, next } = getAdjacentStyles(style.id);

  if (hudCollapsed) {
    hudRoot.innerHTML = `
      <div class="studio-hud is-collapsed" role="region" aria-label="스튜디오 컨트롤">
        <button type="button" class="studio-pill-btn is-accent" data-hud-expand aria-label="스튜디오 툴바 펼치기">
          <span>${escapeHtml(style.number)} ${escapeHtml(style.nameKo)}</span>
          <strong>스튜디오 열기</strong>
        </button>
      </div>
    `;
    hudRoot.querySelector('[data-hud-expand]')?.addEventListener('click', () => {
      handlers.onToggleCollapse(false);
    });
  } else {
    hudRoot.innerHTML = `
      <div class="studio-hud" role="region" aria-label="스튜디오 플로팅 컨트롤 바">
        <div class="studio-hud-group studio-hud-nav">
          <a class="studio-icon-btn" href="./index.html" title="메인 갤러리로 이동" aria-label="메인 갤러리로 이동">
            ← 갤러리
          </a>
          <button type="button" class="studio-icon-btn" data-hud-style="${escapeHtml(prev.id)}" title="이전 스타일: ${escapeHtml(prev.nameKo)} ([)" aria-label="이전 스타일">
            ‹
          </button>
          <label class="studio-select-wrap">
            <span class="sr-only">디자인 스타일 선택</span>
            <select class="studio-select" data-hud-style-select aria-label="디자인 스타일 선택">
              ${STYLES_20.map(item => `
                <option value="${escapeHtml(item.id)}" ${item.id === style.id ? 'selected' : ''}>
                  ${escapeHtml(item.number)} · ${escapeHtml(item.nameKo)}
                </option>
              `).join('')}
            </select>
          </label>
          <button type="button" class="studio-icon-btn" data-hud-style="${escapeHtml(next.id)}" title="다음 스타일: ${escapeHtml(next.nameKo)} (])" aria-label="다음 스타일">
            ›
          </button>
        </div>

        <div class="studio-hud-group studio-hud-domains" role="tablist" aria-label="적용 도메인 전환">
          ${SHOWCASE_DOMAINS.map(domain => `
            <button type="button"
                    role="tab"
                    class="studio-domain-btn ${domain.id === domainId ? 'is-active' : ''}"
                    aria-selected="${domain.id === domainId ? 'true' : 'false'}"
                    data-hud-domain="${escapeHtml(domain.id)}"
                    title="${escapeHtml(domain.fullLabel)} (단축키 ${domain.shortcut})">
              ${escapeHtml(domain.label)}
            </button>
          `).join('')}
        </div>

        <div class="studio-hud-group studio-hud-actions">
          <div class="studio-lang-toggle" role="group" aria-label="AI 프롬프트 언어">
            <button type="button" class="studio-lang-btn ${promptLang === 'ko' ? 'is-active' : ''}" data-hud-lang="ko" aria-pressed="${promptLang === 'ko'}">KO</button>
            <button type="button" class="studio-lang-btn ${promptLang === 'en' ? 'is-active' : ''}" data-hud-lang="en" aria-pressed="${promptLang === 'en'}">EN</button>
          </div>
          <button type="button" class="studio-primary-btn" data-hud-copy-prompt>
            AI 프롬프트 복사
          </button>
          <button type="button" class="studio-ghost-btn" data-hud-open-drawer aria-haspopup="dialog" aria-controls="studio-spec-drawer">
            스펙 가이드
          </button>
          <button type="button" class="studio-icon-btn" data-hud-collapse title="플로팅 바 접기 (화면 100% 감상)" aria-label="플로팅 바 접기">
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
      const promptText = generateVibePrompt(style, { domainId, lang: promptLang });
      copyText(promptText, `${style.nameKo} AI 프롬프트(${promptLang.toUpperCase()}) 복사됨!`);
    });
    hudRoot.querySelector('[data-hud-open-drawer]')?.addEventListener('click', () => {
      handlers.onOpenDrawer();
    });
    hudRoot.querySelector('[data-hud-collapse]')?.addEventListener('click', () => {
      handlers.onToggleCollapse(true);
    });
  }

  renderSpecDrawerContent(drawerEl, state, handlers);
}

export function renderSpecDrawerContent(drawerEl, state, handlers) {
  if (!drawerEl) return;
  const { style, domainId, promptLang } = state;
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

  const promptText = generateVibePrompt(style, { domainId, lang: promptLang });
  const cssTokens = generateCssTokensBlock(style, { lang: promptLang });
  const philosophy = promptLang === 'en' ? style.dna.philosophyEn : style.dna.philosophyKo;
  const dos = promptLang === 'en' ? style.dna.dosEn : style.dna.dosKo;
  const donts = promptLang === 'en' ? style.dna.dontsEn : style.dna.dontsKo;
  const monoLabel = style.fonts.monoName || 'JetBrains Mono';

  drawerEl.innerHTML = `
    <div class="studio-drawer-sheet">
      <header class="studio-drawer-header">
        <div>
          <p class="studio-drawer-kicker">STYLE ${escapeHtml(style.number)} · ${escapeHtml(style.nameEn)}</p>
          <h2 class="studio-drawer-title">${escapeHtml(style.nameKo)}</h2>
        </div>
        <button type="button" class="studio-icon-btn" data-drawer-close aria-label="스펙 서랍 닫기" ${wasOpen ? '' : 'autofocus'}>
          ✕
        </button>
      </header>

      <div class="studio-drawer-body">
        <!-- 1. 디자인 정체성 -->
        <section class="studio-drawer-section">
          <h3>시각 DNA 요약 (${promptLang.toUpperCase()})</h3>
          <p class="studio-drawer-prose" data-drawer-philosophy>${escapeHtml(philosophy)}</p>
          <div class="studio-trait-pills">
            ${style.traits.map(trait => `<span>${escapeHtml(trait)}</span>`).join('')}
          </div>
        </section>

        <!-- 2. 팔레트 1클릭 복사 -->
        <section class="studio-drawer-section">
          <h3>컬러 팔레트 <small>(클릭 시 코드 복사)</small></h3>
          <div class="studio-palette-grid">
            ${style.palette.map(swatch => `
              <button type="button" class="studio-swatch-btn" data-drawer-hex="${escapeHtml(swatch.hex)}">
                <span class="studio-swatch-chip" style="background:${escapeHtml(swatch.hex)}"></span>
                <span class="studio-swatch-meta">
                  <strong>${escapeHtml(promptLang === 'en' ? (swatch.roleEn || swatch.role) : swatch.role)}</strong>
                  <code>${escapeHtml(swatch.hex)}</code>
                </span>
              </button>
            `).join('')}
          </div>
        </section>

        <!-- 3. 서체 조합 -->
        <section class="studio-drawer-section">
          <h3>타이포그래피</h3>
          <div class="studio-font-box">
            <div><span>Display</span><strong>${escapeHtml(style.fonts.displayName)}</strong></div>
            <div><span>Body</span><strong>${escapeHtml(style.fonts.bodyName)}</strong></div>
            <div><span>Mono</span><strong data-drawer-mono>${escapeHtml(monoLabel)}</strong></div>
          </div>
        </section>

        <!-- 4. AI 품질 가드레일 -->
        <section class="studio-drawer-section">
          <h3>AI 바이브 코딩 가드레일 (DO / DON'T)</h3>
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
            <h3>AI 프롬프트 (${promptLang.toUpperCase()})</h3>
            <div class="studio-inline-actions" role="group" aria-label="서랍 AI 프롬프트 언어">
              <button type="button" class="studio-lang-btn ${promptLang === 'ko' ? 'is-active' : ''}" data-drawer-lang="ko" aria-pressed="${promptLang === 'ko'}">KO</button>
              <button type="button" class="studio-lang-btn ${promptLang === 'en' ? 'is-active' : ''}" data-drawer-lang="en" aria-pressed="${promptLang === 'en'}">EN</button>
              <button type="button" class="studio-mini-btn" data-drawer-copy-prompt>복사</button>
            </div>
          </div>
          <pre class="studio-code-block"><code>${escapeHtml(promptText)}</code></pre>
        </section>

        <!-- 6. CSS 변수 토큰 -->
        <section class="studio-drawer-section">
          <div class="studio-section-bar">
            <h3>CSS 변수 토큰</h3>
            <button type="button" class="studio-mini-btn" data-drawer-copy-css>CSS 복사</button>
          </div>
          <pre class="studio-code-block is-compact"><code>${escapeHtml(cssTokens)}</code></pre>
        </section>
      </div>

      <footer class="studio-drawer-footer">
        <button type="button" class="studio-primary-btn" data-drawer-copy-prompt>AI 프롬프트 복사</button>
        <button type="button" class="studio-ghost-btn" data-drawer-download-md>designs.md 다운로드</button>
      </footer>
    </div>
  `;

  drawerEl.querySelector('[data-drawer-close]')?.addEventListener('click', () => drawerEl.close());

  drawerEl.querySelectorAll('[data-drawer-hex]').forEach(btn => {
    btn.addEventListener('click', () => {
      const hex = btn.dataset.drawerHex;
      if (hex) copyText(hex, `색상 ${hex} 복사됨`);
    });
  });

  drawerEl.querySelectorAll('[data-drawer-lang]').forEach(btn => {
    btn.addEventListener('click', () => handlers.onSelectLang(btn.dataset.drawerLang));
  });

  drawerEl.querySelectorAll('[data-drawer-copy-prompt]').forEach(btn => {
    btn.addEventListener('click', () => {
      copyText(promptText, `${style.nameKo} AI 프롬프트(${promptLang.toUpperCase()}) 복사됨!`);
    });
  });

  drawerEl.querySelector('[data-drawer-copy-css]')?.addEventListener('click', () => {
    copyText(cssTokens, `${style.nameKo} CSS 변수 토큰 복사됨!`);
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
