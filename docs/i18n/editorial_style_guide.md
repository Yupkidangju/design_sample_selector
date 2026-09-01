# 5개 locale 편집 문체 가이드

**상태:** Stage 2 자동 검증 완료 — Tasks 21〜27 완료, 사람 검토 대기
**대상:** `ko`, `en`, `ja`, `zh-CN`, `zh-TW`의 UI, ARIA, catalog, preview, Inspector 사람용 문구
**비대상:** style/category/facet ID, CSS selector·custom property, HTML ID·`data-*`, DTCG structural key, 파일명

## 1. 공통 원칙

1. 버튼과 메뉴는 사용자가 실행할 행동을 짧게 표현한다.
2. 설명은 핵심 의미를 먼저 쓰고, 한 문장에 한 개의 주요 메시지만 둔다.
3. 같은 개념에는 같은 용어를 사용한다. 장식적 동의어로 용어를 바꾸지 않는다.
4. 오류 문구는 책임을 사용자에게 돌리지 않고 현재 상태와 복구 행동을 함께 알린다.
5. 제품명·브랜드명·표준 약어는 `design_term_glossary.md`의 승인 표기를 따른다.
6. 번역된 디자인명은 원문의 단어를 기계적으로 직역하지 않고 해당 언어권에서 통하는 사조명·제품명을 우선한다.
7. 이름·설명 변경으로 machine key가 바뀌어서는 안 된다.

이 기준은 짧고 명확하며 일관된 용어를 쓰라는 [Microsoft Writing Style Guide](https://learn.microsoft.com/en-us/style-guide/brand-voice-above-all-simple-human), locale마다 별도의 style guide와 terminology list를 두라는 [Microsoft localization guidance](https://learn.microsoft.com/en-us/globalization/localization/localization-overview)를 제품 상황에 맞게 적용한 것이다.

## 2. locale별 기준

### 한국어 (`ko`)

- UI 행동: `검색`, `필터 초기화`, `파일 다운로드`처럼 짧은 명사형 또는 행동형을 사용한다.
- 도움말·오류·상태: 사용자에게 직접 설명하는 `-합니다/-하세요`체를 사용한다.
- catalog 설명: 완결된 문장으로 쓰고 마침표를 붙인다. 특징 목록은 병렬 구조를 유지한다.
- 불필요한 영문 병기와 번역투를 줄인다. `Surface`는 `표면`, `Grid System`은 `그리드 시스템`, `Conversion Rate`는 `전환율`로 쓴다.
- 제품명·약어와 코드 문법은 보존한다. `Material Design`, `Liquid Glass`, `CSS`, `HTML`, `UI`, `DTCG`가 이에 해당한다.

참고: [Microsoft Korean Localization Style Guide](https://download.microsoft.com/download/5/b/6/5b62389f-4e3b-4c77-bc18-94efba2fa7bb/kor-kor-StyleGuide.pdf)

### 영어 (`en`)

- UI 문자열은 sentence case를 기본으로 한다. 디자인 시안명은 고유 제목이므로 title case를 허용한다.
- 버튼은 능동형 동사로 시작하고, 한두 개의 짧은 단어를 우선한다.
- 설명은 능동태와 일상적인 단어를 사용하고 불필요한 수식어를 제거한다.
- 버튼·라벨·체크박스에는 마침표를 쓰지 않고, 완결된 도움말·오류 문장에는 마침표를 쓴다.
- 미국 영어 철자를 사용한다.

참고: [Microsoft app writing style](https://learn.microsoft.com/en-us/windows/apps/design/style/writing-style), [sentence-style capitalization](https://learn.microsoft.com/en-us/style-guide/text-formatting/formatting-common-text-elements)

### 일본어 (`ja`)

- UI 라벨은 명사형 또는 짧은 동작형으로 쓰고 불필요한 주어를 생략한다.
- 설명·도움말·오류는 `です／ます`체로 통일한다.
- 일본어 문장에는 `。`와 `、`를 사용한다. UI 라벨에는 마침표를 붙이지 않는다.
- 통용되는 가타카나 전문어를 사용하되 기계 번역식 한자 직역을 금지한다. 예: `ブルータリズム`, `ニューモーフィズム`, `ウェイファインディング`.
- 숫자와 단위는 `80%`, `12px`처럼 붙여 쓴다.

참고: [Microsoft Japanese Localization Style Guide](https://download.microsoft.com/download/a/8/2/a822a118-18d4-4429-b857-1b65ab388315/jpn-jpn-StyleGuide.pdf)

### 중국어 간체 (`zh-CN`)

- 버튼과 메뉴는 짧은 동사-목적어 구조를 우선한다.
- 설명은 간결한 완결문으로 쓰며 중국어 전각 문장부호를 사용한다.
- 중국 본토의 제품·UI 용어를 사용한다. 예: `界面`, `用户`, `数据`, `加载`, `刷新`, `云母材质`, `亚克力材质`.
- 사조명은 의미가 다른 일반어로 직역하지 않는다. `Brutalism`은 `粗野主义`, `wayfinding`은 `导视`로 쓴다.

참고: [Microsoft Chinese (Simplified) Localization Style Guide](https://download.microsoft.com/download/1/5/9/159cb91c-b61b-4385-97ca-80ccc7ff1fa0/zho-chn-StyleGuide.pdf)

### 중국어 번체 (`zh-TW`)

- 대만권 UI 용어를 사용한다. 예: `介面`, `使用者`, `資料`, `載入`, `重新整理`, `壓克力材質`.
- 간체 문장을 문자만 변환해 재사용하지 않는다. 어휘와 어순을 별도로 검토한다.
- 중국어 전각 문장부호를 사용하고, UI 라벨에는 불필요한 마침표를 붙이지 않는다.
- `design token`은 판타지 도구로 오해될 수 있는 `設計權杖` 대신 이 프로젝트에서 `設計 Token`으로 표기한다. DTCG JSON의 구조 키는 번역하지 않는다.

참고: [Microsoft Chinese (Traditional) Localization Style Guide](https://download.microsoft.com/download/2/9/3/293e6d41-ba40-451b-a41e-94bdb6242ae3/zho-twn-StyleGuide.pdf)

## 3. 문자열 유형별 판정

| 유형 | 기준 | 마침표 |
| --- | --- | --- |
| 버튼·탭·메뉴 | 한눈에 행동 또는 목적을 알 수 있는 짧은 문구 | 없음 |
| ARIA 이름 | 시각 라벨이 없어도 대상과 행동을 구분 | 없음 |
| 상태·toast | 완료된 결과를 구체적으로 설명 | 완결문이면 사용 |
| 오류 | 문제 + 가능한 복구 행동 | 사용 |
| 디자인 요약 | 시각 문법 + 구현 방식 + 용도를 한 문장에 정리 | 사용 |
| palette 이름·용도 | 색 자체와 화면에서 맡는 역할을 간결하고 style별로 구분 | 없음 |
| 특징·장점·주의점 | 항목끼리 같은 문장 구조와 구체성 유지 | 완결문이면 사용 |
| Inspector prose | 사람용 설명만 번역하고 코드·키는 보존 | 문맥에 따름 |

## 4. 검수 체크리스트

- 의미가 추가되거나 빠지지 않았는가?
- 같은 전문 용어가 다른 표기로 흔들리지 않는가?
- 대상 locale에서 실제로 쓰는 어휘와 어순인가?
- 버튼·ARIA 이름이 행동과 대상을 명확히 구분하는가?
- palette 표시명과 용도가 다른 style의 공통 템플릿을 반복하지 않는가?
- 320px 및 200% 확대에서 잘리거나 겹치지 않는가?
- style ID, palette ID, CSS/DTCG key가 변경되지 않았는가?
