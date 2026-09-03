import{l as Y,r as q}from"./componentEntry-jhia2jv3.js";import{f as S,R as E,u as H,v as u,w as K,x as V,C as X,y as Q,T as j,b as F}from"./index-BFii0hNt.js";import{g as T}from"./copy-DQ-HfkIO.js";function Se(a,e,t={}){const s=t.tab||"hero",n=t.snapshot?.copy||T("ko"),r=(c,d)=>S(n,c,d);let o;switch(a){case"game":o=ae(e,r);break;case"web":o=te(e,s,r,t.snapshot);break;case"mobile":o=se(e,r);break;case"ecommerce":o=re(e,r);break;case"blog":o=oe(e,r);break;case"dashboard":o=ne(e,r);break;case"media":o=ce(e,r);break;case"chat":o=ie(e,r);break;default:throw new RangeError("[PreviewState] Unknown archetype ID.")}return Y(o,{locale:t.snapshot?.locale,copy:n,design:e})}const J=Object.freeze({swiss:Object.freeze({game:Object.freeze({avatar:"✛",playerName:"SYS_GRID_01",targetIcon:"🎯",noticeBadge:"GRID SYSTEM 01",primaryMeter:"ACC",secondaryMeter:"SYNC",skills:Object.freeze(["✛","■","▲","●"])}),mediaOverlay:"swiss-tuner",vinylCenter:"●",chat:Object.freeze({brandIcon:"📑",channel:"swiss-log",peerAvatar:"✛",userAvatar:"■"})}),y2k:Object.freeze({game:Object.freeze({avatar:"👾",playerName:"CYBER_HERO",targetIcon:"👾",noticeBadge:"CYBER ARENA",primaryMeter:"HP",secondaryMeter:"MP",skills:Object.freeze(["★","⚡","💾","🌈"])}),mediaOverlay:"winamp-lcd",vinylCenter:"💿",chat:Object.freeze({brandIcon:"📟",channel:"msn-cyber",peerAvatar:"✨",userAvatar:"💖"})}),brutalism:Object.freeze({game:Object.freeze({avatar:"⬛",playerName:"RAW_AGGRO",targetIcon:"💥",noticeBadge:"RAW BATTLE",primaryMeter:"HP",secondaryMeter:"POW",skills:Object.freeze(["🥊","🧱","⚡","💣"])}),mediaOverlay:"brutalist-tag",vinylCenter:"⬛",chat:Object.freeze({brandIcon:"📢",channel:"brutal-zine",peerAvatar:"⬛",userAvatar:"🥊"})}),hypertech:Object.freeze({game:Object.freeze({avatar:"💠",playerName:"OPERATOR",targetIcon:"👁️",noticeBadge:"TACTICAL SYS",primaryMeter:"SHD",secondaryMeter:"ENG",skills:Object.freeze(["⚡","🛡️","🎯","💫"])}),mediaOverlay:"hypertech-telemetry",vinylCenter:"🎵",chat:Object.freeze({brandIcon:"🔒",channel:"secure-uplink",peerAvatar:"🎨",userAvatar:"🚀"})})}),Z=Object.freeze({game:Object.freeze({avatar:"🎮",playerName:"PLAYER_01",targetIcon:"👾",noticeBadge:"ARENA BATTLE",primaryMeter:"HP",secondaryMeter:"MP",skills:Object.freeze(["🗡️","🛡️","🧪","💥"])}),mediaOverlay:null,vinylCenter:"🎵",chat:Object.freeze({brandIcon:"💬",channel:"general-chat",peerAvatar:"🎨",userAvatar:"🚀"})});function R(a){return J[a]||Z}function ee(a){return a==="swiss-tuner"?`
      <div class="swiss-tuner-scale" aria-hidden="true">
        <span>88</span><span>92</span><span>96</span><span>100</span><span>104</span><span>108 MHz</span>
      </div>
    `:a==="winamp-lcd"?`
      <div class="winamp-lcd-display" aria-hidden="true">
        <span class="lcd-kbps">320 KBPS</span>
        <span class="lcd-khz">44.1 KHZ</span>
        <span class="lcd-stereo">STEREO</span>
      </div>
    `:a==="brutalist-tag"?`
      <div class="brutalist-tape-tag" aria-hidden="true">
        <span>TAPE DECK A // 120µs EQ</span>
      </div>
    `:a==="hypertech-telemetry"?`
      <div class="hypertech-telemetry" aria-hidden="true">
        <span>QUANTUM CH-01</span>
        <span>96.4 kHz</span>
        <span>LOSSLESS</span>
      </div>
    `:""}function ae(a,e){const t=a?.name||"Style Arcade",s=a?.categoryId||"general",n=R(s),{avatar:r,playerName:o,targetIcon:c,noticeBadge:d,primaryMeter:i,secondaryMeter:m,skills:b}=n.game;return`
    <div class="archetype-unit archetype-game" data-archetype="game" data-category="${s}" data-tweak-surface>
      <!-- Game Top HUD -->
      <header class="game-hud-header">
        <div class="hud-player-info">
          <div class="hud-avatar">${r}</div>
          <div class="hud-player-text">
            <span class="hud-player-name">${o}</span>
            <span class="hud-player-level">LV. 42 ${t}</span>
          </div>
        </div>

        <div class="hud-meters">
          <div class="meter-bar hp-meter">
            <span class="meter-label">${i}</span>
            <div class="meter-track"><div class="meter-fill hp-fill" style="width: 82%;"></div></div>
            <span class="meter-val hp-val">820 / 1000</span>
          </div>
          <div class="meter-bar mp-meter">
            <span class="meter-label">${m}</span>
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
            <span class="target-icon">${c}</span>
            <span class="target-hp-bar"><span class="target-hp-fill" style="width: 100%;"></span></span>
          </div>
        </div>
        <div class="arena-notice">
          <span class="notice-badge">${d}</span>
          <p>${e("archetype.game.instructions")}</p>
        </div>
      </main>

      <!-- Game Action Bar & Skills -->
      <footer class="game-action-bar">
        <div class="skill-slots">
          <button class="skill-btn" data-action="game-skill" data-skill="q" title="Strike (Q)">
            <span class="skill-key">Q</span>
            <span class="skill-icon">${b[0]}</span>
            <span class="skill-cooldown"></span>
          </button>
          <button class="skill-btn" data-action="game-skill" data-skill="w" title="Shield (W)">
            <span class="skill-key">W</span>
            <span class="skill-icon">${b[1]}</span>
            <span class="skill-cooldown"></span>
          </button>
          <button class="skill-btn" data-action="game-skill" data-skill="e" title="Heal (E)">
            <span class="skill-key">E</span>
            <span class="skill-icon">${b[2]}</span>
            <span class="skill-cooldown"></span>
          </button>
          <button class="skill-btn skill-ultimate" data-action="game-skill" data-skill="r" title="Hyper Rush (R)">
            <span class="skill-key">R</span>
            <span class="skill-icon">${b[3]}</span>
            <span class="skill-cooldown"></span>
          </button>
        </div>

        <div class="game-controls">
          <button class="game-cta-btn" data-action="game-boost" data-mock-action="game-boost">
            <span>🚀 ${e("archetype.game.boost")}</span>
          </button>
        </div>
      </footer>
    </div>
  `}function te(a,e="hero",t,s){const n=a?.name||"Web SaaS",r=q({rendererId:a.previewType,tab:e,design:a,snapshot:s});return`
    <div class="archetype-unit archetype-web" data-archetype="web" data-tweak-surface>
      <!-- SaaS Top Nav -->
      <header class="web-nav-header">
        <div class="web-logo">
          <span class="logo-mark">◆</span>
          <span class="logo-text">${n} Studio</span>
        </div>
        <div class="web-nav-links">
          <span class="nav-item active">${t("archetype.web.product")}</span>
          <span class="nav-item">${t("archetype.web.solutions")}</span>
          <span class="nav-item">${t("archetype.web.pricing")}</span>
          <span class="nav-item">${t("archetype.web.docs")}</span>
        </div>
        <div class="web-nav-actions">
          <button class="web-btn-subtle" data-action="web-login">${t("archetype.web.signIn")}</button>
          <button class="web-btn-primary" data-action="web-cta">${t("archetype.web.getStarted")}</button>
        </div>
      </header>

      <!-- Sub-Tab Content Viewport -->
      <div class="web-component-container">
        ${r}
      </div>
    </div>
  `}function se(a,e){const t=a?.name||"App Core";return`
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
              <span class="greet-sub">${e("archetype.mobile.welcome")}</span>
              <span class="greet-name">Alex Designer</span>
            </div>
          </div>
          <button class="mobile-icon-btn" data-action="mobile-bell" aria-label="${e("archetype.mobile.notifications")}">
            <span>🔔</span>
            <span class="mobile-notif-dot"></span>
          </button>
        </header>

        <!-- Notification Banner / Swipeable -->
        <div class="mobile-notif-card" id="mobile-notif-card">
          <span class="notif-badge">${e("archetype.mobile.update")}</span>
          <div class="notif-body">
            <strong>${e("archetype.mobile.activated",{name:t})}</strong>
            <p>${e("archetype.mobile.test")}</p>
          </div>
          <button class="notif-close-btn" data-action="mobile-swipe" title="${e("archetype.mobile.close")}">✕</button>
        </div>

        <!-- Scrollable Feed -->
        <div class="mobile-feed-container">
          <div class="mobile-feature-card">
            <div class="feature-tag">${e("archetype.mobile.trending")}</div>
            <h3>${t}</h3>
            <p>${a.shortDesc}</p>
            <div class="feature-action-row">
              <button class="mobile-card-btn" data-action="mobile-explore">${e("archetype.mobile.explore")}</button>
              <button class="mobile-like-btn" data-action="mobile-like">
                <span class="like-heart">❤️</span>
                <span class="like-count">248</span>
              </button>
            </div>
          </div>

          <div class="mobile-toggle-card">
            <div class="toggle-info">
              <span class="toggle-title">${e("archetype.mobile.soundTitle")}</span>
              <span class="toggle-desc">${e("archetype.mobile.soundDescription")}</span>
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
            <span class="tab-label">${e("archetype.mobile.home")}</span>
          </button>
          <button class="mobile-tab-btn" data-action="mobile-tab" data-tab="explore">
            <span class="tab-icon">🧭</span>
            <span class="tab-label">${e("archetype.mobile.explore")}</span>
          </button>
          <button class="mobile-tab-btn" data-action="mobile-tab" data-tab="activity">
            <span class="tab-icon">⚡</span>
            <span class="tab-label">${e("archetype.mobile.activity")}</span>
          </button>
          <button class="mobile-tab-btn" data-action="mobile-tab" data-tab="profile">
            <span class="tab-icon">⚙️</span>
            <span class="tab-label">${e("archetype.mobile.settings")}</span>
          </button>
        </nav>
      </div>
    </div>
  `}function re(a,e){const t=a?.name||"Design Product";return`
    <div class="archetype-unit archetype-ecommerce" data-archetype="ecommerce" data-tweak-surface>
      <!-- Store Header -->
      <header class="shop-header">
        <div class="shop-brand">
          <span class="shop-logo">🛍️</span>
          <span class="shop-title">${t} Boutique</span>
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
              <span class="artwork-label">${t}</span>
            </div>
          </div>
        </div>

        <div class="product-details">
          <span class="product-category">${e("archetype.shop.limited")}</span>
          <h2 class="product-title">${e("archetype.shop.edition",{name:a.name})}</h2>
          <div class="product-rating">
            <span class="stars">★★★★★</span>
            <span class="rating-val">4.9 (128 ${e("archetype.shop.reviews")})</span>
          </div>

          <div class="product-price-box">
            <span class="price-currency">₩</span>
            <span class="price-val" id="product-total-price">89,000</span>
            <span class="price-badge">${e("archetype.shop.shipping")}</span>
          </div>

          <p class="product-desc">${a.shortDesc}</p>

          <!-- Color Option Selector -->
          <div class="option-section">
            <label class="option-label">${e("archetype.shop.color")}</label>
            <div class="color-chips">
              ${a.palette.map((s,n)=>`
                <button class="color-chip-btn ${n===0?"active":""}" 
                        data-action="shop-color" 
                        data-color="${s.hex}" 
                        data-name="${s.id}"
                        style="background: ${s.hex};" 
                        aria-label="${s.name} (${s.hex})"
                        title="${s.name} (${s.hex})">
                </button>
              `).join("")}
            </div>
          </div>

          <div class="option-section">
            <label class="option-label">${e("archetype.shop.size")}</label>
            <div class="size-chips">
              ${["XS","S","M","L","XL"].map(s=>`
                <button class="size-chip-btn ${s==="M"?"active":""}" data-action="shop-size" data-size="${s}">${s}</button>
              `).join("")}
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
              <span>🛒 ${e("archetype.shop.addCart")}</span>
            </button>

            <button class="instant-buy-btn" data-action="shop-checkout" data-checkout-source="direct">
              <span>${e("archetype.shop.buyNow")}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Slide-out Cart Drawer Simulation -->
      <aside class="shop-cart-drawer" id="shop-cart-drawer">
        <div class="cart-drawer-header">
          <h3>${e("archetype.shop.cart")} (<span id="cart-drawer-count">0</span>)</h3>
          <button class="drawer-close-btn" data-action="shop-cart-close">✕</button>
        </div>
        <div class="cart-items-list" id="cart-items-list">
          <p class="cart-empty-msg">${e("archetype.shop.empty")}</p>
        </div>
        <div class="cart-drawer-footer">
          <div class="cart-total-row">
            <span>${e("archetype.shop.total")}</span>
            <strong id="cart-drawer-total">₩0</strong>
          </div>
          <button class="cart-checkout-btn" data-action="shop-checkout" data-checkout-source="cart" disabled aria-disabled="true">${e("archetype.shop.checkout")}</button>
        </div>
      </aside>
    </div>
  `}function oe(a,e){const t=a?.name||"Design Review";return`
    <div class="archetype-unit archetype-blog" data-archetype="blog" data-tweak-surface>
      <!-- Reading Progress Indicator -->
      <div class="blog-progress-track" id="blog-progress-track" role="progressbar" aria-label="${e("archetype.blog.progress")}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
        <div class="blog-progress-fill" id="blog-progress-fill" style="width: 0%;"></div>
      </div>

      <!-- Article Header -->
      <header class="blog-article-header">
        <div class="blog-meta-tags">
          <span class="blog-tag">${e("archetype.blog.archive")}</span>
          <span class="blog-read-time">⏱️ ${e("archetype.blog.readTime")}</span>
        </div>
        <h1 class="blog-title">${t}: ${e("archetype.blog.titleSuffix")}</h1>
        <p class="blog-lead">${a.shortDesc}</p>
        
        <div class="blog-author-bar">
          <div class="author-info">
            <div class="author-avatar">✍️</div>
            <div>
              <span class="author-name">${e("archetype.blog.author")}</span>
              <span class="author-date">${e("archetype.blog.published")}</span>
            </div>
          </div>

          <div class="blog-actions-bar">
            <button class="blog-action-btn" data-action="blog-reading-mode" aria-pressed="false" aria-label="${e("archetype.blog.readingModeAria")}" title="${e("archetype.blog.readingModeTitle")}">
              <span class="mode-icon">🌓</span>
              <span>${e("archetype.blog.mode")}</span>
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
        <nav class="blog-toc" aria-label="${e("archetype.blog.toc")}">
          <span class="toc-label">${e("archetype.blog.toc")}</span>
          <button class="toc-link" data-action="blog-toc" data-target="blog-sec-summary">${e("archetype.blog.summary")}</button>
          <button class="toc-link" data-action="blog-toc" data-target="blog-sec-body">${e("archetype.blog.body")}</button>
          <button class="toc-link" data-action="blog-toc" data-target="blog-comments-section">${e("archetype.blog.comments")}</button>
        </nav>

        <div class="blog-callout" id="blog-sec-summary">
          <strong>${e("archetype.blog.summaryTitle")}</strong>
          <ul>
            ${a.characteristics.slice(0,3).map(s=>`<li>${s}</li>`).join("")}
          </ul>
        </div>

        <div id="blog-sec-body">
          <p>${e("archetype.blog.paragraph1",{name:t})}</p>
          <p>${e("archetype.blog.paragraph2")}</p>
          <p>${e("archetype.blog.paragraph3")}</p>
        </div>

        <!-- Interactive Comments Simulation -->
        <section class="blog-comments-section" id="blog-comments-section">
          <h3>${e("archetype.blog.commentsTitle")} (<span id="blog-comment-count">2</span>)</h3>
          
          <div class="comment-input-box">
            <input type="text" class="comment-input" id="blog-comment-input" maxlength="500" aria-describedby="blog-comment-status" placeholder="${e("archetype.blog.commentPlaceholder")}" />
            <button class="comment-submit-btn" data-action="blog-comment-submit">${e("archetype.blog.submit")}</button>
          </div>
          <span id="blog-comment-status" role="status" aria-live="polite"></span>

          <div class="comments-list" id="blog-comments-list">
            <div class="comment-item">
              <strong>${e("archetype.blog.researcher")}</strong>
              <p>${e("archetype.blog.comment1",{name:a.name})}</p>
            </div>
            <div class="comment-item">
              <strong>${e("archetype.blog.engineer")}</strong>
              <p>${e("archetype.blog.comment2")}</p>
            </div>
          </div>
        </section>
      </article>
    </div>
  `}function ne(a,e){const t=a?.name||"Analytics";return`
    <div class="archetype-unit archetype-dashboard" data-archetype="dashboard" data-tweak-surface>
      <!-- Dashboard Top Header -->
      <header class="dash-header">
        <div>
          <h2 class="dash-title">${t} ${e("archetype.dashboard.titleSuffix")}</h2>
          <span class="dash-subtitle">${e("archetype.dashboard.subtitle")}</span>
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
          <span class="metric-title">${e("archetype.dashboard.revenue")}</span>
          <div class="metric-val" id="metric-rev">₩42,850,000</div>
          <span class="metric-trend up">+14.8% ${e("archetype.dashboard.lastWeek")}</span>
        </div>
        <div class="metric-card">
          <span class="metric-title">${e("archetype.dashboard.users")}</span>
          <div class="metric-val" id="metric-users">18,420</div>
          <span class="metric-trend up">+8.2%</span>
        </div>
        <div class="metric-card">
          <span class="metric-title">${e("archetype.dashboard.conversion")}</span>
          <div class="metric-val" id="metric-cr">4.62%</div>
          <span class="metric-trend up">+0.4%</span>
        </div>
        <div class="metric-card">
          <span class="metric-title">${e("archetype.dashboard.latency")}</span>
          <div class="metric-val" id="metric-lat">24ms</div>
          <span class="metric-trend good">${e("archetype.dashboard.optimal")}</span>
        </div>
      </div>

      <!-- Data Table Section -->
      <div class="dash-table-wrapper">
        <div class="table-header-row">
          <span>${e("archetype.dashboard.recent")}</span>
          <div class="table-tools">
            <input type="search" class="table-filter-input" data-action="dash-filter" placeholder="${e("archetype.dashboard.filterPlaceholder")}" aria-label="${e("archetype.dashboard.filter")}" />
            <button class="table-refresh-btn" data-action="dash-refresh">🔄 ${e("archetype.dashboard.refresh")}</button>
          </div>
        </div>
        <table class="dash-table">
          <thead>
            <tr>
              <th><button class="dash-sort-btn" data-action="dash-sort" data-sort="id">ID</button></th>
              <th><button class="dash-sort-btn" data-action="dash-sort" data-sort="project">${e("archetype.dashboard.project")}</button></th>
              <th><button class="dash-sort-btn" data-action="dash-sort" data-sort="status">${e("archetype.dashboard.status")}</button></th>
              <th><button class="dash-sort-btn" data-action="dash-sort" data-sort="spend">${e("archetype.dashboard.spend")}</button></th>
              <th><button class="dash-sort-btn" data-action="dash-sort" data-sort="time">${e("archetype.dashboard.time")}</button></th>
            </tr>
          </thead>
          <tbody id="dash-table-body">
            <tr>
              <td>#TRX-8901</td>
              <td>${t}</td>
              <td><span class="status-badge success">${e("archetype.dashboard.completed")}</span></td>
              <td>₩1,250,000</td>
              <td>${e("archetype.dashboard.justNow")}</td>
            </tr>
            <tr>
              <td>#TRX-8902</td>
              <td>Global Web App</td>
              <td><span class="status-badge success">${e("archetype.dashboard.completed")}</span></td>
              <td>₩890,000</td>
              <td>${e("archetype.dashboard.minutesAgo",{count:12})}</td>
            </tr>
            <tr>
              <td>#TRX-8903</td>
              <td>Mobile Archetype SDK</td>
              <td><span class="status-badge pending">${e("archetype.dashboard.processing")}</span></td>
              <td>₩3,400,000</td>
              <td>${e("archetype.dashboard.minutesAgo",{count:45})}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `}function ce(a,e){const t=a?.name||"Soundscape",s=a?.categoryId||"general",n=R(s),r=ee(n.mediaOverlay);return`
    <div class="archetype-unit archetype-media" data-archetype="media" data-category="${s}" data-tweak-surface>
      <div class="media-player-card">
        ${r}
        <!-- Artwork Showcase -->
        <div class="media-artwork-zone">
          <div class="vinyl-disc" id="media-vinyl">
            <div class="vinyl-center">${n.vinylCenter}</div>
          </div>
        </div>

        <!-- Track Info -->
        <div class="media-track-info">
          <h2 class="track-title" id="media-track-name">${t} Harmonics</h2>
          <span class="track-artist">${e("archetype.media.artist")}</span>
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
          ${Array.from({length:16},()=>'<span class="spec-bar"></span>').join("")}
        </div>

        <!-- Media Controls -->
        <div class="media-controls-row">
          <button class="media-btn" data-action="media-prev" title="${e("archetype.media.previous")}">⏮️</button>
          <button class="media-btn media-play-btn" data-action="media-play" title="${e("archetype.media.playPause")}">
            <span class="play-icon">❚❚</span>
          </button>
          <button class="media-btn" data-action="media-next" title="${e("archetype.media.next")}">⏭️</button>
        </div>

        <div class="media-volume-row">
          <span class="vol-icon">🔊</span>
          <input type="range" min="0" max="1" step="0.05" value="0.7" class="media-volume-slider" data-action="media-volume" aria-label="${e("archetype.media.volume")}" />
          <span id="media-vol-val">70%</span>
        </div>

        <!-- Playlist Queue -->
        <div class="media-queue-list">
          <button class="queue-item active" data-action="media-queue" data-track="0">
            <span>01. ${t}</span>
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
  `}function ie(a,e){const t=a?.name||"Design Channel",s=a?.categoryId||"general",n=R(s),{brandIcon:r,channel:o,peerAvatar:c,userAvatar:d}=n.chat;return`
    <div class="archetype-unit archetype-chat" data-archetype="chat" data-category="${s}" data-tweak-surface>
      <!-- Channels Sidebar -->
      <aside class="chat-sidebar">
        <div class="chat-brand">
          <span>${r}</span>
          <strong>${t}</strong>
        </div>
        <div class="chat-channels">
          <button class="channel-item active" data-action="chat-channel" data-channel="${o}"># ${o}</button>
          <button class="channel-item" data-action="chat-channel" data-channel="design-feedback"># design-feedback</button>
          <button class="channel-item" data-action="chat-channel" data-channel="tech-spec"># tech-spec</button>
          <button class="channel-item" data-action="chat-channel" data-channel="audio-engine"># audio-engine</button>
        </div>
      </aside>

      <!-- Main Chat Stream -->
      <section class="chat-main-stream">
        <header class="chat-header">
          <span class="chat-topic"># ${o}</span>
          <span class="chat-members">👥 ${e("archetype.chat.members")}</span>
        </header>

        <div class="chat-messages-container" id="chat-messages-container">
          <div class="chat-bubble-msg peer">
            <div class="msg-avatar">${c||"🎨"}</div>
            <div class="msg-content">
              <span class="msg-sender">${e("archetype.chat.lead")}</span>
              <p>${e("archetype.chat.message1",{name:a.name})}</p>
              <div class="msg-reactions">
                <button class="reaction-btn" data-action="chat-react">👍 8</button>
                <button class="reaction-btn" data-action="chat-react">✨ 14</button>
              </div>
            </div>
          </div>

          <div class="chat-bubble-msg user">
            <div class="msg-avatar">${d||"🚀"}</div>
            <div class="msg-content">
              <span class="msg-sender">${e("archetype.chat.you")}</span>
              <p>${e("archetype.chat.message2")}</p>
            </div>
          </div>
        </div>

        <!-- Chat Input Form -->
        <div class="chat-input-bar">
          <input type="text" class="chat-input" id="chat-msg-input" maxlength="500" aria-describedby="chat-message-status" placeholder="${e("archetype.chat.placeholder")}" />
          <button class="chat-send-btn" data-action="chat-send">${e("archetype.chat.send")}</button>
        </div>
        <span id="chat-message-status" role="status" aria-live="polite"></span>
      </section>
    </div>
  `}const g=[{id:"game",label:"🎮 게임"},{id:"web",label:"🌐 웹"},{id:"mobile",label:"📱 모바일"},{id:"ecommerce",label:"🛍️ 쇼핑몰"},{id:"blog",label:"📰 블로그"},{id:"dashboard",label:"📊 대시보드"},{id:"media",label:"🎵 미디어"},{id:"chat",label:"💬 채팅"}];function Te(a){return g.map(e=>{const t=e.id===a;return{...e,ariaSelected:String(t),tabIndex:t?0:-1}})}function Ce(a,e){const t=g.findIndex(r=>r.id===a);if(t<0)return null;if(e==="Home")return g[0].id;if(e==="End")return g.at(-1).id;if(!["ArrowLeft","ArrowRight"].includes(e))return null;const n=(t+(e==="ArrowRight"?1:-1)+g.length)%g.length;return g[n].id}function p(a){return String(a??"").replace(/&/gu,"&amp;").replace(/"/gu,"&quot;").replace(/</gu,"&lt;").replace(/>/gu,"&gt;")}function W(a){return[a?.id,...Array.isArray(a?.aliases)?a.aliases:[],a?.name,a?.nameEn,a?.categoryId,a?.categoryTitle].filter(Boolean).join(" ")}function de(a,e={}){const t=H(a,{query:e?.query,selectedId:e?.selectedId,limit:E.detailPickerLimit,getSearchText:W}),s=typeof e?.renderThumbnail=="function"?e.renderThumbnail:()=>"",n=t.items.map(r=>{const o=r.id===e?.selectedId;return`
      <button class="top-style-chip ${o?"active":""}"
              data-sub-id="${p(r.id)}"
              data-cat-id="${p(r.categoryId||e?.categoryId)}"
              title="[${p(r.categoryTitle)}] ${p(r.name)}"
              type="button"
              role="tab"
              aria-selected="${o}">
        <span class="chip-thumb-mini">${s({thumbnailId:r.thumbMotif,design:r})}</span>
        <span>${p(r.name)}</span>
      </button>
    `}).join("");return Object.freeze({...t,markup:n})}function Ie(a,e={}){const t=Array.isArray(a)?a:[],s=de(t,e),n=e?.snapshot?.copy||T("ko"),r=(m,b)=>S(n,m,b),o=p(e?.categoryId),c=e?.categoryTitle||"",d=t.length>E.detailPickerLimit,i=s.selectedPinned?` · ${r("split.selectedPinned")}`:"";return`
    <div class="top-style-selector" id="top-style-selector" data-category-id="${o}">
      ${d?`
        <label class="detail-style-search-label" for="detail-style-search">
          <span>${p(r("detail.searchCategory",{category:c}))}</span>
          <input class="detail-style-search" id="detail-style-search" type="search"
                 value="${p(s.query)}" autocomplete="off" maxlength="120"
                 aria-controls="top-style-chips-scroller">
        </label>
      `:""}
      <div class="top-style-chips-scroller" id="top-style-chips-scroller"
           role="tablist" aria-label="${p(r("detail.styleMatches",{count:t.length}))}">
        ${s.markup}
      </div>
      <p class="detail-style-picker-status ${d?"":"visually-hidden"}"
         id="detail-style-picker-status" role="status" aria-live="polite">
        ${p(r("detail.styleMatches",{count:s.matchCount}))}${p(i)}
      </p>
    </div>
  `}function le(a,e={}){const t=e?.slot==="B"?"B":"A",s=H(a,{query:e?.query,selectedId:e?.selectedId,limit:E.splitPickerLimit,getSearchText:W}),n=typeof e?.renderThumbnail=="function"?e.renderThumbnail:()=>"",r=s.items.map(o=>{const c=o.id===e?.selectedId;return`
      <button class="split-pick-thumb ${c?"active":""}"
              data-slot="${t}" data-sub-id="${p(o.id)}"
              title="${p(o.name)}" type="button" role="tab"
              aria-selected="${c}">
        ${n({thumbnailId:o.thumbMotif,design:o})}
      </button>
    `}).join("");return Object.freeze({...s,markup:r})}function Ee(a,e={}){const t=Array.isArray(a)?a:[],s=e?.slot==="B"?"B":"A",n=s.toLocaleLowerCase("en"),r=le(t,{...e,slot:s}),o=e?.snapshot?.copy||T("ko"),c=(i,m)=>S(o,i,m),d=r.selectedPinned?` · ${c("split.selectedPinned")}`:"";return`
    <div class="split-picker-tools" data-slot="${s}">
      <label class="split-picker-search-label" for="split-style-search-${n}">
        ${p(c("detail.searchThumbnail",{slot:s}))}
      </label>
      <input class="split-picker-search" id="split-style-search-${n}" type="search"
             value="${p(r.query)}" autocomplete="off" maxlength="120"
             data-split-search="${s}" aria-controls="split-picker-${n}">
      <p class="split-picker-status" id="split-picker-status-${n}"
         role="status" aria-live="polite">
        ${p(c("split.matchCount",{count:r.matchCount}))}${p(d)}
      </p>
    </div>
    <div class="split-picker" id="split-picker-${n}" data-slot="${s}"
         role="tablist" aria-label="${p(c("detail.visualSelection",{slot:s}))}"
         aria-describedby="split-picker-status-${n}">
      ${r.markup}
    </div>
  `}const _=u({background:"--theme-bg",surface:"--theme-surface",surfaceSubtle:"--theme-surface-subtle",border:"--theme-border",text:"--theme-text",textMuted:"--theme-text-muted",accent:"--theme-accent",accentSecondary:"--theme-accent-secondary",radius:"--theme-radius",borderWidth:"--theme-border-width",shadow:"--theme-shadow",fontFamily:"--theme-font-family",glow:"--theme-glow"}),G=u({surfaceRadius:"--theme-surface-radius",controlRadius:"--theme-control-radius",pillRadius:"--theme-pill-radius"}),N=u({background:"#0B0F19",surface:"rgba(18, 25, 38, 0.85)",surfaceSubtle:"rgba(255, 255, 255, 0.04)",border:"rgba(255, 255, 255, 0.12)",text:"#F8FAFC",textMuted:"#94A3B8",accent:"#00F0FF",accentSecondary:"#FF007A",radius:"12px",borderWidth:"1px",shadow:"0 10px 25px -5px rgba(0, 0, 0, 0.5)",fontFamily:"'Inter', sans-serif",glow:"0 0 20px rgba(0, 240, 255, 0.35)"});u({surfaceRadius:N.radius,controlRadius:N.radius,pillRadius:"999px"});const pe=u({});function he(a){return Object.fromEntries(V.map(e=>[_[e],a[e]]))}function me(a){const e=a.themeGeometry||{surfaceRadius:a.tokens.radius,controlRadius:a.tokens.radius,pillRadius:"999px"};return Object.fromEntries(Object.entries(G).map(([t,s])=>[s,e[t]]))}const C=u(K({includeUnpublished:!0}).map(a=>({id:a.id,aliases:a.aliases,categoryId:a.categoryId,order:a.order,tokens:a.tokens,cssCustomProperties:he(a.tokens),geometryCustomProperties:me(a),themeEffects:a.themeEffects||pe}))),be=new Map(C.flatMap(a=>[[a.id,a],...a.aliases.map(e=>[e,a])])),U=new Set(X.styleIds);u(C.filter(a=>U.has(a.id)));u(C.filter(a=>!U.has(a.id)));function ue(a){return typeof a!="string"?null:be.get(a)||null}u(Object.fromEntries(C.map(a=>{const e={...a.cssCustomProperties};return Object.hasOwn(a.themeEffects,"backdropBlur")&&(e["backdrop-filter"]=`blur(${a.themeEffects.backdropBlur}px)`),[a.id,e]})));Object.values(_);Object.values(G);const B=Object.freeze({ko:Object.freeze({state:"테마 전환 시 게임 점수, 장바구니 항목, 폼 입력값을 보존합니다.",accessibility:"WAI-ARIA 역할과 키보드 탐색을 준수합니다.",audio:"Web Audio API 기반 상태 전환 효과음을 연결합니다.",integration:"HTML 요소에 테마 속성을 적용하여 스타일을 활성화합니다."}),en:Object.freeze({state:"Preserve game scores, cart items, and form values across theme changes.",accessibility:"Follow WAI-ARIA roles and keyboard navigation.",audio:"Connect state transitions to Web Audio API feedback.",integration:"Apply the theme attribute to an HTML element to activate the style."}),ja:Object.freeze({state:"テーマ切替時もゲームスコア、カート項目、フォーム入力を保持します。",accessibility:"WAI-ARIAロールとキーボード操作に準拠します。",audio:"状態遷移をWeb Audio APIのフィードバックに接続します。",integration:"HTML要素にテーマ属性を適用してスタイルを有効化します。"}),"zh-CN":Object.freeze({state:"切换主题时保留游戏得分、购物车项目与表单输入。",accessibility:"遵循WAI-ARIA角色与键盘导航规范。",audio:"使用Web Audio API为状态变化提供反馈。",integration:"为HTML元素应用主题属性以启用样式。"}),"zh-TW":Object.freeze({state:"切換主題時保留遊戲得分、購物車項目與表單輸入。",accessibility:"遵循WAI-ARIA角色與鍵盤導覽規範。",audio:"使用Web Audio API為狀態變化提供回饋。",integration:"為HTML元素套用主題屬性以啟用樣式。"})}),z={game:`/* === Game HUD Archetype Components === */
.archetype-game {
  background: var(--theme-bg);
  color: var(--theme-text);
  font-family: var(--theme-font-family);
  border-radius: var(--tweak-surface-radius, var(--theme-surface-radius, var(--theme-radius)));
  padding: 16px;
}
.game-hud-header {
  display: flex;
  justify-content: space-between;
  background: var(--theme-surface);
  border: var(--tweak-border-width, var(--theme-border-width)) solid var(--theme-border);
  border-radius: var(--theme-control-radius, var(--theme-radius));
  padding: 12px;
  box-shadow: 0 var(--tweak-shadow-depth, 12px) 24px rgba(0,0,0,0.3);
}
.meter-fill.hp-fill { background: #ef4444; border-radius: 99px; }
.meter-fill.mp-fill { background: #3b82f6; border-radius: 99px; }
.arena-target {
  background: var(--theme-surface);
  border: var(--tweak-border-width, 2px) solid var(--theme-accent);
  border-radius: var(--tweak-surface-radius, 12px);
  box-shadow: 0 0 calc(20px * var(--tweak-glow-intensity, 1)) var(--theme-accent);
  cursor: pointer;
  transition: transform 0.1s ease;
}
.arena-target:active { transform: scale(0.92); }`,web:`/* === Web SaaS Landing Archetype Components === */
.archetype-web {
  background: var(--theme-bg);
  color: var(--theme-text);
  font-family: var(--theme-font-family);
}
.web-nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: var(--theme-surface);
  border-bottom: var(--tweak-border-width, 1px) solid var(--theme-border);
}
.web-component-container {
  padding: 24px;
  background: var(--theme-bg);
}
.web-btn-primary {
  background: var(--theme-accent);
  color: var(--theme-bg);
  border: var(--tweak-border-width, 1px) solid transparent;
  border-radius: var(--theme-control-radius, 8px);
  padding: 10px 22px;
  font-weight: 600;
  box-shadow: 0 var(--tweak-shadow-depth, 8px) 16px rgba(0,0,0,0.2);
}`,mobile:`/* === Mobile App Screen Archetype Components === */
.archetype-mobile {
  max-width: 380px;
  margin: 0 auto;
  background: var(--theme-bg);
  color: var(--theme-text);
  border: var(--tweak-border-width, 1px) solid var(--theme-border);
  border-radius: calc(var(--tweak-surface-radius, 20px) + 8px);
  overflow: hidden;
  box-shadow: 0 var(--tweak-shadow-depth, 20px) 40px rgba(0,0,0,0.5);
}
.mobile-notif-card,
.mobile-feature-card {
  background: var(--theme-surface);
  border: var(--tweak-border-width, 1px) solid var(--theme-border);
  border-radius: var(--tweak-surface-radius, 12px);
  padding: 14px;
  backdrop-filter: blur(var(--tweak-backdrop-blur, 16px));
}
.mobile-bottom-nav {
  display: flex;
  justify-content: space-around;
  background: var(--theme-surface);
  border-top: var(--tweak-border-width, 1px) solid var(--theme-border);
  padding: 12px 0;
}`,ecommerce:`/* === E-Commerce Storefront Archetype Components === */
.archetype-ecommerce {
  background: var(--theme-bg);
  color: var(--theme-text);
  font-family: var(--theme-font-family);
  padding: 20px;
}
.product-details {
  background: var(--theme-surface);
  border: var(--tweak-border-width, 1px) solid var(--theme-border);
  border-radius: var(--tweak-surface-radius, 16px);
  box-shadow: 0 var(--tweak-shadow-depth, 10px) 25px rgba(0,0,0,0.15);
  padding: 20px;
}
.add-to-cart-btn {
  background: var(--theme-accent);
  color: var(--theme-bg);
  border-radius: var(--theme-control-radius, 8px);
  padding: 12px 24px;
  font-weight: 700;
  width: 100%;
}`,blog:`/* === Magazine & Blog Article Archetype Components === */
.archetype-blog {
  background: var(--theme-bg);
  color: var(--theme-text);
  font-family: var(--theme-font-family);
  max-width: 720px;
  margin: 0 auto;
  line-height: 1.75;
}
.blog-progress-fill {
  height: 4px;
  background: var(--theme-accent);
  position: sticky;
  top: 0;
  z-index: 10;
}
.blog-article-header h1 {
  font-size: 2rem;
  color: var(--theme-text);
  border-bottom: var(--tweak-border-width, 1px) solid var(--theme-border);
  padding-bottom: 16px;
}`,dashboard:`/* === Analytics Dashboard Archetype Components === */
.archetype-dashboard {
  background: var(--theme-bg);
  color: var(--theme-text);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  padding: 20px;
}
.metric-card {
  background: var(--theme-surface);
  border: var(--tweak-border-width, 1px) solid var(--theme-border);
  border-radius: var(--tweak-surface-radius, 12px);
  padding: 16px;
  box-shadow: 0 var(--tweak-shadow-depth, 8px) 20px rgba(0,0,0,0.2);
}
.metric-val {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--theme-accent);
}`,media:`/* === Media Player Archetype Components === */
.archetype-media {
  background: var(--theme-bg);
  color: var(--theme-text);
  font-family: var(--theme-font-family);
  border-radius: var(--tweak-surface-radius, 20px);
  padding: 24px;
  text-align: center;
}
.vinyl-disc {
  width: 140px;
  height: 140px;
  margin: 0 auto 16px;
  border-radius: 50%;
  border: var(--tweak-border-width, 2px) solid var(--theme-accent);
  box-shadow: 0 0 calc(25px * var(--tweak-glow-intensity, 1)) var(--theme-accent);
}
.scrub-track {
  height: 6px;
  background: var(--theme-surface-subtle);
  border-radius: 99px;
  position: relative;
}
.scrub-fill {
  height: 100%;
  background: var(--theme-accent);
  border-radius: 99px;
}`,chat:`/* === Messenger & Chat Archetype Components === */
.archetype-chat {
  background: var(--theme-bg);
  color: var(--theme-text);
  font-family: var(--theme-font-family);
  display: flex;
  flex-direction: column;
  height: 480px;
}
.chat-bubble-msg.user {
  background: var(--theme-accent);
  color: var(--theme-bg);
  border-radius: var(--theme-control-radius, 16px) var(--theme-control-radius, 16px) 2px var(--theme-control-radius, 16px);
  padding: 10px 16px;
  align-self: flex-end;
}
.chat-bubble-msg.peer {
  background: var(--theme-surface);
  color: var(--theme-text);
  border: var(--tweak-border-width, 1px) solid var(--theme-border);
  border-radius: var(--theme-control-radius, 16px) var(--theme-control-radius, 16px) var(--theme-control-radius, 16px) 2px;
  padding: 10px 16px;
  align-self: flex-start;
}`};function M(a){return ue(a?.id)?.cssCustomProperties||null}function D(a){return typeof a?.id=="string"&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a.id)?a.id:$e(typeof a?.name=="string"?a.name:a?.name?.en||a?.name?.ko||"color")}function x(a){const e=a?.hex||a?.value;if(typeof e!="string"||e.length>256||/[;{}]/.test(e))throw new TypeError("Palette color contains unsupported CSS syntax.");return e}function $(a){return String(a??"").replace(/\*\//g,"*\\/").replace(/[\r\n]+/g," ").slice(0,240)}function l(a){return String(a??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\|/g,"\\|").replace(/`/g,"\\`")}function O(a){const e=a&&typeof a=="object"?a:null,t=e?.locale||(typeof a=="string"?a:"ko"),s=e?.copy||T(t);return{locale:t,copy:s,prose:B[t]||B.ko,t:(n,r)=>S(s,n,r)}}function f(a,e,t){const s=a?.[e]??t;if(!Q(e,s))throw new RangeError(`${e} must be between ${j[e].min} and ${j[e].max}`);return s}function I(a,e={},t="game",s="full",n="ko"){const r=M(a);if(!r)return"/* No design selected */";const{t:o}=O(n),c=(a.palette||[]).map(L=>`  --color-${D(L)}: ${x(L)};`).join(`
`),d=f(e,"borderRadius",16),i=f(e,"borderWidth",1),m=f(e,"shadowDepth",12),b=f(e,"backdropBlur",16),k=f(e,"glowIntensity",1),w=`/* === ${$(o("artifact.css.theme",{name:a.name}))} === */
[data-theme="${a.id}"] {
  /* ${$(o("artifact.css.dynamicTokens"))} */
  --theme-bg: ${r["--theme-bg"]};
  --theme-surface: ${r["--theme-surface"]};
  --theme-surface-subtle: ${r["--theme-surface-subtle"]};
  --theme-border: ${r["--theme-border"]};
  --theme-text: ${r["--theme-text"]};
  --theme-text-muted: ${r["--theme-text-muted"]};
  --theme-accent: ${r["--theme-accent"]};
  --theme-accent-secondary: ${r["--theme-accent-secondary"]};
  --theme-radius: ${r["--theme-radius"]};
  --theme-border-width: ${r["--theme-border-width"]};
  --theme-shadow: ${r["--theme-shadow"]};
  --theme-font-family: ${r["--theme-font-family"]};
  --theme-glow: ${r["--theme-glow"]};

  /* ${$(o("artifact.css.palette"))} */
${c}

  /* ${$(o("artifact.css.tweaks"))} */
  --tweak-surface-radius: ${d}px;
  --tweak-border-width: ${i}px;
  --tweak-shadow-depth: ${m}px;
  --tweak-backdrop-blur: ${b}px;
  --tweak-glow-intensity: ${Number(k).toFixed(1)};
}`,h=(z[t]||z.game).replace(/^\/\*[^\n]+\*\//,`/* === ${$(o(`detail.${t}`))} CSS === */`);return s==="tokens"?w:s==="component"?h:`${w}

${h}`}function ve(a,e={},t="game",s="desktop",n="ko"){const r=M(a);if(!r)return"# Design Specification (No Selection)";const{t:o,prose:c}=O(n),d=(a.palette||[]).map(h=>`| \`${l(h.name)}\` | \`${x(h)}\` | <span style="display:inline-block;width:12px;height:12px;background:${x(h)};border-radius:2px;border:1px solid #666;"></span> | ${l(h.usage||o("artifact.paletteUsage",{style:a.name,color:h.name}))} |`).join(`
`),i=(a.characteristics||[]).map(h=>`- ✓ ${l(h)}`).join(`
`),m=(a.pros||[]).map(h=>`- 👍 ${l(h)}`).join(`
`),b=(a.cons||[]).map(h=>`- ⚠️ ${l(h)}`).join(`
`),k={game:`\`\`\`
+-------------------------------------------------------------+
| [🎮 PLAYER_01 (LV.42)]  [HP 820/1000] [MP 650/1000] [🪙 1,420] |
+-------------------------------------------------------------+
|                                                             |
|                    👾 ARENA TARGET BOX                      |
|                   [  CLICK TO ATTACK  ]                     |
|                                                             |
+-------------------------------------------------------------+
| SKILLS: [🗡️ Q Strike] [🛡️ W Shield] [⚡ E Nova] [💥 R Ult]    |
+-------------------------------------------------------------+
\`\`\``,web:`\`\`\`
+-------------------------------------------------------------+
| [LOGO]                      [Features] [Docs] [Pricing] [CTA]|
+-------------------------------------------------------------+
|                                                             |
|          🚀 HIGH-CONVERSION SAAS HEADLINE HERO              |
|        Modern interactive design system sandbox             |
|                  [ Primary CTA ]  [ Demo ]                  |
|                                                             |
+-------------------------------------------------------------+
\`\`\``,mobile:`\`\`\`
+-----------------------+
| 9:41              🔋  |
| Header / Greeting     |
+-----------------------+
| 🔔 Notification Card  |
|   [Swipe to Dismiss]  |
+-----------------------+
| 📦 Activity Feed      |
|   - Item Alpha        |
|   - Item Beta         |
+-----------------------+
| [🏠]  [🔍]  [🔔]  [⚙️] |
+-----------------------+
\`\`\``,ecommerce:`\`\`\`
+-------------------------------------------------------------+
| [PRODUCT IMAGE / 3D PREVIEW]  |  [PRODUCT TITLE & BADGES]   |
|                               |  Price: $129.00             |
|                               |  Color: [⚫] [⚪] [🔴]       |
|                               |  Qty: [-] [ 1 ] [+]         |
|                               |  [ 🛍️ ADD TO CART ]         |
+-------------------------------------------------------------+
\`\`\``,blog:`\`\`\`
+-------------------------------------------------------------+
| [=== READING PROGRESS BAR 68% ============================] |
| 📰 Article Headline: Architectural Modernism in Digital UI   |
| By Author • 5 min read • Published Today                     |
+-------------------------------------------------------------+
| Markdown Editorial Body Content...                          |
| [ ❤️ Like +42 ]  [ 💬 Leave a comment ]                     |
+-------------------------------------------------------------+
\`\`\``,dashboard:`\`\`\`
+-------------------------------------------------------------+
| FILTER: [ 1D ] [ 1W ] [ 1M ] [ 1Y ]                         |
+-------------------+--------------------+--------------------+
| TOTAL REVENUE     | ACTIVE USERS       | CONVERSION RATE    |
| $142,850 (+18.4%) | 12,480 (+5.2%)     | 4.82% (+1.1%)      |
+-------------------+--------------------+--------------------+
| DATA TABLE: Sortable Metrics & Status Indicators            |
+-------------------------------------------------------------+
\`\`\``,media:`\`\`\`
+-------------------------------------------------------------+
|                   💿 [ VINYL DISK ART ]                     |
|                 Track: Cybernetic Horizon                   |
|                   Artist: Spectrum Synth                    |
+-------------------------------------------------------------+
| [⏮️]         [ ▶️ PLAY / ⏸️ PAUSE ]         [⏭️]            |
| [================== ● 02:45 / 04:12 ======================] |
+-------------------------------------------------------------+
\`\`\``,chat:`\`\`\`
+--------------------+----------------------------------------+
| CHANNELS           | #general-discussion                    |
| # general          | [Agent]: Welcome to the interactive... |
| # design-lab       | [User]: Let's test the theme tokens!   |
| # audio-synth      | [Agent]: All tokens synchronized.      |
+--------------------+----------------------------------------+
| INPUT: [ Type your message...                     ] [ Send ]|
+--------------------+----------------------------------------+
\`\`\``},w=k[t]||k.game;return`# Design Specification: ${l(a.name)}

> **Version:** 2.3.0  
> **Genre Category:** ${a.categoryId||"General"}  
> **Sub-Style ID:** \`${a.id}\`  
> **Active Archetype:** \`${t.toUpperCase()}\`  
> **Target Viewport:** \`${s.toUpperCase()}\`  

---

## 1. ${l(o("artifact.markdown.overview"))}
${l(a.shortDesc||o("artifact.dtcg.description",{name:a.name}))}

---

## 2. ${l(o("artifact.markdown.palette"))}
| Token Name | HEX Code | Swatch | Intended Role |
| :--- | :--- | :---: | :--- |
${d}

---

## 3. ${l(o("artifact.markdown.tweaks"))}
| Parameter | Live Value | Default | Allowed Range | Unit |
| :--- | :---: | :---: | :---: | :--- |
| **Border Radius** | \`${e.borderRadius??16}px\` | \`${a.defaultTweaks?.borderRadius??16}px\` | \`0px ~ 64px\` | CSS Pixels |
| **Border Width** | \`${e.borderWidth??1}px\` | \`${a.defaultTweaks?.borderWidth??1}px\` | \`0px ~ 12px\` | CSS Pixels |
| **Shadow Depth** | \`${e.shadowDepth??12}px\` | \`${a.defaultTweaks?.shadowDepth??12}px\` | \`0px ~ 30px\` | CSS Pixels |
| **Backdrop Blur** | \`${e.backdropBlur??16}px\` | \`${a.defaultTweaks?.backdropBlur??16}px\` | \`0px ~ 32px\` | CSS Pixels |
| **Glow Intensity**| \`${Number(e.glowIntensity??1).toFixed(1)}\` | \`${Number(a.defaultTweaks?.glowIntensity??1).toFixed(1)}\` | \`0.0 ~ 2.0\` | Multiplier |

---

## 4. ${l(o("artifact.markdown.typography"))}
- **Display & Heading Font:** \`${r["--theme-font-family"]}\`
- **Body & UI Font:** \`'Inter', -apple-system, BlinkMacSystemFont, sans-serif\`
- **Monospace / Code Font:** \`'Fira Code', 'Courier New', monospace\`

---

## 5. ${l(o("artifact.markdown.structure"))}: \`${t.toUpperCase()}\`
${w}

### 5.1 ${l(o("artifact.markdown.interaction"))}
- **State Preservation:** ${l(c.state)}
- **Accessibility:** ${l(c.accessibility)}
- **Audio Feedback:** ${l(c.audio)}

---

## 6. ${l(o("artifact.markdown.guidelines"))}
### 📋 ${l(o("detail.inspectorTitle"))}
${i}

### 👍 ${l(o("detail.pros"))}
${m}

### ⚠️ ${l(o("detail.cons"))}
${b}

---

## 7. ${l(o("artifact.markdown.quickstart"))}
${l(c.integration)}
\`\`\`html
<div class="archetype-unit" data-theme="${a.id}" data-archetype="${t}">
  <!-- Your semantic markup here -->
</div>
\`\`\`
`}function P(a){const e=[];let t=0,s=0;for(let n=0;n<a.length;n+=1)a[n]==="("&&(t+=1),a[n]===")"&&(t-=1),a[n]===","&&t===0&&(e.push(a.slice(s,n).trim()),s=n+1);return e.push(a.slice(s).trim()),e.filter(Boolean)}function A(a){const e=String(a).trim();if(e.toLowerCase()==="transparent")return{colorSpace:"srgb",components:[0,0,0],alpha:0,hex:"#000000"};const t=e.match(/^#([\da-f]{3,8})$/i);if(t){let n=t[1];(n.length===3||n.length===4)&&(n=Array.from(n,i=>i.repeat(2)).join(""));const r=n.length===8,o=n.slice(0,6),d={colorSpace:"srgb",components:[0,2,4].map(i=>Number.parseInt(o.slice(i,i+2),16)/255),hex:`#${o.toLowerCase()}`};return r&&(d.alpha=Number.parseInt(n.slice(6,8),16)/255),d}const s=e.match(/^rgba?\(([^)]+)\)$/i);if(s){const n=s[1].split(",").map(c=>Number.parseFloat(c.trim()));if(n.length<3||n.some(c=>Number.isNaN(c)))throw new TypeError(`지원하지 않는 CSS 색상 값입니다: ${a}`);const r=n.slice(0,3).map(c=>Math.max(0,Math.min(255,c))),o=r.map(c=>Math.round(c).toString(16).padStart(2,"0")).join("");return{colorSpace:"srgb",components:r.map(c=>c/255),alpha:Math.max(0,Math.min(1,n[3]??1)),hex:`#${o}`}}throw new TypeError(`지원하지 않는 CSS 색상 값입니다: ${a}`)}function y(a,e){const t=String(a).trim().match(/^linear-gradient\((.*)\)$/i);if(!t)return{$value:A(a),$type:"color",...e?{$description:e}:{}};const s=P(t[1]);return/(?:#|rgb|transparent)/i.test(s[0])||s.shift(),{$value:s.map((r,o)=>{const c=r.match(/^(.*?)\s+(-?\d+(?:\.\d+)?)%$/),d=c?c[1]:r,i=c?Number.parseFloat(c[2])/100:o/Math.max(1,s.length-1);return{color:A(d),position:i}}),$type:"gradient",...e?{$description:e}:{}}}function v(a){const e=String(a).trim().match(/^(-?\d+(?:\.\d+)?)(px|rem)?$/i);if(!e)throw new TypeError(`지원하지 않는 CSS 치수 값입니다: ${a}`);return{value:Number.parseFloat(e[1]),unit:(e[2]||"px").toLowerCase()}}function ge(a){if(String(a).trim().toLowerCase()==="none"){const t={value:0,unit:"px"};return{color:A("transparent"),offsetX:{...t},offsetY:{...t},blur:{...t},spread:{...t}}}const e=P(a).map(t=>{const s=/(?:^|\s)inset(?:\s|$)/i.test(t),n=t.replace(/(?:^|\s)inset(?:\s|$)/i," ").trim(),r=n.match(/(rgba?\([^)]*\)|#[\da-f]{3,8}|transparent)\s*$/i);if(!r)throw new TypeError(`지원하지 않는 CSS 그림자 값입니다: ${a}`);const o=n.slice(0,r.index).trim().split(/\s+/);if(o.length<3||o.length>4)throw new TypeError(`지원하지 않는 CSS 그림자 치수입니다: ${a}`);return{color:A(r[1]),offsetX:v(o[0]),offsetY:v(o[1]),blur:v(o[2]),spread:v(o[3]||"0px"),...s?{inset:!0}:{}}});return e.length===1?e[0]:e}function ye(a){return P(a).map(e=>e.trim().replace(/^(['"])(.*)\1$/,"$2"))}function fe(a,e={},t="ko"){const s=M(a);if(!s)return"{}";const{locale:n,t:r}=O(t),o={...a.defaultTweaks,...e};for(const[i,m]of Object.entries({borderRadius:16,borderWidth:1,shadowDepth:12,backdropBlur:16,glowIntensity:1}))o[i]=f(o,i,m);const c={};(a.palette||[]).forEach(i=>{c[D(i)]=y(x(i),i.usage||"Palette color")});const d={$description:r("artifact.dtcg.description",{name:a.name}),$extensions:{"com.design-sample-selector":{name:a.name,displayName:a.name,locale:n,id:a.id,version:"2.3.0",format:"DTCG 2025.10"}},color:{palette:c,background:y(s["--theme-bg"]),surface:y(s["--theme-surface"]),border:y(s["--theme-border"]),text:y(s["--theme-text"]),accent:y(s["--theme-accent"])},dimension:{borderRadius:{$value:v(`${o.borderRadius??16}px`),$type:"dimension"},borderWidth:{$value:v(`${o.borderWidth??1}px`),$type:"dimension"},shadowDepth:{$value:v(`${o.shadowDepth??12}px`),$type:"dimension"},backdropBlur:{$value:v(`${o.backdropBlur??16}px`),$type:"dimension"}},typography:{fontFamily:{$value:ye(s["--theme-font-family"]),$type:"fontFamily"}},effect:{glowIntensity:{$value:Number(o.glowIntensity??1),$type:"number"},shadow:{$value:ge(s["--theme-shadow"]),$type:"shadow"}}};return JSON.stringify(d,null,2)}function Re(a,e,t="text/plain;charset=utf-8"){const s=new Blob([e],{type:t}),n=URL.createObjectURL(s),r=document.createElement("a");r.href=n,r.download=a,document.body.appendChild(r),r.click(),setTimeout(()=>{document.body.removeChild(r),URL.revokeObjectURL(n)},200)}function $e(a){return String(a||"").toLowerCase().replace(/\s+/g,"-").replace(/[^\w\-]+/g,"")}function Me(){return{activeTab:"css",activeCssMode:"full"}}function ke(a,e,t=F()){if(!a||!Array.isArray(e))return null;const s=e.find(n=>n.id===a.selectedSubCategory);return s?{subDesign:s,archetype:a.activeArchetype||"game",componentTab:a.activeComponentTab||"hero",device:a.sandboxDevice||"desktop",liveTweaks:a.liveTweaks||s.defaultTweaks||{},locale:a.locale||"ko",localeEpoch:t?.epoch||0,localeSnapshot:t}:null}function Oe(a,e,t="",s=F()){const n=ke(a,e,s);if(!n)return null;const{subDesign:r,archetype:o,device:c,liveTweaks:d,localeSnapshot:i,localeEpoch:m}=n;return{context:n,css:{full:I(r,d,o,"full",i),tokens:I(r,d,o,"tokens",i),component:I(r,d,o,"component",i)},html:t,markdown:ve(r,d,o,c,i),json:fe(r,d,i),epoch:m}}export{Se as a,Ie as b,Ce as c,le as d,de as e,ke as f,Te as g,Re as h,Me as i,Oe as j,Ee as r};
