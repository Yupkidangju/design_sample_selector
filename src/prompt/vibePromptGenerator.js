/**
 * AI 바이브 코딩 전용 프롬프트, CSS 토큰, designs.md 생성기 (v3.0)
 * 오디오 관련 문구나 이모지 ASCII 와이어프레임 없이 실무 AI 지시문만 생성한다.
 */

import { getDomainById } from '../data/domains.js';

export function generateCssTokensBlock(style, { lang = 'ko' } = {}) {
  const varEntries = Object.entries(style.cssVars || {})
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');

  const paletteEntries = (style.palette || [])
    .map((item, idx) => {
      const roleLabel = lang === 'en' ? (item.roleEn || item.role) : item.role;
      return `  --palette-${idx + 1}: ${item.hex}; /* ${roleLabel} */`;
    })
    .join('\n');

  return `:root,
[data-style="${style.id}"] {
  /* Typography */
  --font-display: ${style.fonts.display};
  --font-body: ${style.fonts.body};
  --font-mono: ${style.fonts.mono};

  /* Core Design Tokens */
${varEntries}

  /* Semantic Palette */
${paletteEntries}
}`;
}

export function generateVibePrompt(style, { domainId = 'web', lang = 'ko' } = {}) {
  const domain = getDomainById(domainId);
  const tokensBlock = generateCssTokensBlock(style, { lang });

  if (lang === 'en') {
    const paletteLines = style.palette
      .map(color => `- ${color.roleEn || color.role}: \`${color.hex}\``)
      .join('\n');
    const layoutList = style.dna.layoutRulesEn.map(rule => `- ${rule}`).join('\n');
    const surfaceList = style.dna.surfaceRulesEn.map(rule => `- ${rule}`).join('\n');
    const typoList = style.dna.typographyRulesEn.map(rule => `- ${rule}`).join('\n');
    const doList = style.dna.dosEn.map(rule => `- [DO] ${rule}`).join('\n');
    const dontList = style.dna.dontsEn.map(rule => `- [DON'T] ${rule}`).join('\n');
    const domainTip = style.dna.domainTipsEn[domain.id] || style.dna.domainTipsEn.web;

    return `# AI Design Direction: ${style.nameEn} (${style.id})

Build the UI strictly following the **${style.nameEn}** design system for a **${domain.enLabel}** experience.

## 1. Visual Philosophy
${style.dna.philosophyEn}

## 2. Color Palette & Polarity (${style.polarity.toUpperCase()})
${paletteLines}

## 3. Typography
- Display Font: ${style.fonts.displayName} (\`${style.fonts.display}\`)
- Body Font: ${style.fonts.bodyName} (\`${style.fonts.body}\`)
- Monospace Font: ${style.fonts.monoName || 'JetBrains Mono'} (\`${style.fonts.mono}\`)
${typoList}

## 4. Layout & Surface Rules
### Layout
${layoutList}
### Surface & Depth
${surfaceList}

## 5. Target Domain Guidance (${domain.enLabel})
- ${domainTip}

## 6. Guardrails (DO / DON'T)
${doList}
${dontList}

## 7. Ready-to-Use CSS Tokens
\`\`\`css
${tokensBlock}
\`\`\`
`;
  }

  const paletteLines = style.palette
    .map(color => `- ${color.role}: \`${color.hex}\``)
    .join('\n');
  const layoutList = style.dna.layoutRulesKo.map(rule => `- ${rule}`).join('\n');
  const surfaceList = style.dna.surfaceRulesKo.map(rule => `- ${rule}`).join('\n');
  const typoList = style.dna.typographyRulesKo.map(rule => `- ${rule}`).join('\n');
  const doList = style.dna.dosKo.map(rule => `- [DO] ${rule}`).join('\n');
  const dontList = style.dna.dontsKo.map(rule => `- [DON'T] ${rule}`).join('\n');
  const domainTip = style.dna.domainTipsKo[domain.id] || style.dna.domainTipsKo.web;

  return `# AI 바이브 코딩 디자인 지시서: ${style.nameKo} (${style.nameEn})

아래 **${style.nameKo} (\`${style.id}\`)** 디자인 시스템의 시각 문법을 엄격하게 지켜 **${domain.fullLabel}** UI를 구현해 주세요.

## 1. 핵심 시각 철학
${style.dna.philosophyKo}

## 2. 컬러 팔레트 및 명도 극성 (${style.polarity === 'dark' ? '다크' : '라이트'})
${paletteLines}

## 3. 타이포그래피
- 디스플레이 서체: ${style.fonts.displayName} (\`${style.fonts.display}\`)
- 본문 서체: ${style.fonts.bodyName} (\`${style.fonts.body}\`)
- 고정폭 서체: ${style.fonts.monoName || 'JetBrains Mono'} (\`${style.fonts.mono}\`)
${typoList}

## 4. 레이아웃 & 표면 질감 규칙
### 레이아웃
${layoutList}
### 표면 · 보더 · 그림자
${surfaceList}

## 5. 적용 도메인 지침 (${domain.fullLabel})
- ${domainTip}

## 6. AI 품질 가드레일 (반드시 지킬 것 / 절대 금지)
${doList}
${dontList}

## 7. 바로 붙여넣는 CSS 변수 토큰
\`\`\`css
${tokensBlock}
\`\`\`
`;
}

export function generateDesignsMarkdown(style, { domainId = 'web' } = {}) {
  const domain = getDomainById(domainId);
  const tokensBlock = generateCssTokensBlock(style, { lang: 'ko' });
  const paletteTable = style.palette
    .map(color => `| ${color.role} | \`${color.hex}\` |`)
    .join('\n');

  return `# designs.md — ${style.nameKo} (${style.nameEn})

- **Style ID:** \`${style.id}\`
- **Primary Domain:** \`${domain.id}\` (${domain.fullLabel})
- **Polarity:** \`${style.polarity}\`
- **Key Traits:** ${style.traits.join(' · ')}

---

## 1. 디자인 정체성
${style.tagline}

${style.dna.philosophyKo}

---

## 2. 컬러 시스템

| 역할 | 색상 코드 |
|---|---|
${paletteTable}

---

## 3. 서체 규격
- **Display:** ${style.fonts.displayName} (\`${style.fonts.display}\`)
- **Body:** ${style.fonts.bodyName} (\`${style.fonts.body}\`)
- **Mono:** ${style.fonts.monoName || 'JetBrains Mono'} (\`${style.fonts.mono}\`)

${style.dna.typographyRulesKo.map(rule => `- ${rule}`).join('\n')}

---

## 4. 레이아웃 및 표면 규칙

### 레이아웃
${style.dna.layoutRulesKo.map(rule => `- ${rule}`).join('\n')}

### 표면 물리
${style.dna.surfaceRulesKo.map(rule => `- ${rule}`).join('\n')}

---

## 5. 도메인별 적용 기준
- **웹 (Web):** ${style.dna.domainTipsKo.web}
- **모바일 (Mobile):** ${style.dna.domainTipsKo.mobile}
- **게임 (Game):** ${style.dna.domainTipsKo.game}
- **대시보드 (Dashboard):** ${style.dna.domainTipsKo.dashboard}

---

## 6. 구현 체크리스트 (DO / DON'T)

### 반드시 적용 (DO)
${style.dna.dosKo.map(rule => `- [x] ${rule}`).join('\n')}

### 절대 금지 (DON'T)
${style.dna.dontsKo.map(rule => `- [ ] 금지: ${rule}`).join('\n')}

---

## 7. CSS 커스텀 프로퍼티 토큰

\`\`\`css
${tokensBlock}
\`\`\`
`;
}
