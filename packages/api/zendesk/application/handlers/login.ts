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

const CLIENT_ID = getEnv(ZendeskStackEnvironmentKeys.ZENDESK_APP_CLIENT_ID);
const REDIRECT_URI = getEnv(ZendeskStackEnvironmentKeys.ZENDESK_REDIRECT_URI);
const USER_POOL_DOMAIN = getEnv(ZendeskStackEnvironmentKeys.USER_POOL_DOMAIN);

export const handler = (event: APIGatewayEvent): object => {
  logger.info('input', { event });
  const authUrl = `https://${USER_POOL_DOMAIN}/login?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
  return {
    statusCode: 302,
    headers: {
      Location: authUrl,
    },
  };
};
