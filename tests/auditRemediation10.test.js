import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import { createRetryableModuleLoader } from '../src/components/lazyPreviewLoader.js';
import { createPreviewRegistry } from '../src/preview/registry.js';

function readProjectFile(path) {
  try {
    return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
  } catch {
    return '';
  }
}

test('Audit 10: GitHub Pages는 project base의 검증된 dist artifact만 배포한다', () => {
  const viteConfig = readProjectFile('vite.config.js');
  const packageJson = JSON.parse(readProjectFile('package.json'));
  const workflow = readProjectFile('.github/workflows/deploy-pages.yml');

  assert.match(viteConfig, /base:\s*PROJECT_BASE/u);
  assert.match(viteConfig, /manifest:\s*true/u);
  assert.equal(packageJson.scripts['verify:pages-artifact'], 'node scripts/verifyPagesArtifact.js');
  assert.equal(packageJson.scripts['qa:pages:chrome'], 'node scripts/verifyPagesRecoveryChrome.js');
  assert.match(workflow, /run:\s*npm ci/u);
  assert.match(workflow, /run:\s*npm run check/u);
  assert.match(workflow, /actions\/upload-pages-artifact@/u);
  assert.match(workflow, /path:\s*\.\/dist/u);
  assert.match(workflow, /actions\/deploy-pages@/u);
  for (const chromeScript of [
    'scripts/verifyWave1Chrome.js',
    'scripts/verifyCatalogDiscoveryChrome.js',
    'scripts/verifyCatalog120Chrome.js',
    'scripts/verifyRenderScalabilityChrome.js',
    'scripts/verifyI18nInspectorChrome.js'
  ]) {
    assert.match(readProjectFile(chromeScript), /PROJECT_BASE/u, `${chromeScript} canonical base 누락`);
  }
});

test('Audit 10: Pages artifact verifier는 dynamic/CSS closure 누락을 차단하고 release manifest를 쓴다', async t => {
  const { verifyPagesArtifact } = await import('../scripts/verifyPagesArtifact.js');
  const root = mkdtempSync(join(tmpdir(), 'dss-pages-artifact-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, '.vite'), { recursive: true });
  mkdirSync(join(root, 'assets'), { recursive: true });
  writeFileSync(join(root, 'index.html'), '<script type="module" src="/design_sample_selector/assets/index.js"></script>\n');
  writeFileSync(join(root, 'assets/index.js'), 'import("./detail.js");\n');
  writeFileSync(join(root, 'assets/styles.css'), '.ok { color: green; }\n');
  writeFileSync(join(root, '.vite/manifest.json'), JSON.stringify({
    'index.html': {
      file: 'assets/index.js',
      isEntry: true,
      dynamicImports: ['src/detail.js'],
      css: ['assets/styles.css']
    },
    'src/detail.js': { file: 'assets/detail.js', isDynamicEntry: true }
  }));

  const missing = verifyPagesArtifact({ distDirectory: root, releaseSha: 'audit10', writeManifest: false });
  assert.equal(missing.passed, false);
  assert.match(missing.issues.join('\n'), /assets\/detail\.js/u);

  writeFileSync(join(root, 'assets/detail.js'), 'export const detail = true;\n');
  const complete = verifyPagesArtifact({ distDirectory: root, releaseSha: 'audit10', writeManifest: true });
  assert.equal(complete.passed, true);
  const release = JSON.parse(readFileSync(join(root, 'release-manifest.json'), 'utf8'));
  assert.equal(release.releaseSha, 'audit10');
  assert.equal(release.base, '/design_sample_selector/');
  assert.ok(release.files.some(file => file.path === 'assets/detail.js' && file.sha256));
  const verifiedRelease = verifyPagesArtifact({
    distDirectory: root,
    releaseSha: 'audit10',
    writeManifest: false,
    requireReleaseManifest: true
  });
  assert.equal(verifiedRelease.passed, true, verifiedRelease.issues.join('\n'));

  // Negative tests for requireReleaseManifest (FIN-F001)
  // 1. Missing manifest
  rmSync(join(root, 'release-manifest.json'));
  const missingManifest = verifyPagesArtifact({ distDirectory: root, releaseSha: 'audit10', requireReleaseManifest: true });
  assert.equal(missingManifest.passed, false);
  assert.match(missingManifest.issues.join('\n'), /release-manifest\.json/u);

  // 2. Malformed JSON
  writeFileSync(join(root, 'release-manifest.json'), '{ invalid json');
  const malformedManifest = verifyPagesArtifact({ distDirectory: root, releaseSha: 'audit10', requireReleaseManifest: true });
  assert.equal(malformedManifest.passed, false);
  assert.match(malformedManifest.issues.join('\n'), /손상/u);

  // 3. SHA mismatch
  writeFileSync(join(root, 'release-manifest.json'), JSON.stringify({ ...release, releaseSha: 'tampered-sha' }));
  const shaMismatch = verifyPagesArtifact({ distDirectory: root, releaseSha: 'audit10', requireReleaseManifest: true });
  assert.equal(shaMismatch.passed, false);
  assert.match(shaMismatch.issues.join('\n'), /release manifest SHA가/u);

  // 4. Base mismatch
  writeFileSync(join(root, 'release-manifest.json'), JSON.stringify({ ...release, base: '/wrong-base/' }));
  const baseMismatch = verifyPagesArtifact({ distDirectory: root, releaseSha: 'audit10', requireReleaseManifest: true });
  assert.equal(baseMismatch.passed, false);
  assert.match(baseMismatch.issues.join('\n'), /release manifest base가/u);

  // 5. File hash mismatch (file tampered)
  writeFileSync(join(root, 'release-manifest.json'), JSON.stringify({ ...release, files: [] }));
  const fileMismatch = verifyPagesArtifact({ distDirectory: root, releaseSha: 'audit10', requireReleaseManifest: true });
  assert.equal(fileMismatch.passed, false);
  assert.match(fileMismatch.issues.join('\n'), /file hash closure가/u);
});

test('Audit 10: module loader는 primary와 retry 실패 뒤 terminal이 되어 추가 import를 만들지 않는다', async () => {
  const calls = [];
  const loader = createRetryableModuleLoader([
    () => {
      calls.push('primary');
      return Promise.reject(new Error('primary failed'));
    },
    () => {
      calls.push('retry-1');
      return Promise.reject(new Error('shared graph failed'));
    }
  ], { resourceClass: 'component-graph' });

  await assert.rejects(loader.load(), error => (
    error.code === 'RECOVERY_IMPORT_FAILED'
    && error.phase === 'import'
    && error.attempt === 1
    && error.terminal === false
  ));
  assert.equal(loader.getStatus().canRetry, true);

  await assert.rejects(loader.load(), error => (
    error.code === 'RECOVERY_IMPORT_FAILED'
    && error.attempt === 2
    && error.terminal === true
    && error.resourceClass === 'component-graph'
  ));
  await assert.rejects(loader.load(), error => error.terminal === true);
  assert.deepEqual(calls, ['primary', 'retry-1']);
  assert.equal(loader.getStatus().status, 'terminal');
});

test('Audit 10: recovery diagnostic은 안전한 필드만 최대 20개 보존한다', async () => {
  const diagnostics = await import('../src/utils/recoveryDiagnostics.js');
  diagnostics.clearRecoveryDiagnostics();
  for (let index = 0; index < 24; index += 1) {
    diagnostics.recordRecoveryDiagnostic({
      code: 'RECOVERY_IMPORT_FAILED',
      phase: 'import',
      attempt: index + 1,
      resourceClass: 'component-graph',
      terminal: index > 1,
      url: 'https://example.test/?token=secret',
      stack: 'sensitive stack'
    });
  }
  const records = diagnostics.getRecoveryDiagnostics();
  assert.equal(records.length, 20);
  assert.deepEqual(Object.keys(records[0]), [
    'code', 'phase', 'attempt', 'resourceClass', 'terminal'
  ]);
  assert.equal(records.at(-1).attempt, 24);
});

test('Audit 10: Peek는 native 상세 보기와 실제 double click을 같은 Detail 경로에 연결한다', () => {
  const source = readProjectFile('src/components/peekPreview.js');
  assert.match(source, /openDetailFor/u);
  assert.match(source, /data-peek-open-detail>\$\{escapeHtml\(t\('peek\.details'\)\)\}<\/button>/u);
  assert.match(source, /addEventListener\('dblclick'/u);
  assert.match(source, /closest\('\[data-mock-action\], button, a, input, select, textarea'/u);
  assert.match(source, /data-peek-open-detail[\s\S]*?addEventListener\('click'/u);
});

test('Audit 10: AppState initial subscriber 실패는 listener를 rollback한다', async () => {
  const { AppStateManager } = await import('../src/state/appState.js');
  assert.equal(typeof AppStateManager, 'function');
  const manager = new AppStateManager();
  let calls = 0;
  assert.throws(() => manager.subscribe(() => {
    calls += 1;
    throw new Error('initial mount failed');
  }), /initial mount failed/u);
  manager.setState({ viewMode: 'BENTO' });
  assert.equal(calls, 1);
});

test('Audit 10: corrupt·oversize localStorage는 제거하고 bookmark 총량을 actual 120으로 제한한다', async () => {
  const stateModule = await import('../src/state/appState.js');
  const removed = [];
  const storage = {
    values: new Map([
      ['corrupt', '{bad json'],
      ['oversize', 'x'.repeat(stateModule.STORAGE_VALUE_MAX_CHARS + 1)],
      ['valid', '["swiss-grid"]']
    ]),
    getItem(key) { return this.values.get(key) ?? null; },
    removeItem(key) { removed.push(key); this.values.delete(key); }
  };

  assert.deepEqual(stateModule.readStoredJSON(storage, 'valid', []), ['swiss-grid']);
  assert.deepEqual(stateModule.readStoredJSON(storage, 'corrupt', []), []);
  assert.deepEqual(stateModule.readStoredJSON(storage, 'oversize', []), []);
  assert.deepEqual(removed, ['corrupt', 'oversize']);
  assert.equal(stateModule.MAX_STORED_BOOKMARKS, 120);
});

test('Audit 10: renderer registry는 executable HTML sink를 거부한다', () => {
  const motion = {
    id: 'safe-motion',
    unitClass: 'motion-safe-motion',
    effectClass: 'fx-safe-motion',
    effectLayer: false,
    channels: ['unit-class'],
    reducedMotionPolicy: 'suppress',
    assetPaths: []
  };
  const design = { preview: { motionId: 'safe-motion' } };
  for (const unsafe of [
    '<div class="mockup-unit"><script>alert(1)</script></div>',
    '<div class="mockup-unit" onclick="alert(1)">bad</div>',
    '<div class="mockup-unit"><a href="javascript:alert(1)">bad</a></div>'
  ]) {
    const registry = createPreviewRegistry({
      renderers: [{
        id: 'unsafe-renderer', aliases: [], tabs: ['hero'], assetPaths: [],
        render: () => unsafe
      }],
      thumbnails: [],
      motions: [motion]
    });
    assert.throws(
      () => registry.renderPreviewComponent({ rendererId: 'unsafe-renderer', tab: 'hero', design }),
      error => error.code === 'PREVIEW_RENDER_OUTPUT_INVALID'
    );
  }
});

test('Audit 10: Detail mount와 consumer error UI는 rollback disposer와 terminal 상태를 가진다', () => {
  const mainSource = readProjectFile('src/main.js');
  const detailSource = readProjectFile('src/components/detailView.js');
  const peekSource = readProjectFile('src/components/peekPreview.js');
  const dockSource = readProjectFile('src/components/selectionDock.js');

  assert.match(detailSource, /return cleanupDetailView/u);
  assert.match(detailSource, /catch \(error\) \{\s*cleanupDetailView\(\);\s*throw error;/su);
  assert.match(mainSource, /detailDispose\s*=\s*detailModule\.renderDetailView/u);
  assert.match(mainSource, /data-lazy-detail-reload/u);
  assert.match(peekSource, /data-peek-preview-reload/u);
  assert.match(dockSource, /data-confirm-preview-reload/u);
});

test('Audit 12 (FIN-F002, FIN-F004): Detail CTA buttons handle Space/Enter independently and meet 44px target', () => {
  const mainViewSource = readProjectFile('src/components/mainView.js');
  const interactiveCss = readProjectFile('src/styles/interactive.css');

  // FIN-F002: CTA keydown handler and stopPropagation
  assert.match(mainViewSource, /\.tile-detail-btn,\s*\.bento-open-cta,\s*\.spec-cta/u);
  assert.match(mainViewSource, /e\.key === 'Enter' \|\| e\.key === ' '/u);
  assert.match(mainViewSource, /e\.preventDefault\(\);\s*e\.stopPropagation\(\);\s*const catId = btn\.getAttribute\('data-cat-id'\)/u);

  // FIN-F002: onGalleryKey early return when activeElement is interactive
  assert.match(mainViewSource, /active\.closest\?\.?\('\.tile-detail-btn,\s*\.bento-open-cta/u);

  // FIN-F004: 44px min dimension
  assert.match(interactiveCss, /min-height:\s*44px;\s*min-width:\s*44px;/u);
});

test('Audit 14 (FIN-F006): AppState enforces immutable snapshots across all collections and prevents mutation leaks', async () => {
  const stateModule = await import('../src/state/appState.js');
  const purged = [];
  const storage = {
    values: new Map([
      ['shape-invalid-object', '{"shouldBeArray": true}'],
      ['shape-invalid-number', '12345'],
      ['valid-array', '["swiss-grid"]']
    ]),
    getItem(key) { return this.values.get(key) ?? null; },
    removeItem(key) { purged.push(key); this.values.delete(key); }
  };

  assert.deepEqual(stateModule.readStoredJSON(storage, 'valid-array', []), ['swiss-grid']);
  assert.deepEqual(stateModule.readStoredJSON(storage, 'shape-invalid-object', []), []);
  assert.deepEqual(stateModule.readStoredJSON(storage, 'shape-invalid-number', []), []);
  assert.deepEqual(purged, ['shape-invalid-object', 'shape-invalid-number']);

  const manager = new stateModule.AppStateManager();
  const snap = manager.getState();
  assert.ok(Object.isFrozen(snap), 'getState() returns frozen snapshot');
  assert.ok(Object.isFrozen(snap.audio), 'snap.audio is frozen');
  assert.ok(Object.isFrozen(snap.liveTweaks), 'snap.liveTweaks is frozen');
  assert.ok(Object.isFrozen(snap.activeFacets), 'snap.activeFacets is frozen');
  assert.ok(Object.isFrozen(snap.bookmarks), 'snap.bookmarks is frozen');
  assert.ok(Object.isFrozen(snap.compareSubIds), 'snap.compareSubIds is frozen');
  assert.ok(Object.isFrozen(snap.recentlyViewed), 'snap.recentlyViewed is frozen');

  // Negative probe: direct mutation on snapshot arrays does not affect internal state
  try { snap.bookmarks.push('injected-bookmark'); } catch { /* strict mode throws TypeError */ }
  try { snap.compareSubIds[0] = 'injected-compare'; } catch { /* strict mode throws TypeError */ }
  try { snap.recentlyViewed.push('injected-recent'); } catch { /* strict mode throws TypeError */ }

  assert.deepEqual(manager.getState().bookmarks, [], 'internal bookmarks unchanged');
  assert.deepEqual(manager.getState().compareSubIds, ['swiss-grid', 'neo-brutalism'], 'internal compareSubIds unchanged');
  assert.deepEqual(manager.getState().recentlyViewed, [], 'internal recentlyViewed unchanged');

  // Bounded and normalized query
  const longQuery = 'a'.repeat(200);
  manager.setState({ searchQuery: longQuery });
  assert.equal(manager.getState().searchQuery.length, 120);

  // Sanitized facets
  manager.setState({ activeFacets: { unknownKey: ['invalidValue'] } });
  assert.deepEqual(manager.getState().activeFacets, {});
});

test('Audit 14 (FIN-F007): Web Audio startScheduler failure returns false and rolls back engine, AppState, and timer', async () => {
  const synthModule = await import('../src/audio/synthAudio.js');
  const stateModule = await import('../src/state/appState.js');
  const synthSource = readProjectFile('src/audio/synthAudio.js');

  assert.match(synthSource, /teardown\(\)\s*\{/u);
  assert.match(synthSource, /this\.ctx\.close\(\)/u);
  assert.match(synthSource, /Scheduler tick failed, rolling back playback state/u);
  assert.match(synthSource, /Scheduler start failed, rolling back playback state/u);

  // Failure simulation on scheduler start
  const mockSynth = new synthModule.SynthAudioEngine();
  mockSynth.ensureAudioContext = async () => true;
  mockSynth.tickStep = () => { throw new Error('simulated tick failure'); };

  const playResult = await mockSynth.playBgm();
  assert.equal(playResult, false, 'playBgm() returns false on scheduler start failure');
  assert.equal(mockSynth.isPlaying, false, 'mockSynth.isPlaying rolled back to false');
  assert.equal(mockSynth.timerId, null, 'mockSynth.timerId remains null');
  assert.equal(stateModule.appState.getState().audio.isPlaying, false, 'appState.audio.isPlaying rolled back to false');
});

test('Audit 14 (FIN-F008): safePath and listFiles fail-closed on symlinks, traversal, and non-regular entries', async () => {
  const verifierModule = await import('../scripts/verifyPagesArtifact.js');
  const projectRoot = fileURLToPath(new URL('..', import.meta.url));

  // Traversal rejected
  assert.equal(verifierModule.safePath(projectRoot, '../secret.txt'), null);
  assert.equal(verifierModule.safePath(projectRoot, '../../etc/passwd'), null);

  // Absolute path rejected
  assert.equal(verifierModule.safePath(projectRoot, '/etc/passwd'), null);

  // Nonexistent file rejected
  assert.equal(verifierModule.safePath(projectRoot, 'does-not-exist.txt'), null);

  // Valid project file allowed
  assert.ok(verifierModule.safePath(projectRoot, 'package.json'));

  // Real symlink fixture test
  const tempDir = mkdtempSync(join(tmpdir(), 'artifact-symlink-test-'));
  try {
    const indexPath = join(tempDir, 'index.html');
    const manifestDir = join(tempDir, '.vite');
    mkdirSync(manifestDir, { recursive: true });
    writeFileSync(indexPath, '<script type="module" src="/design_sample_selector/assets/index.js"></script>');
    writeFileSync(join(manifestDir, 'manifest.json'), JSON.stringify({
      'index.html': { file: 'assets/index.js', isEntry: true }
    }));
    mkdirSync(join(tempDir, 'assets'), { recursive: true });
    writeFileSync(join(tempDir, 'assets/index.js'), 'console.log("ok");');

    // Create unreferenced symlink
    const symlinkPath = join(tempDir, 'leak.txt');
    symlinkSync(indexPath, symlinkPath);

    const issues = [];
    const files = verifierModule.listFiles(tempDir, tempDir, issues);
    assert.equal(files.includes('leak.txt'), false, 'symlink not included in files list');
    assert.ok(issues.some(i => i.includes('symlink')), 'symlink recorded as issue');

    const verifyResult = verifierModule.verifyPagesArtifact({
      distDirectory: tempDir,
      projectRoot
    });
    assert.equal(verifyResult.passed, false, 'verifier fails-closed on unreferenced symlink');
    assert.ok(verifyResult.issues.some(i => i.includes('symlink')), 'verifyPagesArtifact reports symlink issue');
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test('Audit 15 (A15-F001): AppStateManager provides isolated instances and immutable snapshots to subscribers', async () => {
  const stateModule = await import('../src/state/appState.js');

  const m1 = new stateModule.AppStateManager();
  const m2 = new stateModule.AppStateManager();

  let subCurrentSnap = null;
  let subPrevSnap = null;

  m1.subscribe((current, prev) => {
    subCurrentSnap = current;
    subPrevSnap = prev;
  });

  // Initial call delivers frozen snapshots
  assert.ok(Object.isFrozen(subCurrentSnap), 'subCurrentSnap is frozen');
  assert.ok(Object.isFrozen(subCurrentSnap.bookmarks), 'subCurrentSnap.bookmarks is frozen');
  assert.ok(Object.isFrozen(subPrevSnap), 'subPrevSnap is frozen');
  assert.ok(Object.isFrozen(subPrevSnap.bookmarks), 'subPrevSnap.bookmarks is frozen');

  // Attempt to mutate inside subscriber
  try { subCurrentSnap.bookmarks.push('injected-bookmark'); } catch { /* strict mode TypeError */ }
  try { subPrevSnap.bookmarks.push('injected-prev-bookmark'); } catch { /* strict mode TypeError */ }

  assert.deepEqual(m1.getState().bookmarks, [], 'm1 bookmarks unaffected by subscriber mutation');

  // Notify deliveries are also frozen
  m1.setState({ searchQuery: 'test' });
  assert.ok(Object.isFrozen(subCurrentSnap.bookmarks), 'notify current bookmarks is frozen');
  assert.ok(Object.isFrozen(subPrevSnap.bookmarks), 'notify prev bookmarks is frozen');

  // Instance isolation: mutating m1 does not contaminate m2 or DEFAULT_STATE
  m1.setState({ bookmarks: ['swiss-grid'] });
  assert.deepEqual(m1.getState().bookmarks, ['swiss-grid']);
  assert.deepEqual(m2.getState().bookmarks, [], 'm2 bookmarks remain isolated and empty');

  // Structural sharing: updating an unrelated field preserves collection references
  const prevBookmarksRef = m1.getState().bookmarks;
  const prevCompareRef = m1.getState().compareSubIds;
  const prevFacetsRef = m1.getState().activeFacets;
  const prevAudioRef = m1.getState().audio;
  const prevTweaksRef = m1.getState().liveTweaks;

  m1.setState({ galleryFocusId: 'swiss-grid' });

  assert.equal(m1.getState().bookmarks, prevBookmarksRef, 'bookmarks reference preserved across unrelated setState');
  assert.equal(m1.getState().compareSubIds, prevCompareRef, 'compareSubIds reference preserved across unrelated setState');
  assert.equal(m1.getState().activeFacets, prevFacetsRef, 'activeFacets reference preserved across unrelated setState');
  assert.equal(m1.getState().audio, prevAudioRef, 'audio reference preserved across unrelated setState');
  assert.equal(m1.getState().liveTweaks, prevTweaksRef, 'liveTweaks reference preserved across unrelated setState');
});

test('Audit 15 (A15-F003): Audio teardown handles both sync throw and async rejection without unhandledRejection', async () => {
  const synthModule = await import('../src/audio/synthAudio.js');

  // 1. Synchronous throw in ctx.close()
  const synthSync = new synthModule.SynthAudioEngine();
  synthSync.ctx = {
    close() { throw new Error('sync close failure'); }
  };
  assert.doesNotThrow(() => synthSync.teardown());
  assert.equal(synthSync.ctx, null);

  // 2. Asynchronous Promise rejection in ctx.close()
  const synthAsync = new synthModule.SynthAudioEngine();
  let unhandledError = null;
  const onUnhandled = (err) => { unhandledError = err; };
  process.on('unhandledRejection', onUnhandled);

  synthAsync.ctx = {
    close() { return Promise.reject(new Error('async close failure')); }
  };

  assert.doesNotThrow(() => synthAsync.teardown());
  assert.equal(synthAsync.ctx, null);

  // Wait a tick for any unhandled rejection to dispatch
  await new Promise(resolve => setTimeout(resolve, 20));
  process.off('unhandledRejection', onUnhandled);
  assert.equal(unhandledError, null, 'no unhandledRejection occurred on teardown');
});
