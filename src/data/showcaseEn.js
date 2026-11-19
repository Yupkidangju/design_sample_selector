/**
 * 20종 디자인 사조 전용 영문 쇼케이스 카피 (EN 모드 전환 시 100% 네이티브 영문 렌더링)
 * 전용 Google Fonts(Playfair Display, Cinzel, Press Start 2P, Orbitron, Syne, Fraunces, Fredoka 등)의
 * 본래 라틴 타이포그래피 완성도를 그대로 감상할 수 있게 한다.
 */

export const SHOWCASE_EN = Object.freeze({
  'swiss-grid': {
    tagline: 'International Typographic Style built on 12-column mathematical order, archival off-white paper, and a single Signal Red accent.',
    traits: ['12-Col Math Grid', '0px Razor Corners', 'Signal Red Accent'],
    web: {
      brand: 'HELVETICA ARCHIVE',
      nav: ['Systems', 'Grid', 'Archive', 'Specs'],
      kicker: 'INTERNATIONAL TYPOGRAPHIC STYLE · NO. 01',
      title: 'Order Is The Sharpest Visual Language',
      subtitle: 'Strip ornament down to strict 12-column proportion and stark typographic contrast so complex product hierarchy reads in one second.',
      primaryCta: 'Open Grid Spec',
      secondaryCta: 'Case Index',
      metrics: [
        { label: 'GRID COLUMNS', value: '12 COL' },
        { label: 'CORNER RADIUS', value: '0 PX' },
        { label: 'CONTRAST', value: '18.4 : 1' }
      ],
      features: [
        { num: '01', title: 'Mathematical Division', desc: 'Lock every card and gutter onto an 8px baseline and exposed hairline grid rules.' },
        { num: '02', title: 'Single Signal Accent', desc: 'Reserve Signal Red exclusively for primary CTAs, active tabs, and focal indicators.' },
        { num: '03', title: 'Editorial Scale Contrast', desc: 'Pair monumental grotesque headlines with crisp tabular monospace index metadata.' }
      ]
    },
    mobile: {
      appName: 'METRONOME 01',
      greeting: 'EDITORIAL SCHEDULE',
      primaryCardTitle: 'Issue 12 Type Proofing',
      primaryCardMeta: '84% complete · Due 14:00 CET',
      items: [
        { tag: '01', title: 'Verify 12-column baseline', status: 'DONE' },
        { tag: '02', title: 'Audit Signal Red contrast', status: 'LIVE' },
        { tag: '03', title: 'Export print-ready folio', status: 'NEXT' }
      ],
      detailTitle: 'GRID MODULE RULES',
      detailSub: '8px Baseline · 12-Col Hairline'
    },
    game: {
      genre: 'PRECISION GRID PUZZLE',
      title: 'SECTOR 12 // TACTICAL LOCK',
      player: 'UNIT-01',
      bossName: 'NODE MATRIX X-12',
      bossSub: 'Coordinate lock target · Precision strike',
      hpLabel: 'SYNC',
      mpLabel: 'GRID',
      skills: [
        { key: 'Q', name: 'Scan Pulse', dmg: 120 },
        { key: 'W', name: 'Axis Align', dmg: 185 },
        { key: 'E', name: 'Red Lock-On', dmg: 260 },
        { key: 'R', name: 'Matrix Reset', dmg: 390 }
      ],
      logInit: 'Coordinates [04, 08] acquired. Click the central target node to synchronize.'
    },
    dashboard: {
      brand: 'ZURICH OPS',
      title: 'System Precision Metrics',
      kpis: [
        { label: 'Grid Alignment', value: '99.8%', delta: '+0.4%' },
        { label: 'Median Latency', value: '18ms', delta: '-4ms' },
        { label: 'Active Nodes', value: '1,248', delta: '+62' },
        { label: 'Error Rate', value: '0.02%', delta: '-0.01%' }
      ]
    }
  },

  'bento-grid': {
    tagline: 'Asymmetric modular tile grid inspired by Apple and Silicon Valley product canvases for instant feature scannability.',
    traits: ['Asymmetric Bento Tiles', 'Crisp 1px Hairlines', 'High Scan Velocity'],
    web: {
      brand: 'KINETIC STUDIO',
      nav: ['Overview', 'Modules', 'Benchmarks', 'Pricing'],
      kicker: 'MODULAR PRODUCT ARCHITECTURE',
      title: 'A Modular Canvas Built For Effortless Clarity',
      subtitle: 'Arrange heterogeneous feature tiles, spotlight metrics, and crisp concentric radii so every core capability scans at a glance.',
      primaryCta: 'Start Free',
      secondaryCta: 'Explore Architecture',
      metrics: [
        { label: 'FRAME RATE', value: '120 fps' },
        { label: 'BUILD SPEED', value: '4.2x' },
        { label: 'TEAM CSAT', value: '98.6%' }
      ],
      features: [
        { num: 'A1', title: 'Asymmetric Focus Tiles', desc: 'Assign 2x2 and 2x1 grid spans to anchor visual priority without clutter.' },
        { num: 'B2', title: 'Dark Spotlight Contrast', desc: 'Invert one key tile to deep charcoal to create instant architectural rhythm.' },
        { num: 'C3', title: 'Concentric Radius Math', desc: 'Match 24px outer surfaces with 14px nested chips for hardware-grade polish.' }
      ]
    },
    mobile: {
      appName: 'PULSE OS',
      greeting: 'DAILY FOCUS BRIEFING',
      primaryCardTitle: 'Focus Energy Score 92',
      primaryCardMeta: '+11% vs yesterday · Peak zone',
      items: [
        { tag: 'DEEP', title: '3h deep work block completed', status: 'DONE' },
        { tag: 'REST', title: 'Sleep recovery 7h 40m', status: 'PEAK' },
        { tag: 'MOVE', title: 'Daily steps 8,420 / 10,000', status: '84%' }
      ],
      detailTitle: 'WIDGET TILE LAYOUT',
      detailSub: '2x1 Energy · 1x1 Heart · 1x1 Tasks'
    },
    game: {
      genre: 'MODULAR STRATEGY COMMAND',
      title: 'APEX DECK // TACTICAL HUB',
      player: 'CMDR. MIN',
      bossName: 'CORE SENTINEL MK.IV',
      bossSub: '3 modular shield plates active',
      hpLabel: 'SHIELD',
      mpLabel: 'ENERGY',
      skills: [
        { key: 'Q', name: 'Overclock', dmg: 140 },
        { key: 'W', name: 'Drone Volley', dmg: 210 },
        { key: 'E', name: 'Shield Break', dmg: 290 },
        { key: 'R', name: 'Core Burst', dmg: 420 }
      ],
      logInit: 'Tactical modules online. Click Core Sentinel to target exposed plates.'
    },
    dashboard: {
      brand: 'CUBE ANALYTICS',
      title: 'Product Growth Bento Board',
      kpis: [
        { label: 'Monthly ARR', value: '$142K', delta: '+18.4%' },
        { label: 'Active Teams', value: '14,820', delta: '+9.2%' },
        { label: 'Conversion', value: '6.48%', delta: '+1.1%' },
        { label: 'NPS Score', value: '74', delta: '+6pt' }
      ]
    }
  },

  glassmorphism: {
    tagline: 'Multi-layer frosted translucent glass panes with specular top rims floating over luminous aurora gradient mesh.',
    traits: ['Frosted Glass Blur', 'Aurora Mesh Light', 'Specular Rim Highlight'],
    web: {
      brand: 'AETHER OPTICS',
      nav: ['Spatial UI', 'Optics', 'Showcase', 'Docs'],
      kicker: 'SPATIAL GLASS INTERFACE · 2026',
      title: 'Translucent Spatial Planes Sculpted By Light',
      subtitle: 'Float multi-depth frosted glass layers over vibrant aurora light orbs with crisp specular rims and optical contrast.',
      primaryCta: 'Launch Spatial Demo',
      secondaryCta: 'Optical Tokens',
      metrics: [
        { label: 'BLUR RADIUS', value: '24 px' },
        { label: 'SATURATION', value: '165%' },
        { label: 'DEPTH TIERS', value: '3 Layer' }
      ],
      features: [
        { num: '01', title: 'Specular Rim Lighting', desc: 'A razor 1px top inset highlight mimics real beveled optical glass edges.' },
        { num: '02', title: 'Ambient Aurora Orbs', desc: 'Cyan and violet background light sources make frost translucency unmistakable.' },
        { num: '03', title: 'High-Contrast Clarity', desc: 'Pure optical white typography preserves WCAG AA legibility on every plane.' }
      ]
    },
    mobile: {
      appName: 'LUMINA HOME',
      greeting: 'LIVING SPACE AMBIENCE',
      primaryCardTitle: 'Aurora Mood Scene 78%',
      primaryCardMeta: '22.5°C indoor · 46% humidity · Optimal',
      items: [
        { tag: 'LIGHT', title: 'Skylight prism dimming', status: '78%' },
        { tag: 'AIR', title: 'Air purifier auto flow', status: 'PURE' },
        { tag: 'LOCK', title: 'Smart glass privacy tint', status: 'ON' }
      ],
      detailTitle: 'SPATIAL LIGHT CONTROL',
      detailSub: '5200K Daylight · 40% Frost Opacity'
    },
    game: {
      genre: 'SPATIAL STARSHIP BRIDGE HUD',
      title: 'ORBITAL BRIDGE // SECTOR 09',
      player: 'CAPT. ARIA',
      bossName: 'ASTRAL ANOMALY V-9',
      bossSub: 'Orbital gravity well detected · Scanning',
      hpLabel: 'HULL',
      mpLabel: 'FLUX',
      skills: [
        { key: 'Q', name: 'Ion Beam', dmg: 150 },
        { key: 'W', name: 'Prism Shield', dmg: 190 },
        { key: 'E', name: 'Gravity Pulse', dmg: 280 },
        { key: 'R', name: 'Nova Converge', dmg: 440 }
      ],
      logInit: 'Bridge holographic radar active. Click the orbital anomaly to fire phase beams.'
    },
    dashboard: {
      brand: 'AETHER CLOUD',
      title: 'Global Edge Optical Telemetry',
      kpis: [
        { label: 'Requests / Sec', value: '482K/s', delta: '+14.2%' },
        { label: 'Edge Latency', value: '11.4ms', delta: '-2.1ms' },
        { label: 'Availability', value: '99.99%', delta: '+0.01%' },
        { label: 'Active Regions', value: '38', delta: '+4' }
      ]
    }
  },

  'dark-minimal-glass': {
    tagline: 'Deep obsidian black, razor 1px top highlight borders, and surgical dark typography for next-gen developer SaaS.',
    traits: ['Deep Obsidian Surfaces', '1px Top Highlight Rim', 'Surgical Information Density'],
    web: {
      brand: 'VERGE ENGINE',
      nav: ['Roadmap', 'Issues', 'Changelog', 'Enterprise'],
      kicker: 'BUILT FOR HIGH-VELOCITY TEAMS · ⌘K',
      title: 'The Precision Workspace For High-Velocity Engineering',
      subtitle: 'Eliminate visual noise with stepped obsidian luminance, hairline 1px highlights, and keyboard-first command clarity.',
      primaryCta: 'Create Workspace',
      secondaryCta: 'Try ⌘K Command',
      metrics: [
        { label: 'SYNC LATENCY', value: '< 12ms' },
        { label: 'KEYBOARD', value: '100%' },
        { label: 'UPTIME SLA', value: '99.99%' }
      ],
      features: [
        { num: '01', title: 'Obsidian Elevation Steps', desc: 'Three calibrated dark tones and a 1px inner sheen separate hierarchy cleanly.' },
        { num: '02', title: 'Surgical Indigo Focus', desc: 'Electric indigo appears strictly on focused states, active curves, and primary actions.' },
        { num: '03', title: 'Monospace Telemetry', desc: 'Tabular timings, commit IDs, and keycap hints signal engineering precision.' }
      ]
    },
    mobile: {
      appName: 'VERGE MOBILE',
      greeting: 'RELEASE V3.4 PIPELINE',
      primaryCardTitle: 'PR #418 Ready To Merge',
      primaryCardMeta: '142 checks passed · Updated 2m ago',
      items: [
        { tag: 'ENG-91', title: 'Optimize edge cache purge', status: 'REVIEW' },
        { tag: 'ENG-94', title: 'Verify AA contrast tokens', status: 'MERGED' },
        { tag: 'ENG-98', title: 'Command palette shortcuts', status: 'ACTIVE' }
      ],
      detailTitle: 'DEPLOY CHECKLIST',
      detailSub: 'Production · us-east / ap-northeast'
    },
    game: {
      genre: 'ESPORTS TACTICAL MATCH HUD',
      title: 'VALOR OPS // MATCH TELEMETRY',
      player: 'OP_KAI [14ms]',
      bossName: 'TARGET ALPHA-04',
      bossSub: 'Tactical Sector B · Precision Aim Online',
      hpLabel: 'ARMOR',
      mpLabel: 'TACTIC',
      skills: [
        { key: 'Q', name: 'Recon Ping', dmg: 130 },
        { key: 'W', name: 'EMP Pulse', dmg: 200 },
        { key: 'E', name: 'Precision Shot', dmg: 310 },
        { key: 'R', name: 'Orbital Strike', dmg: 460 }
      ],
      logInit: 'Tactical uplink active. Click the radar target to execute precision strike.'
    },
    dashboard: {
      brand: 'VERGE TELEMETRY',
      title: 'Infrastructure Observability Board',
      kpis: [
        { label: 'P99 Latency', value: '24.2ms', delta: '-6.1ms' },
        { label: 'Deploy Success', value: '99.94%', delta: '+0.08%' },
        { label: 'Active Workers', value: '3,840', delta: '+240' },
        { label: 'Issues Shipped', value: '412', delta: '+28%' }
      ]
    }
  },

  neumorphism: {
    tagline: 'Single-tone matte surface sculpted purely by opposing top-left highlights and soft bottom-right shadows.',
    traits: ['Dual Raised/Recessed Shadows', 'Unified Matte Surface', 'Tactile Extruded Controls'],
    web: {
      brand: 'TACTILE FORM',
      nav: ['Hardware', 'Controls', 'Craft', 'Support'],
      kicker: 'SCULPTED SOFT SURFACE UI',
      title: 'Extruded Controls You Can Almost Feel',
      subtitle: 'Carve buttons, dials, and recessed inputs out of one continuous matte surface using a single 135-degree studio light.',
      primaryCta: 'Try Tactile Controls',
      secondaryCta: 'Light Source Rules',
      metrics: [
        { label: 'LIGHT ANGLE', value: '135°' },
        { label: 'EXTRUSION', value: '9 px' },
        { label: 'SURFACE', value: 'UNIFIED' }
      ],
      features: [
        { num: '01', title: 'Convex vs. Concave', desc: 'Clickable surfaces rise outward while inputs, tracks, and pressed buttons sink smoothly inward.' },
        { num: '02', title: 'Seamless Matte Canvas', desc: 'Matching base and surface hues create the illusion of molded industrial silicone.' },
        { num: '03', title: 'AA Legibility Safeguard', desc: 'Deep slate ink and crisp cobalt accents maintain clear 4.5:1+ accessibility.' }
      ]
    },
    mobile: {
      appName: 'AURA DIAL',
      greeting: 'STUDIO CLIMATE CONTROL',
      primaryCardTitle: '21.5°C Comfort Active',
      primaryCardMeta: 'Target temp · Whisper eco airflow',
      items: [
        { tag: 'AIR', title: 'Air quality excellent (12)', status: 'ON' },
        { tag: 'HUM', title: 'Auto humidity balance', status: '48%' },
        { tag: 'LAMP', title: 'Soft warm studio glow', status: '65%' }
      ],
      detailTitle: 'TACTILE DIAL DECK',
      detailSub: 'Raised Switches · Recessed Tracks'
    },
    game: {
      genre: 'TACTICAL MECH PAD',
      title: 'SOFTCORE // TACTILE DECK',
      player: 'PILOT 05',
      bossName: 'RESONANCE CORE',
      bossSub: 'Pressure sync engaged · Press target',
      hpLabel: 'PRESS',
      mpLabel: 'PULSE',
      skills: [
        { key: 'Q', name: 'Soft Pulse', dmg: 115 },
        { key: 'W', name: 'Compress Wave', dmg: 180 },
        { key: 'E', name: 'Resonance Hit', dmg: 255 },
        { key: 'R', name: 'Harmonic Shock', dmg: 380 }
      ],
      logInit: 'Tactile pad calibrated. Press the central Resonance Core to discharge.'
    },
    dashboard: {
      brand: 'SOFT METRICS',
      title: 'Device Wellness Control Board',
      kpis: [
        { label: 'Paired Devices', value: '2,480', delta: '+7.4%' },
        { label: 'Avg Battery', value: '88%', delta: '+3%' },
        { label: 'Energy Saved', value: '31.5%', delta: '+4.2%' },
        { label: 'Healthy Fleet', value: '99.7%', delta: '+0.2%' }
      ]
    }
  },

  'high-contrast-mono': {
    tagline: 'Pitch CRT black, phosphor green and amber signals, 100% monospace alignment, and raw CLI command syntax.',
    traits: ['100% Monospace Grid', 'Phosphor Green & Amber', 'CRT Scanlines & CLI'],
    web: {
      brand: 'SYS://KERNEL_06',
      nav: ['[DOCS]', '[CLI]', '[BENCH]', '[SSH]'],
      kicker: 'ROOT@DESIGN-SHELL:~# ./INIT --MODE=MONO',
      title: 'Zero Ornament — Pure Command-Line Precision',
      subtitle: 'Strip interfaces down to raw monospace alignment, 0px borders, phosphor signals, and instant inverted hover states.',
      primaryCta: '> RUN_DEPLOY.SH',
      secondaryCta: '[MAN PAGE]',
      metrics: [
        { label: 'TTY_FPS', value: '240Hz' },
        { label: 'OVERHEAD', value: '0.4 KB' },
        { label: 'STATUS', value: '[ONLINE]' }
      ],
      features: [
        { num: '0x01', title: '100% Fixed-Width Grid', desc: 'Identical glyph widths keep tables, logs, and telemetry aligned to the pixel.' },
        { num: '0x02', title: 'Instant Selection Invert', desc: 'Hover snaps fill and ink into pure phosphor inversion like a live terminal cursor.' },
        { num: '0x03', title: 'Dual Signal Palette', desc: 'Phosphor green marks healthy state while amber flags threshold warnings instantly.' }
      ]
    },
    mobile: {
      appName: 'POCKET_TTY',
      greeting: 'SSH_SESSION :: ACTIVE',
      primaryCardTitle: 'CLUSTER-KR-01 [OK]',
      primaryCardMeta: 'CPU 24% · MEM 4.1G / 16G · UP 42D',
      items: [
        { tag: '[OK]', title: 'nginx-edge-proxy.service', status: '12ms' },
        { tag: '[RUN]', title: 'pg-replica-sync.job', status: '88%' },
        { tag: '[WARN]', title: 'redis-cache-eviction', status: '74%' }
      ],
      detailTitle: 'EXEC :: QUICK_CMD',
      detailSub: '> tail -f /var/log/system.log'
    },
    game: {
      genre: 'ROGUELIKE BREACH TERMINAL',
      title: 'NET_BREACH // FLOOR_07',
      player: 'ROOT_01',
      bossName: 'ICE_FIREWALL_DAEMON',
      bossSub: 'PORT 443 encrypted core · Intrusion live',
      hpLabel: 'INTEGRITY',
      mpLabel: 'CYCLES',
      skills: [
        { key: 'Q', name: 'INJECT()', dmg: 135 },
        { key: 'W', name: 'BRUTE_XOR', dmg: 195 },
        { key: 'E', name: 'OVERFLOW', dmg: 285 },
        { key: 'R', name: 'RM -RF //', dmg: 450 }
      ],
      logInit: '> [SYS] ICE_FIREWALL_DAEMON detected. Click core node to inject payload.'
    },
    dashboard: {
      brand: 'BTOP://MONITOR',
      title: 'Node Process & Packet Telemetry',
      kpis: [
        { label: 'THROUGHPUT', value: '94.2 Gb/s', delta: '+11.4%' },
        { label: 'PACKET_LOSS', value: '0.001%', delta: '-0.002%' },
        { label: 'OPEN_SOCKETS', value: '18,402', delta: '+1,120' },
        { label: 'LOAD_AVG', value: '0.42', delta: '[NOMINAL]' }
      ]
    }
  },

  skeuomorphism: {
    tagline: 'Machined brushed aluminum bezels, recessed LCD meters, physical keycaps, and Braun-inspired industrial LED indicators.',
    traits: ['Brushed Metal Bezels', 'Physical Keycaps & LEDs', 'Industrial Gauge Precision'],
    web: {
      brand: 'FIELD UNIT // MK-II',
      nav: ['CHASSIS', 'SPECS', 'MODULES', 'MANUAL'],
      kicker: 'PRECISION INDUSTRIAL INTERFACE · REV 2.4',
      title: 'Machined Aluminum Meets Tactile Physical Feedback',
      subtitle: 'Combine chamfered metallic housings, dark recessed LCD readouts, and Dieter Rams signal-orange keys for authentic hardware craft.',
      primaryCta: 'ENGAGE UNIT TEST',
      secondaryCta: 'SCHEMATICS',
      metrics: [
        { label: 'CHASSIS', value: 'CNC 6061' },
        { label: 'KEY TRAVEL', value: '1.8 mm' },
        { label: 'LED STATUS', value: 'LOCKED' }
      ],
      features: [
        { num: 'CH-1', title: 'Beveled Keycap Travel', desc: 'Top sheen and bottom shadow rims compress physically on click like real switches.' },
        { num: 'CH-2', title: 'Recessed LCD Bay', desc: 'Live telemetry sits inside deep dark glass displays with crisp emerald readouts.' },
        { num: 'CH-3', title: 'Signal Orange Primary', desc: 'One signature Dieter Rams orange key anchors primary actuation on anodized gunmetal.' }
      ]
    },
    mobile: {
      appName: 'FIELD CAM-07',
      greeting: 'OPTICAL MODULE READY',
      primaryCardTitle: 'ISO 400 · 1/250s · F/2.0',
      primaryCardMeta: 'RAW 14-BIT · LED BATTERY 94%',
      items: [
        { tag: 'DIAL', title: 'Exposure Comp +0.3 EV', status: 'LOCK' },
        { tag: 'LENS', title: '35mm Apochromatic Prime', status: 'AF-S' },
        { tag: 'FILM', title: 'Monochrome High Contrast', status: 'CH-2' }
      ],
      detailTitle: 'HARDWARE SWITCHES',
      detailSub: 'CNC Rotary Dial · Physical Shutter'
    },
    game: {
      genre: 'ANALOG COCKPIT INSTRUMENT',
      title: 'MECH BAY // INSTRUMENT DECK',
      player: 'UNIT-MK2',
      bossName: 'SIGNAL BEACON 07',
      bossSub: 'Frequency 104.2 MHz · Oscilloscope lock',
      hpLabel: 'ARMOR',
      mpLabel: 'VOLT',
      skills: [
        { key: 'Q', name: 'Pulse Ignite', dmg: 145 },
        { key: 'W', name: 'Relay Boost', dmg: 205 },
        { key: 'E', name: 'High Voltage', dmg: 295 },
        { key: 'R', name: 'Overdrive', dmg: 430 }
      ],
      logInit: 'Instrument deck powered ON. Click the central scope to fire signal burst.'
    },
    dashboard: {
      brand: 'RACK MONITOR 07',
      title: 'Hardware Rack Telemetry Panel',
      kpis: [
        { label: 'Power Output', value: '428 W', delta: '+4.2%' },
        { label: 'Core Temp', value: '41.2°C', delta: '-1.8°C' },
        { label: 'Signal / Noise', value: '112 dB', delta: '+2 dB' },
        { label: 'Run Cycles', value: '9,420h', delta: 'NOMINAL' }
      ]
    }
  },

  'neo-brutalism': {
    tagline: 'Unapologetic 3px solid black borders, 0px-blur hard offset shadows, and bold pop yellow, coral, and mint color blocks.',
    traits: ['3px Solid Black Stroke', 'Zero-Blur Hard Shadow', 'Pop Color Blocking'],
    web: {
      brand: 'SMASH! LAB',
      nav: ['Work', 'Toolkit', 'Pricing', 'Join!'],
      kicker: 'NO BORING TEMPLATES · POP BRUTALISM',
      title: 'Heavy 3px Borders & Loud Pop Energy!',
      subtitle: 'Ditch polite gray SaaS cards. Punchy hard offset shadows and bold primary blocks make your product impossible to scroll past.',
      primaryCta: 'SMASH IT LIVE →',
      secondaryCta: 'STYLE RULES',
      metrics: [
        { label: 'OUTLINE', value: '3PX BLACK' },
        { label: 'BLUR', value: '0PX HARD' },
        { label: 'CTR LIFT', value: '+240%' }
      ],
      features: [
        { num: '01!', title: 'Zero-Blur Hard Shadow', desc: 'Solid 6px black offset shadows press straight down when clicked for instant tactile punch.' },
        { num: '02!', title: 'Unapologetic Color Blocks', desc: 'Stack pop yellow, electric mint, and hot coral blocks against warm cream paper.' },
        { num: '03!', title: 'Ultra-Bold Display Type', desc: 'Monumental Syne 800 titles with pure black ink cut through at every screen width.' }
      ]
    },
    mobile: {
      appName: 'ZAP PAY!',
      greeting: 'WEEKLY CASHBACK DROP',
      primaryCardTitle: '$4,820.00 BALANCE',
      primaryCardMeta: 'Instant transfer ready · +12,400 PTS',
      items: [
        { tag: 'POP', title: 'Indie Coffee Roasters', status: '-$6.50' },
        { tag: 'WIN', title: 'Weekend Streak Bonus', status: '+$5.00' },
        { tag: 'HOT', title: 'Design Print Bookshop', status: '-$28.00' }
      ],
      detailTitle: 'ONE-TAP ZAP PAD!',
      detailSub: '3px Stroke · Hard Offset Cards'
    },
    game: {
      genre: 'COMIC STREET BRAWLER HUD',
      title: 'HYPER PUNCH!! // STAGE 08',
      player: 'REX_KO',
      bossName: 'MECHA CRUSHER!!',
      bossSub: 'Super armor cracked · Mash for KO!',
      hpLabel: 'HP',
      mpLabel: 'RAGE',
      skills: [
        { key: 'Q', name: 'UPPERCUT!', dmg: 165 },
        { key: 'W', name: 'DROPKICK!', dmg: 220 },
        { key: 'E', name: 'COMIC SLAM!', dmg: 310 },
        { key: 'R', name: 'ULTRA KO!!', dmg: 520 }
      ],
      logInit: 'ROUND 1 — FIGHT!! Click the comic boss starburst to rack up combos!'
    },
    dashboard: {
      brand: 'POP METRICS!',
      title: 'Creator Revenue Explosion Board',
      kpis: [
        { label: 'Daily Sales!', value: '$84.2K', delta: '+42%!' },
        { label: 'New Fans', value: '3,910', delta: '+610' },
        { label: 'Click Rate', value: '11.8%', delta: '+3.4%' },
        { label: 'Merch Drop', value: '94%', delta: 'HOT!' }
      ]
    }
  },

  'high-fashion': {
    tagline: 'Couture print magazine poise with dramatic italic Playfair serifs, breathing archival ivory margins, and 1px hairline rules.',
    traits: ['High-Contrast Italic Serif', 'Airy Magazine Margins', '1px Editorial Hairlines'],
    web: {
      brand: 'MAISON ÉDITION',
      nav: ['Collections', 'Editorial', 'Atelier', 'Private'],
      kicker: 'AUTUMN / WINTER ARCHIVE · ISSUE NO. 09',
      title: 'Quiet Elegance Carved From Serifs & Margin',
      subtitle: 'Replace boxed cards with warm archival ivory paper, delicate 1px rules, and poetic Playfair Display typography.',
      primaryCta: 'Enter Archive',
      secondaryCta: 'Editor’s Note',
      metrics: [
        { label: 'EDITION', value: 'VOL. IX' },
        { label: 'SERIF RATIO', value: '1 : 4.2' },
        { label: 'CRAFT', value: 'BESPOKE' }
      ],
      features: [
        { num: 'I', title: 'Sculptural Serif Contrast', desc: 'Hairline serifs and dramatic italics elevate a single headline into a print cover.' },
        { num: 'II', title: 'Breathing Ivory Canvas', desc: 'Warm archival stock and open negative space communicate luxury without noise.' },
        { num: 'III', title: 'Restrained Burgundy Signature', desc: 'Deep wine accents appear only at pivotal editorial focal points.' }
      ]
    },
    mobile: {
      appName: 'MAISON JOURNAL',
      greeting: 'TODAY’S CURATION · ISSUE 09',
      primaryCardTitle: 'Sculpted Light: Autumn Atelier',
      primaryCardMeta: '4 min read · Paris & Seoul Edition',
      items: [
        { tag: 'I', title: 'Ten Lines of Minimal Tailoring', status: 'ESSAY' },
        { tag: 'II', title: 'Ceramic Objects Private Preview', status: 'RSVP' },
        { tag: 'III', title: 'Architecture of Scent & Space', status: 'STORY' }
      ],
      detailTitle: 'CHAPTER III · ATELIER',
      detailSub: 'Archival Ivory · 1px Hairline Rules'
    },
    game: {
      genre: 'NOIR EDITORIAL MYSTERY',
      title: 'ACT III // THE VELVET ALIBI',
      player: 'INSPECTOR V.',
      bossName: 'SILHOUETTE IN ROOM 09',
      bossSub: 'Interrogation phase · Contradiction found',
      hpLabel: 'POISE',
      mpLabel: 'INSIGHT',
      skills: [
        { key: 'Q', name: 'Present Clue', dmg: 125 },
        { key: 'W', name: 'Press Alibi', dmg: 195 },
        { key: 'E', name: 'Cross-Examine', dmg: 275 },
        { key: 'R', name: 'Reveal Truth', dmg: 410 }
      ],
      logInit: 'Act III opens. Click the silhouette to confront the witness.'
    },
    dashboard: {
      brand: 'MAISON PRIVATE',
      title: 'Private Atelier Performance Folio',
      kpis: [
        { label: 'Season Portfolio', value: '$4.82M', delta: '+12.6%' },
        { label: 'VIP Retention', value: '96.4%', delta: '+2.1%' },
        { label: 'Private Salons', value: '318', delta: '+44' },
        { label: 'Average Order', value: '$2,840', delta: '+8.4%' }
      ]
    }
  },

  'bauhaus-geometry': {
    tagline: '1919 Dessau modernism uniting primary red, blue, and yellow planes with pure circles, triangles, and 2px structural grids.',
    traits: ['Red · Blue · Yellow Triad', 'Circle · Triangle · Square', 'Geometric Sans Construct'],
    web: {
      brand: 'BAUHAUS // 1919',
      nav: ['Theory', 'Workshop', 'Exhibition', 'Archive'],
      kicker: 'FORM FOLLOWS FUNCTION · DESSAU ARCHIVE',
      title: 'Form Follows Function, Geometry Builds Order',
      subtitle: 'Translate Kandinsky’s primary color-form correspondence into stark 2px structural grids and timeless exhibition posters.',
      primaryCta: 'Enter Workshop ●',
      secondaryCta: 'Manifesto',
      metrics: [
        { label: 'PRIMARY', value: 'R · B · Y' },
        { label: 'SHAPES', value: '● ▲ ■' },
        { label: 'ERA', value: '1919+' }
      ],
      features: [
        { num: '●', title: 'Blue Circle Equilibrium', desc: 'Intersect pure circular geometry against crisp right-angle grids for dynamic balance.' },
        { num: '▲', title: 'Yellow Triangle Tension', desc: 'Acute diagonal geometry directs the eye straight toward focal actions.' },
        { num: '■', title: 'Red Square Authority', desc: 'Bold flat vermilion planes and 2px black dividers anchor every section.' }
      ]
    },
    mobile: {
      appName: 'FORM STUDIO',
      greeting: 'DESSAU FORM WORKSHOP',
      primaryCardTitle: 'Lecture 10: Color & Proportion',
      primaryCardMeta: '3 studio critiques · Today 17:00',
      items: [
        { tag: '●', title: 'Geometric poster composition', status: 'SENT' },
        { tag: '▲', title: 'Primary triad balance study', status: 'LIVE' },
        { tag: '■', title: 'Modular grid typography', status: 'NEXT' }
      ],
      detailTitle: 'COLOR × FORM MATRIX',
      detailSub: 'RED ■ · YELLOW ▲ · BLUE ●'
    },
    game: {
      genre: 'CONSTRUCTIVIST GEOMETRY PUZZLE',
      title: 'KANDINSKY // FORM ARENA',
      player: 'FORM-19',
      bossName: 'PRISM MONOLITH',
      bossSub: 'Primary form alignment · Geometric strike',
      hpLabel: 'FORM',
      mpLabel: 'HUE',
      skills: [
        { key: 'Q', name: 'Red Square ■', dmg: 140 },
        { key: 'W', name: 'Blue Circle ●', dmg: 200 },
        { key: 'E', name: 'Yellow Tri ▲', dmg: 280 },
        { key: 'R', name: 'Total Construct', dmg: 440 }
      ],
      logInit: 'Constructivist arena active. Click the primary monolith to resonate.'
    },
    dashboard: {
      brand: 'DESSAU INDEX',
      title: 'Workshop Exhibition Telemetry',
      kpis: [
        { label: 'Visitors', value: '24,810', delta: '+19.2%' },
        { label: 'Archive Works', value: '1,919', delta: '+48' },
        { label: 'Completion', value: '91.4%', delta: '+5.1%' },
        { label: 'Editions', value: 'Vol. 12', delta: 'OPEN' }
      ]
    }
  },

  'art-deco': {
    tagline: '1920s architectural grandeur pairing deep emerald velvet, double-inset metallic gold frames, sunbursts, and Cinzel capitals.',
    traits: ['Double Gold Filigree', 'Emerald Velvet Contrast', 'Sunburst Axial Symmetry'],
    web: {
      brand: 'THE GRAND AURELIA',
      nav: ['Suites', 'Salon', 'Archive', 'Reserve'],
      kicker: 'EST. MCMXXV · ARCHITECTURAL GRANDEUR',
      title: 'Gilded Geometry & Symmetry Forged For The Ages',
      subtitle: 'Frame digital spaces in double-lined metallic brass, deep emerald obsidian velvet, and majestic wide-tracked Cinzel capitals.',
      primaryCta: 'Reserve Private Salon',
      secondaryCta: '1925 Archive',
      metrics: [
        { label: 'HERITAGE', value: 'MCMXXV' },
        { label: 'FINISH', value: '24K BRASS' },
        { label: 'SYMMETRY', value: 'AXIAL' }
      ],
      features: [
        { num: '◆ I', title: 'Double-Inset Gold Frames', desc: 'Nested metallic borders frame every card with unmistakable 1920s architectural poise.' },
        { num: '◆ II', title: 'Radiant Sunburst Motifs', desc: 'Diamond emblems and golden rays anchor dramatic symmetrical focal points.' },
        { num: '◆ III', title: 'Emerald Velvet Depth', desc: 'Deep emerald-obsidian backgrounds paired with champagne ivory ink exude prestige.' }
      ]
    },
    mobile: {
      appName: 'AURELIA CLUB',
      greeting: 'GOLD MEMBER · SUITE 1925',
      primaryCardTitle: 'GRAND SALON ACCESS',
      primaryCardMeta: 'Direct concierge · Valet & lounge included',
      items: [
        { tag: '◆', title: 'Rooftop Jazz Gala Table', status: 'BOOKED' },
        { tag: '◆', title: 'Private Cellar Tasting', status: '20:00' },
        { tag: '◆', title: 'Art Deco Gallery Docent', status: 'VIP' }
      ],
      detailTitle: 'GILDED CONCIERGE',
      detailSub: 'DOUBLE GOLD RULE · EMERALD VELVET'
    },
    game: {
      genre: '1920S GILDED RELIC RPG',
      title: 'THE GILDED VAULT // ACT XI',
      player: 'LADY AURELIA',
      bossName: 'CLOCKWORK SOVEREIGN',
      bossSub: 'Gilded vault guardian · Relic seal unlocked',
      hpLabel: 'VITALITY',
      mpLabel: 'AETHER',
      skills: [
        { key: 'Q', name: 'Golden Seal', dmg: 150 },
        { key: 'W', name: 'Arcana Card', dmg: 215 },
        { key: 'E', name: 'Sunburst Ray', dmg: 305 },
        { key: 'R', name: 'Grand Finale', dmg: 470 }
      ],
      logInit: 'The Gilded Vault opens. Click the sovereign diamond emblem to cast relic arts.'
    },
    dashboard: {
      brand: 'AURELIA TREASURY',
      title: 'Private Vault Asset Ledger',
      kpis: [
        { label: 'Assets Held', value: '$18.2M', delta: '+14.8%' },
        { label: 'Member Index', value: '98.2%', delta: '+1.4%' },
        { label: 'Annual Yield', value: '11.4%', delta: '+2.3%' },
        { label: 'Curated Relics', value: '428', delta: 'VERIFIED' }
      ]
    }
  },

  risograph: {
    tagline: 'Tactile indie printmaking with halftone dot grain, warm cream stock, and misregistered cobalt & fluorescent rose overprints.',
    traits: ['2-Ink Overprint Offset', 'Halftone Paper Grain', 'Indie Zine Stamp Craft'],
    web: {
      brand: 'PRESS RISO NO.12',
      nav: ['Editions', 'Ink Chart', 'Workshop', 'Order'],
      kicker: 'SOY INK 2-COLOR OVERPRINT · ED. 050/100',
      title: 'Charming Two-Ink Overprints With Real Tactile Warmth',
      subtitle: 'Celebrate slight print misregistration, cobalt blue & rose spot inks, dashed tear lines, and expressive Fraunces serifs.',
      primaryCta: 'Stamp Your Edition',
      secondaryCta: 'View Ink Swatches',
      metrics: [
        { label: 'INK PLATES', value: '2 SPOT' },
        { label: 'HALFTONE', value: '65 LPI' },
        { label: 'EDITION', value: '050/100' }
      ],
      features: [
        { num: 'P-1', title: 'Misregistered Ink Shadows', desc: 'Offset fluorescent rose shadows replace sterile black drops with printshop charm.' },
        { num: 'P-2', title: 'Halftone Paper Texture', desc: 'Uncoated warm cream stock and dotted screens give pixels authentic print warmth.' },
        { num: 'P-3', title: 'Expressive Fraunces Type', desc: 'Soft swollen serifs paired with typewriter labels complete the indie zine voice.' }
      ]
    },
    mobile: {
      appName: 'ZINE CLUB',
      greeting: 'MONTHLY RISO DROP ARRIVED',
      primaryCardTitle: 'Autumn Indie Anthology #12',
      primaryCardMeta: '2-ink Cobalt + Rose · Numbered run of 100',
      items: [
        { tag: 'INK', title: 'Fluorescent rose test proof', status: 'DONE' },
        { tag: 'CUT', title: 'Saddle-stitch & trim pass', status: 'LIVE' },
        { tag: 'BOX', title: 'Pack 50 subscriber mailers', status: 'D-2' }
      ],
      detailTitle: 'PRINT EDITION STAMP',
      detailSub: 'COBALT #1D42D8 × ROSE #CC1F52'
    },
    game: {
      genre: 'INDIE ZINE MAP RPG',
      title: 'INKWOOD // ZINE QUEST #12',
      player: 'PRINTER M.',
      bossName: 'HALFTONE GOLEM',
      bossSub: 'Overprint ink guardian · Stamp to seal',
      hpLabel: 'PAPER',
      mpLabel: 'INK',
      skills: [
        { key: 'Q', name: 'Cobalt Stamp', dmg: 130 },
        { key: 'W', name: 'Rose Overprint', dmg: 195 },
        { key: 'E', name: 'Halftone Burst', dmg: 270 },
        { key: 'R', name: 'First Edition!', dmg: 430 }
      ],
      logInit: 'Page 12 of the Indie Zine dungeon! Click the halftone mountain to stamp ink.'
    },
    dashboard: {
      brand: 'RISO PRESS LOG',
      title: 'Printshop Edition Dispatch Board',
      kpis: [
        { label: 'Monthly Prints', value: '12,400', delta: '+24%' },
        { label: 'Sell-Through', value: '96.5%', delta: '+4.8%' },
        { label: 'Subscribers', value: '1,840', delta: '+215' },
        { label: 'Soy Ink Stock', value: '82%', delta: 'OK' }
      ]
    }
  },

  'kinetic-type': {
    tagline: 'Monumental Syne 800 typography as primary stage artwork, pit against pitch black and razor-sharp electric acid lime.',
    traits: ['Monumental Kinetic Type', 'Pitch Black × Acid Lime', 'High-BPM Velocity Contrast'],
    web: {
      brand: 'VOLT // KINETIC',
      nav: ['LINEUP', 'MOTION', 'DROPS', 'PASS ↗'],
      kicker: '140 BPM · HIGH-VOLTAGE TYPOGRAPHIC SYSTEM',
      title: 'WHEN TYPOGRAPHY BECOMES PURE VELOCITY',
      subtitle: 'Command the viewport without stock photos—monumental Syne 800 headlines, pitch void black, and electric acid lime snaps.',
      primaryCta: 'ENTER DROP ↗',
      secondaryCta: 'MOTION REEL',
      metrics: [
        { label: 'TEMPO', value: '140 BPM' },
        { label: 'CONTRAST', value: '17.8 : 1' },
        { label: 'DROP', value: 'LIVE NOW' }
      ],
      features: [
        { num: '01↗', title: 'Typography As Artwork', desc: 'Solid fills and crisp stroked outlines turn display letters into kinetic stage graphics.' },
        { num: '02↗', title: 'Acid Volt Signal', desc: 'Electric acid lime (#CCFF00) cuts through pitch black with 17.8:1 laser visibility.' },
        { num: '03↗', title: 'Instant Invert Snaps', desc: 'Hover states invert into pure volt highlights in 120ms for athletic responsiveness.' }
      ]
    },
    mobile: {
      appName: 'VOLT RUN 140',
      greeting: 'INTERVAL SESSION · LIVE',
      primaryCardTitle: '04\'12" / KM PACE',
      primaryCardMeta: '168 BPM · New split record live ↗',
      items: [
        { tag: 'LAP1', title: '400m Sprint Interval', status: '1:18' },
        { tag: 'LAP2', title: '1,200m Tempo Surge', status: '4:52' },
        { tag: 'MAX', title: 'Peak Cadence Lock', status: '184' }
      ],
      detailTitle: 'HIGH-VOLT SPLIT',
      detailSub: 'PITCH BLACK × ACID LIME #CCFF00'
    },
    game: {
      genre: 'HIGH-BPM RHYTHM SPEEDRUN',
      title: 'OVERDRIVE 140 // BEAT ARENA',
      player: 'RUNNER_X',
      bossName: 'PULSE BREAKER 140',
      bossSub: '140 BPM locked · Perfect hit zone!',
      hpLabel: 'SYNC',
      mpLabel: 'VOLT',
      skills: [
        { key: 'Q', name: 'Beat Slash', dmg: 160 },
        { key: 'W', name: 'Double Time', dmg: 230 },
        { key: 'E', name: 'Volt Drop', dmg: 325 },
        { key: 'R', name: 'Full Combo!', dmg: 510 }
      ],
      logInit: '140 BPM countdown clear! Strike the kinetic core on beat ↗'
    },
    dashboard: {
      brand: 'VOLT STREAM',
      title: 'Live Drop Traffic Spike Monitor',
      kpis: [
        { label: 'Peak Viewers', value: '84.2K', delta: '+312%' },
        { label: 'Orders / Sec', value: '1,420/s', delta: 'PEAK ↗' },
        { label: 'Sellout Time', value: '00:42', delta: 'NEW!' },
        { label: 'Headroom', value: '74%', delta: 'FAST' }
      ]
    }
  },

  'pixel-arcade': {
    tagline: 'Authentic Press Start 2P bitmap type, stepped 0px pixel borders, 16-color console palettes, and crispEdges JRPG sprites.',
    traits: ['Press Start 2P Type', 'Stepped Pixel Borders', '16-Color JRPG UI'],
    web: {
      brand: 'PIXEL QUEST 89',
      nav: ['▶ QUEST', 'ITEMS', 'PARTY', 'SAVE'],
      kicker: 'STAGE 14 // 16-BIT CARTRIDGE SYSTEM',
      title: 'CRISP PIXEL CRAFT DOWN TO EVERY DOT',
      subtitle: 'Zero blurry curves—authentic stepped RPG windows, 16-bit palettes, and crispEdges pixel sprites that feel like booting a classic cartridge.',
      primaryCta: '▶ PRESS START',
      secondaryCta: 'LOAD SAVE',
      metrics: [
        { label: 'HI-SCORE', value: '99,420' },
        { label: 'LIVES', value: '♥ ♥ ♥' },
        { label: 'STAGE', value: 'WORLD 1-4' }
      ],
      features: [
        { num: '1UP', title: 'Classic RPG Windows', desc: 'Nested 3px pixel bevels and cream frames transform any component into console UI.' },
        { num: 'EXP', title: 'crispEdges Pixel Art', desc: 'Integer-grid SVG sprites render dragons, hearts, and dungeon tiles razor sharp.' },
        { num: 'MAX', title: 'Arcade Switch Snap', desc: 'Buttons drop cleanly by 2px on press with zero blur like real arcade microswitches.' }
      ]
    },
    mobile: {
      appName: 'POCKET RPG',
      greeting: 'LV.42 HERO STATUS',
      primaryCardTitle: 'GOLD 14,820 G · ♥ 5/5',
      primaryCardMeta: '2/3 Daily Quests · Boss Keep Unlocked',
      items: [
        { tag: 'LV42', title: 'Slay Crimson Pixel Wyrm', status: 'LIVE' },
        { tag: 'ITEM', title: 'Hi-Potion x8 In Pack', status: 'USE' },
        { tag: 'SAVE', title: 'Auto Checkpoint Slot 1', status: 'OK' }
      ],
      detailTitle: '▶ COMMAND MENU',
      detailSub: 'FIGHT · MAGIC · ITEM · EQUIP'
    },
    game: {
      genre: '16-BIT JRPG BOSS BATTLE',
      title: 'DRAGON KEEP // BOSS BATTLE',
      player: 'HERO LV.42',
      bossName: '8-BIT CRIMSON WYRM',
      bossSub: 'An ancient pixel dragon blocks your path!',
      hpLabel: 'HP',
      mpLabel: 'MP',
      skills: [
        { key: 'Q', name: '▶ SLASH', dmg: 155 },
        { key: 'W', name: '▶ FIRE', dmg: 225 },
        { key: 'E', name: '▶ CRIT', dmg: 320 },
        { key: 'R', name: '▶ METEOR!', dmg: 500 }
      ],
      logInit: 'A wild 8-BIT CRIMSON WYRM appeared! Click the boss or pick a command!'
    },
    dashboard: {
      brand: 'ARCADE SCOREBOARD',
      title: 'Guild High-Score Leaderboard',
      kpis: [
        { label: 'HI-SCORE', value: '984,200', delta: 'NEW!' },
        { label: 'CLEAR RATE', value: '87.4%', delta: '+6.2%' },
        { label: 'COINS/HR', value: '42,800', delta: '+18%' },
        { label: 'ACTIVE 1P', value: '6,410', delta: 'ONLINE' }
      ]
    }
  },

  synthwave: {
    tagline: '1980s Outrun retro-futurism driven by midnight violet voids, striped sunsets, perspective laser grids, and cyan-magenta HUDs.',
    traits: ['Perspective Laser Grid', 'Magenta × Cyan Bloom', 'Outrun Sunset Horizon'],
    web: {
      brand: 'OUTRUN // 1984',
      nav: ['HORIZON', 'TURBO', 'GRID', 'IGNITE'],
      kicker: 'RETRO-FUTURISM · NEON OVERDRIVE SYSTEM',
      title: 'RACE PAST THE NEON LASER HORIZON',
      subtitle: 'Pair glowing striped sunsets and perspective laser grids with Orbitron & Chakra Petch cockpit telemetry.',
      primaryCta: 'IGNITE TURBO →',
      secondaryCta: 'HUD SPECS',
      metrics: [
        { label: 'VELOCITY', value: '288 KM/H' },
        { label: 'NITRO', value: '100%' },
        { label: 'SECTOR', value: 'NEO-84' }
      ],
      features: [
        { num: '01', title: 'Perspective Laser Grid', desc: 'Infinite cyan horizon lines and a sliced Outrun sun establish 1984 sci-fi atmosphere instantly.' },
        { num: '02', title: 'Cyan × Magenta Roles', desc: 'Cyan defines structure and telemetry while magenta powers actions and overdrive bars.' },
        { num: '03', title: 'Controlled Edge Bloom', desc: 'Neon glow hugs frames and gauges cleanly so body text stays razor readable.' }
      ]
    },
    mobile: {
      appName: 'NIGHT DRIVE 84',
      greeting: 'NEO HIGHWAY · CLEAR SKY',
      primaryCardTitle: '246 KM/H · TURBO READY',
      primaryCardMeta: 'Boost 92% · Night radar sweep online',
      items: [
        { tag: 'GRID', title: 'Neon Highway Sector 04', status: '1ST' },
        { tag: 'SYNC', title: 'Plasma Booster Cooling', status: '92%' },
        { tag: 'SCAN', title: 'Forward Horizon Sweep', status: 'CLEAR' }
      ],
      detailTitle: 'COCKPIT OVERDRIVE',
      detailSub: 'MAGENTA #D4176A × CYAN #00F0FF'
    },
    game: {
      genre: 'OUTRUN STARFIGHTER COCKPIT',
      title: 'NEON HORIZON // INTERCEPTOR',
      player: 'ACE-84',
      bossName: 'CYBER INTERCEPTOR MK-9',
      bossSub: 'Laser lock acquired · Fire plasma!',
      hpLabel: 'SHIELD',
      mpLabel: 'NITRO',
      skills: [
        { key: 'Q', name: 'Laser Pulse', dmg: 160 },
        { key: 'W', name: 'Nitro Boost', dmg: 220 },
        { key: 'E', name: 'Cyan Railgun', dmg: 320 },
        { key: 'R', name: 'Sunset Overdrive', dmg: 495 }
      ],
      logInit: 'Neon highway engaged! Click the lock-on reticle to fire plasma cannons!'
    },
    dashboard: {
      brand: 'NEO-GRID OPS',
      title: 'Cyber Sector Energy Telemetry',
      kpis: [
        { label: 'Grid Output', value: '8.84 GW', delta: '+21.4%' },
        { label: 'Signal Sync', value: '99.4%', delta: '+1.2%' },
        { label: 'Terminals', value: '42,190', delta: '+3,410' },
        { label: 'Boost Cell', value: '94%', delta: 'MAX' }
      ]
    }
  },

  'y2k-chrome': {
    tagline: 'Early-2000s millennium optimism gleaming with liquid chrome buttons, iridescent CD pearl sheen, and orbital star emblems.',
    traits: ['Liquid Chrome Metallic', 'CD Iridescent Pearl', '2000s Orbital Star ✦'],
    web: {
      brand: 'CHROME ✦ 2K',
      nav: ['ORBIT', 'SILVER', 'ARCHIVE', 'JOIN ✦'],
      kicker: 'Y2K MILLENNIUM EDITION · LIQUID CHROME',
      title: 'LIQUID CHROME & HOLOGRAPHIC FUTURE POP',
      subtitle: 'Revive PS2-era cyber polish with multi-stop metallic silver pills, iridescent ice-lavender gradients, and orbital stars.',
      primaryCta: '✦ OPEN CHROME CAPSULE',
      secondaryCta: 'HOLO SPECS',
      metrics: [
        { label: 'FINISH', value: 'CHROME' },
        { label: 'SHEEN', value: 'HOLO 3D' },
        { label: 'RANK', value: 'S++ ✦' }
      ],
      features: [
        { num: '✦ 01', title: 'Liquid Chrome Specular', desc: 'Multi-stop silver reflections and bright 2px top rims mimic polished liquid metal.' },
        { num: '✦ 02', title: 'Iridescent CD Pearl', desc: 'Ice cyan, holo lavender, and cyber pink glaze surfaces with unmistakable Y2K sheen.' },
        { num: '✦ 03', title: 'Orbital Star Identity', desc: 'Four-point stars and sweeping elliptical rings stamp every layout with millennium flair.' }
      ]
    },
    mobile: {
      appName: 'SILVER POD 2K',
      greeting: 'CYBER SYNC ✦ CONNECTED',
      primaryCardTitle: 'CHROME DROP #2000',
      primaryCardMeta: 'Limited Holo Pass active · RANK S+',
      items: [
        { tag: '✦ S+', title: 'Liquid Silver Edition Pack', status: 'OWNED' },
        { tag: 'HOLO', title: 'Orbital Star Avatar Frame', status: 'EQUIP' },
        { tag: '2000', title: 'Millennium Capsule Drop', status: 'NEW' }
      ],
      detailTitle: 'LIQUID CHROME DECK',
      detailSub: 'SILVER SPECULAR × IRIDESCENT PEARL'
    },
    game: {
      genre: 'PS2 STYLISH CYBER ARENA',
      title: 'JET ORBIT // RANK S+ ARENA',
      player: 'NOVA_2K ✦',
      bossName: 'CHROME VALKYRIE',
      bossSub: 'Stylish rank climbing · Keep the flow!',
      hpLabel: 'CHROME',
      mpLabel: 'HOLO',
      skills: [
        { key: 'Q', name: 'Star Dash ✦', dmg: 155 },
        { key: 'W', name: 'Chrome Spin', dmg: 215 },
        { key: 'E', name: 'Prism Wave', dmg: 305 },
        { key: 'R', name: 'Millennium Nova', dmg: 480 }
      ],
      logInit: 'CYBER ARENA 2000 online ✦ Click the liquid chrome star to reach S+ rank!'
    },
    dashboard: {
      brand: 'CHROME METRICS ✦',
      title: 'Millennium Drop Live Telemetry',
      kpis: [
        { label: 'Holo Passes', value: '32,400', delta: '+44.2%' },
        { label: 'Style Rank', value: 'S++', delta: 'TOP 1%' },
        { label: 'Conversion', value: '9.14%', delta: '+2.6%' },
        { label: 'Global Fans', value: '184K', delta: '+19K' }
      ]
    }
  },

  'frutiger-aero': {
    tagline: 'Sunlit mid-2000s eco-optimism with cerulean skies, floating glass water droplets, and signature half-gloss aqua gel pills.',
    traits: ['Half-Gloss Aqua Gel Pills', 'Sunlit Sky & Droplets', 'Refreshing Azure & Leaf'],
    web: {
      brand: 'AQUA HORIZON',
      nav: ['Sky OS', 'Eco Apps', 'Gallery', 'Download'],
      kicker: 'SUNLIT GLASS & WATER OPTICS · 2007 REVIVAL',
      title: 'Crystal Skies, Water Orbs & Glossy Aqua Joy',
      subtitle: 'Bring back hopeful 2000s clarity with top-half glass gel reflections, sunlit cerulean gradients, and lush meadow greens.',
      primaryCta: 'Explore Aqua Theme',
      secondaryCta: 'Gloss Components',
      metrics: [
        { label: 'CLARITY', value: '100% PURE' },
        { label: 'GLOSS', value: '50% GEL' },
        { label: 'ECO INDEX', value: 'A+ GREEN' }
      ],
      features: [
        { num: '01', title: '50% Specular Gel Gloss', desc: 'A crisp white top-half reflection turns every button into a tactile glass droplet.' },
        { num: '02', title: 'Sky & Bubble Atmosphere', desc: 'Floating translucent water spheres and soft green hills evoke sunlit freshness.' },
        { num: '03', title: 'Deep Ocean Contrast', desc: 'Rich navy typography ensures effortless readability over luminous frosted panes.' }
      ]
    },
    mobile: {
      appName: 'AERO WEATHER',
      greeting: 'SEOUL · CRYSTAL CLEAR SKY',
      primaryCardTitle: '23°C · Pure Fresh Air',
      primaryCardMeta: 'Humidity 42% · Breeze 2.4 m/s · UV Low',
      items: [
        { tag: 'AQUA', title: 'Hydration Goal 6 / 8 Cups', status: '75%' },
        { tag: 'ECO', title: 'Eco Walk 6,800 Steps', status: '+240P' },
        { tag: 'SKY', title: '5 PM Sunset Clarity Index', status: 'PEAK' }
      ],
      detailTitle: 'AQUA GEL CONTROLS',
      detailSub: 'SKY BLUE #006BB3 × LEAF GREEN #44C83C'
    },
    game: {
      genre: 'SKY ISLAND ECO RESORT',
      title: 'AERO ISLAND // WATER SANCTUARY',
      player: 'KEEPER SKY',
      bossName: 'CRYSTAL DROPLET SPIRIT',
      bossSub: 'Pure water orb · Charge eco resonance!',
      hpLabel: 'VITAL',
      mpLabel: 'AQUA',
      skills: [
        { key: 'Q', name: 'Bubble Pop', dmg: 130 },
        { key: 'W', name: 'Aqua Splash', dmg: 195 },
        { key: 'E', name: 'Eco Breeze', dmg: 270 },
        { key: 'R', name: 'Rainbow Arc', dmg: 425 }
      ],
      logInit: 'Welcome to Sky Sanctuary! Click the crystal droplet orb to charge eco harmony.'
    },
    dashboard: {
      brand: 'AERO CLEAN-GRID',
      title: 'Clean Water & Solar Grid Monitor',
      kpis: [
        { label: 'Clean Energy', value: '94.6%', delta: '+6.8%' },
        { label: 'Water Purity', value: '99.1', delta: 'PURE' },
        { label: 'CO2 Offset', value: '1,480t', delta: '+19%' },
        { label: 'Eco Members', value: '28.4K', delta: '+3.1K' }
      ]
    }
  },

  claymorphism: {
    tagline: 'Playful 3D inflated clay cushions sculpted with triple inner/outer shadows, pastel candy palettes, and plump Fredoka type.',
    traits: ['3-Layer 3D Clay Shadows', 'Pastel Candy Palette', 'Plump Bubble Toy Forms'],
    web: {
      brand: 'MOCHI STUDIO',
      nav: ['Toy Kit', 'Characters', 'Play', 'Get Started'],
      kicker: 'PLAYFUL 3D CLAYMORPHISM · SOFT TOY UI',
      title: 'Squishy 3D Clay Interfaces Built To Delight',
      subtitle: 'Inflate every card and button with tinted outer drops, inner bottom shading, top specular gloss, and bouncy spring physics.',
      primaryCta: 'Start Squishy Demo',
      secondaryCta: 'Browse 3D Kit',
      metrics: [
        { label: 'PHYSICS', value: 'SPRING' },
        { label: 'RADIUS', value: '32 PX' },
        { label: 'DELIGHT', value: '100%' }
      ],
      features: [
        { num: '01', title: 'Triple Clay Shading', desc: 'Outer tinted drop + inner lower depth + inner top shine create genuine puffy volume.' },
        { num: '02', title: 'Joyful Candy Hues', desc: 'Berry pink, mint, buttercup, and lavender soften onboarding for consumer apps and games.' },
        { num: '03', title: 'Bouncy Spring Motion', desc: 'Overshoot spring curves make every tap feel like squeezing a soft 3D toy.' }
      ]
    },
    mobile: {
      appName: 'MOCHI HABIT',
      greeting: '3-DAY STREAK UNLOCKED!',
      primaryCardTitle: 'Mochi Level 12 · 840 Stars',
      primaryCardMeta: '3 of 4 cozy daily goals complete!',
      items: [
        { tag: 'SIP', title: 'Morning Glass Of Water', status: 'DONE' },
        { tag: 'WALK', title: '20-Min Sunny Stroll', status: 'DONE' },
        { tag: 'READ', title: 'Read 15 Pages Tonight', status: 'PLAY' }
      ],
      detailTitle: '3D CLAY WIDGETS',
      detailSub: 'BERRY #D12C65 × MINT #5ED3C6'
    },
    game: {
      genre: 'COZY 3D TOY ADVENTURE',
      title: 'MOCHI LAND // PUFFY QUEST',
      player: 'MOCHI LV.18',
      bossName: 'JELLY CLOUD KING',
      bossSub: 'Puffy clay friend · Bouncy tap match!',
      hpLabel: 'HAPPY',
      mpLabel: 'STAR',
      skills: [
        { key: 'Q', name: 'Squish Boop', dmg: 135 },
        { key: 'W', name: 'Bubble Hop', dmg: 190 },
        { key: 'E', name: 'Candy Pop', dmg: 265 },
        { key: 'R', name: 'Rainbow Poof!', dmg: 420 }
      ],
      logInit: 'Welcome to Mochi Land! Tap the smiling clay mascot for bouncy combos!'
    },
    dashboard: {
      brand: 'MOCHI CREATOR',
      title: 'Cozy Community Growth Board',
      kpis: [
        { label: 'Happy Users', value: '48,200', delta: '+26%' },
        { label: 'Daily Streak', value: '89.4%', delta: '+8.2%' },
        { label: 'Stickers Won', value: '142K', delta: '+14K' },
        { label: 'Store Rating', value: '4.9 ★', delta: 'TOP' }
      ]
    }
  },

  'solarpunk-eco': {
    tagline: 'Optimistic eco-futurism blending sunlit linen stock, botanical forest green, terracotta warmth, and greenhouse arches.',
    traits: ['Botanical Green & Terracotta', 'Greenhouse Arch Curves', 'Sunlit Linen Warmth'],
    web: {
      brand: 'VERDANT // 2050',
      nav: ['Sky Gardens', 'Solar Grid', 'Ecology', 'Join'],
      kicker: 'OPTIMISTIC ECO-FUTURISM · SOLARPUNK',
      title: 'Where Sunlight, Flora & Technology Thrive Together',
      subtitle: 'Replace cold dystopian chrome with warm sunlit linen, deep forest ink, terracotta accents, and organic Fraunces typography.',
      primaryCta: 'Explore Sky Garden',
      secondaryCta: 'Solar Report',
      metrics: [
        { label: 'SOLAR SHARE', value: '98.4%' },
        { label: 'BIOME', value: 'FLOURISH' },
        { label: 'CARBON', value: 'NET -12%' }
      ],
      features: [
        { num: '01', title: 'Greenhouse Arch Frames', desc: 'Botanical dome silhouettes soften digital layouts into breathable living spaces.' },
        { num: '02', title: 'Forest & Terracotta', desc: 'Deep forest green replaces harsh black ink while sunlit terracotta brings warmth.' },
        { num: '03', title: 'Organic Fraunces Serif', desc: 'Expressive humanist curves convey hopeful, sustainable technological craft.' }
      ]
    },
    mobile: {
      appName: 'SUNLEAF HOME',
      greeting: 'ROOFTOP GLASSHOUSE · SUNNY',
      primaryCardTitle: 'Solar Self-Sufficiency 114%',
      primaryCardMeta: '+4.2 kWh surplus shared with neighbors',
      items: [
        { tag: 'SUN', title: 'South Array Peak Harvest', status: '6.4kW' },
        { tag: 'LEAF', title: 'Hydroponic Herb Auto-Mist', status: 'LUSH' },
        { tag: 'AIR', title: 'Biome Oxygen & Humidity', status: '98%' }
      ],
      detailTitle: 'BIOSPHERE CARE',
      detailSub: 'BOTANICAL #256E42 × TERRACOTTA #D97736'
    },
    game: {
      genre: 'BOTANICAL SKY-GARDEN SIM',
      title: 'HELIO DOME // TERRAFORM 19',
      player: 'BOTANIST SOL',
      bossName: 'ARID DUST STORM',
      bossSub: 'Desert restoration phase · Expand biosphere',
      hpLabel: 'BLOOM',
      mpLabel: 'SOLAR',
      skills: [
        { key: 'Q', name: 'Sow Seeds', dmg: 130 },
        { key: 'W', name: 'Solar Lens', dmg: 190 },
        { key: 'E', name: 'Forest Wave', dmg: 275 },
        { key: 'R', name: 'Eden Bloom', dmg: 435 }
      ],
      logInit: 'Sky glasshouse online. Click the biosphere dome to restore the desert.'
    },
    dashboard: {
      brand: 'SOLAR COMMONS',
      title: 'Community Renewable Energy Board',
      kpis: [
        { label: 'Solar Output', value: '482 MWh', delta: '+16.4%' },
        { label: 'Rewilded Area', value: '14.2 ha', delta: '+2.1 ha' },
        { label: 'Grid Autonomy', value: '108%', delta: 'SURPLUS' },
        { label: 'Households', value: '6,920', delta: '+410' }
      ]
    }
  },

  memphis: {
    tagline: '1981 Milanese postmodern pop bursting with zigzags, confetti dots, deep royal navy outlines, and turquoise-pink offset shadows.',
    traits: ['Zigzag & Confetti Motifs', '80s Postmodern Pop Hues', 'Colorful Offset Shadows'],
    web: {
      brand: 'MILANO POP 81',
      nav: ['Patterns', 'Festival', 'Goods', 'Tickets 〰'],
      kicker: '1981 POSTMODERN POP · MEMPHIS MILANO',
      title: 'Zigzags, Confetti & Joyful Postmodern Pop!',
      subtitle: 'Rebel against stiff grids with royal navy outlines, turquoise & bubblegum offset shadows, and playful 1980s geometric confetti.',
      primaryCta: 'See Party Lineup 〰',
      secondaryCta: 'Pattern Kit',
      metrics: [
        { label: 'PATTERNS', value: '▲ 〰 ●' },
        { label: 'MOOD', value: '1981 POP' },
        { label: 'ENERGY', value: 'MAX FUN' }
      ],
      features: [
        { num: '▲ 1', title: 'Colored Offset Shadows', desc: 'Turquoise, pink, and yellow hard shadows keep Memphis brighter than black brutalism.' },
        { num: '〰 2', title: 'Squiggles & Confetti', desc: 'Playful zigzags, half-moons, and polka dots inject festive Milanese rhythm.' },
        { num: '● 3', title: 'Royal Navy Outlines', desc: 'Deep indigo linework harmonizes cheerfully with high-energy pop accents.' }
      ]
    },
    mobile: {
      appName: 'POP QUIZ 81',
      greeting: 'DAILY POP TRIVIA PARTY!',
      primaryCardTitle: '12-Streak Fever Combo 〰',
      primaryCardMeta: 'Top 3% · Weekend Confetti Badge unlocked!',
      items: [
        { tag: '▲', title: '80s Pop-Art Speed Quiz', status: '+350P' },
        { tag: '〰', title: '1v1 Rhythm Party Duel', status: 'WIN!' },
        { tag: '●', title: 'Daily Confetti Bonus', status: 'CLAIM' }
      ],
      detailTitle: 'MEMPHIS PARTY DECK',
      detailSub: 'PINK #FF5FA2 × MINT #00C9B7 × YELLOW #FFD23F'
    },
    game: {
      genre: '80S POP PINBALL ARCADE',
      title: 'MEMPHIS BUMPER // BONUS STAGE',
      player: 'POP_STAR 81',
      bossName: 'ZIGZAG MEGA BUMPER',
      bossSub: 'Confetti fever time · Multiplier UP!',
      hpLabel: 'FEVER',
      mpLabel: 'POP',
      skills: [
        { key: 'Q', name: 'Zigzag Shot', dmg: 145 },
        { key: 'W', name: 'Confetti Pop', dmg: 205 },
        { key: 'E', name: 'Tri-Combo', dmg: 290 },
        { key: 'R', name: 'Milano Fever!', dmg: 460 }
      ],
      logInit: 'BONUS STAGE START 〰 Click the zigzag bumper to pop score multipliers!'
    },
    dashboard: {
      brand: 'POP FEST METRICS',
      title: 'Festival Tickets & Merch Live Board',
      kpis: [
        { label: 'Tickets Sold', value: '18,920', delta: '+34%!' },
        { label: 'Merch Carts', value: '4,210', delta: '+520' },
        { label: 'Quiz Play', value: '92.8%', delta: '+9.1%' },
        { label: 'Social Shares', value: '64.5K', delta: 'POP 〰' }
      ]
    }
  }
});

export function getLocalizedStyleView(style, lang = 'ko') {
  if (lang !== 'en') {
    return {
      displayName: style.nameKo,
      secondaryName: style.nameEn,
      tagline: style.tagline,
      traits: style.traits,
      domainTips: style.dna.domainTipsKo,
      showcase: style.showcase
    };
  }
  const en = SHOWCASE_EN[style.id];
  return {
    displayName: style.nameEn,
    secondaryName: style.nameKo,
    tagline: en?.tagline || style.dna.philosophyEn,
    traits: en?.traits || style.traits,
    domainTips: style.dna.domainTipsEn,
    showcase: en || style.showcase
  };
}
