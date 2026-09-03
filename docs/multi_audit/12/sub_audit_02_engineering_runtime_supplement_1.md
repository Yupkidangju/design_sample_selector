# Sub Audit Report

## 1. Audit Metadata

- Audit Turn: 12
- Supplement: Coverage-gap supplement 1
- Assigned Perspective: Gallery CTA 키보드 경로·접근성 target size·중앙 project config 전달성
- Audit Mode: Standard-backed 정적 재감사
- Project Root: `/home/eunho1/Projects/web/design_sample_selector_2`
- Audit Date: 2026-09-03 (Asia/Seoul)
- Source/Sealed Report Changes: 없음
- Browser/Chrome: 실행하지 않음

## 2. Assigned Scope

이번 보완 감사는 다음 세 항목만 확인했다.

1. native `.tile-detail-btn`, `.bento-open-cta`, `.spec-cta`와 `onGalleryKey`의 `BUTTON` 처리, Space `preventDefault`, compare 동작
2. 세 CTA의 CSS target-size 계약
3. `project.config.js`의 필수 import 소비자와 git tracked/untracked 상태

## 3. Exclusions

- Chrome/실제 브라우저와 production build
- `node_modules/`, `dist/`, `.git` 내부와 생성 아카이브
- 원본 폴더 `/home/eunho1/Projects/web/design_sample_selector`
- 본문 재감사 보고서 및 소스·테스트·설정 파일 수정

## 4. Evidence

- `src/components/mainView.js:194-201` — Grid의 `.tile-detail-btn`가 native `button`으로 생성됨.
- `src/components/mainView.js:267-273` — Bento의 `.bento-open-cta`가 native `button`으로 생성됨.
- `src/components/mainView.js:340-346` — Spectrum의 `.spec-cta`가 native `button`으로 생성됨.
- `src/components/mainView.js:392-401` — 세 CTA의 click listener는 `preventDefault`, `stopPropagation` 후 해당 버튼의 `data-cat-id`/`data-sub-id`로 `openDetailFor`를 호출함.
- `src/components/mainView.js:423-485` — `onGalleryKey`는 `document.activeElement`의 `INPUT`/`TEXTAREA`/`SELECT`만 typing으로 제외하고 `BUTTON`은 제외하지 않음. `Enter`는 `galleryFocusId || draftSubId`로 선택된 tile을 열며, Space는 `preventDefault()` 후 `toggleCompareSlot(tile id)`를 호출함.
- `src/components/mainView.js:375-378` — `galleryFocusId` 갱신 focus listener는 `.sub-tile`, `.bento-item-card`, `.spectrum-card`에만 붙고 CTA에는 붙지 않음.
- `src/styles/interactive.css:3011-3029` — 세 CTA 공통 규칙에 `padding: 4px 8px`, `font-size: 11px`, 44px `min-height`/`min-width` 없음.
- `index.css:996-1000,1198-1202` — Bento/Spectrum CTA는 font/color만 보정하며 target-size 보정 없음.
- `designs.md:196,219,262,385`, `spec.md:232`, `BUILD_GUIDE.md:205` — 핵심 조작 및 모바일 조작 대상에 최소 44px 계약을 명시.
- `project.config.js:6-7` — `PROJECT_SLUG`와 `PROJECT_BASE`의 canonical 선언.
- `vite.config.js:1-5`, `scripts/verifyPagesArtifact.js:8-11`, `scripts/verifyPagesRecoveryChrome.js:18-23`, `scripts/verifyCatalogDiscoveryChrome.js:14`, `scripts/verifyCatalog120Chrome.js:14`, `scripts/verifyRenderScalabilityChrome.js:9`, `scripts/verifyI18nInspectorChrome.js:9`, `scripts/verifyWave1Chrome.js:13` — 중앙 config import 소비자.
- `git status --short -- project.config.js` — `?? project.config.js`.
- `git ls-files --error-unmatch project.config.js` — exit 1 (`untracked`). `git check-ignore -v project.config.js`도 ignore 규칙을 반환하지 않음.
- `tests/` selector/handler 검색 — 세 CTA와 `onGalleryKey`의 Space/Enter 상호작용을 검증하는 회귀 assertion은 확인되지 않음.

## 5. Findings

### Pass 1 — Implementation Compliance

#### A02S1-F001 — native CTA가 global gallery keyboard handler에 가로채진다

- Pass: Implementation Compliance
- Pattern: Accessibility keyboard contract / `TEST-001`
- Area: Gallery CTA activation and keyboard focus semantics
- Severity: Major
- Status: Confirmed
- Summary: 세 CTA는 native button이지만 `onGalleryKey`가 Button focus를 별도로 제외하지 않는다. CTA에 포커스한 상태의 Space keydown은 native button activation 대신 compare 토글로 소비되고, Enter는 CTA 자신의 `data-sub-id`가 아니라 stale하거나 없는 gallery state를 사용해 다른 tile을 열 수 있다.
- Evidence: `mainView.js:427-443`의 typing guard는 input/textarea/select만 제외한다. `mainView.js:464-475`는 Enter/Space에서 `preventDefault()`를 수행하고, Space를 `toggleCompareSlot()`으로 보낸다. `mainView.js:375-378`은 CTA focus에서 `galleryFocusId`를 갱신하지 않는다. 반면 `mainView.js:392-400`의 CTA click listener는 별도로 정상 detail 동작을 구현한다.
- Expected Basis: native button은 Enter/Space로 해당 버튼의 action을 실행해야 하며, 프로젝트의 Gallery keyboard/detail/compare 계약은 조작 대상별로 일관된 focus와 action을 유지해야 한다.
- Actual: CTA focus의 Space는 `preventDefault` 때문에 native click을 취소하고 compare slot을 토글한다. Enter는 현재 CTA의 `data-cat-id`/`data-sub-id`를 읽지 않고 `galleryFocusId || draftSubId`를 사용하므로, 이전 focus가 남아 있거나 없으면 의도한 CTA와 다른 detail을 열 수 있다.
- Impact: 키보드 사용자와 switch/virtual keyboard 사용자에게 “상세 보기” CTA가 Space로 작동하지 않는다. compare 상태가 예기치 않게 바뀌며, Enter가 다른 style detail을 열 수 있어 핵심 탐색 경로의 접근성과 기능 정합성이 깨진다.
- Suggested Action: `onGalleryKey` 초기에 active element가 `.tile-detail-btn, .bento-open-cta, .spec-cta`이면 return해 native button activation을 보존한다. 또는 CTA 전용 keydown/click 경계를 두고 해당 버튼의 own data-id로 detail을 열며, tile 자체 keyboard contract와 CTA contract를 명시적으로 분리한다. 세 CTA 각각의 Enter/Space와 compare non-regression test를 추가한다.
- Re-audit Method: 실제 DOM fixture 또는 browser에서 각 view의 CTA에 focus한 뒤 Enter/Space를 dispatch하여 detail ID가 CTA ID와 일치하고 Space가 compare를 변경하지 않는지 확인한다. tile 자체에 focus한 Space는 기존 compare 계약대로 동작하는지 함께 확인한다.
- Confidence: High
- Notes: browser 실행 없이 event propagation과 `preventDefault` 제어 흐름만으로 확인 가능한 결함이다. CTA listener가 존재한다는 사실만으로 keydown default activation이 보장되지는 않는다.

#### A02S1-F002 — 세 Gallery CTA가 44px target-size 계약을 충족하지 않는다

- Pass: Implementation Compliance
- Pattern: Accessibility target-size contract / `IMP-001`
- Area: CTA CSS and mobile touch target
- Severity: Major
- Status: Confirmed
- Summary: `.tile-detail-btn`, `.bento-open-cta`, `.spec-cta` 공통 CSS는 11px 글꼴과 4px 상하 padding만 제공하고 `min-height`/`min-width` 또는 44px hit-area 확장을 선언하지 않는다.
- Evidence: `src/styles/interactive.css:3011-3029`의 공통 CTA 규칙에는 `padding: 4px 8px`만 있고 target-size 선언이 없다. Bento/Spectrum 추가 규칙(`index.css:996-1000,1198-1202`)도 크기를 보장하지 않는다. 반면 `designs.md:196,219,262,385`, `spec.md:232`, `BUILD_GUIDE.md:205`는 핵심/모바일 조작 대상의 최소 44px 계약을 요구한다.
- Expected Basis: 프로젝트 UI/UX 및 runtime spec의 44×44px 핵심 조작·모바일 target 계약.
- Actual: 세 CTA의 declared box는 browser default line-height를 감안해도 4px 상하 padding과 1px border에 의존하는 약 20여 px 높이이며, 44px을 보장할 CSS가 없다. 실제 computed/bounding box는 Chrome 미실행으로 측정하지 않았지만, 정적 계약상 44px 보장은 부재한다.
- Impact: 작은 화면과 터치 환경에서 “상세 보기” target이 작아 오조작·접근성 저하가 발생할 수 있다. 전체 Gallery view의 세 CTA 변형이 동일하게 영향을 받는다.
- Suggested Action: 공통 CTA에 최소 44px hit-area를 명시(`min-height: 44px`; 필요한 경우 `min-width` 또는 충분한 inline padding)하고 좁은 카드에서 layout overflow가 없는지 확인한다. CTA의 visible label과 hit-area를 분리해야 하면 pseudo/inner wrapper를 사용하되 focus outline과 pointer target은 44px 영역에 유지한다.
- Re-audit Method: CSS computed style 및 `getBoundingClientRect()`를 Grid/Bento/Spectrum의 320/375/414px에서 측정해 width/height가 44px 이상인지, 카드 overflow·label clipping·focus-visible 손상이 없는지 확인한다.
- Confidence: High for missing CSS guarantee; Medium for exact rendered dimensions because Chrome was intentionally not run.
- Notes: “가능한 경우” 문구가 있는 설계 항목도 이 CTA들은 핵심 상세 진입 조작이므로 예외 근거가 없다.

### Pass 2 — Debug / Engineering Quality

#### A02S1-F003 — 필수 중앙 project config가 untracked 상태다

- Pass: Debug / Engineering Quality
- Pattern: `BUILD-001`, `DEP-001`
- Area: clean-checkout build/release integrity
- Severity: Major
- Status: Confirmed
- Summary: `project.config.js`는 Vite와 artifact/browser QA의 필수 import 대상이지만 현재 git에서 untracked이며 ignore도 아니다. 이 상태로 파일이 commit/배포 산출물에 포함되지 않으면 clean checkout에서 모든 해당 import가 실패한다.
- Evidence: `project.config.js:6-7`에 canonical exports가 있고, `vite.config.js:2`, `scripts/verifyPagesArtifact.js:8`, `scripts/verifyPagesRecoveryChrome.js:19`, `scripts/verifyCatalogDiscoveryChrome.js:14`, `scripts/verifyCatalog120Chrome.js:14`, `scripts/verifyRenderScalabilityChrome.js:9`, `scripts/verifyI18nInspectorChrome.js:9`, `scripts/verifyWave1Chrome.js:13`이 이를 import한다. `git status --short -- project.config.js`는 `?? project.config.js`, `git ls-files --error-unmatch project.config.js`는 exit 1이다.
- Expected Basis: 중앙 project identity를 소비하는 모든 tracked build/QA 경로가 clean checkout에서도 resolve되어야 하며, 배포에 필요한 source/config는 version control에 포함되어야 한다.
- Actual: 현재 작업 트리에서는 import가 resolve되지만 `project.config.js` 자체는 tracked 파일이 아니다. clean clone 또는 이 파일을 누락한 patch에서는 Vite config 로드와 artifact/Chrome QA script import가 즉시 실패한다.
- Impact: package-lock parity와 Node test가 현재 working tree에서 통과해도 재현 가능한 clone/build/CI 계약은 보장되지 않는다. base identity를 중앙화한 coder 보정이 commit 누락으로 배포 직전 깨질 수 있다.
- Suggested Action: `project.config.js`를 의도된 변경 집합에 포함하고, clean checkout에서 `npm ci`, `npm test`, Vite config load가 성공하는지 확인한다. required source/config의 untracked 상태를 배포 전 fail-closed check에서 감지하는 것도 고려한다.
- Re-audit Method: `git ls-files --error-unmatch project.config.js`가 성공하는지 확인하고, 별도 clean checkout/worktree에서 `node --check`, `npm test` 및 build config resolution을 실행한다.
- Confidence: High
- Notes: 이 supplement는 git index를 변경하지 않았다. 실제 commit 여부는 상위 작업의 release 경계에서 결정해야 한다.

### Pass 3 — Security / Hardening

이번 보완 범위에서 별도 보안 finding은 확정하지 않았다. 다만 keyboard interception은 접근성·기능 경계의 문제로 Pass 1에 기록했고, 44px target은 UI 계약 문제로 분리했다.

## 6. Cross-Pass Conflicts

- CTA click handler가 올바른 own ID로 detail을 여는 것(`mainView.js:392-400`)과, global `onGalleryKey`가 CTA keydown을 tile-state/compare 동작으로 재지정하는 것이 서로 충돌한다.
- 문서가 44px target을 검사한다고 선언하지만 CTA CSS에는 명시적 44px hit-area가 없다. Chrome 미실행으로 “실제 computed size”를 현재 PASS 근거로 만들지 않았다.
- 중앙 config import는 구현상 일관되지만, `project.config.js`가 untracked여서 source-control 전달 경계가 구현 경계를 따라가지 못한다.

## 7. Uncertainties and Clarifications Needed

1. 프로젝트가 CTA에 대해 native button 기본 Enter/Space를 유지할지, tile 자체 Space compare 계약을 CTA에도 의도적으로 적용할지 확인 필요. 현재 markup/class와 accessibility 문서상 native CTA 기본 동작이 합리적 기대다.
2. 44px이 CTA의 visible box인지 invisible hit-area인지 디자인 의도 확인 필요. 어느 경우든 CSS/DOM 계약 또는 예외 근거가 필요하다.
3. `project.config.js` untracked가 단순히 아직 staging하지 않은 작업 상태인지, coder handoff에서 누락된 것인지 확인 필요.

## 8. Perspective Decision

**REWORK REQUIRED — 보완 범위에서 PASS 아님.**

세 CTA의 keyboard activation은 global handler에 의해 확정적으로 가로채지고, CTA CSS에는 44px target 보장이 없으며, 중앙 project config는 clean-checkout에 전달될 tracked 파일이 아니다. 세 항목을 수정·검증한 뒤 CTA keyboard/target-size와 clean checkout import를 재감사해야 한다.

