import 'aws-sdk-client-mock-jest';

import {
  EventBridgeClient,
  EventBridgeClientResolvedConfig,
  PutEventsCommand,
  ServiceInputTypes,
  ServiceOutputTypes,
} from '@aws-sdk/client-eventbridge';
import { faker } from '@faker-js/faker';
import { afterEach, describe, it } from '@jest/globals';
import { AwsStub, mockClient } from 'aws-sdk-client-mock';

import { PAYMENTS_EVENT_SOURCE, PaymentsEventDetailType } from '@blc-mono/core/constants/payments';
import { PaymentObjectEventDetail } from '@blc-mono/core/schemas/payments';
import { PaymentsStackEnvironmentKeys } from '@blc-mono/payments/infrastructure/constants/environment';

import { PaymentEventsRepository } from './PaymentEventsRepository';

describe('PaymentEventsRepository', () => {
  const eventBusName = 'test-event-bus-name';
  const repository = new PaymentEventsRepository();
  let mockEventBridgeClient: AwsStub<ServiceInputTypes, ServiceOutputTypes, EventBridgeClientResolvedConfig>;

  // Arrange
  const defaultPaymentObjectEventDetail: PaymentObjectEventDetail = {
    currency: 'aud',
    paymentIntentId: faker.string.uuid(),
    created: faker.number.int({
      min: 1,
      max: 1_000_000,
    }),
    metadata: {},
    amount: faker.number.int({
      min: 1,
      max: 1_000_000,
    }),
    paymentMethodId: faker.string.uuid(),
    member: {
      id: faker.string.uuid(),
      brazeExternalId: faker.string.uuid(),
    },
  };

  beforeEach(() => {
    mockEventBridgeClient = mockClient(EventBridgeClient);
    mockEventBridgeClient.on(PutEventsCommand);
    process.env[PaymentsStackEnvironmentKeys.PAYMENTS_EVENT_BUS_NAME] = eventBusName;
  });

  afterEach(() => {
    delete process.env[PaymentsStackEnvironmentKeys.PAYMENTS_EVENT_BUS_NAME];
  });

  describe('publishPaymentInitiatedEvent', () => {
    it('should publish to the correct event bus, source and detail type', async () => {
      // Act
      await repository.publishPaymentInitiatedEvent(defaultPaymentObjectEventDetail);

      // Assert
      expect(mockEventBridgeClient).toHaveReceivedCommandTimes(PutEventsCommand, 1);
      expect(mockEventBridgeClient).toHaveReceivedCommandWith(PutEventsCommand, {
        Entries: [
          expect.objectContaining({
            EventBusName: eventBusName,
            Source: PAYMENTS_EVENT_SOURCE,
            DetailType: PaymentsEventDetailType.PAYMENT_INITIATED,
          }),
        ],
      });
    });

    it('should publish the correct event details', async () => {
      // Act
      await repository.publishPaymentInitiatedEvent(defaultPaymentObjectEventDetail);

      // Assert
      expect(mockEventBridgeClient).toHaveReceivedCommandTimes(PutEventsCommand, 1);
      const firstCall = mockEventBridgeClient.commandCalls(PutEventsCommand)[0];
      const receivedDetailString = firstCall.args[0].input.Entries!.at(0)!.Detail!;
      const receivedDetail = JSON.parse(receivedDetailString);
      expect(receivedDetail).toEqual({
        currency: defaultPaymentObjectEventDetail.currency,
        paymentIntentId: defaultPaymentObjectEventDetail.paymentIntentId,
        created: defaultPaymentObjectEventDetail.created,
        amount: defaultPaymentObjectEventDetail.amount,
        metadata: defaultPaymentObjectEventDetail.metadata,
        paymentMethodId: defaultPaymentObjectEventDetail.paymentMethodId,
        member: defaultPaymentObjectEventDetail.member,
      });
    });
  });

  describe('publishPaymentSucceededEvent', () => {
    it('should publish to the correct event bus, source and detail type', async () => {
      // Act
      await repository.publishPaymentSucceededEvent(defaultPaymentObjectEventDetail);

      // Assert
      expect(mockEventBridgeClient).toHaveReceivedCommandTimes(PutEventsCommand, 1);
      expect(mockEventBridgeClient).toHaveReceivedCommandWith(PutEventsCommand, {
        Entries: [
          expect.objectContaining({
            EventBusName: eventBusName,
            Source: PAYMENTS_EVENT_SOURCE,
            DetailType: PaymentsEventDetailType.PAYMENT_SUCCEEDED,
          }),
        ],
      });
    });

    it('should publish the correct event details', async () => {
      // Act
      await repository.publishPaymentSucceededEvent(defaultPaymentObjectEventDetail);

      // Assert
      expect(mockEventBridgeClient).toHaveReceivedCommandTimes(PutEventsCommand, 1);
      const firstCall = mockEventBridgeClient.commandCalls(PutEventsCommand)[0];
      const receivedDetailString = firstCall.args[0].input.Entries!.at(0)!.Detail!;
      const receivedDetail = JSON.parse(receivedDetailString);
      expect(receivedDetail).toEqual({
        currency: defaultPaymentObjectEventDetail.currency,
        paymentIntentId: defaultPaymentObjectEventDetail.paymentIntentId,
        created: defaultPaymentObjectEventDetail.created,
        amount: defaultPaymentObjectEventDetail.amount,
        metadata: defaultPaymentObjectEventDetail.metadata,
        paymentMethodId: defaultPaymentObjectEventDetail.paymentMethodId,
        member: defaultPaymentObjectEventDetail.member,
      });
    });
  });

  describe('publishPaymentFailedEvent', () => {
    it('should publish to the correct event bus, source and detail type', async () => {
      // Act
      await repository.publishPaymentFailedEvent(defaultPaymentObjectEventDetail);

      // Assert
      expect(mockEventBridgeClient).toHaveReceivedCommandTimes(PutEventsCommand, 1);
      expect(mockEventBridgeClient).toHaveReceivedCommandWith(PutEventsCommand, {
        Entries: [
          expect.objectContaining({
            EventBusName: eventBusName,
            Source: PAYMENTS_EVENT_SOURCE,
            DetailType: PaymentsEventDetailType.PAYMENT_FAILED,
          }),
        ],
      });
    });

    it('should publish the correct event details', async () => {
      // Act
      await repository.publishPaymentFailedEvent(defaultPaymentObjectEventDetail);

      // Assert
      expect(mockEventBridgeClient).toHaveReceivedCommandTimes(PutEventsCommand, 1);
      const firstCall = mockEventBridgeClient.commandCalls(PutEventsCommand)[0];
      const receivedDetailString = firstCall.args[0].input.Entries!.at(0)!.Detail!;
      const receivedDetail = JSON.parse(receivedDetailString);
      expect(receivedDetail).toEqual({
        currency: defaultPaymentObjectEventDetail.currency,
        paymentIntentId: defaultPaymentObjectEventDetail.paymentIntentId,
        created: defaultPaymentObjectEventDetail.created,
        amount: defaultPaymentObjectEventDetail.amount,
        metadata: defaultPaymentObjectEventDetail.metadata,
        paymentMethodId: defaultPaymentObjectEventDetail.paymentMethodId,
        member: defaultPaymentObjectEventDetail.member,
      });
    });
  });
});
