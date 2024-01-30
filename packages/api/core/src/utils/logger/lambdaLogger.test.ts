import { mocked } from 'jest-mock';
import { Logger } from '@aws-lambda-powertools/logger';
import { LambdaLogger } from './lambdaLogger';
import { as } from '../testing';

// Mocking the LambdaLogger
jest.mock('@aws-lambda-powertools/logger', () => {
  return {
    Logger: jest.fn(),
  };
});

describe('LambdaLogger', () => {
  const mockTimestamp = '2023-01-01T00:00:00.000Z';

  function getMockLogger() {
    return mocked(as<Logger>({
      info: jest.fn(),
      debug: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    }));
  }

  function mockLoggerOnce() {
    const mockLogger = getMockLogger();
    mocked(Logger).mockReturnValueOnce(mockLogger);
    return mockLogger;
  }

  describe('info method', () => {
    it('should log info level messages', () => {
      // Arrange
      const mockedLogger = mockLoggerOnce()
      const logger = new LambdaLogger({ serviceName: 'testService' });

      // Act
      logger.info({ message: 'Test Info', timestamp: mockTimestamp });

      // Assert
      expect(mockedLogger.info).toHaveBeenCalledWith(
        '{"message":"Test Info","timestamp":"2023-01-01T00:00:00.000Z"}',
      );
    });
  });

  describe('debug method', () => {
    it('should log debug level messages', () => {
      // Arrange
      const mockedLogger = mockLoggerOnce()
      const logger = new LambdaLogger({ serviceName: 'testService' });

      // Act
      logger.debug({ message: 'Test Debug', timestamp: mockTimestamp });

      // Assert
      expect(mockedLogger.debug).toHaveBeenCalledWith(
        '{"message":"Test Debug","timestamp":"2023-01-01T00:00:00.000Z"}',
      );
    });
  });

  describe('warn method', () => {
    it('should log warn level messages', () => {
      // Arrange
      const mockedLogger = mockLoggerOnce()
      const logger = new LambdaLogger({ serviceName: 'testService' });

      // Act
      logger.warn({ message: 'Test Warn', timestamp: mockTimestamp });

      // Assert
      expect(mockedLogger.warn).toHaveBeenCalledWith(
        '{"message":"Test Warn","timestamp":"2023-01-01T00:00:00.000Z"}',
      );
    });
  });

  describe('error method', () => {
    it('should log error level messages', () => {
      // Arrange
      const mockedLogger = mockLoggerOnce()
      const logger = new LambdaLogger({ serviceName: 'testService' });

      // Act
      logger.error({ message: 'Test Error', timestamp: mockTimestamp });

      // Assert
      expect(mockedLogger.error).toHaveBeenCalledWith(
        '{"message":"Test Error","timestamp":"2023-01-01T00:00:00.000Z"}',
      );
    });
  });

});
