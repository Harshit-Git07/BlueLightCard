import { APIGatewayProxyHandler } from 'aws-lambda';
import { LambdaLogger as Logger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { validateRequest } from '../../utils/requestValidator';
import {
  MemberProfileQueryPayload,
  MemberProfileUpdatePayload,
} from '../../types/memberProfileTypes';
import { MemberProfileRepository } from '../../repositories/memberProfileRepository';
import { MemberProfileService } from '../../services/memberProfileService';
import { Response } from '../../utils/restResponse/response';
import { APIErrorCode } from '../../enums/APIErrorCode';
import { APIError } from '../../models/APIError';
import { OrganisationsRepository } from '../../repositories/organisationsRepository';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { EmployersRepository } from '../../repositories/employersRepository';
import { datadog } from 'datadog-lambda-js';
import 'dd-trace/init';

const service: string = process.env.SERVICE as string;
const logger = new Logger({ serviceName: `${service}-updateMemberProfile` });

const tableName = process.env.PROFILE_TABLE_NAME as string;
const noteTableName = process.env.NOTE_TABLE_NAME as string;
const dynamoDB = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.REGION ?? 'eu-west-2' }),
);

const repository = new MemberProfileRepository(dynamoDB, tableName, noteTableName);
const organisationsRepository = new OrganisationsRepository(dynamoDB, tableName);
const employersRepository = new EmployersRepository(dynamoDB, tableName);
const profileService = new MemberProfileService(
  repository,
  organisationsRepository,
  employersRepository,
  logger,
);
const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT ?? 'false';

const handlerUnwrapped: APIGatewayProxyHandler = async (event) => {
  try {
    const { memberUUID, profileId } = event.pathParameters || {};

    if (!memberUUID || !profileId) {
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
            'profileId',
            'profileId is required',
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
    const queryPayload: MemberProfileQueryPayload = {
      memberUUID: memberUUID,
      profileId: profileId,
    };
    const updatePayload: MemberProfileUpdatePayload = body;

    const isInsert = event.httpMethod === 'POST';

    try {
      await profileService.upsertMemberProfile(queryPayload, updatePayload, isInsert, errorSet);
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error as any).code === 'ConditionalCheckFailedException'
      ) {
        if (isInsert) {
          return Response.BadRequest({
            message: 'Member profile already exists',
            errors: [
              new APIError(
                APIErrorCode.RESOURCE_NOT_FOUND,
                'profileId',
                'Member profile already exists',
              ),
            ],
          });
        } else {
          return Response.NotFound({
            message: 'Member profile and/or profile not found',
            errors: [
              new APIError(
                APIErrorCode.RESOURCE_NOT_FOUND,
                'profileId',
                'Member profile and/or profile not found',
              ),
            ],
          });
        }
      } else {
        throw error;
      }
    }

    if (errorSet.length > 0) {
      return Response.BadRequest({
        message: 'Errors occurred while updating member profile',
        errors: errorSet,
      });
    } else {
      return Response.OK({ message: 'Member profile updated successfully' });
    }
  } catch (error) {
    logger.error({
      message: 'Error updating member profile',
      error: error instanceof Error ? error.message : 'unknown error',
    });

    if (error instanceof Error) {
      if ('code' in error && (error as any).code === 'ConditionalCheckFailedException') {
        return Response.NotFound({
          message: 'Member profile and/or profile not found',
          errors: [
            new APIError(
              APIErrorCode.RESOURCE_NOT_FOUND,
              'memberUUID',
              'Member profile and/or profile not found',
            ),
          ],
        });
      } else {
        return Response.Error(error);
      }
    }

    return Response.Error(new Error('Unknown error occurred while updating member profile'));
  }
};
export const handler = USE_DATADOG_AGENT === 'true' ? datadog(handlerUnwrapped) : handlerUnwrapped;
