# Final Multi-Audit Report — Local Scope Revision

## 1. Audit Metadata

- Audit Turn: 12
- Revision: Local-only scope clarification
- Date: 2026-09-03 (Asia/Seoul)
- Project Root: /home/eunho1/Projects/web/design_sample_selector_2
- Decision: REWORK REQUIRED within local scope
- Git Remote State: no configured remotes
- Product Source Mutation: 없음
- Audit Report Mutation: 이 최종 통합 보고서만 사용자 요청에 따라 재작성
- Protected Original: /home/eunho1/Projects/web/design_sample_selector 는 접근·실행·수정하지 않음

## 2. User Goal and Decision Basis

현재 working tree의 리팩터링 결과만 검증한다. 원격 저장소 연결, 병합, push, 실제 배포는 아직 수행하지 않으므로 이번 판정 범위에서 제외한다. 최종 판정은 로컬 소스, 테스트, 독립 빌드, 감사 전용 Chrome 실행과 직접 재현 결과만으로 결정한다.

## 3. Scope and Exclusions

포함:

- 현재 로컬 소스·테스트·문서·설정
- Node 테스트, catalog/theme 검증, Vite build, bundle 및 artifact verifier
- Gallery/Discovery/actual-120/i18n/recovery/scalability 브라우저 동작
- DOM, AppState, localStorage, Clipboard, Web Audio 및 로컬 QA 도구

제외:

- 모든 Git 원격, repository 연결 및 병합 계획
- GitHub 설정, branch protection, Actions 권한, Pages 환경 및 실배포
- 원본 design_sample_selector 폴더
- 원어민에 의한 번역 문체 감수

## 4. Work-Surface Inventory

| Surface | Inventory | Local Audit Focus |
| --- | ---: | --- |
| Application/source files | 104 | 사용자 동작, renderer, state, browser API |
| Test files | 22 | 회귀 및 negative-path coverage |
| QA/build scripts | 10 | 로컬 artifact와 테스트 신뢰성 |
| Locales | 5 | field parity, overflow, accessible name |
| Catalog | 120 styles | data integrity와 전체 도달성 |

## 5. Agent Allocation and Rationale

| Axis | Focus | Result |
| --- | --- | --- |
| Contract/functionality | 제품 계약, UX, 접근성 | 주 감사자 직접 보고 + 공학 보완 감사 |
| Engineering/runtime | test/build/artifact/maintainability | REWORK REQUIRED |
| Security/resilience | DOM/state/audio/tooling | 로컬 Minor 개선점 확인 |
| Engineering supplement | CTA keyboard/target/config | CTA 결함 독립 확인 |

계약 담당 에이전트가 보고서를 완결하지 못한 한계는 유지한다. 다만 로컬 차단 항목인 CTA 동작은 공학 보완 보고서와 주 감사자 브라우저 재현이 교차 확인했다.

## 6. Immutable Source Report Manifest

봉인된 하위 보고서는 당시 증거를 보존하기 위해 수정하지 않았다. 사용자 범위 정정 이전에 기록된 원격·배포 관련 하위 finding은 이 최종 통합 판정에서 모두 Out of Scope로 기각한다.

- Manifest: /home/eunho1/Projects/web/design_sample_selector_2/docs/multi_audit/12/source_report_manifest.json
- Manifest SHA-256: b77e09baf8a79899d45c95a05b755297a0ca2543c13224d633ed1d20c7642361

| Immutable Source | SHA-256 |
| --- | --- |
| sub_audit_01_contract_functionality.md | 27c015399017071208e3105d3d7102f9a8c3ef9213e6f55c629b71546e108bdb |
| sub_audit_02_engineering_runtime.md | ddaa090d64f300b65c94982ebf3ccee2398604939271c9e54f8f7966246c0d38 |
| sub_audit_02_engineering_runtime_supplement_1.md | 7529e1c54cbe194efed039792976c38fac08052f3df50cc23e6ed04b4ae40780 |
| sub_audit_03_security_resilience.md | 5b60701081d72d0994b0a1bf57a75e23d986457ae13d0946da5cecfa19d942dc |

## 7. Evidence and Commands

| Evidence | Result |
| --- | --- |
| git remote -v | 출력 없음 |
| local remote config query | remote.* 항목 없음 |
| npm test | 285/285 PASS |
| catalog validation | errors 0, legacy warnings 56 |
| generated theme freshness | PASS |
| Vite build to audit directory | PASS, 100 modules |
| full npm audit | 0 vulnerabilities |
| bundle analysis | JS 88,794/88,980 B; CSS 32,927/33,000 B |
| Wave 1 Chrome QA | 3 modes, 6 widths, 576 states, issues 0 |
| Discovery Chrome QA | 120 reachable, 9 scenarios, issues 0 |
| Catalog120 Chrome QA | 1,920 matrix, 480 Web tabs, issues 0 |
| recovery Chrome QA | 9 injected fault cases, issues 0 |
| i18n Chrome QA | 5 locales, 9,620 field units, 30 states, issues 0 |
| scalability Chrome QA | synthetic 60/120, LCP 820ms, CLS 0 |
| manifest tamper probe | 변조한 base를 검증하지 못하고 passed:true 반환 |
| CTA keyboard probe | focused CTA에서 Space 후 Detail 미개방 |
| CTA bounding box | 약 65.06×25px |
| hostile renderer probe | malicious name/category 문자열이 HTML에 보존됨 |
| shipped catalog scan | 120 styles, angle-bracket string 0 |

## 8. Coverage Gap Check

| Work Surface | Coverage | Evidence | Remaining Gap |
| --- | --- | --- | --- |
| Node behavior | Covered | 285 tests + 표적 probes | 일부 negative-path test 부족 |
| Fresh local build | Covered | 독립 build + bundle/artifact | manifest negative path 실패 |
| Gallery keyboard/accessibility | Covered | 독립 source review + Chrome | 결함 확인 |
| Catalog/discovery/scalability | Covered | Node + Chrome matrices | issues 0 |
| i18n structure/reflow | Partially Covered | automated 5-locale QA | 원어민 감수 제외 |
| DOM/state/audio | Covered | security review + probes | Minor 개선점 |
| Local QA path boundary | Covered | source inspection | symlink/path fixture 미실행 |
| Remote/merge/deployment | Excluded | 사용자 범위 정정 | 이번 판정에 영향 없음 |

## 9. Canonical Findings

### [FIN-F001] Release manifest validation is unreachable

- Sources: engineering DBG-F001, TEST-F001
- Areas: local artifact integrity
- Severity: Major
- Status: Confirmed
- Summary: release manifest 검증 블록이 files.map callback의 unconditional return 뒤에 있어 실행되지 않는다.
- Verified Evidence: scripts/verifyPagesArtifact.js:94-115; audit manifest base 변조 후에도 passed:true와 빈 issues 반환.
- Expected Basis: 누락·손상·SHA/base/file 불일치는 로컬 검증에서 실패해야 한다.
- Actual: 검증 함수가 해당 조건을 실행하지 않는다.
- Impact: 로컬 artifact 무결성 검사가 잘못된 PASS를 반환한다.
- Required Action: validation을 map 밖으로 이동하고 missing/malformed/base/SHA/file negative tests를 추가한다.
- Re-audit Method: 각 변조 fixture가 명시적 issue와 non-zero exit를 반환하는지 확인한다.
- Synthesis Rationale: 원격 배포 여부와 무관한 로컬 검증 로직 결함이다.

### [FIN-F002] Detail CTA keyboard activation is intercepted

- Sources: A01-F001, engineering supplement A02S1-F001
- Areas: 핵심 사용자 흐름, 키보드 접근성
- Severity: Major
- Status: Confirmed
- Summary: native Detail button에 focus한 Space가 자체 click 대신 global gallery compare shortcut으로 소비된다. Enter도 CTA 자신의 ID가 아닌 gallery focus state를 사용할 수 있다.
- Verified Evidence: mainView.js:194-200,267-273,340-346,375-400,427-475; isolated Chrome Space 재현.
- Expected Basis: native button의 Enter/Space는 동일한 해당 버튼 action을 실행해야 한다.
- Actual: Space는 compare를 바꾸고 Detail을 열지 않는다.
- Impact: 키보드 사용자가 의도한 style 상세를 안정적으로 열 수 없다.
- Required Action: interactive control에서는 gallery tile shortcut을 제외하거나 tile target으로 범위를 제한하고, 세 view의 Enter/Space 회귀 테스트를 추가한다.
- Re-audit Method: Grid/Bento/Spectrum CTA가 자신의 Detail을 열고 compare/bookmark를 변경하지 않는지 확인한다.
- Synthesis Rationale: 독립 정적 검토와 직접 브라우저 재현이 일치한다.

### [FIN-F003] Local product contract and measured baselines are inconsistent

- Sources: A01-F003, engineering IMP-F001
- Areas: spec, documentation, local acceptance criteria
- Severity: Major
- Status: Confirmed / clarification required
- Summary: 실행 구성과 구현 요약은 v2.4/_2 방향이지만 spec, README, designs, build guide 및 일부 기록은 v2.3 또는 이전 base·수치를 current로 유지한다.
- Verified Evidence: package.json, project.config.js, implementation_summary.md:2, README.md:1,138, spec.md:3-11, designs.md:3, BUILD_GUIDE.md:3.
- Expected Basis: 로컬 리팩터링을 검증할 단일 current contract가 필요하다.
- Actual: version, identity, test count와 bundle baseline이 문서마다 다르다.
- Impact: 코더가 어떤 acceptance target을 따라야 하는지 불명확하다.
- Required Action: 현재 로컬 프로젝트의 canonical identity/version을 정하고 spec.md부터 관련 문서를 동기화한다.
- Re-audit Method: version/base/test/bundle 문자열을 전체 검색해 하나의 승인 기준만 남는지 확인한다.
- Synthesis Rationale: 원격 연결과 별개인 로컬 source-of-truth 문제다.

### [FIN-F004] Detail CTA hit area is below the documented 44px line

- Sources: A01-F002, engineering supplement A02S1-F002
- Areas: touch/accessibility
- Severity: Minor
- Status: Confirmed
- Summary: 공통 CTA CSS는 11px text와 4px vertical padding만 제공한다.
- Verified Evidence: interactive.css:3011-3029; Chrome 측정 약 65.06×25px.
- Expected Basis: designs.md의 핵심/mobile control 44×44px 기준.
- Actual: 측정 높이 25px.
- Impact: 터치 오조작 가능성과 접근성 품질선 불일치.
- Required Action: card overflow 없이 최소 44px hit area를 제공하고 viewport별 assertion을 추가한다.
- Re-audit Method: 320/375/768/1440px에서 세 CTA의 hit area와 overlap을 측정한다.
- Synthesis Rationale: 현재 기능 실패보다는 사용성/접근성 문제이므로 Minor로 통합한다.

### [FIN-F005] Legacy HTML renderer does not enforce the Safe DOM contract

- Sources: security SEC-F001, XPF-F001
- Areas: renderer input provenance, DOM safety
- Severity: Minor
- Status: Needs Fix
- Summary: 일부 archetype/detail/main/audio template가 dynamic value를 context-correct escaping 없이 innerHTML 경로로 전달한다.
- Verified Evidence: hostile name/category가 game/media/chat HTML에 그대로 보존됐다.
- Expected Basis: spec.md:320의 unsanitized dynamic innerHTML 금지.
- Actual: 현재 catalog는 프로젝트 소유 정적 데이터지만 renderer API 자체는 신뢰 경계를 강제하지 않는다.
- Impact: 미래에 catalog/locale provenance가 바뀌면 element/attribute injection 경로가 될 수 있다.
- Required Action: text/attribute/style context를 구분한 escaping 또는 safe DOM assembly와 hostile-value tests를 추가한다.
- Re-audit Method: 8 archetype 및 gallery/detail/audio sink를 tag, quote, handler, javascript URL로 검사한다.
- Synthesis Rationale: shipped 120-style corpus에는 angle-bracket 문자열이 없어 현재 exploitable XSS로 과장하지 않는다.

### [FIN-F006] AppState and persisted-state bounds are bypassable

- Sources: security SEC-F002, SEC-F003
- Areas: state integrity, localStorage recovery
- Severity: Minor
- Status: Needs Fix
- Summary: getState가 mutable internal object를 반환하고 setter가 overlong query/unknown facet을 허용하며, valid JSON wrong shape를 storage에서 제거하지 않는다.
- Verified Evidence: direct mutation으로 5,000-char query, 1,000 bookmarks 및 unknown facet이 보존됐고 wrong-shape key가 남았다.
- Expected Basis: public state와 persisted input은 동일한 bounds/shape contract를 유지해야 한다.
- Actual: URL parser는 안전하지만 다른 public mutation path에서 제한을 우회할 수 있다.
- Impact: local state 불일치와 불필요한 CPU/memory·복구 반복.
- Required Action: immutable snapshot, shared normalizer 및 shape-specific purge를 적용한다.
- Re-audit Method: setter, returned snapshot, nested mutation 및 storage reboot fixture를 검사한다.
- Synthesis Rationale: 정상 URL/storage path의 positive controls는 유지한다.

### [FIN-F007] Web Audio failure recovery is not transactional

- Sources: security RES-F001, RES-F002
- Areas: browser API recovery
- Severity: Minor
- Status: Needs Fix
- Summary: partial AudioContext 초기화 실패는 context를 close하지 않고, scheduler failure는 playing state를 true로 남길 수 있다.
- Verified Evidence: fake context retries에서 created 3/closed 0; oscillator failure 후 engine/state playing true.
- Expected Basis: 실패한 browser API 작업은 resource/state를 rollback하고 retry 가능해야 한다.
- Actual: 정상 voice cleanup은 있으나 init/scheduler error boundary가 불완전하다.
- Impact: context quota, unhandled rejection 및 UI/audio 상태 불일치.
- Required Action: 공통 cleanup과 transactional scheduler start를 구현한다.
- Re-audit Method: constructor/node/resume/start/timer fault injection 후 cleanup과 retry를 확인한다.
- Synthesis Rationale: 실패 주입 조건의 복원력 문제이므로 Minor.

### [FIN-F008] Local QA artifact path and symlink handling are not fail-closed

- Sources: security QA-F001
- Areas: developer tooling filesystem boundary
- Severity: Minor
- Status: Conditional
- Summary: caller-provided artifact path는 allowed root을 강제하지 않고 artifact traversal은 lexical containment에 의존한다.
- Verified Evidence: verify scripts의 artifacts argument와 verifyPagesArtifact safePath/listFiles 구현.
- Expected Basis: 로컬 QA도 output/read 범위와 symlink escape를 제한해야 한다.
- Actual: 기본 package scripts는 안전한 고정 경로를 쓰지만 hostile/mistaken argument fixture는 방어되지 않는다.
- Impact: 조건부 외부 경로 overwrite/read/hash.
- Required Action: project/temp root canonicalization, no-follow 및 symlink/non-regular rejection을 추가한다.
- Re-audit Method: temp traversal, absolute path 및 symlink fixtures.
- Synthesis Rationale: 제품 runtime이 아니라 로컬 도구 경계이므로 Minor.

### [FIN-F009] Central config is currently untracked

- Sources: A01-F004, engineering supplement A02S1-F003
- Areas: future handoff readiness
- Severity: Info
- Status: Deferred by current scope
- Summary: project.config.js는 Vite/QA에서 필요하지만 아직 Git tracking 대상이 아니다.
- Verified Evidence: git status에서 untracked; git ls-files exit 1.
- Expected Basis: 현재는 로컬-only이므로 working tree 존재로 실행 가능하다. 이후 병합/전달 시에는 포함되어야 한다.
- Actual: 모든 로컬 테스트와 build는 해당 파일이 존재하는 현재 폴더에서 통과한다.
- Impact: 현재 로컬 기능에는 없음. 향후 clean checkout 전달 단계에서만 문제가 된다.
- Required Action: 지금은 차단하지 않는다. 사용자가 병합을 결정할 때 변경 집합에 포함 여부를 확인한다.
- Re-audit Method: 병합 직전 clean checkout에서 config import와 npm check를 확인한다.
- Synthesis Rationale: 사용자의 “아직 병합하지 않음” 범위 정정에 따라 Major gate에서 Info/deferred로 낮춘다.

## 10. Critical/Major Direct Re-verification

| Finding | Main Direct Check | Evidence | Result | Gate |
| --- | --- | --- | --- | --- |
| FIN-F001 | Yes | source control-flow + tampered local artifact | Confirmed | local PASS blocked |
| FIN-F002 | Yes | event flow + isolated Chrome Space | Confirmed | local PASS blocked |
| FIN-F003 | Yes | cross-document search and re-open | Confirmed | local PASS blocked |

## 11. Cross-Report Conflicts

- 하위 보고서의 원격·배포 위험은 사용자 범위 정정 전 관찰이다. 현재 remote가 제거됐고 병합·push·배포가 제외됐으므로 최종 finding과 gate에서 기각한다.
- project.config.js untracked는 clean checkout 관점에서 Major였지만 현재 로컬 working tree 검증에는 영향을 주지 않아 Info로 낮췄다.
- CTA target은 하위 보고서에서 Minor/Major가 갈렸다. 실제 크기는 기준보다 작지만 주 동작 자체는 pointer로 가능하므로 Minor로 통합했다.
- security report는 build/Chrome을 실행하지 않았지만 주 감사자가 감사 전용 경로에서 재실행해 로컬 runtime 증거를 보완했다.

## 12. Finding Adjudication Ledger

| Source Finding | Decision | Canonical Finding | Rationale |
| --- | --- | --- | --- |
| A01-F001 | Accepted | FIN-F002 | browser reproduction |
| A01-F002 | Merged | FIN-F004 | exact 25px measurement |
| A01-F003 | Merged | FIN-F003 | local contract drift |
| A01-F004 | Accepted with downgrade | FIN-F009 | local-only scope |
| IMP-F001 | Merged | FIN-F003 | document evidence |
| DBG-F001 | Accepted | FIN-F001 | tamper reproduction |
| TEST-F001 | Merged | FIN-F001 | negative-path gap |
| DBG-F002 | Out of Scope | None | remote/merge excluded |
| CI-F001 | Out of Scope | None | remote workflow policy excluded |
| A02S1-F001 | Merged | FIN-F002 | independent confirmation |
| A02S1-F002 | Merged | FIN-F004 | accessibility target |
| A02S1-F003 | Merged | FIN-F009 | deferred until handoff |
| SEC-F001 | Accepted | FIN-F005 | latent local DOM contract |
| SEC-F002 | Accepted | FIN-F006 | state boundary |
| SEC-F003 | Merged | FIN-F006 | storage shape variant |
| RES-F001 | Accepted | FIN-F007 | audio cleanup |
| RES-F002 | Merged | FIN-F007 | audio rollback |
| SUP-F001 | Out of Scope | None | deployment/supply-chain policy excluded |
| SUP-F002 | Out of Scope | None | CI audit policy excluded; manual full audit passed |
| PAGES-F001 | Out of Scope | None | remote deployment excluded |
| PAGES-F002 | Out of Scope | None | deployed network policy excluded |
| QA-F001 | Accepted | FIN-F008 | local tooling boundary |
| XPF-F001 | Merged | FIN-F005 | static trust conflict |
| XPF-F002 | Out of Scope | None | deployment enforcement excluded |

## 13. Required Actions Before Local PASS

Priority 0:

1. FIN-F001: artifact verifier control-flow 수정과 negative tests.
2. FIN-F002: CTA에서 native Enter/Space를 보존하고 세 view 회귀 테스트 추가.
3. FIN-F003: 현재 로컬 identity/version을 결정한 뒤 spec.md부터 관련 문서와 기준선 동기화.

Priority 1:

4. FIN-F004: CTA 44px hit area와 responsive assertion.
5. FIN-F005: renderer escaping/provenance 강제.
6. FIN-F006: immutable/bounded state와 wrong-shape storage purge.
7. FIN-F007: Audio failure cleanup/rollback.
8. FIN-F008: QA output/symlink confinement.

FIN-F009는 병합 또는 clean handoff를 시작할 때 확인하며 현재 로컬 PASS gate에는 포함하지 않는다.

## 14. Accepted and Remaining Risks

- 285개 Node 테스트와 모든 Chrome 회귀 매트릭스는 통과했다.
- JS budget 여유는 186 B, CSS는 73 B뿐이다. 현재 PASS지만 eager code/CSS 추가 전에 다시 측정해야 한다.
- catalog legacy warning 56건은 기존 허용 기준선이다.
- full npm audit는 0 vulnerabilities였다.
- 자동 i18n 검사는 구조·overflow를 증명하지만 원어민 문체 품질은 보장하지 않는다.
- 원격·병합·배포 위험은 현재 감사의 accepted risk가 아니라 명시적 제외 범위다.

## 15. Clarifications and Inconclusive Areas

- 현재 로컬 프로젝트가 v2.4.0으로 확정됐는지, v2.3.0 계약을 유지하는지 결정이 필요하다.
- five-locale prose의 원어민 품질은 미확정이다.
- 계약 감사자의 독립 보고서 실패로 넓은 계약 축은 부분 coverage다. 차단 finding은 공학 보완과 주 감사자 직접 재검증을 마쳤다.

## 16. Re-audit Checklist

- [ ] release manifest의 missing/malformed/base/SHA/file 변조가 모두 실패한다.
- [ ] Grid/Bento/Spectrum CTA가 Enter/Space에서 자신의 Detail을 연다.
- [ ] CTA keyboard가 compare/bookmark를 의도치 않게 변경하지 않는다.
- [ ] 세 CTA hit area가 44px 이상이고 mobile overflow가 없다.
- [ ] current identity/version/test/bundle 문서 값이 일치한다.
- [ ] hostile renderer value가 injected element/attribute를 만들지 않는다.
- [ ] AppState와 storage fixture가 모든 bounds/shape를 유지한다.
- [ ] Audio failure 뒤 context/timer/playing state가 정리되고 retry된다.
- [ ] QA traversal/symlink fixture가 거부된다.
- [ ] npm test, fresh build, bundle 및 여섯 Chrome QA가 다시 통과한다.

## 17. Final Decision

**REWORK REQUIRED — LOCAL SCOPE**

로컬 상태는 전반적으로 개선됐고 285개 테스트, 독립 build, dependency audit와 광범위한 Chrome 검증이 통과했다. 그러나 로컬 artifact verifier가 변조를 통과시키고, Detail CTA의 Space 키 동작이 실제 브라우저에서 실패하며, 현재 계약 문서가 서로 일치하지 않는다. 이 세 Major finding 때문에 아직 local PASS는 아니다.

원격 저장소, 병합, push, GitHub 설정 및 실제 배포는 이번 판정에서 완전히 제외했으며 배포 HOLD 판정도 철회한다.

## 18. Coder Handoff

먼저 FIN-F001과 FIN-F002를 테스트와 함께 수정하고, FIN-F003의 local identity/version을 사용자와 확정한 뒤 문서를 동기화한다. 이후 Priority 1을 처리하고 동일한 Node/build/Chrome 명령으로 재검증한다. 원격·병합·배포 설정은 건드리지 않는다.

`/home/eunho1/Projects/web/design_sample_selector_2/docs/multi_audit/12/final_audit_report_12.md`를 먼저 읽고, 로컬 범위의 각 finding을 프로젝트 문서와 실제 코드에 대조하여 검증한 뒤 우선순위대로 수정하세요. 원격·병합·배포 관련 변경은 하지 말고, 계약 변경이 필요하면 관련 문서를 먼저 갱신한 다음 테스트·빌드·재감사 증거를 기록하세요.
