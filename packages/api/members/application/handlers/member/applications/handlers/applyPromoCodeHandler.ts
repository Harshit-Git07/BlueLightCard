import { promoCodeService } from '@blc-mono/members/application/services/promoCodesService';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { UpdateApplicationModel } from '@blc-mono/shared/models/members/applicationModel';

export function isApplyPromoCodeEvent(event: APIGatewayProxyEvent): boolean {
  if (!event.pathParameters?.memberId || !event.pathParameters.applicationId) return false;
  if (event.httpMethod !== 'PUT') return false;

  return (
    event.path ===
    `/members/${event.pathParameters.memberId}/applications/${event.pathParameters.applicationId}/code/apply`
  );
}

export async function applyPromoCodeHandler(event: APIGatewayProxyEvent): Promise<void> {
  const { memberId, applicationId } = event.pathParameters || {};
  if (!memberId || !applicationId) {
    throw new ValidationError('Member ID and Application ID are required');
  }

  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const application = UpdateApplicationModel.parse(JSON.parse(event.body));
  if (!application.promoCode || !application.promoCodeApplied) {
    throw new ValidationError('Promo code and promo code applied values are required');
  }

  return await promoCodeService().applyPromoCode(
    memberId,
    applicationId,
    application.promoCode,
    application.promoCodeApplied,
  );
}
