# UI/UX Design Specification (`designs.md`)
**Project Name:** Web Design Sample Selector (`design_sample_selector`)  
**Version:** 2.1.0  
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
| LAYER 5: Detail Showcase & Sandbox Modal View (z-index: 800)      |
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
| LAYER 1: WASM Canvas Animation Background Renderer (z-index: 0)   |
+-------------------------------------------------------------------+
```

---

## 3. Main Gallery Layout & 3 View Modes

### 3.1 Top Navigation & Search/Filter Controls
- **Global Header:**
  - Dynamic Animated Brand Logo + Version 2.0 Badge.
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

## 4. Detail View & Interactive Live Sandbox Specification

### 4.1 2-Column Responsive Layout
- **Left Column: Live Sandbox & 4 Component Preview Tabs**
  - **Component Tabs:**
    - `[ 🎯 Hero Landing ]`: Full-impact headline, hero visuals, CTA buttons.
    - `[ 📊 Dashboard & Widget ]`: Metric cards, status badges, micro-visual graphs.
    - `[ ⚡ Form & Controls ]`: Interactive inputs, switch toggles, checkbox groups.
    - `[ 🏷️ Pricing & Features ]`: Tier cards, highlight badges, conversion CTA.
  - **Device Switcher:** Desktop (100% fluid) vs. Mobile (380px device frame simulation).
  - **Full Preview Trigger:** Expands sandbox to fullscreen preview.

- **Right Column: Tweak Controls, Inspector & Style Specs**
  - **Interactive Palette Cards:** HEX click-to-copy with dual audio ping and toast notice.
  - **Live Parameter Tweak Sliders (Live CSS Variables Binding):**
    - Border Radius slider (`0px` ~ `48px`)
    - Border Width slider (`0px` ~ `8px`)
    - Shadow Depth slider (`0px` ~ `30px`)
    - Backdrop Blur slider (`0px` ~ `32px`)
    - Glow Intensity slider (`0.0` ~ `2.0`)
  - **Live CSS & HTML Inspector:**
    - Displays active CSS rules with live-tweaked values.
    - Click-to-copy complete CSS or HTML snippet.
  - **Characteristics & Pros/Cons Hover Cards:**
    - Positive bullet points (Green glow).
    - Potential caveats and considerations (Coral/Amber glow).
  - **Action Footer:**
    - `[ ⭐️ Bookmark Style ]` toggle.
    - `[ ⚖️ Add to Split Compare ]` button.

---

## 5. Side-by-Side Dual Split Comparison View

- Allows selecting any two sub-styles (e.g. `Grid-Driven Modernism` vs `Trendy Neo-Brutalism`).
- Displays 2 side-by-side synchronized viewports.
- Switches component tabs (`Hero`, `Widget`, `Form`, `Pricing`) synchronously across both styles.
- Provides immediate visual contrast between color philosophy, typography scale, borders, and tactile affordances.
