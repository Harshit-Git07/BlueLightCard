/* eslint-disable no-case-declarations */
import { DesignTokens, TransformedToken, TransformedTokens } from 'style-dictionary';
import {
  SyntheticDesignToken,
  SyntheticDesignTokenSet,
  ThemeTokens,
  TokenFontData,
} from '../types';
import { PluginAPI } from 'tailwindcss/types/config';
import { IS_STORYBOOK_LIFECYCLE } from '../../constants';
import { FontWeightKey, getFontWeight } from './fontMap';

function transformColorToken(token: SyntheticDesignToken, group: DesignTokens) {
  const transformed = group;

  transformed[token.name] = token.value;

  if (token.name === 'light') {
    transformed.DEFAULT = token.value;
  }

  return transformed;
}

/**
 * Traverses the token path to help regroup under tailwind specific token types
 * @param token
 * @param group
 */
function traverseTokenPath(token: SyntheticDesignToken, group: DesignTokens) {
  const tokenType = token.type;
  // deep clone path array, as it needs to be mutated
  const tokenPath = JSON.parse(JSON.stringify(token.path)) as string[];

  if (!group[tokenType]) {
    group[tokenType] = {};
  }

  // certain token types need to be handled differently than others
  switch (tokenType) {
    case 'fontFamily':
    case 'fontSize':
    case 'lineHeight':
    case 'letterSpacing':
      group[tokenType][tokenPath.join('-')] = token.value;
      break;
    case 'fontWeight': {
      // font weight name mapping i.e https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-weight#common_weight_name_mapping
      const fontWeightName = String(token.value).replace('-', ' ') as FontWeightKey;
      group[tokenType][`${tokenPath.join('-')}-weight`] = getFontWeight(fontWeightName);
      break;
    }
    case 'color': {
      let tokenName = tokenPath.shift();
      let cursor = group[tokenType];

      while (tokenName) {
        if (tokenName === token.name) {
          // once we get to the value level, transform colour into tailwind structure
          cursor = transformColorToken(token, cursor);
        } else if (!cursor[tokenName]) {
          cursor[tokenName] = {};
        }

        // move the cursor on
        cursor = cursor[tokenName];
        tokenName = tokenPath.shift();
      }
      break;
    }
  }
}

/**
 * Creates a synthetic token to help manage typography subset tokens i.e fontFamily, fontSize etc
 * Example:
 *  {
 *    name: "",
 *    type: "fontFamily",
 *    _synthetic: {
 *      parentType: "typography"
 *    },
 *    value: "",
 *    path: []
 *  }
 * @param token
 * @returns
 */
function createSyntheticToken(token: TransformedToken) {
  const syntheticTokenSet: SyntheticDesignTokenSet = {};
  const tokenValueMap = token.value as Record<string, any>;

  // loop over typography subset tokens i.e fontFamily, fontSize etc
  for (const valueKey in tokenValueMap) {
    const value = tokenValueMap[valueKey];
    syntheticTokenSet[`${token.name}_${valueKey}`] = {
      name: token.name,
      type: valueKey,
      _synthetic: {
        parentType: token.type,
      },
      value,
      path: token.path,
    } as SyntheticDesignToken;
  }

  return syntheticTokenSet;
}

/**
 * Transforms the tokens to a format that tailwind can consume
 * @param tokens
 * @returns
 */
export function tailwindCSSTransform(tokens: TransformedTokens) {
  const themeTokens: ThemeTokens = {
    color: {},
    fontFamily: {},
    fontSize: {},
    fontWeight: {},
    lineHeight: {},
    letterSpacing: {},
  };

  const fonts: TokenFontData[] = [];

  // walk the token set
  (function walker(tokens: DesignTokens) {
    for (const tokenName in tokens) {
      const token = tokens[tokenName];

      // we have reached the token value
      const isTokenProperties = Object.hasOwn(token, 'type') && Object.hasOwn(token, 'value');

      if (isTokenProperties) {
        // we need to store font families and export them for font loading purposes
        if (token.type === 'typography') {
          const tokenFont = token.value as Record<string, any>;
          const font = fonts.find((font) => font.fontFamily === tokenFont.fontFamily);

          if (!font) {
            fonts.push({ fontFamily: tokenFont.fontFamily, weights: [tokenFont.fontWeight] });
          } else if (!font.weights.includes(tokenFont.fontWeight)) {
            font.weights.push(tokenFont.fontWeight);
          }
        }

        if (typeof token.value !== 'object') {
          traverseTokenPath(token as SyntheticDesignToken, themeTokens);
        } else {
          walker(createSyntheticToken(token as TransformedToken));
        }
      } else {
        walker(token as DesignTokens);
      }
    }
  })(tokens);

  return { themeTokens, fonts };
}

export function fontCSSPlugin(fonts: TokenFontData[], { addBase }: PluginAPI) {
  fonts.forEach((font) => {
    font.weights.forEach((fontWeightRawName) => {
      const fontWeight = String(fontWeightRawName).replace('-', ' ') as FontWeightKey;
      const fontWeightName = String(getFontWeight(fontWeight));
      const fontName = `${font.fontFamily}/${fontWeightRawName.toLowerCase()}.otf`;
      const fontPath = `${!IS_STORYBOOK_LIFECYCLE ? '/_next/static' : ''}/fonts`;

      addBase({
        '@font-face': {
          fontFamily: font.fontFamily,
          fontWeight: fontWeightName,
          src: `local("${font.fontFamily}-${fontWeightRawName}"), url("${fontPath}/${fontName}")`,
        },
      });
    });
  });
}
