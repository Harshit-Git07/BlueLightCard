module.exports = {
  extends: [
    'prettier',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
  ],
  plugins: ['prettier', '@typescript-eslint', 'jest'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        printWidth: 100,
      },
    ],
    '@typescript-eslint/no-misused-promises': 'error',
    'no-return-await': 'off',
    '@typescript-eslint/return-await': ['error', 'always'],
    eqeqeq: ['error', 'smart'],
    'jest/prefer-to-be': 'off', // This rule is just for grammar purposes, doesn't actually improve performance. Not fussed with it being slightly wrong
  },
  root: true,
  overrides: [],
  ignorePatterns: [
    'application/braze/__tests__/*',
    'application/repositories/__tests__/*',
    'libs/emailTemplates',
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
};
