import { Result } from '@blc-mono/core/types/result';

export abstract class Controller<
  Request,
  Response,
  HandlerResult = Response,
  ParsedRequest = Request,
  ParseRequestError = unknown,
> {
  constructor() {
    this.invoke = this.invoke.bind(this);
  }

  public async invoke(request: Request): Promise<Response> {
    let parseRequestResult: Result<ParsedRequest, ParseRequestError>;
    try {
      parseRequestResult = this.parseRequest(request);
    } catch (err) {
      return await this.onUnhandledError(request, err);
    }

    if (parseRequestResult.isFailure) {
      return await this.onParseError(request, parseRequestResult.error);
    }

    try {
      const result = await this.handle(parseRequestResult.value);
      return this.formatResponse(request, result);
    } catch (err) {
      return await this.onUnhandledError(request, err);
    }
  }
  protected abstract parseRequest(request: Request): Result<ParsedRequest, ParseRequestError>;
  protected abstract handle(request: ParsedRequest): Promise<HandlerResult>;
  protected abstract formatResponse(request: Request, result: HandlerResult): Response;
  protected abstract onUnhandledError(request: Request, err: unknown): Promise<Response>;
  protected abstract onParseError(request: Request, err: ParseRequestError): Promise<Response>;
}
