// 실패한 primary lazy URL을 재사용하지 않는 1회 재시도 진입점이다.
import {
  getPreviewReferenceInventory as readInventory,
  renderPreviewComponent as renderComponent
} from './componentEntry.js';

export const lazyEntryAttempt = 'retry-1';

export function getPreviewReferenceInventory() {
  return readInventory();
}

export function renderPreviewComponent(options) {
  return renderComponent(options);
}
