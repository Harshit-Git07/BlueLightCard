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
import { CARD, cardKey, memberKey } from './repository';
import { NotFoundError } from '../errors/NotFoundError';
import { CardStatus } from '@blc-mono/members/application/models/enums/CardStatus';

export interface UpsertCardOptions {
  memberId: string;
  cardNumber: string;
  card: Partial<CardModel>;
  isInsert?: boolean;
}

export class CardRepository {
  constructor(
    private readonly dynamoDB: DynamoDBDocumentClient = defaultDynamoDbClient,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private readonly tableName: string = Table.memberProfiles.tableName,
  ) {}

  async getCards(memberId: string): Promise<CardModel[]> {
    const queryParams: QueryCommandInput = {
      TableName: this.tableName,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :card)',
      ExpressionAttributeValues: {
        ':pk': memberKey(memberId),
        ':card': CARD,
      },
    };

    const result = await this.dynamoDB.send(new QueryCommand(queryParams));
    if (!result.Items || result.Items.length === 0) {
      return [];
    }

    return result.Items.map((item) => CardModel.parse(item));
  }

  async getCardsWithStatus(cardStatus: CardStatus): Promise<CardModel[]> {
    const params = {
      TableName: this.tableName,
      IndexName: 'CardStatusIndex',
      KeyConditionExpression: 'cardStatus = :cardStatus',
      ExpressionAttributeValues: {
        ':cardStatus': cardStatus,
      },
    };

    const result = await this.dynamoDB.send(new QueryCommand(params));

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

  async getCardById(cardNumber: string): Promise<CardModel> {
    const params: QueryCommandInput = {
      TableName: this.tableName,
      IndexName: 'gsi1',
      KeyConditionExpression: 'sk = :sk',
      ExpressionAttributeValues: {
        ':sk': cardKey(cardNumber),
      },
      Limit: 1,
    };

    const result = await this.dynamoDB.send(new QueryCommand(params));

    if (!result.Items || result.Items.length === 0) {
      throw new NotFoundError('Card not found');
    }

    return CardModel.parse(result.Items[0]);
  }

  async upsertCard({
    memberId,
    cardNumber,
    card,
    isInsert = false,
  }: UpsertCardOptions): Promise<void> {
    const updateExpression: string[] = ['memberId = :memberId', 'cardNumber = :cardNumber'];
    const expressionAttributeValues: Record<string, unknown> = {
      ':memberId': memberId,
      ':cardNumber': cardNumber,
    };

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
        sk: cardKey(cardNumber),
      },
      ConditionExpression: isInsert ? '' : 'pk = :pk AND sk = :sk',
      UpdateExpression: `SET ${updateExpression.join(', ')} `,
      ExpressionAttributeValues: {
        ':pk': memberKey(memberId),
        ':sk': cardKey(cardNumber),
        ...expressionAttributeValues,
      },
    };

    await this.dynamoDB.send(new UpdateCommand(params));
  }
}
