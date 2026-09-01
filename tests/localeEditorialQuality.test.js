import test from 'node:test';
import assert from 'node:assert/strict';

import { loadLocaleSnapshot } from '../src/i18n/index.js';

const APPROVED_HIGH_RISK_NAMES = Object.freeze({
  neumorphism: Object.freeze({
    ko: '소프트 뉴모피즘',
    en: 'Soft Neumorphism',
    ja: 'ソフトニューモーフィズム',
    'zh-CN': '柔和新拟态',
    'zh-TW': '柔和新擬態'
  }),
  'de-stijl': Object.freeze({
    ko: '데 스틸 신조형주의',
    en: 'De Stijl Neo-Plasticism',
    ja: 'デ・ステイル新造形主義',
    'zh-CN': '风格派新造型主义',
    'zh-TW': '風格派新造形主義'
  }),
  'functional-wayfinding': Object.freeze({
    ko: '기능주의 웨이파인딩',
    en: 'Functional Wayfinding',
    ja: '機能主義ウェイファインディング',
    'zh-CN': '功能主义导视',
    'zh-TW': '功能主義導視'
  }),
  'information-isotype': Object.freeze({
    ko: '아이소타입 정보 디자인',
    en: 'Isotype Information Design',
    ja: 'アイソタイプ情報デザイン',
    'zh-CN': 'Isotype信息设计',
    'zh-TW': 'Isotype資訊設計'
  }),
  'mica-surface': Object.freeze({
    ko: '마이카 소재',
    en: 'Mica Material',
    ja: 'マイカ素材',
    'zh-CN': '云母材质',
    'zh-TW': 'Mica（雲母）材質'
  }),
  'spatial-glass-ui': Object.freeze({
    ko: '공간형 글래스 UI',
    en: 'Spatial Glass UI',
    ja: '空間型ガラスUI',
    'zh-CN': '空间玻璃界面',
    'zh-TW': '空間玻璃介面'
  }),
  'eighties-new-wave': Object.freeze({
    ko: '80년대 뉴웨이브',
    en: '1980s New Wave',
    ja: '80年代ニューウェーブ',
    'zh-CN': '80年代新浪潮',
    'zh-TW': '80年代新浪潮'
  })
});

const FORBIDDEN_MACHINE_TRANSLATION_FRAGMENTS = Object.freeze({
  ja: Object.freeze(['ﾅﾝﾌﾞﾊｲﾄﾞｳｼｮｳ', '新憲法主義', '端子行列', '特別なガラスUI']),
  'zh-CN': Object.freeze(['软性肺形态异常', '新立宪主义', '函数式寻路', '端子矩阵', '特殊玻璃用户界面']),
  'zh-TW': Object.freeze(['軟性氣象', '新立憲主義', '函數式尋路', '終端矩陣', '特殊玻璃用戶界面'])
});

const APPROVED_MACHINE_TRANSLATION_REPAIRS = Object.freeze({
  'raw-brutalism': ['ロウ・デジタル・ブルータリズム', '原生数字粗野主义', '原生數位粗野主義'],
  'neo-brutalism': ['トレンディ・ネオブルータリズム', '潮流新粗野主义', '潮流新粗野主義'],
  glassmorphism: ['フロステッド・グラスモーフィズム', '磨砂玻璃拟态', '霧面玻璃擬態'],
  skeuomorphism: ['モダン・スキューモーフィズム 2.0', '现代拟物化 2.0', '現代擬物化 2.0'],
  vaporwave: ['ヴェイパーウェイヴ・チル', '蒸汽波轻松风', '蒸氣波舒緩風'],
  'dark-minimal-glass': ['ダークモード・ミニマルガラス', '深色模式极简玻璃', '深色模式極簡玻璃'],
  'kinetic-type': ['キネティック・タイポグラフィと力強いモーション', '动态字体与强烈动效', '動態字體與強烈動效'],
  'solarpunk-eco': ['ソーラーパンク・エコフューチャリズム', '太阳朋克生态未来主义', '太陽龐克生態未來主義'],
  'punk-zine': ['パンク・コピー・ジン', '朋克复印志', '龐克影印誌'],
  risograph: ['リソグラフ・エディトリアル', 'Risograph编辑风格', 'Risograph編輯風格'],
  'modular-grid-system': ['モジュラーグリッドシステム', '模块化网格系统', '模組化網格系統'],
  'web-brutalism': ['ウェブ・ブルータリズム', '网页粗野主义', '網頁粗野主義'],
  'grunge-typography': ['グランジ・タイポグラフィ', 'Grunge排版', 'Grunge排版'],
  'glitch-brutalism': ['グリッチ・ブルータリズム', '故障艺术粗野主义', '故障藝術粗野主義'],
  'maximalist-chaos': ['マキシマリスト・カオス', '极繁混沌', '極繁混沌'],
  'iridescent-mesh': ['イリデセント・メッシュ', '虹彩渐变网格', '虹彩漸層網格'],
  'low-poly-interface': ['ローポリ・インターフェース', '低多边形界面', '低多邊形介面'],
  'mid-century-modern': ['ミッドセンチュリー・モダン', '世纪中叶现代主义', '世紀中葉現代主義'],
  'newspaper-broadsheet': ['新聞ブロードシート', '大报版式', '大報版式'],
  'aqua-desktop': ['アクアデスクトップ', 'Aqua桌面', 'Aqua桌面'],
  'luna-desktop': ['Lunaデスクトップ', 'Luna桌面', 'Luna桌面'],
  'scene-core-web': ['シーンコア・ウェブ', 'Scene-core网页', 'Scene-core網頁'],
  'mcbling-gloss': ['McBlingグロス', 'McBling光泽', 'McBling光澤'],
  'toy-block-ui': ['トイブロックUI', '玩具积木UI', '玩具積木UI']
});

const APPROVED_KO_EN_NAME_REPAIRS = Object.freeze({
  'corporate-minimal': ['기업형 미니멀리즘', 'Corporate Minimalism'],
  memphis: ['멤피스 팝 디자인', 'Memphis Pop Design'],
  vaporwave: ['편안한 베이퍼웨이브', 'Vaporwave Chill'],
  'fluid-organic': ['유기적 곡선과 웜톤', 'Fluid Organic Forms & Warm Tones'],
  'dark-minimal-glass': ['다크 모드 미니멀 글래스', 'Dark Minimal Glass'],
  'y2k-chrome': ['Y2K 크롬과 홀로그램', 'Y2K Chrome & Hologram'],
  'frutiger-aero': ['프루티거 에어로 아쿠아 글로스', 'Frutiger Aero Aqua Gloss'],
  'pixel-arcade': ['8비트 픽셀 아케이드', '8-Bit Pixel Arcade'],
  'kinetic-type': ['키네틱 타이포그래피와 강한 모션', 'Kinetic Typography & Motion'],
  'bento-grid': ['벤토 UI 2.0 정밀 그리드', 'Bento UI 2.0 Precision Grid'],
  'acid-techno': ['애시드 그래픽과 테크노 레이브', 'Acid Graphics & Techno Rave'],
  claymorphism: ['클레이모피즘과 3D 버블', 'Claymorphism & 3D Bubble'],
  'handcrafted-indie': ['수공예 인디 콜라주', 'Handcrafted Indie Collage'],
  'solarpunk-eco': ['솔라펑크 생태 미래주의', 'Solarpunk Eco-Futurism'],
  'bauhaus-geometry': ['바우하우스 기하학 타이포그래피', 'Bauhaus Geometric Typography'],
  constructivist: ['구성주의 선전 그래픽', 'Constructivist Agitprop'],
  'punk-zine': ['펑크 복사 진', 'Punk Xerox Zine'],
  'material-design': ['Material Design 페이퍼 시스템', 'Material Design Paper System'],
  'liquid-glass': ['Liquid Glass 인터페이스', 'Liquid Glass Interface'],
  'art-deco': ['아르데코 기계 시대', 'Art Deco Machine Age'],
  'art-nouveau': ['아르누보 채찍 곡선', 'Art Nouveau Whiplash'],
  'dutch-total-design': ['네덜란드 토털 디자인', 'Dutch Total Design'],
  'japanese-ma-minimal': ['일본식 마 미니멀리즘', 'Japanese Ma Minimalism'],
  'scandinavian-functional': ['스칸디나비아 기능주의', 'Scandinavian Functionalism'],
  'industrial-stencil': ['산업용 스텐실', 'Industrial Stencil'],
  'monochrome-xerox': ['흑백 복사', 'Monochrome Photocopy'],
  'acrylic-ui': ['아크릴 소재 UI', 'Acrylic Material UI'],
  'holographic-foil': ['홀로그램 포일', 'Holographic Foil'],
  'chrome-metal-ui': ['크롬 금속 UI', 'Chrome Metal UI'],
  'iridescent-mesh': ['무지갯빛 메시', 'Iridescent Mesh'],
  'isometric-depth': ['아이소메트릭 깊이', 'Isometric Depth'],
  'low-poly-interface': ['로우폴리 인터페이스', 'Low-poly Interface'],
  'embossed-letterpress': ['엠보싱 활판 인쇄', 'Embossed Letterpress'],
  'pop-art-halftone': ['팝 아트 하프톤', 'Pop Art Halftone'],
  'seventies-groovy': ['1970년대 그루비', '1970s Groovy'],
  'newspaper-broadsheet': ['대판 신문 레이아웃', 'Newspaper Broadsheet'],
  'literary-journal': ['문예지', 'Literary Journal'],
  'academic-modern': ['학술 모더니즘', 'Academic Modernism'],
  'archival-museum': ['박물관 아카이브', 'Archival Museum'],
  'photobook-minimal': ['미니멀 포토북', 'Minimal Photobook'],
  'botanical-editorial': ['식물학 에디토리얼', 'Botanical Editorial'],
  'wabi-sabi-paper': ['와비사비 종이', 'Wabi-sabi Paper'],
  'luxury-serif-minimal': ['럭셔리 세리프 미니멀리즘', 'Luxury Serif Minimalism'],
  'early-web': ['초기 웹', 'Early Web'],
  'geocities-maximal': ['GeoCities 맥시멀리즘', 'GeoCities Maximalism'],
  'aqua-desktop': ['Aqua 데스크톱', 'Aqua Desktop'],
  'luna-desktop': ['Luna 데스크톱', 'Luna Desktop'],
  'blogspot-collage': ['Blogspot 콜라주', 'Blogspot Collage'],
  'scene-core-web': ['씬코어 웹', 'Scene-core Web'],
  'tech-optimism-2000': ['2000년대 기술 낙관주의', '2000s Tech Optimism'],
  'sci-fi-fui': ['SF FUI', 'Sci-fi FUI'],
  'data-dense-dashboard': ['고밀도 데이터 대시보드', 'Data-Dense Dashboard'],
  'real-time-monitor': ['실시간 모니터', 'Real-Time Monitor'],
  'generative-grid': ['생성형 그리드', 'Generative Grid'],
  'biometric-interface': ['생체 인식 인터페이스', 'Biometric Interface'],
  'ai-native-gradient': ['AI 네이티브 그라데이션', 'AI-Native Gradient'],
  'quantum-control': ['양자 제어', 'Quantum Control'],
  'inflatable-ui': ['공기 주입형 UI', 'Inflatable UI'],
  'toy-block-ui': ['장난감 블록 UI', 'Toy-Block UI'],
  'doodle-interface': ['낙서형 인터페이스', 'Doodle Interface'],
  'papercraft-ui': ['종이 공예 UI', 'Papercraft UI'],
  'cozy-knit': ['포근한 니트', 'Cozy Knit'],
  'biomorphic-soft': ['생체형 소프트', 'Biomorphic Soft'],
  'pastel-gradient': ['파스텔 그라데이션', 'Pastel Gradient'],
  'cartoon-dashboard': ['만화형 대시보드', 'Cartoon Dashboard']
});

const APPROVED_CJK_NAME_REPAIRS = Object.freeze({
  'swiss-grid': ['グリッド中心のモダニズム', '以网格为核心的现代主义', '以網格為核心的現代主義'],
  'high-contrast-mono': ['ハイコントラスト・モノスペース', '高对比度等宽字体', '高對比等寬字體'],
  'cyber-brutalism': ['サイバー・ブルータリズム', '赛博粗野主义', '賽博粗野主義'],
  memphis: ['メンフィス・ポップデザイン', '孟菲斯波普设计', '孟菲斯普普設計'],
  'high-fashion': ['ハイファッション・エディトリアル', '高级时尚编辑风格', '高級時尚編輯風格'],
  'fluid-organic': ['流線的な有機形状とウォームトーン', '流线有机形态与暖色调', '流線有機形態與暖色調'],
  'y2k-chrome': ['Y2Kクローム＆ホログラム', 'Y2K铬金属与全息', 'Y2K鉻金屬與全像'],
  'frutiger-aero': ['フルティガー・エアロ：アクアグロス', 'Frutiger Aero水感亮面', 'Frutiger Aero水感亮面'],
  'pixel-arcade': ['8ビット・ピクセルアーケード', '8位像素街机', '8位元像素街機'],
  'bento-grid': ['Bento UI 2.0 精密グリッド', 'Bento UI 2.0 精密网格', 'Bento UI 2.0 精密網格'],
  'acid-techno': ['アシッドグラフィックス＆テクノレイヴ', '酸性图形与Techno锐舞', '酸性圖形與Techno銳舞'],
  claymorphism: ['クレイモーフィズム＆3Dバブル', '黏土拟态与3D气泡', '黏土擬態與3D氣泡'],
  'handcrafted-indie': ['ハンドクラフト・インディーコラージュ', '手工独立拼贴', '手工獨立拼貼'],
  'bauhaus-geometry': ['バウハウス幾何学タイポグラフィ', '包豪斯几何排版', '包浩斯幾何排版'],
  constructivist: ['構成主義プロパガンダ・グラフィック', '建构主义宣传图形', '構成主義宣傳圖像'],
  'material-design': ['Material Design ペーパーシステム', 'Material Design纸张系统', 'Material Design紙張系統'],
  'liquid-glass': ['Liquid Glass インターフェース', 'Liquid Glass界面', 'Liquid Glass介面'],
  'art-deco': ['アール・デコ：機械時代', '装饰艺术机械时代', '裝飾藝術機械時代'],
  'art-nouveau': ['アール・ヌーヴォーの鞭線', '新艺术运动鞭线曲线', '新藝術運動鞭線曲線'],
  'metro-interface': ['Metroタイル・インターフェース', 'Metro磁贴界面', 'Metro動態磚介面'],
  'dutch-total-design': ['オランダ・トータルデザイン', '荷兰整体设计', '荷蘭總體設計'],
  'japanese-ma-minimal': ['日本の「間」を生かすミニマリズム', '日式“间”极简主义', '日式「間」極簡主義'],
  'scandinavian-functional': ['スカンジナビアン機能主義', '斯堪的纳维亚功能主义', '斯堪地納維亞功能主義'],
  'monochrome-xerox': ['モノクロ複写', '单色复印', '單色影印'],
  'acrylic-ui': ['アクリル素材UI', '亚克力材质界面', '壓克力材質介面'],
  'holographic-foil': ['ホログラムフォイル', '全息箔', '全像箔'],
  'chrome-metal-ui': ['クロームメタルUI', '铬金属界面', '鉻金屬介面'],
  'isometric-depth': ['アイソメトリック・デプス', '等距立体层次', '等角立體層次'],
  'embossed-letterpress': ['エンボス活版印刷', '压花凸版印刷', '浮雕凸版印刷'],
  'pop-art-halftone': ['ポップアート・ハーフトーン', '波普艺术半色调', '普普藝術半色調'],
  'disco-glam': ['ディスコ・グラム', '迪斯科华丽风', '迪斯可華麗風'],
  'seventies-groovy': ['1970年代グルーヴィー', '1970年代律动风', '1970年代律動風'],
  'literary-journal': ['文芸誌', '文学期刊', '文學期刊'],
  'academic-modern': ['学術モダニズム', '学术现代主义', '學術現代主義'],
  'archival-museum': ['アーカイブ・ミュージアム', '馆藏档案风格', '館藏檔案風格'],
  'photobook-minimal': ['ミニマル・フォトブック', '极简摄影集', '極簡攝影集'],
  'botanical-editorial': ['ボタニカル・エディトリアル', '植物学编辑风格', '植物學編輯風格'],
  'wabi-sabi-paper': ['侘び寂びペーパー', '侘寂纸张', '侘寂紙張'],
  'luxury-serif-minimal': ['ラグジュアリーセリフ・ミニマリズム', '奢华衬线极简主义', '奢華襯線極簡主義'],
  'early-web': ['初期ウェブ', '早期网页', '早期網頁'],
  'geocities-maximal': ['GeoCitiesマキシマリズム', 'GeoCities极繁主义', 'GeoCities極繁主義'],
  'web2-gloss': ['Web 2.0グロス', 'Web 2.0高光质感', 'Web 2.0高光質感'],
  'cyber-y2k': ['サイバーY2K', '赛博Y2K', '賽博Y2K'],
  'sci-fi-fui': ['SF FUI', '科幻FUI', '科幻FUI'],
  'data-dense-dashboard': ['高密度データダッシュボード', '高密度数据仪表板', '高密度資料儀表板'],
  'real-time-monitor': ['リアルタイムモニター', '实时监控', '即時監控'],
  'generative-grid': ['ジェネラティブ・グリッド', '生成式网格', '生成式網格'],
  'biometric-interface': ['生体認証インターフェース', '生物识别界面', '生物辨識介面'],
  'ai-native-gradient': ['AIネイティブ・グラデーション', 'AI原生渐变', 'AI原生漸層'],
  'inflatable-ui': ['インフレータブルUI', '充气式UI', '充氣式UI'],
  'doodle-interface': ['手描きインターフェース', '涂鸦界面', '塗鴉介面'],
  'papercraft-ui': ['ペーパークラフトUI', '纸艺界面', '紙藝介面'],
  'cozy-knit': ['ぬくもりのあるニット', '温馨针织', '溫馨針織'],
  'kidcore-play': ['キッドコア・プレイ', 'Kidcore童趣', 'Kidcore童趣'],
  'cartoon-dashboard': ['カートゥーン・ダッシュボード', '卡通仪表板', '卡通儀表板']
});

const APPROVED_KO_SWISS_SUMMARIES = Object.freeze({
  'swiss-grid': '정밀한 12열 구조와 산세리프 서체로 정보를 명확하게 조직한 스위스 모더니즘 디자인입니다.',
  'corporate-minimal': '신뢰감 있는 색상과 정돈된 카드로 기술 기업과 업무 서비스에 어울리는 현대적 인터페이스입니다.',
  'high-contrast-mono': '고정폭 서체와 강한 명암 대비로 개발 도구와 터미널의 정밀한 분위기를 구현한 인터페이스입니다.',
  'bauhaus-geometry': '원·삼각형·직사각형과 간결한 기하학 타이포그래피로 기능과 형태를 직접 연결한 구성입니다.',
  'de-stijl': '수평·수직 검은 선과 비대칭 원색 평면만으로 화면의 질서와 긴장을 만든 구성입니다.',
  'flat-design': '평면 색 블록과 단순 아이콘에 테두리·밑줄·상태색을 더해 조작 가능성을 되살린 UI 언어입니다.',
  'ulm-rationalism': '기능 분석표와 절제된 파랑·빨강 신호로 화면의 목적을 먼저 드러내는 시스템 디자인입니다.',
  'swiss-poster': '초대형 산세리프 제목과 하나의 선명한 색면으로 행사 정보를 압축한 포스터 구성입니다.',
  'dutch-total-design': '반복 가능한 표식·번호·그리드로 복잡한 조직 정보를 하나의 시각 체계로 묶은 디자인입니다.',
  'new-wave-typography': '모더니스트 그리드를 비틀고 활자의 크기·각도·간격을 리듬으로 활용한 실험적 편집 화면입니다.',
  'modular-grid-system': '콘텐츠를 일정한 행·열 모듈에 배치해 정보량이 바뀌어도 질서를 유지하는 화면입니다.',
  'functional-wayfinding': '방향 화살표·노선색·짧은 동사로 다음 행동을 멀리서도 알아보게 하는 안내 체계입니다.',
  'japanese-ma-minimal': '비어 있는 간격 자체를 위계로 사용해 한 문장과 한 행동에 깊은 호흡을 주는 화면입니다.',
  'scandinavian-functional': '밝은 목재색과 실용적인 간격으로 차갑지 않은 기능주의를 구현한 인터페이스입니다.',
  'information-isotype': '반복되는 사람·사물 기호와 수량 단위로 언어 장벽을 낮춘 설명형 데이터 화면입니다.'
});

const APPROVED_KO_BRUTALISM_SUMMARIES = Object.freeze({
  'raw-brutalism': '기본 HTML 요소, 거친 외곽선, 원색 대비를 가공 없이 드러내 반항적인 태도를 만든 웹 디자인입니다.',
  'neo-brutalism': '두꺼운 검은 외곽선, 밝은 파스텔 면, 단단한 그림자로 조작 요소를 또렷하게 드러낸 대중적 브루탈리즘입니다.',
  'cyber-brutalism': '거친 와이어프레임에 네온 색과 시스템 로그를 결합해 해커 문화의 긴장감을 표현한 인터페이스입니다.',
  constructivist: '빨강·검정·크림색의 대각 축과 압축 타이포그래피로 행동을 촉구하는 포스터형 정보 구성입니다.',
  'punk-zine': '복사기 질감, 오려 붙인 활자, 찢긴 라벨로 반권위적인 편집 리듬을 만든 흑백 독립 출판 문법입니다.',
  'web-brutalism': '브라우저 기본 요소와 노출된 경계를 숨기지 않고 콘텐츠와 링크를 앞세운 웹 구성입니다.',
  'anti-design': '충돌하는 색과 의도적인 불균형으로 매끈한 인터페이스 관습을 비판하는 시각 언어입니다.',
  'dada-collage': '오려 붙인 활자, 기하학 조각, 우연한 여백으로 선형적인 읽기 순서를 흔든 편집 화면입니다.',
  'grunge-typography': '마모된 대문자와 잉크 번짐을 겹쳐 음악 포스터처럼 거칠고 밀도 높은 인상을 만든 디자인입니다.',
  'industrial-stencil': '창고 표식, 위험 띠, 스텐실 숫자로 작업 현장의 규율과 물성을 옮긴 인터페이스입니다.',
  'monochrome-xerox': '복사기의 과노출, 거친 망점, 검은 테이프로 독립 출판물의 직접성을 살린 흑백 화면입니다.',
  'glitch-brutalism': '단단한 검정 프레임 위에 RGB 채널 어긋남과 끊긴 주사선을 제한적으로 겹친 웹 스타일입니다.',
  'maximalist-chaos': '서로 다른 패널, 배지, 타이포그래피를 화면 가득 겹치되 주요 행동 경로는 굵게 고정한 구성입니다.',
  'black-metal-editorial': '검은 종이, 흰색 고딕 표식, 날카로운 구획으로 음울한 음악 편집물의 긴장을 만든 화면입니다.',
  'concrete-interface': '무거운 회색 면과 구조 이음새를 그대로 드러내 건축 구조물의 물성을 옮긴 정보 패널입니다.'
});

const APPROVED_KO_DEPTH_SUMMARIES = Object.freeze({
  glassmorphism: '반투명 유리 패널과 흐릿한 배경 빛을 겹쳐 화면의 앞뒤 관계를 부드럽게 드러낸 인터페이스입니다.',
  neumorphism: '같은 바탕색의 밝고 어두운 그림자로 버튼이 솟거나 눌린 듯한 촉감을 표현한 인터페이스입니다.',
  skeuomorphism: '금속 노브, 가죽 패널, 아날로그 계기를 현대적인 화면 구조 안에 정교하게 재현한 인터페이스입니다.',
  'material-design': '명확한 표면 단계와 상태 레이어로 정보의 우선순위와 조작 피드백을 일관되게 전달하는 디자인 시스템입니다.',
  'liquid-glass': '콘텐츠 위의 제어 영역에만 굴절과 렌즈 하이라이트를 적용해 깊이와 맥락을 함께 보존한 인터페이스입니다.',
  'paper-cut-layers': '색지를 잘라 겹친 듯한 절단면과 그림자로 평면 화면에 무대 같은 깊이를 만든 구성입니다.',
  'acrylic-ui': '배경색을 은은하게 비추는 반투명 패널과 불투명 콘텐츠 면으로 레이어를 구분한 인터페이스입니다.',
  'mica-surface': '환경색을 약하게 반영하는 넓은 바탕과 단정한 카드로 장시간 작업 화면을 차분하게 정리한 인터페이스입니다.',
  'holographic-foil': '시점에 따라 색이 달라지는 듯한 포일 띠와 금속성 경계로 수집품 같은 표면을 만든 디자인입니다.',
  'chrome-metal-ui': '차가운 금속 하이라이트와 음각 눈금, 단단한 조작 노브로 정밀 기기의 인상을 만든 인터페이스입니다.',
  'iridescent-mesh': '청록과 보라가 교차하는 유연한 격자 메시와 깊은 배경으로 빛에 따라 변하는 디지털 재질을 표현한 화면입니다.',
  'isometric-depth': '같은 각도로 쌓은 블록과 층별 색상으로 복잡한 서비스 구조를 지도처럼 펼쳐 보인 디자인입니다.',
  'low-poly-interface': '제한된 삼각 면과 단순한 음영으로 계산량을 절제하면서 가벼운 3차원 감각을 만든 인터페이스입니다.',
  'soft-plastic': '반투명한 연질 플라스틱 버튼과 둥근 용기 형태로 친근하고 촉감 있는 제품형 깊이를 만든 화면입니다.',
  'embossed-letterpress': '눌린 활자와 미세한 종이 음영으로 절제된 활판 인쇄의 깊이와 공예성을 재현한 디자인입니다.'
});

const APPROVED_KO_RETRO_SUMMARIES = Object.freeze({
  memphis: '1980년대 멤피스 그룹의 기하 도형과 지그재그 선, 밝은 파스텔색으로 유쾌한 팝 감성을 만든 디자인입니다.',
  synthwave: '수평선으로 수렴하는 네온 격자와 석양, 크롬 타이포그래피로 1980년대 전자음악의 미래 향수를 표현한 화면입니다.',
  vaporwave: '고전 조각상, 저화질 주사선, 1990년대 운영체제 창을 파스텔색으로 겹친 몽환적인 인터넷 미학입니다.',
  'art-deco': '대칭 축과 계단형 프레임, 선버스트를 검정·크림·금색으로 조율한 기계 시대의 장식 문법입니다.',
  'psychedelic-poster': '휘어진 전시 타이포그래피와 반복 광학 곡선, 강한 보색으로 반문화 포스터의 밀도를 재해석한 화면입니다.',
  'mid-century-modern': '단순한 유기 도형과 낮은 채도의 가구색, 명료한 활자로 낙관적인 생활 문화를 표현한 구성입니다.',
  'atomic-age': '별폭발·원자 궤도·부메랑 도형으로 전후 시대의 과학 낙관주의를 경쾌하게 재해석한 화면입니다.',
  'pop-art-halftone': '굵은 윤곽과 인쇄 망점, 말풍선형 메시지로 대중매체의 즉각성과 만화적 에너지를 만든 디자인입니다.',
  'op-art': '흑백 반복선과 하나의 신호색으로 평면이 움직이는 듯한 착시와 긴장을 만든 시각 실험입니다.',
  'space-age': '캡슐·궤도·돔형 패널로 우주 시대가 상상한 낙관적인 미래 생활을 그린 화면입니다.',
  'disco-glam': '거울 공에서 퍼지는 반사광과 금빛 타이포그래피로 밤의 공연성과 화려함을 강조한 디자인입니다.',
  'seventies-groovy': '겹치는 물결 활자와 흙빛 주황·올리브색으로 느긋하고 리드미컬한 1970년대 편집 감성을 만든 화면입니다.',
  'eighties-new-wave': '대각선·파형·방송 자막을 결합해 1980년대 그래픽의 빠르고 비대칭적인 편집 리듬을 재현한 화면입니다.',
  'retro-computing': '초록색 CRT 화면, 픽셀 창, 메모리 주소로 초기 개인용 컴퓨터의 도구 감각을 되살린 인터페이스입니다.',
  'pulp-comic': '강한 원색과 거친 종이 질감, 비스듬한 분할 컷으로 연속극 같은 긴장과 행동을 전달한 디자인입니다.'
});

const APPROVED_KO_EDITORIAL_SUMMARIES = Object.freeze({
  'high-fashion': '높은 대비의 세리프 제목과 검정·상아색·샴페인색을 넓은 여백에 배치해 패션 화보의 절제된 긴장감을 만든 화면입니다.',
  'fluid-organic': '따뜻한 점토색과 부드러운 유기 곡선으로 웰빙·생활 콘텐츠에 편안하고 친근한 인상을 주는 화면입니다.',
  'dark-minimal-glass': '짙은 남색 바탕과 가는 하늘색 경계, 절제된 반투명 패널로 야간 환경의 정보 집중도를 높인 화면입니다.',
  'art-nouveau': '식물 줄기에서 뻗은 채찍 곡선과 세로 장식 프레임으로 콘텐츠를 감싸는 아르누보 편집 화면입니다.',
  risograph: '두세 가지 별색의 망점과 잉크 중첩, 미세한 판 어긋남을 종이 바탕에 드러낸 리소그래프 편집 화면입니다.',
  'newspaper-broadsheet': '굵은 제호와 다단 기사, 속보 띠와 판 번호를 디지털 화면에 재배치한 고밀도 뉴스 편집 구성입니다.',
  'literary-journal': '긴 호흡의 세리프 본문과 넓은 여백, 절제된 각주로 읽기와 사유에 집중하게 하는 문예지 화면입니다.',
  'academic-modern': '초록·도표·주석을 명확한 정보 계층으로 나누어 연구 내용과 근거를 빠르게 읽게 하는 학술 편집 화면입니다.',
  'archival-museum': '작품 번호·연도·소장 정보와 넓은 도판 영역을 결합해 기록의 맥락을 차분하게 보여주는 박물관 아카이브 화면입니다.',
  'photobook-minimal': '한 장의 사진과 짧은 캡션, 페이지 번호만 남겨 이미지의 호흡과 순서에 집중하게 하는 미니멀 포토북 화면입니다.',
  'botanical-editorial': '압화 표본과 학명, 채집 날짜와 계절색을 정갈한 격자에 놓은 자연 관찰형 편집 화면입니다.',
  'wabi-sabi-paper': '불균일한 종이 가장자리와 먹빛 여백, 비대칭 본문으로 재료의 불완전함과 고요함을 살린 화면입니다.',
  'collage-magazine': '사진·손글씨 메모·찢은 색지를 편집자의 책상처럼 겹쳐 탐색과 발견의 즐거움을 주는 잡지 화면입니다.',
  'typographic-poster': '하나의 문장을 화면을 가르는 대형 활자로 확대하고 작은 행사 정보로 균형을 잡은 포스터 화면입니다.',
  'luxury-serif-minimal': '가는 세리프 제목과 작은 제품 번호, 넓은 크림색 여백으로 절제된 고급감을 만든 편집 화면입니다.'
});

const APPROVED_KO_Y2K_SUMMARIES = Object.freeze({
  'y2k-chrome': '은빛 크롬 활자와 무지갯빛 홀로그램, 타원형 캡슐로 2000년대 초 사이버 팝의 반짝이는 미래상을 재현한 화면입니다.',
  'frutiger-aero': '푸른 하늘과 초록 잔디, 투명한 물방울 버튼으로 2000년대 중반 디지털 낙관주의를 표현한 화면입니다.',
  'pixel-arcade': '계단형 픽셀 글자와 코인·체력 게이지, 가로 주사선으로 고전 오락실 게임기의 조작 감각을 옮긴 화면입니다.',
  'early-web': '파란 밑줄 링크와 회색 구분선, 작은 방문 배지로 정보와 연결 자체를 앞세운 초기 웹 화면입니다.',
  'geocities-maximal': '개인 배너와 별 장식, 작은 링크 배지와 방명록을 과감히 겹친 팬 페이지형 최대주의 웹 화면입니다.',
  'aqua-desktop': '물방울 모양 버튼과 선명한 파란 창틀, 줄무늬 도구 모음으로 2000년대 초 데스크톱의 반짝이는 조작감을 재현한 화면입니다.',
  'luna-desktop': '파란 제목 표시줄과 초록색 시작 버튼, 둥근 작업 패널로 친근한 개인용 컴퓨터 환경을 재현한 화면입니다.',
  'web2-gloss': '반사광이 있는 둥근 행동 버튼과 서비스 배지로 참여형 웹의 밝고 낙관적인 분위기를 표현한 화면입니다.',
  'flash-portal': '방사형 메뉴와 장면 진행 표시, 강한 색 전환을 접근 가능한 정적 구조로 재해석한 몰입형 포털입니다.',
  'blogspot-collage': '사이드바 도구와 날짜 도장, 스크랩 사진을 조합해 개인의 취향과 기록을 드러낸 블로그형 편집 화면입니다.',
  'cyber-y2k': '검은 바탕에 크롬 캡슐과 전기 청록 신호, 와이어 별을 놓아 밀레니엄 사이버 패션을 표현한 화면입니다.',
  'kawaii-pixel-web': '픽셀 캐릭터와 하트 배지, 작은 상태창을 밝은 디지털 스티커처럼 배열한 팬 페이지형 화면입니다.',
  'scene-core-web': '네온 체크무늬와 손글씨 제목, 과장된 온라인 상태 배지로 2000년대 커뮤니티의 빠른 에너지를 재구성한 화면입니다.',
  'mcbling-gloss': '금빛 크롬과 보석 장식, 분홍색 광택으로 2000년대 팝 문화의 과시적인 화려함을 표현한 화면입니다.',
  'tech-optimism-2000': '푸른 디지털 지도와 연결점, 긍정적인 시스템 문구로 모두가 연결된 2000년대식 네트워크 미래를 그린 화면입니다.'
});

const APPROVED_KO_HYPERTECH_SUMMARIES = Object.freeze({
  'kinetic-type': '화면을 가로지르는 대형 활자 띠와 회전·확대되는 글자, 형광 연두 신호로 속도와 리듬을 만드는 동적 타이포그래피 화면입니다.',
  'bento-grid': '서로 다른 크기의 카드를 정밀한 격자에 맞추고 미니 차트·전환 장치·프로필을 담아 여러 기능을 한눈에 보여주는 모듈형 화면입니다.',
  'acid-techno': '형광 초록과 노랑, 왜곡된 크롬 구체와 스마일 기호를 충돌시켜 언더그라운드 레이브 포스터의 에너지를 옮긴 화면입니다.',
  'metro-interface': '화면 끝까지 이어지는 큰 활자와 모서리 없는 평면 타일을 수평 파노라마로 연결해 콘텐츠를 전면에 놓는 인터페이스입니다.',
  'cyberpunk-tactical-hud': '사각 조준 프레임과 좌표·거리·위험 수치를 청록과 붉은 신호로 묶어 전술 상황을 실시간으로 보여주는 화면입니다.',
  'sci-fi-fui': '분절된 원형 스캐너와 장치 진단 레일, 하늘색·주황색 신호로 영화 속 가상 장비를 읽기 쉽게 구성한 화면입니다.',
  'terminal-matrix': '열 맞춘 명령 기록과 고정 커서, 녹색 단일 신호로 계산 과정과 현재 입력을 전면에 드러낸 도구형 화면입니다.',
  'data-dense-dashboard': '크기가 다른 수치 카드와 직접 이름 붙인 미니 차트를 고정 격자에 배치해 여러 운영 지표를 한눈에 비교하는 화면입니다.',
  'real-time-monitor': '실시간 파형과 심각도별 사건 대기열, 마지막 갱신 시각을 차분한 청록 화면에 묶어 서비스 상태를 관찰하는 화면입니다.',
  'chromatic-aberration': '단색 데이터 패널의 핵심 경계와 좌표축에만 청록·분홍 색 어긋남을 더해 디지털 오차와 속도감을 표현한 화면입니다.',
  'generative-grid': '점·선·셀의 밀도가 규칙에 따라 변하는 격자장과 선택 셀 설명 패널을 연결해 살아 움직이는 시스템을 표현한 화면입니다.',
  'biometric-interface': '호흡하듯 움직이는 중심 고리와 심박·산소·회복 수치를 주변 궤도에 배치해 생체 상태를 차분하게 읽는 분석 화면입니다.',
  'spatial-glass-ui': '중앙 콘텐츠 창을 고정하고 세 개의 반투명 제어판을 주변에 배치해 깊이 있는 공간에서도 초점을 유지하는 화면입니다.',
  'ai-native-gradient': '확률 구름을 닮은 색 변화 영역과 근거·승인 패널을 분리해 AI의 생성 상태와 제안을 명료하게 보여주는 도구 화면입니다.',
  'quantum-control': '세 겹의 상태 궤도와 측정 순간을 표시하는 고정점을 결합해 양자 중첩과 정밀 제어를 시각화한 사변적 과학 화면입니다.'
});

const APPROVED_KO_SOFT3D_SUMMARIES = Object.freeze({
  claymorphism: '복숭아색 점토 카드와 두터운 안팎 그림자, 젤리처럼 튀는 반응으로 말랑한 장난감 촉감을 표현한 화면입니다.',
  'handcrafted-indie': '찢은 종이와 반투명 마스킹 테이프, 손글씨 메모와 도장을 겹쳐 개인 작업실의 따뜻한 기록감을 살린 화면입니다.',
  'solarpunk-eco': '황금빛 태양과 초록 잎, 스테인드글라스형 에너지 패널을 결합해 자연과 재생 기술이 공존하는 낙관적 미래를 그린 화면입니다.',
  'inflatable-ui': '공기를 넣은 듯 부푼 캡슐 버튼과 부드러운 반사면, 눌릴 때 변하는 형태로 행동을 친근하게 드러낸 화면입니다.',
  'toy-block-ui': '색과 높이가 다른 기능 블록, 숫자가 새겨진 연결 돌기를 조립하듯 배치해 구조를 쉽게 이해시키는 화면입니다.',
  'kawaii-pastel': '작은 표정과 별·하트 배지, 분홍·파랑 파스텔 카드를 조합해 개인 도구를 친근하고 차분하게 만든 화면입니다.',
  'sticker-book': '굵은 흰 테두리와 서로 다른 기울기의 분류 스티커, 확인 표시 수집판으로 선택과 모으기의 즐거움을 주는 화면입니다.',
  'doodle-interface': '손으로 그린 화살표와 동그라미, 짧은 메모를 단정한 입력 구조에 얹어 제작자의 안내를 가까이 느끼게 하는 화면입니다.',
  'papercraft-ui': '겹친 색지와 접힌 모서리 탭, 종이 층으로 단계와 기능 사이의 깊이와 조립 순서를 설명하는 화면입니다.',
  'cozy-knit': '실의 반복 무늬와 니트 눈금 진행 막대, 천 조각 같은 정보 카드를 따뜻한 중간색으로 엮은 생활형 화면입니다.',
  'dreamcore-cloud': '안개 낀 구름 층과 그 사이에 떠 있는 문 모양 카드, 조용한 방향 표지로 낯익고 비현실적인 탐색 장면을 만든 화면입니다.',
  'kidcore-play': '원색 도형과 굵은 색연필 경로, 뛰어오르는 숫자 블록으로 규칙보다 발견을 앞세운 놀이형 화면입니다.',
  'biomorphic-soft': '세포와 물방울을 닮은 연결 카드와 맥박처럼 넓어지는 선택 고리로 데이터와 행동이 성장하는 모습을 표현한 화면입니다.',
  'pastel-gradient': '낮은 채도의 넓은 색 변화 위에 선명한 단색 작업 카드와 상태점을 고정해 부드러움과 정보성을 함께 살린 화면입니다.',
  'cartoon-dashboard': '굵은 윤곽의 수치 카드와 반응하는 작은 캐릭터, 말풍선 도움말로 일상 데이터를 짧은 이야기처럼 보여주는 화면입니다.'
});

const EN_CATEGORY_STYLE_IDS = Object.freeze({
  swiss: Object.freeze(Object.keys(APPROVED_KO_SWISS_SUMMARIES)),
  brutalism: Object.freeze(Object.keys(APPROVED_KO_BRUTALISM_SUMMARIES)),
  depth: Object.freeze(Object.keys(APPROVED_KO_DEPTH_SUMMARIES)),
  retro: Object.freeze(Object.keys(APPROVED_KO_RETRO_SUMMARIES)),
  editorial: Object.freeze(Object.keys(APPROVED_KO_EDITORIAL_SUMMARIES)),
  y2k: Object.freeze(Object.keys(APPROVED_KO_Y2K_SUMMARIES)),
  hypertech: Object.freeze(Object.keys(APPROVED_KO_HYPERTECH_SUMMARIES)),
  soft3d: Object.freeze(Object.keys(APPROVED_KO_SOFT3D_SUMMARIES))
});

const FORBIDDEN_EN_EDITORIAL_BOILERPLATE =
  /applies .+ principles|defines a distinct surface, text, or signal role|interprets .+ principles|lineage informs the composition|material treatment shapes the visual hierarchy|Works well for|Supports an? .+ product voice|can support broader production contexts|requires content-length and readability checks|Validate .+ against the target audience|\bweb ui\b/iu;

const FORBIDDEN_JA_EDITORIAL_BOILERPLATE =
  /実用的なUIへ展開するデザインサンプル|原理を再解釈|系譜が構成を導|素材表現が視覚的階層|文脈に適用しやすい|プロダクト表現を支え|対象ユーザーに合わせて検証|配色[1-4]|遊び心な|親しみやすいな|表現的の動き|高密度の情報密度|疎の情報密度/u;

const FORBIDDEN_ZH_CN_EDITORIAL_BOILERPLATE =
  /实用界面设计方案|谱系指导版式构成|材质塑造视觉层级|适用于.+场景|有助于建立.+产品语气|结合目标用户验证|配色[1-4]|高密度的信息密度|低密度的信息密度|表现力强的动效/u;

const FORBIDDEN_ZH_CN_TRADITIONAL_UI_TERMS =
  /介面|資訊|使用者|資料|載入|網格|樣式|視覺|階層|處理|選擇|顯示|畫面|應用/u;

const FORBIDDEN_ZH_TW_EDITORIAL_BOILERPLATE =
  /實用介面設計方案|譜系引導版面構成|材質塑造視覺層級|適用於.+場景|有助於建立.+產品語氣|配合目標使用者驗證|配色[1-4]|高密度的資訊密度|疏朗的資訊密度|富有表現力的動效/u;

const FORBIDDEN_ZH_TW_MAINLAND_UI_TERMS =
  /界面|信息|用户|数据|加载|网格|样式|视觉|层级|处理|选择|显示|屏幕|应用|点击|按钮/u;

function allHumanText(snapshot) {
  return JSON.stringify({
    copy: snapshot.copy,
    messages: snapshot.messages,
    catalog: snapshot.catalog
  });
}

test('Stage 2 high-risk design names use the approved locale glossary', async () => {
  for (const [styleId, names] of Object.entries(APPROVED_HIGH_RISK_NAMES)) {
    for (const [locale, expectedName] of Object.entries(names)) {
      const snapshot = await loadLocaleSnapshot(locale);
      assert.equal(snapshot.catalog.styles[styleId].name, expectedName, `${locale}:${styleId}`);
    }
  }
});

test('Stage 2 locale packs reject known machine-translation artifacts', async () => {
  for (const [locale, fragments] of Object.entries(FORBIDDEN_MACHINE_TRANSLATION_FRAGMENTS)) {
    const snapshot = await loadLocaleSnapshot(locale);
    const content = allHumanText(snapshot);
    for (const fragment of fragments) {
      assert.doesNotMatch(content, new RegExp(fragment, 'u'), `${locale}: ${fragment}`);
    }
  }
});

test('Stage 2 repairs design names whose machine translation changed the design concept', async () => {
  const locales = ['ja', 'zh-CN', 'zh-TW'];
  const snapshots = await Promise.all(locales.map(locale => loadLocaleSnapshot(locale)));

  for (const [styleId, approvedNames] of Object.entries(APPROVED_MACHINE_TRANSLATION_REPAIRS)) {
    for (const [index, snapshot] of snapshots.entries()) {
      assert.equal(snapshot.catalog.styles[styleId].name, approvedNames[index], `${locales[index]}:${styleId}`);
    }
  }
});

test('Stage 2 Korean and English design names follow the approved editorial glossary', async () => {
  const locales = ['ko', 'en'];
  const snapshots = await Promise.all(locales.map(locale => loadLocaleSnapshot(locale)));

  for (const [styleId, approvedNames] of Object.entries(APPROVED_KO_EN_NAME_REPAIRS)) {
    for (const [index, snapshot] of snapshots.entries()) {
      assert.equal(snapshot.catalog.styles[styleId].name, approvedNames[index], `${locales[index]}:${styleId}`);
    }
  }
});

test('Stage 2 Japanese and Chinese design names follow the approved editorial glossary', async () => {
  const locales = ['ja', 'zh-CN', 'zh-TW'];
  const snapshots = await Promise.all(locales.map(locale => loadLocaleSnapshot(locale)));

  for (const [styleId, approvedNames] of Object.entries(APPROVED_CJK_NAME_REPAIRS)) {
    for (const [index, snapshot] of snapshots.entries()) {
      assert.equal(snapshot.catalog.styles[styleId].name, approvedNames[index], `${locales[index]}:${styleId}`);
    }
  }
});

test('Task 22 Korean Swiss-category prose is explicit, natural, and style-specific', async () => {
  const snapshot = await loadLocaleSnapshot('ko');
  const records = Object.entries(APPROVED_KO_SWISS_SUMMARIES).map(([styleId, expectedSummary]) => {
    const record = snapshot.catalog.styles[styleId];
    assert.equal(record.summary, expectedSummary, `${styleId}:summary`);
    assert.ok(record.pros.every(sentence => /다\.$/u.test(sentence)), `${styleId}:pros sentence ending`);
    assert.ok(record.cons.every(sentence => /다\.$/u.test(sentence)), `${styleId}:cons sentence ending`);
    return record;
  });

  for (const field of ['characteristics', 'pros', 'cons']) {
    const signatures = records.map(record => JSON.stringify(record[field]));
    assert.equal(new Set(signatures).size, records.length, `swiss:${field}:duplicate template`);
  }

  const humanText = JSON.stringify(records);
  assert.doesNotMatch(
    humanText,
    /Grid System|Negative Space|Conversion Rate|프로페셔널|Monospace|\bborder\b|Surface 색상|CTA 버튼/u
  );
});

test('Task 22 Korean Brutalism-category prose and palette copy are natural and style-specific', async () => {
  const snapshot = await loadLocaleSnapshot('ko');
  const records = Object.entries(APPROVED_KO_BRUTALISM_SUMMARIES).map(([styleId, expectedSummary]) => {
    const record = snapshot.catalog.styles[styleId];
    assert.equal(record.summary, expectedSummary, `${styleId}:summary`);
    assert.ok(record.pros.every(sentence => /다\.$/u.test(sentence)), `${styleId}:pros sentence ending`);
    assert.ok(record.cons.every(sentence => /다\.$/u.test(sentence)), `${styleId}:cons sentence ending`);
    return record;
  });

  for (const field of ['characteristics', 'pros', 'cons']) {
    const signatures = records.map(record => JSON.stringify(record[field]));
    assert.equal(new Set(signatures).size, records.length, `brutalism:${field}:duplicate template`);
  }

  const paletteSignatures = records.map(record => JSON.stringify(
    record.palette.map(color => [color.name, color.usage])
  ));
  assert.equal(new Set(paletteSignatures).size, records.length, 'brutalism:palette:duplicate template');

  const humanText = JSON.stringify(records);
  assert.doesNotMatch(
    humanText,
    /Surface|\bborder\b|hard shadow|CTA|프로페셔널|테크니컬|스니펫|\s&\s/u
  );
});

test('Task 22 Korean Depth-category prose and palette copy are natural and style-specific', async () => {
  const snapshot = await loadLocaleSnapshot('ko');
  const records = Object.entries(APPROVED_KO_DEPTH_SUMMARIES).map(([styleId, expectedSummary]) => {
    const record = snapshot.catalog.styles[styleId];
    assert.equal(record.summary, expectedSummary, `${styleId}:summary`);
    assert.ok(record.pros.every(sentence => /다\.$/u.test(sentence)), `${styleId}:pros sentence ending`);
    assert.ok(record.cons.every(sentence => /다\.$/u.test(sentence)), `${styleId}:cons sentence ending`);
    return record;
  });

  for (const field of ['characteristics', 'pros', 'cons']) {
    const signatures = records.map(record => JSON.stringify(record[field]));
    assert.equal(new Set(signatures).size, records.length, `depth:${field}:duplicate template`);
  }

  const paletteSignatures = records.map(record => JSON.stringify(
    record.palette.map(color => [color.name, color.usage])
  ));
  assert.equal(new Set(paletteSignatures).size, records.length, 'depth:palette:duplicate template');

  const humanText = JSON.stringify(records);
  assert.doesNotMatch(
    humanText,
    /Surface|backdrop-filter|Inset|Monochromatic|\bDial\b|\bA11y\b|GPU 블러 연산|CTA|\belevation\b|톤앤매너|\s&\s/u
  );
});

test('Task 22 Korean Retro-category prose and palette copy are natural and style-specific', async () => {
  const snapshot = await loadLocaleSnapshot('ko');
  const records = Object.entries(APPROVED_KO_RETRO_SUMMARIES).map(([styleId, expectedSummary]) => {
    const record = snapshot.catalog.styles[styleId];
    assert.equal(record.summary, expectedSummary, `${styleId}:summary`);
    assert.ok(record.pros.every(sentence => /다\.$/u.test(sentence)), `${styleId}:pros sentence ending`);
    assert.ok(record.cons.every(sentence => /다\.$/u.test(sentence)), `${styleId}:cons sentence ending`);
    return record;
  });

  for (const field of ['characteristics', 'pros', 'cons']) {
    const signatures = records.map(record => JSON.stringify(record[field]));
    assert.equal(new Set(signatures).size, records.length, `retro:${field}:duplicate template`);
  }

  const paletteSignatures = records.map(record => JSON.stringify(
    record.palette.map(color => [color.name, color.usage])
  ));
  assert.equal(new Set(paletteSignatures).size, records.length, 'retro:palette:duplicate template');

  const humanText = JSON.stringify(records);
  assert.doesNotMatch(
    humanText,
    /메인 팝 컬|트라이앵글|컨페티|비비드|퍼스펙티브|노스탤지어|로파이|윈도우 95 감성|칠웨이브|아티스틱|\b최적\b|CTA|\b3D\b|\bOS\b|메인 메시지|비효율적|\s&\s/u
  );
});

test('Task 22 Korean Editorial-category prose and palette copy are natural and style-specific', async () => {
  const snapshot = await loadLocaleSnapshot('ko');
  const records = Object.entries(APPROVED_KO_EDITORIAL_SUMMARIES).map(([styleId, expectedSummary]) => {
    const record = snapshot.catalog.styles[styleId];
    assert.equal(record.summary, expectedSummary, `${styleId}:summary`);
    assert.ok(record.pros.every(sentence => /다\.$/u.test(sentence)), `${styleId}:pros sentence ending`);
    assert.ok(record.cons.every(sentence => /다\.$/u.test(sentence)), `${styleId}:cons sentence ending`);
    return record;
  });

  for (const field of ['characteristics', 'pros', 'cons']) {
    const signatures = records.map(record => JSON.stringify(record[field]));
    assert.equal(new Set(signatures).size, records.length, `editorial:${field}:duplicate template`);
  }

  const paletteSignatures = records.map(record => JSON.stringify(
    record.palette.map(color => [color.name, color.usage])
  ));
  assert.equal(new Set(paletteSignatures).size, records.length, 'editorial:palette:duplicate template');

  const humanText = JSON.stringify(records);
  assert.doesNotMatch(
    humanText,
    /Surface|border-radius|Cinzel|Playfair|Clay|Pine|Terracotta|\bOLED\b|\bSaaS\b|\bblob\b|\bUI\b|CTA|메타데이터|레이어|내비게이션|최적|에셋|쉐이프|밸런스|액센트|보더|컬러|폰트|살아남|대세 표준|1–2px|\s&\s/u
  );
});

test('Task 22 Korean Y2K-category prose and palette copy are natural and style-specific', async () => {
  const snapshot = await loadLocaleSnapshot('ko');
  const records = Object.entries(APPROVED_KO_Y2K_SUMMARIES).map(([styleId, expectedSummary]) => {
    const record = snapshot.catalog.styles[styleId];
    assert.equal(record.summary, expectedSummary, `${styleId}:summary`);
    assert.ok(record.pros.every(sentence => /다\.$/u.test(sentence)), `${styleId}:pros sentence ending`);
    assert.ok(record.cons.every(sentence => /다\.$/u.test(sentence)), `${styleId}:cons sentence ending`);
    return record;
  });

  for (const field of ['characteristics', 'pros', 'cons']) {
    const signatures = records.map(record => JSON.stringify(record[field]));
    assert.equal(new Set(signatures).size, records.length, `y2k:${field}:duplicate template`);
  }

  const paletteSignatures = records.map(record => JSON.stringify(
    record.palette.map(color => [color.name, color.usage])
  ));
  assert.equal(new Set(paletteSignatures).size, records.length, 'y2k:palette:duplicate template');

  const humanText = JSON.stringify(records);
  assert.doesNotMatch(
    humanText,
    /메탈릭|홀로그래픽|쉬머|림 ?라이트|Sparkle|테크노 미래주의 폰트|\b3D\b|젤리\/아쿠아|\bHP\b|\bHUD\b|CRT 브라운관 TV|게이미피케이션|찰떡궁합|\bUI\b|CTA|VIP|ONLINE|모노스페이스|스캔 레이어|메타데이터|최적|렌더링|베이스 색상|글로시|힙한|독보적|\s&\s/u
  );
});

test('Task 22 Korean Hypertech-category prose and palette copy are natural and style-specific', async () => {
  const snapshot = await loadLocaleSnapshot('ko');
  const records = Object.entries(APPROVED_KO_HYPERTECH_SUMMARIES).map(([styleId, expectedSummary]) => {
    const record = snapshot.catalog.styles[styleId];
    assert.equal(record.summary, expectedSummary, `${styleId}:summary`);
    assert.ok(record.pros.every(sentence => /다\.$/u.test(sentence)), `${styleId}:pros sentence ending`);
    assert.ok(record.cons.every(sentence => /다\.$/u.test(sentence)), `${styleId}:cons sentence ending`);
    return record;
  });

  for (const field of ['characteristics', 'pros', 'cons']) {
    const signatures = records.map(record => JSON.stringify(record[field]));
    assert.equal(new Set(signatures).size, records.length, `hypertech:${field}:duplicate template`);
  }

  const paletteSignatures = records.map(record => JSON.stringify(
    record.palette.map(color => [color.name, color.usage])
  ));
  assert.equal(new Set(paletteSignatures).size, records.length, 'hypertech:palette:duplicate template');

  const humanText = JSON.stringify(records);
  assert.doesNotMatch(
    humanText,
    /Marquee|마퀴|액센트|스피드 배경|헤드라인 타이포|컨테이너 트랙|트랜스폼|콘트라스트|런칭|림 ?라이트|서페이스|\b3D\b|타겟|독보적|임팩트|모노스페이스|스캔 레이어|caret|\bKPI\b|데이터-잉크|모티프|\s&\s/u
  );
});

test('Task 22 Korean Soft3D-category prose and palette copy are natural and style-specific', async () => {
  const snapshot = await loadLocaleSnapshot('ko');
  const records = Object.entries(APPROVED_KO_SOFT3D_SUMMARIES).map(([styleId, expectedSummary]) => {
    const record = snapshot.catalog.styles[styleId];
    assert.equal(record.summary, expectedSummary, `${styleId}:summary`);
    assert.ok(record.pros.every(sentence => /다\.$/u.test(sentence)), `${styleId}:pros sentence ending`);
    assert.ok(record.cons.every(sentence => /다\.$/u.test(sentence)), `${styleId}:cons sentence ending`);
    return record;
  });

  for (const field of ['characteristics', 'pros', 'cons']) {
    const signatures = records.map(record => JSON.stringify(record[field]));
    assert.equal(new Set(signatures).size, records.length, `soft3d:${field}:duplicate template`);
  }

  const paletteSignatures = records.map(record => JSON.stringify(
    record.palette.map(color => [color.name, color.usage])
  ));
  assert.equal(new Set(paletteSignatures).size, records.length, 'soft3d:palette:duplicate template');

  const humanText = JSON.stringify(records);
  assert.doesNotMatch(
    humanText,
    /3D 입체|내부 안쪽|Inset Shadow|드롭 섀도|호버|바운스 인터랙션|최고 효과|Transform rotate|스크랩북 페이퍼|스탬프 도장|데코(?:레이션)?|블로그\/포트폴리오|베이스 색상|뱃지|라인 아트|클린에너지|CTA|모티프|마이크로카피|레이어|폼 사용성|\s&\s/u
  );
});

for (const [categoryId, styleIds] of Object.entries(EN_CATEGORY_STYLE_IDS)) {
  test(`Task 23 English ${categoryId} prose and palette copy are natural and style-specific`, async () => {
    const snapshot = await loadLocaleSnapshot('en');
    const records = styleIds.map(styleId => snapshot.catalog.styles[styleId]);

    assert.equal(records.length, 15, `${categoryId}:record count`);
    for (const record of records) {
      assert.match(record.summary, /\.$/u, `${record.id}:summary sentence ending`);
      for (const field of ['characteristics', 'pros', 'cons']) {
        assert.ok(record[field].every(sentence => /\.$/u.test(sentence)), `${record.id}:${field} sentence ending`);
      }
    }

    for (const field of ['summary', 'characteristics', 'pros', 'cons']) {
      const signatures = records.map(record => JSON.stringify(record[field]));
      assert.equal(new Set(signatures).size, records.length, `${categoryId}:${field}:duplicate template`);

      if (field !== 'summary') {
        const sentences = records.flatMap(record => record[field]);
        assert.equal(new Set(sentences).size, sentences.length, `${categoryId}:${field}:duplicate sentence`);
      }
    }

    const paletteSignatures = records.map(record => JSON.stringify(
      record.palette.map(color => [color.name, color.usage])
    ));
    assert.equal(new Set(paletteSignatures).size, records.length, `${categoryId}:palette:duplicate template`);

    assert.doesNotMatch(JSON.stringify(records), FORBIDDEN_EN_EDITORIAL_BOILERPLATE, `${categoryId}:boilerplate`);
  });
}

for (const [categoryId, styleIds] of Object.entries(EN_CATEGORY_STYLE_IDS)) {
  test(`Task 24 Japanese ${categoryId} prose and palette copy are natural and style-specific`, async () => {
    const snapshot = await loadLocaleSnapshot('ja');
    const records = styleIds.map(styleId => snapshot.catalog.styles[styleId]);

    assert.equal(records.length, 15, `${categoryId}:record count`);
    for (const record of records) {
      assert.match(record.summary, /。$/u, `${record.id}:summary sentence ending`);
      for (const field of ['characteristics', 'pros', 'cons']) {
        assert.ok(record[field].every(sentence => /。$/u.test(sentence)), `${record.id}:${field} sentence ending`);
      }
      assert.ok(record.palette.every(color => !/^配色[1-4]$/u.test(color.name)), `${record.id}:palette display name`);
      assert.ok(record.palette.every(color => /。$/u.test(color.usage)), `${record.id}:palette usage ending`);
    }

    for (const field of ['summary', 'characteristics', 'pros', 'cons']) {
      const signatures = records.map(record => JSON.stringify(record[field]));
      assert.equal(new Set(signatures).size, records.length, `${categoryId}:${field}:duplicate template`);

      if (field !== 'summary') {
        const sentences = records.flatMap(record => record[field]);
        assert.equal(new Set(sentences).size, sentences.length, `${categoryId}:${field}:duplicate sentence`);
      }
    }

    const paletteSignatures = records.map(record => JSON.stringify(
      record.palette.map(color => [color.name, color.usage])
    ));
    assert.equal(new Set(paletteSignatures).size, records.length, `${categoryId}:palette:duplicate template`);

    assert.doesNotMatch(JSON.stringify(records), FORBIDDEN_JA_EDITORIAL_BOILERPLATE, `${categoryId}:boilerplate`);
  });
}

for (const [categoryId, styleIds] of Object.entries(EN_CATEGORY_STYLE_IDS)) {
  test(`Task 25 Simplified Chinese ${categoryId} prose and palette copy use mainland terminology and style-specific copy`, async () => {
    const snapshot = await loadLocaleSnapshot('zh-CN');
    const records = styleIds.map(styleId => snapshot.catalog.styles[styleId]);

    assert.equal(records.length, 15, `${categoryId}:record count`);
    for (const record of records) {
      assert.match(record.summary, /。$/u, `${record.id}:summary sentence ending`);
      for (const field of ['characteristics', 'pros', 'cons']) {
        assert.ok(record[field].every(sentence => /。$/u.test(sentence)), `${record.id}:${field} sentence ending`);
      }
      assert.ok(record.palette.every(color => !/^配色[1-4]$/u.test(color.name)), `${record.id}:palette display name`);
      assert.ok(record.palette.every(color => /。$/u.test(color.usage)), `${record.id}:palette usage ending`);
    }

    for (const field of ['summary', 'characteristics', 'pros', 'cons']) {
      const signatures = records.map(record => JSON.stringify(record[field]));
      assert.equal(new Set(signatures).size, records.length, `${categoryId}:${field}:duplicate template`);

      if (field !== 'summary') {
        const sentences = records.flatMap(record => record[field]);
        assert.equal(new Set(sentences).size, sentences.length, `${categoryId}:${field}:duplicate sentence`);
      }
    }

    const paletteSignatures = records.map(record => JSON.stringify(
      record.palette.map(color => [color.name, color.usage])
    ));
    assert.equal(new Set(paletteSignatures).size, records.length, `${categoryId}:palette:duplicate template`);

    const humanText = JSON.stringify(records);
    assert.doesNotMatch(humanText, FORBIDDEN_ZH_CN_EDITORIAL_BOILERPLATE, `${categoryId}:boilerplate`);
    assert.doesNotMatch(humanText, FORBIDDEN_ZH_CN_TRADITIONAL_UI_TERMS, `${categoryId}:traditional UI term`);
  });
}

for (const [categoryId, styleIds] of Object.entries(EN_CATEGORY_STYLE_IDS)) {
  test(`Task 26 Traditional Chinese ${categoryId} prose and palette copy use Taiwan terminology and style-specific copy`, async () => {
    const snapshot = await loadLocaleSnapshot('zh-TW');
    const records = styleIds.map(styleId => snapshot.catalog.styles[styleId]);

    assert.equal(records.length, 15, `${categoryId}:record count`);
    for (const record of records) {
      assert.match(record.summary, /。$/u, `${record.id}:summary sentence ending`);
      for (const field of ['characteristics', 'pros', 'cons']) {
        assert.ok(record[field].every(sentence => /。$/u.test(sentence)), `${record.id}:${field} sentence ending`);
      }
      assert.ok(record.palette.every(color => !/^配色[1-4]$/u.test(color.name)), `${record.id}:palette display name`);
      assert.ok(record.palette.every(color => /。$/u.test(color.usage)), `${record.id}:palette usage ending`);
    }

    for (const field of ['summary', 'characteristics', 'pros', 'cons']) {
      const signatures = records.map(record => JSON.stringify(record[field]));
      assert.equal(new Set(signatures).size, records.length, `${categoryId}:${field}:duplicate template`);

      if (field !== 'summary') {
        const sentences = records.flatMap(record => record[field]);
        assert.equal(new Set(sentences).size, sentences.length, `${categoryId}:${field}:duplicate sentence`);
      }
    }

    const paletteSignatures = records.map(record => JSON.stringify(
      record.palette.map(color => [color.name, color.usage])
    ));
    assert.equal(new Set(paletteSignatures).size, records.length, `${categoryId}:palette:duplicate template`);

    const humanText = JSON.stringify(records);
    assert.doesNotMatch(humanText, FORBIDDEN_ZH_TW_EDITORIAL_BOILERPLATE, `${categoryId}:boilerplate`);
    assert.doesNotMatch(humanText, FORBIDDEN_ZH_TW_MAINLAND_UI_TERMS, `${categoryId}:mainland UI term`);
  });
}

test('Stage 2 Traditional Chinese uses a specialist design-token label instead of the fantasy-item word alone', async () => {
  const snapshot = await loadLocaleSnapshot('zh-TW');
  const humanCopy = JSON.stringify({ copy: snapshot.copy, messages: snapshot.messages });

  assert.doesNotMatch(humanCopy, /設計權杖/u);
  assert.match(humanCopy, /設計 Token/u);
});
