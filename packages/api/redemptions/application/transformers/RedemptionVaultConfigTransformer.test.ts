import { vaultFactory } from '@blc-mono/redemptions/libs/test/factories/vault.factory';
import { vaultBatchFactory } from '@blc-mono/redemptions/libs/test/factories/vaultBatch.factory';

import { VaultBatch } from '../repositories/VaultBatchesRepository';
import { Vault } from '../repositories/VaultsRepository';

import { RedemptionVaultConfigTransformer } from './RedemptionVaultConfigTransformer';

const redemptionVaultConfigTransformer: RedemptionVaultConfigTransformer = new RedemptionVaultConfigTransformer();

const vaultEntity: Vault = vaultFactory.build();

describe('transformToRedemptionVaultConfig', () => {
  it('returns formatted RedemptionVaultConfig when has vault batches', () => {
    const vaultBatchOne: VaultBatch = vaultBatchFactory.build({ created: new Date('2021-01-01') });
    const vaultBatchTwo: VaultBatch = vaultBatchFactory.build({ created: new Date('2021-02-01') });
    const vaultBatchThree: VaultBatch = vaultBatchFactory.build({ created: new Date('2021-03-01') });

    const actualRedemptionVaultConfig = redemptionVaultConfigTransformer.transformToRedemptionVaultConfig(vaultEntity, [
      vaultBatchOne,
      vaultBatchThree,
      vaultBatchTwo,
    ]);

    const expectedRedemptionVaultConfig = {
      id: vaultEntity.id,
      alertBelow: vaultEntity.alertBelow,
      status: vaultEntity.status,
      maxPerUser: vaultEntity.maxPerUser,
      createdAt: vaultEntity.created.toISOString(),
      email: vaultEntity.email,
      integration: vaultEntity.integration,
      integrationId: String(vaultEntity.integrationId),
      batches: [
        {
          id: vaultBatchOne.id,
          created: vaultBatchOne.created.toISOString(),
          expiry: vaultBatchOne.expiry.toISOString(),
        },
        {
          id: vaultBatchTwo.id,
          created: vaultBatchTwo.created.toISOString(),
          expiry: vaultBatchTwo.expiry.toISOString(),
        },
        {
          id: vaultBatchThree.id,
          created: vaultBatchThree.created.toISOString(),
          expiry: vaultBatchThree.expiry.toISOString(),
        },
      ],
    };

    expect(actualRedemptionVaultConfig).toStrictEqual(expectedRedemptionVaultConfig);
  });

  it('returns formatted RedemptionVaultConfig when integrationId is null', () => {
    const vaultEntityWithNullIntegrationId: Vault = vaultFactory.build({ integrationId: null });

    const actualRedemptionVaultConfig = redemptionVaultConfigTransformer.transformToRedemptionVaultConfig(
      vaultEntityWithNullIntegrationId,
      [],
    );

    const expectedRedemptionVaultConfig = {
      id: vaultEntityWithNullIntegrationId.id,
      alertBelow: vaultEntityWithNullIntegrationId.alertBelow,
      status: vaultEntityWithNullIntegrationId.status,
      maxPerUser: vaultEntityWithNullIntegrationId.maxPerUser,
      createdAt: vaultEntityWithNullIntegrationId.created.toISOString(),
      email: vaultEntityWithNullIntegrationId.email,
      integration: vaultEntityWithNullIntegrationId.integration,
      integrationId: null,
      batches: [],
    };

    expect(actualRedemptionVaultConfig).toStrictEqual(expectedRedemptionVaultConfig);
  });

  it('returns formatted RedemptionVaultConfig when vault batches is empty', () => {
    const actualRedemptionVaultConfig = redemptionVaultConfigTransformer.transformToRedemptionVaultConfig(
      vaultEntity,
      [],
    );

    const expectedRedemptionVaultConfig = {
      id: vaultEntity.id,
      alertBelow: vaultEntity.alertBelow,
      status: vaultEntity.status,
      maxPerUser: vaultEntity.maxPerUser,
      createdAt: vaultEntity.created.toISOString(),
      email: vaultEntity.email,
      integration: vaultEntity.integration,
      integrationId: String(vaultEntity.integrationId),
      batches: [],
    };

    expect(actualRedemptionVaultConfig).toStrictEqual(expectedRedemptionVaultConfig);
  });
});
