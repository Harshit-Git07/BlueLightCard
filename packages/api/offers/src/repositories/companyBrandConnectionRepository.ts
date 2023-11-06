import { DbHelper } from '../../../core/src/aws/dynamodb/dbhelper'

export class CompanyBrandConnectionRepository{

  constructor (private readonly tableName: string) {
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

  async getByBrandId(brandId: string) {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'brandId = :brandId',
      ExpressionAttributeValues: {
        ':brandId': brandId,
      },
    };
    return await DbHelper.query(params);
  }
}
