const StyleDictionaryPackage = require('style-dictionary');
const { cloneDeep } = require('lodash');
const plugin = require('tailwindcss/plugin');
const { fontFamily } = require('tailwindcss/defaultTheme');
const { BRAND } = require('./global-vars');

// Check if we are running in storybook env or nextjs env
const staticFolderPrefix = !process.env.STORYBOOK_ENV ? '/_next/static' : '';

const StyleDictionary = StyleDictionaryPackage.extend({
  source: [`${__dirname}/tokens/**/*.json`, `${__dirname}/brands/${BRAND}/tokens/**/*.json`],
  platforms: {
    js: {
      transformGroup: 'js',
    },
  },
});

/**
 * Restructure the object to assign 'key': { 'value': '' } to 'key': ''
 * @param {Object} tokens
 * @returns {Object}
 */
const restruct = (tokens) => {
  const copy = cloneDeep(tokens);
  const recursive = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'object' && !obj[key].value) {
        recursive(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key].value) {
        obj[key] = obj[key].value;
      }
    }
  };
  recursive(copy);
  return copy;
};

const tokens = StyleDictionary.exportPlatform('js');

const themeTokens = restruct(tokens);

/**
 * Adds the base styles to tailwindcss for adding font-faces
 * @param {Object} font
 * @param {Function} addBase
 */
const fontFaces = (font, addBase) => {
  Object.keys(font).forEach((fontKey) => {
    const fontConfig = font[fontKey];
    const fontFamily = fontConfig.name;
    fontConfig.styles &&
      Object.keys(fontConfig.styles).forEach((styleKey) => {
        const fontStyle = fontConfig.styles[styleKey];
        fontStyle &&
          addBase({
            '@font-face': {
              fontFamily,
              fontWeight: styleKey,
              src: `url(${staticFolderPrefix}/${fontStyle.base})`,
            },
          });
      });
  });
};

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: themeTokens.color,
    },
    minWidth: {
      btn: '120px',
    },
    screens: {
      mobile: '280px',
      tablet: '768px',
      laptop: '1024px',
      desktop: '1200px',
    },
    fontFamily: Object.keys(themeTokens.font.family).reduce((acc, familyKey) => {
      acc[familyKey] = [themeTokens.font.family[familyKey], ...(fontFamily[familyKey] || [])];
      return acc;
    }, {}),
  },
  plugins: [
    plugin(({ addBase }) => {
      fontFaces(themeTokens.asset.font, addBase);
    }),
  ],
};

// if we have size tokens, configure tailwindcss fontSize
if (themeTokens.size) {
  if (themeTokens.size.font) {
    config.theme.fontSize = themeTokens.size.font;
  }
}

module.exports = config;
