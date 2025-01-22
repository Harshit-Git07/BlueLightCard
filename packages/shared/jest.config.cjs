const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  workerIdleMemoryLimit: '1024MB',
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  },
};
