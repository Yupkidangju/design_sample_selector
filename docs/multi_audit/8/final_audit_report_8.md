# D3D 통합 재감사 보고서 — Run 8

**프로젝트:** Web Design Sample Selector (`design_sample_selector`)
**감사 기준 버전:** 제품 `2.3.0`
**재감사 기준선:** `docs/multi_audit/7/final_audit_report_7.md`
**감사일:** 2026-08-26 (Asia/Seoul)
**감사 유형:** 수정 완료 후 읽기 중심 재감사(제품 소스 수정 없음)
**실행 환경:** Chromebook Crostini, Linux Google Chrome 151.0.7922.173, Node.js 22.23.2
**최종 판정:** **PASS WITH RISKS — Run 7 릴리스 차단 해제, 신규 Minor 1건**

## 1. 재감사 요약

Run 7에서 릴리스를 차단했던 Major 7건과 기존 Minor 3건은 모두 수정 또는 명세 확정으로 종결되었다. 새 자동 회귀 게이트가 통과했고, 이전에 실패했던 테마 전환·탭 이동·모달 재개방 조합이 실제 Linux Chrome에서 정상 동작했다.

재감사 중 새로 확인된 문제는 1건이다. 스플릿 비교의 End 키 처리를 위해 `Array.prototype.at()`을 사용하지만, 문서의 최소 지원 브라우저는 해당 API를 제공하지 않는 버전까지 포함한다. 현재 Chrome 151과 현대 브라우저에서는 문제가 없으나, 문서에 적힌 구형 브라우저 지원 계약은 그대로 승인할 수 없다.

### 결과 집계

| 구분 | 결과 |
| --- | ---: |
| Run 7 Major 종결 | 7 / 7 |
| Run 7 Minor 종결 | 3 / 3 |
| Run 7 Verified 유지 | 3 / 3 |
| 신규 Critical | 0 |
| 신규 Major | 0 |
| 신규 Minor | 1 |

`REWORK REQUIRED` 판정은 해제한다. 다만 신규 호환성 불일치가 남아 있으므로 무조건 `PASS`가 아니라 `PASS WITH RISKS`로 판정한다.

## 2. 감사 범위 및 방법

### 검토 범위

- Run 7 보고서의 P0/P1/P2 조치 및 13개 개별 finding
- 수정된 제품 문서, 빌드 설정, 생성기, 상세 인스펙터, 스플릿 비교 탭
- 새 모듈 `src/utils/inspectorState.js`, `src/components/splitCompareTabs.js`
- 새 테스트 3파일 및 `npm test`/`npm run check` 릴리스 게이트
- 실제 Chrome의 테마 전환, 4탭/3모드, 슬라이더, 재개방, 8개 아키타입, 스플릿 키보드/ARIA, XSS 경로
- DTCG 2025.10 공식 Format/Color Module과 생성 JSON의 구조 비교
- 의존성 취약점, 동적 코드 실행, 비밀정보 패턴, 빌드 결과

### 제한 범위

- 문서가 선언한 Chrome 90, Firefox 88, Safari 14.5 실기기는 사용할 수 없었다. 호환성 판정은 소스·빌드 산출물과 MDN Browser Compatibility Data를 교차 검증했다.
- 실제 OS 다운로드 폴더에 파일을 쓰는 동작은 수행하지 않았다. 다운로드 직전의 최신 상태 해석, 콘텐츠 생성, 파일명과 MIME 분기를 코드와 브라우저 DOM에서 검증했다.
- Firefox/Safari 시각 회귀, Web Audio 청감 품질, 장시간 성능 프로파일은 이번 재감사 범위 밖이다.
- Chrome 확장 프로그램 출처의 경고는 애플리케이션 결함에서 제외했다.

## 3. 자동 및 정적 검증

| 검증 | 결과 | 근거 |
| --- | --- | --- |
| 통합 게이트 | PASS | `npm run check` |
| 자동 테스트 | PASS | 3개 테스트 파일, 총 8개 명명 테스트 케이스 |
| 프로덕션 빌드 | PASS | Vite 6.4.3, 23 modules transformed |
| 의존성 취약점 | PASS | `npm audit --audit-level=low`: 0 vulnerabilities |
| DTCG 24테마 생성 | PASS | 24 documents; color 214, gradient 2, dimension 96, fontFamily 24, number 24, shadow 24 |
| CSS 선택자 계약 | PASS | 8개 아키타입의 모든 생성 component selector가 실제 DOM에 존재 |
| Web 컴포넌트 탭 | PASS | hero/widget/form/pricing 4개 탭에서 생성 selector 누락 0 |
| 문서·버전 검색 | PASS | 제품 권위 문서와 사용자 노출 버전 v2.3.0 동기화 |
| 코드 형식 | PASS | `git diff --check` |
| 위험 실행 API | PASS | `eval`, `new Function`, 동적 script 생성 징후 없음 |
| 비밀정보 기본 검색 | PASS | 프로젝트 소스의 하드코딩된 자격증명 징후 없음 |

### 자동 테스트 품질 평가

새 테스트는 이전 결함의 원인 경계를 직접 다룬다.

- `tests/designSpecGenerator.test.js`
  - 8개 아키타입 HTML/CSS 선택자 계약
  - 24개 토큰 문서의 DTCG 예약 속성 및 구조화 값 형식
- `tests/inspectorState.test.js`
  - 이벤트 시점의 최신 테마 해석
  - 모달마다 새 기본 UI 상태 생성
  - 누락 테마 거부
  - 4탭/3모드 산출물의 최신 테마 일치
- `tests/splitCompareTabs.test.js`
  - 단일 선택 탭과 roving `tabindex`
  - ArrowLeft/ArrowRight/Home/End 전환 규칙

단위 테스트만으로 DOM 배선 전체를 보장한다고 간주하지 않고, 같은 경로를 실제 Chrome에서 다시 검증했다.

## 4. Run 7 Finding 종결 현황

### IMP-F001 — 생성 CSS와 라이브 DOM 선택자 불일치

- **이전 등급:** Major / Needs Fix
- **재감사 상태:** **Resolved / Verified**
- **정적 근거:** `ARCHETYPE_CSS_MAP`이 `.web-nav-header`, `.mobile-notif-card`, `.add-to-cart-btn`, `.blog-progress-fill`, `.metric-card`, `.vinyl-disc`, `.chat-bubble-msg.user|peer` 등 실제 템플릿 선택자로 변경됐다.
- **자동 근거:** `tests/designSpecGenerator.test.js`의 8개 아키타입 계약 테스트 통과.
- **Chrome 근거:** 8개 아키타입의 모든 생성 selector를 현재 viewport에서 `querySelectorAll`로 확인했으며 누락은 0건이었다. Web의 hero/widget/form/pricing 4탭도 각각 누락 0건이었다.

### IMP-F002 — DTCG 비준수 JSON

- **이전 등급:** Major / Needs Fix
- **재감사 상태:** **Resolved / Verified**
- **구현 근거:**
  - 제품 메타데이터가 `$extensions['com.design-sample-selector']`로 이동.
  - color/gradient는 구조화된 sRGB 값과 gradient stop 배열로 출력.
  - dimension은 `{ value, unit }`, shadow는 구조화 객체/배열, fontFamily는 문자열 배열로 출력.
  - 24개 테마에서 gradient, transparent, rgba, layered shadow 정책이 실제 실행됨.
- **공식 기준:** [DTCG Format Module 2025.10](https://www.designtokens.org/tr/2025.10/format/), [DTCG Color Module 2025.10](https://www.designtokens.org/tr/2025.10/color/).
- **재감사 결과:** 예약 `$` 속성 위반 0건, 모든 토큰 타입의 값 구조 및 범위 검사 통과.

### IMP-F003 — v2.2.2/v2.3.0 권위 문서 드리프트

- **이전 등급:** Major / Needs Documentation Recovery
- **재감사 상태:** **Resolved / Verified**
- **근거:** `audit_roadmap.md`, `BUILD_GUIDE.md`, `DESIGN_DECISIONS.md`가 v2.3.0으로 갱신됐고, `index.html` title과 헤더 badge도 v2.3으로 일치한다. 빌드 가이드의 파일 구조에는 새 생성기·상태·탭·테스트 파일이 포함됐다.
- **설계 회복:** `DESIGN_DECISIONS.md` Decision 009에 최신 상태 해석, CSS 계약 테스트, DTCG 2025.10, 통합 TXT 형식의 결정과 대안이 기록됐다.

### IMP-F004 — “전체 패키지” 형식 모호성

- **이전 등급:** Minor / Needs Spec Clarification
- **재감사 상태:** **Resolved by Specification**
- **근거:** 제품은 ZIP 패키지가 아닌 단일 검토 문서로 결정됐다. UI, 파일명, `spec.md`, `README.md`, `designs.md`, ADR이 모두 `*-integrated-snapshot.txt` 및 “통합 TXT 스냅샷”으로 일치한다.

### DBG-F001 — 테마 교체 후 이전 테마로 회귀하는 stale closure

- **이전 등급:** Major / Needs Fix
- **재감사 상태:** **Resolved / Verified**
- **구현 근거:** 장기 이벤트 클로저에서 `subDesign` 인자를 제거했고, 복사·다운로드·번들·pane 갱신이 `appState.getState()`와 `resolveInspectorContext()`로 최신 디자인을 해석한다.
- **Chrome 재현 결과:**
  1. `swiss-grid` 상세에서 Web 아키타입 선택.
  2. `corporate-minimal`로 무재구축 테마 전환.
  3. CSS Tokens 모드 선택 후 CSS는 corporate만 포함하고 swiss는 포함하지 않음.
  4. JSON `$extensions` ID도 `corporate-minimal` 유지.
  5. radius 42px 조절 후 JSON 탭 이동 시 ID와 `{ value: 42, unit: 'px' }` 유지.

### DBG-F002 — 모달 재개방 시 화면과 내부 인스펙터 상태 불일치

- **이전 등급:** Major / Needs Fix
- **재감사 상태:** **Resolved / Verified**
- **구현 근거:** DETAIL 신규 진입 시 `createDefaultInspectorUiState()`로 CSS/Full 상태를 새로 만든다.
- **Chrome 재현 결과:** JSON/Tokens 상태에서 모달을 닫고 재개방했을 때 다음이 모두 일치했다.
  - 활성 탭 `css`, `aria-selected="true"`
  - 표시 pane `pane-css`
  - CSS mode `full`
  - submode nav `display:flex`
  - 다운로드 라벨 `.css`
  - CSS 내용에 현재 테마 토큰과 component block 모두 포함

### DBG-F003 — 자동 테스트 부재

- **이전 등급:** Major / Needs Fix
- **재감사 상태:** **Resolved / Verified**
- **근거:** `npm test`와 `npm run check`가 추가됐고, 이전 결함을 직접 겨냥한 8개 테스트 케이스가 통과한다. 빌드 가이드에도 자동 게이트와 수동 재현 절차가 추가됐다.

### BUILD-F001 — Node 16 문서와 Vite 6 요구사항 충돌

- **이전 등급:** Major / Needs Documentation Recovery
- **재감사 상태:** **Resolved / Verified**
- **근거:** `package.json#engines`와 lockfile root package는 `^20.0.0 || >=22.0.0`; README와 빌드 가이드는 Node 20.x 또는 22+로 일치한다. Node 22.23.2에서 테스트와 빌드가 통과했다.

### PERF-F001 — 검증되지 않은 60fps/무지연 보장

- **이전 등급:** Minor / Needs Evidence
- **재감사 상태:** **Resolved by Documentation**
- **근거:** `spec.md`, `README.md`, `CHANGELOG.md`, `DESIGN_DECISIONS.md`, 헤더 상태 표시가 고정 60fps·16ms·zero-latency 보장을 제거하고 “rAF 기반 frame coalescing”으로 실제 구현 수준을 설명한다.

### A11Y-F001 — 스플릿 비교 탭 선택 상태 미노출

- **이전 등급:** Minor / Needs Fix
- **재감사 상태:** **Resolved / Verified**
- **구현 근거:** 8개 탭에 `aria-selected`, roving `tabindex`, `aria-controls`; 두 viewport에 `role="tabpanel"`, `aria-labelledby`; Arrow/Home/End 키 처리가 추가됐다.
- **Chrome 근거:**
  - 8개 탭 중 선택 탭과 `tabindex="0"` 탭이 각각 정확히 1개.
  - Chat에서 ArrowRight 입력 후 Game 탭·두 panel·포커스가 함께 전환.
  - End 입력 후 Chat 탭으로 전환.
  - 두 panel의 `aria-labelledby`가 현재 탭 ID로 갱신.

### SEC-F001/002 및 A11Y-F002 — 기존 통과 항목 유지

- **재감사 상태:** **Verified**
- 채팅 입력에 `<img src=x onerror="window.__run8Xss=1">`를 전송했을 때 이미지 노드 0, 문자열 렌더링, 실행 플래그 미설정.
- npm 취약점 0, 위험 동적 실행 API와 하드코딩된 비밀정보 징후 없음.
- 제품 출처의 Chrome console error/warn 0건. 관찰된 경고는 `chrome-extension://` 출처였다.
- 모달 상태 수정은 기존 focus trap 경계를 제거하지 않았다.

## 5. 신규 Finding

### BUILD-F002 — 선언된 최소 브라우저와 `Array.prototype.at()` 사용이 충돌

- **Pass:** Cross-pass — Build / Compatibility / Accessibility
- **Pattern / Area:** 브라우저 호환성 계약
- **Severity:** Minor
- **Status:** Needs Fix
- **Summary:** 새 스플릿 탭의 End 키 처리에서 `Array.prototype.at(-1)`을 사용하지만, 빌드 가이드는 이 API 도입 전 브라우저까지 지원한다고 선언한다.
- **Evidence:**
  - 사용 위치: `src/components/splitCompareTabs.js:27`
  - 지원 문서: `BUILD_GUIDE.md:11` — Chrome/Edge 90+, Firefox 88+, Safari 14.5+
  - 빌드 설정: `vite.config.js:10`의 `target: 'esnext'`; 프로덕션 번들에도 `.at(-1)`이 그대로 남음.
  - MDN Browser Compatibility Data는 Array `.at()` 지원 시작을 Chrome/Edge 92, Firefox 90, Safari 15.4로 기록한다: [MDN BCD Array data](https://github.com/mdn/browser-compat-data/blob/main/javascript/builtins/Array.json), [MDN Array.prototype.at](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at).
- **Expected:** 문서에 지원 대상으로 적힌 모든 브라우저에서 스플릿 탭의 End 키가 오류 없이 마지막 탭으로 이동해야 한다.
- **Actual:** Chrome/Edge 90–91, Firefox 88–89, Safari 14.5–15.3에서는 `SPLIT_ARCHETYPES.at`이 존재하지 않아 End 키 경로가 `TypeError`를 발생시킬 수 있다.
- **Impact:** 현재 Crostini Chrome 151에는 영향이 없지만, 명시된 지원 브라우저 일부에서 새 접근성 키보드 기능이 실패한다.
- **Suggested Fix:** 의존성 없는 현재 구조에서는 `SPLIT_ARCHETYPES[SPLIT_ARCHETYPES.length - 1].id`로 바꾸는 것이 가장 작고 안전하다. 대안은 지원 최소 버전을 Chrome/Edge 92, Firefox 90, Safari 15.4로 올리고 문서·테스트 환경을 함께 변경하는 것이다.
- **Re-audit:** 빌드 산출물에서 `.at(`이 제거됐는지 확인하고, 지원 최소 버전 또는 이에 대응하는 호환성 테스트에서 End 키 동작을 검증한다.
- **Owner:** Frontend / Build / Accessibility

## 6. 잔여 위험과 비차단 개선 사항

- 자동 CSS 계약 테스트는 class 존재를 중심으로 한다. 이번 Chrome 재감사에서는 compound/descendant/pseudo selector까지 전부 확인했지만, 이 더 강한 검사를 테스트 코드에도 반영하면 향후 보호 수준이 높아진다.
- DTCG 2025.10은 현재 JSON Schema를 제공하지 않으므로 프로젝트가 규범 구조를 직접 검사한다. 향후 공식 validator/schema가 제공되면 이중 검증을 권장한다.
- 토큰 다운로드는 `application/json`과 `*-tokens.json`을 사용한다. DTCG 문서가 선호하는 `application/design-tokens+json` 및 `.tokens.json` 형식도 고려할 수 있으나, 현재 형식도 사양에서 허용되므로 finding으로 분류하지 않았다.
- 이번 재감사는 Chrome 151에서 실행됐다. 문서의 Firefox/Safari 지원은 별도 실기기 또는 CI browser matrix로 검증하는 편이 안전하다.

## 7. 재감사 판정 게이트

| Gate | 상태 |
| --- | --- |
| Run 7 Major 7건 종결 | PASS |
| Run 7 Minor 3건 종결 | PASS |
| 테스트·빌드 게이트 | PASS |
| 실제 Chrome 핵심 상태 전이 | PASS |
| DTCG 2025.10 구조 | PASS |
| 보안 기본 검사 | PASS |
| 접근성 상태/키보드 | PASS — 현재 Chrome |
| 선언된 전체 브라우저 호환성 | PASS WITH RISK — BUILD-F002 |

## 8. 최종 판정

**PASS WITH RISKS**

Run 7의 `REWORK REQUIRED` 원인은 모두 종결되었으며, 현재 Crostini Linux Chrome 환경에서 핵심 기능은 정상 동작한다. 수정본은 전체적으로 코드 건강성과 검증 가능성을 크게 개선했다. 남은 BUILD-F002는 현재 환경과 현대 브라우저의 릴리스를 차단할 정도는 아니지만, 문서에 적힌 구형 브라우저 지원 계약과 접근성 End 키 기능이 충돌하므로 다음 배포 전에 코드 호환 수정 또는 지원 버전 상향 중 하나를 선택해야 한다.

이번 재감사에서는 제품 소스와 기존 제품 문서를 수정하지 않았고, 이 Run 8 보고서만 추가했다.
