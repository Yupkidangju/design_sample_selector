# Task List: `catalog-expansion-120`

**Source plan:** `tasks/plan.md`

**Source specification:** `SPEC-catalog-expansion-120.md`

**Task list status:** 구현 완료 (`COMPLETE`)

**승인일:** 2026-08-31

**완료일:** 2026-08-31

> 사용자의 “120개 추가까지 한꺼번에” 요청은 기존 36종을 포함한 실제 총 120종을 한 번에 완료하는 승인으로 해석한다. 내부 체크포인트마다 자동 검증하되 추가 승인 대기는 없다.

---

## Phase A — 계약·authoring 기반

- [x] Task 1: 실제 120/신규 84/category별 15/기존 36 무회귀 실패 테스트 작성
- [x] Task 2: 21개 문법·source·token·카피를 만드는 expansion authoring factory 구현
- [x] Task 3: `modern-foundations`, `raw-materials` 24종 데이터 구현
- [x] Task 4: `dimensional-pop`, `retro-editorial` 24종 데이터 구현
- [x] Task 5: `web-millennium`, `data-spatial`, `soft-play` 36종 데이터 구현

### Checkpoint A

- [x] 신규 84종 canonical schema 통과
- [x] 신규 84종 `ready`, warning/error 0
- [x] 기존 36 ID 순서·legacy 경고 56 유지

## Phase B — 팩·프리뷰·theme

- [x] Task 6: 7개 pack manifest와 catalog index 통합
- [x] Task 7: 84개 고유 thumbnail 정의와 entrypoint 통합
- [x] Task 8: 84개 component renderer 정의와 Desktop/Mobile 반응형 통합
- [x] Task 9: 84개 motion descriptor와 reduced-motion 통합
- [x] Task 10: 신규 84종 theme/detail CSS 생성 및 lazy chunk 분리

### Checkpoint B

- [x] renderer/thumbnail/motion inventory 120/120/120, fallback 0
- [x] Web 120×4 및 archetype 120×8×2 렌더 계약 통과
- [x] initial CSS에 expansion 상세 CSS가 포함되지 않음

## Phase C — 제품·검증·인수인계

- [x] Task 11: 실제 120종 기준 탐색·페이지·선택·export·기존 QA 계약 전환
- [x] Task 12: 120종 전용 Crostini Chrome QA와 npm 명령 구현
- [x] Task 13: 전체 테스트·catalog/theme/build/bundle/Chrome 검증
- [x] Task 14: spec/design/ADR/README/CHANGELOG/build/summary/capability/audit 문서 동기화
- [x] Task 15: 코드 품질·단순화·diff·비밀정보·잔여 프로세스 최종 점검

### Final Checkpoint

- [x] 실제 catalog 총 120종, category별 15종
- [x] 기존 36종 호환 및 신규 84종 fallback 0
- [x] 초기 JS/CSS, DOM, interaction, LCP/CLS 예산 통과
- [x] Chrome diagnostics·접근성·Desktop/Mobile 전환 통과
- [x] 문서와 구현이 일치하고 미완료 위험이 명시됨
