# Spec: `render-scalability`

**Initiative:** `scalable-style-library`

**Module ID:** `render-scalability`

**Status:** 구현·검증 완료 (`COMPLETE`)

**승인 근거:** 2026-08-30 사용자의 순차 구현 지시와 후속 “승인”

**완료일:** 2026-08-31 (Asia/Seoul)

**Catalog baseline:** Core 36 (`legacy` 24 + `ready` 12)

**Capacity proof:** synthetic 60 / 120 (실제 Wave 2 콘텐츠 아님)

---

## 1. Objective

현재 Core 36의 화면·저장 ID·탐색·프리뷰 계약을 보존하면서 장기 목표인 120종에서도 초기 로드, 갤러리, 상세 스타일 선택, 스플릿 비교가 스타일 수에 비례해 무거워지지 않게 한다. 모든 정규 스타일은 검색·선택할 수 있어야 하지만, 고비용 시각 DOM과 전체 component renderer 코드는 실제로 필요한 순간에만 만든다.

이 모듈은 스타일 콘텐츠를 추가하는 단계가 아니다. 실제 Core 36과 동일한 renderer/thumbnail 문법을 재사용한 synthetic 60/120 모델로 용량을 증명하고, 그 결과를 Crostini Linux Google Chrome에서 반복 가능한 수치와 화면으로 보존한다.

### 1.1 승인된 가정

1. Core 36과 8개 상위 카테고리, 정규 ID, URL 탐색 계약, Desktop/Mobile 동작은 변경하지 않는다.
2. 60/120 검증 데이터는 런타임 QA에서만 생성하며 catalog, 문서의 실제 스타일 수, 사용자 선택 목록에 넣지 않는다.
3. 먼저 기준선을 측정하고 병목과 직접 연결된 제한 렌더링·지연 import만 구현한다.
4. 새 dependency, 서버, 원격 asset, 기본 Chrome profile, Wave 2 스타일을 추가하지 않는다.
5. 갤러리 페이지는 공유 가능한 탐색 조건이 아니라 일시적 표현 상태이므로 URL에 기록하지 않는다. 검색·필터·정렬·보기 결과가 바뀌면 첫 페이지로 돌아간다.

## 2. Measured Baseline

2026-08-30 `/usr/bin/google-chrome` 151.0.7922.173, 격리 profile, Vite production build에서 측정했다.

| 항목 | Core 36 기준선 |
| --- | ---: |
| DOMContentLoaded / load | 388.7ms / 607.6ms |
| FCP / LCP | 508ms / 508ms |
| 전체 document nodes | 3,046 |
| Grid / Bento 전환 중앙값 | 50.46ms / 65.65ms |
| 검색 / Split 열기 중앙값 | 42.55ms / 57.00ms |
| Grid 결과 DOM | 36 cards, 36 thumbnails, 1,048 nodes |
| Detail 상태 | 72 thumbnails, 1,549 nodes |
| Split 상태 | 108 thumbnails, 1,618 nodes |
| Vite JS / CSS | 354.99kB / 167.42kB |
| Vite JS gzip / CSS gzip | 98.87kB / 32.18kB |

기준선은 현재 36종에서는 양호하다. 그러나 상세 칩은 전체 스타일 수만큼, Split 시각 선택기는 두 슬롯 각각 전체 스타일 수만큼 썸네일을 생성한다. 또한 `src/main.js`의 정적 import 경로가 상세 화면과 component renderer를 초기 JavaScript에 포함한다. 이 두 항목을 확장 병목으로 고정한다.

## 3. Functional Contract

### 3.1 Bounded gallery window

- 한 번에 생성하는 시각 결과 카드는 최대 36개다.
- 결과가 36개를 넘으면 이전·다음 버튼, 현재 범위와 전체 수를 제공한다.
- 페이지 제어는 native button과 `aria-label`을 사용하고 현재 범위는 `aria-live="polite"`로 알린다.
- Grid/Bento/Spectrum은 같은 canonical 결과 순서를 36개 창으로 자른 뒤 각 보기 문법으로 표현한다.
- 모든 결과는 페이지 이동으로 도달할 수 있어야 하며, 첫/마지막 페이지 버튼의 disabled 상태가 정확해야 한다.
- Core 36 이하에서는 페이지 제어를 만들지 않아 현재 시각 구성을 보존한다.

### 3.2 Bounded detail style selector

- 상세의 스타일 칩은 현재 상위 카테고리만 표시하고 한 번에 최대 24개를 만든다.
- 상위 카테고리 선택 시 해당 카테고리의 첫 스타일을 활성화하는 기존 계약을 유지한다.
- 한 카테고리에 24개를 초과하면 검색으로 모든 스타일에 도달할 수 있게 한다.
- 현재 활성 스타일은 검색 결과와 무관하게 선택 상태를 확인할 수 있게 고정 표시한다.
- 칩 교체는 상세 프리뷰 전체를 다시 만들지 않고 선택기 내부만 갱신한다.

### 3.3 Bounded Split picker

- 각 Split 슬롯의 native `<select>`는 전체 정규 스타일을 제공한다.
- 시각 썸네일 목록은 슬롯당 최대 12개, 두 슬롯 합계 최대 24개다.
- 슬롯마다 한국어·영어 이름, ID·alias, category를 찾는 검색 입력을 제공한다.
- 현재 선택은 검색과 무관하게 목록에 고정 표시하고, 검색 결과 수와 고정 상태를 텍스트로 알린다.
- 검색 입력은 app state나 URL을 바꾸지 않고 해당 picker만 다시 그린다.
- 선택 변경은 두 실제 프리뷰와 선택 상태를 동기화하고 기존 theme swap·Desktop/Mobile 계약을 보존한다.

### 3.4 Lazy preview loading

- 초기 경로는 catalog metadata, discovery, thumbnail, motion descriptor만 정적으로 불러온다.
- component renderer와 상세/Split 화면은 최초 사용 시 literal `import()`로 불러온다.
- Peek와 확정 시트는 실제 전체 component preview가 필요한 순간에 같은 지연 loader를 재사용한다.
- 여러 호출은 같은 Promise와 브라우저 module cache를 재사용한다.
- 로딩 중에는 `aria-busy` 상태, 실패 시에는 설명과 재시도 동작을 제공한다. 기존 화면을 빈 상태로 두거나 다른 스타일로 fallback하지 않는다.
- `src/preview/index.js`의 기존 동기 공개 API와 validation/test 계약은 호환 목적으로 유지한다.

### 3.5 Motion lifecycle

- 썸네일 motion은 공유 `IntersectionObserver` 정책으로 viewport 교차 상태만 갱신한다.
- DOM 교체·component unmount 때 observer를 반드시 해제한다.
- offscreen과 `prefers-reduced-motion: reduce`에서는 animation이 실행되지 않는다.
- 페이지 이동 뒤 이전 페이지 node가 관찰 대상에 남지 않는다.

## 4. Pure Interfaces

`src/scalability/renderWindow.js`는 DOM과 app state를 모르는 다음 불변 계약을 제공한다.

```js
createRenderWindow(items, { page, pageSize })
createBoundedPicker(items, { query, selectedId, limit, getSearchText })
RENDER_SCALABILITY_BUDGETS
```

- invalid page/size/limit/query는 예외 없이 정규 기본값으로 제한한다.
- 입력 배열과 item을 변경하지 않는다.
- window 결과는 `items`, `start`, `end`, `total`, `page`, `pageCount`, `canPrevious`, `canNext`를 제공한다.
- picker 결과는 `items`, `matchCount`, `selectedPinned`, `query`를 제공하고 중복 ID를 만들지 않는다.
- `selectedId`가 존재하면 제한 개수 안에서 항상 한 번 포함한다.

## 5. Performance Budgets

### 5.1 Structural budgets

| Budget | Limit |
| --- | ---: |
| Gallery visual cards / thumbnails | 36 / 36 |
| Detail visual style chips | 24 |
| Split visual thumbnails | 12 per slot, 24 total |
| Detached observed thumbnail nodes after rerender | 0 |
| Initial synchronous JS gzip | ≤ 88.98kB (98.87kB 대비 10% 이상 감축) |
| Initial CSS gzip | ≤ 33.00kB |

초기 동기 JS는 `dist/index.html`이 정적으로 참조하는 module script와 modulepreload의 gzip 합계로 정의한다. 비동기 chunk는 별도로 기록하며 숨기지 않는다.

### 5.2 Runtime budgets

- Crostini Chrome synthetic 120에서 보기 전환, 검색, 페이지 이동, picker 검색, Detail/Split 열기의 각 5회 표본 중앙값은 120ms 이하, 개별 최댓값은 200ms 이하다.
- local production build의 LCP는 1,000ms 이하를 목표로 하며 공식 “good” 외곽선인 2,500ms를 넘으면 실패다.
- CLS는 0.1 이하로 유지한다.
- synthetic 60과 120에서 card/picker DOM 개수는 위 구조 예산과 동일해야 한다.
- console exception, failed network request, unhandled promise rejection, accessibility issue는 0이어야 한다.

공식 Core Web Vitals의 good 기준은 LCP ≤2.5s, INP ≤200ms, CLS ≤0.1이며 75th percentile로 평가한다. 이번 5회 local lab 표본은 현장 INP를 대체하지 않고 회귀 차단용 예산이다.

## 6. Tech Stack and Sources

- Vanilla HTML5 + CSS3 + ES modules
- Vite `6.4.3`
- Node built-in test runner
- Crostini `/usr/bin/google-chrome`, 임시 profile + CDP
- 새 dependency 없음

구현 근거:

- MDN `import()` — 정적 import는 load 시 평가되고 dynamic import는 필요할 때 Promise로 module namespace를 불러온다: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import#description
- Vite dynamic import — literal/상대 경로 import를 production chunk로 분리하고 async dependency preload를 최적화한다: https://vite.dev/guide/features.html#dynamic-import
- MDN `IntersectionObserver` — viewport 교차를 비동기로 관찰하고 `disconnect()`로 수명을 종료한다: https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver
- web.dev Core Web Vitals thresholds — LCP 2.5s, INP 200ms, CLS 0.1의 good 기준: https://web.dev/articles/defining-core-web-vitals-thresholds

## 7. Commands

```bash
npm test -- tests/renderScalability.test.js
npm test -- tests/previewIntegration.test.js tests/previewRegistry.test.js
npm run build
npm run qa:scalability:chrome
npm run check
```

## 8. Out of Scope

- Wave 2 스타일 및 실제 60/120 catalog 데이터
- 무한 스크롤, canvas 재작성, framework 도입
- runtime plugin, remote/user HTML, 원격 code
- CSS pack 저작 자동화와 실제 팩 분할(`style-pack-authoring` 범위)
- Git commit/push/tag, 배포

## 9. Acceptance Criteria

1. synthetic 60/120에서 모든 결과가 페이지·검색·select로 도달한다.
2. gallery/detail/split 시각 DOM이 구조 예산을 넘지 않는다.
3. component renderer와 Detail/Split이 초기 동기 chunk에서 분리된다.
4. Core 36의 검색·필터·세 보기·Detail·Split·Peek·선택·Desktop/Mobile·export가 회귀하지 않는다.
5. loading/error/retry, keyboard, focus, live status, 320/768/1024/1440px 반응형이 검증된다.
6. offscreen/reduced-motion/observer cleanup이 자동·Chrome 검사에서 통과한다.
7. 초기 bundle과 interaction이 예산을 통과하고 before/after 결과가 archive에 보존된다.
8. master spec, designs, ADR, README, CHANGELOG, capability, 감사·인수인계 문서가 실제 결과와 동기화된다.

## 10. Completion Evidence

2026-08-31(한국 시간) Crostini의 `/usr/bin/google-chrome` `151.0.7922.173`을 격리 profile로 실행한 최종 결과다. 실제 catalog는 Core 36을 유지했고 60/120은 QA 전용 synthetic fixture로만 검증했다.

| 항목 | 최종 결과 | 예산 |
| --- | ---: | ---: |
| 초기 동기 JS gzip | 62.78kB | ≤ 88.98kB |
| 초기 CSS gzip | 32.86kB | ≤ 33.00kB |
| DCL / load / FCP / LCP | 390 / 423.5 / 432 / 516ms | LCP hard ≤ 2,500ms |
| CLS | 0 | ≤ 0.1 |
| Core 36 초기 DOM | 36 thumbnails, 488 nodes | 36 thumbnails |
| synthetic 120 보기 전환 | median 54.2ms, max 81.0ms | median ≤ 120ms, max ≤ 200ms |
| synthetic 120 페이지 이동 | median 36.2ms, max 43.1ms | median ≤ 120ms, max ≤ 200ms |
| synthetic 120 검색 / picker 검색 | median 33.3 / 33.6ms, max 34.3 / 45.3ms | median ≤ 120ms, max ≤ 200ms |

- Grid/Bento/Spectrum은 synthetic 60의 2페이지와 120의 4페이지에서 모든 ID에 정확히 한 번 도달했고, 첫 페이지의 card/thumbnail은 항상 36개 이하였다.
- Detail은 최대 24칩과 category 검색, Split은 슬롯당 최대 12개 썸네일과 전체 60/120개 native option을 유지했다. 선택 고정, focus, polite live status가 통과했다.
- 페이지 교체 뒤 detached observer와 cleanup 뒤 observed node는 모두 0이었다. reduced-motion에서 실행 중인 thumbnail animation도 0이었다.
- 초기 경로는 Detail/component renderer를 요청하지 않았다. 강제로 첫 component chunk 요청을 실패시킨 뒤 오류·재시도 UI를 거쳐 별도 retry entry로 정상 복구했다.
- Desktop/Mobile은 같은 상세 DOM을 보존하면서 최종 실측에서 preview unit 폭이 각각 721px/368px로 분리됐다.
- 초기 UI는 정상 레이아웃 안에서 `visibility:hidden`으로 구성하고 `document.fonts.ready` 뒤 노출한다. 이 경계는 원격 웹 폰트 교체가 첫 화면을 재배치하던 CLS를 `0`으로 만들며, 폰트 요청 실패 시 시스템 폴백으로 계속 표시한다.
- 320/768/1024/1440px 가로 overflow와 이름 없는 검사 대상 control, console error, page exception, same-origin network/HTTP failure, 접근성 issue는 모두 0이었다.
- 재현 명령은 `npm run qa:scalability:chrome`, 정량 보고서와 화면은 `.antigravity/archive/render-scalability-chrome-qa/`에 보존한다.

CSS 예산 잔여 폭은 144 bytes뿐이다. 다음 `style-pack-authoring`은 새 팩 CSS를 초기 stylesheet에 계속 합치기 전에 pack별 CSS 전달 경계 또는 예산 조정을 명시적으로 검토해야 한다.
