# D3D Re-audit Report — Audit 11

- Re-audit Date: 2026-08-31 (Asia/Seoul)
- Project Root: `/home/eunho1/Projects/web/design_sample_selector`
- Reference Standard: `AI_AUDIT_DOC_STANDARD.md`
- Original Final Report: `docs/multi_audit/11/final_audit_report_11.md`
- Remediation Evidence: `docs/multi_audit/11/re_audit_evidence_11.md`
- Re-audit Mode: 단일 증거 기반 재감사, 제품 수정 없음
- Final Decision: **REWORK REQUIRED — i18n 범위 미통과**

## 1. Audit Scope

이번 재감사는 Audit 11의 FIN-F001~FIN-F012 해결 주장과 다음 사용자 목표를 실제 코드·테스트·빌드·Crostini Chrome에서 대조했다.

- `999px` pill radius와 조절 가능한 surface radius 분리
- broad radius propagation 제거와 120개 테마 안정성
- `ko`, `en`, `ja`, `zh-CN`, `zh-TW` 언어 선택
- visible UI, ARIA, 검색·정렬, Detail과 Inspector의 locale 일관성
- Live CSS, Live HTML, Markdown, DTCG design token의 locale 반영과 machine-key 불변성
- URL 입력, output boundary, bundle/Pages closure, 기존 회귀 게이트

확인한 주요 문서:

- `spec.md`, 특히 §5.10
- `designs.md`
- `DESIGN_DECISIONS.md`, Decision 021
- `README.md`, `CHANGELOG.md`, `audit_roadmap.md`
- `docs/multi_audit/11/final_audit_report_11.md`
- `docs/multi_audit/11/re_audit_evidence_11.md`

확인한 주요 구현:

- `src/tuner/contract.js`
- `src/i18n/contract.js`, `src/i18n/index.js`, `src/i18n/catalogOverlay.js`, locale pack 5개
- `src/components/header.js`, `mainView.js`, `discoveryMarkup.js`, `detailView.js`, `archetypeTemplates.js`
- `src/utils/inspectorState.js`, `src/utils/designSpecGenerator.js`
- `src/catalog/discoveryUrl.js`, `src/catalog/legacyAdapter.js`
- `tests/auditRemediation11.test.js`
- Chrome QA 스크립트와 저장된 Audit 11 artifact

원본 source report 3개와 manifest를 다시 검증했으며 SHA-256 불일치는 없었다.

## 2. Excluded Scope

- 일본어·중국어 번역의 전문적 표현 품질과 문화권별 용어 감수
- 오디오 장치가 없는 Crostini headless 환경의 실제 소리 출력
- 실제 운영 GitHub Pages 응답의 CSP·security header·Google Fonts 정책
- 배포, 커밋, 푸시
- 사용자 일반 Chrome profile과 로그인 세션

전문 번역 감수는 제외했지만, 번역 리소스의 구조적 부재·공통 placeholder 대체·고정 한국어 잔존은 감수 문제가 아니라 기능 완성도 문제이므로 감사 범위에 포함했다.

## 3. Pass 1: Implementation Compliance Findings

### [FIN-F004 Re-audit #1] 5-locale catalog completeness가 실제 locale 콘텐츠를 보장하지 않음

- Pass: Implementation
- Pattern: SPEC-GAP-001 / implementation drift
- Area: i18n catalog schema and content
- Severity: Major
- Status: Needs Fix
- Summary: locale snapshot은 120개 style key를 만들지만 일본어·중국어 style/facet/palette 콘텐츠를 실제 번역 pack에서 제공하지 않는다.
- Evidence:
  - `src/i18n/catalogOverlay.js:8-31`은 비한국어 style name과 facet label을 canonical English로 대체한다.
  - 비한국어 summary는 모든 style에 `English name — designSummary`를 사용한다.
  - palette usage, characteristics, pros, cons는 locale별 공통 문장 하나로 대체한다.
  - locale pack 5개는 UI message 약 36개만 포함하고 120-style catalog 번역 record를 포함하지 않는다.
  - `validateLocaleSnapshot()`은 record 존재와 non-empty 여부만 검사하므로 placeholder도 completeness PASS가 된다.
- Expected: `spec.md:281-284`에 따라 locale별 catalog display overlay와 필수 field completeness가 실제 선택 locale 콘텐츠를 제공해야 한다.
- Actual: 5개 snapshot 구조는 존재하지만 ja/zh catalog의 대부분은 영어 또는 공통 placeholder다.
- Impact: “5개 언어 지원”과 “전문 번역 감수 전” 사이의 경계가 잘못 표현된다. 번역 품질을 감수할 실제 번역 원문 자체가 다수 존재하지 않는다.
- Suggested Fix: locale pack에 category/facet/style/palette의 실제 locale record를 두거나, 승인된 fallback field를 schema에 명시하고 completeness 결과에서 `translated`, `approved fallback`, `placeholder`를 구분한다.
- Re-audit Method: 120×5 field coverage matrix에서 placeholder와 fallback을 별도 집계하고, locale별 기대 script/언어 corpus를 검사한다.
- Owner: Coder + Human translator/reviewer
- Notes: 고유 디자인명 영문 유지가 필요하면 field 단위 예외 계약으로 기록할 수 있으나 summary·facet·palette·장단점 전체의 공통 placeholder는 번역 감수로 종결할 수 없다.

### [FIN-F005 Re-audit #1] visible UI와 ARIA가 선택 locale로 완전히 전환되지 않음

- Pass: Implementation
- Pattern: IMP-001
- Area: Header, Discovery, Gallery, Detail, accessibility
- Severity: Major
- Status: Needs Fix
- Summary: locale state와 상단 native select는 추가됐지만 다수 visible/ARIA/title/status 문자열이 한국어로 고정돼 있다.
- Evidence:
  - `src/components/header.js:36,61,74-100,108`의 home title, search clear label, view group/title, bookmark/confirm/compare title과 category navigation label.
  - `src/components/discoveryMarkup.js:33,43,48,76,95-105,136,141,155-164`의 chip 제거, 검색, count ARIA, facet state/legend, result status와 filter panel copy.
  - `src/components/mainView.js:63-68,98,157-181`의 empty state, gallery hint, card/bookmark ARIA.
  - `src/components/detailView.js:312-343,366-419,482-576`의 navigation, archetype/device/tuner/Inspector control copy.
  - 격리 Chrome `?lang=ja` direct DOM 점검에서 `<html lang="ja">`와 Japanese option 선택은 정상이지만 `갤러리 뷰 모드`, `결과 정렬`, `북마크 저장`, `세부 필터 10개`, `현재 활성 조건` 등 한국어가 남았다.
- Expected: `spec.md:283-284`의 visible UI/ARIA 일괄 locale 전환.
- Actual: 주요 heading과 일부 버튼만 message bundle을 사용하고 나머지는 한국어 literal이다.
- Impact: 스크린리더와 화면 언어가 혼합되고, locale 변경 후 기능의 의미가 일관되지 않는다.
- Suggested Fix: 사용자 노출 문자열 inventory를 만들고 message key를 화면 단위 namespace로 확장한다. visible text, `aria-label`, `title`, live status와 error/recovery copy를 같은 snapshot에서 해석한다.
- Re-audit Method: 5 locale 각각에서 DOM text와 accessibility name에 비승인 한국어가 없는지 검사하고, empty/filter/detail/split/recovery 상태를 모두 실행한다.
- Owner: Coder
- Notes: 브랜드명, canonical ID, 기술 약어처럼 번역하지 않을 항목은 allowlist로 분리한다.

### [FIN-F007 Re-audit #1] Inspector artifact locale 인자가 출력에 반영되지 않음

- Pass: Implementation
- Pattern: IMP-001 / DOC-BACKFILL-001
- Area: Live CSS, Live HTML, Markdown, DTCG
- Severity: Major
- Status: Needs Fix
- Summary: Inspector context에는 locale/epoch가 추가됐지만 generator와 HTML renderer가 이를 실제 사람용 출력 선택에 사용하지 않는다.
- Evidence:
  - `src/utils/designSpecGenerator.js:261`의 CSS generator는 `locale`을 받지만 CSS comment를 항상 영어로 생성한다.
  - `src/utils/designSpecGenerator.js:313-484`의 Markdown generator는 `locale`을 받지만 heading/prose가 영어와 한국어로 고정돼 있다.
  - `src/utils/designSpecGenerator.js:605`의 DTCG generator는 `locale`을 받지만 `$extensions.name`을 항상 `nameEn`으로 기록하고 locale-specific display metadata를 선택하지 않는다.
  - `src/components/archetypeTemplates.js:9`의 `getArchetypeHTML()`에는 locale 인자가 없고 preview visible copy에 한국어·영어 literal이 남는다.
  - 같은 Japanese localized design을 `ko`와 `ja` 인자로 직접 생성한 결과 CSS·Markdown·DTCG가 모두 바이트 단위로 동일했다.
  - Japanese Markdown에는 `테마 스위치`, `키보드 탐색`, `추천 사용처`, `주의사항` 등이 남고 Game Live HTML에는 `몬스터를 클릭하여...`, `콤보 부스터`가 남았다.
- Expected: `spec.md:284`에 따라 CSS comment, Markdown prose, HTML visible/ARIA copy, DTCG description/display metadata는 locale에 맞고 machine syntax만 불변이어야 한다.
- Actual: machine key 불변성은 달성했지만 human-readable artifact localization은 구현되지 않았다.
- Impact: 사용자가 명시적으로 요구한 Inspector i18n의 핵심이 동작하지 않는다.
- Suggested Fix: artifact 전용 message dictionary를 만들고 locale snapshot을 CSS comment/Markdown/DTCG generator와 HTML archetype renderer에 전달한다. machine key와 localized metadata를 별도 필드로 유지한다.
- Re-audit Method: 동일 style/state에서 5 locale의 machine-key set은 동일하고 승인된 human text는 locale별로 달라지는지 snapshot 비교한다.
- Owner: Coder
- Notes: 이번 finding은 번역 문장 품질이 아니라 locale 인자 미사용이라는 기능 결함이다.

## 4. Pass 2: Debug / Engineering Quality Findings

### [FIN-F009 Re-audit #1] 현재 green suite가 i18n 실패 모드를 검출하지 않음

- Pass: Debug
- Pattern: TEST-001
- Area: Node tests and Chrome gates
- Severity: Major
- Status: Needs Fix
- Summary: 206개 Node 테스트와 Chrome QA가 통과하지만 visible/ARIA/Inspector 번역 계약을 검증하지 않는다.
- Evidence:
  - `tests/auditRemediation11.test.js:234`의 “five locales change human text” 테스트는 human text 변화 assertion 없이 CSS/DTCG machine key 동일성만 검사한다.
  - locale preservation 테스트는 AppState field equality만 확인하며 Detail DOM, mock runtime, Inspector tab/scroll/focus를 브라우저에서 검사하지 않는다.
  - `scripts/verifyCatalogDiscoveryChrome.js:73`은 기대 query를 `locale: 'ko'`로 고정한다.
  - 저장된 locale screenshot 25개는 main layout/overflow 근거이나 Detail의 네 Inspector pane과 ARIA 문자열을 검사하지 않는다.
  - actual-120과 Pages recovery Chrome gate도 locale 전환·artifact 언어를 acceptance condition으로 갖지 않는다.
- Expected: 표준의 실패 모드 중심 회귀와 `spec.md:283-284`의 5-locale runtime 계약.
- Actual: bundle/key parity/layout은 검증하지만 실제 번역 적용은 false green이다.
- Impact: 구현 누락 상태에서도 재감사 문서가 전체 PASS를 주장할 수 있다.
- Suggested Fix: test 이름과 assertion을 정렬하고, 5 locale × main/detail/split/error state의 visible/ARIA 검사와 Inspector 4-pane snapshot을 Chrome gate에 추가한다.
- Re-audit Method: 한국어 literal 또는 동일 human artifact를 의도적으로 주입했을 때 새 테스트가 RED가 되는지 먼저 확인한 뒤 GREEN을 기록한다.
- Owner: Coder + Auditor
- Notes: 기존 성능·layout·Pages recovery gate는 유지하되 locale acceptance를 별도 축으로 추가한다.

### Verified engineering results

다음 결과는 이번 재감사에서 독립 재실행해 확인했다.

| Command / Surface | Result |
| --- | --- |
| `npm test` | 206/206 PASS |
| `npm run validate:catalog` | 오류 0, 기존 legacy 경고 56 |
| `npm run check:themes` | 두 생성 CSS 최신 |
| `npm run build` | Vite 87 modules, Pages closure 21 files PASS |
| `npm run analyze:bundle` | 초기 JS/CSS hard budget PASS; 잔여 폭은 사실상 1B/6B |
| `npm audit --omit=dev --offline` | 취약점 0 |
| Actual-120 isolated Chrome | 1,920 device states, Web 480 tabs, interaction median/max 19.7/102.5ms, issues 0 |
| Discovery isolated Chrome | 9 scenarios, 6 widths, 89/89 labeled inputs, issues 0 |
| Pages recovery isolated Chrome | network fault 7, consumer fault 2, issues 0 |

FIN-F001·F002의 semantic radius와 broad override 제거, FIN-F006의 stable palette ID, FIN-F010의 prototype/oversize URL 방어, FIN-F012의 CSS grammar 정렬은 직접 코드와 테스트에서 재확인했다.

## 5. Pass 3: Security Findings

새 Critical 보안 finding은 확인되지 않았다.

- URL facet allowlist, null-prototype accumulator와 길이 제한은 직접 테스트를 통과했다.
- code pane은 `textContent`로 채워지고 CSS/Markdown/JSON breaking-string 회귀가 통과했다.
- production dependency offline audit는 취약점 0이다.
- 원본 sealed source report 3개는 manifest SHA-256과 일치한다.

단, localized visible strings가 일부 `innerHTML` template에 직접 결합되는 경로는 현재 번들 내부의 신뢰된 정적 pack이라는 제한 아래 평가했다. 향후 원격 번역, 사용자 번역 또는 CMS 입력을 허용하려면 모든 localized field의 context escape를 별도 hard boundary로 재감사해야 한다.

## 6. Cross-Pass Conflicts

| Claim | Conflicting Evidence | Adjudication |
| --- | --- | --- |
| `re_audit_evidence_11.md`의 저장소·로컬 Crostini PASS | 일본어 runtime DOM에 한국어 visible/ARIA copy가 남음 | FIN-F005 미해결 |
| FIN-F004 “Resolved structurally” | locale catalog가 English fallback과 공통 placeholder로 생성됨 | 구조 일부 완료, 실제 locale content 미완료 |
| FIN-F007 “Resolved” | CSS/Markdown/DTCG locale 인자가 출력에 영향 없음; HTML renderer는 locale을 받지 않음 | 미해결 |
| FIN-F009 “Resolved” | green tests가 human text 변화와 Detail Inspector locale을 assertion하지 않음 | false green, 미해결 |
| 전문 번역 감수만 남음 | 실제 번역 record가 아닌 placeholder/fallback이 다수 | 감수 이전의 구현 작업이 남음 |

자동 게이트의 성공은 radius·URL·build·layout·recovery 결함 해소를 지지하지만, i18n 기능 계약의 반증을 무효화하지 않는다.

## 7. Required Fixes Before PASS

1. UI message inventory를 완성해 Header, Discovery, Gallery, Detail, Split, lazy/fatal recovery의 visible/ARIA/title/status 문자열을 모두 locale snapshot으로 이동한다.
2. CSS comment, Markdown heading/prose, Live HTML visible/ARIA copy, DTCG description/display metadata를 위한 artifact message pack을 추가한다.
3. `getArchetypeHTML()`과 preview renderer에 locale 또는 이미 해석된 human-copy 객체를 전달하되 selector·ID·data attribute는 불변으로 유지한다.
4. ja/zh catalog overlay의 실제 번역 field와 승인 fallback을 구분하고 공통 placeholder를 completeness로 계산하지 않는다.
5. human text가 locale별로 달라지고 machine key는 동일함을 동시에 assertion한다.
6. 5 locale × main/detail/split/error state를 격리 Chrome에서 검사하고, Detail 네 Inspector pane·ARIA·focus/state preservation을 포함한다.
7. 수정 후 `npm test`, catalog/theme, build/bundle, dependency audit, actual-120, Discovery, Pages recovery를 다시 실행한다.

## 8. Accepted Risks

명시적으로 승인된 Accepted Risk는 없다.

다음은 PASS 이후에도 별도 확인이 필요한 제한이지만, 현재 Major finding을 면제하지 않는다.

- 전문 번역 감수
- Crostini headless 실제 오디오 출력
- 운영 CSP·Google Fonts 응답 헤더
- 초기 JS 1B/CSS 6B의 극소 bundle 여유

## 9. Needs Spec Clarification

`spec.md:281-284`가 번역 범위를 이미 명확히 정의하므로 현재 Major finding에는 추가 명세가 필요하지 않다.

코더가 확인할 수 있는 선택적 제품 결정:

- 국제적으로 통용되는 고유 디자인명을 영어로 유지할 field allowlist
- CSS comment 또는 DTCG display metadata에서 원문과 번역을 병기할 형식
- 전문 번역 전 임시 fallback을 사용자에게 표시할지 여부

이 선택은 고정 한국어 UI와 locale 무시 generator를 그대로 둘 근거가 되지 않는다.

## 10. Re-audit Checklist

- [ ] `?lang=ja`, `?lang=zh-CN`, `?lang=zh-TW`에서 비승인 한국어 visible/ARIA 문자열 0
- [ ] locale select 변경 후 `document.lang`, URL, storage, UI, search/sort가 같은 locale
- [ ] empty/filter/detail/split/lazy error/fatal error 상태가 5 locale로 동작
- [ ] CSS comment와 Markdown prose가 locale별로 변화
- [ ] Live HTML visible/ARIA copy가 locale별로 변화
- [ ] DTCG structural key는 동일하고 description/display metadata만 locale별로 변화
- [ ] 5 locale의 CSS/DTCG machine-key set byte-equivalent
- [ ] 실제 catalog translation과 fallback/placeholder coverage가 분리 보고됨
- [ ] locale 변경 중 theme/tweaks/mock runtime/Inspector tab/scroll/focus 보존
- [ ] rapid locale/URL popstate에서도 마지막 요청 locale만 commit
- [ ] Node, catalog, theme, Vite, bundle, offline audit 모두 PASS
- [ ] Actual-120, Discovery, Pages recovery와 새 locale Chrome matrix 모두 issues 0
- [ ] 원본 sealed source report와 manifest SHA-256 재검증

### Coverage status

| Work Surface | Coverage | Result |
| --- | --- | --- |
| Radius bounds and semantic propagation | Covered | Verified |
| URL input resilience | Covered | Verified |
| Stable machine IDs | Covered | Verified |
| Build, bundle and Pages closure | Covered | Verified, bundle margin critical |
| Main locale layout | Covered | Layout verified; content incomplete |
| Visible UI and ARIA localization | Covered | Failed |
| Inspector 4-pane localization | Covered by source/direct probe | Failed |
| Detail locale state/focus preservation | Partially Covered | 새 Chrome acceptance 필요 |
| Professional translation quality | Excluded | Human review required later |
| Headless physical audio output | Excluded | Device unavailable |
| Live CSP/Fonts headers | Excluded | Deployment evidence unavailable |

## 11. Final Decision

**REWORK REQUIRED — i18n 범위 미통과**

Audit 11 수정은 `999px` tuner 결함, broad radius propagation, stable machine ID, URL crash, build/Pages recovery와 주요 runtime 회귀를 실질적으로 해소했다. 이 범위는 재검증에서 통과했다.

그러나 5-locale 요구의 핵심인 visible UI/ARIA와 Live CSS/HTML/Markdown/DTCG human-readable output은 `spec.md` 계약을 충족하지 않는다. FIN-F004, FIN-F005, FIN-F007, FIN-F009는 해소되지 않았으며 `re_audit_evidence_11.md`의 전체 PASS 판정은 수정 후 재감사 전까지 사용할 수 없다.

제품 코드·테스트·설정은 이번 재감사에서 수정하지 않았다. 원본 final report, sealed source reports, manifest와 기존 remediation evidence도 수정하지 않았다. 커밋·푸시·배포는 수행하지 않았다.

### Coder Handoff

`/home/eunho1/Projects/web/design_sample_selector/docs/multi_audit/11/re_audit_report_11.md`를 먼저 읽고, FIN-F004·FIN-F005·FIN-F007·FIN-F009 Re-audit #1을 `spec.md` §5.10과 실제 코드에 대조하여 수정하세요. visible/ARIA 문자열과 Inspector의 CSS comment·HTML copy·Markdown prose·DTCG display metadata를 5개 locale snapshot에 연결하되 machine key는 유지하세요. 수정 전 실패 테스트를 추가하고, 수정 후 Node·build·bundle·5-locale Chrome Detail/Inspector·actual-120·Discovery·Pages recovery 결과와 원본 보고서 SHA-256 검증을 `docs/multi_audit/11/`의 새 재감사 근거에 기록하세요. 원본 sealed source reports와 manifest는 수정하지 말고, 커밋·푸시는 사용자 승인 전 수행하지 마세요.
