import 'dd-trace/init';

import { AsyncLocalStorage } from 'node:async_hooks';

import { datadog } from 'datadog-lambda-js';

import { Result } from '@blc-mono/core/types/result';
import { getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { ContextAwareLogger, LoggerContext } from '@blc-mono/core/utils/logger/contextAwareLogger';
import { ILogger, ILoggerDetail } from '@blc-mono/core/utils/logger/logger';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';

type RequestContext = LoggerContext;
const INITIAL_REQUEST_CONTEXT: RequestContext = { logger: {} };
const asyncRequestContext = new AsyncLocalStorage<RequestContext>();

export abstract class Controller<
  Request,
  Response,
  HandlerResult = Response,
  ParsedRequest = Request,
  ParseRequestError = unknown,
> {
  protected readonly logger: ILogger;

  constructor(logger: ILogger) {
    const USE_DATADOG_AGENT = getEnvOrDefault(RedemptionsStackEnvironmentKeys.USE_DATADOG_AGENT, 'false');

    if (USE_DATADOG_AGENT && USE_DATADOG_AGENT.toLowerCase() === 'true') {
      this.invoke = datadog(this.invoke.bind(this));
    } else {
      this.invoke = this.invoke.bind(this);
    }

    this.logger = new ContextAwareLogger(asyncRequestContext, logger);
  }

  public invoke(request: Request): Promise<Response> {
    return asyncRequestContext.run(INITIAL_REQUEST_CONTEXT, async () => {
      try {
        this.onRequest?.(request);

        const parseRequestResult = this.parseRequest(request);

        if (parseRequestResult.isFailure) {
          return await this.onParseError(request, parseRequestResult.error);
        }

        const result = await this.handle(parseRequestResult.value);

        return this.formatResponse(request, result);
      } catch (err) {
        return await this.onUnhandledError(request, err);
      }
    });
  }
  /**
   * Called when the request is received in the invoke method. This method is
   * called before anything else and and can be used to set up any context that
   * is needed for the request. For example, this can be used to set the default
   * logger detail for the request.
   *
   * @param request The incoming request
   */
  protected abstract onRequest(request: Request): void;
  protected abstract parseRequest(request: Request): Result<ParsedRequest, ParseRequestError>;
  protected abstract handle(request: ParsedRequest): Promise<HandlerResult> | HandlerResult;
  protected abstract formatResponse(request: Request, result: HandlerResult): Response;
  protected abstract onUnhandledError(request: Request, err: unknown): Promise<Response>;
  protected abstract onParseError(request: Request, err: ParseRequestError): Promise<Response>;
  protected setDefaultLoggerDetail(detail: Partial<ILoggerDetail>): void {
    const requestContext = asyncRequestContext.getStore();

    if (!requestContext) {
      this.logger.error({
        message: '[UNHANDLED ERROR] Attempted to set default logger detail outside of request context',
        context: {
          controller: this.constructor.name || 'Controller (unknown)',
          location: 'Controller.setDefaultLoggerDetail',
        },
      });
      return;
    }

    requestContext.logger.defaultLoggerDetail = detail;
  }
  protected logUnhandledError(err: unknown): void {
    this.logger.error({
      message: '[UNHANDLED ERROR] There was an unhandled error processing the event',
      context: {
        controller: this.constructor.name || 'Controller (unknown)',
        location: 'Controller.onUnhandledError',
        error: this.displayError(err),
      },
    });
  }
  private displayError(err: unknown): string {
    if (err instanceof Error) {
      return `[${err.name}] ${err.message}\n${err.stack ?? '<no stack>'}`;
    }
    return typeof err === 'string' ? err : JSON.stringify(err);
  }
}
