import { Logger } from '@aws-lambda-powertools/logger';
import { type APIGatewayEvent, type Context } from 'aws-lambda';

import { getEnv, getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { ZendeskStackEnvironmentKeys } from '@blc-mono/zendesk/infrastructure/constants/environment';

const service: string = getEnv(ZendeskStackEnvironmentKeys.SERVICE);
const logLevel =
  getEnvOrDefault(ZendeskStackEnvironmentKeys.DEBUG_LOGGING_ENABLED, 'false').toLowerCase() ==
  'true'
    ? 'DEBUG'
    : 'INFO';
const logger = new Logger({
  serviceName: `${service}-zendeskLogin`,
  logLevel: logLevel,
});

const ZENDESK_URL_UK = getEnv(ZendeskStackEnvironmentKeys.ZENDESK_URL_UK);
const ZENDESK_URL_AUS = getEnv(ZendeskStackEnvironmentKeys.ZENDESK_URL_AUS);
const ZENDESK_URL_DDS = getEnv(ZendeskStackEnvironmentKeys.ZENDESK_URL_DDS);

const ZENDESK_SUPPORT_URL_UK = getEnv(ZendeskStackEnvironmentKeys.ZENDESK_SUPPORT_URL_UK);
const ZENDESK_SUPPORT_URL_AUS = getEnv(ZendeskStackEnvironmentKeys.ZENDESK_SUPPORT_URL_AUS);
const ZENDESK_SUPPORT_URL_DDS = getEnv(ZendeskStackEnvironmentKeys.ZENDESK_SUPPORT_URL_DDS);

const ZENDESK_API_BASE_URL_UK = getEnv(ZendeskStackEnvironmentKeys.ZENDESK_API_BASE_URL_UK);
const ZENDESK_API_BASE_URL_AUS = getEnv(ZendeskStackEnvironmentKeys.ZENDESK_API_BASE_URL_AUS);
const ZENDESK_API_BASE_URL_DDS = getEnv(ZendeskStackEnvironmentKeys.ZENDESK_API_BASE_URL_DDS);

const brandURLs: { [key: string]: string } = {
  'bluelightcard.zendesk.com': ZENDESK_API_BASE_URL_UK,
  'support.bluelightcard.co.uk': ZENDESK_API_BASE_URL_UK,
  'defencediscountservice.zendesk.com': ZENDESK_API_BASE_URL_DDS,
  'support.defencediscountservice.co.uk': ZENDESK_API_BASE_URL_DDS,
  'bluelightcardau.zendesk.com': ZENDESK_API_BASE_URL_AUS,
  'support-zendesk.bluelightcard.com.au': ZENDESK_API_BASE_URL_AUS,
};

export const handler = (event: APIGatewayEvent): object => {
  logger.info('input', { event });
  const returnTo = event.queryStringParameters?.return_to;
  const requestType = event.queryStringParameters?.request_type ? event.queryStringParameters?.request_type : 'login';
  const defaultRedirectUrl = `https://${ZENDESK_URL_UK}`; // redirect back to zendesk UK by default
  if (!returnTo) {
    logger.error('Missing return_to parameter');
    return {
      statusCode: 302,
      headers: {
        Location: defaultRedirectUrl
      }
    }
  }
  for (const [key, url] of Object.entries(brandURLs)) {
    if (returnTo.includes(key)) {
      const redirectUrl = `${url}/${requestType}`;
      return {
        statusCode: 302,
        headers: {
          Location: redirectUrl
        }
      };
    }
  }

  logger.error('No matching brand URL found');
  return {
    statusCode: 302,
    headers: {
      Location: defaultRedirectUrl
    }
  }
};
