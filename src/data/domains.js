/**
 * 4대 핵심 도메인 및 3개 스타일 그룹 정의
 */

export const STYLE_GROUPS = Object.freeze([
  Object.freeze({
    id: 'all',
    label: '전체 20종',
    shortLabel: '전체'
  }),
  Object.freeze({
    id: 'modern',
    label: '실무 모던 & 클린',
    shortLabel: '모던·클린'
  }),
  Object.freeze({
    id: 'editorial',
    label: '그래픽 & 에디토리얼',
    shortLabel: '그래픽·에디토리얼'
  }),
  Object.freeze({
    id: 'playful',
    label: '게임 · 레트로 · 3D',
    shortLabel: '게임·레트로·3D'
  })
]);

export const STYLE_GROUP_MAP = Object.freeze(
  Object.fromEntries(STYLE_GROUPS.map(group => [group.id, group]))
);

export const SHOWCASE_DOMAINS = Object.freeze([
  Object.freeze({
    id: 'web',
    label: '웹',
    fullLabel: '웹 랜딩 · 서비스',
    enLabel: 'Web Landing & Product',
    shortcut: '1',
    description: '브랜드 히어로, 아트워크, 핵심 컴포넌트, 인터랙션 폼까지 실제 웹사이트 풀페이지 적용 예시'
  }),
  Object.freeze({
    id: 'mobile',
    label: '모바일',
    fullLabel: '모바일 앱 듀얼 스크린',
    enLabel: 'Mobile App Dual-Screen',
    shortcut: '2',
    description: '홈 피드와 상세 제어 화면을 나란히 배치한 실제 앱스토어급 모바일 UI 적용 예시'
  }),
  Object.freeze({
    id: 'game',
    label: '게임',
    fullLabel: '게임 UI · HUD',
    enLabel: 'Game UI & Interactive HUD',
    shortcut: '3',
    description: '사조별 장르 아이덴티티에 맞춘 전용 아트워크, 체력·스킬 HUD, 실시간 인터랙티브 전투/플레이 화면'
  }),
  Object.freeze({
    id: 'dashboard',
    label: '대시보드',
    fullLabel: '분석 대시보드',
    enLabel: 'Analytics Dashboard',
    shortcut: '4',
    description: 'KPI 지표, 스타일별 맞춤 SVG 차트, 기간 필터, 운영 상태 테이블까지 실무 데이터 UI 예시'
  })
]);

export const DOMAIN_IDS = Object.freeze(SHOWCASE_DOMAINS.map(domain => domain.id));

export function resolveDomainId(value) {
  return DOMAIN_IDS.includes(value) ? value : 'web';
}

export function getDomainById(id) {
  return SHOWCASE_DOMAINS.find(domain => domain.id === id) || SHOWCASE_DOMAINS[0];
}
