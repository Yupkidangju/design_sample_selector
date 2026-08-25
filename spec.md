# Master Specification (`spec.md`)
**Project Name:** Web Design Sample Selector (`design_sample_selector`)  
**Version:** 2.1.0  
**Environment:** Client-side Pure Web (HTML5 / CSS3 / JavaScript ES2022 / WebAssembly / Web Audio API)  
**Document Status:** Frozen Decision / Implementation Ready  

---

## 1. Document Control & Operating Rules

1. This specification is the authoritative master contract for the `design_sample_selector` web application v2.0.0.
2. All data types, audio parameters, category definitions, visual layout rules, and component state trees specified herein are frozen for implementation.
3. No speculative or open-ended placeholder terms ("later", "optional", "as needed") are permitted; all interfaces and values are explicitly defined.

---

## 2. Project Vision & Identity

`design_sample_selector` is an ultra-modern, high-performance web-native interactive gallery and design system playground. Built purely with standard HTML5, modern CSS3, ES2022 JavaScript, WebAssembly (WASM), and the Web Audio API, it serves as a comprehensive educational and inspirational hub for visual designers and web developers worldwide.

---

## 3. Goals & Non-Goals

### 3.1 Goals
- **8 Major Categories & 24 Distinct Sub-Styles:** Complete taxonomy spanning historical modernism, contemporary web trends, Y2K/Frutiger Aero gloss, hyper-tech kinetic typography, Apple-style Bento grids, and soft 3D claymorphism.
- **Interactive Multi-Mode Main Gallery:** 
  - 3 View Modes: Standard Grid View, Dynamic Bento Grid View, Spectrum Stream View.
  - Real-time Instant Search & Multi-Tag Taxonomy Filters (Genre & Moods).
  - Bookmark / Favorites persistence via LocalStorage.
  - Side-by-Side Dual Style Split Comparison Mode.
- **Multi-Component Live Sandbox per Style:**
  - 4 Component Preview Tabs: `Hero Landing`, `Dashboard & Widget Cards`, `Form & Inputs Controls`, `Pricing & Feature Cards`.
  - Responsive Viewport Switcher: Desktop & Mobile live previews.
- **Live Parameter Tweak Sandbox & Real-time CSS Inspector:**
  - Interactive sliders for `Border Radius`, `Border Width`, `Shadow Blur/Offset`, `Backdrop Blur`, `Glow Intensity`.
  - Dynamic live code viewer with one-click CSS/HTML snippet copying.
- **16-Track Web Audio Procedural Synthesizer & Sound FX:**
  - 16 custom atmospheric procedural BGM tracks tailored to each design mood.
  - Real-time synthesized UI Sound FX (hover, click, reveal, copy, split, mode switch).
- **WASM Reactive Canvas Engine:**
  - High-performance particle physics, grid wave deformation, and audio-reactive spectrum visualization.

### 3.2 Non-Goals
- Server-side backend databases or user authentication (pure client-side static web application).
- External video streaming or heavy MP3 asset downloads.
- Third-party bloated CSS frameworks (TailwindCSS/Bootstrap excluded in favor of standard Vanilla CSS design tokens).

---

## 4. Frozen Core Architectural Decisions

| Decision Area | Selected Technology | Rationale & Constraint |
| --- | --- | --- |
| **UI Framework** | Vanilla HTML5 + CSS3 + Modular ES6 JS | Zero build tool requirement for runtime; lightweight, ultra-fast initial load (< 40ms) |
| **Visual Graphics Engine** | HTML5 Canvas + WebAssembly (WASM) | Real-time particle math in WASM with audio-reactive spectrum mode |
| **Audio Engine** | Web Audio API 16-Track Procedural Synth | Zero external asset dependency; precise real-time pitch, frequency, and filter modulation |
| **Design System** | CSS Custom Properties (Variables) | Dynamic theme switching, live slider variable binding, subcategory styling encapsulation |
| **Typography** | Google Fonts (Inter, Space Grotesk, Cinzel, Fira Code) | Maximum legibility and authentic period representation |

---

## 5. System Architecture & Component Contracts

### 5.1 System State Tree Type Definition

```typescript
export interface AppState {
  currentView: 'MAIN' | 'DETAIL' | 'SPLIT_COMPARE';
  viewMode: 'GRID' | 'BENTO' | 'SPECTRUM';
  activeFilter: string; // 'ALL' or category ID
  searchQuery: string;
  selectedMainCategory: string | null;
  selectedSubCategory: string | null;
  activeComponentTab: 'hero' | 'widget' | 'form' | 'pricing';
  compareSubIds: [string, string]; // IDs for split comparison
  bookmarks: string[]; // List of bookmarked subcategory IDs
  galleryFocusId: string | null;
  draftSubId: string | null;
  confirmedStyleId: string | null; // LocalStorage `dss_confirmed_v21`
  peekSubId: string | null;
  confirmSheetOpen: boolean;
  recentlyViewed: string[]; // max 6, LocalStorage `dss_recent_v21`
  liveTweaks: {
    borderRadius: number;
    borderWidth: number;
    shadowDepth: number;
    backdropBlur: number;
    glowIntensity: number;
  };
  audio: AudioState;
  wasmReady: boolean;
  viewport: 'DESKTOP' | 'MOBILE';
}

export interface AudioState {
  bgmEnabled: boolean;
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
  moodTags: string[];
  characteristics: string[];
  pros: string[];
  cons: string[];
  palette: ColorToken[];
  previewType: string;
  motionProfile: string;
  thumbMotif: string;
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
  subCategories: SubCategoryDesign[];
}
```

---

## 6. Procedural Ambient BGM Matrix (16 Tracks)

1. `Etherial Drift` (Ambient Drone, C Minor)
2. `Swiss Grid Pulse` (Minimalist Chords, F Major)
3. `Raw Monolith` (Industrial Ambient, D Minor)
4. `Glass Prism` (Crystal Arpeggio, G Major)
5. `Soft Tactile` (Warm Pad, A Minor)
6. `Neon Horizon` (Cyberpunk Synth, E Minor)
7. `Serif Resonance` (Classical Acoustic Pad, Bb Major)
8. `Memphis Bounce` (Retro Playful, D Major)
9. `Fluid Organic` (Nature Wave Pad, Ab Major)
10. `Vapor Echoes` (Chillwave Reverb Pad, Eb Minor)
11. `Y2K Millennial Pulse` (2000s Trance Pop, F# Minor)
12. `Frutiger Aqua Stream` (Glossy Liquid Pad, C Major)
13. `8-Bit Arcade Fantasy` (Chiptune Sine Wave, G Major)
14. `Kinetic Velocity` (High-BPM Techno Bass, B Minor)
15. `Bento Precision Grid` (Clean Minimal Lo-Fi, D Major)
16. `Solarpunk Sunrise` (Eco Acoustic Atmosphere, E Major)

---

## 7. 8 Main Categories & 24 Subcategories Catalog

1. **스위스 스타일 (Swiss Style)**
   - `swiss-grid`: 격자 중심 모더니즘 (Grid-Driven Modernism)
   - `corporate-minimal`: 기업형 미니멀리즘 (Corporate Minimalist)
   - `high-contrast-mono`: 고대비 모노스페이스 (High-Contrast Monospace)
2. **브루탈리즘 & 네오 브루탈리즘 (Brutalism & Neo-Brutalism)**
   - `raw-brutalism`: 날것의 디지털 브루탈리즘 (Raw Digital Brutalism)
   - `neo-brutalism`: 트렌디 네오 브루탈리즘 (Trendy Neo-Brutalism)
   - `cyber-brutalism`: 사이버 브루탈리즘 (Cyber Brutalism)
3. **입체감 및 질감 스타일 (Depth & Materiality)**
   - `glassmorphism`: 프로스테드 글래스모피즘 (Frosted Glassmorphism)
   - `neumorphism`: 소프트 뉴모피즘 (Soft Neumorphism)
   - `skeuomorphism`: 모던 스큐어모피즘 2.0 (Modern Skeuomorphism 2.0)
4. **레트로 & 팝 아키텍처 (Retro & Pop Architecture)**
   - `memphis`: 멤피스 팝 아키텍처 (Memphis Pop Design)
   - `synthwave`: 80년대 신스웨이브 (80s Synthwave & Outrun)
   - `vaporwave`: 베이퍼웨이브 칠 (Vaporwave Chill)
5. **에디토리얼 & 오가닉 (Editorial & Organic)**
   - `high-fashion`: 하이패션 에디토리얼 (High-Fashion Editorial)
   - `fluid-organic`: 플루이드 오가닉 & 웜톤 (Fluid Organic & Warm Tone)
   - `dark-minimal-glass`: 다크모드 미니멀 글래스 (Dark Mode Minimal Glass)
6. **Y2K & 2000s 글로시 웹 (Y2K & 2000s Glossy Web)**
   - `y2k-chrome`: Y2K 크롬 & 홀로그램 (Y2K Chrome & Hologram)
   - `frutiger-aero`: Frutiger Aero 투명 아쿠아 (Frutiger Aero Aqua Gloss)
   - `pixel-arcade`: 8-Bit 픽셀 아케이드 (8-Bit Pixel Arcade)
7. **하이퍼 테크 & 키네틱 모션 (Hyper-Tech & Kinetic Motion)**
   - `kinetic-type`: 키네틱 타이포 & 모션 헤비 (Kinetic Typography & Motion)
   - `bento-grid`: Bento UI 2.0 정밀 그리드 (Bento UI 2.0 Precision Grid)
   - `acid-techno`: 애시드 그래픽 & 테크노 레이브 (Acid Graphics & Techno)
8. **소프트 3D & 솔라퓨처리즘 (Soft 3D & Solarpunk)**
   - `claymorphism`: 클레이모피즘 3D 버블 (Claymorphism & 3D Bubble)
   - `handcrafted-indie`: 핸드크래프트 콜라주 인디 (Handcrafted & Collage Indie)
   - `solarpunk-eco`: 솔라펑크 에코 퓨처리즘 (Solarpunk Eco-Futurism)
