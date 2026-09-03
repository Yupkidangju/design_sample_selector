/**
 * 8 Core Page Archetypes Semantic HTML Template Engine v2.2
 * Standardized semantic templates for Game, Web SaaS, Mobile, E-Commerce, Blog, Dashboard, Media, Chat.
 * Works with state-preserving renderer and theme switching (`[data-theme]`).
 */

import { renderPreviewComponent } from '../preview/componentEntry.js';
import { localizePreviewMarkup } from '../preview/localizeMarkup.js';
import { formatLocaleCopy } from '../i18n/format.js';
import { getLocaleCopy } from '../i18n/copy.js';

export function getArchetypeHTML(archetypeId, subDesign, options = {}) {
  const tab = options.tab || 'hero';
  const copy = options.snapshot?.copy || getLocaleCopy('ko');
  const t = (key, values) => formatLocaleCopy(copy, key, values);
  let html;

  switch (archetypeId) {
    case 'game':
      html = renderGameArchetype(subDesign, t);
      break;
    case 'web':
      html = renderWebArchetype(subDesign, tab, t, options.snapshot);
      break;
    case 'mobile':
      html = renderMobileArchetype(subDesign, t);
      break;
    case 'ecommerce':
      html = renderEcommerceArchetype(subDesign, t);
      break;
    case 'blog':
      html = renderBlogArchetype(subDesign, t);
      break;
    case 'dashboard':
      html = renderDashboardArchetype(subDesign, t);
      break;
    case 'media':
      html = renderMediaArchetype(subDesign, t);
      break;
    case 'chat':
      html = renderChatArchetype(subDesign, t);
      break;
    default:
      throw new RangeError('[PreviewState] Unknown archetype ID.');
  }
  return localizePreviewMarkup(html, {
    locale: options.snapshot?.locale,
    copy,
    design: subDesign
  });
}

// ==========================================================================
// Immutable Aesthetic Profiles for Category Differentiation (Task 5 Refactor)
// ==========================================================================
const AESTHETIC_PROFILES = Object.freeze({
  swiss: Object.freeze({
    game: Object.freeze({
      avatar: '✛',
      playerName: 'SYS_GRID_01',
      targetIcon: '🎯',
      noticeBadge: 'GRID SYSTEM 01',
      primaryMeter: 'ACC',
      secondaryMeter: 'SYNC',
      skills: Object.freeze(['✛', '■', '▲', '●'])
    }),
    mediaOverlay: 'swiss-tuner',
    vinylCenter: '●',
    chat: Object.freeze({ brandIcon: '📑', channel: 'swiss-log', peerAvatar: '✛', userAvatar: '■' })
  }),
  y2k: Object.freeze({
    game: Object.freeze({
      avatar: '👾',
      playerName: 'CYBER_HERO',
      targetIcon: '👾',
      noticeBadge: 'CYBER ARENA',
      primaryMeter: 'HP',
      secondaryMeter: 'MP',
      skills: Object.freeze(['★', '⚡', '💾', '🌈'])
    }),
    mediaOverlay: 'winamp-lcd',
    vinylCenter: '💿',
    chat: Object.freeze({ brandIcon: '📟', channel: 'msn-cyber', peerAvatar: '✨', userAvatar: '💖' })
  }),
  brutalism: Object.freeze({
    game: Object.freeze({
      avatar: '⬛',
      playerName: 'RAW_AGGRO',
      targetIcon: '💥',
      noticeBadge: 'RAW BATTLE',
      primaryMeter: 'HP',
      secondaryMeter: 'POW',
      skills: Object.freeze(['🥊', '🧱', '⚡', '💣'])
    }),
    mediaOverlay: 'brutalist-tag',
    vinylCenter: '⬛',
    chat: Object.freeze({ brandIcon: '📢', channel: 'brutal-zine', peerAvatar: '⬛', userAvatar: '🥊' })
  }),
  hypertech: Object.freeze({
    game: Object.freeze({
      avatar: '💠',
      playerName: 'OPERATOR',
      targetIcon: '👁️',
      noticeBadge: 'TACTICAL SYS',
      primaryMeter: 'SHD',
      secondaryMeter: 'ENG',
      skills: Object.freeze(['⚡', '🛡️', '🎯', '💫'])
    }),
    mediaOverlay: 'hypertech-telemetry',
    vinylCenter: '🎵',
    chat: Object.freeze({ brandIcon: '🔒', channel: 'secure-uplink', peerAvatar: '🎨', userAvatar: '🚀' })
  })
});

const DEFAULT_AESTHETIC_PROFILE = Object.freeze({
  game: Object.freeze({
    avatar: '🎮',
    playerName: 'PLAYER_01',
    targetIcon: '👾',
    noticeBadge: 'ARENA BATTLE',
    primaryMeter: 'HP',
    secondaryMeter: 'MP',
    skills: Object.freeze(['🗡️', '🛡️', '🧪', '💥'])
  }),
  mediaOverlay: null,
  vinylCenter: '🎵',
  chat: Object.freeze({ brandIcon: '💬', channel: 'general-chat', peerAvatar: '🎨', userAvatar: '🚀' })
});

function getAestheticProfile(categoryId) {
  if (typeof categoryId === 'string' && Object.hasOwn(AESTHETIC_PROFILES, categoryId)) {
    return AESTHETIC_PROFILES[categoryId];
  }
  return DEFAULT_AESTHETIC_PROFILE;
}

function renderMediaGenreOverlay(overlayType) {
  if (overlayType === 'swiss-tuner') {
    return `
      <div class="swiss-tuner-scale" aria-hidden="true">
        <span>88</span><span>92</span><span>96</span><span>100</span><span>104</span><span>108 MHz</span>
      </div>
    `;
  }
  if (overlayType === 'winamp-lcd') {
    return `
      <div class="winamp-lcd-display" aria-hidden="true">
        <span class="lcd-kbps">320 KBPS</span>
        <span class="lcd-khz">44.1 KHZ</span>
        <span class="lcd-stereo">STEREO</span>
      </div>
    `;
  }
  if (overlayType === 'brutalist-tag') {
    return `
      <div class="brutalist-tape-tag" aria-hidden="true">
        <span>TAPE DECK A // 120µs EQ</span>
      </div>
    `;
  }
  if (overlayType === 'hypertech-telemetry') {
    return `
      <div class="hypertech-telemetry" aria-hidden="true">
        <span>QUANTUM CH-01</span>
        <span>96.4 kHz</span>
        <span>LOSSLESS</span>
      </div>
    `;
  }
  return '';
}

function escapeText(val) {
  return String(val ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(val) {
  return String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// 1. GAME HUD & ARENA ARCHETYPE
function renderGameArchetype(subDesign, t) {
  const name = escapeText(subDesign?.name || 'Style Arcade');
  const rawCat = subDesign?.categoryId || 'general';
  const category = escapeAttr(rawCat);
  const profile = getAestheticProfile(rawCat);
  const { avatar, playerName, targetIcon, noticeBadge, primaryMeter, secondaryMeter, skills } = profile.game;

  return `
    <div class="archetype-unit archetype-game" data-archetype="game" data-category="${category}" data-tweak-surface>
      <!-- Game Top HUD -->
      <header class="game-hud-header">
        <div class="hud-player-info">
          <div class="hud-avatar">${avatar}</div>
          <div class="hud-player-text">
            <span class="hud-player-name">${playerName}</span>
            <span class="hud-player-level">LV. 42 ${name}</span>
          </div>
        </div>

        <div class="hud-meters">
          <div class="meter-bar hp-meter">
            <span class="meter-label">${primaryMeter}</span>
            <div class="meter-track"><div class="meter-fill hp-fill" style="width: 82%;"></div></div>
            <span class="meter-val hp-val">820 / 1000</span>
          </div>
          <div class="meter-bar mp-meter">
            <span class="meter-label">${secondaryMeter}</span>
            <div class="meter-track"><div class="meter-fill mp-fill" style="width: 65%;"></div></div>
            <span class="meter-val mp-val">650 / 1000</span>
          </div>
        </div>

        <div class="hud-stats">
          <div class="stat-badge">
            <span class="stat-icon">🪙</span>
            <span class="stat-val stat-coins" id="game-coin-count">1,420</span>
          </div>
          <div class="stat-badge">
            <span class="stat-icon">⚡</span>
            <span class="stat-val stat-combo" id="game-combo-mult">x3.2</span>
          </div>
        </div>
      </header>

      <!-- Game Battle / Action Arena -->
      <main class="game-arena-board">
        <div class="arena-target-zone" id="arena-target-zone">
          <div class="arena-target" id="game-target" data-action="game-tap" data-mock-action="game-tap" role="button" tabindex="0">
            <span class="target-glow"></span>
            <span class="target-icon">${targetIcon}</span>
            <span class="target-hp-bar"><span class="target-hp-fill" style="width: 100%;"></span></span>
          </div>
        </div>
        <div class="arena-notice">
          <span class="notice-badge">${noticeBadge}</span>
          <p>${t('archetype.game.instructions')}</p>
        </div>
      </main>

      <!-- Game Action Bar & Skills -->
      <footer class="game-action-bar">
        <div class="skill-slots">
          <button class="skill-btn" data-action="game-skill" data-skill="q" title="Strike (Q)">
            <span class="skill-key">Q</span>
            <span class="skill-icon">${skills[0]}</span>
            <span class="skill-cooldown"></span>
          </button>
          <button class="skill-btn" data-action="game-skill" data-skill="w" title="Shield (W)">
            <span class="skill-key">W</span>
            <span class="skill-icon">${skills[1]}</span>
            <span class="skill-cooldown"></span>
          </button>
          <button class="skill-btn" data-action="game-skill" data-skill="e" title="Heal (E)">
            <span class="skill-key">E</span>
            <span class="skill-icon">${skills[2]}</span>
            <span class="skill-cooldown"></span>
          </button>
          <button class="skill-btn skill-ultimate" data-action="game-skill" data-skill="r" title="Hyper Rush (R)">
            <span class="skill-key">R</span>
            <span class="skill-icon">${skills[3]}</span>
            <span class="skill-cooldown"></span>
          </button>
        </div>

        <div class="game-controls">
          <button class="game-cta-btn" data-action="game-boost" data-mock-action="game-boost">
            <span>🚀 ${t('archetype.game.boost')}</span>
          </button>
        </div>
      </footer>
    </div>
  `;
}

// 2. WEB SAAS & LANDING ARCHETYPE (Integrates 4 Component Tabs)
function renderWebArchetype(subDesign, activeTab = 'hero', t, snapshot) {
  const name = escapeText(subDesign?.name || 'Web SaaS');
  const componentHTML = renderPreviewComponent({
    rendererId: subDesign.previewType,
    tab: activeTab,
    design: subDesign,
    snapshot
  });

  return `
    <div class="archetype-unit archetype-web" data-archetype="web" data-tweak-surface>
      <!-- SaaS Top Nav -->
      <header class="web-nav-header">
        <div class="web-logo">
          <span class="logo-mark">◆</span>
          <span class="logo-text">${name} Studio</span>
        </div>
        <div class="web-nav-links">
          <span class="nav-item active">${t('archetype.web.product')}</span>
          <span class="nav-item">${t('archetype.web.solutions')}</span>
          <span class="nav-item">${t('archetype.web.pricing')}</span>
          <span class="nav-item">${t('archetype.web.docs')}</span>
        </div>
        <div class="web-nav-actions">
          <button class="web-btn-subtle" data-action="web-login">${t('archetype.web.signIn')}</button>
          <button class="web-btn-primary" data-action="web-cta">${t('archetype.web.getStarted')}</button>
        </div>
      </header>

      <!-- Sub-Tab Content Viewport -->
      <div class="web-component-container">
        ${componentHTML}
      </div>
    </div>
  `;
}

// 3. MOBILE APP ARCHETYPE
function renderMobileArchetype(subDesign, t) {
  const name = escapeText(subDesign?.name || 'App Core');
  return `
    <div class="archetype-unit archetype-mobile" data-archetype="mobile" data-tweak-surface>
      <div class="mobile-frame">
        <!-- Status Bar -->
        <div class="mobile-status-bar">
          <span class="mobile-time">09:41</span>
          <div class="mobile-notch"></div>
          <div class="mobile-status-icons">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        <!-- App Header -->
        <header class="mobile-app-header">
          <div class="mobile-profile-strip">
            <div class="mobile-avatar">👤</div>
            <div class="mobile-greeting">
              <span class="greet-sub">${t('archetype.mobile.welcome')}</span>
              <span class="greet-name">Alex Designer</span>
            </div>
          </div>
          <button class="mobile-icon-btn" data-action="mobile-bell" aria-label="${t('archetype.mobile.notifications')}">
            <span>🔔</span>
            <span class="mobile-notif-dot"></span>
          </button>
        </header>

        <!-- Notification Banner / Swipeable -->
        <div class="mobile-notif-card" id="mobile-notif-card">
          <span class="notif-badge">${t('archetype.mobile.update')}</span>
          <div class="notif-body">
            <strong>${t('archetype.mobile.activated', { name })}</strong>
            <p>${t('archetype.mobile.test')}</p>
          </div>
          <button class="notif-close-btn" data-action="mobile-swipe" title="${t('archetype.mobile.close')}">✕</button>
        </div>

        <!-- Scrollable Feed -->
        <div class="mobile-feed-container">
          <div class="mobile-feature-card">
            <div class="feature-tag">${t('archetype.mobile.trending')}</div>
            <h3>${name}</h3>
            <p>${escapeText(subDesign.shortDesc)}</p>
            <div class="feature-action-row">
              <button class="mobile-card-btn" data-action="mobile-explore">${t('archetype.mobile.explore')}</button>
              <button class="mobile-like-btn" data-action="mobile-like">
                <span class="like-heart">❤️</span>
                <span class="like-count">248</span>
              </button>
            </div>
          </div>

          <div class="mobile-toggle-card">
            <div class="toggle-info">
              <span class="toggle-title">${t('archetype.mobile.soundTitle')}</span>
              <span class="toggle-desc">${t('archetype.mobile.soundDescription')}</span>
            </div>
            <label class="mobile-switch">
              <input type="checkbox" checked data-action="mobile-toggle">
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <!-- Bottom Navigation Bar -->
        <nav class="mobile-bottom-nav">
          <button class="mobile-tab-btn active" data-action="mobile-tab" data-tab="home">
            <span class="tab-icon">🏠</span>
            <span class="tab-label">${t('archetype.mobile.home')}</span>
          </button>
          <button class="mobile-tab-btn" data-action="mobile-tab" data-tab="explore">
            <span class="tab-icon">🧭</span>
            <span class="tab-label">${t('archetype.mobile.explore')}</span>
          </button>
          <button class="mobile-tab-btn" data-action="mobile-tab" data-tab="activity">
            <span class="tab-icon">⚡</span>
            <span class="tab-label">${t('archetype.mobile.activity')}</span>
          </button>
          <button class="mobile-tab-btn" data-action="mobile-tab" data-tab="profile">
            <span class="tab-icon">⚙️</span>
            <span class="tab-label">${t('archetype.mobile.settings')}</span>
          </button>
        </nav>
      </div>
    </div>
  `;
}

// 4. E-COMMERCE STOREFRONT ARCHETYPE
function renderEcommerceArchetype(subDesign, t) {
  const name = escapeText(subDesign?.name || 'Design Product');
  return `
    <div class="archetype-unit archetype-ecommerce" data-archetype="ecommerce" data-tweak-surface>
      <!-- Store Header -->
      <header class="shop-header">
        <div class="shop-brand">
          <span class="shop-logo">🛍️</span>
          <span class="shop-title">${name} Boutique</span>
        </div>
        <div class="shop-cart-widget" data-action="shop-cart-open">
          <button class="cart-trigger-btn">
            <span class="cart-icon">🛒</span>
            <span class="cart-count" id="shop-cart-badge">0</span>
          </button>
        </div>
      </header>

      <!-- Main Product Grid -->
      <div class="shop-product-layout">
        <div class="product-gallery">
          <div class="product-main-visual" id="product-visual">
            <div class="product-artwork-box">
              <span class="artwork-icon">✨</span>
              <span class="artwork-label">${name}</span>
            </div>
          </div>
        </div>

        <div class="product-details">
          <span class="product-category">${t('archetype.shop.limited')}</span>
          <h2 class="product-title">${t('archetype.shop.edition', { name })}</h2>
          <div class="product-rating">
            <span class="stars">★★★★★</span>
            <span class="rating-val">4.9 (128 ${t('archetype.shop.reviews')})</span>
          </div>

          <div class="product-price-box">
            <span class="price-currency">₩</span>
            <span class="price-val" id="product-total-price">89,000</span>
            <span class="price-badge">${t('archetype.shop.shipping')}</span>
          </div>

          <p class="product-desc">${escapeText(subDesign.shortDesc)}</p>

          <!-- Color Option Selector -->
          <div class="option-section">
            <label class="option-label">${t('archetype.shop.color')}</label>
            <div class="color-chips">
              ${subDesign.palette.map((c, i) => `
                <button class="color-chip-btn ${i === 0 ? 'active' : ''}"
                        data-action="shop-color"
                        data-color="${escapeAttr(c.hex)}"
                        data-name="${escapeAttr(c.id)}"
                        style="background: ${escapeAttr(c.hex)};"
                        aria-label="${escapeAttr(c.name)} (${escapeAttr(c.hex)})"
                        title="${escapeAttr(c.name)} (${escapeAttr(c.hex)})">
                </button>
              `).join('')}
            </div>
          </div>

          <div class="option-section">
            <label class="option-label">${t('archetype.shop.size')}</label>
            <div class="size-chips">
              ${['XS', 'S', 'M', 'L', 'XL'].map((sz) => `
                <button class="size-chip-btn ${sz === 'M' ? 'active' : ''}" data-action="shop-size" data-size="${sz}">${sz}</button>
              `).join('')}
            </div>
          </div>

          <!-- Quantity Stepper & Actions -->
          <div class="purchase-controls">
            <div class="quantity-stepper">
              <button class="step-btn" data-action="shop-qty-dec">-</button>
              <span class="qty-display" id="shop-qty-val">1</span>
              <button class="step-btn" data-action="shop-qty-inc">+</button>
            </div>

            <button class="add-to-cart-btn" data-action="cart-add">
              <span>🛒 ${t('archetype.shop.addCart')}</span>
            </button>

            <button class="instant-buy-btn" data-action="shop-checkout" data-checkout-source="direct">
              <span>${t('archetype.shop.buyNow')}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Slide-out Cart Drawer Simulation -->
      <aside class="shop-cart-drawer" id="shop-cart-drawer">
        <div class="cart-drawer-header">
          <h3>${t('archetype.shop.cart')} (<span id="cart-drawer-count">0</span>)</h3>
          <button class="drawer-close-btn" data-action="shop-cart-close">✕</button>
        </div>
        <div class="cart-items-list" id="cart-items-list">
          <p class="cart-empty-msg">${t('archetype.shop.empty')}</p>
        </div>
        <div class="cart-drawer-footer">
          <div class="cart-total-row">
            <span>${t('archetype.shop.total')}</span>
            <strong id="cart-drawer-total">₩0</strong>
          </div>
          <button class="cart-checkout-btn" data-action="shop-checkout" data-checkout-source="cart" disabled aria-disabled="true">${t('archetype.shop.checkout')}</button>
        </div>
      </aside>
    </div>
  `;
}

// 5. BLOG & MAGAZINE ARCHETYPE
function renderBlogArchetype(subDesign, t) {
  const name = escapeText(subDesign?.name || 'Design Review');
  return `
    <div class="archetype-unit archetype-blog" data-archetype="blog" data-tweak-surface>
      <!-- Reading Progress Indicator -->
      <div class="blog-progress-track" id="blog-progress-track" role="progressbar" aria-label="${t('archetype.blog.progress')}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
        <div class="blog-progress-fill" id="blog-progress-fill" style="width: 0%;"></div>
      </div>

      <!-- Article Header -->
      <header class="blog-article-header">
        <div class="blog-meta-tags">
          <span class="blog-tag">${t('archetype.blog.archive')}</span>
          <span class="blog-read-time">⏱️ ${t('archetype.blog.readTime')}</span>
        </div>
        <h1 class="blog-title">${name}: ${t('archetype.blog.titleSuffix')}</h1>
        <p class="blog-lead">${escapeText(subDesign.shortDesc)}</p>
        
        <div class="blog-author-bar">
          <div class="author-info">
            <div class="author-avatar">✍️</div>
            <div>
              <span class="author-name">${t('archetype.blog.author')}</span>
              <span class="author-date">${t('archetype.blog.published')}</span>
            </div>
          </div>

          <div class="blog-actions-bar">
            <button class="blog-action-btn" data-action="blog-reading-mode" aria-pressed="false" aria-label="${t('archetype.blog.readingModeAria')}" title="${t('archetype.blog.readingModeTitle')}">
              <span class="mode-icon">🌓</span>
              <span>${t('archetype.blog.mode')}</span>
            </button>
            <button class="blog-like-btn" data-action="blog-like">
              <span class="heart-icon">👏</span>
              <span class="blog-like-count" id="blog-clap-count">42</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Article Content Body -->
      <article class="blog-body" id="blog-content-body">
        <nav class="blog-toc" aria-label="${t('archetype.blog.toc')}">
          <span class="toc-label">${t('archetype.blog.toc')}</span>
          <button class="toc-link" data-action="blog-toc" data-target="blog-sec-summary">${t('archetype.blog.summary')}</button>
          <button class="toc-link" data-action="blog-toc" data-target="blog-sec-body">${t('archetype.blog.body')}</button>
          <button class="toc-link" data-action="blog-toc" data-target="blog-comments-section">${t('archetype.blog.comments')}</button>
        </nav>

        <div class="blog-callout" id="blog-sec-summary">
          <strong>${t('archetype.blog.summaryTitle')}</strong>
          <ul>
            ${subDesign.characteristics.slice(0, 3).map(c => `<li>${escapeText(c)}</li>`).join('')}
          </ul>
        </div>

        <div id="blog-sec-body">
          <p>${t('archetype.blog.paragraph1', { name })}</p>
          <p>${t('archetype.blog.paragraph2')}</p>
          <p>${t('archetype.blog.paragraph3')}</p>
        </div>

        <!-- Interactive Comments Simulation -->
        <section class="blog-comments-section" id="blog-comments-section">
          <h3>${t('archetype.blog.commentsTitle')} (<span id="blog-comment-count">2</span>)</h3>
          
          <div class="comment-input-box">
            <input type="text" class="comment-input" id="blog-comment-input" maxlength="500" aria-describedby="blog-comment-status" placeholder="${t('archetype.blog.commentPlaceholder')}" />
            <button class="comment-submit-btn" data-action="blog-comment-submit">${t('archetype.blog.submit')}</button>
          </div>
          <span id="blog-comment-status" role="status" aria-live="polite"></span>

          <div class="comments-list" id="blog-comments-list">
            <div class="comment-item">
              <strong>${t('archetype.blog.researcher')}</strong>
              <p>${t('archetype.blog.comment1', { name })}</p>
            </div>
            <div class="comment-item">
              <strong>${t('archetype.blog.engineer')}</strong>
              <p>${t('archetype.blog.comment2')}</p>
            </div>
          </div>
        </section>
      </article>
    </div>
  `;
}

// 6. ANALYTICS DASHBOARD ARCHETYPE
function renderDashboardArchetype(subDesign, t) {
  const name = escapeText(subDesign?.name || 'Analytics');
  return `
    <div class="archetype-unit archetype-dashboard" data-archetype="dashboard" data-tweak-surface>
      <!-- Dashboard Top Header -->
      <header class="dash-header">
        <div>
          <h2 class="dash-title">${name} ${t('archetype.dashboard.titleSuffix')}</h2>
          <span class="dash-subtitle">${t('archetype.dashboard.subtitle')}</span>
        </div>

        <div class="dash-period-filters">
          <button class="period-btn active" data-action="dash-period" data-period="1D">1D</button>
          <button class="period-btn" data-action="dash-period" data-period="1W">1W</button>
          <button class="period-btn" data-action="dash-period" data-period="1M">1M</button>
          <button class="period-btn" data-action="dash-period" data-period="1Y">1Y</button>
        </div>
      </header>

      <!-- KPI Metrics Grid -->
      <div class="dash-metrics-grid">
        <div class="metric-card">
          <span class="metric-title">${t('archetype.dashboard.revenue')}</span>
          <div class="metric-val" id="metric-rev">₩42,850,000</div>
          <span class="metric-trend up">+14.8% ${t('archetype.dashboard.lastWeek')}</span>
        </div>
        <div class="metric-card">
          <span class="metric-title">${t('archetype.dashboard.users')}</span>
          <div class="metric-val" id="metric-users">18,420</div>
          <span class="metric-trend up">+8.2%</span>
        </div>
        <div class="metric-card">
          <span class="metric-title">${t('archetype.dashboard.conversion')}</span>
          <div class="metric-val" id="metric-cr">4.62%</div>
          <span class="metric-trend up">+0.4%</span>
        </div>
        <div class="metric-card">
          <span class="metric-title">${t('archetype.dashboard.latency')}</span>
          <div class="metric-val" id="metric-lat">24ms</div>
          <span class="metric-trend good">${t('archetype.dashboard.optimal')}</span>
        </div>
      </div>

      <!-- Data Table Section -->
      <div class="dash-table-wrapper">
        <div class="table-header-row">
          <span>${t('archetype.dashboard.recent')}</span>
          <div class="table-tools">
            <input type="search" class="table-filter-input" data-action="dash-filter" placeholder="${t('archetype.dashboard.filterPlaceholder')}" aria-label="${t('archetype.dashboard.filter')}" />
            <button class="table-refresh-btn" data-action="dash-refresh">🔄 ${t('archetype.dashboard.refresh')}</button>
          </div>
        </div>
        <table class="dash-table">
          <thead>
            <tr>
              <th><button class="dash-sort-btn" data-action="dash-sort" data-sort="id">ID</button></th>
              <th><button class="dash-sort-btn" data-action="dash-sort" data-sort="project">${t('archetype.dashboard.project')}</button></th>
              <th><button class="dash-sort-btn" data-action="dash-sort" data-sort="status">${t('archetype.dashboard.status')}</button></th>
              <th><button class="dash-sort-btn" data-action="dash-sort" data-sort="spend">${t('archetype.dashboard.spend')}</button></th>
              <th><button class="dash-sort-btn" data-action="dash-sort" data-sort="time">${t('archetype.dashboard.time')}</button></th>
            </tr>
          </thead>
          <tbody id="dash-table-body">
            <tr>
              <td>#TRX-8901</td>
              <td>${name}</td>
              <td><span class="status-badge success">${t('archetype.dashboard.completed')}</span></td>
              <td>₩1,250,000</td>
              <td>${t('archetype.dashboard.justNow')}</td>
            </tr>
            <tr>
              <td>#TRX-8902</td>
              <td>Global Web App</td>
              <td><span class="status-badge success">${t('archetype.dashboard.completed')}</span></td>
              <td>₩890,000</td>
              <td>${t('archetype.dashboard.minutesAgo', { count: 12 })}</td>
            </tr>
            <tr>
              <td>#TRX-8903</td>
              <td>Mobile Archetype SDK</td>
              <td><span class="status-badge pending">${t('archetype.dashboard.processing')}</span></td>
              <td>₩3,400,000</td>
              <td>${t('archetype.dashboard.minutesAgo', { count: 45 })}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 7. MEDIA PLAYER ARCHETYPE
function renderMediaArchetype(subDesign, t) {
  const name = escapeText(subDesign?.name || 'Soundscape');
  const rawCat = subDesign?.categoryId || 'general';
  const category = escapeAttr(rawCat);
  const profile = getAestheticProfile(rawCat);
  const genreOverlay = renderMediaGenreOverlay(profile.mediaOverlay);

  return `
    <div class="archetype-unit archetype-media" data-archetype="media" data-category="${category}" data-tweak-surface>
      <div class="media-player-card">
        ${genreOverlay}
        <!-- Artwork Showcase -->
        <div class="media-artwork-zone">
          <div class="vinyl-disc" id="media-vinyl">
            <div class="vinyl-center">${profile.vinylCenter}</div>
          </div>
        </div>

        <!-- Track Info -->
        <div class="media-track-info">
          <h2 class="track-title" id="media-track-name">${name} Harmonics</h2>
          <span class="track-artist">${t('archetype.media.artist')}</span>
        </div>

        <!-- Progress Scrubber -->
        <div class="media-scrubber">
          <span class="scrub-time" id="media-cur-time">01:24</span>
          <div class="scrub-track" data-action="media-scrub">
            <div class="scrub-fill" style="width: 45%;"></div>
          </div>
          <span class="scrub-time">03:40</span>
        </div>

        <div class="media-spectrum" id="media-spectrum" aria-hidden="true">
          ${Array.from({ length: 16 }, () => '<span class="spec-bar"></span>').join('')}
        </div>

        <!-- Media Controls -->
        <div class="media-controls-row">
          <button class="media-btn" data-action="media-prev" title="${t('archetype.media.previous')}">⏮️</button>
          <button class="media-btn media-play-btn" data-action="media-play" title="${t('archetype.media.playPause')}">
            <span class="play-icon">❚❚</span>
          </button>
          <button class="media-btn" data-action="media-next" title="${t('archetype.media.next')}">⏭️</button>
        </div>

        <div class="media-volume-row">
          <span class="vol-icon">🔊</span>
          <input type="range" min="0" max="1" step="0.05" value="0.7" class="media-volume-slider" data-action="media-volume" aria-label="${t('archetype.media.volume')}" />
          <span id="media-vol-val">70%</span>
        </div>

        <!-- Playlist Queue -->
        <div class="media-queue-list">
          <button class="queue-item active" data-action="media-queue" data-track="0">
            <span>01. ${name}</span>
            <span>03:40</span>
          </button>
          <button class="queue-item" data-action="media-queue" data-track="1">
            <span>02. Ambient Prism</span>
            <span>04:12</span>
          </button>
          <button class="queue-item" data-action="media-queue" data-track="2">
            <span>03. Synthetic Horizon</span>
            <span>02:55</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

// 8. CHAT & MESSENGER ARCHETYPE
function renderChatArchetype(subDesign, t) {
  const name = escapeText(subDesign?.name || 'Design Channel');
  const rawCat = subDesign?.categoryId || 'general';
  const category = escapeAttr(rawCat);
  const profile = getAestheticProfile(rawCat);
  const { brandIcon, channel: mainChannel, peerAvatar, userAvatar } = profile.chat;

  return `
    <div class="archetype-unit archetype-chat" data-archetype="chat" data-category="${category}" data-tweak-surface>
      <!-- Channels Sidebar -->
      <aside class="chat-sidebar">
        <div class="chat-brand">
          <span>${brandIcon}</span>
          <strong>${name}</strong>
        </div>
        <div class="chat-channels">
          <button class="channel-item active" data-action="chat-channel" data-channel="${mainChannel}"># ${mainChannel}</button>
          <button class="channel-item" data-action="chat-channel" data-channel="design-feedback"># design-feedback</button>
          <button class="channel-item" data-action="chat-channel" data-channel="tech-spec"># tech-spec</button>
          <button class="channel-item" data-action="chat-channel" data-channel="audio-engine"># audio-engine</button>
        </div>
      </aside>

      <!-- Main Chat Stream -->
      <section class="chat-main-stream">
        <header class="chat-header">
          <span class="chat-topic"># ${mainChannel}</span>
          <span class="chat-members">👥 ${t('archetype.chat.members')}</span>
        </header>

        <div class="chat-messages-container" id="chat-messages-container">
          <div class="chat-bubble-msg peer">
            <div class="msg-avatar">${peerAvatar || '🎨'}</div>
            <div class="msg-content">
              <span class="msg-sender">${t('archetype.chat.lead')}</span>
              <p>${t('archetype.chat.message1', { name })}</p>
              <div class="msg-reactions">
                <button class="reaction-btn" data-action="chat-react">👍 8</button>
                <button class="reaction-btn" data-action="chat-react">✨ 14</button>
              </div>
            </div>
          </div>

          <div class="chat-bubble-msg user">
            <div class="msg-avatar">${userAvatar || '🚀'}</div>
            <div class="msg-content">
              <span class="msg-sender">${t('archetype.chat.you')}</span>
              <p>${t('archetype.chat.message2')}</p>
            </div>
          </div>
        </div>

        <!-- Chat Input Form -->
        <div class="chat-input-bar">
          <input type="text" class="chat-input" id="chat-msg-input" maxlength="500" aria-describedby="chat-message-status" placeholder="${t('archetype.chat.placeholder')}" />
          <button class="chat-send-btn" data-action="chat-send">${t('archetype.chat.send')}</button>
        </div>
        <span id="chat-message-status" role="status" aria-live="polite"></span>
      </section>
    </div>
  `;
}
