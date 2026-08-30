/**
 * 8 Core Page Archetypes Semantic HTML Template Engine v2.2
 * Standardized semantic templates for Game, Web SaaS, Mobile, E-Commerce, Blog, Dashboard, Media, Chat.
 * Works seamlessly with Zero-Rebuild Dynamic Theme Injection (`[data-theme]`).
 */

import { renderPreviewComponent } from '../preview/componentEntry.js';

export function getArchetypeHTML(archetypeId, subDesign, options = {}) {
  const tab = options.tab || 'hero';

  switch (archetypeId) {
    case 'game':
      return renderGameArchetype(subDesign);
    case 'web':
      return renderWebArchetype(subDesign, tab);
    case 'mobile':
      return renderMobileArchetype(subDesign);
    case 'ecommerce':
      return renderEcommerceArchetype(subDesign);
    case 'blog':
      return renderBlogArchetype(subDesign);
    case 'dashboard':
      return renderDashboardArchetype(subDesign);
    case 'media':
      return renderMediaArchetype(subDesign);
    case 'chat':
      return renderChatArchetype(subDesign);
    default:
      return renderGameArchetype(subDesign);
  }
}

// 1. GAME HUD & ARENA ARCHETYPE
function renderGameArchetype(subDesign) {
  const name = subDesign?.name || 'Style Arcade';
  return `
    <div class="archetype-unit archetype-game" data-archetype="game">
      <!-- Game Top HUD -->
      <header class="game-hud-header">
        <div class="hud-player-info">
          <div class="hud-avatar">🎮</div>
          <div class="hud-player-text">
            <span class="hud-player-name">PLAYER_01</span>
            <span class="hud-player-level">LV. 42 ${name}</span>
          </div>
        </div>

        <div class="hud-meters">
          <div class="meter-bar hp-meter">
            <span class="meter-label">HP</span>
            <div class="meter-track"><div class="meter-fill hp-fill" style="width: 82%;"></div></div>
            <span class="meter-val hp-val">820 / 1000</span>
          </div>
          <div class="meter-bar mp-meter">
            <span class="meter-label">MP</span>
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
            <span class="target-icon">👾</span>
            <span class="target-hp-bar"><span class="target-hp-fill" style="width: 100%;"></span></span>
          </div>
        </div>
        <div class="arena-notice">
          <span class="notice-badge">ARENA BATTLE</span>
          <p>몬스터를 클릭하여 공격하고 콤보와 코인을 획득하세요!</p>
        </div>
      </main>

      <!-- Game Action Bar & Skills -->
      <footer class="game-action-bar">
        <div class="skill-slots">
          <button class="skill-btn" data-action="game-skill" data-skill="q" title="Strike (Q)">
            <span class="skill-key">Q</span>
            <span class="skill-icon">🗡️</span>
            <span class="skill-cooldown"></span>
          </button>
          <button class="skill-btn" data-action="game-skill" data-skill="w" title="Shield (W)">
            <span class="skill-key">W</span>
            <span class="skill-icon">🛡️</span>
            <span class="skill-cooldown"></span>
          </button>
          <button class="skill-btn" data-action="game-skill" data-skill="e" title="Heal (E)">
            <span class="skill-key">E</span>
            <span class="skill-icon">🧪</span>
            <span class="skill-cooldown"></span>
          </button>
          <button class="skill-btn skill-ultimate" data-action="game-skill" data-skill="r" title="Hyper Rush (R)">
            <span class="skill-key">R</span>
            <span class="skill-icon">💥</span>
            <span class="skill-cooldown"></span>
          </button>
        </div>

        <div class="game-controls">
          <button class="game-cta-btn" data-action="game-boost" data-mock-action="game-boost">
            <span>🚀 콤보 부스터</span>
          </button>
        </div>
      </footer>
    </div>
  `;
}

// 2. WEB SAAS & LANDING ARCHETYPE (Integrates 4 Component Tabs)
function renderWebArchetype(subDesign, activeTab = 'hero') {
  const name = subDesign?.name || 'Web SaaS';
  const componentHTML = renderPreviewComponent({
    rendererId: subDesign.previewType,
    tab: activeTab,
    design: subDesign
  });

  return `
    <div class="archetype-unit archetype-web" data-archetype="web">
      <!-- SaaS Top Nav -->
      <header class="web-nav-header">
        <div class="web-logo">
          <span class="logo-mark">◆</span>
          <span class="logo-text">${name} Studio</span>
        </div>
        <div class="web-nav-links">
          <span class="nav-item active">Product</span>
          <span class="nav-item">Solutions</span>
          <span class="nav-item">Pricing</span>
          <span class="nav-item">Docs</span>
        </div>
        <div class="web-nav-actions">
          <button class="web-btn-subtle" data-action="web-login">Sign In</button>
          <button class="web-btn-primary" data-action="web-cta">Get Started Free →</button>
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
function renderMobileArchetype(subDesign) {
  const name = subDesign?.name || 'App Core';
  return `
    <div class="archetype-unit archetype-mobile" data-archetype="mobile">
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
              <span class="greet-sub">Welcome back,</span>
              <span class="greet-name">Alex Designer</span>
            </div>
          </div>
          <button class="mobile-icon-btn" data-action="mobile-bell" aria-label="Notifications">
            <span>🔔</span>
            <span class="mobile-notif-dot"></span>
          </button>
        </header>

        <!-- Notification Banner / Swipeable -->
        <div class="mobile-notif-card" id="mobile-notif-card">
          <span class="notif-badge">NEW UPDATE</span>
          <div class="notif-body">
            <strong>${name} 시스템이 활성화되었습니다</strong>
            <p>실시간 인터랙션을 직접 테스트해보세요.</p>
          </div>
          <button class="notif-close-btn" data-action="mobile-swipe" title="알림 닫기">✕</button>
        </div>

        <!-- Scrollable Feed -->
        <div class="mobile-feed-container">
          <div class="mobile-feature-card">
            <div class="feature-tag">TRENDING DESIGN</div>
            <h3>${subDesign.nameEn}</h3>
            <p>${subDesign.shortDesc}</p>
            <div class="feature-action-row">
              <button class="mobile-card-btn" data-action="mobile-explore">Explore Style</button>
              <button class="mobile-like-btn" data-action="mobile-like">
                <span class="like-heart">❤️</span>
                <span class="like-count">248</span>
              </button>
            </div>
          </div>

          <div class="mobile-toggle-card">
            <div class="toggle-info">
              <span class="toggle-title">실시간 사운드 연동</span>
              <span class="toggle-desc">모바일 액션 시 Web Audio SFX 출력</span>
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
            <span class="tab-label">Home</span>
          </button>
          <button class="mobile-tab-btn" data-action="mobile-tab" data-tab="explore">
            <span class="tab-icon">🧭</span>
            <span class="tab-label">Explore</span>
          </button>
          <button class="mobile-tab-btn" data-action="mobile-tab" data-tab="activity">
            <span class="tab-icon">⚡</span>
            <span class="tab-label">Activity</span>
          </button>
          <button class="mobile-tab-btn" data-action="mobile-tab" data-tab="profile">
            <span class="tab-icon">⚙️</span>
            <span class="tab-label">Settings</span>
          </button>
        </nav>
      </div>
    </div>
  `;
}

// 4. E-COMMERCE STOREFRONT ARCHETYPE
function renderEcommerceArchetype(subDesign) {
  const name = subDesign?.name || 'Design Product';
  return `
    <div class="archetype-unit archetype-ecommerce" data-archetype="ecommerce">
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
              <span class="artwork-label">${subDesign.nameEn}</span>
            </div>
          </div>
        </div>

        <div class="product-details">
          <span class="product-category">LIMITED EDITION COLLECTION</span>
          <h2 class="product-title">${subDesign.name} 에디션</h2>
          <div class="product-rating">
            <span class="stars">★★★★★</span>
            <span class="rating-val">4.9 (128 Reviews)</span>
          </div>

          <div class="product-price-box">
            <span class="price-currency">₩</span>
            <span class="price-val" id="product-total-price">89,000</span>
            <span class="price-badge">FREE SHIPPING</span>
          </div>

          <p class="product-desc">${subDesign.shortDesc}</p>

          <!-- Color Option Selector -->
          <div class="option-section">
            <label class="option-label">COLOR PALETTE</label>
            <div class="color-chips">
              ${subDesign.palette.map((c, i) => `
                <button class="color-chip-btn ${i === 0 ? 'active' : ''}" 
                        data-action="shop-color" 
                        data-color="${c.hex}" 
                        data-name="${c.name}"
                        style="background: ${c.hex};" 
                        title="${c.name} (${c.hex})">
                </button>
              `).join('')}
            </div>
          </div>

          <div class="option-section">
            <label class="option-label">SIZE</label>
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
              <span>🛒 장바구니 담기</span>
            </button>

            <button class="instant-buy-btn" data-action="shop-checkout">
              <span>바로 구매하기</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Slide-out Cart Drawer Simulation -->
      <aside class="shop-cart-drawer" id="shop-cart-drawer">
        <div class="cart-drawer-header">
          <h3>장바구니 (<span id="cart-drawer-count">0</span>)</h3>
          <button class="drawer-close-btn" data-action="shop-cart-close">✕</button>
        </div>
        <div class="cart-items-list" id="cart-items-list">
          <p class="cart-empty-msg">장바구니가 비어 있습니다.</p>
        </div>
        <div class="cart-drawer-footer">
          <div class="cart-total-row">
            <span>합계</span>
            <strong id="cart-drawer-total">₩0</strong>
          </div>
          <button class="cart-checkout-btn" data-action="shop-checkout">결제 진행하기 →</button>
        </div>
      </aside>
    </div>
  `;
}

// 5. BLOG & MAGAZINE ARCHETYPE
function renderBlogArchetype(subDesign) {
  const name = subDesign?.name || 'Design Review';
  return `
    <div class="archetype-unit archetype-blog" data-archetype="blog">
      <!-- Reading Progress Indicator -->
      <div class="blog-progress-track">
        <div class="blog-progress-fill" id="blog-progress-fill" style="width: 0%;"></div>
      </div>

      <!-- Article Header -->
      <header class="blog-article-header">
        <div class="blog-meta-tags">
          <span class="blog-tag">DESIGN ARCHIVE</span>
          <span class="blog-read-time">⏱️ 5 MIN READ</span>
        </div>
        <h1 class="blog-title">${subDesign.nameEn}: 시각 디자인의 새로운 지평</h1>
        <p class="blog-lead">${subDesign.shortDesc}</p>
        
        <div class="blog-author-bar">
          <div class="author-info">
            <div class="author-avatar">✍️</div>
            <div>
              <span class="author-name">Editorial Team</span>
              <span class="author-date">Published on 2026. 08. 25</span>
            </div>
          </div>

          <div class="blog-actions-bar">
            <button class="blog-action-btn" data-action="blog-reading-mode" title="읽기 모드 전환">
              <span class="mode-icon">🌓</span>
              <span>모드</span>
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
        <nav class="blog-toc" aria-label="목차">
          <span class="toc-label">목차</span>
          <button class="toc-link" data-action="blog-toc" data-target="blog-sec-summary">특징 요약</button>
          <button class="toc-link" data-action="blog-toc" data-target="blog-sec-body">본문</button>
          <button class="toc-link" data-action="blog-toc" data-target="blog-comments-section">댓글</button>
        </nav>

        <div class="blog-callout" id="blog-sec-summary">
          <strong>핵심 특징 요약</strong>
          <ul>
            ${subDesign.characteristics.slice(0, 3).map(c => `<li>${c}</li>`).join('')}
          </ul>
        </div>

        <div id="blog-sec-body">
          <p>현대 웹 디자인 생태계에서 <strong>${name}</strong>은 단순한 시각적 유행을 넘어 구조적 명확성과 사용자 인터랙션을 규정하는 핵심적인 역할을 수행합니다.</p>
          <p>엄격한 그리드 시스템과 감각적인 색채의 결합은 정보의 전달력을 극대화하며, 디지털 인터페이스의 사용성과 심미성을 동시에 만족시킵니다.</p>
          <p>스크롤하면 상단 진척 바가 따라가고, 목차 항목은 해당 섹션으로 이동합니다. 읽기 모드와 박수 카운터, 댓글 작성은 테마 전환 후에도 유지됩니다.</p>
        </div>

        <!-- Interactive Comments Simulation -->
        <section class="blog-comments-section" id="blog-comments-section">
          <h3>독자 의견 및 코멘트 (<span id="blog-comment-count">2</span>)</h3>
          
          <div class="comment-input-box">
            <input type="text" class="comment-input" id="blog-comment-input" placeholder="생각을 남겨보세요..." />
            <button class="comment-submit-btn" data-action="blog-comment-submit">등록</button>
          </div>

          <div class="comments-list" id="blog-comments-list">
            <div class="comment-item">
              <strong>디자인리서처</strong>
              <p>${subDesign.name} 테마가 정말 깔끔하게 적용되어 있네요!</p>
            </div>
            <div class="comment-item">
              <strong>UI엔지니어</strong>
              <p>동적 테마 주입이 매끄럽게 동작해서 비교하기 좋습니다.</p>
            </div>
          </div>
        </section>
      </article>
    </div>
  `;
}

// 6. ANALYTICS DASHBOARD ARCHETYPE
function renderDashboardArchetype(subDesign) {
  const name = subDesign?.name || 'Analytics';
  return `
    <div class="archetype-unit archetype-dashboard" data-archetype="dashboard">
      <!-- Dashboard Top Header -->
      <header class="dash-header">
        <div>
          <h2 class="dash-title">${name} Analytics Hub</h2>
          <span class="dash-subtitle">실시간 서비스 지표 및 퍼포먼스 모니터링</span>
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
          <span class="metric-title">총 매출 (Total Revenue)</span>
          <div class="metric-val" id="metric-rev">₩42,850,000</div>
          <span class="metric-trend up">+14.8% vs last week</span>
        </div>
        <div class="metric-card">
          <span class="metric-title">활성 사용자 (Active Users)</span>
          <div class="metric-val" id="metric-users">18,420</div>
          <span class="metric-trend up">+8.2%</span>
        </div>
        <div class="metric-card">
          <span class="metric-title">전환율 (Conversion)</span>
          <div class="metric-val" id="metric-cr">4.62%</div>
          <span class="metric-trend up">+0.4%</span>
        </div>
        <div class="metric-card">
          <span class="metric-title">평균 응답속도 (Latency)</span>
          <div class="metric-val" id="metric-lat">24ms</div>
          <span class="metric-trend good">Optimal</span>
        </div>
      </div>

      <!-- Data Table Section -->
      <div class="dash-table-wrapper">
        <div class="table-header-row">
          <span>최근 트랜잭션 내역</span>
          <div class="table-tools">
            <input type="search" class="table-filter-input" data-action="dash-filter" placeholder="테이블 필터..." aria-label="트랜잭션 필터" />
            <button class="table-refresh-btn" data-action="dash-refresh">🔄 새로고침</button>
          </div>
        </div>
        <table class="dash-table">
          <thead>
            <tr>
              <th><button class="dash-sort-btn" data-action="dash-sort" data-sort="id">ID</button></th>
              <th><button class="dash-sort-btn" data-action="dash-sort" data-sort="project">프로젝트</button></th>
              <th><button class="dash-sort-btn" data-action="dash-sort" data-sort="status">상태</button></th>
              <th><button class="dash-sort-btn" data-action="dash-sort" data-sort="spend">지출</button></th>
              <th><button class="dash-sort-btn" data-action="dash-sort" data-sort="time">일시</button></th>
            </tr>
          </thead>
          <tbody id="dash-table-body">
            <tr>
              <td>#TRX-8901</td>
              <td>${subDesign.nameEn} System</td>
              <td><span class="status-badge success">COMPLETED</span></td>
              <td>₩1,250,000</td>
              <td>방금 전</td>
            </tr>
            <tr>
              <td>#TRX-8902</td>
              <td>Global Web App</td>
              <td><span class="status-badge success">COMPLETED</span></td>
              <td>₩890,000</td>
              <td>12분 전</td>
            </tr>
            <tr>
              <td>#TRX-8903</td>
              <td>Mobile Archetype SDK</td>
              <td><span class="status-badge pending">PROCESSING</span></td>
              <td>₩3,400,000</td>
              <td>45분 전</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 7. MEDIA PLAYER ARCHETYPE
function renderMediaArchetype(subDesign) {
  const name = subDesign?.name || 'Soundscape';
  return `
    <div class="archetype-unit archetype-media" data-archetype="media">
      <div class="media-player-card">
        <!-- Artwork Showcase -->
        <div class="media-artwork-zone">
          <div class="vinyl-disc" id="media-vinyl">
            <div class="vinyl-center">🎵</div>
          </div>
        </div>

        <!-- Track Info -->
        <div class="media-track-info">
          <h2 class="track-title" id="media-track-name">${name} Harmonics</h2>
          <span class="track-artist">Procedural Web Audio Synth</span>
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
          <button class="media-btn" data-action="media-prev" title="이전 트랙">⏮️</button>
          <button class="media-btn media-play-btn" data-action="media-play" title="재생/일시정지">
            <span class="play-icon">❚❚</span>
          </button>
          <button class="media-btn" data-action="media-next" title="다음 트랙">⏭️</button>
        </div>

        <div class="media-volume-row">
          <span class="vol-icon">🔊</span>
          <input type="range" min="0" max="1" step="0.05" value="0.7" class="media-volume-slider" data-action="media-volume" aria-label="볼륨" />
          <span id="media-vol-val">70%</span>
        </div>

        <!-- Playlist Queue -->
        <div class="media-queue-list">
          <button class="queue-item active" data-action="media-queue" data-track="0">
            <span>01. ${subDesign.nameEn} Echo</span>
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
function renderChatArchetype(subDesign) {
  const name = subDesign?.name || 'Design Channel';
  return `
    <div class="archetype-unit archetype-chat" data-archetype="chat">
      <!-- Channels Sidebar -->
      <aside class="chat-sidebar">
        <div class="chat-brand">
          <span>💬</span>
          <strong>${name}</strong>
        </div>
        <div class="chat-channels">
          <button class="channel-item active" data-action="chat-channel" data-channel="general-chat"># general-chat</button>
          <button class="channel-item" data-action="chat-channel" data-channel="design-feedback"># design-feedback</button>
          <button class="channel-item" data-action="chat-channel" data-channel="tech-spec"># tech-spec</button>
          <button class="channel-item" data-action="chat-channel" data-channel="audio-engine"># audio-engine</button>
        </div>
      </aside>

      <!-- Main Chat Stream -->
      <section class="chat-main-stream">
        <header class="chat-header">
          <span class="chat-topic"># general-chat</span>
          <span class="chat-members">👥 48 Members Online</span>
        </header>

        <div class="chat-messages-container" id="chat-messages-container">
          <div class="chat-bubble-msg peer">
            <div class="msg-avatar">🎨</div>
            <div class="msg-content">
              <span class="msg-sender">Lead Designer</span>
              <p>${subDesign.name} 테마가 적용된 채팅 아키타입 예제입니다.</p>
              <div class="msg-reactions">
                <button class="reaction-btn" data-action="chat-react">👍 8</button>
                <button class="reaction-btn" data-action="chat-react">✨ 14</button>
              </div>
            </div>
          </div>

          <div class="chat-bubble-msg user">
            <div class="msg-avatar">🚀</div>
            <div class="msg-content">
              <span class="msg-sender">You</span>
              <p>상단 선택바에서 다른 스타일로 전환해도 대화창 상태가 유지되네요!</p>
            </div>
          </div>
        </div>

        <!-- Chat Input Form -->
        <div class="chat-input-bar">
          <input type="text" class="chat-input" id="chat-msg-input" placeholder="메시지를 입력하세요 (Enter 전송)..." />
          <button class="chat-send-btn" data-action="chat-send">전송</button>
        </div>
      </section>
    </div>
  `;
}
