import { defineExpansionPack, expansionBlueprint as b } from './authoring.js';

export const MODERN_FOUNDATIONS_PACK = defineExpansionPack({
  id: 'modern-foundations',
  order: 20,
  startOrder: 370,
  title: { ko: '모던 파운데이션 12종', en: 'Modern Foundations 12' },
  blueprints: [
    b('ulm-rationalism', 'swiss', 'rational-grid', '울름 합리주의', 'Ulm Rationalism', '기능 분석표와 절제된 청적 신호로 화면의 목적을 먼저 드러내는 시스템 디자인', ['#F3F0E7', '#FFFFFF', '#D9D5C8', '#C7392F', '#1E5572'], '수치화된 모듈 표와 비대칭 제품 정보 블록', ['기능주의', '시스템']),
    b('swiss-poster', 'swiss', 'rational-grid', '스위스 포스터', 'Swiss Poster', '초대형 산세리프 제목과 한 개의 선명한 색면으로 행사 정보를 압축하는 포스터 구성', ['#F6F3EA', '#FFFFFF', '#DED8CA', '#E23B2E', '#164C8C'], '잘린 대형 활자와 날짜를 잇는 세로 기준선', ['포스터', '타이포']),
    b('dutch-total-design', 'swiss', 'rational-grid', '더치 토털 디자인', 'Dutch Total Design', '반복 가능한 표식·번호·그리드로 복잡한 조직 정보를 하나의 시각 체계로 묶는 디자인', ['#F2F5F3', '#FFFFFF', '#D8DEDA', '#D12A27', '#176B62'], '연속 번호와 정사각 픽토그램의 일관된 리듬', ['아이덴티티', '모듈']),
    b('new-wave-typography', 'swiss', 'rational-grid', '뉴웨이브 타이포그래피', 'New Wave Typography', '모더니스트 격자를 비틀고 활자의 크기·각도·간격을 리듬으로 사용하는 실험적 편집 화면', ['#F8F1DF', '#FFFFFF', '#DDD0B5', '#E6472F', '#5546A9'], '기준선을 일부 이탈하는 계단형 제목과 회전 캡션', ['뉴웨이브', '실험 타이포']),

    b('modular-grid-system', 'swiss', 'sparse-axis', '모듈러 그리드 시스템', 'Modular Grid System', '콘텐츠 단위를 일정한 행·열 모듈에 매핑해 정보량이 바뀌어도 질서를 유지하는 화면', ['#F7F8F6', '#FFFFFF', '#E3E7E1', '#1E5C8A', '#D84A2F'], '번호가 붙은 빈 모듈과 한 칸을 가로지르는 핵심 메시지', ['그리드', '정보 설계']),
    b('functional-wayfinding', 'swiss', 'sparse-axis', '기능주의 웨이파인딩', 'Functional Wayfinding', '방향 화살표·노선색·짧은 동사로 다음 행동을 멀리서도 알아보게 하는 안내 체계', ['#F5F4EE', '#FFFFFF', '#DDD9CD', '#005F73', '#D94829'], '큰 방향 화살표와 거리·구역 번호의 이중 표지', ['사인 시스템', '방향']),
    b('japanese-ma-minimal', 'swiss', 'sparse-axis', '일본식 마 미니멀', 'Japanese Ma Minimal', '비어 있는 간격 자체를 계층으로 사용해 한 문장과 한 행동에 깊은 호흡을 주는 화면', ['#F5F1E8', '#FFFCF5', '#DED7C8', '#8E2F2A', '#315C52'], '한쪽에 치우친 작은 세로 표제와 넓은 무채색 장', ['여백', '정적']),
    b('scandinavian-functional', 'swiss', 'sparse-axis', '스칸디나비아 기능주의', 'Scandinavian Functional', '밝은 목질 중간색과 실용적인 간격으로 차갑지 않은 기능주의를 만드는 인터페이스', ['#F3F0E8', '#FFFFFF', '#DED8C9', '#2E6F62', '#C54C36'], '따뜻한 표면과 둥글지 않은 실용 카드의 느슨한 축', ['기능주의', '따뜻함']),

    b('information-isotype', 'swiss', 'symbol-collage', '아이소타입 정보 디자인', 'Isotype Information Design', '반복되는 사람·사물 기호와 수량 단위로 언어 장벽을 낮추는 설명형 데이터 화면', ['#F4EEDC', '#FFFDF5', '#D8CDB4', '#C9362B', '#1D6284'], '동일 크기 픽토그램의 반복과 직접 수치 레이블', ['픽토그램', '데이터']),
    b('web-brutalism', 'brutalism', 'symbol-collage', '웹 브루탈리즘', 'Web Brutalism', '브라우저 기본 요소와 노출된 경계를 숨기지 않고 콘텐츠와 링크를 전면에 세우는 웹 구성', ['#F4F4F0', '#FFFFFF', '#D4D4CF', '#0000EE', '#D90000'], '밑줄 링크·기본 버튼·굵은 검정 프레임의 의도적 노출', ['원시 웹', '직접성']),
    b('anti-design', 'brutalism', 'symbol-collage', '안티 디자인', 'Anti-Design', '충돌하는 색과 의도적 불균형으로 매끈한 인터페이스 관습을 비판하는 시각 언어', ['#FFF36D', '#FFFFFF', '#E0CF38', '#E1197B', '#1637D6'], '비정렬 경고 스티커와 서로 다른 활자 크기의 충돌', ['반규범', '고대비']),
    b('dada-collage', 'brutalism', 'symbol-collage', '다다 콜라주', 'Dada Collage', '잘라 붙인 활자·기하 조각·우연한 여백으로 선형적인 읽기 순서를 흔드는 편집 화면', ['#EFE5D2', '#FFF9EC', '#D3C2A5', '#B51F2A', '#245071'], '종이 조각처럼 겹친 제목과 번호표·도장 모티프', ['다다', '콜라주'])
  ]
});

export const MODERN_FOUNDATIONS_STYLES = MODERN_FOUNDATIONS_PACK.styles;
export const MODERN_FOUNDATIONS_BLUEPRINTS = MODERN_FOUNDATIONS_PACK.blueprints;
export const MODERN_FOUNDATIONS_MANIFEST = MODERN_FOUNDATIONS_PACK.manifest;
