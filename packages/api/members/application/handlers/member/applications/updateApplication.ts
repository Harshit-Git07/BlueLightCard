import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { middleware } from '../../../middleware';
import {
  ApplicationModel,
  UpdateApplicationModel,
} from '@blc-mono/members/application/models/applicationModel';
import { ApplicationService } from '@blc-mono/members/application/services/applicationService';
import { verifyMemberHasAccessToProfile } from '../memberAuthorization';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';

const service = new ApplicationService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<void> => {
  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const application = UpdateApplicationModel.parse(JSON.parse(event.body));
  verifyMemberHasAccessToProfile(event, application.memberId);
  return await service.updateApplication(application);
};

export const handler = middleware(unwrappedHandler);
