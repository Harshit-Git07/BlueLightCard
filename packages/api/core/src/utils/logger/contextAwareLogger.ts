import { AsyncLocalStorage } from 'node:async_hooks';
import { ILogger, ILoggerDetail } from './logger';

export type LoggerContext<Detail extends ILoggerDetail = ILoggerDetail> = {
  logger: {
    defaultLoggerDetail?: Partial<Detail>;
  };
};

/**
 * Wraps any logger and makes it aware of its current async context. This allows
 * default logger details to be set for an async context and used by the logger.
 * For example, when handling a request, the default logger detail can be set to
 * include the request ID.
 *
 * - ✅ Human readable *
 * - ✅ Colored *
 * - ✅ Machine readable (structured) *
 * - ✅ Additional context (e.g. timestamp) *
 *
 * _\* (depends on the underlying logger implementation used)_
 */
export class ContextAwareLogger<Detail extends ILoggerDetail = ILoggerDetail> implements ILogger {
  constructor(
    private asyncContext: AsyncLocalStorage<LoggerContext<Detail>>,
    private readonly logger: ILogger,
  ) {}

  info(detail: Detail): void {
    this.logger.info(this.getLoggerDetailWithDefault(detail));
  }
  debug(detail: Detail): void {
    this.logger.debug(this.getLoggerDetailWithDefault(detail));
  }
  error(detail: Detail): void {
    this.logger.error(this.getLoggerDetailWithDefault(detail));
  }
  warn(detail: Detail): void {
    this.logger.warn(this.getLoggerDetailWithDefault(detail));
  }

  private getLoggerDetailWithDefault(detail: Detail): Detail {
    const defaultLoggerDetail = this.getDefaultLoggerDetail();
    return {
      ...defaultLoggerDetail,
      ...detail,
      context: {
        ...defaultLoggerDetail.context,
        ...detail.context,
      },
    };
  }

  private getDefaultLoggerDetail(): Partial<ILoggerDetail> {
    return this.asyncContext.getStore()?.logger.defaultLoggerDetail ?? {};
  }
}
