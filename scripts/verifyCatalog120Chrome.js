#!/usr/bin/env node

import { spawn, spawnSync } from 'node:child_process';
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync
} from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  getAllStyles,
  getCategories,
  getStylesByCategory
} from '../src/catalog/index.js';
import {
  EXPANSION_PACK_MANIFESTS,
  EXPANSION_PREVIEW_BLUEPRINTS
} from '../src/catalog/packs/expansion/index.js';

const PROJECT_ROOT = fileURLToPath(new URL('..', import.meta.url));
const CHROME_PATH = process.env.DSS_CHROME_PATH || '/usr/bin/google-chrome';
const ALL_STYLES = getAllStyles();
const EXPANSION_IDS = Object.freeze(
  EXPANSION_PACK_MANIFESTS.flatMap(pack => pack.styleIds)
);
const ARCHETYPE_IDS = Object.freeze([
  'game',
  'web',
  'mobile',
  'ecommerce',
  'blog',
  'dashboard',
  'media',
  'chat'
]);
const WEB_TABS = Object.freeze(['hero', 'widget', 'form', 'pricing']);
const VIEW_MODES = Object.freeze(['GRID', 'BENTO', 'SPECTRUM']);
const RESPONSIVE_WIDTHS = Object.freeze([375, 768, 1024, 1440]);
const REPRESENTATIVE_ID = 'spatial-glass-ui';
const EXPECTED_STATE_COUNT = ALL_STYLES.length * ARCHETYPE_IDS.length * 2;

const artifactOption = process.argv.find(argument => argument.startsWith('--artifacts='));
const artifactValue = artifactOption?.slice('--artifacts='.length);
const artifactDirectory = artifactValue
  ? (isAbsolute(artifactValue) ? artifactValue : resolve(artifactValue))
  : join(PROJECT_ROOT, '.antigravity', 'archive', 'catalog120-chrome-qa');

const runtimeSignals = {
  consoleWarnings: [],
  consoleErrors: [],
  exceptions: [],
  networkFailures: [],
  httpErrors: []
};
const issues = [];
const requestUrls = [];
const interactionSamples = [];
const report = {
  checkedAt: new Date().toISOString(),
  chromeVersion: null,
  isolatedProfile: true,
  catalog: {
    count: ALL_STYLES.length,
    expansionCount: EXPANSION_IDS.length,
    categoryCounts: Object.fromEntries(
      getCategories().map(category => [category.id, getStylesByCategory(category.id).length])
    ),
    grammarCount: new Set(EXPANSION_PREVIEW_BLUEPRINTS.map(item => item.grammarId)).size
  },
  initial: null,
  galleryModes: [],
  matrix: null,
  responsiveWidths: [],
  representativeDetail: null,
  split: null,
  peek: null,
  dock: null,
  reducedMotion: null,
  vitals: null,
  lazyCss: null,
  interactions: null,
  runtimeSignals,
  screenshots: [],
  issues
};

let viteProcess;
let chromeProcess;
let client;
let profileDirectory;
let trustedGesturePrimed = false;

function sleep(milliseconds) {
  return new Promise(resolveSleep => setTimeout(resolveSleep, milliseconds));
}

function check(condition, message) {
  if (!condition) issues.push(message);
}

function summarizeTimings(samples) {
  const normalized = samples.map(Number).filter(Number.isFinite);
  return {
    count: normalized.length,
    averageMs: Number((normalized.reduce((sum, value) => sum + value, 0) / Math.max(1, normalized.length)).toFixed(2)),
    maxMs: Number(Math.max(0, ...normalized).toFixed(2))
  };
}

function getFreePort() {
  return new Promise((resolvePort, reject) => {
    const server = createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : null;
      server.close(error => error ? reject(error) : resolvePort(port));
    });
  });
}

async function waitForHttp(url, label, timeout = 15_000) {
  const deadline = Date.now() + timeout;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      lastError = new Error(`${label}: HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await sleep(100);
  }
  throw new Error(`${label} 준비 실패: ${lastError?.message || 'timeout'}`);
}

async function stopProcess(processHandle) {
  if (!processHandle || processHandle.exitCode !== null) return;
  processHandle.kill('SIGTERM');
  await Promise.race([
    new Promise(resolveExit => processHandle.once('exit', resolveExit)),
    sleep(2_500)
  ]);
  if (processHandle.exitCode === null) {
    processHandle.kill('SIGKILL');
    await Promise.race([
      new Promise(resolveExit => processHandle.once('exit', resolveExit)),
      sleep(1_000)
    ]);
  }
}

class CdpClient {
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
  }

  async connect() {
    this.socket = new WebSocket(this.url);
    await new Promise((resolveConnection, reject) => {
      const timer = setTimeout(() => reject(new Error('CDP 연결 시간 초과')), 10_000);
      this.socket.addEventListener('open', () => {
        clearTimeout(timer);
        resolveConnection();
      }, { once: true });
      this.socket.addEventListener('error', event => {
        clearTimeout(timer);
        reject(new Error(`CDP 연결 오류: ${event?.message || 'unknown'}`));
      }, { once: true });
    });
    this.socket.addEventListener('message', event => this.handleMessage(event));
    this.socket.addEventListener('close', () => {
      for (const pending of this.pending.values()) pending.reject(new Error('CDP 연결이 닫힘'));
      this.pending.clear();
    });
  }

  handleMessage(event) {
    let message;
    try {
      message = JSON.parse(String(event.data));
    } catch {
      return;
    }
    if (message.id) {
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(message.error.message));
      else pending.resolve(message.result);
      return;
    }
    for (const listener of this.listeners.get(message.method) || []) {
      listener(message.params || {});
    }
  }

  on(method, listener) {
    const listeners = this.listeners.get(method) || [];
    listeners.push(listener);
    this.listeners.set(method, listeners);
  }

  send(method, params = {}) {
    const id = this.nextId;
    this.nextId += 1;
    return new Promise((resolveResult, reject) => {
      this.pending.set(id, { resolve: resolveResult, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.socket?.close();
  }
}

async function evaluate(expression) {
  const result = await client.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  }
  return result.result?.value;
}

async function waitFor(expression, label, timeout = 10_000) {
  const deadline = Date.now() + timeout;
  let lastValue;
  while (Date.now() < deadline) {
    lastValue = await evaluate(expression);
    if (lastValue) return lastValue;
    await sleep(80);
  }
  throw new Error(`${label} 대기 시간 초과: ${JSON.stringify(lastValue)}`);
}

async function clickSelector(selector, { double = false } = {}) {
  const point = await evaluate(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!element) return null;
    element.scrollIntoView({ block: 'center', inline: 'center' });
    const rect = element.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  })()`);
  if (!point) return false;

  if (!trustedGesturePrimed) {
    await client.send('Input.dispatchMouseEvent', {
      type: 'mousePressed', x: point.x, y: point.y, button: 'left', clickCount: double ? 2 : 1
    });
    await client.send('Input.dispatchMouseEvent', {
      type: 'mouseReleased', x: point.x, y: point.y, button: 'left', clickCount: double ? 2 : 1
    });
    trustedGesturePrimed = true;
    return true;
  }

  return evaluate(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!element) return false;
    const started = performance.now();
    if (${double}) {
      element.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, cancelable: true, view: window }));
    } else {
      element.click();
    }
    window.__dssLastInteractionMs = performance.now() - started;
    return true;
  })()`);
}

async function setViewport(width, height = 1_050) {
  await client.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
    screenWidth: width,
    screenHeight: height
  });
  await waitFor(`innerWidth === ${width}`, `${width}px viewport`);
  await sleep(100);
}

async function setSearch(value) {
  const duration = await evaluate(`(async () => {
    const input = document.querySelector('#search-input');
    if (!input) throw new Error('검색 input 누락');
    const started = performance.now();
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, ${JSON.stringify(value)});
    input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    return performance.now() - started;
  })()`);
  interactionSamples.push(duration);
}

async function captureScreenshot(name) {
  const screenshot = await client.send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: false
  });
  const path = join(artifactDirectory, `${name}.png`);
  writeFileSync(path, Buffer.from(screenshot.data, 'base64'));
  report.screenshots.push(path);
}

function bindRuntimeDiagnostics() {
  client.on('Runtime.consoleAPICalled', params => {
    const message = (params.args || [])
      .map(argument => argument.value ?? argument.description ?? '')
      .join(' ');
    if (params.type === 'warning') runtimeSignals.consoleWarnings.push(message);
    if (params.type === 'error' || params.type === 'assert') runtimeSignals.consoleErrors.push(message);
  });
  client.on('Runtime.exceptionThrown', params => {
    runtimeSignals.exceptions.push(
      params.exceptionDetails?.exception?.description || params.exceptionDetails?.text || 'unknown exception'
    );
  });
  client.on('Log.entryAdded', params => {
    const entry = params.entry || {};
    if (entry.level === 'warning') runtimeSignals.consoleWarnings.push(entry.text || 'warning');
    if (entry.level === 'error') runtimeSignals.consoleErrors.push(entry.text || 'error');
  });
  client.on('Network.requestWillBeSent', params => requestUrls.push(params.request?.url || ''));
  client.on('Network.loadingFailed', params => {
    if (!params.canceled && params.errorText !== 'net::ERR_ABORTED') {
      runtimeSignals.networkFailures.push(`${params.type || 'resource'}: ${params.errorText}`);
    }
  });
  client.on('Network.responseReceived', params => {
    const status = params.response?.status || 0;
    if (status >= 400) runtimeSignals.httpErrors.push(`${status} ${params.response.url}`);
  });
}

async function verifyInitialAndGallery() {
  await waitFor(
    `document.readyState === 'complete' && document.querySelectorAll('#main-root [data-result-id]').length === 36`,
    'actual 120 첫 페이지',
    15_000
  );
  const initialRequestUrls = [...requestUrls];
  report.initial = await evaluate(`(() => ({
    visible: document.querySelectorAll('#main-root [data-result-id]').length,
    unique: new Set([...document.querySelectorAll('#main-root [data-result-id]')]
      .map(node => node.dataset.resultId)).size,
    total: Number(document.querySelector('#main-root .gallery-wrapper')?.dataset.resultCount || 0),
    thumbnails: document.querySelectorAll('#main-root .style-thumb').length,
    header120: (document.querySelector('.brand-subtitle')?.textContent || '').includes('120종'),
    filter120: (document.querySelector('[data-filter="ALL"]')?.textContent || '').includes('120종'),
    pagination: Boolean(document.querySelector('#main-root .gallery-pagination')),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
  }))()`);
  check(report.initial.visible === 36 && report.initial.unique === 36, '초기 DOM 36개 상한 실패');
  check(report.initial.total === 120 && report.initial.pagination, '초기 actual 120 총량 또는 pager 실패');
  check(report.initial.thumbnails === 36, `초기 thumbnail ${report.initial.thumbnails}/36`);
  check(report.initial.header120 && report.initial.filter120, 'header/filter actual 120 표기 실패');
  check(report.initial.overflow <= 1, `초기 overflow ${report.initial.overflow}px`);

  // Core Web Vitals는 QA의 페이지·모달 전환이 시작되기 전 초기 로드 구간에서 동결한다.
  await sleep(400);
  report.vitals = await evaluate(`(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paints = performance.getEntriesByType('paint');
    const lcp = window.__dssCatalog120Vitals?.lcp
      || paints.find(entry => entry.name === 'first-contentful-paint')?.startTime
      || navigation?.domContentLoadedEventEnd
      || 0;
    return {
      lcpMs: Math.round(lcp),
      cls: Number((window.__dssCatalog120Vitals?.cls || 0).toFixed(4))
    };
  })()`);

  const initialExpansionCss = initialRequestUrls.filter(url => (
    url.includes('themeTokensExpansion') || url.includes('expansion-preview')
  ));
  check(initialExpansionCss.length === 0, `초기 경로에서 expansion CSS 요청: ${initialExpansionCss.join(', ')}`);

  for (const mode of VIEW_MODES) {
    const started = await evaluate('performance.now()');
    await clickSelector(`.view-mode-btn[data-mode="${mode}"]`);
    await waitFor(
      `document.querySelector('.view-mode-btn[data-mode="${mode}"]')?.getAttribute('aria-pressed') === 'true'`,
      `${mode} 보기`
    );
    interactionSamples.push((await evaluate('performance.now()')) - started);

    const ids = [];
    const expansionThumbIds = [];
    let pageCount = 0;
    let maxVisible = 0;
    while (true) {
      const page = await evaluate(`(() => {
        const cards = [...document.querySelectorAll('#main-root [data-result-id]')];
        return {
          ids: cards.map(card => card.dataset.resultId),
          expansionThumbIds: cards
            .filter(card => card.querySelector('[class*="thumb-e120-"]'))
            .map(card => card.dataset.resultId),
          canNext: Boolean(document.querySelector('#main-root [data-gallery-page="next"]:not(:disabled)')),
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
        };
      })()`);
      pageCount += 1;
      maxVisible = Math.max(maxVisible, page.ids.length);
      ids.push(...page.ids);
      expansionThumbIds.push(...page.expansionThumbIds);
      check(page.overflow <= 1, `${mode} ${pageCount}페이지 overflow ${page.overflow}px`);
      if (!page.canNext) break;
      const pageStarted = await evaluate('performance.now()');
      await clickSelector('#main-root [data-gallery-page="next"]');
      await waitFor(
        `document.activeElement?.classList.contains('gallery-page-status')`,
        `${mode} 다음 페이지`
      );
      interactionSamples.push((await evaluate('performance.now()')) - pageStarted);
    }
    const result = {
      mode,
      pageCount,
      maxVisible,
      reachableCount: ids.length,
      reachableUnique: new Set(ids).size,
      expansionThumbnailCount: new Set(expansionThumbIds).size
    };
    report.galleryModes.push(result);
    check(result.pageCount === 4, `${mode} 페이지 ${result.pageCount}/4`);
    check(result.maxVisible <= 36, `${mode} DOM 상한 ${result.maxVisible}/36`);
    check(result.reachableCount === 120 && result.reachableUnique === 120, `${mode} actual 120 전체 도달 실패`);
    check(result.expansionThumbnailCount === 84, `${mode} 신규 thumbnail ${result.expansionThumbnailCount}/84`);
  }
  report.lazyCss = { initialRequests: initialExpansionCss, afterMatrixRequests: [] };
}

async function runActualMatrixInPage(archetypeIds, webTabs, expansionIds) {
  const [dataModule, archetypeModule] = await Promise.all([
    import('/src/data/categories.js'),
    import('/src/components/archetypeTemplates.js')
  ]);
  const styles = dataModule.getAllSubDesigns();
  const expansionIdSet = new Set(expansionIds);
  const host = document.createElement('section');
  host.id = 'catalog120-matrix-lab';
  host.setAttribute('aria-hidden', 'true');
  Object.assign(host.style, {
    position: 'absolute',
    left: '-12000px',
    top: '0',
    display: 'block',
    visibility: 'hidden',
    maxWidth: 'none'
  });
  document.body.appendChild(host);

  const failures = [];
  const grammarIds = new Set();
  let stateCount = 0;
  let devicePairCount = 0;
  let webTabCount = 0;
  let expansionGridChanges = 0;
  let expansionWebStates = 0;
  let minDesktopWidth = Infinity;
  let maxMobileWidth = 0;
  const started = performance.now();

  for (const style of styles) {
    const isExpansion = expansionIdSet.has(style.id);
    for (const archetypeId of archetypeIds) {
      let desktop = null;
      for (const device of ['desktop', 'mobile']) {
        host.className = `mockup-viewport ${device}`;
        host.style.width = device === 'desktop' ? '760px' : '360px';
        host.dataset.theme = style.id;
        host.dataset.archetype = archetypeId;
        host.innerHTML = archetypeModule.getArchetypeHTML(archetypeId, style, { tab: 'hero' });
        const root = host.querySelector(`.archetype-unit[data-archetype="${archetypeId}"]`);
        const rect = root?.getBoundingClientRect();
        const snapshot = {
          width: Math.round(rect?.width || 0),
          htmlLength: root?.innerHTML.trim().length || 0,
          overflow: root ? Math.max(0, root.scrollWidth - root.clientWidth) : 0,
          themeToken: getComputedStyle(host).getPropertyValue('--theme-accent').trim(),
          expansionUnit: Boolean(root?.querySelector(`.e120-${style.id}-unit`)),
          expansionGrid: root?.querySelector('.e120-stage')
            ? getComputedStyle(root.querySelector('.e120-stage')).gridTemplateColumns
            : null,
          fallback: Boolean(root?.querySelector('[data-preview-fallback]'))
        };
        stateCount += 1;
        if (!root || snapshot.width <= 0 || snapshot.htmlLength === 0 || snapshot.fallback || !snapshot.themeToken) {
          failures.push({ styleId: style.id, archetypeId, device, ...snapshot });
        }
        if (isExpansion && archetypeId === 'web') {
          expansionWebStates += 1;
          const grammar = root?.querySelector('.e120-unit')?.dataset.grammar || null;
          if (grammar) grammarIds.add(grammar);
          if (!snapshot.expansionUnit) failures.push({ styleId: style.id, archetypeId, device, reason: 'expansion-unit-missing' });
        }
        if (device === 'desktop') {
          desktop = snapshot;
          minDesktopWidth = Math.min(minDesktopWidth, snapshot.width);
        } else {
          maxMobileWidth = Math.max(maxMobileWidth, snapshot.width);
          devicePairCount += 1;
          if (!desktop || desktop.width - snapshot.width < 100 || snapshot.width > 360) {
            failures.push({
              styleId: style.id,
              archetypeId,
              reason: 'desktop-mobile-width',
              desktopWidth: desktop?.width || 0,
              mobileWidth: snapshot.width
            });
          }
          if (isExpansion && archetypeId === 'web' && desktop?.expansionGrid !== snapshot.expansionGrid) {
            expansionGridChanges += 1;
          }
        }
      }
    }

    for (const tab of webTabs) {
      host.className = 'mockup-viewport desktop';
      host.style.width = '760px';
      host.dataset.theme = style.id;
      host.dataset.archetype = 'web';
      host.innerHTML = archetypeModule.getArchetypeHTML('web', style, { tab });
      const preview = host.querySelector('.mockup-unit');
      webTabCount += 1;
      const invalidExpansionTab = isExpansion && preview?.dataset.previewTab !== tab;
      if (!preview || preview.innerHTML.trim().length === 0 || preview.matches('[data-preview-fallback]') || invalidExpansionTab) {
        failures.push({ styleId: style.id, tab, reason: 'web-tab' });
      }
    }
  }

  host.remove();
  return {
    styleCount: styles.length,
    archetypeCount: archetypeIds.length,
    stateCount,
    devicePairCount,
    webTabCount,
    expansionWebStates,
    expansionGridChanges,
    grammarCount: grammarIds.size,
    minDesktopWidth,
    maxMobileWidth,
    durationMs: Number((performance.now() - started).toFixed(2)),
    failureCount: failures.length,
    failures: failures.slice(0, 30)
  };
}

async function verifyMatrixAndLazyCss() {
  report.matrix = await evaluate(
    `(${runActualMatrixInPage.toString()})(${JSON.stringify(ARCHETYPE_IDS)}, ${JSON.stringify(WEB_TABS)}, ${JSON.stringify(EXPANSION_IDS)})`
  );
  check(report.matrix.styleCount === 120, `matrix styles ${report.matrix.styleCount}/120`);
  check(report.matrix.stateCount === EXPECTED_STATE_COUNT, `matrix states ${report.matrix.stateCount}/${EXPECTED_STATE_COUNT}`);
  check(report.matrix.devicePairCount === 960, `matrix device pairs ${report.matrix.devicePairCount}/960`);
  check(report.matrix.webTabCount === 480, `matrix Web tabs ${report.matrix.webTabCount}/480`);
  check(report.matrix.expansionWebStates === 168, `matrix expansion Web states ${report.matrix.expansionWebStates}/168`);
  check(report.matrix.expansionGridChanges === 84, `신규 Desktop/Mobile grid 변화 ${report.matrix.expansionGridChanges}/84`);
  check(report.matrix.grammarCount === 21, `browser grammar ${report.matrix.grammarCount}/21`);
  check(report.matrix.failureCount === 0, `matrix 실패 ${report.matrix.failureCount}개`);

  report.lazyCss.afterMatrixRequests = requestUrls.filter(url => (
    url.includes('themeTokensExpansion') || url.includes('expansion-preview')
  ));
  check(
    report.lazyCss.afterMatrixRequests.some(url => url.includes('themeTokensExpansion')),
    'matrix/detail 경계에서 expansion theme CSS 요청 누락'
  );
  check(
    report.lazyCss.afterMatrixRequests.some(url => url.includes('expansion-preview')),
    'matrix/detail 경계에서 expansion preview CSS 요청 누락'
  );
}

async function verifyResponsive() {
  await setSearch('');
  await clickSelector('.view-mode-btn[data-mode="GRID"]');
  await waitFor(`document.querySelectorAll('#main-root [data-result-id]').length === 36`, '반응형 첫 페이지');
  for (const width of RESPONSIVE_WIDTHS) {
    await setViewport(width, width === 375 ? 950 : 1_050);
    const result = await evaluate(`(() => {
      const controls = [...document.querySelectorAll(
        '.view-mode-btn, .filter-tag-btn, .gallery-page-btn:not(:disabled), #search-input'
      )].filter(element => {
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && getComputedStyle(element).visibility !== 'hidden';
      });
      return {
        width: innerWidth,
        visible: document.querySelectorAll('#main-root [data-result-id]').length,
        total: Number(document.querySelector('#main-root .gallery-wrapper')?.dataset.resultCount || 0),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        unlabeled: controls.filter(element => (
          element.tagName === 'INPUT'
            ? !element.labels.length && !element.getAttribute('aria-label')
            : !element.textContent.trim() && !element.getAttribute('aria-label')
        )).length
      };
    })()`);
    report.responsiveWidths.push(result);
    check(result.visible === 36 && result.total === 120, `${width}px actual 120/36 계약 실패`);
    check(result.overflow <= 1, `${width}px overflow ${result.overflow}px`);
    check(result.unlabeled === 0, `${width}px unlabeled control ${result.unlabeled}개`);
  }
  await setViewport(1440, 1_100);
}

async function measureRepresentativeDevice(device) {
  await clickSelector(`.device-btn[data-device="${device}"]`);
  await waitFor(
    `document.querySelector('#mockup-viewport')?.classList.contains('${device}')`,
    `${REPRESENTATIVE_ID} ${device}`
  );
  await sleep(80);
  return evaluate(`(() => {
    const viewport = document.querySelector('#mockup-viewport');
    const unit = viewport?.querySelector('.e120-${REPRESENTATIVE_ID}-unit');
    const stage = unit?.querySelector('.e120-stage');
    const rect = unit?.getBoundingClientRect();
    const clipped = [...(unit?.querySelectorAll('button, input, select, a[href]') || [])]
      .filter(control => {
        const controlRect = control.getBoundingClientRect();
        return controlRect.width > 0 && controlRect.height > 0 && (
          controlRect.left < rect.left - 1 || controlRect.right > rect.right + 1 ||
          controlRect.top < rect.top - 1 || controlRect.bottom > rect.bottom + 1
        );
      }).length;
    return {
      device: ${JSON.stringify(device)},
      width: Math.round(rect?.width || 0),
      grid: stage ? getComputedStyle(stage).gridTemplateColumns : null,
      active: Boolean(document.querySelector('.device-btn[data-device="${device}"].active')),
      clipped,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    };
  })()`);
}

async function verifyRepresentativeFlows() {
  await setSearch(REPRESENTATIVE_ID);
  await waitFor(`document.querySelectorAll('#main-root [data-result-id]').length === 1`, '대표 신규 검색');
  await clickSelector(`.view-mode-btn[data-mode="BENTO"]`);
  const tileSelector = `.bento-item-card[data-sub-id="${REPRESENTATIVE_ID}"]`;
  await waitFor(`Boolean(document.querySelector(${JSON.stringify(tileSelector)}))`, '대표 신규 tile');

  const detailStarted = await evaluate('performance.now()');
  await clickSelector(tileSelector, { double: true });
  await waitFor(
    `document.querySelector('#mockup-viewport')?.dataset.theme === '${REPRESENTATIVE_ID}'`,
    '대표 신규 Detail',
    15_000
  );
  interactionSamples.push((await evaluate('performance.now()')) - detailStarted);
  await clickSelector('.archetype-tab-btn[data-archetype="web"]');
  await waitFor(`Boolean(document.querySelector('.e120-${REPRESENTATIVE_ID}-unit'))`, '대표 신규 Web');

  const desktop = await measureRepresentativeDevice('desktop');
  await captureScreenshot('spatial-glass-ui-desktop');
  const mobile = await measureRepresentativeDevice('mobile');
  await captureScreenshot('spatial-glass-ui-mobile');
  const selectorState = await evaluate(`(() => ({
    chipCount: document.querySelectorAll('#top-style-selector .top-style-chip').length,
    selectedCount: document.querySelectorAll('#top-style-selector .top-style-chip[aria-selected="true"]').length,
    categoryId: document.querySelector('#top-style-selector')?.dataset.categoryId || null
  }))()`);
  report.representativeDetail = { id: REPRESENTATIVE_ID, desktop, mobile, selector: selectorState };
  check(desktop.active && mobile.active, '대표 Detail device active 상태 실패');
  check(desktop.width - mobile.width >= 200, `대표 Desktop/Mobile 폭 차이 ${desktop.width - mobile.width}px`);
  check(desktop.grid !== mobile.grid, `대표 Desktop/Mobile grid 동일: ${desktop.grid}`);
  check(desktop.clipped === 0 && mobile.clipped === 0, '대표 Detail control clipping 발생');
  check(desktop.overflow <= 1 && mobile.overflow <= 1, '대표 Detail 가로 overflow 발생');
  check(selectorState.chipCount === 15 && selectorState.selectedCount === 1, '대표 Detail category 15종 selector 실패');

  await clickSelector('#btn-modal-compare');
  await waitFor(`document.querySelectorAll('.split-viewport').length === 2`, 'actual 120 Split', 15_000);
  report.split = await evaluate(`(() => ({
    optionA: document.querySelectorAll('#select-style-a option').length,
    optionB: document.querySelectorAll('#select-style-b option').length,
    visualA: document.querySelectorAll('#split-picker-a .split-pick-thumb').length,
    visualB: document.querySelectorAll('#split-picker-b .split-pick-thumb').length,
    roots: [...document.querySelectorAll('.split-viewport')]
      .map(view => Boolean(view.querySelector('.archetype-unit, .mockup-unit'))),
    themes: [...document.querySelectorAll('.split-viewport')].map(view => view.dataset.theme),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
  }))()`);
  check(report.split.optionA === 120 && report.split.optionB === 120, 'Split native option 120 실패');
  check(report.split.visualA <= 12 && report.split.visualB <= 12, 'Split visual picker 12 상한 실패');
  check(report.split.roots.every(Boolean) && report.split.themes.includes(REPRESENTATIVE_ID), 'Split 대표 신규 renderer 실패');
  check(report.split.overflow <= 1, `Split overflow ${report.split.overflow}px`);
  await captureScreenshot('catalog120-split');

  await clickSelector('#btn-compare-close');
  await waitFor(`Boolean(document.querySelector('#mockup-viewport'))`, 'Split에서 Detail 복귀');
  await clickSelector('#btn-modal-close');
  await waitFor(`Boolean(document.querySelector(${JSON.stringify(tileSelector)}))`, '대표 신규 gallery 복귀');

  await evaluate(`document.querySelector(${JSON.stringify(tileSelector)})?.focus()`);
  await waitFor(
    `Boolean(document.querySelector('#peek-viewport:not([aria-busy]) .e120-${REPRESENTATIVE_ID}-unit'))`,
    '대표 신규 Peek',
    15_000
  );
  report.peek = await evaluate(`(() => ({
    theme: document.querySelector('#peek-viewport')?.dataset.theme || null,
    root: Boolean(document.querySelector('#peek-viewport .e120-${REPRESENTATIVE_ID}-unit')),
    busy: document.querySelector('#peek-viewport')?.getAttribute('aria-busy') || null
  }))()`);
  check(report.peek.root && report.peek.busy === null, '대표 신규 Peek 실패');

  await clickSelector(tileSelector);
  await waitFor(`Boolean(document.querySelector('#dock-confirm'))`, '대표 신규 Dock');
  await clickSelector('#dock-confirm');
  await waitFor(
    `Boolean(document.querySelector('#confirm-preview:not([aria-busy]) .e120-${REPRESENTATIVE_ID}-unit'))`,
    '대표 신규 confirm preview',
    15_000
  );
  report.dock = await evaluate(`(() => ({
    dialog: document.querySelector('.confirm-sheet')?.getAttribute('role') || null,
    root: Boolean(document.querySelector('#confirm-preview .e120-${REPRESENTATIVE_ID}-unit')),
    busy: document.querySelector('#confirm-preview')?.getAttribute('aria-busy') || null
  }))()`);
  check(report.dock.dialog === 'dialog' && report.dock.root && report.dock.busy === null, '대표 신규 Dock/confirm 실패');
  await clickSelector('#confirm-sheet-close');
}

async function verifyReducedMotionAndVitals() {
  await clickSelector(`.bento-item-card[data-sub-id="${REPRESENTATIVE_ID}"]`, { double: true });
  await waitFor(`document.querySelector('#mockup-viewport')?.dataset.theme === '${REPRESENTATIVE_ID}'`, 'reduced motion Detail');
  await clickSelector('.archetype-tab-btn[data-archetype="web"]');
  await waitFor(`Boolean(document.querySelector('.e120-${REPRESENTATIVE_ID}-unit'))`, 'reduced motion Web');
  await client.send('Emulation.setEmulatedMedia', {
    media: '',
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
  });
  await sleep(120);
  report.reducedMotion = await evaluate(`(() => {
    const unit = document.querySelector('.e120-${REPRESENTATIVE_ID}-unit');
    const running = [...unit.querySelectorAll('*')]
      .flatMap(element => element.getAnimations())
      .filter(animation => animation.playState === 'running');
    return {
      matches: matchMedia('(prefers-reduced-motion: reduce)').matches,
      runningAnimations: running.length
    };
  })()`);
  check(report.reducedMotion.matches && report.reducedMotion.runningAnimations === 0, '대표 신규 reduced-motion 실패');
  await client.send('Emulation.setEmulatedMedia', { media: '', features: [] });
  await clickSelector('#btn-modal-close');

  check(report.vitals.lcpMs <= 2_500, `LCP ${report.vitals.lcpMs}ms/2500ms`);
  check(report.vitals.cls <= 0.1, `CLS ${report.vitals.cls}/0.1`);
}

function finalizeReport() {
  report.interactions = summarizeTimings(interactionSamples);
  check(report.interactions.maxMs <= 200, `interaction max ${report.interactions.maxMs}ms/200ms`);
  check(runtimeSignals.consoleWarnings.length === 0, `console warning ${runtimeSignals.consoleWarnings.length}개`);
  check(runtimeSignals.consoleErrors.length === 0, `console error ${runtimeSignals.consoleErrors.length}개`);
  check(runtimeSignals.exceptions.length === 0, `page exception ${runtimeSignals.exceptions.length}개`);
  check(runtimeSignals.networkFailures.length === 0, `network failure ${runtimeSignals.networkFailures.length}개`);
  check(runtimeSignals.httpErrors.length === 0, `HTTP error ${runtimeSignals.httpErrors.length}개`);
  const diagnosticCount = Object.values(runtimeSignals)
    .reduce((total, entries) => total + entries.length, 0);
  report.summary = {
    actualStyles: report.catalog.count,
    expansionStyles: report.catalog.expansionCount,
    galleryReachability: report.galleryModes.map(mode => `${mode.mode}:${mode.reachableUnique}`),
    matrixStates: report.matrix?.stateCount || 0,
    webTabs: report.matrix?.webTabCount || 0,
    expansionDeviceChanges: report.matrix?.expansionGridChanges || 0,
    responsiveWidths: report.responsiveWidths.length,
    screenshots: report.screenshots.length,
    diagnosticCount,
    issueCount: issues.length,
    passed: issues.length === 0
  };
}

function writeReport() {
  mkdirSync(artifactDirectory, { recursive: true });
  writeFileSync(join(artifactDirectory, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
}

async function main() {
  const chromeVersion = spawnSync(CHROME_PATH, ['--version'], { encoding: 'utf8' });
  if (chromeVersion.status !== 0) throw new Error(`Chrome 실행 파일을 찾을 수 없음: ${CHROME_PATH}`);
  report.chromeVersion = chromeVersion.stdout.trim();
  mkdirSync(artifactDirectory, { recursive: true });

  check(ALL_STYLES.length === 120 && new Set(ALL_STYLES.map(style => style.id)).size === 120, 'Node catalog 120 계약 실패');
  check(EXPANSION_IDS.length === 84, `Node expansion ${EXPANSION_IDS.length}/84`);
  check(Object.values(report.catalog.categoryCounts).every(count => count === 15), 'category별 15종 계약 실패');
  check(report.catalog.grammarCount === 21, `grammar ${report.catalog.grammarCount}/21`);

  const vitePort = await getFreePort();
  const chromePort = await getFreePort();
  const pageUrl = `http://127.0.0.1:${vitePort}/`;
  viteProcess = spawn(
    process.execPath,
    ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(vitePort), '--strictPort'],
    { cwd: PROJECT_ROOT, stdio: ['ignore', 'pipe', 'pipe'] }
  );
  await waitForHttp(pageUrl, 'Vite');

  profileDirectory = mkdtempSync(join(tmpdir(), 'dss-catalog120-chrome-profile-'));
  chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${chromePort}`,
    '--remote-debugging-address=127.0.0.1',
    `--user-data-dir=${profileDirectory}`,
    '--window-size=1440,1100',
    '--disable-background-networking',
    '--disable-component-update',
    '--disable-default-apps',
    '--disable-dev-shm-usage',
    '--disable-extensions',
    '--disable-sync',
    '--metrics-recording-only',
    '--mute-audio',
    '--no-default-browser-check',
    '--no-first-run',
    '--password-store=basic',
    'about:blank'
  ], { cwd: PROJECT_ROOT, stdio: ['ignore', 'pipe', 'pipe'] });

  const versionResponse = await waitForHttp(`http://127.0.0.1:${chromePort}/json/version`, 'Chrome DevTools');
  const protocolVersion = await versionResponse.json();
  const targetResponse = await waitForHttp(`http://127.0.0.1:${chromePort}/json/list`, 'Chrome target');
  const targets = await targetResponse.json();
  const pageTarget = targets.find(target => target.type === 'page');
  if (!pageTarget) throw new Error('Chrome page target이 없음');
  report.protocolBrowser = protocolVersion.Browser;

  client = new CdpClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();
  bindRuntimeDiagnostics();
  await Promise.all([
    client.send('Page.enable'),
    client.send('Runtime.enable'),
    client.send('Network.enable'),
    client.send('Log.enable')
  ]);
  await client.send('Page.addScriptToEvaluateOnNewDocument', {
    source: `(() => {
      window.__dssCatalog120Vitals = { lcp: 0, cls: 0 };
      new PerformanceObserver(list => {
        const entries = list.getEntries();
        window.__dssCatalog120Vitals.lcp = entries.at(-1)?.startTime || 0;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__dssCatalog120Vitals.cls += entry.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
    })()`
  });
  await client.send('Page.navigate', { url: pageUrl });

  await verifyInitialAndGallery();
  await verifyMatrixAndLazyCss();
  await verifyResponsive();
  await verifyRepresentativeFlows();
  await verifyReducedMotionAndVitals();
  finalizeReport();
  writeReport();

  process.stdout.write(
    `actual 120 Chrome QA ${report.summary.passed ? 'PASS' : 'FAIL'}\n`
    + `- Chrome: ${report.chromeVersion}\n`
    + `- catalog/category: ${report.catalog.count} / ${Object.values(report.catalog.categoryCounts).join(',')}\n`
    + `- matrix/Web tabs: ${report.summary.matrixStates} / ${report.summary.webTabs}\n`
    + `- LCP/CLS/interaction max: ${report.vitals.lcpMs}ms / ${report.vitals.cls} / ${report.interactions.maxMs}ms\n`
    + `- diagnostics/issues: ${report.summary.diagnosticCount} / ${report.summary.issueCount}\n`
    + `- report: ${join(artifactDirectory, 'report.json')}\n`
  );
  if (issues.length > 0) {
    process.stderr.write(`${issues.map(issue => `- ${issue}`).join('\n')}\n`);
    process.exitCode = 1;
  }
}

try {
  await main();
} catch (error) {
  report.fatal = error.stack || error.message;
  writeReport();
  process.stderr.write(`${JSON.stringify(report, null, 2)}\n`);
  process.exitCode = 2;
} finally {
  client?.close();
  await stopProcess(chromeProcess);
  await stopProcess(viteProcess);
  if (profileDirectory) rmSync(profileDirectory, { recursive: true, force: true });
}
