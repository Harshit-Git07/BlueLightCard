import { type APIGatewayEvent, type APIGatewayProxyStructuredResultV2, type Context } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger'

const service: string = process.env.service as string;
const logger = new Logger({ serviceName: `${service}-zendeskLogout`, logLevel: process.env.DEBUG_LOGGING_ENABLED ? 'DEBUG' : 'INFO' });


const CLIENT_ID = process.env.ZENDESK_APP_CLIENT_ID;
const USER_POOL_DOMAIN = process.env.USER_POOL_DOMAIN;
const ZENDESK_SUBDOMAIN = process.env.ZENDESK_SUBDOMAIN;

export const handler = async (event: APIGatewayEvent, context: Context): Promise<object> => {
  logger.info('input', { event });
  const zendeskBaseUrl = `https://${ZENDESK_SUBDOMAIN}.zendesk.com/`;
  try {
    const logoutUrl = `https://${USER_POOL_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${zendeskBaseUrl}`;
    return {
      'statusCode': 302,
      'headers': {
          'Location': logoutUrl
      }
    }
  } catch (error) {
    logger.error('zendesk_logout_error', {error});
    return {
      'statusCode': 302,
      'headers': {
          'Location': zendeskBaseUrl
      }
    }
  }


};
