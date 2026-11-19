import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml } from '../src/utils/escape.js';
import { copyText } from '../src/utils/clipboard.js';
import { loadBookmarks, toggleBookmarkId } from '../src/utils/bookmarks.js';

describe('유틸리티 (escape, bookmarks, clipboard 폴백)', () => {
  it('escapeHtml이 특수 문자를 안전하게 이스케이프한다', () => {
    assert.equal(
      escapeHtml(`<script>"a" & 'b'</script>`),
      '&lt;script&gt;&quot;a&quot; &amp; &#39;b&#39;&lt;/script&gt;'
    );
  });

  it('bookmarks가 허용 ID만 복원하고 중복 없이 토글한다', () => {
    const store = new Map();
    const prevWindow = globalThis.window;
    globalThis.window = {
      localStorage: {
        getItem: k => store.get(k) ?? null,
        setItem: (k, v) => store.set(k, v)
      }
    };
    try {
      let ids = toggleBookmarkId([], 'swiss-grid');
      ids = toggleBookmarkId(ids, 'pixel-arcade');
      assert.deepEqual(ids, ['swiss-grid', 'pixel-arcade']);

      store.set('design_spectrum_v3_bookmarks', JSON.stringify(['swiss-grid', 'removed-legacy', 'swiss-grid']));
      assert.deepEqual(loadBookmarks(new Set(['swiss-grid', 'pixel-arcade'])), ['swiss-grid']);
    } finally {
      globalThis.window = prevWindow;
    }
  });

  it('navigator.clipboard.writeText가 권한 거부로 실패하면 textarea + execCommand 폴백을 수행한다 (R-04)', async () => {
    const prevWindow = globalThis.window;
    const prevDocument = globalThis.document;
    const prevNavigator = globalThis.navigator;
    let execCalled = 0;
    let appendedTo = null;
    let toastMessage = '';

    const fakeDialog = {
      appendChild(el) {
        appendedTo = 'dialog';
        el.parentElement = fakeDialog;
      }
    };
    const fakeToast = {
      id: 'studio-toast',
      className: '',
      classList: { add() {}, remove() {} },
      setAttribute() {},
      set textContent(v) { toastMessage = v; },
      get textContent() { return toastMessage; }
    };

    globalThis.window = {
      isSecureContext: true,
      setTimeout: () => 1,
      clearTimeout() {}
    };
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: {
        clipboard: {
          async writeText() {
            throw new DOMException('Permission denied', 'NotAllowedError');
          }
        }
      }
    });
    globalThis.document = {
      activeElement: null,
      body: { appendChild() { appendedTo = 'body'; } },
      getElementById: id => (id === 'studio-toast' ? fakeToast : null),
      querySelector: sel => (sel === 'dialog[open]' ? fakeDialog : null),
      createElement: () => ({
        value: '',
        style: {},
        setAttribute() {},
        focus() {},
        select() {},
        remove() {}
      }),
      execCommand: cmd => {
        if (cmd === 'copy') {
          execCalled += 1;
          return true;
        }
        return false;
      }
    };

    try {
      const ok = await copyText('hello-v3', '복사 완료');
      assert.equal(ok, true);
      assert.equal(execCalled, 1);
      assert.equal(appendedTo, 'dialog');
      assert.equal(toastMessage, '복사 완료');
    } finally {
      globalThis.window = prevWindow;
      globalThis.document = prevDocument;
      Object.defineProperty(globalThis, 'navigator', { configurable: true, value: prevNavigator });
    }
  });
});
