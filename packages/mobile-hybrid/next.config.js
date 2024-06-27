const CopyPlugin = require('copy-webpack-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    swcPlugins: [['@swc-jotai/react-refresh', {}]],
  },
  webpack: (config) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [{ from: '../shared-ui/fonts', to: 'static/fonts' }],
      }),
    );
    return config;
  },
  transpilePackages: ['@bluelightcard/shared-ui'],
};

module.exports = nextConfig;
