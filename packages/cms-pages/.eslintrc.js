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
    'plugin:storybook/recommended',
  ],
  root: true,
  overrides: [],
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
