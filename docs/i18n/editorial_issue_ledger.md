# locale 편집 검수 이슈 대장

**상태:** Stage 2 자동 감수·교차 재감사 완료 — 사람 검토 대기
**심각도:** High = 뜻이 달라지거나 화면 신뢰를 해침, Medium = 어색함·용어 불일치·레이아웃 위험, Low = 선택적 다듬기

| ID | locale | 심각도 | 범위 | 상태 | 판정·조치 |
| --- | --- | --- | --- | --- | --- |
| ED-001 | ja/zh-CN/zh-TW | High | 뉴모피즘, De Stijl, wayfinding, terminal, spatial glass 명칭 | Resolved | 질병·헌법·전자 부품 등으로 오역된 제목과 record 내부 반복값을 승인명으로 교체하고 회귀 테스트 추가 |
| ED-002 | 5 locale | High | Mica 디자인명 | Resolved | Windows 공식 locale 표기에 맞춰 `마이카 소재`/`Mica Material`/`マイカ素材`/`云母材质`/`Mica（雲母）材質`로 교체 |
| ED-003 | zh-TW | Medium | Inspector의 design token 표기 | Resolved | `設計權杖`을 프로젝트 전문 표기 `設計 Token`으로 변경; DTCG machine key는 보존 |
| ED-004 | 5 locale | High | 120개 디자인명 전체 | Verified | 120/120을 locale 순서로 검토했다. 93개 ID의 교정값을 회귀 테스트에 고정했고, 27개 ID는 현 표기를 승인했다. 5-locale Chrome에서 locale당 120개 일치·overflow 0 확인 |
| ED-005 | ko | High | summary/palette/특징/장점/주의점 | Verified | 8개 카테고리 120/120의 번역투와 반복 템플릿을 style별 시각 문법·재질·palette 역할·실제 장단점으로 교체했다. 전체 Node/build와 5-locale·actual-120 Chrome 재감사를 통과했다. 사람 검토 전에는 원어민 수준 완료로 선언하지 않는다. |
| ED-006 | en | Medium | UI와 catalog prose | Verified | 8개 카테고리 120/120의 생성형 boilerplate를 style별 summary·시각 특징·적합 용도·주의점과 palette 역할로 교체했다. 문장 단위 중복 0, 전체 Node/build와 5-locale·actual-120 Chrome 재감사를 통과했다. 사람 검토 전에는 원어민 수준 완료로 선언하지 않는다. |
| ED-007 | ja | High | catalog prose | Verified | 8개 카테고리 120/120의 생성형 상투문, 부자연스러운 조사, 숫자형 palette 표시명을 style별 자연스러운 summary·특징·장단점·의미 역할명으로 교체했다. 전역 문장 중복·상투문·machine key 변경 0과 전체 Node/build/Chrome 재감사를 통과했다. 사람 검토 전에는 원어민 수준 완료로 선언하지 않는다. |
| ED-008 | zh-CN | High | catalog prose | Verified | 8개 카테고리 120/120의 생성형 상투문, 숫자형 palette 표시명과 번체 지역어를 style별 summary·특징·장단점·의미 역할명으로 교체했다. 전역 문장 중복·상투문·번체 UI 용어·machine key 변경 0과 전체 Node/build/Chrome 재감사를 통과했다. 사람 검토 전에는 원어민 수준 완료로 선언하지 않는다. |
| ED-009 | zh-TW | High | catalog prose | Verified | 8개 카테고리 120/120의 생성형 상투문, 숫자형 palette 표시명과 본토 UI 용어를 style별 summary·특징·장단점·의미 역할명으로 교체했다. `混凝土界面`도 `混凝土介面`으로 교정했으며, 전역 문장 중복·상투문·본토 UI 용어·machine key 변경 0과 전체 Node/build/Chrome 재감사를 통과했다. 사람 검토 전에는 원어민 수준 완료로 선언하지 않는다. |
| ED-010 | 5 locale | Medium | 320–1440px 및 200% reflow | Verified | 5 locale × 6 viewport의 Gallery·Detail 30상태를 Chrome 151에서 검사했다. 320px Game CTA 잘림 5건과 tuner range 접근성 이름 누락 30건을 수정한 뒤 overflow·clipped/unnamed control·diagnostics/issues 0을 확인했다. |
| ED-011 | 5 locale | Medium | 사람 검토 | Open | 자동 검수 완료 후 사용자 또는 해당 언어 화자의 검토 결과 기록 |
| ED-012 | ja/zh-CN/zh-TW | High | 뜻이 달라진 24개 디자인명 | Verified | `태양 펑크`, `청바지`, `메시`, `전력망`, `중세` 등으로 바뀐 기계 번역을 전문 디자인명으로 교체하고 record 내부 반복값과 Chrome 출력을 검증 |

## 판정 규칙

- `Resolved`: source 수정과 집중 회귀 테스트가 함께 존재한다.
- `Verified`: 전체 Node/build/Chrome 재감사까지 통과했다.
- `Open`: 문제 범위가 확인됐으나 locale 편집 wave가 끝나지 않았다.
- 자동 테스트 통과만으로 `원어민 수준` 또는 전체 자연스러움 완료를 선언하지 않는다.
