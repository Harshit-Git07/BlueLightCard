import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { Response } from '@blc-mono/core/utils/restResponse/response';
import { MemberProfilesRepository } from '../../repositories/memberProfilesRepository';
import { MemberProfilesService } from '../../services/memberProfilesService';

const service: string = process.env.SERVICE as string;
const logger = new Logger({ serviceName: `${service}-getMemberProfile` });

const tableName = process.env.IDENTITY_TABLE_NAME as string;
const dynamoDB = DynamoDBDocument.from(new DynamoDB({ region: process.env.REGION ?? 'eu-west-2' }));

const repository = new MemberProfilesRepository(dynamoDB, tableName);
const profileService = new MemberProfilesService(repository, logger);

export const handler = async (
  event: APIGatewayEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  const memberUUID = event.queryStringParameters?.memberUUID;

  if (!memberUUID) {
    logger.error({ message: 'memberUUID missing' });
    return Response.BadRequest({ message: 'Bad Request: memberUUID is required' });
  }

  try {
    const memberProfile = await profileService.getMemberProfiles(memberUUID);

    if (memberProfile) {
      return Response.OK({
        message: 'Member profile found',
        data: memberProfile,
      });
    } else {
      return Response.NotFound({ message: 'Member profile not found' });
    }
  } catch (error) {
    logger.error('Error fetching member profile', { error });
    return Response.Error(error as Error);
  }
};
