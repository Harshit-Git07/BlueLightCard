import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../**/*.mdx', '../**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    '@storybook/addon-designs',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-mdx-gfm',
  ],
  staticDirs: [
    {
      from: '../fonts',
      to: '/fonts',
    },
    {
      from: './mocks',
      to: '/mocks',
    },
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  webpackFinal: async (config) => {
    // Exclude .svg files from the default file loader
    const fileLoaderRule = config.module?.rules?.find(
      (rule) => rule.test && rule.test.test('.svg'),
    );
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/;
    }

    // Add the @svgr/webpack loader for SVGs
    config.module?.rules?.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};
export default config;
