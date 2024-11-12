import { PaymentsStackEnvironmentKeys } from '@blc-mono/payments/infrastructure/constants/environment';
import { createTestLogger } from '@blc-mono/payments/libs/test/helpers/logger';

import { UserContext } from '../../models/postPaymentInitiation';

import { PaymentInitiationResult, PaymentInitiationService } from './PaymentInitiationService';

describe('PaymentInitiationService', () => {
  beforeEach(() => {
    process.env[PaymentsStackEnvironmentKeys.CURRENCY_CODE] = 'gbp';
  });
  it('should initiate payment and return the result, creating a new stripe customer', async () => {
    // Arrange

    const logger = createTestLogger();
    const stripeRepository = {
      createPaymentIntent: jest.fn(),
      createEphemeralKey: jest.fn(),
      createCustomer: jest.fn(),
      translateEvent: jest.fn(),
    };
    const paymentEventStoreRepository = {
      writePaymentEvent: jest.fn(),
      queryPaymentEventsByMemberIdAndEventType: jest.fn(),
      queryEventsByTypeAndObjectId: jest.fn(),
      queryPaymentEventsByMemberId: jest.fn(),
    };
    const paymentEventsRepository = {
      publishPaymentInitiatedEvent: jest.fn(),
      publishPaymentSucceededEvent: jest.fn(),
      publishPaymentFailedEvent: jest.fn(),
    };

    const paymentInitiationService = new PaymentInitiationService(
      logger,
      stripeRepository,
      paymentEventStoreRepository,
      paymentEventsRepository,
    );

    const idempotencyKey = '12345';
    const user: UserContext = {
      memberId: '123',
      name: 'some name',
      brazeExternalId: '1e33',
    };
    const amount = 100;
    const metadata = { applicationId: '123' };
    const description = 'Test payment';

    paymentEventStoreRepository.queryPaymentEventsByMemberIdAndEventType.mockResolvedValue([]);

    stripeRepository.createCustomer.mockResolvedValue('customer_id');
    stripeRepository.createPaymentIntent.mockResolvedValue({
      paymentIntentId: 'payment_intent_id',
      clientSecret: 'client_secret',
      publishableKey: 'publishable_key',
    });

    // Act
    const result: PaymentInitiationResult = await paymentInitiationService.InitiatePayment(
      idempotencyKey,
      user,
      amount,
      metadata,
      description,
    );

    const metaddataToAssert = { ...metadata, memberId: user.memberId, brazeExternalId: user.brazeExternalId };
    // Assert
    expect(result).toEqual({
      paymentIntentId: 'payment_intent_id',
      clientSecret: 'client_secret',
      publishableKey: 'publishable_key',
      externalCustomer: 'customer_id',
    });
    expect(paymentEventStoreRepository.queryPaymentEventsByMemberIdAndEventType).toHaveBeenCalledWith(
      user.memberId,
      'customerCreated',
    );
    expect(stripeRepository.createCustomer).toHaveBeenCalledWith(user.name, user);
    expect(paymentEventStoreRepository.writePaymentEvent).toHaveBeenNthCalledWith(1, user.memberId, {
      type: 'customerCreated',
      externalCustomerId: 'customer_id',
      name: user.name,
      metadata: user,
      eventId: expect.any(String),
      created: expect.any(Number),
    });
    expect(stripeRepository.createPaymentIntent).toHaveBeenCalledWith(
      idempotencyKey,
      'gbp',
      'customer_id',
      amount,
      metaddataToAssert,
      description,
    );
    expect(paymentEventsRepository.publishPaymentInitiatedEvent).toHaveBeenCalledWith({
      memberId: user.memberId,
      amount,
      metadata: metaddataToAssert,
      created: expect.any(Number),
      paymentIntentId: 'payment_intent_id',
      currency: 'gbp',
    });
    expect(paymentEventStoreRepository.writePaymentEvent).toHaveBeenNthCalledWith(2, user.memberId, {
      eventId: expect.any(String),
      type: 'paymentInitiated',
      currency: 'gbp',
      paymentIntentId: 'payment_intent_id',
      created: expect.any(Number),
      metadata: metaddataToAssert,
      amount,
      externalCustomerId: 'customer_id',
    });
  });

  it('should use existing stripe customer for member', async () => {
    // Arrange

    const logger = createTestLogger();
    const stripeRepository = {
      createPaymentIntent: jest.fn(),
      createEphemeralKey: jest.fn(),
      createCustomer: jest.fn(),
      translateEvent: jest.fn(),
    };
    const paymentEventStoreRepository = {
      writePaymentEvent: jest.fn(),
      queryPaymentEventsByMemberIdAndEventType: jest.fn(),
      queryEventsByTypeAndObjectId: jest.fn(),
      queryPaymentEventsByMemberId: jest.fn(),
    };
    const paymentEventsRepository = {
      publishPaymentInitiatedEvent: jest.fn(),
      publishPaymentSucceededEvent: jest.fn(),
      publishPaymentFailedEvent: jest.fn(),
    };

    const paymentInitiationService = new PaymentInitiationService(
      logger,
      stripeRepository,
      paymentEventStoreRepository,
      paymentEventsRepository,
    );

    const idempotencyKey = '12345';
    const user: UserContext = {
      memberId: '123',
      name: 'some name',
      brazeExternalId: '1e33',
    };
    const amount = 100;
    const metadata = { applicationId: '123' };
    const description = 'Test payment';

    paymentEventStoreRepository.queryPaymentEventsByMemberIdAndEventType.mockResolvedValue([
      { objectId: 'existing_customer_id' },
    ]);

    stripeRepository.createPaymentIntent.mockResolvedValue({
      paymentIntentId: 'payment_intent_id',
      clientSecret: 'client_secret',
      publishableKey: 'publishable_key',
    });

    // Act
    await paymentInitiationService.InitiatePayment(idempotencyKey, user, amount, metadata, description);

    const metaddataToAssert = { ...metadata, memberId: user.memberId, brazeExternalId: user.brazeExternalId };
    // Assert
    expect(stripeRepository.createCustomer).not.toHaveBeenCalled();
    expect(stripeRepository.createPaymentIntent).toHaveBeenCalledWith(
      idempotencyKey,
      'gbp',
      'existing_customer_id',
      amount,
      metaddataToAssert,
      description,
    );
    expect(paymentEventStoreRepository.writePaymentEvent).toHaveBeenCalledWith(user.memberId, {
      eventId: expect.any(String),
      type: 'paymentInitiated',
      currency: 'gbp',
      paymentIntentId: 'payment_intent_id',
      created: expect.any(Number),
      metadata: metaddataToAssert,
      amount,
      externalCustomerId: 'existing_customer_id',
    });
  });
});
