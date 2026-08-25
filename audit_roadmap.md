# Implementation Audit Roadmap (`audit_roadmap.md`)
**Project Name:** Web Design Sample Selector (`design_sample_selector`)  
**Version:** 2.2.2  
**Document Status:** Verification & Quality Audit Criteria  

살아 있는 계약은 `spec.md` v2.2.2다. 구버전 숫자(5분류 / 15서브 / 10 BGM / 5 SFX / WASM 엔진)는 폐기한다.

---

## 1. Audit Phase Matrix

| Phase | Milestone | Audit Focus | Verification Criteria | Status |
| --- | --- | --- | --- | --- |
| **Phase 1** | Scaffolding & Standard Documentation | D3D & Standard Compliance | 핵심 문서(`spec.md`, `README.md`, `designs.md`, `CHANGELOG.md`)가 제품 버전 2.2.2와 동기 | **READY** |
| **Phase 2** | Design Tokens & Global CSS | Responsive Layout & Token Integrity | 24 ID 듀얼/트리플 셀렉터, 슬라이더 0–64 / 0–12 / 0–30 / 0–32 / 0–2.0 | **READY** |
| **Phase 3** | Audio Synth & Canvas 2D Visual Engine | Audio & Canvas Performance | 16 BGM 트랙, 14 SFX, Canvas 2D 파티클(`pauseLoop`/`resumeLoop`). `.wasm` 없음 | **READY** |
| **Phase 4** | Taxonomy & Gallery | Search / Filter / Views | 8대분류 × 24 서브스타일, 실시간 검색(헤더 풀 리렌더 금지), 3 갤러리 모드 | **READY** |
| **Phase 5** | Detail / Split / Kinetic Simulators | Live Sandbox | 8 아키타입 시뮬레이터, 스플릿 8탭, HTML/CSS 복사, 스플릿 닫기 시 원 뷰 복귀 | **READY** |
| **Phase 6** | Quality Verification & Launch Gate | Final End-to-End Audit | teardown 동일 루트, SFX 미사용 노드 0, XSS `textContent`, 포커스 트랩 | **READY** |

---

## 2. Pass 1: Specification Compliance Audit Checklist

- [ ] All 8 main design categories and 24 canonical subcategory IDs defined in `spec.md` and `src/data/categories.js`.
- [ ] Alias IDs exist only as CSS/storage dual selectors, not as extra catalog rows.
- [ ] 16 ambient BGM presets and 14 SFX generators in Web Audio synth (`playSfx` does not allocate unused oscillators).
- [ ] Canvas 2D particle engine (no WebAssembly binary). Header badge is Canvas 2D.
- [ ] Kinetic simulators match spec §3.1 bullets 1:1 (`data-action`).
- [ ] Split compare includes all 8 archetypes; close restores `compareReturnView`.
- [ ] CSS and HTML snippet copy buttons exist.
- [ ] Backdrop blur slider applies to `.archetype-unit`.
- [ ] Slider ranges: Radius 0–64, Border 0–12, Shadow 0–30, Blur 0–32, Glow 0–2.0.
- [ ] Responsive breakpoints (<768px, 768px–1199px, >=1200px).

---

## 3. Pass 2: Engineering Quality Audit Checklist

- [ ] Zero external runtime JS framework dependencies.
- [ ] Pure browser Web Audio API oscillator synthesis (0KB audio files).
- [ ] `hydrateMockup` / `teardownMockup` use the same root (plus descendant sweep).
- [ ] Search `input` does not rebuild the entire header DOM.
- [ ] Asynchronous audio context resume handling for browser autoplay policies.
- [ ] Accessible HTML5 markup with aria attributes, focus trap, Esc.

---

## 4. Pass 3: Security & Performance Audit Checklist

- [ ] No unsafe `eval()` or dynamic script execution.
- [ ] Comments / chat / toasts use `textContent` or `createElement`.
- [ ] Clipboard API calls guarded with user gesture.
- [ ] Canvas rAF pauses on modal overlay; respects `prefers-reduced-motion` physics skip.
- [ ] Every started AudioNode has `onended` → `disconnect()`.
