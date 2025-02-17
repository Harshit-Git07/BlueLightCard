import { APIGatewayProxyEvent } from 'aws-lambda';
import { ApplicationService } from '@blc-mono/members/application/services/applicationService';
import { ApplicationModel } from '@blc-mono/shared/models/members/applicationModel';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { middleware } from '@blc-mono/members/application/handlers/shared/middleware/middleware';

const service = new ApplicationService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<ApplicationModel> => {
  const { memberId, applicationId } = event.pathParameters || {};
  if (!memberId || !applicationId) {
    throw new ValidationError('Member ID and Application ID are required');
  }

  return await service.getApplication(memberId, applicationId);
};

export const handler = middleware(unwrappedHandler);
