# 재감사 보고서 16 — 마지막 수정 검증

## 1. 감사 메타데이터

- 감사일: 2026-09-03 (Asia/Seoul)
- 대상: 현재 로컬 `design_sample_selector_2`
- 범위: 마지막 Minor 3건 수정, 회귀 테스트, 전체 자동 게이트, 빌드 산출물, 격리 Chrome actual-120 통합 흐름
- 범위 외: 대상 폴더 밖의 프로젝트, 외부 게시·배포·병합
- 제품 소스 수정: 없음
- 감사 산출물: 이 보고서와 `docs/multi_audit/16/evidence/`
- 최종 판정: **REWORK REQUIRED — Major 1건, Minor 1건**

## 2. 결론

마지막 세 수정 중 A15-F002와 A15-F003은 제대로 해결됐다. 특수 객체 프로토타입 키 다섯 개가 모두 generic aesthetic profile로 fallback하며, AudioContext `close()`의 동기 throw와 비동기 rejection도 전역 unhandled rejection 없이 정리된다.

A15-F001은 직접 변이와 manager 간 기본 배열 공유 문제 자체는 해결했지만, 새 snapshot 방식이 모든 중첩 참조를 매 호출마다 새로 만들어 기존 subscriber 비교 계약을 깨뜨렸다. Node 293/293과 build는 통과하지만 실제 Chrome에서 포커스 복구가 재진입해 `Maximum call stack size exceeded` 예외 6건이 발생한다. Detail 열기 처리시간은 `996.7ms`로 200ms hard gate를 초과했고 마지막 Detail Escape의 opener focus 복원도 실패했다.

따라서 마지막 수정은 단위 수준에서는 대부분 올바르지만 통합 수준에서는 승인할 수 없다.

| 등급 | Open |
| --- | ---: |
| Critical | 0 |
| Major | 1 |
| Minor | 1 |

## 3. Audit 15 finding 재판정

| ID | 현재 상태 | 근거 |
| --- | --- | --- |
| A15-F001 | **Partially fixed / Regression introduced** | subscriber mutation과 instance 오염은 차단했으나 unchanged nested reference 안정성이 깨져 실제 UI 재귀·성능 회귀 발생 |
| A15-F002 | **Resolved** | `Object.hasOwn()` allowlist; `__proto__`, `constructor`, `toString`, `valueOf`, `hasOwnProperty` 모두 8 archetype에서 예외 없이 generic fallback |
| A15-F003 | **Resolved** | `close()` 동기 throw와 rejected Promise 모두 처리; Node strict unhandled-rejection probe 통과 |

## 4. 검증 결과

| 검증 | 결과 |
| --- | --- |
| A15 표적 테스트 | **PASS** |
| 직접 AppState 변이·instance 격리 probe | **PASS** |
| 특수 category ID generic marker probe | **PASS**, 5/5 |
| Audio sync throw + async reject strict probe | **PASS** |
| `npm run check` | **PASS**, Node 293/293, catalog errors 0 / accepted legacy warnings 56, themes current, Vite 100 modules |
| 최초 sandbox 내부 `npm run check` | 환경 제약으로 CLI spawn stdout이 비어 2개 파일 실패; 동일 명령 정상 로컬 실행은 293/293 PASS |
| `npm run analyze:bundle` | **PASS**, JS `88,929/88,980B`, CSS `32,936/33,000B` gzip |
| `npm run verify:pages-artifact` | **PASS**, closure 23 files |
| `npm audit --audit-level=high` | **PASS**, vulnerabilities 0 |
| `git diff --check` | **PASS** |
| Actual-120 Chrome | **FAIL**, render 1,920 states / Web 480 tabs는 통과했으나 exceptions 6 / issues 3 |
| Chrome vitals | LCP `948ms`, CLS `0` |
| Chrome interaction | median `23.65ms`, max **`996.7ms / 200ms` FAIL** |

## 5. Open findings

### [A16-F001] immutable snapshot이 구조적 공유를 파괴해 Main View 재귀와 스택 오버플로를 만든다

- 등급: **Major**
- 위치:
  - `src/state/appState.js:280-289,314-323,431-436`
  - `src/components/mainView.js:375-378,518-553`
  - `src/main.js:137-160,275-283`
- 직접 재현: `galleryFocusId` 하나만 변경해도 subscriber의 current/previous에서 `bookmarks`, `compareSubIds`, `activeFacets`, `audio`, `liveTweaks` 참조 비교가 전부 `false`다.
- 실제 브라우저 재현:
  - `RangeError: Maximum call stack size exceeded` 6건
  - `restoreLazyOpener → focus → mainView focus handler → setState → notify → releaseLazyFocus → restoreLazyOpener` 재진입
  - Detail open processing `996.7ms`, hard gate 200ms 초과
  - input focus 상태 Detail Escape 후 opener 복원 실패
- 원인: `createSnapshot()`이 호출될 때마다 `cloneState()`로 unchanged nested collection/object까지 새 참조로 만든다. 그러나 Main View와 Selection Dock은 `state.bookmarks !== prev.bookmarks`, `state.activeFacets !== prev.activeFacets` 같은 참조 동일성을 변경 신호로 사용한다. 모든 `setState()`가 광범위한 변경으로 오인된다.
- 권고:
  1. unchanged field의 참조 동일성을 보존하는 immutable structural sharing을 복구한다.
  2. 가장 단순한 방향은 내부 state와 nested collection을 입력 시점에 clone+freeze하고, 변경되지 않은 필드는 그대로 재사용한 채 subscriber에 frozen current/previous state를 전달하는 것이다.
  3. snapshot 계층을 유지한다면 source nested reference별 memoization으로 current/previous snapshot이 동일한 source 값을 같은 frozen clone으로 공유하게 한다.
  4. `restoreLazyOpener`에 no-op guard만 추가하는 증상 수정은 금지한다. 다른 subscriber의 불필요한 paint와 참조 비교 오판이 남는다.
- 필수 회귀 테스트:
  - `galleryFocusId`만 변경했을 때 current/previous의 bookmarks, compare, facets, audio, tweaks 참조가 동일하다.
  - 해당 필드가 실제로 변경됐을 때만 참조가 달라진다.
  - lazy loading 중 Escape와 실제 Detail 종료 후 opener focus 복원이 page exception 0으로 통과한다.

### [A16-F002] current 검증 문서가 마지막 기준선과 동기화되지 않았다

- 등급: **Minor**
- 위치: `README.md:138`, `BUILD_GUIDE.md:271,277,280`, `audit_roadmap.md:91`, `DESIGN_DECISIONS.md:348,513`, `implementation_summary.md:124,131,143`
- 실제값: Node `293/293`, JS `88,929/88,980B`(51B 여유), CSS `32,936/33,000B`.
- 문서값: Node `290/290`, JS `88.92kB` 및 60B 여유.
- 영향: 테스트 수와 매우 좁은 bundle headroom의 current 기준선이 실제 산출물과 다르다.
- 권고: A16-F001 해결 후 최종 생성값으로 current 문서만 갱신하고 역사 기록은 그대로 유지한다.

## 6. 완료 조건

1. subscriber mutation 차단과 manager 격리를 유지하면서 unchanged nested field의 참조 동일성을 보존한다.
2. actual-120 Chrome에서 lazy loading Escape, 정상 Detail 종료, input focus Escape가 모두 opener를 복원한다.
3. page exception 0, interaction max 200ms 이하를 다시 만족한다.
4. `npm run check`, analyzer, Pages artifact, dependency audit와 `git diff --check`를 다시 통과한다.
5. current 문서를 최종 테스트 수와 bundle byte 값에 동기화한다.

## 7. 최종 판정

**REWORK REQUIRED — LOCAL SCOPE**

A15-F002와 A15-F003은 승인 가능하다. A15-F001은 mutation leak을 막는 과정에서 기존 subscriber의 구조적 공유 계약을 깨뜨려 실제 사용자 포커스·Detail 흐름에 Major 회귀를 만들었다. Node test green만으로는 완료가 아니며 이 상태는 통합 승인할 수 없다.
