import StyleDictionary from 'style-dictionary';
import { registerTransforms, transforms } from '@tokens-studio/sd-transforms';
import { Config } from 'tailwindcss';
import baseConfig from './baseConfig';
import { BrandToken, PresetOptions } from './types';
import { getTokenSourcePaths } from './utils/tokens';
import { tailwindCSSTransform } from './utils/tailwind';
import { EnvSchemaType } from '../env/types';

registerTransforms(StyleDictionary);

StyleDictionary.registerTransformGroup({
  name: 'custom/tokens-studio',
  transforms: transforms.filter((transform) => transform === 'ts/color/modifiers'),
});

/**
 * Injects brand tokens
 * @param brand global brand name
 */
export function createBrandedPreset(
  globalBrand: EnvSchemaType['APP_BRAND'],
  options?: PresetOptions,
) {
  const baseTailwindConfig = baseConfig as typeof baseConfig & Pick<Config, 'darkMode'>;
  const toBrandToken = globalBrand.split('-')[0] as BrandToken;
  const sources = getTokenSourcePaths(toBrandToken);

  const styleDictionary = StyleDictionary.extend({
    source: sources,
    platforms: {
      typescript: {
        transformGroup: 'custom/tokens-studio',
      },
    },
  });
  const tokens = tailwindCSSTransform(styleDictionary.exportPlatform('typescript'));

  // inject brand tokens for colors
  baseTailwindConfig.theme.extend.colors = tokens.color;

  if (options?.darkModeManual) {
    baseTailwindConfig.darkMode = 'selector';
  }

  return baseTailwindConfig;
}
