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
import { PatchRedemptionConfigModel } from '@blc-mono/redemptions/libs/models/patchRedemptionConfig';

import { APIGatewayController, APIGatewayResult, ParseRequestError } from '../AdminApiGatewayController';

const UpdateRedemptionConfigRequestModel = z.object({
  pathParameters: z.object({
    offerId: z.coerce.string(),
  }),
  body: JsonStringSchema.pipe(PatchRedemptionConfigModel),
});

export type ParsedRequest = z.infer<typeof UpdateRedemptionConfigRequestModel>;

export class UpdateRedemptionConfigController extends APIGatewayController<ParsedRequest> {
  static readonly inject = [Logger.key, UpdateRedemptionConfigService.key] as const;

  constructor(
    logger: ILogger,
    private readonly updateRedemptionConfigService: IUpdateRedemptionConfigService,
  ) {
    super(logger);
  }

  protected parseRequest(request: APIGatewayProxyEventV2): Result<ParsedRequest, ParseRequestError> {
    return this.zodParseRequest(request, UpdateRedemptionConfigRequestModel);
  }

  public async handle(request: ParsedRequest): Promise<APIGatewayResult> {
    const offerId = request.pathParameters.offerId;
    const results = await this.updateRedemptionConfigService.updateRedemptionConfig(offerId, request.body);

    switch (results.kind) {
      case 'Ok':
        return {
          statusCode: 200,
          data: results.data,
        };
      case 'Error':
        return {
          statusCode: 500,
          data: results.data,
        };
      case 'UrlPayloadOfferIdMismatch':
      case 'RedemptionNotFound':
      case 'RedemptionOfferCompanyIdMismatch':
      case 'RedemptionTypeMismatch':
      case 'GenericNotFound':
      case 'GenericCodeEmpty':
      case 'VaultNotFound':
      case 'MaxPerUserError':
      case 'BallotNotFound':
        return {
          statusCode: 404,
          data: results.data,
        };
      default:
        return exhaustiveCheck(results, 'Unhandled result');
    }
  }
}
