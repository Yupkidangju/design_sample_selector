# Task List: `style-contract`

**Plan:** `tasks/plan.md`

**Status:** 완료 (`COMPLETE`)

**승인일:** 2026-08-30

**완료일:** 2026-08-30

**작성일:** 2026-08-30

---

## Task 1: 기존 24종 계약 특성화 테스트

**Description:** 새 구조를 만들기 전에 현재 8개 카테고리, 24개 정규 ID, alias, 정렬 순서와 레거시 필드 형태를 테스트로 고정한다. 이 작업은 런타임 소스를 변경하지 않는다.

**Acceptance criteria:**

- [x] 8개 카테고리와 24개 정규 ID의 순서가 fixture로 고정된다.
- [x] 기존 alias 전체가 예상 정규 ID로 해석된다.
- [x] 현재 `SubCategoryDesign` 필수 필드와 카테고리 파생 필드가 검사된다.

**Verification:**

- [x] `npm test -- tests/styleContract.test.js`
- [x] `npm test`
- [x] 런타임 소스 diff가 없는지 확인

**Dependencies:** 없음

**Files likely touched:**

- `tests/styleContract.test.js`

**Estimated scope:** Small (1 file)

---

## Task 2: 계약 상수·카테고리·facet 정의

**Description:** 승인된 스키마 버전, enum, ID 패턴, 재귀 동결 도우미, 8개 카테고리와 facet 사전을 구현한다. 새 테스트를 먼저 실패시킨 뒤 최소 구현으로 통과시킨다.

**Acceptance criteria:**

- [x] `CATALOG_SCHEMA_VERSION`, 출판 상태, 분류 enum과 ID 규칙이 사양과 일치한다.
- [x] 카테고리와 facet 정의가 명시적 `order` 후 ID 순서로 결정된다.
- [x] 반환된 정의의 중첩 값은 외부에서 변경할 수 없다.

**Verification:**

- [x] `npm test -- tests/styleContract.test.js`
- [x] `npm run build`
- [x] 카테고리·facet 조회 결과를 Node에서 확인

**Dependencies:** Task 1

**Files likely touched:**

- `src/catalog/contract.js`
- `src/catalog/categories.js`
- `src/catalog/facets.js`
- `tests/styleContract.test.js`

**Estimated scope:** Medium (4 files)

---

## Checkpoint A: Contract Foundation

- [x] Tasks 1–2 acceptance criteria 충족
- [x] `npm run check`
- [x] 기존 애플리케이션 동작과 번들 결과에 변화 없음
- [x] 다음 데이터 이전 범위 재확인

---

## Task 3: Core 전반 12종 정규 레코드 이전

**Description:** Swiss, Brutalism, Depth, Retro의 12종을 새 `StyleRecord` 형태로 이전한다. 기존 설명·팔레트·트윅·모션과 내보내기 토큰 값을 손실 없이 포함한다.

**Acceptance criteria:**

- [x] 전반 4개 카테고리의 12개 정규 ID와 alias가 보존된다.
- [x] 각 레코드가 13개 토큰, 3개 프리뷰 참조, 분류·편집·출처 구조를 가진다.
- [x] 레거시 값과 팔레트·트윅·모션·토큰 parity가 테스트된다.

**Verification:**

- [x] `npm test -- tests/styleContract.test.js`
- [x] `npm run build`
- [x] 12개 레코드의 정규 ID와 필수 필드 수를 Node에서 확인

**Dependencies:** Task 2

**Files likely touched:**

- `src/catalog/packs/core/styles-foundations.js`
- `tests/styleContract.test.js`

**Estimated scope:** Medium (2 files, data-heavy)

---

## Task 4: Core 후반 12종 정규 레코드 이전

**Description:** Editorial, Y2K, Hypertech, Soft 3D의 12종을 새 계약으로 이전하고 기존 `bauhaus-geometric`을 포함한 alias 의미를 보존한다.

**Acceptance criteria:**

- [x] 후반 4개 카테고리의 12개 정규 ID와 alias가 보존된다.
- [x] 각 레코드가 13개 토큰, 3개 프리뷰 참조, 분류·편집·출처 구조를 가진다.
- [x] `bauhaus-geometric`이 새 정규 ID로 재사용되지 않고 `fluid-organic`을 계속 해석한다.

**Verification:**

- [x] `npm test -- tests/styleContract.test.js`
- [x] `npm run build`
- [x] 12개 레코드의 정규 ID와 필수 필드 수를 Node에서 확인

**Dependencies:** Task 2

**Files likely touched:**

- `src/catalog/packs/core/styles-contemporary.js`
- `tests/styleContract.test.js`

**Estimated scope:** Medium (2 files, data-heavy)

---

## Task 5: Core manifest와 공개 조회 API 조립

**Description:** 두 데이터 묶음을 하나의 버전된 `core` 팩으로 조립하고 정규 카탈로그 조회 API를 제공한다. 이 단계까지 기존 UI는 아직 레거시 진입점을 사용한다.

**Acceptance criteria:**

- [x] 기본 조회가 정확히 8개 카테고리와 24개 `legacy` 스타일을 반환한다.
- [x] ID·alias 조회, 카테고리 조회, 팩 조회와 순서가 결정론적으로 동작한다.
- [x] `includeUnpublished` 기본값과 명시적 opt-in 동작이 계약과 일치한다.

**Verification:**

- [x] `npm test -- tests/styleContract.test.js`
- [x] `npm run build`
- [x] 공개 API만 사용해 24종 카탈로그 통계를 출력해 확인

**Dependencies:** Tasks 3, 4

**Files likely touched:**

- `src/catalog/packs/core/manifest.js`
- `src/catalog/index.js`
- `tests/styleContract.test.js`

**Estimated scope:** Medium (3 files)

---

## Checkpoint B: Canonical Core Pack

- [x] Tasks 3–5 acceptance criteria 충족
- [x] 새 공개 API 기준 8개 카테고리·24개 스타일·24개 프리뷰·24개 토큰 확인
- [x] `npm run check`
- [x] 기존 UI는 아직 변경 없이 동작

---

## Task 6: 레거시 어댑터와 기존 import 경로 cutover

**Description:** 새 레코드를 현재 `MAIN_CATEGORIES`, `STYLE_MOTION`, `getAllSubDesigns`, `findSubById`, `canonicalizeSubId` 계약으로 투영하고 기존 `src/data/categories.js`를 호환 진입점으로 전환한다.

**Acceptance criteria:**

- [x] 기존 named export와 평면 `SubCategoryDesign` 필드가 모두 유지된다.
- [x] 기존 컴포넌트와 상태 모듈의 import 경로를 바꾸지 않고 새 카탈로그를 사용한다.
- [x] 북마크·확정·최근 본 스타일의 정규화 결과가 기존과 동일하다.

**Verification:**

- [x] `npm test -- tests/styleContract.test.js`
- [x] `npm run check`
- [x] Grid와 Detail을 열어 24종 이름·썸네일·팔레트를 Chrome에서 확인 (Task 9)

**Dependencies:** Task 5

**Files likely touched:**

- `src/catalog/legacyAdapter.js`
- `src/data/categories.js`
- `tests/styleContract.test.js`

**Estimated scope:** Medium (3 files)

---

## Task 7: 불변성·출판 상태·경계 오류 의미 강화

**Description:** 공개 레코드의 재귀 불변성, 안정 정렬, 잘못된 외부 ID 처리와 비공개 스타일 필터를 적대적 테스트로 검증하고 필요한 최소 구현을 보강한다.

**Acceptance criteria:**

- [x] 공개 배열·객체·중첩 값의 mutation 시도가 정규 카탈로그를 변경하지 못한다.
- [x] 비문자열·미등록·오래된 ID는 예외 없이 `null` 또는 빈 배열로 처리된다.
- [x] `draft/review`는 기본 조회에서 숨겨지고 명시적 opt-in에서만 반환된다.

**Verification:**

- [x] `npm test -- tests/styleContract.test.js`
- [x] `npm run check`
- [x] Swiss 자동 폴백이 새 조회 API에 존재하지 않는지 검색 확인

**Dependencies:** Task 6

**Files likely touched:**

- `src/catalog/contract.js`
- `src/catalog/index.js`
- `tests/styleContract.test.js`

**Estimated scope:** Medium (3 files)

---

## Checkpoint C: Compatibility Cutover

- [x] Tasks 6–7 acceptance criteria 충족
- [x] 기존 전체 테스트와 생성기 테스트 통과
- [x] `npm run build` 통과
- [x] 기존 24종 사용자 흐름에서 회귀 없음

---

## Task 8: 계약·설계·감사 문서 동기화

**Description:** 실제 구현 결과에 맞춰 모듈 상태, 마스터 사양, 설계 결정, UI 구조 설명과 감사 기준을 동기화한다. 계획과 다른 구현 선택이 있었다면 이유를 기록한다.

**Acceptance criteria:**

- [x] `SPEC-style-contract.md`의 상태와 실제 공개 인터페이스가 일치한다.
- [x] 마스터 사양·설계 문서·ADR·감사 기준이 새 카탈로그 경계를 설명한다.
- [x] 아직 구현되지 않은 후속 모듈을 완료된 기능처럼 표현하지 않는다.

**Verification:**

- [x] 문서의 경로·명령·개수와 실제 저장소 대조
- [x] `git diff --check`
- [x] `npm run check`

**Dependencies:** Task 7

**Files likely touched:**

- `SPEC-style-contract.md`
- `spec.md`
- `DESIGN_DECISIONS.md`
- `designs.md`
- `audit_roadmap.md`

**Estimated scope:** Medium (5 files)

---

## Task 9: 전체 회귀와 Chrome 런타임 검증

**Description:** 자동 게이트와 Crostini Chrome 사용자 흐름을 최종 검증하고 README·CHANGELOG·작업 상태를 실제 결과와 동기화한다.

**Acceptance criteria:**

- [x] Grid/Bento/Spectrum, Detail, Split과 저장 복원 흐름이 기존과 동일하게 동작한다.
- [x] CSS/HTML/Markdown/DTCG 내보내기가 선택한 스타일 및 24종 토큰 계약과 일치한다.
- [x] 모든 Task와 Definition of Done 근거가 기록되고 다음 모듈이 `catalog-validation`으로 지정된다.

**Verification:**

- [x] `npm run check` — 25 tests passed, production build passed
- [x] ChromeOS Crostini Linux Chrome 수동/자동 브라우저 시나리오 완료
- [x] `git diff --check` 및 비밀정보·불필요한 생성물 확인

**Dependencies:** Task 8

**Files likely touched:**

- `README.md`
- `CHANGELOG.md`
- `tasks/todo.md`

**Estimated scope:** Medium (3 files)

---

## Final Checkpoint: `style-contract` Complete

- [x] Tasks 1–9 완료
- [x] `SPEC-style-contract.md` 성공 조건 전부 충족
- [x] `npm run check` 통과
- [x] 실제 Chrome 런타임 검증 완료
- [x] 기존 24종과 저장 데이터 호환성 확인
- [x] 사용자 검토 준비 완료

## 최종 검증 기록

- 자동화: `npm run check`에서 25/25 테스트와 Vite 6 프로덕션 빌드 통과
- 카탈로그: 8개 카테고리, 24개 정규 스타일, 21개 alias, 10개 facet, 스타일당 13개 토큰·3개 프리뷰 참조 확인
- Chrome: 3개 갤러리 보기, 상세의 24개 스타일·8개 아키타입·4개 인스펙터 탭·3개 CSS 모드, Split의 8개 탭과 A/B 각 24개 선택지 확인
- 반응형: 모든 아키타입에서 Desktop `788px`, Mobile `380px` 렌더 폭과 모드 클래스 확인
- 저장: 북마크 UI 저장/새로고침 복원/정리 확인; 기존 alias가 포함된 북마크·확정·최근 목록은 격리 저장소 테스트로 정규화 확인
- 다음 모듈: `catalog-validation`은 사양 승인 전 구현하지 않는다.
