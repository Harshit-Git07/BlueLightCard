import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { middleware } from '../../../middleware';
import { CreateApplicationModel } from '../../../models/applicationModel';
import { ApplicationService } from '../../../services/applicationService';
import { verifyMemberHasAccessToProfile } from '../memberAuthorization';
import { ValidationError } from '../../../errors/ValidationError';

const service = new ApplicationService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<Record<string, string>> => {
  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const application = CreateApplicationModel.parse(JSON.parse(event.body));
  verifyMemberHasAccessToProfile(event, application.memberId);
  const applicationId = await service.createApplication(application);
  return { applicationId };
};

export const handler = middleware(unwrappedHandler);
