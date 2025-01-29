import { APIGatewayProxyEvent } from 'aws-lambda';
import { applicationService } from '@blc-mono/members/application/services/applicationService';
import { ApplicationModel } from '@blc-mono/shared/models/members/applicationModel';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';

export function isGetApplicationEvent(event: APIGatewayProxyEvent): boolean {
  if (!event.pathParameters?.memberId || !event.pathParameters.applicationId) return false;
  if (event.httpMethod !== 'GET') return false;

  return (
    event.path ===
    `/members/${event.pathParameters.memberId}/applications/${event.pathParameters.applicationId}`
  );
}

export async function getApplicationHandler(
  event: APIGatewayProxyEvent,
): Promise<ApplicationModel> {
  const { memberId, applicationId } = event.pathParameters || {};
  if (!memberId || !applicationId) {
    throw new ValidationError('Member ID and Application ID are required');
  }

  return await applicationService().getApplication(memberId, applicationId);
}
