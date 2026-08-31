# Task List: Audit 11 radius·5-locale remediation

**Plan:** `tasks/plan.md`

**Status:** `COMPLETE` (2026-08-31)

## Task 1: 계약 문서 동기화

- [x] semantic surface/control/pill radius와 공통 tuner limits를 정의한다.
- [x] theme/category/archetype/locale 전환 preserve/reset 행렬을 정의한다.
- [x] 5 locale ID, 선택 우선순위, fallback, machine ID 불변성을 정의한다.

**Verification:** 문서 상호 대조와 Decision 021 기록

## Task 2: Audit 11 RED 회귀 테스트

- [x] 999 default, broad selector, state 상한, artifact 불일치를 재현한다.
- [x] prototype facet/oversize URL crash를 재현한다.
- [x] locale pack completeness, machine key invariance, unsafe text sink를 재현한다.

**Verification:** `node --test tests/auditRemediation11.test.js`가 수정 전 의도대로 실패

## Task 3: Radius와 외부 URL 경계 수정

- [x] 공유 `TUNER_LIMITS`를 catalog validation·AppState·DOM·generator에 적용한다.
- [x] 문제 grammar의 pill radius와 surface default를 분리한다.
- [x] `data-tweak-surface` opt-in으로 broad `!important` selector를 제거한다.
- [x] Discovery URL을 allowlist/null-prototype/길이 상한으로 보호한다.

**Verification:** Audit 11 radius/URL 집중 테스트와 120종 scan

## Checkpoint A

- [x] 집중 테스트 green
- [x] catalog/theme 생성 최신 상태
- [x] 기존 radius 관련 회귀 테스트 통과

## Task 4: Locale contract와 lazy pack 구현

- [x] 5 locale registry, 정규화, URL/storage/browser precedence를 구현한다.
- [x] UI message와 catalog overlay pack을 locale별 lazy chunk로 분리한다.
- [x] 120 styles/category/facet/palette display field completeness를 검증한다.

**Verification:** locale unit test, Vite chunk/budget 검사

## Task 5: Header·Discovery·Gallery locale 연결

- [x] native endonym select와 document `lang`을 state에 연결한다.
- [x] 검색 문서와 이름 정렬이 선택 locale을 사용한다.
- [x] main/discovery locale-sensitive copy와 ARIA가 같은 snapshot을 사용한다.

**Verification:** 5 locale 상태/검색/정렬/keyboard 테스트

## Task 6: Detail·Inspector 원자적 locale 전환

- [x] locale을 Inspector context/epoch에 포함한다.
- [x] machine key는 stable palette ID를 사용하고 human metadata만 번역한다.
- [x] locale 변경 시 mock runtime·Inspector tab·scroll·focus를 보존한다.
- [x] code pane과 dynamic localized text sink를 context-safe하게 갱신한다.

**Verification:** rapid toggle, malicious corpus, 4-pane coherence 테스트

## Checkpoint B

- [x] 전체 Node 테스트 통과
- [x] Vite build와 bundle budget 통과
- [x] dependency audit 통과

## Task 7: Crostini Chrome 재감사

- [x] 5 locale × 320/768/1280/1920 폭과 200% 대응 reflow를 검사한다.
- [x] 문제 8종과 전체 8 archetype의 radius·device 행렬 및 대표 screenshot을 검사한다.
- [x] keyboard/AX, locale 전환, Pages base lazy chunks와 diagnostics 0을 검사한다.

**Verification:** 프로젝트 내 감사 11 Chrome report·screenshots 보존

## Task 8: 문서·증거·최종 리뷰

- [x] README/CHANGELOG/spec/designs/ADR를 구현과 동기화한다.
- [x] finding별 대조·수정·검증을 `re_audit_evidence_11.md`에 기록한다.
- [x] correctness/readability/architecture/security/performance 5축 diff 리뷰를 완료한다.

**Verification:** `git diff --check`, 비밀 패턴 검사, 최종 자동·브라우저 게이트 기록
