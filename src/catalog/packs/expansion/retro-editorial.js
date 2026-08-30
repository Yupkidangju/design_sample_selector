import { defineExpansionPack, expansionBlueprint as b } from './authoring.js';

export const RETRO_EDITORIAL_PACK = defineExpansionPack({
  id: 'retro-editorial',
  order: 50,
  startOrder: 730,
  title: { ko: '레트로 에디토리얼 12종', en: 'Retro Editorial 12' },
  blueprints: [
    b('eighties-new-wave', 'retro', 'broadcast-grid', '에이티스 뉴웨이브', 'Eighties New Wave', '대각선·파형·방송 자막을 결합해 1980년대 그래픽의 빠른 편집 리듬을 재현한 화면', ['#101225', '#1C2040', '#303866', '#FF3D81', '#36E2E2'], '비스듬한 채널 띠와 잘린 대문자 타이틀', ['80년대', '뉴웨이브']),
    b('retro-computing', 'retro', 'broadcast-grid', '레트로 컴퓨팅', 'Retro Computing', 'CRT 녹색·픽셀 창·메모리 주소로 초기 개인용 컴퓨터의 도구 감각을 되살린 인터페이스', ['#08130F', '#10221A', '#1D382C', '#7CFF8A', '#F5C451'], '부팅 로그 옆 픽셀 창과 물리 키보드형 명령 버튼', ['CRT', '컴퓨팅']),
    b('pulp-comic', 'retro', 'broadcast-grid', '펄프 코믹', 'Pulp Comic', '강한 원색·거친 종이·분할 컷으로 연속극 같은 긴장과 행동을 전달하는 디자인', ['#1B1110', '#2D1D19', '#4A3028', '#F3C640', '#D93232'], '비스듬한 만화 컷과 다음 회차를 알리는 자막 띠', ['펄프', '코믹']),
    b('newspaper-broadsheet', 'editorial', 'broadcast-grid', '뉴스페이퍼 브로드시트', 'Newspaper Broadsheet', '다단 기사·속보 띠·판 번호를 디지털 화면에 재배열한 고밀도 뉴스 편집 구성', ['#151515', '#222222', '#383838', '#F2EDE0', '#D24A35'], '속보 티커와 세로 기사열을 묶는 굵은 제호', ['신문', '브로드시트']),

    b('literary-journal', 'editorial', 'editorial-ledger', '리터러리 저널', 'Literary Journal', '긴 호흡의 세리프 본문과 여백 많은 각주로 읽기와 사유에 집중하는 문예지 화면', ['#F3EFE7', '#FFFCF6', '#DDD5C8', '#7A302F', '#385C55'], '페이지 번호·짧은 인용·넓은 본문 열의 조용한 리듬', ['문예지', '긴 글']),
    b('academic-modern', 'editorial', 'editorial-ledger', '아카데믹 모던', 'Academic Modern', '초록·도표·주석을 명확한 계층으로 나눠 연구 내용을 현대적으로 읽게 하는 디자인', ['#F5F6F3', '#FFFFFF', '#DDE1DB', '#215F78', '#9A4B2D'], '논문 번호와 요약 카드, 직접 레이블이 붙은 작은 차트', ['학술', '근거']),
    b('archival-museum', 'editorial', 'editorial-ledger', '아카이벌 뮤지엄', 'Archival Museum', '작품 번호·연도·소장 정보와 넓은 도판 자리를 결합한 조용한 기관형 편집 화면', ['#EEECE7', '#FAF9F6', '#D4D0C8', '#4C5F75', '#8C4F3D'], '액세션 번호 레일과 중성색 도판 프레임', ['아카이브', '뮤지엄']),
    b('photobook-minimal', 'editorial', 'editorial-ledger', '포토북 미니멀', 'Photobook Minimal', '한 장면·한 캡션·한 페이지 번호만 남겨 이미지의 속도와 침묵을 존중하는 화면', ['#F7F7F4', '#FFFFFF', '#E2E2DC', '#2E5266', '#9A483A'], '넓은 이미지 자리와 가장자리의 작은 촬영 정보', ['포토북', '미니멀']),

    b('botanical-editorial', 'editorial', 'tactile-editorial', '보태니컬 에디토리얼', 'Botanical Editorial', '식물 표본·라틴명·계절 색을 정갈한 편집 그리드에 놓는 자연 관찰형 디자인', ['#EFEBDD', '#FAF8F0', '#D8D1BD', '#3F6C4B', '#A44A3F'], '압화 실루엣 옆 세로 학명과 채집 일지', ['식물', '표본']),
    b('wabi-sabi-paper', 'editorial', 'tactile-editorial', '와비사비 페이퍼', 'Wabi-sabi Paper', '불균일한 종이 가장자리와 먹색 여백으로 완벽하지 않은 재료의 고요함을 살린 화면', ['#E9E1D2', '#F8F4EB', '#D0C3AE', '#725547', '#3F6559'], '번진 듯한 한 획과 비대칭으로 놓인 작은 본문 묶음', ['와비사비', '종이']),
    b('collage-magazine', 'editorial', 'tactile-editorial', '콜라주 매거진', 'Collage Magazine', '사진 자리·손글씨 메모·색지를 편집자의 책상처럼 겹쳐 발견의 즐거움을 주는 디자인', ['#F2E6D4', '#FFF8EC', '#D9C5A9', '#C83F49', '#287078'], '찢긴 색지 아래 숨은 캡션과 테이프형 내비게이션', ['매거진', '콜라주']),
    b('typographic-poster', 'editorial', 'tactile-editorial', '타이포그래픽 포스터', 'Typographic Poster', '한 문장을 이미지처럼 확대하고 작은 편집 정보로 균형을 잡는 활자 중심 포스터 화면', ['#F4EBDD', '#FFF9EF', '#DCCDB8', '#B9342E', '#235D73'], '화면을 가로지르는 대형 단어와 모서리의 행사 정보', ['타이포', '포스터'])
  ]
});

export const RETRO_EDITORIAL_STYLES = RETRO_EDITORIAL_PACK.styles;
export const RETRO_EDITORIAL_BLUEPRINTS = RETRO_EDITORIAL_PACK.blueprints;
export const RETRO_EDITORIAL_MANIFEST = RETRO_EDITORIAL_PACK.manifest;
