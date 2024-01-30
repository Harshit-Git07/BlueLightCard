import _noop from 'lodash/noop';
import { CliLogger } from './cliLogger';
import chalk from 'chalk';

describe('CliLogger', () => {
  const mockTimestamp = '2023-01-01T00:00:00.000Z';

  describe('info method', () => {
    it('should log info level messages', () => {
      // Arrange
      const log = jest.spyOn(console, 'log').mockImplementationOnce(_noop);
      const logger = new CliLogger();

      // Act
      logger.info({ message: 'Test Info' });

      // Assert
      expect(log).toHaveBeenLastCalledWith('\u001B[90m\u001B[1m[INFO] Test Info\u001B[22m\u001B[39m');
    });
  });

  describe('debug method', () => {
    it('should log debug level messages', () => {
      // Arrange
      const log = jest.spyOn(console, 'log').mockImplementationOnce(_noop);
      const logger = new CliLogger();

      // Act
      logger.debug({ message: 'Test Debug' });

      // Assert
      expect(log).toHaveBeenLastCalledWith('\u001B[34m\u001B[1m[DEBUG] Test Debug\u001B[22m\u001B[39m');
    });
  });

  describe('warn method', () => {
    it('should log warn level messages', () => {
      // Arrange
      const warn = jest.spyOn(console, 'warn').mockImplementationOnce(_noop);
      const logger = new CliLogger();

      // Act
      logger.warn({ message: 'Test Warn' });

      // Assert
      expect(warn).toHaveBeenLastCalledWith('\u001B[33m\u001B[1m[WARNING] Test Warn\u001B[22m\u001B[39m');
    });
  });

  describe('error method', () => {
    it('should log error level messages', () => {
      // Arrange
      const error = jest.spyOn(console, 'error').mockImplementationOnce(_noop);
      const logger = new CliLogger();

      // Act
      logger.error({ message: 'Test Error' });

      // Assert
      expect(error).toHaveBeenLastCalledWith('\u001B[31m\u001B[1m[ERROR] Test Error\u001B[22m\u001B[39m');
    });
  });
});
