const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
  testPathIgnorePatterns: ['./e2e', 'e2e'],
});

const customJestConfig = {
  moduleNameMapper: {
    '^@/global-vars': '<rootDir>/global-vars.js',
    '^@/components/(.*)$': '<rootDir>/src/common/components/$1',
    '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/common/hooks/$1',
    '^@/utils/(.*)$': '<rootDir>/src/common/utils/$1',
    '^@/types/(.*)$': '<rootDir>/src/common/types/$1',
    '^@/data/(.*)$': '<rootDir>/data/$1',
    'src/services/EligibilityApi': '<rootDir>/src/services/EligibilityApi',
    '^.+\\.(svg)$': '<rootDir>/src/__mocks__/SvgrMock.js',
  },
  testPathIgnorePatterns: ['<rootDir>/src/pages/'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    '<rootDir>/src/(?!e2e)*/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/(?!e2e)*/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],
};

module.exports = createJestConfig(customJestConfig);
