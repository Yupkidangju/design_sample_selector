# Sub Audit Report

## 1. Audit Metadata

- Audit Turn: 12
- Audit Mode: Standard-backed 재감사 + 프로젝트 전체 신규 문제 탐색
- Assigned Perspective: 빌드·테스트·런타임·아키텍처·데이터 무결성
- Secondary Boundary Check: 원본 저장소 보호, Git remote, GitHub Pages 배포 대상, workflow trigger
- Project Root: `/home/eunho1/Projects/web/design_sample_selector_2`
- Audit Date: 2026-09-03 (Asia/Seoul)
- Audit Basis: `AI_AUDIT_DOC_STANDARD.md` 및 `report-contract.md` 전문 검토
- Report Scope: 소스·테스트·설정·제품 문서의 read-only 감사 및 허용된 Node 검증
- Write Scope: 이 보고서 파일만 작성

## 2. Assigned Scope

다음 항목을 독립적으로 재검사했다.

- Vite/Pages base와 중앙 `project.config.js` 계약
- `package.json`–`package-lock.json` parity 및 설치 재현성
- Node 테스트, 정적 syntax, catalog/theme 품질 게이트
- release artifact와 release-manifest 무결성 검증
- CI workflow의 검사·배포 순서와 trigger
- state/localStorage/URL 복원 및 popstate 경계
- browser QA 스크립트의 base 경계와 실행 안전성
- 렌더링/번들 성능 검증 경계 및 문서화된 기준선
- 현재 remote가 원본 저장소를 가리키는지와 `_2` base가 배포 대상과 결합되는지

## 3. Exclusions and Uninspected Scope

- `node_modules/`, `dist/`, `.git` 내부, `.antigravity/archive/` 생성·벤더 트리
- 과거 감사 보고서 및 인계 문서: `docs/multi_audit/**`, `REFACTORING_AUDIT_REPORT`, `REFACTORING_CODER_HANDOFF`
- 원본 폴더 `/home/eunho1/Projects/web/design_sample_selector`
- GitHub repository Settings/Pages environment, branch-protection rules, 실제 배포 URL과 외부 DNS
- 실제 production 네트워크/브라우저 smoke test

`npm run build`는 기존 `dist/`를 덮어쓸 수 있고, Chrome QA는 `.antigravity/archive/`에 이미지와 보고서를 쓸 수 있으므로 실행하지 않았다. `analyze:bundle`, `verify:pages-artifact`와 Chrome QA의 기존 생성 증거는 산출물 트리 제외 규칙상 결과 근거로 사용하지 않았다.

## 4. Evidence Examined

### 4.1 Files and documents

- `project.config.js`, `vite.config.js`, `package.json`, `package-lock.json`
- `.github/workflows/deploy-pages.yml`
- `scripts/verifyPagesArtifact.js`, `scripts/analyzeInitialBundle.js`
- `tests/auditRemediation10.test.js` 및 전체 `tests/`의 실행 결과
- `src/state/appState.js`, `src/state/discoveryUrlState.js`, `src/catalog/discoveryUrl.js`
- `spec.md`, `designs.md`, `BUILD_GUIDE.md`, `implementation_summary.md`, `README.md`

### 4.2 Commands and results

- `git remote -v`: `origin` fetch/push가 모두 `git@github.com:Yupkidangju/design_sample_selector.git`로 확인됨. 현재 branch는 `main...origin/main`.
- `npm ls --package-lock-only --depth=0`: exit 0. package root와 lock root의 name/version은 `design-sample-selector-2` / `2.4.0`로 일치.
- `npm ci --dry-run --ignore-scripts`: exit 0. lockfile 기반 설치 계획이 유효.
- 프로젝트 소스·스크립트·테스트 JavaScript 130개 `node --check`: 130/130 exit 0.
- `npm run validate:catalog`: exit 0, 오류 0개·legacy 경고 56개.
- `npm run check:themes`: exit 0, 두 generated theme CSS 최신.
- `npm test`: 제한 환경의 첫 실행은 nested `spawnSync`에서 `EPERM`이 발생해 20 pass/2 fail로 중단됐으나, 동일 명령을 승인된 실행 환경에서 재실행한 authoritative 결과는 285 tests, 285 pass, 0 fail, exit 0.
- `node scripts/validateCatalog.js --json`: exit 0, 오류 0개·경고 56개.
- `node scripts/generateThemeStyles.js --check`: exit 0.
- `npm run build`, Chrome QA, generated `dist`/archive 기반 성능 재측정: 미실행(상기 안전 사유).

## 5. Findings

### Pass 1 — Implementation Compliance

#### IMP-F001 — 현재 계약 문서의 프로젝트 identity·version·검증 기준선이 서로 충돌한다

- Pass: Implementation Compliance
- Pattern: `IMP-004`, `BUILD-001`
- Area: 제품 문서/사양 authority, release baseline
- Severity: Major
- Status: Needs Clarification
- Summary: `spec.md`·`designs.md`·`BUILD_GUIDE.md`는 `design_sample_selector` v2.3.0을 현재 authoritative/current 문서로 선언하지만, package/config와 `implementation_summary.md`는 `_2` 및 v2.4.0을 사용한다. 같은 `implementation_summary.md` 안에서도 180/180, 175-test, 152-test 기준선이 섞여 있고 README는 284/284를 주장하는 반면 현재 실행 결과는 285/285다.
- Evidence:
  - `spec.md:2-5,11` — `design_sample_selector`, v2.3.0, authoritative master contract.
  - `designs.md:2-4` — 동일한 v2.3.0 current UX 문서.
  - `BUILD_GUIDE.md:2-4` — 동일한 v2.3.0 execution protocol.
  - `project.config.js:6-7`, `package.json:2-3` — canonical slug `_2`, package version 2.4.0.
  - `implementation_summary.md:1-3,124,131,137,143` — v2.4.0이지만 180/180, 175-test 및 서로 다른 bundle baseline을 기재.
  - `BUILD_GUIDE.md:269-278` — 152/152 및 별도 성능 기준선을 current baseline으로 기재.
  - 실제 `npm test` authoritative 결과 — 285/285.
- Expected Basis: Standard의 `IMP-004`(문서 authority·현재 상태의 단일 기준), 프로젝트 문서 동기화 규칙 및 `spec.md` source-of-truth 규칙.
- Actual: 구현 identity와 primary/secondary 문서 metadata가 다른 프로젝트명·버전을 가리키고, 완료 테스트 수와 성능 수치도 현재 실행 결과와 불일치한다.
- Impact: 어떤 사양과 테스트/성능 기준선이 승인된 현재 release인지 판정할 수 없다. 이전 baseline을 근거로 CI·재감사 통과를 선언하거나 `_2` 구현을 v2.3 계약으로 잘못 배포할 위험이 있다.
- Suggested Action: `spec.md`를 실제 승인된 `_2`/v2.4 계약으로 갱신하거나, `_2`가 별도 fork가 아니라면 package/config를 문서 identity에 맞춘다. 모든 문서에서 test count·module 수·gzip/LCP 수치를 재실행 가능한 날짜/명령과 함께 하나의 기준선으로 통일하고 historical snapshot은 명시적으로 과거 자료로 표시한다.
- Re-audit Method: `spec.md`, `designs.md`, `BUILD_GUIDE.md`, `implementation_summary.md`, `README.md`의 project/version/status/count를 grep 비교한 뒤 `npm test`, build, bundle analysis 결과와 대조한다.
- Confidence: High
- Notes: 실제 intent(기존 프로젝트의 v2.3 문서를 유지할지 `_2` v2.4를 현재 계약으로 승격할지)는 로컬 파일만으로 확정할 수 없어 `Needs Clarification`으로 판정했다.

### Pass 2 — Debug / Engineering Quality

#### DBG-F001 — release-manifest 검증 분기가 `return` 뒤에 있어 사실상 실행되지 않는다

- Pass: Debug / Engineering Quality
- Pattern: `BUILD-001`, `TEST-001`
- Area: GitHub Pages artifact integrity / release-manifest closure
- Severity: Major
- Status: Confirmed
- Summary: `verifyPagesArtifact()`가 파일 목록을 `map()`하는 callback 안에서 release-manifest 검증을 수행하지만, 검증 조건은 `return Object.freeze(...)` 뒤에 있다. 따라서 callback의 unreachable code이며, 파일이 0개면 callback 자체가 실행되지 않는다.
- Evidence:
  - `scripts/verifyPagesArtifact.js:91-101` — `files.map()` callback이 `return Object.freeze(...)`로 종료.
  - `scripts/verifyPagesArtifact.js:102-115` — `requireReleaseManifest` 조건이 그 `return` 뒤에 존재하며 callback 종료 직전까지 도달할 수 없음.
  - `scripts/verifyPagesArtifact.js:135-142` — 일반 CLI는 `requireReleaseManifest: !writeManifest`로 호출하므로 `verify:pages-artifact` 경로가 이 검증에 의존.
  - `package.json:21,25,28` — build는 manifest를 쓰고 `check`/CI는 artifact verifier를 호출.
  - `BUILD_GUIDE.md:234` — release SHA, path, size, SHA-256, MIME closure를 검증한다고 명시.
- Expected Basis: `spec.md`의 Pages artifact/release SHA 계약 및 `BUILD_GUIDE.md:234`의 release-manifest 무결성 설명. `requireReleaseManifest: true`이면 missing, damaged, wrong SHA/base/file closure가 실패해야 한다.
- Actual: manifest가 없거나, 저장된 `releaseSha`·`base`·`files`가 현재 `dist`와 달라도 기본 verifier가 이를 검사하지 않는다. `build --write-manifest`의 write 경로는 실행되지만 이후 검증 경로가 stale/tampered manifest를 차단하지 못한다.
- Impact: Pages에 업로드되는 artifact의 release identity와 파일 hash closure를 CI가 보장하지 못한다. 파일은 존재해도 다른 release의 manifest를 동반하거나 manifest가 누락된 artifact가 PASS로 통과할 수 있다. `verifyPagesRecoveryChrome.js`가 같은 함수에 `requireReleaseManifest: true`를 전달해도 보호 효과가 없다.
- Suggested Action: `releaseFiles` 계산을 끝낸 뒤 `files.map()` 바깥에서 `requireReleaseManifest` 블록을 실행하도록 이동한다. 정상 manifest뿐 아니라 missing, malformed JSON, wrong SHA, wrong base, stale file hash, empty-dist 케이스를 fixture로 추가하고, CLI exit 1까지 검증한다.
- Re-audit Method: 수정 후 targeted `node --test`에서 위 실패 모드를 각각 확인하고, `npm run verify:pages-artifact` 및 `npm run check`를 새 `dist`에서 실행한다. manifest의 `releaseSha/base/files`가 같은 artifact의 실제 hash와 정확히 일치하는지 확인한다.
- Confidence: High
- Notes: 이 finding은 산출물 내용을 읽지 않고 소스 제어 흐름만으로 재현 가능한 로직 결함이다.

#### TEST-F001 — release-manifest 회귀 테스트가 happy path만 검증해 DBG-F001을 놓친다

- Pass: Debug / Engineering Quality
- Pattern: `TEST-001`
- Area: artifact verifier test coverage
- Severity: Minor
- Status: Confirmed
- Summary: 현재 Audit 10 테스트는 정상 manifest를 생성한 다음 동일 manifest를 다시 검증하는 경우만 확인한다. manifest가 없거나 stale/mismatched일 때 실패해야 한다는 계약의 negative path가 없다.
- Evidence: `tests/auditRemediation10.test.js:43-80` — missing dynamic asset 실패와 정상 manifest write/re-read만 assertion하며, `release-manifest.json` 제거·변조 후 `requireReleaseManifest: true`가 실패하는지 검사하지 않음.
- Expected Basis: Standard의 `TEST-001` 및 artifact 무결성 계약은 실제 실패 모드를 회귀 테스트로 고정해야 한다.
- Actual: `requireReleaseManifest` 옵션을 전달하는 assertion은 정상 manifest에 대해 `passed === true`만 확인한다.
- Impact: 검증 분기가 unreachable 상태여도 전체 테스트가 PASS한다. 코더 보정 후 새 drift가 생겨도 release integrity 회귀가 감지되지 않는다.
- Suggested Action: DBG-F001의 수정과 함께 missing/malformed/wrong SHA/wrong base/stale files/empty dist를 각각 테스트한다. `npm test`뿐 아니라 verifier CLI의 non-zero exit도 고정한다.
- Re-audit Method: 위 negative fixture들이 모두 실패를 반환하고, 정상 fixture만 PASS하는지 targeted test로 확인한다.
- Confidence: High
- Notes: 단독 severity는 Minor로 두었지만 DBG-F001의 Major 위험을 실질적으로 가능하게 하는 coverage gap이다.

#### DBG-F002 — Pages base와 현재 origin repository identity가 일치하지 않는다

- Pass: Debug / Engineering Quality
- Pattern: `BUILD-001`, `ARCH-002`
- Area: deployment boundary / repository protection
- Severity: Major
- Status: Confirmed
- Summary: 코드의 canonical base는 `/design_sample_selector_2/`인데 현재 `origin`은 `_2` 없는 `design_sample_selector` 저장소다. 또한 workflow는 `main` push마다 이 origin에서 곧바로 Pages deploy를 수행한다.
- Evidence:
  - `git remote -v` — fetch/push 모두 `git@github.com:Yupkidangju/design_sample_selector.git`.
  - `project.config.js:6-7` — `PROJECT_SLUG = 'design_sample_selector_2'`, `PROJECT_BASE = '/design_sample_selector_2/'`.
  - `vite.config.js:1-5,27-31` — Vite base가 중앙 `_2` base를 사용.
  - `.github/workflows/deploy-pages.yml:3-6` — `push` to `main` 및 manual trigger.
  - `.github/workflows/deploy-pages.yml:33-50` — 검사 후 동일 repository의 Pages artifact를 deploy.
- Expected Basis: 중앙 project identity, Vite/Pages base 계약, 원본 저장소 보호 및 사용자가 지정한 remote/deploy boundary 확인 요구. repository project Pages의 기본 URL을 사용할 경우 repository slug와 artifact base가 일치해야 한다.
- Actual: 저장소 identity는 `design_sample_selector`이고 생성 링크/base는 `_2`다. 따라서 별도 custom domain 또는 Pages path override가 없다면 배포된 링크가 기본 project path와 불일치한다. local workflow에는 remote/repository identity assertion도 없다.
- Impact: `_2` 하위 URL로 생성된 asset·history·recovery 링크가 실제 Pages root에서 404 또는 잘못된 경로로 해석될 수 있다. 더 나아가 `_2` 작업 브랜치의 `main` push가 원본 repository의 Pages를 자동 갱신하므로 원본 보호 경계가 깨질 수 있다.
- Suggested Action: 의도에 따라 (a) 원본 repository와 base를 함께 `_2` identity로 정렬하거나, (b) base를 실제 `design_sample_selector` Pages path로 되돌린다. 배포 전 repository slug/expected base를 비교하는 fail-closed assertion을 workflow에 추가하고, 원본 remote를 보호해야 한다면 fork/별도 repository와 branch protection을 명시한다.
- Re-audit Method: GitHub repository/Pages Settings에서 실제 project URL·custom domain·source를 확인하고, workflow checkout repository와 expected base assertion을 검증한다. clean build artifact의 `index.html`·manifest 모든 URL이 실제 Pages root에서 resolve되는지 production-like smoke test를 수행한다.
- Confidence: High for the local mismatch; Medium for live 404 because external Pages/custom-domain settings were intentionally not inspected.
- Notes: 로컬 증거만으로 실제 배포 URL을 단정하지 않는다. 단, mismatch 자체와 자동 deploy trigger는 확정 사실이다.

#### CI-F001 — pull request용 quality gate가 workflow에 보이지 않는다

- Pass: Debug / Engineering Quality
- Pattern: `TEST-001`, `BUILD-001`
- Area: CI quality gate / change control
- Severity: Info
- Status: Needs Clarification
- Summary: Pages workflow는 `main` push와 수동 실행에서만 동작한다. `pull_request` trigger나 별도 PR check는 이 저장소 파일에서 확인되지 않는다.
- Evidence: `.github/workflows/deploy-pages.yml:3-6` — trigger가 `push.branches: [main]` 및 `workflow_dispatch`뿐임.
- Expected Basis: 배포 전 quality gate는 merge 전에 실행되고 required check로 강제되거나, 그 외 branch-protection 정책이 문서화되어야 한다.
- Actual: 직접 `main`에 push된 변경은 workflow에서 검사되지만, PR 단계에서 동일한 check가 자동 실행된다는 로컬 증거가 없다. branch-protection 설정은 제외 범위라 확인할 수 없다.
- Impact: 보호 규칙이 없다면 `npm run check`, artifact 검증, Chrome QA를 거치지 않은 변경이 `main`에 들어가 자동 배포될 수 있다.
- Suggested Action: PR trigger 기반 검증 workflow를 별도 추가하고 required status check/branch protection을 설정하거나, 외부 보호 정책이 이미 있음을 운영 문서에 명시한다. 배포 workflow는 검증된 artifact만 받아 deploy하도록 유지한다.
- Re-audit Method: GitHub Actions event/check run 및 branch protection을 확인하고, PR에서 check가 실행·required 처리되는지 검증한다.
- Confidence: Medium
- Notes: repository Settings를 보지 못했으므로 현재는 정보성·확인 필요 finding이다.

### Pass 3 — Security / Hardening

신규 Critical/Major 보안 finding은 확정하지 않았다. `npm test` 285/285 및 정적 검토에서 state/localStorage 입력 정규화, URL 허용 목록/길이 제한, preview registry 경계와 trusted template 사용에 대한 회귀는 통과했다. 다만 build 산출물과 실브라우저를 실행하지 않았으므로 CSP, 실제 same-origin network, production error surface에 대한 보안 인증으로 해석하지 않는다.

## 6. Cross-Pass Conflicts

- `BUILD_GUIDE.md:234`는 release-manifest hash closure가 검증된다고 서술하지만, `DBG-F001`의 control-flow 결함으로 해당 검증이 수행되지 않는다.
- `spec.md`·`BUILD_GUIDE.md`의 v2.3/current 선언과 package/config·`implementation_summary.md`의 v2.4/_2 선언이 충돌한다(`IMP-F001`). 이 상태에서는 어느 문서가 승인된 acceptance contract인지 결정할 수 없다.
- 문서의 과거 Chrome/build/bundle 기준선은 이번 안전 제약으로 독립 재실행하지 못했으며, 실제 테스트 수 285와도 다르다. 과거 생성 evidence를 현재 PASS의 근거로 승격하지 않았다.

## 7. Positive Checks and No-Finding Areas

- package-lock parity 및 `npm ci --dry-run --ignore-scripts`는 통과했다.
- 130개 JavaScript 파일 syntax check는 모두 통과했다.
- catalog는 오류 0개, legacy warning 56개로 `validate:catalog` exit 0이다. warning은 기존 legacy 기준선으로 관찰했으며 이 감사에서 신규 catalog data-integrity 결함으로 판정하지 않았다.
- generated theme freshness는 두 파일 모두 통과했다.
- authoritative Node test run은 285/285 pass였다. sandbox 첫 실행의 `spawnSync EPERM`은 프로젝트 실패가 아니라 실행 환경 제약으로 분리했다.
- `appState.js`의 localStorage 크기/JSON 오류 fallback, canonical ID·bookmark/recent 제한, invalid patch 거부와 `discoveryUrlState.js`의 initial URL/popstate/dispose 흐름을 정적으로 확인했다. 이번 범위에서 재현 가능한 state/localStorage/URL 무결성 결함은 확정하지 않았다.
- `vite.config.js`, browser QA scripts의 중앙 `PROJECT_BASE` 사용은 확인했다. 실제 Chrome QA와 production build는 안전 제약으로 미실행이다.

## 8. Uncertainties and Clarifications Needed

1. `origin`이 의도적으로 원본 repository를 가리키는지, 아니면 `_2` 전용 repository로 교체되어야 하는지 확인 필요.
2. GitHub Pages가 기본 repository project path인지, custom domain/별도 path 설정인지 확인 필요.
3. `spec.md` v2.3이 유지되는 frozen contract인지, package/config v2.4 `_2`가 새 current contract인지 결정 필요.
4. branch protection 및 required check가 외부 GitHub Settings에서 이미 강제되는지 확인 필요.
5. Chrome 실행 파일(`/usr/bin/google-chrome`), Pages environment approval, production CSP/network 결과는 이번 read-only 안전 범위에서 검증하지 않음.

## 9. Required Fixes Before PASS

- `DBG-F001`: release-manifest 검증 블록을 `map()` 바깥으로 이동하고 negative-path 회귀 테스트를 추가.
- `DBG-F002`: repository identity와 `PROJECT_BASE`를 정렬하거나 배포 설정을 명시적으로 검증하는 fail-closed guard를 추가.
- `IMP-F001`: 사양·설계·실행 가이드·구현 요약·README의 current identity/version/test/performance baseline을 하나의 승인된 기준으로 동기화.
- `CI-F001`: PR quality gate/branch protection의 실제 운영 방식을 결정하고 문서 또는 workflow에 고정.
- 수정 후 fresh build, artifact verifier, bundle analysis, Chrome Pages/recovery QA를 산출물 쓰기 안전성을 확인한 뒤 실행.

## 10. Final Decision

**REWORK REQUIRED / HOLD — PASS 아님.**

전체 Node 테스트와 정적 기본 검증은 통과했지만, release-manifest 무결성 검증이 실제로 우회되는 확정 Major 결함이 있다. remote/base 배포 identity mismatch도 확정되어 실제 Pages 설정 확인 또는 정렬이 필요하다. 문서 authority/version drift는 승인된 계약을 판정하지 못하게 하며, PR gate는 외부 설정 확인 전까지 미확정이다. 위 항목을 해소하고 fresh artifact·browser evidence로 재감사해야 최종 PASS를 고려할 수 있다.

