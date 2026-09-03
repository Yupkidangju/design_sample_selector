#!/usr/bin/env node

import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PROJECT_BASE } from '../project.config.js';

import { getLocalizedLegacyAllSubDesigns } from '../src/catalog/legacyAdapter.js';
import { loadLocaleSnapshot } from '../src/i18n/index.js';

const PROJECT_ROOT = fileURLToPath(new URL('..', import.meta.url));
const CHROME_PATH = process.env.DSS_CHROME_PATH || '/usr/bin/google-chrome';
const LOCALES = Object.freeze(['ko', 'en', 'ja', 'zh-CN', 'zh-TW']);
const REFLOW_VIEWPORTS = Object.freeze([320, 375, 768, 1024, 1440]);
const ZOOM_200 = Object.freeze({
  label: 'zoom-200',
  physicalWidth: 1280,
  cssWidth: 640,
  cssHeight: 900,
  deviceScaleFactor: 2
});
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
  reflow: {
    contract: {
      widths: REFLOW_VIEWPORTS,
      zoom200: ZOOM_200
    },
    states: []
  },
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

async function setViewport({ cssWidth, cssHeight = 900, deviceScaleFactor = 1 }) {
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: cssWidth,
    height: cssHeight,
    deviceScaleFactor,
    mobile: false
  });
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

async function openDetail(styleId = 'swiss-grid') {
  const selector = `[data-result-id="${styleId}"]`;
  const opened = await evaluate(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!element) return false;
    element.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, cancelable: true, view: window }));
    return true;
  })()`);
  check(opened, `${styleId} card missing`);
  await waitFor(`Boolean(document.querySelector('#mockup-viewport')) && Boolean(document.querySelector('#live-css-code')?.textContent)`, 'detail inspector');
}

async function collectCatalogCards(locale) {
  const snapshot = await loadLocaleSnapshot(locale);
  const expectedById = new Map(
    getLocalizedLegacyAllSubDesigns(snapshot).map(design => [design.id, design.name])
  );
  const cards = [];

  while (true) {
    const pageCards = await evaluate(`[
      ...document.querySelectorAll('[data-result-id]')
    ].map(element => ({
      id: element.dataset.resultId,
      name: element.querySelector('.badge-name, .bento-title, .spec-title')?.textContent.trim() || ''
    }))`);
    cards.push(...pageCards);
    const canContinue = await evaluate(
      `Boolean(document.querySelector('[data-gallery-page="next"]:not(:disabled)'))`
    );
    if (!canContinue) break;
    const previousFirstId = pageCards[0]?.id || '';
    check(await clickSelector('[data-gallery-page="next"]'), `${locale}: next page missing`);
    await waitFor(
      `document.querySelector('[data-result-id]')?.dataset.resultId !== ${JSON.stringify(previousFirstId)}`,
      `${locale}: next page`
    );
  }

  const mismatches = cards.flatMap(({ id, name }) => {
    const expectedName = expectedById.get(id);
    return expectedName === name ? [] : [{ id, expectedName: expectedName || null, actualName: name }];
  });
  const reachableCount = cards.length;
  const uniqueCount = new Set(cards.map(card => card.id)).size;
  check(reachableCount === 120, `${locale}: catalog card reachability ${reachableCount}/120`);
  check(uniqueCount === 120, `${locale}: catalog card uniqueness ${uniqueCount}/120`);
  check(expectedById.size === 120, `${locale}: expected catalog size ${expectedById.size}/120`);
  check(mismatches.length === 0, `${locale}: localized card mismatch ${JSON.stringify(mismatches.slice(0, 5))}`);
  return {
    reachableCount,
    uniqueCount,
    expectedCount: expectedById.size,
    mismatchCount: mismatches.length,
    mismatches
  };
}

async function verifySemanticAlignment() {
  const snapshots = await Promise.all(LOCALES.map(loadLocaleSnapshot));
  const ids = Object.keys(snapshots[0].catalog.styles).sort();
  const idDrift = [];
  const machineDrift = [];
  const emptyHumanFields = [];
  const machineSignature = record => JSON.stringify({
    id: record.id,
    palette: record.palette.map(color => ({ id: color.id, value: color.value })),
    lengths: [record.characteristics.length, record.pros.length, record.cons.length]
  });

  let humanUnitCountPerLocale = 0;
  for (const [snapshotIndex, snapshot] of snapshots.entries()) {
    const localeIds = Object.keys(snapshot.catalog.styles).sort();
    if (JSON.stringify(localeIds) !== JSON.stringify(ids)) idDrift.push(snapshot.locale);
    for (const id of ids) {
      const record = snapshot.catalog.styles[id];
      if (!record) continue;
      if (snapshotIndex === 0) {
        humanUnitCountPerLocale += 2 + record.palette.length * 2
          + record.characteristics.length + record.pros.length + record.cons.length;
      }
      if (machineSignature(record) !== machineSignature(snapshots[0].catalog.styles[id])) {
        machineDrift.push(`${snapshot.locale}:${id}`);
      }
      const humanValues = [
        record.name,
        record.summary,
        ...record.palette.flatMap(color => [color.name, color.usage]),
        ...record.characteristics,
        ...record.pros,
        ...record.cons
      ];
      if (humanValues.some(value => !value?.trim())) emptyHumanFields.push(`${snapshot.locale}:${id}`);
    }
  }

  const simplified = snapshots[LOCALES.indexOf('zh-CN')].catalog.styles;
  const traditional = snapshots[LOCALES.indexOf('zh-TW')].catalog.styles;
  const simplifiedText = JSON.stringify(simplified);
  const traditionalText = JSON.stringify(traditional);
  const countTerm = (text, term) => text.split(term).length - 1;
  const identicalChineseSummaries = ids.filter(id => simplified[id].summary === traditional[id].summary);
  const identicalChineseRecords = ids.filter(id => JSON.stringify(simplified[id]) === JSON.stringify(traditional[id]));

  report.semantic = {
    localeCount: snapshots.length,
    styleCount: ids.length,
    humanUnitCountPerLocale,
    humanUnitCount: humanUnitCountPerLocale * snapshots.length,
    idDrift,
    machineDrift,
    emptyHumanFields,
    chineseRegionalSeparation: {
      identicalSummaryCount: identicalChineseSummaries.length,
      identicalRecordCount: identicalChineseRecords.length,
      simplifiedTermHits: Object.fromEntries(['用户', '界面', '数据', '加载', '网格', '亚克力'].map(term => [term, countTerm(simplifiedText, term)])),
      traditionalTermHits: Object.fromEntries(['使用者', '介面', '資料', '載入', '網格', '壓克力'].map(term => [term, countTerm(traditionalText, term)]))
    }
  };
  check(ids.length === 120, `semantic: style count ${ids.length}/120`);
  check(idDrift.length === 0, `semantic: locale ID drift ${JSON.stringify(idDrift)}`);
  check(machineDrift.length === 0, `semantic: machine drift ${JSON.stringify(machineDrift.slice(0, 8))}`);
  check(emptyHumanFields.length === 0, `semantic: empty human fields ${JSON.stringify(emptyHumanFields.slice(0, 8))}`);
  check(identicalChineseSummaries.length === 0, `semantic: identical zh summaries ${JSON.stringify(identicalChineseSummaries.slice(0, 8))}`);
  check(identicalChineseRecords.length === 0, `semantic: identical zh records ${JSON.stringify(identicalChineseRecords.slice(0, 8))}`);
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
  const localeSelector = await evaluate(`(() => {
    const picker = document.querySelector('.locale-picker');
    const select = document.querySelector('#locale-select');
    const rect = select.getBoundingClientRect();
    const pickerRect = picker.getBoundingClientRect();
    const actionsRect = document.querySelector('.header-actions').getBoundingClientRect();
    const brandRect = document.querySelector('.brand-container').getBoundingClientRect();
    const style = getComputedStyle(select);
    return {
      pickerWidth: pickerRect.width,
      layout: {
        picker: { x: pickerRect.x, y: pickerRect.y, width: pickerRect.width, height: pickerRect.height },
        actions: { x: actionsRect.x, y: actionsRect.y, width: actionsRect.width, height: actionsRect.height },
        brand: { x: brandRect.x, y: brandRect.y, width: brandRect.width, height: brandRect.height }
      },
      rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      color: style.color,
      backgroundColor: style.backgroundColor,
      colorScheme: style.colorScheme
    };
  })()`);
  check(localeSelector.backgroundColor === 'rgb(14, 20, 32)', `${locale}: locale selector background ${localeSelector.backgroundColor}`);
  check(localeSelector.color === 'rgb(248, 250, 252)', `${locale}: locale selector color ${localeSelector.color}`);
  check(localeSelector.colorScheme === 'dark', `${locale}: locale selector color scheme ${localeSelector.colorScheme}`);
  check(Math.abs(localeSelector.rect.width - 104) <= 0.5 && Math.abs(localeSelector.rect.height - 34) <= 0.5, `${locale}: locale selector size ${JSON.stringify(localeSelector.rect)}`);
  await capture(`locale-selector-${locale}`);
  const catalogCards = await collectCatalogCards(locale);

  await evaluate(`(() => {
    const input = document.querySelector('#search-input');
    input.value = 'Ulm Rationalism';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  })()`);
  await waitFor(`Boolean(document.querySelector('[data-result-id="ulm-rationalism"]'))`, `${locale}: expansion result`);
  await openDetail('ulm-rationalism');
  check(await clickSelector('.archetype-tab-btn[data-archetype="web"]'), `${locale}: web archetype missing`);
  await waitFor(`document.querySelector('.e120-ulm-rationalism-unit .e120-copy-hero > p:nth-of-type(2)')?.textContent.length > 20`, `${locale}: localized expansion preview`);
  const expansionPreview = await evaluate(`(() => {
    const root = document.querySelector('.e120-ulm-rationalism-unit');
    return {
      name: root.querySelector('.e120-unit-header span').textContent.trim(),
      summary: root.querySelector('.e120-copy-hero > p:nth-of-type(2)').textContent.trim(),
      visibleText: root.innerText,
      accessible: [...root.querySelectorAll('[aria-label], [title]')]
        .flatMap(element => ['aria-label', 'title'].map(name => element.getAttribute(name)).filter(Boolean))
        .join(String.fromCharCode(10))
    };
  })()`);
  const expansionForbidden = locale === 'ko'
    ? []
    : [expansionPreview.visibleText, expansionPreview.accessible]
      .flatMap(text => text.match(NON_KOREAN_FORBIDDEN) || []);
  check(expansionForbidden.length === 0, `${locale}: expansion preview Korean ${expansionForbidden.join(', ')}`);
  await capture(`expansion-preview-${locale}`);

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
    localeSelector,
    catalogCards,
    expansionPreview: { name: expansionPreview.name, summary: expansionPreview.summary },
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

async function collectReflowMetrics() {
  return evaluate(`(() => {
    const isVisible = element => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
    };
    const hasHorizontalScroller = element => {
      let ancestor = element.parentElement;
      while (ancestor && ancestor !== document.documentElement) {
        const style = getComputedStyle(ancestor);
        if (/(auto|scroll)/.test(style.overflowX) && ancestor.scrollWidth > ancestor.clientWidth + 1) return true;
        ancestor = ancestor.parentElement;
      }
      return false;
    };
    const accessibleName = element => {
      const labelledBy = element.getAttribute('aria-labelledby');
      const labelledText = labelledBy
        ? labelledBy.split(/\\s+/).map(id => document.getElementById(id)?.textContent?.trim() || '').join(' ').trim()
        : '';
      const labelText = [...(element.labels || [])].map(label => label.textContent.trim()).join(' ').trim();
      return (
        element.getAttribute('aria-label') || labelledText || labelText || element.getAttribute('title') ||
        element.textContent?.trim() || element.getAttribute('placeholder') || ''
      ).trim();
    };
    const selectorFor = element => {
      if (element.id) return '#' + element.id;
      const className = [...element.classList].slice(0, 2).join('.');
      return element.tagName.toLowerCase() + (className ? '.' + className : '');
    };
    const controls = [...document.querySelectorAll('button, input, select, textarea, a[href], [role="button"], [role="tab"]')]
      .filter(isVisible);
    const unnamedControls = controls.filter(element => !accessibleName(element)).map(selectorFor);
    const clippedControls = controls.filter(element => {
      const rect = element.getBoundingClientRect();
      return (rect.left < -1 || rect.right > innerWidth + 1) && !hasHorizontalScroller(element);
    }).map(element => {
      const rect = element.getBoundingClientRect();
      return { selector: selectorFor(element), left: rect.left, right: rect.right, width: rect.width };
    });
    const regionRect = selector => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height };
    };
    return {
      viewport: { width: innerWidth, height: innerHeight, deviceScaleFactor: devicePixelRatio },
      documentOverflowX: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
      controlCount: controls.length,
      unnamedControls,
      clippedControls,
      renderedCardCount: document.querySelectorAll('[data-result-id]').length,
      regions: {
        header: regionRect('.app-header'),
        localePicker: regionRect('.locale-picker'),
        detail: regionRect('.detail-modal-container'),
        sandbox: regionRect('.mockup-sandbox-section'),
        sidebar: regionRect('.detail-sidebar-section')
      }
    };
  })()`);
}

function verifyReflowMetrics(locale, label, phase, metrics) {
  const prefix = `${locale}:${label}:${phase}`;
  check(metrics.documentOverflowX <= 1, `${prefix}: document overflow ${metrics.documentOverflowX}`);
  check(metrics.unnamedControls.length === 0, `${prefix}: unnamed controls ${JSON.stringify(metrics.unnamedControls.slice(0, 8))}`);
  check(metrics.clippedControls.length === 0, `${prefix}: clipped controls ${JSON.stringify(metrics.clippedControls.slice(0, 8))}`);
  check(metrics.controlCount > 0, `${prefix}: no visible controls`);
  if (phase === 'gallery') {
    check(metrics.renderedCardCount > 0, `${prefix}: no rendered cards`);
    check(Boolean(metrics.regions.localePicker), `${prefix}: locale picker missing`);
  } else {
    check(Boolean(metrics.regions.detail), `${prefix}: detail missing`);
    check(Boolean(metrics.regions.sandbox), `${prefix}: sandbox missing`);
    check(Boolean(metrics.regions.sidebar), `${prefix}: sidebar missing`);
    if (metrics.regions.detail) {
      check(metrics.regions.detail.left >= -1 && metrics.regions.detail.right <= metrics.viewport.width + 1, `${prefix}: detail outside viewport ${JSON.stringify(metrics.regions.detail)}`);
    }
  }
}

async function inspectReflowState(pageUrl, locale, viewport) {
  await setViewport(viewport);
  await navigate(`${pageUrl}?lang=${encodeURIComponent(locale)}`);
  const gallery = await collectReflowMetrics();
  verifyReflowMetrics(locale, viewport.label, 'gallery', gallery);
  await openDetail();
  const detail = await collectReflowMetrics();
  verifyReflowMetrics(locale, viewport.label, 'detail', detail);
  report.reflow.states.push({ locale, viewport, gallery, detail });
  if (viewport.cssWidth === 320 || viewport.cssWidth === 1440 || viewport.label === ZOOM_200.label) {
    await capture(`reflow-${locale}-${viewport.label}`);
  }
}

async function verifyReflowMatrix(pageUrl) {
  const viewports = [
    ...REFLOW_VIEWPORTS.map(cssWidth => ({
      label: `width-${cssWidth}`,
      physicalWidth: cssWidth,
      cssWidth,
      cssHeight: 900,
      deviceScaleFactor: 1
    })),
    ZOOM_200
  ];
  for (const locale of LOCALES) {
    for (const viewport of viewports) await inspectReflowState(pageUrl, locale, viewport);
  }
}

function finalize() {
  const humanSets = ['cssComment', 'htmlCopy', 'markdownHeading', 'dtcgDescription', 'runtimeStatus'];
  for (const key of humanSets) check(new Set(report.locales.map(item => item[key])).size === LOCALES.length, `${key}: five locale values not distinct`);
  for (const key of ['cssKeys', 'htmlMachine', 'dtcgTopKeys']) {
    const reference = JSON.stringify(report.locales[0]?.[key]);
    for (const locale of report.locales.slice(1)) check(JSON.stringify(locale[key]) === reference, `${locale.locale}:${key} changed`);
  }
  check(new Set(report.locales.map(item => item.expansionPreview.summary)).size === LOCALES.length, 'expansion preview summaries are not five-locale distinct');
  const referenceRect = report.locales[0]?.localeSelector?.rect;
  for (const locale of report.locales.slice(1)) {
    const rect = locale.localeSelector?.rect;
    check(Math.abs(rect.x - referenceRect.x) <= 0.5 && Math.abs(rect.y - referenceRect.y) <= 0.5, `${locale.locale}: locale selector position changed ${JSON.stringify(rect)}`);
  }
  for (const [kind, entries] of Object.entries(report.runtimeSignals)) check(entries.length === 0, `${kind}: ${entries.length}`);
  report.summary = {
    localeCount: report.locales.length,
    reflowStateCount: report.reflow.states.length,
    screenshotCount: report.screenshots.length,
    diagnostics: Object.values(report.runtimeSignals).flat().length,
    issues: report.issues.length
  };
}

async function main() {
  const version = spawnSync(CHROME_PATH, ['--version'], { encoding: 'utf8' });
  if (version.status !== 0) throw new Error(`Chrome not found: ${CHROME_PATH}`);
  report.chromeVersion = version.stdout.trim();
  mkdirSync(artifactDirectory, { recursive: true });
  await verifySemanticAlignment();
  const vitePort = await getFreePort();
  const chromePort = await getFreePort();
  const pageUrl = `http://127.0.0.1:${vitePort}${PROJECT_BASE}`;
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
  await verifyReflowMatrix(pageUrl);
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
