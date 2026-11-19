# Spec: Style Contract

**Project Name:** Web Design Sample Selector (`design_sample_selector`)

**Initiative ID:** `scalable-style-library`

**Module ID:** `style-contract`

**Depends on:** 없음

**Document Status:** 구현·검증 완료 (`COMPLETE`)

**작성일:** 2026-08-30

**승인일:** 2026-08-30

**구현일:** 2026-08-30

**검증일:** 2026-08-30

---

## 1. Objective

120종 이상의 디자인 시안을 한 번의 구조 개편으로 수용할 수 있도록 스타일, 카테고리, facet, 토큰, 프리뷰 참조, 출처와 호환 ID의 유일한 공개 데이터 계약을 정의한다.

주 사용자는 다음과 같다.

- 디자인 시안을 탐색하고 실제 프로젝트 후보로 비교하는 디자이너와 개발자
- 카탈로그, 테마, 프리뷰, 검색, 내보내기 기능을 구현하는 내부 모듈
- 검증된 스타일 팩을 추가하는 작성자와 에이전트

이 모듈은 시각 구현을 담당하지 않는다. 다른 모듈이 임의의 필드나 폴백 규칙을 만들지 않도록 안정적인 입력 계약만 제공한다.

## 2. Tech Stack

- JavaScript ES2022 정적 ES Module
- JSDoc 타입 계약과 동결된 상수 데이터
- Node.js 20.x 또는 22 이상
- Vite 6 기존 빌드 체인
- 외부 런타임·스키마 라이브러리 추가 없음

계약은 JSON 파일이 아니라 JavaScript 모듈로 관리한다. 현재 코드와 직접 호환되고, 주석·상수 참조·개발 시 타입 힌트를 유지하면서 별도 런타임 파서 의존성을 만들지 않기 위해서다.

## 3. Commands

구현 이후 이 모듈의 표준 검증 명령은 다음과 같다.

```bash
npm test -- tests/styleContract.test.js
npm test
npm run build
npm run check
npm run dev
```

`tests/styleContract.test.js`는 기존 24종 parity, 공개 조회, alias, facet 어휘, 출판 상태, 경계 입력과 재귀 불변성을 검증한다.

## 4. Project Structure

```text
src/catalog/
├── contract.js              # JSDoc 타입, enum 상수, ID/필드 규칙
├── categories.js            # 상위 카테고리 정의
├── facets.js                # facet 키와 허용 값
├── index.js                 # 유일한 정규 카탈로그 조회 진입점
├── legacyAdapter.js         # 기존 SubCategoryDesign 소비자용 임시 호환 계층
└── packs/
    └── core/
        ├── manifest.js              # core 팩 버전과 24개 소속 ID
        ├── styles-foundations.js    # Swiss~Retro 12종 정규 레코드
        └── styles-contemporary.js   # Editorial~Soft 3D 12종 정규 레코드

src/data/categories.js       # Wave 0 동안 호환 어댑터로 유지 후 제거 검토
tests/styleContract.test.js  # 공개 계약과 기존 24종 호환 테스트
```

`src/catalog/index.js`만 카탈로그의 공개 조회 진입점으로 사용한다. 소비자는 개별 팩 파일의 저장 구조에 의존하지 않는다.

## 5. Public Contract

### 5.1 Version and ID policy

- `CATALOG_SCHEMA_VERSION`의 최초 값은 `1`이다.
- 정규 스타일 ID와 카테고리 ID는 소문자 kebab-case이며 한번 배포되면 의미를 바꾸거나 재사용하지 않는다.
- 기존 24개 정규 ID는 그대로 유지한다.
- 별칭은 정규 레코드를 만들지 않으며 `alias → canonical ID` 단방향 매핑만 허용한다.
- 기존 별칭 `bauhaus-geometric`은 현재 `fluid-organic`에 연결되어 있으므로 새 Bauhaus 스타일의 정규 ID로 재사용하지 않는다.
- 필드 추가는 선택 필드를 우선한다. 필드 삭제, 타입 변경, ID 변경은 새 스키마 버전과 명시적 마이그레이션 없이는 금지한다.

### 5.2 Style record

```js
/**
 * @typedef {Object} ThemeEffects
 * @property {number} [backdropBlur] 0 이상의 유한한 CSS px 값
 */

/**
 * @typedef {Object} StyleRecord
 * @property {1} schemaVersion
 * @property {string} id
 * @property {string[]} aliases
 * @property {string} categoryId
 * @property {number} order
 * @property {'legacy'|'draft'|'review'|'ready'} publicationStatus
 * @property {{ ko: string, en: string }} name
 * @property {{ ko: string, en?: string }} summary
 * @property {StyleClassification} classification
 * @property {ThemeTokens} tokens
 * @property {ThemeEffects} [themeEffects]
 * @property {StylePreviewRefs} preview
 * @property {StyleTweaks} defaultTweaks
 * @property {PaletteColor[]} palette
 * @property {StyleEditorial} editorial
 * @property {StyleProvenance} provenance
 */

export const exampleStyle = Object.freeze({
  schemaVersion: 1,
  id: 'swiss-grid',
  aliases: [],
  categoryId: 'swiss',
  order: 10,
  publicationStatus: 'legacy',
  name: { ko: '격자 중심 모더니즘', en: 'Grid-Driven Modernism' },
  summary: { ko: '정밀한 그리드와 산세리프 중심의 모더니즘' },
  classification: {
    kind: 'historical-movement',
    era: { start: 1950, end: 1970, label: '1950s–1970s' },
    lineages: ['modernism', 'international-style'],
    media: ['graphic', 'web-ui'],
    materiality: ['flat'],
    density: 'balanced',
    tone: ['rational', 'precise'],
    motion: 'restrained',
    regions: ['international'],
    maturity: 'canonical'
  },
  tokens: {
    background: '#F4F4F0',
    surface: '#FFFFFF',
    surfaceSubtle: '#E8E8E3',
    border: '#111111',
    text: '#111111',
    textMuted: '#666666',
    accent: '#FF3300',
    accentSecondary: '#111111',
    radius: '0px',
    borderWidth: '1px',
    shadow: 'none',
    fontFamily: 'Inter, Helvetica, Arial, sans-serif',
    glow: 'none'
  },
  preview: {
    rendererId: 'swiss',
    thumbnailId: 'grid-lines',
    motionId: 'grid-reveal'
  },
  defaultTweaks: {
    borderRadius: 0,
    borderWidth: 1,
    shadowDepth: 0,
    backdropBlur: 0,
    glowIntensity: 0
  },
  palette: [
    { id: 'canvas-white', name: { ko: '캔버스 화이트', en: 'Canvas White' }, value: '#F4F4F0', usage: { ko: '메인 배경' } },
    { id: 'deep-ink', name: { ko: '딥 잉크', en: 'Deep Ink' }, value: '#111111', usage: { ko: '주요 텍스트' } },
    { id: 'swiss-red', name: { ko: '스위스 레드', en: 'Swiss Red' }, value: '#FF3300', usage: { ko: '주요 액센트' } }
  ],
  editorial: {
    moodTags: ['미니멀', '정밀성'],
    characteristics: [],
    pros: [],
    cons: [],
    accessibilityNotes: []
  },
  provenance: {
    reviewedAt: '2026-08-30',
    sources: [],
    assets: []
  }
});
```

`publicationStatus`의 의미는 다음과 같다.

- `legacy`: 기존 24종 무손실 이전 상태. 사용자에게 계속 노출되지만 출처와 접근성 메타데이터 보강이 필요할 수 있다.
- `draft`: 팩 내부 작성 중이며 운영 카탈로그에 노출하지 않는다.
- `review`: 데이터와 프리뷰는 완성됐지만 시각·접근성·출처 검토가 끝나지 않아 운영 카탈로그에 노출하지 않는다.
- `ready`: 모든 스타일 완료 조건을 통과하여 운영 카탈로그에 노출할 수 있다.

새 스타일은 `ready`만 운영 카탈로그에 포함한다. `legacy`는 `core` 팩의 기존 24종에만 허용하며 Wave 3 완료 전까지 모두 `ready`로 승격한다.

### 5.3 Category, facet, and pack records

카테고리는 스타일 ID 목록을 중복 저장하지 않는다. 스타일의 `categoryId`가 관계의 유일한 원천이다.

```js
/** @type {CategoryRecord} */
export const exampleCategory = Object.freeze({
  id: 'swiss',
  order: 10,
  title: { ko: '스위스 스타일', en: 'International Typographic Style' },
  description: { ko: '그리드와 산세리프 중심의 모더니즘 디자인' },
  icon: '📐',
  accentColor: '#FF3300',
  tags: ['modernism', 'grid', 'minimal']
});

/** @type {FacetDefinition} */
export const densityFacet = Object.freeze({
  id: 'density',
  order: 40,
  label: { ko: '정보 밀도', en: 'Density' },
  selectionMode: 'single',
  values: [
    { id: 'sparse', order: 10, label: { ko: '희박함', en: 'Sparse' } },
    { id: 'balanced', order: 20, label: { ko: '균형', en: 'Balanced' } },
    { id: 'dense', order: 30, label: { ko: '고밀도', en: 'Dense' } },
    { id: 'maximal', order: 40, label: { ko: '맥시멀', en: 'Maximal' } }
  ]
});

/** @type {StylePackManifest} */
export const corePack = Object.freeze({
  schemaVersion: 1,
  id: 'core',
  version: '1.0.0',
  order: 10,
  title: { ko: '코어 24종', en: 'Core 24' },
  styleIds: ['swiss-grid']
});
```

- 카테고리, facet, facet 값과 팩 ID도 소문자 kebab-case를 사용한다.
- 모든 `order`는 정수이며 같은 범위에서 중복될 수 있다. 동률이면 정규 ID 오름차순으로 정렬한다.
- `selectionMode`는 `single` 또는 `multiple`이다. 실제 필터 결합 규칙은 `catalog-discovery`가 소유한다.
- 팩 `version`은 팩 콘텐츠의 SemVer이며 애플리케이션 버전과 독립적이다.
- 팩 manifest의 `styleIds` 순서는 저장 순서가 아니라 소속을 나타낸다. 화면 순서는 스타일의 `order` 계약을 따른다.

### 5.4 Required classification vocabulary

`classification`은 하나의 계층에 서로 다른 개념을 억지로 넣지 않도록 다음 축을 분리한다.

| Field | Contract |
| --- | --- |
| `kind` | `historical-movement`, `revival`, `technique`, `interface-language`, `microtrend`, `speculative` 중 하나 |
| `era` | `start`, `end`, 사용자 표시용 `label`; 연도를 특정할 수 없으면 `start/end`는 `null` |
| `lineages` | 디자인 계보 ID 목록 |
| `media` | `graphic`, `print`, `web-ui`, `product-ui`, `illustration`, `three-d` 등 |
| `materiality` | `flat`, `glass`, `paper`, `ink`, `metal`, `plastic`, `pixel` 등 |
| `density` | `sparse`, `balanced`, `dense`, `maximal` 중 하나 |
| `tone` | 분위기 facet ID 목록 |
| `motion` | `none`, `restrained`, `expressive`, `intense` 중 하나 |
| `regions` | 문화권·지역 facet 목록. 국적을 스타일의 본질로 단정하지 않는다. |
| `maturity` | `canonical`, `established`, `emerging`, `experimental` 중 하나 |

facet ID는 영문 kebab-case이며 사용자 표시 문자열과 분리한다. 새 facet 값은 기존 값의 의미를 바꾸지 않는 추가 방식으로 확장한다.

### 5.5 Theme token contract

모든 스타일은 다음 13개 의미 토큰을 빠짐없이 제공한다.

- `background`
- `surface`
- `surfaceSubtle`
- `border`
- `text`
- `textMuted`
- `accent`
- `accentSecondary`
- `radius`
- `borderWidth`
- `shadow`
- `fontFamily`
- `glow`

토큰은 CSS에서 유효한 문자열 값을 사용한다. 런타임 CSS 변수명과 DTCG 출력 구조로의 변환은 `theme-generation`이 담당하며 이 계약에는 변환 결과를 중복 저장하지 않는다.

### 5.6 Optional theme effect contract

`themeEffects`는 스키마 버전 1의 선택 필드다. 현재 허용 키는 `backdropBlur` 하나이며 값은 0 이상의 유한한 숫자(CSS px)다.

- 필드가 없으면 `[data-theme]` 컨테이너 효과를 생성하지 않는다.
- 값이 있으면 theme 생성기가 unprefixed와 `-webkit-` prefixed `backdrop-filter`를 함께 생성한다.
- `themeEffects.backdropBlur`는 테마 컨테이너의 기준 효과이고 `defaultTweaks.backdropBlur`는 아키타입 슬라이더 초기값이므로 서로 자동 파생하지 않는다.
- 알 수 없는 키는 `THEME_EFFECT_UNKNOWN`, 음수·`NaN`·무한대·문자열 값은 `THEME_EFFECT_VALUE_INVALID` catalog 오류다.
- 현재 효과 값은 `glassmorphism: 20`, `frutiger-aero: 14`, `bento-grid: 16`이며 다른 스타일은 필드를 생략한다.

### 5.7 Preview reference contract

스타일 레코드는 함수나 HTML 문자열을 직접 포함하지 않고 다음 세 ID만 제공한다.

- `rendererId`: 4개 Web 컴포넌트 목업 렌더러
- `thumbnailId`: 갤러리·칩용 경량 썸네일 레시피
- `motionId`: 모션 프로필

현재 동기 구현은 완료된 `preview-registry`가 소유한다. registry definition에서 renderer/thumbnail/motion 정규 ID와 asset path inventory를 24/24/24/0으로 파생하고, `thumbnailId`는 renderer ID와 독립적으로 직접 디스패치된다. 알려지지 않은 참조는 Swiss·일반 썸네일·`none`으로 대체하지 않고 catalog 검증 또는 구조화된 render 오류가 된다. 미래 지연 로딩과 분할 전략은 `render-scalability`가 이 ID·capability·오류 계약을 유지한 채 소유한다.

### 5.8 Editorial and provenance contract

- `editorial`은 한국어 사용자 설명, mood tag, 특징, 장점, 단점과 접근성 주의사항을 소유한다.
- `provenance.sources`의 각 항목은 `title`, `url`, `publisher`, `accessedAt`, `sourceType`을 가진다.
- `sourceType`은 `primary`, `institutional`, `archive`, `industry`, `community` 중 하나다.
- `provenance.assets`는 실제 파일을 사용할 때 경로, 제작/소유 주체, 라이선스, 출처를 기록한다.
- 외부 참고 페이지의 설명이나 이미지를 그대로 저장하지 않는다.
- `ready` 스타일은 기관·원자료·신뢰 가능한 아카이브·업계 자료 중 하나 이상을 포함해야 한다. `community` 자료만으로 `ready`가 될 수 없다.
- `legacy` 스타일의 빈 출처 목록은 Wave 0에서 경고로 허용하되 Wave 3 완료 조건에서는 허용하지 않는다.

`PaletteColor`는 `id`, 지역화된 `name`, CSS 색상 또는 그라디언트 문자열 `value`, 지역화된 `usage`를 가진다. 기존 UI 호환 어댑터만 `value`를 현재의 `hex` 필드로 투영한다.

### 5.9 Public query interface

```js
getCatalogVersion();
getCategories();
getAllStyles(options = {});
getStyleById(styleId, options = {}); // 정규 ID와 별칭을 해석, 없으면 null
resolveCanonicalStyleId(id);  // 정규 ID 또는 null
getStylesByCategory(categoryId, options = {});
getFacetDefinitions();
getPackManifests();
```

- `options.includeUnpublished`의 기본값은 `false`다. 기본 조회에는 `legacy`와 `ready`만 포함되며, `true`일 때만 개발·검토 도구가 `draft`와 `review`를 조회할 수 있다.
- 반환 배열과 레코드는 소비자가 전역 카탈로그를 변경하지 못하도록 동결하거나 방어적 복사한다.
- `getStyleById()`의 `null`은 외부 저장 데이터가 오래되었을 때 처리할 수 있는 정상 결과다.
- 내부 레지스트리의 토큰·렌더러 누락은 정상 `null`이 아니라 `catalog-validation` 실패다.
- 결과 순서는 카테고리와 팩에서 선언한 명시적 `order`를 따른다. 파일 시스템 순서나 객체 키 열거 순서에 의존하지 않는다.
- 문자열이 아닌 ID 입력은 예외를 던지지 않고 `null` 또는 빈 배열을 반환한다. 개발 데이터 자체의 구조 오류와 사용자 저장 데이터의 오래된 ID를 구분하기 위해서다.

## 6. Migration and Compatibility

Wave 0 동안 `legacyAdapter.js`가 새 `StyleRecord`를 현재 `SubCategoryDesign` 형태로 투영한다.

```js
toLegacySubDesign(styleRecord);
getLegacyMainCategories();
```

- 기존 UI가 읽는 `name`, `nameEn`, `shortDesc`, `previewType`, `motionProfile`, `thumbMotif`, `moodTags`, `characteristics`, `pros`, `cons`, `palette`, `defaultTweaks`를 보존한다.
- 기존 로컬 저장 키와 24개 정규 ID를 변경하지 않는다.
- 호환 어댑터는 Wave 0의 전환 장치이며 새로운 모듈이 의존하는 영구 공개 API로 확장하지 않는다.
- 어댑터 제거는 모든 소비자가 새 계약으로 이동하고 별도 결정이 승인된 뒤에만 가능하다.

## 7. Code Style

- 공개 함수와 타입은 영어 camelCase, 정규 ID는 kebab-case를 사용한다.
- 설명 주석은 한국어로 의도와 호환성 제약을 기록한다.
- 원본 레코드 수정 대신 새 배열·객체를 반환한다.
- 화면 표시 문자열과 필터 ID를 분리한다.
- 알 수 없는 값을 암묵적으로 기본 스타일로 치환하지 않는다.

좋은 경계 처리 예시는 다음과 같다.

```js
export function getStyleById(id) {
  const canonicalId = resolveCanonicalStyleId(id);
  return canonicalId ? STYLE_BY_ID.get(canonicalId) || null : null;
}
```

## 8. Testing Strategy

### Contract tests

- 기존 24개 정규 ID와 별칭 해석 결과를 고정한다.
- 모든 공개 조회 함수의 반환 형태, 명시적 순서와 불변성을 확인한다.
- 정규 ID와 alias 공간이 충돌하지 않는지 확인한다.
- 레거시 어댑터가 현재 UI 필드를 손실 없이 제공하는지 확인한다.

### Integration tests

- 현재 `findSubById`, 북마크·확정·최근 본 디자인 복원 경로가 같은 정규 ID로 해석되는지 확인한다.
- 현재 24종을 새 레코드로 왕복했을 때 팔레트, 트윅, 프리뷰 참조가 유지되는지 확인한다.

### Regression gate

```bash
npm run check
```

현재 동작과 생성 결과가 달라지는 경우 의도된 계약 변경인지 먼저 문서화한다.

## 9. Boundaries

### Always do

- 새 필드를 경계에서 검증하고 기존 소비자에게는 추가 방식으로 제공한다.
- 정규 ID와 별칭의 충돌을 자동 테스트한다.
- 출처와 에셋 라이선스 메타데이터를 스타일 레코드와 함께 유지한다.
- 기존 24종의 저장·내보내기 호환성을 확인한다.

### Ask first

- 정규 스타일 ID 또는 카테고리 ID 변경·삭제
- `CATALOG_SCHEMA_VERSION` 증가
- 새 런타임 또는 스키마 검증 의존성 추가
- 기존 별칭의 대상 변경

### Never do

- 누락된 토큰·프리뷰 참조를 Swiss나 다른 스타일로 조용히 대체
- 동일한 시각 문법의 색상 변형을 별도 정규 스타일 수로 계산
- 출처가 불명확한 외부 이미지·폰트·그래픽을 프로젝트 에셋으로 포함
- 소비자가 팩의 내부 파일 구조나 객체 키 순서에 의존하게 노출

## 10. Success Criteria

- [x] 기존 24종이 `StyleRecord` 계약으로 표현되고 정규 ID가 모두 보존된다.
- [x] 카테고리, 스타일, facet의 명시적 순서와 조회 API가 결정론적으로 동작한다.
- [x] 모든 스타일이 13개 의미 토큰, 3개 프리뷰 참조, 분류, 편집 정보와 출처 구조를 가진다.
- [x] 카테고리와 팩의 소속 관계가 중복 원천 없이 결정되고 명시적 `order`로 안정적으로 정렬된다.
- [x] 새 스타일은 `ready`만 운영 카탈로그에 노출되고 `draft`와 `review`는 개발 조회에서만 접근할 수 있다.
- [x] 별칭은 정규 행으로 집계되지 않으며 저장된 기존 별칭이 같은 정규 ID로 복원된다.
- [x] 레거시 어댑터를 사용하는 동안 현재 갤러리·상세·스플릿·내보내기 동작이 유지된다.
- [x] 반환 데이터의 외부 변경이 정규 카탈로그 상태를 오염시키지 않는다.
- [x] 선택적 `themeEffects`가 스키마 v1 호환을 유지하고 값·키 검증과 재귀 불변성을 통과한다.
- [x] `npm run check`가 통과한다.

### Verification Evidence

- 2026-08-30 `npm run check`: 25개 Node 테스트와 Vite 프로덕션 빌드 통과
- Crostini Google Chrome: 8개 카테고리·24개 스타일, Grid/Bento/Spectrum, 상세·Split·인스펙터 흐름 확인
- 8개 아키타입 모두 Desktop `788px`와 Mobile `380px` 렌더 폭 및 모드 클래스 확인
- 북마크 UI의 저장·새로고침 복원·정리를 확인하고, alias 기반 북마크·확정·최근 목록 복원은 격리 저장소 테스트로 확인
- 앱 오류 오버레이는 발생하지 않았으며 관찰된 Chrome 확장 프로그램 경고는 앱 원본과 분리했다.
- 후속 `theme-generation` 완료 게이트에서 전체 63개 테스트, 효과 값 검증, 45개 canonical/alias computed style과 `20/14/16px` 블러를 다시 확인했다.
- 후속 `preview-registry` 완료 게이트에서 세 참조 집합과 파생 inventory 24/24/24/0, 독립 `thumbnailId`, 근거 기반 motion descriptor, 120-output 호환 hash와 공개 UI 소비 경계를 확인했다. 전체 93개 테스트와 Chrome 151의 Web 96개·Desktop/Mobile 384개 상태가 통과했다.

## 11. Implemented Decisions

- 정규 레코드, 중첩 값과 공개 배열은 초기화 시 재귀 `Object.freeze`로 동결한다.
- `src/data/categories.js`는 기존 named export만 재노출하는 얇은 호환 진입점으로 전환했다.
- 기존 24종은 `legacy` 상태로 노출하며 `draft/review`는 `includeUnpublished: true`에서만 조회한다.
- `theme-generation`이 완료되어 런타임 CSS와 호환 `THEME_TOKENS_MAP`은 13개 정규 토큰에서 파생된다. 수동 토큰 원천은 남기지 않고 승인 해시로 기존 24종을 감시한다.
- `themeEffects`는 선택적 v1 필드로 추가했으며 기존 13개 필수 토큰과 `defaultTweaks` 계약을 변경하지 않는다.
- `preview-registry`는 완료됐지만 사용자에게 노출되는 스타일 수와 UI는 24종으로 유지한다. `catalog-discovery`, `render-scalability`, `style-pack-authoring`, `catalog-expansion`은 각 모듈의 별도 사양 승인 전까지 시작하지 않는다.
