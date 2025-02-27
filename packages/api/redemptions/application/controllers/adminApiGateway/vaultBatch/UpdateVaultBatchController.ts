import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { z } from 'zod';

import { JsonStringSchema } from '@blc-mono/core/schemas/common';
import { Result } from '@blc-mono/core/types/result';
import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  IUpdateVaultBatchService,
  UpdateVaultBatchService,
} from '@blc-mono/redemptions/application/services/vaultBatch/UpdateVaultBatchService';
import { PatchVaultBatchModel } from '@blc-mono/redemptions/libs/models/patchVaultBatch';

import { APIGatewayController, APIGatewayResult, ParseRequestError } from '../AdminApiGatewayController';

const UpdateVaultBatchRequestModel = z.object({
  pathParameters: z.object({
    batchId: z.string(),
  }),
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

    const expiryDateIsInvalid =
      !z.string().datetime().safeParse(parsedRequest.value.body.expiry).success ||
      new Date(parsedRequest.value.body.expiry) < new Date();
    if (expiryDateIsInvalid) {
      return Result.err({
        statusCode: 400,
        data: {
          message: 'Invalid expiry date',
        },
      });
    }

    return Result.ok({
      ...parsedRequest.value,
    });
  }

  public async handle(request: ParsedRequest): Promise<APIGatewayResult> {
    const batchId = request.pathParameters.batchId;
    const { expiry } = request.body;
    const result = await this.updateVaultBatchService.handle(batchId, new Date(expiry));

    switch (result.kind) {
      case 'NoContent':
        return {
          statusCode: 204,
        };
      case 'VaultBatchNotFound':
      case 'VaultCodesNotFound':
        return {
          statusCode: 404,
          data: {
            message: result.message,
          },
        };
      case 'ErrorUpdatingVaultBatch':
      case 'ErrorUpdatingVaultCodes':
        return {
          statusCode: 400,
          data: {
            message: result.message,
          },
        };
      default:
        exhaustiveCheck(result, 'Unhandled result kind');
    }
  }
}
