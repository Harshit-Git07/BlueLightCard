import { APIGatewayProxyEventV2 } from 'aws-lambda';

import { ICardStatusHelper } from '@blc-mono/redemptions/application/helpers/cardStatus';
import { MaxPerUserReachedError } from '@blc-mono/redemptions/application/services/redeem/strategies/redeemVaultStrategy/helpers/MaxPerUserReachedError';
import { NoCodesAvailableError } from '@blc-mono/redemptions/application/services/redeem/strategies/redeemVaultStrategy/helpers/NoCodesAvailableError';
import { NotFoundError } from '@blc-mono/redemptions/application/services/redeem/strategies/redeemVaultStrategy/helpers/NotFoundError';
import {
  generateFakeJWT,
  redeemEventFactory,
  requestFactory,
} from '@blc-mono/redemptions/libs/test/factories/redeemRequest.factory';

import { createSilentLogger, createTestLogger } from '../../../../libs/test/helpers/logger';
import { IRedeemService, RedeemResult } from '../../../services/redeem/RedeemService';

import { ParsedRequest, RedeemController } from './RedeemController';

type parsedResults = {
  data: {
    kind: string;
  };
};

jest.mock('@blc-mono/redemptions/application/helpers/cardStatus');

describe('RedeemController', () => {
  beforeEach(() => {
    process.env.API_DEFAULT_ALLOWED_ORIGINS = '["*"]';
    process.env.USER_IDENTITY_ENDPOINT = 'https://test-endpoint';
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

    const cardStatusHelper = {
      validateCardStatus: jest.fn(),
    } satisfies ICardStatusHelper;

    const controller = new RedeemController(logger, redeemService, cardStatusHelper);
    redeemService.redeem.mockResolvedValue({
      kind: 'Ok',
      redemptionType: 'generic',
      redemptionDetails: {
        url: 'https://www.blcshine.com',
        code: '012345',
      },
    } satisfies RedeemResult);

    // Act
    const redeemEvent = redeemEventFactory.build() as ParsedRequest;
    const result = await controller.handle(redeemEvent);

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

  describe('Error handling', () => {
    it.each(['GenericNotFound', 'RedemptionNotFound', 'VaultNotFound'])(
      'returns a 404 status code for %s errors',
      async (kind) => {
        // Arrange
        const logger = createTestLogger();
        const redeemService = {
          redeem: jest.fn(),
        } satisfies IRedeemService;

        const cardStatusHelper = {
          validateCardStatus: jest.fn(),
        } satisfies ICardStatusHelper;

        const controller = new RedeemController(logger, redeemService, cardStatusHelper);
        redeemService.redeem.mockRejectedValue(new NotFoundError('Not found', kind));

        // Act
        const result = await controller.handle(redeemEventFactory.build() as ParsedRequest);

        // Assert
        expect(result.statusCode).toEqual(404);
        expect(result.data).toEqual({ kind, message: 'Not found' });
      },
    );

    it('returns a 403 status code for MaxPerUserReachedError errors', async () => {
      // Arrange
      const logger = createTestLogger();
      const redeemService = {
        redeem: jest.fn(),
      } satisfies IRedeemService;

      const cardStatusHelper = {
        validateCardStatus: jest.fn(),
      } satisfies ICardStatusHelper;

      const controller = new RedeemController(logger, redeemService, cardStatusHelper);
      redeemService.redeem.mockRejectedValue(new MaxPerUserReachedError('Max per user reached'));

      // Act
      const result = await controller.handle(redeemEventFactory.build() as ParsedRequest);

      // Assert
      expect(result.statusCode).toEqual(403);
      expect(result.data).toEqual({ kind: 'MaxPerUserReachedError', message: 'Max per user reached' });
    });

    it('returns a 403 status code for NoCodesAvailableError errors', async () => {
      // Arrange
      const logger = createTestLogger();
      const redeemService = {
        redeem: jest.fn(),
      } satisfies IRedeemService;

      const cardStatusHelper = {
        validateCardStatus: jest.fn(),
      } satisfies ICardStatusHelper;

      const controller = new RedeemController(logger, redeemService, cardStatusHelper);
      redeemService.redeem.mockRejectedValue(new NoCodesAvailableError('No codes available'));

      // Act
      const result = await controller.handle(redeemEventFactory.build() as ParsedRequest);

      // Assert
      expect(result.statusCode).toEqual(403);
      expect(result.data).toEqual({ kind: 'NoCodesAvailableError', message: 'No codes available' });
    });
  });

  describe('parseRequest - cardStatus validation', () => {
    const logger = createTestLogger();
    const redeemService = {
      redeem: jest.fn(),
    } satisfies IRedeemService;

    it('should allow card redeem when canRedeemOffer is true', async () => {
      const request = requestFactory.build({
        headers: {
          Authorization: generateFakeJWT(),
        },
      });

      redeemService.redeem.mockResolvedValue({
        kind: 'Ok',
        redemptionType: 'generic',
        redemptionDetails: {
          url: 'https://www.blcshine.com',
          code: '012345',
        },
      } satisfies RedeemResult);

      const cardStatusHelper = {
        validateCardStatus: jest.fn().mockResolvedValue(true),
      } satisfies ICardStatusHelper;

      const controller = new RedeemController(logger, redeemService, cardStatusHelper);

      const results = await controller.invoke(request as unknown as APIGatewayProxyEventV2);
      const body = results.body ?? '{}';
      const parsedResults = JSON.parse(body) as parsedResults;
      const kind = parsedResults.data.kind;
      expect(results.statusCode).toEqual(200);
      expect(kind).toBe('Ok');
    });

    it('should return error when canRedeemOffer is false', async () => {
      const logger = createSilentLogger();

      const request = requestFactory.build({
        headers: {
          Authorization: generateFakeJWT(),
        },
      });
      redeemService.redeem.mockResolvedValue({
        kind: 'Ok',
        redemptionType: 'generic',
        redemptionDetails: {
          url: 'https://www.blcshine.com',
          code: '012345',
        },
      } satisfies RedeemResult);

      const cardStatusHelper = {
        validateCardStatus: jest.fn().mockResolvedValue(false),
      } satisfies ICardStatusHelper;

      const controller = new RedeemController(logger, redeemService, cardStatusHelper);

      const results = await controller.invoke(request as unknown as APIGatewayProxyEventV2);
      const body = results.body ?? '{}';
      const parsedResults = JSON.parse(body) as parsedResults;
      const kind = parsedResults.data.kind;

      expect(kind).toBe('RequestValidationCardStatus');
      expect(results.statusCode).toBe(403);

      expect(logger.error).toHaveBeenCalledTimes(1);
      expect(logger.error).toHaveBeenCalledWith(
        expect.objectContaining({
          context: expect.objectContaining({
            error: expect.objectContaining({ kind: 'RequestValidationCardStatus' }),
          }),
        }),
      );
    });
  });
});
