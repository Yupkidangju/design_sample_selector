# D3D Audit Report (Turn 5 재감사)

## 1. Audit Scope

- **Project:** `design_sample_selector`
- **Date:** 2026-08-26
- **Mode:** 읽기 중심 재감사. 코드 수정 없음.
- **Basis:** Turn 4 `docs/multi_audit/4/final_audit_report_4.md` finding ID 유지
- **Authority:** `spec.md` v2.2.2
- **User goal:** 수정 완료 후 재검증

Turn 3 PASS는 계속 기각. 이번 턴은 Turn 4 Required Fixes를 소스에 재대조한다.

## 2. Excluded Scope

- `node_modules/`, `.git/`
- 백엔드 (Non-Goals)
- 브라우저 실클릭 전수. 호출 경로로 재현 가능한 버그는 코드로 판정.

## 3. Pass 1: Implementation Compliance (재감사)

### [IMP-F001] 24 ID 듀얼 매핑 — Verified (유지)

### [IMP-F002] 키네틱 시뮬레이터 — **Verified (해소)**

- Game 레벨업 파티클: `spawnLevelUpParticles` (`mockupRuntime.js` L624–638), 3킬마다 발동
- Blog TOC + 스크롤 진척: `data-action="blog-toc"`, `bindBlogProgress`
- Dashboard 1Y + 정렬/필터: `dash-sort` / `dash-filter`
- Media 볼륨·스펙트럼·스크럽·큐: `media-volume`, `#media-spectrum`, `handleMediaScrub`
- E-commerce 사이즈: `shop-size`
- Chat 채널: `chat-channel`
- 스플릿 8탭, HTML 복사 `#btn-copy-html`, `.archetype-unit` `backdrop-filter`

### [IMP-F003] WASM 허위 단언 — **Verified (해소, 강등)**

- spec §3.1 / §4: Canvas 2D, `.wasm` 없음
- `visualEngine.js`: `CanvasVisualEngine`, `canvasReady`
- 헤더: `CANVAS 2D: ACTIVE (60FPS)`

### [IMP-F004] 문서 버전·로드맵 — **Verified (해소)**

- spec / designs / implementation_summary / DESIGN_DECISIONS / BUILD_GUIDE / audit_roadmap / package = **2.2.2**
- `audit_roadmap.md` 8 / 24 / 16 / 14. 구 5/15/10/5 폐기
- `designs.md` 슬라이더 0–64 / 0–12 / 0–30 / 0–32 / 0–2.0

### [IMP-F005] AppState 고아 필드 — **Needs Fix (Minor, 잔여)**

- `comparePickerOpen` / `comparePickingSlot`은 spec에도 남아 있고 UI는 인라인 피커만 사용
- `bgmEnabled`는 위젯이 토글하지 않음
- spec에 `dss_bookmarks_v2` 키 미기재

### [IMP-F006] HTML 스니펫 복사 — **Verified (해소)**

`#btn-copy-html` + `refreshLiveHtmlInspector` (`viewport.innerHTML` → `textContent` 복사)

---

## 4. Pass 2: Engineering (재감사)

### [DBG-F001] 검색 헤더 파괴 — **Verified (해소)**

`headerChromeChanged`가 `searchQuery`를 제외. `patchSearchField`만 수행 (`header.js` L253–275).

### [DBG-F002] 스플릿 닫기 빈 화면 — **Verified (해소)**

- `openSplitCompare()`가 `compareReturnView` 저장 (`selection.js` L97–102)
- 헤더 비교 버튼이 `openSplitCompare()` 호출 (`header.js` L185)
- `closeCompare`: DETAIL 가능 시에만 DETAIL, 아니면 MAIN (`detailView.js` L1056–1060)

### [DBG-F003] teardown 키 — **Verified (해소)**

- `teardownHydratedViewports`가 `#mockup-viewport` / split A/B
- peek/dock는 `#peek-viewport` / `#confirm-preview`
- `activeRoots` 자손 sweep (`mockupRuntime.js` L40–46)
- 스킬 `setTimeout`이 `cleanups`에 등록 (L419–426)

### [DBG-F004] playSfx 미사용 노드 — **Verified (해소)**

osc는 `playOscSweep`/`playChimeNote` 안에서만 생성. SWIPE는 `playNoiseSweep(300, 1200, 0.06)` + filter `onended` disconnect.

### [DBG-F005] blur no-op — **Verified (해소)**

`.archetype-unit` `backdrop-filter: blur(var(--tweak-backdrop-blur))` (`interactive.css` ~L2507)

### [DBG-F006] 스플릿 media/chat 탭 — **Verified (해소)**

`detailView.js` L938–945 8탭.

### [DBG-F007] 고아 코드 — **Needs Fix (Minor, 잔여)**

남은 것: `getStyleCountLabel`, `findCategoryById`, `findCategoryBySubId`, `getAdjacentSub`, `[data-mock-count]` 애니메이터(템플릿 속성 없음), `comparePickerOpen`/`comparePickingSlot`.

### [DBG-F008] 자동화 테스트 — **Needs Fix (Minor로 강등)**

테스트 디렉터리 없음. 정적 SPA, 게이트는 Known Issue.

### [DBG-F009] alias canonicalize — **Needs Fix (Minor, 잔여)**

`VALID_SUB_IDS`는 별칭 통과, `findSubById`는 정규 ID만. 로드 시 맵핑 없음.

---

## 5. Pass 3: Security (재감사)

### [SEC-F001] 사용자 XSS — **Verified (유지)**

토스트/댓글/채팅 `textContent`.

### [SEC-F002] AudioNode disconnect — **Verified (해소)** (DBG-F004와 동일)

### [SEC-F003] 스플릿 경유 포커스 복원 — **Needs Fix (Minor, 잔여)**

DETAIL 재오픈이 `isInitialOpen`이라 `lastFocusedElement = document.activeElement`를 스플릿 컨트롤로 덮어씀 (`detailView.js` L114–115). spec §7.3 포커스 복원은 MAIN으로 나갈 때 갤러리 오프너가 아닐 수 있음.

### [SEC-F004] LocalStorage 로드 화이트리스트 — **Verified (잔여 Info)**

로드 필터는 유효. 쓰기 경로·canonicalize는 약함.

### [SEC-F005] secrets / Vite — **Verified**

### [SEC-F006] reduced-motion rAF — **Needs Fix (Minor, 잔여)**

`update()`는 물리 스킵. `startLoop`는 계속 `draw()`+rAF. spec §7.4 “strictly respect prefers-reduced-motion”.

---

## 6. Cross-Pass Conflicts

없음. WASM 강등과 보안 수용이 정렬됨.

## 7. Required Fixes Before 순수 PASS

Major 차단 항목은 해소됨. 순수 PASS를 원하면 Minor만 남음:

1. SEC-F003 스플릿→DETAIL에서 opener 덮어쓰지 않기
2. SEC-F006 reduced-motion 시 rAF 정지 또는 1프레임
3. DBG-F007 죽은 export 삭제
4. DBG-F009 스토리지 별칭 canonicalize
5. IMP-F005 미사용 상태 필드 삭제 또는 연결, spec에 `dss_bookmarks_v2`

없어도 `PASS WITH KNOWN RISKS` 가능.

## 8. Accepted Risks / Known Issues

| 항목 | 처리 |
| --- | --- |
| 자동화 테스트 없음 | Known Issue. 정적 갤러리, CI 없음 |
| 카탈로그 `innerHTML` | first-party freeze |
| CSP 없음 | spec MUST 아님 |
| 경로명 `src/wasm/` | 역사적 경로, 엔진은 Canvas 2D |
| Mood 칩 없음 | 장르 칩 + 검색이 `moodTags` 매칭. spec “Genre & Moods”는 이 수준으로 해석 |

## 9. Needs Spec Clarification

- `comparePickerOpen` / `comparePickingSlot` / `bgmEnabled`를 살릴지 삭제할지 (코드·spec에 같이 남아 있으나 UI 미연결)

## 10. Re-audit Checklist (Turn 4 대비)

- [x] DBG-F001 검색 포커스
- [x] DBG-F002 스플릿 원 뷰 복귀
- [x] DBG-F003 teardown 동일 루트
- [x] DBG-F004 SFX 미사용 노드 0
- [x] IMP-F003 WASM 강등
- [x] IMP-F004 문서 2.2.2 / 로드맵 8·24·16·14
- [x] IMP-F002 시뮬레이터 1:1
- [x] IMP-F006 HTML 복사
- [ ] SEC-F003 포커스 복원
- [ ] SEC-F006 reduced-motion rAF
- [ ] DBG-F007 / F009 고아·별칭

## 11. Final Decision

**PASS WITH KNOWN RISKS**

Turn 4의 게이트 차단 Major(검색 파괴, 빈 화면, teardown miss, SFX 누수, 가짜 WASM, 문서/로드맵 붕괴, 시뮬레이터 공백)는 코드·문서에서 해소된 것으로 판정한다.

남은 것은 Minor(포커스 덮어쓰기, reduced-motion rAF, 죽은 export, 별칭 canonicalize, 테스트 부재)다. 배포 가능. 순수 PASS는 §7 잔여를 닫은 뒤.

Turn 4 `REWORK REQUIRED`는 이 재감사로 해제한다.
