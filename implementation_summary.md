# Implementation Summary (`implementation_summary.md`)
**Project Name:** Web Design Sample Selector (`design_sample_selector`)  
**Version:** 2.1.0  
**Document Status:** Complete System Blueprint / File & Task Map  

---

## 1. System Breakdown & Modular Architecture

The application is structured into zero-dependency, native ES modules that communicate via clean event-driven interfaces and shared immutable state.

```
/home/eunho1/Projects/web/design_sample_selector/
├── index.html                  # Single page entry point with semantic HTML structure
├── index.css                   # Core CSS design system, 24-style preview styles, bento & modal layouts
├── src/
│   ├── main.js                 # Application bootstrap & lifecycle coordinator
│   ├── state/
│   │   └── appState.js         # Reactive state manager, observer pattern, LocalStorage bookmarks, comparison state
│   ├── data/
│   │   └── categories.js       # Master dataset of 8 main categories & 24 subcategory designs
│   ├── audio/
│   │   └── synthAudio.js       # Web Audio API ambient BGM 16-track synth & UI sound FX engine
│   ├── wasm/
│   │   └── visualEngine.js     # WebAssembly (WASM) background particle canvas engine & audio-reactive visualizer
│   ├── components/
│   │   ├── header.js           # Navigation bar, search input, 3-mode view switcher, bookmark filter, compare launcher
│   │   ├── mainView.js         # 3 gallery modes, live thumbs, draft selection, keyboard nav
│   │   ├── detailView.js       # Fullscreen detail sandbox modal & side-by-side dual comparison view
│   │   ├── mockupTemplates.js  # 24-styles mockups + thumb signatures
│   │   ├── mockupRuntime.js    # Hydrate toasts, counters, style-specific motion
│   │   ├── selectionDock.js    # Bottom dock + confirm sheet
│   │   ├── peekPreview.js      # Hover/focus live peek
│   │   └── audioWidget.js      # Floating BGM player control panel & mini spectrum visualizer
│   ├── styles/
│   │   └── interactive.css     # Dock, peek, thumbs, motifs, mockup FX
│   └── utils/
│       ├── clipboard.js        # Color code & CSS snippet click-to-copy utility & toast notification renderer
│       └── selection.js        # Draft / detail / confirm / peek helpers
├── spec.md                     # Master Technical Specification
├── designs.md                  # UI/UX & Design Token Specification
├── DESIGN_DECISIONS.md         # Architecture Decisions & Rationale
├── BUILD_GUIDE.md              # Scaffolding, execution & deployment guide
├── audit_roadmap.md            # Quality & Phase Verification Checklist
└── CHANGELOG.md                # Release & Change History Log
```

---

## 2. File Responsibilities & Exported Interfaces

### 2.1 `src/state/appState.js`
- **Responsibility:** Holds reactive global state (`AppState`), provides `getState()`, `setState()`, `toggleBookmark(subId)`, `setCompareSubIds(id1, id2)`, and `subscribe(listener)` methods with automatic LocalStorage sync.

### 2.2 `src/data/categories.js`
- **Responsibility:** Exports frozen array `MAIN_CATEGORIES` containing all 8 main category trees, 24 subcategories, color palettes, tags, characteristics, pros/cons, and default parameter tweaks.

### 2.3 `src/components/mockupTemplates.js`
- **Responsibility:** Generates custom interactive HTML snippets for all 24 subcategory styles across 4 component tabs (`Hero Landing`, `Dashboard & Widget`, `Form & Inputs`, `Pricing & Features`).

### 2.4 `src/components/detailView.js`
- **Responsibility:** Renders the detail showcase modal and side-by-side dual split comparison modal. Includes live parameter sliders (`Border Radius`, `Border Width`, `Shadow Depth`, `Backdrop Blur`), real-time CSS/HTML code inspector, copyable color palettes, and pros/cons hover cards.

### 2.5 `src/components/mainView.js`
- **Responsibility:** Renders the 3 main gallery view modes (`Standard Grid`, `Bento Grid`, `Spectrum Stream`), handles real-time text query searching, tag filtering, bookmark toggles, and card hover interactions.

### 2.6 `src/audio/synthAudio.js`
- **Responsibility:** Generates 16 procedural ambient background synthesizer tracks and 7 dynamic UI sound effects (`HOVER`, `REVEAL`, `CLICK`, `COPY`, `BOOKMARK`, `COMPARE`, `CLOSE`).

### 2.7 `src/wasm/visualEngine.js`
- **Responsibility:** Runs high-performance particle canvas physics with audio-reactive spectrum pulsation and mouse-gravity fields.
