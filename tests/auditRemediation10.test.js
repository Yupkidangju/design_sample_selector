import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
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

  assert.match(viteConfig, /base:\s*['"]\/design_sample_selector\/['"]/u);
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
    'scripts/verifyRenderScalabilityChrome.js'
  ]) {
    assert.match(readProjectFile(chromeScript), /\/design_sample_selector\//u, `${chromeScript} production base 누락`);
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
  assert.match(source, /<button[^>]*data-peek-open-detail[^>]*>상세 보기<\/button>/u);
  assert.match(source, /addEventListener\('dblclick'/u);
  assert.match(source, /closest\('\[data-mock-action\], button, a, input, select, textarea'/u);
  assert.match(source, /data-peek-open-detail[^\n]*addEventListener\('click'/u);
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
