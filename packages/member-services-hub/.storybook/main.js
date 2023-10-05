const { resolve } = require('path');

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
      '@': resolve(__dirname, '../src/'),
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
