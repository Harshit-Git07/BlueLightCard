import { faker } from '@faker-js/faker';

import { as } from '@blc-mono/core/utils/testing';
import { IPaymentEventHandlerService } from '@blc-mono/payments/application/services/paymentEvents/PaymentEventsHandlerService';
import { createSilentLogger } from '@blc-mono/payments/libs/test/helpers/logger';

import { UnknownEventBridgeEvent } from '../EventBridgeController';

process.env['STRIPE_EVENT_SOURCE_PREFIX'] = 'stripe';

import { StripeEventsController } from './stripeEventsController';

describe('StripeEventsController', () => {
  describe('invoke', () => {
    it('should call the service correctly', async () => {
      const logger = createSilentLogger();
      const service = { TranslateAndPublish: jest.fn() } satisfies Partial<IPaymentEventHandlerService>;
      const controller = new StripeEventsController(logger, as(service));
      const mockEvent = {
        source: 'aws.partner/stripe.com',
        'detail-type': '1',
        id: faker.string.uuid(),
        version: '0',
        account: faker.string.numeric(),
        time: new Date().toISOString(),
        region: 'eu-west-1',
        resources: [],
        detail: {
          type: '1',
          id: faker.string.uuid(),
          object: 'event',
          created: 1729814400,
          data: {
            object: {
              id: faker.string.uuid(),
            },
          },
        },
      } satisfies UnknownEventBridgeEvent;

      await controller.invoke(mockEvent);
      expect(service.TranslateAndPublish).toHaveBeenCalledTimes(1);
      expect(service.TranslateAndPublish).toHaveBeenCalledWith(mockEvent.detail);
    });

    it('should call the service correctly', async () => {
      const logger = createSilentLogger();
      const service = { TranslateAndPublish: jest.fn() } satisfies Partial<IPaymentEventHandlerService>;
      const controller = new StripeEventsController(logger, as(service));
      const mockEvent = {
        source: '',
        'detail-type': '1',
        id: faker.string.uuid(),
        version: '0',
        account: faker.string.numeric(),
        time: new Date().toISOString(),
        region: 'eu-west-1',
        resources: [],
        detail: {
          type: '1',
          id: faker.string.uuid(),
          object: 'event',
          created: 1729814400,
          data: {
            object: {
              id: faker.string.uuid(),
            },
          },
        },
      } satisfies UnknownEventBridgeEvent;

      // Act
      const result = controller.invoke(mockEvent);

      // Assert
      await expect(result).rejects.toThrow();
    });
  });
});
