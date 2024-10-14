import { OrganisationsQueryPayload } from 'application/types/organisationTypes';
import { DynamoDBDocumentClient, QueryCommandInput, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { OrganisationModel } from 'application/models/organisationModel';

export class OrganisationsRepository {
  private dynamoDBDocClient: DynamoDBDocumentClient;
  private tableName: string;

  constructor(dynamoDB: DynamoDBDocumentClient, tableName: string) {
    this.dynamoDBDocClient = dynamoDB;
    this.tableName = tableName;
  }

  async getOrganisations({
    brand,
    organisationId,
  }: OrganisationsQueryPayload): Promise<OrganisationModel[]> {
    const queryParams: QueryCommandInput = this.getQueryParams(organisationId, brand);
    const queryResult = await this.dynamoDBDocClient.send(new QueryCommand(queryParams));

    if (!queryResult.Items || queryResult.Items.length === 0) {
      return [];
    }

    const validatedItems = queryResult.Items.map((org) => OrganisationModel.parse(org));

    return validatedItems;
  }

  getQueryParams(organisationId: string | undefined, brand: string) {
    const baseParams = {
      TableName: this.tableName,
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk',
      },
      ExpressionAttributeValues: organisationId
        ? {
            ':pk': `ORGANISATION#${organisationId}`,
            ':sk': `BRAND#${brand}`,
          }
        : {
            ':pk': 'ORGANISATION#',
            ':sk': `BRAND#${brand}`,
          },
    };

    if (organisationId) {
      return {
        ...baseParams,
        KeyConditionExpression: '#pk = :pk AND #sk = :sk',
      };
    } else {
      return {
        ...baseParams,
        IndexName: 'gsi1',
        KeyConditionExpression: '#sk = :sk AND begins_with(#pk, :pk)',
      };
    }
  }
}
