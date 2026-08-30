import { defineExpansionPack, expansionBlueprint as b } from './authoring.js';

export const SOFT_PLAY_PACK = defineExpansionPack({
  id: 'soft-play',
  order: 80,
  startOrder: 1090,
  title: { ko: '소프트 플레이 12종', en: 'Soft Play 12' },
  blueprints: [
    b('inflatable-ui', 'soft3d', 'soft-toy', '인플레이터블 UI', 'Inflatable UI', '공기를 넣은 듯한 큰 버튼과 부드러운 반사면으로 행동을 가볍고 명확하게 만드는 UI', ['#F7EAF1', '#FFF9FC', '#E8CEDD', '#E35D9A', '#4279C6'], '부푼 캡슐 CTA와 눌리며 형태가 변하는 상태 카드', ['인플레이터블', '버튼']),
    b('toy-block-ui', 'soft3d', 'soft-toy', '토이 블록 UI', 'Toy-block UI', '색과 높이가 다른 블록을 조립하듯 기능을 구분하는 모듈형 인터페이스', ['#F4EFD9', '#FFFDF3', '#E2D8B8', '#E45D3F', '#3277B7'], '서로 맞물리는 기능 블록과 숫자가 새겨진 연결 돌기', ['토이 블록', '모듈']),
    b('kawaii-pastel', 'soft3d', 'soft-toy', '카와이 파스텔', 'Kawaii Pastel', '작은 표정·별·하트와 차분한 파스텔 면으로 친근한 개인 도구를 만드는 디자인', ['#F8EAF1', '#FFF9FC', '#E9CFDD', '#D85F98', '#5284C8'], '상태를 표정으로 보조하는 둥근 카드와 작은 별 배지', ['카와이', '파스텔']),
    b('sticker-book', 'soft3d', 'soft-toy', '스티커 북', 'Sticker Book', '굵은 흰 테두리와 서로 다른 기울기의 스티커를 모아 선택과 수집의 즐거움을 주는 화면', ['#F7F0D8', '#FFFDF5', '#E6D8B4', '#E95843', '#3978B9'], '뜯어 붙인 카테고리 스티커와 체크 표시가 있는 수집판', ['스티커', '수집']),

    b('doodle-interface', 'soft3d', 'crafted-soft', '두들 인터페이스', 'Doodle Interface', '손으로 그린 화살표·동그라미·짧은 메모를 단정한 폼 구조에 얹은 디자인', ['#F4ECDD', '#FFFCF5', '#DED1BB', '#C84D3F', '#3C7081'], '낙서 화살표가 핵심 버튼을 가리키는 노트형 패널', ['두들', '손그림']),
    b('papercraft-ui', 'soft3d', 'crafted-soft', '페이퍼크래프트 UI', 'Papercraft UI', '접힘선·탭·겹친 색지로 기능 사이의 깊이와 조립 순서를 설명하는 화면', ['#F2E8D5', '#FFF9EF', '#DCC8AA', '#D85B42', '#397777'], '접힌 모서리 탭과 종이 층으로 만든 단계 내비게이션', ['페이퍼크래프트', '접기']),
    b('cozy-knit', 'soft3d', 'crafted-soft', '코지 니트', 'Cozy Knit', '실의 반복 리듬과 포근한 중간색을 추상 패턴으로 사용한 생활형 대시보드', ['#F0E5D7', '#FCF8F1', '#D8C4AD', '#A54B45', '#3F7368'], '니트 게이지를 닮은 진행 막대와 패치형 정보 카드', ['니트', '코지']),
    b('dreamcore-cloud', 'soft3d', 'crafted-soft', '드림코어 클라우드', 'Dreamcore Cloud', '안개 낀 구름 면과 낯익지만 비현실적인 표지판으로 몽환적인 탐색 장면을 만드는 스타일', ['#EEEAF3', '#FBF9FD', '#D8D0E2', '#8A5FA8', '#4D7FA3'], '구름 층 사이 떠 있는 문 모양 카드와 조용한 방향 표지', ['드림코어', '몽환']),

    b('kidcore-play', 'soft3d', 'playful-organic', '키드코어 플레이', 'Kidcore Play', '원색 도형·크레용형 선·큰 숫자로 규칙보다 발견을 앞세우는 놀이형 UI', ['#FFF0C7', '#FFF9E8', '#E8D4A4', '#E84B3C', '#3578C5'], '점프하는 숫자 블록과 굵은 색연필형 진행 경로', ['키드코어', '원색']),
    b('biomorphic-soft', 'soft3d', 'playful-organic', '바이오모픽 소프트', 'Biomorphic Soft', '세포·물방울 같은 유기 형태를 서로 연결해 데이터와 행동이 성장하는 듯 보이는 화면', ['#EAF2E7', '#F9FCF7', '#D0DEC9', '#3F8B67', '#C35F68'], '서로 이어진 세포형 카드와 맥박처럼 넓어지는 선택 링', ['바이오모픽', '유기']),
    b('pastel-gradient', 'soft3d', 'playful-organic', '파스텔 그라디언트', 'Pastel Gradient', '낮은 채도의 색 전이를 넓은 면에만 사용하고 정보는 선명한 카드에 고정한 현대적 소프트 UI', ['#F3EDF7', '#FFF9FD', '#DED3E6', '#8B63B7', '#3F819A'], '완만한 색장 위에 떠 있는 단색 작업 카드와 상태 점', ['파스텔', '그라디언트']),
    b('cartoon-dashboard', 'soft3d', 'playful-organic', '카툰 대시보드', 'Cartoon Dashboard', '굵은 윤곽·말풍선·캐릭터형 지표로 일상 데이터를 짧은 이야기처럼 보여 주는 화면', ['#FFF0D0', '#FFF9E9', '#E8D2A8', '#DF553D', '#3476B8'], '수치에 반응하는 작은 캐릭터 카드와 말풍선형 도움말', ['카툰', '대시보드'])
  ]
});

export const SOFT_PLAY_STYLES = SOFT_PLAY_PACK.styles;
export const SOFT_PLAY_BLUEPRINTS = SOFT_PLAY_PACK.blueprints;
export const SOFT_PLAY_MANIFEST = SOFT_PLAY_PACK.manifest;
