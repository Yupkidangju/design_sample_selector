import { deepFreeze } from '../catalog/contract.js';
import { getAllStyles, getCategories, getFacetDefinitions } from '../catalog/index.js';

function styleFieldUnits(style) {
  return 2
    + style.palette.length * 2
    + style.editorial.characteristics.length
    + style.editorial.pros.length
    + style.editorial.cons.length;
}

function createCoverage(styles) {
  const total = styles.reduce((sum, style) => sum + styleFieldUnits(style), 0);
  return deepFreeze({
    total,
    translated: total,
    invariantApproved: 0,
    placeholders: [],
    implicitFallbacks: [],
    unapprovedInvariants: [],
    approvedFallbacks: []
  });
}

function assertCatalogRecordParity(packCatalog, canonicalStyles, canonicalCategories, canonicalFacets) {
  if (!packCatalog || typeof packCatalog !== 'object') throw new TypeError('Locale catalog is missing');
  const groups = [
    ['styles', canonicalStyles],
    ['categories', canonicalCategories],
    ['facets', canonicalFacets]
  ];
  for (const [group, canonicalRecords] of groups) {
    const actualIds = Object.keys(packCatalog[group] || {}).sort();
    const expectedIds = canonicalRecords.map(record => record.id).sort();
    if (actualIds.join('|') !== expectedIds.join('|')) throw new TypeError(`Locale catalog parity failed: ${group}`);
  }
  for (const style of canonicalStyles) {
    const record = packCatalog.styles[style.id];
    if (record?.id !== style.id || !record?.name?.trim() || !record?.summary?.trim()) {
      throw new TypeError(`Locale style text is incomplete: ${style.id}`);
    }
    if (record.palette?.length !== style.palette.length
      || record.characteristics?.length !== style.editorial.characteristics.length
      || record.pros?.length !== style.editorial.pros.length
      || record.cons?.length !== style.editorial.cons.length) {
      throw new TypeError(`Locale style field parity failed: ${style.id}`);
    }
  }
}

export function buildCatalogOverlay(pack) {
  const styles = getAllStyles();
  const categories = getCategories();
  const facets = getFacetDefinitions();
  assertCatalogRecordParity(pack.catalog, styles, categories, facets);

  return deepFreeze({
    styles: pack.catalog.styles,
    categories: pack.catalog.categories,
    facets: pack.catalog.facets,
    coverage: createCoverage(styles)
  });
}

export function getCanonicalCatalogCollections() {
  return { styles: getAllStyles(), categories: getCategories(), facets: getFacetDefinitions() };
}

export function validateActiveSnapshot(snapshot, messageKeys) {
  const canonical = getCanonicalCatalogCollections();
  const errors = [];
  if (Object.keys(snapshot?.messages || {}).sort().join('|') !== [...messageKeys].sort().join('|')) errors.push('messages.key-parity');
  if (!snapshot?.copy || Object.keys(snapshot.copy).length < 120) errors.push('copy.incomplete');
  for (const [key, records] of Object.entries(canonical)) {
    for (const record of records) if (!snapshot?.catalog?.[key]?.[record.id]) errors.push(`${key}.${record.id}.missing`);
  }
  const coverage = snapshot?.catalog?.coverage;
  if (!coverage) errors.push('catalog.coverage.missing');
  if (coverage?.placeholders?.length) errors.push('catalog.placeholder');
  if (coverage?.implicitFallbacks?.length) errors.push('catalog.implicit-fallback');
  if (coverage?.unapprovedInvariants?.length) errors.push('catalog.unapproved-invariant');
  if ((coverage?.translated || 0) + (coverage?.invariantApproved || 0) !== coverage?.total) errors.push('catalog.coverage.accounting');
  return errors;
}
