#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { PROJECT_BASE } from '../../../../project.config.js';

const PROJECT_ROOT = fileURLToPath(new URL('../../../..', import.meta.url));
const REPORT_PATH = fileURLToPath(new URL('./cta-keyboard-report.json', import.meta.url));
const CHROME_PATH = process.env.DSS_CHROME_PATH || '/usr/bin/google-chrome';
const cases = [
  ['grid', '.tile-detail-btn'],
  ['bento', '.bento-open-cta'],
  ['spectrum', '.spec-cta']
];
const keys = [
  { key: 'Enter', code: 'Enter', keyCode: 13 },
  { key: ' ', code: 'Space', keyCode: 32 }
];

const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

async function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(error => error ? reject(error) : resolve(port));
    });
  });
}

async function waitForHttp(url, timeout = 15_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
    } catch {}
    await sleep(100);
  }
  throw new Error(`HTTP timeout: ${url}`);
}

async function stopProcess(processHandle) {
  if (!processHandle || processHandle.exitCode !== null) return;
  processHandle.kill('SIGTERM');
  await Promise.race([
    new Promise(resolve => processHandle.once('exit', resolve)),
    sleep(2_500)
  ]);
  if (processHandle.exitCode === null) processHandle.kill('SIGKILL');
}

class CdpClient {
  constructor(url) {
    this.url = url;
    this.nextId = 1;
    this.pending = new Map();
  }

  async connect() {
    this.socket = new WebSocket(this.url);
    await new Promise((resolve, reject) => {
      this.socket.addEventListener('open', resolve, { once: true });
      this.socket.addEventListener('error', reject, { once: true });
    });
    this.socket.addEventListener('message', event => {
      const message = JSON.parse(String(event.data));
      if (!message.id) return;
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(message.error.message));
      else pending.resolve(message.result);
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    const result = new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
    this.socket.send(JSON.stringify({ id, method, params }));
    return result;
  }

  close() {
    this.socket?.close();
  }
}

let viteProcess;
let chromeProcess;
let profileDirectory;
let client;

async function evaluate(expression) {
  const result = await client.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || 'browser evaluation failed');
  return result.result?.value;
}

async function waitFor(expression, label, timeout = 15_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await evaluate(`Boolean(${expression})`)) return;
    await sleep(50);
  }
  throw new Error(`${label} timeout`);
}

async function dispatchKey({ key, code, keyCode }) {
  const params = {
    key,
    code,
    windowsVirtualKeyCode: keyCode,
    nativeVirtualKeyCode: keyCode
  };
  await client.send('Input.dispatchKeyEvent', { type: 'keyDown', ...params });
  await client.send('Input.dispatchKeyEvent', { type: 'keyUp', ...params });
}

const report = {
  checkedAt: new Date().toISOString(),
  chromeVersion: null,
  isolatedProfile: true,
  cases: [],
  issues: []
};

try {
  const vitePort = await getFreePort();
  const chromePort = await getFreePort();
  const pageUrl = `http://127.0.0.1:${vitePort}${PROJECT_BASE}`;
  viteProcess = spawn(
    process.execPath,
    ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(vitePort), '--strictPort'],
    { cwd: PROJECT_ROOT, stdio: ['ignore', 'ignore', 'ignore'] }
  );
  await waitForHttp(pageUrl);

  profileDirectory = mkdtempSync(join(tmpdir(), 'dss-cta-audit13-'));
  chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${chromePort}`,
    '--remote-debugging-address=127.0.0.1',
    `--user-data-dir=${profileDirectory}`,
    '--window-size=1440,1100',
    '--disable-background-networking',
    '--disable-component-update',
    '--disable-extensions',
    '--mute-audio',
    '--no-default-browser-check',
    '--no-first-run',
    'about:blank'
  ], { cwd: PROJECT_ROOT, stdio: ['ignore', 'ignore', 'ignore'] });

  const version = await (await waitForHttp(`http://127.0.0.1:${chromePort}/json/version`)).json();
  report.chromeVersion = version.Browser;
  const targets = await (await waitForHttp(`http://127.0.0.1:${chromePort}/json/list`)).json();
  const pageTarget = targets.find(target => target.type === 'page');
  if (!pageTarget) throw new Error('Chrome page target missing');
  client = new CdpClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();
  await Promise.all([client.send('Page.enable'), client.send('Runtime.enable')]);

  for (const [mode, selector] of cases) {
    for (const key of keys) {
      const url = `${pageUrl}?view=${mode}&qa=cta-${mode}-${key.code}-${Date.now()}`;
      await client.send('Page.navigate', { url });
      await waitFor(
        `document.readyState === 'complete'
          && document.body?.hasAttribute('data-app-pending') === false
          && document.querySelector(${JSON.stringify(selector)})`,
        `${mode} CTA`
      );
      const before = await evaluate(`(() => {
        const button = document.querySelector(${JSON.stringify(selector)});
        const rect = button.getBoundingClientRect();
        button.scrollIntoView({ block: 'center', inline: 'center' });
        button.focus();
        return {
          id: button.dataset.subId,
          tagName: button.tagName,
          width: rect.width,
          height: rect.height,
          focused: document.activeElement === button
        };
      })()`);
      await dispatchKey(key);
      await waitFor(`document.querySelector('#mockup-viewport')`, `${mode} ${key.code} detail`);
      const after = await evaluate(`(() => {
        const viewport = document.querySelector('#mockup-viewport');
        return {
          theme: viewport?.dataset.theme || null,
          detailDisplay: getComputedStyle(document.querySelector('#detail-root')).display,
          mainDisplay: getComputedStyle(document.querySelector('#main-root')).display
        };
      })()`);
      const passed = before.tagName === 'BUTTON'
        && before.focused
        && before.width >= 44
        && before.height >= 44
        && after.theme === before.id
        && after.detailDisplay !== 'none';
      if (!passed) report.issues.push(`${mode}/${key.code} failed`);
      report.cases.push({ mode, key: key.code, selector, before, after, passed });
    }
  }
} catch (error) {
  report.fatal = error.stack || error.message;
  process.exitCode = 2;
} finally {
  client?.close();
  await stopProcess(chromeProcess);
  await stopProcess(viteProcess);
  if (profileDirectory) rmSync(profileDirectory, { recursive: true, force: true });
  mkdirSync(dirname(REPORT_PATH), { recursive: true });
  writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
}

if (report.issues.length > 0) process.exitCode = 1;
process.stdout.write(`${report.issues.length === 0 && !report.fatal ? 'CTA keyboard Chrome QA PASS' : 'CTA keyboard Chrome QA FAIL'}\n`);
process.stdout.write(`- cases: ${report.cases.filter(item => item.passed).length}/${report.cases.length}\n`);
process.stdout.write(`- report: ${REPORT_PATH}\n`);

