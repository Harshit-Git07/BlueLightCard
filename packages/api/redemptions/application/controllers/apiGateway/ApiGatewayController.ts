import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import jwtDecode from 'jwt-decode';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

import { CORS_ALLOWED_ORIGINS_SCHEMA, JsonStringSchema } from '@blc-mono/core/schemas/common';
import { Result } from '@blc-mono/core/types/result';
import { getEnvValidated } from '@blc-mono/core/utils/getEnv';
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
        ...result.headers,
        'Content-Type': 'application/json',
        ...this.getCorsHeaders(request),
      },
    };
  }

  protected async onUnhandledError(
    request: APIGatewayProxyEventV2,
    err: unknown,
  ): Promise<APIGatewayProxyStructuredResultV2> {
    this.logUnhandledError(err);

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
        ...this.getCorsHeaders(request),
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

  // ================================= HELPERS =================================

  private getCorsHeaders(request: APIGatewayProxyEventV2): { [key: string]: string } {
    const allowedOrigin = this.getAllowedOrigin(request);
    if (!allowedOrigin) {
      return {};
    }
    return {
      // IMPORTANT: If you need to update these settings, remember to also
      //            update the `defaultCorsPreflightOptions` for the API Gateway
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Origin': allowedOrigin,
    };
  }

  private getAllowedOrigin(request: APIGatewayProxyEventV2): string | undefined {
    const origin = request.headers.origin;
    const allowedOrigins = getEnvValidated(
      RedemptionsStackEnvironmentKeys.API_DEFAULT_ALLOWED_ORIGINS,
      JsonStringSchema.pipe(CORS_ALLOWED_ORIGINS_SCHEMA),
    );

    if (!origin) {
      return;
    }

    if (allowedOrigins.includes('*')) {
      return '*';
    }

    if (allowedOrigins.includes(origin)) {
      return origin;
    }
  }
}
