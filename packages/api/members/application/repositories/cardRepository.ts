import {
  GetCommand,
  GetCommandInput,
  QueryCommand,
  QueryCommandInput,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import {
  AwaitingBatchingCardModel,
  BatchedCardModel,
  CardModel,
} from '@blc-mono/shared/models/members/cardModel';
import {
  CARD,
  cardKey,
  memberKey,
  Repository,
} from '@blc-mono/members/application/repositories/base/repository';
import { NotFoundError } from '@blc-mono/members/application/errors/NotFoundError';
import { CardStatus } from '@blc-mono/shared/models/members/enums/CardStatus';
import { defaultDynamoDbClient } from '@blc-mono/members/application/providers/DynamoDb';
import { memberProfilesTableName } from '@blc-mono/members/application/providers/Tables';

export interface UpsertCardOptions {
  memberId: string;
  cardNumber: string;
  card: Partial<CardModel>;
  isInsert?: boolean;
}

export class CardRepository extends Repository {
  constructor(dynamoDB = defaultDynamoDbClient) {
    super(dynamoDB);
  }

  async getCards(memberId: string): Promise<CardModel[]> {
    const queryParams: QueryCommandInput = {
      TableName: memberProfilesTableName(),
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

  async getCardsInBatch(batchNumber: string): Promise<BatchedCardModel[]> {
    const queryParams: QueryCommandInput = {
      TableName: memberProfilesTableName(),
      KeyConditionExpression: 'begins_with(sk, :card) AND :batchNumber = batchNumber',
      ExpressionAttributeValues: {
        ':card': CARD,
        ':batchNumber': batchNumber,
      },
    };

    const result = await this.dynamoDB.send(new QueryCommand(queryParams));

    return result.Items?.map((item) => BatchedCardModel.parse(item)) ?? [];
  }

  async getCardsAwaitingBatching(): Promise<AwaitingBatchingCardModel[]> {
    const params = {
      TableName: memberProfilesTableName(),
      IndexName: 'CardStatusIndex',
      KeyConditionExpression: 'cardStatus = :cardStatus',
      ExpressionAttributeValues: {
        ':cardStatus': CardStatus.AWAITING_BATCHING,
      },
    };

    const result = await this.dynamoDB.send(new QueryCommand(params));

    return result.Items?.map((item) => AwaitingBatchingCardModel.parse(item)) ?? [];
  }

  async getCardsWithStatus(cardStatus: CardStatus): Promise<CardModel[]> {
    const params = {
      TableName: memberProfilesTableName(),
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
      TableName: memberProfilesTableName(),
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
      TableName: memberProfilesTableName(),
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
    const updateExpression: string[] = [];
    const expressionAttributeValues: Record<string, unknown> = {};

    for (const field of Object.keys(card) as (keyof CardModel)[]) {
      if (card[field] !== undefined) {
        updateExpression.push(`${field} = :${field}`);
        expressionAttributeValues[`:${field}`] = card[field];
      }
    }

    updateExpression.push('lastUpdated = :lastUpdated');
    expressionAttributeValues[':lastUpdated'] = new Date().toISOString();

    const params = {
      TableName: memberProfilesTableName(),
      Key: {
        pk: memberKey(memberId),
        sk: cardKey(cardNumber),
      },
      UpdateExpression: `SET ${updateExpression.join(', ')} `,
      ConditionExpression: isInsert
        ? 'attribute_not_exists(pk) AND attribute_not_exists(sk)'
        : 'pk = :pk AND sk = :sk',
      ExpressionAttributeValues: isInsert
        ? { ...expressionAttributeValues }
        : {
            ':pk': memberKey(memberId),
            ':sk': cardKey(cardNumber),
            ...expressionAttributeValues,
          },
    };

    await this.dynamoDB.send(new UpdateCommand(params));
  }
}
