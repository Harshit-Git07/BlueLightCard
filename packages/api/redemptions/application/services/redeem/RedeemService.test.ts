import { faker } from '@faker-js/faker';

import { ILogger } from '@blc-mono/core/utils/logger/logger';
import { as } from '@blc-mono/core/utils/testing';
import { createSilentLogger, createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { redemptionFactory } from '../../../libs/test/factories/redemption.factory';
import {
  IRedemptionsEventsRepository,
  RedemptionsEventsRepository,
} from '../../repositories/RedemptionsEventsRepository';
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
  function callRedeemMethod(
    offerId: number,
    {
      params,
      logger,
      redemptionsRepository,
      redeemStrategyResolver,
      redemptionEventsRepository,
    }: {
      params?: RedeemParams;
      logger?: ILogger;
      redemptionsRepository?: IRedemptionsRepository;
      redeemStrategyResolver?: IRedeemStrategyResolver;
      redemptionEventsRepository?: RedemptionsEventsRepository;
    },
  ): Promise<RedeemResult> {
    const mockedLogger = logger ?? createTestLogger();
    const mockedParams = params ?? defaultParams;
    const mockedRedemptionsRepository = redemptionsRepository ?? mockRedemptionRepository();
    const mockedRedeemStrategyResolver =
      redeemStrategyResolver ??
      ({
        getRedemptionStrategy: jest.fn(),
      } satisfies IRedeemStrategyResolver);
    const mockedRedemptionEventsRepository = redemptionEventsRepository ?? mockRedemptionEventsRepository();
    const service = new RedeemService(
      mockedLogger,
      as(mockedRedemptionsRepository),
      mockedRedeemStrategyResolver,
      mockedRedemptionEventsRepository,
    );
    return service.redeem(offerId, mockedParams);
  }

  function mockRedemptionRepository(): Partial<IRedemptionsRepository> {
    return {
      findOneByOfferId: jest.fn(),
      updateManyByOfferId: jest.fn(),
      updateOneByOfferId: jest.fn(),
      createRedemption: jest.fn(),
      withTransaction: jest.fn(),
    };
  }

  function mockRedemptionEventsRepository(): IRedemptionsEventsRepository {
    return {
      publishMemberRetrievedRedemptionDetailsEvent: jest.fn(),
      publishMemberRedeemIntentEvent: jest.fn(),
      publishRedemptionEvent: jest.fn(),
      publishVaultBatchCreatedEvent: jest.fn(),
    };
  }

  it('should return a RedemptionNotFound result if the redemption is not found', async () => {
    // Arrange
    const mockedRedemptionsRepository = mockRedemptionRepository();
    mockedRedemptionsRepository.findOneByOfferId = jest.fn().mockResolvedValue(null);

    // Act
    const result = await callRedeemMethod(defaultOfferId, {
      redemptionsRepository: as(mockedRedemptionsRepository),
    });

    // Assert
    expect(result).toEqual({
      kind: 'RedemptionNotFound',
    });
  });

  it('should return an Ok result when the redemption is found and redeemed successfully', async () => {
    // Arrange
    const redemption = redemptionFactory.build();
    const redeemedResult: RedeemedStrategyResult = {
      kind: 'Ok',
      redemptionType: 'preApplied',
      redemptionDetails: { url: faker.internet.url() },
    };
    const mockedRedemptionsRepository = mockRedemptionRepository();
    mockedRedemptionsRepository.findOneByOfferId = jest.fn().mockResolvedValue(redemption);
    const redeemStrategy = {
      redeem: jest.fn().mockResolvedValue(redeemedResult),
    } satisfies IRedeemStrategy;
    const redeemStrategyResolver = {
      getRedemptionStrategy: jest.fn().mockReturnValue(redeemStrategy),
    } satisfies IRedeemStrategyResolver;
    const mockedRedemptionEventsRepository = mockRedemptionEventsRepository();
    mockedRedemptionEventsRepository.publishMemberRedeemIntentEvent = jest.fn().mockResolvedValue(undefined);

    // Act
    const result = await callRedeemMethod(defaultOfferId, {
      redemptionsRepository: as(mockedRedemptionsRepository),
      redeemStrategyResolver,
      redemptionEventsRepository: mockedRedemptionEventsRepository,
    });

    // Assert
    expect(result).toEqual({
      kind: 'Ok',
      redemptionType: 'preApplied',
      redemptionDetails: redeemedResult.redemptionDetails,
    });
  });

  it('should publish member redeem intent event', async () => {
    // Arrange
    const redemption = redemptionFactory.build({
      offerId: defaultOfferId,
      affiliate: 'awin',
    });
    const redeemedResult: RedeemedStrategyResult = {
      kind: 'Ok',
      redemptionType: 'vault',
      redemptionDetails: {
        url: 'https://www.awin1.com',
        code: faker.string.alphanumeric(6),
      },
    };
    const mockedRedemptionsRepository = mockRedemptionRepository();
    mockedRedemptionsRepository.findOneByOfferId = jest.fn().mockResolvedValue(redemption);
    const redeemStrategy = {
      redeem: jest.fn().mockResolvedValue(redeemedResult),
    } satisfies IRedeemStrategy;
    const redeemStrategyResolver = {
      getRedemptionStrategy: jest.fn().mockReturnValue(redeemStrategy),
    } satisfies IRedeemStrategyResolver;
    const mockedRedemptionEventsRepository = mockRedemptionEventsRepository();
    mockedRedemptionEventsRepository.publishMemberRedeemIntentEvent = jest.fn().mockResolvedValue(undefined);
    mockedRedemptionEventsRepository.publishRedemptionEvent = jest.fn().mockResolvedValue(undefined);

    // Act
    await callRedeemMethod(defaultOfferId, {
      redemptionsRepository: as(mockedRedemptionsRepository),
      redeemStrategyResolver,
      redemptionEventsRepository: mockedRedemptionEventsRepository,
    });

    // Assert
    expect(mockedRedemptionEventsRepository.publishMemberRedeemIntentEvent).toHaveBeenCalledWith({
      memberDetails: {
        memberId: defaultParams.memberId,
      },
      redemptionDetails: {
        clientType: defaultParams.clientType,
        companyId: redemption.companyId,
        offerId: defaultOfferId,
        redemptionType: redemption.redemptionType,
      },
    });
  });

  it('should send data for DWH (logRedemptionAttempt) and generic code Braze email to event bus', async () => {
    // Arrange
    const redemption = redemptionFactory.build({
      offerId: defaultOfferId,
      affiliate: 'awin',
    });
    const redeemedResult: RedeemedStrategyResult = {
      kind: 'Ok',
      redemptionType: 'generic',
      redemptionDetails: {
        url: 'https://www.awin1.com',
        code: faker.string.alphanumeric(6),
      },
    };
    const mockedRedemptionsRepository = mockRedemptionRepository();
    mockedRedemptionsRepository.findOneByOfferId = jest.fn().mockResolvedValue(redemption);
    const redeemStrategy = {
      redeem: jest.fn().mockResolvedValue(redeemedResult),
    } satisfies IRedeemStrategy;
    const redeemStrategyResolver = {
      getRedemptionStrategy: jest.fn().mockReturnValue(redeemStrategy),
    } satisfies IRedeemStrategyResolver;
    const mockedRedemptionEventsRepository = mockRedemptionEventsRepository();
    mockedRedemptionEventsRepository.publishMemberRedeemIntentEvent = jest.fn().mockResolvedValue(undefined);
    mockedRedemptionEventsRepository.publishRedemptionEvent = jest.fn().mockResolvedValue(undefined);

    // Act
    await callRedeemMethod(defaultOfferId, {
      redemptionsRepository: as(mockedRedemptionsRepository),
      redeemStrategyResolver,
      redemptionEventsRepository: mockedRedemptionEventsRepository,
    });

    // Assert
    expect(mockedRedemptionEventsRepository.publishMemberRedeemIntentEvent).toHaveBeenCalledWith({
      memberDetails: {
        memberId: defaultParams.memberId,
      },
      redemptionDetails: {
        clientType: defaultParams.clientType,
        companyId: redemption.companyId,
        offerId: defaultOfferId,
        redemptionType: redemption.redemptionType,
      },
    });
  });

  it('should complete successfully when publishMemberRedeemIntentEvent (DWH - logRedemptionAttempt) fails', async () => {
    // Arrange
    const redemption = redemptionFactory.build({
      offerId: defaultOfferId,
    });
    const redeemedResult: RedeemedStrategyResult = {
      kind: 'Ok',
      redemptionType: 'preApplied',
      redemptionDetails: {
        url: faker.internet.url(),
      },
    };
    const silentLogger = createSilentLogger();
    const mockedRedemptionsRepository = mockRedemptionRepository();
    mockedRedemptionsRepository.findOneByOfferId = jest.fn().mockResolvedValue(redemption);
    const redeemStrategy = {
      redeem: jest.fn().mockResolvedValue(redeemedResult),
    } satisfies IRedeemStrategy;
    const redeemStrategyResolver = {
      getRedemptionStrategy: jest.fn().mockReturnValue(redeemStrategy),
    } satisfies IRedeemStrategyResolver;
    const mockedRedemptionEventsRepository = mockRedemptionEventsRepository();
    mockedRedemptionEventsRepository.publishMemberRedeemIntentEvent = jest.fn().mockRejectedValue(new Error());

    // Act
    const result = await callRedeemMethod(defaultOfferId, {
      logger: silentLogger,
      redemptionsRepository: as(mockedRedemptionsRepository),
      redeemStrategyResolver,
      redemptionEventsRepository: mockedRedemptionEventsRepository,
    });

    // Assert
    expect(result).toEqual({
      kind: 'Ok',
      redemptionType: 'preApplied',
      redemptionDetails: redeemedResult.redemptionDetails,
    });
  });
});
