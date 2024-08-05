import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { z } from 'zod';

import { JsonStringSchema } from '@blc-mono/core/schemas/common';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  CreateVaultBatchService,
  ICreateVaultBatchService,
} from '@blc-mono/redemptions/application/services/vaultBatch/CreateVaultBatchService';
import { PostVaultBatchModel } from '@blc-mono/redemptions/libs/models/postVaultBatch';

import { APIGatewayController, APIGatewayResult, ParseRequestError } from '../AdminApiGatewayController';

const CreateVaultBatchRequestModel = z.object({
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
    if (result.kind === 'Ok') {
      return {
        statusCode: 200,
        data: {
          vaultBatchId: result.data.vaultBatchId,
          signedUrl: result.data.signedUrl,
          service: result.data.service,
        },
      };
    } else {
      return {
        statusCode: 404,
        data: {
          message: 'Vault Batch failed to be created',
        },
      };
    }
  }
}
