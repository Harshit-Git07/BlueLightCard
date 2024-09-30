import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { z } from 'zod';

import { JsonStringSchema } from '@blc-mono/core/schemas/common';
import { Result } from '@blc-mono/core/types/result';
import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { CallbackService, ICallbackService } from '@blc-mono/redemptions/application/services/callback/CallbackService';
import { PostCallbackModel } from '@blc-mono/redemptions/libs/models/postCallback';

import { APIGatewayController, APIGatewayResult, ParseRequestError } from '../AdminApiGatewayController';

const CallbackRequestModel = z.object({
  body: JsonStringSchema.pipe(PostCallbackModel),
});

export type ParsedRequest = z.infer<typeof CallbackRequestModel>;

export class CallbackController extends APIGatewayController<ParsedRequest> {
  static readonly inject = [Logger.key, CallbackService.key] as const;

  constructor(
    logger: ILogger,
    private readonly callbackService: ICallbackService,
  ) {
    super(logger);
  }

  protected parseRequest(request: APIGatewayProxyEventV2): Result<ParsedRequest, ParseRequestError> {
    return this.zodParseRequest(request, CallbackRequestModel);
  }

  public async handle(request: ParsedRequest): Promise<APIGatewayResult> {
    const result = await this.callbackService.handle(request.body);

    switch (result.kind) {
      case 'NoContent':
        return {
          statusCode: 204,
        };
      case 'Error':
        return {
          statusCode: 500,
          data: {
            message: 'Internal server error',
          },
        };
      default:
        exhaustiveCheck(result.kind, 'Unhandled result kind');
    }
  }
}
