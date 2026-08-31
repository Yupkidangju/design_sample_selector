/**
 * Mockup & Archetype Runtime Engine v2.2
 * Features:
 * - Robust WeakMap-based CleanupRegistry to prevent ghost timers and memory leaks (FIN-F008)
 * - Multi-Archetype Kinetic Simulators: Game, E-Commerce, Blog, Mobile, Dashboard, Media, Chat (FIN-F004)
 * - High-fidelity Web Audio Procedural SFX Integration (THEME_SWAP, COIN, CART_ADD, SUCCESS, LIKE, SWIPE)
 * - Safe textContent-based dynamic DOM insertion (XSS prevention)
 * - Full prefers-reduced-motion compliance
 */

import { synthAudio } from '../audio/synthAudio.js';
import {
  getPreviewMotionDefinition,
  PreviewRegistryError
} from '../preview/motionEntry.js';
import { prefersReducedMotion } from '../utils/selection.js';

export const MAX_RUNTIME_INPUT_LENGTH = 500;
export const MAX_RUNTIME_HISTORY = 50;

const runtimeMap = new WeakMap();
const unitCleanupMap = new WeakMap();
const checkoutCleanupMap = new WeakMap();
const pendingChatReplyMap = new WeakMap();
const activeRoots = new Set();
let checkoutDialogSequence = 0;

function resolveMotionDescriptor(subDesign) {
  const motionId = subDesign?.preview?.motionId ?? subDesign?.motionProfile;
  const descriptor = getPreviewMotionDefinition(motionId);
  if (!descriptor) {
    throw new PreviewRegistryError(
      'PREVIEW_REFERENCE_UNKNOWN',
      '등록되지 않은 motion입니다.',
      { referenceKind: 'motion', referenceId: motionId }
    );
  }
  return descriptor;
}

function runCleanups(rootEl) {
  const rt = runtimeMap.get(rootEl);
  if (!rt) return;
  checkoutCleanupMap.get(rt.unit)?.();
  const ownedTimers = unitCleanupMap.get(rt.unit);
  ownedTimers?.forEach(timer => clearTimeout(timer));
  unitCleanupMap.delete(rt.unit);
  pendingChatReplyMap.delete(rt.unit);
  rt.cleanups.forEach((fn) => {
    try { fn(); } catch { /* ignore */ }
  });
  runtimeMap.delete(rootEl);
  activeRoots.delete(rootEl);
}

// In-Memory Local Simulator State Store (scoped per unit)
class ArchetypeStateStore {
  constructor(unit, initialState = null) {
    this.unit = unit;
    this.game = { hp: 820, maxHp: 1000, mp: 650, coins: 1420, combo: 3.2, targetHp: 100, level: 42, kills: 0 };
    this.shop = { qty: 1, basePrice: 89000, selectedColor: '#FF3300', selectedSize: 'M', cart: [] };
    this.blog = { claps: 42, isLightMode: false, comments: [] };
    this.media = { isPlaying: true, progress: 45, volume: 0.7, trackIndex: 0 };
    this.chat = { msgCount: 2, channel: 'general-chat', messages: [] };
    this.dash = { sortKey: null, sortDir: 1, filter: '', rows: null };

    if (initialState) {
      for (const key of ['game', 'shop', 'blog', 'media', 'chat', 'dash']) {
        if (!initialState[key] || typeof initialState[key] !== 'object') continue;
        this[key] = { ...this[key], ...cloneStateValue(initialState[key]) };
      }
    }

    this.blog.comments = Array.isArray(this.blog.comments)
      ? this.blog.comments
        .filter(text => typeof text === 'string' && text.length <= MAX_RUNTIME_INPUT_LENGTH)
        .slice(-MAX_RUNTIME_HISTORY)
      : [];
    this.chat.messages = Array.isArray(this.chat.messages)
      ? this.chat.messages
        .filter(message => (
          message
          && (message.role === 'user' || message.role === 'peer')
          && typeof message.text === 'string'
          && message.text.length <= MAX_RUNTIME_INPUT_LENGTH
        ))
        .slice(-MAX_RUNTIME_HISTORY)
      : [];
  }
}

function cloneStateValue(value) {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map(cloneStateValue);
  if (typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, cloneStateValue(entry)]));
}

function captureControlState(unit) {
  return Array.from(unit.querySelectorAll('input, select, textarea')).map((control, index) => ({
    key: control.id || control.getAttribute('name') || `${control.tagName}:${control.getAttribute('data-action') || ''}:${index}`,
    value: control.value,
    checked: 'checked' in control ? Boolean(control.checked) : undefined,
    selectedIndex: control.tagName === 'SELECT' ? control.selectedIndex : undefined
  }));
}

function restoreControlState(unit, controls = []) {
  if (!Array.isArray(controls) || !controls.length) return;
  const current = Array.from(unit.querySelectorAll('input, select, textarea'));
  const byKey = new Map(current.map((control, index) => [
    control.id || control.getAttribute('name') || `${control.tagName}:${control.getAttribute('data-action') || ''}:${index}`,
    control
  ]));

  controls.forEach((saved) => {
    const control = byKey.get(saved?.key);
    if (!control) return;
    if (typeof saved.value === 'string') control.value = saved.value;
    if (typeof saved.checked === 'boolean' && 'checked' in control) control.checked = saved.checked;
    if (Number.isInteger(saved.selectedIndex) && control.tagName === 'SELECT') {
      control.selectedIndex = saved.selectedIndex;
    }
  });
}

function snapshotStore(store) {
  if (!store) return null;
  const snapshot = Object.fromEntries(['game', 'shop', 'blog', 'media', 'chat', 'dash']
    .map(key => [key, cloneStateValue(store[key])]));
  // 행 markup은 style 고유 콘텐츠이므로 filter/sort 상태와 함께 이관하지 않는다.
  delete snapshot.dash.rows;
  return snapshot;
}

export function snapshotMockupState(rootEl) {
  const runtime = rootEl ? runtimeMap.get(rootEl) : null;
  if (!runtime) return null;
  return Object.freeze({
    archetype: runtime.archetype,
    store: snapshotStore(runtime.stateStore),
    controls: captureControlState(runtime.unit)
  });
}

export function teardownMockup(rootEl) {
  if (!rootEl) return;
  for (const el of [...activeRoots]) {
    if (el !== rootEl && rootEl.contains(el)) runCleanups(el);
  }
  runCleanups(rootEl);
}

export function hydrateMockup(rootEl, subDesign, options = {}) {
  teardownMockup(rootEl);
  if (!rootEl) return;

  const cleanups = [];
  const reduce = prefersReducedMotion();
  const motion = resolveMotionDescriptor(subDesign);
  const archetype = options.archetype || rootEl.getAttribute('data-archetype') || 'game';

  const unit = rootEl.querySelector('.mockup-unit') || rootEl.querySelector('.archetype-unit') || rootEl;
  unitCleanupMap.set(unit, new Set());

  unit.classList.add(motion.unitClass);
  if (options.compact) unit.classList.add('is-compact');
  if (reduce) unit.classList.add('motion-reduced');

  ensureFxLayer(unit, motion);
  ensureToastHost(unit);

  const stateStore = new ArchetypeStateStore(unit, options.initialState?.store);

  if (!reduce) {
    animateMeters(unit);
  }

  // Universal Action Event Delegation
  const onClick = (e) => {
    const trigger = e.target.closest('[data-action], [data-mock-action]');
    if (!trigger || !unit.contains(trigger)) return;

    // Don't prevent default on inputs
    if (trigger.tagName !== 'INPUT' && trigger.tagName !== 'TEXTAREA') {
      e.preventDefault();
      e.stopPropagation();
    }

    const action = trigger.getAttribute('data-action') || trigger.getAttribute('data-mock-action') || 'toast';
    const msg = trigger.getAttribute('data-mock-msg') || '';

    routeArchetypeAction(unit, trigger, action, msg, stateStore, e);
  };

  const onKeydown = (e) => {
    const customButton = e.target.closest('[role="button"]');
    if ((e.key === 'Enter' || e.key === ' ') && customButton && unit.contains(customButton)) {
      const tag = customButton.tagName;
      if (tag !== 'BUTTON' && tag !== 'A' && tag !== 'INPUT') {
        e.preventDefault();
        customButton.click();
        return;
      }
    }

    if (e.key === 'Enter') {
      const chatInput = e.target.closest('#chat-msg-input');
      if (chatInput && unit.contains(chatInput)) {
        e.preventDefault();
        submitChatMessage(unit, chatInput, stateStore);
      }
      const blogInput = e.target.closest('#blog-comment-input');
      if (blogInput && unit.contains(blogInput)) {
        e.preventDefault();
        submitBlogComment(unit, blogInput, stateStore);
      }
    }
  };

  const onInput = (e) => {
    const trigger = e.target.closest('[data-action]');
    if (!trigger || !unit.contains(trigger)) return;
    const action = trigger.getAttribute('data-action');
    if (action === 'dash-filter') {
      handleDashFilter(unit, trigger.value, stateStore);
    } else if (action === 'media-volume') {
      handleMediaVolume(unit, trigger, stateStore);
    }
  };

  unit.addEventListener('click', onClick);
  unit.addEventListener('keydown', onKeydown);
  unit.addEventListener('input', onInput);
  cleanups.push(() => unit.removeEventListener('click', onClick));
  cleanups.push(() => unit.removeEventListener('keydown', onKeydown));
  cleanups.push(() => unit.removeEventListener('input', onInput));

  if (archetype === 'dashboard' && !stateStore.dash.rows) captureDashRows(unit, stateStore);
  restoreArchetypeState(unit, stateStore, archetype);
  restoreControlState(unit, options.initialState?.controls);

  if (archetype === 'blog') bindBlogProgress(rootEl, unit, cleanups);
  if (archetype === 'media' && !reduce) bindMediaSpectrum(unit, stateStore, cleanups);

  runtimeMap.set(rootEl, { cleanups, stateStore, unit, archetype });
  activeRoots.add(rootEl);
}

export function observeThumbMotion(root) {
  if (!root || typeof IntersectionObserver === 'undefined') return () => {};
  const thumbs = root.querySelectorAll('.style-thumb');
  if (!thumbs.length) return () => {};

  if (prefersReducedMotion()) {
    thumbs.forEach(thumb => thumb.classList.remove('in-view'));
    return () => {};
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('in-view', entry.isIntersecting);
    });
  }, { threshold: 0.15, rootMargin: '40px' });

  thumbs.forEach((thumb) => io.observe(thumb));
  return () => {
    io.disconnect();
    thumbs.forEach(thumb => thumb.classList.remove('in-view'));
  };
}

function ensureFxLayer(unit, motion) {
  if (!motion.effectLayer) return;
  const existingLayer = unit.querySelector(':scope > .fx-layer');
  if (existingLayer) {
    existingLayer.className = `fx-layer ${motion.effectClass}`;
    existingLayer.setAttribute('aria-hidden', 'true');
    return;
  }
  const layer = document.createElement('div');
  layer.className = `fx-layer ${motion.effectClass}`;
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
  if (!toast || !msg) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearOwnedTimeout(unit, toast._hide);
  toast._hide = scheduleOwnedTimeout(unit, () => {
    toast._hide = null;
    toast.classList.remove('show');
  }, 1600);
}

function pulseClass(el, className, ms = 420) {
  if (!el) return;
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
  const unit = el.closest?.('.archetype-unit, .mockup-unit') || el;
  clearOwnedTimeout(unit, el._pulse);
  el._pulse = scheduleOwnedTimeout(unit, () => {
    el._pulse = null;
    el.classList.remove(className);
  }, ms);
}

function clearOwnedTimeout(unit, timer) {
  if (timer === null || timer === undefined) return;
  clearTimeout(timer);
  unitCleanupMap.get(unit)?.delete(timer);
}

function scheduleOwnedTimeout(unit, callback, delay) {
  const timers = unitCleanupMap.get(unit);
  let timer = null;
  timer = setTimeout(() => {
    timers?.delete(timer);
    if (unit.isConnected !== false) callback();
  }, delay);
  timers?.add(timer);
  return timer;
}

// Action Router
function routeArchetypeAction(unit, trigger, action, msg, store, evt) {
  // 1. GAME ACTIONS
  if (action === 'game-tap') {
    handleGameTap(unit, trigger, store);
    return;
  }
  if (action === 'game-skill') {
    handleGameSkill(unit, trigger, store);
    return;
  }
  if (action === 'game-boost') {
    handleGameBoost(unit, trigger, store);
    return;
  }

  // 2. SHOPPING ACTIONS
  if (action === 'shop-color') {
    handleShopColor(unit, trigger, store);
    return;
  }
  if (action === 'shop-size') {
    handleShopSize(unit, trigger, store);
    return;
  }
  if (action === 'shop-qty-inc') {
    handleShopQty(unit, 1, store);
    return;
  }
  if (action === 'shop-qty-dec') {
    handleShopQty(unit, -1, store);
    return;
  }
  if (action === 'cart-add') {
    handleAddToCart(unit, store);
    return;
  }
  if (action === 'shop-cart-open') {
    unit.querySelector('#shop-cart-drawer')?.classList.add('open');
    synthAudio.playSfx('SWIPE');
    return;
  }
  if (action === 'shop-cart-close') {
    unit.querySelector('#shop-cart-drawer')?.classList.remove('open');
    synthAudio.playSfx('CLOSE');
    return;
  }
  if (action === 'shop-checkout') {
    handleShopCheckout(unit, trigger, store);
    return;
  }

  // 3. BLOG ACTIONS
  if (action === 'blog-like') {
    handleBlogLike(unit, trigger, store);
    return;
  }
  if (action === 'blog-reading-mode') {
    handleBlogReadingMode(unit, store);
    return;
  }
  if (action === 'blog-comment-submit') {
    const input = unit.querySelector('#blog-comment-input');
    if (input) submitBlogComment(unit, input, store);
    return;
  }
  if (action === 'blog-toc') {
    const targetId = trigger.getAttribute('data-target');
    const section = targetId ? unit.querySelector(`#${targetId}`) : null;
    section?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    synthAudio.playSfx('CLICK');
    return;
  }

  // 4. MOBILE ACTIONS
  if (action === 'mobile-swipe') {
    const notif = unit.querySelector('#mobile-notif-card');
    if (notif) {
      notif.classList.add('dismissed');
      synthAudio.playSfx('SWIPE');
    }
    return;
  }
  if (action === 'mobile-like') {
    pulseClass(trigger, 'fx-bounce', 350);
    const countSpan = trigger.querySelector('.like-count');
    if (countSpan) countSpan.textContent = String(parseInt(countSpan.textContent || '0', 10) + 1);
    synthAudio.playSfx('LIKE');
    return;
  }
  if (action === 'mobile-tab') {
    unit.querySelectorAll('.mobile-tab-btn').forEach(b => b.classList.toggle('active', b === trigger));
    synthAudio.playSfx('CLICK');
    return;
  }
  if (action === 'mobile-toggle') {
    synthAudio.playSfx('CLICK');
    return;
  }

  // 5. DASHBOARD ACTIONS
  if (action === 'dash-period') {
    unit.querySelectorAll('.period-btn').forEach(b => b.classList.toggle('active', b === trigger));
    synthAudio.playSfx('CLICK');
    randomizeDashboardMetrics(unit);
    return;
  }
  if (action === 'dash-refresh') {
    synthAudio.playSfx('CLICK');
    pulseClass(trigger, 'fx-bounce', 400);
    randomizeDashboardMetrics(unit);
    return;
  }
  if (action === 'dash-sort') {
    handleDashSort(unit, trigger, store);
    return;
  }

  // 6. MEDIA ACTIONS
  if (action === 'media-play') {
    const disc = unit.querySelector('#media-vinyl');
    const playIcon = trigger.querySelector('.play-icon');
    store.media.isPlaying = !store.media.isPlaying;
    if (disc) disc.classList.toggle('paused', !store.media.isPlaying);
    if (playIcon) playIcon.textContent = store.media.isPlaying ? '❚❚' : '▶';
    synthAudio.playSfx('CLICK');
    return;
  }
  if (action === 'media-scrub') {
    handleMediaScrub(unit, trigger, evt, store);
    return;
  }
  if (action === 'media-next' || action === 'media-prev') {
    handleMediaSkip(unit, action === 'media-next' ? 1 : -1, store);
    return;
  }
  if (action === 'media-queue') {
    const idx = parseInt(trigger.getAttribute('data-track') || '0', 10);
    store.media.trackIndex = idx;
    applyMediaTrack(unit, store);
    synthAudio.playSfx('SWIPE');
    return;
  }

  // 7. CHAT ACTIONS
  if (action === 'chat-react') {
    const current = trigger.textContent || '';
    const parts = current.split(' ');
    if (parts.length >= 2) {
      const num = parseInt(parts[1], 10) + 1;
      trigger.textContent = `${parts[0]} ${num}`;
    }
    pulseClass(trigger, 'fx-bounce', 300);
    synthAudio.playSfx('LIKE');
    return;
  }
  if (action === 'chat-send') {
    const chatInput = unit.querySelector('#chat-msg-input');
    if (chatInput) submitChatMessage(unit, chatInput, store);
    return;
  }
  if (action === 'chat-channel') {
    handleChatChannel(unit, trigger, store);
    return;
  }

  if (action === 'media-volume' || action === 'dash-filter') return;

  // Generic Mockup Action Fallback
  synthAudio.playSfx('CLICK');
  if (msg) showMockToast(unit, msg);
  pulseClass(trigger, 'fx-bounce', 400);
}

// --- Specific Simulators ---

function handleGameTap(unit, target, store) {
  store.game.coins += 50;
  store.game.combo = +(store.game.combo + 0.2).toFixed(1);
  store.game.targetHp -= 25;

  if (store.game.targetHp <= 0) {
    store.game.targetHp = 100;
    store.game.coins += 200;
    store.game.kills += 1;
    synthAudio.playSfx('SUCCESS');
    showMockToast(unit, '🎉 MONSTER DEFEATED! +200 COINS');
    if (store.game.kills % 3 === 0) {
      store.game.level += 1;
      const lvl = unit.querySelector('.hud-player-level');
      if (lvl) updateGameLevelLabel(lvl, store.game.level);
      spawnLevelUpParticles(unit);
      showMockToast(unit, `✨ LEVEL UP! LV. ${store.game.level}`);
    }
  } else {
    synthAudio.playSfx('COIN');
  }

  const coinElem = unit.querySelector('#game-coin-count');
  const comboElem = unit.querySelector('#game-combo-mult');
  const hpFill = target.querySelector('.target-hp-fill');

  if (coinElem) coinElem.textContent = store.game.coins.toLocaleString();
  if (comboElem) comboElem.textContent = `x${store.game.combo}`;
  if (hpFill) hpFill.style.width = `${store.game.targetHp}%`;

  pulseClass(target, 'fx-punch', 200);
}

function handleGameSkill(unit, btn, store) {
  const skill = btn.getAttribute('data-skill');
  const cooldownOverlay = btn.querySelector('.skill-cooldown');

  if (btn.classList.contains('in-cooldown')) return;

  btn.classList.add('in-cooldown');
  if (cooldownOverlay) {
    cooldownOverlay.style.transition = 'height 1.5s linear';
    cooldownOverlay.style.height = '100%';
  }

  if (skill === 'r') {
    synthAudio.playSfx('SUCCESS');
    showMockToast(unit, '💥 ULTIMATE ACTIVATED! 9999 CRITICAL!');
    pulseClass(unit.querySelector('.game-arena-board'), 'fx-glitch', 600);
  } else if (skill === 'e') {
    store.game.hp = Math.min(1000, store.game.hp + 200);
    const hpFill = unit.querySelector('.hp-fill');
    const hpVal = unit.querySelector('.hp-val');
    if (hpFill) hpFill.style.width = `${(store.game.hp / 1000) * 100}%`;
    if (hpVal) hpVal.textContent = `${store.game.hp} / 1000`;
    synthAudio.playSfx('CONFIRM');
    showMockToast(unit, '🧪 HP +200 RECOVERED');
  } else {
    synthAudio.playSfx('CLICK');
    showMockToast(unit, `⚡ SKILL [${skill.toUpperCase()}] EXECUTED`);
  }

  scheduleOwnedTimeout(unit, () => {
    btn.classList.remove('in-cooldown');
    if (cooldownOverlay) {
      cooldownOverlay.style.transition = 'none';
      cooldownOverlay.style.height = '0%';
    }
  }, 1500);
}

function handleGameBoost(unit, btn, store) {
  store.game.combo = +(store.game.combo + 1.0).toFixed(1);
  const comboElem = unit.querySelector('#game-combo-mult');
  if (comboElem) comboElem.textContent = `x${store.game.combo}`;
  synthAudio.playSfx('SUCCESS');
  pulseClass(btn, 'fx-bounce', 350);
  showMockToast(unit, '🚀 COMBO MULTIPLIER BOOSTED!');
}

function handleShopSize(unit, btn, store) {
  unit.querySelectorAll('.size-chip-btn').forEach(c => c.classList.toggle('active', c === btn));
  store.shop.selectedSize = btn.getAttribute('data-size') || 'M';
  synthAudio.playSfx('CLICK');
}

function handleShopColor(unit, btn, store) {
  unit.querySelectorAll('.color-chip-btn').forEach(c => c.classList.toggle('active', c === btn));
  const color = btn.getAttribute('data-color');
  store.shop.selectedColor = color;
  const visual = unit.querySelector('#product-visual');
  if (visual) visual.style.borderColor = color;
  synthAudio.playSfx('CLICK');
}

function handleShopQty(unit, delta, store) {
  store.shop.qty = Math.max(1, Math.min(99, store.shop.qty + delta));
  const qtyDisplay = unit.querySelector('#shop-qty-val');
  const priceDisplay = unit.querySelector('#product-total-price');
  if (qtyDisplay) qtyDisplay.textContent = String(store.shop.qty);
  if (priceDisplay) priceDisplay.textContent = (store.shop.basePrice * store.shop.qty).toLocaleString();
  synthAudio.playSfx('CLICK');
}

function handleAddToCart(unit, store) {
  const currentQty = store.shop.qty;
  store.shop.cart.push({
    qty: currentQty,
    price: store.shop.basePrice * currentQty,
    size: store.shop.selectedSize,
    color: store.shop.selectedColor
  });
  renderShopState(unit, store);

  synthAudio.playSfx('CART_ADD');
  unit.querySelector('#shop-cart-drawer')?.classList.add('open');
}

function renderShopState(unit, store) {
  const totalItems = store.shop.cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = store.shop.cart.reduce((sum, item) => sum + item.price, 0);
  const badge = unit.querySelector('#shop-cart-badge');
  const drawerCount = unit.querySelector('#cart-drawer-count');
  const drawerTotal = unit.querySelector('#cart-drawer-total');
  const cartList = unit.querySelector('#cart-items-list');
  const qtyDisplay = unit.querySelector('#shop-qty-val');
  const priceDisplay = unit.querySelector('#product-total-price');
  const checkout = unit.querySelector('.cart-checkout-btn');

  if (badge) badge.textContent = String(totalItems);
  if (drawerCount) drawerCount.textContent = String(totalItems);
  if (drawerTotal) drawerTotal.textContent = `₩${totalPrice.toLocaleString()}`;
  if (qtyDisplay) qtyDisplay.textContent = String(store.shop.qty);
  if (priceDisplay) priceDisplay.textContent = (store.shop.basePrice * store.shop.qty).toLocaleString();
  if (checkout) checkout.disabled = store.shop.cart.length === 0;
  if (checkout) checkout.setAttribute('aria-disabled', String(store.shop.cart.length === 0));

  unit.querySelectorAll('.size-chip-btn').forEach((button) => {
    button.classList.toggle('active', button.getAttribute('data-size') === store.shop.selectedSize);
  });
  unit.querySelectorAll('.color-chip-btn').forEach((button) => {
    button.classList.toggle('active', button.getAttribute('data-color') === store.shop.selectedColor);
  });
  const visual = unit.querySelector('#product-visual');
  if (visual && store.shop.selectedColor) visual.style.borderColor = store.shop.selectedColor;

  if (cartList) {
    if (!store.shop.cart.length) {
      cartList.innerHTML = '<p class="cart-empty-msg">장바구니가 비어 있습니다.</p>';
    } else {
      cartList.innerHTML = store.shop.cart.map((item) => `
        <div class="cart-item-row">
          <span>에디션 디자인 상품 ${item.size || store.shop.selectedSize} (${item.qty}개)</span>
          <strong>₩${item.price.toLocaleString()}</strong>
        </div>
      `).join('');
    }
  }
}

function handleShopCheckout(unit, trigger, store) {
  const source = trigger.getAttribute('data-checkout-source') === 'cart' ? 'cart' : 'direct';
  if (source === 'cart' && store.shop.cart.length === 0) {
    showMockToast(unit, '장바구니가 비어 있습니다.');
    return;
  }
  openShopCheckoutDialog(unit, trigger, store, source);
}

function openShopCheckoutDialog(unit, opener, store, source) {
  checkoutCleanupMap.get(unit)?.();
  const items = source === 'cart'
    ? store.shop.cart
    : [{ qty: store.shop.qty, price: store.shop.basePrice * store.shop.qty }];
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  const checkoutTitleId = `mock-checkout-title-${++checkoutDialogSequence}`;
  const layer = document.createElement('div');
  layer.className = 'mock-checkout-layer';
  layer.innerHTML = `
    <button type="button" class="mock-checkout-backdrop" data-checkout-cancel aria-label="결제 취소"></button>
    <section class="mock-checkout-dialog" role="dialog" aria-modal="true" aria-labelledby="${checkoutTitleId}">
      <p class="mock-checkout-kicker">${source === 'cart' ? 'CART CHECKOUT' : 'DIRECT PURCHASE'}</p>
      <h3 id="${checkoutTitleId}">주문 내용을 확인하세요</h3>
      <dl class="mock-checkout-summary">
        <div><dt>주문 방식</dt><dd>${source === 'cart' ? '장바구니 결제' : '바로 구매'}</dd></div>
        <div><dt>수량</dt><dd>${totalItems}개</dd></div>
        <div><dt>합계</dt><dd>₩${totalPrice.toLocaleString()}</dd></div>
      </dl>
      <p class="mock-checkout-note">실제 결제가 발생하지 않는 디자인 시뮬레이션입니다.</p>
      <div class="mock-checkout-actions">
        <button type="button" data-checkout-cancel>취소</button>
        <button type="button" data-checkout-confirm>결제 확인</button>
      </div>
    </section>
  `;
  unit.appendChild(layer);

  const dialog = layer.querySelector('.mock-checkout-dialog');
  const focusables = () => Array.from(dialog.querySelectorAll('button:not(:disabled)'));
  let closed = false;
  let dispose = () => layer.remove();
  const close = (confirmed = false) => {
    if (closed) return;
    closed = true;
    if (confirmed) {
      if (source === 'cart') store.shop.cart = [];
      renderShopState(unit, store);
      unit.querySelector('#shop-cart-drawer')?.classList.remove('open');
      synthAudio.playSfx('SUCCESS');
      showMockToast(unit, '💳 결제가 성공적으로 시뮬레이션되었습니다! 감사합니다.');
    } else {
      synthAudio.playSfx('CLOSE');
    }
    dispose();
    if (opener?.isConnected) opener.focus();
  };
  const onKeydown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      close(false);
      return;
    }
    if (event.key !== 'Tab') return;
    const controls = focusables();
    if (!controls.length) return;
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  dispose = () => {
    layer.removeEventListener('keydown', onKeydown);
    layer.remove();
    if (checkoutCleanupMap.get(unit) === dispose) checkoutCleanupMap.delete(unit);
  };

  layer.addEventListener('keydown', onKeydown);
  layer.querySelectorAll('[data-checkout-cancel]').forEach(button => {
    button.addEventListener('click', () => close(false));
  });
  layer.querySelector('[data-checkout-confirm]')?.addEventListener('click', () => close(true));
  checkoutCleanupMap.set(unit, dispose);
  layer.querySelector('.mock-checkout-actions [data-checkout-cancel]')?.focus();
}

function handleBlogLike(unit, btn, store) {
  store.blog.claps += 1;
  const clapCount = unit.querySelector('#blog-clap-count');
  if (clapCount) clapCount.textContent = String(store.blog.claps);
  pulseClass(btn, 'fx-bounce', 300);
  synthAudio.playSfx('LIKE');
}

function handleBlogReadingMode(unit, store) {
  store.blog.isLightMode = !store.blog.isLightMode;
  applyBlogReadingMode(unit, store);
  synthAudio.playSfx('CLICK');
}

function applyBlogReadingMode(unit, store) {
  unit.classList.toggle('blog-light-mode', store.blog.isLightMode);
  const button = unit.querySelector('[data-action="blog-reading-mode"]');
  if (button) {
    button.setAttribute('aria-pressed', String(store.blog.isLightMode));
    button.setAttribute('aria-label', store.blog.isLightMode ? '어두운 읽기 모드로 전환' : '밝은 읽기 모드로 전환');
  }
}

function submitBlogComment(unit, input, store) {
  const text = (input.value || '').trim();
  const status = unit.querySelector('#blog-comment-status');
  if (!text) {
    if (status) status.textContent = '댓글 내용을 입력해 주세요.';
    return;
  }
  if (text.length > MAX_RUNTIME_INPUT_LENGTH) {
    if (status) status.textContent = `댓글은 ${MAX_RUNTIME_INPUT_LENGTH}자 이하로 입력해 주세요.`;
    input.focus();
    return;
  }

  const commentsList = unit.querySelector('#blog-comments-list');
  const countSpan = unit.querySelector('#blog-comment-count');

  if (commentsList) {
    const item = createTextEntry('comment-item is-runtime', '방문자 (You)', text);
    commentsList.insertBefore(item, commentsList.firstChild);
    Array.from(commentsList.querySelectorAll('.comment-item.is-runtime'))
      .slice(MAX_RUNTIME_HISTORY)
      .forEach(comment => comment.remove());
  }

  store.blog.comments = [...store.blog.comments, text].slice(-MAX_RUNTIME_HISTORY);
  if (countSpan) countSpan.textContent = String(2 + store.blog.comments.length);
  if (status) status.textContent = `댓글이 등록되었습니다. ${text.length}/${MAX_RUNTIME_INPUT_LENGTH}자`;

  input.value = '';
  synthAudio.playSfx('CONFIRM');
}

function submitChatMessage(unit, input, store) {
  const text = (input.value || '').trim();
  const status = unit.querySelector('#chat-message-status');
  if (!text) {
    if (status) status.textContent = '메시지를 입력해 주세요.';
    return;
  }
  if (text.length > MAX_RUNTIME_INPUT_LENGTH) {
    if (status) status.textContent = `메시지는 ${MAX_RUNTIME_INPUT_LENGTH}자 이하로 입력해 주세요.`;
    input.focus();
    return;
  }

  const container = unit.querySelector('#chat-messages-container');
  const userMessage = { role: 'user', text };
  store.chat.messages = [...store.chat.messages, userMessage].slice(-MAX_RUNTIME_HISTORY);
  store.chat.msgCount = 2 + store.chat.messages.length;
  if (container) {
    container.appendChild(createChatEntry(userMessage));
    trimChatHistory(container);
    container.scrollTop = container.scrollHeight;
  }

  input.value = '';
  if (status) status.textContent = `메시지를 전송했습니다. ${text.length}/${MAX_RUNTIME_INPUT_LENGTH}자`;
  synthAudio.playSfx('CONFIRM');

  // 빠른 연속 전송은 마지막 응답 하나로 합쳐 pending timer 수를 제한한다.
  clearOwnedTimeout(unit, pendingChatReplyMap.get(unit));
  const replyTimer = scheduleOwnedTimeout(unit, () => {
    pendingChatReplyMap.delete(unit);
    if (!container || !unit.isConnected) return;
    const botMessage = {
      role: 'peer',
      text: '요청한 테마 프리뷰가 실시간으로 반영되었습니다! 🎨'
    };
    store.chat.messages = [...store.chat.messages, botMessage].slice(-MAX_RUNTIME_HISTORY);
    store.chat.msgCount = 2 + store.chat.messages.length;
    container.appendChild(createChatEntry(botMessage));
    trimChatHistory(container);
    container.scrollTop = container.scrollHeight;
    synthAudio.playSfx('REVEAL');
  }, 500);
  pendingChatReplyMap.set(unit, replyTimer);
}

function trimChatHistory(container) {
  const dynamicMessages = Array.from(container.querySelectorAll('.chat-bubble-msg.is-runtime'));
  dynamicMessages.slice(0, -MAX_RUNTIME_HISTORY).forEach(message => message.remove());
}

function spawnLevelUpParticles(unit) {
  const layer = document.createElement('div');
  layer.className = 'level-up-burst';
  layer.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('span');
    p.className = 'level-up-particle';
    p.style.setProperty('--burst-x', `${(Math.random() * 180 - 90).toFixed(1)}px`);
    p.style.setProperty('--burst-y', `${(Math.random() * -140 - 20).toFixed(1)}px`);
    p.style.animationDelay = `${i * 18}ms`;
    layer.appendChild(p);
  }
  unit.appendChild(layer);
  scheduleOwnedTimeout(unit, () => layer.remove(), 900);
}

function resolveBlogScrollOwner(scroller) {
  const modalBody = scroller.closest('.modal-body-grid');
  if (modalBody && window.matchMedia?.('(max-width: 1024px)').matches) return modalBody;
  return scroller;
}

function bindBlogProgress(scroller, unit, cleanups) {
  const fill = unit.querySelector('#blog-progress-fill');
  const progress = unit.querySelector('#blog-progress-track');
  const onScroll = () => {
    const owner = resolveBlogScrollOwner(scroller);
    const max = owner.scrollHeight - owner.clientHeight;
    const pct = max <= 0 ? 0 : Math.min(100, Math.max(0, (owner.scrollTop / max) * 100));
    const rounded = Math.round(pct);
    if (fill) fill.style.width = `${pct}%`;
    if (progress) {
      progress.setAttribute('aria-valuenow', String(rounded));
      progress.setAttribute('aria-valuetext', `${rounded}% 읽음`);
    }
  };
  const owners = new Set([scroller, scroller.closest('.modal-body-grid')].filter(Boolean));
  owners.forEach(owner => owner.addEventListener('scroll', onScroll, { passive: true }));
  window.addEventListener('resize', onScroll);
  onScroll();
  cleanups.push(() => {
    owners.forEach(owner => owner.removeEventListener('scroll', onScroll));
    window.removeEventListener('resize', onScroll);
  });
}

function restoreArchetypeState(unit, store, archetype) {
  if (archetype === 'game') {
    const hpFill = unit.querySelector('.hp-fill');
    const hpValue = unit.querySelector('.hp-val');
    const mpFill = unit.querySelector('.mp-fill');
    const mpValue = unit.querySelector('.mp-val');
    const targetHp = unit.querySelector('.target-hp-fill');
    const coins = unit.querySelector('#game-coin-count');
    const combo = unit.querySelector('#game-combo-mult');
    const level = unit.querySelector('.hud-player-level');
    if (hpFill) hpFill.style.width = `${(store.game.hp / Math.max(1, store.game.maxHp)) * 100}%`;
    if (hpValue) hpValue.textContent = `${store.game.hp} / ${store.game.maxHp}`;
    if (mpFill) mpFill.style.width = `${(store.game.mp / 1000) * 100}%`;
    if (mpValue) mpValue.textContent = `${store.game.mp} / 1000`;
    if (targetHp) targetHp.style.width = `${store.game.targetHp}%`;
    if (coins) coins.textContent = store.game.coins.toLocaleString();
    if (combo) combo.textContent = `x${store.game.combo}`;
    if (level) updateGameLevelLabel(level, store.game.level);
    return;
  }

  if (archetype === 'ecommerce') {
    renderShopState(unit, store);
    return;
  }

  if (archetype === 'blog') {
    const clapCount = unit.querySelector('#blog-clap-count');
    if (clapCount) clapCount.textContent = String(store.blog.claps);
    applyBlogReadingMode(unit, store);
    const commentsList = unit.querySelector('#blog-comments-list');
    if (commentsList) {
      store.blog.comments.forEach((text) => {
        const item = createTextEntry('comment-item is-runtime', '방문자 (You)', text);
        commentsList.insertBefore(item, commentsList.firstChild);
      });
    }
    const count = unit.querySelector('#blog-comment-count');
    if (count) count.textContent = String(2 + store.blog.comments.length);
    return;
  }

  if (archetype === 'dashboard') {
    const filter = unit.querySelector('.table-filter-input');
    if (filter) filter.value = store.dash.filter || '';
    unit.querySelectorAll('.dash-sort-btn').forEach((button) => {
      const active = button.getAttribute('data-sort') === store.dash.sortKey;
      button.classList.toggle('active', active);
      button.setAttribute('data-dir', active ? String(store.dash.sortDir) : '');
    });
    if (store.dash.rows) renderDashRows(unit, store);
    return;
  }

  if (archetype === 'media') {
    const preservedProgress = store.media.progress;
    applyMediaTrack(unit, store);
    store.media.progress = preservedProgress;
    const slider = unit.querySelector('.media-volume-slider');
    if (slider) slider.value = String(store.media.volume);
    handleMediaVolume(unit, slider || { value: store.media.volume }, store);
    const track = unit.querySelector('.scrub-track');
    const fill = track?.querySelector('.scrub-fill');
    if (fill) fill.style.width = `${store.media.progress}%`;
    const disc = unit.querySelector('#media-vinyl');
    const playIcon = unit.querySelector('[data-action="media-play"] .play-icon');
    if (disc) disc.classList.toggle('paused', !store.media.isPlaying);
    if (playIcon) playIcon.textContent = store.media.isPlaying ? '❚❚' : '▶';
    return;
  }

  if (archetype === 'chat') {
    unit.querySelectorAll('.channel-item').forEach((button) => {
      button.classList.toggle('active', button.getAttribute('data-channel') === store.chat.channel);
    });
    const topic = unit.querySelector('.chat-topic');
    if (topic) topic.textContent = `# ${store.chat.channel}`;
    const messages = unit.querySelector('#chat-messages-container');
    if (messages) {
      store.chat.messages.forEach((message) => messages.appendChild(createChatEntry(message)));
      messages.scrollTop = messages.scrollHeight;
    }
  }
}

function updateGameLevelLabel(element, level) {
  const styleName = element.textContent.replace(/^LV\.\s*\d+\s*/u, '').trim();
  element.textContent = `LV. ${level}${styleName ? ` ${styleName}` : ''}`;
}

function createTextEntry(className, authorText, bodyText) {
  const item = document.createElement('div');
  item.className = className;
  const author = document.createElement('strong');
  author.textContent = authorText;
  const body = document.createElement('p');
  body.textContent = bodyText;
  item.appendChild(author);
  item.appendChild(body);
  return item;
}

function createChatEntry(message) {
  const item = document.createElement('div');
  item.className = `chat-bubble-msg ${message.role === 'peer' ? 'peer' : 'user'} is-runtime`;
  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.textContent = message.role === 'peer' ? '🤖' : '🚀';
  const content = document.createElement('div');
  content.className = 'msg-content';
  const sender = document.createElement('span');
  sender.className = 'msg-sender';
  sender.textContent = message.role === 'peer' ? 'Design AI Bot' : 'You';
  const body = document.createElement('p');
  body.textContent = message.text;
  content.appendChild(sender);
  content.appendChild(body);
  item.appendChild(avatar);
  item.appendChild(content);
  return item;
}

function captureDashRows(unit, store) {
  const body = unit.querySelector('#dash-table-body');
  if (!body) return;
  store.dash.rows = Array.from(body.querySelectorAll('tr')).map((tr) => {
    const cells = Array.from(tr.querySelectorAll('td')).map((td) => td.textContent.trim());
    return { html: tr.innerHTML, cells, status: cells[2] || '', id: cells[0] || '' };
  });
}

function handleDashFilter(unit, query, store) {
  store.dash.filter = (query || '').toLowerCase();
  renderDashRows(unit, store);
}

function handleDashSort(unit, trigger, store) {
  const key = trigger.getAttribute('data-sort');
  if (!key) return;
  if (store.dash.sortKey === key) store.dash.sortDir *= -1;
  else {
    store.dash.sortKey = key;
    store.dash.sortDir = 1;
  }
  unit.querySelectorAll('.dash-sort-btn').forEach((btn) => {
    btn.classList.toggle('active', btn === trigger);
    btn.setAttribute('data-dir', store.dash.sortKey === btn.getAttribute('data-sort') ? String(store.dash.sortDir) : '');
  });
  renderDashRows(unit, store);
  synthAudio.playSfx('CLICK');
}

function renderDashRows(unit, store) {
  const body = unit.querySelector('#dash-table-body');
  if (!body || !store.dash.rows) return;
  const idxMap = { id: 0, project: 1, status: 2, spend: 3, time: 4 };
  const col = idxMap[store.dash.sortKey] ?? -1;
  let rows = [...store.dash.rows];
  if (store.dash.filter) {
    rows = rows.filter((r) => r.cells.join(' ').toLowerCase().includes(store.dash.filter));
  }
  if (col >= 0) {
    rows.sort((a, b) => a.cells[col].localeCompare(b.cells[col], 'ko', { numeric: true }) * store.dash.sortDir);
  }
  body.innerHTML = rows.map((r) => `<tr>${r.html}</tr>`).join('');
}

function handleMediaVolume(unit, slider, store) {
  const vol = Math.max(0, Math.min(1, parseFloat(slider.value) || 0));
  store.media.volume = vol;
  const label = unit.querySelector('#media-vol-val');
  if (label) label.textContent = `${Math.round(vol * 100)}%`;
  const bars = unit.querySelector('#media-spectrum');
  if (bars) bars.style.opacity = String(0.35 + vol * 0.65);
}

function handleMediaScrub(unit, track, evt, store) {
  const rect = track.getBoundingClientRect();
  const x = evt?.clientX ?? rect.left;
  const pct = Math.max(0, Math.min(1, (x - rect.left) / Math.max(1, rect.width)));
  store.media.progress = Math.round(pct * 100);
  const fill = track.querySelector('.scrub-fill');
  if (fill) fill.style.width = `${store.media.progress}%`;
  const time = unit.querySelector('#media-cur-time');
  if (time) {
    const total = 220;
    const cur = Math.round(total * pct);
    time.textContent = `${String(Math.floor(cur / 60)).padStart(2, '0')}:${String(cur % 60).padStart(2, '0')}`;
  }
  synthAudio.playSfx('CLICK');
}

function handleMediaSkip(unit, dir, store) {
  const items = unit.querySelectorAll('.queue-item');
  const len = Math.max(1, items.length);
  store.media.trackIndex = (store.media.trackIndex + dir + len) % len;
  applyMediaTrack(unit, store);
  synthAudio.playSfx('SWIPE');
  pulseClass(unit.querySelector('#media-vinyl'), 'fx-bounce', 300);
}

function applyMediaTrack(unit, store) {
  const items = unit.querySelectorAll('.queue-item');
  items.forEach((item, i) => item.classList.toggle('active', i === store.media.trackIndex));
  const active = items[store.media.trackIndex];
  const title = unit.querySelector('#media-track-name');
  if (title && active) {
    const name = active.querySelector('span')?.textContent || title.textContent;
    title.textContent = name;
  }
  store.media.progress = 0;
  const fill = unit.querySelector('.scrub-fill');
  if (fill) fill.style.width = '0%';
  const time = unit.querySelector('#media-cur-time');
  if (time) time.textContent = '00:00';
}

function bindMediaSpectrum(unit, store, cleanups) {
  const bars = unit.querySelectorAll('#media-spectrum .spec-bar');
  if (!bars.length) return;
  const tick = () => {
    const playing = store.media.isPlaying;
    const vol = store.media.volume;
    bars.forEach((bar) => {
      const h = playing ? 18 + Math.random() * 82 * vol : 12;
      bar.style.height = `${h}%`;
    });
  };
  const timer = setInterval(tick, 120);
  tick();
  cleanups.push(() => clearInterval(timer));
}

function handleChatChannel(unit, trigger, store) {
  unit.querySelectorAll('.channel-item').forEach((el) => el.classList.toggle('active', el === trigger));
  store.chat.channel = trigger.getAttribute('data-channel') || 'general-chat';
  const topic = unit.querySelector('.chat-topic');
  if (topic) topic.textContent = `# ${store.chat.channel}`;
  synthAudio.playSfx('CLICK');
}

function randomizeDashboardMetrics(unit) {
  const rev = unit.querySelector('#metric-rev');
  const users = unit.querySelector('#metric-users');
  const cr = unit.querySelector('#metric-cr');

  if (rev) rev.textContent = `₩${(Math.floor(Math.random() * 50 + 20) * 1000000).toLocaleString()}`;
  if (users) users.textContent = (Math.floor(Math.random() * 20000 + 10000)).toLocaleString();
  if (cr) cr.textContent = `${(Math.random() * 3 + 3).toFixed(2)}%`;
}

function animateMeters(unit) {
  const meters = unit.querySelectorAll('.meter-fill[data-meter-val]');
  meters.forEach((meter) => {
    const target = meter.getAttribute('data-meter-val') || '60%';
    meter.style.width = '0%';
    scheduleOwnedTimeout(unit, () => {
      meter.style.transition = 'width .8s cubic-bezier(0.4, 0, 0.2, 1)';
      meter.style.width = target;
    }, 120);
  });
}
