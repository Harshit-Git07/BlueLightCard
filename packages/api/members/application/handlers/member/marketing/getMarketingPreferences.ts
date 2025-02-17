import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '@blc-mono/members/application/handlers/shared/middleware/middleware';
import { MarketingService } from '@blc-mono/members/application/services/marketingService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { verifyMemberHasAccessToProfile } from '../memberAuthorization';
import { isMarketingPreferencesEnvironment } from '@blc-mono/members/application/types/marketingPreferencesEnvironment';

const service = new MarketingService();

const unwrappedHandler = async (
  event: APIGatewayProxyEvent,
): Promise<Record<string, unknown> | Record<string, unknown>[]> => {
  const { memberId, environment } = event.pathParameters || {};
  if (!memberId || !environment) {
    throw new ValidationError('Member ID and Environment is required');
  }

  if (!isMarketingPreferencesEnvironment(environment)) {
    throw new ValidationError('Environment must be either "web" or "mobile"');
  }

  verifyMemberHasAccessToProfile(event, memberId);
  return await service.getPreferences(memberId, environment);
};

export const handler = middleware(unwrappedHandler);
