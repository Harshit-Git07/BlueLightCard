import type { StorybookConfig } from '@storybook/nextjs';

import { join, dirname, resolve } from 'path';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-onboarding'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-interactions'),
  ],
  env: (env) => ({
    ...env,
    // mock environemnt variables
    NEXT_PUBLIC_SANITY_PROJECT_ID: '1234',
  }),
  staticDirs: [
    '../storybook-assets',
    '../public',
    {
      from: '../../shared-ui/fonts',
      to: '/fonts',
    },
  ],
  webpackFinal: async (config) => {
    if (!config.resolve) return config;

    config.resolve.alias = {
      '@bluelightcard/shared-ui/storybook-config': resolve(__dirname, '../../shared-ui/.storybook'),
    };
    return config;
  },
  framework: {
    name: getAbsolutePath('@storybook/nextjs'),
    options: {},
  },
};
export default config;
