import { deepFreeze } from './contract.js';
import {
  getAllStyles,
  getCategories,
  getStyleById,
  getStylesByCategory
} from './index.js';

/** 새 정규 레코드를 Wave 0 UI가 사용하는 평면 형태로 투영한다. */
export function toLegacySubDesign(style, localized = null) {
  const localizedStyle = localized?.styles?.[style.id];
  return deepFreeze({
    id: style.id,
    name: localizedStyle?.name || style.name.ko,
    nameEn: style.name.en,
    shortDesc: localizedStyle?.summary || style.summary.ko,
    previewType: style.preview.rendererId,
    moodTags: style.editorial.moodTags,
    defaultTweaks: style.defaultTweaks,
    characteristics: localizedStyle?.characteristics || style.editorial.characteristics,
    pros: localizedStyle?.pros || style.editorial.pros,
    cons: localizedStyle?.cons || style.editorial.cons,
    palette: style.palette.map(color => ({
      id: color.id,
      name: localizedStyle?.palette?.find(item => item.id === color.id)?.name || color.name.en || color.name.ko,
      hex: color.value,
      usage: localizedStyle?.palette?.find(item => item.id === color.id)?.usage || color.usage.ko
    })),
    motionProfile: style.preview.motionId,
    thumbMotif: style.preview.thumbnailId
  });
}

const LEGACY_SUB_DESIGN_BY_ID = new Map(
  getAllStyles().map(style => [style.id, toLegacySubDesign(style)])
);

export const LEGACY_MAIN_CATEGORIES = deepFreeze(
  getCategories().map(category => ({
    id: category.id,
    title: category.title.ko,
    titleEn: category.title.en,
    description: category.description.ko,
    icon: category.icon,
    accentColor: category.accentColor,
    tags: category.tags,
    subCategories: getStylesByCategory(category.id)
      .map(style => LEGACY_SUB_DESIGN_BY_ID.get(style.id))
  }))
);

export const LEGACY_ALL_SUB_DESIGNS = deepFreeze(
  LEGACY_MAIN_CATEGORIES.flatMap(category =>
    category.subCategories.map(style => ({
      ...style,
      categoryId: category.id,
      categoryTitle: category.title,
      categoryTitleEn: category.titleEn,
      accentColor: category.accentColor,
      icon: category.icon
    }))
  )
);

const LEGACY_FLAT_SUB_DESIGN_BY_ID = new Map(
  LEGACY_ALL_SUB_DESIGNS.map(style => [style.id, style])
);

export const LEGACY_STYLE_MOTION = deepFreeze(Object.fromEntries(
  getAllStyles().map(style => [style.id, {
    motionProfile: style.preview.motionId,
    thumbMotif: style.preview.thumbnailId
  }])
));

export const LEGACY_SUB_ID_ALIASES = deepFreeze(Object.fromEntries(
  getAllStyles().flatMap(style => style.aliases.map(alias => [alias, style.id]))
));

export function getLegacyMainCategories() {
  return LEGACY_MAIN_CATEGORIES;
}

export function getLegacyAllSubDesigns() {
  return LEGACY_ALL_SUB_DESIGNS;
}

export function findLegacySubById(id) {
  const style = getStyleById(id);
  return style ? LEGACY_FLAT_SUB_DESIGN_BY_ID.get(style.id) || null : null;
}

export function getLocalizedLegacyMainCategories(snapshot) {
  const catalog = snapshot?.catalog;
  return deepFreeze(getCategories().map(category => ({
    id: category.id,
    title: catalog?.categories?.[category.id]?.title || category.title.ko,
    titleEn: category.title.en,
    description: catalog?.categories?.[category.id]?.description || category.description.ko,
    icon: category.icon,
    accentColor: category.accentColor,
    tags: category.tags,
    subCategories: getStylesByCategory(category.id).map(style => toLegacySubDesign(style, catalog))
  })));
}

export function getLocalizedLegacyAllSubDesigns(snapshot) {
  return deepFreeze(getLocalizedLegacyMainCategories(snapshot).flatMap(category => (
    category.subCategories.map(style => ({
      ...style,
      categoryId: category.id,
      categoryTitle: category.title,
      categoryTitleEn: category.titleEn,
      accentColor: category.accentColor,
      icon: category.icon
    }))
  )));
}
