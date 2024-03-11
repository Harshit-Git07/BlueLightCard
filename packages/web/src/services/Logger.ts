export type Level = 'debug' | 'info' | 'warn' | 'error';

export type LoggerDetails = {
  context?: unknown;
};

export type LoggerDetailsWithError = LoggerDetails & {
  error?: unknown;
};

export class Logger {
  private static _instance: Logger;

  static get instance() {
    if (!Logger._instance) {
      Logger._instance = new Logger();
    }
    return Logger._instance;
  }

  debug(message: string, details: LoggerDetails = {}) {
    console.debug(this.displayMessageWithTimestampAndLevel('debug', message), details);
  }

  info(message: string, details: LoggerDetails = {}) {
    console.log(this.displayMessageWithTimestampAndLevel('info', message), details);
  }

  warn(message: string, details: LoggerDetails = {}) {
    console.warn(this.displayMessageWithTimestampAndLevel('warn', message), details);
  }

  error(message: string, details: LoggerDetailsWithError = {}) {
    console.error(this.displayMessageWithTimestampAndLevel('error', message), details);
  }

  private displayMessageWithTimestampAndLevel(level: Level, message: string) {
    return `[${this.displayTimestamp()}] [${level.toLocaleUpperCase()}] ${message}`;
  }

  private displayTimestamp() {
    return new Date().toISOString();
  }
}
