import { ILogger, Logger } from '@blc-mono/core/utils/logger';

import { DwhRepository, IDwhRepository, VaultBatchStockData, VaultStockData } from '../../repositories/DwhRepository';
import { IVaultStockRepository, VaultStockRecord, VaultStockRepository } from '../../repositories/VaultStockRepository';

/**
 * log data to DWH in batches
 * max size for batch is 500 records
 *
 * NOTE: this is the max size for PutRecordBatch command
 * it does NOT mean that the delivery to the destination (S3) will be in batches of 500.
 *
 * For instance:
 * if we have 2000 vaults, then this functionality will send 4 batches to Firehose with 500 records per batch.
 * But the S3 destination bucket will only have 2 files delivered with a combination of something along the lines
 * of 1000 records per file OR 1500 records in the first file and 500 records in the second file, etc.
 * This is handled at AWS end. The PutRecordBatch command will send 500 records per send into the Firehose buffer,
 * the Firehose buffer handler/processor will send/deliver the records in however it decides, based
 * on total data size on the buffer or time, which ever is soonest (from memory 10MB or 1 minute)
 *
 * https://docs.aws.amazon.com/firehose/latest/APIReference/API_PutRecordBatch.html
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/firehose/command/PutRecordBatchCommand/
 */
const batchSize = 500;

export interface ILogVaultStockDwhService {
  logVaultStock(): Promise<void>;
}

export class LogVaultStockDwhService implements ILogVaultStockDwhService {
  static readonly key = 'GetVaultStockService';
  static readonly inject = [Logger.key, VaultStockRepository.key, DwhRepository.key] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly vaultStockRepository: IVaultStockRepository,
    private readonly dwhRepository: IDwhRepository,
  ) {}

  public async logVaultStock(): Promise<void> {
    const vaultStockRecords: VaultStockRecord[] = await this.vaultStockRepository.findAllVaults();
    if (vaultStockRecords.length === 0) {
      this.logger.error({
        message: 'GetVaultStockService: no vaults retrieved to process',
        context: {
          runTime: new Date().toISOString(),
        },
      });
    }

    await this.processVaultStockRecords(vaultStockRecords);
    await this.processVaultBatchStockRecords(vaultStockRecords);
  }

  private async processVaultStockRecords(vaultStockRecords: VaultStockRecord[]): Promise<void> {
    let recordCount = 0;
    let dwhBatch = [];
    for (const vaultStockRecord of vaultStockRecords) {
      const unclaimed = await this.vaultStockRepository.countUnclaimedCodesForVault(vaultStockRecord.vaultId);
      const dwhData = {
        vaultId: vaultStockRecord.vaultId,
        offerId: vaultStockRecord.offerId,
        companyId: vaultStockRecord.companyId,
        manager: vaultStockRecord.email ?? '',
        unclaimed: unclaimed,
        isActive: vaultStockRecord.status === 'active' ? 'true' : 'false',
        vaultProvider: vaultStockRecord.integration ?? '',
      } satisfies VaultStockData;
      dwhBatch.push(dwhData);
      recordCount++;

      if (recordCount === batchSize) {
        await this.dwhRepository.logVaultStock(dwhBatch);
        dwhBatch = [];
        recordCount = 0;
        this.logger.info({
          message: 'GetVaultStockService: vault stock of 500 records logged to DWH',
        });
      }
    }

    //log remainder (less than 500 records, if any)
    if (recordCount) {
      await this.dwhRepository.logVaultStock(dwhBatch);
      this.logger.info({
        message: `GetVaultStockService: vault stock of ${recordCount} record(s) logged to DWH`,
      });
    }
  }

  private async processVaultBatchStockRecords(vaultStockRecords: VaultStockRecord[]): Promise<void> {
    let recordCount = 0;
    let dwhBatch = [];
    for (const vaultStockRecord of vaultStockRecords) {
      const vaultBatchStockRecords = await this.vaultStockRepository.findBatchesForVault(vaultStockRecord.vaultId);
      if (vaultBatchStockRecords.length > 0) {
        for (const vaultBatchStockRecord of vaultBatchStockRecords) {
          const dwhData = {
            batchId: vaultBatchStockRecord.batchId,
            offerId: vaultStockRecord.offerId,
            companyId: vaultStockRecord.companyId,
            batchExpires: vaultBatchStockRecord.expiry,
            batchCount: vaultBatchStockRecord.unclaimed,
          } satisfies VaultBatchStockData;
          dwhBatch.push(dwhData);
          recordCount++;

          if (recordCount === batchSize) {
            await this.dwhRepository.logVaultBatchStock(dwhBatch);
            dwhBatch = [];
            recordCount = 0;
            this.logger.info({
              message: 'GetVaultStockService: vault batch stock of 500 records logged to DWH',
            });
          }
        }
      }
    }

    //log remainder (less than 500 records, if any)
    if (recordCount) {
      await this.dwhRepository.logVaultBatchStock(dwhBatch);
      this.logger.info({
        message: `GetVaultStockService: vault batch stock of ${recordCount} record(s) logged to DWH`,
      });
    }
  }
}
