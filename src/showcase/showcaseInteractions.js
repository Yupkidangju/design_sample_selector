/**
 * 쇼케이스 4대 도메인 내부 실시간 인터랙션 바인딩
 * 모든 인터랙션은 순수 DOM 상태 전이와 시각 피드백으로 동작한다 (오디오 없음).
 */

import { copyText, showToast } from '../utils/clipboard.js';
import {
  DASHBOARD_SERIES,
  renderBarChartSvg,
  renderDonutChartSvg,
  renderTrendChartSvg
} from './domainDashboard.js';

export function bindDomainInteractions(stageRoot, style) {
  if (!stageRoot) return;

  // 1. 공통 버튼 / 내비게이션 / 컬러 스와치 복사
  stageRoot.querySelectorAll('[data-copy-hex]').forEach(button => {
    button.addEventListener('click', () => {
      const hex = button.getAttribute('data-copy-hex');
      if (hex) copyText(hex, `색상 코드 ${hex} 복사됨`);
    });
  });

  stageRoot.querySelectorAll('[data-demo-action="nav"]').forEach(button => {
    button.addEventListener('click', () => {
      stageRoot.querySelectorAll('[data-demo-action="nav"]').forEach(b => b.classList.remove('is-active'));
      button.classList.add('is-active');
      showToast(`"${button.dataset.demoLabel}" 섹션 포커스`);
    });
  });

  stageRoot.querySelectorAll('[data-demo-action="cta"]').forEach(button => {
    button.addEventListener('click', () => {
      showToast(`"${button.dataset.demoLabel}" 인터랙션 확인됨`);
    });
  });

  stageRoot.querySelectorAll('[data-demo-chip]').forEach(chip => {
    chip.addEventListener('click', () => {
      const next = chip.getAttribute('aria-pressed') !== 'true';
      chip.setAttribute('aria-pressed', String(next));
      chip.classList.toggle('is-active', next);
    });
  });

  const demoForm = stageRoot.querySelector('[data-demo-form]');
  if (demoForm) {
    demoForm.addEventListener('submit', event => {
      event.preventDefault();
      const formData = new FormData(demoForm);
      const name = String(formData.get('projectName') || '새 프로젝트').trim();
      const status = demoForm.querySelector('[data-form-status]');
      if (status) {
        status.textContent = `"${name}" 시안 설정이 성공적으로 적용되었습니다.`;
      }
      showToast(`"${name}" 폼 제출 테스트 완료`);
    });
  }

  // 2. 모바일 도메인 인터랙션
  const mobilePair = stageRoot.querySelector('[data-mobile-mode]');
  if (mobilePair) {
    stageRoot.querySelectorAll('[data-mobile-screen]').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mobileScreen;
        mobilePair.dataset.mobileMode = mode;
        stageRoot.querySelectorAll('[data-mobile-screen]').forEach(item => {
          const active = item === btn;
          item.classList.toggle('is-active', active);
          item.classList.toggle('ds-btn-primary', active);
          item.classList.toggle('ds-btn-secondary', !active);
          item.setAttribute('aria-pressed', String(active));
        });
      });
    });

    stageRoot.querySelectorAll('[data-mobile-item]').forEach(item => {
      item.addEventListener('click', () => {
        stageRoot.querySelectorAll('[data-mobile-item]').forEach(el => el.classList.remove('is-selected'));
        item.classList.add('is-selected');
      });
    });

    stageRoot.querySelectorAll('[data-phone-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        stageRoot.querySelectorAll('[data-phone-tab]').forEach(el => el.classList.remove('is-active'));
        tab.classList.add('is-active');
      });
    });

    stageRoot.querySelectorAll('[data-mobile-preset]').forEach(btn => {
      btn.addEventListener('click', () => {
        const value = Number(btn.dataset.mobilePreset) || 78;
        stageRoot.querySelectorAll('[data-mobile-preset]').forEach(el => el.classList.remove('is-active'));
        btn.classList.add('is-active');
        const fill = stageRoot.querySelector('[data-mobile-meter-fill]');
        const text = stageRoot.querySelector('[data-mobile-meter-val]');
        if (fill) fill.style.width = `${value}%`;
        if (text) text.textContent = `${value}%`;
      });
    });

    stageRoot.querySelectorAll('[data-mobile-switch]').forEach(toggle => {
      toggle.addEventListener('click', () => {
        const next = toggle.getAttribute('aria-checked') !== 'true';
        toggle.setAttribute('aria-checked', String(next));
        toggle.classList.toggle('is-on', next);
      });
    });
  }

  // 3. 게임 도메인 인터랙션 (실시간 타격 · 스킬 · 콤보 · 웨이브 클리어)
  const gameRoot = stageRoot.querySelector('[data-game-root]');
  if (gameRoot) {
    let bossMax = 1000;
    let bossHp = 1000;
    let mp = 100;
    let score = 12400;
    let combo = 1;
    let wave = 1;
    let popTimer = null;

    const bossFill = gameRoot.querySelector('[data-boss-hp-fill]');
    const bossText = gameRoot.querySelector('[data-boss-hp-text]');
    const mpFill = gameRoot.querySelector('[data-game-mp-fill]');
    const mpText = gameRoot.querySelector('[data-game-mp-text]');
    const scoreEl = gameRoot.querySelector('[data-game-score]');
    const comboEl = gameRoot.querySelector('[data-game-combo]');
    const waveEl = gameRoot.querySelector('[data-game-wave]');
    const logEl = gameRoot.querySelector('[data-game-log]');
    const popEl = gameRoot.querySelector('[data-game-pop]');
    const targetBtn = gameRoot.querySelector('[data-game-target]');

    const renderHud = message => {
      const bossPct = Math.max(0, Math.round((bossHp / bossMax) * 100));
      if (bossFill) bossFill.style.width = `${bossPct}%`;
      if (bossText) bossText.textContent = `${bossHp} / ${bossMax}`;
      if (mpFill) mpFill.style.width = `${mp}%`;
      if (mpText) mpText.textContent = `${mp} / 100`;
      if (scoreEl) scoreEl.textContent = score.toLocaleString('ko-KR');
      if (comboEl) comboEl.textContent = `x${combo}`;
      if (waveEl) waveEl.textContent = `WAVE ${String(wave).padStart(2, '0')}`;
      if (logEl && message) logEl.textContent = message;
    };

    const triggerHit = (skillName, baseDmg, cost = 0) => {
      if (cost > mp) {
        renderHud(`에너지가 부족합니다 (필요 ${cost}, 현재 ${mp}). 기본 타격이나 [Q]로 충전하세요!`);
        return;
      }

      const isCrit = Math.random() < 0.32;
      const dmg = Math.round(baseDmg * (isCrit ? 1.45 : 1) * (1 + Math.min(combo, 10) * 0.04));
      mp = Math.min(100, Math.max(0, mp - cost + (cost === 0 ? 18 : 6)));
      bossHp = Math.max(0, bossHp - dmg);
      combo += 1;
      score += dmg * 10;

      if (targetBtn) {
        targetBtn.classList.remove('is-hit');
        void targetBtn.offsetWidth;
        targetBtn.classList.add('is-hit');
      }

      if (popEl) {
        popEl.textContent = isCrit ? `-${dmg} CRIT!` : `-${dmg}`;
        popEl.classList.toggle('is-crit', isCrit);
        popEl.classList.add('is-visible');
        window.clearTimeout(popTimer);
        popTimer = window.setTimeout(() => popEl.classList.remove('is-visible'), 650);
      }

      if (bossHp <= 0) {
        wave += 1;
        bossMax = 1000 + (wave - 1) * 250;
        bossHp = bossMax;
        mp = 100;
        score += 5000;
        renderHud(`WAVE ${wave - 1} 격파! 보너스 +5,000점 — 강화된 WAVE ${String(wave).padStart(2, '0')} 개시!`);
        return;
      }

      renderHud(`${skillName} 적중! ${dmg} 데미지${isCrit ? ' (치명타!)' : ''} · ${combo}연속 콤보`);
    };

    targetBtn?.addEventListener('click', () => {
      triggerHit('직접 타격', 110, 0);
    });

    gameRoot.querySelectorAll('[data-game-skill]').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.skillName || '스킬';
        const dmg = Number(btn.dataset.skillDmg) || 140;
        const cost = Number(btn.dataset.skillCost) || 0;
        triggerHit(name, dmg, cost);
      });
    });

    gameRoot.querySelector('[data-game-reset]')?.addEventListener('click', () => {
      wave = 1;
      bossMax = 1000;
      bossHp = 1000;
      mp = 100;
      combo = 1;
      score = 12400;
      renderHud(style.showcase.game.logInit);
    });
  }

  // 4. 대시보드 도메인 인터랙션 (7일 / 30일 / 90일 영역·막대·도넛 차트 & 메뉴)
  const dashRoot = stageRoot.querySelector('[data-dashboard-root]');
  if (dashRoot) {
    const trendSlot = dashRoot.querySelector('[data-dash-trend-slot]');
    const barSlot = dashRoot.querySelector('[data-dash-bar-slot]');
    const donutSlot = dashRoot.querySelector('[data-dash-donut-slot]');
    const rangeLabel = dashRoot.querySelector('[data-dash-range-label]');

    dashRoot.querySelectorAll('[data-dash-range]').forEach(btn => {
      btn.addEventListener('click', () => {
        const range = btn.dataset.dashRange || '7d';
        dashRoot.querySelectorAll('[data-dash-range]').forEach(el => {
          const active = el === btn;
          el.classList.toggle('is-active', active);
          el.setAttribute('aria-selected', String(active));
        });
        if (trendSlot) trendSlot.innerHTML = renderTrendChartSvg(range, style.id);
        if (barSlot) barSlot.innerHTML = renderBarChartSvg(range);
        if (donutSlot) donutSlot.innerHTML = renderDonutChartSvg(range);
        if (rangeLabel) rangeLabel.textContent = `${DASHBOARD_SERIES[range]?.label || '최근 7일'} 기준`;
      });
    });

    dashRoot.querySelectorAll('[data-dash-nav]').forEach(btn => {
      btn.addEventListener('click', () => {
        dashRoot.querySelectorAll('[data-dash-nav]').forEach(el => el.classList.remove('is-active'));
        btn.classList.add('is-active');
      });
    });
  }
}
