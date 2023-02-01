const {
  BRAND,
  DEFAULT_LANG,
} = require("./global-vars");

/** @type {import('next-i18next').UserConfig} */
const nexti18nextConfig = {
  i18n: {
    defaultLocale: DEFAULT_LANG,
    locales: ["en"],
  },
  fallbackLng: {
    default: [DEFAULT_LANG]
  },
  localePath: `./brands/${BRAND}/locales`,
  localeStructure: "{{lng}}/{{ns}}"
}

module.exports = nexti18nextConfig;