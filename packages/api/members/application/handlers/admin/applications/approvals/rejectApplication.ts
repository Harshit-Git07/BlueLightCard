import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '../../../../middleware';
import { ApplicationService } from '@blc-mono/members/application/services/applicationService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { RejectApplicationModel } from '@blc-mono/shared/models/members/applicationModel';
import { UnauthorizedError } from '@blc-mono/members/application/errors/UnauthorizedError';

const service = new ApplicationService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<void> => {
  // TODO: Admin Role Based Access needs to be implemented; currently using memberId in request context as adminId
  const adminId = event.requestContext?.authorizer?.memberId;
  if (!adminId) {
    throw new UnauthorizedError('Could not determine Admin ID from authentication context');
  }

  const { memberId, applicationId } = event.pathParameters || {};
  if (!memberId || !applicationId) {
    throw new ValidationError('Member ID and Application ID are required');
  }

  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const application = RejectApplicationModel.parse(JSON.parse(event.body));
  await service.rejectApplication(adminId, memberId, applicationId, application.rejectionReason);
};

export const handler = middleware(unwrappedHandler);
