import { faker } from '@faker-js/faker';

import { as } from '@blc-mono/core/utils/testing';
import {
  IGetRedemptionConfigService,
  RedemptionConfigResult,
} from '@blc-mono/redemptions/application/services/redemptionConfig/GetRedemptionConfigService';
import { RedemptionConfig } from '@blc-mono/redemptions/application/transformers/RedemptionConfigTransformer';
import { redemptionConfigFactory } from '@blc-mono/redemptions/libs/test/factories/redemptionConfig.factory';
import { createSilentLogger, createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { GetRedemptionConfigController } from './GetRedemptionConfigController';

const mockLogger = createTestLogger();
const mockGetRedemptionConfigService = {
  getRedemptionConfig: jest.fn(),
} satisfies IGetRedemptionConfigService;

const getRedemptionConfigController = new GetRedemptionConfigController(mockLogger, mockGetRedemptionConfigService);

const redemptionConfig: RedemptionConfig = redemptionConfigFactory.build();
const offerId = faker.number.int();

describe('GetRedemptionConfigController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls GetRedemptionConfigService with an offer id to get a redemption config', () => {
    mockGetRedemptionConfigService.getRedemptionConfig.mockReturnValueOnce({
      kind: 'Ok',
      data: redemptionConfig,
    } satisfies RedemptionConfigResult);

    getRedemptionConfigController.handle({
      pathParameters: {
        offerId,
      },
    });

    expect(mockGetRedemptionConfigService.getRedemptionConfig).toHaveBeenCalledTimes(1);
    expect(mockGetRedemptionConfigService.getRedemptionConfig).toHaveBeenCalledWith(offerId);
  });

  it('returns a 500 response when GetRedemptionConfigService returns error', async () => {
    mockGetRedemptionConfigService.getRedemptionConfig.mockReturnValueOnce({
      kind: 'Error',
      data: {
        message: 'Something went wrong',
      },
    } satisfies RedemptionConfigResult);

    const result = await getRedemptionConfigController.handle({
      pathParameters: {
        offerId,
      },
    });

    expect(result.statusCode).toBe(500);

    expect(result.data).toEqual({
      message: 'Internal Server Error',
    });
  });

  it('returns a 404 response when GetRedemptionConfigService returns RedemptionNotFound', async () => {
    mockGetRedemptionConfigService.getRedemptionConfig.mockReturnValueOnce({
      kind: 'RedemptionNotFound',
    } satisfies RedemptionConfigResult);

    const result = await getRedemptionConfigController.handle({
      pathParameters: {
        offerId,
      },
    });

    expect(result.statusCode).toBe(404);

    expect(result.data).toEqual({
      message: 'No redemption found for the given offerId',
    });
  });

  it('returns 200 response when GetRedemptionConfigService returns a valid redemption config', async () => {
    mockGetRedemptionConfigService.getRedemptionConfig.mockReturnValueOnce({
      kind: 'Ok',
      data: redemptionConfig,
    } satisfies RedemptionConfigResult);

    const result = await getRedemptionConfigController.handle({
      pathParameters: {
        offerId,
      },
    });

    expect(result.statusCode).toBe(200);
    expect(result.data).toEqual(redemptionConfig);
  });

  it('fails with parsing errors', async () => {
    const getRedemptionConfigController = new GetRedemptionConfigController(
      createSilentLogger(),
      mockGetRedemptionConfigService,
    );

    const result = await getRedemptionConfigController.invoke(
      as({
        body: JSON.stringify({
          error: 'Broken',
          meta: { tracingId: 'yes' },
        }),
        requestContext: {},
      }),
    );
    expect(result.body).toContain('Validation error');
  });

  it('throws an error if an unsupported response occurs in the service', async () => {
    const expectedOfferId = faker.string.numeric(8);

    mockGetRedemptionConfigService.getRedemptionConfig.mockReturnValueOnce({
      kind: 'Asparagus',
      data: {
        offerId: expectedOfferId,
      },
    });

    await expect(() =>
      getRedemptionConfigController.handle({
        pathParameters: {
          offerId,
        },
      }),
    ).rejects.toThrow();
  });
});
