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
  static CONTEXT = chalk.gray;
  static INFO = chalk.white.bold;
  static DEBUG = chalk.gray.bold;
  static WARN = chalk.yellow.bold;
  static ERROR = chalk.red.bold;

  info({ message, context }: ICliLoggerDetail) {
    console.log(CliLogger.INFO(`[INFO] ${message}`));
    this.logContext(context);
  }

  debug({ message, context }: ICliLoggerDetail) {
    console.log(CliLogger.DEBUG(`[DEBUG] ${message}`));
    this.logContext(context);
  }

  warn({ message, context }: ICliLoggerDetail) {
    console.warn(CliLogger.WARN(`[WARNING] ${message}`));
    this.logContext(context);
  }

  error({ message, context }: ICliLoggerDetail) {
    console.error(CliLogger.ERROR(`[ERROR] ${message}`));
    this.logContext(context);
  }

  private logContext(context?: unknown) {
    if (context === undefined) {
      return;
    }

    console.log(CliLogger.CONTEXT(`[CONTEXT] ${this.stringifyContext(context)}`));
  }

  private stringifyContext(context: unknown) {
    if (typeof context === 'string') {
      return context;
    }
    return JSON.stringify(context);
  }
}
