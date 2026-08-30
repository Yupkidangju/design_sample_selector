/**
 * Preview Renderer Definitions v2.0
 * Generates bespoke interactive HTML snippets for all 24 Subcategories across 4 Component Tabs:
 * 1. Hero Landing Section ('hero')
 * 2. Dashboard & Widget Card ('widget')
 * 3. Form & Interactive Controls ('form')
 * 4. Pricing & Feature Card ('pricing')
 */

import { PREVIEW_COMPONENT_TABS } from './contract.js';

// --- 01. Swiss Style ---
function renderSwissMockup(tab, sub) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit swiss-unit">
        <div class="swiss-header"><span>METRICS SYSTEM</span><span>№ 04.B</span></div>
        <div class="swiss-data-grid">
          <div class="swiss-stat-cell">
            <span class="lbl">EFFICIENCY</span>
            <span class="val">99.4%</span>
          </div>
          <div class="swiss-stat-cell active">
            <span class="lbl">LATENCY</span>
            <span class="val">0.04 MS</span>
          </div>
          <div class="swiss-stat-cell">
            <span class="lbl">GRID ACCURACY</span>
            <span class="val">100%</span>
          </div>
        </div>
      </div>
    `;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit swiss-unit">
        <h3 class="swiss-sub-heading">01. INQUIRY FORM</h3>
        <div class="swiss-form-fields">
          <div class="field-row">
            <label>PROJECT SPECIFICATION</label>
            <input type="text" class="swiss-input" placeholder="Enter typography parameters..." value="Helvetica Modernism 1957" />
          </div>
          <div class="field-row-split">
            <label class="swiss-check"><input type="checkbox" checked /> Strict 12-Column</label>
            <label class="swiss-check"><input type="checkbox" checked /> Red Accent (#FF3300)</label>
          </div>
          <button class="swiss-btn-submit" data-mock-action="toast" data-mock-msg="Form Submitted!">EXECUTE SUBMISSION →</button>
        </div>
      </div>
    `;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit swiss-unit">
        <div class="swiss-pricing-grid">
          <div class="swiss-plan-card">
            <span class="plan-num">01 / BASIC</span>
            <h4 class="plan-price">$29<span>/MO</span></h4>
            <p>Mathematical typography baseline, 8 grid modules, standard export.</p>
            <button class="swiss-plan-btn" data-mock-action="toast" data-mock-msg="Selected Basic">SELECT PLAN</button>
          </div>
          <div class="swiss-plan-card active-plan">
            <span class="plan-num">02 / STUDIO</span>
            <h4 class="plan-price">$89<span>/MO</span></h4>
            <p>Unlimited geometric layouts, custom variable typography, full vector exports.</p>
            <button class="swiss-plan-btn" data-mock-action="toast" data-mock-msg="Selected Studio">START TRIAL</button>
          </div>
        </div>
      </div>
    `;
  }
  return `
    <div class="mockup-unit swiss-unit">
      <div class="swiss-header">
        <span class="swiss-logo">HELVETICA 1957</span>
        <span class="swiss-num">№ 01</span>
      </div>
      <div class="swiss-grid-layout">
        <div class="swiss-col-main">
          <h1 class="swiss-title">DESIGN<br>SYSTEMS</h1>
          <p class="swiss-para">Visual order achieved through mathematical proportion, grid systems, and high contrast typography.</p>
          <button class="swiss-btn" data-mock-action="toast" data-mock-msg="Swiss Grid Action Triggered!">EXPLORE GRID</button>
        </div>
        <div class="swiss-col-side">
          <div class="swiss-box-red"><span>100% GRID</span></div>
          <div class="swiss-box-lines"><div class="line"></div><div class="line"></div><div class="line"></div></div>
        </div>
      </div>
    </div>
  `;
}

// --- 02. Corporate Minimalist ---
function renderCorporateMockup(tab, sub) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit corp-unit">
        <div class="corp-dash-head">
          <span class="corp-pill">Live Telemetry</span>
          <span class="corp-time">Updated 2s ago</span>
        </div>
        <div class="corp-stat-boxes">
          <div class="corp-box">
            <span class="c-lbl">Active Instances</span>
            <span class="c-val">1,420</span>
            <span class="c-trend positive">+14.2%</span>
          </div>
          <div class="corp-box">
            <span class="c-lbl">API Throughput</span>
            <span class="c-val">98.2k/s</span>
            <span class="c-trend positive">+5.1%</span>
          </div>
        </div>
      </div>
    `;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit corp-unit">
        <h4 class="corp-form-title">Create Cloud Cluster</h4>
        <div class="corp-form">
          <input type="text" class="corp-input" placeholder="Cluster Identifier" value="prod-eu-central-01" />
          <select class="corp-input"><option>Enterprise Tier (32 vCPU / 128GB RAM)</option></select>
          <button class="corp-btn-primary" data-mock-action="toast" data-mock-msg="Cluster Provisioning Started!">Deploy Infrastructure</button>
        </div>
      </div>
    `;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit corp-unit">
        <div class="corp-price-card">
          <span class="badge-blue">ENTERPRISE CLOUD</span>
          <h3 class="corp-price-tag">$499<small>/month</small></h3>
          <ul class="corp-check-list">
            <li>✓ Dedicated 99.999% SLA</li>
            <li>✓ Multi-Region Failover</li>
            <li>✓ 24/7 Security Operations</li>
          </ul>
          <button class="corp-btn-primary" data-mock-action="toast" data-mock-msg="Enterprise Contact Requested!">Contact Enterprise Sales</button>
        </div>
      </div>
    `;
  }
  return `
    <div class="mockup-unit corp-unit">
      <div class="corp-header">
        <div class="corp-logo">⚡ CloudSaaS Pro</div>
        <div class="corp-nav"><span>Features</span><span>Solutions</span><button class="corp-cta-sm" data-mock-action="toast" data-mock-msg="Sign In">Sign In</button></div>
      </div>
      <div class="corp-hero">
        <span class="corp-badge">Enterprise Ready</span>
        <h2 class="corp-title">Accelerate Your Cloud Infrastructure</h2>
        <p class="corp-subtitle">Empower engineering teams with automated deployment pipelines and real-time observability.</p>
        <div class="corp-btn-group">
          <button class="corp-btn-primary" data-mock-action="toast" data-mock-msg="Free Trial Started!">Start Free Trial</button>
          <button class="corp-btn-secondary" data-mock-action="toast" data-mock-msg="Demo Video Playing!">Watch Demo ▶</button>
        </div>
      </div>
    </div>
  `;
}

// --- 03. High-Contrast Mono ---
function renderMonoMockup(tab, sub) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit mono-unit">
        <div class="mono-bar"><span class="c-green">> CPU_PROFILE</span><span>[THREAD_08]</span></div>
        <div class="mono-graph-box">
          <div class="mono-line">[||||||||||||||||....] 78.4% OCCUPANCY</div>
          <div class="mono-line">[||||||||||||||||||||] 100% BUFFER SYNC</div>
          <div class="mono-line c-green">>> WASM_JIT_CACHE: HOT</div>
        </div>
      </div>
    `;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit mono-unit">
        <div class="mono-bar">> CONFIG_INSPECTOR</div>
        <div class="mono-form">
          <label class="mono-lbl">PARAM_TARGET:</label>
          <input type="text" class="mono-input" value="https://api.v2.spectr.io" />
          <button class="mono-btn" data-mock-action="toast" data-mock-msg="CLI Config Saved!">[ SAVE CONFIG ]</button>
        </div>
      </div>
    `;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit mono-unit">
        <div class="mono-box">
          <div class="mono-line c-green">> DEVELOPER_LICENSE</div>
          <h3 class="mono-price">$0.00 / FREE & OPEN SOURCE</h3>
          <p class="mono-desc">Full access to CLI binaries, WebAssembly modules, and local telemetry.</p>
          <button class="mono-btn" data-mock-action="toast" data-mock-msg="License Downloaded!">[ DOWNLOAD BINARY ]</button>
        </div>
      </div>
    `;
  }
  return `
    <div class="mockup-unit mono-unit">
      <div class="mono-header">
        <span class="mono-prompt">root@system-terminal:~#<span class="mono-caret"></span></span>
        <span class="mono-status">[ONLINE]</span>
      </div>
      <div class="mono-body">
        <div class="mono-line"><span class="c-green">> INIT</span> System Inspector v2.0</div>
        <div class="mono-line"><span class="c-blue">> MEMORY:</span> 16384MB / 32768MB (50%)</div>
        <div class="mono-line"><span class="c-green">> STATUS:</span> ALL SYSTEMS OPERATIONAL</div>
        <div class="mono-box">
          <code>$ agy --audit --target ./src</code>
          <button class="mono-btn" data-mock-action="toast" data-mock-msg="Monospace CLI Executed!">[ RUN COMMAND ]</button>
        </div>
      </div>
    </div>
  `;
}

// --- 04. Raw Digital Brutalism ---
function renderRawBrutalMockup(tab, sub) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit raw-brutal-unit">
        <div class="raw-top"><span class="raw-title-tag">★ SYSTEM_METRICS</span><span class="raw-blink">[LIVE]</span></div>
        <div class="raw-row">
          <div class="raw-box yellow"><h3>LOAD: 98%</h3><p>CRITICAL MAXIMUM</p></div>
          <div class="raw-box pink"><h3>ERR: 0</h3><p>ZERO EXCEPTION</p></div>
        </div>
        <button class="raw-btn" data-mock-action="toast" data-mock-msg="Raw Brutal Dump Exported!">DUMP TELEMETRY ⚡</button>
      </div>
    `;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit raw-brutal-unit">
        <div class="raw-top"><span>RAW_INPUT_PROMPT</span><span>[NO_JS_CSS]</span></div>
        <div class="raw-form-body">
          <input type="text" class="raw-input" placeholder="RAW_COMMAND_STRING..." value="PURGE_CACHE --HARD" />
          <button class="raw-btn" data-mock-action="toast" data-mock-msg="Raw Command Submitted!">EXECUTE IMMEDIATE →</button>
        </div>
      </div>
    `;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit raw-brutal-unit">
        <div class="raw-box pink">
          <h2 class="raw-head">$666<span style="font-size:14px;">/LIFETIME</span></h2>
          <p>RAW CODE, ZERO FRAMEWORKS, PURE BRUTAL HTML SPEED.</p>
          <button class="raw-btn" style="background:#000000;color:#FFFF00;" data-mock-action="toast" data-mock-msg="Raw Tier Purchased!">CLAIM ACCESS NOW</button>
        </div>
      </div>
    `;
  }
  return `
    <div class="mockup-unit raw-brutal-unit">
      <div class="raw-top"><span class="raw-title-tag">★ RAW_WEB_99</span><span class="raw-blink">[HTML_ONLY]</span></div>
      <h2 class="raw-head">NO COMPROMISE.<br>PURE IMPACT.</h2>
      <div class="raw-row">
        <div class="raw-box yellow"><h3>BOX 01</h3><p>Default fonts, harsh 4px borders, zero apologies.</p></div>
        <div class="raw-box pink"><h3>BOX 02</h3><p>Pure magenta screaming for user engagement.</p></div>
      </div>
      <button class="raw-btn" data-mock-action="toast" data-mock-msg="Raw Brutal Action Clicked!">PUNCH THIS BUTTON</button>
    </div>
  `;
}

// --- 05. Trendy Neo-Brutalism ---
function renderNeoBrutalMockup(tab, sub) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit neo-unit">
        <div class="neo-widget-box">
          <span class="neo-badge yellow">⚡ XP BOOST</span>
          <h3 class="neo-widget-title">3,850 XP EARNED</h3>
          <div class="neo-progress"><div class="neo-bar-fill"></div></div>
          <button class="neo-btn pink" data-mock-action="toast" data-mock-msg="Claimed 3,850 XP!">Claim Rewards</button>
        </div>
      </div>
    `;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit neo-unit">
        <h3 class="neo-widget-title">🚀 Join Neo Club</h3>
        <div class="neo-form">
          <input type="text" class="neo-input" placeholder="Your Radical Nickname" value="PixelRider99" />
          <button class="neo-btn yellow" data-mock-action="toast" data-mock-msg="Signed up to Neo Club!">Sign Me Up!</button>
        </div>
      </div>
    `;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit neo-unit">
        <div class="neo-price-box">
          <span class="neo-badge coral">POPULAR</span>
          <h2 class="neo-price-val">$19<span>/mo</span></h2>
          <p>Unlimited stickers, pastel components, and hard 5px shadows.</p>
          <button class="neo-btn blue" data-mock-action="toast" data-mock-msg="Subscribed to Neo Pro!">Get Neo Pro →</button>
        </div>
      </div>
    `;
  }
  return `
    <div class="mockup-unit neo-unit">
      <div class="neo-nav"><span class="neo-logo">⚡ NEO_POP</span><span class="neo-badge blue">TRENDY</span></div>
      <h2 class="neo-hero-title">MAKE YOUR UI POP & BOUNCE!</h2>
      <p class="neo-hero-desc">Thick 3px solid black outlines with 5px solid drop shadows on playful pastel backgrounds.</p>
      <div class="neo-btn-row">
        <button class="neo-btn yellow" data-mock-action="toast" data-mock-msg="Neo Action 1">Explore Styles</button>
        <button class="neo-btn pink" data-mock-action="toast" data-mock-msg="Neo Action 2">Get Started →</button>
      </div>
    </div>
  `;
}

// --- 06. Cyber Brutalism ---
function renderCyberpunkMockup(tab, sub) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit cyber-unit">
        <div class="cyber-header"><span class="cyber-glitch">HUD_TELEMETRY</span><span class="cyber-status">120 FPS</span></div>
        <div class="cyber-frame">
          <div class="cyber-stat-row">
            <span class="c-green">SYNAPSE LOAD: 84.2%</span>
            <span class="c-blue">NEURAL LINK: SYNCED</span>
          </div>
          <div class="cyber-bar"><div class="cyber-bar-fill"></div></div>
          <button class="cyber-btn" data-mock-action="toast" data-mock-msg="Cyber Pulse Fired!">OVERCLOCK CORE</button>
        </div>
      </div>
    `;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit cyber-unit">
        <div class="cyber-header"><span>TERMINAL_ACCESS</span><span>SEC_LVL_9</span></div>
        <div class="cyber-frame">
          <input type="text" class="cyber-input" value="NEO_TOKYO_PASSKEY_902" />
          <button class="cyber-btn" data-mock-action="toast" data-mock-msg="Cyber Terminal Authenticated!">DECRYPT ACCESS</button>
        </div>
      </div>
    `;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit cyber-unit">
        <div class="cyber-frame">
          <span class="cyber-badge">NETRUNNER PASS</span>
          <h2 class="cyber-price">₮ 890<small>/CYCLE</small></h2>
          <p class="cyber-code">> UNLIMITED NEON SHADERS & WASM ACCELERATION</p>
          <button class="cyber-btn" data-mock-action="toast" data-mock-msg="Cyber Pass Acquired!">JACK IN NOW ⚡</button>
        </div>
      </div>
    `;
  }
  return `
    <div class="mockup-unit cyber-unit">
      <div class="cyber-header"><span class="cyber-glitch" data-text="CYBER_SYSTEM">CYBER_SYSTEM</span><span class="cyber-status">[ONLINE]</span></div>
      <div class="cyber-frame">
        <p class="cyber-code">> INITIALIZING NEON_PROTOCOL...</p>
        <p class="cyber-code">> WASM_SIMD: 120 FPS</p>
        <div class="cyber-bar"><div class="cyber-bar-fill"></div></div>
        <button class="cyber-btn" data-mock-action="toast" data-mock-msg="Cyberpunk Glitch Triggered!">EXECUTE SYSTEM</button>
      </div>
    </div>
  `;
}

// --- 07. Glassmorphism ---
function renderGlassmorphismMockup(tab, sub) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit glass-unit">
        <div class="glass-bg-orb orb-1"></div><div class="glass-bg-orb orb-2"></div>
        <div class="glass-panel">
          <div class="glass-head"><span class="g-icon">💎</span><span>CRYSTAL TELEMETRY</span></div>
          <div class="glass-metric"><span class="g-val">99.98%</span><span class="g-lbl">Clarity Index</span></div>
          <div class="glass-metric"><span class="g-val">20px</span><span class="g-lbl">Backdrop Blur</span></div>
        </div>
      </div>
    `;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit glass-unit">
        <div class="glass-bg-orb orb-1"></div>
        <div class="glass-panel">
          <h3 class="glass-title">Frosted Security Access</h3>
          <input type="text" class="glass-input" placeholder="Passkey Token" value="FROST-9021-X" />
          <button class="glass-btn" data-mock-action="toast" data-mock-msg="Glass Key Verified!">Authenticate</button>
        </div>
      </div>
    `;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit glass-unit">
        <div class="glass-bg-orb orb-2"></div>
        <div class="glass-panel">
          <span class="glass-badge">PREMIUM GLASS</span>
          <h2 class="glass-price">$49<small>/mo</small></h2>
          <p class="glass-text">Full translucent shader library, dynamic reflection layers, multi-device sync.</p>
          <button class="glass-btn" data-mock-action="toast" data-mock-msg="Glass Pro Activated!">Upgrade to Glass Pro</button>
        </div>
      </div>
    `;
  }
  return `
    <div class="mockup-unit glass-unit">
      <div class="glass-bg-orb orb-1"></div>
      <div class="glass-bg-orb orb-2"></div>
      <div class="glass-panel">
        <div class="glass-head"><span class="g-icon">💎</span><span class="g-title">FROSTED GLASS CARD</span></div>
        <p class="glass-text">Real-time backdrop-filter blur(20px) with translucent crystal borders and ambient background spheres.</p>
        <button class="glass-btn" data-mock-action="toast" data-mock-msg="Glassmorphism Clicked!">Interact With Glass</button>
      </div>
    </div>
  `;
}

// --- 08. Neumorphism ---
function renderNeumorphismMockup(tab, sub) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit neu-unit">
        <div class="neu-panel">
          <h4 class="neu-title">SENSORY TELEMETRY</h4>
          <div class="neu-metric-row">
            <div class="neu-inset-box"><span class="neu-val">24.5°C</span><span class="neu-lbl">AMBIENT</span></div>
            <div class="neu-inset-box"><span class="neu-val">68%</span><span class="neu-lbl">HUMIDITY</span></div>
          </div>
          <button class="neu-btn active" style="margin-top:14px;" data-mock-action="toast" data-mock-msg="Sensor Calibrated!">CALIBRATE SENSOR</button>
        </div>
      </div>
    `;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit neu-unit">
        <div class="neu-panel">
          <h4 class="neu-title">TACTILE INPUT CONTROLS</h4>
          <input type="text" class="neu-inset-input" value="Soft Tactile String" />
          <div class="neu-btn-row">
            <button class="neu-btn active" data-mock-action="toast" data-mock-msg="Option A Selected!">OPTION A</button>
            <button class="neu-btn" data-mock-action="toast" data-mock-msg="Option B Selected!">OPTION B</button>
          </div>
        </div>
      </div>
    `;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit neu-unit">
        <div class="neu-panel">
          <h3 class="neu-title">NEUMORPHIC PRO</h3>
          <h2 class="neu-price">$39<span>/MO</span></h2>
          <p class="neu-desc">Soft extruded bevel shaders, light source angle control, zero-harsh edges.</p>
          <button class="neu-btn active" data-mock-action="toast" data-mock-msg="Neumorphic Pro Subscribed!">ACTIVATE PLAN</button>
        </div>
      </div>
    `;
  }
  return `
    <div class="mockup-unit neu-unit">
      <div class="neu-panel">
        <h3 class="neu-title">TACTILE AUDIO DIAL</h3>
        <div class="neu-dial-wrapper">
          <div class="neu-dial-outer"><div class="neu-dial-inner"><span class="neu-dot"></span></div></div>
        </div>
        <div class="neu-btn-row">
          <button class="neu-btn active" data-mock-action="toast" data-mock-msg="Neumorphic Power Pushed!">POWER</button>
          <button class="neu-btn" data-mock-action="toast" data-mock-msg="Neumorphic Mute Pushed!">MUTE</button>
        </div>
      </div>
    </div>
  `;
}

// --- 09. Skeuomorphism ---
function renderSkeuomorphismMockup(tab, sub) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit skeuo-unit">
        <div class="skeuo-chassis">
          <div class="skeuo-header"><span class="skeuo-brand">VU GAUGES MK-II</span><span class="skeuo-led"></span></div>
          <div class="skeuo-cluster">
            <div class="skeuo-meter"><div class="meter-face"><span class="needle" style="transform: rotate(20deg);"></span></div><span class="k-lbl">LEFT CH</span></div>
            <div class="skeuo-meter"><div class="meter-face"><span class="needle" style="transform: rotate(45deg);"></span></div><span class="k-lbl">RIGHT CH</span></div>
          </div>
          <button class="skeuo-switch" data-mock-action="toast" data-mock-msg="Stereo Sync Engaged!">STEREO SYNC [ENGAGED]</button>
        </div>
      </div>
    `;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit skeuo-unit">
        <div class="skeuo-chassis">
          <h4 class="skeuo-brand" style="margin-bottom:12px;">ANALOG FREQUENCY TUNER</h4>
          <input type="text" class="skeuo-input" value="FM 107.7 MHz Vintage" />
          <button class="skeuo-switch" data-mock-action="toast" data-mock-msg="Frequency Tuned!">LOCK STATION 📻</button>
        </div>
      </div>
    `;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit skeuo-unit">
        <div class="skeuo-chassis">
          <span class="skeuo-brass-badge">GOLD EDITION 1978</span>
          <h2 class="skeuo-price">$120<small>/UNIT</small></h2>
          <p style="font-size:12px;color:#d4af37;margin:8px 0;">Handcrafted real leather texture, brushed brass bevels, analog meters.</p>
          <button class="skeuo-switch" data-mock-action="toast" data-mock-msg="Gold Unit Ordered!">ORDER HARDWARE ✦</button>
        </div>
      </div>
    `;
  }
  return `
    <div class="mockup-unit skeuo-unit">
      <div class="skeuo-chassis">
        <div class="skeuo-header"><span class="skeuo-brand">ANALOG AMPLIFIER MK-II</span><span class="skeuo-led"></span></div>
        <div class="skeuo-cluster">
          <div class="skeuo-knob"><div class="knob-cap"><span class="notch"></span></div><span class="k-lbl">GAIN</span></div>
          <div class="skeuo-meter"><div class="meter-face"><span class="needle"></span></div><span class="k-lbl">VU METER</span></div>
        </div>
        <button class="skeuo-switch" data-mock-action="toast" data-mock-msg="Analog Switch Flipped!">POWER SWITCH [ON]</button>
      </div>
    </div>
  `;
}

// --- 10. Memphis Pop ---
function renderMemphisMockup(tab, sub) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit memphis-unit">
        <div class="memphis-shape shape-circle"></div>
        <div class="memphis-card">
          <span class="memphis-tag">⚡ ENERGY LEVEL</span>
          <h3 class="memphis-stat">9,999 MEGA-JOULES</h3>
          <div class="memphis-bar"><div class="memphis-fill"></div></div>
          <button class="memphis-btn" data-mock-action="toast" data-mock-msg="Energy Boosted!">BOOST ENERGY!</button>
        </div>
      </div>
    `;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit memphis-unit">
        <div class="memphis-shape shape-triangle"></div>
        <div class="memphis-card">
          <h3 class="memphis-title">80s POP REGISTER</h3>
          <input type="text" class="memphis-input" value="RadicalConfetti88" />
          <button class="memphis-btn" data-mock-action="toast" data-mock-msg="Memphis Member Registered!">JOIN THE PARTY 🎉</button>
        </div>
      </div>
    `;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit memphis-unit">
        <div class="memphis-card">
          <span class="memphis-badge">SUPER POP</span>
          <h2 class="memphis-price">$28<span>/MO</span></h2>
          <p class="memphis-desc">80s geometric confetti, squiggly vectors, high-saturation color explosions.</p>
          <button class="memphis-btn" data-mock-action="toast" data-mock-msg="Memphis Pro Claimed!">GET POP ACCESS</button>
        </div>
      </div>
    `;
  }
  return `
    <div class="mockup-unit memphis-unit">
      <div class="memphis-shape shape-circle"></div>
      <div class="memphis-shape shape-triangle"></div>
      <div class="memphis-card">
        <h2 class="memphis-title">MEMPHIS POP!</h2>
        <p class="memphis-desc">80s Geometric Patterns & Vivid Confetti Colors</p>
        <button class="memphis-btn" data-mock-action="toast" data-mock-msg="Memphis Pop Bounce!">BOUNCE!</button>
      </div>
    </div>
  `;
}

// --- 11. 80s Synthwave ---
function renderSynthwaveMockup(tab, sub) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit retro-unit">
        <div class="retro-sun"></div>
        <div class="retro-card">
          <div class="retro-top-bar"><span>RPM_TELEMETRY</span><span>TURBO: ON</span></div>
          <div class="retro-eq-bars">
            <div class="eq-col"></div><div class="eq-col"></div><div class="eq-col"></div><div class="eq-col"></div><div class="eq-col"></div>
          </div>
          <button class="retro-btn" data-mock-action="toast" data-mock-msg="Synth Nitro Activated!">ENGAGE NITRO 🏎️</button>
        </div>
      </div>
    `;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit retro-unit">
        <div class="retro-card">
          <h3 class="retro-title" style="font-size:18px;">CASSETTE DECK 1984</h3>
          <input type="text" class="retro-input" value="Kavinsky // Nightcall" />
          <button class="retro-btn" data-mock-action="toast" data-mock-msg="Cassette Track Loaded!">INSERT TAPE ▶</button>
        </div>
      </div>
    `;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit retro-unit">
        <div class="retro-card">
          <span class="retro-badge">OUTRUN PASS</span>
          <h2 class="retro-price">$19.84<span>/MO</span></h2>
          <p class="retro-subtitle">Neon grid horizon, wireframe shaders, 80s synth procedural tracks.</p>
          <button class="retro-btn" data-mock-action="toast" data-mock-msg="Outrun Subscribed!">CRUISE NOW 🌴</button>
        </div>
      </div>
    `;
  }
  return `
    <div class="mockup-unit retro-unit">
      <div class="retro-sun"></div>
      <div class="retro-grid-plane"></div>
      <div class="retro-card">
        <h2 class="retro-title">SYNTHWAVE 1984</h2>
        <p class="retro-subtitle">Perspective Wireframe Grids & Neon Sun</p>
        <button class="retro-btn" data-mock-action="toast" data-mock-msg="Outrun Initiated!">ENTER OUTRUN</button>
      </div>
    </div>
  `;
}

// --- 12. Vaporwave ---
function renderVaporwaveMockup(tab, sub) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit vapor-unit">
        <div class="vapor-window">
          <div class="vapor-titlebar"><span>AESTHETIC_SYS.DAT</span><span class="win-ctrls">[-][□][✕]</span></div>
          <div class="vapor-body">
            <div class="vapor-stat-box">
              <span>STATUE RESONANCE: 99.4%</span>
              <span>TEA_CHILL: MAXIMUM</span>
            </div>
            <button class="vapor-btn" data-mock-action="toast" data-mock-msg="Vapor Waveforms Synced!">SYNCHRONIZE 美学</button>
          </div>
        </div>
      </div>
    `;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit vapor-unit">
        <div class="vapor-window">
          <div class="vapor-titlebar"><span>DIAL_UP_CONFIG</span><span class="win-ctrls">[✕]</span></div>
          <div class="vapor-body">
            <input type="text" class="vapor-input" value="AOL_ARIZONA_ICED_TEA" />
            <button class="vapor-btn" data-mock-action="toast" data-mock-msg="Dial-Up Connected!">DIAL 56K MODEM ☎</button>
          </div>
        </div>
      </div>
    `;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit vapor-unit">
        <div class="vapor-window">
          <div class="vapor-titlebar"><span>SHAREWARE_LICENSE</span><span class="win-ctrls">[?]</span></div>
          <div class="vapor-body">
            <h2 class="vapor-heading">$9.95<span>/WIN95</span></h2>
            <p class="vapor-text">Lo-Fi TV scanlines, pastel lavender hues, marble statue vectors.</p>
            <button class="vapor-btn" data-mock-action="toast" data-mock-msg="Shareware Unlocked!">PURCHASE FLOPPY 💾</button>
          </div>
        </div>
      </div>
    `;
  }
  return `
    <div class="mockup-unit vapor-unit">
      <div class="vapor-window">
        <div class="vapor-titlebar"><span>VAPOR_CHILL.EXE</span><span class="win-ctrls">[-][□][✕]</span></div>
        <div class="vapor-body">
          <h2 class="vapor-heading">美学 90S VAPOR</h2>
          <p class="vapor-text">Lo-Fi TV Scanlines & Pastel Lavender</p>
          <button class="vapor-btn" data-mock-action="toast" data-mock-msg="Lo-Fi Music Triggered!">PLAY LO-FI ♪</button>
        </div>
      </div>
    </div>
  `;
}

// --- 13. High-Fashion Editorial ---
function renderEditorialMockup(tab, sub) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit ed-unit">
        <div class="editorial-header"><span class="ed-tag">ATELIER METRICS</span><span class="ed-num">№ 08</span></div>
        <div class="ed-widget-grid">
          <div class="ed-stat-col"><span class="lbl">CIRCULATION</span><span class="val">140K</span></div>
          <div class="ed-stat-col"><span class="lbl">ENGAGEMENT</span><span class="val">98.2%</span></div>
        </div>
        <button class="ed-btn" data-mock-action="toast" data-mock-msg="Atelier Report Opened!">VIEW FULL DISPATCH →</button>
      </div>
    `;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit ed-unit">
        <div class="editorial-header"><span class="ed-tag">VIP DISPATCH</span><span class="ed-num">PRIVATE</span></div>
        <div class="ed-form-box">
          <input type="text" class="ed-input" value="editor-in-chief@vogue-paris.fr" />
          <button class="ed-btn" data-mock-action="toast" data-mock-msg="Invitation Dispatched!">REQUEST INVITATION →</button>
        </div>
      </div>
    `;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit ed-unit">
        <div class="editorial-header"><span class="ed-tag">HAUTE COUTURE</span><h2 class="ed-title">$180<small>/ISSUE</small></h2></div>
        <p class="ed-lead">Silk-screened quarterly hardcover, bespoke variable serif fonts, gold foil stamping.</p>
        <button class="ed-btn" data-mock-action="toast" data-mock-msg="Haute Membership Confirmed!">SUBSCRIBE EDITION →</button>
      </div>
    `;
  }
  return `
    <div class="mockup-unit ed-unit">
      <div class="editorial-header"><span class="ed-tag">ISSUE № 42</span><h1 class="ed-title">VOGUE & ELEGANCE</h1></div>
      <div class="editorial-layout">
        <div class="ed-column-text">
          <p class="ed-lead">A dramatic exploration of high-fashion serif typography, champagne accents, and timeless editorial layouts.</p>
          <button class="ed-btn" data-mock-action="toast" data-mock-msg="Editorial Story Opened!">READ STORY →</button>
        </div>
      </div>
    </div>
  `;
}

// --- 14. Fluid Organic ---
function renderOrganicMockup(tab, sub) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit organic-unit">
        <div class="organic-blob-bg"></div>
        <div class="organic-card">
          <span class="organic-badge">🌱 Biophilic Vitals</span>
          <div class="organic-stat-row">
            <span class="org-stat">94% Natural</span>
            <span class="org-stat">0 Carbon</span>
          </div>
          <button class="organic-btn" data-mock-action="toast" data-mock-msg="Bio Vitals Refreshed!">Harmonize Vitals</button>
        </div>
      </div>
    `;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit organic-unit">
        <div class="organic-blob-bg"></div>
        <div class="organic-card">
          <h3 class="organic-title">Join Forest Circle</h3>
          <input type="text" class="organic-input" value="earth-gardener@sol.eco" />
          <button class="organic-btn" data-mock-action="toast" data-mock-msg="Forest Circle Joined!">Plant Seed 🌿</button>
        </div>
      </div>
    `;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit organic-unit">
        <div class="organic-card">
          <span class="organic-badge">SUSTAINABLE HARVEST</span>
          <h2 class="organic-price">$24<small>/mo</small></h2>
          <p class="organic-desc">Soft fluid curves with 40px rounded corners and comfortable natural earth tones.</p>
          <button class="organic-btn" data-mock-action="toast" data-mock-msg="Earth Plan Selected!">Cultivate Plan</button>
        </div>
      </div>
    `;
  }
  return `
    <div class="mockup-unit organic-unit">
      <div class="organic-blob-bg"></div>
      <div class="organic-card">
        <span class="organic-badge">🌿 Natural Harmony</span>
        <h2 class="organic-title">Warm Clay & Pine</h2>
        <p class="organic-desc">Soft fluid curves with 40px rounded corners and comfortable natural earth tones.</p>
        <button class="organic-btn" data-mock-action="toast" data-mock-msg="Organic Explored!">Explore Nature</button>
      </div>
    </div>
  `;
}

// --- 15. Dark Mode Minimal Glass ---
function renderDarkmodeMockup(tab, sub) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit dm-unit">
        <div class="darkmode-header"><span class="dm-logo">TELEMETRY PRO</span><span class="dm-status">OLED 0.00 NIT</span></div>
        <div class="darkmode-card-grid">
          <div class="dm-card"><span class="dm-num">0.02ms</span><span class="dm-lbl">Latency</span></div>
          <div class="dm-card glow"><span class="dm-num">120 FPS</span><span class="dm-lbl">Smooth</span></div>
        </div>
        <button class="dm-btn" data-mock-action="toast" data-mock-msg="OLED Pipeline Synced!">Sync Low-Light Engine</button>
      </div>
    `;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit dm-unit">
        <div class="darkmode-header"><span>SECURE AUTH</span><span>ENCRYPTED</span></div>
        <div class="dm-form-box">
          <input type="text" class="dm-input" value="oled-master@spectr.dark" />
          <button class="dm-btn" data-mock-action="toast" data-mock-msg="Dark Mode Key Accepted!">Authenticate Securely</button>
        </div>
      </div>
    `;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit dm-unit">
        <span class="dm-badge">OLED ULTIMATE</span>
        <h2 class="dm-price">$34<small>/mo</small></h2>
        <p style="font-size:12px;color:#94a3b8;margin:10px 0;">True #000000 deep contrast, subtle border luminescence, reduced battery drain.</p>
        <button class="dm-btn" data-mock-action="toast" data-mock-msg="Dark Glass Pro Activated!">Unlock OLED Tier</button>
      </div>
    `;
  }
  return `
    <div class="mockup-unit dm-unit">
      <div class="darkmode-header"><span class="dm-logo">✨ DARK GLASS PRO</span><span class="dm-status">OLED Optimized</span></div>
      <div class="darkmode-card-grid">
        <div class="dm-card"><span class="dm-num">4.9 ★</span><span class="dm-lbl">User Rating</span></div>
        <div class="dm-card glow"><span class="dm-num">0.02ms</span><span class="dm-lbl">Latency</span></div>
      </div>
      <button class="dm-btn" data-mock-action="toast" data-mock-msg="Platform Launched!">Launch Platform</button>
    </div>
  `;
}

// --- 16. Y2K Chrome & Hologram ---
function renderY2kChromeMockup(tab, sub) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit y2k-unit">
        <div class="y2k-panel">
          <span class="y2k-pill">💿 MILLENNIUM DISC</span>
          <div class="y2k-disc-spin"><div class="disc-hole"></div></div>
          <span class="y2k-track-name">TRACK 01 // CYBER_GIRL.MP3</span>
        </div>
      </div>
    `;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit y2k-unit">
        <div class="y2k-panel">
          <h3 class="y2k-title">★ Hologram Messenger</h3>
          <input type="text" class="y2k-input" placeholder="Cyber Avatar ID" value="Neo_Princess_2000" />
          <button class="y2k-btn" data-mock-action="toast" data-mock-msg="Y2K Message Sent!">CONNECT AOL ⚡</button>
        </div>
      </div>
    `;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit y2k-unit">
        <div class="y2k-panel">
          <span class="y2k-pill">CYBER PASS 2000</span>
          <h2 class="y2k-price">$20.00<span>/YR</span></h2>
          <p class="y2k-desc">Full metallic holographic skins, glitter sparkles, MP3 ringtones.</p>
          <button class="y2k-btn" data-mock-action="toast" data-mock-msg="Y2K Pass Unlocked!">UNLOCK PASS ✨</button>
        </div>
      </div>
    `;
  }
  return `
    <div class="mockup-unit y2k-unit">
      <div class="y2k-panel">
        <div class="y2k-head"><span class="y2k-star">★ ★ ★</span><span>Y2K CYBERSPACE</span><span class="y2k-star">★ ★ ★</span></div>
        <h1 class="y2k-title">METALLIC CHROME & HOLO SHIMMER</h1>
        <p class="y2k-desc">Year 2000 cyber-pop aesthetic with silver chrome gradients, oval pill buttons, and glittering nostalgia.</p>
        <button class="y2k-btn" data-mock-action="toast" data-mock-msg="Y2K Millennium Entered!">ENTER 2000S MATRIX</button>
      </div>
    </div>
  `;
}

// --- 17. Frutiger Aero Aqua Gloss ---
function renderFrutigerAeroMockup(tab, sub) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit aero-unit">
        <div class="aero-bubble-card">
          <div class="aero-sphere"></div>
          <h3 class="aero-head">Clean Aqua Eco</h3>
          <div class="aero-stats"><span class="a-num">100%</span><span class="a-lbl">Purity</span></div>
        </div>
      </div>
    `;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit aero-unit">
        <div class="aero-bubble-card">
          <h3 class="aero-head">Aqua Cloud Sync</h3>
          <input type="text" class="aero-input" placeholder="User Sphere Name" value="AquaBreeze@Aero.web" />
          <button class="aero-btn" data-mock-action="toast" data-mock-msg="Synced with Aqua Cloud!">Sync Now 💧</button>
        </div>
      </div>
    `;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit aero-unit">
        <div class="aero-bubble-card">
          <span class="aero-badge">UTOPIA AERO</span>
          <h2 class="aero-price">$15<small>/mo</small></h2>
          <p class="aero-desc">Glossy liquid themes, water droplet animations, transparent glass spheres.</p>
          <button class="aero-btn" data-mock-action="toast" data-mock-msg="Subscribed to Aero Utopia!">Drink Aqua Pro</button>
        </div>
      </div>
    `;
  }
  return `
    <div class="mockup-unit aero-unit">
      <div class="aero-bubble-card">
        <div class="aero-sky-banner"><span>☁ FRUTIGER AERO SKY</span></div>
        <div class="aero-sphere"></div>
        <h2 class="aero-head">Clear Aqua & Glossy Glass</h2>
        <p class="aero-desc">Transparent water droplets, vibrant green hills, and pure optimism of the mid-2000s web era.</p>
        <button class="aero-btn" data-mock-action="toast" data-mock-msg="Aqua Glow Triggered!">Experience Aqua 💧</button>
      </div>
    </div>
  `;
}

// --- 18. 8-Bit Pixel Arcade ---
function renderPixelArcadeMockup(tab, sub) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit pixel-unit">
        <div class="pixel-box">
          <div class="pixel-bar"><span>STAGE 1-4</span><span>TIME: 360</span></div>
          <div class="pixel-hp-row"><span>COINS: 99</span><span style="color:#FFE600;">★ ★ ★</span></div>
          <div class="hp-bar"><div class="hp-fill"></div></div>
          <button class="pixel-btn" data-mock-action="toast" data-mock-msg="Power Up Equipped!">[ LEVEL UP! 🍄 ]</button>
        </div>
      </div>
    `;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit pixel-unit">
        <div class="pixel-box">
          <h3 class="pixel-title" style="font-size:14px;">ENTER PLAYER NAME:</h3>
          <input type="text" class="pixel-input" value="MARIO_99" />
          <button class="pixel-btn" data-mock-action="toast" data-mock-msg="Player Saved!">[ SAVE HERO ]</button>
        </div>
      </div>
    `;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit pixel-unit">
        <div class="pixel-box">
          <span style="color:#00FFCC;font-size:12px;">★ ARCADE PASS ★</span>
          <h2 class="pixel-title" style="font-size:20px;">99 COINS</h2>
          <p style="font-size:11px;margin:8px 0;">Unlimited continues, 8-bit chiptune soundfont, scanline filters.</p>
          <button class="pixel-btn" data-mock-action="toast" data-mock-msg="Coins Purchased!">[ BUY PASS 💰 ]</button>
        </div>
      </div>
    `;
  }
  return `
    <div class="mockup-unit pixel-unit">
      <div class="pixel-box">
        <div class="pixel-bar"><span>1P [MARIO]</span><span data-mock-score>COINS: 00</span></div>
        <h2 class="pixel-title">PRESS START TO PLAY</h2>
        <div class="pixel-hp-row"><span>HP:</span><div class="hp-bar"><div class="hp-fill"></div></div></div>
        <button class="pixel-btn" data-mock-action="toast" data-mock-msg="1 Coin Inserted! [READY]">[ INSERT COIN 💰 ]</button>
      </div>
    </div>
  `;
}

// --- 19. Kinetic Typography ---
function renderKineticTypeMockup(tab, sub) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit kinetic-unit">
        <div class="kinetic-content">
          <span class="kinetic-pill">VELOCITY STREAM</span>
          <h2 class="kinetic-title" style="font-size:24px;">180 BPM // 120 FPS</h2>
          <p class="kinetic-desc">Dynamically scaled kinetic font weights reacting to user scroll velocity.</p>
          <button class="kinetic-btn" data-mock-action="toast" data-mock-msg="Kinetic Max Speed!">MAX VELOCITY ⚡</button>
        </div>
      </div>
    `;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit kinetic-unit">
        <div class="kinetic-content">
          <h3 class="kinetic-title" style="font-size:20px;">INPUT MOTION</h3>
          <input type="text" class="kinetic-input" value="TYPOGRAPHY IN ACCELERATION" />
          <button class="kinetic-btn" data-mock-action="toast" data-mock-msg="Motion Transmitted!">TRANSMIT STRING ⚡</button>
        </div>
      </div>
    `;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit kinetic-unit">
        <div class="kinetic-content">
          <span class="kinetic-pill">HYPER PLAN</span>
          <h2 class="kinetic-title">$79<span>/YR</span></h2>
          <p class="kinetic-desc">Full kinetic marquee engines, variable font motion interpolators, high frequency assets.</p>
          <button class="kinetic-btn" data-mock-action="toast" data-mock-msg="Kinetic Pro Acquired!">ACCELERATE PASS ⚡</button>
        </div>
      </div>
    `;
  }
  return `
    <div class="mockup-unit kinetic-unit">
      <div class="kinetic-marquee"><div class="marquee-track"><span>VELOCITY // HIGH FREQUENCY // SPEED // MOTION // VELOCITY // HIGH FREQUENCY // SPEED // MOTION // </span></div></div>
      <div class="kinetic-content">
        <h1 class="kinetic-title">HYPER SPEED<br>TYPOGRAPHY</h1>
        <p class="kinetic-desc">Infinite dynamic kinetic text with high-contrast fluorescent racing lime accents.</p>
        <button class="kinetic-btn" data-mock-action="toast" data-mock-msg="Kinetic Velocity Accelerated!">BOOST SPEED ⚡</button>
      </div>
    </div>
  `;
}

// --- 20. Bento Grid UI 2.0 ---
function renderBentoGridMockup(tab, sub) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit bento-ui-unit">
        <div class="bento-layout-grid">
          <div class="bento-box bento-small">
            <span class="bento-chip green">HEALTH</span>
            <span class="bento-stat">100%</span>
            <span class="bento-stat-lbl">Uptime SLA</span>
          </div>
          <div class="bento-box bento-small">
            <span class="bento-chip purple">SPEED</span>
            <span class="bento-stat">0.01ms</span>
            <span class="bento-stat-lbl">Edge Cache</span>
          </div>
          <div class="bento-box bento-large">
            <span class="bento-chip">✨ SYNC</span>
            <h3 class="bento-box-title">Multi-Region Sharding</h3>
            <div class="bento-bar-meter"><div class="bar-progress"></div></div>
          </div>
        </div>
      </div>
    `;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit bento-ui-unit">
        <div class="bento-box bento-large">
          <span class="bento-chip">⚡ CONFIG MODULE</span>
          <h3 class="bento-box-title">Create Micro-Bento</h3>
          <input type="text" class="bento-input" value="bento-cluster-tokyo-01" />
          <button class="bento-btn" data-mock-action="toast" data-mock-msg="Bento Module Added!">Add Modular Tile</button>
        </div>
      </div>
    `;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit bento-ui-unit">
        <div class="bento-box bento-large">
          <span class="bento-chip purple">MODULAR BENTO</span>
          <h2 class="bento-box-title" style="font-size:26px;">$29<small>/mo</small></h2>
          <p class="bento-box-desc">Asymmetrical Bento tile system, dark obsidian glass, reactive micro-metrics.</p>
          <button class="bento-btn" data-mock-action="toast" data-mock-msg="Bento Pro Subscribed!">Build Bento Grid →</button>
        </div>
      </div>
    `;
  }
  return `
    <div class="mockup-unit bento-ui-unit">
      <div class="bento-layout-grid">
        <div class="bento-box bento-large">
          <span class="bento-chip">✨ SMART CORE</span>
          <h3 class="bento-box-title">Autonomous Workflows</h3>
          <p class="bento-box-desc">Integrated micro-modules communicating at zero latency.</p>
          <div class="bento-bar-meter"><div class="bar-progress"></div></div>
        </div>
        <div class="bento-box bento-small">
          <span class="bento-chip green">LIVE</span>
          <span class="bento-stat">120 FPS</span>
          <span class="bento-stat-lbl">WASM Renderer</span>
        </div>
        <div class="bento-box bento-small">
          <span class="bento-chip purple">AUDIO</span>
          <span class="bento-stat">16 Tracks</span>
          <span class="bento-stat-lbl">Procedural Synth</span>
        </div>
      </div>
    </div>
  `;
}

// --- 21. Acid Graphics & Techno Rave ---
function renderAcidTechnoMockup(tab, sub) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit acid-unit">
        <div class="acid-box">
          <div class="acid-top"><span>ACID_BPM: 145</span><span>RAVE_ON</span></div>
          <div class="acid-wave-bars">
            <div class="a-bar"></div><div class="a-bar"></div><div class="a-bar"></div><div class="a-bar"></div>
          </div>
          <button class="acid-btn" data-mock-action="toast" data-mock-msg="Acid Overdrive Fired!">OVERDRIVE SYNTH ☣</button>
        </div>
      </div>
    `;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit acid-unit">
        <div class="acid-box">
          <h3 class="acid-title" style="font-size:18px;">RAVE PASS REGISTER</h3>
          <input type="text" class="acid-input" value="ACID_GUEST_9901" />
          <button class="acid-btn" data-mock-action="toast" data-mock-msg="Rave Pass Issued!">GET WRISTBAND ☣</button>
        </div>
      </div>
    `;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit acid-unit">
        <div class="acid-box">
          <div class="acid-smile">☣</div>
          <h2 class="acid-title">$30.30<span>/RAVE</span></h2>
          <p class="acid-desc">Distorted chrome sphere textures, barcode graphics, radioactive neon green spikes.</p>
          <button class="acid-btn" data-mock-action="toast" data-mock-msg="Acid Pass Claimed!">ENTER WAREHOUSE ☣</button>
        </div>
      </div>
    `;
  }
  return `
    <div class="mockup-unit acid-unit">
      <div class="acid-box">
        <div class="acid-smile">☺</div>
        <h2 class="acid-title">ACID TECHNO RAVE</h2>
        <p class="acid-desc">Distorted chrome sphere textures, barcode graphics, and radioactive neon green spikes.</p>
        <button class="acid-btn" data-mock-action="toast" data-mock-msg="Acid Techno Beats Dropped!">DROP THE BEAT ☣</button>
      </div>
    </div>
  `;
}

// --- 22. Claymorphism 3D Bubble ---
function renderClaymorphismMockup(tab, sub) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit clay-unit">
        <div class="clay-bubble-card">
          <div class="clay-badge">☁ CLAY VITALS</div>
          <div class="clay-stat-row">
            <div class="clay-pill-box"><span class="clay-num">88%</span><span class="clay-lbl">Bounce</span></div>
            <div class="clay-pill-box"><span class="clay-num">100%</span><span class="clay-lbl">Fluffy</span></div>
          </div>
          <button class="clay-btn" style="margin-top:12px;" data-mock-action="toast" data-mock-msg="Clay Squished!">Squish Vitals 🫧</button>
        </div>
      </div>
    `;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit clay-unit">
        <div class="clay-bubble-card">
          <h3 class="clay-title">Soft Clay Feedback</h3>
          <input type="text" class="clay-input" value="Soft & squishy thoughts" />
          <button class="clay-btn" data-mock-action="toast" data-mock-msg="Clay Feedback Sent!">Send Bubble 🫧</button>
        </div>
      </div>
    `;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit clay-unit">
        <div class="clay-bubble-card">
          <span class="clay-badge">FLUFFY PRO</span>
          <h2 class="clay-price">$22<small>/mo</small></h2>
          <p class="clay-desc">Squishy 3D clay surface with deep double drop shadows and bubble tactile bounce.</p>
          <button class="clay-btn" data-mock-action="toast" data-mock-msg="Clay Pro Subscribed!">Get Fluffy 🫧</button>
        </div>
      </div>
    `;
  }
  return `
    <div class="mockup-unit clay-unit">
      <div class="clay-bubble-card">
        <div class="clay-badge">☁ SOFT 3D CLAY</div>
        <h2 class="clay-title">Plump & Fluffy Cards</h2>
        <p class="clay-desc">Squishy 3D clay surface with deep double drop shadows and bubble tactile bounce.</p>
        <button class="clay-btn" data-mock-action="toast" data-mock-msg="Clay Bubble Popped!">Squish Me! 🫧</button>
      </div>
    </div>
  `;
}

// --- 23. Handcrafted Indie Collage ---
function renderHandcraftedMockup(tab, sub) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit indie-unit">
        <div class="indie-tape tape-top"></div>
        <div class="indie-scrap-card">
          <span class="indie-stamp">PINNED NOTE</span>
          <div class="indie-todo-list">
            <div>✓ Brew artisan drip coffee</div>
            <div>✓ Hand-drawn wireframe sketches</div>
          </div>
          <button class="indie-btn" data-mock-action="toast" data-mock-msg="Handcrafted Task Completed!">Mark Done 📌</button>
        </div>
      </div>
    `;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit indie-unit">
        <div class="indie-tape tape-top"></div>
        <div class="indie-scrap-card">
          <h3 class="indie-title">Leave a Postcard</h3>
          <input type="text" class="indie-input" value="Greetings from Indie Studio!" />
          <button class="indie-btn" data-mock-action="toast" data-mock-msg="Postcard Mailed!">Mail Postcard ✉</button>
        </div>
      </div>
    `;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit indie-unit">
        <div class="indie-scrap-card">
          <span class="indie-stamp">ARTISAN CLUB</span>
          <h2 class="indie-price">$12<small>/mo</small></h2>
          <p class="indie-desc">Masking tape, torn paper edges, ink stamps, and organic pencil annotations.</p>
          <button class="indie-btn" data-mock-action="toast" data-mock-msg="Artisan Club Joined!">Join Artisan Circle 📌</button>
        </div>
      </div>
    `;
  }
  return `
    <div class="mockup-unit indie-unit">
      <div class="indie-tape tape-top"></div>
      <div class="indie-scrap-card">
        <span class="indie-stamp">APPROVED 1994</span>
        <h2 class="indie-title">Handmade Scrapbook</h2>
        <p class="indie-desc">Masking tape, torn paper edges, ink stamps, and organic pencil annotations.</p>
        <button class="indie-btn" data-mock-action="toast" data-mock-msg="Indie Note Pinned!">Pin Note 📌</button>
      </div>
    </div>
  `;
}

// --- 24. Solarpunk Eco-Futurism ---
function renderSolarpunkMockup(tab, sub) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit solar-unit">
        <div class="solar-stained-glass"></div>
        <div class="solar-card">
          <span class="solar-badge">☀️ SOLAR TELEMETRY</span>
          <div class="solar-stats">
            <div><span class="solar-val">4.8 kWh</span><span class="solar-lbl">Harvested</span></div>
            <div><span class="solar-val">100%</span><span class="solar-lbl">Renewable</span></div>
          </div>
          <button class="solar-btn" style="margin-top:12px;" data-mock-action="toast" data-mock-msg="Solar Grid Synchronized!">Harmonize Grid ☀️</button>
        </div>
      </div>
    `;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit solar-unit">
        <div class="solar-card">
          <h3 class="solar-title">Solar Energy Exchange</h3>
          <input type="text" class="solar-input" value="microgrid-sanctuary-01" />
          <button class="solar-btn" data-mock-action="toast" data-mock-msg="Energy Transferred!">Transfer Sun Energy ☀️</button>
        </div>
      </div>
    `;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit solar-unit">
        <div class="solar-card">
          <span class="solar-badge">SOLAR HARVEST</span>
          <h2 class="solar-price">$18<small>/mo</small></h2>
          <p class="solar-desc">Golden solar radiation intertwined with lush forest foliage and organic art-nouveau curves.</p>
          <button class="solar-btn" data-mock-action="toast" data-mock-msg="Solar Plan Joined!">Adopt Solar Core ☀️</button>
        </div>
      </div>
    `;
  }
  return `
    <div class="mockup-unit solar-unit">
      <div class="solar-stained-glass"></div>
      <div class="solar-card">
        <span class="solar-badge">🌱 CLEAN SOLAR ECO</span>
        <h2 class="solar-title">Harmonious Clean Future</h2>
        <p class="solar-desc">Golden solar radiation intertwined with lush forest foliage and organic art-nouveau curves.</p>
        <button class="solar-btn" data-mock-action="toast" data-mock-msg="Solar Grid Connected!">Harvest Sun Energy ☀️</button>
      </div>
    </div>
  `;
}

const EMPTY_ASSET_PATHS = Object.freeze([]);

function defineRenderer(id, render, aliases = []) {
  return Object.freeze({
    id,
    aliases: Object.freeze(aliases),
    tabs: PREVIEW_COMPONENT_TABS,
    assetPaths: EMPTY_ASSET_PATHS,
    render
  });
}

export const CORE_RENDERER_DEFINITIONS = Object.freeze([
  defineRenderer('swiss', renderSwissMockup),
  defineRenderer('corporate', renderCorporateMockup),
  defineRenderer('minimalism', renderMonoMockup),
  defineRenderer('raw-brutal', renderRawBrutalMockup, ['brutalism']),
  defineRenderer('neo-brutal', renderNeoBrutalMockup),
  defineRenderer('cyberpunk', renderCyberpunkMockup),
  defineRenderer('glassmorphism', renderGlassmorphismMockup),
  defineRenderer('neumorphism', renderNeumorphismMockup),
  defineRenderer('skeuomorphism', renderSkeuomorphismMockup),
  defineRenderer('memphis', renderMemphisMockup),
  defineRenderer('retro', renderSynthwaveMockup),
  defineRenderer('vaporwave', renderVaporwaveMockup),
  defineRenderer('editorial', renderEditorialMockup),
  defineRenderer('organic', renderOrganicMockup),
  defineRenderer('darkmode', renderDarkmodeMockup),
  defineRenderer('y2k-chrome', renderY2kChromeMockup),
  defineRenderer('frutiger-aero', renderFrutigerAeroMockup),
  defineRenderer('pixel-arcade', renderPixelArcadeMockup),
  defineRenderer('kinetic-type', renderKineticTypeMockup),
  defineRenderer('bento-grid', renderBentoGridMockup),
  defineRenderer('acid-techno', renderAcidTechnoMockup),
  defineRenderer('claymorphism', renderClaymorphismMockup),
  defineRenderer('handcrafted-indie', renderHandcraftedMockup),
  defineRenderer('solarpunk-eco', renderSolarpunkMockup)
]);
