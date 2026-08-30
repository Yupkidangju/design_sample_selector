import { defineExpansionPack, expansionBlueprint as b } from './authoring.js';

export const DIMENSIONAL_POP_PACK = defineExpansionPack({
  id: 'dimensional-pop',
  order: 40,
  startOrder: 610,
  title: { ko: '디멘셔널 팝 12종', en: 'Dimensional Pop 12' },
  blueprints: [
    b('iridescent-mesh', 'depth', 'dimensional-mesh', '이리데슨트 메시', 'Iridescent Mesh', '청록·보라 빛이 교차하는 유연한 메시와 깊은 배경으로 디지털 재질의 변화를 보여 주는 화면', ['#0D1020', '#191D31', '#2A3049', '#7C5CFC', '#24D6C8'], '빛을 따라 휘어진 격자 리본과 부유하는 상태 점', ['이리데슨트', '메시']),
    b('isometric-depth', 'depth', 'dimensional-mesh', '아이소메트릭 뎁스', 'Isometric Depth', '동일한 각도의 블록과 층별 색으로 복잡한 서비스 구조를 지도처럼 펼쳐 보이는 디자인', ['#111827', '#1F2937', '#344155', '#38BDF8', '#F59E0B'], '세 높이의 아이소메트릭 플랫폼과 연결 브리지', ['아이소메트릭', '지도']),
    b('low-poly-interface', 'depth', 'dimensional-mesh', '로우 폴리 인터페이스', 'Low-poly Interface', '제한된 다각 면과 단순한 음영으로 가볍고 계산적인 3D 감각을 만드는 인터페이스', ['#10151D', '#1C2530', '#304050', '#2DD4BF', '#FB7185'], '삼각 면으로 접힌 중심 오브젝트와 꼭짓점 데이터', ['로우 폴리', '기하 3D']),
    b('soft-plastic', 'depth', 'dimensional-mesh', '소프트 플라스틱', 'Soft Plastic', '반투명한 연질 플라스틱 버튼과 둥근 용기로 친근한 제품형 깊이를 만드는 화면', ['#171225', '#28203B', '#3C3155', '#A78BFA', '#FB7185'], '젤 캡슐형 CTA와 두 겹으로 눌린 정보 포켓', ['소프트 재질', '플라스틱']),

    b('embossed-letterpress', 'depth', 'print-relief', '엠보스드 레터프레스', 'Embossed Letterpress', '눌린 활자와 미세한 종이 음영으로 절제된 인쇄 공예의 깊이를 재현하는 디자인', ['#F1E9D8', '#FFFDF7', '#D8CCB5', '#8D3A2D', '#315B55'], '빛에만 드러나는 큰 압인 제목과 작은 활판 번호', ['레터프레스', '압인']),
    b('mid-century-modern', 'retro', 'print-relief', '미드센추리 모던', 'Mid-century Modern', '단순한 유기 도형·낮은 가구색·명료한 활자로 낙관적인 생활 문화를 표현하는 구성', ['#F1E3C6', '#FFF7E8', '#D8C29D', '#C84D32', '#276D67'], '콩 모양 색면과 얇은 다리처럼 뻗는 분할선', ['미드센추리', '생활']),
    b('atomic-age', 'retro', 'print-relief', '아토믹 에이지', 'Atomic Age', '별폭발·궤도·부메랑 도형으로 전후 시대의 과학 낙관주의를 재해석한 화면', ['#F5E7C8', '#FFF9EA', '#DCC8A0', '#D44936', '#216B78'], '원자 궤도를 도는 상태 배지와 별폭발형 CTA', ['아토믹', '레트로퓨처']),
    b('pop-art-halftone', 'retro', 'print-relief', '팝아트 하프톤', 'Pop Art Halftone', '굵은 윤곽과 인쇄 망점, 말풍선형 메시지로 대중매체의 즉각성을 만드는 디자인', ['#F8E65B', '#FFFBEA', '#E0C83A', '#E31B36', '#1757A6'], '점망 배경 위 만화 패널과 큰 감탄형 행동 버튼', ['팝아트', '하프톤']),

    b('op-art', 'retro', 'optical-stage', '옵아트', 'Op Art', '흑백 반복선과 한 개의 신호색으로 평면이 움직이는 듯한 긴장을 만드는 시각 실험', ['#090909', '#181818', '#303030', '#F8F8F2', '#FF3B30'], '간격이 변하는 동심선과 고정된 중앙 정보판', ['옵아트', '착시']),
    b('space-age', 'retro', 'optical-stage', '스페이스 에이지', 'Space Age', '캡슐·궤도·돔형 패널로 우주 시대의 낙관적인 미래 생활을 그리는 화면', ['#0C1630', '#162445', '#293A61', '#FF7A59', '#63E6E2'], '행성을 도는 캡슐 카드와 반원형 항법 계기', ['우주 시대', '캡슐']),
    b('disco-glam', 'retro', 'optical-stage', '디스코 글램', 'Disco Glam', '반짝이는 방사선과 거울 공 모티프, 금빛 타이포로 밤의 공연성을 강조한 디자인', ['#180D25', '#2A1740', '#45255F', '#F4C95D', '#EC4899'], '미러볼 중심에서 퍼지는 광선과 티켓형 CTA', ['디스코', '글램']),
    b('seventies-groovy', 'retro', 'optical-stage', '세븐티스 그루비', 'Seventies Groovy', '겹치는 물결 활자와 흙빛 오렌지·올리브로 느긋하고 리드미컬한 편집 화면을 만드는 스타일', ['#25150E', '#382319', '#52382A', '#F07A24', '#B8C33D'], '굵기가 변하는 물결 띠와 둥근 연속 제목', ['70년대', '그루비'])
  ]
});

export const DIMENSIONAL_POP_STYLES = DIMENSIONAL_POP_PACK.styles;
export const DIMENSIONAL_POP_BLUEPRINTS = DIMENSIONAL_POP_PACK.blueprints;
export const DIMENSIONAL_POP_MANIFEST = DIMENSIONAL_POP_PACK.manifest;
