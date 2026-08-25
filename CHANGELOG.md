# Changelog (`CHANGELOG.md`)

All notable changes to the `design_sample_selector` project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
