module.exports = {
  extends: ['plugin:react/recommended', 'prettier'],
  plugins: ['prettier'],
  root: true,
  rules: {
    'prettier/prettier': [
      'error',
      {
        printWidth: 100,
      },
    ],
  },
  ignorePatterns: [
    'application/braze/__tests__/*',
    'application/repositories/__tests__/*',
    'libs/emailTemplates',
  ],
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  env: {
    node: true,
  },
};
