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
import { Response } from '../../utils/restResponse/response';
import { APIErrorCode } from '../../enums/APIError';
import { APIError } from '../../models/APIError';

const service: string = process.env.SERVICE as string;
const logger = new Logger({ serviceName: `${service}-updateMemberApplication` });

const tableName = process.env.APPLICATION_TABLE_NAME as string;
const dynamoDB = new DynamoDB.DocumentClient({ region: process.env.REGION ?? 'eu-west-2' });

const repository = new MemberApplicationRepository(dynamoDB, tableName);
const applicationService = new MemberApplicationService(repository, logger);

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const { brand, memberUUID, applicationId } = event.pathParameters || {};

    if (!memberUUID || !brand || !applicationId) {
      logger.error({ message: 'Missing required query parameters' });
      return Response.BadRequest({
        message: 'Error: Missing required query parameters',
        errors: [
          new APIError(
            APIErrorCode.MISSING_REQUIRED_PARAMETER,
            'memberUUID',
            'memberUUID is required',
          ),
          new APIError(APIErrorCode.MISSING_REQUIRED_PARAMETER, 'brand', 'brand is required'),
          new APIError(
            APIErrorCode.MISSING_REQUIRED_PARAMETER,
            'applicationId',
            'applicationId is required',
          ),
        ],
      });
    }

    const errorSet: APIError[] = [];

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
      errorSet,
    );

    if (errorSet.length > 0) {
      return Response.BadRequest({
        message: 'Errors occurred while updating member application',
        errors: errorSet,
      });
    } else {
      return Response.OK({ message: 'Member application updated successfully' });
    }
  } catch (error) {
    logger.error({ message: 'Error updating member application', error });

    if (error instanceof Error) {
      if ('code' in error && (error as any).code === 'ConditionalCheckFailedException') {
        return Response.NotFound({
          message: 'Member profile and/or application not found',
          errors: [
            new APIError(
              APIErrorCode.RESOURCE_NOT_FOUND,
              'memberUUID',
              'Member profile and/or application not found',
            ),
          ],
        });
      } else {
        return Response.Error(error);
      }
    }

    return Response.Error(new Error('Unknown error occurred while updating member application'));
  }
};
