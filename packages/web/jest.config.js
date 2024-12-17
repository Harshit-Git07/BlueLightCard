const { pathsToModuleNameMapper } = require('ts-jest');
const tsconfig = require('./tsconfig.json');
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
  testPathIgnorePatterns: ['./e2e', 'e2e'],
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  transformIgnorePatterns: ['/node_modules/(?!swiper|ssr-window|dom7)'],
});

const customJestConfig = {
  setupFiles: ['<rootDir>/test-setup.ts'],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths, { prefix: '<rootDir>/' }),
    '^src/(.*)$': '<rootDir>/src/$1',
    '^.+\\.(svg)$': '<rootDir>/src/__mocks__/SvgrMock.js',
    '\\.(scss|sass|css)$': 'identity-obj-proxy',
    '^uuid$': require.resolve('uuid'),
  },
  transform: {
    '^.+\\.css$': 'jest-transform-css',
  },
  testEnvironment: 'jest-environment-jsdom',
};

module.exports = async () => ({
  ...(await createJestConfig(customJestConfig)()),
  transformIgnorePatterns: ['node_modules/(?!(swiper|ssr-window|dom7)/)'],
});
