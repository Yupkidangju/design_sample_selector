# Sub Audit Report

## 1. Audit Metadata

- Audit Turn: 12
- Perspective: 계약·사용자 기능·접근성
- Audit Basis: `AI_AUDIT_DOC_STANDARD.md`, `spec.md`, `designs.md`, 실행 가능한 테스트와 브라우저 관찰
- Project Root: `/home/eunho1/Projects/web/design_sample_selector_2`
- Protected Exclusion: `/home/eunho1/Projects/web/design_sample_selector`은 접근·실행·수정하지 않음
- Assigned Report: `docs/multi_audit/12/sub_audit_01_contract_functionality.md`
- Independence Note: 이 축에 배정한 최초 감사자와 교체 감사자가 모두 보고서를 완결하지 못해, 주 감사자가 이미 확보한 직접 증거로 이 축을 보충했다. 따라서 계약/기능 축은 독립성 기준에서 `Partially Covered`이며 최종 PASS 근거로 사용하지 않는다.
- Mutation: 제품 소스·설정·테스트·문서를 수정하지 않음. 감사 산출물만 `docs/multi_audit/12/`에 기록함.

## 2. Assigned Scope

- 코더 수정 내용이 현재 제품 계약과 일치하는지 확인
- Grid/Bento/Spectrum의 신규 상세 CTA와 카드 상호작용 확인
- 키보드, 조작 대상 크기, 포커스 및 반응형 접근성 확인
- 5개 locale, 120개 카탈로그, Pages 하위 경로와 오류 복구의 브라우저 회귀 확인
- README/spec/design/build 문서의 제품 identity, version, test·bundle 기준선 일치 확인

## 3. Excluded and Uninspected Scope

- 원본 `design_sample_selector` 폴더 전체
- 실제 GitHub Pages와 GitHub repository/environment 설정
- 외부 사용자·원어민에 의한 정성적 번역 품질 검토
- 이 보고서 작성 중 제품 코드 수정

## 4. Evidence Examined

- `npm test`: 격리 환경의 `spawnSync EPERM`을 분리한 뒤 허용된 실행 환경에서 **285/285 PASS**
- 독립 출력 경로 `docs/multi_audit/12/build-dist`의 Vite build: **100 modules, PASS**
- `validateCatalog.js`: 오류 0, legacy warning 56
- `generateThemeStyles.js --check`: PASS
- Browser QA를 감사 전용 artifact 경로로 재실행:
  - Wave 1: 3 gallery modes, 6 widths, 12 detail, 576 device states, issue 0
  - Discovery: 120 reachable, 9 scenarios, 6 widths, issue 0
  - Catalog120: 120 styles, 1,920 matrix, Web 480 tabs, issue 0
  - Pages recovery: network fault 7 + consumer fault 2, issue 0
  - i18n: 5 locales, 9,620 field units, 30 reflow states, issue 0
  - Scalability: synthetic 60/120, LCP 820ms, CLS 0, issue 0
- `mainView.js:194-200,267-273,340-346,427-475` 및 `interactive.css:3011-3029` 정적 대조
- 격리 Chrome CDP 표적 검사: 첫 `.tile-detail-btn`은 약 **65.06×25px**, focus 상태에서 Space를 누른 뒤 500ms에도 `#detail-root`가 비어 있고 `display:none`
- `README.md`, `spec.md`, `designs.md`, `BUILD_GUIDE.md`, `DESIGN_DECISIONS.md`, `implementation_summary.md`, `CHANGELOG.md`의 current/version/base/baseline 문자열 대조

## 5. Findings

### [A01-F001] 신규 상세 CTA에서 Space 키가 상세 열기 대신 비교 토글로 가로채짐

- Areas: 주요 사용자 흐름, 키보드 접근성, 이벤트 위임
- Severity: Major
- Status: Confirmed
- Summary: 세 갤러리 모드에 native `button` 상세 CTA가 추가됐지만 document 수준 갤러리 단축키가 Button을 text-entry/control 예외로 취급하지 않는다. CTA에 focus한 상태에서 Space가 native click 전에 `preventDefault()`되어 현재 gallery tile의 compare 동작으로 바뀐다.
- Verified Evidence:
  - `src/components/mainView.js:194-200,267-273,340-346` — `.tile-detail-btn`, `.bento-open-cta`, `.spec-cta`는 native button.
  - `src/components/mainView.js:431-443` — 단축키 제외 대상은 INPUT/TEXTAREA/SELECT뿐이며 BUTTON은 제외하지 않음.
  - `src/components/mainView.js:469-474` — Space에서 `preventDefault()` 후 `toggleCompareSlot()`.
  - 격리 Chrome에서 CTA focus 후 Space 입력 시 Detail이 열리지 않음을 재현.
  - `rg` 결과 테스트와 QA에는 세 CTA selector를 직접 키보드로 작동시키는 검사가 없음.
- Expected Basis: native button은 Enter/Space 모두 본래 click 동작을 유지해야 하며 `spec.md:324`는 키보드 parity와 text-entry guard를 규정한다.
- Actual: 마우스 click과 Enter 경로는 상세를 열 수 있으나 Space는 다른 기능을 실행한다.
- Impact: 키보드 사용자가 명시적 상세 버튼을 Space로 사용할 수 없고, 의도하지 않은 비교 상태가 바뀐다.
- Required Action: gallery global shortcut은 interactive control(`button,a,input,textarea,select,[role=button]` 등)에서 실행하지 않거나, 이벤트 target이 gallery tile 자체일 때만 처리한다. 세 모드 CTA에 Enter/Space browser regression test를 추가한다.
- Re-audit Method: 세 모드에서 각 CTA를 Tab focus하고 Enter와 Space가 동일 Detail ID를 열며 compare/bookmark 상태를 바꾸지 않는지 확인.
- Confidence: High

### [A01-F002] 신규 상세 CTA의 실제 높이가 44px 접근성 기준보다 작음

- Areas: 조작 대상 크기, 모바일/접근성
- Severity: Minor
- Status: Confirmed
- Summary: 공통 CTA CSS가 11px 글자와 `padding:4px 8px`만 지정해 브라우저 관찰 크기가 약 25px 높이에 머문다.
- Verified Evidence:
  - `src/styles/interactive.css:3011-3029` — min-height/min-width가 없고 padding 4px.
  - 격리 Chrome computed rect: `65.0625 × 25px`.
- Expected Basis: `designs.md:196`은 핵심 조작을 가능한 경우 44×44px 이상으로 규정하고, 기존 Discovery QA·문서는 44px target을 품질 기준으로 사용한다.
- Actual: 새 핵심 상세 CTA는 높이 기준을 약 19px 밑돈다.
- Impact: 터치·운동 제약 사용자의 오조작 가능성이 증가하고 기존 접근성 품질선과 불일치한다.
- Required Action: 최소 44px hit area를 제공하거나 시각 크기와 독립된 충분한 hit target을 구현하고 세 모드/모바일에서 겹침을 검사한다.
- Re-audit Method: 320/375/768/1440px에서 CTA computed rect와 overlap을 측정하고 최소 hit area를 assertion한다.
- Confidence: High

### [A01-F003] 현재 제품 identity·version·검증 기준선 문서가 서로 충돌함

- Areas: 승인 계약, 사용자 문서, 유지보수
- Severity: Major
- Status: Confirmed / Needs Clarification
- Summary: 실행 구성은 `design_sample_selector_2`와 v2.4.0을 향하지만 주 계약 문서 다수는 원본 identity와 v2.3.0을 current로 선언한다. 최신 테스트·bundle 수치도 README와 결정 문서에 반영되지 않았다.
- Verified Evidence:
  - `project.config.js:6-7` — slug/base가 `design_sample_selector_2`.
  - `package.json`·`package-lock.json` — `design-sample-selector-2@2.4.0`.
  - `implementation_summary.md:2` — 2.4.0 In Progress / Refactor.
  - `README.md:1`, `spec.md:3-11`, `designs.md:3`, `BUILD_GUIDE.md:3`, `DESIGN_DECISIONS.md:3` — v2.3.0 및 원본 app identity.
  - `CHANGELOG.md:21,54`, `designs.md:272`, `DESIGN_DECISIONS.md:357` — 과거 `/design_sample_selector/` base.
  - `README.md:138` — Node `284/284`, JS/CSS 88.37/33.00kB; 실제 재감사는 285/285, 88.79/32.93kB.
- Expected Basis: `spec.md`는 승인된 current contract이고 README/build/design/release 문서는 실행 구성과 동기화되어야 한다.
- Actual: 어느 identity/version이 배포 승인 기준인지 단일하게 결정할 수 없다.
- Impact: 코더가 상충된 acceptance target을 구현하고, release owner가 잘못된 base·수치로 승인할 수 있다.
- Required Action: 사용자가 승인할 canonical identity/version을 먼저 확정하고 `spec.md`부터 README/design/build/decision/changelog/implementation summary를 동기화한다.
- Re-audit Method: current 선언, package/version badge, Pages base, 테스트 수, bundle 수치를 일괄 검색해 하나의 승인 값만 남는지 확인.
- Confidence: High for drift; identity choice requires human confirmation.

### [A01-F004] 필수 중앙 project identity 파일이 Git 추적 대상이 아님

- Areas: 빌드 재현성, release closure
- Severity: Major
- Status: Confirmed
- Summary: `project.config.js`는 Vite 및 여러 QA script가 import하는 필수 구성인데 `git ls-files --error-unmatch project.config.js`가 실패한다.
- Verified Evidence: 파일은 slug/base를 제공하지만 `git status --short`에서 `?? project.config.js`이며 Git index에는 없음.
- Expected Basis: clean checkout의 tracked source만으로 build/test/QA가 재현되어야 한다.
- Actual: 현재 working tree에서는 통과하지만 파일이 누락된 commit/checkout은 config import에서 실패한다.
- Impact: 코더가 변경 파일을 누락해 전달하면 CI와 소비자 checkout이 즉시 깨진다.
- Required Action: 의도된 파일이면 다음 승인된 변경 묶음에 반드시 포함하고, 불필요하면 tracked module로 설정을 이동한다. 본 감사는 commit 권한이 없어 Git 변경을 하지 않는다.
- Re-audit Method: clean clone/worktree에서 `npm ci && npm run check` 및 Chrome QA config import를 확인.
- Confidence: High

## 6. Uncertainties and Clarifications Needed

- 실제 GitHub remote/Pages 설정이 `_2` 전용인지 원본 저장소인지 로컬 증거만으로 승인할 수 없다.
- v2.4.0이 출시 목표인지 preview인지, v2.3.0 계약을 계속 유지할지 사용자의 결정이 필요하다.
- 자동 i18n 검사는 구조·overflow·키 보존을 증명하지만 원어민 문체 품질은 증명하지 않는다.
- 계약/기능 독립 감사자의 보고서 생성 실패로 이 축은 주 감사자 직접 증거에 의한 보충이며 독립성은 부분 충족이다.

## 7. Perspective Decision

**HOLD.**

285개 테스트와 전체 Chrome 회귀 매트릭스는 통과했지만, 명시적으로 추가된 상세 CTA의 Space 키 동작이 실제 브라우저에서 실패했고 필수 구성 파일은 Git에 포함되지 않았다. 제품 identity/version 계약도 상충한다. A01-F001/A01-F003/A01-F004를 해결하고 세 CTA 키보드·hit target 회귀와 clean checkout을 재검증하기 전에는 기능/계약 PASS를 선언할 수 없다.
