import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import {
  CreateOrganisationModel,
  OrganisationModel,
} from '@blc-mono/shared/models/members/organisationModel';
import { Table } from 'sst/node/table';
import { defaultDynamoDbClient } from './dynamoClient';
import { CreateEmployerModel, EmployerModel } from '@blc-mono/shared/models/members/employerModel';
import { NotFoundError } from '../errors/NotFoundError';
import {
  EMPLOYER,
  employerKey,
  ID_REQUIREMENT,
  ORGANISATION,
  organisationKey,
  Repository,
} from './repository';
import { v4 as uuidv4 } from 'uuid';
import { IdRequirementModel } from '@blc-mono/shared/models/members/idRequirementsModel';
import { NativeAttributeValue } from '@aws-sdk/util-dynamodb';

export class OrganisationRepository extends Repository {
  constructor(
    dynamoDB: DynamoDBDocumentClient = defaultDynamoDbClient,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private readonly tableName: string = Table.memberOrganisations.tableName,
  ) {
    super(dynamoDB);
  }

  async getIdRequirementDocs(): Promise<IdRequirementModel[]> {
    const queryParams = {
      TableName: this.tableName,
      KeyConditionExpression: 'sk = :sk AND begins_with(pk, :pk)',
      ExpressionAttributeValues: {
        ':pk': ID_REQUIREMENT,
        ':sk': ID_REQUIREMENT,
      },
      IndexName: 'gsi1',
    };

    const result = await this.dynamoDB.send(new QueryCommand(queryParams));

    if (!result.Items || result.Items.length === 0) {
      return [];
    }

    return result.Items.map((org) => IdRequirementModel.parse(org));
  }

  async createOrganisation(organisation: CreateOrganisationModel): Promise<string> {
    const organisationId = uuidv4();
    const params = {
      TableName: this.tableName,
      Item: {
        pk: organisationKey(organisationId),
        sk: ORGANISATION,
        organisationId,
        ...organisation,
        lastUpdated: new Date().toISOString(),
      },
    };
    await this.dynamoDB.send(new PutCommand(params));

    return organisationId;
  }

  async createOrganisations(organisations: CreateOrganisationModel[]): Promise<string[]> {
    const organisationIds: string[] = [];
    const organisationsToInsert: Record<string, NativeAttributeValue>[] = [];

    organisations.forEach((organisation) => {
      const organisationId = uuidv4();
      organisationIds.push(organisationId);

      organisationsToInsert.push({
        pk: organisationKey(organisationId),
        sk: ORGANISATION,
        organisationId,
        ...organisation,
        lastUpdated: new Date().toISOString(),
      });
    });

    await this.batchInsert(organisationsToInsert, this.tableName);

    return organisationIds;
  }

  async updateOrganisation(
    organisationId: string,
    organisation: Partial<OrganisationModel>,
  ): Promise<void> {
    await this.partialUpdate({
      tableName: this.tableName,
      pk: organisationKey(organisationId),
      sk: ORGANISATION,
      data: {
        ...organisation,
        lastUpdated: new Date().toISOString(),
      },
    });
  }

  async getOrganisations(): Promise<OrganisationModel[]> {
    const queryParams = {
      TableName: this.tableName,
      KeyConditionExpression: 'sk = :sk AND begins_with(pk, :pk)',
      ExpressionAttributeValues: {
        ':pk': ORGANISATION,
        ':sk': ORGANISATION,
      },
      IndexName: 'gsi1',
    };

    const result = await this.dynamoDB.send(new QueryCommand(queryParams));

    if (!result.Items || result.Items.length === 0) {
      return [];
    }

    return result.Items.map((org) => OrganisationModel.parse(org));
  }

  async getOrganisation(organisationId: string): Promise<OrganisationModel> {
    const params = {
      TableName: this.tableName,
      Key: {
        pk: organisationKey(organisationId),
        sk: ORGANISATION,
      },
    };

    const result = await this.dynamoDB.send(new GetCommand(params));

    if (!result.Item) {
      throw new NotFoundError(`Organisation with ID '${organisationId}' not found`);
    }

    return OrganisationModel.parse(result.Item);
  }

  async createEmployer(organisationId: string, employer: CreateEmployerModel): Promise<string> {
    const employerId = uuidv4();
    const params = {
      TableName: this.tableName,
      Item: {
        pk: organisationKey(organisationId),
        sk: employerKey(employerId),
        organisationId,
        employerId,
        ...employer,
        lastUpdated: new Date().toISOString(),
      },
    };
    await this.dynamoDB.send(new PutCommand(params));

    return employerId;
  }

  async createEmployers(
    organisationId: string,
    employers: CreateEmployerModel[],
  ): Promise<string[]> {
    const employerIds: string[] = [];
    const employersToInsert: Record<string, NativeAttributeValue>[] = [];

    employers.forEach((employer) => {
      const employerId = uuidv4();
      employerIds.push(employerId);

      employersToInsert.push({
        pk: organisationKey(organisationId),
        sk: employerKey(employerId),
        organisationId,
        employerId,
        ...employer,
        lastUpdated: new Date().toISOString(),
      });
    });

    await this.batchInsert(employersToInsert, this.tableName);

    return employerIds;
  }

  async updateEmployer(
    organisationId: string,
    employerId: string,
    employer: Partial<EmployerModel>,
  ): Promise<void> {
    await this.partialUpdate({
      tableName: this.tableName,
      pk: organisationKey(organisationId),
      sk: employerKey(employerId),
      data: {
        ...employer,
        lastUpdated: new Date().toISOString(),
      },
    });
  }

  async getEmployers(organisationId: string): Promise<EmployerModel[]> {
    const queryParams = {
      TableName: this.tableName,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
      ExpressionAttributeValues: {
        ':pk': organisationKey(organisationId),
        ':sk': EMPLOYER,
      },
    };
    const result = await this.dynamoDB.send(new QueryCommand(queryParams));

    if (!result.Items || result.Items.length === 0) {
      return [];
    }

    return result.Items.map((employer) => EmployerModel.parse(employer));
  }

  async getEmployer(organisationId: string, employerId: string): Promise<EmployerModel> {
    const params = {
      TableName: this.tableName,
      Key: {
        pk: organisationKey(organisationId),
        sk: employerKey(employerId),
      },
    };

    const result = await this.dynamoDB.send(new GetCommand(params));

    if (!result.Item) {
      throw new NotFoundError(
        `Employer with ID ${organisationId} from Organisation ${organisationId} not found`,
      );
    }

    return EmployerModel.parse(result.Item);
  }
}
