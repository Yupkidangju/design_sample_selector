# Task List: `preview-registry`

**Initiative:** `scalable-style-library`

**Source plan:** `tasks/plan.md` (`COMPLETE`)

**Source specification:** `SPEC-preview-registry.md` (`COMPLETE`)

**Task list status:** 완료 (`COMPLETE`)

**사양 승인일:** 2026-08-30

**계획 승인일:** 2026-08-30

**Task 목록 승인일:** 2026-08-30

**완료일:** 2026-08-30

**Previous completed task list:** `tasks/archive/theme-generation-todo.md`

> 이 목록은 2026-08-30 승인되었고 Tasks 1–12와 모든 Checkpoint를 의존 순서대로 완료했다. `tasks/plan.md`와 이 파일의 상태 기록은 각 Task 파일 수 산정에서 제외한다.

---

## Task 1: 기준선과 generic registry 계약 고정

**Description:** DOM과 production definition 없이 동작하는 preview contract와 registry 조립기를 먼저 만든다. 작은 fixture definitions로 ID, 별칭, 탭, 채널, asset, 동결과 실패 의미를 테스트하여 이후 24개 구현 이동이 안정된 경계 위에서 일어나게 한다.

**Acceptance criteria:**

- [x] `PREVIEW_COMPONENT_TABS`, reference kind, motion channel과 `PreviewRegistryError`의 안정 code/property가 사양과 일치하고 재귀 동결된다.
- [x] registry 구성은 잘못된 definition, 중복 ID, alias collision, 잘못된 탭·채널·asset을 각각 구조화된 오류로 거부하며 입력 fixture를 변형하지 않는다.
- [x] fixture query는 unknown/non-string에 `false`/`null`, fixture render는 unknown·미지원 탭·빈 output에 승인된 throw를 반환하고 내부 map·함수를 노출하지 않는다.

**Verification:**

- [x] 각 오류·동결·조회 테스트가 구현 전 실패하고 최소 contract/registry 구현 후 통과함을 확인한다.
- [x] `npm test -- tests/previewRegistry.test.js`
- [x] `npm test && git diff --check`

**Dependencies:** None

**Files likely touched:**

- `src/preview/contract.js`
- `src/preview/registry.js`
- `tests/previewRegistry.test.js`

**Estimated scope:** Medium (3 files)

---

## Task 2: 24개 renderer와 호환 진입점 이전

**Description:** 현재 24개 Web renderer 함수 본문을 카피·공백·HTML 정리 없이 `src/preview/renderers.js`로 이동하고 production registry와 공개 component render API에 연결한다. `getMockupHTML()`은 non-thumbnail 요청만 새 API에 위임하며 기존 motion class 조립은 Task 4 전까지 한 경계에 그대로 둔다.

**Acceptance criteria:**

- [x] 24개 정규 renderer가 네 탭을 지원하고 `brutalism`은 `raw-brutal` capability로 해석되지만 정규 ID로 계산되지 않는다.
- [x] 24종 × 네 탭 96개 호환 HTML이 기존 출력과 byte 단위로 같고 renderer 함수 본문을 두 파일에 복제하지 않는다.
- [x] unknown/missing renderer와 미지원 탭은 Swiss로 대체되지 않으며 기존 24분기 switch가 제거된다.

**Verification:**

- [x] 96개 parity와 alias·unknown red-green 테스트 확인
- [x] `npm test -- tests/previewRegistry.test.js`
- [x] `rg -n "switch \(type\)|default:.*renderSwiss" src/components src/preview` 결과와 `npm test` 검토

**Dependencies:** Task 1

**Files likely touched:**

- `src/preview/renderers.js`
- `src/preview/registry.js`
- `src/preview/index.js`
- `src/components/mockupTemplates.js`
- `tests/previewRegistry.test.js`

**Estimated scope:** Medium (5 files, 대형 기계적 본문 이동 포함)

---

## Task 3: 24개 thumbnail의 정규 ID 디스패치 전환

**Description:** 기존 renderer-keyed thumbnail 객체를 24개 `thumbnailId` definition으로 옮긴다. 정규 key와 기존 CSS presentation class를 분리하고 compatibility entry의 `thumb` 요청도 `subDesign.thumbMotif`를 명시적으로 사용하게 한다.

**Acceptance criteria:**

- [x] 24개 정규 thumbnail definition이 `thumbnailId`로 조회·렌더되며 각 결과는 기존 `thumb-${rendererId}`, `data-motif`, palette CSS 변수를 보존한다.
- [x] `getMockupHTML(..., 'thumb', subDesign)`은 `thumbMotif`를 새 API에 전달하고 missing/unknown 값에 renderer ID나 일반 `Aa` fallback을 사용하지 않는다.
- [x] 24종 × 5 mode 120-output SHA-256이 `4b0ccbb887d83676464dc523ece67fdd7ed5ee43d4941d741a992a5354c9d4d9`이며 이전 thumbnail dispatch가 남지 않는다.

**Verification:**

- [x] 24개 direct-ID, missing/unknown, palette/motif와 120-output hash red-green 확인
- [x] `npm test -- tests/previewRegistry.test.js`
- [x] `rg -n "renderStyleThumb|\}\[type\].*thumb-giant" src/components src/preview`와 `npm test` 검토

**Dependencies:** Task 2

**Files likely touched:**

- `src/preview/thumbnails.js`
- `src/preview/registry.js`
- `src/preview/index.js`
- `src/components/mockupTemplates.js`
- `tests/previewRegistry.test.js`

**Estimated scope:** Medium (5 files)

---

## Checkpoint A: Registry Kernel and Render Parity

- [x] Tasks 1–3 acceptance criteria 충족
- [x] renderer 24, thumbnail 24, 네 탭과 `brutalism` alias 계약 통과
- [x] 120-output hash가 승인 기준과 일치
- [x] renderer switch, renderer-keyed thumbnail dispatch와 Swiss/generic fallback 제거
- [x] 전체 테스트와 `git diff --check` 통과
- [x] 결과와 diff 요약을 사용자에게 보고하고 Phase B 진행 승인

**검증 증거 (2026-08-30):** preview 집중 14개·전체 77개 테스트, catalog 오류 0/legacy 경고 56, theme 최신성, Vite build와 `git diff --check` 통과. production inventory는 renderer 24·thumbnail 24·motion 0·asset 0이며 같은 날 Phase B 진행을 승인받았다.

---

## Task 4: 24개 motion descriptor와 component output 조립

**Description:** 현재 24개 motion을 unit/effect class, effect-layer 여부, reduced-motion 정책과 실제 구현 channel로 등록한다. component render가 legacy/canonical design에서 motion ID를 정규화하고 등록된 unit class를 root에 정확히 한 번 적용하게 하여 문자열 조합 책임을 레지스트리로 옮긴다.

**Acceptance criteria:**

- [x] motion 24개가 유일하며 channel은 CSS·markup 근거와 일치하고 `metadata-only`는 다른 channel과 함께 쓰이지 않는다.
- [x] 공개 motion descriptor는 재귀 동결되고 class·asset·policy만 노출하며 내부 함수/map은 노출하지 않는다.
- [x] component render는 `motionProfile`/`preview.motionId`를 지원하고 missing/unknown에 실패하며 96개 HTML의 motion class와 전체 120-output hash를 유지한다.

**Verification:**

- [x] 24개 descriptor, channel, canonical/legacy 입력, class 단일 적용과 unknown red-green 확인
- [x] `npm test -- tests/previewRegistry.test.js`
- [x] `rg -n "motion-\$\{|fx-\$\{" src/preview src/components/mockupTemplates.js`와 `npm test` 검토

**Dependencies:** Checkpoint A

**Files likely touched:**

- `src/preview/motions.js`
- `src/preview/registry.js`
- `src/preview/index.js`
- `src/components/mockupTemplates.js`
- `tests/previewRegistry.test.js`

**Estimated scope:** Medium (5 files)

---

## Task 5: motion descriptor 기반 DOM hydration 전환

**Description:** `mockupRuntime.js`가 motion 문자열을 직접 조합하지 않고 공개 descriptor를 소비하도록 바꾼다. 기존 effect layer DOM, `motion-reduced`, thumbnail observer, action runtime과 cleanup을 유지하고 실제로 사용되지 않는 preview type 전달을 제거한다.

**Acceptance criteria:**

- [x] hydration은 등록된 `unitClass`와 `effectClass`를 사용하고 같은 unit에 중복 class/layer를 만들지 않으며 missing/unknown motion을 `none`으로 바꾸지 않는다.
- [x] 현재 24 profile의 effect layer DOM과 reduced-motion class, `observeThumbMotion()` pause/resume 계약이 유지된다.
- [x] 사용되지 않는 `previewType` runtime 변수·route 인자가 제거되고 action/state/cleanup 경로가 바뀌지 않는다.

**Verification:**

- [x] 최소 DOM fixture에서 class/layer/idempotence/unknown 동작의 red-green 확인
- [x] `npm test -- tests/mockupRuntime.test.js tests/previewRegistry.test.js`
- [x] `rg -n "motion-\$\{|fx-\$\{|previewType" src/components/mockupRuntime.js`와 전체 `npm test` 검토

**Dependencies:** Task 4

**Files likely touched:**

- `src/components/mockupRuntime.js`
- `tests/mockupRuntime.test.js`
- `tests/previewRegistry.test.js`

**Estimated scope:** Medium (3 files)

---

## Task 6: derived inventory와 catalog validation 연결

**Description:** registry 정규 definitions와 asset path 합집합에서 사전순 `ReferenceInventory`를 파생하고 현재 catalog snapshot의 유일한 참조 공급자로 연결한다. 진단 계약과 56개 legacy 경고를 유지한 뒤 수동 임시 인벤토리를 제거한다.

**Acceptance criteria:**

- [x] inventory가 renderer/thumbnail/motion 24개와 asset 0개를 사전순·재귀 동결로 제공하고 catalog의 참조 집합과 정확히 같다.
- [x] `currentCatalog.js`가 registry-derived inventory를 사용하며 `legacyReferenceInventory.js`가 제거되고 별도 수동 목록이 남지 않는다.
- [x] 기존 `PREVIEW_REFERENCE_UNKNOWN` code/path, catalog 오류 0·경고 56과 Node-only validation 경계가 유지된다.

**Verification:**

- [x] inventory equality/freeze/alias exclusion과 injected unknown reference 테스트 확인
- [x] `npm test -- tests/previewRegistry.test.js tests/catalogValidation.test.js`
- [x] `npm run validate:catalog && npm run check:themes && npm run build`

**Dependencies:** Task 5

**Files likely touched:**

- `src/catalog/validation/currentCatalog.js`
- `src/catalog/validation/legacyReferenceInventory.js` (삭제)
- `tests/catalogValidation.test.js`
- `tests/previewRegistry.test.js`
- `SPEC-catalog-validation.md`

**Estimated scope:** Medium (5 files)

**검증 증거 (2026-08-30):** preview·runtime·catalog 집중 47개와 전체 85개 테스트 통과. registry-derived inventory는 renderer 24·thumbnail 24·motion 24·asset 0이며 `brutalism` alias는 정규 목록에서 제외된다. catalog 오류 0·legacy 경고 56, theme 최신성, Vite build와 production asset의 Node-only validation 문자열 부재를 확인했다. 코드 검토에서 잘못 닫힌 `mockup-unit` class 속성을 구조화 오류로 거부하는 회귀 방어도 추가했다.

---

## Checkpoint B: Motion and Registry Integrity

- [x] Tasks 4–6 acceptance criteria 충족
- [x] renderer/thumbnail/motion 집합과 catalog 참조가 24/24/24로 일치하고 alias는 inventory에서 제외
- [x] motion channel 근거, component class와 hydration effect layer 호환 통과
- [x] 임시 inventory와 무검증 motion 문자열 조합 제거
- [x] catalog 오류 0·경고 56, theme stale 검사, 전체 테스트와 build 통과
- [x] 결과와 diff 요약을 사용자에게 보고하고 Phase C 진행 승인

**Checkpoint B 승인일:** 2026-08-30

---

## Task 7: Gallery·Detail·Dock·Peek 소비자 공개 API 전환

**Description:** thumbnail과 compact hero를 렌더하는 기존 UI 소비자를 `src/preview/index.js` 공개 API로 전환한다. UI가 compatibility signature나 내부 definition을 새 코드에서 확장하지 않게 하고 Grid/Bento/Spectrum, Detail/Split selector, Dock와 Peek의 정상 출력을 자동 검사한다.

**Acceptance criteria:**

- [x] Main View, Detail, Selection Dock와 Peek가 각 design의 `thumbMotif`/`previewType`을 명시적 옵션 객체로 공개 API에 전달한다.
- [x] Grid/Bento/Spectrum과 Detail/Split/Dock/Peek의 24개 썸네일·대표 hero HTML이 이전 결과와 같고 unknown을 catch해 다른 스타일로 바꾸지 않는다.
- [x] UI 파일은 registry map·definition 배열을 직접 import하지 않으며 `getMockupHTML()`은 legacy compatibility 용도로만 남는다.

**Verification:**

- [x] 소비자별 output fixture와 120-output hash 통과
- [x] `npm test -- tests/previewRegistry.test.js`
- [x] `rg -n "getMockupHTML|CORE_.*DEFINITIONS|preview.*Map" src/components`와 전체 `npm test` 검토

**Dependencies:** Checkpoint B

**Files likely touched:**

- `src/components/mainView.js`
- `src/components/detailView.js`
- `src/components/selectionDock.js`
- `src/components/peekPreview.js`
- `tests/previewRegistry.test.js`

**Estimated scope:** Medium (5 files)

**검증 증거 (2026-08-30):** Main View·Detail·Selection Dock·Peek가 공개 thumbnail/component API를 명시적 옵션 객체로 사용한다. 소비자 구조·출력 회귀를 포함한 preview 집중 20개와 당시 전체 87개 테스트가 통과했고, 120-output SHA-256 `4b0ccbb8…4c9d4d9`가 유지됐다. 소스 검색에서 UI의 내부 definition/map 접근은 없으며 `getMockupHTML()`은 의도적인 compatibility entry에만 남는다.

---

## Task 8: Web archetype와 전체 자동 통합 행렬

**Description:** Web archetype의 네 component 탭을 공개 component render API에 직접 연결하고, 모든 24종·8 archetype의 Node HTML 생성 행렬과 기존 design-spec selector 계약을 회귀 테스트한다. compatibility entry는 별도 parity 테스트만 유지한다.

**Acceptance criteria:**

- [x] Web archetype은 24종 × 네 탭에서 정규 renderer와 motion class를 사용하고 non-Web 7개 archetype 구조는 변하지 않는다.
- [x] 24종 × 8 archetype 192개 HTML이 올바른 root/data-archetype과 필수 selector를 가지며 empty output·Swiss 대체·예외가 없다.
- [x] 기존 component CSS selector, sandbox device CSS와 inspector/export 회귀 테스트가 통과한다.

**Verification:**

- [x] `npm test -- tests/previewIntegration.test.js tests/designSpecGenerator.test.js tests/sandboxDeviceStyles.test.js`
- [x] `npm test`
- [x] `npm run validate:catalog && npm run check:themes && npm run build && git diff --check`

**Dependencies:** Task 7

**Files likely touched:**

- `src/components/archetypeTemplates.js`
- `tests/previewIntegration.test.js`
- `tests/designSpecGenerator.test.js`
- `tests/sandboxDeviceStyles.test.js`

**Estimated scope:** Medium (4 files)

**검증 증거 (2026-08-30):** Web archetype이 공개 component API를 직접 사용하며 24종 × 4탭 96개 조합에서 정규 renderer·motion class를 확인했다. 전체 24종 × 8 archetype 192-output SHA-256은 `8c48b6d1…fb83c`, non-Web 168-output SHA-256은 `15067f01…b415`로 고정했다. 집중 9개·전체 92개 테스트, catalog 오류 0/legacy 경고 56, theme 최신성, 40-module Vite build와 `git diff --check`가 통과했다.

---

## Checkpoint C: Consumer Integration

- [x] Tasks 7–8 acceptance criteria 충족
- [x] UI 소비자는 공개 preview API 또는 의도적인 compatibility entry만 사용
- [x] 120-output hash, 192개 Node archetype 행렬과 기존 selector/export/device 테스트 통과
- [x] 전체 테스트, catalog/theme/build/check 통과
- [x] 결과와 diff 요약을 사용자에게 보고하고 실제 Chrome 검증 승인

**Checkpoint C 승인일:** 2026-08-30

---

## Task 9: Crostini Chrome 151 런타임·시각 검증

**Description:** 사용자의 Linux `/usr/bin/google-chrome`을 격리된 임시 profile로 실행해 실제 UI, DOM, computed motion과 state를 검사한다. 자동 행렬과 대표 육안 검토를 함께 사용하고 기본 Chrome profile은 수정하지 않는다.

**Acceptance criteria:**

- [x] 24개 thumbnail과 24종 × 네 Web 탭 96개 전환에서 style-specific root·motion class가 맞고 빈 화면·Swiss 대체가 없다.
- [x] 24종 × 8 archetype × Desktop/Mobile 384개 조합의 theme/root/sandbox 폭과 대표 interaction state가 유지된다.
- [x] 대표 motion channel과 reduced-motion 억제, 최소 8개 계열 시각 검토가 통과하고 앱 error/unhandled rejection/실패 same-origin 요청이 0개다.

**Verification:**

- [x] `/usr/bin/google-chrome --version`과 격리 profile·Vite/CDP 자동 시나리오 실행
- [x] Grid/Bento/Spectrum, Detail/Split, Web 4탭과 Desktop/Mobile 대표 스크린샷 육안 대조
- [x] Chrome/Vite PID 종료, 임시 profile 정리와 `npm run check` 재실행

**Dependencies:** Checkpoint C

**Files actually touched:**

- `src/components/detailView.js`
- `tests/previewIntegration.test.js`
- `index.html`
- 상태·감사 문서

**Estimated scope:** Medium (runtime matrix)

**검증 증거 (2026-08-30):** Crostini `/usr/bin/google-chrome` 151.0.7922.173을 격리 임시 profile과 로컬 Vite/CDP로 실행했다. Grid/Bento/Spectrum 각각 24개 thumbnail, 96개 Web 탭과 384개 style/archetype/device 조합이 통과했으며 Desktop root는 705.33–714.93px, Mobile root는 364.8px로 모든 조합에서 구분됐다. 6개 motion channel 대표와 reduced-motion, 320/768/1024/1440px overflow, Split dual render, 게임 상태의 기기·테마 전환 보존, 접근성 트리와 24장 시각 증거를 확인했다. 첫 실행에서 Web 비활성 탭의 `active`/`aria-selected`가 Hero에 남는 72개 회귀와 `/favicon.ico` 404를 재현해 회귀 테스트를 RED→GREEN으로 추가하고 최소 수정했다. 최종 앱 console/exception/실패 same-origin 요청은 0개, 전체 `npm run check`는 93/93 테스트·catalog 오류 0/경고 56·theme 최신성·40-module build를 통과했다. Chrome/Vite 종료, 4173/9222 포트 해제와 임시 profile 삭제를 확인했다.

---

## Task 10: 사용자·운영·구조 문서 동기화

**Description:** 새 preview 작성 경계, compatibility entry, 오류 의미, 현재 motion 부채와 복구·검증 방법을 사용자 및 유지보수 문서에 반영한다. 신규 디자인이나 미완료 후속 기능을 구현된 것처럼 표현하지 않는다.

**Acceptance criteria:**

- [x] README와 BUILD_GUIDE가 preview registry 구조, 새 스타일 등록 시 편집 지점, 표준 검증 명령과 실패 복구를 실제 코드대로 설명한다.
- [x] designs와 구현 요약의 구조도·컴포넌트 책임·responsive/reduced-motion/error 기준이 새 소유 경계와 일치한다.
- [x] CHANGELOG가 사용자 가치가 있는 구조·오류 변경과 정상 24종 호환을 Keep a Changelog 형식으로 기록한다.

**Verification:**

- [x] 문서의 경로·함수·명령·수치·상태를 실제 소스와 테스트 결과에 대조
- [x] `npm run check`
- [x] `git diff --check`와 문서 내 obsolete `legacyReferenceInventory`/switch 설명 검색

**Dependencies:** Task 9

**Files actually touched:**

- `README.md`
- `BUILD_GUIDE.md`
- `CHANGELOG.md`
- `designs.md`
- `implementation_summary.md`

**Estimated scope:** Medium (5 files)

**검증 증거 (2026-08-30):** README와 BUILD_GUIDE에 정규 레코드→세 preview definition→CSS→검증의 실제 작성 순서, `getMockupHTML()` 호환 전용 경계, 다섯 오류군의 복구와 Crostini 분리 진단을 기록했다. designs와 구현 요약은 Web renderer·전체 thumbnail·전체 motion hydration의 소유권, `.mockup-viewport.desktop|mobile`, `motion-reduced`, off-screen thumbnail과 구조화 오류 경계를 실제 코드에 맞췄다. CHANGELOG는 공개 API 직접 소비, 무음 fallback 제거와 정상 24종의 120/96/192/384 호환 증거를 Keep a Changelog의 `Changed`에 기록했다. 문서에 기재한 3파일 표적 명령은 30/30, 전체 `npm run check`는 93/93 테스트·catalog 오류 0/경고 56·theme 최신성·40-module build와 JavaScript `286.41 kB`/gzip `78.45 kB`, CSS `115.43 kB`/gzip `21.79 kB`로 통과했다. 모든 문서 경로가 존재하고 `legacyReferenceInventory` 현재 구조 설명은 0건이며 switch 언급은 신규 추가 금지 문맥만 남았다. `git diff --check`도 통과했다.

---

## Task 11: 사양·계약·ADR·역량 상태 완료 동기화

**Description:** 구현 결과와 검증 증거를 모듈 사양, style contract, master spec, Decision 014와 capability map에 반영한다. 승인 계획과 달라진 선택이 있으면 이유와 호환 영향을 기록하고 후속 모듈은 시작 전 상태로 유지한다.

**Acceptance criteria:**

- [x] `SPEC-preview-registry.md`의 API·오류·해시·성공 조건이 실제 구현과 일치하고 `COMPLETE` 상태와 검증 증거를 가진다.
- [x] style/master contract와 Decision 014가 derived inventory, thumbnail ID, motion descriptor와 compatibility 결과를 같은 의미로 설명한다.
- [x] capability map은 `preview-registry`만 COMPLETE로 올리고 `catalog-discovery` 이후는 기존 상태를 유지한다.

**Verification:**

- [x] 공개 export, path, 오류 code, definition 수, hash, 테스트·Chrome 증거를 문서와 대조
- [x] `npm run check`
- [x] `git diff --check`와 문서 status 검색

**Dependencies:** Task 10

**Files actually touched:**

- `SPEC-preview-registry.md`
- `SPEC-style-contract.md`
- `spec.md`
- `DESIGN_DECISIONS.md`
- `CAPABILITY_MAP.md`

**Estimated scope:** Medium (5 files)

**검증 증거 (2026-08-30):** `SPEC-preview-registry.md`를 `COMPLETE`로 전환하고 실제 공개 export 9개, 내부 전용 motion/error 상수, 오류 code 6개, 24/24/24/0 inventory와 120-output SHA-256을 대조했다. 성공 조건 13개 모두에 구현·테스트·Chrome 증거를 연결했다. `SPEC-style-contract.md`의 로딩 소유권을 현재 동기 registry는 `preview-registry`, 미래 지연 로딩은 `render-scalability`로 바로잡았고 master spec에 같은 공개·오류·호환 계약을 추가했다. Decision 014는 당시 Context를 역사로 보존한 채 implemented/verified로 전환했다. `CAPABILITY_MAP.md`에서는 `preview-registry`만 `COMPLETE`, `catalog-discovery` 이후 네 모듈은 `NOT STARTED`를 유지했다. 기계 대조 결과 공개 export 9개, 오류 code 6개, 동결 inventory 24/24/24/0, 성공 조건 13/13과 모든 경로가 일치했다. 표적 테스트 30/30, 전체 `npm run check` 93/93·catalog 0/56·theme 최신·40-module build, `git diff --check`가 통과했다.

---

## Task 12: 최종 감사와 완료 기록

**Description:** 승인 사양의 성공 조건, Tasks 1–12, Checkpoints A–C와 Final Checkpoint를 독립 항목별로 대조한다. 비밀정보·임시 생성물·중복 원천·browser import 경계를 검사하고 후속 모듈을 선택할 수 있는 완료 기록을 남긴다.

**Acceptance criteria:**

- [x] 성공 조건 13개와 모든 Task/Checkpoint가 구체적 테스트·hash·Chrome 증거로 충족된다.
- [x] 민감정보, 임시 Chrome profile/server, 예상 밖 symlink·asset, 중복 dispatch/inventory와 Node 전용 browser import가 없다.
- [x] 감사 로드맵·교훈·작업 상태가 실제 결과와 일치하고 다음 권장 모듈 및 남은 motion 품질 부채가 명시된다.

**Verification:**

- [x] 전체 명령 재실행: preview 집중 테스트, 전체 테스트, catalog, theme, build, check
- [x] `git diff --check`, `git status --short`, 민감정보·중복 원천·임시 파일 검색
- [x] 최종 문서·작업 체크리스트와 사용자 인수인계 검토

**Dependencies:** Task 11

**Files actually touched:**

- `audit_roadmap.md`
- `LESSONS_LEARNED.md`
- `tasks/plan.md`
- `tasks/todo.md`
- `SPEC-preview-registry.md`
- `spec.md`
- `DESIGN_DECISIONS.md`
- `CAPABILITY_MAP.md`

**Estimated scope:** Medium (8 documentation files)

**검증 증거 (2026-08-30):** 성공 조건 13/13, Tasks 1–12, Checkpoints A–C와 Final Checkpoint를 실제 공개 export 9개·오류 code 6개·동결 inventory 24/24/24/0, 120-output SHA-256 `4b0ccbb887d83676464dc523ece67fdd7ed5ee43d4941d741a992a5354c9d4d9`, Task 9 Chrome 151 행렬과 대조했다. preview 집중 테스트 30/30, 전체 테스트 93/93, catalog 오류 0·경고 56, theme 최신 상태, 40-module build와 독립 `npm run check`가 모두 통과했으며 bundle은 JavaScript `286.41 kB`/gzip `78.45 kB`, CSS `115.43 kB`/gzip `21.79 kB`였다. 비밀 패턴·비밀 파일·프로젝트 symlink·바이너리 asset·임시 파일·감사용 격리 Chrome profile/Vite/listener는 0건이었다. 사용자 Default-profile Chrome은 감사 임시 자원이 아니므로 보존했다. `legacyReferenceInventory.js`, renderer switch, generic thumbnail fallback, 중복 definition 소비와 Node 전용 browser import도 없었고 `git diff --check`가 통과했다. 코드 finding은 Critical/Required/Suggested 모두 0건이며, 다음 권장 모듈은 `catalog-discovery`다. motion 부채는 `metadata-only` 4개와 `interaction-local` 3개로 명시했다.

---

## Final Checkpoint: `preview-registry` Complete

- [x] Tasks 1–12와 Checkpoints A–C 완료
- [x] `SPEC-preview-registry.md` 성공 조건 13개 충족
- [x] renderer/thumbnail/motion 24/24/24와 derived inventory 단일 원천 완성
- [x] 120-output hash와 catalog 오류 0·경고 56 유지
- [x] 전체 테스트, theme 최신성, Vite build와 `npm run check` 통과
- [x] Chrome 151의 96 Web 탭·384 archetype/device 행렬과 reduced-motion 검증 통과
- [x] unknown 무음 fallback, switch, renderer-keyed thumbnail과 임시 inventory 제거
- [x] 사용자 검토 준비 완료
