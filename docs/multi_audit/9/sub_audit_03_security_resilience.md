# Sub Audit Report

## 1. Audit Metadata

- Audit Turn: 9
- Perspective: A03 — 보안·신뢰 경계·접근성·오류 복원력
- User Goal: `$multi-audit 기능적으로 제대로 동작 못하거나 디자인 시안이 제대로 표시되지 않는 페이지가 있는지 점검. 전체적인 모든 기능이 다 정상동작하는지 점검`
- Audit Basis: Standard-backed
- Standard Path: `/home/eunho1/Projects/web/design_sample_selector/AI_AUDIT_DOC_STANDARD.md`

## 2. Assigned Scope

정적 웹앱의 URL/query/facet 및 localStorage 경계, 검색·댓글·채팅·폼 입력, `innerHTML`/template/attribute/URL/download/clipboard 경로, 외부 폰트와 정적 호스팅 보안 설정, Web Audio/Canvas, modal focus/keyboard/ARIA, lazy import의 loading/error/retry/cancel, timer·observer·hydration teardown, malformed ID/state, responsive/reduced-motion 경계를 독립적으로 점검했다. 특히 사용자 입력이 시안을 깨뜨리거나 상태가 다른 시안을 표시하는지, 로딩·오류 모달이 키보드 포커스를 가두고 복원하는지, 권한 거부·네트워크/폰트/Canvas 실패가 전체 앱 또는 특정 시안을 불능으로 만드는지에 초점을 두었다.

## 3. Excluded and Uninspected Scope

- 과거 `docs/multi_audit/**` 보고서는 읽지 않았고, 다른 감사 에이전트의 결론을 전제로 삼지 않았다.
- 서버 인증·권한·DB 및 실제 외부 배포/공격적 검사는 사용자 범위 밖이므로 제외했다.
- `.git`, `node_modules`, `dist` 내부는 조사 대상에서 제외했다. 소스·테스트·설정·제품 문서는 수정하지 않았으며, 보고서 외 지속 artifact를 만들지 않았다.
- 현재 정적 호스트의 실제 응답 보안 헤더/CSP와 외부 Google Fonts의 운영 가용성은 로컬 저장소만으로 확인할 수 없어 미검사다. 저장소 내 선언 및 배포 설정 부재만 기록했다.
- 사용자 입력을 수백만 문자로 채우는 장시간 stress, 실제 Clipboard 권한 거부 브라우저 세션, 강제 dynamic import/Canvas/폰트 네트워크 장애는 재현 artifact를 남기지 않기 위해 수행하지 않았다. clipboard와 AudioContext는 인라인 Node fake-browser/monkeypatch 프로브로 반환값·Promise 경계를 확인했다.
- Chrome DevTools MCP는 이 세션에서 제공되지 않았다. 이미 실행된 격리 Chrome 151 QA 스크립트의 기능/진단 결과만 사용했고, 여러 QA가 동시 실행되어 성능 수치는 판정에 사용하지 않았다.

## 4. Evidence Examined

- 기준·설계: `spec.md` §5.5–§7 (unknown reference, loader, state, font, security/accessibility/memory contract), `designs.md` §2.1–§2.3, `DESIGN_DECISIONS.md`의 generated theme/preview registry/URL·loader 결정, `BUILD_GUIDE.md`의 정적 호스팅·검증 계약.
- 입력/상태: `src/state/appState.js:8-16,31-71,141-170,191-207`, `src/state/discoveryUrlState.js:18-49`, `src/catalog/discoveryUrl.js:30-99`, `src/catalog/index.js:83-105`.
- 부트/lazy/modal: `src/main.js:17-20,47-105,119-132`, `src/components/detailView.js:110-128,145-157,1177-1214,1217-1220,1324-1352`, `src/components/mainView.js:450-469`.
- 사용자 DOM 및 lifecycle: `src/components/archetypeTemplates.js:431-434,659-663`, `src/components/mockupRuntime.js:34-42,57-63,89-145,192-208,556-651`, `src/components/audioWidget.js:103-133`, `src/state/discoveryUrlState.js:35-48`.
- Clipboard/Audio/Canvas: `src/utils/clipboard.js:8-36,47-65`, `src/audio/synthAudio.js:298-321,525-535`, `src/wasm/visualEngine.js:102-140,174-183`.
- HTML sink 추적: `rg -n "innerHTML|textContent|escapeHtml|execCommand|createObjectURL|document\.fonts|CSP|Content-Security" src index.html index.css package.json vite.config.js`. 검색·카탈로그·스타일 메타데이터는 `escapeHtml` 또는 static canonical data를 사용하고, 댓글·채팅 본문은 `textContent`를 사용한다. 현행 코드에서 사용자 제어 문자열을 unsanitized `innerHTML`로 넣는 확정 경로는 발견하지 못했다.
- 읽기 전용 검증: `npm test` — 152/152 pass; `npm run validate:catalog` — 오류 0, legacy 경고 56; `npm run check:themes` — exit 0; `npm audit --omit=dev` — 취약점 0; `npm ls --depth=0` — `vite@6.4.3`.
- 이미 완료된 격리 Chrome 151 QA: `qa:discovery:chrome` 9개 시나리오(320/375/414/768/1024/1440 폭, overflow 0, labeled input 89/89, reduced-motion 일치, runtime diagnostics 0); `qa:wave1:chrome` 두 실행 issue/diagnostic 0. 두 실행은 동시 부하가 있어 성능 수치는 사용하지 않았다. 이 QA는 건강한 정상 경로만 확인하며 lazy loading/error focus, clipboard 권한, malformed state를 coverage하지 않는다.
- 인라인 직접 프로브(파일 생성 없음): `navigator.clipboard.writeText` reject + `document.execCommand('copy') === false`에서 `copyToClipboard`는 `execCommandResult:false`인데도 toast가 `Copied Palette [ #fff ]! 📋`로 표시됐다. `appState.setCompareSubIds('__not-a-style__','<bad>')`는 두 raw 값을 그대로 저장했고, `getArchetypeHTML('made-up', design)`은 `game` HTML과 동일했다. `synthAudio.init`을 suspended context와 reject하는 `resume()`으로 monkeypatch한 뒤 `playBgm()`을 호출하면 `isPlaying:true`, `unhandled:"resume denied"`가 관찰됐다. `bindDiscoveryUrlState`는 popstate 직후 cleanup해도 queued 0ms callback이 state를 갱신했다.
- AudioNode 별 `createOscillator`/`createGain`/`createBiquadFilter` 생성부는 `onended`에서 disconnect하는지 `rg`로 확인했다. 이 계약 자체의 확정 위반은 이번 감사에서 찾지 못했다.

## 5. Findings

### [A03-F001] 댓글·채팅 입력 및 표시 DOM에 상한이 없어 클라이언트 자원 사용이 무제한이다

- Area: 사용자 입력, mockup DOM/state, timer/cleanup
- Severity: Minor
- Status: Confirmed
- Summary: 블로그 댓글과 채팅 input에 `maxlength`가 없고 runtime도 길이·개수 제한 없이 문자열을 DOM과 in-memory store에 계속 추가한다. XSS sink는 `textContent`라 안전하지만, 반복 입력으로 현재 시안의 DOM·배열·예약 응답/cleanup 목록이 계속 커진다.
- Evidence: `src/components/archetypeTemplates.js:431-434,659-663` input에 `maxlength` 없음; `src/components/mockupRuntime.js:556-579` trim만 한 댓글을 `textContent`와 `store.blog.comments`에 push; `:585-650` 채팅 메시지를 append하고 메시지마다 500ms timer와 cleanup closure를 추가.
- Expected Basis: `spec.md:270-275`의 안전 DOM 주입 및 메모리 무결성 계약, 사용자 목표의 모든 mockup 기능 동작, 일반적인 클라이언트 입력·DOM 자원 boundedness 불변조건. 제품이 특정 문자 수를 요구한다고 창작하지는 않으며, 제한 필요성이 resilience 판단이다.
- Actual: empty 문자열만 거르고 길이·history cap·rate limit이 없다. `textContent`/`createElement` 사용으로 markup 실행은 확인되지 않았다.
- Impact: 긴 문자열 또는 반복 전송 시 mockup이 느려지거나 메모리/레이아웃 비용이 누적될 수 있다. teardown 전에는 chat cleanup 배열도 계속 증가한다.
- Suggested Action: markup과 runtime 양쪽에 명시적 최대 길이(예: 2,000자)를 적용하고 표시/저장 목록을 bounded window(예: 최근 50개)로 제한한다. 중복 bot 응답을 coalesce/cancel하고 입력 거부를 `role="status"`로 알린다.
- Re-audit Method: 실제 DOM에서 최대 길이 초과와 반복 전송을 확인하고, teardown 전후 comment/message node 수, store 길이, pending timer/cleanup 수가 상한 이하인지 검증한다. `<`/`>` 입력이 text node로만 남는지도 함께 확인한다.
- Confidence: High
- Notes: 이 finding은 XSS가 아니라 무제한 클라이언트 자원 사용 위험이다. 현재 일반 사용 흐름의 즉시 장애는 stress 미실행으로 판정하지 않았다.

### [A03-F002] Audio widget의 Canvas rAF가 reduced-motion·modal·teardown 경계를 우회한다

- Area: Canvas, reduced-motion, modal lifecycle, teardown
- Severity: Minor
- Status: Confirmed
- Summary: 오디오 위젯 mini-spectrum은 `requestAnimationFrame`을 무조건 자기 자신에게 예약하며 `prefers-reduced-motion`, modal 활성 상태, root teardown/visibility를 검사하거나 취소하지 않는다.
- Evidence: `src/components/audioWidget.js:103-133`의 `drawVisualizer`가 매 frame `requestAnimationFrame(drawVisualizer)`를 호출하고 `ctx` null guard·cancel ID·media query 검사가 없다. `src/components/detailView.js:80-84,131-140`은 전역 `canvasVisualEngine`만 pause하고 audio widget loop에는 연결되지 않는다. `spec.md:270-275`, `designs.md:173`은 modal pause 및 reduced-motion 억제를 요구한다.
- Expected Basis: `spec.md:270-275` Canvas & Motion Optimization, preview runtime의 reduced-motion/off-screen lifecycle 계약, 사용자의 접근성·시안 표시 목표.
- Actual: reduced-motion에서도 JS rAF와 `Math.random()` 기반 bar 계산이 계속 실행되고, 상세/비교 modal이 열려도 audio canvas는 계속 그린다. 2D context가 null인 환경에서는 예약을 먼저 한 뒤 `ctx.clearRect`에서 예외가 반복될 수 있다. 현재 bootstrap은 위젯을 한 번만 렌더하지만 함수 자체에는 loop teardown이 없다.
- Impact: motion-sensitive 사용자의 설정이 무시되고 modal 중 불필요한 CPU 작업이 지속된다. Canvas API 경계가 실패하면 해당 callback의 반복 예외가 console을 오염시킬 수 있다.
- Suggested Action: lifecycle이 소유하는 단일 rAF ID를 두고 `prefers-reduced-motion`, `document.visibilityState`, modal/위젯 표시 및 재생 상태를 검사한다. unmount/teardown에서 `cancelAnimationFrame`하고 `ctx`가 없으면 정적 상태로 중단한다.
- Re-audit Method: reduced-motion을 켠 상태, 상세/비교 modal open, 위젯 root 제거/재렌더, `getContext` null stub에서 frame 예약 수·console exception·Canvas pixel/CPU 변화를 확인한다.
- Confidence: High
- Notes: main background `visualEngine.startLoop()`는 reduced-motion과 modal pause를 별도로 구현한다. 따라서 이 finding은 그 엔진의 정상 동작을 부정하는 것이 아니라 audio widget loop의 누락을 지적한다.

### [A03-F003] 초기 bootstrap에 사용자에게 보이는 오류 경계가 없다

- Area: app bootstrap, Canvas/component initialization, unhandled rejection, recovery
- Severity: Major
- Status: Confirmed
- Summary: `initApp()`의 `try`는 `finally`만 갖고 전체 초기화 예외를 잡아 fallback/retry UI로 전환하지 않는다. 호출부도 반환 Promise를 await/catch하지 않아 초기 Canvas·component·state 예외가 발생하면 부분/빈 화면과 unhandled rejection으로 끝날 수 있다.
- Evidence: `src/main.js:17-20`에서 `initApp` 시작; `:22-45` URL binding, Canvas init 및 모든 root render를 연속 호출; `:119-132` font wait만 국소 catch하고 `finally`에서 항상 `data-app-pending`을 제거한 뒤 `initApp()`을 직접 호출한다. 같은 파일 `:64-105`의 catch는 lazy Detail import에만 한정된다. 프로젝트 내 `window.onerror`/`unhandledrejection`/전역 error boundary 검색 결과도 없다.
- Expected Basis: `spec.md:234-243`의 lazy error/retry와 font fallback 계약, 사용자 목표의 페이지 기능 복원력, 일반적인 bootstrap 오류 시 visible recovery 불변조건.
- Actual: 정상 데이터에서는 기존 QA diagnostics가 0이지만, 초기 Canvas `init`, root renderer, URL adapter 또는 동기 import 이후 예외가 나면 `finally`가 pending 숨김만 해제하고 사용자 메시지·재시도·부분 초기화 복구를 제공하지 않는다.
- Impact: 첫 화면 전체 또는 여러 root가 빈/부분 상태가 되고 사용자가 새로고침 외 복구 수단을 갖지 못한다. 오류가 숨겨진 채 “준비 완료”처럼 보이거나 unhandled rejection이 남을 수 있다.
- Suggested Action: bootstrap 최상위에 안전한 `catch`와 `textContent` 기반 fatal state/retry UI를 추가하고, 각 root 초기화를 독립적으로 보호한다. pending 상태를 오류 UI 전환까지 유지하며 진단에는 사용자 입력/URL 원문을 노출하지 않는다.
- Re-audit Method: Canvas `getContext`/`init` throw, renderer throw, malformed state, 초기 dynamic import reject를 주입해 빈 화면 대신 accessible error+retry가 나타나는지, retry 후 정상화와 console unhandled rejection 부재를 확인한다.
- Confidence: High
- Notes: 이번 감사는 정상 catalog와 Chrome matrix를 통과했으므로 실제 정상 경로가 항상 실패한다는 뜻이 아니다. 결함은 fault path의 복구 경계 부재이며, 유발 fault 자체는 비파괴 주입으로 재감사할 항목이다.

### [A03-F004] Clipboard fallback이 `execCommand(false)`를 복사 성공으로 오판한다

- Area: clipboard permission/API failure, user feedback, data integrity
- Severity: Minor
- Status: Confirmed
- Summary: `navigator.clipboard.writeText`가 거부되면 fallback으로 이동하지만 `document.execCommand('copy')`의 Boolean 반환값을 확인하지 않고 항상 성공 toast와 COPY SFX를 실행한다.
- Evidence: `src/utils/clipboard.js:8-19`는 writeText rejection에서 `fallbackCopy`를 호출; `:21-36`은 `document.execCommand('copy')` 반환값을 버리고 곧바로 `showToast(...)`/`synthAudio.playSfx(...)`를 호출한다. 인라인 fake-browser 프로브에서 `writeText` reject 및 `execCommand` false를 주었을 때 `execCommandResult:false`인데 toast는 `Copied Palette [ #fff ]! 📋`였다.
- Expected Basis: 사용자가 요청한 clipboard/download 기능의 성공 상태 정확성, 일반적인 permission/API failure graceful degradation. `spec.md:272`의 동적 문자열 안전 주입도 적용되며, 실제 toast는 `:47-60`에서 `textContent`를 사용해야 한다.
- Actual: 두 복사 API가 모두 거부되어도 사용자에게 성공을 알린다. `textarea` 제거는 수행되지만 실패용 상태나 반환 Promise/result는 없다.
- Impact: 사용자가 산출물을 붙여넣을 수 있다고 믿어 시안 토큰·CSS를 잃거나 후속 작업을 잘못 진행할 수 있다. 보안상 XSS는 아니지만 신뢰 경계를 흐린다.
- Suggested Action: `copyToClipboard`를 Promise/result 반환 함수로 만들고 `execCommand` Boolean 및 예외를 모두 검사한다. 실패 시 `role="status"` 오류 toast를 표시하고 selection/focus를 복원하며, 성공 toast/SFX는 true 결과에서만 실행한다.
- Re-audit Method: writeText 성공/거부/throw와 execCommand true/false/throw 네 조합을 fake browser 및 실제 권한 거부 Chrome에서 확인하고, 성공·실패 toast, Promise 결과, focus/selection cleanup을 검증한다.
- Confidence: High
- Notes: `showToast` 자체는 `textContent` 기반이라 메시지에 특수문자가 들어가도 이 finding의 원인은 아니다.

### [A03-F005] malformed state가 unknown ID/enum을 받아 잘못된 시안 또는 빈 화면으로 대체한다

- Area: in-memory app state, malformed IDs, preview correctness
- Severity: Major
- Status: Confirmed
- Summary: 공개 state mutation 경계가 enum/shape/ID를 검증하지 않고, split 비교와 archetype renderer가 알 수 없는 값을 다른 시안으로 조용히 대체한다. unknown `currentView`는 main/discovery/detail root를 숨겨 빈 화면이 될 수 있다.
- Evidence: `src/state/appState.js:141-170`의 `setState`는 임의 partial state를 merge; `:191-194`의 `setCompareSubIds`는 `canonicalizeStoredId(id) || id`로 raw unknown을 보존; `:204-207`의 `setActiveArchetype`는 임의 truthy 값을 저장한다. `src/components/detailView.js:1217-1219,1324-1344`는 unknown compare ID를 각각 `ALL_SUB_DESIGNS[0]`/`[4]`로 fallback; `src/components/archetypeTemplates.js:9-30`은 unknown archetype를 `game`으로 fallback; `src/components/mainView.js:450-469` 및 `detailView.js:110-128`은 알려지지 않은 currentView에서 visible root를 닫는다. 인라인 probe 결과 compare IDs는 `['__not-a-style__','<bad>']`로 저장되고 unknown archetype HTML root는 known `game`과 동일했다.
- Expected Basis: `spec.md:220-230`, `designs.md:127,150,175`의 unknown/non-string ID는 `null`/empty/error이고 Swiss 또는 다른 스타일로 자동 대체하지 않는 preview/catalog 계약. 사용자 목표의 “제대로 표시” 및 상태 복원 불변조건.
- Actual: malformed compare state는 첫 번째/다섯 번째 canonical style을 표시하고, malformed archetype는 게임 시안을 표시한다. `currentView='UNKNOWN'` 등은 모든 주요 root를 숨겨 사용자에게 오류도 없이 빈 페이지처럼 보일 수 있다.
- Impact: 사용자가 선택한 것과 다른 디자인을 보고 비교/다운로드/확정할 수 있으며, stale state가 조용히 가려져 재현·복구가 어렵다. ID shape가 배열이 아니면 `compareSubIds[0]` 접근 오류로 subscriber 렌더가 실패할 가능성도 있다.
- Suggested Action: `setState`/전용 setter에서 currentView·viewMode·archetype·tab·device enum과 compare array shape를 검증한다. `canonicalizeSubId` 실패는 `null`/empty/error state로 명시하고 render 함수의 first/fifth/game fallback을 제거해 structured diagnostic과 reset/retry를 제공한다.
- Re-audit Method: unknown/non-string/null/array-shape-bad state를 테스트 harness에서 각 setter와 초기 render에 주입해, 다른 시안으로 대체되지 않고 명시적 empty/error/reset이 나오는지, 정상 state 복귀 후 render가 회복되는지 확인한다.
- Confidence: High
- Notes: 현재 URL은 discovery 필드만 allowlist normalize하고 bookmark/confirmed/recents만 localStorage canonicalize한다. compare/currentView/archetype는 현재 localStorage에 저장되지 않아 일반 사용자의 직접 URL 입력으로 즉시 도달하는 경로는 확인되지 않았지만, 명시된 malformed/stale state 경계 자체의 계약 위반은 결정적이다.

### [A03-F006] lazy Detail loading/error dialog가 포커스를 가두거나 닫을 때 복원하지 않는다

- Area: modal focus, keyboard, ARIA, lazy import recovery
- Severity: Major
- Status: Confirmed
- Summary: lazy Detail loading state는 `role="dialog" aria-modal="true"`를 렌더하지만 initial focus와 Tab trap이 없고, error state는 retry 버튼에 한 번 focus할 뿐 trap이 없다. cancel/close는 MAIN state만 설정하며 lazy 경로의 opener focus를 복원하지 않는다.
- Evidence: `src/main.js:64-85`의 `renderLazyDetailState`는 loading에서 focus를 이동하지 않고, error에서만 retry에 `.focus()`; `bindLazyDetailActions` `:57-62`는 click listener만 등록한다. `:88-105`의 import catch는 error UI로 전환할 뿐 focus lifecycle을 만들지 않는다. 실제 modal trap은 성공한 `detailView`의 `src/components/detailView.js:1177-1206`에서만 설치되고, opener 저장/복원도 `:145-157` 및 `:110-120` 성공 Detail 경로에 한정된다. `main.js:55`의 `closeLazyDetail`은 `{ currentView: 'MAIN' }`만 설정한다.
- Expected Basis: `spec.md:274`의 modal opening focus capture, Tab loop, previous focus restore; `spec.md:239-240`의 loading/error/cancel/retry loader contract; `designs.md` 접근성·오류 상태 계약.
- Actual: import가 지연되면 focus가 gallery의 opener 또는 body에 남은 채 aria-modal dialog가 열린다. 실패 후 retry에 focus가 가도 Shift+Tab/Tab은 dialog 밖으로 나갈 수 있고, “메인으로 돌아가기”를 누르면 lazy dialog가 제거되면서 기존 opener 복원 없이 focus가 사라진다.
- Impact: 키보드/스크린리더 사용자가 background gallery를 조작하거나 recovery action을 잃을 수 있고, 오류 시나리오에서 앱을 닫고 돌아오는 기본 복구가 접근 불능이 된다.
- Suggested Action: lazy dialog도 공용 focus-trap helper를 즉시 설치하고 opener를 loading 시작 전에 저장한다. loading은 cancel 또는 dialog heading/취소 버튼을 initial focus로 정하고 error는 retry/cancel 순서를 유지한다. cancel/성공 close/stale request 모두 trap 제거와 opener restore를 수행한다.
- Re-audit Method: dynamic import를 인위적으로 지연·거부한 상태에서 open 직후 activeElement, Tab/Shift+Tab 경계, Escape/cancel 후 opener, retry 후 trap 중복 여부를 Chrome 접근성 tree와 DOM event로 검증한다.
- Confidence: High
- Notes: 정상 Detail/Split 성공 경로의 `setupFocusTrap`와 restore 구현은 별도로 존재한다. 이 finding은 그 helper가 lazy loading/error 중에는 호출되지 않는 경로에 대한 것이다.

### [A03-F007] AudioContext resume 거부가 unhandled rejection을 만들고 재생 상태를 성공으로 고정한다

- Area: Web Audio permission/autoplay failure, async lifecycle, UI state
- Severity: Minor
- Status: Confirmed
- Summary: `ensureAudioContext()`가 suspended context의 `resume()` rejection을 외부로 전파하지만 BGM/SFX 호출부가 Promise를 await/catch하지 않는다. BGM은 resume 성공 전에 `isPlaying`과 scheduler를 시작한다.
- Evidence: `src/audio/synthAudio.js:298-303`은 `await this.ctx.resume()` 후 catch 없음; `:312-321`의 `playBgm()`은 `this.ensureAudioContext()`를 버리고 바로 `isPlaying=true`, state update, `startScheduler()`; `:525-535`의 `playSfx()`도 동일하게 unawaited 호출. monkeypatch probe에서 resume reject 시 `isPlaying:true`, `unhandled:"resume denied"`가 관찰됐다.
- Expected Basis: `spec.md:247-266`의 Web Audio 기능, `spec.md:270-275` AudioNode lifecycle·일반 permission failure graceful handling, 사용자에게 재생 상태를 정확히 보여야 한다는 신뢰성 불변조건.
- Actual: 브라우저 autoplay/권한 정책이 resume을 거부하면 console unhandled rejection이 남고, UI와 audio widget은 playing으로 표시될 수 있으며 scheduler가 실패한 context를 대상으로 계속 실행될 수 있다. 생성된 개별 oscillator/filter/gain의 `onended` disconnect 계약은 확인됐지만, context resume 경계는 보호되지 않는다.
- Impact: 오디오가 들리지 않는데 재생/Canvas spectrum 상태가 유지되고, 반복 클릭 시 오류가 누적될 수 있다. 오디오는 부가 기능이지만 런타임 diagnostics와 사용자 신뢰를 손상시킨다.
- Suggested Action: 호출부에서 `await/catch`하거나 `ensureAudioContext`를 안전한 result API로 바꾼다. running context 확인 뒤에만 `isPlaying`/scheduler를 시작하고, 거부 시 timer를 중단하고 muted/permission 안내를 accessible status로 제공한다.
- Re-audit Method: suspended context의 resume 성공/false/reject/throw를 stub해 unhandled rejection 0, state와 scheduler 일관성, 재시도 후 정상 재생을 확인한다.
- Confidence: High
- Notes: 실제 Chrome 권한 거부 세션은 실행하지 않았고, Promise 경계는 인라인 monkeypatch로 확인했다.

### [A03-F008] mockup toast/pulse 및 popstate callback 일부가 teardown 소유권 밖에 남는다

- Area: timer cleanup, observer/state lifecycle
- Severity: Minor
- Status: Confirmed
- Summary: mockup runtime의 transient toast/pulse timer는 cleanup registry에 등록되지 않고, discovery URL adapter의 0ms popstate timer도 cleanup 때 취소되지 않는다. 각각 짧은 수명이지만 rapid re-render/unmount 경계에서 detached node 또는 stale state callback이 살아난다.
- Evidence: `src/components/mockupRuntime.js:34-42,57-63`의 cleanup은 `rt.cleanups`만 실행; `:192-208`의 `showMockToast`/`pulseClass`는 element property timer만 만들고 `cleanups.push`하지 않는다. 채팅 응답 timer는 `:620-650`에서 등록되어 대조된다. `src/state/discoveryUrlState.js:35-48`은 `setTimeout`을 예약한 뒤 cleanup에서 listener/unsubscribe만 하고 timeout handle을 취소하지 않는다. fake adapter probe는 listener 제거 후에도 `searchAfterCleanup:"after"`로 queued callback이 state를 변경했다.
- Expected Basis: `spec.md:234-243` observer/lazy lifecycle cleanup, `designs.md` hydration/unmount cleanup 및 stale request 불변조건, 일반적인 timer ownership 안전성.
- Actual: mockup teardown 직후 최대 1.6초까지 detached toast/pulse callback이 실행될 수 있고, URL binding이 해제된 직후에도 이미 큐에 들어간 popstate callback이 state/history를 건드린다. 현재 singleton bootstrap에서는 보통 unmount가 없지만 재사용/HMR/rapid switching 경계에서 드러난다.
- Impact: bounded memory retention과 stale UI/state mutation이 발생해 반복 페이지 전환·테스트에서 간헐적 상태 오염 또는 console noise가 생길 수 있다.
- Suggested Action: 모든 timeout ID를 runtime/adapter cleanup에 등록하고 재예약 전 기존 ID를 취소한다. popstate adapter는 pending handle을 저장해 cleanup에서 clear하고 request token/state liveness를 다시 확인한다.
- Re-audit Method: root를 즉시 제거/재수화하고 URL adapter를 popstate 직후 cleanup한 뒤 callback 실행 여부, detached node mutation, state/history write를 spy로 확인한다.
- Confidence: High
- Notes: 관찰된 수명은 짧고 정상 bootstrap에서 즉시 전체 앱을 깨뜨리는 증거는 없어 Minor로 분류했다.

### [A03-F009] 정적 호스팅 CSP·외부 폰트 신뢰 정책이 저장소에 선언되어 있지 않다

- Area: CSP/third-party resource/config, static hosting hardening
- Severity: Info
- Status: Needs Clarification
- Summary: HTML에는 CSP meta/header 또는 SRI 선언이 없고, 전역 CSS가 Google Fonts를 원격 `@import`한다. 실제 배포 플랫폼이 헤더를 추가하는지는 저장소 밖이라 현재 보안 정책의 완결성을 확인할 수 없다.
- Evidence: `index.html:11-14,41-42`는 local CSS와 module script만 선언하고 CSP/SRI/security header 설정이 없다. `index.css:7`은 `https://fonts.googleapis.com/css2?...`를 import한다. `rg`에서 CSP/Content-Security/SRI 설정은 찾지 못했고 `package.json:27-29`의 직접 dev dependency는 Vite뿐이다. `main.js:121-127`은 `document.fonts.ready` 실패를 catch해 system fallback으로 계속 표시한다.
- Expected Basis: 정적 호스팅의 third-party resource/CSP hardening 일반 기준과 사용자 목표의 시안 표시 안정성. `spec.md:243`의 폰트 실패 system fallback 계약.
- Actual: Google Fonts 장애/차단 시 시스템 폴백으로 계속 보이는 경로는 있으나, 저장소만으로 script/style/font/connect origin을 제한하는 정책이나 resource integrity를 확인할 수 없다. 실제 운영 응답 헤더가 있으면 결과가 달라질 수 있다.
- Impact: 배포 환경에서 CSP가 없으면 향후 주입 경로의 방어 심도가 낮고, 외부 폰트 공급망/가용성에 의존한다. 현재 코드에서 원격 사용자 HTML을 실행하는 확정 XSS 경로는 찾지 못했으므로 즉시 취약점이나 PASS 차단 finding으로 단정하지 않는다.
- Suggested Action: 실제 정적 호스트의 header policy를 확인하고 `default-src 'self'` 중심의 최소 CSP, 필요한 `style-src`/`font-src`만 허용, `object-src 'none'`, `base-uri 'none'` 등 배포 정책을 문서화한다. 가능하면 폰트를 self-host/pin하고 CSP report-only부터 검증한다.
- Re-audit Method: 실제 host 응답 headers와 네트워크 요청을 확인하고 CSP violation·font failure 시 초기/상세/다운로드/clipboard 기능과 시스템 폴백을 검증한다.
- Confidence: Medium
- Notes: 실제 운영 헤더 미검사로 Status는 Needs Clarification이다. `npm audit --omit=dev`는 0 vulnerabilities였지만 이는 원격 폰트나 배포 CSP를 검증하지 않는다.

## 6. Uncertainties and Clarifications Needed

- 정상 catalog/URL/storage 경계는 비교적 방어적이다. `loadJSON`은 parse/storage 예외를 fallback으로 삼고, bookmark/confirmed/recents는 canonical ID로 정규화한다(`src/state/appState.js:8-71`). discovery URL은 search 120자와 category/facet/sort/view/saved allowlist를 적용한다(`src/catalog/discoveryUrl.js:30-99`). 이 경로에서 localStorage 예외나 URL 특수문자로 앱 전체가 깨지는 확정 증거는 찾지 못했다.
- `innerHTML` 사용 자체는 결함으로 세지 않았다. 검색 query·style metadata는 `escapeHtml`/`textContent` 경로이고, catalog/preview template 값은 현재 정적 canonical definitions에서 온다. 향후 remote catalog, user-editable theme, 외부 HTML renderer를 도입하면 동일 sink에 escaping/DOM assembly 재검증이 필요하다.
- `src/wasm/visualEngine.js:178-182`는 mouse/particle가 정확히 같은 좌표일 때 `dist===0`으로 `dx/dist`, `dy/dist`가 NaN이 될 수 있는 잠재 관찰이다. 랜덤/연속 좌표 특성상 이번 감사에서 재현하지 않았으므로 finding으로 확정하지 않았고, main Canvas 재감사 시 `dist > 0` guard를 확인할 필요가 있다.
- `selectionDock.js:145-181`의 confirm sheet와 `peekPreview.js:89-100`의 peek card는 `role="dialog"`를 사용하지만 현재 dock/peek가 비모달 surface인지 modal인지 제품 문서가 명확하지 않다. confirm sheet를 modal로 취급해야 한다면 lazy Detail과 동일한 focus/ARIA 계약을 적용해야 하며, 먼저 제품 semantics를 명확히 해야 한다.
- 실제 정적 배포 headers, 실제 Clipboard permission prompt, dynamic import 네트워크 장애, screen-reader accessibility tree의 loading/error 상태는 보완 검증이 필요하다. 기존 Chrome QA의 diagnostics 0은 해당 fault/accessibility coverage를 대신하지 않는다.

## 7. Perspective Decision

**HOLD** — 정상 경로는 `npm test` 152/152, catalog 오류 0, theme check 0, 격리 Chrome 기능/진단 0을 통과했지만, 현재 구현에는 해결되지 않은 Major 신뢰성·접근성 계약 위반이 있다. 특히 (1) 초기 bootstrap 예외가 사용자 복구 UI 없이 pending flag만 해제되는 경로, (2) malformed state가 다른 시안을 선택하거나 주요 root를 숨기는 경로, (3) lazy loading/error `aria-modal`이 포커스 capture/trap/restore 없이 열리는 경로는 사용자 목표의 “모든 기능 정상·시안 정확 표시”를 차단한다. clipboard 성공 오판, AudioContext rejection, unbounded input, Canvas/timer lifecycle 및 CSP는 우선순위에 따라 후속 hardening이 필요하다.

`/home/eunho1/Projects/web/design_sample_selector/docs/multi_audit/9/sub_audit_03_security_resilience.md`를 먼저 읽고 각 finding을 실제 코드와 대조한 뒤, 계약 변경이 필요하면 관련 문서를 먼저 갱신하고 수정 후 테스트·빌드·재감사 증거를 기록해야 한다.
