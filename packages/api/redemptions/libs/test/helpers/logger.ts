import { ILogger } from '@blc-mono/core/utils/logger/logger';

/**
 * Creates a test logger which logs only errors and warnings. This should be used in tests to avoid
 * polluting the console with unnecessary logs.
 */
export function createTestLogger(): ILogger {
  return {
    debug: jest.fn(),
    error: jest.fn(console.error),
    info: jest.fn(),
    warn: jest.fn(console.warn),
  };
}

/**
 * Creates a test logger which logs nothing to the console. This should be used in tests to avoid
 * polluting the console with unnecessary logs.
 *
 * WARNING: This should only be used when you are expecting errors and warnings to be logged as part
 *          of the test. Otherwise, it may hide unexpected errors and warnings.
 */
export function createSilentLogger(): ILogger {
  return {
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  };
}
