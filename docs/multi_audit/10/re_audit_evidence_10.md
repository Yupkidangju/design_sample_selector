# Audit 10 수정 및 재감사 증거

- 기록 시각: 2026-08-31 (Asia/Seoul)
- 원본 판정: `REWORK REQUIRED / GitHub Pages HOLD`
- 현재 판정: **저장소·빌드·Pages-like Crostini Chrome PASS / 실제 GitHub Pages HOLD**
- 원본 보고서: `docs/multi_audit/10/final_audit_report_10.md`

## 1. 원본 무결성과 검증 방법

원본 최종 보고서와 sealed 하위 보고서는 수정하지 않았다. 원본 manifest의 크기와 SHA-256을 다시 계산해 모두 일치함을 확인한 뒤, 각 finding을 현재 문서·소스·Vite manifest·실제 Pages HTTP 응답에 대조했다. 계약 선택이 필요했던 항목은 구현 전에 `spec.md` 5.9, `designs.md` 2.8, Decision 020, README와 BUILD_GUIDE에 먼저 기록했다.

## 2. Finding별 판정

| Finding | 대조 결과 | 수정 및 재감사 판정 |
| --- | --- | --- |
| FIN-F001 source-root Pages | 실제 Pages가 source `index.html`과 `src/main.js`를 계속 제공함 | Vite base, Actions `dist` deploy와 closure gate는 완료. **저장소 Resolved / live HOLD** |
| FIN-F002 무제한 shared retry | 이전 loader가 마지막 importer를 반복함 | component/detail graph 모두 primary + retry 1회, 두 번째 실패는 terminal. **Resolved** |
| FIN-F003 Detail/Split recovery 우회 | Detail이 component loader를 직접 쓰지 않음 | Detail 전체 graph dynamic import를 유일 recovery owner로 계약화하고 중복 owner를 만들지 않음. **Resolved by contract** |
| FIN-F004 Peek affordance 불일치 | 안내만 있고 dblclick/native control이 없었음 | native `상세 보기` button Enter/Space와 card dblclick을 `openDetailFor()`에 연결. **Resolved** |
| FIN-F005 false-green QA | production base·shared/CSS/Detail fault를 검사하지 않음 | Pages-like subpath, 7 network + 2 consumer fault matrix를 deploy workflow에 연결하고 기존 네 Chrome QA도 project base로 수정. **Resolved locally** |
| FIN-F006 비트랜잭션 mount | 초기 subscriber throw 후 listener/disposer 보장이 없었음 | subscribe 초기 callback rollback, Detail cleanup disposer, handler/RAF/mockup/DOM rollback을 추가. **Resolved** |
| FIN-F007 오류 원인 소실 | bare catch가 phase/attempt를 남기지 않음 | 안전한 5필드 diagnostic을 최대 20개 기록하고 사용자 메시지와 분리. **Resolved** |
| FIN-F008 artifact/cache 계약 | directory provenance와 closure가 없었음 | 15-file hash/MIME/release manifest 및 단일 Pages artifact를 적용. GitHub Pages의 이전 hash 보존 부재는 잔여 플랫폼 위험. **Mitigated / live pending** |
| FIN-F009 base/deep path | 지원 URL이 미정이었음 | `/design_sample_selector/` root + query/hash만 지원, deep path는 404 계약. **Resolved** |
| FIN-F010 renderer trust | executable HTML sink 강제가 없었음 | script/iframe/object/embed/link/meta, inline event, `javascript:` URL을 registry에서 거부. **Resolved** |
| FIN-F011 storage budget | 손상·대형 payload 기준이 없었음 | key당 16,384 UTF-16자, bookmark 120, recents 6; 손상/초과 key 제거. **Resolved** |

## 3. RED → GREEN 증거

- 최초 Audit 10 집중 테스트는 workflow/base/verifier/terminal/diagnostic 부재로 `0/4` 실패했다.
- 두 번째 집중 묶음은 Peek, subscriber rollback, storage, executable sink, Detail disposer 부재로 신규 5개가 모두 실패했다.
- 수정 후 Audit 10 집중 테스트와 관련 scalability 테스트는 `29/29`, 최종 전체 Node 테스트는 `190/190`으로 통과했다.
- project base 적용 직후 기존 Discovery와 Actual-120 스크립트가 `/` 및 `/src/...`를 사용해 실제로 실패했다. 네 Chrome 스크립트와 in-page import를 project base 상대 경로로 고친 뒤 모두 재통과했다. 이 과정은 FIN-F005 false-green 수정의 직접 증거다.

## 4. 최종 자동 게이트

| Gate | 결과 |
| --- | --- |
| `npm test` | 190/190 PASS |
| Catalog / themes | 오류 0, 기존 legacy 경고 56 / 두 생성 CSS 최신 |
| `npm run build` | Vite 78 modules, Pages closure 15 files PASS |
| `npm run analyze:bundle` | JS 86.73/88.98kB, CSS 32.90/33.00kB gzip PASS |
| `npm audit --omit=dev --offline` | 취약점 0 |
| Pages-like Chrome 151 | 정상 Preview/Detail/Split + network 7종 + render/hydrate 2종, issue 0 |
| Actual-120 Chrome 151 | 1,920상태, Web 480탭, LCP 1,092ms, CLS 0, interaction median/max 16.7/122.8ms, issue 0 |
| Scalability Chrome 151 | actual + synthetic 60/120, LCP 848ms, CLS 0, issue 0 |
| Wave 1 Chrome 151 | 576상태, 6폭, issue 0 |
| Discovery Chrome 151 | 9시나리오, 6폭, issue 0 |

## 5. 보존 산출물

| Report | Bytes | SHA-256 |
| --- | ---: | --- |
| `.antigravity/archive/audit10-re-audit/pages-recovery/report.json` | 47,753 | `7f9761dfef8c99e1387c3d04523a7773c10cb22b18c75fc79a51b68bc5242d2e` |
| `.antigravity/archive/audit10-re-audit/catalog120/report.json` | 13,044 | `b4a41074cf836e6115c147b7ac3c3be8bc2e3fbeceb95ad410b1eb9ab09098ba` |
| `.antigravity/archive/audit10-re-audit/scalability/report.json` | 19,241 | `8b38ab5d287e17823e1931d7b7de60e84efc82a7de888e6f348d4400b27e0d2b` |
| `.antigravity/archive/audit10-re-audit/wave1/report.json` | 12,929 | `00ac87407656e1a7853938c8f114d296e4df55a828fb0c0cdf9e82be2c2ff7aa` |
| `.antigravity/archive/audit10-re-audit/discovery/report.json` | 8,102 | `9021e08ac1a94c0b64232ef15ee3d790c912515b2198fa27f252765653162ebe` |

Pages-like terminal hydrate 화면은 `.antigravity/archive/audit10-re-audit/pages-recovery/terminal-hydrate.png`에 보존했다. 각 Chrome 실행은 `/usr/bin/google-chrome` 151.0.7922.173과 격리 임시 profile을 사용했다.

## 6. 실제 Pages 재검증과 남은 작업

2026-08-31 최종 HTTP 재검증 결과:

- live `index.html`: HTTP 200, SHA-256 `e18ccd8b…f61`, 로컬 source `index.html`과 동일, `src/main.js` 참조
- live `src/main.js`: HTTP 200, `application/javascript`, `cache-control: max-age=600`
- 새 local build entry `assets/index-DL16yUXG.js`: live HTTP 404

따라서 코드와 workflow는 배포 가능한 상태지만 운영 HOLD는 해제하지 않는다. 다음 운영 단계는 이 변경을 push한 뒤 Repository Settings → Pages → Source를 **GitHub Actions**로 선택하고 workflow 성공을 확인하는 것이다. 그 후 fresh/cache Chrome에서 hashed entry, lazy/shared JS·CSS 200/MIME, Preview·Retry·Detail·Split, CSP·Google Fonts와 release SHA를 다시 기록해야 최종 live PASS로 전환할 수 있다.
