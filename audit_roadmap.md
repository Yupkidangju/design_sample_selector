# Implementation Audit Roadmap (`audit_roadmap.md`)
**Project Name:** Web Design Sample Selector (`design_sample_selector`)  
**Version:** 2.3.0
**Document Status:** Actual 120 Catalog Expansion Final Audit / Remaining Program Audit Criteria

살아 있는 계약은 `spec.md` v2.3.0이다. 구버전 숫자(5분류 / 15서브 / 10 BGM / 5 SFX / WASM 엔진)와 v2.2 인스펙터 기준은 폐기한다.

---

## 1. Audit Phase Matrix

| Phase | Milestone | Audit Focus | Verification Criteria | Status |
| --- | --- | --- | --- | --- |
| **Phase 1** | Scaffolding & Standard Documentation | D3D & Standard Compliance | 핵심 문서와 사용자 버전 표시가 제품 버전 2.3.0과 동기 | **READY** |
| **Phase 2** | Design Tokens & Global CSS | Responsive Layout & Token Integrity | actual 120 canonical + 21 alias 셀렉터, Core 36 initial/신규 84 async 테마, 슬라이더 0–64 / 0–12 / 0–30 / 0–32 / 0–2.0 | **READY** |
| **Phase 3** | Audio Synth & Canvas 2D Visual Engine | Audio & Canvas Performance | 16 BGM 트랙, 14 SFX, Canvas 2D 파티클(`pauseLoop`/`resumeLoop`). `.wasm` 없음 | **READY** |
| **Phase 4** | Taxonomy & Gallery | Search / Filter / Views | 8대분류 × 15 = actual 120, 실시간 검색(헤더 풀 리렌더 금지), 3 갤러리 모드·4페이지 | **READY** |
| **Phase 4A** | Scalable Catalog Wave 0 | Style Contract & Compatibility | 스키마 v1, core 24종, 10 facet, 21 alias, 재귀 불변성, 레거시 어댑터 parity | **COMPLETE** |
| **Phase 4B** | Scalable Catalog Wave 0 | Build-time Catalog Validation | 구조화 진단, ID/관계/참조 불변조건, provenance/a11y 경고 정책, CLI/prebuild 게이트 | **COMPLETE** |
| **Phase 4C** | Scalable Catalog Wave 0 | Canonical Theme Generation | 13-token 단일 원천, 생성 CSS stale 게이트, 24/21/3 runtime 및 984 export 호환, Chrome computed style | **COMPLETE** |
| **Phase 4D** | Scalable Catalog Wave 0 | Preview Registry Foundation | renderer/thumbnail/motion 24/24/24, explicit failure, public consumer boundary, 120/192-output parity | **COMPLETE** |
| **Phase 4E** | Catalog Expansion Wave 1 | Core 36 Authoring Proof | ready 12 품질 0/0, inventory 36/36/36/0, 180/288/576 행렬, 실제 Chrome 시각 QA | **COMPLETE** |
| **Phase 4F** | Catalog Discovery | Canonical Search / Facet / URL / Views | 검색·category+bookmark·10 facet·네 정렬·URL 복원·시대 Spectrum, Chrome 9시나리오/6폭 | **COMPLETE** |
| **Phase 4G** | Render Scalability | Bounded DOM / Lazy Chunks / Chrome Budgets | Gallery 36·Detail 24·Split 12/slot, synthetic 60/120, 초기 JS/CSS·LCP·CLS·interaction·observer 예산 | **COMPLETE** |
| **Phase 4H** | Actual 120 Catalog Expansion | 84 Ready Styles / Async Presentation / Real Chrome | 7팩·21문법, 120/120/120/0, actual 1,920 device·Web 480 상태, 반응형·진단·초기 번들 예산 | **COMPLETE** |
| **Phase 5** | Detail / Split / Inspector | Live Sandbox & Export Contract | 최신 테마 기준 4탭/3 CSS 모드/복사/다운로드, 8 아키타입 HTML-CSS 선택자 계약, DTCG 2025.10, 스플릿 ARIA 탭 | **READY** |
| **Phase 6** | Quality Verification & Launch Gate | Automated + Browser Audit | `npm run check`, teardown 동일 루트, XSS `textContent`, 포커스 트랩, 복합 상태 전이 브라우저 검사 | **READY** |

---

## 2. Pass 1: Specification Compliance Audit Checklist

- [x] All 8 main design categories and 120 canonical style IDs are defined by the Core 36 and seven expansion packs; `src/data/categories.js` is projection-only.
- [x] Alias IDs exist only as CSS/storage compatibility selectors and `StyleRecord.aliases`, not as extra catalog rows.
- [x] Schema v1 exposes exactly 120 default styles (legacy 24 + ready 96), 10 ordered facet definitions, eight pack manifests, 13 tokens and three preview references per style.
- [x] Canonical IDs and aliases are unique and non-overlapping; `bauhaus-geometric` still resolves to `fluid-organic`.
- [x] Public arrays and nested records are recursively frozen; unknown external IDs return `null`/empty arrays without Swiss fallback.
- [x] Default publication filtering exposes `legacy/ready`; `draft/review` requires explicit development opt-in.
- [x] Legacy adapter preserves current category tree, flat style fields, palettes, tweaks, motion, saved ID canonicalization and import path.
- [x] Current snapshot uses canonical catalog queries plus the preview registry-derived inventory and contains 8 categories, 120 styles, 10 facets, eight packs, and 120/120/120/0 references.
- [x] Frozen diagnostics expose stable code/severity/path/entity fields and deterministic error-first ordering without mutating input.
- [x] Structural, alias, relationship, facet, token, palette, tweak, preview, asset, provenance, accessibility, and contrast mutation fixtures produce the approved diagnostics.
- [x] Current validation baseline is 0 errors and 56 visible legacy warnings; strict mode exits 1 without inserting fabricated metadata.
- [x] CLI compact/verbose/JSON modes and exit codes 0/1/2 are covered; `prebuild` runs before Vite and blocks injected validation errors.
- [x] Node-only validation imports and diagnostic strings are absent from the browser source graph and production assets.
- [x] `StyleRecord.tokens` is the sole authored source for each style's 13 theme values; the former hand-written export map is removed.
- [x] Frozen theme projection covers 120 canonical IDs, 21 aliases and optional effects without reverse imports from catalog to theme.
- [x] Generated Core 36 `themeTokens.css` and async 신규 84 `themeTokensExpansion.css` preserve the approved subset hashes; `generate:themes` writes and `check:themes` detects current/stale/missing/tool-error states without writing.
- [x] `prebuild` runs catalog validation then the read-only theme freshness check before Vite.
- [x] Existing 24-style Live CSS 576, Markdown 384 and DTCG 24 subset hashes are unchanged; Core 36 full fixtures pass and unknown themes do not receive Swiss values.
- [x] Preview renderer·thumbnail·motion definitions expose 120/120/120 canonical IDs, while `brutalism` resolves only as a renderer alias and stays outside inventory.
- [x] Component and thumbnail compatibility output retains the approved legacy 120-output and Core 36 subset hashes and adds deterministic actual 120 fixtures; unknown references and malformed component roots fail with structured preview errors.
- [x] Motion descriptors own unit/effect classes and evidence-based channels; hydration preserves effect layers, reduced-motion state, observer cleanup and idempotence.
- [x] Catalog validation consumes the derived preview inventory; the duplicate legacy inventory and unchecked motion class assembly are absent.
- [x] Search, category, bookmark, ten facets and four sort modes use one pure canonical query; multiple values are OR within one facet and different facets are AND.
- [x] `q/category/f/sort/view/saved` URL state is canonicalized, capped and restored on initial load/reload/`popstate`; typing uses `replaceState` rather than adding history entries.
- [x] Grid, Bento and Spectrum expose the same canonical result set; Spectrum groups by `classification.era.start` rather than fixed category-era copy.
- [x] Discovery controls expose named native inputs, polite result status, removable text chips, empty reset/focus restoration, 44px mobile targets and reduced-motion behavior.
- [ ] 16 ambient BGM presets and 14 SFX generators in Web Audio synth (`playSfx` does not allocate unused oscillators).
- [ ] Canvas 2D particle engine (no WebAssembly binary). Header badge is Canvas 2D.
- [ ] Kinetic simulators match spec §3.1 bullets 1:1 (`data-action`).
- [ ] Split compare includes all 8 archetypes; close restores `compareReturnView`.
- [ ] CSS and HTML snippet copy buttons exist.
- [ ] Theme A→B switch keeps CSS Full/Tokens/Component, HTML, Markdown, JSON, copy, and downloads on theme B.
- [ ] Reopening DETAIL initializes CSS/Full with matching active class, `aria-selected`, pane, submode, and label.
- [ ] All 8 generated component CSS selectors exist in the corresponding exported archetype HTML.
- [x] All 120 token documents use DTCG 2025.10 structured values; gradient, transparent, rgba, `none`, layered shadow, and font family policies are covered.
- [ ] Integrated export is named `*-integrated-snapshot.txt` and described as a single review document, not a ZIP package.
- [ ] Backdrop blur slider applies to `.archetype-unit`.
- [ ] Slider ranges: Radius 0–64, Border 0–12, Shadow 0–30, Blur 0–32, Glow 0–2.0.
- [ ] Responsive breakpoints (<768px, 768px–1199px, >=1200px).

---

## 3. Pass 2: Engineering Quality Audit Checklist

- [x] Zero external runtime JS framework dependencies.
- [ ] Pure browser Web Audio API oscillator synthesis (0KB audio files).
- [ ] `hydrateMockup` / `teardownMockup` use the same root (plus descendant sweep).
- [ ] Search `input` does not rebuild the entire header DOM.
- [x] Discovery search/status output is escaped, unknown URL/facet input is allowlisted away, and the query is limited to 120 characters.
- [x] Browser discovery QA verifies 320/375/414/768/1024/1440px overflow 0, 88/88 named inputs, keyboard flows and application diagnostics 0.
- [ ] Asynchronous audio context resume handling for browser autoplay policies.
- [ ] Accessible HTML5 markup with aria attributes, focus trap, Esc.
- [ ] Split archetype tabs expose one `aria-selected="true"`, roving `tabindex`, linked tabpanels, and Arrow/Home/End navigation.
- [x] `tests/styleContract.test.js` passes all canonical/legacy parity, ordering, publication, boundary, saved-ID restoration and immutability cases.
- [x] Browser-safe theme modules contain no Node file-system imports; the Node CLI and its diagnostics are absent from production assets.
- [x] Generated CSS is statically imported through `interactive.css`; runtime theme switching injects no `<style>` element and preserves active component state.
- [x] `npm test` and `npm run build` pass through `npm run check` (152/152 current; 144/144 at scalability completion; 121/121 at discovery completion; 106/106 at Wave 1 completion).

### Phase 4A Verification Record (2026-08-30)

- `npm run check`: 25/25 tests passed; Vite build passed (`77.39 kB` gzip JavaScript, `21.79 kB` gzip CSS).
- Crostini Google Chrome: 8 categories, 24 styles, three gallery modes, Detail, Split, inspector and bookmark reload flow passed.
- All eight archetypes changed from a `788px` Desktop render root to a `380px` Mobile render root.
- No Vite error overlay occurred. Unrelated Chrome extension warnings were excluded from application-origin findings.

### Phase 4B Verification Record (2026-08-30)

- `npm test -- tests/catalogValidation.test.js`: 24/24 passed; `npm run check`: 49/49 passed and the Vite build ran after `prebuild` validation.
- Current catalog: 0 errors, 56 warnings (`ACCESSIBILITY_NOTES_REQUIRED` 24, `SOURCE_REQUIRED` 24, `CONTRAST_LOW` 5, `CONTRAST_UNCHECKED` 3); default exit 0, strict exit 1, invalid option/internal failure exit 2.
- Production bundle stayed at JavaScript `77.39 kB` gzip and CSS `21.79 kB` gzip; validation imports and diagnostic strings were absent.
- Crostini Google Chrome 151: Grid/Bento/Spectrum each rendered 24 styles; all eight archetypes changed from Desktop 786–822px to a Mobile 380px cap (visible 368–380px); Detail, Split dual render, alias/storage reload, bookmark filter, and five exported artifacts passed.
- Application-origin JavaScript errors were 0. The unrelated missing `/favicon.ico` request was recorded separately and excluded from the catalog-validation finding.

### Phase 4C Verification Record (2026-08-30)

- `npm run check`: 63/63 tests passed; catalog baseline remained 0 errors/56 warnings, `check:themes` passed, and Vite built 35 modules.
- Compatibility fingerprints remained exact: map `2e2993…fdf5`, runtime CSS `a4965a…06d`, Live CSS `b61766…781`, Markdown `e8b81f…c71a`, DTCG `e29493…fc04`.
- Production bundle: JavaScript `276.94 kB` (`75.35 kB` gzip), CSS `115.43 kB` (`21.79 kB` gzip). Compared with the last pre-consolidation build, raw JavaScript decreased `9.89 kB` and gzip decreased `2.07 kB`; Node CLI strings/imports were absent.
- Crostini Google Chrome 151 computed all 13 properties for 45 canonical/alias selectors with no mismatch. Glass/Frutiger/Bento effects were `20px/14px/16px`.
- Ten Detail themes and eight Split themes passed; game combo state, active archetype and Mobile mode survived theme/Split transitions. All eight archetypes completed Mobile↔Desktop transitions (16 checks), and CSS/Markdown/DTCG downloads matched the active design.
- Application stylesheet response was 200 and runtime `<style>` injection count was 0. Application resource, console and runtime errors were 0 after excluding the browser's optional `/favicon.ico` request.

### Phase 4D Checkpoint B Verification Record (2026-08-30)

- Tasks 1–6 passed 85/85 full Node tests; focused preview·runtime·catalog verification passed 47/47.
- Registry inventory is renderer 24, thumbnail 24, motion 24, asset 0; all arrays and the containing object are recursively frozen and match the current catalog reference sets exactly.
- Compatibility output remains `4b0ccbb8…4c9d4d9` for 120 outputs and `cc51b6b0…665c5` for 96 component outputs. `brutalism` remains an alias only.
- Catalog validation remains 0 errors/56 warnings, generated theme CSS is current, Vite built 41 modules, and production assets contain no Node-only validation diagnostics.
- Production bundle is JavaScript `286.24 kB` (`78.42 kB` gzip) and CSS `115.43 kB` (`21.79 kB` gzip). Crostini Chrome runtime/visual proof remains assigned to preview-registry Task 9 after consumer integration.

### Phase 4D Checkpoint C Verification Record (2026-08-30)

- Tasks 7–8 moved Main View, Detail, Selection Dock, Peek and the Web archetype to explicit public thumbnail/component API options. Production UI code no longer imports preview definition maps or calls the compatibility entry.
- The 120-output compatibility SHA remains `4b0ccbb8…4c9d4d9`; the 24 × 8 archetype matrix SHA is `8c48b6d1…fb83c`, the 168 non-Web output SHA is `15067f01…b415`, and all 96 Web component combinations use one registered motion class.
- Focused consumer verification passed 20/20 and integration/selector/device verification passed 9/9. The final full Node suite passed 92/92; catalog validation remained 0 errors/56 warnings and generated theme CSS remained current.
- Vite built 40 modules. Production bundle is JavaScript `286.25 kB` (`78.43 kB` gzip) and CSS `115.43 kB` (`21.79 kB` gzip); `git diff --check` passed.
- Task 9 remains the required Crostini Chrome runtime/visual proof. No runtime or visual pass is claimed at Checkpoint C.

### Phase 4D Task 9 Crostini Chrome Verification Record (2026-08-30)

- `/usr/bin/google-chrome` reported 151.0.7922.173 and ran with an isolated temporary user-data directory against local Vite/CDP. The default Chrome profile was not used.
- Grid, Bento and Spectrum each rendered 24 registered thumbnails. All 96 style/Web-tab states matched their registered component root and motion class with no empty output or Swiss substitution.
- All 384 style/archetype/device states matched `data-theme`, archetype root, motion/effect layer and active device control. Desktop roots measured 705.33–714.93px and Mobile roots measured 364.8px, resolving the original same-looking device concern with runtime evidence.
- Six registered motion channels and reduced-motion suppression passed. Main layout at 320/768/1024/1440px had no horizontal overflow; Split rendered two Web components and game interaction state survived Mobile↔Desktop and zero-rebuild theme swaps.
- The first run exposed 72 Web tab-button state mismatches: content changed but `active`/`aria-selected` stayed on Hero. A RED regression test and six-line state synchronization fixed all 96 combinations. An inline SVG favicon removed the browser-generated `/favicon.ico` 404.
- Eight style families in Desktop/Mobile, Grid/Bento/Spectrum, Split and all four Web tabs were inspected across 24 screenshots. The final accessibility tree had no unnamed controls, and application console errors, exceptions, failed same-origin requests and error logs were all 0.
- Chrome/Vite were stopped, ports 4173/9222 were released and the isolated profile/screenshots were deleted. Final `npm run check` passed 93/93 tests, catalog 0 errors/56 warnings, current theme CSS and a 40-module build. Bundle sizes were JavaScript `286.41 kB` (`78.45 kB` gzip) and CSS `115.43 kB` (`21.79 kB` gzip).
- Chrome process stderr included Crostini/Chrome-internal GCM endpoint and SwiftShader on-device-model messages. They did not appear in the application page console, exceptions, or same-origin network diagnostics and are recorded as environment noise rather than an application finding.

### Phase 4D Task 12 Final Audit Record (2026-08-30)

- **판정:** `APPROVE / COMPLETE`. Critical·Required·Suggested 코드 finding은 0건이다. 승인 사양 성공 조건 13/13, Tasks 1–12, Checkpoints A–C와 Final Checkpoint를 소스·테스트·해시·Chrome 기록에 독립 대조했다.
- preview 집중 테스트는 30/30, 전체 Node 테스트는 93/93으로 통과했다. `validate:catalog`은 오류 0·경고 56, `check:themes`는 최신 상태였고 `npm run build`와 독립 `npm run check`가 모두 통과했다.
- Vite는 40 modules를 빌드했다. 산출물은 JavaScript `286.41 kB` (`78.45 kB` gzip), CSS `115.43 kB` (`21.79 kB` gzip)로 승인 기준선과 같다. 120-output SHA-256 `4b0ccbb887d83676464dc523ece67fdd7ed5ee43d4941d741a992a5354c9d4d9`도 테스트에서 재확인했다.
- 공개 export 9개, 안정 오류 code 6개, 재귀 동결 inventory renderer/thumbnail/motion/asset `24/24/24/0`을 실제 모듈에서 재계수했다. `legacyReferenceInventory.js`, renderer switch, generic thumbnail fallback, 별도 definition 소비와 Node 전용 browser import는 없었다. 8 archetype을 고르는 기존 switch는 preview renderer dispatch가 아니므로 유지한다.
- 비밀정보 패턴·비밀 파일·프로젝트 symlink·바이너리 preview asset·임시 파일 검색은 모두 0건이었다. 감사용 Vite, 4173/5173/9222 listener와 격리 Chrome profile도 남아 있지 않았다. 실행 중인 `--profile-directory=Default` Chrome은 사용자 일반 브라우저이므로 종료하거나 변경하지 않았다.
- Task 9의 Chrome 151 증거인 Grid/Bento/Spectrum 72 thumbnail, Web 96 states, style/archetype/device 384 states, six motion channels, reduced-motion, 24 screenshots와 application diagnostics 0을 재대조했다. Task 12는 같은 브라우저 행렬을 다시 실행하지 않고 승인된 런타임 증거와 현재 코드 해시·자동 게이트의 연결이 끊기지 않았는지 확인했다.

### Phase 4E Catalog Expansion Wave 1 Verification Record (2026-08-30)

- **판정:** `APPROVE / COMPLETE`. `SPEC-catalog-expansion.md` 성공 조건 14/14와 Tasks 1–15를 구현·문서·자동 게이트·실제 Chrome 증거에 대조했다. Wave 2는 시작하지 않았다.
- Core pack 1.1.0은 8개 카테고리의 legacy 24 + ready 12 = 36종이다. 신규 canonical ID·배치가 승인 roster와 일치하고, ready 12 단독 검증은 오류 0·경고 0, 전체 catalog는 오류 0·기존 legacy 경고 56이다.
- 신규 데이터·시각 구현은 `styles-wave-1.js`, `renderers-wave-1.js`, `thumbnails-wave-1.js`, `motions-wave-1.js`, `wave1-styles.css`에 추가형으로 분리됐다. 외부 asset과 신규 runtime dependency는 0이다.
- preview inventory는 renderer/thumbnail/motion/asset `36/36/36/0`이다. 전체 preview 180개, Web 144개, 아키타입 Node 288개와 실제 Chrome device 576상태가 통과했고 기존 24종의 120-output 및 theme/export subset 해시는 유지됐다.
- 전체 Node 테스트는 106/106, catalog 0/56, ready 12 품질 0/0, theme freshness와 Vite production build가 통과했다. Vite 45개 모듈의 산출물은 JavaScript `339.13 kB` (`93.49 kB` gzip), CSS `160.72 kB` (`30.77 kB` gzip)다. DTCG `box-shadow: none`은 투명한 zero shadow로 구조화되고 36종 thumbnail의 interactive tag 금지 계약이 회귀 테스트에 포함됐다.
- `/usr/bin/google-chrome` 151.0.7922.173을 기본 profile과 분리해 실행했다. Grid/Bento/Spectrum 각 36개, 320/375/414/768/1024/1440px overflow 0과 Core 36 × 8 × 2 = 576상태를 확인했다. 전체 outer root는 Desktop `735–745px`/Mobile `380px`, 신규 12종 Web inner root는 Desktop 약 `689–703px`/Mobile 약 `332–338px`로 분리됐고 활성 device 상태·grid 차이·motion/effect·44px 조작과 control 경계 이탈은 0이었다.
- Split Bauhaus/Swiss와 reduced-motion을 통과했고 application console warning/error, page exception, 실패 same-origin request와 HTTP error는 모두 0건이다. `.antigravity/archive/wave1-chrome-qa/report.json`과 대표 스크린샷 5장을 재현 가능한 증거로 보존했다.
- 첫 시각 검토에서 Flat Design thumbnail의 중첩 `button`이 browser parser에 의해 Detail/Split DOM을 끊는 문제를 발견했다. 장식 `span`으로 수정하고 전체 thumbnail 비상호작용 계약을 추가한 뒤 같은 Chrome 행렬을 다시 통과했다.

### Phase 4F Catalog Discovery Verification Record (2026-08-30)

- **판정:** `APPROVE / COMPLETE`. `SPEC-catalog-discovery.md` 성공 조건 12/12와 Tasks 1–11을 순수 계약·UI·URL·세 보기·문서·실제 Chrome 증거에 대조했다. Core 36을 유지했고 Wave 2·가상화·dynamic import는 시작하지 않았다.
- `tests/catalogDiscovery.test.js`는 검색·AND/OR facet·category+bookmark·정렬·시대 group·URL round trip/state adapter·접근 가능한 markup·세 보기 model 15/15를 통과했다. 전체 `npm run check`는 121/121, catalog 오류 0/legacy 경고 56, theme 최신성과 production build를 통과했다.
- Vite는 51개 모듈을 빌드했다. 산출물은 JavaScript `354.99 kB` (`98.87 kB` gzip), CSS `167.42 kB` (`32.18 kB` gzip)다. 새 runtime·development dependency와 외부 asset은 없다.
- `/usr/bin/google-chrome` `151.0.7922.173`을 격리 profile로 실행했다. 검색·category+bookmark+facet·Bento 이름 정렬·Spectrum 시대 정렬·URL reload/`popstate`·empty reset·키보드의 9개 시나리오와 6개 폭에서 실패가 없었다.
- Grid/Bento/Spectrum은 각 36개 고유 ID의 같은 결과 집합을 표시했고 Spectrum 시대 그룹은 `pre-1950`부터 `2020s`까지 실제 레코드에서 파생됐다. 88/88 입력에 접근 가능한 이름이 있었고 가로 overflow, 44px 미만 target, console warning/error, exception, network/HTTP failure와 issue는 모두 0건이다.
- `.antigravity/archive/catalog-discovery-chrome-qa/report.json`, `discovery-mobile-320.png`, `discovery-desktop-1440.png`를 재현 가능한 증거로 보존했다. 기본 Chrome profile에는 연결하지 않았고 격리 profile과 개발 서버는 종료 시 정리했다.

### Phase 4G Render Scalability Verification Record (2026-08-31)

- **판정:** `APPROVE / COMPLETE`. `SPEC-render-scalability.md` 성공 조건 8/8, Tasks 1–12, Checkpoints A–C와 Final Checkpoint를 순수 계약·UI·bundle graph·실제 Chrome 증거에 대조했다. 실제 catalog는 Core 36이며 synthetic 60/120은 QA 경계 밖으로 노출되지 않았다.
- `tests/renderScalability.test.js` 20개와 `tests/initialBundleAnalysis.test.js` 2개를 포함한 전체 Node 테스트는 144/144다. catalog 오류 0/legacy 경고 56, theme 최신성, Vite production build, `analyze:bundle`과 `git diff --check`가 통과했다.
- 초기 정적 JavaScript/CSS는 `62,778/32,856 bytes` gzip으로 예산 `88,980/33,000 bytes`를 통과했다. 이전 기준선 JS `98.87kB` gzip에서 감소했고 Detail/component renderer는 async chunk로 분리됐다. CSS 예산 잔여 폭은 144 bytes다.
- `/usr/bin/google-chrome` `151.0.7922.173` 격리 profile에서 DCL/load/FCP/LCP `390/423.5/432/516ms`, CLS `0`을 기록했다. Core 36 initial은 36 thumbnail/488 nodes이고 기존 UI에는 pager가 없다.
- synthetic 60/120의 Grid/Bento/Spectrum은 페이지를 합쳐 각각 모든 ID에 정확히 도달했으며 visual card/thumbnail은 36개, Detail은 24개, Split은 12개/slot을 넘지 않았다. 120 interaction 최댓값은 `81.0ms`, detached observed node와 cleanup 후 observed node는 0이었다.
- 첫 component chunk 요청을 CDP에서 한 번 실패시켜 loading→error→retry 성공을 검증했다. 같은 URL 실패를 기억하는 module map 문제는 primary/retry facade로 복구하고 stale request는 state/request token으로 차단했다.
- Detail의 active category/zero-rebuild, Split native 36/60/120 option, selected pinning·focus·polite status, Desktop `721px`/Mobile `368px`, 320/768/1024/1440px overflow 0과 reduced-motion 실행 animation 0이 통과했다. application console/error/exception/network/HTTP/accessibility issue는 0이다.
- 초기 앱 삽입과 Google Font swap에서 발생한 CLS `≈0.49`는 normal flow에서 UI를 숨겨 layout/font를 정착시킨 뒤 노출하는 방식으로 해결했다. `display:none` 또는 detached insert는 빈 문서 뒤 전체 UI 출현을 이동으로 남겨 기각했다.
- `.antigravity/archive/render-scalability-chrome-qa/report.json`과 화면 증거를 보존했고 기존 `qa:wave1:chrome` 576상태와 `qa:discovery:chrome` 9개 시나리오도 현재 코드에서 다시 통과했다.

### Phase 4H Actual 120 Catalog Expansion Verification Record (2026-08-31)

- **판정:** `APPROVE / COMPLETE`. `SPEC-catalog-expansion-120.md` 성공 조건 10/10, Tasks 1–15와 Final Checkpoint를 데이터·preview·theme·탐색·bundle·실제 Chrome·문서 증거에 대조했다.
- 공개 catalog는 정확히 120개 고유 ID이며 8개 category가 각각 15종이다. 기존 36 ID 순서와 24·36 subset 지문을 보존하고 신규 84종은 7팩 × 12, 21문법, `ready`, 품질 오류·경고 0이다. 전체 catalog는 오류 0과 기존 legacy 경고 56만 유지한다.
- preview inventory는 renderer/thumbnail/motion/asset `120/120/120/0`이다. Node Web 480탭과 120×8 아키타입 960출력, actual 전체 지문과 두 생성 theme CSS 최신성 검사가 통과했다.
- 전체 `npm run check`는 152/152 테스트와 75-module Vite build를 통과했다. 초기 JS/CSS는 `83.46/32.86kB` gzip으로 `88.98/33.00kB` 예산 안이며 expansion theme/preview CSS는 initial이 아니라 component 경계 뒤에 요청된다.
- `/usr/bin/google-chrome` `151.0.7922.173` 격리 profile에서 Grid/Bento/Spectrum 각 4페이지의 120 ID와 신규 thumbnail 84개에 도달했다. actual 120×8×Desktop/Mobile `1,920`상태, Web 480탭, 신규 84/84 device grid 변화, 대표 Spatial Glass UI의 Desktop 2열/Mobile 1열, category selector 15종, Split native 120·visual 12/slot, Peek·Dock·reduced-motion을 통과했다.
- initial LCP `732ms`, CLS `0`, interaction max `142.8ms`, console warning/error, exception, network/HTTP failure와 issue는 모두 0이다. `.antigravity/archive/catalog120-chrome-qa/report.json`과 desktop/mobile/split 대표 화면을 보존했고 Wave 1·discovery·scalability 기존 Chrome 회귀도 모두 재통과했다.

### Next Recommended Gate and Remaining Risks

- **현재 승인 게이트:** actual 120 확장과 관련 기반·브라우저 게이트가 모두 완료됐다. 다음 고정 수량의 미구현 Wave는 없으며 후속은 사용자 피드백 기반 시안 특화, legacy 품질 정리 또는 120종 이후 새 사양으로 시작한다.
- **남은 품질 부채:** 기존 24개 `legacy` 스타일의 출처·접근성·대비 경고 56개는 공개 기준선으로 남아 있다. 허위 메타데이터로 제거하지 않고 실제 조사·검토와 함께 해소해야 한다.
- **남은 motion 품질 부채:** `sparkline`, `vhs-shift`, `ken-burns`, `tile-stagger` 4개는 의도적으로 `metadata-only`이며 ID 전용 시각 동작이 없다. `hard-punch`, `hard-press`, `inset-press` 3개는 초기 반복 모션이 아니라 상호작용 시에만 동작한다. 새 효과를 만들거나 motion 강도를 보정하는 작업은 호환 이전 범위에서 제외했으므로 style-pack 저작/시각 QA 사양에서 별도 승인한다.
- **남은 확장 위험:** actual 120은 통과했지만 초기 CSS 예산 여유는 144 bytes, JS 예산 여유는 약 `5.52kB`뿐이다. 120종 이후에는 현재 async CSS·bounded DOM 경계를 유지하고 새 예산을 승인해야 한다.
- **남은 시각 품질 위험:** 신규 84종은 21개 문법을 네 변형씩 공유하므로 개별 시안의 고유 markup 특화 여지가 남는다. 색상만 바꾸는 회귀는 금지하며 실제 사용자 피드백이 있는 스타일부터 canonical ID와 반응형 계약을 유지한 채 심화한다.
- **해결된 브라우저 항목:** inline SVG favicon 선언으로 선택적 `/favicon.ico` 404와 DevTools network 오류를 제거했다.

---

## 4. Pass 3: Security & Performance Audit Checklist

- [x] No unsafe `eval()` or dynamic script execution.
- [ ] Comments / chat / toasts use `textContent` or `createElement`.
- [ ] Clipboard API calls guarded with user gesture.
- [ ] Canvas rAF pauses on modal overlay; respects `prefers-reduced-motion` physics skip.
- [ ] Every started AudioNode has `onended` → `disconnect()`.
