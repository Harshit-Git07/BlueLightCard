import { APIGatewayProxyEvent } from 'aws-lambda';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { isMarketingPreferencesEnvironment } from '@blc-mono/members/application/types/marketingPreferencesEnvironment';
import { marketingService } from '@blc-mono/members/application/services/marketingService';

export function isGetMarketingPreferencesEvent(event: APIGatewayProxyEvent): boolean {
  return (
    event.pathParameters !== null &&
    event.pathParameters.memberId !== undefined &&
    event.path ===
      `/admin/members/${event.pathParameters.memberId}/marketing/preferences/${event.pathParameters.environment}`
  );
}

export async function getMarketingPreferencesHandler(
  event: APIGatewayProxyEvent,
): Promise<Record<string, unknown> | Record<string, unknown>[]> {
  const { memberId, environment } = event.pathParameters || {};
  if (!memberId || !environment) {
    throw new ValidationError('Member ID and Environment is required');
  }

  if (!isMarketingPreferencesEnvironment(environment)) {
    throw new ValidationError('Environment must be either "web" or "mobile"');
  }

  return await marketingService().getPreferences(memberId, environment);
}
