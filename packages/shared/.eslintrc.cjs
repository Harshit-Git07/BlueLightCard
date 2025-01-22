module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
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
  ignorePatterns: ['.eslintrc.cjs'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 2021,
  },
};
