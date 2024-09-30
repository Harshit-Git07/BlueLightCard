import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { z } from 'zod';

import { JsonStringSchema } from '@blc-mono/core/schemas/common';
import { Result } from '@blc-mono/core/types/result';
import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  IUpdateRedemptionConfigService,
  UpdateRedemptionConfigService,
} from '@blc-mono/redemptions/application/services/redemptionConfig/UpdateRedemptionConfigService';
import { PatchRedemptionModel } from '@blc-mono/redemptions/libs/models/PatchRedemptionModel';

import { APIGatewayController, APIGatewayResult, ParseRequestError } from '../AdminApiGatewayController';

const PatchRedemptionModelRequest = z.object({
  body: JsonStringSchema.pipe(PatchRedemptionModel),
});

export type PatchRedemptionModelRequest = z.infer<typeof PatchRedemptionModelRequest>;
export type PatchRedemptionModelRequestBody = PatchRedemptionModelRequest['body'];

export class UpdateRedemptionConfigController extends APIGatewayController<PatchRedemptionModelRequest> {
  static readonly inject = [Logger.key, UpdateRedemptionConfigService.key] as const;

  constructor(
    logger: ILogger,
    private readonly updateRedemptionConfigService: IUpdateRedemptionConfigService,
  ) {
    super(logger);
  }

  protected parseRequest(request: APIGatewayProxyEventV2): Result<PatchRedemptionModelRequest, ParseRequestError> {
    return this.zodParseRequest(request, PatchRedemptionModelRequest);
  }

  public async handle(request: PatchRedemptionModelRequest): Promise<APIGatewayResult> {
    const results = await this.updateRedemptionConfigService.updateRedemptionConfig(request.body);

    switch (results.kind) {
      case 'Ok':
        return {
          statusCode: 200,
          data: results.data,
        };
      case 'Error':
        return {
          statusCode: 500,
          data: {
            message: 'Internal Server Error',
          },
        };
      case 'RedemptionNotFound':
        return {
          statusCode: 404,
          data: {
            message: 'Redemption not found with given ID',
          },
        };
      default:
        return exhaustiveCheck(results, 'Unhandled result');
    }
  }
}
