import { faker } from '@faker-js/faker';
import { beforeAll } from '@jest/globals';

import { ILogger } from '@blc-mono/core/utils/logger/logger';
import { as } from '@blc-mono/core/utils/testing';
import { IGenericsRepository } from '@blc-mono/redemptions/application/repositories/GenericsRepository';
import { IIntegrationCodesRepository } from '@blc-mono/redemptions/application/repositories/IntegrationCodesRepository';
import { ILegacyVaultApiRepository } from '@blc-mono/redemptions/application/repositories/LegacyVaultApiRepository';
import {
  IRedemptionConfigRepository,
  RedemptionConfigEntity,
} from '@blc-mono/redemptions/application/repositories/RedemptionConfigRepository';
import { IRedemptionsEventsRepository } from '@blc-mono/redemptions/application/repositories/RedemptionsEventsRepository';
import { IUniqodoApiRepository } from '@blc-mono/redemptions/application/repositories/UniqodoApiRepository';
import { IVaultCodesRepository } from '@blc-mono/redemptions/application/repositories/VaultCodesRepository';
import { IVaultsRepository, VaultEntity } from '@blc-mono/redemptions/application/repositories/VaultsRepository';
import { genericEntityFactory } from '@blc-mono/redemptions/libs/test/factories/genericEntity.factory';
import { redemptionConfigEntityFactory } from '@blc-mono/redemptions/libs/test/factories/redemptionConfigEntity.factory';
import { vaultCodeEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultCodeEntity.factory';
import { vaultEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultEntity.factory';
import { createSilentLogger, createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { RedeemParams } from './IRedeemStrategy';
import { RedeemGenericStrategy } from './RedeemGenericStrategy';
import { RedeemPreAppliedStrategy } from './RedeemPreAppliedStrategy';
import { RedeemShowCardStrategy } from './RedeemShowCardStrategy';
import { RedeemVaultStrategy } from './RedeemVaultStrategy';

describe('Redemption Strategies', () => {
  beforeAll(() => {
    process.env.ENABLE_STANDARD_VAULT = 'false';
  });
  afterAll(() => {
    delete process.env.ENABLE_STANDARD_VAULT;
  });
  // General mocks
  const defaultParams: RedeemParams = {
    brazeExternalUserId: faker.string.uuid(),
    companyName: faker.company.name(),
    memberId: faker.string.sample(8),
    offerName: faker.lorem.words(3),
    clientType: faker.helpers.arrayElement(['web', 'mobile']),
    memberEmail: faker.internet.url(),
  };
  // Repository mocks
  function mockRedemptionsEventsRepository(): IRedemptionsEventsRepository {
    return {
      publishMemberRedeemIntentEvent: jest.fn(),
      publishRedemptionEvent: jest.fn(),
      publishMemberRetrievedRedemptionDetailsEvent: jest.fn(),
      publishVaultBatchCreatedEvent: jest.fn(),
    };
  }
  function mockGenericsRepository(): Partial<IGenericsRepository> {
    return {
      deleteByRedemptionId: jest.fn(),
      updateByRedemptionId: jest.fn(),
      updateOneById: jest.fn(),
      createGeneric: jest.fn(),
      findOneByRedemptionId: jest.fn(),
      withTransaction: jest.fn(),
    };
  }
  function mockVaultsRepository(): Partial<IVaultsRepository> {
    return {
      create: jest.fn(),
      findOneByRedemptionId: jest.fn(),
      createMany: jest.fn(),
      updateOneById: jest.fn(),
      withTransaction: jest.fn(),
      findOneById: jest.fn(),
    };
  }
  function mockVaultCodesRepository(): IVaultCodesRepository {
    return {
      checkIfMemberReachedMaxCodeClaimed: jest.fn(),
      claimVaultCode: jest.fn(),
      create: jest.fn(),
      checkVaultCodesRemaining: jest.fn(),
      withTransaction: jest.fn(),
      createMany: jest.fn(),
      findManyByBatchId: jest.fn(),
      updateManyByBatchId: jest.fn(),
      deleteUnclaimedCodesByBatchId: jest.fn(),
      findClaimedCodesByBatchId: jest.fn(),
      findUnclaimedCodesByBatchId: jest.fn(),
    };
  }
  function mockLegacyVaultApiRepository(): ILegacyVaultApiRepository {
    return {
      getNumberOfCodesIssuedByMember: jest.fn(),
      assignCodeToMember: jest.fn(),
      assignCodeToMemberWithErrorHandling: jest.fn(),
      findVaultsRelatingToLinkId: jest.fn(),
      getCodesRedeemed: jest.fn(),
      checkVaultStock: jest.fn(),
      viewVaultBatches: jest.fn(),
    };
  }

  function mockIntegrationCodesRepository(): IIntegrationCodesRepository {
    return {
      create: jest.fn(),
      countCodesClaimedByMember: jest.fn(),
      withTransaction: jest.fn(),
    };
  }

  function mockUniqodoApiRepository(): IUniqodoApiRepository {
    return {
      getCode: jest.fn(),
    };
  }

  describe('RedeemGenericStrategy', () => {
    const testGenericRedemption = redemptionConfigEntityFactory.build({
      redemptionType: 'generic',
    });
    const genericEntity = genericEntityFactory.build({
      redemptionId: testGenericRedemption.id,
    });

    function callGenericRedeemStrategy(
      redemptionConfigEntity: RedemptionConfigEntity,
      logger: ILogger,
      overrides?: {
        redemptionEventsRepository?: IRedemptionsEventsRepository;
        genericsRepository?: IGenericsRepository;
      },
    ) {
      const mockedRedemptionsEventsRepository =
        overrides?.redemptionEventsRepository || mockRedemptionsEventsRepository();
      const genericsRepository = overrides?.genericsRepository || mockGenericsRepository();
      const service = new RedeemGenericStrategy(as(genericsRepository), as(mockedRedemptionsEventsRepository), logger);

      return service.redeem(redemptionConfigEntity, defaultParams);
    }

    it('Should throw when no generic is found', async () => {
      // Arrange
      const mockedSilentLogger = createSilentLogger();
      const mockedGenericsRepository = mockGenericsRepository();
      mockedGenericsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(() =>
        callGenericRedeemStrategy(testGenericRedemption, mockedSilentLogger, {
          genericsRepository: as(mockedGenericsRepository),
        }),
      ).rejects.toThrow();
    });

    it('Should return kind equals to "Ok" when a generic is found', async () => {
      // Arrange
      const mockedLogger = createTestLogger();
      const mockedRedemptionsEventsRepository = mockRedemptionsEventsRepository();
      mockedRedemptionsEventsRepository.publishRedemptionEvent = jest.fn().mockResolvedValue(undefined);
      const mockedGenericsRepository = mockGenericsRepository();
      mockedGenericsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(genericEntity);

      // Act
      const result = await callGenericRedeemStrategy(testGenericRedemption, mockedLogger, {
        genericsRepository: as(mockedGenericsRepository),
        redemptionEventsRepository: mockedRedemptionsEventsRepository,
      });

      // Assert
      expect(result.kind).toBe('Ok');
      expect(result.redemptionType).toEqual('generic');
      expect(result.redemptionDetails.code).toEqual(genericEntity.code);
      expect(result.redemptionDetails.url).toEqual(testGenericRedemption.url);
    });

    it('Should publish a redemption event', async () => {
      // Arrange
      const mockedLogger = createTestLogger();
      const mockedRedemptionsEventsRepository = mockRedemptionsEventsRepository();
      mockedRedemptionsEventsRepository.publishRedemptionEvent = jest.fn().mockResolvedValue(undefined);
      const mockedGenericsRepository = mockGenericsRepository();
      mockedGenericsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(genericEntity);

      // Act
      const result = await callGenericRedeemStrategy(testGenericRedemption, mockedLogger, {
        redemptionEventsRepository: mockedRedemptionsEventsRepository,
        genericsRepository: as(mockedGenericsRepository),
      });

      // Assert
      expect(result.kind).toBe('Ok');
      expect(mockedRedemptionsEventsRepository.publishRedemptionEvent).toHaveBeenCalledTimes(1);
      expect(mockedRedemptionsEventsRepository.publishRedemptionEvent).toHaveBeenCalledWith({
        memberDetails: {
          memberId: defaultParams.memberId,
          brazeExternalUserId: defaultParams.brazeExternalUserId,
        },
        redemptionDetails: {
          redemptionId: testGenericRedemption.id,
          redemptionType: 'generic',
          companyId: testGenericRedemption.companyId,
          companyName: defaultParams.companyName,
          offerId: testGenericRedemption.offerId,
          offerName: defaultParams.offerName,
          code: genericEntity.code,
          affiliate: testGenericRedemption.affiliate,
          url: testGenericRedemption.url,
          clientType: defaultParams.clientType,
        },
      });
    });
  });

  describe('RedeemPreAppliedStrategy', () => {
    const testPreAppliedRedemption = redemptionConfigEntityFactory.build({
      redemptionType: 'preApplied',
    });

    function callPreAppliedRedeemStrategy(
      redemptionConfigEntity: RedemptionConfigEntity,
      logger: ILogger,
      overrides?: {
        redemptionEventsRepository?: IRedemptionsEventsRepository;
      },
    ) {
      const mockedRedemptionsEventsRepository =
        overrides?.redemptionEventsRepository || mockRedemptionsEventsRepository();
      const service = new RedeemPreAppliedStrategy(mockedRedemptionsEventsRepository, logger);

      return service.redeem(redemptionConfigEntity, defaultParams);
    }

    it('Should fail to redeem if no redemption URL is configured', async () => {
      // Arrange
      const mockedSilentLogger = createSilentLogger();
      const mockedRedemptionsEventsRepository = mockRedemptionsEventsRepository();
      const redemptionWithoutUrl = redemptionConfigEntityFactory.build({
        redemptionType: 'preApplied',
        url: undefined,
      });

      // Act & Assert
      await expect(() =>
        callPreAppliedRedeemStrategy(redemptionWithoutUrl, mockedSilentLogger, {
          redemptionEventsRepository: mockedRedemptionsEventsRepository,
        }),
      ).rejects.toThrow('Redemption URL was missing but required for pre-applied redemption');
      expect(mockedRedemptionsEventsRepository.publishRedemptionEvent).not.toHaveBeenCalled();
    });
    it('Should publish member redemption event', async () => {
      // Arrange
      const mockedLogger = createTestLogger();
      const mockedRedemptionsEventsRepository = mockRedemptionsEventsRepository();
      mockedRedemptionsEventsRepository.publishRedemptionEvent = jest.fn().mockResolvedValue(undefined);

      // Act
      const redeemedResult = await callPreAppliedRedeemStrategy(testPreAppliedRedemption, mockedLogger, {
        redemptionEventsRepository: mockedRedemptionsEventsRepository,
      });

      // Assert
      expect(mockedRedemptionsEventsRepository.publishRedemptionEvent).toHaveBeenCalledWith({
        memberDetails: {
          memberId: defaultParams.memberId,
          brazeExternalUserId: defaultParams.brazeExternalUserId,
        },
        redemptionDetails: {
          redemptionId: testPreAppliedRedemption.id,
          redemptionType: testPreAppliedRedemption.redemptionType,
          companyId: testPreAppliedRedemption.companyId,
          companyName: defaultParams.companyName,
          offerId: testPreAppliedRedemption.offerId,
          offerName: defaultParams.offerName,
          affiliate: testPreAppliedRedemption.affiliate,
          url: redeemedResult.redemptionDetails.url,
          clientType: defaultParams.clientType,
        },
      });
    });
  });

  describe('RedeemShowCardStrategy', () => {
    const testShowCardRedemption = redemptionConfigEntityFactory.build({
      redemptionType: 'showCard',
    });

    function callShowCardRedeemStrategy(
      redemptionConfigEntity: RedemptionConfigEntity,
      logger: ILogger,
      overrides?: {
        redemptionEventsRepository?: IRedemptionsEventsRepository;
      },
    ) {
      const mockedRedemptionsEventsRepository =
        overrides?.redemptionEventsRepository || mockRedemptionsEventsRepository();
      const service = new RedeemShowCardStrategy(mockedRedemptionsEventsRepository, logger);

      return service.redeem(redemptionConfigEntity, defaultParams);
    }

    it('Should publish member redemption event', async () => {
      // Arrange
      const mockedLogger = createTestLogger();
      const mockedRedemptionsEventsRepository = mockRedemptionsEventsRepository();
      mockedRedemptionsEventsRepository.publishRedemptionEvent = jest.fn().mockResolvedValue(undefined);

      // Act
      await callShowCardRedeemStrategy(testShowCardRedemption, mockedLogger, {
        redemptionEventsRepository: mockedRedemptionsEventsRepository,
      });

      // Assert
      expect(mockedRedemptionsEventsRepository.publishRedemptionEvent).toHaveBeenCalledWith({
        memberDetails: {
          memberId: defaultParams.memberId,
          brazeExternalUserId: defaultParams.brazeExternalUserId,
        },
        redemptionDetails: {
          redemptionId: testShowCardRedemption.id,
          redemptionType: testShowCardRedemption.redemptionType,
          companyId: testShowCardRedemption.companyId,
          companyName: defaultParams.companyName,
          offerId: testShowCardRedemption.offerId,
          offerName: defaultParams.offerName,
          affiliate: testShowCardRedemption.affiliate,
          clientType: defaultParams.clientType,
        },
      });
    });
  });

  describe('RedeemVaultStrategy', () => {
    const testVaultRedemption = redemptionConfigEntityFactory.build({
      redemptionType: 'vault',
    });
    const testStandardVault = vaultEntityFactory.build({
      redemptionId: testVaultRedemption.id,
      vaultType: 'standard',
      maxPerUser: 99,
      integration: null,
      integrationId: null,
    });
    const testStandardUniqodoVault = vaultEntityFactory.build({
      redemptionId: testVaultRedemption.id,
      vaultType: 'standard',
      maxPerUser: 3,
      integration: 'uniqodo',
      integrationId: '98765',
    });
    const mockedUniqodoClaimSuccessResponse = {
      kind: 'Ok',
      data: {
        code: 'uniqodo-code',
        createdAt: new Date(),
        expiresAt: new Date(),
        promotionId: faker.string.numeric(8),
      },
    };
    const testStandardVaultCode = vaultCodeEntityFactory.build({
      vaultId: testStandardVault.id,
    });
    const testLegacyVault = vaultEntityFactory.build({
      redemptionId: testVaultRedemption.id,
      vaultType: 'legacy',
      maxPerUser: 99,
    });
    const testLegacyVaultCode = {
      linkId: faker.string.uuid(),
      vaultId: faker.string.uuid(),
      code: faker.string.sample(10),
    };
    const testRedemptionEventParams = (vault: VaultEntity, vaultCode: { code: string }) => ({
      memberDetails: {
        memberId: defaultParams.memberId,
        brazeExternalUserId: defaultParams.brazeExternalUserId,
      },
      redemptionDetails: {
        redemptionId: testVaultRedemption.id,
        redemptionType: 'vault',
        companyId: testVaultRedemption.companyId,
        companyName: defaultParams.companyName,
        offerId: testVaultRedemption.offerId,
        offerName: defaultParams.offerName,
        code: vaultCode.code,
        affiliate: testVaultRedemption.affiliate,
        url: testVaultRedemption.url ?? '',
        clientType: defaultParams.clientType,
        vaultDetails: {
          id: vault.id,
          alertBelow: vault.alertBelow,
          email: vault.email ?? '',
          vaultType: vault.vaultType,
        },
      },
    });

    const testRedemptionEventParamsStandard = (vault: VaultEntity, vaultCode: { code: string }) => ({
      ...testRedemptionEventParams(vault, vaultCode),
      redemptionDetails: {
        ...testRedemptionEventParams(vault, vaultCode).redemptionDetails,
        vaultDetails: {
          ...testRedemptionEventParams(vault, vaultCode).redemptionDetails.vaultDetails,
          integration: vault.integration,
          integrationId: String(vault.integrationId),
        },
      },
    });

    function callVaultRedeemStrategy(
      redemptionConfigEntity: RedemptionConfigEntity,
      logger: ILogger,
      overrides?: {
        redemptionEventsRepository?: IRedemptionsEventsRepository;
        redemptionConfigRepository?: IRedemptionConfigRepository;
        vaultsRepository?: IVaultsRepository;
        vaultCodesRepository?: IVaultCodesRepository;
        legacyVaultApiRepository?: ILegacyVaultApiRepository;
        integrationCodesRepository?: IIntegrationCodesRepository;
        uniqodoApiRepository?: IUniqodoApiRepository;
      },
    ) {
      const mockedRedemptionsEventsRepository =
        overrides?.redemptionEventsRepository || mockRedemptionsEventsRepository();
      const mockedVaultsRepository = overrides?.vaultsRepository || mockVaultsRepository();
      const mockedVaultCodesRepository = overrides?.vaultCodesRepository || mockVaultCodesRepository();
      const mockedLegacyVaultApiRepository = overrides?.legacyVaultApiRepository || mockLegacyVaultApiRepository();
      const mockedIntegrationCodesRepository =
        overrides?.integrationCodesRepository || mockIntegrationCodesRepository();
      const mockedUniqodoApiRepository = overrides?.uniqodoApiRepository || mockUniqodoApiRepository();
      const service = new RedeemVaultStrategy(
        as(mockedVaultsRepository),
        mockedVaultCodesRepository,
        mockedLegacyVaultApiRepository,
        mockedRedemptionsEventsRepository,
        as(mockedUniqodoApiRepository),
        as(mockedIntegrationCodesRepository),
        logger,
      );

      return service.redeem(redemptionConfigEntity, defaultParams);
    }

    it('Should throw when no vault is found', async () => {
      // Arrange
      const mockedSilentLogger = createSilentLogger();
      const mockedVaultsRepository = mockVaultsRepository();
      mockedVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(null);

      // Act
      const result = callVaultRedeemStrategy(testVaultRedemption, mockedSilentLogger, {
        vaultsRepository: as(mockedVaultsRepository),
      });

      // Assert
      await expect(result).rejects.toThrow();
    });

    describe('Standard vault flow - integration set to null', () => {
      it('Should throw when no matching active vault exists', async () => {
        // Arrange
        const mockedSilentLogger = createSilentLogger();
        const inactiveVault = vaultEntityFactory.build({
          redemptionId: testVaultRedemption.id,
          status: 'in-active',
        });
        const mockedVaultsRepository = mockVaultsRepository();
        mockedVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(inactiveVault);

        // Act & Assert
        await expect(() =>
          callVaultRedeemStrategy(testVaultRedemption, mockedSilentLogger, {
            vaultsRepository: as(mockedVaultsRepository),
          }),
        ).rejects.toThrow();
      });
      it('Should throw when no vault code is found', async () => {
        // Arrange
        const mockedSilentLogger = createSilentLogger();
        const mockedVaultsRepository = mockVaultsRepository();
        mockedVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(testStandardVault);
        const mockedVaultCodesRepository = mockVaultCodesRepository();
        mockedVaultCodesRepository.checkVaultCodesRemaining = jest.fn().mockResolvedValue(0);

        // Act & Assert
        await expect(() =>
          callVaultRedeemStrategy(testVaultRedemption, mockedSilentLogger, {
            vaultsRepository: as(mockedVaultsRepository),
          }),
        ).rejects.toThrow('No vault code found');
      });
      it('Should return kind equals to "MaxPerUserReached" when max per user is reached', async () => {
        // Arrange
        const mockedLogger = createTestLogger();
        const mockedVaultsRepository = mockVaultsRepository();
        mockedVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(testStandardVault);
        const mockedVaultCodesRepository = mockVaultCodesRepository();
        mockedVaultCodesRepository.checkIfMemberReachedMaxCodeClaimed = jest.fn().mockResolvedValue(true);

        // Act
        const result = await callVaultRedeemStrategy(testVaultRedemption, mockedLogger, {
          vaultsRepository: as(mockedVaultsRepository),
          vaultCodesRepository: mockedVaultCodesRepository,
        });

        // Assert
        expect(result.kind).toBe('MaxPerUserReached');
      });
      it('Should return kind equals to "Ok" when a vault code is found', async () => {
        // Arrange
        const mockedLogger = createTestLogger();
        const claimedVaultCode = vaultCodeEntityFactory.build();
        const mockedRedemptionsEventsRepository = mockRedemptionsEventsRepository();
        mockedRedemptionsEventsRepository.publishRedemptionEvent = jest.fn().mockResolvedValue(undefined);
        const mockedVaultsRepository = mockVaultsRepository();
        mockedVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(testStandardVault);
        const mockedVaultCodesRepository = mockVaultCodesRepository();
        mockedVaultCodesRepository.checkIfMemberReachedMaxCodeClaimed = jest.fn().mockResolvedValue(false);
        mockedVaultCodesRepository.claimVaultCode = jest.fn().mockResolvedValue(claimedVaultCode);

        // Act
        const result = await callVaultRedeemStrategy(testVaultRedemption, mockedLogger, {
          vaultsRepository: as(mockedVaultsRepository),
          vaultCodesRepository: mockedVaultCodesRepository,
          redemptionEventsRepository: mockedRedemptionsEventsRepository,
        });

        // Assert
        expect(result.kind).toBe('Ok');
        expect(result.redemptionType).toEqual('vault');
        expect(result.redemptionDetails?.url).toEqual(testVaultRedemption.url);
      });
      it('Should publish a redemption event', async () => {
        // Arrange
        const mockedLogger = createTestLogger();
        const mockedRedemptionsEventsRepository = mockRedemptionsEventsRepository();
        mockedRedemptionsEventsRepository.publishRedemptionEvent = jest.fn().mockResolvedValue(undefined);
        const mockedVaultsRepository = mockVaultsRepository();
        mockedVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(testStandardVault);
        const mockedVaultCodesRepository = mockVaultCodesRepository();
        mockedVaultCodesRepository.checkIfMemberReachedMaxCodeClaimed = jest.fn().mockResolvedValue(false);
        mockedVaultCodesRepository.claimVaultCode = jest.fn().mockResolvedValue(testStandardVaultCode);

        // Act
        const result = await callVaultRedeemStrategy(testVaultRedemption, mockedLogger, {
          vaultsRepository: as(mockedVaultsRepository),
          vaultCodesRepository: mockedVaultCodesRepository,
          redemptionEventsRepository: mockedRedemptionsEventsRepository,
        });

        // Assert
        expect(mockedRedemptionsEventsRepository.publishRedemptionEvent).toHaveBeenCalledTimes(1);
        expect(mockedRedemptionsEventsRepository.publishRedemptionEvent).toHaveBeenCalledWith(
          testRedemptionEventParams(testStandardVault, testStandardVaultCode),
        );
        expect(result).toStrictEqual({
          kind: 'Ok',
          redemptionType: 'vault',
          redemptionDetails: {
            url: testVaultRedemption.url,
            code: testStandardVaultCode.code,
          },
        });
      });
    });

    describe('Standard vault flow - integration set to uniqodo', () => {
      it('Should throw when no matching active vault exists', async () => {
        // Arrange
        const mockedSilentLogger = createSilentLogger();
        const inactiveVault = vaultEntityFactory.build({
          redemptionId: testVaultRedemption.id,
          status: 'in-active',
        });
        const mockedVaultsRepository = mockVaultsRepository();
        mockedVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(inactiveVault);

        // Act & Assert
        await expect(() =>
          callVaultRedeemStrategy(testVaultRedemption, mockedSilentLogger, {
            vaultsRepository: as(mockedVaultsRepository),
          }),
        ).rejects.toThrow();
      });
      it('Should return kind equals to "MaxPerUserReached" when max per user is reached', async () => {
        // Arrange
        const mockedLogger = createTestLogger();
        const mockedVaultsRepository = mockVaultsRepository();
        mockedVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(testStandardUniqodoVault);

        const mockedIntegrationCodesRepository = mockIntegrationCodesRepository();
        mockedIntegrationCodesRepository.countCodesClaimedByMember = jest.fn().mockResolvedValue(3);

        // Act
        const result = await callVaultRedeemStrategy(testVaultRedemption, mockedLogger, {
          vaultsRepository: as(mockedVaultsRepository),
          integrationCodesRepository: as(mockedIntegrationCodesRepository),
        });

        // Assert
        expect(result.kind).toBe('MaxPerUserReached');
      });
      it('Should return kind equals to "Ok" when a vault code is found', async () => {
        // Arrange
        const mockedLogger = createTestLogger();
        const mockedRedemptionsEventsRepository = mockRedemptionsEventsRepository();
        mockedRedemptionsEventsRepository.publishRedemptionEvent = jest.fn().mockResolvedValue(undefined);
        const mockedVaultsRepository = mockVaultsRepository();
        mockedVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(testStandardUniqodoVault);
        const mockedIntegrationCodesRepository = mockIntegrationCodesRepository();
        mockedIntegrationCodesRepository.countCodesClaimedByMember = jest.fn().mockResolvedValue(2);
        const mockedUniqodoApiRepository = mockUniqodoApiRepository();
        mockedUniqodoApiRepository.getCode = jest.fn().mockResolvedValue(mockedUniqodoClaimSuccessResponse);

        // Act
        const result = await callVaultRedeemStrategy(testVaultRedemption, mockedLogger, {
          vaultsRepository: as(mockedVaultsRepository),
          integrationCodesRepository: as(mockedIntegrationCodesRepository),
          uniqodoApiRepository: mockedUniqodoApiRepository,
          redemptionEventsRepository: mockedRedemptionsEventsRepository,
        });

        // Assert
        expect(result.kind).toBe('Ok');
        expect(result.redemptionType).toEqual('vault');
        expect(result.redemptionDetails?.url).toEqual(testVaultRedemption.url);
        expect(result.redemptionDetails?.code).toEqual(mockedUniqodoClaimSuccessResponse.data.code);
      });
      it('Should publish a redemption event', async () => {
        // Arrange
        const mockedLogger = createTestLogger();
        const mockedRedemptionsEventsRepository = mockRedemptionsEventsRepository();
        mockedRedemptionsEventsRepository.publishRedemptionEvent = jest.fn().mockResolvedValue(undefined);
        const mockedVaultsRepository = mockVaultsRepository();
        mockedVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(testStandardUniqodoVault);
        const mockedIntegrationCodesRepository = mockIntegrationCodesRepository();
        const mockedUniqodoApiRepository = mockUniqodoApiRepository();
        mockedUniqodoApiRepository.getCode = jest.fn().mockResolvedValue(mockedUniqodoClaimSuccessResponse);

        // Act
        const result = await callVaultRedeemStrategy(testVaultRedemption, mockedLogger, {
          vaultsRepository: as(mockedVaultsRepository),
          integrationCodesRepository: as(mockedIntegrationCodesRepository),
          uniqodoApiRepository: mockedUniqodoApiRepository,
          redemptionEventsRepository: mockedRedemptionsEventsRepository,
        });

        // Assert
        expect(mockedRedemptionsEventsRepository.publishRedemptionEvent).toHaveBeenCalledTimes(1);
        expect(mockedRedemptionsEventsRepository.publishRedemptionEvent).toHaveBeenCalledWith(
          testRedemptionEventParamsStandard(testStandardUniqodoVault, mockedUniqodoClaimSuccessResponse.data),
        );
        expect(result).toStrictEqual({
          kind: 'Ok',
          redemptionType: 'vault',
          redemptionDetails: {
            url: testVaultRedemption.url,
            code: mockedUniqodoClaimSuccessResponse.data.code,
          },
        });
      });
    });

    describe('Legacy vault flow', () => {
      it('Should throw when there is an error checking the number of codes assigned', async () => {
        // Arrange
        const mockedSilentLogger = createSilentLogger();
        const mockedVaultsRepository = mockVaultsRepository();
        mockedVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(testLegacyVault);
        const mockedLegacyVaultApiRepository = mockLegacyVaultApiRepository();
        mockedLegacyVaultApiRepository.getNumberOfCodesIssuedByMember = jest
          .fn()
          .mockRejectedValue(new Error('Error checking number of codes issued'));

        // Act & Assert
        await expect(() =>
          callVaultRedeemStrategy(testVaultRedemption, mockedSilentLogger, {
            vaultsRepository: as(mockedVaultsRepository),
            legacyVaultApiRepository: mockedLegacyVaultApiRepository,
          }),
        ).rejects.toThrow('Error checking number of codes issued');
      });
      it('Should return kind "MaxPerUserReached" when amountIssued is greater than or equal to vault maxPerUser', async () => {
        // Arrange
        const mockedLogger = createTestLogger();
        const mockedVaultsRepository = mockVaultsRepository();
        mockedVaultsRepository.findOneByRedemptionId = jest
          .fn()
          .mockResolvedValue({ ...testLegacyVault, maxPerUser: 3 });
        const mockedLegacyVaultApiRepository = mockLegacyVaultApiRepository();
        mockedLegacyVaultApiRepository.getNumberOfCodesIssuedByMember = jest.fn().mockResolvedValue(3);
        mockedLegacyVaultApiRepository.assignCodeToMember = jest.fn().mockResolvedValue(undefined);

        // Act
        const result = await callVaultRedeemStrategy(testVaultRedemption, mockedLogger, {
          vaultsRepository: as(mockedVaultsRepository),
          legacyVaultApiRepository: mockedLegacyVaultApiRepository,
        });

        // Assert
        expect(result.kind).toBe('MaxPerUserReached');
      });
      it('Should throw when there is an error assigning the code to the user', async () => {
        // Arrange
        const mockedSilentLogger = createSilentLogger();
        const mockedVaultsRepository = mockVaultsRepository();
        mockedVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(testLegacyVault);
        const mockedLegacyVaultApiRepository = mockLegacyVaultApiRepository();
        mockedLegacyVaultApiRepository.getNumberOfCodesIssuedByMember = jest.fn().mockResolvedValue(1);
        mockedLegacyVaultApiRepository.assignCodeToMemberWithErrorHandling = jest
          .fn()
          .mockRejectedValue(new Error('Error assigning code'));

        // Act & Assert
        await expect(() =>
          callVaultRedeemStrategy(testVaultRedemption, mockedSilentLogger, {
            legacyVaultApiRepository: mockedLegacyVaultApiRepository,
            vaultsRepository: as(mockedVaultsRepository),
          }),
        ).rejects.toThrow('Error assigning code');
      });
      it('Should return kind equals to "Ok" when a vault code is found', async () => {
        // Arrange
        const mockedLogger = createTestLogger();
        const mockedRedemptionsEventsRepository = mockRedemptionsEventsRepository();
        mockedRedemptionsEventsRepository.publishRedemptionEvent = jest.fn().mockResolvedValue(undefined);
        const mockedVaultsRepository = mockVaultsRepository();
        mockedVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(testLegacyVault);
        const mockedLegacyVaultApiRepository = mockLegacyVaultApiRepository();
        mockedLegacyVaultApiRepository.findVaultsRelatingToLinkId = jest.fn();
        mockedLegacyVaultApiRepository.getNumberOfCodesIssuedByMember = jest.fn().mockResolvedValue(1);
        mockedLegacyVaultApiRepository.assignCodeToMemberWithErrorHandling = jest.fn().mockResolvedValue({
          kind: 'Ok',
          data: testLegacyVaultCode,
        });

        // Act
        const result = await callVaultRedeemStrategy(testVaultRedemption, mockedLogger, {
          legacyVaultApiRepository: mockedLegacyVaultApiRepository,
          vaultsRepository: as(mockedVaultsRepository),
          redemptionEventsRepository: mockedRedemptionsEventsRepository,
        });

        // Assert
        expect(result.kind).toBe('Ok');
        expect(result.redemptionType).toEqual('vault');
        expect(result.redemptionDetails?.url).toEqual(testVaultRedemption.url);
        expect(result.redemptionDetails?.code).toEqual(testLegacyVaultCode.code);
      });
      it('Should publish a redemption event', async () => {
        // Arrange
        const mockedLogger = createTestLogger();
        const mockedVaultsRepository = mockVaultsRepository();
        mockedVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(testLegacyVault);
        const mockedRedemptionsEventsRepository = mockRedemptionsEventsRepository();
        mockedRedemptionsEventsRepository.publishRedemptionEvent = jest.fn().mockResolvedValue(undefined);
        const mockedLegacyVaultApiRepository = mockLegacyVaultApiRepository();
        mockedLegacyVaultApiRepository.getNumberOfCodesIssuedByMember = jest.fn().mockResolvedValue(1);
        mockedLegacyVaultApiRepository.assignCodeToMemberWithErrorHandling = jest.fn().mockResolvedValue({
          kind: 'Ok',
          data: testLegacyVaultCode,
        });

        // Act
        const result = await callVaultRedeemStrategy(testVaultRedemption, mockedLogger, {
          vaultsRepository: as(mockedVaultsRepository),
          legacyVaultApiRepository: mockedLegacyVaultApiRepository,
          redemptionEventsRepository: mockedRedemptionsEventsRepository,
        });

        // Assert
        expect(result.kind).toBe('Ok');
        expect(mockedRedemptionsEventsRepository.publishRedemptionEvent).toHaveBeenCalledTimes(1);
        expect(mockedRedemptionsEventsRepository.publishRedemptionEvent).toHaveBeenCalledWith(
          testRedemptionEventParams(testLegacyVault, testLegacyVaultCode),
        );
      });
      it('Should redeem with standard flow when no remaining codes exist in legacy AND ENABLE_STANDARD_VAULT is true', async () => {
        // Arrange
        const mockedLogger = createTestLogger();
        process.env.ENABLE_STANDARD_VAULT = 'true';
        const mockedRedemptionsEventsRepository = mockRedemptionsEventsRepository();
        mockedRedemptionsEventsRepository.publishRedemptionEvent = jest.fn().mockResolvedValue(undefined);
        const mockedVaultsRepository = mockVaultsRepository();
        mockedVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(testLegacyVault);
        const mockedLegacyVaultApiRepository = mockLegacyVaultApiRepository();
        mockedLegacyVaultApiRepository.assignCodeToMemberWithErrorHandling = jest
          .fn()
          .mockResolvedValue({ kind: 'NoCodesAvailable' });
        const mockedVaultCodesRepository = mockVaultCodesRepository();
        mockedVaultCodesRepository.checkIfMemberReachedMaxCodeClaimed = jest.fn().mockResolvedValue(false);
        mockedVaultCodesRepository.claimVaultCode = jest.fn().mockResolvedValue(testStandardVaultCode);

        // Act
        const result = await callVaultRedeemStrategy(testVaultRedemption, mockedLogger, {
          vaultsRepository: as(mockedVaultsRepository),
          legacyVaultApiRepository: mockedLegacyVaultApiRepository,
          vaultCodesRepository: mockedVaultCodesRepository,
          redemptionEventsRepository: mockedRedemptionsEventsRepository,
        });

        // Assert
        expect(result.kind).toBe('Ok');
        expect(result.redemptionDetails?.code).toEqual(testStandardVaultCode.code);
      });
      it('Should throw if no remaining codes exist on legacy AND ENABLE_STANDARD_VAULT is false', async () => {
        // Arrange
        const mockedLogger = createTestLogger();
        process.env.ENABLE_STANDARD_VAULT = 'false';
        const mockedVaultsRepository = mockVaultsRepository();
        mockedVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(testLegacyVault);
        const mockedLegacyVaultApiRepository = mockLegacyVaultApiRepository();
        mockedLegacyVaultApiRepository.assignCodeToMemberWithErrorHandling = jest
          .fn()
          .mockResolvedValue({ kind: 'NoCodesAvailable' });
        mockedLegacyVaultApiRepository.getNumberOfCodesIssuedByMember = jest.fn().mockResolvedValue(1);

        // Act & Assert
        await expect(
          callVaultRedeemStrategy(testVaultRedemption, mockedLogger, {
            vaultsRepository: as(mockedVaultsRepository),
            legacyVaultApiRepository: mockedLegacyVaultApiRepository,
          }),
        ).rejects.toThrow('No vault codes available on legacy');
        expect(mockedLegacyVaultApiRepository.assignCodeToMemberWithErrorHandling).toHaveBeenCalledTimes(1);
      });
      it('Should throw an error if no remaining codes exist in either standard or legacy AND ENABLE_STANDARD_VAULT is true', async () => {
        // Arrange
        const mockedSilentLogger = createSilentLogger();
        process.env.ENABLE_STANDARD_VAULT = 'true';
        const mockedVaultsRepository = mockVaultsRepository();
        mockedVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(testLegacyVault);
        const mockedLegacyVaultApiRepository = mockLegacyVaultApiRepository();
        mockedLegacyVaultApiRepository.assignCodeToMemberWithErrorHandling = jest
          .fn()
          .mockResolvedValue({ kind: 'NoCodesAvailable' });
        const mockedVaultCodesRepository = mockVaultCodesRepository();
        mockedVaultCodesRepository.checkIfMemberReachedMaxCodeClaimed = jest.fn().mockResolvedValue(false);
        mockedVaultCodesRepository.claimVaultCode = jest.fn().mockResolvedValue(undefined);

        // Act & Assert
        await expect(() =>
          callVaultRedeemStrategy(testVaultRedemption, mockedSilentLogger, {
            vaultsRepository: as(mockedVaultsRepository),
            legacyVaultApiRepository: mockedLegacyVaultApiRepository,
            vaultCodesRepository: mockedVaultCodesRepository,
          }),
        ).rejects.toThrow('No vault code found');
      });
    });
  });
});
