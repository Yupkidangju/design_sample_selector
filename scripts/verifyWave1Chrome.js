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

const PROJECT_ROOT = new URL('..', import.meta.url);
const CHROME_PATH = process.env.DSS_CHROME_PATH || '/usr/bin/google-chrome';
const WAVE_1_IDS = Object.freeze([
  'bauhaus-geometry',
  'de-stijl',
  'flat-design',
  'constructivist',
  'punk-zine',
  'material-design',
  'liquid-glass',
  'art-deco',
  'psychedelic-poster',
  'art-nouveau',
  'risograph',
  'metro-interface'
]);
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

const ARTIFACT_OPTION = process.argv.find(argument => argument.startsWith('--artifacts='));
const artifactValue = ARTIFACT_OPTION?.slice('--artifacts='.length);
const artifactDirectory = artifactValue
  ? (isAbsolute(artifactValue) ? artifactValue : resolve(artifactValue))
  : null;

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
  galleryModes: [],
  responsiveWidths: [],
  details: [],
  deviceMatrix: null,
  splitCompare: null,
  reducedMotion: null,
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

async function waitForSelector(selector, label = selector) {
  return waitFor(
    `Boolean(document.querySelector(${JSON.stringify(selector)}))`,
    label
  );
}

async function waitForElementAnimations(selector) {
  return evaluate(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!element) return false;
    return Promise.all(
      element.getAnimations().map(animation => animation.finished.catch(() => null))
    ).then(() => true);
  })()`);
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

  // 첫 입력은 Chrome의 실제 사용자 제스처로 전달해 Web Audio 정책도 함께 검증한다.
  if (!trustedGesturePrimed) {
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
    trustedGesturePrimed = true;
    return true;
  }

  // 상세 상단 chip의 smooth scroll 중에도 목표 control 자체를 결정론적으로 호출한다.
  return evaluate(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!element) return false;
    if (${double}) {
      element.dispatchEvent(new MouseEvent('dblclick', {
        bubbles: true,
        cancelable: true,
        view: window
      }));
    } else {
      element.click();
    }
    return true;
  })()`);
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
  await sleep(120);
}

async function captureScreenshot(name) {
  if (!artifactDirectory) return;
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
      params.exceptionDetails?.exception?.description ||
      params.exceptionDetails?.text ||
      'unknown exception'
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

async function verifyGallery() {
  await waitFor(
    'document.readyState === "complete" && document.querySelectorAll(".sub-tile").length === 36',
    'Core 36 gallery',
    15_000
  );

  const initial = await evaluate(`(() => {
    const tiles = [...document.querySelectorAll('.sub-tile')];
    const ids = ${JSON.stringify(WAVE_1_IDS)};
    return {
      count: tiles.length,
      unique: new Set(tiles.map(tile => tile.dataset.subId)).size,
      header120: (document.querySelector('.brand-subtitle')?.textContent || '').includes('120종'),
      filter120: (document.querySelector('[data-filter="ALL"]')?.textContent || '').includes('120종'),
      missingThumbs: ids.filter(id => {
        const tile = document.querySelector('.sub-tile[data-sub-id="' + id + '"]');
        return !tile?.querySelector('.thumb-w1-' + id);
      })
    };
  })()`);
  check(initial.count === 36 && initial.unique === 36, '초기 gallery가 36종이 아님');
  check(initial.header120 && initial.filter120, 'header/filter 120종 표기가 누락됨');
  check(initial.missingThumbs.length === 0, `thumbnail 누락: ${initial.missingThumbs.join(', ')}`);

  for (const mode of ['GRID', 'BENTO', 'SPECTRUM']) {
    const buttonSelector = `.view-mode-btn[data-mode="${mode}"]`;
    check(await clickSelector(buttonSelector), `${mode} 버튼 누락`);
    await waitFor(
      `document.querySelector(${JSON.stringify(buttonSelector)})?.classList.contains('active')`,
      `${mode} 활성 상태`
    );
    await sleep(100);
    const modeResult = await evaluate(`(() => {
      const tiles = [...document.querySelectorAll('.sub-tile,.bento-item-card,.spectrum-card')];
      const ids = ${JSON.stringify(WAVE_1_IDS)};
      const visibleWave = ids.filter(id => {
        const tile = document.querySelector(
          '.sub-tile[data-sub-id="' + id + '"],' +
          '.bento-item-card[data-sub-id="' + id + '"],' +
          '.spectrum-card[data-sub-id="' + id + '"]'
        );
        const thumbnail = tile?.querySelector('.thumb-w1-' + id);
        const rect = thumbnail?.getBoundingClientRect();
        return Boolean(rect && rect.width > 0 && rect.height > 0);
      }).length;
      return {
        mode: ${JSON.stringify(mode)},
        count: tiles.length,
        unique: new Set(tiles.map(tile => tile.dataset.subId)).size,
        visibleWave,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
      };
    })()`);
    report.galleryModes.push(modeResult);
    check(modeResult.count === 36 && modeResult.unique === 36, `${mode} gallery가 36종이 아님`);
    if (mode !== 'GRID') check(modeResult.visibleWave === 12, `${mode} Wave 1 visible ${modeResult.visibleWave}/12`);
    check(modeResult.overflow <= 1, `${mode} gallery 가로 overflow ${modeResult.overflow}px`);
  }
  await captureScreenshot('gallery-spectrum-1440');
}

async function verifyResponsiveGallery() {
  const bentoSelector = '.view-mode-btn[data-mode="BENTO"]';
  await clickSelector(bentoSelector);
  await waitFor(
    `document.querySelector(${JSON.stringify(bentoSelector)})?.classList.contains('active')`,
    'Bento gallery'
  );

  for (const width of [320, 375, 414, 768, 1024, 1440]) {
    await setViewport(width, width === 320 ? 900 : 1_000);
    const result = await evaluate(`(() => {
      const root = document.documentElement;
      return {
        width: innerWidth,
        mode: innerWidth < 768 ? 'MOBILE' : innerWidth < 1200 ? 'TABLET' : 'DESKTOP',
        tiles: document.querySelectorAll('.bento-item-card').length,
        overflow: root.scrollWidth - root.clientWidth,
        headerWidth: Math.round(document.querySelector('.app-header')?.getBoundingClientRect().width || 0)
      };
    })()`);
    report.responsiveWidths.push(result);
    check(result.tiles === 36, `${width}px gallery ${result.tiles}/36`);
    check(result.overflow <= 1, `${width}px gallery 가로 overflow ${result.overflow}px`);
    if (width === 320) await captureScreenshot('gallery-bento-320');
  }
}

async function measureArchetypeState(styleId, archetypeId, device) {
  return evaluate(`(() => {
    const viewport = document.querySelector('#mockup-viewport');
    const root = viewport?.querySelector(${JSON.stringify(`.archetype-unit[data-archetype="${archetypeId}"]`)});
    const rect = root?.getBoundingClientRect();
    return {
      styleId: ${JSON.stringify(styleId)},
      archetypeId: ${JSON.stringify(archetypeId)},
      device: ${JSON.stringify(device)},
      theme: viewport?.dataset.theme || null,
      viewportArchetype: viewport?.dataset.archetype || null,
      rootArchetype: root?.dataset.archetype || null,
      rootWidth: Math.round(rect?.width || 0),
      htmlLength: root?.innerHTML.trim().length || 0,
      desktopActive: Boolean(document.querySelector('.device-btn[data-device="desktop"].active')),
      mobileActive: Boolean(document.querySelector('.device-btn[data-device="mobile"].active')),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    };
  })()`);
}

async function verifyDeviceMatrix() {
  await setViewport(1440, 1100);
  const bentoSelector = '.view-mode-btn[data-mode="BENTO"]';
  await clickSelector(bentoSelector);
  await waitFor(
    `document.querySelector(${JSON.stringify(bentoSelector)})?.classList.contains('active')`,
    'Device matrix Bento gallery'
  );

  const styleIds = await evaluate(
    `[...document.querySelectorAll('.bento-item-card')].map(tile => tile.dataset.subId)`
  );
  check(styleIds.length === 36 && new Set(styleIds).size === 36, `device matrix styles ${styleIds.length}/36`);

  const matrix = {
    styleCount: styleIds.length,
    archetypeCount: ARCHETYPE_IDS.length,
    stateCount: 0,
    desktopWidth: { min: Infinity, max: 0 },
    mobileWidth: { min: Infinity, max: 0 },
    failures: []
  };

  for (const styleId of styleIds) {
    const tileSelector = `.bento-item-card[data-sub-id="${styleId}"]`;
    check(await clickSelector(tileSelector, { double: true }), `${styleId} matrix detail 열기 실패`);
    await waitFor(
      `document.querySelector('#mockup-viewport')?.dataset.theme === ${JSON.stringify(styleId)}`,
      `${styleId} matrix detail`
    );
    await waitForElementAnimations('.detail-modal-container');

    for (const archetypeId of ARCHETYPE_IDS) {
      const archetypeSelector = `.archetype-tab-btn[data-archetype="${archetypeId}"]`;
      await clickSelector(archetypeSelector);
      await waitFor(
        `document.querySelector('#mockup-viewport')?.dataset.archetype === ${JSON.stringify(archetypeId)} && Boolean(document.querySelector(${JSON.stringify(`.archetype-unit[data-archetype="${archetypeId}"]`)}))`,
        `${styleId}:${archetypeId} matrix root`
      );

      const states = {};
      for (const device of ['desktop', 'mobile']) {
        const deviceSelector = `.device-btn[data-device="${device}"]`;
        await clickSelector(deviceSelector);
        await waitFor(
          `document.querySelector('#mockup-viewport')?.classList.contains(${JSON.stringify(device)})`,
          `${styleId}:${archetypeId}:${device}`
        );
        const state = await measureArchetypeState(styleId, archetypeId, device);
        states[device] = state;
        matrix.stateCount += 1;

        const valid = state.theme === styleId &&
          state.viewportArchetype === archetypeId &&
          state.rootArchetype === archetypeId &&
          state.htmlLength > 0 &&
          state.rootWidth > 0 &&
          state.overflow <= 1 &&
          (device === 'desktop'
            ? state.desktopActive && !state.mobileActive
            : state.mobileActive && !state.desktopActive && state.rootWidth <= 380);
        if (!valid) matrix.failures.push(state);
      }

      matrix.desktopWidth.min = Math.min(matrix.desktopWidth.min, states.desktop.rootWidth);
      matrix.desktopWidth.max = Math.max(matrix.desktopWidth.max, states.desktop.rootWidth);
      matrix.mobileWidth.min = Math.min(matrix.mobileWidth.min, states.mobile.rootWidth);
      matrix.mobileWidth.max = Math.max(matrix.mobileWidth.max, states.mobile.rootWidth);
      if (states.desktop.rootWidth - states.mobile.rootWidth < 150) {
        matrix.failures.push({
          styleId,
          archetypeId,
          reason: 'device-width-delta',
          desktopWidth: states.desktop.rootWidth,
          mobileWidth: states.mobile.rootWidth
        });
      }
    }

    await clickSelector('#btn-modal-close');
    await waitForSelector(tileSelector, `${styleId} matrix gallery 복귀`);
  }

  report.deviceMatrix = matrix;
  check(matrix.stateCount === 576, `device matrix states ${matrix.stateCount}/576`);
  check(matrix.failures.length === 0, `device matrix 실패 ${matrix.failures.length}개`);
}

async function measureDetail(id, device) {
  const unitSelector = `.w1-${id}-unit`;
  return evaluate(`(() => {
    const viewport = document.querySelector('#mockup-viewport');
    const unit = document.querySelector(${JSON.stringify(unitSelector)});
    const action = unit?.querySelector('button[data-mock-action]');
    const rect = unit?.getBoundingClientRect();
    const clippedControls = [...(unit?.querySelectorAll('button, input, select, textarea, a[href]') || [])]
      .filter(control => {
        const controlRect = control.getBoundingClientRect();
        const style = getComputedStyle(control);
        return controlRect.width > 0 && controlRect.height > 0 && style.visibility !== 'hidden';
      })
      .filter(control => {
        const controlRect = control.getBoundingClientRect();
        return controlRect.left < rect.left - 1 || controlRect.right > rect.right + 1 ||
          controlRect.top < rect.top - 1 || controlRect.bottom > rect.bottom + 1;
      })
      .map(control => control.getAttribute('aria-label') || control.textContent.trim().slice(0, 40));
    return {
      device: ${JSON.stringify(device)},
      viewportClass: viewport?.className || '',
      unitWidth: Math.round(rect?.width || 0),
      unitHeight: Math.round(rect?.height || 0),
      grid: getComputedStyle(unit).gridTemplateColumns,
      tab: unit?.dataset.previewTab || null,
      motion: [...(unit?.classList || [])].find(name => name.startsWith('motion-')) || null,
      fx: Boolean(unit?.querySelector('.fx-layer')),
      actionHeight: Math.round(action?.getBoundingClientRect().height || 0),
      clippedControls,
      desktopActive: Boolean(document.querySelector('.device-btn[data-device="desktop"].active')),
      mobileActive: Boolean(document.querySelector('.device-btn[data-device="mobile"].active')),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    };
  })()`);
}

async function verifyDetails() {
  await setViewport(1440, 1100);

  for (const id of WAVE_1_IDS) {
    const tileSelector = `.bento-item-card[data-sub-id="${id}"]`;
    check(await clickSelector(tileSelector, { double: true }), `${id} detail 열기 실패`);
    await waitFor(
      `document.querySelector('#mockup-viewport')?.dataset.theme === ${JSON.stringify(id)}`,
      `${id} detail`
    );
    await waitForElementAnimations('.detail-modal-container');

    const webSelector = '.archetype-tab-btn[data-archetype="web"]';
    await clickSelector(webSelector);
    await waitFor(
      `document.querySelector('#mockup-viewport')?.dataset.archetype === 'web' && Boolean(document.querySelector(${JSON.stringify(`.w1-${id}-unit`)}))`,
      `${id} Web hero`
    );

    const desktopSelector = '.device-btn[data-device="desktop"]';
    await clickSelector(desktopSelector);
    await waitFor(
      `document.querySelector('#mockup-viewport')?.classList.contains('desktop')`,
      `${id} desktop`
    );
    await sleep(80);
    const desktop = await measureDetail(id, 'desktop');
    if (id === 'metro-interface') await captureScreenshot('detail-metro-desktop');

    const mobileSelector = '.device-btn[data-device="mobile"]';
    await clickSelector(mobileSelector);
    await waitFor(
      `document.querySelector('#mockup-viewport')?.classList.contains('mobile')`,
      `${id} mobile`
    );
    await sleep(80);
    const mobile = await measureDetail(id, 'mobile');
    if (id === 'liquid-glass') await captureScreenshot('detail-liquid-glass-mobile');

    report.details.push({ id, desktop, mobile });
    check(desktop.desktopActive && !desktop.mobileActive, `${id} desktop 버튼 상태 오류`);
    check(mobile.mobileActive && !mobile.desktopActive, `${id} mobile 버튼 상태 오류`);
    check(desktop.unitWidth >= 600, `${id} desktop 폭 ${desktop.unitWidth}px`);
    check(mobile.unitWidth > 0 && mobile.unitWidth <= 380, `${id} mobile 폭 ${mobile.unitWidth}px`);
    check(desktop.unitWidth - mobile.unitWidth >= 200, `${id} device 폭 차이 ${desktop.unitWidth - mobile.unitWidth}px`);
    check(desktop.tab === 'hero', `${id} hero tab 누락`);
    check(Boolean(desktop.motion), `${id} motion class 누락`);
    check(desktop.fx, `${id} fx layer 누락`);
    check(desktop.actionHeight >= 44, `${id} action 높이 ${desktop.actionHeight}px`);
    check(desktop.clippedControls.length === 0, `${id} desktop 잘린 control: ${desktop.clippedControls.join(', ')}`);
    check(mobile.clippedControls.length === 0, `${id} mobile 잘린 control: ${mobile.clippedControls.join(', ')}`);
    check(mobile.grid !== desktop.grid, `${id} desktop/mobile grid 동일: ${mobile.grid}`);
    check(mobile.overflow <= 1, `${id} detail 가로 overflow ${mobile.overflow}px`);

    await clickSelector('#btn-modal-close');
    await waitForSelector(tileSelector, `${id} gallery 복귀`);
  }
}

async function verifySplitAndReducedMotion() {
  const tileSelector = '.bento-item-card[data-sub-id="bauhaus-geometry"]';
  await clickSelector(tileSelector, { double: true });
  await waitFor(
    'document.querySelector("#mockup-viewport")?.dataset.theme === "bauhaus-geometry"',
    'Bauhaus detail 재진입'
  );
  await clickSelector('#btn-modal-compare');
  await waitFor(
    'document.querySelectorAll(".split-viewport").length === 2',
    'Split compare'
  );
  report.splitCompare = await evaluate(`(() => {
    const views = [...document.querySelectorAll('.split-viewport')];
    return {
      count: views.length,
      themes: views.map(view => view.dataset.theme),
      roots: views.map(view => Boolean(view.querySelector('.archetype-unit,.mockup-unit'))),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    };
  })()`);
  check(report.splitCompare.roots.every(Boolean), 'Split compare root 누락');
  check(report.splitCompare.themes.includes('bauhaus-geometry'), 'Split compare Bauhaus 누락');
  check(report.splitCompare.overflow <= 1, `Split compare 가로 overflow ${report.splitCompare.overflow}px`);
  await captureScreenshot('split-bauhaus-1440');

  await clickSelector('#btn-compare-close');
  await waitForSelector('#mockup-viewport', 'Split에서 detail 복귀');
  await clickSelector('.archetype-tab-btn[data-archetype="web"]');
  await waitForSelector('.w1-bauhaus-geometry-unit', 'Bauhaus Web hero');
  await client.send('Emulation.setEmulatedMedia', {
    media: '',
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
  });
  await sleep(150);
  report.reducedMotion = await evaluate(`(() => {
    const unit = document.querySelector('.w1-bauhaus-geometry-unit');
    const fx = unit?.querySelector('.fx-layer');
    const animated = [...unit.querySelectorAll('*')]
      .filter(element => getComputedStyle(element).animationName !== 'none');
    return {
      matches: matchMedia('(prefers-reduced-motion: reduce)').matches,
      fxAnimation: fx ? getComputedStyle(fx).animationName : null,
      animatedDescendants: animated.length
    };
  })()`);
  check(report.reducedMotion.matches, 'reduced-motion media query 불일치');
  check(report.reducedMotion.fxAnimation === 'none', `reduced-motion fx ${report.reducedMotion.fxAnimation}`);
  check(report.reducedMotion.animatedDescendants === 0, `reduced-motion animation ${report.reducedMotion.animatedDescendants}개`);
  await client.send('Emulation.setEmulatedMedia', { media: '', features: [] });
}

function finalizeReport() {
  const diagnosticCount = Object.values(runtimeSignals)
    .reduce((total, entries) => total + entries.length, 0);
  check(runtimeSignals.consoleWarnings.length === 0, `console warning ${runtimeSignals.consoleWarnings.length}개`);
  check(runtimeSignals.consoleErrors.length === 0, `console error ${runtimeSignals.consoleErrors.length}개`);
  check(runtimeSignals.exceptions.length === 0, `page exception ${runtimeSignals.exceptions.length}개`);
  check(runtimeSignals.networkFailures.length === 0, `network failure ${runtimeSignals.networkFailures.length}개`);
  check(runtimeSignals.httpErrors.length === 0, `HTTP error ${runtimeSignals.httpErrors.length}개`);
  report.summary = {
    galleryModes: report.galleryModes.length,
    responsiveWidths: report.responsiveWidths.length,
    detailStyles: report.details.length,
    deviceMatrixStates: report.deviceMatrix?.stateCount || 0,
    desktopMobilePasses: report.details.filter(
      detail => detail.desktop.unitWidth - detail.mobile.unitWidth >= 200
    ).length,
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
  if (artifactDirectory) mkdirSync(artifactDirectory, { recursive: true });

  const vitePort = await getFreePort();
  const chromePort = await getFreePort();
  const pageUrl = `http://127.0.0.1:${vitePort}/`;
  viteProcess = spawn(
    process.execPath,
    ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(vitePort), '--strictPort'],
    { cwd: PROJECT_ROOT, stdio: ['ignore', 'pipe', 'pipe'] }
  );
  await waitForHttp(pageUrl, 'Vite');

  profileDirectory = mkdtempSync(join(tmpdir(), 'dss-wave1-chrome-profile-'));
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
  await client.send('Page.navigate', { url: pageUrl });

  await verifyGallery();
  await verifyResponsiveGallery();
  await verifyDetails();
  await verifyDeviceMatrix();
  await verifySplitAndReducedMotion();
  finalizeReport();

  if (artifactDirectory) {
    writeFileSync(
      join(artifactDirectory, 'report.json'),
      `${JSON.stringify(report, null, 2)}\n`,
      'utf8'
    );
  }
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (issues.length > 0) process.exitCode = 1;
}

try {
  await main();
} catch (error) {
  report.fatal = error.stack || error.message;
  if (artifactDirectory) {
    mkdirSync(artifactDirectory, { recursive: true });
    writeFileSync(
      join(artifactDirectory, 'report.json'),
      `${JSON.stringify(report, null, 2)}\n`,
      'utf8'
    );
  }
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
