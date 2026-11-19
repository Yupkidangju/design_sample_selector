/**
 * 도메인 2: 모바일 앱 듀얼 스크린 플래그십 쇼케이스 렌더러 (KO / EN 네이티브 전환 지원)
 */

import { getLocalizedStyleView } from '../data/showcaseEn.js';
import { UI_COPY } from '../data/uiCopy.js';
import { escapeHtml } from '../utils/escape.js';
import { renderStyleArtwork } from './domainArtwork.js';

export function renderMobileDomain(style, lang = 'ko') {
  const safeLang = lang === 'en' ? 'en' : 'ko';
  const view = getLocalizedStyleView(style, safeLang);
  const copy = UI_COPY[safeLang].mobile;
  const mobile = view.showcase.mobile;
  const art = renderStyleArtwork(style.id, 'hero');

  return `
    <div class="domain-shell domain-mobile">
      <header class="mobile-stage-header">
        <div>
          <p class="ds-kicker">MOBILE DUAL-SCREEN SHOWCASE · ${escapeHtml(style.number)}</p>
          <h1 class="mobile-stage-title">${escapeHtml(copy.stageTitle(view.displayName))}</h1>
          <p class="mobile-stage-sub">${escapeHtml(view.domainTips.mobile)}</p>
        </div>
        <div class="mobile-view-switch" role="group" aria-label="${safeLang === 'en' ? 'Mobile view layout' : '모바일 스크린 보기 모드'}">
          <button type="button" class="ds-btn ds-btn-primary is-active" data-mobile-screen="both" aria-pressed="true">${escapeHtml(copy.viewModes.both)}</button>
          <button type="button" class="ds-btn ds-btn-secondary" data-mobile-screen="primary" aria-pressed="false">${escapeHtml(copy.viewModes.primary)}</button>
          <button type="button" class="ds-btn ds-btn-secondary" data-mobile-screen="detail" aria-pressed="false">${escapeHtml(copy.viewModes.detail)}</button>
        </div>
      </header>

      <div class="mobile-pair-grid" data-mobile-mode="both">
        <!-- 스크린 1: 메인 홈 피드 & 내비게이션 -->
        <section class="phone-chassis" data-phone-pane="primary" aria-label="${safeLang === 'en' ? 'Primary mobile screen' : '모바일 메인 화면'}">
          <div class="phone-status-bar">
            <span class="phone-time">09:41</span>
            <span class="phone-notch" aria-hidden="true"></span>
            <span class="phone-signals">5G · 94%</span>
          </div>

          <div class="phone-body">
            <div class="phone-top-bar">
              <div>
                <p class="phone-kicker">${escapeHtml(mobile.greeting)}</p>
                <h2 class="phone-app-title">${escapeHtml(mobile.appName)}</h2>
              </div>
              <span class="phone-avatar">${escapeHtml(style.number)}</span>
            </div>

            <div class="ds-card phone-hero-card">
              <div class="phone-hero-art">${art}</div>
              <div class="phone-hero-copy">
                <strong class="phone-hero-title">${escapeHtml(mobile.primaryCardTitle)}</strong>
                <span class="phone-hero-meta">${escapeHtml(mobile.primaryCardMeta)}</span>
              </div>
            </div>

            <div class="phone-section-label">
              <span>${escapeHtml(copy.activityHeading)}</span>
              <span>${escapeHtml(copy.itemCount(mobile.items.length))}</span>
            </div>

            <div class="phone-list">
              ${mobile.items.map((item, idx) => `
                <button type="button" class="ds-card phone-list-item ${idx === 0 ? 'is-selected' : ''}" data-mobile-item="${idx}">
                  <span class="phone-item-tag">${escapeHtml(item.tag)}</span>
                  <span class="phone-item-title">${escapeHtml(item.title)}</span>
                  <span class="phone-item-status">${escapeHtml(item.status)}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <nav class="phone-tab-bar" aria-label="${safeLang === 'en' ? 'Mobile tab bar' : '모바일 하단 탭'}">
            ${copy.tabs.map((label, idx) => `
              <button type="button" class="phone-tab ${idx === 0 ? 'is-active' : ''}" data-phone-tab="${idx}">${escapeHtml(label)}</button>
            `).join('')}
          </nav>
        </section>

        <!-- 스크린 2: 상세 컨트롤 & 인터랙티브 바텀 시트 -->
        <section class="phone-chassis" data-phone-pane="detail" aria-label="${safeLang === 'en' ? 'Control sheet screen' : '모바일 상세 제어 화면'}">
          <div class="phone-status-bar">
            <span class="phone-time">09:41</span>
            <span class="phone-notch" aria-hidden="true"></span>
            <span class="phone-signals">SYNC</span>
          </div>

          <div class="phone-body">
            <div class="phone-top-bar">
              <div>
                <p class="phone-kicker">CONTROL SHEET</p>
                <h2 class="phone-app-title">${escapeHtml(mobile.detailTitle)}</h2>
              </div>
              <span class="phone-badge">${escapeHtml(style.specimen.badge)}</span>
            </div>

            <div class="ds-card phone-meter-card">
              <div class="phone-meter-head">
                <span>${escapeHtml(copy.intensity)}</span>
                <strong data-mobile-meter-val>78%</strong>
              </div>
              <div class="phone-meter-track">
                <div class="phone-meter-fill" data-mobile-meter-fill style="width: 78%"></div>
              </div>
              <div class="phone-preset-row">
                <button type="button" class="ds-chip" data-mobile-preset="42">${escapeHtml(copy.presets[0])}</button>
                <button type="button" class="ds-chip is-active" data-mobile-preset="78">${escapeHtml(copy.presets[1])}</button>
                <button type="button" class="ds-chip" data-mobile-preset="100">${escapeHtml(copy.presets[2])}</button>
              </div>
            </div>

            <div class="phone-toggles">
              ${view.traits.map((trait, idx) => `
                <div class="ds-card phone-toggle-row">
                  <div>
                    <strong class="phone-toggle-title">${escapeHtml(trait)}</strong>
                    <span class="phone-toggle-sub">${escapeHtml(mobile.detailSub)}</span>
                  </div>
                  <button type="button" class="phone-switch ${idx < 2 ? 'is-on' : ''}" role="switch" aria-checked="${idx < 2 ? 'true' : 'false'}" data-mobile-switch aria-label="${escapeHtml(trait)}">
                    <span class="phone-switch-knob"></span>
                  </button>
                </div>
              `).join('')}
            </div>

            <div class="phone-sheet-footer">
              <button type="button" class="ds-btn ds-btn-primary phone-cta-full" data-demo-action="cta" data-demo-label="${escapeHtml(copy.applyToastLabel(mobile.appName))}">
                ${escapeHtml(copy.applyBtn)}
              </button>
            </div>
          </div>

          <div class="phone-home-indicator" aria-hidden="true"></div>
        </section>
      </div>
    </div>
  `;
}
