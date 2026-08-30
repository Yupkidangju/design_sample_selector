export function createRetryableModuleLoader(importModule) {
  const importers = (Array.isArray(importModule) ? importModule : [importModule])
    .filter(importer => typeof importer === 'function');
  if (importers.length === 0) {
    throw new TypeError('module importer는 함수 또는 함수 배열이어야 합니다.');
  }

  let pending = null;
  let importerIndex = 0;

  return Object.freeze({
    load() {
      if (pending) return pending;
      const importer = importers[Math.min(importerIndex, importers.length - 1)];
      const attempt = Promise.resolve().then(() => importer());
      pending = attempt;
      attempt.catch(() => {
        if (pending !== attempt) return;
        pending = null;
        importerIndex = Math.min(importerIndex + 1, importers.length - 1);
      });
      return attempt;
    },
    reset() {
      pending = null;
      importerIndex = 0;
    }
  });
}

// 실패한 module URL은 브라우저 module map에 남으므로 재시도는 별도 정적 URL을 사용한다.
const detailViewLoader = createRetryableModuleLoader([
  () => import('./detailView.js'),
  () => import('./detailView.js?retry=1')
]);
const componentPreviewLoader = createRetryableModuleLoader([
  () => import('../preview/componentLazyEntry.js'),
  () => import('../preview/componentLazyRetryEntry.js')
]);

export function loadDetailViewModule() {
  return detailViewLoader.load();
}

export function loadComponentPreviewModule() {
  return componentPreviewLoader.load();
}
