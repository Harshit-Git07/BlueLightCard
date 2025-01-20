import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { middleware } from '../../../middleware';
import MarketingService from '@blc-mono/members/application/services/marketingService';
import { BrazeAttributesModel } from '@blc-mono/members/application/models/brazeAttributesModel';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { BrazeUpdateModel } from '@blc-mono/members/application/models/brazeUpdateModel';

const service = new MarketingService();

const unwrappedHandler = async (
  event: APIGatewayProxyEvent,
): Promise<Record<string, string> | any | void> => {
  if (
    event.pathParameters &&
    event.pathParameters.memberId &&
    event.path === `/admin/members/${event.pathParameters.memberId}/marketing/braze`
  ) {
    return getBrazeAttributes(event);
  }
  if (
    event.pathParameters &&
    event.pathParameters.memberId &&
    event.path ===
      `/admin/members/${event.pathParameters.memberId}/marketing/preferences/${event.pathParameters.environment}`
  ) {
    return getMarketingPreferences(event);
  }
  if (
    event.pathParameters &&
    event.pathParameters.memberId &&
    event.path === `/admin/members/${event.pathParameters.memberId}/marketing/braze/update`
  ) {
    return updateMarketingPreferences(event);
  }
};

const getBrazeAttributes = async (event: APIGatewayProxyEvent): Promise<Record<string, string>> => {
  const { memberId } = event.pathParameters || {};
  if (!memberId) {
    throw new ValidationError('Member ID is required');
  }

  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const model = BrazeAttributesModel.parse(JSON.parse(event.body));
  return await service.getAttributes(memberId, model.attributes);
};

const getMarketingPreferences = async (event: APIGatewayProxyEvent): Promise<any> => {
  const { memberId, environment } = event.pathParameters || {};
  if (!memberId || !environment) {
    throw new ValidationError('Member ID and Environment is required');
  } else if (environment !== 'web' && environment !== 'mobile') {
    throw new ValidationError('Environment must be either "web" or "mobile"');
  }
  return await service.getPreferences(memberId, environment);
};

const updateMarketingPreferences = async (event: APIGatewayProxyEvent) => {
  const { memberId } = event.pathParameters || {};
  if (!memberId) {
    throw new ValidationError('Member ID is required');
  }

  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const model = BrazeUpdateModel.parse(JSON.parse(event.body));
  await service.updateBraze(memberId, model.attributes);
};

export const handler = middleware(unwrappedHandler);
