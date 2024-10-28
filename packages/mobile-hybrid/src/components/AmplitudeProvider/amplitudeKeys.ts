export enum FeatureFlags {
  SEARCH_RESULTS_PAGE_CATEGORIES_LINKS = 'search-results-page-categories-links',
  SEARCH_START_PAGE_BRANDS_LINK = 'search-start-page-brands-link',
  SEARCH_START_PAGE_CATEGORIES_LINKS = 'search-start-page-categories-links',
  SEARCH_START_PAGE_OFFERS_NEAR_YOU_LINK = 'search-start-page-offers-near-you-link',
  SEARCH_RECENT_SEARCHES = 'search-recent-searches',
  V5_API_INTEGRATION = 'v5-api-integration',
  SEARCH_V5_ENABLED = 'search_v5',
}

export enum Experiments {
  NON_EXCLUSIVE_OFFERS = 'non-exclusive-offers',
  POPULAR_OFFERS = 'popular-offers',
  FAVOURITE_SUBTITLE = 'favourite-subtitle',
  HOMEPAGE_POSITIONING = 'homepage-positioning',
  BF_FLEXI = 'bf-flexi',
  OFFER_SHEET_VAULT = 'offer-sheet-redeem-vault-app',
  OFFER_SHEET_NON_VAULT = 'offer-sheet-redeem-non-vault-app',
  SEARCH_V5 = 'search_v5',
  USP_BANNER_HOMEPAGE = 'usp-banner-homepage',
  NEW_COMPANY_PAGE = 'app-new-company-page',
  SEARCH_UI_CONTRAST = 'conv-blc-5-0-search-ui',
}

export const featureFlagKeys = Object.values(FeatureFlags);
export const experimentKeys = Object.values(Experiments);
