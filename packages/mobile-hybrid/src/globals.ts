export const PAGE_SIZE = 20;

export enum Channels {
  API_RESPONSE = 'nativeAPIResponse',
  EXPERIMENTS = 'nativeExperiments',
  APP_LIFECYCLE = 'nativeAppLifecycle',
}

const V5_REGION = process.env.NEXT_PUBLIC_APP_BRAND === 'blc-au' ? 'au' : 'eu';

export enum APIUrl {
  News = '/api/4/news/list.php',
  OfferPromos = '/api/4/offer/promos_new.php',
  FavouritedBrands = '/api/4/user/bookmark/retrieve.php',
  Search = '/api/4/offer/search.php',
  List = '/api/4/offer/list.php',
  UserService = '/api/4/user/profile/service/retrieve.php',
}

export const NAVIGATE_NEWS_URL =
  process.env.NEXT_PUBLIC_APP_BRAND === 'dds-uk'
    ? '/defencediscountservicenewsdetails.php'
    : '/bluelightcardnewsdetails.php';

export const V5_API_URL = {
  Search: `/${V5_REGION}/discovery/search`,
  CampaignEvents: `/${V5_REGION}/discovery/campaigns`,
  User: `/${V5_REGION}/identity/user`,
  FlexibleOffers: `/${V5_REGION}/discovery/menus/flexible`,
  Menus: `/${V5_REGION}/discovery/menus`,
} as const;

export const CDN_URL = process.env.NEXT_PUBLIC_APP_CDN_URL ?? 'https://cdn.bluelightcard.co.uk';
export const BRAND = process.env.NEXT_PUBLIC_APP_BRAND ?? 'blc-uk';
export const IS_SSR = typeof window === 'undefined';
export const USE_NATIVE_MOCK = process.env.NEXT_PUBLIC_USE_NATIVE_MOCK === 'true';
export const USE_DEV_TOOLS = process.env.NEXT_PUBLIC_USE_DEV_TOOLS === 'true';
export const FSI_COMPANY_IDS = process.env.NEXT_PUBLIC_FSI_COMPANY_IDS ?? '';
