import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const detailSource = readFileSync(new URL('../src/components/detailView.js', import.meta.url), 'utf8');
const runtimeSource = readFileSync(new URL('../src/components/mockupRuntime.js', import.meta.url), 'utf8');
const peekSource = readFileSync(new URL('../src/components/peekPreview.js', import.meta.url), 'utf8');
const dockSource = readFileSync(new URL('../src/components/selectionDock.js', import.meta.url), 'utf8');
const htmlSource = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const templatesSource = readFileSync(new URL('../src/components/archetypeTemplates.js', import.meta.url), 'utf8');
const baseCss = readFileSync(new URL('../index.css', import.meta.url), 'utf8');
const interactiveCss = readFileSync(new URL('../src/styles/interactive.css', import.meta.url), 'utf8');
const auditDetailCss = readFileSync(new URL('../src/styles/audit9-detail.css', import.meta.url), 'utf8');
const detailCss = `${baseCss}\n${interactiveCss}\n${auditDetailCss}`;
const mainSource = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const stateSource = readFileSync(new URL('../src/state/appState.js', import.meta.url), 'utf8');
const audioSource = readFileSync(new URL('../src/audio/synthAudio.js', import.meta.url), 'utf8');
const audioWidgetSource = readFileSync(new URL('../src/components/audioWidget.js', import.meta.url), 'utf8');
const discoveryUrlStateSource = readFileSync(new URL('../src/state/discoveryUrlState.js', import.meta.url), 'utf8');
const catalog120ChromeQaSource = readFileSync(
  new URL('../scripts/verifyCatalog120Chrome.js', import.meta.url),
  'utf8'
);
const scalabilityChromeQaSource = readFileSync(
  new URL('../scripts/verifyRenderScalabilityChrome.js', import.meta.url),
  'utf8'
);
const clipboardModule = await import('../src/utils/clipboard.js');
const { appState } = await import('../src/state/appState.js');
const audioModule = await import('../src/audio/synthAudio.js');
const detailModule = await import('../src/components/detailView.js');

test('Audit 9 rework: every shared Detail sidebar class has loaded CSS', () => {
  const sidebarStart = detailSource.indexOf('<aside class="detail-sidebar-section">');
  const sidebarMarkup = detailSource.slice(sidebarStart, detailSource.indexOf('</aside>', sidebarStart));
  const sidebarClasses = [...sidebarMarkup.matchAll(/class="([^"]+)"/gu)]
    .flatMap(match => match[1].split(/\s+/u))
    .filter(className => className && !className.includes('${'));

  assert.ok(sidebarStart >= 0, 'Detail sidebar markup not found');
  for (const className of new Set(sidebarClasses)) {
    assert.ok(detailCss.includes(`.${className}`), `Missing loaded CSS selector for .${className}`);
  }
});

test('Audit 9: Detail style transition rebuilds the selected renderer and migrates runtime state', () => {
  assert.match(runtimeSource, /export function snapshotMockupState\(/u);
  assert.match(detailSource, /snapshotMockupState\(viewport\)/u);
  assert.match(detailSource, /viewport\.innerHTML = getArchetypeHTML\(activeArchetype, newSubDesign/u);
  assert.match(detailSource, /hydrateMockup\(viewport, newSubDesign, \{[\s\S]*initialState/u);
  assert.doesNotMatch(detailSource, /applyZeroRebuildThemeSwap/u);
});

test('Audit 9: Peek and Confirm preview viewports carry their selected canonical theme', () => {
  assert.match(peekSource, /id="peek-viewport"[^>]*data-theme="\$\{escapeHtml\(sub\.id\)\}"/u);
  assert.match(dockSource, /id="confirm-preview"[^>]*data-theme="\$\{escapeHtml\(sub\.id\)\}"/u);
});

test('Audit 9: browser metadata advertises the actual 120-style catalog', () => {
  assert.match(htmlSource, /<title>[^<]*120종/u);
  assert.match(htmlSource, /<meta name="description" content="[^"]*120종/u);
  assert.doesNotMatch(htmlSource, /36종/u);
});

test('Audit 9: checkout distinguishes direct and cart orders and opens a real dialog', () => {
  assert.match(templatesSource, /data-checkout-source="direct"/u);
  assert.match(templatesSource, /data-checkout-source="cart"[^>]*disabled/u);
  assert.match(runtimeSource, /function openShopCheckoutDialog\(/u);
  assert.match(runtimeSource, /role="dialog"/u);
  assert.match(runtimeSource, /aria-modal="true"/u);
  assert.doesNotMatch(runtimeSource, /!store\.shop\.cart\.length && store\.shop\.qty <= 0/u);
  const checkoutStart = runtimeSource.indexOf('function openShopCheckoutDialog');
  const checkoutEnd = runtimeSource.indexOf('function handleBlogLike', checkoutStart);
  const checkoutSource = runtimeSource.slice(checkoutStart, checkoutEnd);
  assert.match(checkoutSource, /event\.stopPropagation\(\)/u);
});

test('Audit 9: simultaneous Split checkout dialogs receive unique accessible title IDs', () => {
  assert.match(runtimeSource, /checkoutDialogSequence/u);
  assert.match(runtimeSource, /id="\$\{checkoutTitleId\}"/u);
  assert.match(runtimeSource, /aria-labelledby="\$\{checkoutTitleId\}"/u);
  assert.doesNotMatch(runtimeSource, /id="mock-checkout-title"/u);
});

test('Audit 9: Blog reading mode changes computed colors and exposes pressed state', () => {
  assert.match(templatesSource, /data-action="blog-reading-mode"[^>]*aria-pressed="false"/u);
  assert.match(detailCss, /\.archetype-blog\.blog-light-mode\s*\{/u);
  assert.match(detailCss, /\.archetype-blog\.blog-light-mode[\s\S]*background:/u);
  assert.match(detailCss, /\.archetype-blog\.blog-light-mode[\s\S]*color:/u);
});

test('Audit 9: Blog progress resolves the responsive scroll owner and updates ARIA', () => {
  assert.match(runtimeSource, /function resolveBlogScrollOwner\(/u);
  assert.match(runtimeSource, /closest\('\.modal-body-grid'\)/u);
  assert.match(runtimeSource, /setAttribute\('aria-valuenow'/u);
  assert.match(templatesSource, /role="progressbar"/u);
});

test('Audit 9: actual Chrome gate drives Blog progress from 0 to 100 at all required widths', () => {
  assert.match(catalog120ChromeQaSource, /BLOG_PROGRESS_WIDTHS = Object\.freeze\(\[375, 768, 1024\]\)/u);
  assert.match(catalog120ChromeQaSource, /responsiveProgress/u);
  assert.match(catalog120ChromeQaSource, /startProgress/u);
  assert.match(catalog120ChromeQaSource, /endProgress/u);
});

test('Audit 9: lazy Detail owns focus trap, Escape, restoration, and fatal bootstrap recovery', () => {
  assert.match(mainSource, /lazyFocusCleanup/u);
  assert.match(mainSource, /event\.key === 'Escape'/u);
  assert.match(mainSource, /lazyOpener/u);
  assert.match(mainSource, /renderFatalBootstrapError/u);
  assert.match(mainSource, /recovery\.retry/u);
  assert.match(detailSource, /lastFocusedSubId/u);
  assert.match(detailSource, /galleryFocusId/u);
});

test('Audit 9: Game role-button keyboard and Detail Escape are not blocked by form focus', () => {
  assert.match(runtimeSource, /\(e\.key === 'Enter' \|\| e\.key === ' '\)/u);
  assert.match(runtimeSource, /\[role="button"\]/u);
  const escapeIndex = detailSource.indexOf("if (e.key === 'Escape')");
  const formGuardIndex = detailSource.indexOf("tag === 'INPUT'");
  assert.ok(escapeIndex >= 0 && formGuardIndex >= 0 && escapeIndex < formGuardIndex);
});

test('Audit 9: malformed public state is rejected without replacing the current valid state', () => {
  const before = appState.getState();
  appState.setState({
    currentView: '__BAD_VIEW__',
    activeArchetype: '__bad_archetype__',
    sandboxDevice: '__bad_device__',
    compareSubIds: ['__bad_style__']
  });
  const after = appState.getState();
  assert.equal(after.currentView, before.currentView);
  assert.equal(after.activeArchetype, before.activeArchetype);
  assert.equal(after.sandboxDevice, before.sandboxDevice);
  assert.deepEqual(after.compareSubIds, before.compareSubIds);
  assert.match(stateSource, /STATE_ENUM_INVALID/u);
});

test('Audit 9: Clipboard fallback returns false when execCommand returns false or throws', async () => {
  assert.equal(typeof clipboardModule.copyTextWithFallback, 'function');
  const body = {
    appendChild(node) { node.isConnected = true; },
    removeChild(node) { node.isConnected = false; }
  };
  const makeDocument = execCommand => ({
    activeElement: { focus() {} },
    body,
    createElement() {
      return { style: {}, value: '', select() {}, setSelectionRange() {}, isConnected: false };
    },
    execCommand
  });

  const falseResult = await clipboardModule.copyTextWithFallback('x', {
    clipboard: { writeText: async () => { throw new Error('denied'); } },
    documentRef: makeDocument(() => false)
  });
  assert.equal(falseResult, false);

  const throwResult = await clipboardModule.copyTextWithFallback('x', {
    clipboard: null,
    documentRef: makeDocument(() => { throw new Error('copy failed'); })
  });
  assert.equal(throwResult, false);
});

test('Audit 9: AudioContext resume failure cannot start BGM or report playing', async () => {
  assert.equal(typeof audioModule.SynthAudioEngine, 'function');
  const engine = new audioModule.SynthAudioEngine();
  engine.init = async () => true;
  engine.ctx = {
    state: 'suspended',
    resume: async () => { throw new Error('resume denied'); }
  };
  engine.sfxGain = {};
  let schedulerStarted = false;
  engine.startScheduler = () => { schedulerStarted = true; };

  const bgmResult = await engine.playBgm();
  assert.equal(bgmResult, false);
  assert.equal(engine.isPlaying, false);
  assert.equal(schedulerStarted, false);
  assert.equal(await engine.playSfx('CLICK'), false);
  assert.match(audioSource, /await this\.ensureAudioContext\(\)/u);
});

test('Audit 9 rework: volume chosen before AudioContext creation seeds the master gain', async () => {
  const previousVolume = appState.getState().audio.volume;
  const previousWindow = globalThis.window;
  const gainNodes = [];
  const makeParam = () => ({
    values: [],
    setValueAtTime(value, time) { this.values.push([value, time]); }
  });

  class FakeAudioContext {
    constructor() {
      this.currentTime = 0;
      this.destination = {};
      this.state = 'running';
    }
    createGain() {
      const node = { gain: makeParam(), connect() {} };
      gainNodes.push(node);
      return node;
    }
    createBiquadFilter() {
      return { frequency: makeParam(), Q: makeParam(), connect() {} };
    }
    createDelay() {
      return { delayTime: makeParam(), connect() {} };
    }
    createAnalyser() {
      return { fftSize: 0, connect() {} };
    }
  }

  try {
    globalThis.window = { AudioContext: FakeAudioContext };
    const engine = new audioModule.SynthAudioEngine();
    engine.setVolume(0);

    assert.equal(appState.getState().audio.volume, 0);
    assert.equal(await engine.init(), true);
    assert.equal(gainNodes[0].gain.values.at(-1)[0], 0);
  } finally {
    appState.setState({ audio: { volume: previousVolume } });
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});

test('Audit 9: SFX synthesis failures resolve false instead of rejecting', async () => {
  const engine = new audioModule.SynthAudioEngine();
  engine.init = async () => true;
  engine.ctx = { state: 'running', currentTime: 0 };
  engine.sfxGain = {};
  engine.playOscSweep = () => { throw new Error('synthesis failed'); };

  assert.equal(await engine.playSfx('CLICK'), false);
});

test('Audit 9: Audio visualizer rAF is lifecycle-, modal-, visibility-, and reduced-motion-owned', () => {
  assert.match(audioWidgetSource, /visualizerRafId/u);
  assert.match(audioWidgetSource, /cancelAnimationFrame/u);
  assert.match(audioWidgetSource, /prefers-reduced-motion/u);
  assert.match(audioWidgetSource, /document\.visibilityState/u);
  assert.match(audioWidgetSource, /state\.currentView === 'MAIN'/u);
  assert.match(audioWidgetSource, /unsubscribe\(\)/u);
  assert.match(audioWidgetSource, /audio-widget-status/u);
});

test('Audit 9: comment/chat input and migrated dynamic histories are explicitly bounded', () => {
  assert.match(templatesSource, /id="blog-comment-input"[^>]*maxlength="500"/u);
  assert.match(templatesSource, /id="chat-msg-input"[^>]*maxlength="500"/u);
  assert.match(templatesSource, /id="blog-comment-status"[^>]*role="status"/u);
  assert.match(templatesSource, /id="chat-message-status"[^>]*role="status"/u);
  assert.match(runtimeSource, /MAX_RUNTIME_INPUT_LENGTH = 500/u);
  assert.match(runtimeSource, /MAX_RUNTIME_HISTORY = 50/u);
  assert.match(runtimeSource, /slice\(-MAX_RUNTIME_HISTORY\)/u);
  assert.match(runtimeSource, /unitCleanupMap/u);
});

test('Audit 9: pending popstate work is cancelled when the adapter is disposed', () => {
  assert.match(discoveryUrlStateSource, /pendingPopstateTimer/u);
  assert.match(discoveryUrlStateSource, /clearTimeout\(pendingPopstateTimer\)/u);
  assert.match(discoveryUrlStateSource, /disposed/u);
});

test('Audit 9: migrated Dashboard state excludes old renderer row markup', () => {
  assert.match(runtimeSource, /delete snapshot\.dash\.rows/u);
  const hydrateStart = runtimeSource.indexOf('export function hydrateMockup');
  const hydrateEnd = runtimeSource.indexOf('export function observeThumbMotion', hydrateStart);
  const hydrateSource = runtimeSource.slice(hydrateStart, hydrateEnd);
  assert.ok(
    hydrateSource.indexOf('captureDashRows(unit, stateStore)')
      < hydrateSource.indexOf('restoreArchetypeState(unit, stateStore, archetype)')
  );
});

test('Audit 9: transient mockup timers and checkout use bounded runtime ownership', () => {
  assert.equal((runtimeSource.match(/setTimeout\(/gu) || []).length, 1);
  assert.match(runtimeSource, /checkoutCleanupMap/u);
  const checkoutStart = runtimeSource.indexOf('function openShopCheckoutDialog');
  const checkoutEnd = runtimeSource.indexOf('function handleBlogLike', checkoutStart);
  assert.doesNotMatch(runtimeSource.slice(checkoutStart, checkoutEnd), /cleanups\.push/u);
});

test('Audit 9: fatal bootstrap alertdialog keeps Tab focus on its recovery action', () => {
  assert.match(mainSource, /panel\.addEventListener\('keydown'/u);
  assert.match(mainSource, /event\.key !== 'Tab'/u);
});

test('Audit 9: actual-120 performance evidence records named operations and host load', () => {
  assert.match(catalog120ChromeQaSource, /function recordInteraction\(/u);
  assert.match(catalog120ChromeQaSource, /operationSamples/u);
  assert.match(catalog120ChromeQaSource, /function sampleHostLoad\(/u);
  assert.match(catalog120ChromeQaSource, /hostLoad/u);
});

test('Audit 9 rework: performance hard metric stays page-local and separates presentation scheduling', () => {
  const measurementStart = catalog120ChromeQaSource.indexOf('async function measurePageInteraction');
  const measurementEnd = catalog120ChromeQaSource.indexOf('async function pressKey', measurementStart);
  const measurementSource = catalog120ChromeQaSource.slice(measurementStart, measurementEnd);

  assert.match(catalog120ChromeQaSource, /async function measurePageInteraction\(/u);
  assert.match(
    measurementSource,
    /const started = performance\.now\(\)[\s\S]*element\.click\(\)[\s\S]*settled[\s\S]*await nextFrame\(\)[\s\S]*await nextFrame\(\)/u
  );
  assert.match(measurementSource, /processingMs:\s*settledAt - started/u);
  assert.match(measurementSource, /endToEndMs:\s*finished - started/u);
  assert.match(catalog120ChromeQaSource, /const presentationSamples = \[\]/u);
  assert.match(catalog120ChromeQaSource, /presentation:\s*summarizeTimings\(presentationSamples\)/u);
  assert.match(catalog120ChromeQaSource, /metric:\s*'processingMs'/u);
  assert.match(catalog120ChromeQaSource, /sampleSelection:\s*'state-changing named operations; no-ops excluded'/u);
  assert.match(catalog120ChromeQaSource, /check\(report\.interactions\.count >= 5/u);
  assert.match(catalog120ChromeQaSource, /if \(!isActiveMode\)\s*recordInteraction/u);
  assert.match(catalog120ChromeQaSource, /setSearch\('', \{ record: false \}\)/u);
  assert.doesNotMatch(
    catalog120ChromeQaSource,
    /const (?:started|pageStarted|detailStarted|transitionStarted) = await evaluate\('performance\.now\(\)'\)/u
  );
});

test('Audit 9 rework: scalability timings use the same processing/presentation boundary', () => {
  assert.match(scalabilityChromeQaSource, /function summarizeMeasurements\(/u);
  assert.match(scalabilityChromeQaSource, /processingMs/u);
  assert.match(scalabilityChromeQaSource, /presentation:\s*summarizeTimings/u);
  assert.match(scalabilityChromeQaSource, /metric:\s*'processingMs'/u);
  assert.doesNotMatch(
    scalabilityChromeQaSource,
    /summarizeTimings\(timingResults\.map\(result => result\.totalMs\)\)/u
  );
});

test('Audit 9 rework: active Zoom is reapplied after style and archetype renderer rebuilds', () => {
  assert.equal(typeof detailModule.applySelectedZoom, 'function');
  const unit = { style: {} };
  const viewport = {
    querySelector(selector) {
      return selector === '.archetype-unit, .mockup-unit' ? unit : null;
    }
  };
  const root = {
    querySelector(selector) {
      if (selector === '.zoom-btn.active') return { getAttribute: () => '1.2' };
      if (selector === '#mockup-viewport') return viewport;
      return null;
    }
  };

  detailModule.applySelectedZoom(root);
  assert.equal(unit.style.transform, 'scale(1.2)');
  assert.equal(unit.style.transformOrigin, 'center top');

  const archetypeRebuild = detailSource.slice(
    detailSource.indexOf('function rebuildArchetypeViewport'),
    detailSource.indexOf('function applyStatePreservingRendererSwap')
  );
  const styleSwap = detailSource.slice(
    detailSource.indexOf('function applyStatePreservingRendererSwap'),
    detailSource.indexOf('function updateDetailMetadataAndInspector')
  );
  assert.match(archetypeRebuild, /applySelectedZoom\(root\)/u);
  assert.match(styleSwap, /applySelectedZoom\(root\)/u);
});

test('Audit 9: actual-120 browser gate covers cart checkout and Dashboard migration', () => {
  assert.match(catalog120ChromeQaSource, /cartPreservedAfterCancel/u);
  assert.match(catalog120ChromeQaSource, /cartClearedAfterConfirm/u);
  assert.match(catalog120ChromeQaSource, /filterPreserved/u);
  assert.match(catalog120ChromeQaSource, /sortPreserved/u);
});
