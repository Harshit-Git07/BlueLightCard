import { StorybookConfig } from '@storybook/nextjs';
import { DefinePlugin } from 'webpack';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  staticDirs: [
    '../public',
    {
      from: '../fonts',
      to: '/fonts',
    },
    {
      from: './mocks',
      to: '/mocks',
    },
  ],
  webpack(config) {
    if (!config.plugins) {
      config.plugins = [];
    }
    config.plugins.push(
      new DefinePlugin({
        'process.env.STORYBOOK_FLAG_NEW_TOKENS': process.env.STORYBOOK_FLAG_NEW_TOKENS,
      }),
    );
    return config;
  },
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};
export default config;
