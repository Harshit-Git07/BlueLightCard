import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { OrganisationsRepository } from 'application/repositories/organisationsRepository';
import { OrganisationService } from 'application/services/organisationsService';
import { APIGatewayEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import { datadog } from 'datadog-lambda-js';
import 'dd-trace/init';
import { LambdaLogger as Logger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { APIError } from '../../models/APIError';
import { Response } from '../../utils/restResponse/response';
import { APIErrorCode } from '../../enums/APIErrorCode';

const service: string = process.env.SERVICE as string;
const logger = new Logger({ serviceName: `${service}-getOrganisations` });
const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT ?? 'false';

const tableName = process.env.IDENTITY_TABLE_NAME as string;
const dynamoDB = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.REGION ?? 'eu-west-2' }),
);

const repository = new OrganisationsRepository(dynamoDB, tableName);
const orgService = new OrganisationService(repository, logger);

const handlerUnwrapped = async (event: APIGatewayEvent) => {
  const { brand, organisationId } = event.pathParameters || {};
  if (!brand) {
    logger.error({ message: 'Missing required query parameter: brand' });
    return Response.BadRequest({
      message: 'Error: Missing required query parameters',
      errors: [new APIError(APIErrorCode.MISSING_REQUIRED_PARAMETER, 'brand', 'brand is required')],
    });
  }
  const { organisationList, errorSet } = await orgService.getOrganisations({
    brand,
    organisationId,
  });

  if (errorSet.length > 0) {
    return Response.Error(new Error('Error occurred while fetching organisations'));
  }

  if (organisationList.length === 0 && organisationId) {
    return Response.NotFound({ message: 'Requested organisation not found' });
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Organisation(s) successfully retrieved',
      organisations: organisationList,
    }),
  };
};

export const handler = USE_DATADOG_AGENT === 'true' ? datadog(handlerUnwrapped) : handlerUnwrapped;
