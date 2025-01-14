import nextJest from 'next/jest';
import storybookConfig from './.storybook/main';

const envVars = (storybookConfig.env as Function)();

/**
 * Load mock env vars from storybook before next config is loaded.
 * This is needed due to the sanity client being initialised in the next config, which requires some env vars to be set
 */
for (const env in envVars) {
  process.env[env] = envVars[env];
}

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    '<rootDir>/src/(?!e2e)*/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/(?!e2e)*/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],
  testPathIgnorePatterns: ['./e2e', 'e2e'],
};

export default createJestConfig(customJestConfig);
