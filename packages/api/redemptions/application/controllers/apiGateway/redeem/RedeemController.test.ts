import { faker } from '@faker-js/faker';

import { IRedeemService, RedeemResult } from '../../../services/redeem/RedeemService';
import { createTestLogger } from '../../../test/helpers/logger';

import { RedeemController } from './RedeemController';

describe('RedeemController', () => {
  it('Maps Ok result correctly to response', async () => {
    // Arrange
    const logger = createTestLogger();
    const redeemService = {
      redeem: jest.fn(),
    } satisfies IRedeemService;
    const controller = new RedeemController(logger, redeemService);
    redeemService.redeem.mockResolvedValue({
      kind: 'Ok',
      redemptionType: 'generic',
      redemptionDetails: {
        url: 'https://www.blcshine.com',
        code: '012345',
      },
    } satisfies RedeemResult);

    // Act
    const result = await controller.handle({
      body: {
        offerId: faker.number.int({
          min: 1,
          max: 1_000_000,
        }),
      },
      headers: {
        Authorization: 'Bearer token',
      },
      memberId: faker.string.sample(5),
    });

    // Assert
    expect(result.statusCode).toEqual(200);
    expect(result.data).toEqual({
      redemptionType: 'generic',
      redemptionDetails: {
        url: 'https://www.blcshine.com',
        code: '012345',
      },
    });
  });

  it('Maps RedemptionNotFound response correctly', async () => {
    // Arrange
    const logger = createTestLogger();
    const redeemService = {
      redeem: jest.fn(),
    } satisfies IRedeemService;
    const controller = new RedeemController(logger, redeemService);
    redeemService.redeem.mockResolvedValue({
      kind: 'RedemptionNotFound',
    } satisfies RedeemResult);

    // Act
    const result = await controller.handle({
      body: {
        offerId: faker.number.int({
          min: 1,
          max: 1_000_000,
        }),
      },
      headers: {
        Authorization: 'Bearer token',
      },
      memberId: faker.string.sample(5),
    });

    // Assert
    expect(result.statusCode).toEqual(404);
    expect(result.data).toEqual({
      message: 'No redemption found for the given offerId',
    });
  });
});
