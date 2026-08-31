# Sub Audit Report

## 1. Audit Metadata

| 항목 | 내용 |
|---|---|
| 감사 ID | A01 |
| 감사 회차 | 9 |
| 감사 모드 | Standard-backed |
| 독립 관점 | 목표·계약·문서·구현·기능·UI/시안 정합성 |
| 프로젝트 루트 | `/home/eunho1/Projects/web/design_sample_selector` |
| 기준 문서 | `AI_AUDIT_DOC_STANDARD.md`, `multi-audit/references/report-contract.md` |
| 산출물 | `docs/multi_audit/9/sub_audit_01_contract_ui.md` |
| 최종 판정 | HOLD — 주요 계약/UI 위험 해소 및 조용한 Chrome 재검증 필요 |

## 2. Assigned Scope

현재 정적 웹앱의 문서 계약과 실제 UI/시안의 정합성을 독립 점검했다. 포함 범위는 index/bootstrap, Grid·Bento·Spectrum 및 페이지네이션, 검색·category·bookmark·10 facet·sort·URL 복원, Detail의 120 스타일·8 archetype·Desktop/Mobile·Web 4 tabs, 스타일/테마 전환, Peek/Dock/Confirm, Split compare, inspector 4 tabs·3 CSS modes·copy/download/snapshot, slider·audio·canvas, 반응형·접근성·loading/error/retry, 관련 테스트와 현재 Chrome QA 증거다.

판정 기준은 사용자 목표, `spec.md`·`designs.md`·`README.md`·`BUILD_GUIDE.md`·`CHANGELOG.md` 및 결정 문서, 테스트된 계약, 일반적인 UI 정합성/접근성 불변조건이다. 문서에 없는 동작은 임의로 요구사항으로 추가하지 않았고, 문서와 구현이 충돌하는 경우에는 해당 충돌 자체를 finding으로 기록했다.

## 3. Excluded and Uninspected Scope

- 독립성 보존을 위해 `docs/multi_audit/**`의 과거 감사 보고서는 읽지 않았다. 부모 또는 다른 감사자의 결론을 근거로 삼지 않고 소스·테스트·현재 QA 출력으로 재확인했다.
- `.git`, `node_modules`, generated `dist`의 수동 전수 코드 리뷰, 외부 서비스·유료 호출·실제 배포는 제외했다.
- 이 감사 중 동시 Chrome 실행이 성능 수치를 오염시킬 수 있다는 통지를 받은 뒤에는 새 Chrome을 시작하지 않았다. 그 전에 공식 프로젝트 Chrome QA 스크립트로 임시 격리 프로필을 사용한 검사는 수행했으며, 임시 artifact는 확인 후 삭제했다.
- 현재 환경에서 Chrome DevTools MCP 도구가 제공되지 않아 DevTools MCP 직접 검사는 수행하지 못했다. 대신 프로젝트가 제공하는 CDP 기반 `verifyCatalogDiscoveryChrome.js`와 `verifyCatalog120Chrome.js`를 사용했다.
- 현재 런타임 시각 증거는 대표 Detail 데스크톱/모바일/Split 화면과 QA 계측에 한정된다. 120×8×2 매트릭스는 DOM/크기/오류 신호를 계측하는 방식이며 모든 스타일을 사람이 육안 확인한 증거가 아니다. Peek/Confirm의 별도 PNG 증거도 없다.
- 소스·테스트·설정·제품 문서는 수정하지 않았고, 지정된 본 보고서만 작성했다.

## 4. Evidence Examined

### 4.1 권위 문서와 계약

- `AI_AUDIT_DOC_STANDARD.md:1-1010`: 감사 pass, finding 필드, Severity/Status, release gate와 IMP/BUILD/TEST/SPEC-GAP 패턴.
- `/home/eunho1/.codex/skills/multi-audit/references/report-contract.md:1-160`: 개별 보고서 필수 7개 섹션과 finding 필드/독립성 계약.
- `spec.md:1-5,18-20,35-75`: v2.3.0 Actual 120, 8 categories·120 styles, 8 core archetypes, ecommerce checkout simulation modal, blog reading mode, inspector·theme·preview·audio/canvas 계약.
- `spec.md:190-243,270-275,279-368`: inspector/selector/preview/theme 불변조건, discovery·scalability·loading/retry, 접근성·actual 120 수량 계약.
- `designs.md:1-4,64-127,152-175,199-263,267-339`: 현재 UX/아키텍처, preview/discovery/scalability, 120 catalog, ecommerce checkout modal 및 blog reading-mode 설계.
- `README.md:1-3,50-85,94-180`: 사용자에게 약속한 120 catalog, preview, discovery, ecommerce 주문/결제 모달 시뮬레이션, blog 기능.
- `BUILD_GUIDE.md:1-25,180-232,256-266`: `npm run check`, catalog/theme/Chrome QA 절차, 120 baseline과 interaction gate.
- `CHANGELOG.md:1-8,58-61,94-118`, `DESIGN_DECISIONS.md`의 Wave/Actual 120 결정, `implementation_summary.md`, `audit_roadmap.md`, `CAPABILITY_MAP.md`, `LESSONS_LEARNED.md`, 관련 `SPEC-*.md`를 구현·계약 대조에 사용했다.

### 4.2 구현·테스트 소스

- `index.html:6-7`의 title/meta count와 `src/components/header.js:12-36,95`의 runtime 120 count를 비교했다.
- `src/main.js:17-140`, `src/state/appState.js:74-233`, `src/components/mainView.js:22-121,324-496`, `src/utils/selection.js:12-144`, `src/components/selectionDock.js:25-250`, `src/components/peekPreview.js:16-147`에서 bootstrap·state·gallery·selection flow를 확인했다.
- `src/components/detailView.js:141-169,555-637,766-1214`에서 same-archetype zero-rebuild 전환, viewport/metadata, inspector, keyboard/focus trap을 확인했다.
- `src/components/archetypeTemplates.js:1-31,77,253-450`와 `src/preview/registry.js:297-323`에서 8 archetype markup, ecommerce/blog controls, renderer/motion root 계약을 확인했다.
- `src/components/mockupRuntime.js:65-145,210-382,482-583,670-680`에서 runtime action·checkout·reading-mode·blog progress·cleanup을 확인했다.
- `src/styles/themeTokens.css:7-610`, `src/styles/themeTokensExpansion.css:7-1367`, `src/styles/interactive.css:1857-2054,2604-2888`, `index.css:1893-2035,3607-3715`에서 theme token selector와 responsive scroll/CSS를 확인했다.
- `src/components/audioWidget.js:9-134`, `src/wasm/visualEngine.js:1-242`에서 audio/canvas·reduced-motion 경로를 확인했다.
- `tests/previewIntegration.test.js:87-162,209-226`, `tests/mockupRuntime.test.js:152-206`, `tests/sandboxDeviceStyles.test.js:24-81`, `tests/designSpecGenerator.test.js:15-22`와 Chrome QA 스크립트의 실제 assertion 범위를 확인했다.

### 4.3 실행 증거

- `npm test` — 종료 코드 0, 총 152개 테스트 pass, fail 0.
- `npm run validate:catalog && npm run check:themes` — 종료 코드 0. catalog errors 0, warnings 56(legacy의 accessibility/source/contrast 경고), ready 96은 quality clean, theme CSS는 current.
- `node scripts/verifyCatalogDiscoveryChrome.js --artifacts=/tmp/dss-a01-discovery` — 종료 코드 0. Chrome 151 격리 프로필, 120 styles, 36-result contract, 10 facet groups, 89 labeled inputs, Grid/Bento/Spectrum 각 4 pages·120 reachability, URL/popstate·empty reset·keyboard·responsive(320–1440) 시나리오, runtime signals/issues 0. `/tmp/dss-a01-discovery`는 확인 후 삭제했다.
- `node scripts/verifyCatalog120Chrome.js --artifacts=/tmp/dss-a01-catalog120` — 실제 QA 종료는 실패. 두 번의 관측에서 interaction max가 각각 245.6ms와 230.9ms로 `<=200ms` gate를 넘었고, 두 번째 report의 다른 계측은 catalog 120, 8 archetype×2 device 1,920 cases, Web 480 states, split 120/12, diagnostics 0, runtime signals 0, overflow 0였다. 두 번째 임시 디렉터리 `/tmp/dss-a01-catalog120-detail`도 확인 후 삭제했다. 동시 Chrome 실행이 있었으므로 이 성능 finding은 조용한 단일 재실행으로 확정 강도를 재검증해야 한다.
- 순수 Node 정적 대조에서 8 archetype 각각의 120 style HTML이 `unique 120, duplicates 0`였고, canonical thumbnail도 `unique 120, duplicates 0`였다. renderer id와 motion id도 120개씩 고유했다(예: `swiss-grid → swiss-unit/grid-reveal`, `corporate-minimal → corp-unit/sparkline`). 이는 동일 archetype style transition에서 이전 root를 보존하면 실제 시안이 바뀌지 않는다는 판정의 근거다.
- `.antigravity/archive`의 `catalog-discovery-chrome-qa`, `catalog120-chrome-qa`, `render-scalability-chrome-qa`, `wave1-chrome-qa`의 `report.json`/대표 PNG는 보조 증거로만 취급했다. 과거 artifact는 현재 HEAD 전수 육안 검증의 대체로 사용하지 않았다.

## 5. Findings

### A01-F001 — 같은 archetype 스타일 전환이 renderer/motion/content를 교체하지 않음

- **Area:** Detail · same-archetype style switch · zero-rebuild.
- **Severity:** Major.
- **Status:** Confirmed.
- **Pattern:** IMP-001 (구현/UI 계약 불일치), TEST-001 (상태 전환 회귀 테스트 공백).
- **Summary:** zero-rebuild 경로가 `data-theme`와 sidebar metadata/chip만 바꾸고 viewport의 기존 HTML, renderer root, motion class를 그대로 보존한다.
- **Evidence:** `src/components/detailView.js:141-169`의 `needThemeSwapOnly`가 같은 archetype 전환을 `applyZeroRebuildThemeSwap`으로 보내고, `src/components/detailView.js:587-637`은 `viewport.setAttribute('data-theme', ...)` 및 metadata만 갱신한다. 같은 파일 `:555-565`의 `rebuildArchetypeViewport`에 있는 `innerHTML = getArchetypeHTML(...)`/`hydrateMockup(...)`는 이 경로에서 호출되지 않는다. `src/preview/registry.js:297-323`는 renderer·motion에 따라 실제 root/class를 만들고, 순수 Node 대조에서 120 style의 renderer/motion/HTML이 모두 고유했다.
- **Expected Basis:** `spec.md:18-20,190-221`의 120 preview/theme contract와 selector/preview single-source 불변조건. 스타일 chip을 바꾸면 선택된 style의 시안·renderer·motion이 보여야 하며, zero-rebuild는 상태 보존을 위한 최적화이지 이전 시안을 재사용하는 계약이 아니다.
- **Actual:** 현재 HEAD Chrome 151 집중 재현에서 `spatial-glass-ui` Web Detail에서 `ai-native-gradient`로 전환한 뒤 `data-theme`, metadata, selectedChip은 새 id로 바뀌었지만 viewport는 `.e120-spatial-glass-ui-unit=true`, `.e120-ai-native-gradient-unit=false`, Spatial 이름 잔존/AI 이름 부재였고 `innerHTML` 길이도 동일했다. 이는 새 style의 markup/renderer가 표시되지 않은 것이다.
- **Impact:** Detail이 선택한 style과 다른 디자인 시안을 보여준다. style-specific layout, content, interaction, motion이 누락되며 inspector/시각 비교의 신뢰성이 깨진다. 120개 중 같은 archetype 전환 전반에 구조적으로 적용될 수 있다.
- **Suggested Action:** style 전환 시 `ArchetypeStateStore`를 보존한 채 새 style의 renderer/motion/HTML을 재수화하거나, style-specific content를 교체하는 별도 zero-rebuild update를 구현한다. 기존 state 보존과 renderer 교체를 함께 검증해야 하며, `detailView` 상태 전환 테스트와 Chrome에서 before/after root·HTML assertion을 추가한다.
- **Re-audit Method:** Detail에서 동일 archetype의 서로 다른 legacy/expansion style을 연속 선택하고, `data-theme`, root class, style-specific name/content, motion class, innerHTML marker를 모두 새 style과 비교한다. 게임 HP/cart 등 기존 interactive state가 보존되는지도 확인한다.
- **Confidence:** High.
- **Notes:** 1,920-case 직접 render matrix는 transition을 거치지 않으므로 이 결함을 잡지 못한다. 실제 style transition을 별도로 계측해야 한다.

### A01-F002 — Peek 및 Confirm preview에 선택 theme가 적용되지 않음

- **Area:** Peek · selection Dock/Confirm · preview theme application.
- **Severity:** Major.
- **Status:** Confirmed.
- **Pattern:** IMP-001.
- **Summary:** 선택된 style을 렌더링하는 Peek/Confirm viewport에 `data-theme`가 설정되지 않아 theme token의 `:root` fallback을 사용한다.
- **Evidence:** `src/components/peekPreview.js:28-46,89-101`은 component HTML을 삽입·hydrate하지만 `#peek-viewport`에 `data-theme`를 설정하지 않는다. `src/components/selectionDock.js:111-128,145-155`의 `#confirm-preview`도 동일하다. `src/styles/themeTokens.css:7,23-610`과 `themeTokensExpansion.css:7,23-1367`은 style id selector와 `:root` fallback을 구분한다. `scripts/verifyCatalog120Chrome.js:728-734`는 Peek의 `dataset.theme`를 읽을 수 있지만 assertion은 root/busy만 검사한다. 현재 Chrome 151 대조에서 Peek/Confirm의 `data-theme=null`, computed `--theme-accent=#00F0FF`, `--theme-bg=#0B0F19`였고 `spatial-glass-ui` 기대값은 `#79D7FF/#08101D`였다.
- **Expected Basis:** `spec.md:200-221`, `README.md:64-85`, `designs.md:152-175`의 선택 style id와 preview theme의 단일 계약. Peek/Dock/Confirm은 사용자가 확정 전에 선택한 시안을 믿고 판단하는 표면이다.
- **Actual:** root fallback 색상이 표시되므로 선택된 style의 palette/background와 일치하지 않는다. component renderer 자체가 존재해도 preview가 선택 style과 같은 시각 결과라는 보장이 없다.
- **Impact:** 사용자가 Peek/Confirm에서 잘못된 색상·톤으로 style을 비교/확정한다. expansion/legacy 모두에서 style fidelity가 손상되고, Detail의 정상 theme 적용과 selection preview 사이에 계약 불일치가 생긴다.
- **Suggested Action:** Peek와 Confirm의 viewport에 component 삽입 전에 선택 `subDesign.id`를 `data-theme`로 설정하고, 비동기 로딩/교체 시에도 id를 갱신·정리한다. QA에 `#peek-viewport`와 `#confirm-preview`의 dataset 및 대표 computed token assertion을 추가한다.
- **Re-audit Method:** 대표 legacy와 expansion style을 각각 Peek→Dock→Confirm으로 열고 `dataset.theme === selectedId`, computed accent/background가 해당 token과 일치하는지 확인한다. style 교체·loading 완료·close/reopen에서도 stale id가 없는지 확인한다.
- **Confidence:** High.
- **Notes:** 현재 QA는 Peek root와 `aria-busy`만 검사하며 theme fidelity는 검사하지 않아 green 결과가 이 결함을 가린다.

### A01-F003 — 문서가 약속한 ecommerce checkout simulation modal이 구현되지 않음

- **Area:** Ecommerce archetype · checkout flow.
- **Severity:** Major.
- **Status:** Confirmed.
- **Pattern:** IMP-001, SPEC-GAP-001.
- **Summary:** ecommerce의 “주문/결제 모달 시뮬레이션” 계약 대신 toast, cart clear, drawer close만 수행한다.
- **Evidence:** `spec.md:40-41`, `designs.md:305`, `README.md:150`, `CHANGELOG.md:117`은 checkout/order-payment simulation modal을 명시한다. `src/components/archetypeTemplates.js:253-362`에는 `data-action="shop-checkout"` 버튼은 있으나 checkout dialog markup이 없다. `src/components/mockupRuntime.js:520-540`의 `handleShopCheckout`는 성공 toast를 띄우고 cart를 비운 뒤 drawer를 닫으며 `role="dialog"` 또는 modal summary/confirm/cancel/focus flow를 생성하지 않는다.
- **Expected Basis:** 문서화된 ecommerce core archetype의 즉시 구매/장바구니 checkout simulation modal과 일반적인 modal 접근성 계약.
- **Actual:** 사용자는 결제 결과를 확인하는 modal surface나 취소/닫기 단계를 볼 수 없다. selection confirm sheet와 ecommerce checkout은 별개 surface인데 대체되지도 않는다.
- **Impact:** 8 archetype 중 하나의 명시적 핵심 flow가 부재하며, 문서/README의 사용자 기대와 실제 UI가 직접 충돌한다.
- **Suggested Action:** 문서 계약을 유지할 경우 접근 가능한 checkout simulation dialog(summary, confirm/cancel, close/Escape, focus return)를 구현한다. 제품 범위가 바뀐 것이 의도라면 먼저 `spec.md`·README·designs·CHANGELOG를 명확히 갱신하고 계약을 재승인한다.
- **Re-audit Method:** ecommerce에서 “바로 구매”와 cart drawer checkout을 각각 실행해 `role=dialog`, 결제 summary, confirm/cancel, close/Escape, focus return, cart state를 검사한다.
- **Confidence:** High.
- **Notes:** 현재 테스트는 template/action 존재와 일반 runtime 동작을 일부 확인하지만 checkout dialog의 존재를 assertion하지 않는다.

### A01-F004 — blog reading mode가 state/class만 바꾸고 시각 규칙이 없음

- **Area:** Blog archetype · reading mode.
- **Severity:** Major.
- **Status:** Confirmed.
- **Pattern:** IMP-001, TEST-001.
- **Summary:** reading-mode button이 `blog-light-mode` class/state를 토글하지만 해당 class를 정의하는 CSS가 없다.
- **Evidence:** `spec.md:41`, `README.md:151`, `designs.md:306`은 blog dark/light reading mode를 약속한다. `src/components/archetypeTemplates.js:392-396`이 버튼을 만들고 `src/components/mockupRuntime.js:542-554`의 `handleBlogReadingMode`가 `blog-light-mode`를 토글한다. 그러나 `rg -n "blog-light-mode" index.css src/styles/interactive.css src/styles/wave1-styles.css src/styles/expansion-preview.css` 결과는 runtime source 한 곳뿐이며, `src/styles/interactive.css:1922-2054`의 blog 규칙에도 class override가 없다.
- **Expected Basis:** 문서화된 blog dark/light reading mode는 클릭 전후의 읽기 색상/상태가 달라져야 한다.
- **Actual:** class 이름은 바뀌지만 CSS 변수/배경/본문색 규칙이 바뀌지 않아 사용자에게 실질적인 light mode가 제공되지 않는다.
- **Impact:** blog core interaction 하나가 표시상 동작하지 않는다. 특히 어두운 theme에서 readability/reading-mode 기대가 충족되지 않는다.
- **Suggested Action:** blog root 범위에 light-mode token override와 `aria-pressed`/상태 label을 추가하고, computed background/color가 실제로 바뀌는 회귀 테스트를 추가한다.
- **Re-audit Method:** Blog에서 mode 전후 root class, `aria-pressed`, computed background/color/border를 비교하고 theme 전환 후에도 mode state와 token이 일관되는지 확인한다.
- **Confidence:** High.
- **Notes:** 현재 mockupRuntime 테스트는 일반 action/error/idempotence를 다루지만 reading-mode CSS 효과를 검증하지 않는다.

### A01-F005 — 1024px 이하 blog progress listener가 실제 scroll container를 듣지 않음

- **Area:** Blog archetype · responsive reading progress.
- **Severity:** Minor.
- **Status:** Probable.
- **Pattern:** IMP-001, TEST-001.
- **Summary:** progress 계산 listener는 `#mockup-viewport`에 붙지만 tablet/mobile responsive layout에서는 `.modal-body-grid`가 scroll container다.
- **Evidence:** `src/components/mockupRuntime.js:139`가 `bindBlogProgress(rootEl, unit, cleanups)`를 호출하고, `:670-680`은 전달받은 `scroller`의 `scrollHeight/clientHeight`와 scroll event를 사용한다. 데스크톱 CSS `src/styles/interactive.css:2697-2708`에서는 `.mockup-viewport { overflow-y:auto; }`지만, `:2857-2882`의 max-width 1024 rule은 `.modal-body-grid { overflow-y:auto; }`, `.mockup-viewport { overflow:visible; }`로 바꾼다. 따라서 작은 화면에서 사용자가 실제로 스크롤하는 요소와 listener 대상이 달라진다.
- **Expected Basis:** `spec.md:41`, `designs.md:306`의 blog progress와 responsive contract.
- **Actual:** desktop에서는 동작할 가능성이 있으나 1024px 이하에서 modal body를 스크롤해도 progress fill이 갱신되지 않거나 0%에 머물 가능성이 높다.
- **Impact:** mobile/tablet blog reading experience와 progress indicator가 불일치한다.
- **Suggested Action:** 실제 scroll owner를 전달하거나 scroll chain을 관찰하고, 375/768/1024 breakpoint별 progress update 테스트를 추가한다.
- **Re-audit Method:** 375·768·1024 viewport에서 blog body를 끝까지 scroll하고 progress width/ARIA value가 0→100으로 변하는지 확인한다.
- **Confidence:** Medium-High.
- **Notes:** 새 Chrome을 시작하지 말라는 운영 조건 때문에 이 finding은 현재 static evidence 기반 Probable로 남겼다.

### A01-F006 — game arena target이 키보드로 활성화되지 않음

- **Area:** Game archetype · keyboard accessibility.
- **Severity:** Minor.
- **Status:** Confirmed.
- **Pattern:** IMP-001, A11Y.
- **Summary:** click target을 `div role="button" tabindex="0"`로 만들었지만 Enter/Space keydown activation이 없다.
- **Evidence:** `src/components/archetypeTemplates.js:77`의 `arena-target`은 native button이 아닌 div role button이다. `src/components/mockupRuntime.js:106-119`의 keydown 처리 대상은 chat/blog input이고 game target용 handler가 없다. runtime action은 click delegation에 의존한다.
- **Expected Basis:** `spec.md:37,270-275`, `designs.md:196`의 game clicker와 키보드/focus-visible 접근성 불변조건. role button은 Enter/Space로 동일 action을 제공해야 한다.
- **Actual:** 마우스 click은 `game-tap`을 실행하지만 keyboard user는 focus 후 Enter/Space로 HP/coin 변화를 만들 수 없다.
- **Impact:** 8 archetype 중 game의 핵심 action이 키보드 사용자에게 차단된다.
- **Suggested Action:** native `<button>`으로 교체하거나 Enter/Space keydown을 `game-tap`에 연결하고 default scrolling을 막는다. focus-visible style과 state change 회귀 테스트를 추가한다.
- **Re-audit Method:** Tab으로 arena target에 도달한 뒤 Enter와 Space 각각으로 HP/coin/toast 변화를 확인하고, Space의 page scroll 부작용도 검사한다.
- **Confidence:** High.
- **Notes:** `tabindex`가 있어 focus 가능하다는 사실만으로 keyboard activation 계약이 충족되지는 않는다.

### A01-F007 — Actual 120 Chrome QA의 interaction latency gate 실패

- **Area:** Actual 120 runtime performance gate.
- **Severity:** Major.
- **Status:** Confirmed.
- **Pattern:** BUILD-001, TEST-001.
- **Summary:** 공식 `verifyCatalog120Chrome.js`가 정의한 interaction max 200ms gate를 두 관측 모두 넘겼다.
- **Evidence:** `scripts/verifyCatalog120Chrome.js:780-787`가 `report.interactions.maxMs <= 200`을 검사한다. 실제 실행 두 번에서 max가 245.6ms와 230.9ms였고 QA 결과는 `actual 120 Chrome QA FAIL`이었다. 같은 결과에서 catalog/matrix/diagnostics/runtime signals/overflow는 정상으로 보고됐다.
- **Expected Basis:** `BUILD_GUIDE.md:200-232,256-266`의 Actual 120 Chrome QA baseline과 200ms interaction gate.
- **Actual:** gate fail 한 건으로 QA 결과가 실패 처리된다. 다만 당시 여러 Chrome QA가 동시에 실행 중이어서 측정 환경 contention의 영향은 배제되지 않았다.
- **Impact:** 현재 HEAD가 승인된 performance/QA baseline을 충족한다고 판정할 수 없고 release gate가 열리지 않는다.
- **Suggested Action:** 동시 Chrome이 없는 단일 격리 실행에서 동일 스크립트를 재실행해 제품 회귀와 환경 오염을 분리한다. 조용한 재실행에서도 실패하면 느린 interaction 경로를 profile하고 200ms 이하로 개선한다.
- **Re-audit Method:** 단일 Chrome 151 프로필에서 `node scripts/verifyCatalog120Chrome.js --artifacts=<검증된 임시경로>`를 실행하고 exit code/issues/maxMs를 기록한다. 새 artifact는 검사 후 즉시 정확한 임시 경로만 삭제한다.
- **Confidence:** Medium.
- **Notes:** 관측된 gate failure 자체는 Confirmed이나, 성능 수치의 제품 귀속은 조용한 재실행 전까지 보류한다. discovery Chrome QA는 별도로 모든 시나리오를 pass했다.

### A01-F008 — browser title/meta description이 Actual 120과 불일치

- **Area:** index/bootstrap · user-facing metadata.
- **Severity:** Minor.
- **Status:** Confirmed.
- **Pattern:** IMP-004.
- **Summary:** runtime header는 120을 표시하지만 document title과 description은 여전히 36종이라고 말한다.
- **Evidence:** `index.html:6-7`은 title에 `36종 라이브 시안`, description에 `8대 대분류 36종`을 고정한다. 반면 `src/components/header.js:12-36,95`는 `getAllSubDesigns().length`로 120을 표시하고, `spec.md:1-20`, `README.md:1-3`은 Actual 120을 현재 계약으로 선언한다.
- **Expected Basis:** Actual 120 문서 계약과 사용자-facing quantity/version metadata 동기화.
- **Actual:** browser tab, 공유 미리보기, 검색 metadata가 실제 catalog 수보다 작은 과거 수량을 노출한다.
- **Impact:** 제품 수량·버전에 대한 신뢰와 외부 공유/SEO metadata가 잘못된다. 앱 내부 discovery count는 120이라 기능 자체와는 분리된 metadata 결함이다.
- **Suggested Action:** title/meta의 36을 120으로 갱신하거나 catalog source-of-truth에서 생성하고, release 시 metadata count 동기화 검사를 추가한다.
- **Re-audit Method:** 정적 grep과 browser `document.title`/description 조회가 Actual 120 문서와 일치하는지 확인한다.
- **Confidence:** High.
- **Notes:** visible header/filter는 현재 QA에서 120으로 확인되어 metadata-only finding으로 분류했다.

### A01-F009 — cart drawer의 empty-cart guard가 사실상 도달 불가능함

- **Area:** Ecommerce archetype · cart validation edge case.
- **Severity:** Minor.
- **Status:** Confirmed.
- **Pattern:** IMP-001.
- **Summary:** quantity가 항상 1 이상으로 clamp되어 `!cart.length && qty <= 0` 조건이 false가 되므로, 빈 cart drawer checkout도 성공 처리된다.
- **Evidence:** `src/components/mockupRuntime.js:482-489`의 `handleShopQty`는 quantity를 최소 1로 clamp한다. 같은 파일 `:520-523`의 checkout guard는 cart가 비었고 qty가 0 이하인 경우만 차단한다. `src/components/archetypeTemplates.js:336-362`에는 cart checkout action이 별도로 노출된다.
- **Expected Basis:** cart checkout은 cart 상태를 기준으로 유효성을 검증해야 한다. 문서의 simulated checkout flow와 일반적인 empty-state 불변조건에 따른 edge contract다.
- **Actual:** cart drawer를 연 뒤 cart item이 없어도 checkout handler가 성공 toast, cart clear, drawer close를 수행할 수 있다. `qty` 조건 때문에 empty-cart 차단 분기가 실질적으로 죽어 있다.
- **Impact:** 사용자가 상품 없이 주문 성공을 보게 되어 simulated commerce 상태가 부정확하다. F003의 modal 부재와 별개의 validation 결함이다.
- **Suggested Action:** drawer checkout은 `cart.length > 0`을 명시적으로 요구하고 empty state/disabled button을 제공한다. “바로 구매”는 별도 direct-purchase action으로 분리해 의도를 명확히 한다.
- **Re-audit Method:** cart empty, add/remove item, qty boundary, direct purchase를 각각 실행해 success/error/disabled state와 cart persistence를 확인한다.
- **Confidence:** High.
- **Notes:** direct “바로 구매”가 cart 없이 성공하는 것은 의도일 수 있으므로, finding의 대상은 cart drawer 전용 checkout 경로다.

## 6. Uncertainties and Clarifications Needed

- `src/components/detailView.js:465-508`의 inspector tabs는 tab role은 있으나 `aria-controls`, pane의 `tabpanel`/`aria-labelledby` 연결이 없다. `src/components/audioWidget.js:46-47` 및 Detail slider도 visible text/title은 있으나 명시적 label/aria-label 계약이 불분명하다. 문서가 이 exact ARIA topology를 명시하지 않아 이번 보고서의 Confirmed finding으로 올리지 않았으며, 접근성 기준을 확정하면 별도 점검이 필요하다.
- Confirm sheet와 Peek card의 `role="dialog"`가 실제 modal인지 non-modal preview인지 문서가 완전히 구분하지 않는다. 이번 finding은 modal semantics가 아니라 선택 theme id가 누락된 사실에 한정했다.
- F001/F002의 현재 Chrome 151 재현은 visual 전체 전수 검사가 아니라 대표 style과 DOM/computed token 대조다. 정적 renderer uniqueness와 결합하면 구조적 위험은 높지만, 모든 120 style의 모든 breakpoint를 사람이 육안 확인한 것으로 해석해서는 안 된다.
- F005는 CSS/JS scroll-owner가 결정적으로 다르지만, 모바일 browser의 상위 scroll forwarding 구현 여부를 새 Chrome으로 재현하지 못해 Probable로 남겼다.
- F007은 두 번의 실제 QA gate failure가 있으나 동시 Chrome 실행에 따른 contention 가능성이 있다. 단일 조용한 실행 결과가 우선한다.
- 현재 테스트/QA는 zero-rebuild style transition, Peek/Confirm theme dataset/computed token, checkout modal, blog reading-mode visual effect, game keyboard activation을 직접 assertion하지 않는다. 이 공백은 기능이 추가로 깨졌다는 뜻이 아니라 현재 green test 결과만으로 해당 계약을 보증할 수 없다는 뜻이다.

## 7. Perspective Decision

**HOLD / REWORK REQUIRED.**

Discovery의 120 catalog·facet·URL·responsive 시나리오와 152개 단위 테스트는 pass했고, static 120×8×2 구조 matrix도 reachability/diagnostic/overflow 측면에서는 양호하다. 그러나 사용자 목표의 핵심인 “선택한 디자인 시안이 실제로 표시되는가”에서 F001(Detail style switch renderer stale)과 F002(Peek/Confirm fallback theme)가 확인되었다. 또한 문서가 약속한 ecommerce checkout modal과 blog reading mode가 각각 구현되지 않았고(F003/F004), game keyboard action과 responsive blog progress에도 계약 위험이 있다. 따라서 현재 상태를 전체 기능 정상 또는 visual contract PASS로 승인할 수 없다.

우선 재작업·재검증 순서는 F001/F002 → F003/F004 → F005/F006/F009이며, F007은 동시 실행 없는 단일 Chrome에서 성능 gate를 재확인해야 한다. F008은 릴리스 전 metadata 동기화로 처리할 수 있는 Minor 위험이다.
