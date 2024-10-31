import { AuthState } from '@/context/Auth/AuthContext';
import { nowInSecondsSinceEpoch } from '@/utils/dates';

const TOKEN_EXPIRY_LEEWAY_IN_SECONDS = 5;

export default class AuthTokensService {
  public static authTokensPresent() {
    return Boolean(
      AuthTokensService.getIdToken() &&
        AuthTokensService.getAccessToken() &&
        AuthTokensService.getRefreshToken() &&
        AuthTokensService.getUsername()
    );
  }

  public static setTokens({ idToken, accessToken, refreshToken, username }: AuthState) {
    localStorage.setItem('idToken', idToken);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('username', username);
  }

  public static clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    localStorage.removeItem('idToken');
  }

  public static getIdToken() {
    return localStorage.getItem('idToken') as string;
  }

  public static getAccessToken(): string {
    return localStorage.getItem('accessToken') as string;
  }

  public static getRefreshToken(): string {
    return localStorage.getItem('refreshToken') as string;
  }

  public static getUsername(): string {
    return localStorage.getItem('username') as string;
  }

  public static expiryTimeHasPassed(tokenExpiryInSecondsSinceEpoch: number): boolean {
    return (
      nowInSecondsSinceEpoch() >= tokenExpiryInSecondsSinceEpoch - TOKEN_EXPIRY_LEEWAY_IN_SECONDS
    );
  }
}
