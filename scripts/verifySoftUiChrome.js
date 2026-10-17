#!/usr/bin/env node
// 실제 Chrome에서 전체 시안·다국어·좁은 컨테이너의 레이아웃을 검사한다.
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { createServer } from 'node:net';
import { resolve } from 'node:path';
import { PROJECT_BASE } from '../project.config.js';

const artifacts = resolve(process.env.DSS_VISUAL_ARTIFACTS || '.antigravity/soft-ui-evidence');
mkdirSync(artifacts, { recursive: true });
const profile = mkdtempSync(resolve(artifacts, 'chrome-'));
const freePort = () => new Promise(r => {
  const s = createServer(); s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => r(p)); });
});
const pause = ms => new Promise(r => setTimeout(r, ms));
async function ready(url) {
  for (let i = 0; i < 150; i++) {
    try { const r = await fetch(url); if (r.ok) return r; } catch { /* 서버 시작 대기 */ }
    await pause(100);
  }
  throw new Error(`Server unavailable: ${url}`);
}
const webPort = await freePort();
const chromePort = await freePort();
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(webPort)], { stdio: 'ignore' });
const chrome = spawn(process.env.DSS_CHROME_PATH || '/usr/bin/google-chrome', ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage', `--remote-debugging-port=${chromePort}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
let socket;
const report = { checkedAt: new Date().toISOString(), issues: [], runtimeErrors: [], shell: [], previews: null, screenshots: [] };
try {
  await ready(`http://127.0.0.1:${webPort}${PROJECT_BASE}`);
  const tabs = await (await ready(`http://127.0.0.1:${chromePort}/json`)).json();
  socket = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((r, j) => { socket.onopen = r; socket.onerror = j; });
  let id = 0;
  const pending = new Map();
  socket.onmessage = ({ data }) => {
    const r = JSON.parse(data);
    if (r.method === 'Runtime.exceptionThrown') report.runtimeErrors.push(r.params.exceptionDetails);
    if (pending.has(r.id)) { const p = pending.get(r.id); pending.delete(r.id); r.error ? p.reject(r.error) : p.resolve(r.result); }
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => { pending.set(++id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params })); });
  const evaluate = async expression => {
    const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails));
    return r.result.value;
  };
  await send('Runtime.enable');
  await send('Page.navigate', { url: `http://127.0.0.1:${webPort}${PROJECT_BASE}?lang=ko` });
  for (let i = 0; i < 100; i++) { if (await evaluate('!!document.querySelector(".sub-tile")')) break; await pause(100); }
  const screenshot = async name => {
    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    writeFileSync(resolve(artifacts, `${name}.png`), Buffer.from(shot.data, 'base64'));
    report.screenshots.push(`${name}.png`);
  };
  await evaluate('document.querySelector(".tile-detail-btn").click()');
  for (let i = 0; i < 100; i++) { if (await evaluate('!!document.querySelector(".archetype-unit")')) break; await pause(100); }
  report.previews = await evaluate(`(async()=>{const m=await import('${PROJECT_BASE}scripts/visualDesignAudit.js');return m.auditPreviewLayouts();})()`);
  if (report.previews.issues.length) report.issues.push(...report.previews.issues);
  console.log(`Preview: ${report.previews.states} states, ${report.previews.issues.length} issues`);
  await evaluate('document.querySelector("#btn-modal-close").click()');
  for (const locale of ['ko', 'en', 'ja', 'zh-CN', 'zh-TW']) {
    await evaluate(`(async()=>{const s=document.querySelector('#locale-select');s.value=${JSON.stringify(locale)};s.dispatchEvent(new Event('change'));})()`);
    for (let i = 0; i < 100; i++) { if (await evaluate(`document.documentElement.lang===${JSON.stringify(locale)}`)) break; await pause(100); }
    for (const width of [320, 375, 768, 1024, 1440]) {
      await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
      await pause(50);
      for (const mode of ['GRID', 'BENTO', 'SPECTRUM']) {
        await evaluate(`document.querySelector('[data-mode="${mode}"]').click()`);
        const sample = await evaluate(`(()=>{const clipped=[...document.querySelectorAll('#header-root button,#main-root .badge-name,#main-root h3')].filter(e=>e.clientWidth&&e.scrollWidth>e.clientWidth+2).map(e=>({class:e.className,text:e.textContent.trim(),overflow:e.scrollWidth-e.clientWidth}));return{locale:${JSON.stringify(locale)},width:${width},mode:${JSON.stringify(mode)},overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,clipped};})()`);
        report.shell.push(sample);
        if (sample.overflow > 1 || sample.clipped.length) report.issues.push(sample);
      }
    }
  }
  console.log(`Shell: ${report.shell.length} locale/width/mode states, ${report.issues.length} issues`);
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1050, deviceScaleFactor: 1, mobile: false });
  await evaluate('document.querySelector("#locale-select").value="ko";document.querySelector("#locale-select").dispatchEvent(new Event("change"))');
  await pause(200);
  await evaluate('document.querySelector("[data-mode=GRID]").click()');
  await screenshot('main-final');
  report.interactions = await evaluate(`(()=>{
    const result = {};
    result.unconfirmedDisabled = document.querySelector('#btn-open-confirmed').disabled;
    const tile = document.querySelector('.sub-tile'); tile.focus(); tile.click();
    result.selection = tile.getAttribute('aria-pressed') === 'true';
    const bookmark = document.querySelector('.badge-bookmark-btn'); bookmark.focus(); bookmark.click();
    result.bookmarkFocus = document.activeElement.matches('.badge-bookmark-btn');
    result.bookmarkState = document.activeElement.getAttribute('aria-pressed') === 'true';
    const sfx = document.querySelector('.selection-dock [data-compact-audio="sfx"]');
    const before = sfx.getAttribute('aria-pressed'); sfx.click();
    result.dockAudio = sfx.getAttribute('aria-pressed') !== before;
    const mode = document.querySelector('[data-mode="BENTO"]'); mode.focus(); mode.click();
    result.modeFocus = document.activeElement.dataset.mode === 'BENTO';
    document.querySelector('[data-mode="GRID"]').click();
    document.querySelector('.tile-detail-btn').click();
    return result;
  })()`);
  report.interactions.dockLocaleAndRecents = await evaluate(`(async()=>{
    const {appState} = await import('${PROJECT_BASE}src/state/appState.js');
    const {commitLocale} = await import('${PROJECT_BASE}src/i18n/index.js');
    document.querySelector('#btn-modal-close').click();
    appState.setState({recentlyViewed:['neumorphism']});
    document.querySelector('[data-recent-id="neumorphism"]').click();
    const recentSelected = appState.getState().draftSubId === 'neumorphism';
    const snapshot = await commitLocale('ja',appState,window);
    const localized = document.querySelector('.selection-dock [data-compact-audio="bgm"]').getAttribute('aria-label') === snapshot.copy['audio.playTitle'];
    await commitLocale('ko',appState,window);
    document.querySelector('.tile-detail-btn').click();
    return recentSelected && localized;
  })()`);
  await pause(150);
  report.interactions.modalAudio = await evaluate(`(()=>{
    const button = document.querySelector('[role="dialog"] [data-compact-audio="sfx"]');
    const before = button.getAttribute('aria-pressed'); button.click();
    return button.getAttribute('aria-pressed') !== before;
  })()`);
  report.interactions.detailLocaleAfterReturn = await evaluate(`(async()=>{
    const {appState}=await import('${PROJECT_BASE}src/state/appState.js');
    const {getActiveLocaleSnapshot}=await import('${PROJECT_BASE}src/i18n/index.js');
    const expected=getActiveLocaleSnapshot().catalog.styles[appState.getState().selectedSubCategory].name;
    return document.querySelector('#modal-style-title').textContent===expected;
  })()`);
  report.interactions.tuner = await evaluate(`(()=>{
    const result = {};
    const root = document.querySelector('.archetype-unit'); root.style.transition = 'none';
    for (const [key, property] of [['radius','borderRadius'], ['border','borderWidth'], ['shadow','boxShadow'], ['blur','backdropFilter'], ['glow','filter']]) {
      const slider = document.querySelector('#slider-' + key);
      slider.value = slider.min; slider.dispatchEvent(new Event('input'));
      const before = getComputedStyle(root)[property];
      slider.value = slider.max; slider.dispatchEvent(new Event('input'));
      result[key] = getComputedStyle(root)[property] !== before;
    }
    document.querySelector('.reset-tweaks-btn')?.click();
    return Object.values(result).every(Boolean);
  })()`);
  await screenshot('detail-final');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  report.interactions.keyboardInDialog = await evaluate(`!!document.activeElement.closest('[role="dialog"]')`);
  for (const [name, passed] of Object.entries(report.interactions)) if (!passed) report.issues.push({ interaction: name });
  await evaluate('document.querySelector("#btn-modal-compare").click()');
  await pause(100);
  await screenshot('split-final');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  report.reducedMotion = await evaluate('matchMedia("(prefers-reduced-motion: reduce)").matches');
  await evaluate('document.querySelector("#btn-compare-close").click()');
  await pause(50);
  if (await evaluate('!!document.querySelector("#btn-modal-close")')) await evaluate('document.querySelector("#btn-modal-close").click()');
  await evaluate(`(async()=>{const m=await import('${PROJECT_BASE}scripts/visualContactSheets.js');m.renderThemeContactSheet(0);})()`);
  for (let start = 0; start < 120; start += 8) {
    await evaluate(`(async()=>{const m=await import('${PROJECT_BASE}scripts/visualContactSheets.js');m.renderThemeContactSheet(${start});})()`);
    await screenshot('themes-' + String(start / 8 + 1).padStart(2, '0'));
  }
  await evaluate('document.querySelector("#theme-contact-sheet").remove()');
  await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 900, deviceScaleFactor: 1, mobile: false });
  await screenshot('mobile-final');
  writeFileSync(resolve(artifacts, 'shell-report.json'), JSON.stringify(report, null, 2));
  console.log(`Interactions: ${JSON.stringify(report.interactions)}; total issues: ${report.issues.length}, runtime errors: ${report.runtimeErrors.length}`);
  if (report.issues.length || report.runtimeErrors.length) process.exitCode = 1;
} catch (error) { console.error(error); process.exitCode = 1; }
finally {
  socket?.close(); server.kill('SIGTERM'); chrome.kill('SIGTERM');
  await Promise.all([new Promise(r => server.exitCode !== null ? r() : server.once('exit', r)), new Promise(r => chrome.exitCode !== null ? r() : chrome.once('exit', r))]);
  rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
}
