/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
    '\\.(scss|sass|css)$': 'identity-obj-proxy',
  },
  testPathIgnorePatterns: ['.rollup.cache', 'dist'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

export default config;
