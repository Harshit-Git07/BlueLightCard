const { BRAND, LANGUAGE } = require('./global-vars');

/** @type {import('next-i18next').UserConfig} */
const nexti18nextConfig = {
  i18n: {
    defaultLocale: LANGUAGE,
    locales: [LANGUAGE],
  },
  localePath: `./brands/${BRAND}/locales`,
  localeStructure: '{{lng}}/{{ns}}',
};

module.exports = nexti18nextConfig;
