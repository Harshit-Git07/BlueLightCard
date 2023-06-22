const CopyPlugin = require('copy-webpack-plugin');
const { BRAND } = require('./global-vars');
const { existsSync } = require('fs');

const brandsAssetsFolder = `${__dirname}/brands/${BRAND}/assets`;
const fallbackAssetsFolder = `${__dirname}/assets`;
const assetsFolder = existsSync(brandsAssetsFolder) ? brandsAssetsFolder : fallbackAssetsFolder;

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
    config.plugins.push(
      new CopyPlugin({
        patterns: [{ from: assetsFolder, to: 'static/assets' }],
      })
    );
    return config;
  },
};

module.exports = nextConfig;
