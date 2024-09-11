import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { z } from 'zod';

import { JsonStringSchema } from '@blc-mono/core/schemas/common';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  CreateRedemptionConfigService,
  ICreateRedemptionConfigService,
} from '@blc-mono/redemptions/application/services/redemptionConfig/CreateRedemptionConfigService';

import { APIGatewayController, APIGatewayResult, ParseRequestError } from '../AdminApiGatewayController';

const CreateRedemptionConfigRequestModel = z.object({
  body: JsonStringSchema.pipe(
    z.object({
      error: z.string().optional(),
    }),
  ),
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
    const parsedRequest = this.zodParseRequest(request, CreateRedemptionConfigRequestModel);

    if (parsedRequest.isFailure) {
      return parsedRequest;
    }

    return Result.ok({
      ...parsedRequest.value,
    });
  }

  public async handle(request: ParsedRequest): Promise<APIGatewayResult> {
    const result = await this.createRedemptionConfigService.createRedemptionConfig(request.body);
    if (result.kind === 'Error') {
      return {
        statusCode: 400,
        data: 'Stubbed Post Redeem Config endpoint error',
      };
    }

    return {
      statusCode: 200,
      data: 'Stubbed Post Redeem Config endpoint success',
    };
  }
}
