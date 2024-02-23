import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { z } from 'zod';

import { Result } from '@blc-mono/core/types/result';
import { ILogger } from '@blc-mono/core/utils/logger/logger';

import { Controller } from '../Controller';

type JsonValue = string | number | boolean | null | JsonObject | JsonArray | undefined;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

export type APIGatewayResult = {
  statusCode: number;
  body?: JsonValue;
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
  protected abstract logger: ILogger;

  protected formatResponse(_: APIGatewayProxyEventV2, result: APIGatewayResult): APIGatewayProxyStructuredResultV2 {
    return {
      statusCode: result.statusCode,
      body: JSON.stringify({
        statusCode: result.statusCode,
        data: result.body,
      }),
      headers: {
        ...result.headers,
        'Content-Type': 'application/json',
      },
    };
  }

  protected async onUnhandledError(
    request: APIGatewayProxyEventV2,
    err: unknown,
  ): Promise<APIGatewayProxyStructuredResultV2> {
    this.logger.error({
      message: '[UNHANDLED ERROR] There was an unhandled error processing the request',
      context: {
        controller: this.constructor.name || 'APIGatewayController (unknown)',
        location: 'APIGatewayController.onUnhandledError',
        tracingId: request.requestContext.requestId,
        error: err,
      },
    });

    return {
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
    };
  }

  protected async onParseError(
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

    return {
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
    };
  }

  // ====== Helpers ======

  protected zodParseRequest(
    request: APIGatewayProxyEventV2,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.ZodObject<any, any, any, ParsedRequest, any>,
  ): Result<ParsedRequest, ParseRequestError> {
    const result = schema.safeParse(request);

    if (result.success) {
      return Result.ok(result.data);
    }

    return Result.err({
      cause: 'Request validation failed',
      message: result.error.message,
      errors: result.error.errors.map((error) => ({
        path: error.path,
        message: error.message,
        code: error.code,
        fatal: error.fatal,
      })),
    });
  }
}
