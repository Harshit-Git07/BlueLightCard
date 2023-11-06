import { DbHelper } from '../../../core/src/aws/dynamodb/dbhelper'

export class CompanyRepository {

  constructor (private readonly tableName: string) {}

  async batchGetByIds(ids: string[]) {
    const params = {
      RequestItems: {
        [this.tableName]: {
          Keys: ids.map((id) => ({ id })),
        }
      }
    };

    return DbHelper.batchGet(params);
  }
}
