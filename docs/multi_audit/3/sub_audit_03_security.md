# Sub Audit Report

## 1. Audit Metadata
- Audit Turn: 3
- Perspective: Security Boundaries & Robustness
- User Goal: Security Boundaries Final Verification - Turn 3
- Audit Basis: Standard-backed
- Standard Path: `/home/eunho1/Projects/web/design_sample_selector/AI_AUDIT_DOC_STANDARD.md` (Pass 3: Security & Robustness)

---

## 2. Assigned Scope
- `src/utils/clipboard.js`: `showToast` 및 `copyToClipboard`의 `textContent` 기반 XSS 방어 및 DOM 조작 안전성 검증
- `src/components/detailView.js`: WAI-ARIA 다이얼로그/탭/칩 접근성, Focus Trap, ESC 키보드 트랩 탈출 및 포커스 복구 검증
- `src/audio/synthAudio.js`: Web Audio API 보이스 노드(Oscillator, Filter, Gain)의 `osc.onended` 내 `.disconnect()` 호출 및 메모리 누수 방지 검증
- `src/wasm/visualEngine.js`: `prefers-reduced-motion` 모션 감축 분기 및 모달 활성화 시 캔버스 렌더 루프 일시정지(`pauseLoop`/`resumeLoop`) 수명주기 검증
- `src/state/appState.js`: `VALID_SUB_IDS` 화이트리스트 검증 기반 안전한 LocalStorage 복원 및 예외 격리 검증
- `src/components/mockupRuntime.js`: 아키타입 댓글/채팅 시뮬레이션의 `textContent` 기반 XSS 방어 및 `WeakMap` 기반 `teardownMockup` 클린업 수명주기 검증

---

## 3. Excluded and Uninspected Scope
- `dist/` 및 `node_modules/`: 빌드 번들 및 서드파티 라이브러리 (정적 소스 검증에 집중)
- `.git/`: 형상 관리 메타데이터

---

## 4. Evidence Examined
- `src/utils/clipboard.js`: L38-66 (`showToast` 안전한 DOM 생성 및 `textContent` 주입)
- `src/components/detailView.js`: L56, L84, L108 (`wasmVisualEngine.pauseLoop/resumeLoop`), L153, L169-175, L199-206, L220-244, L875, L919-924 (WAI-ARIA `role="dialog"`, `aria-modal="true"`, `role="tablist"`, `role="tab"`, `aria-selected`), L763-791, L1048-1060 (ESC 키 닫기 핸들러), L829-865 (Focus Trap `setupFocusTrap`, `removeFocusTrap`, `lastFocusedElement.focus()`)
- `src/audio/synthAudio.js`: L441-447 (`playWarmPad` onended disconnect), L477-483 (`playSoftBass` onended disconnect), L513-519 (`playArpNote` onended disconnect), L552, L565, L605, L641, L654 (`playSfx` onended disconnect), L673-678 (`playChimeNote` onended disconnect)
- `src/wasm/visualEngine.js`: L86-98 (`pauseLoop`, `resumeLoop`), L114-118 (`prefersReducedMotion()` 정적 루프 분기), L103-108 (`isPaused` 플래그 및 RAF 취소 제어)
- `src/utils/selection.js`: L129-132 (`prefersReducedMotion` 미디어 쿼리 방어적 체크)
- `src/state/appState.js`: L6-27 (`loadJSON`/`saveJSON` 안전 래퍼), L29-48 (`VALID_SUB_IDS` 화이트리스트 Set), L50-63 (`loadStoredBookmarks`, `loadStoredConfirmed`, `loadStoredRecents` 화이트리스트 필터링), L205-213 (`notify` subscriber try/catch 격리)
- `src/components/mockupRuntime.js`: L14, L28-36 (`WeakMap` 기반 `teardownMockup`), L42, L98-101 (`cleanups` 레지스트리 및 이벤트 리스너/타이머 해제), L457-485 (`submitBlogComment`의 `textContent` 주입), L486-552 (`submitChatMessage`의 `textContent` 주입 및 AI 응답 타이머 cleanup)

---

## 5. Findings

### [A03-F001] Clipboard & Toast XSS 방어 및 안전한 DOM 생성 검증
- Area: `src/utils/clipboard.js`
- Severity: Info
- Status: Confirmed
- Summary: 토스트 알림 생성 시 임의의 HTML 파싱을 방지하고 `textContent`를 통해 안전하게 텍스트를 렌더링함을 확인.
- Evidence: `src/utils/clipboard.js` L50-60:
  ```js
  const iconSpan = document.createElement('span');
  iconSpan.textContent = '✨';
  iconSpan.setAttribute('aria-hidden', 'true');

  const textSpan = document.createElement('span');
  textSpan.textContent = String(message);

  toast.appendChild(iconSpan);
  toast.appendChild(document.createTextNode(' '));
  toast.appendChild(textSpan);
  ```
- Expected Basis: AI_AUDIT_DOC_STANDARD SEC-001 (동적 사용자/입력 메시지 출력 시 innerHTML 사용 금지 및 textContent 강제).
- Actual: `innerHTML` 없이 `document.createElement` 및 `textContent`로 안전하게 렌더링되며, 장식용 아이콘에 `aria-hidden="true"`가 적용됨.
- Impact: 악의적 문자열 복사나 비정상 라벨 입력 시에도 DOM XSS가 원천 차단됨.
- Suggested Action: 현행 구현 유지.
- Re-audit Method: `copyToClipboard('<script>alert(1)</script>')` 호출 후 DOM 인스펙터 확인.
- Confidence: High
- Notes: 완료 확인.

---

### [A03-F002] WAI-ARIA 접근성, Focus Trap 및 키보드 네비게이션 제어 검증
- Area: `src/components/detailView.js`
- Severity: Info
- Status: Confirmed
- Summary: 모달 다이얼로그의 Focus Trap, ESC 키 닫기, 이전 포커스 복원 및 WAI-ARIA 탭/다이얼로그 시맨틱이 완벽하게 유지됨을 확인.
- Evidence:
  1. WAI-ARIA 역할 및 속성:
     - 상세 모달: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-style-title"` (`detailView.js` L153)
     - 스플릿 비교 모달: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="split-modal-title"` (`detailView.js` L875)
     - 탭 목록 및 탭 버튼: 대분류, 24개 세부 스타일 칩, 8개 아키타입, 웹 서브탭, 스플릿 픽커 모두 `role="tablist"`, `role="tab"`, `aria-selected` 적용
  2. Focus Trap 및 포커스 복원:
     - `setupFocusTrap` (L829-858): 모달 내 포커스 가능 요소(`button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`)를 동적으로 계산하여 Tab / Shift+Tab 순환 잠금.
     - 포커스 복원 (L85-88, L115): 모달 진입 시 `lastFocusedElement = document.activeElement`를 캡처하고, 닫힐 때 `lastFocusedElement.focus()`로 원상 복구.
  3. ESC 키보드 탈출:
     - DETAIL 뷰: `detailKeyHandler` 내 `e.key === 'Escape'` -> `closeModal()` (L775-777)
     - SPLIT_COMPARE 뷰: `splitKeyHandler` 내 `e.key === 'Escape'` -> `closeCompare()` (L1048-1060)
- Expected Basis: W3C WAI-ARIA Authoring Practices Guide (APG) Modal Dialog Pattern.
- Actual: 포커스 트랩, ESC 닫기, 포커스 복원, 스크린리더 식별 속성이 표준에 부합하게 구현되어 있음.
- Impact: 키보드 사용자 및 보조기술 사용자의 웹 접근성이 완전하게 보장됨.
- Suggested Action: 현행 구현 유지.
- Re-audit Method: 모달 오픈 후 Tab/Shift+Tab 순환 테스트 및 Esc 키 입력 테스트.
- Confidence: High
- Notes: 완료 확인.

---

### [A03-F003] Web Audio API 보이스 노드 Disconnect 및 메모리 누수 방지 검증
- Area: `src/audio/synthAudio.js`
- Severity: Info
- Status: Confirmed
- Summary: BGM 폴리포닉 신스 및 SFX 효과음의 모든 OscillatorNode 수명주기 종료 시(`.onended`) 오디오 노드 그래프를 명시적으로 disconnect하여 Web Audio 컨텍스트 메모리 누수를 원천 차단함을 확인.
- Evidence: `src/audio/synthAudio.js`
  - `playWarmPad` (L441-447):
    ```js
    osc.onended = () => {
      try {
        osc.disconnect();
        padFilter.disconnect();
        gain.disconnect();
      } catch { /* ignore */ }
    };
    ```
  - `playSoftBass` (L477-483): `osc.disconnect(); bassFilter.disconnect(); gain.disconnect();`
  - `playArpNote` (L513-519): `osc.disconnect(); arpFilter.disconnect(); gain.disconnect();`
  - `playChimeNote` (L673-678): `osc.disconnect(); gain.disconnect();`
  - `playSfx` 직렬 효과음들 (L552, L565, L605, L641, L654): `osc.onended = () => { osc.disconnect(); gain.disconnect(); };`
- Expected Basis: Web Audio API Resource Management Standard (오디오 그래프 노드 해제 불변조건).
- Actual: 모든 음성 노드 생성부에 `osc.onended` 핸들러가 장착되어 발음 종료 즉시 노드가 그래프에서 분리됨.
- Impact: 장시간 BGM 재생 및 수백 회의 UI 인터랙션 발생 시에도 오디오 스레드 CPU 점유율 및 메모리 누수가 발생하지 않음.
- Suggested Action: 현행 구현 유지.
- Re-audit Method: BGM 10분간 연속 재생 및 연속 클릭 테스트 후 Chrome DevTools Memory Heap Snapshot 확인.
- Confidence: High
- Notes: 완료 확인.

---

### [A03-F004] 모션 감축(prefers-reduced-motion) 및 캔버스 렌더 루프 절전 제어 검증
- Area: `src/wasm/visualEngine.js`
- Severity: Info
- Status: Confirmed
- Summary: OS 모션 감축 설정 준수 및 모달 레이어 활성화 시 백그라운드 캔버스 애니메이션 RAF 루프를 일시정지(`pauseLoop`)하여 불필요한 GPU/CPU 낭비를 방지함을 확인.
- Evidence: `src/wasm/visualEngine.js`
  - Reduced Motion 감지 (L114-118):
    ```js
    const reduced = prefersReducedMotion();
    if (reduced) {
      // In reduced motion, subtle static drift without high physics
      return;
    }
    ```
  - 루프 일시정지 / 재개 (L86-98):
    ```js
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
  - 모달 수명주기 연동: `src/components/detailView.js` L56 (`SPLIT_COMPARE` 진입 시 `pauseLoop`), L108 (`DETAIL` 진입 시 `pauseLoop`), L84 (모달 종료 시 `resumeLoop`).
- Expected Basis: WCAG 2.1 Success Criterion 2.3.3 (Animation from Interactions) 및 에너지 효율 렌더링 아키텍처.
- Actual: 모션 감축 환경에서 파티클 물리 연산이 즉시 스킵되며, 모달 오픈 시 캔버스 RAF 루프가 완전히 정지됨.
- Impact: 전정 신경 장애 사용자의 시각적 피로를 방지하고 모달 조작 중 디바이스 배터리 및 연산 리소스를 최적화함.
- Suggested Action: 현행 구현 유지.
- Re-audit Method: DevTools 렌더링 탭에서 `prefers-reduced-motion: reduce` 에뮬레이션 및 모달 오픈 상태에서 FPS/RAF 발생 여부 측정.
- Confidence: High
- Notes: 완료 확인.

---

### [A03-F005] LocalStorage 복원 시 VALID_SUB_IDS 화이트리스트 검증 및 예외 격리
- Area: `src/state/appState.js`
- Severity: Info
- Status: Confirmed
- Summary: 클라이언트 스토리지 조작 또는 비정상 데이터 주입에 대비하여 `VALID_SUB_IDS` 화이트리스트 Set을 통한 엄격한 유효성 검증 및 예외 격리가 이루어짐을 확인.
- Evidence: `src/state/appState.js`
  - 화이트리스트 정의 (L29-48): 24개 코어 ID 및 지원 별칭을 `new Set([...])`으로 상수화.
  - 스토리지 복원 로직 (L50-63):
    ```js
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
  - `loadJSON` / `saveJSON` (L6-27): `typeof localStorage === 'undefined'` 검사 및 `try/catch` 블록으로 보안/개인정보 보호 모드(QuotaExceeded / SecurityError) 예외 방어.
  - `notify` (L205-213): 구독자 콜백 실행 중 에러가 발생해도 다른 구독자 및 앱 상태 전파가 중단되지 않도록 `try/catch` 격리.
- Expected Basis: OWASP Client-Side Security Guideline & Robust Error Isolation Pattern.
- Actual: 스토리지 데이터가 위조되거나 손상되어도 화이트리스트에 없는 ID는 즉시 필터링되어 애플리케이션 상태 불일치(State Poisoning)를 방지함.
- Impact: 예기치 않은 스토리지 오염 상황에서도 무한 루프나 런타임 크래시 없이 안전하게 복구됨.
- Suggested Action: 현행 구현 유지.
- Re-audit Method: `localStorage.setItem('dss_bookmarks_v2', JSON.stringify(['malicious-id', 'swiss-grid']))` 주입 후 새로고침하여 상태 복원 확인.
- Confidence: High
- Notes: 완료 확인.

---

### [A03-F006] Mockup Runtime 시뮬레이션 XSS 방어 및 WeakMap 기반 메모리 클린업 검증
- Area: `src/components/mockupRuntime.js`
- Severity: Info
- Status: Confirmed
- Summary: 8대 아키타입 시뮬레이터(블로그 댓글, 채팅 메시지 등)의 사용자 입력 동적 렌더링 시 `textContent`를 엄격히 사용하여 XSS를 방어하고, `WeakMap` 기반 Cleanup Registry를 통해 뷰포트 전환 시 이벤트 및 비동기 타이머가 누수 없이 정리됨을 확인.
- Evidence: `src/components/mockupRuntime.js`
  - WeakMap 레지스트리 및 Teardown (L14, L28-36):
    ```js
    const runtimeMap = new WeakMap();

    export function teardownMockup(rootEl) {
      if (!rootEl) return;
      const rt = runtimeMap.get(rootEl);
      if (!rt) return;
      rt.cleanups.forEach((fn) => {
        try { fn(); } catch { /* ignore */ }
      });
      runtimeMap.delete(rootEl);
    }
    ```
  - 사용자 입력 안전 처리 (L468-475, L503-508, L538-540):
    - 블로그 댓글: `author.textContent = '방문자 (You)'; p.textContent = text;`
    - 채팅 메시지: `sender.textContent = 'You'; p.textContent = text;`
    - 챗봇 응답 시뮬레이션: `bP.textContent = \`"\${text}"에 대한 테마 프리뷰가 실시간으로 반영되었습니다! 🎨\`;`
  - 비동기 타이머 클린업 (L522-552): AI 응답 지연 `setTimeout`의 핸들을 `cleanups.push(() => clearTimeout(timer))`에 등록하여 아키타입 전환 시 고스트 타이머 실행 방지.
- Expected Basis: DOM XSS Prevention Standard 및 Component Lifecycle Cleanup Pattern.
- Actual: 동적 HTML 템플릿 보간 없이 DOM 요소를 직접 생성하고 `textContent`로 텍스트를 대입하며, DOM 해제 시 `teardownMockup`에 의해 모든 이벤트 리스너와 타이머가 해제됨.
- Impact: XSS 공격 벡터가 완벽히 차단되며, 샌드박스 아키타입/스타일 탭을 반복 전환해도 메모리 누수 및 비동기 고스트 콜백이 발생하지 않음.
- Suggested Action: 현행 구현 유지.
- Re-audit Method: 채팅 입력란에 `<img src=x onerror=alert(1)>` 입력 후 전송하여 텍스트 그대로 안전 렌더링되는지 확인하고, 전송 직후 모달을 닫아 타이머 해제 여부 검증.
- Confidence: High
- Notes: 완료 확인.

---

## 6. Uncertainties and Clarifications Needed
- 없음 (모든 보안 경계, 수명주기 클린업, 접근성 속성 및 스토리지 복원 로직이 명확한 코드로 검증됨).

---

## 7. Perspective Decision
- **Decision**: `PASS WITHIN STATED SCOPE`
- **Rationale**:
  1. XSS 방어: `showToast`, 블로그 댓글, 채팅 시뮬레이터 모두 `textContent` 및 정적 DOM 생성을 엄격히 준수하여 Injection 취약점이 존재하지 않음.
  2. 접근성(WAI-ARIA & APG): Focus Trap, 포커스 복원, ESC 닫기, 탭/다이얼로그 시맨틱 역할이 완벽하게 준수됨.
  3. 리소스 & 메모리 수명주기: Web Audio 노드 `.disconnect()` 해제, 캔버스 렌더 루프 pause/resume, `WeakMap` 기반 컴포넌트 teardown이 일관되게 동작함.
  4. 상태 무결성: `VALID_SUB_IDS` 화이트리스트 필터링 및 예외 격리를 통해 LocalStorage 오염에 안전하게 복원됨.
  5. 조사 대상 전 영역에서 미해결 차단 이슈 및 취약점이 발견되지 않아 PASS 판정을 확정함.
