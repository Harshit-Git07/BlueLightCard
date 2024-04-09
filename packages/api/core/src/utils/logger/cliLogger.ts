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
    private readonly _chalk: Chalk = chalkDefault,
    private CONTEXT = _chalk.gray,
    private INFO = _chalk.white.bold,
    private DEBUG = _chalk.gray.bold,
    private WARN = _chalk.yellow.bold,
    private ERROR = _chalk.red.bold,
  ) {
    super();
  }

  info({ message, context }: ICliLoggerDetail) {
    console.log(this.INFO(`[INFO] ${message}`));
    this.logContext(context);
  }

  debug({ message, context }: ICliLoggerDetail) {
    console.log(this.DEBUG(`[DEBUG] ${message}`));
    this.logContext(context);
  }

  warn({ message, context }: ICliLoggerDetail) {
    console.warn(this.WARN(`[WARNING] ${message}`));
    this.logContext(context);
  }

  error({ message, context }: ICliLoggerDetail) {
    console.error(this.ERROR(`[ERROR] ${message}`));
    this.logContext(context);
  }

  private logContext(context?: unknown) {
    if (context === undefined) {
      return;
    }

    console.log(this.CONTEXT(`[CONTEXT] ${this.stringifyContext(context)}`));
  }

  private stringifyContext(context: unknown) {
    if (typeof context === 'string') {
      return context;
    }
    return JSON.stringify(context);
  }
}
