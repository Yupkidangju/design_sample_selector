// Peek·확정 시트의 실패 경계를 Detail이 사용하는 호환 entrypoint와 분리한다.
import {
  getPreviewReferenceInventory as readInventory,
  renderPreviewComponent as renderComponent
} from './componentEntry.js';

export const lazyEntryAttempt = 'primary';

export function getPreviewReferenceInventory() {
  return readInventory();
}

export function renderPreviewComponent(options) {
  return renderComponent(options);
}
