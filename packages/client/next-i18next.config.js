const { BRAND, LANGUAGE, FALLBACK_LNG } = require('./global-vars');

/** @type {import('next-i18next').UserConfig} */
const nexti18nextConfig = {
  i18n: {
    defaultLocale: LANGUAGE,
    locales: [LANGUAGE],
  },
  fallbackLng: {
    default: [FALLBACK_LNG],
  },
  localePath: `./brands/${BRAND}/locales`,
  localeStructure: '{{lng}}/{{ns}}',
};

module.exports = nexti18nextConfig;
