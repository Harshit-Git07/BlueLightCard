import { APIGatewayProxyEvent } from 'aws-lambda';
import {
  CreateApplicationModel,
  CreateApplicationModelResponse,
} from '@blc-mono/shared/models/members/applicationModel';
import { applicationService } from '@blc-mono/members/application/services/applicationService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { verifyMemberHasAccessToProfile } from '@blc-mono/members/application/handlers/member/memberAuthorization';

export function isCreateApplicationEvent(event: APIGatewayProxyEvent): boolean {
  if (!event.pathParameters?.memberId) return false;
  if (event.httpMethod !== 'POST') return false;

  return event.path === `/members/${event.pathParameters.memberId}/applications`;
}

export async function createApplicationHandler(
  event: APIGatewayProxyEvent,
): Promise<CreateApplicationModelResponse> {
  const { memberId } = event.pathParameters || {};
  if (!memberId) {
    throw new ValidationError('Member ID is required');
  }

  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const application = CreateApplicationModel.parse(JSON.parse(event.body));
  verifyMemberHasAccessToProfile(event, memberId);

  const applicationId = await applicationService().createApplication(memberId, application);

  return CreateApplicationModelResponse.parse({ applicationId });
}
