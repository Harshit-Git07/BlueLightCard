import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '@blc-mono/members/application/handlers/shared/middleware/middleware';
import { ApplicationService } from '@blc-mono/members/application/services/applicationService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { UnauthorizedError } from '@blc-mono/members/application/errors/UnauthorizedError';
import { ApplicationBatchApprovalModel } from '@blc-mono/shared/models/members/applicationApprovalModel';

const service = new ApplicationService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<void> => {
  // TODO: Admin Role Based Access needs to be implemented; currently using memberId as adminId
  const adminId = event.requestContext?.authorizer?.memberId;
  if (!adminId) {
    throw new UnauthorizedError('Could not determine Admin ID from authentication context');
  }

  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const allocation = ApplicationBatchApprovalModel.parse(JSON.parse(event.body));
  if (!allocation.applicationIds || allocation.applicationIds.length === 0) {
    throw new ValidationError('No Application IDs provided');
  }

  await service.releaseApplicationBatch(adminId, allocation);
};

export const handler = middleware(unwrappedHandler);
