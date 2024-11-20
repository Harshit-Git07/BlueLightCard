import { DynamoDBDocumentClient, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { OrganisationModel } from '../models/organisationModel';
import { Table } from 'sst/node/table';
import { defaultDynamoDbClient } from './dynamoClient';
import { EmployerModel } from '../models/employerModel';
import { NotFoundError } from '../errors/NotFoundError';
import { EMPLOYER, employerKey, ORGANISATION, organisationKey } from './repository';

export class OrganisationRepository {
  constructor(
    private readonly dynamoDB: DynamoDBDocumentClient = defaultDynamoDbClient,
    // @ts-ignore
    private readonly tableName: string = Table.memberOrganisations.tableName,
  ) {}

  async createOrganisation(organisation: OrganisationModel): Promise<void> {}

  async updateOrganisation(organisation: OrganisationModel): Promise<void> {}

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
      throw new NotFoundError(`Organisation with ID ${organisationId} not found`);
    }

    return OrganisationModel.parse(result.Item);
  }

  async createEmployer(organisation: OrganisationModel): Promise<void> {}

  async updateEmployer(organisation: OrganisationModel): Promise<void> {}

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
