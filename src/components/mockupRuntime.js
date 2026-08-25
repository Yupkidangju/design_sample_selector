/**
 * Mockup runtime — hydrates static mockup HTML with toasts, toggles, and style-specific motion.
 * Templates stay declarative (data-mock-action). This module owns timers and listeners.
 */

import { synthAudio } from '../audio/synthAudio.js';
import { prefersReducedMotion } from '../utils/selection.js';

const runtimeMap = new WeakMap();

const FLAVOR_BY_TYPE = {
  'raw-brutal': 'punch',
  brutalism: 'punch',
  'neo-brutal': 'bounce',
  cyberpunk: 'glitch',
  'acid-techno': 'glitch',
  claymorphism: 'squish',
  memphis: 'bounce',
  'pixel-arcade': 'coin',
  'kinetic-type': 'boost',
  skeuomorphism: 'flip',
  neumorphism: 'toggle',
  glassmorphism: 'ripple',
  'frutiger-aero': 'ripple',
  'y2k-chrome': 'ripple',
  'handcrafted-indie': 'peel',
  'solarpunk-eco': 'grow'
};

export function teardownMockup(rootEl) {
  if (!rootEl) return;
  const rt = runtimeMap.get(rootEl);
  if (!rt) return;
  rt.cleanups.forEach((fn) => {
    try { fn(); } catch { /* ignore */ }
  });
  runtimeMap.delete(rootEl);
}

export function hydrateMockup(rootEl, subDesign, options = {}) {
  teardownMockup(rootEl);
  if (!rootEl) return;

  const cleanups = [];
  const reduce = prefersReducedMotion();
  const previewType = subDesign?.previewType || options.previewType || 'swiss';
  const motion = subDesign?.motionProfile || 'none';
  const unit = rootEl.querySelector('.mockup-unit') || rootEl;

  unit.classList.add(`motion-${motion}`);
  if (options.compact) unit.classList.add('is-compact');
  if (reduce) unit.classList.add('motion-reduced');

  ensureFxLayer(unit, motion);
  ensureToastHost(unit);

  if (!reduce) {
    animateCounters(unit, cleanups);
    animateMeters(unit, cleanups);
  }

  const onClick = (e) => {
    const trigger = e.target.closest('[data-mock-action]');
    if (!trigger || !unit.contains(trigger)) return;
    e.preventDefault();
    e.stopPropagation();
    const action = trigger.getAttribute('data-mock-action') || 'toast';
    const msg = trigger.getAttribute('data-mock-msg') || 'Action complete';
    runAction(unit, trigger, action, msg, previewType);
  };

  unit.addEventListener('click', onClick);
  cleanups.push(() => unit.removeEventListener('click', onClick));

  runtimeMap.set(rootEl, { cleanups });
}

export function observeThumbMotion(root) {
  if (!root || typeof IntersectionObserver === 'undefined') return () => {};
  const thumbs = root.querySelectorAll('.style-thumb');
  if (!thumbs.length) return () => {};

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('in-view', entry.isIntersecting);
    });
  }, { threshold: 0.15, rootMargin: '40px' });

  thumbs.forEach((thumb) => io.observe(thumb));
  return () => io.disconnect();
}

function ensureFxLayer(unit, motion) {
  if (unit.querySelector(':scope > .fx-layer')) return;
  const layer = document.createElement('div');
  layer.className = `fx-layer fx-${motion}`;
  layer.setAttribute('aria-hidden', 'true');
  unit.insertBefore(layer, unit.firstChild);
}

function ensureToastHost(unit) {
  if (unit.querySelector(':scope > .mock-live-toast')) return;
  const toast = document.createElement('div');
  toast.className = 'mock-live-toast';
  toast.setAttribute('role', 'status');
  unit.appendChild(toast);
}

function showMockToast(unit, msg) {
  const toast = unit.querySelector(':scope > .mock-live-toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._hide);
  toast._hide = setTimeout(() => toast.classList.remove('show'), 1600);
}

function pulseClass(el, className, ms = 520) {
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
  clearTimeout(el._pulse);
  el._pulse = setTimeout(() => el.classList.remove(className), ms);
}

function runAction(unit, trigger, action, msg, previewType) {
  const flavor = action === 'toast' ? (FLAVOR_BY_TYPE[previewType] || 'toast') : action;
  synthAudio.playSfx('CLICK');
  showMockToast(unit, msg);

  switch (flavor) {
    case 'punch':
      pulseClass(unit, 'fx-punch', 420);
      break;
    case 'glitch':
      pulseClass(unit, 'fx-glitch', 480);
      break;
    case 'bounce':
      pulseClass(trigger, 'fx-bounce', 420);
      break;
    case 'squish':
      pulseClass(trigger, 'fx-squish', 420);
      pulseClass(unit, 'fx-squish-unit', 420);
      break;
    case 'coin': {
      const score = unit.querySelector('[data-mock-score], .pixel-bar span:last-child, .pixel-title');
      const current = parseInt((unit.dataset.coins || '0'), 10) + 1;
      unit.dataset.coins = String(current);
      if (score) score.textContent = `COINS: ${String(current).padStart(2, '0')}`;
      const hp = unit.querySelector('.hp-fill');
      if (hp) hp.style.width = `${Math.min(100, 40 + current * 8)}%`;
      pulseClass(unit, 'fx-coin', 360);
      break;
    }
    case 'boost':
      unit.classList.toggle('fx-boost');
      break;
    case 'flip':
      trigger.classList.toggle('is-flipped');
      trigger.classList.toggle('active');
      break;
    case 'toggle':
      trigger.classList.toggle('active');
      break;
    case 'ripple':
      pulseClass(trigger, 'fx-ripple', 600);
      break;
    case 'peel':
      trigger.classList.toggle('is-peeled');
      unit.classList.toggle('fx-peel');
      break;
    case 'grow': {
      const bar = unit.querySelector('.solar-grow, .bar-progress, .hp-fill');
      if (bar) {
        const w = Math.min(100, (parseFloat(bar.dataset.grown || '40') + 18));
        bar.dataset.grown = String(w);
        bar.style.width = `${w}%`;
      }
      pulseClass(unit, 'fx-grow', 700);
      break;
    }
    default:
      pulseClass(trigger, 'fx-press', 220);
  }
}

function animateCounters(unit, cleanups) {
  const nodes = unit.querySelectorAll('.val, .c-val, .g-val, .clay-num, .solar-val, .bento-stat, .swiss-stat-cell .val');
  nodes.forEach((node) => {
    const raw = (node.textContent || '').trim();
    const match = raw.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
    if (!match) return;
    const [, prefix, num, suffix] = match;
    const target = parseFloat(num);
    if (!Number.isFinite(target) || target > 100000) return;
    const isInt = !num.includes('.');
    const decimals = isInt ? 0 : (num.split('.')[1] || '').length;
    const start = performance.now();
    const dur = 700;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = target * eased;
      node.textContent = `${prefix}${isInt ? Math.round(current) : current.toFixed(decimals)}${suffix}`;
      if (t < 1) {
        const id = requestAnimationFrame(tick);
        node._raf = id;
      }
    };
    const id = requestAnimationFrame(tick);
    cleanups.push(() => cancelAnimationFrame(node._raf || id));
  });
}

function animateMeters(unit, cleanups) {
  const bars = unit.querySelectorAll('.hp-fill, .bar-progress');
  bars.forEach((bar) => {
    const target = bar.style.width || getComputedStyle(bar).width;
    bar.style.width = '0%';
    const id = requestAnimationFrame(() => {
      bar.style.transition = 'width 0.8s ease-out';
      bar.style.width = target && target !== '0px' ? (bar.getAttribute('data-width') || '78%') : '78%';
    });
    cleanups.push(() => cancelAnimationFrame(id));
  });
}
