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
    '^@/components/(.*)$': '<rootDir>/src/common/components/$1',
    '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/common/hooks/$1',
    '^@/utils/(.*)$': '<rootDir>/src/common/utils/$1',
    '^@/types/(.*)$': '<rootDir>/src/common/types/$1',
    'src/services/EligibilityApi': '<rootDir>/src/services/EligibilityApi',
    '^.+\\.(svg)$': '<rootDir>/src/__mocks__/SvgrMock.js',
  },
  testEnvironment: 'jest-environment-jsdom',
};

module.exports = createJestConfig(customJestConfig);
