import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import jwtDecode from 'jwt-decode';
import micromatch from 'micromatch';
import { z } from 'zod';

import { Result } from '@blc-mono/core/types/result';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { ILogger } from '@blc-mono/core/utils/logger/logger';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';

import { Controller } from '../Controller';

type JsonValue = string | number | boolean | null | JsonObject | JsonArray | undefined;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

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
  protected abstract logger: ILogger;

  protected formatResponse(
    request: APIGatewayProxyEventV2,
    result: APIGatewayResult,
  ): APIGatewayProxyStructuredResultV2 {
    const allowedOrigin = this.getAllowedOrigin(request);
    return {
      statusCode: result.statusCode,
      body: JSON.stringify({
        statusCode: result.statusCode,
        data: result.data,
      }),
      headers: {
        ...result.headers,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': allowedOrigin,
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

  protected parseBearerToken(authorizationHeader: string): Result<string, ParseRequestError> {
    if (authorizationHeader.startsWith('Bearer ')) {
      const parsedToken = authorizationHeader.substring(7, authorizationHeader.length);
      return Result.ok(parsedToken);
    } else {
      return Result.err('Invalid Authorization header');
    }
  }

  /**
   * This method extracts the data from the token without any validation
   */
  protected unsafeExtractDataFromToken(token: string): Result<JsonObject, ParseRequestError> {
    try {
      return Result.ok(jwtDecode(token));
    } catch (err) {
      return Result.err({ cause: 'Invalid token', message: 'The token was invalid or malformed' });
    }
  }

  protected getAllowedOrigin(request: APIGatewayProxyEventV2): string {
    const origin = request.headers.origin;
    const allowedOrigins = JSON.parse(getEnv(RedemptionsStackEnvironmentKeys.API_DEFAULT_ALLOWED_ORIGINS)) as
      | string
      | string[];
    if (origin && (micromatch.isMatch(origin, allowedOrigins) || allowedOrigins.includes('*'))) {
      return origin;
    } else {
      return '';
    }
  }
}
