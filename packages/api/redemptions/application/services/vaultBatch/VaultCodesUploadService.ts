import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { VaultCodesUploadEvent } from '@blc-mono/redemptions/application/controllers/eventBridge/vaultBatch/VaultCodesUploadController';
import {
  IRedemptionsRepository,
  RedemptionsRepository,
} from '@blc-mono/redemptions/application/repositories/RedemptionsRepository';
import {
  IVaultBatchesRepository,
  VaultBatchesRepository,
} from '@blc-mono/redemptions/application/repositories/VaultBatchesRepository';
import {
  IVaultCodesRepository,
  VaultCodesRepository,
} from '@blc-mono/redemptions/application/repositories/VaultCodesRepository';
import { IVaultsRepository, VaultsRepository } from '@blc-mono/redemptions/application/repositories/VaultsRepository';
import {
  ITransactionManager,
  TransactionManager,
} from '@blc-mono/redemptions/infrastructure/database/TransactionManager';

export interface IVaultCodesUploadService {
  uploadCodes(event: VaultCodesUploadEvent): Promise<void>;
}

export class VaultCodesUploadService implements IVaultCodesUploadService {
  static readonly key = 'VaultCodesUploadService';
  static readonly inject = [
    Logger.key,
    RedemptionsRepository.key,
    VaultsRepository.key,
    VaultBatchesRepository.key,
    VaultCodesRepository.key,
    TransactionManager.key,
  ] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly redemptionsRepo: IRedemptionsRepository,
    private readonly vaultsRepo: IVaultsRepository,
    private readonly vaultBatchesRepo: IVaultBatchesRepository,
    private readonly vaultCodesRepo: IVaultCodesRepository,
    private readonly transactionManager: ITransactionManager,
  ) {}

  public async uploadCodes(event: VaultCodesUploadEvent): Promise<void> {
    /* todo
     * This file is a stub and will be developed on ticket: https://bluelightcard.atlassian.net/browse/TR-629
     *
     * base info:
     * values for S3 path will be received in event
     * const bucket = event.Records[0].s3.bucket.name;
     * const fileName = decodeURIComponent(event.Records[0].s3.object.key.replace(/\\+/g, ' '));
     *
     * use the bucket and key to get the file using @aws-sdk/client-s3 > GetObjectCommand
     * extract the offerId
     * get the redemption from DB using offerId
     * get the vault from DB using redemptionId
     * create the vaultBatch record
     *
     * depending on whether 'check for duplicate codes' is set, is either (at rough guess):
     *
     * do not check for duplicates = batch insert vault codes passing vault.id and vaultBatch.id, 1000 at a time
     *
     * check for duplicates = select all codes currently stored for the offer and iterate through them:
     * if code is not a duplicate = insert code
     * if code is a duplicate = construct codeInsertFail array that can be echoed to admin email along with success value
     *
     * email should be via event bus using infrastructure/eventBridge/events/vaultCode values:
     * Source: RedemptionsVaultCodeEvents.BATCH_CREATED
     * DetailType: RedemptionsVaultCodeEvents.BATCH_CREATED_DETAIL
     */
  }
}
