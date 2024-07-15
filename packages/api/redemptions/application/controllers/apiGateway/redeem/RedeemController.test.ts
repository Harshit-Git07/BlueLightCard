import { APIGatewayProxyEventV2 } from 'aws-lambda';

import {
  generateFakeJWT,
  redeemEventFactory,
  requestFactory,
} from '@blc-mono/redemptions/libs/test/factories/redeemRequest.factory';

import { createTestLogger } from '../../../../libs/test/helpers/logger';
import { IRedeemService, RedeemResult } from '../../../services/redeem/RedeemService';

import { RedeemController } from './RedeemController';

describe('RedeemController', () => {
  beforeEach(() => {
    process.env.API_DEFAULT_ALLOWED_ORIGINS = '["*"]';
    jest.clearAllMocks();
  });

  afterEach(() => {
    delete process.env.API_DEFAULT_ALLOWED_ORIGINS;
  });

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
    const result = await controller.handle(redeemEventFactory.build());

    // Assert
    expect(result.statusCode).toEqual(200);
    expect(result.data).toEqual({
      kind: 'Ok',
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
    const result = await controller.handle(redeemEventFactory.build());

    // Assert
    expect(result.statusCode).toEqual(404);
    expect(result.data).toEqual({
      kind: 'RedemptionNotFound',
      message: 'No redemption found for the given offerId',
    });
  });

  describe('parseRequest - cardStatus validation', () => {
    const logger = createTestLogger();
    const redeemService = {
      redeem: jest.fn(),
    } satisfies IRedeemService;

    const controller = new RedeemController(logger, redeemService);
    const allowedStatuses = ['PHYSICAL_CARD', 'ADDED_TO_BATCH', 'USER_BATCHED'];

    it.each(allowedStatuses)('should succeed for allowed card status %s', async (status) => {
      redeemService.redeem.mockResolvedValue({
        kind: 'Ok',
        redemptionType: 'generic',
        redemptionDetails: {
          url: 'https://www.blcshine.com',
          code: '012345',
        },
      } satisfies RedeemResult);

      const request = requestFactory.build({
        headers: {
          Authorization: generateFakeJWT(status),
        },
      });
      const results = await controller.invoke(request as unknown as APIGatewayProxyEventV2);
      expect(results.statusCode).toBe(200);
    });

    it('should return error for ineligible card status', async () => {
      const ineligibleStatus = 'INVALID_STATUS';
      const request = requestFactory.build({
        headers: {
          Authorization: generateFakeJWT(ineligibleStatus),
        },
      });
      const controller = new RedeemController(logger, redeemService);

      const results = await controller.invoke(request as unknown as APIGatewayProxyEventV2);
      expect(results.statusCode).toBe(400);
    });

    it('should return error for missing card status', async () => {
      const request = requestFactory.build({
        headers: {
          Authorization: generateFakeJWT(undefined),
        },
      });

      const controller = new RedeemController(logger, redeemService);
      const results = await controller.invoke(request as unknown as APIGatewayProxyEventV2);
      expect(results.statusCode).toBe(400);
    });
  });
});
