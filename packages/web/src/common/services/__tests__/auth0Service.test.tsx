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
});
