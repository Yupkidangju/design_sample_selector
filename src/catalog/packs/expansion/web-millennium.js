import { defineExpansionPack, expansionBlueprint as b } from './authoring.js';

export const WEB_MILLENNIUM_PACK = defineExpansionPack({
  id: 'web-millennium',
  order: 60,
  startOrder: 850,
  title: { ko: '웹 밀레니엄 12종', en: 'Web Millennium 12' },
  blueprints: [
    b('luxury-serif-minimal', 'editorial', 'portal-frame', '럭셔리 세리프 미니멀', 'Luxury Serif Minimal', '가는 세리프 제목·작은 제품 번호·넓은 크림 면으로 절제된 고급 편집 경험을 만드는 화면', ['#F4EFE7', '#FFFCF7', '#DDD2C4', '#7A2638', '#8A6337'], '가느다란 이중 프레임과 한 줄짜리 컬렉션 인덱스', ['럭셔리', '세리프']),
    b('early-web', 'y2k', 'portal-frame', '얼리 웹', 'Early Web', '파란 밑줄 링크·회색 규칙선·작은 배지로 정보와 연결 자체를 전면에 둔 초기 웹 화면', ['#F2F2EE', '#FFFFFF', '#D6D6D0', '#0000CC', '#B00000'], '사이트맵 링크 열과 방문 횟수 카운터가 있는 문서 프레임', ['초기 웹', '하이퍼링크']),
    b('geocities-maximal', 'y2k', 'portal-frame', '지오시티스 맥시멀', 'GeoCities Maximal', '개인 배너·별·링크 버튼·방명록을 과감히 겹친 팬페이지형 맥시멀 웹 스타일', ['#FFF36A', '#FFFFFF', '#D8C83B', '#D719A4', '#1648D8'], '작은 88×31 배지 열과 별이 둘러싼 환영 메시지', ['개인 홈페이지', '맥시멀']),
    b('aqua-desktop', 'y2k', 'portal-frame', '아쿠아 데스크톱', 'Aqua Desktop', '물방울 버튼과 선명한 청색 창 프레임으로 2000년대 초 데스크톱의 반짝이는 조작감을 재현한 UI', ['#EAF6FF', '#FFFFFF', '#C8E6F5', '#147BC2', '#6E3FC7'], '물방울형 창 제어와 줄무늬가 있는 둥근 도구 모음', ['아쿠아', '데스크톱']),

    b('luna-desktop', 'y2k', 'glossy-window', '루나 데스크톱', 'Luna Desktop', '파란 제목 표시줄·초록 시작 버튼·둥근 작업 패널로 친근한 개인용 컴퓨터 환경을 만드는 디자인', ['#E7EEF8', '#FAFCFF', '#CBD8EA', '#275FB5', '#3F8C43'], '두꺼운 창 제목 바와 시작 메뉴를 닮은 행동 버튼', ['루나', 'OS UI']),
    b('web2-gloss', 'y2k', 'glossy-window', '웹 2.0 글로스', 'Web 2.0 Gloss', '반사광이 있는 둥근 CTA와 밝은 서비스 배지로 참여형 웹의 낙관성을 표현한 화면', ['#EEF6FA', '#FFFFFF', '#D1E3EC', '#137FB3', '#D54C32'], '광택 버튼과 구독자 수를 보여 주는 작은 서비스 캡슐', ['웹 2.0', '글로스']),
    b('flash-portal', 'y2k', 'glossy-window', '플래시 포털', 'Flash Portal', '원형 메뉴·로딩 바·강한 색 전환을 정적인 접근 가능 구조로 재해석한 몰입형 포털', ['#EEF1F7', '#FFFFFF', '#D2D8E4', '#5B45B9', '#D04473'], '방사형 섹션 메뉴와 장면 진행률을 표시하는 타임라인', ['플래시', '포털']),
    b('blogspot-collage', 'y2k', 'glossy-window', '블로그스팟 콜라주', 'Blogspot Collage', '사이드바 위젯·날짜 스탬프·스크랩 이미지 자리를 조합한 개인 블로그형 편집 화면', ['#F3EBDD', '#FFFDF8', '#DCCDBA', '#A23A4B', '#3A6F7B'], '달력·프로필·링크 목록을 둘러싼 스크랩북 프레임', ['블로그', '스크랩']),

    b('cyber-y2k', 'y2k', 'chrome-pop', '사이버 Y2K', 'Cyber Y2K', '검은 배경 위 크롬 캡슐과 전기 청록 신호로 밀레니엄 사이버 패션을 표현한 화면', ['#080B13', '#151A28', '#293148', '#28E1D1', '#A855F7'], '크롬 타원 속 디지털 아이디와 와이어형 별 문양', ['사이버', 'Y2K']),
    b('kawaii-pixel-web', 'y2k', 'chrome-pop', '카와이 픽셀 웹', 'Kawaii Pixel Web', '픽셀 캐릭터·하트 배지·작은 상태창을 밝은 디지털 스티커처럼 배열한 팬 웹 스타일', ['#171126', '#281C3D', '#42305D', '#FF78B7', '#62E5DF'], '픽셀 얼굴 상태 배지와 하트 모양 링크 인덱스', ['카와이', '픽셀']),
    b('scene-core-web', 'y2k', 'chrome-pop', '신 코어 웹', 'Scene-core Web', '네온 체크·손글씨형 제목·과장된 온라인 상태 배지로 2000년대 커뮤니티 에너지를 재구성한 화면', ['#120E1C', '#24182E', '#3A2747', '#C7FF00', '#FF3DA1'], '체커보드 띠와 겹쳐 붙인 온라인 친구 카드', ['신 코어', '커뮤니티']),
    b('mcbling-gloss', 'y2k', 'chrome-pop', '맥블링 글로스', 'McBling Gloss', '금빛 크롬·보석 점·핑크 광택으로 과시적인 팝 럭셔리를 만드는 디지털 스타일', ['#1A0E18', '#301A2B', '#4B2B43', '#F4C95D', '#F062B2'], '보석이 박힌 워드마크와 VIP 카드형 가격 패널', ['맥블링', '글램'])
  ]
});

export const WEB_MILLENNIUM_STYLES = WEB_MILLENNIUM_PACK.styles;
export const WEB_MILLENNIUM_BLUEPRINTS = WEB_MILLENNIUM_PACK.blueprints;
export const WEB_MILLENNIUM_MANIFEST = WEB_MILLENNIUM_PACK.manifest;
