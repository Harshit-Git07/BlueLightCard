import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { middleware } from '../../../middleware';
import MarketingService from '@blc-mono/members/application/services/marketingService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';

const service = new MarketingService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<any> => {
  const { memberId, environment } = event.pathParameters || {};
  if (!memberId || !environment) {
    throw new ValidationError('Member ID and Environment is required');
  } else if (environment !== 'web' && environment !== 'mobile') {
    throw new ValidationError('Environment must be either "web" or "mobile"');
  }

  return await service.getPreferences(memberId, environment);
};

export const handler = middleware(unwrappedHandler);
