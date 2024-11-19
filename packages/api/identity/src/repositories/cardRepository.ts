import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, PutCommand, QueryCommandOutput , DeleteCommand} from '@aws-sdk/lib-dynamodb';
import { getCardStatus } from "@blc-mono/core/utils/getCardStatus";
import { setDate } from "@blc-mono/core/utils/setDate";
import { Logger } from '@aws-lambda-powertools/logger';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { IdentityStackEnvironmentKeys } from '@blc-mono/identity/src/utils/identityStackEnvironmentKeys';

const service: string = getEnv(IdentityStackEnvironmentKeys.SERVICE);
const logger = new Logger({ serviceName: `${service}-ICardRepository` });
export interface ICardRepository {
  getUserCurrentCard(uuid: any, legacyCardId: any): Promise<any>;
  updateUsersCard(
    previousCards: QueryCommandOutput, 
    newExpiry: any, 
    newPosted: any,
    uuid: any,
    legacyCardId: any, 
    cardStatus: any): Promise<any>;
}

export class CardRepository implements ICardRepository {
  private tableName: string;
  private dynamodb;

  constructor(readonly table: string, readonly regionName: string) {
    this.tableName = table;
    this.dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: regionName }));
  }

  async getUserCurrentCard(uuid: any, legacyCardId: any){
    const queryParams = {
      TableName: this.tableName,
      KeyConditionExpression: '#pk= :pk And #sk = :sk',
      ExpressionAttributeValues: {
        ':pk': `MEMBER#${uuid}`,
        ':sk': `CARD#${legacyCardId}`,
      },
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk',
      },
    };
    return await this.dynamodb.send(new QueryCommand(queryParams));
  }

  async updateUsersCard(
    previousCards: QueryCommandOutput, 
    newExpiry: any, 
    newPosted: any,
    uuid: any,
    legacyCardId: any, 
    cardStatus: any) {
    let Item: Record<string, string> = {};
    Item = {
      pk: `MEMBER#${uuid}`,
      sk: `CARD#${legacyCardId}`,
      status: getCardStatus(Number(cardStatus)),
    };
  
    if (previousCards.Items !== null && previousCards.Count !== 0) {
      const card = previousCards.Items?.at(0) as Record<string, string>;
      Item['expires'] =
        card.expires === '0000000000000000' || setDate(newExpiry) > card.expires
          ? `${setDate(newExpiry)}`
          : card.expires;
      Item['posted'] = card.posted === '0000000000000000' ? `${setDate(newPosted)}` : card.posted;
    } else {
      Item['expires'] = `${setDate(newExpiry)}`;
      Item['posted'] = `${setDate(newPosted)}`;
    }
    const cardParams = {
      Item,
      TableName: this.tableName,
    };
    return await this.dynamodb.send(new PutCommand(cardParams));
  }

  async deleteCard(uuid: any, legacyCardId: any) {
    const params = {
      TableName: this.tableName,
      Key: {
        pk: `MEMBER#${uuid}`,
        sk: `CARD#${legacyCardId}`,
      },
    };
    try {
      const command = new DeleteCommand(params);
      const data = await this.dynamodb.send(command);
      logger.info('Deleted card:', { data });
    } catch (error) {
      logger.error('Unable to delete card. Error:', { error });
    }
  }

  async createCard(uuid: any, legacyCardId: any,  expiry: any, cardStatus: any) {
    const now = new Date();
    const params = {
      TableName: this.tableName,
      Item: {
        pk: `MEMBER#${uuid}`,
        sk: `CARD#${legacyCardId}`,
        expires: `${setDate(expiry)}`,
        posted: `${setDate(now)}`,
        status: cardStatus
      },
    };
    try {
      const command = new PutCommand(params);
      const data = await this.dynamodb.send(command);
      logger.info('Created card:', { data });
    } catch (error) {
      logger.error('Unable to create card. Error:', { error });
    }
  }
}
