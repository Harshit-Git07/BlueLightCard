import { DbHelper } from '../../../core/src/aws/dynamodb/dbhelper';

export class TransactRepository {
  async transactWrite(items: any[]) {
    const params = {
      TransactItems: items,
    };
    return DbHelper.transactionalWrite(params);
  }
}
