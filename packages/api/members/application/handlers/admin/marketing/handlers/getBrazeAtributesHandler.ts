import { APIGatewayProxyEvent } from 'aws-lambda';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { BrazeAttributesModel } from '@blc-mono/shared/models/members/brazeAttributesModel';
import { marketingService } from '@blc-mono/members/application/services/marketingService';

export function isGetBrazeAttributesEvent(event: APIGatewayProxyEvent): boolean {
  return (
    event.pathParameters !== null &&
    event.pathParameters.memberId !== undefined &&
    event.path === `/admin/members/${event.pathParameters.memberId}/marketing/braze`
  );
}

export async function getBrazeAttributesHandler(
  event: APIGatewayProxyEvent,
): Promise<Record<string, unknown>> {
  const { memberId } = event.pathParameters || {};
  if (!memberId) {
    throw new ValidationError('Member ID is required');
  }

  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const model = BrazeAttributesModel.parse(JSON.parse(event.body));
  return await marketingService().getAttributes(memberId, model.attributes);
}
