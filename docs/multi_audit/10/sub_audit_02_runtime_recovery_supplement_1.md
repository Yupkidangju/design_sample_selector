# Sub Audit Report

## 1. Audit Metadata

- Audit Turn: 10 / sub_audit_02 / supplement_1
- Perspective: GitHub Pages 배포 경로, Vite base와 project-site subpath, source/dist URL 폐쇄성, hashed lazy chunk 캐시 및 publish 원자성
- User Goal: 사용자가 추가로 “github pages로 서빙해본겁니다”라고 명시한 사실을 반영하여, Preview/Detail lazy failure와 retry 무응답이 배포 산출물·경로·캐시 문제와 연결되는지 독립 점검한다.
- Audit Basis: Standard-backed + Goal-driven
- Standard Path: `/home/eunho1/Projects/web/design_sample_selector/AI_AUDIT_DOC_STANDARD.md`
- Report Contract: `/home/eunho1/.codex/skills/multi-audit/references/report-contract.md`
- Scope Guard: 기존 원본 감사보고서는 읽거나 수정하지 않았다. 소스·설정·제품 문서는 수정하지 않았고 이 supplement만 생성한다.
- Audit Method: 저장소 파일·Git tree·기존 `dist` 산출물 정적 대조 및 쓰기 없는 bundle/asset closure 검사. GitHub Pages live URL, repository Settings, build, Chrome QA는 확인하지 않았다.

## 2. Assigned Scope

- `vite.config.js`, `package.json`, `package-lock.json`, `.gitignore`
- source `index.html`, `src/main.js`, `src/components/lazyPreviewLoader.js`, `src/preview/componentEntry.js`, `src/preview/componentLazyEntry.js`, `src/preview/componentLazyRetryEntry.js`, `src/components/archetypeTemplates.js`, `src/components/detailView.js`
- existing `dist/index.html` 및 `dist/assets/*`의 initial/lazy hashed URL과 transitive CSS/JS 관계
- GitHub Pages workflow/deploy 설정, `gh-pages` 또는 branch-publish 증거, `docs`/`CNAME`/`404.html`/manifest/header 설정
- project-site subpath와 SPA/deep-link 동작: `src/state/discoveryUrlState.js`, 절대 `/src`를 사용하는 Chrome 검증 스크립트
- stale HTML/hashed chunk, partial/non-atomic publish가 관찰된 Preview/Detail 오류에 미치는 조건

배포 경로의 핵심 분기는 다음과 같다.

```text
Pages가 저장소 source root를 서빙
  └─ index.html → ./src/main.js
       └─ componentEntry.js → native import('../styles/*.css')  [Vite 변환 없음]
            └─ Peek/Confirm/Detail lazy module evaluation 실패

Pages가 Vite dist artifact를 서빙
  └─ dist/index.html → ./assets/index-<hash>.js/.css
       └─ hashed lazy wrappers → hashed componentEntry/detail chunks
            └─ Vite preload helper → hashed CSS
                 [현재 local dist closure는 존재하지만 publish/cache 정책은 미확정]
```

## 3. Excluded and Uninspected Scope

- 이전 `docs/multi_audit` 보고서, `node_modules`, `.git` object 내용, 생성·벤더 트리의 내용을 읽지 않았다. Git ref/tree 존재 여부만 배포 설정 확인에 사용했다.
- GitHub repository Settings의 실제 Pages source, Actions 실행 이력, live HTTP response/cache header, CDN edge 상태는 로컬 저장소 증거가 없어 확인하지 않았다.
- `npm run build`, `npm run preqa:*`, `npm run qa:*`와 Chrome/프로파일 생성은 실행하지 않았다. 기존 `dist`만 읽기 전용으로 검사했다.
- 실제 non-atomic deploy window 또는 stale browser cache는 재현하지 못했다. 현재 local `dist`가 닫혀 있다는 사실은 live Pages가 같은 artifact를 서빙한다는 증거가 아니다.

## 4. Evidence Examined

### 4.1 Build and source index

- `vite.config.js:3-13`은 `base: './'`, `outDir: 'dist'`, `assetsDir: 'assets'`를 사용한다. project-site 루트의 trailing slash 문서에서는 상대 URL이 `/design_sample_selector/assets/...`로 해석될 수 있지만, deep path에서는 현재 문서 경로에 상대적으로 해석된다.
- `package.json:9-29`에는 `dev`, `build`, `preview`, local Chrome QA 및 test만 있고 Pages deploy/`deploy`/artifact upload script가 없다. `package-lock.json:11,1092-1106`은 Vite 의존성만 고정하며 Pages action/deploy dependency는 없다.
- `.gitignore:1-2`가 `dist/`를 무시한다. 현재 `git ls-files`에서 `index.html`은 추적되지만 `dist/index.html`과 `dist/assets/*`는 추적되지 않는다.
- source `index.html:12-14,42`는 `./index.css`, `./src/styles/interactive.css`, `./src/styles/wave1-styles.css`, `./src/main.js`를 가리킨다. 즉 repository root branch를 Pages로 서빙하면 Vite가 생성한 `dist/index.html`이 아니라 source entry가 문서 entry가 된다.
- `src/preview/componentEntry.js:9-15`는 브라우저에서 `import('../styles/themeTokensExpansion.css')`, `import('../styles/expansion-preview.css')`, `import('../styles/audit9-detail.css')`를 직접 dynamic import한다. 이 import는 Vite build에서만 CSS preload helper/hashed asset으로 변환된다.
- `src/components/lazyPreviewLoader.js:31-46`은 source 기준 `componentLazyEntry.js`/`componentLazyRetryEntry.js` 및 `detailView.js`/`detailView.js?retry=1`을 import한다. `src/preview/componentLazyEntry.js:2-5`와 `componentLazyRetryEntry.js:2-5`는 같은 `./componentEntry.js`를 정적으로 import하며, `src/components/archetypeTemplates.js:7`도 Detail에서 같은 componentEntry를 정적으로 사용한다.

### 4.2 Existing dist artifact and URL closure

- `dist/index.html:12-13`은 `./assets/index-3kCMrGOG.js`와 `./assets/index-C_FQ7CmV.css`만 initial entry로 참조한다. 두 파일은 현재 `dist/assets/`에 존재한다.
- `dist/assets/index-3kCMrGOG.js:1`의 Vite-generated loader는 `detailView-CI4Pr829.js`, `detailView-CYxE8Dvu.js`, `componentLazyEntry-3v5OAJSO.js`, `componentLazyRetryEntry-DIHk_LOt.js`를 별도 hashed chunk로 가리킨다.
- `dist/assets/componentLazyEntry-3v5OAJSO.js:1`과 `componentLazyRetryEntry-DIHk_LOt.js:1`은 모두 `./componentEntry-CCuwUcTq.js`를 import한다. `detailView-CI4Pr829.js:1`과 `detailView-CYxE8Dvu.js:1`도 모두 같은 `./componentEntry-CCuwUcTq.js`를 import한다.
- `dist/assets/componentEntry-CCuwUcTq.js:1`은 source의 CSS dynamic import가 사라지고 `themeTokensExpansion-DtUXH0xP.css`, `expansion-preview-0Uhf-Ta2.css`, `audit9-detail-CfpquNiV.css`를 Vite preload map 및 `Promise.resolve` helper로 처리하는 형태다. 이는 source root 서빙과 dist 서빙의 런타임이 다름을 입증한다.
- 읽기 전용 closure 검사 결과: `dist/index.html`의 initial 2개 참조가 모두 존재하고, 모든 현재 hashed JS 상대 import edge 13개가 존재하며 missing edge는 0개였다. CSS preload map에 열거된 세 파일도 현재 `dist/assets` 목록에 모두 존재한다.
- 현재 `dist`에는 `manifest.json`, `404.html`, `CNAME`이 없으며, asset URL/cache policy를 고정하는 별도 header 설정도 없다.

### 4.3 GitHub Pages/deploy evidence

- `git remote -v`의 저장소 slug는 `Yupkidangju/design_sample_selector.git`이며, 따라서 기본 project-site 후보는 `https://<owner>.github.io/design_sample_selector/`이다. 이 URL은 network로 검증하지 않았고 remote에서 추론한 후보일 뿐이다.
- 현재 branch는 `main`뿐이고 local/remote `gh-pages` branch가 없다.
- 현재 tree와 `git ls-tree -r HEAD`에서 `.github/workflows/*`, `CNAME`, `404.html`, `.nojekyll` 및 Pages deploy 관련 파일이 발견되지 않았다. `docs/`에도 site `index.html`이 없다.
- README/BUILD_GUIDE의 실행 경로는 local Vite dev/preview, `npm run build`, Python static smoke 및 local Chrome QA이며 GitHub Pages artifact publish 절차를 기술하지 않는다.
- 따라서 현재 저장소만으로는 Pages가 source branch root를 서빙하는지, 외부에서 build한 `dist`를 업로드하는지, 어떤 cache/atomicity 정책을 쓰는지 재현할 수 없다.

### 4.4 Subpath/SPA and QA path evidence

- `src/state/discoveryUrlState.js:27-33`은 URL을 쓸 때 `location.pathname`을 그대로 보존하고 query/hash만 교체한다. 앱은 pathname 기반 route를 만들지 않는다.
- source/dist index 모두 `<base>` 태그나 absolute `/assets` 경로를 사용하지 않는다. project-site root의 trailing slash에서 `base: './'`는 정상적인 상대 asset URL 전략이다.
- `scripts/verifyCatalog120Chrome.js:447,564-602,718-719` 및 `scripts/verifyRenderScalabilityChrome.js:838-842`는 `/src/...` absolute import를 사용하고, 두 스크립트 모두 local Vite root(`http://127.0.0.1:<port>/`)를 띄운다. 이는 Pages project-site subpath의 production URL 검증기가 아니다.
- repository에는 deep-link fallback용 `404.html` 또는 SPA rewrite 설정이 없다. `/design_sample_selector/?q=...#...` 같은 root query/hash 상태는 pathname을 유지하므로 경로 문제가 없지만, `/design_sample_selector/foo` 같은 임의 deep pathname은 Pages의 fallback 정책에 의존한다.

### 4.5 Safe verification commands

- `node scripts/analyzeInitialBundle.js`: 현재 dist initial JS `88.60kB`/budget `88.98kB`, CSS `32.86kB`/budget `33.00kB`, 결과 `PASS`.
- `node --test tests/initialBundleAnalysis.test.js`: 2 passed, 0 failed.
- 위 두 검사는 `dist/index.html`의 initial entry/CSS만 검사한다. lazy hashed chunk 전체의 존재·URL 폐쇄성·Pages publish 순서까지 검사하지 않는다.
- 별도 inline read-only closure scanner로 현재 dist를 검사했으며 missing relative JS edge 0개였다. 이 scanner는 저장소 파일을 생성·수정하지 않았다.

## 5. Findings

### [A10-S02-SUP1-F001] GitHub Pages가 어떤 build artifact를 서빙하는지 저장소에 재현 가능한 계약이 없음

- Pass: 1. Implementation Compliance
- Pattern: `BUILD-001`, `DEP-001`, `DOC-BACKFILL`
- Area: GitHub Pages workflow, artifact ownership, deploy reproducibility
- Severity: Major
- Status: Confirmed (저장소 증거 부재; 실제 Pages Settings는 미확인)
- Summary: `dist/`는 무시되고 Pages workflow/`gh-pages` branch/deploy script가 없으므로, 저장소만으로는 GitHub Pages가 Vite build 결과를 배포한다는 보장이 없다. branch-root Pages라면 추적되는 source `index.html`이 entry가 되고, `/docs` source라면 site entry 자체가 없다.
- Evidence: `package.json:9-29`의 scripts에 build는 있지만 Pages deploy 단계가 없음; `vite.config.js:9-12`의 output이 `dist`; `.gitignore:1-2`의 `dist/`; `git branch -a`에 `main`/`origin/main`만 존재; current tree에 `.github/workflows`, `gh-pages`, `CNAME`, `404.html`이 없음; `index.html`은 추적되지만 `dist/index.html`은 추적되지 않음.
- Expected Basis: Pages 배포는 source와 build artifact를 명확히 구분하고, 모든 initial/lazy asset을 같은 release artifact로 원자적으로 게시하며, 재현 가능한 workflow 또는 문서화된 branch publish 경계를 가져야 한다.
- Actual: local `dist`가 존재하고 `npm run preview`가 동작할 수 있어도 그것은 ignored workspace 산출물이다. 외부 Pages 설정이 없다면 commit에 포함된 source root가 실제로 서빙된다. 외부에서 수동 upload를 한다면 그 절차·파일 선택·cache 정책이 저장소에서 검증되지 않는다.
- Impact: local preview와 live Pages가 서로 다른 entry graph를 사용할 수 있다. 이 경우 초기 gallery는 열리지만 lazy component/Detail에서만 실패하는 현재 증상과 정확히 같은 관찰 패턴이 생긴다.
- Suggested Action: Pages source를 Vite build artifact로 단일화하고, workflow가 `npm ci` → `npm run build` → `dist` 전체 upload/deploy를 수행하도록 고정한다. branch publish를 유지한다면 source root를 직접 Pages로 노출하지 말고 `dist` 배포 branch와 보존 정책을 명시한다. artifact에는 index와 모든 lazy chunk를 함께 포함하고 publish 전 closure 검사를 실행한다.
- Re-audit Method: 실제 Pages Settings 또는 workflow run을 확인하여 published `index.html`이 source인지 `dist`인지 판별한다. live response body의 script/link 경로가 `./src/main.js`인지 `./assets/index-<hash>.js`인지, build commit SHA와 asset 목록이 일치하는지 기록한다.
- Confidence: High (저장소 증거), Medium (외부 Pages 설정 미확인)
- Notes: 이 finding은 GitHub Pages를 사용한다는 사용자 사실과 저장소의 부재 증거를 함께 해석한 것이다. 외부 private workflow가 있다면 local repository에서는 검증할 수 없다.

### [A10-S02-SUP1-F002] Source root를 Pages로 직접 서빙하면 Vite-only CSS lazy import가 Preview/Detail을 실패시킴

- Pass: 2. Debug/Engineering Quality
- Pattern: `DBG-001`, `ARCH-001`
- Area: source-vs-dist module evaluation, native ESM MIME boundary, retry transitive dependency
- Severity: Major
- Status: Probable (Pages branch-root 모드일 때 직접 재현되는 경로)
- Summary: source `index.html`은 브라우저가 `src/main.js`를 native ESM으로 직접 실행하게 한다. 이 경로에는 Vite의 CSS import 변환이 없으므로 `componentEntry.js`의 CSS dynamic import가 브라우저 module evaluation failure가 된다. 그 실패는 component retry facade와 Detail retry facade가 공유하는 `componentEntry.js` transitive URL까지 다시 실패시켜 사용자에게 generic error/retry 무응답으로 나타난다.
- Evidence: source `index.html:12-14,42`의 raw source entry; `componentEntry.js:9-15`의 `.css` dynamic imports; `componentLazyEntry.js:2-5`와 retry entry의 같은 `componentEntry.js`; `archetypeTemplates.js:7`의 Detail 정적 componentEntry import; 반대로 built `componentEntry-CCuwUcTq.js:1`에는 raw CSS `import()`가 없고 Vite preload map/helper가 있다.
- Expected Basis: GitHub Pages는 변환된 production artifact를 서빙하거나, native browser가 이해할 수 있는 module graph만 배포해야 한다. lazy retry는 실패한 module graph를 실제로 복구해야 한다.
- Actual: source root 모드에서는 초기 main/header/gallery가 relative JS/CSS로 시작할 수 있지만, Peek/Confirm/Detail이 componentEntry를 처음 평가하는 순간 CSS URL을 JS module로 import한다. primary가 reject된 뒤 retry facade가 새 outer URL을 사용해도 이미 실패한 동일 `componentEntry.js`와 CSS URL을 다시 의존하므로 복구하지 못한다. Detail의 `detailView.js?retry=1`도 같은 componentEntry를 정적으로 참조한다.
- Impact: “미리보기 불러오지 못함”과 “다시 시도 무응답”이 source-root Pages에서 결정적으로 재현될 수 있다. 더블클릭 Detail은 Detail module 자체가 아니라 transitive componentEntry evaluation failure로 같은 generic error를 보일 수 있다.
- Suggested Action: Pages에는 source root가 아니라 `npm run build` 결과 `dist` 전체를 게시한다. source를 직접 서빙하는 운영 경로를 허용하지 않는다. 만약 build artifact가 실제 live entry라면 F003의 stale/partial artifact 검증으로 분기한다.
- Re-audit Method: live `index.html`의 entry script와 response `Content-Type`을 확인한 뒤, fresh browser context에서 Peek hover/Confirm/true double-click Detail을 수행한다. network에서 source CSS `import()` 실패 또는 hashed CSS preload 404를 각각 구분하고, retry 후 동일 URL 재사용 여부를 기록한다.
- Confidence: High (source-root 조건부 경로), Medium (실제 Pages source mode 미확인)

### [A10-S02-SUP1-F003] Hashed lazy chunk의 stale/partial/non-atomic publish를 막는 계약이 없음

- Pass: 2. Debug/Engineering Quality
- Pattern: `DBG-001`, `DEP-002`, `ARCH-001`
- Area: release artifact closure, hashed chunk retention, CDN/browser cache, atomic deployment
- Severity: Major
- Status: Probable (live mixed-version 상태는 미관찰)
- Summary: 현재 local `dist`는 index→initial→lazy JS/CSS closure가 닫혀 있지만, 저장소에는 release manifest, asset retention, cache policy, atomic Pages publish를 보장하는 경계가 없다. 수동 파일 동기화 또는 오래된 HTML/브라우저 bundle과 새 asset directory의 혼합이 발생하면 초기 화면은 정상이고 lazy Preview/Detail chunk만 404가 될 수 있다.
- Evidence: `dist/index.html:12-13`의 hashed initial URLs; `dist/assets/index-3kCMrGOG.js:1`의 hashed Detail/component primary/retry URLs; 두 Detail chunk와 두 component facade가 각각 같은 shared `componentEntry-CCuwUcTq.js`를 요구; 현재 `dist`에는 모든 파일이 있으나 `dist/manifest.json`은 없음; `.gitignore:2`와 Pages workflow 부재로 artifact provenance/보존 기간이 추적되지 않음.
- Expected Basis: 한 release의 HTML, initial bundle, lazy primary/retry chunk와 transitive CSS/JS는 함께 게시되어야 하며, old cached HTML이 grace period 동안 참조하는 immutable asset도 제거되지 않아야 한다. retry URL은 실제 배포된 alternate chunk여야 한다.
- Actual: 현재 스냅샷에서는 closure scanner가 13개 JS edge와 CSS map 파일을 모두 찾았다. 하지만 새 index가 먼저 게시되고 hashed lazy files가 늦게 올라오거나, 새 build가 old chunks를 제거한 뒤 CDN이 old index/bundle을 제공하면 lazy import만 404가 된다. loader는 같은 release 안의 alternate hashed URL만 시도하므로 두 파일이 모두 없거나 shared componentEntry가 없으면 retry도 실패한다.
- Impact: 초기 bundle budget/첫 화면 QA는 통과하면서, 사용자가 처음 hover/double-click할 때만 “미리보기/상세 불러오지 못함”을 경험할 수 있다. module-map에 404가 실패로 남아 retry button이 실제 복구하지 못하는 조건과도 결합된다.
- Suggested Action: Pages artifact를 directory 단위로 원자 배포하고, HTML은 짧은 cache 또는 no-cache, hashed assets는 immutable + 이전 release grace retention으로 정책화한다. publish 전 index와 모든 dynamic import/CSS preload URL의 closure를 검사하고 release ID/commit SHA를 artifact에 남긴다. 수동 sync를 사용한다면 delete-before-upload를 금지한다.
- Re-audit Method: 두 release artifact를 준비해 old HTML/new asset, new HTML/old asset, lazy primary/retry 누락, shared componentEntry 누락을 isolated static server에서 각각 검사한다. live Pages에서는 response URL/status/order와 cache headers를 fresh 및 cached context에서 비교하고, retry 후 alternate hash 요청이 실제로 200인지 확인한다.
- Confidence: High (해시 graph/closure 사실), Medium (non-atomic 또는 stale 상태가 실제 live에서 발생했는지는 미확인)
- Notes: 현재 local dist 자체에는 missing file이 발견되지 않았으므로 “현재 workspace artifact가 깨졌다”고 판정하지 않는다. 위험은 publish 계약 부재와 live artifact 미확인에 있다.

### [A10-S02-SUP1-F004] `base: './'`는 project-site 루트에는 맞지만 deep SPA path와 Pages용 QA 경로는 보장하지 않음

- Pass: 1. Implementation Compliance
- Pattern: `ARCH-002`, `BUILD-001`, `TEST-001`
- Area: project-site subpath, trailing slash/deep-link behavior, deployment QA portability
- Severity: Minor
- Status: Confirmed (경로 규칙 기준)
- Summary: remote slug에서 추론한 `/design_sample_selector/` project-site 루트에서는 `base: './'`와 dist relative URL이 올바르게 결합한다. 그러나 앱은 pathname router/404 fallback이 없고, 검증 스크립트는 `/src` absolute import와 local Vite root를 전제로 하므로 Pages subpath를 직접 검증하지 않는다.
- Evidence: `vite.config.js:4`; source `index.html:12-14,42`; dist `index.html:12-13`; `discoveryUrlState.js:32-33`은 현재 pathname을 유지할 뿐 path route를 해석하지 않음; `scripts/verifyCatalog120Chrome.js:447,564-602,718-719`와 `verifyRenderScalabilityChrome.js:838-842`의 `/src/...` imports; repository에 `404.html`/rewrite 설정 없음.
- Expected Basis: project-site root와 trailing slash에서 모든 initial/lazy URL이 같은 subpath를 유지해야 하며, 실제 Pages URL에서 실행하는 QA는 해당 base/subpath를 사용해야 한다. 앱이 deep link를 지원하지 않으면 미지원 경계를 명시해야 한다.
- Actual: `/design_sample_selector/`에서 `./assets/...`는 정상적으로 `/design_sample_selector/assets/...`를 가리킨다. 임의 `/design_sample_selector/foo` 문서에 같은 relative `./assets`를 적용하면 `/design_sample_selector/foo/assets`를 찾게 된다. query/hash 공유 URL은 pathname을 root로 보존하면 안전하지만, path segment를 추가한 SPA URL은 Pages fallback에 의존한다. Chrome QA는 `http://127.0.0.1:<port>/`에서만 돌아가므로 live project-site path를 검증하지 않는다.
- Impact: copied deep URL 또는 Pages 설정이 root가 아닌 nested path일 때 app entry/asset이 404될 수 있다. 이 문제는 현재 preview retry와 별개일 수 있지만, 배포 QA가 놓칠 수 있는 경로 조건이다.
- Suggested Action: 지원 URL을 project-site root + query/hash로 명시하고 trailing slash canonicalization을 보장하거나, 실제 deep route가 필요하면 Pages용 `404.html` SPA fallback/절대 site base 전략을 별도 설계한다. Chrome QA에 `--base-url`/project-site path를 주입하고 `/src` absolute helper import를 production asset 검증과 분리한다.
- Re-audit Method: trailing slash root, no-slash root, `?q=...#...`, `/foo` deep path를 실제 Pages 또는 동일한 static server에서 각각 요청한다. document script/CSS/lazy chunk의 최종 URL과 HTTP status, `location.pathname`/query 복원을 기록한다.
- Confidence: High (소스/URL 계산), Medium (Pages의 no-slash redirect/deep fallback 실제 정책 미확인)

### [A10-S02-SUP1-F005] Initial bundle 검사와 Node 테스트가 lazy asset 누락을 green으로 남김

- Pass: 1. Implementation Compliance
- Pattern: `TEST-001`, `BUILD-001`, `SPEC-GAP`
- Area: deployment artifact verification, lazy URL closure regression detection
- Severity: Major
- Status: Confirmed
- Summary: 현재 `analyzeInitialBundle.js`와 `tests/initialBundleAnalysis.test.js`는 `dist/index.html`의 module script/modulepreload/stylesheet만 검사한다. Detail/component lazy hashed chunk, transitive CSS map, retry alternate의 존재·상태·순서는 검사하지 않으므로 Pages upload가 initial asset만 포함해도 CI/로컬 bundle gate가 통과할 수 있다.
- Evidence: `scripts/analyzeInitialBundle.js:16-38,62-115`의 `collectInitialReferences` 및 index 기준 검사; `tests/initialBundleAnalysis.test.js:11-39` fixture가 `detail.js`를 lazy로 두고 assetCount에서 제외; 현재 명령 결과는 initial JS/CSS budget `PASS`이며, lazy closure는 별도 inline scanner로만 확인했다.
- Expected Basis: `BUILD-001`/`TEST-001`에 따라 배포 artifact는 실제 browser import graph의 모든 URL을 검증해야 하고, retry/Detail/Peek 진입 경로가 CI에서 false green이 되지 않아야 한다.
- Actual: index와 initial CSS가 존재하면 분석기가 통과한다. `componentLazyEntry`, `componentLazyRetryEntry`, `detailView` 또는 shared `componentEntry`가 upload에서 빠져도 첫 화면 예산 결과에는 영향이 없다. 누락은 사용자 상호작용 시점에만 드러난다.
- Impact: Pages 배포 후에만 “미리보기/상세 불러오지 못함”이 발생해 build/test 결과와 live 결과가 분리된다. stale/partial publish를 회귀 테스트가 잡지 못한다.
- Suggested Action: production `dist`에 대해 HTML initial refs뿐 아니라 JS의 relative dynamic import, Vite preload map의 JS/CSS URL, primary/retry pair를 재귀적으로 수집해 모두 존재하는지 검사한다. 각 URL을 실제 static server에서 200 및 올바른 JS/CSS MIME으로 확인하고, release artifact 목록 hash/commit과 함께 저장한다.
- Re-audit Method: lazy chunk 하나, retry chunk 하나, shared componentEntry 하나, CSS 하나씩 제거한 fixture를 만들어 gate가 각각 실패하는지 확인한다. 정상 artifact에서는 Peek primary→retry와 Detail primary→retry 요청 목록이 closure manifest와 일치하는지 검사한다.
- Confidence: High

## 6. Uncertainties and Clarifications Needed

1. 실제 GitHub Pages source가 `main` root인지, 외부 Actions artifact인지, 또는 수동 업로드인지 확인해야 F001/F002의 조건을 확정할 수 있다. 현재 저장소에는 이 설정이 없다.
2. live URL의 document body와 response headers를 확인해야 source-root (`./src/main.js`)와 dist (`./assets/index-<hash>.js`)를 구분할 수 있다. 이 구분이 observed failure의 첫 분기다.
3. 현재 local `dist` closure는 complete이지만, 그 파일들이 live Pages에 같은 commit으로 게시되었다는 provenance가 없다. `dist`가 ignored이므로 local `npm run build` 성공만으로 Pages artifact를 증명할 수 없다.
4. `base: './'`의 project-site root 동작은 정적 URL 계산상 양호하다. 다만 Pages의 no-slash redirect와 deep path fallback은 외부 Settings/HTTP 확인 전에는 미확정이다.
5. stale HTML/hashed chunk 문제는 현재 workspace에서 관찰한 결함이 아니라, artifact publish/캐시 정책이 없을 때 발생 가능한 조건이다. 실제 cache headers와 deploy order를 확인하지 않고 확정 원인으로 보고하지 않는다.

## 7. Perspective Decision

**REWORK REQUIRED / GitHub Pages 배포 경계는 검증되지 않았고, source-root 서빙이면 현재 증상의 강한 직접 원인이다.**

`vite.config.js:4`의 `base: './'` 자체는 project-site root(`/design_sample_selector/`)에서 올바른 선택이며, 현재 local `dist/index.html`과 hashed lazy asset closure도 정적으로 닫혀 있다. 따라서 complete한 `dist` artifact를 원자적으로 Pages에 게시한다면 base 경로만으로 Preview/Detail 오류를 설명할 증거는 없다.

반대로 저장소에는 Pages build/deploy 계약이 없고 `dist/`는 무시된다. branch-root Pages가 source `index.html`을 직접 서빙하는 경우 Vite가 변환해야 하는 CSS dynamic import가 componentEntry 평가에서 실패하여 Peek/Confirm retry와 Detail 진입을 모두 막을 수 있다. built artifact를 외부에서 게시하더라도 stale HTML, 누락된 hashed retry/shared chunk, non-atomic publish는 초기 화면을 통과시키면서 lazy 상호작용만 깨뜨릴 수 있다.

최우선 확인은 live document가 source인지 dist인지 판별하는 것이다. 그 다음 Pages deploy를 `dist` 전체의 원자적 artifact로 고정하고, initial뿐 아니라 lazy primary/retry/transitive CSS/JS closure를 publish 전에 검증해야 한다. 이 supplement 범위에서 repository-level 배포 재현성은 **PASS가 아니다**.

