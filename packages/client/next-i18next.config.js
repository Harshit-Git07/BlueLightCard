const BRAND = process.env.NEXT_APP_BRAND ?? "fallback";
const DEFAULT_LANG = process.env.NEXT_APP_LANG ?? "en";

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