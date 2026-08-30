# Spec: `catalog-discovery`

**Initiative:** `scalable-style-library`

**Module ID:** `catalog-discovery`

**Status:** 구현·검증 완료 (`COMPLETE`)

**승인 근거:** 2026-08-30 사용자의 순차 구현 지시와 후속 “승인”

**완료일:** 2026-08-30

**Catalog baseline:** Core 36 (`legacy` 24 + `ready` 12)

---

## 1. Objective

Core 36에서 60~120종으로 확장해도 사용자가 원하는 디자인 시안을 이름이나 상위 카테고리만으로 찾지 않아도 되는 탐색 체계를 만든다. 한국어·영어 검색, 상위 카테고리, 10개 분류 facet, 북마크, 정렬을 하나의 결정론적 질의로 결합하고 현재 조건을 공유 가능한 URL로 복원한다. Spectrum은 카테고리 배열과 고정 시대 문구가 아니라 각 `StyleRecord.classification.era`를 읽어 실제 연대순으로 구성한다.

주요 사용자는 여러 후보를 빠르게 좁혀 Grid/Bento/Spectrum에서 비교하고 상세 시안으로 들어가는 기획자·디자이너다. 성공은 “36종을 늘리는 것”이 아니라 120종 규모에서도 같은 계약을 그대로 적용할 수 있고, 현재 36종의 렌더러·썸네일·테마·저장 ID를 훼손하지 않는 것으로 판단한다.

### 1.1 승인된 가정

1. 이번 모듈에서는 Core 36 콘텐츠와 8개 상위 카테고리를 유지하며 Wave 2 스타일을 추가하지 않는다.
2. 검색은 서버·외부 검색 없이 정규 `StyleRecord` 메타데이터를 대상으로 즉시 실행한다.
3. 서로 다른 facet은 AND, 하나의 `multiple` facet 안에서 여러 값은 OR로 결합한다. `single` facet은 한 값만 유지한다.
4. URL 갱신은 검색 타이핑마다 히스토리를 쌓지 않는 `history.replaceState`를 기본으로 하고, 초기 진입과 `popstate`에서는 URL을 상태로 복원한다.
5. Spectrum의 시대 그룹 순서는 정규 시대 시작 연도에서 파생하고, 시작 연도가 없는 레코드는 `timeless`로 분류한다.
6. 대량 DOM 지연 렌더링·가상화·dynamic import와 성능 예산 확정은 다음 `render-scalability` 모듈의 범위다.

## 2. Functional Contract

### 2.1 Search

- 검색 대상은 정규 ID·alias, 한국어/영어 이름과 요약, 상위 카테고리 제목·태그, editorial mood/characteristics, facet 값의 한국어/영어 레이블이다.
- 입력은 trim·대소문자·Unicode 악센트 차이를 정규화한다.
- 공백으로 나눈 모든 검색어가 한 스타일의 검색 문서에 포함되어야 일치한다(AND token search).
- 검색 문자열은 UI와 URL에서 최대 120자로 제한한다.
- 검색 결과가 없으면 빈 화면 대신 현재 조건과 초기화 동작을 제공한다.

### 2.2 Category, bookmark and facets

- 상위 카테고리와 북마크 전용 보기는 facet·검색과 독립된 조건이며 함께 적용할 수 있다.
- 공개 facet은 `kind`, `era`, `lineage`, `media`, `materiality`, `density`, `tone`, `motion`, `region`, `maturity`의 정렬·동결된 사전을 그대로 사용한다.
- `kind`, `era`, `density`, `motion`, `maturity`는 single selection, 나머지는 multiple selection이다.
- 현재 카탈로그에서 결과가 0인 미사용 facet 값은 기본 제어판에서 숨기되, 이미 선택된 값은 제거할 수 있도록 유지한다.
- 활성 조건은 제거 가능한 텍스트 칩으로 다시 보여 주고 색만으로 상태를 전달하지 않는다.

### 2.3 Sort and presentation

- 정렬 모드는 `catalog`, `name-asc`, `era-asc`, `era-desc` 네 가지다.
- `catalog`는 기존 `order` 후 canonical ID 순서를 보존한다.
- Grid는 상위 카테고리를 유지하면서 각 카테고리 안의 결과 순서를 적용한다.
- Bento는 질의 결과의 전역 순서를 사용한다.
- Spectrum은 실제 시대 bucket을 시간 순서로 그룹화하며, `era-desc`에서는 그룹 순서를 역전한다. 카드에는 시대 레이블과 상위 카테고리를 함께 표시한다.

### 2.4 Dynamic status

- 전체 스타일 수, 카테고리별 스타일 수, 현재 결과 수, 활성 조건 수는 데이터와 현재 상태에서 파생한다.
- 결과 수 변경은 `role="status"`와 `aria-live="polite"`로 안내한다.
- 정렬·facet 입력은 연결된 label/legend를 가지며 키보드만으로 조작할 수 있다.
- 모바일 조작 대상은 최소 44×44 CSS px를 확보한다.

### 2.5 URL/state contract

정규 query parameter는 다음과 같다.

| Parameter | Meaning | Default / invalid handling |
| --- | --- | --- |
| `q` | 최대 120자의 검색어 | 빈 값은 생략 |
| `category` | 정규 상위 카테고리 ID | 알 수 없으면 `ALL` |
| `f` | 반복 가능한 `facetId:valueId` | 알 수 없는 facet/value는 무시, 중복 제거 |
| `sort` | `name-asc`, `era-asc`, `era-desc` | 생략·알 수 없음은 `catalog` |
| `view` | `bento`, `spectrum` | 생략·알 수 없음은 `GRID` |
| `saved` | `1`이면 북마크만 | 그 외 false |

- 직렬화 순서는 query, category, facet 정의/값 순서, sort, view, saved로 안정적이어야 한다.
- 기본값은 URL에서 생략한다.
- 잘못된 외부 입력은 예외나 Swiss fallback 없이 안전한 기본값으로 정규화한다.
- URL을 새로 열거나 reload하면 같은 탐색 결과와 뷰가 복원되어야 한다.

## 3. Tech Stack

- Vanilla HTML5 + CSS3 + ES modules
- Vite `6.2.x`
- Node built-in test runner (`node --test`)
- 정규 데이터: `src/catalog/` schema version `1`
- 실제 런타임 검증: Crostini `/usr/bin/google-chrome`, 격리된 임시 profile과 CDP
- 새 런타임·개발 dependency, 서버, 원격 asset 없음

## 4. Commands

```bash
# 개발
npm run dev -- --host 127.0.0.1

# 탐색 계약 집중 테스트
npm test -- tests/catalogDiscovery.test.js

# 기존 카탈로그·통합 회귀
npm test -- tests/styleContract.test.js tests/previewIntegration.test.js

# 카탈로그 및 생성 테마 검증
npm run validate:catalog
npm run check:themes

# 전체 자동 게이트
npm run check

# Crostini 실제 Chrome 탐색 QA
npm run qa:discovery:chrome
```

## 5. Project Structure

```text
src/
├── catalog/
│   ├── discovery.js          # 검색·facet·정렬·시대 그룹 순수 계약
│   ├── discoveryUrl.js       # URL parse/serialize 순수 계약
│   └── index.js              # 공개 query entrypoint
├── state/
│   ├── appState.js           # 활성 facet·정렬 상태
│   └── discoveryUrlState.js  # URL ↔ appState 브라우저 동기화
├── components/
│   ├── discoveryControls.js  # 결과 상태·facet·정렬 UI
│   ├── discoveryMarkup.js    # 접근 가능한 탐색 제어 마크업
│   ├── galleryModel.js       # 세 보기의 공통 결과·그룹 투영
│   ├── header.js             # 검색·상위 카테고리·북마크
│   └── mainView.js           # 세 갤러리 모드 소비자
└── main.js                   # 초기 URL 복원 및 component mount

tests/catalogDiscovery.test.js
scripts/verifyCatalogDiscoveryChrome.js
```

## 6. Code Style

- 데이터 질의와 URL 변환은 DOM·전역 상태를 읽지 않는 순수 함수로 작성한다.
- 공개 결과는 입력을 변경하지 않고 안정 순서를 보장한다.
- UI는 inline handler 대신 `data-*`와 `addEventListener`를 사용한다.
- 설명 주석은 구현을 반복하지 않고 AND/OR 규칙, 시대 bucket, URL canonicalization 같은 불변조건만 한국어로 기록한다.

```js
const results = queryCatalogStyles(styles, {
  query: 'glass professional',
  categoryId: 'depth',
  facets: { materiality: ['glass'], tone: ['professional', 'futuristic'] },
  sort: 'era-desc',
  bookmarksOnly: false,
  bookmarkedIds: []
});
```

## 7. Testing Strategy

1. **Unit:** 실제 Core 36과 작은 synthetic fixture로 검색 문서, single/multiple 정규화, AND/OR, 정렬, 시대 경계, 입력 불변성을 검증한다.
2. **URL contract:** 기본값 생략, 안정 직렬화, invalid/duplicate sanitization, parse→serialize→parse 동등성을 검증한다.
3. **Integration:** 기존 Core 36 ID·순서·preview hash·theme/export 계약과 세 갤러리 모드의 결과 개수가 유지되는지 기존 테스트와 새 테스트로 확인한다.
4. **Browser:** 320/375/414/768/1024/1440px에서 overflow, 검색·facet·정렬·결과 상태·empty reset·URL reload/popstate·Grid/Bento/Spectrum·키보드·reduced-motion·console/network 오류를 실제 Google Chrome으로 확인한다.
5. **Accessibility:** label/legend, `aria-pressed`/native input 상태, live result status, 44px touch target, focus-visible, 색 외 텍스트 상태를 DOM·computed style로 검사한다.

## 8. Boundaries

### Always do

- `StyleRecord`와 facet 사전을 단일 데이터 원천으로 사용한다.
- 실패 테스트를 먼저 만들고 각 수직 slice 뒤 표적 테스트와 전체 회귀를 실행한다.
- 검색/URL 문자열을 출력할 때 HTML escape하고 invalid state를 정규화한다.
- Core 36의 canonical ID, alias, 저장 데이터, 렌더러·테마·내보내기 결과를 보존한다.
- 문서, 작업 목록과 실제 검증 증거를 동기화한다.

### Ask first

- 8개 상위 카테고리의 ID·의미 변경
- 새 dependency, 외부 asset, 원격 검색 또는 서버 도입
- URL parameter의 호환되지 않는 변경
- Wave 2 콘텐츠 추가, Git commit·push·배포

### Never do

- 검색·facet 실패를 Swiss나 첫 스타일로 대체
- 사용자 검색 문자열을 escape 없이 `innerHTML`에 삽입
- 카테고리별 하드코딩된 시대 문구를 Spectrum 데이터로 사용
- 테스트 삭제·skip 또는 기본 Chrome profile 연결
- 이번 모듈에서 가상화·dynamic import를 임의로 선행 구현

## 9. Success Criteria

- [x] Core 36을 유지하면서 정규 탐색 함수가 한국어/영어/metadata 검색과 category+bookmark+10 facet 조합을 정확히 반환한다.
- [x] 같은 facet의 multiple 값은 OR, 서로 다른 facet은 AND, single facet은 하나만 유지한다.
- [x] 네 정렬 모드가 안정적이며 입력 배열을 변경하지 않는다.
- [x] Spectrum의 그룹·레이블·순서가 `classification.era`에서 파생되고 고정 카테고리 시대 축이 제거된다.
- [x] UI가 결과 수, 활성 조건, 제거/전체 초기화, 빈 상태를 제공하고 모든 입력에 접근 가능한 이름이 있다.
- [x] URL이 검색·카테고리·facet·정렬·뷰·북마크 조건을 안정적으로 직렬화하고 initial load/reload/popstate에서 복원한다.
- [x] 기본값과 invalid URL은 예외 없이 정규화되며 검색어는 120자로 제한된다.
- [x] 320~1440px에서 가로 overflow가 없고 모바일 filter 조작 대상이 44px 이상이다.
- [x] 기존 Core 36 catalog/preview/theme/export 회귀와 전체 `npm run check`가 통과한다.
- [x] 격리 Crostini Chrome에서 핵심 탐색 시나리오와 console/network/application diagnostics가 실패 0이다.
- [x] `spec.md`, `designs.md`, `README.md`, `CHANGELOG.md`, 결정·감사·인수인계 문서가 실제 상태와 일치한다.
- [x] Wave 2 스타일, 렌더 가상화, Git commit·push·배포는 수행하지 않는다.

### 9.1 완료 증거

- `tests/catalogDiscovery.test.js`: 탐색·URL·상태·마크업·보기 모델 15/15 통과
- `npm run check`: 전체 Node 테스트 121/121, catalog 오류 0/legacy 경고 56, 생성 테마 최신, Vite production build 통과
- 빌드 산출물: JavaScript `354.99 kB` (`98.87 kB` gzip), CSS `167.42 kB` (`32.18 kB` gzip)
- `npm run qa:discovery:chrome`: Google Chrome `151.0.7922.173`, 사용자 시나리오 9개, 320/375/414/768/1024/1440px 6개 폭, 세 보기, 88개 입력의 접근 가능한 이름과 44px target, reduced-motion, console/network/application 진단 실패 0
- 증거 위치: `.antigravity/archive/catalog-discovery-chrome-qa/report.json` 및 대표 320px/1440px 스크린샷

## 10. Open Questions

없음. 모듈 범위와 순서는 승인된 `CAPABILITY_MAP.md` 및 사용자의 2026-08-30 진행 승인으로 확정했다. 구현 중 기존 동작과 승인 사양이 충돌하면 이 문서를 먼저 갱신한다.
