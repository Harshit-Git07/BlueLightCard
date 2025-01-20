import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '../../../middleware';
import {
  CreateApplicationModel,
  CreateApplicationModelResponse,
} from '../../../models/applicationModel';
import { ApplicationService } from '../../../services/applicationService';
import { verifyMemberHasAccessToProfile } from '../memberAuthorization';
import { ValidationError } from '../../../errors/ValidationError';

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
  verifyMemberHasAccessToProfile(event, memberId);
  const applicationId = await service.createApplication(memberId, application);
  return CreateApplicationModelResponse.parse({ applicationId });
};

export const handler = middleware(unwrappedHandler);
