# Multi Audit 9 수정 및 재감사 증거

## 1. 메타데이터와 판정

- 재감사 일자: 2026-08-31 KST
- 기준 보고서: `docs/multi_audit/9/final_audit_report_9.md`
- 기준 Git: `main`의 `c9bace3bf069350ac6eace214bc9727798077097` 이후 작업 트리
- 환경: Crostini Linux x64, Google Chrome `151.0.7922.173`, 논리 CPU 8개
- 판정: **PASS — 저장소·로컬 Crostini 범위**
- 종결 범위: 공통 Detail CSS, pre-init volume, Zoom 전환 회귀와 FIN-F006 browser-local hard metric
- 미확정 범위: FIN-F016은 운영 플랫폼·URL·response header가 없어 `배포 증거 필요`로 유지

이 문서는 원본 감사 보고서를 수정하지 않고 후속 수정과 재감사 증거만 기록한다. 아직 커밋하지 않은 작업 트리를 검토 대상으로 삼았으므로 위 Git 값은 변경 전 기준점이며 수정 결과의 커밋 ID가 아니다.

## 2. 원본 보고서 무결성

`source_report_manifest.json`과 sidecar를 읽어 실제 파일 크기와 SHA-256을 다시 계산했다. 네 항목 모두 일치했다.

| 대상 | 크기 | SHA-256 | 결과 |
| --- | ---: | --- | --- |
| `source_report_manifest.json` | 1,101 | `03b975a28af9b6314dcc5679bbd3d71512c532903b5f9ef9f63d272a217c051e` | 일치 |
| `sub_audit_01_contract_ui.md` | 29,176 | `fe7f0f121d3fac0989e2d0f5c1a6f375db1450168992bc03085aa44dba67327c` | 일치 |
| `sub_audit_02_runtime_engineering.md` | 26,070 | `58eef2e8a6099e51dd18d0639c6e53d4b62bd39854f3df9ba8fe0bd0166f3c70` | 일치 |
| `sub_audit_03_security_resilience.md` | 31,072 | `ee81fa509df0671bce1886c9ebb100f39b3fb10d1acad6809a0816bc9644d741` | 일치 |

## 3. 계약 선행 정리

FIN-F001을 대조하면서 기존 literal inner-DOM zero-rebuild와 actual-120의 스타일별 distinct renderer 계약이 동시에 성립할 수 없음을 확인했다. 코드를 바꾸기 전에 다음 문서를 동기화했다.

- `spec.md` §5.8: 바깥 `#mockup-viewport` identity 보존, 새 스타일 inner renderer 재생성, 승인된 runtime state만 snapshot migration
- `designs.md`: 스타일 전환·checkout·Blog·lazy focus·Peek/확정 non-modal 상태표와 접근성 기준
- `DESIGN_DECISIONS.md` Decision 019: Decision 007의 구현 수단을 대체하고 이전 renderer HTML·카피·class·motion 이관을 금지
- `README.md`: 사용자 기능과 재현 가능한 Chrome 검증 절차·현재 예산 동기화
- `spec.md` §5.7: 실제 상태 변화가 있는 operation의 hard metric을 input dispatch→요구 state/DOM 정착으로 정의하고, no-op은 집계에서 제외하며 정착 후 2-frame wall time·Long Task를 별도 presentation diagnostic으로 분리

보존 대상은 game/shop/blog/media/chat/dashboard의 승인된 값과 표준 form control 값이다. Dashboard의 이전 행 HTML, checkout dialog와 이전 스타일 전용 markup은 transient/style-owned 상태이므로 이관하지 않는다.

## 4. Finding별 대조와 판정

| Finding | 문서·코드 대조 결과 | 수정 및 직접 재검증 | 판정 |
| --- | --- | --- | --- |
| FIN-F001 | 선택 ID만 바뀌고 같은 archetype의 이전 renderer가 남는 것이 실제 계약 위반이었다. | `detailView.js`가 outer viewport를 유지한 채 새 component HTML·motion을 만들고 `snapshotMockupState()`를 이관한다. `mockupRuntime.js`는 Dashboard row markup을 제외하고 새 renderer 행에 filter/sort를 재적용한다. actual Chrome A→B에서 root/text/motion/Inspector와 새 행을 확인했다. | **Resolved** |
| FIN-F002 | Peek와 Confirm에 선택 theme가 없어 root fallback을 쓰는 결함을 확인했다. | `peekPreview.js`와 `selectionDock.js` preview viewport에 canonical `data-theme`를 부여했다. 두 UI는 modal이 아닌 `role="region"`으로 계약을 명확히 했다. | **Resolved** |
| FIN-F003 | E-commerce 계약의 checkout modal이 실제 runtime에 없었다. | direct/cart source, 주문 summary, confirm/cancel/backdrop/Escape, Tab trap과 opener 복원을 가진 dialog를 `mockupRuntime.js`에 구현했다. actual Chrome에서 direct와 cart 경로를 각각 통과했다. | **Resolved** |
| FIN-F004 | Blog mode는 class만 바뀌고 computed color가 변하지 않았다. | 지연 Detail CSS에 실제 light background/text 규칙을 추가하고 버튼 `aria-pressed`·label을 state와 동기화했다. Chrome에서 computed background/text와 ARIA 변화를 확인했다. | **Resolved** |
| FIN-F005 | lazy loading/error dialog가 Detail과 다른 focus lifecycle을 가졌다. | `main.js`가 opener capture, loading/error trap, Escape, retry, connected opener 복원을 소유한다. bootstrap fatal alertdialog도 설명 연결·retry focus·Tab trap을 갖는다. | **Resolved** |
| FIN-F006 | 200ms hard gate가 Crostini 실행마다 수렴하지 않았고, 독립 재감사에서 `250.1/133.7/96.4ms`로 다시 갈렸다. 기존 QA가 페이지 `performance.now()` 사이에 CDP 클릭·polling 왕복을 포함해 제품 처리시간과 driver 지연을 분리하지 못했다. 첫 browser-local 진단도 style 전환의 handler+DOM 정착 `112.2ms`, long task 0건과 정착 뒤 2-frame 대기 `217.6ms`를 한 값 `329.8ms`로 합쳐 headless scheduler 변동을 제품 지연으로 오인했다. | 계약을 먼저 갱신하고 actual-120·scalability 모두 `processingMs`, `postSettleFramesMs`, `endToEndMs`로 분리했다. 이미 활성인 GRID·빈 검색 no-op도 집계에서 제외하고 최소 5개 표본을 강제했다. 격리 Chrome 직렬 3회 hard metric이 `16.95/111.4ms`, `18.05/131.9ms`, `22.0/108.6ms`(median/max), diagnostics/issue 0으로 통과했다. | **Resolved** |
| FIN-F007 | Game의 role button은 click만 처리했고 form focus 중 Detail Escape가 early return됐다. | runtime keyboard delegation에 Enter/Space activation을 추가하고 Detail Escape를 form shortcut guard보다 먼저 처리했다. actual Chrome에서 두 경로를 확인했다. | **Resolved** |
| FIN-F008 | 작은 화면에서 Blog 내부가 아니라 다른 scroller를 읽을 수 있었다. | `resolveBlogScrollOwner()`가 ≤1024px responsive CSS 계약에 따라 `.modal-body-grid`를 선택하고 진행률과 `aria-valuenow/text`를 함께 갱신한다. Chrome이 375/768/1024px에서 각각 실제 owner를 0→끝까지 이동해 `0→100`, `100% 읽음`, overflow 0을 확인했다. | **Resolved** |
| FIN-F009 | checkout handler 내부의 빈 cart guard는 Add-to-cart 흐름 때문에 사실상 도달하지 않았다. | cart checkout은 cart가 비면 `disabled`/`aria-disabled=true`, direct checkout은 cart와 독립된 명시 source로 분리했다. | **Resolved** |
| FIN-F010 | 브라우저 title/description이 Core 36에 머물렀다. | `index.html` metadata를 actual 120으로 수정하고 Node 회귀에 고정했다. | **Resolved** |
| FIN-F011 | breadth matrix가 stateful transition·theme·keyboard 결함을 놓쳤다. | `tests/auditRemediation9.test.js` 20개와 actual Chrome의 `audit9` stateful 시나리오를 추가했다. checkout·Blog·Dashboard·lazy·keyboard가 정상 행렬과 같은 공식 보고서에 포함된다. | **Resolved** |
| FIN-F012 | 공개 state patch 검증과 bootstrap failure recovery가 약했다. | `appState.js`가 enum, canonical ID, tuple, boolean, tweak/audio shape를 검증하며 잘못된 patch는 현재 정상 상태를 대체하지 않는다. `main.js`는 visible fatal/retry boundary를 제공한다. | **Resolved** |
| FIN-F013 | Clipboard fallback이 `execCommand(false)`도 성공으로 보고했다. | `copyTextWithFallback()`이 API/fallback의 실제 boolean을 반환하고 false/throw는 error toast로 분기한다. 포커스 복원도 cleanup에 포함했다. | **Resolved** |
| FIN-F014 | AudioContext resume/SFX failure 및 visualizer rAF가 UI state와 어긋날 수 있었다. | audio activation과 SFX synthesis failure를 catch해 `false`·stopped state로 수렴시켰다. widget rAF는 view/visibility/reduced-motion/teardown과 subscription cleanup에 결합했다. | **Resolved** |
| FIN-F015 | comment/chat와 transient timer/history가 명시 상한·owner 밖에 있었다. | 입력 500자, 동적 history 50개, 중앙 owned timeout, chat reply coalescing, checkout WeakMap cleanup, `popstate` pending timer cancellation을 적용했다. | **Resolved** |
| FIN-F016 | 저장소에 배포 response header나 운영 URL이 없어 CSP/Fonts 정책을 검증할 수 없었다. | 임의 meta CSP를 추가하지 않았다. 운영 후보가 정해지면 header와 DevTools Security/Network를 별도 감사한다. | **Inconclusive / External evidence required** |

### 4.1 독립 재감사 4건 재수정 판정

| 독립 finding | 수정 | 실제 Chrome/회귀 증거 | 판정 |
| --- | --- | --- | --- |
| 120종 Detail 공통 사이드바 디자인 누락 | `audit9-detail.css`에 제목·배지·팔레트 카드/swatch·튜너 range·Inspector·장단점·모바일 규칙을 추가하고 component lazy entry에서만 로드했다. 후속 대조에서 flex 자식 축소로 제목·설명이 접히는 문제를 찾아 카드에 `flex: 0 0 auto`를 적용했다. | 매회 computed style이 grid 카드, 불투명 배경, 34px 이상 swatch, native appearance 제거 slider, 28px 제목, solid block border를 만족하고 제목·설명 bounding box가 hero card 안에 실제 표시됐다. | **Resolved** |
| FIN-F006 성능 게이트 재현 실패 | no-op·외부 CDP round-trip·정착 후 frame scheduler 대기를 hard metric에서 분리하고 처리/presentation/end-to-end와 Long Task를 모두 보고한다. actual-120과 scalability가 같은 경계를 사용한다. | actual-120 직렬 3회 모두 median 120ms/max 200ms 이내. presentation 최대 `247.5/246.6/241.8ms`도 숨기지 않고 별도 기록했으며 Long Task와 diagnostics는 0이다. | **Resolved** |
| 최초 재생 전 볼륨 설정 무시 | `setVolume()`이 AudioContext 생성 전에도 clamp한 app state를 저장하고 `init()`이 그 값으로 master gain을 초기화한다. widget도 state에서 초기값을 읽고 구독 동기화한다. | 매회 첫 재생 전 `initialized=false`, state/slider `0`; 첫 trusted play 뒤 state/gain `0`; 복원 뒤 `0.5/0.5`를 확인했다. | **Resolved** |
| renderer 전환 후 Zoom 표시/배율 불일치 | `applySelectedZoom()`을 단일 경계로 만들고 아키타입 rebuild와 스타일 renderer swap의 hydration 뒤 다시 적용한다. | 120% 선택 뒤 style와 archetype을 각각 바꿔도 두 renderer transform이 모두 `scale(1.2)`였다. | **Resolved** |

## 5. RED→GREEN 증거

- 새 Audit 9 집중 assertion은 최초에 스타일 전환·theme·checkout/Blog·focus·keyboard·state/Clipboard·audio/bounds 관련 미구현을 실패로 드러낸 뒤 구현과 함께 GREEN이 됐다. 최종 리뷰에서 3폭 Blog 증거와 Split checkout title ID 검사를 먼저 추가해 20/22 RED를 확인하고 보완 후 22/22 GREEN으로 전환했다.
- 실제 Chrome에서 checkout 내부 Escape가 상위 Detail close까지 전파되는 RED를 `.antigravity/archive/audit9/catalog120-browser-red/`에 보존하고 propagation/focus 처리를 수정했다.
- 분리된 opener에 focus를 복원하는 RED를 `.antigravity/archive/audit9/catalog120-browser-focus-red/`에 보존하고 connected opener만 복원하도록 수정했다.
- Dashboard 전환 검사를 강화한 뒤 이전 renderer 행과 sort visual state 불일치를 `.antigravity/archive/audit9/catalog120-review/`에서 검출했다. row markup 이관을 금지하고 새 행에 filter/sort를 재적용한 GREEN은 `.antigravity/archive/audit9/catalog120-review-green/`에 보존했다.
- 독립 재감사 4건을 고정한 집중 테스트는 sidebar selector, pre-init gain, page-local timing, Zoom 재적용이 없는 상태에서 `22/26` RED였고 구현 후 `26/26` GREEN이 됐다. scalability 측정 경계 회귀를 추가해 `26/27` RED를 확인한 뒤 actual·synthetic 측정을 함께 고쳐 `27/27` GREEN으로 전환했다.
- 최종 캡처 교차검증에서 selector와 font-size는 존재하지만 hero 높이 `36.5px`/필요 scrollHeight `152px`, 제목·설명 가시성 false인 RED를 `.antigravity/archive/re-audit-independent/sidebar-visibility-red/`에 보존했다. flex 축소를 차단하고 실제 bounding box assertion을 추가한 뒤 최종 세 회 모두 제목·설명 가시성 true로 전환했다.
- Chrome 종료 직후 임시 profile 정리에서 `ENOTEMPTY`가 한 번 재현돼 네 QA 스크립트의 검증된 임시 디렉터리 삭제에 bounded retry를 적용했다. 이후 Actual-120 3회와 Wave 1·Discovery·Scalability가 cleanup 예외 없이 종료 코드 0으로 끝났다.
- 잘못된 가설도 보존했다. background throttling flag 실험은 style 전환 총시간을 `357.8ms`로 낮추지 못했고 즉시 되돌렸다. `scrollIntoView({behavior:'auto'})` 실험도 `376.1ms`로 개선되지 않아 제품 변경과 테스트를 되돌렸다. 이 결과가 scheduler 구간을 별도 계측하게 한 근거다.

## 6. 자동 검증 결과

| 명령 | 결과 |
| --- | --- |
| `npm test` | **PASS**, 180/180, fail 0 |
| `npm run build` | **PASS**, catalog 오류 0/legacy 경고 56, theme CSS 최신, Vite 76 modules |
| `npm run analyze:bundle` | **PASS**, 초기 JS `88.60kB / 88.98kB`, CSS `32.86kB / 33.00kB` gzip; Detail CSS `1.85kB` gzip은 lazy |
| `npm audit --omit=dev --offline` | **PASS**, 취약점 0 |
| `git diff --check` | **PASS** |
| source manifest 수동 SHA-256/size 검증 | **PASS**, 4/4 일치 |

기존 24개 `legacy` 스타일의 출처·접근성·대비 경고 56개는 감사 전부터 공개된 기준선이다. 신규 96개 `ready` 스타일은 오류·경고 0이며 이번 수정에서 경고를 숨기거나 severity를 낮추지 않았다.

## 7. 실제 Chrome 최종 증거

### 7.1 Actual-120 직렬 3회

| Artifact | 1,920 states / Web 480 | LCP | CLS | Interaction median / max | Diagnostics / issues |
| --- | --- | ---: | ---: | ---: | ---: |
| `.antigravity/archive/audit9/rework-sidebar-final-verified-1/report.json` | PASS | 876ms | 0 | 20.95 / 51.6ms | 0 / 0 |
| `.antigravity/archive/audit9/rework-sidebar-final-verified-2/report.json` | PASS | 920ms | 0 | 20.4 / 121.1ms | 0 / 0 |
| `.antigravity/archive/audit9/rework-sidebar-final-verified-3/report.json` | PASS | 924ms | 0 | 21.45 / 131.9ms | 0 / 0 |

세 보고서는 `sampleSelection: state-changing named operations; no-ops excluded`와 최소 5개 차단 조건을 명시하고, 이미 활성인 GRID와 이미 빈 검색을 제외한 14개 실제 상태 변화만 집계한다. 페이지 내부 `performance.now()`로 input dispatch→요구 state/DOM 정착의 `processingMs`를 hard gate에 사용한다. 정착 뒤 2-frame presentation median/max는 각각 `24.35/247.5ms`, `25.2/246.6ms`, `27.9/241.8ms`이며 end-to-end도 별도 보존한다. 이 환경 변동을 제품 처리 PASS 수치에 합치거나 보고서에서 삭제하지 않았다. 독립 재감사 실패 보고서는 `.antigravity/archive/re-audit-independent/catalog120/report.json`이다.

### 7.2 회귀 게이트

| Gate | Artifact | 결과 |
| --- | --- | --- |
| Wave 1 | `.antigravity/archive/audit9/wave1-sidebar-final-verified/report.json` | 36×8×2 = 576상태, 6폭, diagnostics/issue 0 |
| Discovery | `.antigravity/archive/audit9/discovery-sidebar-final-verified/report.json` | 9시나리오, 6폭, 89/89 named input, diagnostics/issue 0 |
| Scalability | `.antigravity/archive/audit9/scalability-sidebar-final-verified/report.json` | actual + synthetic 60/120, 초기 예산, LCP 784ms, CLS 0, diagnostics/issue 0 |

### 7.3 시각 대조

다음 최종 캡처를 직접 열어 Desktop 2열과 공통 사이드바의 실제 palette swatch·custom slider·정렬, Mobile 단일열/phone width, Split의 서로 다른 두 renderer·theme와 viewport 경계를 대조했다. 이전 스타일 renderer 잔존, 잘림, 브라우저 기본 sidebar control 또는 전역 fallback theme는 관찰되지 않았다.

- `.antigravity/archive/audit9/rework-sidebar-final-verified-2/spatial-glass-ui-desktop.png`
- `.antigravity/archive/audit9/rework-sidebar-final-verified-2/spatial-glass-ui-mobile.png`
- `.antigravity/archive/audit9/rework-sidebar-final-verified-2/catalog120-split.png`

## 8. 성능 변동과 남은 위험

수정 중 첫 browser-local 구현은 제품 처리와 정착 뒤 2-frame 대기를 한 값으로 합쳐 style 전환을 `329.8ms`로 보고했다. breakdown은 handler `8.8ms`, DOM 정착 `103.4ms`, 이후 frame scheduler `217.6ms`, Long Task 0건이었다. 진단 2~5와 실패 scalability 보고서를 `.antigravity/archive/audit9/rework-diagnostic-*`, `.antigravity/archive/audit9/scalability-rework-verified/`에 보존했다. sidebar 가시성 수정 직후 외부 Vitest가 CPU를 점유한 회차도 processing max `269.6ms`, Long Task 1건으로 실패했으며 `.antigravity/archive/re-audit-independent/sidebar-visibility-green-2/`에 남겼다. 외부 작업 종료 후 actual 직렬 3회와 scalability actual+synthetic가 모두 통과했고 최종 presentation 최대 `247.5ms`는 환경 신호로 계속 공개한다.

남은 위험은 다음과 같다.

- FIN-F016: 운영 CSP/security headers/Google Fonts 정책은 배포 URL과 response header가 생길 때 재감사한다.
- 초기 CSS 예산 잔여는 144 bytes, JS는 384 bytes이므로 다음 기능은 현재 async boundary를 유지하거나 새 예산 승인이 필요하다.
- legacy 24종의 품질 경고 56개는 별도 출처·접근성 조사 없이 제거하지 않는다.

## 9. 재감사 체크리스트 종결

- [x] A→B renderer root/text/motion/Inspector 정합성과 승인 state migration
- [x] Peek/Confirm canonical theme와 non-modal semantics
- [x] direct/cart checkout summary/confirm/cancel/Escape/focus return
- [x] Blog computed light mode와 responsive progress
- [x] lazy loading/error/fatal focus·retry·복원
- [x] Game Enter/Space와 form focus 중 Detail Escape
- [x] empty cart, Clipboard false/throw, AudioContext/SFX failure, bounded lifecycle
- [x] 공통 Detail palette/tuner/sidebar selector, 제목·설명 bounding box와 실제 computed style·육안 표시
- [x] AudioContext 생성 전 volume 0 → 최초 재생 master gain 0
- [x] style/archetype renderer 재생성 뒤 Zoom 120% 재적용
- [x] FIN-F006 processing/presentation/end-to-end 분리 및 직렬 3회 hard gate
- [x] 수정 전 RED와 수정 후 Node/Chrome GREEN 증거
- [x] test/catalog/theme/build/bundle/security audit
- [x] actual-120 직렬 3회와 Wave/Discovery/Scalability diagnostics 0
- [x] Desktop/Mobile/Split 대표 캡처 육안 대조
- [x] source report manifest 무결성
- [ ] 운영 CSP/security headers/Fonts — 배포 증거 대기(FIN-F016)
