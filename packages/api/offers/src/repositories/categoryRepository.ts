import { DbHelper } from '../../../core/src/aws/dynamodb/dbhelper'

export class CategoryRepository {

    constructor (private readonly tableName: string) {
      this.tableName = tableName;
    }
    async batchGetByIds(categoryIds: any[]) {
      const params = {
      RequestItems: {
          [this.tableName]: {
            Keys: categoryIds.map((id) => ({ id })),
          },
        },
      };
      return await DbHelper.batchGet(params);
    }

}
