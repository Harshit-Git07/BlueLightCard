import { DbHelper } from '@blc-mono/core/src/aws/dynamodb/dbhelper';
import { OfferHomepageKeys } from "../graphql/resolvers/queries/handlers/homepage/types";

export class OfferHomepageRepository {
  
  constructor (private readonly tableName: string) {
    this.tableName = tableName;
  }

  async batchGetByIds(ids: OfferHomepageKeys[]) {
    const params = {
      RequestItems: {
        [this.tableName]: {
          Keys: ids
        }
      }
    };
  
    return DbHelper.batchGet(params);
  }

  async getByIdAndType(offerHomepageKeys: OfferHomepageKeys) {
    const params = {
      TableName: this.tableName,
      Key: {
        id:offerHomepageKeys.id,
        type:offerHomepageKeys.type
      }
    };
    return DbHelper.get(params);
  }

  async save(item: any) {
    const dbParams = {
      TableName: this.tableName,
      Item: item
    };
    return DbHelper.save(dbParams);
  }
}