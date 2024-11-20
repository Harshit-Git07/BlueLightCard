import {
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  PutCommand,
  QueryCommand,
  ScanCommandInput,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { ApplicationModel } from '../models/applicationModel';
import { defaultDynamoDbClient } from './dynamoClient';
import { Table } from 'sst/node/table';
import { APPLICATION, applicationKey, MEMBER, memberKey } from './repository';
import { ScanCommand } from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError } from '../errors/NotFoundError';

export interface UpsertApplicationOptions {
  memberId: string;
  applicationId?: string;
  application: Partial<ApplicationModel>;
  isInsert?: boolean;
}

export class ApplicationRepository {
  constructor(
    private readonly dynamoDB: DynamoDBDocumentClient = defaultDynamoDbClient,
    // @ts-ignore
    private readonly tableName: string = Table.memberProfiles.tableName,
  ) {}

  async upsertApplication({
    memberId,
    applicationId = uuidv4(),
    application,
    isInsert = false,
  }: UpsertApplicationOptions): Promise<string> {
    const updateExpression: string[] = ['memberId = :memberId', 'applicationId = :applicationId'];
    const expressionAttributeValues: { [key: string]: any } = {
      ':memberId': memberId,
      ':applicationId': memberId,
    };

    for (const field of Object.keys(application) as (keyof ApplicationModel)[]) {
      if (application[field] !== undefined) {
        updateExpression.push(`${field} = :${field}`);
        expressionAttributeValues[`:${field}`] = application[field];
      }
    }

    const params = {
      TableName: this.tableName,
      Key: {
        pk: memberKey(memberId),
        sk: applicationKey(applicationId),
      },
      ConditionExpression: isInsert ? 'pk <> :pk OR sk <> :sk' : 'pk = :pk AND sk = :sk',
      UpdateExpression: `SET ${[...new Set(updateExpression)].join(', ')} `,
      ExpressionAttributeValues: {
        ':pk': memberKey(memberId),
        ':sk': applicationKey(applicationId),
        ...expressionAttributeValues,
      },
    };

    await this.dynamoDB.send(new UpdateCommand(params));

    return applicationId;
  }

  // This is temporary until we have OpenSearch in place
  async getAllApplications(): Promise<ApplicationModel[]> {
    const params: ScanCommandInput = {
      TableName: this.tableName,
      FilterExpression: 'begins_with(pk, :member) AND begins_with(sk, :application)',
      ExpressionAttributeValues: {
        ':member': MEMBER,
        ':application': APPLICATION,
      },
      Limit: 100,
    };

    const result = await this.dynamoDB.send(new ScanCommand(params));

    if (!result.Items || result.Items.length === 0) {
      return [];
    }

    return result.Items.map((item) => ApplicationModel.parse(item));
  }

  async getApplications(memberId: string): Promise<ApplicationModel[]> {
    const queryParams = {
      TableName: this.tableName,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
      ExpressionAttributeValues: {
        ':pk': memberKey(memberId),
        ':sk': APPLICATION,
      },
    };
    const result = await this.dynamoDB.send(new QueryCommand(queryParams));

    if (!result.Items || result.Items.length === 0) {
      return [];
    }

    return result.Items.map((employer) => ApplicationModel.parse(employer));
  }

  async getApplication(memberId: string, applicationId: string): Promise<ApplicationModel> {
    const params: GetCommandInput = {
      TableName: this.tableName,
      Key: {
        pk: memberKey(memberId),
        sk: applicationKey(applicationId),
      },
    };

    const result = await this.dynamoDB.send(new GetCommand(params));

    if (!result.Item) {
      throw new NotFoundError('Application not found');
    }

    return ApplicationModel.parse(result.Item);
  }
}
