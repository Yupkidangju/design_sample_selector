export function renderGalleryPagination(windowModel) {
  if (!windowModel || windowModel.pageCount <= 1) return '';

  return `
    <nav class="gallery-pagination" aria-label="디자인 결과 페이지">
      <button class="gallery-page-btn" data-gallery-page="previous" type="button"
              aria-label="이전 디자인 결과 페이지" ${windowModel.canPrevious ? '' : 'disabled'}>
        ← 이전
      </button>
      <p class="gallery-page-status" role="status" aria-live="polite" tabindex="-1">
        <strong>${windowModel.start}–${windowModel.end}</strong> / ${windowModel.total}
        <span>· ${windowModel.page} / ${windowModel.pageCount} 페이지</span>
      </p>
      <button class="gallery-page-btn" data-gallery-page="next" type="button"
              aria-label="다음 디자인 결과 페이지" ${windowModel.canNext ? '' : 'disabled'}>
        다음 →
      </button>
    </nav>
  `;
}
