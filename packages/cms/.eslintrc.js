module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['next', 'plugin:react/recommended', 'next/core-web-vitals', 'prettier'],
  settings: {
    next: {
      rootDir: 'packages/cms/',
    },
  },
  root: true,
  plugins: ['prettier'],
  overrides: [],
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        printWidth: 100,
      },
    ],
  },
};
