import { PolicyDocument } from 'aws-lambda';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import jwtDecode from 'jwt-decode';
import { APIGatewayAuthorizerResult } from 'aws-lambda/trigger/api-gateway-authorizer';
import { Logger } from '@aws-lambda-powertools/logger';

const BEARER_PREFIX = 'Bearer ';

const logger = new Logger({ serviceName: `customAuthenticatorLambdaHandler` });
const AWS_REGION = process.env.REGION ?? "eu-west-2";

export const handler = async function (event: any): Promise<APIGatewayAuthorizerResult> {
  logger.debug(`event => ${JSON.stringify(event)}`);

  const authToken = getAuthenticationToken(event);

  try {
    const decodedToken: any = jwtDecode(authToken);
    logger.debug(decodedToken);

    if(!decodedToken.iss.includes(AWS_REGION)) {
      logger.error('Error: Region of API is different from Cognito region');
      throw new Error('Unauthorized');
    }

    const matches: Array<string> = Array.from(decodedToken.iss.matchAll('(?<=amazonaws.com/).*$'));
    
    const cognitoJwtVerifier = CognitoJwtVerifier.create({
      userPoolId: matches[0].toString(),
      clientId: decodedToken.aud,
      tokenUse: 'id',
    });

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
