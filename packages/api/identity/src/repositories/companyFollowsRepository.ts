import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { getEnv, getEnvOrDefault } from '../../../core/src/utils/getEnv';

export interface ICompanyFollowsRepository {
  deleteCompanyFollows(uuid: string, companyId: string): Promise<any>;
  updateCompanyFollows(uuid: string, companyId: string, likeType: string): Promise<any>;
}

export class CompanyFollowsRepository implements ICompanyFollowsRepository {
  private tableName: string = getEnv('IDENTITY_TABLE_NAME');
  private dynamodb: DynamoDBDocumentClient = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: getEnvOrDefault('REGION', 'eu-west-2') }),
  );

  public async updateCompanyFollows(uuid: string, companyId: string, likeType: string) {
    const putParams = {
      Item: {
        pk: `MEMBER#${uuid}`,
        sk: `COMPANYFOLLOWS#${companyId}`,
        likeType: likeType,
      },
      TableName: this.tableName,
    };

    return await this.dynamodb.send(new PutCommand(putParams));
  }

  public async deleteCompanyFollows(uuid: string, companyId: string) {
    const deleteParams = {
      Key: {
        pk: `MEMBER#${uuid}`,
        sk: `COMPANYFOLLOWS#${companyId}`,
      },
      TableName: this.tableName,
    };

    return await this.dynamodb.send(new DeleteCommand(deleteParams));
  }
}
