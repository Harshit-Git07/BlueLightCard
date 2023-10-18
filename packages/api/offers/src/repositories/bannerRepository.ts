import { DbHelper } from '../../../core/src/aws/dynamodb/dbhelper'

export class BannerRepository {

  constructor (private readonly tableName: string) {
    this.tableName = tableName;
  }

  async getBannersByBrandIdAndType(brandId: string, type: string, limit: number = 10) {
    const currentTime = Math.floor( Date.now() / 1000 );
    const status = true;

    const params = {
      TableName: this.tableName,
      KeyConditionExpression: '#type = :type AND expiresAt >= :currTime',
      FilterExpression: "brand = :brand AND startsAt <= :currTime AND #status = :status",
      IndexName: 'type',
      ExpressionAttributeValues: {
        ':brand': brandId,
        ':type': type,
        ':currTime': currentTime,
        ':status': status
      },
      ExpressionAttributeNames: {
        '#type': 'type',
        '#status': 'status'
      },
      Limit: limit
    };

    return await DbHelper.query(params);
  }
}
