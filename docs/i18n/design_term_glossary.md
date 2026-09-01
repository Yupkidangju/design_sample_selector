# 디자인 용어집

**상태:** Stage 2 초안 — 반복 용어 기준선
**적용 우선순위:** 공식 제품명·표준명 → 박물관·기관의 통용 사조명 → locale별 전문 용례 → 프로젝트 편집 결정

## 1. 반복 전문 용어

| 개념 | `ko` | `en` | `ja` | `zh-CN` | `zh-TW` |
| --- | --- | --- | --- | --- | --- |
| user interface | 사용자 인터페이스 / UI | user interface / UI | ユーザーインターフェース / UI | 用户界面 / UI | 使用者介面 / UI |
| design token | 디자인 토큰 | design token | デザイントークン | 设计令牌 | 設計 Token |
| grid | 그리드 | grid | グリッド | 网格 | 網格 |
| surface | 표면 | surface | サーフェス | 表面 | 表面 |
| material | 소재·재질 | material | 素材／マテリアル | 材质 | 材質 |
| elevation | 높이 단계 | elevation | エレベーション | 层级高度 | 視覺升層 |
| primary action / CTA | 주요 행동 / CTA | primary action / CTA | 主要アクション / CTA | 主要操作 / CTA | 主要操作 / CTA |
| wayfinding | 웨이파인딩 | wayfinding | ウェイファインディング | 导视 | 導視 |
| archetype | 화면 유형 | screen archetype | 画面アーキタイプ | 页面原型 | 頁面原型 |
| accessibility | 접근성 | accessibility | アクセシビリティ | 无障碍 | 無障礙 |

`CSS`, `HTML`, `JSON`, `DTCG`, `Web Audio`, `SaaS`, `AI`, `UI`, `Y2K`, `HUD`, `FUI`는 승인된 약어 또는 기술명으로 원형을 유지한다.

## 2. 제품·플랫폼 디자인 용어

| machine concept | `ko` | `en` | `ja` | `zh-CN` | `zh-TW` | 근거 |
| --- | --- | --- | --- | --- | --- | --- |
| Mica | 마이카 소재 | Mica material | マイカ素材 | 云母材质 | Mica（雲母）材質 | [Microsoft Windows materials](https://learn.microsoft.com/en-us/windows/apps/design/signature-experiences/materials) 및 각 locale 공식 문서 |
| Acrylic | 아크릴 소재 | Acrylic material | アクリル素材 | 亚克力材质 | 壓克力材質 | [Microsoft Acrylic guidance](https://learn.microsoft.com/en-us/windows/apps/design/style/acrylic) |
| Material Design | Material Design | Material Design | Material Design | Material Design | Material Design | [Google Design](https://design.google/about) |
| Liquid Glass | Liquid Glass | Liquid Glass | Liquid Glass | Liquid Glass | Liquid Glass | [Apple HIG Materials](https://developer.apple.com/design/human-interface-guidelines/materials) |
| DTCG design token | 디자인 토큰 | design token | デザイントークン | 设计令牌 | 設計 Token | [DTCG specification](https://www.designtokens.org/tr/drafts/format/) |

제품명은 번역하지 않는다. 뒤에 붙는 설명어만 locale 문법에 맞춘다. 예: `Liquid Glass 인터페이스`, `Liquid Glassインターフェース`, `Liquid Glass介面`.

## 3. 사조·기법 용어

| 개념 | `ko` | `en` | `ja` | `zh-CN` | `zh-TW` |
| --- | --- | --- | --- | --- | --- |
| Bauhaus | 바우하우스 | Bauhaus | バウハウス | 包豪斯 | 包浩斯／包豪斯 |
| De Stijl | 데 스틸 | De Stijl | デ・ステイル | 风格派 | 風格派 |
| neo-plasticism | 신조형주의 | neo-plasticism | 新造形主義 | 新造型主义 | 新造形主義 |
| Brutalism | 브루탈리즘 | Brutalism | ブルータリズム | 粗野主义 | 粗野主義 |
| neumorphism | 뉴모피즘 | neumorphism | ニューモーフィズム | 新拟态 | 新擬態 |
| glassmorphism | 글래스모피즘 | glassmorphism | グラスモーフィズム | 玻璃拟态 | 玻璃擬態 |
| skeuomorphism | 스큐어모피즘 | skeuomorphism | スキューモーフィズム | 拟物化 | 擬物化 |
| Isotype | 아이소타입 | Isotype | アイソタイプ | Isotype | Isotype |
| Risograph | 리소그래프 | Risograph | リソグラフ | Risograph | Risograph |
| vaporwave | 베이퍼웨이브 | vaporwave | ヴェイパーウェイヴ | 蒸汽波 | 蒸氣波 |
| solarpunk | 솔라펑크 | solarpunk | ソーラーパンク | 太阳朋克 | 太陽龐克 |

`Bauhaus`와 `De Stijl` 표기는 [MoMA Bauhaus](https://www.moma.org/collection/terms/bauhaus), [MoMA de Stijl](https://www.moma.org/collection/terms/de-stijl)의 사조 구분을 기준으로 한다. 번체의 Bauhaus는 대만권 표기 `包浩斯`를 우선한다. 마이너 트렌드에 공식 기관 표기가 없는 경우에는 원어 전문어를 음역하고, 임의의 일반명사 직역은 사용하지 않는다.

## 4. 승인된 고위험 디자인명

아래 항목은 기계 번역 오염이 실제로 확인되어 우선 고정한 이름이다. machine ID는 왼쪽 값을 유지한다.

| style ID | `ko` | `en` | `ja` | `zh-CN` | `zh-TW` |
| --- | --- | --- | --- | --- | --- |
| `neumorphism` | 소프트 뉴모피즘 | Soft Neumorphism | ソフトニューモーフィズム | 柔和新拟态 | 柔和新擬態 |
| `de-stijl` | 데 스틸 신조형주의 | De Stijl Neo-Plasticism | デ・ステイル新造形主義 | 风格派新造型主义 | 風格派新造形主義 |
| `functional-wayfinding` | 기능주의 웨이파인딩 | Functional Wayfinding | 機能主義ウェイファインディング | 功能主义导视 | 功能主義導視 |
| `information-isotype` | 아이소타입 정보 디자인 | Isotype Information Design | アイソタイプ情報デザイン | Isotype信息设计 | Isotype資訊設計 |
| `mica-surface` | 마이카 소재 | Mica Material | マイカ素材 | 云母材质 | Mica（雲母）材質 |
| `eighties-new-wave` | 80년대 뉴웨이브 | 1980s New Wave | 80年代ニューウェーブ | 80年代新浪潮 | 80年代新浪潮 |
| `spatial-glass-ui` | 공간형 글래스 UI | Spatial Glass UI | 空間型ガラスUI | 空间玻璃界面 | 空間玻璃介面 |

### 2차 기계 번역 교정군

아래 24개 ID는 2026-08-31에 일본어·간체·번체 제목과 record 내부 반복 표기를 함께 교정했다. 정확한 승인 문자열은 `tests/localeEditorialQuality.test.js`의 `APPROVED_MACHINE_TRANSLATION_REPAIRS`가 locale pack과 대조한다.

`raw-brutalism`, `neo-brutalism`, `glassmorphism`, `skeuomorphism`, `vaporwave`, `dark-minimal-glass`, `kinetic-type`, `solarpunk-eco`, `punk-zine`, `risograph`, `modular-grid-system`, `web-brutalism`, `grunge-typography`, `glitch-brutalism`, `maximalist-chaos`, `iridescent-mesh`, `low-poly-interface`, `mid-century-modern`, `newspaper-broadsheet`, `aqua-desktop`, `luna-desktop`, `scene-core-web`, `mcbling-gloss`, `toy-block-ui`

### 120종 전수 이름 검수

2026-08-31에 locale 순서 `ko → en → ja → zh-CN → zh-TW`로 120종 전체를 검토했다. 총 93개 style ID는 하나 이상의 locale에서 직역·혼합 영어·지역 표기·대소문자 문제를 교정하고 `tests/localeEditorialQuality.test.js`의 네 승인 집합으로 고정했다. 나머지 27개 ID는 통용 표기와 의미가 적절해 현 값을 유지했다.

- 한국어·영어 교정군: `APPROVED_KO_EN_NAME_REPAIRS` 65개
- 일본어·간체·번체 교정군: `APPROVED_CJK_NAME_REPAIRS` 55개
- 선행 고위험 교정군: 7개 + 24개
- 집합 간 중복을 제거한 승인 교정 ID: 93개

제품명·브랜드명(`Material Design`, `Liquid Glass`, `Frutiger Aero`, `GeoCities`, `Aqua`, `Luna`)과 약어(`AI`, `UI`, `Y2K`, `HUD`, `FUI`)는 보존하고, 뒤의 설명어만 locale 문법에 맞췄다. 제목에 반복되던 이전 이름은 해당 record의 사람용 설명에서도 함께 교체했다. machine ID와 출력 구조 키는 바꾸지 않았다.
