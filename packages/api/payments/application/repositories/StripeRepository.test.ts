import { createTestLogger } from '@blc-mono/payments/libs/test/helpers/logger';

import { PaymentEvent } from '../models/paymentEvent';
import { PaymentExternalEventModel } from '../services/paymentEvents/PaymentEventsHandlerService';

import { ISecretRepository } from './SecretRepository';
import { StripeRepository } from './StripeRepository';

describe('StripeRepository', () => {
  describe('translateEvent', () => {
    it('should translate payment_intent.created event correctly', async () => {
      // Arrange
      const secretRepository = {
        fetchStripeSecrets: jest.fn(),
      } satisfies ISecretRepository;

      const stripeRepository = new StripeRepository(createTestLogger(), secretRepository);

      const mockEvent: PaymentExternalEventModel = {
        id: 'evt_1',
        type: 'payment_intent.created',
        object: 'payment_intent',
        data: {
          object: {
            id: 'pi_1',
            customer: 'cus_1',
            currency: 'gbp',
            amount: 1000,
            metadata: { key: 'value' },
          },
        },
        created: 1234442234,
      };

      const expectedPaymentEvent: PaymentEvent = {
        eventId: 'evt_1',
        externalCustomerId: 'cus_1',
        type: 'paymentInitiated',
        currency: 'gbp',
        paymentIntentId: 'pi_1',
        created: 1234442234,
        metadata: { key: 'value' },
        amount: 1000,
      };

      // Act
      const result = await stripeRepository.translateEvent(mockEvent);

      // Assert
      expect(result).toEqual(expectedPaymentEvent);
    });

    it('should translate payment_intent.succeeded event correctly', async () => {
      // Arrange
      const secretRepository = {
        fetchStripeSecrets: jest.fn(),
      } satisfies ISecretRepository;

      const stripeRepository = new StripeRepository(createTestLogger(), secretRepository);

      const mockEvent: PaymentExternalEventModel = {
        id: 'evt_1',
        type: 'payment_intent.succeeded',
        object: 'payment_intent',
        data: {
          object: {
            id: 'pi_1',
            customer: 'cus_1',
            currency: 'gbp',
            amount: 1000,
            metadata: { key: 'value' },
            payment_method: 'pm_1',
          },
        },
        created: 1234442234,
      };

      const expectedPaymentEvent: PaymentEvent = {
        eventId: 'evt_1',
        externalCustomerId: 'cus_1',
        type: 'paymentSucceeded',
        currency: 'gbp',
        paymentIntentId: 'pi_1',
        created: 1234442234,
        metadata: { key: 'value' },
        amount: 1000,
        paymentMethodId: 'pm_1',
      };

      // Act
      const result = await stripeRepository.translateEvent(mockEvent);

      // Assert
      expect(result).toEqual(expectedPaymentEvent);
    });

    it('should translate payment_intent.failed event correctly', async () => {
      // Arrange
      const secretRepository = {
        fetchStripeSecrets: jest.fn(),
      } satisfies ISecretRepository;

      const stripeRepository = new StripeRepository(createTestLogger(), secretRepository);

      const mockEvent: PaymentExternalEventModel = {
        id: 'evt_1',
        type: 'payment_intent.payment_failed',
        object: 'payment_intent',
        data: {
          object: {
            id: 'pi_1',
            customer: 'cus_1',
            currency: 'gbp',
            amount: 1000,
            metadata: { key: 'value' },
            payment_method: 'pm_1',
          },
        },
        created: 1234442234,
      };

      const expectedPaymentEvent: PaymentEvent = {
        eventId: 'evt_1',
        externalCustomerId: 'cus_1',
        type: 'paymentFailed',
        currency: 'gbp',
        paymentIntentId: 'pi_1',
        created: 1234442234,
        metadata: { key: 'value' },
        amount: 1000,
        paymentMethodId: 'pm_1',
      };

      // Act
      const result = await stripeRepository.translateEvent(mockEvent);

      // Assert
      expect(result).toEqual(expectedPaymentEvent);
    });

    it('should translate customer.created event correctly', async () => {
      // Arrange
      const secretRepository = {
        fetchStripeSecrets: jest.fn(),
      } satisfies ISecretRepository;

      const stripeRepository = new StripeRepository(createTestLogger(), secretRepository);

      const mockEvent: PaymentExternalEventModel = {
        id: 'evt_1',
        type: 'customer.created',
        object: 'customer',
        data: {
          object: {
            id: 'cus_1',
            metadata: { key: 'value' },
            name: 'Some Name',
            email: 'some.name@somedomain.com',
          },
        },
        created: 1234442234,
      };

      const expectedPaymentEvent: PaymentEvent = {
        eventId: 'evt_1',
        externalCustomerId: 'cus_1',
        type: 'customerCreated',
        created: 1234442234,
        metadata: { key: 'value' },
        name: 'Some Name',
        email: 'some.name@somedomain.com',
      };

      // Act
      const result = await stripeRepository.translateEvent(mockEvent);

      // Assert
      expect(result).toEqual(expectedPaymentEvent);
    });

    it('should return null for unhandled event types', async () => {
      // Arrange
      const secretRepository = {
        fetchStripeSecrets: jest.fn(),
      } satisfies ISecretRepository;

      const stripeRepository = new StripeRepository(createTestLogger(), secretRepository);

      const mockEvent: PaymentExternalEventModel = {
        id: 'evt_2',
        type: 'unhandled_event_type',
        object: 'payment_intent',
        data: {
          object: {
            id: 'pi_1',
            customer: 'cus_1',
            currency: 'gbp',
            amount: 1000,
            metadata: { key: 'value' },
          },
        },
        created: 1234442234,
      };

      // Act
      const result = await stripeRepository.translateEvent(mockEvent);

      // Assert
      expect(result).toBeNull();
    });
  });
});
