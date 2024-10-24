import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { EmployersRepository } from 'application/repositories/employersRepository';
import { EmployersService } from 'application/services/employersService';
import { APIGatewayEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import { datadog } from 'datadog-lambda-js';
import { LambdaLogger } from '../../../../core/src/utils/logger/lambdaLogger';
import { OrganisationsRepository } from '../../repositories/organisationsRepository';
import { Response } from '../../utils/restResponse/response';
import { APIError } from '../../models/APIError';
import { APIErrorCode } from '../../enums/APIErrorCode';

const service: string = process.env.SERVICE as string;
const logger = new LambdaLogger({ serviceName: `${service}-getEmployers` });
const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT ?? 'false';

const tableName = process.env.IDENTITY_TABLE_NAME as string;
const dynamoDB = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.REGION ?? 'eu-west-2' }),
);

const employerRepository = new EmployersRepository(dynamoDB, tableName);
const organisationsRepository = new OrganisationsRepository(dynamoDB, tableName);
const employersService = new EmployersService(employerRepository, organisationsRepository, logger);

const handlerUnwrapped = async (event: APIGatewayEvent) => {
  const { brand, organisationId, employerId } = event.pathParameters || {};

  if (!brand || !organisationId) {
    logger.error({ message: 'Missing required query parameters' });
    return Response.BadRequest({
      message: 'Error: Missing required query parameters',
      errors: [
        new APIError(
          APIErrorCode.MISSING_REQUIRED_PARAMETER,
          'organisationId',
          'organisationId is required',
        ),
        new APIError(APIErrorCode.MISSING_REQUIRED_PARAMETER, 'brand', 'brand is required'),
      ],
    });
  }

  const { employerList, errorSet } = await employersService.getEmployers({
    brand,
    organisationId,
    employerId,
  });

  if (errorSet.length > 0) {
    if (
      errorSet[0].code === APIErrorCode.RESOURCE_NOT_FOUND &&
      errorSet[0].detail === `No organisation found for brand: ${brand} with ID: ${organisationId}.`
    ) {
      return Response.NotFound({ message: 'Requested employer list not found for organisation' });
    }

    return Response.Error(new Error('Error occurred while fetching employers'));
  }

  if (employerList.length === 0 && employerId) {
    return Response.NotFound({ message: 'Requested employer not found' });
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Employers successfully retrieved',
      employers: employerList,
    }),
  };
};

export const handler = USE_DATADOG_AGENT === 'true' ? datadog(handlerUnwrapped) : handlerUnwrapped;
