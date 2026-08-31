import { recordRecoveryDiagnostic } from '../utils/recoveryDiagnostics.js';

export class RecoveryImportError extends Error {
  constructor(cause, details) {
    super('요청한 프리뷰 모듈을 불러오지 못했습니다.', { cause });
    this.name = 'RecoveryImportError';
    this.code = 'RECOVERY_IMPORT_FAILED';
    this.phase = 'import';
    this.attempt = details.attempt;
    this.resourceClass = details.resourceClass;
    this.terminal = details.terminal;
  }
}

export function createRetryableModuleLoader(importModule, options = {}) {
  const importers = (Array.isArray(importModule) ? importModule : [importModule])
    .filter(importer => typeof importer === 'function');
  if (importers.length === 0) {
    throw new TypeError('module importer는 함수 또는 함수 배열이어야 합니다.');
  }

  const maxAttempts = Math.max(1, options.maxAttempts ?? Math.max(2, importers.length));
  const resourceClass = typeof options.resourceClass === 'string'
    ? options.resourceClass
    : 'module-graph';
  let pending = null;
  let resolved = null;
  let attemptCount = 0;
  let status = 'idle';
  let lastError = null;

  return Object.freeze({
    load() {
      if (pending) return pending;
      if (resolved) return resolved;
      if (status === 'terminal') return Promise.reject(lastError);

      const importer = importers[Math.min(attemptCount, importers.length - 1)];
      const currentAttempt = attemptCount + 1;
      attemptCount = currentAttempt;
      status = 'loading';
      const request = Promise.resolve()
        .then(() => importer())
        .then(module => {
          status = 'ready';
          pending = null;
          resolved = Promise.resolve(module);
          return module;
        }, cause => {
          const terminal = currentAttempt >= maxAttempts;
          status = terminal ? 'terminal' : 'error';
          pending = null;
          lastError = new RecoveryImportError(cause, {
            attempt: currentAttempt,
            resourceClass,
            terminal
          });
          recordRecoveryDiagnostic(lastError);
          throw lastError;
        });
      pending = request;
      return request;
    },
    getStatus() {
      return Object.freeze({
        status,
        attempt: attemptCount,
        maxAttempts,
        canRetry: status === 'error' && attemptCount < maxAttempts,
        terminal: status === 'terminal',
        resourceClass
      });
    },
    reset() {
      pending = null;
      resolved = null;
      attemptCount = 0;
      status = 'idle';
      lastError = null;
    }
  });
}

// 실패한 module URL은 브라우저 module map에 남으므로 재시도는 별도 정적 URL을 사용한다.
const detailViewLoader = createRetryableModuleLoader([
  () => import('./detailView.js'),
  () => import('./detailView.js?retry=1')
], { resourceClass: 'detail-graph', maxAttempts: 2 });
const componentPreviewLoader = createRetryableModuleLoader([
  () => import('../preview/componentLazyEntry.js'),
  () => import('../preview/componentLazyRetryEntry.js')
], { resourceClass: 'component-graph', maxAttempts: 2 });

export function loadDetailViewModule() {
  return detailViewLoader.load();
}

export function loadComponentPreviewModule() {
  return componentPreviewLoader.load();
}
