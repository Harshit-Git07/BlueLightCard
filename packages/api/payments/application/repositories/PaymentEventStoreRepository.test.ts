import 'aws-sdk-client-mock-jest';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';

import { PaymentEvent } from '../models/paymentEvent';

import { PaymentEventStoreRepository } from './PaymentEventStoreRepository';

// Mock both DynamoDB clients
const ddbMock = mockClient(DynamoDBDocumentClient);
const ddbClientMock = mockClient(DynamoDBClient);

describe('PaymentEventStoreRepository', () => {
  const tableName = 'test-table';
  let repository: PaymentEventStoreRepository;

  beforeEach(() => {
    ddbMock.reset();
    ddbClientMock.reset();
    repository = new PaymentEventStoreRepository(tableName, 'us-east-1');
  });

  jest.spyOn(DynamoDBDocumentClient, 'from').mockImplementation(() => ddbMock as unknown as DynamoDBDocumentClient);

  describe('writePaymentEvent', () => {
    it('should write a payment event to DynamoDB', async () => {
      // Arrange
      const memberId = 'member123';
      const paymentEvent: PaymentEvent = {
        eventId: 'evt123',
        type: 'paymentSucceeded',
        paymentIntentId: 'pi123',
        created: 1719000000,
        metadata: {},
        amount: 100,
        currency: 'gbp',
      };

      ddbMock.on(PutCommand).resolves({});

      // Act
      await repository.writePaymentEvent(memberId, paymentEvent);

      // Assert
      expect(ddbMock).toHaveReceivedCommandWith(PutCommand, {
        TableName: tableName,
        Item: {
          pk: `MEMBER#${memberId}`,
          sk: `${paymentEvent.type}#${paymentEvent.eventId}`,
          eventType: paymentEvent.type,
          objectId: paymentEvent.paymentIntentId,
          ...paymentEvent,
        },
      });
    });
  });

  describe('queryEventsByTypeAndObjectId', () => {
    it('should query events by type and objectId', async () => {
      // Arrange
      const mockItems = [
        {
          pk: 'MEMBER#123',
          sk: 'paymentSucceeded#evt1',
          eventId: 'evt1',
          type: 'paymentSucceeded',
          paymentIntentId: 'pi123',
          created: 1719000000,
          metadata: {},
          amount: 100,
          currency: 'gbp',
        },
      ];
      ddbMock.on(QueryCommand).resolves({ Items: mockItems });

      // Act
      const result = await repository.queryEventsByTypeAndObjectId('paymentSucceeded', 'pi123');

      // Assert
      expect(ddbMock).toHaveReceivedCommandWith(QueryCommand, {
        TableName: tableName,
        IndexName: 'gsi1',
        KeyConditionExpression: 'eventType = :eventType AND objectId = :objectId',
        ExpressionAttributeValues: {
          ':eventType': 'paymentSucceeded',
          ':objectId': 'pi123',
        },
        ScanIndexForward: false,
      });
      expect(result).toEqual(mockItems);
    });

    it('should return empty array when no items found', async () => {
      // Arrange
      ddbMock.on(QueryCommand).resolves({ Items: undefined });

      // Act
      const result = await repository.queryEventsByTypeAndObjectId('paymentSucceeded', 'pi123');

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('queryPaymentEventsByMemberIdAndEventType', () => {
    it('should query events by memberId and eventType', async () => {
      // Arrange
      const mockItems = [
        {
          pk: 'MEMBER#123',
          sk: 'paymentSucceeded#evt1',
          eventId: 'evt1',
          type: 'paymentSucceeded',
          paymentIntentId: 'pi123',
          created: 1719000000,
          metadata: {},
          amount: 100,
          currency: 'gbp',
        },
      ];
      ddbMock.on(QueryCommand).resolves({ Items: mockItems });

      // Act
      const result = await repository.queryPaymentEventsByMemberIdAndEventType('123', 'paymentSucceeded');

      // Assert
      expect(ddbMock).toHaveReceivedCommandWith(QueryCommand, {
        TableName: tableName,
        KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :prefix)',
        ExpressionAttributeValues: {
          ':pk': 'MEMBER#123',
          ':prefix': 'paymentSucceeded#',
        },
        ExpressionAttributeNames: {
          '#pk': 'pk',
          '#sk': 'sk',
        },
        ScanIndexForward: false,
      });
      expect(result).toEqual(mockItems);
    });

    it('should return empty array when no items found', async () => {
      // Arrange
      ddbMock.on(QueryCommand).resolves({ Items: undefined });

      // Act
      const result = await repository.queryPaymentEventsByMemberIdAndEventType('123', 'paymentSucceeded');

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('queryPaymentEventsByMemberId', () => {
    it('should query all events by memberId', async () => {
      // Arrange
      const memberId = 'test-member-id';
      const mockItems = [
        {
          pk: `MEMBER#${memberId}`,
          sk: 'paymentSucceeded#event1',
          eventId: 'event1',
          type: 'paymentSucceeded',
          paymentIntentId: 'pi_123',
          created: 1719000000,
          metadata: {},
          amount: 100,
          currency: 'gbp',
        },
        {
          pk: `MEMBER#${memberId}`,
          sk: 'customerCreated#event2',
          eventId: 'event2',
          type: 'customerCreated',
          externalCustomerId: 'cus_123',
          created: 1719000000,
          metadata: {},
          amount: 100,
          currency: 'gbp',
        },
      ];
      ddbMock.on(QueryCommand).resolves({
        Items: mockItems,
        Count: 2,
      });

      // Act
      const result = await repository.queryPaymentEventsByMemberId(memberId);

      // Assert
      expect(ddbMock).toHaveReceivedCommandWith(QueryCommand, {
        TableName: tableName,
        KeyConditionExpression: '#pk = :pk',
        ExpressionAttributeValues: {
          ':pk': `MEMBER#${memberId}`,
        },
        ExpressionAttributeNames: {
          '#pk': 'pk',
        },
        ScanIndexForward: true,
      });
      expect(result).toEqual(mockItems);
    });

    it('should return empty array when no items found', async () => {
      // Arrange
      ddbMock.on(QueryCommand).resolves({ Items: undefined });

      // Act
      const result = await repository.queryPaymentEventsByMemberId('123');

      // Assert
      expect(result).toEqual([]);
    });
  });
});
