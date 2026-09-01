function fillToLength(source, candidates) {
  return source.map((_, index) => candidates[Math.min(index, candidates.length - 1)]);
}

export function applyEditorialReview(catalog, profilesByCategory, categoryCopyById, localeRules) {
  const reviewedIds = new Set();

  for (const [categoryId, profiles] of Object.entries(profilesByCategory)) {
    const categoryCopy = categoryCopyById[categoryId];
    if (!categoryCopy) throw new Error(`Unknown ${localeRules.label} editorial category: ${categoryId}`);

    for (const [styleId, profile] of Object.entries(profiles)) {
      const record = catalog.styles[styleId];
      if (!record) throw new Error(`Unknown ${localeRules.label} editorial style: ${styleId}`);
      if (reviewedIds.has(styleId)) throw new Error(`Duplicate ${localeRules.label} editorial style: ${styleId}`);

      const [summary, characteristic, fit, caution] = profile;
      record.summary = summary;
      record.characteristics = fillToLength(
        record.characteristics,
        localeRules.characteristics(record, characteristic, categoryCopy)
      );
      record.pros = fillToLength(record.pros, localeRules.pros(record, fit, categoryCopy));
      record.cons = fillToLength(record.cons, localeRules.cons(record, caution, categoryCopy));
      record.palette = record.palette.map((color, index) =>
        localeRules.palette(record, color, index, categoryCopy)
      );
      reviewedIds.add(styleId);
    }
  }

  return catalog;
}
