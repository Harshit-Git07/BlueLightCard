import { as } from '@blc-mono/core/utils/testing';
import { ICreateRedemptionConfigService } from '@blc-mono/redemptions/application/services/redemptionConfig/CreateRedemptionConfigService';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { CreateRedemptionConfigController } from './CreateRedemptionConfigController';

describe('CreateRedemptionConfigController', () => {
  it('returns 200 for a successful request', async () => {
    const logger = createTestLogger();

    const MockCreateRedemptionConfigService = {
      createRedemptionConfig: jest.fn(),
    } satisfies ICreateRedemptionConfigService;

    MockCreateRedemptionConfigService.createRedemptionConfig.mockResolvedValue({
      kind: 'Ok',
      data: { some: 'data' },
    });

    const requestBody = {
      companyId: 1234,
      offerId: 4321,
      connection: 'none',
      offerType: 'in-store',
      redemptionType: 'preApplied',
      affiliate: 'awin',
      url: 'some-url',
    } as const;

    const controller = new CreateRedemptionConfigController(logger, MockCreateRedemptionConfigService);
    const result = await controller.handle({ body: requestBody });

    expect(result.statusCode).toEqual(200);
    expect(result.data).toStrictEqual({ some: 'data' });
    expect(MockCreateRedemptionConfigService.createRedemptionConfig).toHaveBeenCalledWith(requestBody);
  });

  it('returns 500 for an error request', async () => {
    const logger = createTestLogger();
    const MockCreateRedemptionConfigService = {
      createRedemptionConfig: jest.fn(),
    } satisfies ICreateRedemptionConfigService;

    MockCreateRedemptionConfigService.createRedemptionConfig.mockResolvedValue({
      kind: 'Error',
      data: { error: 'error' },
    });

    const requestBody = {
      companyId: 1234,
      offerId: 4321,
      connection: 'none',
      offerType: 'in-store',
      redemptionType: 'preApplied',
      affiliate: 'awin',
      url: 'some-url',
    } as const;

    const controller = new CreateRedemptionConfigController(logger, MockCreateRedemptionConfigService);
    const result = await controller.handle({
      body: requestBody,
    });

    expect(result.statusCode).toEqual(500);
    expect(result.data).toStrictEqual({ error: 'error' });
  });

  it('returns 409 for a duplication error request', async () => {
    const logger = createTestLogger();
    const MockCreateRedemptionConfigService = {
      createRedemptionConfig: jest.fn(),
    } satisfies ICreateRedemptionConfigService;

    MockCreateRedemptionConfigService.createRedemptionConfig.mockResolvedValue({
      kind: 'DuplicationError',
      data: { error: 'duplication' },
    });

    const requestBody = {
      companyId: 1234,
    } as const;

    const controller = new CreateRedemptionConfigController(logger, MockCreateRedemptionConfigService);
    const result = await controller.handle(
      as({
        body: requestBody,
      }),
    );

    expect(result.statusCode).toEqual(409);
    expect(result.data).toStrictEqual({ error: 'duplication' });
  });

  it('returns 400 for a validation error request', async () => {
    const logger = createTestLogger();
    const MockCreateRedemptionConfigService = {
      createRedemptionConfig: jest.fn(),
    } satisfies ICreateRedemptionConfigService;

    MockCreateRedemptionConfigService.createRedemptionConfig.mockResolvedValue({
      kind: 'ValidationError',
      data: { error: 'validation' },
    });

    const requestBody = {
      companyId: 1234,
    } as const;

    const controller = new CreateRedemptionConfigController(logger, MockCreateRedemptionConfigService);
    const result = await controller.handle(
      as({
        body: requestBody,
      }),
    );

    expect(result.statusCode).toEqual(400);
    expect(result.data).toStrictEqual({ error: 'validation' });
  });

  it('throws an error if an invalid Kind is returned from the service', async () => {
    const logger = createTestLogger();
    const MockCreateRedemptionConfigService = {
      createRedemptionConfig: jest.fn(),
    } satisfies ICreateRedemptionConfigService;

    MockCreateRedemptionConfigService.createRedemptionConfig.mockResolvedValue({
      kind: 'Asparagus',
      data: { type: 'yummy green vegetable' },
    });

    const requestBody = {
      companyId: 1234,
      offerId: 4321,
      connection: 'none',
      offerType: 'in-store',
      redemptionType: 'preApplied',
      affiliate: 'awin',
      url: 'some-url',
    } as const;

    const controller = new CreateRedemptionConfigController(logger, MockCreateRedemptionConfigService);
    await expect(
      controller.handle({
        body: requestBody,
      }),
    ).rejects.toThrow();
  });
});
