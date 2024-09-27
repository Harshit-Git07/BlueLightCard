import { DynamoDB } from 'aws-sdk';
import { MemberCardModel } from '../models/memberCardModel';

import { MemberCardUpdatePayload, MemberCardQueryPayload } from '../types/memberCardTypes';

export class MemberCardRepository {
  private dynamoDB: DynamoDB.DocumentClient;
  private tableName: string;

  constructor(dynamoDB: DynamoDB.DocumentClient, tableName: string) {
    this.dynamoDB = dynamoDB;
    this.tableName = tableName;
  }

  async getMemberCards(query: MemberCardQueryPayload): Promise<MemberCardModel[] | null> {
    const queryParams: DynamoDB.DocumentClient.QueryInput = {
      TableName: this.tableName,
      KeyConditionExpression: '#pk = :pk',
      ExpressionAttributeNames: {
        '#pk': 'pk',
      },
      ExpressionAttributeValues: {
        ':pk': `MEMBER#${query.uuid}`,
      },
    };

    if (query.cardNumber) {
      queryParams.KeyConditionExpression += ' AND #sk = :sk';
      queryParams.ExpressionAttributeNames!['#sk'] = 'sk';
      queryParams.ExpressionAttributeValues![':sk'] = `CARD#${query.cardNumber}`;
    }

    const queryResult = await this.dynamoDB.query(queryParams).promise();

    if (!queryResult.Items || queryResult.Items.length === 0) {
      return null;
    }

    // Parse each item against the Zod schema
    const validatedItems = queryResult.Items.map((item) => MemberCardModel.parse(item));

    return validatedItems;
  }

  async updateMemberCard(
    query: MemberCardQueryPayload,
    payload: MemberCardUpdatePayload,
    isUpsert: boolean = false,
  ): Promise<void> {
    MemberCardModel.parse({
      pk: `MEMBER#${query.uuid}`,
      sk: `CARD#${query.cardNumber}`,
      ...payload,
    });

    const updateExpression = [];
    const expressionAttributeValues: { [key: string]: any } = {};

    if (payload.name_on_card !== undefined) {
      updateExpression.push('name_on_card = :name_on_card');
      expressionAttributeValues[':name_on_card'] = payload.name_on_card;
    }
    if (payload.card_status !== undefined) {
      updateExpression.push('card_status = :card_status');
      expressionAttributeValues[':card_status'] = payload.card_status;
    }
    if (payload.expiry_date !== undefined) {
      updateExpression.push('expiry_date = :expiry_date');
      expressionAttributeValues[':expiry_date'] = payload.expiry_date;
    }
    if (payload.posted_date !== undefined) {
      updateExpression.push('posted_date = :posted_date');
      expressionAttributeValues[':posted_date'] = payload.posted_date;
    }
    if (payload.purchase_time !== undefined) {
      updateExpression.push('purchase_time = :purchase_time');
      expressionAttributeValues[':purchase_time'] = payload.purchase_time;
    }
    if (payload.payment_status !== undefined) {
      updateExpression.push('payment_status = :payment_status');
      expressionAttributeValues[':payment_status'] = payload.payment_status;
    }
    if (payload.batch_number !== undefined) {
      updateExpression.push('batch_number = :batch_number');
      expressionAttributeValues[':batch_number'] = payload.batch_number;
    }

    const updateParams = {
      TableName: this.tableName,
      Key: {
        pk: `MEMBER#${query.uuid}`,
        sk: `CARD#${query.cardNumber}`,
      },
      UpdateExpression: `SET ${updateExpression.join(', ')} `,
      ConditionExpression: isUpsert ? '' : 'pk = :pk AND sk = :sk',
      ExpressionAttributeValues: {
        ...expressionAttributeValues,
        ':pk': `MEMBER#${query.uuid}`,
        ':sk': `CARD#${query.cardNumber}`,
      },
    };

    await this.dynamoDB.update(updateParams).promise();
  }
}
