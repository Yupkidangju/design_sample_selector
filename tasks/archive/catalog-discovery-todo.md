# Task List: `catalog-discovery`

**Source plan:** `tasks/plan.md` (`COMPLETE`)

**Source specification:** `SPEC-catalog-discovery.md` (`COMPLETE`)

**Task list status:** 구현·검증·문서화 완료 (`COMPLETE`)

**승인일:** 2026-08-30

**완료일:** 2026-08-30

**Previous completed task list:** `tasks/archive/catalog-expansion-wave1-todo.md`

> 사용자의 “승인”을 `catalog-discovery`의 사양·계획·순차 구현과 검증 전체에 대한 진행 승인으로 기록한다. Wave 2, Git commit·push·배포는 포함하지 않는다.

---

## Task 1: 탐색·URL RED 계약 고정

**Description:** 실제 Core 36과 synthetic edge fixture로 검색, facet, 정렬, 시대 bucket, URL canonicalization의 실패 테스트를 먼저 작성한다.

**Acceptance criteria:**

- [x] 한국어/영어/metadata 다중 token 검색과 category+facet AND/OR 기대값이 명시된다.
- [x] single/multiple 정규화, 네 정렬, 시대 경계·그룹 순서가 명시된다.
- [x] URL 기본값 생략, 중복·invalid 정리, round-trip 기대값이 명시된다.

**Verification:**

- [x] `npm test -- tests/catalogDiscovery.test.js`가 승인된 미구현 API 때문에 RED

**RED evidence:** `ERR_MODULE_NOT_FOUND: src/catalog/discoveryUrl.js`로 2026-08-30 실패해 미구현 계약을 확인했다.

**Dependencies:** None

**Files likely touched:**

- `tests/catalogDiscovery.test.js`

**Estimated scope:** Small (1 file)

---

## Task 2: 순수 catalog discovery 엔진 구현

**Description:** 검색 문서, facet 값 파생, selection 정규화, AND/OR query, 네 정렬, era grouping과 공개 catalog export를 구현한다.

**Acceptance criteria:**

- [x] query 결과가 안정 순서이며 입력·정규 레코드를 변경하지 않는다.
- [x] 10 facet과 시대 bucket이 사전/분류 데이터에서 파생된다.
- [x] unknown 입력은 예외·fallback 없이 제거된다.

**Verification:**

- [x] discovery 순수 계약 9/9 GREEN, URL 3건은 Task 3 RED 유지
- [x] `npm test -- tests/styleContract.test.js tests/catalogValidation.test.js` — 46/46 GREEN

**Dependencies:** Task 1

**Files likely touched:**

- `src/catalog/discovery.js`
- `src/catalog/index.js`
- `tests/catalogDiscovery.test.js`

**Estimated scope:** Medium (3 files)

---

## Task 3: URL과 app state 동기화

**Description:** 안정 URL parse/serialize, discovery 기본 상태와 history `replaceState`/`popstate` adapter를 연결한다.

**Acceptance criteria:**

- [x] `q/category/f/sort/view/saved`가 canonical order로 직렬화된다.
- [x] 초기 URL과 popstate가 상태로 복원되고 subscriber loop가 없다.
- [x] invalid 값과 120자 초과 query가 안전하게 정규화된다.

**Verification:**

- [x] `npm test -- tests/catalogDiscovery.test.js` — 13/13 GREEN
- [x] `npm run build` — catalog 0/56, theme current, Vite 48 modules GREEN

**Dependencies:** Task 2

**Files likely touched:**

- `src/catalog/discoveryUrl.js`
- `src/state/discoveryUrlState.js`
- `src/state/appState.js`
- `src/main.js`
- `tests/catalogDiscovery.test.js`

**Estimated scope:** Medium (5 files)

---

## Checkpoint A: Pure contract ready

- [x] discovery/URL 표적 테스트 GREEN
- [x] Core 36 catalog regression GREEN
- [x] 기본값·invalid URL·입력 immutability GREEN

---

## Task 4: 접근 가능한 discovery controls 구현

**Description:** 동적 결과 수, 정렬, compact facet panel, 활성 조건 칩과 전체 초기화를 별도 component로 구현한다.

**Acceptance criteria:**

- [x] 10 facet이 single radio/multiple checkbox와 label/legend로 파생된다.
- [x] 결과 수는 live status이고 선택 조건은 텍스트 칩으로 제거할 수 있다.
- [x] panel open state와 facet details 상태가 re-render 뒤 유지된다.

**Verification:**

- [x] DOM 계약 집중 테스트와 Chrome DOM assertion 통과
- [x] 320/375px에서 44px target과 overflow 0 자동 확인

**Dependencies:** Checkpoint A

**Files likely touched:**

- `src/components/discoveryControls.js`
- `src/main.js`
- `index.html`
- `index.css`

**Estimated scope:** Medium (4 files)

---

## Task 5: Header·Grid·Bento 공통 질의 연결

**Description:** 검색·category·bookmark를 공통 discovery state로 정리하고 Grid와 Bento가 순수 query 결과를 사용하도록 전환한다.

**Acceptance criteria:**

- [x] category와 bookmark가 facet/search와 동시에 적용된다.
- [x] Grid는 category group, Bento는 전역 sort를 사용하며 canonical 결과 ID 집합은 같다.
- [x] empty reset이 검색/category/bookmark/facet/sort를 초기화하고 detail/keyboard/bookmark 동작은 유지된다.

**Verification:**

- [x] `npm test -- tests/catalogDiscovery.test.js tests/previewIntegration.test.js` — 21/21 GREEN
- [x] 검색 caret과 `/`, 화살표, Enter, Space 브라우저 확인

**Dependencies:** Task 4

**Files likely touched:**

- `src/components/header.js`
- `src/components/mainView.js`
- `src/components/discoveryControls.js`
- `index.css`

**Estimated scope:** Medium (4 files)

---

## Task 6: 시대 데이터 기반 Spectrum 구현

**Description:** 고정 시대 axis와 category grouping을 제거하고 실제 `classification.era` bucket으로 Spectrum을 구성한다.

**Acceptance criteria:**

- [x] 시대 그룹·레이블·count가 StyleRecord에서 파생된다.
- [x] `era-desc`는 그룹을 역전하고 나머지 정렬은 그룹 안에 안정적으로 적용된다.
- [x] 각 카드가 시대와 category 맥락을 함께 제공한다.

**Verification:**

- [x] `npm test -- tests/catalogDiscovery.test.js` — 15/15 GREEN
- [x] Spectrum DOM의 시대 순서·결과 ID를 Chrome에서 확인

**Dependencies:** Task 5

**Files likely touched:**

- `src/components/mainView.js`
- `src/catalog/discovery.js`
- `index.css`
- `tests/catalogDiscovery.test.js`

**Estimated scope:** Medium (4 files)

---

## Checkpoint B: User flow ready

- [x] Grid/Bento/Spectrum canonical 결과 집합 일치
- [x] 검색/category/bookmark/facet/sort/empty reset 정상
- [x] label/legend/live status/focus/44px/반응형 정상

---

## Task 7: Crostini Chrome discovery QA

**Description:** 격리 Google Chrome profile로 discovery 상태·반응형·URL·접근성·diagnostics를 자동 검증하고 대표 증거를 보존한다.

**Acceptance criteria:**

- [x] 320/375/414/768/1024/1440px의 overflow가 0이다.
- [x] 검색/category/bookmark/multi-facet/sort/URL reload·popstate/empty/세 view 시나리오가 통과한다.
- [x] console/network/application failure 0, mobile target 44px, focus/live status/reduced-motion 계약이 통과한다.

**Verification:**

- [x] `npm run qa:discovery:chrome` — Chrome 151, 9 scenarios, 6 widths, diagnostics/issues 0

**Dependencies:** Checkpoint B

**Files likely touched:**

- `scripts/verifyCatalogDiscoveryChrome.js`
- `package.json`

**Estimated scope:** Small (2 files)

---

## Task 8: 사양·UX 문서 동기화

**Description:** 사용자 기능, 상태 계약, 시대 Spectrum, URL과 접근성 결정을 module/master spec과 디자인 문서에 반영한다.

**Acceptance criteria:**

- [x] master spec과 module spec이 실제 공개 API·상태·URL을 설명한다.
- [x] designs 구조도와 responsive/a11y 기준이 실제 UI와 일치한다.
- [x] 구현 중 확정된 결정과 Chrome 검증 기준이 승인 사양에 반영된다.

**Verification:**

- [x] 문서의 hard-coded 이전 탐색 설명과 상태를 `rg`로 점검

**Dependencies:** Task 7

**Files likely touched:**

- `spec.md`
- `SPEC-catalog-discovery.md`
- `designs.md`

**Estimated scope:** Medium (3 files, 문서 전용 동기화 작업)

---

## Task 9: ADR·사용자 변경 문서 동기화

**Description:** 완료된 탐색 계약과 사용자 사용법, 변경 이력을 ADR·README·CHANGELOG에 반영한다.

**Acceptance criteria:**

- [x] 결정 이유와 기각 대안이 ADR에 기록된다.
- [x] README가 검색·facet·정렬·URL·Spectrum 사용법과 command를 설명한다.
- [x] CHANGELOG가 사용자 가치와 수정 사항을 구분해 기록한다.

**Verification:**

- [x] 완료 상태·명령·URL parameter를 `rg`로 대조

**Dependencies:** Task 8

**Files likely touched:**

- `DESIGN_DECISIONS.md`
- `README.md`
- `CHANGELOG.md`

**Estimated scope:** Medium (3 files, 문서 전용 동기화 작업)

---

## Task 10: capability·운영·감사 인수인계

**Description:** capability 상태, 인수인계, 빌드 가이드, 감사 기준과 작업 기록을 실제 증거로 전환하고 전체 검사를 수행한다.

**Acceptance criteria:**

- [x] `catalog-discovery`가 COMPLETE이며 다음 gate가 `render-scalability`로 명시된다.
- [x] 자동·Chrome 결과, bundle delta, 남은 위험과 범위 제외가 기록된다.
- [x] 실제 자동·Chrome evidence와 bundle 결과가 운영 문서에 일치한다.

**Verification:**

- [x] 문서 숫자·명령·다음 gate를 실제 결과와 대조

**Dependencies:** Task 9

**Files likely touched:**

- `CAPABILITY_MAP.md`
- `implementation_summary.md`
- `BUILD_GUIDE.md`
- `audit_roadmap.md`

**Estimated scope:** Medium (4 files, 문서·게이트 전용 작업)

---

## Task 11: 작업 기록·최종 완료 게이트

**Description:** 계획·task·checkpoints와 Definition of Done을 완료하고 전체 자동·diff·자원 검사를 수행한다.

**Acceptance criteria:**

- [x] Task 1–11과 Checkpoint A/B/Final이 실제 evidence로 완료된다.
- [x] 전체 회귀·build·diff hygiene가 통과한다.
- [x] 비밀·임시 프로세스·기본 Chrome profile 접촉이 없다.

**Verification:**

- [x] `npm run check` — 121/121, catalog 0/56, theme current, Vite 51 modules
- [x] `git diff --check` — finding 0
- [x] 비밀정보·임시 프로세스·기본 Chrome profile 비접촉 점검 — finding 0

**Dependencies:** Task 10

**Files likely touched:**

- `tasks/plan.md`
- `tasks/todo.md`

**Estimated scope:** Small (2 files)

---

## Final Checkpoint

- [x] 성공 조건 전체 충족
- [x] 전체 자동 테스트·build 통과
- [x] 실제 Crostini Chrome QA 실패 0
- [x] Core 36과 기존 호환 계약 무회귀
- [x] 문서·capability·task 상태 동기화
- [x] Wave 2·render scalability·pack authoring 미착수
- [x] Git commit·push·배포 미수행

**Final evidence:** 탐색 집중 15/15, 전체 121/121, catalog 오류 0/legacy 경고 56, 생성 테마 최신, Vite JavaScript `354.99 kB` (`98.87 kB` gzip)·CSS `167.42 kB` (`32.18 kB` gzip), Chrome 151 시나리오 9개·6개 폭·diagnostics/issues 0, `git diff --check`·비밀·임시 자원 finding 0.
