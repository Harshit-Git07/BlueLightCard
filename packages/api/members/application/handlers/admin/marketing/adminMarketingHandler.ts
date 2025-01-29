import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '../../../middleware';
import {
  getBrazeAttributesHandler,
  isGetBrazeAttributesEvent,
} from '@blc-mono/members/application/handlers/admin/marketing/handlers/getBrazeAtributesHandler';
import {
  getMarketingPreferencesHandler,
  isGetMarketingPreferencesEvent,
} from '@blc-mono/members/application/handlers/admin/marketing/handlers/getMarketingPreferencesHandler';
import {
  isUpdateMarketingPreferencesEvent,
  updateMarketingPreferencesHandler,
} from '@blc-mono/members/application/handlers/admin/marketing/handlers/updateMarketingPreferencesHandler';

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<unknown> => {
  if (isGetBrazeAttributesEvent(event)) {
    return await getBrazeAttributesHandler(event);
  }

  if (isGetMarketingPreferencesEvent(event)) {
    return await getMarketingPreferencesHandler(event);
  }

  if (isUpdateMarketingPreferencesEvent(event)) {
    return await updateMarketingPreferencesHandler(event);
  }
};

export const handler = middleware(unwrappedHandler);
