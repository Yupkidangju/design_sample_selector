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
  groupStylesByEra,
  queryCatalogForDiscoveryState
} from '../src/catalog/index.js';

const PROJECT_ROOT = fileURLToPath(new URL('..', import.meta.url));
const CHROME_PATH = process.env.DSS_CHROME_PATH || '/usr/bin/google-chrome';
const CORE_STYLES = getAllStyles();
const VIEW_MODES = Object.freeze(['GRID', 'BENTO', 'SPECTRUM']);
const RESPONSIVE_WIDTHS = Object.freeze([320, 375, 414, 768, 1024, 1440]);

const artifactOption = process.argv.find(argument => argument.startsWith('--artifacts='));
const artifactValue = artifactOption?.slice('--artifacts='.length);
const artifactDirectory = artifactValue
  ? (isAbsolute(artifactValue) ? artifactValue : resolve(artifactValue))
  : join(PROJECT_ROOT, '.antigravity', 'archive', 'catalog-discovery-chrome-qa');

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
  coreStyleCount: CORE_STYLES.length,
  contracts: {},
  galleryModes: [],
  scenarios: [],
  responsiveWidths: [],
  reducedMotion: null,
  runtimeSignals,
  screenshots: [],
  issues
};

let viteProcess;
let chromeProcess;
let client;
let profileDirectory;

function sleep(milliseconds) {
  return new Promise(resolveSleep => setTimeout(resolveSleep, milliseconds));
}

function check(condition, message) {
  if (!condition) issues.push(message);
}

function expectedIds(state = {}) {
  return queryCatalogForDiscoveryState(CORE_STYLES, state)
    .slice(0, 36)
    .map(style => style.id);
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
      for (const pending of this.pending.values()) {
        pending.reject(new Error('CDP 연결이 닫힘'));
      }
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

async function waitForApp(url) {
  await waitFor(
    `location.href === ${JSON.stringify(url)} && document.readyState === 'complete' && Boolean(document.querySelector('.discovery-controls'))`,
    `앱 로드 ${url}`,
    15_000
  );
}

async function navigate(url) {
  await client.send('Page.navigate', { url });
  await waitForApp(url);
}

async function clickSelector(selector) {
  const point = await evaluate(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!element) return null;
    element.scrollIntoView({ block: 'center', inline: 'center' });
    const rect = element.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  })()`);
  if (!point) return false;
  await client.send('Input.dispatchMouseEvent', {
    type: 'mousePressed',
    x: point.x,
    y: point.y,
    button: 'left',
    clickCount: 1
  });
  await client.send('Input.dispatchMouseEvent', {
    type: 'mouseReleased',
    x: point.x,
    y: point.y,
    button: 'left',
    clickCount: 1
  });
  return true;
}

async function setSearch(value) {
  await evaluate(`(() => {
    const input = document.querySelector('#search-input');
    if (!input) return false;
    input.focus();
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, ${JSON.stringify(value)});
    input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));
    return true;
  })()`);
}

async function setSort(value) {
  await evaluate(`(() => {
    const select = document.querySelector('#discovery-sort');
    if (!select) return false;
    select.focus();
    select.value = ${JSON.stringify(value)};
    select.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  })()`);
}

async function dispatchKey(key, code, keyCode) {
  const params = {
    key,
    code,
    windowsVirtualKeyCode: keyCode,
    nativeVirtualKeyCode: keyCode
  };
  await client.send('Input.dispatchKeyEvent', { type: 'keyDown', ...params });
  await client.send('Input.dispatchKeyEvent', { type: 'keyUp', ...params });
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
  await waitFor(`window.innerWidth === ${width}`, `${width}px viewport`);
  await sleep(100);
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
  client.on('Log.entryAdded', params => {
    const entry = params.entry || {};
    if (entry.level === 'warning') runtimeSignals.consoleWarnings.push(entry.text || 'warning');
    if (entry.level === 'error') runtimeSignals.consoleErrors.push(entry.text || 'error');
  });
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

async function readResultIds() {
  return evaluate(`[...document.querySelectorAll('[data-result-id]')].map(element => element.dataset.resultId)`);
}

async function waitForIds(ids, label, { ordered = true } = {}) {
  const expected = ordered ? [...ids] : [...ids].sort();
  const deadline = Date.now() + 10_000;
  let actual = [];
  while (Date.now() < deadline) {
    actual = await readResultIds();
    const normalized = ordered ? [...actual] : [...actual].sort();
    if (JSON.stringify(normalized) === JSON.stringify(expected)) return;
    await sleep(80);
  }
  throw new Error(
    `${label} 대기 시간 초과\n기대: ${JSON.stringify(expected)}\n실제: ${JSON.stringify(actual)}`
  );
}

async function collectPagedResultIds() {
  const collected = [];
  while (true) {
    collected.push(...await readResultIds());
    const canNext = await evaluate(
      `Boolean(document.querySelector('[data-gallery-page="next"]:not(:disabled)'))`
    );
    if (!canNext) break;
    await clickSelector('[data-gallery-page="next"]');
    await waitFor(
      `document.activeElement?.classList.contains('gallery-page-status')`,
      'gallery 다음 페이지'
    );
  }
  return collected;
}

async function clickView(mode) {
  const selector = `.view-mode-btn[data-mode="${mode}"]`;
  check(await clickSelector(selector), `${mode} 보기 버튼 누락`);
  await waitFor(
    `document.querySelector(${JSON.stringify(selector)})?.getAttribute('aria-pressed') === 'true'`,
    `${mode} 보기 활성화`
  );
}

async function openDetails(selector) {
  const isOpen = await evaluate(`Boolean(document.querySelector(${JSON.stringify(selector)})?.open)`);
  if (!isOpen) {
    check(await clickSelector(`${selector} > summary`), `${selector} summary 누락`);
    await waitFor(`Boolean(document.querySelector(${JSON.stringify(selector)})?.open)`, `${selector} 열기`);
  }
}

async function verifyInitialContracts() {
  await waitForIds(expectedIds(), '초기 actual 120 첫 페이지', { ordered: false });
  const contracts = await evaluate(`(() => {
    const status = document.querySelector('.discovery-result-status');
    const search = document.querySelector('#search-input');
    const facetInputs = [...document.querySelectorAll('[data-facet-id]')];
    return {
      resultCount: document.querySelectorAll('[data-result-id]').length,
      uniqueCount: new Set([...document.querySelectorAll('[data-result-id]')].map(node => node.dataset.resultId)).size,
      totalCount: Number(document.querySelector('.gallery-wrapper')?.dataset.resultCount || 0),
      pagination: Boolean(document.querySelector('.gallery-pagination')),
      facetGroups: document.querySelectorAll('[data-facet-group]').length,
      facetInputs: facetInputs.length,
      unlabeledInputs: facetInputs.filter(input => input.labels.length === 0).length,
      liveRole: status?.getAttribute('role') || null,
      livePoliteness: status?.getAttribute('aria-live') || null,
      liveAtomic: status?.getAttribute('aria-atomic') || null,
      statusText: status?.textContent.trim() || '',
      searchType: search?.type || null,
      searchMaxLength: search?.maxLength || null,
      searchLabel: search?.getAttribute('aria-label') || null,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    };
  })()`);
  report.contracts = contracts;
  check(contracts.resultCount === 36 && contracts.uniqueCount === 36, '초기 페이지 상한 36 계약 실패');
  check(contracts.totalCount === 120 && contracts.pagination, 'actual 120 총량 또는 pagination 계약 실패');
  check(contracts.facetGroups === 10, `facet group ${contracts.facetGroups}/10`);
  check(contracts.facetInputs > 10 && contracts.unlabeledInputs === 0, 'facet input label 계약 실패');
  check(contracts.liveRole === 'status' && contracts.livePoliteness === 'polite' && contracts.liveAtomic === 'true', 'live status ARIA 계약 실패');
  check(contracts.statusText.includes('120종'), '초기 결과 상태에 120종이 없음');
  check(contracts.searchType === 'search' && contracts.searchMaxLength === 120 && Boolean(contracts.searchLabel), '검색 input 계약 실패');
  check(contracts.overflow <= 1, `초기 가로 overflow ${contracts.overflow}px`);

  for (const mode of VIEW_MODES) {
    await clickView(mode);
    await waitForIds(expectedIds(), `${mode} actual 120 첫 페이지`, { ordered: mode === 'BENTO' });
    const result = await evaluate(`(() => ({
      mode: ${JSON.stringify(mode)},
      count: document.querySelectorAll('[data-result-id]').length,
      unique: new Set([...document.querySelectorAll('[data-result-id]')].map(node => node.dataset.resultId)).size,
      eraGroups: [...document.querySelectorAll('[data-era-id]')].map(node => node.dataset.eraId),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    }))()`);
    const reachableIds = await collectPagedResultIds();
    result.reachableCount = reachableIds.length;
    result.reachableUnique = new Set(reachableIds).size;
    report.galleryModes.push(result);
    check(result.count === 36 && result.unique === 36, `${mode} 첫 페이지 상한 36 계약 실패`);
    check(result.reachableCount === 120 && result.reachableUnique === 120, `${mode} actual 120 전체 도달 실패`);
    check(result.overflow <= 1, `${mode} 가로 overflow ${result.overflow}px`);
    if (mode === 'SPECTRUM') {
      const visibleStyles = queryCatalogForDiscoveryState(CORE_STYLES).slice(0, 36);
      const expectedGroups = groupStylesByEra(visibleStyles).map(group => group.id);
      check(JSON.stringify(result.eraGroups) === JSON.stringify(expectedGroups), 'Spectrum 시대 그룹 순서 불일치');
    }
  }
}

async function verifySearchAndCombinedFilters() {
  await clickView('GRID');
  await setSearch('darkmode-highcontrast');
  const aliasIds = expectedIds({ searchQuery: 'darkmode-highcontrast' });
  await waitForIds(aliasIds, 'alias 검색', { ordered: false });
  const aliasScenario = await evaluate(`(() => ({
    name: 'alias-search',
    ids: [...document.querySelectorAll('[data-result-id]')].map(node => node.dataset.resultId),
    query: new URLSearchParams(location.search).get('q'),
    status: document.querySelector('.discovery-result-status')?.textContent.trim() || ''
  }))()`);
  report.scenarios.push(aliasScenario);
  check(JSON.stringify(aliasScenario.ids) === JSON.stringify(aliasIds), 'alias 검색 결과 불일치');
  check(aliasScenario.query === 'darkmode-highcontrast', 'alias 검색 URL 복원값 불일치');

  check(await clickSelector('#btn-search-clear'), '검색 초기화 버튼 누락');
  await waitForIds(expectedIds(), '검색 초기화', { ordered: false });

  for (const id of ['glassmorphism', 'liquid-glass']) {
    check(await clickSelector(`.badge-bookmark-btn[data-sub-id="${id}"]`), `${id} 북마크 버튼 누락`);
    await waitFor(
      `document.querySelector('.badge-bookmark-btn[data-sub-id="${id}"]')?.classList.contains('bookmarked')`,
      `${id} 북마크 저장`
    );
  }
  check(await clickSelector('[data-filter="depth"]'), 'depth category 누락');
  check(await clickSelector('#btn-toggle-bookmark-filter'), '북마크 filter 누락');
  await openDetails('.discovery-filter-panel');
  await openDetails('[data-facet-group="materiality"]');
  check(await clickSelector('#facet-materiality-glass'), 'materiality:glass 누락');

  const combinedState = {
    activeFilter: 'depth',
    activeFacets: { materiality: ['glass'] },
    bookmarkFilterActive: true,
    bookmarks: ['glassmorphism', 'liquid-glass']
  };
  const combinedIds = expectedIds(combinedState);
  await waitForIds(combinedIds, 'category+bookmark+facet', { ordered: false });
  const combinedScenario = await evaluate(`(() => ({
    name: 'category-bookmark-facet',
    ids: [...document.querySelectorAll('[data-result-id]')].map(node => node.dataset.resultId),
    categoryActive: document.querySelector('[data-filter="depth"]')?.getAttribute('aria-pressed'),
    bookmarkActive: document.querySelector('#btn-toggle-bookmark-filter')?.getAttribute('aria-pressed'),
    panelOpen: document.querySelector('.discovery-filter-panel')?.open || false,
    facetOpen: document.querySelector('[data-facet-group="materiality"]')?.open || false,
    checked: document.querySelector('#facet-materiality-glass')?.checked || false,
    focusedId: document.activeElement?.id || null,
    params: [...new URLSearchParams(location.search).entries()]
  }))()`);
  report.scenarios.push(combinedScenario);
  check(JSON.stringify(combinedScenario.ids) === JSON.stringify(combinedIds), 'category+bookmark+facet 결과 불일치');
  check(combinedScenario.categoryActive === 'true' && combinedScenario.bookmarkActive === 'true', 'category와 bookmark 독립 활성 상태 실패');
  check(combinedScenario.panelOpen && combinedScenario.facetOpen && combinedScenario.checked, 'filter disclosure 상태 유지 실패');
  check(combinedScenario.focusedId === 'facet-materiality-glass', `facet focus 복원 실패: ${combinedScenario.focusedId}`);

  check(await clickSelector('#discovery-reset'), 'discovery reset 누락');
  await waitForIds(expectedIds(), '조합 조건 초기화', { ordered: false });

  await openDetails('.discovery-filter-panel');
  await openDetails('[data-facet-group="materiality"]');
  await openDetails('[data-facet-group="tone"]');
  for (const selector of ['#facet-materiality-glass', '#facet-tone-playful', '#facet-tone-futuristic']) {
    check(await clickSelector(selector), `${selector} 누락`);
  }
  const multiState = {
    activeFacets: {
      materiality: ['glass'],
      tone: ['playful', 'futuristic']
    }
  };
  const multiIds = expectedIds(multiState);
  await waitForIds(multiIds, 'facet OR/AND', { ordered: false });
  const multiScenario = await evaluate(`(() => ({
    name: 'facet-or-and',
    ids: [...document.querySelectorAll('[data-result-id]')].map(node => node.dataset.resultId),
    selected: ['materiality-glass', 'tone-playful', 'tone-futuristic'].filter(id => document.querySelector('#facet-' + id)?.checked),
    facets: new URLSearchParams(location.search).getAll('f')
  }))()`);
  report.scenarios.push(multiScenario);
  check(new Set(multiScenario.ids).size === multiIds.length && multiIds.every(id => multiScenario.ids.includes(id)), 'facet OR/AND 결과 불일치');
  check(multiScenario.selected.length === 3, 'facet OR/AND 선택 상태 불일치');
}

async function verifySortUrlAndHistory(pageUrl) {
  check(await clickSelector('#discovery-reset'), '정렬 전 reset 누락');
  await waitForIds(expectedIds(), '정렬 전 초기화', { ordered: false });
  await setSort('name-asc');
  await clickView('BENTO');
  const nameIds = expectedIds({ sortMode: 'name-asc' });
  await waitForIds(nameIds, 'Bento name sort');
  report.scenarios.push({
    name: 'bento-name-sort',
    ids: await readResultIds()
  });

  await setSort('era-desc');
  await clickView('SPECTRUM');
  const eraState = { sortMode: 'era-desc' };
  const eraIds = expectedIds(eraState);
  await waitForIds(eraIds, 'Spectrum era-desc');
  const eraScenario = await evaluate(`(() => ({
    name: 'spectrum-era-desc',
    ids: [...document.querySelectorAll('[data-result-id]')].map(node => node.dataset.resultId),
    groups: [...document.querySelectorAll('[data-era-id]')].map(node => node.dataset.eraId),
    sort: document.querySelector('#discovery-sort')?.value || null
  }))()`);
  report.scenarios.push(eraScenario);
  const expectedGroups = groupStylesByEra(
    queryCatalogForDiscoveryState(CORE_STYLES, eraState).slice(0, 36),
    { direction: 'desc' }
  ).map(group => group.id);
  check(JSON.stringify(eraScenario.groups) === JSON.stringify(expectedGroups), 'Spectrum era-desc group 순서 불일치');

  const reloadUrl = `${pageUrl}?q=glass&category=depth&f=materiality%3Aglass&sort=name-asc&view=bento`;
  await navigate(reloadUrl);
  const reloadState = {
    searchQuery: 'glass',
    activeFilter: 'depth',
    activeFacets: { materiality: ['glass'] },
    sortMode: 'name-asc',
    viewMode: 'BENTO'
  };
  const reloadIds = expectedIds(reloadState);
  await waitForIds(reloadIds, 'URL reload');
  const reloadScenario = await evaluate(`(() => ({
    name: 'url-reload',
    ids: [...document.querySelectorAll('[data-result-id]')].map(node => node.dataset.resultId),
    search: document.querySelector('#search-input')?.value || null,
    categoryActive: document.querySelector('[data-filter="depth"]')?.getAttribute('aria-pressed'),
    facetChecked: document.querySelector('#facet-materiality-glass')?.checked || false,
    sort: document.querySelector('#discovery-sort')?.value || null,
    view: document.querySelector('[data-mode="BENTO"]')?.getAttribute('aria-pressed')
  }))()`);
  report.scenarios.push(reloadScenario);
  check(reloadScenario.search === 'glass' && reloadScenario.categoryActive === 'true' && reloadScenario.facetChecked, 'URL reload condition 복원 실패');
  check(reloadScenario.sort === 'name-asc' && reloadScenario.view === 'true', 'URL reload sort/view 복원 실패');

  await evaluate(`(() => {
    history.pushState({ step: 'bauhaus' }, '', '?q=bauhaus&f=era%3Apre-1950&view=spectrum');
    history.pushState({ step: 'liquid' }, '', '?q=liquid&view=grid');
    history.back();
    return true;
  })()`);
  const popState = {
    searchQuery: 'bauhaus',
    activeFacets: { era: ['pre-1950'] },
    viewMode: 'SPECTRUM'
  };
  const popIds = expectedIds(popState);
  await waitForIds(popIds, 'native popstate');
  const popScenario = await evaluate(`(() => ({
    name: 'popstate',
    ids: [...document.querySelectorAll('[data-result-id]')].map(node => node.dataset.resultId),
    search: document.querySelector('#search-input')?.value || null,
    facetChecked: document.querySelector('#facet-era-pre-1950')?.checked || false,
    view: document.querySelector('[data-mode="SPECTRUM"]')?.getAttribute('aria-pressed'),
    url: location.href
  }))()`);
  report.scenarios.push(popScenario);
  check(popScenario.search === 'bauhaus' && popScenario.facetChecked && popScenario.view === 'true', 'popstate 상태 복원 실패');

  await setSearch('no-such-design-zzzz');
  await waitFor(`Boolean(document.querySelector('#btn-empty-reset'))`, 'empty state');
  const emptyScenario = await evaluate(`(() => ({
    name: 'empty-reset',
    title: document.querySelector('.empty-title')?.textContent.trim() || '',
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
  }))()`);
  check(await clickSelector('#btn-empty-reset'), 'empty reset 누락');
  await waitForIds(expectedIds(), 'empty reset 결과', { ordered: false });
  emptyScenario.focusedId = await evaluate('document.activeElement?.id || null');
  report.scenarios.push(emptyScenario);
  check(emptyScenario.focusedId === 'search-input', `empty reset focus 실패: ${emptyScenario.focusedId}`);
}

async function verifyKeyboardNavigation() {
  await clickView('BENTO');
  await evaluate("document.activeElement?.blur(); document.body.focus() ");
  await dispatchKey('/', 'Slash', 191);
  await waitFor("document.activeElement?.id === 'search-input'", '/ 검색 focus');
  const slashState = await evaluate(`(() => ({
    focusedId: document.activeElement?.id || null,
    searchValue: document.querySelector('#search-input')?.value || ''
  }))()`);

  const [firstId, secondId] = expectedIds();
  await evaluate(`document.querySelector('.bento-item-card[data-sub-id="${firstId}"]')?.focus()`);
  await waitFor(
    `document.activeElement?.dataset.subId === ${JSON.stringify(firstId)}`,
    '첫 Bento tile focus'
  );
  await dispatchKey('ArrowRight', 'ArrowRight', 39);
  await waitFor(
    `document.activeElement?.dataset.subId === ${JSON.stringify(secondId)}`,
    'ArrowRight 다음 tile focus'
  );

  await dispatchKey(' ', 'Space', 32);
  check(await clickSelector('#btn-open-compare-modal'), '키보드 비교 검증용 버튼 누락');
  await waitFor('document.querySelectorAll(".split-viewport").length === 2', 'Space 비교 슬롯');
  const splitThemes = await evaluate(
    `[...document.querySelectorAll('.split-viewport')].map(view => view.dataset.theme)`
  );
  check(splitThemes.includes(secondId), `Space 비교 슬롯에 ${secondId}가 없음`);
  check(await clickSelector('#btn-compare-close'), '비교 닫기 버튼 누락');
  await waitFor(
    `Boolean(document.querySelector('.bento-item-card[data-sub-id="${secondId}"]'))`,
    '비교에서 Bento 복귀'
  );

  await evaluate(`document.querySelector('.bento-item-card[data-sub-id="${secondId}"]')?.focus()`);
  await dispatchKey('Enter', 'Enter', 13);
  await waitFor(
    `document.querySelector('#mockup-viewport')?.dataset.theme === ${JSON.stringify(secondId)}`,
    'Enter detail 열기'
  );
  const enterTheme = await evaluate("document.querySelector('#mockup-viewport')?.dataset.theme || null");
  check(await clickSelector('#btn-modal-close'), 'detail 닫기 버튼 누락');
  await waitFor(
    `Boolean(document.querySelector('.bento-item-card[data-sub-id="${secondId}"]'))`,
    'detail에서 Bento 복귀'
  );

  report.scenarios.push({
    name: 'keyboard-navigation',
    slashFocus: slashState.focusedId,
    slashInsertedText: slashState.searchValue,
    arrowFrom: firstId,
    arrowTo: secondId,
    spaceCompareThemes: splitThemes,
    enterTheme
  });
  check(slashState.searchValue === '', '/ shortcut가 검색어로 입력됨');
  check(enterTheme === secondId, 'Enter detail theme 불일치');
}

async function verifyResponsiveAndMotion() {
  await openDetails('.discovery-filter-panel');

  for (const width of RESPONSIVE_WIDTHS) {
    await setViewport(width, width <= 414 ? 1_000 : 1_100);
    const result = await evaluate(`(() => {
      const root = document.documentElement;
      const discovery = document.querySelector('.discovery-controls');
      const targets = [...discovery.querySelectorAll(
        '.discovery-filter-panel > summary, .facet-group > summary, .facet-group[open] .facet-option, select, button:not(:disabled)'
      )].filter(element => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden';
      });
      const tooSmall = targets
        .map(element => ({
          label: element.id || element.textContent.trim().slice(0, 30),
          height: Math.round(element.getBoundingClientRect().height)
        }))
        .filter(target => target.height < 44);
      const inputs = [...discovery.querySelectorAll('[data-facet-id]')];
      return {
        width: innerWidth,
        resultCount: document.querySelectorAll('[data-result-id]').length,
        facetGroups: document.querySelectorAll('[data-facet-group]').length,
        labeledInputs: inputs.filter(input => input.labels.length > 0).length,
        inputCount: inputs.length,
        targetCount: targets.length,
        tooSmall,
        overflow: root.scrollWidth - root.clientWidth,
        discoveryWidth: Math.round(discovery.getBoundingClientRect().width),
        viewportWidth: root.clientWidth
      };
    })()`);
    report.responsiveWidths.push(result);
    check(result.resultCount === 36, `${width}px 결과 ${result.resultCount}/36`);
    check(result.facetGroups === 10 && result.labeledInputs === result.inputCount, `${width}px facet label 실패`);
    check(result.targetCount > 0 && result.tooSmall.length === 0, `${width}px 44px 미만 target: ${JSON.stringify(result.tooSmall)}`);
    check(result.overflow <= 1, `${width}px 가로 overflow ${result.overflow}px`);
    check(result.discoveryWidth <= result.viewportWidth, `${width}px discovery 폭 초과`);
    if (width === 320) {
      await evaluate("document.querySelector('.discovery-controls')?.scrollIntoView({ block: 'start' })");
      await sleep(80);
      await captureScreenshot('discovery-mobile-320');
    }
    if (width === 1440) await captureScreenshot('discovery-desktop-1440');
  }

  await client.send('Emulation.setEmulatedMedia', {
    media: '',
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
  });
  await sleep(100);
  report.reducedMotion = await evaluate(`(() => {
    const control = document.querySelector('.discovery-active-chip, .facet-option');
    const style = control ? getComputedStyle(control) : null;
    return {
      matches: matchMedia('(prefers-reduced-motion: reduce)').matches,
      transitionDuration: style?.transitionDuration || null,
      animationDuration: style?.animationDuration || null,
      animationDurationSeconds: style ? parseFloat(style.animationDuration) : null
    };
  })()`);
  check(report.reducedMotion.matches, 'reduced-motion media query 불일치');
  check(report.reducedMotion.animationDurationSeconds <= 0.001, `reduced-motion animation ${report.reducedMotion.animationDuration}`);
  await client.send('Emulation.setEmulatedMedia', { media: '', features: [] });
}

function finalizeReport() {
  check(runtimeSignals.consoleWarnings.length === 0, `console warning ${runtimeSignals.consoleWarnings.length}개`);
  check(runtimeSignals.consoleErrors.length === 0, `console error ${runtimeSignals.consoleErrors.length}개`);
  check(runtimeSignals.exceptions.length === 0, `page exception ${runtimeSignals.exceptions.length}개`);
  check(runtimeSignals.networkFailures.length === 0, `network failure ${runtimeSignals.networkFailures.length}개`);
  check(runtimeSignals.httpErrors.length === 0, `HTTP error ${runtimeSignals.httpErrors.length}개`);
  const diagnosticCount = Object.values(runtimeSignals)
    .reduce((total, entries) => total + entries.length, 0);
  report.summary = {
    galleryModes: report.galleryModes.length,
    scenarios: report.scenarios.length,
    responsiveWidths: report.responsiveWidths.length,
    screenshots: report.screenshots.length,
    diagnosticCount,
    issueCount: issues.length
  };
}

async function main() {
  const chromeVersion = spawnSync(CHROME_PATH, ['--version'], { encoding: 'utf8' });
  if (chromeVersion.status !== 0) {
    throw new Error(`Chrome 실행 파일을 찾을 수 없음: ${CHROME_PATH}`);
  }
  report.chromeVersion = chromeVersion.stdout.trim();
  mkdirSync(artifactDirectory, { recursive: true });

  const vitePort = await getFreePort();
  const chromePort = await getFreePort();
  const pageUrl = `http://127.0.0.1:${vitePort}/`;
  viteProcess = spawn(
    process.execPath,
    ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(vitePort), '--strictPort'],
    { cwd: PROJECT_ROOT, stdio: ['ignore', 'ignore', 'ignore'] }
  );
  await waitForHttp(pageUrl, 'Vite');

  profileDirectory = mkdtempSync(join(tmpdir(), 'dss-discovery-chrome-profile-'));
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
    client.send('Network.enable'),
    client.send('Log.enable')
  ]);
  await navigate(pageUrl);

  await verifyInitialContracts();
  await verifySearchAndCombinedFilters();
  await verifySortUrlAndHistory(pageUrl);
  await verifyKeyboardNavigation();
  await verifyResponsiveAndMotion();
  finalizeReport();

  writeFileSync(
    join(artifactDirectory, 'report.json'),
    `${JSON.stringify(report, null, 2)}\n`,
    'utf8'
  );
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (issues.length > 0) process.exitCode = 1;
}

try {
  await main();
} catch (error) {
  report.fatal = error.stack || error.message;
  mkdirSync(artifactDirectory, { recursive: true });
  writeFileSync(
    join(artifactDirectory, 'report.json'),
    `${JSON.stringify(report, null, 2)}\n`,
    'utf8'
  );
  process.stderr.write(`${JSON.stringify(report, null, 2)}\n`);
  process.exitCode = 2;
} finally {
  client?.close();
  await stopProcess(chromeProcess);
  await stopProcess(viteProcess);
  if (profileDirectory) rmSync(profileDirectory, { recursive: true, force: true });
}
