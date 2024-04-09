export interface ILoggerDetail {
  message: string;
  context?: Record<string, unknown>;
}

export enum LogLevel {
  INFO = 'INFO',
  DEBUG = 'DEBUG',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface ILogger<Detail extends ILoggerDetail = ILoggerDetail> {
  info(detail: Detail): void;
  debug(detail: Detail): void;
  error(detail: Detail): void;
  warn(detail: Detail): void;
}

export abstract class Logger<Detail extends ILoggerDetail> implements ILogger<Detail> {
  static readonly key = 'Logger';

  abstract info(detail: ILoggerDetail): void;
  abstract debug(detail: ILoggerDetail): void;
  abstract error(detail: ILoggerDetail): void;
  abstract warn(detail: ILoggerDetail): void;
}
