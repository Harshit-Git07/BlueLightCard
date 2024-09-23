import { APIGatewayProxyEventV2 } from 'aws-lambda';

import {
  IUpdateRedemptionConfigService,
  UpdateRedemptionConfigResult,
} from '@blc-mono/redemptions/application/services/redemptionConfig/UpdateRedemptionConfig';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { PatchRedemptionModelRequest, UpdateRedemptionConfigController } from './UpdateRedemptionConfigController';

describe('RedemptionUpdateController', () => {
  it('it should return 200 mock.', async () => {
    // Arrange
    const logger = createTestLogger();
    const updateRedemptionConfigService = {
      updateRedemptionConfig: jest.fn(),
    } satisfies IUpdateRedemptionConfigService;
    const controller = new UpdateRedemptionConfigController(logger, updateRedemptionConfigService);
    updateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue({
      kind: 'Ok',
      data: {
        message: 'success',
      },
    } satisfies UpdateRedemptionConfigResult);

    const request = {
      body: {
        id: 'a',
        offerId: 'a',
        connections: 'a',
        affiliate: 'test',
        vault: {
          id: '1',
          alertBelow: 100,
          status: 'active',
          redemptionType: 'vault',
          maxPerUser: 100,
          createdAt: '2021-09-01T00:00:00.000Z',
          email: 'test',
          integration: 'test',
          integrationId: 'test',
        },
      },
    };

    const result = await controller.handle(request as unknown as PatchRedemptionModelRequest);

    // Assert
    expect(result.statusCode).toEqual(200);
    expect(result.data).toEqual({
      message: 'success',
    });
  });

  it('it should return 404 mock.', async () => {
    // Arrange
    const logger = createTestLogger();
    const updateRedemptionConfigService = {
      updateRedemptionConfig: jest.fn(),
    } satisfies IUpdateRedemptionConfigService;
    const controller = new UpdateRedemptionConfigController(logger, updateRedemptionConfigService);
    updateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue({
      kind: 'Error',
      data: {
        message: 'error',
      },
    } satisfies UpdateRedemptionConfigResult);

    const request = {
      body: {},
    };

    const result = await controller.handle(request as unknown as PatchRedemptionModelRequest);

    // Assert
    expect(result.statusCode).toEqual(404);
    expect(result.data).toEqual({
      message: 'error',
    });
  });

  it('it should fail parsing errors', async () => {
    // Arrange
    const logger = createTestLogger();
    const updateRedemptionConfigService = {
      updateRedemptionConfig: jest.fn(),
    } satisfies IUpdateRedemptionConfigService;
    const controller = new UpdateRedemptionConfigController(logger, updateRedemptionConfigService);

    const request = {
      requestContext: {
        requestId: 'test',
      },
    } as unknown as APIGatewayProxyEventV2;

    const result = await controller.invoke(request);
    expect(result.body).toContain('Validation error');
  });

  it('exhaustiveCheck test to make sure.', async () => {
    // Arrange
    const logger = createTestLogger();
    const updateRedemptionConfigService = {
      updateRedemptionConfig: jest.fn(),
    } satisfies IUpdateRedemptionConfigService;
    const controller = new UpdateRedemptionConfigController(logger, updateRedemptionConfigService);
    updateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue({
      kind: 'Fake Kind' as never,
      data: {
        message: 'error',
      },
    } satisfies UpdateRedemptionConfigResult);

    const request = {
      body: {},
    };

    await expect(controller.handle(request as unknown as PatchRedemptionModelRequest)).rejects.toThrow(
      'Unhandled result: Fake Kind',
    );
  });
});
