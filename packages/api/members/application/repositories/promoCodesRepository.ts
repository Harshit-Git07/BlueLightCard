import {
  DynamoDBDocumentClient,
  NativeAttributeValue,
  QueryCommand,
  QueryCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { PromoCodeModel } from '@blc-mono/members/application/models/promoCodeModel';
import { AttributeValue } from '@aws-sdk/client-dynamodb';

export class PromoCodesRepository {
  private readonly dynamoDB: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor(dynamoDB: DynamoDBDocumentClient, tableName: string) {
    this.dynamoDB = dynamoDB;
    this.tableName = tableName;
  }

  async getMultiUseOrSingleUseChildPromoCode(promoCode: string): Promise<PromoCodeModel[] | null> {
    const params = {
      TableName: this.tableName,
      IndexName: 'gsi2',
      KeyConditionExpression: 'code = :code',
      FilterExpression: 'sk = :multiCodeSk OR begins_with(sk, :singleCodeChildSk)',
      ExpressionAttributeValues: {
        ':code': promoCode,
        ':multiCodeSk': 'MULTI_USE',
        ':singleCodeChildSk': 'SINGLE_USE#',
      },
    };

    const queryResult = await this.dynamoDB.send(new QueryCommand(params));

    return this.getValidatedResultAsModel(queryResult);
  }

  async getSingleUseParentPromoCode(promoCodePkUuid: string): Promise<PromoCodeModel[] | null> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'pk = :pk AND sk = :singleCodeParentSk',
      ExpressionAttributeValues: {
        ':pk': `PROMO_CODE#${promoCodePkUuid}`,
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
