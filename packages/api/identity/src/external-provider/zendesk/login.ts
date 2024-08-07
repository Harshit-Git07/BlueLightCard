import { type APIGatewayEvent, type APIGatewayProxyStructuredResultV2, type Context } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger'


const service: string = process.env.service as string;
const logger = new Logger({ serviceName: `${service}-zendeskLogin`, logLevel: process.env.DEBUG_LOGGING_ENABLED ? 'DEBUG' : 'INFO' });

const CLIENT_ID = process.env.ZENDESK_APP_CLIENT_ID;
const REDIRECT_URI = process.env.ZENDESK_REDIRECT_URI;
const USER_POOL_DOMAIN = process.env.USER_POOL_DOMAIN;

export const handler = async (event: APIGatewayEvent, context: Context): Promise<object> => {
  logger.info('input', { event });
  const authUrl = `https://${USER_POOL_DOMAIN}/login?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
  return {
    'statusCode': 302,
    'headers': {
        'Location': authUrl
    }
 }

};
