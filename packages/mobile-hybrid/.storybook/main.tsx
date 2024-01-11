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
    }
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};
export default config;
