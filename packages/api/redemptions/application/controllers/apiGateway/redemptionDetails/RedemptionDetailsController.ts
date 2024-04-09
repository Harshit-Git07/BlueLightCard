import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { z } from 'zod';

import { NON_NEGATIVE_INT } from '@blc-mono/core/schemas/common';
import { Result } from '@blc-mono/core/types/result';
import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  IRedemptionDetailsService,
  RedemptionDetailsService,
} from '@blc-mono/redemptions/application/services/redemptionDetails/RedemptionDetailsService';

import { APIGatewayController, APIGatewayResult, ParseRequestError } from '../ApiGatewayController';

const GetRedemptionDetailsRequestModel = z.object({
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
type GetRedemptionDetailsRequestModel = z.infer<typeof GetRedemptionDetailsRequestModel>;

export class RedemptionDetailsController extends APIGatewayController<GetRedemptionDetailsRequestModel> {
  static readonly inject = [Logger.key, RedemptionDetailsService.key] as const;

  constructor(
    logger: ILogger,
    private readonly redemptionDetailsService: IRedemptionDetailsService,
  ) {
    super(logger);
  }

  protected parseRequest(request: APIGatewayProxyEventV2): Result<GetRedemptionDetailsRequestModel, ParseRequestError> {
    return this.zodParseRequest(request, GetRedemptionDetailsRequestModel);
  }

  public async handle(request: GetRedemptionDetailsRequestModel): Promise<APIGatewayResult> {
    const result = await this.redemptionDetailsService.getRedemptionDetails(request.queryStringParameters.offerId);

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
