/**
 * 4대 도메인 · 플로팅 HUD · 스펙 서랍 · 인터랙션용 KO/EN UI 카피 사전
 * (정규식 치환 없이 명시적 키 기반으로 한국어/영어 쇼케이스를 완전 전환한다.)
 */

export const UI_COPY = Object.freeze({
  ko: Object.freeze({
    hud: {
      gallery: '← 갤러리',
      galleryAria: '메인 갤러리로 이동',
      prevStyle: '이전 스타일',
      nextStyle: '다음 스타일',
      styleSelectAria: '디자인 스타일 선택',
      domainsAria: '적용 도메인 전환',
      langAria: '쇼케이스 및 AI 프롬프트 언어 전환',
      copyPrompt: 'AI 프롬프트 복사 (KO)',
      specGuide: '스펙 가이드',
      collapse: '플로팅 바 접기 (화면 100% 감상)',
      openStudio: '스튜디오 열기',
      domains: { web: '웹', mobile: '모바일', game: '게임', dashboard: '대시보드' }
    },
    drawer: {
      closeAria: '스펙 서랍 닫기',
      dnaTitle: '시각 DNA 요약',
      paletteTitle: '컬러 팔레트',
      paletteHint: '(클릭 시 코드 복사)',
      typographyTitle: '타이포그래피',
      guardrailsTitle: 'AI 바이브 코딩 가드레일 (DO / DON\'T)',
      promptTitle: 'AI 프롬프트',
      cssTitle: 'CSS 변수 토큰',
      copy: '복사',
      copyCss: 'CSS 복사',
      copyPromptBtn: 'AI 프롬프트 복사',
      downloadMd: 'designs.md 다운로드',
      langSwitchToast: '한국어(KO) 쇼케이스 · AI 프롬프트 모드로 전환했습니다'
    },
    web: {
      principlesHeading: name => `${name} 핵심 조형 규칙`,
      formTitle: '실제 입력 & 액션 컴포넌트',
      projectLabel: '프로젝트 이름',
      projectSuffix: '리뉴얼',
      platformLabel: '타겟 플랫폼',
      platforms: ['웹 애플리케이션', '모바일 iOS / Android', '게임 UI / HUD'],
      densityLabel: '밀도 프리셋',
      densities: ['표준 균형', '에디토리얼 여유', '프로페셔널 고밀도'],
      submitBtn: '설계 시안 적용 테스트',
      formHint: '폼 입력과 칩 토글을 직접 클릭해 보세요.',
      formDone: name => `"${name}" 시안 설정이 성공적으로 적용되었습니다.`,
      formToast: name => `"${name}" 폼 제출 테스트 완료`,
      paletteTitle: '컬러 위계 & 서체 표본',
      typeSample: 'Aa 가나다',
      clickHexTitle: hex => `클릭하여 ${hex} 복사`,
      navToast: label => `"${label}" 섹션 포커스`,
      ctaToast: label => `"${label}" 인터랙션 확인됨`,
      hexToast: hex => `색상 코드 ${hex} 복사됨`
    },
    mobile: {
      stageTitle: name => `${name} — 모바일 앱 적용`,
      viewModes: { both: '듀얼 보기', primary: '홈 화면', detail: '제어 시트' },
      activityHeading: '주요 활동',
      itemCount: n => `${n}건`,
      tabs: ['홈', '탐색', '활동', '프로필'],
      intensity: '활성 강도',
      presets: ['절전 42%', '균형 78%', '최대 100%'],
      applyBtn: '설정 즉시 적용',
      applyToastLabel: app => `${app} 설정 저장`
    },
    game: {
      clickHint: '클릭하여 직접 타격 · 스킬 [Q W E R] 사용',
      sideTitle: name => `${name} 게임 UI 문법`,
      resetBtn: '보스 / 에너지 리셋',
      freeCost: '무료',
      directHit: '직접 타격',
      lowMp: (cost, mp) => `에너지가 부족합니다 (필요 ${cost}, 현재 ${mp}). 기본 타격이나 [Q]로 충전하세요!`,
      waveClear: (cleared, next) => `WAVE ${cleared} 격파! 보너스 +5,000점 — 강화된 WAVE ${next} 개시!`,
      hitLog: (skill, dmg, crit, combo) => `${skill} 적중! ${dmg} 데미지${crit ? ' (치명타!)' : ''} · ${combo}연속 콤보`
    },
    dashboard: {
      nav: ['실시간 개요', '성능 텔레메트리', '디자인 토큰 현황', '배포 알림 로그'],
      ranges: { '7d': '7일', '30d': '30일', '90d': '90일' },
      rangeLabel: { '7d': '최근 7일 기준', '30d': '최근 30일 기준', '90d': '최근 90일 기준' },
      days: {
        '7d': ['월', '화', '수', '목', '금', '토', '일'],
        '30d': ['1주', '5일', '10일', '15일', '20일', '25일', '30일'],
        '90d': ['1월', '2월', '3월', '4월', '5월', '6월', '현재']
      },
      barLabels: ['웹', '모바일', '게임', 'API', 'SDK', '에셋'],
      donutLabels: ['웹', '모바일', '게임·기타'],
      trendTitle: '핵심 지표 추이',
      barTitle: '채널별 활성 지수',
      barSub: '6개 핵심 모듈 비교',
      donutTitle: '플랫폼 비중',
      donutSub: '도넛 분포',
      tableTitle: '서비스 노드 상태',
      tableSub: '4개 리전 정상 동기화',
      cols: ['ID', '모듈', '리전', '응답', '상태'],
      rows: name => [
        { id: 'OPS-01', module: `${name} 핵심 엔진`, region: 'ap-northeast-2', latency: '14ms', status: '정상 가동' },
        { id: 'OPS-02', module: '토큰 동기화 파이프라인', region: 'us-west-1', latency: '21ms', status: '동기화됨' },
        { id: 'OPS-03', module: '실시간 프리뷰 렌더러', region: 'eu-central-1', latency: '18ms', status: '최적화' },
        { id: 'OPS-04', module: 'AI 프롬프트 컴파일러', region: 'ap-northeast-1', latency: '9ms', status: '정상 가동' }
      ]
    }
  }),

  en: Object.freeze({
    hud: {
      gallery: '← Gallery',
      galleryAria: 'Back to main gallery',
      prevStyle: 'Previous style',
      nextStyle: 'Next style',
      styleSelectAria: 'Select design style',
      domainsAria: 'Switch application domain',
      langAria: 'Switch showcase and AI prompt language',
      copyPrompt: 'Copy AI Prompt (EN)',
      specGuide: 'Spec Guide',
      collapse: 'Collapse floating bar (100% pure canvas)',
      openStudio: 'Open Studio',
      domains: { web: 'Web', mobile: 'Mobile', game: 'Game', dashboard: 'Dashboard' }
    },
    drawer: {
      closeAria: 'Close spec drawer',
      dnaTitle: 'Visual DNA Summary',
      paletteTitle: 'Color Palette',
      paletteHint: '(Click to copy hex)',
      typographyTitle: 'Typography',
      guardrailsTitle: 'AI Vibe-Coding Guardrails (DO / DON\'T)',
      promptTitle: 'AI Prompt',
      cssTitle: 'CSS Variable Tokens',
      copy: 'Copy',
      copyCss: 'Copy CSS',
      copyPromptBtn: 'Copy AI Prompt',
      downloadMd: 'Download designs.md',
      langSwitchToast: 'Switched to English (EN) showcase & AI prompt'
    },
    web: {
      principlesHeading: name => `${name} Core Principles`,
      formTitle: 'Live Input & Action Components',
      projectLabel: 'Project Name',
      projectSuffix: 'Redesign',
      platformLabel: 'Target Platform',
      platforms: ['Web Application', 'Mobile iOS / Android', 'Game UI / HUD'],
      densityLabel: 'Density Preset',
      densities: ['Balanced Default', 'Editorial Airy', 'Compact Pro'],
      submitBtn: 'Test Spec Preview',
      formHint: 'Interact with inputs, selects, and chips directly.',
      formDone: name => `Applied live spec preset for "${name}".`,
      formToast: name => `Submitted form test for "${name}"`,
      paletteTitle: 'Color Hierarchy & Type Specimen',
      typeSample: 'Aa Bb Cc',
      clickHexTitle: hex => `Click to copy ${hex}`,
      navToast: label => `Focused "${label}" section`,
      ctaToast: label => `Triggered "${label}" interaction`,
      hexToast: hex => `Copied color ${hex}`
    },
    mobile: {
      stageTitle: name => `${name} — Mobile App Showcase`,
      viewModes: { both: 'Dual View', primary: 'Home', detail: 'Controls' },
      activityHeading: 'Recent Activity',
      itemCount: n => `${n} items`,
      tabs: ['Home', 'Explore', 'Activity', 'Profile'],
      intensity: 'Active Intensity',
      presets: ['Eco 42%', 'Balanced 78%', 'Max 100%'],
      applyBtn: 'Apply Settings Now',
      applyToastLabel: app => `${app} settings saved`
    },
    game: {
      clickHint: 'Click stage to strike · Skills [Q W E R]',
      sideTitle: name => `${name} Game HUD Grammar`,
      resetBtn: 'Reset Boss / Energy',
      freeCost: 'FREE',
      directHit: 'Direct Strike',
      lowMp: (cost, mp) => `Not enough energy (need ${cost}, have ${mp}). Strike directly or use [Q]!`,
      waveClear: (cleared, next) => `WAVE ${cleared} CLEARED! +5,000 bonus — WAVE ${next} engaged!`,
      hitLog: (skill, dmg, crit, combo) => `${skill} hit for ${dmg} DMG${crit ? ' (CRIT!)' : ''} · ${combo}x COMBO`
    },
    dashboard: {
      nav: ['Live Overview', 'Telemetry', 'Design Tokens', 'Deploy Logs'],
      ranges: { '7d': '7D', '30d': '30D', '90d': '90D' },
      rangeLabel: { '7d': 'Last 7 days', '30d': 'Last 30 days', '90d': 'Last 90 days' },
      days: {
        '7d': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        '30d': ['W1', 'D5', 'D10', 'D15', 'D20', 'D25', 'D30'],
        '90d': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Now']
      },
      barLabels: ['Web', 'Mobile', 'Game', 'API', 'SDK', 'Assets'],
      donutLabels: ['Web', 'Mobile', 'Game & Ops'],
      trendTitle: 'Core Metric Trend',
      barTitle: 'Channel Activity Index',
      barSub: '6 core modules compared',
      donutTitle: 'Platform Share',
      donutSub: 'Donut breakdown',
      tableTitle: 'Service Node Status',
      tableSub: '4 regions synchronized',
      cols: ['ID', 'Module', 'Region', 'Latency', 'Status'],
      rows: name => [
        { id: 'OPS-01', module: `${name} Core Engine`, region: 'ap-northeast-2', latency: '14ms', status: 'Healthy' },
        { id: 'OPS-02', module: 'Token Sync Pipeline', region: 'us-west-1', latency: '21ms', status: 'Synced' },
        { id: 'OPS-03', module: 'Live Preview Renderer', region: 'eu-central-1', latency: '18ms', status: 'Optimal' },
        { id: 'OPS-04', module: 'AI Prompt Compiler', region: 'ap-northeast-1', latency: '9ms', status: 'Healthy' }
      ]
    }
  })
});
