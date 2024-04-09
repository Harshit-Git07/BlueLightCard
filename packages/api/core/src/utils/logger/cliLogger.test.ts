import { Instance } from 'chalk';
import _noop from 'lodash/noop';
import { CliLogger } from './cliLogger';

// Set level to 0 to disable colors (we only care that the logger is functional)
const chalk = new Instance({ level: 0 });

describe('CliLogger', () => {
  describe('info method', () => {
    it('should log info level messages', () => {
      // Arrange
      const log = jest.spyOn(console, 'log').mockImplementationOnce(_noop);
      const logger = new CliLogger(chalk);

      // Act
      logger.info({ message: 'Test Info' });

      // Assert
      expect(log.mock.lastCall).toMatchInlineSnapshot(`
        [
          "[INFO] Test Info",
        ]
      `);
    });
  });

  describe('debug method', () => {
    it('should log debug level messages', () => {
      // Arrange
      const log = jest.spyOn(console, 'log').mockImplementationOnce(_noop);
      const logger = new CliLogger(chalk);

      // Act
      logger.debug({ message: 'Test Debug' });

      // Assert
      expect(log.mock.lastCall).toMatchInlineSnapshot(`
        [
          "[DEBUG] Test Debug",
        ]
      `);
    });
  });

  describe('warn method', () => {
    it('should log warn level messages', () => {
      // Arrange
      const warn = jest.spyOn(console, 'warn').mockImplementationOnce(_noop);
      const logger = new CliLogger(chalk);

      // Act
      logger.warn({ message: 'Test Warn' });

      // Assert
      expect(warn.mock.lastCall).toMatchInlineSnapshot(`
        [
          "[WARNING] Test Warn",
        ]
      `);
    });
  });

  describe('error method', () => {
    it('should log error level messages', () => {
      // Arrange
      const error = jest.spyOn(console, 'error').mockImplementationOnce(_noop);
      const logger = new CliLogger(chalk);

      // Act
      logger.error({ message: 'Test Error' });

      // Assert
      expect(error.mock.lastCall).toMatchInlineSnapshot(`
        [
          "[ERROR] Test Error",
        ]
      `);
    });
  });
});
