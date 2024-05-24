import { readFileSync } from 'fs';
import { join } from 'path';
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

  const theme = themes.find((theme) => theme.group === brand.toUpperCase());

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
      const isTheme = !!themes.find((theme) => tokenSet.includes(theme.group));
      // check the token set is already in the sources array
      const existsInSources = !!sources.find((source) => source.includes(tokenSet));

      // if both are falsey push the token set into sources
      if (!isTheme && !existsInSources) {
        sources.push(join(TOKENS_ROOT_DIR, `${tokenSet}.json`));
      }
    });
  }

  return sources;
}
