import { Logger, LogLevels } from './logger';
import { Logger as LambdaLogger } from '@aws-lambda-powertools/logger';

// Mocking the LambdaLogger
jest.mock('@aws-lambda-powertools/logger', () => {
  return {
    Logger: jest.fn().mockImplementation(() => ({
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    })),
  };
});

describe('Logger', () => {
  let logger: Logger;
  const mockTimestamp = '2023-01-01T00:00:00.000Z';

  beforeEach(() => {
    logger = new Logger();
  });

  describe('init method', () => {
    it('should initialize the LambdaLogger correctly', () => {
      logger.init({ serviceName: 'testService', logLevel: LogLevels.debug });

      expect(LambdaLogger).toHaveBeenCalledWith({ serviceName: 'testService', logLevel: 'DEBUG' });
    });
  });

  describe('info method', () => {
    it('should log info level messages', () => {
      logger.init({ serviceName: 'testService' });
      const logData = { message: 'Test Info', timestamp: mockTimestamp };
      logger.info(logData);

      expect(logger['logger']!.info).toHaveBeenCalledWith(JSON.stringify(logData));
    });

    it('should throw an error if logger is not initialized', () => {
      expect(() => {
        logger.info({ message: 'Test Info', timestamp: mockTimestamp });
      }).toThrow('logger not initialized');
    });
  });

  describe('error method', () => {
    it('should log error level messages', () => {
      logger.init({ serviceName: 'testService' });
      const logData = { message: 'Test Error', error: 'Error occurred', timestamp: mockTimestamp };
      logger.error(logData);

      expect(logger['logger']!.error).toHaveBeenCalledWith(JSON.stringify(logData));
    });

    it('should throw an error if logger is not initialized', () => {
      expect(() => {
        logger.error({ message: 'Test Error', error: 'Error occurred', timestamp: mockTimestamp });
      }).toThrow('logger not initialized');
    });
  });

  describe('debug method', () => {
    it('should log debug level messages', () => {
      logger.init({ serviceName: 'testService' });
      const logData = { message: 'Test Debug', timestamp: mockTimestamp };
      logger.debug(logData);

      expect(logger['logger']!.debug).toHaveBeenCalledWith(JSON.stringify(logData));
    });

    it('should throw an error if logger is not initialized', () => {
      expect(() => {
        logger.debug({ message: 'Test Debug', timestamp: mockTimestamp });
      }).toThrow('logger not initialized');
    });
  });
});
