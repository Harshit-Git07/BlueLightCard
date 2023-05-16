const { LANGUAGE, FALLBACK_LNG, BRANDS } = require('./global-vars');
const { readdirSync } = require('fs');
const { flattenDeep } = require('lodash');
const { uniq } = require('lodash');

const localesFolder = `${__dirname}/locales`;

// Builds a list of namespaces currently available in the ${localesFolder}
const namespaces = uniq(
  flattenDeep(
    readdirSync(localesFolder).map((lang) => readdirSync(`${localesFolder}/${lang}`))
  ).map((namespace) => namespace.replace('.json', ''))
);

/**
 * Filter down the namespaces to just fallbacks.
 *
 * Fallbacks are namespaces not prefixed with a brand key (name).
 */
const fallbackNamespaces = namespaces.filter(
  (namespace) => !BRANDS.find((b) => namespace.includes(`${b.split('_')[0].toLocaleLowerCase()}.`))
);

/** @type {import('next-i18next').UserConfig} */
const nexti18nextConfig = {
  i18n: {
    defaultLocale: LANGUAGE,
    locales: [LANGUAGE],
  },
  fallbackLng: {
    default: [FALLBACK_LNG],
  },
  // concat brand namespaces
  ns: namespaces,
  fallbackNS: fallbackNamespaces,
  localePath: './locales',
  localeStructure: '{{lng}}/{{ns}}',
};

module.exports = nexti18nextConfig;
