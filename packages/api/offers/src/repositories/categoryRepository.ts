import { DbHelper } from '../../../core/src/aws/dynamodb/dbhelper';

export class CategoryRepository {
  constructor(private readonly tableName: string) {
    this.tableName = tableName;
  }

  async batchGetByIds(categoryIds: any[]) {
    const params = {
      RequestItems: {
        [this.tableName]: {
          Keys: categoryIds.map((id) => ({ id })),
        },
      },
    };
    return await DbHelper.batchGet(params);
  }

  async getById(categoryId: string) {
    const params = {
      TableName: this.tableName,
      Key: {
        id: categoryId,
      },
    };
    return await DbHelper.get(params);
  }

  async getByLegacyId(legacyId: string) {
    const params = {
      TableName: this.tableName,
      IndexName: 'legacyId',
      KeyConditionExpression: 'legacyId = :legacyId',
      ExpressionAttributeValues: {
        ':legacyId': legacyId,
      },
    };
    return await DbHelper.query(params);
  }

  async getByLegacyIdAndType(legacyId: string, categoryType: string) {
    const params = {
      TableName: this.tableName,
      IndexName: 'legacyId',
      KeyConditionExpression: 'legacyId = :legacyId',
      FilterExpression: '#categoryType = :categoryType',
      ExpressionAttributeNames: {
        '#categoryType': 'type',
      },
      ExpressionAttributeValues: {
        ':legacyId': legacyId,
        ':categoryType': categoryType,
      },
    };
    return await DbHelper.query(params);
  }

  async save(item: any) {
    const params = {
      TableName: this.tableName,
      Item: item
    };

    return DbHelper.save(params);
  }
}
