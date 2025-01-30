import { getBrandedDiscoveryPath } from '@bluelightcard/shared-ui';

const V5_REGION = process.env.NEXT_PUBLIC_APP_BRAND === 'blc-au' ? 'au' : 'eu';

const DISCOVERY_PATH = getBrandedDiscoveryPath();

export const V5_API_URL = {
  Categories: `${DISCOVERY_PATH}/categories`,
  Companies: `${DISCOVERY_PATH}/companies`,
  Search: `${DISCOVERY_PATH}/search`,
  FlexibleOffers: `${DISCOVERY_PATH}/menus/flexible`,
  MarketingPreferences: `/${V5_REGION}/members/preferences`,
  Menus: `${DISCOVERY_PATH}/menus`,
  User: `/${V5_REGION}/members/user`,
} as const;
