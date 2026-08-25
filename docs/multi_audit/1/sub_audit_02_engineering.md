# Sub Audit Report

## 1. Audit Metadata
- Audit Turn: 1
- Perspective: Engineering Integrity & Dynamic Mockup Runtime (Sub-Auditor 02)
- User Goal: 
  "디자인을 클릭하면 게임화면, 웹화면, 모바일화면, 쇼핑몰, 블로그 등 여러 가지 화면 종류(아키타입)를 골라서 해당 디자인 테마가 적용된 것을 예제로 볼 수 있게 창을 띄워주는 기능 조사. 각 페이지는 공통으로 테마만 입혀서 돌려가며 사용할 수 있게 하고, 각 시안 페이지 상단에 디자인 선택바를 구성하여 창이 열린 상태에서 실시간으로 24개 디자인을 전환하며, 예제 창은 실제로 동작하여 움직임과 기능을 체험할 수 있도록 설계."
- Audit Basis: Standard-backed (`AI_AUDIT_DOC_STANDARD.md` Pass 2: Debug / Engineering Quality)
- Standard Path: `/home/eunho1/Projects/web/design_sample_selector/AI_AUDIT_DOC_STANDARD.md`

---

## 2. Assigned Scope
본 감사는 **엔지니어링 무결성·동적 런타임 및 구현 품질(Engineering Integrity & Dynamic Mockup Runtime)** 관점에서 다음 영역을 집중 분석 및 기술 조사하였습니다.
1. **소스코드 및 런타임 아키텍처 정밀 분석**:
   - `src/components/mockupTemplates.js`: 현재 24개 하드코딩 템플릿 생성 구조 분석
   - `src/components/mockupRuntime.js`: 하이드레이션, 타이머, 애니메이션, 메모리 라이프사이클 관리 분석
   - `src/components/detailView.js`: 상세 모달 레이아웃, 샌드박스 뷰포트, 상단 네비게이션 및 파라미터 튜너 분석
   - `src/state/appState.js`: 상태 저장소(Observer 패턴) 및 동기화 메커니즘 분석
   - `src/audio/synthAudio.js`: Web Audio API 기반 절차적 사운드 합성 및 UI SFX 파이프라인 분석
   - `src/styles/interactive.css` & `index.css`: CSS Custom Properties, 테마 토큰, 모션 클래스 및 반응형 뷰포트 분석
   - `src/data/categories.js`: 8개 대분류, 24개 서브스타일 메타데이터 구조 분석
2. **공통 템플릿 기반 테마 스위칭 엔진 설계**:
   - 다형적 화면 아키타입(Game, Web Dashboard, Mobile App, Ecommerce, Blog, Media Player, Chat, Booking 등)의 시맨틱 HTML 표준화
   - CSS Custom Properties(`--theme-*`) 및 데이터 속성(`[data-theme]`) 주입을 통한 범용 테마 전환 메커니즘 설계
3. **상단 퀵 스타일 셀렉터(Top Quick Style Selector Bar) 런타임 성능 및 상태 동기화 설계**:
   - 열린 모달 상태에서 24개 전체 테마 즉시 전환을 위한 Zero-rebuild (Class/CSS Token 원자적 교체) 아키텍처
   - `appState.js` 반응형 연동 및 키보드 단축키 탐색 기법
4. **생생한 동적 인터랙션 시뮬레이션 및 오디오 FX 연동 설계**:
   - `mockupRuntime.js` 확장 아키텍처(미니게임 루프, 장바구니/결제 플로우, 블로그 스크롤 읽기 진척도/좋아요/댓글, 모바일 탭/알림 스와이프, 웹 차트/테이블 필터링)
   - `synthAudio.js` 전용 SFX 파이프라인 확장
   - WeakMap 기반 `CleanupRegistry`와 메모리 누수 방지 라이프사이클 설계
5. **Vite 빌드, CSS 성능, 모바일 뷰포트 반응형 제약 분석**

---

## 3. Excluded and Uninspected Scope
- 보안 감사 및 권한 경계 (Pass 3 Security: Sub-Auditor 03 소관)
- 순수 기획/문서 정합성 규약 (Pass 1 Compliance: Sub-Auditor 01 소관)
- 백엔드 데이터베이스 및 서버 통신 (본 프로젝트는 Pure Client-side SPA로 Non-goal)

---

## 4. Evidence Examined
- 소스 코드:
  - `src/components/mockupTemplates.js` (1,437 lines)
  - `src/components/mockupRuntime.js` (228 lines)
  - `src/components/detailView.js` (827 lines)
  - `src/state/appState.js` (182 lines)
  - `src/audio/synthAudio.js` (604 lines)
  - `src/data/categories.js` (828 lines)
  - `src/styles/interactive.css` (607 lines)
  - `index.css` (3,296 lines)
  - `package.json` (Vite 6.2.0 번들러 설정)
  - `spec.md`, `designs.md`, `implementation_summary.md`

---

## 5. Findings

### [A02-F001] 하드코딩된 24개 개별 템플릿 구조로 인한 다형적 화면(아키타입) 테마 교차 적용 불가
- Area: `src/components/mockupTemplates.js:L20-L73`, `index.css:L1740-L3200`
- Severity: Major
- Status: Confirmed
- Summary: 현재 템플릿 생성 엔진이 24개 서브스타일별로 개별 switch-case 함수(`renderSwissMockup`, `renderCorporateMockup`, `renderCyberpunkMockup` 등)를 호출하여 고유한 CSS 클래스(`swiss-unit`, `corp-unit`, `cyber-card` 등)가 박힌 HTML을 하드코딩 반환하므로, 동일한 화면 유형(게임, 웹, 모바일, 쇼핑몰, 블로그)에 여러 디자인 테마를 동적으로 번갈아 입히는 아키타입 기반 렌더링이 불가능함.
- Evidence: 
  - `src/components/mockupTemplates.js:L21-L73`: 24개 `previewType`에 따라 각각 고유 렌더러 함수로 분기.
  - `src/components/mockupTemplates.js:L81-L150`: `renderSwissMockup` 내부에서 `hero`, `widget`, `form`, `pricing`의 4개 탭만 제공하며 DOM 구조와 클래스명이 스위스 스타일에 고정됨.
- Expected Basis: 공통 화면 아키타입(Game, Web, Mobile, Ecommerce, Blog 등)의 시맨틱 HTML 템플릿을 정의하고, 테마 메타데이터(컬러, 폰트, 보더, 그림자, 발광, 모션)를 CSS Custom Properties(`--theme-*`) 및 테마 식별자(`[data-theme="swiss-grid"]`)로 주입하여 동일한 DOM 구조에 24개 테마를 자유롭게 스위칭할 수 있어야 함.
- Actual: 화면 유형과 디자인 스타일이 1:1로 강하게 결합되어 있어, 다른 스타일을 보려면 완전히 다른 HTML 구조로 다시 렌더링해야 함.
- Impact: 사용자가 요구한 "게임화면, 웹화면, 모바일화면, 쇼핑몰, 블로그 등의 화면을 고르고, 공통으로 24개 테마를 입혀서 돌려가며 보는 기능"을 현 구조에서는 구현할 수 없음.
- Suggested Action:
  1. `src/components/archetypeTemplates.js`를 신설하여 8대 공통 아키타입(Game, Web, Mobile, Ecommerce, Blog, Media, Chat, Booking)의 표준 시맨틱 HTML 템플릿을 분리 정의.
  2. `src/styles/themeTokens.css`를 구축하여 24개 스타일 프리셋을 CSS Custom Properties 토큰 맵으로 정규화.
  3. `getArchetypeHTML(archetypeId, themeId, options)` 형태로 엔진을 리팩토링.
- Re-audit Method: 임의의 아키타입(예: Ecommerce)을 선택한 상태에서 DOM 재생성 없이 24개 테마 토큰 주입만으로 모든 테마가 정상 표현되는지 확인.
- Confidence: High
- Notes: 기존 4개 컴포넌트 탭(hero, widget, form, pricing)은 8대 아키타입 체계로 자연스럽게 확장 및 통합 가능.

---

### [A02-F002] 상세 모달 상단 네비게이션이 현재 대분류(3개 서브스타일)로 격리되어 전체 24개 테마 즉시 전환 불가
- Area: `src/components/detailView.js:L123-L130`, `L468-L479`, `src/state/appState.js`
- Severity: Major
- Status: Confirmed
- Summary: 상세 뷰 모달 상단의 스타일 탭 및 이전/다음 탐색 버튼이 현재 열려 있는 대분류(Main Category)에 속한 3개 서브스타일만 순환하도록 격리되어 있어, 모달이 열린 상태에서 24개 전체 테마를 자유롭게 탐색하거나 전환할 수 없음.
- Evidence: 
  - `src/components/detailView.js:L124-L129`: `${mainCat.subCategories.map(s => ...)}`로 현재 대분류의 3개 서브스타일만 탭 버튼으로 렌더링.
  - `src/components/detailView.js:L469`: `getAdjacentSub(subDesign.id, dir, { sameCategory: true })`로 같은 카테고리 내부로만 탐색 제한.
- Expected Basis: 사용자 요구사항에 따라 상세 모달 상단에 '디자인 선택 바(Top Quick Style Selector Bar)'를 배치하여, 대분류 탭(8개) 또는 24개 스타일 썸네일 칩 캐러셀/드롭다운을 통해 모달을 닫지 않고도 실시간으로 24개 테마를 자유롭게 전환할 수 있어야 함.
- Actual: 타 카테고리의 디자인(예: 스위스 스타일에서 사이버펑크나 클레이모피즘)으로 변경하려면 반드시 모달을 닫고 메인 화면으로 돌아가야 함.
- Impact: 테마 비교 및 인터랙티브 탐색의 사용성이 심각하게 저하됨.
- Suggested Action:
  1. `renderDetailView` 상단에 `TopQuickStyleSelector` 컴포넌트 추가:
     - 8대 대분류 카테고리 탭 (Swiss, Brutalism, Depth, Retro, Editorial, Y2K, Hypertech, Soft 3D)
     - 24개 서브스타일 퀵 썸네일 칩 리스트 (수평 스크롤 및 활성 표시)
  2. 키보드 단축키 확장: `[` / `]` 또는 `Alt + Left/Right`로 전체 24개 스타일 순환 탐색 지원.
- Re-audit Method: 상세 모달 진입 후 상단 선택바를 통해 대분류 경계를 넘어 24개 스타일 간 즉시 전환이 원활히 동작하는지 검증.
- Confidence: High
- Notes: 대분류 전환 시 `selectedMainCategory`와 `selectedSubCategory`가 `appState.js`에 원자적으로 동기화되어야 함.

---

### [A02-F003] 테마/탭 전환 시 전체 DOM 파괴 및 재생성으로 인한 런타임 상태 손실 및 렌더링 오버헤드
- Area: `src/components/detailView.js:L85-L96`, `L367-L372`, `src/components/mockupRuntime.js:L40-L76`
- Severity: Major
- Status: Confirmed
- Summary: 테마 전환이나 탭 교체 시 `innerHTML`을 완전히 비우고 새로 파싱·삽입(`teardownMockup` -> `viewport.innerHTML = ...` -> `hydrateMockup`)하는 방식을 사용하여, 사용자가 예제 화면에서 조작 중이던 상태(쇼핑몰 장바구니 품목, 미니게임 점수, 입력 폼 데이터 등)가 모두 초기화되고 불필요한 브라우저 리플로우(Layout Reflow)가 발생함.
- Evidence: 
  - `src/components/detailView.js:L368-L371`:
    ```javascript
    teardownMockup(viewport);
    viewport.innerHTML = getMockupHTML(subDesign.previewType, activeComponentTab, subDesign);
    viewport.className = `mockup-viewport ${sandboxDevice}`;
    hydrateMockup(viewport, subDesign, { tab: activeComponentTab });
    ```
- Expected Basis: 공통 아키타입 화면이 유지된 상태에서 테마만 변경될 경우, 내부 DOM을 파괴하지 않고 루트 노드의 `data-theme` 속성과 CSS Custom Properties만 원자적으로 교체(Atomic Token Swap)하여 사용자 인터랙션 상태를 완벽히 유지하고 16ms(<1 Frame) 미만의 고성능 전환을 달성해야 함.
- Actual: 스타일 변경 시마다 innerHTML 치환으로 모든 상태가 리셋되고 화면 깜빡임 및 가비지 컬렉션 부하 발생.
- Impact: 동적 인터랙션(장바구니 담기, 게임 플레이) 중 테마를 바꿨을 때 진행 상태가 소실되어 사용자가 "실제 동작하는 예제"의 연속성을 체감할 수 없음.
- Suggested Action:
  1. 테마만 변경 시: `viewport.setAttribute('data-theme', newSubId)` 및 `applyThemeVariables(viewport, newSubDesign)`만 실행하고 DOM 유지.
  2. 아키타입 화면 종류가 변경될 때만 `teardownMockup` -> 템플릿 교체 -> `hydrateMockup` 수행.
- Re-audit Method: 장바구니에 아이템을 담거나 게임 스코어를 올린 상태에서 테마를 5회 이상 연속 전환해도 카트 내용과 점수가 유지되는지 검증.
- Confidence: High
- Notes: CSS 트랜지션을 활용하면 테마 간 컬러 및 형태 변화가 부드러운 모핑 애니메이션으로 연출 가능.

---

### [A02-F004] Mockup Runtime의 인터랙션 시뮬레이션 부족 (단순 토스트 및 단발성 클래스 토글에 한정)
- Area: `src/components/mockupRuntime.js:L11-L28`, `L126-L185`
- Severity: Major
- Status: Confirmed
- Summary: 현재 `mockupRuntime.js`는 `showMockToast` 및 `pulseClass` 위주의 1회성 CSS 애니메이션 트리거에 머물러 있어, 사용자가 요구한 "게임, 쇼핑몰, 블로그, 모바일, 웹 화면이 실제로 어느 정도는 조금씩 동작하여 움직임이나 기능을 볼 수 있는" 수준의 인터랙티브 시뮬레이션이 결여되어 있음.
- Evidence: 
  - `src/components/mockupRuntime.js:L127`: `const flavor = action === 'toast' ? (FLAVOR_BY_TYPE[previewType] || 'toast') : action;`
  - `src/components/mockupRuntime.js:L145-L154`: `coin` 액션 1개만 카운트 증가 처리되며, 나머지 15개 액션은 단순 CSS 펄스 클래스 추가 후 400ms 뒤 제거되는 정적 효과에 불과함.
- Expected Basis: 각 아키타입별 특화된 실시간 인터랙션 루프 구현:
  - **Game**: Canvas/HUD 기반 미니 타겟 클릭/회피 게임, 콤보 스코어 카운터, 체력바 증감, 레벨업 파티클.
  - **Ecommerce**: 상품 옵션(사이즈/색상) 선택, 수량 조절 Stepper, "장바구니 담기" 시 배지 카운트 애니메이션 및 슬라이드아웃 미니카트, 간이 "주문/결제" 모달 시뮬레이션.
  - **Blog**: 스크롤 연동 상단 읽기 진척도(Reading Progress Bar), 박수/좋아요 플로팅 파티클 카운터, 댓글 작성 및 실시간 목록 추가 시뮬레이션, 다크/라이트 읽기 모드 토글.
  - **Mobile**: 하단 네비게이션 탭 전환, 알림 카드 스와이프 제거, 토글 스위치 햅틱 시뮬레이션.
  - **Web Dashboard**: 차트 기간 필터(1D/1W/1M) 클릭 시 데이터 애니메이션, 테이블 실시간 정렬/필터링.
- Actual: 단순 클릭 시 "Action complete" 토스트가 뜨는 정적 프리뷰 수준.
- Impact: 디자인 테마가 실제 프로덕션 UI 인터랙션에서 어떻게 반응하고 느껴지는지 검증 불가.
- Suggested Action:
  1. `mockupRuntime.js`를 아키타입별 시뮬레이션 컨트롤러로 모듈화 (`runtime/gameSim.js`, `runtime/shopSim.js`, `runtime/blogSim.js`, `runtime/mobileSim.js`, `runtime/webSim.js`).
  2. 이벤트 위임(Event Delegation) 기반의 액션 라우팅 체계 구축 (`data-action="cart-add"`, `data-action="game-tap"`, `data-action="blog-like"`, `data-action="tab-switch"`).
- Re-audit Method: 5개 아키타입 각각에서 장바구니 추가, 게임 타깃 클릭, 댓글 입력, 탭 전환 등의 사용자 입력 시 실시간 DOM 업데이트 및 시각적 반응 검증.
- Confidence: High
- Notes: 상태는 런타임 인스턴스별 독립 스토어로 격리하여 다른 인스턴스에 영향을 주지 않도록 설계.

---

### [A02-F005] 신규 인터랙션 전용 절차적 오디오 FX 부재 (단일 CLICK 음 반복 한계)
- Area: `src/audio/synthAudio.js:L503-L578`
- Severity: Minor
- Status: Confirmed
- Summary: Web Audio API 기반 오디오 엔진 `synthAudio.js`에 정의된 사운드 효과가 8개(`HOVER`, `CLICK`, `REVEAL`, `COPY`, `BOOKMARK`, `COMPARE`, `CONFIRM`, `CLOSE`)로 제한되어 있어, 게임 코인/타격음, 쇼핑몰 장바구니 추가음, 결제 완료 차임, 블로그 좋아요 팝업, 테마 스위칭 등 다채로운 인터랙션 사운드 연동이 지원되지 않음.
- Evidence: 
  - `src/audio/synthAudio.js:L514-L577`: 8개 SFX 분기만 존재하며, `mockupRuntime.js:L128`에서 모든 인터랙션에 일률적으로 `synthAudio.playSfx('CLICK')`만 호출.
- Expected Basis: Web Audio API 오실레이터를 조합하여 다음의 전용 절차적 SFX를 추가 구현:
  - `THEME_SWAP`: 주파수 스윕 아르페지오 (테마 전환 시 매끄러운 상승음)
  - `COIN` / `SCORE`: 경쾌한 2화음 핑 (게임 코인 획득)
  - `CART_ADD`: 부드러운 메이저 3화음 플럭 (장바구니 담기)
  - `SUCCESS`: 풍성한 아르페지오 피니시 차임 (결제 및 폼 제출 완료)
  - `LIKE`: 피치 벤드 팝업 사운드 (좋아요/박수)
  - `SWIPE` / `TAB`: 화이트노이즈 믹스 스우시 (모바일 탭 전환)
- Actual: 모든 조작에서 동일한 440Hz -> 220Hz 트라이앵글 클릭음만 재생됨.
- Impact: 오디오-비주얼 일체감 및 몰입형 디자인 체험 품질 제한.
- Suggested Action: `synthAudio.js`에 6종 이상의 절차적 SFX 메서드를 추가하고 `mockupRuntime.js` 인터랙션 핸들러와 매핑.
- Re-audit Method: 각 아키타입별 액션 실행 시 Web Audio API에서 해당 SFX가 지연 없이 합성 재생되는지 확인.
- Confidence: High
- Notes: 0 외부 음원 파일 의존성 원칙 유지 (순수 Web Audio API 오실레이터/노이즈 합성).

---

### [A02-F006] 타이머 및 비동기 콜백의 생명주기 관리 미흡으로 인한 잠재적 메모리 누수 위험
- Area: `src/components/mockupRuntime.js:L30-L38`, `L114-L124`
- Severity: Minor
- Status: Confirmed
- Summary: `mockupRuntime.js`에서 생성되는 일부 타이머(`toast._hide`, `el._pulse`)가 `cleanups` 배열에 등록되지 않고 개별 DOM 엘리먼트 프로퍼티에 직접 할당되어 있어, 모달이 빠르게 닫히거나 템플릿이 교체될 때 `teardownMockup`에서 취소되지 않고 비동기 콜백이 잔존할 위험이 있음.
- Evidence: 
  - `src/components/mockupRuntime.js:L114-L115`: `toast._hide = setTimeout(() => toast.classList.remove('show'), 1600);` (cleanups 미등록)
  - `src/components/mockupRuntime.js:L123`: `el._pulse = setTimeout(() => el.classList.remove(className), ms);` (cleanups 미등록)
- Expected Basis: 모든 `setTimeout`, `setInterval`, `requestAnimationFrame`, `ResizeObserver`, `IntersectionObserver`, 이벤트 리스너를 일원화된 `CleanupRegistry`에 등록하고 `teardownMockup` 시 일괄 취소/해제하여 완벽한 무누수(Zero-leak) 보장.
- Actual: 애니메이션 프레임(`_raf`)은 cleanups에 포함되나 타임아웃 핸들은 누락되어 고빈도 스위칭 시 고스트 타이머 발생 가능.
- Impact: 장시간 사용 시 미미한 메모리 누수 및 이미 언마운트된 엘리먼트에 대한 스타일 조작 에러 가능성.
- Suggested Action:
  ```javascript
  // CleanupRegistry 패턴 도입
  const registry = createCleanupRegistry();
  registry.setTimeout(() => { ... }, 1600);
  registry.raf(() => { ... });
  registry.on(el, 'click', handler);
  // teardown 시
  registry.dispose();
  ```
- Re-audit Method: 100회 연속 모달 열기/닫기 및 테마 스위칭 스트레스 테스트 후 Chrome DevTools Memory Heap Snapshot 비교.
- Confidence: High
- Notes: `WeakMap`을 사용하여 루트 노드가 GC될 때 레지스트리도 안전하게 해제되도록 구성.

---

### [A02-F007] 뷰포트 스위처 반응형 스케일링 제약 및 CSS 격리 부재
- Area: `index.css:L1146-L1160`, `L1670-L1739`, `src/components/detailView.js:L179-L189`
- Severity: Minor
- Status: Confirmed
- Summary: 모달 내 샌드박스 뷰포트의 데스크톱/모바일 모드 전환 시 고정 픽셀 폭(Desktop 100%, Mobile 375px)과 하드코딩된 패딩이 적용되어 있어, 작은 모바일 실기기(화면 폭 < 600px)에서 상세 창을 열었을 때 뷰포트 내부 레이아웃이 찌그러지거나 가로 스크롤이 발생할 수 있으며, 아키타입 컴포넌트 CSS가 글로벌 CSS와 네임스페이스 충돌을 일으킬 가능성이 있음.
- Evidence: 
  - `index.css:L1146-L1155`: `.mockup-viewport.mobile`에 `max-width: 375px; margin: 0 auto;`가 고정 적용됨.
  - `index.css:L1700-L1705`: `.mockup-unit [class*="-card"]` 등 광범위한 서브스트링 셀렉터 사용으로 글로벌 스타일 간섭 위험.
- Expected Basis:
  1. CSS Container Queries (`@container (max-width: ...)` ) 또는 CSS `transform: scale()` 뷰포트 적응형 스케일러 적용.
  2. CSS Cascade Layers (`@layer mockup-base, mockup-themes, mockup-archetypes`) 또는 엄격한 BEM/데이터 속성 네임스페이스(`[data-archetype]`)를 통한 스타일 격리.
- Actual: 화면 크기에 따른 뷰포트 자동 비율 축소 미지원 및 광범위 속성 셀렉터 사용.
- Impact: 모바일 기기 접속 시 모달 내부 예제 화면의 시각적 완성도 저하.
- Suggested Action: 뷰포트 컨테이너에 CSS Container Query 설정 및 모바일 뷰포트 줌 레벨 스케일러 추가.
- Re-audit Method: 화면 폭 360px ~ 2560px 구간에서 8대 아키타입의 데스크톱/모바일 뷰포트 렌더링 무결성 검증.
- Confidence: High
- Notes: 순수 CSS3 표준 기반으로 빌드 도구 의존 없이 구현 가능.

---

## 6. Engineering Architecture Blueprint & Implementation Proposal

Sub-Auditor 02는 위 감사를 바탕으로 사용자의 요구사항을 100% 만족하는 구체적이고 결함 없는 기술 구현 아키텍처를 다음과 같이 제시합니다.

### 6.1 다형적 화면 아키타입 8종 정의 (Archetype Taxonomy)
```mermaid
graph TD
    Root[Mockup Sandbox Viewport] --> Selector[Top Quick Style Selector]
    Root --> ArchetypeNav[Archetype Switcher Tabs]
    
    ArchetypeNav --> A1["🎮 01. Game Screen<br/>(Mini-Game Loop, Score, HUD, Canvas)"]
    ArchetypeNav --> A2["📊 02. Web SaaS Dashboard<br/>(Metrics, Chart Filter, Data Table)"]
    ArchetypeNav --> A3["📱 03. Mobile App Shell<br/>(Notch, Bottom Nav, Swipeable Feed)"]
    ArchetypeNav --> A4["🛍️ 04. Ecommerce Store<br/>(Product Card, Cart Drawer, Checkout)"]
    ArchetypeNav --> A5["📰 05. Editorial Blog<br/>(Reading Progress, Claps, Comment Sim)"]
    ArchetypeNav --> A6["🎵 06. Media Player<br/>(Scrubber, Waveform, Transport Controls)"]
    ArchetypeNav --> A7["💬 07. Chat Messenger<br/>(Bubble Stream, Typing, Message Dispatch)"]
    ArchetypeNav --> A8["🎟️ 08. Booking Flow<br/>(Date/Seat Picker, Reservation Summary)"]

    Selector --> T1["24 Design Themes (Swiss, Cyberpunk, Glass, Clay, Neo-Brutal...)"]
    T1 -.->|CSS Custom Properties & [data-theme] Inject| Root
```

### 6.2 테마 토큰 주입 메커니즘 (Zero-Rebuild CSS Token Engine)
각 아키타입의 DOM 구조는 **단일 표준 시맨틱 HTML**로 고정되며, 24개 디자인 테마는 아래 CSS 변수 체계를 통해 실시간 오버레이됩니다:

```css
/* CSS Token Contract 예시 */
[data-theme="swiss-grid"] {
  --theme-bg-canvas: #F4F4F0;
  --theme-bg-surface: #FFFFFF;
  --theme-text-primary: #111111;
  --theme-text-accent: #FF3300;
  --theme-border: 1px solid #111111;
  --theme-radius: 0px;
  --theme-shadow: none;
  --theme-font: 'Inter', sans-serif;
  --theme-accent-btn: #FF3300;
  --theme-btn-text: #FFFFFF;
  --theme-card-style: flat;
}

[data-theme="cyberpunk"] {
  --theme-bg-canvas: #0A0A12;
  --theme-bg-surface: #141424;
  --theme-text-primary: #00F0FF;
  --theme-text-accent: #FFE600;
  --theme-border: 1px solid #00F0FF;
  --theme-radius: 4px;
  --theme-shadow: 0 0 15px rgba(0, 240, 255, 0.35);
  --theme-font: 'Space Grotesk', sans-serif;
  --theme-accent-btn: #FFE600;
  --theme-btn-text: #000000;
  --theme-card-style: neon-glow;
}

[data-theme="claymorphism"] {
  --theme-bg-canvas: #EBF1F6;
  --theme-bg-surface: #F0F5FA;
  --theme-text-primary: #2D3748;
  --theme-text-accent: #FF6B4A;
  --theme-border: none;
  --theme-radius: 24px;
  --theme-shadow: 8px 8px 16px #D1D9E6, -8px -8px 16px #FFFFFF, inset 2px 2px 4px rgba(255,255,255,0.8);
  --theme-font: 'Inter', sans-serif;
  --theme-accent-btn: #FF6B4A;
  --theme-btn-text: #FFFFFF;
  --theme-card-style: puffy-3d;
}
```

### 6.3 상단 디자인 선택 바(Top Quick Style Selector) 아키텍처
상세 모달 최상단에 2단계 반응형 네비게이터를 배치합니다:
1. **1단계 (Main Category Tabs - 8개)**: `[📐 스위스] [🚧 브루탈리즘] [🔮 입체·깊이] [🕹️ 레트로] [📰 에디토리얼] [💿 Y2K] [⚡ 하이퍼테크] [🧸 소프트3D]`
2. **2단계 (Sub-Style Thumbnails Strip - 24개)**: 현재 선택된 카테고리의 3개 서브스타일 + 전체 24개 전체보기 팝오버 / 퀵 칩 리스트.
3. **원자적 테마 스위칭 루틴**:
```javascript
export function switchMockupTheme(viewportEl, newSubDesign) {
  if (!viewportEl) return;
  // 1. Root data-theme 및 class 업데이트 (DOM 유지!)
  viewportEl.setAttribute('data-theme', newSubDesign.id);
  viewportEl.style.setProperty('--modal-accent', newSubDesign.accentColor || '#00F0FF');
  
  // 2. 파라미터 튜너 CSS 변수 갱신
  applyLiveTweaks(viewportEl, newSubDesign.defaultTweaks);
  
  // 3. 테마 전환 사운드 및 모션 트리거
  synthAudio.playSfx('THEME_SWAP');
  pulseThemeWave(viewportEl);
  
  // 4. 전역 상태 동기화 (히스토리 보존)
  appState.setState({
    selectedMainCategory: newSubDesign.categoryId,
    selectedSubCategory: newSubDesign.id,
    liveTweaks: newSubDesign.defaultTweaks
  });
}
```

### 6.4 생동감 넘치는 아키타입별 인터랙션 런타임 설계
- **Game Screen**:
  - `startMiniGame(container)`: HTML5 Canvas 또는 CSS 스프라이트 기반 미니 타겟 생성기.
  - 클릭/터치 시 콤보 배수(`1x -> 2x -> 4x -> MAX`), 스코어 증가, 플로팅 텍스트(`+100 PTS!`), Web Audio `COIN` 사운드 재생.
- **Ecommerce Screen**:
  - `initEcommerceRuntime(container)`:
    - 로컬 장바구니 객체 관리 (`{ items: [...], total: 0 }`).
    - "장바구니 담기" 버튼 클릭 시 버튼 텍스트가 `✓ 담김!`으로 변경되고 장바구니 배지 숫자 증가 + 사운드 FX.
    - 장바구니 아이콘 클릭 시 슬라이드아웃 서랍(Drawer) 오픈 및 "결제하기" 시뮬레이션 모달 오픈.
- **Blog Screen**:
  - `initBlogRuntime(container)`:
    - 뷰포트 스크롤 이벤트 감지하여 상단 `reading-progress-bar`의 `width: 0% -> 100%` 실시간 계산.
    - 박수(Clap) 버튼 연타 시 하트/스파크 파티클 버스트 애니메이션 및 카운터 증가.
    - 간이 댓글 작성 폼: 텍스트 입력 후 "등록" 누르면 즉시 댓글 리스트 상단에 아바타와 함께 추가.
- **Mobile Screen**:
  - `initMobileRuntime(container)`:
    - 하단 네비게이션 탭(홈/피드/알림/프로필) 클릭 시 화면 뷰가 부드러운 슬라이드로 전환.
    - 알림 카드 스와이프 또는 "✕" 클릭 시 리스트에서 제거되는 애니메이션.
- **Web Dashboard Screen**:
  - `initWebDashboardRuntime(container)`:
    - 탭 필터(오늘, 이번주, 이번달) 클릭 시 바 차트 높이와 KPI 통계 수치가 카운트업 애니메이션과 함께 변경.

---

## 7. Uncertainties and Clarifications Needed
1. **아키타입 기본 수량 및 우선순위**:
   - 사용자가 명시한 5종(게임, 웹, 모바일, 쇼핑몰, 블로그) 외에 추가 3종(미디어 플레이어, 채팅 메신저, 티켓 예매)을 1차 릴리스에 포함할 것인지 여부 (기본 8종 권장).
2. **사이드-바이-사이드 스플릿 비교 화면과의 통합 방식**:
   - 스플릿 비교(Side-by-Side Dual Comparison) 모드에서도 8대 아키타입 동기화 탭을 제공할 것인지 여부 (구조상 100% 호환 가능).

---

## 8. Perspective Decision
- **결정 (Perspective Decision): HOLD (보류 및 구조적 개선 권고)**
- **판정 근거**:
  1. 현재 소스코드는 24개 스타일별로 개별적인 고정 템플릿(`renderSwissMockup` 등)으로 하드코딩되어 있어, 사용자가 요구한 "동일한 화면(게임, 웹, 모바일, 쇼핑몰, 블로그)에 공통으로 테마만 입혀서 실시간 전환하는 기능"을 지원하지 못함 (`[A02-F001]`).
  2. 상세 모달의 상단 탐색 바가 현재 대분류 3개 서브스타일에 갇혀 있어 24개 전체 테마를 모달 내부에서 즉시 전환할 수 없음 (`[A02-F002]`).
  3. 테마 및 탭 전환 시 innerHTML 전체 파괴 방식으로 인해 사용자 인터랙션 상태가 보존되지 않음 (`[A02-F003]`).
  4. 런타임 인터랙션 및 오디오 FX가 단순 토스트 및 단일 클릭음에 국한되어 실감 나는 동작 체험이 미흡함 (`[A02-F004]`, `[A02-F005]`).
  5. 다만, 제안된 **8대 공통 아키타입 템플릿 + CSS Token 주입 엔진 + Top Quick Style Selector + 모듈형 런타임 시뮬레이터** 설계를 적용하면 기존 코드를 파괴하지 않고 완벽하고 우아하게 구현 가능함.

---
**Report Generated By**: Sub-Auditor 02 (Engineering Integrity & Dynamic Mockup Runtime)  
**Date**: 2026-08-25
