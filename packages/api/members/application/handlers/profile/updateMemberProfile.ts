import { APIGatewayProxyHandler } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { MemberProfilesService } from '../../services/memberProfilesService';
import { MemberProfilesRepository } from '../../repositories/memberProfilesRepository';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { Table } from 'sst/node/table';
import { validateRequest } from '../../utils/requestValidator';
import { ProfileUpdatePayload } from '../../types/memberProfilesTypes';

const service: string = process.env.service as string;
const logger = new Logger({ serviceName: `${service}-updateProfile` });

const dynamoDB = DynamoDBDocument.from(new DynamoDB());
const repository = new MemberProfilesRepository(dynamoDB, Table.identityTable.tableName);
const profileService = new MemberProfilesService(repository, logger);

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const validationResult = validateRequest(event, logger);

    if ('statusCode' in validationResult) {
      return validationResult;
    }

    const { memberUUID, body } = validationResult;
    const payload: ProfileUpdatePayload = body;

    await profileService.updateProfile(memberUUID, payload);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Profile updated successfully' }),
    };
  } catch (error) {
    logger.error('Error updating member profile:', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
