import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { z } from 'zod';

import { Result } from '@blc-mono/core/types/result';
import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  DeleteVaultBatchService,
  IDeleteVaultBatchService,
} from '@blc-mono/redemptions/application/services/vaultBatch/DeleteVaultBatchService';

import { APIGatewayController, APIGatewayResult, ParseRequestError } from '../AdminApiGatewayController';

const DeleteVaultBatchRequestModel = z.object({
  pathParameters: z.object({
    batchId: z.string(),
  }),
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
    switch (result.kind) {
      case 'Ok':
        return {
          statusCode: 200,
          data: {
            vaultBatchId: result.data.vaultBatchId,
            vaultBatchDeleted: result.data.vaultBatchDeleted,
            vaultCodesDeleted: result.data.vaultCodesDeleted,
            countCodesDeleted: result.data.countCodesDeleted,
            message: result.data.message,
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
