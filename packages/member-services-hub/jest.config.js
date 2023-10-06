const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
  testPathIgnorePatterns: ['./e2e', 'e2e'],
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
});

const customJestConfig = {
  moduleNameMapper: {
    '^@/global-vars': '<rootDir>/global-vars.js',
    '^@/components/(.*)$': '<rootDir>/src/app/member-services-hub/components/$1',
    '^@/pages/(.*)$': '<rootDir>/src/app/pages/$1',
    '^@/utils/(.*)$': '<rootDir>/src/app/utils/$1',
    // '^@/types/(.*)$': '<rootDir>/src/common/types/$1',
    '^.+\\.(svg)$': '<rootDir>/src/__mocks__/SvgrMock.js',
  },
  testEnvironment: 'jest-environment-jsdom',
};

module.exports = createJestConfig(customJestConfig);
