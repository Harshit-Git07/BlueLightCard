import { APIGatewayProxyEvent } from 'aws-lambda';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { promoCodeService } from '@blc-mono/members/application/services/promoCodesService';
import { PromoCodeResponseModel } from '@blc-mono/shared/models/members/promoCodeModel';

export function isValidatePromoCodeEvent(event: APIGatewayProxyEvent): boolean {
  if (
    !event.pathParameters?.memberId ||
    !event.pathParameters.applicationId ||
    !event.pathParameters.promoCode
  ) {
    return false;
  }
  if (event.httpMethod !== 'POST') return false;

  return (
    event.path ===
    `/members/${event.pathParameters.memberId}/applications/${event.pathParameters.applicationId}/code/validate/${event.pathParameters.promoCode}`
  );
}

export async function validatePromoCodeHandler(
  event: APIGatewayProxyEvent,
): Promise<PromoCodeResponseModel> {
  const { memberId, promoCode } = event.pathParameters || {};
  if (!memberId || !promoCode) {
    throw new ValidationError('Member ID and promo code value are required');
  }

  return await promoCodeService().validatePromoCode(memberId, promoCode);
}
