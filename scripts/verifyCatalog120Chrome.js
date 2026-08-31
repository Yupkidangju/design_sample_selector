#!/usr/bin/env node

import { spawn, spawnSync } from 'node:child_process';
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync
} from 'node:fs';
import { createServer } from 'node:net';
import { cpus, freemem, loadavg, tmpdir, totalmem } from 'node:os';
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
const BLOG_PROGRESS_WIDTHS = Object.freeze([375, 768, 1024]);
const REPRESENTATIVE_ID = 'spatial-glass-ui';
const TRANSITION_ID = 'ai-native-gradient';
const REPRESENTATIVE_PROJECT_LABEL = `${ALL_STYLES.find(style => style.id === REPRESENTATIVE_ID)?.name.en} System`;
const TRANSITION_PROJECT_LABEL = `${ALL_STYLES.find(style => style.id === TRANSITION_ID)?.name.en} System`;
const EXPECTED_STATE_COUNT = ALL_STYLES.length * ARCHETYPE_IDS.length * 2;
const SKIP_AUDIO_PROBE = process.env.DSS_SKIP_AUDIO_PROBE === '1';

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
const presentationSamples = [];
const endToEndSamples = [];
const operationSamples = [];
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
  audit9: {
    lazyDetail: null,
    statefulTransition: null,
    detailSidebar: null,
    audioPreInit: null,
    zoom: null,
    checkout: null,
    blog: null,
    dashboard: null,
    keyboard: null
  },
  split: null,
  peek: null,
  dock: null,
  reducedMotion: null,
  vitals: null,
  lazyCss: null,
  interactions: null,
  hostLoad: {
    platform: process.platform,
    architecture: process.arch,
    logicalCpuCount: cpus().length,
    samples: []
  },
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

function recordInteraction(operation, value) {
  const measurement = value && typeof value === 'object' ? value : null;
  const processingMs = Number(measurement?.processingMs ?? value);
  const endToEndMs = Number(measurement?.endToEndMs ?? processingMs);
  const postSettleFramesMs = Number(measurement?.postSettleFramesMs ?? 0);
  if (!Number.isFinite(processingMs) || !Number.isFinite(endToEndMs)) return;
  interactionSamples.push(processingMs);
  endToEndSamples.push(endToEndMs);
  if (Number.isFinite(postSettleFramesMs)) presentationSamples.push(postSettleFramesMs);
  operationSamples.push({
    operation,
    processingMs: Number(processingMs.toFixed(2)),
    endToEndMs: Number(endToEndMs.toFixed(2)),
    ...(measurement ? {
      handlerMs: Number(measurement.handlerMs.toFixed(2)),
      settleMs: Number(measurement.settleMs.toFixed(2)),
      postSettleFramesMs: Number(postSettleFramesMs.toFixed(2)),
      longTasks: measurement.longTasks
    } : {})
  });
}

function sampleHostLoad(stage) {
  const memoryTotalBytes = totalmem();
  const memoryFreeBytes = freemem();
  const loadAverage = loadavg().map(value => Number(value.toFixed(2)));
  report.hostLoad.samples.push({
    stage,
    sampledAt: new Date().toISOString(),
    loadAverage,
    loadAveragePerCpu: loadAverage.map(value => Number((value / report.hostLoad.logicalCpuCount).toFixed(3))),
    memoryTotalBytes,
    memoryFreeBytes,
    memoryUsedRatio: Number(((memoryTotalBytes - memoryFreeBytes) / memoryTotalBytes).toFixed(3))
  });
}

function summarizeTimings(samples) {
  const normalized = samples.map(Number).filter(Number.isFinite);
  const ordered = [...normalized].sort((left, right) => left - right);
  const midpoint = Math.floor(ordered.length / 2);
  const median = ordered.length % 2
    ? ordered[midpoint]
    : ((ordered[midpoint - 1] || 0) + (ordered[midpoint] || 0)) / 2;
  return {
    count: normalized.length,
    averageMs: Number((normalized.reduce((sum, value) => sum + value, 0) / Math.max(1, normalized.length)).toFixed(2)),
    medianMs: Number(median.toFixed(2)),
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
    element.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' });
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

async function clickSelectorWithUserGesture(selector) {
  const result = await client.send('Runtime.evaluate', {
    expression: `(() => {
      const element = document.querySelector(${JSON.stringify(selector)});
      if (!element) return false;
      element.click();
      return true;
    })()`,
    userGesture: true,
    returnByValue: true
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  }
  return result.result?.value === true;
}

async function measurePageInteraction(
  selector,
  settledExpression,
  { double = false, timeout = 15_000 } = {}
) {
  const measurement = await evaluate(`(async () => {
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!element) return { found: false, settled: false, processingMs: null, endToEndMs: null };
    const nextFrame = () => new Promise(requestAnimationFrame);
    const isSettled = () => Boolean(${settledExpression});
    const observedLongTasks = [];
    const longTaskObserver = PerformanceObserver.supportedEntryTypes?.includes('longtask')
      ? new PerformanceObserver(list => observedLongTasks.push(...list.getEntries()))
      : null;
    longTaskObserver?.observe({ type: 'longtask', buffered: false });

    element.scrollIntoView({ block: 'center', inline: 'center' });
    await nextFrame();
    const started = performance.now();
    if (${double}) {
      element.dispatchEvent(new MouseEvent('dblclick', {
        bubbles: true,
        cancelable: true,
        view: window
      }));
    } else {
      element.click();
    }
    const afterDispatch = performance.now();

    const deadline = started + ${Number(timeout)};
    let settled = isSettled();
    while (!settled && performance.now() < deadline) {
      await nextFrame();
      settled = isSettled();
    }
    const settledAt = performance.now();
    await nextFrame();
    await nextFrame();
    const finished = performance.now();
    observedLongTasks.push(...(longTaskObserver?.takeRecords() || []));
    longTaskObserver?.disconnect();
    return {
      found: true,
      settled,
      processingMs: settledAt - started,
      endToEndMs: finished - started,
      handlerMs: afterDispatch - started,
      settleMs: settledAt - afterDispatch,
      postSettleFramesMs: finished - settledAt,
      longTasks: observedLongTasks
        .filter(entry => entry.startTime >= started && entry.startTime <= finished)
        .map(entry => ({
          startTime: Number(entry.startTime.toFixed(2)),
          durationMs: Number(entry.duration.toFixed(2))
        }))
    };
  })()`);

  if (!measurement?.found) throw new Error(`interaction 대상 누락: ${selector}`);
  if (!measurement.settled) throw new Error(`interaction 정착 시간 초과: ${selector}`);
  return measurement;
}

async function pressKey(key, code, windowsVirtualKeyCode) {
  await client.send('Input.dispatchKeyEvent', {
    type: 'rawKeyDown',
    key,
    code,
    windowsVirtualKeyCode
  });
  await client.send('Input.dispatchKeyEvent', {
    type: 'keyUp',
    key,
    code,
    windowsVirtualKeyCode
  });
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

async function setSearch(value, { record = true } = {}) {
  const measurement = await evaluate(`(async () => {
    const { appState } = await import('./src/state/appState.js');
    const input = document.querySelector('#search-input');
    if (!input) throw new Error('검색 input 누락');
    const nextFrame = () => new Promise(requestAnimationFrame);
    const expected = ${JSON.stringify(value)};
    const observedLongTasks = [];
    const longTaskObserver = PerformanceObserver.supportedEntryTypes?.includes('longtask')
      ? new PerformanceObserver(list => observedLongTasks.push(...list.getEntries()))
      : null;
    longTaskObserver?.observe({ type: 'longtask', buffered: false });
    const started = performance.now();
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, expected);
    input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));
    const afterDispatch = performance.now();
    let settled = appState.getState().searchQuery === expected
      && document.querySelector('#search-input')?.value === expected
      && Boolean(document.querySelector('#main-root .gallery-wrapper, #main-root .empty-results-box'));
    const deadline = started + 15_000;
    while (!settled && performance.now() < deadline) {
      await nextFrame();
      settled = appState.getState().searchQuery === expected
        && document.querySelector('#search-input')?.value === expected
        && Boolean(document.querySelector('#main-root .gallery-wrapper, #main-root .empty-results-box'));
    }
    const settledAt = performance.now();
    await nextFrame();
    await nextFrame();
    const finished = performance.now();
    observedLongTasks.push(...(longTaskObserver?.takeRecords() || []));
    longTaskObserver?.disconnect();
    return {
      settled,
      processingMs: settledAt - started,
      endToEndMs: finished - started,
      handlerMs: afterDispatch - started,
      settleMs: settledAt - afterDispatch,
      postSettleFramesMs: finished - settledAt,
      longTasks: observedLongTasks
        .filter(entry => entry.startTime >= started && entry.startTime <= finished)
        .map(entry => ({
          startTime: Number(entry.startTime.toFixed(2)),
          durationMs: Number(entry.duration.toFixed(2))
        }))
    };
  })()`);
  if (!measurement?.settled) throw new Error(`검색 interaction 정착 시간 초과: ${value}`);
  if (record) recordInteraction(value ? `search:${value}` : 'search:clear', measurement);
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

  if (SKIP_AUDIO_PROBE) {
    await evaluate(`(async () => {
      const { appState } = await import('./src/state/appState.js');
      appState.setState({ audio: { sfxEnabled: false } });
    })()`);
    report.audit9.audioPreInit = {
      skipped: true,
      sfxDisabledForRun: true,
      reason: 'DSS_SKIP_AUDIO_PROBE=1 (headless Crostini audio device unavailable)'
    };
  } else {
    const audioBeforeFirstPlay = await evaluate(`(async () => {
    const [{ synthAudio }, { appState }] = await Promise.all([
      import('./src/audio/synthAudio.js'),
      import('./src/state/appState.js')
    ]);
    const input = document.querySelector('#input-audio-volume');
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    const initializedBefore = synthAudio.initialized;
    setter.call(input, '0');
    input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));
    return {
      initializedBefore,
      stateBeforeInit: appState.getState().audio.volume,
      sliderBeforeInit: Number(input.value)
    };
  })()`);
    check(await clickSelectorWithUserGesture('#btn-audio-play'), '오디오 재생 버튼 누락');
    await waitFor(
      `document.querySelector('#btn-audio-play')?.classList.contains('playing')`,
      '최초 volume 0 BGM 재생'
    );
    const audioAfterFirstPlay = await evaluate(`(async () => {
    const [{ synthAudio }, { appState }] = await Promise.all([
      import('./src/audio/synthAudio.js'),
      import('./src/state/appState.js')
    ]);
    await new Promise(requestAnimationFrame);
    return {
      initialized: synthAudio.initialized,
      playing: synthAudio.isPlaying,
      stateVolume: appState.getState().audio.volume,
      gain: synthAudio.masterGain?.gain?.value ?? null
    };
  })()`);
    check(await clickSelectorWithUserGesture('#btn-audio-play'), '오디오 정지 버튼 누락');
    await waitFor(
      `!document.querySelector('#btn-audio-play')?.classList.contains('playing')`,
      'BGM probe 정지'
    );
    const audioRestored = await evaluate(`(async () => {
    const [{ appState }] = await Promise.all([import('./src/state/appState.js')]);
    const input = document.querySelector('#input-audio-volume');
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, '0.5');
    input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));
    return {
      stateVolume: appState.getState().audio.volume,
      sliderVolume: Number(input.value)
    };
  })()`);
    report.audit9.audioPreInit = {
      skipped: false,
      beforeFirstPlay: audioBeforeFirstPlay,
      afterFirstPlay: audioAfterFirstPlay,
      restored: audioRestored
    };
    check(
      audioBeforeFirstPlay.initializedBefore === false
        && audioBeforeFirstPlay.stateBeforeInit === 0
        && audioBeforeFirstPlay.sliderBeforeInit === 0
        && audioAfterFirstPlay.initialized
        && audioAfterFirstPlay.playing
        && audioAfterFirstPlay.stateVolume === 0
        && audioAfterFirstPlay.gain === 0
        && audioRestored.stateVolume === 0.5
        && audioRestored.sliderVolume === 0.5,
      '최초 AudioContext 생성 전 volume 상태/gain 동기화 실패'
    );
  }

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
    const isActiveMode = await evaluate(
      `document.querySelector('.view-mode-btn[data-mode="${mode}"]')?.getAttribute('aria-pressed') === 'true'`
    );
    const duration = isActiveMode ? null : await measurePageInteraction(
      `.view-mode-btn[data-mode="${mode}"]`,
      `document.querySelector('.view-mode-btn[data-mode="${mode}"]')?.getAttribute('aria-pressed') === 'true'`
    );
    await waitFor(
      `document.querySelector('.view-mode-btn[data-mode="${mode}"]')?.getAttribute('aria-pressed') === 'true'`,
      `${mode} 보기`
    );
    if (!isActiveMode) recordInteraction(`gallery:view:${mode}`, duration);

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
      const pageDuration = await measurePageInteraction(
        '#main-root [data-gallery-page="next"]',
        `document.activeElement?.classList.contains('gallery-page-status')`
      );
      await waitFor(
        `document.activeElement?.classList.contains('gallery-page-status')`,
        `${mode} 다음 페이지`
      );
      recordInteraction(
        `gallery:${mode}:page:${pageCount}->${pageCount + 1}`,
        pageDuration
      );
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
    import('./src/data/categories.js'),
    import('./src/components/archetypeTemplates.js')
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
  await setSearch('', { record: false });
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

  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 180,
    downloadThroughput: -1,
    uploadThroughput: -1
  });
  await evaluate(`document.querySelector(${JSON.stringify(tileSelector)})?.focus()`);
  const injectedStarted = await evaluate('performance.now()');
  await clickSelector(tileSelector, { double: true });
  report.audit9.lazyDetail = await evaluate(`(() => ({
    dialog: document.querySelector('.lazy-preview-state')?.getAttribute('role') || null,
    busy: document.querySelector('.lazy-preview-state')?.getAttribute('aria-busy') || null,
    activeCancel: document.activeElement?.hasAttribute('data-lazy-detail-cancel') || false,
    openerId: document.querySelector(${JSON.stringify(tileSelector)})?.dataset.subId || null
  }))()`);
  report.audit9.lazyDetail.loadingCaptureMs = Number(
    ((await evaluate('performance.now()')) - injectedStarted).toFixed(2)
  );
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 0,
    downloadThroughput: -1,
    uploadThroughput: -1
  });
  check(
    report.audit9.lazyDetail.dialog === 'dialog'
      && report.audit9.lazyDetail.busy === 'true'
      && report.audit9.lazyDetail.activeCancel,
    'Detail lazy loading focus/dialog 계약 실패'
  );
  await pressKey('Escape', 'Escape', 27);
  await waitFor(
    `!document.querySelector('.lazy-preview-state')
      && document.activeElement?.dataset.subId === '${REPRESENTATIVE_ID}'`,
    'lazy Detail Escape/focus restore'
  );
  report.audit9.lazyDetail.escapeClosed = true;
  report.audit9.lazyDetail.openerRestored = true;

  const detailDuration = await measurePageInteraction(
    tileSelector,
    `document.querySelector('#mockup-viewport')?.dataset.theme === '${REPRESENTATIVE_ID}'`,
    { double: true, timeout: 15_000 }
  );
  await waitFor(
    `document.querySelector('#mockup-viewport')?.dataset.theme === '${REPRESENTATIVE_ID}'`,
    '대표 신규 Detail',
    15_000
  );
  report.audit9.lazyDetail.actualLoadMs = Number(detailDuration.processingMs.toFixed(2));
  recordInteraction('detail:open', detailDuration);

  report.audit9.detailSidebar = await evaluate(`(() => {
    const card = document.querySelector('.palette-swatch-card');
    const swatch = document.querySelector('.swatch-color');
    const slider = document.querySelector('.tweak-slider');
    const title = document.querySelector('.style-title');
    const description = document.querySelector('.style-desc');
    const hero = document.querySelector('.style-hero-summary');
    const block = document.querySelector('.sidebar-block');
    const paletteGrid = document.querySelector('.palette-swatches-grid');
    const cardStyle = getComputedStyle(card);
    const swatchRect = swatch.getBoundingClientRect();
    const sliderStyle = getComputedStyle(slider);
    const heroRect = hero.getBoundingClientRect();
    const titleRect = title.getBoundingClientRect();
    const descriptionRect = description.getBoundingClientRect();
    return {
      cardDisplay: cardStyle.display,
      cardBackground: cardStyle.backgroundColor,
      cardHeight: Number(card.getBoundingClientRect().height.toFixed(1)),
      swatchWidth: Number(swatchRect.width.toFixed(1)),
      swatchHeight: Number(swatchRect.height.toFixed(1)),
      swatchColor: getComputedStyle(swatch).backgroundColor,
      sliderAppearance: sliderStyle.appearance || sliderStyle.webkitAppearance,
      sliderHeight: Number(slider.getBoundingClientRect().height.toFixed(1)),
      titleFontSize: Number.parseFloat(getComputedStyle(title).fontSize),
      heroHeight: Number(heroRect.height.toFixed(1)),
      heroScrollHeight: hero.scrollHeight,
      titleVisible: titleRect.height > 0
        && titleRect.top >= heroRect.top
        && titleRect.bottom <= heroRect.bottom + 1,
      descriptionVisible: descriptionRect.height > 0
        && descriptionRect.top >= heroRect.top
        && descriptionRect.bottom <= heroRect.bottom + 1,
      blockBorderStyle: getComputedStyle(block).borderTopStyle,
      paletteColumns: getComputedStyle(paletteGrid).gridTemplateColumns
    };
  })()`);
  check(
    report.audit9.detailSidebar.cardDisplay === 'grid'
      && report.audit9.detailSidebar.cardBackground !== 'rgba(0, 0, 0, 0)'
      && report.audit9.detailSidebar.cardHeight >= 50
      && report.audit9.detailSidebar.swatchWidth >= 32
      && report.audit9.detailSidebar.swatchHeight >= 32
      && report.audit9.detailSidebar.swatchColor !== 'rgba(0, 0, 0, 0)'
      && report.audit9.detailSidebar.sliderAppearance === 'none'
      && report.audit9.detailSidebar.sliderHeight >= 19
      && report.audit9.detailSidebar.titleFontSize >= 22
      && report.audit9.detailSidebar.titleVisible
      && report.audit9.detailSidebar.descriptionVisible
      && report.audit9.detailSidebar.blockBorderStyle === 'solid'
      && report.audit9.detailSidebar.paletteColumns !== 'none',
    '공통 Detail 사이드바 computed presentation 실패'
  );

  const gameBefore = await evaluate(`(() => {
    const viewport = document.querySelector('#mockup-viewport');
    const renderer = viewport?.firstElementChild;
    const target = viewport?.querySelector('#game-target');
    window.__dssAudit9Viewport = viewport;
    window.__dssAudit9Renderer = renderer;
    target?.focus();
    return {
      coin: viewport?.querySelector('#game-coin-count')?.textContent.trim() || null,
      motion: [...(renderer?.classList || [])].filter(name => name.startsWith('motion-')),
      targetFocused: document.activeElement === target
    };
  })()`);
  await pressKey('Enter', 'Enter', 13);
  const gameAfterKeyboard = await waitFor(
    `document.querySelector('#game-coin-count')?.textContent.trim() !== ${JSON.stringify(gameBefore.coin)}
      && document.querySelector('#game-coin-count')?.textContent.trim()`,
    'Game role button Enter'
  );

  const transitionDuration = await measurePageInteraction(
    `.top-style-chip[data-sub-id="${TRANSITION_ID}"]`,
    `document.querySelector('#mockup-viewport')?.dataset.theme === '${TRANSITION_ID}'
      && (document.querySelector('#live-html-code')?.textContent || '').includes('AI 네이티브')`
  );
  await waitFor(
    `document.querySelector('#mockup-viewport')?.dataset.theme === '${TRANSITION_ID}'
      && (document.querySelector('#live-html-code')?.textContent || '').includes('AI 네이티브')`,
    'stateful renderer 전환'
  );
  recordInteraction(
    `detail:style:${REPRESENTATIVE_ID}->${TRANSITION_ID}`,
    transitionDuration
  );
  const transitioned = await evaluate(`(() => {
    const viewport = document.querySelector('#mockup-viewport');
    const renderer = viewport?.firstElementChild;
    return {
      viewportIdentity: window.__dssAudit9Viewport === viewport,
      rendererRebuilt: window.__dssAudit9Renderer !== renderer,
      theme: viewport?.dataset.theme || null,
      coin: viewport?.querySelector('#game-coin-count')?.textContent.trim() || null,
      motion: [...(renderer?.classList || [])].filter(name => name.startsWith('motion-')),
      styleText: viewport?.querySelector('.hud-player-level')?.textContent.trim() || '',
      inspectorUpdated: (document.querySelector('#live-html-code')?.textContent || '').includes('AI 네이티브'),
      selectedChip: document.querySelector('.top-style-chip[aria-selected="true"]')?.dataset.subId || null
    };
  })()`);

  await clickSelector(`.top-style-chip[data-sub-id="${REPRESENTATIVE_ID}"]`);
  await waitFor(
    `document.querySelector('#mockup-viewport')?.dataset.theme === '${REPRESENTATIVE_ID}'`,
    '대표 style 복귀'
  );
  const returnedCoin = await evaluate(`document.querySelector('#game-coin-count')?.textContent.trim() || null`);
  report.audit9.statefulTransition = {
    from: REPRESENTATIVE_ID,
    to: TRANSITION_ID,
    gameBefore,
    gameAfterKeyboard,
    transitioned,
    returnedCoin
  };
  check(gameBefore.targetFocused && gameAfterKeyboard !== gameBefore.coin, 'Game role button Enter 동작 실패');
  check(transitioned.viewportIdentity && transitioned.rendererRebuilt, 'style 전환 renderer identity 계약 실패');
  check(transitioned.theme === TRANSITION_ID && transitioned.selectedChip === TRANSITION_ID, 'style 전환 theme/selector 불일치');
  check(transitioned.coin === gameAfterKeyboard && returnedCoin === gameAfterKeyboard, 'style 전환 Game state 소실');
  check(
    transitioned.inspectorUpdated
      && transitioned.styleText.includes('AI 네이티브')
      && JSON.stringify(transitioned.motion) !== JSON.stringify(gameBefore.motion),
    'style 전환 renderer text/motion/Inspector 동기화 실패'
  );

  await clickSelector('.zoom-btn[data-scale="1.2"]');
  await waitFor(
    `document.querySelector('#mockup-viewport .archetype-unit, #mockup-viewport .mockup-unit')?.style.transform === 'scale(1.2)'`,
    '120% Zoom 적용'
  );
  await clickSelector(`.top-style-chip[data-sub-id="${TRANSITION_ID}"]`);
  await waitFor(
    `document.querySelector('#mockup-viewport')?.dataset.theme === '${TRANSITION_ID}'`,
    'Zoom style 전환'
  );
  const zoomAfterStyleSwap = await evaluate(`(() => ({
    activeScale: document.querySelector('.zoom-btn.active')?.dataset.scale || null,
    transform: document.querySelector('#mockup-viewport .archetype-unit, #mockup-viewport .mockup-unit')?.style.transform || null
  }))()`);
  await clickSelector(`.top-style-chip[data-sub-id="${REPRESENTATIVE_ID}"]`);
  await waitFor(
    `document.querySelector('#mockup-viewport')?.dataset.theme === '${REPRESENTATIVE_ID}'`,
    'Zoom 대표 style 복귀'
  );

  await clickSelector('.archetype-tab-btn[data-archetype="web"]');
  await waitFor(`Boolean(document.querySelector('.e120-${REPRESENTATIVE_ID}-unit'))`, '대표 신규 Web');

  const zoomAfterArchetype = await evaluate(`(() => ({
    activeScale: document.querySelector('.zoom-btn.active')?.dataset.scale || null,
    afterArchetypeSwap: document.querySelector('#mockup-viewport .archetype-unit, #mockup-viewport .mockup-unit')?.style.transform || null
  }))()`);
  report.audit9.zoom = {
    ...zoomAfterArchetype,
    afterStyleSwap: zoomAfterStyleSwap.transform
  };
  check(
    zoomAfterStyleSwap.activeScale === '1.2'
      && report.audit9.zoom.activeScale === '1.2'
      && report.audit9.zoom.afterStyleSwap === 'scale(1.2)'
      && report.audit9.zoom.afterArchetypeSwap === 'scale(1.2)',
    'style/archetype renderer 전환 후 Zoom 표시·배율 불일치'
  );
  await clickSelector('.zoom-btn[data-scale="1.0"]');
  await waitFor(
    `document.querySelector('#mockup-viewport .archetype-unit, #mockup-viewport .mockup-unit')?.style.transform === 'scale(1)'`,
    'Zoom 100% 복원'
  );

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

  await clickSelector('.archetype-tab-btn[data-archetype="ecommerce"]');
  await waitFor(`Boolean(document.querySelector('.archetype-ecommerce'))`, 'E-commerce checkout');
  const emptyCartDisabled = await evaluate(`document.querySelector('.cart-checkout-btn')?.disabled === true`);
  await clickSelector('.instant-buy-btn[data-checkout-source="direct"]');
  await waitFor(`Boolean(document.querySelector('.mock-checkout-dialog'))`, 'direct checkout dialog');
  report.audit9.checkout = await evaluate(`(() => ({
    emptyCartDisabled: ${emptyCartDisabled},
    role: document.querySelector('.mock-checkout-dialog')?.getAttribute('role') || null,
    modal: document.querySelector('.mock-checkout-dialog')?.getAttribute('aria-modal') || null,
    activeCancel: document.activeElement?.hasAttribute('data-checkout-cancel') || false,
    directSummary: (document.querySelector('.mock-checkout-summary')?.textContent || '').includes('바로 구매'),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
  }))()`);
  await pressKey('Escape', 'Escape', 27);
  await waitFor(`!document.querySelector('.mock-checkout-dialog')`, 'checkout Escape close');
  report.audit9.checkout.openerRestored = await evaluate(
    `document.activeElement?.matches('.instant-buy-btn[data-checkout-source="direct"]') || false`
  );
  check(
    report.audit9.checkout.emptyCartDisabled
      && report.audit9.checkout.role === 'dialog'
      && report.audit9.checkout.modal === 'true'
      && report.audit9.checkout.activeCancel
      && report.audit9.checkout.directSummary
      && report.audit9.checkout.openerRestored,
    'checkout source/focus/Escape 계약 실패'
  );
  check(report.audit9.checkout.overflow <= 1, `checkout overflow ${report.audit9.checkout.overflow}px`);

  await clickSelector('.add-to-cart-btn');
  await waitFor(
    `Number(document.querySelector('#shop-cart-badge')?.textContent || 0) > 0
      && document.querySelector('.cart-checkout-btn')?.disabled === false`,
    'cart item 추가'
  );
  await clickSelector('.cart-checkout-btn[data-checkout-source="cart"]');
  await waitFor(`Boolean(document.querySelector('.mock-checkout-dialog'))`, 'cart checkout dialog');
  report.audit9.checkout.cartSummary = await evaluate(
    `(document.querySelector('.mock-checkout-summary')?.textContent || '').includes('장바구니 결제')`
  );
  await clickSelector('.mock-checkout-actions [data-checkout-cancel]');
  await waitFor(`!document.querySelector('.mock-checkout-dialog')`, 'cart checkout cancel');
  report.audit9.checkout.cartPreservedAfterCancel = await evaluate(`
    Number(document.querySelector('#shop-cart-badge')?.textContent || 0) > 0
      && document.querySelector('.cart-checkout-btn')?.disabled === false
  `);
  await clickSelector('.cart-checkout-btn[data-checkout-source="cart"]');
  await waitFor(`Boolean(document.querySelector('.mock-checkout-dialog'))`, 'cart checkout reopen');
  await clickSelector('.mock-checkout-actions [data-checkout-confirm]');
  await waitFor(`!document.querySelector('.mock-checkout-dialog')`, 'cart checkout confirm');
  report.audit9.checkout.cartClearedAfterConfirm = await evaluate(`
    document.querySelector('#shop-cart-badge')?.textContent.trim() === '0'
      && document.querySelector('.cart-checkout-btn')?.disabled === true
  `);
  check(
    report.audit9.checkout.cartSummary
      && report.audit9.checkout.cartPreservedAfterCancel
      && report.audit9.checkout.cartClearedAfterConfirm,
    'cart checkout cancel/confirm 상태 계약 실패'
  );

  await clickSelector('.archetype-tab-btn[data-archetype="blog"]');
  await waitFor(`Boolean(document.querySelector('.archetype-blog'))`, 'Blog runtime');
  await setViewport(768, 1_050);
  const blogBefore = await evaluate(`(() => {
    const unit = document.querySelector('.archetype-blog');
    const style = getComputedStyle(unit);
    const input = document.querySelector('#blog-comment-input');
    if (input) input.value = 'audit9-stateful-comment';
    return {
      background: style.backgroundColor,
      color: style.color,
      maxlength: input?.maxLength || null
    };
  })()`);
  await clickSelector('.comment-submit-btn');
  await clickSelector('[data-action="blog-reading-mode"]');
  await waitFor(`document.querySelector('[data-action="blog-reading-mode"]')?.getAttribute('aria-pressed') === 'true'`, 'Blog light mode');
  await clickSelector(`.top-style-chip[data-sub-id="${TRANSITION_ID}"]`);
  await waitFor(
    `document.querySelector('#mockup-viewport')?.dataset.theme === '${TRANSITION_ID}'
      && document.querySelector('[data-action="blog-reading-mode"]')?.getAttribute('aria-pressed') === 'true'
      && (document.querySelector('#blog-comments-list')?.textContent || '').includes('audit9-stateful-comment')`,
    'Blog state migration'
  );
  const responsiveProgress = [];
  for (const width of BLOG_PROGRESS_WIDTHS) {
    await setViewport(width, 1_050);
    await sleep(40);
    await evaluate(`(() => {
      const owner = document.querySelector('.modal-body-grid');
      if (!owner) return;
      owner.scrollTop = 0;
      owner.dispatchEvent(new Event('scroll'));
    })()`);
    await waitFor(
      `document.querySelector('#blog-progress-track')?.getAttribute('aria-valuenow') === '0'`,
      `Blog ${width}px progress start`
    );
    const start = await evaluate(`(() => {
      const owner = document.querySelector('.modal-body-grid');
      return {
        maxScroll: Math.max(0, Math.round((owner?.scrollHeight || 0) - (owner?.clientHeight || 0))),
        scrollTop: Math.round(owner?.scrollTop || 0),
        startProgress: Number(document.querySelector('#blog-progress-track')?.getAttribute('aria-valuenow') || -1)
      };
    })()`);
    await evaluate(`(() => {
      const owner = document.querySelector('.modal-body-grid');
      if (!owner) return;
      owner.scrollTop = Math.max(0, owner.scrollHeight - owner.clientHeight);
      owner.dispatchEvent(new Event('scroll'));
    })()`);
    await waitFor(
      `document.querySelector('#blog-progress-track')?.getAttribute('aria-valuenow') === '100'`,
      `Blog ${width}px progress end`
    );
    const end = await evaluate(`(() => {
      const owner = document.querySelector('.modal-body-grid');
      return {
        scrollTop: Math.round(owner?.scrollTop || 0),
        endProgress: Number(document.querySelector('#blog-progress-track')?.getAttribute('aria-valuenow') || -1),
        ariaValueText: document.querySelector('#blog-progress-track')?.getAttribute('aria-valuetext') || null
      };
    })()`);
    responsiveProgress.push({ width, ...start, ...end });
  }
  const blogState = await evaluate(`(() => {
    const unit = document.querySelector('.archetype-blog');
    const style = getComputedStyle(unit);
    return {
      before: ${JSON.stringify(blogBefore)},
      after: { background: style.backgroundColor, color: style.color },
      pressed: document.querySelector('[data-action="blog-reading-mode"]')?.getAttribute('aria-pressed') || null,
      commentPreserved: (document.querySelector('#blog-comments-list')?.textContent || '').includes('audit9-stateful-comment'),
      dynamicComments: document.querySelectorAll('#blog-comments-list .comment-item.is-runtime').length,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    };
  })()`);
  report.audit9.blog = { ...blogState, responsiveProgress };
  check(
    report.audit9.blog.before.maxlength === 500
      && report.audit9.blog.pressed === 'true'
      && report.audit9.blog.commentPreserved
      && report.audit9.blog.dynamicComments === 1,
    'Blog 입력/light/state migration 계약 실패'
  );
  check(
    report.audit9.blog.before.background !== report.audit9.blog.after.background
      && report.audit9.blog.before.color !== report.audit9.blog.after.color,
    'Blog reading mode computed color 변화 없음'
  );
  check(
    report.audit9.blog.responsiveProgress.length === BLOG_PROGRESS_WIDTHS.length
      && report.audit9.blog.responsiveProgress.every(item => (
        item.maxScroll > 0
          && item.scrollTop > 0
          && item.startProgress === 0
          && item.endProgress === 100
          && item.ariaValueText === '100% 읽음'
      )),
    'Blog 375/768/1024px scroll owner/progress 0→100 실패'
  );
  check(report.audit9.blog.overflow <= 1, `Blog responsive overflow ${report.audit9.blog.overflow}px`);
  await clickSelector(`.top-style-chip[data-sub-id="${REPRESENTATIVE_ID}"]`);
  await waitFor(`document.querySelector('#mockup-viewport')?.dataset.theme === '${REPRESENTATIVE_ID}'`, 'Blog 대표 style 복귀');
  await setViewport(1440, 1_100);

  await clickSelector('.archetype-tab-btn[data-archetype="dashboard"]');
  await waitFor(`Boolean(document.querySelector('.archetype-dashboard'))`, 'Dashboard runtime');
  const completedLabel = await evaluate(`document.querySelector('.status-badge.success')?.textContent.trim()`);
  await evaluate(`(() => {
    const input = document.querySelector('.table-filter-input');
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, ${JSON.stringify(completedLabel)});
    input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));
  })()`);
  await clickSelector('.dash-sort-btn[data-sort="project"]');
  await waitFor(
    `document.querySelectorAll('#dash-table-body tr').length === 2
      && document.querySelector('.dash-sort-btn[data-sort="project"]')?.dataset.dir === '1'`,
    'Dashboard filter/sort 설정'
  );
  await clickSelector(`.top-style-chip[data-sub-id="${TRANSITION_ID}"]`);
  await waitFor(
    `document.querySelector('#mockup-viewport')?.dataset.theme === '${TRANSITION_ID}'
      && document.querySelector('.table-filter-input')?.value === ${JSON.stringify(completedLabel)}
      && document.querySelectorAll('#dash-table-body tr').length === 2`,
    'Dashboard state migration'
  );
  report.audit9.dashboard = await evaluate(`(() => {
    const bodyText = document.querySelector('#dash-table-body')?.textContent || '';
    const sortButton = document.querySelector('.dash-sort-btn[data-sort="project"]');
    return {
      filterPreserved: document.querySelector('.table-filter-input')?.value === ${JSON.stringify(completedLabel)},
      sortPreserved: sortButton?.classList.contains('active') && sortButton?.dataset.dir === '1',
      filteredRows: document.querySelectorAll('#dash-table-body tr').length,
      newStyleRows: bodyText.includes(${JSON.stringify(TRANSITION_PROJECT_LABEL)}),
      staleStyleRows: bodyText.includes(${JSON.stringify(REPRESENTATIVE_PROJECT_LABEL)})
    };
  })()`);
  check(
    report.audit9.dashboard.filterPreserved
      && report.audit9.dashboard.sortPreserved
      && report.audit9.dashboard.filteredRows === 2
      && report.audit9.dashboard.newStyleRows
      && !report.audit9.dashboard.staleStyleRows,
    'Dashboard filter/sort 또는 새 renderer row migration 실패'
  );
  await clickSelector(`.top-style-chip[data-sub-id="${REPRESENTATIVE_ID}"]`);
  await waitFor(`document.querySelector('#mockup-viewport')?.dataset.theme === '${REPRESENTATIVE_ID}'`, 'Dashboard 대표 style 복귀');

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
    role: document.querySelector('.peek-card')?.getAttribute('role') || null,
    theme: document.querySelector('#peek-viewport')?.dataset.theme || null,
    root: Boolean(document.querySelector('#peek-viewport .e120-${REPRESENTATIVE_ID}-unit')),
    busy: document.querySelector('#peek-viewport')?.getAttribute('aria-busy') || null
  }))()`);
  check(
    report.peek.role === 'region'
      && report.peek.theme === REPRESENTATIVE_ID
      && report.peek.root
      && report.peek.busy === null,
    '대표 신규 Peek role/theme 실패'
  );

  await clickSelector(tileSelector);
  await waitFor(`Boolean(document.querySelector('#dock-confirm'))`, '대표 신규 Dock');
  await clickSelector('#dock-confirm');
  await waitFor(
    `Boolean(document.querySelector('#confirm-preview:not([aria-busy]) .e120-${REPRESENTATIVE_ID}-unit'))`,
    '대표 신규 confirm preview',
    15_000
  );
  report.dock = await evaluate(`(() => ({
    role: document.querySelector('.confirm-sheet')?.getAttribute('role') || null,
    theme: document.querySelector('#confirm-preview')?.dataset.theme || null,
    root: Boolean(document.querySelector('#confirm-preview .e120-${REPRESENTATIVE_ID}-unit')),
    busy: document.querySelector('#confirm-preview')?.getAttribute('aria-busy') || null
  }))()`);
  check(
    report.dock.role === 'region'
      && report.dock.theme === REPRESENTATIVE_ID
      && report.dock.root
      && report.dock.busy === null,
    '대표 신규 Dock/confirm role/theme 실패'
  );
  await clickSelector('#confirm-sheet-close');

  await evaluate(`document.querySelector(${JSON.stringify(tileSelector)})?.focus()`);
  await clickSelector(tileSelector, { double: true });
  await waitFor(`Boolean(document.querySelector('#mockup-viewport'))`, 'keyboard Detail open');
  await clickSelector('.archetype-tab-btn[data-archetype="blog"]');
  await waitFor(`Boolean(document.querySelector('#blog-comment-input'))`, 'keyboard Detail Blog');
  await evaluate(`document.querySelector('#blog-comment-input')?.focus()`);
  await pressKey('Escape', 'Escape', 27);
  await waitFor(`!document.querySelector('#mockup-viewport')`, 'input focus Detail Escape');
  report.audit9.keyboard = await evaluate(`(() => ({
    detailClosed: getComputedStyle(document.querySelector('#detail-root')).display === 'none',
    openerRestored: document.activeElement?.dataset.subId === '${REPRESENTATIVE_ID}'
  }))()`);
  check(
    report.audit9.keyboard.detailClosed && report.audit9.keyboard.openerRestored,
    'input focus 중 Detail Escape/focus restore 실패'
  );
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
  report.interactions = {
    measurementMethod: {
      metric: 'processingMs',
      sampleSelection: 'state-changing named operations; no-ops excluded',
      clock: 'window.performance.now()',
      hardGateBoundary: 'input dispatch -> required state/DOM predicate settlement',
      presentationBoundary: 'settlement -> 2 animation frames',
      excludedFromHardGate: [
        'CDP command round-trip',
        'driver polling',
        'artifact I/O',
        'post-settlement frame scheduler wait'
      ]
    },
    ...summarizeTimings(interactionSamples),
    presentation: summarizeTimings(presentationSamples),
    endToEnd: summarizeTimings(endToEndSamples),
    operationSamples: [...operationSamples]
  };
  check(report.interactions.count >= 5, `interaction sample ${report.interactions.count}개/최소 5개`);
  check(report.interactions.medianMs <= 120, `interaction median ${report.interactions.medianMs}ms/120ms`);
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
  sampleHostLoad('before-start');

  check(ALL_STYLES.length === 120 && new Set(ALL_STYLES.map(style => style.id)).size === 120, 'Node catalog 120 계약 실패');
  check(EXPANSION_IDS.length === 84, `Node expansion ${EXPANSION_IDS.length}/84`);
  check(Object.values(report.catalog.categoryCounts).every(count => count === 15), 'category별 15종 계약 실패');
  check(report.catalog.grammarCount === 21, `grammar ${report.catalog.grammarCount}/21`);

  const vitePort = await getFreePort();
  const chromePort = await getFreePort();
  const pageUrl = `http://127.0.0.1:${vitePort}/design_sample_selector/`;
  viteProcess = spawn(
    process.execPath,
    ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(vitePort), '--strictPort'],
    { cwd: PROJECT_ROOT, stdio: ['ignore', 'pipe', 'pipe'] }
  );
  await waitForHttp(pageUrl, 'Vite');

  profileDirectory = mkdtempSync(join(tmpdir(), 'dss-catalog120-chrome-profile-'));
  chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    ...(process.env.DSS_CHROME_AUTOPLAY_BYPASS === '1'
      ? ['--autoplay-policy=no-user-gesture-required']
      : []),
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
    ...(process.env.DSS_CHROME_AUTOPLAY_BYPASS === '1' ? [] : ['--mute-audio']),
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
  sampleHostLoad('after-matrix');
  await verifyResponsive();
  await verifyRepresentativeFlows();
  await verifyReducedMotionAndVitals();
  sampleHostLoad('after-browser-qa');
  finalizeReport();
  writeReport();

  process.stdout.write(
    `actual 120 Chrome QA ${report.summary.passed ? 'PASS' : 'FAIL'}\n`
    + `- Chrome: ${report.chromeVersion}\n`
    + `- catalog/category: ${report.catalog.count} / ${Object.values(report.catalog.categoryCounts).join(',')}\n`
    + `- matrix/Web tabs: ${report.summary.matrixStates} / ${report.summary.webTabs}\n`
    + `- LCP/CLS/interaction median/max: ${report.vitals.lcpMs}ms / ${report.vitals.cls} / ${report.interactions.medianMs}ms / ${report.interactions.maxMs}ms\n`
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
  if (profileDirectory) {
    rmSync(profileDirectory, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  }
}
