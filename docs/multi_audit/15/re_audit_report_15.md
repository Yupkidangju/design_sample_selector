# 재감사 보고서 15 — 로컬 수정본

## 1. 감사 메타데이터

- 감사일: 2026-09-03 (Asia/Seoul)
- 대상: 현재 로컬 `design_sample_selector_2`
- 범위: 대상 폴더의 소스, 테스트, 문서, 설정, 빌드 산출물, 음성 probe, 격리 Chrome 런타임
- 범위 외: 대상 폴더 밖의 프로젝트, 외부 게시·배포·병합
- 제품 소스 수정: 없음
- 감사 산출물: 이 보고서와 `docs/multi_audit/15/evidence/`
- 최종 판정: **CONDITIONAL PASS — MINOR 3건**

## 2. 요약 판정

Audit 14의 Major 2건은 모두 해소됐다. 초기 JavaScript는 `88,915/88,980B` gzip으로 65B 여유를 확보했고, CSS도 `32,936/33,000B`로 통과한다. README·BUILD_GUIDE·설계 문서의 현재 기준선은 이 측정과 반올림 범위에서 일치한다. Mobile `shortDesc` escape, scheduler 실패 반환값, artifact tree symlink 거부도 구현과 음성 테스트에서 확인됐다.

전체 자동 게이트와 실브라우저 핵심 행렬은 통과했다. `npm run check`는 290/290, catalog 오류 0·승인된 legacy 경고 56, theme freshness와 100-module build를 통과했다. 격리 Chrome 152에서 Wave 1, Discovery, i18n/reflow, Pages recovery, Scalability, CTA keyboard 및 actual-120 직렬 3회가 모두 issue/애플리케이션 진단 0이었다.

다만 이전 FIN-F006은 `getState()` 반환만 보호됐고 `subscribe()`가 내부 state를 직접 노출한다. 추가 경계 검사에서 특수 객체 프로토타입 키를 category ID로 주면 generic fallback 대신 일부 아키타입이 예외를 내며, AudioContext 종료 Promise가 reject될 때 unhandled rejection이 발생한다. 셋 모두 현재 정적 120종의 정상 사용자 흐름을 차단하지 않아 Minor로 분류한다.

| 등급 | Open |
| --- | ---: |
| Critical | 0 |
| Major | 0 |
| Minor | 3 |

## 3. Audit 14 finding 재판정

| ID | 현재 상태 | 근거 |
| --- | --- | --- |
| A14-F001 | **Resolved** | 초기 JS `88,915/88,980B`; analyzer와 Scalability Chrome 모두 PASS |
| FIN-F003 | **Resolved** | current 문서의 `88.92/88.98kB`, `32.94/33.00kB`와 실제 생성값 일치 |
| FIN-F005 | **Resolved** | Mobile `shortDesc` text escape 및 8 archetype hostile-field 테스트 통과 |
| FIN-F006 | **Partially resolved / Open** | `getState()` collection clone+freeze는 해결; `subscribe()`가 내부 current/previous state를 그대로 전달 |
| FIN-F007 | **Resolved** | scheduler 시작 실패 시 반환 `false`, engine/AppState 정지, timer `null` 일치 |
| FIN-F008 | **Resolved** | 미참조 symlink를 issue로 기록하고 verifier FAIL; 현재 23-file closure PASS |

## 4. 검증 결과

| 검증 | 결과 |
| --- | --- |
| `npm run check` | **PASS**, Node 290/290, catalog errors 0 / accepted legacy warnings 56, themes current, Vite 100 modules |
| `npm run analyze:bundle` | **PASS**, JS `88,915/88,980B`, CSS `32,936/33,000B` gzip |
| `npm run verify:pages-artifact` | **PASS**, closure 23 files |
| `npm audit --audit-level=high` | **PASS**, vulnerabilities 0 |
| `git diff --check` | **PASS** |
| 비밀 패턴·프로젝트 symlink 검색 | **PASS**, 발견 0 |
| CTA keyboard Chrome | **PASS**, GRID/BENTO/SPECTRUM × Enter/Space 6/6, 정확한 Detail, 44px |
| Wave 1 Chrome | **PASS**, 3 modes / 6 widths / 576 states / diagnostics 0 |
| Discovery Chrome | **PASS**, 9 scenarios / 6 widths / diagnostics 0 |
| i18n/Inspector Chrome | **PASS**, 5 locales / 9,620 human units / 30 reflow states / diagnostics 0 |
| Pages recovery Chrome | **PASS**, network faults 7 / consumer faults 2 / issues 0 |
| Scalability Chrome | **PASS**, LCP 772ms / CLS 0 / synthetic 60·120 / issues 0 |
| Actual-120 Chrome run 1 | **PASS**, 1,920 states / Web 480, LCP 892ms, median/max 26.15/110.9ms |
| Actual-120 Chrome run 2 | **PASS**, 1,920 states / Web 480, LCP 880ms, median/max 21.65/129.2ms |
| Actual-120 Chrome run 3 | **PASS**, 1,920 states / Web 480, LCP 928ms, median/max 19.65/53ms |

## 5. Open findings

### [A15-F001] AppState 구독자가 내부 state와 공유 기본 배열을 변경할 수 있다

- 등급: **Minor**
- 위치: `src/state/appState.js:302-311,322,404-419`; `tests/auditRemediation10.test.js:289-306`
- 재현: 새 `AppStateManager`의 구독 콜백에서 `current.bookmarks.push('swiss-grid')`를 실행하면 첫 인스턴스 상태가 setter·저장·notify 없이 바뀌고, 그 뒤 만든 두 번째 인스턴스에도 `swiss-grid`가 나타난다.
- 원인: `getState()`는 clone+freeze하지만 `subscribe()` 초기 호출과 `notify()`는 `this.state` 및 얕은 `prevState`를 그대로 전달한다. 생성자도 얕은 `{ ...DEFAULT_STATE }`라 중첩 collection 기본값이 공유된다.
- 영향: 검증·영속화·변경 알림을 우회하고 인스턴스 간 상태를 오염시킬 수 있다.
- 권고: 생성 시 nested collection을 복제하고, subscriber에는 current/previous 모두 동일한 immutable snapshot 정책으로 전달한다. 초기 구독·notify·새 인스턴스 격리 음성 테스트를 추가한다.

### [A15-F002] aesthetic profile 조회가 객체 프로토타입 키를 generic fallback으로 처리하지 못한다

- 등급: **Minor**
- 위치: `src/components/archetypeTemplates.js:130-132`; `tests/previewIntegration.test.js:196-247,289-309`
- 재현: `categoryId='__proto__'`로 렌더하면 Game과 Chat이 `TypeError`를 던진다. 일반 미등록 문자열은 정상 generic fallback한다.
- 원인: `AESTHETIC_PROFILES[categoryId] || fallback` 조회가 상속 프로퍼티를 유효 profile로 오인한다.
- 영향: 현재 프로젝트 소유 정적 catalog는 안전하지만 renderer의 미등록 ID fallback 계약이 JavaScript 특수 키에서 깨진다.
- 권고: `Object.hasOwn(AESTHETIC_PROFILES, categoryId)` 또는 null-prototype/Map 기반 allowlist를 사용하고 `__proto__`, `constructor`, `toString` 회귀 테스트를 추가한다.

### [A15-F003] AudioContext 종료 Promise rejection이 처리되지 않는다

- 등급: **Minor**
- 위치: `src/audio/synthAudio.js:304-308`; `tests/auditRemediation10.test.js:318-338`
- 재현: `ctx.close()`가 `Promise.reject(new Error('close rejected'))`를 반환하도록 하면 `teardown()` 이후 엔진 참조는 정리되지만 프로세스에서 `unhandledRejection`이 발생한다.
- 원인: 현재 `try/catch`는 `close()`의 동기 throw만 잡고 반환 Promise의 rejection은 처리하지 않는다.
- 영향: 오디오 장치·브라우저 오류 경로에서 전역 unhandled rejection과 불필요한 오류 진단을 만들 수 있다.
- 권고: `close()` 반환 Promise에 명시적으로 catch를 연결하거나 teardown을 async로 만들고 await/catch한다. 동기 throw와 비동기 reject 양쪽 음성 테스트를 추가한다.

## 6. 완료 조건

1. 구독 콜백에서 current/previous collection을 변경할 수 없고 새 manager 인스턴스가 오염되지 않는다.
2. 모든 미등록 category ID가 특수 객체 키를 포함해 generic profile로 결정론적으로 fallback한다.
3. `AudioContext.close()`의 동기 throw와 비동기 reject 모두 전역 unhandled rejection 없이 정리된다.
4. 현재 290개 테스트와 세 음성 회귀 테스트, build/analyzer/artifact/diff 게이트를 다시 통과한다.

## 7. 최종 판정

**CONDITIONAL PASS — LOCAL SCOPE / MINOR 3건**

이전 재감사의 Major 차단은 제거됐고, 현재 정적 catalog를 사용하는 핵심 기능·접근성·성능·산출물 계약은 모두 통과한다. 남은 세 건은 정상 UI 경로의 출시 차단 수준은 아니지만, 불변성·미등록 입력·오류 복구 계약을 완결하려면 다음 수정 사이클에서 해소해야 한다.
