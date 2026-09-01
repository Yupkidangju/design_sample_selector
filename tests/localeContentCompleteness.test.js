import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { getAllStyles } from '../src/catalog/index.js';
import { getLocalizedLegacyAllSubDesigns } from '../src/catalog/legacyAdapter.js';
import { getArchetypeHTML } from '../src/components/archetypeTemplates.js';
import { SUPPORTED_LOCALES, loadLocaleSnapshot, validateLocaleSnapshot } from '../src/i18n/index.js';
import { createInspectorArtifacts } from '../src/utils/inspectorState.js';

const NON_ENGLISH_LOCALES = Object.freeze(['ko', 'ja', 'zh-CN', 'zh-TW']);

function expectedStyleFieldUnits(styles) {
  return styles.reduce((total, style) => total
    + 2
    + style.palette.length * 2
    + style.editorial.characteristics.length
    + style.editorial.pros.length
    + style.editorial.cons.length, 0);
}

function humanMarkup(html) {
  return html.replace(/\sdata-[a-z0-9-]+="[^"]*"/gu, '');
}

test('Stage 1 locale packs own all 120 explicit catalog style records', async () => {
  const styles = getAllStyles();
  const expectedIds = styles.map(style => style.id).sort();
  const modules = await Promise.all([
    import('../src/i18n/locales/ko.js'),
    import('../src/i18n/locales/en.js'),
    import('../src/i18n/locales/ja.js'),
    import('../src/i18n/locales/zh-CN.js'),
    import('../src/i18n/locales/zh-TW.js')
  ]);

  for (const { default: pack } of modules) {
    assert.deepEqual(Object.keys(pack.catalog?.styles || {}).sort(), expectedIds, `${pack.locale}: explicit style records`);
    for (const style of styles) {
      const record = pack.catalog.styles[style.id];
      assert.equal(record.id, style.id, `${pack.locale}:${style.id}: stable id`);
      assert.ok(record.name?.trim(), `${pack.locale}:${style.id}: name`);
      assert.ok(record.summary?.trim(), `${pack.locale}:${style.id}: summary`);
      assert.equal(record.palette.length, style.palette.length, `${pack.locale}:${style.id}: palette parity`);
      assert.equal(record.characteristics.length, style.editorial.characteristics.length, `${pack.locale}:${style.id}: characteristics parity`);
      assert.equal(record.pros.length, style.editorial.pros.length, `${pack.locale}:${style.id}: pros parity`);
      assert.equal(record.cons.length, style.editorial.cons.length, `${pack.locale}:${style.id}: cons parity`);
    }
  }
});

test('Stage 1 non-English card names use locale-owned display names instead of English fallback', async () => {
  const english = await loadLocaleSnapshot('en');

  for (const locale of NON_ENGLISH_LOCALES) {
    const snapshot = await loadLocaleSnapshot(locale);
    const repeated = getAllStyles()
      .filter(style => snapshot.catalog.styles[style.id].name === english.catalog.styles[style.id].name)
      .map(style => style.id);
    assert.deepEqual(repeated, [], `${locale}: English design-name fallback`);
  }
});

test('Stage 1 coverage reports every style field without fallback or placeholder', async () => {
  const styles = getAllStyles();
  const expectedUnits = expectedStyleFieldUnits(styles);

  for (const locale of SUPPORTED_LOCALES) {
    const snapshot = await loadLocaleSnapshot(locale);
    const report = validateLocaleSnapshot(snapshot, { styles });
    assert.equal(report.coverage.total, expectedUnits, `${locale}: total style fields`);
    assert.equal(report.coverage.translated + report.coverage.invariantApproved, expectedUnits, `${locale}: accounted fields`);
    assert.equal(report.coverage.placeholder, 0, `${locale}: placeholders`);
    assert.equal(report.coverage.implicitFallback, 0, `${locale}: implicit fallback`);
    assert.equal(report.coverage.unapprovedInvariant, 0, `${locale}: unapproved invariant`);
  }
});

test('Stage 1 non-English palette display fields use the selected locale script', async () => {
  const expectedScript = {
    ko: /[가-힣]/u,
    ja: /[ぁ-ゟ゠-ヿ一-龯]/u,
    'zh-CN': /[一-龯]/u,
    'zh-TW': /[一-龯]/u
  };
  for (const locale of NON_ENGLISH_LOCALES) {
    const snapshot = await loadLocaleSnapshot(locale);
    for (const style of Object.values(snapshot.catalog.styles)) {
      for (const color of style.palette) {
        assert.match(color.name, expectedScript[locale], `${locale}:${style.id}:${color.id}: name`);
        assert.match(color.usage, expectedScript[locale], `${locale}:${style.id}:${color.id}: usage`);
      }
    }
  }
});

test('Stage 1 gallery mood and motion labels come from selected-locale facets', async () => {
  const expectedScript = {
    ko: /[가-힣]/u,
    ja: /[ぁ-ゟ゠-ヿ一-龯]/u,
    'zh-CN': /[一-龯]/u,
    'zh-TW': /[一-龯]/u
  };
  for (const locale of NON_ENGLISH_LOCALES) {
    const snapshot = await loadLocaleSnapshot(locale);
    const designs = getLocalizedLegacyAllSubDesigns(snapshot);
    for (const design of designs) {
      for (const mood of design.moodTags) assert.match(mood, expectedScript[locale], `${locale}:${design.id}: mood`);
      assert.match(design.motionLabel, expectedScript[locale], `${locale}:${design.id}: motion`);
    }
  }
});

test('Stage 1 catalog overlay consumes locale records and owns no generic prose templates', async () => {
  const source = await readFile(new URL('../src/i18n/catalogOverlay.js', import.meta.url), 'utf8');

  assert.doesNotMatch(source, /const TEMPLATES\s*=/);
  assert.doesNotMatch(source, /international-proper-name/);
  assert.doesNotMatch(source, /text\(style\.name,\s*'en'\)/);
  assert.match(source, /pack\.catalog/);
});

test('Stage 1 recovery surfaces own no fixed English kicker outside locale copy', async () => {
  const source = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /APPLICATION RECOVERY|ON-DEMAND PREVIEW/);
});

test('Stage 1 Chrome state transitions settle on locale-invariant Inspector identity', async () => {
  const source = await readFile(new URL('../scripts/verifyCatalog120Chrome.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /live-html-code[^\n]+AI 네이티브/u);
  assert.match(source, /live-json-code[^\n]+TRANSITION_ID/u);
  assert.doesNotMatch(source, /name\.en[^\n]+System/u);
  assert.doesNotMatch(source, /ariaValueText === '100% 읽음'/u);
  assert.match(source, /#TRX-8901/u);
});

test('Stage 1 Chrome i18n gate reaches and validates all 120 localized cards per locale', async () => {
  const source = await readFile(new URL('../scripts/verifyI18nInspectorChrome.js', import.meta.url), 'utf8');
  assert.match(source, /catalogCards/u);
  assert.match(source, /reachableCount === 120/u);
  assert.match(source, /expectedName/u);
});

test('Stage 1 component previews replace renderer-owned English copy with the selected locale', async () => {
  const { renderPreviewComponent } = await import('../src/preview/componentEntry.js');
  const { getLocalizedLegacyAllSubDesigns } = await import('../src/catalog/legacyAdapter.js');
  const forbidden = /EXPLORE SYSTEM|VIEW PRINCIPLE|Signal overview|FORM SCORE|ENTER WORKSHOP|Visual order achieved|Create workspace|SELECT EDITION/;

  for (const locale of ['ko', 'ja', 'zh-CN', 'zh-TW']) {
    const snapshot = await loadLocaleSnapshot(locale);
    const designs = getLocalizedLegacyAllSubDesigns(snapshot);
    for (const styleId of ['swiss-grid', 'bauhaus-geometry', 'material-design', 'liquid-glass', 'ulm-rationalism']) {
      const design = designs.find(style => style.id === styleId);
      for (const tab of ['hero', 'widget', 'form', 'pricing']) {
        const html = renderPreviewComponent({
          rendererId: design.previewType,
          tab,
          design,
          snapshot
        });
        assert.doesNotMatch(html, forbidden, `${locale}:${styleId}:${tab}`);
        if (locale !== 'ko') assert.doesNotMatch(html, /[가-힣]/u, `${locale}:${styleId}:${tab}: Hangul leak`);
      }
    }
  }
});

test('Stage 1 archetypes never reinsert the canonical English design name', async () => {
  for (const locale of NON_ENGLISH_LOCALES) {
    const snapshot = await loadLocaleSnapshot(locale);
    const design = getLocalizedLegacyAllSubDesigns(snapshot).find(style => style.id === 'swiss-grid');
    for (const archetype of ['game', 'web', 'mobile', 'ecommerce', 'blog', 'dashboard', 'media', 'chat']) {
      const html = getArchetypeHTML(archetype, design, { snapshot });
      assert.doesNotMatch(html, new RegExp(design.nameEn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${locale}:${archetype}`);
      assert.doesNotMatch(html, /ARENA BATTLE|Alex Designer|Global Web App|Mobile Archetype SDK| Studio\b/u, `${locale}:${archetype}: fixed English copy`);
    }
  }
});

test('Stage 1 keeps approved AI terminology inside each localized design name', async () => {
  for (const locale of NON_ENGLISH_LOCALES) {
    const snapshot = await loadLocaleSnapshot(locale);
    const design = getLocalizedLegacyAllSubDesigns(snapshot).find(style => style.id === 'ai-native-gradient');
    const html = getArchetypeHTML('game', design, { snapshot });
    assert.match(html, new RegExp(design.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), locale);
  }
});

test('Stage 1 preserves dashboard transaction IDs as locale-invariant identifiers', async () => {
  for (const locale of NON_ENGLISH_LOCALES) {
    const snapshot = await loadLocaleSnapshot(locale);
    const design = getLocalizedLegacyAllSubDesigns(snapshot).find(style => style.id === 'swiss-grid');
    const html = getArchetypeHTML('dashboard', design, { snapshot });
    assert.match(html, /#TRX-8901/u, locale);
  }
});

test('Stage 1 Inspector human artifacts do not append the canonical English display name', async () => {
  for (const locale of NON_ENGLISH_LOCALES) {
    const snapshot = await loadLocaleSnapshot(locale);
    const design = getLocalizedLegacyAllSubDesigns(snapshot).find(style => style.id === 'swiss-grid');
    const state = {
      selectedSubCategory: design.id,
      activeArchetype: 'game',
      activeComponentTab: 'hero',
      sandboxDevice: 'desktop',
      liveTweaks: design.defaultTweaks,
      locale
    };
    const artifacts = createInspectorArtifacts(state, [design], getArchetypeHTML('game', design, { snapshot }), snapshot);
    for (const [kind, content] of [['css', artifacts.css.full], ['html', artifacts.html], ['markdown', artifacts.markdown], ['json', artifacts.json]]) {
      const text = String(content);
      assert.doesNotMatch(text, new RegExp(design.nameEn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${locale}:${kind}`);
    }
  }
});

test('Stage 1 renders the 5-locale by 120-style by 4-tab preview matrix without foreign-script leakage', async () => {
  const { renderPreviewComponent } = await import('../src/preview/componentEntry.js');
  let renderCount = 0;

  for (const locale of SUPPORTED_LOCALES) {
    const snapshot = await loadLocaleSnapshot(locale);
    const designs = getLocalizedLegacyAllSubDesigns(snapshot);
    for (const design of designs) {
      for (const tab of ['hero', 'widget', 'form', 'pricing']) {
        const html = renderPreviewComponent({ rendererId: design.previewType, tab, design, snapshot });
        const visibleHtml = humanMarkup(html);
        assert.match(html, /class="mockup-unit\b/u, `${locale}:${design.id}:${tab}: root`);
        if (locale === 'ko') assert.doesNotMatch(visibleHtml, /[ぁ-ゟ゠-ヿ一-龯]/u, `${locale}:${design.id}:${tab}: CJK leak`);
        if (locale === 'ja') assert.doesNotMatch(visibleHtml, /[가-힣]/u, `${locale}:${design.id}:${tab}: Hangul leak`);
        if (locale === 'zh-CN' || locale === 'zh-TW') assert.doesNotMatch(visibleHtml, /[가-힣ぁ-ゟ゠-ヿ]/u, `${locale}:${design.id}:${tab}: Korean/Japanese leak`);
        if (locale !== 'en') assert.doesNotMatch(visibleHtml, new RegExp(design.nameEn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${locale}:${design.id}:${tab}: English name`);
        renderCount += 1;
      }
    }
  }
  assert.equal(renderCount, 2400);
});

test('Stage 1 renders the 5-locale by 120-style by 8-archetype matrix from one locale snapshot', async () => {
  const archetypes = ['game', 'web', 'mobile', 'ecommerce', 'blog', 'dashboard', 'media', 'chat'];
  let renderCount = 0;

  for (const locale of SUPPORTED_LOCALES) {
    const snapshot = await loadLocaleSnapshot(locale);
    const designs = getLocalizedLegacyAllSubDesigns(snapshot);
    for (const design of designs) {
      for (const archetype of archetypes) {
        const html = getArchetypeHTML(archetype, design, { tab: 'hero', snapshot });
        const visibleHtml = humanMarkup(html);
        assert.match(html, new RegExp(`data-archetype="${archetype}"`), `${locale}:${design.id}:${archetype}: root`);
        if (locale === 'ko') assert.doesNotMatch(visibleHtml, /[ぁ-ゟ゠-ヿ一-龯]/u, `${locale}:${design.id}:${archetype}: CJK leak`);
        if (locale === 'ja') assert.doesNotMatch(visibleHtml, /[가-힣]/u, `${locale}:${design.id}:${archetype}: Hangul leak`);
        if (locale === 'zh-CN' || locale === 'zh-TW') assert.doesNotMatch(visibleHtml, /[가-힣ぁ-ゟ゠-ヿ]/u, `${locale}:${design.id}:${archetype}: Korean/Japanese leak`);
        if (locale !== 'en') assert.doesNotMatch(visibleHtml, new RegExp(design.nameEn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${locale}:${design.id}:${archetype}: English name`);
        renderCount += 1;
      }
    }
  }
  assert.equal(renderCount, 4800);
});
