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
  serviceName: `${service}-zendeskLogout`,
  logLevel: logLevel,
});

const CLIENT_ID = getEnv(ZendeskStackEnvironmentKeys.ZENDESK_APP_CLIENT_ID);
const USER_POOL_DOMAIN = getEnv(ZendeskStackEnvironmentKeys.USER_POOL_DOMAIN);
const ZENDESK_SUBDOMAIN = getEnv(ZendeskStackEnvironmentKeys.ZENDESK_SUBDOMAIN);

export const handler = (event: APIGatewayEvent): object => {
  logger.info('input', { event });
  const zendeskBaseUrl = `https://${ZENDESK_SUBDOMAIN}.zendesk.com/`;
  try {
    const logoutUrl = `https://${USER_POOL_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${zendeskBaseUrl}`;
    return {
      statusCode: 302,
      headers: {
        Location: logoutUrl,
      },
    };
  } catch (error) {
    logger.error('zendesk_logout_error', { error });
    return {
      statusCode: 302,
      headers: {
        Location: zendeskBaseUrl,
      },
    };
  }
};
