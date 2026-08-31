import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { getLocalizedLegacyAllSubDesigns } from '../src/catalog/legacyAdapter.js';
import { getArchetypeHTML } from '../src/components/archetypeTemplates.js';
import { loadLocaleSnapshot } from '../src/i18n/index.js';

const NON_KOREAN_LOCALES = Object.freeze(['en', 'ja', 'zh-CN', 'zh-TW']);

test('언어 선택기는 유효한 어두운 표면과 로케일에 무관한 고정 크기를 가진다', async () => {
  const css = await readFile(new URL('../index.css', import.meta.url), 'utf8');
  const header = await readFile(new URL('../src/components/header.js', import.meta.url), 'utf8');
  const rule = css.match(/\.locale-picker select\s*\{(?<body>[^}]+)\}/)?.groups?.body || '';

  assert.match(rule, /background(?:-color)?:\s*var\(--bg-dark-surface\)/);
  assert.match(rule, /color-scheme:\s*dark/);
  assert.match(rule, /width:\s*104px/);
  assert.match(rule, /height:\s*34px/);
  assert.doesNotMatch(rule, /--bg-dark-secondary/);

  const actionsRule = css.match(/\.header-actions\s*\{(?<body>[^}]+)\}/)?.groups?.body || '';
  assert.match(actionsRule, /width:\s*100%/);
  assert.match(header, /class="visually-hidden"/);
  assert.doesNotMatch(header, /class="sr-only"/);
});

test('확장 시안 내부 제목과 설명은 선택한 비한국어 로케일의 디자인 snapshot을 사용한다', async () => {
  for (const locale of NON_KOREAN_LOCALES) {
    const snapshot = await loadLocaleSnapshot(locale);
    const design = getLocalizedLegacyAllSubDesigns(snapshot).find(item => item.id === 'ulm-rationalism');
    const html = getArchetypeHTML('web', design, { tab: 'hero', snapshot });

    assert.match(html, new RegExp(design.shortDesc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.doesNotMatch(html, /[가-힣]/, `${locale}: expansion preview contains Korean copy`);
  }
});

test('영어 시안 설명은 분류와 분위기 용어를 빈칸 없이 유지한다', async () => {
  const snapshot = await loadLocaleSnapshot('en');
  const design = getLocalizedLegacyAllSubDesigns(snapshot).find(item => item.id === 'ulm-rationalism');

  assert.match(design.shortDesc, /historical movement principles/);
  assert.match(design.shortDesc, /rational tone/);
  assert.doesNotMatch(design.shortDesc, /applies\s+principles|a\s+tone/);
});
