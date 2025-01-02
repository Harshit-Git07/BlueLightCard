import { faker } from '@faker-js/faker';
import { describe } from '@jest/globals';

import { PAYMENTS_EVENT_SOURCE, PaymentsEventDetailType } from '@blc-mono/core/constants/payments';
import { as } from '@blc-mono/core/utils/testing';
import { IDwhLoggingService } from '@blc-mono/payments/application/services/DWH/dwhLoggingService';
import { createSilentLogger } from '@blc-mono/payments/libs/test/helpers/logger';

import { UnknownEventBridgeEvent } from '../EventBridgeController';

import { DwhPaymentIntentController } from './dwhPaymentIntentController';

describe('DwhPaymentIntentController', () => {
  describe('invoke', () => {
    it('should call the service correctly', async () => {
      // Arrange
      const testLogger = createSilentLogger();
      const service = { logPaymentIntent: jest.fn() } satisfies Partial<IDwhLoggingService>;
      const controller = new DwhPaymentIntentController(testLogger, as(service));
      const mockEvent = {
        id: faker.string.uuid(),
        version: '0',
        time: new Date().toISOString(),
        region: 'eu-west-1',
        resources: [],
        'detail-type': PaymentsEventDetailType.PAYMENT_INITIATED,
        source: PAYMENTS_EVENT_SOURCE,
        account: faker.string.numeric(),
        detail: {
          currency: 'gbp',
          paymentIntentId: 'pi_123',
          created: new Date().getTime(),
          metadata: { test: 'test' },
          amount: 1000,
          paymentMethodId: 'pm_123',
          member: { id: 'member_123', brazeExternalId: 'braze_123' },
        },
      } satisfies UnknownEventBridgeEvent;

      // Act
      await controller.invoke(mockEvent);

      // Assert
      expect(service.logPaymentIntent).toHaveBeenCalledTimes(1);
      expect(service.logPaymentIntent).toHaveBeenCalledWith(mockEvent.detail);
    });

    it('should return error if request is invalid', async () => {
      // Arrange
      const testLogger = createSilentLogger();
      const service = { logPaymentIntent: jest.fn() } satisfies Partial<IDwhLoggingService>;
      const controller = new DwhPaymentIntentController(testLogger, as(service));
      const mockEvent = {
        'detail-type': PaymentsEventDetailType.PAYMENT_INITIATED,
        source: 'x',
        account: faker.string.numeric(),
        id: faker.string.uuid(),
        version: '0',
        time: new Date().toISOString(),
        region: 'eu-west-1',
        resources: [],
        detail: {
          currency: 'gbp',
          paymentIntentId: 'pi_123',
          created: new Date().getTime(),
          metadata: { test: 'test' },
          amount: 1000,
          paymentMethodId: 'pm_123',
          member: { id: 'member_123', brazeExternalId: 'braze_123' },
        },
      } satisfies UnknownEventBridgeEvent;

      // Act
      const result = controller.invoke(mockEvent);

      // Assert
      await expect(result).rejects.toThrow();
    });
  });
});
