const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new Dotenv({
      path: './.env.prod',
      safe: true,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve('src/manifest.json'),
          to: path.resolve('dist'),
          transform(content) {
            const manifest = JSON.parse(content.toString('utf8'));
            manifest.version = process.env.npm_package_version;
            return JSON.stringify(manifest, null, 2);
          },
        },
      ],
    }),
  ],
});
