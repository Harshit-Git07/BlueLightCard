import { faker } from '@faker-js/faker';

import { VaultEntity } from '@blc-mono/redemptions/application/repositories/VaultsRepository';
import { vaultEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultEntity.factory';

import { RedeemVaultStrategyRedemptionDetails } from '../IRedeemStrategy';

import { RedeemVaultStrategyRedemptionDetailsBuilder } from './RedeemVaultStrategyRedemptionDetailsBuilder';

const redeemVaultStrategyRedemptionDetailsBuilder: RedeemVaultStrategyRedemptionDetailsBuilder =
  new RedeemVaultStrategyRedemptionDetailsBuilder();

const vaultEntity: VaultEntity = vaultEntityFactory.build({ email: faker.internet.email() });
const redemptionUrl: string = faker.internet.url();
const memberId: string = faker.string.alphanumeric();
const code: string = faker.string.alphanumeric();

describe('buildRedeemVaultStrategyRedemptionDetails', () => {
  it('returns RedeemVaultStrategyRedemptionDetails when redemptionType is vault and has undefined redemptionUrl', () => {
    const actualRedeemVaultStrategyRedemptionDetails: RedeemVaultStrategyRedemptionDetails =
      redeemVaultStrategyRedemptionDetailsBuilder.buildRedeemVaultStrategyRedemptionDetails(
        vaultEntity,
        'vault',
        null,
        memberId,
        code,
      );

    const expectedRedeemVaultStrategyRedemptionDetails: RedeemVaultStrategyRedemptionDetails = {
      code: code,
      vaultDetails: {
        id: vaultEntity.id,
        alertBelow: vaultEntity.alertBelow,
        email: vaultEntity!.email!,
        vaultType: vaultEntity.vaultType,
        integration: vaultEntity.integration,
        integrationId: String(vaultEntity.integrationId),
      },
    };

    expect(actualRedeemVaultStrategyRedemptionDetails).toEqual(expectedRedeemVaultStrategyRedemptionDetails);
  });

  it('returns RedeemVaultStrategyRedemptionDetails when redemptionType is vault and has redemptionUrl', () => {
    const actualRedeemVaultStrategyRedemptionDetails: RedeemVaultStrategyRedemptionDetails =
      redeemVaultStrategyRedemptionDetailsBuilder.buildRedeemVaultStrategyRedemptionDetails(
        vaultEntity,
        'vault',
        redemptionUrl,
        memberId,
        code,
      );

    const expectedRedeemVaultStrategyRedemptionDetails: RedeemVaultStrategyRedemptionDetails = {
      code: code,
      url: redemptionUrl,
      vaultDetails: {
        id: vaultEntity.id,
        alertBelow: vaultEntity.alertBelow,
        email: vaultEntity!.email!,
        vaultType: vaultEntity.vaultType,
        integration: vaultEntity.integration,
        integrationId: String(vaultEntity.integrationId),
      },
    };

    expect(actualRedeemVaultStrategyRedemptionDetails).toEqual(expectedRedeemVaultStrategyRedemptionDetails);
  });

  it('handles undefined email in vaultEntity', () => {
    const vaultEntity: VaultEntity = vaultEntityFactory.build({ email: undefined });

    const actualRedeemVaultStrategyRedemptionDetails: RedeemVaultStrategyRedemptionDetails =
      redeemVaultStrategyRedemptionDetailsBuilder.buildRedeemVaultStrategyRedemptionDetails(
        vaultEntity,
        'vaultQR',
        redemptionUrl,
        memberId,
        code,
      );

    const expectedRedeemVaultStrategyRedemptionDetails = {
      code: code,
      vaultDetails: {
        id: vaultEntity.id,
        alertBelow: vaultEntity.alertBelow,
        email: '',
        vaultType: vaultEntity.vaultType,
        integration: vaultEntity.integration,
        integrationId: String(vaultEntity.integrationId),
      },
    };

    expect(actualRedeemVaultStrategyRedemptionDetails).toEqual(expectedRedeemVaultStrategyRedemptionDetails);
  });

  it('returns RedeemVaultStrategyRedemptionDetails when redemptionType is vaultQR', () => {
    const actualRedeemVaultStrategyRedemptionDetails: RedeemVaultStrategyRedemptionDetails =
      redeemVaultStrategyRedemptionDetailsBuilder.buildRedeemVaultStrategyRedemptionDetails(
        vaultEntity,
        'vaultQR',
        redemptionUrl,
        memberId,
        code,
      );

    const expectedRedeemVaultStrategyRedemptionDetails = {
      code: code,
      vaultDetails: {
        id: vaultEntity.id,
        alertBelow: vaultEntity.alertBelow,
        email: vaultEntity!.email,
        vaultType: vaultEntity.vaultType,
        integration: vaultEntity.integration,
        integrationId: String(vaultEntity.integrationId),
      },
    };

    expect(actualRedeemVaultStrategyRedemptionDetails).toEqual(expectedRedeemVaultStrategyRedemptionDetails);
  });
});
