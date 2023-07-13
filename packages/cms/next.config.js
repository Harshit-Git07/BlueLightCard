const CopyPlugin = require('copy-webpack-plugin');

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
    config.plugins.push(
      new CopyPlugin({
        patterns: [{ from: assetsFolder, to: 'static/assets' }],
      })
    );
    return config;
  },
};

module.exports = nextConfig;
