import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

import { PaymentEvent } from '../models/paymentEvent';

export interface IPaymentEventStoreRepository {
  writePaymentEvent(memberId: string, paymentEvent: PaymentEvent): Promise<void>;
  queryPaymentEventsByMemberIdAndEventType(memberId: string, eventType: PaymentEvent['type']): Promise<any>; //TODO: strengthen these types
  queryEventsByTypeAndObjectId(eventType: PaymentEvent['type'], objectId: string): Promise<any>;
}

export class PaymentEventStoreRepository implements IPaymentEventStoreRepository {
  static readonly key = 'PaymentsEventsStoreRepository';
  private tableName: string;
  private dynamodb;

  constructor(
    readonly table: string,
    readonly regionName: string,
  ) {
    this.tableName = table;
    this.dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: regionName }));
  }

  getPaymentEventObjectId(paymentEvent: PaymentEvent): string {
    switch (paymentEvent.type) {
      case 'paymentSucceeded':
        return paymentEvent.paymentIntentId;
      case 'paymentFailed':
        return paymentEvent.paymentIntentId;
      case 'paymentInitiated':
        return paymentEvent.paymentIntentId;
      case 'customerCreated':
        return paymentEvent.externalCustomerId;
    }
  }

  async writePaymentEvent(memberId: string, paymentEvent: PaymentEvent) {
    const item = {
      pk: `MEMBER#${memberId}`,
      sk: `${paymentEvent.type}#${paymentEvent.eventId}`,
      eventType: paymentEvent.type,
      objectId: this.getPaymentEventObjectId(paymentEvent),
      ...paymentEvent,
    };
    const params = {
      TableName: this.tableName,
      Item: item,
    };

    //TODO: error handling
    await this.dynamodb.send(new PutCommand(params));
  }

  async queryEventsByTypeAndObjectId(eventType: PaymentEvent['type'], objectId: string): Promise<any> {
    const params = {
      TableName: this.tableName,
      IndexName: 'gsi1',
      KeyConditionExpression: 'eventType = :eventType AND objectId = :objectId',
      ExpressionAttributeValues: {
        ':eventType': eventType,
        ':objectId': objectId,
      },
      ScanIndexForward: false, // Sort by first written
    };

    //TODO: error handling
    const result = await this.dynamodb.send(new QueryCommand(params));
    return result.Items;
  }

  async queryPaymentEventsByMemberIdAndEventType(memberId: string, eventType: PaymentEvent['type']): Promise<any> {
    const prefix = `${eventType}#`;
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :prefix)',
      ExpressionAttributeValues: {
        ':pk': `MEMBER#${memberId}`,
        ':prefix': prefix,
      },
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk',
      },
      ScanIndexForward: false, // Sort by latest written
    };

    //TODO: error handling
    const result = await this.dynamodb.send(new QueryCommand(params));
    return result.Items;
  }
}
