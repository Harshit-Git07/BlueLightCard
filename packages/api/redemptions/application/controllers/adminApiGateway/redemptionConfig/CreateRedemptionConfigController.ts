import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { z } from 'zod';

import { JsonStringSchema } from '@blc-mono/core/schemas/common';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  CreateRedemptionConfigService,
  DuplicateError,
  FailedToCreateError,
  ICreateRedemptionConfigService,
} from '@blc-mono/redemptions/application/services/redemptionConfig/CreateRedemptionConfigService';
import { PostRedemptionConfigModel } from '@blc-mono/redemptions/libs/models/postRedemptionConfig';

import { APIGatewayController, APIGatewayResult, ParseRequestError } from '../AdminApiGatewayController';

const CreateRedemptionConfigRequestModel = z.object({
  body: JsonStringSchema.pipe(PostRedemptionConfigModel),
});

export type ParsedRequest = z.infer<typeof CreateRedemptionConfigRequestModel>;

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
    try {
      const result = await this.createRedemptionConfigService.createRedemptionConfig(request.body);

      return {
        statusCode: 200,
        data: result.data,
      };
    } catch (e) {
      if (e instanceof DuplicateError) {
        return {
          statusCode: 409,
          data: { message: e.message },
        };
      }
      if (e instanceof FailedToCreateError) {
        return {
          statusCode: 400,
          data: { message: e.message },
        };
      }
      if (e instanceof Error) {
        return {
          statusCode: 500,
          data: { message: e.message },
        };
      }

      throw new Error(`Unhandled error creating redemption config: ${(e as Error).message}`);
    }
  }
}
