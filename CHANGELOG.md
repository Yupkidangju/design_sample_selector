# Changelog (`CHANGELOG.md`)

All notable changes to the `design_sample_selector` project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),

## [Unreleased]

### Changed
- 메인·필터·갤러리·선택 도크·상세·비교 제어면을 밝은 소프트 뉴모피즘으로 재구성.
- 120종 시안을 재점검하고 Expansion 84종의 21개 시각 문법별 구성·재질·타이포그래피와 도형 thumbnail을 보강.
- 카드명과 메뉴 재배치, 선택 상태 ARIA·체크 표시, 즐겨찾기·필터·보기 변경 후 키보드 포커스 유지, 도크·모달 내 오디오 조작 개선.
- 시안의 공통 cyan glow와 강제 모서리 덮어쓰기를 제거하고 실제 컨테이너 폭을 기준으로 시안과 표·채팅·폼을 재배치.
- Core/Wave 1 상세 CSS를 지연 로드해 기존 초기 bundle 예산을 유지.

### Added
- 5개 locale·120종·4개 컨테이너의 26,400상태, 75개 Gallery 상태와 조작·튜너를 검사하는 `qa:visual:chrome`.

## [2.4.0] - 2026-09-03

### Changed
- **Pages 배포 브랜치 전환:** GitHub Pages 자동 배포 트리거를 `main`에서 기본 브랜치 `gemini_ux_enhanced`로 전환해 개선판 push가 검증 후 바로 배포되도록 변경.
- **UI 용어 및 사조별 프리뷰·탐색 UX 리팩터링 (v2.4.0):**
  - 5개 언어 핵심 UI 98개 문자열의 용어 정제 (Bento Grid, Timeline Spectrum, Design Tokens, Component CSS 등).
  - 4개 주요 카테고리(Swiss, Y2K, Brutalism, Hypertech)의 Game, Media, Chat 아키타입 시각 요소 및 메인 갤러리 장르 뱃지 보강.
  - 갤러리 카드 내 명시적인 `상세 보기` CTA 버튼(44px) 도입 및 Space/Enter 키보드 분리, 카드 클릭(선택 도크 담기)과 상세 보기 분리.
  - Release manifest 변조 검증 및 Pages artifact 검증 정합성 확보.

### Added
- **Stage 2 교차 언어·reflow 최종 자동 감사:** 5 locale × 120종의 9,620개 사람용 field unit, machine ID·palette 값, 간체/번체 독립 지역어를 machine-readable report로 대조하고 320/375/768/1024/1440px와 200% 확대 30상태의 Gallery·Detail overflow·컨트롤 잘림·접근성 이름을 격리 Chrome에서 검증한다.
- **5개 locale 전면 콘텐츠 pack:** `ko/en/ja/zh-CN/zh-TW`가 각각 actual 120의 디자인명·요약·palette·특징·장단점 1,924 field unit을 명시적으로 소유하고, 5×120 카드 Chrome 순회와 2,400 Web/4,800 archetype Node 행렬로 fallback·누락을 차단한다.
- **Audit 11 Re-audit #1 i18n acceptance:** 296-key 5-locale copy parity, catalog field provenance/placeholder gate와 5-locale Detail 네 Inspector pane·machine-key·focus/scroll·runtime live status 보존을 검증하는 격리 Chrome gate를 추가.
- **Audit 11 semantic tuner·5-locale runtime:** surface/control/pill geometry, 단일 `TUNER_LIMITS`, `ko/en/ja/zh-CN/zh-TW` lazy locale pack, native endonym 메뉴, URL→storage→browser→한국어 선택 순서와 immutable locale snapshot/epoch를 추가.
- **Audit 11 회귀·시각 게이트:** 999 bounds, locale completeness·machine-key invariance·악성 문자열·prototype URL·선택 locale 정렬 테스트와 5 locale × 320/768/1280/1920 및 200% 대응 캡처를 추가.
- **Audit 10 Pages artifact 계약:** `/design_sample_selector/` Vite base, recursive lazy closure/release manifest, GitHub Actions `dist` directory deploy와 Pages-like Chrome gate를 추가해 source-root publish를 배포 전에 차단.
- **Bounded recovery와 안전 진단:** Preview/Detail import를 primary + retry 한 번으로 제한하고 terminal reload/cancel 상태, phase/attempt/resource class in-memory diagnostic과 mount rollback 계약을 추가.
- **Audit 9 stateful 재감사 게이트:** 스타일 A→B 전환, Peek/확정 테마, direct/cart checkout, Blog 읽기 모드·375/768/1024px 진행률, lazy focus, Game 키보드, Dashboard 상태 이관과 실패 경계를 Node 집중 회귀 및 actual-120 Chrome 시나리오에 추가. 1,920 device 상태·Web 480탭·diagnostics 0과 CDP 왕복을 제외한 browser-local interaction 직렬 3회를 통과했다.
- **Actual 120 디자인 카탈로그:** 기존 Core 36의 ID·순서·저장·출력 지문을 보존하면서 7개 expansion pack × 12종, 21개 시각 문법의 신규 ready 84종을 추가해 8개 카테고리를 각각 15종으로 확장.
- **신규 84종 독립 프리뷰:** 스타일별 고유 renderer·inline thumbnail·motion 참조와 Web 4탭, Desktop/Mobile 단일열 전환, reduced-motion을 제공하고 공개 inventory를 renderer/thumbnail/motion/asset `120/120/120/0`으로 확장.
- **Actual 120 Crostini Chrome 게이트:** `qa:catalog120:chrome`으로 세 보기 4페이지의 120 ID, 신규 thumbnail 84개, 120×8×Desktop/Mobile 1,920상태, Web 480탭, Detail·Split·Peek·Dock·지연 CSS·성능·진단을 격리 Chrome 151에서 검증하고 보고서·대표 화면을 보존.
- **Expansion 출처·저작 계약:** 신규 84종의 명시적 blueprint, 21개 문법별 기관·공식 출처, 접근성 메모와 공통 factory를 `src/catalog/packs/expansion/`에 추가하고 신규 ready 품질 오류·경고 0을 고정.
- **120종 렌더 용량 계약:** 불변 gallery window와 bounded picker를 추가해 시각 DOM을 Gallery 36개, Detail 24개, Split 12개/slot로 제한하면서 페이지·검색·전체 native select로 모든 정규 ID에 도달하도록 구성.
- **On-demand preview chunk와 복구 경계:** Detail/Split·Peek·확정 component renderer를 최초 사용 때 불러오고 loading/error/cancel/retry, stale request 차단과 브라우저 module-map 실패를 피하는 별도 retry facade를 추가. 기존 동기 preview API는 호환 유지.
- **초기 bundle 및 Crostini scalability 게이트:** `analyze:bundle`, `qa:scalability:chrome` 명령을 추가해 초기 정적 JS/CSS gzip과 actual 120 + QA 전용 synthetic 60/120의 페이지 도달성, DOM·interaction·motion·observer·반응형·접근성·diagnostics를 검증하고 프로젝트 내부에 보고서·화면을 보존.
- **정규 카탈로그 탐색 계층:** 한국어·영어·alias·category·facet metadata 검색, category+bookmark, 10개 facet의 AND/OR 규칙, 네 정렬과 시대 그룹을 `src/catalog/discovery.js`의 순수·불변 질의 계약으로 추가.
- **접근 가능한 탐색 제어와 URL 복원:** 결과 live status, native radio/checkbox facet disclosure, 활성 조건 chip, 전체/빈 상태 초기화와 `q/category/f/sort/view/saved` canonical URL의 initial load·reload·`popstate` 복원을 추가.
- **Catalog Discovery Crostini Chrome QA:** `qa:discovery:chrome` 명령으로 격리 Chrome 151에서 사용자 시나리오 9개, 320/375/414/768/1024/1440px, 세 보기, 검색을 포함한 89개 입력 이름·44px target, 키보드·reduced-motion·diagnostics를 검증하고 보고서와 대표 화면을 보존.
- **Core 36 Catalog Expansion — Wave 1:** 기존 24종을 보존하면서 `bauhaus-geometry`, `de-stijl`, `flat-design`, `constructivist`, `punk-zine`, `material-design`, `liquid-glass`, `art-deco`, `psychedelic-poster`, `art-nouveau`, `risograph`, `metro-interface` 12종을 출처·접근성 메모가 완비된 `ready` 레코드로 추가.
- **Wave 1 독립 시각 구현:** 신규 12종에 네 Web 탭 renderer, 독립 thumbnail, 실제 구현 channel을 가진 motion descriptor와 root-scoped 반응형·reduced-motion CSS를 추가. 외부 이미지·폰트·오디오 asset은 사용하지 않음.
- **Crostini Chrome QA 하네스:** `scripts/verifyWave1Chrome.js`와 `qa:wave1:chrome` 명령을 추가해 격리 Google Chrome profile에서 세 갤러리 모드, 320/375/414/768/1024/1440px, Core 36 × 8 × Desktop/Mobile 576상태, 신규 12종 집중 Detail, Split, reduced-motion과 application diagnostics를 검증하고 프로젝트 내부에 보고서·대표 스크린샷을 보존.
- **확장형 스타일 카탈로그 계약:** `src/catalog/`에 스키마 버전 1의 동결된 조회 API, 8개 카테고리, 10개 facet, core 팩 manifest와 기존 24종 `StyleRecord`를 추가. 각 레코드는 분류, 13개 의미 토큰, 3개 프리뷰 참조, 편집 정보와 출처 구조를 포함.
- **카탈로그 계약 회귀 게이트:** 24개 정규 ID와 21개 alias, 레거시 필드·팔레트·트윅·모션·토큰 parity, 저장된 alias 복원, 결정론적 정렬, 출판 상태, 경계 입력과 재귀 불변성을 `tests/styleContract.test.js`에서 검증.
- **구조화 카탈로그 검증 계층:** `src/catalog/validation/`에 결정론적 동결 보고서, 구조·ID·alias·팩·facet·프리뷰·에셋·토큰·팔레트·출처·접근성·대비 규칙과 현재 카탈로그 어댑터를 추가. `ready` 품질 공백은 오류, 기존 `legacy` 부채는 명시적 경고로 처리.
- **CLI 및 prebuild 게이트:** `validate:catalog`의 compact/verbose/JSON/strict 출력과 종료 코드 0/1/2를 제공하고 모든 표준 Vite 빌드 전에 카탈로그 오류를 차단. 현재 기준선은 오류 0개·경고 56개이며 strict 모드는 의도적으로 실패.
- **검증 회귀 매트릭스:** 손상 fixture, severity 전환, 4.5:1 대비, 불명 참조, 안전 경로, 보고서 불변성, CLI 수명주기를 포함한 `tests/catalogValidation.test.js` 추가.
- **정규 테마 생성 계층:** `src/theme/`에 13개 의미 토큰↔CSS property 계약, 모든 출판 상태를 포함하는 재귀 동결 `ThemeDefinition` 투영, 호환 `THEME_TOKENS_MAP`과 결정론적 스타일시트 직렬화를 추가.
- **테마 CSS 생성/검사 CLI:** `generate:themes`는 정규 `StyleRecord.tokens`와 선택적 `themeEffects`에서 추적 CSS를 갱신하고, `check:themes`는 파일을 쓰지 않은 채 stale·누락을 종료 코드 1로 차단. `prebuild`는 catalog 검증 뒤 theme 최신성을 검사.
- **테마 호환 회귀 매트릭스:** 24종 map, 24 canonical/21 alias/3 effect 런타임 CSS, Live CSS 576개, Markdown 384개, DTCG 24개의 승인 해시와 CLI 수명주기를 `tests/themeGeneration.test.js`에서 검증.
- **불변 preview registry:** 24개 Web renderer, 24개 `thumbnailId` recipe와 24개 motion descriptor를 `src/preview/`의 정적 definition으로 등록하고 조회·렌더·오류 API, 정렬·재귀 동결 inventory와 120-output 호환 해시 회귀를 추가.
- **모션 hydration 회귀 게이트:** component root class, effect layer, reduced-motion, observer cleanup, unknown motion과 잘못된 renderer HTML 출력의 구조화 실패를 Node fixture에서 검증.

### Changed
- **Preview·Inspector locale snapshot 단일화:** Core·Wave 1·Expansion의 가시 문자열·ARIA와 runtime toast를 선택 snapshot으로 투영하고, `data-*`·ID·CSS/DTCG key·표시 식별자·기술 측정값은 locale-invariant로 유지한다. 로컬라이저는 Detail 동적 entry에 두어 초기 bundle 예산을 보존한다.

- **Locale-neutral catalog와 Inspector 경계:** 검색·이름 정렬·legacy projection·Detail·Inspector가 활성 locale overlay를 소비하고 palette display name 대신 stable ID로 CSS/DTCG 구조 키를 생성하도록 변경. locale 전환은 선택·tweak·mock runtime·Inspector tab·scroll·focus를 보존.
- **Semantic radius projection:** theme geometry를 surface/control/pill로 분리하고 live radius는 명시적인 `[data-tweak-surface]`에만 적용. catalog validator·AppState·slider·artifact generator가 같은 범위를 사용.
- **Audit 10 상호작용·신뢰·상태 경계:** Peek에 native 상세 button과 실제 double click을 연결하고 Detail mount disposer/초기 subscriber rollback, executable renderer sink 거부, localStorage key 16,384자·bookmark 120·recents 6개 상한을 적용.
- **Project-site QA 경로:** 기존 네 Chrome 게이트와 초기 bundle analyzer를 `/design_sample_selector/` production base에 맞추고 Pages 정상 경로 및 outer/shared/3 CSS/Detail/render/hydrate fault matrix를 CI deploy 전 필수 게이트로 연결.
- **FIN-F006 측정 계약 및 재검증:** interaction hard gate는 실제 상태 변화가 있는 operation만 페이지 안에서 input dispatch→요구 state/DOM 정착의 제품 처리시간을 측정하고, no-op·CDP 왕복·외부 polling·artifact I/O와 정착 후 scheduler 대기를 제외한다. 정착 뒤 2 animation frames와 Long Task는 별도 presentation 진단치로 보존한다. 최종 격리 Chrome 직렬 3회가 각각 `20.95/51.6ms`, `20.4/121.1ms`, `21.45/131.9ms`(median/max)로 통과했다.
- **상태 보존형 renderer 전환 계약:** 같은 아키타입의 스타일 전환을 literal inner-DOM 보존에서 바깥 viewport identity 보존 + 새 스타일 renderer 재생성 + 승인된 runtime snapshot 이관으로 변경. 이전 스타일의 HTML·카피·class·motion은 이관하지 않고 cart/game/chat/filter 등 사용자 상태만 복원하도록 `spec.md`·`designs.md`·Decision 019를 먼저 동기화.
- **Audit 9 수명주기·오류 계약:** Peek/확정은 선택 테마를 쓰는 non-modal region, checkout은 focus-trapped modal, malformed app state는 거부, bootstrap은 visible retry boundary, Clipboard·Audio는 실제 성공 여부를 반환하도록 경계를 명시.
- **Expansion CSS 지연 전달:** 기존 36종의 `themeTokens.css`는 initial에 유지하고 신규 84종의 생성 테마와 21개 문법 상세 CSS를 `themeTokensExpansion.css`·`expansion-preview.css`로 분리해 component entry에서만 불러오도록 변경. 확장 완료 시점 초기 JS/CSS는 `83.46/32.86kB` gzip으로 예산을 유지.
- **현재 총량과 페이지 상한 분리:** Header·필터·탐색 상태·Split native select는 actual 120을 표시하고 Grid/Bento/Spectrum은 페이지당 최대 36개만 렌더하도록 기존 Chrome QA 기대값을 총량 120/DOM 상한 36으로 전환.
- **대량 목록의 bounded UI:** Core 36의 외형을 유지하되 결과가 36개를 넘으면 접근 가능한 pager를 제공하고, Detail은 활성 category만, Split은 전체 native option + 제한 visual picker를 사용하도록 변경.
- **프리뷰 종류별 진입점과 observer 수명:** thumbnail/motion/component entry를 분리하고 thumbnail observer를 render cleanup에 결합해 페이지 교체 뒤 detached target과 reduced-motion 실행 animation을 0으로 유지.
- **세 갤러리 공통 결과와 시대 Spectrum:** Grid·Bento·Spectrum이 같은 canonical 검색 결과를 소비하도록 통합하고, Grid는 category grouping, Bento는 전역 정렬, Spectrum은 고정 문구 대신 실제 `classification.era.start` grouping과 category 맥락을 사용하도록 변경.
- **탐색 제어 밀도와 수명주기 분리:** 10개 facet을 기본 접힘 compact row로 제공하고 열린 facet만 전체 폭을 사용하도록 구성했으며, header 검색 caret 갱신과 별도 root에서 열림·초점 상태를 유지하도록 분리.
- **Core 36 파생 경계:** manifest, catalog, generated theme CSS와 preview registry를 36종으로 확장하고 UI의 스타일 개수 문구를 실제 카탈로그 값에서 파생하도록 변경. 기존 24종의 120-output·theme/export fixture는 subset 계약으로 유지하고 전체 36종의 180-output fixture를 별도로 추가.
- **확장형 Wave 모듈 조립:** 기존 24종 파일을 재작성하지 않고 `styles-wave-1.js`, `renderers-wave-1.js`, `thumbnails-wave-1.js`, `motions-wave-1.js`, `wave1-styles.css`를 추가형 경계로 조립하도록 변경.
- **카테고리 데이터 경계 개편:** `src/data/categories.js`를 정규 카탈로그의 얇은 호환 진입점으로 전환해 기존 `MAIN_CATEGORIES` 등 named export와 로컬 저장 ID를 유지하면서 향후 120종 팩 확장이 가능한 구조로 분리.
- **테마 토큰 단일 원천화:** `designSpecGenerator.js`의 수동 24종 토큰 map을 제거하고 정규 카탈로그 투영을 소비하도록 전환. `themeTokens.css`는 생성·추적 파일이 되었고 기존 export 이름과 984개 정상 출력 조합은 유지.
- **명시적 미선택 경계:** CSS/Markdown/DTCG 생성기가 알 수 없는 스타일 ID를 Swiss로 조용히 대체하지 않고 기존 미선택 결과를 반환하도록 통일.
- **카탈로그 프리뷰 참조 단일 원천화:** `currentCatalog.js`가 preview registry-derived `ReferenceInventory`를 직접 사용하도록 전환하고 renderer·thumbnail·motion ID를 중복하던 임시 수동 목록을 제거. 오류 0·legacy 경고 56 기준선은 유지.
- **프리뷰 소비 경계 통합과 24종 호환 보존:** Gallery·Detail·Peek·Dock·Web 아키타입이 `src/preview/index.js`의 명시적 옵션 API를 직접 사용하도록 전환하고 `getMockupHTML()`은 얇은 호환·parity 진입점으로 제한. 기존 120개 HTML 승인 hash, Web 96개 탭, 24종 × 8 아키타입 192개 Node 출력과 실제 Desktop/Mobile 384개 상태를 유지.
- **프리뷰 오류 의미 명시화:** 기능 조회는 미등록 값에 `false`/`null`, 실제 render·motion hydration은 진단 가능한 `PreviewRegistryError`로 실패하도록 통일해 Swiss·일반 썸네일·`none` 무음 대체를 제거.

### Fixed
- **Detail 튜너 접근성 이름·locale 순도:** 다섯 range slider의 시각 라벨을 실제 `<label for>`로 연결하고 고정 영문 병기를 제거해 선택 locale의 이름만 접근성 트리에 제공한다.
- **320px Game Detail CTA 잘림:** 좁은 Detail 샌드박스에서 네 스킬과 locale별 CTA가 한 줄 너비를 초과하던 액션 바를 필요 시 줄바꿈하도록 수정해 5개 locale 모두 화면 밖 컨트롤 0을 확인했다.
- **중국어 번체 본문 편집 감수 120/120:** 8개 카테고리의 summary·palette 표시명/용도·특징·장점·주의점을 대만권 UI·디자인 용어와 전각 구두점으로 교정하고, `實用介面設計方案`·`譜系引導版面構成`·`配合目標使用者驗證`·`配色1〜4` 등 생성형 상투문과 본토 UI 용어를 제거했다. `混凝土界面`은 `混凝土介面`으로 바로잡고 machine ID·색상값·CSS/HTML/DTCG key는 보존했다.
- **중국어 간체 본문 편집 감수 120/120:** 8개 카테고리의 summary·palette 표시명/용도·특징·장점·주의점을 중국 본토의 간결한 용어와 전각 구두점으로 교정하고, `实用界面设计方案`·`谱系指导版式构成`·`结合目标用户验证`·`配色1〜4` 등 생성형 상투문과 번체 UI 용어를 제거했다. machine ID·색상값·CSS/HTML/DTCG key는 보존했다.
- **일본어 본문 편집 감수 120/120:** 8개 카테고리의 summary·palette 표시명/용도·특징·장점·주의점을 자연스러운 `です／ます`체와 전각 구두점으로 교정하고, `実用的なUIへ展開するデザインサンプル`·`原理を再解釈`·`対象ユーザーに合わせて検証`·`配色1〜4` 등 생성형 상투문을 제거했다. machine ID·색상값·CSS/HTML/DTCG key는 보존했다.
- **영어 본문 편집 감수 120/120:** 8개 카테고리의 summary·palette 용도·특징·장점·주의점을 style별 시각 문법·적합 용도·실제 위험으로 교체하고 `applies … principles`·`defines a distinct … role`·`Works well for …` 등 생성형 boilerplate와 개별 문장 중복을 제거했다. machine ID·색상값·CSS/HTML/DTCG key는 보존했다.
- **한국어 본문 편집 감수 Wave 8:** `soft3d` 카테고리 15종의 요약·palette 이름/용도·특징·장점·주의점을 점토·종이·공기·블록·직물·유기형 재질과 놀이형 화면 문법별로 분리하고, 공통 번역 템플릿과 `Inset Shadow`·`드롭 섀도`·`호버`·`Transform rotate`·`CTA`·`모티프`·`마이크로카피` 등의 불필요한 혼합 표현을 제거해 한국어 120/120 감수를 완료했다.
- **한국어 본문 편집 감수 Wave 7:** `hypertech` 카테고리 15종의 요약·palette 이름/용도·특징·장점·주의점을 동적 활자·미래 장치·운영 자료·공간 도구별로 분리하고, 공통 번역 템플릿과 `Marquee`·`트랜스폼`·`서페이스`·`3D`·`모노스페이스`·`KPI`·`모티프` 등의 불필요한 혼합 표현을 제거했다.
- **한국어 본문 편집 감수 Wave 6:** `y2k` 카테고리 15종의 요약·palette 이름/용도·특징·장점·주의점을 2000년대 초·중반의 화면·매체 문법별로 분리하고, 공통 번역 템플릿과 `메탈릭`·`쉬머`·`HUD`·`CRT 브라운관 TV`·`게이미피케이션`·`CTA`·`VIP`·`글로시` 등의 불필요한 혼합 표현을 제거했다.
- **한국어 본문 편집 감수 Wave 5:** `editorial` 카테고리 15종의 요약·palette 이름/용도·특징·장점·주의점을 매체·재료·정보 위계별로 분리하고, 공통 번역 템플릿과 `Surface`·CSS 문법·`OLED`·`SaaS`·`blob`·`CTA` 등의 불필요한 혼합 표현을 제거했다.
- **한국어 본문 편집 감수 Wave 4:** `retro` 카테고리 15종의 요약·palette 이름/용도·특징·장점·주의점을 시대와 매체별 시각 문법으로 분리하고, 공통 번역 템플릿과 `노스탤지어`·`퍼스펙티브`·`로파이`·`CTA`·`OS` 등의 불필요한 혼합 표현을 제거했다.
- **한국어 본문 편집 감수 Wave 3:** `depth` 카테고리 15종의 요약·palette 이름/용도·특징·장점·주의점을 재질과 공간 표현별로 분리하고, 확장 시안에 반복되던 공통 문장과 `Surface`·`Inset`·`A11y`·`elevation`·`CTA` 등의 번역투를 제거했다.
- **한국어 본문 편집 감수 Wave 2:** `brutalism` 카테고리 15종의 요약·palette 이름/용도·특징·장점·주의점을 실제 시각 문법에 맞게 분리하고, 반복 번역 템플릿과 불필요한 영문 표현을 제거했다.
- **Crostini 오디오 재감사 안정성:** actual-120의 최초 volume probe가 Web Audio gain 정착을 한 프레임으로 가정하던 변동성을 bounded wait로 교체해 실제 `0` gain을 확인한 뒤 판정하도록 보강했다.
- **한국어 본문 편집 감수 Wave 1:** `swiss` 카테고리 15종의 요약·특징·장점·주의점에서 불필요한 영문 병기와 명사형 번역투를 제거하고, 서로 다른 디자인에 반복되던 공통 문장을 style별 시각 문법과 실제 사용상 장단점으로 교체했다.
- **5개 locale 디자인명 전수 감수:** 120종 제목을 `ko/en/ja/zh-CN/zh-TW` 순서로 검토해 93개 ID의 직역·혼합 영어·지역 표기·대소문자 문제를 교정하고, card·Detail·Inspector 반복 문맥을 같은 승인명으로 동기화했다. machine ID와 CSS/HTML/DTCG 구조 키는 보존했다.
- **다국어 actual-120 감사 조건:** Chrome 게이트가 한국어 `AI 네이티브`·`100% 읽음`과 영어 project label에 의존하던 조건을 DTCG ID·행 식별자·상태 변화 기준으로 바꿔 모든 시작 locale에서 같은 기능을 검증한다.
- **언어 선택기와 확장 시안 locale 정합성:** 존재하지 않는 색 변수로 흰 배경·흰 글자가 되던 언어 선택기를 명시적 dark native control로 복구하고 5개 locale의 크기·좌표를 고정했다. 신규 84종 Web 시안의 제목·설명·motif가 한국어 blueprint를 직접 출력하던 경로를 활성 locale snapshot으로 전환하고 영어 분류어 누락도 보완했다.
- **Audit 11 visible/ARIA·Inspector i18n:** Header·Discovery·Gallery·Detail·Split·recovery와 8개 archetype HTML을 같은 locale snapshot에 연결하고 CSS comment·Markdown prose·DTCG display metadata가 locale별로 바뀌도록 수정. 국제 고유 디자인명 fallback은 field/reason과 함께 보고하고 placeholder는 completeness에서 거부한다.
- **Locale 전환 focus와 번역 가능 Dashboard gate:** Detail locale 재렌더 뒤 focus trap이 복원된 Inspector control을 첫 버튼으로 덮던 문제를 수정하고, actual-120 Dashboard filter가 고정 영문 표시값 대신 현재 locale의 성공 label을 사용하도록 변경.
- **Audit 11 999px·URL·출력 경계:** 8개 expansion 시안의 pill 값이 tuner default와 전체 화면 geometry로 번지던 문제, prototype/oversize discovery URL crash, 번역 palette key 충돌, code pane raw HTML 및 CSS/Markdown/JSON 경계 불일치를 수정.
- **Crostini Chrome 감사 안정성:** Discovery 게이트가 `data-app-pending` 해제 전에 숨겨진 pagination을 클릭하던 문제를 실제 결과 변화/포커스 검증으로 분리하고, 오디오 장치가 없는 headless 실행에서는 명시적 opt-in으로 오디오 probe와 SFX만 제외해 비오디오 1,920 상태를 계속 검증하도록 보완.
- **Pages Preview/Detail 장애와 Peek affordance:** source CSS module graph가 live에서 실패하던 배포 경계를 production artifact로 전환하고, Peek native `상세 보기`/double click, 실패한 Detail listener·handler cleanup, corrupt/oversize storage 복구와 executable renderer output 차단을 구현.
- **독립 재감사 공통 Detail/Audio/Zoom 회귀:** 120종 Detail 공통 사이드바의 누락 selector를 lazy CSS로 복구하고 flex 카드 축소로 제목·설명이 가려지지 않게 했으며, AudioContext 생성 전 volume을 최초 master gain에 반영하고 스타일·아키타입 renderer 재생성 뒤 선택 Zoom을 다시 적용한다.
- **스타일·테마 정합성과 상호작용 복구:** 스타일 전환 뒤 남던 이전 renderer/텍스트와 Dashboard 행 markup을 제거하고 Inspector·motion을 선택 ID와 동기화. Peek/확정 `data-theme`, Game Enter/Space, form focus 중 Detail Escape, lazy loading/error focus trap·복원을 수정.
- **Checkout·Blog 계약 구현:** 빈 장바구니 checkout을 비활성화하면서 direct/cart 주문을 구분하는 summary·confirm·cancel·Escape·focus-return dialog를 추가하고, Blog light reading mode의 실제 색상/ARIA와 반응형 scroll owner 기반 0–100 진행률을 연결.
- **실패 진실성과 bounded lifecycle:** 잘못된 공개 state patch, Clipboard false/throw, AudioContext resume/SFX synthesis 실패를 성공으로 보고하지 않도록 수정. 댓글·채팅 500자/동적 history 50개 상한, checkout·chat timer ownership, audio visualizer rAF와 `popstate` cleanup을 추가.
- **브라우저 메타데이터 정합성:** title/description의 36종 표기를 actual 120종으로 수정.
- **초기 웹 폰트 layout shift:** UI를 정상 flow의 `visibility:hidden` 상태에서 구성하고 `document.fonts.ready` 뒤 노출해 Chrome CLS를 `0`으로 수정. 폰트 실패 시 시스템 폴백으로 계속 표시.
- **Dynamic import 실제 재시도:** 같은 URL의 실패를 기억하는 브라우저 module map 때문에 Promise cache 초기화만으로 재시도되지 않던 경로를 primary/retry facade 전환으로 수정하고 강제 네트워크 실패 Chrome 회귀를 추가.
- **Detail Desktop/Mobile 현재·레거시 root 폭:** Mobile 제약을 `.archetype-unit`과 `.mockup-unit` 모두에 명시해 외부 브라우저 폭과 무관하게 실제 preview unit이 phone width로 전환되도록 보강.
- **Category와 북마크 조건 결합:** 북마크 보기를 category처럼 상호 배타적으로 취급하던 경계를 분리해 검색·category·bookmark·facet 조건을 동시에 적용할 수 있도록 수정.
- **탐색 빈 상태 포커스와 disclosure 표식:** 전체 초기화 뒤 검색 입력으로 포커스를 복원하고, flex summary에서 사라지던 native marker를 명시적 펼침/접힘 표식으로 보완.
- **DTCG `box-shadow: none` 구조화:** shadow 문자열 `none`을 잘못된 DTCG 값으로 내보내던 경로를 투명한 zero shadow 객체로 정규화하고 36종 JSON 생성 회귀를 추가.
- **중첩 버튼으로 인한 Detail/Split DOM 손상:** Flat Design thumbnail의 장식 CTA를 `button`에서 `span`으로 바꾸고, 상위 버튼에 삽입되는 전체 36종 thumbnail이 interactive tag를 포함하지 않도록 회귀 계약을 추가.
- **Wave 1 Desktop/Mobile 실제 전환 검증:** 신규 12종에서 활성 device 버튼, preview root 폭과 grid 구조가 함께 바뀌며 문서 overflow가 생기지 않음을 Chrome 151로 검증.
- **상세 프리뷰 Desktop/Mobile 전환 복구:** Mobile 폭 제한을 현재 8대 아키타입 렌더 루트에도 적용하고 Web·쇼핑몰·대시보드·채팅을 모드 전용 반응형 레이아웃으로 보정해, 24개 디자인 모두 Desktop과 구분되는 `380px` 휴대폰 프레임으로 전환되도록 수정.
- **Web 컴포넌트 탭 선택 상태 동기화:** Widget/Form/Pricing 전환 후에도 Hero 버튼에 남던 `active`와 `aria-selected` 상태를 실제 선택 탭과 동기화하고 24종 × 4탭 실브라우저 행렬로 검증.
- **개발 서버 favicon 오류 제거:** 네트워크 요청이 없는 inline SVG favicon을 선언해 Chrome의 자동 `/favicon.ico` 404와 DevTools 오류를 제거.

## [2.3.0] - 2026-08-26

### Added
- **실시간 4대 탭 동적 인스펙터 (`[Live CSS]`, `[Live HTML]`, `[Live designs.md]`, `[Design Tokens]`):**
  - **Live CSS 인스펙터:** 상단 셀렉터, 8대 아키타입, 슬라이더 조작에 100% 매칭되는 순수 CSS 실시간 생성. 서브 토글(`전체 번들`, `테마 토큰만`, `아키타입 CSS`) 지원.
  - **Live designs.md 마크다운 사양서 뷰어:** 현재 선택된 사조 및 실시간 슬라이더 수치, 폰트 스택, 아키타입 ASCII 다이어그램, 키네틱 인터랙션 규칙, 가이드라인이 포함된 D3D 표준 Markdown을 실시간 빌드.
  - **Live Design Tokens (JSON):** DTCG Format/Color Module 2025.10 구조의 토큰 JSON 실시간 생성.
  - **원클릭 복사 & 파일 내보내기 툴바:** 개별 파일 다운로드(`.css`, `.html`, `.md`, `.json`), 통합 TXT 스냅샷 내보내기, 클립보드 복사(SFX + 토스트 알림 연동) 지원.
- **`requestAnimationFrame` 실시간 렌더링 파이프라인:** 슬라이더 연속 입력을 프레임 단위로 병합해 텍스트/코드 인스펙터 뷰를 현재 상태와 동기화.
- **순수 데이터 생성기 모듈 (`src/utils/designSpecGenerator.js`):** 24개 테마의 모든 CSS 커스텀 프로퍼티 및 아키타입 룰셋을 관리하는 순수 함수 아키텍처 구축.

### Fixed
- **Run 7 내보내기 계약 복구 (IMP-F001/002):** 8개 생성 CSS가 실제 아키타입 HTML 선택자를 사용하도록 정렬하고, 24개 테마 토큰을 구조화된 DTCG 2025.10 color/gradient/dimension/shadow/fontFamily 값과 `$extensions` 메타데이터로 직렬화.
- **인스펙터 최신 상태 단일화 (DBG-F001/002):** 탭·CSS 모드·복사·개별 다운로드·통합 스냅샷이 이벤트 시점의 `selectedSubCategory`를 해석하도록 stale closure를 제거하고, 상세 모달 진입 시 CSS/전체 번들 UI 상태를 일관되게 초기화.
- **자동 회귀 게이트 추가 (DBG-F003):** Node 내장 테스트 러너 기반 `npm test`와 테스트+빌드 통합 명령 `npm run check`를 추가해 아키타입 선택자, DTCG 24테마, 인스펙터 상태, 스플릿 ARIA 탭 계약을 검증.
- **스플릿 탭 접근성 보완 (A11Y-F001):** 8개 탭의 `aria-selected`, roving `tabindex`, `aria-controls`/`tabpanel` 연결과 Arrow/Home/End 키보드 이동을 구현.
- **릴리스·환경 문서 동기화 (IMP-F003/BUILD-F001):** 사용자 버전 표시와 권위 문서를 v2.3.0으로 맞추고 Node.js 지원 범위를 20.x 또는 22+로 명시.
- **상태 관리자 매개변수 불변성 보장 (FIN-F001):** `AppStateManager.setState` 내부에서 `partialState`의 `audio` 및 `liveTweaks` 키를 `delete` 연산자로 직접 변이하던 코드를 순수 불변 객체 병합 패턴으로 리팩토링.
- **갤러리 북마크 분리 노드 변이 제거 (FIN-F002):** `src/components/mainView.js`의 북마크 클릭 이벤트 리스너에서 상태 갱신 및 재렌더링 후 분리된(detached) 버튼 노드에 클래스/텍스트를 변경하던 잔여 코드를 정리하고 반응형 구독자로 일원화.

## [2.2.2] - 2026-08-25

### Fixed & Enhanced
- **스플릿 경유 포커스 복원 (SEC-F003):** DETAIL을 스플릿에서 다시 열 때 갤러리 opener(`lastFocusedElement`)를 스플릿 컨트롤로 덮어쓰지 않는다.
- **reduced-motion 캔버스 루프 (SEC-F006):** `prefers-reduced-motion`이면 rAF를 돌리지 않고 한 프레임만 `draw()`한다.
- **고아 코드 정리 (DBG-F007):** 미사용 export·`[data-mock-count]` 애니메이터·`comparePickerOpen`/`comparePickingSlot` 제거.
- **스토리지 별칭 canonicalize (DBG-F009):** 북마크/확정/최근 본 ID를 로드·쓰기 시 정규 카탈로그 ID로 정규화한다.
- **상태 계약 정리 (IMP-F005):** spec에 `dss_bookmarks_v2`를 기입하고 미사용 `bgmEnabled`를 제거한다.
- **검색 입력 포커스 유지 (DBG-F001):** `searchQuery`만 바뀔 때 헤더 전체를 `innerHTML`로 재조립하지 않고 입력란·지우기 버튼만 패치한다.
- **스플릿 비교 닫기 복귀 (DBG-F002):** `compareReturnView`에 연 화면(MAIN/DETAIL)을 기억하고 ✕/Esc 시 그곳으로 돌아간다.
- **목업 teardown 키 일치 (DBG-F003):** `hydrateMockup`한 뷰포트 노드에 `teardownMockup`을 호출하고 자손 활성 루트도 정리한다.
- **SFX 미사용 Oscillator 제거 (DBG-F004):** 차임 분기는 `playChimeNote`만 사용하고, SWIPE는 필터드 노이즈 스윕으로 spec §6.2와 맞춘다.
- **그래픽 엔진 계약 강등 (IMP-F003):** WebAssembly를 구현하지 않는다. 문서는 Canvas 2D, 헤더 배지는 `CANVAS 2D`다.
- **키네틱 시뮬레이터 공백 메움 (IMP-F002):** 레벨업 파티클, 블로그 목차/스크롤 진척, 대시보드 정렬·필터, 쇼핑몰 사이즈, 미디어 볼륨·스펙트럼, 채팅 채널 스위처, 스플릿 media/chat 탭, HTML 복사, `.archetype-unit` 블러 슬라이더.
- **모달 레이아웃 및 2열 독립 스크롤 최적화:** 좌측 샌드박스 뷰포트와 우측 사이드바 인스펙터가 각각 독립적으로 스크롤되도록 `min-height: 0` 및 뷰포트 스크롤러를 개선하여 모달 하단 영역이 잘리던 현상 완전 해소.
- **파라미터 튜너 실시간 강제 상속 연동:** 슬라이더 조작 시 `--theme-radius`, `--theme-border-width`, `--theme-shadow`를 원자적으로 주입하여 아키타입 내부 모든 카드/컨테이너/버튼 요소에 모서리 둥글기 및 테두리 두께가 즉시 반영되도록 수정.
- **튜너 슬라이더 범위 확장:** 모서리 둥글기(`Border Radius`: 0~64px) 및 테두리 두께(`Border Width`: 0~12px) 조절 범위 확장.
- **뷰포트 배율(Zoom/Scale) 컨트롤 추가:** 80%, 100%, 120% 배율 전환 기능 추가.
- **스타일 기본값 리셋 사운드 및 피드백 강화:** `↺ 기본값 리셋` 버튼 클릭 시 `SUCCESS` 사운드 및 즉각 파라미터 복원 제공.

## [2.2.1] - 2026-08-25

### Fixed
- **서브스타일 ID 매핑 동기화 및 듀얼 셀렉터 지원 (FIN-F009):** `src/styles/themeTokens.css`의 24개 테마 셀렉터에 `categories.js` 데이터셋의 24개 실존 ID와 서술형 사양 ID를 듀얼 셀렉터(`[data-theme="..."], [data-theme="..."]`)로 100% 매핑하여 모든 24종 서브스타일에 전용 CSS 커스텀 프로퍼티가 정상 주입되도록 수정.
- **상태 관리자 스토리지 복원 화이트리스트 확장:** `src/state/appState.js` 내 `VALID_SUB_IDS`에 24개 데이터셋 ID 및 별칭을 모두 등록하여 LocalStorage 북마크/최근 본 목록 복원 시 유효 데이터 탈락 방지.

## [2.2.0] - 2026-08-25

### Added
- **8대 코어 화면 아키타입(Archetypes) 지원:** 게임화면(Game HUD), 웹 SaaS(Web), 모바일 앱(Mobile), 쇼핑몰(E-Commerce), 블로그(Blog), 대시보드(Dashboard), 미디어 플레이어(Media), 채팅(Chat) 등 8대 대표 화면 레이아웃 제공.
- **공통 템플릿 기반 Zero-Rebuild 동적 테마 주입 엔진:** 동일한 화면 구조에서 DOM 파괴 없이 `[data-theme]` 및 CSS Custom Properties 원자적 스왑을 통해 24개 전체 테마를 즉시 교체하며, 장바구니/게임 점수 등 인터랙션 상태를 완벽히 보존.
- **상단 Universal Quick Design Selector Bar:** 상세 모달 상단에 8개 대분류 탭과 24개 서브스타일 썸네일 칩 리스트를 배치하여 창이 열린 상태에서 24개 전체 디자인을 즉시 전환 및 비교 가능 (단축키 `[` / `]`, `Shift + Left/Right` 지원).
- **실감 나는 키네틱 인터랙션 시뮬레이터:**
  - Game: 타겟 터치 미니게임, 체력/마나 게이지, 스킬 쿨다운, 콤보 카운터.
  - E-Commerce: 컬러/사이즈 옵션 선택, 수량 조절, 장바구니 담기, 슬라이드아웃 카트 드로어, 주문/결제 모달 시뮬레이션.
  - Blog: 스크롤 읽기 진척도 바, 목차 연동, 좋아요/박수 파티클 카운터, 실시간 댓글 작성, 다크/라이트 읽기 모드.
  - Mobile: 상단 상태바, 피드 카드, 알림 스와이프 토글, 하단 4탭 네비게이션.
  - Dashboard: 기간 필터(1D/1W/1M), KPI 지표 애니메이션, 데이터 테이블 정렬/필터.
- **6종 신규 절차적 Web Audio SFX:** `THEME_SWAP`, `COIN`, `CART_ADD`, `SUCCESS`, `LIKE`, `SWIPE` 사운드 추가.

### Fixed & Hardened
- **XSS 취약점 제거 (FIN-F005):** `src/utils/clipboard.js` 내 `showToast` 함수의 `innerHTML` 템플릿 리터럴 주입을 `textContent` 및 `createElement` 노드 조립으로 안전하게 리팩토링.
- **WAI-ARIA 접근성 및 포커스 트랩 보완 (FIN-F006):** 상세/스플릿 모달에 Tab 포커스 트랩 적용, 모달 닫힘 시 직전 포커스 복원, 스플릿 비교 뷰 `Escape` 키 닫기 이벤트 핸들러 추가, 탭 네비게이션 `role="tab"` / `aria-selected` 속성 완비.
- **Web Audio Node 누수 방지 (FIN-F007):** 모든 Oscillator/Gain/Filter 노드에 `onended` 이벤트 핸들러를 등록하여 사운드 재생 종료 시 자동으로 `.disconnect()` 처리.
- **Canvas 2D 렌더링 최적화 (FIN-F008):** `prefers-reduced-motion` 준수 및 모달 오버레이 오픈 시 캔버스 애니메이션 루프 일시정지(`pauseLoop` / `resumeLoop`)를 통해 CPU/GPU 부하 절감.

## [2.1.0] - 2026-08-25

### Added
- **스타일 고유 썸네일:** Grid / Bento / Spectrum 카드에 사조별 기하·모티프 미리보기와 시그니처 모션을 추가해 같은 분류 안에서도 구분이 되도록 함.
- **선택 도크 & 확정 시트:** 클릭은 초안 담기, 더블클릭/Enter는 디테일. 하단 도크에서 자세히 보기·비교·북마크·확정이 가능하고 확정 스타일은 LocalStorage에 유지됨.
- **호버 피크:** 갤러리 타일 호버/포커스 시 라이브 히어로 미니 샌드박스.
- **키보드 내비:** `/` 검색, 화살표 이동, Enter 열기, Space 비교 슬롯, Esc 닫기. 디테일에서 ← → 로 같은 분류 순환.
- **목업 런타임:** `alert()` 제거. 내부 토스트, 카운트업, 글리치/펀치/스쿼시 등 스타일별 동적 효과. Glow 슬라이더 실제 연결.
- **스플릿 비교 비주얼 피커:** 드롭다운 아래 썸네일 스트립으로 A/B 선택.

### Changed
- 카테고리 마스터 카드가 분류별 배경 모티프를 갖고, 카드 전체 클릭으로 첫 서브를 열지 않음.

## [2.0.0] - 2026-08-14

### Added
- **8 Major Categories & 24 Subcategories**: Added Y2K Chrome & Hologram, Frutiger Aero Aqua Gloss, 8-Bit Pixel Arcade, Kinetic Typography & Motion, Bento UI 2.0 Precision Grid, Acid Graphics & Techno Rave, Claymorphism 3D Bubble, Handcrafted & Collage Indie, and Solarpunk Eco-Futurism.
- **3-Mode Interactive Gallery UX**: Standard Grid Mode, Asymmetric Bento Grid Mode, and Chronological Spectrum Stream Mode with instant view switcher.
- **Real-time Search & Multi-Tag Taxonomy**: Live instant keyword search input with clear button and 8-genre tag navigation.
- **LocalStorage Bookmarks System**: Ability to bookmark/save favorite design styles with quick bookmark filter view.
- **4-Component Live Sandbox**: Each style now features 4 live component preview tabs (`Hero Landing`, `Dashboard & Widget Cards`, `Form & Inputs Controls`, `Pricing & Feature Cards`).
- **Live Parameter Tweak Sandbox**: Real-time CSS custom property sliders for `Radius`, `Border Width`, `Shadow Depth`, and `Backdrop Blur`.
- **Live CSS Code Inspector**: Real-time generated CSS snippet viewer with one-click clipboard copy.
- **Side-by-Side Dual Split Comparison Sandbox**: Interactive split view modal to compare any two design styles side by side.
- **16-Track Procedural Web Audio Synth**: Expanded ambient BGM synthesizer to 16 distinct genre-matching tracks and new UI sound effects.
- **Audio-Reactive WASM Canvas Visualizer**: Background canvas particle engine now pulses and modulates with BGM audio frequency energy.
- **Vite Dev Server & npm Scripts**: Added `package.json` with `npm run dev` (Vite) and `npm run build` support for fast local development and instant HMR.

## [1.0.1] - 2026-08-02

### Fixed
- Fixed black screen issue on live mockup sandbox previews.
- Added explicit HTML sandbox mockup templates (`renderMockupSandboxHTML`) and CSS styles for all 15 preview types (`corporate`, `minimalism`, `skeuomorphism`, `memphis`, `vaporwave`, `organic`, `darkmode`, etc.).
- Verified crisp rendering, color contrasts, and interactive button alerts across all 15 subcategory design previews.

## [1.0.0] - 2026-08-02

### Added
- Created standard reference implementation documentation set (`spec.md`, `designs.md`, `implementation_summary.md`, `DESIGN_DECISIONS.md`, `BUILD_GUIDE.md`, `audit_roadmap.md`, `CHANGELOG.md`).
- Master data definition for 5 Main Design Genres and 15 Subcategory Styles with color palettes, characteristics, pros, and cons.
- Web Audio API procedural synthesis engine specifications for 10 ambient BGM tracks and 5 UI sound effects.
- WebAssembly (WASM) canvas visual rendering engine architecture.
- Fullscreen interactive detail showcase modal specifications with live HTML/CSS style mockups and click-to-copy color palette functionality.
