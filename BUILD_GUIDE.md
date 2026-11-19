# DESIGN SPECTRUM 3.0 — 빌드 및 배포 가이드 (`BUILD_GUIDE.md`)

> **기준 버전:** 3.0.0
> **최종 갱신:** 2026-11-19

---

## 1. 요구 환경

- **Node.js:** `^20.0.0 || >=22.0.0`
- **패키지 매니저:** `npm`
- **시각 QA 브라우저:** Google Chrome (`/usr/bin/google-chrome` 또는 `DSS_CHROME_PATH`)

---

## 2. 로컬 개발 및 검증 명령

```bash
# 의존성 설치
npm ci

# 개발 서버 실행 (http://localhost:5173/design_sample_selector/)
npm run dev

# 전체 정적·단위·빌드·Pages 산출물 검증
npm run check

# 프로덕션 빌드(dist/) 프리뷰 대상 Headless Chrome 전수 QA
npm run qa:visual

# 로컬 프로덕션 미리보기
npm run preview
```

---

## 3. 멀티페이지 프로덕션 빌드 구조

`vite.config.js`는 `PROJECT_BASE` (`/design_sample_selector/`) 하위에 두 개의 완전히 격리된 HTML 엔트리를 빌드한다.

- `dist/index.html` — 중립 다크 스튜디오 메인 갤러리 (`gallery.css` + `styles-20.css`)
- `dist/showcase.html` — 독립 새 탭 풀스크린 쇼케이스 (`showcase-base.css` + `showcase-domains.css` + `styles-20.css`)
- `dist/.vite/manifest.json` — `scripts/verifyPagesArtifact.js`가 참조하는 빌드 매니페스트

---

## 4. GitHub Pages 배포 파이프라인

`.github/workflows/deploy-pages.yml`은 `gemini_ux_enhanced` 브랜치 푸시 시 다음 순서로 게이트를 통과한 `dist/` 산출물만 배포한다.

1. `npm ci`
2. `npm run check` (`validate:styles` → `node --test` → `vite build` → `verify:pages-artifact`)
3. `npm run qa:visual` (프로덕션 `vite preview` 기반 20종 × 4도메인, `360px` 모바일, 스펙 서랍/토스트/단축키/SVG 검증)
4. `npm audit --omit=dev --audit-level=high`
5. `actions/upload-pages-artifact` + `actions/deploy-pages`
