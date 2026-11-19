#!/usr/bin/env node
/**
 * 실제 Headless Chrome에서 프로덕션 빌드(vite preview)를 대상으로
 * 1) 메인 다크 스튜디오 갤러리 (360/768/1024/1440px, ARIA 정합, 포커스 유지, 오디오 0건)
 * 2) 독립 새 탭 쇼케이스 (20종 × 4도메인 = 80상태 + 360px 모바일, 콘솔 에러/예외/HTTP>=400 0건)
 * 3) 스펙 서랍 토스트 Top-Layer 노출, KO/EN 전환 시 스크롤·포커스 유지, 모달 중 배경 단축키 차단
 * 4) y2k-chrome 대시보드 SVG 포인트 fill, 도넛 차트, 게임 캔버스 좌우 필러박스 해소
 * 을 전수 검증하고 대표 스크린샷을 저장한다.
 */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { PROJECT_BASE } from '../project.config.js';
import { DOMAIN_IDS } from '../src/data/domains.js';
import { STYLES_20 } from '../src/data/styles20.js';

if (!existsSync(resolve('dist/index.html')) || !existsSync(resolve('dist/showcase.html'))) {
  console.error('❌ Missing dist/ build. Run `npm run build` before `npm run qa:visual`.');
  process.exit(1);
}

const artifactsDir = resolve(process.env.DSS_VISUAL_ARTIFACTS || '.antigravity/v3-visual-evidence');
mkdirSync(artifactsDir, { recursive: true });
const chromeProfile = mkdtempSync(join(tmpdir(), 'dss-v3-chrome-'));

const freePort = () => new Promise(res => {
  const s = createServer();
  s.listen(0, '127.0.0.1', () => {
    const port = s.address().port;
    s.close(() => res(port));
  });
});

const pause = ms => new Promise(res => setTimeout(res, ms));

async function waitReady(url) {
  for (let i = 0; i < 150; i++) {
    try {
      const r = await fetch(url);
      if (r.ok) return r;
    } catch {
      /* 서버 기동 대기 */
    }
    await pause(100);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

const webPort = await freePort();
const chromePort = await freePort();

const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(webPort), '--strictPort'],
  { stdio: 'ignore' }
);

const chromeCandidates = [
  process.env.DSS_CHROME_PATH,
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser'
].filter(Boolean);

const chromeBin = chromeCandidates.find(path => existsSync(path));
if (!chromeBin) {
  console.error(`❌ Chrome binary not found. Checked: ${chromeCandidates.join(', ')}`);
  process.exit(1);
}

const chrome = spawn(
  chromeBin,
  [
    '--headless=new',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    `--remote-debugging-port=${chromePort}`,
    `--user-data-dir=${chromeProfile}`,
    'about:blank'
  ],
  { stdio: 'ignore' }
);

let socket;
const report = {
  checkedAt: new Date().toISOString(),
  target: 'dist (vite preview)',
  runtimeErrors: [],
  consoleErrors: [],
  httpErrors: [],
  failedRequests: [],
  overflowIssues: [],
  showcaseChecks: 0,
  assertions: {},
  screenshots: []
};

try {
  await waitReady(`http://127.0.0.1:${webPort}${PROJECT_BASE}`);
  const tabs = await (await waitReady(`http://127.0.0.1:${chromePort}/json`)).json();
  socket = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((res, rej) => {
    socket.onopen = res;
    socket.onerror = rej;
  });

  let seq = 0;
  const pending = new Map();
  socket.onmessage = ({ data }) => {
    const msg = JSON.parse(data);
    if (msg.method === 'Runtime.exceptionThrown') {
      report.runtimeErrors.push(msg.params.exceptionDetails);
    }
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      report.consoleErrors.push(msg.params.args?.map(a => a.value ?? a.description).join(' '));
    }
    if (msg.method === 'Network.responseReceived') {
      const { status, url } = msg.params.response;
      if (status >= 400 && url.startsWith(`http://127.0.0.1:${webPort}`)) {
        report.httpErrors.push({ status, url });
      }
    }
    if (msg.method === 'Network.loadingFailed') {
      if (!msg.params.canceled) {
        report.failedRequests.push({
          errorText: msg.params.errorText,
          type: msg.params.type
        });
      }
    }
    if (pending.has(msg.id)) {
      const p = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) p.reject(new Error(JSON.stringify(msg.error)));
      else p.resolve(msg.result);
    }
  };

  const send = (method, params = {}) => new Promise((res, rej) => {
    const id = ++seq;
    pending.set(id, { resolve: res, reject: rej });
    socket.send(JSON.stringify({ id, method, params }));
  });

  const evaluate = async expression => {
    const res = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (res.exceptionDetails) throw new Error(JSON.stringify(res.exceptionDetails));
    return res.result.value;
  };

  const setViewport = async (width, height) => {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width <= 430
    });
    await pause(80);
  };

  const snap = async name => {
    const res = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    const outPath = resolve(artifactsDir, `${name}.png`);
    writeFileSync(outPath, Buffer.from(res.data, 'base64'));
    report.screenshots.push(outPath);
  };

  await send('Runtime.enable');
  await send('Network.enable');
  await setViewport(1440, 960);

  // 1. 메인 갤러리 검증 (ARIA, 포커스 유지, 반응형, 오디오 부재)
  await send('Page.navigate', { url: `http://127.0.0.1:${webPort}${PROJECT_BASE}` });
  for (let i = 0; i < 80; i++) {
    if (await evaluate('document.querySelectorAll(".specimen-card").length === 20')) break;
    await pause(100);
  }
  await pause(350);
  await snap('01-gallery-desktop');

  for (const width of [360, 768, 1024, 1440]) {
    await setViewport(width, 900);
    const overflow = await evaluate('document.documentElement.scrollWidth - document.documentElement.clientWidth');
    if (overflow > 1) report.overflowIssues.push({ page: 'gallery', width, overflow });
  }

  await setViewport(1440, 960);
  report.assertions.gallery = await evaluate(`(() => {
    const cards = document.querySelectorAll('.specimen-card').length;
    const linksBlank = [...document.querySelectorAll('.specimen-poster-link')].every(a => a.target === '_blank');
    const audioCount = document.querySelectorAll('audio, #audio-widget-root, [data-compact-audio]').length;
    const tablist = document.querySelector('.gallery-group-tabs[role="tablist"]');
    const nonTabInTablist = tablist ? [...tablist.children].filter(el => el.getAttribute('role') !== 'tab').length : -1;

    const playfulTab = document.querySelector('[data-filter-group="playful"]');
    playfulTab.focus();
    playfulTab.click();
    const focusKeptOnGroupTab = document.activeElement === playfulTab;
    const playfulCount = document.querySelectorAll('.specimen-card').length;

    const firstBookmark = document.querySelector('[data-bookmark-toggle]');
    firstBookmark.focus();
    firstBookmark.click();
    const focusKeptOnBookmark = document.activeElement === firstBookmark;

    document.querySelector('[data-filter-group="all"]').click();
    return {
      cards,
      linksBlank,
      audioCount,
      nonTabInTablist,
      focusKeptOnGroupTab,
      playfulCount,
      focusKeptOnBookmark
    };
  })()`);

  // 2. 독립 쇼케이스 20종 × 4도메인 전수 점검 + 대표 스크린샷
  await send('Page.navigate', { url: `http://127.0.0.1:${webPort}${PROJECT_BASE}showcase.html?style=swiss-grid&domain=web` });
  for (let i = 0; i < 80; i++) {
    if (await evaluate('!!document.querySelector(".domain-web")')) break;
    await pause(100);
  }
  await pause(350);

  const captureTargets = new Map([
    ['swiss-grid:web', '02-showcase-swiss-web'],
    ['neo-brutalism:web', '03-showcase-brutal-web'],
    ['pixel-arcade:game', '04-showcase-pixel-game'],
    ['synthwave:game', '05-showcase-synthwave-game'],
    ['art-deco:game', '06-showcase-artdeco-game'],
    ['claymorphism:mobile', '07-showcase-clay-mobile'],
    ['frutiger-aero:mobile', '08-showcase-aero-mobile'],
    ['dark-minimal-glass:dashboard', '09-showcase-linear-dashboard'],
    ['y2k-chrome:dashboard', '10-showcase-y2k-dashboard']
  ]);

  for (const style of STYLES_20) {
    await evaluate(`(() => {
      const sel = document.querySelector('[data-hud-style-select]');
      sel.value = ${JSON.stringify(style.id)};
      sel.dispatchEvent(new Event('change'));
    })()`);
    await pause(30);

    for (const domainId of DOMAIN_IDS) {
      await evaluate(`document.querySelector('[data-hud-domain="${domainId}"]').click()`);
      await pause(30);

      const check = await evaluate(`(() => {
        const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
        const text = document.querySelector('#showcase-stage')?.textContent || '';
        const broken = /undefined|NaN|\\[object Object\\]/.test(text);
        return { overflow, broken };
      })()`);

      report.showcaseChecks += 1;
      if (check.overflow > 1 || check.broken) {
        report.overflowIssues.push({ style: style.id, domainId, ...check });
      }

      const shotName = captureTargets.get(`${style.id}:${domainId}`);
      if (shotName) {
        await pause(150);
        await snap(shotName);
      }
    }
  }

  // 3. y2k-chrome 대시보드 SVG 차트 포인트 fill + 도넛 차트 검증 (R-01, R-07)
  report.assertions.y2kDashboard = await evaluate(`(() => {
    const sel = document.querySelector('[data-hud-style-select]');
    sel.value = 'y2k-chrome';
    sel.dispatchEvent(new Event('change'));
    document.querySelector('[data-hud-domain="dashboard"]').click();
    const circle = document.querySelector('[data-dash-trend-slot] circle');
    const computedFill = circle ? getComputedStyle(circle).fill : '';
    const hasDonut = Boolean(document.querySelector('.dash-donut-svg'));
    const rangeTabsValid = [...document.querySelectorAll('.dash-range-tabs [data-dash-range]')]
      .every(el => el.getAttribute('role') === 'tab');
    return { computedFill, notBlack: computedFill !== 'rgb(0, 0, 0)', hasDonut, rangeTabsValid };
  })()`);

  // 4. 게임 캔버스 풀블리드 (좌우 필러박스 0) + 인터랙션 + 스펙 서랍 종합 검증 (C-02, C-03, R-03, R-07)
  await evaluate(`(() => {
    const sel = document.querySelector('[data-hud-style-select]');
    sel.value = 'pixel-arcade';
    sel.dispatchEvent(new Event('change'));
    document.querySelector('[data-hud-domain="game"]').click();
  })()`);
  await pause(140);

  report.assertions.gameAndDrawer = await evaluate(`(async () => {
    const canvas = document.querySelector('.game-target-canvas');
    const svg = canvas.querySelector('.art-svg');
    const cRect = canvas.getBoundingClientRect();
    const sRect = svg.getBoundingClientRect();
    const aspectRatio = Number((sRect.width / sRect.height).toFixed(3));
    const widthDelta = Math.abs(cRect.width - sRect.width);

    const hpBefore = document.querySelector('[data-boss-hp-text]').textContent;
    canvas.click();
    const hpAfter = document.querySelector('[data-boss-hp-text]').textContent;

    document.querySelector('[data-hud-open-drawer]').click();
    const drawer = document.querySelector('#studio-spec-drawer');
    const drawerOpen = drawer.open;
    const monoText = drawer.querySelector('[data-drawer-mono]')?.textContent?.trim();

    // 스와치 클릭 → 토스트가 Top Layer(popover-open 또는 dialog 내부)에서 최상단 가시성 확보
    drawer.querySelector('[data-drawer-hex]').click();
    await new Promise(r => setTimeout(r, 80));
    const toast = document.querySelector('#studio-toast');
    const toastPopoverOpen = Boolean(toast?.matches?.(':popover-open'));
    const toastRect = toast?.getBoundingClientRect();
    const toastVisible = Boolean(toast?.classList.contains('is-visible') && toastRect && toastRect.width > 40 && toastRect.height > 20);

    // KO/EN 전환 시 스크롤 및 포커스 보존 + DNA 언어 동기화
    const body = drawer.querySelector('.studio-drawer-body');
    body.scrollTop = 360;
    const scrollBefore = body.scrollTop;
    const enBtn = drawer.querySelector('[data-drawer-lang="en"]');
    enBtn.focus();
    enBtn.click();
    const bodyAfter = drawer.querySelector('.studio-drawer-body');
    const scrollAfter = bodyAfter.scrollTop;
    const focusPreserved = document.activeElement?.dataset?.drawerLang === 'en';
    const enPhilosophy = drawer.querySelector('[data-drawer-philosophy]')?.textContent || '';
    const philosophyIsEnglish = !/[가-힣]/.test(enPhilosophy) && enPhilosophy.length > 20;
    const langHasAriaPressed = drawer.querySelector('[data-drawer-lang="en"]')?.getAttribute('aria-pressed') === 'true';

    // 모달 열림 중 배경 스테이지 단축키(2, ]) 차단 검증
    const styleBeforeKey = document.body.dataset.style;
    const domainBeforeKey = document.body.dataset.domain;
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ']', bubbles: true }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: '2', bubbles: true }));
    const blockedShortcuts = document.body.dataset.style === styleBeforeKey
      && document.body.dataset.domain === domainBeforeKey;

    return {
      aspectRatio,
      noPillarbox: Math.abs(aspectRatio - 1.5) < 0.04 && widthDelta <= 8,
      hpChanged: hpBefore !== hpAfter,
      drawerOpen,
      monoText,
      monoCorrect: monoText === 'Press Start 2P + JetBrains Mono',
      toastPopoverOpen,
      toastVisible,
      scrollBefore,
      scrollAfter,
      scrollPreserved: scrollBefore > 0 && Math.abs(scrollAfter - scrollBefore) <= 2,
      focusPreserved,
      philosophyIsEnglish,
      langHasAriaPressed,
      blockedShortcuts
    };
  })()`);

  await pause(120);
  await snap('11-showcase-spec-drawer');

  // 5. 모바일 360px 쇼케이스 4대 도메인 넘침 & 하단 HUD 패딩 확보 검증 (R-07.2)
  await evaluate('document.querySelector("#studio-spec-drawer").close()');
  await setViewport(360, 800);
  const mobileChecks = [];
  for (const domainId of DOMAIN_IDS) {
    await evaluate(`document.querySelector('[data-hud-domain="${domainId}"]').click()`);
    await pause(70);
    const sample = await evaluate(`(() => {
      const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      const stagePadBottom = Number.parseFloat(getComputedStyle(document.querySelector('#showcase-stage')).paddingBottom);
      const hudRect = document.querySelector('.studio-hud')?.getBoundingClientRect();
      const hudHeight = hudRect ? Math.ceil(hudRect.height) + 12 : 0;
      return { overflow, stagePadBottom, hudHeight, clearsHud: stagePadBottom >= hudHeight };
    })()`);
    mobileChecks.push({ domainId, ...sample });
    if (sample.overflow > 1 || !sample.clearsHud) {
      report.overflowIssues.push({ page: 'showcase-360', domainId, ...sample });
    }
  }
  report.assertions.mobile360 = mobileChecks;

  writeFileSync(resolve(artifactsDir, 'report.json'), JSON.stringify(report, null, 2));

  const g = report.assertions.gallery;
  const y = report.assertions.y2kDashboard;
  const gd = report.assertions.gameAndDrawer;

  const failedChecks = [];
  if (report.runtimeErrors.length) failedChecks.push('runtimeErrors');
  if (report.consoleErrors.length) failedChecks.push('consoleErrors');
  if (report.httpErrors.length) failedChecks.push('httpErrors');
  if (report.overflowIssues.length) failedChecks.push('overflowIssues');
  if (!g.linksBlank || g.audioCount !== 0 || g.nonTabInTablist !== 0 || !g.focusKeptOnGroupTab || !g.focusKeptOnBookmark) {
    failedChecks.push('galleryAssertions');
  }
  if (!y.notBlack || !y.hasDonut || !y.rangeTabsValid) {
    failedChecks.push('y2kDashboardAssertions');
  }
  if (!gd.noPillarbox || !gd.hpChanged || !gd.drawerOpen || !gd.monoCorrect || !gd.toastVisible || !gd.scrollPreserved || !gd.focusPreserved || !gd.philosophyIsEnglish || !gd.langHasAriaPressed || !gd.blockedShortcuts) {
    failedChecks.push('gameAndDrawerAssertions');
  }

  console.log(`✅ Production Chrome QA: ${report.showcaseChecks} showcases checked, ${report.runtimeErrors.length} exceptions, ${report.consoleErrors.length} console errors, ${report.httpErrors.length} HTTP>=400, ${report.overflowIssues.length} layout issues.`);
  if (failedChecks.length) {
    console.error('❌ Failed QA assertions:', failedChecks);
    console.error(JSON.stringify(report, null, 2));
    process.exitCode = 1;
  }
} finally {
  socket?.close();
  chrome.kill('SIGTERM');
  server.kill('SIGTERM');
  await pause(250);
  try {
    rmSync(chromeProfile, { recursive: true, force: true, maxRetries: 6, retryDelay: 120 });
  } catch {
    /* OS tmpdir 정리 실패는 비치명적 */
  }
}
