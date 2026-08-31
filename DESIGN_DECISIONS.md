# Design Decisions Record (`DESIGN_DECISIONS.md`)
**Project Name:** Web Design Sample Selector (`design_sample_selector`)  
**Version:** 2.3.0
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
- **Outcome:** `requestAnimationFrame` 기반 canvas animation, audio-reactive spectrum, `pauseLoop`/`resumeLoop` on modal overlay, `prefers-reduced-motion` physics skip. No `.wasm` binary and no `WebAssembly` API. 프레임률은 기기와 부하에 따라 달라지므로 고정 수치로 보장하지 않는다.

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
- **Outcome:** 테마 전환 시 DOM을 재구축하지 않고 실행 중 상호작용 상태를 보존한다. 전환 성능은 실제 브라우저 프로파일로 평가하며 고정 지연 시간을 보장하지 않는다.

---

## 8. Decision 008: Universal Top Design Selector Bar (v2.2)

- **Context:** Previous modal navigation was restricted to cycling within the current category's 3 sub-styles, breaking user flow when comparing cross-category aesthetics on the same page archetype.
- **Decision:**
  - Build an integrated top selector bar featuring 8 major category tabs and 24 sub-style visual thumbnail chips.
  - Implement full keyboard shortcuts (`[` / `]` for styles, `Shift + Left/Right` for categories, `Esc` to close).
  - Sync style switches with procedural audio SFX (`THEME_SWAP`) and `appState`.
- **Outcome:** Seamless cross-category design exploration and instant comparative evaluation.

---

## 9. Decision 009: Reactive Inspector Export Contract (v2.3)

- **Context:** Run 7 감사에서 테마 교체 후 탭/다운로드가 이전 테마를 참조하는 stale closure, 실제 아키타입 DOM과 생성 CSS 선택자 불일치, DTCG 타입 값 오류, “전체 패키지” 형식의 모호성이 확인되었다.
- **Decision:**
  - 인스펙터·복사·다운로드는 이벤트 발생 시 `appState.selectedSubCategory`를 다시 해석하고, 장기 이벤트 클로저에 변경 가능한 디자인 객체를 보관하지 않는다.
  - 생성 CSS와 `getArchetypeHTML()`의 선택자 계약을 자동 테스트로 교차 검증한다.
  - 토큰 출력은 DTCG Final Community Group Report 2025.10으로 고정하고 color/gradient/dimension/shadow/fontFamily를 구조화하며 제품 메타데이터는 `$extensions`에 둔다.
  - 기존 단일 `.txt` 출력은 ZIP 패키지가 아니라 “통합 TXT 스냅샷”으로 명명하고 파일명과 UI 설명을 일치시킨다.
- **Alternatives Rejected:** ZIP 의존성 추가는 현재 검토용 단일 문서 사용 사례보다 비용이 크고, 기존 수동 CSS 선택자 목록을 테스트 없이 유지하는 방식은 동일 회귀를 차단하지 못한다.
- **Outcome:** 24개 테마와 8개 아키타입의 생성 계약이 `npm test`로 검증되며, 모달 재진입 상태와 스플릿 ARIA 탭 상태도 결정론적으로 관리된다.

---

## 10. Decision 010: Single-Contract Style Library for 120+ Designs

- **Status:** Accepted; Wave 0 `style-contract` implemented and verified (2026-08-30)
- **Context:** 기존 24종은 충분히 구별되도록 보강되어 Decision 006의 선행 조건을 충족했다. 그러나 스타일 정보, 런타임 CSS 토큰, 내보내기 토큰, 목업 switch, 썸네일, 모션이 여러 파일에 분산되어 있다. 누락된 토큰이나 렌더러가 Swiss 스타일로 조용히 대체되고, 개수와 Spectrum 시대 문구도 24종 기준으로 고정되어 있어 100종 이상 확장 시 오류와 탐색 비용이 급증한다.
- **Decision:**
  - `CAPABILITY_MAP.md`의 8개 모듈 경계와 의존성 순서를 채택한다.
  - 스타일·카테고리·facet·토큰·프리뷰 참조·출처를 하나의 버전된 공개 계약으로 관리한다.
  - 런타임 토큰과 내보내기 토큰은 같은 정규 원천에서 파생한다.
  - 누락된 내부 참조는 자동 폴백하지 않고 검증 단계에서 실패시킨다.
  - 상위 카테고리와 다중 facet을 함께 사용하고, 무거운 프리뷰는 지연 로딩한다.
  - 기존 24종을 먼저 무손실 이전한 뒤 36종, 60종, 100~120종 Wave로 확장한다.
- **Alternatives Rejected:**
  - 현재 파일 구조에 스타일을 계속 수동 추가하는 방식은 중복 원천과 자동 폴백 오류를 확대한다.
  - 색상과 폰트만 바꾼 변형을 대량 등록하는 방식은 실제 시안으로서의 비교 가치를 훼손한다.
  - 프레임워크·백엔드·외부 CMS 도입은 현재 정적 클라이언트 앱의 요구보다 비용과 운영 복잡성이 크다.
  - 모든 120종 프리뷰를 첫 화면에서 즉시 생성하는 방식은 Crostini Chrome을 포함한 저사양 환경의 DOM·모션 비용을 불필요하게 높인다.
- **Consequences:**
  - 초기 Wave 0에는 사용자에게 보이는 스타일 수 증가보다 계약 이전과 회귀 검증 작업이 먼저 수행된다.
  - 새 스타일은 출처, 접근성 메모와 시각적 차별성 검토를 포함한 팩 단위 완료 조건을 충족해야 한다.
  - 정확한 성능 예산은 사용자의 ChromeOS Crostini Linux Chrome에서 Wave 0 기준선을 측정한 뒤 고정한다.
  - 현재 v2.3.0의 24종 표시는 각 Wave가 실제로 완료될 때까지 유지한다.

---

## 11. Decision 011: Immutable Canonical Catalog with a Legacy Projection

- **Status:** Accepted, implemented, and verified (2026-08-30)
- **Context:** 기존 UI와 상태·내보내기 모듈은 `src/data/categories.js`의 평면 필드와 named export를 직접 사용한다. 한 번에 모든 소비자를 새 중첩 스키마로 변경하면 24종의 선택·저장 복원·내보내기 회귀 범위가 커지고, 공개 배열을 매 조회마다 깊게 복사하면 향후 120종에서 불필요한 할당이 반복된다.
- **Decision:**
  - `src/catalog/packs/core/`가 24개 `StyleRecord`를 소유하고 `src/catalog/index.js`만 정규 조회 API를 제공한다.
  - 레코드와 공개 컬렉션은 초기화 시 재귀 동결하고 `order` 후 ID로 안정 정렬한다.
  - `src/catalog/legacyAdapter.js`가 정규 레코드를 기존 `SubCategoryDesign`과 카테고리 트리로 투영하며, `src/data/categories.js`는 해당 export를 재노출하는 얇은 진입점으로 유지한다.
  - 미등록 외부 ID는 `null` 또는 빈 배열로 처리하고 다른 스타일로 자동 대체하지 않는다. 출판 상태는 기본적으로 `legacy/ready`만 노출한다.
- **Alternatives Rejected:**
  - 기존 단일 파일을 정규 원천과 병행 유지하면 같은 설명·alias·프리뷰 메타데이터가 다시 이중화된다.
  - 모든 소비자를 동시에 새 스키마로 바꾸면 UI 동작 변화와 데이터 이전 문제를 구분하기 어렵다.
  - 매 조회마다 전체 방어적 깊은 복사를 수행하면 정적 데이터의 안전성을 위해 반복 할당 비용을 지불한다.
- **Consequences:**
  - 현재 UI import 경로와 24개 저장 ID는 바뀌지 않는다.
  - 정규 토큰과 기존 런타임/내보내기 토큰은 `theme-generation`까지 일시적으로 중복되며 parity 테스트가 이를 감시한다.
  - `legacyAdapter`는 전환 계층이므로 새 모듈이 의존하는 공개 API로 확장하지 않는다.
  - 다음 단계는 데이터 자체와 토큰·프리뷰 참조의 오류를 빌드 전에 차단하는 `catalog-validation`이다.

---

## 12. Decision 012: Structured Build Validation with Visible Legacy Debt

- **Status:** Implemented (2026-08-30)
- **Context:** 정규 카탈로그가 생겼지만 현재 JavaScript 데이터는 빌드 전에 구조와 관계를 강제하지 않는다. 동시에 기존 24개 `legacy` 레코드는 출처와 접근성 메모가 비어 있어 모든 공백을 즉시 오류로 만들면 정상 애플리케이션 빌드까지 중단된다. 프리뷰 구현도 아직 switch와 CSS에 분산되어 영구 레지스트리가 없다.
- **Decision:**
  - 순수 검증 API는 데이터 오류를 모두 구조화된 `code/severity/path` 보고서로 반환하고 CLI·prebuild 경계만 실패를 예외와 종료 코드로 승격한다.
  - 필수 구조, ID, 관계와 알 수 없는 참조는 모든 출판 상태에서 오류로 처리한다.
  - 출처·신뢰 출처·접근성 메모·계산 가능한 대비 공백은 `ready`에서 오류, `legacy/draft/review`에서 경고로 처리한다.
  - 기본 빌드는 오류만 차단하고 `--strict`에서 경고도 차단한다. 현재 경고는 코드별 기준선으로 테스트해 보이지 않는 부채가 되지 않게 한다.
  - 후속 `preview-registry` 전까지 현재 renderer/thumbnail/motion ID를 임시 참조 인벤토리로 제공하되 렌더 디스패치의 새 원천으로 확장하지 않는다.
  - 진단 code/path/order는 안정 인터페이스로 유지하고 사람용 message 문구는 기계 소비 계약에서 제외한다.
- **Alternatives Considered:**
  - 모든 경고를 즉시 빌드 오류로 처리하면 실제 데이터 품질을 높이기 전에 기존 24종 빌드를 막고 허위 메타데이터를 채울 유인을 만든다.
  - 경고 없이 legacy 공백을 무시하면 부채가 Wave 3까지 조용히 누적된다.
  - 런타임에서 Swiss로 대체하면 잘못된 새 스타일이 사용자에게 정상 시안처럼 노출된다.
  - 지금 preview registry 전체를 함께 구현하면 승인된 모듈 의존 순서와 변경 범위를 넘는다.
- **Consequences:**
  - 현재 앱은 오류 0개와 legacy 경고 56개(`ACCESSIBILITY_NOTES_REQUIRED` 24, `SOURCE_REQUIRED` 24, `CONTRAST_LOW` 5, `CONTRAST_UNCHECKED` 3)의 명시적 기준선으로 계속 빌드된다.
  - 새 `ready` 스타일은 출처와 접근성 기본 조건을 충족하지 않으면 등록할 수 없다.
  - 임시 참조 인벤토리는 의도적인 중복이며 `preview-registry`에서 교체해야 한다.
  - 검증기는 Node 전용 진입점에 남아 브라우저 번들 크기와 런타임 상태에 영향을 주지 않는다.
  - `validate:catalog`과 `prebuild` 연결, 집중 테스트 24개, 전체 테스트 49개, Crostini Chrome 151 회귀로 결정 구현을 확인했다.
  - **2026-08-30 후속 구현:** Decision 014의 정규 preview registry가 같은 `ReferenceInventory` 계약을 제공하면서 임시 수동 목록을 제거했다. 진단 code/path와 오류 0·경고 56 기준선은 유지된다.

---

## 13. Decision 013: Generated Static Themes from Canonical Tokens

- **Status:** Accepted and Implemented (2026-08-30)
- **Context:** 현재 24종의 같은 13개 값이 정규 `StyleRecord.tokens`, `src/styles/themeTokens.css`, `designSpecGenerator.js`의 `THEME_TOKENS_MAP`에 세 번 존재한다. 값 parity는 현재 모두 맞지만 스타일 수가 120종으로 늘면 수동 복사 누락과 런타임·내보내기 불일치 가능성이 선형으로 증가한다. 세 스타일에는 토큰이 아닌 컨테이너 `backdrop-filter`도 있어 단순히 13개 토큰만 CSS로 직렬화하면 시각 회귀가 난다.
- **Decision:**
  - 스타일별 13개 값은 `StyleRecord.tokens`만 사람이 작성하고 CSS custom property, 호환 map과 내보내기 조회는 정규 카탈로그에서 파생한다.
  - 선택적 컨테이너 효과는 `themeEffects.backdropBlur`로 토큰 및 `defaultTweaks`와 분리한다.
  - `themeTokens.css`는 결정론적 생성 파일로 저장소에 추적한다. 명시적 생성 명령만 쓰고 `prebuild`는 stale 여부만 검사한다.
  - 런타임 JS style injection은 사용하지 않고 현재 Vite 정적 CSS import를 보존한다.
  - 정규/alias 해석 실패는 `null` 또는 기존 미선택 산출물로 처리하고 Swiss로 자동 대체하지 않는다.
  - 기존 24종의 selector·선언 의미와 CSS/Markdown/DTCG 출력 행렬을 해시 및 Crostini Chrome computed style로 검증한다.
- **Alternatives Considered:**
  - 런타임에서 카탈로그를 순회해 `<style>`을 주입하면 생성 파일은 없어지지만 첫 렌더 깜빡임, CSP 경계와 브라우저 부팅 경로 복잡성이 생긴다.
  - `prebuild`가 CSS를 자동 덮어쓰면 편리하지만 일반 빌드가 작업 트리를 변경하고 원천 누락을 리뷰에서 놓칠 수 있다.
  - `backdrop-filter`를 `defaultTweaks.backdropBlur`에서 자동 파생하면 현재 `bento-grid`의 기준 효과 `16px`와 tweak 기본값 `12px` 차이를 없애 시각 결과가 바뀐다.
  - 기존 map과 CSS를 계속 수동 관리하면 `style-pack-authoring`이 새 스타일마다 세 파일 편집을 요구해 단일 원천 목표를 달성하지 못한다.
- **Consequences:**
  - 새 스타일은 정규 레코드와 선택 효과만 작성하고 생성 명령으로 런타임 CSS와 호환 조회를 얻는다.
  - 카탈로그 토큰을 수정하고 CSS를 갱신하지 않으면 빌드가 복구 명령과 함께 실패한다.
  - 생성 CSS는 사람이 직접 수정하지 않으며 리뷰는 원천 diff와 생성 diff를 함께 본다.
  - `themeEffects`는 스키마 v1의 선택적 하위 호환 필드로 추가되고 검증기가 허용 키와 값을 강제한다.
  - `THEME_TOKENS_MAP` 공개 이름은 유지되지만 정규 투영에서 만들어지며 `designSpecGenerator.js`의 수동 24종 값은 제거되었다.
  - `generate:themes`만 추적 CSS를 쓰고 `check:themes`는 read-only 종료 코드 0/1/2 계약으로 `prebuild`에 연결되었다.
  - 24종 map·runtime CSS·Live CSS 576·Markdown 384·DTCG 24 승인 해시, 전체 63개 테스트와 Crostini Chrome 151의 45-selector computed style 검증으로 구현을 확인했다.
  - 프로덕션 번들에 Node CLI가 포함되지 않았고 JavaScript는 `75.35 kB` gzip, CSS는 `21.79 kB` gzip이었다. 신규 외부 의존성은 없다.

---

## 14. Decision 014: Static Preview Registry with Explicit Render Failures

- **Status:** Accepted, implemented, and verified (2026-08-30)
- **Context:** 결정 당시 Web 목업은 `mockupTemplates.js`의 24분기 switch, 썸네일은 renderer ID 기반 별도 객체, motion은 검증 없는 class 문자열, catalog validation은 수동 `legacyReferenceInventory.js`에 의존했다. 알 수 없는 renderer는 Swiss, 알 수 없는 thumbnail은 일반 `Aa`, 누락 motion은 `none`으로 대체되어 새 스타일의 잘못된 참조가 정상 시안처럼 보일 수 있었다. 반면 현재 24종의 120개 HTML 출력과 8대 archetype state는 실제 사용자 시안의 호환 기준이었다.
- **Decision:**
  - renderer, thumbnail, motion 구현을 정적 ES Module definition으로 등록하고 초기화 시 동결 registry로 조립한다.
  - 외부 기능 조회는 `false`/`null`, 실제 렌더와 구성 실패는 안정 code/property의 `PreviewRegistryError`로 구분한다.
  - thumbnail은 `thumbnailId`로 직접 디스패치하며 renderer ID를 fallback key로 쓰지 않는다.
  - 현재 `brutalism` renderer 호환 별칭은 `raw-brutal`로 명시하되 정규 inventory에는 포함하지 않는다.
  - motion은 unit/effect class와 실제 구현 channel을 기술하고, ID 전용 구현이 없는 legacy 항목은 숨기지 않고 `metadata-only`로 표현할 수 있다.
  - catalog validation의 참조 inventory는 registry 정규 ID와 asset 경로에서 결정론적으로 파생한다.
  - Wave 0은 현재 동기 렌더 흐름을 유지하고 runtime plugin, remote code와 dynamic import를 제공하지 않는다.
  - 정상 24종의 120-output SHA-256과 Crostini Chrome 151의 Web/archetype/device 행렬로 호환을 증명한다.
- **Alternatives Considered:**
  - 기존 switch와 수동 inventory를 계속 확장하면 120종에서 renderer·thumbnail·validation 목록의 누락 가능성이 선형으로 커진다.
  - runtime mutable registration은 테스트 순서와 import side effect에 따라 결과가 달라지고 현재 정적 앱에 필요한 확장성을 넘어선다.
  - 지금 async dynamic import를 도입하면 race/loading/error UI까지 동시에 바뀌어 Wave 0의 무손실 이전 범위를 흐린다.
  - 미등록 참조를 Swiss나 generic thumbnail로 대체하면 catalog validation을 우회한 오류가 사용자에게 정상 디자인처럼 노출된다.
  - registry 이전과 함께 새 motion을 만들면 구조 회귀와 시각 변경 원인을 분리하기 어렵다.
- **Consequences:**
  - renderer/thumbnail/motion 정규 ID와 asset inventory는 하나의 등록 원천에서 파생된다.
  - 정상 catalog 데이터는 prebuild에서 먼저 검증되므로 render throw는 사용자 복구 흐름이 아니라 개발 회귀 신호다.
  - 기존 `getMockupHTML()`은 정상 입력 호환을 위한 얇은 위임 계층으로 유지되며 unknown fallback은 사라진다.
  - motion descriptor는 현재 구현 부채를 가시화하지만 이 모듈 자체에서 시각 품질을 변경하지 않는다.
  - 미래 지연 로딩은 정규 ID·capability·오류 계약을 유지한 채 `render-scalability`에서 별도 설계한다.
  - 승인된 `SPEC-preview-registry.md`, `tasks/plan.md`, `tasks/todo.md`에 따라 Tasks 1–12의 renderer/thumbnail parity, motion descriptor·hydration, 24/24/24/0 derived inventory, 공개 UI/Web archetype 소비자 연결, 문서 인수인계와 독립 최종 감사를 완료했다. 120-output hash, 표적 30개·전체 93개 테스트, catalog 0/56·theme·40-module build와 Chrome 151의 Web 96개·Desktop/Mobile 384개·reduced-motion·24장 시각 행렬·앱 diagnostics 0을 통과했다. 비밀정보·임시 자원·중복 원천·Node 전용 browser import 검색에서도 finding이 없었다.

---

## 15. Decision 015: Additive Core 36 Wave Modules and Browser-Proven Visual QA

- **Status:** Accepted, implemented, and verified (2026-08-30)
- **Context:** 사용자는 실제 디자인 시안으로 쓸 수 있는 120종 장기 목표를 승인하고 첫 단계로 24→36종을 요청했다. 기존 24종은 해시·저장 ID·테마·프리뷰 호환 기준선이므로 대형 파일에 신규 분기를 섞으면 시각 변경과 구조 회귀를 구분하기 어렵다. 또한 Node의 문자열·DOM fixture만으로는 Desktop/Mobile의 실제 크기, 중첩 interactive markup, 브라우저 parser 보정과 화면 구별성을 증명할 수 없다.
- **Decision:**
  - 신규 12종 데이터와 renderer·thumbnail·motion·CSS를 각각 `*-wave-1.js`와 `wave1-styles.css`에 추가형 모듈로 분리하고 catalog/registry 조립 경계에서만 기존 24종과 합친다.
  - 신규 레코드는 모두 출처·접근성 메모·4.5:1 텍스트 대비를 갖춘 `ready` 상태로 제공하며 개별 품질 검증 오류·경고 0을 요구한다.
  - 기존 24종의 120-output 및 theme/export hash는 legacy subset fixture로 그대로 유지하고 Core 36 전체의 180-output fixture를 별도로 고정한다.
  - thumbnail은 상위 버튼 안에 삽입되는 장식 markup이므로 내부 interactive element를 금지한다. renderer의 실제 조작은 기존 `data-mock-action` 경계가 소유한다.
  - DTCG shadow는 항상 구조화된 shadow 값이어야 하므로 CSS `none`을 문자열로 내보내지 않고 투명한 zero shadow로 정규화한다.
  - Crostini의 `/usr/bin/google-chrome`을 격리 profile로 구동하는 재현 가능한 QA 스크립트를 두고, 세 갤러리 모드·6개 주요 viewport·Core 36 × 8 × Desktop/Mobile 576상태·신규 12종 집중 Detail·Split·reduced-motion·application diagnostics를 검사한다.
- **Alternatives Considered:**
  - 기존 `renderers.js`, `thumbnails.js`, `motions.js`, `interactive.css`에 직접 12종을 이어 붙이면 파일 경계는 적지만 기존 24종의 호환 영역과 신규 시각 영역이 다시 결합된다.
  - 36종을 데이터와 generic preview만으로 채우면 숫자는 늘지만 사용자가 요구한 실제 디자인 시안과 시각적 차별성 기준을 만족하지 못한다.
  - Node 출력 hash만으로 완료하면 browser HTML parser가 중첩 버튼을 재구성하는 문제와 실제 device 폭·overflow를 놓친다.
  - Wave 1과 함께 facet UI·가상화까지 도입하면 콘텐츠 저작 증명과 탐색·성능 구조 변경의 실패 원인을 분리하기 어렵다.
- **Consequences:**
  - 현재 core pack은 legacy 24 + ready 12의 36종이고 preview inventory는 renderer/thumbnail/motion/asset `36/36/36/0`이다.
  - 신규 12종은 네 Web 탭, 독립 thumbnail, 실제 motion channel, 반응형·reduced-motion CSS와 편집 근거를 갖는다. 외부 이미지·폰트·오디오 asset은 추가하지 않았다.
  - Chrome 151 QA 중 Flat Design thumbnail의 중첩 `button`이 Detail/Split DOM을 깨는 문제를 발견했다. 이를 장식 `span`으로 바꾸고 전체 36종 thumbnail에서 interactive tag를 금지하는 회귀 검사를 추가했다.
  - 자동 게이트는 106개 Node 테스트, catalog 오류 0/legacy 경고 56, ready 12 오류·경고 0, 현재 theme CSS와 production build를 통과했다. Chrome 576상태는 Desktop outer root `735–745px`, Mobile `380px`, 실패 0이었고 증거는 `.antigravity/archive/wave1-chrome-qa/`에 보존한다.
  - Wave 2는 시작하지 않는다. 60종 진입 전에 `catalog-discovery`, `render-scalability`, `style-pack-authoring`의 사양·구현·승인을 완료한다.

---

## 16. Decision 016: Canonical Discovery Query, URL State, and Era-driven Spectrum

- **Status:** Accepted, implemented, and verified (2026-08-30)
- **Context:** Core 36까지는 이름과 8개 상위 카테고리만으로도 둘러볼 수 있었지만, 60~120종에서는 계보·매체·질감·밀도·분위기 같은 긴 꼬리 스타일을 찾기 어렵다. 기존 북마크 보기는 category처럼 취급되어 두 조건을 함께 적용할 수 없었고, Grid/Bento/Spectrum은 서로 다른 필터·순서 논리를 가질 가능성이 있었다. Spectrum의 고정 시대 문구도 정규 `classification.era`와 연결되지 않아 새 스타일을 추가할 때 쉽게 어긋났다.
- **Decision:**
  - `src/catalog/discovery.js`를 DOM과 app state를 모르는 검색·facet·정렬·시대 그룹의 순수 원천으로 두고 세 보기 모두 같은 canonical 결과를 소비한다.
  - 서로 다른 facet은 AND, 하나의 multiple facet 값은 OR이며 single facet은 하나만 유지한다. category와 bookmark는 독립 조건으로 동시에 적용한다.
  - URL은 `q`, `category`, 반복 `f`, `sort`, `view`, `saved`를 안정 순서로 직렬화한다. 검색 입력 중에는 `history.replaceState`를 사용하고 initial load와 `popstate`에서 상태를 복원한다.
  - discovery controls를 header와 main 사이의 독립 root로 두고 native `details`, radio/checkbox, label/legend, polite live status, 활성 조건 chip과 empty reset을 제공한다.
  - `galleryModel.js`가 공통 결과를 Grid의 category groups, Bento의 global order, Spectrum의 실제 `classification.era.start` groups로 투영한다.
  - 검색은 120자로 제한하고 외부 URL/facet 값을 허용 목록으로 정규화하며 사용자 문자열은 마크업 출력 전에 escape한다.
- **Alternatives Considered:**
  - header 내부에 10개 facet까지 모두 넣으면 검색 caret 갱신과 제어판 열림·포커스 수명주기가 결합되고 모바일 정보 밀도가 지나치게 높아진다.
  - 검색 입력마다 `pushState`를 사용하면 문자 단위로 브라우저 history가 쌓여 뒤로 가기 동작이 실용적이지 않다.
  - Spectrum 시대를 category별 문구로 계속 관리하면 정규 시대 정보와 두 번째 원천이 생기고 Wave마다 수동 갱신이 필요하다.
  - 이 단계에서 virtualization이나 dynamic import까지 도입하면 탐색 정확성 회귀와 성능 구조 변경을 분리해 검증하기 어렵다.
  - 외부 검색 dependency나 서버 index는 현재 36종의 정적 메타데이터 규모와 client-only 배포 계약에 불필요하다.
- **Consequences:**
  - 한국어·영어·alias·category·facet metadata 검색, category+bookmark, 10개 facet, 네 정렬과 URL 공유/복원이 한 계약으로 동작한다.
  - 세 보기는 같은 canonical ID 집합을 표시하되 의도된 표현 순서만 다르다. Grid/Spectrum의 grouping 순서를 전역 정렬과 동일하다고 가정하지 않는다.
  - 10개 facet은 기본 접힘 상태의 compact row이고 열린 facet만 전체 폭을 사용한다. 모바일 44px target, focus-visible, reduced-motion과 빈 상태 포커스 복원이 고정됐다.
  - 탐색 집중 테스트 15/15와 전체 121/121, catalog 오류 0/legacy 경고 56, 생성 테마 최신 상태와 Vite build가 통과했다. 격리 Chrome `151.0.7922.173`에서 시나리오 9개, 6개 폭, 세 보기, 88개 입력, console/network/application diagnostics와 issue 0을 확인했고 증거는 `.antigravity/archive/catalog-discovery-chrome-qa/`에 보존한다.
  - 현재 결과는 Core 36이며 Wave 2를 시작하지 않았다. 다음 모듈은 중복 query 비용과 대량 DOM·모션 예산을 측정하는 `render-scalability`다.

---

## 17. Decision 017: Bounded Visual DOM and Retryable On-demand Preview Chunks

- **Status:** Accepted, implemented, and verified (2026-08-31)
- **Context:** Core 36 기준 Detail은 72개, Split은 108개 thumbnail을 만들고 초기 동기 JS는 `98.87kB` gzip이었다. 실제 콘텐츠를 60~120종으로 늘리면 사용자가 보지 않는 스타일의 thumbnail·component renderer까지 DOM과 초기 bundle에 비례해 포함된다. 단순히 CSS로 숨기거나 전체 목록을 계속 렌더하면 메모리·observer·모션 비용이 줄지 않으며, 같은 `import()` URL의 첫 요청 실패는 브라우저 module map에 남아 Promise cache만 초기화해도 재시도가 실패한다.
- **Decision:**
  - canonical 결과 전체는 메모리에 유지하되 시각 DOM은 Gallery 36개, Detail 24개, Split 슬롯당 12개로 제한한다. Gallery local page와 picker 검색으로 모든 ID에 도달하고 Split native select는 전체 option을 유지한다.
  - `src/scalability/renderWindow.js`가 순수 window/picker 및 수치 예산을 소유하고 UI는 이 결과만 마크업으로 투영한다.
  - preview entry를 thumbnail, motion, component로 나눈다. 초기 경로는 thumbnail/motion을 사용하고 Detail/Split, Peek/확정 component renderer는 중앙 loader의 literal dynamic import로 최초 사용 때만 불러온다. 기존 `src/preview/index.js` 동기 API는 호환 facade로 유지한다.
  - loader는 동시 호출 Promise를 공유하고 request token/current state로 stale mount를 막는다. 첫 import 실패 뒤에는 같은 component implementation을 가리키는 별도 retry facade URL로 전환하며 loading/error/retry/cancel 상태를 화면에 제공한다.
  - thumbnail observer는 render 수명에 결합하고 offscreen/reduced-motion animation을 중지한다. 초기 UI는 정상 레이아웃 안에서 `visibility:hidden`으로 구성한 뒤 `document.fonts.ready` 후 노출해 웹 폰트 교체 CLS를 막는다.
  - production `dist/index.html`의 정적 module/modulepreload/CSS만 gzip 합산하는 analyzer와 격리 Crostini Chrome의 Core 36 + synthetic 60/120 QA를 반복 게이트로 둔다.
- **Alternatives Considered:**
  - 120종 전체 DOM을 만들고 CSS로 숨기면 layout 표시만 바뀌고 생성·메모리·observer 비용은 그대로다.
  - 무한 스크롤은 위치·전체 범위·키보드 도달성 검증이 복잡하고 현재 정적 카탈로그에는 명시적 페이지가 더 예측 가능하다.
  - 외부 virtualization library나 framework 도입은 현재 규모에서 dependency·접근성·번들 비용이 크며 순수 window로 필요한 상한을 충족한다.
  - native select까지 12개로 제한하면 visual window 밖 스타일의 확실한 전체 접근 경로가 사라진다.
  - 실패한 동일 dynamic import URL의 Promise만 버리면 Chrome module map이 같은 실패를 반환하므로 실제 재시도가 되지 않는다.
  - 초기 앱을 `display:none`으로 두거나 detached 상태에서 완성한 뒤 삽입하면 빈 문서 뒤 전체 UI가 나타나는 이동 또는 연결 뒤 웹 폰트 swap이 CLS로 기록됐다. 정상 flow의 `visibility:hidden`은 기하를 먼저 확정하면서 보이는 이동을 만들지 않는다.
- **Consequences:**
  - 초기 동기 JS는 `98.87kB`에서 `62.78kB` gzip으로 줄었고 CSS는 `32.86kB` gzip이다. Chrome 151 최종 LCP `516ms`, CLS `0`을 기록했다.
  - synthetic 60/120의 세 보기에서 모든 ID에 도달했고 visual 상한, selected pinning, observer cleanup, reduced-motion, loading/error/retry, 320/768/1024/1440px와 diagnostics/issue 0을 통과했다. synthetic 120 interaction 최댓값은 `81.0ms`였다.
  - 실제 사용자 catalog는 Core 36이며 synthetic fixture는 QA에만 존재한다. 다음 게이트는 `style-pack-authoring`이고 Wave 2 콘텐츠는 시작하지 않았다.
  - CSS 예산은 `33.00kB` 중 `32.86kB`를 사용해 여유가 144 bytes뿐이다. 다음 팩은 초기 stylesheet에 무조건 합치지 말고 CSS 전달 경계와 예산을 먼저 결정해야 한다.

---

## 18. Decision 018: Actual 120 via Explicit Data Packs and Async Expansion Presentation

- **Status:** Accepted, implemented, and verified (2026-08-31)
- **Context:** 사용자는 36→60→120을 장기간 순차 출시하기보다 실제 디자인 시안으로 바로 활용할 수 있는 총 120종을 한 번에 요청했다. 기존 36종의 ID·저장값·출력 지문을 유지하면서 신규 84종이 단순 팔레트 변형이 되지 않아야 했고, 초기 CSS는 이미 `33.00kB` 예산 중 `32.86kB`를 사용하고 있었다.
- **Decision:**
  - actual catalog를 Core 36 + 7개 expansion pack × 12종으로 구성하고 8개 category를 각각 15종으로 맞춘다.
  - `authoring.js`의 21개 시각 문법은 분류·토큰 기본값·출처·접근성 원칙을 소유하되, 84개 blueprint는 이름·팔레트·요약·모티프·프리뷰 ID를 명시적으로 기록한다.
  - 신규 84종은 고유 renderer·thumbnail·motion definition을 가지며 asset fallback과 다른 스타일 fallback을 허용하지 않는다. thumbnail은 inline presentation으로 초기 CSS를 추가하지 않는다.
  - 기존 36종 생성 테마는 initial `themeTokens.css`에 유지하고 신규 84종 생성 테마와 21개 문법 CSS는 `componentEntry.js`의 guarded dynamic import로 전달한다.
  - 기존 24·36 subset의 승인 지문은 유지하고 actual 120 전체 지문을 별도 고정한다. Crostini Chrome 전용 게이트는 세 보기 전체 도달과 120×8×Desktop/Mobile 1,920상태를 검증한다.
- **Alternatives Considered:**
  - 84종을 기존 core 파일과 대형 renderer switch에 직접 추가하면 기존 지문과 신규 시각 변경을 분리하기 어렵고 팩별 검토·출처 소유권이 흐려진다.
  - 84종을 색상·카피만 바꾼 하나의 generic component로 제공하면 숫자는 충족하지만 사용자가 요구한 실제 디자인 시안의 구조적 차이를 충족하지 못한다.
  - expansion CSS를 initial stylesheet에 합치면 CSS hard budget을 즉시 넘으므로 현재 코드 분할 경계와 모순된다.
  - 외부 이미지·폰트·프레임워크를 추가하면 라이선스·네트워크·번들 변수가 생기고 client-only 무에셋 계약을 훼손한다.
- **Consequences:**
  - 공개 inventory는 renderer/thumbnail/motion/asset `120/120/120/0`, 신규 ready 84종 단독 품질은 오류·경고 0, 전체는 기존 legacy 경고 56만 유지한다.
  - 초기 JS/CSS는 `83.46/32.86kB` gzip으로 `88.98/33.00kB` 예산 안에 남고 expansion CSS 두 파일은 component 경계 뒤에 요청된다.
  - Chrome 151에서 actual 120 전 페이지, 1,920 device 상태, Web 480탭, 신규 84/84 device grid 변화, Detail·Split·Peek·Dock·reduced-motion, LCP `732ms`·CLS `0`·interaction max `142.8ms`, diagnostics/issue 0을 통과했다.
  - 팩 factory는 반복 필드를 줄이지만 21개 문법을 공유하는 네 시안 간 구성적 유사성은 남는다. 후속 시각 개선은 canonical ID·출처·반응형·bundle 계약을 유지한 채 스타일별 markup/CSS를 점진적으로 특화한다.

---

## 19. Decision 019: Renderer-Coherent Style Switching and Audit 9 Recovery Boundaries

- **Status:** Accepted; repository/local Crostini remediation verified (2026-08-31)
- **Context:** 9차 최종 감사에서 같은 아키타입의 스타일 A→B 전환이 선택 ID와 theme metadata만 B로 바꾸고 A renderer HTML·motion·Inspector payload를 남기는 결함이 확인됐다. 기존 Decision 007의 “DOM 자체를 보존하는 zero-rebuild”와 actual 120의 “스타일별 distinct renderer”는 동시에 충족할 수 없다. 또한 checkout modal, Blog reading mode, lazy focus lifecycle, malformed state·Clipboard·AudioContext·timer/input 경계가 문서 또는 정상 상태와 어긋났다.
- **Decision:**
  - Decision 007의 literal inner-DOM preservation을 폐기하고 `#mockup-viewport` identity 보존 + 내부 renderer 재생성 + runtime snapshot migration으로 대체한다. 선택 ID, renderer root/text, motion descriptor/effect, 4×3 Inspector가 한 상태를 가리켜야 한다.
  - snapshot은 아키타입별 승인 필드와 표준 form controls만 옮긴다. 이전 스타일의 HTML, 카피, class 또는 motion class는 이식하지 않는다. Checkout처럼 일시적인 modal은 전환 때 닫는다.
  - E-commerce direct/cart checkout을 구분하는 실제 focus-trapped dialog를 구현하고, Blog light mode는 computed color와 `aria-pressed`, progress는 실제 responsive scroll owner를 사용한다.
  - lazy Detail은 성공한 Detail과 같은 opener/focus/Escape 복구 계약을 사용한다. Peek와 Confirm Sheet는 modal이 아닌 preview region으로 명시하고 선택 theme만 투영한다.
  - app state 공개 mutation은 enum·canonical ID·tuple shape를 검증한다. bootstrap은 visible fatal/retry boundary, Clipboard와 Audio는 결과 기반 상태를 제공한다.
  - comment/chat 500자·동적 history 50개 상한과 timeout/rAF/popstate cleanup ownership을 적용한다. 성능 `median 120ms/max 200ms` 계약은 낮추지 않는다. hard metric은 실제 상태 변화가 있는 operation만 페이지 안에서 input dispatch→요구 state/DOM 정착까지 하나의 clock으로 재고 CDP 왕복과 외부 polling을 제외한다. 이미 활성인 control 재선택 같은 no-op은 집계하지 않는다. 정착 후 2개 animation frame wall time과 Long Task는 별도 presentation 진단치로 함께 보존해 제품 처리와 Crostini/headless frame scheduling을 혼합하지 않으며, 동일 조건 직렬 3회 모두 hard metric을 통과해야 한다.
  - 운영 CSP/Google Fonts는 배포 플랫폼과 URL이 없으므로 저장소에서 임의 정책을 추가하지 않는다. 실제 배포 확인 전 `미확정` 위험으로 유지한다.
- **Alternatives Considered:**
  - `data-theme`만 교체하고 stale renderer를 허용하면 distinct renderer와 Inspector 진실성이 깨진다.
  - 스타일 전환 때 모든 local state를 버리면 `spec.md`가 명시한 cart/game 보존 계약을 낮춘다.
  - 이전 DOM 전체를 clone/patch하면 style-specific structure와 이벤트·timer ownership을 함께 복사해 ghost state를 만든다.
  - 호스팅을 모른 채 meta CSP를 넣으면 inline style, dynamic CSS, Google Fonts 요구를 잘못 차단하거나 실제 response header와 이중 정책이 될 수 있다.
  - 정착 후 2개 animation frame을 제품 처리 hard metric에 합치면 이미 완료된 DOM 작업과 headless compositor scheduling을 구분하지 못한다. 반대로 frame 구간을 버리지 않고 별도 진단치로 보존해야 paint 누락이나 host throttling을 숨기지 않는다.
- **Consequences:**
  - 전환 비용은 단순 attribute swap보다 크지만 bounded Detail viewport 한 개만 다시 만들며 성능 hard gate로 제한한다.
  - runtime state의 직렬화/복원 계약과 브라우저 stateful transition 회귀 검사가 새 유지보수 표면이 된다.
  - Decision 007의 “shared template + state preservation” 목표는 유지하지만 구현 수단인 literal zero-rebuild만 이 결정이 대체한다.
  - 기존 Chrome interaction 수치는 driver 왕복이 섞인 wall-clock 표본이라 FIN-F006 종결 근거에서 제외한다. 독립 재감사 `250.1/133.7/96.4ms` 관측과 네 회귀 결함, 후속 sidebar flex 축소를 해소한 뒤 no-op을 제외한 browser-local hard metric 직렬 3회가 `20.95/51.6ms`, `20.4/121.1ms`, `21.45/131.9ms`(median/max), diagnostics/issue 0으로 통과했다. 현재 Node는 180/180, build는 76 modules, 초기 JS/CSS는 `88.60/32.86kB` gzip이다.

---

## 20. Decision 020: Built Pages Artifact and Bounded Preview Recovery

- **Status:** Accepted; live deployment verification pending (2026-08-31)
- **Context:** Audit 10에서 live GitHub Pages가 Vite `dist`가 아니라 source root를 게시해 `componentEntry.js`의 CSS imports가 native ESM MIME 오류로 실패하는 것이 확인됐다. primary/retry facade가 같은 shared graph를 사용하고 마지막 importer를 무제한 반복했으며, Peek affordance와 mount rollback·운영 진단도 계약과 달랐다.
- **Decision:**
  - Vite base는 `/design_sample_selector/`이고 GitHub Actions만 `dist` directory artifact를 게시한다. recursive closure/release manifest가 누락·source entry·base 오류를 배포 전에 차단한다.
  - Peek/확정 component graph와 Detail/Split 전체 graph는 서로 다른 두 복구 경계다. 각각 primary + retry 한 번만 허용하고 두 번째 실패 뒤 terminal reload/cancel 상태로 끝낸다.
  - mount subscription은 초기 callback 성공 후에만 commit하며 render/hydrate throw는 DOM·handler·runtime을 rollback한다. 안전한 recovery diagnostic은 bounded memory에 phase/attempt/resource class만 보존한다.
  - Peek는 native Detail button과 실제 double click을 제공한다. renderer output의 executable sink와 oversized/corrupt localStorage를 경계에서 거부한다.
- **Alternatives Considered:**
  - source root를 계속 게시하면서 CSS import를 `<link>`로 바꾸는 방식은 Vite chunk graph, hashed assets와 atomic release를 우회해 같은 종류의 운영 차이를 남긴다.
  - shared graph까지 duplicate bundle로 복제하면 작은 bundle 예산을 소모하고 근본적인 module-map failure를 숨긴다. bounded terminal과 reload가 더 정직하다.
  - Detail 안에 두 번째 component loader를 추가하면 같은 graph에 중복 recovery owner가 생기므로 Detail module import 하나를 유일 경계로 유지한다.
- **Consequences:**
  - repository/build/Pages-like 검증과 actual deployment 검증이 분리된다. workflow를 push하고 Pages Source를 GitHub Actions로 선택하기 전 live HOLD는 해제할 수 없다.
  - GitHub Pages의 고정 cache header와 이전 hash grace retention 부재는 플랫폼 잔여 위험이다. directory artifact와 release manifest로 partial publish를 차단하고 live smoke에서 stale/fresh context를 함께 확인한다.
  - arbitrary deep pathname은 지원하지 않으며 root + query/hash만 제품 계약이다.

---

## 21. Decision 021: Semantic Radius and Dependency-Free Lazy Locale Packs

- **Status:** Accepted, implemented, and repository/local Crostini verified (2026-08-31)
- **Context:** 두 expansion grammar의 장식용 `999px`가 theme radius와 tuner default에 동시에 투영되고, Detail CSS가 root와 38개 surface/control을 강제로 둥글게 만들었다. 동시에 5개 언어 요구는 locale state, catalog display data, 검색·정렬, Inspector와 안전한 출력 경계를 함께 필요로 하지만 초기 JS 예산은 작다.
- **Decision:**
  - `TUNER_LIMITS`를 단일 계약으로 사용하고 `999px`를 pill semantic token으로만 보존한다. 조절 radius는 opt-in surface에만 적용한다.
  - 테마/category는 대상 tweak default로 reset, archetype과 locale은 tweak를 보존한다. locale은 runtime·Inspector UI·scroll·focus도 보존한다.
  - 외부 i18n framework를 추가하지 않고 5개 locale registry와 literal dynamic import pack을 사용한다. URL→storage→browser→한국어 precedence와 last-known-good failure policy를 적용한다.
  - canonical ID와 palette stable ID는 machine syntax의 유일한 key다. 번역 display string을 slug/selector/token key로 사용하지 않는다.
  - 번역 문자열은 DOM text와 artifact context별 escape/size 경계를 통과하며 Inspector pane은 immutable locale snapshot에서 함께 생성한다.
  - locale catalog field는 번역·승인 fallback·placeholder provenance를 함께 보고한다. 국제 고유 디자인명 외의 공통 placeholder는 completeness에서 거부한다.
- **Alternatives Considered:**
  - `999`를 64로 clamp하면 pill 의미가 사라지고 손상된 데이터가 조용히 승인된다.
  - 전역 `--theme-radius`를 tuner가 계속 덮으면 내부 component geometry와 스타일 구분이 다시 훼손된다.
  - 모든 locale을 초기 JS에 포함하면 기존 gzip 예산을 넘길 위험이 크다.
  - 번역 이름을 CSS/DTCG key로 slugify하면 CJK의 빈 문자열·충돌과 locale별 diff를 만든다.
- **Consequences:**
  - locale pack completeness와 lazy chunk/Pages base 검증이 새 build gate가 된다.
  - 전문 번역 감수는 구조 검증과 별도의 콘텐츠 품질 단계로 남는다.
  - locale 전환은 단순 text swap보다 복잡하지만 명시적 snapshot/epoch로 stale pane과 runtime 손실을 차단한다.
  - Re-audit #1 수정 후 Node `214/214`, Vite `89 modules`, 5-locale Detail/Inspector와 runtime live status, actual-120 `1,920`상태·Web `480`탭·diagnostics 0, Discovery 9시나리오·6폭과 Pages fault 9종이 통과했다.
  - 초기 JS `88,191/88,980B`, CSS `32,994/33,000B` gzip으로 hard budget을 유지했다. 다음 초기 경로 변경도 bundle gate를 통과해야 하며 locale copy는 초기 청크가 아닌 lazy 경계를 유지한다.
