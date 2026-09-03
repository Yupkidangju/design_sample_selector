# Sub Audit Report

## 1. Audit Metadata

- Audit Turn: 12
- Perspective: 보안·신뢰 경계·오류 복원력
- User Goal: 코더 수정 완료 후 재감사하고 프로젝트 전체의 신규 문제를 탐색한다.
- Audit Basis: Standard-backed
- Standard Path: `/home/eunho1/Projects/web/design_sample_selector_2/AI_AUDIT_DOC_STANDARD.md`
- Report Contract: `/home/eunho1/.codex/skills/multi-audit/references/report-contract.md`
- Project Root: `/home/eunho1/Projects/web/design_sample_selector_2`
- Project Type: 정적 Vite 클라이언트 앱 (서버·인증·DB 없음)
- Assigned Report: `/home/eunho1/Projects/web/design_sample_selector_2/docs/multi_audit/12/sub_audit_03_security_resilience.md`
- Audit Mode: 소스·설정·테스트·제품 문서 read-only 검사와 표적 Node 실행만 수행
- Source/Artifact Mutation: 없음. 소스·테스트·설정·제품 문서를 수정하지 않았다.

## 2. Assigned Scope

다음 신뢰 경계를 독립적으로 대조했다.

- DOM injection: `innerHTML` sink의 실제 값 provenance, `textContent`/`createElement`/`escapeHtml` 적용, preview registry 실행 요소 거부
- URL 및 `localStorage`: query 길이·allowlist, 저장값 UTF-16 상한·shape 복구, AppState 공개 mutation
- Clipboard·Web Audio·Browser API: 권한 거부·예외·resume 실패·node/context lifecycle과 사용자 성공 상태
- 외부 링크·네트워크: 제품 runtime의 `fetch`/XHR/WebSocket/navigation과 static source URL·font import
- QA child process: `spawn`/`execFile` shell 경계, loopback 서버, artifact 경로·symlink 처리
- dependency supply chain: lockfile provenance, install lifecycle script, CI audit 범위
- GitHub Pages: workflow 권한·trigger·artifact binding·remote misdeployment 경계
- error recovery: bounded diagnostics, dynamic import/Detail/preview recovery, Audio/clipboard failure recovery

## 3. Excluded and Uninspected Scope

- `/home/eunho1/Projects/web/design_sample_selector` 원본 폴더: 사용자 지시로 접근·수정·명령 실행 금지
- `node_modules/`, `dist/`, `.git/` 내부: 감사 제외 범위
- `docs/multi_audit/**`, `REFACTORING_AUDIT_REPORT`, `REFACTORING_CODER_HANDOFF` 등 과거 감사 보고서: 사용자 지시로 읽지 않음
- 생성·벤더 트리 및 감사 산출물: 현재 런타임 소스와 CI 경계 판단에 필요한 경우를 제외하고 읽지 않음
- Build/Vite production build 및 Chrome QA: 사용자 지시상 실행하지 않음. 따라서 실제 배포 응답 헤더, 실제 Pages origin, production browser fault matrix는 미검증이다.
- `npm audit` 네트워크 조회: 외부 registry 결과를 새로 가져오지 않았다. lockfile 및 workflow의 audit 범위만 정적으로 확인했다.
- 서버/auth/CORS/remote API 패턴: 이 정적 앱에는 해당 구현이 없어 억지 finding으로 만들지 않았다.

## 4. Evidence Examined

### 4.1 문서·구성·의존성 인벤토리

검사한 핵심 파일은 `spec.md`, `designs.md`, `implementation_summary.md`, `README.md`, `BUILD_GUIDE.md`, `audit_roadmap.md`, `package.json`, `package-lock.json`, `vite.config.js`, `project.config.js`, `index.html`, `.github/workflows/deploy-pages.yml` 및 `src/`, `scripts/`, `tests/`의 관련 파일이다.

제품 계약에서 확인한 기준은 다음과 같다.

- `spec.md:253-265` — Clipboard/Audio 실패 시 성공 상태를 표시하지 않음, 댓글·채팅 UTF-16 500/기록 50, Pages artifact closure, bounded diagnostics, renderer executable sink 거부, `localStorage` 16,384/120/6 및 손상값 폐기
- `spec.md:258-264` — Pages root/query/hash URL, clean `dist` artifact, manifest closure, diagnostic 허용 필드, Detail rollback, static renderer trust
- `spec.md:7` 보안 계약 — dynamic output은 `textContent`/`createElement`, 직접 unsanitized `innerHTML` 금지
- `designs.md:281-284` — recovery/rollback, static registry HTML, 저장 상한·손상값 폐기

### 4.2 실행 명령과 핵심 결과

다음 표적 명령은 read-only 검사 또는 Node 메모리 실행이었다.

| 명령 | 결과 |
| --- | --- |
| `node --version` | `v22.23.2` |
| `npm --version` | `10.9.8` |
| `node --test tests/auditRemediation10.test.js tests/auditRemediation11.test.js tests/auditRemediation11Reaudit1.test.js tests/previewRegistry.test.js tests/catalogDiscovery.test.js` | 5개 test file subtest가 모두 `ok`, `5/5 pass`, `0 fail` |
| URL/storage probe: `parseDiscoverySearch` 5,000자 query + invalid locale/facet, `readStoredJSON` malformed JSON | query는 120자로 정규화, locale은 `ko`, malformed JSON key 제거 |
| AppState probe: 121자 `searchQuery`, unknown facet을 `setState`로 제출 | 두 patch 모두 `true`; 상태에 121자 query와 `{notARealFacet:[...]}`가 보존됨 |
| AppState direct-mutation probe | `getState()`가 내부 object와 동일(`sameObject:true`); 직접 대입으로 query 5,000자, bookmarks 1,000개, unknown facet 보존 |
| malicious `getArchetypeHTML` probe | `game/ecommerce/blog/media/chat` 모두 synthetic `<img ... onerror>` 이름이 그대로 포함; ecommerce/blog에는 `<script>`도 그대로 포함 |
| Fake `AudioContext` init failure probe | context 1개 생성, `close()` 0회, `init:false`, `ctx:null`; 3회 retry 시 context 3개/close 0회 |
| Fake scheduler failure probe | `playBgm()` Promise가 reject되고 `enginePlaying:true`, `statePlaying:true`, `timer:false`로 남음 |
| `rg` network/process search | `src`에는 runtime `fetch`/XHR/WebSocket가 없고, `fetch`/WebSocket은 QA script에만 있음. 제품 CSS에는 의도된 Google Fonts `@import`가 있음 |

Build/Chrome QA는 실행하지 않았다. 이는 미실행 누락이 아니라 사용자가 지정한 source/artifact mutation 및 browser QA 제한 때문이다.

## 5. Trust Boundary Summary

```text
URL query/hash ──> discoveryUrl normalize/allowlist ──> AppState/renderers
localStorage ────> readStoredJSON + canonical IDs ───> AppState/renderers
comments/chat ───> 500/50 validation ───────────────> textContent DOM
catalog/locale ──> legacy templates + registry ──────> innerHTML DOM
clipboard/audio ─> browser permission/API ───────────> state/status/SFX
CI lock/install ─> npm lifecycle + build ────────────> dist + Pages deploy
QA args ─────────> child process/path/artifact I/O ───> test evidence files
```

URL parser, runtime comment/chat, clipboard fallback, registry executable-pattern guard, loopback QA server와 shell-free child process는 현재 입력 경계를 상당 부분 통과한다. 아래 finding은 그 경계를 직접 강제하지 않는 부분과 오류·배포 경계를 다룬다.

## 6. Findings — Pass 1: Implementation Compliance

### [SEC-F001] Legacy archetype와 일부 gallery/audio renderer가 Safe DOM Injection 계약을 강제하지 않음

- Pass: Implementation Compliance / Security
- Pattern: SEC-008 — `innerHTML` provenance와 renderer 보안 문서 정합성
- Area: DOM injection, renderer trust boundary, locale/catalog field provenance
- Severity: Minor
- Status: Needs Fix
- Contract Status: Confirmed
- Summary: 현재 canonical catalog·locale pack은 프로젝트 소유 정적 데이터이고 URL/localStorage의 사용자 문자열은 이 template 값으로 직접 흐르지 않는다. 그러나 Safe DOM 계약이 선언한 `textContent`/`createElement` 또는 중앙 escaping을 renderer가 강제하지 않는다. 특히 `getArchetypeHTML`은 `subDesign`과 `t()` 결과를 여러 text/attribute/style 위치에 그대로 보간하고, `detailView`/`mainView`가 그 결과를 `innerHTML`로 커밋한다. Registry의 실행 요소 정규식은 별도 preview 경계이며 HTML text/attribute escaping을 보장하지 않는다.
- Evidence:
  - `src/components/archetypeTemplates.js:12-50`은 `getArchetypeHTML` 결과를 `localizePreviewMarkup`에 전달하지만 template 자체의 모든 interpolated value를 escape하지 않는다.
  - `src/components/archetypeTemplates.js:177-225`의 `category`, `playerName`, `name`, meter/profile 값, `t()` 결과, `src/components/archetypeTemplates.js:397-451`의 `name`, `shortDesc`, palette `hex/name`, `src/components/archetypeTemplates.js:512-582`의 name/characteristics/comment copy, `src/components/archetypeTemplates.js:695-735` 및 `:767-785`의 name/category/channel 값이 raw interpolation이다.
  - `src/components/detailView.js:440`, `:645`, `:679`, `:1382`, `:1413`, `:1444-1452`가 `getArchetypeHTML(...)`을 `.innerHTML`로 삽입한다. `src/components/mainView.js:191`, `:255-265`, `:324-335`도 `sub.name`, `shortDesc`, palette/tag 값을 일부 raw interpolation한다. `src/components/audioWidget.js:23-60`은 track title/mood와 locale copy를 raw interpolation한다.
  - `src/preview/registry.js:219-230`은 `<script|iframe|object|embed|link|meta>`, inline handler, `javascript:` URL만 거부한다. `src/preview/localizeMarkup.js:8-15,101-112`의 escape는 locale replacement에만 적용되고 original template interpolation을 정화하지 않는다.
  - 반증/완화: `src/preview/renderers-expansion.js:7-18`은 dynamic blueprint/action 값을 `escapeHtml`한다. 실제 registry renderer에 malicious `design.name`을 주는 Node probe는 `containsName:false`, `containsScript:false`, `containsHandler:false`였다. 반면 `getArchetypeHTML` probe 결과는 다음과 같다: `game {containsName:true, containsHandler:true}`, `ecommerce {containsName:true, containsScript:true, containsHandler:true}`, `blog {containsName:true, containsScript:true, containsHandler:true}`, `media/chat {containsName:true, containsHandler:true}`.
- Expected Basis: `spec.md:7`, `spec.md:264`, `designs.md:284`, AI audit standard SEC-008 — dynamic/user-facing output은 safe DOM API 또는 context-correct escaping으로 sink에 도달해야 하고, static registry trust가 escaping 정책을 대체하지 않아야 한다.
- Actual: 현재 공개 UI 경로의 catalog/locale 값은 정적이지만, exported renderer와 Detail/Split/Bento/audio sink에 source provenance enforcement가 없다. synthetic hostile design을 통해 executable-looking markup이 그대로 생성된다.
- Impact: catalog/locale pack이 외부·커뮤니티·원격 데이터로 바뀌거나 renderer API가 untrusted fixture를 받는 순간 text/attribute break-out, event attribute 및 element injection으로 확대될 수 있다. 현재 URL query와 댓글/채팅 입력의 직접 XSS 경로는 별도로 확인되지 않았지만, 동일한 static trust 가정이 한 곳이라도 깨지면 여러 화면에 동시에 영향을 준다.
- Suggested Fix: renderer 경계를 하나로 정하고, 모든 human value는 `textContent`/`createElement`로 구성하거나 text/attribute/style context별 중앙 `escapeHtml`을 적용한다. `getArchetypeHTML`과 모든 raw `.innerHTML` sink에 malicious name/description/palette/locale regression test를 추가하고, registry validation은 executable tag 검사 외에 renderer output provenance 정책을 명시적으로 검사한다. `style` 값은 color contract를 통과한 값만 DOM property로 적용한다.
- Re-audit Method: 8개 archetype와 Detail/Split/Bento/Spectrum/audio를 synthetic `<script>`, quote, inline-handler, `javascript:` 값으로 생성하고 실제 DOM parse 후 element/attribute/text를 확인한다. URL/localStorage/comment/chat 값이 각 sink에 도달하지 않는 data-flow도 다시 확인한다.
- Owner: Coder / Architect
- Confidence: High (현재 악용 경로의 도달성은 낮지만 계약 drift와 output probe는 재현됨)
- Notes: 현재 static catalog만 신뢰하는 설계 자체를 취약점으로 확장해 판정하지 않았다. finding은 명시된 Safe DOM 계약을 코드가 방어적으로 강제하지 않는다는 의미다.

### [SEC-F002] AppState가 공개 내부 object를 그대로 노출하고 query/facet/audio bounds를 setter에서 완성하지 않음

- Pass: Implementation Compliance / Security
- Pattern: SEC-004/SEC-008 — unvalidated state mutation, input bounds
- Area: URL/localStorage-derived state, in-memory state integrity, render DoS surface
- Severity: Minor
- Status: Needs Fix
- Contract Status: Confirmed
- Summary: URL adapter는 정상적으로 query 120자와 facet allowlist를 적용하지만, AppState 공개 API는 그 계약을 다시 강제하지 않는다. `setState`의 `searchQuery`는 string 여부만, `activeFacets`는 각 value가 string array인지 여부만 검사한다. 더구나 `getState()`가 내부 state object를 그대로 반환해 호출자가 모든 nested field를 sanitizer 없이 직접 바꿀 수 있다.
- Evidence:
  - `src/state/appState.js:295-297`의 `getState()`는 `this.state`를 그대로 반환한다.
  - `src/state/appState.js:228-240`은 `searchQuery` 길이/정규화와 facet ID/value allowlist를 확인하지 않는다. `:258-264`의 audio 검사는 finite number/type만 확인한다.
  - 방어 경로인 `src/catalog/discovery.js:5,43-46,72-89`와 `src/catalog/discoveryUrl.js:12-13,57-86`은 query/facet을 별도로 bounded/allowlist한다. 즉 URL 경계와 AppState 경계의 enforcement가 이중화되지 않았다.
  - 실행 결과: `setState({searchQuery:'x'.repeat(121)})`는 `accepted:true, searchLength:121`; `setState({activeFacets:{notARealFacet:['notARealValue']}})`도 `true`였다. 이어 `getState()`에 직접 `searchQuery='x'.repeat(5000)`, `bookmarks=Array(1000)`, unknown facet을 대입하면 `sameObject:true, searchLength:5000, bookmarkLength:1000`으로 유지됐다.
- Expected Basis: `spec.md:245-254` 및 runtime state contract — public state mutations는 field type/allowlist/bounds를 검증하고 invalid value는 current/null/error를 유지해야 한다. `spec.md:265`의 storage upper bounds도 in-memory state가 우회하지 않아야 한다.
- Actual: URL parse는 안전하지만 public state object identity와 setter의 부분 검증으로 query/facet/audio/list invariant를 우회할 수 있다. 내부 현재 호출자는 주로 read-only 사용이라 즉시 외부 exploit은 확인되지 않았다.
- Impact: unbounded query/facet/list가 gallery query/render에서 반복 처리되어 CPU/memory 부담을 만들 수 있고, polluted state가 subscriber·URL serializer·audio/widget에 서로 다른 정규화 결과를 전달해 복구와 UI consistency를 깨뜨릴 수 있다.
- Suggested Fix: `getState()`에 deep-frozen snapshot 또는 immutable copy를 반환하고, `setState`가 shared `normalizeSearchQuery`/`normalizeFacetSelections`와 audio track/index·volume 범위를 사용하도록 한다. nested array/object도 freeze/copy해 direct mutation을 막고, 121/5,000자 query, unknown facet, oversized list/audio 값에 대한 regression test를 추가한다.
- Re-audit Method: setter·returned snapshot·nested object를 각각 mutate하는 Node test 후 subscriber, serialized URL, renderer, localStorage persistence가 bounded 상태만 관찰하는지 확인한다.
- Owner: Coder / Architect
- Confidence: High
- Notes: 현재 localStorage에 저장되는 canonical bookmark/recents는 정상 경로에서 실제로 120/6 이하이며, 이 finding은 URL parser가 실패했다는 뜻이 아니라 AppState public boundary가 별도 보호되지 않는다는 뜻이다.

### [SEC-F003] 문법상 유효하지만 shape가 잘못된 localStorage JSON이 key에 남음

- Pass: Implementation Compliance / Security
- Pattern: SEC-004 — persistence recovery and input shape validation
- Area: localStorage corruption recovery
- Severity: Minor
- Status: Needs Fix
- Contract Status: Confirmed
- Summary: malformed JSON과 oversized raw string은 제거되지만, 문법상 유효한 object/string/null이 bookmarks/recents key에 저장되면 loader가 빈 기본값으로 사용하면서 원래 key를 제거하지 않는다.
- Evidence:
  - `src/state/appState.js:16-28`의 `readStoredJSON`은 `JSON.parse` 성공만으로 값을 반환한다.
  - `src/state/appState.js:67-73` 및 `:83-89`는 `Array.isArray(parsed)`인 경우에만 canonical rewrite를 수행한다. `{}`, `"not-an-array"`, `null`은 parse 성공 후 key가 남는다.
  - 실행 결과: `readStoredJSON`에 raw `{}`, `"not-an-array"`, `null`을 넣으면 각각 `removed:false`였다. 반대로 raw `{bad`는 `removed:true`였고, 5,000자 URL query는 120자로 정규화됐다.
- Expected Basis: `spec.md:265`, `designs.md:284` — 초과·손상 JSON은 사용하지 않고 해당 key를 제거한 뒤 안전한 기본값으로 복구한다.
- Actual: wrong-shape 값은 이번 부팅에서 안전한 `[]/null`처럼 소비되지만, 반복 부팅 때마다 잘못된 key를 다시 읽는다. 사용자가 직접 제공한 JSON 값이 곧 HTML sink로 흐르지는 않는다.
- Impact: 지속적인 복구 반복과 stale/corrupt state 관찰을 유발하며, shape가 확장되는 경우 검증되지 않은 값이 후속 코드로 전달될 위험을 남긴다.
- Suggested Fix: key별 expected shape validator를 `readStoredJSON` 호출부에 적용하고, `bookmarks`/`recents`가 array가 아니거나 `confirmed`가 canonical string/null이 아니면 즉시 `removeItem` 후 기본값을 반환한다. 이 경계를 테스트에 명시한다.
- Re-audit Method: 각 저장 key에 valid JSON wrong shape, oversized UTF-16, duplicate/unknown ID, storage get/remove exception을 넣어 key 제거·default·다음 부팅 상태를 확인한다.
- Owner: Coder
- Confidence: High
- Notes: syntactically malformed/oversized recovery 자체는 통과했다. 남은 문제는 shape validation 후 purge 누락이다.

## 7. Findings — Pass 2: Debug / Engineering Quality

### [RES-F001] Web Audio 초기화·resume 실패 시 생성된 AudioContext가 닫히지 않음

- Pass: Debug / Engineering Quality
- Pattern: Error recovery, browser API resource lifecycle
- Area: Web Audio initialization and retry
- Severity: Minor
- Status: Needs Fix
- Contract Status: Confirmed
- Summary: `init()`가 context와 일부 node를 만든 뒤 예외를 잡으면 참조만 null로 만들고 context `close()`/node disconnect를 수행하지 않는다. `ensureAudioContext()`의 resume 예외도 timer/state만 복구하고 context를 폐기하지 않는다.
- Evidence:
  - `src/audio/synthAudio.js:241-307` — `new AudioCtx()` 및 master/filter/delay/analyser graph를 만든 뒤 catch에서 `this.ctx`와 node refs를 null로 만들지만 `close()` 호출이 없다.
  - `src/audio/synthAudio.js:310-327` — resume 실패 시 timer와 `isPlaying`만 정리하며 suspended `this.ctx`를 닫지 않는다.
  - Fake context probe에서 `createBiquadFilter()`를 throw하게 하면 `created:1, closed:0, initialized:false, ctx:null`; 같은 engine의 `init()` 3회는 `created:3, closed:0`이었다.
  - 정상 voice 종료 경로는 `src/audio/synthAudio.js:471-477,507-513,543-549,664-669,697-703,720-725`에서 oscillator/source와 연결 node를 disconnect한다. 따라서 본 finding은 정상 voice lifecycle이 아니라 init failure lifecycle에 한정된다.
- Expected Basis: `spec.md:95`, `spec.md:253-254` — browser API 실패는 성공 상태를 표시하지 않고 retry 가능해야 하며, Audio node lifecycle은 정리되어야 한다.
- Actual: failure 후 retry할 때 이전 context가 명시적으로 닫히지 않는다. 브라우저가 GC하더라도 close 보장은 없다.
- Impact: 반복 권한/API/초기화 실패에서 AudioContext 및 graph resource가 누적되어 browser context quota에 도달하거나 이후 retry가 계속 실패할 수 있다.
- Suggested Fix: init 중간 실패를 위해 local context/created nodes를 별도로 추적하고 `disconnect()`/`close()`를 best-effort 수행한 뒤 모든 ref를 reset한다. resume 실패에도 context state를 기록하고 폐기 여부를 결정하는 공통 cleanup을 둔다.
- Re-audit Method: constructor, graph node creation, resume, retry를 각각 throw하는 fake context와 실제 isolated browser fault injection으로 `close`/disconnect count, context count, retry success, user status를 확인한다.
- Owner: Coder
- Confidence: High
- Notes: 정상 voice `onended` cleanup과 resume 실패 시 playing=false는 확인된 강점이다.

### [RES-F002] Scheduler/voice 예외가 optimistic playing state와 unhandled async event를 남김

- Pass: Debug / Engineering Quality
- Pattern: Error recovery, async browser boundary
- Area: Audio play/retry state machine
- Severity: Minor
- Status: Needs Fix
- Contract Status: Confirmed
- Summary: `playBgm()`가 `ensureAudioContext()` 성공 후 `isPlaying`과 AppState를 먼저 true로 만들고 `startScheduler()`를 호출한다. `tickStep()`의 oscillator/node creation 예외는 이 경계에서 catch되지 않으며, audio widget click listener도 `toggleBgm()` rejection을 처리하지 않는다.
- Evidence:
  - `src/audio/synthAudio.js:341-352` — `isPlaying=true` 및 `appState.setState({audio:{isPlaying:true}})` 후 `startScheduler()` 실행.
  - `src/audio/synthAudio.js:396-438` — `startScheduler()`가 즉시 `tickStep()`을 호출하고, `tickStep()`/voice 생성에는 공통 catch가 없다.
  - `src/components/audioWidget.js:80-91` — click listener가 `await synthAudio.toggleBgm()`을 try/catch 없이 실행한다.
  - Fake context에서 `createOscillator()`를 throw하게 한 probe 결과: `playBgm()` rejection, `enginePlaying:true`, `statePlaying:true`, `timer:false`.
  - `playSfx()`는 `src/audio/synthAudio.js:557-648`에서 synthesis exception을 false로 변환하며, clipboard는 `src/utils/clipboard.js:12-47,50-59`에서 실패 false/error toast/no success SFX로 처리한다. 따라서 이 finding은 SFX/clipboard 전체가 실패한다는 주장이 아니다.
- Expected Basis: `spec.md:253` — 성공하지 못한 AudioContext/API 작업은 성공 상태를 표시하지 않고 retry 가능해야 한다.
- Actual: scheduler failure 후 playing 상태와 async rejection이 남아 UI status가 `audio.startError`로 정착하지 않는다. 사용자가 다시 토글해 stop하면 복구될 수 있으나 명시적 recovery contract가 아니다.
- Impact: console unhandled rejection, play indicator와 실제 audio timer의 불일치, retry 동작의 불확정성이 발생한다.
- Suggested Fix: scheduler 시작을 transactional하게 감싸고 실패 시 timer/voice/state를 false로 rollback한 뒤 false를 반환한다. widget event handler는 `try/catch`로 user-visible failure를 표시한다. `setTrack()`에는 valid index guard를 두어 invalid public call이 track dereference를 throw하지 않게 한다.
- Re-audit Method: `createOscillator`, `createGain`, `start`, `stop`, `setInterval`, `resume` fault를 순차 주입하고 Promise rejection 0, playing=false, timer=none, retry success를 검증한다.
- Owner: Coder
- Confidence: High
- Notes: `AudioContext.resume()` 실패만을 다루는 기존 test는 통과했지만, resume 이후 scheduler failure branch는 별도 regression test가 없다.

## 8. Findings — Pass 3: Security / Supply Chain / Delivery

### [SUP-F001] Pages 배포 job이 dependency lifecycle script를 신뢰 권한 job 안에서 실행함

- Pass: Security
- Pattern: SEC-006 — scanner/supply-chain and build trust boundary
- Area: npm install, CI token/workspace, Pages artifact integrity
- Severity: Major
- Status: Needs Fix
- Contract Status: Confirmed
- Summary: Pages workflow가 `npm ci`를 `--ignore-scripts` 없이 실행하고, 이어 같은 job에서 test/build/artifact upload/deploy를 수행한다. lockfile에는 install script가 있는 transitive build dependency가 명시되어 있다. actions pin과 lock integrity는 좋은 완화지만, install script를 차단하는 release fence는 없다.
- Evidence:
  - `.github/workflows/deploy-pages.yml:8-11` — job 권한에 `contents: read`, `pages: write`, `id-token: write`가 설정된다.
  - `.github/workflows/deploy-pages.yml:24-42` — SHA-pinned checkout/setup-node 뒤 `npm ci`, `npm run check`, bundle/artifact/Chrome QA, `npm audit --omit=dev`가 같은 job에서 실행된다. checkout에 `persist-credentials: false`도 없다.
  - `package.json:24-31`은 Vite를 devDependency로 사용하고, `package-lock.json:875-884`의 `node_modules/esbuild`는 `hasInstallScript: true`다. optional `fsevents`도 `package-lock.json:935-948`에 `hasInstallScript: true`로 기록되어 있다.
  - child-process 형태 자체는 `src`에 없고 QA는 `spawn`/`execFileSync` argument array를 사용한다. 이 finding은 shell injection이 아니라 npm lifecycle code execution과 release trust에 한정된다.
- Expected Basis: AI audit standard SEC-006 및 security-and-hardening guidance — committed lockfile 전체의 install/build supply chain을 별도 검토하고, unreviewed install script가 release 권한·artifact를 통제하지 못하도록 fail-closed해야 한다. `spec.md:259-260`의 clean `npm ci`/verified dist contract도 build provenance가 검증 가능해야 한다.
- Actual: lockfile integrity를 확인하는 `npm ci`이지만 lifecycle scripts는 실행된다. install script가 workspace/dist를 변경하거나 저장소 checkout credential·CI 환경을 읽을 수 있는 시점이 tests/build/audit보다 앞선다. `npm audit`는 사후 단계라 install script를 보호하지 않는다.
- Impact: 공급망이 손상된 transitive package 또는 lockfile 변경이 테스트와 manifest를 통과하는 악성 Pages artifact를 생성하거나 CI credential/network를 악용할 수 있다. 현재 lockfile에 악성 script가 있다는 증거는 없지만, control gap은 release 경로 자체에 있다.
- Suggested Fix: 설치를 `npm ci --ignore-scripts`로 fail-closed하고 필요한 esbuild native binary는 명시적으로 검토·허용된 별도 절차에서 공급한다. build와 deploy 권한 job을 분리하고, checkout은 `persist-credentials: false`로 설정하며 deploy job에만 Pages/id-token 권한을 부여한다. lockfile diff와 package lifecycle metadata review를 required check로 남긴다.
- Re-audit Method: clean runner에서 install script 실행 여부를 확인하고, esbuild/Vite build 성공을 별도 allowlist 절차로 재현한다. checkout credential 부재, build job의 write token 부재, 최종 `dist/release-manifest.json`과 `GITHUB_SHA` binding을 직접 확인한다.
- Owner: Architect / Coder / Release Owner
- Confidence: High
- Notes: actions는 모두 commit SHA로 pin되어 있고 package-lock에는 registry URL/integrity가 있어 완화 요소다. 그러나 그것들이 lifecycle script execution을 대신 차단하지는 않는다.

### [SUP-F002] `npm audit --omit=dev`가 실제 release를 생성하는 Vite/esbuild graph를 감사에서 제외함

- Pass: Security
- Pattern: SEC-006 — scanner scope and rule provenance
- Area: dependency audit coverage
- Severity: Minor
- Status: Needs Fix
- Contract Status: Confirmed
- Summary: workflow의 audit command가 production dependency만 대상으로 하므로, 현재 유일한 direct dependency인 devDependency Vite와 그 transitive esbuild/rollup graph를 검사하지 않는다. 이 graph는 runtime server가 아니라도 shipped JS/CSS를 생성하는 release-critical code다.
- Evidence:
  - `.github/workflows/deploy-pages.yml:41-42` — `npm audit --omit=dev --audit-level=high`.
  - `package.json:30-31` — `vite`가 devDependency이며, `package-lock.json:1091-1109`의 Vite가 `esbuild`, `rollup`, `postcss` 등에 의존한다.
  - `.github/workflows/deploy-pages.yml:33-40`에서 build/analyze/Pages QA가 audit보다 먼저 실행된다.
- Expected Basis: supply-chain scanner는 shipped/runtime graph뿐 아니라 release artifact를 생성·변환하는 committed build graph도 범위·rule provenance와 함께 감사해야 한다.
- Actual: runtime production dependency가 사실상 없어 audit가 통과해도, build tooling의 high advisory는 gate 밖에 남을 수 있다. 이번 감사는 외부 advisory 조회를 실행하지 않았으므로 특정 CVE를 주장하지 않는다.
- Impact: 취약하거나 변조된 build tool이 artifact를 조작할 가능성을 release gate가 탐지하지 못한다.
- Suggested Fix: 전체 lockfile graph에 대해 `npm audit --audit-level=high`를 실행하고, dev-only advisory를 제외해야 할 경우 build-critical package별 별도 triage/allowlist와 만료일을 기록한다. audit를 build 이전 별도 unprivileged step에서도 수행한다.
- Re-audit Method: clean lockfile install 후 전체 graph audit 결과가 기록되는지, build-critical dev dependency가 omit되지 않는지와 예외 owner/expiry를 확인한다.
- Owner: Release Owner
- Confidence: High
- Notes: 이 finding은 현재 dependency가 취약하다고 단정하지 않고 audit scope의 공백을 지적한다.

### [PAGES-F001] 자동 Pages 배포의 trusted ref·environment approval 경계가 repository code만으로는 입증되지 않음

- Pass: Security
- Pattern: SEC-002/SEC-006 — release fence and remote deployment trust boundary
- Area: GitHub Pages trigger, permissions, remote source/config
- Severity: Major
- Status: Needs Spec Clarification
- Contract Status: Needs Clarification
- Summary: workflow는 `main`의 모든 push와 `workflow_dispatch`를 동일한 privileged deploy job으로 실행한다. job에 `environment: github-pages` 이름은 있지만 reviewer/branch policy가 repository 파일에 선언되어 있지 않다. 실제 GitHub Environment protection rules, branch protection, Pages Source 설정, 현재 remote origin은 이 read-only 로컬 범위에서 확인할 수 없다.
- Evidence:
  - `.github/workflows/deploy-pages.yml:3-6` — `push.branches: [main]` 및 수동 dispatch.
  - `.github/workflows/deploy-pages.yml:8-21` — Pages/id-token write 권한과 `github-pages` environment name/URL만 선언되어 있고 required reviewer/allowed branch 조건은 없다.
  - `BUILD_GUIDE.md:234-236`은 clean dist artifact와 별도로 “Pages environment 승인이 필요한 별도 운영 단계”라고 설명한다. `spec.md:258-260`은 root URL와 verified dist closure를 요구한다.
  - workflow artifact path는 `.github/workflows/deploy-pages.yml:45-51`의 `./dist`로 고정되고 actions는 SHA-pinned다. 이는 긍정적 완화지만 remote Settings 보호를 증명하지 않는다.
- Expected Basis: `spec.md:258-260`, `BUILD_GUIDE.md:234-236`, standard §9 — public deployment는 trusted source/ref와 environment approval/artifact provenance가 명확해야 하며 hard boundary가 불명확하면 Hold다.
- Actual: local workflow만 보면 main push가 자동 public deploy를 유발한다. `dist/release-manifest.json`의 local release SHA 생성은 확인했지만, 실제 uploaded artifact가 보호된 ref에서 왔는지, environment reviewer가 강제되는지, Pages Source가 GitHub Actions인지 증거가 없다.
- Impact: branch/Pages 설정 drift, unauthorized dispatch, source Pages 오배포, stale source artifact가 public URL에 노출될 수 있다. 실제 오배포가 발생했다고 주장할 원격 증거는 없다.
- Suggested Fix: GitHub Environment에 required reviewers와 allowed deployment branches를 실제 Settings/API에서 설정하고 증거화한다. deploy job은 immutable build artifact만 받아 deploy하며, `github.ref`, commit SHA, release manifest SHA를 fail-closed로 대조한다. post-deploy root/query/hash smoke와 live hashed-entry check를 운영 gate로 둔다.
- Re-audit Method: GitHub Settings/Actions run의 environment approval, protected branch/ref, Pages Source, uploaded artifact release SHA를 직접 확인하고 fresh live smoke를 수행한다. 확인 전에는 `PASS` 계열 판정을 내리지 않는다.
- Owner: Release Owner / Human
- Confidence: Medium (workflow 사실은 확정, remote Settings 부재는 이 범위에서 판정 불가)
- Notes: 문서상 승인 의도가 있어 `Needs Spec Clarification`으로 분류했다. remote configuration이 실제로 보호되어 있다면 finding은 Verified로 낮출 수 있다.

### [PAGES-F002] Pages artifact verifier가 HTML의 추가 remote executable reference를 검증하지 않음

- Pass: Security
- Pattern: SEC-006/SEC-008 — artifact closure and external network provenance
- Area: generated HTML, remote script/style/network boundary
- Severity: Minor
- Status: Needs Spec Clarification
- Contract Status: Needs Clarification
- Summary: verifier는 source entry 금지와 manifest entry/base/file closure를 검사하지만, `dist/index.html`의 모든 `<script src>`, module/preload, stylesheet 또는 CSS의 remote executable reference를 allowlist하지 않는다. 현재 source의 script는 local `./src/main.js`이고, `index.css:7`에는 요구사항상 Google Fonts `@import`가 있다. 따라서 모든 external URL을 금지하는 요구는 창작하지 않고, executable remote reference 허용 여부를 명세 확인 대상으로 남긴다.
- Evidence:
  - `scripts/verifyPagesArtifact.js:61-89` — `/src/main.js` 문자열, manifest entry/base, manifest-referenced file existence만 검사하며 HTML URL graph를 parse하지 않는다.
  - `index.html:11-14,41-42` — source stylesheet와 module script는 local relative path이다.
  - `index.css:7` — `https://fonts.googleapis.com/...` external CSS import가 있다. `src` search에서 runtime `fetch`/XHR/WebSocket/navigation은 찾지 못했고, catalog provenance URL은 UI에서 href로 렌더되지 않는다.
- Expected Basis: `spec.md:258-264`의 static artifact/renderer trust와 external network boundary. Google Fonts 허용 여부는 현재 Typography 요구(`spec.md:97`)와 충돌할 수 있으므로 명세 확인이 필요하다.
- Actual: current source에는 remote executable script가 없지만, verifier만으로는 향후 추가된 remote `<script>`가 manifest closure 밖에서 실행되는 것을 차단하지 못한다.
- Impact: accidental/compromised HTML edit가 third-party script를 Pages에 로드해 사용자 DOM/data를 읽을 수 있다. 현재 source에서 그 경로가 존재한다는 뜻은 아니다.
- Suggested Fix: 명세에서 허용 external origin을 결정한 뒤, verifier가 executable `script/module`과 preload를 local manifest로 제한하고 CSS/font network는 명시 allowlist로 분리한다. CSP `script-src`/`connect-src` 및 live response header도 운영 증거로 고정한다.
- Re-audit Method: synthetic dist index에 remote script, unmanifested local script, remote CSS/font를 각각 넣어 verifier 결과를 확인하고, 실제 Pages response CSP/network log를 확인한다.
- Owner: Architect / Release Owner / Human
- Confidence: High (verifier omission), Medium (허용 external network 정책)
- Notes: 현재 Google Fonts는 제품 문서가 명시한 의도된 dependency이므로 이를 곧바로 취약점으로 판정하지 않았다.

### [QA-F001] QA artifact output 경로와 artifact verifier의 symlink 경계가 운영자 입력에 대해 느슨함

- Pass: Security
- Pattern: SEC-004 — path/filesystem boundary and child process safety
- Area: QA scripts, artifact writes, dist closure verifier
- Severity: Minor
- Status: Needs Fix
- Contract Status: Probable
- Summary: Chrome QA scripts는 `--artifacts=` 값을 절대/상대 경로 그대로 resolve해 `mkdirSync`/`writeFileSync`한다. `verifyPagesArtifact.safePath()`와 `listFiles()`는 lexical containment만 확인하고 symlink realpath/no-follow를 확인하지 않는다. 반면 child process는 shell-free argument array이고 모든 QA HTTP/DevTools bind는 loopback으로 제한되어 command injection/network exposure는 확인되지 않았다.
- Evidence:
  - `scripts/verifyPagesRecoveryChrome.js:23-28,387,545-546`, `scripts/verifyI18nInspectorChrome.js:26-30,630,650,659-660`, `scripts/verifyCatalogDiscoveryChrome.js:30-33,810,888-890`, `scripts/verifyCatalog120Chrome.js:51-54,1588-1590`, `scripts/verifyRenderScalabilityChrome.js:19-22,1203-1209,1241` — caller-supplied artifact directory를 별도 sandbox/allowlist 없이 만들고 report/screenshot을 쓴다.
  - `scripts/verifyPagesArtifact.js:18-30,46-47,91-101,125-130` — `safePath`는 `resolve/relative` lexical check만 하고 `listFiles`는 Dirent symlink를 regular file처럼 읽으며 `realpath`/no-follow를 적용하지 않는다. `distDirectory`/`writeManifest` option도 exported API에서 제한하지 않는다.
  - `scripts/verifyPagesRecoveryChrome.js:420-437`, `scripts/verifyRenderScalabilityChrome.js:1212-1219,1249` 및 동종 script — `spawn`에 executable/args 배열과 `{cwd, stdio}`를 사용하고 shell 옵션을 지정하지 않는다. `verifyPagesRecoveryChrome.js:69-73,110-141`은 loopback server만 연다.
- Expected Basis: standard SEC-004 — path, workspace, shell을 독립적으로 검증하고 QA 산출물은 명확한 범위에 쓴다.
- Actual: 정상 package scripts와 workflow는 기본 project-local archive/`dist`만 사용하므로 현재 production exploit은 확인되지 않았다. 그러나 악성/실수 CLI `--artifacts=/some/writable/path` 또는 dist 내부 symlink가 있으면 QA report overwrite/read-outside 경계가 생길 수 있다.
- Impact: 개발자/CI가 untrusted argument를 받아 실행하는 경우 임의 writable path의 `report.json`/screenshot overwrite, symlink를 통한 dist 외부 파일 hash/read가 가능하다. 이 finding은 product runtime이 아니라 QA tool boundary다.
- Suggested Fix: artifact path를 project `.antigravity/archive` 또는 explicit temp root 아래로 canonicalize하고 parent/target realpath를 검증한다. report filename을 fixed no-follow target으로 열고, verifier는 symlink/non-regular entry를 fail closed한다. `distDirectory`/write option도 CLI/API별 allowed root을 분리한다.
- Re-audit Method: temp fixture에서 `--artifacts` traversal/absolute/symlink와 dist symlink를 주입하고 write/read가 거부되는지 확인한다. child process 실행 파일·args에 shell/metacharacter가 들어가도 shell spawn이 일어나지 않는지 정적·표적 test로 확인한다.
- Owner: Coder / QA Owner
- Confidence: Medium (조건부 path misuse; 정상 workflow는 고정 경로)
- Notes: `execFileSync('git',['rev-parse','HEAD'])`와 loopback/temporary Chrome profile은 통과한 control이다.

## 9. Verified Controls and Negative Findings

다음은 요구 범위에서 직접 확인했으며 finding으로 올리지 않았다.

- URL parser: `src/catalog/discoveryUrl.js:57-86`은 문자열 query를 4,096자로 자르고 facet entry를 128자로 제한하며 known facet/value, locale, sort/view allowlist를 적용한다. `src/catalog/discovery.js:43-46`은 query를 120자로 정규화한다. invalid/prototype-like facet은 빈 selection으로 끝난다.
- Locale preference: `src/i18n/contract.js:12-37`은 URL(4,096자), storage, browser language를 allowlist 순서로 처리하고 `ko` fallback을 사용한다.
- Runtime user text: `src/components/mockupRuntime.js:19-20,84-98,809-889,1028-1059`는 500 UTF-16/50 history를 적용하고 comment/chat body는 `textContent`로 삽입한다. submit overflow는 잘라 저장하지 않고 거부한다.
- Clipboard: `src/utils/clipboard.js:12-47`은 Clipboard API 거부 후 fallback하고 `execCommand`의 `false`/throw를 false로 처리하며 textarea/focus를 finally에서 정리한다. `copyToClipboard`는 성공 때만 toast/SFX를 표시한다.
- Preview registry: `src/preview/registry.js:219-230`의 executable element/inline handler/`javascript:` 거부, `src/preview/renderers-expansion.js:7-18`의 dynamic escape는 positive control이다. registry production matrix/renderer tests는 모두 통과했다.
- External runtime network: `rg` 결과 `src`에는 runtime `fetch`, XHR, WebSocket, `window.open`, external navigation이 없다. catalog provenance의 `http/https` URL은 `src/catalog/validation/quality.js:29-38`에서 metadata로 정규화되며 UI href로 렌더되지 않는다. `index.css:7`의 Google Fonts만 intentional external CSS request로 남는다.
- QA child process: `scripts/verify*.js`는 shell command string 대신 `spawn`/`spawnSync`/`execFileSync` 배열을 사용한다. Chrome remote debugging, Vite/HTTP test server는 `127.0.0.1`에 bind한다. 이를 command injection 또는 non-loopback product service finding으로 만들지 않았다.
- Diagnostics: `src/utils/recoveryDiagnostics.js:1-32`는 최대 20개를 보관하고 반환 object key를 `code/phase/attempt/resourceClass/terminal`로 제한하며 URL/stack/user data를 저장하지 않는다. 현재 production call sites는 import/render/hydrate/mount phase를 사용한다.
- Secret/auth applicability: source/config에서 credential, token, password storage 또는 server/auth/CORS가 발견되지 않았다. 정적 앱에 서버 인증 패턴을 요구하지 않았다.
- Pages action pin/artifact path: workflow의 checkout/setup/configure/upload/deploy actions는 commit SHA로 pin되어 있고 upload path는 `./dist`로 고정되어 있다. 이것은 SUP-F001/PAGES-F001의 완화 증거다.

## 10. Cross-Pass Conflicts

### [XPF-F001] Static registry PASS와 Safe DOM policy의 enforcement 강도가 다름

- Related Findings: SEC-F001, SEC-F002
- Conflict: Pass 1/기존 registry tests는 120 renderer output fingerprint와 executable sink rejection을 통과한다. 그러나 Safe DOM 문서는 모든 dynamic output을 safe DOM API/escaping으로 제한하고 legacy archetype/main/audio template에는 raw interpolation이 남아 있다.
- Resolution: 현재 정적 catalog provenance와 registry positive control은 current exploitability를 낮추지만, policy-complete PASS의 근거가 되지 않는다. SEC-F001은 Minor Needs Fix로 유지한다.
- Gate Impact: Security Pass의 Safe DOM 계약을 Verified로 올리려면 sink별 escaping/DOM regression test가 필요하다.

### [XPF-F002] “verified dist + environment approval” 문서와 실제 workflow enforcement의 차이

- Related Findings: SUP-F001, SUP-F002, PAGES-F001, PAGES-F002
- Conflict: `BUILD_GUIDE.md`는 Pages environment approval과 verified `dist`를 운영 전제로 쓰지만, workflow YAML에는 environment name과 artifact upload만 보이고 reviewer/ref policy 또는 remote response evidence가 없다. 또한 npm install/audit order가 supply-chain hardening을 완성하지 않는다.
- Resolution: 문서의 운영 의도는 인정하되 remote Settings/실행 로그가 없는 현재 범위에서는 hard boundary를 Verified로 판정하지 않는다. PAGES-F001은 Needs Spec Clarification/HOLD로 유지한다.
- Gate Impact: local Node tests pass와 action pin만으로 public deployment PASS를 선언할 수 없다.

## 11. Uncertainties and Clarifications Needed

- `PAGES-F001`: GitHub Environment `github-pages`에 required reviewers/allowed branches가 실제로 설정됐는지, Pages Source가 GitHub Actions인지, remote가 clean hashed artifact를 제공하는지 확인이 필요하다.
- `PAGES-F002`: Google Fonts external CSS는 `spec.md:97`의 요구사항이므로 허용 origin 정책을 명시해야 한다. 단, remote executable script/module은 허용하지 않는지 verifier/CSP 계약을 정해야 한다.
- CSP 및 response headers: `index.html`에 CSP meta가 없고 Vite/Pages config에 response header enforcement가 없다. 실제 GitHub Pages header를 이 turn에서 확인하지 않았으므로 CSP 부재를 확정 finding으로 올리지 않고 운영 미확정으로 남긴다. 문서의 “운영 CSP/Google Fonts 응답 헤더 미확정” 메모와 일치한다.
- Dependency advisory: 이번 turn은 `npm audit` network 조회를 하지 않았으므로 특정 vulnerability/CVE의 존재·부재는 판정하지 않는다. 다만 audit scope/install script control은 코드 증거로 판정했다.
- Build/Chrome: 실제 bundle, release-manifest, browser DOM parse, Web Audio context quota, live Pages misdeployment는 사용자 지시상 실행하지 않았다.

## 12. Re-audit Checklist

재감사 시 다음 원 finding ID를 유지한다.

- SEC-F001 Re-audit #1: 8 archetype + Detail/Split/Bento/Spectrum/audio synthetic hostile values가 escape/textContent로만 정착하는지, registry와 legacy sink의 provenance가 하나의 규칙으로 통과하는지 확인
- SEC-F002 Re-audit #1: deep-frozen `getState`/nested mutation, query 120, known facets, audio/list bounds 및 subscriber/URL/localStorage 결과 확인
- SEC-F003 Re-audit #1: wrong-shape valid JSON key purge, malformed/oversized/storage exception fallback 확인
- RES-F001 Re-audit #1: partial AudioContext graph close/disconnect 및 resume retry recovery 확인
- RES-F002 Re-audit #1: scheduler/voice fault 뒤 rejection 0, playing=false, timer cleanup, visible error, retry success 확인
- SUP-F001 Re-audit #1: clean runner의 `npm ci --ignore-scripts`/명시된 native binary 절차, credential persistence, build/deploy job permissions 확인
- SUP-F002 Re-audit #1: 전체 lockfile audit 결과와 build-critical dev dependency triage/expiry 확인
- PAGES-F001 Re-audit #1: GitHub Settings/Actions environment approval, protected ref, Pages Source, uploaded release SHA 및 live smoke 확인
- PAGES-F002 Re-audit #1: synthetic remote script/manifest omission verifier test와 CSP/network allowlist 확인
- QA-F001 Re-audit #1: artifact path root/symlink/no-follow fixture와 shell-free child-process test 확인

## 13. Perspective Decision

### Decision: HOLD

- `SUP-F001`은 Pages deploy trust boundary에 직접 영향을 주는 Major confirmed finding이다. `SUP-F002`도 release-critical build graph audit coverage를 축소한다.
- `PAGES-F001`은 실제 remote Environment/Pages 설정을 이 범위에서 증명할 수 없는 Major hard-boundary clarification이다. standard §9와 report contract상 핵심 배포·권한 공백이 있으면 PASS 계열 판정을 내릴 수 없다.
- `SEC-F001`, `SEC-F002`, `SEC-F003`, `RES-F001`, `RES-F002`, `QA-F001`은 현재 악용 가능성이 낮거나 QA/runtime 국소 범위인 Minor Needs Fix이지만, 재감사 추적이 필요하다.
- URL/localStorage 정상 parse bounds, comment/chat textContent, clipboard false/error, registry executable rejection, no runtime external API, shell-free loopback QA는 확인되었다.
- 이 보고서는 보안·복원력 관점의 독립 결과이며, 다른 pass 또는 다른 에이전트의 결론을 가정하지 않는다. 소스·테스트·설정·제품 문서는 수정하지 않았다.

## 14. Handoff

`/home/eunho1/Projects/web/design_sample_selector_2/docs/multi_audit/12/sub_audit_03_security_resilience.md`를 먼저 읽고 각 finding의 파일·줄·명령 결과를 실제 코드와 대조한 뒤 우선순위대로 수정하세요. 계약 변경이 필요하면 관련 문서를 먼저 갱신하고, 수정 후 Node tests·fresh build·Chrome/Pages evidence와 Audit Turn 12 Re-audit #1을 기록하세요.
