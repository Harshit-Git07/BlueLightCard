import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

import { CORS_ALLOWED_ORIGINS_SCHEMA, JsonStringSchema } from '@blc-mono/core/schemas/common';
import { JsonValue } from '@blc-mono/core/types/json';
import { getEnvValidated } from '@blc-mono/core/utils/getEnv';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';

import { BaseApiGatewayController } from '../BaseApiGatewayController';

export type APIGatewayResult = {
  statusCode: number;
  data?: JsonValue;
  headers?: { [key: string]: string };
};

export enum ParseErrorKind {
  RequestValidationCardStatus = 'RequestValidationCardStatus',
  RequestValidationMemberId = 'RequestValidationMemberId',
  RequestValidationBrazeExternalUserId = 'RequestValidationBrazeExternalUserId',
  RequestValidationMemberEmail = 'RequestValidationMemberEmail',
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

export abstract class APIGatewayController<
  ParsedRequest = APIGatewayProxyEventV2,
> extends BaseApiGatewayController<ParsedRequest> {
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
      case ParseErrorKind.RequestValidationBrazeExternalUserId:
      case ParseErrorKind.RequestValidationMemberEmail:
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

  protected getAllowedOrigin() {
    return getEnvValidated(
      RedemptionsStackEnvironmentKeys.API_DEFAULT_ALLOWED_ORIGINS,
      JsonStringSchema.pipe(CORS_ALLOWED_ORIGINS_SCHEMA),
    );
  }
}
