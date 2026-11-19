/**
 * 도메인 1: 웹 랜딩 · 제품 서비스 풀페이지 쇼케이스 렌더러 (KO / EN 네이티브 전환 지원)
 */

import { getLocalizedStyleView } from '../data/showcaseEn.js';
import { UI_COPY } from '../data/uiCopy.js';
import { escapeHtml } from '../utils/escape.js';
import { renderStyleArtwork } from './domainArtwork.js';

export function renderWebDomain(style, lang = 'ko') {
  const safeLang = lang === 'en' ? 'en' : 'ko';
  const view = getLocalizedStyleView(style, safeLang);
  const copy = UI_COPY[safeLang].web;
  const web = view.showcase.web;
  const heroArt = renderStyleArtwork(style.id, 'hero');

  return `
    <div class="domain-shell domain-web">
      <!-- 상단 내비게이션 -->
      <header class="web-nav">
        <div class="web-nav-inner">
          <div class="web-brand">
            <span class="web-brand-num">${escapeHtml(style.number)}</span>
            <span class="web-brand-name">${escapeHtml(web.brand)}</span>
          </div>
          <nav class="web-nav-links" aria-label="${safeLang === 'en' ? 'Showcase navigation' : '쇼케이스 샘플 내비게이션'}">
            ${web.nav.map((label, index) => `
              <button type="button" class="web-nav-link ${index === 0 ? 'is-active' : ''}" data-demo-action="nav" data-demo-label="${escapeHtml(label)}">
                ${escapeHtml(label)}
              </button>
            `).join('')}
          </nav>
          <button type="button" class="ds-btn ds-btn-primary web-nav-cta" data-demo-action="cta" data-demo-label="${escapeHtml(web.primaryCta)}">
            ${escapeHtml(web.primaryCta)}
          </button>
        </div>
      </header>

      <!-- 메인 히어로 섹션 -->
      <section class="web-hero">
        <div class="web-hero-grid">
          <div class="web-hero-copy">
            <p class="ds-kicker">${escapeHtml(web.kicker)}</p>
            <h1 class="web-hero-title">${escapeHtml(web.title)}</h1>
            <p class="web-hero-subtitle">${escapeHtml(web.subtitle)}</p>

            <div class="web-hero-actions">
              <button type="button" class="ds-btn ds-btn-primary ds-btn-lg" data-demo-action="cta" data-demo-label="${escapeHtml(web.primaryCta)}">
                ${escapeHtml(web.primaryCta)}
              </button>
              <button type="button" class="ds-btn ds-btn-secondary ds-btn-lg" data-demo-action="cta" data-demo-label="${escapeHtml(web.secondaryCta)}">
                ${escapeHtml(web.secondaryCta)}
              </button>
            </div>

            <div class="web-metrics-strip">
              ${web.metrics.map(metric => `
                <div class="web-metric-cell">
                  <span class="web-metric-label">${escapeHtml(metric.label)}</span>
                  <strong class="web-metric-val">${escapeHtml(metric.value)}</strong>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="web-hero-visual ds-card">
            <div class="web-visual-frame">
              ${heroArt}
            </div>
            <div class="web-visual-caption">
              <span>${escapeHtml(style.nameEn)}</span>
              <span class="web-visual-tags">${view.traits.map(t => escapeHtml(t)).join(' · ')}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 핵심 특징 3열 섹션 -->
      <section class="web-section">
        <div class="web-section-head">
          <div>
            <p class="ds-kicker">DESIGN SYSTEM PRINCIPLES</p>
            <h2 class="web-section-title">${escapeHtml(copy.principlesHeading(view.displayName))}</h2>
          </div>
          <p class="web-section-desc">${escapeHtml(view.tagline)}</p>
        </div>

        <div class="web-features-grid">
          ${web.features.map((feat, idx) => `
            <article class="ds-card web-feature-card ${idx === 1 ? 'is-accent-card' : ''}">
              <span class="web-feature-num">${escapeHtml(feat.num)}</span>
              <h3 class="web-feature-title">${escapeHtml(feat.title)}</h3>
              <p class="web-feature-desc">${escapeHtml(feat.desc)}</p>
            </article>
          `).join('')}
        </div>
      </section>

      <!-- 실전 인터랙티브 컴포넌트 & 폼 쇼케이스 -->
      <section class="web-section web-interactive-section">
        <div class="web-interactive-grid">
          <div class="ds-card web-form-card">
            <div class="web-card-head">
              <p class="ds-kicker">INTERACTIVE FORM SPECIMEN</p>
              <h3 class="web-card-title">${escapeHtml(copy.formTitle)}</h3>
            </div>
            <form class="web-demo-form" data-demo-form>
              <label class="ds-field">
                <span>${escapeHtml(copy.projectLabel)}</span>
                <input type="text" class="ds-input" name="projectName" value="${escapeHtml(`${web.brand} ${copy.projectSuffix}`)}" />
              </label>
              <div class="web-form-row">
                <label class="ds-field">
                  <span>${escapeHtml(copy.platformLabel)}</span>
                  <select class="ds-input" name="platform">
                    <option value="web">${escapeHtml(copy.platforms[0])}</option>
                    <option value="mobile">${escapeHtml(copy.platforms[1])}</option>
                    <option value="game">${escapeHtml(copy.platforms[2])}</option>
                  </select>
                </label>
                <label class="ds-field">
                  <span>${escapeHtml(copy.densityLabel)}</span>
                  <select class="ds-input" name="density">
                    <option value="balanced">${escapeHtml(copy.densities[0])}</option>
                    <option value="editorial">${escapeHtml(copy.densities[1])}</option>
                    <option value="compact">${escapeHtml(copy.densities[2])}</option>
                  </select>
                </label>
              </div>
              <div class="web-toggle-row">
                <button type="button" class="ds-chip is-active" data-demo-chip aria-pressed="true">${escapeHtml(view.traits[0])}</button>
                <button type="button" class="ds-chip" data-demo-chip aria-pressed="false">${escapeHtml(view.traits[1])}</button>
                <button type="button" class="ds-chip" data-demo-chip aria-pressed="false">${escapeHtml(view.traits[2])}</button>
              </div>
              <div class="web-form-footer">
                <button type="submit" class="ds-btn ds-btn-primary">${escapeHtml(copy.submitBtn)}</button>
                <span class="web-form-status" data-form-status aria-live="polite">${escapeHtml(copy.formHint)}</span>
              </div>
            </form>
          </div>

          <div class="ds-card web-palette-card">
            <div class="web-card-head">
              <p class="ds-kicker">PALETTE & TYPOGRAPHY DNA</p>
              <h3 class="web-card-title">${escapeHtml(copy.paletteTitle)}</h3>
            </div>
            <div class="web-type-specimen">
              <div class="web-type-aa">${escapeHtml(copy.typeSample)}</div>
              <div class="web-type-meta">
                <strong>${escapeHtml(style.fonts.displayName)}</strong>
                <span>Body: ${escapeHtml(style.fonts.bodyName)} · Polarity: ${style.polarity.toUpperCase()}</span>
              </div>
            </div>
            <div class="web-swatch-list">
              ${style.palette.map(swatch => `
                <button type="button" class="web-swatch-item" data-copy-hex="${escapeHtml(swatch.hex)}" title="${escapeHtml(copy.clickHexTitle(swatch.hex))}">
                  <span class="web-swatch-dot" style="background:${escapeHtml(swatch.hex)}"></span>
                  <span class="web-swatch-role">${escapeHtml(safeLang === 'en' ? (swatch.roleEn || swatch.role) : swatch.role)}</span>
                  <code class="web-swatch-hex">${escapeHtml(swatch.hex)}</code>
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      </section>

      <footer class="web-footer">
        <span>${escapeHtml(web.brand)} · ${escapeHtml(view.displayName)} (${escapeHtml(style.id)})</span>
        <span>DESIGN SPECTRUM 3.0 STANDALONE SHOWCASE</span>
      </footer>
    </div>
  `;
}
