const HUMAN_ATTRIBUTES = /\b(aria-label|title|placeholder|value)="([^"]*)"/gu;
const TEXT_NODE = />([^<>]+)</gu;
const LATIN_TEXT = /[A-Za-z]{2}/u;
const APPROVED_INVARIANTS = /^(?:AI|HP|MP|LV|ID|UI|UX|API|URL|CSS|HTML|JSON|DTCG|RGB|FPS|WASM|OLED|BGM|SFX|AOL|MP3|2D|3D|5G|Y2K)$/iu;
const DISPLAY_IDENTIFIER = /^#[A-Z0-9]+(?:-[A-Z0-9]+)+$/u;
const TECHNICAL_MEASUREMENT = /^\d+(?:\.\d+)?(?:ms|px|rem|em|kB|MB|GB)$/u;

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function hasSelectedLocaleScript(value, locale) {
  if (locale === 'ko') return /[가-힣]/u.test(value);
  if (locale === 'ja') return /[ぁ-ゟ゠-ヿ一-龯]/u.test(value);
  if (locale === 'zh-CN' || locale === 'zh-TW') return /[一-龯]/u.test(value);
  return false;
}

function shouldLocalize(value, locale) {
  const text = value.trim();
  if (!text) return false;
  const hasForeignScript = locale === 'ko'
    ? /[ぁ-ゟ゠-ヿ一-龯]/u.test(text)
    : locale === 'ja'
      ? /[가-힣]/u.test(text)
      : /[가-힣ぁ-ゟ゠-ヿ]/u.test(text);
  if (!LATIN_TEXT.test(text) && !hasForeignScript) return false;
  if (APPROVED_INVARIANTS.test(text)) return false;
  if (DISPLAY_IDENTIFIER.test(text) || TECHNICAL_MEASUREMENT.test(text)) return false;
  if (/^(?:https?:\/\/|mailto:|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,})/u.test(text)) return false;
  if (hasSelectedLocaleScript(text, locale)) {
    const latinTokens = text.match(/[A-Za-z][A-Za-z0-9.-]*/gu) || [];
    return latinTokens.some(token => !APPROVED_INVARIANTS.test(token.replace(/[.-]+$/gu, '')));
  }
  return true;
}

function stableIndex(value, length) {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash) % length;
}

function compact(values) {
  return values.filter(value => typeof value === 'string' && value.trim() && !/[{}]/u.test(value));
}

function localizedPools(design, copy) {
  const name = design?.name || '';
  const replaceName = value => String(value || '').replaceAll('{name}', name);
  const short = compact([
    name,
    design?.categoryTitle,
    copy?.['gallery.details'],
    copy?.['gallery.pick'],
    copy?.['detail.hero'],
    copy?.['detail.widget'],
    copy?.['detail.form'],
    copy?.['detail.pricing'],
    copy?.['detail.confirm'],
    copy?.['dock.openSandbox'],
    copy?.['gallery.favoriteSave'],
    copy?.['recovery.retry']
  ]).map(replaceName);
  const long = compact([
    design?.shortDesc,
    ...(design?.characteristics || []),
    ...(design?.pros || []),
    ...(design?.cons || []),
    ...(design?.palette || []).map(color => color.usage),
    copy?.['archetype.blog.paragraph1'],
    copy?.['archetype.blog.paragraph2'],
    copy?.['archetype.blog.paragraph3']
  ]).map(replaceName);
  return {
    short: short.length ? short : [name],
    long: long.length ? long : short.length ? short : [name]
  };
}

function chooseReplacement(source, pools, forceShort = false) {
  const useLong = !forceShort && source.trim().length > 34;
  const pool = useLong ? pools.long : pools.short;
  return pool[stableIndex(source, pool.length)];
}

function replacePreservingWhitespace(value, replacement) {
  const leading = value.match(/^\s*/u)?.[0] || '';
  const trailing = value.match(/\s*$/u)?.[0] || '';
  return `${leading}${escapeHtml(replacement)}${trailing}`;
}

export function localizePreviewMarkup(html, { locale, copy, design } = {}) {
  if (typeof html !== 'string' || locale === 'en' || !locale || !design) return html;
  const pools = localizedPools(design, copy);
  const withAttributes = html.replace(HUMAN_ATTRIBUTES, (match, attribute, value) => {
    if (!shouldLocalize(value, locale)) return match;
    const replacement = chooseReplacement(value, pools, true);
    return `${attribute}="${escapeHtml(replacement)}"`;
  });
  return withAttributes.replace(TEXT_NODE, (match, value) => {
    if (!shouldLocalize(value, locale)) return match;
    return `>${replacePreservingWhitespace(value, chooseReplacement(value, pools))}<`;
  });
}
