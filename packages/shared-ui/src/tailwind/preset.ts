import StyleDictionary from 'style-dictionary';
import { registerTransforms, transforms } from '@tokens-studio/sd-transforms';
import { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import baseConfig from './baseConfig';
import { BrandToken, PresetOptions } from './types';
import { getTokenSourcePaths, tsTypographyTransformer } from './utils/tokens';
import { fontCSSPlugin, tailwindCSSTransform } from './utils/tailwind';
import { EnvSchemaType } from '../env/types';

// token studio transforms to register in style dictionary
const tsTransforms = ['ts/color/modifiers', 'ts/resolveMath', 'ts/size/px'];

registerTransforms(StyleDictionary);

/**
 * Resolves values in typography tokens that are objects
 */
StyleDictionary.registerTransform({
  type: 'value',
  name: 'ts/typography',
  transitive: true,
  matcher: (token) => token.type === 'typography' && typeof token.value === 'object',
  transformer: tsTypographyTransformer,
});

StyleDictionary.registerTransformGroup({
  name: 'custom/tokens-studio',
  transforms: [
    ...transforms.filter((transform) => tsTransforms.includes(transform)),
    'ts/typography',
  ],
});

/**
 * Returns the design tokens, transformed and compiled from the json files
 * @param globalBrand
 * @returns
 */
export function getDesignTokens(globalBrand: EnvSchemaType['APP_BRAND']) {
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
  return tailwindCSSTransform(styleDictionary.exportPlatform('typescript'));
}

/**
 * Injects brand tokens
 * @param brand global brand name
 */
export function createBrandedPreset(
  globalBrand: EnvSchemaType['APP_BRAND'],
  options?: PresetOptions,
) {
  const baseTailwindConfig = baseConfig as typeof baseConfig & Pick<Config, 'darkMode' | 'plugins'>;
  const { themeTokens, fonts } = getDesignTokens(globalBrand);

  // inject brand tokens for colors
  baseTailwindConfig.theme.extend.colors = themeTokens.color;

  // inject brand tokens for typography
  baseTailwindConfig.theme.extend.fontFamily = themeTokens.fontFamily;
  baseTailwindConfig.theme.extend.fontSize = themeTokens.fontSize;
  baseTailwindConfig.theme.extend.fontWeight = themeTokens.fontWeight;
  baseTailwindConfig.theme.extend.lineHeight = themeTokens.lineHeight;
  baseTailwindConfig.theme.extend.letterSpacing = themeTokens.letterSpacing;

  // inject animations for MagicButton component
  baseTailwindConfig.theme.extend.animation = {
    magicButtonGradient: 'magicButtonGradient 3s linear infinite',
  };
  baseTailwindConfig.theme.extend.keyframes = {
    magicButtonGradient: {
      '0%, 100%': { 'background-position': '0% 0%' },
      '50%': { 'background-position': '75% 0%' },
    },
  };

  // inject brand tokens for typography
  baseTailwindConfig.plugins = [plugin((api) => fontCSSPlugin(fonts, api))];

  if (options?.darkModeManual) {
    baseTailwindConfig.darkMode = 'selector';
  }

  return baseTailwindConfig;
}
