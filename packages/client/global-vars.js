const BRAND = process.env.NEXT_APP_BRAND ?? 'fallback';
const REGION = process.env.NEXT_APP_REGION ?? 'GB';
const DEFAULT_LANG = process.env.NEXT_APP_LANG ?? 'en';
const FALLBACK_LNG = 'en';

/**
 * Language is made up of the lng and region
 * Example: [lng]-[region]
 */
const LANGUAGE = `${DEFAULT_LANG}-${REGION}`;

module.exports = {
  BRAND,
  REGION,
  DEFAULT_LANG,
  FALLBACK_LNG,
  LANGUAGE,
};
