# Task List: 5개 locale 전면 현지화와 문구 품질 감수

**Plan:** `tasks/plan.md`

**Status:** `STAGE 2 TASKS 21–26 COMPLETE — ZH-TW 120/120, TASK 27 NEXT`

## Stage 1: 모든 콘텐츠의 locale 분리와 완전성

### Task 1: 계약 문서 동기화

- [x] `spec.md` §5.10에 explicit locale content, 무암묵 fallback, invariant allowlist를 기록한다.
- [x] `designs.md`와 `DESIGN_DECISIONS.md`에 locale pack/provenance 경계를 기록한다.

**Acceptance:** 번역 대상·비번역 대상·실패 조건·Stage 1/2 완료 조건이 문서에서 동일하다.

**Verification:** 문서 상호 대조, `git diff --check`

**Dependencies:** 없음

**Estimated scope:** M (3 files)

### Task 2: 전체 사람용 문자열 인벤토리와 RED 테스트

- [x] source와 runtime의 visible/ARIA/title/placeholder/status/artifact 문자열을 수집한다.
- [x] ja/zh 영문 카드명, generic catalog template, preview literal을 실패로 재현한다.

**Acceptance:** 현재 false green이 명시적 실패 목록과 field path로 보고된다.

**Verification:** 새 집중 Node 테스트가 수정 전 RED

**Dependencies:** Task 1

**Estimated scope:** M (3–4 files)

### Task 3: Locale content schema와 provenance validator

- [x] UI/catalog/preview/artifact field schema를 만든다.
- [x] missing, placeholder, implicit fallback, unapproved invariant를 hard failure로 만든다.
- [x] machine ID와 display value를 분리한다.

**Acceptance:** 5개 locale의 key/record/array parity와 origin 상태를 결정론적으로 검증한다.

**Verification:** validator fixture와 경계 테스트

**Dependencies:** Task 2

**Estimated scope:** M (4–5 files)

### Task 4: Locale pack 물리 분리와 lazy 경계

- [x] locale별 `ui/catalog/preview` content entry를 만든다.
- [x] literal dynamic import와 last-known-good snapshot 동작을 보존한다.

**Acceptance:** 선택 locale만 로드되고 초기 bundle budget이 유지된다.

**Verification:** locale loader 테스트, `npm run build`, `npm run analyze:bundle`

**Dependencies:** Task 3

**Estimated scope:** M (5 files)

### Tasks 5–14: Locale별 catalog explicit record 이전

- [x] Task 5: `ko` category 01–04
- [x] Task 6: `ko` category 05–08
- [x] Task 7: `en` category 01–04
- [x] Task 8: `en` category 05–08
- [x] Task 9: `ja` category 01–04
- [x] Task 10: `ja` category 05–08
- [x] Task 11: `zh-CN` category 01–04
- [x] Task 12: `zh-CN` category 05–08
- [x] Task 13: `zh-TW` category 01–04
- [x] Task 14: `zh-TW` category 05–08

**Acceptance:** 각 wave의 name/summary/palette/특징/장점/주의점이 locale pack의 explicit record이며 fallback이 0이다.

**Verification:** wave별 field coverage와 cross-locale duplicate/foreign-script report

**Dependencies:** Task 4, 같은 locale의 앞 wave

**Estimated scope:** 각 M (2–4 files)

## Checkpoint A: Catalog 완전성

- [x] 5 locale × 1,924 field units complete (locale당 120 style 전체)
- [x] locale별 120/120 style record와 하위 배열 길이 parity
- [x] 비영어 design name 120개가 locale별 명시명 사용
- [x] missing/placeholder/implicit fallback/unapproved invariant 0
- [x] 전체 Node 테스트·build·bundle gate 통과

### Task 15: Main UI와 상태·오류 표면 이전

- [x] Header, Discovery, Gallery, Detail, Split, Peek, Dock, Audio, recovery를 locale content에 연결한다.
- [x] component의 사람용 literal이 선택 snapshot 밖으로 노출되지 않게 한다.

**Acceptance:** 모든 메뉴·카드·dialog·toast·ARIA가 선택 snapshot을 사용한다.

**Verification:** 5 locale source lint와 UI 상태 snapshot

**Dependencies:** Checkpoint A

**Estimated scope:** 여러 S/M slice로 분할 실행, slice당 5 files 이하

### Task 16: Core preview locale 이전

- [x] Core renderer의 Web 4탭과 archetype 내부 사람용 copy를 분리한다.

**Acceptance:** Core preview에 승인되지 않은 고정 언어 literal이 없다.

**Verification:** 5 locale Core render matrix

**Dependencies:** Task 15

**Estimated scope:** M (3–5 files)

### Task 17: Wave 1 preview locale 이전

- [x] Wave 1 renderer의 visible/ARIA/status copy를 분리한다.

**Acceptance:** Wave 1 preview에 승인되지 않은 고정 언어 literal이 없다.

**Verification:** 5 locale Wave 1 render matrix

**Dependencies:** Task 15

**Estimated scope:** M (3–5 files)

### Task 18: Expansion preview locale 이전

- [x] Expansion의 Hero/Widget/Form/Pricing copy와 interaction status를 분리한다.

**Acceptance:** Expansion 84종의 모든 탭이 선택 locale copy를 사용한다.

**Verification:** 5 locale × 84 × Web 4탭 matrix

**Dependencies:** Task 15

**Estimated scope:** M (3–5 files)

### Task 19: Inspector human metadata 전수 연결

- [x] CSS comment, HTML visible/ARIA, Markdown prose, DTCG display metadata를 새 content contract에 연결한다.
- [x] machine key set과 filename을 불변으로 유지한다.

**Acceptance:** human text는 locale별로 다르고 machine 구조는 byte-equivalent다.

**Verification:** 5 locale Inspector 4-pane snapshot

**Dependencies:** Tasks 16–18

**Estimated scope:** M (4–5 files)

### Task 20: Stage 1 전체 Chrome 재감사

- [x] 5 locale × 120 gallery card와 category/page 도달성을 검사한다.
- [x] Main/empty/filter/Detail/Split/Peek/Dock/error와 representative preview를 검사한다.
- [x] Actual-120, Discovery, Pages recovery, diagnostics를 재실행한다.

**Acceptance:** 언어 누출·fallback·overflow·diagnostic issue가 0이다.

**Verification:** project-local JSON report와 representative screenshots

**Dependencies:** Task 19

**Estimated scope:** M (3–5 files)

## Checkpoint B: Stage 1 완료 승인

- [x] Node 4,800 archetype + 2,400 Web tab locale matrix 통과
- [x] 5 locale 120-card Chrome matrix 통과
- [x] 전체 테스트/build/bundle/Pages/Actual-120 green
- [x] coverage와 잔여 위험 근거 문서 작성
- [x] Stage 2 시작에 대한 사용자 승인

## Stage 2: 언어별 자연스러운 문구 감수

### Task 21: 5 locale glossary와 style guide

- [x] 번역명, 음역명, invariant, UI tone, 구두점·단위 규칙을 locale별로 정의하고 디자인명 120/120을 전수 검토한다. (93개 ID 교정값 고정, 27개 현 표기 승인)
- [x] 디자인 용어의 통용 명칭 출처를 기록한다.

**Acceptance:** 모든 반복 용어가 하나의 승인 표기를 가진다.

**Verification:** glossary 중복·충돌 검사와 문서 리뷰

**Dependencies:** Checkpoint B 승인

**Estimated scope:** M (5 files)

### Tasks 22–26: Locale별 편집 감수

- [x] Task 22: 한국어 의미·문체 기준 확정 (8개 카테고리 120/120 완료, Node/build/5-locale·actual-120 Chrome 검증 통과)
- [x] Task 23: 영어 자연스러움·문법·UI tone 감수 (8개 카테고리 120/120 완료, 문장 중복 0, Node/build/5-locale·actual-120 Chrome 검증 통과)
- [x] Task 24: 일본어 통용 용어·조사·문체 감수 (8개 카테고리 120/120 완료, 문장 중복·상투문 0, Node/build/5-locale·actual-120·Discovery·Pages Chrome 검증 통과)
- [x] Task 25: 중국어 간체 지역 용어·간결체 감수 (8개 카테고리 120/120 완료, 문장 중복·상투문·번체 UI 용어 0, Node/build/5-locale·actual-120·Discovery·Pages Chrome 검증 통과)
- [x] Task 26: 중국어 번체 지역 용어·문체 감수 (8개 카테고리 120/120 완료, 문장 중복·상투문·본토 UI 용어 0, Node/build/5-locale·actual-120·Discovery·Pages Chrome 검증 통과)

**Acceptance:** locale별 issue ledger의 High/Medium 미해결 항목이 0이고 모든 항목이 `editorially-reviewed`다.

**Verification:** 용어 lint, 의미 보존 대조, 길이 검사, 사람 검토 기록

**Dependencies:** Task 21, 앞 locale의 의미 기준

**Estimated scope:** 각 M, category wave로 분할 실행

### Task 27: 교차 언어 의미·레이아웃 재감사

- [x] field 단위 의미 누락·추가를 비교한다.
- [x] 간체/번체 독립 용어를 검사한다.
- [x] 5 locale × 320/375/768/1024/1440px와 물리 1280px/CSS 640px/DPR 2의 200% reflow를 검사한다.

**Acceptance:** 의미 drift, 어색한 승인 문구, overflow, machine-key 변화가 0이다.

**Verification:** 최종 locale QA report와 screenshot matrix

**Dependencies:** Tasks 22–26

**Estimated scope:** M (3–5 files)

### Task 28: 문서·증거·최종 리뷰

- [x] README/CHANGELOG/spec/designs/ADR와 검수 결과를 동기화한다.
- [x] correctness/readability/architecture/security/performance 5축 리뷰를 수행한다.

**Acceptance:** 구현·문서·검수 ledger·자동 증거가 같은 판정을 가리킨다.

**Verification:** `git diff --check`, 비밀 패턴 검사, 전체 gate 재확인

**Dependencies:** Task 27

**Estimated scope:** M (4–5 files)
