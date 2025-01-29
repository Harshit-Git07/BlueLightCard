import { APIGatewayProxyEvent } from 'aws-lambda';
import { UpdateApplicationModel } from '@blc-mono/shared/models/members/applicationModel';
import { applicationService } from '@blc-mono/members/application/services/applicationService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { verifyMemberHasAccessToProfile } from '@blc-mono/members/application/handlers/member/memberAuthorization';

export function isUpdateApplicationEvent(event: APIGatewayProxyEvent): boolean {
  if (!event.pathParameters?.memberId || !event.pathParameters.applicationId) return false;
  if (event.httpMethod !== 'PUT') return false;

  return (
    event.path ===
    `/members/${event.pathParameters.memberId}/applications/${event.pathParameters.applicationId}`
  );
}

export async function updateApplicationHandler(event: APIGatewayProxyEvent): Promise<void> {
  const { memberId, applicationId } = event.pathParameters || {};
  if (!memberId || !applicationId) {
    throw new ValidationError('Member ID and Application ID are required');
  }

  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const application = UpdateApplicationModel.parse(JSON.parse(event.body));

  if (application.promoCode || application.promoCodeApplied) {
    throw new ValidationError('Promo code cannot be updated');
  }

  verifyMemberHasAccessToProfile(event, memberId);
  return await applicationService().updateApplication(memberId, applicationId, application);
}
