import { DbHelper } from '../../../core/src/aws/dynamodb/dbhelper'

export class BrandRepository {
  constructor (private readonly tableName: string) {
    this.tableName = tableName;
  }
  async batchGetByIds(brandIds: any[]) {
    const params = {
      RequestItems: {
        [this.tableName]: {
          Keys: brandIds.map((id) => ({ id })),
        },
      },
    };
    return await DbHelper.batchGet(params);
  }

}
