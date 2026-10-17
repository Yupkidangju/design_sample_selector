# Lessons Learned

## 2026-08-30 — Wave 0 `catalog-validation`

**근거:** `SPEC-catalog-validation.md`, `tests/catalogValidation.test.js`, `audit_roadmap.md`, Crostini Google Chrome 151 회귀 결과

- 기존 데이터 품질 부채를 빌드 통과를 위해 숨기면 이후 팩 저작 기준이 무너진다. 구조·참조 오류는 기본 빌드에서 차단하고, 24개 legacy 레코드의 출처·접근성 부채는 코드별 경고 기준선으로 공개하는 방식이 호환성과 가시성을 함께 지켰다.
- CSS 기본 문법 검증에서 `Number.parseFloat()`만 사용하면 `255oops` 같은 부분 일치 문자열을 정상 숫자로 오판한다. 지원 범위를 좁게 선언하고 문자열 전체가 숫자 문법과 일치하는지 먼저 검사해야 한다.
- 현재 renderer·thumbnail·motion 목록은 영구 레지스트리가 아니라 검증 입력용 임시 경계다. 후속 `preview-registry`에서는 진단 계약을 유지하고 인벤토리 공급자만 교체해야 중복 원천이 늘어나지 않는다.
- 반응형 브라우저 검증은 모든 아키타입에 하나의 고정 Desktop 폭을 가정하면 안 된다. 콘텐츠 고유 폭과 스크롤바 때문에 실제 가시 폭은 달라질 수 있으므로, Mobile `max-width: 380px` 적용 여부와 Desktop/Mobile 실제 폭 분리를 함께 확인하는 편이 정확하다.
- Node 전용 검증 모듈은 앱 import 그래프와 수명주기를 분리해야 한다. `prebuild`에서만 연결하면 데이터 오류는 차단하면서 런타임 번들 크기와 사용자 상태를 그대로 유지할 수 있다.

다음 모듈은 이 교훈을 전제로 진행하되, `theme-generation`, `preview-registry`, `catalog-discovery`의 구체적인 선택은 각각의 승인 사양에서 다시 검토한다.

## 2026-08-30 — Wave 0 `theme-generation`

**근거:** `SPEC-theme-generation.md`, `tests/themeGeneration.test.js`, `audit_roadmap.md`, Crostini Google Chrome 151 computed-style 회귀 결과

- 생성 파일의 byte diff만으로 시각 호환성을 판단하면 주석·공백 변화에 흔들린다. selector와 선언 순서의 의미 해시를 고정하고 실제 Chrome computed style을 함께 비교하니 포맷 변경과 렌더 회귀를 분리할 수 있었다.
- 런타임 기준 효과와 사용자 조절 기본값은 이름이 비슷해도 같은 계약이 아니다. `bento-grid`의 컨테이너 blur `16px`와 tweak `12px`처럼 기존 차이를 먼저 계측한 뒤 `themeEffects`와 `defaultTweaks`를 분리해야 한다.
- 일반 빌드가 생성 파일을 자동 덮어쓰면 리뷰 가능한 원천 diff가 흐려진다. 명시적 write 명령과 read-only prebuild 검사를 분리하면 stale 상태는 차단하면서 사용자 작업 트리는 보존된다.
- 개발 서버는 CSS `@import`를 소유 스타일시트 응답에 결합할 수 있다. 브라우저 검증은 특정 하위 파일 URL 요청을 강제하기보다 소유 스타일시트 200, selector의 computed value, 프로덕션 CSS 산출물과 런타임 주입 부재를 함께 확인해야 안정적이다.
- 반응형 전환 직후 클래스만 기다리면 rAF로 갱신되는 인스펙터 텍스트보다 먼저 검증할 수 있다. 클래스와 최종 사용자 출력이 모두 바뀌는 조건을 기다려야 실제 동기화 계약을 검사한다.
- 984개 전체 내보내기 조합의 결정론적 해시는 수동 map 제거처럼 큰 내부 변경에서도 기존 사용자 산출물을 보존하는 강한 안전망이었다. 새 스타일은 기존 24종 부분 집합 해시를 그대로 유지해야 한다.

다음 권장 모듈은 `preview-registry`다. 새 스타일 저작 전에 분산된 renderer/thumbnail/motion dispatch를 검증 가능한 계약으로 바꾸는 것이 우선이며, 실제 착수는 별도 사양과 사용자 검토에서 확정한다.

## 2026-08-30 — Wave 0 `preview-registry`

**근거:** `SPEC-preview-registry.md`, preview/runtime/integration 테스트, `audit_roadmap.md`, Crostini Google Chrome 151 런타임·시각 행렬

- 1,400줄 규모 renderer를 옮길 때는 구조 정리보다 정상 출력의 길이 프레이밍 SHA-256을 먼저 고정하는 편이 안전했다. 120개 호환 출력과 96개 component 출력의 해시를 먼저 만든 덕분에 소유 파일 이동과 시각 변경을 분리할 수 있었다.
- Node DOM fixture만으로는 화면 상태 전체를 증명할 수 없다. 실제 Chrome 행렬이 Web 탭 내용은 바뀌지만 버튼의 `active`·`aria-selected`가 Hero에 남는 72개 상태 회귀를 발견했고, RED 회귀 테스트를 추가한 뒤 96개 조합을 다시 확인했다.
- 브라우저 viewport와 preview sandbox device는 다른 상태 축이다. 320/768/1024/1440px browser breakpoint와 24 × 8 × Desktop/Mobile 384개 sandbox 상태를 분리해 검사해야 “Mobile을 눌러도 Desktop처럼 보인다”는 원래 문제를 정확히 판정할 수 있었다.
- renderer·thumbnail·motion을 한 객체에 억지로 합치기보다 서로 독립된 정규 ID를 유지하고 inventory만 합성하는 구조가 기존 CSS presentation ID를 보존하면서 누락을 차단했다. renderer alias인 `brutalism`은 실행 경계에서만 허용하고 inventory에서 제외하는 것도 같은 원칙이다.
- motion 이름을 구현된 애니메이션으로 간주하면 시각 품질을 과장한다. 현재 24개 descriptor 중 `sparkline`, `vhs-shift`, `ken-burns`, `tile-stagger` 4개는 `metadata-only`, `hard-punch`, `hard-press`, `inset-press` 3개는 `interaction-local`로 남겼다. 새 스타일 팩은 이 부채를 숨기지 말고 실제 CSS·markup 근거와 reduced-motion 동작을 함께 검토해야 한다.
- 최종 감사에서는 감사용 임시 Chrome과 사용자가 평소 실행 중인 Default-profile Chrome을 구분해야 한다. 포트·명령행·임시 경로를 함께 확인하면 사용자 브라우저를 종료하지 않고도 격리 profile과 Vite teardown을 증명할 수 있다.

다음 권장 모듈은 `catalog-discovery`다. 스타일 수를 늘리기 전에 facet·검색·정렬의 사용자 탐색 계약을 고정하고, 이후 `render-scalability`에서 Crostini 성능 예산을 측정한 뒤 `style-pack-authoring`과 실제 `catalog-expansion`으로 넘어간다.

## 2026-08-30 — Wave 1 `catalog-expansion` (24→36)

**근거:** `SPEC-catalog-expansion.md`, Wave 1 catalog/preview/theme 테스트, `.antigravity/archive/wave1-chrome-qa/report.json`, 대표 시각 증거 5장

- 신규 스타일을 기존 대형 definition 파일 끝에 직접 붙이지 않고 데이터·renderer·thumbnail·motion·CSS를 Wave 단위로 분리하니 기존 24종의 해시 호환과 신규 12종의 시각 변경을 독립적으로 검토할 수 있었다. 다음 팩도 같은 추가형 경계를 유지하되 정식 템플릿은 `style-pack-authoring`에서 고정해야 한다.
- HTML 문자열이 Node 테스트에서 유효해 보여도 브라우저 parser는 중첩 interactive content를 재구성한다. Flat Design thumbnail 안의 장식 `button` 하나가 상위 Detail/Split 버튼을 조기에 닫아 selector를 끊었다. 상위 control에 삽입되는 recipe는 모든 interactive tag를 금지하는 구조 계약이 필요하다.
- “Desktop/Mobile 버튼 상태가 바뀐다”만으로 반응형 동작을 증명할 수 없다. 활성 버튼, 실제 preview root 폭, grid/레이아웃 형태를 함께 측정해야 원래 사용자 문제처럼 두 모드가 같은 화면으로 보이는 회귀를 잡을 수 있다.
- 색·토큰·DOM hash만으로 디자인 시안의 구별성을 보장할 수 없다. 실제 스크린샷에서 Liquid Glass의 backplate·mobile stacking과 Bauhaus/Swiss Split을 육안 대조한 과정이 구조적 motif가 살아 있는지 확인하는 최종 게이트였다.
- DTCG 같은 구조화 export에서는 CSS의 편의 문자열을 그대로 전달하면 안 된다. `box-shadow: none`도 선언된 `$type: shadow`와 맞는 zero shadow 객체로 정규화해야 모든 테마가 동일한 소비 계약을 지킨다.
- 실제 Chrome QA를 재현 가능한 script와 project-local report로 남기면 브라우저 증거를 일회성 수동 확인에서 반복 가능한 품질 게이트로 바꿀 수 있다. 단, 60종부터는 전체 DOM·모션 비용이 달라지므로 현재 행렬을 그대로 확장하기 전에 `render-scalability` 예산을 먼저 정해야 한다.

당시 다음 단계는 Wave 2 콘텐츠 추가가 아니라 `catalog-discovery` → `render-scalability` → `style-pack-authoring`으로 정했다. 이후 기반 게이트를 완료했고 2026-08-31 actual 120 일괄 확장에서 Core 36을 호환 subset으로 유지했다.

## 2026-08-30 — `catalog-discovery`

**근거:** `SPEC-catalog-discovery.md`, `tests/catalogDiscovery.test.js`, `.antigravity/archive/catalog-discovery-chrome-qa/report.json`, 320px/1440px 대표 화면

- 세 보기의 동등성은 “DOM 순서까지 동일”이 아니라 “canonical 결과 집합이 동일”이라는 계약이어야 한다. Grid의 category grouping과 Spectrum의 era grouping은 의도적으로 전역 정렬을 재배치하므로, 브라우저 QA도 ID 집합과 보기별 순서 규칙을 나누어 검증해야 한다.
- native `details/summary`를 flex layout으로 꾸미면 브라우저 기본 disclosure marker가 사라질 수 있다. 접근 가능한 native 상태는 유지하되 펼침/접힘을 색이 아닌 명시적 표식으로도 보여 주는 회귀 계약이 필요하다.
- 검색 caret을 유지하는 header patch와 10개 facet panel을 같은 render 수명주기에 결합하지 않으니 입력 포커스, 열린 disclosure와 keyboard state를 안정적으로 보존할 수 있었다.
- URL 외부 입력은 순수 parser에서 허용 목록·중복·길이를 먼저 정규화하고 browser adapter는 `replaceState`/`popstate` side effect만 소유하게 하면 round trip과 history loop를 Node에서 독립 검증할 수 있다.
- 기본 Chrome profile과 분리된 raw CDP 하네스도 DOM·접근성·computed style·키보드·network diagnostics의 재현 가능한 증거를 만들 수 있다. 다만 테스트 하네스 자체의 기대값도 제품의 보기별 계약과 대조해야 하며, 실패를 곧바로 제품 결함으로 단정하면 안 된다.
- 현재 Core 36에서는 공통 질의를 상태 status와 gallery model에서 각각 계산해도 문제가 없지만, 60~120종에서는 DOM·썸네일·모션 비용과 함께 계측해야 한다. 추측으로 memoization이나 virtualization을 선행하지 않고 다음 `render-scalability`에서 예산과 병목을 먼저 고정한다.

이 마일스톤 직후 권장 모듈은 `render-scalability`였다. 이후 해당 게이트와 actual 120 확장을 완료했다.

## 2026-08-31 — `render-scalability`

**근거:** `SPEC-render-scalability.md`, `tests/renderScalability.test.js`, `tests/initialBundleAnalysis.test.js`, `.antigravity/archive/render-scalability-chrome-qa/report.json`

- 전체 canonical 결과를 잃지 않으면서 시각 DOM만 제한하는 것이 핵심이었다. Gallery의 local page, Detail category 검색, Split의 전체 native select + 제한 visual picker를 분리하니 120종 모두에 도달하면서 thumbnail 상한을 유지할 수 있었다.
- dynamic import의 Promise cache를 지우는 것만으로는 브라우저 재시도가 보장되지 않는다. 실패한 module URL은 module map에 남으므로 같은 implementation을 가리키는 별도 retry entry URL이 필요했고, CDP 네트워크 실패 주입으로 실제 복구를 검증해야 했다.
- 코드 분할은 파일 이름이나 chunk 개수로 판단하지 말고 `dist/index.html`이 정적으로 참조하는 module/modulepreload의 gzip 합계를 계산해야 한다. 이 기준으로 초기 JS가 `98.87kB`에서 `62.78kB` gzip으로 줄었음을 재현 가능하게 증명했다.
- `IntersectionObserver`를 공유하는 것만으로는 누적을 막지 못한다. 각 render가 cleanup을 반환하고 다음 render 전에 실행되도록 수명을 소유해야 페이지 전환 뒤 detached target과 teardown 후 target이 모두 0이 된다.
- 초기 앱을 detached 상태에서 완성해 한 번에 삽입해도 폰트가 연결 후 로드되면 큰 layout shift가 남는다. `visibility:hidden`은 정상 flow와 font matching을 유지하므로 `document.fonts.ready`까지 기다린 뒤 노출할 수 있고, 최종 CLS를 `0`으로 만들었다. `display:none`은 공간과 font load를 제거해 이 목적에 맞지 않았다.
- 사용자 체감 Desktop/Mobile은 버튼 class가 아니라 실제 preview root 폭으로 검증해야 한다. 이번 게이트에서도 같은 DOM의 mobile/desktop unit 폭 `368/721px`를 함께 기록해 원래 회귀를 다시 차단했다.
- synthetic 120의 DOM·interaction은 통과했지만 CSS 초기 예산은 144 bytes만 남았다. 다음 `style-pack-authoring`에서는 신규 팩 CSS를 초기 bundle에 무조건 합치는 관례를 먼저 재검토해야 한다.

이 게이트의 CSS 전달 교훈은 actual 120에서 신규 theme/preview CSS를 component entry 뒤로 분리하는 결정에 직접 적용됐다.

## 2026-08-31 — `catalog-expansion-120`

**근거:** `SPEC-catalog-expansion-120.md`, `tests/catalogExpansion120.test.js`, 전체 152개 테스트, `.antigravity/archive/catalog120-chrome-qa/report.json`

- “120개 추가”처럼 누적/증분이 혼동될 수 있는 수량은 구현 전에 actual total과 add count를 함께 고정해야 한다. 이번에는 기존 대화의 목표대로 총 120, 신규 84로 명시해 156종으로 잘못 확장하는 일을 막았다.
- 신규 스타일은 category별 UI와 페이지에서 기존 스타일 사이에 조립되므로 화면 배열의 37번째부터가 신규라는 가정은 성립하지 않는다. QA와 마이그레이션은 위치가 아니라 canonical ID 집합 또는 pack membership으로 판정해야 한다.
- CSS hard budget이 144 bytes만 남은 상태에서도 inline thumbnail과 async component theme/presentation을 분리하면 actual 120을 초기 CSS 증가 없이 제공할 수 있었다. 코드 분할은 산출물 그래프와 최초/상세 네트워크 요청을 둘 다 확인해야 한다.
- 21개 문법 factory는 84종의 출처·접근성·토큰 누락을 막지만 시각 고유성을 자동 보장하지 않는다. 명시 blueprint, 84/84 mobile grid 변화, 대표 screenshot 육안 검토를 함께 두어 factory 편의성과 시안 차별성을 균형 잡았다.
- 숨겨진 브라우저 행렬은 구조·CSS를 빠르게 1,920상태 검사할 수 있지만 실제 Detail/Split/Peek/Dock 흐름을 대신하지 못한다. 전체 생성 행렬과 실제 사용자 경로 표본을 같은 게이트에 포함해야 한다.
- PerformanceObserver의 CLS를 모든 QA 조작 뒤 읽으면 테스트가 의도적으로 만든 페이지·모달 이동까지 누적된다. Core Web Vitals는 첫 사용자 조작 전에 동결하고, 이후 interaction 비용은 별도 지표로 측정해야 한다.
- 기존 QA에서 “총 catalog 36”과 “한 페이지 DOM 36”을 같은 상수로 취급한 문제가 드러났다. 총량·현재 결과·visible window를 별도 필드로 검증하면 확장 후에도 기존 bounded UI 계약을 약화하지 않는다.

다음 고정 수량의 미구현 Wave는 없다. 후속은 legacy 24의 실제 출처·접근성 부채 정리, 사용자 피드백 기반 개별 시안 심화 또는 120종 이후 새 사양 중 하나로 시작한다.

## 2026-08-31 — Multi Audit 9 remediation

**근거:** `docs/multi_audit/9/final_audit_report_9.md`, `docs/multi_audit/9/re_audit_evidence_9.md`, `tests/auditRemediation9.test.js`, `.antigravity/archive/audit9/rework-sidebar-final-verified-{1,2,3}/report.json`

- “DOM을 보존한다”와 “선택마다 distinct renderer를 보여 준다”는 같은 구현 계약이 아니다. 바깥 viewport identity와 사용자 state만 보존하고 inner renderer는 새 스타일에서 재생성해야 renderer·motion·Inspector가 한 canonical ID를 가리킨다.
- state snapshot에 DOM-derived markup을 넣으면 이전 스타일 콘텐츠가 데이터처럼 새 renderer에 이식된다. Dashboard의 row HTML처럼 style-owned 값은 제외하고 filter/sort 같은 사용자 의도만 새 markup에 재적용해야 한다.
- breadth 행렬이 1,920상태를 통과해도 실제 A→B event transition, nested dialog Escape, detached opener와 computed theme는 놓칠 수 있다. 생성 행렬과 stateful 사용자 흐름을 같은 Chrome gate 안에서 별도 assertion으로 유지해야 한다.
- flex scroll container는 자식의 기본 `flex-shrink: 1` 때문에 overflow 없이도 콘텐츠를 접어 버릴 수 있다. selector와 font-size만 보지 말고 제목·설명의 실제 bounding box가 카드 안에 보이는지 함께 검사해야 한다.
- timer cleanup 배열에 이미 완료된 short timeout의 closure를 계속 쌓으면 teardown 시점에는 누수가 아니어도 장기 세션 메모리가 커진다. 완료 시 owner set에서 스스로 제거하고 동일 목적의 chat reply·checkout은 coalescing/WeakMap으로 한 개만 소유하게 하는 편이 명확하다.
- Crostini frame settlement는 scheduler 변동을 포함한다. CDP round-trip뿐 아니라 DOM 정착 뒤 2-frame wall time도 제품 처리 hard metric과 분리하고 `processingMs`·`presentation`·`endToEndMs`·Long Task를 함께 기록해야 한다. 기준값을 낮추지 않은 동일 조건 직렬 3회로 판정한다.
- 배포 플랫폼을 모르는 상태에서 meta CSP를 임의 추가하면 현재 inline style·dynamic CSS·Google Fonts 계약을 오히려 깨뜨릴 수 있다. 저장소 범위의 미확정을 솔직히 남기고 실제 response header가 있는 배포 후보에서 별도 종결하는 것이 안전하다.

## 소프트 UI 재점검 (2026-10-18)

- Thumbnail과 실제 preview가 같은 `data-grammar`를 사용하면 속성 selector만으로 시각 규칙을 작성하지 않는다. `.style-thumb`처럼 소유 root까지 한정해야 진행 막대와 도안 layer가 사라지는 충돌을 막는다.
- Container query의 root는 자신의 크기를 질의할 수 없다. 좁은 desktop·split을 mobile class와 별개로 검증하고, flex 안의 size containment에는 명시적인 폭을 둔다.
- 다국어 레이아웃 검사에는 copy snapshot과 localized style record를 함께 전달한다. 열린 모달의 마지막 locale과 내부 카탈로그 projection의 마지막 locale은 별개 상태로 추적해야 닫힌 상태의 A→B→A 전환에도 언어가 섞이지 않는다.
- 지연 CSS를 분리하면 빌드 manifest와 실패 복구 검증의 기대 파일 목록도 함께 갱신한다. 단순 파일 수 조건을 느슨하게 만들지 않고 새 상세 파일 각각의 차단·재시도를 실제 Chrome에서 검사한다.
- Root의 scrollWidth가 같아도 글자나 하위 구도가 잘릴 수 있다. 실제 텍스트 range·clipping ancestor, CJK 행간과 screenshot을 함께 확인한다.
