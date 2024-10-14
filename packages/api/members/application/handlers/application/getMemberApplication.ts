import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { DynamoDB } from 'aws-sdk';
import { Response } from '../../utils/restResponse/response';
import { MemberApplicationRepository } from 'application/repositories/memberApplicationRepository';
import { MemberApplicationService } from 'application/services/memberApplicationService';
import { MemberApplicationQueryPayload } from 'application/types/memberApplicationTypes';
import { APIErrorCode } from '../../enums/APIErrorCode';
import { APIError } from '../../models/APIError';

const service: string = process.env.SERVICE as string;
const logger = new Logger({ serviceName: `${service}-getMemberApplication` });

const tableName = process.env.APPLICATION_TABLE_NAME as string;
const dynamoDB = new DynamoDB.DocumentClient({ region: process.env.REGION ?? 'eu-west-2' });

const repository = new MemberApplicationRepository(dynamoDB, tableName);
const applicationService = new MemberApplicationService(repository, logger);

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const { brand, memberUUID, applicationId } = event.pathParameters || {};

  if (!memberUUID || !brand) {
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
      ],
    });
  }

  try {
    const payload: MemberApplicationQueryPayload = {
      memberUUID: memberUUID,
      brand: brand,
      applicationId: applicationId ?? null,
    };

    const errorSet: APIError[] = [];

    const memberApplication = await applicationService.getMemberApplications(payload, errorSet);

    if (errorSet.length > 0) {
      return Response.BadRequest({
        message: 'Errors occurred while fetching member application',
        errors: errorSet,
      });
    } else {
      if (memberApplication && memberApplication.length > 0) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            applications: memberApplication,
          }),
        };
      } else {
        return Response.NotFound({
          message: 'No matching member applications found',
          errors: [
            new APIError(
              APIErrorCode.RESOURCE_NOT_FOUND,
              'application',
              'No matching member applications found',
            ),
          ],
        });
      }
    }
  } catch (error) {
    logger.error({ message: 'Error fetching member application', error });
    if (error instanceof Error) {
      return Response.Error(error);
    } else {
      return Response.Error(new Error('Unknown error occurred while fetching member application'));
    }
  }
};
