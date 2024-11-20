const { exclude } = require('tsafe');

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'next',
    'plugin:react/recommended',
    'next/core-web-vitals',
    'prettier',
    'plugin:storybook/recommended',
  ],
  root: true,
  plugins: ['prettier'],
  overrides: [],
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['application/braze/__tests__/*', 'application/repositories/__tests__/*'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        printWidth: 100,
      },
    ],
  },
};
