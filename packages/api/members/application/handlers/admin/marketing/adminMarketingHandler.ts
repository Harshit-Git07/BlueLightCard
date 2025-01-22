import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '../../../middleware';
import MarketingService from '@blc-mono/members/application/services/marketingService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { BrazeAttributesModel } from '@blc-mono/shared/models/members/brazeAttributesModel';
import { BrazeUpdateModel } from '@blc-mono/shared/models/members/brazeUpdateModel';
import { isMarketingPreferencesEnvironment } from '@blc-mono/members/application/types/marketingPreferencesEnvironment';

const service = new MarketingService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<unknown> => {
  if (isGetBrazeAttributesEvent(event)) {
    return await getBrazeAttributes(event);
  }

  if (isGetMarketingPreferencesEvent(event)) {
    return await getMarketingPreferences(event);
  }

  if (isUpdateMarketingPreferencesEvent(event)) {
    return await updateMarketingPreferences(event);
  }
};

function isGetBrazeAttributesEvent(event: APIGatewayProxyEvent) {
  return (
    event.pathParameters &&
    event.pathParameters.memberId &&
    event.path === `/admin/members/${event.pathParameters.memberId}/marketing/braze`
  );
}

async function getBrazeAttributes(event: APIGatewayProxyEvent): Promise<Record<string, unknown>> {
  const { memberId } = event.pathParameters || {};
  if (!memberId) {
    throw new ValidationError('Member ID is required');
  }

  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const model = BrazeAttributesModel.parse(JSON.parse(event.body));
  return await service.getAttributes(memberId, model.attributes);
}

function isGetMarketingPreferencesEvent(event: APIGatewayProxyEvent) {
  return (
    event.pathParameters &&
    event.pathParameters.memberId &&
    event.path ===
      `/admin/members/${event.pathParameters.memberId}/marketing/preferences/${event.pathParameters.environment}`
  );
}

async function getMarketingPreferences(
  event: APIGatewayProxyEvent,
): Promise<Record<string, unknown> | Record<string, unknown>[]> {
  const { memberId, environment } = event.pathParameters || {};
  if (!memberId || !environment) {
    throw new ValidationError('Member ID and Environment is required');
  }

  if (!isMarketingPreferencesEnvironment(environment)) {
    throw new ValidationError('Environment must be either "web" or "mobile"');
  }

  return await service.getPreferences(memberId, environment);
}

function isUpdateMarketingPreferencesEvent(event: APIGatewayProxyEvent) {
  return (
    event.pathParameters &&
    event.pathParameters.memberId &&
    event.path === `/admin/members/${event.pathParameters.memberId}/marketing/braze/update`
  );
}

async function updateMarketingPreferences(event: APIGatewayProxyEvent): Promise<void> {
  const { memberId } = event.pathParameters || {};
  if (!memberId) {
    throw new ValidationError('Member ID is required');
  }

  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const model = BrazeUpdateModel.parse(JSON.parse(event.body));
  await service.updateBraze(memberId, model.attributes);
}

export const handler = middleware(unwrappedHandler);
