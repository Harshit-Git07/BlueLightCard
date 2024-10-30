import { COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET } from '@/global-vars';
import AuthTokensService from '@/root/src/common/services/authTokensService';
import { reAuthFromRefreshToken } from '@/utils/reAuthFromRefreshToken';
import { secretHash } from '@/utils/secret_hash';
import {
  InitiateAuthCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';

jest.mock('@/global-vars', () => ({
  COGNITO_CLIENT_ID: 'mockClientId',
  COGNITO_CLIENT_REGION: 'mockRegion',
  COGNITO_CLIENT_SECRET: 'mockClientSecret',
}));

jest.mock('@/utils/secret_hash', () => ({
  secretHash: jest.fn(() => 'mockSecretHash'),
}));

jest.mock('@/root/src/common/services/authTokensService', () => ({
  clearTokens: jest.fn(),
}));

describe('reAuthFromRefreshToken', () => {
  const username = 'mockUsername';
  const refreshToken = 'mockRefreshToken';
  const updateAuthTokens = jest.fn();
  const cognitoSendMock = jest.fn().mockResolvedValue({
    AuthenticationResult: {
      IdToken: 'mockIdToken',
      AccessToken: 'mockAccessToken',
    },
  });
  CognitoIdentityProviderClient.prototype.send = cognitoSendMock;

  beforeEach(() => {
    updateAuthTokens.mockClear();
    (AuthTokensService.clearTokens as jest.Mock).mockClear();
  });

  test('should update tokens on successful response', async () => {
    const result = await reAuthFromRefreshToken(username, refreshToken, updateAuthTokens);

    expect(result).toBeTruthy();
    expect(secretHash).toHaveBeenCalledWith(username, COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET);
    expect(cognitoSendMock).toHaveBeenCalledWith(expect.any(InitiateAuthCommand));
    expect(updateAuthTokens).toHaveBeenCalledWith({
      idToken: 'mockIdToken',
      accessToken: 'mockAccessToken',
      refreshToken,
      username,
    });
  });

  test('should clear tokens and return false on error', async () => {
    cognitoSendMock.mockRejectedValue(new Error('Cognito error'));

    const result = await reAuthFromRefreshToken(username, refreshToken, updateAuthTokens);

    expect(result).toBeFalsy();
    expect(AuthTokensService.clearTokens).toHaveBeenCalled();
    expect(updateAuthTokens).not.toHaveBeenCalled();
  });

  test('should handle missing tokens in response gracefully', async () => {
    cognitoSendMock.mockResolvedValue({});

    const result = await reAuthFromRefreshToken(username, refreshToken, updateAuthTokens);

    expect(result).toBeTruthy();
    expect(updateAuthTokens).toHaveBeenCalledWith({
      idToken: '',
      accessToken: '',
      refreshToken,
      username,
    });
  });
});
