import { APIGatewayProxyEvent } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { MemberProfilesService } from '../../services/memberProfilesService';
import { MemberProfilesRepository } from '../../repositories/memberProfilesRepository';
import { DynamoDB } from 'aws-sdk';
import { CreateProfilePayload } from '../../types/memberProfilesTypes';

const service: string = process.env.service as string;
const logger = new Logger({ serviceName: `${service}-createProfile` });
const tableName = process.env.IDENTITY_TABLE_NAME as string;
const dynamoDB = new DynamoDB.DocumentClient({ region: process.env.REGION ?? 'eu-west-2' });
const repository = new MemberProfilesRepository(dynamoDB, tableName);
const profileService = new MemberProfilesService(repository, logger);

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const brand = event.pathParameters?.brand;
    if (!brand) {
      logger.warn('Missing brand');
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

    const memberUuid = await profileService.createCustomerProfiles(payload, brand);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: memberUuid }),
    };
  } catch (error) {
    logger.error('Error creating customer profile:', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
