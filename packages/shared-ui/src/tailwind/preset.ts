import StyleDictionary from 'style-dictionary';
import baseConfig from './baseConfig';
import { BrandToken, PresetOptions } from './types';
import { getTokenSourcePaths } from './utils/tokens';
import { tailwindCSSTransform } from './utils/tailwind';
import { registerTransforms, transforms } from '@tokens-studio/sd-transforms';
import { Config } from 'tailwindcss';

registerTransforms(StyleDictionary);

StyleDictionary.registerTransformGroup({
  name: 'custom/tokens-studio',
  transforms: transforms.filter((transform) => transform === 'ts/color/modifiers'),
});

/**
 * Injects brand tokens
 * @param brand brand token name
 */
export function createBrandedPreset(brand: BrandToken, options?: PresetOptions) {
  const baseTailwindConfig = baseConfig as typeof baseConfig & Pick<Config, 'darkMode'>;
  const sources = getTokenSourcePaths(brand);

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
