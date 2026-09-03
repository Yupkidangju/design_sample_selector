# 코더 Handoff — Gemini 리팩터링 감사 보정

## 0. 목적과 판정

이 문서는 `docs/REFACTORING_AUDIT_REPORT_2026-09-03.md`의 finding을 수정하기 위한 실행 지시서다.

- 현재 판정: **REWORK REQUIRED / 배포 HOLD**
- 기준 커밋: `0fc6866a5fb5c8261a5c3bc82882ef0d71bc2079`
- 작업 대상: 현재 작업 폴더의 미커밋 Gemini 리팩터링 변경
- 목표: 현재 부분 visual refresh를 안전하고 문서와 일치하는 상태로 복구한다.
- 비목표: 필터 drawer, 무한/가상 스크롤, 120개 catalog 전면 재번역, 8×8 aesthetic matrix를 이번 보정에 새로 구현하지 않는다.
- release 정책: 아래 gate 통과 전에는 v2.4 출시 또는 배포를 주장하지 않는다.

### 작업 공간 경계

- 유일한 작업·쓰기·실행 경로: `/home/eunho1/Projects/web/design_sample_selector`
- 보호 대상·범위 외 경로: `/home/eunho1/Projects/web/design_sample_selector`
- 보호 대상 폴더에서는 파일 열람, 빌드, 테스트, Git 명령, 이동·삭제·수정을 수행하지 않는다.

## 1. 동결된 결정

1. **Canonical local project identity는 `design_sample_selector`다.**
   - project base: `/design_sample_selector/`
   - 예상 Pages URL: `https://yupkidangju.github.io/design_sample_selector/` (remote 생성 전 미확정)
   - 현재 `origin`은 보호 대상 원본 저장소를 가리키므로 배포 authority가 아니다.
2. **이번 보정에서는 기존 gallery interaction을 유지한다.**
   - card single click: draft/selection dock에 선택
   - explicit `상세 보기` CTA: detail 열기
   - card double-click: detail 열기
   - Enter: detail 열기
   - Space: compare slot에 추가
3. **Category aesthetic은 tuner보다 낮은 우선순위를 가진다.**
   - 사용자가 Radius/Border/Shadow 값을 바꾸면 `data-tweak-surface`가 실제로 반응해야 한다.
   - descendant-wide `!important` geometry override는 사용하지 않는다.
4. **현재 aesthetic 지원 범위는 4개 category의 Game/Media/Chat 중심 부분 개선으로 기록한다.**
5. **현재 i18n 변경 범위는 총 98개 locale-value 개선으로 기록한다.**
6. **package identity `design-sample-selector-2@2.4.0`은 유지하되, 보정과 전체 acceptance gate 전에는 완료된 정식 release로 주장하지 않는다.**

새 `_2` remote 생성·연결, commit, push, deploy는 별도의 명시적 사용자 승인 전에는 수행하지 않는다.

## 2. 수정 순서

각 단계가 독립적으로 검증 가능해야 한다. 여러 단계를 한 번에 덮어쓰지 않는다.

### Task 1 — `_2` identity 통일과 원본 보호

연결 finding: `DBG-F001`, `DBG-F002`, `XPF-F001`

수정 대상:

- `vite.config.js`
- `scripts/verifyPagesArtifact.js`
- `scripts/verifyPagesRecoveryChrome.js`
- `scripts/verifyWave1Chrome.js`
- `scripts/verifyCatalogDiscoveryChrome.js`
- `scripts/verifyCatalog120Chrome.js`
- `scripts/verifyRenderScalabilityChrome.js`
- `scripts/verifyI18nInspectorChrome.js`
- `tests/auditRemediation10.test.js`
- 필요 시 공용 project config 모듈

구현 지시:

1. Vite base와 root redirect의 `/design_sample_selector/` 값을 유지한다.
2. artifact verifier와 모든 Chrome QA가 같은 canonical base를 사용하게 한다.
3. `design_sample_selector(?:_2)?`처럼 두 값을 허용하는 테스트를 제거한다.
4. 가능하면 root-level `project.config.js` 같은 단일 모듈에 다음 값을 둔다.

```js
export const PROJECT_SLUG = 'design_sample_selector';
export const PROJECT_BASE = `/${PROJECT_SLUG}/`;
```

5. Vite config, Node verifier, Chrome QA는 이 값을 import한다. 브라우저 runtime에서 별도 값이 필요하면 Vite define을 통해 파생하고 중복 literal을 두지 않는다.
6. 대상 폴더 안의 README/spec/BUILD_GUIDE/workflow/QA를 `_2` identity로 이관한다. 보호 대상 원본 폴더는 절대 수정하지 않는다.
7. 현재 `origin`이 원본 저장소를 가리킨다는 안전 경고를 handoff/release checklist에 유지한다. 이 작업에서 remote 자체는 변경하지 않는다.

완료 조건:

- 대상 폴더의 spec, Vite, artifact, 6개 Chrome QA가 `/design_sample_selector/` 하나만 사용한다.
- old/new optional regex가 남지 않는다.
- clean Pages-like artifact에서 root와 모든 asset이 200이다.
- 보호 대상 원본 폴더와 remote에 쓰기 작업이 발생하지 않는다.

### Task 2 — package/version/document lifecycle 동기화

연결 finding: `DBG-F004`, `IMP-F004`

수정 대상:

- `package.json`
- `package-lock.json`
- `index.html`
- `src/components/header.js`
- `CHANGELOG.md`
- `docs/REFACTORING_IMPLEMENTATION_PLAN.md`

구현 지시:

1. 대상 프로젝트 package identity를 유지한다.

```json
{
  "name": "design-sample-selector-2",
  "version": "2.4.0"
}
```

2. lockfile root name/version이 package와 정확히 같아야 한다.
3. `v2.4 REFACTORED` 같은 완료형 표시는 acceptance gate 전에는 `PREVIEW` 또는 `보정 중` 상태로 바꾸고, 제품명 변경은 문서와 일치시킨다.
4. 계획서 상태를 다음처럼 갱신한다.
   - Status: `부분 구현 — 감사 보정 중`
   - Implemented: 핵심 UI 용어 일부, 4-category visual skin, explicit detail CTA 실험
   - Deferred: drawer, virtualization, 전체 catalog 재번역, full matrix aesthetic renderer
5. CHANGELOG의 신규 3개 `Added` 항목을 실제 범위에 맞는 하나의 `Changed` 항목으로 축소한다. 완료되지 않은 기능을 나열하지 않는다.
6. v2.4 정식 release 선언은 전체 gate 통과와 release owner 승인 후 별도 수행한다.

완료 조건:

- package와 lockfile은 `design-sample-selector-2@2.4.0`으로 일치하고 UI·문서는 `v2.4 preview/보정 중` 상태를 정확히 표시한다.
- “전면”, “완전”, “Phase 완료” 표현은 실제 증거가 있는 범위에만 남는다.

### Task 3 — 라이브 tuner CSS 계약 복구

연결 finding: `DBG-F003`

수정 대상:

- `src/styles/interactive.css`
- category CSS를 분리할 경우 신규 stylesheet와 import entry
- tuner 관련 browser regression test

구현 지시:

1. 다음 broad rule을 제거한다.

```css
.archetype-unit[data-category="swiss"] * {
  border-radius: 0 !important;
}
```

2. category surface의 기본 radius가 필요하면 tuner override를 먼저 소비한다.

```css
.archetype-unit[data-category="swiss"] [data-tweak-surface] {
  border-radius: var(--tweak-surface-radius, 0);
}
```

3. 기존 `[data-tweak-surface]`의 canonical rule을 중복 정의하지 않는 쪽을 우선한다. Swiss 기본 token이 이미 0px이면 별도 radius rule 자체를 두지 않는다.
4. Y2K chat bubble, Brutalism card/button 등 hardcoded `border-radius: ... !important`도 검사한다. 라이브 조절 대상 surface에서는 제거한다.
5. 장식 전용 원·pill처럼 tuner 대상이 아닌 요소만 고정 geometry를 허용한다.
6. border/shadow `!important`도 live tweak을 막는지 computed style로 확인한다.

필수 회귀 matrix:

| Category | Archetype | Radius inputs |
| --- | --- | --- |
| Swiss | Game, Media, Chat | 0, 16, 64 |
| Y2K | Game, Media, Chat | 0, 16, 64 |
| Brutalism | Game, Media, Chat | 0, 16, 64 |
| Hypertech | Game, Media, Chat | 0, 16, 64 |

완료 조건:

- 각 case에서 opt-in surface의 computed radius가 입력값과 일치한다.
- pill/circle 장식은 semantic geometry를 유지한다.
- `spec.md:269-271` 계약과 CSS가 일치한다.

### Task 4 — Gallery interaction과 카피 정렬

연결 finding: `IMP-F001`

수정 대상:

- `src/components/mainView.js`
- `src/i18n/copy.js`
- `src/styles/interactive.css`
- 관련 interaction tests

구현 지시:

1. 일반 card click의 `selectDraft()` 동작은 유지한다.
2. detail CTA 텍스트는 `선택 →`가 아니라 각 locale의 명시적인 `상세 보기` 의미를 사용한다.
3. CTA가 별도 동작이면 semantic `<button type="button">`으로 만든다.
4. Standard Grid에서는 `<button class="sub-tile">` 안에 또 다른 button을 넣지 않는다. detail CTA를 sibling control로 배치한다.
5. Bento/Spectrum CTA도 keyboard focus와 accessible name을 갖는 실제 button으로 만든다.
6. CTA handler는 `preventDefault()`와 `stopPropagation()`으로 card selection과 중복 실행되지 않게 한다.
7. gallery 안내 카피를 실제 계약으로 되돌린다.

권장 한국어 카피:

```text
클릭하면 하단에 담고, 상세 보기 버튼이나 더블클릭으로 자세히 봅니다. 화살표 이동 · Enter 열기 · Space 비교.
```

8. 같은 의미를 `ko/en/ja/zh-CN/zh-TW`에 적용하고 `dock.hint`, `peek.hint`, `gallery.tileHint`와 모순이 없게 한다.
9. hover compare/confirm은 이번 보정에서 추가하지 않는다. 계획서에서 Deferred로 표시한다.

필수 interaction matrix:

| 입력 | 기대 결과 |
| --- | --- |
| card click | draft dock 선택, Detail 미진입 |
| detail CTA click | Detail 진입, 중복 draft event 없음 |
| card double-click | Detail 진입 |
| focused card + Enter | Detail 진입 |
| focused card + Space | Compare slot 추가 |
| bookmark click | bookmark만 toggle |

완료 조건:

- 세 view mode에서 matrix가 동일하게 통과한다.
- CTA가 accessibility tree에서 이름 있는 button으로 노출된다.
- 모든 locale 안내가 같은 interaction을 설명한다.

### Task 5 — Aesthetic profile 구조 단순화

연결 finding: `DBG-F005`, `IMP-F003`

수정 대상:

- `src/components/archetypeTemplates.js`
- `src/styles/interactive.css`
- 가능하면 `src/styles/categoryArchetypes.css`
- `tests/previewIntegration.test.js`

구현 지시:

1. renderer마다 반복되는 `isSwiss`, `isY2K`, `isBrutal`, `isHyper` boolean을 제거한다.
2. category별 immutable profile을 한 곳에 정의한다.

```js
const AESTHETIC_PROFILES = Object.freeze({
  swiss: Object.freeze({
    game: Object.freeze({
      avatar: '✛',
      playerName: 'SYS_GRID_01',
      targetIcon: '🎯',
      noticeBadge: 'GRID SYSTEM 01',
      primaryMeter: 'ACC',
      secondaryMeter: 'SYNC',
      skills: Object.freeze(['✛', '■', '▲', '●'])
    }),
    mediaOverlay: 'swiss-tuner',
    chat: Object.freeze({ brandIcon: '📑', channel: 'swiss-log' })
  })
});
```

3. `getAestheticProfile(categoryId)`는 unknown category에 frozen default profile을 반환한다.
4. overlay markup은 `renderAestheticOverlay(profile.mediaOverlay)` 같은 작은 helper로 분리한다.
5. 새로운 범용 dispatcher layer를 과도하게 만들지 않는다. 현재 3개 renderer에서 반복되는 data만 제거한다.
6. category 전용 CSS 290줄은 별도 stylesheet로 분리해 `interactive.css`의 3,000줄 누적을 완화한다.
7. hash snapshot만 갱신하지 말고 category별 의미 assertion을 추가한다.

필수 테스트:

- unknown/default category가 기존 generic markup을 보존한다.
- 각 4개 category의 Game/Media/Chat 고유 marker가 정확하다.
- Mobile/E-commerce/Blog/Dashboard는 문서상 지원 범위 밖에서 불필요한 markup 분기를 만들지 않는다.
- 120×8 render matrix가 유효 HTML과 기존 보안 contract를 유지한다.

완료 조건:

- 동일 category conditional이 renderer 여러 곳에 반복되지 않는다.
- 지원 matrix가 문서와 테스트에 명시된다.
- CSS와 JS bundle이 예산 안에 남는다.

### Task 6 — i18n 범위와 문서 정합성 복구

연결 finding: `IMP-F002`

수정 대상:

- `src/i18n/copy.js`
- `src/i18n/locales/ja.js`
- `src/i18n/locales/zh-CN.js`
- `CHANGELOG.md`
- `docs/REFACTORING_IMPLEMENTATION_PLAN.md`

구현 지시:

1. 현재 변경한 98개 locale-value의 placeholder와 key parity를 유지한다.
2. interaction을 과장하는 `gallery.hint`, `gallery.tileHint`, `gallery.pick`은 Task 4의 동결 계약에 맞춘다.
3. catalog locale/editorial 전체 재감수 완료를 주장하지 않는다.
4. 다음 내용을 문서에 명시한다.
   - machine key 변경 없음
   - 변경 UI key 수와 locale별 개수
   - catalog content pack 변경 없음
   - 원어민 검토 미완료
5. 별도 승인 없이 catalog 9,620 field unit을 재작성하지 않는다.

완료 조건:

- 5개 locale key parity PASS
- placeholder parity PASS
- non-Korean 화면의 Korean leak 0
- i18n Chrome QA issue 0
- 문서가 실제 변경 key 수를 정확히 기록

### Task 7 — CSS hygiene와 motion 정리

연결 finding: `DBG-F006`, `DBG-F007`

수정 대상:

- category stylesheet
- bundle analysis evidence

구현 지시:

1. `cyberPulse`를 제거하거나 실제 keyframes를 정의한다.
2. animation을 유지하면 `prefers-reduced-motion: reduce`에서 비활성화한다.
3. `transition: all`은 실제 변화하는 property 목록으로 제한한다.
4. EOF 빈 줄과 formatting 문제를 정리한다.
5. 시각 변화마다 `!important`를 기본 해결책으로 사용하지 않는다.
6. 원본 대비 bundle 증감을 기록한다. “성능 개선” 표현은 측정 결과가 있을 때만 사용한다.

완료 조건:

- undefined animation 0
- reduced-motion 상태에서 신규 반복 animation 0
- `git diff --check` 출력 0
- 초기 JS gzip `< 90 kB`, CSS gzip `< 35 kB`

### Task 8 — 회귀 테스트와 최종 문서 동기화

연결 finding: 전체

추가 또는 강화할 테스트:

1. canonical `_2` project base exact equality
2. package/lockfile root name/version equality
3. Grid/Bento/Spectrum interaction matrix
4. semantic detail CTA와 accessible name
5. category × archetype marker matrix
6. category별 live radius computed-style matrix
7. undefined keyframe 또는 CSS hygiene 검사
8. locale 변경 key count와 placeholder parity

문서 동기화:

- `spec.md`: `_2` identity와 실제 계약을 동기화한다.
- `README.md`, `BUILD_GUIDE.md`: `_2` base를 사용하되 remote/production URL은 미확정으로 표시한다.
- `designs.md`: 실제 추가된 pill/CTA와 지원 matrix만 반영
- `implementation_summary.md`: renderer profile과 CSS 책임을 반영
- `DESIGN_DECISIONS.md`: category skin이 tuner보다 낮은 우선순위를 갖는 이유 기록
- `CHANGELOG.md`: 실제 partial change만 기록
- `docs/REFACTORING_IMPLEMENTATION_PLAN.md`: 구현/Deferred 상태 갱신

## 3. 필수 검증 명령

아래 순서대로 실행하고 결과를 handoff 또는 재감사 evidence에 기록한다.

```bash
git diff --check
npm ci
npm test
npm run build
npm run analyze:bundle
npm run qa:wave1:chrome
npm run qa:discovery:chrome
npm run qa:catalog120:chrome
npm run qa:pages:chrome
npm run qa:i18n:chrome
npm run qa:scalability:chrome
```

환경 문제로 `npm test`가 실패하면 단순 waiver하지 않는다.

1. 실패 파일을 직접 실행해 assertion을 확인한다.
2. 대상 폴더의 기준 커밋에서 같은 환경 증상인지 대조한다. 보호 대상 로컬 폴더는 사용하지 않는다.
3. 정상 CI에서 `284/284` PASS evidence를 확보한다.
4. 실패 원인과 환경 제약을 재감사 문서에 기록한다.

## 4. 수동 브라우저 검증

다음 화면을 대상 폴더의 기준 커밋과 변경본으로 같은 viewport에서 촬영한다. 기준본은 `/tmp`에 별도 구성하며 보호 대상 로컬 폴더를 사용하지 않는다.

| Viewport | 상태 |
| --- | --- |
| 320×900 | Grid, Detail, filter expanded |
| 375×900 | Grid, Bento, Detail |
| 768×1024 | Grid, Spectrum, Detail |
| 1440×1100 | Grid, Bento, Spectrum, 4-category Detail |
| CSS 640px / DPR 2 | 200% zoom reflow |

수동 확인 항목:

- text 또는 CTA overflow 없음
- detail CTA가 card selection과 중복 실행되지 않음
- keyboard focus indicator가 보임
- Swiss/Y2K/Brutalism/Hypertech의 차이가 Game/Media/Chat에서 확인됨
- radius tuner 0/16/64px가 즉시 반영됨
- reduced-motion에서 신규 반복 animation 없음
- console error/warning 0
- same-origin asset 404 없음

## 5. 금지 사항

- `/home/eunho1/Projects/web/design_sample_selector`에서 읽기·쓰기·빌드·테스트·Git 명령을 실행하지 않는다.
- `_2` base를 원본 slug로 되돌리지 않는다.
- test regex가 old/new base를 동시에 허용하게 하지 않는다.
- hash snapshot만 새 값으로 교체해 의미 회귀를 숨기지 않는다.
- tuner 대상에 broad descendant selector와 geometry `!important`를 추가하지 않는다.
- 미구현 기능을 CHANGELOG의 완료형 문장으로 기록하지 않는다.
- 이번 보정에서 drawer, virtualization, 전체 catalog 재번역을 함께 밀어 넣지 않는다.
- 사용자 승인 없이 commit, push, tag, release, deploy를 수행하지 않는다.
- 사용자 승인 없이 Git remote를 변경하거나 보호 대상 원본 remote에 쓰지 않는다.

## 6. 재감사 제출물

코더는 수정 후 다음을 제출한다.

1. finding별 수정 파일 표
2. `IMP-F001`~`IMP-F004`, `DBG-F001`~`DBG-F007`, `XPF-F001`~`XPF-F002` 해소 매핑
3. 전체 명령의 exit code와 핵심 수치
4. bundle before/after
5. browser QA report 경로와 issue 수
6. 대상 기준 커밋/변경본 스크린샷 목록
7. 남은 위험과 명시적으로 Deferred한 항목
8. `git diff --stat` 및 `git diff --check` 결과

## 7. 완료 정의

다음 조건을 모두 만족해야 이번 handoff가 완료된다.

- Critical finding 0
- Major finding 0 또는 사용자 승인과 만료 조건이 있는 Accepted Risk
- canonical `_2` project base 단일화
- package/lock/docs/UI lifecycle 일치
- tuner contract 복구
- interaction과 5-locale 카피 일치
- Node `284/284` PASS
- build 및 6개 Chrome QA issue 0
- JS/CSS bundle budget 통과
- `git diff --check` clean
- 감사자가 원 finding ID로 재감사 완료

완료 전 판정은 계속 **REWORK REQUIRED / 배포 HOLD**다.
