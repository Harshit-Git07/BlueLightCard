import { vaultBatchEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultBatchEntity.factory';
import { vaultEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultEntity.factory';

import { VaultBatchEntity } from '../repositories/VaultBatchesRepository';
import { VaultEntity } from '../repositories/VaultsRepository';

import { RedemptionVaultConfigTransformer } from './RedemptionVaultConfigTransformer';

const redemptionVaultConfigTransformer: RedemptionVaultConfigTransformer = new RedemptionVaultConfigTransformer();

const vaultEntity: VaultEntity = vaultEntityFactory.build();

describe('transformToRedemptionVaultConfig', () => {
  it('returns formatted RedemptionVaultConfig when has vault batches', () => {
    const vaultBatchEntityOne: VaultBatchEntity = vaultBatchEntityFactory.build({ created: new Date('2021-01-01') });
    const vaultBatchEntityTwo: VaultBatchEntity = vaultBatchEntityFactory.build({ created: new Date('2021-02-01') });
    const vaultBatchEntityThree: VaultBatchEntity = vaultBatchEntityFactory.build({ created: new Date('2021-03-01') });

    const actualRedemptionVaultConfig = redemptionVaultConfigTransformer.transformToRedemptionVaultConfig(vaultEntity, [
      vaultBatchEntityOne,
      vaultBatchEntityThree,
      vaultBatchEntityTwo,
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
          id: vaultBatchEntityOne.id,
          created: vaultBatchEntityOne.created.toISOString(),
          expiry: vaultBatchEntityOne.expiry.toISOString(),
        },
        {
          id: vaultBatchEntityTwo.id,
          created: vaultBatchEntityTwo.created.toISOString(),
          expiry: vaultBatchEntityTwo.expiry.toISOString(),
        },
        {
          id: vaultBatchEntityThree.id,
          created: vaultBatchEntityThree.created.toISOString(),
          expiry: vaultBatchEntityThree.expiry.toISOString(),
        },
      ],
    };

    expect(actualRedemptionVaultConfig).toStrictEqual(expectedRedemptionVaultConfig);
  });

  it('returns formatted RedemptionVaultConfig when integrationId is null', () => {
    const vaultEntityWithNullIntegrationId: VaultEntity = vaultEntityFactory.build({ integrationId: null });

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
