/**
 * Pure Generator Engine for Dynamic Live CSS, Live designs.md, and Design Tokens
 * 100% reactive to subcategory selection, live tweak sliders, and active archetype.
 */

// Authoritative Theme Token Presets matching themeTokens.css
export const THEME_TOKENS_MAP = {
  'swiss-grid': {
    '--theme-bg': '#F4F4F0',
    '--theme-surface': '#FFFFFF',
    '--theme-surface-subtle': '#EAEAE6',
    '--theme-border': '#111111',
    '--theme-text': '#111111',
    '--theme-text-muted': '#555555',
    '--theme-accent': '#FF3300',
    '--theme-accent-secondary': '#000000',
    '--theme-radius': '0px',
    '--theme-border-width': '2px',
    '--theme-shadow': '4px 4px 0px #111111',
    '--theme-font-family': "'Space Grotesk', 'Helvetica Neue', sans-serif",
    '--theme-glow': 'none'
  },
  'corporate-minimal': {
    '--theme-bg': '#F8FAFC',
    '--theme-surface': '#FFFFFF',
    '--theme-surface-subtle': '#F1F5F9',
    '--theme-border': '#E2E8F0',
    '--theme-text': '#0F172A',
    '--theme-text-muted': '#64748B',
    '--theme-accent': '#2563EB',
    '--theme-accent-secondary': '#0EA5E9',
    '--theme-radius': '12px',
    '--theme-border-width': '1px',
    '--theme-shadow': '0 10px 25px -5px rgba(15, 23, 42, 0.08)',
    '--theme-font-family': "'Inter', sans-serif",
    '--theme-glow': '0 0 15px rgba(37, 99, 235, 0.2)'
  },
  'high-contrast-mono': {
    '--theme-bg': '#050505',
    '--theme-surface': '#121212',
    '--theme-surface-subtle': '#1E1E1E',
    '--theme-border': '#333333',
    '--theme-text': '#FFFFFF',
    '--theme-text-muted': '#888888',
    '--theme-accent': '#00FF66',
    '--theme-accent-secondary': '#00CC55',
    '--theme-radius': '4px',
    '--theme-border-width': '1px',
    '--theme-shadow': '0 0 15px rgba(0, 255, 102, 0.15)',
    '--theme-font-family': "'Fira Code', monospace",
    '--theme-glow': '0 0 12px rgba(0, 255, 102, 0.4)'
  },
  'raw-brutalism': {
    '--theme-bg': '#0D0D0D',
    '--theme-surface': '#171717',
    '--theme-surface-subtle': '#262626',
    '--theme-border': '#FFFFFF',
    '--theme-text': '#FFFFFF',
    '--theme-text-muted': '#A3A3A3',
    '--theme-accent': '#FFFF00',
    '--theme-accent-secondary': '#FF0055',
    '--theme-radius': '0px',
    '--theme-border-width': '3px',
    '--theme-shadow': '6px 6px 0px #FFFFFF',
    '--theme-font-family': "'Fira Code', 'Courier New', monospace",
    '--theme-glow': 'none'
  },
  'neo-brutalism': {
    '--theme-bg': '#FFFDF5',
    '--theme-surface': '#FFE600',
    '--theme-surface-subtle': '#FF80BF',
    '--theme-border': '#000000',
    '--theme-text': '#000000',
    '--theme-text-muted': '#222222',
    '--theme-accent': '#FF0055',
    '--theme-accent-secondary': '#00D4FF',
    '--theme-radius': '12px',
    '--theme-border-width': '3px',
    '--theme-shadow': '5px 5px 0px #000000',
    '--theme-font-family': "'Space Grotesk', sans-serif",
    '--theme-glow': 'none'
  },
  'cyber-brutalism': {
    '--theme-bg': '#0A0A0C',
    '--theme-surface': '#141419',
    '--theme-surface-subtle': '#1F1F27',
    '--theme-border': '#00FFCC',
    '--theme-text': '#F4F4F5',
    '--theme-text-muted': '#A1A1AA',
    '--theme-accent': '#FF0055',
    '--theme-accent-secondary': '#00FFCC',
    '--theme-radius': '2px',
    '--theme-border-width': '3px',
    '--theme-shadow': '6px 6px 0px #00FFCC',
    '--theme-font-family': "'Fira Code', monospace",
    '--theme-glow': '0 0 20px rgba(0, 255, 204, 0.4)'
  },
  'glassmorphism': {
    '--theme-bg': '#0B0E17',
    '--theme-surface': 'rgba(255, 255, 255, 0.08)',
    '--theme-surface-subtle': 'rgba(255, 255, 255, 0.04)',
    '--theme-border': 'rgba(255, 255, 255, 0.22)',
    '--theme-text': '#FFFFFF',
    '--theme-text-muted': 'rgba(255, 255, 255, 0.7)',
    '--theme-accent': '#00F0FF',
    '--theme-accent-secondary': '#A855F7',
    '--theme-radius': '20px',
    '--theme-border-width': '1px',
    '--theme-shadow': '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
    '--theme-font-family': "'Inter', sans-serif",
    '--theme-glow': '0 0 30px rgba(0, 240, 255, 0.3)',
    'backdrop-filter': 'blur(20px)'
  },
  'neumorphism': {
    '--theme-bg': '#E0E5EC',
    '--theme-surface': '#E0E5EC',
    '--theme-surface-subtle': '#D1D9E6',
    '--theme-border': 'transparent',
    '--theme-text': '#31344B',
    '--theme-text-muted': '#7E8BA3',
    '--theme-accent': '#4D7CFE',
    '--theme-accent-secondary': '#6C5CE7',
    '--theme-radius': '20px',
    '--theme-border-width': '0px',
    '--theme-shadow': '9px 9px 16px rgba(163, 177, 198, 0.6), -9px -9px 16px rgba(255, 255, 255, 0.8)',
    '--theme-font-family': "'Inter', sans-serif",
    '--theme-glow': 'none'
  },
  'skeuomorphism': {
    '--theme-bg': '#2B2520',
    '--theme-surface': 'linear-gradient(180deg, #5C5248 0%, #3D352E 100%)',
    '--theme-surface-subtle': '#4A4038',
    '--theme-border': '#7A6F62',
    '--theme-text': '#F3EBDD',
    '--theme-text-muted': '#BAAF9F',
    '--theme-accent': '#D4AF37',
    '--theme-accent-secondary': '#C07D3E',
    '--theme-radius': '10px',
    '--theme-border-width': '1px',
    '--theme-shadow': '0 8px 20px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
    '--theme-font-family': "'Cinzel', serif",
    '--theme-glow': '0 0 15px rgba(212, 175, 55, 0.3)'
  },
  'memphis': {
    '--theme-bg': '#FFFDF0',
    '--theme-surface': '#FFFFFF',
    '--theme-surface-subtle': '#FFF3B0',
    '--theme-border': '#111111',
    '--theme-text': '#111111',
    '--theme-text-muted': '#444444',
    '--theme-accent': '#FF4081',
    '--theme-accent-secondary': '#00E5FF',
    '--theme-radius': '14px',
    '--theme-border-width': '3px',
    '--theme-shadow': '5px 5px 0px #111111',
    '--theme-font-family': "'Space Grotesk', sans-serif",
    '--theme-glow': 'none'
  },
  'synthwave': {
    '--theme-bg': '#0D0221',
    '--theme-surface': '#1E0836',
    '--theme-surface-subtle': '#300E54',
    '--theme-border': '#FF007F',
    '--theme-text': '#00F0FF',
    '--theme-text-muted': '#D400FF',
    '--theme-accent': '#FF007F',
    '--theme-accent-secondary': '#00F0FF',
    '--theme-radius': '8px',
    '--theme-border-width': '2px',
    '--theme-shadow': '0 0 25px rgba(255, 0, 127, 0.45)',
    '--theme-font-family': "'Space Grotesk', sans-serif",
    '--theme-glow': '0 0 20px #FF007F'
  },
  'vaporwave': {
    '--theme-bg': '#1A0B2E',
    '--theme-surface': '#2D124D',
    '--theme-surface-subtle': '#411B6D',
    '--theme-border': '#FF71CE',
    '--theme-text': '#01CDFE',
    '--theme-text-muted': '#B967FF',
    '--theme-accent': '#FF71CE',
    '--theme-accent-secondary': '#05FFA1',
    '--theme-radius': '12px',
    '--theme-border-width': '2px',
    '--theme-shadow': '0 0 25px rgba(255, 113, 206, 0.45)',
    '--theme-font-family': "'Space Grotesk', sans-serif",
    '--theme-glow': '0 0 20px #FF71CE'
  },
  'high-fashion': {
    '--theme-bg': '#F7F5F0',
    '--theme-surface': '#FFFFFF',
    '--theme-surface-subtle': '#EFECE6',
    '--theme-border': '#D8D2C6',
    '--theme-text': '#1C1917',
    '--theme-text-muted': '#78716C',
    '--theme-accent': '#881337',
    '--theme-accent-secondary': '#92400E',
    '--theme-radius': '0px',
    '--theme-border-width': '1px',
    '--theme-shadow': '0 4px 20px rgba(0, 0, 0, 0.06)',
    '--theme-font-family': "'Cinzel', 'Playfair Display', serif",
    '--theme-glow': 'none'
  },
  'fluid-organic': {
    '--theme-bg': '#F2EFE9',
    '--theme-surface': '#FFFFFF',
    '--theme-surface-subtle': '#E5DFC5',
    '--theme-border': '#D4C9A8',
    '--theme-text': '#2C3E2D',
    '--theme-text-muted': '#6B7C6C',
    '--theme-accent': '#3E885B',
    '--theme-accent-secondary': '#C07D3E',
    '--theme-radius': '24px',
    '--theme-border-width': '1px',
    '--theme-shadow': '0 10px 25px rgba(44, 62, 45, 0.08)',
    '--theme-font-family': "'Inter', sans-serif",
    '--theme-glow': '0 0 15px rgba(62, 136, 91, 0.2)'
  },
  'dark-minimal-glass': {
    '--theme-bg': '#090A0F',
    '--theme-surface': '#12151F',
    '--theme-surface-subtle': '#1C2130',
    '--theme-border': 'rgba(255, 255, 255, 0.16)',
    '--theme-text': '#FFFFFF',
    '--theme-text-muted': '#94A3B8',
    '--theme-accent': '#38BDF8',
    '--theme-accent-secondary': '#818CF8',
    '--theme-radius': '12px',
    '--theme-border-width': '1px',
    '--theme-shadow': '0 12px 30px rgba(0, 0, 0, 0.6)',
    '--theme-font-family': "'Inter', sans-serif",
    '--theme-glow': '0 0 20px rgba(56, 189, 248, 0.3)'
  },
  'y2k-chrome': {
    '--theme-bg': '#0D0A1A',
    '--theme-surface': 'rgba(30, 20, 55, 0.7)',
    '--theme-surface-subtle': 'rgba(50, 35, 90, 0.5)',
    '--theme-border': '#A855F7',
    '--theme-text': '#F3E8FF',
    '--theme-text-muted': '#C084FC',
    '--theme-accent': '#EC4899',
    '--theme-accent-secondary': '#06B6D4',
    '--theme-radius': '16px',
    '--theme-border-width': '2px',
    '--theme-shadow': '0 0 30px rgba(168, 85, 247, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.4)',
    '--theme-font-family': "'Space Grotesk', sans-serif",
    '--theme-glow': '0 0 25px rgba(236, 72, 153, 0.5)'
  },
  'frutiger-aero': {
    '--theme-bg': 'linear-gradient(135deg, #0A4368 0%, #05263B 100%)',
    '--theme-surface': 'rgba(255, 255, 255, 0.2)',
    '--theme-surface-subtle': 'rgba(255, 255, 255, 0.1)',
    '--theme-border': 'rgba(255, 255, 255, 0.5)',
    '--theme-text': '#FFFFFF',
    '--theme-text-muted': '#BEE3F8',
    '--theme-accent': '#00E5FF',
    '--theme-accent-secondary': '#76FF03',
    '--theme-radius': '20px',
    '--theme-border-width': '1.5px',
    '--theme-shadow': '0 16px 36px rgba(0, 40, 80, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.6)',
    '--theme-font-family': "'Inter', sans-serif",
    '--theme-glow': '0 0 25px rgba(0, 229, 255, 0.6)',
    'backdrop-filter': 'blur(14px)'
  },
  'pixel-arcade': {
    '--theme-bg': '#100C2A',
    '--theme-surface': '#1E1646',
    '--theme-surface-subtle': '#2C2266',
    '--theme-border': '#FFCC00',
    '--theme-text': '#FFFFFF',
    '--theme-text-muted': '#A39BDE',
    '--theme-accent': '#00FF66',
    '--theme-accent-secondary': '#FF0055',
    '--theme-radius': '0px',
    '--theme-border-width': '4px',
    '--theme-shadow': '6px 6px 0px #000000',
    '--theme-font-family': "'Fira Code', 'Courier New', monospace",
    '--theme-glow': '0 0 15px #00FF66'
  },
  'kinetic-type': {
    '--theme-bg': '#000000',
    '--theme-surface': '#111111',
    '--theme-surface-subtle': '#222222',
    '--theme-border': '#CCFF00',
    '--theme-text': '#FFFFFF',
    '--theme-text-muted': '#888888',
    '--theme-accent': '#CCFF00',
    '--theme-accent-secondary': '#FFFFFF',
    '--theme-radius': '0px',
    '--theme-border-width': '2px',
    '--theme-shadow': '0 0 30px rgba(204, 255, 0, 0.25)',
    '--theme-font-family': "'Space Grotesk', sans-serif",
    '--theme-glow': '0 0 20px #CCFF00'
  },
  'bento-grid': {
    '--theme-bg': '#0B0E14',
    '--theme-surface': 'rgba(22, 28, 38, 0.7)',
    '--theme-surface-subtle': 'rgba(255, 255, 255, 0.04)',
    '--theme-border': 'rgba(255, 255, 255, 0.1)',
    '--theme-text': '#F1F5F9',
    '--theme-text-muted': '#94A3B8',
    '--theme-accent': '#38BDF8',
    '--theme-accent-secondary': '#A78BFA',
    '--theme-radius': '18px',
    '--theme-border-width': '1px',
    '--theme-shadow': '0 16px 36px rgba(0, 0, 0, 0.45)',
    '--theme-font-family': "'Inter', sans-serif",
    '--theme-glow': '0 0 25px rgba(56, 189, 248, 0.25)',
    'backdrop-filter': 'blur(16px)'
  },
  'acid-techno': {
    '--theme-bg': '#050608',
    '--theme-surface': 'rgba(15, 20, 28, 0.85)',
    '--theme-surface-subtle': 'rgba(25, 35, 50, 0.6)',
    '--theme-border': '#00F0FF',
    '--theme-text': '#00F0FF',
    '--theme-text-muted': '#008899',
    '--theme-accent': '#CCFF00',
    '--theme-accent-secondary': '#FF0055',
    '--theme-radius': '4px',
    '--theme-border-width': '1.5px',
    '--theme-shadow': '0 0 25px rgba(0, 240, 255, 0.35)',
    '--theme-font-family': "'Fira Code', monospace",
    '--theme-glow': '0 0 20px #00F0FF'
  },
  'claymorphism': {
    '--theme-bg': '#F0F4FD',
    '--theme-surface': '#FFFFFF',
    '--theme-surface-subtle': '#E2EAFC',
    '--theme-border': 'transparent',
    '--theme-text': '#2D3748',
    '--theme-text-muted': '#718096',
    '--theme-accent': '#FF6B4A',
    '--theme-accent-secondary': '#6B46C1',
    '--theme-radius': '28px',
    '--theme-border-width': '0px',
    '--theme-shadow': '12px 16px 28px rgba(140, 160, 210, 0.35), inset -8px -8px 12px rgba(0, 0, 0, 0.06), inset 8px 8px 12px rgba(255, 255, 255, 0.9)',
    '--theme-font-family': "'Space Grotesk', sans-serif",
    '--theme-glow': '0 10px 20px rgba(255, 107, 74, 0.25)'
  },
  'handcrafted-indie': {
    '--theme-bg': '#F5EFEB',
    '--theme-surface': '#FFFDF9',
    '--theme-surface-subtle': '#ECE1D8',
    '--theme-border': '#4A3E3D',
    '--theme-text': '#3D3231',
    '--theme-text-muted': '#7C6C6A',
    '--theme-accent': '#E05A47',
    '--theme-accent-secondary': '#D49B35',
    '--theme-radius': '4px',
    '--theme-border-width': '2px',
    '--theme-shadow': '3px 4px 0px #4A3E3D',
    '--theme-font-family': "'Space Grotesk', sans-serif",
    '--theme-glow': 'none'
  },
  'solarpunk-eco': {
    '--theme-bg': '#0A1C14',
    '--theme-surface': '#132E22',
    '--theme-surface-subtle': '#1C4030',
    '--theme-border': '#00E699',
    '--theme-text': '#E8F5E9',
    '--theme-text-muted': '#A5D6A7',
    '--theme-accent': '#00E699',
    '--theme-accent-secondary': '#FFD54F',
    '--theme-radius': '18px',
    '--theme-border-width': '1.5px',
    '--theme-shadow': '0 0 30px rgba(0, 230, 153, 0.3)',
    '--theme-font-family': "'Space Grotesk', sans-serif",
    '--theme-glow': '0 0 25px #00E699'
  }
};

// Archetype CSS Templates
const ARCHETYPE_CSS_MAP = {
  game: `/* === Game HUD Archetype Components === */
.archetype-game {
  background: var(--theme-bg);
  color: var(--theme-text);
  font-family: var(--theme-font-family);
  border-radius: var(--tweak-radius, var(--theme-radius));
  padding: 16px;
}
.game-hud-header {
  display: flex;
  justify-content: space-between;
  background: var(--theme-surface);
  border: var(--tweak-border-width, var(--theme-border-width)) solid var(--theme-border);
  border-radius: var(--tweak-radius, var(--theme-radius));
  padding: 12px;
  box-shadow: 0 var(--tweak-shadow-depth, 12px) 24px rgba(0,0,0,0.3);
}
.meter-fill.hp-fill { background: #ef4444; border-radius: 99px; }
.meter-fill.mp-fill { background: #3b82f6; border-radius: 99px; }
.arena-target {
  background: var(--theme-surface);
  border: var(--tweak-border-width, 2px) solid var(--theme-accent);
  border-radius: var(--tweak-radius, 12px);
  box-shadow: 0 0 calc(20px * var(--tweak-glow-intensity, 1)) var(--theme-accent);
  cursor: pointer;
  transition: transform 0.1s ease;
}
.arena-target:active { transform: scale(0.92); }`,

  web: `/* === Web SaaS Landing Archetype Components === */
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
  border-radius: var(--tweak-radius, 8px);
  padding: 10px 22px;
  font-weight: 600;
  box-shadow: 0 var(--tweak-shadow-depth, 8px) 16px rgba(0,0,0,0.2);
}`,

  mobile: `/* === Mobile App Screen Archetype Components === */
.archetype-mobile {
  max-width: 380px;
  margin: 0 auto;
  background: var(--theme-bg);
  color: var(--theme-text);
  border: var(--tweak-border-width, 1px) solid var(--theme-border);
  border-radius: calc(var(--tweak-radius, 20px) + 8px);
  overflow: hidden;
  box-shadow: 0 var(--tweak-shadow-depth, 20px) 40px rgba(0,0,0,0.5);
}
.mobile-notif-card,
.mobile-feature-card {
  background: var(--theme-surface);
  border: var(--tweak-border-width, 1px) solid var(--theme-border);
  border-radius: var(--tweak-radius, 12px);
  padding: 14px;
  backdrop-filter: blur(var(--tweak-backdrop-blur, 16px));
}
.mobile-bottom-nav {
  display: flex;
  justify-content: space-around;
  background: var(--theme-surface);
  border-top: var(--tweak-border-width, 1px) solid var(--theme-border);
  padding: 12px 0;
}`,

  ecommerce: `/* === E-Commerce Storefront Archetype Components === */
.archetype-ecommerce {
  background: var(--theme-bg);
  color: var(--theme-text);
  font-family: var(--theme-font-family);
  padding: 20px;
}
.product-details {
  background: var(--theme-surface);
  border: var(--tweak-border-width, 1px) solid var(--theme-border);
  border-radius: var(--tweak-radius, 16px);
  box-shadow: 0 var(--tweak-shadow-depth, 10px) 25px rgba(0,0,0,0.15);
  padding: 20px;
}
.add-to-cart-btn {
  background: var(--theme-accent);
  color: var(--theme-bg);
  border-radius: var(--tweak-radius, 8px);
  padding: 12px 24px;
  font-weight: 700;
  width: 100%;
}`,

  blog: `/* === Magazine & Blog Article Archetype Components === */
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
}`,

  dashboard: `/* === Analytics Dashboard Archetype Components === */
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
  border-radius: var(--tweak-radius, 12px);
  padding: 16px;
  box-shadow: 0 var(--tweak-shadow-depth, 8px) 20px rgba(0,0,0,0.2);
}
.metric-val {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--theme-accent);
}`,

  media: `/* === Media Player Archetype Components === */
.archetype-media {
  background: var(--theme-bg);
  color: var(--theme-text);
  font-family: var(--theme-font-family);
  border-radius: var(--tweak-radius, 20px);
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
}`,

  chat: `/* === Messenger & Chat Archetype Components === */
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
  border-radius: var(--tweak-radius, 16px) var(--tweak-radius, 16px) 2px var(--tweak-radius, 16px);
  padding: 10px 16px;
  align-self: flex-end;
}
.chat-bubble-msg.peer {
  background: var(--theme-surface);
  color: var(--theme-text);
  border: var(--tweak-border-width, 1px) solid var(--theme-border);
  border-radius: var(--tweak-radius, 16px) var(--tweak-radius, 16px) var(--tweak-radius, 16px) 2px;
  padding: 10px 16px;
  align-self: flex-start;
}`
};

/**
 * 1. Live CSS Snippet Generator
 */
export function generateLiveCSSSnippet(subDesign, tweaks = {}, archetype = 'game', mode = 'full') {
  if (!subDesign) return '/* No design selected */';
  const tokens = THEME_TOKENS_MAP[subDesign.id] || THEME_TOKENS_MAP['swiss-grid'];
  const paletteRules = (subDesign.palette || []).map(p => `  --color-${slugify(p.name)}: ${p.hex};`).join('\n');

  const tokenBlock = `/* === [${subDesign.nameEn}] Theme Tokens & Live Tweaks === */
[data-theme="${subDesign.id}"] {
  /* Dynamic Theme Tokens */
  --theme-bg: ${tokens['--theme-bg']};
  --theme-surface: ${tokens['--theme-surface']};
  --theme-surface-subtle: ${tokens['--theme-surface-subtle']};
  --theme-border: ${tokens['--theme-border']};
  --theme-text: ${tokens['--theme-text']};
  --theme-text-muted: ${tokens['--theme-text-muted']};
  --theme-accent: ${tokens['--theme-accent']};
  --theme-accent-secondary: ${tokens['--theme-accent-secondary']};
  --theme-radius: ${tokens['--theme-radius']};
  --theme-border-width: ${tokens['--theme-border-width']};
  --theme-shadow: ${tokens['--theme-shadow']};
  --theme-font-family: ${tokens['--theme-font-family']};
  --theme-glow: ${tokens['--theme-glow']};

  /* Color Palette */
${paletteRules}

  /* Live Tweaked Metrics */
  --tweak-radius: ${tweaks.borderRadius ?? 16}px;
  --tweak-border-width: ${tweaks.borderWidth ?? 1}px;
  --tweak-shadow-depth: ${tweaks.shadowDepth ?? 12}px;
  --tweak-backdrop-blur: ${tweaks.backdropBlur ?? 16}px;
  --tweak-glow-intensity: ${Number(tweaks.glowIntensity ?? 1).toFixed(1)};
}`;

  const compBlock = ARCHETYPE_CSS_MAP[archetype] || ARCHETYPE_CSS_MAP.game;

  if (mode === 'tokens') {
    return tokenBlock;
  }
  if (mode === 'component') {
    return compBlock;
  }
  return `${tokenBlock}\n\n${compBlock}`;
}

/**
 * 2. Live designs.md Markdown Spec Generator
 */
export function generateLiveDesignSpecMarkdown(subDesign, tweaks = {}, archetype = 'game', device = 'desktop') {
  if (!subDesign) return '# Design Specification (No Selection)';
  const tokens = THEME_TOKENS_MAP[subDesign.id] || THEME_TOKENS_MAP['swiss-grid'];

  const paletteRows = (subDesign.palette || []).map(p => `| \`${p.name}\` | \`${p.hex}\` | <span style="display:inline-block;width:12px;height:12px;background:${p.hex};border-radius:2px;border:1px solid #666;"></span> | ${p.usage || '주요 테마 색상'} |`).join('\n');

  const charList = (subDesign.characteristics || []).map(c => `- ✓ ${c}`).join('\n');
  const prosList = (subDesign.pros || []).map(p => `- 👍 ${p}`).join('\n');
  const consList = (subDesign.cons || []).map(c => `- ⚠️ ${c}`).join('\n');

  const archetypeDiagrams = {
    game: `\`\`\`
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
\`\`\``,
    web: `\`\`\`
+-------------------------------------------------------------+
| [LOGO]                      [Features] [Docs] [Pricing] [CTA]|
+-------------------------------------------------------------+
|                                                             |
|          🚀 HIGH-CONVERSION SAAS HEADLINE HERO              |
|        Modern interactive design system sandbox             |
|                  [ Primary CTA ]  [ Demo ]                  |
|                                                             |
+-------------------------------------------------------------+
\`\`\``,
    mobile: `\`\`\`
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
\`\`\``,
    ecommerce: `\`\`\`
+-------------------------------------------------------------+
| [PRODUCT IMAGE / 3D PREVIEW]  |  [PRODUCT TITLE & BADGES]   |
|                               |  Price: $129.00             |
|                               |  Color: [⚫] [⚪] [🔴]       |
|                               |  Qty: [-] [ 1 ] [+]         |
|                               |  [ 🛍️ ADD TO CART ]         |
+-------------------------------------------------------------+
\`\`\``,
    blog: `\`\`\`
+-------------------------------------------------------------+
| [=== READING PROGRESS BAR 68% ============================] |
| 📰 Article Headline: Architectural Modernism in Digital UI   |
| By Author • 5 min read • Published Today                     |
+-------------------------------------------------------------+
| Markdown Editorial Body Content...                          |
| [ ❤️ Like +42 ]  [ 💬 Leave a comment ]                     |
+-------------------------------------------------------------+
\`\`\``,
    dashboard: `\`\`\`
+-------------------------------------------------------------+
| FILTER: [ 1D ] [ 1W ] [ 1M ] [ 1Y ]                         |
+-------------------+--------------------+--------------------+
| TOTAL REVENUE     | ACTIVE USERS       | CONVERSION RATE    |
| $142,850 (+18.4%) | 12,480 (+5.2%)     | 4.82% (+1.1%)      |
+-------------------+--------------------+--------------------+
| DATA TABLE: Sortable Metrics & Status Indicators            |
+-------------------------------------------------------------+
\`\`\``,
    media: `\`\`\`
+-------------------------------------------------------------+
|                   💿 [ VINYL DISK ART ]                     |
|                 Track: Cybernetic Horizon                   |
|                   Artist: Spectrum Synth                    |
+-------------------------------------------------------------+
| [⏮️]         [ ▶️ PLAY / ⏸️ PAUSE ]         [⏭️]            |
| [================== ● 02:45 / 04:12 ======================] |
+-------------------------------------------------------------+
\`\`\``,
    chat: `\`\`\`
+--------------------+----------------------------------------+
| CHANNELS           | #general-discussion                    |
| # general          | [Agent]: Welcome to the interactive... |
| # design-lab       | [User]: Let's test the theme tokens!   |
| # audio-synth      | [Agent]: All tokens synchronized.      |
+--------------------+----------------------------------------+
| INPUT: [ Type your message...                     ] [ Send ]|
+--------------------+----------------------------------------+
\`\`\``
  };

  const currentDiagram = archetypeDiagrams[archetype] || archetypeDiagrams.game;

  return `# Design Specification: ${subDesign.name} (\`${subDesign.nameEn}\`)

> **Version:** 2.3.0  
> **Genre Category:** ${subDesign.categoryId || 'General'}  
> **Sub-Style ID:** \`${subDesign.id}\`  
> **Active Archetype:** \`${archetype.toUpperCase()}\`  
> **Target Viewport:** \`${device.toUpperCase()}\`  

---

## 1. Overview & Aesthetic Description
${subDesign.shortDesc || '선택된 디자인 사조의 시각적 언어와 인터랙션 토큰 명세서입니다.'}

---

## 2. Color Palette Design Tokens
| Token Name | HEX Code | Swatch | Intended Role |
| :--- | :--- | :---: | :--- |
${paletteRows}

---

## 3. Dynamic Live Tweak Parameters
| Parameter | Live Value | Default | Allowed Range | Unit |
| :--- | :---: | :---: | :---: | :--- |
| **Border Radius** | \`${tweaks.borderRadius ?? 16}px\` | \`${subDesign.defaultTweaks?.borderRadius ?? 16}px\` | \`0px ~ 64px\` | CSS Pixels |
| **Border Width** | \`${tweaks.borderWidth ?? 1}px\` | \`${subDesign.defaultTweaks?.borderWidth ?? 1}px\` | \`0px ~ 12px\` | CSS Pixels |
| **Shadow Depth** | \`${tweaks.shadowDepth ?? 12}px\` | \`${subDesign.defaultTweaks?.shadowDepth ?? 12}px\` | \`0px ~ 30px\` | CSS Pixels |
| **Backdrop Blur** | \`${tweaks.backdropBlur ?? 16}px\` | \`${subDesign.defaultTweaks?.backdropBlur ?? 16}px\` | \`0px ~ 32px\` | CSS Pixels |
| **Glow Intensity**| \`${Number(tweaks.glowIntensity ?? 1).toFixed(1)}\` | \`${Number(subDesign.defaultTweaks?.glowIntensity ?? 1).toFixed(1)}\` | \`0.0 ~ 2.0\` | Multiplier |

---

## 4. Typography & Font Stack
- **Display & Heading Font:** \`${tokens['--theme-font-family']}\`
- **Body & UI Font:** \`'Inter', -apple-system, BlinkMacSystemFont, sans-serif\`
- **Monospace / Code Font:** \`'Fira Code', 'Courier New', monospace\`

---

## 5. Active Archetype UI Structure: \`${archetype.toUpperCase()}\`
${currentDiagram}

### 5.1 Kinetic Interaction & State Rules
- **State Preservation:** 테마 스위치 시 게임 점수, 카트 아이템, 폼 입력값 보존 (Zero-Rebuild).
- **Accessibility:** WAI-ARIA \`role="tab"\`, \`role="button"\`, 키보드 탐색(\`[\` / \`]\`, \`ArrowLeft\` / \`ArrowRight\`) 준수.
- **Audio Feedback:** Web Audio API 기반 상태 전환 사운드 효과(THEME_SWAP, CLICK, COPY, SFX) 연동.

---

## 6. Characteristics & Design Guidelines
### 📋 핵심 시각적 특징
${charList}

### 👍 추천 사용처 및 장점
${prosList}

### ⚠️ 주의사항 및 한계점
${consList}

---

## 7. Integration Quickstart
HTML 요소에 테마 속성을 적용하여 스타일을 활성화합니다.
\`\`\`html
<div class="archetype-unit" data-theme="${subDesign.id}" data-archetype="${archetype}">
  <!-- Your semantic markup here -->
</div>
\`\`\`
`;
}

function splitCssList(value) {
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < value.length; index += 1) {
    if (value[index] === '(') depth += 1;
    if (value[index] === ')') depth -= 1;
    if (value[index] === ',' && depth === 0) {
      parts.push(value.slice(start, index).trim());
      start = index + 1;
    }
  }
  parts.push(value.slice(start).trim());
  return parts.filter(Boolean);
}

function parseCssColor(cssValue) {
  const value = String(cssValue).trim();
  if (value.toLowerCase() === 'transparent') {
    return { colorSpace: 'srgb', components: [0, 0, 0], alpha: 0, hex: '#000000' };
  }

  const hexMatch = value.match(/^#([\da-f]{3,8})$/i);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3 || hex.length === 4) {
      hex = Array.from(hex, character => character.repeat(2)).join('');
    }
    const hasAlpha = hex.length === 8;
    const rgbHex = hex.slice(0, 6);
    const components = [0, 2, 4].map(index => Number.parseInt(rgbHex.slice(index, index + 2), 16) / 255);
    const color = { colorSpace: 'srgb', components, hex: `#${rgbHex.toLowerCase()}` };
    if (hasAlpha) color.alpha = Number.parseInt(hex.slice(6, 8), 16) / 255;
    return color;
  }

  const rgbMatch = value.match(/^rgba?\(([^)]+)\)$/i);
  if (rgbMatch) {
    const channels = rgbMatch[1].split(',').map(channel => Number.parseFloat(channel.trim()));
    if (channels.length < 3 || channels.some(channel => Number.isNaN(channel))) {
      throw new TypeError(`지원하지 않는 CSS 색상 값입니다: ${cssValue}`);
    }
    const rgb = channels.slice(0, 3).map(channel => Math.max(0, Math.min(255, channel)));
    const rgbHex = rgb.map(channel => Math.round(channel).toString(16).padStart(2, '0')).join('');
    return {
      colorSpace: 'srgb',
      components: rgb.map(channel => channel / 255),
      alpha: Math.max(0, Math.min(1, channels[3] ?? 1)),
      hex: `#${rgbHex}`
    };
  }

  throw new TypeError(`지원하지 않는 CSS 색상 값입니다: ${cssValue}`);
}

function createDtcgColorToken(cssValue, description) {
  const gradientMatch = String(cssValue).trim().match(/^linear-gradient\((.*)\)$/i);
  if (!gradientMatch) {
    return { $value: parseCssColor(cssValue), $type: 'color', ...(description ? { $description: description } : {}) };
  }

  const parts = splitCssList(gradientMatch[1]);
  if (!/(?:#|rgb|transparent)/i.test(parts[0])) parts.shift();
  const stops = parts.map((part, index) => {
    const match = part.match(/^(.*?)\s+(-?\d+(?:\.\d+)?)%$/);
    const colorValue = match ? match[1] : part;
    const position = match ? Number.parseFloat(match[2]) / 100 : index / Math.max(1, parts.length - 1);
    return { color: parseCssColor(colorValue), position };
  });
  return { $value: stops, $type: 'gradient', ...(description ? { $description: description } : {}) };
}

function parseDimension(cssValue) {
  const match = String(cssValue).trim().match(/^(-?\d+(?:\.\d+)?)(px|rem)?$/i);
  if (!match) throw new TypeError(`지원하지 않는 CSS 치수 값입니다: ${cssValue}`);
  return { value: Number.parseFloat(match[1]), unit: (match[2] || 'px').toLowerCase() };
}

function parseCssShadow(cssValue) {
  const shadows = splitCssList(cssValue).map(part => {
    const inset = /(?:^|\s)inset(?:\s|$)/i.test(part);
    const withoutInset = part.replace(/(?:^|\s)inset(?:\s|$)/i, ' ').trim();
    const colorMatch = withoutInset.match(/(rgba?\([^)]*\)|#[\da-f]{3,8}|transparent)\s*$/i);
    if (!colorMatch) throw new TypeError(`지원하지 않는 CSS 그림자 값입니다: ${cssValue}`);
    const dimensions = withoutInset.slice(0, colorMatch.index).trim().split(/\s+/);
    if (dimensions.length < 3 || dimensions.length > 4) {
      throw new TypeError(`지원하지 않는 CSS 그림자 치수입니다: ${cssValue}`);
    }
    return {
      color: parseCssColor(colorMatch[1]),
      offsetX: parseDimension(dimensions[0]),
      offsetY: parseDimension(dimensions[1]),
      blur: parseDimension(dimensions[2]),
      spread: parseDimension(dimensions[3] || '0px'),
      ...(inset ? { inset: true } : {})
    };
  });
  return shadows.length === 1 ? shadows[0] : shadows;
}

function parseFontFamily(cssValue) {
  return splitCssList(cssValue).map(font => font.trim().replace(/^(['"])(.*)\1$/, '$2'));
}

/**
 * 3. Live Design Tokens JSON Generator (DTCG Format Module 2025.10)
 */
export function generateLiveTokensJSON(subDesign, tweaks = {}) {
  if (!subDesign) return '{}';
  const tokens = THEME_TOKENS_MAP[subDesign.id] || THEME_TOKENS_MAP['swiss-grid'];
  const resolvedTweaks = { ...subDesign.defaultTweaks, ...tweaks };

  const colorTokens = {};
  (subDesign.palette || []).forEach(paletteColor => {
    colorTokens[slugify(paletteColor.name)] = createDtcgColorToken(
      paletteColor.hex,
      paletteColor.usage || 'Palette color'
    );
  });

  const tokenStructure = {
    $extensions: {
      'com.design-sample-selector': {
        name: subDesign.nameEn,
        id: subDesign.id,
        version: '2.3.0',
        format: 'DTCG 2025.10'
      }
    },
    color: {
      ...colorTokens,
      background: createDtcgColorToken(tokens['--theme-bg']),
      surface: createDtcgColorToken(tokens['--theme-surface']),
      border: createDtcgColorToken(tokens['--theme-border']),
      text: createDtcgColorToken(tokens['--theme-text']),
      accent: createDtcgColorToken(tokens['--theme-accent'])
    },
    dimension: {
      borderRadius: { $value: parseDimension(`${resolvedTweaks.borderRadius ?? 16}px`), $type: 'dimension' },
      borderWidth: { $value: parseDimension(`${resolvedTweaks.borderWidth ?? 1}px`), $type: 'dimension' },
      shadowDepth: { $value: parseDimension(`${resolvedTweaks.shadowDepth ?? 12}px`), $type: 'dimension' },
      backdropBlur: { $value: parseDimension(`${resolvedTweaks.backdropBlur ?? 16}px`), $type: 'dimension' }
    },
    typography: {
      fontFamily: { $value: parseFontFamily(tokens['--theme-font-family']), $type: 'fontFamily' }
    },
    effect: {
      glowIntensity: { $value: Number(resolvedTweaks.glowIntensity ?? 1), $type: 'number' },
      shadow: { $value: parseCssShadow(tokens['--theme-shadow']), $type: 'shadow' }
    }
  };

  return JSON.stringify(tokenStructure, null, 2);
}

/**
 * 4. Client-side File Downloader
 */
export function downloadFile(filename, content, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 200);
}

function slugify(text) {
  return String(text || '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
}
