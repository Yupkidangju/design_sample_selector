import { defineExpansionPack, expansionBlueprint as b } from './authoring.js';

export const RAW_MATERIALS_PACK = defineExpansionPack({
  id: 'raw-materials',
  order: 30,
  startOrder: 490,
  title: { ko: '로 머티리얼 12종', en: 'Raw Materials 12' },
  blueprints: [
    b('grunge-typography', 'brutalism', 'distressed-stack', '그런지 타이포그래피', 'Grunge Typography', '마모된 대문자와 잉크 번짐을 겹쳐 음악 포스터 같은 거친 밀도를 만드는 디자인', ['#171310', '#241E1A', '#3A312B', '#E8502E', '#D6B743'], '긁힌 제목 획과 낡은 공연 티켓의 수직 스택', ['그런지', '음악']),
    b('industrial-stencil', 'brutalism', 'distressed-stack', '인더스트리얼 스텐실', 'Industrial Stencil', '창고 표식·위험 띠·스텐실 숫자로 거친 작업 현장의 규율을 옮긴 인터페이스', ['#121516', '#24292A', '#384043', '#F2B705', '#D9432F'], '절단된 숫자와 사선 위험 띠가 가르는 작업 패널', ['산업', '스텐실']),
    b('monochrome-xerox', 'brutalism', 'distressed-stack', '모노크롬 제록스', 'Monochrome Xerox', '복사기의 과노출·거친 망점·검은 테이프로 DIY 출판물의 직접성을 만드는 화면', ['#111111', '#202020', '#383838', '#F1F1E8', '#A8A8A0'], '고대비 복사 면과 테이프로 고정한 메모 조각', ['제록스', 'DIY']),
    b('glitch-brutalism', 'brutalism', 'distressed-stack', '글리치 브루탈리즘', 'Glitch Brutalism', '단단한 검정 프레임 위 RGB 어긋남과 끊긴 스캔 라인을 제한적으로 겹치는 웹 스타일', ['#0D1014', '#171C23', '#2A313B', '#00F0FF', '#FF2B6A'], '세 줄로 분리된 제목 채널과 끊어진 시스템 상태 막대', ['글리치', '하드 UI']),

    b('maximalist-chaos', 'brutalism', 'fractured-panels', '맥시멀리스트 카오스', 'Maximalist Chaos', '서로 다른 패널·배지·타이포를 화면 끝까지 밀어붙이되 행동 경로는 굵게 고정한 구성', ['#15101C', '#281D33', '#3E2C4D', '#FF4E00', '#C7FF00'], '과밀한 스티커 패널 사이를 관통하는 단일 CTA 띠', ['맥시멀', '혼돈']),
    b('black-metal-editorial', 'brutalism', 'fractured-panels', '블랙 메탈 에디토리얼', 'Black Metal Editorial', '검은 종이·백색 고딕 표식·날카로운 구획으로 음울한 편집물의 긴장을 만드는 화면', ['#090909', '#181818', '#2C2C2C', '#E8E5DC', '#8D1D24'], '가시형 장식 프레임과 좁고 긴 트랙리스트 컬럼', ['다크 편집', '고딕']),
    b('concrete-interface', 'brutalism', 'fractured-panels', '콘크리트 인터페이스', 'Concrete Interface', '무거운 회색 면과 구조 이음새를 그대로 보여 주는 건축적 정보 패널', ['#161819', '#282B2D', '#414547', '#E3A72F', '#BFC6C8'], '거푸집 선처럼 나뉜 비대칭 카드와 노출된 인덱스 볼트', ['건축', '콘크리트']),
    b('paper-cut-layers', 'depth', 'fractured-panels', '페이퍼컷 레이어', 'Paper-cut Layers', '서로 다른 색지의 절단면과 깊은 틈을 겹쳐 평면 안에 무대 같은 깊이를 만드는 구성', ['#111827', '#1F2937', '#374151', '#F97316', '#38BDF8'], '계단식 절단면 사이로 드러나는 중심 콘텐츠 창', ['종이', '레이어']),

    b('acrylic-ui', 'depth', 'material-layers', '아크릴릭 UI', 'Acrylic UI', '배경색을 은은히 통과시키는 반투명 패널과 노이즈 없는 경계로 깊이를 나누는 UI', ['#E8F0F7', '#F8FBFF', '#D2DFEA', '#176B87', '#7C3AED'], '반투명 탐색 레일과 불투명 콘텐츠 백플레이트', ['아크릴', '레이어']),
    b('mica-surface', 'depth', 'material-layers', '마이카 서피스', 'Mica Surface', '환경색을 아주 약하게 반영하는 넓은 바탕과 단정한 카드로 장시간 작업 화면을 정리하는 재질', ['#E9EDF3', '#F9FAFC', '#D6DCE5', '#315F9B', '#A43B63'], '차분한 환경색 바탕 위 고정된 명령 바와 작업 캔버스', ['마이카', '데스크톱']),
    b('holographic-foil', 'depth', 'material-layers', '홀로그래픽 포일', 'Holographic Foil', '빛의 각도에 따라 바뀌는 듯한 두 신호색과 얇은 금속 경계로 수집품 같은 표면을 만드는 디자인', ['#F0EDF7', '#FFFFFF', '#DCD5EA', '#7C3AED', '#008A9A'], '비스듬한 포일 띠와 일련번호가 새겨진 인증 카드', ['홀로그램', '포일']),
    b('chrome-metal-ui', 'depth', 'material-layers', '크롬 메탈 UI', 'Chrome Metal UI', '차가운 금속 하이라이트와 단단한 조작 노브를 절제해 정밀 기기 같은 인터페이스를 만드는 스타일', ['#E7EBEF', '#FAFBFC', '#CBD2D9', '#285E75', '#A2384D'], '브러시드 메탈 레일과 음각 눈금이 있는 제어 다이얼', ['크롬', '기기 UI'])
  ]
});

export const RAW_MATERIALS_STYLES = RAW_MATERIALS_PACK.styles;
export const RAW_MATERIALS_BLUEPRINTS = RAW_MATERIALS_PACK.blueprints;
export const RAW_MATERIALS_MANIFEST = RAW_MATERIALS_PACK.manifest;
