import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { z } from 'zod';

import { JsonStringSchema } from '@blc-mono/core/schemas/common';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { PostCheckoutModel } from '@blc-mono/orders/application/models/postCheckout';
import { CheckoutService, ICheckoutService } from '@blc-mono/orders/application/services/checkout/CheckoutService';
import { TokenHelper } from '@blc-mono/redemptions/application/helpers/TokenHelper';

import {
  APIGatewayController,
  APIGatewayResult,
  ParseErrorKind,
  ParseRequestError,
  ParseRequestResult,
} from '../ApiGatewayController';

const CheckoutRequestModel = z.object({
  body: JsonStringSchema.pipe(PostCheckoutModel),
  headers: z.object({
    'x-client-type': z.optional(z.enum(['web', 'mobile'])),
    authorization: z.string(),
  }),
});

export type UserContext = { memberId: string; brazeExternalId: string; name: string };

export type ParsedRequest = z.infer<typeof CheckoutRequestModel> & { user: UserContext };

export class CheckoutController extends APIGatewayController<ParsedRequest> {
  static readonly inject = [Logger.key, CheckoutService.key] as const;

  constructor(
    logger: ILogger,
    private readonly checkoutService: ICheckoutService,
  ) {
    super(logger);
  }

  protected parseRequest(
    request: APIGatewayProxyEventV2,
  ): Result<ParsedRequest, ParseRequestResult | ParseRequestError> {
    const requestWithLowercaseHeaders = {
      ...request,
      headers: Object.entries(request.headers).reduce((prev, [key, value]) => {
        return { ...prev, [key.toLowerCase()]: value };
      }, {}),
    };

    const parsedRequest = this.zodParseRequest(requestWithLowercaseHeaders, CheckoutRequestModel);

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
    const brazeExternalId = tokenPayloadResult.value['custom:blc_old_uuid'];
    const firstName = tokenPayloadResult.value['firstname'];
    const surName = tokenPayloadResult.value['surname'];

    if (typeof memberId !== 'string')
      return Result.err({ kind: ParseErrorKind.RequestValidationMemberId, message: 'Invalid memberId in token' });
    if (typeof brazeExternalId !== 'string')
      return Result.err({
        kind: ParseErrorKind.RequestValidationBrazeExternalUserId,
        message: 'Invalid brazeExternalUserId in token',
      });
    if (typeof firstName !== 'string' || typeof surName !== 'string')
      return Result.err({
        kind: ParseErrorKind.RequestValidationName,
        message: 'Invalid firstname and surname in token',
      });

    const name = `${firstName} ${surName}`;

    return Result.ok({ ...parsedRequest.value, user: { memberId, brazeExternalId, name } });
  }

  public async handle(request: ParsedRequest): Promise<APIGatewayResult> {
    const result = await this.checkoutService.checkout(request.body, request.user);

    return {
      statusCode: 200,
      data: result,
    };

    //TODO: do error handling
    // switch (result.kind) {
    //   case 'Ok':
    //     return {
    //       statusCode: 200,
    //       data: {
    //         kind: result.kind,
    //         redemptionType: result.redemptionType,
    //         redemptionDetails: result.redemptionDetails,
    //       },
    //     };
    //   case 'RedemptionNotFound':
    //     return {
    //       statusCode: 404,
    //       data: {
    //         kind: result.kind,
    //         message: 'No redemption found for the given offerId',
    //       },
    //     };
    //   case 'MaxPerUserReached':
    //     return {
    //       statusCode: 403,
    //       data: {
    //         kind: result.kind,
    //         message: 'Max per user reached for the given offerId',
    //       },
    //     };
    //   default:
    //     exhaustiveCheck(result, 'Unhandled result kind');
    // }
  }
}
