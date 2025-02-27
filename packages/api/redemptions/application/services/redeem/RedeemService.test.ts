import { faker } from '@faker-js/faker';

import { ILogger } from '@blc-mono/core/utils/logger/logger';
import { as } from '@blc-mono/core/utils/testing';
import { createSilentLogger, createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { redemptionConfigEntityFactory } from '../../../libs/test/factories/redemptionConfigEntity.factory';
import { IRedemptionConfigRepository } from '../../repositories/RedemptionConfigRepository';
import {
  IRedemptionsEventsRepository,
  RedemptionsEventsRepository,
} from '../../repositories/RedemptionsEventsRepository';

import { RedeemResult, RedeemService } from './RedeemService';
import { IRedeemStrategyResolver } from './RedeemStrategyResolver';
import { IRedeemStrategy, RedeemedStrategyResult, RedeemParams } from './strategies/IRedeemStrategy';

const mockedRedemptionConfigRepository = mockRedemptionConfigRepository();
const mockedRedemptionEventsRepository = mockRedemptionEventsRepository();

describe('RedeemService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultOfferId = faker.string.sample(10);
  const defaultParams: RedeemParams = {
    memberId: faker.string.sample(5),
    brazeExternalUserId: faker.string.uuid(),
    companyName: faker.string.sample(5),
    offerName: faker.string.sample(5),
    clientType: faker.helpers.arrayElement(['web', 'mobile']),
    memberEmail: faker.internet.email(),
  };
  function callRedeemMethod(
    offerId: string,
    {
      params,
      logger,
      redemptionConfigRepository: redemptionConfigRepository,
      redeemStrategyResolver,
      redemptionEventsRepository,
    }: {
      params?: RedeemParams;
      logger?: ILogger;
      redemptionConfigRepository?: IRedemptionConfigRepository;
      redeemStrategyResolver?: IRedeemStrategyResolver;
      redemptionEventsRepository?: RedemptionsEventsRepository;
    },
  ): Promise<RedeemResult> {
    const mockedLogger = logger ?? createTestLogger();
    const mockedParams = params ?? defaultParams;

    const mockedRedeemStrategyResolver =
      redeemStrategyResolver ??
      ({
        getRedemptionStrategy: jest.fn(),
      } satisfies IRedeemStrategyResolver);

    const service = new RedeemService(
      mockedLogger,
      as(redemptionConfigRepository ?? mockedRedemptionConfigRepository),
      mockedRedeemStrategyResolver,
      redemptionEventsRepository ?? mockedRedemptionEventsRepository,
    );
    return service.redeem(offerId, mockedParams);
  }

  it('throws if the redemption is not found', async () => {
    mockedRedemptionConfigRepository.findOneByOfferId = jest.fn().mockResolvedValue(null);

    await expect(() =>
      callRedeemMethod(defaultOfferId, {
        redemptionConfigRepository: mockedRedemptionConfigRepository,
      }),
    ).rejects.toThrow();
  });

  it('returns an Ok result when the redemption is found and redeemed successfully', async () => {
    const redemption = redemptionConfigEntityFactory.build();
    const redeemedResult: RedeemedStrategyResult = {
      kind: 'Ok',
      redemptionType: 'preApplied',
      redemptionDetails: { url: faker.internet.url() },
    };

    mockedRedemptionConfigRepository.findOneByOfferId = jest.fn().mockResolvedValue(redemption);

    const redeemStrategy = {
      redeem: jest.fn().mockResolvedValue(redeemedResult),
    } satisfies IRedeemStrategy;
    const redeemStrategyResolver = {
      getRedemptionStrategy: jest.fn().mockReturnValue(redeemStrategy),
    } satisfies IRedeemStrategyResolver;

    mockedRedemptionEventsRepository.publishMemberRedeemIntentEvent = jest.fn().mockResolvedValue(undefined);

    const result = await callRedeemMethod(defaultOfferId, {
      redemptionConfigRepository: mockedRedemptionConfigRepository,
      redeemStrategyResolver,
      redemptionEventsRepository: mockedRedemptionEventsRepository,
    });

    expect(result).toEqual({
      kind: 'Ok',
      redemptionType: 'preApplied',
      redemptionDetails: redeemedResult.redemptionDetails,
    });
  });

  it('publishes member redeem intent event', async () => {
    const redemption = redemptionConfigEntityFactory.build({
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

    mockedRedemptionConfigRepository.findOneByOfferId = jest.fn().mockResolvedValue(redemption);

    const redeemStrategy = {
      redeem: jest.fn().mockResolvedValue(redeemedResult),
    } satisfies IRedeemStrategy;
    const redeemStrategyResolver = {
      getRedemptionStrategy: jest.fn().mockReturnValue(redeemStrategy),
    } satisfies IRedeemStrategyResolver;

    mockedRedemptionEventsRepository.publishMemberRedeemIntentEvent = jest.fn().mockResolvedValue(undefined);
    mockedRedemptionEventsRepository.publishRedemptionEvent = jest.fn().mockResolvedValue(undefined);

    await callRedeemMethod(defaultOfferId, {
      redemptionConfigRepository: mockedRedemptionConfigRepository,
      redeemStrategyResolver,
      redemptionEventsRepository: mockedRedemptionEventsRepository,
    });

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

  it('sends data for DWH (logRedemptionAttempt) and generic code Braze email to event bus', async () => {
    const redemption = redemptionConfigEntityFactory.build({
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

    mockedRedemptionConfigRepository.findOneByOfferId = jest.fn().mockResolvedValue(redemption);
    const redeemStrategy = {
      redeem: jest.fn().mockResolvedValue(redeemedResult),
    } satisfies IRedeemStrategy;
    const redeemStrategyResolver = {
      getRedemptionStrategy: jest.fn().mockReturnValue(redeemStrategy),
    } satisfies IRedeemStrategyResolver;

    mockedRedemptionEventsRepository.publishMemberRedeemIntentEvent = jest.fn().mockResolvedValue(undefined);
    mockedRedemptionEventsRepository.publishRedemptionEvent = jest.fn().mockResolvedValue(undefined);

    await callRedeemMethod(defaultOfferId, {
      redemptionConfigRepository: mockedRedemptionConfigRepository,
      redeemStrategyResolver,
      redemptionEventsRepository: mockedRedemptionEventsRepository,
    });

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

  it('completes successfully when publishMemberRedeemIntentEvent (DWH - logRedemptionAttempt) fails', async () => {
    const redemption = redemptionConfigEntityFactory.build({
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

    mockedRedemptionConfigRepository.findOneByOfferId = jest.fn().mockResolvedValue(redemption);

    const redeemStrategy = {
      redeem: jest.fn().mockResolvedValue(redeemedResult),
    } satisfies IRedeemStrategy;
    const redeemStrategyResolver = {
      getRedemptionStrategy: jest.fn().mockReturnValue(redeemStrategy),
    } satisfies IRedeemStrategyResolver;
    const mockedRedemptionEventsRepository = mockRedemptionEventsRepository();
    mockedRedemptionEventsRepository.publishMemberRedeemIntentEvent = jest.fn().mockRejectedValue(new Error());

    const result = await callRedeemMethod(defaultOfferId, {
      logger: silentLogger,
      redemptionConfigRepository: mockedRedemptionConfigRepository,
      redeemStrategyResolver,
      redemptionEventsRepository: mockedRedemptionEventsRepository,
    });

    expect(result).toEqual({
      kind: 'Ok',
      redemptionType: 'preApplied',
      redemptionDetails: redeemedResult.redemptionDetails,
    });
  });
});

function mockRedemptionConfigRepository(): IRedemptionConfigRepository {
  return {
    findOneByOfferId: jest.fn(),
    findOneById: jest.fn(),
    updateManyByOfferId: jest.fn(),
    updateOneByOfferId: jest.fn(),
    createRedemption: jest.fn(),
    withTransaction: jest.fn(),
    updateOneById: jest.fn(),
    deleteById: jest.fn(),
  };
}

function mockRedemptionEventsRepository(): IRedemptionsEventsRepository {
  return {
    publishMemberRetrievedRedemptionDetailsEvent: jest.fn(),
    publishMemberRedeemIntentEvent: jest.fn(),
    publishRedemptionEvent: jest.fn(),
    publishVaultBatchCreatedEvent: jest.fn(),
    publishRunBallotEvent: jest.fn(),
    publishSuccessfulBallotEvent: jest.fn(),
    publishUnsuccessfulBallotEvent: jest.fn(),
  };
}
