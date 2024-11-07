import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { APIGatewayEvent } from 'aws-lambda';
import { MemberProfileCustomerGetRepository } from '../../repositories/memberProfileCustomerGetRepository';
import { MemberProfileCustomerGetService } from '../../services/memberProfileCustomerGetService';
import { Response } from '../../utils/restResponse/response';
import { datadog } from 'datadog-lambda-js';
import { APIError } from '../../models/APIError';
import { APIErrorCode } from '../../enums/APIErrorCode';

const service: string = process.env.SERVICE as string;
const logger = new LambdaLogger({ serviceName: `${service}-getOrganisations` });
const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT || 'false';

const tableName = process.env.IDENTITY_TABLE_NAME as string;
const dynamoDB = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.REGION ?? 'eu-west-2' }),
);
const repository = new MemberProfileCustomerGetRepository(dynamoDB, tableName);
const memberProfileCustomerGetService = new MemberProfileCustomerGetService(repository, logger);

const handlerUnwrapped = async (event: APIGatewayEvent) => {
  const { brand, memberUuid, profileUuid } = event.pathParameters || {};

  if (!brand || !memberUuid || !profileUuid) {
    logger.error({ message: 'Missing required query parameters' });
    return Response.BadRequest({
      message: 'Error: Missing required query parameters',
      errors: [
        new APIError(
          APIErrorCode.MISSING_REQUIRED_PARAMETER,
          'memberUuid',
          'memberUuid is required',
        ),
        new APIError(
          APIErrorCode.MISSING_REQUIRED_PARAMETER,
          'profileUuid',
          'profileUuid is required',
        ),
        new APIError(APIErrorCode.MISSING_REQUIRED_PARAMETER, 'brand', 'brand is required'),
      ],
    });
  }

  const { customerProfile, errorSet } = await memberProfileCustomerGetService.getCustomerProfile({
    brand,
    memberUuid,
    profileUuid,
  });

  if (errorSet && errorSet.length > 0) {
    if (errorSet[0].code == APIErrorCode.RESOURCE_NOT_FOUND) {
      return Response.NotFound({ message: 'Member profile not found' });
    }
    return Response.Error(new Error('Error occurred while fetching employers'));
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Customer successfully retrieved',
      customerProfile,
    }),
  };
};

export const handler = USE_DATADOG_AGENT === 'true' ? datadog(handlerUnwrapped) : handlerUnwrapped;
