# Audit 11 수정 및 재감사 증거

## 1. 범위와 판정

- 기준 보고서: `docs/multi_audit/11/final_audit_report_11.md`
- 수정일: 2026-08-31 (Asia/Seoul)
- 환경: Crostini, Google Chrome `151.0.7922.173`, Node/Vite 로컬 저장소
- 판정: **저장소·로컬 Crostini 범위 PASS**
- 미확정: 전문 번역 감수, 실제 운영 CSP·Google Fonts response header

원본 최종 감사 보고서와 sealed source report는 수정하지 않았다. 계약이 필요했던 semantic radius, 전환 행렬, locale ID·선택 우선순위·fallback·machine ID 불변성은 코드보다 먼저 `spec.md`, `designs.md`, `DESIGN_DECISIONS.md` Decision 021에 기록했다.

## 2. Finding별 대조 결과

| Finding | 판정 | 코드·문서 대조와 수정 | 재검증 |
| --- | --- | --- | --- |
| FIN-F001 | Resolved | `src/tuner/contract.js`의 공통 limits를 validator·AppState·DOM·generator가 사용한다. 문제 두 grammar의 surface 기본은 24px, pill은 `themeGeometry.pillRadius=999px`로 분리했다. | 120종 bounds scan, 8개 문제 ID, state 999 거부, CSS/Markdown/DTCG 회귀 |
| FIN-F002 | Resolved | 39개 broad `!important` radius 전파를 제거하고 8 archetype root의 `[data-tweak-surface]`에만 `--tweak-surface-radius`를 적용한다. | 정적 selector 회귀, actual-120 1,920 device 상태, 대표 Detail desktop/mobile |
| FIN-F003 | Resolved | theme/category는 대상 default로 reset, archetype은 tweak 보존, locale은 selection·tweak·runtime·Inspector UI·scroll·focus를 보존하는 행렬을 `spec.md`에 고정했다. | table/state 회귀와 Detail locale re-render snapshot/rehydrate |
| FIN-F004 | Resolved structurally | `ko/en/ja/zh-CN/zh-TW` registry, literal lazy import, URL→storage→browser→ko precedence와 last-known-good 실패 정책을 추가했다. 5 pack은 message key와 120 styles·8 categories·10 facets·palette display field를 검증한다. | 5 pack parity/completeness 테스트, Vite locale chunks 확인 |
| FIN-F005 | Resolved | AppState locale, native endonym select, `document.lang`, URL `lang`, 선택 locale 검색·이름 정렬과 주요 visible/ARIA copy를 동일 snapshot에 연결했다. | locale preference/URL/search/sort 테스트, Discovery Chrome keyboard·ARIA·history |
| FIN-F006 | Resolved | legacy palette projection이 canonical `id`를 보존하며 CSS custom property와 DTCG palette structural key는 display name이 아닌 stable ID를 쓴다. | 합성 CJK 충돌 corpus와 5 locale CSS/DTCG key-set equivalence |
| FIN-F007 | Resolved | Inspector context에 locale/epoch를 포함하고 CSS 3모드·HTML·Markdown·DTCG를 같은 immutable snapshot에서 생성한다. locale 전환은 stale frame 대신 전체 Detail을 snapshot/rehydrate한다. | locale transition state 회귀, 4-pane 동일 epoch 생성 경로 |
| FIN-F008 | Resolved for localized/artifact boundary | code pane은 빈 구조를 만든 뒤 `textContent`로 채운다. catalog text는 HTML escape를 거치며 CSS comment, Markdown, palette CSS value와 JSON은 컨텍스트별 sanitize/validation을 사용한다. | `<script>`, comment terminator, Markdown pipe/backtick, JSON corpus 테스트 |
| FIN-F009 | Resolved | Audit 11 전용 회귀 16개를 포함해 bounds·URL·5 locale·stable key·악성 문자열·Chrome gate 조건을 고정했고 locale/catalog overlay는 초기 bundle 밖으로 분리했다. | 최종 Node 206/206, build/budget/dependency/Chrome 결과 |
| FIN-F010 | Resolved | facet allowlist, null-prototype accumulator, own-property 경계와 query 4096/entry 128/search 120자 상한을 적용했다. | `__proto__`, `constructor`, `toString`, 9kB query와 popstate 회귀 |
| FIN-F011 | Verified | locale-neutral wrapping을 유지하고 최종 빌드에서 5 locale × 320/768/1280/1920과 1280 물리 px/2× scale의 640 CSS px reflow를 캡처했다. | `chrome/`의 25개 원본과 3개 montage 육안 검사; Discovery 6폭 overflow 0 |
| FIN-F012 | Resolved | validator와 artifact consumer가 hex/rgb/transparent/linear-gradient만 공유해 허용하며 radial-gradient/hsl 등 consumer 밖 문법은 거부한다. | valid/invalid CSS value corpus와 catalog build gate |

## 3. 자동 검증 결과

### Node·catalog·build

| 명령 | 결과 |
| --- | --- |
| `npm test` | 206/206 PASS, fail 0 |
| `npm run validate:catalog` | 오류 0, 기존 legacy 경고 56 |
| `npm run check:themes` | 두 생성 CSS 최신 상태 |
| `npm run build` | Vite 87 modules, Pages closure 21 files PASS |
| `npm run analyze:bundle` | JS 88,979/88,980B, CSS 32,994/33,000B gzip PASS |
| `npm audit --omit=dev --offline` | 취약점 0 |

초기 gzip 여유는 JS 1B, CSS 6B뿐이다. 이 수치는 계약을 낮추지 않고 통과했지만 다음 초기 경로 변경의 명시적 회귀 위험이다. 한국어 외 UI pack과 catalog overlay는 각각 hashed dynamic chunk로 생성되고 Pages closure에 포함된다.

### Actual-120 Chrome

명령:

```bash
DSS_SKIP_AUDIO_PROBE=1 node scripts/verifyCatalog120Chrome.js \
  --artifacts=.antigravity/archive/audit11-rework/catalog120-matrix-final
```

- 120 styles, category별 `15,15,15,15,15,15,15,15`
- 120 × 8 archetype × desktop/mobile = `1,920` 상태
- Web 4탭 = `480`
- matrix failure `0`, diagnostics `0`, issues `0`
- LCP `780ms`, CLS `0`
- interaction processing median `17.85ms`, max `99.5ms`
- 보고서: `.antigravity/archive/audit11-rework/catalog120-matrix-final/report.json`

`DSS_SKIP_AUDIO_PROBE=1`은 일반 게이트의 기본값이 아니다. Crostini headless가 오디오 장치를 제공하지 않아 autoplay bypass로도 AudioContext가 running이 되지 않는 환경에서만 오디오 probe와 그 실행의 SFX를 명시적으로 제외한다. 제품 기본값과 일반 게이트는 유지되며 보고서의 `audit9.audioPreInit.skipped/reason/sfxDisabledForRun`에 제외 사실이 남는다. autoplay bypass 실패 증거는 `.antigravity/archive/audit11-rework/catalog120-autoplay-bypass/report.json`이다. 최초 볼륨 상태→gain 동기화는 Node 회귀로 별도 통과했으며, 실제 오디오 출력은 이번 환경에서 결론 내리지 않는다.

### Discovery·Pages Chrome

- Discovery: GRID/BENTO/SPECTRUM 각각 120/120 도달, 사용자 시나리오 9개, 폭 320/375/414/768/1024/1440, facet input 89/89 label, touch target 위반 0, overflow 0, diagnostics/issues 0.
- Discovery 게이트는 `body[data-app-pending]` 제거를 기다리고 scroll 뒤 두 animation frame에서 실제 결과 ID 변화를 확인하며, pagination status focus를 별도 검사한다.
- Pages/Recovery: network fault 7, consumer fault 2, issues 0. locale와 catalog overlay를 포함한 dynamic JS/CSS closure는 build artifact verifier가 확인한다.
- 보고서: `.antigravity/archive/audit11-rework/discovery-final/report.json`, `.antigravity/archive/audit11-rework/pages-final/report.json`

## 4. 시각 증거

- locale별 원본: `.antigravity/archive/audit11-rework/chrome/{ko,en,ja,zh-CN,zh-TW}-{320,768,1280,1920}.png`
- 200% 대응 reflow: `.antigravity/archive/audit11-rework/chrome/{ko,en,ja,zh-CN,zh-TW}-zoom-200.png`
- montage: `montage-320.png`, `montage-1280.png`, `montage-zoom-200.png`
- 대표 Detail: `catalog120-matrix-final/spatial-glass-ui-{desktop,mobile}.png`

320px montage와 1280px montage, 640 CSS px reflow montage를 직접 열어 native locale select, 검색, 보기 모드, utility control, 8 category, Discovery toolbar의 wrap과 잘림을 확인했다. 자동 Discovery 폭 행렬의 document overflow는 모두 0이다.

## 5. 최종 5축 리뷰

- Correctness: tuner·locale·URL·artifact가 단일 계약을 사용하며 120/5 locale 행렬과 machine key 불변성을 회귀로 고정했다.
- Readability: `src/tuner/`, `src/i18n/`, semantic theme geometry로 책임을 분리하고 기존 대형 component에는 필요한 snapshot/rehydrate 경계만 추가했다.
- Architecture: canonical ID와 localized display overlay, initial UI와 lazy pack, product processing과 headless audio 환경 제외를 분리했다.
- Security/resilience: URL allowlist/길이, stable key, 컨텍스트 escape, pack validation 후 atomic commit과 last-known-good 정책을 적용했다.
- Performance: framework dependency 없이 literal dynamic import를 사용했고 hard gzip·interaction·DOM 상한을 낮추지 않았다.

## 6. 남은 위험

1. 일본어·중국어 catalog의 전문 번역 품질은 자동 completeness와 별개이며 원어민/전문 감수를 거치지 않았다. 고유 디자인명은 국제적으로 쓰이는 영문명을 유지하는 경우가 있다.
2. 초기 JS/CSS budget 여유가 1B/6B이므로 사소한 초기 import나 copy 변경도 gate를 넘길 수 있다.
3. Crostini headless 실제 오디오 출력은 장치 부재로 미확정이다. 일반 Chrome 사용자 제스처 경로와 Node 상태/gain 계약은 유지된다.
4. 운영 CSP·Google Fonts response header는 실제 배포 응답을 이번 로컬 재감사에서 확인하지 않았다.

커밋·푸시·배포는 이번 사용자 요청 범위에 포함되지 않아 수행하지 않았다.
