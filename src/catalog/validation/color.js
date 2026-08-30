const HEX_COLOR_PATTERN = /^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;
const GRADIENT_PATTERN = /^(?:linear|radial)-gradient\([\s\S]+\)$/i;
const NUMBER_PATTERN = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;

function parseStrictNumber(value) {
  const trimmed = value.trim();
  if (!NUMBER_PATTERN.test(trimmed)) return null;
  const number = Number(trimmed);
  return Number.isFinite(number) ? number : null;
}

export function isBasicColorValue(value) {
  if (typeof value !== 'string') return false;
  const normalized = value.trim();
  return normalized.length > 0 && (
    HEX_COLOR_PATTERN.test(normalized)
    || parseRgbParts(normalized) !== null
    || parseHslParts(normalized) !== null
    || GRADIENT_PATTERN.test(normalized)
    || normalized.toLowerCase() === 'transparent'
  );
}

function parseAlpha(value) {
  if (value === undefined) return 1;
  const trimmed = value.trim();
  const percentage = trimmed.endsWith('%');
  const number = parseStrictNumber(percentage ? trimmed.slice(0, -1) : trimmed);
  if (number === null) return null;
  const alpha = percentage ? number / 100 : number;
  return Number.isFinite(alpha) && alpha >= 0 && alpha <= 1 ? alpha : null;
}

function parseRgbChannel(value) {
  const trimmed = value.trim();
  const percentage = trimmed.endsWith('%');
  const number = parseStrictNumber(percentage ? trimmed.slice(0, -1) : trimmed);
  if (number === null || number < 0 || number > (percentage ? 100 : 255)) return null;
  return percentage ? number * 255 / 100 : number;
}

function parseHex(value) {
  let hex = value.slice(1);
  if (hex.length === 3 || hex.length === 4) {
    hex = [...hex].map(character => character.repeat(2)).join('');
  }
  if (hex.length === 8 && Number.parseInt(hex.slice(6, 8), 16) !== 255) return null;
  return [
    Number.parseInt(hex.slice(0, 2), 16),
    Number.parseInt(hex.slice(2, 4), 16),
    Number.parseInt(hex.slice(4, 6), 16)
  ];
}

function parseRgbParts(value) {
  if (!/^rgba?\([\s\S]+\)$/i.test(value)) return null;
  const parts = value.slice(value.indexOf('(') + 1, -1).split(',');
  if (parts.length !== 3 && parts.length !== 4) return null;
  const channels = parts.slice(0, 3).map(parseRgbChannel);
  const alpha = parseAlpha(parts[3]);
  if (channels.some(channel => channel === null) || alpha === null) return null;
  return { channels, alpha };
}

function parseRgbFunction(value) {
  const parsed = parseRgbParts(value);
  return parsed && parsed.alpha === 1 ? parsed.channels : null;
}

function hueToRgb(p, q, hue) {
  let normalized = hue;
  if (normalized < 0) normalized += 1;
  if (normalized > 1) normalized -= 1;
  if (normalized < 1 / 6) return p + (q - p) * 6 * normalized;
  if (normalized < 1 / 2) return q;
  if (normalized < 2 / 3) return p + (q - p) * (2 / 3 - normalized) * 6;
  return p;
}

function hslToRgb(hue, saturation, lightness) {
  if (saturation === 0) {
    const gray = lightness * 255;
    return [gray, gray, gray];
  }
  const q = lightness < 0.5
    ? lightness * (1 + saturation)
    : lightness + saturation - lightness * saturation;
  const p = 2 * lightness - q;
  return [
    hueToRgb(p, q, hue + 1 / 3) * 255,
    hueToRgb(p, q, hue) * 255,
    hueToRgb(p, q, hue - 1 / 3) * 255
  ];
}

function parseHslParts(value) {
  if (!/^hsla?\([\s\S]+\)$/i.test(value)) return null;
  const parts = value.slice(value.indexOf('(') + 1, -1).split(',').map(part => part.trim());
  if ((parts.length !== 3 && parts.length !== 4)
    || !parts[1]?.endsWith('%')
    || !parts[2]?.endsWith('%')) return null;
  const hue = parts[0].toLowerCase().endsWith('deg') ? parts[0].slice(0, -3) : parts[0];
  const hueDegrees = parseStrictNumber(hue);
  const saturationNumber = parseStrictNumber(parts[1].slice(0, -1));
  const lightnessNumber = parseStrictNumber(parts[2].slice(0, -1));
  const alpha = parseAlpha(parts[3]);
  if (hueDegrees === null
    || saturationNumber === null
    || lightnessNumber === null
    || saturationNumber < 0
    || saturationNumber > 100
    || lightnessNumber < 0
    || lightnessNumber > 100
    || alpha === null
  ) return null;
  const saturation = saturationNumber / 100;
  const lightness = lightnessNumber / 100;
  const normalizedHue = ((hueDegrees % 360) + 360) % 360 / 360;
  return { channels: hslToRgb(normalizedHue, saturation, lightness), alpha };
}

function parseHslFunction(value) {
  const parsed = parseHslParts(value);
  return parsed && parsed.alpha === 1 ? parsed.channels : null;
}

/**
 * @returns {number[]|null|undefined} RGB, 계산 불가, 또는 기본 문법 오류
 */
export function parseOpaqueColor(value) {
  if (!isBasicColorValue(value)) return undefined;
  const normalized = value.trim();
  if (GRADIENT_PATTERN.test(normalized) || normalized.toLowerCase() === 'transparent') return null;
  if (HEX_COLOR_PATTERN.test(normalized)) return parseHex(normalized);
  if (/^rgba?\(/i.test(normalized)) return parseRgbFunction(normalized);
  if (/^hsla?\(/i.test(normalized)) return parseHslFunction(normalized);
  return null;
}

function relativeLuminance([red, green, blue]) {
  const linear = [red, green, blue].map(channel => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

export function calculateContrastRatio(first, second) {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}
