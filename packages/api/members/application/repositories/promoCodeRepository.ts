import { DynamoDBDocumentClient, QueryCommand, QueryCommandOutput } from '@aws-sdk/lib-dynamodb';
import { PromoCodeModel } from '@blc-mono/members/application/models/promoCodeModel';
import { defaultDynamoDbClient } from './dynamoClient';
import { Table } from 'sst/node/table';

export class PromoCodeRepository {
  constructor(
    private readonly dynamoDB: DynamoDBDocumentClient = defaultDynamoDbClient,
    // @ts-ignore
    private readonly tableName: string = Table.memberProfiles.tableName,
  ) {}

  async getMultiUseOrSingleUseChildPromoCode(
    promoCodeId: string,
  ): Promise<PromoCodeModel[] | null> {
    const params = {
      TableName: this.tableName,
      IndexName: 'PromoCodeIndex',
      KeyConditionExpression: 'code = :code',
      FilterExpression: 'sk = :multiCodeSk OR begins_with(sk, :singleCodeChildSk)',
      ExpressionAttributeValues: {
        ':code': promoCodeId,
        ':multiCodeSk': 'MULTI_USE',
        ':singleCodeChildSk': 'SINGLE_USE#',
      },
    };

    const queryResult = await this.dynamoDB.send(new QueryCommand(params));

    return this.getValidatedResultAsModel(queryResult);
  }

  async getSingleUseParentPromoCode(promoCodeId: string): Promise<PromoCodeModel[] | null> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'pk = :pk AND sk = :singleCodeParentSk',
      ExpressionAttributeValues: {
        ':pk': `PROMO_CODE#${promoCodeId}`,
        ':singleCodeParentSk': 'SINGLE_USE',
      },
    };

    const queryResult = await this.dynamoDB.send(new QueryCommand(params));

    return this.getValidatedResultAsModel(queryResult);
  }

  private async getValidatedResultAsModel(
    queryResult: QueryCommandOutput,
  ): Promise<PromoCodeModel[] | null> {
    if (!queryResult.Items || queryResult.Items.length === 0) {
      return null;
    }

    return queryResult.Items.map((item) => {
      return PromoCodeModel.parse(item);
    });
  }
}
