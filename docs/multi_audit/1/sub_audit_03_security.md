# Sub Audit Report

## 1. Audit Metadata
- **Audit Turn:** 1
- **Perspective:** Security Boundaries & Runtime Robustness
- **Focus:** security
- **Auditor ID:** Sub-Auditor 03
- **User Goal:** "디자인을 클릭하면 게임화면, 웹화면, 모바일화면, 쇼핑몰, 블로그 같은 여러가지 종류 (좀 더 종류를 추가)를 골라서 해당 디자인 테마가 적용된 것을 예제로 볼 수 있게 창을 띄워주는 기능을 추가할 수 있게 조사. 각 페이지는 공통으로 테마만 입혀서 돌려가며 사용할수 있게하면 좋겠음. 그리고 각 시안페이지에서도 직접 디자인을 고를수 있는 디자인 선택바를 상단에 만들어서 한번 열린 창에서는 디자인을 바꿔볼수 있게, 예제창은 실제로 어느정도는 조금씩 동작하게 해서 움직임이나 기능을 볼 수 있게 함."
- **Audit Basis:** Standard-backed
- **Standard Path:** `/home/eunho1/Projects/web/design_sample_selector/AI_AUDIT_DOC_STANDARD.md` (Pass 3: Security & Runtime Robustness)

---

## 2. Assigned Scope
- 동적 시안 템플릿 렌더링 및 `innerHTML` 주입 시 XSS(Cross-Site Scripting) 및 DOM 클로버링 위험성 감사
- 예제 상호작용(인터랙티브 폼, 블로그 댓글, 쇼핑몰 장바구니 등 사용자 입력 시뮬레이션) 시 클라이언트 사이드 데이터 취급 안전성 (Unsanitized HTML injection 방지, 텍스트 노드 처리)
- 이벤트 위임(Event Delegation) 및 전역 리스너(키보드 네비게이션, 사운드 트리거, 타이머) 누수 및 충돌 방지
- 상단 디자인 선택 바 및 모달 내 포커스 트랩(Focus Trap), WAI-ARIA 접근성(다이얼로그, 탭리스트, 라디오그룹 역할) 및 키보드 접근성(ESC 닫기, 화살표 탐색)
- Web Audio API의 자동재생 정책(Autoplay Policy) 및 AudioContext 상태 제어 안전성, 오디오 버퍼 오버플로우/리소스 누수
- `prefers-reduced-motion` 미디어 쿼리 준수 여부 및 저사양 디바이스 렌더링 충돌/프레임 드랍 완화 대책
- LocalStorage 저장/복원 시 유효성 검증 (`bookmarks`, `confirmedStyleId`, `recentlyViewed`, 신규 상태)
- 신규 요청 기능(다양한 페이지 아키타입 예제창 + 상단 테마 선택바 + 인터랙티브 시뮬레이션) 추가를 위한 보안 경계 및 런타임 안정성 설계 요건 사전 검토

---

## 3. Excluded and Uninspected Scope
- 백엔드 서버 인프라 및 DB 보안 (순수 클라이언트 정적 웹 애플리케이션으로 백엔드 부재)
- 외부 OAuth/결제 게이트웨이 인증 (Non-Goal)
- `node_modules` 및 빌드 번들러 내부 바이너리 (Zero-runtime-dependency 프로젝트)

---

## 4. Evidence Examined
- **문서 및 표준:** `spec.md`, `designs.md`, `DESIGN_DECISIONS.md`, `implementation_summary.md`, `AI_AUDIT_DOC_STANDARD.md` (Section 12: Pass 3 Security)
- **핵심 소스 코드:**
  - `index.html`: Semantic 마크업, 캔버스 및 루트 컨테이너 구조
  - `src/main.js`: 애플리케이션 초기화 및 WASM/오디오 라이프사이클
  - `src/state/appState.js`: 반응형 상태 관리, LocalStorage 입출력 (`loadJSON`, `saveJSON`)
  - `src/components/mockupTemplates.js`: 24종 시안 4대 탭 및 썸네일 HTML 생성기
  - `src/components/mockupRuntime.js`: 런타임 모션 및 인터랙션 액션 핸들러, WeakMap 클린업
  - `src/components/detailView.js`: 상세 모달, 슬라이더 튜너, 스플릿 비교 뷰, 키보드 리스너
  - `src/components/mainView.js`: 메인 갤러리 3모드, 키보드 네비게이션, 이벤트 위임
  - `src/components/selectionDock.js`: 하단 도크, 확정 시트 렌더러 및 리스너
  - `src/components/peekPreview.js`: 호버/포커스 픽 레이어 및 위치 계산기
  - `src/components/header.js`: 상단 헤더, 검색창, 뷰모드 스위처, 브랜드 버튼
  - `src/components/audioWidget.js`: 오디오 플레이어 UI 및 미니 스펙트럼 캔버스
  - `src/audio/synthAudio.js`: Web Audio API 16트랙 신디사이저, UI SFX 엔진, 스케줄러
  - `src/wasm/visualEngine.js`: WASM/Canvas 2D 파티클 물리 엔진 및 애니메이션 루프
  - `src/utils/clipboard.js`: 클립보드 복사 유틸리티 및 토스트 알림 렌더러
  - `src/utils/selection.js`: 드래프트/확정/비교/픽 헬퍼 및 `prefersReducedMotion` 유틸리티
  - `index.css` & `src/styles/interactive.css`: CSS 커스텀 프로퍼티, 키프레임, 미디어 쿼리

---

## 5. Findings

### [A03-F001] `clipboard.js`의 `showToast` 내 `innerHTML` 직접 주입에 따른 XSS 잠재 위험

- **Area:** `src/utils/clipboard.js:49`
- **Severity:** Major
- **Status:** Confirmed
- **Summary:** 클립보드 복사 후 알림을 표시하는 `showToast(message)` 함수에서 메시지 문자열을 이스케이프 없이 `toast.innerHTML = \`<span>✨</span> <span>${message}</span>\`` 형태로 직접 주입하고 있어, 특수문자나 사용자 제어 가능한 텍스트가 포함될 경우 DOM 기반 XSS 취약점이 발생할 수 있습니다.
- **Evidence:** 
  - `src/utils/clipboard.js` 48~50행:
    ```javascript
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `<span>✨</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);
    ```
  - `copyToClipboard(text, label)`에서 `showToast(\`Copied ${label} [ ${text} ] to Clipboard! 📋\`)`를 호출함.
- **Expected Basis:** `AI_AUDIT_DOC_STANDARD.md` Pass 3 (Section 12: SEC-008 Safe DOM Insertion) 및 안전한 클라이언트 렌더링 원칙 (신뢰되지 않은 데이터는 `textContent` 또는 `createElement` 노드 조립 사용).
- **Actual:** `message` 파라미터가 HTML 파서에 의해 직접 해석되는 `innerHTML` 템플릿 리터럴로 삽입됨.
- **Impact:** 현재는 내부 컬러 코드와 CSS 스니펫 복사에 주로 사용되나, 향후 시뮬레이션 입력값(예: 블로그 댓글, 폼 텍스트) 복사 시 악의적인 HTML/스크립트 태그가 실행될 수 있는 공격 표면이 존재함.
- **Suggested Action:** 안전한 DOM API를 사용하여 `textContent` 기반으로 노드를 생성 및 추가하도록 리팩터링:
  ```javascript
  export function showToast(message) {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    
    const iconSpan = document.createElement('span');
    iconSpan.textContent = '✨';
    const textSpan = document.createElement('span');
    textSpan.textContent = message;
    
    toast.appendChild(iconSpan);
    toast.appendChild(document.createTextNode(' '));
    toast.appendChild(textSpan);
    toastContainer.appendChild(toast);
    ...
  }
  ```
- **Re-audit Method:** `showToast('<img src=x onerror=alert(1)>')` 호출 시 alert가 실행되지 않고 원문 텍스트로 안전하게 렌더링되는지 검증.
- **Confidence:** 100%
- **Notes:** 유틸리티 전역에서 재사용되는 핵심 함수이므로 즉시 수정 필요.

---

### [A03-F002] 상세 및 스플릿 비교 모달의 포커스 트랩(Focus Trap) 부재 및 WAI-ARIA 접근성 결함

- **Area:** `src/components/detailView.js:108, 156, 603-622, 633, 754-801`
- **Severity:** Major
- **Status:** Confirmed
- **Summary:** 상세 보기 모달(`.detail-modal-container`) 및 스플릿 비교 모달(`.split-compare-modal-container`)에 `role="dialog"`와 `aria-modal="true"`가 선언되어 있으나, 키보드 포커스를 모달 내부에 가두는 Focus Trap이 없고, 모달 오픈 시 초기 포커스 이동 및 닫기 시 이전 포커스 복원 처리가 누락되었습니다. 또한 스플릿 비교 뷰(`SPLIT_COMPARE`)에서는 `Escape` 키 닫기 이벤트 핸들러가 등록되지 않았으며, 컴포넌트 탭 네비게이션에 `role="tab"`과 `aria-selected` 속성이 누락되었습니다.
- **Evidence:**
  - `src/components/detailView.js` 108행, 633행: `role="dialog" aria-modal="true"` 선언되어 있으나 `aria-labelledby` 또는 `aria-describedby`가 연결되지 않음.
  - `src/components/detailView.js` 156~169행: `<div class="component-tabs-nav" role="tablist">` 내 자식 `<button class="comp-tab-btn">`에 `role="tab"`과 `aria-selected`, `aria-controls` 속성이 없음.
  - `src/components/detailView.js` 603~622행: `detailKeyHandler`는 `currentView === 'DETAIL'`일 때만 동작하며, `currentView === 'SPLIT_COMPARE'` 진입 시 `Escape` 키 이벤트가 전혀 바인딩되지 않음.
  - 모달 오픈 시 `firstFocusableElement.focus()` 호출 및 닫힐 때 직전 `document.activeElement` 복원 로직이 전무하여, Tab 키 입력 시 모달 뒤편의 헤더/갤러리 카드로 포커스가 이탈함.
- **Expected Basis:** WAI-ARIA Authoring Practices Guide (APG) Modal Dialog & Tabs 패턴 준수; `AI_AUDIT_DOC_STANDARD.md` 접근성 및 키보드 네비게이션 런타임 안정성 기준.
- **Actual:** 모달이 열린 상태에서도 Tab 키로 배경 DOM과 상호작용이 가능하며, 스플릿 뷰에서는 ESC 키로 닫을 수 없음.
- **Impact:** 스크린 리더 사용자 및 키보드 전용 사용자가 모달 탐색 중 길을 잃거나 배경 요소를 오작동시킬 위험이 높음.
- **Suggested Action:**
  1. 모달 오픈 시 `Tab`/`Shift+Tab` 입력 시 첫 번째와 마지막 포커서블 요소 간을 순환하는 포커스 트랩 핸들러 추가.
  2. 모달 열림 시 첫 번째 탭/버튼에 포커스를 주고, 닫힘 시 직전 트리거 요소로 포커스 복원 (`lastFocusedElement.focus()`).
  3. `attachSplitCompareListeners`에 `Escape` 키 감지 시 `appState.setState({ currentView: 'DETAIL' })` 처리 추가.
  4. 컴포넌트 탭 버튼에 `role="tab"`, `aria-selected="true/false"`, `aria-controls="mockup-viewport"` 추가.
- **Re-audit Method:** 키보드만으로 메인 -> 상세 -> 스플릿 비교 -> ESC 닫기 과정을 수행하며 포커스 이탈 여부 및 Tab 순환 여부 테스트.
- **Confidence:** 100%
- **Notes:** 접근성(A11y) 필수 수정 항목.

---

### [A03-F003] Web Audio API 노드 연결 해제 누수(Node Leak) 및 비동기 AudioContext 상태 제어 결함

- **Area:** `src/audio/synthAudio.js:298-303, 313, 412-500, 503-600`
- **Severity:** Major
- **Status:** Confirmed
- **Summary:** Web Audio 신디사이저 엔진(`SynthAudioEngine`)에서 패드, 베이스, 아르페지오 및 각종 SFX 음원을 생성할 때 수많은 `OscillatorNode`, `GainNode`, `BiquadFilterNode`를 생성하여 `bgmGain` 또는 `sfxGain`에 연결하지만, 재생 완료(`stop()`) 시점에 `.disconnect()`를 호출하지 않아 오디오 그래프 상에 잔류 노드가 계속 누적됩니다. 또한 `ensureAudioContext()`가 비동기(`async`)임에도 `playBgm()` 및 `playSfx()`에서 `await` 없이 호출되어 브라우저 자동재생 정책(Autoplay Policy) 경고 및 상태 불일치가 유발됩니다.
- **Evidence:**
  - `src/audio/synthAudio.js` 412~443행 (`playWarmPad`), 446~471행 (`playSoftBass`), 473~499행 (`playArpNote`):
    매 스텝마다 `createOscillator()`, `createGain()`, `createBiquadFilter()`를 생성하고 `osc.stop(...)`만 호출할 뿐 `osc.onended` 핸들러에서 노드 연결 해제(`disconnect()`)를 수행하지 않음.
    (72 BPM 기준 1분 재생 시 1,000개 이상의 노드가 `bgmGain`에 연결된 상태로 남음)
  - `src/audio/synthAudio.js` 503~600행 (`playSfx`, `playChimeNote`):
    마우스 호버/클릭 시마다 노드를 연결하고 `stop()`하지만 연결 해제 없음.
  - `src/audio/synthAudio.js` 298~303행 & 506행:
    사용자가 페이지를 클릭하기 전 마우스 호버(`HOVER` SFX) 시 `this.ensureAudioContext()`가 비동기 미완료 상태에서 즉시 `this.ctx.currentTime`에 노드를 스케줄링하여 콘솔에 `The AudioContext was not allowed to start` 경고가 발생함.
- **Expected Basis:** W3C Web Audio API 권장 노드 라이프사이클 관리 표준 (단기 보이스 노드는 `onended` 이벤트에서 `disconnect()`하여 가비지 컬렉션 유도) 및 브라우저 Autoplay Policy 준수.
- **Actual:** 장시간 BGM 재생 및 빠른 갤러리 카드 마우스 호버 시 오디오 렌더링 스레드 부하 및 메모리 누적 발생.
- **Impact:** 장시간 사용 시 오디오 버퍼 지연, 음 왜곡, 브라우저 메모리 증가 및 불필요한 콘솔 에러 발생.
- **Suggested Action:**
  1. 모든 단발성 보이스 노드에 `osc.onended`를 등록하여 자동 `disconnect()` 구현:
     ```javascript
     osc.onended = () => {
       osc.disconnect();
       filter?.disconnect();
       gain.disconnect();
     };
     ```
  2. 사용자의 명시적 제스처(클릭)가 발생하기 전 호버 SFX는 AudioContext 상태가 `'running'`일 때만 재생하도록 가드 추가.
  3. `setInterval` 기반 타이머 대신 Web Audio의 정밀 룩어헤드(`nextNoteTime`) 큐 스케줄러로 전환하여 메인 스레드 랙 시 음 끊김 방지.
- **Re-audit Method:** DevTools Memory 힙 스냅샷 및 Web Audio 탭을 통해 3분간 BGM 재생 후 AudioNode 잔류 수 검증.
- **Confidence:** 100%
- **Notes:** 백그라운드 오디오 안정성을 위해 필수적임.

---

### [A03-F004] WASM/Canvas 배경 엔진의 `prefers-reduced-motion` 미준수 및 모달 오버레이 시 렌더링 루프 비효율

- **Area:** `src/wasm/visualEngine.js:84-140, 141-179`, `index.css:936, 1675, 3230`
- **Severity:** Minor
- **Status:** Confirmed
- **Summary:** `mockupRuntime.js`는 `prefersReducedMotion()`을 감지하여 시안 내 모션을 중단하지만, 백그라운드 캔버스 애니메이션 엔진(`WASMVisualEngine`)은 OS 접근성 모션 축소(`prefers-reduced-motion: reduce`) 설정을 전혀 검사하지 않고 120개 파티클의 $O(N^2)$ 거리 계산 및 60FPS 애니메이션 루프를 무조건 실행합니다. 또한 전체 화면 모달이 열려 캔버스가 완전히 가려진 상태에서도 렌더링 루프가 최대 속도로 계속 돌아갑니다.
- **Evidence:**
  - `src/wasm/visualEngine.js` 84~94행: `startLoop()`가 `prefersReducedMotion()` 체크 없이 무조건 `requestAnimationFrame`을 루프 실행.
  - `src/wasm/visualEngine.js` 148~167행: 매 프레임 모든 파티클 쌍 간 $120 \times 119 / 2 = 7,140$회의 거리 계산 수행.
  - `index.css`: `@keyframes modalPop`, `mockupFadeIn`, `toastSlideIn` 등에 대한 `@media (prefers-reduced-motion: reduce)` 오버라이드가 부재함.
- **Expected Basis:** WCAG 2.2 Guideline 2.3.3 (Animation from Interactions) 준수 및 저전력/저사양 기기 최적화 원칙.
- **Actual:** 전정기관 장애가 있거나 모션에 민감한 사용자가 모션을 끌 수 없으며, 모달이 띄워진 상태에서도 불필요한 GPU/배터리 소모 발생.
- **Impact:** 접근성 표준 미달 및 모바일/저사양 노트북 환경에서의 발열 및 프레임 드랍 원인 제공.
- **Suggested Action:**
  1. `WASMVisualEngine`에서 `prefersReducedMotion()`이 활성화된 경우 초기 1회 정적 배경만 렌더링하고 `requestAnimationFrame` 루프를 정지.
  2. `currentView !== 'MAIN'` (상세 모달이나 스플릿 모달 활성화 시) 캔버스 애니메이션 루프를 일시 중지(`pauseLoop()`), 모달이 닫히면 재개(`resumeLoop()`).
  3. `index.css`에 글로벌 `prefers-reduced-motion` 미디어 쿼리를 추가하여 모든 트랜지션 및 키프레임을 무효화:
     ```css
     @media (prefers-reduced-motion: reduce) {
       *, *::before, *::after {
         animation-duration: 0.01ms !important;
         animation-iteration-count: 1 !important;
         transition-duration: 0.01ms !important;
       }
     }
     ```
- **Re-audit Method:** DevTools Rendering 탭에서 "prefers-reduced-motion: reduce" 에뮬레이션 시 캔버스 및 CSS 애니메이션 즉시 정지 확인.
- **Confidence:** 100%

---

### [A03-F005] LocalStorage 복원 데이터에 대한 타입 및 무결성 검증 부재

- **Area:** `src/state/appState.js:6-33, 44, 48, 54`
- **Severity:** Minor
- **Status:** Confirmed
- **Summary:** LocalStorage에서 상태를 복원하는 `loadJSON` 및 `loadStoredBookmarks`에서 `JSON.parse` 예외는 처리하지만, 파싱된 데이터 내부의 배열 요소들이 유효한 문자열인지, 또는 현재 `categories.js`에 실존하는 `subId`인지 검증하지 않고 상태 트리에 주입합니다.
- **Evidence:**
  - `src/state/appState.js` 29~32행:
    ```javascript
    function loadStoredBookmarks() {
      const parsed = loadJSON('dss_bookmarks_v2', []);
      return Array.isArray(parsed) ? parsed : [];
    }
    ```
  - `confirmedStyleId` (`dss_confirmed_v21`)와 `recentlyViewed` (`dss_recent_v21`) 또한 값이 실제 카탈로그에 존재하는지 검증 없이 로드됨.
- **Expected Basis:** 방어적 상태 주입 및 로컬 스토리지 데이터 무결성 검증 원칙 (`AI_AUDIT_DOC_STANDARD.md` Pass 3 Data Boundary).
- **Actual:** 과거 버전 잔재 데이터나 외부 스크립트/사용자에 의해 변조된 값이 주입될 경우 `state.bookmarks`에 `null`, `123`, 존재하지 않는 스타일 ID가 포함되어 렌더링 시 필터링/카운팅 오류 발생 가능.
- **Impact:** 존재하지 않는 ID로 인한 북마크 카운트 불일치, 런타임 `undefined` 접근 위험.
- **Suggested Action:** 상태 로드 시 카탈로그 유효성 필터 적용:
  ```javascript
  import { findSubById } from '../data/categories.js';
  function loadStoredBookmarks() {
    const parsed = loadJSON('dss_bookmarks_v2', []);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(id => typeof id === 'string' && Boolean(findSubById(id)));
  }
  ```
- **Re-audit Method:** `localStorage.setItem('dss_bookmarks_v2', JSON.stringify([null, 999, "invalid-id", "swiss-grid"]))` 주입 후 새로고침 시 `'swiss-grid'`만 정상 로드되는지 확인.
- **Confidence:** 100%

---

### [A03-F006] 헤더 브랜드 로고 버튼의 `role="button"`에 대한 키보드 활성화 핸들러 누락

- **Area:** `src/components/header.js:24-36, 120-130`
- **Severity:** Minor
- **Status:** Confirmed
- **Summary:** 상단 헤더의 브랜드 홈 버튼이 `<div class="brand-container" id="brand-home-btn" role="button" tabindex="0">` 형태로 구현되어 있으나, `click` 이벤트만 등록되어 있고 `keydown` (Enter/Space) 이벤트 핸들러가 누락되어 키보드 전용 사용자가 활성화할 수 없습니다.
- **Evidence:**
  - `src/components/header.js` 24행: `<div class="brand-container" id="brand-home-btn" role="button" tabindex="0" title="메인 홈으로 이동">`
  - `src/components/header.js` 120~130행: `brandHome.addEventListener('click', ...)`만 존재하며, `keydown` 리스너가 없음.
- **Expected Basis:** WAI-ARIA APG Button Pattern: `role="button"`을 가진 비표준 태그(`div`)는 `Enter` 및 `Space` 키 입력 시 클릭 동작을 수행해야 하거나 네이티브 `<button>` 태그를 사용해야 함.
- **Actual:** Tab 키로 포커스는 이동하지만 Enter나 Space를 눌러도 홈으로 이동하지 않음.
- **Impact:** 키보드 접근성 결함.
- **Suggested Action:** 시맨틱 태그인 `<button class="brand-container" id="brand-home-btn">`으로 교체하거나, `keydown` 이벤트에서 `e.key === 'Enter' || e.key === ' '` 시 `click()`을 호출하도록 핸들러 추가.
- **Re-audit Method:** Tab 키로 로고 버튼에 포커스 후 Enter 및 Space 키 입력 시 메인 뷰 리셋 동작 확인.
- **Confidence:** 100%

---

### [A03-F007] 사용자 신규 요청 기능(다양한 페이지 아키타입 예제창 + 상단 테마 선택바) 추가를 위한 보안 및 런타임 아키텍처 사전 검토

- **Area:** Prospective Feature Architecture (`Dynamic Multi-Template Preview Modal & Top Design Bar`)
- **Severity:** Info
- **Status:** Confirmed
- **Summary:** 사용자가 요청한 "게임화면, 웹화면, 모바일화면, 쇼핑몰, 블로그 등 다양한 페이지 종류를 골라 공통 테마를 입혀 예제로 볼 수 있는 창 띄우기 및 상단 디자인 선택바를 통한 실시간 테마 교체와 동작 시뮬레이션" 기능 구현 시 준수해야 할 보안 경계 및 런타임 안정성 지침을 수립하였습니다.
- **Evidence:** 사용자 원문 요구사항:
  `"디자인을 클릭하면 게임화면, 웹화면, 모바일화면, 쇼핑몰, 블로그 같은 여러가지 종류 (좀 더 종류를 추가)를 골라서 해당 디자인 테마가 적용된 것을 예제로 볼 수 있게 창을 띄워주는 기능을 추가할 수 있게 조사. 각 페이지는 공통으로 테마만 입혀서 돌려가며 사용할수 있게하면 좋겠음. 그리고 각 시안페이지에서도 직접 디자인을 고를수 있는 디자인 선택바를 상단에 만들어서 한번 열린 창에서는 디자인을 바꿔볼수 있게, 예제창은 실제로 어느정도는 조금씩 동작하게 해서 움직임이나 기능을 볼 수 있게 함."`
- **Expected Basis:** `AI_AUDIT_DOC_STANDARD.md` Pass 3 보안 경계 및 신규 기능 사전 리스크 검토.
- **Key Architectural & Security Requirements:**
  1. **템플릿-테마 완전 분리(Decoupling) 및 XSS 방지**:
     - 페이지 아키타입(게임 HUD, SaaS 대시보드, 모바일 피드, 쇼핑몰 카트, 블로그 댓글 등)을 독립적인 렌더러로 모듈화하고, 테마는 CSS 변수 클래스(`theme-${subId}`) 주입 방식으로 결합.
     - 블로그 댓글 작성, 쇼핑몰 상품 담기/수량 조절, 게임 캐릭터명 입력 등 사용자 시뮬레이션 인터랙션 시, 사용자 입력 텍스트를 `innerHTML`에 직접 삽입하지 않고 **반드시 `textContent` 또는 `escapeHtml()`을 통과한 안전한 DOM 노드로만 렌더링**.
  2. **상단 디자인 선택바의 테마 전환 시 런타임 클린업**:
     - 상단 바에서 24종 디자인을 실시간 교체할 때, 기존 시안의 타이머, `requestAnimationFrame`, 사운드 트리거, 이벤트 리스너가 누수되지 않도록 `teardownMockup()`을 반드시 선행 호출 후 신규 테마를 hydration할 것.
  3. **예제 팝업창/모달의 격리 및 접근성**:
     - 레이어 모달로 띄울 경우: [A03-F002]에서 제기된 포커스 트랩, `aria-modal="true"`, `Escape` 닫기, 이전 포커스 복원 보장.
     - 별도 윈도우(`window.open`)로 띄울 경우: `noopener,noreferrer` 플래그 및 부모-자식 창 간 통신 시 `window.postMessage`의 `origin` 검증을 엄격히 적용할 것.
  4. **DOM Clobbering 방지**:
     - 예제 폼 내의 `input`, `button` 등의 `id`/`name` 속성이 전역 `window`나 `document` 객체의 속성(예: `id="submit"`, `id="location"`, `id="close"`)을 클로버링하지 않도록 고유 접두사(`mock-form-*`) 강제.
- **Suggested Action:** 상기 보안 및 메모리 격리 요구사항을 `spec.md` 및 `designs.md`의 신규 아키텍처 명세에 반영한 후 구현 착수.
- **Re-audit Method:** 신규 시안 템플릿 구현 후 시뮬레이션 입력창에 `<script>`/`<img>` 페이로드 입력 테스트 및 테마 50회 연속 전환 시 메모리 프로파일링.
- **Confidence:** 100%

---

## 6. Uncertainties and Clarifications Needed
- **새 창 vs 모달 뷰 선택:** 사용자 요구사항의 "예제로 볼 수 있게 창을 띄워주는 기능"이 인앱 전체화면 모달(Overlay Modal)인지 브라우저 팝업/새 탭(`window.open`)인지에 대한 명확화 필요. (권장: 단일 SPA 구조 유지 및 오디오/WASM 캔버스 연계를 위해 반응형 전체화면 모달 뷰로 구현).
- **시뮬레이션 데이터 영속성 여부:** 예제창 내에서 변경한 인터랙티브 상태(예: 장바구니 품목, 블로그 댓글)를 창을 닫았을 때 초기화할 것인지, 로컬 스토리지에 유지할 것인지에 대한 기획 결정 필요 (권장: 메모리 내 세션 상태로 유지 후 테마 전환 시에만 보존).

---

## 7. Perspective Decision

**[HOLD]**  
(Remediation Required for 3 Major Findings before Production Release)

- **판정 근거:**
  1. `[A03-F001]` (Major): `clipboard.js` 내 `showToast` 함수의 `innerHTML` 비이스케이프 삽입으로 인한 잠재적 DOM XSS 취약점 해소 필요.
  2. `[A03-F002]` (Major): 모달 뷰 포커스 트랩 부재, 스플릿 뷰 ESC 미지원, WAI-ARIA 탭 속성 누락 등 키보드/스크린리더 접근성 결함 수정 필요.
  3. `[A03-F003]` (Major): Web Audio API 보이스 노드 연결 미해제(누수) 및 unawaited AudioContext 자동재생 제어로 인한 런타임 결함 수정 필요.
  4. 신규 기능(다양한 페이지 시안 예제창 및 상단 디자인 바) 기획과 관련하여 XSS 방지 및 테마 스위칭 시 WeakMap 클린업 아키텍처가 `spec.md`에 선행 정의되어야 함.

- **차기 조치 권고:**
  위 3건의 Major 이슈(`A03-F001`, `A03-F002`, `A03-F003`)를 수정한 뒤 재감사를 진행하면 즉시 `PASS` 또는 `PASS WITHIN STATED SCOPE`로 승격 가능합니다. 신규 기능 구현 시에는 `[A03-F007]`의 보안 가이드라인을 엄격히 준수하여 개발을 진행하십시오.
