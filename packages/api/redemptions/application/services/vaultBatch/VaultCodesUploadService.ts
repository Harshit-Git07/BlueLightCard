import { GetObjectCommand, GetObjectCommandOutput } from '@aws-sdk/client-s3';

import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  IRedemptionsEventsRepository,
  RedemptionsEventsRepository,
} from '@blc-mono/redemptions/application/repositories/RedemptionsEventsRepository';
import {
  IVaultCodesRepository,
  VaultCodesRepository,
} from '@blc-mono/redemptions/application/repositories/VaultCodesRepository';
import { IS3ClientProvider, S3ClientProvider } from '@blc-mono/redemptions/libs/storage/S3ClientProvider';

import { IVaultBatchesRepository, VaultBatchesRepository } from '../../repositories/VaultBatchesRepository';

export interface IVaultCodesUploadService {
  handle(bucketName: string, objectKey: string, batchSize: number): Promise<void>;
}

export class VaultCodesUploadService implements IVaultCodesUploadService {
  static readonly key = 'VaultCodesUploadService';
  static readonly inject = [
    Logger.key,
    VaultCodesRepository.key,
    VaultBatchesRepository.key,
    RedemptionsEventsRepository.key,
    S3ClientProvider.key,
  ] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly vaultCodesRepo: IVaultCodesRepository,
    private readonly vaultBatchesRepo: IVaultBatchesRepository,
    private readonly redemptionsEventsRepository: IRedemptionsEventsRepository,
    private readonly s3ClientProvider: IS3ClientProvider,
  ) {}

  public async handle(bucketName: string, objectKey: string, batchSize: number): Promise<void> {
    const { batchId, created, vaultId } = this.extractFilePathInfo(objectKey);
    const file = await this.getS3File(bucketName, objectKey);
    const fileContent = await file?.Body?.transformToString();
    if (!fileContent || fileContent === '') {
      throw new Error('Vault code upload - Empty file');
    }

    const vaultBatch = await this.vaultBatchesRepo.findOneByBatchId(batchId);
    if (!vaultBatch) {
      throw new Error('Vault code upload - Vault batch not found');
    }

    const codes = this.parseRawCsvData(fileContent);

    const codeInsertFailArray: string[] = [];
    let countCodeInsertSuccess = 0;
    let countCodeInsertFail = 0;

    for (let i = 0; i < codes.length; i += batchSize) {
      const batchVaultCodes = codes.slice(i, i + batchSize);
      try {
        await this.vaultCodesRepo.createMany(
          batchVaultCodes.map((code) => ({
            vaultId,
            batchId,
            code,
            created,
            expiry: vaultBatch.expiry,
            memberId: null,
          })),
        );
        countCodeInsertSuccess += batchVaultCodes.length;
      } catch (error) {
        codeInsertFailArray.push(...batchVaultCodes);
        countCodeInsertFail += batchVaultCodes.length;
      }
    }

    this.logger.info({
      message: `Vault code upload - ${countCodeInsertSuccess} vault codes inserted into the database`,
    });

    this.redemptionsEventsRepository.publishVaultBatchCreatedEvent({
      vaultId,
      batchId,
      codeInsertFailArray: codeInsertFailArray,
      countCodeInsertFail: countCodeInsertFail,
      countCodeInsertSuccess: countCodeInsertSuccess,
      fileName: vaultBatch.file,
    });
  }

  /**
   * Parse the raw CSV data into an array of strings
   * Example:
   * ```
   * code1
   * code2
   * code3
   * ```
   *
   * returns: ['code1', 'code2', 'code3']
   */
  private parseRawCsvData(text: string): string[] {
    const codes = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== '');
    return codes;
  }

  private extractFilePathInfo(fileName: string): { vaultId: string; batchId: string; created: Date } {
    // The pattern of the file path is {vaultId}/{batchId}/{created}.csv
    const regex = /^(vlt-[0-9a-fA-F-]+)\/(vbt-[0-9a-fA-F-]+)\/([\d-]+T[\d:.]+Z)\.csv$/;

    const match = regex.exec(fileName);

    if (match) {
      const [, vaultId, batchId, created] = match;

      return { vaultId, batchId, created: new Date(created) };
    }

    throw new Error('Vault code upload - Invalid file path');
  }

  private async getS3File(bucketName: string, objectKey: string): Promise<GetObjectCommandOutput | null> {
    const s3client = this.s3ClientProvider.getClient();
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });
    const response = await s3client.send(command).catch((error) => {
      this.logger.error({
        message: 'Vault code upload - Failed to get s3 file',
        error,
      });
      throw new Error('Vault code upload - Failed to get s3 file');
    });

    return response ?? null;
  }
}
