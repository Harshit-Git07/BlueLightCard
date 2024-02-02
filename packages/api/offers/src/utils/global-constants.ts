export const BLC_UK = 'blc-uk';
export const BLC_AUS = 'blc-aus';
export const DDS_UK = 'dds-uk';

export const enum ENVIRONMENTS {
  DEVELOP = 'dev',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

export const enum APP_MODE {
  DEV = 'dev',
  REMOVE = 'remove',
  DEPLOY = 'deploy',
}

export const enum DATABASE_PROPS {
  NAME = 'offers',
  USERNAME = 'offersAdmin',
  PORT = 3306,
}

export const enum CATEGORY_TYPES {
  OFFER = 'offer',
  COMPANY = 'company',
}

export enum TYPE_KEYS {
  FEATURED = 'FEATURED',
  FLEXIBLE = 'FLEXIBLE',
  MARKETPLACE = 'MARKETPLACE',
  DEALS = 'DEALS',
  CATEGORIES = 'CATEGORIES',
  COMPANIES = 'COMPANIES',
  POPULAR = 'POPULAR',
}

export const enum OFFER_MENUS_FILE_NAMES {
  FEATURED = 'features.txt',
  FLEXIBLE = 'flexible.txt',
  DEALS = 'deals.txt',
  CATEGORIES = 'categories.txt',
  COMPANIES = 'compListData.txt',
  POPULAR = 'popularoffersPDO.txt',
  MARKETPLACE = 'marketplace.txt',
}
