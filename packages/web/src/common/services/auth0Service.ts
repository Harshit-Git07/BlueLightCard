import {
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_REDIRECT_URL,
} from '@/root/global-vars';
import AuthTokensService from '@/root/src/common/services/authTokensService';
import { unpackJWT } from '@core/utils/unpackJWT';
import axios from 'axios';
import { AuthState } from '@/context/Auth/AuthContext';

interface TokenResponse {
  access_token: string;
  id_token: string;
  scope: string;
  expires_in: number;
  token_type: string;
  refresh_token: string;
}

interface Auth0Config {
  issuer: string;
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
}

export class Auth0Service {
  private static readonly _config: Auth0Config = {
    issuer: `https://${AUTH0_DOMAIN}/`,
    tokenUrl: `https://${AUTH0_DOMAIN}/oauth/token`,
    clientId: AUTH0_CLIENT_ID,
    clientSecret: AUTH0_CLIENT_SECRET,
    redirectUrl: AUTH0_REDIRECT_URL,
  };

  public static get config() {
    return this._config;
  }

  public static async getTokensUsingCode(
    code: string,
    updateAuthTokens: (tokens: AuthState) => void
  ): Promise<boolean> {
    try {
      const {
        data: { id_token, access_token, refresh_token },
      } = await axios.post<TokenResponse>(this.config.tokenUrl, {
        grant_type: 'authorization_code',
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        redirect_uri: this.config.redirectUrl,
        code,
      });
      const { sub } = unpackJWT(id_token);
      updateAuthTokens({
        accessToken: access_token,
        idToken: id_token,
        refreshToken: refresh_token,
        username: sub,
      });
      return true;
    } catch (error) {
      console.error('Failed to retrieve tokens:', error);
      return false;
    }
  }

  public static async updateTokensUsingRefreshToken(
    refreshToken: string,
    updateAuthTokens: (tokens: AuthState) => void
  ): Promise<boolean> {
    try {
      const {
        data: { id_token, access_token, refresh_token },
      } = await axios.post<TokenResponse>(this.config.tokenUrl, {
        grant_type: 'refresh_token',
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        refresh_token: refreshToken,
      });
      const { sub } = unpackJWT(id_token);
      updateAuthTokens({
        accessToken: access_token,
        idToken: id_token,
        refreshToken: refresh_token,
        username: sub,
      });
    } catch (error) {
      AuthTokensService.clearTokens();
      return false;
    }
    return true;
  }

  public static isAuth0Issuer(issuer: string): boolean {
    return issuer === this.config.issuer;
  }
}
