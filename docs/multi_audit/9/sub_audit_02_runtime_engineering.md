# Sub Audit Report

## 1. Audit Metadata

- Audit Turn: 9
- Perspective: A02 런타임 엔지니어링 — 빌드·테스트·런타임·아키텍처·데이터 무결성
- User Goal: `$multi-audit 기능적으로 제대로 동작 못하거나 디자인 시안이 제대로 표시되지 않는 페이지가 있는지 점검. 전체적인 모든 기능이 다 정상동작하는지 점검`
- Audit Basis: Standard-backed
- Standard Path: `/home/eunho1/Projects/web/design_sample_selector/AI_AUDIT_DOC_STANDARD.md`
- Project Root: `/home/eunho1/Projects/web/design_sample_selector`
- Audit Date: 2026-08-31 (Asia/Seoul)

## 2. Assigned Scope

현재 HEAD의 정적 웹앱을 대상으로 다음을 독립 점검했다.

- `spec.md`, `designs.md`, `BUILD_GUIDE.md`, `package.json`, `vite.config.js`와 실제 source/test 경로의 계약 정합성
- 부팅·카탈로그·theme 생성물·Node 테스트·Vite production compilation·현재 `dist`의 재현성·초기 번들 예산
- Gallery Grid/Bento/Spectrum, actual 120, 8 archetypes, Web 4 tabs, Desktop/Mobile, Detail/Split/Peek/Dock, lazy load 실패·retry, reduced motion, observer teardown, discovery URL/상태의 실행 경로
- Detail에서 같은 archetype 내 style 전환 시 renderer HTML·theme·motion·inspector가 같은 선택을 가리키는지 여부
- Game simulator의 pointer/keyboard action 경로 및 자동화 테스트가 실제 사용자 상태 전환을 검증하는지 여부
- 공식 Chrome QA의 매트릭스 범위와 stateful transition 검증 공백, 그리고 현재 HEAD에서 독립 실행한 Chrome 151 결과의 반복성

## 3. Excluded and Uninspected Scope

- `.git`, `node_modules`/vendor 내부, 외부 배포·유료 서비스, 과거 `docs/multi_audit/**` 보고서는 조사하지 않았다.
- `dist`는 현재 산출물의 읽기 전용 비교와 bundle 분석에만 사용했다. `npm run build`로 덮어쓰지 않았고, production compile은 Vite JS API `write: false`로 실행했다.
- 감사 보고서 외 source·test·설정·제품 문서는 수정하지 않았다. Chrome/Vite QA의 일시 산출물은 정확한 임시 경로에만 생성하고 정리했다.
- 본 보고서는 DOM/renderer/CSS selector/진단·접근성·실행 매트릭스 중심이다. 모든 화면의 주관적인 pixel-perfect 시각 비교, 실제 외부 배포 환경, 장시간 soak/다중 사용자 부하는 독립 검증하지 않았다.
- 다른 에이전트의 결론은 전제하지 않았다. 단, 메인 에이전트가 전달한 동일 HEAD·격리 Chrome 151 serial 재실행의 performance 수치는 현재 실행 간 변동성 판정에만 사용했다.

## 4. Evidence Examined

### 문서·설정

- `AI_AUDIT_DOC_STANDARD.md`: 3-pass 모델, `DBG-001`/`BUILD-001`/`TEST-001`/`ARCH-001`/`IMP-001` 기준, severity와 PASS gate.
- `spec.md:190-224`: state/preview registry와 120 renderer·thumbnail·motion 계약; `spec.md:234-243`: lazy retry·stale 응답·observer 수명·성능 예산; `spec.md:350-368`: actual-120과 “canonical style은 palette variant가 아니며 distinct visual grammar를 가져야 한다”는 invariant.
- `designs.md:146-175`: theme/state/preview registry 경계 및 “테마만 바꾸는 경우 DOM 재구축 없이 action state 유지” 설계; `designs.md:216-242`: discovery·scalability·lazy·a11y·observer 계약.
- `BUILD_GUIDE.md:223-232`: Chrome QA와 Inspector State Test(스위스에서 corporate로 전환한 뒤 모든 inspector 출력이 corporate를 유지해야 함); `BUILD_GUIDE.md:256-267`: 현재 검증 기준선과 Chrome budget.
- `package.json`, `vite.config.js`: Node test/validation/theme/Chrome QA/build script, Vite `base: './'`, `outDir: dist`, installed Vite 6.4.3.

### 소스·테스트

- `src/components/detailView.js:141-176`: Detail rerender 분기; `:555-585`의 archetype rebuild; `:587-637`의 zero-rebuild style swap; `:187-198`의 실제 viewport `innerHTML` 기반 inspector artifact.
- `src/components/archetypeTemplates.js:9-30,124-158`: 8 archetype dispatch와 Web component renderer 삽입.
- `src/preview/renderers.js:13-18,94-99,271-276`: Swiss/Corporate/Neo renderer root class가 서로 다름.
- `src/preview/renderers-expansion.js:95-110`: expansion renderer가 `data-expansion-style`, `data-grammar`, style별 root class를 생성함.
- `src/styles/expansion-preview.css:103-253` 및 `index.css`의 style-specific rules: renderer root/`data-grammar`/`data-expansion-style`에 따라 실제 layout과 visual grammar가 선택됨.
- `src/components/mockupRuntime.js:89-119,210-225`: delegated click action과 제한적인 keydown 처리; `src/components/archetypeTemplates.js:74-82`의 custom game target.
- `tests/previewIntegration.test.js:87-207`: 순수 HTML 960개와 Web 480개 output/unknown renderer 검증; `:209-226`: Web tab rebuild의 소스 패턴만 검증.
- `tests/inspectorState.test.js:44-80`: state로부터 생성되는 CSS/JSON/markdown context 검증. `tests/mockupRuntime.test.js:152-277`: hydration/idempotency/observer 검증.
- `scripts/verifyRenderScalabilityChrome.js:574-588`: Detail zero-rebuild 검사; viewport identity, selected ID, `data-theme`만 확인한다.

### 실행 명령과 결과

모든 명령은 project root에서 실행했다.

| 명령 | 결과 |
| --- | --- |
| `npm test` | exit 0, TAP `1..152`, 152 passed / 0 failed |
| `npm run validate:catalog` | exit 0, catalog 오류 0개·경고 56개(기존 legacy 접근성/출처/contrast 정책 경고) |
| `npm run check:themes` | exit 0, `themeTokens.css`·`themeTokensExpansion.css` 최신 |
| `node --input-type=module -e "import { build } from 'vite'; await build({ configFile: 'vite.config.js', build: { write: false } });"` | exit 0, Vite 6.4.3, 75 modules transformed, build 완료; `dist` 미기록 |
| `npm run analyze:bundle` | exit 0, initial JS `83.46kB gzip / 88.98kB budget`, CSS `32.86kB / 33.00kB` |
| Vite `write:false` output과 현재 `dist` byte 비교 | 11 assets, mismatch `[]`; current dist가 현재 source build와 일치 |

독립적으로 실행한 공식 Chrome 151 QA의 핵심 결과는 다음과 같다.

- `node scripts/verifyCatalogDiscoveryChrome.js --artifacts=<mktemp>`: 3 gallery modes, 9 discovery scenarios, 6 responsive widths, diagnostics/issues 0; 각 width에서 36 visible/120 total, overflow 0, labeled input 89/89.
- `node scripts/verifyWave1Chrome.js --artifacts=<mktemp>`: 3 gallery modes, 12 detail styles, `120 × 8 × 2 = 1,920` device states, 576 matrix states, diagnostics/issues 0.
- `node scripts/verifyCatalog120Chrome.js --artifacts=<mktemp>`: actual styles 120, Grid/Bento/Spectrum reachability 각 120, Web tabs 480, device matrix 1,920, expansion device changes 84, diagnostics/issues 0, interaction average 60.51ms/max 99ms, LCP 700ms, CLS 0.
- `node scripts/verifyRenderScalabilityChrome.js --artifacts=<mktemp>`: core modes·synthetic 60/120·lazy failure/retry·observer teardown·a11y 모두 통과; view-change median/max 7.3/26.4ms, search 36.2/39.8ms, split search 100.5/180.3ms, LCP 504ms, CLS 0, diagnostics 0.
- 메인 에이전트가 전달한 동일 HEAD·격리 Chrome 151 serial `catalog120` 재실행은 기능/진단 매트릭스는 통과했으나 interaction max `373.4ms`(hard budget 200ms 초과), LCP `1188ms`, CLS `0`이었다. 이 실행 이후 추가 Chrome을 시작하지 않았다.

Style renderer의 정적 대조도 수행했다. `getArchetypeHTML`을 같은 archetype에서 전환해 얻은 root는 다음처럼 실제 renderer가 다르다.

| 전환 | 이전 output root | 새 선택 output root |
| --- | --- | --- |
| `swiss-grid → corporate-minimal` (Web/core) | `mockup-unit ... swiss-unit` | `mockup-unit ... corp-unit` |
| `spatial-glass-ui → quantum-control` (Web/expansion) | `e120-spatial-glass-ui-unit`, `data-expansion-style="spatial-glass-ui"` | `e120-quantum-control-unit`, `data-expansion-style="quantum-control"` |

## 5. Findings

### [A02-F001] 같은 archetype의 Detail style 전환이 선택 metadata와 실제 preview renderer를 분리한다

- Pass: Implementation Compliance / Debug & Engineering Quality
- Pattern: `IMP-001`, `ARCH-001`, `TEST-001`
- Area: Detail same-archetype style/theme switching, renderer·motion·inspector synchronization
- Severity: Major
- Status: Confirmed
- Summary: 같은 archetype와 같은 Web tab에서 style chip/category/keyboard로 스타일을 바꾸면 state·sidebar·`data-theme`는 새 style ID로 바뀌지만 `#mockup-viewport`의 실제 renderer HTML은 이전 style로 남는다. 따라서 선택한 시안과 화면/inspector HTML이 서로 다른 style을 가리킨다.
- Evidence:
  - `src/components/detailView.js:141-174`는 archetype 또는 Web tab이 바뀔 때만 `needArchetypeRebuild`를 true로 만들고, 같은 archetype의 style 변경은 `needThemeSwapOnly`로 보낸다.
  - `src/components/detailView.js:555-565`의 rebuild 경로는 `teardownMockup`, `viewport.innerHTML = getArchetypeHTML(...)`, viewport attributes 갱신, `hydrateMockup`을 수행한다. 반면 `:587-593`의 `applyZeroRebuildThemeSwap`는 `data-theme`와 tweak만 바꾸며 viewport `innerHTML`, renderer root class/data attributes, motion output을 갱신하거나 `hydrateMockup`하지 않는다.
  - Web output은 `src/components/archetypeTemplates.js:125-131`에서 `subDesign.previewType`와 tab으로 생성된다. 실제 core renderer root는 Swiss `src/preview/renderers.js:13-18`, Corporate `:94-99`, Neo `:271-276`처럼 서로 다르고, expansion output은 `src/preview/renderers-expansion.js:95-110`에서 style별 `data-expansion-style`/`data-grammar`/root class를 만든다. 관련 CSS도 `src/styles/expansion-preview.css:103-253`와 `index.css`의 renderer class에 종속된다.
  - 정적 render 대조에서 `swiss-grid → corporate-minimal`은 `swiss-unit → corp-unit`, `spatial-glass-ui → quantum-control`은 `e120-spatial-glass-ui-unit → e120-quantum-control-unit`이어야 함을 확인했다.
  - 메인 에이전트의 동일 HEAD 격리 Chrome 재현에서도 Detail style 교체 후 새 `data-theme`/metadata와 구 renderer DOM이 불일치했으며, `spatial` unit이 남고 선택한 `ai` unit이 나타나지 않았다. 이는 단순 정적 가능성이 아니라 실제 실행 경로의 재현이다.
  - `src/components/detailView.js:187-198`은 현재 viewport의 실제 `innerHTML`을 inspector HTML로 넘긴다. style swap 후 CSS/JSON/markdown context는 state의 새 ID를 사용하지만 HTML은 이전 renderer markup일 수 있다.
- Expected Basis: 사용자 목표(선택한 시안이 실제로 표시되고 전체 기능이 동작해야 함), `spec.md:350-368`의 canonical style distinct visual grammar/renderer 계약, `designs.md:152-175`의 registry가 Gallery/Detail/Web renderer로 연결되는 경계, `BUILD_GUIDE.md:230`의 `swiss-grid → corporate-minimal` Inspector State Test. `designs.md`의 zero-rebuild 요구는 local action state 보존을 뜻하며, 선택 style의 renderer identity를 버리는 예외를 정의하지 않는다.
- Actual: 같은 archetype·같은 Web tab에서 style ID 선택만 변경되면 outer viewport는 새 `data-theme`를 가지지만 내부 `.mockup-unit`/`e120-*` root, style-specific text/shape, `data-expansion-style`, motion class 및 delegated action markup는 이전 style의 것이 유지된다. Inspector HTML도 그 stale innerHTML을 읽는다. 다른 archetype 또는 Web tab을 바꾸는 경우에는 rebuild가 일어나므로 이 결함은 해당 style 전환 분기에서 특히 발생한다.
- Impact: 사용자가 선택한 style과 다른 디자인 시안이 표시된다. expansion/Web에서는 grammar·renderer·tab content가 선택 ID와 어긋나고, renderer-specific interaction/motion이 이전 style에 남을 수 있다. Inspector의 HTML copy/download가 새 CSS/JSON metadata와 구 HTML을 조합하므로 BUILD_GUIDE의 export/inspector 계약도 위반한다. 공식 120×8×2 폭넓은 matrix가 통과해도 실제 Detail 전환이라는 핵심 경로는 실패할 수 있다.
- Suggested Action: “DOM root identity를 보존한다”와 “renderer output을 새 style과 일치시킨다”를 분리한 구현 계약을 확정한다. 최소한 style 전환 시 새 `getArchetypeHTML` output, viewport attributes, renderer-specific motion/effect layer를 반영하고 `teardownMockup`/`hydrateMockup` 수명을 지켜야 한다. 게임·장바구니 등 보존해야 할 local action state는 snapshot/migration으로 옮긴다. Web 4 tabs와 core/expansion renderer family 모두에 대해 selected ID와 root class/data marker/text/motion/inspector HTML이 일치하는 회귀 테스트를 추가한다.
- Re-audit Method: Chrome에서 Detail을 연 뒤 archetype와 Web tab을 고정하고 `swiss-grid → corporate-minimal`, expansion `spatial-glass-ui → quantum-control`을 전환한다. 전환 전후 viewport node identity 보존 여부와 별개로 `innerHTML`, `.mockup-unit` root class, `data-expansion-style`, `data-grammar`, motion class, 주요 text/renderer marker를 선택 style의 `getArchetypeHTML` 결과와 비교한다. Web `hero/widget/form/pricing`, 8 archetype, core·expansion 대표 및 keyboard/category selection을 반복하고, inspector HTML/CSS/JSON/markdown·copy/download가 모두 새 ID인지 확인한다. Node 152 및 Chrome catalog/scalability QA를 재실행한다.
- Confidence: High (약 0.99)
- Notes: 기존 `verifyRenderScalabilityChrome.js:574-588`의 zero-rebuild assertion은 viewport identity, selected ID, `data-theme`만 검사하므로 이 finding을 반증하지 못한다. 메인 에이전트의 독립 브라우저 재현이 같은 결론을 보강한다.

### [A02-F002] Game custom role button이 키보드 activation을 처리하지 않는다

- Pass: Implementation Compliance / Debug & Engineering Quality
- Pattern: `IMP-003`, `TEST-001`
- Area: Game archetype interaction root, keyboard accessibility
- Severity: Minor
- Status: Confirmed
- Summary: Game target은 `role="button"`인 custom `div`라서 포인터 click은 동작하지만 Enter/Space keyboard activation 경로가 없다.
- Evidence:
  - `src/components/archetypeTemplates.js:74-82`의 `#game-target`은 `<div ... data-action="game-tap" ... role="button" tabindex="0">`이다.
  - `src/components/mockupRuntime.js:89-104`는 delegated `click`만 `routeArchetypeAction`으로 전달하고, `:106-119`의 `keydown`은 `#chat-msg-input`과 `#blog-comment-input`의 Enter만 처리한다. `:210-215`의 `game-tap` 분기는 click router에서만 호출된다.
  - Game target에는 명시적인 `aria-label`도 없다. 이모지와 주변 설명이 시각적으로 존재해도 custom button의 accessible name/activation 계약을 대체하지 않는다.
- Expected Basis: `spec.md`의 접근성·상호작용 계약, `designs.md:171-174`의 기존 keyboard/focus 상태 유지, 사용자 목표의 전체 주요 기능 경로. `role="button"` custom control은 Enter와 Space activation을 제공해야 한다.
- Actual: 포인터 click은 `handleGameTap`으로 연결되지만, focus된 `#game-target`에서 Enter/Space를 눌러도 `game-tap`이 호출되지 않아 coins/combo/HP 등의 상태가 변하지 않는다.
- Impact: keyboard-only 사용자는 Game archetype의 핵심 공격 action을 수행할 수 없다. 공식 discovery keyboard 시나리오와 gallery/detail matrix는 이 sandbox target의 key activation을 검사하지 않아 기능 통과를 과대평가할 수 있다.
- Suggested Action: 가능하면 semantic `<button type="button" aria-label="게임 타깃 공격">`으로 교체한다. custom div를 유지해야 한다면 Enter/Space `keydown`에서 `preventDefault` 후 동일한 `game-tap` router를 호출하고, 상태 변화·focus·reduced-motion 환경을 회귀 테스트한다.
- Re-audit Method: Game Detail을 열어 `#game-target`에 focus한 후 pointer click, Enter, Space를 각각 실행하고 coin/combo/target HP 및 event/diagnostic을 비교한다. Chrome a11y snapshot에서 accessible name/role을 확인하고 8 archetype matrix에서 custom role controls를 검색한다.
- Confidence: High (약 0.98)
- Notes: 이번 독립 Chrome keyboard 시나리오는 discovery controls 중심이었고 Game target key activation은 포함하지 않았다. 따라서 실행 matrix의 진단 0은 이 gap을 해소하지 않는다.

### [A02-F003] 폭넓은 120 matrix가 stateful style 전환과 custom-control keyboard 회귀를 검증하지 않는다

- Pass: Debug & Engineering Quality
- Pattern: `TEST-001`, `ARCH-002`
- Area: Runtime QA coverage and false-pass surface
- Severity: Minor
- Status: Confirmed
- Summary: 현재 자동화는 정적 renderer breadth와 선택/theme metadata를 넓게 검사하지만, 실제 Detail style transition 후 preview DOM·hydration·inspector payload가 새 선택과 일치하는지 및 Game custom control의 keyboard activation을 검증하지 않는다.
- Evidence:
  - `tests/previewIntegration.test.js:87-137`은 120×8 순수 `getArchetypeHTML` output과 root selector를, `:139-162`는 120×4 Web renderer/tab 조합을 검사한다. `:209-226`은 `rebuildArchetypeViewport` 소스에 Web tab ARIA update 코드가 있는지만 확인한다. 실제 `renderDetailView`의 same-archetype style event 후 DOM을 구동하는 테스트가 없다.
  - `scripts/verifyRenderScalabilityChrome.js:574-588`의 zero-rebuild check는 `sameViewport`, selected chip ID, `viewport.dataset.theme`만 assert한다. old/new `.mockup-unit` class, `data-expansion-style`, `data-grammar`, motion, text, tab body, inspector HTML을 비교하지 않는다.
  - `verifyCatalog120Chrome.js`의 1,920-state matrix는 hidden host에 renderer HTML을 직접 주입해 breadth/size/root/thumbnail 등을 확인하는 경로이며, 실제 Detail style swap의 teardown/hydration와 state migration을 검사하지 않는다.
  - `tests/mockupRuntime.test.js:152-277`은 hydration/idempotency/observer를 검사하지만 Game `role=button`의 Enter/Space event를 검사하지 않는다.
- Expected Basis: AI standard `TEST-001`의 결정적 회귀 검증, `spec.md:198-224`의 renderer/hydration 경계와 `:234-243`의 runtime lifecycle, `designs.md:152-175`의 public preview API→Detail/Web/motion 연결, `BUILD_GUIDE.md:230`의 Inspector State Test.
- Actual: 152 Node test와 120×8×2 browser breadth는 통과해도 F001의 stale renderer와 F002의 keyboard gap이 모두 통과할 수 있는 assertion 구조다.
- Impact: “matrix가 1,920개를 통과했다”는 사실이 사용자 핵심 전환 경로의 정상 동작을 보장하지 않는다. 다음 renderer/style 추가 때 동일 결함이 재발해도 build/QA가 조기에 잡지 못한다.
- Suggested Action: breadth matrix와 별도로 stateful browser regression suite를 둔다. 최소 케이스는 core renderer 2종 간 same-archetype 전환, expansion 2종 간 전환, Web 4 tabs, inspector 4×3 출력, Game target Enter/Space다. 각 케이스에서 state/DOM/attributes/motion/HTML payload/interaction 결과를 함께 assert하고, official QA의 zero-rebuild assertion을 renderer-aware invariant로 확장한다.
- Re-audit Method: 새 테스트가 현재 결함을 실패시키는지 먼저 확인한 뒤 구현 수정 후 다시 152+ 테스트, catalog120, scalability 및 targeted browser transition suite를 실행한다. 실패 원인이 “DOM identity 보존”인지 “renderer output 일치”인지 assertion 메시지로 구분한다.
- Confidence: High (약 0.98)
- Notes: 이 finding은 F001/F002와 동일 버그를 중복 보고하는 것이 아니라, 현재 QA 계약이 왜 이를 놓쳤는지에 대한 별도 coverage finding이다.

### [A02-F004] Chrome interaction hard budget의 현재 실행 결과가 재현성 있게 수렴하지 않는다

- Pass: Debug & Engineering Quality
- Pattern: `DBG-001`, `BUILD-001`, `TEST-001`
- Area: Chrome performance gate repeatability
- Severity: Minor
- Status: Needs Clarification
- Summary: 동일 HEAD·Chrome 151 계열에서 기능/진단은 통과했지만 interaction max가 한 실행은 99ms, 다른 serial 실행은 373.4ms로 갈렸다. hard max 200ms gate의 원인이 제품 경로인지 Crostini host scheduling/load인지 아직 분리되지 않았으므로 성능 PASS를 재현성 있게 선언할 수 없다.
- Evidence:
  - `spec.md:234-243`과 `BUILD_GUIDE.md:242,264-265`는 interaction max `≤200ms`를 hard budget으로 두며 기존 기준선은 142.8ms라고 기록한다.
  - 독립 `verifyCatalog120Chrome.js` 실행은 interaction average `60.51ms`, max `99ms`, LCP `700ms`, CLS `0`, diagnostics/issues `0`이었다. `verifyRenderScalabilityChrome.js`도 view-change max `26.4ms`, search max `39.8ms`, split-search max `180.3ms`, LCP `504ms`, CLS `0`으로 200ms 안에 있었다.
  - 메인 에이전트가 추가 Chrome을 시작하지 않고 수행한 동일 HEAD·격리 Chrome 151 serial `catalog120` 재실행은 기능 matrix/diagnostic gate는 통과했으나 interaction max `373.4ms`로 hard budget을 초과했고 LCP `1188ms`, CLS `0`이었다.
  - 감사 기간 다른 Chrome QA 실행이 병렬로 존재했던 시점이 있어 독립 실행의 host contention 여부가 완전히 동일하지 않다. 메인 run은 serial로 보고되었지만 per-operation trace와 host load가 보고되지 않아 원인을 확정할 수 없다.
- Expected Basis: `spec.md:234-243`의 LCP/CLS/interaction budget, `BUILD_GUIDE.md:223,242,254-265`의 Chrome evidence/repeatability 기준, AI standard `DBG-001`/`BUILD-001`의 현재 실행과 산출물 drift 분리.
- Actual: LCP와 CLS는 두 실행 모두 기준 안이지만 interaction max는 한 번 200ms를 크게 초과했다. 따라서 기능 진단 0과 별개로 성능 gate는 “재현 가능한 PASS”가 아니며, 단일 outlier만으로 제품 성능 회귀라고 단정할 수도 없다.
- Impact: Crostini 사용자의 스케줄링 상태에 따라 입력·검색·전환이 hard budget을 넘을 가능성이 있다. 반대로 host variance라면 코드 변경으로 잘못 최적화할 위험이 있다.
- Suggested Action: 동일 Chrome profile 격리·동일 viewport·다른 QA 프로세스 0개 조건에서 최소 3회 serial 실행하고 interaction별 샘플/평균/max, Chrome/Vite/OS process load를 함께 기록한다. 반복 초과 시 slow operation을 trace해 Detail rebuild/검색/교차 split 경로의 main-thread work를 분해하고, 반복 미초과 시 환경 변동성으로 문서화하되 release gate의 accepted environment risk와 재검토 조건을 명시한다.
- Re-audit Method: `qa:catalog120:chrome`을 새 temp profile로 3회 serial 실행하고 각 report의 interaction max 및 operation name을 비교한다. 한 번이라도 200ms를 넘으면 해당 operation을 DevTools trace로 재현한다. 다른 Chrome QA와 동시 실행하지 않고, 결과를 current HEAD 및 Chrome version과 함께 보존한다.
- Confidence: Medium (재현성 불일치 판단 약 0.90, 제품 원인 판단 약 0.55)
- Notes: 이는 현재 확인된 deterministic 기능 결함이 아니라 gate 불확실성이다. A02의 추가 Chrome 실행은 parent의 지시에 따라 수행하지 않았다.

## 6. Uncertainties and Clarifications Needed

- `designs.md`의 “zero-rebuild로 action state 보존”과 `spec.md`/`BUILD_GUIDE.md`의 “canonical style별 distinct renderer와 새 선택을 반영한 inspector”를 동시에 만족하는 구현 세부 방식은 문서에 명시돼 있지 않다. 다만 현재 코드와 실제 Chrome 재현은 새 style renderer가 stale DOM으로 남는다는 사실을 확정하므로, 재작업 시 “DOM node identity 보존”과 “renderer markup 갱신” 중 무엇을 보존하는지 설계 결정으로 명시해야 한다. 이는 F001의 존재를 불확실하게 만드는 요구사항 모호성이 아니다.
- Performance F004의 제품 원인은 현재 두 실행 결과만으로 분리할 수 없다. parent serial run의 전체 artifact path와 per-operation trace가 없으므로 단일 실행을 제품 회귀로 승격하지 않았다. 3회 무부하 serial 재현이 필요하다.
- 기존 `.antigravity/archive`의 기준선 수치는 현재 실행과 동일하다고 가정하지 않았다. 이번 판단의 실행 근거는 위 Node 명령, Vite `write:false` compile, current dist byte comparison 및 현재 Chrome QA 결과다.
- 정적/DOM 및 자동화 증거는 renderer가 선택 style과 일치해야 함을 보이지만, 모든 style의 pixel-level 시각 품질은 이 보고서에서 판정하지 않았다.

## 7. Perspective Decision

**Decision: REWORK REQUIRED (A02 scope).**

현재 Node test/catalog/theme gate, Vite production compile, current `dist` 재현성, bundle budget, discovery, actual-120 breadth, lazy failure/retry, observer teardown, reduced-motion, URL/state 및 기본 responsive 진단은 통과했다. 그러나 Detail의 핵심 style 전환에서 선택 metadata와 실제 renderer DOM이 갈리는 **Confirmed Major A02-F001**이 있으며, 이는 사용자가 선택한 디자인 시안이 제대로 표시되는지에 직접 영향을 준다. 또한 Game keyboard activation(A02-F002)과 그 회귀 공백(A02-F003)이 남아 있다. F004의 interaction budget은 현재 환경에서 `Needs Clarification`이며, 재현 가능한 성능 PASS로 승격하지 않는다.

전체 PASS 또는 `PASS WITH KNOWN RISKS`로 판정하려면 최소한 다음을 충족해야 한다.

1. F001 수정 후 core/expansion, 8 archetype, Web 4 tabs, inspector 4×3에서 selected style과 실제 renderer/motion/HTML payload가 일치함을 browser evidence로 확인한다.
2. F002의 Game target Enter/Space와 accessible name을 수정하고 회귀 테스트를 추가한다.
3. F003의 stateful transition/keyboard coverage를 공식 QA gate에 포함한다.
4. F004를 동시 Chrome 없이 3회 이상 재실행해 `interaction max ≤200ms`의 반복성 또는 명시적 환경별 accepted risk를 확정한다.

