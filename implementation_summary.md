# DESIGN SPECTRUM 3.0 — 구현 요약서 (`implementation_summary.md`)

> **기준 버전:** 3.0.0
> **최종 갱신:** 2026-11-19
> **이전 v2.x 아카이브 문서:** `docs/archive/v2/`

---

## 1. 아키텍처 개요

DESIGN SPECTRUM 3.0은 AI 바이브 코딩 참조 목적에 특화된 클라이언트 전용 Vite 6 멀티페이지 정적 웹앱이다.

| 영역 | 주요 파일 | 역할 |
|---|---|---|
| 데이터 카탈로그 | `src/data/domains.js`, `src/data/styles20.js`, `src/data/styles20-modern.js`, `src/data/styles20-editorial.js`, `src/data/styles20-playful.js` | 중복 없는 20종 사조(7+6+7), 전용 서체(`displayName`/`bodyName`/`monoName`), 5색 팔레트(`role`/`roleEn`), WCAG AA 검증 토큰(`--accent-text` 포함), DO/DON'T AI 가드레일 |
| 메인 갤러리 | `index.html`, `src/gallery/galleryApp.js`, `src/gallery/specimenCard.js`, `src/styles/gallery.css` | 중립 다크 스튜디오, WAI-ARIA 정합 그룹/즐겨찾기 필터, 포커스 보존, 20종 대형 라이브 표본 카드 + 1클릭 새 탭 오픈 |
| 독립 쇼케이스 | `showcase.html`, `src/showcase/showcaseApp.js`, `src/showcase/floatingHud.js`, `src/styles/showcase-base.css`, `src/styles/showcase-domains.css`, `src/styles/styles-20.css` | 갤러리 CSS와 100% 격리된 풀스크린 쇼케이스, 접이식 1줄 플로팅 바, 네이티브 `<dialog>` Top-Layer 스펙 서랍 |
| 4대 도메인 & 아트워크 | `src/showcase/domainWeb.js`, `domainMobile.js`, `domainGame.js`, `domainDashboard.js`, `domainArtwork.js`, `showcaseInteractions.js` | 웹 풀페이지, 모바일 듀얼 스크린, 장르 맞춤형 게임 HUD, 영역·막대·도넛 3종 SVG 차트 대시보드, 20종 커스텀 SVG 아트워크 |
| AI 프롬프트 & 유틸 | `src/prompt/vibePromptGenerator.js`, `src/utils/clipboard.js`, `bookmarks.js`, `escape.js` | KO/EN AI 바이브 코딩 프롬프트(영문 한글 0%), CSS 토큰, `designs.md` 다운로드, Popover API Top-Layer 토스트 및 클립보드 폴백 |
| 품질·배포 게이트 | `scripts/validateStyles.js`, `scripts/verifyPagesArtifact.js`, `scripts/verifyVisualChrome.js`, `tests/*.test.js`, `.github/workflows/deploy-pages.yml` | WCAG AA 4.5:1 명암비·키셋 일관성·오디오 부재·CSS 격리·프로덕션 Chrome 80상태 자동 검증 |

---

## 2. v2.x에서 의도적으로 제거된 항목

- 모든 Web Audio / BGM / SFX 기능 (`synthAudio`, `audioWidget`, `compactAudioControls`)
- 84종 양산형 확장 팩 및 120종 카탈로그 구조
- `localizeMarkup.js` 정규식 프리뷰 치환기 및 일/중 UI 번역
- Soft UI 메인 테마, 하단 선택 독, 실시간 슬라이더 튜너, 10축 패싯 필터, 모달 스플릿 비교, 배경 Canvas 애니메이션, 나머지 4개 아키타입
