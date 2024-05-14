const BRAND = process.env.NEXT_PUBLIC_APP_BRAND ?? 'blc-uk';
const LEGACY_MICROSERVICE_BRAND = process.env.NEXT_PUBLIC_APP_MICROSERVICE_BRAND ?? 'BLC';
const REGION = process.env.NEXT_PUBLIC_APP_REGION ?? 'GB';
const DEFAULT_LANG = process.env.NEXT_PUBLIC_APP_LANG ?? 'en';
const FALLBACK_LNG = 'en';
const ASSET_PREFIX = !process.env.STORYBOOK_ENV ? '/_next/static/assets' : '';
const CDN_URL = process.env.NEXT_PUBLIC_APP_CDN_URL ?? 'https://cdn.bluelightcard.co.uk';
const LOGOUT_ROUTE = process.env.NEXT_PUBLIC_LOGOUT_ROUTE ?? '/logout.php';
const AMPLITUDE_API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY ?? '';
const BLACK_FRIDAY_TIME_LOCK_START_DATE =
  process.env.NEXT_PUBLIC_BLACK_FRIDAY_TIME_LOCK_START_DATE ?? '';
const BLACK_FRIDAY_TIME_LOCK_END_DATE =
  process.env.NEXT_PUBLIC_BLACK_FRIDAY_TIME_LOCK_END_DATE ?? '';
const IS_SSR = typeof window === 'undefined';
const USER_PROFILE_ENDPOINT = process.env.NEXT_PUBLIC_USER_PROFILE_ENDPOINT ?? '';
const OFFERS_ENDPOINT = process.env.NEXT_PUBLIC_OFFERS_ENDPOINT ?? '';
const AMPLITUDE_DEPLOYMENT_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_DEPLOYMENT_KEY ?? '';
const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT;
const REDEMPTION_DETAILS_ENDPOINT = process.env.NEXT_PUBLIC_REDEMPTION_DETAILS_ENDPOINT ?? '';
const REDEEM_ENDPOINT = process.env.NEXT_PUBLIC_REDEEM_ENDPOINT ?? '';

// Identity API
const IDENTITY_API_URL = process.env.NEXT_PUBLIC_IDENTITY_API_URL ?? '';
const IDENTITY_API_KEY = process.env.NEXT_PUBLIC_IDENTITY_API_KEY ?? '';
const IDENTITY_USER_PROFILE_ENDPOINT = IDENTITY_API_URL + USER_PROFILE_ENDPOINT;
const IDENTITY_ORGANISATION_ENDPOINT =
  IDENTITY_API_URL + (process.env.NEXT_PUBLIC_ORGANISATION_ENDPOINT ?? '');
const IDENTITY_ELIGIBILITY_FORM_OUTPUT_ENDPOINT =
  IDENTITY_API_URL + (process.env.NEXT_PUBLIC_ELIGIBILITY_FORM_OUTPUT_ENDPOINT ?? '');

// Cognito UI
const COGNITO_CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID ?? '';
const COGNITO_CLIENT_SECRET = process.env.NEXT_PUBLIC_COGNITO_CLIENT_SECRET ?? '';
const COGNITO_CLIENT_REGION = process.env.NEXT_PUBLIC_COGNITO_CLIENT_REGION ?? 'eu-west-2';
const COGNITO_LOGIN_URL = process.env.NEXT_PUBLIC_COGNITO_LOGIN_URL ?? '';
const COGNITO_LOGOUT_URL = process.env.NEXT_PUBLIC_COGNITO_LOGOUT_URL ?? '';

// Flagsmith
const FLAGSMITH_KEY = process.env.NEXT_PUBLIC_FLAGSMITH_KEY ?? '';

// Datadog metric reporting
const DATADOG_APP_ID = process.env.NEXT_PUBLIC_DATADOG_APP_ID ?? '';
const DATADOG_CLIENT_TOKEN = process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN ?? '';
const DATADOG_SITE = process.env.NEXT_PUBLIC_DATADOG_SITE ?? 'datadoghq.eu';
const DATADOG_DEFAULT_SERVICE = process.env.NEXT_PUBLIC_DATADOG_DEFAULT_SERVICE ?? '';
const DATADOG_ENV = process.env.NEXT_PUBLIC_DATADOG_ENV ?? '';

// Search
const SEARCH_ENDPOINT = process.env.NEXT_PUBLIC_SEARCH_ENDPOINT ?? '';

// Favourites end point
const RETRIEVE_FAVOURITE_ENDPOINT = process.env.NEXT_PUBLIC_RETRIEVE_FAVOURITE_ENDPOINT ?? '';
const UPDATE_FAVOURITE_ENDPOINT = process.env.NEXT_PUBLIC_UPDATE_FAVOURITE_ENDPOINT ?? '';

//Offers
const RETRIEVE_OFFER_ENDPOINT = process.env.NEXT_PUBLIC_RETRIEVE_OFFER_ENDPOINT ?? '';
const OFFERS_API_GATEWAY_ENDPOINT = process.env.NEXT_PUBLIC_OFFERS_API_GATEWAY_ENDPOINT ?? '';

//Braze
const BRAZE_SDK_ENDPOINT = process.env.NEXT_PUBLIC_BRAZE_SDK_ENDPOINT ?? '';
const BRAZE_SDK_API_KEY = process.env.NEXT_PUBLIC_BRAZE_SDK_API_KEY ?? '';

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
  LEGACY_MICROSERVICE_BRAND,
  BRANDS,
  REGION,
  DEFAULT_LANG,
  FALLBACK_LNG,
  LANGUAGE,
  ASSET_PREFIX,
  CDN_URL,
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
  FLAGSMITH_KEY,
  COGNITO_CLIENT_ID,
  COGNITO_CLIENT_SECRET,
  COGNITO_CLIENT_REGION,
  COGNITO_LOGIN_URL,
  COGNITO_LOGOUT_URL,
  AMPLITUDE_DEPLOYMENT_KEY,
  DATADOG_APP_ID,
  DATADOG_CLIENT_TOKEN,
  DATADOG_SITE,
  DATADOG_DEFAULT_SERVICE,
  DATADOG_ENV,
  SEARCH_ENDPOINT,
  RETRIEVE_FAVOURITE_ENDPOINT,
  UPDATE_FAVOURITE_ENDPOINT,
  RETRIEVE_OFFER_ENDPOINT,
  ENVIRONMENT,
  REDEMPTION_DETAILS_ENDPOINT,
  REDEEM_ENDPOINT,
  OFFERS_API_GATEWAY_ENDPOINT,
  BRAZE_SDK_ENDPOINT,
  BRAZE_SDK_API_KEY,
};
