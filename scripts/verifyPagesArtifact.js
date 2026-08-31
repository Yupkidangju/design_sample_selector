#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { extname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJECT_ROOT = fileURLToPath(new URL('..', import.meta.url));
const PAGES_BASE = '/design_sample_selector/';
const MIME_BY_EXTENSION = Object.freeze({
  '.css': 'text/css', '.html': 'text/html', '.js': 'application/javascript',
  '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.txt': 'text/plain', '.woff2': 'font/woff2'
});

function safePath(root, path) {
  if (typeof path !== 'string' || path.length === 0 || path.includes('\\')) return null;
  const target = resolve(root, path);
  const local = relative(root, target);
  return local === '..' || local.startsWith(`..${sep}`) ? null : target;
}

function listFiles(root, directory = root) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return listFiles(root, path);
    return [relative(root, path).split(sep).join('/')];
  });
}

function resolveReleaseSha(projectRoot) {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA;
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: projectRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
  } catch {
    return 'local-unversioned';
  }
}

export function verifyPagesArtifact(options = {}) {
  const distDirectory = resolve(options.distDirectory || resolve(PROJECT_ROOT, 'dist'));
  const releaseSha = options.releaseSha || resolveReleaseSha(PROJECT_ROOT);
  const issues = [];
  const indexPath = resolve(distDirectory, 'index.html');
  const manifestPath = resolve(distDirectory, '.vite/manifest.json');
  if (!existsSync(indexPath)) issues.push('dist/index.html이 없습니다.');
  if (!existsSync(manifestPath)) issues.push('Vite manifest가 없습니다.');

  let manifest = {};
  let html = '';
  try { html = readFileSync(indexPath, 'utf8'); } catch { /* issue recorded above */ }
  try { manifest = JSON.parse(readFileSync(manifestPath, 'utf8')); } catch {
    if (existsSync(manifestPath)) issues.push('Vite manifest JSON이 손상되었습니다.');
  }
  if (html.includes('/src/main.js') || html.includes('./src/main.js')) {
    issues.push('production index가 source main.js를 참조합니다.');
  }

  const entries = Object.entries(manifest);
  const entry = entries.find(([, item]) => item?.isEntry === true);
  if (!entry) issues.push('Vite entry manifest가 없습니다.');
  if (entry && !html.includes(`${PAGES_BASE}${entry[1].file}`)) {
    issues.push(`production entry가 Pages base를 사용하지 않습니다: ${entry[1].file}`);
  }

  const referencedFiles = new Set(['index.html', '.vite/manifest.json']);
  for (const [key, item] of entries) {
    if (!item || typeof item !== 'object') {
      issues.push(`잘못된 manifest item: ${key}`);
      continue;
    }
    for (const dependency of [...(item.imports || []), ...(item.dynamicImports || [])]) {
      if (!Object.prototype.hasOwnProperty.call(manifest, dependency)) {
        issues.push(`manifest dependency가 없습니다: ${key} -> ${dependency}`);
      }
    }
    for (const path of [item.file, ...(item.css || []), ...(item.assets || [])].filter(Boolean)) {
      const target = safePath(distDirectory, path);
      if (!target) issues.push(`dist 밖의 artifact 경로입니다: ${path}`);
      else if (!existsSync(target) || !statSync(target).isFile()) issues.push(`artifact 파일이 없습니다: ${path}`);
      else referencedFiles.add(path);
    }
  }

  const files = existsSync(distDirectory)
    ? listFiles(distDirectory).filter(path => path !== 'release-manifest.json').sort()
    : [];
  const releaseFiles = files.map(path => {
    const content = readFileSync(resolve(distDirectory, path));
    return Object.freeze({
      path,
      size: content.length,
      sha256: createHash('sha256').update(content).digest('hex'),
      mime: MIME_BY_EXTENSION[extname(path).toLowerCase()] || 'application/octet-stream'
    });
  if (options.requireReleaseManifest) {
    const releaseManifestPath = resolve(distDirectory, 'release-manifest.json');
    try {
      const storedRelease = JSON.parse(readFileSync(releaseManifestPath, 'utf8'));
      if (storedRelease.releaseSha !== releaseSha) issues.push('release manifest SHA가 현재 release와 다릅니다.');
      if (storedRelease.base !== PAGES_BASE) issues.push('release manifest base가 Pages 계약과 다릅니다.');
      if (JSON.stringify(storedRelease.files) !== JSON.stringify(releaseFiles)) {
        issues.push('release manifest file hash closure가 현재 dist와 다릅니다.');
      }
    } catch {
      issues.push('release-manifest.json이 없거나 손상되었습니다.');
    }
  }
  });
  const report = {
    releaseSha,
    base: PAGES_BASE,
    entry: entry?.[1]?.file || null,
    referencedFiles: Object.freeze([...referencedFiles].sort()),
    files: Object.freeze(releaseFiles),
    issues: Object.freeze(issues),
    passed: issues.length === 0
  };
  if (options.writeManifest && report.passed) {
    writeFileSync(
      resolve(distDirectory, 'release-manifest.json'),
      `${JSON.stringify(report, null, 2)}\n`,
      'utf8'
    );
  }
  return Object.freeze(report);
}

const isCli = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);
if (isCli) {
  const writeManifest = process.argv.includes('--write-manifest');
  const report = verifyPagesArtifact({ writeManifest, requireReleaseManifest: !writeManifest });
  console.log(`Pages artifact closure: ${report.files.length} files, release ${report.releaseSha}`);
  for (const issue of report.issues) console.error(`- ${issue}`);
  console.log(`결과: ${report.passed ? 'PASS' : 'FAIL'}`);
  if (!report.passed) process.exitCode = 1;
}
