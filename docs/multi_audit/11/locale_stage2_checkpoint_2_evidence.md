# Stage 2 편집 감수 Checkpoint 2 근거

**실행일:** 2026-08-31
**범위:** Task 21의 5개 locale 디자인명 120종 전수 검토
**판정:** `PASS — Task 21 완료`, Stage 2 본문 감수는 진행 중

## 1. 변경과 판정 범위

- 검토 순서 `ko → en → ja → zh-CN → zh-TW`로 120종 제목을 전수 확인했다.
- 93개 style ID는 하나 이상의 locale에서 직역, 혼합 영어, 지역 용어, 대소문자 또는 띄어쓰기를 교정하고 승인값을 회귀 테스트에 고정했다.
- 나머지 27개 ID는 통용 전문명과 의미가 적절해 기존 표기를 승인했다.
- 제목이 사람용 summary·palette usage·characteristics·pros에 반복된 경우 같은 승인명으로 동기화했다.
- style/category/facet ID, palette ID, CSS custom property, HTML ID·`data-*`, DTCG structural key는 유지했다.
- 이 checkpoint는 디자인명 감수 완료를 뜻한다. summary·특징·장점·주의점의 전체 자연스러움이나 원어민 수준 완료를 뜻하지 않는다.

## 2. RED → GREEN

집중 테스트는 `tests/localeEditorialQuality.test.js`에 추가했다.

```text
한국어·영어 승인값 추가 직후: 5 tests, 4 pass, 1 fail
최초 실패: en:corporate-minimal
actual: Corporate Minimalist
expected: Corporate Minimalism

일본어·간체·번체 승인값 추가 직후: 6 tests, 4 pass, 2 fail
최초 실패: ja:kinetic-type, ja:swiss-grid

교정 후 집중 locale matrix:
node --test tests/localeEditorialQuality.test.js tests/localeContentCompleteness.test.js tests/localeSelectorAndPreview.test.js
25 tests, 25 pass, 0 fail
```

한국어 `일본식 마(間) 미니멀리즘`은 첫 GREEN 시도에서 기존 foreign-script 누출 게이트가 잡았다. 의미를 유지하면서 `일본식 마 미니멀리즘`으로 바꿨고 Web 2,400·archetype 4,800 상태의 누출 검사를 다시 통과했다.

## 3. 전체 정적 검증

```text
npm test
240 tests, 240 pass, 0 fail, 0 skipped

npm run build
catalog errors 0, legacy warnings 56
theme CSS current
Vite 6.4.3, 95 modules
Pages artifact closure 22 files, PASS

npm run analyze:bundle
initial JavaScript 88.34 / 88.98 kB gzip
initial CSS 33.00 / 33.00 kB gzip
PASS

npm audit --omit=dev --offline
0 vulnerabilities

git diff --check
PASS
```

검증 중 존재하지 않는 `npm run verify:bundle`을 한 번 호출해 npm script 오류가 발생했다. 저장소의 실제 계약 명령 `npm run analyze:bundle`로 바로 교정해 PASS를 확인했으며 제품 소스나 build 실패는 아니었다.

## 4. Crostini Chrome 151 재검증

모든 브라우저 실행은 `/usr/bin/google-chrome`의 격리 profile을 사용했다.

| 게이트 | 결과 |
| --- | --- |
| 5-locale i18n/Inspector | locale당 120 cards reachable·unique, mismatch 0; 15 screenshots; overflow 0; diagnostics/issues 0 |
| actual-120 | 8 category × 15, 1,920 device states, Web 480 tabs, LCP 688ms, CLS 0, interaction 20.75/110.9ms, diagnostics/issues 0 |
| Discovery | 3 modes 모두 120 reachable, 9 scenarios, 6 widths, 89/89 labeled inputs, overflow 0, diagnostics/issues 0 |
| Pages recovery | network fault 7, consumer fault 2, issues 0 |

보고서 경로:

- `.antigravity/archive/locale-stage2-checkpoint-2/i18n/report.json`
- `.antigravity/archive/locale-stage2-checkpoint-2/catalog120/report.json`
- `.antigravity/archive/locale-stage2-checkpoint-2/discovery/report.json`
- `.antigravity/archive/locale-stage2-checkpoint-2/pages-recovery/report.json`

## 5. 무결성

```text
088e2ce39437633520b19adc501906248190d8494f4fe13b2e5730372d84e459  docs/multi_audit/11/source_report_manifest.json
4ab481eb3a25f09275289a85590a44eb8e121b2371b3ee84bfdd8250f54042f2  i18n/report.json (16,781 bytes)
ecfcf52a3902afa53c87b2dfed5704676158623123812934d0ca9a291ede6f9a  catalog120/report.json (13,226 bytes)
143109dae732375dc9c0a40c11f3e932d102dabae9863874c70ffcb609c6e3df  discovery/report.json (8,112 bytes)
bb06251a306c9fb3f79c436f13402744314f22f9273f446ad507c8b7afdb84cb  pages-recovery/report.json (56,781 bytes)
a5656cc22e5b162857a2568348c572692e1011af056fe9b3b97a6edaf0e2d4e8  tests/localeEditorialQuality.test.js
```

원본 sealed source reports와 manifest는 수정하지 않았다. `source_report_manifest.json`의 SHA-256은 기록된 기준값과 일치한다.

## 6. 다음 작업

- Task 22: 한국어 summary·특징·장점·주의점의 영문 병기, 번역투, 반복 템플릿을 style별 의미 문장으로 교정한다.
- Tasks 23–26: 영어·일본어·간체·번체 본문을 같은 방식으로 순차 감수한다.
- Task 27: 문구 확정 후 5 locale 다중 폭·200% reflow와 교차 언어 의미 감사를 수행한다.
- ED-011 사람 검토 전에는 `원어민 수준 완료`를 선언하지 않는다.
