import { faker } from '@faker-js/faker';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

import { IUpdateVaultBatchService } from '@blc-mono/redemptions/application/services/vaultBatch/UpdateVaultBatchService';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import { generateFakeJWT } from '@blc-mono/redemptions/libs/test/factories/redeemRequest.factory';
import { updateVaultBatchEventFactory } from '@blc-mono/redemptions/libs/test/factories/updateVaultBatch.factory';
import { createSilentLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { UpdateVaultBatchController } from './UpdateVaultBatchController';

describe('UpdateVaultBatchController', () => {
  const testSilentLogger = createSilentLogger();

  beforeAll(() => {
    process.env[RedemptionsStackEnvironmentKeys.ADMIN_API_DEFAULT_ALLOWED_ORIGINS] = '["*"]';
  });

  afterAll(() => {
    delete process.env[RedemptionsStackEnvironmentKeys.ADMIN_API_DEFAULT_ALLOWED_ORIGINS];
  });

  it.each([
    ['NoContent', undefined, 204],
    ['VaultBatchNotFound', 'Vault Batch not found', 404],
    ['VaultCodesNotFound', 'Vault Codes not found', 404],
    ['ErrorUpdatingVaultBatch', 'Vault Batch not updated', 400],
    ['ErrorUpdatingVaultCodes', 'Vault Codes not updated', 400],
  ])('it should return %s when %s with status code %d', async (kind, message, statusCode) => {
    // Arrange
    const updateVaultBatchService = {
      handle: jest.fn().mockResolvedValue({
        kind,
        message,
      }),
    } satisfies IUpdateVaultBatchService;
    const controller = new UpdateVaultBatchController(testSilentLogger, updateVaultBatchService);

    // Act
    const result = await controller.handle({
      pathParameters: { batchId: faker.string.uuid() },
      body: { ...updateVaultBatchEventFactory.build() },
    });

    // Assert
    expect(result.statusCode).toEqual(statusCode);
    if (message) {
      expect(result?.data).toEqual({ message });
    }
  });

  it.each([
    ['from past', faker.date.past().toISOString()],
    ['a random string', faker.string.sample(5)],
    ['a random number', faker.string.numeric()],
  ])('it should return 400 with message "Invalid expiry date" when expiry date is %s', async (_, date) => {
    // Arrange
    const updateVaultBatchService = {
      handle: jest.fn().mockResolvedValue(undefined),
    } satisfies IUpdateVaultBatchService;
    const controller = new UpdateVaultBatchController(testSilentLogger, updateVaultBatchService);
    const request = {
      headers: {
        Authorization: generateFakeJWT('PHYSICAL_CARD'),
      },
      pathParameters: { batchId: faker.string.uuid() },
      body: JSON.stringify({
        ...updateVaultBatchEventFactory.build({
          expiry: date,
        }),
      }),
      requestContext: {
        requestId: 'requestId',
      },
    };

    // Act
    const result = await controller.invoke(request as unknown as APIGatewayProxyEventV2);
    const body = JSON.parse(result?.body as string) as {
      meta: { tracingId: string };
      message: string;
      error: { statusCode: number; data: { message: string } };
    };

    // Assert
    expect(body.error.statusCode).toEqual(400);
    expect(body.error.data).toEqual({ message: 'Invalid expiry date' });
  });
});
