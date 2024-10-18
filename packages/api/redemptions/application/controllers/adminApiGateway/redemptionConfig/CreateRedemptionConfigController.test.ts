import { ICreateRedemptionConfigService } from '@blc-mono/redemptions/application/services/redemptionConfig/CreateRedemptionConfigService';
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

describe('CreateRedemptionConfigController', () => {
  beforeEach(() => {
    jest.resetAllMocks();
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
