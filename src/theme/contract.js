import { deepFreeze } from '../catalog/contract.js';

/** 의미 토큰을 런타임 CSS custom property로 투영하는 고정 순서 계약. */
export const THEME_TOKEN_CSS_PROPERTIES = deepFreeze({
  background: '--theme-bg',
  surface: '--theme-surface',
  surfaceSubtle: '--theme-surface-subtle',
  border: '--theme-border',
  text: '--theme-text',
  textMuted: '--theme-text-muted',
  accent: '--theme-accent',
  accentSecondary: '--theme-accent-secondary',
  radius: '--theme-radius',
  borderWidth: '--theme-border-width',
  shadow: '--theme-shadow',
  fontFamily: '--theme-font-family',
  glow: '--theme-glow'
});

export const THEME_GEOMETRY_CSS_PROPERTIES = deepFreeze({
  surfaceRadius: '--theme-surface-radius',
  controlRadius: '--theme-control-radius',
  pillRadius: '--theme-pill-radius'
});

/** 개별 스타일이 선택되지 않았을 때의 전역 런타임 fallback. */
export const ROOT_THEME_TOKENS = deepFreeze({
  background: '#0B0F19',
  surface: 'rgba(18, 25, 38, 0.85)',
  surfaceSubtle: 'rgba(255, 255, 255, 0.04)',
  border: 'rgba(255, 255, 255, 0.12)',
  text: '#F8FAFC',
  textMuted: '#94A3B8',
  accent: '#00F0FF',
  accentSecondary: '#FF007A',
  radius: '12px',
  borderWidth: '1px',
  shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
  fontFamily: "'Inter', sans-serif",
  glow: '0 0 20px rgba(0, 240, 255, 0.35)'
});

export const ROOT_THEME_GEOMETRY = deepFreeze({
  surfaceRadius: ROOT_THEME_TOKENS.radius,
  controlRadius: ROOT_THEME_TOKENS.radius,
  pillRadius: '999px'
});
