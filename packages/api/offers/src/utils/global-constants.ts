export const BLC_UK = 'blc-uk';
export const BLC_AUS = 'blc-aus';
export const DDS_UK = 'dds-uk';

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

export enum ENDPOINTS {
  PRODUCTION_COMPANY_FOLLOWS = 'https://st1vstksxd.execute-api.eu-west-2.amazonaws.com/production/companyfollows/viewCompanyLikes',
  DEVELOP_COMPANY_FOLLOWS = 'https://tvu2d81ho8.execute-api.eu-west-2.amazonaws.com/develop/companyfollows/viewCompanyLikes',
  PRODUCTION_USER_PROFILE = 'https://identity.blcshine.io/user',
  DEVELOP_USER_PROFILE = 'https://staging-identity.blcshine.io/user',
}

export const COMPANY_FOLLOWS_SECRET: string = 'pHwaoxataaRpnliYFDIL0HIvMbwkvNVu1L48z4m2lvz6p/IT1f5JmVRHpJPFPXxK';
