# Implementation Summary (`implementation_summary.md`)
**Project Name:** Web Design Sample Selector (`design_sample_selector`)  
**Version:** 2.3.0  
**Document Status:** Current System Blueprint / Audit 9 Repository & Local Crostini PASS

---

## 1. System Breakdown & Modular Architecture

The application is structured into zero-dependency, native ES modules that communicate via clean event-driven interfaces and shared reactive state.

```
/home/eunho1/Projects/web/design_sample_selector/
├── index.html                  # Single page entry point with semantic HTML structure
├── index.css                   # Core CSS design system, legacy preview styles, bento & modal layouts
├── src/
│   ├── main.js                 # Application bootstrap & lifecycle coordinator
│   ├── state/
│   │   ├── appState.js         # Reactive state manager, observer pattern, discovery state, LocalStorage
│   │   └── discoveryUrlState.js# URL ↔ appState browser adapter
│   ├── catalog/
│   │   ├── contract.js         # Schema v1 vocabulary, JSDoc records, sorting and recursive freeze
│   │   ├── categories.js       # 8 ordered canonical category definitions
│   │   ├── facets.js           # 10 ordered discovery facet vocabularies
│   │   ├── discovery.js        # Pure search/facet/sort/era query contract
│   │   ├── discoveryUrl.js     # Canonical discovery URL parser/serializer
│   │   ├── index.js            # Sole canonical query API and alias/publication resolution
│   │   ├── legacyAdapter.js    # Canonical StyleRecord → current flat UI projection
│   │   ├── validation/
│   │   │   ├── index.js        # Public validation API and current-catalog entrypoint
│   │   │   ├── report.js       # Deterministic frozen reports and validation error
│   │   │   ├── rules.js        # Structural, relationship, token, and reference rules
│   │   │   ├── color.js        # Conservative CSS color parsing and contrast math
│   │   │   ├── quality.js      # Provenance, asset, accessibility, and contrast policy
│   │   │   └── currentCatalog.js # Public catalog API + preview inventory → frozen CatalogSnapshot
│   │   ├── packs/core/
│   │       ├── manifest.js     # Core pack v1.1.0 / 36 membership
│   │       ├── styles-foundations.js  # Swiss through Retro, 12 records
│   │       ├── styles-contemporary.js # Editorial through Soft 3D, 12 records
│   │       └── styles-wave-1.js       # Source-grounded ready Wave 1, 12 records
│   │   └── packs/expansion/            # 7 packs × 12, 21 grammar authoring source
│   ├── theme/
│   │   ├── contract.js         # 13 semantic token mappings and root fallback
│   │   ├── projection.js       # Frozen canonical/alias theme definitions and compatibility map
│   │   ├── stylesheet.js       # Deterministic browser-safe CSS serializer
│   │   └── index.js            # Public theme API
│   ├── preview/
│   │   ├── contract.js         # Stable tabs, reference kinds, motion channels and error contract
│   │   ├── registry.js         # Immutable registry, explicit queries/renders and derived inventory
│   │   ├── renderers.js / renderers-wave-1.js / renderers-expansion.js # actual 120 Web renderers
│   │   ├── thumbnails.js / thumbnails-wave-1.js / thumbnails-expansion.js # actual 120 thumbnails
│   │   ├── motions.js / motions-wave-1.js / motions-expansion.js # actual 120 motion descriptors
│   │   ├── thumbnailEntry.js / motionEntry.js / componentEntry.js # 종류별 소비 진입점
│   │   ├── componentLazyEntry.js / componentLazyRetryEntry.js # 브라우저 재시도용 facade
│   │   └── index.js            # Sole synchronous compatibility preview API
│   ├── scalability/
│   │   └── renderWindow.js     # Frozen DOM/bundle budgets, gallery window and bounded picker
│   ├── data/
│   │   └── categories.js       # Thin compatibility entrypoint preserving existing named exports
│   ├── audio/
│   │   └── synthAudio.js       # Web Audio API ambient BGM 16-track synth & 14 UI sound FX engine
│   ├── wasm/
│   │   └── visualEngine.js     # Canvas 2D particle engine, audio-reactive visualizer & pause loop (not WASM)
│   ├── components/
│   │   ├── header.js           # Search, category, independent bookmark, view switcher, compare launcher
│   │   ├── discoveryControls.js / discoveryMarkup.js # Accessible facet/status/sort/chip UI
│   │   ├── galleryModel.js     # Shared canonical results and view-specific grouping
│   │   ├── mainView.js / galleryPagination.js # 3 bounded gallery projections, pager and keyboard nav
│   │   ├── detailView.js / stylePickerMarkup.js # bounded Detail/Split pickers and inspector
│   │   ├── lazyPreviewLoader.js # retryable Detail/component dynamic import boundary
│   │   ├── archetypeTemplates.js# Standard semantic HTML templates for 8 core page archetypes
│   │   ├── splitCompareTabs.js # Split ARIA tab state and keyboard navigation contract
│   │   ├── mockupTemplates.js  # Thin compatibility entry delegating to the public preview API
│   │   ├── mockupRuntime.js    # Descriptor-based motion hydration, interactions & WeakMap cleanup
│   │   ├── selectionDock.js    # Bottom dock + confirm sheet
│   │   ├── peekPreview.js      # Hover/focus live peek
│   │   └── audioWidget.js      # Floating BGM player control panel & mini spectrum visualizer
│   ├── styles/
│   │   ├── themeTokens.css     # Generated/tracked Core 36 initial CSS
│   │   ├── themeTokensExpansion.css # Generated/tracked 84-style async CSS
│   │   ├── audit9-detail.css   # Lazy Detail checkout·Blog state presentation
│   │   ├── expansion-preview.css # 21 expansion grammar async presentation
│   │   ├── interactive.css     # Universal top bar, 4-tab inspector, 8 archetypes styles, dock, peek, thumbs, mockup FX
│   │   └── wave1-styles.css    # Wave 1 root-scoped visuals, responsive and reduced-motion rules
│   └── utils/
│       ├── designSpecGenerator.js # Live CSS, Markdown, DTCG 2025.10 JSON, and download engine
│       ├── inspectorState.js   # Event-time selected design resolution and inspector defaults
│       ├── clipboard.js        # Safe DOM textContent copy-to-clipboard utility & toast renderer (XSS-safe)
│       └── selection.js        # Draft / detail / confirm / peek / reduced motion helpers
├── scripts/
│   ├── validateCatalog.js      # Compact/verbose/JSON/strict CLI and exit codes
│   ├── generateThemeStyles.js  # Explicit theme CSS write/read-only check CLI
│   ├── verifyWave1Chrome.js    # Isolated Crostini Chrome runtime/visual QA
│   ├── verifyCatalogDiscoveryChrome.js # Isolated discovery/URL/a11y QA
│   ├── verifyRenderScalabilityChrome.js # Actual/synthetic capacity and recovery QA
│   └── verifyCatalog120Chrome.js # 120×8×2 actual runtime/visual QA
├── tests/                      # Catalog, theme, preview registry/runtime, inspector, split tab, and responsive contracts
├── spec.md                     # Master Technical Specification (v2.3.0)
├── designs.md                  # UI/UX & Design Token Specification (v2.3.0)
├── DESIGN_DECISIONS.md         # Architecture Decisions & Rationale
├── BUILD_GUIDE.md              # Scaffolding, execution & deployment guide
├── audit_roadmap.md            # Quality & Phase Verification Checklist
├── LESSONS_LEARNED.md          # Reusable milestone findings and recovery cautions
└── CHANGELOG.md                # Release & Change History Log
```

---

## 2. File Responsibilities & Exported Interfaces

### 2.1 `src/state/appState.js`
- **Responsibility:** Holds reactive global state (`AppState`), provides `getState()`, `setState()`, `setActiveArchetype()`, `toggleBookmark()`, `setCompareSubIds()`, and `subscribe(listener)` methods with validated LocalStorage synchronization.

### 2.2 `src/catalog/` & `src/data/categories.js`
- **Canonical responsibility:** `src/catalog/index.js` exposes schema version, categories, styles, facets, eight pack manifests, alias resolution and category lookup from recursively frozen records. The actual catalog contains 8 categories × 15 = 120 styles (24 `legacy` + 96 `ready`), 10 facets, 13 semantic tokens and three preview references per style.
- **Compatibility responsibility:** `src/catalog/legacyAdapter.js` projects canonical records into `SubCategoryDesign`; `src/data/categories.js` only re-exports the existing `MAIN_CATEGORIES`, `STYLE_MOTION`, `SUB_ID_ALIASES`, `getAllSubDesigns`, `findSubById`, and `canonicalizeSubId` interfaces.
- **Boundary behavior:** Unknown or non-string external IDs return `null`/empty arrays. Default queries expose `legacy/ready`, unpublished records require explicit opt-in, and no catalog query silently falls back to Swiss.
- **Verification:** `tests/styleContract.test.js`와 `catalogExpansion120.test.js`가 기존 24·36 subset parity, actual 120/category 15, ready 품질, 불변성·저장 alias를 검사한다. Chrome actual audit는 세 보기의 120종과 신규 84종 Desktop/Mobile 구조 변화를 확인한다.

### 2.2.1 Catalog discovery query, URL, controls and gallery model
- **순수 질의 경계:** `src/catalog/discovery.js`는 한국어·영어·alias·category·facet metadata 검색, category와 독립 bookmark, 10개 facet의 AND/OR 정규화, 네 안정 정렬과 시대 그룹을 canonical `StyleRecord`에서 계산한다. 입력과 공개 결과는 변경하지 않는다.
- **상태 경계:** `discoveryUrl.js`는 `q/category/f/sort/view/saved`를 허용 목록과 120자 한계로 parse/serialize하고, `discoveryUrlState.js`는 initial URL·`popstate` 복원과 `history.replaceState` 갱신만 담당한다.
- **UI 경계:** header는 검색/category/bookmark/view를, 독립 discovery root는 live status·10개 native facet·정렬·chip/reset을 담당한다. `galleryModel.js`는 한 canonical 결과 집합을 Grid category groups, Bento global order, Spectrum era groups로 투영한다.
- **접근성·반응형:** 검색을 포함한 89개 native 입력 모두 이름을 가지며 compact facet disclosure, 포커스 복원, 44px target, 320~1440px overflow 0과 reduced-motion을 보장한다.
- **검증:** 현재 전체 180/180 테스트·build가 통과한다. 격리 Chrome `151.0.7922.173`에서 9개 사용자 시나리오·6개 폭과 세 보기 각각 4페이지/120 ID 도달, console/network/application diagnostics/issue 0 증거를 보존한다.

### 2.2.2 Render window, bounded pickers and on-demand preview code
- **순수 비용 경계:** `src/scalability/renderWindow.js`는 Gallery 36개, Detail 24개, Split 12개/slot, 초기 JS/CSS와 interaction 예산을 동결 상수로 제공한다. `createRenderWindow()`와 `createBoundedPicker()`는 DOM/app state를 import하지 않고 입력을 변경하지 않으며 전체 ID 순서와 selected pinning을 보존한다.
- **UI 경계:** `mainView.js`는 canonical 결과를 36개 local page로 자르고 `galleryPagination.js`가 native 이전/다음과 polite 범위를 렌더한다. `stylePickerMarkup.js`는 Detail category 검색과 Split slot 검색의 제한 thumbnail markup을 공유하며 native Split select는 전체 정규 스타일을 유지한다.
- **코드 전달 경계:** 초기 UI는 `thumbnailEntry.js`·`motionEntry.js`만 정적으로 소비한다. `lazyPreviewLoader.js`는 Peek/확정 component graph와 Detail/Split 전체 graph를 별도 경계로 불러오며 각 경계는 primary + retry 한 번 뒤 terminal이 된다. Promise 공유, stale request 차단과 phase/attempt diagnostic을 제공하고 마지막 importer를 무제한 반복하지 않는다.
- **표시·모션 수명:** 초기 UI는 normal flow의 hidden 상태에서 폰트와 레이아웃을 정착시킨 뒤 노출한다. gallery render cleanup이 shared `IntersectionObserver`를 해제하며 offscreen/reduced-motion animation을 중지한다.
- **검증 상태:** 전체 180/180, actual 120 + synthetic 60/120 기능 행렬, 초기 JS/CSS `88.60/32.86kB` gzip을 통과했다. 독립 재감사의 공통 Detail CSS·pre-init volume·Zoom 회귀를 수정했고, CDP 왕복이 섞인 기존 interaction 표본은 무효화한 뒤 페이지 내부 처리시간 직렬 3회를 새로 기록했다.

### 2.3 `src/catalog/validation/` & `scripts/validateCatalog.js`
- **Responsibility:** Validates frozen catalog snapshots without mutation and reports structural, ID, alias, relationship, preview/asset, token, provenance, accessibility, and calculable contrast findings through stable code/severity/path fields.
- **Build boundary:** `validate:catalog` supports compact, verbose, JSON, and strict modes with exit codes 0/1/2. `prebuild` runs the default mode before every Vite production build; no validation module is imported by the browser graph.
- **Current baseline:** 8 categories, 120 styles, 10 facets, eight packs; 0 errors and 56 visible warnings, all from the legacy 24 (`ACCESSIBILITY_NOTES_REQUIRED` 24, `SOURCE_REQUIRED` 24, `CONTRAST_LOW` 5, `CONTRAST_UNCHECKED` 3). The ready 96 subset is 0 errors/0 warnings. Strict mode intentionally exits 1 because it includes legacy warnings.
- **Verification:** The current 175-test gate, catalog baseline of 0 errors/56 warnings, two-file theme freshness check and production build pass. Chrome 151 evidence covers Wave 1, discovery, actual 120 and synthetic scalability matrices without application-origin failures.

### 2.4 `src/theme/`, `scripts/generateThemeStyles.js` & generated theme CSS
- **Canonical responsibility:** Projects all publication states from the public catalog into recursively frozen `ThemeDefinition` records. The explicit 13-key mapping produces both CSS custom properties and the compatible `THEME_TOKENS_MAP`; optional `themeEffects.backdropBlur` remains separate from tweak defaults.
- **Generated artifact boundary:** The browser-safe pure serializer owns root fallback, 120 canonical selectors, aliases and registered effects. The Node-only CLI writes Core 36 initial CSS and expansion 84 async CSS only through `generate:themes`; `check:themes` checks both read-only in `prebuild`.
- **Export boundary:** Live CSS, Markdown and DTCG generators resolve the canonical theme definition. The former hand-written 24-style map is gone, its export name remains a derived compatibility view, and unknown IDs return the existing no-selection artifact instead of Swiss values.
- **Verification:** Existing 24·36 map/runtime/export SHA-256 baselines remain exact while actual 120 fixtures pass. DTCG `box-shadow: none` is a transparent zero shadow. Vite builds 76 modules; statically referenced initial JavaScript/CSS is `88.60/32.86kB` gzip and expansion presentation remains async.

### 2.5 `src/preview/` & `src/components/mockupTemplates.js`
- **정규 책임:** legacy, Wave 1, expansion renderer/thumbnail/motion definition을 `registry.js`가 한 번 검증·조립한다. inventory는 definition에서 사전순·재귀 동결 값으로 파생되며 catalog pack은 구현 함수가 아니라 세 참조 ID만 소유한다.
- **공개 경계:** `src/preview/index.js`는 `getPreviewReferenceInventory`, `hasPreviewReference`, renderer capability/motion 조회와 두 동기 render 함수를 제공한다. Gallery, Detail, Peek, Dock과 Web archetype은 이 경계를 직접 사용하고 내부 `Map`·render 함수는 노출하지 않는다.
- **호환 경계:** `getMockupHTML(previewType, tab, subDesign)`은 `thumb` 요청을 `subDesign.thumbMotif`로, 나머지를 공개 component API로 전달하는 얇은 parity 진입점이다. 새 스타일별 분기나 fallback을 추가하지 않는다.
- **오류·모션 경계:** 기능 조회의 unknown은 `false`/`null`, 실제 render/hydration 실패는 안정적인 `code`, `referenceKind`, `referenceId`, `tab`을 가진 `PreviewRegistryError`다. renderer output은 `.mockup-unit` root와 비실행 HTML 계약을 통과해야 하며 script/embedded context, inline event handler, `javascript:` URL은 거부한다. motion channel은 실제 effect/template/thumbnail/interaction 근거를 기술한다.
- **현재 제약:** definition 조립과 공개 호환 API는 정적·동기식이고 runtime registration·remote HTML은 없다. 내부 UI는 종류별 entry와 승인된 dynamic import loader를 사용한다. 120종 초과는 별도 사양과 예산 검토가 필요하다.
- **검증:** inventory `120/120/120/0`, 기존 24·36 승인 지문과 actual 120 fixture, Web 480탭, 120종 × 8 아키타입 960개 Node 출력과 Chrome 1,920개 device 상태가 통과했다. 신규 thumbnail은 interactive tag를 포함할 수 없고 미등록 참조는 fallback 없이 실패한다.

### 2.6 `src/components/archetypeTemplates.js`
- **Responsibility:** Defines standard semantic HTML templates for the 8 core page archetypes (`Game`, `Web SaaS`, `Mobile App`, `E-Commerce`, `Blog`, `Dashboard`, `Media Player`, `Chat`). The Web archetype obtains its four component-tab bodies from the public preview API; the other seven templates remain locally owned. E-commerce direct/cart checkout source, empty-cart disabled state, Blog progress/reading-mode ARIA and 500-character input bounds are part of this semantic contract.

### 2.7 `src/components/mockupRuntime.js`
- **Responsibility:** Resolves registered motion descriptors, applies one unit class and optional `aria-hidden` effect layer, implements real-time interaction simulators across all archetypes, and owns WeakMap-based listener/timer cleanup. It snapshots only approved form/archetype state for a renderer swap, excludes style-owned Dashboard row markup, restores filter/sort controls against the new renderer, and closes transient checkout dialogs. Checkout focus trap, Blog scroll-owner progress, Game keyboard activation, 500-character/50-item bounds and coalesced short timers share this lifecycle boundary.

### 2.8 `src/components/detailView.js`
- **Responsibility:** Renders the Universal Top Design Selector Bar (8 categories + active-category chips capped at 24 with search), Split native selects and 12-thumbnail slot pickers, 8 Archetype viewport, distinct Desktop/Mobile width, live parameter sliders, 4-tab inspector, exports, and WAI-ARIA Focus Trap. A style A→B transition preserves the outer viewport, rebuilds B's inner renderer/motion/Inspector and migrates only approved runtime state; every generation action resolves the current theme from `appState` at event time. Escape is handled before form-control shortcuts and focus is restored only to a connected opener.

### 2.9 Isolated Crostini Chrome QA evidence
- **Responsibility:** 네 Chrome QA 스크립트가 격리 local Vite/Chrome 세션을 시작하고 CDP로 재현 가능한 증거를 수집한다. `verifyCatalog120Chrome.js`는 actual 120 전용 행렬을, `analyzeInitialBundle.js`는 production initial asset 예산을 담당한다.
- **Wave 1 evidence:** `.antigravity/archive/audit9/wave1-sidebar-final-verified/report.json` records 576 device states and issue count 0 across page console, exception, same-origin network and HTTP diagnostics. All visible controls remained inside the 12 new Desktop/Mobile roots.
- **Discovery evidence:** `.antigravity/archive/audit9/discovery-sidebar-final-verified/report.json` records 9 scenarios, 6 responsive widths, three gallery modes, 89/89 named inputs, 44px targets, reduced-motion and diagnostics/issue 0. Representative 320px and 1440px screenshots preserve the completed UI state.
- **Scalability evidence:** `.antigravity/archive/audit9/scalability-sidebar-final-verified/report.json`은 actual 120과 synthetic 60/120의 bounded DOM·failure/retry·observer, 초기 `88.60/32.86kB` gzip, LCP `784ms`, CLS `0`, diagnostics/issue 0을 기록한다.
- **Audit 9 actual evidence:** `.antigravity/archive/audit9/rework-sidebar-final-verified-{1,2,3}/report.json`은 매회 actual 1,920 device 상태, Web 480탭, 공통 Detail computed style와 제목·설명 가시영역, pre-init volume, Zoom, stateful transition, checkout, Blog, Dashboard·keyboard와 diagnostics/issue 0을 기록한다. hard metric은 no-op을 제외한 input→요구 state/DOM 정착의 제품 처리시간이며 세 회 median/max는 `20.95/51.6ms`, `20.4/121.1ms`, `21.45/131.9ms`다. 정착 뒤 2-frame wall time과 Long Task는 별도 presentation diagnostic이다.

### 2.9.1 GitHub Pages artifact and recovery gate

- `vite.config.js`는 `/design_sample_selector/` base와 Vite manifest를 생성한다. `verifyPagesArtifact.js`는 production entry와 전체 lazy closure를 검증하고 release manifest를 만든다.
- `.github/workflows/deploy-pages.yml`은 clean install, Node/빌드 게이트와 검증된 `dist` directory artifact를 한 deployment unit으로 게시한다. source root publish는 지원하지 않는다.
- `qa:pages:chrome`은 project-site subpath에서 normal load, Peek native open/double click, Detail/Split, outer retry success, shared graph terminal, render/hydrate rollback과 safe diagnostic을 검사한다.
- Audit 10 재감사에서 15-file closure, network fault 7종과 consumer fault 2종, actual 120의 1,920상태·Web 480탭, Wave 1 576상태, Discovery 9시나리오·6폭, Scalability actual+synthetic 60/120이 모두 diagnostics/issue 0으로 통과했다. 증거는 `.antigravity/archive/audit10-re-audit/`과 `docs/multi_audit/10/re_audit_evidence_10.md`에 있다. 실제 Pages는 아직 source entry를 제공하므로 workflow 게시 전 live 판정은 HOLD다.

### 2.10 `src/audio/synthAudio.js`
- **Responsibility:** Generates 16 procedural ambient background synthesizer tracks and 14 dynamic UI sound effects with automated `onended` node disconnection. AudioContext 생성 전 volume도 app state에 저장해 최초 master gain에 적용한다. Initialization/resume and SFX synthesis failures resolve `false`, stop scheduler state and never report playback success; the widget visualizer owns rAF across view, visibility, reduced-motion and teardown transitions.

### 2.11 `src/wasm/visualEngine.js`
- **Responsibility:** Runs Canvas 2D particle physics with audio-reactive spectrum pulsation, `prefers-reduced-motion` compliance, and modal pause/resume lifecycle controls. No WebAssembly module.
