import { DbHelper } from '../../../core/src/aws/dynamodb/dbhelper';
import { Tag } from '../models/tag';

export class TagRepository {

  constructor(private readonly tableName: string) {}

  async getById(tagId: string) {
    const params = {
      TableName: this.tableName,
      Key: {
        id: tagId,
      },
    };
    return await DbHelper.get(params);
  }

  async getByName(tagName: string) {
    const params = {
      TableName: this.tableName,
      IndexName: 'name',
      KeyConditionExpression: '#name = :name',
      ExpressionAttributeNames: {
        '#name': 'name',
      },
      ExpressionAttributeValues: {
        ':name': tagName,
      },
    };
    return await DbHelper.query(params);
  }

  async save(item: any) {
    const params = {
      TableName: this.tableName,
      Item: item
    };
    return DbHelper.save(params);
  }

  async batchWrite(tags: Tag[]) {
    const params = {
      RequestItems: {
        [this.tableName]: [
          ...tags.map((tag) => ({
            PutRequest: {
              Item: tag
            }
          }))
        ],
      }
    };
    return DbHelper.batchWrite(params);
  }
}