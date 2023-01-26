module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'plugin:react/recommended',
    'next/core-web-vitals',
  ],
  overrides: [
  ],
  parserOptions: {
    project: 'tsconfig.json'
  },
  rules: {
  }
}