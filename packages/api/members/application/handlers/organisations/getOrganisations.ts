import { Logger } from '@aws-lambda-powertools/logger';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { OrganisationsRepository } from 'application/repositories/organisationsRepository';
import { OrganisationService } from 'application/services/organisationsService';
import { APIGatewayEvent } from 'aws-lambda/trigger/api-gateway-proxy';

const service: string = process.env.SERVICE as string;
const logger = new Logger({ serviceName: `${service}-getOrganisations` });

const tableName = process.env.IDENTITY_TABLE_NAME as string;
const dynamoDB = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.REGION ?? 'eu-west-2' }),
);

const repository = new OrganisationsRepository(dynamoDB, tableName);
const orgService = new OrganisationService(repository, logger);

export const handler = async (event: APIGatewayEvent) => {
  const { brand, organisationId } = event.pathParameters || {};
  if (!brand) {
    logger.error({ message: 'Missing required query parameter: brand' });
    // Waiting for array of error types work to be finished
    return null;
  }
  try {
    const organisationList = await orgService.getOrganisations({ brand, organisationId });
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Organisation(s) successfully retrieved',
        organisations: organisationList,
      }),
    };
  } catch (error) {
    // Waiting for array of error types work to be finished
    return null;
  }
};
