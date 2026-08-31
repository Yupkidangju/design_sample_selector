# Final Multi-Audit Report — Turn 11

## 1. Audit Metadata

- Audit Turn: 11
- Project: Design Sample Selector
- Project Root: `/home/eunho1/Projects/web/design_sample_selector`
- Audit Date: 2026-08-31 (Asia/Seoul)
- Audit Mode: Standard-backed, audit-only
- Standard: `AI_AUDIT_DOC_STANDARD.md`
- Procedure: `/home/eunho1/.codex/skills/multi-audit/SKILL.md`
- Decision: **REWORK REQUIRED / Needs Spec Clarification**
- Product Mutation: 없음. 제품 소스, 테스트, 설정, 제품 문서는 수정하지 않았다.
- Git Mutation: 커밋·푸시·태그 없음.

## 2. User Goal and Decision Basis

사용자 목표는 다음 두 축이다.

1. 테마를 순회하면 실시간 파라미터 튜너의 모서리 둥글기가 `999px`가 되고, 조절 시 화면 전체가 과도하게 둥글어지는 문제의 원인과 안정성을 점검한다.
2. 메인 상단 언어 메뉴로 한국어·영어·일본어·중국어 간체·중국어 번체를 전환하고, UI뿐 아니라 실시간 디자인 사양과 Inspector의 Live CSS/HTML/Markdown/design token까지 일관되게 국제화할 수 있는 구조를 점검한다.

판정은 사용자 목표, `spec.md`, `designs.md`, `README.md`, `CHANGELOG.md`, 실제 코드·테스트와 D3D 감사 표준을 함께 근거로 한다. 현재 코드에서 `999px` 결함은 직접 확인됐고 5개 언어 계약과 구현은 존재하지 않는다. 따라서 PASS 계열 판정은 불가능하다.

## 3. Scope and Exclusions

### Included

- 120개 스타일 카탈로그의 `tokens.radius`와 `defaultTweaks.borderRadius` 생성·검증 경로
- `AppState`의 `liveTweaks` 수용·전환 경로
- Detail 파라미터 튜너 DOM, CSS 변수 적용 범위, CSS/Markdown/DTCG 생성기
- 테마·카테고리·아키타입 전환 시 tweak 상태 정책
- 현재 localized catalog 계약, legacy adapter, 검색·정렬, 헤더·ARIA·사용자 문자열
- 5개 언어 상태·리소스·fallback·지연 로딩·Inspector 갱신에 필요한 구조
- 번역 문자열의 DOM/CSS/다운로드 경계와 URL 입력 복원력
- 기존 Node 테스트, 카탈로그 검증, CSS freshness, 오프라인 운영 의존성 감사

### Excluded or Partially Covered

- 실제 일본어/중국어 번역 품질: 리소스가 존재하지 않아 Not Covered
- 5개 언어 구현 후 Chrome 시각 회귀·접근성·폰트·overflow 검증: 구현이 없어 Partially Covered
- locale pack 추가 후 Vite 번들 실측: 제품 변경 금지 범위이고 구현이 없어 Partially Covered
- GitHub Pages 실제 배포 URL의 CSP·응답 헤더: URL/응답 헤더가 제공되지 않아 Excluded
- 운영 배포·커밋·푸시: 사용자 승인 범위 밖
- `node_modules`, `dist`, `.git`: 생성물·의존성·VCS 내부 트리이므로 정적 소스 감사에서 제외

## 4. Work-Surface Inventory

| Surface | Principal Evidence | Audit Result |
| --- | --- | --- |
| Catalog radius generation | `src/catalog/packs/expansion/authoring.js` | 동일 grammar radius가 theme token과 tuner default에 중복 투영됨 |
| Catalog validation | `src/catalog/validation/rules.js` | 유한·0 이상만 검사, 계약 상한 미강제 |
| Runtime state | `src/state/appState.js` | `liveTweaks.borderRadius=999` 수용, locale 상태 없음 |
| Detail tuner | `src/components/detailView.js` | slider max 64이지만 999 렌더; theme/tweak radius 동시 설정 |
| Global propagation | `src/styles/interactive.css` | root와 38개 하위 selector에 `!important` 강제 |
| Theme transitions | `src/components/detailView.js`, `src/utils/selection.js` | 일부 전환은 대상 기본값으로 reset, archetype은 preserve |
| Localization contract | `src/catalog/contract.js`, `src/catalog/validation/rules.js` | `ko` 필수, 일부 `en`만 지원 |
| Legacy projection | `src/catalog/legacyAdapter.js` | 모듈 로드 시 한국어로 평탄화; palette 안정 ID 소실 |
| Discovery/search | `src/catalog/discovery.js`, `src/catalog/discoveryUrl.js` | ko/en 중심 검색, prototype key URL crash 가능 |
| Header/UI | `index.html`, `src/components/header.js` | `lang="ko"` 고정, 언어 메뉴·locale 상태 없음 |
| Inspector artifacts | `src/utils/inspectorState.js`, `src/utils/designSpecGenerator.js` | locale context 없음; 사람용 문구와 기계 키가 분리되지 않음 |
| Styling/CJK | `src/styles/*` | `:lang()`·CJK별 font/긴 문자열 검증 없음 |
| Tests/build gates | `tests/*`, `package.json` | 현재 190개 Node 테스트는 통과하나 bounds/locale/CJK/키 불변성 gate 없음 |

## 5. Agent Allocation and Rationale

| Report | Perspective | Rationale |
| --- | --- | --- |
| `sub_audit_01_tuner_contract_ui.md` | Tuner contract/UI | 999px 데이터 흐름, 시각 적용 범위, 전환 정책과 헤더 UI를 집중 점검 |
| `sub_audit_02_i18n_arch_runtime.md` | i18n architecture/runtime | locale schema, 상태·검색·adapter·artifact·번들 및 원자적 전환 구조 점검 |
| `sub_audit_03_security_resilience.md` | Security/resilience | 입력 상한, DOM/CSS 출력 경계, URL 복원력, stale state와 다운로드 경계 점검 |

세 보고서는 서로 다른 관점에서 독립 작성된 뒤 SHA-256으로 봉인했다. 메인 감사자는 모든 Major finding의 근거를 다시 열거나 명령을 재실행했다.

## 6. Immutable Source Report Manifest

- Manifest: `/home/eunho1/Projects/web/design_sample_selector/docs/multi_audit/11/source_report_manifest.json`
- Manifest Sidecar: `/home/eunho1/Projects/web/design_sample_selector/docs/multi_audit/11/source_report_manifest.sha256.json`
- Final Manifest SHA-256: `088e2ce39437633520b19adc501906248190d8494f4fe13b2e5730372d84e459`
- `missing_source_reports`: `[]`

| Report | Perspective | SHA-256 | Size | Completion | Supplement Of |
| --- | --- | --- | ---: | --- | --- |
| `sub_audit_01_tuner_contract_ui.md` | Tuner contract/UI | `add0d341a169a40515b4f139755f12168ed7cc6c6991316a8a99e1db0353fb0c` | 26,858 B | Complete/Sealed | None |
| `sub_audit_02_i18n_arch_runtime.md` | i18n architecture/runtime | `2aff63ffed377bc3fb5659ccfc364c2a55156d1968b70dca29548be93fdafffe` | 32,119 B | Complete/Sealed | None |
| `sub_audit_03_security_resilience.md` | Security/resilience | `4245c96ba186cf68ba2524b4f6be23dd3fa604028653c52c386f8eb5719d674f` | 37,468 B | Complete/Sealed | None |

`report_integrity.py finalize` 후 `verify`를 통과했다. 최종 보고서 저장 후 다시 검증한다.

## 7. Evidence and Commands

### Executed checks

| Check | Result |
| --- | --- |
| `npm test` | 190/190 PASS, fail 0 |
| 관련 5개 테스트 파일 집중 실행 | 67/67 PASS |
| 카탈로그 validator | errors 0, 기존 legacy warnings 56 |
| theme CSS freshness | PASS |
| `npm audit --omit=dev --offline` | 취약점 0 |
| `report_integrity.py verify` | source report 3/3 verified, missing 0 |
| tracked diff | 시작/통합 전 모두 empty; 감사 디렉터리만 untracked |

Vite build와 Chrome 시각 감사는 이번 audit-only 쓰기 경계에서 생성물 또는 런타임 변경을 만들 수 있어 재실행하지 않았다. 직전 감사에서 보고된 빌드/Chrome 성공은 이번 finding의 반증이 아니다. 현재 190개 테스트가 모두 통과해도 `999px`, locale 미구현, URL prototype crash는 별도의 직접 probe로 재현된다.

### Direct probes and source evidence

- `src/catalog/packs/expansion/authoring.js:136,220,370-387`: 두 expansion grammar의 `radius: 999`가 `tokens.radius`와 `defaultTweaks.borderRadius` 양쪽으로 투영된다.
- 이 grammar를 공유하는 8개 스타일은 `op-art`, `space-age`, `disco-glam`, `seventies-groovy`, `cyber-y2k`, `kawaii-pixel-web`, `scene-core-web`, `mcbling-gloss`다.
- 직접 카탈로그 scan 결과 상한 위반은 border radius에만 존재했고 다른 tweak 필드는 0건이었다.
- `src/catalog/validation/rules.js:349-365`와 `src/state/appState.js:254-260`은 최대값을 검사하지 않는다. 직접 state probe는 999를 수용했다.
- 생성기 직접 probe에서 `op-art`는 CSS에 `999px`, Markdown에 live/default `999px`, DTCG에 `{ value: 999, unit: "px" }`를 생성했다. 같은 Markdown은 허용 범위를 `0px ~ 64px`로 표시한다.
- `src/components/detailView.js:400-458,772-775`는 값 999를 `max="64"` slider에 렌더하고 `--theme-radius`와 `--tweak-radius`를 동시에 갱신한다.
- `src/styles/interactive.css:2749-2805`는 `.archetype-unit`과 38개 하위 surface/control selector에 radius를 `!important`로 강제한다.
- `index.html:2`는 `lang="ko"`로 고정돼 있고 AppState에 locale field가 없다.
- localized object 1,316개 중 한국어는 1,316개, 영어는 708개(53.8%), 일본어·중국어 간체·번체는 각각 0개다. 추가 사람용 plain field도 최소 1,452개다.
- `src/catalog/legacyAdapter.js:8-34`는 canonical localized data를 한국어 중심 평면 객체로 고정하고 palette 안정 ID를 버린다.
- 합성 일본어 palette name probe는 CSS custom property가 네 번 `--color-`로 충돌하고 DTCG palette key가 빈 문자열이 되는 것을 확인했다.
- `src/utils/inspectorState.js:15-43`의 context와 모든 generator 호출에는 locale이 없다.
- `src/catalog/discoveryUrl.js:56-66` 직접 probe에서 `f=__proto__:x`, `constructor`, `toString` 모두 `TypeError: activeFacets[facetId].push is not a function`을 발생시켰다.
- `src/components/detailView.js:527-536`은 생성된 CSS/Markdown/JSON을 초기 `innerHTML` 안에 직접 삽입하고, `src/utils/designSpecGenerator.js:277`은 Markdown에 `<span style>`을 생성한다. 현재 정적 카탈로그가 공격 가능성을 제한하지만 향후 번역 리소스 도입 시 신뢰 경계가 확대된다.

## 8. Coverage Gap Check

| Work Surface / Audit Question | Assigned Agents | Evidence | Coverage | Follow-up |
| --- | --- | --- | --- | --- |
| radius source·상한·artifact 전파 | A01, A02, A03 + Main | source, scan, state/generator probes | Covered | FIN-F001 수정·회귀 테스트 |
| CSS 전역 propagation | A01, A02, A03 + Main | selector/DOM 재검토 | Covered | FIN-F002 semantic scope 재설계 |
| 테마 전환 reset/preserve 정책 | A01, A02 + Main | 전환 handler 재검토 | Covered for actual / Not defined for expected | 명세 결정 필요 |
| 5-locale catalog coverage/migration | A01, A02, A03 + Main | contract와 1,316개 필드 계수 | Covered | schema·fallback·completeness gate 정의 |
| 상단 언어 메뉴·UI·ARIA | A01, A02 + Main | header와 hard-coded string 조사 | Covered for absence | 구현 후 런타임 검증 |
| Inspector·machine ID 불변성 | A01, A02, A03 + Main | generator/context와 합성 CJK probe | Covered | stable ID 계약과 테스트 |
| 원자적 locale 전환·상태/포커스 유지 | A02, A03 + Main | 현재 의존성·cache 구조 조사 | Partially Covered | 구현 후 rapid-switch/runtime test |
| 번역 문자열 context safety | A03 + Main | raw sink와 생성기 재검토 | Covered | 출력 컨텍스트별 escape 적용 |
| URL locale/external input | A03 + Main | malicious URL 직접 probe | Covered | null-prototype/allowlist/length limit |
| locale bundle 증분 | A02 + Main | 현재 budget/manifest 분석 | Partially Covered | 구현 후 Vite budget 실측 |
| CJK font·긴 문자열·overflow | A01, A02 + Main | CSS 정적 조사 | Partially Covered | 5 locale × viewport Chrome 검증 |
| 실제 번역 품질 | None | 리소스 없음 | Not Covered | 전문 검수 또는 승인된 번역 corpus |

핵심 목표의 미구현 영역과 Major finding이 있으므로 Coverage Gap 자체도 PASS를 허용하지 않는다. 보완 보고서는 필요하지 않았다. 현재 결함과 구조 부재는 세 보고서와 메인 재검증으로 충분히 확정되며, 미래 구현의 시각·번들 품질은 구현 후에만 검증 가능하다.

## 9. Canonical Findings

### [FIN-F001] Pill radius와 tuner radius가 같은 값으로 합쳐져 999px가 런타임·artifact에 유입됨

- Sources: A11-IMP-F001; A01-F004; SEC-F001
- Areas: Catalog contract, state, tuner, inspector artifacts
- Severity: Major
- Status: Confirmed / Needs Fix
- Summary: 장식용 pill 표현의 `999px`가 조절 가능한 border radius 기본값으로 재사용된다.
- Verified Evidence: `authoring.js`의 grammar→token/defaultTweaks 이중 투영, 8개 스타일 scan, state/generator direct probe.
- Expected Basis: 문서와 slider가 정의한 border radius 범위 `0..64px`.
- Actual: validator와 state가 999를 수용하고 CSS·Markdown·DTCG가 그대로 방출한다.
- Impact: slider 계약 위반, UI와 artifact 모순, 테마 진입 즉시 비정상 값 노출.
- Required Action: theme surface/control/pill radius를 안정 ID로 분리하고 공통 `TUNER_LIMITS`를 catalog ingestion·state·DOM·generator 모두에서 강제한다. 999 theme token을 단순 clamp하지 말고 pill semantic token으로 이동한다.
- Re-audit Method: 120 styles scan, state boundary tests, slider DOM tests, CSS/Markdown/DTCG 값 일치 테스트.
- Synthesis Rationale: 세 보고서와 메인 probe가 동일 데이터 경로를 독립 확인했다.

### [FIN-F002] 단일 radius tweak가 전체 preview의 39개 surface에 강제 적용됨

- Sources: A11-DBG-F001; A01-F004; SEC-F001
- Areas: CSS architecture, visual stability
- Severity: Major
- Status: Confirmed / Needs Fix
- Summary: `.archetype-unit`과 38개 하위 카드·버튼·입력·프레임이 같은 radius와 border width를 `!important`로 받는다.
- Verified Evidence: `interactive.css:2749-2805`, `detailView.js:772-778`.
- Expected Basis: 조절의 의미와 영향을 예측할 수 있어야 하고 테마 고유 component geometry를 보존해야 한다.
- Actual: 하나의 slider가 root와 거의 모든 surface/control geometry를 덮어쓴다.
- Impact: 사용자가 보고한 “화면 전체가 둥글어짐”을 직접 설명하며 테마 구분도 훼손한다.
- Required Action: opt-in semantic selector 또는 component token으로 범위를 좁히고 broad `!important` propagation을 제거한다.
- Re-audit Method: 8개 문제 스타일과 대표 5 archetype에서 before/after screenshot·computed style·interaction 검증.
- Synthesis Rationale: CSS와 runtime 적용 코드가 증상을 완전히 재현한다.

### [FIN-F003] 테마·카테고리·아키타입 전환 시 tweak reset/preserve 계약이 없음

- Sources: A11-IMP-F002; A01-F005
- Areas: State transition, product contract
- Severity: Major
- Status: Needs Spec Clarification
- Summary: 테마/카테고리/global cycle은 대상 기본값으로 reset하지만 archetype 전환은 기존 tweak를 보존한다.
- Verified Evidence: `detailView.js:824-862,1191-1215`, `selection.js:38`.
- Expected Basis: 사용자 의도 보존과 전환의 결정성.
- Actual: 현재 동작은 코드에 있으나 문서화된 상태 전환 행렬이 없다.
- Impact: locale 전환까지 추가하면 reset·stale state·focus loss가 더 복잡해진다.
- Required Action: `spec.md`에 theme/category/archetype/locale별 preserve/reset 행렬을 먼저 정한다. 권장안은 locale 전환이 선택·tweak·mock runtime·Inspector tab·scroll/focus를 모두 보존하는 것이다.
- Re-audit Method: 전환 행렬 기반 table-driven state tests와 rapid-switch browser test.
- Synthesis Rationale: actual은 확정되지만 expected 정책은 사용자의 제품 결정이 필요하다.

### [FIN-F004] 5개 locale schema·콘텐츠·fallback·completeness 계약이 없음

- Sources: A11-SPEC-GAP-F001; A01-F001; SEC-F004
- Areas: Catalog schema, localization contract
- Severity: Major
- Status: Confirmed absence / Needs Spec Clarification
- Summary: 현재 localized contract는 한국어와 일부 영어만 표현한다.
- Verified Evidence: `LocalizedText` typedef/validator와 1,316개 localized object 계수.
- Expected Basis: 사용자 요청 `ko/en/ja/zh-CN/zh-TW`.
- Actual: en 53.8%, ja/zh-CN/zh-TW 0%; fallback·missing-key·bundle-failure 정책 없음.
- Impact: 언어별 부분 번역, 혼합 언어, silent fallback, 배포 후 누락 가능.
- Required Action: locale ID, default/detection/persistence precedence, fallback chain, 필수 필드, 번역 pack 검증과 실패 시 last-known-good 정책을 명세한다.
- Re-audit Method: 120×5 catalog completeness/key parity 검사와 missing/invalid pack failure tests.
- Synthesis Rationale: 데이터와 계약의 부재가 정량 확인됐다.

### [FIN-F005] locale 상태와 상단 언어 메뉴, 검색·정렬·ARIA 연결이 없음

- Sources: A11-UI-F001; A01-F002; SEC-F004
- Areas: App state, header, discovery, accessibility
- Severity: Major
- Status: Confirmed / Needs Fix after spec
- Summary: 문서 언어가 한국어로 고정되고 locale은 AppState의 허용 field가 아니다.
- Verified Evidence: `index.html:2`, `appState.js`, `header.js`, `discovery.js`.
- Expected Basis: 메인 상단에서 5개 언어 전환.
- Actual: locale menu/resource selection/document lang/persistence가 모두 없다.
- Impact: visible UI와 접근성 이름·검색 결과가 동기화될 수 없다.
- Required Action: canonical locale state와 whitelist를 만들고, native `<select>` 기반 endonym 메뉴를 header에 배치하며 `document.documentElement.lang`, 메시지, 검색 normalization, 정렬기를 한 transaction에서 갱신한다.
- Re-audit Method: 5 locale keyboard/AX test, reload·URL·storage precedence, search/sort tests.
- Synthesis Rationale: UI 하나를 추가하는 문제가 아니라 상태·검색·접근성의 공통 의존성이다.

### [FIN-F006] 번역 display name이 CSS/DTCG machine key로 변환되고 palette 안정 ID가 소실됨

- Sources: A01-F003; SEC-F006
- Areas: Data model, artifact stability
- Severity: Major
- Status: Confirmed / Needs Fix
- Summary: legacy adapter가 palette ID를 버리고 display name만 남겨 generator가 이를 slugify한다.
- Verified Evidence: `legacyAdapter.js`, synthetic Japanese palette direct probe.
- Expected Basis: locale 변경은 machine-readable syntax와 key identity를 바꾸지 않아야 한다.
- Actual: 비 ASCII 이름은 빈/충돌 key를 만든다.
- Impact: CSS custom property 충돌, DTCG token overwrite, 언어 전환 전후 diff 불안정.
- Required Action: canonical stable ID를 adapter와 generator 끝까지 보존한다. CSS property/custom-property, selectors, IDs, data attrs, DTCG structural keys, filename은 locale-neutral로 유지한다.
- Re-audit Method: 5 locale에서 CSS/DTCG key set byte-equivalence와 display metadata 변화 분리 테스트.
- Synthesis Rationale: 실제 합성 CJK 입력으로 충돌이 재현됐다.

### [FIN-F007] Inspector artifact가 locale context와 원자적 갱신 epoch를 갖지 않음

- Sources: A11-DOC-F001; A01-F005; SEC-F005
- Areas: Inspector, state consistency, async resilience
- Severity: Major
- Status: Confirmed structural gap / Needs Fix
- Summary: Inspector context는 style/archetype/device/tweaks만 포함하고 locale을 모른다.
- Verified Evidence: `inspectorState.js:15-43`, generator signatures와 render subscription 재검토.
- Expected Basis: Live CSS/HTML/Markdown/DTCG가 같은 선택과 locale snapshot을 표시해야 한다.
- Actual: locale 변경을 의존성으로 추적할 수 없고 pane별 stale output을 막을 epoch/cache key가 없다.
- Impact: 혼합 언어 artifact, stale pane, focus·tab·mock state 손실 가능.
- Required Action: locale을 Inspector context/cache key/render epoch에 포함하고 네 pane을 한 immutable snapshot에서 생성한다. 사람용 CSS comment, Markdown prose, HTML visible/ARIA copy, DTCG description/display metadata만 번역한다.
- Re-audit Method: rapid locale toggle, stale task cancellation, pane snapshot coherence, state/focus preservation test.
- Synthesis Rationale: 미래 race의 발생 여부는 구현 후 확인해야 하지만 이를 막을 현재 구조가 없다는 사실은 확정됐다.

### [FIN-F008] 향후 번역 문자열을 받을 DOM/CSS 출력 경계가 context-safe하지 않음

- Sources: SEC-F002
- Areas: DOM injection, content generation
- Severity: Major
- Status: Confirmed / Needs Fix before locale expansion
- Summary: 초기 detail render가 generated artifact와 여러 catalog string을 raw `innerHTML` template에 넣는다.
- Verified Evidence: `detailView.js:274,527-536,699-724`; `designSpecGenerator.js:277`; `spec.md:294`.
- Expected Basis: spec의 safe DOM injection 불변조건.
- Actual: 후속 refresh는 일부 `textContent`를 쓰지만 초기 sink는 raw HTML context다.
- Impact: 현재 정적·신뢰 catalog에서는 exploitability가 제한되나 외부 번역 pack/기여 workflow가 생기면 trust boundary가 확대된다.
- Required Action: text node/code pane은 `textContent`, 구조화 DOM은 `createElement`, CSS/HTML/Markdown/DTCG는 각 출력 컨텍스트별 escaping과 size limit을 적용한다.
- Re-audit Method: `<`, `&`, quotes, bidi, CSS-breaking strings를 포함한 5 locale malicious corpus tests.
- Synthesis Rationale: 단독 보안 finding이나 spec과 실제 sink가 명백히 충돌한다.

### [FIN-F009] 현재 green test가 radius bounds와 locale 품질을 검증하지 않음

- Sources: A01-F006; SEC-F008
- Areas: Test/build quality gates
- Severity: Major
- Status: Confirmed / Needs Fix
- Summary: 190개 Node 테스트는 통과하지만 발견된 결함과 5-locale 요구를 잠그는 gate가 없다.
- Verified Evidence: full/focused test PASS와 별도 direct probes의 실패.
- Expected Basis: 실패 모드 중심 회귀 검증과 기존 gzip budget 유지.
- Actual: bounds, locale completeness, machine key invariance, CJK layout, rapid-switch, context escaping tests가 없다.
- Impact: 정상 build/test가 제품 결함을 숨기는 false green 상태다.
- Required Action: locale bundle을 가능하면 lazy 분리하고 기존 초기 JS/CSS 예산을 실측한다. 위 실패 모드를 CI/Chrome matrix에 추가한다.
- Re-audit Method: Node + Vite budget + 5 locale × representative viewports Chrome/AX suite.
- Synthesis Rationale: 현재 테스트 성공과 직접 재현 결함이 동시에 존재한다.

### [FIN-F010] Discovery URL facet parser가 prototype key로 crash함

- Sources: SEC-F003
- Areas: External input, availability
- Severity: Major
- Status: Confirmed / Needs Fix
- Summary: `activeFacets={}`에 임의 facet ID를 index해 inherited property에서 `.push()`를 호출한다.
- Verified Evidence: `__proto__`, `constructor`, `toString` query direct probes 모두 TypeError.
- Expected Basis: GitHub Pages를 포함한 URL 진입은 비신뢰 입력이며 malformed URL로 앱이 중단되면 안 된다.
- Actual: crafted URL이 bootstrap/popstate 경로를 중단할 수 있고 query 길이 상한도 없다.
- Impact: 링크만으로 discovery 화면 가용성 저하. 향후 locale URL parameter 추가 시 입력 표면이 더 넓어진다.
- Required Action: allowlisted facet IDs, `Object.create(null)` 또는 `Map`, own-property 검사, query/value 길이 상한과 graceful ignore를 적용한다.
- Re-audit Method: prototype-key·oversize·duplicate·invalid UTF-8 equivalent URL corpus와 bootstrap/popstate tests.
- Synthesis Rationale: 사용자 주목 영역에 인접한 독립적 현재 런타임 결함이며 직접 재현됐다.

### [FIN-F011] CJK typography와 긴 문자열에서 layout 안정성을 보장할 근거가 없음

- Sources: A11-UI-F002; A01-F007
- Areas: Responsive UI, typography
- Severity: Minor
- Status: Probable / Needs Verification after implementation
- Summary: `:lang()` 또는 CJK별 font strategy와 long-label fixture가 없다.
- Verified Evidence: CSS/테스트 정적 조사; header flex-wrap/mobile column은 메뉴 배치 가능성을 보임.
- Impact: 일본어·중국어 메뉴, button, table, inspector tab에서 wrap/overflow가 발생할 수 있다.
- Suggested Action: locale-neutral layout을 우선하고 필요한 경우 `:lang(ja)`, `:lang(zh-CN)`, `:lang(zh-TW)` font fallback을 추가한다.
- Re-audit Method: 5 locales × 320/768/1280/1920 widths, 200% zoom, keyboard focus와 screenshot diff.
- Synthesis Rationale: 구현 전이므로 실제 실패가 아니라 검증 공백이다.

### [FIN-F012] CSS value validator와 generator consumer의 허용 문법이 완전히 일치하지 않음

- Sources: SEC-F007
- Areas: Validation, generated CSS
- Severity: Minor
- Status: Probable / Needs Fix
- Summary: 일부 gradient/value 검증이 consumer보다 느슨하다.
- Verified Evidence: catalog validator와 style/template consumer 비교.
- Impact: 향후 번역·catalog 확장 시 예상하지 못한 CSS 문자열이 artifact로 전파될 수 있다.
- Suggested Action: 가능한 값은 구조화 token으로 제한하고 consumer와 같은 parser/allowlist를 공유한다.
- Re-audit Method: valid/invalid CSS corpus와 generated artifact syntax tests.
- Synthesis Rationale: 현재 고정 catalog에서는 영향이 제한적이지만 경계 확장 전에 정렬해야 한다.

## 10. Critical/Major Direct Re-verification

| Canonical Finding | Directly Checked By Main | Evidence Re-opened or Command Re-run | Result | Gate Impact |
| --- | --- | --- | --- | --- |
| FIN-F001 | Yes | grammar/validator/state/generator + direct probes | Confirmed | PASS 차단 |
| FIN-F002 | Yes | detail setter와 39 selector 재검토 | Confirmed | PASS 차단 |
| FIN-F003 | Yes | theme/category/archetype transition handlers | Confirmed actual; expected unclear | PASS 차단 |
| FIN-F004 | Yes | typedef/validator + 1,316 object count | Confirmed absence | PASS 차단 |
| FIN-F005 | Yes | html/AppState/header/discovery | Confirmed absence | PASS 차단 |
| FIN-F006 | Yes | adapter/generator + synthetic Japanese probe | Confirmed | PASS 차단 |
| FIN-F007 | Yes | Inspector context/generator/subscription | Confirmed structural gap | PASS 차단 |
| FIN-F008 | Yes | initial innerHTML sinks + spec invariant | Confirmed | PASS 차단 |
| FIN-F009 | Yes | 190 tests PASS + missing-failure direct probes | Confirmed | PASS 차단 |
| FIN-F010 | Yes | URL parser + 3 malicious query probes | Confirmed | PASS 차단 |

Critical finding은 없었다. 모든 Major finding을 메인 감사자가 직접 재검증했다.

## 11. Cross-Report Conflicts

실질적인 증거 충돌은 없었다. 다만 다음 표현 차이를 통합 판정에서 조정했다.

- locale 전환 race/stale 상태는 아직 구현이 없으므로 “발생 확인”이 아니라 “현재 구조에 예방 계약이 없음”으로 한정했다.
- raw `innerHTML`은 현재 정적 catalog만으로 즉시 원격 exploit이 확인된 것은 아니다. 따라서 Critical이 아니라 locale 확장 전에 해소해야 할 Major trust-boundary finding으로 판정했다.
- 기존 CHANGELOG는 모든 카드·컨테이너·버튼에 tweak를 강제하는 동작을 의도적 변경으로 기록한다. 그러나 현재 사용자 증상과 `0..64` 계약에 충돌하므로 기존 의도 자체를 현재 승인 요구로 간주하지 않았다.
- 전환 시 reset과 preserve 중 어느 것이 정답인지는 문서가 없으므로 임의 결정하지 않고 `Needs Spec Clarification`으로 유지했다.

## 12. Finding Adjudication Ledger

| Source Finding | Decision | Canonical Finding | Rationale |
| --- | --- | --- | --- |
| A11-IMP-F001 | Merged | FIN-F001 | 999 source/default/state/artifact 경로 확인 |
| A11-DBG-F001 | Merged | FIN-F002 | broad CSS propagation 확인 |
| A11-IMP-F002 | Accepted | FIN-F003 | actual transition은 확인, expected는 미정 |
| A11-SPEC-GAP-F001 | Merged | FIN-F004 | 5-locale 계약 부재 |
| A11-UI-F001 | Merged | FIN-F005 | locale state/menu 부재 |
| A11-DOC-F001 | Merged | FIN-F007 | artifact locale context 부재 |
| A11-UI-F002 | Merged | FIN-F011 | CJK 시각 검증 공백 |
| A01-F001 | Merged | FIN-F004 | schema/migration/completeness 부재 |
| A01-F002 | Merged | FIN-F005 | bootstrap/search/UI wiring 부재 |
| A01-F003 | Merged | FIN-F006 | display name을 machine key로 사용 |
| A01-F004 | Merged | FIN-F001, FIN-F002 | 999 데이터와 broad propagation 양쪽 근거 |
| A01-F005 | Merged | FIN-F003, FIN-F007 | 전환 계약과 atomic locale transaction 공백 |
| A01-F006 | Merged | FIN-F009 | locale build/budget/test gate 부재 |
| A01-F007 | Merged | FIN-F011 | CJK layout/font 검증 부재 |
| SEC-F001 | Merged | FIN-F001, FIN-F002 | 상한 부재와 광범위 적용 |
| SEC-F002 | Accepted | FIN-F008 | raw DOM/style trust boundary 확인 |
| SEC-F003 | Accepted | FIN-F010 | prototype-key crash 직접 재현 |
| SEC-F004 | Merged | FIN-F004, FIN-F005 | locale schema/state/recovery 부재 |
| SEC-F005 | Merged | FIN-F007 | stale locale/cache/focus 위험 구조 |
| SEC-F006 | Merged | FIN-F006 | token key와 output limit 문제 |
| SEC-F007 | Accepted | FIN-F012 | validator/consumer drift |
| SEC-F008 | Merged | FIN-F009 | 테스트가 실패 모드를 놓침 |

Rejected finding과 unresolved source finding은 없다. `Needs Spec Clarification`은 FIN-F003과 FIN-F004의 제품 계약에 명시했다.

## 13. Required Actions Before Passing

우선순위 순서다.

1. **계약부터 동기화**
   - `spec.md`/`designs.md`/`DESIGN_DECISIONS.md`에 tuner semantic radius, 상한, theme/category/archetype/locale 전환 행렬을 기록한다.
   - locale ID는 `ko`, `en`, `ja`, `zh-CN`, `zh-TW`를 권장한다. URL→localStorage→browser preference→`ko` 같은 precedence와 fallback을 명시적으로 결정한다.
2. **radius 결함 수정**
   - 공유 `TUNER_LIMITS`를 만들고 catalog validation, AppState, input, generator에 동일 적용한다.
   - `pillRadius`/`controlRadius`/`surfaceRadius`처럼 의미를 분리하고 999를 user-tweak default로 투영하지 않는다.
   - 39 selector `!important` 강제를 semantic opt-in으로 축소한다.
3. **locale-neutral canonical model 구축**
   - stable ID와 localized display data를 분리한다.
   - UI message bundle과 catalog content bundle을 분리하고 모든 locale의 key parity/completeness를 검증한다.
   - 초기 bundle 여유가 작으므로 locale별 lazy pack을 우선 검토하고 실패 시 last-known-good locale을 유지한다.
4. **원자적 locale runtime 추가**
   - AppState에 whitelist된 locale을 추가하고 `document.lang`, header menu, UI/ARIA, discovery search/sort, Inspector를 하나의 locale snapshot으로 갱신한다.
   - locale 변경은 theme, tweaks, mock runtime, Inspector tab, scroll, focus를 보존하도록 권장한다.
5. **Inspector human text와 machine syntax 분리**
   - 번역 대상: CSS comments, Markdown prose, HTML visible/ARIA text, DTCG `$description`/display metadata.
   - 비번역 대상: CSS properties/custom-property IDs, selectors, HTML IDs/data attributes, DTCG structural keys, file names.
6. **출력·입력 경계 강화**
   - raw string을 code pane에는 `textContent`로 넣고 각 artifact context에 맞는 escape·size limit을 적용한다.
   - Discovery URL parser의 prototype key와 길이 문제를 고친다.
7. **회귀 gate 추가**
   - 120 styles bounds, 120×5 completeness, key invariance, rapid locale transition, malicious translation corpus를 Node tests에 추가한다.
   - Vite gzip budget과 5 locales × representative viewport Chrome visual/AX test를 실행한다.

별도 대형 i18n framework 도입이 필수라는 근거는 없다. 현재 vanilla 구조에서도 `locale store + message/catalog packs + selector + stable IDs`의 작은 계층으로 구현 가능하다. 라이브러리를 도입한다면 초기 번들 예산과 GitHub Pages base path에서의 lazy chunk 로딩을 먼저 검증해야 한다.

## 14. Accepted and Remaining Risks

명시적으로 승인된 `Accepted Risk`는 없다.

남은 위험:

- 번역 corpus와 인간 검수가 없어 실제 번역 품질은 판단할 수 없다.
- locale pack 구현 전이라 CJK visual/font/overflow와 bundle delta는 미검증이다.
- GitHub Pages 운영 CSP·Google Fonts 정책은 실제 URL과 응답 헤더 없이 확인할 수 없다.
- 현재 정적 catalog는 raw sink의 공격 가능성을 줄이지만 future translation source가 외부화되면 위험도가 상승한다.
- FIN-F010은 locale 기능과 별개의 기존 URL 가용성 결함이지만 public GitHub Pages 환경에서는 crafted link 진입이 가능하다.

## 15. Clarifications and Inconclusive Areas

구현 전에 제품 owner가 결정할 항목:

1. locale 전환 시 URL에 locale을 반영할지, localStorage와 browser language 중 무엇을 우선할지.
2. 번역 누락 시 한국어 fallback, 영어 fallback, 또는 pack 전체 거부 중 어떤 정책을 사용할지.
3. 테마 전환 시 사용자가 조절한 tweak를 유지할지 대상 테마 기본값으로 reset할지. locale 전환은 보존을 권장한다.
4. CSS/HTML artifact의 주석·visible copy까지 번역할지, machine-readable syntax는 고정한다는 원칙을 승인할지.
5. 중국어 locale을 `zh-CN`/`zh-TW`로 고정할지 `zh-Hans`/`zh-Hant`로 모델링할지.

이 결정들이 없더라도 FIN-F001, FIN-F002, FIN-F006, FIN-F008, FIN-F010의 기술 결함 수정은 진행 가능하다.

## 16. Re-audit Checklist

- [ ] 8개 문제 스타일의 tuner default가 `0..64`이고 pill visual은 유지된다.
- [ ] catalog/AppState/input/generator가 같은 `TUNER_LIMITS`를 사용한다.
- [ ] radius 조절이 승인된 semantic surfaces에만 적용되고 39개 broad override가 제거된다.
- [ ] 전환 상태 행렬이 문서와 table-driven tests에 일치한다.
- [ ] `ko/en/ja/zh-CN/zh-TW` message/catalog pack의 key parity와 필수 필드가 100%다.
- [ ] locale 변경이 theme/tweaks/mock state/Inspector tab/scroll/focus를 보존한다.
- [ ] `document.lang`, visible UI, ARIA, search, sort, Inspector 네 pane이 같은 locale snapshot을 사용한다.
- [ ] 5 locale의 CSS/DTCG machine key set이 동일하고 사람용 metadata만 바뀐다.
- [ ] 악성/특수 번역 문자열이 DOM·CSS·HTML·Markdown·JSON 경계를 깨지 않는다.
- [ ] prototype-key·oversize URL이 crash 없이 무시/정규화된다.
- [ ] Node tests, catalog validator, Vite build, gzip budget, dependency audit가 통과한다.
- [ ] Chrome에서 5 locale × representative widths × key theme/archetype matrix를 시각·AX·interaction 검사한다.
- [ ] GitHub Pages base path에서 lazy locale chunks와 retry/fallback이 정상 동작한다.
- [ ] 운영 URL이 있으면 CSP와 Google Fonts response/header 정책을 별도 검증한다.

## 17. Final Decision

**REWORK REQUIRED / Needs Spec Clarification**

핵심 증상은 재현 가능한 현재 결함이다. `999px`가 조절 가능한 기본값으로 잘못 유입되고, 하나의 radius가 root와 38개 하위 요소에 강제 적용된다. 동시에 5개 언어 기능은 단순 메뉴 추가가 아니라 locale 상태, catalog schema, stable machine IDs, Inspector snapshot, DOM/output 안전 경계와 테스트 gate를 함께 도입해야 한다.

구조화된 구현은 가능하다. 다만 FIN-F001·F002·F004~F010이 해소되고 FIN-F003의 상태 정책이 문서화되기 전에는 PASS로 판정할 수 없다. 이번 판정은 제품 배포 승인이나 전체 저장소 무결성 보장이 아니라 명시된 감사 범위에 대한 결과다.

## 18. Coder Handoff

`/home/eunho1/Projects/web/design_sample_selector/docs/multi_audit/11/final_audit_report_11.md`를 먼저 읽고, 각 finding을 프로젝트 문서와 실제 코드에 대조하여 검증한 뒤 우선순위대로 수정하세요. 계약 변경이 필요하면 관련 문서를 먼저 갱신하고, 수정 후 테스트·빌드·재감사 증거를 기록하세요.
