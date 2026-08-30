# Task List: `catalog-expansion` Wave 1

> Archive note: 2026-08-30 `catalog-discovery` 작업 목록 착수 전에 완료 상태를 보존했다.

**Initiative:** `scalable-style-library`

**Source plan:** `tasks/plan.md` (`COMPLETE`)

**Source specification:** `SPEC-catalog-expansion.md` (`COMPLETE`)

**Task list status:** 구현·검증 완료 (`COMPLETE`)

**사양·계획·구현 지시일:** 2026-08-30

**완료일:** 2026-08-30

**Previous completed task list:** `tasks/archive/preview-registry-todo.md`

> 사용자의 “구현요” 지시를 승인된 사양의 계획·작업 분해와 순차 구현 전체에 대한 진행 승인으로 기록한다. Git commit·push·배포는 포함하지 않는다.

---

## Task 1: Wave 1 RED 계약 고정

**Description:** 기존 24종을 legacy subset fixture로 보존하면서 신규 12종 roster, 36종 총량, category 분포, ready 품질과 preview 참조 기대값을 실패 테스트로 먼저 고정한다.

**Acceptance criteria:**

- [x] 신규 12 canonical ID·category·preview ID와 기존 alias 비충돌 기대값이 테스트에 명시된다.
- [x] 기존 24 hash는 subset 기준으로 보존되고 공개 total은 36을 기대한다.
- [x] 구현 전 집중 테스트가 신규 레코드·참조 부재로 실패한다.

**Verification:**

- [x] `npm test -- tests/styleContract.test.js tests/catalogValidation.test.js`
- [x] 실패 원인이 승인된 Wave 1 미구현임을 기록한다.

**RED evidence:** 기존 41개 통과, 신규 계약 2개만 `actual 24 / expected 36`으로 실패 (`2026-08-30`).

**Dependencies:** None

**Files likely touched:**

- `tests/styleContract.test.js`
- `tests/catalogValidation.test.js`

**Estimated scope:** Small (2 files)

---

## Task 2: StyleRecord Batch A 작성

**Description:** Bauhaus Geometry, De Stijl, Flat Design 2.0, Constructivist의 완전한 ready 레코드를 신규 Wave 1 모듈에 작성한다.

**Acceptance criteria:**

- [x] 네 레코드가 13개 토큰, palette, 편집 메타데이터, 출처와 접근성 메모를 가진다.
- [x] 기본 text/textMuted 대비가 4.5:1 이상이고 레코드 단독 품질 이슈가 0이다.
- [x] `bauhaus-geometric` 기존 alias와 `bauhaus-geometry` 정규 ID가 충돌하지 않는다.

**Verification:**

- [x] 네 레코드 집중 테스트 RED→GREEN 확인
- [x] `npm test -- tests/styleContract.test.js`

**Dependencies:** Task 1

**Files likely touched:**

- `src/catalog/packs/core/styles-wave-1.js`
- `tests/styleContract.test.js`

**Estimated scope:** Medium (2 files)

---

## Task 3: StyleRecord Batch B 작성

**Description:** Punk Xerox Zine, Material Design, Liquid Glass, Art Deco의 완전한 ready 레코드를 같은 Wave 모듈에 추가한다.

**Acceptance criteria:**

- [x] 네 레코드의 출처·facet·토큰·palette·접근성 메모가 사양과 일치한다.
- [x] Liquid Glass는 불투명 기본 토큰으로 자동 대비를 통과하고 transparency 위험을 메모한다.
- [x] 네 레코드 단독 품질 이슈가 0이다.

**Verification:**

- [x] Batch B 집중 테스트 RED→GREEN 확인
- [x] `npm test -- tests/styleContract.test.js`

**Dependencies:** Task 2

**Files likely touched:**

- `src/catalog/packs/core/styles-wave-1.js`
- `tests/styleContract.test.js`

**Estimated scope:** Medium (2 files)

---

## Task 4: StyleRecord Batch C와 facet 사전 완성

**Description:** Psychedelic Poster, Art Nouveau, Risograph, Metro Interface를 작성하고 12종 분류에 필요한 lineage facet 값을 추가한다. public catalog는 preview 12종이 완성될 때까지 24종으로 유지한다.

**Acceptance criteria:**

- [x] 신규 12종 전체가 ready이며 비공개 레코드 단독 품질이 0/0이다.
- [x] 모든 classification 값이 확장된 facet 사전에 속하고 canonical·alias 충돌이 0이다.
- [x] 공개 catalog·manifest·registry는 아직 24종으로 정상 유지된다.

**Verification:**

- [x] `npm test -- tests/styleContract.test.js`
- [x] `npm run validate:catalog`

**Dependencies:** Task 3

**Files likely touched:**

- `src/catalog/packs/core/styles-wave-1.js`
- `src/catalog/facets.js`
- `tests/styleContract.test.js`

**Estimated scope:** Medium (3 files)

---

## Checkpoint A: Wave 1 data ready

- [x] 비공개 신규 ready 12종 오류·경고 0
- [x] 신규 canonical·preview ID와 기존 alias 충돌 0
- [x] 공개 catalog와 전체 자동 검증은 24종 기준으로 정상 유지

---

## Task 5: Renderer Batch A 구현

**Description:** Bauhaus, De Stijl, Flat Design, Constructivist의 `hero/widget/form/pricing` 고유 HTML을 구현하고 직접 definition 테스트를 추가한다.

**Acceptance criteria:**

- [x] 16개 출력이 `.mockup-unit` root와 각 스타일 고유 root class를 가진다.
- [x] 각 스타일의 네 탭이 서로 다른 정보 구조와 작동 가능한 control을 제공한다.
- [x] 사양의 차별화 guardrail에 어긋나는 Swiss/Organic/generic fallback이 없다.

**Verification:**

- [x] Batch A renderer 테스트 RED→GREEN 확인
- [x] `npm test -- tests/previewRegistry.test.js`

**Dependencies:** Checkpoint A

**Files likely touched:**

- `src/preview/renderers-wave-1.js`
- `tests/previewRegistry.test.js`

**Estimated scope:** Medium (2 files)

---

## Task 6: Renderer Batch B 구현

**Description:** Punk Zine, Material Design, Liquid Glass, Art Deco의 네 탭 고유 HTML을 추가한다.

**Acceptance criteria:**

- [x] 16개 출력이 서로 다른 구조적 motif와 현실적인 UI copy를 가진다.
- [x] 모든 보이는 control이 semantic element와 `data-mock-action`을 사용한다.
- [x] Glass는 제어 레이어에 제한되고 Material은 paper elevation 구조가 드러난다.

**Verification:**

- [x] Batch B renderer 테스트 RED→GREEN 확인
- [x] `npm test -- tests/previewRegistry.test.js`

**Dependencies:** Task 5

**Files likely touched:**

- `src/preview/renderers-wave-1.js`
- `tests/previewRegistry.test.js`

**Estimated scope:** Medium (2 files)

---

## Task 7: Renderer Batch C 구현

**Description:** Psychedelic, Art Nouveau, Risograph, Metro의 네 탭 HTML을 추가해 비공개 Wave 1 renderer definition 12개를 완성한다.

**Acceptance criteria:**

- [x] 신규 48개 Web 출력 전체가 비어 있지 않고 고유 root를 가진다.
- [x] 비공개 Wave 1 renderer ID 12개가 중복 없이 네 탭을 지원한다.
- [x] public renderer inventory와 기존 96개 component hash는 아직 24종 기준으로 유지된다.

**Verification:**

- [x] `npm test -- tests/previewRegistry.test.js`

**Dependencies:** Task 6

**Files likely touched:**

- `src/preview/renderers-wave-1.js`
- `tests/previewRegistry.test.js`

**Estimated scope:** Medium (2 files)

---

## Task 8: Thumbnail·Motion 12종 등록

**Description:** 12개 독립 thumbnail과 실제 구현 채널을 가진 motion descriptor를 비공개 Wave 1 definition으로 완성한다.

**Acceptance criteria:**

- [x] 썸네일 12개가 `thumbnailId` 직접 디스패치와 고유 `data-motif`를 사용한다.
- [x] 신규 motion 12개는 metadata-only가 아니며 실제 채널과 `suppress` 정책을 가진다.
- [x] 비공개 Wave 1 renderer/thumbnail/motion definition 수가 각각 12이며 asset은 0이다.

**Verification:**

- [x] thumbnail·motion 테스트 RED→GREEN 확인
- [x] `npm test -- tests/previewRegistry.test.js`

**Dependencies:** Task 7

**Files likely touched:**

- `src/preview/thumbnails-wave-1.js`
- `src/preview/motions-wave-1.js`
- `tests/previewRegistry.test.js`

**Estimated scope:** Medium (3 files)

---

## Task 9: Catalog·Preview 원자적 Core 36 연결

**Description:** 완성된 Wave 1 StyleRecord와 세 preview definition 배열을 core manifest, public catalog와 immutable registry에 동시에 조합한다. 공개 경계가 24에서 36으로 바뀌는 유일한 증분이다.

**Acceptance criteria:**

- [x] public catalog·manifest가 정확히 36종이며 category 합계가 36이다.
- [x] public preview inventory가 renderer/thumbnail/motion/asset `36/36/36/0`이다.
- [x] 전체 catalog validation은 오류 0, 기존 legacy 경고 56만 반환한다.

**Verification:**

- [x] Wave 1 최종 계약 테스트 RED→GREEN 확인
- [x] `npm test -- tests/styleContract.test.js tests/catalogValidation.test.js tests/previewRegistry.test.js`
- [x] `npm run validate:catalog`

**Dependencies:** Task 8

**Files likely touched:**

- `src/catalog/packs/core/manifest.js`
- `src/catalog/index.js`
- `src/preview/index.js`
- `tests/styleContract.test.js`
- `tests/catalogValidation.test.js`

**Estimated scope:** Medium (5 files)

---

## Checkpoint B: Public Core 36

- [x] inventory `36/36/36/0`
- [x] Web 144·thumbnail 36·total 180 출력 정상
- [x] 기존 24 × 5 subset hash 유지
- [x] 신규 motion 12개 실제 구현 증거 존재

---

## Task 10: Wave 1 CSS와 동적 개수 UI 연결

**Description:** 12종의 구조·thumbnail·motion·mobile CSS를 추가하고 헤더·상세 레이블·문서 metadata의 24 고정 개수를 36 실제 상태와 동기화한다.

**Acceptance criteria:**

- [x] 12종이 palette를 제거해도 구분되는 구조적 CSS motif를 가진다.
- [x] 320~1440px, `.desktop|.mobile`, focus-visible과 reduced-motion 규칙이 존재한다.
- [x] 헤더와 상세 UI는 카탈로그 배열 길이에서 36을 파생하고 접근성 레이블도 일치한다.

**Verification:**

- [x] `npm test -- tests/sandboxDeviceStyles.test.js tests/previewRegistry.test.js`
- [x] `rg -n "24종|24개 세부|전체 \(24종\)" src/components index.html`

**Dependencies:** Checkpoint B

**Files likely touched:**

- `src/styles/wave1-styles.css`
- `src/components/header.js`
- `src/components/detailView.js`
- `index.html`
- `tests/sandboxDeviceStyles.test.js`

**Estimated scope:** Medium (5 files)

---

## Task 11: Theme·Export·Archetype 전체 행렬 확장

**Description:** 생성 theme CSS와 디자인 사양 내보내기·8대 archetype 통합 테스트를 36종에 맞추되 기존 24 subset fingerprint를 보존한다.

**Acceptance criteria:**

- [x] 생성 theme가 36종이며 `check:themes`가 최신 상태를 확인한다.
- [x] 기존 24 export hash가 유지되고 신규 12종 출력은 결정론적 total fixture로 고정된다.
- [x] 36 × 8 Node 행렬과 device CSS 계약이 빈 출력 없이 통과한다.

**Verification:**

- [x] `npm run generate:themes`
- [x] `npm test -- tests/themeGeneration.test.js tests/designSpecGenerator.test.js tests/previewIntegration.test.js`
- [x] `npm run check`

**Verification evidence:** 집중 검증 22/22, 전체 Node 106/106, catalog 0/56, Vite production build 통과 (`2026-08-30`). CSS `none` 그림자는 DTCG 2025.10 형식의 투명 0 그림자로 정규화하고 회귀 테스트를 추가했다.

**Dependencies:** Task 10

**Files likely touched:**

- `src/styles/themeTokens.css`
- `tests/themeGeneration.test.js`
- `tests/designSpecGenerator.test.js`
- `tests/previewIntegration.test.js`

**Estimated scope:** Medium (4 files)

---

## Checkpoint C: Automated integration

- [x] 전체 Node 테스트 106/106 통과
- [x] catalog 오류 0·legacy 경고 56
- [x] generated theme 최신·Vite production build 통과
- [x] 288 archetype·576 device 계약 통과

---

## Task 12: Crostini Chrome 집중 QA와 표적 수정

**Description:** 격리 Linux Google Chrome에서 신규 12종의 대표 탭, 세 gallery mode, Detail, Split, Desktop/Mobile, 키보드와 reduced-motion을 우선 검증하고 발견된 원인만 표적 수정한다.

**Acceptance criteria:**

- [x] 신규 12종 모두 gallery thumbnail과 Detail Web hero를 실제 렌더한다.
- [x] 신규 12종의 Desktop/Mobile 폭·layout 차이와 320/375/414/768/1024/1440 반응형을 확인한다.
- [x] console/page/network 오류·경고와 문서 수준 가로 스크롤이 0이다.

**Verification:**

- [x] 격리 Chrome profile과 임시 Vite server로 screenshot·DOM·computed style·진단 증거 기록
- [x] 수정이 있으면 관련 표적 테스트와 `npm run check` 재실행

**Verification evidence:** Google Chrome `151.0.7922.173`, gallery 3/3 mode, 320/375/414/768/1024/1440, Core 36 × 8 × Desktop/Mobile 576/576상태, 신규 detail 12/12, visible control 경계 이탈 0, Split·reduced-motion 통과, console/page/network/HTTP/가로 overflow 0. `.antigravity/archive/wave1-chrome-qa/report.json`과 대표 screenshot 5장에 기록 (`2026-08-30`). Flat thumbnail의 중첩 `<button>` DOM 파손을 비인터랙티브 표지로 수정하고 전체 thumbnail 금지 계약을 추가했다.

**Dependencies:** Checkpoint C

**Files likely touched:**

- 발견 원인에 직접 관련된 최대 5개 source/test 파일

**Estimated scope:** Medium (finding-dependent, 최대 5 files)

---

## Task 13: 사용자·설계 문서 동기화

**Description:** 실제 36종 사용자 가치, 작성·복구 절차, 카테고리와 시각·접근성 구조를 사용자·설계 문서에 반영한다.

**Acceptance criteria:**

- [x] README와 BUILD_GUIDE가 36종 실제 사용·저작·검증 명령을 설명한다.
- [x] designs와 DESIGN_DECISIONS가 Wave 1 module·CSS·responsive·motion 경계를 기록한다.
- [x] CHANGELOG가 12종 추가와 24→36 사용자 가치를 `Added/Changed`에 기록한다.

**Verification:**

- [x] 문서의 count·경로·명령을 실제 코드와 대조
- [x] `git diff --check`

**Dependencies:** Task 12

**Files likely touched:**

- `README.md`
- `BUILD_GUIDE.md`
- `designs.md`
- `DESIGN_DECISIONS.md`
- `CHANGELOG.md`

**Estimated scope:** Medium (5 files)

---

## Task 14: 권위·감사·인수인계 상태 전환

**Description:** 구현 결과와 실제 검증 수치로 사양, capability status, 구현 요약, 감사 로드맵과 교훈을 완료 상태로 동기화한다.

**Acceptance criteria:**

- [x] `SPEC-catalog-expansion.md` Wave 1 성공 조건이 증거와 연결되고 상태가 COMPLETE다.
- [x] master spec과 capability map이 실제 36종 및 다음 필수 모듈을 정확히 표시한다.
- [x] 인수인계·감사·교훈 문서가 경로, 위험과 복구 절차를 기록한다.

**Verification:**

- [x] 실제 export/count/test/browser 수치와 문서 숫자 대조
- [x] `git diff --check`

**Dependencies:** Task 13

**Files likely touched:**

- `SPEC-catalog-expansion.md`
- `spec.md`
- `CAPABILITY_MAP.md`
- `implementation_summary.md`
- `audit_roadmap.md`

**Estimated scope:** Medium (5 files)

---

## Task 15: 최종 감사와 Wave 1 인계

**Description:** 전체 자동 게이트, 실제 Chrome 36종 행렬의 완료 기준, 비밀·임시 자원·fallback·중복을 감사하고 plan/todo를 완료 상태로 전환한다.

**Acceptance criteria:**

- [x] `npm run check`, catalog 0/56, inventory 36/36/36/0와 Chrome 진단 0이 통과한다.
- [x] 임시 서버·격리 profile·listener가 정리되고 사용자 기본 Chrome은 보존된다.
- [x] Wave 1만 완료로 인계하며 Wave 2는 시작하지 않는다.

**Verification:**

- [x] `npm run check`
- [x] `git diff --check`
- [x] secret pattern, symlink, runtime binary asset, preview fallback, 임시 process 감사

**Final evidence:** Node 106/106, catalog 0/56, ready 12 품질 0/0, theme current, Vite 45 modules, JavaScript `339.13 kB` (`93.49 kB` gzip), CSS `160.72 kB` (`30.77 kB` gzip). Chrome report는 responsive 6/6, device 576/576, issue 0, diagnostics 0이다. 비밀 패턴·프로젝트 symlink·runtime binary asset·Wave 1 임시 process/profile은 0건이며 QA PNG 5장은 승인된 project-local 증거다.

**Dependencies:** Task 14

**Files likely touched:**

- `tasks/plan.md`
- `tasks/todo.md`
- 필요 시 `LESSONS_LEARNED.md`

**Estimated scope:** Small (2~3 files)

---

## Final Checkpoint: Wave 1 Complete

- [x] 실제 사용자 카탈로그 36종
- [x] 신규 12종 ready 품질·고유 preview·접근성 완료
- [x] 기존 24 subset 호환 완료
- [x] 자동·Crostini Chrome 검증 완료
- [x] 문서와 실제 상태 동기화 완료
- [x] Wave 2 미착수
