import { Logger as LoggerImpl } from '@aws-lambda-powertools/logger';
import { ILoggerDetail, LogLevel, Logger } from './logger';

export interface ILambdaLoggerDetail extends ILoggerDetail {
  message: string;
  timestamp?: string;
  status?: number;
  body?: any | null;
  error?: string | null;
}

/**
 * Logs structured JSON messages. Uses the AWS Powertools logger under the hood.
 * Use this logger in Lambda functions.
 *
 * - ✅ Human readable
 * - ❌ Colored
 * - ✅ Machine readable (structured)
 * - ✅ Additional context (e.g. timestamp)
 */
export class LambdaLogger extends Logger<ILambdaLoggerDetail> {
  private logger: LoggerImpl;

  constructor(options: { serviceName: string; logLevel?: LogLevel }) {
    super();
    this.logger = new LoggerImpl(options);
  }

  info({ message, status, body, error, timestamp, context }: ILambdaLoggerDetail): void {
    this.logger.info(
      JSON.stringify({
        message,
        status,
        body,
        error,
        timestamp,
        context,
      }),
    );
  }

  debug({ message, status, body, error, timestamp, context }: ILambdaLoggerDetail): void {
    this.logger.debug(
      JSON.stringify({
        message,
        status,
        body,
        error,
        timestamp,
        context,
      }),
    );
  }

  warn({ message, status, body, error, timestamp, context }: ILambdaLoggerDetail): void {
    this.logger.warn(
      JSON.stringify({
        message,
        status,
        body,
        error,
        timestamp,
        context,
      }),
    );
  }

  error({ message, status, body, error, timestamp, context }: ILambdaLoggerDetail): void {
    this.logger.error(
      JSON.stringify({
        message,
        status,
        body,
        error,
        timestamp,
        context,
      }),
    );
  }
}
