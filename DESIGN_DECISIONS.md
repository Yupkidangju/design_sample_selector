# Design Decisions Record (`DESIGN_DECISIONS.md`)
**Project Name:** Web Design Sample Selector (`design_sample_selector`)  
**Version:** 2.2.2  
**Document Status:** Architecture Rationale & Decision History  

---

## 1. Decision 001: Web Audio API Procedural Synthesis vs. MP3 Audio Assets

- **Context:** The user required ambient background music tracks played procedurally, along with responsive hover/click UI sound effects.
- **Decision:** Web Audio API Procedural Audio Synthesizer.
- **Outcome:** 0KB asset download footprint, real-time frequency/filter modulation, instantaneous audio generation, seamless Web Audio graph integration for mini canvas spectrum visualization.

---

## 2. Decision 002: Canvas 2D Particle Engine (no WebAssembly)

- **Context:** High-frequency particle rendering for canvas visual background effects during card hovering and mouse movement. A WASM module was considered and is **not** shipped.
- **Decision:** JavaScript Canvas 2D particle engine in `src/wasm/visualEngine.js` (historical path name only).
- **Outcome:** Smooth ~60fps canvas animation, audio-reactive spectrum, `pauseLoop`/`resumeLoop` on modal overlay, `prefers-reduced-motion` physics skip. No `.wasm` binary and no `WebAssembly` API.

---

## 3. Decision 003: Pure Vanilla CSS Design System vs. TailwindCSS

- **Context:** Styling responsive layouts, glassmorphism card effects, neo-brutalism drop shadows, and dark mode typography.
- **Decision:** Vanilla CSS3 with CSS Custom Properties & Modern Glassmorphism/Neumorphism utilities.
- **Outcome:** Native browser execution without build step, clean CSS token architecture, maximum control over hover animations and responsive breakpoints.

---

## 4. Decision 004: Interactive Live Mockups in Detail Showcase Modal

- **Context:** Displaying design mockups, color palettes, characteristics, pros and cons with hover animations.
- **Decision:** Rather than static screenshot images, each subcategory design features an **interactive live HTML/CSS UI sandbox preview** inside the modal.

---

## 5. Decision 005: v2.0.0 Architectural Expansion (24 Sub-Styles, 4 Component Tabs, Live Parameter Tuner, 3 View Modes, Split Compare)

- **Context:** The user requested:
  1. Advancing the gallery UI/UX (multi-mode views, instant search, taxonomy filters, bookmarks).
  2. Broadening design samples to include major modern and historical genres (Y2K, Frutiger Aero, Bento UI 2.0, Kinetic Typography, Claymorphism, Solarpunk).
  3. Diversifying live mockup examples beyond a single snippet to 4 practical component categories (Hero, Widget/Dashboard, Form & Inputs, Pricing) with live real-time CSS variable parameter tuning sliders and code inspection.
- **Decision:** 
  - Expanded data taxonomy from 5 categories / 15 sub-styles to **8 categories / 24 sub-styles**.
  - Implemented dynamic component renderer generating bespoke semantic HTML/CSS for all 4 component types across all 24 sub-styles.
  - Linked CSS custom properties to live slider inputs with two-way binding and real-time CSS code generator.
  - Added 3 View Modes (Grid, Bento, Spectrum) and Side-by-Side Dual Split Comparison View.
  - Expanded procedural Web Audio synth from 10 to 16 distinct genre-matched ambient tracks.

---

## 6. Decision 006: Draft Dock + Style-Specific Motion (v2.1)

- **Context:** Same-category samples looked like recolored cards. Click-to-modal skipped a selection step. Mockups used `alert()` and almost no motion.
- **Decision:** Keep the 24-style catalog. Differentiate with unique thumbs, category motifs, and motion profiles. Click selects a draft into a bottom dock; double-click/Enter opens detail; confirm persists locally. Hydrate mockups instead of inline alerts.
- **Rejected:** Expanding to 32 styles before the existing 24 felt distinct.
- **Outcome:** Gallery, peek, dock, and sandbox share one `getMockupHTML` + `hydrateMockup` path. Looping motion pauses off-screen and honors `prefers-reduced-motion`.

---

## 7. Decision 007: 8 Core Archetypes & Zero-Rebuild Dynamic Theme Injection (v2.2)

- **Context:** Users requested diverse page archetypes (Game, Web, Mobile, E-commerce, Blog, Dashboard, Media, Chat) that can dynamically switch all 24 design styles across shared page templates without losing runtime state (e.g. cart contents, game scores).
- **Decision:** 
  - Define unified semantic HTML templates for 8 core page archetypes (`src/components/archetypeTemplates.js`).
  - Standardize 24 design styles into atomic CSS Custom Properties and `[data-theme]` attributes (`src/styles/themeTokens.css`).
  - Theme switching only updates container attributes and variables (`viewport.setAttribute('data-theme', ...)`), preserving DOM elements and listener bindings.
- **Outcome:** Zero DOM tearing on style switch, instant < 16ms theme transition, zero state loss, and fully functional multi-genre interaction simulators.

---

## 8. Decision 008: Universal Top Design Selector Bar (v2.2)

- **Context:** Previous modal navigation was restricted to cycling within the current category's 3 sub-styles, breaking user flow when comparing cross-category aesthetics on the same page archetype.
- **Decision:**
  - Build an integrated top selector bar featuring 8 major category tabs and 24 sub-style visual thumbnail chips.
  - Implement full keyboard shortcuts (`[` / `]` for styles, `Shift + Left/Right` for categories, `Esc` to close).
  - Sync style switches with procedural audio SFX (`THEME_SWAP`) and `appState`.
- **Outcome:** Seamless cross-category design exploration and instant comparative evaluation.

