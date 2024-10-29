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

  handleError(error: unknown): APIGatewayResult {
    let errorMessage = 'An unknown error occurred';

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    return {
      statusCode: 500,
      data: {
        message: 'Internal Server Error',
        error: errorMessage,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  public async handle(request: ParsedRequest): Promise<APIGatewayResult> {
    try {
      const result = await this.paymentInitiationService.InitiatePayment(
        request.body.idempotencyKey,
        request.body.user,
        request.body.amount,
        request.body.metadata,
        request.body.description,
      );

      return {
        statusCode: 200,
        data: result,
      };
    } catch (err) {
      this.logger.error({ message: 'Error in payment initiation', error: err });

      return this.handleError(err);
    }
  }
}
