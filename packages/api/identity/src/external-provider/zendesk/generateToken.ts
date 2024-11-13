import { type APIGatewayEvent, type Context, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import jwt from 'jsonwebtoken';
import { Response } from '@blc-mono/core/utils/restResponse/response';
import { getEnv, getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { IdentityStackEnvironmentKeys } from '@blc-mono/identity/src/utils/identityStackEnvironmentKeys';
import { unpackJWT } from '@blc-mono/core/utils/unpackJWT';

const service: string = getEnv(IdentityStackEnvironmentKeys.SERVICE);
const logLevel =
  getEnvOrDefault(IdentityStackEnvironmentKeys.DEBUG_LOGGING_ENABLED, 'false').toLowerCase() ==
  'true'
    ? 'DEBUG'
    : 'INFO';
const logger = new Logger({
  serviceName: `${service}-zendeskGenerateToken`,
  logLevel: logLevel,
});
const SECRET = getEnv(IdentityStackEnvironmentKeys.ZENDESK_MESSAGING_JWT_SECRET);
const ZENDESK_KID = getEnv(IdentityStackEnvironmentKeys.ZENDESK_MESSAGING_KID);

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyStructuredResultV2> => {
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
