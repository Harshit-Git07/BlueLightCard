import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { z } from 'zod';

import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  IPaymentEventsService,
  PaymentEventsService,
} from '@blc-mono/payments/application/services/paymentEvents/PaymentEventsService';

import { APIGatewayController, APIGatewayResult, ParseRequestError, ParseRequestResult } from '../ApiGatewayController';

const GetPaymentEventsRequestModel = z.object({
  headers: z.object({
    'x-client-type': z.optional(z.enum(['web', 'mobile'])),
  }),
  queryStringParameters: z.object({
    memberId: z.string(),
  }),
});

export type ParsedRequest = z.infer<typeof GetPaymentEventsRequestModel>;

export class PaymentEventsController extends APIGatewayController<ParsedRequest> {
  static readonly inject = [Logger.key, PaymentEventsService.key] as const;

  constructor(
    logger: ILogger,
    private readonly paymentEventsService: IPaymentEventsService,
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

    const parsedRequest = this.zodParseRequest(requestWithLowercaseHeaders, GetPaymentEventsRequestModel);

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
      const result = await this.paymentEventsService.getPaymentEvents(request.queryStringParameters.memberId);

      return {
        statusCode: 200,
        data: result,
      };
    } catch (err) {
      this.logger.error({ message: 'Error querying payment events', error: err });

      return this.handleError(err);
    }
  }
}
