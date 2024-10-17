import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  IVaultBatchesRepository,
  VaultBatchesRepository,
} from '@blc-mono/redemptions/application/repositories/VaultBatchesRepository';
import {
  IVaultCodesRepository,
  VaultCodesRepository,
} from '@blc-mono/redemptions/application/repositories/VaultCodesRepository';
import {
  ITransactionManager,
  TransactionManager,
} from '@blc-mono/redemptions/infrastructure/database/TransactionManager';

import { ParsedRequest } from '../../controllers/adminApiGateway/vaultBatch/DeleteVaultBatchController';

export type DeleteVaultBatchError = {
  kind: 'Error';
  data: {
    message: string;
  };
};

export type DeleteVaultBatchResult = {
  kind: 'Ok';
  data: {
    vaultBatchId: string;
    vaultBatchDeleted: boolean;
    vaultCodesDeleted: boolean;
    countCodesDeleted: number;
    message: string;
  };
};

export interface IDeleteVaultBatchService {
  deleteVaultBatch(request: ParsedRequest): Promise<DeleteVaultBatchResult | DeleteVaultBatchError>;
}

export class DeleteVaultBatchService implements IDeleteVaultBatchService {
  static readonly key = 'DeleteVaultBatchService';
  static readonly inject = [
    Logger.key,
    VaultBatchesRepository.key,
    VaultCodesRepository.key,
    TransactionManager.key,
  ] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly vaultBatchesRepository: IVaultBatchesRepository,
    private readonly vaultCodesRepository: IVaultCodesRepository,
    private readonly transactionManager: ITransactionManager,
  ) {}

  // eslint-disable-next-line require-await
  public async deleteVaultBatch(request: ParsedRequest): Promise<DeleteVaultBatchResult | DeleteVaultBatchError> {
    const batchId = request.pathParameters.batchId;

    const vaultBatch = await this.vaultBatchesRepository.findOneById(batchId);
    if (!vaultBatch) {
      return this.deleteBatchError(batchId, 'the vault batch does not exist');
    }

    return await this.transactionManager.withTransaction(async (transaction) => {
      const transactionConnection = { db: transaction };

      const vaultBatchTransaction = this.vaultBatchesRepository.withTransaction(transactionConnection);
      const vaultCodesTransaction = this.vaultCodesRepository.withTransaction(transactionConnection);

      /**
       * determine unclaimed and claimed codes for the batch
       * we require unclaimed codes to determine if error for delete
       */
      const vaultCodesUnclaimedForBatch = await vaultCodesTransaction.findUnclaimedCodesByBatchId(batchId);
      const batchHasUnclaimedCodes = vaultCodesUnclaimedForBatch.length > 0;

      const vaultCodesClaimedForBatch = await vaultCodesTransaction.findClaimedCodesByBatchId(batchId);
      const batchHasClaimedCodes = vaultCodesClaimedForBatch.length > 0;

      if (!batchHasUnclaimedCodes && !batchHasClaimedCodes) {
        /**
         * delete batch only as no codes to delete
         */
        return this.deleteBatchOnly(batchId, vaultBatchTransaction);
      } else if (batchHasUnclaimedCodes && !batchHasClaimedCodes) {
        /**
         * delete batch and codes as only has unclaimed codes
         */
        return this.deleteBatchAndCodes(batchId, vaultBatchTransaction, vaultCodesTransaction);
      } else if (batchHasUnclaimedCodes && batchHasClaimedCodes) {
        /**
         * delete unclaimed codes only as claimed codes cannot be deleted, and therefore we cannot delete the batch
         */
        return this.deleteCodesOnly(batchId, vaultCodesClaimedForBatch.length, vaultCodesTransaction);
      } else {
        /**
         * (!batchHasUnclaimedCodes && batchHasClaimedCodes)
         * DO NOT DELETE anything as batch only has claimed codes
         */
        return this.deleteBatchSuccess(
          batchId,
          false,
          false,
          0,
          `batch has ${vaultCodesClaimedForBatch.length} claimed codes only, nothing deleted`,
        );
      }
    });
  }

  private async deleteBatchOnly(
    batchId: string,
    vaultBatchTransaction: VaultBatchesRepository,
  ): Promise<DeleteVaultBatchResult | DeleteVaultBatchError> {
    const msg = 'there are no codes to delete,';

    const vaultBatchDeleted = await this.deleteBatch(batchId, vaultBatchTransaction);

    if (!vaultBatchDeleted) {
      return this.deleteBatchError(batchId, `${msg} batch failed deletion`);
    }

    return this.deleteBatchSuccess(batchId, vaultBatchDeleted, false, 0, `${msg} batch successfully deleted`);
  }

  private async deleteBatchAndCodes(
    batchId: string,
    vaultBatchTransaction: VaultBatchesRepository,
    vaultCodesTransaction: VaultCodesRepository,
  ): Promise<DeleteVaultBatchResult | DeleteVaultBatchError> {
    const vaultCodesDeletion = await this.deleteUnclaimedCodes(batchId, vaultCodesTransaction);

    if (!vaultCodesDeletion.success) {
      return this.deleteBatchError(batchId, 'deletion of codes failed, batch has not been deleted');
    }

    const vaultBatchDeleted = await this.deleteBatch(batchId, vaultBatchTransaction);

    if (!vaultBatchDeleted) {
      return this.deleteBatchError(batchId, 'deletion of codes succeeded, but deletion of the batch failed');
    }

    return this.deleteBatchSuccess(
      batchId,
      vaultBatchDeleted,
      vaultCodesDeletion.success,
      vaultCodesDeletion.countCodesDeleted,
      `the batch and codes were successfully deleted`,
    );
  }

  private async deleteCodesOnly(
    batchId: string,
    countClaimedCodes: number,
    vaultCodesTransaction: VaultCodesRepository,
  ): Promise<DeleteVaultBatchResult | DeleteVaultBatchError> {
    const msg = `batch was not deleted as it has ${countClaimedCodes} claimed code(s),`;

    const vaultCodesDeletion = await this.deleteUnclaimedCodes(batchId, vaultCodesTransaction);

    if (!vaultCodesDeletion.success) {
      return this.deleteBatchError(batchId, `${msg} unclaimed codes failed deletion`);
    }

    return this.deleteBatchSuccess(
      batchId,
      false,
      vaultCodesDeletion.success,
      vaultCodesDeletion.countCodesDeleted,
      `${msg} unclaimed codes successfully deleted`,
    );
  }

  private async deleteBatch(batchId: string, vaultBatchTransaction: VaultBatchesRepository): Promise<boolean> {
    const vaultBatchDeletion = await vaultBatchTransaction.deleteById(batchId);
    return vaultBatchDeletion.length !== 0;
  }

  private async deleteUnclaimedCodes(
    batchId: string,
    vaultCodesTransaction: VaultCodesRepository,
  ): Promise<{ success: boolean; countCodesDeleted: number }> {
    const vaultCodesDeletion = await vaultCodesTransaction.deleteUnclaimedCodesByBatchId(batchId);
    return {
      success: vaultCodesDeletion.length !== 0,
      countCodesDeleted: vaultCodesDeletion.length,
    };
  }

  private deleteBatchError(batchId: string, message: string): DeleteVaultBatchError {
    this.logger.error({
      message: message,
      context: {
        vaultBatchId: batchId,
      },
    });
    return {
      kind: 'Error',
      data: {
        message: `Vault Batch Delete - ${message}`,
      },
    };
  }

  private deleteBatchSuccess(
    vaultBatchId: string,
    vaultBatchDeleted: boolean,
    vaultCodesDeleted: boolean,
    countCodesDeleted: number,
    message: string,
  ): DeleteVaultBatchResult {
    return {
      kind: 'Ok',
      data: {
        vaultBatchId: vaultBatchId,
        vaultBatchDeleted: vaultBatchDeleted,
        vaultCodesDeleted: vaultCodesDeleted,
        countCodesDeleted: countCodesDeleted,
        message: `Vault Batch Delete - ${message}`,
      },
    };
  }
}
