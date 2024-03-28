import { faker } from '@faker-js/faker';

import { redemptionFactory } from '../../../libs/test/factories/redemption.factory';
import { RedemptionEventsRepository } from '../../repositories/RedemptionEventsRepository';
import { IRedemptionsRepository } from '../../repositories/RedemptionsRepository';

import { RedeemResult, RedeemService, StrategyParams } from './RedeemService';
import { IRedeemStrategyResolver } from './RedeemStrategyResolver';
import { IRedeemStrategy, RedeemedStrategyResult } from './strategies/IRedeemStrategy';

describe('RedeemService', () => {
  const defaultOfferId = faker.number.int({
    min: 1,
    max: 1_000,
  });
  async function callRedeemMethod(
    offerId: number,
    {
      params,
      redemptionsRepository,
      redeemStrategyResolver,
      redemptionEventsRepository,
    }: {
      params?: StrategyParams;
      redemptionsRepository?: IRedemptionsRepository;
      redeemStrategyResolver?: IRedeemStrategyResolver;
      redemptionEventsRepository?: RedemptionEventsRepository;
    },
  ): Promise<RedeemResult> {
    const mockedParams = params ?? {
      memberId: faker.string.sample(5),
      brazeExternalUserId: faker.string.uuid(),
      companyName: faker.string.sample(5),
      offerName: faker.string.sample(5),
    };
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
    const service = new RedeemService(
      mockedRedemptionsRepository,
      mockedRedeemStrategyResolver,
      mockedRedemptionEventsRepository,
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
});
