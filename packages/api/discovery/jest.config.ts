import { type JestConfigWithTsJest, pathsToModuleNameMapper } from 'ts-jest';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tsConfig = require('./tsconfig.json');

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/', '<rootDir>/e2e/'],
  moduleNameMapper: pathsToModuleNameMapper(tsConfig.compilerOptions.paths, { prefix: '<rootDir>/' }),
};

export default jestConfig;
