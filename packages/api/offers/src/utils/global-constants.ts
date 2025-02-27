import { z } from 'zod';

export const BLC_UK = 'blc-uk';
export const BLC_AUS = 'blc-aus';
export const DDS_UK = 'dds-uk';
export const EPHEMERAL_PR_REGEX = /^pr-\d+-blc-mono(-dds)?$/;

export const OFFERS_DOMAIN_NAME = 'blcshine.io';

export const enum APP_MODE {
  DEV = 'dev',
  REMOVE = 'remove',
  DEPLOY = 'deploy',
}

export const enum OFFERS_SUBDOMAINS {
  BLC_UK = 'offers',
  DDS_UK = 'offers-dds-uk',
  BLC_AUS = 'offers-au',
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

export const OFFERS_TYPE_ENUM = z.enum([
  'Online',
  'Cashback',
  'Giftcards',
  'Popular',
  'Own Benefits',
  'In-store',
  'Local Offer',
  'Featured',
  'Local Services',
]);

export const OFFER_TYPES = {
  0: OFFERS_TYPE_ENUM.enum.Online,
  1: OFFERS_TYPE_ENUM.enum.Cashback,
  2: OFFERS_TYPE_ENUM.enum.Giftcards,
  3: OFFERS_TYPE_ENUM.enum.Popular,
  4: OFFERS_TYPE_ENUM.enum['Own Benefits'],
  5: OFFERS_TYPE_ENUM.enum['In-store'],
  6: OFFERS_TYPE_ENUM.enum['Local Offer'],
  9: OFFERS_TYPE_ENUM.enum.Featured,
  13: OFFERS_TYPE_ENUM.enum['Local Services'],
};

export enum API_SOURCE {
  APP = 'app',
  WEB = 'web',
}
