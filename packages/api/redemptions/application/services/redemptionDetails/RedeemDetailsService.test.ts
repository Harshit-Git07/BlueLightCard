import { faker } from '@faker-js/faker';

import { ClientType } from '@blc-mono/core/schemas/domain';
import { as } from '@blc-mono/core/utils/testing';
import { createSilentLogger, createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { redemptionConfigEntityFactory } from '../../../libs/test/factories/redemptionConfigEntity.factory';
import { IRedemptionConfigRepository } from '../../repositories/RedemptionConfigRepository';
import { IRedemptionsEventsRepository } from '../../repositories/RedemptionsEventsRepository';

import { RedemptionDetailsService } from './RedemptionDetailsService';

describe('RedemptionDetailsService', () => {
  const defaultClientType: ClientType = faker.helpers.arrayElement(['web', 'mobile']);
  const defaultOfferId = faker.string.sample(10);
  const defaultMemberId = faker.string.numeric(8);

  function mockRedemptionsEventsRepository(): IRedemptionsEventsRepository {
    return {
      publishMemberRetrievedRedemptionDetailsEvent: jest.fn(),
      publishMemberRedeemIntentEvent: jest.fn(),
      publishRedemptionEvent: jest.fn(),
      publishVaultBatchCreatedEvent: jest.fn(),
    };
  }

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

  it('should return a RedemptionNotFound result if the redemption is not found', async () => {
    // Arrange
    const logger = createTestLogger();
    const mockedRedemptionsEventsRepository = mockRedemptionsEventsRepository();
    const mockedRedemptionsRepository = mockRedemptionConfigRepository();
    mockedRedemptionsRepository.findOneByOfferId = jest.fn().mockResolvedValue(null);
    const service = new RedemptionDetailsService(
      logger,
      mockedRedemptionsEventsRepository,
      as(mockedRedemptionsRepository),
    );

    // Act
    const result = await service.getRedemptionDetails(defaultOfferId, defaultMemberId, defaultClientType);

    // Assert
    expect(result).toEqual({
      kind: 'RedemptionNotFound',
    });
  });

  it('should return an Ok result when the redemption is found', async () => {
    // Arrange
    const logger = createTestLogger();
    const redemption = redemptionConfigEntityFactory.build();
    const mockedRedemptionsEventsRepository = mockRedemptionsEventsRepository();
    mockedRedemptionsEventsRepository.publishMemberRetrievedRedemptionDetailsEvent = jest
      .fn()
      .mockResolvedValue(undefined);
    const mockedRedemptionsRepository = mockRedemptionConfigRepository();
    mockedRedemptionsRepository.findOneByOfferId = jest.fn().mockResolvedValue(redemption);
    const service = new RedemptionDetailsService(
      logger,
      mockedRedemptionsEventsRepository,
      as(mockedRedemptionsRepository),
    );

    // Act
    const result = await service.getRedemptionDetails(defaultOfferId, defaultMemberId, defaultClientType);

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
    const redemption = redemptionConfigEntityFactory.build();
    const mockedRedemptionsEventsRepository = mockRedemptionsEventsRepository();
    mockedRedemptionsEventsRepository.publishMemberRetrievedRedemptionDetailsEvent = jest
      .fn()
      .mockResolvedValue(undefined);
    const mockedRedemptionsRepository = mockRedemptionConfigRepository();
    mockedRedemptionsRepository.findOneByOfferId = jest.fn().mockResolvedValue(redemption);
    const service = new RedemptionDetailsService(
      logger,
      mockedRedemptionsEventsRepository,
      as(mockedRedemptionsRepository),
    );

    // Act
    await service.getRedemptionDetails(defaultOfferId, defaultMemberId, defaultClientType);

    // Assert
    expect(mockedRedemptionsEventsRepository.publishMemberRetrievedRedemptionDetailsEvent).toHaveBeenCalledWith({
      memberDetails: {
        memberId: defaultMemberId,
      },
      redemptionDetails: {
        redemptionType: redemption.redemptionType,
        offerId: defaultOfferId,
        companyId: redemption.companyId,
        clientType: defaultClientType,
      },
    });
  });

  it('should return successfully if send data for DWH to event bus fails', async () => {
    // Arrange
    const logger = createSilentLogger();
    const redemption = redemptionConfigEntityFactory.build();
    const mockedRedemptionsEventsRepository = mockRedemptionsEventsRepository();
    mockedRedemptionsEventsRepository.publishMemberRetrievedRedemptionDetailsEvent = jest
      .fn()
      .mockRejectedValue(new Error());
    const mockedRedemptionsRepository = mockRedemptionConfigRepository();
    mockedRedemptionsRepository.findOneByOfferId = jest.fn().mockResolvedValue(redemption);
    const service = new RedemptionDetailsService(
      logger,
      mockedRedemptionsEventsRepository,
      as(mockedRedemptionsRepository),
    );

    // Act
    const result = await service.getRedemptionDetails(defaultOfferId, defaultMemberId, defaultClientType);

    // Assert
    expect(result).toEqual({
      kind: 'Ok',
      data: {
        redemptionType: redemption.redemptionType,
      },
    });
  });
});
