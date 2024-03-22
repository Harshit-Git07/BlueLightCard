import { DbHelper } from '../../../core/src/aws/dynamodb/dbhelper';

export class RecommendedCompaniesRepository {
  constructor(private readonly tableName: string) {}
  async getById(memberId: string) {
    const params = {
      TableName: this.tableName,
      Key: {
        member_id: memberId,
      },
    };
    return await DbHelper.get(params);
  }
}
