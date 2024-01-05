import { getAuthenticationToken, handler } from '../customAuthenticatorLambdaHandler';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { CognitoJwtPayload } from 'aws-jwt-verify/jwt-model';

process.env.USER_POOL_ID = "eu-west-2_E8RFhXXZY";
process.env.USER_POOL_ID_DDS = "eu-west-2_YQNcmfl2l";

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

  it('should return the expected response for valid authToken', async () => {
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
