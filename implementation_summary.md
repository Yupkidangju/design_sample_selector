# Implementation Summary (`implementation_summary.md`)
**Project Name:** Web Design Sample Selector (`design_sample_selector`)  
**Version:** 2.3.0  
**Document Status:** Complete System Blueprint / File & Task Map  

---

## 1. System Breakdown & Modular Architecture

The application is structured into zero-dependency, native ES modules that communicate via clean event-driven interfaces and shared reactive state.

```
/home/eunho1/Projects/web/design_sample_selector/
├── index.html                  # Single page entry point with semantic HTML structure
├── index.css                   # Core CSS design system, 24-style preview styles, bento & modal layouts
├── src/
│   ├── main.js                 # Application bootstrap & lifecycle coordinator
│   ├── state/
│   │   └── appState.js         # Reactive state manager, observer pattern, activeArchetype, LocalStorage
│   ├── data/
│   │   └── categories.js       # Master dataset of 8 main categories & 24 subcategory designs
│   ├── audio/
│   │   └── synthAudio.js       # Web Audio API ambient BGM 16-track synth & 14 UI sound FX engine
│   ├── wasm/
│   │   └── visualEngine.js     # Canvas 2D particle engine, audio-reactive visualizer & pause loop (not WASM)
│   ├── components/
│   │   ├── header.js           # Navigation bar, search input, 3-mode view switcher, bookmark filter, compare launcher
│   │   ├── mainView.js         # 3 gallery modes, live thumbs, draft selection, keyboard nav
│   │   ├── detailView.js       # 4-Tab Dynamic Reactive Inspector, Universal Top Bar, 8 archetypes, zero-rebuild theme swap & split compare
│   │   ├── archetypeTemplates.js# Standard semantic HTML templates for 8 core page archetypes
│   │   ├── mockupTemplates.js  # 24-styles mockups + thumb signatures (legacy/web sub-view)
│   │   ├── mockupRuntime.js    # Multi-archetype kinetic interaction simulators & WeakMap cleanup registry
│   │   ├── selectionDock.js    # Bottom dock + confirm sheet
│   │   ├── peekPreview.js      # Hover/focus live peek
│   │   └── audioWidget.js      # Floating BGM player control panel & mini spectrum visualizer
│   ├── styles/
│   │   ├── themeTokens.css     # 24-styles CSS custom properties token dictionary
│   │   └── interactive.css     # Universal top bar, 4-tab inspector, 8 archetypes styles, dock, peek, thumbs, mockup FX
│   └── utils/
│       ├── designSpecGenerator.js # Pure engine for Live CSS, Live designs.md (D3D Markdown), JSON Tokens & Downloaders (v2.3.0)
│       ├── clipboard.js        # Safe DOM textContent copy-to-clipboard utility & toast renderer (XSS-safe)
│       └── selection.js        # Draft / detail / confirm / peek / reduced motion helpers
├── spec.md                     # Master Technical Specification (v2.3.0)
├── designs.md                  # UI/UX & Design Token Specification (v2.3.0)
├── DESIGN_DECISIONS.md         # Architecture Decisions & Rationale
├── BUILD_GUIDE.md              # Scaffolding, execution & deployment guide
├── audit_roadmap.md            # Quality & Phase Verification Checklist
└── CHANGELOG.md                # Release & Change History Log
```

---

## 2. File Responsibilities & Exported Interfaces

### 2.1 `src/state/appState.js`
- **Responsibility:** Holds reactive global state (`AppState`), provides `getState()`, `setState()`, `setActiveArchetype()`, `toggleBookmark()`, `setCompareSubIds()`, and `subscribe(listener)` methods with validated LocalStorage synchronization.

### 2.2 `src/data/categories.js`
- **Responsibility:** Exports frozen array `MAIN_CATEGORIES` containing all 8 main category trees, 24 subcategories, color palettes, tags, characteristics, pros/cons, and default parameter tweaks.

### 2.3 `src/components/archetypeTemplates.js` & `src/styles/themeTokens.css`
- **Responsibility:** Defines standard semantic HTML templates for the 8 core page archetypes (`Game`, `Web SaaS`, `Mobile App`, `E-Commerce`, `Blog`, `Dashboard`, `Media Player`, `Chat`) and maps 24 design styles to CSS Custom Properties for Zero-Rebuild dynamic theme injection.

### 2.4 `src/components/mockupRuntime.js`
- **Responsibility:** Implements real-time kinetic interaction simulators across all archetypes (mini battle game, cart checkout, blog clap/comments, notification swipe, dashboard filters) and owns WeakMap-based event listener/timer cleanups.

### 2.5 `src/components/detailView.js`
- **Responsibility:** Renders the Universal Top Design Selector Bar (8 categories + 24 sub-styles chips), 8 Archetype viewport, live parameter sliders, real-time CSS code inspector, and WAI-ARIA Focus Trap.

### 2.6 `src/audio/synthAudio.js`
- **Responsibility:** Generates 16 procedural ambient background synthesizer tracks and 14 dynamic UI sound effects with automated `onended` node disconnection.

### 2.7 `src/wasm/visualEngine.js`
- **Responsibility:** Runs Canvas 2D particle physics with audio-reactive spectrum pulsation, `prefers-reduced-motion` compliance, and modal pause/resume lifecycle controls. No WebAssembly module.

