import { faker } from '@faker-js/faker';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

import { ILogger } from '@blc-mono/core/utils/logger/logger';
import { ICreateRedemptionConfigService } from '@blc-mono/redemptions/application/services/redemptionConfig/CreateRedemptionConfigService';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { CreateRedemptionConfigController } from './CreateRedemptionConfigController';

const MockCreateRedemptionConfigService = {
  createRedemptionConfig: jest.fn(),
} satisfies ICreateRedemptionConfigService;

const validRequestBody = {
  companyId: '1234',
  offerId: '4321',
  connection: 'none',
  offerType: 'in-store',
  redemptionType: 'preApplied',
  affiliate: 'awin',
  url: 'some-url',
} as const;

const validRequestBodyForGiftCard = {
  companyId: '1234',
  offerId: '4321',
  connection: 'none',
  offerType: 'in-store',
  redemptionType: 'giftCard',
  affiliate: 'awin',
  url: faker.internet.url(),
} as const;

describe('CreateRedemptionConfigController', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('validates request body', () => {
    let mockLogger: ILogger;
    let controller: CreateRedemptionConfigController;

    beforeEach(() => {
      mockLogger = createTestLogger();
      controller = new CreateRedemptionConfigController(mockLogger, MockCreateRedemptionConfigService);
    });

    beforeAll(() => {
      process.env[RedemptionsStackEnvironmentKeys.ADMIN_API_DEFAULT_ALLOWED_ORIGINS] = '["*"]';
    });

    afterAll(() => {
      delete process.env[RedemptionsStackEnvironmentKeys.ADMIN_API_DEFAULT_ALLOWED_ORIGINS];
    });

    it('returns 200 when request body is valid creditCard redemptionType', async () => {
      MockCreateRedemptionConfigService.createRedemptionConfig.mockResolvedValue({
        kind: 'Ok',
        data: { some: 'data' },
      });

      const requestBody = {
        affiliate: 'awin',
        companyId: 'UUID',
        connection: 'affiliate',
        offerId: 'UUID',
        redemptionType: 'creditCard',
        url: 'https://www.awin1.com',
      };

      const request: APIGatewayProxyEventV2 = {
        body: JSON.stringify(requestBody),
        requestContext: {
          requestId: 'requestId',
        },
        headers: {},
      } as unknown as APIGatewayProxyEventV2;

      const result = await controller.invoke(request);

      expect(result.statusCode).toEqual(200);
    });

    it('returns 200 when request body is valid giftCard redemptionType', async () => {
      MockCreateRedemptionConfigService.createRedemptionConfig.mockResolvedValue({
        kind: 'Ok',
        data: { some: 'data' },
      });

      const requestBody = {
        affiliate: 'awin',
        companyId: 'UUID',
        connection: 'affiliate',
        offerId: 'UUID',
        redemptionType: 'giftCard',
        url: 'https://www.awin1.com',
      };

      const request: APIGatewayProxyEventV2 = {
        body: JSON.stringify(requestBody),
        requestContext: {
          requestId: 'requestId',
        },
        headers: {},
      } as unknown as APIGatewayProxyEventV2;

      const result = await controller.invoke(request);

      expect(result.statusCode).toEqual(200);
    });

    it('returns 200 when request body is valid preApplied redemptionType', async () => {
      MockCreateRedemptionConfigService.createRedemptionConfig.mockResolvedValue({
        kind: 'Ok',
        data: { some: 'data' },
      });

      const requestBody = {
        affiliate: 'awin',
        companyId: 'UUID',
        connection: 'affiliate',
        offerId: 'UUID',
        redemptionType: 'preApplied',
        url: 'https://www.awin1.com',
      };

      const request: APIGatewayProxyEventV2 = {
        body: JSON.stringify(requestBody),
        requestContext: {
          requestId: 'requestId',
        },
        headers: {},
      } as unknown as APIGatewayProxyEventV2;

      const result = await controller.invoke(request);

      expect(result.statusCode).toEqual(200);
    });

    it('returns 200 when request body is valid generic redemptionType', async () => {
      MockCreateRedemptionConfigService.createRedemptionConfig.mockResolvedValue({
        kind: 'Ok',
        data: { some: 'data' },
      });

      const requestBody = {
        affiliate: 'awin',
        companyId: 'UUID',
        connection: 'affiliate',
        offerId: 'UUID',
        redemptionType: 'generic',
        url: 'https://www.awin1.com',
        generic: {
          code: 'BLC10OFF',
        },
      };

      const request: APIGatewayProxyEventV2 = {
        body: JSON.stringify(requestBody),
        requestContext: {
          requestId: 'requestId',
        },
        headers: {},
      } as unknown as APIGatewayProxyEventV2;

      const result = await controller.invoke(request);

      expect(result.statusCode).toEqual(200);
    });

    it('returns 200 when request body is valid vaultQR redemptionType', async () => {
      MockCreateRedemptionConfigService.createRedemptionConfig.mockResolvedValue({
        kind: 'Ok',
        data: { some: 'data' },
      });

      const requestBody = {
        affiliate: 'awin',
        companyId: 'UUID',
        connection: 'affiliate',
        offerId: 'UUID',
        redemptionType: 'vaultQR',
        vault: {
          alertBelow: 1000,
          status: 'active',
          maxPerUser: 5,
          integrationId: 'UUID',
          email: 'ferenc@blc.co.uk',
          integration: 'eagleeye',
        },
      };

      const request: APIGatewayProxyEventV2 = {
        body: JSON.stringify(requestBody),
        requestContext: {
          requestId: 'requestId',
        },
        headers: {},
      } as unknown as APIGatewayProxyEventV2;

      const result = await controller.invoke(request);

      expect(result.statusCode).toEqual(200);
    });

    it('returns 200 when request body is valid vault redemptionType', async () => {
      MockCreateRedemptionConfigService.createRedemptionConfig.mockResolvedValue({
        kind: 'Ok',
        data: { some: 'data' },
      });

      const requestBody = {
        affiliate: 'awin',
        companyId: 'UUID',
        connection: 'affiliate',
        offerId: 'UUID',
        redemptionType: 'vault',
        url: 'https://www.awin1.com',
        vault: {
          alertBelow: 1000,
          status: 'active',
          maxPerUser: 5,
          integrationId: 'UUID',
          email: 'ferenc@blc.co.uk',
          integration: 'eagleeye',
        },
      };

      const request: APIGatewayProxyEventV2 = {
        body: JSON.stringify(requestBody),
        requestContext: {
          requestId: 'requestId',
        },
        headers: {},
      } as unknown as APIGatewayProxyEventV2;

      const result = await controller.invoke(request);

      expect(result.statusCode).toEqual(200);
    });

    it('returns 200 when request body is valid showCard redemptionType', async () => {
      MockCreateRedemptionConfigService.createRedemptionConfig.mockResolvedValue({
        kind: 'Ok',
        data: { some: 'data' },
      });

      const requestBody = {
        affiliate: 'awin',
        companyId: 'UUID',
        connection: 'affiliate',
        offerId: 'UUID',
        redemptionType: 'showCard',
      };

      const request: APIGatewayProxyEventV2 = {
        body: JSON.stringify(requestBody),
        requestContext: {
          requestId: 'requestId',
        },
        headers: {},
      } as unknown as APIGatewayProxyEventV2;

      const result = await controller.invoke(request);

      expect(result.statusCode).toEqual(200);
    });

    it.each([
      ['vault', 'eagleEye', ''],
      ['vault', 'eagleEye', 0],
      ['vault', 'uniqodo', ''],
      ['vault', 'uniqodo', 0],
      ['vaultQR', 'eagleEye', ''],
      ['vaultQR', 'eagleEye', 0],
      ['vaultQR', 'uniqodo', ''],
      ['vaultQR', 'uniqodo', 0],
    ] as const)(
      'returns 400 when request body has redemptionType value [%s], integration value [%s] and integrationId [%s]',
      async (redemptionType: string, integration: string, integrationId) => {
        const requestBody = {
          affiliate: 'awin',
          companyId: '12',
          connection: 'invalid',
          offerId: 1,
          redemptionType: redemptionType,
          url: 'https://www.awin1.com',
          vault: {
            alertBelow: 1000,
            status: 'active',
            maxPerUser: 5,
            integrationId: integrationId,
            email: 'ferenc@blc.co.uk',
            integration: integration,
          },
        };

        const request: APIGatewayProxyEventV2 = {
          body: JSON.stringify(requestBody),
          requestContext: {
            requestId: 'requestId',
          },
          headers: {},
        } as unknown as APIGatewayProxyEventV2;

        mockLogger.error = jest.fn();

        const result = await controller.invoke(request);

        expect(result.statusCode).toEqual(400);
      },
    );

    it('returns 400 when request body has offerId has invalid connection', async () => {
      const requestBody = {
        affiliate: 'awin',
        companyId: '12',
        connection: 'invalid',
        offerId: 1,
        redemptionType: 'vault',
        url: 'https://www.awin1.com',
        vault: {
          alertBelow: 1000,
          status: 'active',
          maxPerUser: 5,
          integrationId: '75645',
          email: 'ferenc@blc.co.uk',
          integration: 'eagleeye',
        },
      };

      const request: APIGatewayProxyEventV2 = {
        body: JSON.stringify(requestBody),
        requestContext: {
          requestId: 'requestId',
        },
        headers: {},
      } as unknown as APIGatewayProxyEventV2;

      mockLogger.error = jest.fn();

      const result = await controller.invoke(request);

      expect(result.statusCode).toEqual(400);
    });

    it.each(['', 0])('returns 400 when request body has offerId has value of [%s]', async (companyId) => {
      const requestBody = {
        affiliate: 'awin',
        companyId: companyId,
        connection: 'affiliate',
        offerId: 1,
        redemptionType: 'vault',
        url: 'https://www.awin1.com',
        vault: {
          alertBelow: 1000,
          status: 'active',
          maxPerUser: 5,
          integrationId: '75645',
          email: 'ferenc@blc.co.uk',
          integration: 'eagleeye',
        },
      };

      const request: APIGatewayProxyEventV2 = {
        body: JSON.stringify(requestBody),
        requestContext: {
          requestId: 'requestId',
        },
        headers: {},
      } as unknown as APIGatewayProxyEventV2;

      mockLogger.error = jest.fn();

      const result = await controller.invoke(request);

      expect(result.statusCode).toEqual(400);
    });

    it.each(['', 0])('returns 400 when request body has companyId has value of [%s]', async (companyId) => {
      const requestBody = {
        affiliate: 'awin',
        companyId: companyId,
        connection: 'affiliate',
        offerId: 1,
        redemptionType: 'vault',
        url: 'https://www.awin1.com',
        vault: {
          alertBelow: 1000,
          status: 'active',
          maxPerUser: 5,
          integrationId: '75645',
          email: 'ferenc@blc.co.uk',
          integration: 'eagleeye',
        },
      };

      const request: APIGatewayProxyEventV2 = {
        body: JSON.stringify(requestBody),
        requestContext: {
          requestId: 'requestId',
        },
        headers: {},
      } as unknown as APIGatewayProxyEventV2;

      mockLogger.error = jest.fn();

      const result = await controller.invoke(request);

      expect(result.statusCode).toEqual(400);
    });
  });

  it('returns 200 for a successful request', async () => {
    const logger = createTestLogger();

    MockCreateRedemptionConfigService.createRedemptionConfig.mockResolvedValue({
      kind: 'Ok',
      data: { some: 'data' },
    });

    const controller = new CreateRedemptionConfigController(logger, MockCreateRedemptionConfigService);
    const result = await controller.handle({ body: validRequestBody });

    expect(result.statusCode).toEqual(200);
    expect(result.data).toStrictEqual({ some: 'data' });
    expect(MockCreateRedemptionConfigService.createRedemptionConfig).toHaveBeenCalledWith(validRequestBody);
  });

  it('returns 200 for a successful gift card request', async () => {
    const logger = createTestLogger();

    MockCreateRedemptionConfigService.createRedemptionConfig.mockResolvedValue({
      kind: 'Ok',
      data: { some: 'data' },
    });

    const controller = new CreateRedemptionConfigController(logger, MockCreateRedemptionConfigService);
    const result = await controller.handle({ body: validRequestBodyForGiftCard });

    expect(result.statusCode).toEqual(200);
    expect(result.data).toStrictEqual({ some: 'data' });
    expect(MockCreateRedemptionConfigService.createRedemptionConfig).toHaveBeenCalledWith(validRequestBodyForGiftCard);
  });

  it('returns 500 for an error request', async () => {
    const logger = createTestLogger();

    MockCreateRedemptionConfigService.createRedemptionConfig.mockRejectedValue(new Error('some error'));

    const controller = new CreateRedemptionConfigController(logger, MockCreateRedemptionConfigService);
    const result = await controller.handle({
      body: validRequestBody,
    });

    expect(result.statusCode).toEqual(500);
    expect(result.data).toStrictEqual({ message: 'some error' });
  });

  it('throws an error if an invalid Kind is returned from the service', async () => {
    const logger = createTestLogger();

    MockCreateRedemptionConfigService.createRedemptionConfig.mockRejectedValue({
      kind: 'Asparagus',
      data: { type: 'yummy green vegetable' },
    });

    const controller = new CreateRedemptionConfigController(logger, MockCreateRedemptionConfigService);
    await expect(
      controller.handle({
        body: validRequestBody,
      }),
    ).rejects.toThrow();
  });
});
