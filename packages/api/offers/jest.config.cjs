const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig')

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  setupFiles: ['./jest.setup.js'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }
}
