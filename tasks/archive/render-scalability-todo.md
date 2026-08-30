# Archived Task List: `render-scalability`

**Source plan:** `tasks/plan.md` (`COMPLETE`)

**Source specification:** `SPEC-render-scalability.md` (`COMPLETE`)

**Task list status:** 구현·검증 완료 (`COMPLETE`)

**승인일:** 2026-08-30

**Previous completed task list:** `tasks/archive/catalog-discovery-todo.md`

> 사용자의 “승인”을 사양·계획·순차 구현·검증 승인으로 기록한다. 실제 Wave 2 스타일, 새 dependency, Git commit·push·배포는 포함하지 않는다.

---

## Task 1: 기준선·RED 예산 계약

**Description:** Core 36 실측과 synthetic 60/120으로 window, picker, 초기 bundle 예산의 실패 계약을 먼저 고정한다.

**Acceptance criteria:**

- [x] 36/60/120 window reachability와 36개 상한이 명시된다.
- [x] selected pinning, 검색, 12/24개 상한 edge case가 명시된다.
- [x] 실제 catalog가 36으로 유지되는 회귀 조건이 있다.

**Verification:**

- [x] `npm test -- tests/renderScalability.test.js`가 미구현 API로 RED

**RED evidence:** `ERR_MODULE_NOT_FOUND: src/scalability/renderWindow.js`로 미구현 계약을 확인했다.

**Files likely touched:** `tests/renderScalability.test.js`

## Task 2: 순수 window·picker 구현

**Description:** DOM/app state 비의존 불변 window와 bounded picker, 예산 상수를 구현한다.

**Acceptance criteria:**

- [x] invalid 입력이 정규화되고 입력 mutation이 없다.
- [x] 모든 page 합집합이 원본 ID·순서와 같다.
- [x] 선택 ID는 제한 안에서 중복 없이 한 번 포함된다.

**Verification:**

- [x] scalability 표적 6/6 GREEN
- [x] catalog/preview 표적 회귀 45/45 GREEN

**Files likely touched:** `src/scalability/renderWindow.js`, `tests/renderScalability.test.js`

---

## Task 3: 36-card gallery window

**Description:** Grid/Bento/Spectrum 공통 결과에 local 페이지 창과 접근 가능한 이전/다음 제어를 연결한다.

**Acceptance criteria:**

- [x] Core 36 이하 UI에는 페이지 제어가 없다.
- [x] synthetic 60/120의 모든 ID가 페이지로 도달한다.
- [x] 결과/보기 조건 변경 시 첫 페이지로 돌아간다.

**Verification:**

- [x] DOM markup 계약 테스트 GREEN
- [x] browser keyboard/live status/세 보기 확인

**Files likely touched:** `src/components/mainView.js`, `index.css`, `tests/renderScalability.test.js`

## Task 4: category-bounded Detail selector

**Description:** 상세 상단 칩을 현재 category + 최대 24개로 제한하고 초과 category 검색을 제공한다.

**Acceptance criteria:**

- [x] Core 36 category 전환과 zero-rebuild theme swap이 보존된다.
- [x] 최대 24칩, selected pinning, 초과 검색이 동작한다.
- [x] selector 교체만으로 focus와 active 상태가 정확하다.

**Verification:**

- [x] detail markup/interaction 표적 테스트 GREEN
- [x] Chrome Desktop/Mobile category·keyboard 확인

**Files likely touched:** `src/components/detailView.js`, `index.css`, `tests/renderScalability.test.js`

## Task 5: searched bounded Split picker

**Description:** 전체 native select를 유지하면서 슬롯별 검색과 최대 12개 시각 썸네일을 구현한다.

**Acceptance criteria:**

- [x] native select에서 모든 스타일에 도달한다.
- [x] visual thumbnail은 12/slot, 24 total을 넘지 않는다.
- [x] query가 URL/app state를 오염하지 않고 picker만 다시 그린다.

**Verification:**

- [x] split picker pure/DOM 테스트 GREEN
- [x] Chrome 검색·선택·Desktop/Mobile·focus 확인

**Files likely touched:** `src/components/detailView.js`, `index.css`, `tests/renderScalability.test.js`

## Task 6: motion observer lifecycle

**Description:** thumbnail observer를 mount 수명에 결합해 rerender/unmount 누적을 제거한다.

**Acceptance criteria:**

- [x] 이전 render observer가 다음 render 전에 정리된다.
- [x] offscreen/reduced-motion animation이 중지된다.
- [x] synthetic page 이동 후 detached observed node가 0이다.

**Verification:**

- [x] mockup runtime lifecycle 테스트 GREEN
- [x] Chrome observer/reduced-motion 확인

**Files likely touched:** `src/components/mockupRuntime.js`, `src/components/mainView.js`, `tests/mockupRuntime.test.js`, `tests/renderScalability.test.js`

---

## Checkpoint B: bounded visual DOM

- [x] gallery/detail/split 구조 예산 통과
- [x] Core 36 시각·keyboard·focus 회귀 없음
- [x] observer cleanup·reduced-motion 정상

---

## Task 7: preview kind entrypoints

**Description:** thumbnail/motion/component registry entrypoint를 분리하고 기존 full facade를 유지한다.

**Acceptance criteria:**

- [x] 초기 UI는 renderer definition을 정적으로 import하지 않는다.
- [x] component entrypoint는 renderer+motion만 포함한다.
- [x] `src/preview/index.js`의 기존 export·오류·hash 계약이 동일하다.

**Verification:**

- [x] preview registry/integration 전체 GREEN
- [x] build chunk graph assertion GREEN

**Files likely touched:** `src/preview/thumbnailEntry.js`, `src/preview/motionEntry.js`, `src/preview/componentEntry.js`, `src/preview/index.js`, `tests/previewRegistry.test.js`

## Task 8: lazy Detail/Split route

**Description:** 상세 상태 첫 진입에서 detail module을 불러오고 loading/error/retry와 stale request 방지를 구현한다.

**Acceptance criteria:**

- [x] Grid 초기 경로에 detailView/renderer chunk가 없다.
- [x] DETAIL/SPLIT 첫 진입과 재진입이 동작한다.
- [x] load 실패가 명시되고 재시도할 수 있다.

**Verification:**

- [x] loader unit/DOM 테스트 GREEN
- [x] Chrome cold/warm 진입·failure injection 확인

**Files likely touched:** `src/components/lazyPreviewLoader.js`, `src/main.js`, `index.css`, `tests/renderScalability.test.js`

## Task 9: lazy Peek·selection preview

**Description:** hover/focus Peek와 확정 시트의 전체 component render를 공유 lazy loader에 연결한다.

**Acceptance criteria:**

- [x] 단순 gallery/thumbnail 경로는 component renderer를 요청하지 않는다.
- [x] loading 중 stale hover 결과가 삽입되지 않는다.
- [x] failure/retry와 기존 selection/export 흐름이 보존된다.

**Verification:**

- [x] preview integration 표적 테스트 GREEN
- [x] Chrome Peek·dock cold/warm/focus 확인

**Files likely touched:** `src/components/peekPreview.js`, `src/components/selectionDock.js`, `src/components/lazyPreviewLoader.js`, `tests/previewIntegration.test.js`

## Task 10: bundle·synthetic Chrome QA

**Description:** initial static gzip을 분석하고 Core 36 + synthetic 60/120의 구조·상호작용·반응형·diagnostics를 실제 Chrome에서 검증한다.

**Acceptance criteria:**

- [x] initial JS ≤88.98kB gzip, CSS ≤33.00kB gzip이다.
- [x] 60/120 DOM과 5회 interaction 표본이 예산을 통과한다.
- [x] 320/768/1024/1440px, console/network/a11y/reduced-motion issue가 0이다.

**Verification:**

- [x] `npm run qa:scalability:chrome` GREEN
- [x] `.antigravity/archive/render-scalability-chrome-qa/` report/screenshots 보존

**Files likely touched:** `scripts/verifyRenderScalabilityChrome.js`, `scripts/analyzeInitialBundle.js`, `package.json`

---

## Task 11: 제품·설계 문서 동기화

**Description:** 완료된 렌더 창, picker, lazy loading, 성능 예산과 근거를 사양·UX·ADR·사용자 문서에 반영한다.

**Acceptance criteria:**

- [x] spec/design/ADR가 실제 interface와 error/focus 상태를 설명한다.
- [x] README/CHANGELOG가 사용자 가치와 명령을 설명한다.
- [x] 공식 문서 URL과 before/after 수치가 실제 결과와 일치한다.

**Files likely touched:** `spec.md`, `SPEC-render-scalability.md`, `designs.md`, `DESIGN_DECISIONS.md`, `README.md`, `CHANGELOG.md`

## Task 12: 인수인계·최종 완료 게이트

**Description:** capability, 구현 요약, build/audit/교훈/plan/todo를 실제 증거로 닫고 전체 검사를 수행한다.

**Acceptance criteria:**

- [x] `render-scalability`가 COMPLETE이고 다음 gate가 `style-pack-authoring`이다.
- [x] 전체 자동·Chrome·bundle·diff·비밀/프로세스 검사가 통과한다.
- [x] Wave 2와 Git/배포가 수행되지 않았음을 확인한다.

**Verification:**

- [x] `npm run check`
- [x] `npm run qa:scalability:chrome`
- [x] `git diff --check`

**Files likely touched:** `CAPABILITY_MAP.md`, `implementation_summary.md`, `BUILD_GUIDE.md`, `audit_roadmap.md`, `LESSONS_LEARNED.md`, `tasks/plan.md`, `tasks/todo.md`

---

## Final Checkpoint

- [x] 성공 조건 전체 충족
- [x] Core 36 무회귀와 synthetic 60/120 용량 증명
- [x] 초기 bundle·DOM·interaction·motion 예산 통과
- [x] 실제 Crostini Chrome diagnostics 0
- [x] 문서·capability·task 상태 동기화
- [x] Wave 2·style-pack-authoring 미착수
- [x] Git commit·push·배포 미수행
