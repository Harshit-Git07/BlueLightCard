import { readFileSync } from 'fs';
import { join } from 'path';
import { TransformedToken } from 'style-dictionary';
import { checkAndEvaluateMath, transformLetterSpacingForCSS } from '@tokens-studio/sd-transforms';
import { BrandToken, TokenStudioMetadata, TokenStudioTheme } from '../types';
import { TOKENS_ROOT_DIR } from '../../constants';

/**
 * Parse $themes.json and $metadata content and extracts the source paths to the tokens
 * @param {BrandToken} brand
 */
export function getTokenSourcePaths(brand: BrandToken) {
  const themes = JSON.parse(
    readFileSync(join(TOKENS_ROOT_DIR, '$themes.json')).toString(),
  ) as TokenStudioTheme[];

  const metadata = JSON.parse(
    readFileSync(join(TOKENS_ROOT_DIR, '$metadata.json')).toString(),
  ) as TokenStudioMetadata;

  const theme = themes.find(
    (theme) => theme.group === brand.toUpperCase() || theme.name === brand.toUpperCase(),
  );

  const sources: string[] = [];

  if (theme) {
    for (const tokenSet in theme.selectedTokenSets) {
      if (!sources.includes(tokenSet) && theme.selectedTokenSets[tokenSet] !== 'disabled') {
        sources.push(join(TOKENS_ROOT_DIR, `${tokenSet}.json`));
      }
    }
  }

  if (metadata?.tokenSetOrder) {
    metadata.tokenSetOrder.forEach((tokenSet) => {
      // check if token set is a theme
      const isTheme = !!themes.find(
        (theme) => (theme.group && tokenSet.includes(theme.group)) || tokenSet.includes(theme.name),
      );
      // check the token set is already in the sources array
      const existsInSources = !!sources.find((source) => source.includes(tokenSet));

      const isEnabled = theme?.selectedTokenSets[tokenSet] !== 'disabled';

      // if both are falsey push the token set into sources
      if (!isTheme && !existsInSources && isEnabled) {
        sources.push(join(TOKENS_ROOT_DIR, `${tokenSet}.json`));
      }
    });
  }

  return sources;
}

/**
 * Custom typography token transformer for transforming typography subset tokens e.g font size px -> ems etc
 * @param token
 * @returns
 */
export function tsTypographyTransformer(token: TransformedToken) {
  const transformed: Record<string, string> = {};

  for (const tokenValueKey in token.value) {
    transformed[tokenValueKey] = String(checkAndEvaluateMath(token.value[tokenValueKey]));

    switch (tokenValueKey) {
      case 'letterSpacing':
        transformed[tokenValueKey] = String(
          transformLetterSpacingForCSS(token.value[tokenValueKey]),
        );
        break;
      case 'fontSize': {
        const tokenValue = String(transformed[tokenValueKey]);

        // check to see if any aliases have been converted to rem's, if so we can skip the conversion for this token
        if (tokenValue.endsWith('rem')) {
          break;
        }

        const convert = (value: number) => `${(value / 16).toFixed(2)}rem`;

        transformed[tokenValueKey] = tokenValue.endsWith('px')
          ? convert(Number(tokenValue.slice(0, -2)))
          : convert(Number(tokenValue));
        break;
      }
    }
  }
  return transformed;
}
