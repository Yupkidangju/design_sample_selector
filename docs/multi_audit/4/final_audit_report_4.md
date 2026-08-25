# D3D Audit Report (Turn 4)

## 1. Audit Scope

- **Project:** Web Design Sample Selector (`design_sample_selector`)
- **Workspace:** `/home/eunho1/Projects/web/design_sample_selector`
- **Audit date:** 2026-08-25
- **Mode:** 읽기 중심 전수 감사 (`/audit`). 코드·문서 수정 없음.
- **Basis:** `AI_AUDIT_DOC_STANDARD.md` 3-Pass, `audit_roadmap.md`, 마스터 계약 `spec.md`
- **Authority:** `spec.md` > `designs.md` > `implementation_summary.md` / `DESIGN_DECISIONS.md` / `README.md` / `CHANGELOG.md` / `BUILD_GUIDE.md` > 소스
- **User goal:** 문서 계약대로 구현되었는지, 고아 기능이 있는지 철저 검증
- **Direct re-open:** 오케스트레이터가 `spec.md`, 상태/데이터, 8대 아키타입, 테마 토큰, 오디오, 상세/스플릿 모달, 헤더 검색, teardown 경로를 소스에서 재확인함. 이전 Turn 3 `PASS`는 재사용하지 않음.

작업면:

- 문서: `spec.md`, `designs.md`, `implementation_summary.md`, `DESIGN_DECISIONS.md`, `README.md`, `CHANGELOG.md`, `BUILD_GUIDE.md`, `audit_roadmap.md`
- 소스: `src/**`, `index.html`, `index.css`, `package.json`, `vite.config.js`
- 산출물: `dist/assets/` (참조만)

## 2. Excluded Scope

- `node_modules/`, `.git/`
- 백엔드·인증·서버 DB (`spec.md` Non-Goals)
- 브라우저 실기 클릭 전수(본 감사는 정적 소스 전수 + 호출 경로 추적). 검색 리마운트·스플릿 닫기 공백은 코드 경로상 재현 가능으로 판정.
- `docs/multi_audit/1~3` 과거 보고서는 **증거로 채택하지 않음**(현재 트리와 불일치).

## Missing Inputs

- 테스트 디렉터리 없음 (`tests/` / `test/` 부재)
- `LESSONS_LEARNED.md`, `kanban_board.md` 없음
- `.wasm` 바이너리 없음

## 확인한 실행 명령

- `find . -name '*.wasm' -not -path './node_modules/*'` → 0
- 테스트 디렉터리 조회 → `NO_TEST_DIR`
- `dist/assets/`: `index-CUBuxLW4.js`, `index-BGAbV_jb.css` (Turn 3 보고서의 `index-CsmilWe8.js`와 불일치)

---

## 3. Pass 1: Implementation Compliance Findings

### 기능 매트릭스 (계약 → 구현)

| 계약 (`spec.md` §3.1 / §5–8) | 판정 | 증거 |
| --- | --- | --- |
| 8대분류 × 24 서브스타일 | **구현** | `src/data/categories.js` 8×3, ID 24종 |
| 별칭 듀얼 셀렉터 + `VALID_SUB_IDS` | **구현** | `themeTokens.css` 듀얼/트리플, `appState.js` 45 ID |
| Universal Top Bar + `[` `]` Shift+화살표 | **구현** | `detailView.js` 칩/탭 + `detailKeyHandler` |
| Zero-Rebuild 테마 스왑 (아키타입 유지) | **구현** | `applyZeroRebuildThemeSwap` |
| 3 갤러리 모드·검색·장르 필터·북마크·도크·피크 | **구현** | `header.js`, `mainView.js`, `selectionDock.js`, `peekPreview.js` |
| 스플릿 비교 + 썸네일 피커 | **부분** | 피커는 동작. 스플릿 탭이 8종 중 6종만. MAIN에서 열면 닫기 경로 파손 |
| 슬라이더 0–64 / 0–12 / 0–30 / 0–32 / 0–2.0 | **구현** | `detailView.js` range. `designs.md`는 0–48/0–8로 충돌 |
| 줌 80/100/120, 듀얼 스크롤, 기본값 리셋 | **구현** | `detailView.js`, `interactive.css` |
| 16 BGM + 14 SFX **이름** | **구현** | `synthAudio.js` `BGM_TRACKS` 0–15, `playSfx` 14 분기 |
| 14 SFX **물리 파라미터** | **부분** | SWIPE가 noise 300→1200이 아니라 triangle 320→720 |
| CSS/HTML 스니펫 원클릭 복사 | **부분** | CSS 복사만. HTML 복사 버튼 없음 |
| 8 아키타입 템플릿 DOM | **구현** | `archetypeTemplates.js` 8 switch |
| 키네틱 시뮬레이터 전항목 | **부분** | 아래 IMP-F002 |
| WASM 파티클 엔진 | **미구현** | JS Canvas만. `.wasm` 0 |
| Focus trap / `role="tab"` / Esc | **구현** (스플릿 포커스 복원은 약함) | `detailView.js` |
| 댓글/토스트 XSS-safe | **구현** | `textContent` / `createElement` |
| Mood 태그 필터 칩 | **부분** | 검색에서 `moodTags` 매칭만. 독립 Mood 칩 없음 |

---

### [IMP-F001] 24 ID 듀얼 매핑 (FIN-F009 재확인)

- Pass: Implementation
- Pattern: IMP-001 문서-구현 정합성
- Area: `categories.js` / `themeTokens.css` / `appState.js`
- Severity: Info
- Status: **Verified**
- Summary: 카탈로그 정규 ID 24종과 spec 별칭 21종이 CSS 듀얼/트리플 셀렉터 및 `VALID_SUB_IDS`(45)와 일치한다.
- Evidence: `src/data/categories.js` 서브 `id`; `src/styles/themeTokens.css` L29–475; `src/state/appState.js` L29–48
- Expected / Actual: 매핑 완비. 런타임 `data-theme`는 정규 ID만 사용.
- Suggested Fix: 없음. spec §8에 “정규 ID = categories.js, 별칭 = CSS/스토리지 전용”을 명시하면 재감사 혼선이 줄어든다.
- Re-audit Method: 24 ID × 셀렉터 × Set 멤버십 표 대조.

### [IMP-F002] 키네틱 시뮬레이터 계약 미달

- Pass: Implementation
- Area: `archetypeTemplates.js`, `mockupRuntime.js`
- Severity: **Major**
- Status: **Needs Fix**
- Summary: 8 템플릿은 있으나 spec §3.1에 적힌 시뮬레이터 세부 동작이 여러 아키타입에서 빠져 있거나 장식에 그친다. Turn 3가 “키네틱 런타임 완비”로 판정한 것은 과장이다.
- Evidence:
  - Game: 클릭/콤보/HP/MP/쿨다운 있음. **레벨업 파티클 없음**.
  - Blog: 댓글·라이트모드·박수 카운트 있음. 진척 바 `width: 25%` 고정 (`archetypeTemplates.js` L358–360), **목차 없음**, 스크롤 리스너 없음.
  - Dashboard: 1D/1W/1M **+ 1Y**. 테이블 정렬/필터 없음. KPI만 난수 갱신.
  - Media: 비닐 play 토글. 스크럽/이전다음는 SFX만. **볼륨 슬라이더·스펙트럼 없음**.
  - E-commerce: 컬러/수량/카트/결제 있음. **사이즈 옵션 없음**.
  - Chat: 입력·봇 응답·리액션 있음. 채널 행에 `data-action` 없음.
- Expected: spec §3.1 각 아키타입 bullet 전항목.
- Actual: 시각 골격 + 일부 클릭 시뮬.
- Impact: “fully functional Kinetic Interaction Simulators” 계약이 사용자/문서에 과대 주장됨.
- Suggested Fix: 빠진 동작을 구현하거나 spec/README/CHANGELOG에서 해당 bullet을 시뮬레이터 Non-Goal/부분 구현으로 축소.
- Re-audit Method: 아키타입별 체크리스트를 코드 `data-action`과 1:1 대조.

### [IMP-F003] WASM 엔진은 이름만 존재

- Pass: Implementation
- Area: `src/wasm/visualEngine.js`, 문서 전역
- Severity: **Major**
- Status: **Needs Fix**
- Summary: spec·README·BUILD_GUIDE·헤더 배지가 WebAssembly를 단언하지만 소스는 Canvas 2D JS이며 `.wasm` 파일이 없다. `wasmLoaded = true`를 초기화 직후 강제 설정한다.
- Evidence: `visualEngine.js` L28–41; 저장소 `*.wasm` 0건; `header.js` L241–242 `WASM: ACTIVE (60FPS)`; `spec.md` L57–79
- Expected: WASM 파티클 수학 + JS fallback, grid wave.
- Actual: JS 파티클 + 오디오 반응 + 모달 `pauseLoop`/`resumeLoop`만 실재. grid-wave 없음.
- Suggested Fix: 실제 WASM을 넣거나 계약을 “Canvas 2D 파티클 엔진”으로 강등하고 UI/문서의 WASM 단언을 제거.
- Re-audit Method: `WebAssembly.` / `.wasm` 검색 + `wasmLoaded` 할당 경로.

### [IMP-F004] 문서 버전·체크리스트 권위 붕괴

- Pass: Implementation
- Area: 문서군
- Severity: **Major**
- Status: **Needs Fix**
- Summary: 패키지는 2.2.2인데 마스터 spec은 2.2.0, 감사 로드맵은 1.0.0(5분류/15서브/10 BGM/5 SFX), BUILD_GUIDE는 2.0.0, DESIGN_DECISIONS 헤더는 2.1.0이다. `designs.md` 슬라이더 상한이 spec/코드와 다르다.
- Evidence:

| 파일 | 표기 버전 |
| --- | --- |
| `package.json` | 2.2.2 |
| `CHANGELOG.md` | 2.2.2 |
| `spec.md` | 2.2.0 (본문에 줌/듀얼스크롤/슬라이더 상한 포함) |
| `designs.md` | 2.2.0, Radius 0–48 / Border 0–8 |
| `implementation_summary.md` | 2.2.0 |
| `DESIGN_DECISIONS.md` | 2.1.0 |
| `BUILD_GUIDE.md` | 2.0.0, 디렉터리 트리 누락 |
| `audit_roadmap.md` | 1.0.0, Phase 3–5가 구계약 |
| `header.js` 배지 | v2.2 LIVE |

- Expected: 동 작업 단위에서 계약 문서가 제품 버전과 동기.
- Actual: 감사자가 어느 문서를 믿을지 불명. 구 `audit_roadmap`을 그대로 쓰면 미래 감사가 거짓 PASS를 낸다.
- Suggested Fix: 살아 있는 계약을 2.2.2로 맞추거나, spec을 2.2.0 freeze로 두고 2.2.1/2.2.2를 CHANGELOG-only로 명시. `audit_roadmap.md` 전면 재작성.
- Re-audit Method: 모든 문서 헤더 버전 + Phase 숫자(8/24/16/14) 표.

### [IMP-F005] AppState 고아 필드

- Pass: Implementation
- Area: `appState.js`, `selection.js`
- Severity: Minor
- Status: **Needs Spec Clarification**
- Summary: `comparePickerOpen`은 `openSplitCompare`에서 항상 `false`로만 기록되고 읽히지 않는다. `comparePickingSlot`은 DEFAULT에만 있다. `bgmEnabled`는 위젯이 토글하지 않는다. 북마크 키 `dss_bookmarks_v2`는 코드에만 있고 spec §5.1에 없다.
- Evidence: `appState.js` L83–94; `selection.js` L88–92
- Suggested Fix: 필드를 삭제하거나 피커/BGM 뮤트에 실제로 연결. spec에 북마크 키 추가.

### [IMP-F006] HTML 스니펫 복사 부재

- Pass: Implementation
- Area: `detailView.js` L378–384, L750–757
- Severity: Minor
- Status: **Needs Fix**
- Summary: spec은 “CSS/HTML snippet copying”, designs는 “Live CSS & HTML Inspector”. UI는 `📋 CSS 복사`만 있다.
- Suggested Fix: HTML 복사 버튼을 추가하거나 계약을 CSS-only로 수정.

---

## 4. Pass 2: Debug / Engineering Quality Findings

### [DBG-F001] 헤더 검색이 매 입력마다 DOM을 파괴한다

- Pass: Debug
- Area: `src/components/header.js` L142–145, L225–236
- Severity: **Major**
- Status: **Needs Fix**
- Summary: `input` 이벤트가 `searchQuery`를 쓰고, 구독자가 `searchQuery` 변경 시 `update()` → `container.innerHTML = ...`로 헤더 전체를 재조립한다. 첫 글자에서 입력 포커스/캐럿이 사라진다.
- Expected: 검색어 입력 중 필터만 갱신, 입력란 유지.
- Actual: 검색 UX가 사실상 깨짐. 갤러리 필터 자체(`mainView.js`)는 동작.
- Impact: spec “Real-time Instant Search” 핵심 경로 실패.
- Suggested Fix: `searchQuery`만 바뀐 경우 입력 value 패치 + 갤러리만 리렌더. 헤더 풀 리렌더는 필터/뷰모드/북마크에 한정.
- Re-audit Method: 검색창에 3글자 입력 후 포커스·caret 유지 및 갤러리 필터 확인.

### [DBG-F002] MAIN에서 스플릿 비교를 닫으면 빈 화면

- Pass: Debug
- Area: `header.js` L197–202; `detailView.js` L1028–1030, L80–91; `mainView.js` L426–431
- Severity: **Major**
- Status: **Needs Fix**
- Summary: 헤더 `스플릿 비교`는 `currentView: 'SPLIT_COMPARE'`만 설정한다. 닫기/Esc는 항상 `currentView: 'DETAIL'`로 돌린다. `selectedSubCategory`가 없으면 상세 모달은 숨고, 갤러리는 MAIN이 아니라서 숨는다.
- Expected: 이전 뷰(MAIN 또는 DETAIL)로 복귀.
- Actual: 갤러리 → 비교 → ✕/Esc 시 빈 셸.
- Suggested Fix: `compareReturnView`를 기억하고 그곳으로 닫기. 헤더 런처는 `openSplitCompare()`를 타게 할 것.
- Re-audit Method: MAIN에서 비교 버튼 → Esc. 갤러리가 보여야 함. DETAIL에서 비교 → Esc 후 상세 유지.

### [DBG-F003] WeakMap teardown 키가 hydrate 루트와 불일치

- Pass: Debug
- Area: `mockupRuntime.js` L28–41; `detailView.js` L82, L413; `peekPreview.js` L24, L54; `selectionDock.js` L39, L139
- Severity: **Major**
- Status: **Needs Fix**
- Summary: `hydrateMockup(viewport|peek-viewport|preview)`로 등록하고, 닫을 때는 부모 `container`에 `teardownMockup`을 호출한다. `WeakMap.get(parent)`는 항상 miss. 클린업이 돌지 않은 채 `innerHTML = ''`로 노드만 버린다.
- Expected: 동일 엘리먼트에 hydrate/teardown. 타이머·리스너 해제.
- Actual: `animateMeters` 인터벌, 스킬 `setTimeout`이 분리된 노드에서 만료될 때까지 생존. WeakMap은 GC로 소실되며 cleanup 미실행.
- Suggested Fix: 같은 참조로 teardown하거나, 활성 루트 목록을 유지하고 자손을 순회.
- Re-audit Method: 모달 오픈 후 DevTools로 인터벌 수 확인 → 닫은 뒤 증가분이 0이어야 함.

### [DBG-F004] `playSfx` 차임 분기가 Oscillator/Gain을 버리고 끊지 않음

- Pass: Debug
- Area: `synthAudio.js` L539–631
- Severity: **Major** (계약 §7.2와 교차)
- Status: **Needs Fix**
- Summary: switch 전에 항상 `createOscillator`/`createGain`. `REVEAL`/`COPY`/`BOOKMARK`/`COMPARE`/`CONFIRM`/`THEME_SWAP`/`COIN`/`CART_ADD`/`SUCCESS`는 `playChimeNote`만 호출하고 break. 그 두 노드는 start/onended/disconnect가 없다.
- Suggested Fix: 해당 분기에 osc/gain을 만들지 말 것.
- Re-audit Method: 각 SFX 호출 후 AudioContext destination 연결 노드 수.

### [DBG-F005] 블러 슬라이더가 7/8 아키타입에서 no-op

- Pass: Debug
- Area: `interactive.css` L2337–2348 vs `index.css` mockup-unit blur
- Severity: Minor
- Status: **Needs Fix**
- Summary: `--tweak-backdrop-blur`는 뷰포트에 주입되나 `.archetype-unit`은 radius/border/shadow/glow만 소비. blur는 레거시 `.mockup-unit`(웹 4탭)에만 연결.
- Suggested Fix: `.archetype-unit`에 `backdrop-filter: blur(var(--tweak-backdrop-blur))` 적용.

### [DBG-F006] 스플릿 비교 탭에서 media/chat 누락

- Pass: Debug
- Area: `detailView.js` L221–244 vs L912–917
- Severity: Minor
- Status: **Needs Fix**
- Summary: 상세는 8 아키타입, 스플릿 바는 game…dashboard 6개만.
- Suggested Fix: media/chat `split-tab-btn` 추가.

### [DBG-F007] 고아 코드

- Pass: Debug
- Severity: Minor
- Status: **Needs Fix**
- Summary:
  - `getAdjacentSub`: `detailView.js` import만, 미호출
  - `findCategoryById`, `findCategoryBySubId`: export만, importer 0
  - `getStyleCountLabel`: export만
  - `animateCounters` → `[data-mock-count]`: 템플릿에 속성 없음 (죽은 애니메이터)
  - 줌 배율은 AppState 밖 로컬 DOM. 아키타입 재빌드 후 버튼 active와 transform 불일치
- Suggested Fix: dead export 제거 또는 연결. 줌을 상태에 넣거나 재빌드 시 재적용.

### [DBG-F008] 자동화 테스트 부재

- Pass: Debug
- Area: 저장소 전역
- Severity: **Major** (결정적 검증 불가)
- Status: **Needs Fix**
- Summary: 테스트 러너/픽스처가 없다. 이전 감사가 “완비 Verified”를 선언할 회귀 게이트가 없다.
- Suggested Fix: 최소 계약 스모크(24 ID, VALID_SUB_IDS, SFX 분기, teardown 키, 검색 리렌더 금지)라도 추가.
- Re-audit Method: `npm test` 또는 동등 스크립트 존재 및 통과.

### [DBG-F009] alias 북마크는 살아남고 UI는 못 찾음

- Pass: Debug
- Area: `appState.js` load filter vs `findSubById`
- Severity: Minor
- Status: **Needs Fix**
- Summary: `VALID_SUB_IDS`는 별칭을 통과시키지만 `findSubById`는 정규 ID만 찾는다. 구 스토리지의 `glassmorphism-luxe`는 카운트만 남고 칩이 빈다.
- Suggested Fix: 로드 시 별칭 → 정규 ID canonicalize.

---

## 5. Pass 3: Security Findings

### [SEC-F001] 사용자 문자열 XSS 경로 — 통과

- Pass: Security
- Severity: Info
- Status: **Verified**
- Summary: 토스트(`clipboard.js`), 블로그 댓글·채팅(`textContent`)은 안전. `eval` / `new Function` / `document.write` / `insertAdjacentHTML` 없음. `data-theme`는 카탈로그 ID attribute.
- 잔여: 카탈로그 문자열(`name`, `characteristics`, `pros`)은 `innerHTML` 보간. 현재 frozen first-party 데이터라 실 XSS는 아님.

### [SEC-F002] AudioNode disconnect 계약 위반

- Pass: Security
- Area: `synthAudio.js` `playSfx`
- Severity: Minor (교차: DBG-F004)
- Status: **Needs Fix**
- Summary: spec §7.2 MUST. 차임 SFX의 미시작 osc/gain. BGM 보이스와 `playChimeNote`는 onended disconnect 준수.

### [SEC-F003] 스플릿 경유 시 포커스 복원 상실

- Pass: Security (a11y)
- Area: `detailView.js` `lastFocusedElement`
- Severity: Minor
- Status: **Needs Fix**
- Summary: DETAIL 오픈 시 opener 저장. 스플릿 → DETAIL 재진입이 `isInitialOpen`으로 opener를 스플릿 컨트롤로 덮어쓴 뒤 그 노드를 파괴. MAIN 복귀 시 detached `.focus()`.
- 트랩/Esc 자체는 DETAIL·SPLIT 모두 존재.

### [SEC-F004] LocalStorage 로드 화이트리스트는 유효, 쓰기 경로는 재검증 없음

- Pass: Security
- Severity: Info
- Status: **Verified** (잔여)
- Summary: `JSON.parse` try/catch, 배열/문자열 + `VALID_SUB_IDS`. `__proto__`를 `Object.assign`하지 않음. `toggleBookmark`는 쓰기 시 재필터 없음. DevTools 주입 ID는 다음 로드에서 탈락.

### [SEC-F005] secrets / Vite

- Pass: Security
- Severity: Info
- Status: **Verified**
- Summary: `.env`/키 없음. `vite.config.js` sourcemap 미사용, eval 플러그인 없음. `dist`에 `.map` 없음.

### [SEC-F006] prefers-reduced-motion 시 RAF는 계속 돔

- Pass: Security
- Severity: Info
- Status: **Needs Documentation Recovery** 또는 소규모 수정
- Summary: `update()`는 물리 스킵. `draw()`+rAF는 유지. 모달 pause는 준수.

---

## 6. Cross-Pass Conflicts

| ID | 충돌 | 조정 |
| --- | --- | --- |
| XPF-F001 | Pass 1이 WASM을 계약 미달(Major)로, Pass 3은 “JS라 공격면이 작다”고 Accepted Risk 후보 | **구현 정합성은 Fail, 보안은 수용 가능**. 게이트는 Pass 1 Major가 막음. 문서를 Canvas로 바꾸면 보안 Pass와 동시에 계약 Pass 가능. |
| XPF-F002 | Pass 1 Turn 1 에이전트는 “CSS/HTML 복사 구현”으로 적었으나 소스는 CSS only | **HTML 복사 미구현**으로 확정 (IMP-F006). |
| XPF-F003 | Turn 3 최종보고서 만장일치 PASS vs 현재 트리의 검색 파괴·빈 화면·가짜 WASM·구 로드맵 | Turn 3는 **기각**. 현재 감사가 정본. |

교차 상충으로 상쇄되는 Critical은 없음.

---

## 7. Required Fixes Before PASS

Major (게이트 차단):

1. **DBG-F001** 검색 입력 시 헤더 풀 리렌더 제거
2. **DBG-F002** 스플릿 닫기 시 이전 뷰 복귀
3. **DBG-F003** hydrate/teardown 동일 루트
4. **DBG-F004 / SEC-F002** `playSfx` 미사용 노드 생성 중단
5. **IMP-F003** WASM을 구현하거나 문서·UI에서 강등
6. **IMP-F002** 시뮬레이터 공백을 구현하거나 spec에서 명시적 축소
7. **IMP-F004** `audit_roadmap.md` 및 문서 버전을 2.2.2 계약에 동기화 (`designs.md` 슬라이더 포함)
8. **DBG-F008** 최소 회귀 테스트 또는 동등한 결정적 검증 수단

Minor는 Known Issue로 이관 가능하나, PASS 전에 목록화해야 한다.

## 8. Accepted Risks

현재 **명시적 Accepted Risk 기록은 문서에 없다**. 아래는 감사가 제안하는 후보이며, 오너 서명 전까지 게이트를 열지 않는다.

| 후보 | 조건 |
| --- | --- |
| 정적 SPA, 무인증, 무서버 | spec Non-Goals. 수용 가능. |
| 카탈로그 `innerHTML` | `categories.js`가 계속 first-party freeze일 때만. |
| CSP 없음 | spec MUST 아님. |
| Canvas를 WASM으로 부르는 것 | **수용하려면 계약 문구를 먼저 바꿔야 함.** 현 상태로는 Accepted Risk가 될 수 없음. |

## 9. Needs Spec Clarification

- Mood 필터: 장르 칩 + 검색 매칭만으로 충분한가, 독립 Mood 칩이 필요한가.
- `comparePickerOpen` / `comparePickingSlot` / `bgmEnabled`를 살릴지 삭제할지.
- 대시보드 `1Y`와 README의 “테이블 정렬”을 정규 계약에 넣을지.
- 채팅 AI 봇 응답: README/코드에 있고 spec에는 “입력 시뮬레이션”만 있음.
- 줌 transform-origin이 `center top`인 것이 “centered transformation”인지.

## 10. Re-audit Checklist

- [ ] 검색창 연속 입력 시 포커스 유지
- [ ] MAIN → 스플릿 → Esc 후 갤러리 복귀, DETAIL → 스플릿 → Esc 후 상세 유지
- [ ] 모달/피크/도크 닫은 뒤 유령 타이머 0
- [ ] 14 SFX 각각 AudioNode disconnect (미시작 노드 0)
- [ ] WASM 실체 또는 문서/배지에서 WASM 문구 제거
- [ ] spec §3.1 시뮬레이터 bullet과 `data-action` 1:1
- [ ] 문서 버전 = `package.json` 2.2.2, `audit_roadmap` 8/24/16/14
- [ ] `designs.md` 슬라이더 = spec
- [ ] `VALID_SUB_IDS` 별칭 canonicalize
- [ ] 스플릿 8 아키타입 탭
- [ ] 최소 테스트 통과

## 11. Final Decision

**REWORK REQUIRED (미통과)**

핵심 갤러리·24 스타일·Top Bar·Zero-Rebuild·16 BGM·포커스 트랩·댓글 XSS 차단은 실재한다. 그러나 마스터 계약을 그대로 적용하면:

- 광고된 WASM이 없고
- 실시간 검색이 자기 DOM을 부수며
- 비교 모달 닫기가 앱을 공백으로 만들 수 있고
- 클린업 레지스트리가 빗나가며
- 아키타입 시뮬레이터와 감사 로드맵이 구버전 계약을 가리킨다.

Critical 보안 사고(원격 XSS, 시크릿)는 없다. 그래도 Major가 Accepted Risk 없이 남아 있어 `PASS` / `PASS WITH KNOWN RISKS`는 불가하다.

이전 Turn 3 `final_audit_report_3.md`의 만장일치 PASS는 **현재 트리 기준으로 기각**한다.

---

## 부록 A. 고아 인벤토리

### 코드는 있고 계약이 침묵하거나 약함

- 대시보드 `1Y`
- 채팅 Design AI Bot 자동 응답
- Desktop/Mobile 디바이스 스위치 (`sandboxDevice`)
- `dss_bookmarks_v2`
- 별칭 ID 화이트리스트 (호환용, 카탈로그 미등재)

### 계약은 있고 코드가 없거나 부분

- 실제 WebAssembly / grid-wave
- Blog TOC · 스크롤 진척
- Dashboard 정렬/필터 테이블
- E-commerce 사이즈
- Media 볼륨 · 스펙트럼
- HTML 스니펫 복사
- Mood 필터 칩
- Game 레벨업 파티클
- Chat 채널 스위처 동작
- `comparePickingSlot` UI

### 문서는 서로 모순

- spec 슬라이더 0–64/0–12 vs designs 0–48/0–8 (코드는 spec)
- README 대시보드 1Y·테이블 정렬 vs spec 1D/1W/1M·정렬 문구만
- BUILD_GUIDE 콘솔 문자열 `[WASM Engine] Initialized successfully` vs 실제 `[WASM VisualEngine] Byte renderer ready`
- audit_roadmap 5/15/10/5 vs spec 8/24/16/14

### 죽은 채 번들되는 코드

- `getAdjacentSub` import
- `findCategoryById` / `findCategoryBySubId`
- `getStyleCountLabel`
- `[data-mock-count]` 애니메이터
- `comparePickerOpen` / `comparePickingSlot`
- `playSfx`의 미사용 osc/gain (죽은 코드이자 누수)
- `animateCounters` 무호출 속성

`mockupTemplates.js`는 고아가 **아니다**. 웹 SaaS 4탭과 썸네일이 여전히 호출한다.

---

## 부록 B. 오케스트레이터 직접 재검증

| 항목 | 직접 확인 | 결과 |
| --- | --- | --- |
| 24 카탈로그 ID | `categories.js` id 전수 | Pass |
| 테마 듀얼 셀렉터 | `themeTokens.css` | Pass |
| VALID_SUB_IDS 45 | `appState.js` L29–48 | Pass |
| Zero-Rebuild | `detailView.js` L110–136, L442–473 | Pass (스타일 전환) |
| 검색 리렌더 | `header.js` L142–145 + L227–235 | **Fail** |
| 스플릿 닫기 | `closeCompare` → DETAIL only | **Fail** (MAIN 경로) |
| teardown 키 | hydrate viewport vs teardown container | **Fail** |
| playSfx osc | L540–541 then chime break | **Fail** |
| WASM | no `.wasm`, `wasmLoaded = true` | **Fail** |
| HTML copy | `#btn-copy-css` only | **Fail** (부분) |
| 댓글 textContent | `mockupRuntime.js` L472, L507 | Pass |
| Focus trap | `setupFocusTrap` | Pass (DETAIL) |
| 테스트 | 디렉터리 없음 | **Fail** |
