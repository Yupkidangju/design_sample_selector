import { getLocaleCopy } from '../copy.js';
import catalog from './catalog/en.js';

export default {
  locale: 'en',
  catalog,
  copy: getLocaleCopy('en'),
  messages: {
    language: 'Language', search: 'Search designs', all: 'All', saved: 'Saved',
    sort: 'Sort', catalogOrder: 'Catalog order', nameAscending: 'Name', eraAscending: 'Oldest', eraDescending: 'Newest',
    grid: 'Grid', bento: 'Bento', spectrum: 'Spectrum', details: 'View details', bookmark: 'Bookmark', bookmarked: 'Bookmarked',
    inspector: 'Inspector', palette: 'Color palette', characteristics: 'Characteristics', pros: 'Strengths', cons: 'Considerations',
    copy: 'Copy', copied: 'Copied', reset: 'Reset defaults', desktop: 'Desktop', mobile: 'Mobile',
    noResults: 'No matching designs.', category: 'Category', filters: 'Filters', clearFilters: 'Clear filters',
    liveTuner: 'Live parameter tuner', previewHint: 'Interact with the elements in the preview.',
    designSummary: 'A design sample with practical application guidance.',
    paletteUsage: 'A color used for primary surfaces and signals in this sample.', subtitle: '8 categories · 120 live samples · 8 archetypes · dynamic sandbox',
    noSelection: 'No selection', compare: 'Split compare'
  }
};
