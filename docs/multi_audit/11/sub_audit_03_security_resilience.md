# Sub Audit Report

## 1. Audit Metadata

- Audit Turn: 11
- Perspective: Security, trust boundaries, and error resilience
- User Goal: 실시간 튜너의 `999px` 같은 범위 밖 값이 전체 목업에 전파되는 원인을 확인하고, 한국어·영어·일본어·중국어 간체·중국어 번체 5개 언어를 모든 UI와 CSS/HTML/Markdown/디자인 토큰 산출물에 안전하게 적용할 수 있는 구조를 점검한다.
- Audit Basis: Standard-backed
- Standard Path: `/home/eunho1/Projects/web/design_sample_selector/AI_AUDIT_DOC_STANDARD.md`
- Report Contract: `/home/eunho1/.codex/skills/multi-audit/references/report-contract.md`
- Product 수정 여부: 없음. 이 보고서 파일만 생성했다.

## 2. Assigned Scope

다음 경계를 독립적으로 확인했다.

- `appState`, 저장 데이터, catalog validation/contract, legacy adapter
- discovery URL parser 및 URL state adapter
- header/detail/main/discovery/peek/selection dock/mockup/archetype renderer
- inspector의 CSS/HTML/Markdown/JSON generator와 다운로드·클립보드 경로
- preview registry와 inline style/CSS custom property 적용 경계
- 5개 locale 리소스·fallback·lazy-load·전환 상태를 수용할 수 있는 현재 구조
- Node 테스트, 정적 스캐너, catalog/build 관련 명령의 탐지 범위

## 3. Excluded and Uninspected Scope

- `node_modules/`, `.git/`, `dist/`, 기존 `docs/multi_audit/**` 보고서와 결론
- 서버/브라우저 실행 및 외부 배포 변경
- 실제 수정·패치·설계 문서 갱신
- RTL 동작(요청 범위에서 제외)
- 외부 사용자가 수정한 원격 catalog가 존재한다는 가정. 현재 확인된 catalog는 번들된 정적 코드다.

## 4. Evidence Examined

- `src/state/appState.js`, `src/catalog/validation/rules.js`, `src/catalog/contract.js`, `src/catalog/legacyAdapter.js`, `src/catalog/index.js`
- `src/catalog/packs/expansion/authoring.js`, `src/utils/selection.js`, `src/components/detailView.js`, `src/styles/interactive.css`, `index.css`
- `src/utils/designSpecGenerator.js`, `src/utils/inspectorState.js`, `src/utils/clipboard.js`, `src/catalog/discoveryUrl.js`, `src/state/discoveryUrlState.js`
- `src/components/header.js`, `mainView.js`, `discoveryControls.js`, `peekPreview.js`, `selectionDock.js`, `archetypeTemplates.js`, `mockupRuntime.js`
- `src/preview/registry.js`, `renderers-wave-1.js`, `renderers-expansion.js`, `thumbnails*.js`, `src/catalog/validation/color.js`
- `spec.md`, `index.html`, `package.json`, `package-lock.json`, tests under `tests/` (existing multi-audit reports는 읽지 않음)
- Read-only checks:
  - `npm run validate:catalog -- --json`: `valid: true`, `errorCount: 0`; 범위 밖 `defaultTweaks`가 있어도 `TWEAK_VALUE_INVALID` 0건.
  - Current catalog scan: `op-art`, `space-age`, `disco-glam`, `seventies-groovy`, `cyber-y2k`, `kawaii-pixel-web`, `scene-core-web`, `mcbling-gloss`가 `borderRadius: 999`를 갖지만 위 validator는 유효로 판정.
  - `AppStateManager.setState({ liveTweaks: { borderRadius: 999 } })`: `accepted: true`, 저장 길이/값은 `999`.
  - inspector generator에 `999`를 넣으면 CSS `--tweak-radius: 999px`, Markdown 허용 범위 `0px ~ 64px`와 함께 `999px`, DTCG dimension `value: 999`가 동시에 출력.
  - `parseDiscoverySearch('?f=__proto__%3Ax')`, `constructor`, `toString`: 모두 `TypeError: activeFacets[facetId].push is not a function`.
  - `AppStateManager.setState({ searchQuery: 'x'.repeat(100000) })`: `accepted: true`, 저장 길이 `100000`.
  - 일본어 palette 이름·`__proto__`·중복 `Red`를 token generator에 넣은 synthetic read-only probe: JSON에 빈 문자열 키가 생기고, `__proto__`는 own key가 되지 않으며, `Red`/`red`는 뒤 항목으로 조용히 덮어써짐.
  - `npm test`: 190 tests passed, 0 failed.
  - `npm audit --omit=dev --offline`: dependency vulnerability 0건. 이는 아래 제품-level 경계를 검증하지 않는다.

## 5. Findings

### [SEC-F001] Tuner upper bounds are absent and the global radius value is propagated to every mockup surface

- Area: Catalog validation, AppState, selection, detail DOM, runtime CSS, inspector exports
- Severity: Major
- Status: Confirmed
- Summary: 숫자 타입·유한성·0 이상만 확인하고 field별 상한을 확인하지 않는다. `999`가 catalog default와 live state를 통과한 뒤 root unit, archetype unit, 버튼·카드·패널·셀·프레임 전체에 같은 CSS variable로 전파된다.
- Evidence:
  - `src/catalog/validation/rules.js:43-51,349-365`의 `validateTweaks()`는 모든 key에 `Number.isFinite()`와 `< 0`만 검사하고, spec에 정의된 `64/12/30/32/2` 상한을 검사하지 않는다. `DIMENSION_PATTERN`도 `999px`를 제한하지 않는다.
  - `src/state/appState.js:153-159,254-261`도 동일하게 finite number만 허용한다. 위의 `setState()` probe가 실제로 `true`를 반환했다.
  - `src/catalog/packs/expansion/authoring.js:136,220`의 `optical-stage`와 `chrome-pop` grammar가 `radius: 999`를 선언하고, `:370-386`에서 이를 token `radius`와 `defaultTweaks.borderRadius`로 동시에 복사한다. 동일 grammar를 공유하는 8개 style이 실제 scan에서 검출됐다.
  - `src/utils/selection.js:24-39`가 detail 진입 시 `found.defaultTweaks`를 state에 복사한다.
  - `src/components/detailView.js:395-409,769-780,1129-1145`가 검증/클램프 없이 inline style 및 `style.setProperty()`에 `999px`를 쓴다. HTML range의 `max=64`는 초기 default와 programmatic state의 보안 경계가 아니다.
  - `index.css:2049-2076`은 `.mockup-unit`과 모든 내부 `*-box/card/panel/btn/cell/frame`에 radius를 적용하고, `src/styles/interactive.css:2750-2805`는 `.archetype-unit` 및 30개가 넘는 game/web/mobile/shop/blog/dashboard/media/chat selector에 같은 radius와 border width를 적용한다.
  - validator와 generator probe가 각각 `valid: true` 및 `999px` artifact를 반환했다. 따라서 현상은 slider 표시 문제가 아니라 catalog → state → CSS/export propagation 문제다.
- Expected Basis: `spec.md:156-175`의 `SubCategoryDesign.defaultTweaks`와 tuner UI 계약은 radius `0~64`, border `0~12`, shadow `0~30`, blur `0~32`, glow `0~2.0`을 요구한다. catalog ingress, public state mutation, DOM/CSS/export boundary 모두 같은 계약을 적용하고, 잘못된 값은 다른 style로 대체하지 않고 reject 또는 명시적 safe default로 복구해야 한다.
- Actual: validator/state/generator에 공통 bounds contract가 없고, style-specific `999`가 정상 데이터로 동결된다. `999px`는 root와 모든 inner surface에 적용되어 전체 화면이 pill/완전 둥근 형태가 될 수 있다. shadow/blur/glow도 finite 여부만 검사되어 과대값의 가독성·성능 영향이 열려 있다.
- Impact: 사용자가 한 style을 열기만 해도 전체 sandbox geometry가 의도와 다르게 변한다. inspector의 CSS/Markdown/JSON이 허용 범위를 거짓으로 표시하거나 범위 밖 값을 내보내어 artifact 신뢰성도 깨진다. 이는 현재 재현된 무결성/복원력 문제이며, CSS/HTML injection과는 별개다.
- Suggested Action: field별 immutable `TUNER_BOUNDS`를 catalog validator와 AppState sanitizer가 함께 사용하고, `Number.isFinite`, integer/step, upper bound를 모두 검사한다. style grammar에 `pillRadius` 같은 별도 의미가 필요하면 global `borderRadius`와 분리한다. detail DOM과 모든 generator에도 마지막 defensive clamp/reject를 두고, invalid shipped default는 build 실패 또는 diagnostic+safe default로 명시 처리한다. CSS 적용 범위가 root 전체인지 component-only인지도 spec에 확정한다.
- Re-audit Method: 8개 실제 999 style 및 `-1`, `NaN`, `Infinity`, `64.1`, `12.1`, `2.01` fixture를 catalog/build/state/generator/DOM 각 경계에서 검사한다. DETAIL, Split, Peek, Confirm, 8 archetype 전환 후 모든 `--tweak-*` 값과 generated artifacts가 bounds 안에 있고, reset/invalid recovery가 일치하는지 확인한다.
- Confidence: High
- Owner: Catalog/State/Detail runtime
- Notes: `999`가 시각적으로 의도된 pill radius인지 여부는 Needs Spec Clarification이지만, 현재 tuner 계약의 global value로 사용되는 것은 명확히 범위 밖이다.

### [SEC-F002] Catalog and future locale strings cross raw innerHTML/style contexts without a context-specific output boundary

- Area: Renderer/innerHTML, detail/peek/dock/mockups, inspector artifacts, CSS values
- Severity: Major
- Status: Confirmed
- Summary: 정적 catalog라는 현재 신뢰 가정 때문에 일부 값만 escape되고, detail/main/header/archetype/split의 `innerHTML` template에는 catalog 문자열을 그대로 삽입한다. 특히 detail 최초 렌더에서 CSS/Markdown/JSON 산출물 자체를 다시 `innerHTML`로 파싱한다. 5개 언어의 번역 문자열을 추가하면 이 경계가 즉시 번역 데이터의 HTML/CSS injection 및 artifact corruption 경계가 된다.
- Evidence:
  - `spec.md:292-295`는 동적 문자열의 unsanitized `innerHTML`을 금지하지만, `src/components/detailView.js:274-328,395-426,433-441,527-536,558-568`는 category/style/palette/prose와 generated CSS/Markdown/JSON을 raw interpolation한다.
  - `src/components/detailView.js:591,625,699-727,1263-1351`는 archetype/split/palette/pros/cons를 `innerHTML`로 재삽입한다. `src/components/archetypeTemplates.js:35-47,133-158,253-311,364-450,453-543,545-668`도 name, nameEn, shortDesc, characteristics, palette values를 raw HTML에 넣는다.
  - `src/components/mainView.js:132-180,197-322`와 `src/components/header.js:22-105`는 카드 제목·설명·palette style/name·category title을 raw template에 넣는다. peek card와 style picker처럼 일부 display text를 escape하는 경로가 있지만, `renderPreviewThumbnail()`의 HTML/CSS 결과는 별도 경계다.
  - `src/components/mockupRuntime.js:1045-1082`는 dashboard row의 `innerHTML`을 snapshot에 보관한 뒤 다시 raw `innerHTML`로 렌더한다. 초기 locale/copy가 오염되면 상태 이관 후에도 그대로 재삽입된다.
  - `src/preview/registry.js:219-230`의 `assertSafeRenderOutput()`은 script/iframe/object/embed, inline event handler, `javascript:` URL만 거부하고 CSS declaration·style attribute·일반 attribute/text context를 검증하지 않는다. `src/preview/thumbnails-expansion.js:14-40,48-55`와 `src/preview/thumbnails.js:3-21`은 palette 값을 inline style에 직접 조합한다.
  - synthetic generator probe에서 `name: '<img src=x onerror=alert(1)>'`가 Markdown 결과에 그대로 남고, `nameEn` 값도 CSS 결과에 raw로 남았다. 현재 정적 catalog에는 공격자가 입력할 runtime 경로가 없지만, 번역 bundle/pack을 독립 데이터로 취급할 경우 재현 가능한 sink다.
- Expected Basis: 동적 값은 context별로 text node는 `textContent`, attribute는 `setAttribute`/정확한 attribute encoder, style은 CSSOM 또는 allowlist parser, code pane은 항상 `textContent`로 취급해야 한다. generated CSS/HTML/Markdown/JSON은 “표시 문자열”과 “실행/파싱 가능한 artifact”를 분리해야 하며, locale display text가 id/class/token selector를 만들면 안 된다.
- Actual: 일부 consumer만 `escapeHtml`을 사용하고, raw values가 initial modal HTML, mockup HTML, inline style, code pane에 들어간다. refresh 이후 code pane은 `textContent`로 갱신되지만 최초 `root.innerHTML` template에서는 artifact가 HTML로 해석된다. Markdown의 `<span style>`도 그대로 허용되어 번역 텍스트의 `<`, `|`, backtick이 artifact 구조를 깨뜨릴 수 있다.
- Impact: 현재는 build-time 정적 데이터 신뢰에 의존해 직접 사용자 XSS 경로가 제한된다. 그러나 malicious/compromised translation 또는 향후 remote/lazy locale data가 들어오면 initial detail render에서 markup 실행, style mutation, inspector 내용 위조가 가능하다. 공격이 아니어도 번역된 특수문자와 긴 문자열이 header/detail/peek/dock/mockups를 깨뜨리고 generated artifact의 문법을 손상시킨다.
- Suggested Action: locale/catalog data를 untrusted-at-render로 취급하고 text/attribute/style/Markdown/CSS/JSON context별 encoder를 별도로 정의한다. UI는 DOM node assembly 또는 static template + text assignment로 재작성하고, code panes는 생성 직후에도 `textContent`만 사용한다. `data-theme`, CSS selectors, token keys, filenames는 canonical ID/enum에서만 생성한다. renderer registry에는 CSS/attribute policy를 추가하고, palette/color/font/shadow/gradient은 strict parser를 통과한 값만 CSSOM에 넣는다. runtime user comment 경로처럼 `textContent`를 유지한다.
- Re-audit Method: 각 locale 리소스의 `<img>`, quotes, backticks, pipes, CR/LF, `</code>`, CSS `;`/`)` 값을 category/header/detail/split/peek/dock/8 mockup/inspector 최초 렌더와 update 렌더에 주입한다. 실제 DOM에서 예상 외 element/attribute/style declaration이 생성되지 않는지, code pane/clipboard/download 결과는 원문 artifact로만 유지되는지 검사한다.
- Confidence: High for raw sink; Medium for exploitability while catalog remains static and local.
- Owner: Renderer/Preview/Inspector/i18n boundary
- Notes: 현 단계에서 “현재 공개 URL만으로 즉시 XSS”라고 단정하지 않는다. 이 finding은 확인된 sink와 요청된 locale 확장 시 필요한 trust boundary를 구분한 것이다.

### [SEC-F003] Discovery URL parser has a real prototype-key denial-of-service path and state query has no ingress length cap

- Area: External URL/query input, discovery state bootstrap, AppState
- Severity: Major
- Status: Confirmed
- Summary: 반복 `f=facet:value`를 일반 `{}`에 쌓으면서 inherited key를 own key로 확인하지 않는다. 공격자가 query를 조작하면 parser가 throw하고 bootstrap이 fatal recovery 화면으로 빠진다. 별도로 direct state callers는 `searchQuery`를 임의 길이로 저장할 수 있다.
- Evidence:
  - `src/catalog/discoveryUrl.js:56-76`의 `const activeFacets = {}`와 `if (!activeFacets[facetId]) ...; activeFacets[facetId].push(...)`가 `__proto__`, `constructor`, `toString`에 대해 배열 대신 상속 객체/function을 얻는다. 실제 probes 세 값 모두 `TypeError: activeFacets[facetId].push is not a function`을 반환했다.
  - `src/main.js:64-72`가 초기 `bindDiscoveryUrlState(appState)`를 bootstrap try 안에서 수행하고, `:277-280`에서 예외를 fatal bootstrap UI로 전환한다. 즉 crafted URL 하나가 정상 gallery 대신 recovery panel을 강제한다.
  - `src/catalog/discovery.js:43-46`은 parser 경로에서만 q를 120자로 정규화한다. `src/state/appState.js:231-234`는 `searchQuery`가 string이면 무제한 허용하며, 100,000자 probe가 그대로 state에 저장됐다. `src/components/header.js:44-50`은 그 값을 escaped `innerHTML` input value로 다시 넣는다.
  - `URLSearchParams` 전체 query/parameter 수에 대한 cap은 `discoveryUrl.js:51-57`에 없다. locale query를 같은 parser에 추가하면 동일한 prototype collision 및 oversized input 문제가 재발한다.
- Expected Basis: spec §5.6은 unknown/malformed URL 입력을 안전한 기본값으로 정규화하고 q를 최대 120자로 제한한다. 외부 key는 allowlist/Map/own-key 검사를 거쳐야 하며 malformed query는 app bootstrap을 중단하지 않아야 한다.
- Actual: known facet normalization이 뒤에서 invalid facet을 제거하지만, 그 전에 inherited property 접근과 `.push()`가 발생한다. state mutation은 q의 type만 검사한다.
- Impact: 링크를 열거나 popstate를 처리하는 사용자에게 가용성 저하가 발생하고, 큰 query/state는 CPU·DOM memory 압박을 만든다. locale key를 query에 넣을 때도 allowlist 없이 같은 pattern을 복제하면 parser-level DoS 및 key collision이 된다.
- Suggested Action: facet parser를 `Map` 또는 `Object.create(null)`로 바꾸고 `FACET_BY_ID.has()`/`Object.hasOwn()` 확인 후 배열을 생성한다. raw search와 parameter count/total query size를 URL adapter 진입 시 제한하고, parser 예외는 default discovery state로 복구한다. locale은 canonical allowlist에서만 읽고 query/localStorage/browser preference precedence를 명시한다.
- Re-audit Method: bootstrap 및 popstate에서 `__proto__`, `constructor`, `toString`, empty/duplicate/unknown facet, 1MB q, 수만 개 f, malformed percent encoding을 넣어 throw 없이 canonical state와 bounded DOM을 확인한다. locale query도 동일 matrix로 검사한다.
- Confidence: High
- Owner: Discovery URL/State
- Notes: 이 finding은 현재 locale 기능 부재와 무관하게 외부 URL에서 재현되는 실제 resilience 문제다.

### [SEC-F004] There is no locale state, resource schema, five-locale completeness gate, or locale-load recovery contract

- Area: i18n bootstrap, resource loading, localStorage/query persistence, header and artifact language
- Severity: Major
- Status: Needs Clarification
- Summary: 현재 구현에는 locale 선택·저장·bundle·header menu가 없다. catalog localized text는 `ko` 필수와 `en` 선택/필수 조합만 검증하며, 요청된 `ja`, `zh-Hans`, `zh-Hant`와 resource size/completeness/fallback 정책이 정의되어 있지 않다.
- Evidence:
  - `index.html:2`의 document language가 `ko`로 고정되고, `src/state/appState.js:90-128`의 `DEFAULT_STATE` 및 `:130-139`의 enum에 locale이 없다.
  - `src/main.js:64-98`의 bootstrap에는 locale resolver/bundle loader가 없고, `src/components/header.js:17-122`에는 language menu가 없다. `rg --files` 및 locale/i18n 검색에서 source translation bundle/registry가 발견되지 않았다.
  - `src/catalog/validation/rules.js:152-161,306-310,337-345`와 `src/catalog/contract.js:134-163`는 사실상 `ko/en` 구조만 계약한다. `src/catalog/discovery.js:116-143`의 search document도 `ko/en`만 수집한다.
  - `src/components/lazyPreviewLoader.js`는 detail/component module retry만 제공하며 locale resource의 size/schema/checksum/fallback을 다루지 않는다.
  - localStorage는 `src/state/appState.js:14-25`에서 JSON raw 크기 16,384자를 제한하지만 locale key 자체는 없으며, arbitrary locale object를 저장/검증하는 정책도 없다.
- Expected Basis: 5개 canonical locale ID, 기본 locale, query/localStorage/browser preference precedence, malformed/unsupported locale fallback, per-key vs whole-bundle fallback, bundle completeness/maximum size/lazy-load retry/terminal behavior, `lang` attribute와 artifact language semantics를 spec에 먼저 고정해야 한다. token/id/selector는 locale-neutral이어야 한다.
- Actual: 요구된 기능을 현재 코드에서 실행하거나 안전성 검증할 수 없고, 기존 retry/fallback은 locale에 적용되지 않는다. 따라서 “5개 언어가 완전하고 안전하다”는 PASS 근거가 없다.
- Impact: 구현을 부분적으로 추가하면 누락 key가 화면·artifact·aria label마다 서로 다른 언어로 섞이거나, failed lazy bundle이 partial render를 남길 수 있다. oversized/malformed bundle을 localStorage/query에서 그대로 신뢰하면 memory/DOM pressure 및 bootstrap failure가 생긴다.
- Suggested Action: 먼저 `spec.md`에 locale contract를 추가한다. `LocaleId = ko|en|ja|zh-Hans|zh-Hant` allowlist와 schema validator, per-locale key completeness/duplicate/length/total-byte budget, lazy loader의 bounded retry 및 base-locale fallback, safe diagnostic을 설계한다. locale state는 단일 enum string만 persistence하고 bundle data는 저장하지 않는다. display translation과 catalog semantic IDs/token keys를 분리한다.
- Re-audit Method: 완전/누락/추가/중복/oversized/malformed 각 bundle, unsupported query/localStorage, failed import/second retry/terminal state를 모든 five-locale surface와 generated CSS/HTML/Markdown/JSON에서 확인한다.
- Confidence: High for absence; implementation behavior is not yet testable.
- Owner: Product spec/i18n architecture
- Notes: RTL은 요청대로 제외했다. 검색 대상이 selected locale만인지 ko/en 전체인지, generated artifact의 prose/metadata 언어를 어떻게 고정할지는 Needs Spec Clarification이다.

### [SEC-F005] Existing render subscriptions and caches would leave stale locale labels/artifacts and can lose focus during a locale transition

- Area: Locale transition, event/listener lifecycle, partial render, focus/accessibility
- Severity: Major
- Status: Needs Clarification
- Summary: locale state가 추가되어도 현재 component change predicates와 cache key가 locale을 포함하지 않는다. header/main/discovery/dock/peek는 locale 변경을 repaint하지 않고, detail은 locale-only 변경을 granular tweak 경로로 흘려 localized strings를 갱신하지 않는다. full `innerHTML` rerender를 임의로 추가하면 active focus와 control state를 잃을 수 있다.
- Evidence:
  - `src/components/header.js:257-279`의 `headerChromeChanged()`는 filter/view/bookmarks/confirmed만 비교하고 locale은 없다. full `update()`는 `innerHTML`을 교체하며 selection을 보존하는 코드는 search patch(`:227-236`)에만 있다.
  - `src/components/mainView.js:450-485`, `src/components/discoveryControls.js:6-15,126-139`, `src/components/selectionDock.js:262-274`의 subscriptions 모두 locale을 dependency로 갖지 않는다.
  - `src/components/peekPreview.js:90-153,172-180`은 `lastId`와 `peekSubId/viewport`만 key로 사용한다. 같은 style에서 locale만 바뀌면 card text와 footer가 repaint되지 않는다.
  - `src/components/detailView.js:169-206`의 render decision은 view/style/archetype/tab/device만 보고 locale-only 변경은 granular update로 간다. `:231-266`의 inspector refresh는 `requestAnimationFrame`만 coalesce하고 locale/render epoch 또는 current-context check가 없다.
  - `src/state/appState.js:402-409`는 subscriber 예외를 console에만 기록하고 다른 listener로 계속 진행한다. locale bundle이 한 surface에서 throw하면 나머지 surface와 DOM이 partial/mixed 상태로 남을 수 있다.
  - `src/components/detailView.js:1219-1255`는 full render 시 focus trap을 다시 잡고 첫 button에 focus한다. `removeFocusTrap()`은 listener를 실제 attach한 `modalRoot` 대신 outer `container`에서 제거한다. `src/state/appState.js:278-285`의 resize listener도 익명 함수라 manager lifecycle에서 해제할 수 없다.
- Expected Basis: locale bundle을 성공적으로 resolve한 뒤 한 번의 versioned render transaction으로 모든 visible surface와 inspector artifacts를 바꿔야 한다. async load/raf 결과는 `(locale, renderEpoch, selectedId, archetype)`가 현재 state와 일치할 때만 commit해야 하며, control value, disclosure state, modal focus trap, opener focus를 보존해야 한다.
- Actual: locale trigger가 없고, trigger를 단순히 각 subscription에 추가해도 stale caches와 independent listeners가 남는다. full rerender는 focus reset을 일으키며 subscriber 오류는 사용자에게 atomic recovery를 제공하지 않는다.
- Impact: 언어 전환 직후 header는 새 언어인데 peek/dock/main/detail/inspector는 이전 언어, 또는 CSS/HTML/Markdown/JSON이 서로 다른 locale이 될 수 있다. 사용자가 입력 중인 search/control 값과 키보드 focus가 사라져 accessibility와 작업 연속성이 깨진다.
- Suggested Action: locale을 모든 render selector/cache key에 포함하고, bundle resolve 후 중앙 `renderEpoch`/context를 commit한다. 각 component는 locale transition의 disposer와 stale guard를 소유한다. text-only update는 focus snapshot/restore를 제공하고, full modal rerender 시 현재 focus target·selection·open disclosure를 복원한다. failure는 last-known-good/base locale로 전체 context를 rollback하고 polite/alert status를 제공한다.
- Re-audit Method: Main→Detail→Split→Peek→Dock→8 mockups에서 빠른 locale A→B→C 전환, 같은 style 재선택, locale import 지연/실패, slider/search 입력 중 전환, Tab/Shift+Tab/Escape, rAF 직전 전환을 반복한다. 모든 visible labels, `html[lang]`, aria labels, inspector artifacts와 focus/selection이 같은 epoch인지 확인한다.
- Confidence: Medium (all triggering code paths are present; locale feature itself is absent).
- Owner: UI state/render lifecycle/i18n
- Notes: 실제 원하는 “전환 중 partial render를 허용할지”와 fallback 시 이전 locale 유지 여부는 Needs Spec Clarification이다.

### [SEC-F006] Translated display names are unsafe sources for token keys, and export helpers trust filename/content size

- Area: Design token generator, locale-derived identifiers, download/clipboard
- Severity: Major
- Status: Confirmed
- Summary: token JSON palette keys가 stable palette ID가 아니라 display name을 ASCII `slugify()`한 값이다. 일본어/중국어 같은 non-Latin 이름은 빈 key가 되고, duplicate names overwrite되며, `__proto__`는 normal object prototype setter와 충돌한다. generic download/clipboard helpers도 caller-provided filename/content에 자체 policy가 없다.
- Evidence:
  - `src/catalog/legacyAdapter.js:22-25`는 palette `id`를 버리고 `color.name.en || color.name.ko`를 `name`으로 투영한다.
  - `src/utils/designSpecGenerator.js:570-576,630-631`은 `colorTokens[slugify(paletteColor.name)] = ...`를 수행한다. synthetic probe 결과 JSON `color`에 `""` key가 생겼고, `Object.hasOwn(color, '__proto__')`가 `false`였으며, `Red`와 `red` 중 뒤 값만 남았다.
  - `src/utils/designSpecGenerator.js:616-627`의 `downloadFile(filename, content)`은 filename/content를 validate·bound하지 않는다. 현재 detail caller `:1045-1065,1113`는 canonical style ID와 fixed extension을 사용해 현재 filename은 비교적 안전하지만, locale name을 filename에 사용하도록 바꾸면 path/control-character 경계가 열린다.
  - `src/utils/clipboard.js:8-15,23-47`는 text를 `String()`으로 복사하며 size/format cap이 없다. generated Markdown/HTML/JSON을 oversized translation과 함께 copy/download하면 memory pressure가 생길 수 있다.
- Expected Basis: token key, CSS custom property suffix, DTCG object key, filename은 locale-independent canonical ID에서만 파생해야 한다. display translation은 `$description`/visible text 값으로만 사용하고 duplicate/empty/prototype key는 reject+diagnostic해야 한다. export helpers는 safe filename grammar, maximum bytes, MIME/content contract를 갖고 over-limit을 명시적으로 거부해야 한다.
- Actual: display name이 key namespace를 결정하고, invalid/colliding keys가 조용히 손실된다. current adapter의 English-first fallback이 우연히 문제를 숨기며, selected locale을 name source로 바꾸는 순간 재현된다.
- Impact: DTCG artifact가 유효한 JSON이어도 palette token이 누락·덮어쓰기되어 semantic validity가 깨진다. downstream CSS/HTML integration이 기대 token을 찾지 못할 수 있다. oversized export는 tab/clipboard responsiveness를 저하시킨다. 이는 stable ID를 translation으로 바꾸면 안 된다는 무결성 문제이지, 곧바로 JS execution을 의미하지 않는다.
- Suggested Action: generator를 `paletteColor.id` 기반으로 변경하고 key set collision을 hard error로 검증한다. object assembly는 null-prototype/own-key policy를 사용한다. filename은 canonical ID + fixed archetype/ext만 허용하고 separators, control characters, length를 reject한다. clipboard/download payload byte budget과 failure UI를 추가하고, locale translation은 export prose/description에만 넣는다.
- Re-audit Method: 각 locale로 palette names를 일본어·중국어·혼합 Unicode·empty·duplicate·`__proto__`·`constructor`·quotes로 만들고 CSS/JSON/Markdown output의 key uniqueness/parseability를 검사한다. filename traversal/control chars 및 0/limit/over-limit payload를 download/clipboard에서 확인한다.
- Confidence: High for generator behavior; Medium for locale reachability because locale key policy is unspecified.
- Owner: Inspector/export/i18n data model
- Notes: token artifact에서 translated display names를 key로 사용할지 여부는 Needs Spec Clarification이지만, 현재 구현은 그 선택을 안전하게 지지하지 않는다.

### [SEC-F007] CSS value validation is weaker than the consumers and generator; accepted gradients can corrupt style or exports

- Area: Catalog CSS tokens, inline styles, generated stylesheet/DTCG conversion
- Severity: Minor
- Status: Probable
- Summary: color validator의 gradient regex는 괄호 내부를 임의 문자열로 허용하지만, renderer는 palette/color를 inline style에 직접 넣고 DTCG parser는 `linear-gradient`만 해석한다. strict catalog input이나 향후 locale/pack authoring 경계에서 accepted input과 consumer grammar가 일치하지 않는다.
- Evidence:
  - `src/catalog/validation/color.js:1-21`의 `GRADIENT_PATTERN = /^(?:linear|radial)-gradient\([\s\S]+\)$/i`는 내부 stop/function 문법을 검증하지 않는다.
  - `src/preview/thumbnails-expansion.js:14-40,48-55`는 colors를 `background:${motifBackground(...)}`, `color:${surface}`, `border:...${accent}`에 raw 조합한다. `src/preview/thumbnails.js:3-21`과 `src/preview/thumbnails-wave-1.js:3-15`도 palette 값으로 CSS custom property를 만든다.
  - `src/theme/stylesheet.js:39-50,69-84`는 CSS property 값이 non-empty string인지와 ID만 검사한다. `src/utils/designSpecGenerator.js:502-516`의 DTCG conversion은 `linear-gradient`만 처리하고 `radial-gradient`는 일반 color parser로 넘긴다. 현재 source scan에서는 실제 token radial gradient가 확인되지 않았으므로 현재 export failure는 잠재 상태다.
- Expected Basis: catalog accepts only the CSS grammar that every runtime/export consumer can parse and safely serialize. Style values should be strict typed tokens, not arbitrary strings; unsupported gradient forms should fail validation before snapshot/build.
- Actual: validation, inline CSS consumers, stylesheet serialization, and DTCG conversion have different grammars. registry executable-element checks do not make CSS declarations safe.
- Impact: crafted or future-authoring color values may alter CSS declarations, produce invalid/unsafe preview styles, or make inspector JSON generation throw. This is primarily style integrity and recovery risk; current bundled palette values are static and mostly hex.
- Suggested Action: replace broad regexes with a shared CSS color/gradient AST parser and bounded stop count/length; reject unsupported `radial/conic/repeating` forms unless all consumers support them. Serialize style values through CSSOM/typed token functions and add error UI around generator failure rather than allowing modal bootstrap to throw.
- Re-audit Method: test nested functions, semicolon/parenthesis payloads, radial/repeating/conic gradients, long stops, alpha/modern color syntax through catalog validation, thumbnail/render registry, stylesheet generation, and DTCG export. Verify malformed input yields structured validation/recovery rather than partial DOM.
- Confidence: Medium; direct static exploitability is limited, but the validation/consumer mismatch is confirmed.
- Owner: Catalog CSS contract/Preview/Export
- Notes: This is separate from SEC-F002’s HTML sink: even escaped text is not a safe CSS token.

### [SEC-F008] Existing tests and scanners do not detect the requested bounds, locale, prototype, or context-escape failures

- Area: Regression tests, static scanners, build/test gates
- Severity: Minor
- Status: Confirmed
- Summary: all current tests pass, but the quality gates cover adjacent behavior rather than this audit’s failure modes. A green test run therefore does not establish safe 5-locale rendering or tuner bounds.
- Evidence:
  - `npm test` passes 190/190 and `npm audit --omit=dev --offline` reports no dependency CVEs; neither exercises runtime locale or data-context boundaries.
  - `tests/catalogValidation.test.js:403-429` tests negative `glowIntensity`, malformed palette/color, and duplicate palette ID, but no upper bounds or actual `999` default. `tests/catalogDiscovery.test.js:218-242` tests q length and unknown known-value normalization but no `__proto__`/`constructor` inherited-key query.
  - `tests/auditRemediation10.test.js:157-205` covers localStorage size, renderer executable tags/handlers/`javascript:` URLs, but not CSS style/attribute injection, translation interpolation, generated artifact display, token-key collisions, or filename/content limits.
  - `tests/auditRemediation9.test.js:46-52` explicitly asserts `viewport.innerHTML = getArchetypeHTML(...)`; this records an existing sink rather than proving the dynamic values passed into it are context-safe. `tests/designSpecGenerator.test.js:147-163` checks normal DTCG shape for current 120 fixtures only.
  - No test/resource inventory covers `ko`, `en`, `ja`, `zh-Hans`, `zh-Hant` completeness, byte budget, lazy import failure, fallback, `html[lang]`, or transition focus/stale guards.
- Expected Basis: regression tests should encode the approved tuner bounds and locale contract, reject inherited query keys, fuzz all output contexts, and verify atomic locale transitions and artifact validity. Static scans should flag unapproved raw dynamic sinks or require an explicit trusted-template annotation.
- Actual: current gates can pass while shipped defaults are 999, URL parser throws, translated names would produce invalid token keys, and detail initial render can parse generated artifact markup.
- Impact: regressions in precisely the requested areas can land without CI/build signal; manual visual QA may miss mixed locale or malicious special-character cases.
- Suggested Action: add fixtures/tests for each SEC finding: field-by-field finite/step/max, real catalog scan, malicious URL keys/size, five-bundle schema/completeness/size/fallback, per-surface interpolation contexts, token-key stability, export limits, rapid locale transitions and focus. Change scanners from “raw sink exists” assertions to allowlisted sink/context checks.
- Re-audit Method: run the expanded Node suite and inline scanner against source plus synthetic malicious catalog/translation fixtures; require failures for current `999` styles and prototype queries, then run the same matrix on all five locales and all artifact/download paths.
- Confidence: High
- Owner: Test/CI and security regression gates
- Notes: Dependency audit result is clean but is not evidence that product-level DOM/query/i18n risks are absent.

## 6. Uncertainties and Clarifications Needed

- `999`가 `pill/capsule` 형태의 style token으로 의도된 것인지, 아니면 global tuner `borderRadius` default 오기인지 확정이 필요하다. 의도된 경우 global radius와 분리해야 한다.
- locale precedence를 `query > localStorage > browser > default`처럼 정할지, localStorage에 locale ID만 저장할지 결정해야 한다.
- 번역 bundle 누락 시 key별 base-locale fallback인지 전체 bundle rollback인지, import 실패 후 retry/terminal 화면을 어떻게 표시할지 결정해야 한다.
- search index가 선택 locale만 대상으로 할지 ko/en 및 모든 locale metadata를 계속 검색할지 결정해야 한다.
- CSS/HTML/Markdown/JSON 다운로드에서 사용자에게 보이는 prose만 번역할지, token key/selector/filename은 canonical ID로 고정할지 명시해야 한다.
- locale 전환 중 이전 locale 유지, skeleton, partial render 허용 여부와 focus/selection 복원 기준을 정해야 한다.
- RTL은 본 감사 범위가 아니며 별도 요구가 생기면 방향성·서체·focus order 감사를 추가해야 한다.

## 7. Perspective Decision

Security/resilience 관점에서 현재 PASS로 볼 수 없다. `999` 전파와 discovery prototype-key crash는 현재 재현되는 confirmed findings이며, raw HTML/CSS/inspector 경계는 요청된 i18n 확장에서 직접적인 trust-boundary risk가 된다. 5개 locale은 구현·계약·fallback·size gate가 없어 안전성을 판정할 수 없으므로 Needs Spec Clarification 상태로 남긴다. 수정 후 최소 재감사 게이트는 다음과 같다.

1. catalog와 AppState가 field별 tuner bounds를 공통 적용하고 현재 999 defaults가 build/test에서 검출된다.
2. 외부 URL 및 locale/localStorage 입력이 allowlist, own-key, size/parse error recovery를 통과하며 bootstrap을 throw하지 않는다.
3. 모든 dynamic output context가 text/attribute/style/artifact 경계를 통과하고 generated code panes는 실행되지 않는다.
4. 다섯 locale bundle의 completeness/size/fallback/lazy failure와 locale-aware artifact semantics가 명시되고 테스트된다.
5. rapid locale transition에서 Main/Detail/Split/Peek/Dock/mockups/inspector가 동일 epoch·locale을 표시하며 focus와 stale async work가 보존/폐기된다.
