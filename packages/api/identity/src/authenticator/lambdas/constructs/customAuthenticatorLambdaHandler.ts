import { PolicyDocument } from 'aws-lambda';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import jwtDecode from 'jwt-decode';
import { APIGatewayAuthorizerResult } from 'aws-lambda/trigger/api-gateway-authorizer';
import { Logger } from '@aws-lambda-powertools/logger';

const BEARER_PREFIX = 'Bearer ';

const logger = new Logger({ serviceName: `customAuthenticatorLambdaHandler` });

export const handler = async function (event: any): Promise<APIGatewayAuthorizerResult> {
  const OLD_USER_POOL_ID = process.env.OLD_USER_POOL_ID ?? "";
  const OLD_USER_POOL_ID_DDS = process.env.OLD_USER_POOL_ID_DDS ?? "";
  const USER_POOL_ID = process.env.USER_POOL_ID ?? "";
  const USER_POOL_ID_DDS = process.env.USER_POOL_ID_DDS ?? "";
  
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
      }
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
  } catch (err) {
    logger.error('Invalid auth token. err => ' + err);
    throw new Error('Unauthorized');
  }
};

export function getAuthenticationToken(event: any) {
  let authToken = event.headers['Authorization'] || event.headers['authorization'] || '';

  if (authToken.includes(BEARER_PREFIX)) {
    authToken = authToken.replace(BEARER_PREFIX, '');
  }

  return authToken;
}
