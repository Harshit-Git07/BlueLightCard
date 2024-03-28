export default class AuthTokensService {
  public static authTokensPresent() {
    return (
      AuthTokensService.getIdToken() &&
      AuthTokensService.getAccessToken() &&
      AuthTokensService.getRefreshToken() &&
      AuthTokensService.getUsername()
    );
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
}
