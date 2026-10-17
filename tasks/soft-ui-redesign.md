# 소프트 뉴모피즘 및 120종 시안 재점검

작성일: 2026-10-18. 근거: 현재 사용자 요청, `spec.md`, 실제 120종 카탈로그와 Chrome 렌더링.

- [x] 현재 구조와 검증 도구 확인, UI/UX Pro Max의 Soft UI Evolution·Neumorphism·compact label 지침 확인.
- [x] 메인·검색·필터·선택 도크·상세·비교 UI를 밝은 소프트 뉴모피즘으로 통일.
- [x] 120종 thumbnail·Web 4탭·8개 archetype의 테마 표현과 텍스트·컨트롤 레이아웃 재점검 및 개선.
- [x] 선택/즐겨찾기/상세 진입의 상태 표시·포커스·터치 영역 개선.
- [x] 5개 언어, 320~1440px, 확대·축소, reduced-motion과 전체 시안 Chrome 매트릭스 검증.
- [x] 문서 동기화, 코드 리뷰, 전체 테스트·빌드와 초기 용량·복구 검증.

완료 기준: 메인은 단색 회색 표면·양방향 부드러운 그림자·읽기 쉬운 진한 글자·음각 활성 상태를 사용한다. 개별 시안은 자신의 색·활자·도형 문법을 보존하고 작은 썸네일에 긴 설명을 넣지 않는다. 제목과 메뉴는 필요한 만큼 재배치하며 가로 넘침과 가려진 조작을 없앤다. 기존 정규 ID, 다국어·저장·내보내기·상태 복원 계약은 유지한다.

전달 게이트: 검증한 변경을 현재 추적 브랜치 `gemini_ux_enhanced`에 커밋하고 origin에 푸시한 뒤 `git ls-remote`로 원격 HEAD가 로컬과 같은지 확인한다. 전달 결과와 커밋 링크는 최종 응답에 기록한다.

검수 근거: `docs/soft-ui-review/README.md`, `scripts/verifySoftUiChrome.js`. 재현 실행은 `npm run qa:visual:chrome`.
