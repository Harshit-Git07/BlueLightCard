import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

import { CORS_ALLOWED_ORIGINS_SCHEMA, JsonStringSchema } from '@blc-mono/core/schemas/common';
import { JsonValue } from '@blc-mono/core/types/json';
import { Result } from '@blc-mono/core/types/result';
import { getEnvValidated } from '@blc-mono/core/utils/getEnv';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';

import { Controller } from '../Controller';

export type APIGatewayResult = {
  statusCode: number;
  data?: JsonValue;
  headers?: { [key: string]: string };
};

export enum ParseErrorKind {
  RequestValidationCardStatus = 'RequestValidationCardStatus',
  RequestValidationMemberId = 'RequestValidationMemberId',
  RequestValidationBrazeExternalUserId = 'RequestValidationBrazeExternalUserId',
  RequestValidationName = 'RequestValidationName',
}

export type ParseErrorKindType = keyof typeof ParseErrorKind;

export type ParseRequestError = JsonValue;

export type ParseRequestResult = ParseRequestError & {
  kind?: ParseErrorKindType | undefined;
  message: string;
};

export type APIGatewayResults = APIGatewayProxyStructuredResultV2 & {
  statusCode: number;
  body: string;
  headers: { [key: string]: string };
};

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
        ...this.getCorsHeaders(request),
      },
    });
  }

  protected onParseError(request: APIGatewayProxyEventV2, err: ParseRequestResult): Promise<APIGatewayResults> {
    this.logger.error({
      message: 'The request was invalid',
      context: {
        controller: this.constructor.name || 'APIGatewayController (unknown)',
        location: 'APIGatewayController.onParseError',
        tracingId: request.requestContext.requestId,
        error: err,
      },
    });

    const payload = {
      meta: {
        tracingId: request.requestContext.requestId,
      },
      data: {
        message: err.message,
        kind: err.kind,
      },
    };
    switch (err.kind) {
      case ParseErrorKind.RequestValidationCardStatus:
        return Promise.resolve({
          statusCode: 403,
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
          },
        });
      case ParseErrorKind.RequestValidationMemberId:
        return Promise.resolve({
          statusCode: 400,
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
          },
        });
      case ParseErrorKind.RequestValidationBrazeExternalUserId:
        return Promise.resolve({
          statusCode: 400,
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
          },
        });

      default:
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
  }

  // ================================= HELPERS =================================

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
