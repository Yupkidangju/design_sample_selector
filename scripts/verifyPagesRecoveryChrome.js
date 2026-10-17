#!/usr/bin/env node

import { spawn, spawnSync } from 'node:child_process';
import {
  createReadStream,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync
} from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { basename, extname, isAbsolute, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { verifyPagesArtifact } from './verifyPagesArtifact.js';
import { PROJECT_BASE } from '../project.config.js';

const PROJECT_ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST_DIRECTORY = join(PROJECT_ROOT, 'dist');
const CHROME_PATH = process.env.DSS_CHROME_PATH || '/usr/bin/google-chrome';
const artifactOption = process.argv.find(argument => argument.startsWith('--artifacts='));
const artifactValue = artifactOption?.slice('--artifacts='.length);
const artifactDirectory = artifactValue
  ? (isAbsolute(artifactValue) ? artifactValue : resolve(artifactValue))
  : join(PROJECT_ROOT, '.antigravity', 'archive', 'audit10-pages-recovery');

const MIME_TYPES = Object.freeze({
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2'
});

const report = {
  checkedAt: new Date().toISOString(),
  chromeVersion: null,
  base: PROJECT_BASE,
  isolatedProfile: true,
  artifact: null,
  urlContract: null,
  normal: null,
  networkFaults: [],
  consumerFaults: [],
  responses: [],
  issues: []
};

let staticServer;
let chromeProcess;
let profileDirectory;
let client;
let currentFault = null;

function sleep(milliseconds) {
  return new Promise(resolveSleep => setTimeout(resolveSleep, milliseconds));
}

function check(condition, message) {
  if (!condition) report.issues.push(message);
}

function getFreePort() {
  return new Promise((resolvePort, reject) => {
    const server = createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      server.close(error => error ? reject(error) : resolvePort(address.port));
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
      lastError = new Error(`HTTP ${response.status}`);
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

function startArtifactServer(port) {
  staticServer = createServer((request, response) => {
    const requestUrl = new URL(request.url, `http://${request.headers.host}`);
    if (!requestUrl.pathname.startsWith(PROJECT_BASE)) {
      response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      response.end('Not Found');
      return;
    }
    const relativePath = requestUrl.pathname.slice(PROJECT_BASE.length) || 'index.html';
    const normalizedPath = normalize(relativePath).replace(/^(\.\.(?:\/|\\|$))+/, '');
    const filePath = resolve(DIST_DIRECTORY, normalizedPath);
    if (!filePath.startsWith(`${resolve(DIST_DIRECTORY)}/`)) {
      response.writeHead(404).end();
      return;
    }
    try {
      if (!statSync(filePath).isFile()) throw new Error('not-file');
      response.writeHead(200, {
        'cache-control': 'no-store',
        'content-type': MIME_TYPES[extname(filePath)] || 'application/octet-stream',
        'x-dss-release': JSON.parse(readFileSync(join(DIST_DIRECTORY, 'release-manifest.json'), 'utf8')).releaseSha
      });
      createReadStream(filePath).pipe(response);
    } catch {
      response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      response.end('Not Found');
    }
  });
  return new Promise((resolveListen, reject) => {
    staticServer.once('error', reject);
    staticServer.listen(port, '127.0.0.1', resolveListen);
  });
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
      this.socket.addEventListener('error', reject, { once: true });
    });
    this.socket.addEventListener('message', event => this.handleMessage(event));
  }

  handleMessage(event) {
    const message = JSON.parse(String(event.data));
    if (message.id) {
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(message.error.message));
      else pending.resolve(message.result);
      return;
    }
    for (const listener of this.listeners.get(message.method) || []) {
      Promise.resolve(listener(message.params)).catch(error => report.issues.push(`CDP listener: ${error.message}`));
    }
  }

  on(method, listener) {
    const listeners = this.listeners.get(method) || [];
    listeners.push(listener);
    this.listeners.set(method, listeners);
  }

  send(method, params = {}) {
    const id = this.nextId++;
    const promise = new Promise((resolveCommand, reject) => {
      this.pending.set(id, { resolve: resolveCommand, reject });
    });
    this.socket.send(JSON.stringify({ id, method, params }));
    return promise;
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
    throw new Error(result.exceptionDetails.exception?.description || '브라우저 평가 실패');
  }
  return result.result?.value;
}

async function waitFor(expression, label, timeout = 12_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await evaluate(`Boolean(${expression})`)) return;
    await sleep(50);
  }
  throw new Error(`${label} 시간 초과`);
}

async function navigate(baseUrl, query = '') {
  await client.send('Page.navigate', { url: `${baseUrl}${query}` });
  await waitFor(
    `document.body?.hasAttribute('data-app-pending') === false && document.querySelector('#main-root [data-sub-id]')`,
    'Pages-like app 초기화'
  );
}

async function pressEnter() {
  await client.send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await client.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
}

async function openPeek() {
  await evaluate(`(() => {
    const tile = document.querySelector('#main-root [data-sub-id]');
    tile?.focus();
    tile?.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
  })()`);
  await waitFor(`document.querySelector('#peek-viewport')`, 'Peek 생성');
}

async function setNetworkFault(file, failures = 1) {
  currentFault = { file: basename(file), failures, intercepted: 0 };
  await client.send('Fetch.enable', {
    patterns: [{ urlPattern: `*${basename(file)}*`, requestStage: 'Request' }]
  });
}

async function clearNetworkFault() {
  await client.send('Fetch.disable');
  currentFault = null;
}

async function runPeekNetworkFault(baseUrl, name, file, expected) {
  await navigate(baseUrl, `?qa=${encodeURIComponent(name)}-${Date.now()}`);
  await setNetworkFault(file);
  await openPeek();
  await waitFor(`document.querySelector('[data-peek-preview-retry]')`, `${name} 1차 error`);
  const intercepted = currentFault.intercepted;
  await clearNetworkFault();
  await evaluate(`document.querySelector('[data-peek-preview-retry]')?.click()`);
  if (expected === 'success') {
    await waitFor(`document.querySelector('#peek-viewport .mockup-unit')`, `${name} retry success`);
  } else {
    await waitFor(`document.querySelector('[data-peek-preview-reload]')`, `${name} terminal`);
  }
  const result = await evaluate(`(() => ({
    outcome: document.querySelector('[data-peek-preview-reload]') ? 'terminal' : 'success',
    diagnostics: window.__dssQaDiagnostics || []
  }))()`);
  result.name = name;
  result.file = file;
  result.intercepted = intercepted;
  report.networkFaults.push(result);
  check(intercepted === 1, `${name}: fault interception ${intercepted}/1`);
  check(result.outcome === expected, `${name}: ${result.outcome}/${expected}`);
}

async function runDetailNetworkFault(baseUrl, name, file, expected) {
  await navigate(baseUrl, `?qa=${encodeURIComponent(name)}-${Date.now()}`);
  await setNetworkFault(file);
  await evaluate(`document.querySelector('#main-root [data-sub-id]')?.dispatchEvent(
    new MouseEvent('dblclick', { bubbles: true, cancelable: true })
  )`);
  await waitFor(`document.querySelector('[data-lazy-detail-retry]')`, `${name} Detail 1차 error`);
  const intercepted = currentFault.intercepted;
  await clearNetworkFault();
  await evaluate(`document.querySelector('[data-lazy-detail-retry]')?.click()`);
  if (expected === 'success') {
    await waitFor(`document.querySelector('#mockup-viewport')`, `${name} Detail retry success`);
  } else {
    await waitFor(`document.querySelector('[data-lazy-detail-reload]')`, `${name} Detail terminal`);
  }
  const result = await evaluate(`(() => ({
    outcome: document.querySelector('[data-lazy-detail-reload]') ? 'terminal' : 'success',
    diagnostics: window.__dssQaDiagnostics || []
  }))()`);
  result.name = name;
  result.file = file;
  result.intercepted = intercepted;
  report.networkFaults.push(result);
  check(intercepted === 1, `${name}: fault interception ${intercepted}/1`);
  check(result.outcome === expected, `${name}: ${result.outcome}/${expected}`);
}

async function runConsumerFault(baseUrl, name, expected, expectedPhase) {
  await navigate(baseUrl, `?qaFault=${encodeURIComponent(name)}&run=${Date.now()}`);
  await openPeek();
  await waitFor(`document.querySelector('[data-peek-preview-retry]')`, `${name} consumer error`);
  await evaluate(`document.querySelector('[data-peek-preview-retry]')?.click()`);
  if (expected === 'success') {
    await waitFor(`document.querySelector('#peek-viewport .mockup-unit')`, `${name} recovery`);
  } else {
    await waitFor(`document.querySelector('[data-peek-preview-reload]')`, `${name} terminal`);
  }
  const result = await evaluate(`(() => ({
    outcome: document.querySelector('[data-peek-preview-reload]') ? 'terminal' : 'success',
    diagnostics: window.__dssQaDiagnostics || []
  }))()`);
  result.name = name;
  report.consumerFaults.push(result);
  check(result.outcome === expected, `${name}: ${result.outcome}/${expected}`);
  check(result.diagnostics.some(item => item.phase === expectedPhase), `${name}: ${expectedPhase} diagnostic 누락`);
}

async function verifyNormalInteractions(baseUrl) {
  await navigate(baseUrl, `?qa=normal-${Date.now()}`);
  await openPeek();
  await waitFor(`document.querySelector('#peek-viewport .mockup-unit')`, '정상 Peek renderer');
  const peekState = await evaluate(`(() => ({
    nativeButton: document.querySelector('[data-peek-open-detail]')?.tagName === 'BUTTON',
    busy: document.querySelector('#peek-viewport')?.hasAttribute('aria-busy'),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
  }))()`);
  await evaluate(`document.querySelector('[data-peek-open-detail]')?.focus()`);
  await pressEnter();
  await waitFor(`document.querySelector('#mockup-viewport')`, 'Peek native button Enter Detail');

  await navigate(baseUrl, `?qa=peek-dblclick-${Date.now()}`);
  await openPeek();
  await waitFor(`document.querySelector('#peek-viewport .mockup-unit')`, 'Peek dblclick 준비');
  await evaluate(`document.querySelector('.peek-card')?.dispatchEvent(
    new MouseEvent('dblclick', { bubbles: true, cancelable: true })
  )`);
  await waitFor(`document.querySelector('#mockup-viewport')`, 'Peek dblclick Detail');

  await navigate(baseUrl, `?qa=main-enter-${Date.now()}`);
  await evaluate(`document.querySelector('#main-root [data-sub-id]')?.focus()`);
  await pressEnter();
  await waitFor(`document.querySelector('#mockup-viewport')`, 'Main Enter Detail');

  await navigate(baseUrl, `?qa=dock-${Date.now()}`);
  await evaluate(`document.querySelector('#main-root [data-sub-id]')?.click()`);
  await waitFor(`document.querySelector('#dock-confirm')`, 'Dock 선택');
  await evaluate(`document.querySelector('#dock-confirm')?.click()`);
  await waitFor(`document.querySelector('#confirm-preview .mockup-unit')`, 'Confirm preview');
  await evaluate(`document.querySelector('#confirm-open-detail')?.click()`);
  await waitFor(`document.querySelector('#mockup-viewport')`, 'Dock/Confirm Detail');
  await evaluate(`document.querySelector('#btn-modal-compare')?.click()`);
  await waitFor(`document.querySelector('#split-viewport-a .mockup-unit, #split-viewport-a .archetype-unit')`, 'Split renderer');

  const sameOriginResponses = report.responses.filter(item => item.url.startsWith(baseUrl));
  const badAssetResponses = sameOriginResponses.filter(item => (
    (item.type === 'Script' && !item.mimeType.includes('javascript'))
    || (item.type === 'Stylesheet' && item.mimeType !== 'text/css')
    || item.status !== 200
  ));
  report.normal = {
    ...peekState,
    peekButtonEnter: true,
    peekDoubleClick: true,
    mainEnter: true,
    dockConfirmDetail: true,
    split: true,
    sameOriginResponseCount: sameOriginResponses.length,
    badAssetResponses
  };
  check(peekState.nativeButton && !peekState.busy, 'Peek native control/loading state 실패');
  check(peekState.overflow <= 1, `정상 화면 가로 overflow ${peekState.overflow}px`);
  check(badAssetResponses.length === 0, `Pages-like MIME/status 오류 ${badAssetResponses.length}개`);
}

async function main() {
  try {
  mkdirSync(artifactDirectory, { recursive: true });
  const artifact = verifyPagesArtifact({
    distDirectory: DIST_DIRECTORY,
    writeManifest: false,
    requireReleaseManifest: true
  });
  report.artifact = artifact;
  if (!artifact.passed) throw new Error(`Pages artifact 실패: ${artifact.issues.join(' / ')}`);

  const manifest = JSON.parse(readFileSync(join(DIST_DIRECTORY, '.vite', 'manifest.json'), 'utf8'));
  const primaryComponent = manifest['src/preview/componentLazyEntry.js'].file;
  const sharedComponent = Object.entries(manifest)
    .find(([key]) => key.startsWith('_componentEntry'))?.[1]?.file;
  const primaryDetail = manifest['src/components/detailView.js'].file;
  const requiredCssSources = [
    'src/styles/themeTokensExpansion.css',
    'src/styles/expansion-preview.css',
    'src/styles/audit9-detail.css',
    'src/styles/core-preview.css',
    'src/styles/wave1-preview.css',
    'src/styles/preview-refinements.css'
  ];
  const cssEntries = Object.entries(manifest).filter(([key]) => key.startsWith('src/styles/'));
  if (!sharedComponent || cssEntries.length !== requiredCssSources.length
      || requiredCssSources.some(key => !manifest[key]?.file?.endsWith('.css'))) {
    throw new Error('lazy/shared CSS manifest graph를 해석하지 못함');
  }
  const cssFiles = requiredCssSources.map(key => manifest[key].file);

  const serverPort = await getFreePort();
  const chromePort = await getFreePort();
  await startArtifactServer(serverPort);
  const baseUrl = `http://127.0.0.1:${serverPort}${PROJECT_BASE}`;
  await waitForHttp(baseUrl, 'Pages-like artifact server');
  const rootResponse = await fetch(baseUrl);
  const deepResponse = await fetch(`${baseUrl}unsupported/deep/path`);
  report.urlContract = { rootStatus: rootResponse.status, deepPathStatus: deepResponse.status };
  check(rootResponse.status === 200 && deepResponse.status === 404, 'root+query/hash URL 계약 실패');

  const chromeVersion = spawnSync(CHROME_PATH, ['--version'], { encoding: 'utf8' });
  if (chromeVersion.status !== 0) throw new Error(`Chrome 실행 실패: ${CHROME_PATH}`);
  report.chromeVersion = chromeVersion.stdout.trim();
  profileDirectory = mkdtempSync(join(tmpdir(), 'dss-pages-recovery-chrome-'));
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
    '--mute-audio',
    '--no-default-browser-check',
    '--no-first-run',
    '--password-store=basic',
    'about:blank'
  ], { cwd: PROJECT_ROOT, stdio: ['ignore', 'ignore', 'ignore'] });

  const targetResponse = await waitForHttp(`http://127.0.0.1:${chromePort}/json/list`, 'Chrome DevTools');
  const targets = await targetResponse.json();
  const pageTarget = targets.find(target => target.type === 'page');
  if (!pageTarget) throw new Error('Chrome page target 누락');
  client = new CdpClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();
  await Promise.all([
    client.send('Page.enable'),
    client.send('Runtime.enable'),
    client.send('Network.enable')
  ]);
  await client.send('Network.setCacheDisabled', { cacheDisabled: true });
  await client.send('Network.setBypassServiceWorker', { bypass: true });
  client.on('Network.responseReceived', ({ response, type }) => {
    report.responses.push({ url: response.url, status: response.status, mimeType: response.mimeType, type });
  });
  client.on('Fetch.requestPaused', async ({ requestId, request }) => {
    const fault = currentFault;
    if (fault && request.url.includes(fault.file) && fault.intercepted < fault.failures) {
      fault.intercepted += 1;
      await client.send('Fetch.failRequest', { requestId, errorReason: 'BlockedByClient' });
    } else {
      await client.send('Fetch.continueRequest', { requestId });
    }
  });
  await client.send('Page.addScriptToEvaluateOnNewDocument', {
    source: `(() => {
      window.__dssQaDiagnostics = [];
      addEventListener('dss:recovery-diagnostic', event => window.__dssQaDiagnostics.push(event.detail));
      const mode = new URLSearchParams(location.search).get('qaFault');
      if (mode === 'render-once') {
        const descriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
        let failures = 0;
        Object.defineProperty(Element.prototype, 'innerHTML', {
          configurable: descriptor.configurable,
          enumerable: descriptor.enumerable,
          get: descriptor.get,
          set(value) {
            if (this.id === 'peek-viewport' && String(value).includes('mockup-unit') && failures++ < 1) {
              throw new Error('QA_RENDER_FAULT');
            }
            return descriptor.set.call(this, value);
          }
        });
      }
      if (mode === 'hydrate-twice') {
        const original = EventTarget.prototype.addEventListener;
        let failures = 0;
        EventTarget.prototype.addEventListener = function(type, listener, options) {
          if (type === 'click' && this.matches?.('.mockup-unit') && this.closest?.('#peek-viewport') && failures++ < 2) {
            throw new Error('QA_HYDRATE_FAULT');
          }
          return original.call(this, type, listener, options);
        };
      }
    })();`
  });

  await verifyNormalInteractions(baseUrl);
  await runPeekNetworkFault(baseUrl, 'component-primary', primaryComponent, 'success');
  await runPeekNetworkFault(baseUrl, 'component-shared', sharedComponent, 'terminal');
  for (const cssFile of cssFiles) {
    await runPeekNetworkFault(baseUrl, `css-${basename(cssFile)}`, cssFile, 'terminal');
  }
  await runDetailNetworkFault(baseUrl, 'detail-primary', primaryDetail, 'success');
  await runDetailNetworkFault(baseUrl, 'detail-shared', sharedComponent, 'terminal');
  await runConsumerFault(baseUrl, 'render-once', 'success', 'render');
  await runConsumerFault(baseUrl, 'hydrate-twice', 'terminal', 'hydrate');

  const screenshot = await client.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  writeFileSync(join(artifactDirectory, 'terminal-hydrate.png'), screenshot.data, 'base64');
  report.summary = {
    networkFaultCount: report.networkFaults.length,
    consumerFaultCount: report.consumerFaults.length,
    issueCount: report.issues.length,
    passed: report.issues.length === 0
  };
} catch (error) {
  report.issues.push(error.stack || error.message);
  report.summary = {
    networkFaultCount: report.networkFaults.length,
    consumerFaultCount: report.consumerFaults.length,
    issueCount: report.issues.length,
    passed: false
  };
} finally {
  if (currentFault && client) {
    try { await clearNetworkFault(); } catch { /* 종료 중 fault 해제 실패 무시 */ }
  }
  client?.close();
  await stopProcess(chromeProcess);
  if (staticServer) await new Promise(resolveClose => staticServer.close(resolveClose));
  if (profileDirectory) {
    let cleanupError = null;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        rmSync(profileDirectory, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
        cleanupError = null;
        break;
      } catch (error) {
        cleanupError = error;
        await sleep(300);
      }
    }
    if (cleanupError) report.issues.push(`Chrome profile 정리 실패: ${cleanupError.code}`);
  }
  mkdirSync(artifactDirectory, { recursive: true });
  writeFileSync(join(artifactDirectory, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  }
}

await main();

console.log(`Audit 10 Pages/Recovery Chrome: ${report.summary.passed ? 'PASS' : 'FAIL'}`);
console.log(`- network faults: ${report.summary.networkFaultCount}`);
console.log(`- consumer faults: ${report.summary.consumerFaultCount}`);
console.log(`- issues: ${report.summary.issueCount}`);
console.log(`- report: ${join(artifactDirectory, 'report.json')}`);
if (!report.summary.passed) process.exitCode = 1;
