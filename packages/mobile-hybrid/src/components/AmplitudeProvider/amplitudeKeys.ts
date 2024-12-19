export enum FeatureFlags {
  SEARCH_START_PAGE_BRANDS_LINK = 'search-start-page-brands-link',
  SEARCH_START_PAGE_OFFERS_NEAR_YOU_LINK = 'search-start-page-offers-near-you-link',
  SEARCH_RECENT_SEARCHES = 'search-recent-searches',
  V5_API_INTEGRATION = 'v5-api-integration',
  CMS_OFFERS = 'cms-offers',
  SEARCH_V5_ENABLED = 'search_v5',
  MODERN_FLEXI_MENU_HYBRID = 'modern-flexi-menu-hybrid',
  MODERN_CATEGORIES_HYBRID = 'modern-category-pages-hybrid',
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
  DEALS_TIMER = 'conv-blc-8-0-deals-timer',
  NEW_COMPANY_PAGE = 'app-new-company-page',
  SEARCH_UI_CONTRAST = 'conv-blc-5-0-search-ui',
  POPULAR_BRANDS_INLINE_LAYOUT = 'conv-blc-2-3-popular-brands-inline-layout-ab-test',
}

export const featureFlagKeys = Object.values(FeatureFlags);
export const experimentKeys = Object.values(Experiments);
