# Sub Audit Report

## 1. Audit Metadata

- Audit Turn: Multi Audit 10, Sub Audit 01 (2026-08-31)
- Perspective: 목표·계약·문서·구현·기능/UI 정합성
- User Goal: “디자인 시안의 미리보기 불러오지 못함이 뜸. 다시시도는 무응답. 더블클릭시 상세 시안을 불러오지 못함. 좀 더 자세히 점검하여 안정성 및 동작을 검증합니다.”
- Audit Basis: Standard-backed / Goal-driven
- Standard Path: `/home/eunho1/Projects/web/design_sample_selector/AI_AUDIT_DOC_STANDARD.md`
- Report Contract: `/home/eunho1/.codex/skills/multi-audit/references/report-contract.md`

## 2. Assigned Scope

- 제품 문서: `spec.md`, `designs.md`, `README.md`, `BUILD_GUIDE.md`, `implementation_summary.md`, `DESIGN_DECISIONS.md`, `audit_roadmap.md`, `CHANGELOG.md`, `LESSONS_LEARNED.md`
- 구현·배포 경계: `src/main.js`, `src/components/mainView.js`, `src/components/lazyPreviewLoader.js`, `src/components/peekPreview.js`, `src/components/selectionDock.js`, `src/components/detailView.js` 및 `archetypeTemplates.js`, `componentEntry.js`, `componentLazy*`, `selection.js`, `mockupRuntime.js`의 관련 preview/state 경로; `index.html`, `vite.config.js`, `package.json`과 저장소의 GitHub Pages workflow/config 존재 여부
- 검증: `tests/renderScalability.test.js`, `tests/auditRemediation9.test.js`, 관련 `scripts/verify*Chrome.js`의 lazy preview·Detail·Dock·keyboard 경로
- 핵심 계약: 초기 preview/component/detail 지연 로딩 실패, visible loading/error/retry/cancel, stale/중복 요청, gallery double-click/Enter, selection dock Detail 진입, 그리고 이를 재현할 수 있는 Node/Chrome QA

## 3. Excluded and Uninspected Scope

- `node_modules/`, `dist/`, `.git/`, 생성·벤더 트리, 운영 배포/CSP 및 외부 서비스 상태
- 이전 `docs/multi_audit` 보고서와 그 결론
- 빌드, Vite 서버, Chrome QA 및 생성 artifact/profile 쓰기가 발생하는 명령은 실행하지 않음
- 위 범위 밖의 기능(오디오·캔버스·카탈로그 authoring 등)은 preview 진입/상태 계약과 직접 연결된 부분만 확인함
- 실제 브라우저·GitHub Pages 배포 URL에서의 네트워크 실패 재현은 실행하지 않았으므로, 아래 retry/Pages 결함은 모듈 그래프·호출 흐름·배포 파일 존재 여부에 대한 정적 판정임

## 4. Evidence Examined

- 문서 계약: `spec.md:234-243, 245-253, 373-377`, `designs.md:222-242`, `README.md:112-119, 168-170`, `BUILD_GUIDE.md:181-223, 256-267`, `implementation_summary.md:127-132, 146-168`, `DESIGN_DECISIONS.md:277-299, 303-322, 326-348`, `audit_roadmap.md:58-90, 172-210`, `CHANGELOG.md:10-17, 35-42, 54-61`, `LESSONS_LEARNED.md:67-79, 81-101`
- Detail lazy boundary: `src/main.js:95-233` (loading/error UI, retry/cancel bindings, focus trap, request token, Detail module import)
- Loader and module graph: `src/components/lazyPreviewLoader.js:1-47`, `src/preview/componentLazyEntry.js:1-15`, `src/preview/componentLazyRetryEntry.js:1-15`, `src/preview/componentEntry.js:1-40`, `src/components/detailView.js:13-19, 267-407, 589-623, 1256-1387`, `src/components/archetypeTemplates.js:7-31, 124-158`
- Pages/static-host boundary: `index.html:11-14, 41-42`, `vite.config.js:1-13`, `package.json:9-25`; repository file search found no `.github/workflows`, Pages deploy script, `CNAME`, `404.html`, or other Pages publication config
- Gallery/selection paths: `src/components/mainView.js:324-353, 376-438`, `src/components/selectionDock.js:103-143, 184-233`, `src/utils/selection.js:12-40, 85-139`
- Peek/stale path: `src/components/peekPreview.js:21-63, 66-117, 136-146`; Confirm/Dock stale path: `src/components/selectionDock.js:103-143`
- Tests and QA: `tests/renderScalability.test.js:393-487`, `tests/auditRemediation9.test.js` lazy Detail assertions, `scripts/verifyRenderScalabilityChrome.js:476-593`, `scripts/verifyCatalog120Chrome.js:925-983, 1407-1465`, `scripts/verifyCatalogDiscoveryChrome.js:634-693`
- Read-only commands: `node --test tests/renderScalability.test.js tests/auditRemediation9.test.js` (47/47 passed); `node --test` (180/180 passed); `rg` source/test/QA searches for lazy retry and interaction handlers

## 5. Findings

### [A10-F001] Retry facade가 공유 의존 그래프를 무효화하지 않아 실제 component/CSS 실패에서 다시 시도가 무응답이 될 수 있음

- Area: 구현·복구 lifecycle (`lazyPreviewLoader`와 lazy module dependency graph)
- Severity: Major
- Status: Confirmed
- Summary: 현재 retry는 실패한 outer entry의 URL만 바꾼다. `componentLazyEntry.js`와 `componentLazyRetryEntry.js`는 모두 동일한 `./componentEntry.js`를 정적으로 import하고, `componentEntry.js`의 top-level CSS dynamic import도 동일 URL이다. Detail retry도 `detailView.js?retry=1`만 바꾸며 Detail의 정적 dependency인 `archetypeTemplates.js`→`componentEntry.js`는 바뀌지 않는다. 따라서 outer entry가 아니라 공유 dependency 또는 CSS가 실패한 경우 retry가 실패한 module-map 항목을 다시 사용한다.
- Evidence:
  - `src/components/lazyPreviewLoader.js:8-21`은 importer Promise가 reject될 때만 `pending`을 비우고 `importerIndex`를 다음 entry로 이동한다. `:31-39`의 두 retry importer는 각각 Detail outer URL과 component lazy outer URL만 다르게 한다.
  - `src/preview/componentLazyEntry.js:2-5`와 `src/preview/componentLazyRetryEntry.js:2-5`는 둘 다 `./componentEntry.js`에서 같은 두 export를 import한다.
  - `src/preview/componentEntry.js:9-16`은 브라우저에서 `themeTokensExpansion.css`, `expansion-preview.css`, `audit9-detail.css`를 top-level `Promise.all`로 요청한다. 이 dependency가 reject되면 두 component entry 모두 같은 실패 URL을 의존한다.
  - `src/components/detailView.js:13-19`→`src/components/archetypeTemplates.js:7`의 정적 import graph는 `componentEntry.js`를 Detail module graph에 포함한다. `main.js:204-218`은 이 전체 graph를 하나의 `loadDetailViewModule()` retry 경계로 감싼다.
  - 설계는 실패 module map을 피하는 retry를 완료했다고 `spec.md:239-240`, `DESIGN_DECISIONS.md:280, 284-285, 293`, `CHANGELOG.md:61`에서 주장한다. 그러나 구현의 URL 변경은 공유 dependency까지 전파되지 않는다.
- Expected Basis: `spec.md:239-240`의 loading/error/cancel/retry 및 실패 URL 회피 계약, `designs.md:232-239`의 Detail/component renderer retry boundary, D3D `IMP-003/IMP-004` 및 `TEST-001`의 실패·복구 경로 검증.
- Actual: outer importer 자체가 네트워크에서 실패하는 단순 케이스는 두 번째 facade로 회복할 수 있다. 반면 `componentEntry.js` 또는 그 CSS가 실패하면 retry facade가 다른 URL로 그 dependency를 재요청하지 않는다. 현재 loader에는 dependency invalidation이나 retry attempt별 cache-busting을 위한 공개 경계가 없다.
- Impact: 사용자가 본 “미리보기를 불러오지 못했습니다” 뒤 `다시 시도`를 눌러도 같은 실패가 즉시 반복될 수 있다. Peek/Confirm과 Detail/Split이 공유하는 component/CSS 실패가 모두 영향을 받으며, 화면은 오류 상태를 보여 주지만 실제 복구는 보장하지 못한다.
- Suggested Action: retry attempt마다 실패 가능 dependency graph까지 고유 URL/entry로 분리하거나, component/CSS dependency를 retry 가능한 단일 경계 안에서 재평가하도록 설계를 수정한다. 렌더/hydration 예외도 같은 loader가 재사용된 resolved Promise에 고착되지 않도록 명시적인 invalidate/reset 계약을 정한다. 실제 실패 지점별로 하나의 실패만 주입하고 retry 성공을 검증하는 Chrome fixture를 추가한다.
- Re-audit Method: Chrome CDP `Fetch`에서 `componentEntry.js`와 각 async CSS(그리고 Detail의 `archetypeTemplates` dependency) 중 하나를 첫 요청에서만 실패시킨다. Peek, Confirm/Dock, Detail, Split 각각에서 loading→visible error→retry→실제 renderer root를 확인하고, retry 후 실패 URL이 재사용되지 않는지와 same-origin network error가 0인지 기록한다. 동일 검증을 중복 호출 및 stale view 전환 중에도 수행한다.
- Confidence: High
- Notes: 구현 결함은 “모든 retry가 항상 실패한다”가 아니라 “outer entry 실패 외의 dependency 실패를 복구하지 못한다”는 범위다. 이 한정은 사용자 관찰의 원인을 확정하지 않지만, 관찰된 no-op retry와 정확히 양립한다.

### [A10-F002] Detail/Split의 실제 component renderer가 중앙 retryable component loader를 우회함

- Area: 문서·구현 계약 / Detail·Split 렌더 호출 흐름
- Severity: Major
- Status: Confirmed
- Summary: 문서상 Detail/Split component renderer도 `lazyPreviewLoader.js`의 중앙 loader를 사용해야 하지만, 실제 Detail/Split과 style transition은 `getArchetypeHTML()`을 동기 호출한다. Web archetype 내부의 component renderer는 `archetypeTemplates.js`가 직접 import한 `componentEntry.js`에서 실행된다. 중앙 `loadComponentPreviewModule()`은 `peekPreview.js`와 `selectionDock.js`에서만 사용된다.
- Evidence:
  - `src/components/detailView.js:18`은 `getArchetypeHTML`을 정적으로 import한다. `:407`, `:589`, `:623`은 Detail 초기/아키타입·스타일 전환 시 동기 `getArchetypeHTML(...)` 호출이고, `:1318`, `:1348`, `:1379`, `:1387`은 Split 양쪽 viewport에서 같은 호출을 한다.
  - `src/components/archetypeTemplates.js:7`은 `renderPreviewComponent`를 `../preview/componentEntry.js`에서 직접 import하고, `:127-131`에서 Web component body를 즉시 렌더한다.
  - `src/components/peekPreview.js:8, 36-44`와 `src/components/selectionDock.js:11, 117-128`만 `loadComponentPreviewModule()`을 호출한다. `detailView.js`에는 해당 loader 호출이 없다.
  - 반대로 문서는 `spec.md:239`, `designs.md:232, 238-239`, `implementation_summary.md:130`, `DESIGN_DECISIONS.md:284`에서 Detail/Split과 Peek/확정 renderer가 중앙 loader를 사용한다고 명시한다.
- Expected Basis: Detail/Split/Peek/Confirm의 component renderer가 동일한 retryable loading/error/cancel/retry·stale contract를 공유해야 한다는 `spec.md:239-240` 및 D3D `IMP-001/IMP-003` 양방향 계약.
- Actual: Detail module 자체는 `main.js:198-219`에서 lazy/error/retry boundary를 가지지만, Detail/Split component renderer에는 component loader의 독립 loading/error/retry UI가 없다. Component/CSS dependency 오류는 Detail module 전체 import 실패로 올라가며 F001의 공유 dependency retry 결함에 노출된다.
- Impact: Detail/Split에서 component renderer를 불러오지 못했을 때 Peek처럼 component-specific retry를 검증하거나 제공할 수 없다. 문서가 약속한 하나의 recovery boundary와 실제 호출 graph가 달라 사용자의 더블클릭 Detail 실패가 정상적인 renderer retry로 이어지지 않는다.
- Suggested Action: Detail/Split의 component body도 중앙 loader를 통해 비동기로 렌더하고, 그 상태를 Detail/Split viewport별로 명시하거나, Detail module 자체를 component loader의 유일한 경계로 재설계해 계약을 문서와 일치시킨다. 직접 `componentEntry.js` import가 남는 compatibility path인지도 분리해 이름을 명확히 한다.
- Re-audit Method: Detail과 Split을 cold load한 뒤 component implementation/CSS 요청을 첫 호출에서 실패시킨다. 각 viewport에서 `aria-busy`, 설명, retry/cancel, focus를 확인하고 retry 한 번으로 두 renderer가 실제 root/data-theme을 만들며 style transition에도 같은 경계가 유지되는지 검증한다.
- Confidence: High
- Notes: Gallery 본체의 Detail 상태 전환 자체는 별도 F003과 구분한다. `mainView.js:349-353, 417-420` 및 `selectionDock.js:185-187, 216-218`은 `openDetailFor()`를 호출하고, `selection.js:24-40`은 `currentView: 'DETAIL'`을 설정한다. 결함은 그 다음 component/lazy recovery 경계다.

### [A10-F003] Peek 카드가 더블클릭/Enter로 상세를 연다고 안내하지만 실제 Detail 진입 이벤트가 없음

- Area: 기능/UI 상호작용 및 접근성
- Severity: Major
- Status: Confirmed
- Summary: Peek 카드에 “클릭으로 담기 · 더블클릭으로 자세히 · Enter 열기”가 노출되지만, 구현은 일반 `click`에서 `selectDraft()`만 호출한다. 카드에는 `dblclick` 또는 `keydown`/Enter listener가 없고, `openDetailFor()` import도 없다. 따라서 Peek에서 사용자가 안내된 더블클릭/Enter를 사용하면 상태가 Detail로 바뀌지 않는다.
- Evidence:
  - `src/components/peekPreview.js:89-100`은 `role="region"` 카드와 해당 상호작용 hint를 렌더한다. 카드에는 tabindex 또는 native open button도 없다.
  - `src/components/peekPreview.js:104-111`은 `mouseenter`, `mouseleave`, `click`만 등록하고, click은 mock action이 아니면 `selectDraft(sub.categoryId, sub.id)`만 실행한다. 파일의 import(`:8-9`)에도 `openDetailFor`가 없다.
  - 일반 Gallery에는 별도 경로가 있다. `src/components/mainView.js:324-353`의 tile `dblclick`은 `openDetailFor(catId, subId)`를 호출하고, `:380-421`의 Gallery `Enter`는 같은 함수를 호출한다. 이 listener의 selector는 `.sub-tile, .bento-item-card, .spectrum-card`로 Peek의 `.peek-card`를 포함하지 않는다.
  - 제품 문서는 `README.md:168-170`에서 “더블클릭/Enter로 자세히 보기”를 공개하고, Peek hint는 구현 안에서 직접 같은 약속을 표시한다.
- Expected Basis: `README.md:168-170`, `spec.md:287`, 그리고 visible hint와 실제 keyboard/native interaction이 일치해야 한다는 D3D `IMP-001`, `SEC-008` 접근성·상호작용 계약.
- Actual: Main Gallery tile의 더블클릭/Enter 및 Dock의 Detail 버튼은 상태 전환까지 연결된다. 그러나 Peek 카드에서 같은 문구를 따라 수행하면 draft 선택 외 상태 변화가 없어 사용자에게 무응답처럼 보인다. `Esc`는 `mainView.js:398-401`의 전역 Gallery 경로로 peek를 닫을 뿐 Detail을 열지 않는다.
- Impact: 사용자는 표시된 Peek affordance를 신뢰해도 Detail로 갈 수 없으며, 키보드 사용자는 포커스 가능한 open target조차 얻지 못한다. 특히 lazy Detail 오류와 결합하면 “미리보기는 보이지만 더블클릭 상세가 무응답”이라는 동일한 사용자 증상이 반복된다.
- Suggested Action: Peek에 별도 명시적 `상세 보기` native button을 제공하거나, mockup 내부 action과 충돌하지 않도록 카드의 dblclick/keydown Enter를 안전하게 위임해 `openDetailFor()`로 연결한다. 카드의 role/name/focus와 Escape/mouseleave teardown을 함께 정의하고 hint를 실제 지원 경로와 동기화한다.
- Re-audit Method: Gallery tile에 focus한 뒤 Peek를 띄워 native dblclick 및 Enter를 각각 실행하고 `currentView=DETAIL`과 lazy Detail loading/error/success 상태를 확인한다. Peek renderer 내부의 mock action click/Enter는 Detail로 전파되지 않아야 하며, Escape/mouseleave 후 opener/focus 복원도 확인한다.
- Confidence: High
- Notes: 이 finding은 Main Gallery의 tile handler 부재를 주장하지 않는다. Main Gallery와 Dock의 openDetailFor 호출은 존재하므로, 결함 범위는 Peek 카드의 공개된 상호작용 계약이다.

### [A10-F004] 테스트·Chrome QA가 실제 실패 지점을 검출하지 못해 완료 문서가 사용자 실패와 모순될 수 있음

- Area: 테스트/QA 증거 및 문서 완료 주장
- Severity: Major
- Status: Confirmed
- Summary: Node gate는 loader factory와 정적 문자열을 통과시키지만 Detail/Split/Confirm의 실패·retry·cancel·stale/중복 상호작용을 실행하지 않는다. Chrome scalability gate는 `componentLazyEntry` outer URL의 Peek 실패 한 종류만 주입한다. Detail/Split의 static `componentEntry`/CSS dependency 실패, Detail retry, Confirm retry, Peek Enter/dblclick, Dock Detail, duplicate/stale race를 검출하는 assertion이 없다. 그 상태에서 roadmap·README·spec·changelog는 관련 recovery를 완료했다고 넓게 주장한다.
- Evidence:
  - `tests/renderScalability.test.js:408-451`은 함수 배열을 이용한 일반 Promise loader만 검증한다. `:453-474`는 main/loader source에 literal import·marker가 있는지, `:476-487`은 Peek/Dock source에 loader/aria/retry 문자열이 있는지만 검사한다. DOM event dispatch나 실제 실패 후 UI recovery assertion은 없다.
  - `scripts/verifyRenderScalabilityChrome.js:476-563`은 `*componentLazyEntry*` 요청만 `Fetch.failRequest`로 한 번 실패시키고 Peek retry 성공을 확인한다. `:573-592`의 Detail open은 정상 Detail root가 나타나는지만 기다리며 Detail module/component/CSS 실패를 주입하지 않는다.
  - `scripts/verifyCatalog120Chrome.js:925-983`은 지연 네트워크에서 정상 Detail 및 Escape loading을, `:1407-1447`은 정상 Peek/Dock renderer를, `:1450-1465`는 정상 Detail keyboard Escape를 확인한다. 실패 retry/cancel 또는 stale/duplicate race는 없다. `scripts/verifyCatalogDiscoveryChrome.js:644-693`의 Enter도 정상 load만 확인한다.
  - 문서는 `BUILD_GUIDE.md:223`, `audit_roadmap.md:174-180, 184-191`, `DESIGN_DECISIONS.md:297`, `CHANGELOG.md:61`에서 forced failure/retry와 Detail·Split·Peek·Dock complete를 주장한다. `node --test`는 현재 180/180으로 통과했지만 위 미검증 경로를 포함하지 않는다.
  - 기준선의 추적성도 일관되지 않다. `BUILD_GUIDE.md:258`은 current baseline을 152/152로 적고, `implementation_summary.md:132`와 `audit_roadmap.md:90`은 180/180으로 적는다. 이 숫자 차이는 사용자 실패의 직접 원인은 아니지만 어떤 게이트가 현재 기준인지 흐리게 한다.
- Expected Basis: D3D `DBG-001`, `TEST-001`, `IMP-004`의 결정론적 재현·관측·회귀 방지, `spec.md:239-242`의 실제 상태 변화가 있는 사용자 경로와 recovery assertion, `LESSONS_LEARNED.md:89-101`의 breadth matrix가 stateful flow를 대체하지 못한다는 자체 교훈.
- Actual: 현재 static/Node gate가 green이어도 F001~F003을 실패시킬 수 있는 조건을 검출하지 않는다. QA의 유일한 forced failure가 성공하는 것은 outer `componentLazyEntry` URL이 실패한 경우에 대한 부분 증거일 뿐이며, 사용자 신고와 같은 Detail failure/no-op retry를 반증하지 않는다.
- Impact: 완료 문서의 `COMPLETE/PASS`가 실제 사용자 실패를 가릴 수 있고, 같은 regression이 다시 들어와도 기존 180/180 및 정상-flow Chrome 증거가 계속 green일 가능성이 높다. 재현 가능한 실패 fixture가 없어 원인별 복구 여부와 접근성 상태를 판정할 수 없다.
- Suggested Action: lazy graph의 각 실제 edge(`detailView`, `componentEntry`, async CSS, component facade)에 one-shot failure injection을 추가하고, Detail/Split/Peek/Confirm 각각의 loading→error→retry/cancel→success를 브라우저에서 assertion한다. Gallery native dblclick/Enter, Peek advertised path, Dock Detail 버튼을 DOM event로 직접 실행하고 `currentView`, opener/focus, `aria-busy`, alert, network request count를 기록한다. duplicate/stale interleave도 포함한 뒤 문서의 completion claim·테스트 수를 현재 gate와 맞춘다.
- Re-audit Method: 수정 후 `node --test`와 새 deterministic browser gate를 실행한다. Detail dependency failure, component/CSS failure, outer facade failure를 각각 한 번 주입하고 retry 성공률·재요청 URL·console/HTTP/network diagnostics를 수집한다. 이어서 Gallery dblclick/Enter, Peek Enter/dblclick, Dock draft/confirmed Detail, Escape/cancel 및 stale/duplicate sequence를 각 3회 반복해 모든 요구 predicate가 정착하는지 확인한다.
- Confidence: High
- Notes: 사용자 제약에 따라 이 감사에서는 build/Chrome gate를 실행하지 않았다. 이 finding은 실행 실패가 아니라 검증 코드의 실제 분기·predicate 범위를 읽어 확인한 coverage gap이다.

### [A10-F005] renderer/hydration 예외 뒤 resolved loader Promise가 유지되어 retry가 같은 실행을 반복함

- Area: 구현·복구 lifecycle (module load와 render/hydration 오류의 경계)
- Severity: Major
- Status: Probable
- Summary: `createRetryableModuleLoader()`는 importer Promise가 reject될 때만 `pending`을 비운다. module import 자체가 resolve된 뒤 `renderPreviewComponent()` 또는 `hydrateMockup()`가 throw하면 loader는 resolved Promise를 계속 반환한다. 각 UI의 catch는 오류와 retry 버튼을 보여 주지만 retry callback이 같은 loader를 다시 호출하므로 동일한 module/runtime 예외를 반복한다.
- Evidence:
  - `src/components/lazyPreviewLoader.js:8-27`은 `attempt.catch(...)` 안에서만 `pending = null`을 수행한다. export된 `loadDetailViewModule()`/`loadComponentPreviewModule()`(`:41-47`)에는 내부 `reset()`을 호출하는 경로가 없다.
  - `src/components/peekPreview.js:35-46`은 import 성공 뒤 renderer와 `hydrateMockup()`를 같은 `try`에서 실행하고, `:47-62`의 catch retry는 `loadPeekPreview(sub)`를 다시 부른다. `src/components/selectionDock.js:117-128, 129-142`도 같은 구조다.
  - `src/main.js:204-218`은 `detailModule.renderDetailView(detailContainer)` 예외까지 lazy import catch에서 표시하지만 retry는 `ensureDetailView` 재호출뿐이다. Detail loader의 resolved `pending`은 이 render 예외로 무효화되지 않는다.
- Expected Basis: `spec.md:239-240, 252-253`의 실패 후 재시도 가능 상태, `BUILD_GUIDE.md:244-252`의 render/hydration 오류를 진단 가능하게 드러내는 경계, 그리고 D3D `IMP-004/DBG-001`의 복구 후 정상 상태 도달 계약.
- Actual: 현재 정상 catalog에서는 definition/motion 검증이 선행되어 이 예외가 자주 발생한다는 증거는 없다. 그러나 unknown renderer/motion, CSS/runtime hydration exception, 또는 실제 브라우저의 renderer 초기화 예외가 발생하면 retry는 UI를 잠시 loading으로 바꾼 뒤 같은 resolved module로 같은 예외를 반복한다. `reset()`은 factory 내부에만 있고 실제 UI retry에서 사용할 수 없다.
- Impact: 사용자에게 오류와 버튼은 보이지만, import는 성공한 것으로 기록되어 retry가 실패 원인을 바꾸지 못한다. 네트워크를 고친 뒤에도 render/hydration 예외가 남아 있으면 “다시 시도”가 무응답처럼 보이며, F001의 dependency failure와 구분되지 않는다.
- Suggested Action: import·render·hydrate를 동일한 attempt lifecycle로 묶거나, render/hydration 예외 시 loader cache를 invalidate하고 새 attempt token으로 재시도하게 한다. 오류에는 단계(import/render/hydrate)와 안정적 진단 정보를 남기되 사용자에게 내부 stack을 노출하지 않는다.
- Re-audit Method: 테스트용 importer/render/hydrate fault injection으로 module resolve 후 각 단계가 한 번만 throw하도록 한다. Peek, Confirm/Dock, Detail에서 오류 state의 focus/alert를 관찰하고 retry 후 새 attempt가 실제 renderer를 mount하는지, 같은 resolved Promise 재사용 횟수와 request token이 올바른지 확인한다. 정상 recovery 후 stale view 전환도 함께 검사한다.
- Confidence: Medium
- Notes: 이는 현재 catalog의 특정 renderer가 이미 throw한다고 단정하는 finding이 아니다. retry API가 import rejection만 invalidate한다는 확정된 구조와, 사용자 계약에서 요구하는 render/hydration 이후 retry semantics 사이의 검증되지 않은 failure branch다.

### [A10-F006] GitHub Pages가 Vite 산출물 대신 저장소 루트를 게시하면 raw source CSS module 경로가 lazy preview를 깨뜨림

- Area: GitHub Pages 배포·문서 계약과 Vite 산출물 경로
- Severity: Major
- Status: Probable
- Summary: 저장소는 `vite.config.js`에서 `dist` 출력과 상대 `base: './'`만 선언하고 Pages용 build/deploy workflow 또는 publication directory를 정의하지 않는다. `index.html`은 소스 실행용 `./src/main.js`와 `./src/styles/*.css`를 직접 가리킨다. GitHub Pages가 repository root/branch를 그대로 게시하면 Vite가 CSS `import()`를 변환하지 않은 raw module graph가 브라우저에서 실행되고, `componentEntry.js`의 CSS dynamic import가 JavaScript module MIME 오류로 reject될 수 있다. 그 경우 Detail/Peek/Dock lazy preview가 실패하고 F001의 동일 dependency retry 문제까지 겹친다.
- Evidence:
  - `vite.config.js:3-13`은 `base: './'`, `build.outDir: 'dist'`, `assetsDir: 'assets'`만 설정한다. `base`는 Vite build 산출물 URL을 위한 설정이지 repository root에 raw source를 게시하는 build step을 만들지 않는다.
  - `index.html:11-14, 41-42`는 `./index.css`, `./src/styles/interactive.css`, `./src/styles/wave1-styles.css`, `./src/main.js`를 직접 참조한다. Vite build 결과라면 `dist/index.html`의 hashed asset graph를 게시해야 하지만, 현재 저장소에는 Pages가 `dist`를 생성·게시한다는 workflow/config가 없다.
  - `src/preview/componentEntry.js:9-16`은 브라우저에서 `.css` 파일을 `import()`하는 top-level `Promise.all`을 실행한다. 이 소스가 Vite dev/build 변환 없이 Pages에서 직접 로드되면 CSS 응답을 JavaScript module로 해석하지 못해 component loader Promise가 reject될 수 있다.
  - `package.json:9-25`에는 `dev`, `build`, `preview`, QA와 test만 있고 `deploy`, `gh-pages`, Pages artifact upload script가 없다. 저장소 파일 검색에서도 `.github/workflows`, `CNAME`, `404.html` 및 Pages publication config를 찾지 못했다.
  - `README.md:7-32, 121-131`과 `BUILD_GUIDE.md:119-139, 209-223`은 local Vite/dev, `dist` build/preview, root에서 실행하는 Python static server와 Crostini QA만 설명하고 GitHub Pages의 build→publish 경계를 설명하지 않는다. `BUILD_GUIDE.md:135-139`의 root Python server 절차는 raw source를 서빙하는 경우와 `dist`를 서빙하는 경우를 구분하지 않는다.
- Expected Basis: `vite.config.js:4`의 static-host compatibility 의도, `README.md:22-32`와 `BUILD_GUIDE.md:127-151`의 build output 사용 계약, D3D `IMP-001/IMP-004`의 실제 실행 artifact와 문서 절차 정합성. GitHub Pages에서는 배포된 `index.html`이 실제 Vite 산출물 graph를 가리키고 모든 dynamic module/CSS URL이 same-origin에서 로드되어야 한다.
- Actual: 저장소 내부에는 Pages가 어떤 branch/directory를 publish하는지 또는 build 후 `dist`를 upload하는지에 대한 증거가 없다. 따라서 `base: './'`만으로 Pages 호스팅이 안전하다고 판정할 수 없다. 사용자가 Pages에서만 오류를 관찰했다면 local Vite 변환 환경과 Pages raw-root 환경의 차이가 현재 lazy preview 오류를 설명하는 유력한 가설이다.
- Impact: local `node --test`와 Vite 기반 Chrome QA가 green이어도 Pages에서 초기 component/detail import가 실패할 수 있다. 사용자는 `미리보기를 불러오지 못했습니다`를 보고 retry를 눌러도 raw CSS dependency의 동일한 module-map 실패를 반복할 수 있으며, double-click Detail도 같은 graph에서 막힌다.
- Suggested Action: GitHub Pages를 공식 지원한다면 `npm run build` 후 `dist`만 Pages artifact로 upload/deploy하는 workflow를 추가하고, repository subpath에서 `dist/index.html`·hashed JS/CSS·dynamic import URL을 모두 200으로 검증한다. root publication을 계속 사용한다면 Vite 변환 결과를 root에 안전하게 동기화하는 명시적 release step과 no-clobber 정책을 두고 raw `src/main.js`를 release entry로 취급하지 않는다. README/BUILD_GUIDE에 Pages source branch/directory, base, cache invalidation과 rollback 절차를 명시한다.
- Re-audit Method: 실제 Pages URL의 HTML이 `./src/main.js`가 아닌 Vite 산출물 `assets/*.js`를 가리키는지 확인한다. DevTools Network에서 index/static CSS, `detailView`, `componentEntry`, async CSS, retry entry가 모두 same-origin 200/JavaScript MIME인지 기록하고, Gallery dblclick/Enter·Peek·Dock에서 renderer root/data-theme과 error/retry/cancel/focus 상태를 검증한다. 첫 요청 one-shot failure 뒤 retry가 성공하는지도 Pages URL에서 반복한다.
- Confidence: Medium
- Notes: Pages의 실제 publication 설정을 읽을 수 없어 조건부 finding이다. `dist`가 이미 외부 CI에서 정상 게시되고 있다는 증거가 확인되면 이 finding은 Rejected 또는 Info로 낮추고, raw-root publication이면 F001의 가장 직접적인 재현 조건으로 승격해야 한다.

## 6. Uncertainties and Clarifications Needed

- Cancel의 범위가 문서 간에 모호하다. `spec.md:239`는 Detail/Split 및 Peek/확정 component renderer 모두에 “취소·재시도”를 넓게 요구하는 반면, `designs.md:239`와 구현은 Detail에만 명시적 `data-lazy-detail-cancel`을 둔다. Peek는 mouseleave/전역 Escape로 state를 teardown하고, Confirm은 `접기`/다른 Dock 조작으로 닫히지만 loading/error viewport 안에 명시적 cancel control은 없다. acceptance가 “각 preview region에 visible cancel button”을 뜻한다면 추가 결함으로 승격해야 한다.
- 실제 사용자 신고가 outer entry, `componentEntry.js`, async CSS 중 어느 요청의 실패인지 Chrome Network 기록이 없어 단일 원인을 확정할 수 없다. 다만 F001의 dependency graph 결함은 정적 조건으로 확인되며, GitHub Pages가 raw source를 게시하는지 확인하고 위 요청별 one-shot failure를 재현하는 것이 원인 확정 방법이다.
- GitHub Pages의 repository setting/branch/directory는 저장소 파일만으로 확인할 수 없다. Pages artifact가 `dist`인지 root인지와 workflow가 외부에서 관리되는지를 사용자/배포 소유자가 확인해야 한다.
- 기존 문서의 152/152와 180/180 기준선 중 어느 수치를 release gate로 채택할지 문서 소유자의 정리가 필요하다. 이번 감사에서 실행한 현재 Node 기준은 180/180이었다.

## 7. Perspective Decision

`NEEDS FIX`

Main Gallery의 tile double-click/Enter와 Selection Dock의 `openDetailFor()` 상태 전환은 구현되어 있으나, 그 다음 Detail/component lazy recovery 계약이 완결되지 않았다. 공유 dependency 실패를 복구하지 못하는 retry graph(F001), Detail/Split의 loader 우회(F002), Peek의 공개 상호작용 무응답(F003), 검증되지 않은 renderer/hydration retry branch(F005), GitHub Pages publication 경계 미확정(F006), 그리고 이를 검출하지 못하는 QA/documentation gap(F004)이 모두 사용자 신고와 직접 연결된다. 따라서 현재 `COMPLETE/PASS` 문서 주장은 이 관점에서 승인할 수 없으며, 실제 Pages 산출물 확인을 포함한 실패 지점별 browser re-audit와 문서 동기화가 필요하다.
