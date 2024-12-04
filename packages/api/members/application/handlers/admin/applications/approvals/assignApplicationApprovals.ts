import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { middleware } from '../../../../middleware';
import { ApplicationService } from '@blc-mono/members/application/services/applicationService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { UnauthorizedError } from '@blc-mono/members/application/errors/UnauthorizedError';
import { ApplicationBatchApprovalModel } from '@blc-mono/members/application/models/applicationApprovalModel';

const service = new ApplicationService();

const unwrappedHandler = async (
  event: APIGatewayProxyEvent,
): Promise<ApplicationBatchApprovalModel> => {
  const adminId = event.requestContext?.authorizer?.adminId;
  const adminName = event.requestContext?.authorizer?.adminName;
  if (!adminId || !adminName) {
    throw new UnauthorizedError('Could not determine Admin ID or Name from authentication context');
  }

  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const allocation = ApplicationBatchApprovalModel.parse(JSON.parse(event.body));
  const applicationIds = await service.assignApplicationBatch(adminId, adminName, allocation);
  return ApplicationBatchApprovalModel.parse({ applicationIds });
};

export const handler = middleware(unwrappedHandler);
