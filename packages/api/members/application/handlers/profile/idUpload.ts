import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { LambdaLogger as Logger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { S3 } from 'aws-sdk';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { Response } from '@blc-mono/core/utils/restResponse/response';
import { MemberApplicationRepository } from '../../repositories/memberApplicationRepository';
import { MemberApplicationService } from '../../services/memberApplicationService';
import { MemberApplicationQueryPayload } from 'application/types/memberApplicationTypes';
import { EligibilityStatus } from '../../enums/EligibilityStatus';

const service: string = process.env.SERVICE as string;
const entityName: string = process.env.ENTITY_NAME as string;
const logger = new Logger({ serviceName: `${service}-update${entityName}` });

const tableName = process.env.PROFILE_TABLE_NAME as string;
const bucketName = process.env.ID_UPLOAD_BUCKET as string;
const region = process.env.REGION ?? 'eu-west-2';
const s3 = new S3({ region });
const dynamoDB = DynamoDBDocument.from(new DynamoDB({ region: process.env.REGION ?? 'eu-west-2' }));

const applicationRepository = new MemberApplicationRepository(dynamoDB, tableName);
const applicationService = new MemberApplicationService(applicationRepository, logger);
import { APIError } from '../../models/APIError';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const memberUUID = event.pathParameters?.memberUUID;
  if (!memberUUID) {
    logger.error({ message: 'memberUUID missing' });
    return Response.BadRequest({ message: 'Bad Request: memberUUID is required' });
  }
  const payload: MemberApplicationQueryPayload = {
    memberUUID: memberUUID,
    applicationId: null,
  };
  const errorSet: APIError[] = [];
  if (!memberUUID) {
    logger.error({ message: 'memberUUID missing' });
    return Response.BadRequest({ message: 'Bad Request: memberUUID is required' });
  }

  try {
    const memberApplication = await applicationService.getMemberApplications(payload, errorSet);

    if (
      !memberApplication ||
      (memberApplication[0].eligibilityStatus !== EligibilityStatus.INELIGIBLE &&
        memberApplication[0].eligibilityStatus !== EligibilityStatus.AWAITING_ID_APPROVAL)
    ) {
      return Response.BadRequest({ message: 'Invalid application status' });
    }

    const key = `UPLOADS/${memberUUID}/${Date.now()}-ID-document`;
    const params = {
      Bucket: bucketName,
      Key: key,
      Expires: 1500,
    };

    const uploadURL = await s3.getSignedUrlPromise('putObject', params);

    return Response.OK({ message: 'Pre-signed URL generated', data: { uploadURL } });
  } catch (error) {
    logger.error({
      message: 'Error generating pre-signed URL',
      error: error instanceof Error ? error.message : 'Unknown error idUpload',
    });
    return Response.Error(error as Error);
  }
};
