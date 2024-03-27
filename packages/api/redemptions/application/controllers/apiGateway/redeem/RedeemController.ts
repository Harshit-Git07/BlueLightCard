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
  headers: z.object({
    Authorization: z.string(),
  }),
});
type RedeemRequestModel = z.infer<typeof RedeemRequestModel>;
type ParsedRequest = RedeemRequestModel & { memberId: string; brazeExternalUserId: string };

export class RedeemController extends APIGatewayController<RedeemRequestModel> {
  static readonly inject = [Logger.key, RedeemService.key] as const;

  constructor(
    protected readonly logger: ILogger,
    private readonly redeemService: IRedeemService,
  ) {
    super();
  }

  protected parseRequest(request: APIGatewayProxyEventV2): Result<ParsedRequest, ParseRequestError> {
    const parsedRequest = this.zodParseRequest(request, RedeemRequestModel);

    if (parsedRequest.isFailure) {
      return parsedRequest;
    }

    const parsedBearerToken = this.parseBearerToken(parsedRequest.value.headers.Authorization);

    if (parsedBearerToken.isFailure) {
      return parsedBearerToken;
    }

    const tokenPayloadResult = this.unsafeExtractDataFromToken(parsedBearerToken.value);

    if (tokenPayloadResult.isFailure) {
      return tokenPayloadResult;
    }

    const memberId = tokenPayloadResult.value['custom:blc_old_id'];
    const brazeExternalUserId = tokenPayloadResult.value['custom:blc_old_uuid'];
    if (typeof memberId !== 'string') return Result.err({ message: 'Invalid memberId in token' });
    if (typeof brazeExternalUserId !== 'string') return Result.err({ message: 'Invalid brazeExternalUserId in token' });

    return Result.ok({ ...parsedRequest.value, memberId, brazeExternalUserId });
  }

  public async handle(request: ParsedRequest): Promise<APIGatewayResult> {
    const result = await this.redeemService.redeem(request.body.offerId, {
      memberId: request.memberId,
      brazeExternalUserId: request.brazeExternalUserId,
      companyName: request.body.companyName,
      offerName: request.body.offerName,
    });

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
      // Generic redemption
      case 'GenericNotFound':
        return {
          statusCode: 500,
          data: {
            message: 'No generic found for the given offerId',
          },
        };
      // Vault redemption
      case 'VaultNotFound':
        return {
          statusCode: 500,
          data: {
            message: 'No vault found for the given offerId',
          },
        };
      case 'MaxPerUserReached':
        return {
          statusCode: 403,
          data: {
            message: 'Max per user reached for the given offerId',
          },
        };
      case 'ErrorWhileRedeemingVault':
        this.logger.error({
          message: `Error while redeeming vault for the given offerId`,
          context: {
            kind: result.kind,
          },
        });
        return {
          statusCode: 500,
          data: {
            message: 'Error while redeeming vault for the given offerId',
          },
        };
      default:
        exhaustiveCheck(result, 'Unhandled result kind');
    }
  }
}
