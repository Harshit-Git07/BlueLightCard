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
};
export default config;
