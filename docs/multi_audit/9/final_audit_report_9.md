# Final Multi-Audit Report

## 1. Audit Metadata

| 항목 | 값 |
| --- | --- |
| Audit Turn | 9 |
| Audit Date | 2026-08-31 (Asia/Seoul) |
| Project | `design_sample_selector` v2.3.0 |
| Project Root | `/home/eunho1/Projects/web/design_sample_selector` |
| Git HEAD | `c9bace3bf069350ac6eace214bc9727798077097` |
| Environment | Chromebook Crostini, Linux Google Chrome `151.0.7922.173`, Node `22.23.2`, npm `10.9.8` |
| Audit Basis | Standard-backed |
| Standard | `/home/eunho1/Projects/web/design_sample_selector/AI_AUDIT_DOC_STANDARD.md` |
| Source Contract | `/home/eunho1/.codex/skills/multi-audit/references/report-contract.md` |
| Final Decision | **HOLD / REWORK REQUIRED** |

이 감사는 읽기 중심 감사다. 제품 소스·테스트·설정·제품 문서는 수정하지 않았고, 지속 변경은 `docs/multi_audit/9/`의 예약·원본·manifest·최종 보고서뿐이다.

## 2. User Goal and Decision Basis

사용자 목표는 기능적으로 동작하지 않거나 디자인 시안이 올바르게 표시되지 않는 페이지를 찾고, 전체 기능이 정상인지 점검하는 것이다. 판정은 다음을 함께 사용했다.

- 현재 승인 계약인 `spec.md`, `designs.md`, `README.md`, `BUILD_GUIDE.md`, `audit_roadmap.md`
- 현재 HEAD의 실제 소스와 테스트가 보존하는 불변조건
- Node 테스트·catalog/theme/build/bundle 검증
- Crostini에 설치된 Linux Chrome 151의 프로젝트 공식 CDP QA 및 메인 집중 재현
- 계약/UI, 런타임/엔지니어링, 보안/복원력의 세 독립 보고서

테스트 통과 수나 감사자 다수결만으로 PASS를 부여하지 않았다. 사용자가 고른 스타일과 실제 renderer가 다른 **Confirmed Major**가 직접 재현되었으므로 전체 정상 동작 주장은 성립하지 않는다.

## 3. Scope and Exclusions

포함 범위:

- 초기 부팅, Grid/Bento/Spectrum, 4페이지 actual 120 도달성
- 검색, category, bookmark, 10 facets, sort, URL reload/`popstate`, empty/reset
- Detail 120 styles, 8 archetypes, Desktop/Mobile, Web 4 tabs, 스타일 전환
- Split, Peek, 선택 Dock/Confirm, Inspector, copy/download/export
- Game/Mobile/E-commerce/Blog/Dashboard/Media/Chat sandbox interaction
- lazy loading/error/retry, focus/keyboard, reduced-motion, observer/timer/audio/canvas 수명
- catalog/theme/build/bundle 계약, localStorage/URL/input/DOM sink, dependency 취약점

제외 또는 한계:

- 외부 배포, 실제 운영 응답 헤더, 서버·인증·DB는 이 정적 클라이언트 저장소에 존재하지 않아 제외했다.
- 사용자의 기본 Chrome 프로필에는 연결하지 않았고, 격리 임시 프로필만 사용했다.
- 120 × 8 × 2 상태는 자동 DOM·크기·진단 매트릭스로 검사했으나, 모든 상태를 사람이 픽셀 단위로 전수 육안 비교한 것은 아니다.
- 실제 Clipboard 권한 프롬프트, screen reader 실기기, 장시간 soak/대량 입력은 직접 실행하지 않았다. 해당 경계는 소스·결정적 프로브로 판정했다.
- 과거 `docs/multi_audit/**`의 결론은 독립 에이전트의 근거로 사용하지 않았다.

## 4. Work-Surface Inventory

| Surface | 주요 파일/증거 | 상태 |
| --- | --- | --- |
| 제품 계약·설계 | `spec.md`, `designs.md`, `README.md`, `BUILD_GUIDE.md`, `audit_roadmap.md` | 조사 완료 |
| 부팅·HTML metadata | `index.html`, `src/main.js` | 조사 완료 |
| Catalog/theme/preview registry | `src/catalog/**`, `src/preview/**`, 생성 theme CSS | 120/120/120 구조 조사 완료 |
| Gallery/discovery | `mainView.js`, discovery state/query/URL, 3 Chrome modes | 자동·소스 조사 완료 |
| Detail/Split/Inspector | `detailView.js`, archetype templates, export helpers | 집중 조사 완료 |
| Peek/Dock/Confirm | `peekPreview.js`, `selectionDock.js` | 집중 Chrome 재현 완료 |
| 8 archetype runtime | `archetypeTemplates.js`, `mockupRuntime.js` | 소스·테스트·대표 런타임 조사 완료 |
| Audio/Canvas/motion | `synthAudio.js`, `audioWidget.js`, `visualEngine.js` | 정상·오류 수명 조사 완료 |
| State/storage/input | `appState.js`, discovery URL, clipboard, text DOM | 경계 조사 완료 |
| 자동 검증 | 14 test files, 4 Chrome QA scripts, build validators | 현재 실행 및 assertion 범위 조사 완료 |
| 배포 보안 헤더 | 저장소 내 hosting 설정 없음 | 운영 환경 미확인 |

## 5. Agent Allocation and Rationale

정확히 세 개의 독립 관점을 사용했다.

| Agent | Perspective | 배정 이유 |
| --- | --- | --- |
| A01 | 계약·문서·기능·UI/시안 정합성 | 사용자가 선택한 시안과 화면 결과, 문서에 약속한 기능을 직접 대조 |
| A02 | 런타임·빌드·테스트·아키텍처·데이터 무결성 | green gate가 실제 상태 전환을 잡는지, 빌드/성능/수명 경계를 검증 |
| A03 | 보안·입력·접근성·오류 복원력 | 실패·권한 거부·비정상 상태·포커스·timer/audio/canvas 경계를 검증 |

세 보고서는 서로의 과거 감사 결론을 읽지 않고 작성했다. 메인이 발견한 두 핵심 후보는 각 에이전트가 자체 소스/실행 근거와 대조하도록 요청했으며, 최종 채택은 메인이 다시 확인했다.

## 6. Immutable Source Report Manifest

- Manifest: `/home/eunho1/Projects/web/design_sample_selector/docs/multi_audit/9/source_report_manifest.json`
- Manifest sidecar: `/home/eunho1/Projects/web/design_sample_selector/docs/multi_audit/9/source_report_manifest.sha256.json`
- Final manifest SHA-256: `03b975a28af9b6314dcc5679bbd3d71512c532903b5f9ef9f63d272a217c051e`
- `missing_source_reports`: `[]`

| Report | Perspective | SHA-256 | Completion | Supplement Of |
| --- | --- | --- | --- | --- |
| `sub_audit_01_contract_ui.md` | A01 계약/UI | `fe7f0f121d3fac0989e2d0f5c1a6f375db1450168992bc03085aa44dba67327c` | Complete/Sealed | None |
| `sub_audit_02_runtime_engineering.md` | A02 런타임/엔지니어링 | `58eef2e8a6099e51dd18d0639c6e53d4b62bd39854f3df9ba8fe0bd0166f3c70` | Complete/Sealed | None |
| `sub_audit_03_security_resilience.md` | A03 보안/복원력 | `ee81fa509df0671bce1886c9ebb100f39b3fb10d1acad6809a0816bc9644d741` | Complete/Sealed | None |

`report_integrity.py finalize`와 통합 직전 `verify`가 세 보고서를 모두 `verified`로 확인했다.

## 7. Evidence and Commands

| 명령/검사 | 현재 결과 | 판정 사용 |
| --- | --- | --- |
| `npm test` | 152/152 pass, 0 fail | 정상 단위 계약 기준선 |
| `npm run validate:catalog` | errors 0, legacy warnings 56 | catalog 구조 통과, 알려진 접근성/출처/대비 부채 유지 |
| `npm run check:themes` | 두 생성 theme CSS current | 생성물 정합성 통과 |
| Vite JS API `build({ write:false })` | Vite 6.4.3, 75 modules, 성공 | 제품 산출물을 쓰지 않은 build 검증 |
| `npm run analyze:bundle` | JS 83.46/88.98kB gzip, CSS 32.86/33.00kB | 번들 예산 통과, CSS 여유 144 bytes |
| `npm audit --omit=dev --offline` | 0 vulnerabilities | local lock metadata 기준 |
| Discovery Chrome QA | 3 modes, 9 scenarios, 6 widths, diagnostics/issues 0 | 검색·필터·URL·반응형 정상 근거 |
| Wave/scalability Chrome QA | 1,920 device states, lazy retry, observer teardown, diagnostics 0 | 폭넓은 정상 경로 근거 |
| A02 catalog120 Chrome QA | interaction max 99ms, LCP 700ms, CLS 0 | 성능 통과 관측 1회 |
| A01 catalog120 Chrome QA | interaction max 245.6ms / 230.9ms | 동시 실행 오염 가능성이 있는 실패 관측 |
| 메인 직렬 catalog120 Chrome QA | catalog/matrix/diagnostics 통과, interaction max 373.4ms, LCP 1188ms, CLS 0 | 현 환경 hard gate 실패 관측 |
| 메인 Chrome 집중 style swap | 새 theme/metadata인데 old Spatial renderer·text 잔존 | FIN-F001 직접 확정 |
| 메인 Chrome Peek/Confirm token 대조 | `data-theme=null`, root fallback `#00F0FF/#0B0F19`; 기대 `#79D7FF/#08101D` | FIN-F002 직접 확정 |

메인 집중 style swap의 핵심 관측은 다음과 같다.

```text
before: theme=spatial-glass-ui, spatialUnit=true, aiUnit=false
after : theme=ai-native-gradient, selectedChip=ai-native-gradient,
        metaTitle=AI 네이티브 그라디언트,
        spatialUnit=true, aiUnit=false,
        Spatial name=true, AI name=false, innerHTML length unchanged
```

공식 1,920-state matrix는 각 상태의 renderer HTML을 직접 생성하는 breadth 검사다. 실제 Detail의 A→B event transition을 거치지 않으며, matrix 내부에서 계산한 일부 overflow 값도 failure 조건에 포함하지 않는다. 따라서 green matrix는 FIN-F001을 반증하지 않는다.

## 8. Coverage Gap Check

| Work Surface / Audit Question | Assigned Agents | Evidence | Coverage | Follow-up |
| --- | --- | --- | --- | --- |
| 실제 120 도달성·3 gallery views | A01, A02 | 공식 Chrome reachability, source/test | Covered | 회귀 재실행 |
| 검색·facet·sort·URL·responsive | A01, A02, A03 | discovery Chrome 9 scenarios/6 widths, URL allowlist | Covered | None |
| 선택 style과 Detail renderer 일치 | A01, A02 + Main | 소스, 순수 renderer 대조, 집중 Chrome 전환 | Covered | FIN-F001 수정/회귀 |
| Peek/Dock/Confirm theme fidelity | A01 + Main | 소스, computed token Chrome 대조 | Covered | FIN-F002 수정/회귀 |
| 8 archetype 핵심 상호작용 | A01, A02 | template/runtime 소스, tests, 대표 Chrome | Partially Covered | 누락된 checkout/reading/keyboard 보강 |
| Inspector/export 선택 일치 | A01, A02 | source/tests, stale viewport HTML 경로 | Covered | style swap 후 4×3 재검증 |
| lazy loading/error/retry/focus | A02, A03 | loader QA, main source, fault-path review | Covered | focus fault injection |
| 입력/DOM/XSS/storage | A03, A01 | allowlist/escape/textContent, probes | Covered | remote catalog 도입 시 재감사 |
| Audio/Canvas/reduced-motion/lifecycle | A02, A03 | Chrome reduced-motion, source/probes | Partially Covered | rejection/null-context fault tests |
| 전체 120×8×2 픽셀 전수 육안 | A01, A02 | 자동 matrix + 대표 PNG만 존재 | Partially Covered | 수정 후 risk-based screenshot set 및 시각 회귀 |
| 실제 배포 CSP/headers | A03 | 저장소에 hosting config 없음 | Not Covered | 배포 URL/플랫폼 제공 후 확인 |

사용자 핵심 목표에 대한 구조·상태 전환 증거는 충분해 추가 supplement는 만들지 않았다. 다만 전수 픽셀 육안과 운영 헤더 공백은 PASS 계열 판정에 사용하지 않았으며 최종 HOLD와 함께 명시한다.

## 9. Canonical Findings

### [FIN-F001] 같은 archetype 스타일 전환 후 이전 renderer와 콘텐츠가 남는다

- Sources: A01-F001, A02-F001, Main focused Chrome reproduction
- Areas: Detail, renderer, motion, inspector/export
- Severity: Major
- Status: Confirmed
- Summary: 스타일 선택 ID·metadata·`data-theme`는 B로 바뀌지만 viewport 내부 renderer HTML은 A로 남는다.
- Verified Evidence: `detailView.js:141-176`은 같은 archetype 변경을 `needThemeSwapOnly`로 보내며 `:587-637`은 theme/metadata만 갱신한다. Chrome에서 `spatial-glass-ui → ai-native-gradient` 후 Spatial root/text가 그대로였고 AI root/text는 없었다.
- Expected Basis: `spec.md`의 canonical style별 distinct visual grammar, 선택/preview single source, Inspector HTML의 현재 viewport 계약.
- Actual: 화면·motion·interaction markup·Inspector HTML이 새 선택과 어긋난다.
- Impact: 사용자가 선택한 것과 다른 시안을 보고 비교·복사·다운로드할 수 있다.
- Required or Suggested Action: 새 renderer를 teardown/hydrate하면서 보존해야 할 local interaction state만 명시적으로 snapshot/migrate한다. core/expansion, 8 archetype, Web 4 tabs의 transition 회귀를 추가한다.
- Re-audit Method: A→B 후 selected ID, root class, style marker/text, motion, Inspector HTML/CSS/JSON/Markdown를 동시에 비교한다.
- Synthesis Rationale: 두 독립 보고서와 메인 실제 Chrome 재현이 같은 실행 불변조건을 확인했다.

### [FIN-F002] Peek와 Confirm이 선택 style 대신 전역 fallback theme를 쓴다

- Sources: A01-F002, Main focused Chrome reproduction
- Areas: Peek, selection Dock/Confirm, theme tokens
- Severity: Major
- Status: Confirmed
- Summary: 두 preview viewport에 `data-theme`가 없어서 선택 style의 token selector가 적용되지 않는다.
- Verified Evidence: `peekPreview.js:28-46,89-101`, `selectionDock.js:111-155`에 theme 설정이 없다. Chrome computed token은 Spatial 기대 `#79D7FF/#08101D`가 아니라 root `#00F0FF/#0B0F19`였다.
- Expected Basis: 선택 style ID와 모든 preview surface의 theme가 같아야 한다는 단일 계약.
- Actual: renderer가 있어도 색상·배경·톤이 다른 시안으로 보인다.
- Impact: 사용자가 잘못된 palette를 보고 스타일을 비교·확정한다.
- Required or Suggested Action: async 삽입 전/교체 시 viewport에 선택 ID를 설정·정리하고 dataset 및 computed token 회귀를 추가한다.
- Re-audit Method: legacy/expansion 대표를 Peek→Confirm으로 열어 theme ID와 13 tokens를 대조한다.
- Synthesis Rationale: 코드 경로와 실제 computed style이 일치한다.

### [FIN-F003] 문서화된 E-commerce checkout modal이 없다

- Sources: A01-F003
- Areas: E-commerce archetype, checkout flow, modal accessibility
- Severity: Major
- Status: Confirmed
- Summary: 문서는 주문/결제 simulation modal을 약속하지만 구현은 성공 toast 후 cart clear/drawer close만 수행한다.
- Verified Evidence: `spec.md:40`, `README.md:150`, `designs.md:305`와 `archetypeTemplates.js:253-362`, `mockupRuntime.js:520-540`을 메인이 재대조했다. checkout dialog markup/생성 경로가 없다.
- Expected Basis: 승인 문서의 core archetype 계약.
- Actual: summary, confirm/cancel, Escape, focus-return 단계가 없다.
- Impact: 8대 핵심 archetype 중 명시 기능 하나가 구현되지 않았다.
- Required or Suggested Action: accessible simulation dialog를 구현하거나, 의도적 범위 변경이면 관련 계약 문서를 먼저 수정·승인한다.
- Re-audit Method: direct buy/cart checkout에서 dialog, summary, confirm/cancel, Escape, focus return, cart state를 검사한다.
- Synthesis Rationale: 문서와 실행 코드의 직접 충돌이다.

### [FIN-F004] Blog reading mode가 class만 바꾸고 시각적으로 동작하지 않는다

- Sources: A01-F004
- Areas: Blog archetype, reading mode, CSS/accessibility state
- Severity: Major
- Status: Confirmed
- Summary: 버튼은 `blog-light-mode`를 토글하지만 해당 class의 CSS가 없다.
- Verified Evidence: `mockupRuntime.js:550-553`에서 class 토글을 확인했고, 전체 제품 CSS 검색에서 override가 없음을 메인이 재확인했다.
- Expected Basis: `spec.md:41`, `README.md:151`의 dark/light reading mode.
- Actual: 클릭 전후 computed background/text가 달라질 규칙이 없고 `aria-pressed`도 없다.
- Impact: 사용자에게는 핵심 Blog 기능이 반응하지 않는 것처럼 보인다.
- Required or Suggested Action: scoped light-mode token override와 상태 ARIA를 구현하고 computed-style 회귀를 추가한다.
- Re-audit Method: 여러 theme에서 mode 전후 background/text/border와 `aria-pressed`를 비교한다.
- Synthesis Rationale: action state와 presentation layer 연결이 끊겼다.

### [FIN-F005] lazy Detail loading/error dialog에 focus trap·복원이 없다

- Sources: A03-F006, Main source re-verification
- Areas: lazy loader, modal focus, error recovery
- Severity: Major
- Status: Confirmed
- Summary: `aria-modal=true`인 loading/error UI는 초기 focus, Tab loop, Escape, opener restore를 구현하지 않는다.
- Verified Evidence: `main.js:55-85,88-105`에는 click cancel/retry와 error retry focus만 있다. 정상 Detail의 trap인 `detailView.js:1177-1214`는 lazy 상태에서 실행되지 않는다. `spec.md:274`는 모든 modal의 capture/loop/restore를 요구한다.
- Expected Basis: modal focus 계약과 loader cancel/retry 계약.
- Actual: focus가 background에 남거나 dialog 밖으로 빠지고 cancel 시 opener가 복원되지 않는다.
- Impact: keyboard/screen-reader 사용자가 실패 복구 action을 잃을 수 있다.
- Required or Suggested Action: loader 시작 전에 opener를 저장하고 공용 trap/Escape/restore lifecycle을 loading·error·cancel·retry·stale request에 적용한다.
- Re-audit Method: dynamic import delay/reject를 주입해 activeElement, Tab/Shift+Tab, Escape/cancel, retry 중복 trap을 검사한다.
- Synthesis Rationale: 계약과 코드 부재가 명확하며 정상 성공 경로의 trap으로 대체되지 않는다.

### [FIN-F006] Actual-120 interaction hard gate가 실행마다 수렴하지 않는다

- Sources: A01-F007, A02-F004, Main serial Chrome run
- Areas: performance gate, Crostini reproducibility
- Severity: Major
- Status: Needs Clarification
- Summary: 같은 HEAD/Chrome에서 max 99ms 통과와 230.9/245.6/373.4ms 실패가 공존한다.
- Verified Evidence: 메인 직렬 실행도 기능 matrix/diagnostics는 통과했지만 373.4ms로 200ms hard gate를 실패했다. A02 독립 실행은 99ms였다.
- Expected Basis: `spec.md:242`의 interaction max 200ms hard gate.
- Actual: 현재 증거로 제품 회귀와 Crostini scheduling variance를 분리할 수 없으며 재현 가능한 PASS가 아니다.
- Impact: 승인된 성능 게이트를 안정적으로 충족한다고 말할 수 없다.
- Required or Suggested Action: 다른 QA/Chrome 0개, 동일 viewport/profile 조건에서 최소 3회 직렬 실행하고 operation별 sample과 host load를 기록한다.
- Re-audit Method: 3회 모두 max≤200ms인지 확인하고 초과 operation은 trace한다.
- Synthesis Rationale: 실패 관측 자체는 확정이지만 제품 귀속은 충돌하므로 다수결 대신 Needs Clarification으로 유지한다.

### [FIN-F007] keyboard-only 핵심 동작 두 곳이 막힌다

- Sources: A01-F006, A02-F002, Main direct source finding
- Areas: Game action, Detail modal Escape
- Severity: Minor
- Status: Confirmed
- Summary: `div role=button` Game target은 Enter/Space activation이 없고, Detail key handler는 focus가 input/select/textarea이면 Escape 검사 전에 return한다.
- Verified Evidence: `archetypeTemplates.js:77`, `mockupRuntime.js:89-119`, `detailView.js:1110-1140`.
- Expected Basis: keyboard equivalence와 문서화된 Detail `Esc` close.
- Actual: keyboard-only 사용자가 Game 공격을 실행하지 못하며 slider/select focus 중 Detail을 Esc로 닫지 못한다.
- Impact: 핵심 sandbox와 modal 종료의 접근성이 제한된다.
- Required or Suggested Action: native button 또는 Enter/Space router를 쓰고 Escape는 typing guard보다 먼저 처리한다.
- Re-audit Method: Game target Enter/Space와 모든 Detail form control focus 상태의 Escape를 실제 Chrome에서 검사한다.
- Synthesis Rationale: 독립 finding과 메인 코드 경로가 일치한다.

### [FIN-F008] 작은 화면 Blog progress가 실제 scroll owner를 관찰하지 않을 가능성이 높다

- Sources: A01-F005
- Areas: Blog, responsive scroll progress
- Severity: Minor
- Status: Probable
- Summary: listener는 preview viewport에 붙지만 ≤1024px CSS는 `.modal-body-grid`를 scroll container로 바꾼다.
- Verified Evidence: `mockupRuntime.js:670-680`과 responsive overflow 규칙의 static 대조.
- Expected Basis: 모바일/태블릿에서도 reading progress가 실제 스크롤을 반영해야 한다.
- Actual: 실제 scroll element와 listener target이 갈린다.
- Impact: progress가 0/고정 값에 머물 수 있다.
- Required or Suggested Action: 실제 scroll owner를 전달하고 375/768/1024 runtime test를 추가한다.
- Re-audit Method: 세 폭에서 끝까지 scroll하며 fill/ARIA를 0→100으로 확인한다.
- Synthesis Rationale: 정적 근거는 강하지만 새 모바일 런타임 재현을 하지 않아 Probable을 유지한다.

### [FIN-F009] 빈 cart checkout 차단 조건이 도달 불가능하다

- Sources: A01-F009
- Areas: E-commerce state validation
- Severity: Minor
- Status: Confirmed
- Summary: quantity는 항상 1 이상인데 guard는 `cart.length===0 && qty<=0`일 때만 차단한다.
- Verified Evidence: `mockupRuntime.js:482-489,520-540`.
- Expected Basis: cart checkout은 cart item 존재를 기준으로 검증해야 한다.
- Actual: 빈 drawer에서도 성공 toast/close가 가능하다.
- Impact: 상품 없는 주문 성공이라는 잘못된 상태가 표시된다.
- Required or Suggested Action: cart checkout과 direct purchase를 분리하고 cart empty/disabled 상태를 명시한다.
- Re-audit Method: empty/add/remove/qty/direct-buy 조합을 검사한다.
- Synthesis Rationale: guard 불변조건이 코드상 결정적으로 false다.

### [FIN-F010] 브라우저 title/description이 120이 아닌 36종을 광고한다

- Sources: A01-F008, Main source re-verification
- Areas: bootstrap metadata
- Severity: Minor
- Status: Confirmed
- Summary: visible app은 120이지만 `index.html:6-7`은 36종이라고 표시한다.
- Verified Evidence: 정적 metadata와 runtime header/spec/README 대조.
- Expected Basis: user-facing product count 동기화.
- Actual: tab/share/search metadata가 과거 수량이다.
- Impact: 제품 신뢰·공유 metadata가 부정확하다.
- Required or Suggested Action: 120으로 동기화하거나 catalog source에서 생성한다.
- Re-audit Method: `document.title`과 meta description을 catalog count와 비교한다.
- Synthesis Rationale: 기능과 분리된 확정 metadata drift다.

### [FIN-F011] green matrix가 실제 transition·theme·keyboard·overflow 결함을 놓친다

- Sources: A02-F003, A01-F001/F002 notes, Main assertion review
- Areas: test/Chrome QA coverage
- Severity: Minor
- Status: Confirmed
- Summary: 1,920-state breadth와 zero-rebuild assertion은 실제 A→B renderer identity, Peek/Confirm theme, Game key activation을 검사하지 않는다.
- Verified Evidence: scalability zero-rebuild는 same viewport/selected ID/theme만 확인하고, catalog matrix는 직접 생성한 hidden renderer를 검사한다. Peek report는 theme를 `null`로 기록해도 root/busy만 gate한다.
- Expected Basis: `TEST-001`의 구체적 실패 모드 회귀.
- Actual: 152 tests와 Chrome matrix가 FIN-F001/2/7 상태에서도 green일 수 있다.
- Impact: 완료 주장과 실제 핵심 동작 사이에 false-pass 표면이 있다.
- Required or Suggested Action: stateful transition, computed theme, keyboard, per-root clipping/overflow assertion을 공식 gate에 넣는다.
- Re-audit Method: 새 테스트가 수정 전 실패하고 수정 후 통과하는지 확인한다.
- Synthesis Rationale: 확인된 결함이 기존 green gate를 통과한 원인을 설명하는 독립 finding이다.

### [FIN-F012] bootstrap 및 내부 malformed state의 명시적 복구 경계가 약하다

- Sources: A03-F003, A03-F005
- Areas: bootstrap error UI, internal state validation
- Severity: Minor
- Status: Confirmed (boundary absence), user-triggerability limited
- Summary: top-level init에는 visible catch/retry가 없고, 일부 internal setters는 unknown enum/ID를 받아 기본 Game/첫 style 또는 숨김 화면으로 조용히 fallback한다.
- Verified Evidence: `main.js:17-132`, `appState.js:141-207`, `detailView.js:1217-1219,1324-1344`, `archetypeTemplates.js:9-30`.
- Expected Basis: 명시적 error/reset과 다른 시안으로 조용히 대체하지 않는 무결성 원칙.
- Actual: fault/malformed injection 시 부분 화면 또는 잘못된 fallback이 가능하다.
- Impact: 내부 버그·stale integration이 발생하면 원인과 화면 선택이 분리될 수 있다.
- Required or Suggested Action: enum/ID/array shape를 setter에서 검증하고 fatal bootstrap fallback/retry를 추가한다.
- Re-audit Method: 초기화 throw와 malformed setter 입력을 주입해 error/reset과 정상 복귀를 확인한다.
- Synthesis Rationale: A03의 Major 제안은 정상 URL/storage에서 직접 도달하는 경로가 없고 정상 Chrome이 통과한 점을 반영해 Minor로 낮췄다.

### [FIN-F013] Clipboard fallback이 실패를 성공으로 알린다

- Sources: A03-F004, Main source re-verification
- Areas: Clipboard permission/error feedback
- Severity: Minor
- Status: Confirmed
- Summary: `execCommand('copy')`의 false 반환값을 무시하고 성공 toast/SFX를 실행한다.
- Verified Evidence: `clipboard.js:8-36` 및 reject+false 프로브.
- Expected Basis: copy 결과의 정확한 사용자 피드백.
- Actual: 두 API가 실패해도 “Copied”가 표시된다.
- Impact: 사용자가 복사되지 않은 CSS/token을 잃을 수 있다.
- Required or Suggested Action: Promise/result API와 false/throw 실패 toast, focus/selection cleanup을 구현한다.
- Re-audit Method: modern/fallback 성공·reject·false·throw 조합을 검사한다.
- Synthesis Rationale: 결정적 반환값 오판이다.

### [FIN-F014] Audio/Canvas 실패·motion lifecycle이 UI state와 맞지 않는다

- Sources: A03-F002, A03-F007
- Areas: audio widget rAF, reduced-motion/modal, AudioContext rejection
- Severity: Minor
- Status: Confirmed
- Summary: mini spectrum rAF는 reduced-motion/modal/teardown을 무시하고, `resume()` rejection은 catch되지 않은 채 playing state/scheduler가 시작된다.
- Verified Evidence: `audioWidget.js:103-133`, `synthAudio.js:298-321,525-535`, reject 프로브.
- Expected Basis: `spec.md:274-275`와 정확한 재생 상태.
- Actual: motion/CPU가 계속되고 권한 거부 시 무음인데 playing 및 unhandled rejection이 가능하다.
- Impact: 접근성, 배터리/CPU, 오류 진단과 사용자 신뢰가 저하된다.
- Required or Suggested Action: 소유 rAF ID/취소 조건과 running context 확인 후 state commit을 구현한다.
- Re-audit Method: reduced-motion/modal/root removal/null context 및 resume reject를 주입한다.
- Synthesis Rationale: 정상 main canvas와 별개인 audio widget/context 경계의 확정 누락이다.

### [FIN-F015] 입력·transient timer 일부가 bounded lifecycle 밖에 있다

- Sources: A03-F001, A03-F008
- Areas: comment/chat size, DOM history, toast/pulse/popstate timers
- Severity: Minor
- Status: Confirmed
- Summary: comment/chat은 길이·개수 상한이 없고 일부 short timer는 teardown/adapter cleanup에서 취소되지 않는다.
- Verified Evidence: `archetypeTemplates.js` input markup, `mockupRuntime.js:192-208,556-650`, `discoveryUrlState.js:35-48`.
- Expected Basis: bounded client resource와 stale callback 방지.
- Actual: stress/rapid teardown에서 DOM/closure 누적과 짧은 stale mutation이 가능하다.
- Impact: 장시간 사용·HMR·빠른 전환에서 성능/상태 노이즈가 생길 수 있다.
- Required or Suggested Action: 명시적 입력/history 상한과 모든 timer의 소유 cleanup을 추가한다.
- Re-audit Method: boundary/stress와 immediate teardown에서 node/store/pending callback 상한을 검사한다.
- Synthesis Rationale: 즉시 정상 흐름 차단은 아니므로 Minor로 유지했다.

### [FIN-F016] 운영 CSP와 외부 폰트 신뢰 정책은 현재 판정할 수 없다

- Sources: A03-F009
- Areas: deployment headers, Google Fonts
- Severity: Info
- Status: Needs Clarification
- Summary: 저장소에 CSP/hosting header 설정이 없고 Google Fonts를 원격 import한다.
- Verified Evidence: `index.html`, `index.css`, 배포 설정 검색. 현재 확정 XSS 경로와 npm 취약점은 발견하지 못했다.
- Expected Basis: 실제 배포 방어 심도와 third-party availability 정책.
- Actual: 운영 플랫폼이 header를 추가하는지 알 수 없다.
- Impact: 운영 보안/가용성의 일부가 미확인이다.
- Required or Suggested Action: 배포 URL/플랫폼에서 headers를 확인하고 self-host/pinned font 또는 최소 CSP를 문서화한다.
- Re-audit Method: 실제 응답 header/CSP violation/font 차단 fallback을 검사한다.
- Synthesis Rationale: 저장소만으로 취약점이라 단정하지 않고 정보 공백으로 유지한다.

## 10. Critical/Major Direct Re-verification

| Canonical Finding | Directly Checked By Main | Evidence Re-opened or Command Re-run | Result | Gate Impact |
| --- | --- | --- | --- | --- |
| FIN-F001 | Yes | `detailView.js`, renderer output 비교, 격리 Chrome A→B 전환 | Confirmed | PASS 차단 |
| FIN-F002 | Yes | Peek/Dock source, theme CSS, Chrome dataset/computed tokens | Confirmed | PASS 차단 |
| FIN-F003 | Yes | 계약 3종과 ecommerce template/runtime 재대조 | Confirmed | PASS 차단 |
| FIN-F004 | Yes | reading-mode action과 전체 CSS 검색 | Confirmed | PASS 차단 |
| FIN-F005 | Yes | `main.js` lazy dialog와 `detailView.js` trap, `spec.md:274` | Confirmed | PASS 차단 |
| FIN-F006 | Yes | 메인 직렬 Chrome 151 공식 QA 재실행 | Needs Clarification; 373.4ms failure observed | 재현 가능 PASS 차단 |

원본 Major A03-F003/A03-F005도 메인이 코드를 직접 다시 열었다. 경계 부재는 확인했지만 정상 사용자 URL/storage에서의 직접 도달성과 fault 재현이 부족해 FIN-F012 Minor로 낮췄다. 이 조정은 finding을 누락한 것이 아니라 severity/source attribution을 분리한 것이다.

## 11. Cross-Report Conflicts

1. **Performance:** A02는 max 99ms로 통과했고 A01/메인은 230.9–373.4ms로 실패했다. 실패 횟수의 다수결로 제품 회귀를 확정하지 않고, hard gate의 반복성 자체를 FIN-F006 `Needs Clarification`으로 남겼다.
2. **Bootstrap/malformed state severity:** A03은 Major로 보았으나, 해당 fault/unknown state가 정상 외부 입력에서 도달하는 경로가 확인되지 않았다. 부재한 경계는 채택하되 FIN-F012 Minor로 조정했다.
3. **Zero-rebuild 의도:** `designs.md`는 local action state 보존을 요구하지만 `spec.md`는 style별 distinct grammar/renderer를 요구한다. 노드/상태 보존이 stale renderer를 허용한다는 해석은 선택 시안 계약을 깨므로 기각했다.
4. **Green matrix와 실제 결함:** 자동 matrix는 폭넓은 직접 render를 검증하지만 실제 A→B transition을 검증하지 않는다. 두 증거는 모순이 아니라 서로 다른 경로를 다룬다.

## 12. Finding Adjudication Ledger

| Source Finding | Decision | Canonical Finding | Rationale |
| --- | --- | --- | --- |
| A01-F001 | Merged | FIN-F001 | A02와 메인 Chrome이 독립 확인 |
| A01-F002 | Accepted | FIN-F002 | computed token으로 직접 확정 |
| A01-F003 | Accepted | FIN-F003 | 문서와 runtime 직접 충돌 |
| A01-F004 | Accepted | FIN-F004 | CSS 연결 부재 확정 |
| A01-F005 | Accepted | FIN-F008 | runtime 미재현으로 Probable 유지 |
| A01-F006 | Merged | FIN-F007 | A02-F002와 동일 원인 |
| A01-F007 | Merged/Adjusted | FIN-F006 | 실패 관측 채택, 제품 귀속은 미확정 |
| A01-F008 | Accepted | FIN-F010 | metadata drift 확정 |
| A01-F009 | Accepted | FIN-F009 | unreachable guard 확정 |
| A02-F001 | Merged | FIN-F001 | runtime/inspector 영향 보강 |
| A02-F002 | Merged | FIN-F007 | Game keyboard 경로 |
| A02-F003 | Accepted | FIN-F011 | false-pass coverage 원인 |
| A02-F004 | Merged | FIN-F006 | 통과 관측과 충돌 근거 |
| A03-F001 | Merged | FIN-F015 | resource bound 위험 |
| A03-F002 | Merged | FIN-F014 | audio widget rAF lifecycle |
| A03-F003 | Accepted/Severity Adjusted | FIN-F012 | 경계 부재 확인, 사용자 trigger 불명확 |
| A03-F004 | Accepted | FIN-F013 | false success probe 확정 |
| A03-F005 | Accepted/Severity Adjusted | FIN-F012 | internal invariant, 외부 도달성 제한 |
| A03-F006 | Accepted | FIN-F005 | 명시 modal 계약 위반 |
| A03-F007 | Merged | FIN-F014 | resume reject/state race |
| A03-F008 | Merged | FIN-F015 | cleanup ownership 위험 |
| A03-F009 | Accepted | FIN-F016 | 운영 정보 공백으로 제한 |
| Main-M001 | Accepted | FIN-F007 | form focus 중 Escape early return |
| Main-M002 | Merged | FIN-F011 | matrix overflow/transition assertion 공백 |

## 13. Required Actions Before Passing

우선순위는 다음과 같다.

1. FIN-F001: style transition 후 renderer/motion/Inspector payload를 새 선택과 일치시키고 state migration 회귀를 추가한다.
2. FIN-F002: Peek/Confirm theme ID와 computed token을 고친다.
3. FIN-F003/FIN-F004: checkout modal과 실제 Blog reading mode를 구현하거나 계약 문서를 먼저 조정한다.
4. FIN-F005/FIN-F007: lazy modal focus lifecycle, Game keyboard, Detail Escape를 고친다.
5. FIN-F009/FIN-F013/FIN-F014: cart guard, Clipboard 실패, audio/canvas rejection/lifecycle을 고친다.
6. FIN-F011: 위 결함들을 수정 전 RED/수정 후 GREEN으로 잡는 stateful browser regression을 공식 gate에 넣는다.
7. FIN-F006: 조용한 동일 조건 3회 직렬 측정으로 200ms gate를 확정한다.
8. 그 뒤 Node 152+, catalog/theme/build/bundle, discovery, catalog120, scalability, targeted visual/keyboard/fault QA를 재실행한다.

## 14. Accepted and Remaining Risks

- catalog validator의 56개 legacy warning은 현재 공개 기준선이다: accessibility notes 24, source 24, contrast low 5, contrast unchecked 3. `claymorphism`, `fluid-organic`, `handcrafted-indie`, `high-fashion`, `neumorphism`의 muted text는 4.5:1 미만이고 `frutiger-aero`/`glassmorphism` 일부 alpha/gradient는 자동 계산되지 않는다. PASS 전 반드시 모두 제거하라는 뜻은 아니지만 접근성 부채로 유지한다.
- actual 120은 21개 grammar를 네 변형씩 공유한다. 자동 uniqueness와 대표 화면은 확인했지만 960 화면의 픽셀 전수 수동 승인은 아니다.
- 초기 CSS 예산 여유는 144 bytes뿐이다. 수정 시 bundle budget 회귀 위험이 높다.
- 현재 코드에서 확정 unsanitized user-input XSS, 비밀정보, runtime dependency 취약점은 발견하지 못했다. 이는 운영 CSP 또는 향후 remote catalog의 안전을 보장하지 않는다.
- 외부 Google Fonts 차단 시 system fallback 경로는 있으나 운영 가용성/정확한 typography 차이는 남는다.

## 15. Clarifications and Inconclusive Areas

- zero-rebuild에서 정확히 어떤 local state를 style 간 이식할지 문서가 세부적으로 정하지 않는다. renderer 일치는 필수지만 cart/game/chat 상태의 보존 범위는 수정 전 설계 결정으로 명시해야 한다.
- checkout modal을 제품 범위에서 제거한 것이 의도라면 구현보다 먼저 `spec.md`·`designs.md`·README·CHANGELOG의 계약 변경 승인이 필요하다.
- 성능 초과는 현재 제품 경로와 Crostini scheduling을 분리하지 못했다. operation별 trace가 필요하다.
- 운영 배포 URL/플랫폼이 제공되지 않아 CSP/security headers는 inconclusive다.
- Peek/Confirm의 `role=dialog`가 modal인지 non-modal인지 제품 semantics가 불명확하다. FIN-F002 theme 문제와 별개로 ARIA/focus 계약을 확정해야 한다.

## 16. Re-audit Checklist

- [ ] style A→B 전환에서 새 renderer root/text/motion/Inspector 4×3가 모두 B와 일치
- [ ] Game/cart/chat 등 승인된 local state가 renderer 교체 후 의도대로 보존 또는 초기화
- [ ] Peek/Confirm의 `data-theme`와 13 computed tokens가 selected ID와 일치
- [ ] E-commerce checkout dialog의 summary/confirm/cancel/Escape/focus return 통과
- [ ] Blog reading mode의 computed background/text/ARIA 변화 통과
- [ ] 375/768/1024 Blog progress 0→100 통과
- [ ] lazy loading/error delay/reject에서 focus capture/trap/Escape/restore/retry 통과
- [ ] Game Enter/Space와 Detail form focus 중 Escape 통과
- [ ] empty cart, Clipboard false/throw, AudioContext reject/null Canvas 경로 통과
- [ ] stateful Chrome regression이 수정 전 실패·수정 후 통과
- [ ] `npm test`, catalog/theme, Vite build, bundle budget 통과
- [ ] discovery/catalog120/scalability Chrome QA와 diagnostics 0 통과
- [ ] 격리 Chrome 151 직렬 3회 interaction max 모두 ≤200ms 또는 승인된 환경 위험 문서화
- [ ] 수정 영향 style의 Desktop/Mobile/Split/Peek/Confirm screenshot을 육안 대조
- [ ] source report manifest 무결성 재검증

## 17. Final Decision

**HOLD / REWORK REQUIRED**

정상 경로의 기반은 양호하다. Node 152/152, catalog errors 0, theme freshness, 75-module build, 초기 JS/CSS budget, 120 reachability, discovery/URL/responsive, broad renderer matrix와 application diagnostics는 통과했다.

그러나 다음 이유로 “전체 기능 정상” 또는 “모든 디자인 시안 정상 표시”로 승인할 수 없다.

- 선택 ID와 실제 Detail renderer가 갈리는 Confirmed Major
- Peek/Confirm이 선택 theme가 아닌 fallback palette를 쓰는 Confirmed Major
- 문서화된 checkout modal과 Blog reading mode의 핵심 동작 누락
- lazy error/loading modal의 명시 focus 계약 위반
- current Crostini performance hard gate의 비결정적 실패
- 위 실패들을 기존 green matrix가 잡지 못하는 회귀 공백

Critical 보안 취약점이나 데이터 손상은 발견하지 못했지만, 확인된 Major 기능/UI 결함이 모두 수정되고 직접 재감사되기 전에는 PASS 계열 판정을 금지한다.

## 18. Coder Handoff

`/home/eunho1/Projects/web/design_sample_selector/docs/multi_audit/9/final_audit_report_9.md`를 먼저 읽고, 각 finding을 프로젝트 문서와 실제 코드에 대조하여 검증한 뒤 우선순위대로 수정하세요. 계약 변경이 필요하면 관련 문서를 먼저 갱신하고, 수정 후 테스트·빌드·재감사 증거를 기록하세요.
