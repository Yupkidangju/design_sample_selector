# Sub Audit Report

## 1. Audit Metadata

- Audit Turn: `multi-audit / 10 / sub_audit_03_security_resilience`
- Perspective: 보안·신뢰 경계·오류 복원력 (preview/detail lazy loading 독립 관점)
- User Goal: 디자인 시안의 Peek/확정 미리보기와 더블클릭 Detail/Split lazy loading 실패를 재시도·상태·DOM·배포 경계까지 점검하고 안정적인 복구 가능성을 검증한다.
- Audit Basis: Standard-backed / Goal-driven
- Standard Path: `/home/eunho1/Projects/web/design_sample_selector/AI_AUDIT_DOC_STANDARD.md`
- Report Contract: `/home/eunho1/.codex/skills/multi-audit/references/report-contract.md`
- Additional Evidence: 사용자가 GitHub Pages 정적 서빙에서 동일 증상을 관찰했다고 제공함.

## 2. Assigned Scope

- `src/main.js`, `src/components/lazyPreviewLoader.js`, `mainView.js`, `peekPreview.js`, `selectionDock.js`, `detailView.js`
- `src/components/archetypeTemplates.js`, `src/preview/component*`, registry/renderers/thumbnails, `src/catalog/**`, `src/data/categories.js`
- `src/state/appState.js`, discovery URL/state, `src/utils/selection.js`, 관련 Node 테스트와 Chrome QA 스크립트
- `index.html`, `vite.config.js`, `package.json`, `package-lock.json`, README/BUILD_GUIDE/spec/designs 및 lazy/retry 결정 문서
- 사용자 입력·DOM injection, dynamic import 경로, stale request/focus/close, retry 중복·상태 오염, persisted state DoS, GitHub Pages artifact/base/cache 신뢰 경계

## 3. Excluded and Uninspected Scope

- `node_modules/`, `dist/`, `.git/`, 생성·벤더 트리, 이전 `docs/multi_audit` 보고서는 읽지 않았다.
- 실제 GitHub Pages 응답, CDN 헤더, Pages 프로젝트 설정과 운영 CSP는 저장소에 근거가 없어 확인하지 못했다. 사용자의 Pages 관찰만 증거로 기록하고, 배포 토폴로지는 명확화 대상으로 남겼다.
- `npm run build`, `npm run check`, `qa:*:chrome` 및 profile/artifact를 쓰는 Chrome 명령은 지시대로 실행하지 않았다. 따라서 Vite가 `?retry=1` 소스를 최종 asset URL로 어떻게 변환하는지와 실제 Pages network status는 미검증이다.
- 인증·백엔드·서버 API는 이 순수 정적 앱의 범위 밖이며 관련 증거를 찾지 못했다.

## 4. Evidence Examined

### 문서·설정

- `spec.md:216-223,234-254,281-288`: 정적 immutable preview registry, literal lazy import, primary/retry facade, stale token, generic recovery 및 `innerHTML` 금지 계약.
- `designs.md:152-175,225-242`, `DESIGN_DECISIONS.md:277-344`, `CHANGELOG.md:12-16,38,61`: registry 신뢰 경계와 retry/focus 의도.
- `vite.config.js:3-13`: `base: './'`, `outDir: 'dist'`, `assetsDir: 'assets'`.
- `index.html:11-14,41-42`: source-root CSS/ES-module 상대 경로.
- `package.json:9-29`, `package-lock.json:1-15`: Vite만 devDependency로 선언된 lockfile root와 실행 명령.
- `.github`/Pages/gh-pages/workflow/cache-control/service-worker 문자열을 프로젝트 범위에서 검색했으나 Pages 배포 workflow 또는 cache 정책은 발견하지 못했다.

### 소스·호출 경로

- `src/components/lazyPreviewLoader.js:1-47`: pending Promise 공유, importer index 전환, 두 개의 top-level retry URL.
- `src/preview/componentLazyEntry.js:1-15`, `componentLazyRetryEntry.js:1-15`, `componentEntry.js:9-30`: primary/retry facade가 동일 `componentEntry.js`를 정적 import하고, componentEntry가 동일한 세 CSS dynamic import를 top-level `Promise.all`로 기다림.
- `src/components/detailView.js:13-19`, `src/components/archetypeTemplates.js:7-8`: Detail lazy graph가 같은 componentEntry를 transitive dependency로 사용함.
- `src/main.js:17-63,101-230,246-251`: fatal error의 text node 조립, Detail loading/error/cancel/retry, request token 및 close 처리.
- `src/components/peekPreview.js:21-63,66-117`, `selectionDock.js:29-142`: paint/render token, current state 확인, generic failure UI와 retry listener.
- `src/components/mainView.js:131-320`, `detailView.js:267-573,680-725,1255-1359`, `archetypeTemplates.js:35-668`, `src/preview/thumbnails.js:3-23`, `thumbnails-wave-1.js:3-18`: catalog 값과 renderer 결과를 `innerHTML`/inline style에 넣는 경로.
- `src/preview/registry.js:208-216,297-339`, `src/preview/contract.js:33-48`: 출력은 non-empty HTML 문자열만 검사하고 asset path만 상대 경로 규칙으로 제한.
- `src/catalog/validation/rules.js:152-176,262-290,316-345`, `src/catalog/validation/color.js:1-21`, `src/catalog/index.js:30-47`, `validation/currentCatalog.js:11-18`: 문자열·color 검증, static/deep-frozen catalog source와 reference snapshot.
- `src/state/appState.js:8-55,156-258,284-357`: LocalStorage JSON parsing, canonicalization, state patch validation, bookmark cap 부재, direct mutable `getState()` 반환.

### 테스트·읽기 전용 명령

- `node --test`: **180/180 통과**, 실패·취소·skip 0.
- `tests/renderScalability.test.js:408-451`: 1회 실패 후 2번째 importer 성공과 concurrent Promise 공유만 검사하고, 두 importer 모두 실패한 뒤의 terminal/cooldown은 검사하지 않음.
- `tests/renderScalability.test.js:453-487`: literal loader와 stale-safe markup의 source assertion만 검사함.
- `scripts/verifyRenderScalabilityChrome.js:476-563`(실행하지 않음): `*componentLazyEntry*` top-level facade 하나만 Fetch 실패시키고 retry 성공을 확인한다. `componentEntry.js` 또는 CSS dependency 실패와 Detail 실패는 주입하지 않는다.
- `npm audit --omit=dev --offline`: `found 0 vulnerabilities` (offline advisory freshness는 확인하지 못함).
- 읽기 전용 로더 재현: 두 importer를 모두 reject하도록 호출하면 `{"calls":["primary","retry-1","retry-1","retry-1"]}`가 출력되어 마지막 retry가 무제한 반복됨. pending 중 두 호출은 같은 Promise이고 importer 호출은 1회라는 별도 확인도 수행함.
- 현재 static catalog의 대표 문자열을 스캔한 결과 `<`, `>`, quote를 가진 값은 0개였으나 이는 현재 데이터의 상태일 뿐 validator의 경계 보장은 아니다.

## 5. Findings

### [SEC-F001] Retry facade가 공통 dependency 실패까지 분리하지 못함

- Pass: Security (error resilience / trust boundary)
- Pattern: lazy module-map retry boundary
- Area: `componentEntry.js`·CSS dependency와 Detail transitive import, GitHub Pages 정적 asset 복구
- Severity: Major
- Status: Probable (Needs Fix)
- Summary: 재시도 URL은 facade 최상위 파일만 바꾼다. 공통 dependency 또는 CSS가 404/evaluation failure로 module map에 실패 상태로 남으면 primary와 retry가 같은 실패 URL을 다시 의존한다.
- Evidence:
  - `lazyPreviewLoader.js:31-39`는 `detailView.js` → `detailView.js?retry=1`, `componentLazyEntry.js` → `componentLazyRetryEntry.js`만 바꾼다.
  - 두 lazy facade 모두 `componentEntry.js`를 같은 경로로 정적 import한다(`componentLazyEntry.js:2-5`, `componentLazyRetryEntry.js:2-5`).
  - `componentEntry.js:9-15`는 동일한 세 CSS 경로를 top-level `Promise.all`로 요청한다. 하나라도 실패하면 componentEntry 평가 전체가 reject된다.
  - Detail graph도 `detailView.js:18` → `archetypeTemplates.js:7` → 동일 `componentEntry.js`를 사용한다.
  - Chrome QA는 `scripts/verifyRenderScalabilityChrome.js:482-485`에서 `componentLazyEntry` 요청만 막고, `540-545`에서 interception을 해제한 뒤 retry 성공을 확인한다. 공통 module/CSS 실패는 검증하지 않는다.
- Expected Basis: `spec.md:239-240`, `designs.md:238-239`는 실패 URL을 피하는 retry와 실제 Detail/Peek/Confirm 복구를 요구한다. 사용자 목표는 Pages에서 실패해도 retry가 안전하게 회복되는지 확인하는 것이다.
- Actual: top-level facade 네트워크/청크만 실패하면 별도 URL이 유효할 수 있지만, `componentEntry.js`, `archetypeTemplates.js`의 공통 dependency 또는 CSS가 실패하면 retry facade가 그 동일 실패 모듈 URL을 다시 import한다. Pages에서 누락된 artifact·stale HTML/asset·CSS 404가 원인인 경우 query를 바꿔도 누락 파일을 만들지 못한다.
- Impact: 사용자에게 동일한 “불러오지 못했습니다”가 유지되어 Peek/확정 미리보기와 더블클릭 Detail이 모두 복구되지 않을 수 있다. 내부 예외는 노출하지 않지만, 실패의 공통 원인을 재시도 경계가 해소하지 못한다. 실제 production chunk URL coalescing 여부는 build 금지로 미확정이므로 `Probable`로 분류한다.
- Suggested Action: retry entrypoint가 실패 가능한 전체 lazy graph를 별도 정적 revision으로 가리키도록 설계한다(공통 JS/CSS dependency까지 versioned/retry facade를 적용하거나, 실패 가능한 graph를 분리된 self-contained entry로 생성). Pages에는 동일 revision의 HTML·JS·CSS가 원자적으로 게시되도록 한다. facade만 바뀌었다는 가정을 검증하는 dependency-level failure fixture를 추가한다.
- Re-audit Method: 허용된 환경에서 clean production build의 primary/retry 최종 URL을 기록하고, facade·`componentEntry`·각 CSS를 한 번씩 독립적으로 404/네트워크 실패시킨다. Peek, Confirm, Detail, Split 각각에서 error → retry → success/terminal 상태와 실제 request URL/status를 cold-cache·warm-cache Pages에서 확인한다.
- Confidence: High (source graph), Medium (Pages causal attribution/build output)
- Notes: 이 finding은 top-level facade 실패 자체의 recovery를 부정하지 않는다. 현재 Node/Chrome QA는 그 좁은 경우만 보장한다.

### [SEC-F002] 두 번째 실패 이후 retry가 무제한이고 terminal/cooldown 상태가 없음

- Pass: Security (error resilience / denial-of-service)
- Pattern: bounded retry and user-triggered DoS
- Area: `createRetryableModuleLoader`, Peek/Confirm/Detail retry controls
- Severity: Major
- Status: Confirmed (Needs Fix)
- Summary: pending 중에는 동일 Promise를 공유하지만, 두 importer가 모두 실패한 뒤에는 importer index가 마지막 값에 고정되고 모든 retry 클릭이 같은 실패 importer를 새 Promise로 다시 실행한다.
- Evidence:
  - `lazyPreviewLoader.js:8-21`: `pending`은 reject 시 null로 지워지고, `importerIndex`는 `Math.min(..., importers.length - 1)`로 마지막 index에 고정된다. 최대 시도 수, backoff, cooldown, terminal flag가 없다.
  - `peekPreview.js:47-62`, `selectionDock.js:129-142`, `main.js:216-218`: error UI의 버튼을 비활성화하거나 in-flight 상태를 기록하지 않고 같은 loader를 다시 호출한다.
  - 읽기 전용 simulation에서 두 importer를 reject한 뒤 네 번 `load()`하면 `primary, retry-1, retry-1, retry-1` 네 호출이 관찰됐다.
  - `tests/renderScalability.test.js:408-451`은 1회 실패 후 성공만 고정하며, 두 번째 실패·연속 click·terminal 상태는 다루지 않는다.
- Expected Basis: 사용자 성공 기준은 retry 연타가 무한 중복/상태 오염을 만들지 않는 것이다. `spec.md:239-240`/`designs.md:238-239`의 primary/retry 2단계 의도는 무제한 retry loop가 아니다. 일반적인 resilience/DoS 경계도 시도 수와 사용자 입력 속도를 제한해야 한다.
- Actual: 두 번째 URL이 지속적으로 실패하면 사용자가 버튼을 누르는 만큼 새 rejected Promise, catch continuation, DOM 교체가 생성된다. pending 동안의 중복 네트워크는 막지만, reject 이후에는 동일 실패를 무한히 요청할 수 있는 UI/loader 상태다. component loader는 Peek와 Confirm이 공유하므로 한 surface의 실패가 전역 importer index를 다음 단계로 이동시킨다.
- Impact: 반복 click이 event-loop/Promise/DOM churn을 일으키고, 실패가 module-map에 즉시 캐시되지 않는 서버·프록시 경로에서는 실제 동일 asset 요청을 무한히 만들 수 있다. 현재 stale token은 이전 surface 쓰기를 막지만 retry budget 자체와 사용자에게 최종 복구 경로가 없다. 이는 원격 공격이 아닌 사용자/자동화가 유발하는 client-side DoS라 Critical은 아니다.
- Suggested Action: loader에 명시적 총 시도 수(예: primary + retry 1회), `pending/succeeded/terminal` 상태와 terminal error를 추가한다. in-flight 동안 retry button을 disabled/`aria-busy`로 만들고, 실패 후 짧은 cooldown/backoff를 적용하며, terminal UI에는 “메인으로 돌아가기/페이지 새로고침”만 제공한다. shared loader를 유지할 경우 surface 간 attempt state를 의도적으로 문서화하고, 독립 복구가 필요하면 surface별 loader를 사용한다.
- Re-audit Method: loader unit test에 primary 실패/retry 실패/세 번째 click, 동시 Peek+Confirm, retry 중 close/open을 추가하고 importer 호출 횟수·Promise identity·DOM 상태를 assertion한다. Chrome에서 retry 연타와 네트워크 실패를 주입해 request count가 상한을 넘지 않고 terminal/cancel/focus restore가 유지되는지 확인한다.
- Confidence: High
- Notes: stale guard(`peekPreview.js:21-26`, `selectionDock.js:103-109`, `main.js:207-218`)와 pending 공유는 별도로 유효한 완화책이며 이 finding을 제거하지는 않는다.

### [SEC-F003] Catalog/renderer HTML 신뢰 경계가 validator·registry에서 강제되지 않음

- Pass: Security (DOM injection / trust boundary)
- Pattern: SEC-008
- Area: catalog text/color → `innerHTML`/inline CSS, preview renderer output
- Severity: Minor
- Status: Confirmed (Needs Fix)
- Summary: 문서는 XSS-safe DOM assembly와 remote/user HTML 금지를 선언하지만, 현재 여러 렌더 경로는 catalog 문자열을 escape하지 않고 HTML attribute/text/style에 직접 삽입한다. 현재 catalog는 정적·deep-frozen이라 즉시 user-input XSS로 확인되지는 않지만, 그 신뢰 가정은 출력 경계에서 기계적으로 검증되지 않는다.
- Evidence:
  - `mainView.js:136-180,204-242,267-309`는 category accent, title/description/name, palette color/name, mood tag를 직접 template literal에 넣는다. search empty 상태만 `escapeHtml`을 사용한다.
  - `detailView.js:272-305,422-439,555-567,697-725`와 `archetypeTemplates.js:206-207,297-308,380-417`는 name/description/palette/characteristics/pros/cons를 직접 삽입한다.
  - `thumbnails.js:3-21`, `thumbnails-wave-1.js:3-18`은 `design.palette` 값을 inline custom property에 직접 넣는다.
  - `registry.js:208-216,297-339`의 출력 검사는 non-empty 문자열과 `.mockup-unit` marker뿐이며 script/event-handler/unsafe URL/style를 sanitise하지 않는다. `tests/previewRegistry.test.js:50-66`의 custom renderer fixture도 `design.className`/`label`을 raw interpolation한다.
  - `rules.js:152-176`는 category accentColor를 필수 문자열로만 검사하고, `color.js:1-21`의 gradient 정규식은 `linear-gradient(red,blue);background:url(https://x)` 같은 추가 CSS 문법을 true로 판정했다. 현재 static data의 dangerous character scan은 0개였다.
  - source of truth 자체는 `catalog/index.js:30-47`와 `validation/currentCatalog.js:11-18`에서 static/deep-frozen이고, `spec.md:216-223`/`designs.md:171-175`는 runtime registration·remote/user HTML을 금지한다.
- Expected Basis: `spec.md:73-75,281-284`와 SEC-008은 unsanitized `innerHTML` 삽입을 금지한다. catalog/renderer가 정말 compile-time trusted source라면 그 예외와 검증 범위를 문서·코드에서 명시해야 한다.
- Actual: 정상 UI는 canonical static record만 선택하므로 현재 사용자 입력이 catalog field를 오염시키지 않는다. 그러나 악성/실수로 변경된 pack·향후 외부 catalog·definition authoring 값이 들어오면 text/attribute injection, CSS declaration/remote resource injection, markup breakage가 가능하다. `deepFreeze`는 mutation 방지이지 HTML/CSS 안전성 검사는 아니다.
- Impact: 현재 배포에서 직접 재현된 XSS finding은 아니며, 공급망/저작 경계가 훼손되거나 데이터 source가 확장될 때 preview surface가 공격 표면으로 변한다. 잘못된 color는 preview load/render failure를 일으켜 사용자 증상과 결합할 수도 있다.
- Suggested Action: catalog field를 trusted static data로 계속 유지할지 명세에 명시하고, 그 경우 text/attribute/control-character와 엄격한 CSS color grammar를 catalog validation에서 거부한다. 외부/편집 가능 source를 허용할 계획이면 모든 text/attribute를 node + `textContent`로 만들고 color/style를 typed allowlist로 적용하며, renderer output은 허용 tag/attribute sanitizer 또는 trusted-renderer type으로 경계를 강제한다. malicious catalog/renderer fixture를 추가한다.
- Re-audit Method: 모든 preview consumer의 `innerHTML` source-to-sink를 재검색하고 `<script>`, event attribute, quote/semicolon/URL이 포함된 fixture를 validation→render→DOM 단계에서 확인한다. current catalog와 generated build output에 unsafe sink가 없고, trusted static exception이 문서와 테스트에 일치하는지 검토한다.
- Confidence: High (source contract mismatch), Low for current exploitability
- Notes: 현재 static source와 deep freeze는 중요한 완화책이다. 이 finding은 “현재 user payload가 실행된다”가 아니라 문서가 약속한 trust boundary가 catalog/registry에서 enforced되지 않는다는 판단이다.

### [SEC-F004] LocalStorage/state 입력 크기 예산이 명시되지 않음 (명세 확인 필요)

- Pass: Security (persistence / client-side DoS)
- Pattern: input-size and state-boundary hardening
- Area: bookmarks, discovery state, mutable `getState()`
- Severity: Info
- Status: Needs Clarification
- Summary: UI 경로는 canonical ID와 검색 `maxlength=120`으로 제한되지만, persisted bookmark raw JSON과 public `setState`의 search/facet collection에는 일반적인 byte/count budget이 없다.
- Evidence:
  - `appState.js:8-15`는 localStorage raw 값을 바로 `JSON.parse`하고, `35-55`의 bookmark migration은 `maxLen=Infinity`로 전체 배열을 순회한다. state patch도 `221-234`에서 bookmarks는 Infinity, `215-226`에서 search/facets는 길이 제한 없이 타입만 검사한다.
  - `appState.js:284-285`의 `getState()`는 mutable state object를 그대로 반환하므로 nested array/object를 `setState` 밖에서 변경할 수 있다.
  - 반대로 `discovery.js:43-46`, `header.js:44-50`, `discoveryUrl.js:30-48`은 정상 검색 경로를 120자로 제한하고, recents는 `appState.js:65-71,353-357`에서 6개로 제한한다.
- Expected Basis: 사용자 goal의 denial-of-service/state pollution 경계와 일반 input-boundary 원칙. `spec.md:252-254`는 state validation과 comment/chat 500/50 cap을 명시하지만 bookmark 저장 크기나 raw LocalStorage byte budget은 정하지 않는다.
- Actual: 정상 클릭으로는 현재 catalog canonical ID가 최대 120개라 bookmarks state가 크게 늘지 않는다. 다만 같은 origin의 손상/수동 LocalStorage가 매우 큰 JSON array이면 parse·canonicalization 비용을 bootstrap에서 부담하고, 내부/향후 caller가 unbounded search/facets를 `setState`에 전달할 수 있다. 이는 remote attacker 경로가 아닌 local corruption/future API misuse다.
- Impact: 명세에 없는 cap을 임의로 적용하면 사용자 북마크 계약을 바꿀 수 있으므로 현재는 gate-blocking finding으로 확정하지 않는다. 방어가 없으면 큰 저장값이 startup/render/persistence를 지연시킬 수 있다.
- Suggested Action: 최대 bookmark 수(현재 canonical catalog 수와의 관계), active facet/value 수, search UTF-16 길이 및 raw storage bytes를 명세로 결정한다. `setState`와 LocalStorage load 양쪽에서 같은 cap을 적용하고, raw 문자열 길이 초과는 parse 전에 폐기한다. 반환 state는 defensive snapshot/freeze로 노출한다.
- Re-audit Method: 명세 승인 후 oversized/malformed LocalStorage와 direct state mutation fixture를 추가해 startup latency, fallback, persistence, preview stale behavior를 확인한다.
- Confidence: High for absence of explicit cap; Medium for practical exploitability
- Notes: 현재 catalog canonicalization과 UI maxlength가 위험을 상당히 낮춘다.

### [SEC-F005] GitHub Pages artifact/base/cache 배포 계약이 저장소에 없음

- Pass: Security (deployment trust boundary / error resilience)
- Pattern: BUILD-001 / static-hosting artifact integrity
- Area: GitHub Pages published root vs Vite `dist`, relative base, lazy chunk/CSS availability
- Severity: Major
- Status: Needs Clarification
- Summary: 사용자는 GitHub Pages에서 증상을 관찰했지만 저장소에는 Pages workflow, published artifact 선택, cache policy, deployed URL smoke gate가 없다. `base: './'`는 의도만 표현하며 실제 Pages가 lazy module/CSS와 같은 revision을 제공한다는 증거가 아니다.
- Evidence:
  - `vite.config.js:3-13`은 상대 base와 `dist` output을 선언한다.
  - 저장소 `index.html:12-14,42`는 source-root의 `./index.css`, `./src/styles/*`, `./src/main.js`를 참조한다. Pages가 repository root를 publish하면 이 경로가 필요하고, `dist`를 publish하면 Vite가 생성한 index/hashed asset set이 필요하다.
  - `package.json:14-23`에는 build와 local preview는 있지만 Pages deploy script/workflow가 없다. `.github` 및 `gh-pages`/cache 정책 검색 결과도 없다. README/BUILD_GUIDE는 local Vite/Python/preview 절차만 설명한다(`README.md:7-32`, `BUILD_GUIDE.md:119-139`).
  - `lazyPreviewLoader.js:31-39`의 query retry는 존재하지 않는/오래된 artifact를 복구할 수 없다. 실제 build output URL 변환은 build 금지로 확인하지 못했다.
- Expected Basis: 사용자 제공 Pages failure와 `spec.md:239-240`, `designs.md:238-241`의 실제 lazy recovery 계약. 정적 배포는 HTML entry, lazy JS, CSS가 동일한 published revision과 base path로 resolve되어야 한다.
- Actual: root publish와 dist publish 중 어느 topology인지, Pages subpath에서 HTML·facade·shared dependency·CSS가 어떤 URL/status로 응답하는지 판단할 저장소 증거가 없다. stale HTML/asset, chunk omission, wrong base, common CSS 404 중 무엇이 원인인지 분리할 수 없다.
- Impact: 사용자가 관찰한 미리보기/Detail failure가 환경에 재현되어도 코드 retry finding과 배포 artifact 문제를 구별하지 못한다. 잘못된 artifact라면 retry click은 같은 404를 반복하며, cache 정책이 불명확하면 수정 후에도 오래된 HTML이 실패한 chunk를 요청할 수 있다. 배포 신뢰 경계가 확인되기 전에는 Pages 기준 PASS를 선언할 수 없다.
- Suggested Action: Pages용 deterministic workflow를 추가하거나 운영 설정을 문서화하여 build→`dist` publish와 revision 일치를 고정한다. repository-root source publish와 `dist` publish를 혼용하지 말고, project subpath에 맞는 `base`를 검증한다. HTML은 새 asset manifest와 원자적으로 게시하고, HTML 재검증/no-cache와 hashed JS/CSS immutable 정책을 운영에서 확인한다. deploy smoke test가 index, primary/retry facade, shared component chunk, CSS의 200/MIME/status를 cold/warm cache에서 확인하도록 한다.
- Re-audit Method: Pages URL과 실제 published artifact manifest를 받아 Network request URL/status/MIME을 기록한다. clean build에서 source import와 final asset mapping을 확인하고, facade·shared dependency·CSS 각각의 의도적 실패 후 retry/terminal UI를 cold/warm cache와 project subpath에서 재실행한다.
- Confidence: High for missing repository contract; Medium for causal link to observed Pages failure
- Notes: `base: './'` 자체를 오작동으로 단정하지 않는다. 문제는 해당 설정만으로 Pages artifact/cache correctness가 증명되지 않는다는 점이다.

### 검증된 보안·복원력 제어 (adverse finding 없음)

#### [SEC-V001] 사용자-facing 오류가 내부 예외를 노출하지 않음

- Area: fatal bootstrap, lazy Preview/Confirm/Detail error surfaces
- Severity: Info
- Status: Verified
- Summary: failure UI는 고정된 설명·재시도·취소만 보여주고 import/renderer 예외 객체를 DOM에 넣지 않는다.
- Evidence: `main.js:17-63,246-251`은 `createElement`/`textContent`와 generic catch를 사용한다. `peekPreview.js:47-57`, `selectionDock.js:129-139`, `main.js:176-193,216-218`도 고정된 오류 문자열을 사용한다. registry diagnostic fields는 내부 throw에만 남는다.
- Expected Basis: `spec.md:253,281-284`와 사용자 goal의 secret/internal error non-disclosure.
- Actual: 관찰된 lazy failure 경계에는 stack/error message/secret이 사용자 DOM에 노출되는 경로가 없다. DevTools의 별도 subscriber/audio 로그는 이 lazy user-facing surface와 분리된다.
- Suggested Action: 유지. 운영 진단이 필요하면 redacted error code/attempt만 telemetry 또는 개발 로그로 제한한다.
- Re-audit Method: import rejection이 Error message/stack/URL token을 포함해도 DOM snapshot과 alert text에 포함되지 않는지 확인한다.
- Confidence: High

#### [SEC-V002] stale async 응답과 닫힌 화면 쓰기 차단

- Area: request token, current state, close/cancel/focus restoration
- Severity: Info
- Status: Verified
- Summary: Peek, Confirm, Detail 모두 async 완료 전 request/paint version과 current state를 재확인하고, 닫을 때 version/token을 무효화한다.
- Evidence: `peekPreview.js:21-26,37-50,69-83`, `selectionDock.js:103-142`, `main.js:198-230`; Detail close/cancel은 `detailRequestId`를 증가시키고 container를 비운다. style/selection 입력은 `findSubById`/canonical IDs로 제한된다.
- Expected Basis: `spec.md:239,247-253`, `designs.md:238-239`의 stale/current-state/focus 계약.
- Actual: 늦게 resolve된 primary/retry Promise는 닫힌/다른 style surface의 DOM에 쓰지 않는다. stale path는 no-op이며 현재 surface만 generic error 또는 success를 그린다.
- Suggested Action: 유지하되 SEC-F002의 retry budget/disabled state를 이 token guard와 함께 회귀 테스트한다.
- Re-audit Method: controlled Promise로 close, style switch, MAIN↔DETAIL/SPLIT, Peek→Confirm 전환을 교차시켜 detached/current DOM 변경이 0인지 검사한다.
- Confidence: High (static), runtime browser behavior unexecuted

#### [SEC-V003] dynamic import 경로와 canonical selection 경계는 정적·제한됨

- Area: import path, asset path, catalog source, selection input
- Severity: Info
- Status: Verified
- Summary: user/state 값이 dynamic import URL이나 arbitrary renderer path를 결정하지 않는다.
- Evidence: `lazyPreviewLoader.js:32-39`의 import specifier는 literal 두 쌍이다. `preview/contract.js:41-48`은 asset path의 scheme/absolute/`.`/`..`/backslash를 거부하고, selection helpers와 appState는 canonical catalog ID만 통과시킨다. catalog는 `index.js:30-47`에서 static/deep-frozen이며 current snapshot은 `validation/currentCatalog.js:11-18`에서 registry inventory와 함께 고정된다.
- Expected Basis: `spec.md:200-205,216-223`, `designs.md:171-175`의 single canonical source, no runtime registration/remote HTML, literal dynamic import 계약.
- Actual: query string `?retry=1`은 코드에 고정되어 있고 사용자 입력이 import path에 연결되지 않는다. path traversal/remote module URL 경로는 발견하지 못했다.
- Suggested Action: 유지. SEC-F001의 dependency-level retry를 추가하더라도 revision 목록은 정적 allowlist로 유지한다.
- Re-audit Method: 새 retry/importer 추가 시 source scan과 build manifest에서 user-controlled concatenation 및 absolute/remote URL이 없는지 확인한다.
- Confidence: High

#### [SEC-V004] 현재 lockfile의 runtime 공급망 위험은 낮음

- Area: package-lock / shipped runtime dependencies
- Severity: Info
- Status: Verified
- Summary: package root에 runtime dependency가 없고 Vite는 devDependency이며 offline audit가 clean이다.
- Evidence: `package.json:27-29`, `package-lock.json:1-15` 및 `npm audit --omit=dev --offline` 결과 `found 0 vulnerabilities`.
- Expected Basis: assigned scope의 package-lock supply-chain 점검.
- Actual: production runtime npm dependency 취약점 finding은 확인하지 못했다. offline audit라 최신 online advisory/provenance까지 증명하지는 않는다.
- Suggested Action: 유지; release pipeline에서 online `npm audit`/lockfile integrity 검사를 별도로 수행한다.
- Re-audit Method: release lockfile을 online advisory DB와 대조하고 actual shipped bundle dependency provenance를 확인한다.
- Confidence: Medium (offline scope only)

## 6. Uncertainties and Clarifications Needed

1. GitHub Pages가 repository root와 `dist` 중 무엇을 publish하는지, custom domain/project subpath와 실제 deployed URL은 무엇인지 확인이 필요하다.
2. 문제 시점의 HTML revision, lazy JS/CSS asset revision, Network status/MIME/cache headers를 확인해야 SEC-F001과 SEC-F005의 인과관계를 확정할 수 있다.
3. Vite production build가 `detailView.js?retry=1`와 retry component facade를 distinct final URL/chunk로 보존하는지 build 후 확인해야 한다.
4. `componentEntry.js` 자체 및 세 CSS 중 하나를 실패시켰을 때 retry가 성공해야 하는지, 아니면 bounded terminal error가 정답인지 spec에 명시할 필요가 있다.
5. bookmark/search/facet state의 최대 count/byte 예산과 `getState()` 방어적 반환 여부는 현재 spec에 없다(SEC-F004).
6. 현재 코드의 catalog/renderer template literal은 static trusted source 예외인지, `spec.md:281-284`의 전면 `innerHTML` 금지를 따라 모두 node assembly/sanitization해야 하는지 문서 결정을 추가해야 한다(SEC-F003).

## 7. Perspective Decision

**REWORK REQUIRED; GitHub Pages 기준은 배포 증거 확인 전 HOLD.**

- 보안상 Critical/secret/path traversal/remote import 취약점은 발견하지 않았다.
- 그러나 SEC-F002는 소스와 read-only simulation으로 확인된 무제한 retry 경계이며, 사용자 핵심 증상과 직접 연결되는 Major finding이다. SEC-F001은 공통 dependency 실패를 복구하지 못할 가능성이 높고, SEC-F005는 실제 Pages artifact/base/cache topology를 증명할 계약이 없어 Pages 기준 판단을 막는다.
- SEC-F003은 현재 정적 catalog 신뢰 가정으로 즉시 exploit은 아니지만 문서의 DOM injection 경계가 validator/registry에서 강제되지 않는 Minor finding이다. SEC-F004는 명세 승인 전까지 clarification으로 유지한다.
- 다음 재감사 전 최소 조건은 (a) 총 retry 상한·in-flight disable·terminal/cancel 경계, (b) 공통 JS/CSS dependency failure test, (c) clean build와 실제 Pages asset request/status/cache 증거, (d) catalog HTML/CSS trust policy 명문화이다.

