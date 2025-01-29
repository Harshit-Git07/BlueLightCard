import { APIGatewayProxyEvent } from 'aws-lambda';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { applicationService } from '@blc-mono/members/application/services/applicationService';
import { PaymentStatus } from '@blc-mono/shared/models/members/enums/PaymentStatus';

export function isPaymentConfirmedHandler(event: APIGatewayProxyEvent): boolean {
  if (!event.pathParameters?.memberId || !event.pathParameters.applicationId) return false;
  if (event.httpMethod !== 'PUT') return false;

  return (
    event.path ===
    `/members/${event.pathParameters.memberId}/applications/${event.pathParameters.applicationId}/paymentConfirmed`
  );
}

export async function paymentConfirmedHandler(event: APIGatewayProxyEvent): Promise<void> {
  const { memberId, applicationId } = event.pathParameters || {};
  if (!memberId || !applicationId) {
    throw new ValidationError('Member ID and application id value are required');
  }

  return await applicationService().updateApplication(memberId, applicationId, {
    paymentStatus: PaymentStatus.AWAITING_PAYMENT_CONFIRMATION,
  });
}
