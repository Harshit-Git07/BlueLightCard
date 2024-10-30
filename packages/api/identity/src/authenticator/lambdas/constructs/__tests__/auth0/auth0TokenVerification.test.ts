import { APIGatewayRequestAuthorizerEvent } from "aws-lambda";
import { authenticateAuth0Token } from "../../auth0/auth0TokenVerification";
import { decode, verify, JwtPayload } from 'jsonwebtoken';
import { getJwksPublicKey } from "../../auth0/JwksClient";

jest.mock('jsonwebtoken');
jest.mock('../../auth0/JwksClient');

const decodeMock = jest.mocked(decode);
const verifyMock = jest.mocked(verify);
const getJwksPublicKeyMock = jest.mocked(getJwksPublicKey);

describe('auth0TokenVerification', () => {
  const auth0Issuer = 'https://staging-access-blcshine.io/';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error when there are no headers in the event', async () => {
    const event = {
      headers: {}
    } as any as APIGatewayRequestAuthorizerEvent;

    await expect(authenticateAuth0Token(event, auth0Issuer))
      .rejects
      .toThrow('Expected Authorization header was not set');
  });

  it('should throw error when the Authorization header is not set in the event', async () => {
    const event = {
      headers: { something: 'else' }
    } as any as APIGatewayRequestAuthorizerEvent;

    await expect(authenticateAuth0Token(event, auth0Issuer))
      .rejects
      .toThrow('Expected Authorization header was not set');
  });

  it('should throw error when the Authorization header is not a Bearer token', async () => {
    const event = {
      headers: { Authorization: 'Not a bearer' }
    } as any as APIGatewayRequestAuthorizerEvent;

    await expect(authenticateAuth0Token(event, auth0Issuer))
      .rejects
      .toThrow('Invalid Authorization token does not match "Bearer .*"');
  });

  it('should throw error when the decoded token is null', async () => {
    decodeMock.mockReturnValueOnce(null);
    const event = {
      headers: { Authorization: 'Bearer token' }
    } as any as APIGatewayRequestAuthorizerEvent;

    await expect(authenticateAuth0Token(event, auth0Issuer))
      .rejects
      .toThrow('Invalid JWT token');
  });

  it('should throw error when the decoded token has no header value', async () => {
    decodeMock.mockReturnValueOnce({ something: 'else' });
    const event = {
      headers: { Authorization: 'Bearer token' }
    } as any as APIGatewayRequestAuthorizerEvent;

    await expect(authenticateAuth0Token(event, auth0Issuer))
      .rejects
      .toThrow('Invalid JWT token');
  });

  it('should throw error when the decoded token has no header kid value', async () => {
    decodeMock.mockReturnValueOnce({ header: { something: 'else' } });
    const event = {
      headers: { Authorization: 'Bearer token' }
    } as any as APIGatewayRequestAuthorizerEvent;

    await expect(authenticateAuth0Token(event, auth0Issuer))
      .rejects
      .toThrow('Invalid JWT token');
  });

  it('should throw error when the jwks client fails to return the public signing key', async () => {
    decodeMock.mockReturnValueOnce({ header: { kid: 'kid' } });
    getJwksPublicKeyMock.mockRejectedValueOnce(new Error('Failed to get signing key'));
    const event = {
      headers: { Authorization: 'Bearer token' }
    } as any as APIGatewayRequestAuthorizerEvent;

    await expect(authenticateAuth0Token(event, auth0Issuer))
      .rejects
      .toThrow('Failed to get signing key');
  });

  it('should throw error if the token audience does not match', async () => {
    decodeMock.mockReturnValueOnce({ header: { kid: 'kid' } });
    getJwksPublicKeyMock.mockResolvedValue('signing key');
    verifyMock.mockImplementation(() => {
      throw new Error('jwt issuer invalid');
    });
    const event = {
      headers: { Authorization: 'Bearer token' }
    } as any as APIGatewayRequestAuthorizerEvent;

    await expect(authenticateAuth0Token(event, auth0Issuer))
      .rejects
      .toThrow('jwt issuer invalid');
  });

  it('should throw error when verified token has no sub claim', async () => {
    decodeMock.mockReturnValueOnce({ header: { kid: 'kid' } });
    getJwksPublicKeyMock.mockResolvedValue('signing key');
    verifyMock.mockImplementation(() => ({} as JwtPayload));
    const event = {
      headers: { Authorization: 'Bearer token' }
    } as any as APIGatewayRequestAuthorizerEvent;

    await expect(authenticateAuth0Token(event, auth0Issuer))
      .rejects
      .toThrow('Sub claim not found in token');
  });

  describe('when event is valid', () => {
    const token = 'token';
    const kid = 'kid';
    const signingKey = 'signing key';
    const auth0SubClaim = 'auth0|1234567890';
    const methodArn = "arn:aws:execute-api:api-id/stage-name/GET/resource-path";

    beforeEach(() => {
      decodeMock.mockReturnValueOnce({ header: { kid } });
      getJwksPublicKeyMock.mockResolvedValue(signingKey);
      verifyMock.mockImplementation(() => ({ sub: auth0SubClaim } as JwtPayload));
    });

    it('should return a valid API Gateway Authorizer Result', async () => {
      const event = {
        methodArn,
        headers: { Authorization: `Bearer ${token}` }
      } as any as APIGatewayRequestAuthorizerEvent;

      const result = await authenticateAuth0Token(event, auth0Issuer);

      expect(result).toEqual({
        principalId: auth0SubClaim,
        policyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: 'Allow',
              Resource: methodArn
            }
          ]
        }
      });
      expect(decodeMock).toHaveBeenCalledWith(token, { complete: true });
      expect(getJwksPublicKeyMock).toHaveBeenCalledWith(kid, auth0Issuer);
      expect(verifyMock).toHaveBeenCalledWith(token, signingKey, {
        issuer: auth0Issuer
      });
    });
  });
});
