# Task List: `catalog-validation`

**Initiative:** `scalable-style-library`

**Source plan:** `tasks/plan.md` (`APPROVED / COMPLETE`)

**Source specification:** `SPEC-catalog-validation.md` (`IMPLEMENTED`)

**작성일:** 2026-08-30

**계획 승인일:** 2026-08-30

**구현 완료일:** 2026-08-30

**Previous completed task list:** `tasks/archive/style-contract-todo.md`

> 이 목록은 2026-08-30에 승인되었으며 Task 1부터 순차 실행한다. 진행 중 상태 기록을 위한 `tasks/plan.md`와 `tasks/todo.md` 자체의 갱신은 아래 파일 규모 산정에서 제외한다.

---

## Task 1: 진단 보고 계약 기반

**Description:** 재사용 가능한 최소 유효 카탈로그 fixture를 만들고, 진단 이슈의 정렬·요약·재귀 동결, 사람용 포매터와 `CatalogValidationError` 계약을 실패 테스트부터 고정한다. 보고서 계층은 카탈로그 규칙이나 프로세스 종료를 알지 못한다.

**Acceptance criteria:**

- [x] 순서를 뒤섞은 같은 이슈 입력이 severity/path/code/relatedPath 기준으로 동일한 동결 보고서를 만든다.
- [x] summary와 `valid`, `CatalogValidationError.report`, compact/verbose 텍스트 출력이 사양 계약과 일치하며 ANSI 제어문자에 의존하지 않는다.
- [x] 최소 유효 snapshot fixture와 단일 필드 손상 helper가 후속 규칙 테스트에서 재사용 가능하고 원본 fixture를 변형하지 않는다.

**Verification:**

- [x] 새 테스트가 구현 전 실패하고 최소 구현 후 통과함을 확인한다.
- [x] `npm test -- tests/catalogValidation.test.js`
- [x] 보고서와 중첩 issues/summary의 mutation 시도가 원본을 바꾸지 못하는지 확인한다.

**Dependencies:** None

**Files likely touched:**

- `src/catalog/validation/report.js`
- `src/catalog/validation/index.js`
- `tests/catalogValidation.test.js`

**Estimated scope:** Medium (3 files)

---

## Task 2: 루트 검증·공개 경계

**Description:** `validateCatalog()`과 `assertValidCatalog()`의 공개 경계를 만들고 잘못된 루트, 필수 컬렉션, 스키마 버전과 참조 인벤토리를 구조화된 오류로 보고한다. 예상 가능한 데이터 오류는 던지지 않고 보고서에 모으며 strict 승격만 assertion 경계에서 처리한다.

**Acceptance criteria:**

- [x] 잘못된 입력은 `CATALOG_INPUT_INVALID`, `SCHEMA_VERSION_MISMATCH`, `REFERENCE_INVENTORY_MISSING`의 안정 code/path/entity로 보고되고 가능한 형제 컬렉션 검사는 계속된다.
- [x] `validateCatalog()`은 데이터 문제로 예외를 던지지 않으며 `assertValidCatalog()`은 오류 또는 `failOnWarnings: true` 경고에만 동결 보고서를 가진 오류를 던진다.
- [x] 검증 전후 snapshot의 깊은 값과 배열 순서가 동일하고 공개 export가 승인된 함수·오류 계약을 제공한다.

**Verification:**

- [x] `npm test -- tests/catalogValidation.test.js`
- [x] `npm test`
- [x] `npm run build`

**Dependencies:** Task 1

**Files likely touched:**

- `src/catalog/validation/index.js`
- `src/catalog/validation/rules.js`
- `tests/catalogValidation.test.js`

**Estimated scope:** Medium (3 files)

---

## Checkpoint A: Diagnostic Contract

- [x] Tasks 1–2 acceptance criteria 충족
- [x] 집중 테스트, 기존 전체 테스트와 Vite 빌드 통과
- [x] 공개 진단 필드·정렬·불변성 계약 검토 완료
- [x] 클라이언트 소스에 validation 모듈 import가 없음

---

## Task 3: 레코드·토큰 규칙

**Description:** category, facet, style, pack의 필수 필드·타입·ID·order·schemaVersion과 스타일 토큰·팔레트·기본 트윅 규칙을 구현한다. CSS 검사는 승인된 기본 문법만 보수적으로 판별한다.

**Acceptance criteria:**

- [x] 필드 누락·타입·ID 형식·order·schemaVersion 손상 fixture가 각각 승인된 구조 오류를 내고 다른 유효 레코드는 계속 검사된다.
- [x] 13개 필수 토큰, 알 수 없는 토큰 경고와 색상/dimension/문자열 기본 문법이 `TOKEN_REQUIRED`, `TOKEN_VALUE_INVALID`, `TOKEN_UNKNOWN`으로 구분된다.
- [x] 팔레트 지역화·ID·값·usage와 5개 0 이상 유한 트윅 값의 오류가 안정 경로로 보고된다.

**Verification:**

- [x] 각 오류 코드에 대응하는 단일 손상 fixture의 red-green 결과 확인
- [x] `npm test -- tests/catalogValidation.test.js`
- [x] `npm test`

**Dependencies:** Task 2

**Files likely touched:**

- `src/catalog/validation/rules.js`
- `tests/catalogValidation.test.js`

**Estimated scope:** Small (2 files)

---

## Task 4: 관계·참조 불변조건

**Description:** 정규 ID와 alias 공간, category·facet·pack 소속, 시대 범위, preview와 asset 인벤토리 관계를 교차 검증한다. 누락 참조를 다른 스타일로 대체하지 않고 원래 경로와 관련 경로를 함께 보고한다.

**Acceptance criteria:**

- [x] ID/alias 중복·충돌, 알 수 없는 category, pack의 누락·중복 스타일과 스타일의 0/2중 팩 소속이 각각 승인된 오류 코드를 낸다.
- [x] classification 값이 대응 facet 어휘와 일치하고 잘못된 값 또는 `era.start > era.end`가 안정 경로의 오류가 된다.
- [x] renderer/thumbnail/motion/asset 누락과 절대·URL·`..` asset 경로가 오류가 되며 유효 프로젝트 상대 경로는 통과한다.

**Verification:**

- [x] 관계별 단일 손상 fixture와 다중 오류 수집 테스트 통과
- [x] `npm test -- tests/catalogValidation.test.js`
- [x] `npm run build`

**Dependencies:** Task 3

**Files likely touched:**

- `src/catalog/validation/rules.js`
- `tests/catalogValidation.test.js`

**Estimated scope:** Small (2 files)

---

## Task 5: 출처·접근성 정책

**Description:** source와 asset 출처 메타데이터, 출판 상태별 요구 수준, 불투명 단색 대비 계산과 계산 불가 경고를 구현한다. 법적 진위나 외부 URL 가용성은 검사하지 않는다.

**Acceptance criteria:**

- [x] URL scheme, 날짜, sourceType, 중복 URL, asset owner/license/source와 외부 asset URL 요구가 승인된 출처·에셋 코드로 구분된다.
- [x] source·신뢰 source·접근성 메모 누락과 계산 가능한 저대비가 `legacy/draft/review`에서는 warning, `ready`에서는 error로 전환된다.
- [x] 불투명 단색의 4.5:1 경계가 테스트되고 gradient·alpha·파싱 불가 값은 `CONTRAST_UNCHECKED` warning이며 파생 중복 진단이 억제된다.

**Verification:**

- [x] publicationStatus별 동일 fixture severity 표 테스트 통과
- [x] `npm test -- tests/catalogValidation.test.js`
- [x] `npm test`

**Dependencies:** Task 4

**Files likely touched:**

- `src/catalog/validation/rules.js`
- `tests/catalogValidation.test.js`

**Estimated scope:** Small (2 files)

---

## Checkpoint B: Validation Rules

- [x] Tasks 3–5 acceptance criteria 충족
- [x] 사양의 구조·관계·참조·출처·접근성 진단 코드가 손상 fixture로 증명됨
- [x] 이슈 순서가 fixture 배열·객체 키 순서와 무관함
- [x] `npm test`와 `npm run build` 통과

---

## Task 6: 현재 카탈로그 어댑터

**Description:** 정규 공개 조회 API와 임시 참조 인벤토리로 현재 `CatalogSnapshot`을 조립하고 `validateCurrentCatalog()`을 제공한다. 현재 legacy 부채는 숨기지 않고 코드별 경고 기준선으로 기록한다.

**Acceptance criteria:**

- [x] snapshot은 공개 조회 API만 사용해 schema v1, 카테고리 8개, 스타일 24개, facet 10개, 팩 1개와 필수 `ReferenceInventory`를 포함한다.
- [x] 임시 renderer/thumbnail/motion/asset ID가 현재 24종 참조를 정확히 허용하며 미등록 ID를 추가한 fixture는 오류가 된다.
- [x] 현재 카탈로그는 오류 0개로 유효하고 실제 측정한 경고 총수와 코드별 개수가 명시적 통합 기준선으로 고정된다.

**Verification:**

- [x] `npm test -- tests/catalogValidation.test.js`
- [x] 공개 API만 사용한 snapshot 개수와 동결 상태 확인
- [x] `validateCurrentCatalog()` 보고서의 오류 0개·경고 기준선 확인

**Dependencies:** Task 5

**Files likely touched:**

- `src/catalog/validation/currentCatalog.js`
- `src/catalog/validation/legacyReferenceInventory.js`
- `src/catalog/validation/index.js`
- `tests/catalogValidation.test.js`

**Estimated scope:** Medium (4 files)

---

## Task 7: CLI·prebuild 게이트

**Description:** 현재 카탈로그 검증을 실행하는 Node CLI를 추가하고 compact/verbose/JSON/strict 모드와 종료 코드 0/1/2를 구현한다. `package.json`의 `prebuild`로 모든 표준 Vite 빌드 전에 기본 검증을 실행한다.

**Acceptance criteria:**

- [x] 기본 출력은 모든 오류와 코드별 경고 개수·대표 경로를, `--verbose`는 모든 경고 경로를, `--json`은 보고서 JSON만 stdout에 결정론적으로 출력한다.
- [x] 현재 카탈로그 기본 모드는 `0`, strict는 legacy 경고 때문에 `1`, 알 수 없는 옵션과 내부 실패는 `2`이며 내부 실패 설명은 stderr로 간다.
- [x] `validate:catalog`와 `prebuild`가 연결되어 `npm run build`에서 검증이 Vite보다 먼저 실행되고 오류 fixture 경로는 빌드를 차단한다.

**Verification:**

- [x] `npm test -- tests/catalogValidation.test.js` (24/24 통과)
- [x] `npm run validate:catalog`, `--json`, `--verbose`가 기대 종료 코드 `0`으로 실행됨
- [x] `--strict`의 기대 종료 코드 `1`과 `npm run build`·`npm run check` 통과 확인

**Dependencies:** Task 6

**Files likely touched:**

- `scripts/validateCatalog.js`
- `package.json`
- `tests/catalogValidation.test.js`

**Estimated scope:** Medium (3 files)

---

## Checkpoint C: Current Catalog Build Gate

- [x] Tasks 6–7 acceptance criteria 충족
- [x] 현재 카탈로그 오류 0개·경고 56개(`ACCESSIBILITY_NOTES_REQUIRED` 24, `SOURCE_REQUIRED` 24, `CONTRAST_LOW` 5, `CONTRAST_UNCHECKED` 3) 기준선 기록
- [x] CLI 종료 코드 0/1/2와 compact/verbose/JSON 출력 검증
- [x] `npm run build`가 prebuild를 먼저 실행하고 `npm run check` 49/49 통과

---

## Task 8: 전체 회귀·런타임 증명

**Description:** 전체 자동 게이트와 Crostini Linux Google Chrome 사용자 흐름을 재검증해 Node 전용 빌드 검증이 런타임 UI, 저장 데이터, 내보내기와 반응형 프리뷰를 바꾸지 않았음을 증명한다. 확인된 사용자 명령과 릴리스 가치를 문서화한다.

**Acceptance criteria:**

- [x] 전체 테스트·기본 검증·prebuild·Vite 빌드가 통과하고 검증 모듈이 클라이언트 import 그래프와 프로덕션 JS 번들에 포함되지 않는다.
- [x] Grid/Bento/Spectrum, Detail, Split, 저장 복원, CSS/HTML/Markdown/DTCG와 8개 아키타입의 Desktop 786–822px → Mobile 380px 상한(가시 368–380px) 전환이 실제 Chrome에서 구분된다.
- [x] README 명령, CHANGELOG 사용자 영향, 구현 요약과 감사 검증 근거가 실제 결과와 일치한다.

**Verification:**

- [x] `npm run check` 49/49와 `git diff --check`
- [x] ChromeOS Crostini Linux Google Chrome 151 회귀 시나리오 완료
- [x] 빌드 산출물·소스 import 검색으로 validation 모듈의 브라우저 비포함 확인

**Dependencies:** Task 7

**Files likely touched:**

- `README.md`
- `CHANGELOG.md`
- `implementation_summary.md`
- `audit_roadmap.md`

**Estimated scope:** Medium (4 files)

---

## Task 9: 완료 문서 동기화

**Description:** 구현과 검증 결과를 승인 사양, 마스터 사양, ADR, 기능 맵과 작업 상태에 반영한다. 구현되지 않은 후속 모듈을 완료로 올리지 않고 계획에서 달라진 선택이 있으면 근거를 기록한다.

**Acceptance criteria:**

- [x] `SPEC-catalog-validation.md` 성공 조건 11개가 검증 증거와 함께 완료되고 공개 함수·명령·severity·경고 기준선이 실제 구현과 일치한다.
- [x] Decision 012의 결과, 마스터 사양, 기능 맵과 Phase 4B 상태가 서로 일치하며 다음 모듈은 승인 전 상태로 남는다.
- [x] 모든 Task·Checkpoint·Definition of Done 결과가 기록되고 비밀정보·불필요한 생성물·무관한 변경이 없다.

**Verification:**

- [x] 문서의 경로·명령·개수·상태를 실제 저장소와 대조
- [x] `npm run check` 49/49
- [x] `git diff --check`, `git status --short`와 민감정보 패턴 확인

**Dependencies:** Task 8

**Files likely touched:**

- `SPEC-catalog-validation.md`
- `spec.md`
- `DESIGN_DECISIONS.md`
- `CAPABILITY_MAP.md`
- `audit_roadmap.md`

**Estimated scope:** Medium (5 files; 작업 상태 문서 제외)

---

## Final Checkpoint: `catalog-validation` Complete

- [x] Tasks 1–9 완료
- [x] `SPEC-catalog-validation.md` 성공 조건 11개 충족
- [x] 현재 24종 오류 0개·경고 56개 기준선과 CLI 종료 코드 계약 확인
- [x] `npm run check` 49/49와 Crostini Google Chrome 151 회귀 검증 통과
- [x] 기존 정규 ID·alias·저장 데이터·UI·내보내기 호환성 유지
- [x] 사용자 검토 준비 완료
