/**
 * 실무 모던 & 클린 그룹 (7종)
 * 각 스타일은 고유 서체, 컬러 체계, 표면 물리, AI 바이브 코딩 가드레일, 4대 도메인 맞춤 카피를 가진다.
 */

export const MODERN_STYLES = Object.freeze([
  {
    id: 'swiss-grid',
    number: '01',
    group: 'modern',
    nameKo: '스위스 그리드 모더니즘',
    nameEn: 'Swiss Grid Modernism',
    tagline: '12열 수학적 그리드, 무채색 지면, 시그널 레드 포인트로 질서를 세우는 국제 타이포그래피 양식',
    traits: ['12열 수학 그리드', '0px 직각 모서리', '시그널 레드 악센트'],
    polarity: 'light',
    fonts: {
      display: "'Space Grotesk', 'Noto Sans KR', 'Helvetica Neue', sans-serif",
      body: "'Inter', 'Noto Sans KR', sans-serif",
      mono: "'JetBrains Mono', monospace",
      displayName: 'Space Grotesk + Noto Sans KR',
      bodyName: 'Inter',
      monoName: 'JetBrains Mono'
    },
    palette: [
      { role: '배경 (Paper)', roleEn: 'Paper Background', hex: '#F4F3EE' },
      { role: '표면 (Surface)', roleEn: 'Card Surface', hex: '#FFFFFF' },
      { role: '잉크 (Ink)', roleEn: 'Primary Ink', hex: '#111111' },
      { role: '악센트 (Signal Red)', roleEn: 'Signal Red Accent', hex: '#D12614' },
      { role: '보조 선 (Grid Rule)', roleEn: 'Grid Rule Neutral', hex: '#575652' }
    ],
    cssVars: {
      '--bg': '#F4F3EE',
      '--surface': '#FFFFFF',
      '--surface-2': '#EAE8E1',
      '--ink': '#111111',
      '--ink-muted': '#575652',
      '--accent': '#D12614',
      '--accent-text': '#B81F0F',
      '--accent-2': '#111111',
      '--accent-ink': '#FFFFFF',
      '--border': '#111111',
      '--border-w': '1.5px',
      '--radius': '0px',
      '--radius-sm': '0px',
      '--shadow': 'none'
    },
    specimen: {
      kicker: 'GRID 01 / 1957',
      headline: 'ORDER BY GRID',
      sub: '비대칭 균형 · 엄격한 산세리프',
      badge: '№ 01'
    },
    dna: {
      philosophyKo: '장식을 모두 걷어내고 수학적 격자, 극단적 크기 대비의 타이포그래피, 단 하나의 원색 신호등(시그널 레드)만으로 정보 위계를 명확히 전달합니다.',
      philosophyEn: 'Strips away all ornament to communicate hierarchy purely through mathematical grid alignment, extreme typographic scale contrast, and a single signal-red accent.',
      layoutRulesKo: [
        '모든 섹션과 카드를 1px~1.5px 수직·수평 헤어라인 격자선으로 분할한다.',
        '좌측 정렬(Flush-left)과 의도적인 여백 블록으로 비대칭 긴장감을 만든다.',
        '번호 인덱스(01, 02, 03)와 메타 라벨을 소문자 없는 대문자·모노스페이스로 정렬한다.'
      ],
      layoutRulesEn: [
        'Divide sections and cards with crisp 1px–1.5px hairline grid rules.',
        'Create asymmetric balance via strict flush-left typography and deliberate negative space.',
        'Index blocks with tabular numbering (01, 02, 03) and tight uppercase metadata.'
      ],
      surfaceRulesKo: [
        '모든 카드·버튼·입력창의 border-radius는 0px 직각을 엄수한다.',
        '그라디언트, 블러, 드롭 섀도우를 완전히 배제하고 명암과 선으로만 구분한다.',
        '배경은 순백(#FFFFFF)보다 따뜻한 오프화이트 지면(#F4F3EE)을 사용한다.'
      ],
      surfaceRulesEn: [
        'Keep border-radius strictly 0px across cards, buttons, and inputs.',
        'Zero gradients, zero blur, zero drop shadows—separate planes solely with rules and contrast.',
        'Use warm archival off-white paper (#F4F3EE) with crisp white content cells.'
      ],
      typographyRulesKo: [
        '헤드라인은 굵은 산세리프(700)에 좁은 자간(-0.04em)과 타이트한 행간(0.95~1.05)을 적용한다.',
        '수치 데이터는 tabular-nums로 칼같이 세로 줄을 맞춘다.'
      ],
      typographyRulesEn: [
        'Set headlines in bold geometric grotesque (700) with tight tracking (-0.04em) and line-height (0.95–1.05).',
        'Use tabular numerals for every metric and index.'
      ],
      dosKo: [
        '명확한 12열 그리드와 노출된 1px 검정 구분선 사용',
        '시그널 레드(#E6321E)는 핵심 CTA·활성 상태·포인트 블록에만 절제해서 사용',
        '번호 매김(01 / 02 / 03)과 데이터 표 스타일의 정갈한 정보 밀도 유지',
        '대비 높은 흑/백 타이포 위계로 3초 안에 핵심 메시지 전달'
      ],
      dosEn: [
        'Expose crisp 1px black gridlines and strict column alignments',
        'Reserve Signal Red (#E6321E) strictly for primary CTAs, active states, and focal geometry',
        'Use tabular numbering (01, 02, 03) and editorial specification lists',
        'Rely on stark typographic scale contrast rather than decorative graphics'
      ],
      dontsKo: [
        '둥근 모서리(rounded-xl), 부드러운 드롭 섀도우, 유리 블러 절대 금지',
        '보라색·파스텔 그라디언트나 장식용 이모지 남발 금지',
        '가운데 정렬 위주의 밋밋한 대칭 레이아웃 금지',
        '3가지 이상의 원색을 동시에 섞어 시선을 분산시키지 말 것'
      ],
      dontsEn: [
        'Never add rounded corners, soft drop shadows, or frosted glass blur',
        'Avoid gradients, neon glows, or decorative emojis',
        'Avoid generic centered symmetry—favor purposeful asymmetric grids',
        'Never introduce multiple competing accent hues beyond Signal Red'
      ],
      domainTipsKo: {
        web: '상단 얇은 수평 헤더 아래 거대한 2단 비대칭 타이포 히어로와 1px 격자 피처 테이블을 배치하세요.',
        mobile: '화면을 직선 구획으로 나누고 하단 탭도 1px 상단선 + 굵은 텍스트/인덱스 숫자로 처리하세요.',
        game: '정밀 좌표 퍼즐이나 전략 보드 HUD처럼 모눈 격자, 좌표축, 붉은 타겟 마커로 긴장감을 주세요.',
        dashboard: '카드 그림자 없이 경계선이 맞물린(border-collapse) 매트릭스 KPI와 각진 직선 차트를 쓰세요.'
      },
      domainTipsEn: {
        web: 'Pair an asymmetric mega-headline hero with a 1px hairline feature matrix.',
        mobile: 'Partition screens with razor rules and bold indexed navigation tabs.',
        game: 'Build a precision tactical coordinate grid with stark red lock-on markers.',
        dashboard: 'Use flush-border KPI matrices and crisp angular line charts without drop shadows.'
      }
    },
    showcase: {
      web: {
        brand: 'HELVETICA ARCHIVE',
        nav: ['시스템', '그리드', '아카이브', '규격'],
        kicker: 'INTERNATIONAL TYPOGRAPHIC STYLE · № 01',
        title: '질서는 가장 강력한 시각 언어다',
        subtitle: '장식을 덜어낸 12열 비례 그리드와 극명한 서체 대비로 복잡한 제품 정보를 1초 만에 읽히게 설계합니다.',
        primaryCta: '그리드 규격서 열기',
        secondaryCta: '사례 인덱스',
        metrics: [
          { label: '그리드 컬럼', value: '12 COL' },
          { label: '모서리 반경', value: '0 PX' },
          { label: '명암 대비', value: '18.4 : 1' }
        ],
        features: [
          { num: '01', title: '수학적 모듈 분할', desc: '8px 베이스라인과 수직 규칙선으로 모든 카드와 여백의 비례를 고정합니다.' },
          { num: '02', title: '단일 신호등 악센트', desc: '시그널 레드는 오직 행동 유도 버튼과 핵심 지표 포인터에만 허용합니다.' },
          { num: '03', title: '편집형 위계 구조', desc: '초대형 헤드라인과 정밀 모노스페이스 메타데이터의 극적인 스케일 차이를 활용합니다.' }
        ]
      },
      mobile: {
        appName: 'METRONOME 01',
        greeting: '오늘의 편집 일정',
        primaryCardTitle: '제12호 타이포 교정',
        primaryCardMeta: '진행률 84% · 14:00 마감',
        items: [
          { tag: '01', title: '그리드 베이스라인 검수', status: '완료' },
          { tag: '02', title: '시그널 레드 명도 확인', status: '진행' },
          { tag: '03', title: '인쇄용 PDF 12열 출력', status: '대기' }
        ],
        detailTitle: '레이아웃 모듈 설정',
        detailSub: '기준 간격 8px · 12열 분할'
      },
      game: {
        genre: 'PRECISION GRID PUZZLE',
        title: 'SECTOR 12 // TACTICAL LOCK',
        player: 'UNIT-01',
        bossName: 'NODE MATRIX X-12',
        bossSub: '좌표 동기화 대상 · 정밀 타격',
        hpLabel: 'SYNC',
        mpLabel: 'GRID',
        skills: [
          { key: 'Q', name: '스캔 펄스', dmg: 120 },
          { key: 'W', name: '축 정렬', dmg: 185 },
          { key: 'E', name: '레드 락온', dmg: 260 },
          { key: 'R', name: '전면 리셋', dmg: 390 }
        ],
        logInit: '좌표 [04, 08] 포착. 타겟 노드를 클릭해 동기화하십시오.'
      },
      dashboard: {
        brand: 'ZURICH OPS',
        title: '시스템 정밀도 지표',
        kpis: [
          { label: '그리드 정합률', value: '99.8%', delta: '+0.4%' },
          { label: '평균 응답 속도', value: '18ms', delta: '-4ms' },
          { label: '활성 배포 노드', value: '1,248', delta: '+62' },
          { label: '오류 발생률', value: '0.02%', delta: '-0.01%' }
        ]
      }
    }
  },
  {
    id: 'bento-grid',
    number: '02',
    group: 'modern',
    nameKo: '벤토 UI 2.0',
    nameEn: 'Bento Modular Grid',
    tagline: '도시락 칸처럼 비대칭 크기 카드를 치밀하게 조합해 기능과 수치를 한눈에 보여주는 애플·실리콘밸리형 모던 그리드',
    traits: ['비대칭 모듈 타일', '정교한 1px 보더', '높은 정보 스캔성'],
    polarity: 'light',
    fonts: {
      display: "'Outfit', 'Noto Sans KR', sans-serif",
      body: "'Inter', 'Noto Sans KR', sans-serif",
      mono: "'JetBrains Mono', monospace",
      displayName: 'Outfit + Noto Sans KR',
      bodyName: 'Inter',
      monoName: 'JetBrains Mono'
    },
    palette: [
      { role: '캔버스 (Canvas)', roleEn: 'Cool Light Canvas', hex: '#F5F5F7' },
      { role: '타일 표면 (Tile)', roleEn: 'Modular Tile Surface', hex: '#FFFFFF' },
      { role: '주요 텍스트 (Ink)', roleEn: 'Primary Charcoal Ink', hex: '#1D1D1F' },
      { role: '시그니처 블루 (Accent)', roleEn: 'Signature Cobalt Accent', hex: '#0066FF' },
      { role: '보조 라벤더 (Tint)', roleEn: 'Secondary Indigo Tint', hex: '#5E5CE6' }
    ],
    cssVars: {
      '--bg': '#F5F5F7',
      '--surface': '#FFFFFF',
      '--surface-2': '#ECEEF2',
      '--ink': '#1D1D1F',
      '--ink-muted': '#5A5A60',
      '--accent': '#0066FF',
      '--accent-text': '#0052CC',
      '--accent-2': '#5E5CE6',
      '--accent-ink': '#FFFFFF',
      '--border': 'rgba(29, 29, 31, 0.09)',
      '--border-w': '1px',
      '--radius': '24px',
      '--radius-sm': '14px',
      '--shadow': '0 2px 12px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.03)'
    },
    specimen: {
      kicker: 'MODULAR SYSTEM',
      headline: 'Bento 2.0',
      sub: '기능별 비대칭 카드 조합',
      badge: '120Hz'
    },
    dna: {
      philosophyKo: '중요도에 따라 2×2 대형 하이라이트 타일, 2×1 와이드 지표 타일, 1×1 마이크로 타일을 맞물려 배치함으로써 스크롤 없이도 제품의 핵심 가치를 단번에 스캔하게 만듭니다.',
      philosophyEn: 'Arranges heterogeneous 2x2 hero tiles, 2x1 wide feature cells, and 1x1 stat tiles into a tightly aligned visual bento box for effortless scanning.',
      layoutRulesKo: [
        '모든 타일 사이의 간격(gap)은 12px~16px로 엄격히 통일해 깔끔한 도시락 경계를 유지한다.',
        '핵심 피처는 col-span-2 / row-span-2로 면적을 키워 시각적 무게중심을 만든다.',
        '각 타일 내부에는 단 하나의 메시지(숫자 1개 또는 기능 1개)만 담아 과밀을 막는다.'
      ],
      layoutRulesEn: [
        'Maintain uniform 12px–16px gutters across every tile seam.',
        'Anchor visual hierarchy by assigning 2x2 or 2x1 spans to hero features.',
        'Limit each tile to one core visual story (one metric, one visual, or one action).'
      ],
      surfaceRulesKo: [
        '배경(#F5F5F7)과 순백 타일(#FFFFFF)의 미세한 명도 차이에 1px 반투명 보더를 얹는다.',
        '바깥 모서리 반경은 24px, 내부 중첩 요소는 14px로 동심원 곡률 규칙(outer = inner + padding)을 지킨다.',
        '한두 개의 포인트 타일만 딥 다크(#1D1D1F)나 블루 악센트로 반전해 리듬감을 준다.'
      ],
      surfaceRulesEn: [
        'Pair cool light-gray canvas (#F5F5F7) with crisp white tiles (#FFFFFF) and subtle 1px hairlines.',
        'Follow concentric radii (24px outer tile, 14px inner chips/controls).',
        'Invert 1–2 spotlight tiles to deep charcoal or brand blue to break monotony.'
      ],
      typographyRulesKo: [
        '핵심 수치는 2.2rem~3.2rem 굵은 Outfit으로 크게 띄우고 설명은 13px~14px 중립 그레이로 정돈한다.',
        '제목 자간은 -0.03em으로 팽팽하고 단정하게 맞춘다.'
      ],
      typographyRulesEn: [
        'Display oversized headline numbers in bold Outfit with crisp muted 13–14px captions.',
        'Keep display tracking tight (-0.03em) for Apple-grade editorial polish.'
      ],
      dosKo: [
        '서로 다른 비율(2×2, 2×1, 1×1)의 타일이 빈틈없이 맞물리는 CSS Grid 설계',
        '외부 카드와 내부 칩의 동심원 border-radius 일치시키기',
        '타일 1개당 1개의 핵심 비주얼·숫자·인터랙션만 담아 여백 확보',
        '1~2개의 다크 반전 타일로 화면 전체의 시각적 리듬 형성'
      ],
      dosEn: [
        'Compose asymmetric CSS Grid spans (2x2, 2x1, 1x1) that lock into clean rectangles',
        'Match concentric radii between outer tiles and inner badges/buttons',
        'Give each tile generous internal breathing room and a single focal point',
        'Contrast 1–2 dark inverted tiles against bright neutral surfaces'
      ],
      dontsKo: [
        '모든 카드를 똑같은 3열 균등 크기로만 나열하지 말 것 (벤토의 의미 상실)',
        '한 타일 안에 문단 3개와 버튼 4개를 욱여넣지 말 것',
        '진한 검은 외곽선이나 과장된 네온 글로우 그림자 금지',
        '타일 간 간격이 들쑥날쑥 어긋나게 두지 말 것'
      ],
      dontsEn: [
        'Never collapse into uniform equal-sized 3-column generic cards',
        'Avoid cramming paragraphs and multiple CTAs inside one small tile',
        'Avoid harsh thick outlines or heavy neon drop shadows',
        'Never break outer edge alignment across rows'
      ],
      domainTipsKo: {
        web: '히어로 바로 아래 6열 벤토 스펙 보드(대형 비주얼 타일 + 다크 반전 스펙 타일 + 수치 타일)를 배치하세요.',
        mobile: 'iOS 위젯처럼 2열 기반에 2×1 대형 요약 위젯과 1×1 퀵 액션 타일을 조합하세요.',
        game: '카드 덱빌더/전략 커맨드 허브처럼 유닛 스탯·에너지·스킬을 깔끔한 모듈 타일로 배치하세요.',
        dashboard: '핵심 매출 2×1 타일 옆에 작은 상태 타일들을 빈틈없이 맞물려 한 화면 대시보드를 만드세요.'
      },
      domainTipsEn: {
        web: 'Follow the hero with a 6-column modular bento showcase mixing light and dark spotlight tiles.',
        mobile: 'Mirror iOS widget grids combining full-width 2x1 summaries with 1x1 quick tiles.',
        game: 'Organize tactical deck/command stats into clean modular cards with crisp energy pips.',
        dashboard: 'Combine a hero trend tile with tightly nested micro-KPI modules.'
      }
    },
    showcase: {
      web: {
        brand: 'KINETIC STUDIO',
        nav: ['개요', '모듈', '벤치마크', '요금'],
        kicker: 'MODULAR PRODUCT ARCHITECTURE',
        title: '복잡한 워크플로를 한눈에 정리하는 모듈러 캔버스',
        subtitle: '정보의 우선순위에 맞춰 비대칭 타일로 구성한 차세대 제품 소개 및 인터랙티브 워크스페이스입니다.',
        primaryCta: '무료로 시작하기',
        secondaryCta: '아키텍처 보기',
        metrics: [
          { label: '렌더 프레임', value: '120 fps' },
          { label: '빌드 단축', value: '4.2×' },
          { label: '팀 만족도', value: '98.6%' }
        ],
        features: [
          { num: 'A1', title: '비대칭 포커스 타일', desc: '가장 중요한 기능을 2배 면적으로 확장해 사용자의 시선을 자연스럽게 유도합니다.' },
          { num: 'B2', title: '다크 스포트라이트 대비', desc: '밝은 캔버스 속 핵심 수치 타일만 딥 차콜로 반전해 리듬을 만듭니다.' },
          { num: 'C3', title: '동심원 곡률 시스템', desc: '외부 24px, 내부 14px 곡률 공식으로 하드웨어 제품 같은 정밀함을 구현합니다.' }
        ]
      },
      mobile: {
        appName: 'PULSE OS',
        greeting: '오늘의 컨디션 브리핑',
        primaryCardTitle: '집중 에너지 지수 92',
        primaryCardMeta: '어제보다 +11% 상승 · 최적 구간',
        items: [
          { tag: '집중', title: '딥워크 세션 3시간 달성', status: '완료' },
          { tag: '회복', title: '수면 리듬 7시간 40분', status: '최적' },
          { tag: '활동', title: '목표 걸음 8,420 / 10,000', status: '84%' }
        ],
        detailTitle: '위젯 모듈 배치',
        detailSub: '2×1 에너지 · 1×1 심박 · 1×1 일정'
      },
      game: {
        genre: 'MODULAR STRATEGY COMMAND',
        title: 'APEX DECK // TACTICAL HUB',
        player: 'CMDR. MIN',
        bossName: 'CORE SENTINEL MK.IV',
        bossSub: '방어막 모듈 3개 가동 중',
        hpLabel: 'SHIELD',
        mpLabel: 'ENERGY',
        skills: [
          { key: 'Q', name: '오버클럭', dmg: 140 },
          { key: 'W', name: '드론 일제사', dmg: 210 },
          { key: 'E', name: '실드 브레이크', dmg: 290 },
          { key: 'R', name: '코어 버스트', dmg: 420 }
        ],
        logInit: '전술 모듈 준비 완료. 코어 센티널을 클릭해 약점을 타격하세요.'
      },
      dashboard: {
        brand: 'CUBE ANALYTICS',
        title: '프로덕트 성장 벤토 보드',
        kpis: [
          { label: '월간 반복 매출', value: '₩1.42억', delta: '+18.4%' },
          { label: '일간 활성 팀', value: '14,820', delta: '+9.2%' },
          { label: '전환율', value: '6.48%', delta: '+1.1%' },
          { label: 'NPS 지수', value: '74', delta: '+6pt' }
        ]
      }
    }
  },
  {
    id: 'glassmorphism',
    number: '03',
    group: 'modern',
    nameKo: '프로스테드 글래스모피즘',
    nameEn: 'Frosted Glassmorphism',
    tagline: '깊이감 있는 오로라 메쉬 배경 위로 반투명 프로스트 유리 패널과 스펙큘러 하이라이트 테두리가 겹쳐 떠 있는 공간 UI',
    traits: ['반투명 프로스트 블러', '오로라 메쉬 배경', '스펙큘러 유리 테두리'],
    polarity: 'dark',
    fonts: {
      display: "'Outfit', 'Noto Sans KR', sans-serif",
      body: "'Inter', 'Noto Sans KR', sans-serif",
      mono: "'JetBrains Mono', monospace",
      displayName: 'Outfit + Noto Sans KR',
      bodyName: 'Inter',
      monoName: 'JetBrains Mono'
    },
    palette: [
      { role: '딥 스페이스 배경', roleEn: 'Deep Space Background', hex: '#0D132B' },
      { role: '유리 패널 (Glass)', roleEn: 'Frosted Glass Surface', hex: 'rgba(255,255,255,0.12)' },
      { role: '순백 텍스트 (Ink)', roleEn: 'Optical White Ink', hex: '#F8FAFF' },
      { role: '오로라 시안 (Accent)', roleEn: 'Aurora Cyan Accent', hex: '#5CE1FF' },
      { role: '네뷸라 바이올렛', roleEn: 'Nebula Violet Highlight', hex: '#A78BFA' }
    ],
    cssVars: {
      '--bg': '#0D132B',
      '--surface': 'rgba(255, 255, 255, 0.10)',
      '--surface-2': 'rgba(255, 255, 255, 0.16)',
      '--ink': '#F8FAFF',
      '--ink-muted': 'rgba(226, 236, 255, 0.78)',
      '--accent': '#5CE1FF',
      '--accent-text': '#7BE8FF',
      '--accent-2': '#A78BFA',
      '--accent-ink': '#071022',
      '--border': 'rgba(255, 255, 255, 0.24)',
      '--border-w': '1px',
      '--radius': '22px',
      '--radius-sm': '14px',
      '--shadow': '0 20px 48px rgba(4, 9, 28, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.35)'
    },
    specimen: {
      kicker: 'SPATIAL OPTICS',
      headline: 'Frosted Glass',
      sub: '다층 반투명 유리 · 광학 깊이감',
      badge: 'BLUR 24'
    },
    dna: {
      philosophyKo: '단색 배경 위에서는 유리가 보이지 않습니다. 풍부한 오로라 광원 메쉬 위에 다층 반투명 유리 패널을 띄우고, 상단 모서리에 얇은 빛 반사(inset highlight)를 더해 공간적 깊이감을 구현합니다.',
      philosophyEn: 'Glass only reads when vibrant ambient light flows behind it—layer frosted translucent planes over rich aurora orbs with crisp specular top edges.',
      layoutRulesKo: [
        '배경 레이어에 부드러운 멀티 오로라 광원(시안·인디고·바이올렛)을 깔아 유리의 투과감을 증명한다.',
        '전경·중경·배경의 2~3단계 Z축 깊이 계층을 투명도(0.08 / 0.14 / 0.22)로 구분한다.',
        '카드 사이 여백을 넉넉히 두어 뒤쪽 오로라 색감이 자연스럽게 비치도록 한다.'
      ],
      layoutRulesEn: [
        'Anchor every glass surface over luminous multi-color aurora gradient orbs.',
        'Differentiate depth tiers via stepped translucency (8%, 14%, 22% white fill).',
        'Leave generous spacing between panes so background light bleeds through.'
      ],
      surfaceRulesKo: [
        'backdrop-filter: blur(20px) saturate(160%)와 반투명 배경(rgba(255,255,255,0.1))을 조합한다.',
        '상단 1px 안쪽 하이라이트(inset 0 1px 0 rgba(255,255,255,0.38))로 유리 두께감을 표현한다.',
        '텍스트 가독성을 위해 유리 위의 글자는 순백(#F8FAFF)과 충분한 명도 대비를 유지한다.'
      ],
      surfaceRulesEn: [
        'Combine backdrop-filter: blur(20px) saturate(160%) with low-alpha white fill.',
        'Add a specular rim (inset 0 1px 0 rgba(255,255,255,0.35)) to simulate beveled glass.',
        'Ensure crisp pure-white text (#F8FAFF) maintains WCAG AA legibility over translucent layers.'
      ],
      typographyRulesKo: [
        '맑고 매끈한 지오메트릭 산세리프(Outfit/Inter)를 사용해 광학적 청량감을 유지한다.',
        '숫자와 보조 라벨에는 미세한 투명도(0.72)를 주어 계층을 부드럽게 나눈다.'
      ],
      typographyRulesEn: [
        'Pair clean geometric sans-serifs (Outfit/Inter) for optical clarity.',
        'Use translucent light tints (rgba 72%) for secondary metadata.'
      ],
      dosKo: [
        '유리 패널 뒤에 반드시 다채로운 오로라/메쉬 배경 레이어 배치',
        'backdrop-filter: blur + saturate + 상단 스펙큘러 inset highlight 3요소 동시 적용',
        '핵심 버튼은 유리보다 선명한 솔리드 시안/순백 대비로 시선 고정',
        '부드러운 20~24px 곡률로 광학 렌즈 같은 완성도 유지'
      ],
      dosEn: [
        'Always place rich ambient gradient light orbs behind frosted surfaces',
        'Combine blur, saturation boost, and top specular rim highlight together',
        'Keep primary CTAs high-contrast solid white or cyan so actions stand out clearly',
        'Use generous 20–24px radii reminiscent of spatial OS optics'
      ],
      dontsKo: [
        '단색 회색/흰색 배경 위에 반투명 카드만 올려 칙칙하게 만들지 말 것',
        '유리 카드 위에 저대비 회색 글씨를 써서 가독성을 망치지 말 것',
        '날카로운 0px 직각이나 굵은 검은 테두리 금지',
        '모든 요소에 과도한 블러를 중복 적용해 화면을 뿌옇게 뭉개지 말 것'
      ],
      dontsEn: [
        'Never place glass cards over flat dull gray backgrounds where translucency vanishes',
        'Never sacrifice text contrast on translucent surfaces',
        'Avoid harsh opaque dark outlines or sharp 0px corners',
        'Avoid stacking excessive blur layers that muddy legibility'
      ],
      domainTipsKo: {
        web: '딥 오로라 캔버스 위에 공중에 뜬 프로스트 유리 내비게이션과 스펙큘러 히어로 카드를 배치하세요.',
        mobile: 'visionOS 감성의 반투명 플로팅 카드와 맑은 글래스 하단 독 바를 구성하세요.',
        game: '우주선 브릿지 홀로그램 HUD처럼 반투명 전술 궤도 레이더와 빛나는 스러스터 게이지를 구현하세요.',
        dashboard: '어두운 오로라 배경 위 유리 KPI 타일과 빛나는 시안/바이올렛 영역 차트를 조합하세요.'
      },
      domainTipsEn: {
        web: 'Float frosted navigation pills and specular hero panes over deep aurora mesh light.',
        mobile: 'Design spatial OS translucent widget cards with floating frosted tab bars.',
        game: 'Craft a starship bridge holographic HUD with luminous orbital radar rings.',
        dashboard: 'Pair frosted glass KPI layers with glowing cyan/violet SVG area curves.'
      }
    },
    showcase: {
      web: {
        brand: 'AETHER OPTICS',
        nav: ['공간 UI', '광학 엔진', '쇼케이스', '문서'],
        kicker: 'SPATIAL GLASS INTERFACE · 2026',
        title: '빛이 투과하는 다층 공간 인터페이스',
        subtitle: '오로라 광원 위를 떠다니는 반투명 프로스트 유리 레이어와 스펙큘러 테두리로 몰입감 있는 깊이를 설계합니다.',
        primaryCta: '공간 데모 체험',
        secondaryCta: '광학 토큰 보기',
        metrics: [
          { label: '블러 반경', value: '24 px' },
          { label: '채도 증폭', value: '165%' },
          { label: '깊이 레이어', value: '3 Tier' }
        ],
        features: [
          { num: '01', title: '스펙큘러 림 라이트', desc: '유리 상단 1px 안쪽 하이라이트로 실제 광학 판재의 미세한 반사를 재현합니다.' },
          { num: '02', title: '오로라 광원 필드', desc: '뒤쪽에서 은은하게 흐르는 시안·바이올렛 메쉬가 유리 질감을 선명하게 살립니다.' },
          { num: '03', title: '고대비 공간 가독성', desc: '투명한 표면 위에서도 텍스트가 흐려지지 않도록 순백 잉크와 명도 균형을 유지합니다.' }
        ]
      },
      mobile: {
        appName: 'LUMINA HOME',
        greeting: '거실 공간 조명 활성',
        primaryCardTitle: '오로라 무드 씬 78%',
        primaryCardMeta: '실내 22.5°C · 습도 46% · 쾌적',
        items: [
          { tag: '조명', title: '스카이 라이트 디밍', status: '78%' },
          { tag: '공조', title: '에어 퓨리파이어 자동', status: '청정' },
          { tag: '보안', title: '스마트 글래스 잠금', status: '활성' }
        ],
        detailTitle: '공간 광원 제어',
        detailSub: '색온도 5200K · 프로스트 투과 40%'
      },
      game: {
        genre: 'SPATIAL STARSHIP BRIDGE HUD',
        title: 'ORBITAL BRIDGE // SECTOR 09',
        player: 'CAPT. ARIA',
        bossName: 'ASTRAL ANOMALY V-9',
        bossSub: '궤도 중력장 감지 · 스캔 중',
        hpLabel: 'HULL',
        mpLabel: 'FLUX',
        skills: [
          { key: 'Q', name: '이온 빔', dmg: 150 },
          { key: 'W', name: '프리즘 배리어', dmg: 190 },
          { key: 'E', name: '중력 펄스', dmg: 280 },
          { key: 'R', name: '노바 수렴', dmg: 440 }
        ],
        logInit: '함교 홀로그램 레이더 가동. 궤도 이상체를 클릭해 위상 에너지를 발사하세요.'
      },
      dashboard: {
        brand: 'AETHER CLOUD',
        title: '글로벌 엣지 광학 텔레메트리',
        kpis: [
          { label: '초당 요청 수', value: '482K/s', delta: '+14.2%' },
          { label: '평균 엣지 지연', value: '11.4ms', delta: '-2.1ms' },
          { label: '가동 가용성', value: '99.99%', delta: '+0.01%' },
          { label: '활성 리전', value: '38', delta: '+4' }
        ]
      }
    }
  },
  {
    id: 'dark-minimal-glass',
    number: '04',
    group: 'modern',
    nameKo: '리니어 다크 테크',
    nameEn: 'Linear Dark Tech',
    tagline: '딥 옵시디언 블랙, 1px 그라데이션 하이라이트 보더, 극도로 절제된 타이포로 완성한 차세대 개발자 SaaS 다크 미학',
    traits: ['딥 옵시디언 표면', '1px 탑 하이라이트 선', '극도로 절제된 밀도'],
    polarity: 'dark',
    fonts: {
      display: "'Inter', 'Noto Sans KR', sans-serif",
      body: "'Inter', 'Noto Sans KR', sans-serif",
      mono: "'JetBrains Mono', monospace",
      displayName: 'Inter + JetBrains Mono',
      bodyName: 'Inter',
      monoName: 'JetBrains Mono'
    },
    palette: [
      { role: '옵시디언 배경', roleEn: 'Obsidian Canvas', hex: '#08090C' },
      { role: '엘리베이트 표면', roleEn: 'Elevated Charcoal Surface', hex: '#111318' },
      { role: '선명한 텍스트', roleEn: 'Silver White Ink', hex: '#F2F4F8' },
      { role: '일렉트릭 인디고', roleEn: 'Electric Indigo Accent', hex: '#7C8CFF' },
      { role: '미세 보더/뮤트', roleEn: 'Hairline Muted Border', hex: '#262A35' }
    ],
    cssVars: {
      '--bg': '#08090C',
      '--surface': '#111318',
      '--surface-2': '#171A22',
      '--ink': '#F2F4F8',
      '--ink-muted': '#969DB0',
      '--accent': '#7C8CFF',
      '--accent-text': '#94A2FF',
      '--accent-2': '#38BDF8',
      '--accent-ink': '#08090C',
      '--border': 'rgba(255, 255, 255, 0.09)',
      '--border-w': '1px',
      '--radius': '12px',
      '--radius-sm': '8px',
      '--shadow': '0 1px 0 inset rgba(255, 255, 255, 0.08), 0 18px 40px rgba(0, 0, 0, 0.55)'
    },
    specimen: {
      kicker: 'PRECISION DARK SAAS',
      headline: 'Linear Craft',
      sub: '옵시디언 다크 · 1px 빛의 경계',
      badge: '⌘K'
    },
    dna: {
      philosophyKo: '화려한 색을 뿌리는 대신 순수한 암흑(#08090C) 위에 2~3단계의 미세한 명도 계단(#111318, #171A22)과 상단 1px 빛반사 선만으로 극도의 정교함과 엔지니어링 신뢰감을 만듭니다.',
      philosophyEn: 'Achieves precision engineering craft through subtle luminance steps on deep obsidian (#08090C), hairline 1px top highlights, and ultra-crisp micro-typography.',
      layoutRulesKo: [
        '상단에서 은은하게 내려오는 단일 라디얼 스포트라이트로 히어로 중앙에 미세한 빛을 비춘다.',
        '모든 카드·행·리스트를 1px 저대비 헤어라인(rgba(255,255,255,0.08))으로 정밀하게 구분한다.',
        '단축키 힌트(⌘K, G I 등)와 작은 상태 도트를 적재적소에 배치해 프로 도구 감각을 살린다.'
      ],
      layoutRulesEn: [
        'Cast a subtle overhead radial spotlight at the hero apex without flooding the viewport.',
        'Define all panels and list rows with ultra-crisp 1px hairlines (rgba(255,255,255,0.08)).',
        'Include compact keyboard shortcut badges (⌘K) and status micro-indicators.'
      ],
      surfaceRulesKo: [
        '배경은 순흑(#000)이 아닌 깊이 있는 옵시디언(#08090C), 카드는 #111318을 사용한다.',
        '카드 상단에 inset 0 1px 0 rgba(255,255,255,0.09) 하이라이트로 정밀 가공된 느낌을 준다.',
        '악센트(#7C8CFF)는 활성 탭·핵심 그래프·주요 버튼에만 핀포인트로 제한한다.'
      ],
      surfaceRulesEn: [
        'Use rich obsidian (#08090C) canvas and stepped #111318 elevated surfaces rather than flat #000.',
        'Highlight top borders with subtle 1px inner light sheen.',
        'Apply the indigo accent (#7C8CFF) sparingly as a surgical focal cue.'
      ],
      typographyRulesKo: [
        '헤드라인은 순백에서 옅은 은빛으로 흐르는 미묘한 텍스트 그라디언트와 -0.04em 자간을 적용한다.',
        '본문 14px, 보조 메타 12px 모노스페이스로 단정한 밀도를 유지한다.'
      ],
      typographyRulesEn: [
        'Render display headlines in crisp silver-white with tight -0.04em tracking.',
        'Keep UI chrome compact (13–14px Inter body, 11–12px JetBrains Mono metadata).'
      ],
      dosKo: [
        '옵시디언 배경(#08090C)과 미세하게 밝은 카드(#111318)의 정교한 명도 계단',
        '카드 상단 1px 미세 광택선과 단축키 키캡(kbd) 디테일 활용',
        '헤드라인의 깔끔한 화이트-실버 대비와 좁은 자간 유지',
        '차트·배지·액션 버튼에서 불필요한 시각 소음 완전 제거'
      ],
      dosEn: [
        'Layer obsidian canvas and stepped dark charcoal cards with 1px inner top highlights',
        'Incorporate crisp monospace keycaps and subtle status dots',
        'Maintain tight headline tracking and restrained silver-to-muted text hierarchy',
        'Keep interactions razor-fast and visually quiet'
      ],
      dontsKo: [
        '네온 핑크·사이버펑크식 과도한 글로우를 사방에 깔지 말 것',
        '채도 높은 보라색 그라디언트 카드로 화면 전체를 칠하지 말 것',
        '투박하게 큰 둥근 버튼이나 장난감 같은 그림자 사용 금지',
        '회색 배경에 저대비 회색 글씨를 겹쳐 가독성을 떨어뜨리지 말 것'
      ],
      dontsEn: [
        'Never flood the screen with loud cyberpunk neon glows or saturated purple cards',
        'Avoid chunky toy-like padding or oversized pill buttons',
        'Never use muddy mid-gray backgrounds that ruin obsidian contrast',
        'Avoid decorative clipart or cluttered borders'
      ],
      domainTipsKo: {
        web: '은은한 상단 스포트라이트 아래 날카로운 은빛 헤드라인, ⌘K 커맨드 프리뷰, 1px 구분 기능 그리드를 구성하세요.',
        mobile: '다크 프로덕티비티 앱처럼 얇은 구분선, 미세한 상태 점, 손쉬운 슬래시 액션 바를 배치하세요.',
        game: 'e스포츠 전술 로비/매치 HUD처럼 극도로 정돈된 다크 레이더, 정밀 핑/FPS, 로드아웃 카드를 만드세요.',
        dashboard: '개발자 모니터링 툴처럼 얇은 1px 선형 차트, 모노스페이스 로그, 빠른 필터 탭을 배치하세요.'
      },
      domainTipsEn: {
        web: 'Pair an overhead spotlight hero with sharp silver typography and 1px hairline feature grids.',
        mobile: 'Design a sleek pro productivity app with crisp list dividers and compact status indicators.',
        game: 'Build a minimalist esports tactical HUD with precision radar and clean loadout telemetry.',
        dashboard: 'Focus on 1px hairline telemetry charts, tabular monospace logs, and instant timeframe switches.'
      }
    },
    showcase: {
      web: {
        brand: 'VERGE ENGINE',
        nav: ['로드맵', '이슈 트래킹', '체인지로그', '엔터프라이즈'],
        kicker: 'BUILT FOR HIGH-VELOCITY TEAMS · ⌘K',
        title: '속도와 정밀함에 집착하는 팀의 제품 워크스페이스',
        subtitle: '시각적 소음을 모두 제거하고 1px의 정밀한 경계와 키보드 중심 인터랙션으로 개발 속도를 끌어올립니다.',
        primaryCta: '워크스페이스 생성',
        secondaryCta: '⌘K 커맨드 체험',
        metrics: [
          { label: '싱크 지연', value: '< 12ms' },
          { label: '키보드 커버리지', value: '100%' },
          { label: '업타임 SLA', value: '99.99%' }
        ],
        features: [
          { num: '01', title: '옵시디언 명도 계층', desc: '단 3단계의 미세한 어두운 표면과 1px 상단 광택으로 눈의 피로 없이 위계를 구분합니다.' },
          { num: '02', title: '서지컬 악센트', desc: '일렉트릭 인디고는 오직 포커스된 상태와 핵심 지표에만 절제되어 나타납니다.' },
          { num: '03', title: '모노스페이스 텔레메트리', desc: '커밋 해시, 응답 시간, 키캡 단축키를 칼같이 정렬해 프로 도구의 신뢰감을 줍니다.' }
        ]
      },
      mobile: {
        appName: 'VERGE MOBILE',
        greeting: '릴리스 v3.4 파이프라인',
        primaryCardTitle: 'PR #418 병합 대기 중',
        primaryCardMeta: '테스트 142건 통과 · 2분 전 갱신',
        items: [
          { tag: 'ENG-91', title: '엣지 캐시 무효화 최적화', status: '리뷰' },
          { tag: 'ENG-94', title: '다크 토큰 대비 4.5 검증', status: '완료' },
          { tag: 'ENG-98', title: '키보드 커맨드 팔레트', status: '진행' }
        ],
        detailTitle: '배포 체크리스트',
        detailSub: '프로덕션 · us-east / ap-northeast'
      },
      game: {
        genre: 'ESPORTS TACTICAL MATCH HUD',
        title: 'VALOR OPS // MATCH TELEMETRY',
        player: 'OP_KAI [14ms]',
        bossName: 'TARGET ALPHA-04',
        bossSub: '전술 구역 B · 정밀 조준 모드',
        hpLabel: 'ARMOR',
        mpLabel: 'TACTIC',
        skills: [
          { key: 'Q', name: '정찰 핑', dmg: 130 },
          { key: 'W', name: 'EMP 펄스', dmg: 200 },
          { key: 'E', name: '정밀 사격', dmg: 310 },
          { key: 'R', name: '오비탈 타격', dmg: 460 }
        ],
        logInit: '전술 링크 연결됨. 레이더 중앙 표적을 클릭해 정밀 타격을 실행하세요.'
      },
      dashboard: {
        brand: 'VERGE TELEMETRY',
        title: '인프라 실시간 관측 보드',
        kpis: [
          { label: 'P99 지연 시간', value: '24.2ms', delta: '-6.1ms' },
          { label: '배포 성공률', value: '99.94%', delta: '+0.08%' },
          { label: '활성 워커', value: '3,840', delta: '+240' },
          { label: '주간 처리 이슈', value: '412', delta: '+28%' }
        ]
      }
    }
  },
  {
    id: 'neumorphism',
    number: '05',
    group: 'modern',
    nameKo: '소프트 뉴모피즘',
    nameEn: 'Soft Tactile Neumorphism',
    tagline: '배경과 동일한 무광 표면에서 밝은 광원과 어두운 그림자만으로 부드럽게 솟고 파인 촉각적 압출 인터페이스',
    traits: ['이중 양각·음각 섀도우', '단일 톤 무광 표면', '물리적 압출 버튼'],
    polarity: 'light',
    fonts: {
      display: "'Outfit', 'Noto Sans KR', sans-serif",
      body: "'Inter', 'Noto Sans KR', sans-serif",
      mono: "'JetBrains Mono', monospace",
      displayName: 'Outfit + Inter',
      bodyName: 'Inter',
      monoName: 'JetBrains Mono'
    },
    palette: [
      { role: '기본 표면 (Base)', roleEn: 'Unified Matte Base', hex: '#E4E9F2' },
      { role: '상단 하이라이트', roleEn: 'Top-Left Light Source', hex: '#FFFFFF' },
      { role: '하단 그림자', roleEn: 'Bottom-Right Cast Shadow', hex: '#C2CBD9' },
      { role: '잉크 (Slate Ink)', roleEn: 'Deep Slate Ink', hex: '#2D3748' },
      { role: '촉각 악센트 (Blue)', roleEn: 'Tactile Cobalt Accent', hex: '#3B5BDB' }
    ],
    cssVars: {
      '--bg': '#E4E9F2',
      '--surface': '#E4E9F2',
      '--surface-2': '#DCE2EE',
      '--ink': '#2D3748',
      '--ink-muted': '#475569',
      '--accent': '#3B5BDB',
      '--accent-text': '#2B45C4',
      '--accent-2': '#0EA5E9',
      '--accent-ink': '#FFFFFF',
      '--border': 'rgba(255, 255, 255, 0.55)',
      '--border-w': '1px',
      '--radius': '22px',
      '--radius-sm': '14px',
      '--shadow': '9px 9px 18px #C2CBD9, -9px -9px 18px #FFFFFF'
    },
    specimen: {
      kicker: 'SOFT EXTRUDED UI',
      headline: 'Neumorphic',
      sub: '빛과 그림자로 조각한 단일 표면',
      badge: 'SOFT'
    },
    dna: {
      philosophyKo: '카드와 배경의 색을 완전히 동일(#E4E9F2)하게 맞춘 뒤, 좌상단의 밝은 빛(#FFFFFF)과 우하단의 부드러운 그림자(#C2CBD9)만으로 표면이 자연스럽게 솟아오르거나(convex) 안으로 패인(concave) 촉각적 부조를 만듭니다.',
      philosophyEn: 'Uses one unified matte base (#E4E9F2) sculpted solely by opposing top-left light (#FFFFFF) and bottom-right shadow (#C2CBD9) to extrude or recess controls.',
      layoutRulesKo: [
        '이중 그림자가 서로 부딪히지 않도록 모든 카드와 버튼 사이에 최소 20px~24px의 넉넉한 여백을 둔다.',
        '클릭 가능한 요소는 바깥으로 솟은 양각(outset), 입력창·진행바 트랙·활성 눌림 상태는 안으로 패인 음각(inset)으로 역할이 명확히 나뉘게 한다.',
        '복잡한 표보다 다이얼·토글·슬라이더·간결한 제어 패널 위주로 구성한다.'
      ],
      layoutRulesEn: [
        'Give elements generous 20–24px breathing room so opposing shadows never collide.',
        'Reserve raised outset shadows for clickable surfaces and inset shadows for inputs, tracks, and active pressed states.',
        'Favor tactile dials, toggles, and clean control decks over dense data tables.'
      ],
      surfaceRulesKo: [
        '배경과 카드 배경색은 반드시 동일한 미드-라이트 톤(#E4E9F2)을 사용한다 (순백에서는 하이라이트가 안 보임).',
        '양각: 8px 8px 16px #C2CBD9, -8px -8px 16px #FFFFFF / 음각: inset 6px 6px 12px #C2CBD9, inset -6px -6px 12px #FFFFFF.',
        '접근성 보완을 위해 텍스트는 진한 슬레이트(#2D3748)로, 핵심 상태 표시만 선명한 블루(#4F6DF5)로 강조한다.'
      ],
      surfaceRulesEn: [
        'Keep background and card fills identical in mid-light gray-blue (#E4E9F2) so white top-left highlights read clearly.',
        'Pair matched outset and inset dual-shadow pairs consistently from a single 135deg light source.',
        'Maintain strong WCAG contrast with dark slate ink (#2D3748) and crisp cobalt status accents.'
      ],
      typographyRulesKo: [
        '부드러운 지오메트릭 산세리프(Outfit/Inter)로 조형적 둥근 표면과 조화를 이룬다.',
        '강한 검정 대신 짙은 슬레이트(#2D3748) 잉크로 우아하고 부드러운 인상을 유지한다.'
      ],
      typographyRulesEn: [
        'Use soft geometric sans-serifs (Outfit/Inter) matching the sculptural rounded forms.',
        'Use deep slate (#2D3748) ink instead of harsh pure black.'
      ],
      dosKo: [
        '모든 요소에 좌상단(#FFF) + 우하단(#C2CBD9) 일관된 단일 광원 방향 적용',
        '입력창·프로그레스 트랙·눌린 버튼에는 반드시 inset 음각 그림자 사용',
        '여백을 넉넉하게 확보해 조각된 입체감이 온전히 드러나게 구성',
        '가독성 확보를 위해 텍스트와 아이콘 명암비를 4.5:1 이상 유지'
      ],
      dosEn: [
        'Keep one consistent top-left light source across every raised and recessed control',
        'Use inset recessed shadows for inputs, tracks, and pressed/active states',
        'Provide generous padding and gaps so soft shadows breathe cleanly',
        'Ensure crisp slate text and vivid accent indicators for accessibility'
      ],
      dontsKo: [
        '순백(#FFFFFF) 배경 위에 뉴모피즘을 적용하지 말 것 (흰 하이라이트 소실)',
        '진한 검은 외곽선(border: 2px solid black)으로 부드러운 압출감을 깨지 말 것',
        '양각과 음각 그림자 방향을 요소마다 제멋대로 섞지 말 것',
        '버튼 텍스트까지 연한 회색으로 두어 식별 불가능하게 만들지 말 것'
      ],
      dontsEn: [
        'Never use pure #FFFFFF background—the top-left specular shadow will disappear',
        'Never add dark heavy borders that ruin the seamless extruded surface illusion',
        'Never mix conflicting light directions between components',
        'Never use low-contrast gray text on soft gray buttons'
      ],
      domainTipsKo: {
        web: '단일 톤 캔버스 위에 부드럽게 솟은 히어로 카드, 음각 입력 필드, 둥근 압출 버튼으로 스마트 기기 감성을 표현하세요.',
        mobile: '스마트홈·웰니스 앱처럼 커다란 원형 양각 다이얼과 음각 상태 바를 배치하세요.',
        game: '촉각적인 메카/퍼즐 컨트롤러처럼 둥근 양각 방향키와 안으로 패인 에너지 게이지를 구현하세요.',
        dashboard: '과밀한 표 대신 큼직한 양각 KPI 패드와 음각 홈 안을 채우는 깔끔한 블루 차트를 사용하세요.'
      },
      domainTipsEn: {
        web: 'Build a seamless matte hardware-inspired landing page with raised hero slabs and recessed form inputs.',
        mobile: 'Craft a tactile smart-device controller with sculpted circular dials and recessed sliders.',
        game: 'Design a physical tactile mech-pad HUD with embossed skill buttons and recessed energy wells.',
        dashboard: 'Use spacious raised KPI pads paired with recessed chart wells and crisp cobalt trend strokes.'
      }
    },
    showcase: {
      web: {
        brand: 'TACTILE FORM',
        nav: ['하드웨어', '제어', '설계', '지원'],
        kicker: 'SCULPTED SOFT SURFACE UI',
        title: '손끝의 압력이 느껴지는 부드러운 압출 인터페이스',
        subtitle: '경계선 대신 단일 광원의 빛과 그림자로 모든 버튼과 패드를 조각해 물리적 편안함을 전달합니다.',
        primaryCta: '촉각 컨트롤 체험',
        secondaryCta: '광원 규칙 보기',
        metrics: [
          { label: '광원 각도', value: '135°' },
          { label: '압출 깊이', value: '9 px' },
          { label: '표면 통일도', value: '100%' }
        ],
        features: [
          { num: '01', title: '양각·음각 물리 대비', desc: '누를 수 있는 버튼은 바깥으로 솟고, 입력과 게이지 홈은 안으로 부드럽게 패입니다.' },
          { num: '02', title: '단일 톤 무광 캔버스', desc: '배경과 카드의 경계를 없애 마치 한 덩어리 실리콘에서 깎아낸 듯한 일체감을 줍니다.' },
          { num: '03', title: '접근성 명암 보강', desc: '소프트한 표면 위에도 짙은 슬레이트 잉크와 선명한 코발트 포인트로 가독성을 지킵니다.' }
        ]
      },
      mobile: {
        appName: 'AURA DIAL',
        greeting: '스튜디오 실내 환경',
        primaryCardTitle: '21.5°C 쾌적 유지',
        primaryCardMeta: '목표 온도 · 저소음 에코 운전 중',
        items: [
          { tag: '공기', title: '미세먼지 매우 좋음 (12)', status: 'ON' },
          { tag: '습도', title: '자동 가습 밸런스', status: '48%' },
          { tag: '조명', title: '소프트 웜톤 무드등', status: '65%' }
        ],
        detailTitle: '촉각 다이얼 제어',
        detailSub: '양각 스위치 · 음각 트랙 게이지'
      },
      game: {
        genre: 'TACTICAL MECH PAD',
        title: 'SOFTCORE // TACTILE DECK',
        player: 'PILOT 05',
        bossName: 'RESONANCE CORE',
        bossSub: '압력 균형 동기화 · 패드 타격',
        hpLabel: 'PRESS',
        mpLabel: 'PULSE',
        skills: [
          { key: 'Q', name: '소프트 펄스', dmg: 115 },
          { key: 'W', name: '압축 웨이브', dmg: 180 },
          { key: 'E', name: '공명 타격', dmg: 255 },
          { key: 'R', name: '하모닉 쇼크', dmg: 380 }
        ],
        logInit: '촉각 제어 패드 준비 완료. 중앙 공명 코어를 눌러 에너지를 방출하세요.'
      },
      dashboard: {
        brand: 'SOFT METRICS',
        title: '디바이스 웰니스 제어 보드',
        kpis: [
          { label: '연결 디바이스', value: '2,480', delta: '+7.4%' },
          { label: '평균 배터리', value: '88%', delta: '+3%' },
          { label: '에너지 절감', value: '31.5%', delta: '+4.2%' },
          { label: '정상 가동률', value: '99.7%', delta: '+0.2%' }
        ]
      }
    }
  },
  {
    id: 'high-contrast-mono',
    number: '06',
    group: 'modern',
    nameKo: '터미널 모노스페이스',
    nameEn: 'Terminal Monospace',
    tagline: '순흑 CRT 캔버스, 인광 그린과 앰버 텍스트, 고정폭 서체와 박스 드로잉 경계로 구현한 하드코어 CLI 엔지니어링 미학',
    traits: ['100% 고정폭 서체', '인광 그린·앰버 대비', 'CRT 스캔라인·프롬프트'],
    polarity: 'dark',
    fonts: {
      display: "'JetBrains Mono', 'Noto Sans KR', monospace",
      body: "'JetBrains Mono', 'Noto Sans KR', monospace",
      mono: "'JetBrains Mono', monospace",
      displayName: 'JetBrains Mono',
      bodyName: 'JetBrains Mono',
      monoName: 'JetBrains Mono'
    },
    palette: [
      { role: '터미널 블랙 (BG)', roleEn: 'CRT Terminal Black', hex: '#050805' },
      { role: '콘솔 표면', roleEn: 'Console Panel Surface', hex: '#0A120A' },
      { role: '인광 텍스트', roleEn: 'Phosphor Cream Ink', hex: '#D8FFE0' },
      { role: '포스포 그린 (Accent)', roleEn: 'Phosphor Green Signal', hex: '#22FF66' },
      { role: '워닝 앰버 (Accent2)', roleEn: 'Terminal Amber Warning', hex: '#FFB020' }
    ],
    cssVars: {
      '--bg': '#050805',
      '--surface': '#0A120A',
      '--surface-2': '#0F1C0F',
      '--ink': '#D8FFE0',
      '--ink-muted': '#7BC48B',
      '--accent': '#22FF66',
      '--accent-text': '#22FF66',
      '--accent-2': '#FFB020',
      '--accent-ink': '#050805',
      '--border': '#1F5C2E',
      '--border-w': '1px',
      '--radius': '0px',
      '--radius-sm': '0px',
      '--shadow': '0 0 24px rgba(34, 255, 102, 0.10)'
    },
    specimen: {
      kicker: 'root@sys:~#',
      headline: '> EXEC_UI',
      sub: '고정폭 CLI · 포스포 그린 터미널',
      badge: '[OK]'
    },
    dna: {
      philosophyKo: '화려한 일러스트 대신 순수한 텍스트, 1px 직각 터미널 프레임, 깜빡이는 커서, 그리고 `>` 프롬프트 기호로 시스템 내부를 직접 제어하는 듯한 날것의 개발자 카리스마를 표현합니다.',
      philosophyEn: 'Strips UI down to raw terminal precision—100% monospace alignment, 0px borders, phosphor green signals, and explicit command-line syntax.',
      layoutRulesKo: [
        '모든 컴포넌트 제목에 `[ SECTION ]`, `> COMMAND`, `PID:04` 같은 터미널 접두 표기를 일관되게 붙인다.',
        '0px 직각 프레임과 점선/실선 1px 그리드로 정보를 세로 칼럼으로 딱딱 맞춘다.',
        '상태 표시는 `[OK]`, `[RUN]`, `[WARN]` 대괄호 태그와 ASCII 막대 게이지(`██████░░`)로 표현한다.'
      ],
      layoutRulesEn: [
        'Prefix headers and labels with CLI notation ([ MODULE ], > EXEC, 0x04).',
        'Use strict 0px borders and monospace tabular alignment throughout.',
        'Represent status via bracketed badges ([OK], [WARN]) and segmented progress bars.'
      ],
      surfaceRulesKo: [
        '깊은 블랙-그린(#050805) 위에 아주 미세한 가로 스캔라인 질감을 얹는다.',
        '테두리는 어두운 에메랄드(#1F5C2E), 활성 포커스·핵심 수치는 선명한 포스포 그린(#22FF66)으로 빛낸다.',
        '보조 경고/주의 지표는 레트로 앰버(#FFB020)로 구분해 단조로움을 깬다.'
      ],
      surfaceRulesEn: [
        'Layer ultra-subtle horizontal CRT scanlines over pitch dark #050805.',
        'Use muted phosphor green borders (#1F5C2E) and vivid #22FF66 active focus states.',
        'Accent secondary alerts and highlights with terminal amber (#FFB020).'
      ],
      typographyRulesKo: [
        'UI 전체(제목·본문·버튼·라벨)를 예외 없이 고정폭 서체(JetBrains Mono)로 통일한다.',
        '대문자 라벨과 0.06em 자간으로 기계적 리듬을 강조한다.'
      ],
      typographyRulesEn: [
        'Use JetBrains Mono exclusively across headings, body, controls, and metrics.',
        'Apply uppercase tracking (+0.06em) for command headers and status badges.'
      ],
      dosKo: [
        '100% 고정폭 폰트 + 0px 직각 모서리 + `[TAG]` CLI 문법 일관 적용',
        '활성 버튼 hover 시 배경과 글자색이 완전히 반전되는 터미널 셀렉션 효과',
        '포스포 그린(#22FF66)과 앰버(#FFB020)의 2색 신호 체계 유지',
        '깜빡이는 블록 커서(`█`)나 실시간 로그 스트림으로 살아있는 콘솔 느낌 부여'
      ],
      dosEn: [
        'Enforce 100% monospace typography, 0px corners, and CLI bracket syntax',
        'Invert fill and ink colors cleanly on hover/active like terminal selection',
        'Use a disciplined 2-signal palette: phosphor green (#22FF66) + amber (#FFB020)',
        'Include subtle blinking cursor blocks or live log outputs'
      ],
      dontsKo: [
        '둥근 모서리, 파스텔 그림자, 세리프/손글씨 폰트 혼용 절대 금지',
        '눈이 아플 정도로 모든 본문에 강한 text-shadow 네온 블러를 떡칠하지 말 것',
        '사진이나 둥글둥글한 3D 일러스트를 억지로 넣지 말 것',
        '비례폭 산세리프 본문을 섞어 터미널 정체성을 깨뜨리지 말 것'
      ],
      dontsEn: [
        'Never add rounded corners, soft drop shadows, or proportional serif fonts',
        'Avoid heavy neon text-shadow blur on body paragraphs that hurts readability',
        'Never mix glossy 3D icons or rounded pastel badges',
        'Avoid inconsistent non-tabular number alignment'
      ],
      domainTipsKo: {
        web: '상단 `user@host:~$` 상태바 아래 커맨드 실행형 히어로와 1px 직각 스펙 테이블을 배치하세요.',
        mobile: '핸드헬드 포켓 터미널처럼 `[01]` 명령 리스트와 하단 커맨드 입력 바를 구성하세요.',
        game: '로그라이크 ASCII 던전 맵 + 실시간 전투 로그 터미널 + `[Q][W][E][R]` 매크로 키로 구성하세요.',
        dashboard: '`htop`·`btop` 스타일의 세그먼트 게이지, 실시간 패킷 차트, 모노스페이스 프로세스 표를 만드세요.'
      },
      domainTipsEn: {
        web: 'Structure as a living CLI spec page with command prompts and crisp tabular feature blocks.',
        mobile: 'Build a handheld cyber-deck terminal with bracketed action rows and command triggers.',
        game: 'Render a phosphor roguelike/hacker breach dungeon map with live monospace combat logs.',
        dashboard: 'Channel btop/htop precision with crisp step charts and monospace process telemetry.'
      }
    },
    showcase: {
      web: {
        brand: 'SYS://KERNEL_06',
        nav: ['[DOCS]', '[CLI]', '[BENCH]', '[SSH]'],
        kicker: 'ROOT@DESIGN-SHELL:~# ./INIT --MODE=MONO',
        title: '군더더기 0% — 순수 명령어와 텍스트의 고대비 인터페이스',
        subtitle: '장식 이미지를 완전히 배제하고 고정폭 서체, 직각 프레임, 즉각적인 키보드 피드백만으로 압도적 밀도를 제공합니다.',
        primaryCta: '> RUN_DEPLOY.SH',
        secondaryCta: '[MAN PAGE]',
        metrics: [
          { label: 'TTY_FPS', value: '240Hz' },
          { label: 'OVERHEAD', value: '0.4 KB' },
          { label: 'STATUS', value: '[ONLINE]' }
        ],
        features: [
          { num: '0x01', title: '100% 고정폭 정렬', desc: '모든 문자 폭이 동일해 표, 로그, 수치 비교 시 시선 흔들림이 전혀 없습니다.' },
          { num: '0x02', title: '즉각적 반전 피드백', desc: '포커스나 호버 시 녹색 배경에 흑색 글자로 반전되어 현재 커서 위치를 100% 확신시킵니다.' },
          { num: '0x03', title: '이중 신호 컬러', desc: '정상 실행은 포스포 그린, 주의·임계 수치는 앰버로 구분해 0.1초 만에 이상을 감지합니다.' }
        ]
      },
      mobile: {
        appName: 'POCKET_TTY',
        greeting: 'SSH_SESSION :: ACTIVE',
        primaryCardTitle: 'CLUSTER-KR-01 [OK]',
        primaryCardMeta: 'CPU 24% · MEM 4.1G / 16G · UP 42D',
        items: [
          { tag: '[OK]', title: 'nginx-edge-proxy.service', status: '12ms' },
          { tag: '[RUN]', title: 'pg-replica-sync.job', status: '88%' },
          { tag: '[WARN]', title: 'redis-cache-eviction', status: '74%' }
        ],
        detailTitle: 'EXEC :: QUICK_CMD',
        detailSub: '> tail -f /var/log/system.log'
      },
      game: {
        genre: 'ROGUELIKE BREACH TERMINAL',
        title: 'NET_BREACH // FLOOR_07',
        player: 'ROOT_01',
        bossName: 'ICE_FIREWALL_DAEMON',
        bossSub: 'PORT 443 암호화 코어 · 침투 중',
        hpLabel: 'INTEGRITY',
        mpLabel: 'CYCLES',
        skills: [
          { key: 'Q', name: 'INJECT()', dmg: 135 },
          { key: 'W', name: 'BRUTE_XOR', dmg: 195 },
          { key: 'E', name: 'OVERFLOW', dmg: 285 },
          { key: 'R', name: 'RM -RF //', dmg: 450 }
        ],
        logInit: '> [SYS] ICE_FIREWALL_DAEMON 감지. 중앙 노드를 클릭해 패킷을 주입하십시오.'
      },
      dashboard: {
        brand: 'BTOP://MONITOR',
        title: '노드 프로세스 및 패킷 관측',
        kpis: [
          { label: 'THROUGHPUT', value: '94.2 Gb/s', delta: '+11.4%' },
          { label: 'PACKET_LOSS', value: '0.001%', delta: '-0.002%' },
          { label: 'OPEN_SOCKETS', value: '18,402', delta: '+1,120' },
          { label: 'LOAD_AVG', value: '0.42', delta: '[NOMINAL]' }
        ]
      }
    }
  },
  {
    id: 'skeuomorphism',
    number: '07',
    group: 'modern',
    nameKo: '모던 스큐어모피즘',
    nameEn: 'Tactile Hardware Skeuomorphism',
    tagline: '브러시드 알루미늄, 가공 노브, 물리적 LED 램프와 정밀 눈금으로 Teenage Engineering·Braun 산업디자인을 재현한 촉각 하드웨어 UI',
    traits: ['브러시드 메탈 베젤', '물리적 버튼·LED 램프', '산업기기 정밀 눈금'],
    polarity: 'dark',
    fonts: {
      display: "'Space Grotesk', 'Noto Sans KR', sans-serif",
      body: "'Inter', 'Noto Sans KR', sans-serif",
      mono: "'JetBrains Mono', monospace",
      displayName: 'Space Grotesk + JetBrains Mono',
      bodyName: 'Inter',
      monoName: 'JetBrains Mono'
    },
    palette: [
      { role: '아노다이징 섀시', roleEn: 'Anodized Gunmetal Chassis', hex: '#23262B' },
      { role: '브러시드 패널', roleEn: 'Brushed Aluminum Panel', hex: '#2F333A' },
      { role: '각인 잉크 (Engraved)', roleEn: 'Engraved Legend Ink', hex: '#F0F2F5' },
      { role: '브라운 오렌지 (Accent)', roleEn: 'Dieter Rams Signal Orange', hex: '#FF5C1B' },
      { role: 'LED 에메랄드', roleEn: 'Active Status LED Green', hex: '#28E070' }
    ],
    cssVars: {
      '--bg': '#1E2126',
      '--surface': '#2C3037',
      '--surface-2': '#21242A',
      '--ink': '#F0F2F5',
      '--ink-muted': '#B2B8C4',
      '--accent': '#FF5C1B',
      '--accent-text': '#FF8552',
      '--accent-2': '#28E070',
      '--accent-ink': '#111317',
      '--border': '#424752',
      '--border-w': '1px',
      '--radius': '14px',
      '--radius-sm': '8px',
      '--shadow': '0 10px 24px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.14), inset 0 -2px 0 rgba(0, 0, 0, 0.45)'
    },
    specimen: {
      kicker: 'INDUSTRIAL CHASSIS',
      headline: 'HARDWARE 2.0',
      sub: '가공 알루미늄 · 물리 노브 · LED',
      badge: 'REC ●'
    },
    dna: {
      philosophyKo: '2000년대식 촌스러운 가죽 스티치가 아니라, 디터 람스(Braun)와 Teenage Engineering처럼 정밀 가공된 알루미늄 베젤, 살짝 들어간 LCD 창, 물리적 택타일 키캡과 작은 LED 점등으로 만지고 싶은 하드웨어 쾌감을 구현합니다.',
      philosophyEn: 'Channels Braun and Teenage Engineering industrial craft—anodized machined bezels, recessed LCD meters, physical keycap depth, and crisp LED status dots.',
      layoutRulesKo: [
        '화면을 실제 계측기/신시사이저 섀시 패널처럼 구획하고 코너에 미세한 나사/인덱스 마킹을 둔다.',
        '정보 출력부는 안으로 파인 어두운 LCD/OLED 창(recessed screen)에, 조작부는 입체 베벨 버튼에 배치한다.',
        '물리 눈금자(tick marks)와 채널 번호(`CH-01`, `GAIN`, `MODE`)를 각인 라벨처럼 정돈한다.'
      ],
      layoutRulesEn: [
        'Frame modules like machined hardware faceplates with crisp engraved micro-labels.',
        'Place readouts inside recessed dark LCD wells and controls on raised beveled caps.',
        'Use technical precision markings (CH-01, dB scales, physical tick marks).'
      ],
      surfaceRulesKo: [
        '모든 패널에 미세한 상단 금속 반사(inset 0 1px 0 rgba(255,255,255,0.16))와 하단 그림자 베벨(inset 0 -2px 0 rgba(0,0,0,0.45))을 적용한다.',
        '핵심 실행 키캡은 브라운 시그니처 오렌지(#FF5C1B), 활성 램프는 발광 LED 그린(#28E070)을 사용한다.',
        '버튼을 누를 때(active) 1~2px 아래로 물리적으로 눌리는 변위와 그림자 축소를 넣는다.'
      ],
      surfaceRulesEn: [
        'Sculpt panels with top metallic highlights (inset 0 1px) and bottom machined bevel shadows.',
        'Reserve Dieter Rams signal orange (#FF5C1B) for primary hardware keys and glowing green (#28E070) for active LEDs.',
        'Simulate physical key travel on :active with translateY(1px) and compressed bevel depth.'
      ],
      typographyRulesKo: [
        '각인 라벨은 대문자 모노스페이스(10~11px, 자간 +0.1em), 패널 타이틀은 단정한 Space Grotesk를 쓴다.',
        'LCD 내부 수치는 고정폭 숫자로 계측기 신뢰감을 극대화한다.'
      ],
      typographyRulesEn: [
        'Engrave hardware labels in tight uppercase JetBrains Mono (+0.1em tracking).',
        'Render all LCD readouts in crisp tabular monospace numerals.'
      ],
      dosKo: [
        '상단 하이라이트 + 하단 베벨의 입체 가공 메탈 패널 표현',
        '안으로 패인 어두운 LCD 계기판 창 + 발광하는 작은 원형 LED 인디케이터',
        '브라운 오렌지(#FF5C1B) 포인트 키캡과 정밀 각인 라벨(CH-01, SYNC)',
        '클릭 시 물리적으로 딸깍 눌리는 tactile active 상태 구현'
      ],
      dosEn: [
        'Sculpt machined metal panels with top sheen and bottom depth bevels',
        'Nest metrics inside dark recessed LCD screens with glowing LED status dots',
        'Use iconic signal-orange primary keys and engraved monospace hardware markings',
        'Provide realistic tactile key-press displacement on interaction'
      ],
      dontsKo: [
        '2008년식 과한 나무 무늬·갈색 가죽·두꺼운 반짝이 젤리 그라디언트 금지',
        '완전 플랫한 2D 박스만 나열해 물리적 재질감을 없애지 말 것',
        '무지개색 네온이나 파스텔 장난감 컬러를 섞지 말 것',
        '베벨 방향을 위아래로 뒤섞어 광원이 깨지게 만들지 말 것'
      ],
      dontsEn: [
        'Never resort to dated 2008 woodgrain, stitched leather, or glossy candy gradients',
        'Avoid completely flat un-beveled boxes that kill the tactile hardware feel',
        'Never mix pastel or rainbow colors onto an industrial chassis',
        'Keep top-down lighting consistent across every dial, bezel, and keycap'
      ],
      domainTipsKo: {
        web: '아노다이징 메탈 히어로 섀시, 오렌지 물리 CTA 키캡, 패인 LCD 스펙 미터로 산업디자인 제품 페이지를 만드세요.',
        mobile: '포켓 필드 레코더·카메라 앱처럼 원형 로터리 다이얼과 물리 셔터 키캡을 배치하세요.',
        game: '아날로그 조종석/필드 무선기 계기판처럼 회전 레티클, LED 게이지, 금속 토글 스위치를 구성하세요.',
        dashboard: '스튜디오 계측기 랙처럼 어두운 LCD 차트 베이와 오렌지/그린 LED 상태 램프를 조합하세요.'
      },
      domainTipsEn: {
        web: 'Design an industrial hardware flagship page with recessed LCD spec windows and orange physical keys.',
        mobile: 'Channel a precision pocket camera or field controller with machined dials and LED dots.',
        game: 'Build a tactile analog cockpit HUD with riveted bezels, rotary crosshairs, and glowing LED meters.',
        dashboard: 'Frame data charts inside dark recessed oscilloscope/LCD bays with metallic rack headers.'
      }
    },
    showcase: {
      web: {
        brand: 'FIELD UNIT // MK-II',
        nav: ['CHASSIS', 'SPECS', 'MODULES', 'MANUAL'],
        kicker: 'PRECISION INDUSTRIAL INTERFACE · REV 2.4',
        title: '정밀 가공된 알루미늄과 물리적 피드백의 미학',
        subtitle: '평면 픽셀에 가공 베벨, 오목한 LCD 계기창, 발광 LED 인디케이터를 더해 손에 잡힐 듯한 도구 경험을 만듭니다.',
        primaryCta: '유닛 테스트 가동',
        secondaryCta: '하드웨어 도면',
        metrics: [
          { label: 'CHASSIS', value: 'CNC 6061' },
          { label: 'KEY TRAVEL', value: '1.8 mm' },
          { label: 'LED STATUS', value: 'LOCKED' }
        ],
        features: [
          { num: 'CH-1', title: '가공 베벨 키캡', desc: '상단 하이라이트와 하단 그림자 층으로 클릭 시 물리적으로 눌리는 손맛을 구현합니다.' },
          { num: 'CH-2', title: '리세스 LCD 계기창', desc: '수치와 파형은 안쪽으로 깊이 파인 어두운 유리 계기판 안에 선명하게 격리됩니다.' },
          { num: 'CH-3', title: '브라운 시그널 오렌지', desc: '무채색 건메탈 섀시 위 오직 핵심 작동 버튼 하나만 오렌지 컬러로 즉각 인지됩니다.' }
        ]
      },
      mobile: {
        appName: 'FIELD CAM-07',
        greeting: 'OPTICAL MODULE READY',
        primaryCardTitle: 'ISO 400 · 1/250s · F/2.0',
        primaryCardMeta: 'RAW 14-BIT · LED BATTERY 94%',
        items: [
          { tag: 'DIAL', title: '노출 보정 +0.3 EV', status: 'LOCK' },
          { tag: 'LENS', title: '35mm 아포크로매틱', status: 'AF-S' },
          { tag: 'FILM', title: '모노크롬 콘트라스트', status: 'CH-2' }
        ],
        detailTitle: 'HARDWARE SWITCHES',
        detailSub: 'CNC 다이얼 · 물리 셔터 트리거'
      },
      game: {
        genre: 'ANALOG COCKPIT INSTRUMENT',
        title: 'MECH BAY // INSTRUMENT DECK',
        player: 'UNIT-MK2',
        bossName: 'SIGNAL BEACON 07',
        bossSub: '주파수 104.2 MHz · 록온 중',
        hpLabel: 'ARMOR',
        mpLabel: 'VOLT',
        skills: [
          { key: 'Q', name: '펄스 점화', dmg: 145 },
          { key: 'W', name: '부스터 릴레이', dmg: 205 },
          { key: 'E', name: '고압 방전', dmg: 295 },
          { key: 'R', name: '오버드라이브', dmg: 430 }
        ],
        logInit: '계기판 전원 ON. 중앙 아날로그 스코프를 클릭해 신호 타격을 개시하세요.'
      },
      dashboard: {
        brand: 'RACK MONITOR 07',
        title: '하드웨어 랙 계측 패널',
        kpis: [
          { label: '전력 출력', value: '428 W', delta: '+4.2%' },
          { label: '코어 온도', value: '41.2°C', delta: '-1.8°C' },
          { label: '신호 대 잡음', value: '112 dB', delta: '+2 dB' },
          { label: '가동 사이클', value: '9,420h', delta: 'NOMINAL' }
        ]
      }
    }
  }
]);
