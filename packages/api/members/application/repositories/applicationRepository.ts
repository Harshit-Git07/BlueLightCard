import {
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  PutCommand,
  QueryCommand,
  QueryCommandInput,
  ScanCommand,
  ScanCommandInput,
  TransactWriteCommand,
  UpdateCommand,
  UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { ApplicationModel, CreateApplicationModel } from '../models/applicationModel';
import { defaultDynamoDbClient } from './dynamoClient';
import { Table } from 'sst/node/table';
import { APPLICATION, applicationKey, MEMBER, memberKey, Repository } from './repository';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError } from '../errors/NotFoundError';
import { EligibilityStatus } from '../models/enums/EligibilityStatus';

export class ApplicationRepository extends Repository {
  constructor(
    dynamoDB: DynamoDBDocumentClient = defaultDynamoDbClient,
    // @ts-ignore
    private readonly tableName: string = Table.memberProfiles.tableName,
  ) {
    super(dynamoDB);
  }

  async createApplication(memberId: string, application: CreateApplicationModel): Promise<string> {
    const applicationId = uuidv4();
    const params = {
      TableName: this.tableName,
      Item: {
        pk: memberKey(memberId),
        sk: applicationKey(applicationId),
        memberId,
        applicationId,
        ...application,
        lastUpdated: new Date().toISOString(),
      },
    };
    await this.dynamoDB.send(new PutCommand(params));

    return applicationId;
  }

  async updateApplication(
    memberId: string,
    applicationId: string,
    application: Partial<ApplicationModel>,
  ): Promise<void> {
    this.partialUpdate({
      tableName: this.tableName,
      pk: memberKey(memberId),
      sk: applicationKey(applicationId),
      data: {
        ...application,
        lastUpdated: new Date().toISOString(),
      },
    });
  }

  // TODO: This is temporary until we have OpenSearch in place
  async getAllApplications(): Promise<ApplicationModel[]> {
    const params: ScanCommandInput = {
      TableName: this.tableName,
      FilterExpression: 'begins_with(pk, :member) AND begins_with(sk, :application)',
      ExpressionAttributeValues: {
        ':member': MEMBER,
        ':application': APPLICATION,
      },
      Limit: 500,
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

  async assignApplicationBatch(
    adminId: string,
    adminName: string,
    applicationIds: string[],
  ): Promise<string[]> {
    const updates = applicationIds.map((applicationId) => {
      return {
        Update: {
          TableName: this.tableName,
          IndexName: 'gsi1',
          Key: {
            pk: applicationKey(applicationId),
            sk: MEMBER,
          },
          KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
          UpdateExpression: 'SET assignedTo = :adminId, assignedToName = :adminName',
          ExpressionAttributeValues: {
            ':adminId': adminId,
            ':adminName': adminName,
            ':eligibilityStatus': EligibilityStatus.ASSIGNED_FOR_APPROVAL,
          },
        },
      };
    });

    await this.dynamoDB.send(new TransactWriteCommand({ TransactItems: updates }));

    return applicationIds;
  }

  async releaseApplicationBatch(adminId: string, applicationIds: string[]): Promise<void> {
    const updates = applicationIds.map((applicationId) => {
      return {
        Update: {
          TableName: this.tableName,
          IndexName: 'gsi1',
          Key: {
            pk: applicationKey(applicationId),
            sk: MEMBER,
          },
          KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
          UpdateExpression: 'SET assignedTo = :adminId, assignedToName = :adminName',
          ExpressionAttributeValues: {
            ':adminId': null,
            ':adminName': null,
            ':eligibilityStatus': EligibilityStatus.AWAITING_ID_APPROVAL,
          },
        },
      };
    });

    await this.dynamoDB.send(new TransactWriteCommand({ TransactItems: updates }));
  }
}
