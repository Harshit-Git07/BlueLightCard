import { VaultBatchEntity } from '../repositories/VaultBatchesRepository';
import { VaultEntity } from '../repositories/VaultsRepository';

export type RedemptionVaultBatchConfig = {
  id: string;
  created: string;
  expiry: string;
};

export type RedemptionVaultConfig = {
  id: string;
  alertBelow: number;
  status: string;
  maxPerUser: number | null;
  createdAt: string;
  email: string | null;
  integration: string | null;
  integrationId: string | null;
  batches: RedemptionVaultBatchConfig[];
};

export class RedemptionVaultConfigTransformer {
  static readonly key = 'RedemptionVaultConfigTransformer';

  public transformToRedemptionVaultConfig(
    vaultEntity: VaultEntity,
    vaultBatchEntities: VaultBatchEntity[],
  ): RedemptionVaultConfig | null {
    const batches: RedemptionVaultBatchConfig[] = vaultBatchEntities.map((batch) => ({
      id: batch.id,
      created: batch.created.toISOString(),
      expiry: batch.expiry.toISOString(),
    }));

    batches.sort((a, b) => {
      return new Date(a.created).getTime() - new Date(b.created).getTime();
    });

    return {
      id: vaultEntity.id,
      alertBelow: vaultEntity.alertBelow,
      status: vaultEntity.status,
      maxPerUser: vaultEntity.maxPerUser,
      createdAt: vaultEntity.created.toISOString(),
      email: vaultEntity.email,
      integration: vaultEntity.integration,
      integrationId: vaultEntity.integrationId ? String(vaultEntity.integrationId) : null,
      batches,
    };
  }
}
