import { APIGatewayProxyEvent } from 'aws-lambda';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { BrazeUpdateModel } from '@blc-mono/shared/models/members/brazeUpdateModel';
import { marketingService } from '@blc-mono/members/application/services/marketingService';

export function isUpdateMarketingPreferencesEvent(event: APIGatewayProxyEvent): boolean {
  return (
    event.pathParameters !== null &&
    event.pathParameters.memberId !== undefined &&
    event.path === `/admin/members/${event.pathParameters.memberId}/marketing/braze/update`
  );
}

export async function updateMarketingPreferencesHandler(
  event: APIGatewayProxyEvent,
): Promise<void> {
  const { memberId } = event.pathParameters || {};
  if (!memberId) {
    throw new ValidationError('Member ID is required');
  }

  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const model = BrazeUpdateModel.parse(JSON.parse(event.body));
  await marketingService().updateBraze(memberId, model.attributes);
}
