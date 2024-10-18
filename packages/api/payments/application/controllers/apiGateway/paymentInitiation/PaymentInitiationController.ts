import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { z } from 'zod';

import { JsonStringSchema } from '@blc-mono/core/schemas/common';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { PostPaymentInitiationModel } from '@blc-mono/payments/application/models/postPaymentInitiation';
import {
  IPaymentInitiationService,
  PaymentInitiationService,
} from '@blc-mono/payments/application/services/paymentInitiation/PaymentInitiationService';

import {
  APIGatewayController,
  APIGatewayResult,
  ParseErrorKind,
  ParseRequestError,
  ParseRequestResult,
} from '../ApiGatewayController';

const PaymentInitiationRequestModel = z.object({
  body: JsonStringSchema.pipe(PostPaymentInitiationModel),
  headers: z.object({
    'x-client-type': z.optional(z.enum(['web', 'mobile'])),
  }),
});

export type ParsedRequest = z.infer<typeof PaymentInitiationRequestModel>;

export class PaymentInitiationController extends APIGatewayController<ParsedRequest> {
  static readonly inject = [Logger.key, PaymentInitiationService.key] as const;

  constructor(
    logger: ILogger,
    private readonly paymentInitiationService: IPaymentInitiationService,
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

    const parsedRequest = this.zodParseRequest(requestWithLowercaseHeaders, PaymentInitiationRequestModel);

    if (parsedRequest.isFailure) {
      return parsedRequest;
    }

    return Result.ok({ ...parsedRequest.value });
  }

  public async handle(request: ParsedRequest): Promise<APIGatewayResult> {
    const result = await this.paymentInitiationService.InitiatePayment(
      request.body.idempotencyKey,
      request.body.amount,
      request.body.metadata,
    );

    return {
      statusCode: 200,
      data: result,
    };

    //TODO: error handling
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
