import { GetCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import {
  CreateOrganisationModel,
  OrganisationModel,
} from '@blc-mono/shared/models/members/organisationModel';
import { CreateEmployerModel, EmployerModel } from '@blc-mono/shared/models/members/employerModel';
import { NotFoundError } from '@blc-mono/members/application/errors/NotFoundError';
import {
  EMPLOYER,
  employerKey,
  ID_REQUIREMENT,
  ORGANISATION,
  organisationKey,
  Repository,
} from '@blc-mono/members/application/repositories/base/repository';
import { v4 as uuidv4 } from 'uuid';
import { GetIdRequirementDocsModel } from '@blc-mono/shared/models/members/idRequirementsModel';
import { NativeAttributeValue } from '@aws-sdk/util-dynamodb';
import { defaultDynamoDbClient } from '@blc-mono/members/application/providers/DynamoDb';
import { memberOrganisationsTableName } from '@blc-mono/members/application/providers/Tables';

export class OrganisationRepository extends Repository {
  constructor(dynamoDB = defaultDynamoDbClient) {
    super(dynamoDB);
  }

  async getIdRequirementDocs(): Promise<GetIdRequirementDocsModel[]> {
    const queryParams = {
      TableName: memberOrganisationsTableName(),
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

    return result.Items.map((org) => GetIdRequirementDocsModel.parse(org));
  }

  async createOrganisation(organisation: CreateOrganisationModel): Promise<string> {
    const organisationId = uuidv4();
    const params = {
      TableName: memberOrganisationsTableName(),
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

    await this.batchInsert(organisationsToInsert, memberOrganisationsTableName());

    return organisationIds;
  }

  async updateOrganisation(
    organisationId: string,
    organisation: Partial<OrganisationModel>,
  ): Promise<void> {
    await this.partialUpdate({
      tableName: memberOrganisationsTableName(),
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
      TableName: memberOrganisationsTableName(),
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
      TableName: memberOrganisationsTableName(),
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
      TableName: memberOrganisationsTableName(),
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

    await this.batchInsert(employersToInsert, memberOrganisationsTableName());

    return employerIds;
  }

  async updateEmployer(
    organisationId: string,
    employerId: string,
    employer: Partial<EmployerModel>,
  ): Promise<void> {
    await this.partialUpdate({
      tableName: memberOrganisationsTableName(),
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
      TableName: memberOrganisationsTableName(),
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
      TableName: memberOrganisationsTableName(),
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
