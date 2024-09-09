import { type APIGatewayEvent, type Context } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { getEnv, getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { IdentityStackEnvironmentKeys } from 'src/utils/IdentityStackEnvironmentKeys';

const service: string = getEnv(IdentityStackEnvironmentKeys.SERVICE);

const logLevel =
  getEnvOrDefault(IdentityStackEnvironmentKeys.DEBUG_LOGGING_ENABLED, 'false').toLowerCase() ==
  'true'
    ? 'DEBUG'
    : 'INFO';
const logger = new Logger({
  serviceName: `${service}-zendeskLogin`,
  logLevel: logLevel,
});

const CLIENT_ID = getEnv(IdentityStackEnvironmentKeys.ZENDESK_APP_CLIENT_ID);
const REDIRECT_URI = getEnv(IdentityStackEnvironmentKeys.ZENDESK_REDIRECT_URI);
const USER_POOL_DOMAIN = getEnv(IdentityStackEnvironmentKeys.USER_POOL_DOMAIN);

export const handler = async (event: APIGatewayEvent, context: Context): Promise<object> => {
  logger.info('input', { event });
  const authUrl = `https://${USER_POOL_DOMAIN}/login?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
  return {
    statusCode: 302,
    headers: {
      Location: authUrl,
    },
  };
};
