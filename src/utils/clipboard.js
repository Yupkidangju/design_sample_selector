/**
 * Clipboard & Toast Notification Utility
 * Handles click-to-copy of Hex palette codes and renders visual toast overlays with audio feedback.
 */

import { synthAudio } from '../audio/synthAudio.js';

export async function copyTextWithFallback(text, {
  clipboard = typeof navigator !== 'undefined' ? navigator.clipboard : null,
  documentRef = typeof document !== 'undefined' ? document : null
} = {}) {
  if (clipboard?.writeText) {
    try {
      await clipboard.writeText(String(text));
      return true;
    } catch {
      // 권한 거부 시 동기 폴백을 한 번 시도한다.
    }
  }

  if (!documentRef?.body || typeof documentRef.execCommand !== 'function') return false;

  const activeElement = documentRef.activeElement;
  const textArea = documentRef.createElement('textarea');
  textArea.value = String(text);
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  documentRef.body.appendChild(textArea);

  let copied = false;
  try {
    textArea.select();
    textArea.setSelectionRange?.(0, textArea.value.length);
    copied = documentRef.execCommand('copy') === true;
  } catch {
    copied = false;
  } finally {
    if (textArea.isConnected) {
      if (typeof textArea.remove === 'function') textArea.remove();
      else documentRef.body.removeChild(textArea);
    }
    if (activeElement?.isConnected !== false && typeof activeElement?.focus === 'function') {
      try { activeElement.focus(); } catch { /* 기존 포커스 복구 실패는 복사 결과를 바꾸지 않는다. */ }
    }
  }

  return copied;
}

export async function copyToClipboard(text, label = '색상 코드') {
  const copied = await copyTextWithFallback(text);
  if (copied) {
    showToast(`Copied ${label} [ ${text} ] to Clipboard! 📋`);
    synthAudio.playSfx('COPY');
  } else {
    showToast(`${label}을(를) 복사하지 못했습니다. 다시 시도해 주세요.`, 'error');
  }
  return copied;
}

export function showToast(message, tone = 'status') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.setAttribute('role', tone === 'error' ? 'alert' : 'status');

  const iconSpan = document.createElement('span');
  iconSpan.textContent = '✨';
  iconSpan.setAttribute('aria-hidden', 'true');

  const textSpan = document.createElement('span');
  textSpan.textContent = String(message);

  toast.appendChild(iconSpan);
  toast.appendChild(document.createTextNode(' '));
  toast.appendChild(textSpan);
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 2200);
}
