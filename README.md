# DESIGN SPECTRUM (Web Design Sample Selector) v2.2.2

> 24종 인터랙티브 웹 디자인 사조 아카이브, 8대 코어 화면 아키타입, Universal 상단 디자인 선택 바, Zero-Rebuild 동적 테마 주입, 키네틱 시뮬레이터, 실시간 파라미터 튜너 및 Web Audio 절차적 사운드 신시사이저 플레이그라운드

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
2. **8대 코어 화면 아키타입 (Core Page Archetypes)**
   - 🎮 **게임 (Game HUD)**: 몬스터 타겟 터치 배틀, 체력/마나 게이지, Q/W/E/R 스킬 쿨다운, 콤보 승수, 레벨업 파티클
   - 🌐 **웹 (Web SaaS)**: 히어로 랜딩, 대시보드 위젯, 폼 컨트롤, 가격표 4대 컴포넌트 통합
   - 📱 **모바일 (Mobile App)**: 모바일 베젤, 상단 상태바, 알림 카드 스와이프, 피드 좋아요, 하단 4탭
   - 🛍️ **쇼핑몰 (E-Commerce)**: 컬러/사이즈 옵션 선택, 수량 조절 Stepper, 장바구니 담기, 슬라이드아웃 드로어, 주문/결제 모달 시뮬레이션
   - 📰 **블로그 (Blog & Post)**: 스크롤 읽기 진척도, 목차, 박수 카운터, 실시간 댓글 작성 및 등록, 다크/라이트 읽기 모드
   - 📊 **대시보드 (Analytics)**: 기간 필터(1D/1W/1M/1Y), KPI 카드 수치 애니메이션, 데이터 테이블 정렬/필터
   - 🎵 **미디어 (Media Player)**: 비닐 회전, 트랙 프로그레스 스크러버, 볼륨 슬라이더, 스펙트럼, 플레이리스트 큐
   - 💬 **채팅 (Messenger & DM)**: 채널 사이드바, 실시간 메시지 버블 스트림, 이모지 리액션, AI 자동 응답 시뮬레이션
3. **Universal 상단 디자인 선택 바 (Top Quick Style Selector)**
   - 상세 모달 상단에서 8대 대분류 탭과 24개 서브스타일 칩을 통해 창이 열린 상태에서 즉시 24개 디자인 전환
   - Zero-Rebuild 동적 테마 주입: DOM 파괴 없이 `[data-theme]` 토큰만 원자적으로 교체하여 장바구니/게임 스코어 등 상태 유지
   - 단축키: `[` / `]` (전체 24개 스타일 순환), `Shift + Left/Right` (8대 대분류 점프), `Esc` (닫기)
4. **선택 도크 · 호버 피크 · 확정**
   - 클릭으로 담고, 더블클릭/Enter로 자세히 보기, “이 스타일 확정”은 브라우저에 저장
   - 키보드: `/` 검색, 화살표 이동, Space 비교 슬롯
5. **3가지 갤러리 뷰 모드**
   - 표준 그리드 뷰 (Standard Grid)
   - 반응형 벤토 그리드 뷰 (Dynamic Bento Grid)
   - 연대기적 스펙트럼 스트림 뷰 (Spectrum Stream)
6. **실시간 파라미터 튜너 & CSS 인스펙터**
   - 실시간 CSS 파라미터 슬라이더 (`Radius` 0–64, `Border` 0–12, `Shadow` 0–30, `Blur` 0–32, `Glow` 0–2.0)
   - 실시간 CSS/HTML 코드 인스펙터 & 원클릭 클립보드 복사
7. **듀얼 스플릿 비교 모드**
   - 서로 다른 두 디자인 사조를 나란히 비교 분석 (동기화된 아키타입 전환 및 ESC 지원)
8. **16트랙 Web Audio API 절차적 BGM & 14종 사운드 FX**
   - 무손실 웹 오디오 신시사이저를 통한 배경음악 및 `THEME_SWAP`, `COIN`, `CART_ADD`, `SUCCESS`, `LIKE`, `SWIPE` 등 효과음 실시간 합성 (노드 자동 연결 해제)
9. **Canvas 2D 반응형 파티클 비주얼라이저**
   - JavaScript Canvas 2D 파티클(WebAssembly 모듈 없음). 모션 감축(`prefers-reduced-motion`) 및 모달 오픈 시 렌더링 일시정지


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
│   ├── wasm/visualEngine.js    # Canvas 2D 파티클 배경 엔진 (경로명 유지, WASM 아님)
│   ├── components/             # UI 컴포넌트
│   └── utils/                  # 클립보드 등 유틸리티
├── spec.md                     # 시스템 마스터 사양서
├── designs.md                  # 아키텍처 및 디자인 명세
├── BUILD_GUIDE.md              # 빌드 및 실행 가이드
└── CHANGELOG.md                # 변경 이력
```
