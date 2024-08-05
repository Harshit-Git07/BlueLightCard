import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';

import { ParsedRequest } from '../../controllers/adminApiGateway/vaultBatch/DeleteVaultBatchController';

export type DeleteVaultBatchResult = {
  kind: 'Ok';
  data: {
    vaultBatchId: string;
    batchDeleted: boolean;
    service: string;
  };
};
export interface IDeleteVaultBatchService {
  deleteVaultBatch(request: ParsedRequest): Promise<DeleteVaultBatchResult>;
}

export class DeleteVaultBatchService implements IDeleteVaultBatchService {
  static readonly key = 'DeleteVaultBatchService';
  static readonly inject = [Logger.key] as const;

  constructor(private readonly logger: ILogger) {}

  // eslint-disable-next-line require-await
  public async deleteVaultBatch(request: ParsedRequest): Promise<DeleteVaultBatchResult> {
    /**
     * hardcode values returned purely for testing infrastructure
     * final implementation will probably change this
     */
    return {
      kind: 'Ok',
      data: {
        vaultBatchId: request.body.batchId,
        batchDeleted: true,
        service: 'DeleteVaultBatchService',
      },
    };
  }
}
