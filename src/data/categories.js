/**
 * Master Dataset for Web Design Sample Selector v2.0
 * 8 Main Categories & 24 Subcategories
 * Includes rich color palettes, tags, characteristics, pros/cons, default parameter tweaks, and preview metadata.
 */

export const MAIN_CATEGORIES = [
  {
    id: 'swiss',
    title: '스위스 스타일',
    titleEn: 'International Typographic Style',
    description: '수학적 그리드, 비대칭 레이아웃, 강렬한 산세리프 타이포그래피 중심의 모더니즘 디자인',
    icon: '📐',
    accentColor: '#FF3300',
    tags: ['모더니즘', '그리드', '미니멀', '산세리프'],
    subCategories: [
      {
        id: 'swiss-grid',
        name: '격자 중심 모더니즘',
        nameEn: 'Grid-Driven Modernism',
        shortDesc: '정밀한 12컬럼 구조와 산세리프 폰트로 구현된 스위스 모더니즘의 정수',
        previewType: 'swiss',
        moodTags: ['미니멀', '정밀성', '아카이브', '스위스'],
        defaultTweaks: { borderRadius: 0, borderWidth: 1, shadowDepth: 0, backdropBlur: 0, glowIntensity: 0 },
        characteristics: [
          '엄격한 수학적 Grid System 기반 기하학적 정보 배치',
          'Inter / Helvetica 계열 산세리프 타이포그래피 극대화',
          '강렬한 International Red (#FF3300) 포인트 컬러',
          '풍부한 여백(Negative Space)과 비대칭 계층 구조'
        ],
        pros: [
          '정보의 시각적 명확성 및 압도적인 가독성',
          '시대를 초월한 세련된 모던 브랜드 이미지 구축',
          '반응형 그리드 변환이 매우 정밀하고 직관적임'
        ],
        cons: [
          '엄격한 규칙성으로 인해 자유분방한 감성 표현 제한',
          '여백이 과도할 경우 콘텐츠 밀도가 낮아 보일 수 있음'
        ],
        palette: [
          { name: 'Canvas White', hex: '#F4F4F0', usage: '메인 배경' },
          { name: 'Deep Ink', hex: '#111111', usage: '주요 텍스트 & 신호' },
          { name: 'Swiss Red', hex: '#FF3300', usage: '포인트 액센트' },
          { name: 'Neutral Gray', hex: '#666666', usage: '보조 그리드 라인' }
        ]
      },
      {
        id: 'corporate-minimal',
        name: '기업형 미니멀리즘',
        nameEn: 'Corporate Minimalist',
        shortDesc: '글로벌 테크 기업 및 신뢰성 중심의 현대적 린 디자인 체계',
        previewType: 'corporate',
        moodTags: ['SaaS', '신뢰감', 'B2B', '테크'],
        defaultTweaks: { borderRadius: 12, borderWidth: 1, shadowDepth: 8, backdropBlur: 0, glowIntensity: 0.3 },
        characteristics: [
          '신뢰감을 주는 신뢰성 블루(#2563EB)와 딥 슬레이트 톤 조합',
          '정교한 카드 구분선과 마이크로 액센트 배지',
          '명확한 전환 유도 버튼(CTA) 중심의 구조'
        ],
        pros: [
          '높은 사용자 전환율(Conversion Rate)',
          '브랜드 신뢰도 및 프로페셔널한 느낌 전달',
          '다양한 연령층에 직관적인 UX 제공'
        ],
        cons: [
          '유사한 다른 기업 웹사이트와 차별성이 다소 부족할 수 있음'
        ],
        palette: [
          { name: 'Pure White', hex: '#FFFFFF', usage: '카드 Surface' },
          { name: 'Slate Dark', hex: '#0F172A', usage: '메인 헤드라인' },
          { name: 'Trust Blue', hex: '#2563EB', usage: 'CTA 버튼 & 강조' },
          { name: 'Soft Gray', hex: '#94A3B8', usage: '서브 라인' }
        ]
      },
      {
        id: 'high-contrast-mono',
        name: '고대비 모노스페이스',
        nameEn: 'High-Contrast Monospace',
        shortDesc: '개발자 도구와 터미널 감성의 초명확 직관 레이아웃',
        previewType: 'minimalism',
        moodTags: ['개발자', '터미널', '모노스페이스', '고대비'],
        defaultTweaks: { borderRadius: 4, borderWidth: 1, shadowDepth: 0, backdropBlur: 0, glowIntensity: 0.8 },
        characteristics: [
          'Monospace 고정폭 폰트와 명확한 1px 단색 보더선',
          '흑백 대비 중심에 네온 터미널 그린(#00FF66) 액센트',
          '데이터 밀도가 높은 커맨드 라인 인스펙터 인터페이스'
        ],
        pros: [
          '개발자 및 기술 기반 사용자 층에 친숙한 UI',
          '코드 및 시스템 데이터 가독성 극대화'
        ],
        cons: [
          '일반 대중 소비자에게는 다소 딱딱하게 느껴질 수 있음'
        ],
        palette: [
          { name: 'Terminal Black', hex: '#050505', usage: '배경' },
          { name: 'Pure White', hex: '#FFFFFF', usage: '텍스트' },
          { name: 'Neon Terminal', hex: '#00FF66', usage: '상태 뱃지' },
          { name: 'Dim Gray', hex: '#333333', usage: '경계선' }
        ]
      }
    ]
  },
  {
    id: 'brutalism',
    title: '브루탈리즘 & 네오 브루탈리즘',
    titleEn: 'Brutalism & Neo-Brutalism',
    description: '두꺼운 외곽선, 비정형적 레이아웃, 과감한 하드 섀도가 만드는 파격적 디자인',
    icon: '⚡',
    accentColor: '#FFFF00',
    tags: ['브루탈리즘', '네오브루탈', '파격', '하드섀도'],
    subCategories: [
      {
        id: 'raw-brutalism',
        name: '날것의 디지털 브루탈리즘',
        nameEn: 'Raw Digital Brutalism',
        shortDesc: '세공되지 않은 원초적 HTML 디폴트 요소와 위트 있는 반항적 디자인',
        previewType: 'raw-brutal',
        moodTags: ['원색', '로우파이', '파격', '언더그라운드'],
        defaultTweaks: { borderRadius: 0, borderWidth: 4, shadowDepth: 6, backdropBlur: 0, glowIntensity: 0 },
        characteristics: [
          '원색 마젠타/옐로우 조합과 기본 브라우저 스타일',
          '거친 4px 블랙 보더와 파괴적 그리드 정렬',
          '예측 불가한 텍스처와 대형 타이포그래피'
        ],
        pros: [
          '독보적이고 잊혀지지 않는 강렬한 인상 전달',
          '기존 웹 표준틀을 깨는 창의적 브랜드 정체성'
        ],
        cons: [
          '사용자 호불호가 갈릴 수 있으며 접근성 사전 검증 필수'
        ],
        palette: [
          { name: 'Raw Yellow', hex: '#FFFF00', usage: '포인트 버튼' },
          { name: 'Harsh Black', hex: '#000000', usage: '외곽선 & 배경' },
          { name: 'Hot Pink', hex: '#FF0055', usage: '경고 & 액션' },
          { name: 'Stark White', hex: '#FFFFFF', usage: '서브 카드' }
        ]
      },
      {
        id: 'neo-brutalism',
        name: '트렌디 네오 브루탈리즘',
        nameEn: 'Trendy Neo-Brutalism',
        shortDesc: '두꺼운 검은 외곽선과 팝 파스텔 톤, 5px 하드 섀도가 결합된 대중적 브루탈리즘',
        previewType: 'neo-brutal',
        moodTags: ['팝', '파스텔', '트렌디', '캐주얼'],
        defaultTweaks: { borderRadius: 12, borderWidth: 3, shadowDepth: 6, backdropBlur: 0, glowIntensity: 0 },
        characteristics: [
          '3~4px 실선 border & 5px solid black hard shadow',
          '밝은 팝 파스텔 옐로우/핑크/블루 색상 블록',
          '호버 시 섀도 축소 및 튀어나오는 물리 클릭 효과'
        ],
        pros: [
          '젊고 활력 넘치는 인상과 높은 클릭 유도력',
          '시각적 요소의 확실한 구분으로 높은 인지성'
        ],
        cons: [
          '보수적인 금융/법률 서비스에는 어울리지 않을 수 있음'
        ],
        palette: [
          { name: 'Pop Yellow', hex: '#FEF08A', usage: '메인 카드 Surface' },
          { name: 'Soft Sky', hex: '#BFDBFE', usage: '보조 카드' },
          { name: 'Slate Ink', hex: '#1E293B', usage: '텍스트 & 섀도' },
          { name: 'Coral Pop', hex: '#F43F5E', usage: '강조 버튼' }
        ]
      },
      {
        id: 'cyber-brutalism',
        name: '사이버 브루탈리즘',
        nameEn: 'Cyber Brutalism',
        shortDesc: '해커 문화, 사이버네틱 무드와 거친 와이어프레임의 미래지향적 조화',
        previewType: 'cyberpunk',
        moodTags: ['사이버펑크', '글리치', '와이어프레임', '네온'],
        defaultTweaks: { borderRadius: 0, borderWidth: 2, shadowDepth: 0, backdropBlur: 0, glowIntensity: 1.5 },
        characteristics: [
          '네온 사이버 블루(#00F0FF)와 글리치 폰트 효과',
          '거친 다크 모드 와이어프레임과 시스템 로그 스니펫',
          '디지털 노이즈와 고대비 매트릭스 그리드 라인'
        ],
        pros: [
          '게임, Web3, 하이테크 분야에서 강렬한 몰입감 제공',
          '미래적인 개성과 테크니컬한 이미지 강조'
        ],
        cons: [
          '장시간 열람 시 눈의 피로도가 증가할 수 있음'
        ],
        palette: [
          { name: 'Abyss Dark', hex: '#0D0E15', usage: '전체 배경' },
          { name: 'Cyber Cyan', hex: '#00F0FF', usage: '네온 발광' },
          { name: 'Neon Pink', hex: '#FF007A', usage: '포인트 경고' },
          { name: 'Grid Blue', hex: '#1F2438', usage: '와이어프레임' }
        ]
      }
    ]
  },
  {
    id: 'depth',
    title: '입체감 및 질감 스타일',
    titleEn: 'Depth & Materiality',
    description: '반투명 유리(Glass), 부드러운 양각(Neumorphism), 아날로그 촉감(Skeuomorphism)',
    icon: '💎',
    accentColor: '#00F0FF',
    tags: ['글래스', '뉴모피즘', '스큐어모피즘', '3D질감'],
    subCategories: [
      {
        id: 'glassmorphism',
        name: '프로스테드 글래스모피즘',
        nameEn: 'Frosted Glassmorphism',
        shortDesc: '반투명 굴절 유리의 몽환적인 레이어링과 고급스러운 블러 서페이스',
        previewType: 'glassmorphism',
        moodTags: ['글래스', '블러', '프리미엄', '모던OS'],
        defaultTweaks: { borderRadius: 20, borderWidth: 1, shadowDepth: 16, backdropBlur: 20, glowIntensity: 1.0 },
        characteristics: [
          'backdrop-filter: blur(20px) 기반 미세 반투명 굴절 효과',
          '유리 단면을 연상시키는 1px 반투명 빛 테두리',
          '배경에 배치된 은은하게 구동되는 네온 그래디언트 구체'
        ],
        pros: [
          '압도적인 프리미엄 미학 및 레이어간 깊이감 분리',
          '모던하고 세련된 OS/앱 UI 패널 감성'
        ],
        cons: [
          '저사양 기기에서 GPU 블러 연산 부담이 있을 수 있음'
        ],
        palette: [
          { name: 'Glass Frost', hex: 'rgba(255,255,255,0.12)', usage: '유리 카드 Surface' },
          { name: 'Deep Space', hex: '#0F172A', usage: '딥 다크 배경' },
          { name: 'Glow Indigo', hex: '#818CF8', usage: '백그라운드 빛 구체' },
          { name: 'Crystal White', hex: '#E0E7FF', usage: '유리 단면 빛' }
        ]
      },
      {
        id: 'neumorphism',
        name: '소프트 뉴모피즘',
        nameEn: 'Soft Neumorphism',
        shortDesc: '플라스틱 서페이스가 입체적으로 융기하고 눌리는 부드러운 양각/음각 UI',
        previewType: 'neumorphism',
        moodTags: ['소프트', '촉감', '양각음각', '미니멀'],
        defaultTweaks: { borderRadius: 24, borderWidth: 0, shadowDepth: 12, backdropBlur: 0, glowIntensity: 0.2 },
        characteristics: [
          '단일 바탕색 위에 상단 밝은 그림자와 하단 어두운 그림자의 이중 결합',
          '물리적 버튼을 누르는 듯한 인셋(Inset) 그림자 찌그러짐',
          '극도로 절제된 단색조(Monochromatic) 평온한 톤앤매너'
        ],
        pros: [
          '실제 기기를 만지는 듯한 시각적 촉감 제공',
          '눈에 자극이 적고 조화로운 오디오/헬스케어 기기 UI'
        ],
        cons: [
          '버튼과 바탕 간 명도 차가 적어 접근성(A11y) 확보 난이도 높음'
        ],
        palette: [
          { name: 'Soft Surface', hex: '#E0E5EC', usage: '전체 메인 톤' },
          { name: 'Highlight Shadow', hex: '#FFFFFF', usage: '상단 빛 반사' },
          { name: 'Dark Shadow', hex: '#A3B1C6', usage: '하단 이중 그림자' },
          { name: 'Tactile Accent', hex: '#4F46E5', usage: '활성화 포인트' }
        ]
      },
      {
        id: 'skeuomorphism',
        name: '모던 스큐어모피즘 2.0',
        nameEn: 'Modern Skeuomorphism 2.0',
        shortDesc: '현대적 플랫 디자인 감각으로 재해석된 고급스러운 아날로그 질감',
        previewType: 'skeuomorphism',
        moodTags: ['아날로그', '금속질감', '노브다이얼', '촉감'],
        defaultTweaks: { borderRadius: 16, borderWidth: 1, shadowDepth: 16, backdropBlur: 0, glowIntensity: 0.8 },
        characteristics: [
          '금속, 가죽, 유리, 아날로그 노브 Dial의 정교한 질감 표면',
          '현실 세계의 조명 방향을 반영한 그래디언트와 부드러운 발광',
          '아날로그 토글 스위치 및 앰프 게인 미터 연출'
        ],
        pros: [
          '직관적인 사용법 학습 없이 즉각적인 직관성 제공',
          '풍부한 시각적 재미와 정교한 공예적 가치'
        ],
        cons: [
          'CSS 디테일 및 그래픽 제작 공수가 큼'
        ],
        palette: [
          { name: 'Brushed Charcoal', hex: '#1E1E24', usage: '메인 가공 표면' },
          { name: 'Metallic Gray', hex: '#2D2D35', usage: '금속 노브 섀시' },
          { name: 'Amber Indicator', hex: '#FF9F1C', usage: '아날로그 게인 빛' },
          { name: 'LED Emerald', hex: '#4CB944', usage: '전원 표시등' }
        ]
      }
    ]
  },
  {
    id: 'retro',
    title: '레트로 & 팝 아키텍처',
    titleEn: 'Retro & Pop Architecture',
    description: '80년대 멤피스, 사이버펑크, 신스웨이브, 베이퍼웨이브가 선사하는 강렬한 아날로그 팝 감성',
    icon: '📼',
    accentColor: '#FF007A',
    tags: ['레트로', '80s', '신스웨이브', '베이퍼웨이브'],
    subCategories: [
      {
        id: 'memphis',
        name: '멤피스 팝 아키텍처',
        nameEn: 'Memphis Pop Architecture',
        shortDesc: '80년대 멤피스 그룹의 기하학 패턴과 통발 지그재그 라인의 유쾌한 팝 감성',
        previewType: 'memphis',
        moodTags: ['멤피스', '80s', '도형', '비비드'],
        defaultTweaks: { borderRadius: 8, borderWidth: 3, shadowDepth: 6, backdropBlur: 0, glowIntensity: 0 },
        characteristics: [
          '지그재그 물결선, 트라이앵글, 컨페티 기하학 패턴',
          '비비드 파스텔 핑크/옐로우/블루의 경쾌한 대비',
          '장난기 넘치고 활력 있는 아날로그 그래픽 조합'
        ],
        pros: [
          '보는 순간 미소를 유발하는 유쾌하고 젊은 브랜드 에너지',
          '엔터테인먼트, 페스티벌, 창의적 포트폴리오에 최적'
        ],
        cons: [
          '시각적 요소가 너무 번잡해지면 메인 메시지 전달력 감소'
        ],
        palette: [
          { name: 'Memphis Pink', hex: '#FF70A6', usage: '메인 팝 컬러' },
          { name: 'Peach Coral', hex: '#FF9770', usage: '보조 도형' },
          { name: 'Sunshine Yellow', hex: '#FFD670', usage: '배경 패턴' },
          { name: 'Sky Cyan', hex: '#70D6FF', usage: '물결 포인트' }
        ]
      },
      {
        id: 'synthwave',
        name: '80년대 신스웨이브',
        nameEn: '80s Synthwave & Outrun',
        shortDesc: '원근감 있는 3D 그리드, 석양 그리드와 네온 핑크의 신선한 노스탤지어',
        previewType: 'retro',
        moodTags: ['신스웨이브', '아웃런', '3D그리드', '네온석양'],
        defaultTweaks: { borderRadius: 10, borderWidth: 2, shadowDepth: 14, backdropBlur: 10, glowIntensity: 1.8 },
        characteristics: [
          '지평선으로 수렴하는 3D 퍼스펙티브 네온 그리드',
          '보라색 우주 배경 속 불타는 네온 석양 실루엣',
          '크롬 타입 로고와 글리치 신스 그래디언트'
        ],
        pros: [
          '영화와 음악적 노스탤지어가 결합된 압도적 몰입감',
          '특색 있는 다크 모드 비주얼 임팩트'
        ],
        cons: [
          '특정 레트로 서브컬처에 치우쳐 보편적 포털에는 어색할 수 있음'
        ],
        palette: [
          { name: 'Synth Purple', hex: '#1A0B2E', usage: '우주 배경' },
          { name: 'Neon Magenta', hex: '#FF007F', usage: '네온 라인' },
          { name: 'Electric Cyan', hex: '#00F5FF', usage: '그리드 선' },
          { name: 'Sunset Gold', hex: '#FFDD00', usage: '석양 태양' }
        ]
      },
      {
        id: 'vaporwave',
        name: '베이퍼웨이브 칠',
        nameEn: 'Vaporwave Chill',
        shortDesc: '고전 조각상, 로파이 감성, 몽환적인 윈도우 95 감성의 칠웨이브 미학',
        previewType: 'vaporwave',
        moodTags: ['베이퍼웨이브', '로파이', '윈도우95', '파스텔'],
        defaultTweaks: { borderRadius: 0, borderWidth: 2, shadowDepth: 4, backdropBlur: 8, glowIntensity: 0.5 },
        characteristics: [
          '로파이 아날로그 TV 스캔라인과 파스텔 퍼플 틸 그래디언트',
          '고전 석상 서프라이즈 그래픽과 레트로 OS 창 UI',
          '몽환적이고 느긋한 90년대 칠아웃 무드'
        ],
        pros: [
          '서브컬처 예술 감성과 고유한 아티스틱 브랜드 표현',
          '차별화된 개성을 꿈꾸는 음악/패션 갤러리에 적합'
        ],
        cons: [
          '일반적인 가독성 위주 정보 전달에는 비효율적'
        ],
        palette: [
          { name: 'Vapor Lavender', hex: '#D8B4F8', usage: '유리 윈도우' },
          { name: 'Pastel Yellow', hex: '#F9F871', usage: '타이틀 글꼴' },
          { name: 'Chill Violet', hex: '#845EC2', usage: '배경 그래디언트' },
          { name: 'Retro Mint', hex: '#00C9A7', usage: '스캔라인 라인' }
        ]
      }
    ]
  },
  {
    id: 'editorial',
    title: '에디토리얼 & 오가닉',
    titleEn: 'Editorial & Organic',
    description: '럭셔리 잡지 레이아웃, 우아한 세리프 타이포, 자연의 웜톤 부드러운 곡선의 만남',
    icon: '🌿',
    accentColor: '#00E699',
    tags: ['에디토리얼', '세리프', '오가닉', '자연친화'],
    subCategories: [
      {
        id: 'high-fashion',
        name: '하이패션 에디토리얼',
        nameEn: 'High-Fashion Editorial',
        shortDesc: '우아한 세리프 타이포그래피와 미드나잇 잉크 컬러의 럭셔리 에디토리얼',
        previewType: 'editorial',
        moodTags: ['럭셔리', '패션', '세리프', '매거진'],
        defaultTweaks: { borderRadius: 0, borderWidth: 1, shadowDepth: 0, backdropBlur: 0, glowIntensity: 0 },
        characteristics: [
          'Cinzel/Playfair 계열의 고전적이고 우아한 세리프 타이틀',
          '미드나잇 잉크(#0A0A0A)와 아이보리, 샴페인 골드의 럭셔리 대비',
          '잡지 표지를 보는 듯한 대담한 폰트 스케일링과 여백'
        ],
        pros: [
          '고급 브랜드 및 매거진의 감성적 가치 극대화',
          '스토리텔링과 기사 형식 콘텐츠의 뛰어난 몰입감'
        ],
        cons: [
          '고화질의 정교한 사진 에셋이 동반되어야 본래 가치가 살아남'
        ],
        palette: [
          { name: 'Midnight Ink', hex: '#0A0A0A', usage: '메인 배경' },
          { name: 'Ivory Soft', hex: '#F5F5F0', usage: '메인 텍스트' },
          { name: 'Champagne Gold', hex: '#C5A880', usage: '럭셔리 액센트' },
          { name: 'Warm Charcoal', hex: '#1C1C1E', usage: '패널 Surface' }
        ]
      },
      {
        id: 'fluid-organic',
        name: '플루이드 오가닉 & 웜톤',
        nameEn: 'Fluid Organic & Warm Tone',
        shortDesc: '자연 친화적 웜 점토 톤과 부드러운 곡선 블롭 쉐이프의 편안한 UI',
        previewType: 'organic',
        moodTags: ['자연', '웜톤', '블롭곡선', '웰빙'],
        defaultTweaks: { borderRadius: 36, borderWidth: 1, shadowDepth: 10, backdropBlur: 0, glowIntensity: 0.2 },
        characteristics: [
          'border-radius: 40px 이상의 부드러운 유기적 곡선 커스텀 쉐이프',
          '따뜻한 흙(Clay), 숲(Pine), 테라코타(Terracotta)의 자연 친화 색조',
          '자극적이지 않고 눈이 편안한 인체공학적 비주얼 밸런스'
        ],
        pros: [
          '마음의 안정을 주는 편안하고 친근한 서비스 이미지',
          '웰빙, 친환경, 뷰티, 라이프스타일 서비스에 최적'
        ],
        cons: [
          '차갑고 정밀한 데이터 대시보드에는 어울리지 않을 수 있음'
        ],
        palette: [
          { name: 'Warm Clay', hex: '#F7F4EF', usage: '메인 배경' },
          { name: 'Forest Pine', hex: '#2C3E35', usage: '메인 텍스트' },
          { name: 'Terracotta', hex: '#E07A5F', usage: '포인트 버튼' },
          { name: 'Sage Green', hex: '#81B29A', usage: '서브 뱃지' }
        ]
      },
      {
        id: 'dark-minimal-glass',
        name: '다크모드 미니멀 글래스',
        nameEn: 'Dark Mode Minimal Glass',
        shortDesc: '딥 네이비 우주 속 발광하는 미세 보더선과 최고급 모던 스펙트럼',
        previewType: 'darkmode',
        moodTags: ['다크모드', 'OLED', '미니멀', '발광보더'],
        defaultTweaks: { borderRadius: 16, borderWidth: 1, shadowDepth: 14, backdropBlur: 16, glowIntensity: 1.2 },
        characteristics: [
          '딥 차콜 배경 위에 펼쳐지는 은은한 네온 스카이블루 액센트',
          '극도로 정제된 라인 아이콘과 깔끔한 가독성 보장',
          'OLED 디스플레이의 가치와 배터리 절감을 고려한 미학'
        ],
        pros: [
          '야간 및 어두운 환경에서 뛰어난 시각적 편안함',
          '최첨단 SaaS 및 글로벌 서비스의 현대적 대세 표준'
        ],
        cons: [
          '밝은 야외 햇빛 아래에서는 명도 대비 재정비 필요'
        ],
        palette: [
          { name: 'Abyss Background', hex: '#0B0F19', usage: '딥 다크 배경' },
          { name: 'Card Surface', hex: '#111827', usage: '카드 패널' },
          { name: 'Sky Glow', hex: '#38BDF8', usage: '발광 미세 보더' },
          { name: 'Muted Slate', hex: '#94A3B8', usage: '보조 라벨' }
        ]
      }
    ]
  },
  {
    id: 'y2k',
    title: 'Y2K & 2000s 글로시 웹',
    titleEn: 'Y2K & 2000s Glossy Web',
    description: '밀레니엄 크롬, 투명 아쿠아 젤 버튼, Frutiger Aero의 푸른 하늘과 픽셀 아케이드',
    icon: '💿',
    accentColor: '#A855F7',
    tags: ['Y2K', 'FrutigerAero', '글로시', '픽셀아트'],
    subCategories: [
      {
        id: 'y2k-chrome',
        name: 'Y2K 크롬 & 홀로그램',
        nameEn: 'Y2K Chrome & Hologram',
        shortDesc: '2000년대 초반 메탈릭 실버 크롬, 무지개 홀로그램과 사이버 팝 미학',
        previewType: 'y2k-chrome',
        moodTags: ['Y2K', '크롬', '홀로그램', '밀레니엄'],
        defaultTweaks: { borderRadius: 18, borderWidth: 2, shadowDepth: 12, backdropBlur: 6, glowIntensity: 1.4 },
        characteristics: [
          '금속성 실버 크롬 텍스트와 홀로그래픽 무지개 쉬머 효과',
          '타원형 캡슐 버튼과 2000년대 테크노 미래주의 폰트',
          '별빛 반짝임(Sparkle)과 실버 림 라이트 반사'
        ],
        pros: [
          'Z세대에 폭발적인 인기를 끄는 레트로 트렌드 정체성',
          'K-POP, 스트리트 패션, 힙한 브랜드에 독보적인 차별성'
        ],
        cons: [
          '과도한 홀로그램 사용 시 텍스트 가독성 저하 주의'
        ],
        palette: [
          { name: 'Chrome Silver', hex: '#E2E8F0', usage: '메탈릭 프레임' },
          { name: 'Holo Magenta', hex: '#EC4899', usage: '홀로그램 포인트' },
          { name: 'Electric Violet', hex: '#8B5CF6', usage: '사이버 림라이트' },
          { name: 'Space Navy', hex: '#0F172A', usage: '배경' }
        ]
      },
      {
        id: 'frutiger-aero',
        name: 'Frutiger Aero 투명 아쿠아',
        nameEn: 'Frutiger Aero Aqua Gloss',
        shortDesc: '투명한 물방울, 글로시 유리 구체, 청량한 푸른 하늘과 유토피아적 낙관주의',
        previewType: 'frutiger-aero',
        moodTags: ['FrutigerAero', '아쿠아', '글로시', '자연주의'],
        defaultTweaks: { borderRadius: 22, borderWidth: 2, shadowDepth: 14, backdropBlur: 14, glowIntensity: 1.1 },
        characteristics: [
          '광택 나는 젤리/아쿠아 버튼과 3D 유리 구체 하이라이트',
          '푸른 하늘과 초록 풀밭의 맑은 2000년대 중반 유토피아 톤',
          '부드러운 곡선과 투명한 플라스틱 캡슐 형태'
        ],
        pros: [
          '맑고 깨끗한 긍정적 에너지와 청량한 감성 전달',
          '물방울과 유리 질감의 풍부한 시각적 깊이감'
        ],
        cons: [
          '현대 플랫 미니멀리즘에 비해 그래픽 요소가 다채로움'
        ],
        palette: [
          { name: 'Sky Cyan', hex: '#38BDF8', usage: '맑은 하늘 베이스' },
          { name: 'Aqua Lime', hex: '#4ADE80', usage: '청량한 초록 잔디' },
          { name: 'Gloss Glass', hex: 'rgba(255,255,255,0.4)', usage: '투명 젤리 하이라이트' },
          { name: 'Ocean Blue', hex: '#0284C7', usage: '깊은 물방울 버튼' }
        ]
      },
      {
        id: 'pixel-arcade',
        name: '8-Bit 픽셀 아케이드',
        nameEn: '8-Bit Pixel Arcade',
        shortDesc: '도트 그래픽, CRT 모니터 스캔라인, 클래식 레트로 게임기 인터페이스',
        previewType: 'pixel-arcade',
        moodTags: ['픽셀아트', '8Bit', '게임', 'CRT스캔라인'],
        defaultTweaks: { borderRadius: 0, borderWidth: 4, shadowDepth: 8, backdropBlur: 0, glowIntensity: 0.6 },
        characteristics: [
          '픽셀 폰트와 각진 4px 계단식 도트 보더',
          '코인 인서트, HP 게이지, 레트로 게임 HUD 프레임',
          'CRT 브라운관 TV의 은은한 스캔라인과 비프음 감성'
        ],
        pros: [
          '전 세대에 걸친 친근하고 직관적인 게임 플레이 경험',
          '게이미피케이션(Gamification) 요소와 찰떡궁합'
        ],
        cons: [
          '긴 문장의 정보성 텍스트 렌더링 시 가독성 한계'
        ],
        palette: [
          { name: 'Arcade Purple', hex: '#2E0854', usage: '아케이드 배경' },
          { name: 'Pixel Gold', hex: '#FBBF24', usage: '코인/스타 텍스트' },
          { name: 'Health Green', hex: '#22C55E', usage: 'HP 바' },
          { name: 'Pixel Red', hex: '#EF4444', usage: '보스 알림' }
        ]
      }
    ]
  },
  {
    id: 'hypertech',
    title: '하이퍼 테크 & 키네틱 모션',
    titleEn: 'Hyper-Tech & Kinetic Motion',
    description: '속도감 넘치는 키네틱 타이포, 애플 스타일 정밀 벤토 그리드, 강렬한 테크노 애시드',
    icon: '⚡',
    accentColor: '#CCFF00',
    tags: ['키네틱', '벤토UI', '애시드', '하이퍼테크'],
    subCategories: [
      {
        id: 'kinetic-type',
        name: '키네틱 타이포 & 모션 헤비',
        nameEn: 'Kinetic Typography & Motion',
        shortDesc: '흐르는 마퀴(Marquee), 회전하는 텍스트 링, 역동적 속도감의 타이포 중심 UI',
        previewType: 'kinetic-type',
        moodTags: ['키네틱', '마퀴', '모션', '타이포그래피'],
        defaultTweaks: { borderRadius: 8, borderWidth: 1, shadowDepth: 8, backdropBlur: 4, glowIntensity: 1.2 },
        characteristics: [
          '무한 롤링되는 대형 타이포 마퀴 배너',
          '초당 프레임의 역동적인 텍스트 스케일링 & 트랜스폼',
          '하이퍼 라임(#CCFF00)과 딥 블랙의 강렬한 레이싱 콘트라스트'
        ],
        pros: [
          '시선을 단숨에 사로잡는 압도적인 시각적 역동성',
          '신제품 런칭 및 브랜드 캠페인의 흥분감 고조'
        ],
        cons: [
          '모션에 민감한 사용자(전정기관 장애)를 위한 배려 필요'
        ],
        palette: [
          { name: 'Hyper Lime', hex: '#CCFF00', usage: '키네틱 액센트' },
          { name: 'Pitch Black', hex: '#050505', usage: '스피드 배경' },
          { name: 'Flash White', hex: '#FFFFFF', usage: '헤드라인 타이포' },
          { name: 'Carbon Gray', hex: '#1E1E1E', usage: '컨테이너 트랙' }
        ]
      },
      {
        id: 'bento-grid',
        name: 'Bento UI 2.0 정밀 그리드',
        nameEn: 'Bento UI 2.0 Precision Grid',
        shortDesc: '애플·스트라이프 스타일의 비대칭 카드 모듈과 인터랙티브 마이크로 위젯',
        previewType: 'bento-grid',
        moodTags: ['Bento', '애플스타일', '위젯', '모듈형'],
        defaultTweaks: { borderRadius: 20, borderWidth: 1, shadowDepth: 10, backdropBlur: 12, glowIntensity: 0.7 },
        characteristics: [
          '도시락(Bento)처럼 다양한 비율(1x1, 2x1, 2x2)로 완벽히 정렬된 카드',
          '각 카드마다 독립적인 기능(토글, 미니차트, 프로필)을 가진 미니 앱',
          '은은한 글래스 림 보더와 부드러운 다크 그라데이션 서페이스'
        ],
        pros: [
          '복잡한 다기능 서비스의 정보를 직관적으로 모듈화',
          '최신 글로벌 테크 웹사이트의 대표 트렌드'
        ],
        cons: [
          '반응형 모바일 화면에서 카드 순서 및 계층 재정렬 설계 필요'
        ],
        palette: [
          { name: 'Bento Card', hex: '#161B26', usage: '모듈 카드 베이스' },
          { name: 'Subtle Rim', hex: 'rgba(255,255,255,0.08)', usage: '미세 림 라이트' },
          { name: 'Active Indigo', hex: '#6366F1', usage: '토글 & 진행바' },
          { name: 'Data Emerald', hex: '#10B981', usage: '실시간 지표' }
        ]
      },
      {
        id: 'acid-techno',
        name: '애시드 그래픽 & 테크노 레이브',
        nameEn: 'Acid Graphics & Techno Rave',
        shortDesc: '네온 형광 그린, 크롬 구체, 3D 왜곡 그래픽과 레이브 클럽 감성의 디자인',
        previewType: 'acid-techno',
        moodTags: ['애시드', '테크노', '레이브', '네온그린'],
        defaultTweaks: { borderRadius: 4, borderWidth: 2, shadowDepth: 12, backdropBlur: 0, glowIntensity: 2.0 },
        characteristics: [
          '시각적 충격을 주는 애시드 형광 그린/옐로우와 스마일리 심볼',
          '왜곡된 3D 액체 크롬 텍스처와 바코드 그래픽',
          '언더그라운드 테크노 파티 포스터를 연상시키는 전위적 레이아웃'
        ],
        pros: [
          '젊은 서브컬처 팬덤을 타겟으로 한 독보적 개성',
          '예술, 음악, 스트리트 패션 브랜드에서 강력한 임팩트'
        ],
        cons: [
          '가독성과 보편성이 낮아 비즈니스 서비스에는 부적합'
        ],
        palette: [
          { name: 'Acid Neon Green', hex: '#39FF14', usage: '주요 신호 & 림' },
          { name: 'Pure Darkness', hex: '#000000', usage: '클럽 배경' },
          { name: 'Electric Yellow', hex: '#FFFF33', usage: '스마일리 & 경고' },
          { name: 'Toxic Purple', hex: '#7928CA', usage: '서브 왜곡' }
        ]
      }
    ]
  },
  {
    id: 'soft3d',
    title: '소프트 3D & 솔라퓨처리즘',
    titleEn: 'Soft 3D & Solarpunk',
    description: '폭신한 클레이모피즘(3D 버블), 손그림 콜라주 감성, 희망찬 친환경 솔라펑크',
    icon: '🌱',
    accentColor: '#FF6B4A',
    tags: ['클레이모피즘', '3D소프트', '콜라주', '솔라펑크'],
    subCategories: [
      {
        id: 'claymorphism',
        name: '클레이모피즘 3D 버블',
        nameEn: 'Claymorphism & 3D Bubble',
        shortDesc: '점토(Clay)처럼 둥글고 폭신폭신한 3D 입체 카드와 말랑말랑한 인터랙션',
        previewType: 'claymorphism',
        moodTags: ['클레이', '3D버블', '말랑', '소프트'],
        defaultTweaks: { borderRadius: 32, borderWidth: 0, shadowDepth: 20, backdropBlur: 0, glowIntensity: 0.4 },
        characteristics: [
          '내부 안쪽 그림자(Inset Shadow)와 부드러운 드롭 섀도가 만드는 풍선 질감',
          '32px 이상의 극단적으로 둥근 모서리와 파스텔 클레이 색조',
          '호버 시 젤리처럼 통통 튀는 바운스 인터랙션'
        ],
        pros: [
          '보는 사람에게 친근함과 귀여운 심리적 만족감 선사',
          '에듀테크, 키즈, 온보딩 튜토리얼 UI에 최고 효과'
        ],
        cons: [
          '그림자 연산이 복잡하고 공간을 많이 차지함'
        ],
        palette: [
          { name: 'Clay Peach', hex: '#FFDDD2', usage: '폭신한 카드' },
          { name: 'Clay Coral', hex: '#FF6B4A', usage: '메인 버튼' },
          { name: 'Clay Teal', hex: '#83C5BE', usage: '보조 버블' },
          { name: 'Cloud Base', hex: '#EDF6F9', usage: '배경' }
        ]
      },
      {
        id: 'handcrafted-indie',
        name: '핸드크래프트 콜라주 인디',
        nameEn: 'Handcrafted & Collage Indie',
        shortDesc: '마스킹 테이프, 종이 찢김 질감, 손글씨 스티커가 주는 아날로그 따스함',
        previewType: 'handcrafted-indie',
        moodTags: ['손그림', '콜라주', '마스킹테이프', '인디'],
        defaultTweaks: { borderRadius: 6, borderWidth: 2, shadowDepth: 6, backdropBlur: 0, glowIntensity: 0 },
        characteristics: [
          '반투명 마스킹 테이프 그래픽과 스크랩북 페이퍼 질감',
          '살짝 기울어진 각도(Transform rotate)와 손글씨 주석',
          '스탬프 도장 및 빈티지 핀 스티커 데코레이션'
        ],
        pros: [
          '기계적인 느낌을 배제한 인간적이고 따뜻한 스토리 전달',
          '인디 작가, 독립서점, 개인 블로그/포트폴리오에 이상적'
        ],
        cons: [
          '정형화된 기업 데이터 표기에는 정돈성이 떨어짐'
        ],
        palette: [
          { name: 'Kraft Paper', hex: '#F4ECD8', usage: '스크랩북 배경' },
          { name: 'Masking Tape', hex: 'rgba(255, 222, 89, 0.7)', usage: '테이프 데코' },
          { name: 'Stamp Red', hex: '#B91C1C', usage: '도장 스탬프' },
          { name: 'Pencil Charcoal', hex: '#2D3748', usage: '손글씨 텍스트' }
        ]
      },
      {
        id: 'solarpunk-eco',
        name: '솔라펑크 에코 퓨처리즘',
        nameEn: 'Solarpunk Eco-Futurism',
        shortDesc: '자연과 첨단 재생 에너지가 공존하는 찬란한 황금빛 태양과 녹색 잎사귀 미학',
        previewType: 'solarpunk-eco',
        moodTags: ['솔라펑크', '친환경', '태양광', '미래생태'],
        defaultTweaks: { borderRadius: 20, borderWidth: 1, shadowDepth: 12, backdropBlur: 8, glowIntensity: 1.0 },
        characteristics: [
          '스테인드글라스 패턴과 아르누보 유기적 덩굴 라인 아트',
          '황금빛 태양광(#F59E0B)과 싱그러운 숲 녹색(#10B981)의 조화',
          '지속 가능한 미래와 기술 생태계의 희망찬 분위기'
        ],
        pros: [
          'ESG, 친환경 기술, 클린에너지 브랜드의 비전 강조',
          '디스토피아적 사이버펑크와 대비되는 긍정적 미래 비전'
        ],
        cons: [
          '복잡한 식물 장식으로 인해 레이아웃이 다소 장식적일 수 있음'
        ],
        palette: [
          { name: 'Solar Gold', hex: '#F59E0B', usage: '태양광 에너지' },
          { name: 'Forest Bio', hex: '#065F46', usage: '깊은 숲 베이스' },
          { name: 'Clean Emerald', hex: '#10B981', usage: '재생 에너지 뱃지' },
          { name: 'Warm Parchment', hex: '#FEF3C7', usage: '따스한 빛 패널' }
        ]
      }
    ]
  }
];

/** 스타일별 시그니처 모션 / 썸네일 모티프. 기존 레코드에 런타임으로 병합한다. */
export const STYLE_MOTION = {
  'swiss-grid': { motionProfile: 'grid-reveal', thumbMotif: 'grid-lines' },
  'corporate-minimal': { motionProfile: 'sparkline', thumbMotif: 'saas-nav' },
  'high-contrast-mono': { motionProfile: 'caret-blink', thumbMotif: 'terminal' },
  'raw-brutalism': { motionProfile: 'hard-punch', thumbMotif: 'raw-html' },
  'neo-brutalism': { motionProfile: 'hard-press', thumbMotif: 'hard-shadow' },
  'cyber-brutalism': { motionProfile: 'glitch-scan', thumbMotif: 'neon-wire' },
  'glassmorphism': { motionProfile: 'glass-orb', thumbMotif: 'frost-orbs' },
  'neumorphism': { motionProfile: 'inset-press', thumbMotif: 'soft-knob' },
  'skeuomorphism': { motionProfile: 'analog-needle', thumbMotif: 'metal-dial' },
  'memphis': { motionProfile: 'confetti-spin', thumbMotif: 'geo-confetti' },
  'synthwave': { motionProfile: 'sun-grid', thumbMotif: 'outrun-sun' },
  'vaporwave': { motionProfile: 'vhs-shift', thumbMotif: 'statue-win95' },
  'high-fashion': { motionProfile: 'ken-burns', thumbMotif: 'serif-spread' },
  'fluid-organic': { motionProfile: 'blob-morph', thumbMotif: 'warm-blob' },
  'dark-minimal-glass': { motionProfile: 'glow-breathe', thumbMotif: 'oled-panel' },
  'y2k-chrome': { motionProfile: 'holo-sweep', thumbMotif: 'chrome-disc' },
  'frutiger-aero': { motionProfile: 'aqua-bubble', thumbMotif: 'aqua-sphere' },
  'pixel-arcade': { motionProfile: 'pixel-blink', thumbMotif: 'arcade-hud' },
  'kinetic-type': { motionProfile: 'marquee-stagger', thumbMotif: 'speed-type' },
  'bento-grid': { motionProfile: 'tile-stagger', thumbMotif: 'bento-tiles' },
  'acid-techno': { motionProfile: 'hue-distort', thumbMotif: 'acid-smile' },
  'claymorphism': { motionProfile: 'squash-breathe', thumbMotif: 'clay-bubble' },
  'handcrafted-indie': { motionProfile: 'tape-peel', thumbMotif: 'kraft-tape' },
  'solarpunk-eco': { motionProfile: 'leaf-sway', thumbMotif: 'solar-leaf' }
};

MAIN_CATEGORIES.forEach((cat) => {
  cat.subCategories.forEach((sub) => {
    const meta = STYLE_MOTION[sub.id];
    if (meta) Object.assign(sub, meta);
  });
});

export function getAllSubDesigns() {
  const list = [];
  MAIN_CATEGORIES.forEach((cat) => {
    cat.subCategories.forEach((sub) => {
      list.push({
        ...sub,
        categoryId: cat.id,
        categoryTitle: cat.title,
        categoryTitleEn: cat.titleEn,
        accentColor: cat.accentColor,
        icon: cat.icon
      });
    });
  });
  return list;
}

export function findSubById(subId) {
  return getAllSubDesigns().find((s) => s.id === subId) || null;
}

export function findCategoryById(catId) {
  return MAIN_CATEGORIES.find((c) => c.id === catId) || null;
}

export function findCategoryBySubId(subId) {
  for (const cat of MAIN_CATEGORIES) {
    if (cat.subCategories.some((s) => s.id === subId)) return cat;
  }
  return null;
}

/** dir: +1 next, -1 prev. sameCategory면 해당 대분류 안에서만 순환. */
export function getAdjacentSub(subId, dir = 1, { sameCategory = true } = {}) {
  const current = findSubById(subId);
  if (!current) return getAllSubDesigns()[0] || null;
  const list = sameCategory
    ? getAllSubDesigns().filter((s) => s.categoryId === current.categoryId)
    : getAllSubDesigns();
  const i = list.findIndex((s) => s.id === subId);
  if (i < 0) return list[0] || current;
  return list[(i + dir + list.length) % list.length];
}
