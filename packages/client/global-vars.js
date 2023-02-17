const BRAND = process.env.NEXT_APP_BRAND ?? 'fallback';
const REGION = process.env.NEXT_APP_REGION ?? 'uk';
const DEFAULT_LANG = process.env.NEXT_APP_LANG ?? 'en';

module.exports = {
  BRAND,
  REGION,
  DEFAULT_LANG,
};
