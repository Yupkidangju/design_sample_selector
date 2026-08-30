import { defineExpansionPack, expansionBlueprint as b } from './authoring.js';

export const DATA_SPATIAL_PACK = defineExpansionPack({
  id: 'data-spatial',
  order: 70,
  startOrder: 970,
  title: { ko: '데이터 스페이셜 12종', en: 'Data Spatial 12' },
  blueprints: [
    b('tech-optimism-2000', 'y2k', 'terminal-hud', '2000년대 테크 옵티미즘', '2000s Tech Optimism', '푸른 디지털 지도·연결 노드·긍정적인 시스템 문구로 네트워크 미래를 그리는 화면', ['#081528', '#102743', '#1B3D61', '#34D5E8', '#8FE35F'], '지구 곡선 위를 잇는 연결 노드와 ONLINE 상태 띠', ['테크 낙관', '네트워크']),
    b('cyberpunk-tactical-hud', 'hypertech', 'terminal-hud', '사이버펑크 HUD', 'Cyberpunk HUD', '좌표·경계선·경고 신호를 고대비 청록과 적색으로 묶은 실시간 전술 인터페이스', ['#060B0E', '#0E171B', '#1C292E', '#00E5C7', '#FF4655'], '사각 조준 프레임과 가장자리의 거리·위험 수치', ['HUD', '사이버펑크']),
    b('sci-fi-fui', 'hypertech', 'terminal-hud', '사이파이 FUI', 'Sci-fi FUI', '원형 다이얼·분절 눈금·가상 장치 상태를 영화적이되 읽기 가능한 패널로 구성한 화면', ['#071019', '#0E1E2A', '#193445', '#46C6FF', '#FFB347'], '분절된 원형 스캐너와 세 개의 장치 진단 레일', ['FUI', '스캐너']),
    b('terminal-matrix', 'hypertech', 'terminal-hud', '터미널 매트릭스', 'Terminal Matrix', '명령 프롬프트·행렬형 로그·단일 녹색 신호로 계산 흐름을 전면화한 도구형 디자인', ['#050A07', '#0B1510', '#15251B', '#5CFF79', '#F4D35E'], '열 정렬된 로그와 현재 명령을 나타내는 고정 caret', ['터미널', '로그']),

    b('data-dense-dashboard', 'hypertech', 'data-stream', '데이터 덴스 대시보드', 'Data-dense Dashboard', '여러 KPI·추세·세그먼트를 고정 모듈에 배치해 한눈에 비교하게 하는 운영 화면', ['#0B1220', '#151F31', '#26354B', '#4CC9F0', '#F59E0B'], '세 크기의 수치 카드와 직접 레이블이 붙은 미니 차트', ['대시보드', 'KPI']),
    b('real-time-monitor', 'hypertech', 'data-stream', '리얼타임 모니터', 'Real-time Monitor', '초 단위 상태·이상 이벤트·서비스 건강도를 차분한 흐름으로 관찰하는 모니터링 UI', ['#08131A', '#10242D', '#1B3944', '#2DD4BF', '#FB7185'], '실시간 심박선과 심각도별 사건 큐, 마지막 갱신 시각', ['모니터링', '실시간']),
    b('chromatic-aberration', 'hypertech', 'data-stream', '색수차 RGB 스플릿', 'Chromatic Aberration', '핵심 경계에만 RGB 분리 효과를 사용해 디지털 오차와 속도를 표현한 데이터 화면', ['#0B0D18', '#171A2A', '#292D43', '#33D6FF', '#FF3E91'], '겹쳐진 RGB 좌표축과 단색 본문 데이터 패널', ['RGB', '색수차']),
    b('generative-grid', 'hypertech', 'data-stream', '제너러티브 그리드', 'Generative Grid', '규칙 기반 점·선·셀의 변화를 정보 모듈과 연결해 살아 있는 시스템처럼 보이는 화면', ['#09131F', '#132238', '#213754', '#64E572', '#F4C95D'], '밀도가 달라지는 격자장과 선택 셀의 설명 패널', ['제너러티브', '그리드']),

    b('biometric-interface', 'hypertech', 'spatial-orbit', '바이오메트릭 인터페이스', 'Biometric Interface', '생체 신호의 중심 링과 주변 측정값을 공간적으로 배치한 차분한 분석 화면', ['#07131A', '#102630', '#1C3D49', '#35E3C1', '#6CA8FF'], '호흡하는 중심 링과 심박·산소·회복 궤도 카드', ['바이오메트릭', '건강']),
    b('spatial-glass-ui', 'hypertech', 'spatial-orbit', '스페이셜 글래스 UI', 'Spatial Glass UI', '고정된 초점면과 반투명 주변 도구로 깊이 속에서도 길을 잃지 않게 하는 공간형 UI', ['#08101D', '#121F31', '#213650', '#79D7FF', '#A78BFA'], '중앙 콘텐츠 창 주위를 도는 세 개의 반투명 제어판', ['스페이셜', '글래스']),
    b('ai-native-gradient', 'hypertech', 'spatial-orbit', 'AI 네이티브 그라디언트', 'AI-native Gradient', '생성 상태와 제안의 확률을 부드러운 색장과 명료한 텍스트 패널로 분리한 AI 도구 화면', ['#0D1022', '#191C35', '#2B3050', '#8B7CFF', '#38D9C5'], '확률 구름을 닮은 중심 장과 근거·승인 버튼의 고정 레일', ['AI 도구', '색장']),
    b('quantum-control', 'hypertech', 'spatial-orbit', '퀀텀 컨트롤', 'Quantum Control', '상태 중첩을 암시하는 궤도와 정밀 제어점을 결합한 사변적 과학 인터페이스', ['#080C1B', '#121A32', '#222D4F', '#58E0FF', '#FF74C8'], '세 겹의 상태 궤도와 측정 순간을 표시하는 고정 노드', ['퀀텀', '컨트롤'])
  ]
});

export const DATA_SPATIAL_STYLES = DATA_SPATIAL_PACK.styles;
export const DATA_SPATIAL_BLUEPRINTS = DATA_SPATIAL_PACK.blueprints;
export const DATA_SPATIAL_MANIFEST = DATA_SPATIAL_PACK.manifest;
