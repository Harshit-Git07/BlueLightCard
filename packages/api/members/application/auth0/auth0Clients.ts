import { AuthenticationClient, ManagementClient } from 'auth0';
import { fetchWithRetry } from '@blc-mono/members/application/auth0/utils/fetchWithRetry';

export const passwordValidationClient = new AuthenticationClient({
  domain: process.env.SERVICE_LAYER_AUTH0_DOMAIN as string,
  clientId: process.env.SERVICE_LAYER_AUTH0_PASSWORD_VALIDATION_CLIENT_ID as string,
  clientSecret: process.env.SERVICE_LAYER_AUTH0_PASSWORD_VALIDATION_CLIENT_SECRET,
  idTokenSigningAlg: 'HS256', // required if authenticating through client secret
  fetch: fetchWithRetry,
});

export const managementApiClient = (
  clientId: string = process.env.SERVICE_LAYER_AUTH0_API_CLIENT_ID as string,
  clientSecret: string = process.env.SERVICE_LAYER_AUTH0_API_CLIENT_SECRET as string,
) =>
  new ManagementClient({
    domain: process.env.SERVICE_LAYER_AUTH0_DOMAIN as string,
    clientId,
    clientSecret,
    fetch: fetchWithRetry,
  });
