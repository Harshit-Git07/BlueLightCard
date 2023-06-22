const BRAND = process.env.NEXT_PUBLIC_APP_BRAND ?? 'default';
const REGION = process.env.NEXT_PUBLIC_APP_REGION ?? 'GB';
const DEFAULT_LANG = process.env.NEXT_PUBLIC_APP_LANG ?? 'en';
const FALLBACK_LNG = 'en';
const ASSET_PREFIX = !process.env.STORYBOOK_ENV ? '/_next/static/assets' : '';
const FEATURE_FLAG_ENVIRONMENT_ID = process.env.FEATURE_FLAG_ENVIRONMENT_ID ?? '';

/**
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
};
