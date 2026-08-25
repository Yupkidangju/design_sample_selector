# DESIGN SPECTRUM (Web Design Sample Selector)

> 24종 인터랙티브 웹 디자인 사조 아카이브, 라이브 썸네일, 선택 도크, 모션 샌드박스, 실시간 파라미터 튜너 및 Web Audio 절차적 사운드 신시사이저 플레이그라운드

---

## 🚀 빠른 시작 (Local Development)

### 1. 개발 서버 실행 (Vite)
```bash
# 의존성 설치 (최초 1회)
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:5173` 으로 접속합니다.

### 2. 프로덕션 빌드 & 미리보기
```bash
# 프로덕션 번들 빌드
npm run build

# 빌드 결과물 미리보기
npm run preview
```

---

## 🎨 주요 기능 (Key Features)

1. **8대 대분류 & 24종 세부 디자인 사조 아카이브**
   - 스위스 스타일, 브루탈리즘, 글래스모피즘, 뉴모피즘, Y2K 크롬, Frutiger Aero, 8-Bit 아케이드, Bento UI, 키네틱 타이포, 클레이모피즘, 솔라펑크 등
   - 분류별 배경 모티프와 서브스타일 고유 라이브 썸네일로 한눈에 구분
2. **선택 도크 · 호버 피크 · 확정**
   - 클릭으로 담고, 더블클릭/Enter로 자세히 보기, “이 스타일 확정”은 브라우저에 저장
   - 키보드: `/` 검색, 화살표 이동, Space 비교 슬롯
3. **3가지 갤러리 뷰 모드**
   - 표준 그리드 뷰 (Standard Grid)
   - 반응형 벤토 그리드 뷰 (Dynamic Bento Grid)
   - 연대기적 스펙트럼 스트림 뷰 (Spectrum Stream)
4. **실시간 인터랙티브 샌드박스**
   - 4종 컴포넌트 탭 (`Hero Landing`, `Dashboard Cards`, `Form & Inputs`, `Pricing Cards`)
   - 스타일별 애니메이션·토스트·컨트롤 상태 (alert 없음)
   - 뷰포트 전환 (데스크톱 / 모바일)
   - 실시간 CSS 파라미터 슬라이더 (`Radius`, `Border`, `Shadow`, `Blur`, `Glow`)
   - 실시간 CSS 코드 인스펙터 & 원클릭 클립보드 복사
5. **듀얼 스플릿 비교 모드**
   - 서로 다른 두 디자인 사조를 나란히 비교 분석
6. **16트랙 Web Audio API 절차적 배경음악 & 사운드 FX**
   - 무손실 웹 오디오 신시사이저를 통한 배경음악 및 인터랙션 효과음 실시간 합성
7. **WASM / HTML5 Canvas 반응형 파티클 비주얼라이저**
   - 오디오 주파수 및 마우스 인터랙션에 반응하는 배경 비주얼 엔진

---

## 📁 프로젝트 구조

```
├── index.html                  # 진입점 HTML
├── index.css                   # 디자인 시스템 및 24종 사조 토큰/스타일시트
├── src/styles/interactive.css  # 선택 도크, 피크, 썸네일, 목업 모션
├── package.json                # Vite 개발/빌드 스크립트 및 패키지 설정
├── src/
│   ├── main.js                 # 앱 초기화 및 부트스트랩
│   ├── state/appState.js       # 싱글톤 상태 관리자
│   ├── data/categories.js      # 8개 대분류 & 24종 사조 데이터
│   ├── audio/synthAudio.js     # Web Audio 16트랙 절차적 신시사이저
│   ├── wasm/visualEngine.js    # Canvas / WASM 파티클 배경 엔진
│   ├── components/             # UI 컴포넌트
│   └── utils/                  # 클립보드 등 유틸리티
├── spec.md                     # 시스템 마스터 사양서
├── designs.md                  # 아키텍처 및 디자인 명세
├── BUILD_GUIDE.md              # 빌드 및 실행 가이드
└── CHANGELOG.md                # 변경 이력
```
