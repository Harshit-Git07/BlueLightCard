export enum FeatureFlags {
  SEARCH_RESULTS_PAGE_CATEGORIES_LINKS = 'search-results-page-categories-links',
  SEARCH_START_PAGE_BRANDS_LINK = 'search-start-page-brands-link',
  SEARCH_START_PAGE_CATEGORIES_LINKS = 'search-start-page-categories-links',
  SEARCH_START_PAGE_OFFERS_NEAR_YOU_LINK = 'search-start-page-offers-near-you-link',
  SEARCH_RECENT_SEARCHES = 'search-recent-searches',
}

export enum Experiments {
  HOMEPAGE_SEARCHBAR = 'homepage-searchbar',
  NON_EXCLUSIVE_OFFERS = 'non-exclusive-offers',
  POPULAR_OFFERS = 'popular-offers',
  FAVOURITED_BRANDS = 'favourited-brands',
  STREAMLINED_HOMEPAGE = 'streamlined-homepage',
  FAVOURITE_SUBTITLE = 'favourite-subtitle',
  HOMEPAGE_POSITIONING = 'homepage-positioning',
  BF_FLEXI = 'bf-flexi',
  OFFER_SHEET = 'offer-sheet-redeem-vault-app',
}

export const featureFlagKeys = Object.values(FeatureFlags);
export const experimentKeys = Object.values(Experiments);
