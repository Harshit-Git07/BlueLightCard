import { ILogger } from '@blc-mono/core/src/utils/logger/logger';

export function createTestLogger(): ILogger {
  return {
    debug: jest.fn(),
    error: jest.fn(console.error),
    info: jest.fn(),
    warn: jest.fn(console.warn),
  };
}

export function createSilentLogger(): ILogger {
  return {
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  };
}
