# Implementation Audit Roadmap (`audit_roadmap.md`)
**Project Name:** Web Design Sample Selector (`design_sample_selector`)  
**Version:** 2.3.0
**Document Status:** Verification & Quality Audit Criteria  

살아 있는 계약은 `spec.md` v2.3.0이다. 구버전 숫자(5분류 / 15서브 / 10 BGM / 5 SFX / WASM 엔진)와 v2.2 인스펙터 기준은 폐기한다.

---

## 1. Audit Phase Matrix

| Phase | Milestone | Audit Focus | Verification Criteria | Status |
| --- | --- | --- | --- | --- |
| **Phase 1** | Scaffolding & Standard Documentation | D3D & Standard Compliance | 핵심 문서와 사용자 버전 표시가 제품 버전 2.3.0과 동기 | **READY** |
| **Phase 2** | Design Tokens & Global CSS | Responsive Layout & Token Integrity | 24 ID 듀얼/트리플 셀렉터, 슬라이더 0–64 / 0–12 / 0–30 / 0–32 / 0–2.0 | **READY** |
| **Phase 3** | Audio Synth & Canvas 2D Visual Engine | Audio & Canvas Performance | 16 BGM 트랙, 14 SFX, Canvas 2D 파티클(`pauseLoop`/`resumeLoop`). `.wasm` 없음 | **READY** |
| **Phase 4** | Taxonomy & Gallery | Search / Filter / Views | 8대분류 × 24 서브스타일, 실시간 검색(헤더 풀 리렌더 금지), 3 갤러리 모드 | **READY** |
| **Phase 5** | Detail / Split / Inspector | Live Sandbox & Export Contract | 최신 테마 기준 4탭/3 CSS 모드/복사/다운로드, 8 아키타입 HTML-CSS 선택자 계약, DTCG 2025.10, 스플릿 ARIA 탭 | **READY** |
| **Phase 6** | Quality Verification & Launch Gate | Automated + Browser Audit | `npm run check`, teardown 동일 루트, XSS `textContent`, 포커스 트랩, 복합 상태 전이 브라우저 검사 | **READY** |

---

## 2. Pass 1: Specification Compliance Audit Checklist

- [ ] All 8 main design categories and 24 canonical subcategory IDs defined in `spec.md` and `src/data/categories.js`.
- [ ] Alias IDs exist only as CSS/storage dual selectors, not as extra catalog rows.
- [ ] 16 ambient BGM presets and 14 SFX generators in Web Audio synth (`playSfx` does not allocate unused oscillators).
- [ ] Canvas 2D particle engine (no WebAssembly binary). Header badge is Canvas 2D.
- [ ] Kinetic simulators match spec §3.1 bullets 1:1 (`data-action`).
- [ ] Split compare includes all 8 archetypes; close restores `compareReturnView`.
- [ ] CSS and HTML snippet copy buttons exist.
- [ ] Theme A→B switch keeps CSS Full/Tokens/Component, HTML, Markdown, JSON, copy, and downloads on theme B.
- [ ] Reopening DETAIL initializes CSS/Full with matching active class, `aria-selected`, pane, submode, and label.
- [ ] All 8 generated component CSS selectors exist in the corresponding exported archetype HTML.
- [ ] All 24 token documents use DTCG 2025.10 structured values; gradient, transparent, rgba, layered shadow, and font family policies are covered.
- [ ] Integrated export is named `*-integrated-snapshot.txt` and described as a single review document, not a ZIP package.
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
- [ ] Split archetype tabs expose one `aria-selected="true"`, roving `tabindex`, linked tabpanels, and Arrow/Home/End navigation.
- [ ] `npm test` and `npm run build` pass through `npm run check`.

---

## 4. Pass 3: Security & Performance Audit Checklist

- [ ] No unsafe `eval()` or dynamic script execution.
- [ ] Comments / chat / toasts use `textContent` or `createElement`.
- [ ] Clipboard API calls guarded with user gesture.
- [ ] Canvas rAF pauses on modal overlay; respects `prefers-reduced-motion` physics skip.
- [ ] Every started AudioNode has `onended` → `disconnect()`.
