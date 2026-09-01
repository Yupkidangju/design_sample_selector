# DESIGN SPECTRUM (Web Design Sample Selector) v2.3.0

> 120종 인터랙티브 웹 디자인 사조 아카이브, 8대 코어 화면 아키타입, Universal 상단 디자인 선택 바, 상태 보존형 renderer·테마 전환, 4대 탭 동적 인스펙터 & 실시간 designs.md/토큰 내보내기 엔진, 키네틱 시뮬레이터, 실시간 파라미터 튜너 및 Web Audio 절차적 사운드 신시사이저 플레이그라운드

---

## 🚀 빠른 시작 (Local Development)

Node.js 20.x 또는 22 이상이 필요합니다. 현재 Vite 6 도구체인의 지원 범위와 `package.json#engines`를 기준으로 합니다.

### 1. 개발 서버 실행 (Vite)
```bash
# 의존성 설치 (최초 1회)
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:5173/design_sample_selector/` 로 접속합니다.

### 2. 프로덕션 빌드 & 미리보기
```bash
# 카탈로그 오류와 생성 테마 CSS 최신성을 prebuild에서 검사한 뒤 프로덕션 번들 빌드
npm run build

# 빌드 결과물 미리보기
npm run preview

# 자동 회귀 테스트 + 프로덕션 빌드 게이트
npm run check
```

미리보기는 `http://localhost:4173/design_sample_selector/`(또는 Vite가 출력한 포트)에서 엽니다. source root를 그대로 제공하는 단순 정적 서버는 CSS import를 production asset으로 변환하지 못하므로 지원하지 않습니다.

### 3. 카탈로그 검증

```bash
# 현재 카탈로그 검증: 오류는 실패, legacy 경고는 허용
npm run validate:catalog

# 모든 개별 경고 경로 표시
npm run validate:catalog -- --verbose

# 기계 소비용 JSON 보고서
npm run validate:catalog -- --json

# 경고도 실패로 처리하는 저작·정리 모드
npm run validate:catalog -- --strict
```

`npm run build`는 `prebuild`에서 기본 검증을 자동 실행합니다. 현재 actual 120은 기존 24개 `legacy`와 출처·접근성 메모가 완비된 96개 `ready` 스타일로 구성됩니다. 전체 기준선은 오류 0개, 기존 legacy 경고 56개이며 ready 96종은 오류·경고 0개입니다. legacy 부채를 허위 메타데이터로 지우지 않으며 `--strict`는 이 경고를 실패로 승격하므로 현재 종료 코드 `1`이 정상입니다.

### 4. 테마 CSS 생성과 최신성 검사

```bash
# StyleRecord.tokens와 선택적 themeEffects에서 추적 CSS 갱신
npm run generate:themes

# 파일을 쓰지 않고 추적 CSS가 최신인지 확인
npm run check:themes
```

스타일별 13개 테마 값의 작성 원천은 `src/catalog/packs/`의 `StyleRecord.tokens` 하나입니다. 컨테이너 블러가 필요한 스타일만 `themeEffects.backdropBlur`를 추가합니다. 초기 Core 36의 `themeTokens.css`와 지연 로드되는 신규 84종의 `themeTokensExpansion.css`는 모두 자동 생성·추적 파일이므로 직접 편집하지 않습니다. 토큰 변경 후 빌드가 stale 오류로 중단되면 `npm run generate:themes`를 실행하고 두 생성 diff를 검토한 뒤 `npm run check`로 전체 회귀를 확인합니다.

### 5. 프리뷰 레지스트리와 새 스타일 팩 등록

프리뷰 definition은 빌드 시 정적으로 조립되는 불변 레지스트리입니다. 런타임 등록 API, 원격 HTML과 플러그인 로더는 제공하지 않습니다. 초기 화면은 CSS 없는 inline thumbnail/motion entry를 사용하고 Detail/Split·Peek·확정 component renderer와 신규 84종 theme/preview CSS는 최초 사용 때 지연 chunk로 불러옵니다. 실제 120종은 Core 36과 `src/catalog/packs/expansion/`의 7개 팩으로 구성됩니다.

1. 명시적 blueprint와 문법·출처·접근성 원칙은 `src/catalog/packs/expansion/authoring.js` 계약에 맞추고, 팩 파일의 manifest `styleIds`와 정규 `StyleRecord`를 함께 등록합니다. 레코드의 `preview.rendererId`, `preview.thumbnailId`, `preview.motionId`는 각 구현 ID를 직접 가리켜야 합니다.
2. `src/preview/renderers-expansion.js`, `thumbnails-expansion.js`, `motions-expansion.js`의 definition 경계를 사용합니다. renderer는 네 Web 탭(`hero`, `widget`, `form`, `pricing`)을 모두 제공해야 합니다.
3. thumbnail HTML은 상위 갤러리·상세 칩의 버튼 안에 삽입되므로 `button`, `a`, `input`, `select`, `textarea` 같은 상호작용 요소를 포함하지 않습니다. 보이는 CTA도 장식용 `span`으로 표현합니다.
4. motion에는 실제 CSS·템플릿·썸네일·상호작용 근거가 있는 channel만 기록하고, 신규 ready 스타일에는 `metadata-only`를 사용하지 않습니다.
5. 신규 시각 규칙은 `.e120-*` root 아래에 격리하고 component 경계에서 지연 전달합니다. 테마 토큰을 바꿨다면 `npm run generate:themes`로 두 추적 CSS를 갱신합니다.

애플리케이션 코드는 `src/preview/index.js`의 `renderPreviewComponent()`, `renderPreviewThumbnail()`, 조회 API만 사용합니다. `src/components/mockupTemplates.js#getMockupHTML()`은 이전 위치 인자 호출과 120-output parity를 보존하는 얇은 호환 진입점이므로 신규 분기, switch 또는 fallback을 추가하지 않습니다. 등록 ID 목록은 레지스트리에서 자동 파생되어 카탈로그 검증에 전달되므로 별도 수동 inventory도 만들지 않습니다.

```bash
# 프리뷰 정의·호환·런타임·아키타입 통합 계약
npm test -- tests/previewRegistry.test.js tests/previewIntegration.test.js tests/mockupRuntime.test.js

# StyleRecord의 세 프리뷰 참조와 전체 품질 기준
npm run validate:catalog
npm run check
```

기능 조회는 잘못된 kind/ID에 `false` 또는 `null`을 반환하지만, 실제 render·hydration은 `PreviewRegistryError`로 실패합니다. `code`, `referenceKind`, `referenceId`, `tab`을 보고 누락 definition, 중복/별칭 충돌, 미지원 탭 또는 비어 있거나 `.mockup-unit` root가 없는 출력을 수정하십시오. Swiss, 일반 `Aa`, `none`으로 대체해 오류를 숨기면 안 됩니다. 현재 구현·검증 완료 범위는 actual 120이며 다음 미구현 Wave 수치는 없습니다.

```bash
# Crostini의 설치된 Google Chrome으로 Wave 1 실제 화면·상태 행렬 검증
npm run qa:wave1:chrome -- --artifacts=.antigravity/archive/wave1-chrome-qa
```

이 명령은 기본 Chrome 프로필을 사용하지 않고 격리된 임시 프로필과 로컬 Vite 서버를 사용합니다. 최종 보고서와 대표 화면은 지정한 프로젝트 내부 경로에 남고, 임시 프로필·서버는 종료 시 정리됩니다.

### 6. 카탈로그 탐색 사용과 Chrome 검증

- 상단 언어 메뉴는 `한국어`, `English`, `日本語`, `简体中文`, `繁體中文`을 native endonym으로 제공하고 선택한 locale을 문서 언어, 검색·이름 정렬, 카탈로그 표시 정보와 Detail Inspector snapshot에 함께 적용합니다.
- 최초 locale은 URL `lang` → 저장된 선택 → 브라우저 언어 → 한국어 순서로 결정합니다. URL에는 `ko`, `en`, `ja`, `zh-CN`, `zh-TW`만 허용하며 pack 로드나 검증이 실패하면 현재 정상 locale을 유지합니다.
- 다섯 locale은 actual 120 전체의 카드 이름·요약·palette·특징·장단점을 각각 명시적으로 소유합니다. 카드·Detail·Split·Peek·Dock·Preview·Inspector의 사람용 문구는 같은 snapshot을 사용하고, style ID·`data-*`·CSS/DTCG machine key는 번역하지 않습니다.
- 검색은 한국어·영어 이름, alias, category와 facet metadata를 함께 찾으며 최대 120자입니다.
- 상위 category와 `Bookmarks`는 독립 조건이므로 동시에 선택할 수 있습니다. 그 아래의 10개 facet은 필요한 항목만 펼쳐 radio/checkbox로 좁힙니다.
- 정렬은 카탈로그·이름·시대 오름차순·시대 내림차순을 제공합니다. Grid는 category별, Bento는 전역 정렬, Spectrum은 실제 스타일 시대별로 같은 결과 집합을 보여 줍니다.
- 현재 검색·category·facet·정렬·보기·북마크 조건은 URL의 `q`, `category`, 반복 `f`, `sort`, `view`, `saved`로 복원되므로 주소를 복사해 같은 탐색 상태를 다시 열 수 있습니다.
- 결과가 없으면 전체 초기화를 사용합니다. `/`는 검색으로 이동하고, 갤러리에서는 화살표·Enter·Space 키를 계속 사용할 수 있습니다.

```bash
# 탐색 계약 집중 테스트
npm test -- tests/catalogDiscovery.test.js

# Crostini의 설치된 Google Chrome으로 탐색·URL·반응형·접근성 검증
npm run qa:discovery:chrome
```

Chrome 명령은 기본 profile과 분리된 임시 profile을 사용합니다. 기본 보고서와 320px/1440px 대표 화면은 `.antigravity/archive/catalog-discovery-chrome-qa/`에 보존되고 임시 서버·profile은 종료 시 정리됩니다.

### 7. Actual 120 렌더·성능·Chrome 검증

- 갤러리는 한 페이지에 최대 36개 시각 카드만 만들며 기본 actual 120은 4페이지로 모든 ID에 도달합니다.
- Detail은 활성 category 안에서 최대 24개 thumbnail chip을 표시하고 초과 시 category 내부 검색을 제공합니다.
- Split은 슬롯마다 전체 스타일 native select와 검색 가능한 최대 12개 visual thumbnail을 함께 제공합니다.
- Detail/Split과 Peek/확정 component renderer는 필요할 때 불러오며 로딩 실패 시 명시적 오류와 재시도를 제공합니다.
- Detail에서 스타일 A→B로 전환하면 바깥 viewport는 유지하되 내부 renderer·motion·Inspector를 B 기준으로 다시 만들고, cart/game/chat 등 승인된 런타임 상태만 스냅샷으로 이관합니다. 이전 스타일의 HTML·카피·class는 이관하지 않습니다.
- Peek와 확정 시트는 선택 테마를 투영하는 non-modal preview region입니다. Checkout은 direct/cart 주문을 구분하는 focus-trapped dialog이며 Blog 읽기 모드와 진행률은 실제 계산 스타일·반응형 scroll owner에 연결됩니다.

```bash
# 현재 dist의 초기 정적 JS/CSS gzip 예산 확인
npm run build
npm run analyze:bundle

# build 후 actual 120 + QA 전용 synthetic 60/120 용량 회귀
npm run qa:scalability:chrome

# actual 120 전체 페이지·1,920 device 상태·대표 상세 흐름
npm run qa:catalog120:chrome
```

Audit 11에서는 장식용 `999px` pill과 `0..64px` surface tuner를 분리하고, broad radius override를 `[data-tweak-surface]` opt-in으로 교체했습니다. 이어진 locale Stage 1에서 5개 locale의 296-key visible/ARIA/artifact/runtime copy와 locale당 120종·1,924 field unit을 명시 pack으로 분리했습니다. Stage 2에서는 디자인명과 한국어·영어·일본어·중국어 간체·중국어 번체 본문을 각각 120/120 감수했으며, locale별 8개 category wave에서 summary·palette·특징·장단점의 공통 생성문과 숫자형 palette 이름을 제거했습니다. 최종 자동 재감사는 5 locale의 9,620개 사람용 field unit과 machine identity, 간체/번체 독립성을 대조하고 320/375/768/1024/1440px 및 물리 1280px/CSS 640px/DPR 2의 200% 상태 30개를 Chrome에서 검증합니다. 최신 Node `284/284`, actual-120 `1,920`상태·Web `480`탭, Discovery 9시나리오·6폭, Pages fault 9종이 issues 0을 통과했고 초기 JS/CSS는 `88.37/88.98kB`, `33.00/33.00kB` gzip입니다. 구조 완전성 근거는 `docs/multi_audit/11/locale_stage1_evidence.md`, 5개 locale 편집 근거는 `docs/multi_audit/11/locale_stage2_checkpoint_14_evidence.md`, 교차 언어·reflow 근거는 `docs/multi_audit/11/locale_stage2_task27_evidence.md`에 있습니다. 자동 검증과 별개로 원어민 수준의 자연스러움은 사용자 또는 해당 언어 화자의 검토 전까지 미확정입니다.

### 8. GitHub Pages production artifact와 복구 검증

GitHub Pages는 repository source를 직접 게시하지 않습니다. `vite.config.js`의 production base `/design_sample_selector/`와 `.github/workflows/deploy-pages.yml`이 `npm ci → npm run check → dist closure 검증 → dist artifact deploy`를 수행합니다. 지원 URL은 project root와 query/hash이며 임의 deep path는 지원하지 않습니다.

```bash
# Vite manifest, 모든 lazy JS/CSS/asset closure와 release SHA-256 manifest 확인
npm run build
npm run verify:pages-artifact

# /design_sample_selector/ subpath에서 Preview/Retry/Detail/Split 실제 Chrome 검증
npm run qa:pages:chrome
```

Preview retry는 primary 실패 뒤 한 번만 허용되고 두 번째 shared/import 실패는 terminal reload/cancel 상태로 끝납니다. Peek는 native `상세 보기` button과 실제 double click을 제공하며, 실패한 Detail mount는 listener·handler·부분 DOM을 rollback합니다. workflow가 push되어 실제 Pages가 새 artifact를 게시하기 전까지 live 배포 판정은 HOLD입니다.

---

## 🎨 주요 기능 (Key Features)

1. **8대 대분류 & 120종 세부 디자인 사조 아카이브**
   - 기존 Core 36에 7개 팩·21개 시각 문법의 신규 84종을 더하고 카테고리별 15종으로 균형화
   - 분류별 배경 모티프와 서브스타일 고유 라이브 썸네일로 한눈에 구분
   - 버전 1 정규 카탈로그가 ID·alias·분류·13개 테마 토큰·프리뷰 참조·출처를 동결된 레코드로 제공하며, 기존 24종 저장 데이터와 UI import를 호환
   - 구조·ID·관계·프리뷰·에셋·출처·접근성 위험을 Node 전용 검증기와 `prebuild`에서 검사하며, 오류는 빌드 전에 차단하고 legacy 부채는 코드별 경고로 공개
   - 정규 토큰에서 런타임 CSS와 CSS/Markdown/DTCG 내보내기 값을 결정론적으로 파생하며, 생성 CSS가 오래되면 빌드 전에 복구 명령과 함께 차단
   - 120개 renderer·thumbnail·motion을 동결 preview registry로 관리하고 정규 ID 목록을 카탈로그 검증에 직접 공급하며, 미등록 참조는 Swiss·일반 썸네일·`none`으로 대체하지 않고 구조화 오류로 차단
   - 한국어·영어·alias·분류 metadata 검색, category+bookmark, 10개 facet, 네 정렬과 공유 가능한 URL 상태를 하나의 탐색 계약으로 제공
   - 실제 120종에서도 Gallery 36개, Detail 24개, Split 12개/slot의 시각 DOM 상한과 on-demand preview chunk를 유지하도록 Crostini Chrome actual/synthetic 게이트로 검증
2. **8대 코어 화면 아키타입 (Core Page Archetypes)**
   - 🎮 **게임 (Game HUD)**: 몬스터 타겟 터치 배틀, 체력/마나 게이지, Q/W/E/R 스킬 쿨다운, 콤보 승수, 레벨업 파티클
   - 🌐 **웹 (Web SaaS)**: 히어로 랜딩, 대시보드 위젯, 폼 컨트롤, 가격표 4대 컴포넌트 통합
   - 📱 **모바일 (Mobile App)**: 모바일 베젤, 상단 상태바, 알림 카드 스와이프, 피드 좋아요, 하단 4탭
   - 🛍️ **쇼핑몰 (E-Commerce)**: 컬러/사이즈 옵션 선택, 수량 조절 Stepper, 장바구니 담기, 슬라이드아웃 드로어, 주문/결제 모달 시뮬레이션
   - 📰 **블로그 (Blog & Post)**: 스크롤 읽기 진척도, 목차, 박수 카운터, 실시간 댓글 작성 및 등록, 다크/라이트 읽기 모드
   - 📊 **대시보드 (Analytics)**: 기간 필터(1D/1W/1M/1Y), KPI 카드 수치 애니메이션, 데이터 테이블 정렬/필터
   - 🎵 **미디어 (Media Player)**: 비닐 회전, 트랙 프로그레스 스크러버, 볼륨 슬라이더, 스펙트럼, 플레이리스트 큐
   - 💬 **채팅 (Messenger & DM)**: 채널 사이드바, 실시간 메시지 버블 스트림, 이모지 리액션, AI 자동 응답 시뮬레이션
3. **Universal 상단 디자인 선택 바 (Top Quick Style Selector)**
   - 상세 모달 상단에서 8대 대분류 탭과 활성 category의 최대 24개 서브스타일 칩을 제공하고, 초과 category는 검색으로 모든 디자인에 도달
   - 상태 보존형 renderer 전환: 외부 viewport는 유지하고 스타일별 renderer·motion·`[data-theme]`을 함께 교체한 뒤 장바구니/게임 스코어/댓글/채팅 snapshot을 복원
   - 단축키: `[` / `]` (전체 120개 스타일 순환), `Shift + Left/Right` (8대 대분류 점프), `Esc` (닫기)
4. **4대 탭 동적 인스펙터 & 실시간 디자인 사양서/토큰 내보내기 엔진 (v2.3.0)**
   - 💻 **Live CSS**: 테마 토큰, 실시간 슬라이더 트윅, 활성 아키타입 CSS 100% 실시간 연동 (서브모드: 전체 번들 / 토큰만 / 아키타입 CSS)
   - 📄 **Live HTML**: 현재 렌더링된 샌드박스 뷰포트의 실시간 DOM 마크업
   - 📋 **Live designs.md**: 메타데이터, 색상표, 슬라이더 수치, 폰트 스택, 아키타입 ASCII 구조도, 키네틱 가이드라인이 포함된 D3D 표준 마크다운 사양서 자동 빌드
   - 🏷️ **Design Tokens (JSON)**: DTCG Format/Color Module 2025.10의 구조화된 color, gradient, dimension, shadow, fontFamily 값으로 생성
   - 💾 **원클릭 복사 & 파일 내보내기**: `.css`, `.html`, `.md`, `.json` 개별 다운로드와 네 산출물을 주석 구획으로 합친 `*-integrated-snapshot.txt` 내보내기 (SFX + 토스트 피드백)
   - ⚡ **rAF 기반 동기화**: 연속 슬라이더 입력을 프레임 단위로 병합해 현재 선택·조정 상태에서 인스펙터 내용을 다시 생성
5. **선택 도크 · 호버 피크 · 확정**
   - 클릭으로 담고, 더블클릭/Enter로 자세히 보기, “이 스타일 확정”은 브라우저에 저장
   - 키보드: `/` 검색, 화살표 이동, Space 비교 슬롯
6. **3가지 갤러리 뷰 모드**
   - category별 표준 그리드 뷰 (Standard Grid)
   - 전역 정렬의 반응형 벤토 그리드 뷰 (Dynamic Bento Grid)
   - 실제 `classification.era`에서 파생한 연대기적 스펙트럼 스트림 뷰 (Spectrum Stream)
7. **실시간 파라미터 튜너**
   - 실시간 CSS 파라미터 슬라이더 (`Radius` 0–64, `Border` 0–12, `Shadow` 0–30, `Blur` 0–32, `Glow` 0–2.0)
8. **듀얼 스플릿 비교 모드**
   - 서로 다른 두 디자인 사조를 나란히 비교 분석하며 슬롯별 전체 native select + 검색 가능한 최대 12개 visual picker, 동기화된 아키타입 전환과 ESC를 지원
9. **16트랙 Web Audio API 절차적 BGM & 14종 사운드 FX**
   - 무손실 웹 오디오 신시사이저를 통한 배경음악 및 `THEME_SWAP`, `COIN`, `CART_ADD`, `SUCCESS`, `LIKE`, `SWIPE` 등 효과음 실시간 합성 (노드 자동 연결 해제)
10. **Canvas 2D 반응형 파티클 비주얼라이저**
   - JavaScript Canvas 2D 파티클(WebAssembly 모듈 없음). 모션 감축(`prefers-reduced-motion`) 및 모달 오픈 시 렌더링 일시정지


---

## 📁 프로젝트 구조

```
├── index.html                  # 진입점 HTML
├── index.css                   # 애플리케이션 공통 디자인 시스템
├── package.json                # Vite 개발/빌드 스크립트 및 패키지 설정
├── src/
│   ├── main.js                 # 앱 초기화 및 부트스트랩
│   ├── state/
│   │   ├── appState.js         # 싱글톤 상태 관리자
│   │   └── discoveryUrlState.js # URL ↔ 탐색 상태 동기화
│   ├── catalog/                # 버전 1 정규 스타일·카테고리·facet·팩 조회 계약
│   │   ├── index.js            # 유일한 정규 카탈로그 조회 진입점
│   │   ├── discovery.js        # 검색·facet·정렬·시대 그룹 순수 계약
│   │   ├── discoveryUrl.js     # 탐색 URL parse/serialize 계약
│   │   ├── contract.js         # 스키마·어휘·재귀 불변성 계약
│   │   ├── legacyAdapter.js    # 현재 UI용 SubCategoryDesign 투영
│   │   ├── validation/         # 구조화 검증 API, 품질·대비 규칙과 현재 snapshot 어댑터
│   │   ├── packs/core/         # 호환 Core 36 StyleRecord와 manifest
│   │   └── packs/expansion/    # 7팩·84종 blueprint/StyleRecord와 authoring 문법
│   ├── theme/                  # 동결 테마 투영·13개 CSS 매핑·순수 스타일시트 생성기
│   ├── preview/                # actual 120 renderer·thumbnail·motion, 종류별 entry와 공개 호환 API
│   ├── scalability/            # 불변 gallery window·bounded picker와 성능 예산
│   ├── data/categories.js      # 기존 named export를 유지하는 얇은 호환 진입점
│   ├── audio/synthAudio.js     # Web Audio 16트랙 절차적 신시사이저
│   ├── wasm/visualEngine.js    # Canvas 2D 파티클 배경 엔진 (경로명 유지, WASM 아님)
│   ├── components/             # UI, bounded picker/pager, lazy preview loader와 discovery 계층
│   ├── styles/
│   │   ├── themeTokens.css     # 기존 36종 initial 생성 테마 CSS
│   │   ├── themeTokensExpansion.css # 신규 84종 async 생성 테마 CSS
│   │   ├── expansion-preview.css # 신규 21개 문법의 async 상세 CSS
│   │   ├── interactive.css     # 선택 도크, 피크, 썸네일, 목업 모션
│   │   └── wave1-styles.css    # 신규 12종 격리·반응형·reduced-motion 규칙
│   └── utils/                  # 생성기, 인스펙터 상태, 클립보드 유틸리티
├── scripts/validateCatalog.js  # compact/verbose/JSON/strict 카탈로그 검증 CLI
├── scripts/generateThemeStyles.js # 테마 CSS write/check CLI
├── scripts/verifyWave1Chrome.js # 격리 Chrome 기반 Wave 1 런타임·시각 QA
├── scripts/verifyCatalogDiscoveryChrome.js # 격리 Chrome 탐색·URL·접근성 QA
├── scripts/analyzeInitialBundle.js # dist 초기 정적 JS/CSS gzip 예산 분석
├── scripts/verifyRenderScalabilityChrome.js # actual 120 + synthetic 60/120 렌더·성능 QA
├── scripts/verifyCatalog120Chrome.js # actual 120×8×2·상세 흐름 Chrome QA
├── tests/                      # 카탈로그·테마·프리뷰·런타임·인스펙터·ARIA·반응형 회귀 테스트
├── spec.md                     # 시스템 마스터 사양서
├── designs.md                  # 아키텍처 및 디자인 명세
├── LESSONS_LEARNED.md          # 완료 마일스톤에서 재사용할 구현·검증 교훈
├── BUILD_GUIDE.md              # 빌드 및 실행 가이드
└── CHANGELOG.md                # 변경 이력
```
