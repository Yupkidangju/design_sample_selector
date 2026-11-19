# Spec: Catalog Validation

**Project Name:** Web Design Sample Selector (`design_sample_selector`)

**Initiative ID:** `scalable-style-library`

**Module ID:** `catalog-validation`

**Depends on:** `style-contract` (`COMPLETE`)

**Document Status:** 구현 완료 (`IMPLEMENTED`)

**작성일:** 2026-08-30

**승인일:** 2026-08-30

---

## 1. Objective

120종 이상의 디자인 카탈로그를 확장할 때 누락된 필드, 중복 ID, 잘못된 관계, 알 수 없는 프리뷰 참조, 출처·라이선스 공백과 접근성 위험을 사용자 화면에 도달하기 전에 차단하는 결정론적 검증 계층을 만든다.

이 모듈의 사용자는 다음과 같다.

- 새 스타일 팩을 작성하고 검토하는 개발자와 에이전트
- 프로덕션 빌드 전에 카탈로그 무결성을 확인하는 로컬·CI 작업
- 후속 `theme-generation`, `preview-registry`, `catalog-discovery`, `style-pack-authoring` 모듈

성공한 검증은 “데이터가 완벽하다”는 선언이 아니라, 현재 스키마와 승인 정책에 대한 오류가 없고 알려진 부채가 구조화된 경고로 드러난 상태를 뜻한다.

## 2. Scope

### Included

- 카탈로그 스냅샷과 구조화된 진단 보고서 계약
- 카테고리·facet·스타일·팩·별칭의 필드 및 관계 검증
- 13개 토큰, 팔레트, 트윅, 분류 어휘와 순서 검증
- renderer/thumbnail/motion/asset 참조 인벤토리 교차 검증
- 출처, 라이선스, 프로젝트 로컬 에셋 경로와 접근성 메타데이터 검증
- 계산 가능한 기본 텍스트 대비 위험 검사
- 현재 카탈로그를 검증하는 Node CLI와 Vite `prebuild` 게이트
- 사람이 읽는 텍스트 및 기계가 읽는 JSON 보고서
- 현재 24종의 레거시 부채를 명시적으로 허용하는 경고 정책

### Excluded

- 잘못된 값을 자동 수정하거나 기본 스타일로 대체하는 런타임 복구
- 프리뷰 렌더러 자체를 레지스트리 구조로 개편하는 작업
- 런타임 CSS와 내보내기 토큰의 단일 원천화
- 신규 스타일, 카테고리 또는 facet UI 추가
- 외부 URL 접속, 원문 진위 확인 또는 라이선스 법률 판단
- 전체 CSS 문법을 구현하는 파서
- 브라우저 사용자 저장 데이터 검증

검증기는 프로젝트 소스 데이터만 읽으며 사용자 화면의 실행 경로에 포함되지 않는다.

## 3. Tech Stack

- JavaScript ES2022 정적 ES Module
- Node.js 20.x 또는 22 이상
- Node 내장 테스트 러너와 내장 `fs`, `path`, `url` 모듈
- Vite 6 기존 `prebuild`/`build` 수명주기
- 외부 스키마, CSS 파서 또는 CLI 의존성 없음

검증 규칙은 순수 함수로 유지한다. 파일 시스템 접근과 프로세스 종료 코드는 CLI 통합 경계에만 둔다.

## 4. Commands

승인 후 다음 명령을 표준 계약으로 추가한다.

```bash
# 현재 카탈로그를 사람이 읽는 형식으로 검증
npm run validate:catalog

# 경고도 실패로 취급하는 저작·정리 모드
npm run validate:catalog -- --strict

# 기계가 읽는 JSON 보고서
npm run validate:catalog -- --json

# 모든 개별 경고 경로까지 펼쳐 보기
npm run validate:catalog -- --verbose

# 집중 테스트
npm test -- tests/catalogValidation.test.js

# prebuild가 카탈로그 오류를 먼저 차단한 뒤 Vite 빌드
npm run build

# 전체 회귀와 빌드 게이트
npm run check
```

계획된 `package.json` 수명주기는 다음과 같다.

```json
{
  "scripts": {
    "validate:catalog": "node scripts/validateCatalog.js",
    "prebuild": "npm run validate:catalog",
    "build": "vite build",
    "check": "npm test && npm run build"
  }
}
```

`npm run build`를 직접 호출해도 검증을 우회할 수 없게 `prebuild`를 사용한다.

## 5. Project Structure

```text
src/catalog/validation/
├── index.js                     # 검증 모듈의 유일한 공개 진입점
├── report.js                    # 진단 코드, 보고서, CatalogValidationError
├── rules.js                     # 구조·관계·토큰·참조 순수 검증 규칙
├── color.js                     # 보수적 색상 문법·불투명 색상·대비 계산
├── quality.js                   # 출처·에셋·접근성·대비 정책
└── currentCatalog.js            # 공개 조회 API + preview registry → CatalogSnapshot 조립

scripts/
└── validateCatalog.js           # 텍스트/JSON 출력과 종료 코드 소유

tests/
└── catalogValidation.test.js    # 오류 코드, 경고 정책, 결정성, CLI 게이트
```

검증 스냅샷의 `references`는 preview registry의 정규 definition에서 파생한 동결 `ReferenceInventory`를 그대로 사용한다. 카탈로그 레코드와 참조 가능 구현 사이에 별도 수동 ID 목록을 두지 않는다.

## 6. Public Interface

### 6.1 Catalog snapshot

```js
/**
 * @typedef {Object} CatalogSnapshot
 * @property {number} schemaVersion
 * @property {readonly CategoryRecord[]} categories
 * @property {readonly FacetDefinition[]} facets
 * @property {readonly StyleRecord[]} styles
 * @property {readonly StylePackManifest[]} packs
 * @property {ReferenceInventory} references
 */

/**
 * @typedef {Object} ReferenceInventory
 * @property {readonly string[]} rendererIds
 * @property {readonly string[]} thumbnailIds
 * @property {readonly string[]} motionIds
 * @property {readonly string[]} assetPaths
 */

/**
 * @typedef {Object} ProvenanceSource
 * @property {string} title
 * @property {string} url
 * @property {string} publisher
 * @property {string} accessedAt
 * @property {'primary'|'institutional'|'archive'|'industry'|'community'} sourceType
 */

/**
 * @typedef {Object} ProvenanceAsset
 * @property {string} path
 * @property {string} owner
 * @property {string} license
 * @property {{ title: string, url?: string }} source
 */
```

참조 인벤토리는 필수다. 인벤토리가 없으면 프리뷰 참조를 검증했다고 오해할 수 있으므로 루트 오류를 반환한다.

### 6.2 Diagnostic contract

```js
/**
 * @typedef {Object} CatalogValidationIssue
 * @property {string} code
 * @property {'error'|'warning'} severity
 * @property {string} path
 * @property {string} message
 * @property {'catalog'|'category'|'facet'|'style'|'pack'|'reference'|'asset'} entityType
 * @property {string|null} entityId
 * @property {string|null} relatedPath
 */

/**
 * @typedef {Object} CatalogValidationReport
 * @property {boolean} valid
 * @property {readonly CatalogValidationIssue[]} issues
 * @property {{ errorCount: number, warningCount: number, totalCount: number }} summary
 */
```

- `code`, `severity`, `path`, `entityType`, `entityId`, `relatedPath`와 이슈 정렬은 기계 소비 계약이다.
- `message`는 사람을 위한 설명이며 테스트나 후속 모듈이 정확한 문구에 의존하지 않는다.
- 보고서와 중첩 배열은 재귀 동결한다.
- `valid`는 오류가 0개일 때만 `true`다. 경고는 기본 빌드를 실패시키지 않는다.

### 6.3 Functions

```js
validateCatalog(snapshot, options = {});
assertValidCatalog(snapshot, options = {});
createCurrentCatalogSnapshot(options = {});
validateCurrentCatalog(options = {});
formatCatalogValidationReport(report, options = {});
```

계약은 다음과 같다.

- `validateCatalog()`는 데이터 문제로 예외를 던지지 않고 모든 가능한 진단을 한 보고서에 모은다.
- `assertValidCatalog()`는 오류가 있거나 `failOnWarnings: true`인데 경고가 있으면 `CatalogValidationError`를 던진다. 오류 객체는 동결된 `report`를 가진다.
- `createCurrentCatalogSnapshot()`은 `src/catalog/index.js`의 공개 조회 API와 참조 인벤토리만 사용한다. 팩 내부 파일을 직접 순회하지 않는다.
- `validateCurrentCatalog()`은 현재 스냅샷 조립과 순수 검증을 결합한다.
- `formatCatalogValidationReport()`는 색상 제어문자 없이도 읽을 수 있는 결정론적 텍스트를 반환한다. 기본값은 모든 오류와 코드별 경고 요약을 출력하고 `verbose: true`에서 모든 경고 경로를 펼친다.

입력 루트가 잘못된 경우도 `CATALOG_INPUT_INVALID` 보고서로 표현한다. 예상하지 못한 구현 오류만 정상 예외로 전파한다.

## 7. Validation Rules

### 7.1 Root, field and ID rules

| Code | Default severity | Condition |
| --- | --- | --- |
| `CATALOG_INPUT_INVALID` | error | 스냅샷 루트 또는 필수 컬렉션이 올바른 객체/배열이 아님 |
| `SCHEMA_VERSION_MISMATCH` | error | 루트 또는 레코드 버전이 현재 계약과 다름 |
| `REFERENCE_INVENTORY_MISSING` | error | 필수 참조 인벤토리 배열이 없음 |
| `FIELD_REQUIRED` | error | 필수 필드가 없거나 빈 문자열임 |
| `FIELD_TYPE_INVALID` | error | 필드 타입 또는 배열 형태가 계약과 다름 |
| `ID_FORMAT_INVALID` | error | 정규 ID가 kebab-case `ID_PATTERN`과 맞지 않음 |
| `ORDER_INVALID` | error | `order`가 유한한 정수가 아님 |
| `ID_DUPLICATE` | error | 같은 네임스페이스에서 정규 ID가 중복됨 |

검증은 손상된 레코드 하나 때문에 전체 순회를 중단하지 않는다. 상위 구조가 없어서 실행 불가능한 하위 규칙만 건너뛴다.

### 7.2 Alias and relationship rules

| Code | Severity | Condition |
| --- | --- | --- |
| `ALIAS_DUPLICATE` | error | 하나의 alias가 여러 스타일을 가리킴 |
| `ALIAS_CANONICAL_COLLISION` | error | alias가 정규 스타일 ID와 충돌함 |
| `STYLE_CATEGORY_UNKNOWN` | error | `categoryId`가 카테고리에 없음 |
| `PACK_STYLE_UNKNOWN` | error | 팩의 `styleIds`가 존재하지 않는 스타일을 참조함 |
| `PACK_STYLE_DUPLICATE` | error | 한 팩에서 같은 스타일 ID가 반복됨 |
| `STYLE_PACK_MEMBERSHIP_INVALID` | error | 스타일이 0개 또는 2개 이상의 팩에 속함 |

카테고리는 스타일 목록을 중복 저장하지 않으며 스타일의 `categoryId`만 관계 원천으로 사용한다.

### 7.3 Category and facet rules

- 카테고리의 ID, `order`, 한국어·영어 제목, 한국어 설명, 아이콘, accent 색상과 태그 배열을 검사한다.
- facet의 ID, `order`, 지역화 레이블, `selectionMode`와 값 ID/순서를 검사한다.
- 한 facet 안의 값 ID는 유일해야 한다.
- 스타일 분류의 `kind`, `lineages`, `media`, `materiality`, `density`, `tone`, `motion`, `regions`, `maturity`가 대응 facet 값에 포함되는지 검사한다.
- `era.start/end`는 정수 또는 `null`이고 둘 다 있을 때 `start <= end`여야 한다.

알 수 없는 분류 값은 `FACET_VALUE_UNKNOWN`, 잘못된 시대 범위는 `ERA_RANGE_INVALID` 오류다.

### 7.4 Token, palette, tweak and theme-effect rules

- 13개 `THEME_TOKEN_KEYS`가 모두 존재하고 빈 문자열이 아니어야 한다.
- v1에 없는 추가 토큰은 확장 가능성을 막지 않도록 `TOKEN_UNKNOWN` 경고로 보고한다.
- 색상 계열 토큰과 팔레트 값은 hex, `rgb/rgba`, `hsl/hsla`, `transparent`, `linear-gradient`, `radial-gradient`의 기본 형태를 검사한다.
- `radius`, `borderWidth`는 CSS dimension 기본 형태를 검사한다.
- `shadow`, `glow`, `fontFamily`는 빈 문자열과 명백히 잘못된 타입을 차단한다.
- 이 검사는 완전한 CSS 파서가 아니다. DTCG 변환의 정밀 CSS 의미 검증은 `theme-generation`이 소유한다.
- 팔레트 ID는 스타일 안에서 유일하고, 지역화 이름·사용처와 값이 있어야 한다.
- 기본 트윅 5개 값은 유한한 0 이상의 숫자여야 한다.
- 선택적 `themeEffects`는 객체이며 v1에서 `backdropBlur`만 허용한다. 값은 0 이상의 유한한 CSS px 숫자여야 하고, `defaultTweaks.backdropBlur`와 다른 기준 효과 계약으로 다룬다.

관련 코드는 `TOKEN_REQUIRED`, `TOKEN_VALUE_INVALID`, `TOKEN_UNKNOWN`, `PALETTE_INVALID`, `TWEAK_VALUE_INVALID`, `THEME_EFFECT_UNKNOWN`, `THEME_EFFECT_VALUE_INVALID`다. 알 수 없는 효과 키와 잘못된 효과 값은 모든 출판 상태에서 error이며 경로는 `styles[<id>].themeEffects.<key>`다.

### 7.5 Preview and asset reference rules

- `preview.rendererId`, `thumbnailId`, `motionId`는 올바른 ID 형식이며 각 참조 인벤토리에 존재해야 한다.
- 알 수 없는 참조는 `PREVIEW_REFERENCE_UNKNOWN` 오류이고 다른 스타일로 대체하지 않는다.
- 에셋 경로는 프로젝트 상대 경로여야 하며 절대 경로, URL, `..` 경로 탈출을 허용하지 않는다.
- 선언한 에셋 경로가 `assetPaths` 인벤토리에 없으면 `ASSET_REFERENCE_UNKNOWN` 오류다.
- 에셋이 하나라도 있으면 `path`, `owner`, `license`, `source.title`이 있어야 한다. 외부에서 가져온 에셋은 `source.url`도 있어야 하며 프로젝트가 직접 만든 에셋은 URL 없이 출처 제목으로 원본임을 표시할 수 있다.

참조 가능 ID의 원천은 preview registry의 정규 renderer·thumbnail·motion definition이다. renderer 호환 별칭은 조회 API에서만 해석하고 정규 `rendererIds` 인벤토리에는 포함하지 않는다.

### 7.6 Provenance rules

각 source는 다음 필드를 가진다.

```js
{
  title: '...',
  url: 'https://...',
  publisher: '...',
  accessedAt: 'YYYY-MM-DD',
  sourceType: 'primary'
}
```

- URL은 `http:` 또는 `https:`만 허용하며 네트워크 요청은 하지 않는다.
- `accessedAt`과 `reviewedAt`은 `YYYY-MM-DD` 형식을 사용한다.
- `sourceType`은 `SOURCE_TYPES`에 속해야 한다.
- 같은 스타일 안에서 정규화된 URL 중복을 허용하지 않는다.
- `ready`는 source가 하나 이상이고 `community` 이외의 신뢰 가능한 source를 하나 이상 포함해야 한다.
- `legacy`, `draft`, `review`의 source 공백은 경고로 남긴다.
- 외부 에셋이 없으면 `assets: []`는 정상이다.

관련 코드는 `SOURCE_REQUIRED`, `SOURCE_TRUST_REQUIRED`, `SOURCE_METADATA_INVALID`, `SOURCE_DUPLICATE`, `ASSET_METADATA_INVALID`, `ASSET_PATH_UNSAFE`다.

### 7.7 Accessibility risk rules

- `ready` 스타일은 비어 있지 않은 `editorial.accessibilityNotes`를 하나 이상 가져야 한다.
- `legacy`, `draft`, `review`의 빈 접근성 메모는 경고다.
- 배경과 본문 텍스트가 불투명 단색으로 계산 가능하면 WCAG 방식의 상대 휘도 대비를 계산한다.
- 기본 본문 및 muted 텍스트 대비가 `4.5:1` 미만이면 `ready`에서는 오류, 그 외 상태에서는 경고다.
- gradient, alpha 합성 또는 파싱 불가능 값은 거짓 통과시키지 않고 `CONTRAST_UNCHECKED` 경고로 보고한다.
- 대비 계산은 디자인의 전체 접근성을 인증하지 않는다. 모션, 포커스, 컴포넌트 상태는 스타일 저작 QA와 브라우저 검증이 계속 필요하다.

관련 코드는 `ACCESSIBILITY_NOTES_REQUIRED`, `CONTRAST_LOW`, `CONTRAST_UNCHECKED`다.

## 8. Publication-aware Severity Policy

| Condition | `legacy` | `draft` | `review` | `ready` |
| --- | --- | --- | --- | --- |
| 필수 구조·ID·참조 오류 | error | error | error | error |
| 출처 없음 | warning | warning | warning | error |
| 비커뮤니티 신뢰 출처 없음 | warning | warning | warning | error |
| 접근성 메모 없음 | warning | warning | warning | error |
| 계산 가능한 본문 대비 미달 | warning | warning | warning | error |
| 대비 자동 계산 불가 | warning | warning | warning | warning |

현재 24개 `legacy` 스타일은 출처와 접근성 메모가 비어 있으므로 기본 검증에서 경고가 발생하는 것이 정상이다. 이 경고를 없애기 위해 허위 source나 형식적인 메모를 자동 삽입하지 않는다.

## 9. Deterministic Reporting and CLI

### Issue ordering

이슈는 입력 배열 순서나 객체 키 열거 순서와 관계없이 다음 순서로 정렬한다.

1. `error` 후 `warning`
2. `path` 오름차순
3. `code` 오름차순
4. `relatedPath` 오름차순

### CLI output

기본 텍스트 출력은 요약, 모든 오류, 코드별 경고 개수와 대표 경로 순서로 표시한다. `--verbose`는 모든 개별 경고를 펼치고, `--json`은 `CatalogValidationReport`만 stdout에 출력한다. 예상하지 못한 내부 오류는 stderr로 보낸다. 이 방식은 기존 24종의 다수 경고가 매 빌드 로그를 덮는 일을 막으면서 부채 개수는 항상 보이게 한다.

상위 필드 오류 때문에 의미가 없는 파생 오류는 중복 보고하지 않는다. 예를 들어 source가 0개면 `SOURCE_REQUIRED`만 내고 같은 레코드에 `SOURCE_TRUST_REQUIRED`를 추가하지 않으며, 필수 색상 토큰이 잘못됐으면 그 조합의 대비 계산은 건너뛴다.

| Exit code | Meaning |
| ---: | --- |
| `0` | 오류 없음; 기본 모드에서는 경고 허용 |
| `1` | 검증 오류가 있거나 `--strict`에서 경고가 있음 |
| `2` | 알 수 없는 CLI 옵션 또는 예상하지 못한 내부 실패 |

CLI는 데이터를 수정하지 않고 외부 네트워크에 접속하지 않는다.

## 10. Code Style

- 공개 함수와 타입은 영어 camelCase, 진단 코드는 `UPPER_SNAKE_CASE`를 사용한다.
- 설명 주석과 사람용 메시지는 한국어를 기본으로 한다.
- 규칙은 보고서 수집기에 이슈를 추가하고 직접 `console`이나 `process.exit`를 호출하지 않는다.
- 검사 중 원본 스냅샷을 정렬하거나 수정하지 않는다.
- 오류 코드와 JSON 경로를 테스트의 안정 계약으로 사용하고 전체 메시지 문자열은 고정하지 않는다.

```js
export function validateCatalog(snapshot) {
  const issues = [];
  validateRoot(snapshot, issues);
  validateStyleRelations(snapshot, issues);
  return createValidationReport(issues);
}
```

## 11. Testing Strategy

### Contract tests

- 공개 함수, 보고서와 `CatalogValidationError` 형태를 고정한다.
- 보고서가 재귀 동결되고 입력을 변형하지 않는지 확인한다.
- 같은 논리 입력은 배열 순서가 달라도 같은 정렬 진단을 생성한다.

### Rule mutation tests

- 하나의 유효 fixture에서 필드를 하나씩 손상시켜 각 오류 코드가 실제 변경 없이는 통과하고 변경 후 실패하는지 검증한다.
- ID/alias 충돌, 알 수 없는 category/facet/pack/preview/asset 참조와 팩 소속 0/2개를 검사한다.
- `legacy` 경고와 `ready` 오류의 severity 전환을 검사한다.
- 계산 가능한 대비 경계와 계산 불가능 경고를 검사한다.

### Integration tests

- 현재 8개 카테고리, 24개 스타일, 10개 facet, 1개 팩과 preview registry-derived 참조 인벤토리가 오류 0개인지 확인한다.
- 현재 경고 수와 코드별 개수를 명시적 기준선으로 기록한다.
- CLI의 텍스트/JSON과 종료 코드를 확인한다.
- `npm run build`가 `prebuild` 검증을 실행하는지 확인한다.

### Regression gate

```bash
npm run check
```

검증 모듈은 클라이언트 import 그래프에 들어가지 않으므로 프로덕션 JS 번들 크기를 증가시키지 않아야 한다.

## 12. Migration and Compatibility

- `src/catalog/index.js`의 기존 조회 API와 `src/data/categories.js` 호환 export를 변경하지 않는다.
- 카탈로그 스키마 버전은 `1`을 유지한다.
- 현재 24종의 정규 ID와 21개 alias를 변경하지 않는다.
- 기본 빌드는 기존 `legacy` 메타데이터 경고를 허용하여 현재 앱을 계속 빌드할 수 있게 한다.
- 검증 오류가 발견되면 빌드가 중단되지만 런타임 폴백이나 자동 수정은 추가하지 않는다.
- `preview-registry`가 정규 definition에서 파생한 `ReferenceInventory`를 제공하며, 이 공급자 전환 뒤에도 진단 코드와 검증 함수 계약을 유지한다.

## 13. Boundaries

### Always do

- 검증을 현재 정규 공개 조회 API에서 조립한 스냅샷에 실행한다.
- 모든 데이터 오류를 구조화된 코드와 경로로 보고한다.
- 오류 fixture와 현재 카탈로그 통합 테스트를 함께 유지한다.
- 경고 부채를 코드별 기준선으로 공개한다.
- 문서와 패키지 명령을 실제 게이트와 동기화한다.

### Ask first

- `CATALOG_SCHEMA_VERSION` 또는 기존 정규 ID·alias 변경
- 새 외부 검증·CLI·CSS 파서 의존성 추가
- 기존 진단 코드 제거 또는 의미 변경
- 경고를 기본 빌드 실패로 승격
- 출처 URL에 실제 네트워크 요청 수행
- 자동 수정 또는 데이터 생성 기능 추가

### Never do

- 누락된 renderer/token/style을 Swiss나 다른 기본값으로 대체
- 빌드를 통과시키기 위해 허위 source, 라이선스 또는 접근성 메모 삽입
- 사용자 브라우저 저장소, 비밀정보 또는 외부 계정 데이터 검사
- 프로젝트 밖의 파일을 에셋로 승인하거나 경로 탈출 허용
- 메시지 문자열 파싱을 후속 모듈의 제어 흐름으로 사용
- 검증 실패를 잡아서 성공 종료 코드로 숨김

## 14. Success Criteria

- [x] `validateCatalog`, `assertValidCatalog`, `validateCurrentCatalog`과 보고서 포매터가 문서화된 계약으로 제공된다.
- [x] 모든 진단은 안정적인 code/severity/path/entity 정보와 결정론적 순서를 가진다.
- [x] 구조·ID·alias·관계·팩·facet·토큰·팔레트·트윅 규칙의 손상 fixture가 해당 오류를 발생시킨다.
- [x] renderer/thumbnail/motion/asset의 알 수 없는 참조가 빌드 전에 오류가 된다.
- [x] `ready`의 출처·신뢰 출처·접근성 메모·계산 가능한 대비 요구가 오류로 적용된다.
- [x] 현재 24개 `legacy` 스타일은 오류 0개와 명시적으로 기록된 경고 기준선으로 통과한다.
- [x] CLI 기본 요약/verbose/JSON 출력, `--strict`와 종료 코드 0/1/2가 테스트된다.
- [x] `npm run build`가 `prebuild` 검증을 우회하지 못한다.
- [x] 검증 모듈이 브라우저 번들에 포함되지 않고 기존 24종 UI 동작이 유지된다.
- [x] `npm run check`가 통과한다.
- [x] 사양, ADR, 마스터 사양, 감사 로드맵, 구현 요약과 작업 문서가 실제 상태와 일치한다.

구현 증거는 `tests/catalogValidation.test.js` 집중 테스트 24개, 전체 테스트 49개, 기본 검증 오류 0개·경고 56개, `prebuild` 선행 로그, 기존 번들 gzip 크기 유지, Crostini Google Chrome 151의 갤러리·상세·Split·저장·내보내기 회귀 결과다. 경고 기준선은 `ACCESSIBILITY_NOTES_REQUIRED` 24개, `SOURCE_REQUIRED` 24개, `CONTRAST_LOW` 5개, `CONTRAST_UNCHECKED` 3개다.

## 15. Approval Decisions

2026-08-30 사양 승인으로 다음 결정도 함께 확정되었다.

1. 기본 빌드는 오류만 차단하고 기존 메타데이터 부채 경고는 표시만 한다.
2. `--strict`에서만 경고를 실패로 승격한다.
3. 프리뷰 참조는 후속 레지스트리 전까지 임시 레거시 인벤토리와 교차 검증한다.
4. 진단 code/path/order는 안정 계약이고 사람용 message 문구는 안정 계약이 아니다.
5. CSS 값 검사는 명백한 오류를 차단하는 보수적 문법 검사이며 완전한 CSS 파서는 도입하지 않는다.
6. 대비 자동 계산은 불투명 단색 조합에 한정하고 계산 불가능한 값은 경고로 노출한다.

## 16. Open Questions

구현을 막는 미확정 기술 항목은 없다. 위 여섯 승인 결정을 변경하려면 구현 전에 이 문서를 갱신한다.
