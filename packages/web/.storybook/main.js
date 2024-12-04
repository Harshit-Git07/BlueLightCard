import 'dotenv/config';

import { existsSync } from 'fs';
import { resolve } from 'path';

const BRAND = process.env.NEXT_PUBLIC_APP_BRAND ?? 'blc-uk';

const brandAssetFolder = resolve(__dirname, `../assets/brands/${BRAND}`);

module.exports = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-docs',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/preset-scss',
    '@storybook/addon-a11y',
    '@storybook/addon-mdx-gfm',
    '@storybook/addon-designs',
    'storybook-addon-fetch-mock',
  ],
  staticDirs: [
    {
      from: '../../shared-ui/fonts',
      to: '/fonts',
    },
    {
      from: '../assets',
      to: '/assets',
    },
  ],
  webpackFinal: async (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      stream: false,
      zlib: false,
    };
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'));
    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: /url/ }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      }
    );
    fileLoaderRule.exclude = /\.svg$/i;
    config.resolve.alias = {
      '@assets': resolve(__dirname, '../assets/'),
      '@brandasset': !existsSync(brandAssetFolder)
        ? resolve(__dirname, '../assets')
        : brandAssetFolder,
      '@/components': resolve(__dirname, '../src/common/components'),
      '@/components/offers': resolve(__dirname, '../src/offers/components'),
      '@/hooks': resolve(__dirname, '../src/common/hooks'),
      '@/utils': resolve(__dirname, '../src/common/utils'),
      '@/types': resolve(__dirname, '../src/common/types'),
      '@bluelightcard/shared-ui/storybook-config': resolve(__dirname, '../../shared-ui/.storybook'),
    };
    return config;
  },
  docs: {
    autodocs: true,
  },
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
};
