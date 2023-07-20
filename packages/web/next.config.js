const { resolve } = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { BRAND } = require('./global-vars');

const assetsFolder = `${__dirname}/assets`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  images: {
    loader: 'custom',
    loaderFile: './src/imageLoader.ts',
  },
  compiler: {
    styledComponents: true,
  },
  webpack: (config) => {
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
      ...config.resolve.alias,
      '@brandasset': resolve(__dirname, `./assets/brands/${BRAND}`),
    };
    config.plugins.push(
      new CopyPlugin({
        patterns: [{ from: assetsFolder, to: 'static/assets' }],
      })
    );
    return config;
  },
};

module.exports = nextConfig;
