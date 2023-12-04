import { DbHelper } from '../../../core/src/aws/dynamodb/dbhelper';

export class OfferTypeRepository {
  constructor(private readonly tableName: string) {
    this.tableName = tableName;
  }

  async batchGetByIds(offerTypesIds: any[]) {
    const params = {
      RequestItems: {
        [this.tableName]: {
          Keys: offerTypesIds.map((id) => ({ id })),
        },
      },
    };
    return await DbHelper.batchGet(params);
  }

  async batchWrite(putRequests: any[]) {
    const params = {
      RequestItems: {
        [this.tableName]: putRequests,
      },
    };
    return DbHelper.batchWrite(params);
  }

  async getByLegacyId(legacyId: number) {
    const params = {
      TableName: this.tableName,
      IndexName: 'legacyId',
      KeyConditionExpression: 'legacyId = :legacyId',
      ExpressionAttributeValues: {
        ':legacyId': legacyId,
      },
    };
    return DbHelper.query(params);
  }
}
