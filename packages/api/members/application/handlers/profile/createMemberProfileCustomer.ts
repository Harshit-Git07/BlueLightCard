import { APIGatewayProxyEvent } from 'aws-lambda';
import { LambdaLogger as Logger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { memberProfileCustomerCreateService } from '../../services/memberProfileCustomerCreateService';
import { memberProfileCustomerCreateRepository } from '../../repositories/memberProfileCustomerCreateRepository';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { CreateProfilePayload } from '../../types/memberProfilesTypes';
import { datadog } from 'datadog-lambda-js';
import 'dd-trace/init';

const service: string = process.env.service as string;
const logger = new Logger({ serviceName: `${service}-createMemberProfileCustomer` });
const tableName = process.env.IDENTITY_TABLE_NAME as string;
const dynamoDB = DynamoDBDocument.from(new DynamoDB({ region: process.env.REGION ?? 'eu-west-2' }));
const repository = new memberProfileCustomerCreateRepository(dynamoDB, tableName);
const profileService = new memberProfileCustomerCreateService(repository, logger);
const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT ?? 'false';

const handlerUnwrapped = async (event: APIGatewayProxyEvent) => {
  try {
    const brand = event.pathParameters?.brand;
    if (!brand) {
      logger.warn({ message: 'Missing brand' });
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing brand' }),
      };
    }
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing request body' }),
      };
    }
    const payload: CreateProfilePayload = JSON.parse(event.body);

    const [memberUuid, profileUuid] = await profileService.createCustomerProfiles(payload, brand);

    return {
      statusCode: 200,
      body: JSON.stringify({ memberUuid: memberUuid, profileUuid: profileUuid }),
    };
  } catch (error) {
    logger.error({
      message: 'Error creating customer profile:',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

export const handler = USE_DATADOG_AGENT === 'true' ? datadog(handlerUnwrapped) : handlerUnwrapped;
