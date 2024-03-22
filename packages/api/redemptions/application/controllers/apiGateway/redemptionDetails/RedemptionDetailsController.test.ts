import { faker } from '@faker-js/faker';

import {
  IRedemptionDetailsService,
  RedemptionDetailsResult,
} from '@blc-mono/redemptions/application/services/redemptionDetails/RedemptionDetailsService';

import { createTestLogger } from '../../../test/helpers/logger';

import { RedemptionDetailsController } from './RedemptionDetailsController';

describe('RedemptionDetailsController', () => {
  it('Maps Ok result correctly to response', async () => {
    // Arrange
    const logger = createTestLogger();
    const redemptionDetailsService = {
      getRedemptionDetails: jest.fn(),
    } satisfies IRedemptionDetailsService;
    const controller = new RedemptionDetailsController(logger, redemptionDetailsService);
    redemptionDetailsService.getRedemptionDetails.mockResolvedValue({
      kind: 'Ok',
      data: {
        redemptionType: 'generic',
      },
    } satisfies RedemptionDetailsResult);

    // Act
    const result = await controller.handle({
      queryStringParameters: {
        offerId: faker.number.int({
          min: 1,
          max: 1_000_000,
        }),
      },
    });

    // Assert
    expect(result.statusCode).toEqual(200);
    expect(result.data).toEqual({
      redemptionType: 'generic',
    });
  });

  it('Maps RedemptionNotFound response correctly', async () => {
    // Arrange
    const logger = createTestLogger();
    const redemptionDetailsService = {
      getRedemptionDetails: jest.fn(),
    } satisfies IRedemptionDetailsService;
    const controller = new RedemptionDetailsController(logger, redemptionDetailsService);
    redemptionDetailsService.getRedemptionDetails.mockResolvedValue({
      kind: 'RedemptionNotFound',
    } satisfies RedemptionDetailsResult);

    // Act
    const result = await controller.handle({
      queryStringParameters: {
        offerId: faker.number.int({
          min: 1,
          max: 1_000_000,
        }),
      },
    });

    // Assert
    expect(result.statusCode).toEqual(404);
    expect(result.data).toEqual({
      message: 'No redemption found for the given offerId',
    });
  });
});
