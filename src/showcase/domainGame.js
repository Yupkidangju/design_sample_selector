/**
 * 도메인 3: 스타일별 장르 맞춤형 풀블리드 인터랙티브 게임 UI & HUD 렌더러 (KO / EN 네이티브 전환 지원)
 */

import { getLocalizedStyleView } from '../data/showcaseEn.js';
import { UI_COPY } from '../data/uiCopy.js';
import { escapeHtml } from '../utils/escape.js';
import { renderStyleArtwork } from './domainArtwork.js';

export function renderGameDomain(style, lang = 'ko') {
  const safeLang = lang === 'en' ? 'en' : 'ko';
  const view = getLocalizedStyleView(style, safeLang);
  const copy = UI_COPY[safeLang].game;
  const game = view.showcase.game;
  const stageArt = renderStyleArtwork(style.id, 'game');

  return `
    <div class="domain-shell domain-game" data-game-root data-boss-max="1000" data-boss-hp="1000">
      <!-- 상단 HUD 바 -->
      <header class="ds-card game-top-hud">
        <div class="game-player-block">
          <div class="game-player-emblem">${escapeHtml(style.number)}</div>
          <div>
            <span class="game-genre-tag">${escapeHtml(game.genre)}</span>
            <h1 class="game-player-name">${escapeHtml(game.player)}</h1>
          </div>
        </div>

        <div class="game-vitals">
          <div class="game-bar-group">
            <div class="game-bar-meta">
              <span>${escapeHtml(game.hpLabel)}</span>
              <strong data-game-hp-text>860 / 1000</strong>
            </div>
            <div class="game-bar-track">
              <div class="game-bar-fill is-hp" data-game-hp-fill style="width: 86%"></div>
            </div>
          </div>
          <div class="game-bar-group">
            <div class="game-bar-meta">
              <span>${escapeHtml(game.mpLabel)}</span>
              <strong data-game-mp-text>100 / 100</strong>
            </div>
            <div class="game-bar-track">
              <div class="game-bar-fill is-mp" data-game-mp-fill style="width: 100%"></div>
            </div>
          </div>
        </div>

        <div class="game-score-cluster">
          <div class="game-stat-pill">
            <span>SCORE</span>
            <strong data-game-score>12,400</strong>
          </div>
          <div class="game-stat-pill is-combo">
            <span>COMBO</span>
            <strong data-game-combo>x1</strong>
          </div>
        </div>
      </header>

      <!-- 중앙 아레나 스테이지 + 측면 전술 브리핑 -->
      <div class="game-main-grid">
        <section class="ds-card game-arena-stage" aria-label="${safeLang === 'en' ? 'Interactive game stage' : '인터랙티브 게임 스테이지'}">
          <div class="game-boss-header">
            <div>
              <p class="ds-kicker">${escapeHtml(game.title)}</p>
              <h2 class="game-boss-name">${escapeHtml(game.bossName)}</h2>
              <p class="game-boss-sub">${escapeHtml(game.bossSub)}</p>
            </div>
            <div class="game-boss-hp-wrap">
              <div class="game-bar-meta">
                <span>TARGET HP</span>
                <strong data-boss-hp-text>1000 / 1000</strong>
              </div>
              <div class="game-bar-track is-boss">
                <div class="game-bar-fill is-boss" data-boss-hp-fill style="width: 100%"></div>
              </div>
            </div>
          </div>

          <button type="button" class="game-target-canvas" data-game-target aria-label="${escapeHtml(game.bossName)}">
            ${stageArt}
            <span class="game-damage-pop" data-game-pop aria-hidden="true"></span>
            <span class="game-click-hint">${escapeHtml(copy.clickHint)}</span>
          </button>

          <div class="game-combat-log" data-game-log role="status" aria-live="polite">
            ${escapeHtml(game.logInit)}
          </div>
        </section>

        <aside class="game-side-column">
          <div class="ds-card game-loadout-card">
            <p class="ds-kicker">STYLE HUD CHARACTERISTICS</p>
            <h3 class="game-side-title">${escapeHtml(copy.sideTitle(view.displayName))}</h3>
            <p class="game-side-desc">${escapeHtml(view.domainTips.game)}</p>
            <ul class="game-trait-list">
              ${view.traits.map(trait => `<li>${escapeHtml(trait)}</li>`).join('')}
            </ul>
          </div>

          <div class="ds-card game-wave-card">
            <div class="game-wave-row">
              <span>STAGE WAVE</span>
              <strong data-game-wave>WAVE 01</strong>
            </div>
            <div class="game-wave-row">
              <span>CRITICAL RATE</span>
              <strong>32%</strong>
            </div>
            <button type="button" class="ds-btn ds-btn-secondary game-reset-btn" data-game-reset>
              ${escapeHtml(copy.resetBtn)}
            </button>
          </div>
        </aside>
      </div>

      <!-- 하단 스킬 커맨드 덱 -->
      <footer class="ds-card game-skill-deck">
        <div class="game-skill-grid">
          ${game.skills.map((skill, idx) => `
            <button type="button" class="game-skill-btn ${idx === 3 ? 'is-ult' : ''}" data-game-skill data-skill-name="${escapeHtml(skill.name)}" data-skill-dmg="${skill.dmg}" data-skill-cost="${idx === 0 ? 0 : idx * 15}">
              <span class="game-skill-key">${escapeHtml(skill.key)}</span>
              <span class="game-skill-info">
                <strong>${escapeHtml(skill.name)}</strong>
                <small>DMG ${skill.dmg}${idx === 0 ? ` · ${escapeHtml(copy.freeCost)}` : ` · COST ${idx * 15}`}</small>
              </span>
            </button>
          `).join('')}
        </div>
      </footer>
    </div>
  `;
}
