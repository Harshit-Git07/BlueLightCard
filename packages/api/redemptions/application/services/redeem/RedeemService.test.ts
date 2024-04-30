import { faker } from '@faker-js/faker';

import { ILogger } from '@blc-mono/core/utils/logger/logger';
import { createSilentLogger, createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { redemptionFactory } from '../../../libs/test/factories/redemption.factory';
import { IDwhRepository } from '../../repositories/DwhRepository';
import { RedemptionEventsRepository } from '../../repositories/RedemptionEventsRepository';
import { IRedemptionsRepository } from '../../repositories/RedemptionsRepository';

import { RedeemResult, RedeemService } from './RedeemService';
import { IRedeemStrategyResolver } from './RedeemStrategyResolver';
import { IRedeemStrategy, RedeemedStrategyResult, RedeemParams } from './strategies/IRedeemStrategy';

describe('RedeemService', () => {
  const defaultOfferId = faker.number.int({
    min: 1,
    max: 1_000,
  });
  const defaultParams: RedeemParams = {
    memberId: faker.string.sample(5),
    brazeExternalUserId: faker.string.uuid(),
    companyName: faker.string.sample(5),
    offerName: faker.string.sample(5),
    clientType: faker.helpers.arrayElement(['web', 'mobile']),
  };
  async function callRedeemMethod(
    offerId: number,
    {
      params,
      logger,
      redemptionsRepository,
      redeemStrategyResolver,
      redemptionEventsRepository,
      dwhRepository,
    }: {
      params?: RedeemParams;
      logger?: ILogger;
      redemptionsRepository?: IRedemptionsRepository;
      redeemStrategyResolver?: IRedeemStrategyResolver;
      redemptionEventsRepository?: RedemptionEventsRepository;
      dwhRepository?: IDwhRepository;
    },
  ): Promise<RedeemResult> {
    const mockedLogger = logger ?? createTestLogger();
    const mockedParams = params ?? defaultParams;
    const mockedRedemptionsRepository =
      redemptionsRepository ??
      ({
        findOneByOfferId: jest.fn(),
        updateManyByOfferId: jest.fn(),
        updateOneByOfferId: jest.fn(),
        createRedemption: jest.fn(),
        withTransaction: jest.fn(),
      } satisfies IRedemptionsRepository);
    const mockedRedeemStrategyResolver =
      redeemStrategyResolver ??
      ({
        getRedemptionStrategy: jest.fn(),
      } satisfies IRedeemStrategyResolver);
    const mockedRedemptionEventsRepository =
      redemptionEventsRepository ??
      ({
        publishEvent: jest.fn(),
      } satisfies RedemptionEventsRepository);
    const mockedDwhRepository =
      dwhRepository ??
      ({
        logOfferView: jest.fn(),
        logRedemptionAttempt: jest.fn().mockResolvedValue(undefined),
        logVaultRedemption: jest.fn().mockResolvedValue(undefined),
      } satisfies IDwhRepository);
    const service = new RedeemService(
      mockedLogger,
      mockedRedemptionsRepository,
      mockedRedeemStrategyResolver,
      mockedRedemptionEventsRepository,
      mockedDwhRepository,
    );
    return service.redeem(offerId, mockedParams);
  }

  it('should return a RedemptionNotFound result if the redemption is not found', async () => {
    // Arrange
    const mockedRedemptionsRepository = {
      findOneByOfferId: jest.fn().mockResolvedValue(null),
      updateManyByOfferId: jest.fn(),
      updateOneByOfferId: jest.fn(),
      createRedemption: jest.fn(),
      withTransaction: jest.fn(),
    } satisfies IRedemptionsRepository;

    // Act
    const result = await callRedeemMethod(defaultOfferId, {
      redemptionsRepository: mockedRedemptionsRepository,
    });

    // Assert
    expect(result).toEqual({
      kind: 'RedemptionNotFound',
    });
  });

  it('should return an Ok result when the redemption is found and redeemd successfully', async () => {
    // Arrange
    const redemption = redemptionFactory.build();
    const redeemedResult: RedeemedStrategyResult = {
      kind: 'Ok',
      redemptionType: 'generic',
      redemptionDetails: {
        url: faker.internet.url(),
        code: faker.string.alphanumeric(6),
      },
    };
    const redemptionsRepository = {
      findOneByOfferId: jest.fn().mockResolvedValue(redemption),
      updateManyByOfferId: jest.fn(),
      updateOneByOfferId: jest.fn(),
      createRedemption: jest.fn(),
      withTransaction: jest.fn(),
    } satisfies IRedemptionsRepository;
    const redeemStrategy = {
      redeem: jest.fn().mockResolvedValue(redeemedResult),
    } satisfies IRedeemStrategy;
    const redeemStrategyResolver = {
      getRedemptionStrategy: jest.fn().mockReturnValue(redeemStrategy),
    } satisfies IRedeemStrategyResolver;

    // Act
    const result = await callRedeemMethod(defaultOfferId, {
      redemptionsRepository,
      redeemStrategyResolver,
    });

    // Assert
    expect(result).toEqual({
      kind: 'Ok',
      redemptionType: 'generic',
      redemptionDetails: redeemedResult.redemptionDetails,
    });
  });

  it('should log data warehousing events', async () => {
    // Arrange
    const redemption = redemptionFactory.build({
      offerId: defaultOfferId,
    });
    const redeemedResult: RedeemedStrategyResult = {
      kind: 'Ok',
      redemptionType: 'vault',
      redemptionDetails: {
        url: faker.internet.url(),
        code: faker.string.alphanumeric(6),
      },
    };
    const redemptionsRepository = {
      findOneByOfferId: jest.fn().mockResolvedValue(redemption),
      updateManyByOfferId: jest.fn(),
      updateOneByOfferId: jest.fn(),
      createRedemption: jest.fn(),
      withTransaction: jest.fn(),
    } satisfies IRedemptionsRepository;
    const redeemStrategy = {
      redeem: jest.fn().mockResolvedValue(redeemedResult),
    } satisfies IRedeemStrategy;
    const redeemStrategyResolver = {
      getRedemptionStrategy: jest.fn().mockReturnValue(redeemStrategy),
    } satisfies IRedeemStrategyResolver;
    const dwhRepository = {
      logOfferView: jest.fn(),
      logRedemptionAttempt: jest.fn().mockResolvedValue(undefined),
      logVaultRedemption: jest.fn().mockResolvedValue(undefined),
    } satisfies IDwhRepository;

    // Act
    await callRedeemMethod(defaultOfferId, {
      redemptionsRepository,
      redeemStrategyResolver,
      dwhRepository,
    });

    // Assert
    expect(dwhRepository.logRedemptionAttempt).toHaveBeenCalledWith(
      redemption.offerId,
      redemption.companyId,
      defaultParams.memberId,
      defaultParams.clientType,
    );
    expect(dwhRepository.logVaultRedemption).toHaveBeenCalledWith(
      redemption.offerId,
      redemption.companyId,
      defaultParams.memberId,
      redeemedResult.redemptionDetails.code,
    );
  });

  it('should complete successfully when logRedemptionAttempt fails', async () => {
    // Arrange
    const redemption = redemptionFactory.build({
      offerId: defaultOfferId,
    });
    const redeemedResult: RedeemedStrategyResult = {
      kind: 'Ok',
      redemptionType: 'generic',
      redemptionDetails: {
        url: faker.internet.url(),
        code: faker.string.alphanumeric(6),
      },
    };
    const silentLogger = createSilentLogger();
    const redemptionsRepository = {
      findOneByOfferId: jest.fn().mockResolvedValue(redemption),
      updateManyByOfferId: jest.fn(),
      updateOneByOfferId: jest.fn(),
      createRedemption: jest.fn(),
      withTransaction: jest.fn(),
    } satisfies IRedemptionsRepository;
    const redeemStrategy = {
      redeem: jest.fn().mockResolvedValue(redeemedResult),
    } satisfies IRedeemStrategy;
    const redeemStrategyResolver = {
      getRedemptionStrategy: jest.fn().mockReturnValue(redeemStrategy),
    } satisfies IRedeemStrategyResolver;
    const dwhRepository = {
      logOfferView: jest.fn(),
      logRedemptionAttempt: jest.fn().mockRejectedValue(new Error('Failed to log redemption attempt')),
      logVaultRedemption: jest.fn().mockResolvedValue(undefined),
    } satisfies IDwhRepository;

    // Act
    const result = await callRedeemMethod(defaultOfferId, {
      logger: silentLogger,
      redemptionsRepository,
      redeemStrategyResolver,
      dwhRepository,
    });

    // Assert
    expect(result).toEqual({
      kind: 'Ok',
      redemptionType: 'generic',
      redemptionDetails: redeemedResult.redemptionDetails,
    });
  });

  it('should complete successfully when logVaultRedemption fails', async () => {
    // Arrange
    const redemption = redemptionFactory.build({
      offerId: defaultOfferId,
    });
    const redeemedResult: RedeemedStrategyResult = {
      kind: 'Ok',
      redemptionType: 'generic',
      redemptionDetails: {
        url: faker.internet.url(),
        code: faker.string.alphanumeric(6),
      },
    };
    const silentLogger = createSilentLogger();
    const redemptionsRepository = {
      findOneByOfferId: jest.fn().mockResolvedValue(redemption),
      updateManyByOfferId: jest.fn(),
      updateOneByOfferId: jest.fn(),
      createRedemption: jest.fn(),
      withTransaction: jest.fn(),
    } satisfies IRedemptionsRepository;
    const redeemStrategy = {
      redeem: jest.fn().mockResolvedValue(redeemedResult),
    } satisfies IRedeemStrategy;
    const redeemStrategyResolver = {
      getRedemptionStrategy: jest.fn().mockReturnValue(redeemStrategy),
    } satisfies IRedeemStrategyResolver;
    const dwhRepository = {
      logOfferView: jest.fn(),
      logRedemptionAttempt: jest.fn().mockResolvedValue(undefined),
      logVaultRedemption: jest.fn().mockRejectedValue(new Error('Failed to log vault redemption')),
    } satisfies IDwhRepository;

    // Act
    const result = await callRedeemMethod(defaultOfferId, {
      logger: silentLogger,
      redemptionsRepository,
      redeemStrategyResolver,
      dwhRepository,
    });

    // Assert
    expect(result).toEqual({
      kind: 'Ok',
      redemptionType: 'generic',
      redemptionDetails: redeemedResult.redemptionDetails,
    });
  });
});
