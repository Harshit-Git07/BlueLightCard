import eventBusInit from './eventBus';

export const eventBus = eventBusInit();
export const PAGE_SIZE = 20;

export enum Channels {
  API_RESPONSE = 'nativeAPIResponse',
  EXPERIMENTS = 'nativeExperiments',
  APP_LIFECYCLE = 'nativeAppLifecycle',
}

export enum APIUrl {
  News = '/api/4/news/list.php',
  OfferPromos = '/api/4/offer/promos_new.php',
  FavouritedBrands = '/api/4/user/bookmark/retrieve.php',
  Search = '/api/4/offer/search.php',
  List = '/api/4/offer/list.php',
}
