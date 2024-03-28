import { faker } from '@faker-js/faker';

import { redemptionFactory } from '../../../libs/test/factories/redemption.factory';
import { IRedemptionsRepository } from '../../repositories/RedemptionsRepository';

import { RedemptionDetailsService } from './RedemptionDetailsService';

describe('RedemptionDetailsService', () => {
  it('should return a RedemptionNotFound result if the redemption is not found', async () => {
    // Arrange
    const redemptionsRepository = {
      findOneByOfferId: jest.fn(),
      updateOneByOfferId: jest.fn(),
      updateManyByOfferId: jest.fn(),
      createRedemption: jest.fn(),
      withTransaction: jest.fn(),
    } satisfies IRedemptionsRepository;
    const service = new RedemptionDetailsService(redemptionsRepository);
    redemptionsRepository.findOneByOfferId.mockResolvedValue(null);
    const offerId = faker.number.int({
      min: 1,
      max: 1_000_000,
    });

    // Act
    const result = await service.getRedemptionDetails(offerId);

    // Assert
    expect(result).toEqual({
      kind: 'RedemptionNotFound',
    });
  });

  it('should return an Ok result when the redemption is found', async () => {
    // Arrange
    const redemptionsRepository = {
      findOneByOfferId: jest.fn(),
      updateOneByOfferId: jest.fn(),
      updateManyByOfferId: jest.fn(),
      createRedemption: jest.fn(),
      withTransaction: jest.fn(),
    } satisfies IRedemptionsRepository;
    const service = new RedemptionDetailsService(redemptionsRepository);
    const redemption = redemptionFactory.build();
    redemptionsRepository.findOneByOfferId.mockResolvedValue(redemption);
    const offerId = faker.number.int({
      min: 1,
      max: 1_000_000,
    });

    // Act
    const result = await service.getRedemptionDetails(offerId);

    // Assert
    expect(result).toEqual({
      kind: 'Ok',
      data: {
        redemptionType: redemption.redemptionType,
      },
    });
  });
});
