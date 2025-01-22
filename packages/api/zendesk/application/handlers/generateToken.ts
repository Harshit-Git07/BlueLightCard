import { Logger } from '@aws-lambda-powertools/logger';
import { type APIGatewayEvent, APIGatewayProxyStructuredResultV2,type Context } from 'aws-lambda';
import jwt from 'jsonwebtoken';

import { getEnv, getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { Response } from '@blc-mono/core/utils/restResponse/response';
import { unpackJWT } from '@blc-mono/core/utils/unpackJWT';
import { ZendeskStackEnvironmentKeys } from '@blc-mono/zendesk/infrastructure/constants/environment';

const service: string = getEnv(ZendeskStackEnvironmentKeys.SERVICE);
const logLevel =
  getEnvOrDefault(ZendeskStackEnvironmentKeys.DEBUG_LOGGING_ENABLED, 'false').toLowerCase() ==
  'true'
    ? 'DEBUG'
    : 'INFO';
const logger = new Logger({
  serviceName: `${service}-zendeskGenerateToken`,
  logLevel: logLevel,
});
const SECRET = getEnv(ZendeskStackEnvironmentKeys.ZENDESK_MESSAGING_JWT_SECRET);
const ZENDESK_KID = getEnv(ZendeskStackEnvironmentKeys.ZENDESK_MESSAGING_KID);

export const handler = (event: APIGatewayEvent): APIGatewayProxyStructuredResultV2 => {
  logger.debug('input', { event });
  let authorization_header = '';
  if (event.headers.Authorization != undefined || event.headers.Authorization != '') {
    authorization_header = event.headers.Authorization ?? '';
  }
  let jwtInfo;
  try {
    jwtInfo = unpackJWT(authorization_header);
  } catch (error: any) {
    return Response.Unauthorized({ message: 'Unauthorized' });
  }
  try {
    const jwtToken = generateZendeskJWT(jwtInfo);
    const data = {
      token: jwtToken,
    }
    return Response.OK({ message: 'Token Generated', data: data });
  } catch (error) {
    logger.error('zendesk_token_error', { error });
    return Response.Error(error as Error);
  }
};

function generateZendeskJWT(userObj: any): string {
  const firstName = userObj.firstname && userObj.firstname != '' ? userObj.firstname : 'Zendesk';
  const lastName = userObj.surname && userObj.surname != '' ? userObj.surname : 'User';
  const payload = {
    scope: 'user',
    name: `${firstName} ${lastName}`,
    external_id: userObj['custom:blc_old_uuid'],
    email_verified: userObj.email_verified,
  };
  return jwt.sign(payload, SECRET, { algorithm: 'HS256', keyid: ZENDESK_KID });
}
