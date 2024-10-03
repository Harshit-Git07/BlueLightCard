import chalkDefault, { type Chalk } from 'chalk';
import { ILoggerDetail, Logger } from './logger';

export interface ICliLoggerDetail extends ILoggerDetail {}

/**
 * Logs colored messages to the console. Do not use this logger in application code.
 *
 * - ✅ Human readable
 * - ✅ Colored
 * - ❌ Not machine readable (unstructured)
 * - ❌ No additional context (e.g. timestamp)
 */
export class CliLogger extends Logger<ICliLoggerDetail> {
  constructor(
    _chalk: Chalk = chalkDefault,
    private CONTEXT = _chalk.gray,
    private INFO = _chalk.white.bold,
    private DEBUG = _chalk.gray.bold,
    private WARN = _chalk.yellow.bold,
    private ERROR = _chalk.red.bold,
  ) {
    super();
  }

  info({ message, context, error }: ICliLoggerDetail) {
    console.log(this.INFO(`[INFO] ${message}`));
    this.logContext('log', context);
    this.logError('log', error);
  }

  debug({ message, context, error }: ICliLoggerDetail) {
    console.log(this.DEBUG(`[DEBUG] ${message}`));
    this.logContext('log', context);
    this.logError('log', error);
  }

  warn({ message, context, error }: ICliLoggerDetail) {
    console.warn(this.WARN(`[WARNING] ${message}`));
    this.logContext('warn', context);
    this.logError('warn', error);
  }

  error({ message, context, error }: ICliLoggerDetail) {
    console.error(this.ERROR(`[ERROR] ${message}`));
    this.logContext('error', context);
    this.logError('error', error);
  }

  private logContext(method: 'log' | 'warn' | 'error', context: unknown) {
    if (context === undefined) {
      return;
    }

    console[method](this.CONTEXT(`[CONTEXT] ${this.stringifyContext(context)}`));
  }

  private stringifyContext(context: unknown) {
    if (typeof context === 'string') {
      return context;
    }
    return JSON.stringify(context);
  }

  private logError(method: 'log' | 'warn' | 'error', error: unknown) {
    const serialized = this.serializeError(error);

    if (serialized === undefined) {
      return;
    }

    console[method](this.CONTEXT(`${serialized.message}\n${serialized.stack}`));
  }
}
