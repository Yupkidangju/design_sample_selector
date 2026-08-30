import {
  renderPreviewComponent,
  renderPreviewThumbnail
} from '../preview/index.js';

/**
 * 기존 UI 소비자를 위한 동기 호환 진입점.
 * renderer와 thumbnail 요청을 공개 preview API에 위임한다.
 */
export function getMockupHTML(previewType, tab, subDesign) {
  const currentTab = tab || 'hero';

  if (currentTab === 'thumb') {
    return renderPreviewThumbnail({
      thumbnailId: subDesign?.thumbMotif,
      design: subDesign
    });
  }

  return renderPreviewComponent({
    rendererId: previewType,
    tab: currentTab,
    design: subDesign
  });
}
