import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { z } from 'zod';

import { JsonStringSchema } from '@blc-mono/core/schemas/common';
import { Result } from '@blc-mono/core/types/result';
import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { PostRedeemModel } from '@blc-mono/redemptions/libs/models/postRedeem';

import { IRedeemService, RedeemService } from '../../../services/redeem/RedeemService';
import { APIGatewayController, APIGatewayResult, ParseRequestError } from '../ApiGatewayController';

const RedeemRequestModel = z.object({
  body: JsonStringSchema.pipe(PostRedeemModel),
});
type RedeemRequestModel = z.infer<typeof RedeemRequestModel>;

export class RedeemController extends APIGatewayController<RedeemRequestModel> {
  static readonly inject = [Logger.key, RedeemService.key] as const;

  constructor(protected readonly logger: ILogger, private readonly redeemService: IRedeemService) {
    super();
  }

  protected parseRequest(request: APIGatewayProxyEventV2): Result<RedeemRequestModel, ParseRequestError> {
    return this.zodParseRequest(request, RedeemRequestModel);
  }

  public async handle(request: RedeemRequestModel): Promise<APIGatewayResult> {
    const result = await this.redeemService.redeem(request.body.offerId);

    switch (result.kind) {
      case 'Ok':
        return {
          statusCode: 200,
          data: {
            redemptionType: result.redemptionType,
            redemptionDetails: result.redemptionDetails,
          },
        };
      case 'RedemptionNotFound':
        return {
          statusCode: 404,
          data: {
            message: 'No redemption found for the given offerId',
          },
        };
      case 'GenericNotFound':
        return {
          statusCode: 500,
          data: {
            message: 'No generic found for the given offerId',
          },
        };
      default:
        exhaustiveCheck(result, 'Unhandled result kind');
    }
  }
}
