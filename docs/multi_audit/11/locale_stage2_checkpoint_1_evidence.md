# Stage 2 편집 감수 Checkpoint 1 근거

**실행일:** 2026-08-31
**범위:** Task 21 용어집·문체 기준선, 고위험 디자인명 31개, zh-TW design token 표기
**판정:** `PASS — Task 21 increment`, Stage 2 전체는 진행 중

## 1. 변경 범위

- 5개 locale 공통 문체 가이드와 전문 용어집을 추가했다.
- 기계 번역으로 디자인 개념이 달라진 31개 style ID의 승인 이름을 확정했다.
- 수정한 이름은 card title만 바꾸지 않고 해당 style record의 summary, palette usage, characteristics에 복제된 이전 이름까지 함께 바꿨다.
- zh-TW Inspector의 사람용 `設計權杖` 표기를 `設計 Token`으로 바꿨다.
- style ID, palette ID, CSS custom property, HTML `data-*`, DTCG structural key는 변경하지 않았다.

## 2. RED → GREEN 증거

집중 테스트: `tests/localeEditorialQuality.test.js`

1. 수정 전 `node --test tests/localeEditorialQuality.test.js`
   - 3 tests, 0 pass, 3 fail
   - 최초 실패: `en:neumorphism`; 이어서 일본어 `ﾅﾝﾌﾞﾊｲﾄﾞｳｼｮｳ`, zh-TW `設計權杖` 재현
2. 첫 수정 후
   - 3 tests, 3 pass
3. 2차 오염군 테스트 추가 직후
   - 4 tests, 3 pass, 1 fail
   - 최초 실패: `ja:raw-brutalism`, 실제값 `生のデジタル粗暴主義`
4. record 전체 동기화 후
   - 4 tests, 4 pass

집중 회귀:

```text
node --test tests/localeEditorialQuality.test.js tests/localeContentCompleteness.test.js tests/localeSelectorAndPreview.test.js
23 tests, 23 pass, 0 fail
```

## 3. 전체 자동 검증

### Node

```text
npm test
238 tests, 238 pass, 0 fail, 0 skipped
```

### Build와 정적 계약

```text
npm run build
catalog: errors 0, legacy warnings 56
theme CSS: current
Vite 6.4.3: 95 modules
Pages artifact closure: 22 files, PASS
```

### Bundle

```text
npm run analyze:bundle
JavaScript: 88.34 / 88.98 kB gzip
CSS: 33.00 / 33.00 kB gzip
PASS
```

### Dependency audit와 diff hygiene

```text
npm audit --omit=dev --offline
0 vulnerabilities

git diff --check
PASS
```

## 4. Crostini Chrome 검증

```text
npm run qa:i18n:chrome
Google Chrome 151.0.7922.173
isolatedProfile: true
5 locales × 120 cards: reachable 120, unique 120, mismatch 0 per locale
Detail/Inspector human copy: selected locale snapshot
CSS/DTCG machine key identity: preserved
overflow: 0
console warnings/errors/exceptions/network failures: 0
screenshots: 15
issues: 0
```

보고서: `.antigravity/archive/audit11-i18n-inspector-chrome/report.json`

zh-TW locale selector screenshot를 직접 확인했다. 선택기의 어두운 배경·밝은 글자, 104×34px 크기, header/category/card 영역의 잘림 없는 렌더를 확인했다. 브라우저 출력은 화면 표시와 구조를 증명하지만 문구의 언어적 자연스러움 완료를 증명하지는 않는다.

## 5. SHA-256

```text
fecddc1accb8b70044593c725939d1d30f1164c77276552dc0b5c54df58b6bc0  .antigravity/archive/audit11-i18n-inspector-chrome/report.json
95313ab666099c38ef1c8c3a860609851280b386fcf4fd7d778189d86cb2a4eb  tests/localeEditorialQuality.test.js
202861abab1383b133ef5c0811f01ed3062bdb7ed6ada9744bca672995d0062c  docs/i18n/editorial_style_guide.md
475eafae6eca6c32e243d706b54c58bd0dcbdef0def5517903df31cb5d379d24  docs/i18n/design_term_glossary.md
90af6dddf95eecdbda6ef1e3a04f407834b4b07be1a2b7278508e8ee45e18024  docs/i18n/editorial_issue_ledger.md
```

Chrome 보고서 크기: `16,817 bytes`

## 6. 남은 범위

- 디자인명 120개 중 고위험 31개를 교정했다. 나머지 89개는 Task 21에서 계속 검토한다.
- Task 22는 한국어 summary/특징/장점/주의점의 영문 병기, 번역투, category 단위 반복 템플릿을 style별 문장으로 교정한다.
- en/ja/zh-CN/zh-TW 본문 감수와 다중 폭·200% reflow는 아직 완료하지 않았다.
- 따라서 이 문서는 Stage 2 전체 완료나 원어민 수준을 선언하지 않는다.
