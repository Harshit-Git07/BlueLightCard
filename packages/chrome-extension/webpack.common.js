const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: {
    popup: path.resolve('./src/popup/popup.tsx'),
    contentScript: path.resolve('./src/contentScript/contentScript.ts'),
    background: path.resolve('./src/background/background.ts'),
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        use: ['style-loader', 'css-loader'],
        test: /\.css$/i,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve('src/assets/icon.png'),
          to: path.resolve('dist'),
        },
        {
          from: path.resolve('src/assets/BLC_Logo.png'),
          to: path.resolve('dist'),
        },
        {
          from: path.resolve('src/assets/fonts/MuseoSansRounded100.otf'),
          to: path.resolve('dist'),
        },
        {
          from: path.resolve('src/assets/fonts/MuseoSansRounded300.otf'),
          to: path.resolve('dist'),
        },
        {
          from: path.resolve('src/assets/fonts/MuseoSansRounded700.otf'),
          to: path.resolve('dist'),
        },
      ],
    }),
    ...getHtmlplugins(['popup']),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css'],
  },
  output: {
    filename: '[name].js',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};

function getHtmlplugins(chunks) {
  return chunks.map(
    (chunk) =>
      new HtmlPlugin({
        title: 'Blue Light Card',
        filename: `${chunk}.html`,
        chunks: [chunk],
      }),
  );
}
