import { faker } from '@faker-js/faker';

import {
  ICallbackResponse,
  ICallbackService,
} from '@blc-mono/redemptions/application/services/callback/CallbackService';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { CallbackController } from './CallbackController';

describe('CallbackController', () => {
  const testEvent = {
    headers: {
      ContentType: 'application/json',
      XAPIKey: 'abcdefghijklmnopqurstuvwxyz',
    },
    body: {
      offerId: faker.string.sample(10),
      code: faker.string.sample(10),
      orderValue: faker.string.sample(10),
      currency: faker.finance.currencyCode(),
      redeemedAt: faker.date.recent().toISOString(),
      memberId: faker.string.sample(10),
      integrationType: 'uniqodo' as const,
    },
  };

  const mockCallbackService = {
    handle: jest.fn(),
  } satisfies ICallbackService;

  it('Maps "NoContent" result correctly to 204 response', async () => {
    // Arrange
    const mockedLogger = createTestLogger();
    mockCallbackService.handle.mockResolvedValue({
      kind: 'NoContent',
    } satisfies ICallbackResponse);

    // Act
    const controller = new CallbackController(mockedLogger, mockCallbackService);
    const actual = await controller.handle(testEvent);

    // Assert
    expect(actual.statusCode).toEqual(204);
  });

  it('Maps "Error" result correctly to 500 response', async () => {
    // Arrange
    const mockedLogger = createTestLogger();
    mockCallbackService.handle.mockResolvedValue({
      kind: 'Error',
    } satisfies ICallbackResponse);

    // Act
    const controller = new CallbackController(mockedLogger, mockCallbackService);
    const actual = await controller.handle(testEvent);

    // Assert
    expect(actual.statusCode).toEqual(500);
  });

  it('Throws an error if unhandled kind is returned', async () => {
    // Arrange
    const mockedLogger = createTestLogger();
    mockCallbackService.handle.mockResolvedValue({
      kind: 'UnhandledKind' as any,
    } satisfies ICallbackResponse);

    // Act
    const controller = new CallbackController(mockedLogger, mockCallbackService);

    // Assert
    await expect(controller.handle(testEvent)).rejects.toThrow('Unhandled result kind');
  });
});
