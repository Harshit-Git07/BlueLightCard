import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '@blc-mono/members/application/handlers/shared/middleware/middleware';
import { UpdateApplicationModel } from '@blc-mono/shared/models/members/applicationModel';
import { ApplicationService } from '@blc-mono/members/application/services/applicationService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';

const service = new ApplicationService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<void> => {
  const { memberId, applicationId } = event.pathParameters || {};
  if (!memberId || !applicationId) {
    throw new ValidationError('Member ID and Application ID are required');
  }

  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const application = UpdateApplicationModel.parse(JSON.parse(event.body));
  return await service.updateApplication(memberId, applicationId, application);
};

export const handler = middleware(unwrappedHandler);
