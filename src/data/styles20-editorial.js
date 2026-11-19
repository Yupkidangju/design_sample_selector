/**
 * 그래픽 & 에디토리얼 그룹 (6종)
 * 네오 브루탈리즘, 하이패션 에디토리얼, 바우하우스, 아르데코, 리소그래프, 키네틱 애시드
 */

export const EDITORIAL_STYLES = Object.freeze([
  {
    id: 'neo-brutalism',
    number: '08',
    group: 'editorial',
    nameKo: '네오 브루탈리즘',
    nameEn: 'Neo-Brutalism',
    tagline: '3px 두꺼운 검정 외곽선, 0px 블러 하드 섀도우, 원색 팝 컬러 블록이 거침없이 충돌하는 대담한 팝 브루탈리즘',
    traits: ['3px 흑색 외곽선', '블러 0 하드 섀도우', '팝 옐로·코랄 컬러블록'],
    polarity: 'light',
    fonts: {
      display: "'Syne', 'Space Grotesk', 'Noto Sans KR', sans-serif",
      body: "'Space Grotesk', 'Noto Sans KR', sans-serif",
      mono: "'JetBrains Mono', monospace",
      displayName: 'Syne + Space Grotesk',
      bodyName: 'Space Grotesk',
      monoName: 'JetBrains Mono'
    },
    palette: [
      { role: '크림 캔버스', roleEn: 'Warm Cream Canvas', hex: '#FFF7E8' },
      { role: '팝 옐로 표면', roleEn: 'Pop Yellow Block', hex: '#FFE14D' },
      { role: '굵은 흑선/잉크', roleEn: 'Solid Black Ink & Stroke', hex: '#111111' },
      { role: '핫 코랄 (Accent)', roleEn: 'Hot Coral Accent', hex: '#FF4D6D' },
      { role: '일렉트릭 민트', roleEn: 'Electric Mint Block', hex: '#38E5B0' }
    ],
    cssVars: {
      '--bg': '#FFF7E8',
      '--surface': '#FFFFFF',
      '--surface-2': '#FFE14D',
      '--ink': '#111111',
      '--ink-muted': '#2F2F2F',
      '--accent': '#FF4D6D',
      '--accent-text': '#B81433',
      '--accent-2': '#38E5B0',
      '--accent-ink': '#111111',
      '--border': '#111111',
      '--border-w': '3px',
      '--radius': '6px',
      '--radius-sm': '4px',
      '--shadow': '6px 6px 0px #111111'
    },
    specimen: {
      kicker: 'RAW POP POWER',
      headline: 'BOLD!!',
      sub: '3px 흑선 · 블러 없는 하드 섀도우',
      badge: 'NEW!'
    },
    dna: {
      philosophyKo: '공손하고 밋밋한 실리콘밸리 미학을 정면으로 거부합니다. 굵은 3px 검정 테두리와 블러가 0인 단단한 오프셋 그림자(6px 6px 0 #111), 그리고 옐로·코랄·민트 원색 블록으로 클릭하고 싶은 에너지를 폭발시킵니다.',
      philosophyEn: 'Rejects polite corporate minimalism with heavy 3px solid black outlines, zero-blur hard offset shadows (6px 6px 0 #111), and unapologetic pop color blocks.',
      layoutRulesKo: [
        '모든 카드·버튼·배지·입력창에 2.5px~3px 순흑(#111) 테두리와 하드 오프셋 그림자를 일관되게 부여한다.',
        '각 카드마다 옐로(#FFE14D), 민트(#38E5B0), 코랄(#FF4D6D), 순백(#FFF)으로 대담하게 색 블록을 나눈다.',
        '살짝 기울어진 스티커 배지(rotate(-2deg))나 두꺼운 마키(marquee) 리본으로 리듬을 더한다.'
      ],
      layoutRulesEn: [
        'Wrap every card, CTA, input, and badge in 3px solid #111 borders with crisp zero-blur offset shadows.',
        'Color-block adjacent surfaces boldly in pop yellow, hot coral, mint, and pure white.',
        'Inject playful graphic energy with slightly tilted sticker pills and bold chunky dividers.'
      ],
      surfaceRulesKo: [
        '그림자 블러 반경은 반드시 0px (`box-shadow: 6px 6px 0 #111111`)을 지킨다.',
        '버튼 hover/active 시 그림자 방향으로 실제 눌려 들어가는 물리 이동(`translate(4px, 4px)` + `box-shadow: 2px 2px 0 #111`)을 구현한다.',
        '배경에는 은은한 크림 톤(#FFF7E8)과 미세한 도트 패턴을 깔아 원색 카드가 튀어 오르게 한다.'
      ],
      surfaceRulesEn: [
        'Shadow blur radius MUST stay 0px (solid hard-edge offset shadows only).',
        'Translate interactive buttons toward their shadow on hover/active while shrinking the offset.',
        'Use a warm cream canvas (#FFF7E8) so solid primary blocks pop dramatically.'
      ],
      typographyRulesKo: [
        '헤드라인은 Syne 800 초굵은 디스플레이체 + 대문자 영문/강렬한 한국어 블랙 웨이트를 사용한다.',
        '본문도 얇은 회색 대신 짙은 먹색(#111)과 500~700 굵기로 힘 있게 쓴다.'
      ],
      typographyRulesEn: [
        'Pair ultra-bold Syne (800) headlines with punchy Space Grotesk (500–700) body copy.',
        'Keep text high-contrast pure black (#111111) even on vibrant yellow/mint backgrounds.'
      ],
      dosKo: [
        '3px 순흑 외곽선 + 0px 블러 하드 오프셋 그림자(6px 6px 0 #111) 철저히 적용',
        '호버/클릭 시 버튼이 그림자 쪽으로 쑥 눌리는 물리 인터랙션 구현',
        '크림 배경 위에 팝 옐로·핫 코랄·민트 3원색 블록을 과감하게 대비',
        '초굵은 헤드라인과 코믹·스티커 느낌의 배지로 경쾌한 존재감 부여'
      ],
      dosEn: [
        'Apply thick 3px #111 borders and hard 0px-blur offset shadows consistently',
        'Animate physical press-down offset shifts on hover and click',
        'Contrast vibrant pop yellow, coral, and mint color blocks against warm cream',
        'Use chunky display typography and playful sticker badges'
      ],
      dontsKo: [
        '흐릿한 소프트 드롭 섀도우(0 10px 30px rgba)나 backdrop-filter 유리 블러 절대 금지',
        '파스텔 그라디언트 버튼이나 1px 흐릿한 회색 테두리 사용 금지',
        '모서리를 과도하게 둥글려(rounded-3xl) 뭉툭하게 만들지 말 것',
        '어두운 네이비/회색으로 톤을 죽여 브루탈리즘의 에너지를 없애지 말 것'
      ],
      dontsEn: [
        'Never use blurry soft drop shadows or frosted glass blur',
        'Never use subtle gradients or faint 1px gray borders',
        'Avoid overly soft rounded-3xl blobs—keep corners crisp (0–8px)',
        'Avoid muted low-contrast text colors'
      ],
      domainTipsKo: {
        web: '굵은 테두리 내비게이션, 옐로/코랄 블록 히어로, 눌리는 하드 섀도우 CTA로 크리에이터·인디 툴 랜딩을 만드세요.',
        mobile: '팝 컬러 헤더 카드, 두꺼운 경계 체크리스트, 큼직한 코믹 스티커 액션 버튼으로 구성하세요.',
        game: '코믹 스트리트 격투/아케이드 HUD처럼 기울어진 KO 게이지, 폭발 스타버스트, 두꺼운 스킬 카드를 배치하세요.',
        dashboard: '카드마다 옐로·민트·코랄 색을 입힌 하드 섀도우 KPI와 두꺼운 검정 스트로크 막대 차트를 쓰세요.'
      },
      domainTipsEn: {
        web: 'Create an energetic indie-creator landing page with color-blocked cards and pressable hard-shadow CTAs.',
        mobile: 'Use chunky outlined app cards, punchy sticker tags, and tactile press-down tabs.',
        game: 'Build a comic arcade brawler HUD with starburst hit graphics and thick-outlined skill cards.',
        dashboard: 'Color-block each KPI card with thick 3px outlines and crisp black-stroked bar charts.'
      }
    },
    showcase: {
      web: {
        brand: 'SMASH! LAB',
        nav: ['작품집', '툴킷', '요금제', '가입!'],
        kicker: 'NO BORING TEMPLATES · POP BRUTALISM',
        title: '눈에 확 박히는 3px 흑선과 팝 컬러의 쾌감!',
        subtitle: '흐릿한 그림자는 집어치우세요. 단단한 하드 섀도우와 굵은 외곽선으로 0.5초 만에 브랜드를 각인시킵니다.',
        primaryCta: '지금 바로 터뜨리기 →',
        secondaryCta: '스타일 가이드',
        metrics: [
          { label: '외곽선', value: '3PX BLACK' },
          { label: '그림자 블러', value: '0PX HARD' },
          { label: '클릭 전환', value: '+240%' }
        ],
        features: [
          { num: '01!', title: '물리적 하드 섀도우', desc: '블러 없이 딱 떨어지는 검정 그림자가 클릭할 때 쑥 들어가는 중독적인 손맛을 줍니다.' },
          { num: '02!', title: '대담한 원색 컬러블록', desc: '옐로·코랄·민트를 거침없이 배치해 단조로운 회색 SaaS 사이에서 압도적으로 돋보입니다.' },
          { num: '03!', title: '타협 없는 고대비 타이포', desc: 'Syne 800 헤드라인과 순흑 본문으로 어느 화면 크기에서도 메시지가 칼같이 읽힙니다.' }
        ]
      },
      mobile: {
        appName: 'ZAP PAY!',
        greeting: '이번 주 캐시백 폭발',
        primaryCardTitle: '₩ 482,000 잔액',
        primaryCardMeta: '즉시 송금 가능 · 리워드 +12,400P',
        items: [
          { tag: 'POP', title: '인디 커피 로스터리', status: '-₩6,500' },
          { tag: 'WIN', title: '주말 챌린지 보너스', status: '+₩5,000' },
          { tag: 'HOT', title: '디자인 북스토어', status: '-₩28,000' }
        ],
        detailTitle: '원탭 송금 패드!',
        detailSub: '3px 보더 · 하드 섀도우 카드'
      },
      game: {
        genre: 'COMIC STREET BRAWLER HUD',
        title: 'HYPER PUNCH!! // STAGE 08',
        player: 'REX_KO',
        bossName: 'MECHA CRUSHER!!',
        bossSub: '슈퍼 아머 파괴 직전 · 연타 찬스!',
        hpLabel: 'HP',
        mpLabel: 'RAGE',
        skills: [
          { key: 'Q', name: '어퍼컷!', dmg: 165 },
          { key: 'W', name: '드롭킥!', dmg: 220 },
          { key: 'E', name: '코믹 슬램!', dmg: 310 },
          { key: 'R', name: '울트라 KO!!', dmg: 520 }
        ],
        logInit: 'ROUND 1 — FIGHT!! 보스를 클릭해 콤보를 폭발시키세요!'
      },
      dashboard: {
        brand: 'POP METRICS!',
        title: '크리에이터 수익 폭발 보드',
        kpis: [
          { label: '오늘 매출!', value: '₩842만', delta: '+42%!' },
          { label: '신규 팬덤', value: '3,910', delta: '+610' },
          { label: '클릭률 CTR', value: '11.8%', delta: '+3.4%' },
          { label: '굿즈 완판', value: '94%', delta: 'HOT!' }
        ]
      }
    }
  },
  {
    id: 'high-fashion',
    number: '09',
    group: 'editorial',
    nameKo: '하이패션 에디토리얼',
    nameEn: 'High-Fashion Editorial',
    tagline: '보그·킨포크 인쇄 매거진처럼 극적인 하이콘트라스트 세리프, 숨 쉬는 아이보리 여백, 1px 헤어라인 룰이 만드는 럭셔리 편집 디자인',
    traits: ['고대비 이탤릭 세리프', '넉넉한 매거진 여백', '1px 헤어라인 경계선'],
    polarity: 'light',
    fonts: {
      display: "'Playfair Display', 'Noto Serif KR', Georgia, serif",
      body: "'Inter', 'Noto Sans KR', sans-serif",
      mono: "'JetBrains Mono', monospace",
      displayName: 'Playfair Display + Noto Serif KR',
      bodyName: 'Inter',
      monoName: 'JetBrains Mono'
    },
    palette: [
      { role: '아카이브 아이보리', roleEn: 'Archival Ivory Paper', hex: '#FAF7F2' },
      { role: '크림 지면', roleEn: 'Warm Editorial Cream', hex: '#F3EDE3' },
      { role: '에스프레소 잉크', roleEn: 'Deep Espresso Ink', hex: '#1A1614' },
      { role: '버건디 액센트', roleEn: 'Couture Burgundy Accent', hex: '#7D1E2E' },
      { role: '웜 스톤 룰', roleEn: 'Warm Stone Hairline', hex: '#6B6259' }
    ],
    cssVars: {
      '--bg': '#FAF7F2',
      '--surface': '#FFFFFF',
      '--surface-2': '#F3EDE3',
      '--ink': '#1A1614',
      '--ink-muted': '#5B534B',
      '--accent': '#7D1E2E',
      '--accent-text': '#7D1E2E',
      '--accent-2': '#A67C52',
      '--accent-ink': '#FAF7F2',
      '--border': 'rgba(26, 22, 20, 0.18)',
      '--border-w': '1px',
      '--radius': '0px',
      '--radius-sm': '0px',
      '--shadow': 'none'
    },
    specimen: {
      kicker: 'AUTUMN ISSUE · VOL. 09',
      headline: 'Atelier Noir',
      sub: '극적인 세리프 · 매거진 여백 미학',
      badge: '№ 09'
    },
    dna: {
      philosophyKo: '박스와 그림자를 걷어내고 고급 패션지 한 펼침면처럼 극적인 굵기 대비의 세리프 헤드라인(정체+이탤릭 혼용), 아주 가느다란 1px 구분선, 그리고 숨 쉴 틈이 넉넉한 아이보리 여백으로 품격을 만듭니다.',
      philosophyEn: 'Emulates luxury print magazines—dramatic high-contrast serif headlines mixing roman and italic, airy archival ivory margins, and razor-thin editorial rules.',
      layoutRulesKo: [
        '카드 박스 대신 상하 1px 헤어라인(border-top / border-bottom)과 넓은 여백으로 섹션을 우아하게 나눈다.',
        '호수(`ISSUE 09`), 발행일, 에디터 노트 같은 매거진 메타데이터를 작은 대문자 트래킹(+0.18em)으로 상단에 배치한다.',
        '히어로 제목 속에 한 단어를 *이탤릭 세리프*로 강조해 편집 디자인 특유의 시적 리듬을 부여한다.'
      ],
      layoutRulesEn: [
        'Replace boxed cards with spacious margins and delicate 1px horizontal editorial rules.',
        'Anchor pages with wide-tracked small-caps metadata (ISSUE 09 · AUTUMN EDITION).',
        'Mix upright and italic Playfair Display words inside headlines for poetic couture rhythm.'
      ],
      surfaceRulesKo: [
        '배경은 순백이 아닌 따뜻한 아카이브 아이보리(#FAF7F2), 잉크는 딥 에스프레소(#1A1614)를 사용한다.',
        '그림자(box-shadow)와 둥근 모서리(border-radius)를 0px로 절제한다.',
        '포인트 컬러는 깊은 버건디(#7D1E2E)와 은은한 브론즈(#A67C52)로 극도로 아껴 쓴다.'
      ],
      surfaceRulesEn: [
        'Use warm ivory paper (#FAF7F2) paired with deep espresso ink (#1A1614).',
        'Eliminate drop shadows and keep corners crisp 0px editorial cuts.',
        'Limit color accents to deep burgundy (#7D1E2E) and muted champagne bronze.'
      ],
      typographyRulesKo: [
        'Playfair Display / Noto Serif KR의 대제목(3.2rem~4.5rem)과 11px 대문자 산세리프 캡션의 극단적 크기 대비를 준다.',
        '본문 행간은 1.75로 넉넉하게 펼쳐 잡지 칼럼처럼 편안하게 읽히게 한다.'
      ],
      typographyRulesEn: [
        'Contrast oversized Playfair Display titles (3.5rem+) against whisper-quiet 11px uppercase captions.',
        'Give body prose generous 1.75 line-height like print journalism.'
      ],
      dosKo: [
        '정체와 이탤릭을 섞은 대형 하이콘트라스트 세리프 헤드라인 구성',
        '아카이브 아이보리 지면(#FAF7F2) + 1px 수평 헤어라인 룰 중심 레이아웃',
        '대문자 자간이 넓은(0.18em) 매거진 키커와 로마숫자/호수 표기 활용',
        '여백 자체를 럭셔리 요소로 대우해 화면을 빽빽하게 채우지 않기'
      ],
      dosEn: [
        'Pair roman and italic high-contrast serifs in monumental headlines',
        'Structure content with 1px horizontal rules and generous archival ivory whitespace',
        'Use wide-tracked small uppercase kickers and issue numbers',
        'Let generous whitespace communicate luxury—never overcrowd'
      ],
      dontsKo: [
        '둥근 알약 버튼, 네온 색감, 굵은 카드 테두리, 그림자 카드 금지',
        '모든 텍스트를 굵은 산세리프로만 채워 평범한 SaaS처럼 만들지 말 것',
        '화려한 아이콘 배지나 이모지로 편집지의 격조를 깨지 말 것',
        '좁은 여백 안에 정보와 버튼을 빼곡하게 몰아넣지 말 것'
      ],
      dontsEn: [
        'Never add soft card shadows, thick borders, neon hues, or rounded pill buttons',
        'Avoid generic all-sans-serif typography that erases editorial prestige',
        'Never clutter editorial layouts with emojis or loud badges',
        'Never compress whitespace into cramped utility grids'
      ],
      domainTipsKo: {
        web: '매거진 커버처럼 중앙 대형 세리프 제호, 이탤릭 히어로, 1px 룰로 나뉜 칼럼형 룩북 섹션을 구성하세요.',
        mobile: '하이엔드 룩북·큐레이션 앱처럼 큰 세리프 타이틀, 얇은 선 리스트, 절제된 에스프레소 버튼을 쓰세요.',
        game: '느와르 미스터리/비주얼 노벨 극장처럼 챕터 로마숫자, 명암 실루엣 일러스트, 단정한 선택지 카드로 연출하세요.',
        dashboard: '프라이빗 뱅킹·아틀리에 리포트처럼 세리프 수치, 얇은 1px 표, 절제된 버건디 라인 차트를 만드세요.'
      },
      domainTipsEn: {
        web: 'Compose like a couture print cover—centered masthead, italic serif hero, and hairline editorial columns.',
        mobile: 'Design a quiet luxury curation app with generous serif titles and hairline dividers.',
        game: 'Frame as a noir mystery visual-novel theater with dramatic silhouette art and serif choice cards.',
        dashboard: 'Present metrics like a private-wealth editorial report with hairline tables and burgundy trend lines.'
      }
    },
    showcase: {
      web: {
        brand: 'MAISON ÉDITION',
        nav: ['컬렉션', '에디토리얼', '아틀리에', '프라이빗'],
        kicker: 'AUTUMN / WINTER ARCHIVE · ISSUE NO. 09',
        title: '여백과 세리프가 완성하는 변치 않는 우아함',
        subtitle: '과장된 장식을 거두고, 종이의 온기와 극적인 서체 비례만으로 브랜드의 서사를 깊이 있게 새깁니다.',
        primaryCta: '아카이브 열람',
        secondaryCta: '에디터 노트',
        metrics: [
          { label: 'EDITION', value: 'VOL. IX' },
          { label: 'SERIF RATIO', value: '1 : 4.2' },
          { label: 'CRAFT', value: 'BESPOKE' }
        ],
        features: [
          { num: 'I', title: '극적인 세리프 조형', desc: '얇은 헤어라인과 굵은 세로 획의 대비가 한 줄의 문장도 화보의 표제처럼 바꿉니다.' },
          { num: 'II', title: '숨 쉬는 아이보리 지면', desc: '순백의 차가움 대신 고급 인쇄 용지의 온기를 담은 배경 위에 1px 선으로 질서를 긋습니다.' },
          { num: 'III', title: '절제된 버건디 서명', desc: '오직 가장 중요한 행동과 액센트에만 깊은 와인 컬러를 한 방울 떨어뜨립니다.' }
        ]
      },
      mobile: {
        appName: 'MAISON JOURNAL',
        greeting: '오늘의 큐레이션 · ISSUE 09',
        primaryCardTitle: '빛의 조각: 가을 아틀리에',
        primaryCardMeta: '읽기 4분 · 파리 & 서울 에디션',
        items: [
          { tag: 'I', title: '미니멀 테일러링의 10가지 선', status: '에세이' },
          { tag: 'II', title: '세라믹 오브제 프라이빗 전시', status: '초대' },
          { tag: 'III', title: '향과 공간의 건축학적 기록', status: '인터뷰' }
        ],
        detailTitle: 'CHAPTER III · ATELIER',
        detailSub: '아카이브 아이보리 · 1px 헤어라인'
      },
      game: {
        genre: 'NOIR EDITORIAL MYSTERY',
        title: 'ACT III // THE VELVET ALIBI',
        player: 'INSPECTOR V.',
        bossName: 'SILHOUETTE IN ROOM 09',
        bossSub: '증거 심문 단계 · 결정적 모순 포착',
        hpLabel: 'POISE',
        mpLabel: 'INSIGHT',
        skills: [
          { key: 'Q', name: '단서 제시', dmg: 125 },
          { key: 'W', name: '알리바이 추궁', dmg: 195 },
          { key: 'E', name: '심리 압박', dmg: 275 },
          { key: 'R', name: '진실 폭로', dmg: 410 }
        ],
        logInit: '제3막이 열렸습니다. 화면 중앙의 실루엣을 클릭해 심문을 진행하십시오.'
      },
      dashboard: {
        brand: 'MAISON PRIVATE',
        title: '프라이빗 아틀리에 성과 리포트',
        kpis: [
          { label: '시즌 포트폴리오', value: '₩48.2억', delta: '+12.6%' },
          { label: 'VIP 리텐션', value: '96.4%', delta: '+2.1%' },
          { label: '프라이빗 예약', value: '318건', delta: '+44건' },
          { label: '평균 객단가', value: '₩284만', delta: '+8.4%' }
        ]
      }
    }
  },
  {
    id: 'bauhaus-geometry',
    number: '10',
    group: 'editorial',
    nameKo: '바우하우스 기하학',
    nameEn: 'Bauhaus Construct',
    tagline: '빨강·파랑·노랑 삼원색과 원·삼각형·사각형의 순수 기하 조형으로 형태와 기능을 통합하는 1919 모더니즘 아방가르드',
    traits: ['빨강·파랑·노랑 삼원색', '원·삼각·사각 기하 분할', '기하학적 산세리프 조형'],
    polarity: 'light',
    fonts: {
      display: "'Outfit', 'Space Grotesk', 'Noto Sans KR', sans-serif",
      body: "'Space Grotesk', 'Noto Sans KR', sans-serif",
      mono: "'JetBrains Mono', monospace",
      displayName: 'Outfit 800 + Space Grotesk',
      bodyName: 'Space Grotesk',
      monoName: 'JetBrains Mono'
    },
    palette: [
      { role: '데사우 크림 지면', roleEn: 'Dessau Parchment Paper', hex: '#F6F1E5' },
      { role: '바우하우스 레드', roleEn: 'Bauhaus Primary Red', hex: '#D12424' },
      { role: '바우하우스 블루', roleEn: 'Bauhaus Primary Blue', hex: '#1B4FBF' },
      { role: '바우하우스 옐로', roleEn: 'Bauhaus Primary Yellow', hex: '#F2BE22' },
      { role: '조형 블랙 잉크', roleEn: 'Structural Black Ink', hex: '#141414' }
    ],
    cssVars: {
      '--bg': '#F6F1E5',
      '--surface': '#FFFFFF',
      '--surface-2': '#EDE6D6',
      '--ink': '#141414',
      '--ink-muted': '#47443D',
      '--accent': '#D12424',
      '--accent-text': '#B81F1F',
      '--accent-2': '#1B4FBF',
      '--accent-ink': '#FFFFFF',
      '--border': '#141414',
      '--border-w': '2px',
      '--radius': '0px',
      '--radius-sm': '0px',
      '--shadow': 'none'
    },
    specimen: {
      kicker: 'DESSAU 1919',
      headline: 'BAUHAUS',
      sub: '삼원색 · 원·삼각·사각의 조형 질서',
      badge: '●▲■'
    },
    dna: {
      philosophyKo: '칸딘스키의 색채-형태 대응(노란 삼각형, 빨간 사각형, 파란 원)을 디지털 UI 구조로 번역합니다. 2px 검은 분할선과 대담한 삼원색 컬러 면, 그리고 완벽한 기하 도형(반원·원·직각)으로 포스터 같은 화면을 구축합니다.',
      philosophyEn: 'Translates Kandinsky’s primary color-form harmony (yellow triangle, red square, blue circle) into structural UI blocks framed by bold 2px black geometry.',
      layoutRulesKo: [
        '화면을 2px 검은 구조선으로 비대칭 블록 분할하고, 각 블록에 원형·반원·대각선 같은 기하 도형 장식을 배치한다.',
        '삼원색(레드 #D92B2B, 블루 #1B4FBF, 옐로 #F2BE22)이 서로 균형을 이루도록 한 화면 안에 비례 배치한다.',
        '장식적 사진 대신 순수 SVG 기하 도형 조합을 메인 비주얼로 세운다.'
      ],
      layoutRulesEn: [
        'Partition the viewport with crisp 2px black structural gridlines and bold primary color quadrants.',
        'Balance red (#D92B2B), cobalt blue (#1B4FBF), and ochre yellow (#F2BE22) across functional modules.',
        'Feature bold geometric SVG compositions (circles, arcs, triangles) as primary visual anchors.'
      ],
      surfaceRulesKo: [
        '따뜻한 데사우 종이 톤(#F6F1E5)을 기본 캔버스로 삼아 삼원색의 채도가 부드럽게 어우러지게 한다.',
        '블러·그라디언트·부드러운 그림자 없이 100% 플랫한 잉크 면과 2px 직각 선으로 구성한다.',
        '원형 버튼이나 반원 컷아웃(border-radius: 999px)과 0px 직각 사각형을 의도적으로 대비시킨다.'
      ],
      surfaceRulesEn: [
        'Ground the primary triad on warm Dessau parchment (#F6F1E5).',
        'Use 100% flat ink fills—zero blur, zero gradients, zero soft shadows.',
        'Juxtapose stark 0px rectangles with pure geometric circles and half-arc shapes.'
      ],
      typographyRulesKo: [
        '완전한 원형 O가 돋보이는 기하학적 산세리프(Outfit 800)를 대문자로 강하게 배치한다.',
        '수직 라벨이나 대형 숫자(1919, 01)를 건축 도면처럼 구성 요소로 활용한다.'
      ],
      typographyRulesEn: [
        'Set bold uppercase headlines in geometric Outfit (800) where circular letterforms echo the artwork.',
        'Use oversized geometric numerals as architectural composition anchors.'
      ],
      dosKo: [
        '레드·블루·옐로 삼원색 + 크림 지면 + 2px 검정 구조선으로 명쾌한 조형 구성',
        '원(●), 삼각형(▲), 사각형(■) 기하학적 그래픽을 레이아웃 일부로 통합',
        '완전 플랫 컬러 면과 0px 직각 + 정원(perfect circle)의 과감한 대비',
        '포스터처럼 힘 있는 대문자 지오메트릭 산세리프 타이포그래피'
      ],
      dosEn: [
        'Harmonize the Bauhaus primary triad (red, cobalt, yellow) on warm paper with 2px black rules',
        'Integrate circles, triangles, and squares directly into the layout architecture',
        'Contrast strict 0px right angles with pure geometric circles',
        'Use bold geometric uppercase typography inspired by 1920s exhibition posters'
      ],
      dontsKo: [
        '삼원색 외에 보라·민트·네온 핑크 등 엉뚱한 2차/3차 색상을 섞지 말 것',
        '그림자, 그라디언트, 글래스 블러, 텍스처 노이즈로 플랫 조형을 흐리지 말 것',
        '모든 카드 모서리에 어중간한 12px 둥글기를 넣지 말 것 (0px 또는 정원만)',
        '장식용 세리프나 손글씨 폰트 혼용 금지'
      ],
      dontsEn: [
        'Never pollute the primary triad with purple, neon pink, or pastel gradients',
        'Avoid drop shadows, blur, or soft gradients—stay rigorously flat',
        'Avoid generic 12px border-radius—commit to sharp 0px or pure circular geometry',
        'Never mix ornate serifs or handwritten fonts'
      ],
      domainTipsKo: {
        web: '전시 포스터처럼 삼원색 기하 블록과 대형 원형 아트워크가 교차하는 아방가르드 히어로를 만드세요.',
        mobile: '컬러 블록 헤더와 원형·사각 기하 버튼이 맞물린 명쾌한 예술관/스튜디오 앱으로 구성하세요.',
        game: '원·삼각·사각 타겟이 회전하는 추상 기하 퍼즐 아레나와 삼원색 에너지 바를 구현하세요.',
        dashboard: '빨강·파랑·노랑으로 계열을 뚜렷이 구분한 플랫 기하 막대/도넛 차트와 2px 표를 배치하세요.'
      },
      domainTipsEn: {
        web: 'Compose an exhibition-poster landing page intersecting primary color blocks and geometric SVG art.',
        mobile: 'Build a bold studio app combining sharp 2px framed modules with circular primary-color actions.',
        game: 'Create a kinetic geometric puzzle arena with rotating primary targets and stark block meters.',
        dashboard: 'Separate metrics cleanly using red, blue, and yellow flat geometric charts and 2px grid tables.'
      }
    },
    showcase: {
      web: {
        brand: 'BAUHAUS // 1919',
        nav: ['조형론', '워크숍', '전시', '아카이브'],
        kicker: 'FORM FOLLOWS FUNCTION · DESSAU ARCHIVE',
        title: '형태는 기능을 따르고, 기하는 질서를 세운다',
        subtitle: '원·삼각형·사각형과 빨강·파랑·노랑 삼원색의 순수한 조형 원리로 시대를 초월하는 인터페이스를 설계합니다.',
        primaryCta: '워크숍 입장 ●',
        secondaryCta: '조형 선언문',
        metrics: [
          { label: 'PRIMARY', value: 'R · B · Y' },
          { label: 'SHAPES', value: '● ▲ ■' },
          { label: 'ERA', value: '1919+' }
        ],
        features: [
          { num: '●', title: '파란 원의 균형', desc: '완벽한 정원과 반원 아크를 직선 그리드 안에 교차시켜 시각적 운동감을 만듭니다.' },
          { num: '▲', title: '노란 삼각의 긴장', desc: '대각선과 예각 포인트로 사용자의 시선을 핵심 행동 버튼으로 날카롭게 안내합니다.' },
          { num: '■', title: '빨간 사각의 무게', desc: '견고한 2px 검정 구조선과 붉은 블록으로 정보의 중심축을 단단히 고정합니다.' }
        ]
      },
      mobile: {
        appName: 'FORM STUDIO',
        greeting: '데사우 조형 워크숍',
        primaryCardTitle: '제10강: 색채와 비례',
        primaryCardMeta: '실습 과제 3건 · 오늘 17:00 크리틱',
        items: [
          { tag: '●', title: '기하학 포스터 구성안', status: '제출' },
          { tag: '▲', title: '삼원색 대비 비례 계산', status: '진행' },
          { tag: '■', title: '모듈러 타이포그래피', status: '예정' }
        ],
        detailTitle: 'COLOR × FORM MATRIX',
        detailSub: 'RED ■ · YELLOW ▲ · BLUE ●'
      },
      game: {
        genre: 'CONSTRUCTIVIST GEOMETRY PUZZLE',
        title: 'KANDINSKY // FORM ARENA',
        player: 'FORM-19',
        bossName: 'PRISM MONOLITH',
        bossSub: '삼원색 조형 정렬 · 기하 타격',
        hpLabel: 'FORM',
        mpLabel: 'HUE',
        skills: [
          { key: 'Q', name: '레드 스퀘어 ■', dmg: 140 },
          { key: 'W', name: '블루 서클 ●', dmg: 200 },
          { key: 'E', name: '옐로 트라이 ▲', dmg: 280 },
          { key: 'R', name: '바우하우스 통합', dmg: 440 }
        ],
        logInit: '조형 아레나 가동. 중앙 삼원색 기하 구조체를 클릭해 에너지를 공명시키세요.'
      },
      dashboard: {
        brand: 'DESSAU INDEX',
        title: '조형 워크숍 운영 데이터',
        kpis: [
          { label: '전시 관람객', value: '24,810', delta: '+19.2%' },
          { label: '아카이브 작품', value: '1,919', delta: '+48' },
          { label: '워크숍 완료율', value: '91.4%', delta: '+5.1%' },
          { label: '에디션 발행', value: '12호', delta: 'OPEN' }
        ]
      }
    }
  },
  {
    id: 'art-deco',
    number: '11',
    group: 'editorial',
    nameKo: '아르데코 골드 럭셔리',
    nameEn: 'Art Deco Luxury',
    tagline: '딥 에메랄드·옵시디언 벨벳 위에 메탈릭 골드 이중 프레임, 선버스트 기하 장식, 대칭 세리프가 빛나는 1920년대 그랜드 데코',
    traits: ['골드 이중 기하 프레임', '에메랄드·옵시디언 대비', '대칭 선버스트 장식'],
    polarity: 'dark',
    fonts: {
      display: "'Cinzel', 'Noto Serif KR', Georgia, serif",
      body: "'Inter', 'Noto Sans KR', sans-serif",
      mono: "'JetBrains Mono', monospace",
      displayName: 'Cinzel + Noto Serif KR',
      bodyName: 'Inter',
      monoName: 'JetBrains Mono'
    },
    palette: [
      { role: '딥 에메랄드 옵시디언', roleEn: 'Deep Emerald Obsidian', hex: '#091815' },
      { role: '벨벳 패널', roleEn: 'Emerald Velvet Surface', hex: '#102420' },
      { role: '샴페인 아이보리', roleEn: 'Champagne Ivory Ink', hex: '#F5ECD7' },
      { role: '메탈릭 골드 (Accent)', roleEn: 'Metallic Gold Accent', hex: '#D4AF37' },
      { role: '브라이트 브라스', roleEn: 'Bright Brass Highlight', hex: '#F3D678' }
    ],
    cssVars: {
      '--bg': '#091815',
      '--surface': '#102420',
      '--surface-2': '#16302A',
      '--ink': '#F5ECD7',
      '--ink-muted': '#C4BA9F',
      '--accent': '#D4AF37',
      '--accent-text': '#F3D678',
      '--accent-2': '#F3D678',
      '--accent-ink': '#091815',
      '--border': 'rgba(212, 175, 55, 0.45)',
      '--border-w': '1px',
      '--radius': '0px',
      '--radius-sm': '0px',
      '--shadow': '0 14px 36px rgba(0, 0, 0, 0.55), inset 0 0 0 4px #102420, inset 0 0 0 5px rgba(212, 175, 55, 0.25)'
    },
    specimen: {
      kicker: 'GRAND GATSBY · 1925',
      headline: 'ART DECO',
      sub: '에메랄드 벨벳 · 메탈릭 골드 대칭',
      badge: '◆ XI ◆'
    },
    dna: {
      philosophyKo: '1920년대 크라이슬러 빌딩과 그랜드 호텔의 기하학적 화려함을 디지털에 옮깁니다. 철저한 좌우 대칭, 안쪽으로 한 번 더 감싸는 메탈릭 골드 이중 프레임, 다이아몬드(◆) 디바이더, 장엄한 Cinzel 대문자 서체로 압도적 품격을 세웁니다.',
      philosophyEn: 'Captures 1920s architectural grandeur—strict bilateral symmetry, double-lined metallic gold frames on deep emerald-obsidian velvet, diamond dividers, and monumental Cinzel capitals.',
      layoutRulesKo: [
        '주요 히어로와 섹션 헤더는 중앙 대칭 축을 기준으로 정교하게 정렬하고 양옆에 골드 다이아몬드 구분선을 둔다.',
        '모든 핵심 카드에 바깥 골드 선 + 안쪽 미세 간격 + 내부 골드 선의 이중 액자(double-inset border)를 적용한다.',
        '배경에 은은한 부채꼴/선버스트 기하 패턴을 깔아 건축적 깊이를 더한다.'
      ],
      layoutRulesEn: [
        'Center monumental headers along a crisp symmetry axis flanked by gilded diamond rules.',
        'Frame signature panels with double-inset metallic gold borders.',
        'Layer subtle geometric sunburst or scalloped fan linework into the background.'
      ],
      surfaceRulesKo: [
        '배경은 딥 에메랄드 블랙(#091815), 표면은 #102420, 텍스트는 따뜻한 샴페인 아이보리(#F5ECD7)를 쓴다.',
        '골드(#D4AF37 ~ #F3D678) 그라디언트 메탈릭 선과 각진 코너(0px 또는 45도 컷 코너)를 사용한다.',
        '둥근 원형 버튼 대신 다이아몬드 마커와 각진 금장 버튼을 쓴다.'
      ],
      surfaceRulesEn: [
        'Contrast deep emerald-black (#091815) and dark velvet (#102420) against champagne ivory (#F5ECD7) and brushed gold (#D4AF37).',
        'Keep corners razor-sharp 0px or chamfered octagonal cuts—never soft blobs.',
        'Use gilded linear-gradient accents for primary buttons and emblems.'
      ],
      typographyRulesKo: [
        'Cinzel 대문자에 넓은 자간(+0.16em~0.24em)을 주어 극장 간판 같은 웅장한 실루엣을 만든다.',
        '본문은 깔끔한 Inter/Noto Sans KR로 대비를 잡아 가독성을 잃지 않는다.'
      ],
      typographyRulesEn: [
        'Set Cinzel display titles in uppercase with wide letter-spacing (+0.16em to +0.24em).',
        'Pair with restrained Inter body text for crisp digital readability.'
      ],
      dosKo: [
        '딥 에메랄드/옵시디언 배경 + 메탈릭 골드 이중 프레임(inset double rule)',
        '중앙 대칭 구도와 `─── ◆ ───` 기하 장식 디바이더 활용',
        '자간 넓은 Cinzel 대문자 서체와 샴페인 아이보리 잉크 조합',
        '선버스트·부채꼴·계단형 코너(stepped corners) 등 1920s 건축 모티프'
      ],
      dosEn: [
        'Pair deep emerald-obsidian surfaces with double-lined metallic gold borders',
        'Use bilateral symmetry and gilded diamond (◆) ornamental rules',
        'Set wide-tracked Cinzel capitals in warm champagne gold',
        'Incorporate geometric sunbursts and stepped architectural linework'
      ],
      dontsKo: [
        '둥글둥글한 rounded-2xl 모서리나 파스텔/네온 사이버 컬러 절대 금지',
        '너무 번쩍이는 무지개 글리터나 촌스러운 노란 원색(#FFFF00) 사용 금지',
        '비대칭 무질서 콜라주나 코믹 폰트 혼용 금지',
        '골드 배경 위에 흰 글씨를 올려 명암비를 망치지 말 것 (골드 위엔 딥 블랙 잉크)'
      ],
      dontsEn: [
        'Never use rounded-2xl pills, pastel candy hues, or neon cyberpunk colors',
        'Avoid garish #FFFF00 yellow—always use refined muted champagne/brass gold',
        'Never break geometric symmetry with sloppy collage tilts',
        'Always place deep obsidian ink (#091815) over gold CTA fills for strong contrast'
      ],
      domainTipsKo: {
        web: '선버스트 골드 엠블럼과 대칭 Cinzel 제호, 이중 금장 카드의 럭셔리 호텔·호스피탈리티 페이지를 구성하세요.',
        mobile: '프라이빗 멤버십 컨시어지 앱처럼 금장 카드 패스와 다이아몬드 구분 리스트를 배치하세요.',
        game: '1920년대 바이오쇼크·그랜드 타로 RPG처럼 금장 세공 보스 프레임, 에메랄드 테이블, 유물 카드를 만드세요.',
        dashboard: '프라이빗 클럽/자산 금고처럼 이중 금장 KPI 프레임과 브라스 골드 영역 차트를 조합하세요.'
      },
      domainTipsEn: {
        web: 'Build a grand hospitality or luxury showcase with sunburst emblems and double-framed gold cards.',
        mobile: 'Craft a private concierge membership pass with chamfered gold cards and diamond list dividers.',
        game: 'Create a 1920s gilded relic/card RPG arena with filigree gold frames and emerald velvet surfaces.',
        dashboard: 'Design a gilded wealth vault dashboard with brass line charts and double-ruled KPI frames.'
      }
    },
    showcase: {
      web: {
        brand: 'THE GRAND AURELIA',
        nav: ['스위트', '살롱', '아카이브', '예약'],
        kicker: 'EST. MCMXXV · ARCHITECTURAL GRANDEUR',
        title: '황금빛 기하학과 대칭이 빚어내는 시대의 걸작',
        subtitle: '에메랄드 옵시디언 지면 위 정교한 이중 금장 프레임과 선버스트 장식으로 압도적인 럭셔리 경험을 선사합니다.',
        primaryCta: '프라이빗 살롱 예약',
        secondaryCta: '1925 아카이브',
        metrics: [
          { label: 'HERITAGE', value: 'MCMXXV' },
          { label: 'FINISH', value: '24K BRASS' },
          { label: 'SYMMETRY', value: 'AXIAL' }
        ],
        features: [
          { num: '◆ I', title: '이중 금장 액자 프레임', desc: '바깥선과 안쪽선이 정밀하게 겹치는 아르데코 건축 비례로 모든 카드를 액자처럼 세웁니다.' },
          { num: '◆ II', title: '선버스트 기하 광휘', desc: '중심에서 뻗어 나가는 황금 방사선과 다이아몬드 문양으로 극적인 시각 중심을 잡습니다.' },
          { num: '◆ III', title: '에메랄드 벨벳 대비', desc: '깊은 짙은 녹흑색 배경과 샴페인 아이보리 서체가 고급 인쇄물 같은 가독성을 지킵니다.' }
        ]
      },
      mobile: {
        appName: 'AURELIA CLUB',
        greeting: 'GOLD MEMBER · SUITE 1925',
        primaryCardTitle: 'GRAND SALON ACCESS',
        primaryCardMeta: '컨시어지 직통 · 발렛 및 라운지 포함',
        items: [
          { tag: '◆', title: '루프탑 재즈 갈라 예약', status: '확정' },
          { tag: '◆', title: '프라이빗 셀러 테이스팅', status: '20:00' },
          { tag: '◆', title: '아르데코 갤러리 도슨트', status: '초대' }
        ],
        detailTitle: 'GILDED CONCIERGE',
        detailSub: 'DOUBLE GOLD RULE · EMERALD VELVET'
      },
      game: {
        genre: '1920S GILDED RELIC RPG',
        title: 'THE GILDED VAULT // ACT XI',
        player: 'LADY AURELIA',
        bossName: 'CLOCKWORK SOVEREIGN',
        bossSub: '황금 태엽 수호자 · 유물 봉인 해제',
        hpLabel: 'VITALITY',
        mpLabel: 'AETHER',
        skills: [
          { key: 'Q', name: '황금 인장', dmg: 150 },
          { key: 'W', name: '아르카나 카드', dmg: 215 },
          { key: 'E', name: '선버스트 심판', dmg: 305 },
          { key: 'R', name: '그랜드 피날레', dmg: 470 }
        ],
        logInit: '황금 금고의 문이 열렸습니다. 수호자 엠블럼을 클릭해 유물 주문을 발동하세요.'
      },
      dashboard: {
        brand: 'AURELIA TREASURY',
        title: '프라이빗 금고 자산 현황',
        kpis: [
          { label: '총 운용 자산', value: '₩182억', delta: '+14.8%' },
          { label: '멤버십 지수', value: '98.2%', delta: '+1.4%' },
          { label: '연간 수익률', value: '11.4%', delta: '+2.3%' },
          { label: '보관 유물 수', value: '428점', delta: 'VERIFIED' }
        ]
      }
    }
  },
  {
    id: 'risograph',
    number: '12',
    group: 'editorial',
    nameKo: '리소그래프 인디 콜라주',
    nameEn: 'Risograph Print Indie',
    tagline: '하프톤 망점, 종이 결, 형광 핑크와 코발트 블루 잉크가 미세하게 어긋나 겹쳐 찍힌(오버프린트) 따뜻한 인디 인쇄소 미학',
    traits: ['2도 오버프린트 어긋남', '하프톤 망점·종이 질감', '스탬프·진(Zine) 감성'],
    polarity: 'light',
    fonts: {
      display: "'Fraunces', 'Noto Serif KR', Georgia, serif",
      body: "'Space Grotesk', 'Noto Sans KR', sans-serif",
      mono: "'JetBrains Mono', monospace",
      displayName: 'Fraunces + JetBrains Mono',
      bodyName: 'Space Grotesk',
      monoName: 'JetBrains Mono'
    },
    palette: [
      { role: '미색 인쇄 용지', roleEn: 'Uncoated Cream Print Stock', hex: '#F6F0E4' },
      { role: '코발트 리소 잉크', roleEn: 'Cobalt Risograph Ink', hex: '#1D42D8' },
      { role: '형광 핑크 잉크', roleEn: 'Fluorescent Rose Overprint', hex: '#CC1F52' },
      { role: '선플라워 잉크', roleEn: 'Sunflower Spot Ink', hex: '#F4B829' },
      { role: '딥 인디고 잉크', roleEn: 'Deep Indigo Text Ink', hex: '#1B2559' }
    ],
    cssVars: {
      '--bg': '#F6F0E4',
      '--surface': '#FBF8F1',
      '--surface-2': '#EFE7D6',
      '--ink': '#1B2559',
      '--ink-muted': '#3E4878',
      '--accent': '#CC1F52',
      '--accent-text': '#B01744',
      '--accent-2': '#1D42D8',
      '--accent-ink': '#FFFFFF',
      '--border': '#1D42D8',
      '--border-w': '2px',
      '--radius': '4px',
      '--radius-sm': '2px',
      '--shadow': '4px 4px 0px rgba(255, 78, 122, 0.72), -2px -2px 0px rgba(29, 66, 216, 0.25)'
    },
    specimen: {
      kicker: '2-COLOR OVERPRINT',
      headline: 'Riso Zine',
      sub: '형광 핑크 × 코발트 망점 인쇄',
      badge: 'ED. 50'
    },
    dna: {
      philosophyKo: '완벽하게 매끈한 디지털 픽셀 대신, 독립 출판 인쇄기(리소그래프)로 코발트 블루 판과 형광 핑크 판을 2도 인쇄했을 때 생기는 살짝 어긋난 핀트(misregistration), 하프톤 도트, 종이의 포근한 온기를 그대로 살립니다.',
      philosophyEn: 'Celebrates tactile indie printmaking—warm cream stock, halftone dot textures, fluorescent pink & cobalt blue dual-ink shadows with charming print misregistration.',
      layoutRulesKo: [
        '순수 검정(#000) 대신 딥 인디고(#1B2559)와 코발트 블루(#1D42D8)를 기본 잉크색으로 사용한다.',
        '카드와 버튼 그림자를 검정이 아닌 형광 핑크 오프셋(`4px 4px 0 #FF4E7A`)으로 찍어 2도 판 어긋남을 표현한다.',
        '스탬프 도장, 절취선(dashed border), 에디션 번호(`ED. 042/100`) 같은 인쇄물 디테일을 녹여낸다.'
      ],
      layoutRulesEn: [
        'Replace pure black with deep indigo (#1B2559) and cobalt blue (#1D42D8) print ink.',
        'Offset card shadows in fluorescent pink (#FF4E7A) to evoke physical 2-plate misregistration.',
        'Include dashed tear lines, edition stamps (ED. 042/100), and halftone patterns.'
      ],
      surfaceRulesKo: [
        '배경은 재생 종이 느낌의 미색 크림(#F6F0E4) 위에 미세한 하프톤 도트 패턴을 얹는다.',
        '두 잉크(블루+핑크)가 겹치는 지점은 자연스럽게 깊은 퍼플/플럼 톤으로 표현해 오버프린트 효과를 낸다.',
        '점선(dashed) 구분선과 2px 코발트 실선 테두리를 리드미컬하게 섞는다.'
      ],
      surfaceRulesEn: [
        'Use warm uncoated cream paper (#F6F0E4) overlaid with subtle halftone dot patterns.',
        'Let cobalt blue and fluorescent pink overlap visually like real soy-ink overprints.',
        'Mix 2px cobalt borders with dashed perforated print dividers.'
      ],
      typographyRulesKo: [
        '유기적이고 개성 넘치는 세리프 Fraunces(700~800)로 따뜻한 인디 표제를 쓰고, 캡션은 타자기 감성의 JetBrains Mono를 쓴다.',
        '제목에 미세한 핑크 오프셋 text-shadow를 주면 리소 인쇄 질감이 즉시 살아난다.'
      ],
      typographyRulesEn: [
        'Pair expressive soft-serif Fraunces display titles with typewriter-crisp JetBrains Mono captions.',
        'Add subtle 2px offset ink shadows on large headings for tactile overprint charm.'
      ],
      dosKo: [
        '순흑 대신 딥 인디고·코발트 잉크 + 형광 핑크 오프셋 2도 인쇄 조합',
        '배경과 일러스트에 하프톤 망점 패턴과 절취선(dashed) 디테일 활용',
        'Fraunces 세리프 + JetBrains Mono 스탬프 메타데이터 조합',
        '종이 질감의 따뜻한 미색 배경(#F6F0E4) 유지'
      ],
      dosEn: [
        'Use cobalt blue + fluorescent pink duotone ink instead of stark digital black',
        'Add halftone dot textures, dashed print crop lines, and edition stamps',
        'Pair chunky warm Fraunces serifs with monospace print edition labels',
        'Keep the warm uncoated cream paper backdrop (#F6F0E4)'
      ],
      dontsKo: [
        '차가운 네온 다크 모드나 매끈한 금속/유리 광택 금지',
        '4~5가지 이상의 무지개 색을 섞어 리소그래프 특유의 2~3도 제한 잉크 매력을 망치지 말 것',
        '부드러운 가우시안 블러 그림자 사용 금지',
        '딱딱한 기업용 표준 산세리프로만 채우지 말 것'
      ],
      dontsEn: [
        'Never use sleek glossy glass, chrome gradients, or dark cyber-neon backgrounds',
        'Stick to a disciplined 2–3 spot-ink palette—never full-spectrum rainbow gradients',
        'Avoid soft blurred drop shadows',
        'Avoid sterile corporate sans-serif monotony'
      ],
      domainTipsKo: {
        web: '독립 출판사·인디 페스티벌 사이트처럼 2도 잉크 히어로, 절취선 티켓 카드, 스탬프 버튼을 배치하세요.',
        mobile: '인디 매거진·북클럽 앱처럼 에디션 스탬프 카드, 점선 구분 독서 노트, 핑크 잉크 버튼을 구성하세요.',
        game: '손으로 찍은 인디 진(Zine) 어드벤처 맵 RPG처럼 망점 보스 일러스트, 스탬프 스킬 카드를 연출하세요.',
        dashboard: '스튜디오 인쇄/출판 현황처럼 블루·핑크 2도 오버프린트 막대 차트와 절취선 KPI 카드를 만드세요.'
      },
      domainTipsEn: {
        web: 'Craft an indie print festival or publisher site with overprint headlines and perforated ticket cards.',
        mobile: 'Design an indie bookclub/zine reader with edition stamps and dashed-rule cards.',
        game: 'Build a hand-printed zine RPG map with halftone duotone artwork and stamp-card skills.',
        dashboard: 'Render studio metrics using cobalt-and-pink duotone charts and perforated paper KPI tiles.'
      }
    },
    showcase: {
      web: {
        brand: 'PRESS RISO №12',
        nav: ['발행물', '잉크 차트', '워크숍', '주문'],
        kicker: 'SOY INK 2-COLOR OVERPRINT · ED. 050/100',
        title: '살짝 어긋난 두 가지 잉크가 만드는 손맛의 미학',
        subtitle: '코발트 블루와 형광 핑크의 2도 오버프린트, 하프톤 망점, 미색 종이 결로 인간미 넘치는 인디 웹을 빚어냅니다.',
        primaryCta: '에디션 예약 찍기',
        secondaryCta: '잉크 견본 보기',
        metrics: [
          { label: 'INK PLATES', value: '2 SPOT' },
          { label: 'SCREEN', value: '65 LPI' },
          { label: 'EDITION', value: '050/100' }
        ],
        features: [
          { num: 'P-1', title: '2도 판 어긋남 그림자', desc: '검은 그림자 대신 형광 핑크 잉크가 4px 어긋나 찍힌 듯한 리소 인쇄 고유의 입체감을 줍니다.' },
          { num: 'P-2', title: '하프톤 망점 텍스처', desc: '미세한 인쇄 도트 패턴과 점선 절취선이 디지털 화면에 종이 인쇄물의 온기를 불어넣습니다.' },
          { num: 'P-3', title: '개성파 Fraunces 세리프', desc: '부드럽게 부푼 세리프 곡선과 모노스페이스 스탬프 라벨이 독립 출판 감성을 완성합니다.' }
        ]
      },
      mobile: {
        appName: 'ZINE CLUB',
        greeting: '이번 달 리소 인쇄 도착',
        primaryCardTitle: '가을 독립 만화 합본 #12',
        primaryCardMeta: '2도 코발트+핑크 · 한정 100부 번호 각인',
        items: [
          { tag: 'INK', title: '형광 핑크 테스트 프린트', status: '완료' },
          { tag: 'CUT', title: '중철 제본 & 재단 체크', status: '진행' },
          { tag: 'BOX', title: '구독자 50명 발송 준비', status: 'D-2' }
        ],
        detailTitle: 'PRINT EDITION STAMP',
        detailSub: 'COBALT #1D42D8 × FLUO PINK #FF4E7A'
      },
      game: {
        genre: 'INDIE ZINE MAP RPG',
        title: 'INKWOOD // ZINE QUEST #12',
        player: 'PRINTER M.',
        bossName: 'HALFTONE GOLEM',
        bossSub: '잉크 번짐 수호자 · 스탬프 봉인',
        hpLabel: 'PAPER',
        mpLabel: 'INK',
        skills: [
          { key: 'Q', name: '코발트 스탬프', dmg: 130 },
          { key: 'W', name: '핑크 오버프린트', dmg: 195 },
          { key: 'E', name: '하프톤 스플래시', dmg: 270 },
          { key: 'R', name: '완전 초판 인쇄', dmg: 430 }
        ],
        logInit: '인디 진 던전 12페이지 진입! 중앙 망점 골렘을 클릭해 잉크 스탬프를 찍으세요.'
      },
      dashboard: {
        brand: 'RISO PRESS LOG',
        title: '인쇄소 에디션 출고 대시보드',
        kpis: [
          { label: '월간 인쇄 부수', value: '12,400부', delta: '+24%' },
          { label: '한정판 완판율', value: '96.5%', delta: '+4.8%' },
          { label: '정기 구독자', value: '1,840명', delta: '+215' },
          { label: '잉크 재고', value: '82%', delta: 'OK' }
        ]
      }
    }
  },
  {
    id: 'kinetic-type',
    number: '13',
    group: 'editorial',
    nameKo: '키네틱 애시드 타이포',
    nameEn: 'Kinetic Acid Typography',
    tagline: '화면을 압도하는 초대형 변형 타이포그래피, 딥 블랙과 일렉트릭 애시드 라임의 레이저 대비, 리드미컬한 운동 에너지의 실험 그래픽',
    traits: ['초대형 압축 타이포', '블랙 × 애시드 라임', '운동감 있는 티커·스트라이프'],
    polarity: 'dark',
    fonts: {
      display: "'Syne', 'Noto Sans KR', sans-serif",
      body: "'Space Grotesk', 'Noto Sans KR', sans-serif",
      mono: "'JetBrains Mono', monospace",
      displayName: 'Syne 800 + JetBrains Mono',
      bodyName: 'Space Grotesk',
      monoName: 'JetBrains Mono'
    },
    palette: [
      { role: '피치 블랙 (Void)', roleEn: 'Pitch Void Black', hex: '#09090B' },
      { role: '카본 표면', roleEn: 'Carbon Panel Surface', hex: '#141418' },
      { role: '순백 텍스트', roleEn: 'Stark White Ink', hex: '#FAFAFA' },
      { role: '애시드 볼트 라임', roleEn: 'Electric Acid Volt Lime', hex: '#CCFF00' },
      { role: '일렉트릭 펄스', roleEn: 'Electric Pulse Magenta', hex: '#FF2E93' }
    ],
    cssVars: {
      '--bg': '#09090B',
      '--surface': '#141418',
      '--surface-2': '#1D1D24',
      '--ink': '#FAFAFA',
      '--ink-muted': '#B4B4BE',
      '--accent': '#CCFF00',
      '--accent-text': '#CCFF00',
      '--accent-2': '#FF2E93',
      '--accent-ink': '#09090B',
      '--border': 'rgba(204, 255, 0, 0.32)',
      '--border-w': '1.5px',
      '--radius': '2px',
      '--radius-sm': '2px',
      '--shadow': 'none'
    },
    specimen: {
      kicker: '140 BPM // KINETIC',
      headline: 'MOVE FAST',
      sub: '초대형 타이포 · 애시드 볼트 대비',
      badge: '⚡ 140'
    },
    dna: {
      philosophyKo: '글자 그 자체가 일러스트이자 무대가 됩니다. 피치 블랙(#09090B) 위에 면도날처럼 선명한 애시드 라임(#CCFF00), 화면 폭을 찢을 듯한 초대형 Syne 800 헤드라인, 대각선 리듬 스트라이프와 BPM 티커로 음악 페스티벌·스트리트 브랜드급 에너지를 폭발시킵니다.',
      philosophyEn: 'Turns typography itself into kinetic spectacle—monumental Syne 800 headlines, razor-sharp acid lime (#CCFF00) against pitch black (#09090B), and high-BPM rhythmic tickers.',
      layoutRulesKo: [
        '히어로 헤드라인을 극단적으로 크게(clamp(2.8rem, 7vw, 6rem)) 키우고, 1~2단어를 외곽선(text-stroke) 또는 애시드 라임 배경 하이라이트로 반전시킨다.',
        '섹션 경계에 슬랜트 스트라이프나 반복 타이포 티커 띠를 넣어 정지된 화면에서도 속도감을 준다.',
        '카드 상단에 큰 모노스페이스 카운터(`01 // 140BPM`)와 날카로운 직선 화살표(`↗`)를 배치한다.'
      ],
      layoutRulesEn: [
        'Scale headlines to monumental proportions, mixing solid ink, outline stroke, and acid-lime highlight blocks.',
        'Use high-velocity ticker ribbons and diagonal caution stripes between sections.',
        'Anchor blocks with bold monospace indices (01 // 140BPM) and directional arrows (↗).'
      ],
      surfaceRulesKo: [
        '배경은 완전한 피치 블랙(#09090B), 포인트는 눈을 찌르는 애시드 라임(#CCFF00) 단일 주인공을 세운다.',
        '애시드 라임 배경 위 글자는 예외 없이 순흑(#09090B)을 써서 극강의 명도 대비를 확보한다.',
        '모서리는 날카로운 0~2px로 유지해 스포티하고 공격적인 인상을 고정한다.'
      ],
      surfaceRulesEn: [
        'Pit pure pitch black (#09090B) against electric acid lime (#CCFF00).',
        'Always place #09090B ink on acid-lime fills for razor legibility.',
        'Keep corners razor-sharp (0–2px) for aggressive kinetic momentum.'
      ],
      typographyRulesKo: [
        'Syne 800 대문자 + 타이트한 행간(0.88~0.95) + 강렬한 한국어 블랙 웨이트로 덩어리감을 만든다.',
        '중간 크기 문단보다 짧은 선언문과 거대한 숫자 카운터에 집중한다.'
      ],
      typographyRulesEn: [
        'Compress line-height (0.88–0.95) on monumental uppercase Syne 800 headlines.',
        'Favor punchy manifesto statements and oversized metric counters over dense prose.'
      ],
      dosKo: [
        '피치 블랙(#09090B) × 애시드 라임(#CCFF00) 극강 대비와 0~2px 각진 실루엣',
        '솔리드 텍스트와 아웃라인 스트로크 텍스트를 교차하는 초대형 타이포 히어로',
        '반복 티커 띠·화살표(↗)·BPM/속도 카운터로 멈추지 않는 리듬감 연출',
        '호버 시 애시드 라임 배경 + 흑색 텍스트로 번쩍 반전되는 즉각 인터랙션'
      ],
      dosEn: [
        'Command attention with pitch black + electric acid lime (#CCFF00) and sharp 0–2px cuts',
        'Mix monumental filled and stroked display typography as primary artwork',
        'Embed kinetic ticker banners, arrows (↗), and live tempo counters',
        'Snap hover states into instant acid-lime inversions'
      ],
      dontsKo: [
        '부드러운 파스텔 톤, 둥근 버블 카드, 따뜻한 종이 질감 금지',
        '잔잔한 세리프 서체나 소심한 크기의 제목으로 힘을 빼지 말 것',
        '애시드 라임 위에 흰 글씨를 올려 읽을 수 없게 만들지 말 것',
        'prefers-reduced-motion 사용자를 무시하고 과도한 깜빡임을 강제하지 말 것'
      ],
      dontsEn: [
        'Never soften with pastel tints, puffy rounded cards, or warm paper textures',
        'Never shrink display titles into timid corporate heading sizes',
        'Never put white text on acid-lime fills—always use pure black ink',
        'Always respect prefers-reduced-motion for ticker/kinetic animations'
      ],
      domainTipsKo: {
        web: '화면 폭을 채우는 초대형 Syne 타이포 + 애시드 라임 티커 + 고속 반전 CTA로 페스티벌/스트리트 브랜드 웹을 만드세요.',
        mobile: '러닝/피트니스·공연 티켓 앱처럼 거대한 수치 카운터와 볼트 라임 퀵 액션 바를 배치하세요.',
        game: '초고속 리듬/스피드런 아케이드 HUD처럼 거대한 BPM 콤보 숫자와 사선 레인 비주얼라이저를 구현하세요.',
        dashboard: '실시간 이벤트/트래픽 급증 보드처럼 초대형 볼트 숫자 KPI와 날카로운 애시드 스파이크 차트를 쓰세요.'
      },
      domainTipsEn: {
        web: 'Build a kinetic festival/creative-agency landing page anchored by giant stroked typography and ticker bands.',
        mobile: 'Design a high-energy workout or live-event app with colossal metric numerals and acid-lime CTAs.',
        game: 'Craft a 140-BPM rhythm/speedrun HUD with giant kinetic combo counters and angled energy lanes.',
        dashboard: 'Spotlight live velocity metrics with oversized volt numerals and razor-sharp spike charts.'
      }
    },
    showcase: {
      web: {
        brand: 'VOLT // KINETIC',
        nav: ['LINEUP', 'MOTION', 'DROPS', 'PASS ↗'],
        kicker: '140 BPM · HIGH-VOLTAGE TYPOGRAPHIC SYSTEM',
        title: '타이포가 곧 그래픽이자 속도가 되는 순간',
        subtitle: '이미지가 없어도 화면이 터질 듯한 에너지. 피치 블랙과 애시드 라임, 초대형 키네틱 서체로 시선을 압도합니다.',
        primaryCta: '드롭 입장하기 ↗',
        secondaryCta: '모션 릴 보기',
        metrics: [
          { label: 'TEMPO', value: '140 BPM' },
          { label: 'CONTRAST', value: '17.8 : 1' },
          { label: 'DROP', value: 'LIVE NOW' }
        ],
        features: [
          { num: '01↗', title: '초대형 서체 무대', desc: '제목 그 자체가 일러스트 역할을 하며 솔리드와 아웃라인 획이 리드미컬하게 교차합니다.' },
          { num: '02↗', title: '애시드 볼트 시그널', desc: '피치 블랙 속 단 하나의 볼트 라임(#CCFF00)이 모든 CTA와 수치를 번개처럼 강조합니다.' },
          { num: '03↗', title: '고속 반전 인터랙션', desc: '커서를 올리는 즉시 면과 잉크가 0.12초 만에 반전되어 짜릿한 속도감을 전달합니다.' }
        ]
      },
      mobile: {
        appName: 'VOLT RUN 140',
        greeting: 'INTERVAL SESSION · LIVE',
        primaryCardTitle: '04\'12" / KM PACE',
        primaryCardMeta: 'BPM 168 · 구간 최고 기록 경신 중 ↗',
        items: [
          { tag: 'LAP1', title: '스프린트 400M 인터벌', status: '1:18' },
          { tag: 'LAP2', title: '템포 런 1,200M', status: '4:52' },
          { tag: 'MAX', title: '피크 케이던스 유지', status: '184' }
        ],
        detailTitle: 'HIGH-VOLT SPLIT',
        detailSub: 'PITCH BLACK × ACID LIME #CCFF00'
      },
      game: {
        genre: 'HIGH-BPM RHYTHM SPEEDRUN',
        title: 'OVERDRIVE 140 // BEAT ARENA',
        player: 'RUNNER_X',
        bossName: 'PULSE BREAKER 140',
        bossSub: '140 BPM 동기화 · 퍼펙트 히트 존!',
        hpLabel: 'SYNC',
        mpLabel: 'VOLT',
        skills: [
          { key: 'Q', name: '비트 슬래시', dmg: 160 },
          { key: 'W', name: '더블 타임', dmg: 230 },
          { key: 'E', name: '볼트 드롭', dmg: 325 },
          { key: 'R', name: '풀 콤보 버스트', dmg: 510 }
        ],
        logInit: '140 BPM 카운트다운 완료! 중앙 펄스 코어를 리듬에 맞춰 타격하세요 ↗'
      },
      dashboard: {
        brand: 'VOLT STREAM',
        title: '실시간 드롭 트래픽 스파이크',
        kpis: [
          { label: '동시 접속 피크', value: '84.2K', delta: '+312%' },
          { label: '초당 결제', value: '1,420/s', delta: 'PEAK ↗' },
          { label: '드롭 완판 시간', value: '00:42', delta: 'NEW!' },
          { label: '서버 여유율', value: '74%', delta: 'FAST' }
        ]
      }
    }
  }
]);
