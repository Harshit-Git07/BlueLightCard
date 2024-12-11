const V5_REGION = process.env.NEXT_PUBLIC_APP_BRAND === 'blc-au' ? 'au' : 'eu';

export const V5_API_URL = {
  Categories: `/${V5_REGION}/discovery/categories`,
  Companies: `/${V5_REGION}/discovery/companies`,
  Employers: (orgId?: string) => `/orgs/${orgId}/employers`,
  Search: `/${V5_REGION}/discovery/search`,
  FlexibleOffers: `/${V5_REGION}/discovery/menus/flexible`,
  MarketingPreferences: `/${V5_REGION}/members/preferences`,
  Menus: `/${V5_REGION}/discovery/menus`,
  Organisation: (orgId?: string) => `/orgs/${orgId}`,
  Profile: (memberId: string) => `/members/${memberId}/profile`,
  User: `/${V5_REGION}/members/user`,
} as const;
