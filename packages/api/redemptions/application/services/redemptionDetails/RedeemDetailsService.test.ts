import { faker } from '@faker-js/faker';

import { ClientType } from '@blc-mono/core/schemas/domain';
import { IRedemptionsRepository } from '@blc-mono/redemptions/application/repositories/RedemptionsRepository';
import { createSilentLogger, createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { redemptionFactory } from '../../../libs/test/factories/redemption.factory';
import { RedemptionsEventsRepository } from '../../repositories/RedemptionsEventsRepository';

import { RedemptionDetailsService } from './RedemptionDetailsService';

describe('RedemptionDetailsService', () => {
  const defaultClientType: ClientType = faker.helpers.arrayElement(['web', 'mobile']);

  it('should return a RedemptionNotFound result if the redemption is not found', async () => {
    // Arrange
    const logger = createTestLogger();
    const RedemptionsEventsRepository = {
      publishMemberRetrievedRedemptionDetailsEvent: jest.fn(),
      publishMemberRedeemIntentEvent: jest.fn(),
      publishRedemptionEvent: jest.fn(),
    } satisfies RedemptionsEventsRepository;
    const redemptionsRepository = {
      findOneByOfferId: jest.fn(),
      updateManyByOfferId: jest.fn(),
      updateOneByOfferId: jest.fn(),
      createRedemption: jest.fn(),
      withTransaction: jest.fn(),
    } satisfies IRedemptionsRepository;
    const service = new RedemptionDetailsService(logger, RedemptionsEventsRepository, redemptionsRepository);
    redemptionsRepository.findOneByOfferId.mockResolvedValue(null);
    const offerId = faker.number.int({
      min: 1,
      max: 1_000_000,
    });
    const memberId = faker.string.numeric(8);

    // Act
    const result = await service.getRedemptionDetails(offerId, memberId, defaultClientType);

    // Assert
    expect(result).toEqual({
      kind: 'RedemptionNotFound',
    });
  });

  it('should return an Ok result when the redemption is found', async () => {
    // Arrange
    const logger = createTestLogger();
    const RedemptionsEventsRepository = {
      publishMemberRetrievedRedemptionDetailsEvent: jest.fn(),
      publishMemberRedeemIntentEvent: jest.fn(),
      publishRedemptionEvent: jest.fn(),
    } satisfies RedemptionsEventsRepository;
    const redemptionsRepository = {
      findOneByOfferId: jest.fn(),
      updateManyByOfferId: jest.fn(),
      updateOneByOfferId: jest.fn(),
      createRedemption: jest.fn(),
      withTransaction: jest.fn(),
    } satisfies IRedemptionsRepository;
    const service = new RedemptionDetailsService(logger, RedemptionsEventsRepository, redemptionsRepository);
    const redemption = redemptionFactory.build();
    redemptionsRepository.findOneByOfferId.mockResolvedValue(redemption);
    RedemptionsEventsRepository.publishMemberRetrievedRedemptionDetailsEvent.mockResolvedValue(undefined);
    const offerId = faker.number.int({
      min: 1,
      max: 1_000_000,
    });
    const memberId = faker.string.numeric(8);

    // Act
    const result = await service.getRedemptionDetails(offerId, memberId, defaultClientType);

    // Assert
    expect(result).toEqual({
      kind: 'Ok',
      data: {
        redemptionType: redemption.redemptionType,
      },
    });
  });

  it('should send data for DWH to event bus', async () => {
    // Arrange
    const logger = createTestLogger();
    const RedemptionsEventsRepository = {
      publishMemberRetrievedRedemptionDetailsEvent: jest.fn(),
      publishMemberRedeemIntentEvent: jest.fn(),
      publishRedemptionEvent: jest.fn(),
    } satisfies RedemptionsEventsRepository;
    const redemptionsRepository = {
      findOneByOfferId: jest.fn(),
      updateManyByOfferId: jest.fn(),
      updateOneByOfferId: jest.fn(),
      createRedemption: jest.fn(),
      withTransaction: jest.fn(),
    } satisfies IRedemptionsRepository;
    const service = new RedemptionDetailsService(logger, RedemptionsEventsRepository, redemptionsRepository);
    const redemption = redemptionFactory.build();
    redemptionsRepository.findOneByOfferId.mockResolvedValue(redemption);
    RedemptionsEventsRepository.publishMemberRetrievedRedemptionDetailsEvent.mockResolvedValue(undefined);
    const offerId = faker.number.int({
      min: 1,
      max: 1_000_000,
    });
    const memberId = faker.string.numeric(8);

    // Act
    await service.getRedemptionDetails(offerId, memberId, defaultClientType);

    // Assert
    expect(RedemptionsEventsRepository.publishMemberRetrievedRedemptionDetailsEvent).toHaveBeenCalledWith({
      memberDetails: {
        memberId: memberId,
      },
      redemptionDetails: {
        redemptionType: redemption.redemptionType,
        offerId: offerId,
        companyId: redemption.companyId,
        clientType: defaultClientType,
      },
    });
  });

  it('should return successfully if send data for DWH to event bus fails', async () => {
    // Arrange
    const logger = createSilentLogger();
    const RedemptionsEventsRepository = {
      publishMemberRetrievedRedemptionDetailsEvent: jest.fn(),
      publishMemberRedeemIntentEvent: jest.fn(),
      publishRedemptionEvent: jest.fn(),
    } satisfies RedemptionsEventsRepository;
    const redemptionsRepository = {
      findOneByOfferId: jest.fn(),
      updateManyByOfferId: jest.fn(),
      updateOneByOfferId: jest.fn(),
      createRedemption: jest.fn(),
      withTransaction: jest.fn(),
    } satisfies IRedemptionsRepository;
    const service = new RedemptionDetailsService(logger, RedemptionsEventsRepository, redemptionsRepository);
    const redemption = redemptionFactory.build();
    redemptionsRepository.findOneByOfferId.mockResolvedValue(redemption);
    RedemptionsEventsRepository.publishMemberRetrievedRedemptionDetailsEvent.mockRejectedValue(new Error());
    const offerId = faker.number.int({
      min: 1,
      max: 1_000_000,
    });
    const memberId = faker.string.numeric(8);

    // Act
    const result = await service.getRedemptionDetails(offerId, memberId, defaultClientType);

    // Assert
    expect(result).toEqual({
      kind: 'Ok',
      data: {
        redemptionType: redemption.redemptionType,
      },
    });
  });
});
