import { type APIGatewayEvent, type Context } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import url from 'url';
import { Response } from './../../../../core/src/utils/restResponse/response';
import { getEnv, getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { IdentityStackEnvironmentKeys } from '@blc-mono/identity/src/utils/identityStackEnvironmentKeys';

const service: string = getEnv(IdentityStackEnvironmentKeys.SERVICE);

const logLevel =
  getEnvOrDefault(IdentityStackEnvironmentKeys.DEBUG_LOGGING_ENABLED, 'false').toLowerCase() ==
  'true'
    ? 'DEBUG'
    : 'INFO';
const logger = new Logger({
  serviceName: `${service}-zendeskCallback`,
  logLevel: logLevel,
});

const CLIENT_ID = getEnv(IdentityStackEnvironmentKeys.ZENDESK_APP_CLIENT_ID);
const REDIRECT_URI = getEnv(IdentityStackEnvironmentKeys.ZENDESK_REDIRECT_URI);
const USER_POOL_DOMAIN = getEnv(IdentityStackEnvironmentKeys.USER_POOL_DOMAIN);
const SECRET = getEnv(IdentityStackEnvironmentKeys.ZENDESK_JWT_SECRET);
const ZENDESK_SUBDOMAIN = getEnv(IdentityStackEnvironmentKeys.ZENDESK_SUBDOMAIN);

export const handler = async (event: APIGatewayEvent, context: Context): Promise<object> => {
  logger.info('input', { event });
  const code = event.queryStringParameters?.code ?? null;
  if (code == null) {
    logger.error('zendesk_callback_error', 'Invalid request. Empty Code');
    return Response.BadRequest({ message: 'Invalid request' });
  }
  const zendeskBaseUrl = `https://${ZENDESK_SUBDOMAIN}.zendesk.com/`;
  const tokenUrl = `https://${USER_POOL_DOMAIN}/oauth2/token`;
  const params = new url.URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('client_id', CLIENT_ID);
  params.append('redirect_uri', REDIRECT_URI);
  params.append('code', code);
  try {
    const response = await axios.post(tokenUrl, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const { id_token } = response.data;
    const decoded: any = jwt.decode(id_token);
    const jwtToken = generateJWT(decoded);
    const zendeskLoginUrl = `${zendeskBaseUrl}access/jwt?jwt=${jwtToken}`;
    return {
      statusCode: 302,
      headers: {
        Location: zendeskLoginUrl,
      },
    };
  } catch (error) {
    logger.error('zendesk_callback_error', { error });
    return {
      statusCode: 302,
      headers: {
        Location: zendeskBaseUrl,
      },
    };
  }
};

function generateJWT(userObj: any): string {
  const firstName = userObj.firstname && userObj.firstname != '' ? userObj.firstname : 'Zendesk';
  const lastName = userObj.surname && userObj.surname != '' ? userObj.surname : 'User';
  const cardNumber = userObj.card_number && userObj.card_number != '' ? userObj.card_number : '';
  const phoneNumber =
    userObj.phone_number && userObj.phone_number != '' ? userObj.phone_number : '';
  const payload = {
    iat: Math.floor(Date.now() / 1000),
    jti: userObj.jti,
    name: `${firstName} ${lastName}`,
    email: userObj.email,
    external_id: userObj.sub,
    givenname: firstName,
    surname: lastName,
    phone: phoneNumber,
    user_fields: {
      card_number: cardNumber,
      // job_role: "", // Populate these when we have in token
      // employer: "" // Populate these when we have in token
    },
  };
  return jwt.sign(payload, SECRET, { algorithm: 'HS256' });
}
