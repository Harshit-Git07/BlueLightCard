import { DesignTokens, TransformedToken, TransformedTokens } from 'style-dictionary';
import { TokenGroupTypes } from '../types';

/**
 * Transforms the tokens to a format that tailwind can consume
 *
 * This works with the token structure:
 * primary: {
 *  light: {
 *    type: 'color',
 *    value: '',
 *    path: []
 *  },
 *  dark: {...}
 * }
 * @param tokens
 * @returns
 */
export function tailwindCSSTransform(tokens: TransformedTokens) {
  const tokenGroup: Record<TokenGroupTypes, DesignTokens> = {
    color: {},
    fontSizes: {},
  };

  function applyTokenToGroup(token: TransformedToken) {
    const tokenType = token.type as TokenGroupTypes;

    if (!tokenGroup[tokenType]) {
      tokenGroup[tokenType] = {};
    }

    let tokenName = token.path.shift();
    let group = tokenGroup[tokenType];

    while (tokenName) {
      if (tokenName === token.name) {
        group[tokenName] = token.value;

        if (token.name === 'light') {
          group.DEFAULT = token.value;
        }
      } else if (!group[tokenName]) {
        group[tokenName] = {};
      }
      group = group[tokenName];
      tokenName = token.path.shift();
    }
  }

  function transform(tokens: TransformedTokens) {
    for (const tokenName in tokens) {
      const token = tokens[tokenName];

      const isTokenProperties = Object.hasOwn(token, 'type') && Object.hasOwn(token, 'value');

      if (isTokenProperties) {
        applyTokenToGroup(token as TransformedToken);
      } else if (typeof token === 'object' && !Array.isArray(token)) {
        transform(token);
      }
    }
  }

  transform(tokens);

  return tokenGroup;
}
