import {
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  QueryCommand,
  QueryCommandInput,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { CardModel } from '../models/cardModel';
import { defaultDynamoDbClient } from './dynamoClient';
import { Table } from 'sst/node/table';
import { cardKey, memberKey } from './repository';
import { NotFoundError } from '../errors/NotFoundError';

export interface UpsertCardOptions {
  memberId: string;
  card: CardModel;
  isInsert?: boolean;
}

export class CardRepository {
  constructor(
    private readonly dynamoDB: DynamoDBDocumentClient = defaultDynamoDbClient,
    // @ts-ignore
    private readonly tableName: string = Table.memberProfiles.tableName,
  ) {}

  async getCards(memberId: string): Promise<CardModel[]> {
    const queryParams: QueryCommandInput = {
      TableName: this.tableName,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': memberKey(memberId),
      },
    };

    const result = await this.dynamoDB.send(new QueryCommand(queryParams));
    if (!result.Items || result.Items.length === 0) {
      return [];
    }

    return result.Items.map((item) => CardModel.parse(item));
  }

  async getCard(memberId: string, cardNumber: string): Promise<CardModel> {
    const params: GetCommandInput = {
      TableName: this.tableName,
      Key: {
        pk: memberKey(memberId),
        sk: cardKey(cardNumber),
      },
    };

    const result = await this.dynamoDB.send(new GetCommand(params));
    if (!result.Item) {
      throw new NotFoundError('Card not found');
    }

    return CardModel.parse(result.Item);
  }

  async upsertCard({ memberId, card, isInsert = false }: UpsertCardOptions): Promise<void> {
    const updateExpression: string[] = [];
    const expressionAttributeValues: { [key: string]: any } = {};

    for (const field of Object.keys(card) as (keyof CardModel)[]) {
      if (card[field] !== undefined) {
        updateExpression.push(`${field} = :${field}`);
        expressionAttributeValues[`:${field}`] = card[field];
      }
    }

    const params = {
      TableName: this.tableName,
      Key: {
        pk: memberKey(memberId),
        sk: cardKey(card.cardNumber),
      },
      ConditionExpression: isInsert ? '' : 'pk = :pk AND sk = :sk',
      UpdateExpression: `SET ${updateExpression.join(', ')} `,
      ExpressionAttributeValues: {
        ':pk': memberKey(memberId),
        ':sk': cardKey(card.cardNumber),
        ...expressionAttributeValues,
      },
    };

    await this.dynamoDB.send(new UpdateCommand(params));
  }
}
