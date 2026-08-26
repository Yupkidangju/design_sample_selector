# Master Specification (`spec.md`)
**Project Name:** Web Design Sample Selector (`design_sample_selector`)  
**Version:** 2.3.0  
**Environment:** Client-side Pure Web (HTML5 / CSS3 / JavaScript ES2022 / Canvas 2D / Web Audio API)  
**Document Status:** Frozen Decision / Implementation Ready  

---

## 1. Document Control & Operating Rules

1. This specification is the authoritative master contract for the `design_sample_selector` web application v2.3.0.
2. All data types, audio parameters, category definitions, visual layout rules, and component state trees specified herein are frozen for implementation.
3. No speculative or open-ended placeholder terms ("later", "optional", "as needed") are permitted; all interfaces and values are explicitly defined.
4. Any architectural change requested by the user must update this specification first or within the same work unit.

---

## 2. Project Vision & Identity

`design_sample_selector` is an ultra-modern, high-performance web-native interactive gallery and design system playground. Built purely with standard HTML5, modern CSS3, ES2022 JavaScript, HTML5 Canvas 2D, and the Web Audio API, it serves as a comprehensive educational and inspirational hub for visual designers and web developers worldwide.

In v2.3.0, the application upgrades the inspector into a **Dynamic 4-Tab Reactive Inspector & Design Spec Generator (`[Live CSS]`, `[Live HTML]`, `[Live designs.md]`, `[Design Tokens JSON]`)** with frame-coalesced `requestAnimationFrame` synchronization, 3-level CSS granularity toggles (Full Bundle / Tokens Only / Component Only), individual client-side file export (`.css`, `.html`, `.md`, `.json`), and an integrated text snapshot export.

---

## 3. Goals & Non-Goals

### 3.1 Goals
- **8 Major Categories & 24 Distinct Sub-Styles:** Complete taxonomy spanning historical modernism, contemporary web trends, Y2K/Frutiger Aero gloss, hyper-tech kinetic typography, Apple-style Bento grids, and soft 3D claymorphism.
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
  - Pinned modal top bar with 8 major category tabs and 24 sub-style visual thumbnail chips.
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
| **Theme Injection** | CSS Custom Properties + `[data-theme]` | Zero-rebuild atomic theme swapping; preserves DOM and in-memory runtime state |
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
4. DTCG output targets the final Community Group Report `2025.10`. CSS `linear-gradient(...)` values become DTCG gradient stop arrays; `transparent` and `rgba(...)` become structured sRGB values with alpha; multi-layer CSS shadows become DTCG shadow arrays.

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

## 8. 8 Main Categories & 24 Subcategories Catalog

Runtime `data-theme` and gallery IDs are the 24 canonical IDs in `src/data/categories.js`. Parenthetical names below are CSS/storage aliases only (`themeTokens.css` dual/triple selectors). Aliases are not catalog rows; LocalStorage bookmarks/confirmed/recents rewrite aliases to the canonical ID on load.

1. **스위스 스타일 (Swiss Style - `swiss`)**
   - `swiss-grid`: 격자 중심 모더니즘 (Grid-Driven Modernism)
   - `corporate-minimal`: 기업형 미니멀리즘 (Corporate Minimalist)
   - `high-contrast-mono` (`minimalism-clean`): 고대비 모노스페이스 / 클린 미니멀리즘 (High-Contrast Monospace)
2. **브루탈리즘 & 네오 브루탈리즘 (Brutalism & Neo-Brutalism - `brutalism`)**
   - `raw-brutalism`: 날것의 디지털 브루탈리즘 (Raw Digital Brutalism)
   - `neo-brutalism`: 트렌디 네오 브루탈리즘 (Trendy Neo-Brutalism)
   - `cyber-brutalism` (`acid-techno-brutal`): 사이버 브루탈리즘 (Cyber Brutalism)
3. **입체감 및 질감 스타일 (Depth & Materiality - `depth`)**
   - `glassmorphism` (`glassmorphism-luxe`): 프로스테드 글래스모피즘 (Frosted Glassmorphism Luxe)
   - `neumorphism` (`neumorphism-soft`): 소프트 뉴모피즘 (Soft Neumorphism)
   - `skeuomorphism` (`skeuomorphism-classic`): 모던 스큐어모피즘 2.0 (Modern Skeuomorphism Classic)
4. **레트로 & 팝 아키텍처 (Retro & Pop Architecture - `retro`)**
   - `memphis` (`memphis-pattern`): 80s 멤피스 팝 패턴 (80s Memphis Pattern)
   - `synthwave` (`synthwave-neon`): 신스웨이브 네온 나이트 (Synthwave Neon)
   - `vaporwave` (`vaporwave-80s`): 베이퍼웨이브 칠 노스탤지어 (Vaporwave 80s Chill)
5. **에디토리얼 & 오가닉 (Editorial & Organic - `editorial`)**
   - `high-fashion` (`editorial-serif`): 하이패션 에디토리얼 세리프 (High-Fashion Editorial Serif)
   - `fluid-organic` (`bauhaus-geometric` / `organic-nature`): 플루이드 오가닉 & 바우하우스 (Fluid Organic)
   - `dark-minimal-glass` (`darkmode-highcontrast`): 다크 미니멀 글래스 (Dark Minimal Glass)
6. **Y2K & 2000s 글로시 웹 (Y2K & 2000s Glossy Web - `y2k`)**
   - `y2k-chrome` (`y2k-chrome-hologram`): Y2K 크롬 & 홀로그램 (Y2K Chrome & Hologram)
   - `frutiger-aero` (`frutiger-aero-aqua`): Frutiger Aero 투명 아쿠아 글로스 (Frutiger Aero Aqua Gloss)
   - `pixel-arcade` (`pixel-arcade-8bit`): 8-Bit 픽셀 아케이드 (8-Bit Pixel Arcade)
7. **하이퍼 테크 & 키네틱 모션 (Hyper-Tech & Kinetic Motion - `hypertech`)**
   - `kinetic-type` (`kinetic-type-motion`): 키네틱 타이포 & 모션 (Kinetic Typography & Motion)
   - `bento-grid` (`bento-ui-precision`): Bento UI 2.0 정밀 그리드 (Bento UI 2.0 Precision Grid)
   - `acid-techno` (`cyberpunk-hud`): 사이버펑크 HUD & 애시드 테크노 (Acid Graphics & Cyberpunk HUD)
8. **소프트 3D & 솔라퓨처리즘 (Soft 3D & Solarpunk - `soft3d`)**
   - `claymorphism` (`claymorphism-bubble`): 클레이모피즘 3D 버블 (Claymorphism 3D Bubble)
   - `handcrafted-indie` (`indie-craft`): 핸드크래프트 콜라주 인디 (Handcrafted & Collage Indie)
   - `solarpunk-eco` (`solarpunk-green`): 솔라펑크 에코 퓨처리즘 (Solarpunk Eco-Futurism)
