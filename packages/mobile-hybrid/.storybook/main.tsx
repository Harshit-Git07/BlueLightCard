import 'dotenv/config';
import { StorybookConfig } from '@storybook/nextjs';
import { resolve } from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-mdx-gfm',
    '@storybook/addon-designs',
  ],
  staticDirs: [
    '../public',
    {
      from: '../../shared-ui/fonts',
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
  docs: {
    autodocs: 'tag',
  },
  webpackFinal: async (config) => {
    if (!config.resolve) return config;

    config.resolve.alias = {
      '@bluelightcard/shared-ui/storybook-config': resolve(__dirname, '../../shared-ui/.storybook'),
    };
    return config;
  },
};
export default config;
