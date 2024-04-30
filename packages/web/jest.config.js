const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
  testPathIgnorePatterns: ['./e2e', 'e2e'],
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  transformIgnorePatterns: ['/node_modules/(?!swiper|ssr-window|dom7)'],
});

const customJestConfig = {
  moduleNameMapper: {
    '^@/root/(.*)$': '<rootDir>/$1',
    '^@/global-vars': '<rootDir>/global-vars.js',
    '^@/globals/(.*)$': '<rootDir>/src/common/globals/$1',
    '^@/services/(.*)$': '<rootDir>/src/services/$1',
    '^@/components/(.*)$': '<rootDir>/src/common/components/$1',
    '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/common/hooks/$1',
    '^@/utils/(.*)$': '<rootDir>/src/common/utils/$1',
    '^@/types/(.*)$': '<rootDir>/src/common/types/$1',
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
