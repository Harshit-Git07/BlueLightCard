/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
    '\\.(scss|sass|css)$': 'identity-obj-proxy',
    '^tokens/(.*)$': '<rootDir>/tokens/$1',
    '\\.svg$': '<rootDir>/src/__mocks__/svgMock.js', // Mock SVG imports
  },
  testMatch: ['**/__tests__/**/*.(spec|test).[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: ['dist'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

export default config;
