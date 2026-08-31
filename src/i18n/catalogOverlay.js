import { getAllStyles, getCategories, getFacetDefinitions } from '../catalog/index.js';

const CATEGORY_TITLES = {
  ja: ['国際タイポグラフィ', 'ブルータリズム', '立体感と素材', 'レトロ＆ポップ', 'エディトリアル＆オーガニック', 'Y2K光沢ウェブ', 'ハイテク＆キネティック', 'ソフト3D＆ソーラーパンク'],
  'zh-CN': ['国际字体风格', '粗野主义', '立体与材质', '复古与流行', '编辑与有机', 'Y2K光泽网页', '高科技与动态', '柔和3D与太阳朋克'],
  'zh-TW': ['國際字體風格', '粗獷主義', '立體與材質', '復古與流行', '編輯與有機', 'Y2K光澤網頁', '高科技與動態', '柔和3D與太陽龐克']
};

const FACET_TRANSLATIONS = {
  ja: {
    kind: 'スタイル種別', era: '時代', lineage: 'デザイン系譜', media: '媒体', materiality: '質感と素材', density: '情報密度', tone: '雰囲気', motion: 'モーション強度', region: '地域・文化圏', maturity: '成熟度',
    'historical-movement': '歴史的運動', revival: 'リバイバル', technique: '表現技法', 'interface-language': 'インターフェース言語', microtrend: 'マイクロトレンド', speculative: '思弁的スタイル',
    'pre-1950': '1950年以前', '1950s-1970s': '1950〜1970年代', '1980s-1990s': '1980〜1990年代', '2000s': '2000年代', '2010s': '2010年代', '2020s': '2020年代', timeless: '時代を超越',
    modernism: 'モダニズム', 'international-style': '国際タイポグラフィ様式', minimalism: 'ミニマリズム', brutalism: 'ブルータリズム', skeuomorphism: 'スキューモーフィズム', postmodernism: 'ポストモダニズム', retrofuturism: 'レトロフューチャリズム', editorial: 'エディトリアル', 'organic-modernism': '有機的モダニズム', cyberculture: 'サイバーカルチャー', 'grid-systems': 'グリッドシステム', 'indie-craft': 'インディークラフト', 'eco-futurism': 'エコフューチャリズム', bauhaus: 'バウハウス', 'de-stijl': 'デ・ステイル', 'flat-design': 'フラットデザイン', constructivism: '構成主義', 'punk-diy': 'パンクDIY', 'material-design': 'マテリアルデザイン', 'liquid-glass': 'リキッドガラス', 'art-deco': 'アールデコ', psychedelia: 'サイケデリア', 'art-nouveau': 'アールヌーボー', 'risograph-print': 'リソグラフ印刷', 'microsoft-design': 'マイクロソフトデザイン',
    graphic: 'グラフィック', print: '印刷', 'web-ui': 'Web UI', 'product-ui': 'プロダクトUI', illustration: 'イラストレーション', 'three-d': '3D', flat: '平面', glass: 'ガラス', paper: '紙', ink: 'インク', metal: '金属', plastic: 'プラスチック', pixel: 'ピクセル', clay: 'クレイ', organic: '有機素材', screen: '発光スクリーン', sparse: '疎', balanced: '均衡', dense: '高密度', maximal: '最大密度', rational: '合理的', precise: '精密', professional: '専門的', rebellious: '反抗的', playful: '遊び心', futuristic: '未来的', tactile: '触覚的', nostalgic: 'ノスタルジック', luxurious: '豪華', immersive: '没入感', energetic: '躍動的', friendly: '親しみやすい', optimistic: '楽観的', none: 'なし', restrained: '控えめ', expressive: '表現的', intense: '強烈', international: '国際', europe: 'ヨーロッパ', 'north-america': '北米', 'latin-america': 'ラテンアメリカ', 'east-asia': '東アジア', 'south-asia': '南アジア', africa: 'アフリカ', 'middle-east': '中東', oceania: 'オセアニア', 'global-internet': 'グローバルインターネット文化', canonical: '正典', established: '定着', emerging: '新興', experimental: '実験的'
  },
  'zh-CN': {
    kind: '样式类型', era: '时代', lineage: '设计谱系', media: '媒介', materiality: '质感与材料', density: '信息密度', tone: '氛围', motion: '动效强度', region: '地区与文化', maturity: '成熟度',
    'historical-movement': '历史运动', revival: '复兴风格', technique: '表现技法', 'interface-language': '界面语言', microtrend: '微趋势', speculative: '思辨样式', 'pre-1950': '1950年以前', '1950s-1970s': '1950至1970年代', '1980s-1990s': '1980至1990年代', '2000s': '2000年代', '2010s': '2010年代', '2020s': '2020年代', timeless: '跨越时代',
    modernism: '现代主义', 'international-style': '国际字体样式', minimalism: '极简主义', brutalism: '粗野主义', skeuomorphism: '拟物设计', postmodernism: '后现代主义', retrofuturism: '复古未来主义', editorial: '编辑设计', 'organic-modernism': '有机现代主义', cyberculture: '网络文化', 'grid-systems': '网格系统', 'indie-craft': '独立手作', 'eco-futurism': '生态未来主义', bauhaus: '包豪斯', 'de-stijl': '风格派', 'flat-design': '扁平设计', constructivism: '构成主义', 'punk-diy': '朋克DIY', 'material-design': '材料设计', 'liquid-glass': '液态玻璃', 'art-deco': '装饰艺术', psychedelia: '迷幻艺术', 'art-nouveau': '新艺术', 'risograph-print': '孔版印刷', 'microsoft-design': '微软设计',
    graphic: '平面设计', print: '印刷', 'web-ui': '网页界面', 'product-ui': '产品界面', illustration: '插画', 'three-d': '3D', flat: '平面', glass: '玻璃', paper: '纸张', ink: '油墨', metal: '金属', plastic: '塑料', pixel: '像素', clay: '黏土', organic: '有机材料', screen: '发光屏幕', sparse: '疏朗', balanced: '均衡', dense: '高密度', maximal: '极繁', rational: '理性', precise: '精确', professional: '专业', rebellious: '反叛', playful: '趣味', futuristic: '未来感', tactile: '触感', nostalgic: '怀旧', luxurious: '奢华', immersive: '沉浸', energetic: '活力', friendly: '亲和', optimistic: '乐观', none: '无', restrained: '克制', expressive: '富有表现力', intense: '强烈', international: '国际', europe: '欧洲', 'north-america': '北美', 'latin-america': '拉丁美洲', 'east-asia': '东亚', 'south-asia': '南亚', africa: '非洲', 'middle-east': '中东', oceania: '大洋洲', 'global-internet': '全球网络文化', canonical: '经典', established: '成熟', emerging: '新兴', experimental: '实验性'
  },
  'zh-TW': {
    kind: '樣式類型', era: '時代', lineage: '設計譜系', media: '媒介', materiality: '質感與材料', density: '資訊密度', tone: '氛圍', motion: '動效強度', region: '地區與文化', maturity: '成熟度',
    'historical-movement': '歷史運動', revival: '復興風格', technique: '表現技法', 'interface-language': '介面語言', microtrend: '微趨勢', speculative: '思辨樣式', 'pre-1950': '1950年以前', '1950s-1970s': '1950至1970年代', '1980s-1990s': '1980至1990年代', '2000s': '2000年代', '2010s': '2010年代', '2020s': '2020年代', timeless: '跨越時代',
    modernism: '現代主義', 'international-style': '國際字體樣式', minimalism: '極簡主義', brutalism: '粗獷主義', skeuomorphism: '擬物設計', postmodernism: '後現代主義', retrofuturism: '復古未來主義', editorial: '編輯設計', 'organic-modernism': '有機現代主義', cyberculture: '網路文化', 'grid-systems': '網格系統', 'indie-craft': '獨立手作', 'eco-futurism': '生態未來主義', bauhaus: '包浩斯', 'de-stijl': '風格派', 'flat-design': '扁平設計', constructivism: '構成主義', 'punk-diy': '龐克DIY', 'material-design': '材料設計', 'liquid-glass': '液態玻璃', 'art-deco': '裝飾藝術', psychedelia: '迷幻藝術', 'art-nouveau': '新藝術', 'risograph-print': '孔版印刷', 'microsoft-design': '微軟設計',
    graphic: '平面設計', print: '印刷', 'web-ui': '網頁介面', 'product-ui': '產品介面', illustration: '插畫', 'three-d': '3D', flat: '平面', glass: '玻璃', paper: '紙張', ink: '油墨', metal: '金屬', plastic: '塑膠', pixel: '像素', clay: '黏土', organic: '有機材料', screen: '發光螢幕', sparse: '疏朗', balanced: '均衡', dense: '高密度', maximal: '極繁', rational: '理性', precise: '精確', professional: '專業', rebellious: '反叛', playful: '趣味', futuristic: '未來感', tactile: '觸感', nostalgic: '懷舊', luxurious: '奢華', immersive: '沉浸', energetic: '活力', friendly: '親和', optimistic: '樂觀', none: '無', restrained: '克制', expressive: '富有表現力', intense: '強烈', international: '國際', europe: '歐洲', 'north-america': '北美', 'latin-america': '拉丁美洲', 'east-asia': '東亞', 'south-asia': '南亞', africa: '非洲', 'middle-east': '中東', oceania: '大洋洲', 'global-internet': '全球網路文化', canonical: '經典', established: '成熟', emerging: '新興', experimental: '實驗性'
  }
};

const TEMPLATES = {
  en: {
    summary: ({ name, category, kind, tone }) => `${name} applies ${kind.toLowerCase()} principles and a ${tone.toLowerCase()} tone within ${category}.`,
    category: title => `${title} groups related design movements, interface languages, materials, and production contexts.`,
    paletteName: id => id.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' '),
    paletteUsage: ({ name, color }) => `${color} defines a distinct surface, text, or signal role in ${name}.`,
    characteristics: ({ name, kind, lineage, material }) => [`${name} interprets ${kind.toLowerCase()} principles.`, `${lineage} lineage informs the composition.`, `${material} material treatment shapes the visual hierarchy.`],
    pros: ({ media, tone }) => [`Works well for ${media.toLowerCase()} contexts.`, `Supports a ${tone.toLowerCase()} product voice.`],
    cons: ({ density, motion }) => [`Validate ${density.toLowerCase()} information density and ${motion.toLowerCase()} motion against the target audience.`]
  },
  ja: {
    summary: ({ name, category, kind, tone }) => `${name}は、${category}で${kind}の原理と${tone}な雰囲気を実用的なUIへ展開するデザインサンプルです。`,
    category: title => `${title}に関係するデザイン運動、インターフェース言語、素材、制作背景を整理したカテゴリーです。`, paletteName: id => `${id.split('-').join('・')}カラー`,
    paletteUsage: ({ name, color }) => `${name}で${color}を表面、文字、またはシグナルの明確な役割に使用します。`, characteristics: ({ name, kind, lineage, material }) => [`${name}は${kind}の原理を再解釈します。`, `${lineage}の系譜が構成を導きます。`, `${material}の素材表現が視覚的階層を形成します。`],
    pros: ({ media, tone }) => [`${media}の文脈に適用しやすい設計です。`, `${tone}なプロダクト表現を支えます。`], cons: ({ density, motion }) => [`${density}の情報密度と${motion}の動きを対象ユーザーに合わせて検証してください。`]
  },
  'zh-CN': {
    summary: ({ name, category, kind, tone }) => `${name}是在${category}中运用${kind}原则与${tone}氛围的实用界面设计方案。`, category: title => `${title}汇集相关设计运动、界面语言、材料与制作语境。`, paletteName: id => `${id.split('-').join('·')}色`,
    paletteUsage: ({ name, color }) => `${color}在${name}中承担表面、文字或信号的明确角色。`, characteristics: ({ name, kind, lineage, material }) => [`${name}重新诠释${kind}原则。`, `${lineage}谱系指导版式构成。`, `${material}材质塑造视觉层级。`],
    pros: ({ media, tone }) => [`适用于${media}场景。`, `有助于建立${tone}的产品语气。`], cons: ({ density, motion }) => [`应结合目标用户验证${density}的信息密度与${motion}的动效。`]
  },
  'zh-TW': {
    summary: ({ name, category, kind, tone }) => `${name}是在${category}中運用${kind}原則與${tone}氛圍的實用介面設計方案。`, category: title => `${title}彙整相關設計運動、介面語言、材料與製作脈絡。`, paletteName: id => `${id.split('-').join('·')}色`,
    paletteUsage: ({ name, color }) => `${color}在${name}中承擔表面、文字或訊號的明確角色。`, characteristics: ({ name, kind, lineage, material }) => [`${name}重新詮釋${kind}原則。`, `${lineage}譜系引導版面構成。`, `${material}材質塑造視覺層級。`],
    pros: ({ media, tone }) => [`適用於${media}場景。`, `有助於建立${tone}的產品語氣。`], cons: ({ density, motion }) => [`應配合目標使用者驗證${density}的資訊密度與${motion}的動效。`]
  }
};

function text(value, locale) {
  if (!value || typeof value !== 'object') return String(value || '');
  return locale === 'ko' ? value.ko : (value.en || value.ko);
}

function translatedFacet(id, locale, canonicalLabel) {
  if (locale === 'ko') return text(canonicalLabel, 'ko');
  if (locale === 'en') return text(canonicalLabel, 'en') || id.split('-').join(' ');
  return FACET_TRANSLATIONS[locale]?.[id] || id.split('-').join(' ');
}

function eraId(era) {
  if (era?.start < 1950) return 'pre-1950';
  if (era?.start < 1980) return '1950s-1970s';
  if (era?.start < 2000) return '1980s-1990s';
  if (era?.start < 2010) return '2000s';
  if (era?.start < 2020) return '2010s';
  return '2020s';
}

function localizedStyle(style, category, pack, coverage) {
  const locale = pack.locale;
  if (locale === 'ko') {
    coverage.translated += 2 + style.palette.length * 2 + style.editorial.characteristics.length + style.editorial.pros.length + style.editorial.cons.length;
    return { id: style.id, name: text(style.name, 'ko'), summary: text(style.summary, 'ko'), palette: style.palette.map(item => ({ id: item.id, name: text(item.name, 'ko'), usage: text(item.usage, 'ko'), value: item.value })), characteristics: [...style.editorial.characteristics], pros: [...style.editorial.pros], cons: [...style.editorial.cons] };
  }
  const template = TEMPLATES[locale];
  const name = text(style.name, 'en');
  if (locale !== 'en') coverage.approvedFallbacks.push({ recordId: style.id, field: 'style.name', reason: 'international-proper-name' });
  else coverage.translated += 1;
  const facts = { name, category, kind: translatedFacet(style.classification.kind, locale), lineage: translatedFacet(style.classification.lineages[0], locale), media: translatedFacet(style.classification.media[0], locale), material: translatedFacet(style.classification.materiality[0], locale), density: translatedFacet(style.classification.density, locale), tone: translatedFacet(style.classification.tone[0], locale), motion: translatedFacet(style.classification.motion, locale), era: translatedFacet(eraId(style.classification.era), locale) };
  const palette = style.palette.map(item => { const color = template.paletteName(item.id); coverage.translated += 2; return { id: item.id, name: color, usage: template.paletteUsage({ ...facts, color }), value: item.value }; });
  coverage.translated += 8;
  return { id: style.id, name, summary: template.summary(facts), palette, characteristics: template.characteristics(facts), pros: template.pros(facts), cons: template.cons(facts) };
}

export function buildCatalogOverlay(pack) {
  const coverage = { translated: 0, approvedFallbacks: [], placeholders: [] };
  const canonicalCategories = getCategories();
  const categoryTitles = Object.fromEntries(canonicalCategories.map((category, index) => [category.id, CATEGORY_TITLES[pack.locale]?.[index] || text(category.title, pack.locale)]));
  const styles = Object.fromEntries(getAllStyles().map(style => [style.id, localizedStyle(style, categoryTitles[style.categoryId], pack, coverage)]));
  const categories = Object.fromEntries(canonicalCategories.map(category => { const title = categoryTitles[category.id]; const description = pack.locale === 'ko' ? text(category.description, 'ko') : TEMPLATES[pack.locale].category(title); coverage.translated += 2; return [category.id, { id: category.id, title, description }]; }));
  const facets = Object.fromEntries(getFacetDefinitions().map(facet => { coverage.translated += 1 + facet.values.length; return [facet.id, { id: facet.id, label: translatedFacet(facet.id, pack.locale, facet.label), values: Object.fromEntries(facet.values.map(value => [value.id, translatedFacet(value.id, pack.locale, value.label)])) }]; }));
  return Object.freeze({ styles: Object.freeze(styles), categories: Object.freeze(categories), facets: Object.freeze(facets), coverage: Object.freeze({ translated: coverage.translated, approvedFallbacks: Object.freeze(coverage.approvedFallbacks.map(item => Object.freeze(item))), placeholders: Object.freeze(coverage.placeholders) }) });
}

export function getCanonicalCatalogCollections() {
  return { styles: getAllStyles(), categories: getCategories(), facets: getFacetDefinitions() };
}

export function validateActiveSnapshot(snapshot, messageKeys) {
  const canonical = getCanonicalCatalogCollections();
  const errors = [];
  if (Object.keys(snapshot?.messages || {}).sort().join('|') !== [...messageKeys].sort().join('|')) errors.push('messages.key-parity');
  if (!snapshot?.copy || Object.keys(snapshot.copy).length < 120) errors.push('copy.incomplete');
  for (const [key, records] of Object.entries(canonical)) for (const record of records) if (!snapshot?.catalog?.[key]?.[record.id]) errors.push(`${key}.${record.id}.missing`);
  if (snapshot?.catalog?.coverage?.placeholders?.length) errors.push('catalog.placeholder');
  return errors;
}
