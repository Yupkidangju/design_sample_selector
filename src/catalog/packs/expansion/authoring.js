import { CATALOG_SCHEMA_VERSION, deepFreeze } from '../../contract.js';

const REVIEWED_AT = '2026-08-31';
const EMPTY_ASSETS = Object.freeze([]);

function source(title, publisher, url, sourceType = 'institutional') {
  return { title, publisher, url, sourceType };
}

/**
 * 21개 문법은 분류·타입·재질·출처·접근성 원칙을 소유한다.
 * 시안별 이름·색·요약·모티프는 각 팩의 명시 blueprint가 소유한다.
 */
export const EXPANSION_GRAMMARS = deepFreeze({
  'rational-grid': {
    label: 'Rational Grid', layout: 'grid', dark: false,
    classification: {
      kind: 'historical-movement', era: { start: 1950, end: 1975, label: '1950s–1970s' },
      lineages: ['modernism', 'international-style', 'grid-systems'], media: ['graphic', 'print', 'web-ui'],
      materiality: ['flat'], density: 'balanced', tone: ['rational', 'precise'], motion: 'restrained',
      regions: ['europe', 'international'], maturity: 'canonical'
    },
    radius: 0, borderWidth: 2, shadowDepth: 0, fontFamily: "'Helvetica Neue', Arial, sans-serif",
    characteristics: ['엄격한 기준선과 비대칭 모듈', '크기·굵기·정렬로 만드는 정보 위계'],
    pros: '긴 정보도 예측 가능한 구조로 빠르게 스캔할 수 있다.',
    cons: '모듈 규칙을 과도하게 적용하면 개별 콘텐츠의 성격이 약해질 수 있다.',
    accessibility: '작은 보조 문자는 12px 이상과 4.5:1 대비를 유지하고 그리드 위치만으로 의미를 전달하지 않는다.',
    source: source('What was Modernism?', 'Victoria and Albert Museum', 'https://www.vam.ac.uk/articles/what-was-modernism')
  },
  'sparse-axis': {
    label: 'Sparse Axis', layout: 'axis', dark: false,
    classification: {
      kind: 'interface-language', era: { start: 1955, end: 2026, label: '1950s–present' },
      lineages: ['modernism', 'minimalism', 'grid-systems'], media: ['graphic', 'product-ui', 'web-ui'],
      materiality: ['flat'], density: 'sparse', tone: ['rational', 'precise'], motion: 'restrained',
      regions: ['international', 'east-asia', 'europe'], maturity: 'established'
    },
    radius: 4, borderWidth: 1, shadowDepth: 0, fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    characteristics: ['한 개의 강한 축과 넓은 여백', '표지·번호·방향을 연결하는 절제된 신호'],
    pros: '주의를 분산시키지 않고 한 번에 하나의 행동을 강조한다.',
    cons: '정보량이 많아지면 넓은 여백이 긴 스크롤로 바뀔 수 있다.',
    accessibility: '여백과 정렬만으로 그룹을 구분하지 않고 제목·구분선·랜드마크를 함께 제공한다.',
    source: source('How Posters Work', 'Cooper Hewitt, Smithsonian Design Museum', 'https://www.cooperhewitt.org/wp-content/uploads/2015/02/Final-How-Posters-Work-Release-4-30-15.pdf')
  },
  'symbol-collage': {
    label: 'Symbol Collage', layout: 'symbols', dark: false,
    classification: {
      kind: 'technique', era: { start: 1916, end: 2026, label: '20th century–present' },
      lineages: ['modernism', 'postmodernism'], media: ['graphic', 'print', 'web-ui'], materiality: ['paper', 'ink'],
      density: 'dense', tone: ['rebellious', 'energetic'], motion: 'expressive', regions: ['europe', 'international'], maturity: 'canonical'
    },
    radius: 0, borderWidth: 3, shadowDepth: 6, fontFamily: "Impact, 'Arial Black', sans-serif",
    characteristics: ['기호·사진 자리·활자 조각의 충돌', '회전과 중첩을 이용한 비선형 시선 흐름'],
    pros: '짧은 메시지와 문화적 태도를 강하게 각인한다.',
    cons: '중첩이 많으면 실제 조작 요소가 장식에 묻힐 수 있다.',
    accessibility: '회전 장식과 별개로 실제 본문은 수평 DOM 순서를 유지하고 버튼에는 명시적 텍스트를 둔다.',
    source: source('The modern poster', 'The Museum of Modern Art', 'https://www.moma.org/documents/moma_catalogue_1804_300074240.pdf')
  },
  'distressed-stack': {
    label: 'Distressed Stack', layout: 'stack', dark: true,
    classification: {
      kind: 'technique', era: { start: 1975, end: 2026, label: 'Late 20th century–present' },
      lineages: ['brutalism', 'punk-diy', 'postmodernism'], media: ['graphic', 'print', 'web-ui'], materiality: ['paper', 'ink'],
      density: 'dense', tone: ['rebellious', 'tactile'], motion: 'expressive', regions: ['north-america', 'europe', 'global-internet'], maturity: 'established'
    },
    radius: 0, borderWidth: 3, shadowDepth: 8, fontFamily: "'Arial Black', Impact, sans-serif",
    characteristics: ['마모된 활자와 복사 노이즈의 층', '거친 경계와 압축된 수직 스택'],
    pros: '완벽하지 않은 물성과 반항적 태도를 즉시 전달한다.',
    cons: '질감이 실제 글자 획을 침범하면 가독성이 급격히 낮아진다.',
    accessibility: '노이즈는 장식 레이어로 제한하고 본문 글리프와 포커스 외곽선에는 적용하지 않는다.',
    source: source('What is Postmodernism?', 'Victoria and Albert Museum', 'https://www.vam.ac.uk/articles/what-is-postmodernism')
  },
  'fractured-panels': {
    label: 'Fractured Panels', layout: 'fracture', dark: true,
    classification: {
      kind: 'microtrend', era: { start: 1980, end: 2026, label: '1980s–present' },
      lineages: ['brutalism', 'postmodernism'], media: ['graphic', 'web-ui', 'product-ui'], materiality: ['flat', 'screen'],
      density: 'maximal', tone: ['rebellious', 'immersive'], motion: 'intense', regions: ['global-internet', 'international'], maturity: 'experimental'
    },
    radius: 2, borderWidth: 3, shadowDepth: 10, fontFamily: "'Fira Code', monospace",
    characteristics: ['엇갈린 패널과 비정상적인 크기 대비', '절단선·스캔선·과밀한 상태 정보'],
    pros: '위험·속도·혼돈이 핵심인 장면을 높은 에너지로 표현한다.',
    cons: '동시 강조가 많으면 핵심 행동을 찾는 시간이 길어진다.',
    accessibility: '번쩍임은 사용하지 않고 움직임은 transform 중심으로 제한하며 reduced-motion에서 완전히 정지한다.',
    source: source('Post-war design: an introduction', 'Victoria and Albert Museum', 'https://www.vam.ac.uk/articles/post-war-design-an-introduction')
  },
  'material-layers': {
    label: 'Material Layers', layout: 'layers', dark: false, backdropBlur: 18,
    classification: {
      kind: 'interface-language', era: { start: 2015, end: 2026, label: '2010s–2020s' },
      lineages: ['skeuomorphism', 'microsoft-design'], media: ['product-ui', 'web-ui'], materiality: ['glass', 'metal'],
      density: 'balanced', tone: ['professional', 'futuristic'], motion: 'restrained', regions: ['international'], maturity: 'established'
    },
    radius: 18, borderWidth: 1, shadowDepth: 18, fontFamily: "'Inter', sans-serif",
    characteristics: ['반투명 재질의 깊이 순서와 가장자리 하이라이트', '콘텐츠와 제어면을 분리하는 재질 대비'],
    pros: '레이어의 앞뒤 관계와 활성 영역을 자연스럽게 설명한다.',
    cons: '배경이 복잡하면 투명 표면의 텍스트 대비가 불안정해진다.',
    accessibility: '텍스트 아래에는 불투명 백플레이트를 두고 투명도만으로 활성 상태를 구분하지 않는다.',
    source: source('Material — Fluent 2', 'Microsoft', 'https://fluent2.microsoft.design/material', 'industry')
  },
  'dimensional-mesh': {
    label: 'Dimensional Mesh', layout: 'mesh', dark: true,
    classification: {
      kind: 'technique', era: { start: 2018, end: 2026, label: '2020s' },
      lineages: ['retrofuturism', 'organic-modernism'], media: ['three-d', 'web-ui', 'illustration'], materiality: ['plastic', 'metal', 'screen'],
      density: 'balanced', tone: ['futuristic', 'immersive'], motion: 'expressive', regions: ['international'], maturity: 'emerging'
    },
    radius: 22, borderWidth: 1, shadowDepth: 20, fontFamily: "'Space Grotesk', sans-serif",
    characteristics: ['빛을 받는 메시와 부피 있는 중심 오브젝트', '원근·반사·그라디언트로 만든 공간감'],
    pros: '무형 서비스에 촉각적이고 기억하기 쉬운 상징을 부여한다.',
    cons: '광택과 색 변화가 과하면 데이터보다 장면 자체가 앞선다.',
    accessibility: '3D 오브젝트는 장식으로 처리하고 핵심 정보는 평면 텍스트와 명시적 버튼으로 반복한다.',
    source: source('Beauty—Cooper Hewitt Design Triennial', 'Cooper Hewitt, Smithsonian Design Museum', 'https://www.cooperhewitt.org/exhibitions/beauty-cooper-hewitt-design-triennial/')
  },
  'print-relief': {
    label: 'Print Relief', layout: 'relief', dark: false,
    classification: {
      kind: 'historical-movement', era: { start: 1945, end: 1975, label: 'Mid-century' },
      lineages: ['modernism', 'editorial'], media: ['print', 'graphic', 'web-ui'], materiality: ['paper', 'ink'],
      density: 'balanced', tone: ['tactile', 'nostalgic'], motion: 'restrained', regions: ['north-america', 'europe'], maturity: 'canonical'
    },
    radius: 3, borderWidth: 2, shadowDepth: 5, fontFamily: "Georgia, 'Times New Roman', serif",
    characteristics: ['인쇄 압력·망점·종이 결을 암시하는 면', '짧은 헤드라인과 도판형 색 블록'],
    pros: '디지털 화면에도 편집물의 온도와 수집 가치를 더한다.',
    cons: '의도적 어긋남을 작은 본문에 적용하면 저해상도처럼 보일 수 있다.',
    accessibility: '망점과 압인 효과는 큰 면에만 적용하고 작은 텍스트는 단색으로 유지한다.',
    source: source('The modern poster', 'The Museum of Modern Art', 'https://www.moma.org/documents/moma_catalogue_1804_300074240.pdf')
  },
  'optical-stage': {
    label: 'Optical Stage', layout: 'optical', dark: true,
    classification: {
      kind: 'historical-movement', era: { start: 1960, end: 1979, label: '1960s–1970s' },
      lineages: ['postmodernism', 'psychedelia', 'retrofuturism'], media: ['graphic', 'print', 'web-ui'], materiality: ['flat', 'screen'],
      density: 'maximal', tone: ['energetic', 'immersive'], motion: 'expressive', regions: ['europe', 'north-america'], maturity: 'canonical'
    },
    radius: 24, controlRadius: 12, pillRadius: 999, borderWidth: 2, shadowDepth: 12, fontFamily: "'Arial Black', sans-serif",
    characteristics: ['반복 파형·방사선·동심원의 착시 무대', '극단적인 색 대비와 곡선 타이포'],
    pros: '음악·이벤트·문화 콘텐츠에 강한 리듬과 장면성을 준다.',
    cons: '고주파 패턴은 시각 피로와 멀미를 유발할 수 있다.',
    accessibility: '착시 패턴의 대비와 반복 속도를 낮추고 사용자 제어 없이 자동 회전시키지 않는다.',
    source: source('The maximal sixties', 'The Museum of Modern Art', 'https://www.moma.org/documents/moma_catalogue_231_300013697.pdf')
  },
  'broadcast-grid': {
    label: 'Broadcast Grid', layout: 'broadcast', dark: true,
    classification: {
      kind: 'revival', era: { start: 1978, end: 1995, label: '1980s–1990s' },
      lineages: ['postmodernism', 'retrofuturism', 'grid-systems'], media: ['graphic', 'product-ui', 'web-ui'], materiality: ['screen', 'pixel'],
      density: 'dense', tone: ['energetic', 'nostalgic'], motion: 'expressive', regions: ['north-america', 'europe', 'global-internet'], maturity: 'established'
    },
    radius: 4, borderWidth: 2, shadowDepth: 10, fontFamily: "'Fira Code', monospace",
    characteristics: ['방송 자막·채널 패널·CRT 프레임의 조합', '대각 색 띠와 디지털 카운터'],
    pros: '시간 기반 콘텐츠와 여러 상태를 활기차게 묶는다.',
    cons: '장식성 자막이 실제 알림과 경쟁할 수 있다.',
    accessibility: '흐르는 자막은 정지 제어를 제공하고 상태 정보는 aria-live를 과용하지 않는다.',
    source: source('Post-war design: an introduction', 'Victoria and Albert Museum', 'https://www.vam.ac.uk/articles/post-war-design-an-introduction')
  },
  'editorial-ledger': {
    label: 'Editorial Ledger', layout: 'ledger', dark: false,
    classification: {
      kind: 'interface-language', era: { start: 1850, end: 2026, label: 'Print tradition–present' },
      lineages: ['editorial', 'grid-systems', 'minimalism'], media: ['print', 'graphic', 'web-ui'], materiality: ['paper', 'ink'],
      density: 'dense', tone: ['precise', 'professional'], motion: 'none', regions: ['international'], maturity: 'canonical'
    },
    radius: 0, borderWidth: 1, shadowDepth: 2, fontFamily: "Georgia, 'Times New Roman', serif",
    characteristics: ['다단 편집 그리드와 가는 규칙선', '캡션·각주·문서 번호의 체계적 위계'],
    pros: '텍스트와 메타데이터가 많은 콘텐츠를 신뢰감 있게 정리한다.',
    cons: '모바일에서 다단 구조를 그대로 축소하면 읽기 폭이 지나치게 좁아진다.',
    accessibility: '모바일에서는 단일 열로 재배치하고 시각적 열 순서와 DOM 읽기 순서를 일치시킨다.',
    source: source('How Posters Work', 'Cooper Hewitt, Smithsonian Design Museum', 'https://www.cooperhewitt.org/wp-content/uploads/2015/02/Final-How-Posters-Work-Release-4-30-15.pdf')
  },
  'tactile-editorial': {
    label: 'Tactile Editorial', layout: 'tactile', dark: false,
    classification: {
      kind: 'technique', era: { start: 1900, end: 2026, label: '20th century–present' },
      lineages: ['editorial', 'organic-modernism', 'indie-craft'], media: ['print', 'illustration', 'web-ui'], materiality: ['paper', 'organic', 'ink'],
      density: 'balanced', tone: ['tactile', 'organic'], motion: 'restrained', regions: ['international', 'east-asia'], maturity: 'established'
    },
    radius: 8, borderWidth: 1, shadowDepth: 6, fontFamily: "Georgia, 'Times New Roman', serif",
    characteristics: ['종이 가장자리·식물 표본·손으로 배치한 캡션', '불균일한 여백과 차분한 자연색'],
    pros: '브랜드에 인간적인 온도와 편집자의 관점을 더한다.',
    cons: '질감 레이어가 누적되면 이미지와 텍스트의 경계가 흐려진다.',
    accessibility: '장식 표본에는 빈 대체 텍스트를 사용하고 핵심 이미지에는 구체적인 설명을 제공한다.',
    source: source('Design 1900–Now', 'Victoria and Albert Museum', 'https://www.vam.ac.uk/articles/design-1900-now')
  },
  'portal-frame': {
    label: 'Portal Frame', layout: 'portal', dark: false,
    classification: {
      kind: 'revival', era: { start: 1991, end: 2003, label: '1990s–early 2000s' },
      lineages: ['cyberculture', 'postmodernism'], media: ['web-ui', 'graphic'], materiality: ['screen', 'pixel'],
      density: 'maximal', tone: ['nostalgic', 'playful'], motion: 'expressive', regions: ['global-internet'], maturity: 'established'
    },
    radius: 0, borderWidth: 2, shadowDepth: 4, fontFamily: "Verdana, Arial, sans-serif",
    characteristics: ['테이블형 프레임·배너·링크 디렉터리', '작은 배지와 선명한 브라우저 기본색'],
    pros: '많은 경로와 커뮤니티 콘텐츠를 한 화면에 발견 가능하게 만든다.',
    cons: '모든 요소가 링크처럼 보이면 우선순위와 신뢰 단서가 약해진다.',
    accessibility: '링크는 밑줄을 유지하고 marquee·자동 재생 요소는 정지 가능하거나 정적으로 대체한다.',
    source: source('Happy Birthday, Web!', 'Library of Congress', 'https://blogs.loc.gov/thesignal/2014/03/happy-birthday-web/', 'archive')
  },
  'glossy-window': {
    label: 'Glossy Window', layout: 'window', dark: false,
    classification: {
      kind: 'revival', era: { start: 2001, end: 2009, label: '2000s' },
      lineages: ['skeuomorphism', 'cyberculture'], media: ['product-ui', 'web-ui'], materiality: ['glass', 'plastic', 'screen'],
      density: 'balanced', tone: ['friendly', 'optimistic'], motion: 'expressive', regions: ['global-internet', 'international'], maturity: 'established'
    },
    radius: 16, borderWidth: 2, shadowDepth: 16, fontFamily: "Tahoma, Verdana, sans-serif",
    characteristics: ['광택 바·둥근 창 프레임·젤리형 버튼', '데스크톱 패널과 포털 카드의 깊이'],
    pros: '조작 가능한 요소를 물리적 표면처럼 분명하게 보이게 한다.',
    cons: '하이라이트가 많은 화면은 실제 선택 상태를 흐릴 수 있다.',
    accessibility: '광택과 입체감 외에도 버튼 텍스트·테두리·focus-visible로 조작 가능성을 반복한다.',
    source: source('Digital Archaeology on Display', 'Library of Congress', 'https://blogs.loc.gov/thesignal/2011/06/digital-archaeology-on-display/', 'archive')
  },
  'chrome-pop': {
    label: 'Chrome Pop', layout: 'chrome', dark: true,
    classification: {
      kind: 'microtrend', era: { start: 1998, end: 2010, label: '2000s' },
      lineages: ['cyberculture', 'retrofuturism', 'postmodernism'], media: ['graphic', 'web-ui', 'illustration'], materiality: ['metal', 'plastic', 'screen'],
      density: 'maximal', tone: ['playful', 'luxurious'], motion: 'expressive', regions: ['global-internet', 'north-america'], maturity: 'emerging'
    },
    radius: 24, controlRadius: 16, pillRadius: 999, borderWidth: 2, shadowDepth: 18, fontFamily: "'Arial Black', sans-serif",
    characteristics: ['크롬 타이포·별빛·스티커형 배지', '고채도 분홍과 전기색의 과장된 광택'],
    pros: '패션·음악·팬덤 콘텐츠에 즉각적인 시대성과 유희성을 준다.',
    cons: '반사색이 텍스트 획과 겹치면 낮은 대비처럼 보일 수 있다.',
    accessibility: '크롬 문자는 큰 제목에만 쓰고 본문과 버튼은 단색 고대비 면으로 분리한다.',
    source: source('Web Archives', 'Library of Congress', 'https://www.loc.gov/programs/web-archiving/web-archives?st=grid', 'archive')
  },
  'terminal-hud': {
    label: 'Terminal HUD', layout: 'terminal', dark: true,
    classification: {
      kind: 'interface-language', era: { start: 1980, end: 2026, label: '1980s–present' },
      lineages: ['cyberculture', 'retrofuturism'], media: ['product-ui', 'web-ui', 'graphic'], materiality: ['screen', 'glass'],
      density: 'dense', tone: ['futuristic', 'immersive'], motion: 'expressive', regions: ['global-internet', 'international'], maturity: 'established'
    },
    radius: 2, borderWidth: 1, shadowDepth: 10, fontFamily: "'Fira Code', monospace",
    characteristics: ['모노스페이스 로그·좌표선·상태 브래킷', '어두운 화면 위 단일 신호색과 스캔 레이어'],
    pros: '실시간 상태와 명령 흐름을 정밀하고 몰입감 있게 표현한다.',
    cons: '장식용 숫자와 실제 데이터가 섞이면 해석 비용이 커진다.',
    accessibility: '로그 영역은 실제 읽기 순서를 유지하고 깜박이는 caret은 reduced-motion에서 정지한다.',
    source: source('Material — Fluent 2', 'Microsoft', 'https://fluent2.microsoft.design/material', 'industry')
  },
  'data-stream': {
    label: 'Data Stream', layout: 'data', dark: true,
    classification: {
      kind: 'interface-language', era: { start: 2010, end: 2026, label: '2010s–2020s' },
      lineages: ['grid-systems', 'cyberculture'], media: ['product-ui', 'web-ui'], materiality: ['screen', 'flat'],
      density: 'dense', tone: ['precise', 'professional'], motion: 'restrained', regions: ['international'], maturity: 'established'
    },
    radius: 6, borderWidth: 1, shadowDepth: 8, fontFamily: "'Inter', sans-serif",
    characteristics: ['수치 카드·시계열·이상 신호의 계층', '고정 컬럼과 반복 가능한 데이터 모듈'],
    pros: '많은 지표를 비교하면서도 변화와 예외를 빠르게 찾게 한다.',
    cons: '장식 차트가 늘면 데이터-잉크 비율과 판단 속도가 떨어진다.',
    accessibility: '차트 색에는 직접 레이블·패턴·수치 표를 함께 제공하고 색만으로 상태를 구분하지 않는다.',
    source: source('Getting started — Data visualization', 'IBM Carbon Design System', 'https://carbondesignsystem.com/data-visualization/getting-started/', 'industry')
  },
  'spatial-orbit': {
    label: 'Spatial Orbit', layout: 'spatial', dark: true, backdropBlur: 22,
    classification: {
      kind: 'speculative', era: { start: 2023, end: 2026, label: '2020s' },
      lineages: ['retrofuturism', 'minimalism'], media: ['product-ui', 'three-d', 'web-ui'], materiality: ['glass', 'screen'],
      density: 'balanced', tone: ['futuristic', 'immersive'], motion: 'restrained', regions: ['international'], maturity: 'emerging'
    },
    radius: 24, borderWidth: 1, shadowDepth: 22, fontFamily: "'Inter', sans-serif",
    characteristics: ['중심 초점과 주변 궤도형 제어', '깊이·크기·시선 방향으로 만든 공간 위계'],
    pros: '복잡한 미래형 도구를 하나의 공간적 장면으로 이해하게 한다.',
    cons: '부유 요소가 너무 많으면 고정된 기준점과 탐색 위치를 잃기 쉽다.',
    accessibility: '깊이와 위치 외에 텍스트 레이블을 제공하고 머리 움직임 없이도 모든 기능에 접근 가능하게 한다.',
    source: source('Spatial layout', 'Apple Human Interface Guidelines', 'https://developer.apple.com/design/human-interface-guidelines/spatial-layout/', 'industry')
  },
  'soft-toy': {
    label: 'Soft Toy', layout: 'toy', dark: false,
    classification: {
      kind: 'interface-language', era: { start: 2018, end: 2026, label: '2020s' },
      lineages: ['skeuomorphism', 'postmodernism'], media: ['three-d', 'illustration', 'web-ui'], materiality: ['plastic', 'clay'],
      density: 'balanced', tone: ['friendly', 'playful'], motion: 'expressive', regions: ['international', 'east-asia'], maturity: 'established'
    },
    radius: 28, borderWidth: 2, shadowDepth: 14, fontFamily: "'Space Grotesk', sans-serif",
    characteristics: ['둥근 부피·말랑한 그림자·블록형 조작 요소', '장난감처럼 분리된 원색·파스텔 오브젝트'],
    pros: '처음 보는 기능도 친근하고 만져 보고 싶은 대상으로 만든다.',
    cons: '모든 요소를 크게 부풀리면 정보 밀도와 계층이 무너진다.',
    accessibility: '귀여운 형태와 별개로 버튼 크기·레이블·포커스 순서를 일관되게 유지한다.',
    source: source('Material Design 3', 'Google', 'https://m3.material.io/', 'industry')
  },
  'crafted-soft': {
    label: 'Crafted Soft', layout: 'craft', dark: false,
    classification: {
      kind: 'technique', era: { start: 2000, end: 2026, label: '2000s–present' },
      lineages: ['indie-craft', 'organic-modernism'], media: ['illustration', 'three-d', 'web-ui'], materiality: ['paper', 'organic', 'clay'],
      density: 'balanced', tone: ['tactile', 'friendly'], motion: 'restrained', regions: ['international'], maturity: 'established'
    },
    radius: 14, borderWidth: 2, shadowDepth: 8, fontFamily: "'Trebuchet MS', sans-serif",
    characteristics: ['손그림 선·접힌 종이·직물 조각의 레이어', '완만한 불규칙성과 따뜻한 중간색'],
    pros: '서비스에 제작자의 손길과 생활 친화적인 분위기를 준다.',
    cons: '불규칙한 장식이 정렬 기준을 대신하면 폼 사용성이 떨어진다.',
    accessibility: '손그림 아이콘에는 텍스트 레이블을 붙이고 질감 위 본문에는 단색 표면을 제공한다.',
    source: source('Making Home—Smithsonian Design Triennial', 'Cooper Hewitt, Smithsonian Design Museum', 'https://www.cooperhewitt.org/channel/making-home/')
  },
  'playful-organic': {
    label: 'Playful Organic', layout: 'organic', dark: false,
    classification: {
      kind: 'microtrend', era: { start: 2020, end: 2026, label: '2020s' },
      lineages: ['organic-modernism', 'postmodernism'], media: ['illustration', 'product-ui', 'web-ui'], materiality: ['organic', 'plastic'],
      density: 'balanced', tone: ['playful', 'optimistic'], motion: 'expressive', regions: ['international'], maturity: 'emerging'
    },
    radius: 32, borderWidth: 2, shadowDepth: 10, fontFamily: "'Space Grotesk', sans-serif",
    characteristics: ['유기적 얼룩·캐릭터형 지표·비정형 카드', '부드러운 색 전이와 과장된 마이크로카피'],
    pros: '일상적 데이터와 반복 작업을 가볍고 긍정적으로 느끼게 한다.',
    cons: '놀이성이 오류·위험·금융 같은 중요한 상태의 심각성을 약화할 수 있다.',
    accessibility: '성공·경고·오류는 표정이나 색뿐 아니라 명확한 문구와 아이콘 형태로 반복한다.',
    source: source('Material Design 3', 'Google', 'https://m3.material.io/', 'industry')
  }
});

export function expansionBlueprint(
  id,
  categoryId,
  grammarId,
  nameKo,
  nameEn,
  summaryKo,
  colors,
  motif,
  moodTags = []
) {
  return { id, categoryId, grammarId, name: { ko: nameKo, en: nameEn }, summary: { ko: summaryKo }, colors, motif, moodTags };
}

function paletteSwatch(id, ko, en, value, usage) {
  return { id, name: { ko, en }, value, usage: { ko: usage } };
}

function assertBlueprint(blueprint) {
  const grammar = EXPANSION_GRAMMARS[blueprint?.grammarId];
  if (!grammar) throw new TypeError(`알 수 없는 expansion grammar: ${blueprint?.grammarId}`);
  if (!Array.isArray(blueprint.colors) || blueprint.colors.length !== 5) {
    throw new TypeError(`${blueprint?.id || '<missing>'}에 5색 palette가 필요합니다.`);
  }
  return grammar;
}

function toStyleRecord(blueprint, order) {
  const grammar = assertBlueprint(blueprint);
  const [background, surface, surfaceSubtle, accent, accentSecondary] = blueprint.colors;
  const text = grammar.dark ? '#F8FAFC' : '#111827';
  const textMuted = grammar.dark ? '#CBD5E1' : '#374151';
  const border = grammar.dark ? '#E2E8F0' : '#1F2937';
  const shadow = grammar.shadowDepth > 0
    ? `0 ${Math.max(2, Math.round(grammar.shadowDepth / 2))}px ${grammar.shadowDepth * 2}px rgba(15, 23, 42, 0.28)`
    : 'none';
  const glow = grammar.dark ? `0 0 24px ${accent}66` : 'none';

  return {
    schemaVersion: CATALOG_SCHEMA_VERSION,
    id: blueprint.id,
    aliases: [],
    categoryId: blueprint.categoryId,
    order,
    publicationStatus: 'ready',
    name: blueprint.name,
    summary: blueprint.summary,
    classification: grammar.classification,
    tokens: {
      background,
      surface,
      surfaceSubtle,
      border,
      text,
      textMuted,
      accent,
      accentSecondary,
      radius: `${grammar.radius}px`,
      borderWidth: `${grammar.borderWidth}px`,
      shadow,
      fontFamily: grammar.fontFamily,
      glow
    },
    preview: {
      rendererId: blueprint.id,
      thumbnailId: `p120-${blueprint.id}`,
      motionId: `${blueprint.id}-motion`
    },
    defaultTweaks: {
      borderRadius: grammar.radius,
      borderWidth: grammar.borderWidth,
      shadowDepth: grammar.shadowDepth,
      backdropBlur: grammar.backdropBlur || 0,
      glowIntensity: grammar.dark ? 0.65 : 0
    },
    themeGeometry: {
      surfaceRadius: `${grammar.radius}px`,
      controlRadius: `${grammar.controlRadius ?? grammar.radius}px`,
      pillRadius: `${grammar.pillRadius ?? 999}px`
    },
    ...(grammar.backdropBlur ? { themeEffects: { backdropBlur: grammar.backdropBlur } } : {}),
    palette: [
      paletteSwatch('canvas', '캔버스', 'Canvas', background, '전체 배경과 여백'),
      paletteSwatch('surface', '표면', 'Surface', surface, '카드와 콘텐츠 표면'),
      paletteSwatch('signal', '주 신호색', 'Primary Signal', accent, '주요 행동과 핵심 표식'),
      paletteSwatch('counter-signal', '보조 신호색', 'Counter Signal', accentSecondary, '보조 상태와 대비 지점')
    ],
    editorial: {
      moodTags: [...blueprint.moodTags, grammar.label, blueprint.name.ko],
      characteristics: [...grammar.characteristics, blueprint.motif],
      pros: [grammar.pros, `${blueprint.name.ko}의 고유 팔레트와 모티프로 유사 시안과 빠르게 구별된다.`],
      cons: [grammar.cons],
      accessibilityNotes: [grammar.accessibility]
    },
    provenance: {
      reviewedAt: REVIEWED_AT,
      sources: [{ ...grammar.source, accessedAt: REVIEWED_AT }],
      assets: EMPTY_ASSETS
    }
  };
}

/** 팩 데이터·manifest·preview blueprint를 하나의 검증 가능한 단위로 만든다. */
export function defineExpansionPack({ id, order, startOrder, title, blueprints }) {
  if (!Array.isArray(blueprints) || blueprints.length !== 12) {
    throw new TypeError(`${id || '<missing>'} 팩은 정확히 12개 blueprint가 필요합니다.`);
  }
  const ids = blueprints.map(blueprint => blueprint.id);
  if (new Set(ids).size !== ids.length) throw new TypeError(`${id} 팩의 style ID가 중복됩니다.`);

  const normalizedBlueprints = blueprints.map((blueprint, index) => {
    assertBlueprint(blueprint);
    return { ...blueprint, variant: index % 4, order: startOrder + index * 10 };
  });
  const styles = normalizedBlueprints.map(blueprint => toStyleRecord(blueprint, blueprint.order));

  return deepFreeze({
    manifest: {
      schemaVersion: CATALOG_SCHEMA_VERSION,
      id,
      version: '1.0.0',
      order,
      title,
      styleIds: ids
    },
    blueprints: normalizedBlueprints,
    styles
  });
}
