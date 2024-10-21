import {
  AUTH0_LOGIN_URL,
  AUTH0_LOGOUT_URL,
  COGNITO_LOGIN_URL,
  COGNITO_LOGOUT_URL,
} from '@/global-vars';

export interface AuthProviderFlags {
  isAuth0LoginLogoutWebEnabled: boolean;
  isCognitoUIEnabled: boolean;
}

export function getLogoutUrl(
  authProviderFlags: AuthProviderFlags,
  defaultUrl: string = '/logout.php'
): string {
  if (authProviderFlags.isAuth0LoginLogoutWebEnabled) {
    return AUTH0_LOGOUT_URL;
  } else if (authProviderFlags.isCognitoUIEnabled) {
    return COGNITO_LOGOUT_URL;
  } else {
    return defaultUrl;
  }
}

export function getLoginUrl(
  authProviderFlags: AuthProviderFlags,
  defaultUrl: string = '/login.php'
): string {
  if (authProviderFlags.isAuth0LoginLogoutWebEnabled) {
    return AUTH0_LOGIN_URL;
  } else if (authProviderFlags.isCognitoUIEnabled) {
    return COGNITO_LOGIN_URL;
  } else {
    return defaultUrl;
  }
}
