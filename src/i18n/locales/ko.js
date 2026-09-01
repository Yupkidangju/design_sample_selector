import { getLocaleCopy } from '../copy.js';
import catalog from './catalog/ko.js';

export default {
  locale: 'ko',
  catalog,
  copy: getLocaleCopy('ko'),
  messages: {
    language: '언어', search: '디자인 검색', all: '전체', saved: '저장됨',
    sort: '정렬', catalogOrder: '카탈로그 순', nameAscending: '이름순', eraAscending: '연대순', eraDescending: '최신순',
    grid: '그리드', bento: '벤토', spectrum: '스펙트럼', details: '상세 보기', bookmark: '북마크', bookmarked: '북마크됨',
    inspector: '인스펙터', palette: '컬러 팔레트', characteristics: '특징', pros: '장점', cons: '주의점',
    copy: '복사', copied: '복사됨', reset: '기본값 리셋', desktop: '데스크톱', mobile: '모바일',
    noResults: '검색 결과가 없습니다.', category: '카테고리', filters: '필터', clearFilters: '필터 초기화',
    liveTuner: '실시간 파라미터 튜너', previewHint: '화면 내부 요소를 클릭하여 실제 인터랙션을 확인하세요.',
    designSummary: '디자인 시안과 적용 원칙을 보여주는 샘플입니다.',
    paletteUsage: '시안의 주요 표면과 신호에 사용하는 색상입니다.', subtitle: '8대 대분류 · 120종 라이브 시안 · 8대 아키타입 · 동적 샌드박스',
    noSelection: '선택 없음', compare: '스플릿 비교'
  }
};
