import { faker } from '@faker-js/faker';

import { IGenericsRepository } from '@blc-mono/redemptions/application/repositories/GenericsRepository';
import { ILegacyVaultApiRepository } from '@blc-mono/redemptions/application/repositories/LegacyVaultApiRepository';
import { IRedemptionsEventsRepository } from '@blc-mono/redemptions/application/repositories/RedemptionsEventsRepository';
import {
  IRedemptionsRepository,
  Redemption,
} from '@blc-mono/redemptions/application/repositories/RedemptionsRepository';
import { IVaultCodesRepository } from '@blc-mono/redemptions/application/repositories/VaultCodesRepository';
import { IVaultsRepository, Vault } from '@blc-mono/redemptions/application/repositories/VaultsRepository';
import { genericFactory } from '@blc-mono/redemptions/libs/test/factories/generic.factory';
import { redemptionFactory } from '@blc-mono/redemptions/libs/test/factories/redemption.factory';
import { vaultFactory } from '@blc-mono/redemptions/libs/test/factories/vault.factory';
import { vaultCodeFactory } from '@blc-mono/redemptions/libs/test/factories/vaultCode.factory';
import { createSilentLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { RedeemParams } from './IRedeemStrategy';
import { RedeemGenericStrategy } from './RedeemGenericStrategy';
import { RedeemPreAppliedStrategy } from './RedeemPreAppliedStrategy';
import { RedeemShowCardStrategy } from './RedeemShowCardStrategy';
import { RedeemVaultStrategy } from './RedeemVaultStrategy';

describe('Redemption Strategies', () => {
  // General mocks
  const mockedSilentLogger = createSilentLogger();
  const defaultParams: RedeemParams = {
    brazeExternalUserId: faker.string.uuid(),
    companyName: faker.company.name(),
    memberId: faker.string.sample(8),
    offerName: faker.lorem.words(3),
    clientType: faker.helpers.arrayElement(['web', 'mobile']),
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
  function mockGenericsRepository(): IGenericsRepository {
    return {
      deleteByRedemptionId: jest.fn(),
      updateByRedemptionId: jest.fn(),
      createGeneric: jest.fn(),
      findOneByRedemptionId: jest.fn(),
      withTransaction: jest.fn(),
    };
  }
  function mockVaultsRepository(): IVaultsRepository {
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
    };
  }
  function mockLegacyVaultApiRepository(): ILegacyVaultApiRepository {
    return {
      getNumberOfCodesIssued: jest.fn(),
      assignCodeToMember: jest.fn(),
      findVaultsRelatingToLinkId: jest.fn(),
      getCodesRedeemed: jest.fn(),
      checkVaultStock: jest.fn(),
      viewVaultBatches: jest.fn(),
    };
  }

  describe('RedeemGenericStrategy', () => {
    const testGenericRedemption = redemptionFactory.build({
      redemptionType: 'generic',
    });
    const testGeneric = genericFactory.build({
      redemptionId: testGenericRedemption.id,
    });

    function callGenericRedeemStrategy(
      redemption: Redemption,
      overrides?: {
        redemptionEventsRepository?: IRedemptionsEventsRepository;
        genericsRepository?: IGenericsRepository;
      },
    ) {
      const mockedRedemptionsEventsRepository =
        overrides?.redemptionEventsRepository || mockRedemptionsEventsRepository();
      const genericsRepository = overrides?.genericsRepository || mockGenericsRepository();
      const service = new RedeemGenericStrategy(
        genericsRepository,
        mockedRedemptionsEventsRepository,
        mockedSilentLogger,
      );

      return service.redeem(redemption, defaultParams);
    }

    it('Should throw when no generic is found', async () => {
      // Arrange
      const mockedGenericsRepository = mockGenericsRepository();
      mockedGenericsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(() =>
        callGenericRedeemStrategy(testGenericRedemption, {
          genericsRepository: mockedGenericsRepository,
        }),
      ).rejects.toThrow();
    });

    it('Should return kind equals to "Ok" when a generic is found', async () => {
      // Arrange
      const mockedRedemptionsEventsRepository = mockRedemptionsEventsRepository();
      mockedRedemptionsEventsRepository.publishRedemptionEvent = jest.fn().mockResolvedValue(undefined);
      const mockedGenericsRepository = mockGenericsRepository();
      mockedGenericsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(testGeneric);

      // Act
      const result = await callGenericRedeemStrategy(testGenericRedemption, {
        genericsRepository: mockedGenericsRepository,
        redemptionEventsRepository: mockedRedemptionsEventsRepository,
      });

      // Assert
      expect(result.kind).toBe('Ok');
      expect(result.redemptionType).toEqual('generic');
      expect(result.redemptionDetails.code).toEqual(testGeneric.code);
      expect(result.redemptionDetails.url).toEqual(testGenericRedemption.url);
    });

    it('Should publish a redemption event', async () => {
      // Arrange
      const mockedRedemptionsEventsRepository = mockRedemptionsEventsRepository();
      mockedRedemptionsEventsRepository.publishRedemptionEvent = jest.fn().mockResolvedValue(undefined);
      const mockedGenericsRepository = mockGenericsRepository();
      mockedGenericsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(testGeneric);

      // Act
      const result = await callGenericRedeemStrategy(testGenericRedemption, {
        redemptionEventsRepository: mockedRedemptionsEventsRepository,
        genericsRepository: mockedGenericsRepository,
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
          code: testGeneric.code,
          affiliate: testGenericRedemption.affiliate,
          url: testGenericRedemption.url,
          clientType: defaultParams.clientType,
        },
      });
    });
  });

  describe('RedeemPreAppliedStrategy', () => {
    const testPreAppliedRedemption = redemptionFactory.build({
      redemptionType: 'preApplied',
    });

    function callPreAppliedRedeemStrategy(
      redemption: Redemption,
      overrides?: {
        redemptionEventsRepository?: IRedemptionsEventsRepository;
      },
    ) {
      const mockedRedemptionsEventsRepository =
        overrides?.redemptionEventsRepository || mockRedemptionsEventsRepository();
      const service = new RedeemPreAppliedStrategy(mockedRedemptionsEventsRepository, mockedSilentLogger);

      return service.redeem(redemption, defaultParams);
    }

    it('Should fail to redeem if no redemption URL is configured', async () => {
      // Arrange
      const mockedRedemptionsEventsRepository = mockRedemptionsEventsRepository();
      const redemptionWithoutUrl = redemptionFactory.build({
        redemptionType: 'preApplied',
        url: undefined,
      });

      // Act & Assert
      await expect(() =>
        callPreAppliedRedeemStrategy(redemptionWithoutUrl, {
          redemptionEventsRepository: mockedRedemptionsEventsRepository,
        }),
      ).rejects.toThrow('Redemption URL was missing but required for pre-applied redemption');
      expect(mockedRedemptionsEventsRepository.publishRedemptionEvent).not.toHaveBeenCalled();
    });
    it('Should publish member redemption event', async () => {
      // Arrange
      const mockedRedemptionsEventsRepository = mockRedemptionsEventsRepository();
      mockedRedemptionsEventsRepository.publishRedemptionEvent = jest.fn().mockResolvedValue(undefined);

      // Act
      const redeemedResult = await callPreAppliedRedeemStrategy(testPreAppliedRedemption, {
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
    const testShowCardRedemption = redemptionFactory.build({
      redemptionType: 'showCard',
    });

    function callShowCardRedeemStrategy(
      redemption: Redemption,
      overrides?: {
        redemptionEventsRepository?: IRedemptionsEventsRepository;
      },
    ) {
      const mockedRedemptionsEventsRepository =
        overrides?.redemptionEventsRepository || mockRedemptionsEventsRepository();
      const service = new RedeemShowCardStrategy(mockedRedemptionsEventsRepository, mockedSilentLogger);

      return service.redeem(redemption, defaultParams);
    }

    it('Should publish member redemption event', async () => {
      // Arrange
      const mockedRedemptionsEventsRepository = mockRedemptionsEventsRepository();
      mockedRedemptionsEventsRepository.publishRedemptionEvent = jest.fn().mockResolvedValue(undefined);

      // Act
      await callShowCardRedeemStrategy(testShowCardRedemption, {
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
    const testVaultRedemption = redemptionFactory.build({
      redemptionType: 'vault',
    });
    const testStandardVault = vaultFactory.build({
      redemptionId: testVaultRedemption.id,
      vaultType: 'standard',
    });
    const testStandardVaultCode = vaultCodeFactory.build({
      vaultId: testStandardVault.id,
    });
    const testLegacyVault = vaultFactory.build({
      redemptionId: testVaultRedemption.id,
      vaultType: 'legacy',
    });
    const testLegacyVaultCode = {
      linkId: faker.string.uuid(),
      vaultId: faker.string.uuid(),
      code: faker.string.sample(10),
    };
    const testRedemptionEventParams = (vault: Vault, vaultCode: { code: string }) => ({
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
    const setupReposForVaultCodeNotFoundOnLegacy = () => {
      const mockedRedemptionsEventsRepository = mockRedemptionsEventsRepository();
      mockedRedemptionsEventsRepository.publishRedemptionEvent = jest.fn().mockResolvedValue(undefined);
      const mockedVaultsRepository = mockVaultsRepository();
      mockedVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(testLegacyVault);
      mockedVaultsRepository.updateOneById = jest.fn().mockResolvedValue({
        id: testLegacyVault.id,
      });
      const mockedLegacyVaultApiRepository = mockLegacyVaultApiRepository();
      mockedLegacyVaultApiRepository.getNumberOfCodesIssued = jest.fn().mockResolvedValue(0);
      mockedLegacyVaultApiRepository.assignCodeToMember = jest.fn().mockResolvedValue(undefined);
      const mockedVaultCodesRepository = mockVaultCodesRepository();
      mockedVaultCodesRepository.checkIfMemberReachedMaxCodeClaimed = jest.fn().mockResolvedValue(false);

      return {
        mockedRedemptionsEventsRepository,
        mockedVaultsRepository,
        mockedLegacyVaultApiRepository,
        mockedVaultCodesRepository,
      };
    };

    function callVaultRedeemStrategy(
      redemption: Redemption,
      overrides?: {
        redemptionEventsRepository?: IRedemptionsEventsRepository;
        redemptionsRepository?: IRedemptionsRepository;
        vaultsRepository?: IVaultsRepository;
        vaultCodesRepository?: IVaultCodesRepository;
        legacyVaultApiRepository?: ILegacyVaultApiRepository;
      },
    ) {
      const mockedRedemptionsEventsRepository =
        overrides?.redemptionEventsRepository || mockRedemptionsEventsRepository();
      const mockedVaultsRepository = overrides?.vaultsRepository || mockVaultsRepository();
      const mockedVaultCodesRepository = overrides?.vaultCodesRepository || mockVaultCodesRepository();
      const mockedLegacyVaultApiRepository = overrides?.legacyVaultApiRepository || mockLegacyVaultApiRepository();
      const service = new RedeemVaultStrategy(
        mockedVaultsRepository,
        mockedVaultCodesRepository,
        mockedLegacyVaultApiRepository,
        mockedRedemptionsEventsRepository,
        mockedSilentLogger,
      );

      return service.redeem(redemption, defaultParams);
    }

    it('Should throw when no vault is found', async () => {
      // Arrange
      const mockedVaultsRepository = mockVaultsRepository();
      mockedVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(null);

      // Act
      const result = callVaultRedeemStrategy(testVaultRedemption, {
        vaultsRepository: mockedVaultsRepository,
      });

      // Assert
      await expect(result).rejects.toThrow();
    });

    describe('Standard vault flow', () => {
      it('Should throw when no matching active vault exists', async () => {
        // Arrange
        const inactiveVault = vaultFactory.build({
          redemptionId: testVaultRedemption.id,
          status: 'in-active',
        });
        const mockedVaultsRepository = mockVaultsRepository();
        mockedVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(inactiveVault);

        // Act & Assert
        await expect(() =>
          callVaultRedeemStrategy(testVaultRedemption, {
            vaultsRepository: mockedVaultsRepository,
          }),
        ).rejects.toThrow();
      });
      it('Should throw when no vault code is found', async () => {
        // Arrange
        const mockedVaultsRepository = mockVaultsRepository();
        mockedVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(testStandardVault);
        const mockedVaultCodesRepository = mockVaultCodesRepository();
        mockedVaultCodesRepository.checkVaultCodesRemaining = jest.fn().mockResolvedValue(0);

        // Act & Assert
        await expect(() =>
          callVaultRedeemStrategy(testVaultRedemption, {
            vaultsRepository: mockedVaultsRepository,
          }),
        ).rejects.toThrow('No vault code found');
      });
      it('Should return kind equals to "MaxPerUserReached" when max per user is reached', async () => {
        // Arrange
        const mockedVaultsRepository = mockVaultsRepository();
        mockedVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(testStandardVault);
        const mockedVaultCodesRepository = mockVaultCodesRepository();
        mockedVaultCodesRepository.checkIfMemberReachedMaxCodeClaimed = jest.fn().mockResolvedValue(true);

        // Act
        const result = await callVaultRedeemStrategy(testVaultRedemption, {
          vaultsRepository: mockedVaultsRepository,
          vaultCodesRepository: mockedVaultCodesRepository,
        });

        // Assert
        expect(result.kind).toBe('MaxPerUserReached');
      });
      it('Should return kind equals to "Ok" when a vault code is found', async () => {
        // Arrange
        const claimedVaultCode = vaultCodeFactory.build();
        const mockedRedemptionsEventsRepository = mockRedemptionsEventsRepository();
        mockedRedemptionsEventsRepository.publishRedemptionEvent = jest.fn().mockResolvedValue(undefined);
        const mockedVaultsRepository = mockVaultsRepository();
        mockedVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(testStandardVault);
        const mockedVaultCodesRepository = mockVaultCodesRepository();
        mockedVaultCodesRepository.checkIfMemberReachedMaxCodeClaimed = jest.fn().mockResolvedValue(false);
        mockedVaultCodesRepository.claimVaultCode = jest.fn().mockResolvedValue(claimedVaultCode);

        // Act
        const result = await callVaultRedeemStrategy(testVaultRedemption, {
          vaultsRepository: mockedVaultsRepository,
          vaultCodesRepository: mockedVaultCodesRepository,
          redemptionEventsRepository: mockedRedemptionsEventsRepository,
        });

        // Assert
        expect(result.kind).toBe('Ok');
        expect(result.redemptionType).toEqual('vault');
        expect(result.redemptionDetails?.url).toEqual(testVaultRedemption.url);
      });
      it('Should publish a redemption event', async () => {
        const mockedRedemptionsEventsRepository = mockRedemptionsEventsRepository();
        mockedRedemptionsEventsRepository.publishRedemptionEvent = jest.fn().mockResolvedValue(undefined);
        const mockedVaultsRepository = mockVaultsRepository();
        mockedVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(testStandardVault);
        const mockedVaultCodesRepository = mockVaultCodesRepository();
        mockedVaultCodesRepository.checkIfMemberReachedMaxCodeClaimed = jest.fn().mockResolvedValue(false);
        mockedVaultCodesRepository.claimVaultCode = jest.fn().mockResolvedValue(testStandardVaultCode);

        // Act
        const result = await callVaultRedeemStrategy(testVaultRedemption, {
          vaultsRepository: mockedVaultsRepository,
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

    describe('Legacy vault flow', () => {
      it('Should throw when there is an error checking the number of codes assigned', async () => {
        // Arrange
        const mockedVaultsRepository = mockVaultsRepository();
        mockedVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(testLegacyVault);
        const mockedLegacyVaultApiRepository = mockLegacyVaultApiRepository();
        mockedLegacyVaultApiRepository.getNumberOfCodesIssued = jest
          .fn()
          .mockRejectedValue(new Error('Error checking number of codes issued'));

        // Act & Assert
        await expect(() =>
          callVaultRedeemStrategy(testVaultRedemption, {
            vaultsRepository: mockedVaultsRepository,
            legacyVaultApiRepository: mockedLegacyVaultApiRepository,
          }),
        ).rejects.toThrow('Error checking number of codes issued');
      });
      it('Should return kind "MaxPerUserReached" when amountIssued is greater than or equal to vault maxPerUser', async () => {
        // Arrange
        const mockedVaultsRepository = mockVaultsRepository();
        mockedVaultsRepository.findOneByRedemptionId = jest
          .fn()
          .mockResolvedValue({ ...testLegacyVault, maxPerUser: 3 });
        const mockedLegacyVaultApiRepository = mockLegacyVaultApiRepository();
        mockedLegacyVaultApiRepository.getNumberOfCodesIssued = jest.fn().mockResolvedValue(3);
        mockedLegacyVaultApiRepository.assignCodeToMember = jest.fn().mockResolvedValue(undefined);

        // Act
        const result = await callVaultRedeemStrategy(testVaultRedemption, {
          vaultsRepository: mockedVaultsRepository,
          legacyVaultApiRepository: mockedLegacyVaultApiRepository,
        });

        // Assert
        expect(result.kind).toBe('MaxPerUserReached');
      });
      it('Should throw when there is an error assigning the code to the user', async () => {
        // Arrange
        const mockedVaultsRepository = mockVaultsRepository();
        mockedVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(testLegacyVault);
        const mockedLegacyVaultApiRepository = mockLegacyVaultApiRepository();
        mockedLegacyVaultApiRepository.getNumberOfCodesIssued = jest.fn().mockResolvedValue(1);
        mockedLegacyVaultApiRepository.assignCodeToMember = jest
          .fn()
          .mockRejectedValue(new Error('Error assigning code'));

        // Act & Assert
        await expect(() =>
          callVaultRedeemStrategy(testVaultRedemption, {
            legacyVaultApiRepository: mockedLegacyVaultApiRepository,
            vaultsRepository: mockedVaultsRepository,
          }),
        ).rejects.toThrow('Error assigning code');
      });
      it('Should return kind equals to "Ok" when a vault code is found', async () => {
        // Arrange
        const mockedRedemptionsEventsRepository = mockRedemptionsEventsRepository();
        mockedRedemptionsEventsRepository.publishRedemptionEvent = jest.fn().mockResolvedValue(undefined);
        const mockedVaultsRepository = mockVaultsRepository();
        mockedVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(testLegacyVault);
        const mockedLegacyVaultApiRepository = mockLegacyVaultApiRepository();
        mockedLegacyVaultApiRepository.findVaultsRelatingToLinkId = jest.fn();
        mockedLegacyVaultApiRepository.getNumberOfCodesIssued = jest.fn().mockResolvedValue(1);
        mockedLegacyVaultApiRepository.assignCodeToMember = jest.fn().mockResolvedValue(testLegacyVaultCode);

        // Act
        const result = await callVaultRedeemStrategy(testVaultRedemption, {
          legacyVaultApiRepository: mockedLegacyVaultApiRepository,
          vaultsRepository: mockedVaultsRepository,
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
        const mockedVaultsRepository = mockVaultsRepository();
        mockedVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(testLegacyVault);
        const mockedRedemptionsEventsRepository = mockRedemptionsEventsRepository();
        mockedRedemptionsEventsRepository.publishRedemptionEvent = jest.fn().mockResolvedValue(undefined);
        const mockedLegacyVaultApiRepository = mockLegacyVaultApiRepository();
        mockedLegacyVaultApiRepository.getNumberOfCodesIssued = jest.fn().mockResolvedValue(1);
        mockedLegacyVaultApiRepository.assignCodeToMember = jest.fn().mockResolvedValue(testLegacyVaultCode);

        // Act
        const result = await callVaultRedeemStrategy(testVaultRedemption, {
          vaultsRepository: mockedVaultsRepository,
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
      it('Should redeem with standard flow when code doesnt exist in legacy', async () => {
        // Arrange
        const {
          mockedVaultCodesRepository,
          mockedVaultsRepository,
          mockedLegacyVaultApiRepository,
          mockedRedemptionsEventsRepository,
        } = setupReposForVaultCodeNotFoundOnLegacy();
        mockedVaultCodesRepository.claimVaultCode = jest.fn().mockResolvedValue(testStandardVaultCode);

        // Act
        const result = await callVaultRedeemStrategy(testVaultRedemption, {
          vaultsRepository: mockedVaultsRepository,
          legacyVaultApiRepository: mockedLegacyVaultApiRepository,
          redemptionEventsRepository: mockedRedemptionsEventsRepository,
          vaultCodesRepository: mockedVaultCodesRepository,
        });

        // Assert
        expect(result.kind).toBe('Ok');
        expect(mockedVaultsRepository.updateOneById).toHaveBeenCalledTimes(1);
        expect(mockedVaultsRepository.updateOneById).toHaveBeenCalledWith(testLegacyVault.id, {
          vaultType: 'standard',
        });
      });
      it('Should throw an error if the code doesnt exist in either standard or legacy', async () => {
        // Arrange
        const {
          mockedVaultCodesRepository,
          mockedVaultsRepository,
          mockedLegacyVaultApiRepository,
          mockedRedemptionsEventsRepository,
        } = setupReposForVaultCodeNotFoundOnLegacy();
        mockedVaultCodesRepository.claimVaultCode = jest.fn().mockResolvedValue(undefined);

        // Act & Assert
        await expect(() =>
          callVaultRedeemStrategy(testVaultRedemption, {
            vaultsRepository: mockedVaultsRepository,
            legacyVaultApiRepository: mockedLegacyVaultApiRepository,
            redemptionEventsRepository: mockedRedemptionsEventsRepository,
            vaultCodesRepository: mockedVaultCodesRepository,
          }),
        ).rejects.toThrow('No vault code found');
        expect(mockedVaultsRepository.updateOneById).toHaveBeenCalledTimes(1);
        expect(mockedVaultsRepository.updateOneById).toHaveBeenCalledWith(testLegacyVault.id, {
          vaultType: 'standard',
        });
      });
    });
  });
});
