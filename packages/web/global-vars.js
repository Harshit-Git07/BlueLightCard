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

const OFFERS_ENDPOINT = process.env.NEXT_PUBLIC_OFFERS_ENDPOINT ?? '';

// Identity API
const IDENTITY_API_URL = process.env.NEXT_PUBLIC_IDENTITY_API_URL ?? '';
const IDENTITY_API_KEY = process.env.NEXT_PUBLIC_IDENTITY_API_KEY ?? '';
const IDENTITY_USER_PROFILE_ENDPOINT =
  IDENTITY_API_URL + (process.env.NEXT_PUBLIC_USER_PROFILE_ENDPOINT ?? '');
const IDENTITY_ORGANISATION_ENDPOINT =
  IDENTITY_API_URL + (process.env.NEXT_PUBLIC_ORGANISATION_ENDPOINT ?? '');
const IDENTITY_ELIGIBILITY_FORM_OUTPUT_ENDPOINT =
  IDENTITY_API_URL + (process.env.NEXT_PUBLIC_ELIGIBILITY_FORM_OUTPUT_ENDPOINT ?? '');

// Datadog metric reporting
const DATADOG_APP_ID = process.env.NEXT_PUBLIC_DATADOG_APP_ID ?? '';
const DATADOG_CLIENT_TOKEN = process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN ?? '';
const DATADOG_SITE = process.env.NEXT_PUBLIC_DATADOG_SITE ?? 'datadoghq.eu';
const DATADOG_DEFAULT_SERVICE = process.env.NEXT_PUBLIC_DATADOG_DEFAULT_SERVICE ?? '';
const DATADOG_ENV = process.env.NEXT_PUBLIC_DATADOG_ENV ?? '';

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
  OFFERS_ENDPOINT,
  IDENTITY_API_KEY,
  IDENTITY_USER_PROFILE_ENDPOINT,
  IDENTITY_ORGANISATION_ENDPOINT,
  IDENTITY_ELIGIBILITY_FORM_OUTPUT_ENDPOINT,
  DATADOG_APP_ID,
  DATADOG_CLIENT_TOKEN,
  DATADOG_SITE,
  DATADOG_DEFAULT_SERVICE,
  DATADOG_ENV,
};
