import { faker } from '@faker-js/faker';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

import { ILogger } from '@blc-mono/core/utils/logger/logger';
import {
  IUpdateRedemptionConfigService,
  UpdateRedemptionConfigError,
  UpdateRedemptionConfigSuccess,
} from '@blc-mono/redemptions/application/services/redemptionConfig/UpdateRedemptionConfigService';
import { RedemptionConfig } from '@blc-mono/redemptions/application/transformers/RedemptionConfigTransformer';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import {
  PatchRedemptionConfigGenericModel,
  PatchRedemptionConfigModel,
  PatchRedemptionConfigPreAppliedModel,
  PatchRedemptionConfigShowCardModel,
  PatchRedemptionConfigVaultModel,
} from '@blc-mono/redemptions/libs/models/patchRedemptionConfig';

import { createTestLogger } from '../../../../libs/test/helpers/logger';

import { ParsedRequest, UpdateRedemptionConfigController } from './UpdateRedemptionConfigController';
describe('UpdateRedemptionConfigController', () => {
  const testGenericBody = {
    id: `rdm-${faker.string.uuid()}`,
    offerId: faker.string.uuid(),
    redemptionType: 'generic',
    connection: 'affiliate',
    companyId: faker.string.uuid(),
    affiliate: 'awin',
    url: 'https://www.awin1.com/',
    generic: {
      id: `gnr-${faker.string.uuid()}`,
      code: 'DISCOUNT_CODE_01',
    },
  } satisfies PatchRedemptionConfigGenericModel;

  const testGenericRedemptionConfig: RedemptionConfig = {
    ...testGenericBody,
    offerId: testGenericBody.offerId,
    companyId: testGenericBody.companyId,
  };

  const testPreAppliedBody = {
    id: `rdm-${faker.string.uuid()}`,
    offerId: faker.string.uuid(),
    redemptionType: 'preApplied',
    connection: 'direct',
    companyId: faker.string.uuid(),
    affiliate: null,
    url: 'https://www.whatever.com/',
  } satisfies PatchRedemptionConfigPreAppliedModel;

  const testPreAppliedRedemptionConfig: RedemptionConfig = {
    ...testPreAppliedBody,
    offerId: testGenericBody.offerId,
    companyId: testGenericBody.companyId,
  };

  const testShowCardBody = {
    id: `rdm-${faker.string.uuid()}`,
    offerId: faker.string.uuid(),
    redemptionType: 'showCard',
    connection: 'none',
    companyId: faker.string.uuid(),
    affiliate: null,
  } satisfies PatchRedemptionConfigShowCardModel;

  const testShowCardRedemptionConfig: RedemptionConfig = {
    ...testShowCardBody,
    offerId: testGenericBody.offerId,
    companyId: testGenericBody.companyId,
  };

  function getParsedRequest(offerId: string, body: PatchRedemptionConfigModel): ParsedRequest {
    return {
      pathParameters: {
        offerId: offerId,
      },
      body: body,
    };
  }

  const testVaultBody = {
    id: `rdm-${faker.string.uuid()}`,
    offerId: faker.string.uuid(),
    redemptionType: 'vault',
    connection: 'affiliate',
    companyId: faker.string.uuid(),
    affiliate: 'awin',
    url: 'https://www.awin1.com/',
    vault: {
      id: `vlt-${faker.string.uuid()}`,
      maxPerUser: faker.number.int({ max: 100 }),
      status: 'active',
      email: faker.internet.email(),
      integration: 'uniqodo',
      integrationId: faker.string.numeric(8),
      alertBelow: faker.number.int({ max: 100 }),
    },
  } satisfies PatchRedemptionConfigVaultModel;

  const testVaultBodyWithInvalidMaxPerUser = {
    ...testVaultBody,
    vault: {
      ...testVaultBody.vault,
      maxPerUser: 0,
    },
  } satisfies PatchRedemptionConfigVaultModel;

  const testVaultRedemptionConfig: RedemptionConfig = {
    ...testVaultBody,
    offerId: testVaultBody.offerId,
    companyId: testVaultBody.companyId,
    vault: {
      ...testVaultBody.vault,
      createdAt: 'some date',
      batches: [],
    },
  };

  function getTestUpdateRedemptionConfigError(
    kind:
      | 'Error'
      | 'UrlPayloadOfferIdMismatch'
      | 'RedemptionNotFound'
      | 'RedemptionOfferCompanyIdMismatch'
      | 'RedemptionTypeMismatch'
      | 'GenericNotFound'
      | 'GenericCodeEmpty'
      | 'VaultNotFound'
      | 'MaxPerUserError',
  ): UpdateRedemptionConfigError {
    return {
      kind: kind,
      data: {
        message: faker.string.alpha({
          length: 10,
        }),
      },
    };
  }

  function getTestUpdateRedemptionConfigSuccess(data: RedemptionConfig): UpdateRedemptionConfigSuccess {
    return {
      kind: 'Ok',
      data: data,
    };
  }

  const logger = createTestLogger();

  const mockUpdateRedemptionConfigService = {
    updateRedemptionConfig: jest.fn(),
  } satisfies IUpdateRedemptionConfigService;

  /**
   * common tests (payload redemptionType does not matter)
   */
  it('Maps "Error" result correctly to 500 response', async () => {
    mockUpdateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue(
      getTestUpdateRedemptionConfigError('Error'),
    );
    const controller = new UpdateRedemptionConfigController(logger, mockUpdateRedemptionConfigService);
    const actual = await controller.handle(getParsedRequest(testGenericBody.offerId, testGenericBody));
    expect(actual.statusCode).toEqual(500);
  });

  it('Maps "UrlPayloadOfferIdMismatch" result correctly to 404 response', async () => {
    mockUpdateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue(
      getTestUpdateRedemptionConfigError('UrlPayloadOfferIdMismatch'),
    );
    const controller = new UpdateRedemptionConfigController(logger, mockUpdateRedemptionConfigService);
    const actual = await controller.handle(getParsedRequest(testGenericBody.offerId + 1, testGenericBody));
    expect(actual.statusCode).toEqual(404);
  });

  it('Maps "RedemptionNotFound" result correctly to 404 response', async () => {
    mockUpdateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue(
      getTestUpdateRedemptionConfigError('RedemptionNotFound'),
    );
    const controller = new UpdateRedemptionConfigController(logger, mockUpdateRedemptionConfigService);
    const actual = await controller.handle(getParsedRequest(testGenericBody.offerId, testGenericBody));
    expect(actual.statusCode).toEqual(404);
  });

  it('Maps "RedemptionOfferCompanyIdMismatch" result correctly to 404 response', async () => {
    mockUpdateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue(
      getTestUpdateRedemptionConfigError('RedemptionOfferCompanyIdMismatch'),
    );
    const controller = new UpdateRedemptionConfigController(logger, mockUpdateRedemptionConfigService);
    const actual = await controller.handle(getParsedRequest(testGenericBody.offerId, testGenericBody));
    expect(actual.statusCode).toEqual(404);
  });

  it('Maps "RedemptionTypeMismatch" result correctly to 404 response', async () => {
    mockUpdateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue(
      getTestUpdateRedemptionConfigError('RedemptionTypeMismatch'),
    );
    const controller = new UpdateRedemptionConfigController(logger, mockUpdateRedemptionConfigService);
    const actual = await controller.handle(getParsedRequest(testGenericBody.offerId, testGenericBody));
    expect(actual.statusCode).toEqual(404);
  });

  /**
   * generic redemptionType tests
   */
  it('Maps "GenericCodeEmpty" result for generic redemption correctly to 404 response', async () => {
    mockUpdateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue(
      getTestUpdateRedemptionConfigError('GenericCodeEmpty'),
    );
    const controller = new UpdateRedemptionConfigController(logger, mockUpdateRedemptionConfigService);
    const actual = await controller.handle(getParsedRequest(testGenericBody.offerId, testGenericBody));
    expect(actual.statusCode).toEqual(404);
  });

  it('Maps "GenericNotFound" result for generic redemption correctly to 404 response', async () => {
    mockUpdateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue(
      getTestUpdateRedemptionConfigError('GenericNotFound'),
    );
    const controller = new UpdateRedemptionConfigController(logger, mockUpdateRedemptionConfigService);
    const actual = await controller.handle(getParsedRequest(testGenericBody.offerId, testGenericBody));
    expect(actual.statusCode).toEqual(404);
  });

  it('Maps "Ok" result for generic redemption correctly correctly to 200 response', async () => {
    mockUpdateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue(
      getTestUpdateRedemptionConfigSuccess(testGenericRedemptionConfig),
    );
    const controller = new UpdateRedemptionConfigController(logger, mockUpdateRedemptionConfigService);
    const actual = await controller.handle(getParsedRequest(testGenericBody.offerId, testGenericBody));
    expect(actual.statusCode).toEqual(200);
  });

  /**
   * preApplied redemptionType tests
   */
  it('Maps "Ok" result for preApplied redemption correctly correctly to 200 response', async () => {
    mockUpdateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue(
      getTestUpdateRedemptionConfigSuccess(testPreAppliedRedemptionConfig),
    );
    const controller = new UpdateRedemptionConfigController(logger, mockUpdateRedemptionConfigService);
    const actual = await controller.handle(getParsedRequest(testPreAppliedBody.offerId, testPreAppliedBody));
    expect(actual.statusCode).toEqual(200);
  });

  /**
   * showCard redemptionType tests
   */
  it('Maps "Ok" result for showCard redemption correctly correctly to 200 response', async () => {
    mockUpdateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue(
      getTestUpdateRedemptionConfigSuccess(testShowCardRedemptionConfig),
    );
    const controller = new UpdateRedemptionConfigController(logger, mockUpdateRedemptionConfigService);
    const actual = await controller.handle(getParsedRequest(testShowCardBody.offerId, testShowCardBody));
    expect(actual.statusCode).toEqual(200);
  });

  /**
   * vault(qr) redemptionType tests
   */
  it('Maps "VaultNotFound" result for vault redemption correctly to 404 response', async () => {
    mockUpdateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue(
      getTestUpdateRedemptionConfigError('VaultNotFound'),
    );
    const controller = new UpdateRedemptionConfigController(logger, mockUpdateRedemptionConfigService);
    const actual = await controller.handle(getParsedRequest(testVaultBody.offerId, testVaultBody));
    expect(actual.statusCode).toEqual(404);
  });

  it('Maps "MaxPerUserError" result for max per user limit set to less than 1 correctly to 404 response', async () => {
    mockUpdateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue(
      getTestUpdateRedemptionConfigError('MaxPerUserError'),
    );
    const controller = new UpdateRedemptionConfigController(logger, mockUpdateRedemptionConfigService);
    const actual = await controller.handle(getParsedRequest(testVaultBody.offerId, testVaultBodyWithInvalidMaxPerUser));
    expect(actual.statusCode).toEqual(404);
  });

  it('Maps "Ok" result for vault redemption correctly correctly to 200 response', async () => {
    mockUpdateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue(
      getTestUpdateRedemptionConfigSuccess(testVaultRedemptionConfig),
    );
    const controller = new UpdateRedemptionConfigController(logger, mockUpdateRedemptionConfigService);
    const actual = await controller.handle(getParsedRequest(testVaultBody.offerId, testVaultBody));
    expect(actual.statusCode).toEqual(200);
  });

  describe('validates request body', () => {
    let controller: UpdateRedemptionConfigController;
    let mockLogger: ILogger;

    beforeEach(() => {
      mockLogger = createTestLogger();
      controller = new UpdateRedemptionConfigController(mockLogger, mockUpdateRedemptionConfigService);
    });

    beforeAll(() => {
      process.env[RedemptionsStackEnvironmentKeys.ADMIN_API_DEFAULT_ALLOWED_ORIGINS] = '["*"]';
    });

    afterAll(() => {
      delete process.env[RedemptionsStackEnvironmentKeys.ADMIN_API_DEFAULT_ALLOWED_ORIGINS];
    });

    it('returns 200 when request body is valid creditCard redemptionType', async () => {
      mockUpdateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue(
        getTestUpdateRedemptionConfigSuccess(testVaultRedemptionConfig),
      );

      const requestBody = {
        id: 'rdm-uuid',
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
        pathParameters: {
          offerId: 'uuid',
        },
      } as unknown as APIGatewayProxyEventV2;

      const result = await controller.invoke(request);

      expect(result.statusCode).toEqual(200);
    });

    it('returns 200 when request body is valid giftCard redemptionType', async () => {
      mockUpdateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue(
        getTestUpdateRedemptionConfigSuccess(testVaultRedemptionConfig),
      );

      const requestBody = {
        id: 'rdm-uuid',
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
        pathParameters: {
          offerId: 'uuid',
        },
      } as unknown as APIGatewayProxyEventV2;

      const result = await controller.invoke(request);

      expect(result.statusCode).toEqual(200);
    });

    it('returns 200 when request body is valid preApplied redemptionType', async () => {
      mockUpdateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue(
        getTestUpdateRedemptionConfigSuccess(testVaultRedemptionConfig),
      );

      const requestBody = {
        id: 'rdm-uuid',
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
        pathParameters: {
          offerId: 'uuid',
        },
      } as unknown as APIGatewayProxyEventV2;

      const result = await controller.invoke(request);

      expect(result.statusCode).toEqual(200);
    });

    it('returns 200 when request body is valid generic redemptionType', async () => {
      mockUpdateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue(
        getTestUpdateRedemptionConfigSuccess(testVaultRedemptionConfig),
      );

      const requestBody = {
        id: 'rdm-uuid',
        affiliate: 'awin',
        companyId: 'UUID',
        connection: 'affiliate',
        offerId: 'UUID',
        redemptionType: 'generic',
        url: 'https://www.awin1.com',
        generic: {
          id: 'gnr-uuid',
          code: 'BLC10OFF',
        },
      };
      const request: APIGatewayProxyEventV2 = {
        body: JSON.stringify(requestBody),
        requestContext: {
          requestId: 'requestId',
        },
        headers: {},
        pathParameters: {
          offerId: 'uuid',
        },
      } as unknown as APIGatewayProxyEventV2;

      const result = await controller.invoke(request);

      expect(result.statusCode).toEqual(200);
    });

    it('returns 200 when request body is valid vaultQR redemptionType', async () => {
      mockUpdateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue(
        getTestUpdateRedemptionConfigSuccess(testVaultRedemptionConfig),
      );

      const requestBody = {
        id: 'rdm-uuid',
        affiliate: 'awin',
        companyId: 'UUID',
        connection: 'affiliate',
        offerId: 'UUID',
        redemptionType: 'vaultQR',
        vault: {
          id: 'vlt-uuid',
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
        pathParameters: {
          offerId: 'uuid',
        },
      } as unknown as APIGatewayProxyEventV2;

      const result = await controller.invoke(request);

      expect(result.statusCode).toEqual(200);
    });

    it('returns 200 when request body is valid vault redemptionType', async () => {
      mockUpdateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue(
        getTestUpdateRedemptionConfigSuccess(testVaultRedemptionConfig),
      );

      const requestBody = {
        id: 'rdm-uuid',
        affiliate: 'awin',
        companyId: 'UUID',
        connection: 'affiliate',
        offerId: 'UUID',
        redemptionType: 'vault',
        url: 'https://www.awin1.com',
        vault: {
          id: 'vlt-uuid',
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
        pathParameters: {
          offerId: 'uuid',
        },
      } as unknown as APIGatewayProxyEventV2;

      const result = await controller.invoke(request);

      expect(result.statusCode).toEqual(200);
    });

    it('returns 200 when request body is valid showCard redemptionType', async () => {
      mockUpdateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue(
        getTestUpdateRedemptionConfigSuccess(testVaultRedemptionConfig),
      );

      const requestBody = {
        id: 'rdm-uuid',
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
        pathParameters: {
          offerId: 'uuid',
        },
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
          id: 'rdm-uuid',
          affiliate: 'awin',
          companyId: '12',
          connection: 'invalid',
          offerId: 1,
          redemptionType: redemptionType,
          url: 'https://www.awin1.com',
          vault: {
            id: 'vlt-uuid',
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
        id: 'rdm-uuid',
        affiliate: 'awin',
        companyId: '12',
        connection: 'invalid',
        offerId: 1,
        redemptionType: 'vault',
        url: 'https://www.awin1.com',
        vault: {
          id: 'vlt-uuid',
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
        pathParameters: {
          offerId: 'uuid',
        },
      } as unknown as APIGatewayProxyEventV2;

      mockLogger.error = jest.fn();

      const result = await controller.invoke(request);

      expect(result.statusCode).toEqual(400);
    });

    it.each(['', 0])('returns 400 when request body has offerId has value of [%s]', async (companyId) => {
      const requestBody = {
        id: 'rdm-uuid',
        affiliate: 'awin',
        companyId: companyId,
        connection: 'affiliate',
        offerId: 1,
        redemptionType: 'vault',
        url: 'https://www.awin1.com',
        vault: {
          id: 'vlt-uuid',
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
        pathParameters: {
          offerId: 'uuid',
        },
      } as unknown as APIGatewayProxyEventV2;

      mockLogger.error = jest.fn();

      const result = await controller.invoke(request);

      expect(result.statusCode).toEqual(400);
    });

    it.each(['', 0])('returns 400 when request body has companyId has value of [%s]', async (companyId) => {
      const requestBody = {
        id: 'rdm-uuid',
        affiliate: 'awin',
        companyId: companyId,
        connection: 'affiliate',
        offerId: 1,
        redemptionType: 'vault',
        url: 'https://www.awin1.com',
        vault: {
          id: 'vlt-uuid',
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
        pathParameters: {
          offerId: 'uuid',
        },
      } as unknown as APIGatewayProxyEventV2;

      mockLogger.error = jest.fn();

      const result = await controller.invoke(request);

      expect(result.statusCode).toEqual(400);
    });
  });
});
