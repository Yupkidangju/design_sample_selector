import assert from 'node:assert/strict';
import test from 'node:test';

import {
  hydrateMockup,
  observeThumbMotion,
  resolveRuntimeMessage,
  teardownMockup
} from '../src/components/mockupRuntime.js';
import { PreviewRegistryError } from '../src/preview/index.js';

class FakeClassList {
  constructor(element) {
    this.element = element;
  }

  add(...names) {
    names.forEach(name => this.element.classes.add(name));
  }

  remove(...names) {
    names.forEach(name => this.element.classes.delete(name));
  }

  contains(name) {
    return this.element.classes.has(name);
  }

  toggle(name, force) {
    const enabled = force === undefined ? !this.contains(name) : Boolean(force);
    if (enabled) this.add(name);
    else this.remove(name);
    return enabled;
  }
}

class FakeElement {
  constructor(tagName = 'div', classNames = []) {
    this.tagName = tagName.toUpperCase();
    this.classes = new Set(classNames);
    this.classList = new FakeClassList(this);
    this.children = [];
    this.parentNode = null;
    this.attributes = new Map();
    this.listeners = new Map();
    this.style = { setProperty() {} };
  }

  get className() {
    return [...this.classes].join(' ');
  }

  set className(value) {
    this.classes = new Set(String(value).split(/\s+/u).filter(Boolean));
  }

  get firstChild() {
    return this.children[0] || null;
  }

  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  insertBefore(child, reference) {
    child.parentNode = this;
    const index = reference ? this.children.indexOf(reference) : -1;
    if (index < 0) this.children.push(child);
    else this.children.splice(index, 0, child);
    return child;
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  addEventListener(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(listener);
  }

  removeEventListener(type, listener) {
    this.listeners.get(type)?.delete(listener);
  }

  contains(candidate) {
    if (candidate === this) return true;
    return this.children.some(child => child.contains(candidate));
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  querySelectorAll(selector) {
    const directClass = selector.match(/^:scope > \.([a-z0-9-]+)$/u)?.[1];
    if (directClass) {
      return this.children.filter(child => child.classList.contains(directClass));
    }

    const className = selector.match(/^\.([a-z0-9-]+)/u)?.[1];
    if (!className) return [];
    const matches = [];
    const visit = element => {
      for (const child of element.children) {
        if (child.classList.contains(className)) matches.push(child);
        visit(child);
      }
    };
    visit(this);
    return matches;
  }
}

function createFixture() {
  const root = new FakeElement('section');
  const unit = new FakeElement('div', ['mockup-unit']);
  root.appendChild(unit);
  return { root, unit };
}

function installFakeBrowser(reduce = false) {
  const previousDocument = globalThis.document;
  const previousWindow = globalThis.window;
  globalThis.document = { createElement: tagName => new FakeElement(tagName) };
  globalThis.window = {
    matchMedia: () => ({ matches: reduce })
  };
  return () => {
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  };
}

function assertMotionError(callback, referenceId) {
  assert.throws(callback, error => {
    assert.ok(error instanceof PreviewRegistryError);
    assert.equal(error.code, 'PREVIEW_REFERENCE_UNKNOWN');
    assert.equal(error.referenceKind, 'motion');
    assert.equal(error.referenceId, referenceId);
    return true;
  });
}

test('runtime toast keeps its machine payload stable and resolves visible copy from the locale snapshot', () => {
  const machinePayload = 'Swiss Grid Action Triggered!';
  const snapshot = {
    locale: 'ko',
    copy: { 'runtime.actionComplete': '{name} 인터랙션을 실행했습니다.' }
  };

  assert.equal(
    resolveRuntimeMessage(machinePayload, { name: '스위스 그리드' }, snapshot),
    '스위스 그리드 인터랙션을 실행했습니다.'
  );
  assert.equal(machinePayload, 'Swiss Grid Action Triggered!');
  assert.equal(resolveRuntimeMessage(machinePayload, { name: 'Swiss Grid' }, null), machinePayload);
});

test('hydrateMockup uses registered motion classes and remains idempotent', () => {
  const restore = installFakeBrowser();
  const { root, unit } = createFixture();

  try {
    unit.classList.add('motion-grid-reveal');
    hydrateMockup(root, { motionProfile: 'grid-reveal' }, { archetype: 'test' });
    hydrateMockup(root, { motionProfile: 'grid-reveal' }, { archetype: 'test' });

    assert.equal(unit.className.split(/\s+/u).filter(name => name === 'motion-grid-reveal').length, 1);
    assert.equal(unit.querySelectorAll(':scope > .fx-layer').length, 1);
    assert.equal(unit.querySelector(':scope > .fx-layer').className, 'fx-layer fx-grid-reveal');
    assert.equal(unit.querySelector(':scope > .fx-layer').getAttribute('aria-hidden'), 'true');
    assert.equal(unit.listeners.get('click').size, 1);
  } finally {
    teardownMockup(root);
    restore();
  }
});

test('hydrateMockup resolves canonical motion and preserves reduced-motion state', () => {
  const restore = installFakeBrowser(true);
  const { root, unit } = createFixture();

  try {
    hydrateMockup(root, { preview: { motionId: 'glass-orb' } }, { archetype: 'test' });

    assert.equal(unit.classList.contains('motion-glass-orb'), true);
    assert.equal(unit.classList.contains('motion-reduced'), true);
    assert.equal(unit.querySelector(':scope > .fx-layer').className, 'fx-layer fx-glass-orb');
  } finally {
    teardownMockup(root);
    restore();
  }
});

test('hydrateMockup rejects missing and unknown motion references', () => {
  const restore = installFakeBrowser();
  try {
    assertMotionError(
      () => hydrateMockup(createFixture().root, {}, { archetype: 'test' }),
      null
    );
    assertMotionError(
      () => hydrateMockup(
        createFixture().root,
        { motionProfile: 'missing-motion' },
        { archetype: 'test' }
      ),
      'missing-motion'
    );
  } finally {
    restore();
  }
});

test('observeThumbMotion preserves visibility toggling and cleanup', () => {
  const previousObserver = globalThis.IntersectionObserver;
  const root = new FakeElement('section');
  const first = new FakeElement('div', ['style-thumb']);
  const second = new FakeElement('div', ['style-thumb']);
  root.appendChild(first);
  root.appendChild(second);

  let observer;
  globalThis.IntersectionObserver = class {
    constructor(callback) {
      this.callback = callback;
      this.observed = [];
      this.disconnected = false;
      observer = this;
    }

    observe(element) {
      this.observed.push(element);
    }

    disconnect() {
      this.disconnected = true;
    }
  };

  try {
    const cleanup = observeThumbMotion(root);
    assert.deepEqual(observer.observed, [first, second]);

    observer.callback([
      { target: first, isIntersecting: true },
      { target: second, isIntersecting: false }
    ]);
    assert.equal(first.classList.contains('in-view'), true);
    assert.equal(second.classList.contains('in-view'), false);

    cleanup();
    assert.equal(observer.disconnected, true);
    assert.equal(first.classList.contains('in-view'), false);
    assert.equal(second.classList.contains('in-view'), false);
  } finally {
    if (previousObserver === undefined) delete globalThis.IntersectionObserver;
    else globalThis.IntersectionObserver = previousObserver;
  }
});

test('observeThumbMotion skips observers and clears visibility in reduced motion', () => {
  const previousObserver = globalThis.IntersectionObserver;
  const restore = installFakeBrowser(true);
  const root = new FakeElement('section');
  const thumb = new FakeElement('div', ['style-thumb', 'in-view']);
  root.appendChild(thumb);
  let observerCreated = false;
  globalThis.IntersectionObserver = class {
    constructor() {
      observerCreated = true;
    }
  };

  try {
    const cleanup = observeThumbMotion(root);
    assert.equal(observerCreated, false);
    assert.equal(thumb.classList.contains('in-view'), false);
    cleanup();
  } finally {
    restore();
    if (previousObserver === undefined) delete globalThis.IntersectionObserver;
    else globalThis.IntersectionObserver = previousObserver;
  }
});
