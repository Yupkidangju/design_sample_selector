# 5개 locale 전면 분리 Stage 1 검증 근거

**작성일:** 2026-08-31
**판정:** PASS — Checkpoint B 사용자 승인 대기
**범위:** `ko`, `en`, `ja`, `zh-CN`, `zh-TW`

## 1. 계약과 구현 결과

- `spec.md` §5.10, `designs.md`, `DESIGN_DECISIONS.md` Decision 022에 locale별 명시 콘텐츠, 암묵 fallback 금지, machine key 불변 계약을 반영했다.
- 5개 locale pack이 각각 120개 style record와 locale당 1,924개 catalog 사람용 field unit을 명시적으로 소유한다.
- card/Detail/Split/Peek/Dock는 같은 localized legacy projection을 사용한다.
- Core·Wave 1·Expansion Web preview와 8개 archetype의 가시 문자열·ARIA는 선택 locale snapshot으로 투영된다.
- Inspector의 CSS comment, HTML 사람용 copy, Markdown prose, DTCG display metadata는 같은 snapshot을 사용하며 CSS/HTML/DTCG machine key는 유지한다.
- `data-*`, ID, CSS selector/custom property, DTCG structural key, 표시 식별자(`#TRX-*`)와 기술 측정값은 번역하지 않는다.

## 2. RED → GREEN 회귀 근거

수정 전 집중 테스트는 다음 false green을 재현했다.

- 비영어 카드명이 영문명으로 fallback됨.
- catalog 설명이 locale 공통 template에서 생성됨.
- preview/archetype 내부의 고정 영어·한국어 문구가 선택 locale과 섞임.
- runtime toast의 `data-mock-msg`를 번역하면 machine attribute 계약이 깨짐.
- actual-120 Chrome 게이트가 `AI 네이티브`, `100% 읽음`, 영어 project label에 의존함.
- preview localization이 `#TRX-8901`, `24ms`, `ID` 같은 식별자·기술값까지 치환함.

수정 후 `tests/localeContentCompleteness.test.js`, `tests/mockupRuntime.test.js`와 기존 preview/Inspector 지문 테스트가 위 경계를 고정한다.

## 3. 정적·Node 검증

| 항목 | 결과 |
| --- | --- |
| 전체 Node | 234/234 PASS |
| locale catalog | 5 × 120 records, 5 × 1,924 field units |
| Web preview | 5 × 120 × 4 = 2,400 states PASS |
| archetype | 5 × 120 × 8 = 4,800 states PASS |
| fallback/placeholder/unapproved invariant | 0 / 0 / 0 |
| catalog validator | 오류 0, 기존 legacy 경고 56 |
| Vite build | 95 modules, Pages closure 22 files, PASS |
| initial JS | 88.34kB / 88.98kB gzip, PASS |
| initial CSS | 33.00kB / 33.00kB gzip, PASS |
| `npm audit --omit=dev --offline` | 취약점 0 |
| `git diff --check` | PASS |

## 4. Crostini Chrome 151 검증

| Gate | 결과 |
| --- | --- |
| 5-locale card matrix | locale별 120 reachable/unique/expected, mismatch 0; 총 600 cards |
| Detail/Inspector | 5 locales, 15 screenshots, diagnostics 0, issues 0 |
| locale 전환 보존 | Inspector tab, sidebar scroll, focus, theme, archetype 보존 |
| Actual-120 | 1,920 states, Web 480 tabs, 4 widths, diagnostics 0, issues 0 |
| Gallery reachability | GRID/BENTO/SPECTRUM 각각 120/120 |
| Performance | LCP 720ms(전용 근거 실행), CLS 0; 최종 기본 실행 max interaction 102.8ms |
| Discovery | 3 modes, 9 scenarios, 6 widths, diagnostics 0, issues 0 |
| Pages recovery | network faults 7, consumer faults 2, issues 0, PASS |

## 5. 원본 근거와 SHA-256

| 파일 | SHA-256 |
| --- | --- |
| `.antigravity/archive/locale-stage1/i18n-inspector/report.json` | `a178e1910f729ebaecb4c7addf78678d749d2f3bc626416b01243050535ae9ff` |
| `.antigravity/archive/locale-stage1/catalog120/report.json` | `ef77f58da3de7323cdb37ed6e4bd3bec4944931e8c342c730c0f5c2f5570e691` |
| `.antigravity/archive/locale-stage1/discovery/report.json` | `06eb33efea7ed3ba1b9861a982278df4712093afbbd96a408c67b22b5872ed07` |
| `.antigravity/archive/locale-stage1/pages-recovery/report.json` | `8c15c3fdaeab12f6fd5886e53aa39c049d5600389688490bf6963458a4e993f2` |

## 6. Stage 2로 이관하는 위험

Stage 1은 언어 분리·누락 방지·기능 정합성을 증명하며 번역의 자연스러움을 승인하지 않는다. 다음은 Stage 2에서 반드시 검토한다.

- 기계 번역에서 생긴 디자인 사조명 오역·부정확한 음역.
- palette 이름이 역할 중심의 구조적 표현으로 반복되는 문제.
- preview localizer가 문맥별 원문을 locale 콘텐츠 pool로 치환해 문장은 해당 언어지만 버튼·레이블 문맥이 어색할 수 있는 문제.
- 중국어 간체/번체의 지역별 용어 차이. 예: DTCG token을 번체에서 `權杖`으로 옮긴 표현은 우선 교정 대상이다.
- 한국어·영어·일본어·간체·번체의 문체, 구두점, UI 길이와 200% reflow.

따라서 현재 판정은 “실제로 실행 가능한 5-locale 완전 분리” PASS이며, “자연스럽고 정확한 최종 번역”은 Stage 2 완료 전까지 미확정이다.

## 7. 변경 품질 리뷰

- **Correctness:** locale field parity, 사용자 가시 출력, machine identity, 상태 이관을 독립 테스트와 실제 Chrome에서 교차 확인했다.
- **Readability:** locale overlay는 명시 catalog 소비자로 단순화하고 preview 문자열 투영은 한 모듈로 격리했다.
- **Architecture:** locale pack dynamic import를 유지하고 preview localizer를 동적 component entry에 배치해 초기 경계를 보존했다.
- **Security:** 새 외부 의존성·runtime network 호출은 없으며, locale replacement는 HTML attribute/text 삽입 전에 escape한다.
- **Performance:** 초기 JS/CSS gzip 예산, actual-120 상호작용, LCP/CLS가 모두 승인 범위다.

필수 수정 finding은 모두 해소했다. 편집 품질은 구조 결함으로 숨기지 않고 위 Stage 2 위험으로 명시 이관한다.
