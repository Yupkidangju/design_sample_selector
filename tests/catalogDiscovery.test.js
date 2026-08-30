import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DISCOVERY_SORT_MODES,
  SEARCH_QUERY_MAX_LENGTH,
  getAllStyles,
  getFacetValueCounts,
  getStyleFacetValues,
  groupStylesByEra,
  normalizeFacetSelections,
  queryCatalogStyles,
  updateFacetSelection
} from '../src/catalog/index.js';
import { CORE_PACK_MANIFEST } from '../src/catalog/packs/core/manifest.js';

const CORE_STYLE_IDS = new Set(CORE_PACK_MANIFEST.styleIds);
const ALL_STYLES = getAllStyles();
const CORE_STYLES = ALL_STYLES.filter(style => CORE_STYLE_IDS.has(style.id));
const loadDiscoveryUrl = () => import('../src/catalog/discoveryUrl.js');

test('검색은 한국어·영어·alias·category·facet metadata에서 모든 token을 찾는다', () => {
  assert.deepEqual(
    queryCatalogStyles(CORE_STYLES, { query: 'darkmode-highcontrast' }).map(style => style.id),
    ['dark-minimal-glass']
  );

  assert.deepEqual(
    queryCatalogStyles(CORE_STYLES, {
      query: '유리 미래적',
      categoryId: 'depth'
    }).map(style => style.id),
    ['glassmorphism', 'liquid-glass']
  );

  assert.deepEqual(
    queryCatalogStyles(CORE_STYLES, { query: '리소그래프 촉각적' }).map(style => style.id),
    ['risograph']
  );

  assert.deepEqual(
    queryCatalogStyles(CORE_STYLES, { query: 'liquid impossible-token' }),
    []
  );
});

test('actual 120 검색은 신규 이름·한국어 요약·문법 facet에서 신규 시안을 찾는다', () => {
  assert.equal(ALL_STYLES.length, 120);
  assert.deepEqual(
    queryCatalogStyles(ALL_STYLES, { query: '퀀텀 궤도' }).map(style => style.id),
    ['quantum-control']
  );
  assert.deepEqual(
    queryCatalogStyles(ALL_STYLES, {
      query: '스티커',
      categoryId: 'soft3d',
      facets: { tone: ['playful'] }
    }).map(style => style.id),
    ['sticker-book']
  );
});

test('서로 다른 facet은 AND, multiple facet 내부 값은 OR로 결합한다', () => {
  const results = queryCatalogStyles(CORE_STYLES, {
    facets: {
      materiality: ['paper', 'glass'],
      tone: ['rebellious'],
      density: ['maximal']
    }
  });

  assert.deepEqual(results.map(style => style.id), ['punk-zine']);
});

test('category와 bookmark는 검색·facet 조건과 독립적으로 동시에 적용된다', () => {
  const results = queryCatalogStyles(CORE_STYLES, {
    categoryId: 'depth',
    facets: { materiality: ['glass'] },
    bookmarksOnly: true,
    bookmarkedIds: ['glassmorphism', 'material-design', 'liquid-glass']
  });

  assert.deepEqual(
    results.map(style => style.id),
    ['glassmorphism', 'liquid-glass']
  );
});

test('facet selection은 사전 selectionMode·값 순서·unknown 제거를 강제한다', () => {
  assert.deepEqual(
    normalizeFacetSelections({
      kind: ['technique', 'revival'],
      tone: ['playful', 'playful', 'invalid'],
      unknown: ['anything']
    }),
    {
      kind: ['technique'],
      tone: ['playful']
    }
  );

  let selections = updateFacetSelection({}, 'kind', 'technique', true);
  selections = updateFacetSelection(selections, 'kind', 'revival', true);
  selections = updateFacetSelection(selections, 'tone', 'playful', true);
  selections = updateFacetSelection(selections, 'tone', 'futuristic', true);
  assert.deepEqual(selections, {
    kind: ['revival'],
    tone: ['playful', 'futuristic']
  });

  selections = updateFacetSelection(selections, 'tone', 'playful', false);
  selections = updateFacetSelection(selections, 'kind', 'revival', false);
  assert.deepEqual(selections, { tone: ['futuristic'] });
});

test('시대 facet은 시작 연도의 승인된 경계에서 결정된다', () => {
  const bucketFor = start => getStyleFacetValues({
    classification: { era: { start } }
  }, 'era');

  assert.deepEqual(bucketFor(null), ['timeless']);
  assert.deepEqual(bucketFor(1949), ['pre-1950']);
  assert.deepEqual(bucketFor(1950), ['1950s-1970s']);
  assert.deepEqual(bucketFor(1979), ['1950s-1970s']);
  assert.deepEqual(bucketFor(1980), ['1980s-1990s']);
  assert.deepEqual(bucketFor(1999), ['1980s-1990s']);
  assert.deepEqual(bucketFor(2000), ['2000s']);
  assert.deepEqual(bucketFor(2009), ['2000s']);
  assert.deepEqual(bucketFor(2010), ['2010s']);
  assert.deepEqual(bucketFor(2019), ['2010s']);
  assert.deepEqual(bucketFor(2020), ['2020s']);
});

test('네 정렬 모드는 입력 배열을 변경하지 않고 안정 순서를 만든다', () => {
  assert.deepEqual(DISCOVERY_SORT_MODES, ['catalog', 'name-asc', 'era-asc', 'era-desc']);
  const originalIds = CORE_STYLES.map(style => style.id);

  const catalog = queryCatalogStyles(CORE_STYLES, { sort: 'catalog' });
  const names = queryCatalogStyles(CORE_STYLES, { sort: 'name-asc' });
  const oldest = queryCatalogStyles(CORE_STYLES, { sort: 'era-asc' });
  const newest = queryCatalogStyles(CORE_STYLES, { sort: 'era-desc' });

  assert.deepEqual(catalog.map(style => style.id), originalIds);
  assert.equal(names[0].name.en, '8-Bit Pixel Arcade');
  assert.equal(oldest[0].id, 'art-nouveau');
  assert.equal(newest[0].id, 'liquid-glass');
  assert.deepEqual(CORE_STYLES.map(style => style.id), originalIds);
  assert.ok(Object.isFrozen(catalog));
});

test('Spectrum 시대 그룹은 실제 분류 데이터에서 파생되고 내림차순에서 역전된다', () => {
  const ascending = groupStylesByEra(CORE_STYLES, { direction: 'asc' });
  const descending = groupStylesByEra(CORE_STYLES, { direction: 'desc' });

  assert.deepEqual(
    ascending.map(group => group.id),
    ['pre-1950', '1950s-1970s', '1980s-1990s', '2000s', '2010s', '2020s']
  );
  assert.deepEqual(
    descending.map(group => group.id),
    [...ascending.map(group => group.id)].reverse()
  );
  assert.equal(ascending.flatMap(group => group.styles).length, CORE_STYLES.length);
  assert.deepEqual(
    new Set(ascending.flatMap(group => group.styles.map(style => style.id))),
    new Set(CORE_STYLES.map(style => style.id))
  );
  assert.equal(ascending[0].label.ko, '1950년 이전');
  assert.ok(Object.isFrozen(ascending));
});

test('facet 전체 count는 정규 classification에서 계산된다', () => {
  const counts = getFacetValueCounts(CORE_STYLES);

  assert.equal(counts.kind['historical-movement'], 7);
  assert.equal(counts.era['pre-1950'], 6);
  assert.equal(counts.materiality.glass, 6);
  assert.equal(counts.media['web-ui'], 36);
  assert.equal(counts.maturity.experimental, 0);
  assert.ok(Object.isFrozen(counts));
  assert.ok(Object.isFrozen(counts.materiality));
});

test('잘못된 query 옵션은 안전한 기본값으로 정규화되고 결과를 변조하지 않는다', () => {
  const results = queryCatalogStyles(CORE_STYLES, {
    query: null,
    categoryId: 'missing-category',
    facets: { missing: ['value'], kind: ['missing-kind'] },
    sort: 'random',
    bookmarksOnly: 'yes',
    bookmarkedIds: null
  });

  assert.deepEqual(results.map(style => style.id), CORE_STYLES.map(style => style.id));
});

test('URL 직렬화는 기본값을 생략하고 정의 순서로 canonical query를 만든다', async () => {
  const { serializeDiscoverySearch } = await loadDiscoveryUrl();
  assert.equal(serializeDiscoverySearch({}), '');

  assert.equal(
    serializeDiscoverySearch({
      searchQuery: '  liquid glass  ',
      activeFilter: 'depth',
      activeFacets: {
        tone: ['luxurious', 'futuristic'],
        materiality: ['glass'],
        era: ['2020s']
      },
      sortMode: 'era-desc',
      viewMode: 'SPECTRUM',
      bookmarkFilterActive: true
    }),
    '?q=liquid+glass&category=depth&f=era%3A2020s&f=materiality%3Aglass&f=tone%3Afuturistic&f=tone%3Aluxurious&sort=era-desc&view=spectrum&saved=1'
  );
});

test('URL parser는 중복·unknown을 제거하고 검색어 길이와 single facet을 제한한다', async () => {
  const { parseDiscoverySearch } = await loadDiscoveryUrl();
  const longQuery = '가'.repeat(SEARCH_QUERY_MAX_LENGTH + 25);
  const parsed = parseDiscoverySearch(
    `?q=${encodeURIComponent(longQuery)}`
      + '&category=missing-category'
      + '&f=kind%3Atechnique'
      + '&f=kind%3Arevival'
      + '&f=tone%3Aplayful'
      + '&f=tone%3Aplayful'
      + '&f=tone%3Amissing'
      + '&f=missing%3Avalue'
      + '&sort=random&view=unknown&saved=true'
  );

  assert.equal(parsed.searchQuery.length, SEARCH_QUERY_MAX_LENGTH);
  assert.equal(parsed.activeFilter, 'ALL');
  assert.deepEqual(parsed.activeFacets, {
    kind: ['technique'],
    tone: ['playful']
  });
  assert.equal(parsed.sortMode, 'catalog');
  assert.equal(parsed.viewMode, 'GRID');
  assert.equal(parsed.bookmarkFilterActive, false);
});

test('URL parse→serialize→parse는 동일한 discovery 상태를 복원한다', async () => {
  const { parseDiscoverySearch, serializeDiscoverySearch } = await loadDiscoveryUrl();
  const initial = parseDiscoverySearch(
    '?q=glass&category=depth&f=materiality%3Aglass&f=tone%3Afuturistic&sort=name-asc&view=bento&saved=1'
  );
  const restored = parseDiscoverySearch(serializeDiscoverySearch(initial));

  assert.deepEqual(restored, initial);
});

test('URL state adapter는 초기 URL·상태 변경·popstate를 loop 없이 동기화한다', async () => {
  const { bindDiscoveryUrlState } = await import('../src/state/discoveryUrlState.js');
  const listeners = new Set();
  let state = {
    searchQuery: '',
    activeFilter: 'ALL',
    activeFacets: {},
    sortMode: 'catalog',
    viewMode: 'GRID',
    bookmarkFilterActive: false
  };
  const stateManager = {
    getState: () => state,
    setState(partial) {
      const previous = state;
      state = { ...state, ...partial };
      for (const listener of listeners) listener(state, previous);
    },
    subscribe(listener) {
      listeners.add(listener);
      listener(state, state);
      return () => listeners.delete(listener);
    }
  };

  const eventListeners = new Map();
  const replaceCalls = [];
  const browserWindow = {
    location: {
      pathname: '/gallery',
      search: '?q=glass&category=depth&f=materiality%3Aglass&view=bento',
      hash: '#results'
    },
    history: {
      state: { preserved: true },
      replaceState(historyState, unused, url) {
        replaceCalls.push({ historyState, unused, url });
        const parsed = new URL(url, 'https://example.test');
        browserWindow.location.search = parsed.search;
      }
    },
    addEventListener(type, listener) {
      eventListeners.set(type, listener);
    },
    removeEventListener(type, listener) {
      if (eventListeners.get(type) === listener) eventListeners.delete(type);
    }
  };

  const cleanup = bindDiscoveryUrlState(stateManager, browserWindow);
  assert.equal(state.searchQuery, 'glass');
  assert.equal(state.activeFilter, 'depth');
  assert.deepEqual(state.activeFacets, { materiality: ['glass'] });
  assert.equal(state.viewMode, 'BENTO');

  stateManager.setState({
    activeFacets: { materiality: ['glass'], tone: ['futuristic'] },
    sortMode: 'era-desc'
  });
  assert.equal(
    replaceCalls.at(-1).url,
    '/gallery?q=glass&category=depth&f=materiality%3Aglass&f=tone%3Afuturistic&sort=era-desc&view=bento#results'
  );
  assert.deepEqual(replaceCalls.at(-1).historyState, { preserved: true });

  browserWindow.location.search = '?q=bauhaus&f=era%3Apre-1950&view=spectrum';
  eventListeners.get('popstate')();
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(state.searchQuery, 'bauhaus');
  assert.equal(state.activeFilter, 'ALL');
  assert.deepEqual(state.activeFacets, { era: ['pre-1950'] });
  assert.equal(state.sortMode, 'catalog');
  assert.equal(state.viewMode, 'SPECTRUM');
  assert.ok(replaceCalls.length < 6, 'state/URL subscriber loop가 없어야 한다.');

  cleanup();
  assert.equal(eventListeners.has('popstate'), false);
});

test('discovery controls markup은 10개 facet·native input·live status와 escape 계약을 가진다', async () => {
  const { renderDiscoveryControlsHTML } = await import('../src/components/discoveryMarkup.js');
  const html = renderDiscoveryControlsHTML({
    searchQuery: '<img src=x onerror=alert(1)>',
    activeFilter: 'depth',
    activeFacets: {
      kind: ['technique'],
      tone: ['futuristic']
    },
    sortMode: 'era-desc',
    viewMode: 'GRID',
    bookmarkFilterActive: true,
    bookmarks: ['glassmorphism', 'liquid-glass']
  }, {
    panelOpen: true,
    openFacetIds: new Set(['kind', 'tone'])
  });

  assert.match(html, /role="status"[^>]*aria-live="polite"[^>]*aria-atomic="true"/);
  assert.equal((html.match(/data-facet-group=/g) || []).length, 10);
  assert.match(html, /type="radio"[^>]*name="facet-kind"/);
  assert.match(html, /type="checkbox"[^>]*name="facet-tone"/);
  assert.match(html, /id="discovery-sort"[^>]*aria-label="결과 정렬"/);
  assert.match(html, /option value="era-desc" selected/);
  assert.match(html, /data-clear-key="query"/);
  assert.match(html, /data-remove-facet="kind"[^>]*data-remove-value="technique"/);
  assert.match(html, /data-remove-facet="tone"[^>]*data-remove-value="futuristic"/);
  assert.equal((html.match(/class="disclosure-indicator"/g) || []).length, 11);
  assert.match(html, /class="disclosure-indicator" aria-hidden="true"/);
  assert.doesNotMatch(html, /<img src=x onerror=alert\(1\)>/);
  assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;/);
});

test('Grid·Bento·Spectrum 모델은 같은 canonical 결과 집합과 보기별 순서를 공유한다', async () => {
  const { createGalleryModel } = await import('../src/components/galleryModel.js');
  const model = createGalleryModel({
    searchQuery: '',
    activeFilter: 'depth',
    activeFacets: { materiality: ['glass'] },
    sortMode: 'era-desc',
    bookmarkFilterActive: false,
    bookmarks: []
  });

  assert.deepEqual(model.resultIds, [
    'liquid-glass',
    'acrylic-ui',
    'mica-surface',
    'holographic-foil',
    'chrome-metal-ui',
    'glassmorphism'
  ]);
  assert.deepEqual(
    model.categories.flatMap(category => category.subCategories.map(style => style.id)),
    model.resultIds
  );
  assert.deepEqual(model.entries.map(entry => entry.sub.id), model.resultIds);
  assert.deepEqual(model.eraGroups.map(group => group.id), ['2020s', '2010s']);
  assert.deepEqual(
    model.eraGroups.flatMap(group => group.entries.map(entry => entry.sub.id)),
    model.resultIds
  );
});
