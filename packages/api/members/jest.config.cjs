const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/e2e/'],
  testMatch: ['**/*.test.ts', '**/*.spec.ts'],
  workerIdleMemoryLimit: '1024MB',
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
    'sst/node/.*': '<rootDir>/__mocks__/sst.js',
    '@aws-lambda-powertools/logger': '<rootDir>/__mocks__/logger.js',
  },
};
