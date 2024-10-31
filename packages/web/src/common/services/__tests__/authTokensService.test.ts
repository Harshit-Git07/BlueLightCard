import AuthTokensService from '@/root/src/common/services/authTokensService';
import { AuthState } from '@/context/Auth/AuthContext';
import { nowInSecondsSinceEpoch } from '@/utils/dates';

jest.mock('@/utils/dates', () => ({
  nowInSecondsSinceEpoch: jest.fn(),
}));

describe('AuthTokensService', () => {
  const mockAuthState: AuthState = {
    idToken: 'mockIdToken',
    accessToken: 'mockAccessToken',
    refreshToken: 'mockRefreshToken',
    username: 'mockUsername',
  };

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('authTokensPresent', () => {
    test('should return true if all tokens are present', () => {
      AuthTokensService.setTokens(mockAuthState);

      expect(AuthTokensService.authTokensPresent()).toBeTruthy();
    });

    test('should return false if any token is missing', () => {
      AuthTokensService.setTokens({
        ...mockAuthState,
        accessToken: '',
      });

      expect(AuthTokensService.authTokensPresent()).toBeFalsy();
    });
  });

  describe('setTokens', () => {
    test('should stores tokens in localStorage', () => {
      AuthTokensService.setTokens(mockAuthState);

      expect(localStorage.getItem('idToken')).toBe('mockIdToken');
      expect(localStorage.getItem('accessToken')).toBe('mockAccessToken');
      expect(localStorage.getItem('refreshToken')).toBe('mockRefreshToken');
      expect(localStorage.getItem('username')).toBe('mockUsername');
    });
  });

  describe('clearTokens', () => {
    test('should remove tokens from localStorage', () => {
      AuthTokensService.setTokens(mockAuthState);
      AuthTokensService.clearTokens();

      expect(localStorage.getItem('idToken')).toBeNull();
      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
      expect(localStorage.getItem('username')).toBeNull();
    });
  });

  describe('getIdToken, getAccessToken, getRefreshToken, and getUsername', () => {
    beforeEach(() => {
      AuthTokensService.setTokens(mockAuthState);
    });

    test('should retrieve the id token from localStorage', () => {
      expect(AuthTokensService.getIdToken()).toBe('mockIdToken');
    });

    test('should retrieve the access token from localStorage', () => {
      expect(AuthTokensService.getAccessToken()).toBe('mockAccessToken');
    });

    test('should retrieve the refresh token from localStorage', () => {
      expect(AuthTokensService.getRefreshToken()).toBe('mockRefreshToken');
    });

    test('should retrieve the username from localStorage', () => {
      expect(AuthTokensService.getUsername()).toBe('mockUsername');
    });
  });

  describe('expiryTimeHasPassed', () => {
    const currentTime = 1000;
    const leeway = 5;

    beforeEach(() => {
      (nowInSecondsSinceEpoch as jest.Mock).mockReturnValue(currentTime);
    });

    test('should return true when the token has expired considering the leeway', () => {
      const tokenExpiry = currentTime + leeway - 1;

      expect(AuthTokensService.expiryTimeHasPassed(tokenExpiry)).toBe(true);
    });

    test('should return false when the token is still valid considering the leeway', () => {
      const tokenExpiry = currentTime + leeway + 1;

      expect(AuthTokensService.expiryTimeHasPassed(tokenExpiry)).toBe(false);
    });
  });
});
