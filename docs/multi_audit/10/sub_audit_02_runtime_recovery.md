# Sub Audit Report

## 1. Audit Metadata

- Audit Turn: 10 / sub_audit_02
- Perspective: 런타임 복구, lazy import/Promise·state 경계, 중복 이벤트, 브라우저 실패 주입, 회귀 검출력
- User Goal: 디자인 시안의 Peek/Confirm 미리보기 및 더블클릭 Detail 진입에서 모듈 로드 실패와 무응답 재시도를 근본 원인까지 점검하고 안정성과 동작을 검증한다.
- Audit Basis: Standard-backed + Goal-driven
- Standard Path: `/home/eunho1/Projects/web/design_sample_selector/AI_AUDIT_DOC_STANDARD.md`
- Report Contract: `/home/eunho1/.codex/skills/multi-audit/references/report-contract.md`
- Audit Method: 구현·호출 그래프 정적 대조, 실패 경계 추적, 지정 Node 테스트 실행. `dist`, `.antigravity`, Chrome 프로파일을 생성하는 빌드/브라우저 QA는 안전 검증 조건에 따라 실행하지 않았다.

## 2. Assigned Scope

- 설정: `package.json`, `package-lock.json`, `vite.config.js`
- 런타임: `src/components/lazyPreviewLoader.js`, `src/main.js`, `src/components/mainView.js`, `src/components/peekPreview.js`, `src/components/selectionDock.js`, `src/components/detailView.js`
- Preview 경로: `src/preview/component*`, `src/preview/registry.js`, `src/preview/index.js`, 관련 entry/renderer 및 `src/components/archetypeTemplates.js`
- 상태/선택: `src/state/appState.js`, `src/utils/selection.js`
- 자동화: `tests/renderScalability.test.js`, `tests/previewIntegration.test.js`, `tests/auditRemediation9.test.js`, `scripts/verifyRenderScalabilityChrome.js`, `scripts/verifyCatalog120Chrome.js` 및 호출 관계
- 제품 계약 근거: `spec.md`, `SPEC-render-scalability.md`, `SPEC-preview-registry.md`, `designs.md`, `DESIGN_DECISIONS.md`, `implementation_summary.md`, `BUILD_GUIDE.md`, `README.md`

호출 그래프의 핵심은 다음과 같다.

```text
main
 └─ detailViewLoader
     ├─ import('./detailView.js')
     └─ import('./detailView.js?retry=1')
          └─ detailView → archetypeTemplates → componentEntry → CSS imports

peekPreview / selectionDock
 └─ componentPreviewLoader
     ├─ import('../preview/componentLazyEntry.js')
     └─ import('../preview/componentLazyRetryEntry.js')
          └─ both static-import './componentEntry.js' → same CSS imports
```

## 3. Excluded and Uninspected Scope

- `node_modules`, `dist`, `.git`, 생성·벤더 트리 및 이전 `docs/multi_audit` 보고서는 읽지 않았다.
- `npm run build`, `npm run preqa:*`, `npm run qa:*` 및 Chrome DevTools 실행은 `dist/.antigravity/Chrome profile` 쓰기 때문에 실행하지 않았다.
- 따라서 Vite/Rollup이 실제 배포 시 어떤 chunk URL을 생성하는지, production Chrome에서 모듈 맵의 실패 레코드가 어떻게 보이는지는 재현하지 못했다. 이 한계는 F001과 F004의 재감사 조건에 명시한다.
- 소스·테스트·제품 문서·설정은 수정하지 않았으며 이 보고서만 생성한다.

## 4. Evidence Examined

### 4.1 Source and contract evidence

- `src/components/lazyPreviewLoader.js:1-47`: importer 배열, 단일 `pending` Promise, 실패 시에만 `importerIndex` 증가, `detailView.js?retry=1` 및 `componentLazyRetryEntry.js` facade.
- `src/preview/componentLazyEntry.js:1-15`, `src/preview/componentLazyRetryEntry.js:1-15`: 두 facade 모두 동일한 `./componentEntry.js` 정적 import.
- `src/preview/componentEntry.js:1-40`: 모션/renderer 정적 import와 브라우저에서 동일한 세 CSS URL을 top-level `Promise.all`로 import.
- `src/components/archetypeTemplates.js:1-7,124-158`, `src/components/detailView.js:1-90,267-581,1494`: Detail의 정적 componentEntry 의존성과 bootstrap/update 경계.
- `src/main.js:169-233`: Detail lazy loading, request token, retry/cancel UI 및 import와 `renderDetailView`를 함께 감싸는 catch.
- `src/components/peekPreview.js:28-64`, `src/components/selectionDock.js:103-143`: 공유 component loader, retry listener, stale paint token 및 render/hydrate catch.
- `src/preview/registry.js:297-339`: unknown renderer/tab/motion/output 시 `PreviewRegistryError`를 동기적으로 throw.
- `src/state/appState.js:375-389`: `subscribe`가 listener를 먼저 set에 추가하고 즉시 호출하며, 이후 notify는 listener 오류를 catch/log하지만 제거하지 않음.
- `src/components/mainView.js:324-374,407-423`, `src/utils/selection.js:24-40`: click 후 dblclick 순서와 `openDetailFor` 상태 전환 경계.

### 4.2 Tests and scripts

- `npm test -- tests/renderScalability.test.js tests/previewIntegration.test.js tests/auditRemediation9.test.js`: exit 0, 54 passed, 0 failed. 테스트 중 AppState validation/AudioContext 관련 기존 경고가 출력되었으나 실패로 판정되지는 않았다.
- `tests/renderScalability.test.js:408-451`: fake importer 함수로 동시 Promise 공유 및 reject 후 다음 importer 전환만 검증.
- `tests/renderScalability.test.js:453-487`: import 문자열/소비자 소스 정규식 검증. 실제 dynamic import, CSS, module-map 또는 브라우저 DOM 경로는 검증하지 않음.
- `tests/previewIntegration.test.js`: 120개 catalog의 sync renderer 출력/registry 오류만 검증.
- `tests/auditRemediation9.test.js:106-114` 및 직접 import: lazy/retry/focus 문자열과 구조를 검사하며 실제 lazy 실패 주입은 하지 않음.
- `scripts/verifyRenderScalabilityChrome.js:293-340,476-571`: `*componentLazyEntry*`만 Fetch 차단하고, primary 요청 1회와 `componentLazyEntry` URL 존재만 확인.
- `scripts/verifyRenderScalabilityChrome.js:573-601`: Detail 진입을 synthetic `dblclick` 하나로 수행하며 Detail import 실패/retry 주입은 없음.
- `scripts/verifyCatalog120Chrome.js:318-415,719,835-925,1620-1626`: `clickCount:2`와 synthetic `MouseEvent('dblclick')`를 혼합하고, `archetypeTemplates.js`를 먼저 import하는 matrix 경로 뒤에 representative Detail 흐름을 실행.

### 4.3 Failure cases checked

| Case | 정적/자동화 확인 결과 |
|---|---|
| 동일 loader의 동시 호출 | `pending` 공유 로직과 fake importer 테스트에서 확인 |
| primary importer reject 후 retry | 외곽 facade reject일 때만 fake 테스트/Chrome 주입이 확인 |
| `componentEntry.js` 또는 CSS 의존성 실패 | 실제 실패 주입 없음; 두 facade의 동일 정적 의존성은 소스에서 확인 |
| Detail module 실패 및 Detail retry | 소스의 별도 facade만 확인; Chrome 실패 주입 없음 |
| module은 성공했으나 render/hydrate throw | registry throw 경로와 consumer catch 구조만 확인; 실제 fault 없음 |
| Peek 선행 실패 후 Confirm/Detail | component loader의 전역 importer index와 별도 Detail loader는 확인; 순차 브라우저 시나리오 없음 |
| 빠른 retry/상태 변경/stale 결과 | `requestId`/`paintVersion` guard는 확인; 연타·reset 중간 완료 회귀 테스트 없음 |
| 실제 사용자 double-click 이벤트 순서 | 소스 click/dblclick handler는 확인; Chrome 스크립트는 synthetic/혼합 경로라 미검증 |

## 5. Findings

### [A10-S02-F001] Retry facade가 실패한 transitive module/CSS URL을 우회하지 못함

- Pass: 2. Debug/Engineering Quality
- Pattern: `DBG-001`, `ARCH-001`
- Area: lazy import retry, module-map cache, component/Detail 의존성 그래프
- Severity: Major
- Status: Confirmed (소스 그래프 기준; production chunk identity는 미검증)
- Summary: `createRetryableModuleLoader`는 실패한 외곽 dynamic-import URL을 다음 facade로 바꾸지만, 두 component facade가 동일 `componentEntry.js`를 정적으로 import하고 `componentEntry.js`가 동일 CSS URL을 import한다. Detail의 `detailView.js?retry=1`도 `archetypeTemplates.js → componentEntry.js` 정적 경로를 재사용한다.
- Evidence: `lazyPreviewLoader.js:31-39`의 두 importer; `componentLazyEntry.js:2-5`와 `componentLazyRetryEntry.js:2-5`의 동일 `./componentEntry.js`; `componentEntry.js:10-15`의 동일 CSS specifier; `archetypeTemplates.js:7`의 componentEntry 정적 import; 계약 `spec.md:239-240`, `DESIGN_DECISIONS.md:284-293`은 브라우저 module-map에 남은 실패 URL을 피하는 별도 retry 경로를 요구한다.
- Expected Basis: primary 실패 이후 실제 retry entry가 동일 구현을 다시 평가하고 정상 복구해야 하며, Peek/Confirm component와 Detail failure boundary가 독립적으로 결정되어야 한다.
- Actual: 외곽 `componentLazyEntry.js` 또는 `detailView.js` 자체가 Request 단계에서 실패하면 alternate facade가 유효하다. 그러나 `componentEntry.js` 평가 또는 그 top-level CSS import가 실패하면 alternate facade도 같은 정적 URL을 요청/재사용하므로 실패 module record를 피한다고 보장할 수 없다. Detail loader와 component loader 인스턴스는 별개라 Peek 실패가 Detail의 importer index를 직접 증가시키지는 않지만, 공유하는 componentEntry module graph의 실패 상태는 양쪽에 영향을 줄 수 있다.
- Impact: Peek/Confirm 미리보기와 Detail 더블클릭 진입이 모두 generic error 상태에 남고 retry가 계속 같은 실패를 재사용할 가능성이 있다. 특히 CSS/renderer dependency 실패는 현재 Chrome 주입으로 검증되지 않는다.
- Suggested Action: retry facade URL만 바꾸지 말고 실패 경계마다 독립된 retry graph를 설계한다. component retry entry에서 retry 전용 component implementation/CSS importer를 사용하거나, 번들 결과에서 실패 대상의 URL이 실제로 달라지는지 보장·검증한다. Detail도 `detailView`의 정적 componentEntry 의존성까지 포함한 failure matrix를 정의한다.
- Re-audit Method: production build를 허용한 뒤 exact network URL/순서를 기록한다. primary facade, `componentEntry.js` 및 각 CSS 중 하나씩 단일 실패 주입 → 오류 UI → retry → retry entry와 모든 transitive URL 재요청 → 정상 렌더를 각각 확인하고, 동일 failed URL 재사용 시 즉시 실패로 판정한다.
- Confidence: High (개발 서버의 source specifier 동일성), Medium (production chunk deduplication은 build 미실행)
- Notes: 현재 제품 문서의 “별도 retry entry로 module-map 실패를 피한다”는 주장은 외곽 entry failure에만 충분하며, transitive failure까지는 증거가 부족하다.

### [A10-S02-F002] import 성공 후 render/hydrate 오류는 retry에서 동일 resolved Promise를 재사용함

- Pass: 2. Debug/Engineering Quality
- Pattern: `DBG-002`, `IMP-003`
- Area: Promise lifecycle, error taxonomy, retry state machine
- Severity: Major
- Status: Confirmed
- Summary: main/Peek/Dock의 `try`가 import와 render/hydrate를 함께 감싸므로 동기 renderer 오류도 lazy import failure처럼 error UI로 전환된다. 하지만 loader는 importer Promise가 reject될 때만 `importerIndex`를 증가시키며, module import가 이미 resolve된 뒤 render가 throw한 경우에는 `pending`이 resolve 상태로 남는다.
- Evidence: `lazyPreviewLoader.js:12-21`에서 `pending`을 import attempt에만 연결하고 reject 때만 index 전환; `main.js:198-220`에서 `await loadDetailViewModule()`와 `detailModule.renderDetailView()`를 동일 try에 배치; `peekPreview.js:28-63`, `selectionDock.js:111-143`에서 `renderPreviewComponent`/`hydrateMockup`까지 동일 catch; `registry.js:297-323`에서 registry 오류를 동기 throw.
- Expected Basis: 실패 UI의 retry는 실제 실패 원인을 다시 시도하고 성공·실패가 결정적으로 분리되어야 한다. component module failure와 renderer/data failure를 혼동해서는 안 된다.
- Actual: module은 이미 정상 resolve되었으므로 retry button의 `load...()`는 같은 resolved namespace를 돌려준다. `importerIndex`는 바뀌지 않고 같은 render/hydrate 오류가 반복되어 사용자 입장에서는 “다시 시도”가 무응답처럼 보인다. registry 오류가 아니라 일시적 hydrate 오류여도 동일하다.
- Impact: 네트워크 import failure만 통과하는 현재 retry 설계가 renderer/hydration failure를 복구하지 못한다. Detail의 첫 render 실패도 같은 경로로 generic Detail error에 고정될 수 있다.
- Suggested Action: import/evaluation 실패와 render/hydrate 실패를 별도 상태로 분류한다. render retry는 필요한 경우 새 render context를 만들고, module retry는 실패한 evaluation URL을 기준으로만 fallback importer를 전환한다. 오류 타입/registry reference를 보존하여 데이터 계약 오류를 무한 재시도하지 않도록 한다.
- Re-audit Method: module Promise를 resolve시키되 `renderPreviewComponent` 또는 `hydrateMockup`가 첫 호출에서만 throw하는 fixture를 주입한다. retry click 후 fallback import/render가 실제 두 번째 시도되고 성공하는지, 실패가 같은 Promise 재사용으로 반복되지 않는지와 concurrent retry 결과를 확인한다.
- Confidence: High
- Notes: `reset()`은 테스트에서만 사용되며 소비자 retry 경로가 호출하지 않는다. reset 중 pending이 완료되는 경쟁 시나리오는 별도 테스트가 없어 현재 계약상 미확정이다.

### [A10-S02-F003] Detail bootstrap 실패 시 appState listener가 rollback되지 않고 retry마다 누적됨

- Pass: 2. Debug/Engineering Quality
- Pattern: `DBG-002`, `ARCH-002`
- Area: Detail mount transaction, subscription lifecycle, stale state/duplicate events
- Severity: Major
- Status: Confirmed (bootstrap render 예외 경로)
- Summary: `renderDetailView`는 `appState.subscribe(() => update())`를 호출하고, `appState.subscribe`는 listener를 set에 먼저 넣은 뒤 즉시 callback을 실행한다. 즉시 callback에서 render/hydrate가 throw하면 listener는 set에 남은 채 main이 오류 UI를 표시한다. retry는 같은 Detail module의 `renderDetailView`를 다시 호출해 새 listener를 추가한다.
- Evidence: `detailView.js:1494`의 구독; `appState.js:375-379`의 add-then-immediate-call; `main.js:205-220`의 render 호출 및 catch/retry; Detail view에는 bootstrap 실패를 rollback하거나 disposer를 반환하는 경로가 없다.
- Expected Basis: request token/stale guard와 함께 mount 실패 시 상태·구독·이벤트가 원자적으로 rollback되어야 하며 retry 후 단일 active view만 남아야 한다.
- Actual: 첫 callback에서 예외가 나면 첫 listener가 제거되지 않는다. retry 성공 뒤에도 이전 closure와 새 closure가 모든 state notify를 받는다. `notify`는 오류 listener를 log만 하고 삭제하지 않으므로 ghost update, 중복 render/event handler, 반복 console error가 남을 수 있다.
- Impact: retry 직후에는 화면이 복구된 것처럼 보여도 스타일/디바이스/닫기/재진입 state 변경에서 중복 업데이트와 stale DOM이 발생할 수 있고, 회귀 원인 추적이 어려워진다.
- Suggested Action: Detail mount를 transactional하게 구성한다. 최초 render 성공 후에만 subscribe하거나, 실패 시 즉시 unsubscribe/DOM rollback을 수행한다. `renderDetailView`가 disposer를 반환하고 main이 close/retry/unmount에서 정확히 한 번 호출하도록 lifecycle 계약을 명시한다.
- Re-audit Method: 첫 `renderDetailView`에서 renderer/hydrate를 강제로 throw → retry 성공 → style/device/close/reopen state 변경을 수행한다. listener 수, render 호출 수, DOM handler 수, console error를 측정하여 각 시점에 active subscription이 하나인지 확인한다.
- Confidence: High
- Notes: 정상 성공 후 main은 `detailMounted`로 재호출을 막지만, 실패 후 retry가 bootstrap 함수를 재호출하는 조건에서만 누수가 드러난다.

### [A10-S02-F004] Chrome fault injection이 retry URL·transitive failure·Detail failure를 검증하지 않음

- Pass: 2. Debug/Engineering Quality
- Pattern: `TEST-001`, `BUILD-001`
- Area: browser QA, exact request interception, double-click and Detail recovery
- Severity: Major
- Status: Confirmed
- Summary: `verifyRenderScalabilityChrome.js`의 fault injection은 `*componentLazyEntry*` 하나만 Request 단계에서 차단한다. retry 이후에는 `componentLazyEntry` URL이 목록에 존재하는지만 검사하며 `componentLazyRetryEntry`의 요청 여부/횟수/순서를 검사하지 않는다. Detail module failure와 Detail retry는 전혀 주입하지 않는다.
- Evidence: `verifyRenderScalabilityChrome.js:328-340`의 substring 기반 차단; `:482-485`의 `urlPattern: '*componentLazyEntry*'`; `:540-563`의 차단 해제·generic resource 존재·`interceptedComponentFailures === 1` 검사. 해당 script에는 `componentLazyRetryEntry` exact assertion이 없다. `:573-601`은 synthetic `dblclick`만 dispatch한다. `verifyCatalog120Chrome.js:719`에서 `archetypeTemplates.js`를 먼저 import하고 `:835-925,1620-1626`에서 그 뒤 representative Detail 흐름을 수행하므로 cold Detail lazy path가 아니다.
- Expected Basis: `SPEC-render-scalability.md:170-203`의 failure/loading/retry acceptance와 `spec.md:239-240`의 retry facade/module-map 계약은 실제 브라우저 failure path에서 증명되어야 한다.
- Actual: 현재 QA가 성공할 수 있는 시나리오는 outer primary component facade 요청 하나가 실패하고, 그 후 어떤 component lazy resource가 존재하는지 확인하는 정도다. primary가 이미 기록되어 있으므로 `.some(url.includes('componentLazyEntry'))`는 retry가 없거나 no-op이어도 통과할 수 있다. componentEntry/CSS failure, Detail primary/retry, render throw 및 actual two-click event order는 차단하지 않는다.
- Impact: 제품 문서와 QA 결과가 “retry 복구”를 과대 보고할 수 있다. 사용자 신고와 동일한 “미리보기 오류 → 다시 시도 무응답 → 더블클릭 Detail 오류” 조합을 자동으로 잡지 못한다.
- Suggested Action: request log를 exact URL/source ID와 timestamp/order로 기록한다. primary failure 1회 후 `componentLazyRetryEntry` 1회 요청을 명시적으로 확인하고, componentEntry와 각 CSS를 독립적으로 실패시킨다. Detail `detailView.js` primary/retry와 transitive componentEntry도 별도 시나리오로 추가한다. 실제 사용자 이벤트는 두 번의 mouse press/release와 단일 `dblclick` 발생 순서를 검증한다.
- Re-audit Method: production Chrome QA를 실행해 각 fault matrix를 한 번씩 수행하고, retry 전후 request sequence, UI state, successful renderer, stale console/network signal을 JSON report로 비교한다. representative flow는 matrix warm-up과 분리된 fresh context에서 실행한다.
- Confidence: High

### [A10-S02-F005] Node 회귀 테스트가 실제 lazy failure path를 검증하지 않아 false green 가능성이 큼

- Pass: 1. Implementation Compliance
- Pattern: `TEST-001`, `SPEC-GAP`, `DOC-BACKFILL`
- Area: automated regression coverage, completion evidence
- Severity: Major
- Status: Confirmed
- Summary: 지정 Node 테스트 54개는 모두 통과했지만, retryable loader에 fake importer 함수를 넣어 상태 전환만 확인하고 실제 dynamic import/module-map/CSS/DOM/Detail mount를 실행하지 않는다. 따라서 F001-F003의 실패 경로가 통과 결과에 반영되지 않는다.
- Evidence: `tests/renderScalability.test.js:408-451`의 fake reject/resolve importer; `:453-487`의 source regex; `previewIntegration.test.js`의 sync registry 출력; `auditRemediation9.test.js:106-114`의 lazy 구조 문자열 검사와 직접 Detail import. `SPEC-render-scalability.md:199`는 첫 component chunk 실패 후 별도 retry entry 복구를 완료 증거로 서술하지만, 현재 Node 테스트에는 그 경로가 없다.
- Expected Basis: `TEST-001`은 실패 모드, retry, stale/concurrent state, 실제 진입 경로를 회귀 테스트로 고정해야 하며, 구현/제품 문서의 완료 주장은 그 증거와 일치해야 한다.
- Actual: fake importer의 첫 reject는 loader의 `catch` 전환만 증명한다. 동일 정적 transitive import 실패, resolve 후 renderer throw, Detail subscriber rollback, Peek→Confirm 공유 상태, 실제 click→dblclick 순서는 검증되지 않는다. 54 passed는 정상 sync renderer와 소스 형식의 green signal일 뿐 사용자 오류를 재현했다는 의미가 아니다.
- Impact: 실패한 module URL을 retry facade가 실제로 우회하지 못하거나 retry가 resolved Promise를 재사용해도 CI가 계속 통과할 수 있다.
- Suggested Action: 브라우저 또는 실제 ESM fixture를 사용하는 결정적 integration suite를 추가한다. 최소 matrix는 outer primary, componentEntry, CSS, Detail primary, render/hydrate throw, concurrent retry, stale state, Peek 선행 실패→Confirm 및 true double-click이다. 각 테스트는 request URL/count/order와 성공 DOM까지 assertion한다.
- Re-audit Method: 추가 fixture를 먼저 Node에서 module graph/Promise state로 검증한 뒤, isolated browser context에서 fault injection을 실행한다. 기존 54개와 별도로 “실패 주입이 실제 발생했는지”를 report assertion으로 남긴다.
- Confidence: High

### [A10-S02-F006] lazy 소비자가 구조화된 오류 원인을 삼켜 진단 신호가 사라짐

- Pass: 2. Debug/Engineering Quality
- Pattern: `DBG-002`, `OBS-GAP`
- Area: error boundary, observability, user-facing diagnostics
- Severity: Major
- Status: Confirmed
- Summary: registry는 `PreviewRegistryError`에 renderer/tab/motion/output 정보를 담아 throw하지만, Detail/Peek/Dock/main의 lazy catch는 오류 객체를 버리고 generic error UI만 렌더한다.
- Evidence: `registry.js:297-323`의 구조화된 예외; `main.js:216-220`, `peekPreview.js:47-63`, `selectionDock.js:129-143`의 bare `catch` 및 오류 객체 미전달. retry button에는 오류 code/reference나 attempt 식별자가 없다.
- Expected Basis: failure boundary가 module/evaluation/render/data 오류를 구분하고, 안정성 검증과 운영 디버깅에 필요한 원인을 보존해야 한다. 사용자에게는 재시도 가능성·현재 상태를 일관되게 알려야 한다.
- Actual: 모든 오류가 동일한 “미리보기/상세 시안을 불러오지 못함” 상태로 축약된다. 외곽 URL 실패인지 transitive CSS인지 registry 계약 오류인지, retry가 실제 다른 URL을 요청했는지를 UI/console에서 판별하기 어렵다.
- Impact: 사용자 신고의 무응답 원인을 빠르게 분리할 수 없고, fault-injection QA도 오류 종류별로 성공/실패를 구분하지 못한다. F002의 반복 실패가 로그 없이 숨겨질 수 있다.
- Suggested Action: 오류를 lazy state에 보존하고 최소한 개발/QA 채널에 error code, import boundary, attempt index, request token을 기록한다. 사용자 UI는 안전한 설명과 retry/cancel을 유지하되, registry reference와 network/evaluation/render 분류를 내부 진단 결과에 연결한다.
- Re-audit Method: 각 failure matrix에서 console/network/report에 원인 분류와 attempt sequence가 남는지 확인하고, 같은 generic message라도 원인별 diagnostic field가 달라지는지 assertion한다.
- Confidence: High

## 6. Uncertainties and Clarifications Needed

1. `?retry=1`이 “외곽 facade 자체의 Request 실패”만 보장하는지, 정적 transitive dependency(CSS/renderer/componentEntry) 실패까지 복구해야 하는지 명세를 분명히 해야 한다. 현재 `spec.md`와 `DESIGN_DECISIONS.md`의 문구는 후자까지 암시하지만, 구현·자동화는 전자를 주로 다룬다.
2. module이 성공한 뒤 renderer/hydrate가 throw한 경우를 module retry와 같은 retry 계약으로 볼지, 별도 render recovery 계약으로 볼지 결정이 필요하다. 무한 재시도하면 registry/data 계약 오류를 숨길 수 있으므로 오류 분류가 필요하다.
3. production Vite/Rollup의 실제 chunk URL·공유 여부는 안전 조건상 확인하지 않았다. F001은 dev source graph에서 확인되며, production build 결과가 독립 URL을 우연히 만들더라도 이를 계약으로 고정하는 네트워크 assertion이 필요하다.
4. `detailViewLoader`와 `componentPreviewLoader`는 서로 다른 loader instance라서 Peek 실패가 Detail의 `importerIndex`를 직접 오염시키지는 않는다. 반면 Peek와 Confirm은 하나의 `componentPreviewLoader`를 공유하여 Peek 실패 후 Confirm이 retry importer에서 시작한다. 이 전역 attempt 공유가 의도된 정책인지(공유 성공 Promise만 허용할지, surface별 독립 attempt를 둘지) 명세 확인이 필요하다.
5. `createRetryableModuleLoader.reset()`은 pending 중 호출될 때 구/신규 importer가 동시에 완료될 수 있다. 현재 소비자에서는 호출되지 않지만, reset을 공개 API로 유지할 경우 중간 reset 경쟁을 테스트하거나 API를 내부로 제한해야 한다.

## 7. Perspective Decision

**REWORK REQUIRED / 현재 감사 범위는 통과하지 않음.**

동시 호출 공유, UI의 request/paint token stale guard, outer primary reject 후 next fake importer 전환 자체는 구현되어 있다. 그러나 핵심 사용자 실패 시나리오에 대해 (1) transitive module/CSS 실패를 retry graph가 실제로 우회하는지, (2) import 성공 후 render/hydrate 오류를 retry가 복구하는지, (3) Detail 실패 retry가 listener를 누수시키지 않는지, (4) Chrome QA가 정확한 retry URL과 Detail failure를 검증하는지가 보장되지 않는다. 지정 Node 테스트가 모두 통과한 사실은 이 공백을 상쇄하지 않는다.

우선순위는 F001/F002의 retry 상태기계와 의존성 그래프를 명세화·수정하고, F003의 Detail mount rollback을 고정한 다음, F004/F005의 실제 브라우저 실패 주입 및 request-sequence 회귀 테스트를 추가하는 것이다. 그 후 production build를 포함한 fresh-context Chrome 재감사에서 Peek/Confirm/Detail 각 진입 경로가 독립적으로 복구되고, true double-click과 stale/duplicate event 조건에서도 단일 active view가 유지되는지 확인해야 한다.

