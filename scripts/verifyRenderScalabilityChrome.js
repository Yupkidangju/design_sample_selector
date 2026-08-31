#!/usr/bin/env node

import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { analyzeInitialBundle } from './analyzeInitialBundle.js';
import { RENDER_SCALABILITY_BUDGETS } from '../src/scalability/renderWindow.js';

const PROJECT_ROOT = fileURLToPath(new URL('..', import.meta.url));
const CHROME_PATH = process.env.DSS_CHROME_PATH || '/usr/bin/google-chrome';
const RESPONSIVE_WIDTHS = Object.freeze([320, 768, 1024, 1440]);
const VIEW_MODES = Object.freeze(['GRID', 'BENTO', 'SPECTRUM']);
const SYNTHETIC_COUNTS = Object.freeze([60, 120]);
const ARTIFACT_OPTION = process.argv.find(argument => argument.startsWith('--artifacts='));
const artifactValue = ARTIFACT_OPTION?.slice('--artifacts='.length);
const artifactDirectory = artifactValue
  ? (isAbsolute(artifactValue) ? artifactValue : resolve(artifactValue))
  : join(PROJECT_ROOT, '.antigravity', 'archive', 'render-scalability-chrome-qa');

const runtimeSignals = {
  consoleWarnings: [],
  consoleErrors: [],
  exceptions: [],
  networkFailures: [],
  httpErrors: []
};
const issues = [];
const report = {
  checkedAt: new Date().toISOString(),
  chromeVersion: null,
  isolatedProfile: true,
  timingMethod: {
    metric: 'processingMs',
    hardGateBoundary: 'input dispatch -> required state/DOM predicate settlement',
    presentationBoundary: 'settlement -> requested animation frames'
  },
  bundle: null,
  vitals: null,
  initialRequests: [],
  core: {
    galleryModes: [],
    interactions: {},
    lazyLoading: {},
    detail: null,
    split: null,
    selection: null,
    responsiveWidths: [],
    reducedMotion: null
  },
  synthetic: [],
  accessibilityIssues: [],
  runtimeSignals,
  screenshots: [],
  issues
};

let previewProcess;
let devProcess;
let chromeProcess;
let profileDirectory;
let client;
let requestPhase = 'idle';
let intentionalComponentBlock = false;
let interceptedComponentFailures = 0;
const requestUrls = new Map();

function sleep(milliseconds) {
  return new Promise(resolveSleep => setTimeout(resolveSleep, milliseconds));
}

function check(condition, message) {
  if (!condition) issues.push(message);
}

function percentileMedian(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

function summarizeTimings(samples) {
  const rounded = samples.map(value => Number(value.toFixed(2)));
  return {
    samples: rounded,
    medianMs: Number(percentileMedian(rounded).toFixed(2)),
    maximumMs: Number(Math.max(...rounded, 0).toFixed(2))
  };
}

function summarizeMeasurements(samples) {
  const normalized = samples.map(value => (
    value && typeof value === 'object'
      ? value
      : { processingMs: value, endToEndMs: value, postSettleFramesMs: 0 }
  ));
  return {
    metric: 'processingMs',
    ...summarizeTimings(normalized.map(value => value.processingMs)),
    presentation: summarizeTimings(normalized.map(value => value.postSettleFramesMs)),
    endToEnd: summarizeTimings(normalized.map(value => value.endToEndMs))
  };
}

function checkTimingBudget(name, summary) {
  check(
    summary.medianMs <= RENDER_SCALABILITY_BUDGETS.interactionMedianMs,
    `${name} 중앙값 ${summary.medianMs}ms가 ${RENDER_SCALABILITY_BUDGETS.interactionMedianMs}ms 예산을 초과함`
  );
  check(
    summary.maximumMs <= RENDER_SCALABILITY_BUDGETS.interactionMaximumMs,
    `${name} 최댓값 ${summary.maximumMs}ms가 ${RENDER_SCALABILITY_BUDGETS.interactionMaximumMs}ms 예산을 초과함`
  );
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
    throw new Error(
      result.exceptionDetails.exception?.description || result.exceptionDetails.text
    );
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

async function navigate(url, readyExpression) {
  await client.send('Page.navigate', { url });
  await waitFor(
    `location.href === ${JSON.stringify(url)} && document.readyState === 'complete' && (${readyExpression})`,
    `앱 로드 ${url}`,
    20_000
  );
}

async function setViewport(width, height = 1_000) {
  await client.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
    screenWidth: width,
    screenHeight: height
  });
  await waitFor(`innerWidth === ${width}`, `${width}px viewport`);
  await sleep(80);
}

async function captureScreenshot(name) {
  const screenshot = await client.send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: false
  });
  const path = join(artifactDirectory, `${name}.png`);
  writeFileSync(path, Buffer.from(screenshot.data, 'base64'));
  report.screenshots.push(`${name}.png`);
}

function bindRuntimeDiagnostics() {
  client.on('Runtime.consoleAPICalled', params => {
    const message = (params.args || [])
      .map(argument => argument.value ?? argument.description ?? '')
      .join(' ');
    if (params.type === 'warning') runtimeSignals.consoleWarnings.push(message);
    if (params.type === 'error' || params.type === 'assert') {
      runtimeSignals.consoleErrors.push(message);
    }
  });
  client.on('Runtime.exceptionThrown', params => {
    runtimeSignals.exceptions.push(
      params.exceptionDetails?.exception?.description
      || params.exceptionDetails?.text
      || 'unknown exception'
    );
  });
  client.on('Network.requestWillBeSent', params => {
    const url = params.request?.url || '';
    requestUrls.set(params.requestId, url);
    if (requestPhase === 'initial' && /\.(?:js|css)(?:\?|$)/u.test(url)) {
      report.initialRequests.push(url);
    }
  });
  client.on('Network.loadingFailed', params => {
    const url = requestUrls.get(params.requestId) || '';
    const expected = intentionalComponentBlock && url.includes('componentLazyEntry');
    if (!expected && !params.canceled && params.errorText !== 'net::ERR_ABORTED') {
      runtimeSignals.networkFailures.push(`${url || params.type}: ${params.errorText}`);
    }
  });
  client.on('Network.responseReceived', params => {
    const status = params.response?.status || 0;
    if (status >= 400) runtimeSignals.httpErrors.push(`${status} ${params.response.url}`);
  });
  client.on('Fetch.requestPaused', params => {
    const url = params.request?.url || '';
    if (intentionalComponentBlock && url.includes('componentLazyEntry')) {
      interceptedComponentFailures += 1;
      client.send('Fetch.failRequest', {
        requestId: params.requestId,
        errorReason: 'Failed'
      }).catch(error => runtimeSignals.networkFailures.push(`Fetch.failRequest: ${error.message}`));
      return;
    }
    client.send('Fetch.continueRequest', { requestId: params.requestId })
      .catch(error => runtimeSignals.networkFailures.push(`Fetch.continueRequest: ${error.message}`));
  });
}

async function measureViewChange(mode) {
  return evaluate(`(async () => {
    const start = performance.now();
    document.querySelector('.view-mode-btn[data-mode="${mode}"]')?.click();
    const deadline = start + 2_000;
    while (!document.querySelector('.gallery-wrapper.view-mode-${mode.toLocaleLowerCase('en')}')) {
      if (performance.now() > deadline) throw new Error('${mode} 보기 전환 시간 초과');
      await new Promise(requestAnimationFrame);
    }
    const settledAt = performance.now();
    await new Promise(requestAnimationFrame);
    const finished = performance.now();
    return {
      processingMs: settledAt - start,
      postSettleFramesMs: finished - settledAt,
      endToEndMs: finished - start
    };
  })()`);
}

async function setCoreSearch(query) {
  return evaluate(`(async () => {
    const input = document.querySelector('#search-input');
    if (!input) throw new Error('검색 input 누락');
    const expected = ${JSON.stringify(query)};
    const isSettled = () => {
      const queryChip = document.querySelector('[data-clear-key="query"]');
      const queryStateMatches = expected
        ? queryChip?.textContent.includes(expected)
        : !queryChip;
      return input.value === expected
        && queryStateMatches
        && Boolean(document.querySelector('#main-root .gallery-wrapper, #main-root .empty-results-box'));
    };
    const start = performance.now();
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, expected);
    input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));
    const deadline = start + 2_000;
    while (!isSettled()) {
      if (performance.now() > deadline) throw new Error('Core 검색 정착 시간 초과');
      await new Promise(requestAnimationFrame);
    }
    const settledAt = performance.now();
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    const finished = performance.now();
    return {
      processingMs: settledAt - start,
      postSettleFramesMs: finished - settledAt,
      endToEndMs: finished - start
    };
  })()`);
}

async function collectActualReachableIds() {
  const ids = [];
  while (true) {
    ids.push(...await evaluate(`[...document.querySelectorAll('#main-root [data-result-id]')]
      .map(node => node.dataset.resultId)`));
    const canNext = await evaluate(
      `Boolean(document.querySelector('#main-root [data-gallery-page="next"]:not(:disabled)'))`
    );
    if (!canNext) break;
    await evaluate(`document.querySelector('#main-root [data-gallery-page="next"]')?.click()`);
    await waitFor(
      `document.activeElement?.classList.contains('gallery-page-status')`,
      'actual catalog 다음 페이지'
    );
  }
  return ids;
}

async function verifyCoreGallery() {
  const initial = await evaluate(`(() => ({
    resultCount: document.querySelectorAll('#main-root [data-result-id]').length,
    uniqueCount: new Set([...document.querySelectorAll('#main-root [data-result-id]')]
      .map(node => node.dataset.resultId)).size,
    totalCount: Number(document.querySelector('#main-root .gallery-wrapper')?.dataset.resultCount || 0),
    thumbnails: document.querySelectorAll('#main-root .style-thumb').length,
    pagination: Boolean(document.querySelector('#main-root .gallery-pagination')),
    nodes: document.querySelector('#main-root')?.querySelectorAll('*').length || 0,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
  }))()`);
  report.core.initial = initial;
  check(initial.resultCount === 36 && initial.uniqueCount === 36, 'actual 120 초기 페이지 상한 36 실패');
  check(initial.totalCount === 120, `actual catalog 총량 ${initial.totalCount}/120`);
  check(initial.thumbnails === 36, `actual 초기 thumbnail ${initial.thumbnails}/36`);
  check(initial.pagination, 'actual 120 pagination 누락');
  check(initial.overflow <= 1, `actual 초기 가로 overflow ${initial.overflow}px`);

  for (const mode of VIEW_MODES) {
    await measureViewChange(mode);
    const modeResult = await evaluate(`(() => ({
      mode: ${JSON.stringify(mode)},
      count: document.querySelectorAll('#main-root [data-result-id]').length,
      unique: new Set([...document.querySelectorAll('#main-root [data-result-id]')]
        .map(node => node.dataset.resultId)).size,
      thumbnails: document.querySelectorAll('#main-root .style-thumb').length,
      pagination: Boolean(document.querySelector('#main-root .gallery-pagination')),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    }))()`);
    const reachableIds = await collectActualReachableIds();
    modeResult.reachableCount = reachableIds.length;
    modeResult.reachableUnique = new Set(reachableIds).size;
    report.core.galleryModes.push(modeResult);
    check(modeResult.count === 36 && modeResult.unique === 36, `${mode} actual 첫 페이지 36개 계약 실패`);
    check(modeResult.thumbnails === 36, `${mode} thumbnail ${modeResult.thumbnails}/36`);
    check(modeResult.pagination, `${mode} actual 120 pagination 누락`);
    check(modeResult.reachableCount === 120 && modeResult.reachableUnique === 120, `${mode} actual 120 전체 도달 실패`);
    check(modeResult.overflow <= 1, `${mode} 가로 overflow ${modeResult.overflow}px`);
  }

  const viewSamples = [];
  for (const mode of ['GRID', 'BENTO', 'GRID', 'SPECTRUM', 'GRID']) {
    viewSamples.push(await measureViewChange(mode));
  }
  report.core.interactions.viewChange = summarizeMeasurements(viewSamples);
  checkTimingBudget('Core 보기 전환', report.core.interactions.viewChange);

  const searchSamples = [];
  for (const query of ['glass', '', 'bauhaus', '', 'liquid']) {
    searchSamples.push(await setCoreSearch(query));
  }
  await setCoreSearch('');
  await waitFor(
    `document.querySelectorAll('#main-root [data-result-id]').length === 36`,
    'Core 검색 초기화'
  );
  report.core.interactions.search = summarizeMeasurements(searchSamples);
  checkTimingBudget('Core 검색', report.core.interactions.search);
}

async function verifyLazyPeekFailureAndRetry() {
  const initialLazyRequests = report.initialRequests.filter(url => (
    url.includes('detailView') || url.includes('componentEntry') || url.includes('componentLazyEntry')
  ));
  check(initialLazyRequests.length === 0, `초기 경로가 lazy chunk를 요청함: ${initialLazyRequests.join(', ')}`);

  intentionalComponentBlock = true;
  await client.send('Fetch.enable', {
    patterns: [{ urlPattern: '*componentLazyEntry*', requestStage: 'Request' }]
  });
  await evaluate(`(() => {
    window.__dssPeekBusyObserved = false;
    window.__dssPeekBusyObserver?.disconnect();
    clearInterval(window.__dssPeekBusyPoll);
    const markBusy = root => {
      if (!root) return;
      if (root.matches?.('#peek-viewport[aria-busy="true"]')
        || root.querySelector?.('#peek-viewport[aria-busy="true"]')) {
        window.__dssPeekBusyObserved = true;
      }
    };
    window.__dssPeekBusyObserver = new MutationObserver(records => {
      for (const record of records) {
        markBusy(record.target);
        record.addedNodes.forEach(markBusy);
      }
    });
    window.__dssPeekBusyObserver.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['aria-busy']
    });
    window.__dssPeekBusyPoll = setInterval(() => {
      if (document.querySelector('#peek-viewport[aria-busy="true"]')) {
        window.__dssPeekBusyObserved = true;
      }
    }, 1);
    const tile = document.querySelector('#main-root .sub-tile, #main-root .bento-item-card, #main-root .spectrum-card');
    tile?.focus();
    tile?.dispatchEvent(new FocusEvent('focus'));
    return tile?.dataset.subId || null;
  })()`);
  await waitFor(
    `Boolean(document.querySelector('#peek-viewport'))`,
    'Peek 컨테이너 생성',
    5_000
  );
  await waitFor(
    `Boolean(document.querySelector('#peek-viewport [data-peek-preview-retry]'))`,
    'Peek failure 상태',
    15_000
  );
  const loadingObserved = await evaluate(`(() => {
    clearInterval(window.__dssPeekBusyPoll);
    window.__dssPeekBusyObserver?.disconnect();
    return Boolean(window.__dssPeekBusyObserved);
  })()`);
  const failureState = await evaluate(`(() => ({
    busy: document.querySelector('#peek-viewport')?.getAttribute('aria-busy') || null,
    alert: document.querySelector('#peek-viewport [role="alert"]')?.textContent.trim() || '',
    retryLabel: document.querySelector('[data-peek-preview-retry]')?.textContent.trim() || ''
  }))()`);

  intentionalComponentBlock = false;
  await client.send('Fetch.disable');
  await evaluate(`document.querySelector('[data-peek-preview-retry]')?.click()`);
  await waitFor(
    `Boolean(document.querySelector('#peek-viewport:not([aria-busy]) .mockup-unit, #peek-viewport:not([aria-busy]) .archetype-unit'))`,
    'Peek retry 성공',
    15_000
  );
  const lazyResources = await evaluate(`performance.getEntriesByType('resource')
    .map(entry => entry.name)
    .filter(name => name.includes('componentEntry') || name.includes('componentLazyEntry') || name.includes('detailView'))`);
  report.core.lazyLoading = {
    initialLazyRequests,
    loadingObserved: Boolean(loadingObserved),
    failureState,
    interceptedComponentFailures,
    retrySucceeded: true,
    resourcesAfterRetry: lazyResources
  };
  check(Boolean(loadingObserved), 'Peek aria-busy loading 상태를 관찰하지 못함');
  check(interceptedComponentFailures === 1, `component failure interception ${interceptedComponentFailures}/1`);
  check(failureState.busy === null && failureState.alert.includes('불러오지 못했습니다'), 'Peek error/alert 상태 실패');
  check(failureState.retryLabel.includes('다시 시도'), 'Peek retry control 누락');
  check(lazyResources.some(url => url.includes('componentLazyEntry')), 'Peek retry 후 component lazy chunk 요청이 없음');

  await evaluate(`(() => {
    const tile = document.querySelector('#main-root [data-sub-id]');
    tile?.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    tile?.blur();
  })()`);
  await sleep(220);
}

async function openCoreDetailMeasured() {
  return evaluate(`(async () => {
    const tile = document.querySelector('#main-root [data-sub-id]');
    if (!tile) throw new Error('상세 진입 tile 누락');
    const start = performance.now();
    tile.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, cancelable: true }));
    const deadline = start + 5_000;
    while (!document.querySelector('#mockup-viewport')) {
      if (performance.now() > deadline) throw new Error('상세 진입 시간 초과');
      await new Promise(requestAnimationFrame);
    }
    const settledAt = performance.now();
    await new Promise(requestAnimationFrame);
    const finished = performance.now();
    return {
      processingMs: settledAt - start,
      postSettleFramesMs: finished - settledAt,
      endToEndMs: finished - start
    };
  })()`);
}

async function closeCoreDetail() {
  await evaluate(`document.querySelector('#btn-modal-close')?.click()`);
  await waitFor(
    `Boolean(document.querySelector('#main-root [data-sub-id]')) && !document.querySelector('#mockup-viewport')`,
    '상세 닫기'
  );
}

async function verifyDetailAndDevice() {
  const coldMeasurement = await openCoreDetailMeasured();
  const detail = await evaluate(`(() => {
    const selector = document.querySelector('#top-style-selector');
    const viewport = document.querySelector('#mockup-viewport');
    const categoryId = selector?.dataset.categoryId || null;
    const chips = [...document.querySelectorAll('#top-style-selector .top-style-chip')];
    return {
      categoryId,
      chipCount: chips.length,
      thumbnailCount: document.querySelectorAll('#top-style-selector .style-thumb').length,
      foreignCategoryCount: chips.filter(chip => chip.dataset.catId !== categoryId).length,
      selectedCount: chips.filter(chip => chip.getAttribute('aria-selected') === 'true').length,
      searchVisible: Boolean(document.querySelector('#detail-style-search')),
      theme: viewport?.dataset.theme || null,
      deviceClass: viewport?.className || ''
    };
  })()`);
  check(detail.chipCount <= RENDER_SCALABILITY_BUDGETS.detailPickerLimit, `Detail chip ${detail.chipCount}/24 초과`);
  check(detail.thumbnailCount <= RENDER_SCALABILITY_BUDGETS.detailPickerLimit, `Detail thumbnail ${detail.thumbnailCount}/24 초과`);
  check(detail.foreignCategoryCount === 0, `Detail에 다른 category chip ${detail.foreignCategoryCount}개`);
  check(detail.selectedCount === 1, `Detail selected chip ${detail.selectedCount}/1`);

  detail.statefulSwap = await evaluate(`(async () => {
    const viewport = document.querySelector('#mockup-viewport');
    const renderer = viewport?.firstElementChild;
    const next = [...document.querySelectorAll('#top-style-selector .top-style-chip')]
      .find(chip => chip.getAttribute('aria-selected') !== 'true');
    if (!viewport || !next) return null;
    next.click();
    await new Promise(requestAnimationFrame);
    return {
      sameViewport: viewport === document.querySelector('#mockup-viewport'),
      rendererRebuilt: renderer !== document.querySelector('#mockup-viewport')?.firstElementChild,
      selectedId: document.querySelector('#top-style-selector .top-style-chip[aria-selected="true"]')?.dataset.subId || null,
      theme: document.querySelector('#mockup-viewport')?.dataset.theme || null
    };
  })()`);
  check(detail.statefulSwap?.sameViewport === true, 'Detail style swap이 viewport root를 다시 만듦');
  check(detail.statefulSwap?.rendererRebuilt === true, 'Detail style swap이 내부 renderer를 교체하지 않음');
  check(detail.statefulSwap?.selectedId === detail.statefulSwap?.theme, 'Detail style swap 선택/theme 불일치');

  detail.devices = [];
  for (const device of ['mobile', 'desktop']) {
    await evaluate(`document.querySelector('.device-btn[data-device="${device}"]')?.click()`);
    await waitFor(
      `document.querySelector('#mockup-viewport')?.classList.contains('${device}')`,
      `Detail ${device} 전환`
    );
    const state = await evaluate(`(() => ({
      device: ${JSON.stringify(device)},
      viewportClass: document.querySelector('#mockup-viewport')?.className || '',
      active: document.querySelector('.device-btn[data-device="${device}"]')?.classList.contains('active') || false,
      inactive: document.querySelector('.device-btn[data-device="${device === 'mobile' ? 'desktop' : 'mobile'}"]')?.classList.contains('active') || false,
      viewportWidth: Math.round(document.querySelector('#mockup-viewport')?.getBoundingClientRect().width || 0),
      unitWidth: Math.round(document.querySelector('#mockup-viewport :is(.archetype-unit, .mockup-unit)')?.getBoundingClientRect().width || 0)
    }))()`);
    detail.devices.push(state);
    check(state.active && !state.inactive, `Detail ${device} active 상태 실패`);
    check(state.viewportClass.split(/\s+/u).includes(device), `Detail ${device} class 실패`);
  }
  const mobileDevice = detail.devices.find(device => device.device === 'mobile');
  const desktopDevice = detail.devices.find(device => device.device === 'desktop');
  check(mobileDevice?.unitWidth <= 390, `Mobile preview 폭 ${mobileDevice?.unitWidth}px/390px`);
  check(desktopDevice?.unitWidth > mobileDevice?.unitWidth, `Desktop/Mobile preview 폭이 같음: ${desktopDevice?.unitWidth}px`);

  const warmSamples = [];
  await closeCoreDetail();
  for (let index = 0; index < 5; index += 1) {
    warmSamples.push(await openCoreDetailMeasured());
    await closeCoreDetail();
  }
  await openCoreDetailMeasured();
  detail.coldEntryMs = Number(coldMeasurement.processingMs.toFixed(2));
  detail.coldEntry = {
    processingMs: Number(coldMeasurement.processingMs.toFixed(2)),
    postSettleFramesMs: Number(coldMeasurement.postSettleFramesMs.toFixed(2)),
    endToEndMs: Number(coldMeasurement.endToEndMs.toFixed(2))
  };
  detail.warmEntries = summarizeMeasurements(warmSamples);
  checkTimingBudget('Detail warm 진입', detail.warmEntries);
  report.core.detail = detail;
}

async function setSplitSearch(slot, query) {
  const lower = slot.toLocaleLowerCase('en');
  return evaluate(`(async () => {
    const input = document.querySelector('#split-style-search-${lower}');
    if (!input) throw new Error('Split ${slot} 검색 누락');
    input.focus();
    const start = performance.now();
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, ${JSON.stringify(query)});
    input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));
    const settledAt = performance.now();
    await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 0)));
    const finished = performance.now();
    return {
      processingMs: settledAt - start,
      postSettleFramesMs: finished - settledAt,
      endToEndMs: finished - start
    };
  })()`);
}

async function verifySplitPicker() {
  await evaluate(`document.querySelector('#btn-open-compare-modal')?.click()`);
  await waitFor(`document.querySelectorAll('.split-viewport').length === 2`, 'Split 열기', 15_000);
  const initial = await evaluate(`(() => ({
    visualA: document.querySelectorAll('#split-picker-a .split-pick-thumb').length,
    visualB: document.querySelectorAll('#split-picker-b .split-pick-thumb').length,
    thumbnailsA: document.querySelectorAll('#split-picker-a .style-thumb').length,
    thumbnailsB: document.querySelectorAll('#split-picker-b .style-thumb').length,
    optionsA: document.querySelectorAll('#select-style-a option').length,
    optionsB: document.querySelectorAll('#select-style-b option').length,
    selectedA: document.querySelector('#select-style-a')?.value || null,
    selectedB: document.querySelector('#select-style-b')?.value || null,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
  }))()`);
  check(initial.visualA <= 12 && initial.visualB <= 12, `Split visual ${initial.visualA}/${initial.visualB}, 슬롯 예산 12`);
  check(initial.thumbnailsA <= 12 && initial.thumbnailsB <= 12, `Split thumbnail ${initial.thumbnailsA}/${initial.thumbnailsB}`);
  check(initial.optionsA === 120 && initial.optionsB === 120, `Split native options ${initial.optionsA}/${initial.optionsB}, 기대 120`);
  check(initial.overflow <= 1, `Split 가로 overflow ${initial.overflow}px`);

  const timingResults = [];
  for (const query of ['glass', '', 'swiss', '', 'material']) {
    timingResults.push(await setSplitSearch('A', query));
  }
  await setSplitSearch('A', '');
  const afterSearch = await evaluate(`(() => ({
    visualA: document.querySelectorAll('#split-picker-a .split-pick-thumb').length,
    selectedCount: document.querySelectorAll('#split-picker-a .split-pick-thumb[aria-selected="true"]').length,
    focusId: document.activeElement?.id || null,
    statusRole: document.querySelector('#split-picker-status-a')?.getAttribute('role') || null,
    live: document.querySelector('#split-picker-status-a')?.getAttribute('aria-live') || null
  }))()`);
  check(afterSearch.visualA <= 12, `Split 검색 후 visual ${afterSearch.visualA}/12`);
  check(afterSearch.selectedCount === 1, `Split 검색 후 selected ${afterSearch.selectedCount}/1`);
  check(afterSearch.focusId === 'split-style-search-a', `Split 검색 focus 소실: ${afterSearch.focusId}`);
  check(afterSearch.statusRole === 'status' && afterSearch.live === 'polite', 'Split live status ARIA 실패');

  report.core.interactions.splitSearch = summarizeMeasurements(timingResults);
  checkTimingBudget('Split picker 검색', report.core.interactions.splitSearch);
  report.core.split = { ...initial, afterSearch };
  await captureScreenshot('split-core-1440');

  await evaluate(`document.querySelector('#btn-compare-close')?.click()`);
  await waitFor(`Boolean(document.querySelector('#mockup-viewport'))`, 'Split에서 Detail 복귀');
  await closeCoreDetail();
}

async function verifySelectionDock() {
  await evaluate(`document.querySelector('#main-root [data-sub-id]')?.click()`);
  await waitFor(`Boolean(document.querySelector('#dock-confirm'))`, '선택 dock');
  await evaluate(`document.querySelector('#dock-confirm')?.click()`);
  await waitFor(
    `Boolean(document.querySelector('#confirm-preview:not([aria-busy]) .mockup-unit, #confirm-preview:not([aria-busy]) .archetype-unit'))`,
    '확정 sheet preview',
    15_000
  );
  const selection = await evaluate(`(() => ({
    role: document.querySelector('.confirm-sheet')?.getAttribute('role') || null,
    theme: document.querySelector('#confirm-preview')?.dataset.theme || null,
    busy: document.querySelector('#confirm-preview')?.getAttribute('aria-busy') || null,
    previewCount: document.querySelectorAll('#confirm-preview .mockup-unit, #confirm-preview .archetype-unit').length,
    componentResources: performance.getEntriesByType('resource')
      .filter(entry => entry.name.includes('componentEntry')).length
  }))()`);
  report.core.selection = selection;
  check(selection.role === 'region' && selection.theme && selection.busy === null, '확정 sheet region/theme/loading 상태 실패');
  check(selection.previewCount === 1, `확정 sheet preview ${selection.previewCount}/1`);
  await evaluate(`document.querySelector('#confirm-sheet-close')?.click()`);
}

async function verifyCoreResponsiveAndMotion() {
  for (const width of RESPONSIVE_WIDTHS) {
    await setViewport(width, width === 320 ? 1_000 : 1_100);
    const result = await evaluate(`(() => {
      const root = document.documentElement;
      const controls = [...document.querySelectorAll(
        '.view-mode-btn, .filter-tag-btn, #search-input, #main-root button:not(:disabled)'
      )].filter(element => {
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && getComputedStyle(element).visibility !== 'hidden';
      });
      const unlabeled = controls.filter(element => {
        if (element.tagName === 'INPUT') return !element.labels.length && !element.getAttribute('aria-label');
        return !element.textContent.trim() && !element.getAttribute('aria-label') && !element.getAttribute('title');
      });
      return {
        width: innerWidth,
        resultCount: document.querySelectorAll('#main-root [data-result-id]').length,
        thumbnails: document.querySelectorAll('#main-root .style-thumb').length,
        overflow: root.scrollWidth - root.clientWidth,
        unlabeledControls: unlabeled.length
      };
    })()`);
    report.core.responsiveWidths.push(result);
    check(result.resultCount === 36, `${width}px Core 결과 ${result.resultCount}/36`);
    check(result.thumbnails === 36, `${width}px Core thumbnail ${result.thumbnails}/36`);
    check(result.overflow <= 1, `${width}px 가로 overflow ${result.overflow}px`);
    if (result.unlabeledControls) {
      report.accessibilityIssues.push(`${width}px unlabeled controls ${result.unlabeledControls}개`);
    }
    if (width === 320) await captureScreenshot('core-mobile-320');
    if (width === 1440) await captureScreenshot('core-desktop-1440');
  }

  await client.send('Emulation.setEmulatedMedia', {
    media: '',
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
  });
  await measureViewChange('BENTO');
  const reduced = await evaluate(`(() => {
    const thumbs = [...document.querySelectorAll('#main-root .style-thumb')];
    const runningAnimations = thumbs.flatMap(thumb => thumb.getAnimations({ subtree: true }))
      .filter(animation => animation.playState === 'running');
    return {
      matches: matchMedia('(prefers-reduced-motion: reduce)').matches,
      thumbnails: thumbs.length,
      inView: thumbs.filter(thumb => thumb.classList.contains('in-view')).length,
      runningAnimations: runningAnimations.length
    };
  })()`);
  report.core.reducedMotion = reduced;
  check(reduced.matches, 'reduced-motion media query 불일치');
  check(reduced.inView === 0, `reduced-motion in-view thumbnail ${reduced.inView}개`);
  check(reduced.runningAnimations === 0, `reduced-motion running animation ${reduced.runningAnimations}개`);
  await client.send('Emulation.setEmulatedMedia', { media: '', features: [] });
  await setViewport(1440, 1_100);
  await measureViewChange('GRID');
}

async function runSyntheticLabInPage(count, budgets) {
  const [mainModule, legacyModule, catalogModule, pickerModule, thumbnailModule] = await Promise.all([
    import('./src/components/mainView.js'),
    import('./src/catalog/legacyAdapter.js'),
    import('./src/catalog/index.js'),
    import('./src/components/stylePickerMarkup.js'),
    import('./src/preview/thumbnailEntry.js')
  ]);
  const baseStyles = legacyModule.getLegacyAllSubDesigns();
  const canonicalById = new Map(catalogModule.getAllStyles().map(style => [style.id, style]));
  const baseCategories = legacyModule.getLegacyMainCategories();
  const categoryById = new Map(baseCategories.map(category => [category.id, category]));
  const suffix = index => String(index + 1).padStart(3, '0');
  const entries = Array.from({ length: count }, (_, index) => {
    const base = baseStyles[index % baseStyles.length];
    const id = base.id + '--qa-' + count + '-' + suffix(index);
    const sub = {
      ...base,
      id,
      name: base.name + ' QA ' + (index + 1),
      nameEn: base.nameEn + ' QA ' + (index + 1)
    };
    const style = { ...canonicalById.get(base.id), id, categoryId: base.categoryId };
    return { style, sub, category: categoryById.get(base.categoryId) };
  });

  function buildModel(state) {
    const query = String(state.searchQuery || '').trim().toLocaleLowerCase('en');
    const visible = query
      ? entries.filter(entry => [entry.style.id, entry.sub.name, entry.sub.nameEn]
        .join(' ').toLocaleLowerCase('en').includes(query))
      : entries;
    const categories = baseCategories.map(category => ({
      ...category,
      subCategories: visible
        .filter(entry => entry.category.id === category.id)
        .map(entry => entry.sub)
    })).filter(category => category.subCategories.length);
    const eraGroups = Array.from({ length: 4 }, (_, groupIndex) => {
      const groupEntries = visible.filter((_, index) => index % 4 === groupIndex);
      return {
        id: 'qa-era-' + groupIndex,
        label: { ko: 'QA 시대 ' + (groupIndex + 1), en: 'QA Era ' + (groupIndex + 1) },
        styles: groupEntries.map(entry => entry.style),
        entries: groupEntries
      };
    }).filter(group => group.entries.length);
    return {
      results: visible.map(entry => entry.style),
      resultIds: visible.map(entry => entry.style.id),
      categories,
      entries: visible,
      eraGroups
    };
  }

  class StateManager {
    constructor() {
      this.state = {
        currentView: 'MAIN',
        viewMode: 'GRID',
        searchQuery: '',
        bookmarks: [],
        galleryFocusId: null,
        draftSubId: null,
        confirmedStyleId: null,
        activeFilter: 'ALL',
        activeFacets: {},
        sortMode: 'catalog',
        bookmarkFilterActive: false
      };
      this.listeners = new Set();
    }
    getState() { return this.state; }
    setState(partial) {
      const previous = this.state;
      this.state = { ...this.state, ...partial };
      this.listeners.forEach(listener => listener(this.state, previous));
    }
    subscribe(listener) {
      this.listeners.add(listener);
      listener(this.state, this.state);
      return () => this.listeners.delete(listener);
    }
    toggleBookmark() { return false; }
  }

  const nativeIntersectionObserver = window.IntersectionObserver;
  const trackedObservers = new Set();
  class TrackingIntersectionObserver {
    constructor(callback, options) {
      this.targets = new Set();
      this.inner = new nativeIntersectionObserver(callback, options);
      trackedObservers.add(this);
    }
    observe(target) { this.targets.add(target); this.inner.observe(target); }
    unobserve(target) { this.targets.delete(target); this.inner.unobserve(target); }
    takeRecords() { return this.inner.takeRecords(); }
    disconnect() { this.targets.clear(); this.inner.disconnect(); }
    get root() { return this.inner.root; }
    get rootMargin() { return this.inner.rootMargin; }
    get thresholds() { return this.inner.thresholds; }
  }
  window.IntersectionObserver = TrackingIntersectionObserver;

  document.querySelector('.app-container')?.setAttribute('hidden', '');
  for (const selector of ['#peek-root', '#selection-dock-root', '#audio-widget-root', '#bg-canvas']) {
    const element = document.querySelector(selector);
    if (element) element.style.display = 'none';
  }
  const container = document.createElement('main');
  container.id = 'render-scalability-lab';
  container.dataset.syntheticCount = String(count);
  document.body.appendChild(container);
  const manager = new StateManager();
  const cleanup = mainModule.renderMainView(container, {
    stateManager: manager,
    modelFactory: buildModel,
    enableKeyboard: false
  });

  const settle = async () => {
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
  };
  const measure = async action => {
    const start = performance.now();
    action();
    const settledAt = performance.now();
    await settle();
    const finished = performance.now();
    return {
      processingMs: settledAt - start,
      postSettleFramesMs: finished - settledAt,
      endToEndMs: finished - start
    };
  };
  const structure = () => ({
    resultCount: container.querySelectorAll('[data-result-id]').length,
    uniqueCount: new Set([...container.querySelectorAll('[data-result-id]')]
      .map(node => node.dataset.resultId)).size,
    thumbnails: container.querySelectorAll('.style-thumb').length,
    nodes: container.querySelectorAll('*').length,
    page: container.querySelector('.gallery-page-status')?.textContent.replace(/\s+/gu, ' ').trim() || null
  });
  const collectReachable = async () => {
    const ids = [];
    while (true) {
      ids.push(...[...container.querySelectorAll('[data-result-id]')]
        .map(node => node.dataset.resultId));
      const next = container.querySelector('[data-gallery-page="next"]');
      if (!next || next.disabled) break;
      next.click();
      await settle();
    }
    return ids;
  };

  await settle();
  const modes = [];
  for (const mode of ['GRID', 'BENTO', 'SPECTRUM']) {
    manager.setState({ viewMode: mode });
    await settle();
    const firstPage = structure();
    const reachableIds = await collectReachable();
    modes.push({
      mode,
      firstPage,
      reachableCount: reachableIds.length,
      reachableUnique: new Set(reachableIds).size,
      allReachable: entries.every(entry => reachableIds.includes(entry.style.id))
    });
  }

  const modeSamples = [];
  for (const mode of ['GRID', 'BENTO', 'GRID', 'SPECTRUM', 'GRID']) {
    modeSamples.push(await measure(() => manager.setState({ viewMode: mode })));
  }

  manager.setState({ viewMode: 'GRID', searchQuery: '' });
  await settle();
  const pageSamples = [];
  for (let index = 0; index < 5; index += 1) {
    const direction = container.querySelector('[data-gallery-page="next"]:not(:disabled)')
      ? 'next'
      : 'previous';
    pageSamples.push(await measure(() => {
      container.querySelector('[data-gallery-page="' + direction + '"]')?.click();
    }));
  }
  const pageFocus = container.querySelector('.gallery-page-status') === document.activeElement;

  const exactQuery = 'qa-' + count + '-' + String(count).padStart(3, '0');
  const searchSamples = [];
  for (const query of [exactQuery, '', exactQuery, '', exactQuery]) {
    searchSamples.push(await measure(() => manager.setState({ searchQuery: query })));
  }
  const searched = structure();
  manager.setState({ searchQuery: '' });
  await settle();

  const currentObserved = [...trackedObservers]
    .reduce((total, observer) => total + observer.targets.size, 0);
  const detachedObserved = [...trackedObservers]
    .flatMap(observer => [...observer.targets])
    .filter(target => !target.isConnected).length;

  const pickerHost = document.createElement('section');
  pickerHost.id = 'synthetic-picker-lab';
  const styles = entries.map(entry => ({
    ...entry.sub,
    categoryTitle: entry.category.title
  }));
  const selectedId = styles.at(-1).id;
  const renderThumbnail = options => thumbnailModule.renderPreviewThumbnail(options);
  const detailMarkup = pickerModule.renderDetailStyleSelector(styles, {
    selectedId,
    categoryId: 'synthetic',
    categoryTitle: '합성 카테고리',
    renderThumbnail
  });
  const splitMarkupA = pickerModule.renderSplitStylePicker(styles, {
    slot: 'A', selectedId, renderThumbnail
  });
  const splitMarkupB = pickerModule.renderSplitStylePicker(styles, {
    slot: 'B', selectedId: styles[0].id, renderThumbnail
  });
  pickerHost.innerHTML = '<select id="synthetic-native-select">'
    + styles.map(style => '<option value="' + style.id + '">' + style.name + '</option>').join('')
    + '</select>' + detailMarkup + splitMarkupA + splitMarkupB;
  container.appendChild(pickerHost);
  const pickerSamples = [];
  let pinnedResult = null;
  for (let index = 0; index < 5; index += 1) {
    pickerSamples.push(await measure(() => {
      pinnedResult = pickerModule.renderSplitStyleChips(styles, {
        slot: 'A', query: 'no-synthetic-match-' + index, selectedId, renderThumbnail
      });
      pickerHost.querySelector('#split-picker-a').innerHTML = pinnedResult.markup;
    }));
  }
  const picker = {
    detailChips: pickerHost.querySelectorAll('#top-style-selector .top-style-chip').length,
    detailThumbnails: pickerHost.querySelectorAll('#top-style-selector .style-thumb').length,
    detailSearch: Boolean(pickerHost.querySelector('#detail-style-search')),
    splitA: pickerHost.querySelectorAll('#split-picker-a .split-pick-thumb').length,
    splitB: pickerHost.querySelectorAll('#split-picker-b .split-pick-thumb').length,
    nativeOptions: pickerHost.querySelectorAll('#synthetic-native-select option').length,
    pinnedCount: pickerHost.querySelectorAll('#split-picker-a .split-pick-thumb[aria-selected="true"]').length,
    selectedPinned: pinnedResult.selectedPinned,
    matchCount: pinnedResult.matchCount
  };
  pickerHost.hidden = true;

  const pagination = {
    navLabel: container.querySelector('.gallery-pagination')?.getAttribute('aria-label') || null,
    live: container.querySelector('.gallery-page-status')?.getAttribute('aria-live') || null,
    previousLabel: container.querySelector('[data-gallery-page="previous"]')?.getAttribute('aria-label') || null,
    nextLabel: container.querySelector('[data-gallery-page="next"]')?.getAttribute('aria-label') || null,
    pageFocus
  };
  const galleryNodes = container.querySelector('.gallery-wrapper')?.querySelectorAll('*').length || 0;
  cleanup();
  const observedAfterCleanup = [...trackedObservers]
    .reduce((total, observer) => total + observer.targets.size, 0);
  window.IntersectionObserver = nativeIntersectionObserver;

  return {
    count,
    modes,
    searched,
    picker,
    pagination,
    observer: { currentObserved, detachedObserved, observedAfterCleanup },
    galleryNodes,
    interactions: {
      viewChange: modeSamples,
      pageChange: pageSamples,
      search: searchSamples,
      pickerSearch: pickerSamples
    },
    budgets
  };
}

async function verifySyntheticCapacity(devUrl) {
  requestPhase = 'synthetic';
  await navigate(devUrl, `Boolean(document.querySelector('#main-root [data-result-id]'))`);
  await setViewport(1440, 1_100);

  for (const count of SYNTHETIC_COUNTS) {
    const result = await evaluate(
      `(${runSyntheticLabInPage.toString()})(${count}, ${JSON.stringify(RENDER_SCALABILITY_BUDGETS)})`
    );
    for (const [name, samples] of Object.entries(result.interactions)) {
      result.interactions[name] = summarizeMeasurements(samples);
      checkTimingBudget(`synthetic ${count} ${name}`, result.interactions[name]);
    }
    report.synthetic.push(result);

    for (const mode of result.modes) {
      check(mode.firstPage.resultCount <= 36, `synthetic ${count} ${mode.mode} card ${mode.firstPage.resultCount}/36`);
      check(mode.firstPage.thumbnails <= 36, `synthetic ${count} ${mode.mode} thumbnail ${mode.firstPage.thumbnails}/36`);
      check(mode.firstPage.uniqueCount === mode.firstPage.resultCount, `synthetic ${count} ${mode.mode} 중복 result ID`);
      check(mode.reachableCount === count && mode.reachableUnique === count && mode.allReachable, `synthetic ${count} ${mode.mode} 전체 ID 도달 실패`);
      check(mode.firstPage.nodes <= 1_600, `synthetic ${count} ${mode.mode} page nodes ${mode.firstPage.nodes}/1600`);
    }
    check(result.searched.resultCount === 1, `synthetic ${count} exact 검색 결과 ${result.searched.resultCount}/1`);
    check(result.picker.detailChips <= 24 && result.picker.detailThumbnails <= 24, `synthetic ${count} Detail picker 24 상한 실패`);
    check(result.picker.detailSearch, `synthetic ${count} Detail 검색 control 누락`);
    check(result.picker.splitA <= 12 && result.picker.splitB <= 12, `synthetic ${count} Split picker 12/slot 상한 실패`);
    check(result.picker.nativeOptions === count, `synthetic ${count} native options ${result.picker.nativeOptions}/${count}`);
    check(result.picker.selectedPinned && result.picker.pinnedCount === 1 && result.picker.matchCount === 0, `synthetic ${count} selected pinning 실패`);
    check(result.observer.detachedObserved === 0, `synthetic ${count} detached observed ${result.observer.detachedObserved}개`);
    check(result.observer.observedAfterCleanup === 0, `synthetic ${count} cleanup 후 observed ${result.observer.observedAfterCleanup}개`);
    check(result.pagination.navLabel && result.pagination.live === 'polite', `synthetic ${count} pagination ARIA 실패`);
    check(result.pagination.previousLabel && result.pagination.nextLabel, `synthetic ${count} pagination button label 실패`);
    check(result.pagination.pageFocus, `synthetic ${count} pagination 이동 후 status focus 실패`);
    if (count === 120) await captureScreenshot('synthetic-120-grid');
    await evaluate(`document.querySelector('#render-scalability-lab')?.remove()`);
  }
}

async function readVitals() {
  await sleep(250);
  const vitals = await evaluate(`(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const fcp = performance.getEntriesByName('first-contentful-paint')[0];
    return {
      domContentLoadedMs: navigation ? navigation.domContentLoadedEventEnd : null,
      loadMs: navigation ? navigation.loadEventEnd : null,
      fcpMs: fcp?.startTime || null,
      lcpMs: window.__dssScalabilityVitals?.lcp || null,
      cls: window.__dssScalabilityVitals?.cls || 0,
      layoutShifts: window.__dssScalabilityVitals?.layoutShifts || []
    };
  })()`);
  report.vitals = vitals;
  check(typeof vitals.lcpMs === 'number' && vitals.lcpMs > 0, 'LCP를 관찰하지 못함');
  check(vitals.lcpMs <= 2_500, `LCP ${vitals.lcpMs}ms가 hard budget 2500ms를 초과함`);
  check(vitals.cls <= 0.1, `CLS ${vitals.cls}가 0.1을 초과함`);
}

function finalizeReport() {
  for (const accessibilityIssue of report.accessibilityIssues) {
    issues.push(`접근성: ${accessibilityIssue}`);
  }
  check(runtimeSignals.consoleWarnings.length === 0, `console warning ${runtimeSignals.consoleWarnings.length}개`);
  check(runtimeSignals.consoleErrors.length === 0, `console error ${runtimeSignals.consoleErrors.length}개`);
  check(runtimeSignals.exceptions.length === 0, `page exception ${runtimeSignals.exceptions.length}개`);
  check(runtimeSignals.networkFailures.length === 0, `network failure ${runtimeSignals.networkFailures.length}개`);
  check(runtimeSignals.httpErrors.length === 0, `HTTP error ${runtimeSignals.httpErrors.length}개`);
  const diagnosticCount = Object.values(runtimeSignals)
    .reduce((total, entries) => total + entries.length, 0);
  report.summary = {
    coreGalleryModes: report.core.galleryModes.length,
    responsiveWidths: report.core.responsiveWidths.length,
    syntheticCounts: report.synthetic.map(result => result.count),
    screenshots: report.screenshots.length,
    diagnosticCount,
    accessibilityIssueCount: report.accessibilityIssues.length,
    issueCount: issues.length,
    passed: issues.length === 0
  };
}

function writeReport() {
  mkdirSync(artifactDirectory, { recursive: true });
  writeFileSync(
    join(artifactDirectory, 'report.json'),
    `${JSON.stringify(report, null, 2)}\n`,
    'utf8'
  );
}

async function startViteServer(kind, port) {
  const args = ['node_modules/vite/bin/vite.js'];
  if (kind === 'preview') args.push('preview');
  args.push('--host', '127.0.0.1', '--port', String(port), '--strictPort');
  const processHandle = spawn(process.execPath, args, {
    cwd: PROJECT_ROOT,
    stdio: ['ignore', 'ignore', 'ignore']
  });
  const url = `http://127.0.0.1:${port}/design_sample_selector/`;
  await waitForHttp(url, kind === 'preview' ? 'Vite preview' : 'Vite dev');
  return { processHandle, url };
}

async function main() {
  const bundleReport = analyzeInitialBundle({
    distDirectory: join(PROJECT_ROOT, 'dist')
  });
  report.bundle = {
    ...bundleReport,
    distDirectory: relative(PROJECT_ROOT, bundleReport.distDirectory),
    indexPath: relative(PROJECT_ROOT, bundleReport.indexPath)
  };
  check(report.bundle.passed, `초기 bundle gate 실패: ${report.bundle.issues.join(' / ')}`);

  const chromeVersion = spawnSync(CHROME_PATH, ['--version'], { encoding: 'utf8' });
  if (chromeVersion.status !== 0) {
    throw new Error(`Chrome 실행 파일을 찾을 수 없음: ${CHROME_PATH}`);
  }
  report.chromeVersion = chromeVersion.stdout.trim();
  mkdirSync(artifactDirectory, { recursive: true });

  const previewPort = await getFreePort();
  const chromePort = await getFreePort();
  const preview = await startViteServer('preview', previewPort);
  previewProcess = preview.processHandle;

  profileDirectory = mkdtempSync(join(tmpdir(), 'dss-scalability-chrome-profile-'));
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
  ], { cwd: PROJECT_ROOT, stdio: ['ignore', 'ignore', 'ignore'] });

  const versionResponse = await waitForHttp(
    `http://127.0.0.1:${chromePort}/json/version`,
    'Chrome DevTools'
  );
  const protocolVersion = await versionResponse.json();
  const targetResponse = await waitForHttp(
    `http://127.0.0.1:${chromePort}/json/list`,
    'Chrome target'
  );
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
    client.send('Network.enable')
  ]);
  await client.send('Network.setCacheDisabled', { cacheDisabled: true });
  await client.send('Network.setBypassServiceWorker', { bypass: true });
  await client.send('Page.addScriptToEvaluateOnNewDocument', {
    source: `(() => {
      window.__dssScalabilityVitals = { lcp: 0, cls: 0, layoutShifts: [] };
      try {
        new PerformanceObserver(list => {
          const entries = list.getEntries();
          const last = entries[entries.length - 1];
          if (last) window.__dssScalabilityVitals.lcp = last.startTime;
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (entry.hadRecentInput) continue;
            window.__dssScalabilityVitals.cls += entry.value;
            window.__dssScalabilityVitals.layoutShifts.push({
              value: entry.value,
              startTime: entry.startTime,
              sources: (entry.sources || []).map(source => ({
                node: source.node
                  ? [source.node.tagName, source.node.id, source.node.className].filter(Boolean).join('#')
                  : null,
                previousRect: source.previousRect,
                currentRect: source.currentRect
              }))
            });
          }
        }).observe({ type: 'layout-shift', buffered: true });
      } catch {}
    })();`
  });

  requestPhase = 'initial';
  await navigate(preview.url, `Boolean(document.querySelector('#main-root [data-result-id]'))`);
  await sleep(400);
  requestPhase = 'core';
  await readVitals();
  await verifyCoreGallery();
  await verifyLazyPeekFailureAndRetry();
  await verifyDetailAndDevice();
  await verifySplitPicker();
  await verifySelectionDock();
  await verifyCoreResponsiveAndMotion();

  const devPort = await getFreePort();
  const dev = await startViteServer('dev', devPort);
  devProcess = dev.processHandle;
  await verifySyntheticCapacity(dev.url);
  finalizeReport();
  writeReport();

  process.stdout.write(
    `render scalability Chrome QA ${report.summary.passed ? 'PASS' : 'FAIL'}\n`
    + `- Chrome: ${report.chromeVersion}\n`
    + `- initial JS/CSS: ${(report.bundle.javascript.gzipBytes / 1000).toFixed(2)}kB / ${(report.bundle.css.gzipBytes / 1000).toFixed(2)}kB gzip\n`
    + `- LCP/CLS: ${report.vitals.lcpMs}ms / ${report.vitals.cls}\n`
    + `- synthetic: ${report.summary.syntheticCounts.join(', ')}\n`
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
  process.stderr.write(`${report.fatal}\n`);
  process.exitCode = 2;
} finally {
  client?.close();
  await stopProcess(chromeProcess);
  await stopProcess(devProcess);
  await stopProcess(previewProcess);
  if (profileDirectory) {
    rmSync(profileDirectory, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  }
}
