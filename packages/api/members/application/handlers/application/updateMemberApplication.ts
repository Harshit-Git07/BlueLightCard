import { APIGatewayProxyHandler } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { DynamoDB } from 'aws-sdk';
import { validateRequest } from '../../utils/requestValidator';
import {
  MemberApplicationQueryPayload,
  MemberApplicationUpdatePayload,
} from '../../types/memberApplicationTypes';
import { MemberApplicationRepository } from '../../repositories/memberApplicationRepository';
import { MemberApplicationService } from '../../services/memberApplicationService';

const service: string = process.env.SERVICE as string;
const logger = new Logger({ serviceName: `${service}-updateMemberApplication` });

const tableName = process.env.IDENTITY_TABLE_NAME as string;
const dynamoDB = new DynamoDB.DocumentClient({ region: process.env.REGION ?? 'eu-west-2' });

const repository = new MemberApplicationRepository(dynamoDB, tableName);
const applicationService = new MemberApplicationService(repository, logger);

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const { brand, memberUUID, applicationId } = event.pathParameters || {};

    if (!memberUUID || !brand || !applicationId) {
      logger.error({ message: 'Missing required query parameters' });
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Invalid Request: memberUUID, brand, and applicationId are required',
        }),
      };
    }

    const validationResult = validateRequest(event, logger);

    if ('statusCode' in validationResult) {
      return validationResult;
    }

    const { body } = validationResult;
    const queryPayload: MemberApplicationQueryPayload = {
      memberUUID: memberUUID,
      brand: brand,
      applicationId: applicationId,
    };
    const updatePayload: MemberApplicationUpdatePayload = body;

    await applicationService.upsertMemberApplication(
      queryPayload,
      updatePayload,
      event.httpMethod === 'POST',
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Member application updated successfully' }),
    };
  } catch (error) {
    logger.error({ message: 'Error updating member application', error });

    if (error instanceof Error) {
      if ('code' in error && (error as any).code === 'ConditionalCheckFailedException') {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'Member profile and/or application not found' }),
        };
      }
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
