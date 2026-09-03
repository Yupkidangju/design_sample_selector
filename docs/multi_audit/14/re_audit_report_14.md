# 재감사 보고서 14 — 로컬 수정본

## 1. 감사 메타데이터

- 감사일: 2026-09-03 (Asia/Seoul)
- 대상: `/home/eunho1/Projects/web/design_sample_selector_2`
- 범위: 현재 로컬 working tree의 소스, 테스트, 문서, 설정, 빌드, 음성 probe 및 격리 Chrome 동작
- 범위 외: 외부 저장소, 병합, 게시 및 배포
- 보호 대상 접근·변경: 없음
- 제품 소스 수정: 없음
- 감사 산출물: 이 보고서와 `docs/multi_audit/14/evidence/`
- 최종 판정: **REWORK REQUIRED — LOCAL SCOPE**

## 2. 요약 판정

직전 재감사의 가장 큰 차단 원인이던 stale 정규식 테스트는 해소됐다. `npm run check`는 Node 290/290, catalog 오류 0, theme freshness, Vite 100-module 빌드를 모두 통과하며 `git diff --check`와 의존성 감사도 통과한다. Gallery CTA는 현재 코드에서 GRID/BENTO/SPECTRUM × Enter/Space 6/6으로 정확한 Detail을 열고 44px target을 충족한다. Wave 1, Discovery, 5-locale Inspector, Pages recovery 및 actual-120 Chrome 행렬도 애플리케이션 진단 0으로 통과했다. actual-120 성능은 직렬 3회 모두 계약 안이었다.

그러나 로컬 hard gate인 초기 JavaScript bundle이 `89,005B / 88,980B`로 25B 초과해 `npm run analyze:bundle`과 Scalability Chrome QA가 실패한다. 동시에 current 문서는 이 실패 상태를 verified/complete 또는 예산 내 상태로 표시한다. 이전의 renderer, AppState, Audio, artifact path 보정도 핵심 일부만 수정됐고, 새 테스트가 주장하는 전체 음성 경계를 실제로 검사하지 않아 우회 probe에서 네 문제가 재현됐다.

현재 집계:

| 등급 | Open | 비고 |
| --- | ---: | --- |
| Critical | 0 | 없음 |
| Major | 2 | bundle hard gate, current 문서 계약 |
| Minor | 4 | renderer, AppState, Audio 결과 계약, symlink fail-closed |
| Info | 0 | local-only 판정에 불필요한 추적/외부 상태는 제외 |

## 3. 직전 finding 재판정

| ID | 현재 상태 | 재감사 근거 |
| --- | --- | --- |
| FIN-F001 | **Resolved** | release manifest missing/malformed/SHA/base/file closure 음성 테스트와 현재 23-file closure 통과 |
| FIN-F002 | **Resolved** | CTA 실제 Chrome 3 views × 2 keys = 6/6, Detail ID 일치 |
| FIN-F003 | **Open / Partially fixed** | identity·base·테스트 수는 보정됐지만 current bundle 수치·예산 상태·verified 선언이 실제 실패와 불일치 |
| FIN-F004 | **Resolved** | CTA 69.0625×44px, 6개 폭 overflow 0 |
| FIN-F005 | **Open / Partially fixed** | name/category 및 여러 필드는 escape됐지만 Mobile `shortDesc`는 raw element를 허용 |
| FIN-F006 | **Open / Partially fixed** | query/facet/storage와 일부 nested object는 보정됐지만 bookmarks/compare arrays가 내부 상태를 노출 |
| FIN-F007 | **Open / Partially fixed** | partial-init context close와 scheduler rollback은 해결됐지만 `playBgm()` 성공 반환이 rollback 상태와 모순 |
| FIN-F008 | **Open / Partially fixed** | traversal/absolute/referenced symlink는 거부하지만 unreferenced symlink를 조용히 생략하고 PASS |
| R13-F001 | **Resolved** | `npm test`와 표적 테스트 통과 |
| R13-F002 | **Resolved** | `git diff --check` 통과 |
| FIN-F009 | **Not applicable** | 현재 local-only 실행에는 필요한 config가 존재하며 외부 전달 상태는 이번 감사 범위가 아님 |

## 4. 검증 결과

| 검증 | 결과 |
| --- | --- |
| `npm run check` | **PASS**, Node 290/290, catalog errors 0 / accepted legacy warnings 56, themes current, Vite 100 modules |
| `npm run build` | PASS, Pages manifest 생성, closure 23 files |
| `npm run analyze:bundle` | **FAIL**, JS 89,005/88,980B; CSS 32,936/33,000B gzip |
| `npm run verify:pages-artifact` | PASS, closure 23 files |
| dependency audit (`high`) | PASS, vulnerabilities 0 |
| `git diff --check` | PASS |
| CTA keyboard Chrome | PASS, 6/6, exact Detail theme, 44px |
| Wave 1 Chrome | PASS, 3 modes / 6 widths / 576 states / diagnostics 0 |
| Discovery Chrome | PASS, 9 scenarios / 6 widths / diagnostics 0 |
| i18n/Inspector Chrome | PASS, 5 locales / 9,620 human units / 30 reflow states / diagnostics 0 |
| Pages recovery Chrome | PASS, network faults 7 / consumer faults 2 / issues 0 |
| Actual-120 Chrome run 1 | PASS, LCP 960ms / CLS 0 / interaction median 23.4ms / max 112.2ms |
| Actual-120 Chrome run 2 | PASS, LCP 1020ms / CLS 0 / interaction median 31.7ms / max 110.5ms |
| Actual-120 Chrome run 3 | PASS, LCP 984ms / CLS 0 / interaction median 25.75ms / max 115.1ms |
| Scalability Chrome | **FAIL**, functional/accessibility diagnostics 0; bundle 25B 초과 1건 |

## 5. Open findings

### [A14-F001] 초기 JavaScript bundle hard gate가 25B 초과한다

- 등급: **Major**
- 위치: `src/scalability/renderWindow.js:6-14`, `scripts/analyzeInitialBundle.js:123-148`
- 실제값: JavaScript gzip `89,005B`, 예산 `88,980B`, 초과 `25B`; CSS `32,936/33,000B`.
- 영향: `npm run check`는 통과하지만 별도 필수 analyzer와 Scalability Chrome QA가 실패한다. 실제 사용자 성능은 직렬 3회 통과했으나 명시된 artifact budget 계약은 충족하지 않는다.
- 권고: 예산을 임의 상향하지 말고 eager path에서 최소 25B 이상을 제거한 뒤 build/analyzer/scalability를 재실행한다. 예산 변경이 제품 결정이라면 먼저 `spec.md`와 결정 기록을 함께 변경한다.

### [FIN-F003] current 문서가 실제 bundle 실패를 완료 상태로 표시한다

- 등급: **Major**
- 위치: `audit_roadmap.md:4,24-25,91`, `README.md:138`, `BUILD_GUIDE.md:269-280`, `DESIGN_DECISIONS.md:348,513`
- 근거:
  - roadmap은 `Local Refactoring Verified`와 scalability/actual-120 COMPLETE를 유지한다.
  - README는 현재 JS를 `89.01/89.10kB`로 써 승인 예산 `88.98kB`와 다른 분모를 사용한다.
  - BUILD_GUIDE는 current JS를 `88.87kB`, 여유 약 `0.11kB`로 표시한다.
  - 결정 문서는 `89.01kB`를 current baseline으로 기록하면서 초과 상태를 명시하지 않는다.
- 영향: 통과하지 않은 hard gate가 완료·검증으로 오인된다.
- 권고: A14-F001 해결 후 실제 생성값으로 current 문장을 동기화한다. 해결 전에는 verified/complete 대신 bundle gate pending/failed를 명시하고 역사 측정치는 historical로 분리한다.

### [FIN-F005] Mobile archetype의 `shortDesc`가 raw HTML sink로 남아 있다

- 등급: **Minor**
- 위치: `src/components/archetypeTemplates.js:317-363`, `tests/previewIntegration.test.js:289-304`
- 재현: 8 archetype에 고유 hostile tag를 주입하면 Mobile만 `<x-desc data-p=2>`를 raw element로 반환한다. 현재 테스트 fixture에는 악성 `shortDesc`가 있지만 assertion은 `<script>`와 `onclick`만 검사해 이를 놓친다.
- 완화: 현재 shipped 120-style corpus는 프로젝트 소유 정적 데이터다.
- 권고: `shortDesc`를 text-context escape하고 hostile field마다 고유 marker를 사용해 name/shortDesc/characteristics/palette/categoryId 전체를 각각 단언한다.

### [FIN-F006] AppState snapshot의 배열 두 개가 내부 상태를 노출한다

- 등급: **Minor**
- 위치: `src/state/appState.js:102-125,280-308`, `tests/auditRemediation10.test.js:289-303`
- 재현: `getState().bookmarks.push(...)`와 `getState().compareSubIds[0] = ...`가 다음 `getState()`의 내부 값을 직접 변경한다. root/audio/liveTweaks/activeFacets 및 facet value arrays는 동결된다.
- 영향: setter validation, persistence, notify를 우회해 UI 상태와 저장 상태가 어긋날 수 있다. `recentlyViewed`도 같은 반환 패턴이라 동일 보정이 필요하다.
- 권고: 반환 시 모든 배열을 clone+freeze하거나 내부 state 자체를 재귀 불변으로 만들고 bookmarks/compare/recent/facet mutation 음성 테스트를 추가한다.

### [FIN-F007] scheduler 시작 실패 후 `playBgm()`이 성공을 반환한다

- 등급: **Minor**
- 위치: `src/audio/synthAudio.js:352-364,407-429`, `src/components/audioWidget.js:81-90`, `tests/auditRemediation10.test.js:305-320`
- 해결된 부분: 부분 초기화 probe는 context created/closed `1/1`, engine refs null, initialized false다. scheduler 예외 뒤 engine/AppState도 false로 rollback한다.
- 남은 재현: `tickStep()` 시작 예외에서 `playBgm()`은 `true`를 반환하지만 `isPlaying=false`, `timerId=null`이다.
- 영향: Audio widget은 반환값을 신뢰하므로 실제 정지 상태에서 “재생 중” 상태 메시지를 표시할 수 있다.
- 권고: `startScheduler()`가 성공 여부를 반환하도록 하고 `playBgm()`이 rollback 후 `false`를 반환하게 한다. 반환값·engine state·AppState·timer를 함께 검증한다.

### [FIN-F008] artifact verifier가 미참조 symlink를 조용히 생략한다

- 등급: **Minor / Conditional**
- 위치: `scripts/verifyPagesArtifact.js:18-58,119-135`, `tests/auditRemediation10.test.js:323-338`
- 재현: 유효한 최소 artifact에 `/etc/passwd`를 가리키는 `leak.txt` symlink를 추가해도 `listFiles()`가 이를 생략하고 verifier는 issues 0 / PASS를 반환한다.
- 테스트 공백: 테스트 이름은 symlink 거부를 주장하지만 실제 fixture는 traversal, absolute, nonexistent, valid file만 검사한다.
- 완화: manifest가 직접 참조하는 symlink는 `safePath()`가 거부하며 기본 artifact output 경로는 고정돼 있다.
- 권고: tree traversal에서 symlink/non-regular entry를 issue로 기록하고 verifier 전체를 FAIL 처리한다. 실제 symlink fixture와 caller-provided output-root 정책도 별도로 검증한다.

## 6. 완료 조건

1. A14-F001: JS gzip이 `88,980B` 이하이고 analyzer 및 Scalability QA가 통과한다.
2. FIN-F003: current 문서의 수치·상태가 최종 재측정과 일치한다.
3. FIN-F005: 모든 hostile field가 8 archetype에서 raw tag/attribute를 만들지 않는다.
4. FIN-F006: 모든 collection snapshot mutation이 내부 상태를 바꾸지 못한다.
5. FIN-F007: scheduler 시작 실패의 반환값, engine/AppState, timer가 모두 실패 상태로 일치한다.
6. FIN-F008: artifact tree의 symlink/non-regular entry가 명시적 실패가 된다.
7. `npm run check`, analyzer, artifact verifier, dependency audit, diff check 및 브라우저 행렬을 다시 통과한다.

## 7. 최종 판정

**REWORK REQUIRED — LOCAL SCOPE**

이번 수정은 이전보다 분명히 개선됐다. 테스트 게이트, CTA 접근성, manifest, 공백 품질, identity/base, 저장값 정규화, AudioContext 정리와 scheduler 상태 rollback이 실제로 좋아졌다. 다만 bundle hard gate와 문서 진실성이 아직 Major 차단이고, 세 개의 새 보정 테스트가 자신이 주장하는 전체 경계를 검사하지 않아 네 Minor 결함이 남았다. 외부 상태나 배포 여부와 무관하게 현재 로컬 코드만으로도 완료 승인은 어렵다.
