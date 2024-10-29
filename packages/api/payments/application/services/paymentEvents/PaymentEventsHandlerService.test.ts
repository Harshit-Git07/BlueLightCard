import { createTestLogger } from '@blc-mono/payments/libs/test/helpers/logger';

import { PaymentEventHandlerService } from './PaymentEventsHandlerService';

describe('PaymentEventHandlerService', () => {
  const event = {
    type: 'payment_intent.created',
    id: 'evt_1',
    object: 'payment_intent',
    created: 133222,
    data: {
      object: {
        id: 'pi_1',
      },
    },
  };

  it('publish and store paymentSucceeded event for member when there is an associated customer', async () => {
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
    };
    const paymentEventsRepository = {
      publishPaymentInitiatedEvent: jest.fn(),
      publishPaymentSucceededEvent: jest.fn(),
      publishPaymentFailedEvent: jest.fn(),
    };

    const translatedPaymentEvent = {
      eventId: 'evt_1',
      type: 'paymentSucceeded',
      currency: 'gbp',
      paymentIntentId: 'pt_1',
      created: 12322,
      metadata: { memberId: '232' },
      amount: 4900,
      externalCustomerId: 'cus_1',
      paymentMethodId: 'pm_1',
    };

    stripeRepository.translateEvent.mockReturnValue(translatedPaymentEvent);

    paymentEventStoreRepository.queryEventsByTypeAndObjectId.mockResolvedValue([
      {
        pk: 'MEMBER#1232',
      },
    ]);

    const paymentEventHandlerService = new PaymentEventHandlerService(
      logger,
      stripeRepository,
      paymentEventsRepository,
      paymentEventStoreRepository,
    );

    // Act
    await paymentEventHandlerService.TranslateAndPublish(event);

    // Assert
    expect(paymentEventStoreRepository.queryEventsByTypeAndObjectId).toHaveBeenCalledWith('customerCreated', 'cus_1');
    expect(paymentEventsRepository.publishPaymentSucceededEvent).toHaveBeenCalledWith({
      currency: 'gbp',
      paymentIntentId: 'pt_1',
      created: 12322,
      metadata: { memberId: '232' },
      amount: 4900,
      paymentMethodId: 'pm_1',
      memberId: '1232',
    });
    expect(paymentEventStoreRepository.writePaymentEvent).toHaveBeenCalledWith('1232', translatedPaymentEvent);
  });

  it('publish and store paymentFailed event for member when there is an associated customer', async () => {
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
    };
    const paymentEventsRepository = {
      publishPaymentInitiatedEvent: jest.fn(),
      publishPaymentSucceededEvent: jest.fn(),
      publishPaymentFailedEvent: jest.fn(),
    };

    const translatedPaymentEvent = {
      eventId: 'evt_1',
      type: 'paymentFailed',
      currency: 'gbp',
      paymentIntentId: 'pt_1',
      created: 12322,
      metadata: { memberId: '232' },
      amount: 4900,
      externalCustomerId: 'cus_1',
      paymentMethodId: 'pm_1',
    };

    stripeRepository.translateEvent.mockReturnValue(translatedPaymentEvent);

    paymentEventStoreRepository.queryEventsByTypeAndObjectId.mockResolvedValue([
      {
        pk: 'MEMBER#1232',
      },
    ]);

    const paymentEventHandlerService = new PaymentEventHandlerService(
      logger,
      stripeRepository,
      paymentEventsRepository,
      paymentEventStoreRepository,
    );

    // Act
    await paymentEventHandlerService.TranslateAndPublish(event);

    // Assert
    expect(paymentEventStoreRepository.queryEventsByTypeAndObjectId).toHaveBeenCalledWith('customerCreated', 'cus_1');
    expect(paymentEventsRepository.publishPaymentFailedEvent).toHaveBeenCalledWith({
      currency: 'gbp',
      paymentIntentId: 'pt_1',
      created: 12322,
      metadata: { memberId: '232' },
      amount: 4900,
      paymentMethodId: 'pm_1',
      memberId: '1232',
    });
    expect(paymentEventStoreRepository.writePaymentEvent).toHaveBeenCalledWith('1232', translatedPaymentEvent);
  });

  it('publish and store payment event under NO_MEMBER_ID when no stripe customer is associated with payment', async () => {
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
    };
    const paymentEventsRepository = {
      publishPaymentInitiatedEvent: jest.fn(),
      publishPaymentSucceededEvent: jest.fn(),
      publishPaymentFailedEvent: jest.fn(),
    };

    const translatedPaymentEvent = {
      eventId: 'evt_1',
      type: 'paymentFailed',
      currency: 'gbp',
      paymentIntentId: 'pt_1',
      created: 12322,
      metadata: { memberId: '232' },
      amount: 4900,
      paymentMethodId: 'pm_1',
    };

    stripeRepository.translateEvent.mockReturnValue(translatedPaymentEvent);

    const paymentEventHandlerService = new PaymentEventHandlerService(
      logger,
      stripeRepository,
      paymentEventsRepository,
      paymentEventStoreRepository,
    );

    // Act
    await paymentEventHandlerService.TranslateAndPublish(event);

    // Assert
    expect(paymentEventStoreRepository.queryEventsByTypeAndObjectId).not.toHaveBeenCalled();
    expect(paymentEventsRepository.publishPaymentFailedEvent).toHaveBeenCalledWith({
      currency: 'gbp',
      paymentIntentId: 'pt_1',
      created: 12322,
      metadata: { memberId: '232' },
      amount: 4900,
      paymentMethodId: 'pm_1',
      memberId: 'NO_MEMBER_ID',
    });
    expect(paymentEventStoreRepository.writePaymentEvent).toHaveBeenCalledWith('NO_MEMBER_ID', translatedPaymentEvent);
  });

  it('publish and store payment event under NO_MEMBER_ID when we have no stripe customer associated with member in our db', async () => {
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
    };
    const paymentEventsRepository = {
      publishPaymentInitiatedEvent: jest.fn(),
      publishPaymentSucceededEvent: jest.fn(),
      publishPaymentFailedEvent: jest.fn(),
    };

    const translatedPaymentEvent = {
      eventId: 'evt_1',
      type: 'paymentFailed',
      currency: 'gbp',
      paymentIntentId: 'pt_1',
      created: 12322,
      metadata: { memberId: '232' },
      amount: 4900,
      externalCustomerId: 'cus_1',
      paymentMethodId: 'pm_1',
    };

    stripeRepository.translateEvent.mockReturnValue(translatedPaymentEvent);

    paymentEventStoreRepository.queryEventsByTypeAndObjectId.mockResolvedValue([]);

    const paymentEventHandlerService = new PaymentEventHandlerService(
      logger,
      stripeRepository,
      paymentEventsRepository,
      paymentEventStoreRepository,
    );

    // Act
    await paymentEventHandlerService.TranslateAndPublish(event);

    // Assert
    expect(paymentEventStoreRepository.queryEventsByTypeAndObjectId).toHaveBeenCalledWith('customerCreated', 'cus_1');
    expect(paymentEventsRepository.publishPaymentFailedEvent).toHaveBeenCalledWith({
      currency: 'gbp',
      paymentIntentId: 'pt_1',
      created: 12322,
      metadata: { memberId: '232' },
      amount: 4900,
      paymentMethodId: 'pm_1',
      memberId: 'NO_MEMBER_ID',
    });
    expect(paymentEventStoreRepository.writePaymentEvent).toHaveBeenCalledWith('NO_MEMBER_ID', translatedPaymentEvent);
  });
});
