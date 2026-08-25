# Build & Runtime Execution Guide (`BUILD_GUIDE.md`)
**Project Name:** Web Design Sample Selector (`design_sample_selector`)  
**Version:** 2.2.2  
**Document Status:** Execution Protocol  

---

## 1. Environment & Prerequisites

- **Node.js Environment (Optional for local dev server):** Node.js >= 16.x or Python 3.x (for static HTTP server).
- **Supported Browsers:** Chrome/Edge >= 90, Firefox >= 88, Safari >= 14.5 (Web Audio API & Canvas 2D required).
- **No external npm build dependencies required** at runtime!

---

## 2. Directory Structure Verification

```
/home/eunho1/Projects/web/design_sample_selector/
├── index.html
├── index.css
├── package.json
├── package-lock.json
├── .gitignore
├── src/
│   ├── main.js
│   ├── state/
│   │   └── appState.js
│   ├── data/
│   │   └── categories.js
│   ├── audio/
│   │   └── synthAudio.js
│   ├── wasm/
│   │   └── visualEngine.js
│   ├── components/
│   │   ├── header.js
│   │   ├── mainView.js
│   │   ├── detailView.js
│   │   ├── archetypeTemplates.js
│   │   ├── mockupTemplates.js
│   │   ├── mockupRuntime.js
│   │   ├── selectionDock.js
│   │   ├── peekPreview.js
│   │   └── audioWidget.js
│   ├── styles/
│   │   ├── themeTokens.css
│   │   └── interactive.css
│   └── utils/
│       └── clipboard.js
├── spec.md
├── designs.md
├── implementation_summary.md
├── DESIGN_DECISIONS.md
├── BUILD_GUIDE.md
├── audit_roadmap.md
└── CHANGELOG.md
```

---

## 3. How to Run Locally

### Option A: Vite Dev Server (Recommended)
```bash
npm run dev
```
Open browser at: `http://localhost:5173` (or port assigned by Vite)

### Option B: Node.js Preview Build
```bash
npm run build
npm run preview
```

### Option C: Python HTTP Server
```bash
python3 -m http.server 8080
```
Open browser at: `http://localhost:8080`

---

## 4. Verification & Testing Protocol

1. **Canvas 2D Test:** Check browser console for `[Canvas VisualEngine] 2D renderer ready. Particles:` and confirm the header chip reads `CANVAS 2D`.
2. **Audio Synth Test:** Click anywhere on the screen to initialize Web Audio API context. Click Play on the Audio Widget. Confirm BGM synth plays and track title changes.
3. **Category Hover Test:** Hover mouse over `스위스 스타일` card. Confirm subcategory badges expand with sound effect `SFX_HOVER`.
4. **Detail View Test:** Click `격자 중심 모더니즘` badge. Confirm modal opens with live grid mockup, copyable color hex buttons, and pros/cons hover cards.
5. **Color Copy Test:** Click color `#FF3300`. Confirm audio chime plays and toast notification `Hex #FF3300 copied to clipboard` appears.
