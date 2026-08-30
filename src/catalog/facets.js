import { deepFreeze, sortByOrderThenId } from './contract.js';

const value = (id, order, ko, en) => ({ id, order, label: { ko, en } });

/** @type {import('./contract.js').FacetDefinition[]} */
const facets = [
  {
    id: 'kind',
    order: 10,
    label: { ko: '스타일 유형', en: 'Kind' },
    selectionMode: 'single',
    values: [
      value('historical-movement', 10, '역사적 사조', 'Historical movement'),
      value('revival', 20, '리바이벌', 'Revival'),
      value('technique', 30, '표현 기법', 'Technique'),
      value('interface-language', 40, '인터페이스 언어', 'Interface language'),
      value('microtrend', 50, '마이크로트렌드', 'Microtrend'),
      value('speculative', 60, '사변적 스타일', 'Speculative')
    ]
  },
  {
    id: 'era',
    order: 20,
    label: { ko: '시대', en: 'Era' },
    selectionMode: 'single',
    values: [
      value('pre-1950', 10, '1950년 이전', 'Before 1950'),
      value('1950s-1970s', 20, '1950–1970년대', '1950s–1970s'),
      value('1980s-1990s', 30, '1980–1990년대', '1980s–1990s'),
      value('2000s', 40, '2000년대', '2000s'),
      value('2010s', 50, '2010년대', '2010s'),
      value('2020s', 60, '2020년대', '2020s'),
      value('timeless', 70, '시대 초월', 'Timeless')
    ]
  },
  {
    id: 'lineage',
    order: 30,
    label: { ko: '디자인 계보', en: 'Lineage' },
    selectionMode: 'multiple',
    values: [
      value('modernism', 10, '모더니즘', 'Modernism'),
      value('international-style', 20, '국제 타이포그래피 양식', 'International style'),
      value('minimalism', 30, '미니멀리즘', 'Minimalism'),
      value('brutalism', 40, '브루탈리즘', 'Brutalism'),
      value('skeuomorphism', 50, '스큐어모피즘', 'Skeuomorphism'),
      value('postmodernism', 60, '포스트모더니즘', 'Postmodernism'),
      value('retrofuturism', 70, '레트로퓨처리즘', 'Retrofuturism'),
      value('editorial', 80, '에디토리얼', 'Editorial'),
      value('organic-modernism', 90, '오가닉 모더니즘', 'Organic modernism'),
      value('cyberculture', 100, '사이버컬처', 'Cyberculture'),
      value('grid-systems', 110, '그리드 시스템', 'Grid systems'),
      value('indie-craft', 120, '인디 크래프트', 'Indie craft'),
      value('eco-futurism', 130, '에코 퓨처리즘', 'Eco-futurism'),
      value('bauhaus', 140, '바우하우스', 'Bauhaus'),
      value('de-stijl', 150, '데 스틸', 'De Stijl'),
      value('flat-design', 160, '플랫 디자인', 'Flat design'),
      value('constructivism', 170, '구성주의', 'Constructivism'),
      value('punk-diy', 180, '펑크 DIY', 'Punk DIY'),
      value('material-design', 190, '머티리얼 디자인', 'Material Design'),
      value('liquid-glass', 200, '리퀴드 글래스', 'Liquid Glass'),
      value('art-deco', 210, '아르데코', 'Art Deco'),
      value('psychedelia', 220, '사이키델리아', 'Psychedelia'),
      value('art-nouveau', 230, '아르누보', 'Art Nouveau'),
      value('risograph-print', 240, '리소그래프 인쇄', 'Risograph print'),
      value('microsoft-design', 250, '마이크로소프트 디자인', 'Microsoft design')
    ]
  },
  {
    id: 'media',
    order: 40,
    label: { ko: '매체', en: 'Media' },
    selectionMode: 'multiple',
    values: [
      value('graphic', 10, '그래픽', 'Graphic'),
      value('print', 20, '인쇄', 'Print'),
      value('web-ui', 30, '웹 UI', 'Web UI'),
      value('product-ui', 40, '제품 UI', 'Product UI'),
      value('illustration', 50, '일러스트레이션', 'Illustration'),
      value('three-d', 60, '3D', '3D')
    ]
  },
  {
    id: 'materiality',
    order: 50,
    label: { ko: '질감과 재료', en: 'Materiality' },
    selectionMode: 'multiple',
    values: [
      value('flat', 10, '평면', 'Flat'),
      value('glass', 20, '유리', 'Glass'),
      value('paper', 30, '종이', 'Paper'),
      value('ink', 40, '잉크', 'Ink'),
      value('metal', 50, '금속', 'Metal'),
      value('plastic', 60, '플라스틱', 'Plastic'),
      value('pixel', 70, '픽셀', 'Pixel'),
      value('clay', 80, '클레이', 'Clay'),
      value('organic', 90, '유기적 재료', 'Organic'),
      value('screen', 100, '발광 화면', 'Screen')
    ]
  },
  {
    id: 'density',
    order: 60,
    label: { ko: '정보 밀도', en: 'Density' },
    selectionMode: 'single',
    values: [
      value('sparse', 10, '희박함', 'Sparse'),
      value('balanced', 20, '균형', 'Balanced'),
      value('dense', 30, '고밀도', 'Dense'),
      value('maximal', 40, '맥시멀', 'Maximal')
    ]
  },
  {
    id: 'tone',
    order: 70,
    label: { ko: '분위기', en: 'Tone' },
    selectionMode: 'multiple',
    values: [
      value('rational', 10, '이성적', 'Rational'),
      value('precise', 20, '정밀함', 'Precise'),
      value('professional', 30, '전문적', 'Professional'),
      value('rebellious', 40, '반항적', 'Rebellious'),
      value('playful', 50, '유희적', 'Playful'),
      value('futuristic', 60, '미래적', 'Futuristic'),
      value('tactile', 70, '촉각적', 'Tactile'),
      value('nostalgic', 80, '향수 어린', 'Nostalgic'),
      value('luxurious', 90, '고급스러운', 'Luxurious'),
      value('organic', 100, '유기적', 'Organic'),
      value('immersive', 110, '몰입감 있는', 'Immersive'),
      value('energetic', 120, '역동적', 'Energetic'),
      value('friendly', 130, '친근한', 'Friendly'),
      value('optimistic', 140, '낙관적', 'Optimistic')
    ]
  },
  {
    id: 'motion',
    order: 80,
    label: { ko: '모션 강도', en: 'Motion' },
    selectionMode: 'single',
    values: [
      value('none', 10, '없음', 'None'),
      value('restrained', 20, '절제됨', 'Restrained'),
      value('expressive', 30, '표현적', 'Expressive'),
      value('intense', 40, '강렬함', 'Intense')
    ]
  },
  {
    id: 'region',
    order: 90,
    label: { ko: '지역·문화권', en: 'Region & culture' },
    selectionMode: 'multiple',
    values: [
      value('international', 10, '국제적', 'International'),
      value('europe', 20, '유럽', 'Europe'),
      value('north-america', 30, '북아메리카', 'North America'),
      value('latin-america', 40, '라틴아메리카', 'Latin America'),
      value('east-asia', 50, '동아시아', 'East Asia'),
      value('south-asia', 60, '남아시아', 'South Asia'),
      value('africa', 70, '아프리카', 'Africa'),
      value('middle-east', 80, '중동', 'Middle East'),
      value('oceania', 90, '오세아니아', 'Oceania'),
      value('global-internet', 100, '글로벌 인터넷 문화', 'Global internet culture')
    ]
  },
  {
    id: 'maturity',
    order: 100,
    label: { ko: '성숙도', en: 'Maturity' },
    selectionMode: 'single',
    values: [
      value('canonical', 10, '정전적', 'Canonical'),
      value('established', 20, '정착됨', 'Established'),
      value('emerging', 30, '부상 중', 'Emerging'),
      value('experimental', 40, '실험적', 'Experimental')
    ]
  }
];

for (const facet of facets) {
  facet.values.sort(sortByOrderThenId);
}

export const FACET_DEFINITIONS = deepFreeze(facets.sort(sortByOrderThenId));
