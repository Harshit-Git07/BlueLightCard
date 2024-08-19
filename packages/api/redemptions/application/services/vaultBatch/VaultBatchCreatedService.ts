import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { VaultBatchCreatedEvent } from '@blc-mono/redemptions/application/controllers/eventBridge/vaultBatch/VaultBatchCreatedController';
import {
  AdminEmailRepository,
  IAdminEmailRepository,
  VaultBatchCreatedEmailParams,
} from '@blc-mono/redemptions/application/repositories/AdminEmailRepository';
import { IVaultsRepository, VaultsRepository } from '@blc-mono/redemptions/application/repositories/VaultsRepository';

export interface IVaultBatchCreatedService {
  vaultBatchCreated(event: VaultBatchCreatedEvent): Promise<void>;
}

export class VaultBatchCreatedService implements IVaultBatchCreatedService {
  static readonly key = 'VaultBatchCreatedService';
  static readonly inject = [Logger.key, AdminEmailRepository.key, VaultsRepository.key] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly adminEmailRepository: IAdminEmailRepository,
    private readonly vaultsRepository: IVaultsRepository,
  ) {}

  public async vaultBatchCreated(event: VaultBatchCreatedEvent): Promise<void> {
    const vaultId = event.detail.vaultId;
    const vault = await this.vaultsRepository.findOneById(vaultId);
    if (!vault) {
      this.logger.error({
        message: 'Vault Batch Created Admin Email - vault does not exist',
        context: {
          vaultId: vaultId,
          batchId: event.detail.batchId,
          fileName: event.detail.fileName,
        },
      });
      throw new Error(`Vault Batch Created Admin Email - vault does not exist for vaultId: ${vaultId})`);
    }

    const adminEmail = vault.email; //this is an optional field - can be null
    if (!adminEmail) {
      this.logger.error({
        message: 'Vault Batch Created Admin Email - manager email does not exist (optional field)',
        context: {
          vaultId: vaultId,
          batchId: event.detail.batchId,
          fileName: event.detail.fileName,
        },
      });
      throw new Error(
        `Vault Batch Created Admin Email - manager email does not exist (optional field) for vaultId: ${vaultId})`,
      );
    }

    await this.adminEmailRepository.sendVaultBatchCreatedEmail({
      adminEmail: adminEmail,
      vaultId: vaultId,
      batchId: event.detail.batchId,
      fileName: event.detail.fileName,
      countCodeInsertSuccess: event.detail.countCodeInsertSuccess,
      countCodeInsertFail: event.detail.countCodeInsertFail,
      codeInsertFailArray: event.detail.codeInsertFailArray,
    } satisfies VaultBatchCreatedEmailParams);
  }
}
