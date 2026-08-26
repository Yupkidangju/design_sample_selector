# D3D 통합 감사 보고서 — Run 7

**프로젝트:** Web Design Sample Selector (`design_sample_selector`)
**감사 기준 버전:** 제품 `2.3.0`
**감사일:** 2026-08-26 (Asia/Seoul)
**감사 유형:** `/audit` 읽기 중심 감사 + 수정 요청 반영 재감사
**실행 환경:** Chromebook Crostini, 별도 설치된 Linux Google Chrome 151.0.7922.173
**수정 전 판정:** **REWORK REQUIRED — 릴리스 게이트 차단**
**수정 후 최종 판정:** **PASS WITH RISKS — Major 7건 해소, 릴리스 게이트 해제**

> 1~10절은 최초 감사 당시의 발견사항과 판정 근거를 보존한다. 수정 결과와 현재 판정은 11절을 최종 기준으로 삼는다.

## 1. 요약

최초 감사에서 빌드, 정적 카탈로그 무결성, 기본 반응형 레이아웃, 모달 포커스 트랩, 사용자 입력의 DOM 주입 방어, 의존성 취약점 검사는 통과했다. 그러나 v2.3.0의 핵심 계약인 **현재 선택·조정 상태와 100% 동기화된 CSS/HTML/Markdown/토큰 내보내기**는 실제 Chrome에서 충족되지 않았다.

당시 확정된 핵심 결함은 다음과 같다.

1. 8개 아키타입 중 7개의 생성 CSS가 실제 라이브 마크업 선택자와 불일치한다.
2. 모달 안에서 서브스타일을 무재구축(zero-rebuild) 방식으로 교체한 뒤 인스펙터 탭이나 CSS 서브모드를 누르면, 코드와 JSON이 이전 테마로 되돌아간다.
3. 모달을 닫았다 다시 열면 내부 인스펙터 상태와 화면의 활성 탭 표시가 달라져 일부 버튼이 무반응이 된다.
4. “W3C DTCG 준수”라고 명시된 JSON은 현행 DTCG 형식의 색상·치수·그림자 값 구조와 예약 속성 규칙을 충족하지 않는다.
5. 위 핵심 경로를 보호할 자동 테스트와 테스트 스크립트가 없다.

### 결함 집계

| 등급 | 수 | 릴리스 영향 |
| --- | ---: | --- |
| Critical | 0 | 없음 |
| Major | 7 | 모두 수정 및 재감사 필요 |
| Minor | 3 | 수정 또는 명시적 위험 수용 필요 |
| Verified / 정보 | 3 | 통과 근거로 유지 |

수정 전 판정이 `PASS WITH RISKS`가 아니었던 이유는, 발견된 Major 결함이 부가 기능이 아니라 v2.3.0의 대표 사용자 기능과 내보낸 산출물의 정확성을 직접 훼손했기 때문이다.

## 2. 감사 범위와 기준

### 포함 범위

- `spec.md`, `README.md`, `designs.md`, `CHANGELOG.md`, `BUILD_GUIDE.md`, `DESIGN_DECISIONS.md`, `implementation_summary.md`, `audit_roadmap.md`
- `index.html`, `index.css`, `src/**`, `package.json`, `package-lock.json`
- 8대 분류 × 24개 서브스타일, 8개 아키타입, 4개 인스펙터 탭, 3개 CSS 서브모드
- 클라이언트 파일 생성·복사·다운로드 경로
- Chrome 실제 런타임 동작, 반응형 분기, 키보드 포커스, 사용자 입력 렌더링
- 빌드, 의존성 취약점, 비밀정보 패턴, 동적 코드 실행 여부

### 제외 또는 제한 범위

- 서버·인증·데이터베이스·운영 배포는 프로젝트 범위에 존재하지 않아 제외했다.
- 실제 파일 다운로드 저장 위치와 OS 파일 관리자 연동은 브라우저 자동화의 범위 밖이며, 다운로드 직전 생성 내용과 파일명 로직을 검사했다.
- Web Audio의 청감 품질, 장시간 메모리 안정성, Firefox/Safari 실기기 호환성은 이번 실행에서 확인하지 않았다.
- `60fps` 수치는 성능 트레이스로 입증하지 못했으며 별도 근거가 필요하다.
- Chrome 콘솔의 MetaMask 등 `chrome-extension://` 출처 경고는 애플리케이션 결함에서 제외했다. 애플리케이션 출처 오류는 관찰되지 않았다.

### 판정 기준

- **Major:** 핵심 기능, 산출물 정확성, 빌드/문서 권위 체계를 크게 훼손하며 릴리스 전에 수정해야 함
- **Minor:** 핵심 흐름을 완전히 차단하지 않지만 접근성, 명세 명확성 또는 검증 신뢰도를 낮춤
- **Verified:** 코드와 실제 실행 증거가 일치해 현재 감사에서 통과
- **Needs Documentation Recovery:** 코드보다 권위 문서가 뒤처져 감사·유지보수의 기준을 오도함
- **Needs Spec Clarification:** 현재 문구만으로 한 가지 정답을 확정할 수 없음

## 3. 최초 실행 및 검증 결과

| 검증 | 결과 | 근거 |
| --- | --- | --- |
| 프로덕션 빌드 | PASS | `npm run build`; Vite 6.4.3, 21 modules transformed, 정상 종료 |
| npm 의존성 감사 | PASS | `npm audit --audit-level=low`; 취약점 0건 |
| Git 초기 상태 | PASS | 감사 전 추적 변경 없음 |
| 카탈로그 무결성 | PASS | 8개 대분류, 각 3개 서브스타일, 총 24개, 중복 ID 0 |
| 테마 토큰 매핑 | PASS | 24개 정규 ID 모두 토큰 매핑 존재 |
| 오디오 프리셋 정적 검사 | PASS | BGM 16개, SFX 분기 14개 |
| WASM 비사용 | PASS | `.wasm` 파일 및 `WebAssembly` API 사용 없음 |
| 슬라이더 기본값 | PASS | 모든 기본값이 정의된 최소·최대 범위 안에 있음 |
| 반응형 레이아웃 | PASS | Chrome 767px/768px/1200px에서 1열/1열/2열 및 overflow 분기 확인 |
| 모달 포커스 트랩 | PASS | 마지막 컨트롤에서 Tab 시 첫 컨트롤, 첫 컨트롤에서 Shift+Tab 시 마지막 컨트롤로 순환 |
| 사용자 입력 XSS 회귀 검사 | PASS | 블로그 댓글에 `<img ... onerror=...>` 입력 시 이미지 노드 0, 문자열 그대로 렌더링, 실행 플래그 미설정 |
| 앱 출처 콘솔 오류 | PASS | 주요 상호작용 후 애플리케이션 출처 오류 0건 |
| 자동 테스트·린트 | FAIL | `package.json`에 `test`/`lint` 스크립트가 없고 테스트 파일이 없음 |

## 4. Pass 1 — 명세 및 구현 정합성

### IMP-F001 — 생성 아키타입 CSS와 실제 라이브 DOM 선택자 불일치

- **Pass:** 1 — Specification Compliance
- **Pattern / Area:** 산출물 계약 / CSS 생성기
- **Severity:** Major
- **Status:** Needs Fix
- **Summary:** `ARCHETYPE_CSS_MAP`이 라이브 템플릿과 별도로 수동 관리되어, 8개 아키타입 중 7개에서 생성 CSS의 핵심 선택자가 실제 DOM에 존재하지 않는다.
- **Evidence:**
  - 생성기: `src/utils/designSpecGenerator.js:373-544`
  - 라이브 템플릿: `src/components/archetypeTemplates.js`
  - 정적 교차 검사 결과:

    | 아키타입 | 생성 CSS에 있으나 해당 라이브 DOM에 없는 선택자 |
    | --- | --- |
    | game | 없음 |
    | web | `.saas-hero-section`, `.saas-hero-title`, `.btn-saas-primary` |
    | mobile | `.mobile-card`, `.mobile-tab-bar` |
    | ecommerce | `.product-card`, `.btn-add-to-cart` |
    | blog | `.reading-progress-bar`, `.article-header` |
    | dashboard | `.metric-kpi-card` |
    | media | `.media-disk-art` |
    | chat | `.chat-bubble`, `.mine`, `.theirs` |

  - Chrome Web 아키타입 재현: 생성 CSS에는 `.saas-hero-section`이 있으나 DOM 개수는 0이고, 실제 DOM의 `.web-nav-header`는 1개지만 생성 CSS에는 해당 규칙이 없다.
  - 계약: `spec.md:40`, `README.md:50`, `CHANGELOG.md:11`은 현재 아키타입 CSS와의 100% 연동을 명시한다.
- **Expected:** 선택된 아키타입의 실제 렌더링 구조를 스타일링할 수 있는 선택자와 규칙이 내보내져야 한다.
- **Actual:** 내보낸 CSS의 다수 규칙이 실제 마크업에 적용되지 않으며, 실제 핵심 DOM 선택자는 누락된다.
- **Impact:** 사용자가 내보낸 CSS/HTML을 함께 사용해도 라이브 미리보기와 같은 결과를 재현할 수 없다.
- **Suggested Fix:** 템플릿과 CSS 생성기의 선택자 계약을 하나의 공용 아키타입 정의로 통합하거나, 각 생성 CSS 선택자가 실제 템플릿에 존재하는지 검사하는 계약 테스트를 추가한다.
- **Re-audit:** 8개 아키타입 × 필요한 컴포넌트 탭에 대해 생성 선택자와 DOM 선택자를 자동 교차 검사하고, 내보낸 HTML+CSS를 빈 문서에서 렌더링해 시각/계산 스타일을 확인한다.
- **Owner:** Frontend / Design System

### IMP-F002 — 내보낸 Design Tokens JSON이 DTCG 준수 형식이 아님

- **Pass:** 1 — Specification Compliance
- **Pattern / Area:** 공개 산출물 계약 / 디자인 토큰
- **Severity:** Major
- **Status:** Needs Fix
- **Summary:** 생성기는 스스로 `W3C DTCG Compliant`라고 표기하지만, 현행 DTCG 토큰 형식의 필수 값 구조와 예약 속성 규칙을 충족하지 않는다.
- **Evidence:**
  - `src/utils/designSpecGenerator.js:803-846`
  - 정의되지 않은 최상위 예약형 속성 `$name`, `$id`, `$version`을 사용한다.
  - `color` 값을 `"#F4F4F0"`, gradient, `rgba(...)`, `transparent` 같은 CSS 문자열로 출력한다.
  - `dimension` 값을 `"12px"` 같은 문자열로 출력한다.
  - `shadow` 값을 CSS `box-shadow` 문자열로 출력한다.
  - 현행 DTCG 형식은 `$`로 시작하는 이름을 정의된 형식 속성으로 제한하고, dimension을 `{ "value": number, "unit": "px" | "rem" }`, color와 shadow를 구조화된 값으로 정의한다.
  - 공식 기준: [Design Tokens Format Module 2025.10](https://www.designtokens.org/tr/2025.10/format/), [Color Module 2025.10](https://www.designtokens.org/tr/2025.10/color/)
  - 계약: `spec.md:43`, `README.md:53`, `designs.md:145`, `CHANGELOG.md:13`.
- **Expected:** 명시한 DTCG 버전에 대해 파싱·검증 가능한 토큰 문서가 생성되어야 한다.
- **Actual:** JSON 문법은 유효하지만 DTCG 타입 값과 속성 구조가 아니다.
- **Impact:** DTCG 호환 도구가 값을 거부하거나 임의의 일반 JSON으로 처리할 수 있고, “표준 준수” 사용자 약속이 성립하지 않는다.
- **Suggested Fix:** 목표 DTCG 버전을 문서에 고정하고, 색상·치수·그림자·fontFamily를 해당 스키마 구조로 직렬화한다. 제품 메타데이터는 `$extensions` 같은 허용된 확장 지점 또는 별도 manifest로 분리한다.
- **Re-audit:** 공식 예제/스키마 기반 검증과 최소 24개 테마의 직렬화 테스트를 실행한다. gradient·transparent처럼 단일 color 토큰으로 표현할 수 없는 값의 정책도 검사한다.
- **Owner:** Design System / Documentation

### IMP-F003 — v2.3.0 권위 문서 체인이 v2.2.2 상태로 남음

- **Pass:** 1 — Specification Compliance
- **Pattern / Area:** 문서 권위 / 버전 동기화
- **Severity:** Major
- **Status:** Needs Documentation Recovery
- **Summary:** 제품·명세는 v2.3.0이지만 감사 로드맵은 v2.2.2 명세를 “살아 있는 계약”으로 선언하고, 빌드 가이드와 설계 결정 기록도 v2.2.2에 머물러 있다.
- **Evidence:**
  - `package.json:3`, `spec.md:3,11`, `README.md:1`은 `2.3.0`.
  - `audit_roadmap.md:3,6,14`는 `2.2.2` 및 `spec.md v2.2.2`를 권위 계약으로 선언.
  - `BUILD_GUIDE.md:3`, `DESIGN_DECISIONS.md:3`은 `2.2.2`.
  - `BUILD_GUIDE.md:48-49`의 utils 구조에는 v2.3.0 핵심 파일 `designSpecGenerator.js`가 없다.
  - `index.html:6`과 `src/components/header.js:32`는 사용자에게 `v2.2`를 표시한다.
- **Expected:** 최신 `spec.md`를 기준으로 감사 로드맵, 실행 가이드, 설계 결정, 사용자 버전 표시가 동기화되어야 한다.
- **Actual:** 감사 기준과 사용자 표시가 서로 다른 제품 버전을 가리킨다.
- **Impact:** 이전 감사 체크리스트가 새 인스펙터 기능을 충분히 검증하지 못하고, 유지보수자와 사용자가 현재 릴리스 범위를 오해할 수 있다.
- **Suggested Fix:** `audit_roadmap.md`, `BUILD_GUIDE.md`, `DESIGN_DECISIONS.md`, `index.html`, 헤더 배지를 v2.3.0 계약에 맞춰 복구한다. v2.3 인스펙터의 단일 상태 원천, 생성기 계약, 내보내기 형식 결정을 설계 기록에 추가한다.
- **Re-audit:** 모든 제품 버전 표기와 권위 문서 링크를 검색하고, 문서의 파일 구조·체크리스트가 실제 저장소와 일치하는지 확인한다.
- **Owner:** Documentation / Release

### IMP-F004 — “전체 패키지”의 산출물 형식이 명세에서 불명확

- **Pass:** 1 — Specification Compliance
- **Pattern / Area:** 공개 인터페이스 / 다운로드
- **Severity:** Minor
- **Status:** Needs Spec Clarification
- **Summary:** UI와 명세는 “전체 번들 패키지” 또는 “일괄 내보내기”라고 표현하지만 실제로는 4개 파일을 하나의 `.txt`에 주석 처리해 합친다.
- **Evidence:** `src/components/detailView.js:958-995`는 JSON, Markdown, CSS, HTML을 `*-full-bundle.txt` 한 파일로 저장한다. `spec.md:44`, `README.md:54`는 패키지/일괄 내보내기를 명시하지만 컨테이너 형식을 정하지 않는다.
- **Expected:** 사용자 기대가 ZIP 안의 4개 파일인지, 단일 검토용 텍스트인지 명세와 UI에서 명확해야 한다.
- **Actual:** “FILE 1/4” 등으로 표시하지만 분리된 파일이 아니며 그대로 도구에 투입할 수 없다.
- **Impact:** 사용자는 “전체 패키지”를 직접 사용할 수 있는 파일 묶음으로 오해할 수 있다.
- **Suggested Fix:** ZIP 등 실제 4파일 패키지로 제공하거나, 기능명을 “통합 텍스트 스냅샷”으로 바꾸고 `.txt` 형식을 명세한다.
- **Re-audit:** 확정된 형식, MIME, 파일명, 각 파일의 파싱 가능성을 검사한다.
- **Owner:** Product / Frontend

## 5. Pass 2 — 엔지니어링 및 런타임 품질

### DBG-F001 — 무재구축 테마 교체 후 인스펙터가 이전 테마로 회귀

- **Pass:** 2 — Engineering / Debugging
- **Pattern / Area:** stale closure / 상태 동기화
- **Severity:** Major
- **Status:** Needs Fix
- **Summary:** 이벤트 리스너가 최초 렌더의 `subDesign`을 클로저로 보관해, 테마를 교체한 뒤 탭·서브모드를 조작하면 이전 테마로 콘텐츠를 다시 생성한다.
- **Evidence:**
  - `attachDetailEventListeners(root, subDesign, mainCat)` 호출: `src/components/detailView.js:515`
  - 클로저가 보관한 `subDesign`을 탭/서브모드/다운로드/번들에서 재사용: `src/components/detailView.js:853-995`
  - Chrome 재현:
    1. `swiss-grid` 상세 열기.
    2. 상단 서브스타일을 `corporate-minimal`로 교체 — 제목, viewport, CSS, JSON이 일단 정상 변경됨.
    3. CSS의 `테마 토큰만` 클릭 — 화면 제목·viewport는 `corporate-minimal`이지만 CSS와 JSON `$id`는 `swiss-grid`로 회귀.
    4. radius를 42px로 조절하면 현재 상태 기반 갱신 경로를 타며 다시 `corporate-minimal`로 회복.
    5. JSON 탭 클릭 시 `$id`가 다시 `swiss-grid`로 회귀.
- **Expected:** 모든 갱신 경로가 `appState.selectedSubCategory`의 최신 값을 단일 원천으로 사용해야 한다.
- **Actual:** 슬라이더 경로와 탭/서브모드 경로가 서로 다른 테마 객체를 사용한다.
- **Impact:** 화면과 복사·다운로드 내용이 달라져 잘못된 디자인 자산을 전달한다.
- **Suggested Fix:** 이벤트 시점에 최신 `appState`에서 서브디자인을 해석하거나, 인스펙터 상태와 선택 상태를 한 상태 모델에 넣고 단일 렌더/생성 함수로 통합한다. 클로저 인자로 변경 가능한 도메인 객체를 전달하지 않는다.
- **Re-audit:** 24개 테마 전환 후 4탭 × 3 CSS 모드 × 슬라이더 변경 × 개별/번들 다운로드 조합에서 ID, 제목, 토큰, CSS 선택자가 현재 화면과 일치하는지 자동 검사한다.
- **Owner:** Frontend State Management

### DBG-F002 — 모달 재개방 시 내부 인스펙터 상태와 활성 UI가 불일치

- **Pass:** 2 — Engineering / Debugging
- **Pattern / Area:** persistent local state / DOM 초기화
- **Severity:** Major
- **Status:** Needs Fix
- **Summary:** `activeInspectorTab`과 `activeCssSubMode`는 `renderDetailView` 클로저에 유지되지만, 새 모달 마크업은 항상 CSS/전체 번들을 활성 상태로 하드코딩한다.
- **Evidence:**
  - 지속되는 로컬 상태: `src/components/detailView.js:44-45`
  - 하드코딩된 CSS 탭 및 전체 번들 활성 상태: `src/components/detailView.js:440-459`
  - 클릭 핸들러는 내부 상태와 같은 값을 누르면 즉시 반환: `src/components/detailView.js:856`, `894`.
  - Chrome 재현: JSON 탭과 tokens 모드를 선택한 뒤 닫고 다시 열면 화면은 CSS/전체 번들을 활성 표시하지만 실제 CSS 내용은 tokens-only였다. 이 상태에서 `테마 토큰만`과 `Design Tokens`를 눌러도 내부 상태가 이미 같아 클릭이 무반응이었다.
- **Expected:** 재개방 시 상태를 기본값으로 초기화하거나, 유지된 상태대로 DOM의 활성 탭·pane·서브모드를 렌더링해야 한다.
- **Actual:** 상태와 DOM이 서로 다른 초기값을 사용한다.
- **Impact:** 활성 탭 표시를 신뢰할 수 없고 일부 컨트롤이 고장 난 것처럼 보인다.
- **Suggested Fix:** 인스펙터 상태를 명시적으로 초기화하거나 마크업을 `activeInspectorTab`/`activeCssSubMode` 기반으로 렌더링한다. 렌더 후 상태-DOM 불변조건을 하나의 함수로 강제한다.
- **Re-audit:** 각 탭/모드에서 모달 닫기→재개방을 반복하고 활성 버튼, `aria-selected`, 표시 pane, 다운로드 라벨, 콘텐츠 종류가 일치하는지 확인한다.
- **Owner:** Frontend State Management

### DBG-F003 — 핵심 생성·상태 경로를 보호하는 자동 테스트가 없음

- **Pass:** 2 — Engineering / Testing
- **Pattern / Area:** 회귀 방지 / 품질 게이트
- **Severity:** Major
- **Status:** Needs Fix
- **Summary:** v2.3.0은 대규모 생성기와 상태 동기화 기능을 추가했으나 테스트 러너, 테스트 스크립트, 테스트 파일이 없다.
- **Evidence:** `package.json:6-10`에는 `dev`, `build`, `preview`만 있다. 저장소에서 일반적인 테스트 파일/디렉터리가 발견되지 않았다. 이번 감사에서 정적 빌드만으로는 잡히지 않는 DBG-F001/002와 IMP-F001/002가 실제 브라우저에서 재현됐다.
- **Expected:** 생성기 계약과 핵심 사용자 흐름을 결정론적으로 검증하는 단위·통합·브라우저 테스트가 릴리스 게이트에 포함되어야 한다.
- **Actual:** 문법·번들 가능 여부만 자동 확인할 수 있다.
- **Impact:** 동일 계열 회귀가 빌드 성공 상태로 릴리스될 가능성이 높다.
- **Suggested Fix:** 최소한 생성기 직렬화, DOM/CSS 선택자 계약, 테마 교체 후 4탭 동기화, 재개방 상태, XSS, ARIA 선택 상태를 테스트하고 `npm test` 또는 동등한 단일 게이트로 묶는다.
- **Re-audit:** 깨진 구현에서 실패하고 수정 후 통과하는 회귀 테스트를 확인한다.
- **Owner:** QA / Frontend

### BUILD-F001 — 문서의 Node.js 16 지원 주장이 설치된 Vite 요구사항과 충돌

- **Pass:** 2 — Build / Runtime
- **Pattern / Area:** 환경 계약
- **Severity:** Major
- **Status:** Needs Documentation Recovery
- **Summary:** 빌드 가이드는 Node.js 16 이상을 허용하지만 설치된 Vite 6.4.3은 Node 18/20/22+ 계열을 요구한다.
- **Evidence:** `BUILD_GUIDE.md:10`은 `Node.js >= 16.x`; 로컬 `node_modules/vite/package.json`의 v6.4.3 `engines.node`는 `^18.0.0 || ^20.0.0 || >=22.0.0`; `package.json:12`는 Vite `^6.2.0`.
- **Expected:** 새 환경이 문서의 최소 버전으로 설치·빌드되어야 한다.
- **Actual:** Node 16은 현재 도구체인의 지원 범위 밖이다.
- **Impact:** 문서대로 구성한 새 개발 환경에서 설치 또는 빌드가 실패할 수 있다.
- **Suggested Fix:** 지원 Node 버전을 Vite 요구사항과 맞추고 `package.json`의 `engines`로 기계 검증 가능하게 고정한다. 실제 지원하려는 LTS 범위를 명시한다.
- **Re-audit:** 최소 지원 Node 버전의 깨끗한 환경에서 `npm ci && npm run build`를 실행한다.
- **Owner:** Build / Documentation

### PERF-F001 — `60fps` 동기화 주장을 재현 가능한 성능 근거가 뒷받침하지 않음

- **Pass:** 2 — Performance
- **Pattern / Area:** 비기능 요구사항 / 증거
- **Severity:** Minor
- **Status:** Needs Evidence
- **Summary:** `requestAnimationFrame` 사용은 확인되지만, `60fps` 또는 무지연이라는 제품 문구를 입증하는 예산·측정·테스트가 없다.
- **Evidence:** `CHANGELOG.md:15`는 60fps 및 프레임 드롭 없음으로 표현한다. `src/components/detailView.js`에는 rAF 갱신 경로가 있으나 프레임 시간, 긴 작업, 저사양 Crostini 조건의 측정 결과는 저장되어 있지 않다.
- **Expected:** 측정 가능한 목표(예: 입력 중 p95 프레임 시간, 긴 작업 수)와 재현 절차가 있어야 한다.
- **Actual:** 구현 기법이 성능 결과의 근거를 대신한다.
- **Impact:** 저사양 기기나 긴 코드 블록에서 성능 회귀가 발생해도 게이트가 탐지하지 못한다.
- **Suggested Fix:** 대표 테마/아키타입에서 연속 슬라이더 입력 성능을 프로파일링하고 예산을 문서화한다. 보장할 수 없다면 제품 문구를 “rAF 기반 갱신”으로 완화한다.
- **Re-audit:** 동일 기기·동일 시나리오의 트레이스와 정의된 임계값을 확인한다.
- **Owner:** Frontend Performance

## 6. Pass 3 — 보안, 접근성 및 운영 위험

### SEC-F001 — 사용자 입력의 HTML 실행 방어

- **Pass:** 3 — Security
- **Pattern / Area:** DOM XSS
- **Severity:** Info
- **Status:** Verified
- **Summary:** 댓글·채팅 사용자 입력은 실행 가능한 HTML로 삽입되지 않는다.
- **Evidence:** 소스에서 사용자 입력 경로가 `textContent`를 사용한다. Chrome에서 `<img src=x onerror="window.__auditXss=1">` 댓글을 추가했을 때 이미지 노드 0개, 문자열 그대로 표시, 실행 플래그는 설정되지 않았다.
- **Expected / Actual:** 모두 텍스트 렌더링으로 일치.
- **Impact:** 검사한 입력 경로에서 DOM XSS가 차단된다.
- **Re-audit:** 사용자 입력 경로가 추가되면 회귀 테스트를 확장한다.
- **Owner:** Frontend / Security

### SEC-F002 — 의존성·동적 실행·비밀정보 기본 검사

- **Pass:** 3 — Security
- **Pattern / Area:** 공급망 / 코드 실행 / 비밀정보
- **Severity:** Info
- **Status:** Verified
- **Summary:** 현재 설치 잠금 상태에서 알려진 npm 취약점이 없고, `eval`/`new Function`/동적 script 실행과 추적된 비밀 파일은 발견되지 않았다.
- **Evidence:** `npm audit --audit-level=low` 0건; 정적 검색에서 위험 실행 API 없음; 비밀정보 패턴 검색은 문서의 일반 용어만 탐지.
- **Expected / Actual:** 검사 범위에서 위험 징후 없음.
- **Impact:** 현재 클라이언트 전용 범위의 기본 공격 표면은 낮다.
- **Re-audit:** 의존성 또는 외부 연동 추가 시 반복한다.
- **Owner:** Security / Build

### A11Y-F001 — 스플릿 비교 아키타입 탭의 선택 상태가 보조기기에 전달되지 않음

- **Pass:** 3 — Accessibility
- **Pattern / Area:** ARIA tabs
- **Severity:** Minor
- **Status:** Needs Fix
- **Summary:** 스플릿 비교 아키타입 버튼은 `role="tab"`을 사용하지만 `aria-selected`가 없고 활성 전환 때도 갱신하지 않는다.
- **Evidence:** 생성 마크업 `src/components/detailView.js:1153-1161`; 전환 로직 `src/components/detailView.js:1248-1250`은 CSS class만 토글한다. Chrome에서 8개 탭의 `ariaSelected`는 모두 `null`이었다.
- **Expected:** 활성 탭은 `aria-selected="true"`, 나머지는 `false`이며 키보드 포커스 정책과 연결 panel 관계가 일관되어야 한다.
- **Actual:** 시각적 class만 상태를 전달한다.
- **Impact:** 스크린 리더 사용자가 현재 비교 아키타입을 알기 어렵다.
- **Suggested Fix:** 활성 전환 시 `aria-selected`와 필요 시 roving `tabindex`, `aria-controls`/`role="tabpanel"`을 함께 관리한다.
- **Re-audit:** 접근성 트리와 키보드만으로 8개 탭 전환을 확인한다.
- **Owner:** Frontend / Accessibility

### A11Y-F002 — 상세 모달 포커스 순환

- **Pass:** 3 — Accessibility
- **Pattern / Area:** modal focus trap
- **Severity:** Info
- **Status:** Verified
- **Summary:** 상세 모달에서 포커스가 모달 밖으로 빠져나가지 않도록 양방향 순환한다.
- **Evidence:** 실제 Chrome에서 마지막 번들 버튼에서 Tab 시 상단 뒤로가기 버튼으로, 첫 버튼에서 Shift+Tab 시 마지막 번들 버튼으로 이동했다.
- **Expected / Actual:** 일치.
- **Owner:** Frontend / Accessibility

## 7. 교차 패스 분석

### XPF-F001 — “100% 동기화” 계약과 상태 구조가 상충

IMP-F001, DBG-F001, DBG-F002는 독립된 표면 증상이지만 같은 구조적 원인을 공유한다. 라이브 템플릿, 생성 CSS, 현재 선택 테마, 인스펙터 UI 상태가 하나의 계약/상태 원천에서 파생되지 않고 각각 수동 관리된다. 개별 조건문만 보완하면 다른 탭·다운로드·아키타입에서 같은 종류의 회귀가 반복될 가능성이 높다.

**필요 조치:** 아키타입 템플릿과 생성 규칙을 공용 모델로 묶고, 인스펙터의 모든 파생 결과가 최신 애플리케이션 상태에서 계산되도록 경계를 재설계한다.

### XPF-F002 — 기존 감사의 PASS 근거가 v2.3.0 신규 경로를 보장하지 못함

기존 감사 자료는 빌드·정적 수량·이전 기능 정합성을 폭넓게 확인했지만, 현재 Chrome에서 재현된 테마 교체→탭 전환과 모달 재개방 조합을 검증하지 않았다. `audit_roadmap.md`가 v2.2.2에 머문 문서 드리프트와 자동 회귀 테스트 부재가 결합해 v2.3.0 결함을 통과시켰다.

**필요 조치:** 최신 명세로 감사 로드맵을 복구하고, 복합 상태 전이를 릴리스 게이트의 필수 시나리오로 추가한다.

## 8. 우선순위별 조치 목록

### P0 — 재감사 전에 반드시 완료

1. 인스펙터의 `subDesign` stale closure 제거 및 모든 생성/다운로드 경로의 최신 상태 단일화.
2. 모달 재개방 시 인스펙터 탭·pane·CSS 모드·ARIA·다운로드 라벨 상태 일치.
3. 8개 아키타입 생성 CSS와 실제 템플릿 선택자 계약 통합.
4. DTCG 목표 버전 확정 및 구조화된 표준 토큰 값으로 생성기 교체.
5. 위 네 경로의 실패를 재현하는 자동 회귀 테스트 추가.

### P1 — 릴리스 문서 및 환경 복구

1. `audit_roadmap.md`, `BUILD_GUIDE.md`, `DESIGN_DECISIONS.md`, 페이지 title, 헤더 버전을 v2.3.0에 동기화.
2. Node 최소 버전과 `package.json#engines` 동기화.
3. 스플릿 탭 `aria-selected` 및 키보드 탭 패턴 보완.

### P2 — 제품 결정 또는 증거 필요

1. 전체 패키지를 실제 다중 파일 패키지로 할지 단일 텍스트 스냅샷으로 할지 확정.
2. `60fps` 성능 주장의 측정 기준과 재현 가능한 트레이스 마련.

## 9. 최초 발행 재감사 체크리스트

- [ ] 테마 A에서 B로 교체한 뒤 CSS Full/Tokens/Component, HTML, Markdown, JSON이 모두 B를 가리킨다.
- [ ] 테마 교체 뒤 복사, 개별 다운로드, 전체 패키지가 화면의 현재 테마·아키타입·슬라이더 값과 일치한다.
- [ ] 모달을 각 인스펙터 탭/모드에서 닫고 다시 열어도 내부 상태와 활성 UI가 일치한다.
- [ ] 8개 아키타입의 생성 CSS 선택자가 실제 내보낸 HTML에 존재하며 계산 스타일이 적용된다.
- [ ] 24개 테마 토큰 JSON이 명시된 DTCG 버전 검증을 통과한다.
- [ ] gradient, transparent, shadow, fontFamily의 변환 정책이 명세와 테스트에 고정된다.
- [ ] `npm test` 또는 동등 게이트에서 핵심 회귀가 실패/성공으로 증명된다.
- [ ] 최소 지원 Node 버전의 깨끗한 환경에서 설치와 빌드가 성공한다.
- [ ] 스플릿 탭의 접근성 트리와 키보드 동작이 ARIA tabs 패턴과 일치한다.
- [ ] 최신 문서와 사용자 노출 버전이 모두 v2.3.0으로 동기화된다.

## 10. 수정 전 최종 판정

**REWORK REQUIRED**

현재 커밋은 빌드 가능하고 보안 기본 검사는 통과하지만, 핵심 내보내기 기능이 현재 화면과 다른 테마·다른 DOM 계약을 생성할 수 있다. 이는 릴리스 후 사용자가 잘못된 디자인 자산을 복사·다운로드하게 만드는 직접적인 기능 결함이다. IMP-F001/002, DBG-F001/002/003, IMP-F003, BUILD-F001을 수정하고 P0 재감사 체크리스트를 모두 통과하기 전에는 `PASS` 또는 `PASS WITH RISKS`로 승격할 수 없다.

최초 `/audit`에서는 애플리케이션 소스나 제품 문서를 수정하지 않았고, 이 보고서만 새로 생성했다. 이후 사용자의 수정 요청에 따라 11절의 변경과 재감사를 수행했다.

## 11. 수정 후 재감사 결과

### 11.1 현재 판정

**PASS WITH RISKS**

최초 감사의 Major 7건과 Minor 3건에 모두 조치했다. 핵심 릴리스 차단 조건이었던 최신 상태 동기화, 모달 재진입 상태, 아키타입 선택자 계약, DTCG 토큰 구조, 자동 회귀 게이트를 수정하고 재검증했으므로 릴리스 게이트를 해제한다. 다만 최소 지원 Node.js 20의 별도 깨끗한 환경 실행, 8개 아키타입 전체의 시각·계산 스타일 매트릭스, 수치 기반 성능 트레이스는 이번 재감사에서 수행하지 않아 비차단 위험으로 남긴다.

### 11.2 발견사항별 처리 결과

| ID | 수정 후 상태 | 처리 및 근거 |
| --- | --- | --- |
| IMP-F001 | **Resolved** | 8개 아키타입의 생성 CSS 선택자를 실제 `archetypeTemplates.js` 마크업에 맞췄다. 모든 생성 class 선택자가 대응 HTML에 존재하는 계약 테스트를 추가했다. |
| IMP-F002 | **Resolved** | 목표를 DTCG Format/Color Module 2025.10으로 고정하고 color, gradient, dimension, shadow, fontFamily 값을 구조화했다. 제품 메타데이터는 `$extensions`로 이동했다. 공식 보고서는 JSON Schema를 아직 제공하지 않으므로 존재하지 않는 `$schema` 속성을 만들지 않고, 예약 속성과 지원 타입의 규범적 값 구조를 자체 계약 테스트로 검증한다. |
| IMP-F003 | **Resolved** | 페이지 title·헤더 배지와 `audit_roadmap.md`, `BUILD_GUIDE.md`, `DESIGN_DECISIONS.md`, `designs.md`, `implementation_summary.md`를 v2.3.0 현재 구현에 동기화했다. |
| IMP-F004 | **Resolved — Product decision** | 기능을 실제 동작에 맞는 **통합 TXT 스냅샷**으로 확정했다. UI, 파일명, README, 명세에서 다중 파일 패키지로 오해할 수 있는 표현을 제거했다. |
| DBG-F001 | **Resolved** | 이벤트 리스너가 초기 `subDesign`을 보관하지 않도록 변경했다. 모든 탭·CSS 모드·복사·개별 다운로드·통합 스냅샷이 이벤트 시점의 최신 `appState`에서 하나의 인스펙터 산출물 집합을 생성한다. A→B 테마 전환 후 4탭과 3 CSS 모드가 B를 가리키는 자동 테스트와 Chrome 재현 검사를 통과했다. |
| DBG-F002 | **Resolved** | 상세 모달 진입마다 인스펙터 UI 상태를 CSS/전체 모드 기본값으로 초기화한다. JSON/토큰 모드에서 닫은 뒤 재개방했을 때 활성 탭, pane, 다운로드 확장자와 콘텐츠가 일치함을 Chrome에서 확인했다. |
| DBG-F003 | **Resolved** | Node 내장 테스트 러너 기반 `npm test`와 테스트+빌드 게이트 `npm run check`를 추가했다. 테스트 소스 3개에 8개 회귀 사례를 두고 생성기, 최신 상태, 재진입 기본값, 8개 ARIA 탭 계약을 보호한다. |
| BUILD-F001 | **Resolved** | `package.json#engines`와 문서를 `^20.0.0 \|\| >=22.0.0`으로 통일했다. 현재 Node.js 22.23.2에서 테스트·빌드가 통과했다. |
| PERF-F001 | **Resolved — Claim corrected** | 측정하지 않은 `60fps`·프레임 드롭 없음 보장을 제거하고 구현 사실인 `requestAnimationFrame` 기반 갱신으로 문구를 수정했다. 헤더 런타임 칩도 `CANVAS 2D: ACTIVE (rAF)`로 변경했다. |
| A11Y-F001 | **Resolved** | 8개 스플릿 탭에 `aria-selected`, roving `tabindex`, 두 panel의 `aria-controls`/`aria-labelledby` 관계를 추가했다. ArrowLeft/Right, Home, End 이동과 선택 상태를 자동 테스트 및 Chrome에서 확인했다. |

### 11.3 자동 검증 결과

| 검증 | 수정 후 결과 | 근거 |
| --- | --- | --- |
| 통합 품질 게이트 | PASS | `npm run check` — 테스트 파일 3개 통과, 실패 0; 이어서 Vite 프로덕션 빌드 성공 |
| 프로덕션 빌드 | PASS | Vite 6.4.3, 23 modules transformed, 정상 종료 |
| 생성 CSS/HTML 계약 | PASS | 8개 아키타입의 생성 class 선택자가 대응 HTML에 존재 |
| DTCG 지원 타입 계약 | PASS | 24개 테마의 예약 속성 및 color/gradient/dimension/shadow/fontFamily/number 값 구조 검사 |
| 최신 인스펙터 상태 | PASS | 테마 A→B 전환 뒤 4탭·3 CSS 모드가 모두 B의 단일 산출물 집합을 사용 |
| 스플릿 ARIA tabs | PASS | 단일 선택, roving `tabindex`, panel 연결, Arrow/Home/End 전환 검사 |
| npm 의존성 감사 | PASS | `npm audit --audit-level=low --offline`; 취약점 0건 |
| 변경 whitespace | PASS | `git diff --check` 오류 없음 |

### 11.4 실제 Chrome 재검증

| 시나리오 | 결과 | 관찰 증거 |
| --- | --- | --- |
| 테마 무재구축 교체 | PASS | `swiss-grid`에서 `corporate-minimal`로 교체 후 제목, viewport, CSS Full/Tokens/Component, JSON ID가 계속 `corporate-minimal`을 유지 |
| 모달 재개방 | PASS | JSON/토큰 상태에서 닫고 다시 열면 CSS 탭, 전체 모드, `.css` 다운로드 라벨과 표시 pane가 함께 초기화 |
| Web 아키타입 CSS | PASS | 실제 `.web-nav-header`가 존재하고 생성 CSS도 같은 선택자를 포함하며 구 선택자 `.saas-hero-section`은 제거됨 |
| DTCG JSON | PASS | 최상위 예약형 속성은 `$extensions`만 사용; ID `corporate-minimal`, 구조화된 sRGB color, px dimension, fontFamily 배열, shadow 객체 확인 |
| 스플릿 탭 | PASS | 초기 1개 탭만 선택 및 `tabindex=0`; ArrowRight 후 Mobile 탭·두 panel 연결 상태가 함께 갱신 |
| 버전·성능 문구 | PASS | title과 badge는 v2.3, Canvas 상태는 `ACTIVE (rAF)`로 표시 |
| 애플리케이션 콘솔 | PASS | `http://127.0.0.1:5173` 출처 error 0건; 관찰된 warning은 `chrome-extension://` 출처라 제외 |

### 11.5 재감사 체크 결과

- [x] 테마 A→B 교체 후 CSS Full/Tokens/Component, HTML, Markdown, JSON이 모두 B의 최신 상태에서 생성된다.
- [x] 복사·개별 다운로드·통합 TXT 스냅샷 경로가 동일한 이벤트 시점 산출물과 현재 파일명을 사용한다.
- [x] 모달 닫기→재개방 후 내부 상태, 활성 UI, pane, 다운로드 라벨이 일치한다.
- [x] 8개 아키타입의 생성 class 선택자가 실제 HTML에 존재한다.
- [x] 24개 테마 토큰이 DTCG 2025.10에서 사용하는 예약 속성과 지원 타입 값 구조를 충족한다.
- [x] gradient, transparent, shadow, fontFamily 변환 정책이 명세와 테스트에 고정되었다.
- [x] `npm test`와 `npm run check` 회귀 게이트가 통과한다.
- [x] 스플릿 탭의 ARIA 선택 상태, panel 관계, 키보드 탐색이 일치한다.
- [x] 최신 문서와 사용자 노출 버전이 v2.3.0으로 동기화되었다.
- [ ] 최소 지원 Node.js 20의 별도 깨끗한 환경에서 `npm ci && npm run check` 실행 — manifest와 Vite 요구 범위는 동기화했으나 이번 환경은 Node.js 22.23.2이다.
- [ ] 8개 아키타입 전체의 시각·계산 스타일 및 수치 성능 트레이스 — 선택자 계약과 대표 Web 런타임은 통과했으나 전체 브라우저 매트릭스는 미수행이다.

### 11.6 잔여 위험과 제한

1. `60fps`는 더 이상 제품 보장이 아니다. 성능 SLA가 필요해지면 대상 기기, 입력 시나리오, p95 프레임 예산을 먼저 확정하고 트레이스를 추가해야 한다.
2. 실제 파일 다운로드의 OS 저장 위치와 파일 관리자 연동은 최초 감사와 동일하게 제외했다. 다운로드 직전 콘텐츠·확장자·파일명 생성 경로는 최신 상태를 사용한다.
3. Node.js 20 및 Firefox/Safari 실기기 매트릭스는 별도 CI 또는 호환성 감사에서 보강할 수 있다.

위 제한은 수정된 핵심 계약의 정확성을 차단하지 않으므로 현재 판정은 `PASS WITH RISKS`이다.
