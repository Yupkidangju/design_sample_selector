import { getActiveLocaleSnapshot } from '../i18n/index.js';
import { formatLocaleCopy } from '../i18n/format.js';

export function renderGalleryPagination(windowModel) {
  if (!windowModel || windowModel.pageCount <= 1) return '';
  const copy = getActiveLocaleSnapshot()?.copy;
  const t = (key, values) => formatLocaleCopy(copy, key, values);

  return `
    <nav class="gallery-pagination" aria-label="${t('gallery.pageAria')}">
      <button class="gallery-page-btn" data-gallery-page="previous" type="button"
              aria-label="${t('gallery.previousAria')}" ${windowModel.canPrevious ? '' : 'disabled'}>
        ← ${t('gallery.previous')}
      </button>
      <p class="gallery-page-status" role="status" aria-live="polite" tabindex="-1">
        <strong>${windowModel.start}–${windowModel.end}</strong> / ${windowModel.total}
        <span>· ${t('gallery.pageStatus', { page: windowModel.page, pages: windowModel.pageCount })}</span>
      </p>
      <button class="gallery-page-btn" data-gallery-page="next" type="button"
              aria-label="${t('gallery.nextAria')}" ${windowModel.canNext ? '' : 'disabled'}>
        ${t('gallery.next')} →
      </button>
    </nav>
  `;
}
