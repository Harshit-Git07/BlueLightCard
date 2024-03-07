import { dirname, join } from "path";
const { resolve } = require('path');
import { BRAND } from '../global-vars';
module.exports = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-interactions"),
    getAbsolutePath("@storybook/preset-scss"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-mdx-gfm"),
  ],
  // staticDirs: [
  //   {
  //     from: '../assets',
  //     to: '/assets',
  //   },
  // ],
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
      // '@brandasset': resolve(__dirname, `../assets/brands/${BRAND}`),
      '@/components': resolve(__dirname, '../src/common/components'),
      // '@/components/offers': resolve(__dirname, '../src/offers/components'),
      '@/hooks': resolve(__dirname, '../src/common/hooks'),
      '@/utils': resolve(__dirname, '../src/common/utils'),
      '@/types': resolve(__dirname, '../src/common/types'),
      '@': resolve(__dirname, '../src/'),
    };
    return config;
  },
  docs: {
    autodocs: true,
  },
  framework: {
    name: getAbsolutePath("@storybook/nextjs"),
    options: {},
  },
};

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}
