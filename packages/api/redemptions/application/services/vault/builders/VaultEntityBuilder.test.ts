import { NewVaultEntity, UpdateVaultEntity } from '@blc-mono/redemptions/application/repositories/VaultsRepository';
import { vaultEventDetailFactory } from '@blc-mono/redemptions/libs/test/factories/vaultEvents.factory';

import { VaultEntityBuilder } from './VaultEntityBuilder';

const redemptionId = '123';

const vaultEntityBuilder = new VaultEntityBuilder();

describe('buildUpdateVaultEntity', () => {
  it.each([
    ['eagleeye', '1234', '1234', null],
    ['uniqodo', '5678', null, '5678'],
    [null, null, null, null],
    [null, null, undefined, undefined],
  ] as const)(
    'returns UpdateVaultEntity with integration=%s and integrationId=%s when eeCampaignId=%s and ucCampaignId=%s',
    (integration, integrationId, eeCampaignId, ucCampaignId) => {
      const vaultEventDetail = vaultEventDetailFactory.build({
        eeCampaignId,
        ucCampaignId,
        vaultStatus: true,
      });

      const result: UpdateVaultEntity = vaultEntityBuilder.buildUpdateVaultEntity(vaultEventDetail, redemptionId);

      const expectedVaultEntity: UpdateVaultEntity = {
        alertBelow: vaultEventDetail.alertBelow,
        status: 'active',
        maxPerUser: vaultEventDetail.maxPerUser,
        showQR: vaultEventDetail.showQR,
        email: vaultEventDetail.adminEmail,
        redemptionId,
        vaultType: 'legacy',
        integration: integration,
        integrationId: integrationId,
      };

      expect(result).toEqual(expectedVaultEntity);
    },
  );

  it.each([
    ['active', true],
    ['in-active', false],
  ] as const)('returns UpdateVaultEntity with status=%s when vaultStatus=%s', (status, vaultStatus) => {
    const vaultEventDetail = vaultEventDetailFactory.build({
      vaultStatus: vaultStatus,
      eeCampaignId: '1234',
    });

    const result: UpdateVaultEntity = vaultEntityBuilder.buildUpdateVaultEntity(vaultEventDetail, redemptionId);

    const expectedVaultEntity: UpdateVaultEntity = {
      alertBelow: vaultEventDetail.alertBelow,
      status: status,
      maxPerUser: vaultEventDetail.maxPerUser,
      showQR: vaultEventDetail.showQR,
      email: vaultEventDetail.adminEmail,
      redemptionId,
      vaultType: 'legacy',
      integration: 'eagleeye',
      integrationId: vaultEventDetail.eeCampaignId,
    };

    expect(result).toEqual(expectedVaultEntity);
  });
});

describe('buildNewVaultEntity', () => {
  it.each([
    ['eagleeye', '1234', '1234', null],
    ['uniqodo', '5678', null, '5678'],
    [null, null, null, null],
    [null, null, undefined, undefined],
  ] as const)(
    'returns UpdateVaultEntity with integration=%s and integrationId=%s when eeCampaignId=%s and ucCampaignId=%s',
    (integration, integrationId, eeCampaignId, ucCampaignId) => {
      const vaultEventDetail = vaultEventDetailFactory.build({
        eeCampaignId,
        ucCampaignId,
        vaultStatus: true,
      });

      const result: NewVaultEntity = vaultEntityBuilder.buildNewVaultEntity(vaultEventDetail, redemptionId);

      const expectedVaultEntity: NewVaultEntity = {
        alertBelow: vaultEventDetail.alertBelow,
        status: 'active',
        maxPerUser: vaultEventDetail.maxPerUser,
        showQR: vaultEventDetail.showQR,
        email: vaultEventDetail.adminEmail,
        redemptionId,
        vaultType: 'legacy',
        integration: integration,
        integrationId: integrationId,
      };

      expect(result).toEqual(expectedVaultEntity);
    },
  );

  it.each([
    ['active', true],
    ['in-active', false],
  ] as const)('returns NewVaultEntity with status=%s when vaultStatus=%s', (status, vaultStatus) => {
    const vaultEventDetail = vaultEventDetailFactory.build({
      vaultStatus: vaultStatus,
      eeCampaignId: '1234',
    });

    const result: NewVaultEntity = vaultEntityBuilder.buildNewVaultEntity(vaultEventDetail, redemptionId);

    const expectedVaultEntity: NewVaultEntity = {
      alertBelow: vaultEventDetail.alertBelow,
      status: status,
      maxPerUser: vaultEventDetail.maxPerUser,
      showQR: vaultEventDetail.showQR,
      email: vaultEventDetail.adminEmail,
      redemptionId,
      vaultType: 'legacy',
      integration: 'eagleeye',
      integrationId: vaultEventDetail.eeCampaignId,
    };

    expect(result).toEqual(expectedVaultEntity);
  });
});
