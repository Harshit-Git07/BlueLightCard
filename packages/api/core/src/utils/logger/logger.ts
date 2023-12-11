import { Logger as LambdaLogger } from '@aws-lambda-powertools/logger';
interface loggerBody {
  message: string;
  timestamp?: string;
  status?: number;
  body?: any | null;
  error?: string | null;
}

export type LogLevel = 'INFO' | 'DEBUG' | 'WARN' | 'ERROR';
export enum LogLevels {
  info = 'INFO',
  debug = 'DEBUG',
  warn = 'WARN',
  error = 'ERROR',
}

export class Logger {
  private logger: LambdaLogger | undefined;
  init({ serviceName, logLevel = LogLevels.info }: { serviceName: string; logLevel?: LogLevel }): void {
    this.logger = new LambdaLogger({ serviceName, logLevel });
  }

  info({ message, status, body, timestamp }: loggerBody): void {
    if (!this.logger) {
      throw new Error('logger not initialized');
    }
    this.logger.info(
      JSON.stringify({
        message,
        status,
        body,
        timestamp,
      }),
    );
  }

  error({ message, status, body, error, timestamp }: loggerBody): void {
    if (!this.logger) {
      throw new Error('logger not initialized');
    }
    this.logger.error(
      JSON.stringify({
        message,
        status,
        body,
        error,
        timestamp,
      }),
    );
  }

  debug({ message, status, body, error, timestamp }: loggerBody): void {
    if (!this.logger) {
      throw new Error('logger not initialized');
    }
    this.logger.debug(
      JSON.stringify({
        message,
        status,
        body,
        error,
        timestamp,
      }),
    );
  }
}
