# Sub Audit Report

## 1. Audit Metadata

- **Audit Turn:** 11
- **Perspective:** 테마/실시간 튜너 계약 및 UI·i18n
- **User Goal:** 테마 전환 중 `999px` 반지름과 전 화면 둥글기 전파를 점검하고, 상단 언어 메뉴와 한국어·영어·일본어·중국어 간체·번체 5개 locale을 UI·접근성·Live CSS/HTML/Markdown/Design Tokens에 일관되게 적용한다.
- **Audit Basis:** Standard-backed read-only audit
- **Standard Path:** `/home/eunho1/Projects/web/design_sample_selector/AI_AUDIT_DOC_STANDARD.md`
- **Report Contract:** `/home/eunho1/.codex/skills/multi-audit/references/report-contract.md`
- **Mutation Boundary:** 제품 소스·테스트·설정·제품 문서는 수정하지 않았다. 이 보고서 파일만 생성한다.

## 2. Assigned Scope

- `spec.md`, `designs.md`, `README.md`, `DESIGN_DECISIONS.md`, `CHANGELOG.md`의 튜너·테마·inspector·레이아웃 계약.
- `src/catalog` grammar/defaultTweaks/validation, `src/theme` projection/stylesheet, generated theme CSS.
- `detailView`, inspector/generator, main header, discovery, peek, selection dock, split compare와 관련 CSS.
- 반지름 범위·전파·테마 전환 상태·5 locale의 상태/데이터/렌더링/ARIA/반응형/회귀 테스트 계약.

## 3. Excluded and Uninspected Scope

- 기존 `docs/multi_audit` 보고서 결론, `node_modules`, `.git` 내부 내용은 읽지 않았다.
- 빌드·개발 서버·Chrome/CDP·외부 게시와 실제 번역 품질 검증은 수행하지 않았다. 따라서 computed style 및 실제 CJK bounding box는 다음 재감사 대상이다.
- 생성 CSS는 원천/파생 정합성의 증거로만 읽었고 직접 수정하지 않았다.

## 4. Evidence Examined

- 제품 계약: `spec.md:11-14,45-65,108-140,192-215,292-299`; `designs.md:51-58,136-150,216-220,288-300,356-373`; `README.md:54-76,114-121,178-195`; `DESIGN_DECISIONS.md:169-192,329-347`; `CHANGELOG.md:104-115`.
- 반지름 원천·검증: `src/catalog/packs/expansion/authoring.js:129-141,213-225,313-329,340-388`; `src/catalog/validation/rules.js:42-51,349-365`; `src/state/appState.js:90-118,130-159,254-260`.
- projection/전파: `src/theme/contract.js:3-34`; `src/theme/projection.js:14-30,68-79`; `src/styles/themeTokensExpansion.css:543-605,927-988`; `src/styles/interactive.css:1024-1039,1072-1082,2749-2805`; `index.css:41-53,2049-2076`.
- 전환·inspector: `src/components/detailView.js:394-408,495-537,618-680,682-745,769-805,824-862,1118-1145,1257-1362`; `src/utils/selection.js:24-39`; `src/utils/inspectorState.js:14-43`; `src/utils/designSpecGenerator.js:226-267,273-404,565-610`.
- locale/UI: `src/catalog/contract.js:85,126-143`; `src/catalog/validation/rules.js:306-310,337-344,421-427`; `src/catalog/legacyAdapter.js:9-29,36-61`; `src/components/header.js:22-121,257-289`; `src/components/discoveryMarkup.js:26-110,130-160`; `src/components/peekPreview.js:114-120`; `src/components/selectionDock.js:55-90`; `src/components/stylePickerMarkup.js:36-83,100-140`; `index.html:1-8`.
- CJK/layout evidence: `index.css:6-7,35-39,110-117,180-184,236-242,3627-3640`; `src/styles/audit9-detail.css:149-208`; `src/styles/interactive.css:930-944,2909-2935`.
- Tests: `tests/catalogValidation.test.js:403-429`; `tests/inspectorState.test.js:13-80`; `tests/designSpecGenerator.test.js:131-169`; `tests/themeGeneration.test.js:395-501`.
- Read-only commands and results:
  - `git status --short`: 작업 시작 시 제품 변경 없이 `?? docs/multi_audit/11/`만 표시됐다.
  - `rg -n -i --glob '!docs/multi_audit/**' '(i18n|locale|navigator\.language|document\.documentElement\.lang|zh-CN|zh-TW|일본어|日本語|중국어|언어 메뉴|language)' src index.html tests scripts`: 앱 locale 상태/리소스/메뉴 구현은 찾지 못했고, 정렬용 `toLocale*`, 일본식 스타일 ID와 `lang="ko"`만 확인됐다.
  - `node --test tests/catalogValidation.test.js tests/themeGeneration.test.js tests/inspectorState.test.js tests/designSpecGenerator.test.js`: **47 tests passed, 0 failed**.
  - read-only Node catalog scan: **120 styles 중 8 styles**가 `defaultTweaks.borderRadius > 64`이며 모두 `999`/`999px`이다: `op-art`, `space-age`, `disco-glam`, `seventies-groovy`, `cyber-y2k`, `kawaii-pixel-web`, `scene-core-web`, `mcbling-gloss`.
  - read-only generator probe(`LEGACY_ALL_SUB_DESIGNS`, `op-art`): Markdown은 `Live=999px`, `Default=999px`, `Allowed=0px ~ 64px`; CSS는 `--theme-radius`·`--tweak-radius:999px`; DTCG dimension은 `999px`를 출력했다.
  - `git diff --check -- . ':!docs/multi_audit/**'`: `diff_check=pass`.

## 5. Findings

### A11-IMP-F001 — 스타일 반지름 999px가 0~64px 튜너 기본값으로 투영됨

- **Area:** catalog grammar → `StyleRecord.tokens`/`defaultTweaks` → slider/state/export
- **Severity:** Major
- **Status:** Confirmed
- **Summary:** `optical-stage`와 `chrome-pop` grammar가 의도 불명확한 `999`를 소유하고, 같은 값을 테마 토큰과 전역 `borderRadius` 기본값으로 복사한다. 제품 문서가 고정한 튜너 최대값 `64px`와 직접 충돌한다.
- **Evidence:** `authoring.js:136`의 `optical-stage.radius=999`, `authoring.js:220`의 `chrome-pop.radius=999`; 두 grammar를 사용하는 8개 blueprint는 `dimensional-pop.js:19-22`, `web-millennium.js:19-22`에 있다. `toStyleRecord`가 같은 grammar 값을 `tokens.radius`와 `defaultTweaks.borderRadius`에 각각 대입한다(`authoring.js:361-382`). 파생 CSS도 8개 `[data-theme]`에 `--theme-radius:999px`를 기록한다(`themeTokensExpansion.css:543-605,927-988`). 반면 문서와 UI range는 `spec.md:62`, `designs.md:360-365`, `detailView.js:455-458`에서 `0~64px`이다. `validateTweaks`는 0 이상 유한수만 검사한다(`rules.js:349-365`), state sanitizer도 유한수만 확인한다(`appState.js:254-260`).
- **Expected Basis:** `spec.md:62`와 `designs.md:360-365`의 Border Radius `0~64px` 계약; 테마 의미 토큰의 canonical source는 `StyleRecord.tokens`라는 `spec.md:207-213` 계약. 사용자가 지적한 999가 의도적 pill 토큰인지 전역 튜너 값인지에 대한 결정은 아직 없다.
- **Actual:** 120종 중 8종이 `defaultTweaks.borderRadius=999`이고 `tokens.radius='999px'`이다. detail 초기 markup은 상태 값을 그대로 표시하고 `max="64"` range에 넣는다(`detailView.js:455-459`). reset도 해당 style의 `defaultTweaks`를 그대로 재주입한다(`detailView.js:1118-1126`). 따라서 조절 전·리셋 직후·Markdown/CSS/DTCG export가 999를 재현한다.
- **Impact:** 튜너 control/model/display/export의 단위·범위가 서로 달라진다. 브라우저가 range control을 끝점으로 보정하더라도 숫자 표시와 CSS/산출물은 999를 유지할 수 있어 사용자가 “정상값으로 조절했다”고 인식하기 어렵다. 999의 의미가 pill인지 전역 shell인지 결정되지 않은 상태에서 후속 i18n/export 수정도 잘못된 값을 고착할 위험이 있다.
- **Suggested Action:** 먼저 `999` 의미를 spec/decision에 명시한다. (a) pill 전용 토큰이면 `defaultTweaks.borderRadius`에서 분리하고 승인된 pill selector에만 적용하거나, (b) 전역 튜너 값이면 `0~64`로 정규화한다. 어느 선택이든 catalog validation, state sanitizer, UI range, reset, CSS/Markdown/DTCG generator가 공유하는 단일 `TWEAK_LIMITS`/정규화 계약과 120종 범위 검사를 추가한다. 생성 CSS를 직접 고치지 말고 grammar/원천에서 재생성한다.
- **Re-audit Method:** 120개 `defaultTweaks`와 `tokens.radius`를 전수 검사하고 `0,64,999` fixture를 validation/state/reset/generator에 통과시킨다. 각 선택·리셋 뒤 표시값, input value/aria-valuenow, CSS/MD/JSON 값을 같은 snapshot으로 비교한다.
- **Confidence:** High
- **Notes:** 값 충돌은 확정됐지만 999가 디자인적으로 의도된 pill인지 여부는 **Needs Spec Clarification**이다.

### A11-DBG-F001 — 전역 튜너 반지름이 root와 38개 하위 selector로 강제 전파됨

- **Area:** detail viewport CSS scope; main/detail/split preview
- **Severity:** Major
- **Status:** Confirmed
- **Summary:** live radius가 하나의 shell 값이 아니라 archetype root와 카드·패널·버튼·입력·프레임 등 거의 모든 표면의 `border-radius`로 전파되어, 999 테마에서 “화면 전체가 둥글어짐”을 만든다.
- **Evidence:** `interactive.css:2749-2763`은 viewport fallback과 `.archetype-unit` root에 `--tweak-radius`를 `!important`로 적용한다. 이어지는 `interactive.css:2765-2805`에는 같은 radius를 받는 `.game-hud-header`, `.game-arena-board`, action/button, mobile/shop/blog/dashboard/media/chat 요소가 **38개** 나열된다. 구형/확장 `mockup-unit`에도 `index.css:2049-2076`의 root 및 `button/input/select/*-box/*-card/*-panel/*-btn/*-cell/*-frame` wildcard가 있다. detail markup과 granular update는 viewport에 `--theme-radius`와 `--tweak-radius`를 같은 값으로 inline 설정한다(`detailView.js:394-408,769-780`). 각 core surface 자체도 `--theme-radius`를 사용한다(`interactive.css:1024-1039,1072-1082,1167-1178,1233-1242`).
- **Expected Basis:** `spec.md:209-213`와 `designs.md:146-150`은 스타일 테마 토큰과 선택적 효과/튜너 경계를 구분하고, `designs.md:360-365`는 튜너를 개별 parameter 계약으로 정의한다. radius가 shell, component, pill 중 어느 DOM 범위인지 별도 정의되어 있지 않다.
- **Actual:** 단일 `--tweak-radius`가 root부터 하위 surfaces 전체에 동일 적용되며, `!important`가 style-specific radii를 덮는다. split view는 `detailView.js:1319-1350`에서 두 `data-theme` viewport만 만들고 inline tweak scope가 없어, `999px` theme token이 독립적으로 노출될 수 있다.
- **Impact:** 999뿐 아니라 모든 slider 값이 시각 구조의 서로 다른 계층을 동시에 변형한다. shell만 조절하려는 사용자의 의도와 카드/버튼/입력 결과가 어긋나고, 0/64 끝점도 테마별 곡률·접근 가능한 hit area·split 비교 결과를 훼손할 수 있다.
- **Suggested Action:** spec에 radius 적용 범위와 우선순위를 명시하고 `shell`, `surface/control`, `pill` 같은 별도 변수/selector 계약을 둔다. broad wildcard와 전역 `!important`는 제거하거나 명시된 scope로 제한한다. core 8 archetype와 expansion `mockup-unit` 각각에서 root/card/button/input/meter를 검증하는 computed-style 회귀를 추가하고 split/peek/dock도 포함한다.
- **Re-audit Method:** 정적 selector inventory와 `0/16/64/999` matrix를 만들고, 브라우저 재감사에서 8 archetype × 120 style 대표군의 root/card/button/input computed radius를 비교한다. split/peek/dock에서는 detail tuner 변수가 새지 않는지도 확인한다.
- **Confidence:** High
- **Notes:** “전 화면”이라는 시각 체감은 브라우저 computed style로 최종 확인해야 하지만, 전파 selector와 inline variable 경로는 정적으로 확정된다.

### A11-IMP-F002 — 테마 전환 시 liveTweaks는 항상 reset되지만 reset/preserve 계약이 문서에 없음

- **Area:** theme transition, detail re-entry, archetype transition
- **Severity:** Major
- **Status:** Needs Clarification
- **Summary:** 코드상 style/category/global cycle 전환은 target의 `defaultTweaks`로 `liveTweaks`를 덮어써 사용자 조정을 잃는다. 반면 archetype 전환은 현재 값을 유지한다. 문서는 renderer/local runtime state 보존만 설명하고 튜너 정책은 결정하지 않는다.
- **Evidence:** category tab과 sub-style 전환은 `detailView.js:824-862`에서 `liveTweaks: targetSub.defaultTweaks`를 설정하고, global cycle도 `detailView.js:1184-1215`에서 같은 일을 한다. detail entry도 `selection.js:24-39`에서 선택 style 기본값으로 초기화한다. reset 버튼은 `detailView.js:1118-1126`에서 같은 defaults를 복원한다. 실제 renderer swap은 `detailView.js:618-635`에서 runtime snapshot을 복원한 뒤 전달받은 `state.liveTweaks`를 적용한다. 반대로 archetype rebuild(`detailView.js:585-597`)은 새 HTML에 현재 viewport state를 재사용한다. 문서의 보존 목록은 `designs.md:147-150,334-347`에 있으나 `liveTweaks` reset/preserve 항목은 없다.
- **Expected Basis:** `designs.md:148,334-347`의 state-preserving transition matrix와 `spec.md:52-55,192-196`의 선택/inspector 일관성 계약. 사용자 요청은 “테마 전환 시 tweak reset/preserve 계약”의 명시적 판정을 요구하지만 어느 정책을 원하는지는 미확정이다.
- **Actual:** 테마 선택 직후 999 style이면 999가 재주입되고, 다른 style로 가면 이전 slider override가 사라진다. 같은 modal에서 archetype만 바꾸면 override가 유지된다. split compare는 별도 liveTweaks 상태 없이 theme token을 사용한다(`detailView.js:1319-1350`).
- **Impact:** 사용자는 slider를 조절한 뒤 style/category를 바꾸면 값이 보존될 것으로 예상할 수 있으나 현재는 조용히 reset된다. 반대로 preserve 정책을 기대한 export/snapshot과 현재 preview가 달라질 수 있다. 999 충돌과 결합하면 전환만으로 다시 전 화면 둥글기가 나타난다.
- **Suggested Action:** spec/decision에 style switch, category switch, global keyboard cycle, archetype switch, modal re-entry, explicit reset, split compare별 `reset`/`preserve` 표를 승인한다. preserve라면 style default와 user override를 분리하고 dirty/restore 상태를 둔다. reset이라면 UI에서 reset 시점을 알리고 모든 산출물·접근성 현재값을 동기화한다.
- **Re-audit Method:** 한 세션에서 `style A → radius override → style B → style A`, category jump, archetype switch, close/reopen, split open/close를 순서대로 실행해 `liveTweaks`, slider display, CSS/MD/JSON을 캡처한다. 승인된 matrix를 Node state test와 browser interaction test로 고정한다.
- **Confidence:** High (현재 reset 동작), Medium (제품이 원하는 정책)
- **Notes:** 결함 여부는 정책 승인 전까지 **Needs Spec Clarification**으로 유지한다.

### A11-SPEC-GAP-F001 — 5 locale의 상태·카탈로그·fallback 계약이 없음

- **Area:** i18n data model and application state
- **Severity:** Major
- **Status:** Needs Clarification
- **Summary:** 요청된 `ko`, `en`, `ja`, `zh-CN`, `zh-TW`를 표현하는 locale enum, 저장/감지/fallback, 번역 리소스 소유권이 spec과 코드에 없다. 현재 localized data contract는 사실상 ko/en이다.
- **Evidence:** frozen master state `spec.md:108-140`에 `locale` 필드가 없고, runtime `DEFAULT_STATE`/enum도 `appState.js:90-159`에 locale이 없다. catalog typedef는 `LocalizedText={ko:string,en?:string}`이고 style name/summary/palette도 `catalog/contract.js:85,134-143`에 그 형태만 정의한다. validation은 ko와 선택적 en만 요구한다(`rules.js:306-310,337-344,421-427`). legacy projection은 ko/en을 고정 선택한다(`legacyAdapter.js:9-29,36-61`). `index.html:2`도 `lang="ko"`로 고정된다. 제품/테스트 검색에서 locale state/resource/menu 구현은 확인되지 않았다.
- **Expected Basis:** 사용자의 명시적 5 locale 요구와 `spec.md:11-14`의 “모든 interface/value를 명시하고 사용자 요구 시 spec을 먼저 동기화” 규칙. 현재 `designs.md:290-300` header 계약에도 언어 선택 항목이 없다.
- **Actual:** locale state/persistence/detection/fallback, 카탈로그 120종의 5언어 coverage, plural/number/date formatting, `document.documentElement.lang` 갱신, export locale policy가 정의되지 않았다. ko/en만 가진 데이터에 메뉴를 덧붙이면 혼합 언어가 정상인지 오류인지 판정할 기준도 없다.
- **Impact:** 구현자가 서로 다른 fallback과 저장 키를 선택할 수 있고, 일부 화면·style metadata·ARIA·export만 번역되는 drift가 발생한다. 긴 CJK 문자열과 산출물 언어를 검증할 계약이 없으므로 “언어를 바꿔도 스타일이 깨지지 않음”을 결정론적으로 테스트할 수 없다.
- **Suggested Action:** spec/design/decision을 먼저 갱신해 locale enum, 기본값/브라우저 감지/URL·LocalStorage 지속성, fallback 우선순위, catalog/editorial/ARIA 번역 coverage, plural·숫자·날짜 formatter, `lang`/direction, export filename/metadata/키의 locale 정책을 확정한다. CSS property/token key와 ID처럼 안정성을 위해 영어로 남길 canonical 부분도 명시한다.
- **Re-audit Method:** 승인된 schema와 fixture로 120 style × 5 locale completeness를 검증하고, 새로 추가된 상태의 hydrate/persist/fallback 테스트 및 default/browser/storage precedence 테스트를 실행한다.
- **Confidence:** High
- **Notes:** 사용자가 5 locale을 요청한 사실은 명확하나 세부 정책은 **Needs Spec Clarification**이다.

### A11-UI-F001 — 메인 상단 언어 메뉴와 다국어 ARIA/UI wiring이 없음

- **Area:** main/header/discovery/detail/peek/dock/split UI
- **Severity:** Major
- **Status:** Confirmed
- **Summary:** 요청한 main top language menu가 존재하지 않고, 현재 UI 문자열·ARIA label·title·placeholder가 여러 컴포넌트에 직접 하드코딩되어 있다. locale 변경을 구독하거나 header에 active locale을 표시하는 경로도 없다.
- **Evidence:** `header.js:22-121` header에는 brand/search/view/bookmark/confirm/compare만 있고 language control이 없다. 검색의 `aria-label`/placeholder와 버튼 title은 한국어로 직접 작성된다(`header.js:44-85`), header state subscription도 `header.js:257-289`에서 locale을 처리하지 않는다. detail/inspector strings와 ARIA가 직접 하드코딩된다(`detailView.js:283-318,337-374,448-575`). discovery, peek, dock, split에도 직접 문자열이 있다(`discoveryMarkup.js:130-160`, `peekPreview.js:114-120`, `selectionDock.js:55-90`, `detailView.js:1271-1339`).
- **Expected Basis:** 사용자 요청의 “메인의 상단에 언어를 설정하는 메뉴”; `designs.md:290-300`의 header 영역과 `spec.md:292-299`의 focus trap/keyboard parity/ARIA 접근성 계약. 5 locale selector의 메뉴 role, active state, keyboard, focus restore, responsive width는 현재 문서에 없다.
- **Actual:** 언어를 바꿀 수 있는 control/handler/aria semantics가 없으며, fixed Korean/English mixture가 main·detail·inspector·peek·dock·split에 남는다. 767px 대응은 header column/reflow 정도만 정의한다(`index.css:3627-3640`); 새 메뉴의 우선순위·overflow·focus는 정의되지 않았다.
- **Impact:** 언어 선택 요구 자체가 충족되지 않는다. 임시 구현은 aria/title/placeholder와 visible label을 서로 다른 언어로 남길 수 있고, 긴 CJK label이 header/action row를 밀어내거나 키보드로 접근 불가능해질 수 있다.
- **Suggested Action:** F001의 locale 결정 후 header에 명시적 selector semantics(버튼/listbox 또는 menu, 현재 locale, Escape/Arrow/Enter/Space, focus restore, `aria-expanded`/`aria-selected`)를 설계한다. 모든 user-facing string과 accessible name을 resource key로 외부화하고 main/header/detail/inspector/peek/dock/split에 같은 context를 전달한다. 320/375/640/767/1024/1440px reflow 및 focus order를 명시한다.
- **Re-audit Method:** 5 locale에서 main→detail→inspector→peek/dock/split 전환을 수행하며 visible text, `lang`, `aria-*`, title/placeholder, active menu/focus를 snapshot한다. 키보드-only 순회와 viewport별 overflow/bounding-box 검사를 추가한다.
- **Confidence:** High
- **Notes:** selector의 정확한 visual pattern은 미정이지만, 현재 absence는 확정이다.

### A11-DOC-F001 — Live CSS/HTML/Markdown/DTCG가 선택 locale을 받지 않음

- **Area:** inspector live artifacts and rendered preview copy
- **Severity:** Major
- **Status:** Confirmed
- **Summary:** generator와 inspector context에는 locale 인자가 없고, 산출물/preview copy는 한국어·영어가 고정 혼합된다. 따라서 header에 언어 메뉴를 추가해도 사용자가 보는 live CSS/HTML/MD/tokens가 선택 언어를 따르지 않는다.
- **Evidence:** `designSpecGenerator.js:226-267` CSS는 `subDesign.nameEn` 주석과 영어 key를 고정하고, `:273-281,375-404` Markdown은 한국어 `subDesign.name/shortDesc/usage`와 영어 headings/range를 혼합한다. DTCG는 `:565-610`에서 `$extensions.name=subDesign.nameEn`, palette usage를 그대로 쓰며 locale parameter가 없다. detail markup은 generator를 locale 없이 호출한다(`detailView.js:527-537`), inspector context도 `liveTweaks`까지만 반환한다(`inspectorState.js:14-43`). HTML archetype/template 및 runtime copy도 고정 문자열을 포함한다(`src/components/archetypeTemplates.js:186-199,309-432`, `src/preview/renderers.js:42-45,123-125,241-243,290-292,394-396`).
- **Expected Basis:** 사용자의 “실시간 디자인 사양 및 인스펙터의 live css나 html md 디자인토큰들도 i18n 설정에 맞게” 요구와 `spec.md:45-51`, `designs.md:366-373`의 네 산출물 reactive contract. CSS property/key/ID는 안정적 canonical key로 남길 수 있지만 사람에게 보이는 주석·metadata·description·HTML copy의 번역 범위는 spec에서 정해야 한다.
- **Actual:** generator output은 locale과 무관하고, 5 locale translation table/fixture가 없다. JSON의 구조 key는 영어이고 metadata/usage도 고정되며, Markdown의 allowed range는 영어·수치가 고정된다. HTML live pane은 runtime HTML을 복사하지만 renderer 텍스트/ARIA에 locale context가 전달되지 않는다.
- **Impact:** 선택 언어와 inspector/export 결과가 서로 다른 언어가 된다. 번역된 긴 문자열을 실제 HTML·Markdown·ARIA에서 동시에 검증할 수 없고, canonical key를 번역해 버리면 downstream token/CSS 계약까지 깨질 수 있다.
- **Suggested Action:** locale context를 inspector state와 generator/renderer API에 명시적으로 전달한다. canonical CSS property, token key, style ID, DTCG field는 고정하고 human-readable comment/metadata/Markdown/HTML/ARIA를 locale resource에서 생성할지 결정한다. 5 locale × 120 style × 4 artifact snapshot과 locale switch 중 최신 state 반영 테스트를 추가한다.
- **Re-audit Method:** 각 locale에서 동일 style/tweak/archetype/device를 생성해 canonical key/ID/numeric value는 동일하고 human text만 선택 locale/fallback을 따르는지 byte/AST 비교한다. HTML/MD/CSS/JSON copy/download/integrated snapshot을 함께 검사한다.
- **Confidence:** High
- **Notes:** 어떤 텍스트를 번역하고 어떤 token key를 유지할지는 **Needs Spec Clarification**이다.

### A11-UI-F002 — CJK 글꼴·긴 문자열·nowrap에 대한 layout 계약과 회귀 검사가 없음

- **Area:** typography, header/detail inspector responsive layout
- **Severity:** Minor
- **Status:** Probable
- **Summary:** 현재 글꼴과 overflow 정책은 Latin 중심이며, 5 locale의 CJK 길이 증가를 보장하는 계약이 없다. 몇몇 chip/tab/swatch는 `white-space: nowrap`으로 고정되어 번역 시 잘림 또는 가로 스크롤 가능성이 있다.
- **Evidence:** `index.css:6-7,35-39`는 Google Fonts로 Inter/Space Grotesk/Cinzel/Fira Code만 가져오고 CJK fallback stack을 명시하지 않는다. `audit9-detail.css:156-160` swatch name/hex는 nowrap+ellipsis이고, `interactive.css:930-944` top style chip과 `:2909-2935` inspector tabs도 nowrap이다. Header search는 `index.css:180-184`에서 min-width 280px, actions는 `:236-242`에서 wrap이며 모바일 규칙은 `:3627-3640`에만 있다. 테스트 검색에서 5 locale/long-string/font/bounding-box matrix는 확인되지 않았다.
- **Expected Basis:** 사용자의 “언어를 바꿔도 스타일이 깨지지 않음”, 긴 문자열/CJK 줄바꿈 요구; `designs.md:216-220`의 320~1440px no-overflow·44px target과 `designs.md:356-359`의 sidebar/label 접근성 계약.
- **Actual:** locale별 글꼴·line-break·ellipsis·tooltip/full accessible name·header priority가 정해지지 않았고, existing no-wrap selectors는 번역 문자열을 같은 폭으로 가정한다.
- **Impact:** 일본어/중국어에서 fallback glyph 폭, line-height, tab/chip overflow가 달라져 header/inspector가 깨지거나 시각 text가 잘릴 수 있다. ellipsis는 accessible name과 일치하지 않을 수 있다.
- **Suggested Action:** locale별 CJK-capable font fallback, `lang` 기반 line-height/word-break, visible wrap vs ellipsis, full accessible name/title, minimum hit target과 header priority를 design contract로 정한다. 320/375/640/767/1024/1440px × 5 locale long-string fixture를 visual/computed-style 회귀에 추가한다.
- **Re-audit Method:** 실제 CJK 긴 category/style/inspector labels를 주입해 horizontal overflow, clipping, focus ring, accessible name, header/detail bounding box를 측정하고 `prefers-reduced-motion`/keyboard도 함께 확인한다.
- **Confidence:** Medium
- **Notes:** 실제 깨짐 정도는 browser computed layout을 실행하지 않아 Probable로 둔다.

## 6. Uncertainties and Clarifications Needed

1. `999px`가 pill/capsule 전용 스타일 token인지, 모든 preview surface를 둥글게 하는 global tuner 기본값인지 결정이 필요하다.
2. style/category 전환 및 detail 재진입에서 `liveTweaks`를 reset할지 preserve할지, split/peek/dock에 tuner를 적용할지 결정이 필요하다.
3. 5 locale의 default/detection/persistence/fallback, catalog editorial coverage와 missing translation 처리(특히 120종)를 결정해야 한다.
4. Live CSS/HTML/Markdown/DTCG에서 번역할 human-readable 영역과 안정적으로 영어를 유지할 key/ID/field, 파일명·통합 snapshot 언어 정책을 결정해야 한다.
5. CJK font 공급원, line-break/ellipsis/tooltip, header selector visual semantics와 responsive breakpoints를 결정해야 한다.

## 7. Perspective Decision

**Decision: HOLD / REWORK REQUIRED.**

현재 구현은 `999px`를 `0~64px` 전역 튜너 기본값으로 투영하고 전 화면 selector에 전파하는 문제를 확인했으며, 테마 전환 reset/preserve 정책도 문서화되지 않았다. 5 locale과 상단 언어 메뉴·ARIA·CJK layout·locale-aware inspector/export contract가 존재하지 않으므로 구현 착수 전 위 clarification을 `spec.md`/`designs.md`/결정 문서에 반영해야 한다. 관련 Node 회귀 47개는 통과했지만 이번 위험을 검출하지 못한다.
