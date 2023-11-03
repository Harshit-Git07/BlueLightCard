import { DbHelper } from '../../../core/src/aws/dynamodb/dbhelper';

export class CompanyCategoryConnectionRepository {
  constructor(private readonly tableName: string) {
    this.tableName = tableName;
  }

  async getByCompanyId(companyId: string) {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'companyId = :companyId',
      IndexName: 'companyId',
      ExpressionAttributeValues: {
        ':companyId': companyId,
      },
    };

    return await DbHelper.query(params);
  }
}
