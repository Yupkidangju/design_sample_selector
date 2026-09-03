# D3D 감사보고서 — Gemini 리팩터링 검증

## 0. 문서 정보

| 항목 | 값 |
| --- | --- |
| 감사 대상 | `design_sample_selector` 작업 폴더의 미커밋 변경 |
| 비교 기준 | GitHub `Yupkidangju/design_sample_selector` `main` |
| 기준 커밋 | `0fc6866a5fb5c8261a5c3bc82882ef0d71bc2079` |
| 감사 일자 | 2026-09-03 |
| 실행 환경 | Linux, Node.js `v22.23.2`, npm `10.9.8`, Chrome `152.0.7977.75` |
| 감사 표준 | `AI_AUDIT_DOC_STANDARD.md`, `AGENTS.md` D3D Protocol |
| 최종 판정 | **REWORK REQUIRED — 배포 HOLD** |

이 보고서는 현재 작업 폴더의 Git 기준 커밋과 미커밋 리팩터링 변경을 비교해 구현 정합성, 엔지니어링 품질, 보안 영향을 평가한다. 코더용 수정 지시는 `docs/REFACTORING_CODER_HANDOFF.md`에 분리했다.

### 작업 공간 경계

- 유일한 작업 대상: `/home/eunho1/Projects/web/design_sample_selector`
- 보호 대상·범위 외: `/home/eunho1/Projects/web/design_sample_selector`
- 감사 과정에서 보호 대상 로컬 폴더를 읽거나 수정하거나 그 안에서 명령을 실행하지 않았다.
- 비교 기준은 대상 폴더 자체의 Git 기준 커밋과 `/tmp`의 일시적 검증 산출물이다.

## 1. 감사 요약

리팩터링본에는 눈으로 확인 가능한 부분 개선이 있다. 메인 갤러리에 카테고리 특성 pill과 `선택 →` CTA가 추가됐고, Swiss·Y2K·Brutalism·Hypertech의 일부 Game·Media·Chat 미리보기가 더 뚜렷해졌다. 5개 언어의 일부 UI 용어도 실무 표현에 가깝게 바뀌었다.

그러나 변경 전체를 “v2.4 전면 리팩터링” 또는 “Phase 1~3 완료”로 승인할 수는 없다. 핵심 이유는 다음과 같다.

1. 독립 작업 대상 `_2`의 Git remote가 보호 대상 원본 저장소를 가리켜 현재 상태에서 push·배포하면 원본을 오염시킬 위험이 있다.
2. 5개 주요 Chrome QA와 여러 문서가 옛 base를 사용해 `_2` 기준 실행 전 HTTP 404 또는 계약 불일치를 만든다.
3. 계획서와 UI 카피가 단일 클릭 상세 보기를 주장하지만 실제 카드 클릭은 기존 도크 선택 동작을 유지한다.
4. broad `!important` radius 규칙이 기존 라이브 튜너 계약을 다시 위반한다.
5. 전면 번역·8개 아키타입 차별화·필터 드로어·가상 스크롤 등 완료 주장 대부분은 구현되지 않았다.
6. 반복 조건과 290줄 CSS 추가로 구조가 단순해지지 않았고 번들 크기는 소폭 증가했다.
7. `package.json`과 lockfile, README, spec, QA 경로가 서로 다른 프로젝트 정체성과 버전을 가리킨다.

Critical 1건과 Major finding이 남아 있으므로 배포와 병합은 Hold다.

## 2. 감사 범위

### 2.1 확인한 문서

- `AGENTS.md`
- `spec.md`
- `designs.md`
- `DESIGN_DECISIONS.md`
- `README.md`
- `BUILD_GUIDE.md`
- `implementation_summary.md`
- `CHANGELOG.md`
- `audit_roadmap.md`
- `AI_AUDIT_DOC_STANDARD.md`
- `AI_IMPLEMENTATION_DOC_STANDARD.md`
- `docs/REFACTORING_IMPLEMENTATION_PLAN.md`

### 2.2 확인한 구현 및 설정

- 현재 변경된 추적 파일 15개
- 신규 미추적 문서 1개
- `src/components/mainView.js`
- `src/components/archetypeTemplates.js`
- `src/i18n/copy.js` 및 locale 파일
- `src/styles/interactive.css`
- `vite.config.js`, `package.json`, `package-lock.json`
- Pages artifact/recovery 및 5개 주요 Chrome QA 스크립트
- 관련 Node 테스트와 GitHub Pages workflow

### 2.3 변경 규모

추적 파일 기준 변경량은 `15 files changed, 463 insertions(+), 72 deletions(-)`이다. 신규 `docs/REFACTORING_IMPLEMENTATION_PLAN.md`는 미추적 파일이어서 이 통계에 포함되지 않는다.

### 2.4 제외 범위

- 변경본은 remote에 배포되지 않았으므로 실제 GitHub Pages 운영 배포 후 동작은 검사하지 않았다.
- 일본어·중국어 간체·중국어 번체의 원어민 수준 자연스러움은 언어 전문가 검토 범위에서 제외했다.
- 깨진 Chrome QA 전체를 임시 수정해 우회 실행하지 않았다. 감사 중 소스는 수정하지 않았다.
- 외부 dependency 보안 DB에 대한 신규 온라인 감사는 수행하지 않았다. 이번 diff에는 dependency 추가·업그레이드가 없다.
- `node_modules`, 생성된 `dist`, 과거 sealed audit evidence는 소스 diff 감사에서 제외했다.

## 3. 실행한 검사

| 검사 | 변경본 결과 | 원본 기준 결과 | 판정 |
| --- | --- | --- | --- |
| remote `main` 확인 | `0fc6866` | 로컬 `origin/main`과 동일 | 비교 기준 Verified |
| `npm run build` | PASS | PASS | 신규 빌드 자체는 성공 |
| `npm test` | 파일 runner 22개 중 20 PASS, 2 FAIL | 동일한 2 FAIL 재현 | 이번 diff의 신규 회귀로 판정하지 않음 |
| 관련 CLI 직접 실행 | catalog JSON 및 theme check PASS | 해당 없음 | 기능 자체는 정상 |
| Pages/Recovery Chrome QA | PASS, issue 0 | 해당 없음 | `_2` 로컬 base에서만 Verified |
| Discovery Chrome QA | HTTP 404, 실행 전 fatal | 기준 커밋 경로에서는 동작 | `_2` migration 누락 |
| 원본/변경본 1440px 화면 대조 | pill·CTA·일부 카드 테두리 차이 확인 | 기존 화면 | 부분 시각 개선 Verified |
| `git diff --check` | CSS EOF 빈 줄 1건 | 없음 | Minor |

`npm test`의 실패 파일은 `tests/catalogValidation.test.js`, `tests/themeGeneration.test.js`다. 두 파일 모두 nested `spawnSync` 결과가 비는 환경성 증상으로 원본에서도 동일하게 재현됐다. 이 결과는 변경본의 PASS 증거로 사용할 수 없으며, 코더는 CI 또는 정상 프로세스 환경에서 `284/284`를 다시 증명해야 한다.

## 4. Pass 1 — 구현 정합성 Findings

### [IMP-F001] 단일 클릭 상세 보기 완료 주장이 실제 이벤트 계약과 다름

- Pass: Implementation
- Pattern: `IMP-001`, `IMP-003`
- Area: Gallery UX, 사용자 카피, 완료 주장
- Severity: **Major**
- Status: **Needs Fix**
- Summary: 계획서와 5개 locale 카피는 카드 단일 클릭이 상세 보기라고 설명하지만 실제 카드 본체 클릭은 기존 `selectDraft()`를 호출한다.
- Evidence:
  - `docs/REFACTORING_IMPLEMENTATION_PLAN.md:220-229`는 double-click 제거와 single-click detail을 완료 목표로 선언한다.
  - `src/i18n/copy.js:54`, `:99`, `:115`, `:131`, `:147`은 click이 detail을 연다고 안내한다.
  - `src/components/mainView.js:361-375`는 CTA에만 `openDetailFor()`를 적용하고 일반 click은 `selectDraft()`, double-click은 여전히 `openDetailFor()`를 호출한다.
  - `selectionDock.js`, `detailView.js`, `discoveryMarkup.js`, `renderWindow.js`에는 이번 diff가 없다.
- Expected: 완료 주장, 화면 카피, 실제 pointer/keyboard 이벤트, 회귀 테스트가 같은 동작을 설명해야 한다.
- Actual: 작은 CTA와 카드 본체가 서로 다른 동작을 가지지만 카피는 이를 구분하지 않는다. hover compare/confirm, drawer, virtualization도 구현되지 않았다.
- Impact: 사용자가 안내와 다른 결과를 얻고, 코더가 미구현 범위를 완료로 오인한다.
- Suggested Fix: 이번 보정에서는 기존 click-to-dock 계약을 유지하고 CTA를 명시적 `상세 보기` control로 만들며 카피와 계획서 상태를 실제 동작에 맞춘다. single-click 전면 전환은 별도 승인된 feature change로 분리한다.
- Re-audit Method: Grid/Bento/Spectrum에서 pointer click, CTA click, double-click, Enter, Space를 각각 검증하고 locale별 안내 문구와 대조한다.
- Owner: Coder

### [IMP-F002] 5개 언어 전면 감수 완료 주장이 실제 변경 범위를 과장함

- Pass: Implementation
- Pattern: `IMP-003`, `IMP-004`
- Area: i18n, CHANGELOG, 계획서
- Severity: **Major**
- Status: **Needs Documentation Recovery**
- Summary: 변경은 locale당 18~21개 UI 문자열에 한정되지만 계획서와 CHANGELOG는 296-key 및 catalog editorial 전면 개편처럼 읽힌다.
- Evidence:
  - 원본 대비 실제 변경 key 수: `ko 20`, `en 19`, `ja 20`, `zh-CN 21`, `zh-TW 18`, 총 98개 locale-value.
  - `src/i18n/locales/catalog/*`와 editorial pack에는 diff가 없다.
  - `docs/REFACTORING_IMPLEMENTATION_PLAN.md` Phase 1은 296키, palette 역할, catalog 반복문 제거를 요구한다.
  - `CHANGELOG.md`의 신규 Phase 1 항목은 전면 재정의를 완료형으로 기록한다.
- Expected: 변경 범위가 “핵심 UI 용어 98개 개선”으로 기록되거나, 문서가 주장한 전체 범위가 실제 구현·테스트로 닫혀야 한다.
- Actual: 기존 catalog 감수 결과를 이번 리팩터링 성과처럼 재서술한다.
- Impact: 릴리스 범위와 번역 QA 책임이 불명확해진다.
- Suggested Fix: CHANGELOG와 계획서 상태를 실제 98개 변경으로 축소하고, catalog 전면 재감수는 별도 phase로 `Deferred` 처리한다.
- Re-audit Method: 원본/변경 locale snapshot을 key 단위로 비교하고 5-locale Chrome QA 및 원어민 검토 상태를 문서에 기록한다.
- Owner: Coder / Human language reviewer

### [IMP-F003] 사조별 차별화 완료 범위가 계획보다 제한적임

- Pass: Implementation
- Pattern: `IMP-001`, `IMP-003`
- Area: Archetype renderer, CSS, CHANGELOG
- Severity: **Major**
- Status: **Needs Documentation Recovery**
- Summary: 고유 markup은 주로 Game·Media·Chat과 4개 category에 집중됐지만 문서는 8개 archetype 전체와 더 넓은 aesthetic family를 완료한 것처럼 기록한다.
- Evidence:
  - `src/components/archetypeTemplates.js`의 category별 콘텐츠 분기는 Game, Media, Chat에 존재한다.
  - 신규 category CSS selector는 Swiss, Y2K, Brutalism, Hypertech 네 그룹 중심이다.
  - Retro, Depth, Editorial, Soft3D에는 신규 main pill 문자열은 있으나 동일 수준의 archetype 전용 renderer가 없다.
  - 계획서의 Depth/Soft3D 및 8-archetype 범위는 대응 구현이 없다.
- Expected: 구현된 4-category × 3-archetype 핵심 범위를 정확히 문서화하거나, 나머지 범위를 별도 검증 가능한 단계로 구현한다.
- Actual: 부분 visual skin이 전체 aesthetic engine 완료로 표현된다.
- Impact: 사용자는 일부 화면에서만 차이를 보고, 유지보수자는 지원 matrix를 잘못 이해한다.
- Suggested Fix: 이번 변경을 “4개 category의 Game/Media/Chat 중심 visual differentiation”으로 명시하고 나머지는 후속 phase로 분리한다.
- Re-audit Method: category × archetype matrix를 생성해 markup/CSS/실제 스크린샷 차이를 셀별로 검증한다.
- Owner: Coder / Designer

### [IMP-F004] 계획서 상태, CHANGELOG, package version이 같은 lifecycle을 가리키지 않음

- Pass: Implementation
- Pattern: `IMP-004`, `DOC-BACKFILL-001`
- Area: 문서 lifecycle, versioning
- Severity: **Major**
- Status: **Needs Fix**
- Summary: 신규 계획서는 “구현 대기 승인용”인데 CHANGELOG는 Phase 1~3 완료를 선언하고 package/header는 v2.4를 노출한다.
- Evidence:
  - `docs/REFACTORING_IMPLEMENTATION_PLAN.md:6`
  - `CHANGELOG.md`의 신규 Unreleased 3개 항목
  - `package.json:2-3`, `src/components/header.js`, `index.html`
- Expected: Draft/Approved/In Progress/Implemented/Verified 중 하나의 상태가 모든 문서와 제품 표시에 일치해야 한다.
- Actual: 계획, 구현, 검증, 릴리스 상태가 동시에 존재한다.
- Impact: 승인 여부와 배포 가능 여부를 잘못 해석하게 한다.
- Suggested Fix: package의 v2.4 개발 버전은 유지하되 UI의 완료형 릴리스 표시는 `PREVIEW` 또는 `보정 중`으로 바꾸고, 계획서는 `부분 구현·감사 실패`로 갱신한다. CHANGELOG는 실제 구현만 Changed 아래에 기록한다.
- Re-audit Method: version source, UI badge, lockfile, spec, README, plan status, CHANGELOG를 일괄 대조한다.
- Owner: Coder / Release owner

## 5. Pass 2 — Debug / Engineering Quality Findings

### [DBG-F001] 독립 작업 대상이 보호 대상 원본 remote를 가리킴

- Pass: Debug
- Pattern: `BUILD-001`, `ARCH-001`
- Area: Repository safety, deployment identity
- Severity: **Critical**
- Status: **Hold**
- Summary: 작업 대상은 독립 프로젝트 `design_sample_selector`지만 대상 폴더의 `origin`은 보호 대상 원본 저장소를 가리킨다.
- Evidence:
  - remote: `git@github.com:Yupkidangju/design_sample_selector.git`
  - remote `main`: `0fc6866a5fb5c8261a5c3bc82882ef0d71bc2079`
  - 사용자 지정 작업 대상: `/home/eunho1/Projects/web/design_sample_selector`
  - 사용자 지정 보호 대상: `/home/eunho1/Projects/web/design_sample_selector`
  - `spec.md:258`, README 및 BUILD_GUIDE는 복사 전 identity를 아직 유지한다.
  - `vite.config.js:4`: `/design_sample_selector/`
  - `scripts/verifyPagesArtifact.js`, `scripts/verifyPagesRecoveryChrome.js`: `_2`
- Expected: 대상 폴더 내부 계약은 `_2` identity와 `/design_sample_selector/` base로 통일되고, 보호 대상 원본 remote로의 commit·push·deploy는 차단되어야 한다.
- Actual: Vite와 일부 Pages 검증기는 `_2`를 사용하지만 Git remote와 문서·QA 일부는 원본 identity를 유지한다.
- Impact: 실수로 현재 `origin`에 push 또는 deploy하면 보호 대상 원본 저장소/Pages를 오염시키거나 깨뜨릴 수 있다.
- Suggested Fix: `/design_sample_selector/` base는 유지한다. 대상 폴더 안의 문서·QA·테스트를 `_2`로 이관하되, 사용자의 별도 승인 전에는 remote 변경·commit·push·deploy를 수행하지 않는다. 이후 독립 `_2` remote가 승인되면 그때 안전하게 연결한다.
- Re-audit Method: 대상 폴더에서만 clean build와 Pages-like 검증을 수행하고 모든 URL이 `/design_sample_selector/` 아래에서 200인지 확인한다. `git remote -v`가 원본을 가리키는 동안 release gate는 계속 HOLD로 둔다.
- Owner: Coder / Release owner

### [DBG-F002] 5개 주요 Chrome QA가 base drift로 실행 불가능하고 테스트가 이를 허용함

- Pass: Debug
- Pattern: `TEST-001`, `BUILD-001`
- Area: Browser QA, regression test
- Severity: **Major**
- Status: **Needs Fix**
- Summary: Wave1, Discovery, Catalog120, Render Scalability, i18n QA는 기존 base를 사용하지만 Vite config는 `_2`만 제공한다.
- Evidence:
  - `scripts/verifyWave1Chrome.js:724`
  - `scripts/verifyCatalogDiscoveryChrome.js:813`
  - `scripts/verifyCatalog120Chrome.js:1606`
  - `scripts/verifyRenderScalabilityChrome.js:1219`
  - `scripts/verifyI18nInspectorChrome.js:633`
  - Discovery QA 실제 결과: `Vite 준비 실패: HTTP 404`, exit code 2
  - `tests/auditRemediation10.test.js:38`은 `design_sample_selector`와 `_2`를 모두 허용한다.
- Expected: 하나의 canonical base만 모든 QA가 공유하고, 하나라도 drift하면 단위 테스트에서 즉시 실패해야 한다.
- Actual: Pages QA만 `_2`에서 통과하고 나머지 품질 게이트는 실행 전 실패한다.
- Impact: 반응형·접근성·i18n·120종 matrix 회귀를 검증하지 못한다.
- Suggested Fix: canonical base를 공용 설정으로 추출하고 모든 QA와 test가 그 값을 사용하게 한다. optional 정규식은 제거한다.
- Re-audit Method: 6개 Chrome QA 명령을 모두 clean 상태에서 실행하고 issue 0을 확인한다.
- Owner: Coder

### [DBG-F003] 신규 broad radius override가 명시된 튜너 계약을 위반함

- Pass: Debug
- Pattern: `IMP-001`, `TEST-001`
- Area: Live tuner, CSS cascade
- Severity: **Major**
- Status: **Needs Fix**
- Summary: Swiss의 모든 descendant와 일부 Y2K/Brutalism surface에 hardcoded `!important` radius가 추가됐다.
- Evidence:
  - `spec.md:269-271`: radius는 `data-tweak-surface` opt-in만 갱신하고 broad `!important`를 금지한다.
  - `src/styles/interactive.css:2753-2756`: 기존 tuner surface contract
  - `src/styles/interactive.css:3022-3025`: Swiss 전체 descendant `0 !important`
  - `src/styles/interactive.css:3087-3096`, `3100-3130`: category별 hardcoded radius/visual override
- Expected: category 기본 미학은 초기 token으로 표현하되 사용자가 tuner를 움직이면 opt-in surface가 새 값을 반영해야 한다.
- Actual: category CSS가 tuner variable보다 우선할 수 있다.
- Impact: 핵심 “동적 인스펙터/라이브 튜너” 기능이 특정 category에서 무효화된다.
- Suggested Fix: descendant-wide selector와 radius `!important`를 제거하고 `--tweak-surface-radius` 우선순위를 보존하는 category surface rule로 교체한다.
- Re-audit Method: Swiss/Y2K/Brutalism/Hypertech 각각에서 0, 16, 64px를 적용하고 computed radius와 스크린샷을 확인한다.
- Owner: Coder

### [DBG-F004] package manifest와 lockfile root metadata가 불일치함

- Pass: Debug
- Pattern: `DEP-001`, `BUILD-001`
- Area: Package metadata, reproducibility
- Severity: **Major**
- Status: **Needs Fix**
- Summary: package는 `design-sample-selector-2@2.4.0`, lockfile root는 `design-sample-selector@2.3.0`이다.
- Evidence: `package.json:2-3`, `package-lock.json:2-9`
- Expected: package와 lockfile root name/version이 일치하고 version 정책이 spec/CHANGELOG/UI와 정렬되어야 한다.
- Actual: 설치 manifest와 잠금 manifest가 서로 다른 release identity를 가진다.
- Impact: 재현성, release tooling, 변경 검토 신뢰도를 낮춘다.
- Suggested Fix: 대상 프로젝트 identity인 `design-sample-selector-2@2.4.0`을 유지하고 lockfile·spec·README·UI·CHANGELOG를 동기화한다. 단, acceptance gate 전에는 완료된 정식 release로 표기하지 않는다.
- Re-audit Method: package/lock root metadata equality test와 clean `npm ci`를 실행한다.
- Owner: Coder / Release owner

### [DBG-F005] 리팩터링이 복잡도를 줄이지 않고 조건과 CSS를 추가함

- Pass: Debug
- Pattern: `ARCH-001`
- Area: Renderer architecture, maintainability
- Severity: **Major**
- Status: **Needs Fix**
- Summary: Game·Media·Chat에서 같은 category boolean과 중첩 삼항식이 반복되고, CSS는 3,301줄 파일에 290줄이 추가됐다.
- Evidence:
  - `src/components/archetypeTemplates.js:56-65`, `:580-615`, `:685-692`
  - `src/styles/interactive.css:3013-3301`
  - 계획서가 예시한 `getAestheticFamily()`/renderer dispatcher는 구현되지 않았다.
- Expected: category profile을 하나의 data model/dispatcher로 만들고 renderer는 profile을 소비해야 한다.
- Actual: 동일 조건이 여러 renderer와 CSS selector에 분산됐다.
- Impact: category 추가·수정 시 누락과 불일치가 반복될 가능성이 높다.
- Suggested Fix: immutable `AESTHETIC_PROFILES` map과 작은 markup helper로 중복 조건을 제거하고 category CSS를 별도 파일로 분리한다.
- Re-audit Method: 동일 category conditional 검색, renderer snapshot matrix, CSS import/build 결과를 확인한다.
- Owner: Coder

### [DBG-F006] 정의되지 않은 animation과 CSS hygiene 문제가 남음

- Pass: Debug
- Pattern: `TEST-001`
- Area: CSS correctness
- Severity: **Minor**
- Status: **Needs Fix**
- Summary: `.y2k-pill`이 `cyberPulse`를 사용하지만 대응 `@keyframes`가 없고 CSS 끝에 불필요한 빈 줄이 있다.
- Evidence: `src/styles/interactive.css:3235`, `git diff --check`
- Expected: 사용한 animation 이름은 정의돼야 하며 reduced-motion 처리와 formatting gate를 통과해야 한다.
- Actual: pulse 효과는 실행되지 않고 diff hygiene가 실패한다.
- Impact: 의도한 시각 효과가 없으며 코드가 완료된 것처럼 보이지만 dead declaration이다.
- Suggested Fix: animation을 제거하거나 keyframes와 `prefers-reduced-motion` 예외를 함께 정의하고 EOF를 정리한다.
- Re-audit Method: CSS identifier 검색, reduced-motion Chrome 상태, `git diff --check`를 실행한다.
- Owner: Coder

### [DBG-F007] 성능 개선 증거가 없고 초기 bundle은 증가함

- Pass: Debug
- Pattern: `BUILD-001`
- Area: Bundle performance
- Severity: **Minor**
- Status: **Verified with Regression Note**
- Summary: 변경은 기존 예산 안에 있지만 성능 리팩터링으로 볼 근거는 없다.
- Evidence:
  - 원본 메인 CSS gzip: `33.00 kB`
  - 변경본 메인 CSS gzip: `34.22 kB` — `+1.22 kB`, 약 `+3.7%`
  - 원본 메인 JS gzip: `88.37 kB`
  - 변경본 메인 JS gzip: `88.71 kB` — `+0.34 kB`
  - 문서 예산: JS `< 90 kB`, CSS `< 35 kB`
- Expected: 리팩터링의 성능 개선을 주장하려면 before/after runtime 또는 bundle 감소 근거가 있어야 한다.
- Actual: 예산은 통과하지만 여유가 JS 약 1.29 kB, CSS 약 0.78 kB로 좁아졌다.
- Impact: 후속 구현이 현재 예산을 쉽게 초과할 수 있다.
- Suggested Fix: 성능 개선 주장을 제거하고 후속 slice마다 bundle analyzer를 실행한다.
- Re-audit Method: clean build와 `npm run analyze:bundle` 결과를 기록한다.
- Owner: Coder

## 6. Pass 3 — Security Findings

### [SEC-F001] 신규 직접 보안 회귀는 확인되지 않음

- Pass: Security
- Pattern: `SEC-001`, `SEC-004`, `SEC-008`
- Area: Dependency, input boundary, browser rendering
- Severity: **Info**
- Status: **Verified**
- Summary: 이번 diff에는 dependency, 인증, secret, filesystem, shell, 외부 network API 변경이 없다.
- Evidence:
  - `package.json` dependency 목록은 변하지 않았다.
  - 신규 category 값은 기존 정적 catalog의 검증된 ID에서 유래한다.
  - Pages/Recovery Chrome QA는 fault matrix 9종, issue 0으로 통과했다.
- Expected: 기존 renderer trust boundary와 catalog validation을 약화하지 않아야 한다.
- Actual: 해당 경계의 직접적인 약화는 발견되지 않았다.
- Impact: 보안 pass 단독 차단 finding은 없다. 전체 Hold는 배포·정합성 finding 때문이다.
- Suggested Fix: 없음. 단, renderer data가 향후 외부 입력으로 바뀌면 attribute/text escaping을 별도 재감사한다.
- Re-audit Method: dependency diff, secret scan, renderer input provenance를 다시 확인한다.
- Owner: Auditor

## 7. Cross-Pass Conflicts

### [XPF-F001] `_2` Pages QA PASS와 repository 안전성은 별개임

- Related Findings: `DBG-F001`, `DBG-F002`, `IMP-F004`
- Conflict: `_2` base로 수정된 Pages/Recovery QA는 PASS하지만 현재 remote는 보호 대상 원본이고, 복사된 문서와 더 넓은 browser QA는 옛 base를 유지한다.
- Resolution: 사용자가 지정한 작업 대상 `_2`를 canonical local identity로 사용한다. 원본 remote는 비교 기준일 뿐 배포 대상이 아니며, 별도 승인 전 모든 remote mutation과 push를 금지한다.
- Gate Impact: **배포 HOLD**
- Required Fix Before PASS: 대상 폴더의 base·QA·문서·artifact를 `/design_sample_selector/`로 통합하고 독립 remote 승인 전 release를 HOLD한다.

### [XPF-F002] 시각 개선 PASS와 제품 리팩터링 완료 판정이 충돌함

- Related Findings: `IMP-F001`, `IMP-F002`, `IMP-F003`, `DBG-F005`, `DBG-F007`
- Conflict: 화면 대조에서는 pill·CTA·category 장식 개선이 보이지만 문서가 주장한 UX, i18n, architecture, performance 완료 기준은 충족하지 않는다.
- Resolution: 시각 개선을 부분 성과로 인정하되 전면 리팩터링 완료와 분리한다.
- Gate Impact: **REWORK REQUIRED**
- Required Fix Before PASS: 문서를 실제 범위로 축소하고 구조·계약 회귀를 수정한다.

## 8. Required Fixes Before PASS

우선순위는 다음과 같다.

1. `DBG-F001`: `_2` local identity를 대상 폴더 전체에 일관되게 적용하고 보호 대상 원본 remote에 대한 쓰기를 차단한다.
2. `DBG-F002`: 모든 Chrome QA가 동일 base를 사용하고 실제로 실행되게 한다.
3. `DBG-F003`: broad `!important` radius override를 제거해 tuner 계약을 복구한다.
4. `IMP-F001`: 카드/CTA 동작과 모든 locale 카피를 일치시킨다.
5. `DBG-F004`, `IMP-F004`: package, lockfile, UI version, 문서 lifecycle을 동기화한다.
6. `IMP-F002`, `IMP-F003`: i18n과 aesthetic 범위의 완료 주장을 실제 구현에 맞춘다.
7. `DBG-F005`, `DBG-F006`: 반복 조건과 CSS 구조를 단순화하고 dead declaration을 제거한다.
8. 전체 Node/build/browser/bundle gate를 다시 실행한다.

## 9. Accepted Risks 및 기존 위험

이번 감사에서 새로 수용한 위험은 없다.

다음은 대상 폴더의 기준 커밋에도 존재한 기존 위험이며 이번 리팩터링의 신규 finding으로 계산하지 않는다.

- catalog validation warning 56개
- 현재 샌드박스에서 nested process 기반 Node test 2개가 기준 커밋과 변경본 모두 실패하는 환경성 증상
- 비한국어 문구의 원어민 최종 감수 미확정

이 항목들은 자동으로 Accepted Risk가 되지 않는다. release owner가 책임자, 사유, 만료 조건을 기록하거나 정상 CI에서 해소해야 한다.

## 10. Needs Spec Clarification

사용자 확인으로 local canonical identity와 base는 각각 `design_sample_selector`, `/design_sample_selector/`로 확정됐다. 다만 다음 외부 작업은 아직 승인되지 않았다.

- 새 remote repository 생성 및 연결
- production URL 변경
- Git remote 변경
- 기존 Pages URL 호환 또는 폐기 정책

대상 폴더 내부 문서·workflow·QA migration은 수행할 수 있지만, 승인 전에는 commit·push·deploy하지 않는다.

## 11. 재감사 체크리스트

- [ ] 모든 명령의 working directory와 변경 파일이 대상 폴더 또는 `/tmp`로 한정됐다.
- [ ] 대상 내부 Vite·문서·QA·artifact가 `/design_sample_selector/` 하나를 사용한다.
- [ ] 현재 remote가 보호 대상 원본을 가리키는 동안 commit·push·deploy가 수행되지 않았다.
- [ ] README, BUILD_GUIDE, spec, implementation summary가 같은 `_2` base를 사용하고 미확정 production URL을 확정값처럼 쓰지 않는다.
- [ ] package와 lockfile root name/version이 동일하다.
- [ ] UI badge와 CHANGELOG가 실제 release 상태를 과장하지 않는다.
- [ ] 일반 card click, explicit detail CTA, double-click, Enter, Space 계약이 문서·카피·테스트와 일치한다.
- [ ] Swiss/Y2K/Brutalism/Hypertech에서 radius 0/16/64px tuner가 computed style에 반영된다.
- [ ] aesthetic coverage matrix가 실제 구현 범위를 정확히 표시한다.
- [ ] `npm test`가 정상 CI에서 284/284 PASS한다.
- [ ] `npm run build`가 PASS한다.
- [ ] `npm run analyze:bundle`이 JS `< 90 kB`, CSS `< 35 kB`를 충족한다.
- [ ] Wave1, Discovery, Catalog120, Pages, i18n, Scalability Chrome QA가 모두 issue 0이다.
- [ ] `git diff --check`가 출력 없이 종료한다.
- [ ] 신규 Critical/Major finding이 없다.

## 12. 최종 결정

**REWORK REQUIRED — 배포 및 병합 HOLD**

부분적인 시각 개선은 확인됐지만 현재 변경은 배포 경로, 브라우저 QA, 라이브 튜너 계약, 문서 lifecycle에서 중대한 불일치를 만든다. `DBG-F001` Critical과 모든 Major finding이 해소되고 재감사 체크리스트가 충족되기 전에는 v2.4 완료 또는 개선된 리팩터링으로 승인하지 않는다.
