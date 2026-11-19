/**
 * 클립보드 복사 & Top-Layer 안전 토스트 피드백 (오디오 없음)
 * - Popover API(popover="manual")를 우선 사용해 <dialog> 모달 위에서도 토스트가 항상 최상단에 노출된다.
 * - navigator.clipboard.writeText 실패(권한 거부 포함) 시 textarea + execCommand('copy') 폴백을 수행한다.
 */

let toastHideTimer = null;
let toastCloseTimer = null;

function supportsPopover(element) {
  return Boolean(element && typeof element.showPopover === 'function' && typeof element.hidePopover === 'function');
}

function getToastHost() {
  return document.querySelector('dialog[open]') || document.body;
}

export function showToast(message) {
  if (typeof document === 'undefined') return;
  let toast = document.getElementById('studio-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'studio-toast';
    toast.className = 'studio-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    if (supportsPopover(toast)) {
      toast.setAttribute('popover', 'manual');
    }
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  window.clearTimeout(toastHideTimer);
  window.clearTimeout(toastCloseTimer);

  if (supportsPopover(toast)) {
    // 모달 <dialog>가 나중에 열렸더라도 토스트를 Top Layer 최상단으로 재승격한다.
    try {
      if (toast.matches(':popover-open')) toast.hidePopover();
      toast.showPopover();
    } catch {
      /* Popover 상태 경합 시 아래 폴백 경로로 안전하게 전환한다. */
    }
  } else {
    const host = getToastHost();
    if (toast.parentElement !== host) {
      host.appendChild(toast);
    }
  }

  toast.classList.add('is-visible');

  toastHideTimer = window.setTimeout(() => {
    toast.classList.remove('is-visible');
    toastCloseTimer = window.setTimeout(() => {
      if (supportsPopover(toast)) {
        try {
          if (toast.matches(':popover-open')) toast.hidePopover();
        } catch {
          /* 이미 닫힌 상태 무시 */
        }
      }
    }, 220);
  }, 2200);
}

function fallbackCopyWithTextarea(text) {
  const host = getToastHost();
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';

  const prevFocus = document.activeElement;
  host.appendChild(textarea);
  textarea.focus({ preventScroll: true });
  textarea.select();

  let copied = false;
  try {
    copied = Boolean(document.execCommand?.('copy'));
  } catch {
    copied = false;
  } finally {
    textarea.remove();
    if (prevFocus && typeof prevFocus.focus === 'function' && prevFocus.isConnected) {
      try {
        prevFocus.focus({ preventScroll: true });
      } catch {
        /* 포커스 복구 실패 무시 */
      }
    }
  }
  return copied;
}

export async function copyText(text, successMessage = '클립보드에 복사했습니다') {
  let copied = false;

  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function' && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch {
      copied = false;
    }
  }

  if (!copied) {
    copied = fallbackCopyWithTextarea(text);
  }

  if (copied) {
    if (successMessage) showToast(successMessage);
    return true;
  }

  showToast('자동 복사에 실패했습니다. 스펙 서랍에서 직접 복사해 주세요.');
  return false;
}

export function downloadTextFile(filename, content, mimeType = 'text/markdown;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
