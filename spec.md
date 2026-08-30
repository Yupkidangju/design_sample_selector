# Master Specification (`spec.md`)
**Project Name:** Web Design Sample Selector (`design_sample_selector`)  
**Version:** 2.3.0  
**Environment:** Client-side Pure Web (HTML5 / CSS3 / JavaScript ES2022 / Canvas 2D / Web Audio API)  
**Document Status:** Current v2.3.0 Runtime Contract / Unreleased Actual 120 Complete

---

## 1. Document Control & Operating Rules

1. This specification is the authoritative master contract for the `design_sample_selector` web application v2.3.0.
2. All data types, audio parameters, category definitions, visual layout rules, and component state trees specified herein are frozen for implementation.
3. No speculative or open-ended placeholder terms ("later", "optional", "as needed") are permitted; all interfaces and values are explicitly defined.
4. Any architectural change requested by the user must update this specification first or within the same work unit.

### 1.1 Approved Expansion Initiative

The user approved the `scalable-style-library` initiative on 2026-08-30. Its accepted capability boundaries and dependency order are defined in `CAPABILITY_MAP.md`; module contracts are specified in dependency order as `SPEC-<module-id>.md`.

The current unreleased baseline is 8 categories and exactly 120 styles: 24 compatibility-preserved `legacy` records and 96 source-grounded `ready` records. Wave 0의 `style-contract`, `catalog-validation`, `theme-generation`, `preview-registry`, Wave 1 24→36 확장, `catalog-discovery`, `render-scalability`, actual-120 확장은 모두 구현·검증을 완료했다. 데이터 오류와 두 생성 테마 CSS의 stale 상태는 `prebuild`에서 차단되며 renderer/thumbnail/motion inventory는 `120/120/120/0`이다. 탐색은 검색·category·bookmark·10개 facet·정렬·URL 복원·시대 기반 Spectrum과 4페이지 전체 도달성을 제공한다. 렌더 계층은 gallery 36개, Detail 24개, Split 슬롯당 12개의 시각 DOM 상한을 유지하고 신규 84종의 상세 테마·문법 CSS는 component 경계에서 지연 로드한다. 정확한 신규 명단과 출처는 `SPEC-catalog-expansion-120.md`가 소유한다.

---

## 2. Project Vision & Identity

`design_sample_selector` is an ultra-modern, high-performance web-native interactive gallery and design system playground. Built purely with standard HTML5, modern CSS3, ES2022 JavaScript, HTML5 Canvas 2D, and the Web Audio API, it serves as a comprehensive educational and inspirational hub for visual designers and web developers worldwide.

In v2.3.0, the application upgrades the inspector into a **Dynamic 4-Tab Reactive Inspector & Design Spec Generator (`[Live CSS]`, `[Live HTML]`, `[Live designs.md]`, `[Design Tokens JSON]`)** with frame-coalesced `requestAnimationFrame` synchronization, 3-level CSS granularity toggles (Full Bundle / Tokens Only / Component Only), individual client-side file export (`.css`, `.html`, `.md`, `.json`), and an integrated text snapshot export.

---

## 3. Goals & Non-Goals

### 3.1 Goals
- **8 Major Categories & 120 Distinct Sub-Styles:** 카테고리별 15종으로 균형을 맞추고 역사적 모더니즘, 인쇄·언더그라운드, 레트로·에디토리얼, Y2K 웹, 데이터·공간형 UI, 소프트 3D까지 21개 시각 문법을 포괄한다.
- **8 Core Page Archetypes with Shared Template & Dynamic Theme Injection:**
  1. `Game HUD & Arena (`game`)`: Mini target clicker/reflex game, combo counter, HP/MP bars, skill cooldowns, level-up particles.
  2. `Web SaaS & Landing (`web`)`: Hero headline, CTA buttons, integrated 4-component preview (Hero, Widget, Form, Pricing).
  3. `Mobile App Screen (`mobile`)`: Mobile frame, header, notification card swipe/toggle, feed cards, bottom 4-tab bar.
  4. `E-Commerce Storefront (`ecommerce`)`: Product options (color/size), quantity stepper, add-to-cart, slide-out drawer, instant checkout simulation modal.
  5. `Magazine & Blog Article (`blog`)`: Scroll reading progress bar, table of contents, like/applause counter, live comment posting (`textContent`), dark/light reading mode.
  6. `Analytics Dashboard (`dashboard`)`: Period filter tabs (1D/1W/1M/1Y), animated metric cards, interactive sortable/filterable data table.
  7. `Media Player (`media`)`: Track playback controls, progress scrub bar, playlist queue, volume slider, spectrum visualizer.
  8. `Messenger & Chat (`chat`)`: Channel switcher, real-time message bubble stream, emoji reactions, message input simulation.
- **Dynamic 4-Tab Reactive Inspector & Design Spec Engine:**
  - `[ 💻 Live CSS ]`: 100% matched CSS generation reflecting current `--theme-*` tokens, `--tweak-*` live slider variables, color palette, and active archetype CSS rules. Sub-mode switchable: `Full Bundle`, `Tokens Only`, `Component CSS`.
  - `[ 📄 Live HTML ]`: Real-time rendered DOM markup of the active archetype sandbox viewport.
  - `[ 📋 Live designs.md ]`: Real-time generated Markdown design specification according to D3D standard (Metadata, Palette Table, Live Tweaks, Font Stack, Archetype ASCII Diagram, Kinetic Rules, Characteristics, Pros/Cons, Integration Guide).
  - `[ 🏷️ Design Tokens (JSON) ]`: DTCG Format/Color Module 2025.10 형식의 JSON export. Colors and gradients, dimensions, shadows, and font families use the structured value shapes defined by that report; product metadata uses `$extensions`. 해당 보고서는 JSON Schema를 제공하지 않으므로 존재하지 않는 `$schema` 속성을 출력하지 않는다.
  - **Export & Action Toolbar:** One-click Copy (with SFX + Toast), individual file download (`.css`, `.html`, `.md`, `.json`), and a `*-integrated-snapshot.txt` review artifact containing four clearly delimited sections. The text snapshot is not a ZIP or directly extractable multi-file package.
  - **rAF Update Pipeline:** Continuous slider input is coalesced to animation frames. All inspector, copy, and download paths resolve the current `selectedSubCategory`, archetype, device, and live tweaks at event time; no fixed frame-rate or zero-latency guarantee is made.
- **Universal Top Design Selector Bar:**
  - Pinned modal top bar with 8 major category tabs and up to 24 visual chips from the active category; categories above the limit expose local search while every style remains reachable.
  - Real-time zero-rebuild theme switching without destroying interactive state (e.g. cart items, game scores preserved).
  - Keyboard navigation (`[` / `]`, `Shift + Left/Right`, `ArrowLeft` / `ArrowRight`).
- **Interactive Multi-Mode Main Gallery:** 
  - 3 View Modes: Standard Grid View, Dynamic Bento Grid View, Spectrum Stream View.
  - Real-time Instant Search & Multi-Tag Taxonomy Filters (Genre & Moods).
  - Bookmark / Favorites persistence via LocalStorage.
  - Selection Dock with Draft Style Staging and Confirm Sheet.
  - Side-by-Side Dual Style Split Comparison Mode with full visual picker and all 8 archetype tabs. Closing (✕ / Esc) returns to the view that opened compare (`MAIN` or `DETAIL`).
  - Interactive sliders: `Border Radius` (0~64px), `Border Width` (0~12px), `Shadow Depth` (0~30px), `Backdrop Blur` (0~32px), `Glow Intensity` (0~2.0).
  - Instant style reset button (`↺ 기본값 리셋`) with audio feedback.
  - Multi-scale Viewport Zoom Switcher (80%, 100%, 120%) with centered transformation.
  - Dual independent scrolling layout: Left sandbox viewport and right parameter inspector scroll separately without modal overflow clipping.
- **Web Audio Procedural Synthesizer & Sound FX (16 Tracks + 14 SFX):**
  - 16 custom atmospheric procedural BGM tracks tailored to each design mood.
  - 14 synthesized UI Sound FX: `HOVER`, `CLICK`, `REVEAL`, `COPY`, `BOOKMARK`, `COMPARE`, `CONFIRM`, `CLOSE`, `THEME_SWAP`, `COIN`, `CART_ADD`, `SUCCESS`, `LIKE`, `SWIPE`.
  - Strict node lifecycle management (`osc.onended` automatic `disconnect()`).
- **Canvas 2D Particle Engine:**
  - JavaScript Canvas 2D particle physics and audio-reactive spectrum visualization. No WebAssembly module is shipped.
  - `prefers-reduced-motion` compliance and modal overlay background pause (`pauseLoop` / `resumeLoop`).
- **Security & Accessibility Hardening:**
  - XSS-safe DOM node assembly (`textContent` & `document.createElement`).
  - WAI-ARIA modal focus trap, `role="tab"` / `aria-selected` attributes, ESC key handling.

### 3.2 Non-Goals
- Server-side backend databases or user authentication (pure client-side static web application).
- External video streaming or heavy MP3 asset downloads.
- Third-party bloated CSS frameworks (TailwindCSS/Bootstrap excluded in favor of standard Vanilla CSS design tokens).

---

## 4. Frozen Core Architectural Decisions

| Decision Area | Selected Technology | Rationale & Constraint |
| --- | --- | --- |
| **UI Framework** | Vanilla HTML5 + CSS3 + Modular ES6 JS | Zero build tool requirement for runtime; lightweight, ultra-fast initial load (< 40ms) |
| **Theme Injection** | Generated static CSS Custom Properties + `[data-theme]` | `StyleRecord.tokens`에서 결정론적으로 생성·추적하고 prebuild에서 stale을 검사한다. Zero-rebuild atomic swap으로 DOM과 런타임 상태를 보존한다. |
| **Style Catalog Contract** | Versioned frozen ES modules in `src/catalog/` | 8개 pack manifest의 actual 120 정규 ID·분류·13개 토큰·프리뷰 참조를 단일 조회 경계로 제공하고 기존 36종 UI·저장·출력 계약은 subset fixture로 보존 |
| **Preview Dispatch** | Static immutable registry in `src/preview/` | renderer·thumbnail·motion definition에서 120/120/120/0 inventory를 파생하고 조회와 실제 렌더 실패를 분리하며 무음 스타일 fallback을 금지 |
| **Render Scalability** | Bounded visual windows + literal dynamic imports | Gallery 36, Detail 24, Split 12/slot 상한과 전체 native option을 유지하고 expansion component/theme/CSS를 최초 사용 때 불러오며 actual 120 Chrome 게이트로 회귀를 차단 |
| **Archetype Engine** | 8 Standard Semantic HTML Templates | Shared structural DOM with decoupled thematic styling tokens |
| **Visual Graphics Engine** | HTML5 Canvas 2D | Real-time JS particle physics, audio-reactive spectrum, modal pause. Not WebAssembly. |
| **Audio Engine** | Web Audio API Polyphonic Synth + SFX | Zero external asset dependency; precise node disconnection lifecycle on end |
| **Design System** | CSS Custom Properties (Variables) | Dynamic theme switching, live slider variable binding, subcategory styling encapsulation |
| **Typography** | Google Fonts (Inter, Space Grotesk, Cinzel, Fira Code) | Maximum legibility and authentic period representation |

---

## 5. System Architecture & Component Contracts

### 5.1 System State Tree Type Definition

```typescript
export type PageArchetype = 'game' | 'web' | 'mobile' | 'ecommerce' | 'blog' | 'dashboard' | 'media' | 'chat';

export interface AppState {
  currentView: 'MAIN' | 'DETAIL' | 'SPLIT_COMPARE';
  compareReturnView: 'MAIN' | 'DETAIL';
  viewMode: 'GRID' | 'BENTO' | 'SPECTRUM';
  activeFilter: string; // 'ALL' or category ID
  searchQuery: string;
  activeFacets: Record<string, string[]>; // normalized facet id -> selected value IDs
  sortMode: 'catalog' | 'name-asc' | 'era-asc' | 'era-desc';
  selectedMainCategory: string | null;
  selectedSubCategory: string | null;
  activeArchetype: PageArchetype; // 'game' | 'web' | 'mobile' | 'ecommerce' | 'blog' | 'dashboard' | 'media' | 'chat'
  activeComponentTab: 'hero' | 'widget' | 'form' | 'pricing'; // Legacy/Web archetype sub-tab
  sandboxDevice: 'desktop' | 'mobile';
  compareSubIds: [string, string]; // IDs for split comparison
  bookmarks: string[]; // Canonical subcategory IDs. LocalStorage `dss_bookmarks_v2` (aliases rewritten to catalog IDs on load)
  bookmarkFilterActive: boolean;
  galleryFocusId: string | null;
  draftSubId: string | null;
  confirmedStyleId: string | null; // LocalStorage `dss_confirmed_v21`
  peekSubId: string | null;
  confirmSheetOpen: boolean;
  recentlyViewed: string[]; // max 6, LocalStorage `dss_recent_v21` (aliases canonicalized on load)
  liveTweaks: {
    borderRadius: number;
    borderWidth: number;
    shadowDepth: number;
    backdropBlur: number;
    glowIntensity: number;
  };
  audio: AudioState;
  canvasReady: boolean;
  viewport: 'DESKTOP' | 'TABLET' | 'MOBILE';
}

export interface AudioState {
  sfxEnabled: boolean;
  isPlaying: boolean;
  currentTrackIndex: number;
  volume: number; // 0.0 to 1.0
  trackTitle: string;
}

export interface ColorToken {
  name: string;
  hex: string;
  usage: string;
}

export interface SubCategoryDesign {
  id: string;
  name: string;
  nameEn: string;
  shortDesc: string;
  previewType: string;
  motionProfile: string;
  thumbMotif?: string;
  moodTags: string[];
  characteristics: string[];
  pros: string[];
  cons: string[];
  palette: ColorToken[];
  defaultTweaks: {
    borderRadius: number;
    borderWidth: number;
    shadowDepth: number;
    backdropBlur: number;
    glowIntensity: number;
  };
}

export interface MainCategory {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  icon: string;
  accentColor: string;
  tags: string[];
  subCategories: SubCategoryDesign[];
}
```

### 5.2 Inspector State and Export Invariants

1. `appState.selectedSubCategory` is the single source of truth for the current design. Event listeners MUST resolve the selected design when the event occurs and MUST NOT retain a mutable `SubCategoryDesign` in a long-lived closure.
2. Every DETAIL modal entry initializes the inspector to `Live CSS` and CSS mode `Full Bundle`; rendered active classes, `aria-selected`, visible pane, submode navigation, and download label MUST describe that same state.
3. Generated component CSS selectors MUST exist in the corresponding output of `getArchetypeHTML()`. The 8-archetype selector contract is enforced by `tests/designSpecGenerator.test.js`.
4. DTCG output targets the final Community Group Report `2025.10`. CSS `linear-gradient(...)` values become DTCG gradient stop arrays; `transparent` and `rgba(...)` become structured sRGB values with alpha; multi-layer CSS shadows become DTCG shadow arrays. CSS `box-shadow: none` is normalized to a transparent zero-offset, zero-blur shadow object instead of an invalid string value.
5. The detail sandbox device switcher MUST render distinct viewport sizes without rebuilding the active archetype: Desktop permits the standard preview width (up to `860px`), while Mobile constrains both current `.archetype-unit` and legacy `.mockup-unit` roots to a `380px` phone frame and applies mode-scoped compact layouts independently of the browser window width.

### 5.3 Style Catalog Contract

1. `src/catalog/index.js` is the only canonical query entrypoint. It exposes the catalog 조회 API와 `catalog-discovery`의 search/facet/sort/era query API를 함께 제공하며, 소비자는 pack 파일을 직접 조회하지 않는다.
2. 공개 catalog는 schema version `1` 정규 레코드 정확히 120개다. Core pack은 기존 24 `legacy` + Wave 1 12 `ready`를, expansion 7개 pack은 각각 12개의 `ready` 레코드를 소유한다. 각 레코드는 classification, 13개 의미 테마 토큰, 선택적 `themeEffects`, renderer/thumbnail/motion 참조, 편집 정보, 출처와 alias를 갖는다.
3. Public records, nested values, and returned arrays are recursively frozen. Ordering is numeric `order`, then canonical ID.
4. Default queries expose `legacy` and `ready`; `draft` and `review` require `{ includeUnpublished: true }`. Unknown or non-string external IDs return `null` or an empty array and MUST NOT fall back to Swiss.
5. `src/data/categories.js` is a Wave 0 compatibility entrypoint. It preserves `MAIN_CATEGORIES`, `STYLE_MOTION`, `SUB_ID_ALIASES`, `getAllSubDesigns`, `findSubById`, and `canonicalizeSubId` while projecting data from the canonical catalog.
6. Runtime CSS와 export-token은 `src/theme/`이 정규 레코드에서 투영한다. `src/catalog/`은 theme 또는 UI를 역으로 import하지 않는다.

### 5.4 Theme Generation Contract

1. 스타일별 13개 값의 유일한 작성 원천은 `StyleRecord.tokens`다. `THEME_TOKEN_CSS_PROPERTIES`가 의미 키를 CSS custom property에 일대일로 매핑하고, `ROOT_THEME_TOKENS`는 개별 스타일이 아닌 fallback만 소유한다.
2. `getThemeDefinitions()`는 모든 출판 상태를 명시적 순서로 재귀 동결해 반환한다. `getThemeDefinitionById()`는 canonical과 alias를 해석하고 알 수 없는 값에는 `null`을 반환하며 Swiss로 대체하지 않는다.
3. 선택적 컨테이너 효과 `themeEffects.backdropBlur`는 `defaultTweaks.backdropBlur`와 독립적이다. 현재 기준 효과는 glass `20px`, Frutiger `14px`, Bento `16px`다.
4. `src/styles/themeTokens.css`는 기존 36종 initial 테마, `themeTokensExpansion.css`는 신규 84종 async 테마다. 두 파일 모두 결정론적 생성·추적 산출물이며 사람이 직접 편집하지 않고 `generate:themes`만 쓰며 `check:themes`와 `prebuild`는 읽기 전용으로 둘의 stale을 차단한다.
5. `designSpecGenerator.js`는 파생된 `THEME_TOKENS_MAP`과 theme 조회 API를 소비한다. 기존 24·36 subset의 runtime/export 지문을 유지하고 actual 120 전체 fixture를 별도로 고정하며, null/unknown에는 기존 미선택 산출물을 반환한다.
6. Node 파일 시스템 코드는 `scripts/generateThemeStyles.js`에만 있고 브라우저 import 그래프에 들어가지 않는다.

### 5.5 Preview Registry Contract

1. `src/preview/index.js`는 `PREVIEW_COMPONENT_TABS`, `PREVIEW_REFERENCE_KINDS`, `PreviewRegistryError`, `getPreviewReferenceInventory`, `hasPreviewReference`, `getPreviewRendererCapability`, `getPreviewMotionDefinition`, `renderPreviewComponent`, `renderPreviewThumbnail`의 9개 공개 export만 제공한다.
2. 기존 definition, Wave 1 definition, expansion definition은 초기화 시 불변 registry로 조립된다. 파생 inventory는 정규 renderer/thumbnail/motion ID `120/120/120`과 asset path 0개이며 renderer 별칭은 포함하지 않는다.
3. 기능 조회는 unknown/non-string에 `false` 또는 `null`을 반환한다. 실제 component/thumbnail render와 motion hydration은 미등록 참조, 미지원 탭, 잘못된 definition/출력에 안정 진단 필드를 가진 `PreviewRegistryError`를 사용한다.
4. thumbnail은 `StyleRecord.preview.thumbnailId`로 직접 디스패치하고 상위 버튼 안에 삽입되므로 내부 interactive element를 포함하지 않는다. `getMockupHTML()`은 기존 위치 인자를 보존하는 얇은 호환 진입점이며 기존 24·36 subset 지문과 actual 120 전체 지문을 함께 검증한다. 새 UI는 공개 옵션 API를 직접 사용한다.
5. motion descriptor는 unit/effect class, reduced-motion 정책과 실제 구현 channel을 기술한다. `metadata-only`를 구현된 시각 효과로 취급하지 않으며 runtime과 CSS는 effect layer, off-screen thumbnail pause와 `prefers-reduced-motion` 억제를 유지한다.
6. 기존 `src/preview/index.js` 동기 공개 API와 정적 registry 조립 계약은 호환 목적으로 유지한다. 초기 UI 내부 소비자는 `thumbnailEntry.js`·`motionEntry.js`를 정적으로 사용하고 `componentEntry.js`는 `render-scalability` loader가 최초 상세 component 요청 때 literal dynamic import로 불러온다. runtime registration, remote/user HTML은 제공하지 않는다.

### 5.6 Catalog Discovery Contract

1. `src/catalog/discovery.js`는 canonical `StyleRecord`를 대상으로 한국어·영어 검색 문서, category/bookmark, 10개 facet, 네 정렬과 시대 그룹을 결정론적으로 계산하며 DOM이나 전역 app state를 import하지 않는다.
2. facet 조합은 서로 다른 facet 사이 AND, `multiple` facet 내부 OR이고 `single` facet은 하나만 유지한다. unknown facet/value/category는 제거하며 다른 스타일로 대체하지 않는다.
3. `src/catalog/discoveryUrl.js`는 `q`, `category`, 반복 `f=facet:value`, `sort`, `view`, `saved`를 안정 순서로 parse/serialize한다. 기본값은 생략하고 search는 최대 120자로 제한한다.
4. 브라우저 adapter는 initial URL과 `popstate`를 app state에 적용하고 상태 변경은 `history.replaceState`로 반영하여 검색 타이핑이 history entry를 누적하지 않게 한다.
5. Grid/Bento/Spectrum은 같은 canonical result set을 소비한다. Grid는 category grouping, Bento는 전역 sort, Spectrum은 `classification.era.start` 기반 시대 grouping을 사용한다.
6. 탐색 UI는 동적 결과 수의 polite live status, native label/legend/input, 제거 가능한 활성 조건, 명확한 empty/reset 상태와 모바일 최소 44px target을 제공한다.

### 5.7 Render Scalability Contract

1. `src/scalability/renderWindow.js`의 순수·불변 window와 bounded picker가 시각 결과 상한을 결정한다. Gallery는 최대 36개, 현재 Detail category는 최대 24개, Split은 슬롯당 최대 12개의 thumbnail DOM만 만든다.
2. Gallery 페이지는 URL에 저장하지 않는 local 표현 상태다. 검색·필터·정렬·보기 결과가 바뀌면 첫 페이지로 돌아가며 actual 120의 기본 결과는 `36/36/36/12` 네 페이지로 제공한다. 한 페이지 이하 결과에서는 페이지 제어를 만들지 않는다.
3. Detail category가 24개를 넘으면 category 내부 검색을 제공한다. Split의 native select는 전체 스타일을 계속 제공하고 각 visual picker의 검색·선택 고정·polite status는 URL과 전역 검색 상태를 변경하지 않는다.
4. Detail/Split view와 Peek/확정 component renderer는 중앙 retryable loader를 사용한다. 로딩은 `aria-busy`, 실패는 설명·취소·재시도 동작을 제공하며 stale 요청은 현재 state와 request token을 다시 확인한다.
5. 브라우저 module map은 같은 URL의 실패를 기억하므로 component loader는 동일 public renderer를 가리키는 primary/retry facade 두 개를 순서대로 사용한다. 성공한 Promise는 공유하고 reset은 첫 importer로 되돌린다.
6. thumbnail motion observer는 render 교체와 unmount 때 정리한다. offscreen과 `prefers-reduced-motion: reduce`에서는 animation을 실행하지 않으며 detached observed node는 0이어야 한다.
7. 초기 동기 번들 예산은 JS gzip 88.98kB 이하, CSS gzip 33.00kB 이하이고 local Chrome hard gate는 LCP 2,500ms 이하, CLS 0.1 이하, 5회 interaction 중앙값 120ms 이하·최댓값 200ms 이하다.
8. 첫 UI는 정상 레이아웃에서 숨겨 구성하고 `document.fonts.ready` 뒤 노출해 원격 웹 폰트 교체의 layout shift를 방지한다. 폰트 요청이 실패하면 시스템 폴백으로 계속 표시한다.

---

## 6. Procedural Audio Engine Contract

### 6.1 BGM Tracks (16 Presets)
16 Procedural Chillwave/Ambient progressions scheduled via Web Audio API lookahead scheduler.

### 6.2 Synthesized UI SFX (14 Presets)
- `HOVER`: Soft high-frequency sine pitch sweep (580Hz -> 880Hz, 35ms)
- `CLICK`: Tactile low-frequency triangle tick (440Hz -> 220Hz, 30ms)
- `REVEAL`: Dual chime chord (C5 523Hz + E5 659Hz)
- `COPY`: Crystal high bell ping (A5 880Hz + E6 1318Hz)
- `BOOKMARK`: Warm major third chime (E5 659Hz + B5 987Hz)
- `COMPARE`: Triple ascending triad (A4 440Hz + C#5 554Hz + E5 659Hz)
- `CONFIRM`: Major triad fanfare (C5 523Hz + E5 659Hz + G5 784Hz)
- `CLOSE`: Descending soft tone (440Hz -> 220Hz, 60ms)
- `THEME_SWAP`: Dynamic morphing glissando chime (D5 587Hz -> A5 880Hz -> D6 1174Hz, 90ms)
- `COIN`: Arcade coin shimmer (B5 987Hz -> E6 1318Hz, 80ms)
- `CART_ADD`: Cash register / cart drop chime (G5 784Hz + C6 1046Hz, 100ms)
- `SUCCESS`: Major chord fanfare resolution (C5 -> E5 -> G5 -> C6, 180ms)
- `LIKE`: Bubbly ascending pitch pop (440Hz -> 880Hz exponential, 50ms)
- `SWIPE`: Smooth filtered noise sweep (300Hz -> 1200Hz, 60ms)

---

## 7. Security, Accessibility & Memory Integrity

1. **Safe DOM Injection:** All dynamic string outputs (toasts, comments, alerts) MUST use `textContent` or `document.createElement` node assembly. Direct `innerHTML` injection of unsanitized strings is strictly forbidden.
2. **AudioNode Lifecycle:** Every `OscillatorNode`, `GainNode`, and `BiquadFilterNode` MUST attach an `onended` handler calling `.disconnect()` to prevent Web Audio thread memory leaks.
3. **Modal Focus Trap:** Opening a modal dialog MUST capture keyboard focus, loop Tab navigation within the modal boundary, and restore previous focus upon closing.
4. **Canvas & Motion Optimization:** Canvas 2D loop MUST pause when a modal is active and strictly respect `prefers-reduced-motion`.

---

## 8. 8 Main Categories & Actual 120 Catalog

Runtime `data-theme` and gallery IDs are the 120 canonical IDs assembled from the Core 36 pack and seven 12-style expansion packs. `src/data/categories.js` is the compatibility projection used by the UI. Parenthetical names below are CSS/storage aliases only; aliases are not catalog rows and LocalStorage bookmarks/confirmed/recents rewrite them to canonical IDs on load.

### 8.1 Core 36 compatibility subset

아래 목록은 기존 사용자·저장·출력 호환을 위해 지문을 유지하는 Core 36이다. 공개 catalog는 이 목록에 `SPEC-catalog-expansion-120.md`의 신규 84종을 더한다.

1. **스위스 스타일 (Swiss Style - `swiss`)**
   - `swiss-grid`: 격자 중심 모더니즘 (Grid-Driven Modernism)
   - `corporate-minimal`: 기업형 미니멀리즘 (Corporate Minimalist)
   - `high-contrast-mono` (`minimalism-clean`): 고대비 모노스페이스 / 클린 미니멀리즘 (High-Contrast Monospace)
   - `bauhaus-geometry`: 바우하우스 기하학 (Bauhaus Geometric Typography)
   - `de-stijl`: 데 스틸 신조형주의 (De Stijl Neo-Plasticism)
   - `flat-design`: 플랫 디자인 2.0 (Flat Design 2.0)
2. **브루탈리즘 & 네오 브루탈리즘 (Brutalism & Neo-Brutalism - `brutalism`)**
   - `raw-brutalism`: 날것의 디지털 브루탈리즘 (Raw Digital Brutalism)
   - `neo-brutalism`: 트렌디 네오 브루탈리즘 (Trendy Neo-Brutalism)
   - `cyber-brutalism` (`acid-techno-brutal`): 사이버 브루탈리즘 (Cyber Brutalism)
   - `constructivist`: 구성주의 애지트프로프 (Constructivist Agitprop)
   - `punk-zine`: 펑크 제록스 진 (Punk Xerox Zine)
3. **입체감 및 질감 스타일 (Depth & Materiality - `depth`)**
   - `glassmorphism` (`glassmorphism-luxe`): 프로스테드 글래스모피즘 (Frosted Glassmorphism Luxe)
   - `neumorphism` (`neumorphism-soft`): 소프트 뉴모피즘 (Soft Neumorphism)
   - `skeuomorphism` (`skeuomorphism-classic`): 모던 스큐어모피즘 2.0 (Modern Skeuomorphism Classic)
   - `material-design`: 머티리얼 페이퍼 시스템 (Material Paper System)
   - `liquid-glass`: 리퀴드 글래스 인터페이스 (Liquid Glass Interface)
4. **레트로 & 팝 아키텍처 (Retro & Pop Architecture - `retro`)**
   - `memphis` (`memphis-pattern`): 80s 멤피스 팝 패턴 (80s Memphis Pattern)
   - `synthwave` (`synthwave-neon`): 신스웨이브 네온 나이트 (Synthwave Neon)
   - `vaporwave` (`vaporwave-80s`): 베이퍼웨이브 칠 노스탤지어 (Vaporwave 80s Chill)
   - `art-deco`: 아르데코 머신 에이지 (Art Deco Machine Age)
   - `psychedelic-poster`: 사이키델릭 포스터 (Psychedelic Poster)
5. **에디토리얼 & 오가닉 (Editorial & Organic - `editorial`)**
   - `high-fashion` (`editorial-serif`): 하이패션 에디토리얼 세리프 (High-Fashion Editorial Serif)
   - `fluid-organic` (`bauhaus-geometric` / `organic-nature`): 플루이드 오가닉 & 바우하우스 (Fluid Organic)
   - `dark-minimal-glass` (`darkmode-highcontrast`): 다크 미니멀 글래스 (Dark Minimal Glass)
   - `art-nouveau`: 아르누보 휩래시 (Art Nouveau Whiplash)
   - `risograph`: 리소그래프 에디토리얼 (Risograph Editorial)
6. **Y2K & 2000s 글로시 웹 (Y2K & 2000s Glossy Web - `y2k`)**
   - `y2k-chrome` (`y2k-chrome-hologram`): Y2K 크롬 & 홀로그램 (Y2K Chrome & Hologram)
   - `frutiger-aero` (`frutiger-aero-aqua`): Frutiger Aero 투명 아쿠아 글로스 (Frutiger Aero Aqua Gloss)
   - `pixel-arcade` (`pixel-arcade-8bit`): 8-Bit 픽셀 아케이드 (8-Bit Pixel Arcade)
7. **하이퍼 테크 & 키네틱 모션 (Hyper-Tech & Kinetic Motion - `hypertech`)**
   - `kinetic-type` (`kinetic-type-motion`): 키네틱 타이포 & 모션 (Kinetic Typography & Motion)
   - `bento-grid` (`bento-ui-precision`): Bento UI 2.0 정밀 그리드 (Bento UI 2.0 Precision Grid)
   - `acid-techno` (`cyberpunk-hud`): 사이버펑크 HUD & 애시드 테크노 (Acid Graphics & Cyberpunk HUD)
   - `metro-interface`: 메트로 타일 인터페이스 (Metro Tile Interface)
8. **소프트 3D & 솔라퓨처리즘 (Soft 3D & Solarpunk - `soft3d`)**
   - `claymorphism` (`claymorphism-bubble`): 클레이모피즘 3D 버블 (Claymorphism 3D Bubble)
   - `handcrafted-indie` (`indie-craft`): 핸드크래프트 콜라주 인디 (Handcrafted & Collage Indie)
   - `solarpunk-eco` (`solarpunk-green`): 솔라펑크 에코 퓨처리즘 (Solarpunk Eco-Futurism)

### 8.2 Expansion 84 and final totals

신규 84종의 정확한 canonical ID, 한국어·영어 표시명, 7개 pack 배치, 21개 문법과 기관·공식 출처는 `SPEC-catalog-expansion-120.md`가 소유한다. 최종 분포는 다음과 같으며 각 카테고리 15종이다.

| Category | Total |
| --- | ---: |
| `swiss` | 15 |
| `brutalism` | 15 |
| `depth` | 15 |
| `retro` | 15 |
| `editorial` | 15 |
| `y2k` | 15 |
| `hypertech` | 15 |
| `soft3d` | 15 |
| **Total** | **120** |

---

## 9. Scalable Style Library Program

### 9.1 Approved target

- Preserve the existing 24 canonical style IDs, storage values, eight archetypes, and export contract.
- Replace duplicated style metadata, runtime theme tokens, export tokens, preview dispatch, thumbnail dispatch, and motion references with explicit contracts and registries.
- Add category plus multi-facet discovery for era, lineage, medium, materiality, density, tone, motion intensity, region, and maturity.
- Keep all actual 120 styles searchable, pageable, selectable and exportable while loading expansion component/theme/CSS implementations on demand.
- Preserve the completed 24- and 36-style fixtures as compatibility subsets; future additions beyond 120 require a new approved specification and measured budget.

### 9.2 Specification gate

Implementation follows the reviewed gates in `CAPABILITY_MAP.md`. 기반 모듈, Wave 1 24→36, discovery/scalability와 `SPEC-catalog-expansion-120.md`의 actual-120 확장은 모두 `COMPLETE`다. 현재 빌드는 카탈로그 오류를 차단하고 기존 24종의 56개 legacy 품질 경고를 공개하며 신규 ready 96종은 오류·경고 0이다. 정규 토큰 단일 원천, renderer·thumbnail·motion `120/120/120`과 asset 0, 독립 `thumbnailId`, 근거 기반 motion descriptor와 명시적 렌더 실패 경계가 고정됐다.

최종 게이트는 Node 152/152, catalog 오류 0/legacy 경고 56, 75-module Vite build, 초기 JS/CSS `83.46/32.86kB` gzip을 통과했다. Crostini Chrome 151에서 세 보기의 actual 120 전체 도달, 120×8×Desktop/Mobile `1,920`상태, Web `480`탭, 신규 84종의 device grid 변화, Detail·Split·Peek·Dock·reduced-motion을 확인했다. 초기 LCP `732ms`, CLS `0`, interaction max `142.8ms`, application diagnostics/issue는 0이다. 다음 미구현 Wave 수치는 없으며 120종을 넘는 확장은 별도 사양으로 시작한다.

### 9.3 Quality invariant

A canonical style is not a palette variant. It must have distinct visual grammar, semantic tokens, thumbnail treatment, motion policy, practical mockup treatment, editorial explanation, source provenance, and accessibility notes. Missing internal references must fail validation rather than silently falling back to another style. Thumbnail markup is decorative content inside an existing control and must not introduce nested interactive elements.
