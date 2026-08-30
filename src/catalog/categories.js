import { deepFreeze, sortByOrderThenId } from './contract.js';

/** @type {import('./contract.js').CategoryRecord[]} */
const categories = [
  {
    id: 'swiss',
    order: 10,
    title: { ko: '스위스 스타일', en: 'International Typographic Style' },
    description: { ko: '수학적 그리드, 비대칭 레이아웃, 강렬한 산세리프 타이포그래피 중심의 모더니즘 디자인' },
    icon: '📐',
    accentColor: '#FF3300',
    tags: ['모더니즘', '그리드', '미니멀', '산세리프']
  },
  {
    id: 'brutalism',
    order: 20,
    title: { ko: '브루탈리즘 & 네오 브루탈리즘', en: 'Brutalism & Neo-Brutalism' },
    description: { ko: '두꺼운 외곽선, 비정형적 레이아웃, 과감한 하드 섀도가 만드는 파격적 디자인' },
    icon: '⚡',
    accentColor: '#FFFF00',
    tags: ['브루탈리즘', '네오브루탈', '파격', '하드섀도']
  },
  {
    id: 'depth',
    order: 30,
    title: { ko: '입체감 및 질감 스타일', en: 'Depth & Materiality' },
    description: { ko: '반투명 유리(Glass), 부드러운 양각(Neumorphism), 아날로그 촉감(Skeuomorphism)' },
    icon: '💎',
    accentColor: '#00F0FF',
    tags: ['글래스', '뉴모피즘', '스큐어모피즘', '3D질감']
  },
  {
    id: 'retro',
    order: 40,
    title: { ko: '레트로 & 팝 아키텍처', en: 'Retro & Pop Architecture' },
    description: { ko: '80년대 멤피스, 사이버펑크, 신스웨이브, 베이퍼웨이브가 선사하는 강렬한 아날로그 팝 감성' },
    icon: '📼',
    accentColor: '#FF007A',
    tags: ['레트로', '80s', '신스웨이브', '베이퍼웨이브']
  },
  {
    id: 'editorial',
    order: 50,
    title: { ko: '에디토리얼 & 오가닉', en: 'Editorial & Organic' },
    description: { ko: '럭셔리 잡지 레이아웃, 우아한 세리프 타이포, 자연의 웜톤 부드러운 곡선의 만남' },
    icon: '🌿',
    accentColor: '#00E699',
    tags: ['에디토리얼', '세리프', '오가닉', '자연친화']
  },
  {
    id: 'y2k',
    order: 60,
    title: { ko: 'Y2K & 2000s 글로시 웹', en: 'Y2K & 2000s Glossy Web' },
    description: { ko: '밀레니엄 크롬, 투명 아쿠아 젤 버튼, Frutiger Aero의 푸른 하늘과 픽셀 아케이드' },
    icon: '💿',
    accentColor: '#A855F7',
    tags: ['Y2K', 'FrutigerAero', '글로시', '픽셀아트']
  },
  {
    id: 'hypertech',
    order: 70,
    title: { ko: '하이퍼 테크 & 키네틱 모션', en: 'Hyper-Tech & Kinetic Motion' },
    description: { ko: '속도감 넘치는 키네틱 타이포, 애플 스타일 정밀 벤토 그리드, 강렬한 테크노 애시드' },
    icon: '⚡',
    accentColor: '#CCFF00',
    tags: ['키네틱', '벤토UI', '애시드', '하이퍼테크']
  },
  {
    id: 'soft3d',
    order: 80,
    title: { ko: '소프트 3D & 솔라퓨처리즘', en: 'Soft 3D & Solarpunk' },
    description: { ko: '폭신한 클레이모피즘(3D 버블), 손그림 콜라주 감성, 희망찬 친환경 솔라펑크' },
    icon: '🌱',
    accentColor: '#FF6B4A',
    tags: ['클레이모피즘', '3D소프트', '콜라주', '솔라펑크']
  }
];

export const CATEGORY_DEFINITIONS = deepFreeze(categories.sort(sortByOrderThenId));
