import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { gzipSync } from 'node:zlib';

import { analyzeInitialBundle } from '../scripts/analyzeInitialBundle.js';

function createFixture() {
  const root = mkdtempSync(join(tmpdir(), 'dss-bundle-analysis-'));
  const assets = join(root, 'assets');
  mkdirSync(assets);
  writeFileSync(join(assets, 'entry.js'), 'export const entry = "entry";\n');
  writeFileSync(join(assets, 'shared.js'), 'export const shared = "shared";\n');
  writeFileSync(join(assets, 'detail.js'), 'export const detail = "lazy";\n');
  writeFileSync(join(assets, 'styles.css'), '.fixture { color: rebeccapurple; }\n');
  writeFileSync(join(root, 'index.html'), `
    <script type="module" src="./assets/entry.js"></script>
    <link rel="modulepreload" href="./assets/shared.js">
    <link rel="modulepreload" href="./assets/shared.js">
    <link rel="stylesheet" href="./assets/styles.css">
  `);
  return root;
}

test('초기 bundle 분석은 정적 entry/preload/CSS만 중복 없이 gzip 합산한다', t => {
  const root = createFixture();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const report = analyzeInitialBundle({
    distDirectory: root,
    budgets: {
      initialJavaScriptGzipBytes: 100_000,
      initialCssGzipBytes: 100_000
    }
  });

  const expectedJavaScript = gzipSync('export const entry = "entry";\n').length
    + gzipSync('export const shared = "shared";\n').length;
  const expectedCss = gzipSync('.fixture { color: rebeccapurple; }\n').length;

  assert.equal(report.javascript.assetCount, 2);
  assert.equal(report.javascript.gzipBytes, expectedJavaScript);
  assert.equal(report.css.assetCount, 1);
  assert.equal(report.css.gzipBytes, expectedCss);
  assert.equal(report.assets.some(asset => asset.path.endsWith('detail.js')), false);
  assert.deepEqual(report.issues, []);
  assert.equal(report.passed, true);
});

test('초기 bundle 분석은 JS 또는 CSS 예산 초과와 누락 asset을 실패로 보고한다', t => {
  const root = createFixture();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  writeFileSync(join(root, 'index.html'), `
    <script type="module" src="./assets/entry.js"></script>
    <link rel="stylesheet" href="./assets/missing.css">
  `);

  const report = analyzeInitialBundle({
    distDirectory: root,
    budgets: {
      initialJavaScriptGzipBytes: 1,
      initialCssGzipBytes: 1
    }
  });

  assert.equal(report.passed, false);
  assert.equal(report.javascript.withinBudget, false);
  assert.equal(report.css.withinBudget, true);
  assert.match(report.issues.join('\n'), /missing\.css/u);
});

test('초기 bundle 분석은 Pages project base를 release manifest 기준으로 제거한다', t => {
  const root = createFixture();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  writeFileSync(join(root, 'release-manifest.json'), JSON.stringify({ base: '/design_sample_selector/' }));
  writeFileSync(
    join(root, 'index.html'),
    '<script type="module" src="/design_sample_selector/assets/entry.js"></script>'
      + '<link rel="stylesheet" href="/design_sample_selector/assets/styles.css">'
  );
  const report = analyzeInitialBundle({
    distDirectory: root,
    budgets: { initialJavaScriptGzipBytes: 100_000, initialCssGzipBytes: 100_000 }
  });
  assert.equal(report.passed, true, report.issues.join('\n'));
  assert.deepEqual(report.assets.map(asset => asset.path).sort(), ['assets/entry.js', 'assets/styles.css']);
});
