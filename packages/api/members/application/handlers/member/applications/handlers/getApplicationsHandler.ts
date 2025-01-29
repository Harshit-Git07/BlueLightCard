import { APIGatewayProxyEvent } from 'aws-lambda';
import { applicationService } from '@blc-mono/members/application/services/applicationService';
import { ApplicationModel } from '@blc-mono/shared/models/members/applicationModel';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';

export function isGetApplicationsEvent(event: APIGatewayProxyEvent): boolean {
  if (!event.pathParameters?.memberId) return false;
  if (event.httpMethod !== 'GET') return false;

  return event.path === `/members/${event.pathParameters.memberId}/applications`;
}

export async function getApplicationsHandler(
  event: APIGatewayProxyEvent,
): Promise<ApplicationModel[]> {
  const { memberId } = event.pathParameters || {};
  if (!memberId) {
    throw new ValidationError('Member ID is required');
  }

  return await applicationService().getApplications(memberId);
}
