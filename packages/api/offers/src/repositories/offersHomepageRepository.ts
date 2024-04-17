import { DbHelper } from '@blc-mono/core/src/aws/dynamodb/dbhelper';
import { OfferHomepageKeys } from '../graphql/resolvers/queries/handlers/homepage/types';
import { inject, injectable } from 'tsyringe';
import { DI_KEYS } from '../utils/diTokens';
import { BatchGetCommandOutput, GetCommandOutput } from '@aws-sdk/lib-dynamodb';

export interface IOfferHomepageRepository {
  batchGetByIds(ids: OfferHomepageKeys[]): Promise<BatchGetCommandOutput>;
  getByIdAndType(offerHomepageKeys: OfferHomepageKeys): Promise<GetCommandOutput>;
  save(item: any): Promise<any>;
}

@injectable()
export class OfferHomepageRepository implements IOfferHomepageRepository {
  constructor(@inject(DI_KEYS.OffersHomePageTable) private readonly tableName: string) {
    this.tableName = tableName;
  }

  async batchGetByIds(ids: OfferHomepageKeys[]): Promise<BatchGetCommandOutput> {
    const params = {
      RequestItems: {
        [this.tableName]: {
          Keys: ids,
        },
      },
    };

    return DbHelper.batchGet(params);
  }

  async getByIdAndType(offerHomepageKeys: OfferHomepageKeys): Promise<GetCommandOutput> {
    const params = {
      TableName: this.tableName,
      Key: {
        id: offerHomepageKeys.id,
        type: offerHomepageKeys.type,
      },
    };
    return DbHelper.get(params);
  }

  async save(item: any) {
    const dbParams = {
      TableName: this.tableName,
      Item: item,
    };
    return DbHelper.save(dbParams);
  }
}
