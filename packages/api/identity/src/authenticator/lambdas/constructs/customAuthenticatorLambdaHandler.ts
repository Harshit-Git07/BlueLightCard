import 'dd-trace/init';

import {
  APIGatewayAuthorizerResult,
  APIGatewayRequestAuthorizerEvent,
  PolicyDocument,
} from 'aws-lambda';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import jwtDecode from 'jwt-decode';
import { Logger } from '@aws-lambda-powertools/logger';

import { datadog } from 'datadog-lambda-js';
import { IdentityStackEnvironmentKeys } from 'src/utils/IdentityStackEnvironmentKeys';
import { getEnv, getEnvOrDefault } from '@blc-mono/core/utils/getEnv';

const BEARER_PREFIX = 'Bearer ';

const logLevel =
  getEnvOrDefault(IdentityStackEnvironmentKeys.DEBUG_LOGGING_ENABLED, 'false').toLowerCase() ==
  'true'
    ? 'DEBUG'
    : 'INFO';
const logger = new Logger({
  serviceName: `customAuthenticatorLambdaHandler`,
  logLevel: logLevel,
});

const useDatadogAgent: boolean =
  getEnvOrDefault(IdentityStackEnvironmentKeys.USE_DATADOG_AGENT, 'false').toLowerCase() == 'true';

const handlerUnwrapped = async function (
  event: APIGatewayRequestAuthorizerEvent,
): Promise<APIGatewayAuthorizerResult> {
  const OLD_USER_POOL_ID = getEnv(IdentityStackEnvironmentKeys.OLD_USER_POOL_ID);
  const OLD_USER_POOL_ID_DDS = getEnv(IdentityStackEnvironmentKeys.OLD_USER_POOL_ID_DDS);
  const USER_POOL_ID = getEnv(IdentityStackEnvironmentKeys.USER_POOL_ID);
  const USER_POOL_ID_DDS = getEnv(IdentityStackEnvironmentKeys.USER_POOL_ID_DDS);

  logger.debug(`event => ${JSON.stringify(event)}`);

  const authToken = getAuthenticationToken(event);

  try {
    const decodedToken: any = jwtDecode(authToken);
    logger.debug(decodedToken);

    const cognitoJwtVerifier = CognitoJwtVerifier.create([
      {
        userPoolId: OLD_USER_POOL_ID,
        clientId: decodedToken.aud,
        tokenUse: 'id',
      },
      {
        userPoolId: OLD_USER_POOL_ID_DDS,
        clientId: decodedToken.aud,
        tokenUse: 'id',
      },
      {
        userPoolId: USER_POOL_ID,
        clientId: decodedToken.aud,
        tokenUse: 'id',
      },
      {
        userPoolId: USER_POOL_ID_DDS,
        clientId: decodedToken.aud,
        tokenUse: 'id',
      },
    ]);

    const CognitoVerifyParameters: any = {};
    const decodedJWT = await cognitoJwtVerifier.verify(authToken, CognitoVerifyParameters);

    logger.debug('decodedJWT ' + JSON.stringify(decodedJWT));

    const policyDocument: PolicyDocument = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: event['methodArn'],
        },
      ],
    };

    const response: APIGatewayAuthorizerResult = {
      principalId: decodedJWT.sub,
      policyDocument,
    };

    logger.debug(`response => ${JSON.stringify(response)}`);

    return response;
  } catch (err: any) {
    logger.error(`Invalid auth token at path: ${event.path} for method: ${event.httpMethod}`, err);
    // Do not change this 'Unauthorized' error message as this is how the authorizer knows to send a 401 back to the client
    throw new Error('Unauthorized');
  }
};

export const handler = useDatadogAgent ? datadog(handlerUnwrapped) : handlerUnwrapped;

export function getAuthenticationToken(event: any) {
  let authToken = event.headers['Authorization'] || event.headers['authorization'] || '';

  if (authToken.includes(BEARER_PREFIX)) {
    authToken = authToken.replace(BEARER_PREFIX, '');
  }

  return authToken;
}
