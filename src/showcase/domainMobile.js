/**
 * 도메인 2: 모바일 앱 듀얼 스크린 플래그십 쇼케이스 렌더러
 * 데스크톱에서는 메인 앱 화면 + 상세/제어 화면 2대를 나란히 배치해 여백 없이 풍성하게 보여준다.
 */

import { escapeHtml } from '../utils/escape.js';
import { renderStyleArtwork } from './domainArtwork.js';

export function renderMobileDomain(style) {
  const mobile = style.showcase.mobile;
  const art = renderStyleArtwork(style.id, 'hero');

  return `
    <div class="domain-shell domain-mobile">
      <header class="mobile-stage-header">
        <div>
          <p class="ds-kicker">MOBILE DUAL-SCREEN SHOWCASE · ${escapeHtml(style.number)}</p>
          <h1 class="mobile-stage-title">${escapeHtml(style.nameKo)} — 모바일 앱 적용</h1>
          <p class="mobile-stage-sub">${escapeHtml(style.dna.domainTipsKo.mobile)}</p>
        </div>
        <div class="mobile-view-switch" role="group" aria-label="모바일 스크린 보기 모드">
          <button type="button" class="ds-btn ds-btn-primary is-active" data-mobile-screen="both" aria-pressed="true">듀얼 보기</button>
          <button type="button" class="ds-btn ds-btn-secondary" data-mobile-screen="primary" aria-pressed="false">홈 화면</button>
          <button type="button" class="ds-btn ds-btn-secondary" data-mobile-screen="detail" aria-pressed="false">제어 시트</button>
        </div>
      </header>

      <div class="mobile-pair-grid" data-mobile-mode="both">
        <!-- 스크린 1: 메인 홈 피드 & 내비게이션 -->
        <section class="phone-chassis" data-phone-pane="primary" aria-label="모바일 메인 화면">
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
              <span>주요 활동</span>
              <span>${mobile.items.length}건</span>
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

          <nav class="phone-tab-bar" aria-label="모바일 하단 탭">
            <button type="button" class="phone-tab is-active" data-phone-tab="home">홈</button>
            <button type="button" class="phone-tab" data-phone-tab="explore">탐색</button>
            <button type="button" class="phone-tab" data-phone-tab="activity">활동</button>
            <button type="button" class="phone-tab" data-phone-tab="profile">프로필</button>
          </nav>
        </section>

        <!-- 스크린 2: 상세 컨트롤 & 인터랙티브 바텀 시트 -->
        <section class="phone-chassis" data-phone-pane="detail" aria-label="모바일 상세 제어 화면">
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
                <span>활성 강도</span>
                <strong data-mobile-meter-val>78%</strong>
              </div>
              <div class="phone-meter-track">
                <div class="phone-meter-fill" data-mobile-meter-fill style="width: 78%"></div>
              </div>
              <div class="phone-preset-row">
                <button type="button" class="ds-chip" data-mobile-preset="42">절전 42%</button>
                <button type="button" class="ds-chip is-active" data-mobile-preset="78">균형 78%</button>
                <button type="button" class="ds-chip" data-mobile-preset="100">최대 100%</button>
              </div>
            </div>

            <div class="phone-toggles">
              ${style.traits.map((trait, idx) => `
                <div class="ds-card phone-toggle-row">
                  <div>
                    <strong class="phone-toggle-title">${escapeHtml(trait)}</strong>
                    <span class="phone-toggle-sub">${escapeHtml(mobile.detailSub)}</span>
                  </div>
                  <button type="button" class="phone-switch ${idx < 2 ? 'is-on' : ''}" role="switch" aria-checked="${idx < 2 ? 'true' : 'false'}" data-mobile-switch aria-label="${escapeHtml(trait)} 전환">
                    <span class="phone-switch-knob"></span>
                  </button>
                </div>
              `).join('')}
            </div>

            <div class="phone-sheet-footer">
              <button type="button" class="ds-btn ds-btn-primary phone-cta-full" data-demo-action="cta" data-demo-label="${escapeHtml(mobile.appName)} 설정 저장">
                설정 즉시 적용
              </button>
            </div>
          </div>

          <div class="phone-home-indicator" aria-hidden="true"></div>
        </section>
      </div>
    </div>
  `;
}
