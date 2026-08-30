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

const runtimeMap = new WeakMap();
const activeRoots = new Set();

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
  rt.cleanups.forEach((fn) => {
    try { fn(); } catch { /* ignore */ }
  });
  runtimeMap.delete(rootEl);
  activeRoots.delete(rootEl);
}

// In-Memory Local Simulator State Store (scoped per unit)
class ArchetypeStateStore {
  constructor(unit) {
    this.unit = unit;
    this.game = { hp: 820, maxHp: 1000, mp: 650, coins: 1420, combo: 3.2, targetHp: 100, level: 42, kills: 0 };
    this.shop = { qty: 1, basePrice: 89000, selectedColor: '#FF3300', selectedSize: 'M', cart: [] };
    this.blog = { claps: 42, isLightMode: false, comments: [] };
    this.media = { isPlaying: true, progress: 45, volume: 0.7, trackIndex: 0 };
    this.chat = { msgCount: 2, channel: 'general-chat' };
    this.dash = { sortKey: null, sortDir: 1, filter: '', rows: null };
  }
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

  unit.classList.add(motion.unitClass);
  if (options.compact) unit.classList.add('is-compact');
  if (reduce) unit.classList.add('motion-reduced');

  ensureFxLayer(unit, motion);
  ensureToastHost(unit);

  const stateStore = new ArchetypeStateStore(unit);

  if (!reduce) {
    animateMeters(unit, cleanups);
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

    routeArchetypeAction(unit, trigger, action, msg, stateStore, cleanups, e);
  };

  const onKeydown = (e) => {
    if (e.key === 'Enter') {
      const chatInput = e.target.closest('#chat-msg-input');
      if (chatInput && unit.contains(chatInput)) {
        e.preventDefault();
        submitChatMessage(unit, chatInput, stateStore, cleanups);
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

  if (archetype === 'blog') bindBlogProgress(rootEl, unit, cleanups);
  if (archetype === 'media' && !reduce) bindMediaSpectrum(unit, stateStore, cleanups);
  if (archetype === 'dashboard') captureDashRows(unit, stateStore);

  runtimeMap.set(rootEl, { cleanups, stateStore });
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
  clearTimeout(toast._hide);
  toast._hide = setTimeout(() => toast.classList.remove('show'), 1600);
}

function pulseClass(el, className, ms = 420) {
  if (!el) return;
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
  clearTimeout(el._pulse);
  el._pulse = setTimeout(() => el.classList.remove(className), ms);
}

// Action Router
function routeArchetypeAction(unit, trigger, action, msg, store, cleanups, evt) {
  // 1. GAME ACTIONS
  if (action === 'game-tap') {
    handleGameTap(unit, trigger, store, cleanups);
    return;
  }
  if (action === 'game-skill') {
    handleGameSkill(unit, trigger, store, cleanups);
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
    handleShopCheckout(unit, store);
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
    if (chatInput) submitChatMessage(unit, chatInput, store, cleanups);
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

function handleGameTap(unit, target, store, cleanups) {
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
      if (lvl) lvl.textContent = `LV. ${store.game.level}`;
      spawnLevelUpParticles(unit, cleanups);
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

function handleGameSkill(unit, btn, store, cleanups) {
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

  const timer = setTimeout(() => {
    btn.classList.remove('in-cooldown');
    if (cooldownOverlay) {
      cooldownOverlay.style.transition = 'none';
      cooldownOverlay.style.height = '0%';
    }
  }, 1500);
  cleanups.push(() => clearTimeout(timer));
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
  store.shop.cart.push({ qty: currentQty, price: store.shop.basePrice * currentQty });

  const totalItems = store.shop.cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = store.shop.cart.reduce((sum, item) => sum + item.price, 0);

  const badge = unit.querySelector('#shop-cart-badge');
  const drawerCount = unit.querySelector('#cart-drawer-count');
  const drawerTotal = unit.querySelector('#cart-drawer-total');
  const cartList = unit.querySelector('#cart-items-list');

  if (badge) badge.textContent = String(totalItems);
  if (drawerCount) drawerCount.textContent = String(totalItems);
  if (drawerTotal) drawerTotal.textContent = `₩${totalPrice.toLocaleString()}`;

  if (cartList) {
    cartList.innerHTML = store.shop.cart.map((item) => `
      <div class="cart-item-row">
        <span>에디션 디자인 상품 ${store.shop.selectedSize} (${item.qty}개)</span>
        <strong>₩${item.price.toLocaleString()}</strong>
      </div>
    `).join('');
  }

  synthAudio.playSfx('CART_ADD');
  unit.querySelector('#shop-cart-drawer')?.classList.add('open');
}

function handleShopCheckout(unit, store) {
  if (!store.shop.cart.length && store.shop.qty <= 0) {
    showMockToast(unit, '장바구니가 비어 있습니다.');
    return;
  }
  synthAudio.playSfx('SUCCESS');
  showMockToast(unit, '💳 결제가 성공적으로 시뮬레이션되었습니다! 감사합니다.');
  store.shop.cart = [];

  const badge = unit.querySelector('#shop-cart-badge');
  const drawerCount = unit.querySelector('#cart-drawer-count');
  const drawerTotal = unit.querySelector('#cart-drawer-total');
  const cartList = unit.querySelector('#cart-items-list');

  if (badge) badge.textContent = '0';
  if (drawerCount) drawerCount.textContent = '0';
  if (drawerTotal) drawerTotal.textContent = '₩0';
  if (cartList) cartList.innerHTML = '<p class="cart-empty-msg">장바구니가 비어 있습니다.</p>';

  unit.querySelector('#shop-cart-drawer')?.classList.remove('open');
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
  unit.classList.toggle('blog-light-mode', store.blog.isLightMode);
  synthAudio.playSfx('CLICK');
}

function submitBlogComment(unit, input, store) {
  const text = (input.value || '').trim();
  if (!text) return;

  const commentsList = unit.querySelector('#blog-comments-list');
  const countSpan = unit.querySelector('#blog-comment-count');

  if (commentsList) {
    const item = document.createElement('div');
    item.className = 'comment-item';
    
    const author = document.createElement('strong');
    author.textContent = '방문자 (You)';
    
    const p = document.createElement('p');
    p.textContent = text; // Safe textContent (FIN-F005)

    item.appendChild(author);
    item.appendChild(p);
    commentsList.insertBefore(item, commentsList.firstChild);
  }

  store.blog.comments.push(text);
  if (countSpan) countSpan.textContent = String(2 + store.blog.comments.length);

  input.value = '';
  synthAudio.playSfx('CONFIRM');
}

function submitChatMessage(unit, input, store, cleanups) {
  const text = (input.value || '').trim();
  if (!text) return;

  const container = unit.querySelector('#chat-messages-container');
  if (container) {
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-bubble-msg user';

    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.textContent = '🚀';

    const content = document.createElement('div');
    content.className = 'msg-content';

    const sender = document.createElement('span');
    sender.className = 'msg-sender';
    sender.textContent = 'You';

    const p = document.createElement('p');
    p.textContent = text; // Safe textContent

    content.appendChild(sender);
    content.appendChild(p);
    userMsg.appendChild(avatar);
    userMsg.appendChild(content);

    container.appendChild(userMsg);
    container.scrollTop = container.scrollHeight;
  }

  input.value = '';
  synthAudio.playSfx('CONFIRM');

  // Simulated AI response after 500ms
  const timer = setTimeout(() => {
    if (!container || !unit.isConnected) return;
    const botMsg = document.createElement('div');
    botMsg.className = 'chat-bubble-msg peer';

    const bAvatar = document.createElement('div');
    bAvatar.className = 'msg-avatar';
    bAvatar.textContent = '🤖';

    const bContent = document.createElement('div');
    bContent.className = 'msg-content';

    const bSender = document.createElement('span');
    bSender.className = 'msg-sender';
    bSender.textContent = 'Design AI Bot';

    const bP = document.createElement('p');
    bP.textContent = `"${text}"에 대한 테마 프리뷰가 실시간으로 반영되었습니다! 🎨`;

    bContent.appendChild(bSender);
    bContent.appendChild(bP);
    botMsg.appendChild(bAvatar);
    botMsg.appendChild(bContent);

    container.appendChild(botMsg);
    container.scrollTop = container.scrollHeight;
    synthAudio.playSfx('REVEAL');
  }, 500);

  cleanups.push(() => clearTimeout(timer));
}

function spawnLevelUpParticles(unit, cleanups) {
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
  const timer = setTimeout(() => layer.remove(), 900);
  if (cleanups) cleanups.push(() => { clearTimeout(timer); layer.remove(); });
}

function bindBlogProgress(scroller, unit, cleanups) {
  const fill = unit.querySelector('#blog-progress-fill');
  const onScroll = () => {
    const max = scroller.scrollHeight - scroller.clientHeight;
    const pct = max <= 0 ? 100 : Math.min(100, Math.max(0, (scroller.scrollTop / max) * 100));
    if (fill) fill.style.width = `${pct}%`;
  };
  scroller.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  cleanups.push(() => scroller.removeEventListener('scroll', onScroll));
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

function animateMeters(unit, cleanups) {
  const meters = unit.querySelectorAll('.meter-fill[data-meter-val]');
  meters.forEach((meter) => {
    const target = meter.getAttribute('data-meter-val') || '60%';
    meter.style.width = '0%';
    const timer = setTimeout(() => {
      meter.style.transition = 'width .8s cubic-bezier(0.4, 0, 0.2, 1)';
      meter.style.width = target;
    }, 120);
    cleanups.push(() => clearTimeout(timer));
  });
}
