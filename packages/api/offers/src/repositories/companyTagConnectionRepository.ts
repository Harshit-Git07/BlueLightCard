import { DbHelper } from '../../../core/src/aws/dynamodb/dbhelper';

export class CompanyTagConnectionRepository {
  constructor(private readonly tableName: string) {
    this.tableName = tableName;
  }

  async getByCompanyId(companyId: string) {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'companyId = :companyId',
      ExpressionAttributeValues: {
        ':companyId': companyId,
      },
    };

    return await DbHelper.query(params);
  }
}
