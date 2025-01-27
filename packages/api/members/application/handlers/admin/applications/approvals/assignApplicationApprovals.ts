import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '../../../../middleware';
import { ApplicationService } from '@blc-mono/members/application/services/applicationService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { UnauthorizedError } from '@blc-mono/members/application/errors/UnauthorizedError';
import { ApplicationBatchApprovalModel } from '@blc-mono/shared/models/members/applicationApprovalModel';

const service = new ApplicationService();

const unwrappedHandler = async (
  event: APIGatewayProxyEvent,
): Promise<ApplicationBatchApprovalModel> => {
  // TODO: Admin Role Based Access needs to be implemented; currently using memberId as adminId
  const adminId = event.requestContext?.authorizer?.memberId;
  if (!adminId) {
    throw new UnauthorizedError('Could not determine Admin ID from authentication context');
  }

  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const allocation = ApplicationBatchApprovalModel.parse(JSON.parse(event.body));
  const applicationIds = await service.assignApplicationBatch(adminId, allocation);
  return ApplicationBatchApprovalModel.parse({ applicationIds });
};

export const handler = middleware(unwrappedHandler);
