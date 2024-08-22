import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { z } from 'zod';

import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import GetVaultBatchService, {
  IGetVaultBatchService,
} from '@blc-mono/redemptions/application/services/vault/GetVaultBatchService';

import { APIGatewayController, APIGatewayResult, ParseRequestError } from '../AdminApiGatewayController';

const GetVaultBatchRequestModel = z.object({
  pathParameters: z.object({
    vaultId: z.string(),
  }),
});

export type ParsedRequest = z.infer<typeof GetVaultBatchRequestModel>;

export class GetVaultBatchController extends APIGatewayController<ParsedRequest> {
  static readonly inject = [Logger.key, GetVaultBatchService.key] as const;

  constructor(
    logger: ILogger,
    private readonly getVaultBatchService: IGetVaultBatchService,
  ) {
    super(logger);
  }

  protected parseRequest(request: APIGatewayProxyEventV2): Result<ParsedRequest, ParseRequestError> {
    const parsedRequest = this.zodParseRequest(request, GetVaultBatchRequestModel);

    if (parsedRequest.isFailure) {
      return parsedRequest;
    }

    return Result.ok({
      ...parsedRequest.value,
    });
  }

  public async handle(request: ParsedRequest): Promise<APIGatewayResult> {
    const vaultId = request.pathParameters.vaultId;
    const result = await this.getVaultBatchService.getVaultBatch(vaultId);

    if (result.kind === 'Ok') {
      return {
        statusCode: 200,
        data: result.data,
      };
    }

    return {
      statusCode: 404,
      data: {
        message: 'No Vault found with this id',
      },
    };
  }
}
