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
}