import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { z } from 'zod';

import { NON_NEGATIVE_INT } from '@blc-mono/core/schemas/common';
import { Result } from '@blc-mono/core/types/result';
import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { TokenHelper } from '@blc-mono/redemptions/application/helpers/TokenHelper';
import {
  IRedemptionDetailsService,
  RedemptionDetailsService,
} from '@blc-mono/redemptions/application/services/redemptionDetails/RedemptionDetailsService';

import { APIGatewayController, APIGatewayResult, ParseRequestError } from '../ApiGatewayController';

const GetRedemptionDetailsRequestModel = z.object({
  headers: z.object({
    Authorization: z.string(),
  }),
  queryStringParameters: z.object({
    offerId: z
      .string()
      .transform((value, ctx) => {
        const parsed = Number(value);
        if (isNaN(parsed)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'offerId must be a number',
          });
        }
        return parsed;
      })
      .pipe(NON_NEGATIVE_INT),
  }),
});
type ParsedRequest = z.infer<typeof GetRedemptionDetailsRequestModel> & { memberId: string };

export class RedemptionDetailsController extends APIGatewayController<ParsedRequest> {
  static readonly inject = [Logger.key, RedemptionDetailsService.key] as const;

  constructor(
    logger: ILogger,
    private readonly redemptionDetailsService: IRedemptionDetailsService,
  ) {
    super(logger);
  }

  protected parseRequest(request: APIGatewayProxyEventV2): Result<ParsedRequest, ParseRequestError> {
    const parsedRequest = this.zodParseRequest(request, GetRedemptionDetailsRequestModel);

    // TODO: Move token parsing logic to helper class and inject as dependency

    if (parsedRequest.isFailure) {
      return parsedRequest;
    }

    const parsedBearerToken = TokenHelper.removeBearerPrefix(parsedRequest.value.headers.Authorization);
    const tokenPayloadResult = TokenHelper.unsafeExtractDataFromToken(parsedBearerToken);

    if (tokenPayloadResult.isFailure) {
      this.logger.error({
        message: 'Error parsing bearer token from header',
        error: tokenPayloadResult.error,
      });
      return Result.err({ cause: 'Invalid token', message: 'The token was invalid or malformed' });
    }

    const memberId = tokenPayloadResult.value['custom:blc_old_id'];
    if (typeof memberId !== 'string')
      return Result.err({ cause: 'Invalid token', message: 'Invalid memberId in token' });

    return Result.ok({
      ...parsedRequest.value,
      memberId,
    });
  }

  public async handle(request: ParsedRequest): Promise<APIGatewayResult> {
    const result = await this.redemptionDetailsService.getRedemptionDetails(
      request.queryStringParameters.offerId,
      request.memberId,
    );

    switch (result.kind) {
      case 'Ok':
        return {
          statusCode: 200,
          data: {
            redemptionType: result.data.redemptionType,
          },
        };
      case 'RedemptionNotFound':
        return {
          statusCode: 404,
          data: {
            message: 'No redemption found for the given offerId',
          },
        };
      default:
        exhaustiveCheck(result, 'Unhandled result kind');
    }
  }
}
