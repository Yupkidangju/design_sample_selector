#!/usr/bin/env node

import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJECT_ROOT = fileURLToPath(new URL('..', import.meta.url));
const CHROME_PATH = process.env.DSS_CHROME_PATH || '/usr/bin/google-chrome';
const LOCALES = Object.freeze(['ko', 'en', 'ja', 'zh-CN', 'zh-TW']);
const NON_KOREAN_FORBIDDEN = /[가-힣]+/g;
const artifactOption = process.argv.find(argument => argument.startsWith('--artifacts='));
const artifactValue = artifactOption?.slice('--artifacts='.length);
const artifactDirectory = artifactValue
  ? (isAbsolute(artifactValue) ? artifactValue : resolve(artifactValue))
  : join(PROJECT_ROOT, '.antigravity', 'archive', 'audit11-i18n-inspector-chrome');

const report = {
  checkedAt: new Date().toISOString(),
  chromeVersion: null,
  isolatedProfile: true,
  locales: [],
  preservation: null,
  runtimeSignals: { warnings: [], errors: [], exceptions: [], networkFailures: [] },
  screenshots: [],
  issues: []
};

let viteProcess;
let chromeProcess;
let profileDirectory;
let client;

const sleep = milliseconds => new Promise(resolveSleep => setTimeout(resolveSleep, milliseconds));
const check = (condition, message) => { if (!condition) report.issues.push(message); };

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
  throw new Error(`${label}: ${lastError?.message || 'timeout'}`);
}

async function stopProcess(processHandle) {
  if (!processHandle || processHandle.exitCode !== null) return;
  processHandle.kill('SIGTERM');
  await Promise.race([new Promise(resolveExit => processHandle.once('exit', resolveExit)), sleep(2_500)]);
  if (processHandle.exitCode === null) processHandle.kill('SIGKILL');
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
      const timer = setTimeout(() => reject(new Error('CDP timeout')), 10_000);
      this.socket.addEventListener('open', () => { clearTimeout(timer); resolveConnection(); }, { once: true });
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
    for (const listener of this.listeners.get(message.method) || []) listener(message.params || {});
  }

  on(method, listener) {
    const listeners = this.listeners.get(method) || [];
    listeners.push(listener);
    this.listeners.set(method, listeners);
  }

  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolveResult, reject) => {
      this.pending.set(id, { resolve: resolveResult, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  close() { this.socket?.close(); }
}

async function evaluate(expression) {
  const response = await client.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text);
  return response.result?.value;
}

async function waitFor(expression, label, timeout = 15_000) {
  const deadline = Date.now() + timeout;
  let value;
  while (Date.now() < deadline) {
    value = await evaluate(expression);
    if (value) return value;
    await sleep(80);
  }
  throw new Error(`${label}: ${JSON.stringify(value)}`);
}

async function navigate(url) {
  await client.send('Page.navigate', { url });
  await waitFor(`document.readyState === 'complete' && document.body?.hasAttribute('data-app-pending') === false && Boolean(document.querySelector('#locale-select'))`, `load ${url}`);
}

async function clickSelector(selector, clickCount = 1) {
  const point = await evaluate(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!element) return null;
    element.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' });
    const rect = element.getBoundingClientRect();
    return rect.width && rect.height ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : null;
  })()`);
  if (!point) return false;
  await client.send('Input.dispatchMouseEvent', { type: 'mousePressed', ...point, button: 'left', clickCount });
  await client.send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...point, button: 'left', clickCount });
  return true;
}

async function openDetail() {
  const selector = '[data-result-id="swiss-grid"]';
  const opened = await evaluate(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!element) return false;
    element.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, cancelable: true, view: window }));
    return true;
  })()`);
  check(opened, 'swiss-grid card missing');
  await waitFor(`Boolean(document.querySelector('#mockup-viewport')) && Boolean(document.querySelector('#live-css-code')?.textContent)`, 'detail inspector');
}

async function capture(name) {
  const image = await client.send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false });
  const filename = `${name}.png`;
  writeFileSync(join(artifactDirectory, filename), Buffer.from(image.data, 'base64'));
  report.screenshots.push(filename);
}

function bindDiagnostics() {
  client.on('Runtime.consoleAPICalled', params => {
    const message = (params.args || []).map(argument => argument.value ?? argument.description ?? '').join(' ');
    if (params.type === 'warning') report.runtimeSignals.warnings.push(message);
    if (params.type === 'error' || params.type === 'assert') report.runtimeSignals.errors.push(message);
  });
  client.on('Runtime.exceptionThrown', params => report.runtimeSignals.exceptions.push(params.exceptionDetails?.text || 'exception'));
  client.on('Network.loadingFailed', params => {
    if (!params.canceled && params.errorText !== 'net::ERR_ABORTED') report.runtimeSignals.networkFailures.push(params.errorText);
  });
}

async function inspectLocale(pageUrl, locale) {
  await navigate(`${pageUrl}?lang=${encodeURIComponent(locale)}`);
  await openDetail();
  check(await clickSelector('[data-action="game-boost"]'), `${locale}: runtime action missing`);
  const runtimeStatus = await waitFor(`document.querySelector('.mock-live-toast.show')?.textContent`, `${locale}: localized runtime status`);
  const paneSelectors = { css: '#live-css-code', html: '#live-html-code', md: '#live-md-code', json: '#live-json-code' };
  const panes = {};
  for (const [tab, selector] of Object.entries(paneSelectors)) {
    check(await clickSelector(`[data-insp-tab="${tab}"]`), `${locale}:${tab} tab missing`);
    await waitFor(`document.querySelector(${JSON.stringify(selector)})?.textContent.length > 20`, `${locale}:${tab} content`);
    panes[tab] = await evaluate(`document.querySelector(${JSON.stringify(selector)}).textContent`);
  }
  const dom = await evaluate(`(() => {
    const visibleText = document.body.innerText;
    const accessible = [...document.querySelectorAll('[aria-label], [title], [placeholder]')]
      .flatMap(element => ['aria-label', 'title', 'placeholder'].map(name => element.getAttribute(name)).filter(Boolean))
      .join(String.fromCharCode(10));
    const json = JSON.parse(document.querySelector('#live-json-code').textContent);
    return {
      lang: document.documentElement.lang,
      selectedLocale: document.querySelector('#locale-select').value,
      visibleText,
      accessible,
      inspectorTabs: [...document.querySelectorAll('.inspector-tab-btn')].map(button => ({ id: button.dataset.inspTab, selected: button.getAttribute('aria-selected') })),
      cssKeys: [...document.querySelector('#live-css-code').textContent.matchAll(new RegExp('--(?:theme|color|tweak)-[a-z0-9-]+(?=:)', 'g'))].map(match => match[0]).sort(),
      htmlMachine: [...document.querySelector('#live-html-code').textContent.matchAll(new RegExp('\\\\b(?:id|data-[a-z-]+)="[^"]+"', 'g'))].map(match => match[0]).sort(),
      dtcgTopKeys: Object.keys(json).filter(key => key !== '$description' && key !== '$extensions').sort(),
      dtcgLocale: json.$extensions['com.design-sample-selector'].locale,
      dtcgDisplayName: json.$extensions['com.design-sample-selector'].displayName,
      dtcgDescription: json.$description,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    };
  })()`);
  const forbidden = locale === 'ko'
    ? []
    : [dom.visibleText, dom.accessible]
      .flatMap(text => text.replaceAll('한국어', '').match(NON_KOREAN_FORBIDDEN) || []);
  const result = {
    locale,
    lang: dom.lang,
    selectedLocale: dom.selectedLocale,
    forbiddenKorean: forbidden,
    cssComment: panes.css.match(/^\/\*[^\n]+/m)?.[0] || '',
    htmlCopy: panes.html.match(/<p>([^<]+)<\/p>/)?.[1] || '',
    markdownHeading: panes.md.match(/^## 1\. (.+)$/m)?.[1] || '',
    dtcgDisplayName: dom.dtcgDisplayName,
    dtcgDescription: dom.dtcgDescription,
    runtimeStatus,
    cssKeys: dom.cssKeys,
    htmlMachine: dom.htmlMachine,
    dtcgTopKeys: dom.dtcgTopKeys,
    overflow: dom.overflow
  };
  check(dom.lang === locale && dom.selectedLocale === locale && dom.dtcgLocale === locale, `${locale}: locale synchronization`);
  check(forbidden.length === 0, `${locale}: forbidden Korean ${forbidden.join(', ')}`);
  check(result.cssComment && result.htmlCopy && result.markdownHeading && result.dtcgDescription, `${locale}: human artifact missing`);
  check(dom.overflow <= 1, `${locale}: horizontal overflow ${dom.overflow}`);
  report.locales.push(result);
  await capture(`detail-inspector-${locale}`);
}

async function verifyPreservation(pageUrl) {
  await navigate(`${pageUrl}?lang=ko`);
  await openDetail();
  await clickSelector('[data-insp-tab="html"]');
  await evaluate(`(() => {
    const sidebar = document.querySelector('.detail-sidebar-section');
    sidebar.scrollTop = 240;
    document.querySelector('#btn-inspector-copy').focus();
  })()`);
  const before = await evaluate(`(() => ({
    activeInspectorTab: document.querySelector('.inspector-tab-btn[aria-selected="true"]')?.dataset.inspTab,
    sidebarScrollTop: document.querySelector('.detail-sidebar-section')?.scrollTop || 0,
    focus: document.activeElement?.id || null,
    theme: document.querySelector('#mockup-viewport')?.dataset.theme,
    archetype: document.querySelector('#mockup-viewport')?.dataset.archetype
  }))()`);
  await evaluate(`(() => {
    const select = document.querySelector('#locale-select');
    select.value = 'ja';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  })()`);
  await waitFor(`document.documentElement.lang === 'ja' && document.querySelector('.inspector-tab-btn[aria-selected="true"]')?.dataset.inspTab === 'html'`, 'locale preservation');
  const after = await evaluate(`(() => ({
    activeInspectorTab: document.querySelector('.inspector-tab-btn[aria-selected="true"]')?.dataset.inspTab,
    sidebarScrollTop: document.querySelector('.detail-sidebar-section')?.scrollTop || 0,
    focus: document.activeElement?.id || null,
    theme: document.querySelector('#mockup-viewport')?.dataset.theme,
    archetype: document.querySelector('#mockup-viewport')?.dataset.archetype
  }))()`);
  report.preservation = { before, after };
  check(after.activeInspectorTab === before.activeInspectorTab, 'activeInspectorTab not preserved');
  check(after.sidebarScrollTop > 0, 'sidebarScrollTop not preserved');
  check(after.focus === before.focus, `focus not preserved: ${before.focus} -> ${after.focus}`);
  check(after.theme === before.theme && after.archetype === before.archetype, 'preview identity not preserved');
}

function finalize() {
  const humanSets = ['cssComment', 'htmlCopy', 'markdownHeading', 'dtcgDescription', 'runtimeStatus'];
  for (const key of humanSets) check(new Set(report.locales.map(item => item[key])).size === LOCALES.length, `${key}: five locale values not distinct`);
  for (const key of ['cssKeys', 'htmlMachine', 'dtcgTopKeys']) {
    const reference = JSON.stringify(report.locales[0]?.[key]);
    for (const locale of report.locales.slice(1)) check(JSON.stringify(locale[key]) === reference, `${locale.locale}:${key} changed`);
  }
  for (const [kind, entries] of Object.entries(report.runtimeSignals)) check(entries.length === 0, `${kind}: ${entries.length}`);
  report.summary = { localeCount: report.locales.length, screenshotCount: report.screenshots.length, diagnostics: Object.values(report.runtimeSignals).flat().length, issues: report.issues.length };
}

async function main() {
  const version = spawnSync(CHROME_PATH, ['--version'], { encoding: 'utf8' });
  if (version.status !== 0) throw new Error(`Chrome not found: ${CHROME_PATH}`);
  report.chromeVersion = version.stdout.trim();
  mkdirSync(artifactDirectory, { recursive: true });
  const vitePort = await getFreePort();
  const chromePort = await getFreePort();
  const pageUrl = `http://127.0.0.1:${vitePort}/design_sample_selector/`;
  viteProcess = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(vitePort), '--strictPort'], { cwd: PROJECT_ROOT, stdio: ['ignore', 'ignore', 'ignore'] });
  await waitForHttp(pageUrl, 'Vite preview');
  profileDirectory = mkdtempSync(join(tmpdir(), 'dss-i18n-chrome-profile-'));
  chromeProcess = spawn(CHROME_PATH, ['--headless=new', `--remote-debugging-port=${chromePort}`, '--remote-debugging-address=127.0.0.1', `--user-data-dir=${profileDirectory}`, '--window-size=1440,1100', '--disable-background-networking', '--disable-component-update', '--disable-default-apps', '--disable-dev-shm-usage', '--disable-extensions', '--disable-sync', '--metrics-recording-only', '--mute-audio', '--no-default-browser-check', '--no-first-run', '--password-store=basic', 'about:blank'], { cwd: PROJECT_ROOT, stdio: ['ignore', 'ignore', 'ignore'] });
  const targets = await (await waitForHttp(`http://127.0.0.1:${chromePort}/json/list`, 'Chrome target')).json();
  const pageTarget = targets.find(target => target.type === 'page');
  if (!pageTarget) throw new Error('Chrome page target missing');
  client = new CdpClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();
  bindDiagnostics();
  await Promise.all([client.send('Page.enable'), client.send('Runtime.enable'), client.send('Network.enable')]);
  for (const locale of LOCALES) await inspectLocale(pageUrl, locale);
  await verifyPreservation(pageUrl);
  finalize();
  writeFileSync(join(artifactDirectory, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (report.issues.length) process.exitCode = 1;
}

try {
  await main();
} catch (error) {
  report.fatal = error.stack || error.message;
  mkdirSync(artifactDirectory, { recursive: true });
  writeFileSync(join(artifactDirectory, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  process.stderr.write(`${JSON.stringify(report, null, 2)}\n`);
  process.exitCode = 2;
} finally {
  client?.close();
  await stopProcess(chromeProcess);
  await stopProcess(viteProcess);
  if (profileDirectory) rmSync(profileDirectory, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
}
