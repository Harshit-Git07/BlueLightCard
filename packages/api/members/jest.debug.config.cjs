const jestConfig = require('./jest.config.cjs');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...jestConfig,
  testMatch: ['**/*.debug-test.ts'],
};
