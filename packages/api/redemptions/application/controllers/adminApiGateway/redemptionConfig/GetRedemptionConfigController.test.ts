import { faker } from '@faker-js/faker';

import { as } from '@blc-mono/core/utils/testing';
import {
  IGetRedemptionConfigService,
  RedemptionConfigResult,
} from '@blc-mono/redemptions/application/services/redemptionConfig/GetRedemptionConfigService';
import { createSilentLogger, createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { GetRedemptionConfigController } from './GetRedemptionConfigController';

const mockLogger = createTestLogger();
const mockGetRedemptionConfigService = {
  getRedemption: jest.fn(),
} satisfies IGetRedemptionConfigService;

const getRedemptionConfigController = new GetRedemptionConfigController(mockLogger, mockGetRedemptionConfigService);

describe('GetRedemptionConfigController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls GetRedemptionConfigService with an offer id to get a redemption config', () => {
    const expectedOfferId = faker.string.numeric(8);

    mockGetRedemptionConfigService.getRedemption.mockReturnValueOnce({
      kind: 'Ok',
      data: {
        offerId: faker.string.numeric(8),
      },
    } satisfies RedemptionConfigResult);

    getRedemptionConfigController.handle({
      pathParameters: {
        offerId: expectedOfferId,
      },
    });

    expect(mockGetRedemptionConfigService.getRedemption).toHaveBeenCalledTimes(1);
    expect(mockGetRedemptionConfigService.getRedemption).toHaveBeenCalledWith(expectedOfferId);
  });

  it('returns a 500 response when GetRedemptionConfigService returns error', () => {
    mockGetRedemptionConfigService.getRedemption.mockReturnValueOnce({
      kind: 'Error',
    } satisfies RedemptionConfigResult);

    const result = getRedemptionConfigController.handle({
      pathParameters: {
        offerId: faker.string.numeric(8),
      },
    });

    expect(result.statusCode).toBe(500);

    expect(result.data).toEqual({
      message: 'Internal Server Error',
    });
  });

  it('returns a 404 response when GetRedemptionConfigService returns RedemptionNotFound', () => {
    mockGetRedemptionConfigService.getRedemption.mockReturnValueOnce({
      kind: 'RedemptionNotFound',
    } satisfies RedemptionConfigResult);

    const result = getRedemptionConfigController.handle({
      pathParameters: {
        offerId: faker.string.numeric(8),
      },
    });

    expect(result.statusCode).toBe(404);

    expect(result.data).toEqual({
      message: 'No redemption found for the given offerId',
    });
  });

  it('returns 200 response when GetRedemptionConfigService returns a valid redemption config', () => {
    const expectedOfferId = faker.string.numeric(8);

    mockGetRedemptionConfigService.getRedemption.mockReturnValueOnce({
      kind: 'Ok',
      data: {
        offerId: expectedOfferId,
      },
    } satisfies RedemptionConfigResult);

    const result = getRedemptionConfigController.handle({
      pathParameters: {
        offerId: faker.string.numeric(8),
      },
    });

    expect(result.statusCode).toBe(200);
    expect(result.data).toEqual({
      offerId: expectedOfferId,
    });
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

  it('throws an error if an unsupported response occurs in the service', () => {
    const expectedOfferId = faker.string.numeric(8);

    mockGetRedemptionConfigService.getRedemption.mockReturnValueOnce({
      kind: 'Asparagus',
      data: {
        offerId: expectedOfferId,
      },
    });

    expect(() =>
      getRedemptionConfigController.handle({
        pathParameters: {
          offerId: faker.string.numeric(8),
        },
      }),
    ).toThrow();
  });
});
