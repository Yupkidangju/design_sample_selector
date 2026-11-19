/**
 * 도메인 4: 실무급 데이터 분석 대시보드 쇼케이스 렌더러
 * 스타일별 맞춤 SVG 영역·막대·도넛 3종 차트와 7일/30일/90일 기간 전환 인터랙션을 제공한다.
 */

import { escapeHtml } from '../utils/escape.js';

export const DASHBOARD_SERIES = Object.freeze({
  '7d': {
    label: '최근 7일',
    points: [38, 52, 46, 68, 62, 84, 92],
    bars: [64, 82, 54, 91, 73, 88],
    days: ['월', '화', '수', '목', '금', '토', '일'],
    donut: [
      { label: '웹', pct: 46 },
      { label: '모바일', pct: 32 },
      { label: '게임·기타', pct: 22 }
    ]
  },
  '30d': {
    label: '최근 30일',
    points: [28, 40, 55, 49, 71, 79, 96],
    bars: [72, 68, 86, 79, 94, 82],
    days: ['1주', '5일', '10일', '15일', '20일', '25일', '30일'],
    donut: [
      { label: '웹', pct: 41 },
      { label: '모바일', pct: 37 },
      { label: '게임·기타', pct: 22 }
    ]
  },
  '90d': {
    label: '최근 90일',
    points: [22, 34, 48, 62, 58, 78, 98],
    bars: [58, 74, 82, 88, 96, 91],
    days: ['1월', '2월', '3월', '4월', '5월', '6월', '현재'],
    donut: [
      { label: '웹', pct: 38 },
      { label: '모바일', pct: 35 },
      { label: '게임·기타', pct: 27 }
    ]
  }
});

export function renderTrendChartSvg(rangeKey = '7d', styleId = 'swiss-grid') {
  const series = DASHBOARD_SERIES[rangeKey] || DASHBOARD_SERIES['7d'];
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
    <svg class="dash-chart-svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${escapeHtml(series.label)} 추이 영역 차트">
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
          <text x="${pt.x}" y="${h - 2}" text-anchor="middle" fill="var(--ink-muted)" font-size="11" font-family="var(--font-mono)">${escapeHtml(series.days[i])}</text>
        </g>
      `).join('')}
    </svg>
  `;
}

export function renderBarChartSvg(rangeKey = '7d') {
  const series = DASHBOARD_SERIES[rangeKey] || DASHBOARD_SERIES['7d'];
  const labels = ['웹', '모바일', '게임', 'API', 'SDK', '에셋'];
  const w = 320;
  const h = 190;
  const barW = 30;
  const gap = 18;
  const startX = 24;

  return `
    <svg class="dash-chart-svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="채널별 분포 막대 차트">
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
            <text x="${x + barW / 2}" y="172" text-anchor="middle" fill="var(--ink-muted)" font-size="11">${labels[i]}</text>
          </g>
        `;
      }).join('')}
    </svg>
  `;
}

export function renderDonutChartSvg(rangeKey = '7d') {
  const series = DASHBOARD_SERIES[rangeKey] || DASHBOARD_SERIES['7d'];
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const fills = ['var(--accent)', 'var(--accent-2)', 'var(--ink-muted)'];
  let offset = 0;

  const segmentsSvg = series.donut.map((seg, idx) => {
    const dashLen = (seg.pct / 100) * circumference;
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
      <svg class="dash-donut-svg" viewBox="0 0 168 168" role="img" aria-label="${escapeHtml(series.label)} 플랫폼 비중 도넛 차트">
        <circle cx="84" cy="84" r="${radius}" fill="none" stroke="var(--surface-2)" stroke-width="18"/>
        ${segmentsSvg}
        <text x="84" y="80" text-anchor="middle" fill="var(--ink)" font-size="22" font-weight="800" font-family="var(--font-display)">${series.donut[0].pct}%</text>
        <text x="84" y="99" text-anchor="middle" fill="var(--ink-muted)" font-size="10.5" font-family="var(--font-mono)">PRIMARY</text>
      </svg>
      <ul class="dash-donut-legend">
        ${series.donut.map((seg, idx) => `
          <li>
            <span class="dash-legend-dot" style="background:${fills[idx % fills.length]}"></span>
            <span class="dash-legend-label">${escapeHtml(seg.label)}</span>
            <strong>${seg.pct}%</strong>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}

export function renderDashboardDomain(style) {
  const dash = style.showcase.dashboard;
  const rows = [
    { id: 'OPS-01', module: `${style.nameKo} 핵심 엔진`, region: 'ap-northeast-2', latency: '14ms', status: '정상 가동' },
    { id: 'OPS-02', module: '토큰 동기화 파이프라인', region: 'us-west-1', latency: '21ms', status: '동기화됨' },
    { id: 'OPS-03', module: '실시간 프리뷰 렌더러', region: 'eu-central-1', latency: '18ms', status: '최적화' },
    { id: 'OPS-04', module: 'AI 프롬프트 컴파일러', region: 'ap-northeast-1', latency: '9ms', status: '정상 가동' }
  ];

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

          <nav class="dash-nav" aria-label="대시보드 메뉴">
            <button type="button" class="dash-nav-item is-active" data-dash-nav="overview">실시간 개요</button>
            <button type="button" class="dash-nav-item" data-dash-nav="telemetry">성능 텔레메트리</button>
            <button type="button" class="dash-nav-item" data-dash-nav="tokens">디자인 토큰 현황</button>
            <button type="button" class="dash-nav-item" data-dash-nav="alerts">배포 알림 로그</button>
          </nav>

          <div class="dash-side-note">
            <p class="ds-kicker">DOMAIN TIP</p>
            <p>${escapeHtml(style.dna.domainTipsKo.dashboard)}</p>
          </div>
        </aside>

        <!-- 메인 대시보드 콘텐츠 -->
        <div class="dash-main">
          <header class="dash-header">
            <div>
              <p class="ds-kicker">LIVE OPERATIONS DASHBOARD</p>
              <h1 class="dash-title">${escapeHtml(dash.title)}</h1>
            </div>
            <div class="dash-range-tabs" role="tablist" aria-label="조회 기간 선택">
              <button type="button" role="tab" class="ds-chip is-active" data-dash-range="7d" aria-selected="true">7일</button>
              <button type="button" role="tab" class="ds-chip" data-dash-range="30d" aria-selected="false">30일</button>
              <button type="button" role="tab" class="ds-chip" data-dash-range="90d" aria-selected="false">90일</button>
            </div>
          </header>

          <!-- KPI 4열 -->
          <section class="dash-kpi-grid" aria-label="핵심 성과 지표">
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
                  <h2 class="dash-card-title">핵심 지표 추이</h2>
                  <span class="dash-card-sub" data-dash-range-label>최근 7일 기준</span>
                </div>
                <span class="dash-live-pill">LIVE</span>
              </div>
              <div class="dash-chart-slot" data-dash-trend-slot>
                ${renderTrendChartSvg('7d', style.id)}
              </div>
            </article>

            <article class="ds-card dash-chart-card">
              <div class="dash-card-head">
                <div>
                  <h2 class="dash-card-title">채널별 활성 지수</h2>
                  <span class="dash-card-sub">6개 핵심 모듈 비교</span>
                </div>
              </div>
              <div class="dash-chart-slot" data-dash-bar-slot>
                ${renderBarChartSvg('7d')}
              </div>
            </article>

            <article class="ds-card dash-chart-card dash-donut-card">
              <div class="dash-card-head">
                <div>
                  <h2 class="dash-card-title">플랫폼 비중</h2>
                  <span class="dash-card-sub">도넛 분포</span>
                </div>
              </div>
              <div class="dash-chart-slot" data-dash-donut-slot>
                ${renderDonutChartSvg('7d')}
              </div>
            </article>
          </section>

          <!-- 운영 상태 테이블 -->
          <section class="ds-card dash-table-card">
            <div class="dash-card-head">
              <h2 class="dash-card-title">서비스 노드 상태</h2>
              <span class="dash-card-sub">4개 리전 정상 동기화</span>
            </div>
            <div class="dash-table-wrap">
              <table class="dash-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>모듈</th>
                    <th>리전</th>
                    <th>응답</th>
                    <th>상태</th>
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
