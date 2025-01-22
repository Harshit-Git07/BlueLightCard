const { pathsToModuleNameMapper } = require('ts-jest');
const tsconfig = require('./tsconfig.json');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths, { prefix: '<rootDir>/' }),
    '^src/(.*)$': '<rootDir>/src/$1',
    '\\.(scss|sass|css)$': 'identity-obj-proxy',
    '^tokens/(.*)$': '<rootDir>/tokens/$1',
    '\\.svg$': '<rootDir>/src/__mocks__/svgMock.js', // Mock SVG imports
  },
  testMatch: ['**/__tests__/**/*.(spec|test).[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: ['dist'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
