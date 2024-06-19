const path = require('path');

module.exports = {
  mode: 'production',
  target: 'node',
  entry: './worker.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig-build.json',
            },
          },
        ],
        exclude: /node_modules/,
        include: path.resolve(__dirname, './worker.ts'),
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'worker.js',
    path: path.resolve(__dirname, './'),
  },
  optimization: {
    minimize: false,
  },
  performance: {
    hints: false,
  },
};
