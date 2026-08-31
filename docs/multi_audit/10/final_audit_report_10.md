# Final Multi-Audit Report

## 1. Audit Metadata

- Audit Turn: 10
- Audit Date: 2026-08-31 (Asia/Seoul)
- Project Root: `/home/eunho1/Projects/web/design_sample_selector`
- Audit Mode: Standard-backed multi-audit, read-only product audit
- Standard: `/home/eunho1/Projects/web/design_sample_selector/AI_AUDIT_DOC_STANDARD.md`
- User Runtime: Crostini on Chromebook, Linux Google Chrome installed
- Live Target: `https://yupkidangju.github.io/design_sample_selector/`
- Final Decision: **REWORK REQUIRED / GitHub Pages HOLD**
- Product Changes: 없음. 이번 실행은 `docs/multi_audit/10/` 감사 산출물만 생성했다.

## 2. User Goal and Decision Basis

사용자가 보고한 다음 세 증상을 더 깊게 재감사했다.

1. 디자인 시안에서 “미리보기를 불러오지 못했습니다”가 표시됨
2. “다시 시도”를 눌러도 복구되지 않음
3. 더블클릭 시 상세 시안을 불러오지 못함

판정 기준은 문서상 Preview/Detail 복구 계약, 실제 소스 및 Vite 산출물의 모듈 그래프, GitHub Pages 라이브 응답, Node·빌드·카탈로그·번들·취약점 게이트, Chrome QA가 실제 실패 지점을 검출하는지 여부다. 다수 의견이 아니라 파일·HTTP 응답·명령 결과를 기준으로 통합했다.

## 3. Scope and Exclusions

조사 범위:

- Peek, Confirm/Dock, Detail, Split의 진입·렌더·실패·재시도·취소 경로
- lazy module loader와 transitive JS/CSS 의존 그래프
- Main Gallery 및 Peek의 더블클릭·Enter 계약
- Detail mount와 상태 구독 lifecycle
- Vite `dist`와 GitHub Pages 실제 게시 파일의 차이
- 기존 Node·Chrome·번들 검증의 회귀 검출력
- 오류 노출, 입력 신뢰 경계, 캐시·배포 회복성

제외 또는 제한:

- 소스·테스트·설정·제품 문서 수정은 감사 모드 계약상 수행하지 않았다.
- Google Chrome 프로세스가 실행 중이지 않았고 새 브라우저 실행 권한을 받지 않아 실제 화면 클릭·콘솔·스크린샷 감사까지는 수행하지 않았다.
- GitHub Pages Settings 화면과 Actions 실행 이력은 저장소에 없으므로 직접 확인하지 않았다. 대신 라이브 사이트의 문서 본문, 파일 해시, MIME, 상태 코드를 확인했다.
- CSP·Google Fonts의 실제 운영 응답 정책은 이번 장애 원인 범위 밖이며 별도 운영 확인 항목으로 유지한다.

## 4. Work-Surface Inventory

| Work Surface | 핵심 질문 | 대표 증거 |
| --- | --- | --- |
| Pages entry/artifact | 운영이 source인가 `dist`인가 | live `index.html`, asset status/MIME/hash, `.gitignore`, workflow 부재 |
| Preview loader | retry가 실패한 전체 graph를 우회하는가 | `lazyPreviewLoader.js`, primary/retry entry, built chunks |
| Shared component/CSS | Preview와 Detail이 같은 실패점을 공유하는가 | `componentEntry.js`, `archetypeTemplates.js`, Detail chunks |
| Detail lifecycle | import/render/hydrate 실패 후 재시도가 깨끗한가 | `main.js`, `detailView.js`, `appState.js` |
| Interaction | 표시된 dblclick/Enter가 실제 Detail로 이어지는가 | `mainView.js`, `peekPreview.js`, `selectionDock.js` |
| QA detection | 기존 1,920-state/Node PASS가 실장애를 검출하는가 | `verifyRenderScalabilityChrome.js`, Node tests, archived report |
| Deployment resilience | lazy closure·atomic publish·cache가 보장되는가 | local `dist`, Pages headers, deploy workflow 부재 |
| Security/diagnostics | 실패 원인과 신뢰 경계가 통제되는가 | catch paths, renderer/catalog validation, offline audit |

## 5. Agent Allocation and Rationale

| Report | Perspective | Rationale | Completion |
| --- | --- | --- | --- |
| `sub_audit_01_contract_ui.md` | 계약·UI·기능 정합성 | 사용자에게 보이는 동작과 문서/구현의 양방향 대조 | Complete |
| `sub_audit_02_runtime_recovery.md` | 런타임·복구 lifecycle | lazy graph, retry state, Detail bootstrap, 누수 분석 | Complete |
| `sub_audit_03_security_resilience.md` | 보안·회복성 | 무제한 retry, trust boundary, 저장상태, 진단 노출 점검 | Complete |
| `sub_audit_02_runtime_recovery_supplement_1.md` | GitHub Pages 배포 보완 | 사용자 추가 정보에 따라 source/dist·subpath·artifact closure 점검 | Complete |

세 관점은 독립적으로 수행했고, 보완 보고서는 GitHub Pages라는 새 배포 사실만 추가 조사했다.

## 6. Immutable Source Report Manifest

- Manifest: `/home/eunho1/Projects/web/design_sample_selector/docs/multi_audit/10/source_report_manifest.json`
- Sidecar: `/home/eunho1/Projects/web/design_sample_selector/docs/multi_audit/10/source_report_manifest.sha256.json`
- Final Manifest SHA-256: `7e62601b02ea496f1dea03af174fab2b6937bfc25cc5c744cd305276d8ff6d6b`
- `missing_source_reports`: `[]`

| Report | Perspective | SHA-256 | Size | Completion | Supplement Of |
| --- | --- | --- | ---: | --- | --- |
| `sub_audit_01_contract_ui.md` | Contract/UI | `43a3c3d4b62b4ee2a43d92df780fa84fbbab72a9adb5c3ade958af86f416fa14` | 31,385 | Complete/Sealed | None |
| `sub_audit_02_runtime_recovery.md` | Runtime/Recovery | `a9049430334b9d1b04d75e1fd25c77593136493c1a8050de0eaafdcd3d404749` | 26,392 | Complete/Sealed | None |
| `sub_audit_02_runtime_recovery_supplement_1.md` | Pages/Artifact | `6166d6e44a4d4b3701fb3b1981bad3b151c64a4ba7a1ce307d065834a58f128e` | 26,710 | Complete/Sealed | Runtime/Recovery |
| `sub_audit_03_security_resilience.md` | Security/Resilience | `9a0802dafa7021d088a1b7c941cfac7196486b5c04f45250920811c995d78da5` | 31,265 | Complete/Sealed | None |

`report_integrity.py finalize` 후 `verify`를 실행했고 모든 원본이 `verified`, manifest와 sidecar는 mode `0400`으로 봉인되었다.

## 7. Evidence and Commands

### 7.1 Local quality gates

| Check | Result |
| --- | --- |
| Focused Node tests | 54/54 PASS |
| Full `npm test` | 180/180 PASS |
| Vite build | 76 modules |
| Catalog validation | errors 0, legacy warnings 56 |
| Initial bundle | JS 88.60/88.98 kB, CSS 32.86/33.00 kB gzip, PASS |
| `npm audit --omit=dev --offline` | vulnerabilities 0 |
| Local `dist` closure | relative JS edges missing 0; referenced lazy JS/CSS present |
| Local static HTTP | tested initial/lazy/shared JS/CSS all 200 with expected MIME |

이 결과는 로컬 소스·현재 `dist` 자체는 빌드 가능함을 보여 주지만, 운영 Pages가 같은 `dist`를 게시했다는 증거는 아니다.

### 7.2 Live GitHub Pages direct evidence

- Live document는 HTTP 200, `GitHub.com` Pages 응답, `cache-control: max-age=600`이었다.
- live `index.html` SHA-256은 로컬 source `index.html`과 일치했고 `./src/main.js`, `./index.css`, `./src/styles/...`를 참조했다.
- live `/src/main.js`, `/src/components/lazyPreviewLoader.js`, `/src/preview/componentEntry.js`도 로컬 source와 각각 SHA-256이 일치했다.
- `/design_sample_selector/assets/index-3kCMrGOG.js`는 404였다. 즉 현재 local Vite `dist`의 hashed entry는 live release에 없다.
- source JS는 `application/javascript`, 세 source CSS는 `text/css`로 200 응답했다.
- `componentEntry.js:9-15`는 브라우저에서 CSS 세 파일을 JavaScript module로 `import()`한다. Vite build에서는 CSS preload/asset으로 변환되지만 native ESM source 서빙에서는 CSS MIME 때문에 module evaluation이 실패한다.

핵심 live 검사 대상:

```text
https://yupkidangju.github.io/design_sample_selector/
https://yupkidangju.github.io/design_sample_selector/src/main.js
https://yupkidangju.github.io/design_sample_selector/src/preview/componentEntry.js
https://yupkidangju.github.io/design_sample_selector/src/styles/themeTokensExpansion.css
https://yupkidangju.github.io/design_sample_selector/assets/index-3kCMrGOG.js
```

### 7.3 Module graph evidence

- `componentLazyEntry.js`와 `componentLazyRetryEntry.js`는 모두 동일한 `componentEntry.js`를 import한다.
- Detail의 `archetypeTemplates.js`도 동일한 `componentEntry.js`를 정적으로 import한다.
- built primary/retry wrapper도 동일한 `componentEntry-CCuwUcTq.js`를 공유한다.
- 두 built Detail chunk는 byte-identical이며 동일 shared entry와 `inspectorState`를 import한다.
- loader를 연속 실패시키는 읽기 전용 시뮬레이션 결과는 `primary → retry-1 → retry-1 → retry-1`이었다. 두 번째 importer 실패 뒤 terminal/cooldown이 없다.

### 7.4 Test detection evidence

- Chrome fault injection은 `*componentLazyEntry*` outer wrapper만 차단한다.
- exact retry URL 성공, shared `componentEntry`, async CSS, Detail dependency 실패를 주입하지 않는다.
- archived PASS 증거도 245-byte primary wrapper 1건 차단만 확인했으며 shared graph는 정상 로드되었다.
- initial bundle 분석은 `dist/index.html`의 초기 참조만 검사해 lazy/retry/shared asset 누락을 green으로 남길 수 있다.

### 7.5 Authoritative deployment basis

- Vite 공식 문서는 GitHub Pages에 source root가 아니라 build 후 `dist` artifact를 Actions로 올리는 절차와 project site의 `base` 설정을 안내한다: <https://vite.dev/guide/static-deploy>
- GitHub 공식 문서는 custom build가 필요한 site는 GitHub Actions publishing source와 `upload-pages-artifact`/`deploy-pages` workflow를 사용하도록 설명한다: <https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site>

## 8. Coverage Gap Check

| Work Surface / Audit Question | Assigned Agents | Evidence | Coverage | Follow-up |
| --- | --- | --- | --- | --- |
| Live Pages가 source인가 `dist`인가 | Runtime supplement, Main | live body/hash/status/MIME/404 | Covered | 수정 후 live hash 재검증 |
| Preview load와 retry transitive graph | Contract, Runtime, Security, Main | source/build graph, loader simulation | Covered | 실패점별 브라우저 fixture |
| Main Gallery dblclick/Enter | Contract, Main | event handlers, tests/scripts | Covered | 수정 후 real input smoke |
| Peek가 안내한 dblclick/Enter | Contract, Main | rendered hint와 listener 대조 | Covered | native control 기준 재감사 |
| Detail/Split component recovery | Contract, Runtime, Main | import graph, Detail loader path | Covered | shared dependency fault injection |
| Detail render/hydrate rollback | Runtime, Main | subscription timing과 catch path | Covered | listener-count 회귀 검사 |
| Existing QA false-green 여부 | Contract, Runtime, supplement, Main | scripts, archived report, test scope | Covered | Pages-like QA 추가 |
| stale/concurrent view transition | Runtime, Security | request token/stale guards 정적 증거 | Partially Covered | 실제 Chrome stress 필요 |
| 실제 시각 레이아웃·focus·a11y tree | Contract | source contract만 확인; Chrome 미실행 | Partially Covered | Chrome 실행 후 screenshot/AX 검사 |
| Catalog HTML trust boundary | Security, Main | validator/renderer source | Covered | enforceable validator test |
| localStorage/state size limits | Security | contract 부재 확인 | Partially Covered | 제품 한도 결정 필요 |
| CSP/Google Fonts live policy | None | 이번 핵심 장애와 독립 | Excluded | 배포 운영 감사에서 확인 |

Chrome 실화면 항목은 부분 공백이지만, 핵심 장애는 live source artifact와 module graph에서 직접 확정되었다. 이미 여러 Major 차단 finding이 있어 이 공백과 무관하게 PASS 계열 판정은 불가능하다.

## 9. Canonical Findings

### [FIN-F001] GitHub Pages가 Vite `dist`가 아닌 source root를 게시해 Preview와 Detail module evaluation이 실패함

- Sources: A10-F006; A10-S02-SUP1-F001, F002; SEC-F005
- Areas: Deployment, module MIME, Preview/Detail
- Severity: Major
- Status: Confirmed
- Summary: 라이브 Pages가 source `index.html`과 `src` module을 그대로 제공한다. `componentEntry.js`의 CSS `import()`는 Vite 변환 없이 native ESM에서 평가되어 Preview/Detail 공통 graph를 실패시킨다.
- Verified Evidence: live/local source SHA 일치, source entry 200, hashed dist entry 404, CSS `text/css`, `componentEntry.js:9-15`의 top-level CSS imports.
- Expected Basis: Pages에는 Vite build artifact 전체가 게시되어야 한다.
- Actual: source root가 게시되어 initial gallery는 열릴 수 있지만 component renderer를 처음 요구하는 Peek/Confirm/Detail에서 실패한다.
- Impact: 사용자의 세 증상을 하나의 운영 원인으로 직접 설명한다.
- Required Action: Pages publishing source를 재현 가능한 Actions workflow로 고정하고 `npm ci → npm run build → dist 전체 upload/deploy`를 수행한다. 지원 base/subpath도 workflow와 함께 검증한다.
- Re-audit Method: live document가 hashed `assets/index-*.js`를 참조하고 source `/src/main.js`가 entry가 아니며 모든 lazy JS/CSS가 200/정상 MIME인지 확인한다.
- Synthesis Rationale: 보완 감사의 조건부 finding을 메인 live 검증으로 Confirmed로 승격했다.

### [FIN-F002] Retry가 실패한 shared dependency graph를 우회하지 못하고 마지막 retry를 무제한 반복함

- Sources: A10-F001; A10-S02-F001; SEC-F001, SEC-F002
- Areas: Recovery, module cache, bounded retry
- Severity: Major
- Status: Confirmed
- Summary: primary/retry outer URL은 다르지만 둘 다 같은 `componentEntry`와 CSS를 공유한다. importer index는 끝에 고정되어 이후 클릭마다 같은 retry를 반복한다.
- Verified Evidence: `lazyPreviewLoader.js:8-21,31-39`, primary/retry source와 built graph, `primary → retry-1 → retry-1 → retry-1` simulation.
- Expected Basis: retry는 실제 실패 지점을 무효화하거나 복구 불가 terminal 상태를 명확히 보여야 한다.
- Actual: Pages source graph에서는 Retry가 동일 실패 dependency를 재사용하므로 사용자가 무응답으로 인식한다.
- Impact: 일시적·공유 의존 실패가 안정적으로 복구되지 않고 요청/오류만 반복될 수 있다.
- Required Action: attempt별 복구 경계와 최대 횟수/terminal/cooldown을 정의하고 import·render·hydrate 오류를 구분한다.
- Re-audit Method: outer entry, shared JS, 각 CSS, Detail dependency를 한 번씩 실패시켜 한 번의 retry로 성공하거나 명시적 terminal 상태가 되는지 확인한다.
- Synthesis Rationale: 네 보고서의 동일 root를 병합했다.

### [FIN-F003] Detail/Split renderer가 중앙 component recovery 계약을 우회함

- Sources: A10-F002
- Areas: Architecture, Detail/Split recovery
- Severity: Major
- Status: Confirmed
- Summary: Detail/Split은 `getArchetypeHTML()`을 통해 `componentEntry`를 직접 사용하며 `loadComponentPreviewModule()` 경계를 거치지 않는다.
- Verified Evidence: `detailView.js`→`archetypeTemplates.js:7`→`componentEntry.js`; 중앙 loader 호출은 Peek/Dock에 한정된다.
- Expected Basis: 문서는 Detail/Split/Peek/Confirm이 동일한 retryable renderer 경계를 공유한다고 기술한다.
- Actual: Detail은 전체 module import 실패로만 처리되어 component-specific recovery가 없다.
- Impact: shared component/CSS 실패가 Detail 전체 로딩 실패로 확대되고 문서와 구현의 복구 계약이 다르다.
- Required Action: 중앙 recovery 경계를 Detail/Split까지 일치시키거나 Detail module을 유일 경계로 재정의해 문서·UI·테스트를 동기화한다.
- Re-audit Method: Detail/Split 각 viewport에서 component dependency failure와 recovery UI를 검증한다.
- Synthesis Rationale: 단독 finding이나 호출 graph가 명확해 채택했다.

### [FIN-F004] Peek의 더블클릭·Enter 안내가 구현되지 않음

- Sources: A10-F003
- Areas: Interaction, accessibility, UI contract
- Severity: Major
- Status: Confirmed
- Summary: Peek는 “더블클릭으로 자세히 · Enter 열기”를 표시하지만 click-select listener만 있으며 focus 가능한 open control, dblclick, keydown이 없다.
- Verified Evidence: `peekPreview.js:89-111`; 대조군인 `mainView.js:349-353,417-420`에는 실제 Detail 진입 handler가 있다.
- Expected Basis: 사용자에게 보이는 affordance와 실제 mouse/keyboard 동작이 일치해야 한다.
- Actual: Peek 더블클릭/Enter는 Detail을 열지 않는다.
- Impact: 배포 장애를 고친 뒤에도 Peek 경로에서는 무응답 증상이 남는다.
- Required Action: 명시적 native “상세 보기” control 또는 충돌 없는 dblclick/Enter handler를 추가하고 hint를 동기화한다.
- Re-audit Method: real mouse double click, keyboard Enter, mock action event isolation, focus return을 검사한다.
- Synthesis Rationale: Main Gallery handler 존재가 Peek 결함을 반증하지 않는다.

### [FIN-F005] 기존 Node·Chrome·bundle PASS가 실제 Pages/lazy 실패를 검출하지 못함

- Sources: A10-F004; A10-S02-F004, F005; A10-S02-SUP1-F005
- Areas: QA, deployment verification, false green
- Severity: Major
- Status: Confirmed
- Summary: 현 QA는 outer wrapper failure와 initial assets를 주로 검사하며 live Pages source/dist, shared JS/CSS, actual retry URL, Detail transitive failure를 검증하지 않는다.
- Verified Evidence: fault pattern `*componentLazyEntry*`, resource assertion 범위, initial bundle collector, live source root와 local tests의 동시 PASS.
- Expected Basis: 완료 증거는 사용자가 밟는 production graph와 failure/recovery path를 재현해야 한다.
- Actual: 180/180과 1,920-state 기록이 있어도 live 핵심 기능은 실패한다.
- Impact: 회귀가 green 상태로 배포될 수 있고 이전 “모든 기능 정상” 결론은 운영 Pages 범위에 유효하지 않다.
- Required Action: built artifact를 project-site subpath에서 서빙해 exact fault matrix와 실제 two-click retry를 검증하고 live smoke를 별도 gate로 둔다.
- Re-audit Method: 정상/누락/오류-MIME fixture 및 live URL에서 Preview·Retry·Detail·Split을 검증한다.
- Synthesis Rationale: 테스트 실패가 아니라 검출 범위 실패로 통합했다.

### [FIN-F006] import 이후 render/hydrate 실패의 rollback이 비트랜잭션이며 Detail listener가 누적될 수 있음

- Sources: A10-F005; A10-S02-F002, F003
- Areas: Mount lifecycle, memory/state consistency
- Severity: Major
- Status: Confirmed (structural), live occurrence not observed
- Summary: import가 resolve된 뒤 render가 throw하면 loader의 resolved Promise를 재사용한다. Detail은 subscribe 시 즉시 callback을 실행하고 disposer를 보존하지 않아 bootstrap throw 시 listener가 남을 수 있다.
- Verified Evidence: `main.js:204-218`, `appState.js:375-378`, `detailView.js:1494`.
- Expected Basis: mount는 성공 시에만 구독/handler를 commit하고 실패 시 전부 rollback해야 한다.
- Actual: retry가 같은 module/render를 반복하고 실패한 mount의 listener를 제거할 보장도 없다.
- Impact: 별도 renderer 예외가 발생하면 재시도마다 중복 update·오류가 누적될 수 있다.
- Required Action: transactional mount/disposer와 import/render/hydrate별 invalidation을 정의한다.
- Re-audit Method: 초기 update를 의도적으로 throw시키고 listener/handler 수가 baseline으로 복귀하는지 검사한다.
- Synthesis Rationale: 동일 mount rollback root로 병합했다.

### [FIN-F007] 구조화된 오류 원인이 소비자 catch에서 사라짐

- Sources: A10-S02-F006
- Areas: Diagnostics, supportability
- Severity: Major
- Status: Confirmed
- Summary: lazy 소비자가 bare `catch`로 import/render 원인을 동일 generic UI로 바꾸며 URL·phase·attempt 같은 안전한 진단 신호를 남기지 않는다.
- Verified Evidence: `main.js:216-219` 및 Peek/Dock 소비자 catch 흐름 직접 확인.
- Expected Basis: 사용자에게 내부 정보를 노출하지 않으면서 운영 로그에는 실패 phase와 attempt를 식별할 수 있어야 한다.
- Actual: 사용자 메시지는 안전하지만 원인 분류와 회귀 추적이 불가능하다.
- Impact: Pages source/MIME, 404, render exception을 같은 증상으로 보게 되어 복구와 감지가 늦어진다.
- Required Action: 비민감 error code, phase, attempt, resource class를 구조화하고 사용자 UI와 진단 기록을 분리한다.
- Re-audit Method: 네트워크·MIME·render·hydrate fixture가 서로 다른 안전한 diagnostic code를 생성하는지 확인한다.
- Synthesis Rationale: 단독 finding이나 현재 장애의 관측성 결함으로 직접 확인했다.

### [FIN-F008] Pages artifact의 atomicity·이전 해시 보존·cache 계약이 없음

- Sources: A10-S02-SUP1-F003; SEC-F005
- Areas: Deployment resilience, caching
- Severity: Major
- Status: Probable
- Summary: local `dist` closure는 완전하지만 저장소에 release artifact provenance, atomic publish, old hashed asset grace retention 계약이 없다.
- Verified Evidence: workflow/manifest 부재, `dist/` ignored, live HTML `max-age=600`; mixed-version 실제 발생은 관찰하지 않았다.
- Expected Basis: 한 release의 HTML과 모든 lazy asset은 함께 게시되고 cached old HTML의 해시 참조도 안전해야 한다.
- Actual: 현재 운영은 source publish라 이 위험보다 FIN-F001이 먼저 발생한다.
- Impact: source publish를 고친 뒤에도 부분 업로드나 stale HTML로 lazy-only 404가 재발할 수 있다.
- Required Action: directory artifact 단위 deploy, cache policy, closure manifest, release SHA를 고정한다.
- Re-audit Method: old/new artifact 혼합 및 lazy/shared chunk 누락 fixture가 deploy gate에서 차단되는지 확인한다.
- Synthesis Rationale: 계약 부재는 확인했지만 실제 mixed release는 미관찰이므로 Probable로 유지했다.

### [FIN-F009] project-site deep path와 production QA base 경계가 명시되지 않음

- Sources: A10-S02-SUP1-F004
- Areas: URL/base, Pages routing
- Severity: Minor
- Status: Confirmed
- Summary: `base: './'`는 `/design_sample_selector/` root에서는 가능하지만 deep pathname과 local `/src` 절대 import 기반 QA는 production subpath를 보장하지 않는다.
- Required Action: 지원 URL을 root+query/hash로 명시하거나 Pages fallback을 설계하고 QA에 production base URL을 주입한다.

### [FIN-F010] Catalog/renderer HTML trust boundary가 기계적으로 강제되지 않음

- Sources: SEC-F003
- Areas: Security, renderer contract
- Severity: Minor
- Status: Confirmed
- Summary: 현재 catalog는 정적 내부 데이터라 즉시 exploit은 확인되지 않았지만 HTML renderer 경계의 validator/registry 강제가 없다.
- Required Action: 신뢰 가능한 renderer 출력과 escape/sanitize 책임을 계약·테스트로 고정한다.

### [FIN-F011] localStorage/state 입력 크기 예산이 미정임

- Sources: SEC-F004
- Areas: Resilience, storage
- Severity: Info
- Status: Needs Clarification
- Summary: 현재 사용자 상태 크기 상한과 oversized/corrupt payload 처리 계약이 명시되지 않았다.
- Required Action: 실제 저장 payload 규모와 제품 요구에 맞춰 상한·복구 기준을 결정한다.

## 10. Critical/Major Direct Re-verification

| Canonical Finding | Directly Checked By Main | Evidence Re-opened or Command Re-run | Result | Gate Impact |
| --- | --- | --- | --- | --- |
| FIN-F001 | Yes | live body/hash/MIME/404, `componentEntry.js` | Confirmed | PASS 차단 |
| FIN-F002 | Yes | loader/source/build graph, attempt simulation | Confirmed | PASS 차단 |
| FIN-F003 | Yes | Detail→archetype→component import chain | Confirmed | PASS 차단 |
| FIN-F004 | Yes | Peek/Main handlers 직접 대조 | Confirmed | PASS 차단 |
| FIN-F005 | Yes | Chrome script pattern, archived resources, bundle analyzer | Confirmed | PASS 차단 |
| FIN-F006 | Yes | subscribe immediate callback와 disposer 부재 | Confirmed structural | PASS 차단 |
| FIN-F007 | Yes | lazy catch consumers 재확인 | Confirmed | PASS 차단 |
| FIN-F008 | Yes | workflow/manifest 부재, live cache header | Probable; mixed release unobserved | 재배포 PASS 차단 |

Critical finding은 없다. 다만 핵심 운영 기능을 차단하는 Confirmed Major가 7건이므로 PASS 계열 판정은 불가하다.

## 11. Cross-Report Conflicts

1. Pages source-root 원인은 보완 보고서에서 live 설정 미확인 때문에 `Probable`이었으나, 메인 모델이 실제 live body와 로컬 source hash 일치 및 dist hashed entry 404를 확인해 `Confirmed`로 승격했다.
2. `base: './'` 자체는 project-site root에서 반드시 오류라고 볼 수 없다. FIN-F001의 원인은 base가 아니라 source root 게시다. deep path는 별도 Minor로 유지한다.
3. local `dist`는 정적 closure와 MIME 검사에 통과했다. 따라서 “현재 local build artifact가 깨졌다”는 해석은 기각한다. 문제는 live 게시 artifact와 복구/QA 계약이다.
4. Main Gallery tile에는 dblclick/Enter handler가 존재한다. “더블클릭 handler가 전혀 없음”은 기각하고, Peek에 표시된 affordance 누락과 Detail module graph 실패를 분리했다.
5. stale/mixed hashed release는 실제 live 원인으로 관찰되지 않았다. 배포 계약 부재에 따른 Probable risk로만 유지한다.

## 12. Finding Adjudication Ledger

| Source Finding | Decision | Canonical Finding | Rationale |
| --- | --- | --- | --- |
| A10-F001 | Merged | FIN-F002 | shared dependency retry root |
| A10-F002 | Accepted | FIN-F003 | 호출 graph 직접 확인 |
| A10-F003 | Accepted | FIN-F004 | visible hint/handler 불일치 |
| A10-F004 | Merged | FIN-F005 | false-green QA root |
| A10-F005 | Merged | FIN-F006 | resolved loader/mount rollback root |
| A10-F006 | Merged/Upgraded | FIN-F001 | live Pages로 조건 확정 |
| A10-S02-F001 | Merged | FIN-F002 | transitive URL 공유 |
| A10-S02-F002 | Merged | FIN-F006 | render/hydrate retry |
| A10-S02-F003 | Merged | FIN-F006 | subscription rollback |
| A10-S02-F004 | Merged | FIN-F005 | fault matrix 누락 |
| A10-S02-F005 | Merged | FIN-F005 | Node false green |
| A10-S02-F006 | Accepted | FIN-F007 | 진단 원인 소실 |
| A10-S02-SUP1-F001 | Merged | FIN-F001 | deploy artifact 계약/실제 source publish |
| A10-S02-SUP1-F002 | Merged/Upgraded | FIN-F001 | live 증거로 Confirmed |
| A10-S02-SUP1-F003 | Accepted | FIN-F008 | 실제 mixed release는 미관찰 |
| A10-S02-SUP1-F004 | Accepted | FIN-F009 | root base와 deep path 구분 |
| A10-S02-SUP1-F005 | Merged | FIN-F005 | lazy closure gate 누락 |
| SEC-F001 | Merged | FIN-F002 | 공통 dependency failure |
| SEC-F002 | Merged | FIN-F002 | 무제한 last retry |
| SEC-F003 | Accepted | FIN-F010 | 현재 exploit은 미확인 |
| SEC-F004 | Accepted/Unresolved | FIN-F011 | 제품 한도 결정 필요 |
| SEC-F005 | Merged | FIN-F001, FIN-F008 | live publish와 미래 atomicity 분리 |

## 13. Required Actions Before Passing

우선순위 순서:

1. **P0 — Pages 배포 교정:** GitHub Pages source를 Actions로 바꾸고 clean install/build 후 `dist` 전체를 하나의 artifact로 게시한다. live entry가 hashed asset을 가리키는지 확인한다.
2. **P0 — 운영 smoke:** 실제 `/design_sample_selector/`에서 Peek, Confirm/Dock, Main dblclick/Enter, Detail, Split, Retry를 fresh/cache context로 실행한다.
3. **P1 — Retry 재설계:** shared JS/CSS 실패까지 복구하거나 bounded terminal로 끝나는 attempt state machine을 정의한다.
4. **P1 — Peek 상호작용 수정:** 표시된 더블클릭/Enter를 실제 Detail 진입과 연결하고 focus 가능한 native control을 제공한다.
5. **P1 — Detail transactional mount:** 실패한 subscribe/handler/DOM을 rollback하고 disposer를 보존한다.
6. **P1 — QA fault matrix:** primary/retry outer, shared entry, 각 CSS, Detail import, render/hydrate를 각각 실패시키고 exact retry URL과 실제 renderer success를 확인한다.
7. **P1 — Artifact closure gate:** initial뿐 아니라 모든 dynamic/lazy/retry JS 및 CSS를 재귀 수집해 존재·HTTP 200·MIME·release SHA를 검증한다.
8. **P2 — Diagnostics:** 사용자 메시지와 분리된 안전한 phase/attempt/error code를 기록한다.
9. **P2 — 문서 동기화:** 실제 recovery boundary와 Pages deploy 계약을 `spec.md`, 설계 문서, README/BUILD_GUIDE, 감사 roadmap에 반영한다.

## 14. Accepted and Remaining Risks

- Current local `dist`는 complete closure를 보였지만 live에 게시되지 않았으므로 운영 보증으로 수용할 수 없다.
- source publish를 고쳐도 stale cached HTML과 새 asset 혼합 위험이 남는다. atomic artifact와 이전 hashed asset 보존 정책이 필요하다.
- JS/CSS gzip 예산 여유는 각각 약 0.38 kB/0.14 kB로 작아 수정 후 예산 회귀 가능성이 있다.
- legacy catalog warning 56건은 오류 0과 구분해 기존 부채로 유지한다.
- CSP·Google Fonts 운영 정책은 배포 URL/응답 헤더 기준 별도 확인이 필요하다.
- Chrome 실제 화면·focus·AX tree는 재감사 필수다. 이번 판정은 해당 공백을 정상으로 간주하지 않는다.

## 15. Clarifications and Inconclusive Areas

- GitHub Pages Settings의 현재 publishing source가 branch인지 Actions인지는 UI에서 미확인이다. 다만 live 결과가 source root임은 확정했다.
- source root가 의도된 운영 정책인지 단순 설정 실수인지 사용자 결정이 필요하다. Vite 앱 구조상 source direct publish는 지원 가능한 운영 경로가 아니다.
- 임의 deep path(`/design_sample_selector/foo`)를 지원해야 하는지, root+query/hash만 지원할지는 제품 계약이 필요하다.
- state/localStorage 허용 크기는 현재 실제 장애 증거가 없어 미확정이다.
- 실제 Chrome 콘솔의 exact MIME error 문자열은 캡처하지 않았다. 원인 판정은 live MIME과 native module graph에 근거한다.

## 16. Re-audit Checklist

- [ ] Pages workflow가 `npm ci`, `npm run build`, `dist` artifact upload/deploy를 수행함
- [ ] live `index.html`이 `assets/index-<hash>.js`를 참조하고 `/src/main.js`를 entry로 사용하지 않음
- [ ] initial/lazy/retry/shared JS와 CSS가 모두 200 및 올바른 MIME
- [ ] fresh Chrome에서 Preview 최초 로드 성공
- [ ] primary outer failure 후 Retry 1회로 성공
- [ ] shared component entry failure 후 정의된 recovery/terminal 동작
- [ ] 각 async CSS failure 후 정의된 recovery/terminal 동작
- [ ] Main Gallery mouse dblclick와 keyboard Enter로 Detail 성공
- [ ] Peek mouse dblclick와 keyboard Enter/명시적 button으로 Detail 성공
- [ ] Dock/Confirm에서 Detail 성공
- [ ] Detail/Split의 component renderer 및 style transition 성공
- [ ] render/hydrate throw 후 listener/handler 수가 baseline으로 복원됨
- [ ] rapid hover/view switch에서 stale preview가 paint되지 않음
- [ ] exact fault matrix와 Pages-like subpath QA가 CI에서 실행됨
- [ ] 180 Node tests, catalog, build, bundle, offline audit 재통과
- [ ] 운영 CSP·Google Fonts, cache header, release SHA 기록
- [ ] 관련 제품·설계·빌드·감사 문서가 실제 계약과 동기화됨

## 17. Final Decision

**REWORK REQUIRED / GitHub Pages HOLD**

현재 GitHub Pages 배포는 Vite production artifact가 아니라 source root를 직접 제공한다. 이 상태에서 공통 `componentEntry.js`의 CSS dynamic imports가 native browser module graph에서 실패하며, Preview primary/retry와 Detail이 동일 실패점을 공유한다. 따라서 사용자가 보고한 “미리보기 실패 → 다시 시도 무응답 → 더블클릭 상세 실패”는 운영 경로에서 기능적으로 일관된 재현 조건을 가진다.

로컬의 180/180 테스트, 76-module build, catalog errors 0, bundle budget PASS, vulnerabilities 0은 사실이지만 운영 artifact와 실제 failure graph를 검증하지 않아 최종 기능 정상 판정의 근거가 될 수 없다. FIN-F001부터 FIN-F007까지의 Confirmed Major를 수정하고 live Pages 재감사를 통과하기 전에는 배포 적합성 및 전체 기능 정상 동작을 승인할 수 없다.

## 18. Coder Handoff

`/home/eunho1/Projects/web/design_sample_selector/docs/multi_audit/10/final_audit_report_10.md`를 먼저 읽고, 각 finding을 프로젝트 문서와 실제 코드에 대조하여 검증한 뒤 우선순위대로 수정하세요. 계약 변경이 필요하면 관련 문서를 먼저 갱신하고, 수정 후 테스트·빌드·재감사 증거를 기록하세요.
