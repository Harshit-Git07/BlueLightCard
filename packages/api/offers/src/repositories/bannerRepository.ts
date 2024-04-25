import { DbHelper } from '../../../core/src/aws/dynamodb/dbhelper';
import { inject, injectable } from 'tsyringe';
import { DI_KEYS } from '../../src/utils/diTokens';
import { QueryCommandOutput } from '@aws-sdk/lib-dynamodb';

export interface IBannerRepository {
  getBannersByBrandIdAndType(brandId: string, type: string, limit: number): Promise<QueryCommandOutput>;
  getByBrandIdAndTypeAndIsAgeGated(brandId: string, type: string, isAgeGated: boolean): Promise<QueryCommandOutput>;
}

@injectable()
export class BannerRepository implements IBannerRepository {
  constructor(@inject(DI_KEYS.BannersTable) private readonly tableName: string) {}

  async getBannersByBrandIdAndType(brandId: string, type: string, limit: number = 10): Promise<QueryCommandOutput> {
    const currentTime = Math.floor(Date.now() / 1000);
    const status = true;
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: '#type = :type AND expiresAt >= :currTime',
      FilterExpression: 'brand = :brand AND startsAt <= :currTime AND #status = :status',
      IndexName: 'type',
      ExpressionAttributeValues: {
        ':brand': brandId,
        ':type': type,
        ':currTime': currentTime,
        ':status': status,
      },
      ExpressionAttributeNames: {
        '#type': 'type',
        '#status': 'status',
      },

      Limit: limit,
    };
    return await DbHelper.query(params);
  }

  async getByBrandIdAndTypeAndIsAgeGated(
    brandId: string,
    type: string,
    isAgeGated: boolean,
  ): Promise<QueryCommandOutput> {
    const currentTime = Math.floor(Date.now() / 1000);
    const status = true;

    try {
      const params = {
        TableName: this.tableName,
        KeyConditionExpression: '#type = :type AND expiresAt >= :currTime',
        FilterExpression: 'brand = :brand AND isAgeGated = :isAgeGated AND startsAt <= :currTime AND #status = :status',
        IndexName: 'type',
        ExpressionAttributeValues: {
          ':brand': brandId,
          ':isAgeGated': isAgeGated,
          ':type': type,
          ':currTime': currentTime,
          ':status': status,
        },
        ExpressionAttributeNames: {
          '#type': 'type',
          '#status': 'status',
        },
        ProjectionExpression: 'link, imageSource, legacyCompanyId',
      };

      return await DbHelper.query(params);
    } catch (error: any) {
      return error;
    }
  }
}
