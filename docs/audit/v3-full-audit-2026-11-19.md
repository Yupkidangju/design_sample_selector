# DESIGN SPECTRUM 3.0 전체 구현 감사 및 수정 지시서

- **작성 일시:** 2026-11-19 23:03 KST
- **대상 브랜치:** `gemini_ux_enhanced` (v3.0.0 워킹 트리 미커밋 변경분)
- **근거 파일:** `spec.md`, `designs.md`, `package.json`, `vite.config.js`, `.github/workflows/deploy-pages.yml`, `index.html`, `showcase.html`, `src/**/*`, `scripts/*`, `tests/*`, `.gitignore`, `.antigravity/v3-visual-evidence/*`
- **감사 판정:** **Request Changes** (Critical 3건 · Required 8건 · Optional 3건)
- **가정 및 미확정 사항:** 로컬 Crostini 환경 기준 검증이며, 실제 GitHub Pages 배포 URL의 응답 헤더/CSP 및 외부 Google Fonts 로딩은 배포 후 최종 확인이 필요하다.

---

## 1. 검증 실측 요약

| 검증 항목 | 결과 | 실측 내용 |
|---|---|---|
| `npm run check` | PASS | `validate:styles` (20종×4도메인), `node --test` (8/8), `vite build` (26모듈) 통과 |
| 프로덕션 CSS 격리 (`dist/.vite/manifest.json`) | PASS | `index.html`↔`showcase.html` 간 셸 CSS 교차 누수 0건 (`styles-20.css`만 공유) |
| 의존성 보안 (`npm audit --omit=dev --offline`) | PASS | 취약점 0건, 외부 런타임 의존성 0개 |
| 프로덕션 프리뷰(`vite preview`) Headless Chrome 점검 | 부분 FAIL | 콘솔 에러 0 / 예외 0 / 실패 요청 0 / `360px` 80상태 가로 넘침 0. 단, 아래 Critical/Required 결함 다수 실측 확인 |
| 시각 QA 스크린샷 11장 (`.antigravity/v3-visual-evidence/*.png`) | 부분 FAIL | 20종 변별력은 우수하나 게임 캔버스 좌우 필러박스, 저대비 텍스트/배지, 서랍 `Mono` 폰트 오표기 확인 |

### 유지해야 할 핵심 강점

- 멀티페이지 엔트리(`index.html`, `showcase.html`) 간 CSS 100% 격리 구조
- 레거시 오디오(`synthAudio`, `AudioContext`) 및 `localizeMarkup.js` 완전 삭제와 회귀 테스트(`tests/noLegacyAudio.test.js`)
- 20종 전용 SVG 아트워크(`src/showcase/domainArtwork.js`) 및 사조별 표면 물리(`src/styles/styles-20.css`)
- URL 파라미터 allowlist 검증(`STYLE_BY_ID`, `DOMAIN_IDS`), HTML 이스케이프(`escapeHtml`), 동적 DOM `textContent` 사용

---

## 2. 수정 필수 항목 — Critical (배포 및 핵심 기능 차단)

### C-01. GitHub Pages 배포 워크플로 깨짐 (삭제된 npm 스크립트 호출)

- **대상 파일:** `.github/workflows/deploy-pages.yml` (L35-L40), `package.json` (L9-L18)
- **현상:** 워크플로가 `npm run analyze:bundle`, `npm run verify:pages-artifact`, `npm run qa:pages:chrome`를 실행하지만 v3.0.0에서 해당 스크립트와 파일이 삭제되어 push 시 CI 배포가 무조건 실패한다.
- **수정 지시:**
  - `.github/workflows/deploy-pages.yml`의 검증 단계를 v3.0.0 실제 스크립트(`npm run check`, `dist/index.html`+`dist/showcase.html` 빌드 산출물 존재·에셋 참조 검사, 프로덕션 프리뷰 기반 `npm run qa:visual` 등)로 동기화한다.

### C-02. 스펙 서랍(`<dialog>`) 열림 시 복사 토스트가 브라우저 Top Layer 뒤에 가려짐

- **대상 파일:** `src/utils/clipboard.js` (L7-L24), `src/styles/showcase-base.css` (L226-L244, L497-L520)
- **현상:** `<dialog id="studio-spec-drawer">`가 `showModal()`로 열리면 Top Layer에 올라가지만, `#studio-toast`는 `document.body`에 마운트되어 `z-index: 9500`이어도 `<dialog>`와 `::backdrop` 뒤에 가려진다.
- **실측 근거:** Chrome에서 서랍 내 컬러 스와치 클릭 직후 토스트 중앙 좌표의 최상단 요소가 `DIALOG.studio-drawer`(`toastParent: "BODY"`)로 확인됨.
- **수정 지시:**
  - `#studio-toast`에 네이티브 Popover API(`popover="manual"`, `showPopover()`/`hidePopover()`)를 적용해 Top Layer 최상단에 표시하거나(미지원 브라우저 폴백 포함), 현재 열린 `<dialog[open]>` 내부에 토스트를 호스팅하도록 수정한다.

### C-03. 스펙 서랍 KO/EN 전환 시 스크롤·포커스 유실 및 모달 열림 중 배경 단축키 오동작

- **대상 파일:** `src/showcase/showcaseApp.js` (L88-L147), `src/showcase/floatingHud.js` (L112-L212)
- **현상:**
  1. 서랍 내 `KO`/`EN` 클릭 시 `paintHud()` → `renderSpecDrawerContent()`가 `drawerEl.innerHTML`을 전면 교체해 `.studio-drawer-body` 스크롤이 초기화(`400 → 0`)되고 포커스가 `BODY`로 유실된다.
  2. `keydown` 리스너가 `q/w/e/r`만 `!drawerEl.open`을 확인해, 모달이 열린 상태에서 `1`~`4`, `[`, `]`, `c`를 누르면 배경 스타일/도메인이 바뀌고 서랍 DOM이 강제 교체된다(Chrome 실측: `y2k-chrome → frutiger-aero`).
- **수정 지시:**
  - 언어 전환 시 서랍 전체 DOM을 파괴하지 않고 언어 종속 영역만 갱신하거나, 재렌더 전후로 `.studio-drawer-body.scrollTop`과 클릭한 버튼(`[data-drawer-lang]`)의 포커스를 복원한다.
  - `drawerEl.open`이 `true`일 때는 `Escape`와 `g` 외의 스테이지 전환 단축키(`1`~`4`, `[`, `]`)가 실행되지 않도록 차단한다.

---

## 3. 수정 필수 항목 — Required (사양·품질·접근성·레포 위생)

### R-01. `y2k-chrome` 대시보드 SVG 차트 포인트 `fill` 깨짐 (`rgb(0, 0, 0)` 폴백)

- **대상 파일:** `src/data/styles20-playful.js` (L378), `src/showcase/domainDashboard.js` (L66), `src/styles/styles-20.css`
- **현상:** `y2k-chrome`의 `--surface`가 `linear-gradient(...)`로 정의되어 SVG `<circle fill="var(--surface)">`에서 무효 처리되어 검정(`rgb(0, 0, 0)`)으로 렌더링된다(Chrome 실측).
- **수정 지시:** `y2k-chrome`의 `--surface`를 유효한 `<color>` 토큰(예: `rgba(220, 232, 255, 0.16)`)으로 유지하고 크롬 그라디언트 표면은 `styles-20.css`의 `[data-style='y2k-chrome'] .ds-card`에 적용한다. 추가로 SVG 차트 포인트에 `fill="var(--bg)"` 또는 색 토큰만 쓰도록 보장한다.

### R-02. 영문 AI 프롬프트(`lang: 'en'`)에 한국어 팔레트 역할명 100% 혼입

- **대상 파일:** `src/data/styles20-modern.js`, `src/data/styles20-editorial.js`, `src/data/styles20-playful.js`, `src/prompt/vibePromptGenerator.js` (L13-L55), `tests/vibePromptGenerator.test.js`
- **현상:** 20종 전체 100개 스와치의 `palette[].role`이 한국어이며, `generateVibePrompt(..., { lang: 'en' })`의 Section 2와 CSS 토큰 주석에 그대로 출력된다.
- **수정 지시:** 각 팔레트 항목에 `roleEn`을 추가해 `lang === 'en'`일 때 영문 역할명을 출력하고, `tests/vibePromptGenerator.test.js`에 영문 프롬프트 내 한글 문자(`[가-힣]`) 미혼입 검증을 추가한다.

### R-03. 스펙 서랍 `Mono` 서체 하드코딩 및 DNA 요약 언어 불일치

- **대상 파일:** `src/showcase/floatingHud.js` (L139, L167), `src/data/styles20-playful.js` (L19)
- **현상:**
  - `floatingHud.js:167`에 `JetBrains Mono`가 하드코딩되어 `pixel-arcade`(`fonts.mono: "'Press Start 2P', 'JetBrains Mono', monospace"`)에서 잘못된 서체명이 노출된다(`11-showcase-spec-drawer.png` 확인).
  - `floatingHud.js:139`의 시각 DNA 요약은 `EN` 전환 시에도 항상 `philosophyKo`를 표시한다.
- **수정 지시:** `style.fonts.monoName`(또는 `style.fonts.mono`에서 추출한 실제 서체명)을 렌더링하고, 시각 DNA 요약도 `promptLang === 'en' ? style.dna.philosophyEn : style.dna.philosophyKo`로 동기화한다.

### R-04. 클립보드 권한 거부 시 `textarea` 폴백 미실행 (`designs.md` 위반)

- **대상 파일:** `src/utils/clipboard.js` (L26-L48), `designs.md` (L85)
- **현상:** `navigator.clipboard && window.isSecureContext` 분기에서 `writeText()`가 권한 거부 등으로 reject되면 `textarea` + `execCommand('copy')` 폴백을 시도하지 않고 즉시 실패 처리된다.
- **수정 지시:** `navigator.clipboard.writeText()` 실패 시 `textarea` 폴백을 시도하고, 두 경로 모두 실패한 경우에만 실패 토스트를 띄우도록 수정한다.

### R-05. WCAG AA(4.5:1) 심각 미달 명암비 보정

- **대상 파일:** `src/data/styles20-modern.js`, `src/data/styles20-editorial.js`, `src/data/styles20-playful.js`, `src/styles/styles-20.css`, `src/styles/showcase-domains.css`, `scripts/validateStyles.js`
- **현상 (실측 대비율):**
  - `claymorphism`: `#FFFFFF` on `#FF7096` (**2.62:1**), `#FF7096` on `#F3EEFF` (**2.31:1**), `#FF7096` on `#FFEBF0` (**2.30:1**)
  - `neo-brutalism`: 1번 피처 카드 번호 배지 `#FF4D6D` on `#FFE14D` (**2.47:1**, `03-showcase-brutal-web.png` 확인)
  - `memphis`: `#FF5FA2` on `#FFF4C2` (**2.56:1**), `#FFFFFF` on `#FF5FA2` (**2.83:1**)
  - `risograph`: `#FF4E7A` on `#EFE7D6` (**2.58:1**), `#FFFFFF` on `#FF4E7A` (**3.17:1**)
  - `frutiger-aero`: `#0095E8` on `#D6F2FF` (**2.79:1**), `#FFFFFF` on `#0095E8` (**3.25:1**)
  - `skeuomorphism`: `#FFFFFF` on `#FF5C1B` (**3.09:1**)
  - `neumorphism`: `--ink-muted` `#64748B` on `#E4E9F2` (**3.91:1** — 자체 DO 가드레일의 4.5:1 기준 위반)
- **수정 지시:**
  - 장식/배경용 `--accent`와 텍스트/키커/배지용 `--accent-text`를 분리하거나, `--accent-ink`·`--ink-muted` 명도를 보정해 텍스트 가독성 최소 4.5:1(대형/버튼 최소 기준 포함)을 충족한다.
  - `scripts/validateStyles.js`에 `cssVars` 키셋 일관성 검사 및 텍스트 명암비 검증을 추가한다.

### R-06. WAI-ARIA 구조 위반 및 갤러리 포커스 유실 수정

- **대상 파일:** `src/gallery/galleryApp.js` (L39-L122), `src/showcase/domainMobile.js` (L21-L25), `src/showcase/domainDashboard.js` (L145-L149), `src/showcase/floatingHud.js` (L189-L190), `src/showcase/showcaseInteractions.js` (L59-L70)
- **현상:**
  - `galleryApp.js`: `role="tablist"` 안에 `role="tab"`이 아닌 즐겨찾기 버튼(`aria-pressed`)이 혼재하며, 필터·즐겨찾기 클릭 시 전체 `innerHTML` 재작성으로 포커스가 `BODY`로 유실됨(Chrome 실측).
  - `domainMobile.js`와 `domainDashboard.js`: `role="tablist"` 내부 `<button>`에 `role="tab"`이 누락(`domainMobile.js`는 `aria-selected`도 누락).
  - `floatingHud.js`: 서랍 내 `[data-drawer-lang]` 버튼에 `aria-pressed` 누락.
- **수정 지시:**
  - 갤러리 그룹 필터와 즐겨찾기 필터를 ARIA 구조에 맞게 분리하고, 필터/즐겨찾기 토글 시 전체 DOM 교체 대신 상태 속성만 갱신하거나 클릭된 컨트롤로 포커스를 복원한다.
  - `domainMobile.js`, `domainDashboard.js`의 전환 컨트롤을 `role="group"` + `aria-pressed`(또는 `role="tablist"` + `role="tab"` + `aria-selected` 동기화)로 정합하게 맞추고, 서랍 언어 버튼에 `aria-pressed`를 추가한다.

### R-07. 사양서 대비 UI 누락 및 반응형·SVG 레이아웃 결함 수정

- **대상 파일:** `src/showcase/domainDashboard.js`, `src/styles/showcase-base.css` (L33-L41, L522-L532), `src/styles/showcase-domains.css` (L1030-L1035), `src/showcase/domainArtwork.js`, `spec.md` (L3-L4, L55), `designs.md` (L3, L45, L54)
- **수정 지시:**
  1. **대시보드 도넛 차트 정합:** `spec.md:55` 및 `designs.md:54`에 명시된 SVG 도넛 차트를 `domainDashboard.js`에 구현(미사용 `DASHBOARD_SERIES[*].multiplier` 정리 또는 KPI 연동)하거나, 2종 차트 유지 결정 시 사양서 문구를 동기화한다.
  2. **모바일 `360px` 하단 HUD 가림 해소:** `360px` 폭에서 `.studio-hud` 높이가 `134px`(하단 여백 포함 `144px`)이나 `.showcase-stage` `padding-bottom`이 `104px`이라 최하단 약 `40px`이 가려진다. 모바일 미디어 쿼리에서 `.showcase-stage { padding-bottom: 168px; }` 이상 확보한다.
  3. **게임 캔버스 SVG 좌우 필러박스 해소:** `1440px`에서 `.game-target-canvas .art-svg`(`724×410`) 안에 `420×280`(3:2) 아트워크가 축소 배치되어 좌우 ~55px 빈 띠가 생긴다(`04`, `05`, `06` 스크린샷 확인). `preserveAspectRatio="xMidYMid slice"` 또는 컨테이너 비율/높이 정합으로 풀블리드를 보장한다.
  4. **문서 정합 및 공백 정리:** `designs.md:45`의 존재하지 않는 `specimenArt.js` 참조를 `src/showcase/domainArtwork.js`로 수정하고, `spec.md:3-4`·`designs.md:3`의 trailing whitespace(`git diff --check` 경고)를 제거한다.

### R-08. 레포지토리 위생·임시 Chrome 프로필 잔존·v2.4.0 구문서 정리

- **대상 파일:** `scripts/verifyVisualChrome.js` (L18-L20, L48-L52, L87-L91, L235-L241), `.gitignore`, `.antigravity/v3-visual-evidence/chrome-5XFPxd/`, `audit_roadmap.md`, `BUILD_GUIDE.md`, `implementation_summary.md`, `CAPABILITY_MAP.md`, `SPEC-*.md`
- **현상:**
  - `verifyVisualChrome.js`가 임시 Chrome 프로필을 프로젝트 내부 `.antigravity/v3-visual-evidence/`에 생성해 `chrome-5XFPxd/`가 미삭제 상태로 남아 있으며 `.gitignore`에도 누락되어 있다.
  - 루트의 v2.4.0 문서들(`audit_roadmap.md`, `BUILD_GUIDE.md`, `implementation_summary.md`, `CAPABILITY_MAP.md`, 8개 `SPEC-*.md`)이 여전히 120종·Web Audio·5개 언어·삭제된 npm 명령을 현행 문서처럼 기술하고 있다.
- **수정 지시:**
  - `verifyVisualChrome.js`의 `chromeProfile` 경로를 `os.tmpdir()`로 변경하고, 남아 있는 `.antigravity/v3-visual-evidence/chrome-5XFPxd/`를 삭제하며, `.gitignore`에 `.antigravity/v3-visual-evidence/`(또는 임시 프로필 제외 규칙)를 반영한다.
  - v2.4.0 구문서들을 v3.0.0 기준으로 갱신하거나 명확히 폐기/아카이브 정리한다.

---

## 4. 권장 개선 항목 — Optional (QA 보강 · 성능 · 데드 코드)

### O-01. `verifyVisualChrome.js` 및 단위 테스트 커버리지 보강

- `verifyVisualChrome.js`가 개발 서버(`vite`) 대신 프로덕션 빌드(`vite preview`)를 대상으로 실행하도록 전환한다.
- `Runtime.consoleAPICalled(type === 'error')`, `Network.loadingFailed`, HTTP `>= 400` 응답 감시를 추가한다.
- 모바일 검사를 `360px` 폭으로 확장하고, 서랍 토스트 가시성·언어 전환 스크롤 유지·모달 단축키 차단을 자동 검증에 포함한다.
- `bookmarks.js`, `clipboard.js`, `escape.js`, `showcaseInteractions.js` 단위 테스트를 추가한다.

### O-02. 데드 코드 및 미세 인터랙션 정리

- 미사용 export 정리: `GOOGLE_FONTS_URL`, `DEFAULT_STYLE_ID`(`src/data/styles20.js`), `escapeAttr`(`src/utils/escape.js`), `DASHBOARD_SERIES[*].multiplier`(`src/showcase/domainDashboard.js`).
- `domainMobile.js` 제어 시트 토글 3개 행의 중복 부제(`mobile.detailSub`) 차별화, `domainGame.js`의 정적 `data-game-hp-*` 정리, `domainArtwork.js`의 알 수 없는 ID silent `memphis` 폴백 방지.

### O-03. 초기 로드 성능 최적화 (후속 고려)

- `showcase.html`의 Google Fonts 15패밀리 일괄 로드 완화 및 공용 번들(`domainArtwork-*.js`, `201.64 kB` / gzip `71.00 kB`)에서 갤러리 미사용 DNA/도메인 카피 분리 검토.

---

## 5. 수정 완료 검증 체크리스트

- [ ] `npm run check` 통과 (명암비, `cssVars` 키셋 일관성, 영문 프롬프트 한글 미혼입 테스트 포함)
- [ ] `npm run qa:visual` 통과 (프로덕션 `dist/` 프리뷰 기준, `360px` 포함, 콘솔 에러·예외·HTTP `>=400` 0건)
- [ ] 스펙 서랍 열림 상태에서 복사 토스트 노출, KO/EN 전환 시 스크롤·포커스 유지, 모달 중 스테이지 단축키 차단 확인
- [ ] `y2k-chrome` 대시보드 SVG 차트 포인트 `fill` 정상 렌더링 및 게임 캔버스 좌우 필러박스 해소 확인
- [ ] `git diff --check` 경고 0건, 임시 Chrome 프로필(`.antigravity/v3-visual-evidence/chrome-*`) 잔존 0건, `.github/workflows/deploy-pages.yml` 스크립트 정합 확인
