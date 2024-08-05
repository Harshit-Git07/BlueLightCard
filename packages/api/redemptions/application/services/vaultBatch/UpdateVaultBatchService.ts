import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';

import { ParsedRequest } from '../../controllers/adminApiGateway/vaultBatch/UpdateVaultBatchController';

export type UpdateVaultBatchResult = {
  kind: 'Ok';
  data: {
    vaultBatchId: string;
    batchUpdated: boolean;
    service: string;
  };
};
export interface IUpdateVaultBatchService {
  updateVaultBatch(request: ParsedRequest): Promise<UpdateVaultBatchResult>;
}

export class UpdateVaultBatchService implements IUpdateVaultBatchService {
  static readonly key = 'UpdateVaultBatchService';
  static readonly inject = [Logger.key] as const;

  constructor(private readonly logger: ILogger) {}

  // eslint-disable-next-line require-await
  public async updateVaultBatch(request: ParsedRequest): Promise<UpdateVaultBatchResult> {
    /**
     * hardcode values returned purely for testing infrastructure
     * final implementation will probably change this
     */
    return {
      kind: 'Ok',
      data: {
        vaultBatchId: request.body.batchId,
        batchUpdated: true,
        service: 'UpdateVaultBatchService',
      },
    };
  }
}
