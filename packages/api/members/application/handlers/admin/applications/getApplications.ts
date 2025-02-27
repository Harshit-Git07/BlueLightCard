import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '@blc-mono/members/application/handlers/shared/middleware/middleware';
import { ApplicationService } from '@blc-mono/members/application/services/applicationService';
import { ApplicationModel } from '@blc-mono/shared/models/members/applicationModel';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';

const service = new ApplicationService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<ApplicationModel[]> => {
  const { memberId } = event.pathParameters || {};
  if (!memberId) {
    throw new ValidationError('Member ID is required');
  }

  return await service.getApplications(memberId);
};

export const handler = middleware(unwrappedHandler);
