import chalk from 'chalk';
import { ILogger, ILoggerDetail } from './logger';

export interface ICliLoggerDetail extends ILoggerDetail {}

/**
 * Logs colored messages to the console. Do not use this logger in application code.
 * 
 * - ✅ Human readable
 * - ✅ Colored
 * - ❌ Not machine readable (unstructured)
 * - ❌ No additional context (e.g. timestamp)
 */
export class CliLogger implements ILogger {
  static INFO = chalk.white.bold;
  static DEBUG = chalk.gray.bold;
  static WARN = chalk.yellow.bold;
  static ERROR = chalk.red.bold;

  info({ message }: ICliLoggerDetail) {
    console.log(CliLogger.INFO(`[INFO] ${message}`));
  }

  debug({ message }: ICliLoggerDetail) {
    console.log(CliLogger.DEBUG(`[DEBUG] ${message}`));
  }

  warn({ message }: ICliLoggerDetail) {
    console.warn(CliLogger.WARN(`[WARNING] ${message}`));
  }

  error({ message }: ICliLoggerDetail) {
    console.error(CliLogger.ERROR(`[ERROR] ${message}`));
  }
}
