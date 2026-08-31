# Sub Audit Report

## 1. Audit Metadata

- Audit Turn: 11 (`multi-audit`), sub-audit 02
- Perspective: 빌드·테스트·런타임·아키텍처·데이터 무결성
- User Goal: `ko/en/ja/zh-CN/zh-TW` 5개 언어를 도입하고 상단 언어 메뉴, 카탈로그/검색/정렬, mockup, inspector의 Live CSS·HTML·Markdown·DTCG JSON을 일관되게 지역화한다. 언어 전환 시 스타일·interaction state·tweaks를 유지하고, 999px 모서리 둥글기 값이 전체 화면으로 전파되는 경로도 점검한다.
- Audit Basis: Standard-backed / Goal-driven
- Standard Path: `/home/eunho1/Projects/web/design_sample_selector/AI_AUDIT_DOC_STANDARD.md`; `/home/eunho1/.codex/skills/multi-audit/references/report-contract.md`

## 2. Assigned Scope

- 정규 catalog localized schema, validation, packs, legacy adapter, stable IDs/keys
- `AppState`, URL/localStorage persistence, discovery search/sort/filter, header 및 UI 문자열
- mockup template/runtime, runtime snapshot/hydration, locale-aware `Intl` formatting
- detail inspector snapshot/staleness, Live CSS/HTML/Markdown/DTCG JSON 및 download/bundle 파일명·내용
- CSS radius/layout/responsive/font 경계
- `defaultTweaks.borderRadius`의 source → state → DOM → export 흐름
- test/build/prebuild/initial-bundle 경계와 5-locale 도입 시 completeness gate

## 3. Excluded and Uninspected Scope

- 제품 소스·테스트·설정·제품 문서는 수정하지 않았다. `git diff --stat`에는 추적 파일 변경이 없고, 감사 보고서 디렉터리만 untracked 상태였다.
- 기존 `docs/multi_audit` 보고서의 결론은 읽지 않았다.
- 사용자의 안전 지시에 따라 `npm run build`, dev server, Chrome/브라우저 실행, 외부 게시·배포는 수행하지 않았다. 따라서 실제 브라우저의 픽셀 단위 overflow와 paint 결과는 정적/Node 증거로만 판정했다.
- `dist` 새 산출물 및 외부 서비스/운영 데이터는 검사하지 않았다.

## 4. Evidence Examined

### 4.1 Files and symbols

- Catalog: `src/catalog/contract.js:2,85-164`, `src/catalog/validation/rules.js:152-177,306-365,421-435`, `src/catalog/index.js`, `src/catalog/categories.js`, `src/catalog/facets.js`, `src/catalog/packs/expansion/authoring.js:129-141,213-225,350-405`, `src/catalog/legacyAdapter.js:9-47`
- Discovery/state: `src/catalog/discovery.js:33-41,116-149,174-217`, `src/catalog/discoveryUrl.js:21-99`, `src/state/discoveryUrlState.js:18-61`, `src/state/appState.js:90-128,130-166,172-260,304-341`
- UI/runtime: `index.html:2,6-8`, `src/components/header.js`, `discoveryMarkup.js`, `mainView.js`, `galleryPagination.js`, `stylePickerMarkup.js`, `selectionDock.js`, `peekPreview.js`, `splitCompareTabs.js`, `audioWidget.js`, `archetypeTemplates.js`, `mockupRuntime.js:56-89,127-174,918-1083`
- Inspector/export: `src/components/detailView.js:90-207,217-267,399-458,748-807,1118-1145,1355-1395,1520-1527`, `src/utils/inspectorState.js:7-43`, `src/utils/designSpecGenerator.js:226-268,273-445,565-632`
- CSS/build/tests/docs: `index.css:41-53,2049-2076,3686-3705`, `src/styles/interactive.css:2749-2805,2922-3005`, `package.json`, `scripts/validateCatalog.js`, `scripts/analyzeInitialBundle.js`, `tests/catalogValidation.test.js`, `tests/styleContract.test.js`, `tests/catalogDiscovery.test.js`, `tests/inspectorState.test.js`, `tests/designSpecGenerator.test.js`, `tests/mockupRuntime.test.js`, `tests/auditRemediation9.test.js`, `spec.md`, `README.md`, `designs.md`, `DESIGN_DECISIONS.md`

### 4.2 Commands and measured results

1. `git status --short` 및 `git diff --stat`: 제품 파일의 변경은 없고 `?? docs/multi_audit/11/`만 표시됐다.
2. `rg -n '[가-힣]' src/components src/utils src/state src/catalog src/audio src/main.js --glob '*.js'`: `src/components` 15 files/294 lines, `src/utils` 3/19, `src/state` 1/1, `src/catalog` 23/936, `src/main.js` 1/14. 이 수치는 번역이 필요한 문자열 전체가 아니라 현재 소스에 남은 한국어 문자열의 하한이다.
3. `rg -n ':lang\\(' index.css src/styles` 결과 0건. `noto|source han|wenquanyi|malgun|hiragino|pingfang|simsun|microsoft yahei|cjk` 폰트 참조도 0건이었다.
4. `node --input-type=module` 카탈로그 스캐너: `getAllStyles()`, `getCategories()`, `getFacetDefinitions()`를 읽어 localized-object field별 키 존재 수를 계산했다.

| 정규 field | 전체 | ko | en | ja | zh-CN | zh-TW |
|---|---:|---:|---:|---:|---:|---:|
| `style.name` | 120 | 120 | 120 | 0 | 0 | 0 |
| `style.summary` | 120 | 120 | 0 | 0 | 0 | 0 |
| `palette.name` | 480 | 480 | 480 | 0 | 0 | 0 |
| `palette.usage` | 480 | 480 | 0 | 0 | 0 | 0 |
| `category.title` | 8 | 8 | 8 | 0 | 0 | 0 |
| `category.description` | 8 | 8 | 0 | 0 | 0 | 0 |
| `facet.label` | 10 | 10 | 10 | 0 | 0 | 0 |
| `facet.value.label` | 90 | 90 | 90 | 0 | 0 | 0 |
| 합계 | 1,316 | 1,316 (100%) | 708 (53.8%) | 0 | 0 | 0 |

   추가로 번역 대상이지만 schema상 plain string인 값은 `classification.era.label` 120개, editorial 배열 1,300개(`moodTags` 480, `characteristics` 361, `pros` 242, `cons` 121, `accessibilityNotes` 96), category tags 32개로 총 1,452개였다.
5. `node --input-type=module` radius 스캐너: 공개 style 120개 중 `defaultTweaks.borderRadius > 64` 8개, 정확히 `999`인 ID 8개(`op-art`, `space-age`, `disco-glam`, `seventies-groovy`, `cyber-y2k`, `kawaii-pixel-web`, `scene-core-web`, `mcbling-gloss`)였다. 현재 `tokens.radius`와 `defaultTweaks.borderRadius`가 다른 style도 15개였다.
6. Node inline probes:
   - `normalizeDiscoveryState({ locale: 'ja', searchQuery: 'Y2K' })`와 `parseDiscoverySearch('?locale=ja&q=Y2K')`에서 `locale`이 제거됐다. `serializeDiscoverySearch({ locale: 'ja', searchQuery: 'Y2K' })` 결과는 `?q=Y2K`였다.
   - `new AppStateManager(); setState({ locale: 'ja' })`는 `STATE_FIELD_UNKNOWN:locale` 경고와 `false`를 반환했다.
   - `validateCurrentCatalog()`는 `errorCount: 0, warningCount: 56`을 반환했다. 동일 manager에 `setState({ liveTweaks: { borderRadius: 999 } })`를 적용하면 `true`, 저장 값 `999`였다.
7. `node --input-type=module` synthetic export probe: legacy `op-art`의 palette 표시 이름을 `画布`, `表面`, `信号`, `对比信号`로 바꿔 `generateLiveCSSSnippet`/`generateLiveTokensJSON`을 호출했다. CSS 결과는 네 줄 모두 `--color-: ...`, DTCG color key는 `['']`였다. 현재 영어 표시 이름으로 전체 120 style/480 swatch를 검사했을 때는 빈 slug/collision이 0건이지만, 이는 adapter가 `.name.en`을 먼저 선택하기 때문이며 안정성 계약의 증거가 아니다.
8. `npm test`: `1..190`, `# tests 190`, `# pass 190`, `# fail 0`. 이 통과 결과에는 5-locale completeness, locale state/bootstrap, `Intl`, translated palette key, snapshot invalidation, radius upper-bound/999 경계 테스트가 없다.

## 5. Findings

### [A01-F001] 5-locale catalog schema·migration·completeness gate가 없다

- Area: Catalog contract, validation, data migration, legacy projection
- Severity: Major
- Status: Confirmed
- Summary: 현재 정규 계약은 `ko` 중심의 optional `en`만 표현하며 5 locale의 완전성·fallback·ready 조건을 정의하지 않는다.
- Evidence:
  - `src/catalog/contract.js:2`의 `CATALOG_SCHEMA_VERSION`은 1이고 `:85`의 `LocalizedText`는 `{ ko: string, en?: string }`이다. style name/category/facet 일부만 `{ko,en}` 필수이며 `summary`, description, palette usage는 ko만 유효하다(`:134-164`).
  - `src/catalog/validation/rules.js:152-161,306-310`은 ko 필수와 선택적 en만 검사한다. `:432-434`의 editorial은 plain `string[]`만 검사한다.
  - 실측 localized object 1,316개는 ko 100%, en 53.8%, ja/zh-CN/zh-TW 0%이고, 추가 plain human text 1,452개에는 locale key가 없다.
  - `src/catalog/legacyAdapter.js:13-26,39-47`은 `name/shortDesc/title/description`을 ko/en 평면 문자열로 고정하고 palette `id`와 localized object를 버린다.
- Expected Basis: 사용자 5 locale 요구; `AI_AUDIT_DOC_STANDARD.md:576-589`(IMP-001 계약/레이어 일관성), `:904-918`(SPEC-GAP-001), `:870-884`(TEST-001 실패 모드 회귀), `report-contract.md:62-72`(coverage gap 명시).
- Actual: 일본어/중국어 데이터가 전무하고, 영어도 summary/usage/description/editorial에서는 누락된다. 현재 strict gate도 없고 `package.json`의 prebuild는 `validate:catalog`를 `--strict` 없이 실행한다.
- Impact: 언어 메뉴만 추가하면 다수 화면에 undefined/ko fallback이 조용히 섞인다. catalog가 ready인지 판정할 수 없고 migration 중 IDs/tokens/defaults/references를 보존할 계약도 없다.
- Suggested Action: 먼저 “5 locale 모든 human field 완역”과 “명시적 fallback 허용” 중 제품 정책을 확정한다. 이후 `Locale = ko|en|ja|zh-CN|zh-TW`와 v2 schema를 정의하고 category/facet/era/editorial/palette/style 및 runtime/UI message를 같은 번역 key 체계로 분리한다. v1→v2 migration은 stable style/category/facet/palette IDs, aliases, tokens, defaultTweaks, renderer references를 그대로 보존하고 ko/en 값을 새 map으로 옮긴다. locale별 누락·빈 문자열·중복 key를 release-blocking gate로 검사하되, fallback을 허용할 경우 field별 fallback chain과 completeness 상태를 명시적으로 기록한다.
- Re-audit Method: 120 styles/8 categories/10 facets/90 facet values와 1,452 plain human fields를 대상으로 5개 locale의 key·빈 값·fallback 경로를 계산한다. v1 fixture를 migration한 뒤 IDs, tokens, palette IDs, tweaks의 hash가 보존되는지 확인하고 `validate:catalog --strict` 및 새 locale gate를 통과시킨다.
- Confidence: High
- Notes: `README.md:98-102`, `spec.md:227-230,358`도 현재 Korean/English 및 ko/en display projection만 기술한다. 완역 여부는 아래 Clarification이 필요하다.

### [A01-F002] locale state/bootstrap/URL/검색/UI wiring이 전혀 연결되지 않았다

- Area: App state, persistence, document language, discovery, UI strings, formatting
- Severity: Major
- Status: Confirmed
- Summary: 앱이 locale을 state나 URL/localStorage에 저장하지 않고, header language menu도 없으며, 검색·정렬·전체 UI가 ko/en 하드코딩 또는 기본 브라우저 locale에 의존한다.
- Evidence:
  - `index.html:2,6-8`은 `<html lang="ko">`와 한국어 title/meta만 갖는다.
  - `src/state/appState.js:90-128`에 locale이 없고 `:181-184`의 unknown-field rejection 때문에 `locale` patch가 거부된다. 저장 키는 bookmarks/confirmed/recent만 존재한다(`:329-337`).
  - `src/catalog/discoveryUrl.js:21-99`의 state/parse/serialize에는 locale이 없고, `src/catalog/discovery.js:33-41`은 `toLocaleLowerCase('ko')`, `:116-149`는 ko/en 텍스트와 영어 `localeCompare`만 사용한다.
  - `header.js`, `discoveryMarkup.js`, `mainView.js`, `detailView.js`, `selectionDock.js`, `peekPreview.js`, `galleryPagination.js`, `audioWidget.js` 등에 한국어/영어 표시 문자열이 남아 있다. 앞서 정적 inventory에서 components 15 files/294 Hangul lines가 확인됐다. 각 subscriber의 change detector에도 locale이 없다.
  - `mockupRuntime.js:539,613,644,646,933,1164-1165`는 locale 인자 없는 `toLocaleString()`을 사용하고 `:1080`은 `localeCompare(..., 'ko')`를 고정한다.
- Expected Basis: 사용자 “메인 상단 언어 메뉴” 및 언어 전환 요구; `AI_AUDIT_DOC_STANDARD.md:642-655`(DBG-001 boot chain/state/locale wiring), `:576-589`(IMP-001), `:904-918`(SPEC-GAP-001).
- Actual: locale을 URL에 넣어도 drop되고 AppState는 저장하지 않는다. UI/검색/정렬/숫자/날짜의 locale 선택점이 하나도 없다. 따라서 언어 전환 후 어떤 영역이 갱신되어야 하는지에 대한 단일 invalidation signal도 없다.
- Impact: 상단 메뉴를 단순히 표시해도 카탈로그와 inspector는 이전 언어/ko 문자열을 계속 사용하고, CJK 숫자/정렬 결과는 브라우저마다 달라진다. URL 재방문·새로고침에서 언어를 재현할 수 없다.
- Suggested Action: 단일 `locale` state와 locale service를 도입하고 초기화 우선순위(URL `locale`/`lang` → localStorage → `navigator.languages` → ko 같은 정책)를 명세한다. 초기화 때 `document.documentElement.lang`을 갱신하고 메뉴 선택을 persistence/URL과 동기화한다. 모든 renderer subscriber/change detector에 locale을 포함하고, 검색은 selected locale + 승인된 fallback + ID/alias를 명시적으로 사용한다. 정렬·숫자·날짜는 `Intl.Collator/NumberFormat/DateTimeFormat(locale)`을 주입하며 stable ID를 최종 tie-break로 둔다. 검색어·facet·sort·view·bookmark·선택 style은 locale 전환으로 초기화하지 않는다.
- Re-audit Method: DOM 없는 state/URL unit test로 초기화 우선순위, round-trip, `document.lang`, reload를 확인한다. 5 locale 각각에서 header/discovery/main/detail/dock/peek/audio의 visible string 및 aria/placeholder inventory를 검사하고, 동일 catalog의 search result ID/order와 `Intl` formatted output을 비교한다.
- Confidence: High
- Notes: URL parameter 이름과 precedence는 구현 전에 제품 결정이 필요하다.

### [A01-F003] translatable display name이 CSS/DTCG machine key가 되고 palette stable ID는 legacy 단계에서 소실된다

- Area: Stable identifiers, Live CSS/HTML/Markdown/DTCG JSON, artifact contract
- Severity: Major
- Status: Confirmed
- Summary: style ID/data-theme/file base는 stable하지만 palette CSS variable/DTCG key는 표시 이름을 slugify한다. 표시 이름을 CJK로 번역하면 key가 빈 문자열 또는 충돌로 바뀐다.
- Evidence:
  - 정규 palette 계약에는 stable `id`가 있다(`src/catalog/contract.js:141`). 그러나 `src/catalog/legacyAdapter.js:22-26`은 palette id를 복사하지 않고 `name: color.name.en || color.name.ko`만 전달한다.
  - `src/utils/designSpecGenerator.js:229`는 `--color-${slugify(p.name)}`, `:572`는 `colorTokens[slugify(paletteColor.name)]`, `:630-631`의 slugify는 비 ASCII 문자를 제거한다. style selector는 `:232`의 `[data-theme="${subDesign.id}"]`로 stable ID를 사용하고, download filename은 `detailView.js:1038-1064`에서 ID 기반이다.
  - synthetic CJK probe 결과는 CSS `--color-` 4개와 DTCG key `''`였다. 영어 projection에서 빈/충돌 0건인 것은 현재 adapter가 en을 우선하는 우연한 완화다.
  - `src/utils/inspectorState.js:14-43` context에는 locale/revision이 없고, `detailView.js:231-267`은 취소 가능한 rAF 하나만 두고 현재 DOM을 읽어 네 pane을 순차 대입한다.
- Expected Basis: 사용자가 요구한 “CSS/HTML/DTCG machine identifiers는 번역하지 않고 human text만 지역화” 및 inspector 산출물 원자 갱신; `AI_AUDIT_DOC_STANDARD.md:576-589`(IMP-001), `:642-655`(DBG-001), `:282-312`의 deterministic runtime/debug 기준.
- Actual: palette stable ID가 generator까지 도달하지 않아 locale에 따라 machine key가 바뀐다. inspector artifact에는 locale/context generation이 없어 빠른 locale/tweak/render 전환 때 새 HTML과 이전 context의 CSS/MD/JSON이 섞일 방어가 없다.
- Impact: CJK 전환 시 유효하지 않은 CSS custom property/DTCG JSON이 생성되고, downstream token consumer가 값을 잃는다. stale rAF가 남으면 화면 언어와 code pane 언어가 불일치할 수 있다. 현재 다운로드 파일명은 ID 기반이라 안전하지만, 내부 artifact key 계약은 안전하지 않다.
- Suggested Action: canonical record의 palette ID를 legacy projection과 generator context에 보존하고, `--color-${stablePaletteId}` 및 DTCG key를 ID로 고정한다. locale은 CSS selector, custom-property name, DTCG structural key, extension namespace, `data-*` ID, 파일 basename에 절대 사용하지 않는다. human comments/heading/description/aria만 locale map으로 렌더한다. artifact context에 `{styleId, archetype, componentTab, device, locale, tweakRevision, runtimeRevision}`을 넣고 render generation을 캡처해 최신 generation만 commit한다. locale 전환 때 CSS/HTML/MD/JSON과 visible labels를 한 transaction으로 갱신한다.
- Re-audit Method: 동일 style의 ko/en/ja/zh-CN/zh-TW export를 생성해 CSS selector/custom-property, DTCG path, `data-theme`, 파일명 hash가 동일한지 비교하고 human fields만 달라지는지 검사한다. rapid locale→tweak→archetype 전환에서 stale generation commit이 없는지 fake-rAF 테스트와 artifact context assertion으로 확인한다.
- Confidence: High
- Notes: Markdown의 code fence/HTML machine markup은 번역 대상과 보존 대상의 경계를 별도 schema로 지정해야 한다.

### [A01-F004] radius 999가 catalog→defaultTweaks→state→DOM/export를 통과하고 광범위 selector로 전체 mockup에 전파된다

- Area: Data integrity, live tuner, CSS runtime, inspector exports
- Severity: Major
- Status: Confirmed
- Summary: 사용자가 보고한 999px은 실제 source grammar 값이다. 현재 validator와 AppState가 이를 정상 값으로 받아들이고, tuner의 UI max 64와 무관하게 DOM 및 4종 export에 999px을 쓴다.
- Evidence:
  - `src/catalog/packs/expansion/authoring.js:129-141`(`optical-stage`) 및 `:213-225`(`chrome-pop`)에 `radius: 999`가 있다. `:370,382`에서 각각 `tokens.radius='999px'`, `defaultTweaks.borderRadius=999`로 확장된다.
  - 스캐너에서 정확히 999인 공개 style은 8개였고, 기존 `src/styles/themeTokensExpansion.css:552-600,936-984`에도 999px block이 남아 있다.
  - `src/catalog/validation/rules.js:349-365`는 tweak를 0 이상 유한수만 허용하므로 999를 거부하지 않는다. Node probe에서 catalog error 0, `AppState.setState({liveTweaks:{borderRadius:999}})` true/저장 999였다.
  - `detailView.js:399-407` 및 `:772-779`가 `--theme-radius`와 `--tweak-radius`에 그대로 값을 쓰고, `:458`의 slider만 `max="64"`이다. `:1133-1137` input handler와 `designSpecGenerator.js:252,400,596`에도 clamp가 없다.
  - `index.css:2049-2076`와 `src/styles/interactive.css:2749-2805`가 root와 game/web/mobile/shop/blog/dashboard/media/chat의 다수 내부 element에 같은 radius를 적용한다.
- Expected Basis: `spec.md:62`의 0–64 radius 계약, `src/catalog/contract.js:104-106`의 `tokens`와 inspector `defaultTweaks`가 별도 계약이라는 설명, `AI_AUDIT_DOC_STANDARD.md:576-589`(IMP-001), `:870-884`(TEST-001).
- Actual: source 999 → generated default 999 → state 999 → CSS custom properties/DOM 999 → CSS/Markdown/DTCG output 999의 단일 경로가 열려 있다. 15 style에서 token radius와 default tweak radius가 이미 다른데, 현재 구현은 이를 분리해 표시하지만 validation/normalization 정책은 없다.
- Impact: 999px border radius가 pill 의도인지와 무관하게 broad selector가 전체 카드·버튼·입력·panel을 과도하게 둥글게 만든다. slider는 범위 밖 상태를 표시하지 못할 수 있지만 state/export는 계속 999를 유지한다. style swap/reset, URL 없는 reload, inspector copy/download 사이에 값이 달라질 위험도 있다.
- Suggested Action: `tokens.radius`(장식용 theme token)와 `defaultTweaks.borderRadius`(사용자 tuner)를 분리한 상태로 각 field의 명시적 min/max/step을 계약화한다. source/migration/catalog gate, AppState setter, slider, DOM writer, CSS/MD/DTCG generator가 같은 normalized resolver를 사용하게 한다. 999가 의도한 pill token이면 tuner default에는 넣지 말고 별도 semantic token/selector로 제한한다. 의도하지 않은 값이면 source에서 reject 또는 64로 명시적 migration한다. broad global propagation 대신 archetype별 허용 요소 목록과 semantic opt-in selector를 사용한다.
- Re-audit Method: 0, 64, 65, 999, `NaN`, negative 값을 source fixture/AppState/slider/DOM/CSS/MD/DTCG 각각에 넣어 reject/clamp 결과가 동일한지 검사한다. 8개 offending ID의 normalized value와 `tokens.radius`/`defaultTweaks` 분리를 확인하고, later browser pass에서 모든 8 archetype와 mobile/desktop의 element computed radius를 비교한다.
- Confidence: High
- Notes: 9999px의 `--radius-full`(`index.css:53`)은 UI filter pill용 별도 token이며, 이번 999px tuner bug와 혼동하지 않아야 한다.

### [A01-F005] locale 전환을 atomic state-preserving renderer transaction으로 수행할 경계가 없다

- Area: Mockup interaction state, renderer swap, inspector snapshot/staleness
- Severity: Major
- Status: Probable
- Summary: 현재 style renderer swap에는 일부 state-preserving 경로가 있지만 archetype/split rebuild는 snapshot을 주지 않는다. locale을 추가해 단순히 HTML을 다시 만들면 interaction/store/tweaks가 손실되거나 이전 언어 markup이 재사용될 수 있다.
- Evidence:
  - `detailView.js:189-206`은 archetype 변경을 `rebuildArchetypeViewport`로 처리하고, `:585-595`의 rebuild는 teardown 후 `hydrateMockup`을 snapshot 없이 호출한다.
  - style 변경의 `:618-636` `applyStatePreservingRendererSwap`만 `snapshotMockupState`를 넣어 store/controls를 복원한다. split tab 변경도 `:1365-1395`에서 두 viewport를 teardown/re-hydrate하며 `initialState`를 전달하지 않는다.
  - `mockupRuntime.js:136-143` snapshot은 semantic store와 controls를 저장하지만 locale/revision은 없고, `:127-133`은 dashboard rows HTML을 삭제한다. 반면 `:1040-1046`은 rows에 old `html`을 저장하고 `:1082`에서 그대로 재주입한다.
  - runtime human strings는 templates와 `mockupRuntime.js:523-529,951,1030`에 hardcode되어 있고, 사용자 입력 message는 locale 전환 시 보존되어야 할 별도 semantic data다. `detailView.js:1520-1521` subscriber는 모든 state 변경을 받지만 locale 분기/locale-aware render는 없다.
- Expected Basis: `spec.md:54`의 state-preserving renderer switching 및 사용자 “interaction state/theme/tweaks 유지” 요구; `AI_AUDIT_DOC_STANDARD.md:642-655`(DBG-001), `:282-312`(런타임 경로·결정적 debug).
- Actual: locale state 자체가 없어 현재 bug를 직접 재현할 수는 없지만, 새 state를 추가해도 기존 update path는 locale-only change를 full localized template render로 분류하지 않는다. rebuild/split은 초기 상태를 잃고, dashboard에는 old-language HTML snapshot을 섞을 수 있다. style cycle 자체는 `detailView.js:1191-1215`에서 대상 style의 defaultTweaks로 의도적으로 reset한다.
- Impact: 언어 전환이 style switch처럼 오인되면 사용자가 조작한 HP/cart/comments/chat/filter/sort, inspector tab/submode, live tweaks가 사라진다. 반대로 old DOM을 보존하면 화면은 새 언어인데 code pane/runtime labels는 이전 언어가 된다.
- Suggested Action: locale 변경을 별도 transaction으로 정의한다. 현재 semantic runtime store/controls, `liveTweaks` normalized revision, selected style/archetype/tab/device, inspector tab/submode, discovery state를 capture하고 localized template를 만든 뒤 같은 snapshot으로 hydrate한다. DOM의 old HTML을 state migration 데이터로 사용하지 말고 dashboard rows도 stable row data로 복원한다. locale-aware message keys를 렌더 시 resolve하되 사용자가 입력한 text는 그대로 보존한다. render generation을 증가시키고 모든 visible UI와 4 artifact pane을 한 commit에서 갱신한다. style/archetype 전환과 locale 전환의 보존 정책을 코드에 분리한다.
- Re-audit Method: 각 8 archetype에서 click/input state를 만든 뒤 locale을 5방향으로 왕복하고 store/controls/tweak/style ID/inspector tab의 hash를 비교한다. split A/B도 동일하게 검사하고, fake-rAF를 이용해 오래된 locale generation callback이 DOM/code pane을 덮지 않는지 확인한다.
- Confidence: Medium-High
- Notes: “locale 전환에서 보존”과 “style/archetype/device 전환에서 보존”의 정확한 범위는 제품 결정이 필요하다.

### [A01-F006] build/bundle/test boundary에 locale 품질 gate가 없고 초기 bundle 여유가 작다

- Area: Build, prebuild validation, tests, initial bundle architecture
- Severity: Major
- Status: Confirmed
- Summary: 현재 green test는 190개뿐이며 모두 ko/en·radius legacy 계약을 전제로 한다. prebuild는 5-locale completeness를 검사하지 않고, catalog index는 120 style pack을 eager import한다.
- Evidence:
  - `package.json`의 `prebuild`는 `npm run validate:catalog && npm run check:themes`, `test`는 `node --test`다. `scripts/validateCatalog.js:9-10,43`의 strict 모드는 별도 flag이고 prebuild 호출에는 없다.
  - `tests/catalogValidation.test.js:50-158,403-429` fixture/경계는 ko/en와 음수 tweak만 다루며 radius upper bound/999는 없다. `tests/styleContract.test.js:228-267,329-397`는 flat `name/nameEn/shortDesc`를 요구한다. `catalogDiscovery`, `inspectorState`, `designSpecGenerator`, `mockupRuntime`, `auditRemediation9`에도 locale/Intl/stale artifact/radius upper-bound 회귀가 없다.
  - `src/catalog/index.js:1-39`가 core와 expansion packs를 module load 시 모두 조립한다. `scripts/analyzeInitialBundle.js:69-149`는 bytes/references만 분석하고 locale chunk/completeness는 모른다.
  - `spec.md:390`의 기존 baseline은 initial JS gzip 86.73 kB, budget 88.98 kB(약 2.25 kB 여유), CSS 32.90/33.00 kB다. 번역 4개를 eager embedded data로 넣으면 여유를 초과할 가능성이 있다.
- Expected Basis: `AI_AUDIT_DOC_STANDARD.md:838-850`(BUILD-001), `:870-884`(TEST-001), `:576-589`(IMP-001/003), `report-contract.md:62-72`.
- Actual: 현 상태에서는 190/190이지만 요구된 기능의 실패 모드를 증명하지 않는다. build artifact를 새로 만들지 않아 실제 gzip delta는 미측정이며, locale data loading 설계도 없다.
- Impact: incomplete translation이 release까지 통과하고, 5 locale 데이터를 단일 eager catalog에 삽입하면 initial load budget/renderer lazy boundary를 깨뜨릴 수 있다. 회귀가 나도 기존 테스트가 감지하지 못한다.
- Suggested Action: machine catalog/search index는 eager로 유지하되 locale dictionary를 route/locale 단위 lazy chunk로 분리하거나, embedded 방식이라면 locale별 gzip budget을 별도로 산정한다. `prebuild`에 strict locale completeness/schema migration gate를 연결하고, 5 locale URL/state round-trip, `Intl`, translated machine-key invariant, 999 boundary, snapshot preservation, all-export consistency를 failure-mode tests로 추가한다.
- Re-audit Method: 구현 후 새 checkout에서 `npm test`와 build artifact analyzer를 실행하고, base/locale chunks의 gzip bytes를 `RENDER_SCALABILITY_BUDGETS`와 비교한다. strict gate가 누락·중복·잘못된 locale을 nonzero exit로 막는지와 migration fixture를 CI에서 확인한다.
- Confidence: High for missing gate; Medium for bundle overrun (actual delta not measured by instruction).
- Notes: 이번 감사에서는 사용자의 “생성물/서버 명령을 피하라” 지시에 따라 build를 수행하지 않았다.

### [A01-F007] CJK typography·폭/overflow 정책이 없어 “스타일이 깨지지 않음”을 보장할 수 없다

- Area: CSS responsive/layout/font and localized label length
- Severity: Minor
- Status: Probable
- Summary: CSS에는 locale-specific font stack이나 `:lang()` rule이 없고, 일부 header/inspector/swatches가 nowrap/ellipsis에 의존한다. 일본어·중국어로 길어진 human labels의 wrapping/width를 검증할 계약이 없다.
- Evidence:
  - `index.css:7`은 Cinzel/Fira Code/Inter/Space Grotesk만 import하고 `:36-39` generic Latin/system stack을 사용한다. `:lang()` scanner 결과 0건, CJK font reference 결과 0건이다.
  - `src/styles/interactive.css:2922-2935` inspector tab은 `white-space: nowrap`, `:2989-3005` code pane은 Fira Code/`word-break: break-all`이다. `audit9-detail.css:156-161` swatch name은 nowrap/ellipsis이고, `index.css:3686-3694` mobile axis node는 overflow hidden/ellipsis를 쓴다.
  - Header/search/filter는 `index.css:110-184,317-367`의 flex/min-width/wrap 조합에 의존하지만 locale별 최소 폭이나 long-label fixture가 없다.
- Expected Basis: 사용자 “언어를 바꿔도 스타일이 깨지지 않음”, `AI_AUDIT_DOC_STANDARD.md:576-589`의 UI/domain contract 및 responsive 검증 취지.
- Actual: CJK용 폰트/line-break/label width 기준이 없고 브라우저 fallback에 맡긴다. code block은 machine identifiers 보존을 위해 LTR/nowrap 정책이 필요하지만 human heading은 별도 wrapping 정책이 필요하다.
- Impact: header/menu, facet chip, inspector tab, palette name, split tab이 잘리거나 높이를 밀어 layout을 깨뜨릴 수 있다. CJK glyph fallback 차이로 visual regression도 발생한다.
- Suggested Action: `document.lang`과 연동하는 CJK fallback/font 정책을 정의하고, human label에는 `min-width:0`, 적절한 `overflow-wrap:anywhere`/wrap을 적용한다. machine code/CSS/JSON block은 LTR 및 보존 가능한 overflow 정책을 별도로 둔다. locale·viewport별 max string fixture와 accessibility name 검사를 추가한다.
- Re-audit Method: 5 locale × desktop/tablet/mobile에서 header, discovery controls, detail sidebar, inspector, split tabs의 scrollWidth/clientWidth 및 clipped text를 측정하고, font loading 실패 시에도 fallback이 유효한지 확인한다. 브라우저 시각 검증은 구현 후 별도 pass에서 수행한다.
- Confidence: Medium
- Notes: 실제 pixel clipping은 이번 감사에서 browser를 실행하지 않았으므로 Probable로 남긴다.

## 6. Uncertainties and Clarifications Needed

- “5 locale 지원”이 120 style의 모든 name/summary/classification/editorial/palette, 8 category, 10 facet/90 value, 8 archetype template/runtime/audio/UI 문자열까지 완역을 뜻하는지, 아니면 field별 fallback을 허용하는지 결정해야 한다.
- fallback을 허용한다면 순서(예: zh-TW → zh-CN → en → ko), 사용자에게 incomplete 상태를 표시할지, `ready` catalog gate를 차단할지 명세해야 한다.
- URL parameter를 `locale`로 할지 `lang`으로 할지, URL/localStorage/navigator 중 우선순위와 URL에 locale을 공유할지 결정해야 한다.
- Live CSS/HTML/Markdown/DTCG JSON에서 human heading/comment/description/aria만 지역화하고 selector, custom-property, DTCG structural key, extension namespace, `data-*` ID, file basename은 고정할지 확인이 필요하다. 현재 구조와 사용자 요구에는 “고정”이 안전한 권고다.
- locale 전환에서 보존할 범위(현 interaction store, 사용자 입력, controls, tweaks, inspector tab/submode, discovery state)와 style/archetype/device 전환의 보존 범위를 분리해 명세해야 한다.
- 999px이 의도된 pill/round token인지, 아니면 expansion authoring의 실수인지 확인해야 한다. 현재 15개 style에서 `tokens.radius`와 `defaultTweaks.borderRadius`가 이미 다른 값이므로 하나의 숫자로 합치는 수정은 데이터 의미를 손상시킬 수 있다.

## 7. Perspective Decision

**REWORK REQUIRED / Needs Spec Clarification**

5 locale을 도입할 구조적 경로 자체는 가능하지만, 현재는 schema/completeness gate, locale state/bootstrap, UI/runtime wiring, stable machine-key projection, atomic inspector/runtime invalidation, radius bounds, build/test gate가 모두 준비되지 않았다. 특히 8개 style의 999 radius가 validator와 state/export를 통과하는 것은 사용자가 보고한 시각적 위험과 직접 일치한다. 위 정책을 확정하고 Major finding을 재검증하기 전에는 이 관점에서 PASS로 판정할 수 없다.
