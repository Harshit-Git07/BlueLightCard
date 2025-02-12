import {
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  NativeAttributeValue,
  PutCommand,
  QueryCommand,
  ScanCommand,
  ScanCommandInput,
  TransactWriteCommand,
  UpdateCommand,
  UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { defaultDynamoDbClient } from './dynamoClient';
import { Table } from 'sst/node/table';
import { APPLICATION, applicationKey, MEMBER, memberKey, Repository } from './repository';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError } from '../errors/NotFoundError';
import {
  ApplicationModel,
  CreateApplicationModel,
} from '@blc-mono/shared/models/members/applicationModel';
import { EligibilityStatus } from '@blc-mono/shared/models/members/enums/EligibilityStatus';
import { TransactWriteItem } from '@aws-sdk/client-dynamodb';
import { RejectionReason } from '@blc-mono/shared/models/members/enums/RejectionReason';

export class ApplicationRepository extends Repository {
  constructor(
    dynamoDB: DynamoDBDocumentClient = defaultDynamoDbClient,
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
    await this.partialUpdate({
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

    return result.Items.map((application) => ApplicationModel.parse(application));
  }

  async getDocumentsFromApplication(
    memberId: string,
    applicationId: string,
  ): Promise<string[] | undefined> {
    const params = {
      TableName: this.tableName,
      Key: {
        pk: memberKey(memberId),
        sk: applicationKey(applicationId),
      },
      ProjectionExpression: 'documents',
    };
    const result = await this.dynamoDB.send(new GetCommand(params));
    if (!result.Item) {
      throw new NotFoundError('Application not found');
    }

    return result.Item.documents;
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

  async assignApplicationBatch(adminId: string, applicationIds: string[]): Promise<string[]> {
    const applicationsToAssign: TransactWriteItem[] = [];

    for (const applicationId of applicationIds) {
      const queryResult = await this.dynamoDB.send(
        new QueryCommand({
          TableName: this.tableName,
          IndexName: 'gsi1',
          KeyConditionExpression: 'sk = :sk AND begins_with(pk, :pk)',
          ExpressionAttributeValues: {
            ':sk': applicationKey(applicationId),
            ':pk': MEMBER,
          },
          Limit: 1,
        }),
      );

      if (!queryResult.Items || queryResult.Items.length === 0) {
        throw new Error(`No item found for applicationId: ${applicationId}`);
      }

      const fullPartitionKey = queryResult.Items[0].pk;
      const fullSortKey = queryResult.Items[0].sk;

      applicationsToAssign.push({
        Update: {
          TableName: this.tableName,
          Key: {
            pk: fullPartitionKey,
            sk: fullSortKey,
          },
          UpdateExpression: 'SET assignedTo = :adminId, eligibilityStatus = :eligibilityStatus',
          ExpressionAttributeValues: {
            ':adminId': adminId as NativeAttributeValue,
            ':eligibilityStatus': EligibilityStatus.ASSIGNED_FOR_APPROVAL as NativeAttributeValue,
          },
        },
      });
    }

    await this.dynamoDB.send(new TransactWriteCommand({ TransactItems: applicationsToAssign }));

    return applicationIds;
  }

  async releaseApplicationBatch(applicationIds: string[]): Promise<void> {
    const applicationsToRelease: TransactWriteItem[] = [];

    for (const applicationId of applicationIds) {
      const applicationQueryResult = await this.dynamoDB.send(
        new QueryCommand({
          TableName: this.tableName,
          IndexName: 'gsi1',
          KeyConditionExpression: 'sk = :skVal AND begins_with(pk, :pkVal)',
          ExpressionAttributeValues: {
            ':skVal': applicationKey(applicationId),
            ':pkVal': MEMBER,
          },
          Limit: 1,
        }),
      );

      if (!applicationQueryResult.Items || applicationQueryResult.Items.length === 0) {
        throw new Error(`No item found for applicationId: ${applicationId}`);
      }

      const fullPartitionKey = applicationQueryResult.Items[0].pk;
      const fullSortKey = applicationQueryResult.Items[0].sk;

      applicationsToRelease.push({
        Update: {
          TableName: this.tableName,
          Key: {
            pk: fullPartitionKey,
            sk: fullSortKey,
          },
          UpdateExpression: 'REMOVE assignedTo SET eligibilityStatus = :eligibilityStatus',
          ExpressionAttributeValues: {
            ':eligibilityStatus': EligibilityStatus.AWAITING_ID_APPROVAL as NativeAttributeValue,
          },
        },
      });
    }
    await this.dynamoDB.send(new TransactWriteCommand({ TransactItems: applicationsToRelease }));
  }

  async approveApplication(memberId: string, applicationId: string): Promise<void> {
    const params: UpdateCommandInput = {
      TableName: this.tableName,
      Key: {
        pk: memberKey(memberId),
        sk: applicationKey(applicationId),
      },
      UpdateExpression: 'REMOVE assignedTo SET eligibilityStatus = :eligibilityStatus',
      ExpressionAttributeValues: {
        ':eligibilityStatus': EligibilityStatus.ELIGIBLE,
      },
    };

    await this.dynamoDB.send(new UpdateCommand(params));
  }

  async rejectApplication(
    memberId: string,
    applicationId: string,
    applicationRejectionReason: RejectionReason,
  ): Promise<void> {
    const params: UpdateCommandInput = {
      TableName: this.tableName,
      Key: {
        pk: memberKey(memberId),
        sk: applicationKey(applicationId),
      },
      UpdateExpression:
        'REMOVE assignedTo SET eligibilityStatus = :eligibilityStatus, rejectionReason = :rejectionReason',
      ExpressionAttributeValues: {
        ':eligibilityStatus': EligibilityStatus.INELIGIBLE,
        ':rejectionReason': applicationRejectionReason,
      },
    };

    await this.dynamoDB.send(new UpdateCommand(params));
  }
}
