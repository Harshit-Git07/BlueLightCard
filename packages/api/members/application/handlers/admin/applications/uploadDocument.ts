import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { middleware } from '../../../middleware';
import { ApplicationService } from '@blc-mono/members/application/services/applicationService';
import { DocumentUploadLocation } from '@blc-mono/members/application/models/documentUpload';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';

const service = new ApplicationService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<DocumentUploadLocation> => {
  const { memberId, applicationId } = event.pathParameters || {};
  if (!memberId || !applicationId) {
    throw new ValidationError('Member ID and Application ID are required');
  }

  return await service.generateDocumentUploadUrl(memberId, applicationId);
};

export const handler = middleware(unwrappedHandler);
