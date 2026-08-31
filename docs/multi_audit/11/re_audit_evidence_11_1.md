# Audit 11 Re-audit #1 수정 및 재검증 근거

- 작성일: 2026-08-31 (Asia/Seoul)
- 기준 보고서: `re_audit_report_11.md`
- 기준 계약: `spec.md` §5.10
- 대상 finding: FIN-F004·FIN-F005·FIN-F007·FIN-F009 Re-audit #1
- 범위 판정: **저장소·로컬 Crostini Chrome 범위 PASS 후보**
- 제외: 전문 번역 감수, 실제 오디오 장치 출력, 운영 GitHub Pages의 CSP·Google Fonts 응답
- Git: 커밋·푸시하지 않음

## 1. 원본 보존과 계약 선행 변경

수정 전에 `re_audit_report_11.md`의 네 finding을 코드와 대조했다. 구현 전에 `spec.md` §5.10.10–11을 추가해 다음 기준을 먼저 고정했다.

1. locale catalog field는 `translated`, `approved-fallback`, `placeholder`로 구분한다. 국제적으로 통용되는 고유 디자인명만 사유가 있는 fallback으로 허용하고 snapshot은 `placeholder=0`이어야 한다.
2. Header·Discovery·Gallery·Detail·Split·recovery와 Inspector preview의 사람용 visible/ARIA/title/status는 같은 snapshot을 사용한다.
3. CSS comment, HTML visible/ARIA, Markdown heading/prose, DTCG description/display metadata는 locale별로 바뀌지만 CSS key·selector, HTML ID/data attribute와 DTCG structural key는 유지한다.

원본 sealed source report 3개, `source_report_manifest.json`, `source_report_manifest.sha256.json`, `final_audit_report_11.md`, `re_audit_report_11.md`는 수정하지 않았다.

## 2. RED 재현

수정 전에 `tests/auditRemediation11Reaudit1.test.js`를 추가하고 다음 6개 실패를 확인했다.

| 실패 모드 | 수정 전 결과 |
| --- | --- |
| catalog placeholder/fallback provenance | coverage ledger 부재로 실패 |
| 5 locale visible/ARIA/artifact copy parity | 전체 inventory 부재로 실패 |
| non-ko Discovery·HTML copy | 고정 한국어 및 공통 placeholder로 실패 |
| CSS/HTML/Markdown/DTCG human text 변화 | locale 인자가 출력에 영향을 주지 않아 실패 |
| 감사 대상 component의 고정 한국어 literal | Header·Discovery·Gallery·Detail에서 실패 |
| 5-locale Detail/Inspector Chrome gate | 전용 gate 부재로 실패 |

초기 실행은 `0/6 PASS, 6/6 FAIL`이었다. 수정 뒤 focus preservation 회귀를 추가했고, 최종 점검에서 발견한 mock runtime 고정 문자열에는 여덟 번째 테스트를 먼저 추가해 `7/8 PASS, 1/8 FAIL`을 확인한 뒤 수정했다.

## 3. Finding별 수정 대조

### FIN-F004 — locale catalog completeness

- `src/i18n/catalogOverlay.js`가 category·10개 facet/value·120 style summary·palette name/usage·characteristics·pros/cons를 locale별로 생성한다.
- 공통 placeholder를 completeness로 인정하지 않고 coverage ledger를 반환한다.
- `validateLocaleSnapshot()`은 copy completeness, coverage 존재와 `placeholder=0`을 검사한다.
- 일본어·중국어의 국제 고유 디자인명 120개만 `field=style.name`, `reason=international-proper-name`으로 보고한다.

| locale | translated | placeholder | approved fallback |
| --- | ---: | ---: | ---: |
| ko | 2,040 | 0 | 0 |
| en | 2,156 | 0 | 0 |
| ja | 2,036 | 0 | 120 |
| zh-CN | 2,036 | 0 | 120 |
| zh-TW | 2,036 | 0 | 120 |

### FIN-F005 — visible UI와 ARIA

- `src/i18n/copy.js`에 296개 key의 5-locale parity inventory를 두었다.
- Header, Discovery, Gallery pagination/main, Detail controls, bounded Detail/Split picker, lazy/fatal recovery 문자열을 활성 snapshot에서 해석한다.
- 8개 archetype의 shell visible text·ARIA·title·placeholder를 snapshot copy로 전환했다.
- 결제 dialog, 댓글·채팅 상태, 읽기 진행 ARIA와 game toast 등 상호작용 뒤 생성되는 mock runtime visible/ARIA/live status도 동일 snapshot에 연결했다.
- locale 재렌더 뒤 focus trap이 복원된 Inspector control을 다시 첫 버튼으로 덮던 결함을 `focusInitial: !localeChanged`로 수정했다.

### FIN-F007 — Inspector artifact locale

- `getArchetypeHTML()`은 snapshot을 받고 8개 archetype visible/ARIA copy를 locale별로 만든다.
- CSS generator는 locale별 theme/token/palette/tweak comment를 사용한다.
- Markdown generator는 locale별 heading과 상태·접근성·오디오·통합 prose를 사용한다.
- DTCG는 locale별 `$description`, display name과 locale metadata를 기록한다.
- palette stable ID, CSS custom property, HTML ID/data attribute, DTCG structural key는 display text와 분리했다.

### FIN-F009 — false-green gate

- Node 회귀는 human text가 5개 locale에서 달라지는 조건과 CSS/HTML/DTCG machine set 동일성을 동시에 검사한다.
- `scripts/verifyI18nInspectorChrome.js`는 격리 Chrome에서 5개 locale Detail의 Inspector 네 pane, document/select/DTCG locale 동기화, non-ko 금지 문자열, 상호작용 runtime live status, overflow, diagnostics와 tab/scroll/focus/theme/archetype 보존을 검사하고 화면 5개를 저장한다.
- actual-120 Dashboard gate가 번역 가능한 표시값 `COMPLETED`를 고정 비교하던 false assumption을 현재 visible success label에서 파생하도록 수정했다.
- actual-120의 최초 오디오 gesture는 좌표 기반 CDP click 대신 `Runtime.evaluate(userGesture=true)`로 실행해 고정 위젯 좌표 miss와 AudioContext 제품 실패를 구분한다.

## 4. 최종 자동 검증

| 명령 | 결과 |
| --- | --- |
| `npm test` | **214/214 PASS** |
| `npm run validate:catalog` | 오류 0, 기존 legacy 경고 56 |
| `npm run check:themes` | 두 생성 CSS 최신 |
| `npm run build` | Vite 89 modules, Pages closure 22 files PASS |
| `npm run analyze:bundle` | JS 88,191/88,980B, CSS 32,994/33,000B gzip PASS |
| `npm audit --omit=dev --offline` | 취약점 0 |
| `node scripts/verifyI18nInspectorChrome.js --artifacts=.../i18n-detail-inspector` | 5 locale, 4 pane, runtime live status 5개, 화면 5, diagnostics/issues 0 |
| `node scripts/verifyCatalog120Chrome.js --artifacts=.../catalog120` | audio pre-init 포함 1,920 상태, Web 480 탭, processing median/max 17.85/107.2ms, LCP/CLS 824ms/0, diagnostics/issues 0 |
| `node scripts/verifyCatalogDiscoveryChrome.js --artifacts=.../discovery` | 9 시나리오, 6 폭, 89/89 named input, diagnostics/issues 0 |
| `node scripts/verifyPagesRecoveryChrome.js --artifacts=.../pages-recovery` | network fault 7, consumer fault 2, issues 0 |

Chrome 버전은 `Google Chrome 151.0.7922.173`이며 사용자 기본 profile과 분리했다. actual-120은 오디오 probe를 제외하지 않고 AudioContext 생성 전 volume 0과 초기 gain 동기화까지 통과했다. 물리 장치의 실제 소리 출력 품질은 계속 제외 범위다.

## 5. 5-locale Inspector 증거

artifact root: `.antigravity/archive/audit11-rework-reaudit1/`

| locale | CSS comment | Live HTML copy | Markdown §1 | DTCG description | runtime status |
| --- | --- | --- | --- | --- | --- |
| ko | 한국어 | 한국어 | `개요 및 미적 설명` | 한국어 | `콤보 배수가 증가했습니다` |
| en | English | English | `Overview and aesthetic description` | English | `Combo multiplier boosted` |
| ja | 日本語 | 日本語 | `概要と美的説明` | 日本語 | `コンボ倍率が上がりました` |
| zh-CN | 简体中文 | 简体中文 | `概述与美学说明` | 简体中文 | `连击倍率已提升` |
| zh-TW | 繁體中文 | 繁體中文 | `概述與美學說明` | 繁體中文 | `連擊倍率已提升` |

각 locale의 CSS key 22개, HTML machine attribute 17개, DTCG top structural key 4개는 동일했다. locale 전환 전/후 Inspector tab은 `html`, focus는 `btn-inspector-copy`, theme/archetype은 `swiss-grid/game`으로 유지됐고 sidebar scroll은 재배치 뒤에도 0보다 큰 위치를 유지했다.

## 6. 원본 SHA-256 재검증

| 파일 | SHA-256 | size | 결과 |
| --- | --- | ---: | --- |
| `source_report_manifest.json` | `088e2ce39437633520b19adc501906248190d8494f4fe13b2e5730372d84e459` | 1,109 | sidecar 일치 |
| `sub_audit_01_tuner_contract_ui.md` | `add0d341a169a40515b4f139755f12168ed7cc6c6991316a8a99e1db0353fb0c` | 26,858 | manifest 일치 |
| `sub_audit_02_i18n_arch_runtime.md` | `2aff63ffed377bc3fb5659ccfc364c2a55156d1968b70dca29548be93fdafffe` | 32,119 | manifest 일치 |
| `sub_audit_03_security_resilience.md` | `4245c96ba186cf68ba2524b4f6be23dd3fa604028653c52c386f8eb5719d674f` | 37,468 | manifest 일치 |
| `final_audit_report_11.md` | `fe8d63bbce5c581354ecbce971d287930a41dba5ed1b82b5237d78435c4558d2` | 35,907 | 기준 기록 |
| `re_audit_report_11.md` | `632b1aca5bf231b62cd84c63d74529a90ea9157eaddd37d61701cc54067e84e3` | 19,341 | 기준 기록 |

## 7. 잔여 위험과 판정 경계

- 일본어·중국어 문구는 구조적으로 구현됐지만 전문 번역가의 문화권별 표현 감수는 별도 단계다.
- 초기 CSS 예산 여유는 6B, JS는 789B다. locale copy는 lazy chunk에 유지하며 다음 initial-path 기능도 bundle gate를 통과해야 한다.
- 운영 CSP·security headers·Google Fonts 응답은 실제 배포 응답 증거가 없어 이 근거로 종결하지 않는다.
- 이 문서는 코더의 수정·재검증 근거다. 독립 감사자의 최종 PASS 판정을 대신하지 않는다.
