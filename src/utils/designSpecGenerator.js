/**
 * Pure Generator Engine for Dynamic Live CSS, Live designs.md, and Design Tokens
 * 100% reactive to subcategory selection, live tweak sliders, and active archetype.
 */

import { THEME_TOKENS_MAP, getThemeDefinitionById } from '../theme/index.js';

export { THEME_TOKENS_MAP };

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

function getExportThemeTokens(subDesign) {
  return getThemeDefinitionById(subDesign?.id)?.cssCustomProperties || null;
}

/**
 * 1. Live CSS Snippet Generator
 */
export function generateLiveCSSSnippet(subDesign, tweaks = {}, archetype = 'game', mode = 'full') {
  const tokens = getExportThemeTokens(subDesign);
  if (!tokens) return '/* No design selected */';
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
  const tokens = getExportThemeTokens(subDesign);
  if (!tokens) return '# Design Specification (No Selection)';

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
  if (String(cssValue).trim().toLowerCase() === 'none') {
    const zero = { value: 0, unit: 'px' };
    return {
      color: parseCssColor('transparent'),
      offsetX: { ...zero },
      offsetY: { ...zero },
      blur: { ...zero },
      spread: { ...zero }
    };
  }

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
  const tokens = getExportThemeTokens(subDesign);
  if (!tokens) return '{}';
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
