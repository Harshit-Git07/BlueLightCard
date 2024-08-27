// TB - Comment to trigger deploy in mobile-hybrid. Remove this asap.
export enum FeatureFlags {
  SEARCH_RESULTS_PAGE_CATEGORIES_LINKS = 'search-results-page-categories-links',
  SEARCH_START_PAGE_BRANDS_LINK = 'search-start-page-brands-link',
  SEARCH_START_PAGE_CATEGORIES_LINKS = 'search-start-page-categories-links',
  SEARCH_START_PAGE_OFFERS_NEAR_YOU_LINK = 'search-start-page-offers-near-you-link',
  SEARCH_RECENT_SEARCHES = 'search-recent-searches',
  V5_API_INTEGRATION = 'v5-api-integration',
  OFFER_SHEET_VAULT_QR = 'offer-sheet-redeem-qr-app',
  OFFER_SHEET_GENERIC = 'offer-sheet-redeem-generic-app',
  OFFER_SHEET_SHOW_CARD = 'offer-sheet-redeem-show-card-app',
  OFFER_SHEET_PREAPPLIED = 'offer-sheet-redeem-preapplied-app',
}

export enum Experiments {
  NON_EXCLUSIVE_OFFERS = 'non-exclusive-offers',
  POPULAR_OFFERS = 'popular-offers',
  FAVOURITED_BRANDS = 'favourited-brands',
  STREAMLINED_HOMEPAGE = 'streamlined-homepage',
  FAVOURITE_SUBTITLE = 'favourite-subtitle',
  HOMEPAGE_POSITIONING = 'homepage-positioning',
  BF_FLEXI = 'bf-flexi',
  OFFER_SHEET_VAULT = 'offer-sheet-redeem-vault-app',
  OFFER_SHEET_NON_VAULT = 'offer-sheet-redeem-non-vault-app',
  CATEGORY_LEVEL_THREE_SEARCH = 'search-category-level-three-hybrid-v2',
  NEW_COMPANY_PAGE = 'app-new-company-page',
}

export const featureFlagKeys = Object.values(FeatureFlags);
export const experimentKeys = Object.values(Experiments);
