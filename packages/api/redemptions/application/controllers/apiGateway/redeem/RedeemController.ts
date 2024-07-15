import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { z } from 'zod';

import { JsonStringSchema } from '@blc-mono/core/schemas/common';
import { Result } from '@blc-mono/core/types/result';
import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { TokenHelper } from '@blc-mono/redemptions/application/helpers/TokenHelper';
import { PostRedeemModel } from '@blc-mono/redemptions/libs/models/postRedeem';

import { IRedeemService, RedeemService } from '../../../services/redeem/RedeemService';
import { APIGatewayController, APIGatewayResult, ParseRequestError } from '../ApiGatewayController';

const RedeemRequestModel = z.object({
  body: JsonStringSchema.pipe(PostRedeemModel),
  headers: z.object({
    'X-Client-Type': z.optional(z.enum(['web', 'mobile'])),
    Authorization: z.string(),
  }),
});
export type ParsedRequest = z.infer<typeof RedeemRequestModel> & { memberId: string; brazeExternalUserId: string };

export class RedeemController extends APIGatewayController<ParsedRequest> {
  static readonly inject = [Logger.key, RedeemService.key] as const;

  constructor(
    logger: ILogger,
    private readonly redeemService: IRedeemService,
  ) {
    super(logger);
  }

  protected parseRequest(request: APIGatewayProxyEventV2): Result<ParsedRequest, ParseRequestError> {
    const parsedRequest = this.zodParseRequest(request, RedeemRequestModel);

    if (parsedRequest.isFailure) {
      return parsedRequest;
    }

    const parsedBearerToken = TokenHelper.removeBearerPrefix(parsedRequest.value.headers.Authorization);
    const tokenPayloadResult = TokenHelper.unsafeExtractDataFromToken(parsedBearerToken);
    //todo: update this when identity's api is available
    const allowedStatuses = ['PHYSICAL_CARD', 'ADDED_TO_BATCH', 'USER_BATCHED'];

    if (tokenPayloadResult.isFailure) {
      this.logger.error({
        message: 'Error parsing bearer token from header',
        error: tokenPayloadResult.error,
      });
      return Result.err({ cause: 'Invalid token', message: 'The token was invalid or malformed' });
    }

    const memberId = tokenPayloadResult.value['custom:blc_old_id'];
    const brazeExternalUserId = tokenPayloadResult.value['custom:blc_old_uuid'];
    const cardStatus = tokenPayloadResult.value['card_status'];
    if (typeof memberId !== 'string') return Result.err({ message: 'Invalid memberId in token' });
    if (typeof brazeExternalUserId !== 'string') return Result.err({ message: 'Invalid brazeExternalUserId in token' });
    if (typeof cardStatus !== 'string' || !allowedStatuses.includes(cardStatus))
      return Result.err({ message: 'Ineligible card status' });

    return Result.ok({ ...parsedRequest.value, memberId, brazeExternalUserId });
  }

  public async handle(request: ParsedRequest): Promise<APIGatewayResult> {
    const result = await this.redeemService.redeem(request.body.offerId, {
      memberId: request.memberId,
      brazeExternalUserId: request.brazeExternalUserId,
      companyName: request.body.companyName,
      offerName: request.body.offerName,
      clientType: request.headers['X-Client-Type'] ?? 'web',
    });

    switch (result.kind) {
      case 'Ok':
        return {
          statusCode: 200,
          data: {
            kind: result.kind,
            redemptionType: result.redemptionType,
            redemptionDetails: result.redemptionDetails,
          },
        };
      case 'RedemptionNotFound':
        return {
          statusCode: 404,
          data: {
            kind: result.kind,
            message: 'No redemption found for the given offerId',
          },
        };
      case 'MaxPerUserReached':
        return {
          statusCode: 403,
          data: {
            kind: result.kind,
            message: 'Max per user reached for the given offerId',
          },
        };
      default:
        exhaustiveCheck(result, 'Unhandled result kind');
    }
  }
}
