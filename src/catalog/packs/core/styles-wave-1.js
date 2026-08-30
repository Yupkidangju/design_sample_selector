import { CATALOG_SCHEMA_VERSION, deepFreeze } from '../../contract.js';

const REVIEWED_AT = '2026-08-30';

function swatch(id, ko, en, value, usage) {
  return { id, name: { ko, en }, value, usage: { ko: usage } };
}

function defineStyle(definition) {
  const { source, ...style } = definition;
  return {
    schemaVersion: CATALOG_SCHEMA_VERSION,
    aliases: [],
    publicationStatus: 'ready',
    ...style,
    provenance: {
      reviewedAt: REVIEWED_AT,
      sources: [{ ...source, accessedAt: REVIEWED_AT }],
      assets: []
    }
  };
}

/** @type {import('../../contract.js').StyleRecord[]} */
export const CORE_WAVE_1_STYLES = deepFreeze([
  defineStyle({
    id: 'bauhaus-geometry',
    categoryId: 'swiss',
    order: 250,
    name: { ko: '바우하우스 기하학', en: 'Bauhaus Geometric Typography' },
    summary: { ko: '원·삼각형·직사각형과 축약된 기하 타이포로 기능과 형태를 직접 연결하는 구성' },
    classification: {
      kind: 'historical-movement',
      era: { start: 1919, end: 1933, label: 'Before 1950' },
      lineages: ['modernism', 'bauhaus'],
      media: ['graphic', 'print', 'web-ui'],
      materiality: ['flat'],
      density: 'balanced',
      tone: ['rational', 'playful'],
      motion: 'expressive',
      regions: ['europe'],
      maturity: 'canonical'
    },
    tokens: {
      background: '#F4EBD0',
      surface: '#FFF9E8',
      surfaceSubtle: '#E7D9B5',
      border: '#171717',
      text: '#171717',
      textMuted: '#4A4338',
      accent: '#C9232C',
      accentSecondary: '#174EA6',
      radius: '0px',
      borderWidth: '2px',
      shadow: '6px 6px 0 #171717',
      fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
      glow: 'none'
    },
    preview: {
      rendererId: 'bauhaus-geometry',
      thumbnailId: 'primary-forms',
      motionId: 'shape-orbit'
    },
    defaultTweaks: { borderRadius: 0, borderWidth: 2, shadowDepth: 6, backdropBlur: 0, glowIntensity: 0 },
    palette: [
      swatch('workshop-cream', '공방 크림', 'Workshop Cream', '#F4EBD0', '배경과 여백'),
      swatch('signal-red', '신호 적색', 'Signal Red', '#C9232C', '원형과 주요 행동'),
      swatch('construction-blue', '구성 청색', 'Construction Blue', '#174EA6', '직사각형과 보조 강조'),
      swatch('type-black', '활자 검정', 'Type Black', '#171717', '타이포와 외곽선')
    ],
    editorial: {
      moodTags: ['기하학', '공방', '기능주의', '원색'],
      characteristics: ['기본 도형의 비대칭 균형', '축약된 굵은 기하 타이포', '적·청·황 신호색'],
      pros: ['형태만으로도 강한 정체성을 만든다.', '정보 모듈을 명확한 도형에 대응시키기 쉽다.'],
      cons: ['원색 면적이 커지면 본문보다 장식이 앞설 수 있다.'],
      accessibilityNotes: ['도형 색만으로 상태를 구분하지 않고 텍스트 레이블과 2px 외곽선을 함께 제공한다.']
    },
    source: {
      title: 'Offers for students',
      publisher: 'Stiftung Bauhaus Dessau',
      url: 'https://bauhaus-dessau.de/en/visit/groups/offers-for-students/',
      sourceType: 'institutional'
    }
  }),
  defineStyle({
    id: 'de-stijl',
    categoryId: 'swiss',
    order: 260,
    name: { ko: '데 스틸 신조형주의', en: 'De Stijl Neo-Plasticism' },
    summary: { ko: '수평·수직 검은 선과 비대칭 원색 평면만으로 화면의 질서와 긴장을 만드는 구성' },
    classification: {
      kind: 'historical-movement',
      era: { start: 1917, end: 1937, label: 'Before 1950' },
      lineages: ['modernism', 'de-stijl'],
      media: ['graphic', 'print', 'web-ui'],
      materiality: ['flat'],
      density: 'balanced',
      tone: ['rational', 'precise'],
      motion: 'restrained',
      regions: ['europe'],
      maturity: 'canonical'
    },
    tokens: {
      background: '#F7F5ED', surface: '#FFFFFF', surfaceSubtle: '#E9E6DA', border: '#111111',
      text: '#111111', textMuted: '#4B4B47', accent: '#D0021B', accentSecondary: '#0057A8',
      radius: '0px', borderWidth: '4px', shadow: 'none',
      fontFamily: "'Helvetica Neue', Arial, sans-serif", glow: 'none'
    },
    preview: { rendererId: 'de-stijl', thumbnailId: 'orthogonal-planes', motionId: 'plane-reveal' },
    defaultTweaks: { borderRadius: 0, borderWidth: 4, shadowDepth: 0, backdropBlur: 0, glowIntensity: 0 },
    palette: [
      swatch('gallery-white', '갤러리 백색', 'Gallery White', '#F7F5ED', '주요 평면'),
      swatch('primary-red', '원색 빨강', 'Primary Red', '#D0021B', '핵심 평면'),
      swatch('primary-blue', '원색 파랑', 'Primary Blue', '#0057A8', '보조 평면'),
      swatch('orthogonal-black', '직교 검정', 'Orthogonal Black', '#111111', '수평·수직 분할선')
    ],
    editorial: {
      moodTags: ['직교', '신조형주의', '원색', '균형'],
      characteristics: ['수평·수직선만 사용하는 화면 분할', '흰 면과 원색 면의 비대칭 균형', '곡선과 대각선 배제'],
      pros: ['정보 영역의 관계를 강한 면 분할로 즉시 전달한다.', '장식 자산 없이도 구조적 인상이 선명하다.'],
      cons: ['복잡한 데이터에서는 굵은 분할선이 시각적 무게를 과도하게 가질 수 있다.'],
      accessibilityNotes: ['원색 평면 안의 텍스트에는 검정 또는 흰색 대비 백플레이트를 사용하고 색 외에 위치·레이블로 의미를 반복한다.']
    },
    source: {
      title: 'De Stijl (The Style)',
      publisher: 'National Galleries of Scotland',
      url: 'https://www.nationalgalleries.org/art-and-artists/glossary-terms/de-stijl-style',
      sourceType: 'institutional'
    }
  }),
  defineStyle({
    id: 'flat-design',
    categoryId: 'swiss',
    order: 270,
    name: { ko: '플랫 디자인 2.0', en: 'Flat Design 2.0' },
    summary: { ko: '평면 색 블록과 단순 아이콘에 테두리·밑줄·상태색을 더해 조작 가능성을 복원한 UI 언어' },
    classification: {
      kind: 'interface-language',
      era: { start: 2012, end: 2026, label: '2010s–2020s' },
      lineages: ['minimalism', 'flat-design'],
      media: ['web-ui', 'product-ui'],
      materiality: ['flat'],
      density: 'balanced',
      tone: ['friendly', 'professional'],
      motion: 'restrained',
      regions: ['international'],
      maturity: 'established'
    },
    tokens: {
      background: '#F5F8FC', surface: '#FFFFFF', surfaceSubtle: '#E7EEF7', border: '#8AA0B8',
      text: '#102A43', textMuted: '#486581', accent: '#006BB6', accentSecondary: '#C53D00',
      radius: '6px', borderWidth: '2px', shadow: 'none',
      fontFamily: "'Inter', 'Helvetica Neue', sans-serif", glow: 'none'
    },
    preview: { rendererId: 'flat-design', thumbnailId: 'flat-signifiers', motionId: 'color-snap' },
    defaultTweaks: { borderRadius: 6, borderWidth: 2, shadowDepth: 0, backdropBlur: 0, glowIntensity: 0 },
    palette: [
      swatch('app-blue', '앱 파랑', 'App Blue', '#006BB6', '주요 행동과 링크'),
      swatch('state-orange', '상태 주황', 'State Orange', '#C53D00', '알림과 보조 행동'),
      swatch('panel-mist', '패널 미스트', 'Panel Mist', '#E7EEF7', '그룹 배경'),
      swatch('navy-copy', '네이비 본문', 'Navy Copy', '#102A43', '본문과 아이콘')
    ],
    editorial: {
      moodTags: ['명료함', '앱 UI', '색 블록', '직관성'],
      characteristics: ['광택과 재질을 제거한 평면 요소', '단순 아이콘과 굵은 상태색', '테두리·밑줄로 복원한 조작 표지'],
      pros: ['저사양 환경에서도 빠르고 안정적으로 렌더링된다.', '명확한 상태 규칙을 적용하면 학습 비용이 낮다.'],
      cons: ['표지를 줄이면 버튼과 일반 텍스트의 구분이 약해질 수 있다.'],
      accessibilityNotes: ['클릭 가능한 요소에는 색뿐 아니라 밑줄·테두리·focus-visible을 항상 제공한다.']
    },
    source: {
      title: 'Flat Design: Its Origins, Its Problems, and Why Flat 2.0 Is Better for Users',
      publisher: 'Nielsen Norman Group',
      url: 'https://www.nngroup.com/articles/flat-design/',
      sourceType: 'industry'
    }
  }),
  defineStyle({
    id: 'constructivist',
    categoryId: 'brutalism',
    order: 280,
    name: { ko: '구성주의 애지트프로프', en: 'Constructivist Agitprop' },
    summary: { ko: '적·흑·크림의 대각 축과 압축 타이포로 행동을 촉구하는 포스터형 정보 계층' },
    classification: {
      kind: 'historical-movement',
      era: { start: 1915, end: 1935, label: 'Before 1950' },
      lineages: ['modernism', 'constructivism'],
      media: ['graphic', 'print', 'web-ui'],
      materiality: ['paper', 'ink'],
      density: 'dense',
      tone: ['rebellious', 'energetic'],
      motion: 'expressive',
      regions: ['europe'],
      maturity: 'canonical'
    },
    tokens: {
      background: '#F2E5C8', surface: '#FFF5DC', surfaceSubtle: '#D9C8A4', border: '#1A120E',
      text: '#1A120E', textMuted: '#59483C', accent: '#B9141A', accentSecondary: '#5C0B0F',
      radius: '0px', borderWidth: '3px', shadow: '7px 7px 0 #1A120E',
      fontFamily: "Impact, 'Arial Narrow', sans-serif", glow: 'none'
    },
    preview: { rendererId: 'constructivist', thumbnailId: 'agitprop-diagonal', motionId: 'diagonal-drive' },
    defaultTweaks: { borderRadius: 0, borderWidth: 3, shadowDepth: 7, backdropBlur: 0, glowIntensity: 0 },
    palette: [
      swatch('newsprint-cream', '신문 크림', 'Newsprint Cream', '#F2E5C8', '포스터 바탕'),
      swatch('agit-red', '선동 적색', 'Agit Red', '#B9141A', '대각 띠와 CTA'),
      swatch('press-black', '인쇄 검정', 'Press Black', '#1A120E', '압축 타이포와 외곽선'),
      swatch('deep-red', '심홍', 'Deep Red', '#5C0B0F', '보조 도형')
    ],
    editorial: {
      moodTags: ['대각선', '포스터', '선동적', '아방가르드'],
      characteristics: ['강한 대각 축과 방사형 시선 흐름', '압축 대문자와 짧은 구호', '적·흑·크림의 제한 팔레트'],
      pros: ['행동 요청과 핵심 수치를 강렬하게 우선시한다.', '추상 도형만으로 포스터의 운동감을 재현한다.'],
      cons: ['대각 요소가 긴 본문 영역과 충돌하면 읽기 흐름이 깨질 수 있다.'],
      accessibilityNotes: ['기울어진 장식과 별개로 실제 텍스트는 수평으로 유지하고 DOM 읽기 순서를 시각 순서와 일치시킨다.']
    },
    source: {
      title: 'Rodchenko — Graphic Design',
      publisher: 'The Museum of Modern Art',
      url: 'https://www.moma.org/interactives/exhibitions/1998/rodchenko/texts/graphic_design.html',
      sourceType: 'institutional'
    }
  }),
  defineStyle({
    id: 'punk-zine',
    categoryId: 'brutalism',
    order: 290,
    name: { ko: '펑크 제록스 진', en: 'Punk Xerox Zine' },
    summary: { ko: '복사기 질감과 잘라 붙인 활자, 찢긴 라벨로 반권위적 편집 리듬을 만드는 흑백 진 문법' },
    classification: {
      kind: 'revival',
      era: { start: 1976, end: 1988, label: '1950s–1970s' },
      lineages: ['postmodernism', 'punk-diy'],
      media: ['graphic', 'print', 'web-ui'],
      materiality: ['paper', 'ink'],
      density: 'maximal',
      tone: ['rebellious', 'energetic'],
      motion: 'expressive',
      regions: ['europe', 'north-america'],
      maturity: 'established'
    },
    tokens: {
      background: '#F3F0E8', surface: '#FFFFFF', surfaceSubtle: '#D7D2C7', border: '#111111',
      text: '#111111', textMuted: '#4D4D49', accent: '#A90F32', accentSecondary: '#532B78',
      radius: '0px', borderWidth: '2px', shadow: '5px 5px 0 #111111',
      fontFamily: "'Arial Black', Impact, sans-serif", glow: 'none'
    },
    preview: { rendererId: 'punk-zine', thumbnailId: 'xerox-ransom', motionId: 'xerox-jitter' },
    defaultTweaks: { borderRadius: 0, borderWidth: 2, shadowDepth: 5, backdropBlur: 0, glowIntensity: 0 },
    palette: [
      swatch('copy-paper', '복사용지', 'Copy Paper', '#F3F0E8', '종이 배경'),
      swatch('xerox-black', '복사 검정', 'Xerox Black', '#111111', '하프톤과 본문'),
      swatch('staple-red', '스테이플 적색', 'Staple Red', '#A90F32', '경고 라벨'),
      swatch('bruise-violet', '멍든 보라', 'Bruise Violet', '#532B78', '별색 강조')
    ],
    editorial: {
      moodTags: ['DIY', '복사기', '반권위', '콜라주'],
      characteristics: ['흑백 하프톤과 복사 노이즈', '잘라 붙인 글자 폭과 기울기', '찢긴 라벨의 비정렬 계층'],
      pros: ['독립 출판과 커뮤니티 메시지에 즉각적인 태도를 부여한다.', '사진 없이도 질감과 타이포만으로 밀도를 만든다.'],
      cons: ['의도적 불규칙성이 긴 문서와 반복 입력 흐름에는 피로를 줄 수 있다.'],
      accessibilityNotes: ['장식용 잘린 글자는 aria-hidden으로 처리하고 실제 제목은 변형 없는 텍스트로 한 번만 제공한다.']
    },
    source: {
      title: 'Post-war design — an introduction',
      publisher: 'Victoria and Albert Museum',
      url: 'https://www.vam.ac.uk/articles/post-war-design-an-introduction',
      sourceType: 'institutional'
    }
  }),
  defineStyle({
    id: 'material-design',
    categoryId: 'depth',
    order: 300,
    name: { ko: '머티리얼 페이퍼 시스템', en: 'Material Paper System' },
    summary: { ko: '단계적 elevation과 상태 레이어로 정보 면의 우선순위와 조작 피드백을 설명하는 인터페이스 시스템' },
    classification: {
      kind: 'interface-language',
      era: { start: 2014, end: 2026, label: '2010s–2020s' },
      lineages: ['minimalism', 'material-design'],
      media: ['web-ui', 'product-ui'],
      materiality: ['paper'],
      density: 'balanced',
      tone: ['professional', 'friendly'],
      motion: 'restrained',
      regions: ['international'],
      maturity: 'established'
    },
    tokens: {
      background: '#F4F6FA', surface: '#FFFFFF', surfaceSubtle: '#E8EEF6', border: '#AEB9C7',
      text: '#17212B', textMuted: '#4B5D70', accent: '#005BBB', accentSecondary: '#8A3FFC',
      radius: '12px', borderWidth: '1px', shadow: '0 10px 28px rgba(23, 33, 43, 0.18)',
      fontFamily: "Roboto, 'Helvetica Neue', sans-serif", glow: 'none'
    },
    preview: { rendererId: 'material-design', thumbnailId: 'paper-elevation', motionId: 'paper-lift' },
    defaultTweaks: { borderRadius: 12, borderWidth: 1, shadowDepth: 12, backdropBlur: 0, glowIntensity: 0 },
    palette: [
      swatch('surface-white', '표면 백색', 'Surface White', '#FFFFFF', '상승한 카드'),
      swatch('action-blue', '행동 파랑', 'Action Blue', '#005BBB', 'FAB와 주요 행동'),
      swatch('state-violet', '상태 보라', 'State Violet', '#8A3FFC', '선택 상태'),
      swatch('content-ink', '콘텐츠 잉크', 'Content Ink', '#17212B', '본문과 아이콘')
    ],
    editorial: {
      moodTags: ['표면', 'Elevation', '상태', '제품 UI'],
      characteristics: ['명시적인 표면 단계와 그림자', '상태 레이어를 통한 눌림 피드백', '카드와 FAB의 공간적 우선순위'],
      pros: ['복잡한 제품 UI의 위계를 일관되게 설명한다.', '행동 상태와 포커스를 체계화하기 쉽다.'],
      cons: ['과도한 elevation 단계는 카드 중첩과 시각적 소음을 만든다.'],
      accessibilityNotes: ['elevation만으로 계층을 전달하지 않고 제목·경계·DOM 순서를 함께 사용하며 리플은 reduced-motion에서 억제한다.']
    },
    source: {
      title: 'Elevation — Material Design 3',
      publisher: 'Google Material Design',
      url: 'https://m3.material.io/styles/elevation/overview',
      sourceType: 'primary'
    }
  }),
  defineStyle({
    id: 'liquid-glass',
    categoryId: 'depth',
    order: 310,
    name: { ko: '리퀴드 글래스 인터페이스', en: 'Liquid Glass Interface' },
    summary: { ko: '콘텐츠 위의 기능성 제어 레이어에만 굴절·렌즈 하이라이트를 제한해 깊이와 맥락을 보존하는 UI' },
    classification: {
      kind: 'interface-language',
      era: { start: 2025, end: 2026, label: '2020s' },
      lineages: ['minimalism', 'liquid-glass'],
      media: ['web-ui', 'product-ui'],
      materiality: ['glass', 'screen'],
      density: 'sparse',
      tone: ['futuristic', 'precise'],
      motion: 'restrained',
      regions: ['international'],
      maturity: 'emerging'
    },
    tokens: {
      background: '#081A2C', surface: '#102D46', surfaceSubtle: '#183C58', border: '#70879A',
      text: '#F8FBFF', textMuted: '#C1D0DB', accent: '#70D7FF', accentSecondary: '#A5FFDF',
      radius: '20px', borderWidth: '1px', shadow: '0 18px 44px rgba(0, 8, 20, 0.38)',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif", glow: '0 0 24px rgba(112, 215, 255, 0.24)'
    },
    preview: { rendererId: 'liquid-glass', thumbnailId: 'refractive-controls', motionId: 'lens-shift' },
    defaultTweaks: { borderRadius: 20, borderWidth: 1, shadowDepth: 16, backdropBlur: 18, glowIntensity: 0.35 },
    palette: [
      swatch('deep-content', '깊은 콘텐츠', 'Deep Content', '#081A2C', '불투명 기본 배경'),
      swatch('glass-control', '글래스 제어', 'Glass Control', '#102D46', '가독성 백플레이트'),
      swatch('lens-cyan', '렌즈 시안', 'Lens Cyan', '#70D7FF', '초점과 하이라이트'),
      swatch('mint-refraction', '민트 굴절', 'Mint Refraction', '#A5FFDF', '보조 굴절')
    ],
    editorial: {
      moodTags: ['굴절', '제어 레이어', '공간감', '정밀함'],
      characteristics: ['콘텐츠와 분리된 부유 제어 레이어', '가장자리에 제한된 렌즈 하이라이트', '불투명 대비 백플레이트'],
      pros: ['탐색 제어와 콘텐츠의 맥락을 동시에 유지한다.', '제한된 영역만 사용하면 깊이 표현과 성능을 통제할 수 있다.'],
      cons: ['배경 변화가 큰 화면에서는 투명 재질이 텍스트 대비를 불안정하게 만들 수 있다.'],
      accessibilityNotes: ['투명 제어에는 항상 불투명 대비 backplate를 두고 transparency 감소 환경에서는 굴절 없이 단색 표면으로 전환한다.']
    },
    source: {
      title: 'Liquid Glass',
      publisher: 'Apple Developer',
      url: 'https://developer.apple.com/documentation/TechnologyOverviews/liquid-glass',
      sourceType: 'primary'
    }
  }),
  defineStyle({
    id: 'art-deco',
    categoryId: 'retro',
    order: 320,
    name: { ko: '아르데코 머신 에이지', en: 'Art Deco Machine Age' },
    summary: { ko: '대칭 축과 계단형 프레임, 선버스트를 검정·크림·금색으로 조율한 기계 시대의 럭셔리 문법' },
    classification: {
      kind: 'historical-movement',
      era: { start: 1920, end: 1940, label: 'Before 1950' },
      lineages: ['art-deco'],
      media: ['graphic', 'print', 'web-ui'],
      materiality: ['metal', 'paper'],
      density: 'balanced',
      tone: ['luxurious', 'precise'],
      motion: 'restrained',
      regions: ['europe', 'north-america'],
      maturity: 'canonical'
    },
    tokens: {
      background: '#15120E', surface: '#231D16', surfaceSubtle: '#33281C', border: '#D6B55C',
      text: '#FFF4D6', textMuted: '#D5C49B', accent: '#E1C36B', accentSecondary: '#C96D2D',
      radius: '0px', borderWidth: '2px', shadow: '0 12px 30px rgba(0, 0, 0, 0.42)',
      fontFamily: "'Cinzel', Georgia, serif", glow: '0 0 18px rgba(225, 195, 107, 0.18)'
    },
    preview: { rendererId: 'art-deco', thumbnailId: 'deco-sunburst', motionId: 'fan-reveal' },
    defaultTweaks: { borderRadius: 0, borderWidth: 2, shadowDepth: 10, backdropBlur: 0, glowIntensity: 0.2 },
    palette: [
      swatch('lacquer-black', '래커 검정', 'Lacquer Black', '#15120E', '대칭 배경'),
      swatch('champagne-gold', '샴페인 금색', 'Champagne Gold', '#E1C36B', '프레임과 선버스트'),
      swatch('ivory-letter', '아이보리 활자', 'Ivory Letter', '#FFF4D6', '제목과 본문'),
      swatch('machine-copper', '기계 구리색', 'Machine Copper', '#C96D2D', '보조 강조')
    ],
    editorial: {
      moodTags: ['대칭', '선버스트', '머신 에이지', '럭셔리'],
      characteristics: ['중앙 대칭 축과 계단형 외곽선', '부채꼴·선버스트 반복', '검정·금색의 제한된 금속성 대비'],
      pros: ['브랜드와 행사 화면에 의식적인 고급감을 부여한다.', '사진 없이도 기하 프레임으로 강한 무대를 만든다.'],
      cons: ['장식선이 촘촘하면 작은 화면에서 정보보다 패턴이 우세해질 수 있다.'],
      accessibilityNotes: ['금색 장식은 의미 전달에 사용하지 않고 본문은 불투명 어두운 면 위 아이보리로 유지한다.']
    },
    source: {
      title: 'An introduction to Art Deco',
      publisher: 'Victoria and Albert Museum',
      url: 'https://www.vam.ac.uk/articles/an-introduction-to-art-deco',
      sourceType: 'institutional'
    }
  }),
  defineStyle({
    id: 'psychedelic-poster',
    categoryId: 'retro',
    order: 330,
    name: { ko: '사이키델릭 포스터', en: 'Psychedelic Poster' },
    summary: { ko: '휘어진 전시 타이포와 반복 광학 곡선, 강한 보색으로 카운터컬처 포스터의 밀도를 재해석한 화면' },
    classification: {
      kind: 'revival',
      era: { start: 1965, end: 1975, label: '1950s–1970s' },
      lineages: ['psychedelia', 'postmodernism'],
      media: ['graphic', 'print', 'web-ui'],
      materiality: ['paper', 'ink'],
      density: 'maximal',
      tone: ['immersive', 'energetic'],
      motion: 'expressive',
      regions: ['north-america', 'europe'],
      maturity: 'established'
    },
    tokens: {
      background: '#241044', surface: '#34165A', surfaceSubtle: '#492271', border: '#F7C948',
      text: '#FFF5D6', textMuted: '#D7C5E8', accent: '#FF6A00', accentSecondary: '#63E6BE',
      radius: '26px', borderWidth: '3px', shadow: '8px 10px 0 #0E8F80',
      fontFamily: "Georgia, 'Arial Black', serif", glow: '0 0 20px rgba(255, 106, 0, 0.28)'
    },
    preview: { rendererId: 'psychedelic-poster', thumbnailId: 'optical-waves', motionId: 'poster-warp' },
    defaultTweaks: { borderRadius: 26, borderWidth: 3, shadowDepth: 8, backdropBlur: 0, glowIntensity: 0.3 },
    palette: [
      swatch('night-violet', '밤 보라', 'Night Violet', '#241044', '포스터 바탕'),
      swatch('tangerine-wave', '귤색 파동', 'Tangerine Wave', '#FF6A00', '왜곡 타이포'),
      swatch('mint-counter', '민트 보색', 'Mint Counter', '#63E6BE', '광학 곡선'),
      swatch('sun-yellow', '태양 노랑', 'Sun Yellow', '#F7C948', '경계와 날짜')
    ],
    editorial: {
      moodTags: ['광학', '카운터컬처', '왜곡 활자', '보색'],
      characteristics: ['반복되는 동심 곡선과 파동', '윤곽을 따라 휘는 전시 타이포', '보라·주황·민트의 강한 보색'],
      pros: ['행사와 문화 콘텐츠에 높은 시각적 에너지를 부여한다.', '배경·타이포·테두리가 하나의 포스터 구조로 결합된다.'],
      cons: ['왜곡과 고밀도 패턴은 긴 본문과 다단계 작업에 적합하지 않다.'],
      accessibilityNotes: ['왜곡 타이포는 짧은 장식 제목에만 사용하고 동일 문구의 직선형 실제 heading을 접근 가능한 이름으로 제공한다.']
    },
    source: {
      title: 'Art of Noise',
      publisher: 'Cooper Hewitt, Smithsonian Design Museum',
      url: 'https://www.cooperhewitt.org/2025/09/10/art-of-noise-exhibition-tracing-history-of-music-and-design-to-open-at-cooper-hewitt/',
      sourceType: 'institutional'
    }
  }),
  defineStyle({
    id: 'art-nouveau',
    categoryId: 'editorial',
    order: 340,
    name: { ko: '아르누보 휩래시', en: 'Art Nouveau Whiplash' },
    summary: { ko: '식물 줄기에서 파생된 S곡선과 세로 장식 프레임으로 콘텐츠를 감싸는 유기적 에디토리얼' },
    classification: {
      kind: 'historical-movement',
      era: { start: 1890, end: 1914, label: 'Before 1950' },
      lineages: ['art-nouveau', 'editorial'],
      media: ['graphic', 'print', 'web-ui'],
      materiality: ['organic', 'paper'],
      density: 'balanced',
      tone: ['organic', 'luxurious'],
      motion: 'restrained',
      regions: ['europe'],
      maturity: 'canonical'
    },
    tokens: {
      background: '#F3E7D5', surface: '#FFF8EA', surfaceSubtle: '#DDE4CF', border: '#376147',
      text: '#203A2D', textMuted: '#52665A', accent: '#356B4B', accentSecondary: '#9A3F58',
      radius: '18px', borderWidth: '2px', shadow: '0 12px 28px rgba(32, 58, 45, 0.16)',
      fontFamily: "Georgia, 'Times New Roman', serif", glow: 'none'
    },
    preview: { rendererId: 'art-nouveau', thumbnailId: 'whiplash-frame', motionId: 'vine-trace' },
    defaultTweaks: { borderRadius: 18, borderWidth: 2, shadowDepth: 6, backdropBlur: 0, glowIntensity: 0 },
    palette: [
      swatch('parchment', '양피지', 'Parchment', '#F3E7D5', '세로 배경'),
      swatch('stem-green', '줄기 녹색', 'Stem Green', '#356B4B', 'S곡선 프레임'),
      swatch('petal-rose', '꽃잎 장미색', 'Petal Rose', '#9A3F58', '꽃봉오리 강조'),
      swatch('leaf-ink', '잎 잉크', 'Leaf Ink', '#203A2D', '본문과 윤곽')
    ],
    editorial: {
      moodTags: ['식물', 'S곡선', '장식 프레임', '파스텔'],
      characteristics: ['식물 줄기형 휩래시 곡선', '세로로 긴 장식 경계', '비대칭 꽃과 잎 패턴'],
      pros: ['문화·공예·스토리 콘텐츠에 서정적인 프레임을 제공한다.', '현대적 blob과 다른 선 중심의 유기 문법이 선명하다.'],
      cons: ['장식 프레임이 입력 폼이나 고밀도 표의 가용 폭을 줄일 수 있다.'],
      accessibilityNotes: ['식물 선은 aria-hidden 장식으로 두고 작은 화면에서는 프레임을 단순화해 본문 폭과 44px 조작 영역을 보존한다.']
    },
    source: {
      title: 'The Whiplash',
      publisher: 'Victoria and Albert Museum',
      url: 'https://www.vam.ac.uk/articles/the-whiplash',
      sourceType: 'institutional'
    }
  }),
  defineStyle({
    id: 'risograph',
    categoryId: 'editorial',
    order: 350,
    name: { ko: '리소그래프 에디토리얼', en: 'Risograph Editorial' },
    summary: { ko: '두세 개 별색의 하프톤·잉크 중첩·미세한 판 어긋남을 종이 바탕 위에 드러내는 인쇄형 편집 UI' },
    classification: {
      kind: 'technique',
      era: { start: 1980, end: 2026, label: '1980s–present' },
      lineages: ['risograph-print', 'editorial'],
      media: ['graphic', 'print', 'web-ui'],
      materiality: ['paper', 'ink'],
      density: 'dense',
      tone: ['playful', 'tactile'],
      motion: 'expressive',
      regions: ['east-asia', 'international'],
      maturity: 'established'
    },
    tokens: {
      background: '#F4EAD4', surface: '#FFF8E8', surfaceSubtle: '#E5D6B8', border: '#334759',
      text: '#172B40', textMuted: '#526273', accent: '#D92E5B', accentSecondary: '#00788A',
      radius: '2px', borderWidth: '2px', shadow: '5px 5px 0 rgba(0, 120, 138, 0.42)',
      fontFamily: "'Arial Narrow', 'Helvetica Neue', sans-serif", glow: 'none'
    },
    preview: { rendererId: 'risograph', thumbnailId: 'riso-overprint', motionId: 'ink-drift' },
    defaultTweaks: { borderRadius: 2, borderWidth: 2, shadowDepth: 5, backdropBlur: 0, glowIntensity: 0 },
    palette: [
      swatch('uncoated-paper', '비코팅 종이', 'Uncoated Paper', '#F4EAD4', '종이 바탕'),
      swatch('fluoro-pink', '형광 분홍', 'Fluoro Pink', '#D92E5B', '첫 번째 별색'),
      swatch('riso-teal', '리소 청록', 'Riso Teal', '#00788A', '두 번째 별색'),
      swatch('overprint-navy', '중첩 남색', 'Overprint Navy', '#172B40', '잉크 중첩과 본문')
    ],
    editorial: {
      moodTags: ['별색', '하프톤', '판 어긋남', '독립 출판'],
      characteristics: ['두 색 잉크의 중첩 영역', '도트 하프톤과 종이 여백', '1–2px의 통제된 판 어긋남'],
      pros: ['한정된 팔레트로도 풍부한 중첩색과 촉감을 만든다.', '독립 출판·행사·문화 콘텐츠에 인쇄 정체성을 준다.'],
      cons: ['어긋남 효과를 본문에 적용하면 글자 가장자리가 흐려질 수 있다.'],
      accessibilityNotes: ['판 어긋남은 aria-hidden 장식 복제에만 적용하고 실제 텍스트와 focus outline은 단일 색으로 선명하게 유지한다.']
    },
    source: {
      title: 'Digital Duplicator',
      publisher: 'RISO KAGAKU CORPORATION',
      url: 'https://www.riso.co.jp/english/product/digital_dup/index.html',
      sourceType: 'primary'
    }
  }),
  defineStyle({
    id: 'metro-interface',
    categoryId: 'hypertech',
    order: 360,
    name: { ko: '메트로 타일 인터페이스', en: 'Metro Tile Interface' },
    summary: { ko: '화면 끝까지 이어지는 큰 타이포와 평면 타일, 수평 파노라마로 콘텐츠를 전면에 놓는 인터페이스 언어' },
    classification: {
      kind: 'interface-language',
      era: { start: 2006, end: 2015, label: '2000s–2010s' },
      lineages: ['microsoft-design', 'minimalism'],
      media: ['web-ui', 'product-ui'],
      materiality: ['flat', 'screen'],
      density: 'balanced',
      tone: ['energetic', 'precise'],
      motion: 'expressive',
      regions: ['international'],
      maturity: 'established'
    },
    tokens: {
      background: '#101820', surface: '#1D2933', surfaceSubtle: '#263746', border: '#72808C',
      text: '#FFFFFF', textMuted: '#BBC5CC', accent: '#0078D4', accentSecondary: '#C43E00',
      radius: '0px', borderWidth: '1px', shadow: 'none',
      fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif", glow: 'none'
    },
    preview: { rendererId: 'metro-interface', thumbnailId: 'typographic-tiles', motionId: 'tile-panorama' },
    defaultTweaks: { borderRadius: 0, borderWidth: 1, shadowDepth: 0, backdropBlur: 0, glowIntensity: 0 },
    palette: [
      swatch('panorama-ink', '파노라마 잉크', 'Panorama Ink', '#101820', '화면 배경'),
      swatch('metro-blue', '메트로 파랑', 'Metro Blue', '#0078D4', '주요 타일'),
      swatch('signal-orange', '신호 주황', 'Signal Orange', '#C43E00', '보조 타일과 알림'),
      swatch('type-white', '활자 백색', 'Type White', '#FFFFFF', '대형 제목과 아이콘')
    ],
    editorial: {
      moodTags: ['타일', '파노라마', '대형 타이포', '콘텐츠 중심'],
      characteristics: ['모서리 없는 edge-to-edge 타일', '화면 경계를 넘어 이어지는 큰 제목', '수평 이동으로 연결되는 콘텐츠 그룹'],
      pros: ['터치 환경에서 정보 그룹과 조작 영역이 크게 드러난다.', '사진 없이도 타이포와 타일 비율로 강한 인터페이스를 만든다.'],
      cons: ['수평 파노라마가 문서 스크롤과 충돌하면 탐색 방향이 모호해질 수 있다.'],
      accessibilityNotes: ['수평 파노라마에는 이전·다음 버튼과 위치 레이블을 제공하고 키보드 포커스가 화면 밖으로 이동하지 않게 한다.']
    },
    source: {
      title: 'Designing Metro style: principles and personality',
      publisher: 'Microsoft Learn',
      url: 'https://learn.microsoft.com/en-us/shows/build-build2011/app-395t',
      sourceType: 'primary'
    }
  })
]);
