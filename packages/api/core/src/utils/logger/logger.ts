export interface ILoggerDetail {
  message: string;
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
