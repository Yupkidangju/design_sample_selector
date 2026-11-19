#!/usr/bin/env node
/**
 * 20종 카탈로그, cssVars 키셋 일관성, WCAG AA 명암비(4.5:1), 도메인 렌더,
 * 영문 프롬프트 한글 미혼입, 오디오 부재 정합성 검증 스크립트
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { DOMAIN_IDS } from '../src/data/domains.js';
import { STYLES_20 } from '../src/data/styles20.js';
import {
  generateCssTokensBlock,
  generateDesignsMarkdown,
  generateVibePrompt
} from '../src/prompt/vibePromptGenerator.js';
import { renderDomainMarkup } from '../src/showcase/showcaseApp.js';

const REQUIRED_CSS_VAR_KEYS = [
  '--bg',
  '--surface',
  '--surface-2',
  '--ink',
  '--ink-muted',
  '--accent',
  '--accent-text',
  '--accent-2',
  '--accent-ink',
  '--border',
  '--border-w',
  '--radius',
  '--radius-sm',
  '--shadow'
].sort();

function parseColor(raw, backdropRgb = [0, 0, 0]) {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (/^#[0-9a-f]{6}$/i.test(trimmed)) {
    return [
      Number.parseInt(trimmed.slice(1, 3), 16),
      Number.parseInt(trimmed.slice(3, 5), 16),
      Number.parseInt(trimmed.slice(5, 7), 16)
    ];
  }
  const match = trimmed.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i);
  if (!match) return null;
  const r = Number(match[1]);
  const g = Number(match[2]);
  const b = Number(match[3]);
  const a = match[4] !== undefined ? Number(match[4]) : 1;
  return [
    Math.round(r * a + backdropRgb[0] * (1 - a)),
    Math.round(g * a + backdropRgb[1] * (1 - a)),
    Math.round(b * a + backdropRgb[2] * (1 - a))
  ];
}

function relativeLuminance([r, g, b]) {
  const channel = v => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(fg, bg) {
  if (!fg || !bg) return 0;
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

const errors = [];

if (STYLES_20.length !== 20) {
  errors.push(`Expected exactly 20 curated styles, found ${STYLES_20.length}`);
}

const seenIds = new Set();
const seenNumbers = new Set();

for (const style of STYLES_20) {
  if (seenIds.has(style.id)) errors.push(`Duplicate style id: ${style.id}`);
  seenIds.add(style.id);

  if (seenNumbers.has(style.number)) errors.push(`Duplicate style number: ${style.number}`);
  seenNumbers.add(style.number);

  if (!style.nameKo || !style.nameEn || !style.tagline) {
    errors.push(`Missing core naming fields on ${style.id}`);
  }
  if (!style.fonts?.displayName || !style.fonts?.bodyName || !style.fonts?.monoName) {
    errors.push(`Missing font display/body/mono names on ${style.id}`);
  }
  if (!Array.isArray(style.traits) || style.traits.length !== 3) {
    errors.push(`Style ${style.id} must have exactly 3 traits`);
  }
  if (!Array.isArray(style.palette) || style.palette.length !== 5) {
    errors.push(`Style ${style.id} must have exactly 5 palette swatches`);
  } else {
    for (const swatch of style.palette) {
      if (!swatch.role || !swatch.roleEn || /[가-힣]/.test(swatch.roleEn)) {
        errors.push(`Palette swatch on ${style.id} missing clean English roleEn`);
      }
    }
  }

  // cssVars 키셋 일관성 및 유효 색상 토큰 검증
  const actualKeys = Object.keys(style.cssVars || {}).sort();
  if (JSON.stringify(actualKeys) !== JSON.stringify(REQUIRED_CSS_VAR_KEYS)) {
    errors.push(`cssVars keyset mismatch on ${style.id}: got [${actualKeys.join(', ')}]`);
  }

  const bg = parseColor(style.cssVars['--bg']);
  const surface = parseColor(style.cssVars['--surface'], bg || [0, 0, 0]);
  const surface2 = parseColor(style.cssVars['--surface-2'], bg || [0, 0, 0]);
  const ink = parseColor(style.cssVars['--ink'], bg || [0, 0, 0]);
  const inkMuted = parseColor(style.cssVars['--ink-muted'], bg || [0, 0, 0]);
  const accent = parseColor(style.cssVars['--accent'], bg || [0, 0, 0]);
  const accentText = parseColor(style.cssVars['--accent-text'], bg || [0, 0, 0]);
  const accentInk = parseColor(style.cssVars['--accent-ink'], accent || bg || [0, 0, 0]);

  if (!bg || !surface || !surface2 || !accent || !accentText) {
    errors.push(`Non-color token in --bg/--surface/--surface-2/--accent/--accent-text on ${style.id}`);
  } else {
    const contrastChecks = [
      ['--ink on --bg', contrastRatio(ink, bg)],
      ['--ink on --surface', contrastRatio(ink, surface)],
      ['--ink-muted on --bg', contrastRatio(inkMuted, bg)],
      ['--ink-muted on --surface', contrastRatio(inkMuted, surface)],
      ['--accent-ink on --accent', contrastRatio(accentInk, accent)],
      ['--accent-text on --bg', contrastRatio(accentText, bg)],
      ['--accent-text on --surface', contrastRatio(accentText, surface)],
      ['--accent-text on --surface-2', contrastRatio(accentText, surface2)]
    ];
    for (const [label, ratio] of contrastChecks) {
      if (ratio < 4.5) {
        errors.push(`WCAG AA contrast fail on ${style.id} (${label}: ${ratio.toFixed(2)}:1 < 4.5:1)`);
      }
    }
  }

  if (style.dna.dosKo.length < 4 || style.dna.dontsKo.length < 4) {
    errors.push(`Style ${style.id} must have at least 4 DO and 4 DON'T guardrails`);
  }

  for (const domainId of DOMAIN_IDS) {
    const htmlKo = renderDomainMarkup(style, domainId, 'ko');
    const htmlEn = renderDomainMarkup(style, domainId, 'en');
    for (const [langTag, html] of [['ko', htmlKo], ['en', htmlEn]]) {
      if (!html || html.length < 300) {
        errors.push(`Rendered markup too short for ${style.id}/${domainId}/${langTag}`);
      }
      if (/undefined|NaN|\[object Object\]/.test(html)) {
        errors.push(`Broken template token detected in ${style.id}/${domainId}/${langTag}`);
      }
    }
    const visibleEnText = htmlEn.replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, ' ');
    if (/[가-힣]/.test(visibleEnText)) {
      errors.push(`Korean leaked into EN showcase stage for ${style.id}/${domainId}`);
    }
  }

  const promptKo = generateVibePrompt(style, { domainId: 'web', lang: 'ko' });
  const promptEn = generateVibePrompt(style, { domainId: 'game', lang: 'en' });
  const css = generateCssTokensBlock(style);
  const md = generateDesignsMarkdown(style, { domainId: 'dashboard' });

  if (/[가-힣]/.test(promptEn)) {
    errors.push(`Korean characters leaked into English prompt for ${style.id}`);
  }

  for (const [label, text] of [['promptKo', promptKo], ['promptEn', promptEn], ['css', css], ['designs.md', md]]) {
    if (/Web Audio|synthAudio|BGM|효과음/i.test(text)) {
      errors.push(`Forbidden legacy audio text in ${style.id} ${label}`);
    }
  }
}

// src/ 및 HTML 엔트리에 오디오 코드 잔존 여부 검사
function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const filesToScan = [
  resolve('index.html'),
  resolve('showcase.html'),
  ...walk(resolve('src'))
];

for (const file of filesToScan) {
  const source = readFileSync(file, 'utf8');
  if (/\bAudioContext\b|\bsynthAudio\b|\baudioWidget\b|\bcompactAudioControls\b|audio-widget-root/.test(source)) {
    errors.push(`Legacy audio reference found in ${file}`);
  }
}

if (errors.length > 0) {
  console.error('❌ Style catalog validation failed:');
  for (const err of errors) console.error(' -', err);
  process.exit(1);
}

console.log(`✅ Validated ${STYLES_20.length} curated styles × ${DOMAIN_IDS.length} domains, WCAG AA contrast (>=4.5:1), cssVars parity, clean EN prompts, and zero audio.`);
