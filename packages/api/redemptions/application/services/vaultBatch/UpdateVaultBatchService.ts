import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  ITransactionManager,
  TransactionManager,
} from '@blc-mono/redemptions/infrastructure/database/TransactionManager';

import { IVaultBatchesRepository, VaultBatchesRepository } from '../../repositories/VaultBatchesRepository';
import { IVaultCodesRepository, VaultCodesRepository } from '../../repositories/VaultCodesRepository';

export type UpdateVaultBatchResult =
  | {
      kind: 'ErrorUpdatingVaultBatch';
      message: string;
    }
  | {
      kind: 'ErrorUpdatingVaultCodes';
      message: string;
    }
  | {
      kind: 'VaultBatchNotFound';
      message: string;
    }
  | {
      kind: 'VaultCodesNotFound';
      message: string;
    }
  | {
      kind: 'NoContent';
      message?: never;
    };
export interface IUpdateVaultBatchService {
  handle(batchId: string, expiry: Date): Promise<UpdateVaultBatchResult>;
}

export class UpdateVaultBatchService implements IUpdateVaultBatchService {
  static readonly key = 'UpdateVaultBatchService';
  static readonly inject = [
    Logger.key,
    VaultBatchesRepository.key,
    VaultCodesRepository.key,
    TransactionManager.key,
  ] as const;

  constructor(
    private readonly logger: ILogger,
    private vaultBatchesRepo: IVaultBatchesRepository,
    private vaultCodesRepo: IVaultCodesRepository,
    private transactionManager: ITransactionManager,
  ) {}

  public async handle(batchId: string, expiry: Date): Promise<UpdateVaultBatchResult> {
    const vaultBatch = await this.vaultBatchesRepo.findOneById(batchId);
    if (!vaultBatch) {
      this.logger.error({
        message: 'Update Vault Batch - Vault Batch not found',
        context: {
          batchId,
          expiry,
        },
      });
      return {
        kind: 'VaultBatchNotFound',
        message: 'Vault Batch not found',
      };
    }

    const vaultCodes = await this.vaultCodesRepo.findManyByBatchId(batchId);
    if (!vaultCodes) {
      this.logger.error({
        message: 'Update Vault Batch - Vault Codes not found',
        context: {
          batchId,
          expiry,
        },
      });
      return {
        kind: 'VaultCodesNotFound',
        message: 'Vault Codes not found',
      };
    }

    return this.transactionManager.withTransaction(async (transaction) => {
      const transactionConnection = { db: transaction };
      const vaultBatchesRepo = this.vaultBatchesRepo.withTransaction(transactionConnection);
      const vaultCodesRepo = this.vaultCodesRepo.withTransaction(transactionConnection);
      const vaultBatchesUpdated = await vaultBatchesRepo.updateOneById(batchId, { expiry });
      if (!vaultBatchesUpdated) {
        this.logger.error({
          message: 'Update Vault Batch - Vault Batch not updated',
          context: {
            batchId,
            expiry,
          },
        });
        return {
          kind: 'ErrorUpdatingVaultBatch',
          message: 'Vault Batch not updated',
        };
      }
      const vaultCodesUpdated = await vaultCodesRepo.updateManyByBatchId(batchId, { expiry });
      if (!vaultCodesUpdated) {
        this.logger.error({
          message: 'Update Vault Batch - Vault Code not updated',
          context: {
            batchId,
            expiry,
          },
        });
        return {
          kind: 'ErrorUpdatingVaultCodes',
          message: 'Vault Codes not updated',
        };
      }
      return {
        kind: 'NoContent',
      };
    });
  }
}
