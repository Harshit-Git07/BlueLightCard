import { Logger } from '@aws-lambda-powertools/logger';
import { ILogger, ILoggerDetail, LogLevel } from './logger';

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
export class LambdaLogger implements ILogger<ILambdaLoggerDetail> {
  private logger: Logger;

  constructor(options: { serviceName: string; logLevel?: LogLevel }) {
    this.logger = new Logger(options);
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
