import { decode, verify, JwtPayload } from 'jsonwebtoken';
import {
  APIGatewayAuthorizerResult,
  APIGatewayRequestAuthorizerEvent
} from 'aws-lambda';
import { getJwksPublicKey } from "./JwksClient";
import { Logger } from '@aws-lambda-powertools/logger';

const logger = new Logger({
  serviceName: 'customAuthenticatorLambdaHandler-auth0',
});

const BEARER_PREFIX = 'Bearer ';

export const authenticateAuth0Token = async (params: APIGatewayRequestAuthorizerEvent, tokenIssuer: string): Promise<APIGatewayAuthorizerResult> => {
  const token = extractToken(params);

  const decoded = decode(token, { complete: true });
  if (!decoded?.header?.kid) {
    throw new Error('Invalid JWT token');
  }

  try {
    const signingKey = await getJwksPublicKey(decoded.header.kid, tokenIssuer)
    const verifiedToken = verify(
      token,
      signingKey,
      {
        issuer: tokenIssuer,
      }
    ) as JwtPayload;
    const policyDocument = getPolicyDocument(params.methodArn);

    if (!verifiedToken.sub) {
      throw new Error('Sub claim not found in token');
    }

    return {
      principalId: verifiedToken.sub,
      policyDocument,
    };
  } catch (error) {
    logger.error('Error verifying auth0 token');
    throw error;
  }
};

const extractToken = (params: APIGatewayRequestAuthorizerEvent): string => {
  const authorizationToken = params.headers?.['Authorization'] ?? params.headers?.['authorization'];
  if (!authorizationToken) {
    throw new Error('Expected Authorization header was not set');
  }

  if (!authorizationToken.startsWith(BEARER_PREFIX)) {
    throw new Error('Invalid Authorization token does not match "Bearer .*"');
  }

  return authorizationToken.replace(BEARER_PREFIX, '');
};

const getPolicyDocument = (resource: string): APIGatewayAuthorizerResult['policyDocument'] => ({
  Version: '2012-10-17',
  Statement: [{
    Action: 'execute-api:Invoke',
    Effect: 'Allow',
    Resource: resource,
  }]
});
