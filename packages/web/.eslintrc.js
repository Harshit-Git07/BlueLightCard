module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'next',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'next/core-web-vitals',
    'prettier',
  ],
  root: true,
  plugins: ['prettier', '@typescript-eslint', 'react'],
  overrides: [],
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off', // This rule was added after quite a lot of usage of `any`. Realistically this should be turned on
    '@typescript-eslint/no-var-requires': 'off', // This allows us to use require() inline on tests for different brands
    'prettier/prettier': [
      'error',
      {
        printWidth: 100,
      },
    ],
  },
};
