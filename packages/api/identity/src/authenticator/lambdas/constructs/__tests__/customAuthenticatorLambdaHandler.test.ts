import { getAuthenticationToken, handler } from '../customAuthenticatorLambdaHandler';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { CognitoJwtPayload } from 'aws-jwt-verify/jwt-model';
import { authenticateAuth0Token } from '../auth0/auth0TokenVerification';
import { PolicyDocument } from "aws-lambda";

const auth0Issuer = 'https://staging-access.blcshine.io/';
const auth0ExtraIssuer = 'https://staging-access-dds.blcshine.io/';
const auth0TestIssuer = 'https://blc-uk-staging.uk.auth0.com/';
process.env.OLD_USER_POOL_ID = 'eu-west-2_rNmQEiFS4';
process.env.OLD_USER_POOL_ID_DDS = 'eu-west-2_jbLX0JEdN';
process.env.USER_POOL_ID = 'eu-west-2_E8RFhXXZY';
process.env.USER_POOL_ID_DDS = 'eu-west-2_YQNcmfl2l';
process.env.AUTH0_ISSUER = auth0Issuer;
process.env.AUTH0_EXTRA_ISSUER = auth0ExtraIssuer;
process.env.AUTH0_TEST_ISSUER = auth0TestIssuer;

jest.mock('../auth0/auth0TokenVerification');
const auth0TokenVerificationMock = jest.mocked(authenticateAuth0Token);

describe('customAuthenticatorLambdaHandler', () => {
  test("handler function should throw and 'Unauthorized' error when token is non JWT", async () => {
    // Create a mock event object
    const event = {
      headers: {
        Authorization: 'Bearer your-token',
      },
    };

    await expect(handler(event)).rejects.toThrow('Unauthorized');
  });

  it('should return the expected response for valid cognito authToken', async () => {
    const token =
      'eyJraWQiOiJOZkZFdFljOG8yRkpYekl6SFRTMkc4VTZ2UlVmVEVTTlRIZ1dzcWFQQjlBPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI5OGI5YjJiYy0xZDI1LTQ0ZjgtYTJlYy04MTY1NzQyM2NjZTQiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0yLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMl9FOFJGaFhYWlkiLCJjb2duaXRvOnVzZXJuYW1lIjoiOThiOWIyYmMtMWQyNS00NGY4LWEyZWMtODE2NTc0MjNjY2U0Iiwib3JpZ2luX2p0aSI6ImMyN2Y2MDFiLTgzMzYtNGZlNy05ZDlkLTA5ZDA5ODUwYjkzMSIsImF1ZCI6IjI1aXJybGhvbWJlM2NkZjhmZzUwOWF0M3JjIiwiZXZlbnRfaWQiOiI0ZGRmNGVlYi1mZjExLTQ3NmEtYTgzZi03MjY4Y2VjZDJmN2EiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTcwMjY2MzMxNiwiY3VzdG9tOmJsY19vbGRfaWQiOiI1ZGVmOWNjYy03ZDU5LTExZWUtOGUwNC01MDZiOGQ1MzY1NDgiLCJjdXN0b206YmxjX29sZF91dWlkIjoiNWRlZjljY2MtN2Q1OS0xMWVlLThlMDQtNTA2YjhkNTM2NTQ4IiwicGhvbmVfbnVtYmVyIjoiKzQ0MTIzNDU2Nzc5OSIsImV4cCI6MTcwMjY2NjkxNiwiaWF0IjoxNzAyNjYzMzE2LCJqdGkiOiJkYmRkMzIwZS1hMGZmLTRjN2MtYWYwOS02N2Q1NWUwZWE1OTgiLCJlbWFpbCI6InNhaGlsYWxhcmFjdUBibHVlbGlnaHRjYXJkLmNvLnVrIn0.rd93tek3LqvpqhGWdjp3JA4Z1ztwEqZLQPndSPC04mzQLTXIxSlNO2oq3YMuw7HzoApXHUCHMcetPy0hTZXynTStuFDqm3S-2XI8H1tGYukr9xodJeDQDito_cyEufNPTx7EDawfHzceaEnHgMCzVx-fAKDLAocZpbMB8XCh0U91gJGYXUXcTZSIE1RmTb0p8wgAzNyMb6XPbiRX72qQNkoBTIY4DRGaM5M8gYx4bgbxtmzeHU-7h9Sz7lccQRkFLvRm-AdZLi7ACqXvmk39XAfzNtqJ9jPjE45ghKQRzVR8BC5qHawqWQLdYbUrSxRnF4JO2vDPo3fL0MzNd6vKWQ';

    const testResponse: CognitoJwtPayload = {
      sub: 'test_principal_id',
      iss: 'https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_YQNcmfl2l',
      token_use: 'id',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: 1,
      auth_time: 10009456456,
      jti: 'jti',
      origin_jti: 'origin_jti',
    };

    const cognitoJwtCreateSpy = jest.spyOn(CognitoJwtVerifier, 'create');
    const cognitoJwtVerifierSpy = jest
      .spyOn(CognitoJwtVerifier.prototype, 'verify')
      .mockReturnValueOnce(Promise.resolve(testResponse));

    const event = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };

    // Act
    const result = await handler(event);

    // Assert
    expect(cognitoJwtCreateSpy).toHaveBeenCalled();
    expect(cognitoJwtVerifierSpy).toHaveBeenCalled();
    expect(result).toEqual({
      principalId: 'test_principal_id',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: undefined,
          },
        ],
      },
    });
  });

  it('should return the expected response for valid auth0 authToken', async () => {
    const policyDocument: PolicyDocument = {
      Version: '2012-10-17',
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: 'Allow',
        Resource: 'resource',
      }]
    }
    const auth0Sub = 'auth0|some-id';
    const apiGatewayEvent = buildApiGatewayEventWithToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdXRoMHwxMjM0NTY3ODkwIiwiaXNzIjoiaHR0cHM6Ly9zdGFnaW5nLWFjY2Vzcy5ibGNzaGluZS5pby8iLCJpYXQiOjE1MTYyMzkwMjJ9.bi__Pz99X-8YBda1zgqqx3GeJPM6G8f2Kf-brtrz70E');
    auth0TokenVerificationMock.mockResolvedValue({
      principalId: auth0Sub,
      policyDocument
    });

    const result = await handler(apiGatewayEvent);

    expect(result).toEqual({
      principalId: auth0Sub,
      policyDocument: {
        Version: policyDocument.Version,
        Statement: policyDocument.Statement,
      },
    });
    expect(auth0TokenVerificationMock).toHaveBeenCalledWith(apiGatewayEvent, auth0Issuer)
  });

  it('should return the expected response for valid auth0 authToken for extra issuer', async () => {
    const policyDocument: PolicyDocument = {
      Version: '2012-10-17',
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: 'Allow',
        Resource: 'resource',
      }]
    }
    const auth0Sub = 'auth0|some-id';
    const apiGatewayEvent = buildApiGatewayEventWithToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdXRoMHwxMjM0NTY3ODkwIiwiaXNzIjoiaHR0cHM6Ly9zdGFnaW5nLWFjY2Vzcy1kZHMuYmxjc2hpbmUuaW8vIiwiaWF0IjoxNTE2MjM5MDIyfQ.SKTemhLdCgY7TUcPtzzsH8hwvTCzodvmb9vN-Vu5LP8');
    auth0TokenVerificationMock.mockResolvedValue({
      principalId: auth0Sub,
      policyDocument
    });

    const result = await handler(apiGatewayEvent);

    expect(result).toEqual({
      principalId: auth0Sub,
      policyDocument: {
        Version: policyDocument.Version,
        Statement: policyDocument.Statement,
      },
    });
    expect(auth0TokenVerificationMock).toHaveBeenCalledWith(apiGatewayEvent, auth0ExtraIssuer)
  });

  it('should return the expected response for valid auth0 authToken for test issuer', async () => {
    const policyDocument: PolicyDocument = {
      Version: '2012-10-17',
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: 'Allow',
        Resource: 'resource',
      }]
    }
    const auth0Sub = 'auth0|some-id';
    const apiGatewayEvent = buildApiGatewayEventWithToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdXRoMHwxMjM0NTY3ODkwIiwiaXNzIjoiaHR0cHM6Ly9ibGMtdWstc3RhZ2luZy51ay5hdXRoMC5jb20vIiwiaWF0IjoxNTE2MjM5MDIyfQ.2IZ1YMt6Hel9K8W9LOg4bXzo6a9a1Rk7NhF_cwOutE8');
    auth0TokenVerificationMock.mockResolvedValue({
      principalId: auth0Sub,
      policyDocument
    });

    const result = await handler(apiGatewayEvent);

    expect(result).toEqual({
      principalId: auth0Sub,
      policyDocument: {
        Version: policyDocument.Version,
        Statement: policyDocument.Statement,
      },
    });
    expect(auth0TokenVerificationMock).toHaveBeenCalledWith(apiGatewayEvent, auth0TestIssuer)
  });

  const buildApiGatewayEventWithToken = (token: string) => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
});

describe('getAuthenticationToken', () => {
  it('should return the authentication token without the Bearer prefix', () => {
    const event = {
      headers: {
        Authorization: 'Bearer your-token',
      },
    };

    const result = getAuthenticationToken(event);

    expect(result).toBe('your-token');
  });

  it('should return the authentication token as is when it does not contain the Bearer prefix', () => {
    const event = {
      headers: {
        Authorization: 'your-token',
      },
    };

    const result = getAuthenticationToken(event);

    expect(result).toBe('your-token');
  });

  it('should return an empty string when the Authorization header is not present', () => {
    const event = {
      headers: {},
    };

    const result = getAuthenticationToken(event);

    expect(result).toBe('');
  });
});
