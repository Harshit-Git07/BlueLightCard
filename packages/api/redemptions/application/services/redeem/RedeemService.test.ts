import { faker } from '@faker-js/faker';

import { IRedemptionsRepository } from '../../repositories/RedeptionsRepository';
import { redemptionFactory } from '../../test/factories/redemption.factory';

import { RedeemService } from './RedeemService';
import { IRedeemStrategyResolver } from './RedeemStrategyResolver';
import { IRedeemStrategy, RedeemedStrategyResult } from './strategies/IRedeemStrategy';

describe('RedeemService', () => {
  it('should return a RedemptionNotFound result if the redemption is not found', async () => {
    // Arrange
    const redemptionsRepository = {
      findOneByOfferId: jest.fn(),
    } satisfies IRedemptionsRepository;
    const redeemStrategyResolver = {
      getRedemptionStrategy: jest.fn(),
    } satisfies IRedeemStrategyResolver;
    const service = new RedeemService(redemptionsRepository, redeemStrategyResolver);
    redemptionsRepository.findOneByOfferId.mockResolvedValue(null);
    const offerId = faker.number.int({
      min: 1,
      max: 1_000_000,
    });

    // Act
    const result = await service.redeem(offerId);

    // Assert
    expect(result).toEqual({
      kind: 'RedemptionNotFound',
    });
  });

  it('should return an Ok result when the redemption is found and redeemd successfully', async () => {
    // Arrange
    const redemptionsRepository = {
      findOneByOfferId: jest.fn(),
    } satisfies IRedemptionsRepository;
    const redeemStrategyResolver = {
      getRedemptionStrategy: jest.fn(),
    } satisfies IRedeemStrategyResolver;
    const service = new RedeemService(redemptionsRepository, redeemStrategyResolver);
    const redemption = redemptionFactory.build();
    const redeemedResult: RedeemedStrategyResult = {
      kind: 'Ok',
      redemptionDetails: {
        url: faker.internet.url(),
        code: faker.string.alphanumeric(6),
      },
    };
    const redeemStrategy = {
      redeem: jest.fn(),
    } satisfies IRedeemStrategy;
    redeemStrategy.redeem.mockResolvedValue(redeemedResult);
    redeemStrategyResolver.getRedemptionStrategy.mockReturnValue(redeemStrategy);
    redemptionsRepository.findOneByOfferId.mockResolvedValue(redemption);
    const offerId = faker.number.int({
      min: 1,
      max: 1_000_000,
    });

    // Act
    const result = await service.redeem(offerId);

    // Assert
    expect(result).toEqual({
      kind: 'Ok',
      redemptionType: redemption.redemptionType,
      redemptionDetails: redeemedResult.redemptionDetails,
    });
  });
});
