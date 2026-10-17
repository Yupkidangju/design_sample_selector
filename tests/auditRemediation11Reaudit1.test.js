import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { getAllStyles, getCategories, getFacetDefinitions } from '../src/catalog/index.js';
import { getLocalizedLegacyAllSubDesigns } from '../src/catalog/legacyAdapter.js';
import { getArchetypeHTML } from '../src/components/archetypeTemplates.js';
import { renderDiscoveryControlsHTML } from '../src/components/discoveryMarkup.js';
import {
  createInspectorArtifacts
} from '../src/utils/inspectorState.js';

const NON_KOREAN_LOCALES = Object.freeze(['en', 'ja', 'zh-CN', 'zh-TW']);
const MACHINE_ATTRIBUTE_PATTERN = /\b(?:id|data-[a-z-]+)="[^"]+"/g;

function collectStructuralPaths(value, prefix = '') {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return [];
  return Object.entries(value).flatMap(([key, child]) => {
    if (key === '$description' || key === '$extensions') return [];
    const path = prefix ? `${prefix}.${key}` : key;
    return [path, ...collectStructuralPaths(child, path)];
  });
}

test('Audit 11 re-audit #1: catalog coverage rejects placeholders and reports approved proper-name fallback', async () => {
  const { SUPPORTED_LOCALES, loadLocaleSnapshot, validateLocaleSnapshot } = await import('../src/i18n/index.js');
  const canonical = {
    styles: getAllStyles(),
    categories: getCategories(),
    facets: getFacetDefinitions()
  };

  for (const locale of SUPPORTED_LOCALES) {
    const snapshot = await loadLocaleSnapshot(locale);
    const report = validateLocaleSnapshot(snapshot, canonical);
    assert.deepEqual(report.errors, [], `${locale}: ${report.errors.join(', ')}`);
    assert.equal(report.coverage.placeholder, 0, `${locale}: placeholders must fail completeness`);
    assert.ok(report.coverage.translated > 0, `${locale}: translated coverage must be counted`);
    assert.ok(Array.isArray(report.coverage.approvedFallbacks));
    for (const fallback of report.coverage.approvedFallbacks) {
      assert.equal(fallback.field, 'style.name');
      assert.equal(fallback.reason, 'international-proper-name');
    }
  }
});

test('Audit 11 re-audit #1: five snapshots own full visible, ARIA, recovery, archetype, and artifact copy parity', async () => {
  const { SUPPORTED_LOCALES, loadLocaleSnapshot } = await import('../src/i18n/index.js');
  const snapshots = await Promise.all(SUPPORTED_LOCALES.map(loadLocaleSnapshot));
  const referenceKeys = Object.keys(snapshots[0].copy).sort();

  assert.ok(referenceKeys.length >= 120, 'the copy inventory must cover all audited surfaces');
  for (const snapshot of snapshots) {
    assert.deepEqual(Object.keys(snapshot.copy).sort(), referenceKeys, `${snapshot.locale}: copy parity`);
    for (const [key, value] of Object.entries(snapshot.copy)) {
      assert.equal(typeof value, 'string', `${snapshot.locale}:${key}`);
      assert.ok(value.trim(), `${snapshot.locale}:${key}`);
    }
  }
});

test('Audit 11 re-audit #1: non-Korean Discovery and archetype HTML contain selected-locale copy and stable machine attributes', async () => {
  const { activateLocale } = await import('../src/i18n/index.js');
  const machineSets = [];

  for (const locale of NON_KOREAN_LOCALES) {
    const snapshot = await activateLocale(locale);
    const design = getLocalizedLegacyAllSubDesigns(snapshot).find(item => item.id === 'swiss-grid');
    const discovery = renderDiscoveryControlsHTML({ sortMode: 'catalog', activeFacets: {} });
    const htmlByArchetype = ['game', 'web', 'mobile', 'ecommerce', 'blog', 'dashboard', 'media', 'chat']
      .map(archetype => [archetype, getArchetypeHTML(archetype, design, { tab: 'hero', snapshot })]);
    const html = htmlByArchetype.find(([archetype]) => archetype === 'game')[1];

    assert.match(discovery, new RegExp(snapshot.copy['discovery.resultStatus'].split('{')[0]));
    assert.doesNotMatch(discovery, /결과 정렬|세부 필터|현재 활성 조건|조건 제거/);
    assert.match(html, new RegExp(snapshot.copy['archetype.game.instructions'].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.doesNotMatch(html, /몬스터를 클릭|콤보 부스터/);
    for (const [archetype, markup] of htmlByArchetype) {
      assert.doesNotMatch(markup, /[가-힣]/, `${locale}:${archetype}: Hangul leak`);
    }
    machineSets.push(htmlByArchetype.flatMap(([archetype, markup]) => (
      (markup.match(MACHINE_ATTRIBUTE_PATTERN) || []).map(attribute => `${archetype}:${attribute}`)
    )).sort());
  }

  for (const attributes of machineSets.slice(1)) assert.deepEqual(attributes, machineSets[0]);
});

test('Audit 11 re-audit #1: Inspector human text changes in CSS, HTML, Markdown, and DTCG while machine keys stay stable', async () => {
  const { SUPPORTED_LOCALES, loadLocaleSnapshot } = await import('../src/i18n/index.js');
  const human = [];
  const cssKeys = [];
  const htmlMachine = [];
  const dtcgPaths = [];

  for (const locale of SUPPORTED_LOCALES) {
    const snapshot = await loadLocaleSnapshot(locale);
    const design = getLocalizedLegacyAllSubDesigns(snapshot).find(item => item.id === 'swiss-grid');
    const html = getArchetypeHTML('game', design, { tab: 'hero', snapshot });
    const state = {
      selectedSubCategory: design.id,
      activeArchetype: 'game',
      activeComponentTab: 'hero',
      sandboxDevice: 'desktop',
      liveTweaks: design.defaultTweaks,
      locale
    };
    const artifacts = createInspectorArtifacts(state, [design], html, snapshot);
    const dtcg = JSON.parse(artifacts.json);

    human.push([
      artifacts.css.full.match(/^\/\*[^\n]+/m)?.[0],
      artifacts.html.match(/<p>([^<]+)<\/p>/)?.[1],
      artifacts.markdown.match(/^## 1\. (.+)$/m)?.[1],
      dtcg.$extensions['com.design-sample-selector'].displayName
    ]);
    cssKeys.push([...artifacts.css.full.matchAll(/--(?:theme|color|tweak)-[a-z0-9-]+(?=:)/g)].map(match => match[0]).sort());
    htmlMachine.push((artifacts.html.match(MACHINE_ATTRIBUTE_PATTERN) || []).sort());
    dtcgPaths.push(collectStructuralPaths(dtcg).sort());

    assert.equal(dtcg.$extensions['com.design-sample-selector'].locale, locale);
    assert.ok(dtcg.$description);
  }

  assert.equal(new Set(human.map(item => JSON.stringify(item))).size, 5);
  for (const keys of cssKeys.slice(1)) assert.deepEqual(keys, cssKeys[0]);
  for (const attributes of htmlMachine.slice(1)) assert.deepEqual(attributes, htmlMachine[0]);
  for (const paths of dtcgPaths.slice(1)) assert.deepEqual(paths, dtcgPaths[0]);
});

test('Audit 11 re-audit #1: audited component sources no longer own the reported Korean visible or ARIA literals', async () => {
  const files = await Promise.all([
    '../src/components/header.js',
    '../src/components/discoveryMarkup.js',
    '../src/components/mainView.js',
    '../src/components/detailView.js',
    '../src/components/selectionDock.js',
    '../src/components/peekPreview.js',
    '../src/components/audioWidget.js',
    '../src/main.js'
  ].map(path => readFile(new URL(path, import.meta.url), 'utf8')));
  const source = files.join('\n');

  assert.doesNotMatch(source, /갤러리 뷰 모드|결과 정렬|북마크 저장|세부 필터 10개|현재 활성 조건/);
  assert.doesNotMatch(source, /실시간 디자인 사양 및 인스펙터|메인 갤러리로 돌아가기|상세 시안을 불러오지 못했습니다/);
});

test('Audit 11 re-audit #1: Chrome locale gate covers five Detail and Inspector snapshots plus state preservation', async () => {
  const script = await readFile(new URL('../scripts/verifyI18nInspectorChrome.js', import.meta.url), 'utf8');
  assert.match(script, /ko.*en.*ja.*zh-CN.*zh-TW/s);
  assert.match(script, /live-css-code/);
  assert.match(script, /live-html-code/);
  assert.match(script, /live-md-code/);
  assert.match(script, /live-json-code/);
  assert.match(script, /activeInspectorTab/);
  assert.match(script, /sidebarScrollTop/);
  assert.match(script, /focus/);
  assert.match(script, /runtimeStatus/);
  assert.match(script, /localeSelector/);
  assert.match(script, /expansionPreview/);
  assert.match(script, /ulm-rationalism/);
  assert.match(script, /backgroundColor/);
  assert.match(script, /locale selector position changed/);
});

test('Audit 11 re-audit #1: locale re-render restores focus before rearming the trap', async () => {
  const source = await readFile(new URL('../src/components/detailView.js', import.meta.url), 'utf8');
  assert.match(source, /focusTarget\.focus\(\{ preventScroll: true \}\)/);
  assert.match(source, /setupFocusTrap\(container, \{ focusInitial: isNewOpen \|\| !localeChanged \}\)/);
});

test('Audit 11 re-audit #1: interactive preview statuses resolve through the locale snapshot', async () => {
  const source = await readFile(new URL('../src/components/mockupRuntime.js', import.meta.url), 'utf8');

  assert.match(source, /options\.snapshot\?\.copy/);
  assert.doesNotMatch(source, /장바구니가 비어 있습니다|결제 취소|주문 내용을 확인하세요/);
  assert.doesNotMatch(source, /댓글 내용을 입력해 주세요|메시지를 입력해 주세요|% 읽음/);
  assert.doesNotMatch(source, /MONSTER DEFEATED|ULTIMATE ACTIVATED|COMBO MULTIPLIER BOOSTED/);
});
