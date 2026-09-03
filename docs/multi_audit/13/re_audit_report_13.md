# 재감사 보고서 13 — 로컬 수정본

## 1. 감사 메타데이터

- 감사일: 2026-09-03 (Asia/Seoul)
- 대상: `/home/eunho1/Projects/web/design_sample_selector_2`
- 범위: 현재 로컬 working tree의 소스, 테스트, 문서, 설정, 빌드 및 격리 Chrome 동작
- 제외: 원격 저장소, 병합, push, 배포, 원본 `design_sample_selector`
- 제품 소스 수정: 없음
- 감사 산출물: 이 보고서와 `docs/multi_audit/13/evidence/`
- 최종 판정: **REWORK REQUIRED**

## 2. 요약 판정

이전 감사의 Major 결함이었던 release manifest 검증과 Gallery CTA 키보드 동작은 수정됐다. CTA는 GRID/BENTO/SPECTRUM의 Enter·Space 6개 조합 모두 정확한 스타일의 Detail을 열었고 높이도 44px였다. 빌드, bundle, Pages artifact, dependency audit 및 광범위한 Chrome 행렬도 통과했다.

그러나 전체 Node 테스트가 오래된 구현 정규식 한 건 때문에 `285/286`으로 실패하며, `npm run check`는 첫 단계에서 차단된다. 또한 여러 문서가 현재 프로젝트를 v2.4.0 완료 상태로 선언하면서도 v2.3.0 identity, 이전 base, 과거 테스트 수와 bundle 수치를 현재 값으로 혼용한다. 완료 선언과 실제 게이트 상태가 일치하지 않으므로 로컬 PASS를 부여할 수 없다.

현재 집계:

| 등급 | Open | 비고 |
| --- | ---: | --- |
| Critical | 0 | 없음 |
| Major | 2 | 테스트 게이트 실패, current 문서 계약 불일치 |
| Minor | 5 | renderer, state/storage, audio, QA path, diff hygiene |
| Info/Deferred | 2 | untracked config, 성능·bundle 여유 |

## 3. 이전 finding 재판정

| ID | 이전 등급 | 현재 상태 | 재감사 근거 |
| --- | --- | --- | --- |
| FIN-F001 | Major | **Resolved** | manifest 검증이 `files.map()` 밖에서 실행되고 missing/malformed/SHA/base/file closure 음성 테스트가 통과함 |
| FIN-F002 | Major | **Resolved** | 3개 보기 × Enter/Space 실제 Chrome 6/6 통과; 선택한 CTA의 `data-sub-id`와 Detail `data-theme` 일치 |
| FIN-F003 | Major | **Open / Partially fixed** | 일부 상단 identity는 v2.4.0으로 바뀌었지만 current 문서와 측정치가 여전히 상충함 |
| FIN-F004 | Minor | **Resolved** | 세 CTA 실측 `69.0625 × 44px`; 반응형 QA overflow 0 |
| FIN-F005 | Minor | **Open** | raw HTML template의 text/attribute context escaping 미적용 |
| FIN-F006 | Minor | **Open** | mutable state 노출, setter bounds/facet allowlist, wrong-shape storage purge 미해결 |
| FIN-F007 | Minor | **Open** | AudioContext 부분 초기화와 scheduler 예외 rollback 미해결 |
| FIN-F008 | Minor | **Open / Conditional** | QA output path와 artifact symlink 경계가 fail-closed가 아님 |
| FIN-F009 | Info | **Deferred** | `project.config.js`는 로컬 실행에는 존재하지만 Git 추적 대상이 아님 |

## 4. 검증 결과

| 검증 | 결과 |
| --- | --- |
| `npm test` | **FAIL**, 285/286; Peek 정적 정규식 1건 실패 |
| `node --test tests/auditRemediation10.test.js` | **FAIL**, 9/10; 동일 실패 |
| catalog validation | PASS, errors 0 / 기존 허용 warnings 56 |
| generated theme freshness | PASS |
| `npm run build` | PASS, Vite 100 modules |
| `npm run analyze:bundle` | PASS, JS 88.87/88.98kB, CSS 32.94/33.00kB gzip |
| `npm run verify:pages-artifact` | PASS, closure 23 files |
| `npm audit --audit-level=high` | PASS, vulnerabilities 0 |
| Wave 1 Chrome | PASS, 3 modes / 6 widths / 576 detail states / issues 0 |
| Discovery Chrome | PASS, 9 scenarios / 6 widths / issues 0 |
| i18n Chrome | PASS, 5 locales / 9,620 field units / 30 reflow states / issues 0 |
| Pages recovery Chrome | PASS, network faults 7 / consumer faults 2 / issues 0 |
| Scalability Chrome | PASS, synthetic 60/120 / LCP 1232ms / CLS 0 / issues 0 |
| Catalog120 Chrome 단독 재실행 | PASS, 120 styles / 1,920 states / 480 Web tabs / interaction max 103.5ms |
| CTA keyboard Chrome | PASS, 6/6 / exact Detail ID / height 44px |
| `git diff --check` | **FAIL**, trailing whitespace 5건과 EOF blank line 1건 |

Catalog120 QA를 다른 무거운 Chrome QA 두 개와 병렬 실행한 최초 표본은 interaction max `268ms`로 200ms 기준을 넘었다. 동일 검증을 단독 재실행하면 `103.5ms`로 통과했다. 병렬 호스트 경합의 영향을 받은 비대표 표본으로 보되, 현재 bundle 여유가 매우 작으므로 성능 회귀 위험은 유지한다.

## 5. Open findings

### [R13-F001] 전체 테스트 게이트가 stale source-regex 때문에 실패한다

- 등급: **Major**
- 위치: `tests/auditRemediation10.test.js:167-174`, `src/components/peekPreview.js:150-161`
- 실제 결과: `npm test` 285/286, 표적 파일 9/10.
- 원인: 테스트는 `data-peek-open-detail` 문자열과 `addEventListener('click'`이 같은 줄에 있는 구현 형태를 요구한다. 구현은 버튼을 `openDetailBtn` 변수로 분리한 뒤 click·keydown handler를 연결하므로 기능은 존재하지만 정규식이 이를 인식하지 못한다.
- 영향: 제품 브라우저 동작은 정상이나 표준 완료 게이트 `npm run check`가 실패한다. 문서의 “검증 완료” 주장도 성립하지 않는다.
- 권고: 줄 배치에 의존하는 정규식을 제거한다. 최소한 변수 기반 연결을 검사하도록 갱신하고, 가능하면 native button의 click/Enter/Space와 double click이 같은 Detail ID를 여는 행동 테스트로 교체한다.

### [FIN-F003] current 문서 계약과 실제 상태가 일치하지 않는다

- 등급: **Major**
- 상태: **부분 수정**
- 근거:
  - `audit_roadmap.md:2-6,14,91`은 프로젝트명·버전·살아 있는 계약을 구 프로젝트/v2.3.0으로 두고 `npm run check` 통과를 current 사실로 표시한다.
  - `DESIGN_DECISIONS.md:2-3,348,357,513`은 v2.3.0, 이전 base, 180/180·284/284, 과거 bundle 수치를 혼용한다.
  - `designs.md:272`는 artifact base를 `/design_sample_selector/`로 표시한다.
  - `implementation_summary.md:97-98,124,131,143`은 문서 버전, 180/180, 76 modules, 88.60/32.86kB를 current 값으로 표시한다.
  - `BUILD_GUIDE.md:271-280`은 152/152, 75 modules, 83.46/32.86kB를 current baseline처럼 제시한다.
  - `README.md:138,181`은 285/285 및 과거 bundle, inspector v2.3.0을 표시한다. 현재 실제값은 285/286, 100 modules, 88.87/32.94kB다.
  - `CHANGELOG.md:3,10`은 구 프로젝트 identity와 `v2.4 preview / 보정 중`을 유지한다.
- 영향: 어떤 문서가 현재 acceptance 기준인지 불명확하며, 실패 중인 작업이 verified/complete로 오인된다.
- 권고: `spec.md`의 v2.4.0 로컬 계약을 기준으로 `audit_roadmap.md`, `DESIGN_DECISIONS.md`, `designs.md`, `implementation_summary.md`, `BUILD_GUIDE.md`, `README.md`, `CHANGELOG.md`를 동기화한다. 역사 기록은 그대로 둘 수 있지만 current 문장과 historical record를 명확히 분리한다.

### [FIN-F005] HTML renderer의 trust boundary가 강제되지 않는다

- 등급: **Minor**
- 위치: `src/components/archetypeTemplates.js:171-185,695-707,760-795` 및 유사 template sink
- 결과: 악성 `name`과 `categoryId`를 주입한 probe에서 element/handler/attribute 문자열이 반환 HTML에 보존됐다. 새 `data-category="${category}"`도 attribute context escaping 없이 추가됐다.
- 완화 요소: 현재 제공되는 120-style catalog는 프로젝트 소유 정적 데이터이며 angle-bracket 문자열이 0이므로 현재 shipped corpus에서 즉시 악용되는 XSS로 판정하지 않는다.
- 권고: text와 attribute context를 분리해 escape하거나 safe DOM assembly를 사용하고 8 archetype hostile-value 테스트를 추가한다.

### [FIN-F006] AppState와 저장값의 경계가 일관되지 않다

- 등급: **Minor**
- 위치: `src/state/appState.js:16-29,67-89,228-239,295-322`
- 결과: `getState()`는 내부 객체를 그대로 반환한다. setter는 5,000자 query와 unknown facet key/value를 허용하며, valid JSON이지만 wrong-shape인 bookmark/recent 값은 fallback을 사용하면서 저장 키를 정리하지 않는다.
- 권고: immutable snapshot, URL과 공유하는 query/facet normalizer, shape-invalid storage purge를 적용한다.

### [FIN-F007] Web Audio 실패가 transactional rollback을 보장하지 않는다

- 등급: **Minor**
- 위치: `src/audio/synthAudio.js:241-327,341-408`
- 결과: 부분 초기화 실패 probe에서 AudioContext 3개가 생성되고 0개가 close됐다. scheduler 시작 중 예외가 나면 engine과 AppState의 `isPlaying`이 true로 남을 수 있다.
- 권고: init 실패 시 생성한 context/node를 공통 cleanup하고, scheduler가 성공한 뒤 playing state를 commit하거나 catch에서 timer/state를 rollback한다.

### [FIN-F008] 로컬 QA 경로와 symlink 처리가 fail-closed가 아니다

- 등급: **Minor / Conditional**
- 위치: `scripts/verifyPagesArtifact.js:18-30`, 각 `verify*Chrome.js`의 `--artifacts=` 처리
- 결과: `safePath()`는 lexical containment만 확인하고 `listFiles()`는 symlink/non-regular entry를 명시적으로 거부하지 않는다. caller-supplied absolute artifact output도 project/temp root으로 제한하지 않는다.
- 완화 요소: package의 기본 명령은 고정된 안전 경로를 사용한다.
- 권고: `realpath` 기반 canonical containment, no-follow, regular-file 검사와 traversal/absolute/symlink fixture를 추가한다.

### [R13-F002] diff hygiene gate가 실패한다

- 등급: **Minor**
- 위치: `BUILD_GUIDE.md:2`, `designs.md:2-3`, `spec.md:2-3`, `tests/auditRemediation10.test.js:269`
- 결과: `git diff --check`가 trailing whitespace 5건과 EOF 여분 빈 줄 1건을 보고한다.
- 권고: 의미 변경 없이 해당 공백을 정리하고 `git diff --check`를 완료 게이트에 포함한다.

## 6. Resolved finding evidence

### FIN-F001 — release manifest validator

`scripts/verifyPagesArtifact.js:94-116`에서 `releaseFiles` 계산이 끝난 뒤 `requireReleaseManifest` 검증이 실행된다. 누락, malformed JSON, release SHA, base, file closure의 다섯 음성 경로가 모두 명시적 실패를 반환했고 정상 `dist` closure 23개는 통과했다.

### FIN-F002 / FIN-F004 — Gallery CTA

`src/components/mainView.js:392-407,455-464`가 CTA별 ID로 Detail을 열고 global gallery key handler가 interactive control을 제외한다. `src/styles/interactive.css:3011-3021`은 최소 44×44px를 보장한다. Chrome 152 실측:

| View | Key | Opened ID | Size | Result |
| --- | --- | --- | --- | --- |
| GRID | Enter / Space | swiss-grid | 69.0625×44 | PASS |
| BENTO | Enter / Space | swiss-grid | 69.0625×44 | PASS |
| SPECTRUM | Enter / Space | high-fashion | 69.0625×44 | PASS |

## 7. Info and accepted risks

- `project.config.js`는 현재 working tree에 있어 모든 로컬 실행은 성공하지만 추적되지 않았다. 현재 로컬-only 판정에는 영향이 없으며, 향후 clean handoff를 시작할 때 필수 변경 집합에 포함해야 한다.
- 초기 bundle 여유는 JavaScript 약 0.11kB, CSS 약 0.06kB뿐이다. 현재 분석기는 통과하지만 eager 코드/CSS가 조금만 늘어도 실패할 수 있다.
- catalog warning 56건은 기존 legacy 허용 기준선이다.
- 자동 i18n 검증은 구조, field provenance, overflow와 accessible name을 확인하지만 원어민 문체 품질은 증명하지 않는다.

## 8. 코더 수정 우선순위

Priority 0:

1. R13-F001의 stale 정규식 테스트를 행동 중심으로 교체해 `npm test`와 `npm run check`를 통과시킨다.
2. FIN-F003의 current 문서 identity, 상태, test/build/bundle 수치를 실제 결과와 동기화한다. 테스트가 통과하기 전에는 verified/complete로 쓰지 않는다.

Priority 1:

3. FIN-F005 renderer escaping과 hostile-value tests.
4. FIN-F006 immutable/bounded AppState 및 wrong-shape storage purge.
5. FIN-F007 audio init/scheduler cleanup과 failure injection tests.
6. FIN-F008 QA path/symlink confinement과 fixtures.
7. R13-F002 whitespace 정리와 `git diff --check` 통과.

마지막 재검증 순서:

1. `npm test`
2. `npm run check`
3. `npm run analyze:bundle`
4. `npm run verify:pages-artifact`
5. CTA keyboard, Wave1, Discovery, Catalog120, Pages recovery, i18n, Scalability Chrome QA
6. hostile renderer, AppState/storage, AudioContext/scheduler, traversal/symlink 음성 probe
7. `git diff --check`

## 9. 최종 판정

**REWORK REQUIRED — LOCAL SCOPE**

사용자 동작과 빌드 측면의 핵심 수정은 유효하며 리팩터링 결과는 이전 감사보다 분명히 개선됐다. 특히 artifact 무결성 검사, CTA 키보드 접근성, 44px target은 해결됐다. 다만 표준 테스트 게이트가 1건 실패하고 current 문서가 실제 상태를 잘못 선언하므로 완료로 승인할 수 없다. 원격·병합·배포는 이 판정에 포함하지 않는다.
