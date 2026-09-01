import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { getAllStyles } from '../src/catalog/index.js';
import { SUPPORTED_LOCALES, loadLocaleSnapshot } from '../src/i18n/index.js';

const HUMAN_ARRAY_FIELDS = Object.freeze(['characteristics', 'pros', 'cons']);

function machineSignature(record) {
  return {
    id: record.id,
    palette: record.palette.map(color => ({ id: color.id, value: color.value })),
    characteristics: record.characteristics.length,
    pros: record.pros.length,
    cons: record.cons.length
  };
}

test('Task 27 keeps all 120 locale records semantically aligned without changing machine fields', async () => {
  const styles = getAllStyles();
  const snapshots = await Promise.all(SUPPORTED_LOCALES.map(loadLocaleSnapshot));
  const expectedIds = styles.map(style => style.id).sort();

  for (const snapshot of snapshots) {
    assert.deepEqual(Object.keys(snapshot.catalog.styles).sort(), expectedIds, `${snapshot.locale}: style IDs`);
  }

  for (const id of expectedIds) {
    const records = snapshots.map(snapshot => snapshot.catalog.styles[id]);
    const reference = machineSignature(records[0]);
    for (const [index, record] of records.entries()) {
      const locale = snapshots[index].locale;
      assert.deepEqual(machineSignature(record), reference, `${locale}:${id}: machine/semantic unit parity`);
      assert.ok(record.name.trim(), `${locale}:${id}: name`);
      assert.ok(record.summary.trim(), `${locale}:${id}: summary`);
      for (const color of record.palette) {
        assert.ok(color.name.trim(), `${locale}:${id}:${color.id}: palette name`);
        assert.ok(color.usage.trim(), `${locale}:${id}:${color.id}: palette usage`);
      }
      for (const field of HUMAN_ARRAY_FIELDS) {
        assert.ok(record[field].every(value => value.trim()), `${locale}:${id}:${field}: empty semantic unit`);
      }
    }
  }
});

test('Task 27 keeps zh-CN and zh-TW as independently authored regional packs', async () => {
  const [simplified, traditional] = await Promise.all([
    loadLocaleSnapshot('zh-CN'),
    loadLocaleSnapshot('zh-TW')
  ]);
  const ids = Object.keys(simplified.catalog.styles);
  const simplifiedText = JSON.stringify(simplified.catalog.styles);
  const traditionalText = JSON.stringify(traditional.catalog.styles);

  assert.equal(ids.filter(id => simplified.catalog.styles[id].summary === traditional.catalog.styles[id].summary).length, 0, 'summary must be independently localized');
  assert.equal(ids.filter(id => JSON.stringify(simplified.catalog.styles[id]) === JSON.stringify(traditional.catalog.styles[id])).length, 0, 'whole records must not be character-copy duplicates');
  for (const term of ['用户', '界面', '数据', '加载', '网格', '亚克力']) assert.match(simplifiedText, new RegExp(term, 'u'), `zh-CN regional term: ${term}`);
  for (const term of ['使用者', '介面', '資料', '載入', '網格', '壓克力']) assert.match(traditionalText, new RegExp(term, 'u'), `zh-TW regional term: ${term}`);
});

test('Task 27 Chrome gate covers five locales, five widths, 200% reflow, Detail controls, and machine-readable evidence', async () => {
  const source = await readFile(new URL('../scripts/verifyI18nInspectorChrome.js', import.meta.url), 'utf8');

  assert.match(source, /REFLOW_VIEWPORTS[\s\S]*320[\s\S]*375[\s\S]*768[\s\S]*1024[\s\S]*1440/u);
  assert.match(source, /ZOOM_200[\s\S]*physicalWidth:\s*1280[\s\S]*cssWidth:\s*640[\s\S]*deviceScaleFactor:\s*2/u);
  assert.match(source, /Emulation\.setDeviceMetricsOverride/u);
  assert.match(source, /inspectReflowState/u);
  assert.match(source, /clippedControls/u);
  assert.match(source, /report\.reflow/u);
  assert.match(source, /reflow-/u);
});

test('Task 27 Detail tuner gives every range a locale-owned accessible label', async () => {
  const source = await readFile(new URL('../src/components/detailView.js', import.meta.url), 'utf8');

  for (const id of ['radius', 'border', 'shadow', 'blur', 'glow']) {
    assert.match(source, new RegExp(`<label\\s+for="slider-${id}">`, 'u'), id);
  }
  assert.doesNotMatch(source, /\(Border Radius\)|\(Border Width\)|\(Shadow Depth\)|\(Backdrop Blur\)|\(Glow Intensity\)/u);
});
