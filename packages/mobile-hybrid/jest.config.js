const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
  testPathIgnorePatterns: ['./e2e', 'e2e'],
});

const customJestConfig = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/data/(.*)$': '<rootDir>/data/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/src/pages/'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    '<rootDir>/src/(?!e2e)*/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/(?!e2e)*/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],
};

module.exports = createJestConfig(customJestConfig);
