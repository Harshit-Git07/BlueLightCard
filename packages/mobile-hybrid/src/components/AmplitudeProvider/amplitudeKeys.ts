export enum FeatureFlags {
  SEARCH_RESULTS_PAGE_CATEGORIES_LINKS = 'search-results-page-categories-links',
  SEARCH_START_PAGE_BRANDS_LINK = 'search-start-page-brands-link',
  SEARCH_START_PAGE_CATEGORIES_LINKS = 'search-start-page-categories-links',
  SEARCH_START_PAGE_OFFERS_NEAR_YOU_LINK = 'search-start-page-offers-near-you-link',
  SEARCH_RECENT_SEARCHES = 'search-recent-searches',
}

export enum Experiments {}

export const featureFlagKeys = Object.values(FeatureFlags);
export const experimentKeys = Object.values(Experiments);
