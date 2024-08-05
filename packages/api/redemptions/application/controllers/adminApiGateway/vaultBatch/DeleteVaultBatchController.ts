import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { z } from 'zod';

import { JsonStringSchema } from '@blc-mono/core/schemas/common';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  DeleteVaultBatchService,
  IDeleteVaultBatchService,
} from '@blc-mono/redemptions/application/services/vaultBatch/DeleteVaultBatchService';
import { DeleteVaultBatchModel } from '@blc-mono/redemptions/libs/models/deleteVaultBatch';

import { APIGatewayController, APIGatewayResult, ParseRequestError } from '../AdminApiGatewayController';

const DeleteVaultBatchRequestModel = z.object({
  body: JsonStringSchema.pipe(DeleteVaultBatchModel),
});

export type ParsedRequest = z.infer<typeof DeleteVaultBatchRequestModel>;

export class DeleteVaultBatchController extends APIGatewayController<ParsedRequest> {
  static readonly inject = [Logger.key, DeleteVaultBatchService.key] as const;

  constructor(
    logger: ILogger,
    private readonly deleteVaultBatchService: IDeleteVaultBatchService,
  ) {
    super(logger);
  }

  protected parseRequest(request: APIGatewayProxyEventV2): Result<ParsedRequest, ParseRequestError> {
    const parsedRequest = this.zodParseRequest(request, DeleteVaultBatchRequestModel);

    if (parsedRequest.isFailure) {
      return parsedRequest;
    }

    return Result.ok({
      ...parsedRequest.value,
    });
  }

  public async handle(request: ParsedRequest): Promise<APIGatewayResult> {
    const result = await this.deleteVaultBatchService.deleteVaultBatch(request);
    if (result.kind === 'Ok') {
      return {
        statusCode: 200,
        data: {
          vaultBatchId: result.data.vaultBatchId,
          batchDeleted: result.data.batchDeleted,
          service: result.data.service,
        },
      };
    } else {
      return {
        statusCode: 404,
        data: {
          message: 'Vault Batch failed to be deleted',
        },
      };
    }
  }
}
