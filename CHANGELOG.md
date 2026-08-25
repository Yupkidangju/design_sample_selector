# Changelog (`CHANGELOG.md`)

All notable changes to the `design_sample_selector` project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
## [2.2.2] - 2026-08-25

### Fixed & Enhanced
- **스플릿 경유 포커스 복원 (SEC-F003):** DETAIL을 스플릿에서 다시 열 때 갤러리 opener(`lastFocusedElement`)를 스플릿 컨트롤로 덮어쓰지 않는다.
- **reduced-motion 캔버스 루프 (SEC-F006):** `prefers-reduced-motion`이면 rAF를 돌리지 않고 한 프레임만 `draw()`한다.
- **고아 코드 정리 (DBG-F007):** 미사용 export·`[data-mock-count]` 애니메이터·`comparePickerOpen`/`comparePickingSlot` 제거.
- **스토리지 별칭 canonicalize (DBG-F009):** 북마크/확정/최근 본 ID를 로드·쓰기 시 정규 카탈로그 ID로 정규화한다.
- **상태 계약 정리 (IMP-F005):** spec에 `dss_bookmarks_v2`를 기입하고 미사용 `bgmEnabled`를 제거한다.
- **검색 입력 포커스 유지 (DBG-F001):** `searchQuery`만 바뀔 때 헤더 전체를 `innerHTML`로 재조립하지 않고 입력란·지우기 버튼만 패치한다.
- **스플릿 비교 닫기 복귀 (DBG-F002):** `compareReturnView`에 연 화면(MAIN/DETAIL)을 기억하고 ✕/Esc 시 그곳으로 돌아간다.
- **목업 teardown 키 일치 (DBG-F003):** `hydrateMockup`한 뷰포트 노드에 `teardownMockup`을 호출하고 자손 활성 루트도 정리한다.
- **SFX 미사용 Oscillator 제거 (DBG-F004):** 차임 분기는 `playChimeNote`만 사용하고, SWIPE는 필터드 노이즈 스윕으로 spec §6.2와 맞춘다.
- **그래픽 엔진 계약 강등 (IMP-F003):** WebAssembly를 구현하지 않는다. 문서는 Canvas 2D, 헤더 배지는 `CANVAS 2D`다.
- **키네틱 시뮬레이터 공백 메움 (IMP-F002):** 레벨업 파티클, 블로그 목차/스크롤 진척, 대시보드 정렬·필터, 쇼핑몰 사이즈, 미디어 볼륨·스펙트럼, 채팅 채널 스위처, 스플릿 media/chat 탭, HTML 복사, `.archetype-unit` 블러 슬라이더.
- **모달 레이아웃 및 2열 독립 스크롤 최적화:** 좌측 샌드박스 뷰포트와 우측 사이드바 인스펙터가 각각 독립적으로 스크롤되도록 `min-height: 0` 및 뷰포트 스크롤러를 개선하여 모달 하단 영역이 잘리던 현상 완전 해소.
- **파라미터 튜너 실시간 강제 상속 연동:** 슬라이더 조작 시 `--theme-radius`, `--theme-border-width`, `--theme-shadow`를 원자적으로 주입하여 아키타입 내부 모든 카드/컨테이너/버튼 요소에 모서리 둥글기 및 테두리 두께가 즉시 반영되도록 수정.
- **튜너 슬라이더 범위 확장:** 모서리 둥글기(`Border Radius`: 0~64px) 및 테두리 두께(`Border Width`: 0~12px) 조절 범위 확장.
- **뷰포트 배율(Zoom/Scale) 컨트롤 추가:** 80%, 100%, 120% 배율 전환 기능 추가.
- **스타일 기본값 리셋 사운드 및 피드백 강화:** `↺ 기본값 리셋` 버튼 클릭 시 `SUCCESS` 사운드 및 즉각 파라미터 복원 제공.

## [2.2.1] - 2026-08-25

### Fixed
- **서브스타일 ID 매핑 동기화 및 듀얼 셀렉터 지원 (FIN-F009):** `src/styles/themeTokens.css`의 24개 테마 셀렉터에 `categories.js` 데이터셋의 24개 실존 ID와 서술형 사양 ID를 듀얼 셀렉터(`[data-theme="..."], [data-theme="..."]`)로 100% 매핑하여 모든 24종 서브스타일에 전용 CSS 커스텀 프로퍼티가 정상 주입되도록 수정.
- **상태 관리자 스토리지 복원 화이트리스트 확장:** `src/state/appState.js` 내 `VALID_SUB_IDS`에 24개 데이터셋 ID 및 별칭을 모두 등록하여 LocalStorage 북마크/최근 본 목록 복원 시 유효 데이터 탈락 방지.

## [2.2.0] - 2026-08-25

### Added
- **8대 코어 화면 아키타입(Archetypes) 지원:** 게임화면(Game HUD), 웹 SaaS(Web), 모바일 앱(Mobile), 쇼핑몰(E-Commerce), 블로그(Blog), 대시보드(Dashboard), 미디어 플레이어(Media), 채팅(Chat) 등 8대 대표 화면 레이아웃 제공.
- **공통 템플릿 기반 Zero-Rebuild 동적 테마 주입 엔진:** 동일한 화면 구조에서 DOM 파괴 없이 `[data-theme]` 및 CSS Custom Properties 원자적 스왑을 통해 24개 전체 테마를 즉시 교체하며, 장바구니/게임 점수 등 인터랙션 상태를 완벽히 보존.
- **상단 Universal Quick Design Selector Bar:** 상세 모달 상단에 8개 대분류 탭과 24개 서브스타일 썸네일 칩 리스트를 배치하여 창이 열린 상태에서 24개 전체 디자인을 즉시 전환 및 비교 가능 (단축키 `[` / `]`, `Shift + Left/Right` 지원).
- **실감 나는 키네틱 인터랙션 시뮬레이터:**
  - Game: 타겟 터치 미니게임, 체력/마나 게이지, 스킬 쿨다운, 콤보 카운터.
  - E-Commerce: 컬러/사이즈 옵션 선택, 수량 조절, 장바구니 담기, 슬라이드아웃 카트 드로어, 주문/결제 모달 시뮬레이션.
  - Blog: 스크롤 읽기 진척도 바, 목차 연동, 좋아요/박수 파티클 카운터, 실시간 댓글 작성, 다크/라이트 읽기 모드.
  - Mobile: 상단 상태바, 피드 카드, 알림 스와이프 토글, 하단 4탭 네비게이션.
  - Dashboard: 기간 필터(1D/1W/1M), KPI 지표 애니메이션, 데이터 테이블 정렬/필터.
- **6종 신규 절차적 Web Audio SFX:** `THEME_SWAP`, `COIN`, `CART_ADD`, `SUCCESS`, `LIKE`, `SWIPE` 사운드 추가.

### Fixed & Hardened
- **XSS 취약점 제거 (FIN-F005):** `src/utils/clipboard.js` 내 `showToast` 함수의 `innerHTML` 템플릿 리터럴 주입을 `textContent` 및 `createElement` 노드 조립으로 안전하게 리팩토링.
- **WAI-ARIA 접근성 및 포커스 트랩 보완 (FIN-F006):** 상세/스플릿 모달에 Tab 포커스 트랩 적용, 모달 닫힘 시 직전 포커스 복원, 스플릿 비교 뷰 `Escape` 키 닫기 이벤트 핸들러 추가, 탭 네비게이션 `role="tab"` / `aria-selected` 속성 완비.
- **Web Audio Node 누수 방지 (FIN-F007):** 모든 Oscillator/Gain/Filter 노드에 `onended` 이벤트 핸들러를 등록하여 사운드 재생 종료 시 자동으로 `.disconnect()` 처리.
- **Canvas 2D 렌더링 최적화 (FIN-F008):** `prefers-reduced-motion` 준수 및 모달 오버레이 오픈 시 캔버스 애니메이션 루프 일시정지(`pauseLoop` / `resumeLoop`)를 통해 CPU/GPU 부하 절감.

## [2.1.0] - 2026-08-25

### Added
- **스타일 고유 썸네일:** Grid / Bento / Spectrum 카드에 사조별 기하·모티프 미리보기와 시그니처 모션을 추가해 같은 분류 안에서도 구분이 되도록 함.
- **선택 도크 & 확정 시트:** 클릭은 초안 담기, 더블클릭/Enter는 디테일. 하단 도크에서 자세히 보기·비교·북마크·확정이 가능하고 확정 스타일은 LocalStorage에 유지됨.
- **호버 피크:** 갤러리 타일 호버/포커스 시 라이브 히어로 미니 샌드박스.
- **키보드 내비:** `/` 검색, 화살표 이동, Enter 열기, Space 비교 슬롯, Esc 닫기. 디테일에서 ← → 로 같은 분류 순환.
- **목업 런타임:** `alert()` 제거. 내부 토스트, 카운트업, 글리치/펀치/스쿼시 등 스타일별 동적 효과. Glow 슬라이더 실제 연결.
- **스플릿 비교 비주얼 피커:** 드롭다운 아래 썸네일 스트립으로 A/B 선택.

### Changed
- 카테고리 마스터 카드가 분류별 배경 모티프를 갖고, 카드 전체 클릭으로 첫 서브를 열지 않음.

## [2.0.0] - 2026-08-14

### Added
- **8 Major Categories & 24 Subcategories**: Added Y2K Chrome & Hologram, Frutiger Aero Aqua Gloss, 8-Bit Pixel Arcade, Kinetic Typography & Motion, Bento UI 2.0 Precision Grid, Acid Graphics & Techno Rave, Claymorphism 3D Bubble, Handcrafted & Collage Indie, and Solarpunk Eco-Futurism.
- **3-Mode Interactive Gallery UX**: Standard Grid Mode, Asymmetric Bento Grid Mode, and Chronological Spectrum Stream Mode with instant view switcher.
- **Real-time Search & Multi-Tag Taxonomy**: Live instant keyword search input with clear button and 8-genre tag navigation.
- **LocalStorage Bookmarks System**: Ability to bookmark/save favorite design styles with quick bookmark filter view.
- **4-Component Live Sandbox**: Each style now features 4 live component preview tabs (`Hero Landing`, `Dashboard & Widget Cards`, `Form & Inputs Controls`, `Pricing & Feature Cards`).
- **Live Parameter Tweak Sandbox**: Real-time CSS custom property sliders for `Radius`, `Border Width`, `Shadow Depth`, and `Backdrop Blur`.
- **Live CSS Code Inspector**: Real-time generated CSS snippet viewer with one-click clipboard copy.
- **Side-by-Side Dual Split Comparison Sandbox**: Interactive split view modal to compare any two design styles side by side.
- **16-Track Procedural Web Audio Synth**: Expanded ambient BGM synthesizer to 16 distinct genre-matching tracks and new UI sound effects.
- **Audio-Reactive WASM Canvas Visualizer**: Background canvas particle engine now pulses and modulates with BGM audio frequency energy.
- **Vite Dev Server & npm Scripts**: Added `package.json` with `npm run dev` (Vite) and `npm run build` support for fast local development and instant HMR.

## [1.0.1] - 2026-08-02

### Fixed
- Fixed black screen issue on live mockup sandbox previews.
- Added explicit HTML sandbox mockup templates (`renderMockupSandboxHTML`) and CSS styles for all 15 preview types (`corporate`, `minimalism`, `skeuomorphism`, `memphis`, `vaporwave`, `organic`, `darkmode`, etc.).
- Verified crisp rendering, color contrasts, and interactive button alerts across all 15 subcategory design previews.

## [1.0.0] - 2026-08-02

### Added
- Created standard reference implementation documentation set (`spec.md`, `designs.md`, `implementation_summary.md`, `DESIGN_DECISIONS.md`, `BUILD_GUIDE.md`, `audit_roadmap.md`, `CHANGELOG.md`).
- Master data definition for 5 Main Design Genres and 15 Subcategory Styles with color palettes, characteristics, pros, and cons.
- Web Audio API procedural synthesis engine specifications for 10 ambient BGM tracks and 5 UI sound effects.
- WebAssembly (WASM) canvas visual rendering engine architecture.
- Fullscreen interactive detail showcase modal specifications with live HTML/CSS style mockups and click-to-copy color palette functionality.
