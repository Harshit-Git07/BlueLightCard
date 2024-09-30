import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { z } from 'zod';

import { Result } from '@blc-mono/core/types/result';
import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  GetRedemptionConfigService,
  IGetRedemptionConfigService,
} from '@blc-mono/redemptions/application/services/redemptionConfig/GetRedemptionConfigService';

import { APIGatewayController, APIGatewayResult, ParseRequestError } from '../AdminApiGatewayController';

const GetRedemptionRequestModel = z.object({
  pathParameters: z.object({
    offerId: z.coerce.number(),
  }),
});

export type ParsedRequest = z.infer<typeof GetRedemptionRequestModel>;

export class GetRedemptionConfigController extends APIGatewayController<ParsedRequest> {
  static readonly inject = [Logger.key, GetRedemptionConfigService.key] as const;

  constructor(
    logger: ILogger,
    private readonly redemptionsConfigService: IGetRedemptionConfigService,
  ) {
    super(logger);
  }

  protected parseRequest(request: APIGatewayProxyEventV2): Result<ParsedRequest, ParseRequestError> {
    return this.zodParseRequest(request, GetRedemptionRequestModel);
  }

  public async handle(request: ParsedRequest): Promise<APIGatewayResult> {
    const offerId = request.pathParameters.offerId;

    const result = await this.redemptionsConfigService.getRedemptionConfig(offerId);

    switch (result.kind) {
      case 'Ok':
        return {
          statusCode: 200,
          data: result.data,
        };

      case 'RedemptionNotFound':
        return {
          statusCode: 404,
          data: {
            message: 'No redemption found for the given offerId',
          },
        };
      case 'Error':
        this.logger.error({
          message: 'Error when getting redemption config',
          context: { offerId, error: result.data.message },
        });
        return {
          statusCode: 500,
          data: {
            message: 'Internal Server Error',
          },
        };

      default:
        exhaustiveCheck(result, 'Unhandled result kind');
    }
  }
}
