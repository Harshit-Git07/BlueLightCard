import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

import { JsonValue } from '@blc-mono/core/types/json';
import { Result } from '@blc-mono/core/types/result';

import { Controller } from '../Controller';

export type APIGatewayResult = {
  statusCode: number;
  data?: JsonValue;
  headers?: { [key: string]: string };
};

export type ParseRequestError = JsonValue;

export abstract class APIGatewayController<ParsedRequest = APIGatewayProxyEventV2> extends Controller<
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
  APIGatewayResult,
  ParsedRequest,
  ParseRequestError
> {
  protected onRequest(request: APIGatewayProxyEventV2): void {
    this.setDefaultLoggerDetail({
      context: {
        tracingId: request.requestContext.requestId,
      },
    });
  }

  protected formatResponse(
    request: APIGatewayProxyEventV2,
    result: APIGatewayResult,
  ): APIGatewayProxyStructuredResultV2 {
    return {
      statusCode: result.statusCode,
      body: JSON.stringify({
        statusCode: result.statusCode,
        data: result.data,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  protected onUnhandledError(
    request: APIGatewayProxyEventV2,
    err: unknown,
  ): Promise<APIGatewayProxyStructuredResultV2> {
    this.logUnhandledError(err);

    return Promise.resolve({
      statusCode: 500,
      body: JSON.stringify({
        meta: {
          tracingId: request.requestContext.requestId,
        },
        message: 'Internal Server Error',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  protected onParseError(
    request: APIGatewayProxyEventV2,
    err: ParseRequestError,
  ): Promise<APIGatewayProxyStructuredResultV2> {
    this.logger.error({
      message: 'The request was invalid',
      context: {
        controller: this.constructor.name || 'APIGatewayController (unknown)',
        location: 'APIGatewayController.onParseError',
        tracingId: request.requestContext.requestId,
        error: err,
      },
    });

    return Promise.resolve({
      statusCode: 400,
      body: JSON.stringify({
        meta: {
          tracingId: request.requestContext.requestId,
        },
        message: 'Bad Request',
        error: err,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  protected zodParseRequest<TOutput>(
    request: APIGatewayProxyEventV2,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.ZodObject<any, any, any, TOutput, any>,
  ): Result<TOutput, ParseRequestError> {
    const result = schema.safeParse(request);

    if (result.success) {
      return Result.ok(result.data);
    }

    return Result.err({
      cause: 'Request validation failed',
      message: fromZodError(result.error).toString(),
      errors: result.error.errors.map((error) => ({
        path: error.path,
        message: error.message,
        code: error.code,
        fatal: error.fatal,
      })),
    });
  }
}
