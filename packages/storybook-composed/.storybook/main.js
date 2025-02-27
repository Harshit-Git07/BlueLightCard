import { join, dirname } from 'path';
import devConfig from '../src/config';
import webpack from 'webpack';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')));
}

/** @type { import('@storybook/nextjs').StorybookConfig } */
const config = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-webpack5-compiler-swc'),
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-interactions'),
    '@storybook/addon-designs',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-mdx-gfm',
  ],
  framework: {
    name: getAbsolutePath('@storybook/nextjs'),
    options: {},
  },
  refs: (_, { configType }) => {
    if (configType === 'DEVELOPMENT') {
      return devConfig.toRefs();
    }

    return {
      'web/blc-uk': {
        title: 'Web - BLC UK',
        url: 'https://web-storybook-d1x.pages.dev/blc-uk/',
        expanded: false,
      },
      'web/blc-au': {
        title: 'Web - BLC AU',
        url: 'https://web-storybook-d1x.pages.dev/blc-au/',
        expanded: false,
      },
      'web/dds-uk': {
        title: 'Web - DDS UK',
        url: 'https://web-storybook-d1x.pages.dev/dds-uk/',
        expanded: false,
      },
      'mobile-hybrid/blc-uk': {
        title: 'Mobile Hybrid - BLC UK',
        url: 'https://mobile-hybrid-storybook.pages.dev/blc-uk/',
        expanded: false,
      },
      'mobile-hybrid/blc-au': {
        title: 'Mobile Hybrid - BLC AU',
        url: 'https://mobile-hybrid-storybook.pages.dev/blc-au/',
        expanded: false,
      },
      'mobile-hybrid/dds-uk': {
        title: 'Mobile Hybrid - DDS UK',
        url: 'https://mobile-hybrid-storybook.pages.dev/dds-uk/',
        expanded: false,
      },
      'shared-ui/blc-uk': {
        title: 'Shared UI - BLC UK',
        url: 'https://shared-ui-storybook.pages.dev/blc-uk/',
        expanded: false,
      },
      'shared-ui/blc-au': {
        title: 'Shared UI - BLC AU',
        url: 'https://shared-ui-storybook.pages.dev/blc-au/',
        expanded: false,
      },
      'shared-ui/dds-uk': {
        title: 'Shared UI - DDS UK',
        url: 'https://shared-ui-storybook.pages.dev/dds-uk/',
        expanded: false,
      },
    };
  },
  webpack: (config) => {
    config.plugins.push(
      new webpack.ProvidePlugin({
        React: 'react',
      }),
    );
    return config;
  },
};
export default config;
