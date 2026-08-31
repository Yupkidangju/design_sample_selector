# Build & Runtime Execution Guide (`BUILD_GUIDE.md`)
**Project Name:** Web Design Sample Selector (`design_sample_selector`)  
**Version:** 2.3.0
**Document Status:** Execution Protocol / Actual 120 Complete

---

## 1. Environment & Prerequisites

- **Node.js Environment:** Node.js 20.x or 22+ for Vite development, tests, and production builds (`package.json#engines`). Python 3 may serve source files for a static-only smoke check but does not run the release gate.
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
│   │   ├── appState.js
│   │   └── discoveryUrlState.js # URL ↔ appState 동기화
│   ├── data/
│   │   └── categories.js
│   ├── catalog/
│   │   ├── index.js
│   │   ├── discovery.js        # 검색·facet·정렬·시대 그룹 순수 계약
│   │   ├── discoveryUrl.js     # canonical URL parse/serialize
│   │   ├── contract.js
│   │   ├── validation/         # Node 전용 카탈로그 검증 API와 규칙
│   │   ├── packs/core/
│   │   └── packs/expansion/  # 7팩·84종·21문법 authoring 원천
│   ├── theme/
│   │   ├── contract.js         # 13개 의미 토큰 ↔ CSS property 및 root fallback
│   │   ├── projection.js       # 정규 StyleRecord → 동결 ThemeDefinition
│   │   ├── stylesheet.js       # 결정론적 순수 CSS 직렬화
│   │   └── index.js            # 브라우저 안전 공개 진입점
│   ├── preview/
│   │   ├── contract.js         # 탭·참조 kind·motion channel·구조화 오류 계약
│   │   ├── registry.js         # 불변 조회/렌더 API와 파생 ReferenceInventory
│   │   ├── renderers.js / renderers-wave-1.js / renderers-expansion.js
│   │   ├── thumbnails.js / thumbnails-wave-1.js / thumbnails-expansion.js
│   │   ├── motions.js / motions-wave-1.js / motions-expansion.js
│   │   ├── thumbnailEntry.js / motionEntry.js / componentEntry.js # 종류별 UI 진입점
│   │   ├── componentLazyEntry.js / componentLazyRetryEntry.js # 재시도 URL facade
│   │   └── index.js            # 동기 공개 호환 진입점
│   ├── scalability/
│   │   └── renderWindow.js     # bounded window/picker와 성능 예산
│   ├── audio/
│   │   └── synthAudio.js
│   ├── wasm/
│   │   └── visualEngine.js
│   ├── components/
│   │   ├── header.js
│   │   ├── discoveryControls.js
│   │   ├── discoveryMarkup.js
│   │   ├── galleryModel.js
│   │   ├── mainView.js / galleryPagination.js
│   │   ├── detailView.js / stylePickerMarkup.js
│   │   ├── lazyPreviewLoader.js
│   │   ├── archetypeTemplates.js
│   │   ├── splitCompareTabs.js
│   │   ├── mockupTemplates.js
│   │   ├── mockupRuntime.js
│   │   ├── selectionDock.js
│   │   ├── peekPreview.js
│   │   └── audioWidget.js
│   ├── styles/
│   │   ├── themeTokens.css     # Core 36 자동 생성 initial 파일
│   │   ├── themeTokensExpansion.css # 신규 84종 자동 생성 async 파일
│   │   ├── expansion-preview.css # 신규 21문법 async 상세 규칙
│   │   ├── interactive.css
│   │   └── wave1-styles.css    # 신규 12종 전용·반응형·reduced-motion CSS
│   └── utils/
│       ├── clipboard.js
│       ├── designSpecGenerator.js
│       └── inspectorState.js
├── scripts/
│   ├── validateCatalog.js
│   ├── generateThemeStyles.js  # 명시적 write / read-only --check
│   ├── verifyWave1Chrome.js    # 격리 Crostini Chrome QA 및 증거 저장
│   ├── verifyCatalogDiscoveryChrome.js # 탐색·URL·접근성 QA
│   ├── analyzeInitialBundle.js # 초기 정적 JS/CSS gzip gate
│   ├── verifyRenderScalabilityChrome.js # actual 120 + synthetic 60/120 QA
│   └── verifyCatalog120Chrome.js # actual 120×8×2와 대표 상세 흐름 QA
├── tests/
│   ├── catalogDiscovery.test.js
│   ├── catalogExpansion120.test.js
│   ├── catalogValidation.test.js
│   ├── designSpecGenerator.test.js
│   ├── inspectorState.test.js
│   ├── mockupRuntime.test.js
│   ├── previewIntegration.test.js
│   ├── previewRegistry.test.js
│   ├── renderScalability.test.js
│   ├── initialBundleAnalysis.test.js
│   ├── sandboxDeviceStyles.test.js
│   ├── styleContract.test.js
│   ├── themeGeneration.test.js
│   └── splitCompareTabs.test.js
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
Open browser at: `http://localhost:5173/design_sample_selector/` (or port assigned by Vite)

### Option B: Node.js Preview Build
```bash
npm run build
npm run preview
```

Open browser at: `http://localhost:4173/design_sample_selector/` (or the port printed by Vite).

`npm run build`는 `prebuild` 수명주기에서 `npm run validate:catalog`, `npm run check:themes`를 순서대로 실행합니다. 구조·관계·참조 오류가 있거나 생성 CSS가 정규 토큰보다 오래되면 Vite 번들을 만들지 않습니다. `prebuild`는 파일을 수정하지 않습니다.

`python3 -m http.server`처럼 source root를 그대로 제공하는 서버는 지원하지 않습니다. CSS dynamic import를 Vite가 production asset으로 변환하지 못해 Preview/Detail graph가 실패할 수 있으므로 개발은 Vite dev, 배포 확인은 Vite preview 또는 `qa:pages:chrome`을 사용합니다.

---

## 4. Verification & Testing Protocol

자동 릴리스 게이트를 먼저 실행합니다.

```bash
npm run check
```

이 명령은 Node 내장 테스트 러너로 핵심 회귀 테스트를 실행한 뒤 카탈로그 `prebuild` 검증과 Vite 프로덕션 빌드를 수행합니다.

테마 원천과 생성 파일만 점검할 때는 다음 명령을 사용합니다.

```bash
# StyleRecord.tokens / themeEffects 변경 후 추적 CSS 갱신
npm run generate:themes

# read-only 최신성 검사
npm run check:themes

# theme 투영·직렬화·CLI·legacy/full 내보내기 호환 행렬
npm test -- tests/themeGeneration.test.js
```

스타일별 13개 값은 `src/catalog/packs/`의 `StyleRecord.tokens`에서만 작성합니다. 선택적 `[data-theme]` 컨테이너 블러는 `themeEffects.backdropBlur`가 소유하며 인스펙터의 `defaultTweaks.backdropBlur`와 합치지 않습니다. `src/styles/themeTokens.css` 첫머리의 자동 생성 경고대로 이 파일을 직접 편집하지 마십시오.

`check:themes`가 stale 또는 누락으로 종료 코드 `1`을 반환하면 `npm run generate:themes`를 실행하고 정규 레코드와 생성 CSS diff를 함께 검토합니다. 알 수 없는 옵션 또는 도구 내부 실패는 종료 코드 `2`입니다. 생성 후 `npm run check`가 통과해야 작업이 완료됩니다.

카탈로그만 점검할 때는 다음 명령을 사용합니다.

```bash
npm run validate:catalog
npm run validate:catalog -- --verbose
npm run validate:catalog -- --json
npm run validate:catalog -- --strict
```

현재 actual 120은 기존 24개 `legacy`와 96개 `ready`로 구성됩니다. 전체는 오류 0개·legacy 경고 56개로 기본 검증과 빌드를 통과하며 ready 96종은 오류·경고 0개입니다. `--strict`는 legacy 경고도 실패로 처리하므로 현재 기대 종료 코드는 `1`입니다. 알 수 없는 옵션이나 검증기 내부 실패는 종료 코드 `2`입니다.

프리뷰 계층만 빠르게 점검할 때는 다음 명령을 사용합니다.

```bash
npm test -- tests/previewRegistry.test.js tests/previewIntegration.test.js tests/mockupRuntime.test.js
```

이 표적 게이트는 definition/오류 계약, 기존 24·36 subset 지문과 actual 120 전체 지문, 120종 × 8 아키타입 960개 출력, Web 480개 탭, motion hydration과 reduced-motion을 검사합니다. 실제 UI는 필요한 종류에 따라 `thumbnailEntry.js`, `motionEntry.js`, `componentEntry.js`를 사용하고 동기 facade는 기존 호출자를 위한 호환 경계로 유지합니다.

Wave 1의 실제 Chrome 행렬은 다음 명령으로 재현합니다.

```bash
npm run qa:wave1:chrome -- --artifacts=.antigravity/archive/wave1-chrome-qa
```

`/usr/bin/google-chrome`을 사용하며 기본 사용자 프로필과 분리된 임시 `--user-data-dir`를 생성합니다. Grid/Bento/Spectrum, 320/375/414/768/1024/1440px, Core 36 × 8 아키타입 × Desktop/Mobile 576상태, 신규 12종 집중 Detail, Split, reduced-motion, console·page·same-origin network 진단을 검사하고 `report.json`과 대표 스크린샷을 지정 경로에 저장합니다.

Catalog discovery의 검색·facet·정렬·URL·세 보기·접근성 행렬은 다음 명령으로 재현합니다.

```bash
# 기본 증거 경로: .antigravity/archive/catalog-discovery-chrome-qa/
npm run qa:discovery:chrome

# 프로젝트 내부의 다른 증거 경로 지정
npm run qa:discovery:chrome -- --artifacts=.antigravity/archive/catalog-discovery-chrome-qa
```

이 명령도 `/usr/bin/google-chrome`과 격리된 임시 profile을 사용합니다. 검색·category+bookmark·multi-facet AND/OR·네 정렬·URL reload/`popstate`·empty reset·Grid/Bento/Spectrum·키보드·88개 입력 이름·44px target·reduced-motion을 320/375/414/768/1024/1440px에서 검사합니다. 보고서와 320px/1440px 대표 스크린샷은 지정 경로에 남고 Vite, Chrome과 임시 profile은 종료 시 정리됩니다.

Actual 120과 render scalability의 초기 bundle·용량 행렬은 다음 명령으로 재현합니다.

```bash
# 현재 production dist의 정적 module/modulepreload/CSS gzip 예산
npm run build
npm run analyze:bundle

# preqa build 후 actual 120 + QA 전용 synthetic 60/120 Chrome 검증
npm run qa:scalability:chrome

# preqa build 후 actual 120 전체 페이지·1,920 device 상태·대표 상세 흐름
npm run qa:catalog120:chrome
```

`qa:scalability:chrome`은 production actual 120과 dev-only synthetic 60/120 fixture에서 bounded DOM·강제 실패/재시도·observer를 검사합니다. `qa:catalog120:chrome`은 세 보기 4페이지, 신규 thumbnail 84개, actual 120×8×2, Web 480탭, Detail·Split·Peek·Dock, 지연 CSS, reduced-motion, responsive, LCP/CLS와 diagnostics를 검사하고 `.antigravity/archive/catalog120-chrome-qa/`에 증거를 남깁니다.

### GitHub Pages project-site build와 배포

production base는 `/design_sample_selector/`이며 지원 URL은 이 root와 query/hash입니다. source root 또는 임의 deep pathname을 production entry로 사용하지 않습니다.

```bash
npm ci
npm run check
npm run verify:pages-artifact
npm run qa:pages:chrome
```

`npm run build`는 Vite `.vite/manifest.json`의 entry/import/dynamicImport/CSS/asset closure를 재귀 확인하고 `dist/release-manifest.json`에 release SHA, 경로, 크기, SHA-256과 MIME을 기록합니다. `.github/workflows/deploy-pages.yml`은 검증이 끝난 `dist/` directory 하나만 `upload-pages-artifact`와 `deploy-pages`에 넘깁니다. repository Settings → Pages → Source는 **GitHub Actions**여야 합니다.

Pages는 이전 hashed asset 보존이나 사용자 지정 cache header를 제공하지 않으므로, 배포 직후 fresh profile과 기존 cache context에서 Preview·Detail·Split을 smoke test합니다. 실제 배포는 workflow push와 Pages environment 승인이 필요한 별도 운영 단계입니다.

1. **Canvas 2D Test:** Check browser console for `[Canvas VisualEngine] 2D renderer ready. Particles:` and confirm the header chip reads `CANVAS 2D`.
2. **Audio Synth Test:** Click anywhere on the screen to initialize Web Audio API context. Click Play on the Audio Widget. Confirm BGM synth plays and track title changes.
3. **Category Hover Test:** Hover mouse over `스위스 스타일` card. Confirm subcategory badges expand with sound effect `SFX_HOVER`.
4. **Detail View Test:** Click `격자 중심 모더니즘` badge. Confirm modal opens with live grid mockup, copyable color hex buttons, and pros/cons hover cards.
5. **Color Copy Test:** Click color `#FF3300`. Confirm audio chime plays and toast notification `Hex #FF3300 copied to clipboard` appears.
6. **Inspector State Test:** Switch from `swiss-grid` to `corporate-minimal`, then visit all four inspector tabs and three CSS modes. Visible code, copied content, and download filenames must keep `corporate-minimal`.
7. **Modal Re-entry Test:** Close the modal from a non-default inspector tab/mode and reopen it. CSS tab, Full Bundle mode, visible pane, `aria-selected`, and download label must agree.
8. **DTCG Test:** Parse all 120 JSON outputs and verify DTCG 2025.10 structured color/gradient/dimension/shadow/fontFamily values. CSS `box-shadow: none`은 투명한 0-offset/0-blur shadow로 정규화되어야 합니다.

## 5. 새 스타일 팩 작성 및 실패 복구

현재는 정적 pack definition 방식이며 런타임 `register()` API는 없습니다. 120종 이후 새 스타일은 별도 사양·예산을 승인한 뒤 다음 순서를 한 작업 단위로 수행합니다.

1. `src/catalog/packs/expansion/`의 명시적 blueprint·pack manifest·`StyleRecord` 계약을 사용하고 `index.js` 조립에 포함합니다.
2. `StyleRecord.preview`의 세 ID와 같은 ID를 expansion renderer/thumbnail/motion definition에 넣고 기존 배열과 조합합니다. thumbnail은 renderer ID를 fallback key로 쓰지 않습니다.
3. renderer는 선언한 Web 탭마다 비어 있지 않은 HTML을 반환하고 `.mockup-unit` root를 포함해야 합니다. motion은 `effect-layer`, `unit-class`, `template-local`, `thumbnail-local`, `interaction-local`, `metadata-only` 중 실제 근거만 선언하며 `metadata-only`는 단독으로만 사용합니다.
4. thumbnail HTML은 상위 버튼 내부에 삽입되므로 interactive tag를 포함하지 않습니다. 신규 상세 스타일은 root 아래에 격리하고 component 경계에서 지연 전달합니다. 테마 값의 원천은 `StyleRecord.tokens`이며 두 생성 theme CSS를 직접 고치지 않습니다.
5. `src/preview/index.js`, `src/components/mockupTemplates.js`, `src/catalog/validation/currentCatalog.js`에는 스타일별 분기나 ID 목록을 추가하지 않습니다. 공개 API와 참조 inventory는 definition 배열에서 자동 조립됩니다.

| 진단 코드 | 의미 | 복구 기준 |
| --- | --- | --- |
| `PREVIEW_DEFINITION_INVALID` | ID, 배열, class, channel, asset path 또는 구현 형태가 계약과 다름 | 해당 definition을 `contract.js` 규칙에 맞추고 안전한 프로젝트 상대 경로만 사용 |
| `PREVIEW_DEFINITION_DUPLICATE` / `PREVIEW_ALIAS_COLLISION` | 정규 ID나 renderer 별칭이 충돌 | kind별 정규 ID를 고유하게 만들고 별칭 소유자를 하나로 제한 |
| `PREVIEW_REFERENCE_UNKNOWN` | catalog 또는 render/hydration 입력이 미등록 ID를 참조 | `StyleRecord.preview`와 세 definition ID를 맞춤; 다른 스타일로 fallback하지 않음 |
| `PREVIEW_TAB_UNSUPPORTED` | renderer가 선언하지 않은 Web 탭 요청 | core renderer에 네 탭 구현을 추가하거나 호출 탭을 계약 안으로 수정 |
| `PREVIEW_RENDER_OUTPUT_INVALID` | 빈 HTML 또는 component의 `.mockup-unit` root 누락 | 구현 출력 자체를 수정하고 기존 정상 출력 hash가 바뀌면 diff 원인을 검토 |

`hasPreviewReference()`와 capability 조회의 `false`/`null`은 외부 기능 탐지 결과입니다. `PreviewRegistryError`는 정상 catalog에서 발생하면 데이터/definition 회귀이므로 catch해서 숨기지 말고 위 진단 필드(`code`, `referenceKind`, `referenceId`, `tab`)를 기준으로 수정합니다. catalog 검증 실패 시 `--verbose`로 정확한 `StyleRecord.preview` 경로를 확인하십시오.

Chrome에서만 재현되는 문제는 Vite를 로컬로 실행하고 기본 Chrome profile과 분리된 임시 `--user-data-dir`에서 확인합니다. 종료 후 Chrome/Vite 프로세스, 포트와 임시 profile을 정리합니다. Crostini의 GCM, SwiftShader, on-device model 메시지는 페이지 console·exception·same-origin 네트워크 결과와 분리해 판정합니다.

## 6. 현재 검증 기준선 (2026-08-31)

- `npm run check`: 152/152 Node 테스트, catalog 오류 0개·legacy 경고 56개, 두 생성 theme CSS 최신성 검사와 Vite 프로덕션 빌드 통과.
- Actual catalog: 120종, 8 category × 15, 8 pack, legacy 24 + ready 96. 신규 84종은 품질 오류·경고 0이다.
- Preview inventory: renderer/thumbnail/motion/asset `120/120/120/0`; 기존 24·36 subset 승인 지문과 actual 120 전체 지문을 함께 고정한다.
- Node 행렬: Web 120 × 4 = 480개, 아키타입 120 × 8 = 960개. Chrome device 행렬은 120 × 8 × 2 = 1,920개다.
- Crostini Chrome `151.0.7922.173`: Grid/Bento/Spectrum 각 4페이지로 120 ID와 신규 thumbnail 84개에 도달하고 375/768/1024/1440px overflow·label 계약을 통과했다.
- 대표 `spatial-glass-ui`는 Desktop `665px` 2열, Mobile `338px` 1열이며 category selector 15종, Split native 120/visual 12 per slot, Peek·Dock·reduced-motion을 통과했다. 신규 84종 전체의 Desktop/Mobile grid가 구분된다.
- Vite는 75개 모듈을 빌드한다. 정적 초기 JavaScript는 `263.81kB` raw / `83.46kB` gzip, CSS는 `171.45kB` raw / `32.86kB` gzip이다. expansion preview/theme CSS는 각각 `4.14/4.24kB` gzip async asset이다.
- Actual Chrome Web Vitals는 LCP `732ms`, CLS `0`, interaction max `142.8ms`; console/network/application diagnostics와 issue는 0이다.
- 증거는 `.antigravity/archive/catalog120-chrome-qa/`, `.antigravity/archive/render-scalability-chrome-qa/`, `.antigravity/archive/catalog-discovery-chrome-qa/`에 보존한다.
- 초기 예산 여유는 JS 약 `5.52kB`, CSS 144 bytes다. 120종 이후 확장은 current async CSS·bounded DOM 경계를 유지하고 새 사양과 예산을 승인해야 한다.
