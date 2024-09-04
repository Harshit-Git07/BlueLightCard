import { getEnv } from '@blc-mono/core/utils/getEnv';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import {
  ITransactionManager,
  TransactionManager,
} from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { IS3ClientProvider, S3ClientProvider } from '@blc-mono/redemptions/libs/storage/S3ClientProvider';

import { VaultType } from '../../../libs/database/schema';
import { ParsedRequest } from '../../controllers/adminApiGateway/vaultBatch/CreateVaultBatchController';
import { S3SignedUrl } from '../../helpers/S3SignedUrl';
import { IRedemptionsRepository, RedemptionsRepository } from '../../repositories/RedemptionsRepository';
import { IVaultBatchesRepository, VaultBatchesRepository } from '../../repositories/VaultBatchesRepository';
import { IVaultsRepository, VaultsRepository } from '../../repositories/VaultsRepository';

export type CreateVaultBatchError = {
  kind: 'Error';
  data: {
    message: string;
  };
};

export type CreateVaultBatchResult = {
  kind: 'Ok';
  data: {
    id: string;
    vaultId: string;
    uploadUrl: string;
  };
};

type VaultIdForLegacyVaultIdResult = {
  isError: boolean;
  result: string;
};

export interface ICreateVaultBatchService {
  createVaultBatch(request: ParsedRequest): Promise<CreateVaultBatchResult | CreateVaultBatchError>;
}

export class CreateVaultBatchService implements ICreateVaultBatchService {
  static readonly key = 'CreateVaultBatchService';
  static readonly inject = [
    Logger.key,
    RedemptionsRepository.key,
    VaultsRepository.key,
    VaultBatchesRepository.key,
    TransactionManager.key,
    S3ClientProvider.key,
    S3SignedUrl.key,
  ] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly redemptionsRepository: IRedemptionsRepository,
    private readonly vaultsRepository: IVaultsRepository,
    private readonly vaultBatchesRepository: IVaultBatchesRepository,
    private readonly transactionManager: ITransactionManager,
    private readonly s3ClientProvider: IS3ClientProvider,
    private readonly s3SignedUrl: S3SignedUrl,
  ) {}

  // eslint-disable-next-line require-await
  public async createVaultBatch(request: ParsedRequest): Promise<CreateVaultBatchResult | CreateVaultBatchError> {
    const vaultIdSent = request.body.vaultId;
    const expiry = request.body.expiry;

    /**
     * check if payload.vaultId is legacy vault
     * legacy vaultId take the format of 'vault#[companyId]-[offerId]#[legacy_brand]', for example:
     * vault#12345-67890#BLC
     *
     * to check if is modern requires 2 different checks, ie starts 'vlt-' or 'e2e:vlt-'
     */
    const vaultType: VaultType = vaultIdSent.includes('#') ? 'legacy' : 'standard';
    let vaultId: string;

    if (vaultType === 'legacy') {
      const { isError, result } = await this.getVaultIdForLegacyVaultId(vaultIdSent);
      if (isError) {
        this.logger.error({
          message: result,
          context: {
            vaultType: vaultType,
            vaultId: vaultIdSent,
          },
        });
        return {
          kind: 'Error',
          data: {
            message: result,
          },
        };
      }

      vaultId = result;
    } else {
      //standard - is modern stack vaultId, so check it exists in DB
      const vault = await this.vaultsRepository.findOneById(vaultIdSent);
      if (!vault) {
        this.logger.error({
          message: 'CreateVaultBatch - vault does not exist for standard vaultId',
          context: {
            vaultType: vaultType,
            vaultId: vaultIdSent,
          },
        });
        return {
          kind: 'Error',
          data: {
            message: `CreateVaultBatch - vault does not exist for standard vaultId (vaultId=${vaultIdSent})`,
          },
        };
      }

      vaultId = vault.id;
    }

    return await this.transactionManager.withTransaction(async (transaction) => {
      const transactionConnection = { db: transaction };
      const vaultBatchTransaction = this.vaultBatchesRepository.withTransaction(transactionConnection);

      try {
        /**
         * required file name example: 2024-08-22T16:05:56.865Z.csv
         * if we don't do new Date().toISOString() we end up with a file name along the lines of:
         * Thu Aug 22 2024 16:05:56 GMT+0100 (British Summer Time).csv
         * which will throw when VaultCodesUploadService.ts tries to use the file name:
         * { vaultId, batchId, created: new Date(created) };
         */
        const created = new Date().toISOString();
        const file = `${created}.csv`;
        const { id: batchId } = await vaultBatchTransaction.create({
          vaultId,
          expiry: new Date(expiry),
          created: new Date(created),
          file: file,
        });

        const bucket = getEnv(RedemptionsStackEnvironmentKeys.VAULT_CODES_UPLOAD_BUCKET);
        const key = `${vaultId}/${batchId}/${file}`;

        /**
         * signed URL:
         * [STAGE]-[BRAND]-vault-codes-upload/[VAULT_ID]/[BATCH_ID]/[CREATED].csv?[s3-request-presigner.getSignedUrl]
         */
        const s3client = this.s3ClientProvider.getClient();
        const uploadUrl = await this.s3SignedUrl.getPutObjectSignedUrl(s3client, bucket, key);

        return {
          kind: 'Ok',
          data: {
            id: batchId,
            vaultId: vaultId,
            uploadUrl: uploadUrl,
          },
        };
      } catch (error) {
        this.logger.error({
          message: 'CreateVaultBatch - batch failed to be created',
          context: {
            vaultType: vaultType,
            vaultId: vaultId,
          },
        });
        return {
          kind: 'Error',
          data: {
            message: `CreateVaultBatch - batch failed to be created (vaultId=${vaultId})`,
          },
        };
      }
    });
  }

  private async getVaultIdForLegacyVaultId(legacyVaultId: string): Promise<VaultIdForLegacyVaultIdResult> {
    /**
     * legacy vaultId take the format of 'vault#[companyId]-[offerId]#[legacy_brand]', for example:
     * vault#12345-67890#BLC
     *
     * extract offerId from the legacy vaultId
     * get the redemptionId for the offerId
     * get the modern stack vaultId for the redemptionId
     *
     * this can be removed when legacy vault is deprecated
     */
    const vaultIdSplit = legacyVaultId.split('#'); //should be an array of 3 items
    if (vaultIdSplit.length !== 3) {
      return {
        isError: true,
        result: `CreateVaultBatch - legacy vaultId is incorrectly formatted (vaultId=${legacyVaultId})`,
      };
    }

    const legacyIds = vaultIdSplit[1].split('-'); //should be an array of 2 items (companyId, offerId)
    if (legacyIds.length !== 2) {
      return {
        isError: true,
        result: `CreateVaultBatch - legacy vaultId is missing companyId and/or offerId (vaultId=${legacyVaultId})`,
      };
    }

    const offerId = Number(legacyIds[1]);
    const redemption = await this.redemptionsRepository.findOneByOfferId(offerId);
    if (!redemption) {
      return {
        isError: true,
        result: `CreateVaultBatch - redemption does not exist for legacy vault (vaultId=${legacyVaultId})`,
      };
    }

    const vault = await this.vaultsRepository.findOneByRedemptionId(redemption.id);
    if (!vault) {
      return {
        isError: true,
        result: `CreateVaultBatch - vault does not exist for legacy vault redemptionId (vaultId=${legacyVaultId})`,
      };
    }

    return {
      isError: false,
      result: vault.id,
    };
  }
}
