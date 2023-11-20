const BRAND = process.env.NEXT_PUBLIC_APP_BRAND ?? 'blc-uk';
const REGION = process.env.NEXT_PUBLIC_APP_REGION ?? 'GB';
const DEFAULT_LANG = process.env.NEXT_PUBLIC_APP_LANG ?? 'en';
const FALLBACK_LNG = 'en';
const ASSET_PREFIX = !process.env.STORYBOOK_ENV ? '/_next/static/assets' : '';
const FEATURE_FLAG_ENVIRONMENT_ID = process.env.FEATURE_FLAG_ENVIRONMENT_ID ?? '';
const CDN_URL = process.env.NEXT_PUBLIC_APP_CDN_URL ?? 'https://cdn.bluelightcard.co.uk';
const COGNITO_CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID ?? '';
const COGNITO_CLIENT_SECRET = process.env.NEXT_PUBLIC_COGNITO_CLIENT_SECRET ?? '';
const COGNITO_IDP_ID = process.env.NEXT_PUBLIC_COGNITO_IDP_ID ?? '';
const LOGOUT_ROUTE = process.env.NEXT_PUBLIC_LOGOUT_ROUTE ?? '/logout.php';
const AMPLITUDE_API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY ?? '';

const BLACK_FRIDAY_TIME_LOCK_START_DATE =
  process.env.NEXT_PUBLIC_BLACK_FRIDAY_TIME_LOCK_START_DATE ?? '';
const BLACK_FRIDAY_TIME_LOCK_END_DATE =
  process.env.NEXT_PUBLIC_BLACK_FRIDAY_TIME_LOCK_END_DATE ?? '';

const IS_SSR = typeof window === 'undefined';

const USER_PROFILE_ENDPOINT = process.env.NEXT_PUBLIC_USER_PROFILE_ENDPOINT ?? '';

/*
 * Language is made up of the lng and region
 * Example: [lng]-[region]
 */
const LANGUAGE = `${DEFAULT_LANG}-${REGION}`;

/**
 * List of brands currently available
 *
 * Whenever a new brand becomes available, this new brand name should be added to this list
 */
const BRANDS = ['blc-uk', 'blc-au', 'dds-uk'];

module.exports = {
  BRAND,
  BRANDS,
  REGION,
  DEFAULT_LANG,
  FALLBACK_LNG,
  LANGUAGE,
  ASSET_PREFIX,
  FEATURE_FLAG_ENVIRONMENT_ID,
  CDN_URL,
  COGNITO_CLIENT_ID,
  COGNITO_CLIENT_SECRET,
  COGNITO_IDP_ID,
  LOGOUT_ROUTE,
  AMPLITUDE_API_KEY,
  BLACK_FRIDAY_TIME_LOCK_START_DATE,
  BLACK_FRIDAY_TIME_LOCK_END_DATE,
  IS_SSR,
  USER_PROFILE_ENDPOINT,
};
