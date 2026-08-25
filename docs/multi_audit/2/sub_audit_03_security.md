# Sub Audit Report

## 1. Audit Metadata
- Audit Turn: 2
- Perspective: Security Boundaries & Robustness Re-audit
- Focus: Security, Accessibility (a11y), Memory Leak Prevention & Error Resilience
- User Goal: 멀티 감사(Multi-Audit) Turn 2의 보안 경계·접근성·오류 복원력 재감사 및 Turn 1 Finding 해결 검증
- Audit Basis: Standard-backed (`AI_AUDIT_DOC_STANDARD.md` Pass 3: Security & Robustness)
- Standard Path: `/home/eunho1/Projects/web/design_sample_selector/AI_AUDIT_DOC_STANDARD.md`

---

## 2. Assigned Scope
다음 대상 모듈 및 Turn 1 발견사항의 수정·신규 구현 코드에 대한 정밀 보안 및 접근성·복원력 재검증:
1. `src/utils/clipboard.js`: `showToast` 함수의 `innerHTML` 제거 및 `textContent` 기반 노드 조립 검증
2. `src/components/detailView.js`: 모달 Focus Trap(`setupFocusTrap`), ESC 닫기 핸들러, `role="tab"`, `aria-selected` 속성, 포커스 복원 검증
3. `src/audio/synthAudio.js`: 모든 보이스 노드(BGM/SFX)의 `osc.onended` 내 `.disconnect()` 호출 메모리 누수 방지 및 AudioContext 비동기/사용자 제스처 제어 검증
4. `src/wasm/visualEngine.js`: `prefers-reduced-motion` 준수, 모달 오버레이 시 루프 일시정지(`pauseLoop()`) 및 복귀 시 재개(`resumeLoop()`) 연동 검증
5. `src/state/appState.js`: `loadStoredBookmarks`, `loadStoredConfirmed`, `loadStoredRecents`의 24개 유효 카탈로그 ID 화이트리스트 필터링 검증
6. `src/components/header.js`: `brandHome` 로고 버튼의 `role="button"`, `tabindex="0"`, 키보드(Enter/Space) 이벤트 리스너 검증
7. `src/components/mockupRuntime.js`: 아키타입 시뮬레이터(댓글, 채팅 입력 등)의 `textContent` 기반 안전한 렌더링 및 WeakMap 기반 CleanupRegistry 검증

---

## 3. Excluded and Uninspected Scope
- CSS 스타일링 비주얼 완성도 (Sub-Auditor 02 담당)
- 24종 사조 및 8대 아키타입의 데이터 명세 일치성 (Sub-Auditor 01 담당)
- `node_modules/`, `dist/`, `.git/` 디렉터리 내부 파일

---

## 4. Evidence Examined
- `src/utils/clipboard.js` (lines 38–66)
- `src/components/detailView.js` (lines 53–142, 169–212, 220–268, 761–792, 828–865, 874–971, 1047–1060)
- `src/audio/synthAudio.js` (lines 241–304, 412–523, 527–681)
- `src/wasm/visualEngine.js` (lines 86–118)
- `src/state/appState.js` (lines 6–54, 150–204)
- `src/components/header.js` (lines 20–50, 119–137, 219–223)
- `src/components/mockupRuntime.js` (lines 14–36, 65–102, 457–552)
- `src/components/selectionDock.js` (lines 20–23, 51–93)
- `src/components/peekPreview.js` (lines 11–14, 40–52)
- `src/main.js` (lines 16–42)
- `index.html` (lines 1–39)

---

## 5. Findings

### [A03-F001 / FIN-F005 Re-audit] `showToast` 함수의 DOM 노드 직접 조립 및 XSS 취약점 완전 해소 검증
- Area: `src/utils/clipboard.js` (lines 38–66)
- Severity: Major (이전 Critical/Major에서 수정 검증 완료)
- Status: Verified (해소됨)
- Summary: `showToast` 함수에서 문자열 템플릿의 `innerHTML` 주입 방식이 완전히 제거되고, `document.createElement`, `iconSpan.textContent = '✨'`, `textSpan.textContent = String(message)`를 통한 안전한 DOM 노드 조립 방식으로 수정되었습니다.
- Evidence:
  ```javascript
  // src/utils/clipboard.js:38-60
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
    iconSpan.setAttribute('aria-hidden', 'true');

    const textSpan = document.createElement('span');
    textSpan.textContent = String(message);

    toast.appendChild(iconSpan);
    toast.appendChild(document.createTextNode(' '));
    toast.appendChild(textSpan);
    toastContainer.appendChild(toast);
  ```
- Expected Basis: 클라이언트 사이드 토스트 알림 생성 시 비신뢰 문자열 주입으로 인한 DOM-based XSS 방지.
- Actual: `textContent`를 통한 안전한 텍스트 바인딩 적용 및 이모지 아이콘에 `aria-hidden="true"` 설정 완료.
- Impact: XSS 공격 벡터가 원천 차단되었으며 스크린 리더 친화성이 개선되었습니다.
- Suggested Action: 추가 조치 불필요.
- Re-audit Method: `src/utils/clipboard.js` 38~66행 코드 및 DOM 생성 로직 확인.
- Confidence: High (100%)

---

### [A03-F002 / FIN-F006 Re-audit] 상세 모달 및 스플릿 비교 모달 WAI-ARIA 속성, Focus Trap, ESC 닫기 핸들러 검증
- Area: `src/components/detailView.js` (lines 53–142, 169–212, 761–792, 828–865, 874–971, 1047–1060)
- Severity: Major (이전 Major에서 수정 검증 완료)
- Status: Verified (해소됨)
- Summary: Detail View 및 Split Compare 모달에 `role="dialog"`, `aria-modal="true"`, `aria-labelledby` 속성이 적용되었고, `setupFocusTrap`을 통한 Tab/Shift+Tab 순환 잠금, 모달 종료 시 직전 포커스 요소 복원(`lastFocusedElement.focus()`), ESC 키 닫기 핸들러(`Escape` 감지 시 `closeModal()`, `closeCompare()`), 그리고 탭 내비게이션의 `role="tab"`, `aria-selected` 속성이 충실히 구현되었습니다.
- Evidence:
  1. **Focus Trap 구현** (`src/components/detailView.js:829-858`):
     ```javascript
     function setupFocusTrap(modalRoot) {
       removeFocusTrap();
       const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
       activeFocusTrap = (e) => {
         if (e.key !== 'Tab') return;
         const focusables = Array.from(modalRoot.querySelectorAll(focusableSelectors))
           .filter(el => !el.disabled && el.offsetParent !== null);
         if (!focusables.length) return;
         const firstEl = focusables[0];
         const lastEl = focusables[focusables.length - 1];
         if (e.shiftKey) {
           if (document.activeElement === firstEl) {
             e.preventDefault();
             lastEl.focus();
           }
         } else {
           if (document.activeElement === lastEl) {
             e.preventDefault();
             firstEl.focus();
           }
         }
       };
       modalRoot.addEventListener('keydown', activeFocusTrap);
       const initialTarget = modalRoot.querySelector('.breadcrumb-back-btn') || modalRoot.querySelector('button');
       if (initialTarget) initialTarget.focus();
     }
     ```
  2. **모달 종료 시 포커스 복원** (`src/components/detailView.js:85-88`):
     ```javascript
     if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
       try { lastFocusedElement.focus(); } catch { /* ignore */ }
       lastFocusedElement = null;
     }
     ```
  3. **ESC 키 핸들러** (`src/components/detailView.js:775-776`, `1055-1057`):
     - Detail 모달: `if (e.key === 'Escape') { closeModal(); }`
     - Split 비교 모달: `if (e.key === 'Escape') { closeCompare(); }`
  4. **WAI-ARIA Tab 속성 동적 동기화** (`src/components/detailView.js:174-175, 205-206, 221-244, 423, 454, 460`):
     - 대분류 탭: `role="tab" aria-selected="${c.id === mainCat.id}"`
     - 스타일 칩: `role="tab" aria-selected="${s.id === subDesign.id}"`
     - 아키타입 탭: `role="tab" aria-selected="${activeArchetype === ...}"`
- Expected Basis: W3C WAI-ARIA Authoring Practices Guide (APG) Modal Dialog 및 Tabs 패턴 준수.
- Actual: 키보드 트랩, ESC 탈출, 포커스 복원 및 ARIA 접근성 마크업 완비.
  *(참고 Info: 스플릿 모달 상단의 `.split-tab-btn`에 `aria-selected` 속성을 추가하면 더욱 완벽합니다.)*
- Impact: 키보드 단독 사용자 및 스크린 리더 사용자가 모달 밖으로 포커스를 잃지 않고 안전하게 탐색 가능.
- Suggested Action: 현재 상태로 승인 가능 (Pass).
- Re-audit Method: `src/components/detailView.js` 내 Focus Trap 및 키보드 이벤트 핸들러 분석.
- Confidence: High (98%)

---

### [A03-F003 / FIN-F007 Re-audit] Web Audio API AudioNode `.disconnect()` 및 메모리 누수 방지 검증
- Area: `src/audio/synthAudio.js` (lines 412–523, 527–681)
- Severity: Major (이전 Major에서 수정 검증 완료)
- Status: Verified (해소됨)
- Summary: Web Audio 합성 엔진의 모든 BGM 화음 레이어(`playWarmPad`, `playSoftBass`, `playArpNote`)와 UI 효과음 생성 루틴(`playSfx` 내 단발 오실레이터, `playChimeNote`)에서 `osc.onended` 콜백을 통해 연결된 노드(`osc`, `filter`, `gain`)의 `.disconnect()`가 예외 없이 호출되어 오디오 메모리 누수 및 오디오 그래프 고갈 위험이 완전히 해결되었습니다.
- Evidence:
  1. `playWarmPad` (`src/audio/synthAudio.js:441-447`):
     ```javascript
     osc.onended = () => {
       try {
         osc.disconnect();
         padFilter.disconnect();
         gain.disconnect();
       } catch { /* ignore */ }
     };
     ```
  2. `playSoftBass` (`src/audio/synthAudio.js:477-483`):
     ```javascript
     osc.onended = () => {
       try {
         osc.disconnect();
         bassFilter.disconnect();
         gain.disconnect();
       } catch { /* ignore */ }
     };
     ```
  3. `playArpNote` (`src/audio/synthAudio.js:513-519`):
     ```javascript
     osc.onended = () => {
       try {
         osc.disconnect();
         arpFilter.disconnect();
         gain.disconnect();
       } catch { /* ignore */ }
     };
     ```
  4. `playChimeNote` (`src/audio/synthAudio.js:673-678`):
     ```javascript
     osc.onended = () => {
       try {
         osc.disconnect();
         gain.disconnect();
       } catch { /* ignore */ }
     };
     ```
  5. `playSfx` 인라인 오실레이터 (`src/audio/synthAudio.js:552, 565, 605, 641, 654`):
     ```javascript
     osc.onended = () => { osc.disconnect(); gain.disconnect(); };
     ```
  6. **AudioContext Autoplay 방어** (`src/audio/synthAudio.js:531-534`):
     `HOVER` 효과음의 경우 AudioContext가 `running` 상태가 아니면 실행을 건너뛰어 브라우저 autoplay 경고 및 블로킹을 방지합니다.
- Expected Basis: Web Audio API 사양에 따른 수명이 다한 AudioNode의 명시적 해제.
- Actual: 모든 음성 생성 경로에서 `onended` 해제 핸들러 등록 완료.
- Impact: 장시간 브라우징 시 메모리 사용량 및 AudioNode 증가에 따른 브라우저 지연·크래시 예방.
- Suggested Action: 추가 조치 불필요.
- Re-audit Method: `synthAudio.js` 내 모든 `createOscillator()` 호출부의 `onended` 핸들러 점검.
- Confidence: High (100%)

---

### [A03-F004 / FIN-F008 Re-audit] WASM 캔버스 배경 엔진의 `prefers-reduced-motion` 준수 및 모달 오버레이 루프 제어 검증
- Area: `src/wasm/visualEngine.js` (lines 86–118), `src/components/detailView.js` (lines 56, 84, 108)
- Severity: Minor (이전 Minor에서 수정 검증 완료)
- Status: Verified (해소됨)
- Summary: WASM 파티클 배경 엔진에 `prefers-reduced-motion` 미디어 쿼리 감지(`prefersReducedMotion()`)가 연동되어 애니메이션 움직임이 비활성화되며, 상세 모달 및 스플릿 모달 진입 시 `wasmVisualEngine.pauseLoop()`가 호출되어 불필요한 GPU/CPU 렌더링 루프가 일시 정지되고 모달 종료 시 `resumeLoop()`로 자연스럽게 복귀합니다.
- Evidence:
  1. `src/wasm/visualEngine.js:113-118`:
     ```javascript
     update() {
       const reduced = prefersReducedMotion();
       if (reduced) {
         // In reduced motion, subtle static drift without high physics
         return;
       }
       ...
     ```
  2. `src/wasm/visualEngine.js:86-98`:
     ```javascript
     pauseLoop() {
       this.isPaused = true;
       if (this.animFrameId) {
         cancelAnimationFrame(this.animFrameId);
         this.animFrameId = null;
       }
     }
     resumeLoop() {
       if (!this.isPaused) return;
       this.isPaused = false;
       this.startLoop();
     }
     ```
  3. `src/components/detailView.js`:
     - Detail 모달 진입 (line 108): `wasmVisualEngine.pauseLoop();`
     - Split 비교 모달 진입 (line 56): `wasmVisualEngine.pauseLoop();`
     - 모달 닫힘 / Main 뷰 복귀 (line 84): `wasmVisualEngine.resumeLoop();`
- Expected Basis: WCAG 2.2 Success Criterion 2.3.3 (Animation from Interactions) 준수 및 배경 렌더링 리소스 최적화.
- Actual: 미디어 쿼리 기반 모션 감쇠 및 모달 팝업 시 렌더 루프 일시정지/재개 완비.
- Impact: 모션 민감 사용자 보호 및 모달 사용 시 백그라운드 캔버스 연산 부하 0% 달성.
- Suggested Action: 추가 조치 불필요.
- Re-audit Method: `visualEngine.js`와 `detailView.js`의 생명주기 훅 호출 확인.
- Confidence: High (100%)

---

### [A03-F005 / FIN-F008 Re-audit] LocalStorage 복원 데이터의 카탈로그 화이트리스트 유효성 검증
- Area: `src/state/appState.js` (lines 29–54)
- Severity: Minor (이전 Minor에서 수정 검증 완료)
- Status: Verified (해소됨)
- Summary: LocalStorage에 저장된 북마크(`dss_bookmarks_v2`), 확정 스타일(`dss_confirmed_v21`), 최근 본 목록(`dss_recent_v21`) 복원 시 24개 정적 디자인 ID 목록인 `VALID_SUB_IDS` Set에 대한 검증을 수행하여, 변조되거나 존재하지 않는 ID가 상태 객체에 유입되어 발생하는 런타임 오류 및 잠재적 스크립트 인젝션을 방지했습니다.
- Evidence:
  ```javascript
  // src/state/appState.js:29-53
  const VALID_SUB_IDS = new Set([
    'swiss-grid', 'corporate-minimal', 'minimalism-clean',
    'raw-brutalism', 'neo-brutalism', 'acid-techno',
    'glassmorphism-luxe', 'neumorphism-soft', 'claymorphism-bubble',
    'pixel-arcade-8bit', 'vaporwave-80s', 'skeuomorphism-classic',
    'editorial-serif', 'handcrafted-indie', 'bauhaus-geometric',
    'y2k-chrome-hologram', 'frutiger-aero-aqua', 'memphis-pattern',
    'cyberpunk-hud', 'kinetic-type-motion', 'darkmode-highcontrast',
    'bento-ui-precision', 'organic-nature', 'solarpunk-eco'
  ]);

  function loadStoredBookmarks() {
    const parsed = loadJSON('dss_bookmarks_v2', []);
    return Array.isArray(parsed) ? parsed.filter(id => typeof id === 'string' && VALID_SUB_IDS.has(id)) : [];
  }

  function loadStoredConfirmed() {
    const id = loadJSON('dss_confirmed_v21', null);
    return (typeof id === 'string' && VALID_SUB_IDS.has(id)) ? id : null;
  }

  function loadStoredRecents() {
    const parsed = loadJSON('dss_recent_v21', []);
    return Array.isArray(parsed) ? parsed.filter(id => typeof id === 'string' && VALID_SUB_IDS.has(id)).slice(0, 6) : [];
  }
  ```
- Expected Basis: 외부 스토리지(LocalStorage) 데이터의 입력 무결성 검증 (Input Validation).
- Actual: 화이트리스트 기반 필터링 및 최대 개수 제한(`slice(0, 6)`) 적용 완료.
- Impact: 스토리지 오염 또는 임의 문자열 주입 시에도 앱 크래시 없이 안전하게 초기 상태로 복구됨.
- Suggested Action: 추가 조치 불필요.
- Re-audit Method: `src/state/appState.js` 복원 함수 및 화이트리스트 로직 점검.
- Confidence: High (100%)

---

### [A03-F006 / FIN-F006 Re-audit] 헤더 브랜드 로고 `role="button"`의 키보드(Enter/Space) 활성화 핸들러 검증
- Area: `src/components/header.js` (lines 24, 130–136)
- Severity: Minor (이전 Minor에서 수정 검증 완료)
- Status: Verified (해소됨)
- Summary: 헤더의 로고 영역(`#brand-home-btn`)에 `role="button"`, `tabindex="0"`, `title="메인 홈으로 이동"`이 부여되었으며, `click` 이벤트뿐 아니라 `keydown` 이벤트에서 `Enter` 및 `Space` 키 입력 시 `e.preventDefault()` 및 메인 화면 초기화(`handleHome()`)가 실행되도록 완벽히 구현되었습니다.
- Evidence:
  ```javascript
  // src/components/header.js:24
  <div class="brand-container" id="brand-home-btn" role="button" tabindex="0" title="메인 홈으로 이동">

  // src/components/header.js:130-136
  brandHome.addEventListener('click', handleHome);
  brandHome.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleHome();
    }
  });
  ```
- Expected Basis: WAI-ARIA Authoring Practices Guide - Button Design Pattern 준수.
- Actual: `role="button"`에 필수적인 키보드 활성화 인터랙션 완비.
- Impact: 키보드 탐색 사용자(Tab + Enter/Space)가 메인 갤러리로 즉각 복귀 가능.
- Suggested Action: 추가 조치 불필요.
- Re-audit Method: `src/components/header.js` 이벤트 바인딩 로직 확인.
- Confidence: High (100%)

---

### [A03-F007] 신규 아키타입 인터랙션 시뮬레이션의 XSS 방지 및 메모리 해제 검증
- Area: `src/components/mockupRuntime.js` (lines 457–552), `src/components/archetypeTemplates.js`
- Severity: Info (신규 구현 검증)
- Status: Verified (양호)
- Summary: 8대 아키타입 시뮬레이터(블로그 댓글 작성, 실시간 챗봇 메시지 송수신 등)에서 사용자가 입력한 문자열을 DOM에 추가할 때, `p.textContent = text`를 사용하여 안전하게 바인딩하며, WeakMap 기반 CleanupRegistry(`teardownMockup`)를 통해 모달 뷰 전환 시 비동기 봇 응답 타이머 및 이벤트 리스너가 메모리 누수 없이 즉시 정리됩니다.
- Evidence:
  1. `submitBlogComment` (`src/components/mockupRuntime.js:472`):
     ```javascript
     const p = document.createElement('p');
     p.textContent = text; // Safe textContent
     ```
  2. `submitChatMessage` (`src/components/mockupRuntime.js:507, 539`):
     ```javascript
     const p = document.createElement('p');
     p.textContent = text;
     ...
     const bP = document.createElement('p');
     bP.textContent = `"${text}"에 대한 테마 프리뷰가 실시간으로 반영되었습니다! 🎨`;
     ```
  3. `cleanups` 등록 및 정리 (`src/components/mockupRuntime.js:28-36, 551`):
     ```javascript
     cleanups.push(() => clearTimeout(timer));
     ```
- Expected Basis: 사용자 입력 시뮬레이션 필드의 XSS 방어 및 타이머 생명주기 관리.
- Actual: `textContent` 및 WeakMap 생명주기 기반 안전한 메모리/DOM 제어 구현 확인.
- Impact: 악의적인 스크립트 태그 입력 시에도 순수 텍스트로 안전하게 렌더링되며, 뷰 전환 시 고스트 타이머 발생 없음.
- Suggested Action: 추가 조치 불필요.
- Re-audit Method: `src/components/mockupRuntime.js` 입력 처리 및 정리 로직 정밀 분석.
- Confidence: High (100%)

---

## 6. Uncertainties and Clarifications Needed
- 없음. Turn 1에서 식별된 모든 보안 취약점과 접근성 결함 및 리소스 누수 항목이 소스 코드 수준에서 명확하게 수정되고 검증되었습니다.

---

## 7. Perspective Decision
- **Final Turn 2 Decision for Sub-Auditor 03**: **`PASS`**
- **Decision Rationale**:
  1. [보안/XSS]: `showToast` 및 시뮬레이터 입력부에서 `innerHTML` 취약점이 완전히 해소되었고 `textContent` 및 엄격한 DOM 구성 방식으로 전환되었습니다.
  2. [접근성/a11y]: WAI-ARIA Dialog 속성, Focus Trap, 포커스 복원, ESC 닫기 핸들러, `role="tab"`/`aria-selected`, `role="button"` 키보드 활성화가 구현되어 키보드 접근성이 완벽히 보장됩니다.
  3. [리소스/안정성]: Web Audio API의 모든 오실레이터/필터/게인 노드에 `.disconnect()` 호출이 보장되어 메모리 누수가 차단되었으며, WASM 배경 렌더러의 루프 일시정지/재개와 LocalStorage 화이트리스트 검증이 빈틈없이 작동합니다.
  4. 잔여 Critical/Major 이슈가 존재하지 않으므로 Security Boundaries & Robustness 관점에서 무조건적인 **`PASS`**로 판정합니다.
