import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { z } from 'zod';

import { JsonStringSchema } from '@blc-mono/core/schemas/common';
import { Result } from '@blc-mono/core/types/result';
import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  CreateVaultBatchService,
  ICreateVaultBatchService,
} from '@blc-mono/redemptions/application/services/vaultBatch/CreateVaultBatchService';
import { PostVaultBatchModel } from '@blc-mono/redemptions/libs/models/postVaultBatch';

import { APIGatewayController, APIGatewayResult, ParseRequestError } from '../AdminApiGatewayController';

const CreateVaultBatchRequestModel = z.object({
  pathParameters: z.object({
    vaultId: z.string(),
  }),
  body: JsonStringSchema.pipe(PostVaultBatchModel),
});

export type ParsedRequest = z.infer<typeof CreateVaultBatchRequestModel>;

export class CreateVaultBatchController extends APIGatewayController<ParsedRequest> {
  static readonly inject = [Logger.key, CreateVaultBatchService.key] as const;

  constructor(
    logger: ILogger,
    private readonly createVaultBatchService: ICreateVaultBatchService,
  ) {
    super(logger);
  }

  protected parseRequest(request: APIGatewayProxyEventV2): Result<ParsedRequest, ParseRequestError> {
    const parsedRequest = this.zodParseRequest(request, CreateVaultBatchRequestModel);

    if (parsedRequest.isFailure) {
      return parsedRequest;
    }

    return Result.ok({
      ...parsedRequest.value,
    });
  }

  public async handle(request: ParsedRequest): Promise<APIGatewayResult> {
    const result = await this.createVaultBatchService.createVaultBatch(request);

    switch (result.kind) {
      case 'Ok':
        return {
          statusCode: 200,
          data: {
            id: result.data.id,
            vaultId: result.data.vaultId,
            uploadUrl: result.data.uploadUrl,
          },
        };
      case 'Error':
        return {
          statusCode: 404,
          data: {
            message: result.data.message,
          },
        };

      default:
        exhaustiveCheck(result, 'Unhandled result kind');
    }
  }
}
