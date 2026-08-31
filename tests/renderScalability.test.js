import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { getAllStyles } from '../src/catalog/index.js';
import { getLegacyAllSubDesigns } from '../src/catalog/legacyAdapter.js';
import { renderGalleryPagination } from '../src/components/galleryPagination.js';
import { createGalleryWindow } from '../src/components/galleryModel.js';
import {
  renderDetailStyleChips,
  renderDetailStyleSelector,
  renderSplitStyleChips,
  renderSplitStylePicker
} from '../src/components/stylePickerMarkup.js';
import {
  RENDER_SCALABILITY_BUDGETS,
  createBoundedPicker,
  createRenderWindow
} from '../src/scalability/renderWindow.js';
import {
  getPreviewReferenceInventory as getThumbnailEntryInventory,
  renderPreviewThumbnail as renderThumbnailFromEntry
} from '../src/preview/thumbnailEntry.js';
import {
  getPreviewMotionDefinition as getMotionFromEntry,
  getPreviewReferenceInventory as getMotionEntryInventory
} from '../src/preview/motionEntry.js';
import {
  getPreviewReferenceInventory as getComponentEntryInventory,
  renderPreviewComponent as renderComponentFromEntry
} from '../src/preview/componentEntry.js';
import {
  renderPreviewComponent,
  renderPreviewThumbnail
} from '../src/preview/index.js';
import { createRetryableModuleLoader } from '../src/components/lazyPreviewLoader.js';

function createItems(count) {
  return Object.freeze(Array.from({ length: count }, (_, index) => Object.freeze({
    id: `style-${String(index + 1).padStart(3, '0')}`,
    name: `시안 ${index + 1}`,
    nameEn: `Design ${index + 1}`,
    category: index % 2 === 0 ? 'Editorial' : 'Interface'
  })));
}

const searchText = item => [item.id, item.name, item.nameEn, item.category].join(' ');
const thumbnailStub = ({ design }) => `<span class="style-thumb">${design.id}</span>`;

function countMarkup(markup, token) {
  return markup.split(token).length - 1;
}

function createGalleryFixture(count) {
  const entries = createItems(count).map((item, index) => {
    const category = Object.freeze({ id: index % 2 === 0 ? 'even' : 'odd' });
    return Object.freeze({
      style: Object.freeze({ id: item.id }),
      sub: Object.freeze({ id: item.id }),
      category
    });
  });
  const categories = ['even', 'odd'].map(id => Object.freeze({
    id,
    subCategories: Object.freeze(entries
      .filter(entry => entry.category.id === id)
      .map(entry => entry.sub))
  }));
  const eraGroups = ['early', 'late'].map((id, groupIndex) => Object.freeze({
    id,
    entries: Object.freeze(entries.filter((_, index) => index % 2 === groupIndex))
  }));

  return Object.freeze({
    results: Object.freeze(entries.map(entry => entry.style)),
    resultIds: Object.freeze(entries.map(entry => entry.style.id)),
    entries: Object.freeze(entries),
    categories: Object.freeze(categories),
    eraGroups: Object.freeze(eraGroups)
  });
}

test('실제 사용자 catalog는 synthetic 없이 actual 120을 제공한다', () => {
  assert.equal(getAllStyles().length, 120);
});

test('승인된 구조·bundle 예산은 공개된 불변 상수다', () => {
  assert.deepEqual(RENDER_SCALABILITY_BUDGETS, {
    galleryPageSize: 36,
    detailPickerLimit: 24,
    splitPickerLimit: 12,
    initialJavaScriptGzipBytes: 88_980,
    initialCssGzipBytes: 33_000,
    interactionMedianMs: 120,
    interactionMaximumMs: 200
  });
  assert.ok(Object.isFrozen(RENDER_SCALABILITY_BUDGETS));
});

test('36/60/120 결과 창은 최대 36개를 유지하고 모든 ID에 순서대로 도달한다', () => {
  for (const count of [36, 60, 120]) {
    const items = createItems(count);
    const first = createRenderWindow(items, {
      page: 1,
      pageSize: RENDER_SCALABILITY_BUDGETS.galleryPageSize
    });

    assert.equal(first.items.length, Math.min(count, 36));
    assert.equal(first.total, count);
    assert.equal(first.pageCount, Math.ceil(count / 36));
    assert.equal(first.start, count ? 1 : 0);
    assert.equal(first.end, Math.min(count, 36));
    assert.equal(first.canPrevious, false);

    const allVisibleIds = [];
    for (let page = 1; page <= first.pageCount; page += 1) {
      const window = createRenderWindow(items, { page, pageSize: 36 });
      assert.ok(window.items.length <= 36);
      allVisibleIds.push(...window.items.map(item => item.id));
    }

    assert.deepEqual(allVisibleIds, items.map(item => item.id));
    assert.deepEqual(items.map(item => item.id), createItems(count).map(item => item.id));
    assert.ok(Object.isFrozen(first));
    assert.ok(Object.isFrozen(first.items));
  }
});

test('결과 창은 empty와 invalid page/size를 안전한 범위로 정규화한다', () => {
  assert.deepEqual(createRenderWindow([], { page: 99, pageSize: 0 }), {
    items: [],
    start: 0,
    end: 0,
    total: 0,
    page: 1,
    pageCount: 1,
    pageSize: 36,
    canPrevious: false,
    canNext: false
  });

  const items = createItems(60);
  const last = createRenderWindow(items, { page: 999, pageSize: 'bad' });
  assert.equal(last.page, 2);
  assert.equal(last.start, 37);
  assert.equal(last.end, 60);
  assert.equal(last.items.length, 24);
  assert.equal(last.canPrevious, true);
  assert.equal(last.canNext, false);
});

test('bounded picker는 검색 결과를 제한하고 선택 항목을 중복 없이 고정한다', () => {
  const items = createItems(120);
  const picker = createBoundedPicker(items, {
    query: 'interface',
    selectedId: 'style-001',
    limit: 12,
    getSearchText: searchText
  });

  assert.equal(picker.query, 'interface');
  assert.equal(picker.matchCount, 60);
  assert.equal(picker.items.length, 12);
  assert.equal(picker.items[0].id, 'style-001');
  assert.equal(picker.selectedPinned, true);
  assert.equal(picker.items.filter(item => item.id === 'style-001').length, 1);
  assert.equal(new Set(picker.items.map(item => item.id)).size, picker.items.length);
  assert.ok(Object.isFrozen(picker));
  assert.ok(Object.isFrozen(picker.items));
});

test('bounded picker는 한국어·영어·ID 검색과 blank/invalid 입력을 결정론적으로 처리한다', () => {
  const items = createItems(30);

  assert.deepEqual(
    createBoundedPicker(items, {
      query: '시안 29',
      selectedId: 'style-029',
      limit: 24,
      getSearchText: searchText
    }).items.map(item => item.id),
    ['style-029']
  );

  const blank = createBoundedPicker(items, {
    query: '   ',
    selectedId: 'missing',
    limit: 12,
    getSearchText: searchText
  });
  assert.equal(blank.query, '');
  assert.equal(blank.matchCount, 30);
  assert.equal(blank.items.length, 12);
  assert.equal(blank.selectedPinned, false);

  const invalid = createBoundedPicker([
    ...items,
    items[0],
    null,
    { id: '' }
  ], {
    query: null,
    selectedId: 'style-030',
    limit: -1,
    getSearchText: null
  });
  assert.equal(invalid.items.length, 12);
  assert.equal(invalid.items[0].id, 'style-030');
  assert.equal(new Set(invalid.items.map(item => item.id)).size, 12);
});

test('gallery window는 세 보기 projection을 같은 36개 ID 창으로 제한한다', () => {
  const model = createGalleryFixture(120);
  const visible = createGalleryWindow(model, { page: 2 });
  const expectedIds = model.resultIds.slice(36, 72);

  assert.deepEqual(visible.entries.map(entry => entry.style.id), expectedIds);
  assert.deepEqual(
    new Set(visible.categories.flatMap(category => category.subCategories.map(sub => sub.id))),
    new Set(expectedIds)
  );
  assert.deepEqual(
    new Set(visible.eraGroups.flatMap(group => group.entries.map(entry => entry.style.id))),
    new Set(expectedIds)
  );
  assert.deepEqual(visible.resultIds, model.resultIds);
  assert.equal(visible.window.start, 37);
  assert.equal(visible.window.end, 72);
  assert.ok(Object.isFrozen(visible));
});

test('gallery pagination은 한 페이지에서 사라지고 여러 페이지에서 live 범위와 native 제어를 제공한다', () => {
  const single = createRenderWindow(createItems(36), { page: 1, pageSize: 36 });
  assert.equal(renderGalleryPagination(single), '');

  const middle = createRenderWindow(createItems(120), { page: 2, pageSize: 36 });
  const markup = renderGalleryPagination(middle);
  assert.match(markup, /<nav[^>]+aria-label="디자인 결과 페이지"/u);
  assert.match(markup, /data-gallery-page="previous"/u);
  assert.match(markup, /data-gallery-page="next"/u);
  assert.match(markup, /role="status"/u);
  assert.match(markup, /<strong>37–72<\/strong> \/ 120/u);
  assert.doesNotMatch(markup, /disabled/u);

  const last = createRenderWindow(createItems(60), { page: 2, pageSize: 36 });
  assert.match(renderGalleryPagination(last), /data-gallery-page="next"[^>]+disabled/u);
});

test('Detail selector는 현재 category를 최대 24칩으로 제한하고 초과 시 검색을 제공한다', () => {
  const styles = createItems(30).map((item, index) => ({
    ...item,
    categoryId: 'editorial',
    categoryTitle: '에디토리얼',
    thumbMotif: `thumb-${index + 1}`
  }));
  styles[29].name = '<위험한 시안>';

  const markup = renderDetailStyleSelector(styles, {
    categoryId: 'editorial',
    categoryTitle: '에디토리얼',
    selectedId: 'style-030',
    renderThumbnail: thumbnailStub
  });

  assert.equal(countMarkup(markup, '<button class="top-style-chip '), 24);
  assert.match(markup, /id="detail-style-search"/u);
  assert.match(markup, /data-category-id="editorial"/u);
  assert.match(markup, /data-sub-id="style-030"/u);
  assert.match(markup, /aria-selected="true"/u);
  assert.match(markup, /&lt;위험한 시안&gt;/u);
  assert.doesNotMatch(markup, /<위험한 시안>/u);
});

test('Detail selector는 24종 이하에서 검색 UI 없이 category 칩만 렌더한다', () => {
  const styles = createItems(6).map(item => ({
    ...item,
    categoryTitle: '뎁스',
    thumbMotif: item.id
  }));
  const markup = renderDetailStyleSelector(styles, {
    categoryId: 'depth',
    categoryTitle: '뎁스',
    selectedId: 'style-003',
    renderThumbnail: thumbnailStub
  });

  assert.equal(countMarkup(markup, '<button class="top-style-chip '), 6);
  assert.doesNotMatch(markup, /detail-style-search/u);
  assert.match(markup, /6개 세부 스타일/u);
  assert.equal(countMarkup(markup, 'data-cat-id="depth"'), 6);
});

test('Desktop/Mobile sandbox는 브라우저 폭과 독립된 preview 폭 계약을 가진다', () => {
  const css = readFileSync(new URL('../src/styles/interactive.css', import.meta.url), 'utf8');
  assert.match(
    css,
    /\.mockup-viewport\.mobile\s+:is\(\.archetype-unit,\s*\.mockup-unit\)\s*\{[^}]*max-width:\s*390px/su
  );
  assert.match(
    css,
    /\.style-thumb,\s*\.style-thumb \*\s*\{[^}]*animation-play-state:\s*paused !important/su
  );
  assert.match(
    css,
    /\.style-thumb\.in-view,\s*\.style-thumb\.in-view \*\s*\{[^}]*animation-play-state:\s*running !important/su
  );
});

test('Detail chip 갱신은 검색 결과 수·selected pinning·live status를 유지한다', () => {
  const styles = createItems(30).map(item => ({
    ...item,
    categoryId: 'editorial',
    categoryTitle: '에디토리얼',
    thumbMotif: item.id
  }));
  const result = renderDetailStyleChips(styles, {
    query: 'Design 29',
    selectedId: 'style-030',
    renderThumbnail: thumbnailStub
  });

  assert.equal(countMarkup(result.markup, '<button class="top-style-chip '), 2);
  assert.equal(result.matchCount, 1);
  assert.equal(result.selectedPinned, true);
  assert.match(result.markup, /data-sub-id="style-030"/u);
  assert.match(result.markup, /data-sub-id="style-029"/u);
});

test('Split picker는 슬롯당 시각 썸네일을 12개로 제한하고 현재 선택을 고정한다', () => {
  const styles = createItems(120).map(item => ({
    ...item,
    categoryId: 'mixed',
    categoryTitle: item.category,
    thumbMotif: item.id
  }));

  const markup = renderSplitStylePicker(styles, {
    slot: 'A',
    selectedId: 'style-120',
    renderThumbnail: thumbnailStub
  });

  assert.equal(countMarkup(markup, '<button class="split-pick-thumb '), 12);
  assert.match(markup, /id="split-style-search-a"/u);
  assert.match(markup, /for="split-style-search-a"/u);
  assert.match(markup, /data-split-search="A"/u);
  assert.match(markup, /data-sub-id="style-120"/u);
  assert.match(markup, /aria-selected="true"/u);
  assert.match(markup, /role="status"/u);
});

test('Split picker 검색은 해당 슬롯 결과만 제한하고 selected pinning을 보고한다', () => {
  const styles = createItems(120).map(item => ({
    ...item,
    categoryId: 'mixed',
    categoryTitle: item.category,
    thumbMotif: item.id
  }));
  const result = renderSplitStyleChips(styles, {
    slot: 'B',
    query: 'Interface',
    selectedId: 'style-001',
    renderThumbnail: thumbnailStub
  });

  assert.equal(result.matchCount, 60);
  assert.equal(result.selectedPinned, true);
  assert.equal(countMarkup(result.markup, '<button class="split-pick-thumb '), 12);
  assert.match(result.markup, /data-slot="B"/u);
  assert.equal(result.items[0].id, 'style-001');
});

test('preview kind entrypoint는 필요한 definition 종류만 포함한다', () => {
  assert.deepEqual({
    renderers: getThumbnailEntryInventory().rendererIds.length,
    thumbnails: getThumbnailEntryInventory().thumbnailIds.length,
    motions: getThumbnailEntryInventory().motionIds.length
  }, { renderers: 0, thumbnails: 120, motions: 0 });

  assert.deepEqual({
    renderers: getMotionEntryInventory().rendererIds.length,
    thumbnails: getMotionEntryInventory().thumbnailIds.length,
    motions: getMotionEntryInventory().motionIds.length
  }, { renderers: 0, thumbnails: 0, motions: 120 });

  assert.deepEqual({
    renderers: getComponentEntryInventory().rendererIds.length,
    thumbnails: getComponentEntryInventory().thumbnailIds.length,
    motions: getComponentEntryInventory().motionIds.length
  }, { renderers: 120, thumbnails: 0, motions: 120 });
});

test('분리 entrypoint 출력은 기존 preview facade와 바이트 단위로 같다', () => {
  const styles = getLegacyAllSubDesigns();
  for (const style of styles) {
    assert.equal(
      renderThumbnailFromEntry({ thumbnailId: style.thumbMotif, design: style }),
      renderPreviewThumbnail({ thumbnailId: style.thumbMotif, design: style })
    );
    assert.equal(
      renderComponentFromEntry({ rendererId: style.previewType, tab: 'hero', design: style }),
      renderPreviewComponent({ rendererId: style.previewType, tab: 'hero', design: style })
    );
    assert.equal(getMotionFromEntry(style.motionProfile)?.id, style.motionProfile);
  }
});

test('retryable module loader는 동시 요청을 공유하고 실패 뒤 다음 시도를 허용한다', async () => {
  let attempts = 0;
  const loader = createRetryableModuleLoader(() => {
    attempts += 1;
    return attempts === 1
      ? Promise.reject(new Error('첫 요청 실패'))
      : Promise.resolve({ render: true, attempt: attempts });
  });

  const first = loader.load();
  assert.equal(loader.load(), first);
  await assert.rejects(first, error => (
    error.code === 'RECOVERY_IMPORT_FAILED'
    && error.phase === 'import'
    && error.cause?.message === '첫 요청 실패'
  ));
  assert.equal(attempts, 1);

  const recovered = await loader.load();
  assert.deepEqual(recovered, { render: true, attempt: 2 });
  assert.equal(attempts, 2);
  assert.equal(await loader.load(), recovered);

  loader.reset();
  assert.deepEqual(await loader.load(), { render: true, attempt: 3 });
});

test('retryable module loader는 브라우저 module-map 실패를 피하도록 다음 importer로 전환한다', async () => {
  const calls = [];
  const loader = createRetryableModuleLoader([
    () => {
      calls.push('primary');
      return Promise.reject(new Error('실패 URL은 브라우저가 기억함'));
    },
    () => {
      calls.push('retry-1');
      return Promise.resolve({ recovered: true });
    }
  ]);

  await assert.rejects(loader.load(), error => (
    error.code === 'RECOVERY_IMPORT_FAILED'
    && error.cause?.message === '실패 URL은 브라우저가 기억함'
  ));
  assert.deepEqual(await loader.load(), { recovered: true });
  assert.deepEqual(calls, ['primary', 'retry-1']);

  loader.reset();
  await assert.rejects(loader.load(), error => (
    error.code === 'RECOVERY_IMPORT_FAILED'
    && error.cause?.message === '실패 URL은 브라우저가 기억함'
  ));
  assert.deepEqual(calls, ['primary', 'retry-1', 'primary']);
});

test('main entry는 Detail을 정적으로 import하지 않고 loading/error/retry 경계를 제공한다', () => {
  const mainSource = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const indexCss = readFileSync(new URL('../index.css', import.meta.url), 'utf8');
  const loaderSource = readFileSync(
    new URL('../src/components/lazyPreviewLoader.js', import.meta.url),
    'utf8'
  );

  assert.doesNotMatch(mainSource, /import \{ renderDetailView \} from/u);
  assert.match(mainSource, /loadDetailViewModule/u);
  assert.match(mainSource, /aria-busy="true"/u);
  assert.match(mainSource, /data-lazy-detail-retry/u);
  assert.match(indexHtml, /<body data-app-pending>/u);
  assert.match(indexCss, /body\[data-app-pending\][^{]*\{[^}]*visibility:\s*hidden/su);
  assert.match(mainSource, /await document\.fonts\.ready/u);
  assert.match(mainSource, /document\.body\.removeAttribute\('data-app-pending'\)/u);
  assert.match(loaderSource, /import\('\.\/detailView\.js'\)/u);
  assert.match(loaderSource, /import\('\.\/detailView\.js\?retry=1'\)/u);
  assert.match(loaderSource, /import\('\.\.\/preview\/componentLazyEntry\.js'\)/u);
  assert.match(loaderSource, /import\('\.\.\/preview\/componentLazyRetryEntry\.js'\)/u);
});

test('Peek와 selection dock은 component renderer를 정적 import하지 않고 stale-safe loader 상태를 제공한다', () => {
  for (const file of ['peekPreview.js', 'selectionDock.js']) {
    const source = readFileSync(
      new URL(`../src/components/${file}`, import.meta.url),
      'utf8'
    );
    assert.doesNotMatch(source, /from '\.\.\/preview\/(?:index|componentEntry)\.js'/u, file);
    assert.match(source, /loadComponentPreviewModule/u, file);
    assert.match(source, /aria-busy="true"/u, file);
    assert.match(source, /data-(?:peek|confirm)-preview-retry/u, file);
  }
});
