import StyleDictionaryPackage from 'style-dictionary';
import path from 'path';
import chroma from 'chroma-js';
import { ChromaModifyAttrs, TransformedTokensResponse } from './types';
import flattenTokens from './flattenTokens';

/**
 * Transforms colors into hex values using color modifiers
 * @example { "modify": [{
 *  "type": "alpha",
 *  "amount": 0.7
 * }] }
 */
const registerColorPropertiesTransform = () => {
  StyleDictionaryPackage.registerTransform({
    type: 'value',
    name: 'colorPropertiesTransform',
    transitive: true,
    matcher: (token) => token.attributes?.category === 'color' && token.modify,
    transformer: (token) => {
      const { value, modify = [] } = token as ChromaModifyAttrs;
      let color: any = chroma(value);

      modify.forEach(({ type, amount }) => {
        if (color[type]) {
          color = color[type](amount);
        }
      });

      return color.hex();
    },
  });
};

/**
 * Builds the tokens and transforms them so that tailwindcss can use the tokens
 * @param brands - List of brands to source tokens from
 * @returns {Object}
 */
export const buildTokens = (brands: string[]): TransformedTokensResponse => {
  // Use current directory for actual build as Next changes the __dirname but Storybook Composed still needs it
  const packageRoot = !process.env.STORYBOOK_ENV ? process.cwd() : path.resolve(__dirname, '../');
  const baseTokens = `${packageRoot}/tokens/**/*.json`;
  const brandedTokens = brands.map((brand) => `${packageRoot}/brands/${brand}/tokens/**/*.json`);

  registerColorPropertiesTransform();

  const StyleDictionary = StyleDictionaryPackage.extend({
    source: [baseTokens].concat(...brandedTokens),
    transform: {
      'color/css': Object.assign({}, StyleDictionaryPackage.transform['color/css'], {
        transitive: true,
      }),
    },
    platforms: {
      js: {
        transformGroup: 'js',
        transforms: ['attribute/cti', 'color/css', 'colorPropertiesTransform'],
      },
    },
  });

  const tokens = StyleDictionary.exportPlatform('js');
  const themeTokens = flattenTokens(tokens);

  return themeTokens;
};
