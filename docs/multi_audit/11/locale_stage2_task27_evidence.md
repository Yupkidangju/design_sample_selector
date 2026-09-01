# Stage 2 Task 27 교차 언어·reflow 재감사 근거

**실행일:** 2026-09-01
**범위:** 5개 locale × actual 120 field 의미 구조, 간체/번체 독립성, 다중 폭·200% Gallery/Detail
**판정:** `PASS — 자동 의미·구조·레이아웃 재감사 완료`, ED-011 사람 검토는 미확정

## 1. 계약과 RED → GREEN

- normal viewport는 320/375/768/1024/1440 CSS px에서 각각 검사했다.
- 200%는 선행 Audit 11과 같은 물리 1280px, CSS 640px, `deviceScaleFactor: 2`로 재현했다.
- 명시적 내부 가로 스크롤은 허용하고 document overflow, viewport 밖 control, 접근성 이름 누락은 실패한다.

```text
node --test tests/localeCrossLanguageAudit.test.js
구현 전: 3 tests, 2 pass, 1 fail
실패 원인: verifyI18nInspectorChrome.js에 reflow viewport·200%·control clipping report가 없음
구현 후: 3 tests, 3 pass, 0 fail

첫 Chrome 30상태 실행
issues 5: ko/en/ja/zh-CN/zh-TW의 width-320 Detail game-cta-btn 우측 잘림

공통 CSS 수정 후 최종 실행
reflow states 30, screenshots 30, diagnostics 0, issues 0

접근성 이름 엄격화 후 두 번째 RED
issues 30: 5 locale × 6 viewport Detail의 tuner range 5개에 연결된 label 없음
수정: 고정 영문 병기 제거 + locale-owned <label for> 연결
최종: unnamed controls 0, issues 0
```

## 2. 의미·machine field 대조

최종 `report.json`이 다음 결과를 직접 소유한다.

| 항목 | 결과 |
| --- | ---: |
| locale | 5 |
| style | 120 |
| locale당 사람용 field unit | 1,924 |
| 전체 사람용 field unit | 9,620 |
| style ID drift | 0 |
| palette ID·값·배열 길이 drift | 0 |
| 빈 사람용 field | 0 |
| zh-CN/zh-TW 동일 summary | 0 |
| zh-CN/zh-TW 동일 전체 record | 0 |

간체 pack에는 `用户/界面/数据/加载/网格/亚克力`, 번체 pack에는 `使用者/介面/資料/載入/網格/壓克力`의 지역 용례가 각각 존재한다. 이는 단순 character-copy가 아니라 독립 pack·glossary 계약을 따르는 자동 증거다. 자연스러움의 최종 판정은 ED-011 사람 검토로 남긴다.

## 3. 실제 수정

320px Detail의 Game HUD는 스킬 4개와 locale별 CTA가 한 줄의 최소 너비를 초과했다. `.game-action-bar`가 내용에 따라 줄바꿈하도록 수정해 CTA를 다음 행의 viewport 안에 유지했다. 별도 모바일 전용 구조나 JavaScript 분기는 추가하지 않았다. 기존 중복 `.sub-nav-cycle` CSS rule은 하나로 합쳐 초기 CSS hard budget을 유지했다.

접근성 이름 probe에서 control value를 이름으로 인정하던 fallback을 제거하자 다섯 tuner range의 label 누락이 드러났다. 기존 시각 문자열을 `<label for="slider-*">`로 연결하고 모든 locale에 노출되던 `(Border Radius)` 등 고정 영문 병기를 제거했다.

## 4. 전체 검증

```text
npm test
284 tests, 284 pass, 0 fail, 0 skipped

npm run build
catalog errors 0, legacy warnings 56
Vite 6.4.3, 100 modules
Pages artifact closure 23 files, release 6139003f776c67b8d1876660cd585629c517c656, PASS

npm run analyze:bundle
initial JavaScript 88,365 / 88,980 B gzip
initial CSS 32,997 / 33,000 B gzip
PASS

npm audit --omit=dev --offline
취약점 0
```

| Chrome 151 게이트 | 결과 |
| --- | --- |
| 5-locale semantic/i18n/Inspector/reflow | 120 styles, 9,620 units, 30 reflow states, 30 screenshots, diagnostics/issues 0 |
| actual-120 | 8 category × 15, 1,920 device states, Web 480 tabs, diagnostics/issues 0 |
| Discovery | 3 modes, 9 scenarios, 6 widths, 89/89 labeled inputs, issues 0 |
| Pages recovery | network faults 7, consumer faults 2, issues 0 |

증거 디렉터리: `.antigravity/archive/locale-stage2-task27/`

## 5. SHA-256와 sealed source report 검증

```text
327eff184bf3a71ca6ca9cf495eb0b32a49184fa988aeffe03deee885fb37c01  report.json (98,963 bytes)
7c1670f19eb3823062d3adfe26d3de2045dfa386bcfdff8ab1cf8ff175e97955  catalog120/report.json (13,221 bytes)
7e4c7b380cd9f2e4ffdc181308fff8aaa59cb64b9514df7281b5051f7a115f1a  discovery/report.json (8,112 bytes)
d51288c0b5d39c56d8da3ff4aad79a5726f87bb993a16e832413df5509f9089f  pages/report.json (57,054 bytes)
284b539fc5fa52ba7377a8eca87c8687e5a0a245b9bf3c1034e82148900a6e93  scripts/verifyI18nInspectorChrome.js
3cd2a25c5d8dc3d43094d6f59fd086a75eb62279ee39fea35cef1ce1a6103d60  tests/localeCrossLanguageAudit.test.js
7910220610c905560fb75c652208a73d1d92e21eb7ed7352f91303b63f882a9c  src/styles/interactive.css
fa60d6964152bdc6efebe83606fd5c288ee2842d5bc6e6c373092fa7bf3a5966  src/components/detailView.js
fe8d63bbce5c581354ecbce971d287930a41dba5ed1b82b5237d78435c4558d2  final_audit_report_11.md (35,907 bytes)
632b1aca5bf231b62cd84c63d74529a90ea9157eaddd37d61701cc54067e84e3  re_audit_report_11.md (19,341 bytes)
088e2ce39437633520b19adc501906248190d8494f4fe13b2e5730372d84e459  source_report_manifest.json (1,109 bytes)
22898ba6bc97eee591f4a9591ad3d98f15a164433c3829e6db86eda7243581c4  source_report_manifest.sha256.json (287 bytes)
```

manifest에 봉인된 원본 세 보고서도 각각 `add0d341…` / `2aff63ff…` / `4245c96b…`로 일치한다. 원본 sealed source reports와 manifest는 수정하지 않았다.

## 6. 5축 리뷰와 남은 범위

- **Correctness:** semantic unit·machine identity·30 reflow 상태와 120종 전체 runtime이 green이다.
- **Readability:** 기존 Chrome 하네스의 viewport/metric 함수를 재사용 가능한 단위로 분리했고 CSS 수정은 한 줄 wrap 규칙이다.
- **Architecture:** locale snapshot과 canonical machine key 경계를 유지했으며 제품 runtime 의존성은 추가하지 않았다.
- **Security:** 새 네트워크·저장·HTML sink가 없고 offline production audit 취약점은 0이다.
- **Performance:** 초기 hard budget은 JS 88,365B, CSS 32,997B gzip으로 통과했고 Chrome gate는 30상태를 한 격리 세션에서 실행한다.

자동 게이트 관점의 High/Medium finding은 0이다. 다만 ED-011은 자동화로 대체할 수 없는 사용자 또는 해당 언어 화자의 자연스러움 검토이므로 Open 상태를 유지한다. 커밋·푸시는 수행하지 않았다.
