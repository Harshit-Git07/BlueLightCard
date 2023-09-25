import { DbHelper } from '../../../core/src/aws/dynamodb/dbhelper'

export class OfferCategoryConnectionRepository {

  constructor (private readonly tableName: string) {
    this.tableName = tableName;
  }

  async getByOfferId(offerId: string) {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'offerId = :offerId',
      IndexName: 'offerId',
      ExpressionAttributeValues: {
        ':offerId': offerId,
      },
    };

    return await DbHelper.query(params);
  }




}
