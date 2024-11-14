const V5_REGION = process.env.NEXT_PUBLIC_APP_BRAND === 'blc-au' ? 'au' : 'eu';

export const V5_API_URL = {
  Categories: `/${V5_REGION}/discovery/categories`,
  Companies: `/${V5_REGION}/discovery/companies`,
  Search: `/${V5_REGION}/discovery/search`,
  FlexibleOffers: `/${V5_REGION}/discovery/menu`,
  User: `/${V5_REGION}/members/user`,
} as const;
