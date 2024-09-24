import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { z } from 'zod';

import { JsonStringSchema } from '@blc-mono/core/schemas/common';
import { JsonValue } from '@blc-mono/core/types/json';
import { Result } from '@blc-mono/core/types/result';
import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  CreateRedemptionConfigService,
  ICreateRedemptionConfigService,
} from '@blc-mono/redemptions/application/services/redemptionConfig/CreateRedemptionConfigService';
import { PostRedemptionConfigModel } from '@blc-mono/redemptions/libs/models/postRedemptionConfig';

import { APIGatewayController, APIGatewayResult, ParseRequestError } from '../AdminApiGatewayController';

const CreateRedemptionConfigRequestModel = z.object({
  body: JsonStringSchema.pipe(PostRedemptionConfigModel),
});

export type ParsedRequest = z.infer<typeof CreateRedemptionConfigRequestModel>;
export type APIResponse = {
  statusCode: number;
  data: string;
};

export class CreateRedemptionConfigController extends APIGatewayController<ParsedRequest> {
  static readonly inject = [Logger.key, CreateRedemptionConfigService.key] as const;

  constructor(
    logger: ILogger,
    private readonly createRedemptionConfigService: ICreateRedemptionConfigService,
  ) {
    super(logger);
  }

  protected parseRequest(request: APIGatewayProxyEventV2): Result<ParsedRequest, ParseRequestError> {
    return this.zodParseRequest(request, CreateRedemptionConfigRequestModel);
  }

  public async handle(request: ParsedRequest): Promise<APIGatewayResult> {
    const result = await this.createRedemptionConfigService.createRedemptionConfig(request.body);
    switch (result.kind) {
      case 'Ok':
        return {
          statusCode: 200,
          data: result.data,
        };

      case 'Error':
        return {
          statusCode: 500,
          data: result.data,
        };

      case 'DuplicationError':
        return {
          statusCode: 409,
          data: result.data,
        };

      case 'ValidationError':
        return {
          statusCode: 400,
          data: result.data as unknown as JsonValue,
        };
      default:
        exhaustiveCheck(result, 'Unhandled result kind');
    }
  }
}
