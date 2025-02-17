import { APIGatewayProxyEvent } from 'aws-lambda';
import {
  CreateApplicationModel,
  CreateApplicationModelResponse,
} from '@blc-mono/shared/models/members/applicationModel';
import { ApplicationService } from '@blc-mono/members/application/services/applicationService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { middleware } from '@blc-mono/members/application/handlers/shared/middleware/middleware';

const service = new ApplicationService();

const unwrappedHandler = async (
  event: APIGatewayProxyEvent,
): Promise<CreateApplicationModelResponse> => {
  const { memberId } = event.pathParameters || {};
  if (!memberId) {
    throw new ValidationError('Member ID is required');
  }

  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const application = CreateApplicationModel.parse(JSON.parse(event.body));
  const applicationId = await service.createApplication(memberId, application);
  return CreateApplicationModelResponse.parse({ applicationId });
};

export const handler = middleware(unwrappedHandler);
