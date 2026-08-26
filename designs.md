# UI/UX Design Specification (`designs.md`)
**Project Name:** Web Design Sample Selector (`design_sample_selector`)  
**Version:** 2.3.0  
**Document Status:** Frozen UX Architecture / Implementation Target  

---

## 1. Design System & Global Visual Tokens

### 1.1 Color Tokens (CSS Custom Properties)

```css
:root {
  /* Core Background & Surfaces */
  --bg-dark-primary: #080B10;
  --bg-dark-surface: #0E1420;
  --bg-dark-card: rgba(18, 25, 38, 0.75);
  --bg-glass-border: rgba(255, 255, 255, 0.10);
  --bg-glass-hover: rgba(255, 255, 255, 0.18);
  
  /* Primary Category Accents */
  --accent-swiss-red: #FF3300;
  --accent-brutal-yellow: #FFFF00;
  --accent-cyan: #00F0FF;
  --accent-magenta: #FF007A;
  --accent-emerald: #00E699;
  --accent-y2k-chrome: #A855F7;
  --accent-kinetic-lime: #CCFF00;
  --accent-clay-orange: #FF6B4A;
  
  /* Typography & Ink */
  --text-primary: #F8FAFC;
  --text-secondary: #94A3B8;
  --text-muted: #64748B;
  --text-inverted: #080B10;
  
  /* Dynamic Parameter Tweak Defaults */
  --tweak-radius: 16px;
  --tweak-border-width: 1px;
  --tweak-shadow-depth: 12px;
  --tweak-backdrop-blur: 16px;
  --tweak-glow-intensity: 1.0;
  
  /* Transitions */
  --transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-bounce: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

### 1.2 Typography Hierarchy

| Font Role | Font Family | Weights | Usage |
| --- | --- | --- | --- |
| Primary Display | `'Space Grotesk', sans-serif` | 700, 600 | Page Hero, Main Titles, Category Numbers |
| Body & UI | `'Inter', sans-serif` | 400, 500, 600, 700 | Descriptions, Cards, Tabs, Pros/Cons |
| Monospace / Code | `'Fira Code', 'Courier New', monospace` | 400, 600 | Live Code Inspector, Hex Codes, CLI UI |
| Editorial / Serif | `'Cinzel', serif` | 600, 700 | High-Fashion Editorial Mockups |

---

## 2. Screen Architecture & Layer Hierarchy

```
+-------------------------------------------------------------------+
| LAYER 7: Split Dual Comparison Modal View (z-index: 1200)         |
+-------------------------------------------------------------------+
| LAYER 6: Toast Notifications & Copy Feedback (z-index: 1100)      |
+-------------------------------------------------------------------+
| LAYER 5: Detail Showcase & Archetype Modal View (z-index: 800)    |
|          - Universal Top Design Selector Bar (24 Styles)          |
|          - 8 Page Archetype Viewport + Live Kinetic Simulator     |
|          - Live CSS Parameter Sliders & Inspector                 |
+-------------------------------------------------------------------+
| LAYER 4.5: Selection Dock + Confirm Sheet (z-index: 550)          |
+-------------------------------------------------------------------+
| LAYER 4.2: Hover/Focus Peek Live Preview (z-index: 500)           |
+-------------------------------------------------------------------+
| LAYER 4: Audio Player & BGM Synthesizer Widget (z-index: 600)     |
+-------------------------------------------------------------------+
| LAYER 3: Main Navigation Header, Search, Tags & View Switcher     |
|          (z-index: 400)                                           |
+-------------------------------------------------------------------+
| LAYER 2: Gallery Main Grid / Bento / Spectrum Stream (z-index: 100|
+-------------------------------------------------------------------+
| LAYER 1: Canvas 2D Particle Background Renderer (z-index: 0)      |
+-------------------------------------------------------------------+
```

---

## 3. Main Gallery Layout & 3 View Modes

### 3.1 Top Navigation & Search/Filter Controls
- **Global Header:**
  - Dynamic Animated Brand Logo + Version 2.3 LIVE badge. Canvas 2D status chip (not WASM).
  - Real-time Instant Search Input Field with clear button.
  - Category / Mood Filter Tags (All, Swiss, Brutalism, Depth, Retro, Editorial, Y2K, Kinetic, 3D Clay, etc.).
  - View Mode Toggle Switch (`Grid`, `Bento`, `Spectrum`).
  - Active Bookmarks Drawer Button (`Bookmarks (N)`).
  - Split Comparison Drawer Trigger (`Compare (2)`).

### 3.2 View Modes
1. **Grid Mode (`view-mode-grid`):**
   - 8 Large Category Master Cards featuring expandable subcategory nodes, accent glow borders, and hover particle reaction.
2. **Bento Mode (`view-mode-bento`):**
   - Asymmetric Bento Grid highlighting featured styles, interactive live mini-widgets, and color chips directly on the main board.
3. **Spectrum Mode (`view-mode-spectrum`):**
   - Horizontal & vertical evolutionary stream showing design timeline and color spectrum relationships.

---

## 4. Detail View & 8 Core Page Archetypes Specification

### 4.1 Universal Top Design Selector Bar
Located at the topmost header of the detail modal:
1. **Category Tabs Row (8 Genres):** Swiss, Brutalism, Depth, Retro, Editorial, Y2K, Hypertech, Soft 3D.
2. **Sub-Style Chips Strip (24 Presets):** Horizontal scrolling chip ribbon containing miniature geometric icons and style names.
3. **Instant Action Buttons:** Bookmark (★), Confirm Style (✓), Split Compare (⚖️), and Close (✕).
4. **Keyboard Shortcuts:** `[` / `]` for previous/next style, `Shift + Left/Right` for category jump, `Esc` to close.

### 4.2 8 Core Page Archetype Tabs & Viewport
- **Archetype Navigation Bar (`role="tablist"`):**
  - `[ 🎮 Game HUD ]`: Target reflex clicker game, HP/MP bars, skill cooldown, combo multiplier.
  - `[ 🌐 Web SaaS ]`: Modern SaaS landing with Hero, Widget, Form, and Pricing sub-tabs.
  - `[ 📱 Mobile App ]`: Native mobile frame with status bar, feed cards, notification swipe, bottom 4-tab bar.
  - `[ 🛍️ E-Commerce ]`: Product showcase, color/size chips, quantity stepper, cart drawer, checkout modal.
  - `[ 📰 Blog & Post ]`: Article reader, scroll progress bar, like particle counter, live comment authoring.
  - `[ 📊 Dashboard ]`: KPI analytics cards, 1D/1W/1M time range filters, responsive data table with sort.
  - `[ 🎵 Media Player ]`: Track vinyl/cassette artwork, play/pause controls, interactive scrub bar, visualizer.
  - `[ 💬 Chat & DM ]`: Multi-channel sidebar, chat bubble stream, emoji reactions, message composer.

### 4.3 Right Column: Live Parameter Tweak Sliders & Reactive Design Spec Inspector
- **Interactive Palette Cards:** HEX click-to-copy with audio ping and toast notice.
- **Live Parameter Tweak Sliders (Live CSS Variables Binding):**
  - Border Radius slider (`0px` ~ `64px`)
  - Border Width slider (`0px` ~ `12px`)
  - Shadow Depth slider (`0px` ~ `30px`)
  - Backdrop Blur slider (`0px` ~ `32px`)
  - Glow Intensity slider (`0.0` ~ `2.0`)
- **Dynamic 4-Tab Reactive Inspector & Spec Generator:**
  - `role="tablist"` navigation: `[ 💻 Live CSS ]`, `[ 📄 Live HTML ]`, `[ 📋 Live designs.md ]`, `[ 🏷️ Design Tokens ]`.
  - **Live CSS Sub-Toggles:** `전체 번들 (Full)` / `테마 토큰만 (Tokens Only)` / `아키타입 CSS (Component)`.
  - **Live designs.md Viewer:** Real-time rendered Markdown document containing complete D3D specifications, ASCII archetype layout, color tables, and kinetic interaction guides.
  - **Design Tokens Viewer:** DTCG 2025.10 structured JSON. CSS color/gradient/transparent values, dimensions, font stacks, and layered shadows have explicit conversion policies.
  - **Action Toolbar:** `📋 클립보드 복사`, `💾 .css / .html / .md / .json 다운로드`, `📦 통합 TXT 스냅샷`. 스냅샷은 네 산출물을 한 `.txt`에 구획화한 검토용 문서이며 ZIP 패키지가 아니다.
  - **rAF Update Engine:** Continuous parameter input is frame-coalesced; user actions always resolve the latest application state before generation or export.
  - **Re-entry State:** 상세 모달을 열 때 인스펙터는 CSS/전체 번들로 초기화되며 active class, `aria-selected`, pane, CSS submode, 다운로드 라벨이 일치한다.
- **Characteristics & Pros/Cons Hover Cards.**

---

## 5. Side-by-Side Dual Split Comparison View

- Selects any two sub-styles (e.g. `Grid-Driven Modernism` vs `Trendy Neo-Brutalism`).
- Synchronized Archetype selection across Left (Style A) and Right (Style B).
- Full visual thumbnail picker for instant slot assignment.
- All 8 archetype tabs (including Media and Chat), synchronized across A/B.
- The active archetype tab exposes `aria-selected="true"` and `tabindex="0"`; the other tabs use `aria-selected="false"` and `tabindex="-1"`. ArrowLeft/ArrowRight/Home/End move and activate tabs, and both comparison viewports are linked as tabpanels.
- Keyboard `Escape` / close returns to the originating view (`MAIN` gallery or `DETAIL` modal).
