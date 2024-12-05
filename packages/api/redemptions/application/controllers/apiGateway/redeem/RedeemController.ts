import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { z } from 'zod';

import { JsonStringSchema } from '@blc-mono/core/schemas/common';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { CardStatusHelper, ICardStatusHelper } from '@blc-mono/redemptions/application/helpers/cardStatus';
import { TokenHelper } from '@blc-mono/redemptions/application/helpers/TokenHelper';
import { AlreadyEnteredBallotError } from '@blc-mono/redemptions/application/services/redeem/strategies/redeemBallotStrategy/AlreadyEnteredBallotError';
import { BallotExpiredError } from '@blc-mono/redemptions/application/services/redeem/strategies/redeemBallotStrategy/BallotExpiredError';
import { DomainError } from '@blc-mono/redemptions/application/services/redeem/strategies/redeemVaultStrategy/helpers/DomainError';
import { MaxPerUserReachedError } from '@blc-mono/redemptions/application/services/redeem/strategies/redeemVaultStrategy/helpers/MaxPerUserReachedError';
import { NoCodesAvailableError } from '@blc-mono/redemptions/application/services/redeem/strategies/redeemVaultStrategy/helpers/NoCodesAvailableError';
import { NotFoundError } from '@blc-mono/redemptions/application/services/redeem/strategies/redeemVaultStrategy/helpers/NotFoundError';
import { RedemptionConfigError } from '@blc-mono/redemptions/application/services/redeem/strategies/redeemVaultStrategy/helpers/RedemptionConfigError';
import { PostRedeemModel } from '@blc-mono/redemptions/libs/models/postRedeem';

import { IRedeemService, RedeemService } from '../../../services/redeem/RedeemService';
import {
  APIGatewayController,
  APIGatewayResult,
  ParseErrorKind,
  ParseRequestError,
  ParseRequestResult,
} from '../ApiGatewayController';

const RedeemRequestModel = z.object({
  body: JsonStringSchema.pipe(PostRedeemModel),
  headers: z.object({
    'x-client-type': z.optional(z.enum(['web', 'mobile'])),
    authorization: z.string(),
  }),
});

export type ParsedRequest = z.infer<typeof RedeemRequestModel> & {
  memberId: string;
  brazeExternalUserId: string;
  memberEmail: string;
};

export class RedeemController extends APIGatewayController<ParsedRequest> {
  static readonly inject = [Logger.key, RedeemService.key, CardStatusHelper.key] as const;

  constructor(
    logger: ILogger,
    private readonly redeemService: IRedeemService,
    private readonly cardStatus: ICardStatusHelper,
  ) {
    super(logger);
  }

  protected async parseRequest(
    request: APIGatewayProxyEventV2,
  ): Promise<Result<ParsedRequest, ParseRequestResult | ParseRequestError>> {
    const requestWithLowercaseHeaders = {
      ...request,
      headers: Object.entries(request.headers).reduce((prev, [key, value]) => {
        return { ...prev, [key.toLowerCase()]: value };
      }, {}),
    };

    const parsedRequest = this.zodParseRequest(requestWithLowercaseHeaders, RedeemRequestModel);

    if (parsedRequest.isFailure) {
      return parsedRequest;
    }

    const parsedBearerToken = TokenHelper.removeBearerPrefix(parsedRequest.value.headers.authorization);
    const tokenPayloadResult = TokenHelper.unsafeExtractDataFromToken(parsedBearerToken);

    if (tokenPayloadResult.isFailure) {
      this.logger.error({
        message: 'Error parsing bearer token from header',
        error: tokenPayloadResult.error,
      });
      return Result.err({ cause: 'Invalid token', message: 'The token was invalid or malformed' });
    }

    const memberId = tokenPayloadResult.value['custom:blc_old_id'];
    const brazeExternalUserId = tokenPayloadResult.value['custom:blc_old_uuid'];
    const memberEmail = tokenPayloadResult.value['email'];

    if (typeof memberId !== 'string')
      return Result.err({ kind: ParseErrorKind.RequestValidationMemberId, message: 'Invalid memberId in token' });
    if (typeof brazeExternalUserId !== 'string')
      return Result.err({
        kind: ParseErrorKind.RequestValidationBrazeExternalUserId,
        message: 'Invalid brazeExternalUserId in token',
      });
    if (typeof memberEmail !== 'string')
      return Result.err({ kind: ParseErrorKind.RequestValidationMemberEmail, message: 'Invalid memberEmail in token' });

    const isValidCardStatus = await this.cardStatus.validateCardStatus(parsedBearerToken);

    if (!isValidCardStatus) {
      return Result.err({ kind: ParseErrorKind.RequestValidationCardStatus, message: 'Ineligible card status' });
    }

    return Result.ok({ ...parsedRequest.value, memberId, brazeExternalUserId, memberEmail });
  }

  public async handle(request: ParsedRequest): Promise<APIGatewayResult> {
    try {
      const result = await this.redeemService.redeem(request.body.offerId, {
        memberId: request.memberId,
        brazeExternalUserId: request.brazeExternalUserId,
        companyName: request.body.companyName,
        offerName: request.body.offerName,
        clientType: request.headers['x-client-type'] ?? 'web',
        memberEmail: request.memberEmail,
      });

      return {
        statusCode: 200,
        data: {
          kind: result.kind,
          redemptionType: result.redemptionType,
          redemptionDetails: result.redemptionDetails,
        },
      };
    } catch (e) {
      if (!(e instanceof DomainError)) {
        throw e;
      }

      const statusCode = this.getStatusCodeFromError(e);
      if (!statusCode) {
        throw e;
      }

      return {
        statusCode,
        data: {
          kind: e.kind ?? e.name,
          message: e.message,
        },
      };
    }
  }

  private getStatusCodeFromError(e: DomainError) {
    const statusCodeMap = new Map<string, number>();
    statusCodeMap.set(NotFoundError.name, 404);
    statusCodeMap.set(MaxPerUserReachedError.name, 403);
    statusCodeMap.set(NoCodesAvailableError.name, 403);
    statusCodeMap.set(RedemptionConfigError.name, 409);
    statusCodeMap.set(BallotExpiredError.name, 404);
    statusCodeMap.set(AlreadyEnteredBallotError.name, 409);
    return statusCodeMap.get(e.name);
  }
}
