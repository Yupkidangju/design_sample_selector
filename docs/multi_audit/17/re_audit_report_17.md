# 재감사 보고서 17 — A16 지적사항 수정 검증

## 1. 감사 메타데이터

- 감사일: 2026-09-03 (Asia/Seoul)
- 대상: 현재 로컬 `design_sample_selector_2`
- 범위: A16-F001 구조적 공유/포커스 재귀 결함과 A16-F002 검증 기준선 문서 불일치의 재감사
- 범위 외: 대상 폴더 밖의 프로젝트, 원본 폴더, 원격 저장소, 외부 게시·배포·병합
- 제품 소스 수정: 없음
- 감사 산출물: 이 보고서와 `docs/multi_audit/17/evidence/`
- 최종 판정: **PASS WITH MINOR FOLLOW-UP — Major 해결, Minor 1건 잔존**

## 2. 결론

A16-F001은 해결됐다. `AppStateManager`는 manager별로 중첩 기본값을 복제·동결하고, `setState()`에서 변경된 중첩 값만 새로 복제·동결하며 변경되지 않은 값은 이전 참조를 재사용한다. subscriber에는 frozen current/previous state가 직접 전달된다. 직접 probe에서 `galleryFocusId`만 변경할 때 `bookmarks`, `compareSubIds`, `activeFacets`, `audio`, `liveTweaks` 참조가 모두 유지됐고 실제 `bookmarks` 변경 때만 해당 참조가 달라졌다. manager 간 격리와 mutation 차단도 유지됐다.

이전 실패와 동일한 Actual-120 Chrome 경로는 1,920개 상태와 Web 480개 탭을 완료했다. lazy loading 중 Escape와 정상 Detail 종료 모두 opener focus를 복원했으며 page exception·console/network 진단·browser issue는 0건이다. interaction max는 `109.9ms`로 200ms hard gate를 통과했다. Discovery Chrome도 9개 시나리오와 6개 폭을 진단/issue 0으로 통과해 검색·필터 구독 반응성 회귀가 없음을 교차 확인했다.

A16-F002는 아직 해결되지 않았다. 현재 자동 검증은 Node `293/293`, 초기 JS `88,915/88,980B`(여유 `65B`), CSS `32,936/33,000B`(여유 `64B`)인데 current 기준선 문서에는 `290/290`과 일부 `60B`가 남아 있다.

| 등급 | Open |
| --- | ---: |
| Critical | 0 |
| Major | 0 |
| Minor | 1 |

## 3. A16 finding 재판정

| ID | 현재 상태 | 근거 |
| --- | --- | --- |
| A16-F001 | **Resolved** | immutable structural sharing, frozen subscriber state, instance isolation 직접 probe 통과; Actual-120 Chrome opener 복원·exception 0·hard metric 통과 |
| A16-F002 | **Open** | current 문서의 `290/290` 및 `60B`가 실제 `293/293` 및 `65B`와 불일치 |

## 4. 검증 결과

| 검증 | 결과 |
| --- | --- |
| AppState 표적 회귀 테스트 | **PASS** |
| 구조적 공유·동결·instance 격리 직접 probe | **PASS** |
| `npm run check` | **PASS**, Node 293/293, catalog errors 0 / accepted legacy warnings 56, themes current, Vite 100 modules |
| 초기 bundle analyzer | **PASS**, JS `88,915/88,980B`, CSS `32,936/33,000B` gzip |
| `npm run verify:pages-artifact` | **PASS**, closure 23 files |
| `npm audit --audit-level=high` | **PASS**, vulnerabilities 0 |
| `git diff --check` | **PASS** |
| Actual-120 Chrome | **PASS**, 1,920 states / Web 480 tabs / diagnostics 0 / issues 0 |
| Actual-120 focus | **PASS**, lazy Escape와 정상 Detail 종료 모두 opener 복원 |
| Chrome vitals | LCP `976ms`, CLS `0` |
| Chrome interaction | median `20.1ms`, max `109.9ms / 200ms` **PASS** |
| Discovery Chrome | **PASS**, 3 gallery modes / 9 scenarios / 6 widths / diagnostics 0 / issues 0 |

## 5. 해결 확인 상세

### [A16-F001] 구조적 공유와 immutable subscriber 계약

- 위치: `src/state/appState.js:280-356,423-438`
- 회귀 테스트: `tests/auditRemediation10.test.js:390-439`
- 확인 사항:
  1. 각 manager가 `activeFacets`, `compareSubIds`, `bookmarks`, `recentlyViewed`, `liveTweaks`, `audio`를 독립 복제하고 동결한다.
  2. top-level state는 갱신마다 교체되지만 변경되지 않은 중첩 값의 참조는 유지된다.
  3. 실제 변경된 중첩 값만 새 참조를 받는다.
  4. subscriber의 current/previous 인자는 동결 상태이며 각각 현재 state와 바로 이전 state다.
  5. 별도 manager 인스턴스의 기본 컬렉션은 오염되지 않는다.
  6. Actual-120 실제 브라우저에서 이전 `restoreLazyOpener → focus → setState → notify` 재귀가 재현되지 않는다.

## 6. 잔존 finding

### [A16-F002] current 검증 문서의 수치가 최종 산출물과 동기화되지 않았다

- 등급: **Minor**
- 위치:
  - `README.md:138`
  - `BUILD_GUIDE.md:271,280`
  - `audit_roadmap.md:91`
  - `DESIGN_DECISIONS.md:348,513`
  - `implementation_summary.md:124,131,137`
- 실제값:
  - Node: `293/293`
  - 초기 JS: `88,915/88,980B` gzip, 여유 `65B`
  - 초기 CSS: `32,936/33,000B` gzip, 여유 `64B`
- 문서값: Node `290/290`; `BUILD_GUIDE.md`의 JS 여유 `60B`.
- 영향: 기능 동작에는 영향이 없지만, 유지보수자가 테스트 증가와 매우 좁은 bundle headroom을 잘못 판단할 수 있다.
- 완료 조건: 역사 기록은 보존하고 “현재/current/latest”로 표시된 항목만 위 최종값에 맞춘다. 반올림 표기만 사용할 경우에도 테스트 수와 exact byte/headroom 표기를 함께 유지한다.

## 7. 최종 판정

**PASS WITH MINOR FOLLOW-UP — LOCAL SCOPE**

이전 Major 런타임 회귀는 코드, 직접 계약 probe, 전체 자동 게이트와 실제 Chrome 통합 흐름에서 해결이 확인됐다. 제품 기능은 승인 가능한 상태다. 다만 A16-F002 문서 동기화가 완료되지 않았으므로 “지적사항 전체 해결”로는 종결할 수 없다.
