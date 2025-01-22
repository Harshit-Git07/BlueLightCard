import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '../../../middleware';
import { ApplicationService } from '@blc-mono/members/application/services/applicationService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { DocumentListPresignedUrl } from '@blc-mono/shared/models/members/documentUpload';

const service = new ApplicationService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<DocumentListPresignedUrl> => {
  const { memberId, applicationId } = event.pathParameters || {};
  if (!memberId || !applicationId) {
    throw new ValidationError('Member ID and Application ID are required');
  }

  return await service.getDocumentsFromApplication(memberId, applicationId);
};

export const handler = middleware(unwrappedHandler);
