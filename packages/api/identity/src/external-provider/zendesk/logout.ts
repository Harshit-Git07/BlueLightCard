import { type APIGatewayEvent, type Context } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { getEnv, getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { IdentityStackEnvironmentKeys } from '@blc-mono/identity/src/utils/identityStackEnvironmentKeys';

const service: string = getEnv(IdentityStackEnvironmentKeys.SERVICE);

const logLevel =
  getEnvOrDefault(IdentityStackEnvironmentKeys.DEBUG_LOGGING_ENABLED, 'false').toLowerCase() ==
  'true'
    ? 'DEBUG'
    : 'INFO';
const logger = new Logger({
  serviceName: `${service}-zendeskLogout`,
  logLevel: logLevel,
});

const CLIENT_ID = getEnv(IdentityStackEnvironmentKeys.ZENDESK_APP_CLIENT_ID);
const USER_POOL_DOMAIN = getEnv(IdentityStackEnvironmentKeys.USER_POOL_DOMAIN);
const ZENDESK_SUBDOMAIN = getEnv(IdentityStackEnvironmentKeys.ZENDESK_SUBDOMAIN);

export const handler = async (event: APIGatewayEvent, context: Context): Promise<object> => {
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
