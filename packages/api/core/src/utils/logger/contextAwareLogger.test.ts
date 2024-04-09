import { ContextAwareLogger, LoggerContext } from './contextAwareLogger';
import { AsyncLocalStorage } from 'async_hooks';

describe('ContextAwareLogger', () => {
  const mockTimestamp = '2023-01-01T00:00:00.000Z';

  function getMockLogger() {
    return {
      info: jest.fn(),
      debug: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };
  }

  describe('info method', () => {
    it('should log info level messages', () => {
      // Arrange
      const mockedLogger = getMockLogger();
      const asyncContext = new AsyncLocalStorage<LoggerContext>();
      const logger = new ContextAwareLogger(asyncContext, mockedLogger);

      // Act
      asyncContext.run({ logger: {} }, () => {
        logger.info({ message: 'Test Info', context: { mockTimestamp } });
      });

      // Assert
      expect(mockedLogger.info.mock.lastCall).toMatchInlineSnapshot(`
        [
          {
            "context": {
              "mockTimestamp": "2023-01-01T00:00:00.000Z",
            },
            "message": "Test Info",
          },
        ]
      `);
    });
    it('should log info level messages with default context', () => {
      // Arrange
      const mockedLogger = getMockLogger();
      const asyncContext = new AsyncLocalStorage<LoggerContext>();
      const logger = new ContextAwareLogger(asyncContext, mockedLogger);
      const loggerContext: LoggerContext = {
        logger: {
          defaultLoggerDetail: {
            context: {
              defaultValue: 'example',
            },
          },
        },
      };

      // Act
      asyncContext.run(loggerContext, () => {
        logger.info({ message: 'Test Info', context: { mockTimestamp } });
      });

      // Assert
      expect(mockedLogger.info.mock.lastCall).toMatchInlineSnapshot(`
        [
          {
            "context": {
              "defaultValue": "example",
              "mockTimestamp": "2023-01-01T00:00:00.000Z",
            },
            "message": "Test Info",
          },
        ]
      `);
    });
  });

  describe('debug method', () => {
    it('should log debug level messages', () => {
      // Arrange
      const mockedLogger = getMockLogger();
      const asyncContext = new AsyncLocalStorage<LoggerContext>();
      const logger = new ContextAwareLogger(asyncContext, mockedLogger);

      // Act
      asyncContext.run({ logger: {} }, () => {
        logger.debug({ message: 'Test Debug', context: { mockTimestamp } });
      });

      // Assert
      expect(mockedLogger.debug.mock.lastCall).toMatchInlineSnapshot(`
        [
          {
            "context": {
              "mockTimestamp": "2023-01-01T00:00:00.000Z",
            },
            "message": "Test Debug",
          },
        ]
      `);
    });
    it('should log debug level messages with default context', () => {
      // Arrange
      const mockedLogger = getMockLogger();
      const asyncContext = new AsyncLocalStorage<LoggerContext>();
      const logger = new ContextAwareLogger(asyncContext, mockedLogger);
      const loggerContext: LoggerContext = {
        logger: {
          defaultLoggerDetail: {
            context: {
              defaultValue: 'example',
            },
          },
        },
      };

      // Act
      asyncContext.run(loggerContext, () => {
        logger.debug({ message: 'Test Debug', context: { mockTimestamp } });
      });

      // Assert
      expect(mockedLogger.debug.mock.lastCall).toMatchInlineSnapshot(`
        [
          {
            "context": {
              "defaultValue": "example",
              "mockTimestamp": "2023-01-01T00:00:00.000Z",
            },
            "message": "Test Debug",
          },
        ]
      `);
    });
  });

  describe('warn method', () => {
    it('should log warn level messages', () => {
      // Arrange
      const mockedLogger = getMockLogger();
      const asyncContext = new AsyncLocalStorage<LoggerContext>();
      const logger = new ContextAwareLogger(asyncContext, mockedLogger);

      // Act
      asyncContext.run({ logger: {} }, () => {
        logger.warn({ message: 'Test Warn', context: { mockTimestamp } });
      });

      // Assert
      expect(mockedLogger.warn.mock.lastCall).toMatchInlineSnapshot(`
        [
          {
            "context": {
              "mockTimestamp": "2023-01-01T00:00:00.000Z",
            },
            "message": "Test Warn",
          },
        ]
      `);
    });
    it('should log warn level messages with default context', () => {
      // Arrange
      const mockedLogger = getMockLogger();
      const asyncContext = new AsyncLocalStorage<LoggerContext>();
      const logger = new ContextAwareLogger(asyncContext, mockedLogger);
      const loggerContext: LoggerContext = {
        logger: {
          defaultLoggerDetail: {
            context: {
              defaultValue: 'example',
            },
          },
        },
      };

      // Act
      asyncContext.run(loggerContext, () => {
        logger.warn({ message: 'Test Warn', context: { mockTimestamp } });
      });

      // Assert
      expect(mockedLogger.warn.mock.lastCall).toMatchInlineSnapshot(`
        [
          {
            "context": {
              "defaultValue": "example",
              "mockTimestamp": "2023-01-01T00:00:00.000Z",
            },
            "message": "Test Warn",
          },
        ]
      `);
    });
  });

  describe('error method', () => {
    it('should log error level messages', () => {
      // Arrange
      const mockedLogger = getMockLogger();
      const asyncContext = new AsyncLocalStorage<LoggerContext>();
      const logger = new ContextAwareLogger(asyncContext, mockedLogger);

      // Act
      asyncContext.run({ logger: {} }, () => {
        logger.error({ message: 'Test Error', context: { mockTimestamp } });
      });

      // Assert
      expect(mockedLogger.error.mock.lastCall).toMatchInlineSnapshot(`
        [
          {
            "context": {
              "mockTimestamp": "2023-01-01T00:00:00.000Z",
            },
            "message": "Test Error",
          },
        ]
      `);
    });
    it('should log error level messages with default context', () => {
      // Arrange
      const mockedLogger = getMockLogger();
      const asyncContext = new AsyncLocalStorage<LoggerContext>();
      const logger = new ContextAwareLogger(asyncContext, mockedLogger);
      const loggerContext: LoggerContext = {
        logger: {
          defaultLoggerDetail: {
            context: {
              defaultValue: 'example',
            },
          },
        },
      };

      // Act
      asyncContext.run(loggerContext, () => {
        logger.error({ message: 'Test Error', context: { mockTimestamp } });
      });

      // Assert
      expect(mockedLogger.error.mock.lastCall).toMatchInlineSnapshot(`
        [
          {
            "context": {
              "defaultValue": "example",
              "mockTimestamp": "2023-01-01T00:00:00.000Z",
            },
            "message": "Test Error",
          },
        ]
      `);
    });
  });
});
