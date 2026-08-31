const MAX_RECOVERY_DIAGNOSTICS = 20;
const diagnostics = [];

function safeString(value, fallback) {
  return typeof value === 'string' && value.length > 0 ? value.slice(0, 64) : fallback;
}

export function recordRecoveryDiagnostic(value = {}) {
  const record = Object.freeze({
    code: safeString(value.code, 'RECOVERY_UNKNOWN'),
    phase: safeString(value.phase, 'unknown'),
    attempt: Number.isInteger(value.attempt) && value.attempt > 0 ? value.attempt : 1,
    resourceClass: safeString(value.resourceClass, 'unknown'),
    terminal: value.terminal === true
  });
  diagnostics.push(record);
  if (diagnostics.length > MAX_RECOVERY_DIAGNOSTICS) diagnostics.shift();
  if (typeof globalThis.dispatchEvent === 'function' && typeof globalThis.CustomEvent === 'function') {
    try {
      globalThis.dispatchEvent(new CustomEvent('dss:recovery-diagnostic', { detail: record }));
    } catch { /* 진단 observer 실패가 원래 복구 흐름을 바꾸지 않게 한다. */ }
  }
  return record;
}

export function getRecoveryDiagnostics() {
  return Object.freeze(diagnostics.map(record => Object.freeze({ ...record })));
}

export function clearRecoveryDiagnostics() {
  diagnostics.length = 0;
}
