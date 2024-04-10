import { faker } from '@faker-js/faker';

import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { redemptionFactory } from '../../../libs/test/factories/redemption.factory';
import { IDwhRepository } from '../../repositories/DwhRepository';
import { IRedemptionsRepository } from '../../repositories/RedemptionsRepository';

import { RedemptionDetailsService } from './RedemptionDetailsService';

describe('RedemptionDetailsService', () => {
  it('should return a RedemptionNotFound result if the redemption is not found', async () => {
    // Arrange
    const logger = createTestLogger();
    const redemptionsRepository = {
      findOneByOfferId: jest.fn(),
      updateOneByOfferId: jest.fn(),
      updateManyByOfferId: jest.fn(),
      createRedemption: jest.fn(),
      withTransaction: jest.fn(),
    } satisfies IRedemptionsRepository;
    const dwhRepository = {
      logOfferView: jest.fn().mockResolvedValue(undefined),
      logRedemptionAttempt: jest.fn(),
      logVaultRedemption: jest.fn(),
    } satisfies IDwhRepository;
    const service = new RedemptionDetailsService(logger, redemptionsRepository, dwhRepository);
    redemptionsRepository.findOneByOfferId.mockResolvedValue(null);
    const offerId = faker.number.int({
      min: 1,
      max: 1_000_000,
    });
    const memberId = faker.string.numeric(8);

    // Act
    const result = await service.getRedemptionDetails(offerId, memberId);

    // Assert
    expect(result).toEqual({
      kind: 'RedemptionNotFound',
    });
  });

  it('should return an Ok result when the redemption is found', async () => {
    // Arrange
    const logger = createTestLogger();
    const redemptionsRepository = {
      findOneByOfferId: jest.fn(),
      updateOneByOfferId: jest.fn(),
      updateManyByOfferId: jest.fn(),
      createRedemption: jest.fn(),
      withTransaction: jest.fn(),
    } satisfies IRedemptionsRepository;
    const dwhRepository = {
      logOfferView: jest.fn().mockResolvedValue(undefined),
      logRedemptionAttempt: jest.fn(),
      logVaultRedemption: jest.fn(),
    } satisfies IDwhRepository;
    const service = new RedemptionDetailsService(logger, redemptionsRepository, dwhRepository);
    const redemption = redemptionFactory.build();
    redemptionsRepository.findOneByOfferId.mockResolvedValue(redemption);
    const offerId = faker.number.int({
      min: 1,
      max: 1_000_000,
    });
    const memberId = faker.string.numeric(8);

    // Act
    const result = await service.getRedemptionDetails(offerId, memberId);

    // Assert
    expect(result).toEqual({
      kind: 'Ok',
      data: {
        redemptionType: redemption.redemptionType,
      },
    });
  });

  it('should log events to the data warehouse', async () => {
    // Arrange
    const logger = createTestLogger();
    const redemptionsRepository = {
      findOneByOfferId: jest.fn(),
      updateOneByOfferId: jest.fn(),
      updateManyByOfferId: jest.fn(),
      createRedemption: jest.fn(),
      withTransaction: jest.fn(),
    } satisfies IRedemptionsRepository;
    const dwhRepository = {
      logOfferView: jest.fn().mockResolvedValue(undefined),
      logRedemptionAttempt: jest.fn(),
      logVaultRedemption: jest.fn(),
    } satisfies IDwhRepository;
    const service = new RedemptionDetailsService(logger, redemptionsRepository, dwhRepository);
    const redemption = redemptionFactory.build();
    redemptionsRepository.findOneByOfferId.mockResolvedValue(redemption);
    const offerId = faker.number.int({
      min: 1,
      max: 1_000_000,
    });
    const memberId = faker.string.numeric(8);

    // Act
    await service.getRedemptionDetails(offerId, memberId);

    // Assert
    expect(dwhRepository.logOfferView).toHaveBeenCalledWith(offerId, redemption.companyId, memberId);
  });

  it('should return successfully if logging to data warehousing fails', async () => {
    // Arrange
    const logger = createTestLogger();
    const redemptionsRepository = {
      findOneByOfferId: jest.fn(),
      updateOneByOfferId: jest.fn(),
      updateManyByOfferId: jest.fn(),
      createRedemption: jest.fn(),
      withTransaction: jest.fn(),
    } satisfies IRedemptionsRepository;
    const dwhRepository = {
      logOfferView: jest.fn().mockRejectedValue(new Error('Failed to log offer view')),
      logRedemptionAttempt: jest.fn(),
      logVaultRedemption: jest.fn(),
    } satisfies IDwhRepository;
    const service = new RedemptionDetailsService(logger, redemptionsRepository, dwhRepository);
    const redemption = redemptionFactory.build();
    redemptionsRepository.findOneByOfferId.mockResolvedValue(redemption);
    const offerId = faker.number.int({
      min: 1,
      max: 1_000_000,
    });
    const memberId = faker.string.numeric(8);

    // Act
    const result = await service.getRedemptionDetails(offerId, memberId);

    // Assert
    expect(result).toEqual({
      kind: 'Ok',
      data: {
        redemptionType: redemption.redemptionType,
      },
    });
  });
});
