/**
 * 도메인 4: 실무급 데이터 분석 대시보드 쇼케이스 렌더러 (KO / EN 네이티브 전환 지원)
 * 스타일별 맞춤 SVG 영역·막대·도넛 3종 차트와 7일/30일/90일 기간 전환 인터랙션을 제공한다.
 */

import { getLocalizedStyleView } from '../data/showcaseEn.js';
import { UI_COPY } from '../data/uiCopy.js';
import { escapeHtml } from '../utils/escape.js';

export const DASHBOARD_SERIES = Object.freeze({
  '7d': {
    points: [38, 52, 46, 68, 62, 84, 92],
    bars: [64, 82, 54, 91, 73, 88],
    donut: [46, 32, 22]
  },
  '30d': {
    points: [28, 40, 55, 49, 71, 79, 96],
    bars: [72, 68, 86, 79, 94, 82],
    donut: [41, 37, 22]
  },
  '90d': {
    points: [22, 34, 48, 62, 58, 78, 98],
    bars: [58, 74, 82, 88, 96, 91],
    donut: [38, 35, 27]
  }
});

export function renderTrendChartSvg(rangeKey = '7d', styleId = 'swiss-grid', lang = 'ko') {
  const safeLang = lang === 'en' ? 'en' : 'ko';
  const copy = UI_COPY[safeLang].dashboard;
  const series = DASHBOARD_SERIES[rangeKey] || DASHBOARD_SERIES['7d'];
  const days = copy.days[rangeKey] || copy.days['7d'];
  const w = 520;
  const h = 190;
  const padX = 24;
  const padY = 18;
  const stepX = (w - padX * 2) / (series.points.length - 1);

  const coords = series.points.map((val, i) => ({
    x: Math.round(padX + i * stepX),
    y: Math.round(h - padY - (val / 100) * (h - padY * 2))
  }));

  const isSharp = ['swiss-grid', 'high-contrast-mono', 'pixel-arcade', 'neo-brutalism', 'kinetic-type', 'bauhaus-geometry'].includes(styleId);
  const linePath = coords.map((pt, i) => `${i === 0 ? 'M' : 'L'}${pt.x} ${pt.y}`).join(' ');
  const areaPath = `${linePath} L${coords.at(-1).x} ${h - padY} L${coords[0].x} ${h - padY} Z`;

  return `
    <svg class="dash-chart-svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${escapeHtml(copy.rangeLabel[rangeKey] || copy.rangeLabel['7d'])}">
      <defs>
        <linearGradient id="dash-area-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.34"/>
          <stop offset="100%" stop-color="var(--accent)" stop-opacity="0.02"/>
        </linearGradient>
      </defs>
      <g stroke="var(--border)" stroke-width="1" opacity="0.55">
        <line x1="${padX}" y1="36" x2="${w - padX}" y2="36" stroke-dasharray="4 4"/>
        <line x1="${padX}" y1="92" x2="${w - padX}" y2="92" stroke-dasharray="4 4"/>
        <line x1="${padX}" y1="148" x2="${w - padX}" y2="148" stroke-dasharray="4 4"/>
      </g>
      <path d="${areaPath}" fill="url(#dash-area-grad)"/>
      <path d="${linePath}" fill="none" stroke="var(--accent)" stroke-width="${isSharp ? '3' : '2.8'}" stroke-linejoin="${isSharp ? 'miter' : 'round'}" stroke-linecap="${isSharp ? 'square' : 'round'}"/>
      ${coords.map((pt, i) => `
        <g>
          <circle cx="${pt.x}" cy="${pt.y}" r="${i === coords.length - 1 ? 6 : 4}" fill="var(--bg)" stroke="var(--accent)" stroke-width="2.5"/>
          <text x="${pt.x}" y="${h - 2}" text-anchor="middle" fill="var(--ink-muted)" font-size="11" font-family="var(--font-mono)">${escapeHtml(days[i])}</text>
        </g>
      `).join('')}
    </svg>
  `;
}

export function renderBarChartSvg(rangeKey = '7d', lang = 'ko') {
  const safeLang = lang === 'en' ? 'en' : 'ko';
  const copy = UI_COPY[safeLang].dashboard;
  const series = DASHBOARD_SERIES[rangeKey] || DASHBOARD_SERIES['7d'];
  const labels = copy.barLabels;
  const w = 320;
  const h = 190;
  const barW = 30;
  const gap = 18;
  const startX = 24;

  return `
    <svg class="dash-chart-svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${escapeHtml(copy.barTitle)}">
      ${series.bars.map((val, i) => {
        const x = startX + i * (barW + gap);
        const barH = Math.round((val / 100) * 130);
        const y = 152 - barH;
        const fill = i % 2 === 0 ? 'var(--accent)' : 'var(--accent-2)';
        return `
          <g>
            <rect x="${x}" y="22" width="${barW}" height="130" fill="var(--surface-2)" rx="4"/>
            <rect x="${x}" y="${y}" width="${barW}" height="${barH}" fill="${fill}" rx="4"/>
            <text x="${x + barW / 2}" y="${y - 6}" text-anchor="middle" fill="var(--ink)" font-size="10" font-weight="700" font-family="var(--font-mono)">${val}</text>
            <text x="${x + barW / 2}" y="172" text-anchor="middle" fill="var(--ink-muted)" font-size="11">${escapeHtml(labels[i])}</text>
          </g>
        `;
      }).join('')}
    </svg>
  `;
}

export function renderDonutChartSvg(rangeKey = '7d', lang = 'ko') {
  const safeLang = lang === 'en' ? 'en' : 'ko';
  const copy = UI_COPY[safeLang].dashboard;
  const series = DASHBOARD_SERIES[rangeKey] || DASHBOARD_SERIES['7d'];
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const fills = ['var(--accent)', 'var(--accent-2)', 'var(--ink-muted)'];
  let offset = 0;

  const segmentsSvg = series.donut.map((pct, idx) => {
    const dashLen = (pct / 100) * circumference;
    const circle = `
      <circle cx="84" cy="84" r="${radius}"
              fill="none"
              stroke="${fills[idx % fills.length]}"
              stroke-width="18"
              stroke-dasharray="${dashLen.toFixed(1)} ${(circumference - dashLen).toFixed(1)}"
              stroke-dashoffset="${(-offset).toFixed(1)}"
              transform="rotate(-90 84 84)"/>`;
    offset += dashLen;
    return circle;
  }).join('');

  return `
    <div class="dash-donut-wrap">
      <svg class="dash-donut-svg" viewBox="0 0 168 168" role="img" aria-label="${escapeHtml(copy.donutTitle)}">
        <circle cx="84" cy="84" r="${radius}" fill="none" stroke="var(--surface-2)" stroke-width="18"/>
        ${segmentsSvg}
        <text x="84" y="80" text-anchor="middle" fill="var(--ink)" font-size="22" font-weight="800" font-family="var(--font-display)">${series.donut[0]}%</text>
        <text x="84" y="99" text-anchor="middle" fill="var(--ink-muted)" font-size="10.5" font-family="var(--font-mono)">PRIMARY</text>
      </svg>
      <ul class="dash-donut-legend">
        ${series.donut.map((pct, idx) => `
          <li>
            <span class="dash-legend-dot" style="background:${fills[idx % fills.length]}"></span>
            <span class="dash-legend-label">${escapeHtml(copy.donutLabels[idx])}</span>
            <strong>${pct}%</strong>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}

export function renderDashboardDomain(style, lang = 'ko') {
  const safeLang = lang === 'en' ? 'en' : 'ko';
  const view = getLocalizedStyleView(style, safeLang);
  const copy = UI_COPY[safeLang].dashboard;
  const dash = view.showcase.dashboard;
  const rows = copy.rows(view.displayName);

  return `
    <div class="domain-shell domain-dashboard" data-dashboard-root data-style-id="${escapeHtml(style.id)}">
      <div class="dash-layout">
        <!-- 좌측 사이드바 -->
        <aside class="ds-card dash-sidebar">
          <div class="dash-brand">
            <span class="dash-brand-badge">${escapeHtml(style.number)}</span>
            <div>
              <strong>${escapeHtml(dash.brand)}</strong>
              <small>${escapeHtml(style.nameEn)}</small>
            </div>
          </div>

          <nav class="dash-nav" aria-label="${safeLang === 'en' ? 'Dashboard navigation' : '대시보드 메뉴'}">
            ${copy.nav.map((label, idx) => `
              <button type="button" class="dash-nav-item ${idx === 0 ? 'is-active' : ''}" data-dash-nav="${idx}">${escapeHtml(label)}</button>
            `).join('')}
          </nav>

          <div class="dash-side-note">
            <p class="ds-kicker">DOMAIN TIP</p>
            <p>${escapeHtml(view.domainTips.dashboard)}</p>
          </div>
        </aside>

        <!-- 메인 대시보드 콘텐츠 -->
        <div class="dash-main">
          <header class="dash-header">
            <div>
              <p class="ds-kicker">LIVE OPERATIONS DASHBOARD</p>
              <h1 class="dash-title">${escapeHtml(dash.title)}</h1>
            </div>
            <div class="dash-range-tabs" role="tablist" aria-label="${safeLang === 'en' ? 'Select timeframe' : '조회 기간 선택'}">
              <button type="button" role="tab" class="ds-chip is-active" data-dash-range="7d" aria-selected="true">${escapeHtml(copy.ranges['7d'])}</button>
              <button type="button" role="tab" class="ds-chip" data-dash-range="30d" aria-selected="false">${escapeHtml(copy.ranges['30d'])}</button>
              <button type="button" role="tab" class="ds-chip" data-dash-range="90d" aria-selected="false">${escapeHtml(copy.ranges['90d'])}</button>
            </div>
          </header>

          <!-- KPI 4열 -->
          <section class="dash-kpi-grid" aria-label="${safeLang === 'en' ? 'Key performance metrics' : '핵심 성과 지표'}">
            ${dash.kpis.map((kpi, idx) => `
              <article class="ds-card dash-kpi-card ${idx === 0 ? 'is-primary-kpi' : ''}">
                <span class="dash-kpi-label">${escapeHtml(kpi.label)}</span>
                <strong class="dash-kpi-value">${escapeHtml(kpi.value)}</strong>
                <span class="dash-kpi-delta">${escapeHtml(kpi.delta)}</span>
              </article>
            `).join('')}
          </section>

          <!-- SVG 차트 3종 (영역 + 막대 + 도넛) -->
          <section class="dash-charts-grid">
            <article class="ds-card dash-chart-card">
              <div class="dash-card-head">
                <div>
                  <h2 class="dash-card-title">${escapeHtml(copy.trendTitle)}</h2>
                  <span class="dash-card-sub" data-dash-range-label>${escapeHtml(copy.rangeLabel['7d'])}</span>
                </div>
                <span class="dash-live-pill">LIVE</span>
              </div>
              <div class="dash-chart-slot" data-dash-trend-slot>
                ${renderTrendChartSvg('7d', style.id, safeLang)}
              </div>
            </article>

            <article class="ds-card dash-chart-card">
              <div class="dash-card-head">
                <div>
                  <h2 class="dash-card-title">${escapeHtml(copy.barTitle)}</h2>
                  <span class="dash-card-sub">${escapeHtml(copy.barSub)}</span>
                </div>
              </div>
              <div class="dash-chart-slot" data-dash-bar-slot>
                ${renderBarChartSvg('7d', safeLang)}
              </div>
            </article>

            <article class="ds-card dash-chart-card dash-donut-card">
              <div class="dash-card-head">
                <div>
                  <h2 class="dash-card-title">${escapeHtml(copy.donutTitle)}</h2>
                  <span class="dash-card-sub">${escapeHtml(copy.donutSub)}</span>
                </div>
              </div>
              <div class="dash-chart-slot" data-dash-donut-slot>
                ${renderDonutChartSvg('7d', safeLang)}
              </div>
            </article>
          </section>

          <!-- 운영 상태 테이블 -->
          <section class="ds-card dash-table-card">
            <div class="dash-card-head">
              <h2 class="dash-card-title">${escapeHtml(copy.tableTitle)}</h2>
              <span class="dash-card-sub">${escapeHtml(copy.tableSub)}</span>
            </div>
            <div class="dash-table-wrap">
              <table class="dash-table">
                <thead>
                  <tr>
                    ${copy.cols.map(col => `<th>${escapeHtml(col)}</th>`).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${rows.map(row => `
                    <tr>
                      <td><code>${escapeHtml(row.id)}</code></td>
                      <td><strong>${escapeHtml(row.module)}</strong></td>
                      <td><code>${escapeHtml(row.region)}</code></td>
                      <td><code>${escapeHtml(row.latency)}</code></td>
                      <td><span class="dash-status-badge">${escapeHtml(row.status)}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  `;
}
