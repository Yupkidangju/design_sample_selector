#!/usr/bin/env node

import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

import { RENDER_SCALABILITY_BUDGETS } from '../src/scalability/renderWindow.js';

const PROJECT_ROOT = fileURLToPath(new URL('..', import.meta.url));

function getAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'iu'));
  return match?.[2] || '';
}

function collectInitialReferences(html) {
  const references = [];

  for (const match of html.matchAll(/<script\b[^>]*>/giu)) {
    const tag = match[0];
    if (getAttribute(tag, 'type').toLocaleLowerCase('en') !== 'module') continue;
    const source = getAttribute(tag, 'src');
    if (source) references.push({ type: 'javascript', relation: 'module', source });
  }

  for (const match of html.matchAll(/<link\b[^>]*>/giu)) {
    const tag = match[0];
    const relationships = getAttribute(tag, 'rel')
      .toLocaleLowerCase('en')
      .split(/\s+/u);
    const source = getAttribute(tag, 'href');
    if (!source) continue;
    if (relationships.includes('modulepreload')) {
      references.push({ type: 'javascript', relation: 'modulepreload', source });
    } else if (relationships.includes('stylesheet')) {
      references.push({ type: 'css', relation: 'stylesheet', source });
    }
  }

  return references;
}

function localAssetPath(distDirectory, source) {
  if (/^(?:[a-z]+:)?\/\//iu.test(source) || source.startsWith('data:')) return null;
  const pathname = decodeURIComponent(source.split(/[?#]/u, 1)[0]);
  const assetPath = resolve(distDirectory, pathname.replace(/^\/+/, ''));
  const relativePath = relative(distDirectory, assetPath);
  if (relativePath === '..' || relativePath.startsWith(`..${sep}`)) return null;
  return assetPath;
}

function summarize(assets, type, budgetBytes) {
  const matching = assets.filter(asset => asset.type === type);
  const rawBytes = matching.reduce((total, asset) => total + asset.rawBytes, 0);
  const gzipBytes = matching.reduce((total, asset) => total + asset.gzipBytes, 0);
  return Object.freeze({
    assetCount: matching.length,
    rawBytes,
    gzipBytes,
    budgetBytes,
    withinBudget: gzipBytes <= budgetBytes
  });
}

export function analyzeInitialBundle(options = {}) {
  const distDirectory = resolve(options.distDirectory || resolve(PROJECT_ROOT, 'dist'));
  const indexPath = resolve(distDirectory, 'index.html');
  const budgets = options.budgets || RENDER_SCALABILITY_BUDGETS;
  const issues = [];
  const assets = [];

  if (!existsSync(indexPath)) {
    return Object.freeze({
      checkedAt: new Date().toISOString(),
      distDirectory,
      indexPath,
      assets: Object.freeze([]),
      javascript: summarize([], 'javascript', budgets.initialJavaScriptGzipBytes),
      css: summarize([], 'css', budgets.initialCssGzipBytes),
      issues: Object.freeze([`index.html을 찾을 수 없습니다: ${indexPath}`]),
      passed: false
    });
  }

  const html = readFileSync(indexPath, 'utf8');
  const seen = new Set();
  for (const reference of collectInitialReferences(html)) {
    const assetPath = localAssetPath(distDirectory, reference.source);
    if (!assetPath) {
      issues.push(`초기 asset은 dist 내부 파일이어야 합니다: ${reference.source}`);
      continue;
    }

    const key = `${reference.type}\u0000${assetPath}`;
    if (seen.has(key)) continue;
    seen.add(key);

    if (!existsSync(assetPath) || !statSync(assetPath).isFile()) {
      issues.push(`초기 asset을 찾을 수 없습니다: ${reference.source}`);
      continue;
    }

    const content = readFileSync(assetPath);
    assets.push(Object.freeze({
      type: reference.type,
      relation: reference.relation,
      source: reference.source,
      path: relative(distDirectory, assetPath),
      rawBytes: content.length,
      gzipBytes: gzipSync(content).length
    }));
  }

  const javascript = summarize(
    assets,
    'javascript',
    budgets.initialJavaScriptGzipBytes
  );
  const css = summarize(assets, 'css', budgets.initialCssGzipBytes);
  if (javascript.assetCount === 0) issues.push('초기 module script 또는 modulepreload가 없습니다.');
  if (css.assetCount === 0 && !issues.some(issue => issue.includes('.css'))) {
    issues.push('초기 stylesheet가 없습니다.');
  }
  if (!javascript.withinBudget) {
    issues.push(`초기 JavaScript gzip ${javascript.gzipBytes}B가 ${javascript.budgetBytes}B 예산을 초과했습니다.`);
  }
  if (!css.withinBudget) {
    issues.push(`초기 CSS gzip ${css.gzipBytes}B가 ${css.budgetBytes}B 예산을 초과했습니다.`);
  }

  return Object.freeze({
    checkedAt: new Date().toISOString(),
    distDirectory,
    indexPath,
    assets: Object.freeze(assets),
    javascript,
    css,
    issues: Object.freeze(issues),
    passed: issues.length === 0
  });
}

function formatKilobytes(bytes) {
  return `${(bytes / 1000).toFixed(2)}kB`;
}

function printReport(report) {
  console.log('초기 bundle 분석');
  for (const asset of report.assets) {
    console.log(`- ${asset.relation}: ${asset.path} · ${formatKilobytes(asset.gzipBytes)} gzip`);
  }
  console.log(`- JavaScript: ${formatKilobytes(report.javascript.gzipBytes)} / ${formatKilobytes(report.javascript.budgetBytes)}`);
  console.log(`- CSS: ${formatKilobytes(report.css.gzipBytes)} / ${formatKilobytes(report.css.budgetBytes)}`);
  console.log(`- 결과: ${report.passed ? 'PASS' : 'FAIL'}`);
  for (const issue of report.issues) console.error(`  · ${issue}`);
}

const isCli = process.argv[1]
  && fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (isCli) {
  const distOption = process.argv.find(argument => argument.startsWith('--dist='));
  const report = analyzeInitialBundle({
    distDirectory: distOption?.slice('--dist='.length)
  });
  if (process.argv.includes('--json')) console.log(JSON.stringify(report, null, 2));
  else printReport(report);
  if (!report.passed) process.exitCode = 1;
}
