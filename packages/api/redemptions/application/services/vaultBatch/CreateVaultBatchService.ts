import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';

import { ParsedRequest } from '../../controllers/adminApiGateway/vaultBatch/CreateVaultBatchController';

export type CreateVaultBatchResult = {
  kind: 'Ok';
  data: {
    vaultBatchId: string;
    signedUrl: string;
    service: string;
  };
};
export interface ICreateVaultBatchService {
  createVaultBatch(request: ParsedRequest): Promise<CreateVaultBatchResult>;
}

export class CreateVaultBatchService implements ICreateVaultBatchService {
  static readonly key = 'CreateVaultBatchService';
  static readonly inject = [Logger.key] as const;

  constructor(private readonly logger: ILogger) {}

  // eslint-disable-next-line require-await
  public async createVaultBatch(request: ParsedRequest): Promise<CreateVaultBatchResult> {
    /**
     * hardcode values returned purely for testing infrastructure
     * final implementation will probably change this
     */
    return {
      kind: 'Ok',
      data: {
        vaultBatchId: '1111-1111-1111-1111',
        signedUrl: 'S3Bucket/VaultBatchId',
        service: 'CreateVaultBatchService',
      },
    };
  }
}
