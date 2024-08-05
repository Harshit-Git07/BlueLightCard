import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { z } from 'zod';

import { JsonStringSchema } from '@blc-mono/core/schemas/common';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  IUpdateVaultBatchService,
  UpdateVaultBatchService,
} from '@blc-mono/redemptions/application/services/vaultBatch/UpdateVaultBatchService';
import { PatchVaultBatchModel } from '@blc-mono/redemptions/libs/models/patchVaultBatch';

import { APIGatewayController, APIGatewayResult, ParseRequestError } from '../AdminApiGatewayController';

const UpdateVaultBatchRequestModel = z.object({
  body: JsonStringSchema.pipe(PatchVaultBatchModel),
});

export type ParsedRequest = z.infer<typeof UpdateVaultBatchRequestModel>;

export class UpdateVaultBatchController extends APIGatewayController<ParsedRequest> {
  static readonly inject = [Logger.key, UpdateVaultBatchService.key] as const;

  constructor(
    logger: ILogger,
    private readonly updateVaultBatchService: IUpdateVaultBatchService,
  ) {
    super(logger);
  }

  protected parseRequest(request: APIGatewayProxyEventV2): Result<ParsedRequest, ParseRequestError> {
    const parsedRequest = this.zodParseRequest(request, UpdateVaultBatchRequestModel);

    if (parsedRequest.isFailure) {
      return parsedRequest;
    }

    return Result.ok({
      ...parsedRequest.value,
    });
  }

  public async handle(request: ParsedRequest): Promise<APIGatewayResult> {
    const result = await this.updateVaultBatchService.updateVaultBatch(request);
    if (result.kind === 'Ok') {
      return {
        statusCode: 200,
        data: {
          vaultBatchId: result.data.vaultBatchId,
          batchUpdated: result.data.batchUpdated,
          service: result.data.service,
        },
      };
    } else {
      return {
        statusCode: 404,
        data: {
          message: 'Vault Batch failed to be updated',
        },
      };
    }
  }
}
