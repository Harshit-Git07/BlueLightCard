import AuthTokensService from '@/root/src/common/services/authTokensService';
import axios from 'axios';
import { Auth0Service } from '@/root/src/common/services/auth0Service';
import { unpackJWT } from '@core/utils/unpackJWT';

jest.mock('axios');
jest.mock('@/root/src/common/services/authTokensService');
jest.mock('@core/utils/unpackJWT');

describe('Auth0Service', () => {
  const mockAxios = axios as jest.Mocked<typeof axios>;
  const mockAuthTokensService = AuthTokensService as jest.Mocked<typeof AuthTokensService>;
  const mockUnpackJWT = unpackJWT as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTokensUsingCode', () => {
    const mockCode = 'mock-code';
    const mockTokenResponse = {
      data: {
        id_token: 'mockIdToken',
        access_token: 'mockAccessToken',
        refresh_token: 'mockRefreshToken',
      },
    };

    it('should successfully fetch tokens and set them in AuthTokensService', async () => {
      mockAxios.post.mockResolvedValueOnce(mockTokenResponse);
      mockUnpackJWT.mockReturnValue({ sub: 'mockSub' });

      const result = await Auth0Service.getTokensUsingCode(mockCode);

      expect(result).toBe(true);
      expect(mockAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          grant_type: 'authorization_code',
          client_id: Auth0Service.config.clientId,
          client_secret: Auth0Service.config.clientSecret,
          redirect_uri: Auth0Service.config.redirectUrl,
          code: mockCode,
        })
      );
      expect(mockUnpackJWT).toHaveBeenCalledWith('mockIdToken');
      expect(mockAuthTokensService.setTokens).toHaveBeenCalledWith(
        'mockIdToken',
        'mockAccessToken',
        'mockRefreshToken',
        'mockSub'
      );
    });

    it('should return false and log error if request fails', async () => {
      const error = new Error('Request failed');
      console.error = jest.fn();
      mockAxios.post.mockRejectedValueOnce(error);

      const result = await Auth0Service.getTokensUsingCode(mockCode);

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith('Failed to retrieve tokens:', error);
      expect(mockAuthTokensService.setTokens).not.toHaveBeenCalled();
    });
  });

  describe('updateTokensUsingRefreshToken', () => {
    const mockRefreshToken = 'mock-refresh-token';
    const mockTokenResponse = {
      data: {
        id_token: 'mockIdToken',
        access_token: 'mockAccessToken',
        refresh_token: 'mockRefreshToken',
      },
    };

    it('should update tokens using refresh token and set them in AuthTokensService', async () => {
      mockAxios.post.mockResolvedValueOnce(mockTokenResponse);
      mockUnpackJWT.mockReturnValue({ sub: 'mockSub' });

      const result = await Auth0Service.updateTokensUsingRefreshToken(mockRefreshToken);

      expect(result).toBe(true);
      expect(mockAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          grant_type: 'refresh_token',
          client_id: Auth0Service.config.clientId,
          client_secret: Auth0Service.config.clientSecret,
          refresh_token: mockRefreshToken,
        })
      );
      expect(mockUnpackJWT).toHaveBeenCalledWith('mockIdToken');
      expect(mockAuthTokensService.setTokens).toHaveBeenCalledWith(
        'mockIdToken',
        'mockAccessToken',
        'mockRefreshToken',
        'mockSub'
      );
    });

    it('should return false and clear tokens if request fails', async () => {
      mockAxios.post.mockRejectedValueOnce(new Error('Request failed'));

      const result = await Auth0Service.updateTokensUsingRefreshToken(mockRefreshToken);

      expect(result).toBe(false);
      expect(mockAuthTokensService.clearTokens).toHaveBeenCalled();
    });
  });
});
