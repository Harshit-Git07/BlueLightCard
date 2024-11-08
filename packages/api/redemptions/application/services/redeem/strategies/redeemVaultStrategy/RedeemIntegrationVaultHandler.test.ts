import { faker } from '@faker-js/faker';

import { ILogger } from '@blc-mono/core/utils/logger/logger';
import { as } from '@blc-mono/core/utils/testing';
import { EagleEyeApiRepository } from '@blc-mono/redemptions/application/repositories/EagleEyeApiRepository';
import { IntegrationCodesRepository } from '@blc-mono/redemptions/application/repositories/IntegrationCodesRepository';
import { UniqodoApiRepository } from '@blc-mono/redemptions/application/repositories/UniqodoApiRepository';
import { VaultEntity } from '@blc-mono/redemptions/application/repositories/VaultsRepository';
import { redeemVaultStrategyRedemptionDetailsFactory } from '@blc-mono/redemptions/libs/test/factories/redeemVaultStrategyRedemptionDetails.factory';
import { vaultEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultEntity.factory';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { RedeemVaultStrategyResult } from '../IRedeemStrategy';

import { MaxPerUserReachedError } from './helpers/MaxPerUserReachedError';
import { IntegrationCode, RedeemIntegrationVaultHandler } from './RedeemIntegrationVaultHandler';
import { RedeemVaultStrategyRedemptionDetailsBuilder } from './RedeemVaultStrategyRedemptionDetailsBuilder';

const mockUniqodoRepository: Partial<UniqodoApiRepository> = {
  getCode: jest.fn(),
};

const mockEagleEyeRepository: Partial<EagleEyeApiRepository> = {
  getCode: jest.fn(),
};
const mockIntegrationCodesRepository: Partial<IntegrationCodesRepository> = {
  countCodesClaimedByMember: jest.fn(),
  create: jest.fn(),
};
const mockRedeemVaultStrategyRedemptionDetailsBuilder: Partial<RedeemVaultStrategyRedemptionDetailsBuilder> = {
  buildRedeemVaultStrategyRedemptionDetails: jest.fn(),
};
const mockLogger: ILogger = createTestLogger();

const redeemIntegrationVaultHandler = new RedeemIntegrationVaultHandler(
  as(mockUniqodoRepository),
  as(mockEagleEyeRepository),
  as(mockIntegrationCodesRepository),
  as(mockRedeemVaultStrategyRedemptionDetailsBuilder),
  as(mockLogger),
);

const redemptionType = 'vault';
const redemptionUrl: string = faker.string.alphanumeric();
const memberId: string = faker.string.alphanumeric();
const memberEmail: string = faker.internet.email();

const eagleEyeApiConfigSuccess = {
  kind: 'Ok',
  data: {
    code: faker.string.sample(10),
    createdAt: faker.date.past(),
    expiresAt: faker.date.future(),
  },
};

const integrationCode: IntegrationCode = {
  code: faker.string.alphanumeric(),
  createdAt: faker.date.recent(),
  expiresAt: faker.date.recent(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('handleRedeemIntegrationVault', () => {
  it('returns correct response from buildRedeemVaultStrategyRedemptionDetails', async () => {
    const vaultEntity: VaultEntity = vaultEntityFactory.build({ integration: 'uniqodo', maxPerUser: 10 });

    mockIntegrationCodesRepository.countCodesClaimedByMember = jest.fn().mockResolvedValue(0);

    mockUniqodoRepository.getCode = jest.fn().mockResolvedValue(integrationCode);

    const redeemVaultStrategyRedemptionDetails = redeemVaultStrategyRedemptionDetailsFactory.build();
    mockRedeemVaultStrategyRedemptionDetailsBuilder.buildRedeemVaultStrategyRedemptionDetails = jest
      .fn()
      .mockReturnValue(redeemVaultStrategyRedemptionDetails);

    const actualRedeemVaultStrategyResult: RedeemVaultStrategyResult =
      await redeemIntegrationVaultHandler.handleRedeemIntegrationVault(
        vaultEntity,
        redemptionType,
        redemptionUrl,
        memberId,
        memberEmail,
      );

    const expectedRedeemVaultStrategyResult: RedeemVaultStrategyResult = {
      kind: 'Ok',
      redemptionType,
      redemptionDetails: redeemVaultStrategyRedemptionDetails,
    };

    expect(actualRedeemVaultStrategyResult).toEqual(expectedRedeemVaultStrategyResult);
  });

  it('calls buildRedeemVaultStrategyRedemptionDetails with correct arguments', async () => {
    const vaultEntity: VaultEntity = vaultEntityFactory.build({ integration: 'uniqodo', maxPerUser: 10 });

    mockIntegrationCodesRepository.countCodesClaimedByMember = jest.fn().mockResolvedValue(0);

    mockUniqodoRepository.getCode = jest.fn().mockResolvedValue(integrationCode);

    await redeemIntegrationVaultHandler.handleRedeemIntegrationVault(
      vaultEntity,
      redemptionType,
      redemptionUrl,
      memberId,
      memberEmail,
    );

    expect(
      mockRedeemVaultStrategyRedemptionDetailsBuilder.buildRedeemVaultStrategyRedemptionDetails,
    ).toHaveBeenCalledWith(vaultEntity, redemptionType, redemptionUrl, memberId, integrationCode.code);
  });

  it('calls integrationCodesRepository create with correct arguments', async () => {
    const vaultEntity: VaultEntity = vaultEntityFactory.build({ integration: 'uniqodo', maxPerUser: 10 });

    mockIntegrationCodesRepository.countCodesClaimedByMember = jest.fn().mockResolvedValue(0);

    mockUniqodoRepository.getCode = jest.fn().mockResolvedValue(integrationCode);

    await redeemIntegrationVaultHandler.handleRedeemIntegrationVault(
      vaultEntity,
      redemptionType,
      redemptionUrl,
      memberId,
      memberEmail,
    );

    expect(mockIntegrationCodesRepository.create).toHaveBeenCalledWith({
      vaultId: vaultEntity.id,
      memberId: memberId,
      code: integrationCode.code,
      created: integrationCode.createdAt,
      expiry: integrationCode.expiresAt,
      integration: vaultEntity.integration,
      integrationId: String(vaultEntity.integrationId),
    });
  });

  it('throws an error if an invalid integration type is given', async () => {
    const vaultEntity: VaultEntity = vaultEntityFactory.build({
      integration: as('invalidIntegration'),
      maxPerUser: 10,
    });

    mockLogger.error = jest.fn();

    await expect(() =>
      redeemIntegrationVaultHandler.handleRedeemIntegrationVault(
        vaultEntity,
        redemptionType,
        redemptionUrl,
        memberId,
        memberEmail,
      ),
    ).rejects.toThrow(`Integration must be either eagleEye or uniqodo`);
  });

  it('calls uniqodoRepository getCode with correct arguments when integration is Uniqodo', async () => {
    const vaultEntity: VaultEntity = vaultEntityFactory.build({ integration: 'uniqodo', maxPerUser: 10 });

    mockIntegrationCodesRepository.countCodesClaimedByMember = jest.fn().mockResolvedValue(0);

    mockUniqodoRepository.getCode = jest.fn().mockResolvedValue(integrationCode);

    await redeemIntegrationVaultHandler.handleRedeemIntegrationVault(
      vaultEntity,
      redemptionType,
      redemptionUrl,
      memberId,
      memberEmail,
    );

    expect(mockUniqodoRepository.getCode).toHaveBeenCalledWith(
      String(vaultEntity.integrationId),
      memberId,
      memberEmail,
    );
  });

  it('calls eagleEye Repository getCode with correct arguments when integration is EagleEye', async () => {
    const vaultEntity: VaultEntity = vaultEntityFactory.build({
      integration: 'eagleeye',
      integrationId: faker.number.int().toString(),
      maxPerUser: 10,
    });

    mockIntegrationCodesRepository.countCodesClaimedByMember = jest.fn().mockResolvedValue(0);

    mockEagleEyeRepository.getCode = jest.fn().mockResolvedValue(eagleEyeApiConfigSuccess);

    await redeemIntegrationVaultHandler.handleRedeemIntegrationVault(
      vaultEntity,
      redemptionType,
      redemptionUrl,
      memberId,
      memberEmail,
    );

    expect(mockEagleEyeRepository.getCode).toHaveBeenCalledWith(Number(vaultEntity.integrationId), memberId);
  });

  it.each([
    [2, 1],
    [1, 1],
    [0, 0],
    [1, null],
  ])(
    'throws an error when the user has claimed %s of the available %s codes',
    async (numberOfCodesClaimedByMember: number, maxPerUser: number | null) => {
      const vaultEntity: VaultEntity = vaultEntityFactory.build({ maxPerUser: maxPerUser, integration: 'uniqodo' });

      mockIntegrationCodesRepository.countCodesClaimedByMember = jest
        .fn()
        .mockResolvedValue(numberOfCodesClaimedByMember);

      await expect(() =>
        redeemIntegrationVaultHandler.handleRedeemIntegrationVault(
          vaultEntity,
          redemptionType,
          redemptionUrl,
          memberId,
          memberEmail,
        ),
      ).rejects.toThrow(MaxPerUserReachedError);

      expect(mockIntegrationCodesRepository.countCodesClaimedByMember).toHaveBeenCalledTimes(1);
      expect(mockIntegrationCodesRepository.countCodesClaimedByMember).toHaveBeenCalledWith(
        vaultEntity.id,
        String(vaultEntity.integrationId),
        memberId,
      );
    },
  );

  it('throws an error if integration is null', async () => {
    const vaultEntity: VaultEntity = vaultEntityFactory.build({ integration: null, integrationId: '23456' });

    await expect(() =>
      redeemIntegrationVaultHandler.handleRedeemIntegrationVault(
        vaultEntity,
        redemptionType,
        redemptionUrl,
        memberId,
        memberEmail,
      ),
    ).rejects.toThrow(`Integration must be either eagleEye or uniqodo`);
  });

  it('throws an error if integrationId is null', async () => {
    const vaultEntity: VaultEntity = vaultEntityFactory.build({ integration: 'uniqodo', integrationId: null });

    await expect(() =>
      redeemIntegrationVaultHandler.handleRedeemIntegrationVault(
        vaultEntity,
        redemptionType,
        redemptionUrl,
        memberId,
        memberEmail,
      ),
    ).rejects.toThrow(`${vaultEntity.integration} integrationId is blank/null`);
  });
});
