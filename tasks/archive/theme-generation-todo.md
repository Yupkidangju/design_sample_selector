# Task List: `theme-generation`

**Initiative:** `scalable-style-library`

**Source plan:** `tasks/archive/theme-generation-plan.md` (`APPROVED / COMPLETE`)

**Source specification:** `SPEC-theme-generation.md` (`COMPLETE`)

**작성일:** 2026-08-30

**계획 승인일:** 2026-08-30

**구현 완료일:** 2026-08-30

**Previous completed task list:** `tasks/archive/catalog-validation-todo.md`

> 이 목록은 2026-08-30에 승인되었다. Task 1부터 순차 실행하며, 진행 상태 기록을 위한 `tasks/plan.md`와 `tasks/todo.md` 자체의 갱신은 아래 파일 규모 산정에서 제외한다.

---

## Task 1: 선택 효과 계약과 기존 세 스타일 이전

**Description:** `StyleRecord`에 선택적 `ThemeEffects` 계약을 추가하고 기존 runtime CSS에만 있던 세 blur 값을 정규 스타일 레코드로 이전한다. 카탈로그 스키마 v1, 13개 의미 토큰과 `defaultTweaks` 값은 바꾸지 않는다. 테스트를 먼저 작성해 정확한 세 값과 재귀 불변성을 고정한다.

**Acceptance criteria:**

- [x] `ThemeEffects.backdropBlur`가 0 이상의 유한한 px 숫자를 뜻하는 선택 필드로 문서화되고 스키마 버전은 `1`을 유지한다.
- [x] `glassmorphism`, `frutiger-aero`, `bento-grid`만 각각 `20`, `14`, `16`을 가지며 `bento-grid.defaultTweaks.backdropBlur`는 `12`로 유지된다.
- [x] 공개 스타일과 중첩 `themeEffects`는 재귀 동결되고 기존 24종 정렬·ID·13개 토큰·legacy projection parity가 유지된다.

**Verification:**

- [x] 새 계약 테스트가 구현 전 실패하고 최소 데이터·계약 변경 후 통과함을 확인한다.
- [x] `npm test -- tests/styleContract.test.js`
- [x] `npm run validate:catalog`

**Dependencies:** None

**Files likely touched:**

- `src/catalog/contract.js`
- `src/catalog/packs/core/styles-foundations.js`
- `src/catalog/packs/core/styles-contemporary.js`
- `tests/styleContract.test.js`

**Estimated scope:** Medium (4 files)

---

## Task 2: 선택 효과 검증 규칙과 오류 계약

**Description:** optional 효과 객체의 허용 키와 값을 카탈로그 경계에서 검사한다. 잘못된 효과를 runtime 생성기가 해석하도록 넘기지 않고 안정 code/path의 오류로 수집하며 기존 legacy 품질 경고 기준선을 보존한다.

**Acceptance criteria:**

- [x] 알 수 없는 키는 `THEME_EFFECT_UNKNOWN`, 음수·비유한·문자열 값은 `THEME_EFFECT_VALUE_INVALID` error로 보고된다.
- [x] 오류 경로는 `styles[<id>].themeEffects.<key>`이고 필드 생략 및 `0` 값은 통과하며 입력 snapshot을 변형하지 않는다.
- [x] 현재 카탈로그는 오류 0개·경고 56개를 유지하고 공개 진단 코드 문서가 실제 규칙과 일치한다.

**Verification:**

- [x] 각 오류와 유효 경계값의 red-green fixture 확인
- [x] `npm test -- tests/catalogValidation.test.js`
- [x] `npm run validate:catalog && npm test`

**Dependencies:** Task 1

**Files likely touched:**

- `src/catalog/validation/rules.js`
- `tests/catalogValidation.test.js`
- `SPEC-catalog-validation.md`

**Estimated scope:** Medium (3 files)

---

## Checkpoint A: Catalog Contract and Guardrails

- [x] Tasks 1–2 acceptance criteria 충족
- [x] 스키마 v1, 24개 정규 ID, 21개 alias와 13개 토큰 계약 유지
- [x] 세 blur 효과와 bento 기준 효과/tweak 차이 증명
- [x] catalog 오류 0개·경고 56개 및 전체 테스트 통과

---

## Task 3: 동결 theme projection과 호환 map

**Description:** 카탈로그 공개 조회 API에서 모든 출판 상태의 스타일을 받아 의미 토큰, 고정 CSS property 매핑, alias와 선택 효과를 동결 `ThemeDefinition`으로 투영한다. 기존 `THEME_TOKENS_MAP` 형태는 같은 투영에서 생성하며 직접 작성 토큰 literal을 새 모듈에 복사하지 않는다.

**Acceptance criteria:**

- [x] 13개 의미 키와 CSS property가 승인 순서로 일대일 대응하고 root fallback은 별도 동결 의미 토큰 상수로 존재한다.
- [x] canonical/alias 조회, 알 수 없는 값의 `null`, 모든 출판 상태의 order 후 ID 정렬과 재귀 불변성이 공개 API 테스트로 증명된다.
- [x] 파생 `THEME_TOKENS_MAP`이 24종 기준 해시와 세 unprefixed `backdrop-filter` 값을 유지하며 Swiss fallback이나 팩 직접 import가 없다.

**Verification:**

- [x] 새 projection·unknown·mutation 테스트의 red-green 확인
- [x] `npm test -- tests/themeGeneration.test.js`
- [x] `npm test -- tests/styleContract.test.js && npm test`

**Dependencies:** Task 2

**Files likely touched:**

- `src/theme/contract.js`
- `src/theme/projection.js`
- `src/theme/index.js`
- `tests/themeGeneration.test.js`

**Estimated scope:** Medium (4 files)

---

## Task 4: 결정론적 runtime stylesheet 직렬화

**Description:** root fallback과 동결 theme definitions를 순수 CSS 문자열로 직렬화한다. canonical 뒤 alias selector, 13개 선언, 선택 효과와 파일 끝 개행을 고정하고 현재 수동 CSS의 selector·선언 의미 기준선을 보존한다.

**Acceptance criteria:**

- [x] root 13개 fallback과 모든 canonical/alias 블록이 승인된 순서로 한 번씩 생성되고 같은 입력은 바이트 동일 결과를 낸다.
- [x] 세 효과 스타일만 표준 및 `-webkit-` blur 선언을 가지며 값은 `20px/14px/16px`이고 bento tweak 값에서 파생하지 않는다.
- [x] 기존 runtime CSS 의미 SHA-256을 유지하고 잘못된 definition을 교정하거나 첫 스타일로 대체하지 않는다.

**Verification:**

- [x] 최소 definition, alias, 효과, 반복 실행과 오류 경계의 red-green 테스트 확인
- [x] `npm test -- tests/themeGeneration.test.js`
- [x] 기존 `src/styles/themeTokens.css`를 파싱한 의미 기준선과 생성 결과 대조

**Dependencies:** Task 3

**Files likely touched:**

- `src/theme/stylesheet.js`
- `src/theme/index.js`
- `tests/themeGeneration.test.js`

**Estimated scope:** Medium (3 files)

---

## Task 5: 생성/check CLI와 prebuild 게이트

**Description:** 순수 직렬화 결과를 추적 CSS에 명시적으로 쓰거나 read-only로 비교하는 Node CLI를 추가한다. 현재 CSS를 생성 결과로 교체한 뒤 catalog 검증과 theme stale 검사가 모든 표준 Vite 빌드 전에 순서대로 실행되게 한다.

**Acceptance criteria:**

- [x] `generate:themes`는 UTF-8 LF·끝 개행의 CSS를 갱신하고 반복 실행이 idempotent이며 정상 write/check는 `0`이다.
- [x] `check:themes`는 파일 누락·stale에 복구 명령과 종료 코드 `1`, 알 수 없는 옵션·도구 실패에 `2`를 반환하며 파일을 수정하지 않는다.
- [x] `prebuild`가 `validate:catalog` 뒤 `check:themes`를 실행하고 생성 CSS는 기존 runtime 의미 기준선과 import 경로를 보존한다.

**Verification:**

- [x] 현재·stale·missing·unknown-option CLI 경로의 red-green 테스트 확인
- [x] `npm run generate:themes && npm run check:themes`
- [x] `npm run build && npm run check` 및 생성 전후 작업 트리 idempotence 확인

**Dependencies:** Task 4

**Files likely touched:**

- `scripts/generateThemeStyles.js`
- `src/styles/themeTokens.css`
- `package.json`
- `tests/themeGeneration.test.js`

**Estimated scope:** Medium (4 files)

---

## Checkpoint B: Canonical Runtime Theme Artifact

- [x] Tasks 3–5 acceptance criteria 충족
- [x] runtime CSS 의미 해시와 24 canonical/21 alias/3 effect 구조 유지
- [x] write/check 종료 코드, idempotence와 prebuild 순서 증명
- [x] 내보내기 경로의 기존 수동 map은 Task 6 전까지 호환 기준선으로만 유지
- [x] 전체 테스트·catalog 검증·Vite 빌드 통과

---

## Task 6: CSS/Markdown/DTCG 생성기의 정규 theme 소비 전환

**Description:** `designSpecGenerator.js`의 수동 24종 map을 제거하고 theme 공개 API를 소비하게 한다. 기존 export 이름은 파생 map의 재-export로 유지하고 세 생성기의 알 수 없는 ID를 명시적 미선택 결과로 통일한다.

**Acceptance criteria:**

- [x] `designSpecGenerator.js`에 24종 토큰 값 literal이 남지 않고 `THEME_TOKENS_MAP` 기존 import 경로와 정상 24종 호출은 계속 동작한다.
- [x] Live CSS 576개, Markdown 384개, DTCG 24개와 호환 map의 승인 SHA-256이 모두 유지된다.
- [x] null·unknown 객체는 각각 기존 미선택 CSS/Markdown/JSON을 반환하고 Swiss 토큰, 이름 또는 팔레트를 섞은 문서를 만들지 않는다.

**Verification:**

- [x] unknown fallback 제거와 전체 출력 행렬 테스트의 red-green 확인
- [x] `npm test -- tests/themeGeneration.test.js && npm test -- tests/designSpecGenerator.test.js`
- [x] `npm test -- tests/styleContract.test.js && npm run check`

**Dependencies:** Task 5

**Files likely touched:**

- `src/utils/designSpecGenerator.js`
- `tests/designSpecGenerator.test.js`
- `tests/styleContract.test.js`
- `tests/themeGeneration.test.js`

**Estimated scope:** Medium (4 files)

---

## Checkpoint C: Export Compatibility

- [x] Task 6 acceptance criteria 충족
- [x] 기존 24종 984개 export 조합과 호환 map 해시 유지
- [x] 정규 카탈로그 밖의 스타일별 토큰 값 literal 원천 제거
- [x] unknown/non-string ID에 Swiss fallback 없음
- [x] component/archetype HTML·CSS 계약과 DTCG 2025.10 구조 회귀 없음
- [x] `npm run check` 통과

---

## Task 7: 전체 회귀·Crostini Chrome 검증과 운영 문서

**Description:** 전체 자동 게이트와 실제 Google Chrome 사용자 흐름으로 정적 생성 전환이 렌더, 상태, 반응형과 내보내기를 바꾸지 않았음을 증명한다. 사용자가 새 토큰을 작성하고 stale CSS를 복구하는 명령과 구조를 운영 문서에 반영한다.

**Acceptance criteria:**

- [x] 프로덕션 번들에 Node CLI가 없고 catalog → theme → consumer 의존 방향, 생성 파일 import, bundle 크기 변화를 확인한다.
- [x] Chrome 151에서 대표 8종·세 효과 스타일의 canonical/alias 13개 computed token, blur `20/14/16px`, Detail/Split 상태 보존과 8개 Desktop/Mobile 전환이 통과한다.
- [x] README·BUILD_GUIDE·CHANGELOG·designs·구현 요약이 실제 명령, 생성 파일 소유권, 복구 절차와 검증 수치를 정확히 설명한다.

**Verification:**

- [x] `npm run check`, `git diff --check`와 브라우저 import graph/산출물 검사
- [x] Crostini Google Chrome 런타임 시나리오 및 console 오류 확인
- [x] 문서의 명령을 새 셸에서 순서대로 실행해 재현

**Dependencies:** Task 6

**Files likely touched:**

- `README.md`
- `BUILD_GUIDE.md`
- `CHANGELOG.md`
- `designs.md`
- `implementation_summary.md`

**Estimated scope:** Medium (5 files)

---

## Task 8: 사양·계약·ADR·역량 맵 완료 동기화

**Description:** 구현 결과를 모듈 사양, 기존 스타일 계약, 마스터 사양, Decision 013과 역량 맵에 반영한다. 승인 계획에서 달라진 선택이 있다면 이유와 호환 영향을 기록하며 후속 모듈은 시작 전 상태로 유지한다.

**Acceptance criteria:**

- [x] `SPEC-theme-generation.md`의 공개 API·명령·성공 조건이 실제 구현과 증거에 맞고 상태가 구현 완료로 전환된다.
- [x] `SPEC-style-contract.md`의 선택 효과 필드, `spec.md`의 단일 원천 계약과 Decision 013의 결과·대안·consequence가 일치한다.
- [x] `CAPABILITY_MAP.md`는 `theme-generation`만 COMPLETE로 올리고 `preview-registry` 이후 모듈은 기존 상태를 유지한다.

**Verification:**

- [x] 문서의 함수명·경로·명령·해시·테스트 수를 실제 저장소와 대조
- [x] `npm run check`
- [x] `git diff --check`와 문서 상태 검색

**Dependencies:** Task 7

**Files likely touched:**

- `SPEC-theme-generation.md`
- `SPEC-style-contract.md`
- `spec.md`
- `DESIGN_DECISIONS.md`
- `CAPABILITY_MAP.md`

**Estimated scope:** Medium (5 files)

---

## Task 9: 최종 감사와 완료 기록

**Description:** 승인 사양의 성공 조건, 모든 Task·Checkpoint와 프로젝트 Definition of Done을 독립 항목별로 대조한다. 감사 로드맵과 유의미한 교훈을 기록하고 비밀정보·임시 생성물·무관한 변경 없이 다음 모듈 검토가 가능한 상태로 닫는다.

**Acceptance criteria:**

- [x] 성공 조건 13개, Tasks 1–9, Checkpoints A–C와 Final Checkpoint가 구체적 명령·해시·Chrome 증거로 충족된다.
- [x] 민감정보, 임시 Chrome profile, 예상 밖 symlink·생성물, 중복 토큰 원천과 Node 전용 browser import가 없다.
- [x] 감사 기록·교훈·작업 상태가 실제 결과와 일치하고 다음 권장 모듈 및 남은 위험이 명시된다.

**Verification:**

- [x] 전체 명령 세트 재실행: 테스트, catalog 검증, theme check, build, check
- [x] `git diff --check`, `git status --short`, 민감정보·중복 원천·임시 파일 검색
- [x] 최종 문서·작업 체크리스트와 사용자 인수인계 검토

**Dependencies:** Task 8

**Files likely touched:**

- `audit_roadmap.md`
- `LESSONS_LEARNED.md` (유의미한 새 교훈이 있을 때)
- `tasks/plan.md`
- `tasks/todo.md`

**Estimated scope:** Medium (4 files)

---

## Final Checkpoint: `theme-generation` Complete

- [x] Tasks 1–9 완료
- [x] `SPEC-theme-generation.md` 성공 조건 13개 충족
- [x] 기존 24종 runtime CSS·호환 map·984개 export 조합 기준선 유지
- [x] catalog 오류 0·경고 56, theme 최신성, 전체 테스트와 Vite 빌드 통과
- [x] Crostini Google Chrome 151 실제 런타임 회귀 검증 통과
- [x] 생성 CSS 단일 원천, unknown 무음 폴백 제거와 후속 authoring 준비 완료
- [x] 사용자 검토 준비 완료
