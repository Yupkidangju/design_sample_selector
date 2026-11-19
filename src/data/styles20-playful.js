/**
 * 게임 · 레트로 · 3D · 오가닉 그룹 (7종)
 * 8-Bit 픽셀 아케이드, 80s 신스웨이브, Y2K 크롬, Frutiger Aero, 클레이모피즘, 솔라펑크, 멤피스
 */

export const PLAYFUL_STYLES = Object.freeze([
  {
    id: 'pixel-arcade',
    number: '14',
    group: 'playful',
    nameKo: '8-Bit 픽셀 아케이드',
    nameEn: '8-Bit Pixel Arcade',
    tagline: '진짜 픽셀 폰트, 계단형 도트 보더, 16색 콘솔 팔레트와 정통 JRPG 대화창으로 완성한 레트로 게임 카트리지 감성',
    traits: ['도트 픽셀 서체', '계단형 픽셀 보더', '16색 레트로 JRPG UI'],
    polarity: 'dark',
    fonts: {
      display: "'Press Start 2P', 'Silkscreen', 'Noto Sans KR', monospace",
      body: "'Silkscreen', 'Noto Sans KR', monospace",
      mono: "'Press Start 2P', 'JetBrains Mono', monospace",
      displayName: 'Press Start 2P + Silkscreen',
      bodyName: 'Silkscreen + Noto Sans KR',
      monoName: 'Press Start 2P + JetBrains Mono'
    },
    palette: [
      { role: '나이트 인디고 BG', roleEn: 'Night Indigo Canvas', hex: '#141028' },
      { role: 'RPG 윈도우 블루', roleEn: 'JRPG Window Navy', hex: '#1F1B42' },
      { role: '크림 도트 잉크', roleEn: 'Cream Pixel Ink', hex: '#FFFCE8' },
      { role: '코인 골드 (Accent)', roleEn: 'Arcade Coin Gold', hex: '#FFD43B' },
      { role: '하트 픽셀 레드', roleEn: 'Pixel Heart Crimson', hex: '#FF3B5C' }
    ],
    cssVars: {
      '--bg': '#141028',
      '--surface': '#1F1B42',
      '--surface-2': '#2B255C',
      '--ink': '#FFFCE8',
      '--ink-muted': '#C8C2E6',
      '--accent': '#FFD43B',
      '--accent-text': '#FFD43B',
      '--accent-2': '#42E8A8',
      '--accent-ink': '#141028',
      '--border': '#FFFCE8',
      '--border-w': '3px',
      '--radius': '0px',
      '--radius-sm': '0px',
      '--shadow': '4px 4px 0px #090614, inset -3px -3px 0px #120E29, inset 3px 3px 0px #40387A'
    },
    specimen: {
      kicker: 'PRESS START 1989',
      headline: '8-BIT QUEST',
      sub: '도트 픽셀 보더 · 콘솔 RPG UI',
      badge: '1UP'
    },
    dna: {
      philosophyKo: '안티앨리어싱과 둥근 곡선을 완전히 금지하고, 픽셀 단위 계단 보더, 16색 고대비 게임 팔레트, Press Start 2P 도트 타이포와 블록 체력바로 슈퍼패미컴·게임보이 어드밴스 명작을 켜는 설렘을 재현합니다.',
      philosophyEn: 'Bans anti-aliased curves in favor of crisp stepped pixel borders, Press Start 2P bitmap typography, 16-color console palettes, and classic JRPG window frames.',
      layoutRulesKo: [
        '모든 창과 버튼은 0px 직각 + 안쪽/바깥쪽 3px 계단형 픽셀 그림자로 클래식 RPG 대화창처럼 감싼다.',
        '진행바와 체력 게이지는 매끈한 그라디언트 대신 세그먼트 블록이 똑똑 끊어지는 도트 미터로 만든다.',
        '선택 메뉴 앞에 삼각 커서(`▶`)를 배치해 컨트롤러 십자키로 고르는 느낌을 살린다.'
      ],
      layoutRulesEn: [
        'Frame windows with 0px stepped pixel bevels and classic RPG double borders.',
        'Segment all health/progress bars into crisp pixel blocks instead of smooth gradients.',
        'Prefix interactive menu options with classic triangular selector cursors (▶).'
      ],
      surfaceRulesKo: [
        '딥 나이트 인디고(#141028) 위에 로열 RPG 블루(#1F1B42) 창과 순백 크림 테두리(#FFFCE8)를 얹는다.',
        '모든 SVG 일러스트는 `shape-rendering="crispEdges"` 정사각 픽셀 격자로 그려 진짜 도트 아트처럼 보이게 한다.',
        '버튼 클릭 시 그림자가 사라지며 픽셀 단위로 2px 아래로 탁 눌리게 처리한다.'
      ],
      surfaceRulesEn: [
        'Layer royal RPG navy windows (#1F1B42) with crisp cream borders (#FFFCE8) over night indigo (#141028).',
        'Render pixel-art SVGs with shape-rendering="crispEdges" on integer pixel grids.',
        'Drop buttons 2px downward with zero blur on :active like physical arcade switches.'
      ],
      typographyRulesKo: [
        '영문 제목·숫자·라벨은 반드시 Press Start 2P / Silkscreen을 쓰고, 한글 본문은 또렷한 고딕으로 가독성을 보완한다.',
        'Press Start 2P는 크기가 크므로 일반 폰트보다 0.7배 정도 작게 스케일링하고 줄 간격을 1.5 이상 준다.'
      ],
      typographyRulesEn: [
        'Use Press Start 2P / Silkscreen for display labels, scores, and badges.',
        'Scale pixel fonts thoughtfully with generous 1.5+ line-height so characters stay crisp.'
      ],
      dosKo: [
        'Press Start 2P / Silkscreen 진짜 픽셀 폰트 + 0px 계단형 보더 적용',
        'crispEdges 픽셀 아트 SVG 스프라이트(보스·하트·코인·검) 직접 활용',
        '코인 골드(#FFD43B)·하트 레드(#FF3B5C)·에메랄드(#42E8A8) 레트로 16색 대비',
        '▶ 선택 커서, LV/HP/MP/EXP 게임 문법과 즉각적인 도트 피드백'
      ],
      dosEn: [
        'Load authentic Press Start 2P / Silkscreen pixel typography and 0px stepped borders',
        'Use integer-grid crispEdges SVG pixel sprites for icons and illustrations',
        'Maintain vibrant 16-bit console palette accents (coin gold, heart red, emerald)',
        'Include classic ▶ cursors, segmented meters, and RPG command windows'
      ],
      dontsKo: [
        '둥근 모서리(rounded-xl), 부드러운 블러 그림자, 유리 반투명 효과 절대 금지',
        '매끈한 벡터 곡선이나 현대적 미니멀 선 아이콘을 픽셀 창 안에 섞지 말 것',
        '이모지(👾) 하나만 덩그러니 띄워 성의 없는 픽셀 흉내를 내지 말 것',
        '픽셀 폰트로 긴 문단을 빽빽하게 써서 눈이 피로하게 만들지 말 것'
      ],
      dontsEn: [
        'Never use rounded corners, soft drop shadows, or frosted glass blur',
        'Never mix sleek smooth vector curves or modern thin-line icons inside pixel frames',
        'Never fake pixel art with a single raw system emoji inside an empty box',
        'Avoid long dense paragraphs set in Press Start 2P'
      ],
      domainTipsKo: {
        web: '클래식 게임 타이틀 스크린처럼 픽셀 성/드래곤 SVG 히어로, `▶ START` 메뉴 버튼, RPG 퀘스트 창을 배치하세요.',
        mobile: '포켓몬/게임보이 컬러 감성의 휴대용 RPG 스테이터스, 픽셀 하트·인벤토리 리스트를 구성하세요.',
        game: '정통 16비트 JRPG 보스전 화면! 픽셀 드래곤 보스 SVG, 클래식 하단 4분할 명령창, HP/MP 블록 게이지를 구현하세요.',
        dashboard: '아케이드 하이스코어 보드처럼 픽셀 막대 그래프, 랭킹 테이블, 1UP/콤보 스탯 창을 만드세요.'
      },
      domainTipsEn: {
        web: 'Build a nostalgic cartridge title screen with crispEdges pixel art hero and ▶ START menu CTAs.',
        mobile: 'Channel a handheld pocket RPG companion with pixel hearts, quest logs, and cartridge tabs.',
        game: 'Render a true 16-bit JRPG boss battle with pixel dragon SVG, dialogue frame, and Fight/Magic/Item command deck.',
        dashboard: 'Frame analytics as a high-score arcade leaderboard with stepped pixel bar charts.'
      }
    },
    showcase: {
      web: {
        brand: 'PIXEL QUEST 89',
        nav: ['▶ QUEST', 'ITEMS', 'PARTY', 'SAVE'],
        kicker: 'STAGE 14 // 16-BIT CARTRIDGE SYSTEM',
        title: '도트 한 점까지 살아 숨 쉬는 8-BIT 아케이드',
        subtitle: '계단형 픽셀 프레임, 16색 콘솔 팔레트, 정통 JRPG 명령창으로 누르는 순간 추억과 재미가 터집니다.',
        primaryCta: '▶ PRESS START',
        secondaryCta: 'LOAD SAVE',
        metrics: [
          { label: 'HI-SCORE', value: '99,420' },
          { label: 'LIVES', value: '♥ ♥ ♥' },
          { label: 'STAGE', value: 'WORLD 1-4' }
        ],
        features: [
          { num: '1UP', title: '계단형 RPG 대화창', desc: '바깥 픽셀 섀도우와 안쪽 베벨이 겹친 정통 콘솔 윈도우로 어떤 카드도 게임 UI로 변합니다.' },
          { num: 'EXP', title: 'crispEdges 도트 아트', desc: '흐려지지 않는 정수 격자 픽셀 SVG로 드래곤, 하트, 코인을 또렷하게 렌더링합니다.' },
          { num: 'MAX', title: '즉각 커서 피드백', desc: '호버 시 ▶ 커서가 번쩍이며 2px 아래로 탁 눌리는 오락실 버튼 손맛을 제공합니다.' }
        ]
      },
      mobile: {
        appName: 'POCKET RPG',
        greeting: 'LV.42 모험가 상태창',
        primaryCardTitle: 'GOLD 14,820 G · ♥ 5/5',
        primaryCardMeta: '오늘의 퀘스트 2/3 완료 · 보스 던전 개방',
        items: [
          { tag: 'LV42', title: '픽셀 드래곤 토벌 퀘스트', status: '진행' },
          { tag: 'ITEM', title: '하이 포션 × 8 보유 중', status: '사용' },
          { tag: 'SAVE', title: '체크포인트 자동 저장', status: 'OK' }
        ],
        detailTitle: '▶ COMMAND MENU',
        detailSub: 'FIGHT · MAGIC · ITEM · EQUIP'
      },
      game: {
        genre: '16-BIT JRPG BOSS BATTLE',
        title: 'DRAGON KEEP // BOSS BATTLE',
        player: 'HERO LV.42',
        bossName: '8-BIT CRIMSON WYRM',
        bossSub: '고대 픽셀 드래곤이 나타났다!',
        hpLabel: 'HP',
        mpLabel: 'MP',
        skills: [
          { key: 'Q', name: '▶ 베기', dmg: 155 },
          { key: 'W', name: '▶ 파이어', dmg: 225 },
          { key: 'E', name: '▶ 크리티컬', dmg: 320 },
          { key: 'R', name: '▶ 메테오!', dmg: 500 }
        ],
        logInit: '야생의 8-BIT CRIMSON WYRM이 나타났다! 보스를 클릭하거나 스킬을 선택하세요!'
      },
      dashboard: {
        brand: 'ARCADE SCOREBOARD',
        title: '아케이드 길드 실시간 랭킹 보드',
        kpis: [
          { label: 'HI-SCORE', value: '984,200', delta: 'NEW!' },
          { label: 'CLEAR RATE', value: '87.4%', delta: '+6.2%' },
          { label: 'COINS/HR', value: '42,800', delta: '+18%' },
          { label: 'ACTIVE 1P', value: '6,410', delta: 'ONLINE' }
        ]
      }
    }
  },
  {
    id: 'synthwave',
    number: '15',
    group: 'playful',
    nameKo: '80s 신스웨이브 사이버펑크',
    nameEn: '80s Synthwave Cyberpunk',
    tagline: '딥 나이트 바이올렛, 네온 마젠타·시안 발광 엣지, 원근 레이저 지평선 그리드와 아웃런 석양이 타오르는 80년대 레트로 퓨처리즘',
    traits: ['원근 네온 레이저 그리드', '마젠타 × 시안 네온 블룸', '아웃런 선셋·스캔라인'],
    polarity: 'dark',
    fonts: {
      display: "'Orbitron', 'Noto Sans KR', sans-serif",
      body: "'Chakra Petch', 'Noto Sans KR', sans-serif",
      mono: "'JetBrains Mono', monospace",
      displayName: 'Orbitron + Chakra Petch',
      bodyName: 'Chakra Petch + Noto Sans KR',
      monoName: 'JetBrains Mono'
    },
    palette: [
      { role: '미드나잇 보이드', roleEn: 'Midnight Void Violet', hex: '#0C061C' },
      { role: '나이트 퍼플 표면', roleEn: 'Night Purple HUD Panel', hex: '#170C30' },
      { role: '네온 화이트', roleEn: 'Neon White Ink', hex: '#F6EFFF' },
      { role: '핫 마젠타 (Accent)', roleEn: 'Outrun Magenta Accent', hex: '#D4176A' },
      { role: '사이버 시안 (Accent2)', roleEn: 'Cyber Laser Cyan', hex: '#00F0FF' }
    ],
    cssVars: {
      '--bg': '#0C061C',
      '--surface': 'rgba(23, 12, 48, 0.88)',
      '--surface-2': '#221244',
      '--ink': '#F6EFFF',
      '--ink-muted': '#C7B8E6',
      '--accent': '#D4176A',
      '--accent-text': '#FF6BB5',
      '--accent-2': '#00F0FF',
      '--accent-ink': '#FFFFFF',
      '--border': 'rgba(0, 240, 255, 0.45)',
      '--border-w': '1.5px',
      '--radius': '4px',
      '--radius-sm': '2px',
      '--shadow': '0 0 24px rgba(255, 42, 133, 0.25), inset 0 0 18px rgba(0, 240, 255, 0.08)'
    },
    specimen: {
      kicker: 'OUTRUN // 1984',
      headline: 'SYNTHWAVE',
      sub: '레이저 지평선 · 네온 마젠타 × 시안',
      badge: 'TURBO'
    },
    dna: {
      philosophyKo: '1980년대 SF 영화와 아웃런 드라이브 미학을 정교하게 구현합니다. 깊은 미드나잇 퍼플(#0C061C) 지평선 위로 줄무늬 석양과 원근 레이저 그리드가 뻗고, 네온 마젠타(#FF2A85)와 사이버 시안(#00F0FF)이 각진 컷 코너 HUD 테두리를 따라 은은하게 발광합니다.',
      philosophyEn: 'Evokes 1980s Outrun sci-fi—midnight violet void, perspective laser grids, striped sunset horizon, and crisp neon cyan/magenta chamfered HUD borders.',
      layoutRulesKo: [
        '배경에 원근감 있는 시안/마젠타 레이저 그리드와 아웃런 줄무늬 태양 SVG를 배치해 즉각적인 시대 정체성을 선언한다.',
        '카드와 버튼은 45도 사선 컷 코너(clip-path chamfer)나 날카로운 각진 HUD 테두리를 사용한다.',
        '본문 가독성을 해치지 않도록 네온 발광(box-shadow glow)은 테두리·게이지·핵심 CTA에만 절제해 집중시킨다.'
      ],
      layoutRulesEn: [
        'Anchor stages with perspective laser grids and striped outrun sunset SVG visuals.',
        'Shape containers and buttons with angled sci-fi chamfer cuts and glowing 1.5px cyan/magenta borders.',
        'Focus neon bloom on edges, gauges, and primary CTAs so interior text remains razor sharp.'
      ],
      surfaceRulesKo: [
        '딥 나이트 퍼플(#0C061C) 배경 + 반투명 다크 바이올렛(#170C30) HUD 패널을 겹친다.',
        '시안(#00F0FF)은 시스템/데이터/테두리에, 핫 마젠타(#FF2A85)는 액션/경고/파워에 역할을 명확히 분리한다.',
        '선셋 그라디언트(#FFB800 → #FF2A85 → #7B2CBF)를 포인트 미터와 태양 그래픽에 사용한다.'
      ],
      surfaceRulesEn: [
        'Layer dark translucent violet panels over deep midnight #0C061C.',
        'Assign neon cyan (#00F0FF) to structure/telemetry and hot magenta (#FF2A85) to energy/CTAs.',
        'Use iconic Outrun sunset gradients (amber → magenta → violet) for meters and horizon art.'
      ],
      typographyRulesKo: [
        '헤드라인과 수치는 각진 미래 서체 Orbitron(700~800), 본문과 버튼은 샤프한 Chakra Petch를 사용한다.',
        '영문 라벨에 넓은 자간(+0.12em)을 주어 전투기/레이서 계기판 느낌을 극대화한다.'
      ],
      typographyRulesEn: [
        'Set headlines and telemetry numerals in geometric sci-fi Orbitron paired with Chakra Petch body copy.',
        'Use wide uppercase tracking (+0.12em) for authentic retro-futuristic HUD badges.'
      ],
      dosKo: [
        '미드나잇 퍼플(#0C061C) + 핫 마젠타(#FF2A85) + 사이버 시안(#00F0FF) 3각 배색',
        'Orbitron · Chakra Petch 미래지향 서체와 사선 컷 HUD 프레임',
        '원근 레이저 지평선 그리드 및 줄무늬 아웃런 선셋 SVG 아트워크',
        '테두리와 프로그레스 바에만 깔끔하게 통제된 네온 글로우'
      ],
      dosEn: [
        'Commit to midnight violet + hot magenta + cyber cyan color architecture',
        'Pair Orbitron display headers with Chakra Petch technical UI copy',
        'Include perspective horizon grids and striped sunset SVG motifs',
        'Control neon glow strictly on borders, gauges, and interactive focus states'
      ],
      dontsKo: [
        '본문 작은 글씨마다 text-shadow 네온 블러를 떡칠해 눈을 아프게 만들지 말 것',
        '밝은 흰 배경이나 따뜻한 종이·파스텔 톤을 섞지 말 것',
        '둥글둥글한 쿠션 버튼이나 클래식 세리프 폰트 혼용 금지',
        '무질서한 무지개 색을 남발해 마젠타×시안 정체성을 흐리지 말 것'
      ],
      dontsEn: [
        'Never blur small body paragraphs with heavy neon text-shadow',
        'Never use bright white paper or soft pastel backgrounds',
        'Avoid puffy rounded pill buttons or traditional serifs',
        'Avoid muddy multi-color rainbows outside the Outrun palette'
      ],
      domainTipsKo: {
        web: '원근 레이저 지평선과 선셋 SVG 히어로, 빛나는 마젠타 CTA, 시안 HUD 기능 카드로 아웃런 랜딩을 만드세요.',
        mobile: '네온 드라이브·나이트 러닝 앱처럼 스피도미터, 시안/마젠타 미터, 발광 하단 탭을 배치하세요.',
        game: '사이버 스타파이터/아웃런 레이서 콕핏! 지평선 그리드, 록온 레티클, 터보 플라즈마 스킬바를 구현하세요.',
        dashboard: '사이버 네트워킹 관제 보드처럼 발광 마젠타/시안 이중 선형 차트와 네온 상태 지표를 쓰세요.'
      },
      domainTipsEn: {
        web: 'Pair a perspective grid & sunset hero with chamfered cyan feature panels and neon magenta CTAs.',
        mobile: 'Build a night-drive telemetry app with glowing speed gauges and chamfered bottom controls.',
        game: 'Create an Outrun starfighter/racer cockpit with horizon grid, lock-on reticle, and turbo boost skills.',
        dashboard: 'Render glowing dual cyan/magenta SVG waveforms inside dark violet telemetry frames.'
      }
    },
    showcase: {
      web: {
        brand: 'OUTRUN // 1984',
        nav: ['HORIZON', 'TURBO', 'GRID', 'IGNITE'],
        kicker: 'RETRO-FUTURISM · NEON OVERDRIVE SYSTEM',
        title: '네온 지평선 너머로 질주하는 80년대 사이버 미학',
        subtitle: '원근 레이저 그리드, 타오르는 줄무늬 선셋, 마젠타와 시안의 발광 경계로 강렬한 SF 몰입감을 구축합니다.',
        primaryCta: '터보 엔진 점화 →',
        secondaryCta: 'HUD 텔레메트리',
        metrics: [
          { label: 'VELOCITY', value: '288 KM/H' },
          { label: 'NITRO', value: '100%' },
          { label: 'SECTOR', value: 'NEO-84' }
        ],
        features: [
          { num: '01', title: '원근 레이저 지평선', desc: '깊은 밤하늘 아래 뻗어 나가는 네온 그리드와 줄무늬 태양이 즉각적인 80s SF 세계관을 엽니다.' },
          { num: '02', title: '시안 × 마젠타 역할 분리', desc: '구조와 데이터는 시안, 파워와 행동은 마젠타로 분리해 화려하면서도 시선이 흔들리지 않습니다.' },
          { num: '03', title: '사선 컷 사이버 프레임', desc: 'Orbitron 서체와 각진 HUD 보더로 게임과 테크 제품 모두에서 압도적 개성을 발휘합니다.' }
        ]
      },
      mobile: {
        appName: 'NIGHT DRIVE 84',
        greeting: 'NEO HIGHWAY · CLEAR SKY',
        primaryCardTitle: '246 KM/H · TURBO READY',
        primaryCardMeta: '부스트 충전 92% · 야간 레이더 활성',
        items: [
          { tag: 'GRID', title: '네온 하이웨이 코스 04', status: '1ST' },
          { tag: 'SYNC', title: '플라즈마 부스터 냉각', status: '92%' },
          { tag: 'SCAN', title: '전방 섹터 스캔 완료', status: 'CLEAR' }
        ],
        detailTitle: 'COCKPIT OVERDRIVE',
        detailSub: 'MAGENTA #FF2A85 × CYAN #00F0FF'
      },
      game: {
        genre: 'OUTRUN STARFIGHTER COCKPIT',
        title: 'NEON HORIZON // INTERCEPTOR',
        player: 'ACE-84',
        bossName: 'CYBER INTERCEPTOR MK-9',
        bossSub: '레이저 록온 완료 · 플라즈마 사격!',
        hpLabel: 'SHIELD',
        mpLabel: 'NITRO',
        skills: [
          { key: 'Q', name: '레이저 펄스', dmg: 160 },
          { key: 'W', name: '니트로 부스트', dmg: 220 },
          { key: 'E', name: '시안 레일건', dmg: 320 },
          { key: 'R', name: '선셋 오버드라이브', dmg: 495 }
        ],
        logInit: '네온 하이웨이 돌입! 중앙 록온 표적을 클릭해 플라즈마 캐논을 발사하세요!'
      },
      dashboard: {
        brand: 'NEO-GRID OPS',
        title: '사이버 섹터 실시간 에너지 관제',
        kpis: [
          { label: '그리드 출력', value: '8.84 GW', delta: '+21.4%' },
          { label: '신호 동기화', value: '99.4%', delta: '+1.2%' },
          { label: '활성 터미널', value: '42,190', delta: '+3,410' },
          { label: '부스트 예비', value: '94%', delta: 'MAX' }
        ]
      }
    }
  },
  {
    id: 'y2k-chrome',
    number: '16',
    group: 'playful',
    nameKo: 'Y2K 크롬 홀로그램',
    nameEn: 'Y2K Liquid Chrome',
    tagline: '액체 크롬 실버 메탈릭 광택, 홀로그래픽 이리데센트 반사, 트라이벌 스타 엠블럼이 어우러진 2000년대 초반 팝 퓨처리즘',
    traits: ['액체 크롬 실버 광택', '이리데센트 홀로그램', '2000s 스타·메탈릭 엠블럼'],
    polarity: 'dark',
    fonts: {
      display: "'Syne', 'Orbitron', 'Noto Sans KR', sans-serif",
      body: "'Space Grotesk', 'Noto Sans KR', sans-serif",
      mono: "'JetBrains Mono', monospace",
      displayName: 'Syne + Orbitron',
      bodyName: 'Space Grotesk',
      monoName: 'JetBrains Mono'
    },
    palette: [
      { role: '메탈릭 딥 네이비', roleEn: 'Metallic Deep Steel Navy', hex: '#0F1322' },
      { role: '리퀴드 실버 크롬', roleEn: 'Liquid Silver Chrome', hex: '#DCE4F5' },
      { role: '홀로 라벤더', roleEn: 'Iridescent Holo Lavender', hex: '#D6A4FF' },
      { role: '일렉트릭 아이스 블루', roleEn: 'Electric Ice Blue', hex: '#63E2FF' },
      { role: '사이버 핫핑크', roleEn: 'Millennium Chrome Pink', hex: '#FF5EDB' }
    ],
    cssVars: {
      '--bg': '#0F1322',
      '--surface': '#182038',
      '--surface-2': '#202A47',
      '--ink': '#F4F7FF',
      '--ink-muted': '#C1CCE6',
      '--accent': '#63E2FF',
      '--accent-text': '#7BE8FF',
      '--accent-2': '#FF5EDB',
      '--accent-ink': '#0C1020',
      '--border': 'rgba(220, 234, 255, 0.48)',
      '--border-w': '1.5px',
      '--radius': '18px',
      '--radius-sm': '999px',
      '--shadow': '0 14px 36px rgba(6, 10, 28, 0.55), inset 0 2px 1px rgba(255, 255, 255, 0.55), inset 0 -2px 6px rgba(99, 226, 255, 0.2)'
    },
    specimen: {
      kicker: 'MILLENNIUM 2000 ✦',
      headline: 'CHROME 2K',
      sub: '리퀴드 메탈 · 홀로그래픽 펄 광택',
      badge: '✦ Y2K'
    },
    dna: {
      philosophyKo: '2000년 밀레니엄의 낙관적 미래주의와 PS2·아이맥·CD 홀로그램 반사를 재해석합니다. 액체처럼 매끈한 크롬 실버 그라디언트, 오묘하게 무지갯빛이 감도는 이리데센트 광택, 별(✦)과 궤도 링 그래픽으로 스타일리시한 팝 테크 감성을 만듭니다.',
      philosophyEn: 'Revives early-2000s millennium optimism—liquid chrome metallic sheen, iridescent CD hologram gradients, orbital star emblems (✦), and glossy chrome pill buttons.',
      layoutRulesKo: [
        '둥근 알약형(pill) 메탈릭 캡슐 버튼과 궤도 링·별(✦) SVG 엠블럼을 시그니처 장식으로 사용한다.',
        '카드 상단에 CD 반사광 같은 은빛-라벤더-아이스블루 얇은 스펙큘러 하이라이트를 넣는다.',
        '금속 판재 같은 실버 배지와 홀로그램 태그(`Y2K // VER.2000 ✦`)를 리듬감 있게 배치한다.'
      ],
      layoutRulesEn: [
        'Feature chrome pill capsules paired with 4-point star (✦) and orbital ring SVG emblems.',
        'Crown containers with crisp metallic silver-lavender-ice specular highlights.',
        'Accent sections with millennium version tags (VER.2000 ✦, CHROME EDITION).'
      ],
      surfaceRulesKo: [
        '크롬 메탈 버튼은 다단 실버 그라디언트(`#FFFFFF → #CBD5EE → #899BC4 → #EEF4FF`)로 실제 액체 금속 반사를 구현한다.',
        '홀로그램 악센트는 아이스 블루(#63E2FF), 홀로 라벤더(#D6A4FF), 핫핑크(#FF5EDB)가 은은하게 흐르는 펄 광택으로 처리한다.',
        '배경은 메탈 광택이 가장 화려하게 반사되는 딥 스틸 네이비(#0F1322)를 사용한다.'
      ],
      surfaceRulesEn: [
        'Render chrome buttons with multi-stop metallic silver gradients simulating liquid reflection.',
        'Blend ice blue (#63E2FF), holo lavender (#D6A4FF), and chrome pink (#FF5EDB) as iridescent highlights.',
        'Set over deep steel-navy (#0F1322) so chrome reflections gleam unmistakably.'
      ],
      typographyRulesKo: [
        '넓고 조형적인 Syne 800 헤드라인에 실버 메탈릭 텍스트 그라디언트를 입혀 Y2K 로고 느낌을 낸다.',
        '보조 라벨은 2000년대 게임 패키지 감성의 넓은 자간 모노스페이스를 사용한다.'
      ],
      typographyRulesEn: [
        'Apply liquid silver-to-ice text gradients onto wide Syne 800 display titles.',
        'Use wide-tracked monospace badges reminiscent of 2000s console packaging.'
      ],
      dosKo: [
        '다단 실버 크롬 그라디언트 + 상단 흰색 스펙큘러 림(inset 0 2px 1px #FFF)',
        '4각 별(✦)·타원 궤도 링·액체 메탈 오브 SVG 아트워크 적극 활용',
        '아이스 블루 × 홀로 라벤더 × 핫핑크의 CD 홀로그램 반사광',
        '매끈한 알약(pill) 크롬 캡슐 버튼과 넓은 Syne 800 실버 헤드라인'
      ],
      dosEn: [
        'Use multi-stop liquid chrome silver gradients and bright top specular rims',
        'Feature orbital rings, 4-point chrome stars (✦), and liquid metal SVG forms',
        'Layer subtle CD-iridescent ice-blue, lavender, and pink sheen',
        'Style controls as glossy chrome pill capsules with bold metallic display type'
      ],
      dontsKo: [
        '평면 무광 종이 질감이나 80년대 거친 브루탈 흑선 금지',
        '과하게 원색적인 촌스러운 무지개로 고급 크롬 메탈 광택을 망치지 말 것',
        '검은 글씨를 어두운 메탈 위에 올려 대비를 망치지 말 것',
        '단순 단색 회색(#888)만 칠해 크롬이 아니라 칙칙한 시멘트처럼 보이지 않게 할 것'
      ],
      dontsEn: [
        'Never use flat matte paper or thick brutalist black outlines',
        'Avoid flat dull gray (#888)—chrome requires bright white highlights and cool reflections',
        'Never compromise legibility over shimmering surfaces',
        'Avoid warm earth tones that fight the cool metallic palette'
      ],
      domainTipsKo: {
        web: '액체 크롬 궤도 스타 히어로, 실버 메탈 캡슐 CTA, 홀로그램 펄 카드로 패션·음반·크리에이티브 웹을 만드세요.',
        mobile: '2000년대 미니디스크/팝 플레이어 감성의 크롬 캡슐 탭과 홀로그램 아바타 카드를 구성하세요.',
        game: 'PS2/드림캐스트 제트셋 아레나처럼 액체 크롬 랭크 S+ 배지, 궤도 별 타겟, 메탈 게이지를 연출하세요.',
        dashboard: '홀로그래픽 크롬 지표 카드와 아이스블루-핑크 이리데센트 곡선 차트를 조합하세요.'
      },
      domainTipsEn: {
        web: 'Design a sleek pop-tech or creative drop site with liquid chrome star art and metallic pill CTAs.',
        mobile: 'Channel a futuristic 2000s cyber-companion with gleaming chrome capsules and holographic cards.',
        game: 'Build a Dreamcast/PS2 stylish cyber-arena HUD with liquid chrome orbs and S+ rank energy bars.',
        dashboard: 'Render iridescent cyan-to-pink area charts inside specular chrome-rimmed panels.'
      }
    },
    showcase: {
      web: {
        brand: 'CHROME ✦ 2K',
        nav: ['ORBIT', 'SILVER', 'ARCHIVE', 'JOIN ✦'],
        kicker: 'Y2K MILLENNIUM EDITION · LIQUID CHROME',
        title: '액체 크롬과 홀로그램 빛이 흐르는 2000s 퓨처리즘',
        subtitle: 'CD 표면의 무지갯빛 반사와 매끈한 실버 캡슐 버튼, 궤도 스타 엠블럼으로 아이코닉한 팝 테크 경험을 구현합니다.',
        primaryCta: '✦ 크롬 캡슐 열기',
        secondaryCta: '홀로그램 스펙',
        metrics: [
          { label: 'FINISH', value: 'CHROME' },
          { label: 'SHEEN', value: 'HOLO 3D' },
          { label: 'RANK', value: 'S++ ✦' }
        ],
        features: [
          { num: '✦ 01', title: '액체 크롬 스펙큘러', desc: '다단 실버 그라디언트와 상단 2px 순백 반사선으로 실제 광택 금속 표면을 재현합니다.' },
          { num: '✦ 02', title: 'CD 홀로그램 펄', desc: '아이스 블루·라벤더·핫핑크가 은은하게 어우러져 차갑고 세련된 밀레니엄 광채를 냅니다.' },
          { num: '✦ 03', title: '궤도 스타 엠블럼', desc: '4각 별과 타원 궤도 그래픽이 모든 섹션에 확실한 Y2K 시그니처 각인을 남깁니다.' }
        ]
      },
      mobile: {
        appName: 'SILVER POD 2K',
        greeting: 'CYBER SYNC ✦ CONNECTED',
        primaryCardTitle: 'CHROME DROP #2000',
        primaryCardMeta: '한정 홀로그램 패스 활성화 · RANK S+',
        items: [
          { tag: '✦ S+', title: '리퀴드 실버 에디션 팩', status: '보유' },
          { tag: 'HOLO', title: '궤도 스타 아바타 프레임', status: '장착' },
          { tag: '2000', title: '밀레니엄 캡슐 컬렉션', status: 'NEW' }
        ],
        detailTitle: 'LIQUID CHROME DECK',
        detailSub: 'SILVER SPECULAR × IRIDESCENT PEARL'
      },
      game: {
        genre: 'PS2 STYLISH CYBER ARENA',
        title: 'JET ORBIT // RANK S+ ARENA',
        player: 'NOVA_2K ✦',
        bossName: 'CHROME VALKYRIE',
        bossSub: '스타일리시 랭크 상승 중 · 콤보 유지!',
        hpLabel: 'CHROME',
        mpLabel: 'HOLO',
        skills: [
          { key: 'Q', name: '스타 대시 ✦', dmg: 155 },
          { key: 'W', name: '크롬 스핀', dmg: 215 },
          { key: 'E', name: '프리즘 웨이브', dmg: 305 },
          { key: 'R', name: '밀레니엄 노바', dmg: 480 }
        ],
        logInit: 'CYBER ARENA 2000 가동 ✦ 중앙 크롬 스타 코어를 클릭해 S+ 랭크를 달성하세요!'
      },
      dashboard: {
        brand: 'CHROME METRICS ✦',
        title: '밀레니엄 컬렉션 실시간 리포트',
        kpis: [
          { label: '홀로 패스 발급', value: '32,400', delta: '+44.2%' },
          { label: '스타일리시 지수', value: 'S++', delta: 'TOP 1%' },
          { label: '라이브 전환율', value: '9.14%', delta: '+2.6%' },
          { label: '글로벌 팬덤', value: '184K', delta: '+19K' }
        ]
      }
    }
  },
  {
    id: 'frutiger-aero',
    number: '17',
    group: 'playful',
    nameKo: 'Frutiger Aero 아쿠아',
    nameEn: 'Frutiger Aero Aqua Gloss',
    tagline: '맑은 하늘과 투명 물방울, 상단 절반이 반짝이는 유리 젤리(Aqua Gel) 버튼, 에메랄드 리프의 청량한 2000년대 중반 에코 글로스 UI',
    traits: ['상단 반사 아쿠아 젤리 버튼', '맑은 하늘·물방울 구슬', '청량한 블루·라임 에코'],
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
      { role: '스카이 아쿠아 배경', roleEn: 'Cerulean Sky Backdrop', hex: '#D6F2FF' },
      { role: '유리 글로스 표면', roleEn: 'Translucent White Glass', hex: 'rgba(255,255,255,0.82)' },
      { role: '딥 오션 잉크', roleEn: 'Deep Ocean Navy Ink', hex: '#083358' },
      { role: '아쿠아 젤 블루', roleEn: 'Aqua Gel Cobalt', hex: '#006BB3' },
      { role: '에코 리프 그린', roleEn: 'Eco Meadow Leaf Green', hex: '#44C83C' }
    ],
    cssVars: {
      '--bg': '#D6F2FF',
      '--surface': 'rgba(255, 255, 255, 0.84)',
      '--surface-2': 'rgba(232, 249, 255, 0.92)',
      '--ink': '#083358',
      '--ink-muted': '#1F5378',
      '--accent': '#006BB3',
      '--accent-text': '#005894',
      '--accent-2': '#2F9E28',
      '--accent-ink': '#FFFFFF',
      '--border': 'rgba(255, 255, 255, 0.92)',
      '--border-w': '1.5px',
      '--radius': '20px',
      '--radius-sm': '999px',
      '--shadow': '0 12px 30px rgba(0, 122, 196, 0.18), inset 0 2px 0 rgba(255, 255, 255, 0.95)'
    },
    specimen: {
      kicker: 'AQUA GLOSS · 2007',
      headline: 'Frutiger Aero',
      sub: '유리 젤리 버튼 · 맑은 하늘과 물방울',
      badge: 'AERO'
    },
    dna: {
      philosophyKo: 'Windows Vista/7·초기 iOS·Wii 시대의 맑고 희망찬 미래 감성입니다. 푸른 하늘과 잔디빛 그라디언트, 투명 물방울 구슬, 그리고 위쪽 절반에 선명한 흰색 유리 반사선(gel highlight)이 맺힌 통통한 아쿠아 버튼으로 청량함을 극대화합니다.',
      philosophyEn: 'Captures sunlit mid-2000s optimism—cerulean skies, translucent water droplets, lush eco-green accents, and iconic half-gloss aqua gel pill buttons.',
      layoutRulesKo: [
        '배경에 맑은 하늘 블루(#BBEAFF → #F0FBFF)와 은은한 잔디 그린 하단 광원, 떠다니는 투명 물방울 구슬 SVG를 배치한다.',
        '모든 핵심 버튼과 배지에 상단 50% 흰색 반사광(gel gloss overlay)이 들어간 알약형 캡슐 디자인을 적용한다.',
        '패널은 맑은 반투명 화이트 유리(rgba(255,255,255,0.78) + blur)에 선명한 흰색 외곽선과 하늘색 그림자를 둔다.'
      ],
      layoutRulesEn: [
        'Paint sunlit cerulean-to-meadow sky gradients dotted with glossy floating glass bubbles.',
        'Give primary buttons signature top-half white gel reflections (linear-gradient 0–50%).',
        'Frame translucent white glass panels with bright white inner rims and airy sky-blue drop shadows.'
      ],
      surfaceRulesKo: [
        '아쿠아 젤 버튼 핵심 공식: 상단 흰색 반투명(0.65 → 0.15 at 50%) + 하단 선명한 아쿠아(#0095E8) 또는 리프 그린(#44C83C).',
        '어두운 검정 그림자 대신 맑은 바다빛 그림자(`rgba(0, 122, 196, 0.22)`)를 써서 화면이 탁해지지 않게 한다.',
        '잉크색도 순흑 대신 깊은 오션 네이비(#083358)를 사용해 전체 색조의 청량함을 지킨다.'
      ],
      surfaceRulesEn: [
        'Craft aqua gel buttons with a crisp 50% top-half specular gloss gradient over cerulean blue or leaf green.',
        'Tint drop shadows in transparent azure (rgba(0,122,196,0.22)) rather than muddy black.',
        'Use deep ocean navy (#083358) for crisp readable text that harmonizes with sky blue.'
      ],
      typographyRulesKo: [
        '맑고 둥근 휴머니스트/지오메트릭 산세리프(Outfit/Inter)를 부드러운 웨이트(500~700)로 사용한다.',
        '젤리 버튼 위 흰 글씨에는 미세한 아래쪽 어두운 텍스트 그림자(0 1px 2px rgba(0,60,110,0.4))를 넣어 선명도를 높인다.'
      ],
      typographyRulesEn: [
        'Use clean humanist/geometric sans-serifs (Outfit/Inter) in friendly medium-bold weights.',
        'Add a crisp subtle text-shadow under white labels on glossy aqua buttons.'
      ],
      dosKo: [
        '상단 50% 유리 반사광이 선명한 아쿠아 젤리(Aqua Gel) 알약 버튼 구현',
        '스카이 블루 + 리프 그린 + 순백 유리의 청량하고 희망찬 3색 조화',
        '투명 물방울·유리 구슬·나뭇잎 곡선 SVG 아트워크로 확실한 Aero 무드 연출',
        '검정 대신 맑은 하늘색 그림자와 깊은 오션 네이비(#083358) 텍스트 사용'
      ],
      dosEn: [
        'Build unmistakable half-gloss aqua gel pill buttons with crisp white specular highlights',
        'Harmonize sunlit sky blue, lush leaf green, and translucent white glass panels',
        'Include floating glossy bubble orbs and eco-wave SVG accents',
        'Use azure-tinted shadows and deep ocean navy typography for crystal clarity'
      ],
      dontsKo: [
        '어두운 다크 모드, 검정 하드 섀도우, 거친 브루탈 외곽선 절대 금지',
        '완전 무광 플랫 디자인으로 만들면 Frutiger Aero의 핵심인 유리 광택이 사라짐',
        '칙칙한 베이지·갈색·탁한 회색을 섞어 청량감을 흐리지 말 것',
        '각진 0px 사각형이나 딱딱한 터미널 폰트 혼용 금지'
      ],
      dontsEn: [
        'Never apply dark mode, black hard shadows, or harsh flat outlines',
        'Never strip away the top-half specular gel gloss—gloss IS the identity',
        'Avoid muddy beige, brown, or muted earth grays',
        'Avoid sharp 0px corners or stark monospace fonts'
      ],
      domainTipsKo: {
        web: '푸른 하늘과 투명 물방울 구슬 히어로, 반짝이는 아쿠아/그린 젤리 버튼, 맑은 유리 카드로 에코/라이프 웹을 만드세요.',
        mobile: '초기 iOS·Wii 감성의 광택 젤리 아이콘, 맑은 날씨/워터 위젯, 둥근 유리 탭바를 배치하세요.',
        game: 'Wii 리조트·하늘섬 라이프 시뮬레이션처럼 투명 버블 섬, 반짝이는 그린 에코 게이지, 젤리 스킬 버튼을 구현하세요.',
        dashboard: '친환경 스마트 시티·수질/태양광 모니터처럼 투명 아쿠아 카드와 청량한 블루·그린 곡선 차트를 만드세요.'
      },
      domainTipsEn: {
        web: 'Build a sunlit eco-tech site with floating glass droplet art and glossy aqua/leaf gel CTAs.',
        mobile: 'Design a refreshing weather/wellness app with translucent glass cards and glossy gel pills.',
        game: 'Create a sunlit sky-island life-sim HUD with floating glass orbs and juicy aqua gel skill buttons.',
        dashboard: 'Present clean-energy or water metrics on frosted white-sky cards with azure/emerald curves.'
      }
    },
    showcase: {
      web: {
        brand: 'AQUA HORIZON',
        nav: ['스카이 OS', '에코 앱', '갤러리', '다운로드'],
        kicker: 'SUNLIT GLASS & WATER OPTICS · 2007 REVIVAL',
        title: '맑은 하늘과 투명 물방울이 살아 숨 쉬는 아쿠아 글로스',
        subtitle: '상단 반사광이 반짝이는 젤리 캡슐 버튼과 청량한 스카이 블루·에코 그린으로 기분 좋은 미래를 그립니다.',
        primaryCta: '아쿠아 테마 체험',
        secondaryCta: '글로스 컴포넌트',
        metrics: [
          { label: 'CLARITY', value: '100% PURE' },
          { label: 'GLOSS', value: '50% GEL' },
          { label: 'ECO INDEX', value: 'A+ GREEN' }
        ],
        features: [
          { num: '01', title: '상단 50% 젤리 광택', desc: '버튼 위쪽 절반에 맑은 유리 반사 하이라이트를 얹어 누르고 싶은 촉촉한 입체감을 줍니다.' },
          { num: '02', title: '맑은 하늘 & 물방울 오브', desc: '하늘빛 그라디언트 위로 투명한 물방울 구슬과 에코 리프 곡선이 상쾌한 공간감을 만듭니다.' },
          { num: '03', title: '오션 네이비 선명 가독성', desc: '밝고 투명한 유리 표면 위에서도 깊은 바다색 잉크가 또렷한 가독성을 지켜줍니다.' }
        ]
      },
      mobile: {
        appName: 'AERO WEATHER',
        greeting: '서울 · 맑고 청량한 하늘',
        primaryCardTitle: '23°C · 미세먼지 매우 맑음',
        primaryCardMeta: '습도 42% · 산들바람 2.4 m/s · UV 보통',
        items: [
          { tag: 'AQUA', title: '수분 섭취 목표 6/8잔', status: '75%' },
          { tag: 'ECO', title: '에코 보행 6,800 걸음', status: '+240P' },
          { tag: 'SKY', title: '오후 5시 노을 청명 지수', status: '최상' }
        ],
        detailTitle: 'AQUA GEL CONTROLS',
        detailSub: 'SKY BLUE #0095E8 × LEAF GREEN #44C83C'
      },
      game: {
        genre: 'SKY ISLAND ECO RESORT',
        title: 'AERO ISLAND // WATER SANCTUARY',
        player: 'KEEPER SKY',
        bossName: 'CRYSTAL DROPLET SPIRIT',
        bossSub: '맑은 물방울 정령 · 에코 공명 충전!',
        hpLabel: 'VITAL',
        mpLabel: 'AQUA',
        skills: [
          { key: 'Q', name: '버블 팝', dmg: 130 },
          { key: 'W', name: '아쿠아 스플래시', dmg: 195 },
          { key: 'E', name: '에코 브리즈', dmg: 270 },
          { key: 'R', name: '레인보우 아크', dmg: 425 }
        ],
        logInit: '하늘섬 성역에 도착했습니다! 중앙 투명 물방울 정령을 클릭해 청량한 에너지를 채우세요.'
      },
      dashboard: {
        brand: 'AERO CLEAN-GRID',
        title: '청정 수자원 및 태양광 모니터',
        kpis: [
          { label: '청정 발전 비율', value: '94.6%', delta: '+6.8%' },
          { label: '수질 맑음 지수', value: '99.1', delta: 'PURE' },
          { label: '탄소 절감량', value: '1,480t', delta: '+19%' },
          { label: '에코 커뮤니티', value: '28.4K', delta: '+3.1K' }
        ]
      }
    }
  },
  {
    id: 'claymorphism',
    number: '18',
    group: 'playful',
    nameKo: '클레이모피즘 3D 버블',
    nameEn: 'Claymorphism 3D Bubble',
    tagline: '말랑말랑한 3D 점토처럼 부풀어 오른 이중 내·외부 그림자, 파스텔 캔디 팔레트, 둥근 Fredoka 서체의 친근한 토이 인터페이스',
    traits: ['3D 점토 이중 내·외부 음영', '파스텔 캔디 컬러', '초둥근 버블·토이 형태'],
    polarity: 'light',
    fonts: {
      display: "'Fredoka', 'Noto Sans KR', sans-serif",
      body: "'Outfit', 'Noto Sans KR', sans-serif",
      mono: "'JetBrains Mono', monospace",
      displayName: 'Fredoka + Outfit',
      bodyName: 'Outfit',
      monoName: 'JetBrains Mono'
    },
    palette: [
      { role: '라벤더 크림 배경', roleEn: 'Lavender Cream Canvas', hex: '#F3EEFF' },
      { role: '말랑 화이트 점토', roleEn: 'Puffy White Clay Surface', hex: '#FFFFFF' },
      { role: '딥 플럼 잉크', roleEn: 'Deep Plum Ink', hex: '#2D2159' },
      { role: '라즈베리 클레이', roleEn: 'Berry Rose Clay Accent', hex: '#D12C65' },
      { role: '스카이 민트 클레이', roleEn: 'Sky Mint Clay Secondary', hex: '#5ED3C6' }
    ],
    cssVars: {
      '--bg': '#F3EEFF',
      '--surface': '#FFFFFF',
      '--surface-2': '#FFEBF0',
      '--ink': '#2D2159',
      '--ink-muted': '#55477D',
      '--accent': '#D12C65',
      '--accent-text': '#B01C52',
      '--accent-2': '#5ED3C6',
      '--accent-ink': '#FFFFFF',
      '--border': 'rgba(255, 255, 255, 0.85)',
      '--border-w': '2px',
      '--radius': '32px',
      '--radius-sm': '20px',
      '--shadow': '0 18px 34px rgba(105, 80, 185, 0.16), inset 0 -10px 16px rgba(130, 108, 210, 0.18), inset 0 8px 14px rgba(255, 255, 255, 0.95)'
    },
    specimen: {
      kicker: 'SOFT 3D TOY UI',
      headline: 'Clay Pop!',
      sub: '통통한 3D 점토 질감 · 파스텔 버블',
      badge: '3D ☁'
    },
    dna: {
      philosophyKo: '손으로 빚은 매끈한 3D 클레이 인형처럼 모든 카드와 버튼이 통통하게 부풀어 있습니다. 32px 이상의 큰 곡률에 바깥쪽 색조 그림자 + 안쪽 하단 음영(inset bottom) + 안쪽 상단 하이라이트(inset top) 3중 섀도우로 말랑한 입체감을 구현합니다.',
      philosophyEn: 'Sculpts playful inflated 3D clay cushions using oversized 32px+ radii, pastel candy fills, and 3-layer shadows (outer tinted drop + inset bottom shade + inset top highlight).',
      layoutRulesKo: [
        '모든 카드(32px), 버튼(999px), 배지(20px)에 넉넉하고 말랑한 곡률을 일관되게 적용한다.',
        '각 카드와 아이콘 배지에 피치 핑크(#FF7096), 민트(#5ED3C6), 레몬(#FFD166), 라벤더(#A78BFA) 파스텔 점토색을 즐겁게 섞는다.',
        '호버 시 통통 튀어 오르는 스프링 이징(`cubic-bezier(0.34, 1.56, 0.64, 1)`)을 적용한다.'
      ],
      layoutRulesEn: [
        'Commit to generous pillowy corners (32px cards, full pill buttons, 20px inner badges).',
        'Color-code clay tiles in joyful peach pink, mint, buttercup yellow, and soft lavender.',
        'Animate hover/press with bouncy spring physics (cubic-bezier(0.34, 1.56, 0.64, 1)).'
      ],
      surfaceRulesKo: [
        '클레이 3중 섀도우 공식: 외부 컬러 그림자 + `inset 0 -8px 14px` 아래쪽 어두운 곡면 음영 + `inset 0 6px 10px rgba(255,255,255,0.85)` 상단 볼록 광택.',
        '뉴모피즘과 달리 배경과 카드 색이 명확히 분리되고 채도 높은 파스텔 캔디 색감을 사용한다.',
        '텍스트는 순흑 대신 따뜻하고 진한 딥 플럼(#2D2159)을 사용해 부드러운 톤을 지킨다.'
      ],
      surfaceRulesEn: [
        'Always stack all 3 clay shadow layers: tinted outer shadow + inset bottom shade + inset top highlight.',
        'Unlike monochrome neumorphism, contrast colorful pastel clay pieces against a light lavender-cream canvas.',
        'Use deep plum ink (#2D2159) instead of harsh pure black.'
      ],
      typographyRulesKo: [
        '둥글고 통통한 Fredoka(600~700) 디스플레이 서체로 점토 질감과 완벽한 조화를 이룬다.',
        '숫자와 버튼 라벨도 둥글고 굵직하게 써서 친근한 캐주얼 앱·게임 인상을 극대화한다.'
      ],
      typographyRulesEn: [
        'Pair plump rounded Fredoka (600–700) headlines with friendly Outfit body text.',
        'Keep button labels bold and bouncy for casual game and consumer app warmth.'
      ],
      dosKo: [
        '외부 색조 그림자 + 내부 하단 음영 + 내부 상단 광택의 3중 3D 클레이 섀도우',
        '32px 대형 곡률 + 999px 통통한 알약 버튼 + Fredoka 둥근 서체',
        '피치 코랄·민트·버터 옐로·라벤더의 밝고 즐거운 파스텔 점토 배색',
        '통통 튀는 스프링 호버 모션과 둥근 3D SVG 캐릭터/오브 일러스트'
      ],
      dosEn: [
        'Apply authentic 3-layer clay shadows (outer + inset bottom depth + inset top specular)',
        'Use generous 32px+ rounded cushions and plump Fredoka typography',
        'Combine cheerful peach, mint, buttercup, and lavender clay surfaces',
        'Add playful spring-bounce transitions and puffy 3D SVG illustrations'
      ],
      dontsKo: [
        '날카로운 0px 직각 모서리나 굵은 검정 브루탈 외곽선 절대 금지',
        '어둡고 차가운 사이버펑크 다크 모드나 딱딱한 모노스페이스 폰트 금지',
        '안쪽 inset 음영을 빼먹어 그냥 평범한 둥근 플랫 카드로 만들지 말 것',
        '회색 탁한 그림자로 파스텔 점토 색감을 지저분하게 만들지 말 것'
      ],
      dontsEn: [
        'Never use sharp 0px corners or harsh black outlines',
        'Never drop into dark cyber themes or cold monospace fonts',
        'Never omit the inset bottom/top shading—otherwise it collapses into plain flat cards',
        'Avoid muddy gray shadows; always tint shadows with the clay hue'
      ],
      domainTipsKo: {
        web: '말랑한 3D 캐릭터/구름 SVG 히어로, 통통한 핑크 클레이 CTA, 파스텔 쿠션 카드로 교육·캐주얼 앱 웹을 만드세요.',
        mobile: '습관 형성·어린이 교육·캐주얼 핀테크 앱처럼 말랑한 캔디 위젯과 둥근 버블 탭바를 배치하세요.',
        game: '코지 3D 토이 월드 캐주얼 퍼즐/펫 어드벤처! 웃는 클레이 몬스터 SVG, 젤리 하트, 통통한 스킬 버블을 구현하세요.',
        dashboard: '친근한 학습/크리에이터 보드처럼 파스텔 클레이 KPI 쿠션과 둥근 막대/도넛 차트를 만드세요.'
      },
      domainTipsEn: {
        web: 'Create a delightful consumer/edtech landing page with puffy 3D clay art and bouncy candy CTAs.',
        mobile: 'Build a cozy habit-tracker or casual finance app with plump pastel clay cards and pill nav.',
        game: 'Craft a cozy 3D toy-world pet/puzzle HUD with smiling clay SVG creatures and bouncy bubble skills.',
        dashboard: 'Present creator or learning stats in puffy pastel clay KPI cushions with rounded bar charts.'
      }
    },
    showcase: {
      web: {
        brand: 'MOCHI STUDIO',
        nav: ['토이 킷', '캐릭터', '놀이법', '시작하기'],
        kicker: 'PLAYFUL 3D CLAYMORPHISM · SOFT TOY UI',
        title: '손으로 꾹 눌러보고 싶은 말랑말랑 3D 클레이 세상',
        subtitle: '안쪽과 바깥쪽 3중 음영으로 부풀어 오른 파스텔 점토 카드와 통통 튀는 모션으로 친근한 경험을 만듭니다.',
        primaryCta: '말랑하게 시작하기',
        secondaryCta: '3D 킷 둘러보기',
        metrics: [
          { label: 'BOUNCE', value: 'SPRING' },
          { label: 'RADIUS', value: '32 PX' },
          { label: 'SMILE', value: '100%' }
        ],
        features: [
          { num: '01', title: '3중 3D 점토 음영', desc: '외부 컬러 섀도우, 내부 하단 음영, 상단 흰 광택이 합쳐져 입체 쿠션처럼 부풀어 오릅니다.' },
          { num: '02', title: '캔디 파스텔 팔레트', desc: '피치 코랄·민트·레몬·라벤더의 행복한 색 조합이 처음 보는 사용자의 긴장을 녹입니다.' },
          { num: '03', title: '통통 튀는 스프링 손맛', desc: '버튼을 누를 때마다 쫀득하게 탄성이 느껴져 캐주얼 게임과 소비자 앱에 최적화됩니다.' }
        ]
      },
      mobile: {
        appName: 'MOCHI HABIT',
        greeting: '오늘도 3일 연속 성공!',
        primaryCardTitle: '말랑 레벨 12 · 840 별',
        primaryCardMeta: '오늘 목표 4개 중 3개 완료했어요!',
        items: [
          { tag: '물', title: '아침 물 한 잔 마시기', status: '완료' },
          { tag: '산책', title: '햇빛 20분 가볍게 걷기', status: '완료' },
          { tag: '독서', title: '자기 전 15쪽 읽기', status: '도전' }
        ],
        detailTitle: '3D CLAY WIDGETS',
        detailSub: 'PEACH #FF7096 × MINT #5ED3C6'
      },
      game: {
        genre: 'COZY 3D TOY ADVENTURE',
        title: 'MOCHI LAND // PUFFY QUEST',
        player: 'MOCHI LV.18',
        bossName: 'JELLY CLOUD KING',
        bossSub: '말랑 구름 대왕 · 통통 터치 대결!',
        hpLabel: 'HAPPY',
        mpLabel: 'STAR',
        skills: [
          { key: 'Q', name: '말랑 펀치', dmg: 135 },
          { key: 'W', name: '버블 점프', dmg: 190 },
          { key: 'E', name: '캔디 스플래시', dmg: 265 },
          { key: 'R', name: '레인보우 팡!', dmg: 420 }
        ],
        logInit: '모찌 랜드에 오신 걸 환영해요! 중앙 말랑 구름 대왕을 톡톡 눌러 놀아주세요!'
      },
      dashboard: {
        brand: 'MOCHI CREATOR',
        title: '스튜디오 성장 버블 보드',
        kpis: [
          { label: '행복한 유저', value: '48,200', delta: '+26%' },
          { label: '연속 출석률', value: '89.4%', delta: '+8.2%' },
          { label: '수집 스티커', value: '142K', delta: '+14K' },
          { label: '앱스토어 평점', value: '4.9 ★', delta: 'TOP' }
        ]
      }
    }
  },
  {
    id: 'solarpunk-eco',
    number: '19',
    group: 'playful',
    nameKo: '솔라펑크 에코 오가닉',
    nameEn: 'Solarpunk Eco Organic',
    tagline: '따뜻한 햇살 크림, 보태니컬 포레스트 그린, 테라코타와 유기적 아치 곡선이 어우러진 친환경 미래주의(Solarpunk) 디자인',
    traits: ['보태니컬 그린·테라코타', '유기적 아치·식물 곡선', '따뜻한 햇빛 크림 지면'],
    polarity: 'light',
    fonts: {
      display: "'Fraunces', 'Noto Serif KR', Georgia, serif",
      body: "'Outfit', 'Noto Sans KR', sans-serif",
      mono: "'JetBrains Mono', monospace",
      displayName: 'Fraunces + Outfit',
      bodyName: 'Outfit',
      monoName: 'JetBrains Mono'
    },
    palette: [
      { role: '선라이트 린넨 배경', roleEn: 'Sunlit Linen Canvas', hex: '#F4F1E3' },
      { role: '온실 크림 표면', roleEn: 'Glasshouse Cream Surface', hex: '#FCFBF5' },
      { role: '딥 포레스트 잉크', roleEn: 'Deep Forest Green Ink', hex: '#183629' },
      { role: '보태니컬 그린', roleEn: 'Botanical Greenhouse Green', hex: '#256E42' },
      { role: '선셋 테라코타/골드', roleEn: 'Sunlit Terracotta Gold', hex: '#D97736' }
    ],
    cssVars: {
      '--bg': '#F4F1E3',
      '--surface': '#FCFBF5',
      '--surface-2': '#E7ECDC',
      '--ink': '#183629',
      '--ink-muted': '#3C5949',
      '--accent': '#256E42',
      '--accent-text': '#1F603A',
      '--accent-2': '#D97736',
      '--accent-ink': '#FCFBF5',
      '--border': 'rgba(43, 122, 75, 0.24)',
      '--border-w': '1.5px',
      '--radius': '24px',
      '--radius-sm': '999px',
      '--shadow': '0 14px 32px rgba(24, 54, 41, 0.08)'
    },
    specimen: {
      kicker: 'ECO FUTURISM · 2050',
      headline: 'Solarpunk',
      sub: '햇살 린넨 · 보태니컬 온실 아치',
      badge: '☀ ECO'
    },
    dna: {
      philosophyKo: '디스토피아 사이버펑크의 정반대편에 선 낙관적 미래주의입니다. 따뜻한 햇빛 린넨(#F4F1E3), 싱그러운 포레스트 그린(#2B7A4B), 흙과 태양의 테라코타(#D97736), 그리고 온실 돔을 닮은 아치 곡선과 부드러운 Fraunces 세리프로 살아 숨 쉬는 생태 인터페이스를 설계합니다.',
      philosophyEn: 'The optimistic counterpoint to cyberpunk—sunlit linen (#F4F1E3), botanical forest green (#2B7A4B), terracotta warmth (#D97736), greenhouse arch geometry, and organic Fraunces typography.',
      layoutRulesKo: [
        '아치형 상단 프레임(border-radius: 160px 160px 24px 24px)과 잎사귀·태양 궤도 SVG 일러스트로 온실 건축미를 표현한다.',
        '자연스러운 리듬의 둥근 카드(24px)와 세이지 그린 틴트 보조 패널(#E7ECDC)을 교차 배치한다.',
        '수치 옆에 태양·식물·에너지 순환 모티프를 배치해 지속 가능한 미래 기술을 직관적으로 드러낸다.'
      ],
      layoutRulesEn: [
        'Use botanical arch frames and sunlit greenhouse SVG art to anchor key sections.',
        'Alternate warm linen cards (#FCFBF5) with soft sage-tinted panels (#E7ECDC).',
        'Pair organic rounded shapes (24px) with clean sustainable energy indicators.'
      ],
      surfaceRulesKo: [
        '차가운 회색이나 순흑을 배제하고, 모든 잉크와 그림자를 딥 포레스트 그린(#183629) 계열로 통일한다.',
        '주 행동 버튼은 보태니컬 그린(#2B7A4B), 햇빛/에너지 강조는 테라코타 골드(#D97736)로 따스하게 대비시킨다.',
        '가느다란 유기적 보더(rgba(43,122,75,0.24))와 부드러운 자연광 그림자를 적용한다.'
      ],
      surfaceRulesEn: [
        'Eliminate cold grays and pure black—tint all typography and shadows with deep forest green (#183629).',
        'Pair botanical green primary actions with warm sunlit terracotta (#D97736) highlights.',
        'Use delicate botanical borders and soft sunlit elevation shadows.'
      ],
      typographyRulesKo: [
        '따뜻하고 유기적인 곡선을 가진 Fraunces 세리프를 헤드라인에, 깔끔한 Outfit을 본문·UI 컨트롤에 매칭한다.',
        '너무 공격적인 대문자보다 편안하고 지적인 대소문자 혼용과 여유로운 행간(1.65)을 유지한다.'
      ],
      typographyRulesEn: [
        'Pair warm expressive Fraunces headings with airy Outfit UI controls.',
        'Favor approachable sentence case and generous 1.65 line-height.'
      ],
      dosKo: [
        '선라이트 린넨(#F4F1E3) × 보태니컬 그린(#2B7A4B) × 테라코타(#D97736) 어스 팔레트',
        '온실 아치 프레임, 태양광·나뭇잎 곡선 SVG 아트워크 활용',
        '딥 포레스트 그린 잉크(#183629)와 따뜻한 Fraunces 세리프 헤드라인',
        '세이지 그린 보조 표면과 부드러운 자연광 그림자로 평온한 미래감 전달'
      ],
      dosEn: [
        'Use the sunlit linen + botanical green + terracotta earth-future palette',
        'Incorporate greenhouse arch silhouettes and sunlit botanical SVG artwork',
        'Set Fraunces headings in deep forest ink (#183629) rather than cold black',
        'Balance sage surfaces with gentle sunlit shadows'
      ],
      dontsKo: [
        '어두운 네온 블랙, 차가운 메탈 크롬, 인위적인 형광색 금지',
        '날카로운 0px 브루탈 흑선이나 삭막한 산업용 회색 금지',
        '지나치게 어둡고 칙칙한 갈색 위주로 낡은 빈티지처럼 보이지 않게 할 것 (밝은 햇살 톤 필수)',
        '기계적인 픽셀 폰트나 차가운 SF 각진 서체 혼용 금지'
      ],
      dontsEn: [
        'Never introduce dark neon black, cold chrome, or harsh fluorescent colors',
        'Avoid harsh 0px brutalist lines or sterile industrial grays',
        'Keep it sunlit and optimistic—never muddy dark sepia vintage',
        'Never mix cold angular sci-fi or pixel fonts'
      ],
      domainTipsKo: {
        web: '온실 아치 히어로, 따뜻한 Fraunces 세리프, 태양광·식물 곡선 일러스트로 기후테크·웰니스 웹을 만드세요.',
        mobile: '도심 정원·친환경 라이프스타일 앱처럼 세이지 틴트 카드, 햇빛 에너지 링, 알약형 포레스트 버튼을 구성하세요.',
        game: '공중 보태니컬 온실 도시 건설/테라포밍 시뮬레이터! 온실 돔 SVG, 태양광·생물다양성 게이지, 씨앗 스킬바를 만드세요.',
        dashboard: '태양광·탄소 중립 대시보드처럼 크림 카드 위 포레스트 그린 & 테라코타 유기적 곡선 차트를 배치하세요.'
      },
      domainTipsEn: {
        web: 'Craft a climate-tech or botanical wellness site with arch-framed SVG art and warm Fraunces headlines.',
        mobile: 'Design a sustainable living/garden app with sage cards, solar energy rings, and forest pill buttons.',
        game: 'Build a botanical sky-garden city builder HUD with sunlit glasshouse art and seed-craft skills.',
        dashboard: 'Present solar and biodiversity telemetry with forest-green and terracotta smooth SVG curves.'
      }
    },
    showcase: {
      web: {
        brand: 'VERDANT // 2050',
        nav: ['온실 도시', '태양 그리드', '생태 보고', '참여'],
        kicker: 'OPTIMISTIC ECO-FUTURISM · SOLARPUNK',
        title: '햇빛과 식물이 기술과 공존하는 따뜻한 미래 인터페이스',
        subtitle: '린넨 지면의 온기, 보태니컬 그린, 테라코타의 조화로 지친 눈을 쉬게 하는 지속 가능한 디지털 공간을 짓습니다.',
        primaryCta: '생태 정원 탐색',
        secondaryCta: '태양광 리포트',
        metrics: [
          { label: 'SOLAR SHARE', value: '98.4%' },
          { label: 'BIOME', value: 'FLOURISH' },
          { label: 'CARBON', value: 'NET -12%' }
        ],
        features: [
          { num: '01', title: '온실 아치 실루엣', desc: '자연의 곡선과 유리 온실 아치를 UI 프레임에 녹여 기술이 차갑지 않게 숨 쉬도록 합니다.' },
          { num: '02', title: '포레스트 & 테라코타', desc: '순흑 대신 깊은 숲의 녹색을 잉크로 쓰고, 햇빛 테라코타로 온기를 더했습니다.' },
          { num: '03', title: '유기적 Fraunces 서체', desc: '부드러운 세리프와 단정한 산세리프의 조화로 지적이면서도 포근한 미래상을 전합니다.' }
        ]
      },
      mobile: {
        appName: 'SUNLEAF HOME',
        greeting: '옥상 온실 · 햇살 충만',
        primaryCardTitle: '태양광 자급률 114%',
        primaryCardMeta: '잉여 전력 +4.2 kWh 이웃 공유 중',
        items: [
          { tag: 'SUN', title: '남향 솔라 패널 피크 발전', status: '6.4kW' },
          { tag: 'LEAF', title: '수경 허브 정원 자동 급수', status: '최적' },
          { tag: 'AIR', title: '실내 산소 & 습도 밸런스', status: '98%' }
        ],
        detailTitle: 'BIOSPHERE CARE',
        detailSub: 'BOTANICAL #2B7A4B × TERRACOTTA #D97736'
      },
      game: {
        genre: 'BOTANICAL SKY-GARDEN SIM',
        title: 'HELIO DOME // TERRAFORM 19',
        player: 'BOTANIST SOL',
        bossName: 'ARID DUST STORM',
        bossSub: '건조 지대 정화 단계 · 생태 돔 확장',
        hpLabel: 'BLOOM',
        mpLabel: 'SOLAR',
        skills: [
          { key: 'Q', name: '씨앗 파종', dmg: 130 },
          { key: 'W', name: '햇빛 집광', dmg: 190 },
          { key: 'E', name: '포레스트 웨이브', dmg: 275 },
          { key: 'R', name: '에덴 개화', dmg: 435 }
        ],
        logInit: '공중 온실 돔 가동 완료. 중앙 생태 돔을 클릭해 사막에 숲을 되살리세요.'
      },
      dashboard: {
        brand: 'SOLAR COMMONS',
        title: '지속 가능 커뮤니티 에너지 보드',
        kpis: [
          { label: '태양광 발전량', value: '482 MWh', delta: '+16.4%' },
          { label: '녹지 복원 면적', value: '14.2 ha', delta: '+2.1 ha' },
          { label: '전력 자급률', value: '108%', delta: 'SURPLUS' },
          { label: '참여 가구', value: '6,920', delta: '+410' }
        ]
      }
    }
  },
  {
    id: 'memphis',
    number: '20',
    group: 'playful',
    nameKo: '멤피스 팝 아키텍처',
    nameEn: 'Memphis Pop Architecture',
    tagline: '지그재그·물결·도트·삼각 컨페티 패턴과 유쾌한 80년대 포스트모던 컬러 블록이 리듬을 타는 밀라노 팝 디자인',
    traits: ['지그재그·컨페티 패턴', '80s 포스트모던 팝 컬러', '유쾌한 기하학 리듬'],
    polarity: 'light',
    fonts: {
      display: "'Fredoka', 'Space Grotesk', 'Noto Sans KR', sans-serif",
      body: "'Space Grotesk', 'Noto Sans KR', sans-serif",
      mono: "'JetBrains Mono', monospace",
      displayName: 'Fredoka + Space Grotesk',
      bodyName: 'Space Grotesk',
      monoName: 'JetBrains Mono'
    },
    palette: [
      { role: '컨페티 화이트 배경', roleEn: 'Confetti Warm White Canvas', hex: '#FFFDF7' },
      { role: '버블검 핑크', roleEn: 'Bubblegum Pop Pink', hex: '#FF5FA2' },
      { role: '터콰이즈 민트', roleEn: 'Turquoise Mint Shadow', hex: '#00C9B7' },
      { role: '선샤인 옐로', roleEn: 'Sunshine Pop Yellow', hex: '#FFD23F' },
      { role: '로열 잉크 네이비', roleEn: 'Royal Navy Outline Ink', hex: '#1E1B4B' }
    ],
    cssVars: {
      '--bg': '#FFFDF7',
      '--surface': '#FFFFFF',
      '--surface-2': '#FFF4C2',
      '--ink': '#1E1B4B',
      '--ink-muted': '#464275',
      '--accent': '#FF5FA2',
      '--accent-text': '#B41759',
      '--accent-2': '#00C9B7',
      '--accent-ink': '#1E1B4B',
      '--border': '#1E1B4B',
      '--border-w': '2.5px',
      '--radius': '14px',
      '--radius-sm': '10px',
      '--shadow': '6px 6px 0px #00C9B7'
    },
    specimen: {
      kicker: 'MILANO 1981 〰',
      headline: 'MEMPHIS!',
      sub: '지그재그 · 도트 · 80s 팝 리듬',
      badge: '▲ 〰 ●'
    },
    dna: {
      philosophyKo: '1981년 밀라노 에토레 소트사스의 멤피스 그룹처럼 "진지한 모더니즘에 장난기 넘치는 반란"을 일으킵니다. 딥 네이비 외곽선, 터콰이즈·핑크·옐로 컬러 오프셋 그림자, 지그재그와 도트·물결 패턴으로 파티처럼 경쾌한 팝 아키텍처를 완성합니다.',
      philosophyEn: 'Channels 1981 Milanese Memphis rebellion—playful squiggles, zigzags, confetti dots, deep indigo outlines, and colorful turquoise/pink offset shadows.',
      layoutRulesKo: [
        '배경과 히어로 주변에 물결선(squiggle), 지그재그, 도트, 반원, 삼각 컨페티 SVG 패턴을 리듬감 있게 흩뿌린다.',
        '카드 그림자를 검정 대신 터콰이즈(#00C9B7), 버블검 핑크(#FF5FA2), 옐로(#FFD23F)로 교차 적용해 브루탈리즘과 확실히 차별화한다.',
        '섹션 타이틀에 물결 밑줄이나 도트 스트라이프 장식을 더해 80년대 팝 잡지 느낌을 낸다.'
      ],
      layoutRulesEn: [
        'Scatter playful geometric confetti (squiggles, zigzags, polka dots, half-moons) around focal zones.',
        'Use colorful offset shadows (turquoise, bubblegum pink, yellow) instead of brutalist black shadows.',
        'Accent headers with zigzag ribbons and checkered or dotted pattern strips.'
      ],
      surfaceRulesKo: [
        '테두리는 순흑이 아닌 딥 로열 네이비(#1E1B4B, 2.5px), 그림자는 컬러 오프셋(`6px 6px 0 #00C9B7`)을 사용한다.',
        '핑크(#FF5FA2), 터콰이즈(#00C9B7), 선샤인 옐로(#FFD23F) 3색 팝 조합이 밝은 크림 화이트(#FFFDF7) 위에서 뛰어놀게 한다.',
        '14px 경쾌한 둥근 모서리와 도트/스트라이프 패턴 악센트 패널을 조합한다.'
      ],
      surfaceRulesEn: [
        'Use deep royal indigo outlines (#1E1B4B) paired with vibrant colored hard shadows (6px 6px 0 #00C9B7).',
        'Let bubblegum pink, turquoise mint, and sunshine yellow dance on bright warm white (#FFFDF7).',
        'Combine lively 14px corners with graphic polka-dot and diagonal stripe accent strips.'
      ],
      typographyRulesKo: [
        '유쾌한 Fredoka 700 헤드라인과 깔끔한 Space Grotesk 본문을 조합해 팝하면서도 읽기 쉽게 만든다.',
        '숫자와 배지에 통통한 도형 마커(▲, ●, 〰)를 함께 써서 경쾌함을 살린다.'
      ],
      typographyRulesEn: [
        'Pair cheerful Fredoka 700 headings with crisp Space Grotesk copy.',
        'Decorate badges and indices with graphic symbols (▲, ●, 〰).'
      ],
      dosKo: [
        '검정 그림자 대신 터콰이즈·핑크·옐로 컬러 오프셋 그림자로 멤피스 개성 확립',
        '지그재그·물결선·도트·삼각 컨페티 패턴 SVG를 배경과 히어로에 적극 활용',
        '딥 로열 네이비(#1E1B4B) 외곽선 + 밝은 팝 3색의 유쾌한 밸런스',
        '파티·퀴즈·이벤트·크리에이티브 브랜드에 어울리는 밝고 경쾌한 에너지'
      ],
      dosEn: [
        'Use colorful turquoise/pink/yellow offset shadows to distinguish Memphis from dark Neo-Brutalism',
        'Weave squiggles, zigzags, dots, and geometric confetti SVG motifs across layouts',
        'Frame cards in deep royal navy (#1E1B4B) rather than harsh black',
        'Keep the energy joyful, upbeat, and unmistakably 1980s postmodern'
      ],
      dontsKo: [
        '검은 외곽선 + 검은 그림자만 써서 네오 브루탈리즘과 똑같아 보이지 않게 할 것',
        '어두운 다크 배경이나 무거운 럭셔리 세리프 금지',
        '패턴을 본문 텍스트 뒤까지 과하게 깔아 가독성을 해치지 말 것',
        '단조로운 1색 미니멀로 만들어 멤피스의 팝 리듬을 죽이지 말 것'
      ],
      dontsEn: [
        'Never collapse into plain black-outlined Neo-Brutalism—keep colorful shadows & Memphis patterns',
        'Avoid dark moody themes or solemn luxury serifs',
        'Keep busy confetti patterns outside dense reading areas so copy stays effortless to read',
        'Never strip down to dull monochrome'
      ],
      domainTipsKo: {
        web: '지그재그·컨페티 SVG 히어로, 터콰이즈/핑크 컬러 섀도우 카드, 톡톡 튀는 이벤트 랜딩 페이지를 만드세요.',
        mobile: '파티 초대·소셜 퀴즈 앱처럼 알록달록한 컬러 오프셋 카드와 도트 패턴 배너를 구성하세요.',
        game: '80s 팝아트 핀볼/파티 퀴즈 아케이드! 지그재그 범퍼 아레나, 컨페티 타겟, 콤보 배수 스킬 카드를 연출하세요.',
        dashboard: '페스티벌·커뮤니티 이벤트 보드처럼 핑크·터콰이즈·옐로 3색 팝 막대 차트와 유쾌한 KPI 카드를 쓰세요.'
      },
      domainTipsEn: {
        web: 'Design a lively event or creative festival site with confetti SVG art and colored offset cards.',
        mobile: 'Build a playful social trivia or party-invite app with colorful shadows and squiggle accents.',
        game: 'Create an 80s pop-art pinball/trivia arcade HUD with zigzag bumpers and confetti combo multipliers.',
        dashboard: 'Present community event stats in turquoise-shadowed KPI cards and vibrant 3-color bar charts.'
      }
    },
    showcase: {
      web: {
        brand: 'MILANO POP 81',
        nav: ['패턴', '페스티벌', '굿즈', '티켓 〰'],
        kicker: '1981 POSTMODERN POP · MEMPHIS MILANO',
        title: '지그재그와 컨페티가 춤추는 유쾌한 팝 아키텍처',
        subtitle: '진지한 규칙을 기분 좋게 비틀어, 터콰이즈 그림자와 버블검 핑크·선샤인 옐로로 화면에 축제의 리듬을 불어넣습니다.',
        primaryCta: '파티 라인업 보기 〰',
        secondaryCta: '패턴 키트',
        metrics: [
          { label: 'PATTERNS', value: '▲ 〰 ●' },
          { label: 'MOOD', value: '1981 POP' },
          { label: 'ENERGY', value: 'MAX FUN' }
        ],
        features: [
          { num: '▲ 1', title: '컬러 오프셋 섀도우', desc: '검은 그림자 대신 터콰이즈와 핑크 그림자를 깔아 네오 브루탈리즘보다 훨씬 화사하고 경쾌합니다.' },
          { num: '〰 2', title: '지그재그 & 컨페티 패턴', desc: '물결선, 도트, 반원, 삼각형이 화면 구석구석에 포스트모던 특유의 장난기를 더합니다.' },
          { num: '● 3', title: '로열 네이비 라인워크', desc: '순흑 대신 깊은 네이비(#1E1B4B) 윤곽선을 써서 팝 컬러와 찰떡같이 어우러집니다.' }
        ]
      },
      mobile: {
        appName: 'POP QUIZ 81',
        greeting: '오늘의 팝 퀴즈 파티!',
        primaryCardTitle: '연속 정답 12콤보 〰',
        primaryCardMeta: '상위 3% · 주말 스페셜 배지 획득!',
        items: [
          { tag: '▲', title: '80년대 팝아트 스피드 퀴즈', status: '+350P' },
          { tag: '〰', title: '친구와 1:1 리듬 대결', status: 'WIN!' },
          { tag: '●', title: '데일리 컨페티 보너스', status: '받기' }
        ],
        detailTitle: 'MEMPHIS PARTY DECK',
        detailSub: 'PINK #FF5FA2 × MINT #00C9B7 × YELLOW #FFD23F'
      },
      game: {
        genre: '80S POP PINBALL ARCADE',
        title: 'MEMPHIS BUMPER // BONUS STAGE',
        player: 'POP_STAR 81',
        bossName: 'ZIGZAG MEGA BUMPER',
        bossSub: '컨페티 보너스 타임 · 멀티플라이어 UP!',
        hpLabel: 'FEVER',
        mpLabel: 'POP',
        skills: [
          { key: 'Q', name: '지그재그 샷', dmg: 145 },
          { key: 'W', name: '컨페티 버스트', dmg: 205 },
          { key: 'E', name: '트라이 콤보', dmg: 290 },
          { key: 'R', name: '밀라노 피버!', dmg: 460 }
        ],
        logInit: 'BONUS STAGE START 〰 중앙 지그재그 범퍼를 클릭해 점수를 팡팡 터뜨리세요!'
      },
      dashboard: {
        brand: 'POP FEST METRICS',
        title: '페스티벌 티켓 & 굿즈 라이브 보드',
        kpis: [
          { label: '티켓 예매', value: '18,920매', delta: '+34%!' },
          { label: '굿즈 장바구니', value: '4,210', delta: '+520' },
          { label: '퀴즈 참여율', value: '92.8%', delta: '+9.1%' },
          { label: 'SNS 공유 수', value: '64.5K', delta: 'POP 〰' }
        ]
      }
    }
  }
]);
