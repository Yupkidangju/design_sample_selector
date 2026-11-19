#!/usr/bin/env node
/**
 * GitHub Pages 배포용 dist/ 멀티페이지 산출물 검증 스크립트
 * - dist/index.html, dist/showcase.html, dist/.vite/manifest.json 존재 확인
 * - 참조된 JS/CSS 에셋 실존 확인 및 갤러리/쇼케이스 셸 CSS 격리 검증
 * - 빌드 산출물 내 레거시 오디오 코드 부재 확인
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PROJECT_BASE } from '../project.config.js';

const distDir = resolve('dist');
const errors = [];

for (const rel of ['index.html', 'showcase.html', '.vite/manifest.json']) {
  const full = resolve(distDir, rel);
  if (!existsSync(full)) errors.push(`Missing build artifact: dist/${rel}`);
}

if (errors.length === 0) {
  const manifest = JSON.parse(readFileSync(resolve(distDir, '.vite/manifest.json'), 'utf8'));
  if (!manifest['index.html'] || !manifest['showcase.html']) {
    errors.push('Vite manifest must include both index.html and showcase.html entries.');
  }

  const indexHtml = readFileSync(resolve(distDir, 'index.html'), 'utf8');
  const showcaseHtml = readFileSync(resolve(distDir, 'showcase.html'), 'utf8');

  const extractAssets = html => {
    const matches = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m => m[1]);
    return matches.filter(url => url.startsWith(PROJECT_BASE));
  };

  for (const [page, html] of [['index.html', indexHtml], ['showcase.html', showcaseHtml]]) {
    const assets = extractAssets(html);
    if (assets.length === 0) {
      errors.push(`${page} references no built assets under ${PROJECT_BASE}`);
    }
    for (const assetUrl of assets) {
      const relPath = assetUrl.slice(PROJECT_BASE.length);
      const diskPath = resolve(distDir, relPath);
      if (!existsSync(diskPath)) {
        errors.push(`${page} references missing asset: ${assetUrl}`);
      } else if (relPath.endsWith('.js') || relPath.endsWith('.css')) {
        const body = readFileSync(diskPath, 'utf8');
        if (/\bsynthAudio\b|\baudioWidget\b|\bcompactAudioControls\b|audio-widget-root/.test(body)) {
          errors.push(`Legacy audio symbol leaked into dist/${relPath}`);
        }
      }
    }
  }

  // 갤러리와 쇼케이스 간 셸 CSS 교차 누수 검사
  const mainCss = manifest['index.html']?.css || [];
  const showcaseCss = manifest['showcase.html']?.css || [];
  const mainCombined = mainCss.map(f => readFileSync(resolve(distDir, f), 'utf8')).join('\n');
  const showcaseCombined = showcaseCss.map(f => readFileSync(resolve(distDir, f), 'utf8')).join('\n');

  if (mainCombined.includes('.studio-drawer-sheet')) {
    errors.push('Showcase shell CSS (.studio-drawer-sheet) leaked into index.html CSS bundle');
  }
  if (showcaseCombined.includes('.specimen-grid')) {
    errors.push('Gallery shell CSS (.specimen-grid) leaked into showcase.html CSS bundle');
  }
}

if (errors.length > 0) {
  console.error('❌ Pages artifact verification failed:');
  for (const err of errors) console.error(' -', err);
  process.exit(1);
}

console.log('✅ Verified dist/ multi-page Pages artifact, asset closure, CSS isolation, and zero audio symbols.');
